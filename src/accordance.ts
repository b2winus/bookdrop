import { Platform } from "obsidian";
import { t } from "./i18n";

/**
 * Bridge to the Accordance Bible app on macOS.
 *
 * Accordance answers the Apple event «event AccdTxRf» {module, reference, citation} with the
 * text of the reference in the given module (or a string starting with "Err" on failure).
 * We ask verse by verse so every verse keeps its number, and run everything in one
 * `osascript` call. The script is a fixed constant; the module, reference and verse list are
 * passed as argv arguments and are never interpolated into it. No shell is involved (execFile).
 */

const SEP = "\u001e"; // record separator between verses

const SCRIPT = `
on run argv
	set moduleName to item 1 of argv
	set chapterRef to item 2 of argv
	set verseList to item 3 of argv
	set rs to character id 30
	set out to ""
	set oldDelims to AppleScript's text item delimiters
	if verseList is "all" then
		set prevText to ""
		repeat with v from 1 to 200
			tell application "Accordance" to set r to «event AccdTxRf» {moduleName, chapterRef & ":" & v, false}
			if r is "" or r starts with "Err" or r is prevText then exit repeat
			set out to out & v & tab & r & rs
			set prevText to r
		end repeat
	else
		set AppleScript's text item delimiters to ","
		set vs to text items of verseList
		set AppleScript's text item delimiters to oldDelims
		repeat with v in vs
			tell application "Accordance" to set r to «event AccdTxRf» {moduleName, chapterRef & ":" & (v as text), false}
			set out to out & (v as text) & tab & r & rs
		end repeat
	end if
	set AppleScript's text item delimiters to oldDelims
	return out
end run
`;

export function accordanceAvailable(): boolean {
	return Platform.isDesktopApp && Platform.isMacOS;
}

export interface RawVerse {
	verse: number;
	text: string;
}

/** Parses the osascript output; drops verses Accordance reported as errors. */
export function parseAccordanceOutput(out: string): { verses: RawVerse[]; errors: number } {
	const verses: RawVerse[] = [];
	let errors = 0;
	for (const rec of out.split(SEP)) {
		const tab = rec.indexOf("\t");
		if (tab < 0) continue;
		const verse = parseInt(rec.slice(0, tab).trim(), 10);
		let text = rec.slice(tab + 1).trim();
		if (!verse) continue;
		if (!text || text.startsWith("Err")) {
			errors++;
			continue;
		}
		// Some modules echo the verse number or reference in front of the text.
		text = text.replace(new RegExp(`^(?:[^\\d\\s]*\\s?\\d+:)?${verse}\\s+`), "");
		verses.push({ verse, text });
	}
	return { verses, errors };
}

type ExecError = Error & { killed?: boolean };

/** Runs osascript with the fixed script; only available in the desktop app. */
async function runOsascript(args: string[]): Promise<string> {
	if (Platform.isDesktop) {
		// child_process exists only in the desktop app, so it is loaded here, on demand.
		const childProcess = await import("child_process");
		return new Promise<string>((resolve, reject) => {
			childProcess.execFile(
				"osascript",
				["-e", SCRIPT, ...args],
				{ timeout: 30000, maxBuffer: 4 * 1024 * 1024 },
				(err: ExecError | null, out: string, stderr: string) => {
					if (err) {
						const msg = `${stderr || ""} ${err.message || ""}`;
						if (/-1743|not authori[sz]ed|허용되지/i.test(msg)) reject(new Error(t.accPermission));
						else if (/-1728|-600|-10814|can.t get application|isn.t running|찾을 수 없/i.test(msg)) reject(new Error(t.accNotFound));
						else if (err.killed) reject(new Error(t.accTimeout));
						else reject(new Error(`${t.accFailed} ${String(stderr || err.message).trim()}`));
						return;
					}
					resolve(out);
				},
			);
		});
	}
	throw new Error(t.accMacOnly);
}

/** Fetches verse text from Accordance, one request at a time. */
export class AccordanceBridge {
	private queue: Promise<unknown> = Promise.resolve();

	/**
	 * @param chapterRef English reference without verse, e.g. "1 Corinthians 13"
	 * @param verses     verse numbers to fetch, or "all" for the whole chapter
	 */
	fetch(module: string, chapterRef: string, verses: number[] | "all"): Promise<RawVerse[]> {
		const run = this.queue.then(() => this.fetchNow(module, chapterRef, verses));
		this.queue = run.catch(() => undefined);
		return run;
	}

	private async fetchNow(module: string, chapterRef: string, verses: number[] | "all"): Promise<RawVerse[]> {
		if (!accordanceAvailable()) throw new Error(t.accMacOnly);
		if (!module.trim()) throw new Error(t.accNoModule);

		const verseArg = verses === "all" ? "all" : verses.join(",");
		const stdout = await runOsascript([module.trim(), chapterRef, verseArg]);

		const { verses: result, errors } = parseAccordanceOutput(stdout);
		if (!result.length && errors) throw new Error(t.accBadModule(module.trim()));
		return result;
	}
}
