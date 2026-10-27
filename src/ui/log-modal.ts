import { App, ButtonComponent, Modal, Notice, Setting, TFile, TextAreaComponent } from "obsidian";
import { t } from "../i18n";
import {
	PROP,
	ReadingStatus,
	STATUSES,
	StatusLabels,
	applyLog,
	insertIntoSection,
	memoBlock,
	memoHeadings,
	parseStatus,
	quoteBlock,
	quoteHeadings,
	stars,
	statusLabel,
	todayString,
} from "../reading";
import { getLang } from "../i18n";

/** Rounds to half stars between 0 and 5. */
export function clampRating(v: number): number {
	if (!Number.isFinite(v)) return 0;
	return Math.min(5, Math.max(0, Math.round(v * 2) / 2));
}

/** Position across the star row (0–1) → rating. The left half of a star is half a star. */
export function ratingAt(fraction: number): number {
	return clampRating(Math.ceil(Math.min(1, Math.max(0, fraction)) * 10) / 2) || 0.5;
}

/** A stored rating (number, numeric string or ★ text) as a number. */
export function parseRating(value: unknown): number {
	if (typeof value === "number") return clampRating(value);
	if (typeof value === "string") {
		const v = value.trim();
		if (!v) return 0;
		if (/^[★☆½\s]+$/.test(v)) return clampRating((v.match(/★/g) ?? []).length + (v.includes("½") ? 0.5 : 0));
		const n = Number(v);
		return Number.isFinite(n) ? clampRating(n) : 0;
	}
	return 0;
}

export interface BookLogOptions {
	labels: StatusLabels;
	/** User's quotes heading ("" = default for the language) */
	quotesHeading: string;
	/** Status preselected when the note has none */
	defaultStatus: ReadingStatus;
}

/**
 * Records a book in one window: status, star rating (half stars), a one-line review,
 * a quote with its page, a memo, and the date used for started/finished.
 * Status, dates, rating and the one-liner go into frontmatter; the quote and memo into the note body.
 */
export class BookLogModal extends Modal {
	private status: ReadingStatus;
	private rating: number;
	private oneLiner: string;
	private quote = "";
	private page = "";
	private memo = "";
	private date = todayString();
	private starsEl: HTMLElement | null = null;
	private ratingText: HTMLElement | null = null;

	constructor(
		app: App,
		private file: TFile,
		private opts: BookLogOptions,
	) {
		super(app);
		const fm = (app.metadataCache.getFileCache(file)?.frontmatter ?? {}) as Record<string, unknown>;
		this.status = parseStatus(opts.labels, fm[PROP.status]) ?? opts.defaultStatus;
		this.rating = parseRating(fm[PROP.rating] ?? fm[PROP.stars]);
		const one = fm[PROP.oneLiner];
		this.oneLiner = typeof one === "string" ? one : "";
	}

	onOpen(): void {
		const { contentEl } = this;
		this.modalEl.addClass("bookdrop-log");
		this.titleEl.setText(`${t("log.title")} · ${this.file.basename}`);

		let dateSetting: Setting | null = null;
		const paintDate = () => {
			const name = this.status === "finished" ? t("log.dateFinished") : this.status === "reading" ? t("log.dateStarted") : t("log.date");
			dateSetting?.setName(name);
			dateSetting?.settingEl.toggle(this.status === "reading" || this.status === "finished");
		};

		new Setting(contentEl).setName(t("log.status")).addDropdown((dd) => {
			for (const s of STATUSES) dd.addOption(s, statusLabel(this.opts.labels, s));
			dd.setValue(this.status).onChange((v) => {
				this.status = v as ReadingStatus;
				paintDate();
			});
		});

		const ratingSetting = new Setting(contentEl).setName(t("log.rating")).setDesc(t("log.ratingDesc"));
		ratingSetting.settingEl.addClass("bookdrop-rating-setting");
		this.renderStars(ratingSetting.controlEl);

		new Setting(contentEl).setName(t("log.oneLiner")).addText((tx) => {
			tx.setPlaceholder(t("log.oneLinerPlaceholder"))
				.setValue(this.oneLiner)
				.onChange((v) => (this.oneLiner = v));
			tx.inputEl.addClass("bookdrop-oneliner");
		});

		this.textArea(contentEl, t("log.quote"), t("log.quoteDesc"), t("read.quotePlaceholder"), 3, (v) => (this.quote = v));
		new Setting(contentEl).setName(t("read.quotePage")).addText((tx) => {
			tx.setPlaceholder("123").onChange((v) => (this.page = v));
			tx.inputEl.addClass("bookdrop-page-input");
		});
		this.textArea(contentEl, t("log.memo"), t("log.memoDesc"), t("log.memoPlaceholder"), 4, (v) => (this.memo = v));

		dateSetting = new Setting(contentEl).addText((tx) => {
			tx.inputEl.type = "date";
			tx.setValue(this.date).onChange((v) => (this.date = v));
		});
		paintDate();

		const footer = contentEl.createDiv({ cls: "modal-button-container" });
		footer.createSpan({ cls: "bookdrop-hint", text: t("log.saveHint") });
		new ButtonComponent(footer).setButtonText(t("log.skip")).onClick(() => this.close());
		new ButtonComponent(footer).setButtonText(t("read.save")).setCta().onClick(() => void this.save());

		this.scope.register(["Mod"], "Enter", (e) => {
			e.preventDefault();
			void this.save();
			return false;
		});
		window.setTimeout(() => this.starsEl?.focus(), 0);
	}

	onClose(): void {
		this.contentEl.empty();
	}

	private textArea(el: HTMLElement, name: string, desc: string, placeholder: string, rows: number, onChange: (v: string) => void): void {
		const s = new Setting(el).setName(name).setDesc(desc);
		s.settingEl.addClass("bookdrop-textarea-setting");
		const ta = new TextAreaComponent(s.controlEl);
		ta.setPlaceholder(placeholder).onChange(onChange);
		ta.inputEl.rows = rows;
		ta.inputEl.addClass("bookdrop-textarea");
	}

	private renderStars(el: HTMLElement): void {
		const wrap = el.createDiv({ cls: "bookdrop-stars-wrap" });
		const row = wrap.createDiv({
			cls: "bookdrop-star-row",
			attr: { tabindex: "0", role: "slider", "aria-valuemin": "0", "aria-valuemax": "5", "aria-label": t("log.rating") },
		});
		this.starsEl = row;
		for (let i = 0; i < 5; i++) row.createSpan({ cls: "bookdrop-star-cell", text: "★" });
		this.ratingText = wrap.createSpan({ cls: "bookdrop-rating-text" });

		const fractionOf = (e: MouseEvent) => {
			const rect = row.getBoundingClientRect();
			return rect.width ? (e.clientX - rect.left) / rect.width : 0;
		};
		row.addEventListener("mousemove", (e) => this.paint(ratingAt(fractionOf(e))));
		row.addEventListener("mouseleave", () => this.paint(this.rating));
		row.addEventListener("click", (e) => {
			this.rating = ratingAt(fractionOf(e));
			this.paint(this.rating);
		});
		row.addEventListener("keydown", (e) => {
			if (e.key === "ArrowRight" || e.key === "ArrowUp") this.rating = clampRating(this.rating + 0.5);
			else if (e.key === "ArrowLeft" || e.key === "ArrowDown") this.rating = clampRating(this.rating - 0.5);
			else if (e.key === "0" || e.key === "Backspace" || e.key === "Delete") this.rating = 0;
			else if (/^[1-5]$/.test(e.key)) this.rating = Number(e.key);
			else return;
			e.preventDefault();
			this.paint(this.rating);
		});

		const clear = wrap.createEl("button", { cls: "clickable-icon bookdrop-clear", attr: { "aria-label": t("read.rateClear") } });
		clear.setText("×");
		clear.addEventListener("click", () => {
			this.rating = 0;
			this.paint(0);
		});
		this.paint(this.rating);
	}

	private paint(value: number): void {
		if (!this.starsEl || !this.ratingText) return;
		const cells = Array.from(this.starsEl.children) as HTMLElement[];
		cells.forEach((c, i) => {
			c.toggleClass("is-full", value >= i + 1);
			c.toggleClass("is-half", value === i + 0.5);
		});
		this.starsEl.setAttr("aria-valuenow", String(value));
		this.ratingText.setText(value ? `${stars(value)}  ${value}` : t("log.noRating"));
	}

	private async save(): Promise<void> {
		const log = { status: this.status, rating: this.rating, oneLiner: this.oneLiner, date: this.date };
		await this.app.fileManager.processFrontMatter(this.file, (fm: Record<string, unknown>) => applyLog(fm, this.opts.labels, log));

		const quote = this.quote.trim();
		const memo = this.memo.trim();
		if (quote || memo) {
			const ko = getLang() === "ko";
			const qHeading = this.opts.quotesHeading.trim() || (ko ? "인용" : "Quotes");
			const mHeading = ko ? "메모" : "Notes";
			const date = /^\d{4}-\d{2}-\d{2}$/.test(this.date) ? this.date : todayString();
			await this.app.vault.process(this.file, (content) => {
				let out = content;
				if (quote) out = insertIntoSection(out, quoteHeadings(qHeading), qHeading, quoteBlock(quote, this.page));
				if (memo) out = insertIntoSection(out, memoHeadings(), mHeading, memoBlock(memo, date));
				return out;
			});
		}
		new Notice(t("log.saved", { name: this.file.basename }));
		this.close();
	}
}
