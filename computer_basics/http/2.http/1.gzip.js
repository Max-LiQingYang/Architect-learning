let fs = require("fs");
let zlib = require("zlib");
let path = require("path");
console.log(process.cwd()); // current working directory 当前工作目录

// 实现压缩. transform 转换流, 继承自双工流
function gzip(src) {
  fs.createReadStream(src)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(src + ".gz"));
}

gzip(path.join(__dirname, "msg.txt"));

// 解压
// basename 从一个路径中得到文件名, 包含扩展名, 可以传一个扩展名字符串参数代替扩展名
// extname 是获取扩展名
function gunzip(src) {
  fs.createReadStream(src)
    .pipe(zlib.createGunzip())
    .pipe(
      fs.createWriteStream(path.join(__dirname, path.basename(src, ".gz")))
    );
}

gunzip(path.join(__dirname, "msg.txt.gz"));
