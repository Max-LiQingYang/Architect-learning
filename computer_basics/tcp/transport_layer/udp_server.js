const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

socket.on('message', function(msg, remoteInfo) {
    console.log(msg.toString());
    console.log(remoteInfo); // 远程客户端信息

    socket.send(msg, 0, msg.length, remoteInfo.port, remoteInfo.address);

    // 广播
    socket.setBroadcast(true);
    // 发送给所有主机
    socket.send(Buffer.from(msg), 0, msg.length, remoteInfo.port, '192.168.0.255')
});

socket.bind(41234, 'localhost');