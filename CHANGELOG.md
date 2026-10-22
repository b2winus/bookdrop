# Changelog

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
