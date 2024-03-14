let crypto = require('crypto');
let path = require('path');

// 加盐算法
let hmac = crypto.createHmac('sha256', 'secret-key');

hmac.update('123');
let result = hmac.digest('hex');
console.log(result);


