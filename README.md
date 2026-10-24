# Versedrop

Search a Bible reference and drop the passage into your note — in Korean, English, or both.

성경 구절을 검색해서 노트에 바로 넣어 주는 Obsidian 플러그인입니다. 한국어·영어 역본을 골라서, 또는 함께 넣을 수 있어요.

**[English](#english)** · **[한국어](#한국어)**

```markdown
> [!quote] 요한복음 3:16 (개역한글)
> ¹⁶하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라

> [!quote] John 3:16 (KJV) · [Logos](https://ref.ly/John3.16) · [Accordance](accord://read/John_3:16)
> ¹⁶For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.
```

---

# English

## Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Quick start](#quick-start)
4. [Writing references](#writing-references)
5. [The search window](#the-search-window)
6. [Inserting from a reference in your note](#inserting-from-a-reference-in-your-note)
7. [Hotkeys and presets](#hotkeys-and-presets)
8. [Translations](#translations)
9. [ESV and NET](#esv-and-net)
10. [Using your Accordance modules (Mac)](#using-your-accordance-modules-mac)
11. [개역개정 and other Korean Bible Society translations](#개역개정-and-other-korean-bible-society-translations)
12. [Logos and Accordance links](#logos-and-accordance-links)
13. [Adding other translations](#adding-other-translations)
14. [Copyright notices and quotation limits](#copyright-notices-and-quotation-limits)
15. [Output settings](#output-settings)
16. [Troubleshooting](#troubleshooting)
17. [Network and system access](#network-and-system-access)

## Features

- Type a reference in Korean or English — `요 3:16`, `요한복음 3장 16절`, `John 3:16`, `1 Cor 13:4-7`
- Korean, English, **Chinese, Japanese, Greek and Hebrew** — pick languages with one click and compare translations side by side
- Tick the translations you want and insert them in one go; your picks are remembered
- **Hotkeys and presets:** set hotkeys right from the plugin settings, insert without opening a window, and save translation sets (e.g. *Original languages*) as their own commands
- **ESV** with your own free API key and **NET** from its official API, alongside public-domain KJV, WEB, BSB and more
- **Accordance (Mac):** pull text from Bible modules you own in Accordance — 개역개정, NIV, NASB and more
- **Copyright notices added automatically** for copyrighted translations, plus a warning for long quotations
- **Logos & Accordance links:** each passage can link straight to the same passage in your Bible software
- Add any translation from bolls.life (Chinese, German, Spanish …) or from a JSON file in your vault
- Callout, blockquote or plain text output, with options for verse numbers, line breaks and bilingual grouping
- Interface and built-in help in Korean and English, following Obsidian's language setting

## Installation

Requires **Obsidian 1.13 or later**.

**From Community plugins** (once listed): Settings → Community plugins → Browse → search **Versedrop** → Install → Enable.

**Manually:**

1. Download `main.js`, `manifest.json` and `styles.css` from the latest release.
2. Create the folder `<your vault>/.obsidian/plugins/versedrop/` and put the three files in it.
   On macOS, `.obsidian` is hidden — press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd> in Finder to show it.
3. Restart Obsidian (or reload plugins in Settings → Community plugins).
4. Enable **Versedrop** in Settings → Community plugins. If this is your first community plugin, turn off *Restricted mode* first.

**Recommended:** assign a hotkey — Settings → Versedrop → *Hotkeys and presets* → **Set hotkey** (see [Hotkeys and presets](#hotkeys-and-presets)).

## Quick start

1. Put your cursor where the passage should go.
2. Press your hotkey (or run **Search and insert Bible passage** from the command palette, <kbd>Cmd/Ctrl</kbd>+<kbd>P</kbd>).
3. Type `John 3:16` and press <kbd>Enter</kbd>.
4. Tick the translations you want.
5. Press <kbd>Cmd/Ctrl</kbd>+<kbd>Enter</kbd> or click **Insert**.

## Writing references

Korean, English, Chinese (simplified or traditional) and Japanese book names, full or abbreviated, are all understood. Spaces are optional.

| What you want | Examples |
|---|---|
| One verse | `John 3:16` · `Jn 3.16` · `요 3:16` · `요3:16` |
| A range | `1 Cor 13:4-7` · `고전 13:4-7` · `요 3장 16~18절` |
| Several parts of a chapter | `Rom 8:28, 31-39` · `롬 8:28, 31-39` |
| A whole chapter | `Ps 23` · `시 23` · `시편 23편` |
| Korean long form | `요한복음 3장 16절` |
| Chinese | `约翰福音 3:16` · `約翰福音3章16節` · `约3:16` · `林前13:4-7` |
| Japanese | `ヨハネによる福音書 3:16` · `ヨハ3章16節` · `1コリ13:4-7` |

Book abbreviations follow common usage: English SBL-style (`Gen`, `Exod`, `1 Sam`, `Phil`, `Phlm`, `Rev`) and the Korean Bible Society style (`창`, `출`, `삼상`, `빌`, `몬`, `계`). Full names like `Philippians` or `빌립보서` also work.

A reference must stay within one chapter — `John 3:16-4:2` is not supported yet; search the two chapters separately.

## The search window

- **Search box** — type a reference and press <kbd>Enter</kbd>.
- **Language chips** — one chip per language in *My translations* (Korean, English, Chinese, Japanese, Greek, Hebrew). Click to turn languages on or off; **All** shows every language. Your choice is remembered next time.
- Greek texts contain only the New Testament and Hebrew WLC only the Old Testament, so their cards appear only when the book is in them.
- **Translation cards** — one card per enabled translation, showing the text with verse numbers. The checkbox on each card decides whether it is inserted. Checked cards are highlighted, and your choices are remembered next time.
- **Insert** — inserts every checked card that loaded successfully. Shortcut: <kbd>Cmd/Ctrl</kbd>+<kbd>Enter</kbd>.

Cards load independently, so a slow or failing translation never blocks the others. If a card shows an error, the message explains what to do.

## Inserting from a reference in your note

Already wrote `Titus 2:11-14` in your sermon notes? Put the cursor on that line (or select the reference) and press your hotkey. The search runs automatically, and the passage is inserted **below** that line, leaving your reference in place. This makes it easy to write an outline with references first and fill in the text later. A line counts as a reference when it contains only the reference (a leading `-`, `*` or `>` is fine).

## Hotkeys and presets

Settings → Versedrop → **Hotkeys and presets** lists every Versedrop command with its current hotkey. **Set hotkey** opens Obsidian's Hotkeys screen filtered to Versedrop: click **+** next to the command and press the keys you want.

| Command | What it does |
|---|---|
| **Search and insert Bible passage** | Opens the search window (pre-filled when the cursor is on a reference) |
| **Insert in default translations (no window)** | Inserts the reference at the cursor in your ☑ default translations straight away — the fastest way to fill an outline. Opens the search window if there is no reference. |
| **Preset: …** | One command per preset (see below) |

**Presets** are named sets of translations you use together — for example *Korean–English* (개역한글 + ESV) or *Original languages* (SBLGNT + WLC). Click **Add preset**, name it, and click the translation chips to include. Each preset becomes its own command, so it can have its own hotkey:

- on a reference → inserts it in the preset's translations right away;
- anywhere else → opens the search window with the preset's translations selected (your normal defaults are left unchanged).

Suggested setup: <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> for the search window, <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> for "no window", and <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> for an *Original languages* preset. (Check that the keys aren't already used — the Hotkeys screen warns you about conflicts.)

## Translations

| Language | Translation | Source | Status | On by default |
|---|---|---|---|---|
| Korean | 개역한글 (KRV, 1961) | bolls.life | Copyright term expired | ✓ |
| Korean | 새번역 (RNKSV) | bolls.life | © Korean Bible Society — personal study only | — |
| English | King James Version (KJV) | bolls.life | Public domain | ✓ |
| English | World English Bible (WEB) | bolls.life | Public domain | ✓ |
| English | Berean Standard Bible (BSB) | bolls.life | Public domain | ✓ |
| English | New English Translation (NET) | NET Bible API | © Biblical Studies Press — free quotation with notice | ✓ |
| English | English Standard Version (ESV) | ESV API | © Crossway — needs your free API key | ✓ (once a key is set) |
| English | American Standard Version (ASV) | bolls.life | Public domain | ✓ |
| English | Young's Literal Translation (YLT) | bolls.life | Public domain | ✓ |
| English | Literal Standard Version (LSV) | bolls.life | CC BY-SA 4.0 | — |
| English | Geneva Bible 1599 (GNV) | bolls.life | Public domain | — |
| English | Douay-Rheims (DRB) | bolls.life | Public domain | — |
| Chinese | 和合本 (CUV, 1919, traditional) | bolls.life | Public domain | — |
| Japanese | 口語訳 (1954/55) | bolls.life | Out of copyright in Japan | — |
| Greek | SBL Greek New Testament (SBLGNT) | bolls.life | © 2010 SBL & Logos — free with attribution · NT | — |
| Greek | Textus Receptus (Elzevir 1624) | bolls.life | Public domain · NT | — |
| Greek | Tischendorf 8th ed. | bolls.life | Public domain · NT | — |
| Hebrew | Westminster Leningrad Codex (WLC) | bolls.life | Public domain · OT | — |
| Hebrew | WLC with accents | bolls.life | Public domain · OT | — |
| Hebrew | Delitzsch Hebrew NT (1877) | bolls.life | Public domain · NT | — |

### Chinese, Japanese, Greek and Hebrew

Add them from the **Add a translation** (+) menu (each language has its own group), and a chip for that language appears in the search window.

- **Book names in headers** follow the language: 約翰福音 3:16 (traditional, 和合本), ヨハネによる福音書 3:16 (口語訳). Greek and Hebrew texts use English book names, as in academic writing.
- **Hebrew** cards are shown right-to-left. Hebrew versification sometimes differs from English Bibles (e.g. psalm titles counted as verse 1, Malachi 4 = Malachi 3:19–24), so check the verse number if a Hebrew card looks off by one.
- **SBLGNT** always gets its required notice.
- **Copyrighted editions** — 新标点和合本 (simplified), 新共同訳, 新改訳, NA28, UBS5, Rahlfs LXX, BHS — are not built in. If you own them in Accordance, add them as Accordance modules; Versedrop recognises them and adds the right copyright notice. (They can also be added by bolls.life code at your own discretion, e.g. `CUNPS`, `JPNICT`.)

### Choosing your translations

Settings → *My translations* lists only the translations you use — the ones ticked "On by default" above to start with.

- **Add a translation** — click **+** in the list header and pick one. The menu is grouped by language, with *Add your own* (Accordance module, bolls.life code, JSON file) at the end.
- ☑ — selected for insertion by default
- drag — change the order; translations appear in this order in the search window and in your notes
- ✎ — edit a translation you added yourself (name, code/module/path, language, copyright notice)
- delete — remove it from the list (built-ins can be added back from the + menu any time)

Translations such as 개역개정, 공동번역, NIV or NASB have no free source. You can still use them through [your Accordance modules](#using-your-accordance-modules-mac) or a [JSON file](#adding-other-translations) you are licensed to use.

## ESV and NET

**ESV** comes from Crossway's official [ESV API](https://api.esv.org), which is free for non-commercial use with your own key:

1. Create a free account at [api.esv.org](https://api.esv.org) and choose **Create an API Application** (describe it as personal Bible study in Obsidian).
2. Copy the API key.
3. Settings → Versedrop → *My translations*: make sure ESV is in the list (add it from the + menu if you removed it), then paste the key into **ESV API key** in the ESV section below the list. ESV now appears in the search window.

Crossway's terms apply: non-commercial use only, at most 500 verses per request, and the copyright notice with a link to esv.org is always added under ESV quotations. Versedrop keeps no more than 500 ESV verses in its memory cache.

**NET** comes from the official [NET Bible API](https://labs.bible.org) and needs no key. As its terms ask, "NET" in the header links to netbible.org and the copyright notice is always added.

## Using your Accordance modules (Mac)

If you own Bible modules in [Accordance](https://www.accordancebible.com), Versedrop can fetch text from them directly — nothing else to install. Text travels only between Accordance and Obsidian on your Mac and is never sent over the internet, so you stay within your own license.

**Requirements:** macOS, the Obsidian desktop app, and Accordance with the modules installed. (Not available on Windows, Linux, iOS or Android.)

**Setup:**

1. Settings → Versedrop → *My translations* → **+** → **Add an Accordance module… (Mac)**.
2. Enter:
   - **Name** — what you want to see, e.g. `ESV` or `개역개정`.
   - **Accordance module** — exactly as Accordance shows it in the Library or a text tab (case and hyphens matter), e.g. `ESVS`.
   - **Language** — which language chip it appears under.
3. Click **Test connection**. Versedrop asks Accordance for John 3:16.
4. The first time, macOS asks *"Obsidian wants access to control Accordance"* — click **Allow**.
5. A notice shows the verse when it works. Repeat for each module.

**If you clicked "Don't Allow":** System Settings → Privacy & Security → Automation → Obsidian → turn on **Accordance**.

**Good to know:**

- If Accordance isn't running, the first request launches it and takes a few seconds. Whole chapters (e.g. `Ps 119`) are fetched verse by verse and take a little longer.
- Books are sent to Accordance by their English names, so Korean searches like `요 3:16` work with Korean modules too.
- Well-known translations (개역개정, 공동번역, ESV, NIV, NASB, NLT, CSB, NKJV, NRSV, NA28, BHS …) get their copyright notice automatically; you can type your own in the translation's editor.

## 개역개정 and other Korean Bible Society translations

개역개정, 공동번역, 새번역 and 새한글성경 are copyrighted by the Korean Bible Society, which licenses Bible text in software, apps and on the web separately ([permission conditions](https://www.bskorea.or.kr/bbs/content.php?co_id=subpage2_3_4_3)). Versedrop therefore does not download these texts from the Society's website.

- **Recommended:** connect your own 개역개정 module in Accordance (see above). Name it `개역개정` and the notice *성경전서 개역개정판 © 대한성서공회* is added automatically.
- Or connect a JSON file you are licensed to use.
- 새번역 is available from bolls.life but **off by default**; turn it on only for personal study.

## Logos and Accordance links

Logos offers no official way for other apps to read Bible text, and its resources are encrypted, so Versedrop can't fetch text from Logos. Instead it can add a link next to every passage that opens it in your Logos — and the same for Accordance.

1. Settings → *Logos · Accordance links* → **Add links**: choose **Logos**, **Accordance** or **Both**.
2. **Logos version** — the version to open, e.g. `ESV` or `NASB95`. Leave it empty to use your preferred Bible in Logos.
3. **Accordance link module** — the module to open, e.g. `ESVS`. Leave it empty for your default text. Passages fetched from an Accordance module always link to that module.

```markdown
> [!quote] Romans 8:28, 31-39 (WEB) · [Logos](https://ref.ly/Rom8.28-39;ESV) · [Accordance](accord://read/ESVS?Romans_8:28-39)
```

- Logos links use [ref.ly](https://ref.ly) and open in Logos desktop, mobile or the web app.
- Accordance links use `accord://` and open the Accordance app on that computer.
- A link covers one continuous span, so `Rom 8:28, 31-39` links to 8:28–39.

## Adding other translations

The *Add your own* group at the bottom of the **Add a translation** (+) menu offers three kinds:

**bolls.life translation** — enter a display name and the bolls.life code. Useful for further languages:

| Code | Translation |
|---|---|
| `LUT` | Luther 1912 (German) |
| `RV1960` | Reina-Valera 1960 (Spanish) |

The full list is at <https://bolls.life/static/bolls/app/views/languages.json>. Please respect each translation's license.

**JSON file** — put a Bible JSON file you are licensed to use somewhere in your vault and enter its path, e.g. `Bibles/esv.json`. Three layouts are recognised:

```jsonc
// A. array (bolls.life dump format)
[{ "book": 43, "chapter": 3, "verse": 16, "text": "..." }]

// B. nested — book number or name → chapter → verse
{ "43": { "3": { "16": "..." } } }

// C. flat keys — Korean or English abbreviations
{ "요3:16": "...", "John 3:16": "..." }
```

Book numbers run from 1 (Genesis) to 66 (Revelation). HTML tags and `<heading>`-style section titles are removed automatically. After replacing a file, click **Clear cache**.

**Accordance module** — see [above](#using-your-accordance-modules-mac).

Translations you add yourself open in an editor (name, code/module/path, language, **Copyright notice**). Click **Done** to fold it, and ✎ to open it again.

## Copyright notices and quotation limits

Quoting a few verses with attribution in sermon notes or personal study is ordinary quotation: your own writing is the main content, the source is credited, and you don't copy excessively. Versedrop helps you stay there:

- **Copyright notices** (Settings → *Output*): *Copyrighted translations* (default) adds the notice under every copyrighted translation; *All translations* also labels public-domain ones; *Off* removes them — except for ESV and NET, whose terms require a notice every time.
- **Long quotation warning**: when you insert more than 50 verses (adjustable; 0 turns it off) of a copyrighted translation at once, Versedrop reminds you of the limits.
- The search window shows each copyrighted translation's notice under its card.

You may need the publisher's permission if you keep collecting passages into what is effectively a text database, publish your notes (e.g. on a website), or put large portions into teaching materials or publications.

```markdown
> [!quote] 요한복음 3:16 (개역개정)
> ¹⁶하나님이 세상을 이처럼 사랑하사 …
>
> *성경전서 개역개정판 © 대한성서공회*
```

## Output settings

| Setting | What it does |
|---|---|
| **Block style** | **Callout** (default), **Blockquote** (reference at the bottom), or **Plain text** |
| **Callout type** | The callout name, e.g. `quote`, `bible`, `note`. Custom names work with your own CSS. |
| **Group translations into one block** | Off: one block per translation. On: one block titled by the reference with each translation labelled — handy for side-by-side Korean/English |
| **Header format** | Template for the block title. Variables: `{ref}` `{book}` `{chapter}` `{verses}` `{version}` `{abbr}`. Default `{ref} ({abbr})` → *John 3:16 (KJV)* |
| **Book names** | Full (*요한복음 / John*) or short (*요 / John*, *창 / Gen*) |
| **Verse numbers** | Hidden, plain (`16 For God…`) or superscript (`¹⁶For God…`) |
| **One verse per line** | Each verse on its own line — good for psalms and poetry |

Non-contiguous verses are joined with `…`. For example, `Rom 8:28, 31-39` produces verse 28, `…`, then verses 31–39.

Grouped example:

```markdown
> [!quote] 요한복음 3:16 · John 3:16
> **개역한글**
> ¹⁶하나님이 세상을 이처럼 사랑하사 …
>
> **King James Version**
> ¹⁶For God so loved the world …
```

## Troubleshooting

| Problem | What to do |
|---|---|
| "No book matches …" | Try another spelling: `John`, `Jn`, `요`, `요한복음`. |
| A card shows a network error | Check your internet connection, then search again. |
| Text looks wrong or outdated | Settings → **Clear cache**. |
| "Obsidian isn't allowed to control Accordance" | System Settings → Privacy & Security → Automation → Obsidian → turn on Accordance. |
| "Accordance found no text in module …" | The abbreviation must match Accordance exactly, including case and hyphens. |
| "Accordance found no text in module …" | The abbreviation must match Accordance exactly, including case and hyphens. |
| Accordance is slow the first time | It is launching; later requests are faster. You can open Accordance beforehand. |
| Accordance button is greyed out | Accordance integration only works in the desktop app on macOS. |
| A translation doesn't appear | Check that it is in *My translations* and that you're on the right language tab. Your own translations need both a name and a code/path/module. |
| ESV doesn't appear | Add ESV to *My translations* and paste your key into *ESV API key* under it. |
| "The ESV API key was rejected" | Copy the key again from your application page at api.esv.org. |
| A notice is missing for my Accordance module | Type it into the row's *Copyright notice* field. |

The plugin's settings tab also has a **Help** section at the bottom covering the same topics.

## Network and system access

- **Network:** text is fetched from [bolls.life](https://bolls.life), the [NET Bible API](https://labs.bible.org) and — only if you add your key — the [ESV API](https://api.esv.org). Only the translation, book and chapter (or passage) are sent; your ESV key is sent only to api.esv.org.
- **Local only:** JSON files and Accordance modules are read on your device; nothing is sent over the network.
- **Accordance (macOS):** runs `osascript` through Node's `execFile` (no shell) with a fixed AppleScript that asks Accordance for verse text; the module and reference are passed as arguments. It is loaded only when you use an Accordance translation on a Mac, and macOS asks for your permission the first time.
- Fetched passages are cached in memory until Obsidian restarts.

---

# 한국어

## 목차

1. [주요 기능](#주요-기능)
2. [설치하기](#설치하기)
3. [빠르게 시작하기](#빠르게-시작하기)
4. [구절 입력 방법](#구절-입력-방법)
5. [검색 창 사용법](#검색-창-사용법)
6. [노트에 적어 둔 구절로 바로 가져오기](#노트에-적어-둔-구절로-바로-가져오기)
7. [단축키와 프리셋](#단축키와-프리셋)
8. [기본 제공 역본](#기본-제공-역본)
9. [ESV와 NET](#esv와-net)
10. [Accordance 역본 연결하기 (Mac)](#accordance-역본-연결하기-mac)
11. [개역개정 등 대한성서공회 역본](#개역개정-등-대한성서공회-역본)
12. [Logos·Accordance 링크](#logosaccordance-링크)
13. [다른 역본 추가하기](#다른-역본-추가하기)
14. [출처 표기와 인용 범위](#출처-표기와-인용-범위)
15. [삽입 형식 설정](#삽입-형식-설정)
16. [문제 해결](#문제-해결)
17. [네트워크와 시스템 접근](#네트워크와-시스템-접근)

## 주요 기능

- 한글이나 영어로 구절 입력 — `요 3:16`, `요한복음 3장 16절`, `John 3:16`, `고전 13:4-7`
- 한국어·영어에 더해 **중국어·일본어·헬라어·히브리어** — 언어를 클릭 한 번으로 골라 역본을 나란히 비교
- 원하는 역본만 체크해서 한 번에 삽입 (선택은 다음에도 기억됨)
- **단축키와 프리셋:** 플러그인 설정에서 바로 단축키 지정, 창 없이 바로 삽입, 자주 쓰는 역본 조합(예: *원어 대조*)을 명령으로 저장
- 공개 역본(KJV, WEB, BSB 등)에 더해 **ESV**(개인 무료 API 키)와 **NET**(공식 API) 지원
- **Accordance (Mac):** Accordance에서 구입한 역본(개역개정, NIV, NASB 등)의 본문을 바로 가져오기
- 저작권 역본에 **출처 문구 자동 표기**, 많은 분량을 인용하면 경고
- **Logos·Accordance 링크:** 구절마다 내 성경 프로그램에서 바로 열리는 링크 추가
- bolls.life의 다른 언어 역본(중국어, 독일어, 스페인어 등)이나 볼트 안 JSON 파일로 역본 추가
- 콜아웃·인용문·일반 텍스트 형식, 절 번호, 줄바꿈, 한영 병기 묶기 옵션
- Obsidian 언어 설정에 따라 한국어/영어 화면과 도움말 제공

## 설치하기

**Obsidian 1.13 이상**이 필요해요.

**커뮤니티 플러그인에서** (등록 후): 설정 → 커뮤니티 플러그인 → 탐색 → **Versedrop** 검색 → 설치 → 활성화.

**직접 설치:**

1. 최신 릴리스에서 `main.js`, `manifest.json`, `styles.css`를 내려받습니다.
2. `<내 볼트>/.obsidian/plugins/versedrop/` 폴더를 만들고 세 파일을 넣습니다.
   Mac에서는 `.obsidian`이 숨김 폴더예요. Finder에서 <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd>을 누르면 보입니다.
3. Obsidian을 다시 시작하거나, 설정 → 커뮤니티 플러그인에서 새로고침합니다.
4. 설정 → 커뮤니티 플러그인에서 **Versedrop**을 켭니다. 커뮤니티 플러그인을 처음 쓰신다면 *제한 모드*를 먼저 꺼 주세요.

**추천:** 단축키를 지정해 두세요. 설정 → Versedrop → *단축키와 프리셋* → **단축키 지정** ([단축키와 프리셋](#단축키와-프리셋) 참고).

## 빠르게 시작하기

1. 구절을 넣을 자리에 커서를 둡니다.
2. 단축키를 누릅니다. 단축키가 없다면 명령 팔레트(<kbd>Cmd/Ctrl</kbd>+<kbd>P</kbd>)에서 **성경 구절 검색해서 삽입**을 실행하세요.
3. `요 3:16`을 입력하고 <kbd>Enter</kbd>를 누릅니다.
4. 넣고 싶은 역본을 체크합니다.
5. <kbd>Cmd/Ctrl</kbd>+<kbd>Enter</kbd>를 누르거나 **삽입**을 클릭하면 끝!

## 구절 입력 방법

한글·영어·중국어(간체/번체)·일본어 책 이름, 전체 이름·약어 모두 알아들어요. 띄어쓰기는 있어도 없어도 됩니다.

| 원하는 것 | 입력 예 |
|---|---|
| 한 절 | `요 3:16` · `요3:16` · `John 3:16` · `Jn 3.16` |
| 연속된 절 | `고전 13:4-7` · `요 3장 16~18절` · `1 Cor 13:4-7` |
| 떨어진 절 여러 개 | `롬 8:28, 31-39` · `Rom 8:28, 31-39` |
| 장 전체 | `시 23` · `시편 23편` · `Ps 23` |
| 한글 풀어 쓰기 | `요한복음 3장 16절` |
| 중국어 | `约翰福音 3:16` · `約翰福音3章16節` · `约3:16` · `林前13:4-7` |
| 일본어 | `ヨハネによる福音書 3:16` · `ヨハ3章16節` · `1コリ13:4-7` |

약어는 대한성서공회 방식(`창`, `출`, `삼상`, `빌`, `몬`, `계` 등)과 영어 SBL 방식(`Gen`, `Exod`, `1 Sam`, `Phil`, `Phlm`, `Rev` 등)을 모두 지원해요. `빌립보서`, `Philippians` 같은 전체 이름도 됩니다.

한 번에 한 장 안의 구절만 검색할 수 있어요. `요 3:16-4:2`처럼 장을 넘는 범위는 아직 지원하지 않으니 두 번 나눠서 검색해 주세요.

## 검색 창 사용법

- **검색창** — 구절을 입력하고 <kbd>Enter</kbd>.
- **언어 버튼** — *내 역본*에 있는 언어마다 버튼이 생겨요(한국어, 영어, 중국어, 일본어, 헬라어, 히브리어). 눌러서 켜고 끄고, **전체**를 누르면 모든 언어가 보여요. 고른 언어는 다음에도 그대로 유지돼요.
- 헬라어 역본은 신약만, 히브리어 WLC는 구약만 들어 있어서, 그 책이 있는 경우에만 카드가 나타나요.
- **역본 카드** — 켜 둔 역본마다 카드가 하나씩 생기고, 절 번호와 함께 본문이 보여요. 카드의 체크박스로 삽입할지 정합니다. 체크한 카드는 강조 표시되고, 선택은 다음번에도 그대로 유지돼요.
- **삽입** — 체크했고 정상적으로 불러온 카드를 모두 넣습니다. 단축키는 <kbd>Cmd/Ctrl</kbd>+<kbd>Enter</kbd>.

카드는 각각 따로 불러오기 때문에, 한 역본이 느리거나 오류가 나도 다른 역본에는 영향이 없어요. 오류가 나면 카드에 해결 방법이 함께 표시됩니다.

## 노트에 적어 둔 구절로 바로 가져오기

설교 원고에 `딛 2:11-14`라고 적어 두셨나요? 그 줄에 커서를 두거나 구절을 드래그로 선택하고 단축키를 누르세요. 검색이 자동으로 실행되고, 본문은 그 줄 **아래**에 들어가요. 적어 둔 구절 표기는 그대로 남습니다. 개요와 본문 구절을 먼저 쭉 적어 두고 나중에 본문을 하나씩 채울 때 편해요. 줄에 구절 표기만 있을 때 구절로 인식해요(앞의 `-`, `*`, `>`는 괜찮아요).

## 단축키와 프리셋

설정 → Versedrop → **단축키와 프리셋**에 Versedrop 명령과 지금 지정된 단축키가 모두 보여요. **단축키 지정**을 누르면 Obsidian 단축키 화면이 Versedrop 명령만 걸러서 열려요. 명령 옆의 **+** 를 누르고 원하는 키를 누르면 끝이에요.

| 명령 | 하는 일 |
|---|---|
| **성경 구절 검색해서 삽입** | 검색 창을 열어요 (커서가 구절 위에 있으면 자동 검색) |
| **기본 역본으로 바로 삽입 (창 없이)** | 커서가 있는 구절을 ☑ 기본 선택 역본으로 창 없이 바로 넣어요. 설교 개요를 채울 때 가장 빨라요. 구절이 없으면 검색 창이 열려요. |
| **프리셋: …** | 프리셋마다 하나씩 생기는 명령 (아래 참고) |

**프리셋**은 함께 쓰는 역본 조합에 이름을 붙인 거예요. 예: *한영 대조*(개역한글 + ESV), *원어 대조*(SBLGNT + WLC). **프리셋 추가**를 누르고 이름을 적은 뒤, 넣을 역본 버튼을 눌러 고르세요. 프리셋마다 명령이 따로 생겨서 단축키도 따로 지정할 수 있어요.

- 구절 위에서 실행하면 → 프리셋 역본으로 바로 넣고,
- 그 밖의 곳에서 실행하면 → 프리셋 역본이 선택된 검색 창이 열려요 (평소 기본 선택은 바뀌지 않아요).

추천 설정: 검색 창은 <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>, 창 없이 바로 삽입은 <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>, *원어 대조* 프리셋은 <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>. (이미 쓰는 키인지 확인하세요. 겹치면 단축키 화면에서 알려 줘요.)

## 기본 제공 역본

| 언어 | 역본 | 가져오는 곳 | 저작권 | 기본 켜짐 |
|---|---|---|---|---|
| 한국어 | 개역한글 (1961) | bolls.life | 저작권 보호기간 만료 | ✓ |
| 한국어 | 새번역 | bolls.life | © 대한성서공회 — 개인 묵상·연구용 | — |
| 영어 | King James Version (KJV) | bolls.life | 퍼블릭 도메인 | ✓ |
| 영어 | World English Bible (WEB) | bolls.life | 퍼블릭 도메인 | ✓ |
| 영어 | Berean Standard Bible (BSB) | bolls.life | 퍼블릭 도메인 | ✓ |
| 영어 | New English Translation (NET) | NET Bible 공식 API | © Biblical Studies Press — 출처 표기 시 무료 인용 | ✓ |
| 영어 | English Standard Version (ESV) | ESV 공식 API | © Crossway — 개인 무료 API 키 필요 | ✓ (키 입력 후) |
| 영어 | American Standard Version (ASV) | bolls.life | 퍼블릭 도메인 | ✓ |
| 영어 | Young's Literal Translation (YLT) | bolls.life | 퍼블릭 도메인 | ✓ |
| 영어 | Literal Standard Version (LSV) | bolls.life | CC BY-SA 4.0 | — |
| 영어 | Geneva Bible 1599 (GNV) | bolls.life | 퍼블릭 도메인 | — |
| 영어 | Douay-Rheims (DRB) | bolls.life | 퍼블릭 도메인 | — |
| 중국어 | 和合本 (CUV, 1919, 번체) | bolls.life | 퍼블릭 도메인 | — |
| 일본어 | 口語訳 (1954/55) | bolls.life | 일본에서 저작권 보호기간 만료 | — |
| 헬라어 | SBL Greek New Testament (SBLGNT) | bolls.life | © 2010 SBL & Logos — 출처 표기 시 무료 · 신약 | — |
| 헬라어 | Textus Receptus (Elzevir 1624) | bolls.life | 퍼블릭 도메인 · 신약 | — |
| 헬라어 | Tischendorf 8판 | bolls.life | 퍼블릭 도메인 · 신약 | — |
| 히브리어 | Westminster Leningrad Codex (WLC) | bolls.life | 퍼블릭 도메인 · 구약 | — |
| 히브리어 | WLC (악센트 포함) | bolls.life | 퍼블릭 도메인 · 구약 | — |
| 히브리어 | Delitzsch 히브리어 신약 (1877) | bolls.life | 퍼블릭 도메인 · 신약 | — |

### 중국어·일본어·헬라어·히브리어

**역본 추가**(+) 메뉴에서 언어별 묶음으로 고르면 추가되고, 검색 창에 그 언어 버튼이 생겨요.

- **제목의 책 이름**은 역본 언어를 따라가요: 約翰福音 3:16 (和合本, 번체), ヨハネによる福音書 3:16 (口語訳). 헬라어·히브리어 원문은 학술 관례대로 영어 책 이름을 써요.
- **히브리어** 카드는 오른쪽에서 왼쪽으로 표시돼요. 히브리어 성경은 절 구분이 한국어·영어 성경과 다른 곳이 있어요(예: 시편 표제가 1절로 셈, 말라기 4장 = 말라기 3:19–24). 히브리어 카드가 한 절씩 어긋나 보이면 절 번호를 확인해 보세요.
- **SBLGNT**는 이용 조건에 따라 출처 문구가 항상 붙어요.
- **저작권 판본** — 新标点和合本(간체), 新共同訳, 新改訳, NA28, UBS5, Rahlfs LXX, BHS — 은 기본으로 넣지 않았어요. Accordance에 가지고 계시면 Accordance 모듈로 추가하세요. Versedrop이 알아보고 맞는 출처 문구를 자동으로 붙여요. (bolls.life 코드 `CUNPS`, `JPNICT` 등으로 직접 추가할 수도 있지만 저작권은 직접 확인해 주세요.)

### 내 역본 고르기

설정 → *내 역본*에는 내가 쓰는 역본만 보여요. 처음에는 위 표에서 "기본 켜짐"이 ✓인 역본들이 들어 있어요.

- **역본 추가** — 목록 머리의 **+** 를 눌러 고르면 바로 추가돼요. 한국어, English, *직접 추가*(Accordance 모듈, bolls.life 코드, JSON 파일)로 묶여 있어요.
- ☑ — 처음부터 삽입 대상으로 선택
- 끌어서 순서 바꾸기 — 이 순서대로 검색 창과 노트에 들어가요.
- ✎ — 직접 추가한 역본 편집 (이름, 코드/모듈/경로, 언어, 출처 문구)
- 삭제 — 목록에서 빼기 (기본 역본은 언제든 + 메뉴에서 다시 추가할 수 있어요)

개역개정, 공동번역, NIV, NASB 같은 역본은 무료로 가져올 수 있는 공개 소스가 없어요. 대신 [Accordance 모듈](#accordance-역본-연결하기-mac)이나 사용 권한이 있는 [JSON 파일](#다른-역본-추가하기)로 연결할 수 있습니다.

## ESV와 NET

**ESV**는 Crossway의 공식 [ESV API](https://api.esv.org)에서 가져와요. 비영리 용도라면 개인 키를 무료로 받을 수 있어요.

1. [api.esv.org](https://api.esv.org)에서 무료 계정을 만들고 **Create an API Application**을 누르세요. 용도는 "Obsidian에서 개인 성경 공부"처럼 적으면 돼요.
2. 발급된 API 키를 복사합니다.
3. 설정 → Versedrop → *내 역본*에 ESV가 있는지 확인하고(뺐다면 + 메뉴에서 다시 추가), 목록 아래 ESV 항목의 **ESV API 키** 칸에 붙여 넣으면 검색 창에 ESV가 나타나요.

Crossway 조건에 따라 비영리 용도로만 쓸 수 있고, 한 번에 500절까지 가져올 수 있어요. ESV 인용 아래에는 출처 문구와 esv.org 링크가 항상 붙고, Versedrop은 ESV 본문을 메모리에 500절 넘게 보관하지 않아요.

**NET**은 공식 [NET Bible API](https://labs.bible.org)에서 가져오며 키가 필요 없어요. NET 조건에 따라 제목의 "NET"이 netbible.org로 연결되고 출처 문구가 항상 붙어요.

## Accordance 역본 연결하기 (Mac)

[Accordance](https://www.accordancebible.com)에서 구입한 성경 모듈이 있다면 Versedrop이 그 본문을 바로 가져와요. 따로 설치할 것은 없어요. 본문은 내 Mac 안에서 Accordance와 Obsidian 사이에서만 오가고 인터넷으로 전송되지 않으니, 내가 가진 라이선스 범위 안에서 쓰는 셈입니다.

**필요한 것:** macOS, Obsidian 데스크톱 앱, 모듈이 설치된 Accordance. (Windows, Linux, iPhone, Android에서는 쓸 수 없어요.)

**연결 방법:**

1. 설정 → Versedrop → *내 역본* → **+** → **Accordance 모듈로 추가… (Mac)**
2. 입력하세요.
   - **이름** — 검색 창에 보일 이름. 예: `개역개정`, `ESV`
   - **Accordance 모듈** — Accordance 라이브러리나 텍스트 탭에 보이는 약어와 **똑같이** (대소문자, 하이픈 포함). 예: `ESVS`
   - **언어** — 검색 창의 어느 언어 버튼에 나올지 정해요.
3. **연결 확인**을 누르면 Accordance에 요한복음 3:16을 요청해요.
4. 처음에는 macOS가 *"Obsidian이(가) Accordance을(를) 제어하려고 합니다"* 라고 물어요. **허용**을 눌러 주세요.
5. 성공하면 본문이 알림으로 떠요. 쓰고 싶은 모듈마다 반복하세요.

**"허용 안 함"을 눌렀다면:** 시스템 설정 → 개인정보 보호 및 보안 → 자동화 → Obsidian 아래의 **Accordance**를 켜 주세요.

**알아두면 좋은 점:**

- Accordance가 꺼져 있으면 첫 요청 때 실행되느라 몇 초 걸려요. `시 119` 같은 장 전체는 절마다 요청해서 조금 오래 걸려요.
- 책 이름은 영어로 바꿔서 Accordance에 보내므로, `요 3:16`처럼 한글로 검색해도 한국어 모듈에서 잘 가져와요.
- 개역개정, 공동번역, ESV, NIV, NASB, NLT, CSB, NKJV, NRSV, NA28, BHS처럼 알려진 역본은 출처 문구가 자동으로 붙어요. 역본 편집 창에서 직접 바꿀 수도 있어요.

## 개역개정 등 대한성서공회 역본

개역개정, 공동번역, 새번역, 새한글성경은 대한성서공회 저작권 역본이에요. 대한성서공회는 소프트웨어·앱·웹에서 성경 본문을 제공하는 것을 별도 허가 대상으로 두고 있어요([허가조건 및 사용료](https://www.bskorea.or.kr/bbs/content.php?co_id=subpage2_3_4_3)). 그래서 Versedrop은 대한성서공회 사이트에서 본문을 내려받지 않아요.

- **추천:** Accordance에 있는 내 개역개정 모듈을 연결하세요(위 설명 참고). 이름을 `개역개정`으로 하면 *성경전서 개역개정판 © 대한성서공회* 문구가 자동으로 붙어요.
- 또는 사용 권한이 있는 JSON 파일을 연결할 수 있어요.
- 새번역은 bolls.life에서 가져올 수 있지만 **기본으로 꺼져 있어요.** 개인 묵상·연구용으로만 켜서 쓰세요.

## Logos·Accordance 링크

Logos는 외부 프로그램이 성경 본문을 읽을 수 있는 공식 방법을 제공하지 않고, 리소스도 암호화되어 있어서 Logos 본문은 가져올 수 없어요. 대신 구절 제목 옆에 **내 Logos에서 바로 열리는 링크**를 붙일 수 있습니다. Accordance 링크도 같은 방식으로 붙일 수 있어요.

1. 설정 → *Logos · Accordance 링크* → **링크 붙이기**에서 **Logos**, **Accordance**, **둘 다** 중 하나를 고릅니다.
2. **Logos 역본** — Logos에서 열 역본 약어. 예: `ESV`, `NASB95`. 비워 두면 Logos의 기본 성경으로 열려요.
3. **Accordance 링크 모듈** — 링크로 열 모듈 약어. 예: `ESVS`. 비워 두면 Accordance 기본 텍스트로 열려요. Accordance 모듈에서 가져온 구절은 자동으로 그 모듈로 연결됩니다.

```markdown
> [!quote] 로마서 8:28, 31-39 (개역한글) · [Logos](https://ref.ly/Rom8.28-39;ESV) · [Accordance](accord://read/ESVS?Romans_8:28-39)
```

- Logos 링크는 [ref.ly](https://ref.ly) 형식이라 Logos 데스크톱, 모바일, 웹 어디서든 열려요.
- Accordance 링크는 `accord://` 형식이라 그 컴퓨터의 Accordance 앱에서 열려요.
- 링크는 하나의 연속 범위로 만들어져요. 그래서 `롬 8:28, 31-39`는 8:28–39로 연결됩니다.

## 다른 역본 추가하기

**역본 추가**(+) 메뉴 맨 아래 *직접 추가* 묶음에서 세 가지 방법을 쓸 수 있어요.

**bolls.life 역본** — 표시할 이름과 bolls.life 코드를 입력합니다. 다른 언어 성경을 쓸 때 유용해요.

| 코드 | 역본 |
|---|---|
| `LUT` | Luther 1912 (독일어) |
| `RV1960` | Reina-Valera 1960 (스페인어) |

전체 목록은 <https://bolls.life/static/bolls/app/views/languages.json> 에서 볼 수 있어요. 각 역본의 저작권을 지켜 주세요.

**JSON 파일** — 사용 권한이 있는 성경 JSON 파일을 볼트에 넣고 경로를 입력합니다. 예: `Bibles/nkrv.json`. 세 가지 형식을 인식해요.

```jsonc
// A. 배열 (bolls.life 덤프 형식)
[{ "book": 43, "chapter": 3, "verse": 16, "text": "..." }]

// B. 중첩 — 책 번호 또는 이름 → 장 → 절
{ "43": { "3": { "16": "..." } } }

// C. 키 형식 — 한글·영어 약어
{ "요3:16": "...", "John 3:16": "..." }
```

책 번호는 창세기 1부터 요한계시록 66까지예요. HTML 태그나 `<천지 창조>` 같은 소제목은 자동으로 지워집니다. 파일을 바꾼 뒤에는 **캐시 비우기**를 눌러 주세요.

**Accordance 모듈** — [위의 설명](#accordance-역본-연결하기-mac)을 참고하세요.

직접 추가한 역본은 편집 칸(이름, 코드/모듈/경로, 언어, **출처 문구**)이 열려요. **완료**를 누르면 접히고, ✎를 누르면 다시 열려요.

## 출처 표기와 인용 범위

설교 원고나 묵상 노트에 몇 구절을 출처와 함께 넣는 정도는 일반적인 인용 범위에 해당해요. 기준은 내 글이 중심일 것, 출처를 밝힐 것, 지나치게 많이 옮기지 않을 것이에요. Versedrop은 이 범위 안에서 쓰도록 돕습니다.

- **출처 표기** (설정 → *삽입 형식*): *저작권 역본만*(기본)은 저작권 역본 아래에 출처 문구를 붙이고, *모든 역본*은 공개 역본에도 표시를 붙이고, *붙이지 않음*은 끕니다. 다만 ESV와 NET은 이용 조건상 항상 붙어요.
- **인용 분량 경고**: 저작권 역본을 한 번에 50절(조정 가능, 0이면 끄기)보다 많이 넣으면 알려 줘요.
- 검색 창에서도 저작권 역본 카드 아래에 출처 문구가 보여요.

다음 경우에는 저작권자 허가가 필요할 수 있어요: 가져온 구절을 계속 모아 사실상 본문 데이터베이스를 만드는 경우, 노트를 웹사이트 등에 공개·배포하는 경우, 교재나 출판물에 많이 싣는 경우.

```markdown
> [!quote] 요한복음 3:16 (개역개정)
> ¹⁶하나님이 세상을 이처럼 사랑하사 …
>
> *성경전서 개역개정판 © 대한성서공회*
```

## 삽입 형식 설정

| 설정 | 하는 일 |
|---|---|
| **블록 형태** | **콜아웃**(기본), **인용문**(구절 표기가 아래에 붙음), **일반 텍스트** |
| **콜아웃 종류** | 콜아웃 이름. 예: `quote`, `bible`, `note`. 직접 만든 이름도 CSS와 함께 쓸 수 있어요. |
| **여러 역본을 한 블록으로 묶기** | 끄면 역본마다 블록이 따로 생기고, 켜면 구절 제목 하나 아래 역본별로 나뉘어 들어가요. 한영 대조에 좋아요. |
| **제목 형식** | 블록 제목 템플릿. 변수: `{ref}` `{book}` `{chapter}` `{verses}` `{version}` `{abbr}`. 기본값 `{ref} ({abbr})` → *요한복음 3:16 (개역한글)* |
| **책 이름 표기** | 전체 (*요한복음 / John*) 또는 약어 (*요 / John*, *창 / Gen*) |
| **절 번호** | 표시 안 함, 숫자 (`16 하나님이…`), 윗첨자 (`¹⁶하나님이…`) |
| **절마다 줄바꿈** | 절마다 한 줄씩. 시편이나 긴 본문에 좋아요. |

떨어진 절 사이에는 `…`가 들어가요. 예를 들어 `롬 8:28, 31-39`는 28절, `…`, 31–39절 순서로 들어갑니다.

**상황별 추천 설정**

| 상황 | 추천 |
|---|---|
| 묵상·설교 준비 노트 | 콜아웃 + 윗첨자 절 번호 (기본값) |
| 한영 대조 성경공부 자료 | 언어 *함께* + 한 블록으로 묶기 켜기 |
| 주보·설교 원고에 깔끔하게 | 일반 텍스트 + 절 번호 표시 안 함 |
| 시편·지혜서 | 절마다 줄바꿈 켜기 |

묶기를 켰을 때 예시:

```markdown
> [!quote] 요한복음 3:16 · John 3:16
> **개역한글**
> ¹⁶하나님이 세상을 이처럼 사랑하사 …
>
> **King James Version**
> ¹⁶For God so loved the world …
```

## 문제 해결

| 증상 | 해결 방법 |
|---|---|
| "…에 해당하는 책을 찾지 못했어요" | 다른 표기로 입력해 보세요: `요`, `요한복음`, `John`, `Jn` |
| 카드에 네트워크 오류 | 인터넷 연결을 확인하고 다시 검색하세요. |
| 본문이 이상하거나 예전 내용 | 설정 → **캐시 비우기** |
| "Obsidian이 Accordance를 제어할 권한이 없어요" | 시스템 설정 → 개인정보 보호 및 보안 → 자동화 → Obsidian → Accordance 켜기 |
| "Accordance가 … 모듈에서 본문을 찾지 못했어요" | 모듈 약어를 Accordance에 보이는 그대로(대소문자·하이픈 포함) 입력했는지 확인하세요. |
| "Accordance가 … 모듈에서 본문을 찾지 못했어요" | 모듈 약어를 Accordance에 보이는 그대로(대소문자·하이픈 포함) 입력했는지 확인하세요. |
| Accordance가 처음에 느림 | Accordance가 실행되는 중이에요. 다음부터는 빨라지고, 미리 열어 두면 더 빨라요. |
| Accordance 버튼이 회색 | Mac의 Obsidian 데스크톱 앱에서만 쓸 수 있어요. |
| 역본이 검색 창에 안 보임 | *내 역본* 목록에 있는지, 맞는 언어 탭인지 확인하세요. 직접 추가한 역본은 이름과 코드/경로/모듈을 모두 채워야 나타나요. |
| ESV가 안 보임 | *내 역본*에 ESV를 추가하고 바로 아래 **ESV API 키**에 키를 넣어 주세요. |
| "ESV API 키가 올바르지 않아요" | api.esv.org의 내 Application 페이지에서 키를 다시 복사해 넣으세요. |
| Accordance 역본에 출처 문구가 안 붙음 | 그 줄의 **출처 문구** 칸에 직접 입력하세요. |

플러그인 설정 화면 맨 아래 **도움말**에도 같은 내용이 정리되어 있어요.

## 네트워크와 시스템 접근

- **네트워크:** 본문은 [bolls.life](https://bolls.life), [NET Bible API](https://labs.bible.org), 그리고 키를 넣은 경우에만 [ESV API](https://api.esv.org)에서 가져와요. 보내는 정보는 역본과 책·장(또는 구절)뿐이고, ESV 키는 api.esv.org에만 전송돼요.
- **내 기기 안에서만:** JSON 파일과 Accordance 모듈은 내 기기에서 읽고, 인터넷으로 보내지 않아요.
- **Accordance (macOS):** Node의 `execFile`로 `osascript`를 실행해(셸 없이) 고정된 AppleScript로 Accordance에 본문을 요청해요. 모듈과 구절은 인자로만 넘겨요. Mac에서 Accordance 역본을 쓸 때만 불러오고, 처음 한 번 macOS가 권한을 물어봅니다.
- 가져온 본문은 Obsidian을 다시 시작할 때까지 메모리에 임시 저장돼요.

---

## Support / 후원

If Versedrop helps your study or sermon preparation, you can support its development:
Versedrop이 묵상과 설교 준비에 도움이 되셨다면 후원으로 응원해 주세요.

[☕ Buy Me a Coffee](https://buymeacoffee.com/4h9fg59wsgd)

## Development

```bash
npm install
npm run dev     # watch
npm run build   # type-check + production build
```

## Credits

Bible text API by [Bolls Bible](https://github.com/Bolls-Bible/bain). Translations remain the property of their respective copyright holders.

## License

MIT
