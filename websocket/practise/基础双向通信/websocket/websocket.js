import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();

// 因为 ws 是依赖 http 的, 所以一开始要传入 http
const server = http.createServer(app); // http 服务
const wss = new WebSocketServer({ server }); // 创建 ws 服务

wss.on('connection', (ws) => {
    ws.send('hello')

    ws.on('message', (message) => {
        console.log('received: %s', message);
    });
});

server.listen(3000, () => {
    console.log('websocket server started on port 3000');
});