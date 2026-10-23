import { requestUrl } from "obsidian";
import { Book, SearchOptions, emptyBook } from "../types";
import { firstNumber, formatCompactDate, readJson, splitIsbns, stripHtml, toHttps } from "./utils";
import { t } from "../i18n";

/**
 * National Library of Korea — ISBN bibliographic data (ISBN 서지정보).
 * https://www.nl.go.kr/NL/contents/N31101030500.do
 * Used only to fill in details for a chosen book, never as a search source.
 */
const API = "https://www.nl.go.kr/seoji/SearchApi.do";

/** All values come back as strings. */
export interface NlDoc {
	TITLE?: string;
	AUTHOR?: string;
	PUBLISHER?: string;
	EA_ISBN?: string;
	SET_ISBN?: string;
	PAGE?: string;
	PRE_PRICE?: string;
	REAL_PRICE?: string;
	KDC?: string;
	SERIES_TITLE?: string;
	SERIES_NO?: string;
	PUBLISH_PREDATE?: string;
	TITLE_URL?: string;
	BOOK_TB_CNT?: string;
	BOOK_INTRODUCTION?: string;
}

/**
 * "지은이: 기시미 이치로, 고가 후미타케 ; 옮긴이: 전경아" → authors + translators.
 * Without role labels, every name is an author.
 */
export function parseNlAuthors(author: string): { authors: string[]; translators: string[] } {
	const authors: string[] = [];
	const translators: string[] = [];
	for (const part of author.split(/[;/]/)) {
		const [role, names] = part.includes(":") ? part.split(/:(.*)/s) : ["", part];
		const list = (names ?? "")
			.split(",")
			.map((n) => n.replace(/\s*(지음|저|글|옮김|역|외)$/, "").trim())
			.filter(Boolean);
		(/옮긴이|옮김|역자|번역/.test(role) ? translators : authors).push(...list);
	}
	return { authors, translators };
}

export function mapNlDoc(doc: NlDoc): Book {
	const { authors, translators } = parseNlAuthors(doc.AUTHOR ?? "");
	const { isbn10, isbn13 } = splitIsbns([doc.EA_ISBN ?? ""]);
	const series = [doc.SERIES_TITLE, doc.SERIES_NO].filter(Boolean).join(" ");
	const cover = toHttps(doc.TITLE_URL ?? "");
	return {
		...emptyBook("nl"),
		title: doc.TITLE ?? "",
		authors,
		translators,
		publisher: doc.PUBLISHER ?? "",
		publishDate: formatCompactDate(doc.PUBLISH_PREDATE ?? ""),
		isbn10,
		isbn13,
		pageCount: firstNumber(doc.PAGE),
		kdc: (doc.KDC ?? "").trim(),
		series,
		description: stripHtml(doc.BOOK_INTRODUCTION ?? ""),
		toc: stripHtml(doc.BOOK_TB_CNT ?? ""),
		coverUrl: cover,
		thumbnailUrl: cover,
		price: firstNumber(doc.REAL_PRICE) ?? firstNumber(doc.PRE_PRICE),
	};
}

/** The docs list sits under "docs"; accept any array field in case the key differs. */
function docsOf(body: unknown): NlDoc[] {
	if (!body || typeof body !== "object") return [];
	const record = body as Record<string, unknown>;
	if (Array.isArray(record["docs"])) return record["docs"] as NlDoc[];
	for (const value of Object.values(record)) {
		if (Array.isArray(value)) return value as NlDoc[];
	}
	return [];
}

export async function lookupNl(isbn: string, opts: SearchOptions): Promise<Book | null> {
	if (!opts.nlApiKey) throw new Error(t("err.nlNoKey"));
	const params = new URLSearchParams({
		cert_key: opts.nlApiKey.trim(),
		result_style: "json",
		page_no: "1",
		page_size: "1",
		isbn,
	});
	const res = await requestUrl({ url: `${API}?${params.toString()}`, throw: false });
	const body = readJson(res);
	if (res.status !== 200 || body === null) {
		throw new Error(t("err.nl", { status: res.status }));
	}
	const errorCode = (body as Record<string, unknown>)["ERR_CODE"] ?? (body as Record<string, unknown>)["RESULT"];
	if (typeof errorCode === "string" && /^0?1[01]$/.test(errorCode)) {
		throw new Error(t("err.nlKey"));
	}
	const docs = docsOf(body);
	return docs.length ? mapNlDoc(docs[0]) : null;
}
