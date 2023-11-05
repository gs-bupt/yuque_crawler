# yuque_crawler

语雀文档爬取工具，输入语雀book文档链接，可以将book内的文档以html格式的方式进行抓取

## 使用方法

1. 安装依赖

```bash
npm install
```

2. 配置

创建一个config.js文件，内容如下：

```javascript
module.exports = {
    url: '',
    cookie: '', 
    userAgent: ''  
}
```

url为语雀文档的url，cookie为登录后的cookie，userAgent为浏览器的userAgent

3. 运行

```bash
node crawler.js
```
