let http = require('http');

process.on('message', function(msg, server) {
    if (msg === 'server') {
        http.createServer(function(req, res) {
            res.end('请求子进程中被处理');
        }).listen(server);
    }
});