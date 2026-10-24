import { App, normalizePath, requestUrl, TFile } from "obsidian";
import { BookInfo, findBook } from "./books";
import { AccordanceBridge } from "./accordance";
import { knownCitation } from "./citations";
import { t } from "./i18n";
import { BibleReference, inRanges } from "./reference";

export type Lang = "ko" | "en" | "zh" | "ja" | "grc" | "he";
export const LANGS: Lang[] = ["ko", "en", "zh", "ja", "grc", "he"];
export type SourceKind = "bolls" | "file" | "accordance" | "net" | "esv";

export interface Translation {
	id: string;
	/** Display name, e.g. 개역한글 */
	name: string;
	/** Short label used in headers, e.g. KRV */
	abbr: string;
	lang: Lang;
	source: SourceKind;
	/** bolls.life translation code (source = bolls) */
	code?: string;
	/** Vault path to a JSON file (source = file) */
	path?: string;
	/** Accordance module abbreviation, e.g. ESVS (source = accordance) */
	module?: string;
	/** Licensing note shown in settings */
	note?: string;
	/** Copyright notice added under quotations (custom translations; built-ins use `notice`) */
	citation?: string;
	builtIn?: boolean;
	/** Built-in: shown in the search window on first install */
	defaultOn?: boolean;
	/** Still under copyright — notice shown when citations are set to "copyrighted only" */
	copyrighted?: boolean;
	/** The licence requires a notice with every quotation, so it is shown even when citations are off */
	noticeRequired?: boolean;
	/** Built-in copyright notice */
	notice?: string;
	/** Link appended to the notice, and used for the abbreviation in headers when the licence asks for it */
	link?: string;
	/** Abbreviation must link to `link` (NET) */
	linkAbbr?: boolean;
	/** Only contains this testament (Greek NT, Hebrew OT …) */
	testament?: "OT" | "NT";
	/** Chinese script for book names */
	script?: "simplified" | "traditional";
}

export interface Verse {
	verse: number;
	text: string;
}

export const BUILT_IN_TRANSLATIONS: Translation[] = [
	// Korean
	{ id: "KRV", name: "개역한글", abbr: "개역한글", lang: "ko", source: "bolls", code: "KRV", note: "1961 · 저작권 보호기간 만료 / out of copyright", builtIn: true, defaultOn: true, notice: "성경전서 개역한글판, 대한성서공회" },
	{ id: "RNKSV", name: "새번역", abbr: "새번역", lang: "ko", source: "bolls", code: "RNKSV", note: "© 대한성서공회 · bolls.life 제공 — 기본 꺼짐 / off by default", builtIn: true, defaultOn: false, copyrighted: true, notice: "성경전서 새번역 © 대한성서공회" },
	// English — public domain or open licence, no key needed
	{ id: "KJV", name: "King James Version", abbr: "KJV", lang: "en", source: "bolls", code: "KJV", note: "Public domain", builtIn: true, defaultOn: true },
	{ id: "WEB", name: "World English Bible", abbr: "WEB", lang: "en", source: "bolls", code: "WEB", note: "Public domain · modern English", builtIn: true, defaultOn: true },
	{ id: "BSB", name: "Berean Standard Bible", abbr: "BSB", lang: "en", source: "bolls", code: "BSB", note: "Public domain (2023~) · modern English", builtIn: true, defaultOn: true },
	{
		id: "NET",
		name: "New English Translation",
		abbr: "NET",
		lang: "en",
		source: "net",
		note: "© Biblical Studies Press · free for non-commercial quotation, via the official NET Bible API",
		builtIn: true,
		defaultOn: true,
		copyrighted: true,
		noticeRequired: true,
		notice: "The Scriptures quoted are from the NET Bible®, copyright © 1996, 2019 used with permission from Biblical Studies Press, L.L.C. All rights reserved.",
		link: "https://netbible.org",
		linkAbbr: true,
	},
	{
		id: "ESV",
		name: "English Standard Version",
		abbr: "ESV",
		lang: "en",
		source: "esv",
		note: "© Crossway · needs your own free ESV API key (non-commercial)",
		builtIn: true,
		defaultOn: true,
		copyrighted: true,
		noticeRequired: true,
		notice: "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.",
		link: "https://www.esv.org",
	},
	{ id: "ASV", name: "American Standard Version", abbr: "ASV", lang: "en", source: "bolls", code: "ASV", note: "Public domain (1901)", builtIn: true, defaultOn: true },
	{ id: "YLT", name: "Young's Literal Translation", abbr: "YLT", lang: "en", source: "bolls", code: "YLT", note: "Public domain (1898)", builtIn: true, defaultOn: true },
	{ id: "LSV", name: "Literal Standard Version", abbr: "LSV", lang: "en", source: "bolls", code: "LSV", note: "CC BY-SA 4.0 · literal, modern English", builtIn: true, defaultOn: false, notice: "Literal Standard Version (LSV), CC BY-SA 4.0, Covenant Press" },
	{ id: "GNV", name: "Geneva Bible (1599)", abbr: "GNV", lang: "en", source: "bolls", code: "GNV", note: "Public domain", builtIn: true, defaultOn: false },
	{ id: "DRB", name: "Douay-Rheims Bible", abbr: "DRB", lang: "en", source: "bolls", code: "DRB", note: "Public domain · Catholic", builtIn: true, defaultOn: false },
	// Chinese
	{ id: "CUV", name: "和合本", abbr: "和合本", lang: "zh", script: "traditional", source: "bolls", code: "CUV", note: "Chinese Union Version 1919 · 繁體 · Public domain", builtIn: true, defaultOn: false },
	// Japanese
	{ id: "JPKJV", name: "口語訳", abbr: "口語訳", lang: "ja", source: "bolls", code: "JPKJV", note: "Japanese Colloquial 1954/55 · 日本では著作権保護期間満了", builtIn: true, defaultOn: false },
	// Greek
	{
		id: "SBLGNT",
		name: "SBL Greek New Testament",
		abbr: "SBLGNT",
		lang: "grc",
		testament: "NT",
		source: "bolls",
		code: "SBLGNT",
		note: "© 2010 SBL & Logos · free with attribution · NT",
		builtIn: true,
		defaultOn: false,
		copyrighted: true,
		noticeRequired: true,
		notice: "Scripture quotations marked SBLGNT are from the SBL Greek New Testament. Copyright © 2010 Society of Biblical Literature and Logos Bible Software.",
		link: "https://sblgnt.com",
	},
	{ id: "TR", name: "Textus Receptus (Elzevir 1624)", abbr: "TR", lang: "grc", testament: "NT", source: "bolls", code: "TR", note: "Public domain · NT", builtIn: true, defaultOn: false },
	{ id: "TISCH", name: "Tischendorf 8th ed.", abbr: "Tisch", lang: "grc", testament: "NT", source: "bolls", code: "TISCH", note: "Public domain (1869–72) · NT", builtIn: true, defaultOn: false },
	// Hebrew
	{ id: "WLC", name: "Westminster Leningrad Codex", abbr: "WLC", lang: "he", testament: "OT", source: "bolls", code: "WLC", note: "Public domain · vowels · OT", builtIn: true, defaultOn: false },
	{ id: "WLCa", name: "WLC (vowels + accents)", abbr: "WLC", lang: "he", testament: "OT", source: "bolls", code: "WLCa", note: "Public domain · vowels and cantillation · OT", builtIn: true, defaultOn: false },
	{ id: "DHNT", name: "Delitzsch Hebrew NT", abbr: "Delitzsch", lang: "he", testament: "NT", source: "bolls", code: "DHNT", note: "Public domain (1877) · NT", builtIn: true, defaultOn: false },
];

/** Whether the translation contains this book (Greek NT, Hebrew OT …). */
export function hasBook(tr: Translation, bookNum: number): boolean {
	if (tr.testament === "OT") return bookNum <= 39;
	if (tr.testament === "NT") return bookNum >= 40;
	return true;
}

/** Copyright notice for a translation: its own, a built-in one, or a known one matched by name. */
export function noticeFor(tr: Translation): { text: string; link?: string } | undefined {
	if (tr.citation?.trim()) return { text: tr.citation.trim() };
	if (tr.notice) return { text: tr.notice, link: tr.link };
	if (tr.builtIn) return undefined;
	const k = knownCitation(tr.name, tr.abbr, tr.module, tr.code);
	return k ? { text: k.text, link: k.link } : undefined;
}

/** Treat custom translations with a (known or entered) notice as copyrighted. */
export function isCopyrighted(tr: Translation): boolean {
	if (tr.builtIn) return !!tr.copyrighted;
	return !!noticeFor(tr);
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/** Strips Strong's numbers, footnotes, section headings and HTML from verse text. */
export function cleanText(raw: string): string {
	return raw
		.replace(/<S>[^<]*<\/S>/gi, "")
		.replace(/<sup>[\s\S]*?<\/sup>/gi, "")
		.replace(/<br\s*\/?>/gi, " ")
		.replace(/<[^>]*>/g, "")
		.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
			if (e[0] === "#") {
				const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
				return Number.isFinite(code) ? String.fromCodePoint(code) : m;
			}
			return ENTITIES[e.toLowerCase()] ?? m;
		})
		.replace(/\s+/g, " ")
		.replace(/\s+([,.;:!?])/g, "$1")
		.trim();
}

type ChapterMap = Map<string, Verse[]>; // key: `${book}:${chapter}`

/** Builds a chapter map from any of the supported local JSON layouts. */
export function indexLocalBible(data: unknown): ChapterMap {
	const map: ChapterMap = new Map();
	const add = (book: number, chapter: number, verse: number, text: unknown) => {
		if (!book || !chapter || !verse || typeof text !== "string") return;
		const key = `${book}:${chapter}`;
		let arr = map.get(key);
		if (!arr) map.set(key, (arr = []));
		arr.push({ verse, text: cleanText(text) });
	};
	const bookNum = (k: string): number => (/^\d+$/.test(k) ? parseInt(k, 10) : findBook(k)?.num ?? 0);

	if (Array.isArray(data)) {
		// Layout A — bolls.life dump: [{ book, chapter, verse, text }, ...]
		for (const row of data as Record<string, unknown>[]) {
			add(Number(row.book), Number(row.chapter), Number(row.verse), row.text);
		}
	} else if (data && typeof data === "object") {
		const entries = Object.entries(data as Record<string, unknown>);
		if (entries.length && typeof entries[0][1] === "string") {
			// Layout C — flat keys: { "창1:1": "...", "Gen 1:1": "..." }
			for (const [k, v] of entries) {
				const m = k.trim().match(/^(.+?)\s*(\d+)\s*:\s*(\d+)$/);
				if (m) add(bookNum(m[1].trim()), parseInt(m[2], 10), parseInt(m[3], 10), v);
			}
		} else {
			// Layout B — nested: { "1" | "창세기": { "1": { "1": "..." } } }
			for (const [bk, chapters] of entries) {
				if (!chapters || typeof chapters !== "object") continue;
				for (const [ck, verses] of Object.entries(chapters as Record<string, unknown>)) {
					if (!verses || typeof verses !== "object") continue;
					for (const [vk, text] of Object.entries(verses as Record<string, unknown>)) {
						add(bookNum(bk), parseInt(ck, 10), parseInt(vk, 10), text);
					}
				}
			}
		}
	}
	for (const arr of map.values()) arr.sort((a, b) => a.verse - b.verse);
	return map;
}

/** English book name as Accordance / NET / ESV expect it. */
export function apiBookName(book: BookInfo): string {
	return book.num === 22 ? "Song of Solomon" : book.en;
}

/** Parses ESV API plain text ("[16] For God so loved … [17] For God did not …") into verses. */
export function parseEsvText(passages: string[]): Verse[] {
	const out: Verse[] = [];
	for (const p of passages) {
		const parts = p.split(/\[(\d+)\]/);
		for (let i = 1; i < parts.length; i += 2) {
			const verse = parseInt(parts[i], 10);
			const text = cleanText(parts[i + 1] ?? "").replace(/\s*\(ESV\)\s*$/, "");
			if (verse && text) out.push({ verse, text });
		}
	}
	return out;
}

/** Parses the NET Bible API JSON ([{ bookname, chapter, verse, text }]) for one chapter. */
export function parseNetJson(rows: unknown, chapter: number): Verse[] {
	if (!Array.isArray(rows)) return [];
	return (rows as Record<string, unknown>[])
		.filter((r) => parseInt(String(r.chapter), 10) === chapter)
		.map((r) => ({ verse: parseInt(String(r.verse), 10), text: cleanText(String(r.text ?? "")) }))
		.filter((v) => v.verse && v.text);
}

/** Crossway allows at most 500 ESV verses to be stored locally. */
const ESV_CACHE_LIMIT = 500;

export class BibleSource {
	private chapterCache = new Map<string, Verse[]>();
	private fileCache = new Map<string, ChapterMap>();
	private esvCache = new Map<string, Verse[]>();
	private esvCached = 0;

	constructor(
		private app: App,
		private esvKey: () => string,
		private accordance: AccordanceBridge,
	) {}

	clearCache(): void {
		this.chapterCache.clear();
		this.fileCache.clear();
		this.esvCache.clear();
		this.esvCached = 0;
	}

	/** Verses of the reference in this translation (empty if the passage doesn't exist there). */
	async getPassage(tr: Translation, ref: BibleReference): Promise<Verse[]> {
		if (!hasBook(tr, ref.book.num)) return [];
		let verses: Verse[];
		if (tr.source === "accordance") verses = await this.fromAccordance(tr, ref);
		else if (tr.source === "esv") verses = await this.fromEsv(ref);
		else verses = (await this.getChapter(tr, ref.book, ref.chapter)).filter((v) => inRanges(v.verse, ref.ranges));
		// Some Hebrew sources mark morpheme breaks with "/" — remove them for reading.
		if (tr.lang === "he") verses = verses.map((v) => ({ ...v, text: v.text.replace(/\//g, "") }));
		return verses;
	}

	private async getChapter(tr: Translation, book: BookInfo, chapter: number): Promise<Verse[]> {
		const key = `${tr.id}|${book.num}:${chapter}`;
		const hit = this.chapterCache.get(key);
		if (hit) return hit;

		let verses: Verse[];
		if (tr.source === "file") verses = await this.fromFile(tr, book.num, chapter);
		else if (tr.source === "net") verses = await this.fromNet(book, chapter);
		else verses = await this.fromBolls(tr, book.num, chapter);
		if (verses.length) this.chapterCache.set(key, verses);
		return verses;
	}

	private async fromBolls(tr: Translation, book: number, chapter: number): Promise<Verse[]> {
		if (!tr.code) throw new Error(t.errNoCode);
		const url = `https://bolls.life/get-text/${encodeURIComponent(tr.code)}/${book}/${chapter}/`;
		const res = await requestUrl({ url, throw: false });
		if (res.status !== 200) throw new Error(t.errHttp("bolls.life", res.status));
		const rows = res.json as { verse: number; text: string }[];
		if (!Array.isArray(rows)) throw new Error(t.errResponse("bolls.life"));
		return rows.map((r) => ({ verse: r.verse, text: cleanText(r.text ?? "") }));
	}

	private async fromNet(book: BookInfo, chapter: number): Promise<Verse[]> {
		const passage = `${apiBookName(book)} ${chapter}`;
		const url = `https://labs.bible.org/api/?passage=${encodeURIComponent(passage)}&type=json&formatting=plain`;
		const res = await requestUrl({ url, throw: false });
		if (res.status !== 200) throw new Error(t.errHttp("NET Bible", res.status));
		let rows: unknown;
		try {
			rows = res.json;
		} catch {
			throw new Error(t.errResponse("NET Bible"));
		}
		return parseNetJson(rows, chapter);
	}

	private async fromEsv(ref: BibleReference): Promise<Verse[]> {
		const key = this.esvKey().trim();
		if (!key) throw new Error(t.esvNoKey);
		const book = apiBookName(ref.book);
		const q = ref.ranges.length
			? ref.ranges.map((r) => `${book} ${ref.chapter}:${r.start}-${r.end}`).join("; ")
			: `${book} ${ref.chapter}`;
		const cached = this.esvCache.get(q);
		if (cached) return cached;

		const params = new URLSearchParams({
			q,
			"include-passage-references": "false",
			"include-verse-numbers": "true",
			"include-first-verse-numbers": "true",
			"include-footnotes": "false",
			"include-headings": "false",
			"include-short-copyright": "false",
			"include-copyright": "false",
			"include-selahs": "true",
			"indent-paragraphs": "0",
			"indent-poetry": "false",
		});
		const res = await requestUrl({
			url: `https://api.esv.org/v3/passage/text/?${params.toString()}`,
			headers: { Authorization: `Token ${key}` },
			throw: false,
		});
		if (res.status === 401 || res.status === 403) throw new Error(t.esvBadKey);
		if (res.status === 429) throw new Error(t.esvThrottled);
		if (res.status !== 200) throw new Error(t.errHttp("ESV API", res.status));
		const data = res.json as { passages?: string[] };
		const verses = parseEsvText(data.passages ?? []).filter((v) => inRanges(v.verse, ref.ranges));

		if (this.esvCached + verses.length > ESV_CACHE_LIMIT) {
			this.esvCache.clear();
			this.esvCached = 0;
		}
		if (verses.length) {
			this.esvCache.set(q, verses);
			this.esvCached += verses.length;
		}
		return verses;
	}

	private async fromAccordance(tr: Translation, ref: BibleReference): Promise<Verse[]> {
		const key = `${tr.id}|acc|${ref.book.num}:${ref.chapter}:${JSON.stringify(ref.ranges)}`;
		const hit = this.chapterCache.get(key);
		if (hit) return hit;
		const wanted: number[] | "all" = ref.ranges.length
			? ref.ranges.flatMap((r) => Array.from({ length: Math.min(r.end - r.start + 1, 200) }, (_, i) => r.start + i))
			: "all";
		const bookName = ref.book.num === 22 ? "Song" : ref.book.en;
		const raw = await this.accordance.fetch(tr.module ?? "", `${bookName} ${ref.chapter}`, wanted);
		const verses = raw.map((v) => ({ verse: v.verse, text: cleanText(v.text) })).filter((v) => v.text);
		if (verses.length) this.chapterCache.set(key, verses);
		return verses;
	}

	private async fromFile(tr: Translation, book: number, chapter: number): Promise<Verse[]> {
		if (!tr.path) throw new Error(t.errNoPath);
		const path = normalizePath(tr.path);
		let index = this.fileCache.get(path);
		if (!index) {
			const file = this.app.vault.getAbstractFileByPath(path);
			if (!(file instanceof TFile)) throw new Error(t.errFileMissing(path));
			const raw = await this.app.vault.cachedRead(file);
			let data: unknown;
			try {
				data = JSON.parse(raw.replace(/^\uFEFF/, ""));
			} catch {
				throw new Error(t.errJson(path));
			}
			index = indexLocalBible(data);
			if (index.size === 0) throw new Error(t.errJsonFormat);
			this.fileCache.set(path, index);
		}
		return index.get(`${book}:${chapter}`) ?? [];
	}
}
