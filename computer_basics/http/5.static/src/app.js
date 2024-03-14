// 要创建一个服务器
import config from "./config.js";
import http from "http";
import chalk from "chalk";
import debug from "debug"; // 这是一个在控制台输出的模块
import { promisify, inspect } from "util";
import fs from "fs";
import url from "url";
import mime from "mime";
import path from "path";
import handlebars from "handlebars";
import zlib from "zlib";
import { fileURLToPath } from "url";
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const filename = fileURLToPath(import.meta.url); // 获取当前模块的文件路径
const dirname = path.dirname(filename); // 获取当前模块的文件夹路径

// 编译模板, 得到一个渲染的方法, 然后传入数据就可以得到渲染后的 HTML 了
function list() {
  let tmpl = fs.readFileSync(
    path.resolve(dirname, "template", "list.html"),
    "utf8"
  );
  return handlebars.compile(tmpl);
}

// 每个 debug 实例都有一个名字, 是否在控制台打印取决于环境变量中 DEBUG 的值是否等于 debug函数入参
// 在控制台设置环境变量 set DEBUG=static:app
// 如果想打印设置名称下所有的log, 可以设置环境变量 DEBUG=static:*
const Debug = debug("static:app");

// 在代码内部是可以读到环境变量的值, 当然也可以写入环境变量值
// console.log(process.env);
// process.env.DEBUG = 'static: *';

/**
 * 1. 显示目录下面的文件列表和返回内容
 * 2. 实现压缩的功能
 * 3. 缓存
 */
class Server {
  constructor(argv) {
    this.list = list();
    this.config = Object.assign({}, config, argv);
  }

  start() {
    const server = http.createServer();
    server.on("request", this.request.bind(this));
    server.listen(this.config.port, () => {
      const url = `http://${this.config.host}: ${this.config.port}`;
      Debug(`server started as ${chalk.green(url)}`);

      // Debug(`server started as ${url}`);
    });
  }

  // 静态文件服务器
  async request(req, res) {
    // 先取到客户端想要访问的文件或文件路径
    let { pathname } = url.parse(req.url);
    if (pathname == "/favicon.ico") return this.sendError(req, res);

    const filepath = path.join(this.config.root, pathname);
    try {
      const statObj = await stat(filepath);

      if (statObj.isDirectory()) {
        // 如果是目录的话, 应该显示目录下面的文件列表
        let files = await readdir(filepath);
        files = files.map((file) => ({
          name: file,
          url: path.join(pathname, file),
        }));

        const html = this.list({
          title: pathname,
          files,
        });

        res.setHeader("Content-Type", "text/html");
        res.end(html);
      } else {
        this.sendFile(req, res, filepath, statObj);
      }
    } catch (e) {
      console.log("e", e);
      Debug(inspect()); // inspect 把一个对象转成字符串
      this.sendError(req, res);
    }
  }

  sendFile(req, res, filepath, statObj) {
    if (this.handleCache(req, res, filepath, statObj)) {
      // 走缓存
      return;
    }
    res.setHeader("Content-Type", mime.getType(filepath) + ';charset=utf-8'); // 通过文件后缀拿到 content-type

    // 压缩
    let encoding = this.getEncoding(req, res);
    if (encoding) {
      fs.createReadStream(filepath).pipe(encoding).pipe(res);
    } else {
      fs.createReadStream(filepath).pipe(res);
    }
  }

  // 获取请求支持的压缩类型
  getEncoding(req, res) {
    let acceptEncoding = req.headers["accept-encoding"];

    if (/\bgzip\b/i.test(acceptEncoding)) {
      res.setHeader('Content-Encoding', 'gzip');
      return zlib.createGzip();
    } else if (/\bdeflate\b/i.test(acceptEncoding)) {
      res.setHeader('Content-Encoding', 'deflate');
      return zlib.createDeflate();
    } else {
      return null;
    }
  }

  // 缓存
  handleCache(req, res, filepath, statObj) {
    let ifModifiedSince = req.headers["if-modified-since"];
    let ifNoneMatch = req.headers["if-none-match"];
    res.setHeader("Cache-Control", "prevate, max-age=30");
    res.setHeader("Expires", new Date(Date.now() + 30 * 1000).toGMTString());
    let etag = statObj.size;
    let lastModified = statObj.ctime.toGMTString();

    res.setHeader("ETag", etag);
    res.setHeader("Last-Modified", lastModified);

    if (ifNoneMatch && ifNoneMatch != etag) {
      return false;
    }

    if (ifModifiedSince && ifModifiedSince != lastModified) {
      return false;
    }

    if (ifNoneMatch || ifModifiedSince) {
      res.writeHead(304);
      res.end();
      return true;
    }

    return false;
  }

  sendError(req, res) {
    res.statusCode = 500;
    res.end("there is something wrong in the server~");
  }
}

// const server = new Server();
// server.start(); // 启动服务
export default Server;
