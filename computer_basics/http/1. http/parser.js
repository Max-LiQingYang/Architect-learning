// parser 方法解析请求对象, 其实就是请求信息, 然后解析出请求行头体,
let fs = require("fs");
let path = require("path");
let { StringDecoder } = require("string_decoder"); // 把 buffer 转成字符串, 可以保证不乱码
let decoder = new StringDecoder();

function parse(requestStream, requestListener) {
  function onReadable() {
    let buf;
    let buffers = [];
    while (null != (buf = requestStream.read(32))) {
      let str = decoder.write(buf);
      if (str.match(/\r\n\r\n/)) {
        buffers.push(buf);
        let result = Buffer.concat(buffers);
        let values = result.split(/\r\n\r\n/);
        let headers = values.shift();
        let headerObj = parseHeader(headers);
        Object.assign(requestStream, headerObj);

        let body = values.join("\r\n\r\n");
        requestStream.removeListener("readable", onReadable);
        // readable.unshift
        requestStream.unshift(Buffer.from(body));

        return requestListener(requestStream);
      }
    }
  }
  requestStream.on("readable", onReadable);
}

function parseHeader(headerStr) {
  let lines = headerStr.split(/\r\n/);
  let startLine = lines.shift();

  let starts = startLine.split(" ");
  let method = starts[0];
  let url = starts[1];
  let protocal = starts[2];
  let protocalName = protocal.split("/")[0];
  let protocalVersion = protocal.split("/")[1];

  let headers = {};
  lines.forEach((line) => {
    let row = line.split(": ");
    headers[row[0]] = row[1];
  });

  return {
    headers,
    method,
    url,
    protocalName,
    protocalVersion,
  };
}

let rs = fs.createReadStream(path.join(__dirname, "req.txt"));

// socket 拆成两个对象, 一个请求, 一个相应
parse(rs, function (req) {
  console.log(req.method, req.url, req.headers);

  // 拿到完整的请求体
  req.on("data", function (data) {
    console.log('\ndata: ', data.toString());
  });

  req.on("end", function () {
    console.log("请求处理结束, 开始响应 res.end()");
  });
});
