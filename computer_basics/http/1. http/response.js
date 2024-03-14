let http = require('http');
// 如何向客户端写入相应信息
/**
 * 响应行 HTTP/1.1 200 OK
 * 响应头 Date: Fri, 02 Feb 2018
 * 
 * 响应体
 */
const server = http.createServer(function(req, res) {
    res.statusCode = 200; // 设置响应码
    res.sendDate = false; // Date 响应头默认会设置, 如果真的不想要, 可以设置为 false
    res.setHeader('Content-Type', 'text/html;charset=utf8'); // 设置响应头
    res.getHeader('Content-Type'); // 获取响应头
    res.removeHeader('Content-Type'); // 删除响应头

    // 响应体, 可写流 - write
    // chunk 分块传播
    res.write('hello'); 
    res.write('world');


    // writeHead 一旦调用会立刻向客户端写入, 但是 setHeader 不会
    // 当调用 writeHead 或者 write 时, 会向客户端写入
    res.writeHead(200, {
        "Content-Type": "text/html;charset=utf8"
    });

    res.headersSent // 响应头是否已经发送过了

    res.end(); // 关闭后不能再使用 write, 因为流已经关闭
});