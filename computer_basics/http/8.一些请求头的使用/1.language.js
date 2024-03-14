const http = require('http');
const server = http.createServer(request).listen(8000);

const lanPack = {
    en: {
        title: 'welcome',
    },
    zh: {
        title: '欢迎',
    },
    default: {
        title: 'default welcome'
    }
};

function request(req, res) {
    // 实现服务器和客户端你的协议，客户端想要且服务端有的语言
    // Accept-Language: zh-Cn, zh;q=0.9;en;q=0.8
    let acceptLanguage = req.headers['accept-language'];
    if (acceptLanguage) {
        const lans = acceptLanguage.split(',').map(function (item) {
            let values = item.split(';');
            let name = values[0];
            let q = values[1] ? parseFloat(values[1]) : 1;
            return {
                name, q
            };
        }).sort((a, b) => b.q - a.q); // 拿到 language

        let lan = lanPack.default; // 默认语言
        for (let i = 0; i < lans.length; i++) {
            // 如果此语言在语言包里有，则使用此语言
            if (lanPack[lans[i].name]) {
                lan = lans[i].name;
                break
            }
        }
        
        res.end(lanPack[lan].title);
    }
}

