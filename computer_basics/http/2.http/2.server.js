let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');
let zlib = require('zlib');
let mime = require('mime');
let { promisify } = require('util');
let stat = promisify(fs.stat);

/**
 * 客户端向服务器发送请求的时候, 会通过 accept-encoding 告诉服务器支持的解压缩的格式
 * Accept-Encoding: gzip, deflate, br
 */
http.createServer(async function(req, res) {
    let { pathname } = url.parse(req.url);
    // D:\xxx\msg.txt
    let filepath = path.join(__dirname, pathname);
    try {
        let statObj = await stat(filepath);
        // mime 包可以根据不同的文件内容返回不同的 Content-Type
        res.setHeader('Content-Type', mime.getType(pathname));

        // 为了兼容不同的浏览器, node 把所有的请求头全转成了小写
        let acceptEncoding = req.headers['accept-encoding'];
        // 内容协商
        if(acceptEncoding) {
            if (acceptEncoding.match(/\bgzip\b/)) {
                // 服务器告诉客户端用什么方法压缩了
                res.setHeader('Content-Encoding', 'gzip');
                fs.createReadStream(filepath).pipe(zlib.createGzip()).pipe(res);
            } else if (acceptEncoding.match(/\bdeflate\b/)) {
                res.setHeader('Content-Encoding', 'deflate');
                fs.createReadStream(filepath).pipe(zlib.createDeflate()).pipe(res);
            } else {
                fs.createReadStream(filepath).pipe(res);
            }
        }


        fs.createReadStream(res)
    } catch(e) {
        console.log('e:', e)
        res.statusCode = 404;
        res.end();
    }

}).listen(8000, function() {
    console.log('server is running at http://127.0.0.1:8000');
});

