import { Editor, MarkdownView, Notice, Plugin, TFile, TFolder, normalizePath, requireApiVersion } from "obsidian";
import { BookdropSettingTab, BookdropSettings, DEFAULT_SETTINGS, ENRICH_KEYS, defaultQuotesHeading } from "./settings";
import { PROP, ReadingStatus, applyProgress, applyRating, applyStatus, insertQuote, readNumber, readStatus, stars, statusLabel } from "./reading";
import { bookshelfBase } from "./bookshelf";
import { NameModal, ProgressModal, QuoteModal, RatingModal, StatusPickModal } from "./ui/reading-modals";
import { BookSearchModal } from "./ui/search-modal";
import { FolderPickModal } from "./ui/folder-suggest";
import { Book, EnricherId, SearchOptions } from "./types";
import { ENRICHERS, startingProvider } from "./providers";
import { enrichBook } from "./enrich";
import { defaultInsertTemplate, defaultNoteTemplate, isDefaultTemplate, makeFileName, renderTemplate, sanitizeFileName } from "./template";
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
					editor.replaceSelection(renderTemplate(this.insertTemplate(), book, { status: statusLabel(this.settings, "toRead") }));
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

		this.addReadingCommands();
		this.addSettingTab(new BookdropSettingTab(this.app, this));
	}

	// ── Reading log ─────────────────────────

	/** Commands that work on the note in the active editor. */
	private addReadingCommands(): void {
		const onNote = (id: string, name: string, run: (file: TFile, editor: Editor) => void) =>
			this.addCommand({
				id,
				name,
				editorCheckCallback: (checking, editor, ctx) => {
					const file = ctx.file;
					if (!file) return false;
					if (!checking) run(file, editor);
					return true;
				},
			});

		onNote("reading-status", t("cmd.status"), (file) => {
			new StatusPickModal(this.app, (s) => statusLabel(this.settings, s), readStatus(this.app, file, this.settings), (s) => void this.setStatus(file, s)).open();
		});
		onNote("start-reading", t("cmd.startReading"), (file) => void this.setStatus(file, "reading"));
		onNote("finish-reading", t("cmd.finishReading"), (file) => void this.setStatus(file, "finished"));
		onNote("rate-book", t("cmd.rate"), (file) => {
			new RatingModal(this.app, readNumber(this.app, file, PROP.rating), (r) => void this.setRating(file, r)).open();
		});
		onNote("reading-progress", t("cmd.progress"), (file) => {
			const pages = readNumber(this.app, file, PROP.pages);
			new ProgressModal(this.app, readNumber(this.app, file, PROP.progress), pages, (p) => void this.setProgress(file, p)).open();
		});
		onNote("add-quote", t("cmd.quote"), (file, editor) => {
			new QuoteModal(this.app, editor.getSelection(), (quote, page) => void this.addQuote(file, quote, page)).open();
		});

		this.addCommand({
			id: "create-bookshelf",
			name: t("cmd.bookshelf"),
			callback: () => void this.createBookshelf(),
		});
	}

	async setStatus(file: TFile, status: ReadingStatus): Promise<void> {
		await this.app.fileManager.processFrontMatter(file, (fm: Record<string, unknown>) => applyStatus(fm, this.settings, status));
		new Notice(t("notice.status", { status: statusLabel(this.settings, status) }));
	}

	async setRating(file: TFile, rating: number | null): Promise<void> {
		await this.app.fileManager.processFrontMatter(file, (fm: Record<string, unknown>) => applyRating(fm, rating));
		new Notice(rating === null ? t("notice.unrated") : t("notice.rated", { stars: stars(rating) }));
	}

	async setProgress(file: TFile, page: number): Promise<void> {
		let result: ReadingStatus | null = null;
		await this.app.fileManager.processFrontMatter(file, (fm: Record<string, unknown>) => {
			result = applyProgress(fm, this.settings, page);
		});
		new Notice(
			result === "finished"
				? t("notice.progressFinished", { status: statusLabel(this.settings, "finished") })
				: t("notice.progress", { page }),
		);
	}

	async addQuote(file: TFile, quote: string, page: string): Promise<void> {
		const heading = this.settings.quotesHeading.trim() || defaultQuotesHeading();
		await this.app.vault.process(file, (content) => insertQuote(content, heading, quote, page));
		new Notice(t("notice.quoteAdded"));
	}

	/** Asks for a name, then creates the bookshelf .base file in the book folder (or opens it if it exists). */
	async createBookshelf(): Promise<void> {
		if (!requireApiVersion("1.9.0")) {
			new Notice(t("notice.basesOld"));
			return;
		}
		const initial = this.settings.bookshelfName.trim() || (getLang() === "ko" ? "내 책장" : "Bookshelf");
		new NameModal(this.app, t("shelf.title"), t("shelf.name"), initial, t("set.bookshelfButton"), (name) => {
			void this.writeBookshelf(name).catch((e: unknown) => new Notice(e instanceof Error ? e.message : String(e)));
		}).open();
	}

	private async writeBookshelf(rawName: string): Promise<void> {
		const base = sanitizeFileName(rawName.replace(/\.base$/i, ""));
		if (!base) return;
		this.settings.bookshelfName = base;
		await this.saveSettings();
		const folder = this.settings.folder.trim();
		if (folder) await this.ensureFolder(folder);
		const name = `${base}.base`;
		const path = normalizePath(folder ? `${folder}/${name}` : name);
		const existing = this.app.vault.getAbstractFileByPath(path);
		if (existing instanceof TFile) {
			new Notice(t("notice.bookshelfExists", { path }));
			await this.app.workspace.getLeaf(false).openFile(existing);
			return;
		}
		const file = await this.app.vault.create(path, bookshelfBase(folder, this.settings));
		new Notice(t("notice.bookshelfCreated", { path }));
		await this.app.workspace.getLeaf(false).openFile(file);
	}

	searchOptions(): SearchOptions {
		const s = this.settings;
		return {
			kakaoApiKey: s.kakaoApiKey,
			aladinTtbKey: s.aladinTtbKey,
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

		const content = renderTemplate(this.noteTemplate(), book, { status: statusLabel(this.settings, "toRead") });
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
		// The National Library of Korea source was removed in 0.5.0.
		const stale = this.settings as unknown as Record<string, unknown>;
		delete stale["nlApiKey"];
		delete stale["enrichNl"];
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
