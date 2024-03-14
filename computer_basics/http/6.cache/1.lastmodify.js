let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let mime = require('mime');

http.createServer(function(req, res) {
    let { pathname } = url.parse(req.url, true);
    let filepath = path.join(__dirname, pathname);

    fs.stat(filepath, (err, stat) => {
        if (err || pathname == '/favicon.ico') {
            return sendError(req, res);
        } else {
            let ifModifiedSince = req.headers['if-modified-since'];
            let lastModified = stat.ctime.toGMTString();

            if (ifModifiedSince == lastModified) {
                res.writeHead(304); // 缓存生效
                res.end();
            } else {
                return send(req, res, filepath, stat);
            }
        }
    });
}).listen(8000);

function sendError(req, res) {
    res.writeHead(400, { 'Content-Type': 'text/html' })
    res.end('Not Found');
}

function send(req, res, filepath, stat) {
    // 发给客户端之后, 客户端会把此事件保存起来, 下次在获取此资源的时候会把这个时间发给服务器
    res.setHeader('Last-Modified', stat.ctime.toGMTString());
    res.writeHead(200, { 'Content-Type': mime.getType(filepath) });
    fs.createReadStream(filepath).pipe(res);
}
