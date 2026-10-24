import {
	App,
	Menu,
	Modal,
	Notice,
	PluginSettingTab,
	Setting,
	SettingDefinition,
	SettingDefinitionItem,
	SettingDefinitionPage,
	SettingPage,
} from "obsidian";
import type VersedropPlugin from "./main";
import { accordanceAvailable } from "./accordance";
import { knownCitation } from "./citations";
import { HelpTopic, t } from "./i18n";
import { hotkeysFor, openHotkeySettings } from "./hotkeys";
import { parseReference } from "./reference";
import { DEFAULT_SETTINGS, Preset, sortByOrder, VersedropSettings } from "./settings";
import { BUILT_IN_TRANSLATIONS, Lang, LANGS, Translation } from "./sources";

const SUPPORT_URL = "https://buymeacoffee.com/4h9fg59wsgd";

/** Settings tab built on Obsidian's declarative settings API (1.13+), so every option is searchable. */
export class VersedropSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: VersedropPlugin) {
		super(app, plugin);
	}

	// ── storage for `control` definitions ──────────────────────────
	getControlValue(key: string): unknown {
		return (this.plugin.settings as unknown as Record<string, unknown>)[key];
	}

	async setControlValue(key: string, value: unknown): Promise<void> {
		const s = this.plugin.settings as unknown as Record<string, unknown>;
		if (key === "calloutType") value = String(value).trim() || "quote";
		if (key === "headerTemplate") value = String(value) || DEFAULT_SETTINGS.headerTemplate;
		if (key === "logosVersion" || key === "accordanceModule") value = String(value).trim();
		if (key === "quoteWarn") {
			const n = Number(value);
			value = Number.isFinite(n) && n >= 0 ? Math.floor(n) : DEFAULT_SETTINGS.quoteWarn;
		}
		s[key] = value;
		await this.plugin.saveSettings();
		this.refreshDomState();
	}

	/** Saves and rebuilds the definitions (for added, removed or reordered items). */
	private async saveAndRebuild(): Promise<void> {
		await this.plugin.saveSettings();
		this.update();
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		const s = this.plugin.settings;
		const list = this.orderedTranslations();
		const linkShown = (kind: "logos" | "accordance") => s.appLinks === kind || s.appLinks === "both";

		return [
			// ── My translations ──────────────────────────────────────
			{
				type: "list",
				heading: t.sMyTranslations,
				emptyState: t.sNoTranslations,
				items: list.map((tr) => this.translationItem(tr)),
				onReorder: (from, to) => void this.reorder(list, from, to),
				onDelete: (index) => void this.removeTranslation(list[index]),
				addItem: { name: t.sAddTranslation, action: (el) => this.openAddMenu(el) },
			},
			// ── ESV key (only when ESV is in the list) ───────────────
			{
				type: "group",
				heading: "ESV",
				visible: () => this.plugin.settings.enabled.includes("ESV"),
				items: [
					{
						name: t.sEsvKey,
						desc: t.sEsvKeyDesc,
						aliases: ["api key", "crossway"],
						render: (setting) => {
							setting.addText((x) => {
								x.inputEl.type = "password";
								x.setPlaceholder("API key")
									.setValue(s.esvApiKey)
									.onChange((v) => {
										s.esvApiKey = v.trim();
										this.plugin.source.clearCache();
										void this.plugin.saveSettings();
									});
							});
							setting.addExtraButton((b) =>
								b
									.setIcon("external-link")
									.setTooltip("api.esv.org")
									.onClick(() => window.open("https://api.esv.org/account/create-application/")),
							);
						},
					},
				],
			},
			// ── Hotkeys ──────────────────────────────────────────────
			{
				type: "group",
				heading: t.sHotkeys,
				items: [
					this.hotkeyItem("insert-passage", t.cmdInsert, t.sCmdInsertDesc),
					this.hotkeyItem("insert-direct", t.cmdDirect, t.sCmdDirectDesc),
				],
			},
			// ── Presets ──────────────────────────────────────────────
			{
				type: "list",
				heading: t.sPresets,
				emptyState: t.sPresetAddDesc,
				items: s.presets.map((p) => this.presetItem(p)),
				onReorder: (from, to) => {
					const [moved] = s.presets.splice(from, 1);
					s.presets.splice(to, 0, moved);
					void this.saveAndRebuild();
				},
				onDelete: (index) => {
					const [removed] = s.presets.splice(index, 1);
					if (removed) this.plugin.unregisterPreset(removed);
					void this.saveAndRebuild();
				},
				addItem: {
					name: t.sPresetAdd,
					action: () => {
						const p: Preset = { id: Date.now().toString(36), name: "", translations: [...s.picked] };
						s.presets.push(p);
						this.plugin.registerPreset(p);
						void this.saveAndRebuild();
						new PresetModal(this.app, this.plugin, p, () => this.update()).open();
					},
				},
			},
			// ── Logos / Accordance links ─────────────────────────────
			{
				type: "group",
				heading: t.sLinks,
				items: [
					{
						name: t.sAppLinks,
						desc: t.sLinksDesc,
						aliases: ["logos", "accordance", "ref.ly"],
						control: {
							type: "dropdown",
							key: "appLinks",
							options: { none: t.sLinksNone, logos: t.sLinksLogos, accordance: t.sLinksAccordance, both: t.sLinksBoth },
						},
					},
					{
						name: t.sLogosVersion,
						desc: t.sLogosVersionDesc,
						visible: () => linkShown("logos"),
						control: { type: "text", key: "logosVersion", placeholder: "ESV" },
					},
					{
						name: t.sAccModule,
						desc: t.sAccModuleDesc,
						visible: () => linkShown("accordance"),
						control: { type: "text", key: "accordanceModule", placeholder: "ESVS" },
					},
				],
			},
			// ── Output ───────────────────────────────────────────────
			{
				type: "group",
				heading: t.sOutput,
				items: [
					{
						name: t.sCitations,
						desc: t.sCitationsDesc,
						aliases: ["copyright", "저작권"],
						control: {
							type: "dropdown",
							key: "citations",
							options: { copyrighted: t.sCitCopyrighted, all: t.sCitAll, off: t.sCitOff },
						},
					},
					{ name: t.sQuoteWarn, desc: t.sQuoteWarnDesc, control: { type: "number", key: "quoteWarn", min: 0, step: 1 } },
					{
						name: t.sStyle,
						control: {
							type: "dropdown",
							key: "style",
							options: { callout: t.sStyleCallout, quote: t.sStyleQuote, plain: t.sStylePlain },
						},
					},
					{
						name: t.sCalloutType,
						desc: t.sCalloutTypeDesc,
						visible: () => this.plugin.settings.style === "callout",
						control: { type: "text", key: "calloutType", placeholder: "quote" },
					},
					{ name: t.sGroup, desc: t.sGroupDesc, control: { type: "toggle", key: "group" } },
					{ name: t.sHeader, desc: t.sHeaderDesc, control: { type: "text", key: "headerTemplate", placeholder: DEFAULT_SETTINGS.headerTemplate } },
					{
						name: t.sBookName,
						control: { type: "dropdown", key: "bookName", options: { full: t.sBookFull, short: t.sBookShort } },
					},
					{
						name: t.sVerseNum,
						control: {
							type: "dropdown",
							key: "verseNumbers",
							options: { none: t.sVerseNumNone, plain: t.sVerseNumPlain, sup: t.sVerseNumSup },
						},
					},
					{ name: t.sPerLine, control: { type: "toggle", key: "versePerLine" } },
					{
						name: t.sClearCache,
						desc: t.sClearCacheDesc,
						action: () => {
							this.plugin.source.clearCache();
							new Notice(t.sCleared);
						},
					},
				],
			},
			// ── Support & help ───────────────────────────────────────
			{
				type: "group",
				heading: t.sHelp,
				items: [
					...t.help.map(
						(topic): SettingDefinitionPage => ({
							type: "page",
							name: topic.title,
							page: () => new HelpPage(topic),
						}),
					),
					{
						name: `☕ ${t.sSupport}`,
						desc: t.sSupportDesc,
						aliases: ["buy me a coffee", "donate", "후원"],
						action: () => window.open(SUPPORT_URL),
					},
				],
			},
		];
	}

	// ── My translations ────────────────────────────────────────────
	private orderedTranslations(): Translation[] {
		const s = this.plugin.settings;
		const enabled = new Set(s.enabled);
		return sortByOrder([...BUILT_IN_TRANSLATIONS.filter((tr) => enabled.has(tr.id)), ...s.custom], s.order);
	}

	private translationItem(tr: Translation): SettingDefinition {
		const s = this.plugin.settings;
		const lang = t.langName[tr.lang];
		const custom = !tr.builtIn;
		const kind = tr.source === "bolls" ? `bolls.life ${tr.code ?? ""}` : tr.source === "file" ? `JSON ${tr.path ?? ""}` : `Accordance ${tr.module ?? ""}`;
		const name = custom ? tr.name || t.sUnnamed : `${tr.name}${tr.abbr !== tr.name ? ` (${tr.abbr})` : ""}`;
		const desc = custom ? `${lang} · ${kind.trim()}` : `${lang} · ${tr.note ?? ""}`;

		return {
			name,
			desc,
			aliases: [tr.abbr, tr.code ?? "", tr.module ?? ""].filter(Boolean),
			render: (setting) => {
				const on = s.picked.includes(tr.id);
				setting.addExtraButton((x) =>
					x
						.setIcon(on ? "check-square" : "square")
						.setTooltip(t.sDefaultPick)
						.onClick(() => {
							s.picked = on ? s.picked.filter((p) => p !== tr.id) : [...s.picked, tr.id];
							void this.saveAndRebuild();
						}),
				);
				if (custom) {
					setting.addExtraButton((x) =>
						x
							.setIcon("pencil")
							.setTooltip(t.sEdit)
							.onClick(() => new TranslationModal(this.app, this.plugin, tr, () => this.update()).open()),
					);
				}
			},
		};
	}

	private async reorder(list: Translation[], from: number, to: number): Promise<void> {
		const ids = list.map((tr) => tr.id);
		const [moved] = ids.splice(from, 1);
		ids.splice(to, 0, moved);
		this.plugin.settings.order = ids;
		await this.saveAndRebuild();
	}

	private async removeTranslation(tr: Translation | undefined): Promise<void> {
		if (!tr) return;
		const s = this.plugin.settings;
		if (tr.builtIn) s.enabled = s.enabled.filter((id) => id !== tr.id);
		else s.custom = s.custom.filter((c) => c.id !== tr.id);
		s.picked = s.picked.filter((id) => id !== tr.id);
		s.order = s.order.filter((id) => id !== tr.id);
		await this.saveAndRebuild();
	}

	/** Menu of built-in translations not yet added, grouped by language, then ways to add your own. */
	private openAddMenu(el: HTMLElement): void {
		const s = this.plugin.settings;
		const enabled = new Set(s.enabled);
		const menu = new Menu();
		for (const lang of LANGS) {
			const avail = BUILT_IN_TRANSLATIONS.filter((tr) => tr.lang === lang && !enabled.has(tr.id));
			if (!avail.length) continue;
			menu.addItem((i) => i.setTitle(t.langName[lang]).setIsLabel(true));
			for (const tr of avail) {
				menu.addItem((i) =>
					i.setTitle(tr.abbr !== tr.name ? `${tr.abbr} — ${tr.name}` : tr.name).onClick(() => {
						s.enabled = [...new Set([...s.enabled, tr.id])];
						s.order = [...s.order.filter((x) => x !== tr.id), tr.id];
						void this.saveAndRebuild();
					}),
				);
			}
			menu.addSeparator();
		}
		menu.addItem((i) => i.setTitle(t.sOwnGroup).setIsLabel(true));
		menu.addItem((i) => {
			i.setTitle(t.sAddAccordance)
				.setIcon("book-open")
				.onClick(() => this.addCustom("accordance"));
			if (!accordanceAvailable()) i.setDisabled(true);
		});
		menu.addItem((i) => i.setTitle(t.sAddBolls).setIcon("globe").onClick(() => this.addCustom("bolls")));
		menu.addItem((i) => i.setTitle(t.sAddFile).setIcon("file-json").onClick(() => this.addCustom("file")));
		const r = el.getBoundingClientRect();
		menu.showAtPosition({ x: r.left, y: r.bottom });
	}

	private addCustom(source: Translation["source"]): void {
		const s = this.plugin.settings;
		const tr: Translation = { id: `custom-${Date.now().toString(36)}`, name: "", abbr: "", lang: "ko", source };
		s.custom.push(tr);
		s.order.push(tr.id);
		void this.saveAndRebuild();
		new TranslationModal(this.app, this.plugin, tr, () => this.update()).open();
	}

	// ── Hotkeys & presets ──────────────────────────────────────────
	private hotkeyItem(commandId: string, name: string, desc: string): SettingDefinition {
		return {
			name,
			desc,
			aliases: ["hotkey", "shortcut", "단축키"],
			render: (setting) => renderHotkeyControl(this.plugin, setting, commandId),
		};
	}

	private presetItem(p: Preset): SettingDefinition {
		const names = this.plugin
			.allTranslations()
			.filter((tr) => p.translations.includes(tr.id))
			.map((tr) => tr.abbr || tr.name);
		return {
			name: `${t.cmdPreset(p.name || t.sUnnamed)}`,
			desc: names.join(" · ") || t.sPresetDesc,
			aliases: ["preset", "프리셋"],
			render: (setting) => {
				renderHotkeyControl(this.plugin, setting, this.plugin.presetCommandId(p));
				setting.addExtraButton((x) =>
					x
						.setIcon("pencil")
						.setTooltip(t.sEdit)
						.onClick(() => new PresetModal(this.app, this.plugin, p, () => this.update()).open()),
				);
			},
		};
	}
}

/** Shows the command's current hotkey and a button that opens Obsidian's Hotkeys screen. */
function renderHotkeyControl(plugin: VersedropPlugin, setting: Setting, commandId: string): void {
	const keys = hotkeysFor(plugin.app, `${plugin.manifest.id}:${commandId}`);
	setting.controlEl.createSpan({ cls: `versedrop-hotkey${keys ? "" : " is-empty"}`, text: keys || t.sNoHotkey });
	setting.addButton((b) =>
		b.setButtonText(keys ? t.sChangeHotkey : t.sSetHotkey).onClick(() => openHotkeySettings(plugin.app, "Versedrop")),
	);
}

/** A help topic shown as its own settings page. */
class HelpPage extends SettingPage {
	constructor(private topic: HelpTopic) {
		super();
		this.title = topic.title;
	}

	display(): void {
		this.containerEl.empty();
		const box = this.containerEl.createDiv({ cls: "versedrop-help" });
		for (const p of this.topic.paras) box.createEl("p", { text: p });
	}
}

/** Edits a translation the user added (Accordance module, bolls.life code or JSON file). */
class TranslationModal extends Modal {
	constructor(
		app: App,
		private plugin: VersedropPlugin,
		private tr: Translation,
		private onDone: () => void,
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		const tr = this.tr;
		const save = () => void this.plugin.saveSettings();
		const kind = tr.source === "bolls" ? t.sKindBolls : tr.source === "file" ? t.sKindFile : t.sKindAccordance;
		this.titleEl.setText(`${t.sEdit} · ${kind}`);

		new Setting(contentEl).setName(t.sName).addText((x) =>
			x
				.setPlaceholder(t.sNamePlaceholder)
				.setValue(tr.name)
				.onChange((v) => {
					tr.name = v.trim();
					tr.abbr = v.trim();
					save();
				}),
		);

		const label = tr.source === "bolls" ? t.sCode : tr.source === "file" ? t.sPath : t.sModule;
		const current = (tr.source === "bolls" ? tr.code : tr.source === "file" ? tr.path : tr.module) ?? "";
		const src = new Setting(contentEl).setName(label).addText((x) =>
			x.setValue(current).onChange((v) => {
				const val = v.trim();
				if (tr.source === "bolls") tr.code = val;
				else if (tr.source === "file") tr.path = val;
				else tr.module = val;
				this.plugin.source.clearCache();
				save();
			}),
		);
		if (tr.source === "accordance") {
			src.addButton((b) =>
				b.setButtonText(t.sTest).onClick(() => {
					b.setDisabled(true);
					const waiting = new Notice(t.accRunning, 0);
					this.plugin.source.clearCache();
					this.plugin.source
						.getPassage({ ...tr, id: `${tr.id}-test` }, parseReference("John 3:16"))
						.then((verses) => {
							const text = verses[0]?.text ?? "";
							new Notice(t.accTestOk(tr.module ?? "", text.length > 80 ? `${text.slice(0, 80)}…` : text), 8000);
						})
						.catch((e: Error) => new Notice(e.message, 15000))
						.finally(() => {
							waiting.hide();
							b.setDisabled(false);
						});
				}),
			);
		}

		new Setting(contentEl).setName(t.sLang).addDropdown((d) =>
			d
				.addOptions(Object.fromEntries(LANGS.map((l) => [l, t.langName[l]])))
				.setValue(tr.lang)
				.onChange((v) => {
					tr.lang = v as Lang;
					save();
				}),
		);

		const known = knownCitation(tr.name, tr.module, tr.code);
		new Setting(contentEl)
			.setName(t.sCitation)
			.setDesc(known && !tr.citation ? t.sCitationKnown : t.sCitationDesc)
			.addText((x) => {
				x.inputEl.addClass("versedrop-citation-input");
				x.setPlaceholder(known?.text ?? t.sCitationPlaceholder)
					.setValue(tr.citation ?? "")
					.onChange((v) => {
						tr.citation = v.trim();
						save();
					});
			});

		new Setting(contentEl).addButton((b) => b.setButtonText(t.sDone).setCta().onClick(() => this.close()));
	}

	onClose(): void {
		this.contentEl.empty();
		void this.plugin.saveSettings().then(() => this.onDone());
	}
}

/** Edits a preset: its name and which translations it inserts. */
class PresetModal extends Modal {
	constructor(
		app: App,
		private plugin: VersedropPlugin,
		private preset: Preset,
		private onDone: () => void,
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		const p = this.preset;
		this.titleEl.setText(t.sPresets);

		new Setting(contentEl).setName(t.sName).addText((x) =>
			x
				.setPlaceholder(t.sPresetNamePlaceholder)
				.setValue(p.name)
				.onChange((v) => {
					p.name = v.trim();
				}),
		);

		new Setting(contentEl).setName(t.sPresetTranslations).setDesc(t.sPresetDesc);
		const chips = contentEl.createDiv({ cls: "versedrop-chips" });
		const chosen = new Set(p.translations);
		for (const tr of this.plugin.allTranslations()) {
			const chip = chips.createEl("button", { text: tr.abbr || tr.name, cls: "versedrop-chip" });
			chip.setAttr("title", tr.name);
			const paint = () => {
				chip.toggleClass("is-active", chosen.has(tr.id));
				chip.setAttr("aria-pressed", String(chosen.has(tr.id)));
			};
			paint();
			chip.addEventListener("click", () => {
				if (chosen.has(tr.id)) chosen.delete(tr.id);
				else chosen.add(tr.id);
				paint();
				p.translations = this.plugin
					.allTranslations()
					.map((x) => x.id)
					.filter((id) => chosen.has(id));
			});
		}

		new Setting(contentEl).addButton((b) => b.setButtonText(t.sDone).setCta().onClick(() => this.close()));
	}

	onClose(): void {
		this.contentEl.empty();
		this.plugin.unregisterPreset(this.preset);
		this.plugin.registerPreset(this.preset);
		void this.plugin.saveSettings().then(() => this.onDone());
	}
}
