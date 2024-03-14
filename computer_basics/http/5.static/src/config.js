import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url); // 获取当前模块的文件路径
const dirname = path.dirname(filename); // 获取当前模块的文件夹路径

const config = {
    host: "localhost",
    port: 8000,
    root: path.resolve(dirname, '..', 'public'), // 配置静态文件根目录
};

export default config;

// module.exports = {
//   host: "localhost",
//   port: 8000,
//   root: process.cwd(), // 配置静态文件根目录
// };
