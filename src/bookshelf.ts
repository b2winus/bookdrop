import { getLang } from "./i18n";
import { PROP, ReadingStatus, StatusLabels, statusLabel } from "./reading";

/**
 * Builds an Obsidian Bases file (.base, Obsidian 1.9+) that shows book notes as a bookshelf:
 * a cover gallery plus views for reading, finished, this year, and to-read.
 * Book notes are those tagged #book or stored in the book folder.
 */

const VIEW_NAMES = {
	ko: { all: "전체", reading: "읽는 중", thisYear: "올해 읽은 책", finished: "다 읽은 책", toRead: "읽을 책" },
	en: { all: "All books", reading: "Reading", thisYear: "Read this year", finished: "Finished", toRead: "To read" },
};

/** A YAML single-quoted scalar. */
function yamlQuote(s: string): string {
	return `'${s.replace(/'/g, "''")}'`;
}

/** A Bases expression comparing the status property to a label. */
function statusIs(labels: StatusLabels, status: ReadingStatus): string {
	return yamlQuote(`${PROP.status} == ${JSON.stringify(statusLabel(labels, status))}`);
}

export function bookshelfBase(folder: string, labels: StatusLabels): string {
	const names = VIEW_NAMES[getLang()];
	const scope = [`    - file.hasTag("book")`];
	if (folder.trim()) scope.push(`    - file.inFolder(${JSON.stringify(folder.trim())})`);

	const cards = (name: string, order: string[], filters: string[]) =>
		[
			`  - type: cards`,
			`    name: ${yamlQuote(name)}`,
			...(filters.length ? [`    filters:`, `      and:`, ...filters.map((f) => `        - ${f}`)] : []),
			`    order:`,
			...order.map((o) => `      - ${o}`),
			`    image: note.cover`,
			`    imageFit: contain`,
			`    imageAspectRatio: 1.5`,
		].join("\n");

	const table = (name: string, order: string[], filters: string[]) =>
		[
			`  - type: table`,
			`    name: ${yamlQuote(name)}`,
			...(filters.length ? [`    filters:`, `      and:`, ...filters.map((f) => `        - ${f}`)] : []),
			`    order:`,
			...order.map((o) => `      - ${o}`),
		].join("\n");

	return [
		`filters:`,
		`  or:`,
		...scope,
		`views:`,
		cards(names.all, ["file.name", "author", PROP.status, PROP.stars], []),
		cards(names.reading, ["file.name", "author", PROP.progress, PROP.pages, PROP.started], [statusIs(labels, "reading")]),
		cards(names.thisYear, ["file.name", "author", PROP.finished, PROP.stars], [
			statusIs(labels, "finished"),
			yamlQuote(`date(${PROP.finished}).year == today().year`),
		]),
		table(names.finished, ["file.name", "author", "publisher", PROP.started, PROP.finished, PROP.stars], [statusIs(labels, "finished")]),
		table(names.toRead, ["file.name", "author", "publisher", PROP.pages], [statusIs(labels, "toRead")]),
		"",
	].join("\n");
}
