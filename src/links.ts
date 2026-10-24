import { BibleReference } from "./reference";

/** Overall span of the reference, e.g. "3:16-19" for 3:16-17, 19 (app links take a single range). */
function span(ref: BibleReference): { first?: number; last?: number } {
	if (!ref.ranges.length) return {};
	return { first: ref.ranges[0].start, last: ref.ranges[ref.ranges.length - 1].end };
}

/**
 * Logos — ref.ly links open in Logos desktop, mobile or web.
 *   https://ref.ly/1Cor13.4-7          (user's preferred Bible)
 *   https://ref.ly/1Cor13.4-7;ESV      (specific version)
 */
export function logosUrl(ref: BibleReference, version: string): string {
	const book = ref.book.enShort.replace(/\s/g, "");
	const { first, last } = span(ref);
	let r = `${book}${ref.chapter}`;
	if (first) r += `.${first}${last && last !== first ? `-${last}` : ""}`;
	const v = version.trim();
	return `https://ref.ly/${r}${v ? `;${encodeURIComponent(v)}` : ""}`;
}

/**
 * Accordance — accord:// links open the passage in the Accordance app.
 *   accord://read/John_3:16           (default text)
 *   accord://read/ESVS?John_3:16      (specific module)
 */
export function accordanceUrl(ref: BibleReference, module: string): string {
	const name = (ref.book.num === 22 ? "Song" : ref.book.en).replace(/\s/g, "_");
	const { first, last } = span(ref);
	let r = `${name}_${ref.chapter}`;
	if (first) r += `:${first}${last && last !== first ? `-${last}` : ""}`;
	const m = module.trim().replace(/\s/g, "_");
	return m ? `accord://read/${encodeURIComponent(m)}?${r}` : `accord://read/${r}`;
}
