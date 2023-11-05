const cheerio = require('cheerio');
const fs = require('fs');


// 查找一个html的所有标签，包含标签名和属性
function parse_html(html, file) {
    const $ = cheerio.load(html);
    var set = new Set()
    // 使用 `*` 通配符选择所有标签
    $('*').each((index, element) => {
      // 获取标签名
      const tagName = element.name;
      // 获取标签的所有属性
      const attributes = element.attribs;
      var tag = file+'<' + tagName + ' '
      for (const attributeName in attributes) {
          // 如果attributeName等于value或者包含'id'字段，就跳过
          if (attributeName == 'value' || attributeName.includes('id'))
              continue
          tag += attributeName + '="' + attributes[attributeName] + '" '
      }
      tag += '>'
      set.add(tag)
    });
    return set
}

// 打开./pages/123.html文件, 解析html
function parse_page(file) {
    const html = fs.readFileSync(file, 'utf-8');
    const data = parse_html(html, file);
    return data;
}

// 检查pages文件夹下的所有html文件，将所有的card标签保存到set中
var new_set = new Set()
fs.readdirSync('./pages').forEach(file => {
    // 判断是否是html文件
    if (file.endsWith('.html')) {
        var set = parse_page('./pages/' + file)
        // console.log(set)
        set.forEach((item) => {
            if(item.includes('card'))
                new_set.add(item)
        })
    }
})
console.log(new_set)

