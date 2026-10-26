# Bookdrop

English | [한국어](README.ko.md)

**Drop a book into your vault.** Search by title, author, or ISBN, pick the right edition, and Bookdrop turns it into a clean, templated book note — cover, authors, publisher, ISBN, and description included.

Bookdrop searches four sources and can combine them:

- **Kakao Book Search** — fast, complete search for books published in Korea.
- **Aladin** — Korean bookstore data with page count, table of contents, original title, series, and categories.
- **Google Books** — broad international coverage.
- **Open Library** — free international catalog with page counts and subjects; no key needed.

After you pick a book, Bookdrop can look up its ISBN in the other sources and fill in whatever is still missing, so Korean and international books land in one consistent format. Then keep a **reading log** right in the note — status, dates, rating, pages read and quotes — and see it all on a **bookshelf** view.

The interface is available in **English and Korean**. It follows Obsidian's language by default, and you can switch it in settings.

## Features

- **Create a book note** — search, choose a result, and get a new note built from your template in the folder you choose.
- **Insert at cursor** — drop a book info block into the note you're writing. Select text first to search for it immediately.
- **Fill frontmatter** — complete the properties (author, publisher, ISBN, cover, link, …) of an existing note. The search is pre-filled from the note's `isbn`, `title`, or file name, and existing values are kept unless you choose to overwrite them.
- **Fill in missing details** — after you choose a book, other sources are checked by ISBN and only empty fields are filled (page count, table of contents, cover, full description…).
- **Smart fallback** — if a search finds nothing, Korean queries try Korean sources next and other queries try international sources.
- **ISBN-aware search** — paste an ISBN-10 or ISBN-13, with or without hyphens, for an exact match.
- **Choose your folder** — pick a default folder from your vault, or have Bookdrop ask every time you create a note.
- **Full-size covers** — Kakao results use the original cover image instead of the small thumbnail.
- **Conditional templates** — `{{#toc}}…{{/toc}}` keeps a section only when the book has that information.
- **Keyboard friendly** — ↑/↓ to move, Enter to choose. Enter is ignored while composing Korean (IME) text.
- **English and Korean** — interface and default templates in both languages; follows Obsidian or set it yourself.
- **Reading log** — status, start and finish dates, star rating, pages read and quotes, stored as note properties so Bases, Dataview and search can use them.
- **Bookshelf view** — one command creates a Bases file (Obsidian 1.9+) with a cover gallery and views for *reading*, *read this year*, *finished* and *to read*.
- **Works on mobile** — all requests use Obsidian's built-in `requestUrl`.

## Commands

| Command | What it does |
|---|---|
| Search for a book and create a note | Search and create a new book note. Also available from the ribbon. |
| Insert book info at cursor | Insert a rendered block into the current note. |
| Fill current note's properties with book info | Add book properties to the active note. |
| Change reading status | Pick *to read*, *reading*, *finished* or *stopped*. |
| Start reading this book / Mark this book as finished | Set the status and today's date in one step. |
| Rate this book | 1–5 stars (half stars by typing, e.g. 3.5). |
| Update reading progress | Record the page you reached; the last page marks the book finished. |
| Add a quote to this book | Add the selected text (or a quote you type) with its page under **Quotes**. |
| Create bookshelf view | Create a Bases file with a cover gallery of your books. |

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

**Variables:** `title`, `subtitle`, `originalTitle`, `author`, `authors`, `translator`, `translators`, `publisher`, `publishDate`, `publishYear`, `isbn`, `isbn10`, `isbn13`, `pageCount`, `series` `categories`, `subjects`, `description`, `toc`, `coverUrl`, `link`, `price`, `language`, `source`, `sources`, `status`, `today`

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
```

### What each source provides

| Field | Kakao | Aladin | Google Books | Open Library |
|---|:-:|:-:|:-:|:-:|
| Title, authors, publisher, date, ISBN, cover | ✓ | ✓ | ✓ | ✓ |
| Translators | ✓ | ✓ | — | — |
| Subtitle | — | ✓ | ✓ | ✓ |
| Original title, series | — | ✓ | — | — |
| Page count | — | ✓ | ✓ | ✓ |
| Table of contents | — | ✓ | — | — |
| Categories / subjects | — | categories | categories | subjects |
| Price | ✓ | ✓ | some books | — |
| Description | Short excerpt | Full | Full | — |

## Reading log

Run the reading commands from the command palette (or give them hotkeys) while a book note is open. They write these note properties:

| Property | Set by | Example |
|---|---|---|
| `status` | *Change reading status*, *Start reading*, *Mark as finished*, *Update reading progress* | `reading` |
| `started` | Starting a book (only if empty) | `2026-10-26` |
| `finished` | Finishing a book | `2026-11-20` |
| `rating` | *Rate this book* | `4.5` |
| `progress` | *Update reading progress* (set to the page count when you finish) | `120` |

- Status words can be changed under **Settings → Bookdrop → Reading log**. Both the English and Korean defaults are always recognised.
- **Quotes** go under the *Quotes* heading (also configurable), each with its page: `> quote` / `> — p. 23`. Select text first to use it as the quote.
- **Bookshelf view:** *Create bookshelf view* (or the button in settings) asks for a file name — *Bookshelf* by default, or anything you like — and creates that `.base` file in your book folder. The name is remembered for next time; if the file already exists, it is opened. It includes notes tagged `#book` or in the book folder. Bases needs Obsidian 1.9 or later.

## Installation

**From Community Plugins:** Settings → Community plugins → Browse → search for **Bookdrop**.

**Manually:** download `main.js`, `manifest.json`, and `styles.css` from the [latest release](../../releases/latest) and copy them into `<your vault>/.obsidian/plugins/bookdrop/`. Then reload Obsidian and enable Bookdrop.

## Privacy and network use

Bookdrop sends your search query, or the chosen book's ISBN, only to the sources you use:

- `dapi.kakao.com` — Kakao Book Search, with your REST API key
- `www.aladin.co.kr` — Aladin, with your TTB key
- `www.googleapis.com` — Google Books, with your API key if you provide one
- `openlibrary.org` — Open Library (no key; requests identify the plugin by name as Open Library asks)

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
