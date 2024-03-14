let { fork } = require('child_process');
let os = require('os');
let http = require('http');

let server = http.createServer(function (req, res) {
    res.end('请求在父进程被处理');
});

server.listen(8000);
for (let i = 0; i < os.cpus.length; i++) {

    let p1 = fork('server.js', [], {
        cwd: __dirname,
    });
    p1.send('server', server);
}
