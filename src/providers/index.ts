import { Book, ProviderId, SearchOptions } from "../types";
import { searchKakao } from "./kakao";
import { searchGoogle } from "./google";

import { t } from "../i18n";

export const PROVIDERS: ProviderId[] = ["kakao", "google"];

export function providerLabel(p: ProviderId): string {
	return t(p === "kakao" ? "provider.kakao" : "provider.google");
}

export function searchBooks(provider: ProviderId, query: string, opts: SearchOptions): Promise<Book[]> {
	return provider === "kakao" ? searchKakao(query, opts) : searchGoogle(query, opts);
}

export function otherProvider(p: ProviderId): ProviderId {
	return p === "kakao" ? "google" : "kakao";
}
