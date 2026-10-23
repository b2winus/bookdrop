/** Sources that can search for books. */
export type ProviderId = "kakao" | "aladin" | "google" | "openlibrary";
/** Sources that can fill in missing details by ISBN. "nl" = National Library of Korea. */
export type EnricherId = ProviderId | "nl";

export interface Book {
	title: string;
	subtitle: string;
	originalTitle: string;
	authors: string[];
	translators: string[];
	publisher: string;
	/** YYYY-MM-DD, YYYY-MM or YYYY */
	publishDate: string;
	isbn10: string;
	isbn13: string;
	pageCount: number | null;
	categories: string[];
	subjects: string[];
	/** Korean Decimal Classification number */
	kdc: string;
	series: string;
	description: string;
	/** Table of contents, one entry per line */
	toc: string;
	/** Large cover used in notes */
	coverUrl: string;
	/** Small cover used in the result list */
	thumbnailUrl: string;
	link: string;
	price: number | null;
	language: string;
	/** Where the search result came from */
	source: EnricherId;
	/** Every source that contributed data, in order */
	sources: EnricherId[];
}

export interface SearchOptions {
	kakaoApiKey: string;
	aladinTtbKey: string;
	googleApiKey: string;
	googleLangRestrict: string;
	nlApiKey: string;
	maxResults: number;
}

export function emptyBook(source: EnricherId): Book {
	return {
		title: "",
		subtitle: "",
		originalTitle: "",
		authors: [],
		translators: [],
		publisher: "",
		publishDate: "",
		isbn10: "",
		isbn13: "",
		pageCount: null,
		categories: [],
		subjects: [],
		kdc: "",
		series: "",
		description: "",
		toc: "",
		coverUrl: "",
		thumbnailUrl: "",
		link: "",
		price: null,
		language: "",
		source,
		sources: [source],
	};
}
