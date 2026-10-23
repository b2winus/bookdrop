import { requestUrl } from "obsidian";
import { Book, SearchOptions, emptyBook } from "../types";
import { readJson, splitIsbns, toIsbn } from "./utils";
import { t } from "../i18n";

/**
 * Open Library asks apps to identify themselves; identified requests get a higher rate limit.
 * https://openlibrary.org/developers/api
 */
const USER_AGENT = "Bookdrop-Obsidian-Plugin (https://github.com/b2winus/bookdrop)";

const FIELDS = [
	"key",
	"title",
	"subtitle",
	"author_name",
	"first_publish_year",
	"publish_date",
	"isbn",
	"number_of_pages_median",
	"cover_i",
	"publisher",
	"subject",
	"language",
].join(",");

export interface OpenLibraryDoc {
	key?: string;
	title?: string;
	subtitle?: string;
	author_name?: string[];
	first_publish_year?: number;
	publish_date?: string[];
	isbn?: string[];
	number_of_pages_median?: number;
	cover_i?: number;
	publisher?: string[];
	subject?: string[];
	language?: string[];
}

/** Cover by cover ID — not rate-limited, unlike covers by ISBN. */
function coverById(id: number | undefined, size: "M" | "L"): string {
	return id ? `https://covers.openlibrary.org/b/id/${id}-${size}.jpg` : "";
}

/**
 * Maps a search result (a "work" that groups many editions).
 * When we searched by ISBN, that ISBN is the edition we want.
 */
export function mapOpenLibraryDoc(doc: OpenLibraryDoc, searchedIsbn?: string): Book {
	const isbns = searchedIsbn ? [searchedIsbn] : (doc.isbn ?? []).filter((i) => i.startsWith("978") || i.startsWith("979"));
	const { isbn10, isbn13 } = splitIsbns(searchedIsbn ? isbns : [...isbns, ...(doc.isbn ?? [])]);
	return {
		...emptyBook("openlibrary"),
		title: doc.title ?? "",
		subtitle: doc.subtitle ?? "",
		authors: doc.author_name ?? [],
		publisher: doc.publisher?.[0] ?? "",
		publishDate: doc.first_publish_year ? String(doc.first_publish_year) : (doc.publish_date?.[0] ?? ""),
		isbn10,
		isbn13,
		pageCount: typeof doc.number_of_pages_median === "number" && doc.number_of_pages_median > 0 ? doc.number_of_pages_median : null,
		subjects: (doc.subject ?? []).slice(0, 10),
		coverUrl: coverById(doc.cover_i, "L"),
		thumbnailUrl: coverById(doc.cover_i, "M"),
		link: doc.key ? `https://openlibrary.org${doc.key}` : "",
		language: doc.language?.[0] ?? "",
	};
}

export async function searchOpenLibrary(query: string, opts: SearchOptions): Promise<Book[]> {
	const isbn = toIsbn(query);
	const params = new URLSearchParams({
		q: isbn ? `isbn:${isbn}` : query,
		fields: FIELDS,
		limit: String(Math.min(Math.max(opts.maxResults, 1), 40)),
	});
	const res = await requestUrl({
		url: `https://openlibrary.org/search.json?${params.toString()}`,
		headers: { "User-Agent": USER_AGENT },
		throw: false,
	});
	if (res.status !== 200) {
		throw new Error(t("err.openlibrary", { status: res.status }));
	}
	const body = readJson(res) as { docs?: OpenLibraryDoc[] } | null;
	return (body?.docs ?? []).map((d) => mapOpenLibraryDoc(d, isbn ?? undefined));
}
