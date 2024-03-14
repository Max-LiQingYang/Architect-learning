let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let crypto = require('crypto');

http.createServer(function(req, res) {
    let { pathname } = url.parse(req.url, true);
    let filepath = path.join(__dirname, pathname);

    fs.stat(filepath, (err, stat) => {
        if (err || pathname == '/favicon.ico') {
            return sendError(req, res);
        } else {
            let ifNoneMatch = req.headers['if-none-match'];
            let md5 = crypto.createHash('md5');
            let out = fs.createReadStream(filepath);
            out.on('data', function(data) {
                md5.update(data);
            });

            out.on('end', function() {
                let etag = md5.digest('hex');
                if (ifNoneMatch == etag) {
                    res.writeHead(304); // 缓存生效
                    res.end();
                } else {
                    return send(req, res, filepath, etag);
                }
            });
        }
    });
}).listen(8000);

function sendError(req, res) {
    res.writeHead(400, { 'Content-Type': 'text/html' })
    res.end('Not Found');
}

function send(req, res, filepath, etag) {
    res.setHeader('Content-Type', mime.getType(filepath));
    // 第一次服务器返回的时候, 会把文件的内容算出来一个标识, 发送给客户端
    fs.readFile(filepath, (err, data) => {
        // 客户端会保存 Etag 值
        res.setHeader('Etag', crypto.createHash('md5').update(data).digest('hex'));
        fs.createReadStream(filepath).pipe(res);
    });
}
