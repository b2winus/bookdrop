export type ProviderId = "kakao" | "google";

export interface Book {
	title: string;
	subtitle: string;
	authors: string[];
	translators: string[];
	publisher: string;
	/** YYYY-MM-DD, YYYY-MM 또는 YYYY */
	publishDate: string;
	isbn10: string;
	isbn13: string;
	pageCount: number | null;
	categories: string[];
	description: string;
	/** 노트에 넣을 큰 표지 이미지 */
	coverUrl: string;
	/** 검색 결과 목록용 작은 썸네일 */
	thumbnailUrl: string;
	link: string;
	price: number | null;
	language: string;
	source: ProviderId;
}

export interface SearchOptions {
	kakaoApiKey: string;
	googleApiKey: string;
	googleLangRestrict: string;
	maxResults: number;
}
