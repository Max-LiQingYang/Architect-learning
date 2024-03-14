let http = require('http');
let fs = require('fs');
let url = require('url');


const whiteList = [];

// 模拟图片服务器
http.createServer(function (req, res) {
    let refer = req.headers['referer'] || req.headers['refer'];
    // 如果说有 refer 的话，则表示从页面引用过来的
    if (refer) {
        let refererHostname = url.parse(refer, true).hostname;
        let currentHostname = url.parse(req.url, true).hostname;

        if (refererHostname !== currentHostname || whiteList.indexOf(refererHostname) === -1) {
            // 防盗链
            res.setHeader('Content-Type', 'image/png');
            fs.createReadStream(path.join(__dirname, 'forbiden.png')).pipe(res);
        }
    }

    res.setHeader('Content-Type', 'image/png');
    fs.createReadStream(path.join(__dirname, 'mm.png')).pipe(res);
}).listen(8000);


