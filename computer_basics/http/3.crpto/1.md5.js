/**
 * 1. 可以用来校验要下载的文件是否被改动过
 * 2. 对密码进行加密
 */
let crypto = require('crypto');
let str = 'hello world';
// console.log(crypto.getHashes());

let md5 = crypto.createHash('md5');
md5.update('hello'); // 制定要加密的值
md5.update('world'); // 再次添加要加密的值

console.log(md5.digest('hex')); // 输出加密后的值, 制定输出的格式 hex 十六进制

/**
 * 当客户端访问服务器的时候, 服务器可能会返回一个响应头 Content-Md5
 * 这个值就是响应体的 md5 值
 */
