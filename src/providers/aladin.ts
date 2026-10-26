import { requestUrl } from "obsidian";
import { Book, SearchOptions, emptyBook } from "../types";
import { firstNumber, parseJson, splitIsbns, stripHtml, toHttps, toIsbn } from "./utils";
import { t } from "../i18n";

const API = "https://www.aladin.co.kr/ttb/api";

/** One item in an Aladin TTB API response (Output=JS, Version=20131101). */
export interface AladinItem {
	title?: string;
	link?: string;
	author?: string;
	pubDate?: string;
	description?: string;
	fullDescription?: string;
	isbn?: string;
	isbn13?: string;
	priceStandard?: number;
	cover?: string;
	publisher?: string;
	categoryName?: string;
	seriesInfo?: { seriesName?: string };
	subInfo?: {
		subTitle?: string;
		originalTitle?: string;
		itemPage?: number;
		toc?: string;
	};
}

interface AladinResponse {
	item?: AladinItem[];
	errorCode?: number;
	errorMessage?: string;
}

const TRANSLATOR_ROLES = /옮긴이|옮김|역자|번역|역\b/;

/**
 * Aladin puts every contributor in one string:
 * "기시미 이치로, 고가 후미타케 (지은이), 전경아 (옮긴이)".
 * Names before a "(role)" share that role. Translators are separated out;
 * everyone else (author, editor, illustrator…) counts as an author.
 */
export function parseAladinAuthors(author: string): { authors: string[]; translators: string[] } {
	const authors: string[] = [];
	const translators: string[] = [];
	const re = /([^()]+?)\s*\(([^)]*)\)\s*,?/g;
	let matched = false;
	let m: RegExpExecArray | null;
	while ((m = re.exec(author)) !== null) {
		matched = true;
		const names = m[1]
			.split(",")
			.map((n) => n.trim())
			.filter(Boolean);
		(TRANSLATOR_ROLES.test(m[2]) ? translators : authors).push(...names);
	}
	if (!matched) {
		authors.push(
			...author
				.split(",")
				.map((n) => n.trim())
				.filter(Boolean),
		);
	}
	return { authors, translators };
}

/** "제목 - 부제" → ["제목", "부제"] when Aladin didn't give a separate subtitle. */
function splitTitle(title: string, subTitle: string | undefined): { title: string; subtitle: string } {
	if (subTitle) return { title, subtitle: subTitle };
	const i = title.indexOf(" - ");
	if (i > 0) return { title: title.slice(0, i).trim(), subtitle: title.slice(i + 3).trim() };
	return { title, subtitle: "" };
}

function tocText(html: string | undefined): string {
	if (!html) return "";
	return stripHtml(html)
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean)
		.join("\n");
}

export function mapAladinItem(item: AladinItem): Book {
	const { title, subtitle } = splitTitle(stripHtml(item.title ?? ""), item.subInfo?.subTitle);
	const { authors, translators } = parseAladinAuthors(item.author ?? "");
	const { isbn10, isbn13 } = splitIsbns([item.isbn13 ?? "", item.isbn ?? ""]);
	const full = stripHtml(item.fullDescription ?? "");
	const short = stripHtml(item.description ?? "");
	const cover = toHttps(item.cover ?? "");
	return {
		...emptyBook("aladin"),
		title,
		subtitle,
		originalTitle: item.subInfo?.originalTitle ?? "",
		authors,
		translators,
		publisher: item.publisher ?? "",
		publishDate: item.pubDate ?? "",
		isbn10,
		isbn13,
		pageCount: firstNumber(item.subInfo?.itemPage),
		// "국내도서>인문학>심리학" → ["인문학", "심리학"]
		categories: (item.categoryName ?? "").split(">").slice(1).filter(Boolean),
		series: item.seriesInfo?.seriesName ?? "",
		description: full.length > short.length ? full : short,
		toc: tocText(item.subInfo?.toc),
		coverUrl: cover,
		thumbnailUrl: cover,
		link: item.link ?? "",
		price: firstNumber(item.priceStandard),
	};
}

/**
 * Aladin's JSON output is occasionally not strict JSON
 * (a trailing semicolon or \' escapes), so clean it before parsing.
 */
export function parseAladinJson(text: string): AladinResponse | null {
	const cleaned = text
		.trim()
		.replace(/;\s*$/, "")
		.replace(/\\'/g, "'");
	return parseJson(cleaned) as AladinResponse | null;
}

async function call(endpoint: "ItemSearch" | "ItemLookUp", params: Record<string, string>, key: string): Promise<AladinItem[]> {
	if (!key) throw new Error(t("err.aladinNoKey"));
	const qs = new URLSearchParams({ TTBKey: key.trim(), Output: "JS", Version: "20131101", Cover: "Big", ...params });
	const res = await requestUrl({ url: `${API}/${endpoint}.aspx?${qs.toString()}`, throw: false });
	const body = parseAladinJson(res.text);
	if (res.status !== 200 || !body || body.errorCode) {
		const detail = body?.errorMessage ?? res.text.slice(0, 200);
		throw new Error(t("err.aladin", { status: body?.errorCode ?? res.status, detail }));
	}
	return body.item ?? [];
}

/** Full record for one ISBN: page count, table of contents, original title, full description. */
export async function lookupAladin(isbn: string, opts: SearchOptions): Promise<Book | null> {
	const items = await call(
		"ItemLookUp",
		{
			ItemId: isbn,
			ItemIdType: isbn.length === 13 ? "ISBN13" : "ISBN",
			OptResult: "Toc,fulldescription",
		},
		opts.aladinTtbKey,
	);
	return items.length ? mapAladinItem(items[0]) : null;
}

export async function searchAladin(query: string, opts: SearchOptions): Promise<Book[]> {
	const isbn = toIsbn(query);
	if (isbn) {
		const book = await lookupAladin(isbn, opts);
		return book ? [book] : [];
	}
	const items = await call(
		"ItemSearch",
		{
			Query: query,
			QueryType: "Keyword",
			SearchTarget: "Book",
			MaxResults: String(Math.min(Math.max(opts.maxResults, 1), 50)),
			start: "1",
		},
		opts.aladinTtbKey,
	);
	return items.map(mapAladinItem);
}
