let yargs = require('yargs');
// 它可以帮助我们解析命令行参数, 把参数数组变成对象的形式
let argv = yargs.argv;
console.log(argv.name);