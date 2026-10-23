import { Editor, MarkdownView, Notice, Plugin, TFile, TFolder, normalizePath } from "obsidian";
import { BookdropSettingTab, BookdropSettings, DEFAULT_SETTINGS, ENRICH_KEYS } from "./settings";
import { BookSearchModal } from "./ui/search-modal";
import { FolderPickModal } from "./ui/folder-suggest";
import { Book, EnricherId, SearchOptions } from "./types";
import { ENRICHERS, startingProvider } from "./providers";
import { enrichBook } from "./enrich";
import { defaultInsertTemplate, defaultNoteTemplate, isDefaultTemplate, makeFileName, renderTemplate } from "./template";
import { getLang, setLanguage, t } from "./i18n";

export default class BookdropPlugin extends Plugin {
	settings!: BookdropSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.addRibbonIcon("book-open", t("cmd.create"), () => this.openSearch("", (b) => this.createBookNote(b)));

		this.addCommand({
			id: "create-book-note",
			name: t("cmd.create"),
			callback: () => this.openSearch("", (b) => this.createBookNote(b)),
		});

		this.addCommand({
			id: "insert-book-info",
			name: t("cmd.insert"),
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection().trim();
				this.openSearch(selection, (book) => {
					editor.replaceSelection(renderTemplate(this.insertTemplate(), book));
				});
			},
		});

		this.addCommand({
			id: "fill-frontmatter",
			name: t("cmd.fill"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveViewOfType(MarkdownView)?.file;
				if (!file) return false;
				if (!checking) {
					this.openSearch(this.guessQuery(file), (book) => this.fillFrontmatter(file, book));
				}
				return true;
			},
		});

		this.addSettingTab(new BookdropSettingTab(this.app, this));
	}

	searchOptions(): SearchOptions {
		const s = this.settings;
		return {
			kakaoApiKey: s.kakaoApiKey,
			aladinTtbKey: s.aladinTtbKey,
			nlApiKey: s.nlApiKey,
			googleApiKey: s.googleApiKey,
			googleLangRestrict: s.googleLangRestrict,
			maxResults: s.maxResults,
		};
	}

	private openSearch(initialQuery: string, onChoose: (book: Book) => void | Promise<void>): void {
		const options = this.searchOptions();
		new BookSearchModal(this.app, {
			initialQuery,
			// Start with a source the user has a key for.
			provider: startingProvider(this.settings.defaultProvider, options),
			fallbackToOther: this.settings.fallbackToOther,
			options,
			onChoose: async (book) => onChoose(await this.completeBook(book)),
		}).open();
	}

	/** Enrichment sources the user has turned on. */
	private enabledEnrichers(): EnricherId[] {
		if (!this.settings.enrich) return [];
		return ENRICHERS.filter((e) => this.settings[ENRICH_KEYS[e]] === true);
	}

	/** Adds details from other sources (and Aladin's detail record) before the book is used. */
	private async completeBook(book: Book): Promise<Book> {
		const enabled = this.enabledEnrichers();
		if (!enabled.length && book.source !== "aladin") return book;
		// Only show a notice if the lookup is slow enough to notice.
		let notice: Notice | null = null;
		const timer = window.setTimeout(() => {
			notice = new Notice(t("modal.enriching"), 0);
		}, 400);
		try {
			return await enrichBook(book, enabled, this.searchOptions());
		} finally {
			window.clearTimeout(timer);
			(notice as Notice | null)?.hide();
		}
	}

	/** 프런트매터의 isbn → title → 파일 이름 순으로 검색어를 추정 */
	private guessQuery(file: TFile): string {
		const fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
		const isbn: unknown = fm?.["isbn"];
		if (typeof isbn === "string" || typeof isbn === "number") return String(isbn);
		const title: unknown = fm?.["title"];
		if (typeof title === "string" && title.trim()) return title;
		return file.basename;
	}

	async createBookNote(book: Book): Promise<void> {
		const folder = this.settings.askFolderEachTime ? await this.pickFolder() : this.settings.folder.trim();
		if (folder === null) return; // 폴더 선택 취소
		if (folder) await this.ensureFolder(folder);

		const fileName = makeFileName(this.settings.fileNameTemplate, book);
		const path = normalizePath(folder ? `${folder}/${fileName}.md` : `${fileName}.md`);

		const existing = this.app.vault.getAbstractFileByPath(path);
		if (existing instanceof TFile) {
			new Notice(t("notice.exists", { name: existing.basename }));
			await this.app.workspace.getLeaf(false).openFile(existing);
			return;
		}

		const content = renderTemplate(this.noteTemplate(), book);
		const file = await this.app.vault.create(path, content);
		new Notice(t("notice.created", { name: file.basename }));
		if (this.settings.openAfterCreate) {
			await this.app.workspace.getLeaf(false).openFile(file);
		}
	}

	/** 폴더 선택 창을 띄워 경로를 돌려준다. 취소하면 null */
	private pickFolder(): Promise<string | null> {
		return new Promise((resolve) => {
			new FolderPickModal(this.app, this.settings.folder.trim(), resolve).open();
		});
	}

	async fillFrontmatter(file: TFile, book: Book): Promise<void> {
		const fields: Record<string, unknown> = {
			title: book.title,
			author: book.authors,
			translator: book.translators,
			publisher: book.publisher,
			published: book.publishDate,
			isbn: book.isbn13 || book.isbn10,
			pages: book.pageCount,
			original_title: book.originalTitle,
			series: book.series,
			kdc: book.kdc,
			categories: book.categories,
			cover: book.coverUrl,
			link: book.link,
		};
		const overwrite = this.settings.overwriteFrontmatter;
		let changed = 0;
		await this.app.fileManager.processFrontMatter(file, (fm: Record<string, unknown>) => {
			for (const [key, value] of Object.entries(fields)) {
				if (isEmpty(value)) continue;
				if (!overwrite && !isEmpty(fm[key])) continue;
				fm[key] = value;
				changed++;
			}
		});
		new Notice(changed ? t("notice.filled", { count: changed }) : t("notice.nothingToFill"));
	}

	private async ensureFolder(folder: string): Promise<void> {
		const path = normalizePath(folder);
		const f = this.app.vault.getAbstractFileByPath(path);
		if (f instanceof TFolder) return;
		if (f) throw new Error(t("notice.notFolder", { path }));
		await this.app.vault.createFolder(path);
	}

	noteTemplate(): string {
		return this.settings.noteTemplate || defaultNoteTemplate(getLang());
	}

	insertTemplate(): string {
		return this.settings.insertTemplate || defaultInsertTemplate(getLang());
	}

	async loadSettings(): Promise<void> {
		const saved = (await this.loadData()) as Partial<BookdropSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, saved ?? {});
		// 이전 버전이 저장한 기본 템플릿은 비워서, 언어에 맞는 기본값을 따르게 한다
		if (isDefaultTemplate(this.settings.noteTemplate)) this.settings.noteTemplate = "";
		if (isDefaultTemplate(this.settings.insertTemplate)) this.settings.insertTemplate = "";
		setLanguage(this.settings.language);
	}

	async saveSettings(): Promise<void> {
		setLanguage(this.settings.language);
		await this.saveData(this.settings);
	}
}

function isEmpty(v: unknown): boolean {
	return v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
}
