import { FormatOptions } from "./format";
import { BUILT_IN_TRANSLATIONS, Lang, Translation } from "./sources";

/** A named set of translations with its own command (and hotkey). */
export interface Preset {
	id: string;
	name: string;
	translations: string[];
}

export interface VersedropSettings extends FormatOptions {
	/** Languages selected in the search window (remembered) */
	languages: Lang[];
	/** Built-in translation ids shown in the search window */
	enabled: string[];
	/** Translation ids checked for insertion by default */
	picked: string[];
	custom: Translation[];
	/** Translation sets that get their own command */
	presets: Preset[];
	/** Display order of translation ids (built-in and custom) */
	order: string[];
	/** Personal ESV API key (api.esv.org) */
	esvApiKey: string;
	/** Warn when a copyrighted translation is quoted beyond this many verses at once (0 = never) */
	quoteWarn: number;
	/** Built-in ids known when settings were last saved (to switch on new defaults after updates) */
	seenBuiltIns?: string[];
}

export const DEFAULT_SETTINGS: VersedropSettings = {
	languages: ["ko", "en"],
	enabled: BUILT_IN_TRANSLATIONS.filter((tr) => tr.defaultOn).map((tr) => tr.id),
	picked: ["KRV", "KJV"],
	custom: [],
	presets: [],
	order: BUILT_IN_TRANSLATIONS.filter((tr) => tr.defaultOn).map((tr) => tr.id),
	style: "callout",
	calloutType: "quote",
	group: false,
	bookName: "full",
	verseNumbers: "sup",
	versePerLine: false,
	headerTemplate: "{ref} ({abbr})",
	appLinks: "none",
	logosVersion: "",
	accordanceModule: "",
	citations: "copyrighted",
	esvApiKey: "",
	quoteWarn: 50,
};


/** Sorts translations by their position in `order`; unknown ids keep their relative order at the end. */
export function sortByOrder(list: Translation[], order: string[]): Translation[] {
	const pos = new Map(order.map((id, i) => [id, i]));
	return list
		.map((tr, i) => ({ tr, i }))
		.sort((a, b) => (pos.get(a.tr.id) ?? 1e6 + a.i) - (pos.get(b.tr.id) ?? 1e6 + b.i))
		.map((x) => x.tr);
}
