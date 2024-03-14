const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('listening', function() {
    server.setMulticastTTL(128); // 设置多播TTL
    server.setMulticastLoopback(true); // 设置多播环回
    server.addMembership('230.185.192.108'); // 加入多播组
});

setInterval(broadcast, 1000);

function broadcast() {
    const buffer = Buffer.from(new Date().toLocaleDateString());
    server.send(buffer, 0, buffer.length, 8000, "230.185.192.108");
}
