# Bookdrop

[English](README.md) | 한국어

카카오 책 검색과 Google Books에서 책 정보를 가져와 Obsidian 노트로 만드는 플러그인입니다.

## 기능

| 명령 | 하는 일 |
|---|---|
| **책 검색해서 새 노트 만들기** (리본 📖 아이콘) | 검색 → 선택 → 템플릿대로 `Books/` 폴더에 책 노트 생성 |
| **커서 위치에 책 정보 삽입** | 지금 노트의 커서 자리에 책 정보 블록 삽입. 텍스트를 선택한 채 실행하면 그 텍스트로 바로 검색 |
| **현재 노트 프런트매터에 책 정보 채우기** | 노트의 `isbn` → `title` → 파일 이름 순으로 검색어를 정해 속성(저자, 출판사, ISBN, 표지 등)을 채움 |

- 제목, 저자, ISBN(하이픈 있어도 됨) 어느 것으로도 검색됩니다. ISBN이면 정확 검색으로 바뀝니다.
- 검색 창에서 카카오와 Google을 바로 바꿀 수 있고, 결과가 없으면 다른 소스에서 자동으로 다시 찾습니다(설정에서 끌 수 있음).
- ↑↓로 고르고 Enter로 선택합니다. 한글 입력 중의 Enter는 무시합니다.
- 카카오 결과는 작은 썸네일 대신 원본 크기 표지 주소를 찾아서 넣습니다.
- 저장 폴더는 설정에서 보관소 폴더 목록을 보고 고를 수 있습니다. **노트 만들 때마다 폴더 고르기**를 켜면 책을 고른 뒤 매번 저장 폴더를 묻습니다.
- 화면과 기본 템플릿을 **한국어와 영어**로 쓸 수 있습니다. 기본은 Obsidian의 언어 설정을 따르고, 플러그인 설정의 **언어**에서 직접 고를 수도 있습니다.
- 데스크톱과 모바일에서 모두 동작합니다(Obsidian의 `requestUrl` 사용).

## 설치 (직접 설치)

1. 보관소의 `.obsidian/plugins/bookdrop/` 폴더를 만듭니다.
2. `main.js`, `manifest.json`, `styles.css` 세 파일을 그 폴더에 넣습니다.
3. Obsidian → 설정 → 커뮤니티 플러그인에서 **Bookdrop**를 켭니다.

## API 키

### 카카오 (국내서에 추천)
1. https://developers.kakao.com 에 로그인 → **내 애플리케이션 → 애플리케이션 추가하기**
2. 앱을 만든 뒤 **앱 키**의 **REST API 키**를 복사합니다.
3. 플러그인 설정에 붙여 넣고 **연결 확인**을 누릅니다.
   - 401 오류가 나면 REST API 키가 아닌 다른 키(JavaScript 키 등)를 넣었는지 확인하세요.

### Google Books (외서에 강함, 키는 선택)
키 없이도 동작합니다. 자주 쓰다 429(요청 한도) 오류가 나면 Google Cloud Console에서 **Books API**를 사용 설정하고 API 키를 만들어 넣으세요.

## 템플릿

`{{변수}}` 형태로 씁니다. 필터를 붙일 수 있습니다.

| 필터 | 결과 예시 | 용도 |
|---|---|---|
| `{{title}}` | 미움받을 용기 | 본문 |
| `{{title:json}}` | `"미움받을 용기"` | 프런트매터 (콜론·따옴표가 있어도 안전) |
| `{{authors:json}}` | `["기시미 이치로","고가 후미타케"]` | 프런트매터 목록 |
| `{{authors:link}}` | `[[기시미 이치로]], [[고가 후미타케]]` | 본문 링크 |
| `{{authors:linkjson}}` | `["[[기시미 이치로]]","[[고가 후미타케]]"]` | 프런트매터 링크 목록 |

변수: `title` `subtitle` `author` `authors` `translator` `translators` `publisher` `publishDate` `publishYear` `isbn` `isbn10` `isbn13` `pageCount` `categories` `description` `coverUrl` `link` `price` `language` `source` `today`

표지 주소가 없으면 `![...]()`처럼 깨진 이미지 줄은 자동으로 지웁니다.

**소스별 차이:** 카카오는 역자·가격을 주지만 쪽수·분류는 없고, 책 소개가 짧게 잘려 옵니다. Google은 쪽수·분류·긴 소개를 주지만 국내서 정보가 빈약한 편입니다.

## 개발

```bash
npm install
npm run dev     # 변경을 감시하며 main.js 빌드
npm run build   # 타입 검사 + 배포용 빌드
```

개발할 때는 이 폴더를 보관소의 `.obsidian/plugins/bookdrop/`에 두거나 심볼릭 링크를 걸고, **Hot Reload** 플러그인을 쓰면 편합니다.

## 커뮤니티 플러그인으로 등록하기

2026년 5월부터는 [community.obsidian.md](https://community.obsidian.md)에서 신청합니다.

1. 이 폴더를 GitHub 공개 저장소로 올립니다(`README.md`, `LICENSE`, `manifest.json`이 맨 위에 있어야 함).
2. `manifest.json`의 `version`과 똑같은 이름의 태그(예: `0.3.0`, 앞에 `v` 없이)로 GitHub Release를 만들고 `main.js`, `manifest.json`, `styles.css`를 첨부합니다.
3. community.obsidian.md에 Obsidian 계정으로 로그인하고 GitHub 계정을 연결합니다.
4. **Add a plugin or theme**에서 이 저장소를 고릅니다. 심사는 자동이고 보통 몇 분 안에 결과가 나옵니다.

## 후원

Bookdrop이 도움이 되셨다면 커피 한 잔으로 응원해 주세요.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/4h9fg59wsgd)

## License

MIT
