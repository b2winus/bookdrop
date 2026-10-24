# Bookdrop

English | [한국어](README.ko.md)

**Drop a book into your vault.** Search by title, author, or ISBN, pick the right edition, and Bookdrop turns it into a clean, templated book note — cover, authors, publisher, ISBN, and description included.

Bookdrop searches four sources and can combine them:

- **Kakao Book Search** — fast, complete search for books published in Korea.
- **Aladin** — Korean bookstore data with page count, table of contents, original title, series, and categories.
- **Google Books** — broad international coverage.
- **Open Library** — free international catalog with page counts and subjects; no key needed.

After you pick a book, Bookdrop can look up its ISBN in the other sources — including the **National Library of Korea** — and fill in whatever is still missing, so Korean and international books land in one consistent format.

The interface is available in **English and Korean**. It follows Obsidian's language by default, and you can switch it in settings.

## Features

- **Create a book note** — search, choose a result, and get a new note built from your template in the folder you choose.
- **Insert at cursor** — drop a book info block into the note you're writing. Select text first to search for it immediately.
- **Fill frontmatter** — complete the properties (author, publisher, ISBN, cover, link, …) of an existing note. The search is pre-filled from the note's `isbn`, `title`, or file name, and existing values are kept unless you choose to overwrite them.
- **Fill in missing details** — after you choose a book, other sources are checked by ISBN and only empty fields are filled (page count, table of contents, KDC classification, cover, full description…).
- **Smart fallback** — if a search finds nothing, Korean queries try Korean sources next and other queries try international sources.
- **ISBN-aware search** — paste an ISBN-10 or ISBN-13, with or without hyphens, for an exact match.
- **Choose your folder** — pick a default folder from your vault, or have Bookdrop ask every time you create a note.
- **Full-size covers** — Kakao results use the original cover image instead of the small thumbnail.
- **Conditional templates** — `{{#toc}}…{{/toc}}` keeps a section only when the book has that information.
- **Keyboard friendly** — ↑/↓ to move, Enter to choose. Enter is ignored while composing Korean (IME) text.
- **English and Korean** — interface and default templates in both languages; follows Obsidian or set it yourself.
- **Works on mobile** — all requests use Obsidian's built-in `requestUrl`.

## Commands

| Command | What it does |
|---|---|
| Search for a book and create a note | Search and create a new book note. Also available from the ribbon. |
| Insert book info at cursor | Insert a rendered block into the current note. |
| Fill current note's properties with book info | Add book properties to the active note. |

## Setup

Every source is optional — Google Books and Open Library work with no setup at all.

### Kakao Book Search

1. Sign in at [Kakao Developers](https://developers.kakao.com/console/app) and create an application.
2. Copy the **REST API key** from the app's keys page.
3. Paste it into **Settings → Bookdrop → Kakao REST API key** and press **Test connection**.

### Aladin

1. Get a free TTB key at [Aladin TTB](https://www.aladin.co.kr/ttb/wblog_manage.aspx) (Aladin account required).
2. Paste it into **Aladin TTB key** and press **Test connection**.

Results from Aladin show the credit line Aladin asks for ("도서 DB 제공: 알라딘 인터넷서점").

### National Library of Korea (optional)

Used only to fill in details by ISBN — page count, KDC classification, price, and table of contents.

1. Apply for a free key on the [ISBN bibliographic data API page](https://www.nl.go.kr/NL/contents/N31101030500.do).
2. Paste it into **National Library of Korea API key** and press **Test connection**.

### Google Books (optional key)

Google Books works without a key. If you search often and hit rate limits (HTTP 429), enable the **Books API** in Google Cloud Console, create an API key, and add it in settings. You can also restrict results to a language (e.g. `en`, `ko`).

### Filling in missing details

Under **Fill in missing details**, turn the feature on or off and choose which sources it may use. When two sources both have a value, the one listed first wins. Values the search result already has are never replaced, except a short or cut-off description, which is replaced by a longer one.

## Templates

Templates use `{{variable}}` placeholders with optional filters:

| Syntax | Output | Use for |
|---|---|---|
| `{{title}}` | The Courage to Be Disliked | Note body |
| `{{title:json}}` | `"The Courage to Be Disliked"` | Frontmatter — safe with colons and quotes |
| `{{authors:json}}` | `["Ichiro Kishimi","Fumitake Koga"]` | Frontmatter lists |
| `{{authors:link}}` | `[[Ichiro Kishimi]], [[Fumitake Koga]]` | Wikilinks in the body |
| `{{authors:linkjson}}` | `["[[Ichiro Kishimi]]","[[Fumitake Koga]]"]` | Wikilink lists in frontmatter |
| `{{toc:list}}` | `- Chapter 1`<br>`- Chapter 2` | Bullet list (arrays or multi-line text) |
| `{{#series}}Series: {{series}}{{/series}}` | Series: … (or nothing) | Text that appears only when the value exists |

**Variables:** `title`, `subtitle`, `originalTitle`, `author`, `authors`, `translator`, `translators`, `publisher`, `publishDate`, `publishYear`, `isbn`, `isbn10`, `isbn13`, `pageCount`, `series`, `kdc`, `categories`, `subjects`, `description`, `toc`, `coverUrl`, `link`, `price`, `language`, `source`, `sources`, `today`

The file name format is a template too — for example `{{title}} - {{author}}` or `{{publishYear}} {{title}}`. If a book has no cover, lines with an empty image link are removed automatically.

### Default note template (English)

The default template follows the interface language. Leave the template field empty to keep using the default; your own edits are kept when you switch languages.

```markdown
---
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
kdc: {{kdc:json}}
categories: {{categories:json}}
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
## Notes
```

### What each source provides

| Field | Kakao | Aladin | Google Books | Open Library | National Library* |
|---|:-:|:-:|:-:|:-:|:-:|
| Title, authors, publisher, date, ISBN, cover | ✓ | ✓ | ✓ | ✓ | ✓ |
| Translators | ✓ | ✓ | — | — | ✓ |
| Subtitle | — | ✓ | ✓ | ✓ | — |
| Original title, series | — | ✓ | — | — | series |
| Page count | — | ✓ | ✓ | ✓ | ✓ |
| Table of contents | — | ✓ | — | — | some books |
| Categories / subjects | — | categories | categories | subjects | KDC |
| Price | ✓ | ✓ | some books | — | ✓ |
| Description | Short excerpt | Full | Full | — | some books |

\* Used only to fill in details, not as a search source.

## Installation

**From Community Plugins:** Settings → Community plugins → Browse → search for **Bookdrop**.

**Manually:** download `main.js`, `manifest.json`, and `styles.css` from the [latest release](../../releases/latest) and copy them into `<your vault>/.obsidian/plugins/bookdrop/`. Then reload Obsidian and enable Bookdrop.

## Privacy and network use

Bookdrop sends your search query, or the chosen book's ISBN, only to the sources you use:

- `dapi.kakao.com` — Kakao Book Search, with your REST API key
- `www.aladin.co.kr` — Aladin, with your TTB key
- `www.googleapis.com` — Google Books, with your API key if you provide one
- `openlibrary.org` — Open Library (no key; requests identify the plugin by name as Open Library asks)
- `www.nl.go.kr` — National Library of Korea, with your API key

You can turn off any source in **Fill in missing details**. Cover images are loaded from each source's image servers. API keys are stored locally in the plugin's `data.json` inside your vault. Bookdrop collects no telemetry and sends nothing anywhere else.

## Development

```bash
npm install
npm run dev     # watch and rebuild main.js
npm run build   # type-check and build for release
```

## Support

If Bookdrop saves you time, you can support its development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/4h9fg59wsgd)

## License

[MIT](LICENSE)
