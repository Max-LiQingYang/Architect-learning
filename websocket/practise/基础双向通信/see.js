import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // 解决跨域问题

app.get('/clock', function(req, res) {
    res.setHeader('Content-Type', 'text/event-stream'); // 表明服务端传递的是一个事件流
    setInterval(() => {
        // 和 http 协议一样 按照行的方式传输 (\n)
        res.write(`data:hello\nnumber:123123\nkey:value`);
    }, 1000);

    // res.write 方法不会结束本次的响应
});


app.listen(3000, function() {
    console.log('Server is running on port 3000');
})
