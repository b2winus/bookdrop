import {
	App,
	Notice,
	PluginSettingTab,
	Setting,
	SettingDefinition,
	SettingDefinitionGroup,
	SettingDefinitionItem,
	SettingGroup,
	requireApiVersion,
} from "obsidian";
import type BookdropPlugin from "./main";
import { EnricherId, ProviderId } from "./types";
import { ENRICHERS, PROVIDERS, providerLabel, searchBooks } from "./providers";
import { lookupNl } from "./providers/nl";
import { FolderSuggest } from "./ui/folder-suggest";
import { DEFAULT_FILENAME_TEMPLATE, TEMPLATE_VARIABLES, defaultInsertTemplate, defaultNoteTemplate } from "./template";
import { Key, LangSetting, getLang, t } from "./i18n";

export interface BookdropSettings {
	language: LangSetting;
	defaultProvider: ProviderId;
	fallbackToOther: boolean;
	kakaoApiKey: string;
	aladinTtbKey: string;
	nlApiKey: string;
	googleApiKey: string;
	googleLangRestrict: string;
	maxResults: number;
	folder: string;
	askFolderEachTime: boolean;
	fileNameTemplate: string;
	/** Empty means "use the default template for the current language". */
	noteTemplate: string;
	/** Empty means "use the default template for the current language". */
	insertTemplate: string;
	openAfterCreate: boolean;
	overwriteFrontmatter: boolean;
	enrich: boolean;
	enrichAladin: boolean;
	enrichNl: boolean;
	enrichKakao: boolean;
	enrichGoogle: boolean;
	enrichOpenlibrary: boolean;
}

/** Settings key for each enrichment source toggle. */
export const ENRICH_KEYS: Record<EnricherId, keyof BookdropSettings> = {
	aladin: "enrichAladin",
	nl: "enrichNl",
	kakao: "enrichKakao",
	google: "enrichGoogle",
	openlibrary: "enrichOpenlibrary",
};

export const DEFAULT_SETTINGS: BookdropSettings = {
	language: "auto",
	defaultProvider: "kakao",
	fallbackToOther: true,
	kakaoApiKey: "",
	aladinTtbKey: "",
	nlApiKey: "",
	googleApiKey: "",
	googleLangRestrict: "",
	maxResults: 20,
	folder: "Books",
	askFolderEachTime: false,
	fileNameTemplate: DEFAULT_FILENAME_TEMPLATE,
	noteTemplate: "",
	insertTemplate: "",
	openAfterCreate: true,
	overwriteFrontmatter: false,
	enrich: true,
	enrichAladin: true,
	enrichNl: true,
	enrichKakao: true,
	enrichGoogle: true,
	enrichOpenlibrary: true,
};

type SettingsKey = keyof BookdropSettings;
type TemplateField = "noteTemplate" | "insertTemplate";

/**
 * Settings are described once in getSettingDefinitions().
 * Obsidian 1.13+ renders them declaratively (and indexes them for settings search);
 * older versions call display(), which renders the same definitions with the Setting API.
 */
export class BookdropSettingTab extends PluginSettingTab {
	plugin: BookdropPlugin;

	constructor(app: App, plugin: BookdropPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// ── Storage ─────────────────────────────

	getControlValue(key: string): unknown {
		return this.plugin.settings[key as SettingsKey];
	}

	async setControlValue(key: string, value: unknown): Promise<void> {
		const s = this.plugin.settings as unknown as Record<string, unknown>;
		let v = value;
		if (typeof v === "string") {
			if (key === "folder") v = v.trim().replace(/^\/+|\/+$/g, "");
			else if (key === "fileNameTemplate") v = v.trim() ? v : DEFAULT_FILENAME_TEMPLATE;
			else if (key.endsWith("ApiKey") || key.endsWith("TtbKey") || key === "googleLangRestrict") v = v.trim();
		}
		s[key] = v;
		await this.plugin.saveSettings();
		if (key === "language") this.redraw();
	}

	/** Re-render in the newly selected language. */
	private redraw(): void {
		if (requireApiVersion("1.13.0")) this.update();
		else this.renderAll();
	}

	// ── Definitions ─────────────────────────

	getSettingDefinitions(): SettingDefinitionItem[] {
		const providerOptions: Record<string, string> = {};
		for (const p of PROVIDERS) providerOptions[p] = providerLabel(p);

		const general: SettingDefinitionGroup = {
			type: "group",
			heading: t("set.general"),
			items: [
				{
					name: t("set.language"),
					desc: t("set.languageDesc"),
					control: {
						type: "dropdown",
						key: "language",
						options: { auto: t("set.languageAuto"), en: "English", ko: "한국어" },
					},
				},
			],
		};

		const search: SettingDefinitionGroup = {
			type: "group",
			heading: t("set.search"),
			items: [
				{
					name: t("set.provider"),
					desc: t("set.providerDesc"),
					control: { type: "dropdown", key: "defaultProvider", options: providerOptions },
				},
				{
					name: t("set.fallback"),
					desc: t("set.fallbackDesc"),
					control: { type: "toggle", key: "fallbackToOther" },
				},
				{
					name: t("set.maxResults"),
					desc: t("set.maxResultsDesc"),
					control: { type: "slider", key: "maxResults", min: 5, max: 40, step: 5 },
				},
			],
		};

		const keys: SettingDefinitionGroup = {
			type: "group",
			heading: t("set.keys"),
			items: [
				{
					name: t("set.kakaoKey"),
					desc: createFragment((f) => {
						f.appendText(t("set.kakaoKeyDesc"));
						f.createEl("a", { text: t("set.kakaoKeyLink"), href: "https://developers.kakao.com/console/app" });
					}),
					render: (setting: Setting) => this.renderKeyWithTest(setting, "kakaoApiKey", t("set.kakaoKeyPlaceholder"), () => this.testSearch("kakao")),
				},
				{
					name: t("set.aladinKey"),
					desc: createFragment((f) => {
						f.appendText(t("set.aladinKeyDesc"));
						f.createEl("a", { text: t("set.aladinKeyLink"), href: "https://www.aladin.co.kr/ttb/wblog_manage.aspx" });
					}),
					render: (setting: Setting) => this.renderKeyWithTest(setting, "aladinTtbKey", "TTBKey", () => this.testSearch("aladin")),
				},
				{
					name: t("set.nlKey"),
					desc: createFragment((f) => {
						f.appendText(t("set.nlKeyDesc"));
						f.createEl("a", { text: t("set.nlKeyLink"), href: "https://www.nl.go.kr/NL/contents/N31101030500.do" });
					}),
					render: (setting: Setting) => this.renderKeyWithTest(setting, "nlApiKey", "cert_key", () => this.testNl()),
				},
				{
					name: t("set.googleKey"),
					desc: t("set.googleKeyDesc"),
					render: (setting: Setting) => this.renderPassword(setting, "googleApiKey", t("set.optional")),
				},
				{
					name: t("set.googleLang"),
					desc: t("set.googleLangDesc"),
					control: { type: "text", key: "googleLangRestrict", placeholder: t("set.googleLangPlaceholder") },
				},
			],
		};

		const enrich: SettingDefinitionGroup = {
			type: "group",
			heading: t("set.enrichGroup"),
			items: [
				{
					name: t("set.enrich"),
					desc: t("set.enrichDesc"),
					control: { type: "toggle", key: "enrich" },
				},
				...ENRICHERS.map((p) => ({
					name: t("set.enrichFrom", { provider: providerLabel(p) }),
					desc: t("set.enrichFromDesc"),
					control: { type: "toggle" as const, key: ENRICH_KEYS[p] },
				})),
			],
		};

		const newNote: SettingDefinitionGroup = {
			type: "group",
			heading: t("set.newNote"),
			items: [
				{
					name: t("set.folder"),
					desc: t("set.folderDesc"),
					control: { type: "folder", key: "folder", placeholder: "Books", includeRoot: true },
				},
				{
					name: t("set.askFolder"),
					desc: t("set.askFolderDesc"),
					control: { type: "toggle", key: "askFolderEachTime" },
				},
				{
					name: t("set.fileName"),
					desc: t("set.fileNameDesc"),
					control: { type: "text", key: "fileNameTemplate", placeholder: DEFAULT_FILENAME_TEMPLATE },
				},
				{
					name: t("set.openAfter"),
					control: { type: "toggle", key: "openAfterCreate" },
				},
				{
					name: t("set.noteTemplate"),
					desc: t("set.noteTemplateDesc"),
					render: (setting: Setting) => this.renderTemplate(setting, "noteTemplate", defaultNoteTemplate, 16),
				},
			],
		};

		const currentNote: SettingDefinitionGroup = {
			type: "group",
			heading: t("set.currentNote"),
			items: [
				{
					name: t("set.insertTemplate"),
					desc: t("set.insertTemplateDesc"),
					render: (setting: Setting) => this.renderTemplate(setting, "insertTemplate", defaultInsertTemplate, 7),
				},
				{
					name: t("set.overwrite"),
					desc: t("set.overwriteDesc"),
					control: { type: "toggle", key: "overwriteFrontmatter" },
				},
			],
		};

		const variables: SettingDefinitionGroup = {
			type: "group",
			heading: t("set.variables"),
			items: [
				{
					name: t("set.variables"),
					desc: createFragment((f) => {
						const help = f.createDiv({ cls: "bookdrop-var-help" });
						help.createEl("p", { text: t("set.variablesHelp") });
						const table = help.createEl("table");
						for (const name of TEMPLATE_VARIABLES) {
							const tr = table.createEl("tr");
							tr.createEl("td").createEl("code", { text: `{{${name}}}` });
							tr.createEl("td", { text: t(`var.${name}` as Key) });
						}
					}),
				},
			],
		};

		return [general, search, keys, enrich, newNote, currentNote, variables];
	}

	// ── Custom rows ─────────────────────────

	private renderPassword(setting: Setting, key: "kakaoApiKey" | "aladinTtbKey" | "nlApiKey" | "googleApiKey", placeholder: string): void {
		setting.addText((tx) => {
			tx.inputEl.type = "password";
			tx.setPlaceholder(placeholder)
				.setValue(this.plugin.settings[key])
				.onChange((v) => {
					void this.setControlValue(key, v);
				});
		});
	}

	private renderKeyWithTest(
		setting: Setting,
		key: "kakaoApiKey" | "aladinTtbKey" | "nlApiKey",
		placeholder: string,
		test: () => Promise<void>,
	): void {
		this.renderPassword(setting, key, placeholder);
		setting.addButton((b) =>
			b.setButtonText(t("set.testConnection")).onClick(() => {
				void test().catch((e: unknown) => new Notice(e instanceof Error ? e.message : String(e)));
			}),
		);
	}

	private async testSearch(provider: ProviderId): Promise<void> {
		const r = await searchBooks(provider, "어린 왕자", this.plugin.searchOptions());
		new Notice(t("notice.testOk", { provider: providerLabel(provider), count: r.length }));
	}

	private async testNl(): Promise<void> {
		// A well-known ISBN ("미움받을 용기"); success means the key was accepted.
		await lookupNl("9788996991342", this.plugin.searchOptions());
		new Notice(t("notice.testOkNl"));
	}

	/**
	 * Template textarea with a reset button. Empty or default text is stored as ""
	 * so the default follows the interface language.
	 */
	private renderTemplate(setting: Setting, field: TemplateField, getDefault: typeof defaultNoteTemplate, rows: number): void {
		let areaEl: HTMLTextAreaElement | null = null;
		setting.settingEl.addClass("bookdrop-template-setting");
		setting.addExtraButton((b) =>
			b
				.setIcon("rotate-ccw")
				.setTooltip(t("set.reset"))
				.onClick(() => {
					if (areaEl) areaEl.value = getDefault(getLang());
					void this.setControlValue(field, "");
				}),
		);
		setting.addTextArea((ta) => {
			areaEl = ta.inputEl;
			ta.inputEl.rows = rows;
			ta.inputEl.addClass("bookdrop-template-area");
			ta.setValue(this.plugin.settings[field] || getDefault(getLang())).onChange((v) => {
				const stored = !v.trim() || v === getDefault(getLang()) ? "" : v;
				void this.setControlValue(field, stored);
			});
		});
	}

	// ── Fallback for Obsidian < 1.13 ────────

	display(): void {
		this.renderAll();
	}

	private renderAll(): void {
		const el = this.containerEl;
		el.empty();
		for (const item of this.getSettingDefinitions()) {
			if (!("type" in item) || item.type !== "group") continue;
			if (item.heading) new Setting(el).setName(item.heading).setHeading();
			for (const def of item.items ?? []) {
				if (!("type" in def)) this.renderLegacy(el, def);
			}
		}
	}

	private renderLegacy(el: HTMLElement, def: SettingDefinition): void {
		const setting = new Setting(el).setName(def.name);
		if (def.desc) setting.setDesc(def.desc);

		if ("render" in def && def.render) {
			// Our render callbacks only use the Setting.
			def.render(setting, undefined as unknown as SettingGroup);
			return;
		}
		if (!("control" in def) || !def.control) return;

		const c = def.control;
		const raw = this.getControlValue(c.key);
		const value = typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean" ? raw : "";
		const set = (v: unknown) => {
			void this.setControlValue(c.key, v);
		};

		switch (c.type) {
			case "dropdown":
				setting.addDropdown((dd) => {
					for (const [k, label] of Object.entries(c.options)) dd.addOption(k, label);
					dd.setValue(String(value)).onChange(set);
				});
				break;
			case "toggle":
				setting.addToggle((tg) => tg.setValue(Boolean(value)).onChange(set));
				break;
			case "slider":
				setting.addSlider((sl) => sl.setLimits(c.min, c.max, c.step).setValue(Number(value)).onChange(set));
				break;
			case "text":
				setting.addText((tx) =>
					tx
						.setPlaceholder(c.placeholder ?? "")
						.setValue(String(value))
						.onChange(set),
				);
				break;
			case "folder":
				setting.addSearch((sr) => {
					sr.setPlaceholder(c.placeholder ?? "")
						.setValue(String(value))
						.onChange(set);
					new FolderSuggest(this.app, sr.inputEl, set);
				});
				break;
		}
	}
}
