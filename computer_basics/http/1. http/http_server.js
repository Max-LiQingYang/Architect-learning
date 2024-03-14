// 创建一个 http 服务器
// http服务器继承自 tcp 服务器, http 协议是应用层协议, 是基于 TCP 的
// 对请求和响应进行了包装
let http = require('http');
let url = require('url');
let querystring = require('querystring');
let fs = require('fs');

let server = http.createServer(function(socket) {
    
});

server.on('connection', function(socket) {
    
});

// 监听客户端你的请求, 当有请求到来时执行回调
// req 流对象, 是可读流, 代表客户端的连接, server 服务器吧客户端的请求信息进行解析, 然后放到 req 中
// res 是一个可写流 write, 如果希望向客户端回应
server.on('request', function(req, res) {
    console.log(req.method, req.url, req.headers);

    // url 服务器拿不到哈希值 #
    const urlObj = url.parse(req.url); // 如果第二个参数为 true, 那么 query 就是一个对象
    const url = url.format(urlObj);
    const { pathname, query } = url.parse(req.url, true);

    // 请求体可能是 文字/图片/流 等
    let result = [];
    req.on('data', function (data) {
        result.push(data);
    });

    // 响应
    req.on('end', function() {
        let str = Buffer.concat(result); // 请求体

        // 把字符串转成对象
        let contentType = req.headers['content-type'];
        let body;
        if (contentType == 'application/x-www-form-urlencoded') {
            // 请求体是表单
            body = querystring.parse(str);
        } else if (contentType == 'application/json') {
            // 请求体是 json 格式
            body = JSON.parse(str);
        } else {
            // 请求体是文件
            fs.createReadStream()
        }

        res.end(str);
    })
});

// 先触发 end 后出发 close
server.on('close', function(req, res) {

});

server.on('error', function(err) {
    
});

server.listen(8000, function() {});






