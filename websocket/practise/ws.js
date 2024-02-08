/**
 * 基于 TCP 传输层协议实现一个 websocket 应用服务器
 */
const net = require("net");
const { EventEmitter } = require("events");
const { toHeaders, unmask, toAcceptKey } = require("./utils/index.js");

class Server extends EventEmitter {
  constructor(options) {
    super(options);
    this.options = options;
    this.server = net.createServer(this.listener);
    this.server.listen(options.port || 8888);
  }

  // 服务开启 TCP 协议
  // socket 套接字, 用来发送和接受消息
  listener = (socket) => {
    socket.setKeepAlive(true);

    socket.send = function (payload) {
      let opcode; // 数据格式
      if (Buffer.isBuffer(payload)) {
        opcode = 2;
      } else {
        opcode = 1;
        payload = Buffer.from(payload);
      }

      let length = payload.length;
      let buffer = Buffer.alloc(2 + length); // 分配 Buffer 大小, 数据长度 + 数据帧的头两个字节(没有额外长度 和 masking-key)
      buffer[0] = 0b10000000 | opcode;
      buffer[1] = length;
      payload.copy(buffer, 2); // 将 payload 复制到 buffer 中的第二个索引上

      socket.write(buffer);
    };

    // 当服务器收到客户端发过来的 data 后, chunk 是客户端发给服务端的数据
    socket.on("data", (chunk) => {
      // 第一次是 HTTP 协议, 之后才是 ws 协议
      // 判断是否是 ws 协议
      if (chunk.toString().match(/Upgrade: websocket/)) {
        // 请求升级为 ws 协议
        this.upgradeProtocol(socket, chunk.toString());
      } else {
        this.onmessage(socket, chunk);
      }
    });

    this.emit("connection", socket);
  };

  // 如果不是握手, 正常处理消息
  onmessage = (socket, chunk) => {
    let FIN = (chunk[0] & 0b10000000) === 0b10000000; // 是结束帧
    let opcode = chunk[0] & 0b00011111; // 得到操作码的十进制数
    let masked = (chunk[1] & 0b10000000) === 0b10000000; // 是否掩码了
    let payloadLength = chunk[1] & 0b0111111; // 数据的长度
    let payload;

    if (masked) {
      // 有掩码, 去除 4 字节掩码
      let maskingKey = chunk.slice(2, 6);
      payload = chunk.slice(6, 6 + payloadLength);
      unmask(payload, maskingKey);
    } else {
      payload = chunk.slice(6, 6 + payloadLength);
    }

    // 结束帧
    if (FIN) {
      if (opcode === 1) {
        // 文本字符串
        socket.emit("message", payload.toString("utf8"));
      } else if (opcode === 2) {
        // 二进制数据
        socket.emit("message", payload);
      }
    }
  };

  upgradeProtocol = (socket, chunk) => {
    let rows = chunk.split("\r\n");
    let headers = toHeaders(rows.slice(1, -2));
    let wsKey = headers["Sec-WebSocket-Key"];
    let acceptKey = toAcceptKey(wsKey);
    let response = [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      `Sec-WebSocket-Accept: ${acceptKey}`,
      "Connection: Upgrade",
      "\r\n",
    ].join("\r\n");

    socket.write(response);
  };

  send = (socket, data) => {
    this.server.write(data);
  };

  close = (socket) => {
    this.server.close();
  };
}

module.exports = { Server };
