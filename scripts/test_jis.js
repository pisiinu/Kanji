const iconv = require('iconv-lite');
function decodeJIS(kuten) {
  let ku = parseInt(kuten.substring(0, 2));
  let ten = parseInt(kuten.substring(2, 4));
  let buf = Buffer.from([ku + 0xA0, ten + 0xA0]);
  return iconv.decode(buf, 'euc-jp');
}
console.log("1601:", decodeJIS("1601"));
console.log("1715:", decodeJIS("1715"));
