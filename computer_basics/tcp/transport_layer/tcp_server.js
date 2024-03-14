let net = require('net'); // TCP 服务器
let server = net.createServer(function (socket) {
    // 监听客户端接收数据
    socket.on('data', function(data) {
        console.log('from client', data.toString());
        socket.write(data); // 向客户端发送数据
    });
    // 监听客户端断开连接
    socket.on('end', function(data) {
        console.log('connect end', data)
    });
});

server.listen(8000, () => {
    
});
