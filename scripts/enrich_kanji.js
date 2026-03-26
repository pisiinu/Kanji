const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function enrich() {
  console.log("Loading existing kanji_data.js...");
  let rawData = fs.readFileSync('../kanji_data.js', 'utf8');
  
  // Extract kanjiData array
  const match = rawData.match(/const kanjiData = (\[.*?\]);/s);
  if (!match) {
      console.error("Could not find kanjiData array");
      return;
  }
  let kanjiData = JSON.parse(match[1]);

  console.log("Fetching Kanjidic (Freq) data...");
  const kRes = await axios.get('https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json');
  const kanjiMeta = kRes.data;

  console.log("Fetching Kanken data...");
  const kankenRes = await axios.get('https://raw.githubusercontent.com/hoffmannjp/kanken-json/master/kanken.json');
  const kankenData = kankenRes.data; // likely { "10": ["一","二"...], ... } or { "kanji": "kanken_grade" }
  
  // Convert kankenData if it's an object of arrays
  const kankenMap = {};
  if (Array.isArray(kankenData['10']) || Array.isArray(kankenData['10級'])) {
      for (const [grade, kList] of Object.entries(kankenData)) {
          let g = grade.replace('級', '');
          for (const k of kList) {
              kankenMap[k] = g;
          }
      }
  } else {
      for (const [kanji, meta] of Object.entries(kankenData)) {
          kankenMap[kanji] = meta.kanken || meta; // Just in case
      }
  }

  console.log("Fetching Jinmeiyo History from Wikipedia...");
  const wikiUrl = 'https://ja.wikipedia.org/wiki/%E4%BA%BA%E5%90%8D%E7%94%A8%E6%BC%A2%E5%AD%97';
  const wikiRes = await axios.get(wikiUrl, { headers: { 'User-Agent': 'KanjiEnrichData/1.0 (local-dev)' } });
  const $ = cheerio.load(wikiRes.data);
  const jinmeiyoMap = {};
  
  // Looking for years. E.g., "1951年（昭和26年）5月25日施行（92字）" usually inside h3 or h4 or dt headers.
  $('h3, h4, dt, p, b').each((i, el) => {
    const text = $(el).text();
    const yearMatch = text.match(/([0-9]{4})年/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      // Next element might be the list of kanji
      let nextEl = $(el).next();
      while (nextEl && nextEl.length > 0) {
        const nextText = nextEl.text().replace(/\s/g, '');
        if (nextText.length > 0 && /^[一-龥]+$/.test(nextText.substring(0, 5))) {
            // Found a block of kanji
            for (const char of nextText) {
                if (!jinmeiyoMap[char] && /^[一-龥]$/.test(char)) {
                    jinmeiyoMap[char] = year;
                }
            }
        }
        if (nextEl.prop('tagName') === 'H3' || nextEl.prop('tagName') === 'H4') break;
        nextEl = nextEl.next();
      }
    }
  });

  // Second pass: Update kanjiData
  let modifiedCount = 0;
  for (let k of kanjiData) {
      let char = k.kanji;
      // Frequency
      if (kanjiMeta[char] && kanjiMeta[char].freq) {
          k.freq = kanjiMeta[char].freq;
      } else {
          k.freq = 9999; // Default low frequency
      }
      
      // Kanken Grade
      if (kankenMap[char]) {
          k.kankenGrade = String(kankenMap[char]);
      } else if (kanjiMeta[char]) {
          let g = kanjiMeta[char].grade;
          // Approximate mapping
          if (g === 1) k.kankenGrade = "10";
          else if (g === 2) k.kankenGrade = "9";
          else if (g === 3) k.kankenGrade = "8";
          else if (g === 4) k.kankenGrade = "7";
          else if (g === 5) k.kankenGrade = "6";
          else if (g === 6) k.kankenGrade = "5";
          else if (g === 8) k.kankenGrade = "2～4"; // Joyo high school
          else if (g === 9 || g === 10 || k.kanjiType === 'jinmeiyo') k.kankenGrade = "準1";
          else k.kankenGrade = "1";
      } else {
          k.kankenGrade = k.kanjiType === 'joyo' ? "2〜4" : k.kanjiType === 'jinmeiyo' ? "準1" : "1";
      }
      
      // Jinmeiyo Year
      if (k.kanjiType === 'jinmeiyo') {
          if (jinmeiyoMap[char]) {
              k.jinmeiyoYear = jinmeiyoMap[char];
          } else {
              k.jinmeiyoYear = 2017; // Fallback
          }
      }
      modifiedCount++;
  }

  console.log(`Updated ${modifiedCount} kanji records.`);

  const newDataStr = rawData.replace(/const kanjiData = \[.*?\];/s, `const kanjiData = ${JSON.stringify(kanjiData)};`);
  fs.writeFileSync('../kanji_data.js', newDataStr, 'utf8');
  console.log("kanji_data.js successfully saved!");
}

enrich().catch(console.error);
