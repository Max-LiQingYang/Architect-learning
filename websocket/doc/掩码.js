/**
 * 
 * @param {Buffer} buffer  字节数组
 * @param {*} maskKey 长度为4的 Buffer 字节
 */
function unmask(buffer, maskKey) {
    const length = buffer.length;

    for (let i = 0; i < length; i++) {
        buffer[i] ^= maskKey[i % 4];
    }
}

let mask = Buffer.from([1, 0, 1, 0]);
let buffer = Buffer.from([0, 1, 0, 1, 0, 1, 0, 1]);
unmask(buffer, mask);
console.log(buffer);