const fs = require('fs');
const iconv = require('iconv-lite');

function decodeJIS(kuten) {
  let ku = parseInt(kuten.substring(0, 2), 10);
  let ten = parseInt(kuten.substring(2, 4), 10);
  let buf = Buffer.from([ku + 0xA0, ten + 0xA0]);
  return iconv.decode(buf, 'euc-jp');
}

const html = fs.readFileSync('yasuoka.html', 'utf-8');

// The page is split into lists by <LI>
let items = html.split('<LI>');
items.shift(); // remove header

let additions = {};

for (let item of items) {
  let yearMatch = item.match(/^\s*(\d{4})/);
  if (!yearMatch) {
    console.log("Failed to match year in block starting with:", item.substring(0, 30));
    continue;
  }
  let year = parseInt(yearMatch[1], 10);
  console.log("Matched year:", year);

  let lines = item.split('<BR>');
  let isAdding = true;

  for (let line of lines) {
    if (line.includes('削除') || line.includes(':o=|')) {
      isAdding = false;
    }
    if (line.includes('追加') || line.includes('DI2C') || line.includes('制定')) {
      isAdding = true;
    }
    
    // Extract images
    let imgRegex = /JIS(?:alt|-|\d{2}-)(\d{4})/g;
    let match;
    while ((match = imgRegex.exec(line)) !== null) {
      if (isAdding) {
        let kanji = decodeJIS(match[1]);
        if (!additions[kanji] || additions[kanji] > year) {
          additions[kanji] = year; 
        }
      }
    }
  }
}

console.log("Total additions parsed:", Object.keys(additions).length);

// Load kanji_data.js
let kanjiDataContent = fs.readFileSync('../kanji_data.js', 'utf-8');
const prefix = kanjiDataContent.substring(0, kanjiDataContent.indexOf('['));
const suffixStr = kanjiDataContent.substring(kanjiDataContent.lastIndexOf(']') + 1);
const jsonStr = kanjiDataContent.substring(kanjiDataContent.indexOf('['), kanjiDataContent.lastIndexOf(']') + 1);
let kanjiData = JSON.parse(jsonStr);

// Reset all existing jinmeiyoYears to use Yasuoka's
let updatedCount = 0;
kanjiData.forEach(item => {
  if (additions[item.kanji]) {
    item.jinmeiyoYear = additions[item.kanji];
    updatedCount++;
  } else if (item.jinmeiyoYear) {
    // If it was in wikipedia but not yasuoka, Yasuoka's site is the truth. 
    // Delete it to be strictly compliant.
    delete item.jinmeiyoYear; 
  }
});

let newContent = prefix + JSON.stringify(kanjiData, null, 2) + suffixStr;
fs.writeFileSync('../kanji_data.js', newContent, 'utf-8');
console.log(`Updated jinmeiyoYear for ${updatedCount} kanji using Yasuoka's data.`);
