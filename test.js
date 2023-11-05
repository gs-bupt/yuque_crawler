const hljs = require('highlight.js');

const code = `function hello() {
  console.log('Hello World!'); 
}`;

// 获取高亮的HTML
const highlighted = hljs.highlightAuto(code)
console.log(highlighted)
 

// 构建完整的HTML
const html = `
    <link rel="stylesheet" href="./css/github.css">
    <pre><code class="hljs language-js">${highlighted.value}</code></pre>
`;

// 输出HTML字符串
console.log(html);