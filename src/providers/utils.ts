import type { RequestUrlResponse } from "obsidian";

/** 입력이 ISBN(10/13자리)이면 숫자만 남긴 값을, 아니면 null을 돌려준다. */
export function toIsbn(input: string): string | null {
	const cleaned = input.replace(/[-\s]/g, "").toUpperCase();
	if (/^\d{13}$/.test(cleaned)) return cleaned;
	if (/^\d{9}[\dX]$/.test(cleaned)) return cleaned;
	return null;
}

/** HTML 태그와 엔티티를 걷어낸 평문 */
export function stripHtml(html: string): string {
	return html
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/p>/gi, "\n\n")
		.replace(/<[^>]+>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

export function toHttps(url: string): string {
	return url.replace(/^http:\/\//, "https://");
}

/** Parsed JSON body as unknown (the caller narrows it), or null if the body isn't JSON. */
export function readJson(res: RequestUrlResponse): unknown {
	try {
		return JSON.parse(res.text) as unknown;
	} catch {
		return null;
	}
}
