# yargs
yargs模块能够解决如何处理命令行参数。

内部对 process.argv 进行处理

## 读取命令行参数
```
const yargs = require('yargs');
const argv = yargs.argv;
```


## 指定别名
```
const argv = require('yargs')
    .alias('n', 'name');
    .argv
```

## 下划线属性
argv对象有一个下划线属性，可以获取非连词线开头的参数

```
console.log(argv._);
```


## 命令行参数的配置
- demand 是否必选
- default 默认值
- describe 提示

```
#!/usr/bin/env node
let argv = require('yargs')
  .demand(['n'])
  .default({n:'zfpx'})
  .describe({n:"你的名字"})
  .argv;
console.log('hello ',argv.n); 
```

option方法允许将所有的配置写入配置对象

```
#!/usr/bin/env node
let argv = require('yargs')
.option('n',{
    alias:'name',
    demand:true,
    default:'zfpx',
    describe:'请输入你的名字',
    type:'string',
    boolean:true
}).argv
console.log('hello',argv.n);
```

有时候，某些参数不需要，只起到开关作用。可以用boolean指定这些参数返回布尔值


## 帮助信息
yargs模块提供以下方法，生成帮助信息

usage 用法格式
example 提供例子
help 显示帮助信息
epilog 出现在帮助信息的结尾


## #!/usr/bin/env node
表示这是一个可执行命令, 告诉操作系统将使用 node.exe 执行
