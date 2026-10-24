import { BookInfo, findBook } from "./books";
import { t } from "./i18n";

export interface VerseRange {
	start: number;
	end: number;
}

export interface BibleReference {
	book: BookInfo;
	chapter: number;
	/** Empty means the whole chapter. */
	ranges: VerseRange[];
}

export class RefParseError extends Error {}

/**
 * Parses references such as:
 *   요 3:16 · 요3:16-18 · 요한복음 3장 16절 · 고전 13:4-7 · 시 23 · 롬 8:28, 31-39
 *   John 3:16 · Jn 3.16 · 1 Cor 13:4-7 · Ps 23 · Rom 8:28,31-39
 *   约翰福音 3:16 · 约3:16 · 約翰福音3章16節 · ヨハネによる福音書3:16 · ヨハ3:16
 */
export function parseReference(input: string): BibleReference {
	let s = input
		.trim()
		.replace(/[：]/g, ":")
		.replace(/[~～–—]/g, "-")
		.replace(/[，、]/g, ",")
		.replace(/(\d)\s*[장편章篇]\s*/g, "$1:")
		.replace(/\s*[절節节]/g, "")
		.replace(/:\s*$/, "");

	const m = s.match(/^([1-3]?\s*[^\d\s:,-][^\d:]*?)\s*(\d+)\s*(?:[:.]\s*([\d\s,-]+))?$/);
	if (!m) throw new RefParseError(t.errFormat);

	const book = findBook(m[1]);
	if (!book) throw new RefParseError(t.errBook(m[1].trim()));

	const chapter = parseInt(m[2], 10);
	if (!chapter) throw new RefParseError(t.errChapter);

	const ranges: VerseRange[] = [];
	if (m[3]) {
		for (const part of m[3].split(",")) {
			const p = part.trim();
			if (!p) continue;
			const r = p.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
			if (!r) throw new RefParseError(t.errVerse(p));
			const start = parseInt(r[1], 10);
			const end = r[2] ? parseInt(r[2], 10) : start;
			if (!start || end < start) throw new RefParseError(t.errRange(p));
			ranges.push({ start, end });
		}
	}
	return { book, chapter, ranges };
}

export function versesLabel(ranges: VerseRange[]): string {
	return ranges.map((r) => (r.start === r.end ? `${r.start}` : `${r.start}-${r.end}`)).join(", ");
}

export function inRanges(verse: number, ranges: VerseRange[]): boolean {
	if (ranges.length === 0) return true;
	return ranges.some((r) => verse >= r.start && verse <= r.end);
}
