import { getLanguage } from "obsidian";

export type Lang = "en" | "ko";
export type LangSetting = "auto" | Lang;

const en = {
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
	"modal.searching": "Searching {provider}…",
	"modal.fallback": "No results. Trying {provider}…",
	"modal.none": "No results found.",
	"modal.count": "{count} results{note} — use ↑↓ and Enter",
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
	"set.variablesHelp":
		"Write {{variable}}. Filters: {{variable:json}} quoted value or list, safe in frontmatter; {{variable:link}} [[wikilinks]]; {{variable:linkjson}} wikilink list for frontmatter.",

	// template variable descriptions
	"var.title": "Title",
	"var.subtitle": "Subtitle (Google only)",
	"var.author": "Authors, comma-separated",
	"var.authors": "Author list — pairs well with :json and :link",
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
	"var.today": "Today's date (YYYY-MM-DD)",
};

export type Key = keyof typeof en;

const ko: Record<Key, string> = {
	"cmd.create": "책 검색해서 새 노트 만들기",
	"cmd.insert": "커서 위치에 책 정보 삽입",
	"cmd.fill": "현재 노트 프런트매터에 책 정보 채우기",

	"provider.kakao": "카카오 책 검색",
	"provider.google": "Google Books",

	"modal.title": "책 검색",
	"modal.placeholder": "제목, 저자 또는 ISBN",
	"modal.search": "검색",
	"modal.searching": "{provider}에서 찾는 중…",
	"modal.fallback": "결과가 없어 {provider}에서 다시 찾는 중…",
	"modal.none": "검색 결과가 없습니다.",
	"modal.count": "{count}건{note} — ↑↓로 고르고 Enter",
	"modal.countFrom": " ({provider} 결과)",
	"modal.translatedBy": "{names} 옮김",
	"modal.failed": "책 정보를 넣지 못했습니다: {error}",

	"folder.root": "/ (보관소 맨 위)",
	"folder.default": "(기본)",
	"folder.placeholder": "책 노트를 저장할 폴더를 고르세요",
	"folder.move": "이동",
	"folder.choose": "이 폴더에 저장",
	"folder.cancel": "취소",

	"notice.exists": "이미 있는 노트를 엽니다: {name}",
	"notice.created": "책 노트를 만들었습니다: {name}",
	"notice.filled": "속성 {count}개를 채웠습니다.",
	"notice.nothingToFill": "새로 채울 속성이 없습니다.",
	"notice.notFolder": "'{path}'는 폴더가 아니라 파일입니다.",
	"notice.kakaoOk": "카카오 연결 성공: {count}건을 받았습니다.",

	"err.kakaoNoKey": "카카오 REST API 키가 없습니다. 플러그인 설정에서 입력해 주세요.",
	"err.kakao401": "카카오 API 키가 올바르지 않습니다 (401). REST API 키인지 확인해 주세요. {detail}",
	"err.kakao": "카카오 API 오류 ({status}) {detail}",
	"err.google429": "Google Books 요청 한도를 넘었습니다 (429). 설정에서 Google API 키를 넣으면 한도가 늘어납니다.",
	"err.google": "Google Books 오류 ({status}) {detail}",

	"set.general": "일반",
	"set.language": "언어",
	"set.languageDesc": "Bookdrop 화면과 기본 템플릿의 언어입니다. 명령 이름은 Obsidian을 다시 시작하면 바뀝니다.",
	"set.languageAuto": "Obsidian 설정 따르기",
	"set.search": "검색",
	"set.provider": "기본 검색 소스",
	"set.providerDesc": "검색 창을 열 때 먼저 선택되는 소스입니다. 창 안에서 바꿀 수 있습니다.",
	"set.fallback": "결과가 없으면 다른 소스로 재검색",
	"set.fallbackDesc": "카카오에 없는 외서는 Google Books에서, Google에 없는 국내서는 카카오에서 이어서 찾습니다.",
	"set.maxResults": "결과 개수",
	"set.maxResultsDesc": "한 번에 가져올 결과 수 (카카오 최대 50, Google 최대 40)",
	"set.keys": "API 키",
	"set.kakaoKey": "카카오 REST API 키",
	"set.kakaoKeyDesc": "Kakao Developers에서 앱을 만들고 [앱 키]의 REST API 키를 넣으세요. ",
	"set.kakaoKeyLink": "Kakao Developers 열기",
	"set.kakaoKeyPlaceholder": "REST API 키",
	"set.testConnection": "연결 확인",
	"set.googleKey": "Google Books API 키 (선택)",
	"set.googleKeyDesc": "키 없이도 검색되지만, 자주 쓰면 요청 한도(429)에 걸릴 수 있습니다. Google Cloud에서 Books API를 켜고 키를 만들어 넣으세요.",
	"set.optional": "선택 사항",
	"set.googleLang": "Google 검색 언어 제한 (선택)",
	"set.googleLangDesc": "ko, en 같은 언어 코드. 비워 두면 모든 언어를 검색합니다.",
	"set.googleLangPlaceholder": "예: ko",
	"set.newNote": "새 노트",
	"set.folder": "저장 폴더",
	"set.folderDesc": "칸을 누르면 보관소의 폴더 목록이 나와 고를 수 있습니다. 없는 폴더 이름을 직접 쓰면 새로 만듭니다. 비우면 보관소 맨 위에 만듭니다.",
	"set.askFolder": "노트 만들 때마다 폴더 고르기",
	"set.askFolderDesc": "켜면 책을 고른 뒤 저장할 폴더를 묻습니다. 위의 저장 폴더가 목록 맨 위에 기본으로 나옵니다.",
	"set.fileName": "파일 이름 형식",
	"set.fileNameDesc": "템플릿 변수를 쓸 수 있습니다. 예: {{title}} 또는 {{publishYear}} {{title}}",
	"set.openAfter": "만든 뒤 노트 열기",
	"set.noteTemplate": "새 노트 템플릿",
	"set.noteTemplateDesc": "새 책 노트의 내용입니다. 비워 두면 선택한 언어의 기본 템플릿을 씁니다.",
	"set.currentNote": "현재 노트",
	"set.insertTemplate": "커서 위치 삽입 템플릿",
	"set.insertTemplateDesc": "'커서 위치에 책 정보 삽입' 명령에서 쓰는 템플릿입니다.",
	"set.overwrite": "프런트매터 기존 값 덮어쓰기",
	"set.overwriteDesc": "끄면 비어 있는 속성만 채웁니다.",
	"set.reset": "기본값으로 되돌리기",
	"set.variables": "템플릿 변수",
	"set.variablesHelp":
		"{{변수}} 형태로 씁니다. 필터: {{변수:json}} 프런트매터에 안전한 따옴표 값/목록, {{변수:link}} [[위키링크]], {{변수:linkjson}} 프런트매터용 링크 목록.",

	"var.title": "제목",
	"var.subtitle": "부제 (Google만)",
	"var.author": "저자 (쉼표로 연결)",
	"var.authors": "저자 목록 — :json, :link 필터와 함께 쓰기 좋음",
	"var.translator": "역자 (쉼표로 연결, 카카오만)",
	"var.translators": "역자 목록",
	"var.publisher": "출판사",
	"var.publishDate": "출간일",
	"var.publishYear": "출간 연도",
	"var.isbn": "ISBN (13자리 우선)",
	"var.isbn10": "ISBN-10",
	"var.isbn13": "ISBN-13",
	"var.pageCount": "쪽수 (Google만)",
	"var.categories": "분류 (Google만)",
	"var.description": "책 소개",
	"var.coverUrl": "표지 이미지 주소",
	"var.link": "책 상세 페이지 주소",
	"var.price": "정가",
	"var.language": "언어 코드 (Google만)",
	"var.source": "kakao 또는 google",
	"var.today": "오늘 날짜 (YYYY-MM-DD)",
};

const dictionaries: Record<Lang, Record<Key, string>> = { en, ko };

let current: Lang = "en";

/** Obsidian's display language. */
export function detectObsidianLanguage(): Lang {
	return getLanguage().toLowerCase().startsWith("ko") ? "ko" : "en";
}

export function setLanguage(setting: LangSetting): void {
	current = setting === "auto" ? detectObsidianLanguage() : setting;
}

export function getLang(): Lang {
	return current;
}

export function t(key: Key, vars?: Record<string, string | number>): string {
	let s = dictionaries[current][key] ?? en[key] ?? key;
	if (vars) {
		for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
	}
	return s;
}
