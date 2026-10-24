import { App, Editor, Modal, Notice, setIcon } from "obsidian";
import type VersedropPlugin from "./main";
import { formatPassages, Passage, refLabel } from "./format";
import { t } from "./i18n";
import { BibleReference, parseReference } from "./reference";
import { hasBook, isCopyrighted, Lang, LANGS, noticeFor, Translation, Verse } from "./sources";

export interface ModalOptions {
	/** Translations to tick (from a preset); changes are not saved as defaults */
	picked?: string[];
}

interface Card {
	translation: Translation;
	checkbox: HTMLInputElement;
	verses: Verse[] | null;
}

export class VerseModal extends Modal {
	private langs: Set<Lang>;
	private input!: HTMLInputElement;
	private messageEl!: HTMLElement;
	private resultsEl!: HTMLElement;
	private insertBtn!: HTMLButtonElement;
	private langButtons = new Map<Lang | "all", HTMLButtonElement>();
	private available: Lang[] = [];
	private ref: BibleReference | null = null;
	private cards: Card[] = [];
	private searchToken = 0;

	private picked: Set<string>;
	private persist: boolean;

	constructor(app: App, private plugin: VersedropPlugin, private editor: Editor, private initial = "", opts: ModalOptions = {}) {
		super(app);
		this.persist = !opts.picked;
		this.picked = new Set(opts.picked ?? plugin.settings.picked);
		if (opts.picked) {
			const langs = plugin.allTranslations().filter((tr) => this.picked.has(tr.id)).map((tr) => tr.lang);
			this.langs = new Set(langs.length ? langs : plugin.settings.languages);
		} else this.langs = new Set(plugin.settings.languages);
	}

	onOpen(): void {
		const { contentEl, modalEl } = this;
		modalEl.addClass("versedrop-modal");
		this.titleEl.setText(t.modalTitle);

		// Search row
		const row = contentEl.createDiv({ cls: "versedrop-search" });
		this.input = row.createEl("input", { type: "text", placeholder: t.placeholder, cls: "versedrop-input" });
		this.input.value = this.initial;
		const searchBtn = row.createEl("button", { text: t.search, cls: "mod-cta" });
		searchBtn.addEventListener("click", () => this.search());

		// Language chips — only languages that have translations in "My translations"
		this.available = LANGS.filter((l) => this.plugin.allTranslations().some((tr) => tr.lang === l));
		if (![...this.langs].some((l) => this.available.includes(l)) && this.available.length) this.langs = new Set([this.available[0]]);
		if (this.available.length > 1) {
			const langRow = contentEl.createDiv({ cls: "versedrop-langs" });
			for (const l of this.available) {
				const b = langRow.createEl("button", { text: t.langName[l], cls: "versedrop-lang" });
				b.addEventListener("click", () => this.toggleLang(l));
				this.langButtons.set(l, b);
			}
			const all = langRow.createEl("button", { text: t.langAll, cls: "versedrop-lang versedrop-lang-all" });
			all.addEventListener("click", () => this.selectAllLangs());
			this.langButtons.set("all", all);
			this.paintLang();
		}

		this.messageEl = contentEl.createDiv({ cls: "versedrop-message" });
		this.resultsEl = contentEl.createDiv({ cls: "versedrop-results" });

		// Footer
		const footer = contentEl.createDiv({ cls: "versedrop-footer" });
		footer.createSpan({ text: t.hint, cls: "versedrop-hint" });
		this.insertBtn = footer.createEl("button", { text: t.insert, cls: "mod-cta" });
		this.insertBtn.disabled = true;
		this.insertBtn.addEventListener("click", () => this.insert());

		this.input.addEventListener("keydown", (e) => {
			if (e.key !== "Enter" || e.isComposing) return;
			e.preventDefault();
			if (e.metaKey || e.ctrlKey) this.insert();
			else this.search();
		});
		this.scope.register(["Mod"], "Enter", (e) => {
			e.preventDefault();
			this.insert();
			return false;
		});

		this.input.focus();
		if (this.initial) this.search();
	}

	onClose(): void {
		this.contentEl.empty();
	}

	private toggleLang(l: Lang): void {
		if (this.langs.has(l)) {
			if ([...this.langs].filter((x) => this.available.includes(x)).length <= 1) return; // keep at least one
			this.langs.delete(l);
		} else this.langs.add(l);
		this.afterLangChange();
	}

	private selectAllLangs(): void {
		const allOn = this.available.every((l) => this.langs.has(l));
		this.langs = allOn ? new Set([this.available[0]]) : new Set(this.available);
		this.afterLangChange();
	}

	private afterLangChange(): void {
		this.paintLang();
		if (this.persist) {
			this.plugin.settings.languages = [...this.langs];
			void this.plugin.saveSettings();
		}
		if (this.ref) this.renderResults();
	}

	private paintLang(): void {
		for (const [l, b] of this.langButtons) {
			const on = l === "all" ? this.available.every((x) => this.langs.has(x)) : this.langs.has(l);
			b.toggleClass("is-active", on);
		}
	}

	/** Translations in the chosen languages, in the user's order. */
	private visibleTranslations(): Translation[] {
		return this.plugin.allTranslations().filter((tr) => this.langs.has(tr.lang));
	}

	private search(): void {
		const q = this.input.value.trim();
		if (!q) return;
		try {
			this.ref = parseReference(q);
		} catch (e) {
			this.ref = null;
			this.cards = [];
			this.resultsEl.empty();
			this.showMessage((e as Error).message, true);
			this.updateInsertState();
			return;
		}
		this.renderResults();
	}

	private renderResults(): void {
		const ref = this.ref;
		if (!ref) return;
		const token = ++this.searchToken;
		this.resultsEl.empty();
		this.cards = [];

		const inLangs = this.visibleTranslations();
		const list = inLangs.filter((tr) => hasBook(tr, ref.book.num));
		if (!list.length) {
			this.showMessage(inLangs.length ? t.noTranslationsForBook : t.noTranslations, true);
			this.updateInsertState();
			return;
		}
		this.showMessage([...new Set(list.map((tr) => refLabel(ref, tr.lang, "full", tr.script)))].join(" · "), false);

		const picked = this.picked;
		for (const tr of list) {
			const cardEl = this.resultsEl.createDiv({ cls: "versedrop-card" });
			const head = cardEl.createEl("label", { cls: "versedrop-card-head" });
			const checkbox = head.createEl("input", { type: "checkbox" });
			checkbox.checked = picked.has(tr.id);
			head.createSpan({ text: tr.name, cls: "versedrop-card-name" });
			if (tr.abbr && tr.abbr !== tr.name) head.createSpan({ text: tr.abbr, cls: "versedrop-card-abbr" });
			const body = cardEl.createDiv({ cls: "versedrop-card-body", text: t.loading });
			body.setAttr("lang", tr.lang);
			body.setAttr("dir", tr.lang === "he" ? "rtl" : "auto");

			const card: Card = { translation: tr, checkbox, verses: null };
			this.cards.push(card);
			checkbox.addEventListener("change", () => {
				cardEl.toggleClass("is-picked", checkbox.checked);
				this.rememberPick(tr.id, checkbox.checked);
				this.updateInsertState();
			});
			cardEl.toggleClass("is-picked", checkbox.checked);

			this.plugin.source
				.getPassage(tr, ref)
				.then((verses) => {
					if (token !== this.searchToken) return;
					card.verses = verses;
					body.empty();
					if (!verses.length) {
						body.addClass("is-empty");
						body.setText(t.noVerses);
					} else {
						for (const v of verses) {
							const p = body.createSpan({ cls: "versedrop-verse" });
							p.createEl("sup", { text: String(v.verse) });
							p.appendText(v.text + " ");
						}
						const notice = isCopyrighted(tr) ? noticeFor(tr) : undefined;
						if (notice) cardEl.createDiv({ cls: "versedrop-card-notice", text: notice.text });
					}
					this.updateInsertState();
				})
				.catch((err: Error) => {
					if (token !== this.searchToken) return;
					card.verses = [];
					body.empty();
					body.addClass("is-error");
					const icon = body.createSpan({ cls: "versedrop-error-icon" });
					setIcon(icon, "alert-triangle");
					body.appendText(err.message);
					this.updateInsertState();
				});
		}
		this.updateInsertState();
	}

	private rememberPick(id: string, on: boolean): void {
		if (on) this.picked.add(id);
		else this.picked.delete(id);
		if (!this.persist) return;
		const s = this.plugin.settings;
		s.picked = on ? [...new Set([...s.picked, id])] : s.picked.filter((x) => x !== id);
		void this.plugin.saveSettings();
	}

	private updateInsertState(): void {
		this.insertBtn.disabled = !this.cards.some((c) => c.checkbox.checked && c.verses && c.verses.length);
	}

	private showMessage(text: string, isError: boolean): void {
		this.messageEl.setText(text);
		this.messageEl.toggleClass("is-error", isError);
	}

	private insert(): void {
		if (!this.ref) return;
		const chosen: Passage[] = this.cards
			.filter((c) => c.checkbox.checked && c.verses && c.verses.length)
			.map((c) => ({ translation: c.translation, verses: c.verses as Verse[] }));
		if (!chosen.length) {
			new Notice(t.noneSelected);
			return;
		}
		const limit = this.plugin.settings.quoteWarn;
		const heavy = chosen.filter((p) => isCopyrighted(p.translation) && p.verses.length > limit);
		if (limit > 0 && heavy.length) {
			new Notice(t.quoteWarn(heavy.map((p) => p.translation.name).join(", "), limit), 10000);
		}
		const text = formatPassages(this.ref, chosen, this.plugin.settings);
		this.plugin.insertIntoEditor(this.editor, text);
		this.close();
	}
}
