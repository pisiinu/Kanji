const fs = require('fs');

const rawData = fs.readFileSync('kanji_data.js', 'utf8');

// Use regex to locate kangxiRadicals and kanjiData
const kangxiMatch = rawData.match(/const kangxiRadicals = ({[\s\S]*?});/);
const kanjiDataMatch = rawData.match(/const kanjiData = (\[[\s\S]*\]);/);

if (!kangxiMatch || !kanjiDataMatch) {
    console.error("Could not parse kanji_data.js");
    process.exit(1);
}

const kangxiRadicals = kangxiMatch[1];
const kanjiData = JSON.parse(kanjiDataMatch[1]);

const historyMap = new Map();

function addHistory(year, text, action) {
    const chars = Array.from(text);
    for (const ch of chars) {
        if (!ch.trim()) continue;
        if (!historyMap.has(ch)) {
            historyMap.set(ch, []);
        }
        historyMap.get(ch).push({ year, action });
    }
}

// Data from user prompt
const txt1951 = "丑丞乃之也瓦亥亦亨亮仙伊匡卯只吾呂哉嘉圭奈宏寅尚巖巳庄弘弥彦悌敦昌晃晋智暢朋杉桂桐楠橘欣欽毅浩淳熊爾猪玲琢瑞甚睦磨磯祐禄禎稔穣綾惣聡肇胤艶蔦藤蘭虎蝶輔辰郁酉錦鎌靖須馨駒鯉鯛鶴鹿麿斉龍亀";
const txt1976 = "佑允冴喬怜悠旭杏梓梢梨沙渚瑠瞳紗紘絢翠耶芙茜葵藍那阿隼鮎";
const rem1981 = "尚甚杉斉仙磨悠龍";
const txt1981 = "伍伶侑尭孟峻嵩嶺巴彬惇惟慧斐旦昂李栗楓槙汐洵洸渥瑛瑶璃甫皓眸矩碧笹緋翔脩苑茉莉萌萩蓉蕗虹諒赳迪遥遼霞頌駿鳩鷹";
const txt1990 = "伎伽侃倖倭偲治凌凜凪凱勁叡叶唄啄奎媛嬉宥崚嵐嵯巽彗彪恕憧拳捷捺於旺昴晏晟晨暉曙朔杜柊柚柾栞梧椋椎椰椿楊榛槻樺檀毬汀汰洲湧滉漱澪熙燎燦燿爽玖琳瑚瑳皐眉瞭碩秦稀稜竣笙紬絃綜綸綺耀胡舜芹茄茅莞菖菫蒔蒼蓮蕉衿袈裟詢誼諄邑醇采雛鞠颯魁鳳鴻鵬麟黎黛";
const txt1997 = "琉";
const txt2004_1 = "曽";
const txt2004_2 = "獅";
const txt2004_3 = "毘瀧駕";
const txt2004_4 = "串乎云些仔佃俄俠俣俐倡俺俱倦僅傭儲兎兜其冥凄凛凧凰函刹劉劫勃勾匂勿廿ト卿厨厩叉叢吞吻哨哩喧喰喋嘩嘗噌噂圃坐堯坦埼埴堆堰堺堵塙塞塡壕壬夷奄套妖娃姪姥娩朱宛宕寓寵尖尤屑岡峨崖已巷巾帖幌幡庇庚庵廟廻弛徠忽恢恰惚悉惹惺憐戊或戚戟戴托按拶拭挨捉挺挽掬捲捻捧掠揃摑摺撒撰撞播撫擢孜斑斡斧斯昊昏眛晄晒晦曖曝曳曾杖杭杵枕杷枇柑柴柵杮柘栃柏桧檜桔桁栖梗梛梯桶梶椛梁椅棲椀楯楚楕楢榎榊槇槍槌樫樟樋樽橙檎櫂櫛櫓歎此殆汝汎汲沌沓沬洛浬淵淀淋湘湊湛溢溜漕漣濡瀕灘灸灼烏烙焚煌煎煤煉燕燭爪牒牙牟牡牽犀狼玩珂珈珊珀琥琶琵瓜瓢瓦甥畏畠畢畿疋疏瘦瞥砦砥砧硯碓碗磐祇袮禰禱禽禾秤稟稽穿窄窟窪窺竪竺竿笈笠筈筑箕箔箸篇篠簞簾籾粥粟糊紐絆綴縞徽繫繡纂纏羚羨而耽肋肘肴脇腔腎膏膳臆臥臼舷舵芥芯芭芦苔苺茨茸荻莫菅萄菩萠萊菱葦葛萱葺董葡蓋蓑蒐蒲蒙蔭蔣蓬蔓蕎蕨蕃蕪蔽薙蕾藁薩蘇蜂蜜蝦螺蟬蟹蠟袖袴裡裾裳襖訊訣註詣詮詫諏誰謂諺諦謎讃豹貌貰貼賑跨蹄蹟蹴輯輿轟辻迂迄辿迦這逞逗逢遙遁遡遜祁鄭酎醐醒醍醬釉釘釜釧鋒鋸錐錆錫鍋鍵鍬鎧閃閠閤闇阜阪陀隈隙雀雁雫鞄鞍鞘鞭韓頁頃頓頗頰顚餅饗馴馳驍魯鰯鱒鱗鳶鴨鵜鷗鷲鷺麒麓県榮圓菌駈實嶋盃冨峯萬埜凉禮";
const txt2009 = "祷穹";
const txt2010 = "勺錘銑脹匁"; // Moved from Joyo to Jinmeiyo
const txt2015 = "巫";
const txt2017 = "渾";

addHistory(1951, txt1951, "追加");
addHistory(1976, txt1976, "追加");
addHistory(1981, rem1981, "削除（常用漢字へ移行等）");
addHistory(1981, txt1981, "追加");
addHistory(1990, txt1990, "追加");
addHistory(1997, txt1997, "追加");
addHistory(2004, txt2004_1 + txt2004_2 + txt2004_3 + txt2004_4, "追加");
addHistory(2009, txt2009, "追加");
addHistory(2010, txt2010, "追加（常用漢字から）");
addHistory(2015, txt2015, "追加");
addHistory(2017, txt2017, "追加");

for (const entry of kanjiData) {
    // 1. Delete kankenGrade
    delete entry.kankenGrade;

    // 2. Clear old jinmeiyoYear if exists
    if (entry.jinmeiyoYear) delete entry.jinmeiyoYear;

    // 3. Set jinmeiyoHistory and jinmeiyoYear
    const charHistory = historyMap.get(entry.kanji);
    if (charHistory) {
        entry.jinmeiyoHistory = charHistory;
        entry.jinmeiyoYear = charHistory[0].year; // First year for sorting
    }
}

// Format the resulting JS file similarly
let output = `const kangxiRadicals = ${kangxiRadicals};\n`;
output += `const kanjiData = ${JSON.stringify(kanjiData, null, 2)};\n`;

fs.writeFileSync('kanji_data.js', output, 'utf8');
console.log("kanji_data.js updated successfully.");
