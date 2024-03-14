const dgram = require('dgram');
const client = dgram.createSocket('udp4');

client.on('listening', function() {
  client.addMembership('230.185.192.108');
});

client.on('message', function(message, remote) {

});

client.bind(8000, '192.168.1.103');
