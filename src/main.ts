import { Editor, Notice, Plugin } from "obsidian";
import { AccordanceBridge } from "./accordance";
import { formatPassages, Passage } from "./format";
import { removeCommand } from "./hotkeys";
import { t } from "./i18n";
import { VerseModal } from "./modal";
import { BibleReference, parseReference } from "./reference";
import { DEFAULT_SETTINGS, Preset, sortByOrder, VersedropSettings } from "./settings";
import { VersedropSettingTab } from "./settings-tab";
import { BibleSource, BUILT_IN_TRANSLATIONS, hasBook, isCopyrighted, Translation } from "./sources";

export default class VersedropPlugin extends Plugin {
	settings!: VersedropSettings;
	source!: BibleSource;
	accordance!: AccordanceBridge;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.accordance = new AccordanceBridge();
		this.source = new BibleSource(this.app, () => this.settings.esvApiKey, this.accordance);

		this.addCommand({
			id: "insert-passage",
			name: t.cmdInsert,
			icon: "book-open",
			editorCallback: (editor: Editor) => {
				const found = this.referenceAtCursor(editor);
				new VerseModal(this.app, this, editor, found?.text ?? "").open();
			},
		});

		this.addCommand({
			id: "insert-direct",
			name: t.cmdDirect,
			icon: "zap",
			editorCallback: (editor: Editor) => this.runDirect(editor, this.settings.picked),
		});

		for (const p of this.settings.presets) this.registerPreset(p);

		this.addSettingTab(new VersedropSettingTab(this.app, this));
	}

	/** Enabled built-in translations followed by custom ones that are filled in. */
	allTranslations(): Translation[] {
		const enabled = new Set(this.settings.enabled);
		const builtIn = BUILT_IN_TRANSLATIONS.filter(
			(tr) => enabled.has(tr.id) && (tr.source !== "esv" || this.settings.esvApiKey.trim()),
		);
		const custom = this.settings.custom
			.filter((tr) => tr.name.trim() && (tr.source === "bolls" ? tr.code : tr.source === "file" ? tr.path : tr.module))
			.map((tr) => ({ ...tr, abbr: tr.abbr || tr.name }));
		return sortByOrder([...builtIn, ...custom], this.settings.order);
	}

	/** A reference in the selection, or — with nothing selected — on the cursor's line on its own. */
	referenceAtCursor(editor: Editor): { ref: BibleReference; text: string; line: number } | null {
		const selected = editor.getSelection().trim();
		const line = editor.getCursor("to").line;
		const candidate = selected || editor.getLine(line).trim().replace(/^[-*>\s]+/, "");
		if (!candidate || candidate.length > 60) return null;
		try {
			return { ref: parseReference(candidate), text: candidate, line };
		} catch {
			return null;
		}
	}

	/** Command id for a preset (without the plugin prefix). */
	presetCommandId(p: Preset): string {
		return `preset-${p.id}`;
	}

	registerPreset(p: Preset): void {
		this.addCommand({
			id: this.presetCommandId(p),
			name: t.cmdPreset(p.name || t.sUnnamed),
			icon: "bookmark",
			editorCallback: (editor: Editor) => {
				const found = this.referenceAtCursor(editor);
				if (found) void this.runDirect(editor, p.translations);
				else new VerseModal(this.app, this, editor, "", { picked: p.translations }).open();
			},
		});
	}

	unregisterPreset(p: Preset): void {
		removeCommand(this.app, `${this.manifest.id}:${this.presetCommandId(p)}`);
	}

	/**
	 * Inserts the reference at the cursor in the given translations without opening the window.
	 * Falls back to the search window when there is no reference at the cursor.
	 */
	async runDirect(editor: Editor, ids: string[]): Promise<void> {
		const found = this.referenceAtCursor(editor);
		if (!found) {
			new VerseModal(this.app, this, editor, "", { picked: ids }).open();
			return;
		}
		const wanted = new Set(ids);
		const list = this.allTranslations().filter((tr) => wanted.has(tr.id) && hasBook(tr, found.ref.book.num));
		if (!list.length) {
			new Notice(t.directNone);
			return;
		}
		const loading = new Notice(t.loading, 0);
		const results = await Promise.allSettled(list.map((tr) => this.source.getPassage(tr, found.ref)));
		loading.hide();
		const passages: Passage[] = [];
		const failed: string[] = [];
		results.forEach((r, i) => {
			if (r.status === "fulfilled" && r.value.length) passages.push({ translation: list[i], verses: r.value });
			else failed.push(list[i].name);
		});
		if (failed.length) new Notice(t.directFailed(failed.join(", ")), 6000);
		if (!passages.length) return;
		const limit = this.settings.quoteWarn;
		const heavy = passages.filter((p) => isCopyrighted(p.translation) && p.verses.length > limit);
		if (limit > 0 && heavy.length) new Notice(t.quoteWarn(heavy.map((p) => p.translation.name).join(", "), limit), 10000);
		this.insertBelowLine(editor, found.line, formatPassages(found.ref, passages, this.settings));
	}

	private insertBelowLine(editor: Editor, line: number, text: string): void {
		const end = { line, ch: editor.getLine(line).length };
		editor.replaceRange(`\n\n${text}\n`, end);
		editor.setCursor({ line: line + text.split("\n").length + 2, ch: 0 });
	}

	/**
	 * Inserts below the current selection (keeping a selected reference such as "요 3:16" in place),
	 * or at the cursor when nothing is selected.
	 */
	insertIntoEditor(editor: Editor, text: string): void {
		if (editor.somethingSelected() || this.referenceAtCursor(editor)) {
			this.insertBelowLine(editor, editor.getCursor("to").line, text);
			return;
		}
		const cur = editor.getCursor();
		const lineText = editor.getLine(cur.line);
		const prefix = lineText.trim() ? "\n\n" : "";
		editor.replaceSelection(`${prefix}${text}\n`);
	}

	async loadSettings(): Promise<void> {
		const saved = ((await this.loadData()) ?? {}) as Partial<VersedropSettings>;
		this.settings = { ...DEFAULT_SETTINGS, ...saved };
		this.settings.custom = this.settings.custom ?? [];
		this.settings.presets = this.settings.presets ?? [];
		// 0.3.x stored a single "language" (ko / en / both)
		const legacy = (saved as { language?: string }).language;
		if (!saved.languages && legacy) this.settings.languages = legacy === "both" ? ["ko", "en"] : [legacy as "ko" | "en"];
		// Turn on built-in translations added in a newer version (only those that are on by default).
		const seen = new Set(saved.seenBuiltIns ?? (saved.enabled ? ["KRV", "RNKSV", "KJV", "WEB", "BSB", "ASV", "YLT"] : []));
		for (const tr of BUILT_IN_TRANSLATIONS) {
			if (!seen.has(tr.id) && tr.defaultOn && !this.settings.enabled.includes(tr.id)) this.settings.enabled.push(tr.id);
		}
		this.settings.seenBuiltIns = BUILT_IN_TRANSLATIONS.map((tr) => tr.id);
		if (!saved.order) this.settings.order = [...this.settings.enabled, ...this.settings.custom.map((c) => c.id)];
		for (const id of [...this.settings.enabled, ...this.settings.custom.map((c) => c.id)]) {
			if (!this.settings.order.includes(id)) this.settings.order.push(id);
		}
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
