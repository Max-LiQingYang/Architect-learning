let path = require('path');
let { spawn } = require('child_process');
let sub_process1 = spawn('node', ['test1.js'], {
    cwd: path.join(__dirname, 'test'),
    stdio: ['pipe', 'pipe', 'pipe']
});

let sub_process2 = spawn('node', ['test1.js'], {
    cwd: path.join(__dirname, 'test'),
    stdio: ['pipe', 'pipe', 'pipe']
});

sub_process1.on('exit', function() {
    console.log('子进程退出')
});

sub_process1.on('close', function() {
    console.log('子进程关闭');
});

sub_process1.on('error', function(err) {
    console.log('子进程错误' + err);
})














