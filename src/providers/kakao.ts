import { requestUrl } from "obsidian";
import { Book, SearchOptions } from "../types";
import { toIsbn, toHttps } from "./utils";
import { t } from "../i18n";

/** 카카오 책 검색 API 응답의 문서 한 건 */
export interface KakaoDoc {
	title: string;
	contents: string;
	url: string;
	isbn: string;
	datetime: string;
	authors: string[];
	publisher: string;
	translators: string[];
	price: number;
	sale_price: number;
	thumbnail: string;
	status: string;
}

/**
 * 카카오 썸네일은 search1.kakaocdn.net/thumb/R120x174...?fname=<원본주소> 형태다.
 * fname 파라미터에 원본(큰) 이미지 주소가 들어 있으면 그것을 표지로 쓴다.
 */
export function kakaoLargeCover(thumbnail: string): string {
	if (!thumbnail) return "";
	const m = thumbnail.match(/[?&]fname=([^&]+)/);
	if (m) {
		try {
			return toHttps(decodeURIComponent(m[1]));
		} catch {
			/* 디코딩 실패 시 썸네일 그대로 사용 */
		}
	}
	return toHttps(thumbnail);
}

export function mapKakaoDoc(doc: KakaoDoc): Book {
	let isbn10 = "";
	let isbn13 = "";
	for (const part of (doc.isbn ?? "").split(/\s+/)) {
		if (part.length === 13) isbn13 = part;
		else if (part.length === 10) isbn10 = part;
	}
	return {
		title: doc.title ?? "",
		subtitle: "",
		authors: doc.authors ?? [],
		translators: doc.translators ?? [],
		publisher: doc.publisher ?? "",
		publishDate: doc.datetime ? doc.datetime.slice(0, 10) : "",
		isbn10,
		isbn13,
		pageCount: null,
		categories: [],
		description: (doc.contents ?? "").trim(),
		coverUrl: kakaoLargeCover(doc.thumbnail),
		thumbnailUrl: toHttps(doc.thumbnail ?? ""),
		link: doc.url ?? "",
		price: typeof doc.price === "number" && doc.price > 0 ? doc.price : null,
		language: "",
		source: "kakao",
	};
}

export async function searchKakao(query: string, opts: SearchOptions): Promise<Book[]> {
	if (!opts.kakaoApiKey) {
		throw new Error(t("err.kakaoNoKey"));
	}
	const isbn = toIsbn(query);
	const params = new URLSearchParams({
		query: isbn ?? query,
		size: String(Math.min(Math.max(opts.maxResults, 1), 50)),
	});
	if (isbn) params.set("target", "isbn");

	const res = await requestUrl({
		url: `https://dapi.kakao.com/v3/search/book?${params.toString()}`,
		headers: { Authorization: `KakaoAK ${opts.kakaoApiKey.trim()}` },
		throw: false,
	});

	if (res.status !== 200) {
		let detail = "";
		try {
			detail = res.json?.message ?? "";
		} catch {
			detail = res.text?.slice(0, 200) ?? "";
		}
		if (res.status === 401) {
			throw new Error(t("err.kakao401", { detail }));
		}
		throw new Error(t("err.kakao", { status: res.status, detail }));
	}
	const docs: KakaoDoc[] = res.json?.documents ?? [];
	return docs.map(mapKakaoDoc);
}
