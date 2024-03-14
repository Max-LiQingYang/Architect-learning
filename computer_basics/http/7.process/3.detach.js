const { spawn } = require('child_process');
let fs = require('fs');
let path = require('path');
let fd = fs.openSync(path.join(__dirname, 'test.txt'), 'w'); // 文件标识符
let p1 = spawn('node', ['test4.js'], {
    stdin: ['ignore', fd, process.stderr], // 将 test4.js 文件输出到 test.txt 中
    cwd: path.join(__dirname, 'test'),
});

p1.on('error', function(err) {
    console.log('子进程错误' + err);
});

p1.unref(); 

