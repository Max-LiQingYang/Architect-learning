const crypto = require("crypto");
const CODE = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

function toAcceptKey(wsKey) {
  return crypto
    .createHash("sha1")
    .update(wsKey + CODE)
    .digest("base64");
}

function unmask(buffer, maskKey) {
  const length = buffer.length;

  for (let i = 0; i < length; i++) {
    buffer[i] ^= maskKey[i % 4];
  }
}

function toHeaders(rows) {
  const headers = {};

  for (let row of rows) {
    const [key, value] = row.split(": ");
    headers[key] = value;
  }

  return headers;
}

module.exports = {
  toHeaders,
  unmask,
  toAcceptKey,
};
