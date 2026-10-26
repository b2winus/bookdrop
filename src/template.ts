import { Lang } from "./i18n";
import { Book } from "./types";

type Value = string | number | string[] | null;

/** 템플릿에서 쓸 수 있는 변수 이름 (설명은 i18n의 var.* 키) */
export const TEMPLATE_VARIABLES = [
	"title", "subtitle", "originalTitle", "author", "authors", "translator", "translators", "publisher",
	"publishDate", "publishYear", "isbn", "isbn10", "isbn13", "pageCount", "series", "categories",
	"subjects", "description", "toc", "coverUrl", "link", "price", "language", "source", "sources", "status", "today",
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
		originalTitle: book.originalTitle,
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
		series: book.series,
		kdc: book.kdc,
		categories: book.categories,
		subjects: book.subjects,
		description: book.description,
		toc: book.toc,
		coverUrl: book.coverUrl,
		link: book.link,
		price: book.price,
		language: book.language,
		source: book.source,
		sources: book.sources,
		today: todayString(),
	};
}

function isEmptyValue(v: Value): boolean {
	return v === null || v === "" || (Array.isArray(v) && v.length === 0);
}

function applyFilter(value: Value, filter: string | undefined): string {
	switch (filter) {
		case "json":
			// JSON은 YAML의 부분집합이라 프런트매터에 그대로 넣어도 안전하다.
			if (value === null || value === "") return '""';
			return JSON.stringify(value);
		case "list":
			// Markdown bullet list: one item per array entry or per line.
			if (value === null || value === "") return "";
			return (Array.isArray(value) ? value : String(value).split("\n"))
				.map((v) => v.trim())
				.filter(Boolean)
				.map((v) => `- ${v}`)
				.join("\n");
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
/** `extra` adds values that don't come from the book, such as the reading status. */
export function renderTemplate(template: string, book: Book, extra: Record<string, Value> = {}): string {
	const values = { ...bookToValues(book), ...extra };
	// {{#name}}…{{/name}} keeps its content only when name has a value.
	const withSections = template.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_whole, name: string, inner: string) =>
		name in values && !isEmptyValue(values[name]) ? inner : "",
	);
	const out = withSections.replace(/\{\{\s*(\w+)(?::(\w+))?\s*\}\}/g, (whole, name: string, filter?: string) => {
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

const LEGACY_KO_NOTE_TEMPLATE = `---
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

const LEGACY_EN_NOTE_TEMPLATE = `---
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
	return [KO_NOTE_TEMPLATE, EN_NOTE_TEMPLATE, LEGACY_KO_NOTE_TEMPLATE, LEGACY_EN_NOTE_TEMPLATE, KO_INSERT_TEMPLATE, EN_INSERT_TEMPLATE].includes(value);
}

export const KO_NOTE_TEMPLATE = `---
title: {{title:json}}
subtitle: {{subtitle:json}}
original_title: {{originalTitle:json}}
author: {{authors:json}}
translator: {{translators:json}}
publisher: {{publisher:json}}
published: {{publishDate:json}}
isbn: {{isbn:json}}
pages: {{pageCount}}
series: {{series:json}}
categories: {{categories:json}}
cover: {{coverUrl:json}}
link: {{link:json}}
source: {{source}}
created: {{today}}
status: {{status:json}}
started:
finished:
rating:
progress:
tags:
  - book
---

![표지|150]({{coverUrl}})

# {{title}}

{{#subtitle}}*{{subtitle}}*

{{/subtitle}}- 저자: {{author}}
{{#translator}}- 옮긴이: {{translator}}
{{/translator}}- 출판사: {{publisher}}{{#publishDate}} ({{publishDate}}){{/publishDate}}
{{#pageCount}}- 쪽수: {{pageCount}}쪽
{{/pageCount}}{{#series}}- 시리즈: {{series}}
{{/series}}
## 책 소개

{{description}}
{{#toc}}
## 목차

{{toc}}
{{/toc}}
## 인용

## 메모

`;

export const EN_NOTE_TEMPLATE = `---
title: {{title:json}}
subtitle: {{subtitle:json}}
original_title: {{originalTitle:json}}
author: {{authors:json}}
translator: {{translators:json}}
publisher: {{publisher:json}}
published: {{publishDate:json}}
isbn: {{isbn:json}}
pages: {{pageCount}}
series: {{series:json}}
categories: {{categories:json}}
cover: {{coverUrl:json}}
link: {{link:json}}
source: {{source}}
created: {{today}}
status: {{status:json}}
started:
finished:
rating:
progress:
tags:
  - book
---

![cover|150]({{coverUrl}})

# {{title}}

{{#subtitle}}*{{subtitle}}*

{{/subtitle}}- Author: {{author}}
{{#translator}}- Translator: {{translator}}
{{/translator}}- Publisher: {{publisher}}{{#publishDate}} ({{publishDate}}){{/publishDate}}
{{#pageCount}}- Pages: {{pageCount}}
{{/pageCount}}{{#series}}- Series: {{series}}
{{/series}}
## Description

{{description}}
{{#toc}}
## Contents

{{toc}}
{{/toc}}
## Quotes

## Notes

`;
