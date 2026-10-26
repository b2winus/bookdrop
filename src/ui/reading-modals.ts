import { App, ButtonComponent, FuzzySuggestModal, Modal, Setting, TextAreaComponent, TextComponent } from "obsidian";
import { t } from "../i18n";
import { ReadingStatus, STATUSES, stars } from "../reading";

/** Pick a reading status; the current one is marked. */
export class StatusPickModal extends FuzzySuggestModal<ReadingStatus> {
	constructor(
		app: App,
		private label: (s: ReadingStatus) => string,
		private current: ReadingStatus | null,
		private onPick: (s: ReadingStatus) => void,
	) {
		super(app);
		this.setPlaceholder(t("read.pickStatus"));
	}

	getItems(): ReadingStatus[] {
		return STATUSES;
	}

	getItemText(s: ReadingStatus): string {
		return s === this.current ? `${this.label(s)}  ✓` : this.label(s);
	}

	onChooseItem(s: ReadingStatus): void {
		this.onPick(s);
	}
}

/** One to five stars (half steps with the keyboard: type 3.5), or clear. */
export class RatingModal extends Modal {
	constructor(
		app: App,
		private current: number | null,
		private onPick: (rating: number | null) => void,
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		this.titleEl.setText(t("read.rateTitle"));
		const row = contentEl.createDiv({ cls: "bookdrop-stars" });
		for (let n = 1; n <= 5; n++) {
			const b = row.createEl("button", { text: "★", cls: "bookdrop-star", attr: { "aria-label": stars(n) } });
			if (this.current !== null && n <= this.current) b.addClass("is-on");
			b.addEventListener("click", () => this.done(n));
		}
		let typed = "";
		const input = new TextComponent(contentEl).setPlaceholder(t("read.rateTyped"));
		input.inputEl.addClass("bookdrop-rating-input");
		input.onChange((v) => (typed = v.trim()));
		input.inputEl.addEventListener("keydown", (e) => {
			if (e.key !== "Enter" || e.isComposing) return;
			e.preventDefault();
			const n = Number(typed.replace(",", "."));
			if (Number.isFinite(n) && n >= 1 && n <= 5) this.done(n);
		});
		new Setting(contentEl).addButton((b) => b.setButtonText(t("read.rateClear")).onClick(() => this.done(null)));
		window.setTimeout(() => input.inputEl.focus(), 0);
	}

	onClose(): void {
		this.contentEl.empty();
	}

	private done(rating: number | null): void {
		this.close();
		this.onPick(rating);
	}
}

/** Page reached so far. */
export class ProgressModal extends Modal {
	constructor(
		app: App,
		private current: number | null,
		private pages: number | null,
		private onPick: (page: number) => void,
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		this.titleEl.setText(t("read.progressTitle"));
		let value = this.current ? String(this.current) : "";
		const submit = () => {
			const n = Number(value);
			if (!Number.isInteger(n) || n < 0) return;
			this.close();
			this.onPick(n);
		};
		new Setting(contentEl)
			.setName(t("read.progressPage"))
			.setDesc(this.pages ? t("read.progressOf", { pages: this.pages }) : "")
			.addText((x) => {
				x.inputEl.type = "number";
				x.inputEl.min = "0";
				if (this.pages) x.inputEl.max = String(this.pages);
				x.setValue(value).onChange((v) => (value = v.trim()));
				x.inputEl.addEventListener("keydown", (e) => {
					if (e.key === "Enter" && !e.isComposing) {
						e.preventDefault();
						submit();
					}
				});
				window.setTimeout(() => x.inputEl.select(), 0);
			})
			.addButton((b) => b.setButtonText(t("read.save")).setCta().onClick(submit));
	}

	onClose(): void {
		this.contentEl.empty();
	}
}

/** A quote and the page it is on. Cmd/Ctrl+Enter saves. */
export class QuoteModal extends Modal {
	constructor(
		app: App,
		private initial: string,
		private onSave: (quote: string, page: string) => void,
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		this.titleEl.setText(t("read.quoteTitle"));
		let quote = this.initial;
		let page = "";
		const area = new TextAreaComponent(contentEl).setPlaceholder(t("read.quotePlaceholder")).setValue(quote);
		area.inputEl.addClass("bookdrop-quote-area");
		area.inputEl.rows = 6;
		area.onChange((v) => (quote = v));

		const save = () => {
			if (!quote.trim()) return;
			this.close();
			this.onSave(quote, page);
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				save();
			}
		};
		area.inputEl.addEventListener("keydown", onKey);

		const row = new Setting(contentEl).setName(t("read.quotePage")).addText((x) => {
			x.setPlaceholder("123").onChange((v) => (page = v));
			x.inputEl.addEventListener("keydown", onKey);
		});
		row.addButton((b: ButtonComponent) => b.setButtonText(t("read.save")).setCta().onClick(save));
		window.setTimeout(() => area.inputEl.focus(), 0);
	}

	onClose(): void {
		this.contentEl.empty();
	}
}

/** Asks for a name (e.g. the bookshelf file). Enter or the button confirms. */
export class NameModal extends Modal {
	constructor(
		app: App,
		private title: string,
		private label: string,
		private initial: string,
		private button: string,
		private onSubmit: (name: string) => void,
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		this.titleEl.setText(this.title);
		let value = this.initial;
		const submit = () => {
			if (!value.trim()) return;
			this.close();
			this.onSubmit(value.trim());
		};
		new Setting(contentEl)
			.setName(this.label)
			.addText((x) => {
				x.setValue(value).onChange((v) => (value = v));
				x.inputEl.addEventListener("keydown", (e) => {
					if (e.key === "Enter" && !e.isComposing) {
						e.preventDefault();
						submit();
					}
				});
				window.setTimeout(() => x.inputEl.select(), 0);
			})
			.addButton((b) => b.setButtonText(this.button).setCta().onClick(submit));
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
