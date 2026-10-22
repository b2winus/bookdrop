import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import type BookdropPlugin from "./main";
import { ProviderId } from "./types";
import { PROVIDERS, providerLabel, searchBooks } from "./providers";
import { FolderSuggest } from "./ui/folder-suggest";
import { DEFAULT_FILENAME_TEMPLATE, TEMPLATE_VARIABLES, defaultInsertTemplate, defaultNoteTemplate } from "./template";
import { Key, LangSetting, getLang, t } from "./i18n";

export interface BookdropSettings {
	language: LangSetting;
	defaultProvider: ProviderId;
	fallbackToOther: boolean;
	kakaoApiKey: string;
	googleApiKey: string;
	googleLangRestrict: string;
	maxResults: number;
	folder: string;
	askFolderEachTime: boolean;
	fileNameTemplate: string;
	/** 비어 있으면 현재 언어의 기본 템플릿을 쓴다 */
	noteTemplate: string;
	/** 비어 있으면 현재 언어의 기본 템플릿을 쓴다 */
	insertTemplate: string;
	openAfterCreate: boolean;
	overwriteFrontmatter: boolean;
}

export const DEFAULT_SETTINGS: BookdropSettings = {
	language: "auto",
	defaultProvider: "kakao",
	fallbackToOther: true,
	kakaoApiKey: "",
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
};

export class BookdropSettingTab extends PluginSettingTab {
	plugin: BookdropPlugin;

	constructor(app: App, plugin: BookdropPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		const s = this.plugin.settings;
		const save = () => this.plugin.saveSettings();
		containerEl.empty();

		// ── General ──────────────────────────
		new Setting(containerEl).setName(t("set.general")).setHeading();

		new Setting(containerEl)
			.setName(t("set.language"))
			.setDesc(t("set.languageDesc"))
			.addDropdown((dd) =>
				dd
					.addOption("auto", t("set.languageAuto"))
					.addOption("en", "English")
					.addOption("ko", "한국어")
					.setValue(s.language)
					.onChange(async (v) => {
						s.language = v as LangSetting;
						await save(); // applies the language
						this.display(); // redraw in the new language
					}),
			);

		// ── Search ───────────────────────────
		new Setting(containerEl).setName(t("set.search")).setHeading();

		new Setting(containerEl)
			.setName(t("set.provider"))
			.setDesc(t("set.providerDesc"))
			.addDropdown((dd) => {
				PROVIDERS.forEach((p) => dd.addOption(p, providerLabel(p)));
				dd.setValue(s.defaultProvider).onChange(async (v) => {
					s.defaultProvider = v as ProviderId;
					await save();
				});
			});

		new Setting(containerEl)
			.setName(t("set.fallback"))
			.setDesc(t("set.fallbackDesc"))
			.addToggle((tg) =>
				tg.setValue(s.fallbackToOther).onChange(async (v) => {
					s.fallbackToOther = v;
					await save();
				}),
			);

		new Setting(containerEl)
			.setName(t("set.maxResults"))
			.setDesc(t("set.maxResultsDesc"))
			.addSlider((sl) =>
				sl
					.setLimits(5, 40, 5)
					.setValue(s.maxResults)
					.setDynamicTooltip()
					.onChange(async (v) => {
						s.maxResults = v;
						await save();
					}),
			);

		// ── API keys ─────────────────────────
		new Setting(containerEl).setName(t("set.keys")).setHeading();

		new Setting(containerEl)
			.setName(t("set.kakaoKey"))
			.setDesc(
				createFragment((f) => {
					f.appendText(t("set.kakaoKeyDesc"));
					f.createEl("a", { text: t("set.kakaoKeyLink"), href: "https://developers.kakao.com/console/app" });
				}),
			)
			.addText((tx) => {
				tx.inputEl.type = "password";
				tx.setPlaceholder(t("set.kakaoKeyPlaceholder"))
					.setValue(s.kakaoApiKey)
					.onChange(async (v) => {
						s.kakaoApiKey = v.trim();
						await save();
					});
			})
			.addButton((b) =>
				b.setButtonText(t("set.testConnection")).onClick(async () => {
					try {
						const r = await searchBooks("kakao", "어린 왕자", this.plugin.searchOptions());
						new Notice(t("notice.kakaoOk", { count: r.length }));
					} catch (e) {
						new Notice(e instanceof Error ? e.message : String(e));
					}
				}),
			);

		new Setting(containerEl)
			.setName(t("set.googleKey"))
			.setDesc(t("set.googleKeyDesc"))
			.addText((tx) => {
				tx.inputEl.type = "password";
				tx.setPlaceholder(t("set.optional"))
					.setValue(s.googleApiKey)
					.onChange(async (v) => {
						s.googleApiKey = v.trim();
						await save();
					});
			});

		new Setting(containerEl)
			.setName(t("set.googleLang"))
			.setDesc(t("set.googleLangDesc"))
			.addText((tx) =>
				tx
					.setPlaceholder(t("set.googleLangPlaceholder"))
					.setValue(s.googleLangRestrict)
					.onChange(async (v) => {
						s.googleLangRestrict = v.trim();
						await save();
					}),
			);

		// ── New notes ────────────────────────
		new Setting(containerEl).setName(t("set.newNote")).setHeading();

		new Setting(containerEl)
			.setName(t("set.folder"))
			.setDesc(t("set.folderDesc"))
			.addSearch((sr) => {
				const setFolder = async (v: string) => {
					s.folder = v.trim().replace(/^\/+|\/+$/g, "");
					await save();
				};
				sr.setPlaceholder("Books").setValue(s.folder).onChange(setFolder);
				new FolderSuggest(this.app, sr.inputEl, (path) => void setFolder(path));
			});

		new Setting(containerEl)
			.setName(t("set.askFolder"))
			.setDesc(t("set.askFolderDesc"))
			.addToggle((tg) =>
				tg.setValue(s.askFolderEachTime).onChange(async (v) => {
					s.askFolderEachTime = v;
					await save();
				}),
			);

		new Setting(containerEl)
			.setName(t("set.fileName"))
			.setDesc(t("set.fileNameDesc"))
			.addText((tx) =>
				tx
					.setPlaceholder(DEFAULT_FILENAME_TEMPLATE)
					.setValue(s.fileNameTemplate)
					.onChange(async (v) => {
						s.fileNameTemplate = v || DEFAULT_FILENAME_TEMPLATE;
						await save();
					}),
			);

		new Setting(containerEl).setName(t("set.openAfter")).addToggle((tg) =>
			tg.setValue(s.openAfterCreate).onChange(async (v) => {
				s.openAfterCreate = v;
				await save();
			}),
		);

		this.templateArea(containerEl, "set.noteTemplate", "set.noteTemplateDesc", "noteTemplate", defaultNoteTemplate, 16);

		// ── Current note ─────────────────────
		new Setting(containerEl).setName(t("set.currentNote")).setHeading();

		this.templateArea(containerEl, "set.insertTemplate", "set.insertTemplateDesc", "insertTemplate", defaultInsertTemplate, 7);

		new Setting(containerEl)
			.setName(t("set.overwrite"))
			.setDesc(t("set.overwriteDesc"))
			.addToggle((tg) =>
				tg.setValue(s.overwriteFrontmatter).onChange(async (v) => {
					s.overwriteFrontmatter = v;
					await save();
				}),
			);

		// ── Variables ────────────────────────
		new Setting(containerEl).setName(t("set.variables")).setHeading();
		const help = containerEl.createDiv({ cls: "bookdrop-var-help" });
		help.createEl("p", { text: t("set.variablesHelp") });
		const table = help.createEl("table");
		for (const name of TEMPLATE_VARIABLES) {
			const tr = table.createEl("tr");
			tr.createEl("td").createEl("code", { text: `{{${name}}}` });
			tr.createEl("td", { text: t(`var.${name}` as Key) });
		}
	}

	/**
	 * 템플릿 입력칸. 비어 있거나 기본값과 같으면 ""로 저장해서
	 * 언어를 바꿀 때 기본 템플릿도 함께 바뀌게 한다.
	 */
	private templateArea(
		el: HTMLElement,
		nameKey: Key,
		descKey: Key,
		field: "noteTemplate" | "insertTemplate",
		getDefault: typeof defaultNoteTemplate,
		rows: number,
	): void {
		const s = this.plugin.settings;
		let areaEl: HTMLTextAreaElement | null = null;
		const setting = new Setting(el)
			.setName(t(nameKey))
			.setDesc(t(descKey))
			.addExtraButton((b) =>
				b
					.setIcon("rotate-ccw")
					.setTooltip(t("set.reset"))
					.onClick(async () => {
						s[field] = "";
						await this.plugin.saveSettings();
						if (areaEl) areaEl.value = getDefault(getLang());
					}),
			)
			.addTextArea((ta) => {
				areaEl = ta.inputEl;
				ta.inputEl.rows = rows;
				ta.inputEl.addClass("bookdrop-template-area");
				ta.setValue(s[field] || getDefault(getLang())).onChange(async (v) => {
					s[field] = !v.trim() || v === getDefault(getLang()) ? "" : v;
					await this.plugin.saveSettings();
				});
			});
		setting.settingEl.addClass("bookdrop-template-setting");
	}
}
