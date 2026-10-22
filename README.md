# Bookdrop

English | [한국어](README.ko.md)

**Drop a book into your vault.** Search by title, author, or ISBN, pick the right edition, and Bookdrop turns it into a clean, templated book note — cover, authors, publisher, ISBN, and description included.

Bookdrop searches two sources:

- **Kakao Book Search** — the most complete data for books published in Korea, including translators and list price.
- **Google Books** — broad international coverage, with page counts, categories, and full descriptions.

If one source comes up empty, Bookdrop can automatically try the other, so Korean and international books both land in one consistent format.

The interface is available in **English and Korean**. It follows Obsidian's language by default, and you can switch it in settings.

## Features

- **Create a book note** — search, choose a result, and get a new note built from your template in the folder you choose.
- **Insert at cursor** — drop a book info block into the note you're writing. Select text first to search for it immediately.
- **Fill frontmatter** — complete the properties (author, publisher, ISBN, cover, link, …) of an existing note. The search is pre-filled from the note's `isbn`, `title`, or file name, and existing values are kept unless you choose to overwrite them.
- **ISBN-aware search** — paste an ISBN-10 or ISBN-13, with or without hyphens, for an exact match.
- **Choose your folder** — pick a default folder from your vault, or have Bookdrop ask every time you create a note.
- **Full-size covers** — Kakao results use the original cover image instead of the small thumbnail.
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

### Kakao Book Search (recommended for Korean books)

1. Sign in at [Kakao Developers](https://developers.kakao.com/console/app) and create an application.
2. Copy the **REST API key** from the app's keys page.
3. Paste it into **Settings → Bookdrop → Kakao REST API key** and press **Test connection**.

### Google Books (optional key)

Google Books works without a key. If you search often and hit rate limits (HTTP 429), enable the **Books API** in Google Cloud Console, create an API key, and add it in settings. You can also restrict results to a language (e.g. `en`, `ko`).

## Templates

Templates use `{{variable}}` placeholders with optional filters:

| Syntax | Output | Use for |
|---|---|---|
| `{{title}}` | The Courage to Be Disliked | Note body |
| `{{title:json}}` | `"The Courage to Be Disliked"` | Frontmatter — safe with colons and quotes |
| `{{authors:json}}` | `["Ichiro Kishimi","Fumitake Koga"]` | Frontmatter lists |
| `{{authors:link}}` | `[[Ichiro Kishimi]], [[Fumitake Koga]]` | Wikilinks in the body |
| `{{authors:linkjson}}` | `["[[Ichiro Kishimi]]","[[Fumitake Koga]]"]` | Wikilink lists in frontmatter |

**Variables:** `title`, `subtitle`, `author`, `authors`, `translator`, `translators`, `publisher`, `publishDate`, `publishYear`, `isbn`, `isbn10`, `isbn13`, `pageCount`, `categories`, `description`, `coverUrl`, `link`, `price`, `language`, `source`, `today`

The file name format is a template too — for example `{{title}} - {{author}}` or `{{publishYear}} {{title}}`. If a book has no cover, lines with an empty image link are removed automatically.

### Default note template (English)

The default template follows the interface language. Leave the template field empty to keep using the default; your own edits are kept when you switch languages.

```markdown
---
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
```

### What each source provides

| Field | Kakao | Google Books |
|---|:-:|:-:|
| Title, authors, publisher, date, ISBN, cover | ✓ | ✓ |
| Translators, list price | ✓ | — |
| Subtitle, page count, categories, language | — | ✓ |
| Description | Short excerpt | Full |

## Installation

**From Community Plugins:** Settings → Community plugins → Browse → search for **Bookdrop**.

**Manually:** download `main.js`, `manifest.json`, and `styles.css` from the [latest release](../../releases/latest) and copy them into `<your vault>/.obsidian/plugins/bookdrop/`. Then reload Obsidian and enable Bookdrop.

## Privacy and network use

Bookdrop sends your search query only to the source you search:

- `dapi.kakao.com` — Kakao Book Search, using your own REST API key
- `www.googleapis.com` — Google Books, with your API key if you provide one

Cover images are loaded from the publishers' image servers. API keys are stored locally in the plugin's `data.json` inside your vault. Bookdrop collects no telemetry and sends nothing anywhere else.

## Development

```bash
npm install
npm run dev     # watch and rebuild main.js
npm run build   # type-check and build for release
```

## License

[MIT](LICENSE)
