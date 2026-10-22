var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => BookdropPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/settings.ts
var import_obsidian4 = require("obsidian");

// src/providers/kakao.ts
var import_obsidian = require("obsidian");

// src/providers/utils.ts
function toIsbn(input) {
  const cleaned = input.replace(/[-\s]/g, "").toUpperCase();
  if (/^\d{13}$/.test(cleaned)) return cleaned;
  if (/^\d{9}[\dX]$/.test(cleaned)) return cleaned;
  return null;
}
function stripHtml(html) {
  return html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, "\n\n").trim();
}
function toHttps(url) {
  return url.replace(/^http:\/\//, "https://");
}

// src/i18n.ts
var obsidian = __toESM(require("obsidian"));
var en = {
  // commands & ribbon
  "cmd.create": "Search for a book and create a note",
  "cmd.insert": "Insert book info at cursor",
  "cmd.fill": "Fill current note's properties with book info",
  // providers
  "provider.kakao": "Kakao Book Search",
  "provider.google": "Google Books",
  // search modal
  "modal.title": "Search books",
  "modal.placeholder": "Title, author, or ISBN",
  "modal.search": "Search",
  "modal.searching": "Searching {provider}\u2026",
  "modal.fallback": "No results. Trying {provider}\u2026",
  "modal.none": "No results found.",
  "modal.count": "{count} results{note} \u2014 use \u2191\u2193 and Enter",
  "modal.countFrom": " (from {provider})",
  "modal.translatedBy": "trans. {names}",
  "modal.failed": "Couldn't add the book: {error}",
  // folder picker
  "folder.root": "/ (vault root)",
  "folder.default": "(default)",
  "folder.placeholder": "Choose a folder for the book note",
  "folder.move": "move",
  "folder.choose": "save here",
  "folder.cancel": "cancel",
  // notices
  "notice.exists": "Opening existing note: {name}",
  "notice.created": "Created book note: {name}",
  "notice.filled": "Filled {count} properties.",
  "notice.nothingToFill": "No empty properties to fill.",
  "notice.notFolder": "'{path}' is a file, not a folder.",
  "notice.kakaoOk": "Kakao connected: received {count} results.",
  // errors
  "err.kakaoNoKey": "No Kakao REST API key. Add one in Bookdrop settings.",
  "err.kakao401": "Invalid Kakao API key (401). Make sure you used the REST API key. {detail}",
  "err.kakao": "Kakao API error ({status}) {detail}",
  "err.google429": "Google Books rate limit reached (429). Adding a Google API key in settings raises the limit.",
  "err.google": "Google Books error ({status}) {detail}",
  // settings
  "set.general": "General",
  "set.language": "Language",
  "set.languageDesc": "Language for Bookdrop's interface and default templates. Command names update after reloading Obsidian.",
  "set.languageAuto": "Follow Obsidian",
  "set.search": "Search",
  "set.provider": "Default source",
  "set.providerDesc": "Source selected when the search window opens. You can switch it in the window.",
  "set.fallback": "Try the other source when nothing is found",
  "set.fallbackDesc": "Books missing from Kakao (often non-Korean titles) are looked up in Google Books, and vice versa.",
  "set.maxResults": "Number of results",
  "set.maxResultsDesc": "Results per search (Kakao up to 50, Google up to 40).",
  "set.keys": "API keys",
  "set.kakaoKey": "Kakao REST API key",
  "set.kakaoKeyDesc": "Create an app in Kakao Developers and paste its REST API key. ",
  "set.kakaoKeyLink": "Open Kakao Developers",
  "set.kakaoKeyPlaceholder": "REST API key",
  "set.testConnection": "Test connection",
  "set.googleKey": "Google Books API key (optional)",
  "set.googleKeyDesc": "Search works without a key, but frequent use may hit the rate limit (429). Enable the Books API in Google Cloud and create a key.",
  "set.optional": "Optional",
  "set.googleLang": "Google language filter (optional)",
  "set.googleLangDesc": "A language code such as en or ko. Leave empty to search all languages.",
  "set.googleLangPlaceholder": "e.g. en",
  "set.newNote": "New notes",
  "set.folder": "Folder",
  "set.folderDesc": "Click to choose a folder from your vault. Type a new name to have it created. Leave empty for the vault root.",
  "set.askFolder": "Ask for a folder every time",
  "set.askFolderDesc": "After you choose a book, Bookdrop asks where to save it. The folder above is listed first as the default.",
  "set.fileName": "File name format",
  "set.fileNameDesc": "Template variables are allowed, e.g. {{title}} or {{publishYear}} {{title}}.",
  "set.openAfter": "Open note after creating it",
  "set.noteTemplate": "Note template",
  "set.noteTemplateDesc": "Content of new book notes. Leave empty to use the default for the selected language.",
  "set.currentNote": "Current note",
  "set.insertTemplate": "Insert template",
  "set.insertTemplateDesc": "Used by the 'Insert book info at cursor' command.",
  "set.overwrite": "Overwrite existing properties",
  "set.overwriteDesc": "When off, only empty properties are filled.",
  "set.reset": "Reset to default",
  "set.variables": "Template variables",
  "set.variablesHelp": "Write {{variable}}. Filters: {{variable:json}} quoted value or list, safe in frontmatter; {{variable:link}} [[wikilinks]]; {{variable:linkjson}} wikilink list for frontmatter.",
  // template variable descriptions
  "var.title": "Title",
  "var.subtitle": "Subtitle (Google only)",
  "var.author": "Authors, comma-separated",
  "var.authors": "Author list \u2014 pairs well with :json and :link",
  "var.translator": "Translators, comma-separated (Kakao only)",
  "var.translators": "Translator list",
  "var.publisher": "Publisher",
  "var.publishDate": "Publication date",
  "var.publishYear": "Publication year",
  "var.isbn": "ISBN (13-digit preferred)",
  "var.isbn10": "ISBN-10",
  "var.isbn13": "ISBN-13",
  "var.pageCount": "Page count (Google only)",
  "var.categories": "Categories (Google only)",
  "var.description": "Description",
  "var.coverUrl": "Cover image URL",
  "var.link": "Book detail page URL",
  "var.price": "List price",
  "var.language": "Language code (Google only)",
  "var.source": "kakao or google",
  "var.today": "Today's date (YYYY-MM-DD)"
};
var ko = {
  "cmd.create": "\uCC45 \uAC80\uC0C9\uD574\uC11C \uC0C8 \uB178\uD2B8 \uB9CC\uB4E4\uAE30",
  "cmd.insert": "\uCEE4\uC11C \uC704\uCE58\uC5D0 \uCC45 \uC815\uBCF4 \uC0BD\uC785",
  "cmd.fill": "\uD604\uC7AC \uB178\uD2B8 \uD504\uB7F0\uD2B8\uB9E4\uD130\uC5D0 \uCC45 \uC815\uBCF4 \uCC44\uC6B0\uAE30",
  "provider.kakao": "\uCE74\uCE74\uC624 \uCC45 \uAC80\uC0C9",
  "provider.google": "Google Books",
  "modal.title": "\uCC45 \uAC80\uC0C9",
  "modal.placeholder": "\uC81C\uBAA9, \uC800\uC790 \uB610\uB294 ISBN",
  "modal.search": "\uAC80\uC0C9",
  "modal.searching": "{provider}\uC5D0\uC11C \uCC3E\uB294 \uC911\u2026",
  "modal.fallback": "\uACB0\uACFC\uAC00 \uC5C6\uC5B4 {provider}\uC5D0\uC11C \uB2E4\uC2DC \uCC3E\uB294 \uC911\u2026",
  "modal.none": "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  "modal.count": "{count}\uAC74{note} \u2014 \u2191\u2193\uB85C \uACE0\uB974\uACE0 Enter",
  "modal.countFrom": " ({provider} \uACB0\uACFC)",
  "modal.translatedBy": "{names} \uC62E\uAE40",
  "modal.failed": "\uCC45 \uC815\uBCF4\uB97C \uB123\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4: {error}",
  "folder.root": "/ (\uBCF4\uAD00\uC18C \uB9E8 \uC704)",
  "folder.default": "(\uAE30\uBCF8)",
  "folder.placeholder": "\uCC45 \uB178\uD2B8\uB97C \uC800\uC7A5\uD560 \uD3F4\uB354\uB97C \uACE0\uB974\uC138\uC694",
  "folder.move": "\uC774\uB3D9",
  "folder.choose": "\uC774 \uD3F4\uB354\uC5D0 \uC800\uC7A5",
  "folder.cancel": "\uCDE8\uC18C",
  "notice.exists": "\uC774\uBBF8 \uC788\uB294 \uB178\uD2B8\uB97C \uC5FD\uB2C8\uB2E4: {name}",
  "notice.created": "\uCC45 \uB178\uD2B8\uB97C \uB9CC\uB4E4\uC5C8\uC2B5\uB2C8\uB2E4: {name}",
  "notice.filled": "\uC18D\uC131 {count}\uAC1C\uB97C \uCC44\uC6E0\uC2B5\uB2C8\uB2E4.",
  "notice.nothingToFill": "\uC0C8\uB85C \uCC44\uC6B8 \uC18D\uC131\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  "notice.notFolder": "'{path}'\uB294 \uD3F4\uB354\uAC00 \uC544\uB2C8\uB77C \uD30C\uC77C\uC785\uB2C8\uB2E4.",
  "notice.kakaoOk": "\uCE74\uCE74\uC624 \uC5F0\uACB0 \uC131\uACF5: {count}\uAC74\uC744 \uBC1B\uC558\uC2B5\uB2C8\uB2E4.",
  "err.kakaoNoKey": "\uCE74\uCE74\uC624 REST API \uD0A4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uD50C\uB7EC\uADF8\uC778 \uC124\uC815\uC5D0\uC11C \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  "err.kakao401": "\uCE74\uCE74\uC624 API \uD0A4\uAC00 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4 (401). REST API \uD0A4\uC778\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694. {detail}",
  "err.kakao": "\uCE74\uCE74\uC624 API \uC624\uB958 ({status}) {detail}",
  "err.google429": "Google Books \uC694\uCCAD \uD55C\uB3C4\uB97C \uB118\uC5C8\uC2B5\uB2C8\uB2E4 (429). \uC124\uC815\uC5D0\uC11C Google API \uD0A4\uB97C \uB123\uC73C\uBA74 \uD55C\uB3C4\uAC00 \uB298\uC5B4\uB0A9\uB2C8\uB2E4.",
  "err.google": "Google Books \uC624\uB958 ({status}) {detail}",
  "set.general": "\uC77C\uBC18",
  "set.language": "\uC5B8\uC5B4",
  "set.languageDesc": "Bookdrop \uD654\uBA74\uACFC \uAE30\uBCF8 \uD15C\uD50C\uB9BF\uC758 \uC5B8\uC5B4\uC785\uB2C8\uB2E4. \uBA85\uB839 \uC774\uB984\uC740 Obsidian\uC744 \uB2E4\uC2DC \uC2DC\uC791\uD558\uBA74 \uBC14\uB01D\uB2C8\uB2E4.",
  "set.languageAuto": "Obsidian \uC124\uC815 \uB530\uB974\uAE30",
  "set.search": "\uAC80\uC0C9",
  "set.provider": "\uAE30\uBCF8 \uAC80\uC0C9 \uC18C\uC2A4",
  "set.providerDesc": "\uAC80\uC0C9 \uCC3D\uC744 \uC5F4 \uB54C \uBA3C\uC800 \uC120\uD0DD\uB418\uB294 \uC18C\uC2A4\uC785\uB2C8\uB2E4. \uCC3D \uC548\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  "set.fallback": "\uACB0\uACFC\uAC00 \uC5C6\uC73C\uBA74 \uB2E4\uB978 \uC18C\uC2A4\uB85C \uC7AC\uAC80\uC0C9",
  "set.fallbackDesc": "\uCE74\uCE74\uC624\uC5D0 \uC5C6\uB294 \uC678\uC11C\uB294 Google Books\uC5D0\uC11C, Google\uC5D0 \uC5C6\uB294 \uAD6D\uB0B4\uC11C\uB294 \uCE74\uCE74\uC624\uC5D0\uC11C \uC774\uC5B4\uC11C \uCC3E\uC2B5\uB2C8\uB2E4.",
  "set.maxResults": "\uACB0\uACFC \uAC1C\uC218",
  "set.maxResultsDesc": "\uD55C \uBC88\uC5D0 \uAC00\uC838\uC62C \uACB0\uACFC \uC218 (\uCE74\uCE74\uC624 \uCD5C\uB300 50, Google \uCD5C\uB300 40)",
  "set.keys": "API \uD0A4",
  "set.kakaoKey": "\uCE74\uCE74\uC624 REST API \uD0A4",
  "set.kakaoKeyDesc": "Kakao Developers\uC5D0\uC11C \uC571\uC744 \uB9CC\uB4E4\uACE0 [\uC571 \uD0A4]\uC758 REST API \uD0A4\uB97C \uB123\uC73C\uC138\uC694. ",
  "set.kakaoKeyLink": "Kakao Developers \uC5F4\uAE30",
  "set.kakaoKeyPlaceholder": "REST API \uD0A4",
  "set.testConnection": "\uC5F0\uACB0 \uD655\uC778",
  "set.googleKey": "Google Books API \uD0A4 (\uC120\uD0DD)",
  "set.googleKeyDesc": "\uD0A4 \uC5C6\uC774\uB3C4 \uAC80\uC0C9\uB418\uC9C0\uB9CC, \uC790\uC8FC \uC4F0\uBA74 \uC694\uCCAD \uD55C\uB3C4(429)\uC5D0 \uAC78\uB9B4 \uC218 \uC788\uC2B5\uB2C8\uB2E4. Google Cloud\uC5D0\uC11C Books API\uB97C \uCF1C\uACE0 \uD0A4\uB97C \uB9CC\uB4E4\uC5B4 \uB123\uC73C\uC138\uC694.",
  "set.optional": "\uC120\uD0DD \uC0AC\uD56D",
  "set.googleLang": "Google \uAC80\uC0C9 \uC5B8\uC5B4 \uC81C\uD55C (\uC120\uD0DD)",
  "set.googleLangDesc": "ko, en \uAC19\uC740 \uC5B8\uC5B4 \uCF54\uB4DC. \uBE44\uC6CC \uB450\uBA74 \uBAA8\uB4E0 \uC5B8\uC5B4\uB97C \uAC80\uC0C9\uD569\uB2C8\uB2E4.",
  "set.googleLangPlaceholder": "\uC608: ko",
  "set.newNote": "\uC0C8 \uB178\uD2B8",
  "set.folder": "\uC800\uC7A5 \uD3F4\uB354",
  "set.folderDesc": "\uCE78\uC744 \uB204\uB974\uBA74 \uBCF4\uAD00\uC18C\uC758 \uD3F4\uB354 \uBAA9\uB85D\uC774 \uB098\uC640 \uACE0\uB97C \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC5C6\uB294 \uD3F4\uB354 \uC774\uB984\uC744 \uC9C1\uC811 \uC4F0\uBA74 \uC0C8\uB85C \uB9CC\uB4ED\uB2C8\uB2E4. \uBE44\uC6B0\uBA74 \uBCF4\uAD00\uC18C \uB9E8 \uC704\uC5D0 \uB9CC\uB4ED\uB2C8\uB2E4.",
  "set.askFolder": "\uB178\uD2B8 \uB9CC\uB4E4 \uB54C\uB9C8\uB2E4 \uD3F4\uB354 \uACE0\uB974\uAE30",
  "set.askFolderDesc": "\uCF1C\uBA74 \uCC45\uC744 \uACE0\uB978 \uB4A4 \uC800\uC7A5\uD560 \uD3F4\uB354\uB97C \uBB3B\uC2B5\uB2C8\uB2E4. \uC704\uC758 \uC800\uC7A5 \uD3F4\uB354\uAC00 \uBAA9\uB85D \uB9E8 \uC704\uC5D0 \uAE30\uBCF8\uC73C\uB85C \uB098\uC635\uB2C8\uB2E4.",
  "set.fileName": "\uD30C\uC77C \uC774\uB984 \uD615\uC2DD",
  "set.fileNameDesc": "\uD15C\uD50C\uB9BF \uBCC0\uC218\uB97C \uC4F8 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC608: {{title}} \uB610\uB294 {{publishYear}} {{title}}",
  "set.openAfter": "\uB9CC\uB4E0 \uB4A4 \uB178\uD2B8 \uC5F4\uAE30",
  "set.noteTemplate": "\uC0C8 \uB178\uD2B8 \uD15C\uD50C\uB9BF",
  "set.noteTemplateDesc": "\uC0C8 \uCC45 \uB178\uD2B8\uC758 \uB0B4\uC6A9\uC785\uB2C8\uB2E4. \uBE44\uC6CC \uB450\uBA74 \uC120\uD0DD\uD55C \uC5B8\uC5B4\uC758 \uAE30\uBCF8 \uD15C\uD50C\uB9BF\uC744 \uC501\uB2C8\uB2E4.",
  "set.currentNote": "\uD604\uC7AC \uB178\uD2B8",
  "set.insertTemplate": "\uCEE4\uC11C \uC704\uCE58 \uC0BD\uC785 \uD15C\uD50C\uB9BF",
  "set.insertTemplateDesc": "'\uCEE4\uC11C \uC704\uCE58\uC5D0 \uCC45 \uC815\uBCF4 \uC0BD\uC785' \uBA85\uB839\uC5D0\uC11C \uC4F0\uB294 \uD15C\uD50C\uB9BF\uC785\uB2C8\uB2E4.",
  "set.overwrite": "\uD504\uB7F0\uD2B8\uB9E4\uD130 \uAE30\uC874 \uAC12 \uB36E\uC5B4\uC4F0\uAE30",
  "set.overwriteDesc": "\uB044\uBA74 \uBE44\uC5B4 \uC788\uB294 \uC18D\uC131\uB9CC \uCC44\uC6C1\uB2C8\uB2E4.",
  "set.reset": "\uAE30\uBCF8\uAC12\uC73C\uB85C \uB418\uB3CC\uB9AC\uAE30",
  "set.variables": "\uD15C\uD50C\uB9BF \uBCC0\uC218",
  "set.variablesHelp": "{{\uBCC0\uC218}} \uD615\uD0DC\uB85C \uC501\uB2C8\uB2E4. \uD544\uD130: {{\uBCC0\uC218:json}} \uD504\uB7F0\uD2B8\uB9E4\uD130\uC5D0 \uC548\uC804\uD55C \uB530\uC634\uD45C \uAC12/\uBAA9\uB85D, {{\uBCC0\uC218:link}} [[\uC704\uD0A4\uB9C1\uD06C]], {{\uBCC0\uC218:linkjson}} \uD504\uB7F0\uD2B8\uB9E4\uD130\uC6A9 \uB9C1\uD06C \uBAA9\uB85D.",
  "var.title": "\uC81C\uBAA9",
  "var.subtitle": "\uBD80\uC81C (Google\uB9CC)",
  "var.author": "\uC800\uC790 (\uC27C\uD45C\uB85C \uC5F0\uACB0)",
  "var.authors": "\uC800\uC790 \uBAA9\uB85D \u2014 :json, :link \uD544\uD130\uC640 \uD568\uAED8 \uC4F0\uAE30 \uC88B\uC74C",
  "var.translator": "\uC5ED\uC790 (\uC27C\uD45C\uB85C \uC5F0\uACB0, \uCE74\uCE74\uC624\uB9CC)",
  "var.translators": "\uC5ED\uC790 \uBAA9\uB85D",
  "var.publisher": "\uCD9C\uD310\uC0AC",
  "var.publishDate": "\uCD9C\uAC04\uC77C",
  "var.publishYear": "\uCD9C\uAC04 \uC5F0\uB3C4",
  "var.isbn": "ISBN (13\uC790\uB9AC \uC6B0\uC120)",
  "var.isbn10": "ISBN-10",
  "var.isbn13": "ISBN-13",
  "var.pageCount": "\uCABD\uC218 (Google\uB9CC)",
  "var.categories": "\uBD84\uB958 (Google\uB9CC)",
  "var.description": "\uCC45 \uC18C\uAC1C",
  "var.coverUrl": "\uD45C\uC9C0 \uC774\uBBF8\uC9C0 \uC8FC\uC18C",
  "var.link": "\uCC45 \uC0C1\uC138 \uD398\uC774\uC9C0 \uC8FC\uC18C",
  "var.price": "\uC815\uAC00",
  "var.language": "\uC5B8\uC5B4 \uCF54\uB4DC (Google\uB9CC)",
  "var.source": "kakao \uB610\uB294 google",
  "var.today": "\uC624\uB298 \uB0A0\uC9DC (YYYY-MM-DD)"
};
var dictionaries = { en, ko };
var current = "en";
function detectObsidianLanguage() {
  var _a;
  let code = "";
  const fn = obsidian.getLanguage;
  if (typeof fn === "function") {
    try {
      code = fn();
    } catch (e) {
    }
  }
  if (!code) {
    try {
      code = (_a = window.localStorage.getItem("language")) != null ? _a : "";
    } catch (e) {
    }
  }
  return code.toLowerCase().startsWith("ko") ? "ko" : "en";
}
function setLanguage(setting) {
  current = setting === "auto" ? detectObsidianLanguage() : setting;
}
function getLang() {
  return current;
}
function t(key, vars) {
  var _a, _b;
  let s = (_b = (_a = dictionaries[current][key]) != null ? _a : en[key]) != null ? _b : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  }
  return s;
}

// src/providers/kakao.ts
function kakaoLargeCover(thumbnail) {
  if (!thumbnail) return "";
  const m = thumbnail.match(/[?&]fname=([^&]+)/);
  if (m) {
    try {
      return toHttps(decodeURIComponent(m[1]));
    } catch (e) {
    }
  }
  return toHttps(thumbnail);
}
function mapKakaoDoc(doc) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  let isbn10 = "";
  let isbn13 = "";
  for (const part of ((_a = doc.isbn) != null ? _a : "").split(/\s+/)) {
    if (part.length === 13) isbn13 = part;
    else if (part.length === 10) isbn10 = part;
  }
  return {
    title: (_b = doc.title) != null ? _b : "",
    subtitle: "",
    authors: (_c = doc.authors) != null ? _c : [],
    translators: (_d = doc.translators) != null ? _d : [],
    publisher: (_e = doc.publisher) != null ? _e : "",
    publishDate: doc.datetime ? doc.datetime.slice(0, 10) : "",
    isbn10,
    isbn13,
    pageCount: null,
    categories: [],
    description: ((_f = doc.contents) != null ? _f : "").trim(),
    coverUrl: kakaoLargeCover(doc.thumbnail),
    thumbnailUrl: toHttps((_g = doc.thumbnail) != null ? _g : ""),
    link: (_h = doc.url) != null ? _h : "",
    price: typeof doc.price === "number" && doc.price > 0 ? doc.price : null,
    language: "",
    source: "kakao"
  };
}
async function searchKakao(query, opts) {
  var _a, _b, _c, _d, _e, _f;
  if (!opts.kakaoApiKey) {
    throw new Error(t("err.kakaoNoKey"));
  }
  const isbn = toIsbn(query);
  const params = new URLSearchParams({
    query: isbn != null ? isbn : query,
    size: String(Math.min(Math.max(opts.maxResults, 1), 50))
  });
  if (isbn) params.set("target", "isbn");
  const res = await (0, import_obsidian.requestUrl)({
    url: `https://dapi.kakao.com/v3/search/book?${params.toString()}`,
    headers: { Authorization: `KakaoAK ${opts.kakaoApiKey.trim()}` },
    throw: false
  });
  if (res.status !== 200) {
    let detail = "";
    try {
      detail = (_b = (_a = res.json) == null ? void 0 : _a.message) != null ? _b : "";
    } catch (e) {
      detail = (_d = (_c = res.text) == null ? void 0 : _c.slice(0, 200)) != null ? _d : "";
    }
    if (res.status === 401) {
      throw new Error(t("err.kakao401", { detail }));
    }
    throw new Error(t("err.kakao", { status: res.status, detail }));
  }
  const docs = (_f = (_e = res.json) == null ? void 0 : _e.documents) != null ? _f : [];
  return docs.map(mapKakaoDoc);
}

// src/providers/google.ts
var import_obsidian2 = require("obsidian");
function cleanGoogleImage(url) {
  if (!url) return "";
  return toHttps(url).replace(/&edge=curl/, "");
}
function mapGoogleVolume(item) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const v = (_a = item.volumeInfo) != null ? _a : {};
  let isbn10 = "";
  let isbn13 = "";
  for (const id of (_b = v.industryIdentifiers) != null ? _b : []) {
    if (id.type === "ISBN_13") isbn13 = id.identifier;
    else if (id.type === "ISBN_10") isbn10 = id.identifier;
  }
  const thumb = cleanGoogleImage((_e = (_c = v.imageLinks) == null ? void 0 : _c.thumbnail) != null ? _e : (_d = v.imageLinks) == null ? void 0 : _d.smallThumbnail);
  return {
    title: (_f = v.title) != null ? _f : "",
    subtitle: (_g = v.subtitle) != null ? _g : "",
    authors: (_h = v.authors) != null ? _h : [],
    translators: [],
    publisher: (_i = v.publisher) != null ? _i : "",
    publishDate: (_j = v.publishedDate) != null ? _j : "",
    isbn10,
    isbn13,
    pageCount: typeof v.pageCount === "number" && v.pageCount > 0 ? v.pageCount : null,
    categories: (_k = v.categories) != null ? _k : [],
    description: stripHtml((_l = v.description) != null ? _l : ""),
    coverUrl: thumb,
    thumbnailUrl: thumb,
    link: (_n = (_m = v.canonicalVolumeLink) != null ? _m : v.infoLink) != null ? _n : "",
    price: (_q = (_p = (_o = item.saleInfo) == null ? void 0 : _o.listPrice) == null ? void 0 : _p.amount) != null ? _q : null,
    language: (_r = v.language) != null ? _r : "",
    source: "google"
  };
}
async function searchGoogle(query, opts) {
  var _a, _b, _c, _d, _e, _f, _g;
  const isbn = toIsbn(query);
  const params = new URLSearchParams({
    q: isbn ? `isbn:${isbn}` : query,
    maxResults: String(Math.min(Math.max(opts.maxResults, 1), 40)),
    printType: "books"
  });
  if (opts.googleLangRestrict) params.set("langRestrict", opts.googleLangRestrict.trim());
  if (opts.googleApiKey) params.set("key", opts.googleApiKey.trim());
  const res = await (0, import_obsidian2.requestUrl)({
    url: `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
    throw: false
  });
  if (res.status !== 200) {
    let detail = "";
    try {
      detail = (_c = (_b = (_a = res.json) == null ? void 0 : _a.error) == null ? void 0 : _b.message) != null ? _c : "";
    } catch (e) {
      detail = (_e = (_d = res.text) == null ? void 0 : _d.slice(0, 200)) != null ? _e : "";
    }
    if (res.status === 429) {
      throw new Error(t("err.google429"));
    }
    throw new Error(t("err.google", { status: res.status, detail }));
  }
  const items = (_g = (_f = res.json) == null ? void 0 : _f.items) != null ? _g : [];
  return items.map(mapGoogleVolume);
}

// src/providers/index.ts
var PROVIDERS = ["kakao", "google"];
function providerLabel(p) {
  return t(p === "kakao" ? "provider.kakao" : "provider.google");
}
function searchBooks(provider, query, opts) {
  return provider === "kakao" ? searchKakao(query, opts) : searchGoogle(query, opts);
}
function otherProvider(p) {
  return p === "kakao" ? "google" : "kakao";
}

// src/ui/folder-suggest.ts
var import_obsidian3 = require("obsidian");
function listFolders(app) {
  return app.vault.getAllLoadedFiles().filter((f) => f instanceof import_obsidian3.TFolder).sort((a, b) => a.path.localeCompare(b.path));
}
function folderLabel(folder) {
  return folder.isRoot() ? t("folder.root") : folder.path;
}
var FolderSuggest = class extends import_obsidian3.AbstractInputSuggest {
  constructor(app, inputEl, onPick) {
    super(app, inputEl);
    this.inputEl = inputEl;
    this.onPick = onPick;
  }
  getSuggestions(query) {
    const q = query.toLowerCase();
    return listFolders(this.app).filter((f) => f.path.toLowerCase().includes(q));
  }
  renderSuggestion(folder, el) {
    el.setText(folderLabel(folder));
  }
  selectSuggestion(folder) {
    const path = folder.isRoot() ? "" : folder.path;
    this.inputEl.value = path;
    this.inputEl.trigger("input");
    this.onPick(path);
    this.close();
  }
};
var FolderPickModal = class extends import_obsidian3.FuzzySuggestModal {
  constructor(app, defaultPath, onPick) {
    super(app);
    this.defaultPath = defaultPath;
    this.onPick = onPick;
    this.setPlaceholder(t("folder.placeholder"));
    this.setInstructions([
      { command: "\u2191\u2193", purpose: t("folder.move") },
      { command: "\u21B5", purpose: t("folder.choose") },
      { command: "esc", purpose: t("folder.cancel") }
    ]);
  }
  getItems() {
    const folders = listFolders(this.app);
    const i = folders.findIndex((f) => (f.isRoot() ? "" : f.path) === this.defaultPath);
    if (i > 0) folders.unshift(folders.splice(i, 1)[0]);
    return folders;
  }
  getItemText(folder) {
    const label = folderLabel(folder);
    const path = folder.isRoot() ? "" : folder.path;
    return path === this.defaultPath ? `${label}  ${t("folder.default")}` : label;
  }
  onChooseItem(folder) {
    this.onPick(folder.isRoot() ? "" : folder.path);
  }
};

// src/template.ts
var TEMPLATE_VARIABLES = [
  "title",
  "subtitle",
  "author",
  "authors",
  "translator",
  "translators",
  "publisher",
  "publishDate",
  "publishYear",
  "isbn",
  "isbn10",
  "isbn13",
  "pageCount",
  "categories",
  "description",
  "coverUrl",
  "link",
  "price",
  "language",
  "source",
  "today"
];
function todayString() {
  const d = /* @__PURE__ */ new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function bookToValues(book) {
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
    today: todayString()
  };
}
function applyFilter(value, filter) {
  switch (filter) {
    case "json":
      if (value === null || value === "") return '""';
      return JSON.stringify(value);
    case "link":
      if (Array.isArray(value)) return value.map((v) => `[[${v}]]`).join(", ");
      return value === null || value === "" ? "" : `[[${value}]]`;
    case "linkjson":
      if (Array.isArray(value)) return JSON.stringify(value.map((v) => `[[${v}]]`));
      return value === null || value === "" ? '""' : JSON.stringify(`[[${value}]]`);
    default:
      if (value === null) return "";
      if (Array.isArray(value)) return value.join(", ");
      return String(value);
  }
}
function renderTemplate(template, book) {
  const values = bookToValues(book);
  const out = template.replace(/\{\{\s*(\w+)(?::(\w+))?\s*\}\}/g, (whole, name, filter) => {
    if (!(name in values)) return whole;
    return applyFilter(values[name], filter);
  });
  return out.split("\n").filter((line) => !/\]\(\s*\)/.test(line)).join("\n");
}
function sanitizeFileName(name) {
  return name.replace(/[\\/:*?"<>|#^[\]]/g, " ").replace(/\s+/g, " ").trim().slice(0, 180);
}
function makeFileName(template, book) {
  const name = sanitizeFileName(renderTemplate(template, book));
  return name || sanitizeFileName(book.title) || "Untitled book";
}
var KO_NOTE_TEMPLATE = `---
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
status: \uC77D\uAE30 \uC804
tags:
  - book
---

![\uD45C\uC9C0|150]({{coverUrl}})

# {{title}}

- \uC800\uC790: {{author}}
- \uCD9C\uD310\uC0AC: {{publisher}} ({{publishDate}})

## \uCC45 \uC18C\uAC1C

{{description}}

## \uBA54\uBAA8

`;
var KO_INSERT_TEMPLATE = `> [!info] {{title}}
> ![\uD45C\uC9C0|100]({{coverUrl}})
> - \uC800\uC790: {{author}}
> - \uCD9C\uD310\uC0AC: {{publisher}}, {{publishDate}}
> - ISBN: {{isbn}}
`;
var DEFAULT_FILENAME_TEMPLATE = "{{title}} - {{author}}";
var EN_NOTE_TEMPLATE = `---
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
var EN_INSERT_TEMPLATE = `> [!info] {{title}}
> ![cover|100]({{coverUrl}})
> - Author: {{author}}
> - Publisher: {{publisher}}, {{publishDate}}
> - ISBN: {{isbn}}
`;
function defaultNoteTemplate(lang) {
  return lang === "ko" ? KO_NOTE_TEMPLATE : EN_NOTE_TEMPLATE;
}
function defaultInsertTemplate(lang) {
  return lang === "ko" ? KO_INSERT_TEMPLATE : EN_INSERT_TEMPLATE;
}
function isDefaultTemplate(value) {
  return [KO_NOTE_TEMPLATE, EN_NOTE_TEMPLATE, KO_INSERT_TEMPLATE, EN_INSERT_TEMPLATE].includes(value);
}

// src/settings.ts
var DEFAULT_SETTINGS = {
  language: "auto",
  defaultProvider: "kakao",
  fallbackToOther: true,
  kakaoApiKey: "",
  googleApiKey: "",
  googleLangRestrict: "",
  maxResults: 20,
  folder: "Books",
  askFolderEachTime: false,
  fileNameTemplate: DEFAULT_FILENAME_TEMPLATE,
  noteTemplate: "",
  insertTemplate: "",
  openAfterCreate: true,
  overwriteFrontmatter: false
};
var BookdropSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    const s = this.plugin.settings;
    const save = () => this.plugin.saveSettings();
    containerEl.empty();
    new import_obsidian4.Setting(containerEl).setName(t("set.general")).setHeading();
    new import_obsidian4.Setting(containerEl).setName(t("set.language")).setDesc(t("set.languageDesc")).addDropdown(
      (dd) => dd.addOption("auto", t("set.languageAuto")).addOption("en", "English").addOption("ko", "\uD55C\uAD6D\uC5B4").setValue(s.language).onChange(async (v) => {
        s.language = v;
        await save();
        this.display();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t("set.search")).setHeading();
    new import_obsidian4.Setting(containerEl).setName(t("set.provider")).setDesc(t("set.providerDesc")).addDropdown((dd) => {
      PROVIDERS.forEach((p) => dd.addOption(p, providerLabel(p)));
      dd.setValue(s.defaultProvider).onChange(async (v) => {
        s.defaultProvider = v;
        await save();
      });
    });
    new import_obsidian4.Setting(containerEl).setName(t("set.fallback")).setDesc(t("set.fallbackDesc")).addToggle(
      (tg) => tg.setValue(s.fallbackToOther).onChange(async (v) => {
        s.fallbackToOther = v;
        await save();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t("set.maxResults")).setDesc(t("set.maxResultsDesc")).addSlider(
      (sl) => sl.setLimits(5, 40, 5).setValue(s.maxResults).setDynamicTooltip().onChange(async (v) => {
        s.maxResults = v;
        await save();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t("set.keys")).setHeading();
    new import_obsidian4.Setting(containerEl).setName(t("set.kakaoKey")).setDesc(
      createFragment((f) => {
        f.appendText(t("set.kakaoKeyDesc"));
        f.createEl("a", { text: t("set.kakaoKeyLink"), href: "https://developers.kakao.com/console/app" });
      })
    ).addText((tx) => {
      tx.inputEl.type = "password";
      tx.setPlaceholder(t("set.kakaoKeyPlaceholder")).setValue(s.kakaoApiKey).onChange(async (v) => {
        s.kakaoApiKey = v.trim();
        await save();
      });
    }).addButton(
      (b) => b.setButtonText(t("set.testConnection")).onClick(async () => {
        try {
          const r = await searchBooks("kakao", "\uC5B4\uB9B0 \uC655\uC790", this.plugin.searchOptions());
          new import_obsidian4.Notice(t("notice.kakaoOk", { count: r.length }));
        } catch (e) {
          new import_obsidian4.Notice(e instanceof Error ? e.message : String(e));
        }
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t("set.googleKey")).setDesc(t("set.googleKeyDesc")).addText((tx) => {
      tx.inputEl.type = "password";
      tx.setPlaceholder(t("set.optional")).setValue(s.googleApiKey).onChange(async (v) => {
        s.googleApiKey = v.trim();
        await save();
      });
    });
    new import_obsidian4.Setting(containerEl).setName(t("set.googleLang")).setDesc(t("set.googleLangDesc")).addText(
      (tx) => tx.setPlaceholder(t("set.googleLangPlaceholder")).setValue(s.googleLangRestrict).onChange(async (v) => {
        s.googleLangRestrict = v.trim();
        await save();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t("set.newNote")).setHeading();
    new import_obsidian4.Setting(containerEl).setName(t("set.folder")).setDesc(t("set.folderDesc")).addSearch((sr) => {
      const setFolder = async (v) => {
        s.folder = v.trim().replace(/^\/+|\/+$/g, "");
        await save();
      };
      sr.setPlaceholder("Books").setValue(s.folder).onChange(setFolder);
      new FolderSuggest(this.app, sr.inputEl, (path) => void setFolder(path));
    });
    new import_obsidian4.Setting(containerEl).setName(t("set.askFolder")).setDesc(t("set.askFolderDesc")).addToggle(
      (tg) => tg.setValue(s.askFolderEachTime).onChange(async (v) => {
        s.askFolderEachTime = v;
        await save();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t("set.fileName")).setDesc(t("set.fileNameDesc")).addText(
      (tx) => tx.setPlaceholder(DEFAULT_FILENAME_TEMPLATE).setValue(s.fileNameTemplate).onChange(async (v) => {
        s.fileNameTemplate = v || DEFAULT_FILENAME_TEMPLATE;
        await save();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t("set.openAfter")).addToggle(
      (tg) => tg.setValue(s.openAfterCreate).onChange(async (v) => {
        s.openAfterCreate = v;
        await save();
      })
    );
    this.templateArea(containerEl, "set.noteTemplate", "set.noteTemplateDesc", "noteTemplate", defaultNoteTemplate, 16);
    new import_obsidian4.Setting(containerEl).setName(t("set.currentNote")).setHeading();
    this.templateArea(containerEl, "set.insertTemplate", "set.insertTemplateDesc", "insertTemplate", defaultInsertTemplate, 7);
    new import_obsidian4.Setting(containerEl).setName(t("set.overwrite")).setDesc(t("set.overwriteDesc")).addToggle(
      (tg) => tg.setValue(s.overwriteFrontmatter).onChange(async (v) => {
        s.overwriteFrontmatter = v;
        await save();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t("set.variables")).setHeading();
    const help = containerEl.createDiv({ cls: "bookdrop-var-help" });
    help.createEl("p", { text: t("set.variablesHelp") });
    const table = help.createEl("table");
    for (const name of TEMPLATE_VARIABLES) {
      const tr = table.createEl("tr");
      tr.createEl("td").createEl("code", { text: `{{${name}}}` });
      tr.createEl("td", { text: t(`var.${name}`) });
    }
  }
  /**
   * 템플릿 입력칸. 비어 있거나 기본값과 같으면 ""로 저장해서
   * 언어를 바꿀 때 기본 템플릿도 함께 바뀌게 한다.
   */
  templateArea(el, nameKey, descKey, field, getDefault, rows) {
    const s = this.plugin.settings;
    let areaEl = null;
    const setting = new import_obsidian4.Setting(el).setName(t(nameKey)).setDesc(t(descKey)).addExtraButton(
      (b) => b.setIcon("rotate-ccw").setTooltip(t("set.reset")).onClick(async () => {
        s[field] = "";
        await this.plugin.saveSettings();
        if (areaEl) areaEl.value = getDefault(getLang());
      })
    ).addTextArea((ta) => {
      areaEl = ta.inputEl;
      ta.inputEl.rows = rows;
      ta.inputEl.addClass("bookdrop-template-area");
      ta.setValue(s[field] || getDefault(getLang())).onChange(async (v) => {
        s[field] = !v.trim() || v === getDefault(getLang()) ? "" : v;
        await this.plugin.saveSettings();
      });
    });
    setting.settingEl.addClass("bookdrop-template-setting");
  }
};

// src/ui/search-modal.ts
var import_obsidian5 = require("obsidian");
var BookSearchModal = class extends import_obsidian5.Modal {
  constructor(app, cfg) {
    super(app);
    this.results = [];
    this.selected = -1;
    this.searching = false;
    this.cfg = cfg;
    this.provider = cfg.provider;
  }
  onOpen() {
    const { contentEl } = this;
    this.modalEl.addClass("bookdrop-modal");
    this.titleEl.setText(t("modal.title"));
    const bar = contentEl.createDiv({ cls: "bookdrop-search-bar" });
    this.input = new import_obsidian5.TextComponent(bar);
    this.input.setPlaceholder(t("modal.placeholder")).setValue(this.cfg.initialQuery);
    this.input.inputEl.addClass("bookdrop-search-input");
    const dd = new import_obsidian5.DropdownComponent(bar);
    PROVIDERS.forEach((p) => dd.addOption(p, providerLabel(p)));
    dd.setValue(this.provider);
    dd.onChange((v) => {
      this.provider = v;
      if (this.input.getValue().trim()) void this.runSearch();
    });
    new import_obsidian5.ButtonComponent(bar).setButtonText(t("modal.search")).setCta().onClick(() => void this.runSearch());
    this.statusEl = contentEl.createDiv({ cls: "bookdrop-status" });
    this.listEl = contentEl.createDiv({ cls: "bookdrop-results" });
    this.input.inputEl.addEventListener("keydown", (e) => this.onKey(e));
    window.setTimeout(() => this.input.inputEl.focus(), 0);
    if (this.cfg.initialQuery.trim()) void this.runSearch();
  }
  onClose() {
    this.contentEl.empty();
  }
  onKey(e) {
    if (e.isComposing) return;
    if (e.key === "ArrowDown" && this.results.length) {
      e.preventDefault();
      this.select(Math.min(this.selected + 1, this.results.length - 1));
    } else if (e.key === "ArrowUp" && this.results.length) {
      e.preventDefault();
      this.select(Math.max(this.selected - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (this.selected >= 0 && this.results[this.selected]) {
        void this.choose(this.results[this.selected]);
      } else {
        void this.runSearch();
      }
    }
  }
  async runSearch() {
    const query = this.input.getValue().trim();
    if (!query || this.searching) return;
    this.searching = true;
    this.results = [];
    this.selected = -1;
    this.listEl.empty();
    this.statusEl.setText(t("modal.searching", { provider: providerLabel(this.provider) }));
    try {
      let used = this.provider;
      let books = await searchBooks(used, query, this.cfg.options);
      if (!books.length && this.cfg.fallbackToOther) {
        const alt = otherProvider(used);
        if (!(alt === "kakao" && !this.cfg.options.kakaoApiKey)) {
          this.statusEl.setText(t("modal.fallback", { provider: providerLabel(alt) }));
          books = await searchBooks(alt, query, this.cfg.options);
          if (books.length) used = alt;
        }
      }
      this.results = books;
      if (!books.length) {
        this.statusEl.setText(t("modal.none"));
      } else {
        const note = used !== this.provider ? t("modal.countFrom", { provider: providerLabel(used) }) : "";
        this.statusEl.setText(t("modal.count", { count: books.length, note }));
        this.renderResults();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.statusEl.setText(msg);
      console.error("[Bookdrop]", err);
    } finally {
      this.searching = false;
    }
  }
  renderResults() {
    this.listEl.empty();
    this.results.forEach((book, i) => {
      const row = this.listEl.createDiv({ cls: "bookdrop-result" });
      const coverBox = row.createDiv({ cls: "bookdrop-cover" });
      if (book.thumbnailUrl) {
        coverBox.createEl("img", { attr: { src: book.thumbnailUrl, alt: "", loading: "lazy" } });
      }
      const info = row.createDiv({ cls: "bookdrop-info" });
      info.createDiv({ cls: "bookdrop-title", text: book.subtitle ? `${book.title}: ${book.subtitle}` : book.title });
      const people = [book.authors.join(", ")];
      if (book.translators.length) people.push(t("modal.translatedBy", { names: book.translators.join(", ") }));
      info.createDiv({ cls: "bookdrop-meta", text: people.filter(Boolean).join(" \xB7 ") });
      const pub = [book.publisher, book.publishDate.slice(0, 4), book.isbn13 || book.isbn10].filter(Boolean);
      info.createDiv({ cls: "bookdrop-meta bookdrop-faint", text: pub.join(" \xB7 ") });
      row.addEventListener("mouseenter", () => this.select(i, false));
      row.addEventListener("click", () => void this.choose(book));
    });
  }
  select(i, scroll = true) {
    var _a;
    const rows = Array.from(this.listEl.children);
    rows.forEach((r, idx) => r.toggleClass("is-selected", idx === i));
    this.selected = i;
    if (scroll) (_a = rows[i]) == null ? void 0 : _a.scrollIntoView({ block: "nearest" });
  }
  async choose(book) {
    this.close();
    try {
      await this.cfg.onChoose(book);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      new import_obsidian5.Notice(t("modal.failed", { error: msg }));
      console.error("[Bookdrop]", err);
    }
  }
};

// src/main.ts
var BookdropPlugin = class extends import_obsidian6.Plugin {
  async onload() {
    await this.loadSettings();
    this.addRibbonIcon("book-open", t("cmd.create"), () => this.openSearch("", (b) => this.createBookNote(b)));
    this.addCommand({
      id: "create-book-note",
      name: t("cmd.create"),
      callback: () => this.openSearch("", (b) => this.createBookNote(b))
    });
    this.addCommand({
      id: "insert-book-info",
      name: t("cmd.insert"),
      editorCallback: (editor) => {
        const selection = editor.getSelection().trim();
        this.openSearch(selection, (book) => {
          editor.replaceSelection(renderTemplate(this.insertTemplate(), book));
        });
      }
    });
    this.addCommand({
      id: "fill-frontmatter",
      name: t("cmd.fill"),
      checkCallback: (checking) => {
        var _a;
        const file = (_a = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView)) == null ? void 0 : _a.file;
        if (!file) return false;
        if (!checking) {
          this.openSearch(this.guessQuery(file), (book) => this.fillFrontmatter(file, book));
        }
        return true;
      }
    });
    this.addSettingTab(new BookdropSettingTab(this.app, this));
  }
  searchOptions() {
    const s = this.settings;
    return {
      kakaoApiKey: s.kakaoApiKey,
      googleApiKey: s.googleApiKey,
      googleLangRestrict: s.googleLangRestrict,
      maxResults: s.maxResults
    };
  }
  openSearch(initialQuery, onChoose) {
    new BookSearchModal(this.app, {
      initialQuery,
      // 카카오 키가 없으면 Google로 시작
      provider: this.settings.defaultProvider === "kakao" && !this.settings.kakaoApiKey ? "google" : this.settings.defaultProvider,
      fallbackToOther: this.settings.fallbackToOther,
      options: this.searchOptions(),
      onChoose
    }).open();
  }
  /** 프런트매터의 isbn → title → 파일 이름 순으로 검색어를 추정 */
  guessQuery(file) {
    var _a;
    const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    const isbn = fm == null ? void 0 : fm.isbn;
    if (isbn) return String(isbn);
    if (typeof (fm == null ? void 0 : fm.title) === "string" && fm.title.trim()) return fm.title;
    return file.basename;
  }
  async createBookNote(book) {
    const folder = this.settings.askFolderEachTime ? await this.pickFolder() : this.settings.folder.trim();
    if (folder === null) return;
    if (folder) await this.ensureFolder(folder);
    const fileName = makeFileName(this.settings.fileNameTemplate, book);
    const path = (0, import_obsidian6.normalizePath)(folder ? `${folder}/${fileName}.md` : `${fileName}.md`);
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof import_obsidian6.TFile) {
      new import_obsidian6.Notice(t("notice.exists", { name: existing.basename }));
      await this.app.workspace.getLeaf(false).openFile(existing);
      return;
    }
    const content = renderTemplate(this.noteTemplate(), book);
    const file = await this.app.vault.create(path, content);
    new import_obsidian6.Notice(t("notice.created", { name: file.basename }));
    if (this.settings.openAfterCreate) {
      await this.app.workspace.getLeaf(false).openFile(file);
    }
  }
  /** 폴더 선택 창을 띄워 경로를 돌려준다. 취소하면 null */
  pickFolder() {
    return new Promise((resolve) => {
      let chosen = null;
      const modal = new FolderPickModal(this.app, this.settings.folder.trim(), (path) => {
        chosen = path;
      });
      const origClose = modal.onClose.bind(modal);
      modal.onClose = () => {
        origClose();
        window.setTimeout(() => resolve(chosen), 0);
      };
      modal.open();
    });
  }
  async fillFrontmatter(file, book) {
    const fields = {
      title: book.title,
      author: book.authors,
      translator: book.translators,
      publisher: book.publisher,
      published: book.publishDate,
      isbn: book.isbn13 || book.isbn10,
      pages: book.pageCount,
      cover: book.coverUrl,
      link: book.link
    };
    const overwrite = this.settings.overwriteFrontmatter;
    let changed = 0;
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      for (const [key, value] of Object.entries(fields)) {
        if (isEmpty(value)) continue;
        if (!overwrite && !isEmpty(fm[key])) continue;
        fm[key] = value;
        changed++;
      }
    });
    new import_obsidian6.Notice(changed ? t("notice.filled", { count: changed }) : t("notice.nothingToFill"));
  }
  async ensureFolder(folder) {
    const path = (0, import_obsidian6.normalizePath)(folder);
    const f = this.app.vault.getAbstractFileByPath(path);
    if (f instanceof import_obsidian6.TFolder) return;
    if (f) throw new Error(t("notice.notFolder", { path }));
    await this.app.vault.createFolder(path);
  }
  noteTemplate() {
    return this.settings.noteTemplate || defaultNoteTemplate(getLang());
  }
  insertTemplate() {
    return this.settings.insertTemplate || defaultInsertTemplate(getLang());
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    if (isDefaultTemplate(this.settings.noteTemplate)) this.settings.noteTemplate = "";
    if (isDefaultTemplate(this.settings.insertTemplate)) this.settings.insertTemplate = "";
    setLanguage(this.settings.language);
  }
  async saveSettings() {
    setLanguage(this.settings.language);
    await this.saveData(this.settings);
  }
};
function isEmpty(v) {
  return v === null || v === void 0 || v === "" || Array.isArray(v) && v.length === 0;
}
