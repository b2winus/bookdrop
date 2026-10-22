import { requestUrl } from "obsidian";
import { Book, SearchOptions } from "../types";
import { stripHtml, toHttps, toIsbn } from "./utils";
import { t } from "../i18n";

export interface GoogleVolume {
	id: string;
	volumeInfo: {
		title?: string;
		subtitle?: string;
		authors?: string[];
		publisher?: string;
		publishedDate?: string;
		description?: string;
		industryIdentifiers?: { type: string; identifier: string }[];
		pageCount?: number;
		categories?: string[];
		imageLinks?: { smallThumbnail?: string; thumbnail?: string };
		language?: string;
		infoLink?: string;
		canonicalVolumeLink?: string;
	};
	saleInfo?: { listPrice?: { amount?: number } };
}

function cleanGoogleImage(url: string | undefined): string {
	if (!url) return "";
	return toHttps(url).replace(/&edge=curl/, "");
}

export function mapGoogleVolume(item: GoogleVolume): Book {
	const v = item.volumeInfo ?? {};
	let isbn10 = "";
	let isbn13 = "";
	for (const id of v.industryIdentifiers ?? []) {
		if (id.type === "ISBN_13") isbn13 = id.identifier;
		else if (id.type === "ISBN_10") isbn10 = id.identifier;
	}
	const thumb = cleanGoogleImage(v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail);
	return {
		title: v.title ?? "",
		subtitle: v.subtitle ?? "",
		authors: v.authors ?? [],
		translators: [],
		publisher: v.publisher ?? "",
		publishDate: v.publishedDate ?? "",
		isbn10,
		isbn13,
		pageCount: typeof v.pageCount === "number" && v.pageCount > 0 ? v.pageCount : null,
		categories: v.categories ?? [],
		description: stripHtml(v.description ?? ""),
		coverUrl: thumb,
		thumbnailUrl: thumb,
		link: v.canonicalVolumeLink ?? v.infoLink ?? "",
		price: item.saleInfo?.listPrice?.amount ?? null,
		language: v.language ?? "",
		source: "google",
	};
}

export async function searchGoogle(query: string, opts: SearchOptions): Promise<Book[]> {
	const isbn = toIsbn(query);
	const params = new URLSearchParams({
		q: isbn ? `isbn:${isbn}` : query,
		maxResults: String(Math.min(Math.max(opts.maxResults, 1), 40)),
		printType: "books",
	});
	if (opts.googleLangRestrict) params.set("langRestrict", opts.googleLangRestrict.trim());
	if (opts.googleApiKey) params.set("key", opts.googleApiKey.trim());

	const res = await requestUrl({
		url: `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
		throw: false,
	});
	if (res.status !== 200) {
		let detail = "";
		try {
			detail = res.json?.error?.message ?? "";
		} catch {
			detail = res.text?.slice(0, 200) ?? "";
		}
		if (res.status === 429) {
			throw new Error(t("err.google429"));
		}
		throw new Error(t("err.google", { status: res.status, detail }));
	}
	const items: GoogleVolume[] = res.json?.items ?? [];
	return items.map(mapGoogleVolume);
}
