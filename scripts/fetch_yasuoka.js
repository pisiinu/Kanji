const http = require('http');
const fs = require('fs');
const iconv = require('iconv-lite');

http.get('http://kanji.zinbun.kyoto-u.ac.jp/~yasuoka/kanjibukuro/japan-jimmei3.html', res => {
  const chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    const decoded = iconv.decode(buf, 'EUC-JP');
    fs.writeFileSync('yasuoka.html', decoded, 'utf-8');
    console.log("Decoded and saved to yasuoka.html");
  });
}).on('error', err => {
  console.error("Error:", err);
});
