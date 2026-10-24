// 66-book canon, numbered 1–66 (the numbering bolls.life uses).
// ko / koShort follow 대한성서공회 conventions; en / enShort follow SBL-style abbreviations.
// aliases are extra spellings accepted when parsing (compared after lowercasing and removing spaces/periods).

export interface BookInfo {
	num: number;
	ko: string;
	koShort: string;
	en: string;
	enShort: string;
	/** Chinese Union Version names, simplified / traditional */
	zh: string;
	zhShort: string;
	zhT: string;
	zhTShort: string;
	/** Japanese Colloquial (口語訳) names */
	ja: string;
	jaShort: string;
	aliases: string[];
}

// 和合本 book names (simplified) and common abbreviations
const ZH = "创世记 出埃及记 利未记 民数记 申命记 约书亚记 士师记 路得记 撒母耳记上 撒母耳记下 列王纪上 列王纪下 历代志上 历代志下 以斯拉记 尼希米记 以斯帖记 约伯记 诗篇 箴言 传道书 雅歌 以赛亚书 耶利米书 耶利米哀歌 以西结书 但以理书 何西阿书 约珥书 阿摩司书 俄巴底亚书 约拿书 弥迦书 那鸿书 哈巴谷书 西番雅书 哈该书 撒迦利亚书 玛拉基书 马太福音 马可福音 路加福音 约翰福音 使徒行传 罗马书 哥林多前书 哥林多后书 加拉太书 以弗所书 腓立比书 歌罗西书 帖撒罗尼迦前书 帖撒罗尼迦后书 提摩太前书 提摩太后书 提多书 腓利门书 希伯来书 雅各书 彼得前书 彼得后书 约翰一书 约翰二书 约翰三书 犹大书 启示录".split(" ");
const ZH_SHORT = "创 出 利 民 申 书 士 得 撒上 撒下 王上 王下 代上 代下 拉 尼 斯 伯 诗 箴 传 歌 赛 耶 哀 结 但 何 珥 摩 俄 拿 弥 鸿 哈 番 该 亚 玛 太 可 路 约 徒 罗 林前 林后 加 弗 腓 西 帖前 帖后 提前 提后 多 门 来 雅 彼前 彼后 约一 约二 约三 犹 启".split(" ");
// Simplified → traditional for the characters used in book names
const TRAD: Record<string, string> = { 创: "創", 记: "記", 纪: "紀", 数: "數", 约: "約", 书: "書", 亚: "亞", 师: "師", 历: "歷", 诗: "詩", 传: "傳", 赛: "賽", 结: "結", 弥: "彌", 鸿: "鴻", 该: "該", 玛: "瑪", 马: "馬", 罗: "羅", 门: "門", 来: "來", 犹: "猶", 启: "啟", 录: "錄", 后: "後" };
const toTrad = (x: string) => x.replace(/./gu, (c) => TRAD[c] ?? c);

// 口語訳 book names and common abbreviations
const JA = "創世記 出エジプト記 レビ記 民数記 申命記 ヨシュア記 士師記 ルツ記 サムエル記上 サムエル記下 列王紀上 列王紀下 歴代志上 歴代志下 エズラ記 ネヘミヤ記 エステル記 ヨブ記 詩篇 箴言 伝道の書 雅歌 イザヤ書 エレミヤ書 哀歌 エゼキエル書 ダニエル書 ホセア書 ヨエル書 アモス書 オバデヤ書 ヨナ書 ミカ書 ナホム書 ハバクク書 ゼパニヤ書 ハガイ書 ゼカリヤ書 マラキ書 マタイによる福音書 マルコによる福音書 ルカによる福音書 ヨハネによる福音書 使徒行伝 ローマ人への手紙 コリント人への第一の手紙 コリント人への第二の手紙 ガラテヤ人への手紙 エペソ人への手紙 ピリピ人への手紙 コロサイ人への手紙 テサロニケ人への第一の手紙 テサロニケ人への第二の手紙 テモテへの第一の手紙 テモテへの第二の手紙 テトスへの手紙 ピレモンへの手紙 ヘブル人への手紙 ヤコブの手紙 ペテロの第一の手紙 ペテロの第二の手紙 ヨハネの第一の手紙 ヨハネの第二の手紙 ヨハネの第三の手紙 ユダの手紙 ヨハネの黙示録".split(" ");
const JA_SHORT = "創 出 レビ 民 申 ヨシ 士 ルツ サム上 サム下 王上 王下 歴上 歴下 エズ ネヘ エス ヨブ 詩 箴 伝 雅歌 イザ エレ 哀 エゼ ダニ ホセ ヨエ アモ オバ ヨナ ミカ ナホ ハバ ゼパ ハガ ゼカ マラ マタ マル ルカ ヨハ 使 ロマ 1コリ 2コリ ガラ エペ ピリ コロ 1テサ 2テサ 1テモ 2テモ テト ピレ ヘブ ヤコ 1ペテ 2ペテ 1ヨハ 2ヨハ 3ヨハ ユダ 黙".split(" ");

const RAW: [string, string, string, string, string][] = [
	// ko, koShort, en, enShort, aliases (comma-separated)
	["창세기", "창", "Genesis", "Gen", "ge,gn,gen,창세"],
	["출애굽기", "출", "Exodus", "Exod", "ex,exo,exod,출애굽"],
	["레위기", "레", "Leviticus", "Lev", "le,lv,lev"],
	["민수기", "민", "Numbers", "Num", "nu,nm,nb,num"],
	["신명기", "신", "Deuteronomy", "Deut", "dt,de,deu,deut"],
	["여호수아", "수", "Joshua", "Josh", "jos,jsh,josh,여호수아서"],
	["사사기", "삿", "Judges", "Judg", "jdg,jg,jdgs,judg"],
	["룻기", "룻", "Ruth", "Ruth", "ru,rth"],
	["사무엘상", "삼상", "1 Samuel", "1 Sam", "1sa,1sm,1sam,isam,1samuel"],
	["사무엘하", "삼하", "2 Samuel", "2 Sam", "2sa,2sm,2sam,iisam,2samuel"],
	["열왕기상", "왕상", "1 Kings", "1 Kgs", "1ki,1kg,1kgs,1kin,1kings"],
	["열왕기하", "왕하", "2 Kings", "2 Kgs", "2ki,2kg,2kgs,2kin,2kings"],
	["역대상", "대상", "1 Chronicles", "1 Chr", "1ch,1chr,1chron,1chronicles"],
	["역대하", "대하", "2 Chronicles", "2 Chr", "2ch,2chr,2chron,2chronicles"],
	["에스라", "스", "Ezra", "Ezra", "ezr,에스라서"],
	["느헤미야", "느", "Nehemiah", "Neh", "ne,neh,느헤미야서"],
	["에스더", "에", "Esther", "Esth", "est,esth,es,에스더서"],
	["욥기", "욥", "Job", "Job", "jb"],
	["시편", "시", "Psalms", "Ps", "ps,psa,psm,pss,psalm,psalms"],
	["잠언", "잠", "Proverbs", "Prov", "pr,prv,pro,prov"],
	["전도서", "전", "Ecclesiastes", "Eccl", "ec,ecc,eccl,eccles,qoh"],
	["아가", "아", "Song of Songs", "Song", "song,sos,sng,songofsolomon,songofsongs,cant,아가서"],
	["이사야", "사", "Isaiah", "Isa", "is,isa,이사야서"],
	["예레미야", "렘", "Jeremiah", "Jer", "je,jer,jr,예레미야서"],
	["예레미야애가", "애", "Lamentations", "Lam", "la,lam,애가"],
	["에스겔", "겔", "Ezekiel", "Ezek", "eze,ezek,ezk,에스겔서"],
	["다니엘", "단", "Daniel", "Dan", "da,dan,dn,다니엘서"],
	["호세아", "호", "Hosea", "Hos", "ho,hos,호세아서"],
	["요엘", "욜", "Joel", "Joel", "jl,joe,요엘서"],
	["아모스", "암", "Amos", "Amos", "am,amo,아모스서"],
	["오바댜", "옵", "Obadiah", "Obad", "ob,oba,obad,오바댜서"],
	["요나", "욘", "Jonah", "Jonah", "jon,jnh,요나서"],
	["미가", "미", "Micah", "Mic", "mi,mic,미가서"],
	["나훔", "나", "Nahum", "Nah", "na,nah,나훔서"],
	["하박국", "합", "Habakkuk", "Hab", "hab,hb,하박국서"],
	["스바냐", "습", "Zephaniah", "Zeph", "zep,zeph,zp,스바냐서"],
	["학개", "학", "Haggai", "Hag", "hag,hg,학개서"],
	["스가랴", "슥", "Zechariah", "Zech", "zec,zech,zc,스가랴서"],
	["말라기", "말", "Malachi", "Mal", "mal,ml,말라기서"],
	["마태복음", "마", "Matthew", "Matt", "mt,mat,matt,마태"],
	["마가복음", "막", "Mark", "Mark", "mk,mrk,mar,마가"],
	["누가복음", "눅", "Luke", "Luke", "lk,luk,누가"],
	["요한복음", "요", "John", "John", "jn,jhn,joh"],
	["사도행전", "행", "Acts", "Acts", "ac,act"],
	["로마서", "롬", "Romans", "Rom", "ro,rom,rm"],
	["고린도전서", "고전", "1 Corinthians", "1 Cor", "1co,1cor,1corinthians"],
	["고린도후서", "고후", "2 Corinthians", "2 Cor", "2co,2cor,2corinthians"],
	["갈라디아서", "갈", "Galatians", "Gal", "ga,gal"],
	["에베소서", "엡", "Ephesians", "Eph", "eph,ephes"],
	["빌립보서", "빌", "Philippians", "Phil", "php,phil,pp"],
	["골로새서", "골", "Colossians", "Col", "col,co"],
	["데살로니가전서", "살전", "1 Thessalonians", "1 Thess", "1th,1thes,1thess,1thessalonians"],
	["데살로니가후서", "살후", "2 Thessalonians", "2 Thess", "2th,2thes,2thess,2thessalonians"],
	["디모데전서", "딤전", "1 Timothy", "1 Tim", "1ti,1tm,1tim,1timothy"],
	["디모데후서", "딤후", "2 Timothy", "2 Tim", "2ti,2tm,2tim,2timothy"],
	["디도서", "딛", "Titus", "Titus", "ti,tit"],
	["빌레몬서", "몬", "Philemon", "Phlm", "phm,phlm,philem"],
	["히브리서", "히", "Hebrews", "Heb", "he,heb"],
	["야고보서", "약", "James", "Jas", "jas,jm,jam"],
	["베드로전서", "벧전", "1 Peter", "1 Pet", "1pe,1pt,1pet,1peter"],
	["베드로후서", "벧후", "2 Peter", "2 Pet", "2pe,2pt,2pet,2peter"],
	["요한일서", "요일", "1 John", "1 John", "1jn,1jo,1jhn,1john"],
	["요한이서", "요이", "2 John", "2 John", "2jn,2jo,2jhn,2john"],
	["요한삼서", "요삼", "3 John", "3 John", "3jn,3jo,3jhn,3john"],
	["유다서", "유", "Jude", "Jude", "jud,jd"],
	["요한계시록", "계", "Revelation", "Rev", "re,rev,rv,revelations,계시록"],
];

export const BOOKS: BookInfo[] = RAW.map(([ko, koShort, en, enShort, aliases], i) => ({
	num: i + 1,
	ko,
	koShort,
	en,
	enShort,
	zh: ZH[i],
	zhShort: ZH_SHORT[i],
	zhT: toTrad(ZH[i]),
	zhTShort: toTrad(ZH_SHORT[i]),
	ja: JA[i],
	jaShort: JA_SHORT[i],
	aliases: aliases.split(",").filter(Boolean),
}));

export function normalizeBookKey(s: string): string {
	return s.toLowerCase().replace(/[\s.]/g, "");
}

const LOOKUP = new Map<string, BookInfo>();
for (const b of BOOKS) {
	for (const key of [b.ko, b.koShort, b.en, b.enShort, ...b.aliases, b.zh, b.zhT, b.zhShort, b.zhTShort, b.ja, b.jaShort]) {
		const k = normalizeBookKey(key);
		if (!LOOKUP.has(k)) LOOKUP.set(k, b);
	}
}

export function findBook(name: string): BookInfo | undefined {
	return LOOKUP.get(normalizeBookKey(name));
}

export function getBook(num: number): BookInfo | undefined {
	return BOOKS[num - 1];
}
