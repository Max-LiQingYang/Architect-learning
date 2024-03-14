const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

socket.on('message', function(msg, rinfo) {
    console.log(msg.toString());
    console.log(rinfo);
});

socket.send(Buffer.from('你好世界'), 0, 5, 41234, 'localhost', function(err, bytes) {
    console.log('发送了%d字节', bytes);
});

socket.on('error', function(err) {
    console.error(err);
})