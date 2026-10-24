/**
 * Copyright notices for well-known copyrighted translations.
 * Used when a translation (e.g. an Accordance module or JSON file) has no citation of its own:
 * we match its name / abbreviation / module against these patterns.
 */
export interface KnownCitation {
	pattern: RegExp;
	text: string;
	link?: string;
}

export const KNOWN_CITATIONS: KnownCitation[] = [
	// Korean Bible Society
	{ pattern: /개역개정|nkrv|krv-?nk|^gae$/i, text: "성경전서 개역개정판 © 대한성서공회" },
	{ pattern: /새번역|rnksv|^nir$/i, text: "성경전서 새번역 © 대한성서공회" },
	{ pattern: /공동번역|kcb|^kor$/i, text: "공동번역성서 개정판 © 대한성서공회" },
	{ pattern: /새한글|nkt/i, text: "새한글성경 © 대한성서공회" },
	{ pattern: /쉬운성경/i, text: "쉬운성경 © 아가페출판사" },
	{ pattern: /현대인의\s*성경|klb/i, text: "현대인의성경 © 생명의말씀사" },
	// English
	{
		pattern: /^esv/i,
		text: "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.",
		link: "https://www.esv.org",
	},
	{
		pattern: /^niv/i,
		text: "Scripture quotations taken from The Holy Bible, New International Version® NIV®. Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission. All rights reserved worldwide.",
	},
	{
		pattern: /^nasb|^nas20|^nas95/i,
		text: "Scripture quotations taken from the (NASB®) New American Standard Bible®, Copyright © 1960, 1971, 1977, 1995, 2020 by The Lockman Foundation. Used by permission. All rights reserved.",
		link: "https://www.lockman.org",
	},
	{
		pattern: /^nlt/i,
		text: "Scripture quotations are taken from the Holy Bible, New Living Translation, copyright © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers. All rights reserved.",
	},
	{
		pattern: /^csb|^hcsb/i,
		text: "Scripture quotations marked CSB have been taken from the Christian Standard Bible®, Copyright © 2017 by Holman Bible Publishers. Used by permission.",
	},
	{
		pattern: /^nkjv/i,
		text: "Scripture taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All rights reserved.",
	},
	{
		pattern: /^nrsv/i,
		text: "Scripture quotations are from the New Revised Standard Version Bible, copyright © the National Council of the Churches of Christ in the United States of America. Used by permission. All rights reserved.",
	},
	// Chinese
	{ pattern: /新标点|新標點|^cunps?$|^cnvs?$/i, text: "经文引自《新标点和合本》，© 香港圣经公会，蒙允准使用。" },
	{ pattern: /思高|^chisb$/i, text: "思高聖經 © 思高聖經學會" },
	// Japanese
	{ pattern: /新共同訳|^jpnict$/i, text: "聖書 新共同訳 © 日本聖書協会" },
	{ pattern: /聖書協会共同訳/i, text: "聖書 聖書協会共同訳 © 日本聖書協会" },
	{ pattern: /新改訳|^njb$/i, text: "聖書 新改訳 © 新日本聖書刊行会" },
	// Greek & Hebrew critical editions
	{ pattern: /^na2[78]|nestle|novum testamentum graece/i, text: "Novum Testamentum Graece, 28th revised edition, © 2012 Deutsche Bibelgesellschaft, Stuttgart." },
	{ pattern: /^ubs[45]|greek new testament.*ubs/i, text: "The Greek New Testament, 5th revised edition, © 2014 Deutsche Bibelgesellschaft, Stuttgart." },
	{ pattern: /^lxx|rahlfs|septuag/i, text: "Septuaginta, ed. A. Rahlfs and R. Hanhart, © 2006 Deutsche Bibelgesellschaft, Stuttgart." },
	{ pattern: /^bhs|stuttgartensia/i, text: "Biblia Hebraica Stuttgartensia, 5th edition, © 1967/77, 1997 Deutsche Bibelgesellschaft, Stuttgart." },
	{ pattern: /^sblgnt/i, text: "Scripture quotations marked SBLGNT are from the SBL Greek New Testament. Copyright © 2010 Society of Biblical Literature and Logos Bible Software.", link: "https://sblgnt.com" },
	{
		pattern: /^net\b|^net2/i,
		text: "The Scriptures quoted are from the NET Bible®, copyright © 1996, 2019 used with permission from Biblical Studies Press, L.L.C. All rights reserved.",
		link: "https://netbible.org",
	},
];

export function knownCitation(...keys: (string | undefined)[]): KnownCitation | undefined {
	for (const k of keys) {
		const key = (k ?? "").trim();
		if (!key) continue;
		const hit = KNOWN_CITATIONS.find((c) => c.pattern.test(key));
		if (hit) return hit;
	}
	return undefined;
}
