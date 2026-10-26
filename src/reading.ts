import { App, TFile } from "obsidian";
import { getLang } from "./i18n";

/**
 * Reading log: status, dates, rating, progress and quotes, stored in the book note's frontmatter
 * (status, started, finished, rating, progress) and a quotes section in the body.
 */

export type ReadingStatus = "toRead" | "reading" | "finished" | "stopped";
export const STATUSES: ReadingStatus[] = ["toRead", "reading", "finished", "stopped"];

/** Frontmatter keys used by the reading log (and by the bookshelf view). */
export const PROP = {
	status: "status",
	started: "started",
	finished: "finished",
	rating: "rating",
	progress: "progress",
	pages: "pages",
} as const;

const DEFAULT_LABELS: Record<"ko" | "en", Record<ReadingStatus, string>> = {
	ko: { toRead: "읽기 전", reading: "읽는 중", finished: "다 읽음", stopped: "중단" },
	en: { toRead: "to read", reading: "reading", finished: "finished", stopped: "stopped" },
};

/** User-chosen status words; empty means the default for the interface language. */
export interface StatusLabels {
	statusToRead: string;
	statusReading: string;
	statusFinished: string;
	statusStopped: string;
}

const LABEL_KEY: Record<ReadingStatus, keyof StatusLabels> = {
	toRead: "statusToRead",
	reading: "statusReading",
	finished: "statusFinished",
	stopped: "statusStopped",
};

export function defaultStatusLabel(status: ReadingStatus): string {
	return DEFAULT_LABELS[getLang()][status];
}

export function statusLabel(labels: StatusLabels, status: ReadingStatus): string {
	return labels[LABEL_KEY[status]].trim() || defaultStatusLabel(status);
}

/** Which status a frontmatter value means: the user's words, or either language's defaults. */
export function parseStatus(labels: StatusLabels, value: unknown): ReadingStatus | null {
	if (typeof value !== "string") return null;
	const v = value.trim().toLowerCase();
	if (!v) return null;
	for (const st of STATUSES) {
		const candidates = [statusLabel(labels, st), DEFAULT_LABELS.ko[st], DEFAULT_LABELS.en[st]];
		if (candidates.some((c) => c.toLowerCase() === v)) return st;
	}
	return null;
}

export function todayString(): string {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toNumber(v: unknown): number | null {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string" && /^\s*\d+\s*$/.test(v)) return Number(v);
	return null;
}

function isBlank(v: unknown): boolean {
	return v === null || v === undefined || v === "";
}

type Frontmatter = Record<string, unknown>;

/**
 * Applies a status change to frontmatter.
 * - reading: sets `started` to today if it's empty
 * - finished: sets `finished` to today, fills `started` if empty, and sets progress to the page count
 */
export function applyStatus(fm: Frontmatter, labels: StatusLabels, status: ReadingStatus, today = todayString()): void {
	fm[PROP.status] = statusLabel(labels, status);
	if (status === "reading" && isBlank(fm[PROP.started])) fm[PROP.started] = today;
	if (status === "finished") {
		if (isBlank(fm[PROP.started])) fm[PROP.started] = today;
		fm[PROP.finished] = today;
		const pages = toNumber(fm[PROP.pages]);
		if (pages) fm[PROP.progress] = pages;
	}
}

/**
 * Records the page reached. A book still marked "to read" becomes "reading";
 * reaching the last page marks it finished. Returns the resulting status.
 */
export function applyProgress(fm: Frontmatter, labels: StatusLabels, page: number, today = todayString()): ReadingStatus | null {
	fm[PROP.progress] = page;
	const pages = toNumber(fm[PROP.pages]);
	const current = parseStatus(labels, fm[PROP.status]);
	if (pages && page >= pages) {
		applyStatus(fm, labels, "finished", today);
		return "finished";
	}
	if (current === null || current === "toRead") {
		applyStatus(fm, labels, "reading", today);
		return "reading";
	}
	return current;
}

export function applyRating(fm: Frontmatter, rating: number | null): void {
	if (rating === null) delete fm[PROP.rating];
	else fm[PROP.rating] = Math.min(5, Math.max(1, Math.round(rating * 2) / 2));
}

export function readStatus(app: App, file: TFile, labels: StatusLabels): ReadingStatus | null {
	return parseStatus(labels, app.metadataCache.getFileCache(file)?.frontmatter?.[PROP.status]);
}

export function readNumber(app: App, file: TFile, key: string): number | null {
	return toNumber(app.metadataCache.getFileCache(file)?.frontmatter?.[key]);
}

/** Star string for display, e.g. 4 → "★★★★☆", 3.5 → "★★★½☆". */
export function stars(rating: number): string {
	const full = Math.floor(rating);
	const half = rating - full >= 0.5;
	return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

/**
 * Adds a quote under the quotes heading (created at the end of the note if missing),
 * after any quotes already there and before the next heading of the same or higher level.
 */
export function insertQuote(content: string, heading: string, quote: string, page: string): string {
	const body = quote
		.trim()
		.split(/\r?\n/)
		.map((l) => `> ${l}`.trimEnd())
		.join("\n");
	const cite = page.trim() ? `\n> — p. ${page.trim()}` : "";
	const block = `${body}${cite}`;

	const lines = content.split("\n");
	const headingRe = new RegExp(`^(#{1,6})\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`);
	const start = lines.findIndex((l) => headingRe.test(l));
	if (start < 0) {
		const trimmed = content.replace(/\s+$/, "");
		return `${trimmed}${trimmed ? "\n\n" : ""}## ${heading}\n\n${block}\n`;
	}
	const level = (headingRe.exec(lines[start]) as RegExpExecArray)[1].length;
	let end = lines.length;
	for (let i = start + 1; i < lines.length; i++) {
		const m = /^(#{1,6})\s/.exec(lines[i]);
		if (m && m[1].length <= level) {
			end = i;
			break;
		}
	}
	// Last non-empty line of the section.
	let last = end - 1;
	while (last > start && lines[last].trim() === "") last--;
	const before = lines.slice(0, last + 1);
	const after = lines.slice(end);
	const insert = ["", ...block.split("\n"), ""];
	return [...before, ...insert, ...after].join("\n");
}
