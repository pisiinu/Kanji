const fs = require('fs');

const wikitext = fs.readFileSync('wikipedia_jinmeiyo.wikitext', 'utf8');

let phase = 0; // 0: looking for 一, 1: parsing 一, 2: looking for 二, 3: parsing 二
let table1Entries = [];
let table2Entries = [];

const lines = wikitext.split('\n');

for (const line of lines) {
    if (line.includes('==== 一 ====')) {
        phase = 1;
        continue;
    }
    if (line.includes('==== 二 ====')) {
        phase = 2;
        continue;
    }
    if (line.startsWith('== ') && phase > 0) {
        break; // End of section
    }

    if ((phase === 1 || phase === 3) && line.startsWith('| ')) {
        const cols = line.split('||').map(s => s.trim());
        if (cols.length < 5) continue;

        if (phase === 1) { // Table 一
            const extractChar = (str) => {
                if (!str) return null;
                const match = str.match(/\[\[wikt:(.)\|/);
                return match ? match[1] : null;
            };
            const extractYear = (str) => {
                if (!str) return null;
                const match = str.match(/(\d{4})/);
                return match ? parseInt(match[1], 10) : null;
            };

            const char1 = extractChar(cols[2]);
            const year1 = extractYear(cols[4]);
            if (char1 && year1) table1Entries.push({ char: char1, year: year1 });

            if (cols.length >= 9) {
                const char2 = extractChar(cols[6]);
                const year2 = extractYear(cols[8]);
                if (char2 && year2) table1Entries.push({ char: char2, year: year2 });
            }
        } else if (phase === 3) { // Table 二
            const extractChar = (str) => {
                if (!str) return null;
                const match = str.match(/\[\[wikt:(.)\|/);
                return match ? match[1] : null;
            };
            const extractYear = (str) => {
                if (!str) return null;
                const match = str.match(/(\d{4})/);
                return match ? parseInt(match[1], 10) : null;
            };

            if (cols.length >= 10) {
                const char = extractChar(cols[7]);
                const year = extractYear(cols[9]);
                if (char && year) table2Entries.push({ char: char, year: year });
            }
        }
    } else if (phase === 2 && line.startsWith('|-')) {
        phase = 3;
    }
}

const allEntries = [...table1Entries, ...table2Entries];
const kanjiMap = {};
for (const entry of allEntries) {
    kanjiMap[entry.char] = entry.year;
}

const rawData = fs.readFileSync('kanji_data.js', 'utf8');

const kangxiMatch = rawData.match(/const kangxiRadicals = ({[\s\S]*?});/);
const kanjiDataMatch = rawData.match(/const kanjiData = (\[[\s\S]*\]);/);

if (!kangxiMatch || !kanjiDataMatch) {
    console.error("Could not parse kanji_data.js");
    process.exit(1);
}

const kangxiRadicals = kangxiMatch[1];
const kanjiData = JSON.parse(kanjiDataMatch[1]);


for (let k of kanjiData) {
    delete k.jinmeiyoHistory; // Remove old history format

    if (kanjiMap[k.kanji]) {
        k.jinmeiyoYear = kanjiMap[k.kanji];
    } else {
        delete k.jinmeiyoYear;
    }
}

let output = "const kangxiRadicals = " + kangxiRadicals + ";\n";
output += "const kanjiData = " + JSON.stringify(kanjiData, null, 2) + ";\n";

fs.writeFileSync('kanji_data.js', output, 'utf8');

console.log("Updated database! Saved " + Object.keys(kanjiMap).length + " kanji to kanji_data.js");


