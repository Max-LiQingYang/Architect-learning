/**
 * 1. 写爬虫
 * 2. node 做中间层
 */
let http = require('http');
// 头分为四种 通用头/请求头/相应头/实体头
let options = {
    host: 'localhost',
    prot: 8000,
    method: 'GET',
    header: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
}

// 请求并没有真正发出, req 也是一个流对象, 它是一个可写流
let req = http.request(options);

// 当服务器端把请求体发回来时候, 或者客户端接收到服务端响应的时候触发
req.on('response', function(err, res) {
    console.log(res.statusCode);
    console.log(res.headers);
    
    const result = [];
    res.on('data', function(data) {
        result.push(data);
    });

    res.on('end', function() {
        const str = Buffer.concat(result);
        console.log(str);
    });
});

// write 是向请求体里写数据
req.write('name=zfpx');
// 结束写入请求体, 只有在调用 end 的时候才会真正向服务器发送请求
req.end();
