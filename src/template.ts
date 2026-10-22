import { Lang } from "./i18n";
import { Book } from "./types";

type Value = string | number | string[] | null;

/** 템플릿에서 쓸 수 있는 변수 이름 (설명은 i18n의 var.* 키) */
export const TEMPLATE_VARIABLES = [
	"title", "subtitle", "author", "authors", "translator", "translators", "publisher",
	"publishDate", "publishYear", "isbn", "isbn10", "isbn13", "pageCount", "categories",
	"description", "coverUrl", "link", "price", "language", "source", "today",
] as const;

function todayString(): string {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function bookToValues(book: Book): Record<string, Value> {
	return {
		title: book.title,
		subtitle: book.subtitle,
		author: book.authors.join(", "),
		authors: book.authors,
		translator: book.translators.join(", "),
		translators: book.translators,
		publisher: book.publisher,
		publishDate: book.publishDate,
		publishYear: book.publishDate.slice(0, 4),
		isbn: book.isbn13 || book.isbn10,
		isbn10: book.isbn10,
		isbn13: book.isbn13,
		pageCount: book.pageCount,
		categories: book.categories,
		description: book.description,
		coverUrl: book.coverUrl,
		link: book.link,
		price: book.price,
		language: book.language,
		source: book.source,
		today: todayString(),
	};
}

function applyFilter(value: Value, filter: string | undefined): string {
	switch (filter) {
		case "json":
			// JSON은 YAML의 부분집합이라 프런트매터에 그대로 넣어도 안전하다.
			if (value === null || value === "") return '""';
			return JSON.stringify(value);
		case "link":
			if (Array.isArray(value)) return value.map((v) => `[[${v}]]`).join(", ");
			return value === null || value === "" ? "" : `[[${value}]]`;
		case "linkjson":
			// 프런트매터용 링크 목록: ["[[저자1]]", "[[저자2]]"]
			if (Array.isArray(value)) return JSON.stringify(value.map((v) => `[[${v}]]`));
			return value === null || value === "" ? '""' : JSON.stringify(`[[${value}]]`);
		default:
			if (value === null) return "";
			if (Array.isArray(value)) return value.join(", ");
			return String(value);
	}
}

/**
 * {{변수}} 또는 {{변수:필터}}를 치환한다.
 * 필터: json (YAML 안전 문자열/목록), link ([[위키링크]]), linkjson (프런트매터용 링크 목록)
 * 표지 주소가 비어 `]()`만 남은 줄은 깨진 이미지가 되므로 지운다.
 */
export function renderTemplate(template: string, book: Book): string {
	const values = bookToValues(book);
	const out = template.replace(/\{\{\s*(\w+)(?::(\w+))?\s*\}\}/g, (whole, name: string, filter?: string) => {
		if (!(name in values)) return whole;
		return applyFilter(values[name], filter);
	});
	return out
		.split("\n")
		.filter((line) => !/\]\(\s*\)/.test(line))
		.join("\n");
}

/** 파일 이름에 쓸 수 없는 문자를 걷어낸다. */
export function sanitizeFileName(name: string): string {
	return name
		.replace(/[\\/:*?"<>|#^[\]]/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, 180);
}

export function makeFileName(template: string, book: Book): string {
	const name = sanitizeFileName(renderTemplate(template, book));
	return name || sanitizeFileName(book.title) || "Untitled book";
}

export const KO_NOTE_TEMPLATE = `---
title: {{title:json}}
subtitle: {{subtitle:json}}
author: {{authors:json}}
translator: {{translators:json}}
publisher: {{publisher:json}}
published: {{publishDate:json}}
isbn: {{isbn:json}}
pages: {{pageCount}}
cover: {{coverUrl:json}}
link: {{link:json}}
source: {{source}}
created: {{today}}
status: 읽기 전
tags:
  - book
---

![표지|150]({{coverUrl}})

# {{title}}

- 저자: {{author}}
- 출판사: {{publisher}} ({{publishDate}})

## 책 소개

{{description}}

## 메모

`;

export const KO_INSERT_TEMPLATE = `> [!info] {{title}}
> ![표지|100]({{coverUrl}})
> - 저자: {{author}}
> - 출판사: {{publisher}}, {{publishDate}}
> - ISBN: {{isbn}}
`;

export const DEFAULT_FILENAME_TEMPLATE = "{{title}} - {{author}}";

export const EN_NOTE_TEMPLATE = `---
title: {{title:json}}
subtitle: {{subtitle:json}}
author: {{authors:json}}
translator: {{translators:json}}
publisher: {{publisher:json}}
published: {{publishDate:json}}
isbn: {{isbn:json}}
pages: {{pageCount}}
cover: {{coverUrl:json}}
link: {{link:json}}
source: {{source}}
created: {{today}}
status: to read
tags:
  - book
---

![cover|150]({{coverUrl}})

# {{title}}

- Author: {{author}}
- Publisher: {{publisher}} ({{publishDate}})

## Description

{{description}}

## Notes

`;

export const EN_INSERT_TEMPLATE = `> [!info] {{title}}
> ![cover|100]({{coverUrl}})
> - Author: {{author}}
> - Publisher: {{publisher}}, {{publishDate}}
> - ISBN: {{isbn}}
`;

export function defaultNoteTemplate(lang: Lang): string {
	return lang === "ko" ? KO_NOTE_TEMPLATE : EN_NOTE_TEMPLATE;
}

export function defaultInsertTemplate(lang: Lang): string {
	return lang === "ko" ? KO_INSERT_TEMPLATE : EN_INSERT_TEMPLATE;
}

/** 사용자가 손대지 않은 기본 템플릿인지 */
export function isDefaultTemplate(value: string): boolean {
	return [KO_NOTE_TEMPLATE, EN_NOTE_TEMPLATE, KO_INSERT_TEMPLATE, EN_INSERT_TEMPLATE].includes(value);
}
