// 对称加密, 加密和上面的摘要
let crypto = require('crypto');
let path = require('path');
let fs = require('fs');

let str = 'zfpx';
let pk = fs.readFileSync(path.join(__dirname, 'rsa_private.key'));

let cipher = crypto.createCipher('blowfish', pk);
cipher.update(str, 'utf8');
let result = cipher.final('hex'); // 输出加密结果
console.log(result);

let decipher = crypto.createDecipher('blowfish', pk);

decipher.update(result, 'hex');
let r = decipher.final('utf8'); // 输出解密结果


