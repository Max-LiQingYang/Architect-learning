import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // 解决跨域问题

app.get('/clock', function(req, res) {
    res.send(new Date().toLocaleString());

    // res.write 方法不会结束本次的响应
});


app.listen(3000, function() {
    console.log('Server is running on port 3000');
})
