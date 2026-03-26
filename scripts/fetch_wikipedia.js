const https = require('https');
const fs = require('fs');

const url = "https://ja.wikipedia.org/w/api.php?action=parse&page=%E4%BA%BA%E5%90%8D%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7&format=json&prop=text";

https.get(url, {
    headers: {
        'User-Agent': 'NamingAppBot/1.0 (Contact: local@example.com)'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('wikipedia_jinmeiyo.json', data);
        console.log('Downloaded Wikipedia JSON.');
    });
}).on('error', (e) => {
    console.error(e);
});
