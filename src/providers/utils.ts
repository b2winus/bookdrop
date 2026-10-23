import type { RequestUrlResponse } from "obsidian";

/** Digits-only ISBN if the input is an ISBN-10/13, otherwise null. */
export function toIsbn(input: string): string | null {
	const cleaned = input.replace(/[-\s]/g, "").toUpperCase();
	if (/^\d{13}$/.test(cleaned)) return cleaned;
	if (/^\d{9}[\dX]$/.test(cleaned)) return cleaned;
	return null;
}

/** Plain text with HTML tags and common entities removed. */
export function stripHtml(html: string): string {
	return html
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/p>/gi, "\n\n")
		.replace(/<[^>]+>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
		.replace(/&amp;/g, "&")
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

export function toHttps(url: string): string {
	return url.replace(/^http:\/\//, "https://");
}

/** Parsed JSON body as unknown (the caller narrows it), or null if the body isn't JSON. */
export function readJson(res: RequestUrlResponse): unknown {
	return parseJson(res.text);
}

export function parseJson(text: string): unknown {
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return null;
	}
}

/** First run of digits as a number, e.g. "336 p." → 336. */
export function firstNumber(value: unknown): number | null {
	if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null;
	if (typeof value !== "string") return null;
	const m = value.replace(/,/g, "").match(/\d+/);
	if (!m) return null;
	const n = Number(m[0]);
	return n > 0 ? n : null;
}

/** "20141117" → "2014-11-17"; other formats are returned as is. */
export function formatCompactDate(value: string): string {
	const m = value.match(/^(\d{4})(\d{2})(\d{2})$/);
	return m ? `${m[1]}-${m[2]}-${m[3]}` : value;
}

/** Splits an ISBN-10/13 pair or list into the two fields. */
export function splitIsbns(values: string[]): { isbn10: string; isbn13: string } {
	let isbn10 = "";
	let isbn13 = "";
	for (const raw of values) {
		const v = raw.replace(/[-\s]/g, "").toUpperCase();
		if (!isbn13 && /^\d{13}$/.test(v)) isbn13 = v;
		else if (!isbn10 && /^\d{9}[\dX]$/.test(v)) isbn10 = v;
	}
	return { isbn10, isbn13 };
}

/** Rejects if the promise takes longer than ms. */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const timer = window.setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms);
		promise.then(
			(v) => {
				window.clearTimeout(timer);
				resolve(v);
			},
			(e: unknown) => {
				window.clearTimeout(timer);
				reject(e instanceof Error ? e : new Error(String(e)));
			},
		);
	});
}

export function hasHangul(text: string): boolean {
	return /[가-힣]/.test(text);
}
