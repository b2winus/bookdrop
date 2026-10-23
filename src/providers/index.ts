import { Book, EnricherId, ProviderId, SearchOptions } from "../types";
import { searchKakao } from "./kakao";
import { searchGoogle } from "./google";
import { lookupAladin, searchAladin } from "./aladin";
import { searchOpenLibrary } from "./openlibrary";
import { lookupNl } from "./nl";
import { hasHangul } from "./utils";
import { t } from "../i18n";

/** Search sources, in the order they appear in menus. */
export const PROVIDERS: ProviderId[] = ["kakao", "aladin", "google", "openlibrary"];

/** Sources that can fill in details by ISBN, in priority order (earlier wins when both have a value). */
export const ENRICHERS: EnricherId[] = ["aladin", "nl", "kakao", "google", "openlibrary"];

export function providerLabel(p: EnricherId): string {
	switch (p) {
		case "kakao":
			return t("provider.kakao");
		case "aladin":
			return t("provider.aladin");
		case "google":
			return t("provider.google");
		case "openlibrary":
			return t("provider.openlibrary");
		case "nl":
			return t("provider.nl");
	}
}

/** Whether a source can be used with the keys the user has entered. */
export function isAvailable(p: EnricherId, opts: SearchOptions): boolean {
	switch (p) {
		case "kakao":
			return !!opts.kakaoApiKey;
		case "aladin":
			return !!opts.aladinTtbKey;
		case "nl":
			return !!opts.nlApiKey;
		case "google":
		case "openlibrary":
			return true;
	}
}

export function searchBooks(provider: ProviderId, query: string, opts: SearchOptions): Promise<Book[]> {
	switch (provider) {
		case "kakao":
			return searchKakao(query, opts);
		case "aladin":
			return searchAladin(query, opts);
		case "google":
			return searchGoogle(query, opts);
		case "openlibrary":
			return searchOpenLibrary(query, opts);
	}
}

/** One record for an ISBN from a source, or null if the source doesn't know the book. */
export async function lookupIsbn(source: EnricherId, isbn: string, opts: SearchOptions): Promise<Book | null> {
	switch (source) {
		case "aladin":
			return lookupAladin(isbn, opts);
		case "nl":
			return lookupNl(isbn, opts);
		case "kakao":
			return (await searchKakao(isbn, opts))[0] ?? null;
		case "google":
			return (await searchGoogle(isbn, opts))[0] ?? null;
		case "openlibrary":
			return (await searchOpenLibrary(isbn, opts))[0] ?? null;
	}
}

/**
 * Sources to try when the chosen one finds nothing:
 * Korean queries try Korean bookstores first, other queries try international sources first.
 */
export function fallbackOrder(chosen: ProviderId, query: string, opts: SearchOptions): ProviderId[] {
	const order: ProviderId[] = hasHangul(query) ? ["kakao", "aladin", "google", "openlibrary"] : ["google", "openlibrary", "aladin", "kakao"];
	return order.filter((p) => p !== chosen && isAvailable(p, opts));
}

/** First source the user can use without adding a key, preferring the configured default. */
export function startingProvider(preferred: ProviderId, opts: SearchOptions): ProviderId {
	if (isAvailable(preferred, opts)) return preferred;
	return PROVIDERS.find((p) => isAvailable(p, opts)) ?? "google";
}
