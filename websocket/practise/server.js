const { Server } = require('./ws.js');

const wsServer = new Server({ port: 8888 });
wsServer.on('connection', (socket) => {
    console.log('client connected');
    socket.on('message', (message) => {
        console.log('received:', message.toString());
        socket.send(`server received: ${message}`);
    });
})