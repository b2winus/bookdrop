# Changelog

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
