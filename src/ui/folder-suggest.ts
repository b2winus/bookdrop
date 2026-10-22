import { AbstractInputSuggest, App, FuzzySuggestModal, TFolder } from "obsidian";
import { t } from "../i18n";

/** 보관소의 모든 폴더 (루트 포함), 경로순 정렬 */
export function listFolders(app: App): TFolder[] {
	return app.vault
		.getAllLoadedFiles()
		.filter((f): f is TFolder => f instanceof TFolder)
		.sort((a, b) => a.path.localeCompare(b.path));
}

export function folderLabel(folder: TFolder): string {
	return folder.isRoot() ? t("folder.root") : folder.path;
}

/** 설정의 폴더 입력칸에 붙는 자동완성 목록 */
export class FolderSuggest extends AbstractInputSuggest<TFolder> {
	private inputEl: HTMLInputElement;
	private onPick: (path: string) => void;

	constructor(app: App, inputEl: HTMLInputElement, onPick: (path: string) => void) {
		super(app, inputEl);
		this.inputEl = inputEl;
		this.onPick = onPick;
	}

	getSuggestions(query: string): TFolder[] {
		const q = query.toLowerCase();
		return listFolders(this.app).filter((f) => f.path.toLowerCase().includes(q));
	}

	renderSuggestion(folder: TFolder, el: HTMLElement): void {
		el.setText(folderLabel(folder));
	}

	selectSuggestion(folder: TFolder): void {
		const path = folder.isRoot() ? "" : folder.path;
		this.inputEl.value = path;
		this.inputEl.trigger("input");
		this.onPick(path);
		this.close();
	}
}

/** 노트를 만들 때마다 폴더를 고르는 창. 기본 폴더가 맨 위에 온다. */
export class FolderPickModal extends FuzzySuggestModal<TFolder> {
	private defaultPath: string;
	private onPick: (path: string) => void;

	constructor(app: App, defaultPath: string, onPick: (path: string) => void) {
		super(app);
		this.defaultPath = defaultPath;
		this.onPick = onPick;
		this.setPlaceholder(t("folder.placeholder"));
		this.setInstructions([
			{ command: "↑↓", purpose: t("folder.move") },
			{ command: "↵", purpose: t("folder.choose") },
			{ command: "esc", purpose: t("folder.cancel") },
		]);
	}

	getItems(): TFolder[] {
		const folders = listFolders(this.app);
		const i = folders.findIndex((f) => (f.isRoot() ? "" : f.path) === this.defaultPath);
		if (i > 0) folders.unshift(folders.splice(i, 1)[0]);
		return folders;
	}

	getItemText(folder: TFolder): string {
		const label = folderLabel(folder);
		const path = folder.isRoot() ? "" : folder.path;
		return path === this.defaultPath ? `${label}  ${t("folder.default")}` : label;
	}

	onChooseItem(folder: TFolder): void {
		this.onPick(folder.isRoot() ? "" : folder.path);
	}
}
