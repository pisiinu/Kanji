const https = require('https');
const fs = require('fs');

const url = "https://ja.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&titles=%E4%BA%BA%E5%90%8D%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7&format=json";

https.get(url, {
    headers: {
        'User-Agent': 'NamingAppBot/1.0 (Contact: local@example.com)'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        const pages = json.query.pages;
        const pageId = Object.keys(pages)[0];
        const wikitext = pages[pageId].revisions[0]['*'];
        fs.writeFileSync('wikipedia_jinmeiyo.wikitext', wikitext);
        console.log('Downloaded Wikipedia wikitext.');
    });
}).on('error', (e) => {
    console.error(e);
});
