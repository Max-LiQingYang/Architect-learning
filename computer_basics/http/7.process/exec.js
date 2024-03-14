let { exec } = require("child_process");
let path = require('path');
// 用于使用 shell 执行命令
let p1 = exec(
  `node test4.js a b c`,
  {
    cwd: path.join(__dirname, 'test'),
    maxBuffer: 1024 * 1024, // 1G
    killSignal: 'SIGTERM', // 指定关闭子进程的信号， 默认值为 SIGTERM
  },
  function (err, stdout, stdin) {
    console.log(err);
    console.log(stdout);
  }
);

// 会向子进程发射一个信号 SIGTERM
// kill 并非一定会杀死子进程
p1.kill();
