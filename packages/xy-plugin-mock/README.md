# mock

## 简介
mock 插件是为项目提供 mock 数据的工具，支持 [Mock.js](https://github.com/nuysoft/Mock/wiki) 语法。此插件可选，未集成到 Cli 中。

## 安装
如果想使用 xy-plugin-mock 插件，首先需要安装 @vue/cli

```shell
yarn add @xiyun/cli
```
再执行
```shell
xy add @xiyun/xy-plugin-mock
```

## 示例
命令如下：
```shell
xy mock [options]
```
扫描所有 mock 数据文件(默认)，默认运行监听模式，mock 文件变化无需重新执行︰
```shell
xy mock
```
mock 数据文件格式如下︰
```shell
module.exports = {
  '/api/a': { a: 1 }, // 默认 get 请求
  'POST /api/a': { a: 1 },
  '/api/users/:userId': { a: 1 },
  '/api/b': (req, res) => {
    res.end(JSON.stringify({ b: 1 }));
  },
   "/random": function () {
    return Math.random() < 0.1 ? 1 : 0;
  },
  '/api/w':  {
    'list|100': [{ 'value|1-100': 50, 'type|0-2': 1 }], // 支持 Mock.js 语法
  },
};
```
仅扫描符合指定用模板或文件名的 mock 数据文件︰
```shell
xy mock --path="**/__mock__/a.js"
```
