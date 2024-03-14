let net = require('net');
let socket = net.Socket();
socket.connect(8000, 'localhost');

socket.on('connect', function(data) {
    socket.write('hello');
});

socket.on('data', function(data) {
    console.log('from server', data.toString());
});
