import { App, Notice, Platform } from "obsidian";
import { t } from "./i18n";

/**
 * Small wrappers around Obsidian's hotkey manager and settings window.
 * These are not part of the public API, so every call is guarded and falls back gracefully.
 */

interface Hotkey {
	modifiers: string[];
	key: string;
}

interface HotkeyManager {
	getHotkeys(id: string): Hotkey[] | undefined;
	getDefaultHotkeys(id: string): Hotkey[] | undefined;
}

interface SettingWindow {
	open(): void;
	openTabById(id: string): unknown;
	activeTab?: { searchComponent?: { setValue(v: string): void }; updateHotkeyVisibility?: () => void };
}

const MAC: Record<string, string> = { Mod: "⌘", Ctrl: "⌃", Meta: "⌘", Alt: "⌥", Shift: "⇧" };
const OTHER: Record<string, string> = { Mod: "Ctrl", Ctrl: "Ctrl", Meta: "Win", Alt: "Alt", Shift: "Shift" };

export function formatHotkey(h: Hotkey): string {
	const map = Platform.isMacOS ? MAC : OTHER;
	const mods = h.modifiers.map((m) => map[m] ?? m);
	const key = h.key.length === 1 ? h.key.toUpperCase() : h.key;
	return Platform.isMacOS ? `${mods.join("")}${key}` : [...mods, key].join("+");
}

/** The hotkeys currently assigned to a command, formatted for display ("" when none). */
export function hotkeysFor(app: App, commandId: string): string {
	try {
		const hm = (app as unknown as { hotkeyManager?: HotkeyManager }).hotkeyManager;
		if (!hm) return "";
		const keys = hm.getHotkeys(commandId) ?? hm.getDefaultHotkeys(commandId) ?? [];
		return keys.map(formatHotkey).join(", ");
	} catch {
		return "";
	}
}

/** Opens Settings → Hotkeys filtered to the given text, so the user can set a key right away. */
export function openHotkeySettings(app: App, filter: string): void {
	try {
		const setting = (app as unknown as { setting?: SettingWindow }).setting;
		if (!setting) throw new Error("no settings");
		setting.open();
		setting.openTabById("hotkeys");
		const tab = setting.activeTab;
		if (tab?.searchComponent) {
			tab.searchComponent.setValue(filter);
			tab.updateHotkeyVisibility?.();
		}
	} catch {
		new Notice(t.hotkeyFallback, 8000);
	}
}

/** Removes a command registered earlier (used when a preset is deleted). */
export function removeCommand(app: App, fullId: string): void {
	try {
		(app as unknown as { commands?: { removeCommand(id: string): void } }).commands?.removeCommand(fullId);
	} catch {
		/* ignore — the command disappears on next restart */
	}
}
