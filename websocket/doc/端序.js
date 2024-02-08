/**
 * 大端序/小端序
 */
const buffer = Buffer.from([0b00000001, 0b00000000]);

console.log(buffer.readUInt16BE(0)); // 大端序 0000000010000000
console.log(buffer.readUInt16LE(0)); // 小端序 0000000000001

function getLength(buffer) {
  // length <= 125 直接返回长度
  // length == 126 后续两个字节, 代表16位无符号整数, 为数据的长度
  // length == 127 后续八个字节, 代表 64 位无符号整数, 为数据的长度
  const byte = buffer.readUInt8(0); // 变成10进制
  const str = byte.toString(2); // 变成2进制
  const length = parseInt(str.subString(1), 2);

  if (length === 126) {
    length = buffer.readUInt16BE(1);
  } else if (length === 127) {
    length = buffer.readUInt64BE(1);
  }

  return length;
}

console.log((126).toString(2));
console.log((127).toString(2));
console.log(getLength(Buffer.from([0b10000001, 0b10000001])));
console.log(
  getLength(Buffer.from([0b10000001, 0b11111110, 0b00000000, 0b00000001]))
);
console.log(
  getLength(
    Buffer.from([
      0b10000001, 0b11111111, 0b00000000, 0b00000000, 0b00000000, 0b00000000,
      0b00000000, 0b00000000, 0b00000000, 0b00000001,
    ])
  )
);
