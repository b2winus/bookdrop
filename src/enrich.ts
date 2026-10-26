import { Book, EnricherId, SearchOptions } from "./types";
import { ENRICHERS, isAvailable, lookupIsbn } from "./providers";
import { withTimeout } from "./providers/utils";

/** How long to wait for one source before giving up on it. */
const SOURCE_TIMEOUT_MS = 8000;

type Field = keyof Book;
const EMPTY_SKIP: Field[] = ["source", "sources", "thumbnailUrl"];

function isEmptyValue(v: unknown): boolean {
	return v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
}

/** Bookstore blurbs are often cut short ("…"). A clearly longer text from another source replaces them. */
function looksTruncated(text: string): boolean {
	return /(\.\.\.|…)\s*$/.test(text) || text.length < 120;
}

/**
 * Fills only the empty fields of `base` from `extra`. Existing values are never overwritten,
 * except a short or cut-off description, which is replaced by a longer one.
 * Returns true if anything was filled.
 */
export function mergeInto(base: Book, extra: Book, source: EnricherId): boolean {
	// Only merge records for the same book.
	if (base.isbn13 && extra.isbn13 && base.isbn13 !== extra.isbn13) return false;

	let changed = false;
	const target = base as unknown as Record<string, unknown>;
	const from = extra as unknown as Record<string, unknown>;
	for (const key of Object.keys(base) as Field[]) {
		if (EMPTY_SKIP.includes(key)) continue;
		if (isEmptyValue(target[key]) && !isEmptyValue(from[key])) {
			target[key] = from[key];
			changed = true;
		}
	}
	if (extra.description && base.description !== extra.description && looksTruncated(base.description) && extra.description.length > base.description.length * 1.5) {
		base.description = extra.description;
		changed = true;
	}
	if (!base.thumbnailUrl && base.coverUrl) base.thumbnailUrl = base.coverUrl;
	if (changed && !base.sources.includes(source)) base.sources.push(source);
	return changed;
}

/** Fields worth looking up elsewhere. When none are empty, enrichment is skipped. */
const WANTED: Field[] = ["pageCount", "toc", "coverUrl", "description", "publisher", "publishDate", "originalTitle", "categories"];

export function missingFields(book: Book): Field[] {
	return WANTED.filter((f) => isEmptyValue(book[f]));
}

/**
 * Looks the chosen book up by ISBN in every enabled source (in parallel) and
 * fills in what's missing, giving priority to sources earlier in ENRICHERS.
 * A source that fails or times out is skipped silently.
 */
export async function enrichBook(book: Book, enabled: EnricherId[], opts: SearchOptions): Promise<Book> {
	const isbn = book.isbn13 || book.isbn10;
	if (!isbn) return book;

	const result: Book = { ...book, sources: [...book.sources] };
	// Aladin search results lack page count and table of contents; its detail record has them,
	// so an Aladin result is always looked up again, even with enrichment turned off.
	const wanted = new Set<EnricherId>(enabled);
	if (book.source === "aladin") wanted.add("aladin");
	const sources = ENRICHERS.filter((s) => wanted.has(s) && isAvailable(s, opts));
	const toQuery = sources.filter((s) => s !== book.source || s === "aladin");
	if (!toQuery.length || !missingFields(result).length) return result;

	const settled = await Promise.allSettled(toQuery.map((s) => withTimeout(lookupIsbn(s, isbn, opts), SOURCE_TIMEOUT_MS)));
	settled.forEach((r, i) => {
		if (r.status === "fulfilled" && r.value) mergeInto(result, r.value, toQuery[i]);
		else if (r.status === "rejected") console.warn(`[Bookdrop] ${toQuery[i]} lookup failed:`, r.reason);
	});
	return result;
}
