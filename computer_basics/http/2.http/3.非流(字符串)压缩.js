let zlib = require("zlib");
let str = "hello";

zlib.gzip(str, (err, buffer) => {
  // 有时候压缩后反而比压缩前大
  console.log(buffer.length);

  // 解压缩
  zlib.unzip(buffer, (err, buffer) => {
    console.log(buffer.toString());
  });
});
