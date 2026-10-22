import { App, ButtonComponent, DropdownComponent, Modal, Notice, TextComponent } from "obsidian";
import { Book, ProviderId, SearchOptions } from "../types";
import { PROVIDERS, otherProvider, providerLabel, searchBooks } from "../providers";
import { t } from "../i18n";

export interface SearchModalConfig {
	initialQuery: string;
	provider: ProviderId;
	fallbackToOther: boolean;
	options: SearchOptions;
	/** 사용자가 책을 고르면 호출 */
	onChoose: (book: Book) => void | Promise<void>;
}

/**
 * 한 화면에서 검색어 입력 → 결과 목록 → 선택까지 처리하는 모달.
 * ↑/↓로 이동, Enter로 검색(입력창) 또는 선택(결과).
 */
export class BookSearchModal extends Modal {
	private cfg: SearchModalConfig;
	private provider: ProviderId;
	private input!: TextComponent;
	private statusEl!: HTMLElement;
	private listEl!: HTMLElement;
	private results: Book[] = [];
	private selected = -1;
	private searching = false;

	constructor(app: App, cfg: SearchModalConfig) {
		super(app);
		this.cfg = cfg;
		this.provider = cfg.provider;
	}

	onOpen(): void {
		const { contentEl } = this;
		this.modalEl.addClass("bookdrop-modal");
		this.titleEl.setText(t("modal.title"));

		const bar = contentEl.createDiv({ cls: "bookdrop-search-bar" });
		this.input = new TextComponent(bar);
		this.input.setPlaceholder(t("modal.placeholder")).setValue(this.cfg.initialQuery);
		this.input.inputEl.addClass("bookdrop-search-input");

		const dd = new DropdownComponent(bar);
		PROVIDERS.forEach((p) => dd.addOption(p, providerLabel(p)));
		dd.setValue(this.provider);
		dd.onChange((v) => {
			this.provider = v as ProviderId;
			if (this.input.getValue().trim()) void this.runSearch();
		});

		new ButtonComponent(bar).setButtonText(t("modal.search")).setCta().onClick(() => void this.runSearch());

		this.statusEl = contentEl.createDiv({ cls: "bookdrop-status" });
		this.listEl = contentEl.createDiv({ cls: "bookdrop-results" });

		this.input.inputEl.addEventListener("keydown", (e) => this.onKey(e));
		window.setTimeout(() => this.input.inputEl.focus(), 0);

		if (this.cfg.initialQuery.trim()) void this.runSearch();
	}

	onClose(): void {
		this.contentEl.empty();
	}

	private onKey(e: KeyboardEvent): void {
		if (e.isComposing) return; // 한글 조합 중 Enter 무시
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

	private async runSearch(): Promise<void> {
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
				// 대체 소스가 카카오인데 키가 없으면 건너뛴다
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

	private renderResults(): void {
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
			info.createDiv({ cls: "bookdrop-meta", text: people.filter(Boolean).join(" · ") });
			const pub = [book.publisher, book.publishDate.slice(0, 4), book.isbn13 || book.isbn10].filter(Boolean);
			info.createDiv({ cls: "bookdrop-meta bookdrop-faint", text: pub.join(" · ") });

			row.addEventListener("mouseenter", () => this.select(i, false));
			row.addEventListener("click", () => void this.choose(book));
		});
	}

	private select(i: number, scroll = true): void {
		const rows = Array.from(this.listEl.children) as HTMLElement[];
		rows.forEach((r, idx) => r.toggleClass("is-selected", idx === i));
		this.selected = i;
		if (scroll) rows[i]?.scrollIntoView({ block: "nearest" });
	}

	private async choose(book: Book): Promise<void> {
		this.close();
		try {
			await this.cfg.onChoose(book);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			new Notice(t("modal.failed", { error: msg }));
			console.error("[Bookdrop]", err);
		}
	}
}
