const fs = require('fs');
const iconv = require('iconv-lite');

function decodeJIS(kuten) {
  let ku = parseInt(kuten.substring(0, 2), 10);
  let ten = parseInt(kuten.substring(2, 4), 10);
  let buf = Buffer.from([ku + 0xA0, ten + 0xA0]);
  return iconv.decode(buf, 'euc-jp');
}

const html = fs.readFileSync('yasuoka.html', 'utf-8');
let items = html.split('<LI>');
items.shift();
let additions = {};

for (let item of items) {
  let yearMatch = item.match(/^\s*(\d{4})/);
  if (!yearMatch) continue;
  let year = parseInt(yearMatch[1], 10);
  let lines = item.split('<BR>');
  let isAdding = true;

  for (let line of lines) {
    if (line.includes('削除') || line.includes(':o=|')) isAdding = false;
    if (line.includes('追加') || line.includes('DI2C') || line.includes('制定') || line.includes('@)Dj')) isAdding = true;
    
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

let byYear = {};
for (let kanji in additions) {
  let year = additions[kanji];
  if (!byYear[year]) byYear[year] = [];
  byYear[year].push(kanji);
}

let result = "";
for (let year of Object.keys(byYear).sort((a,b)=>a-b)) {
  result += `【${year}年】（${byYear[year].length}文字）\n`;
  result += byYear[year].join("") + "\n\n";
}

fs.writeFileSync('answers.txt', result, 'utf-8');
console.log("Wrote answers.txt");
