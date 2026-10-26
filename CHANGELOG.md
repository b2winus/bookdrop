# Changelog

## 0.5.2

- Ratings are also written as stars: *Rate this book* now sets `stars` (e.g. `★★★★½`) next to the numeric `rating`, and the bookshelf view shows the stars. New notes include an empty `stars` property.

## 0.5.1

- Build configuration: declare the ES2019/ES2020 library features the code uses (`Promise.allSettled`, `String.trimEnd`), so type checks no longer report them as unresolved. No change in behaviour.

## 0.5.0

- **Reading log:** commands to change the reading status, start or finish a book (with today's date), rate it (1–5, half stars), record pages read, and add quotes with page numbers. Stored as note properties: `status`, `started`, `finished`, `rating`, `progress`.
- **Bookshelf view:** one command creates a Bases file (Obsidian 1.9+) with a cover gallery and views for reading, read this year, finished and to read. You choose the file name; it is remembered for next time.
- New notes start with the reading properties and a *Quotes* section; new template variable `status`.
- Status words and the quotes heading can be changed in settings.
- Removed the National Library of Korea source.

## 0.4.0

- New search sources: **Aladin** (page count, table of contents, original title, series, categories for Korean books) and **Open Library** (international books, no key needed).
- **Fill in missing details:** after you choose a book, other sources — including the National Library of Korea — are checked by ISBN and only empty fields are filled. Choose which sources to use in settings.
- Smarter fallback: Korean queries try Korean sources next; other queries try international sources.
- New template variables: `originalTitle`, `series`, `kdc`, `subjects`, `toc`, `sources`.
- Templates: `{{#name}}…{{/name}}` keeps text only when the value exists; `{{name:list}}` makes a bullet list.
- Default templates now include original title, series, KDC, categories, and a table of contents section.

## 0.3.4

- Add a Buy Me a Coffee link (shown on the plugin page in Obsidian).

## 0.3.3

- Re-release so the release tag points at the commit with the updated `manifest.json` and `package-lock.json`.

## 0.3.2

- Fix `package-lock.json` so dependencies install with a plain `npm ci`.

## 0.3.1

- Settings use Obsidian's declarative settings API on 1.13+, so they appear in Obsidian's settings search. Older versions keep the classic settings page.
- Language detection uses Obsidian's `getLanguage()`. Minimum Obsidian version is now 1.8.7.
- Typed API responses (no unsafe `any` access).
- Build no longer depends on `builtin-modules`.
- Releases are built by GitHub Actions with artifact attestations.

## 0.3.0

- English and Korean interface and default templates.

## 0.2.0

- Choose the note folder from your vault, or be asked every time.

## 0.1.0

- First release: Kakao Book Search and Google Books, new book notes, insert at cursor, fill frontmatter.
