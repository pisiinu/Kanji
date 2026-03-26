const fs = require('fs');

const data = fs.readFileSync('kanji_data.js', 'utf8');
// kanji_data.js typically looks like: const kanjiData = [ ... ];
// We can eval it safely or just parse JSON if it's a window object
// Let's just strip 'const kanjiData = ' and ';'
const jsonString = data.replace(/^const kanjiData = /, '').replace(/;$/, '');
const kanjiList = JSON.parse(jsonString);

console.log(JSON.stringify(kanjiList[0], null, 2));
console.log("Total kanji:", kanjiList.length);
