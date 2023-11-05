const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const hljs = require('highlight.js');
const config = require('./config');

const url = config.url
const headers = {
    'Cookie': config.cookie,
    'User-Agent': config.userAgent,
}
var data = {}
var pages = []

async function get_urls() {
    await axios.get(url,{
        headers: headers
    }).then((response) => {
        // 使用正则表达式匹配前缀为window.appData = JSON.parse(decodeURIComponent("后缀为"))的字符串
        const regex = /window\.appData\s*=\s*JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/;
        const result = response.data.match(regex)
        // console.log(result)
        // 将匹配到的字符串转换为json对象
        const json_obj = JSON.parse(decodeURIComponent(result[1]))
        data['id'] = json_obj.book.id
        data['slug'] = json_obj.book.slug
        data['name'] = json_obj.book.name
        // 浅拷贝json_obj.book.toc到data['toc']
        data['toc'] = [...json_obj.book.toc]
    })
}

function get_pages() {
    //如果pages文件夹不存在，就创建子文件夹pages
    if (!fs.existsSync('pages')){
        fs.mkdir('pages', (err) => {
            if (err) throw err;
            console.log('The pages folder has been created!');
        })
    }
    // 在pages文件夹下创建一个css文件夹，用于存放css文件
    if (!fs.existsSync('pages/css')){
        fs.mkdir('pages/css', (err) => {
            if (err) throw err;
            console.log('The pages/css folder has been created!');
        })
    }
    // 将github.css复制到pages/css文件夹下
    fs.copyFile('./css/github.css', './pages/css/github.css', (err) => {
        if (err) throw err;
        console.log('The github.css has been copied!');
    })
    data['toc'].forEach((item) => {
        if (item.type == 'DOC') {
            // console.log(item.url)
            axios.get('https://www.yuque.com/api/docs/' + item.url, {
                headers: headers,
                params: {
                    'include_contributors': false,
                    'include_like': false,
                    'include_hits': false,
                    'merge_dynamic_data': false,
                    'book_id': data['id'],
                }
            })
            .then((response) => {
                parse_page(response.data.data)
            })
        }
    })    
}

function parse_page(data) {
    // 解析data.content，将card标签转换为html可以识别的标签
    const $ = cheerio.load(data.content);
    // 添加大标题
    $('head').append('<title>' + data.title + '</title>')
    // 添加css样式
    $('head').append('<link rel="stylesheet" href="./css/github.css">')
    // 添加<style>标签
    $('head').append('<style> a{color:#1abc9c;text-decoration:none;background-color:transparent;-webkit-text-decoration-skip:objects;}')
    // 添加<h1>标签
    $('body').prepend('<h1>' + data.title + '</h1>')
    // 修改blockquote标签的样式
    $('blockquote').attr('style', "font-style: italic;font-size: 1.2em;color: #666;border-left: 5px solid #ddd; padding-left: 20px;margin: 30px 0;")
    // 对card标签进行解析
    $('card').each((index, element) => {
        const attributes = element.attribs;
        // 如果attributes['value']存在，就将attributes['value']转换为json对象
        var json_obj = {}
        if (attributes['value']) {
            // 如果存在前缀data:，就将其去除
            if (attributes['value'].includes('data:'))
                json_obj = JSON.parse(decodeURIComponent(attributes['value'].substring(5)))
            else
                json_obj = JSON.parse(decodeURIComponent(attributes['value']))
        }
        var tag = ''
        switch (attributes['name']) {
            case 'board':
                json_obj.width = json_obj.viewportSetting.width
                json_obj.height = json_obj.viewportSetting.height
            case 'image':
                tag += '<img src="' + json_obj.src + '" width="'+ json_obj.width + '" height="' + json_obj.height + '"' + '>'
                break
            case 'codeblock':
                const highlighted = hljs.highlightAuto(json_obj.code)
                tag += '<pre><code class="hljs language-' + highlighted.language + '">' + highlighted.value + '</code></pre>'
                break
            case 'yuque':
            case 'bookmarkInline':
                // TODO 添加一个desc
            case 'yuqueinline':
                // TODO 跳转到本地对应的页面
                json_obj.text = json_obj.detail.title
            case 'bookmarklink':
                tag += '<a href="' + json_obj.src + '">' + json_obj.text + '</a>'
                break
            case 'hr':
                tag += '<hr style="height: 2px;border-width: 0;background-color: #333;margin: 20px 0;">'
                break
            case 'video':
                // 使用文本说明video的内容
                tag += '<p>' + json_obj.name + '</p>'
                break
        }
        $(element).replaceWith(tag)
    });

    // 将解析后的html保存到pages文件夹下，如果文件存在就覆盖
    // 对data.title进行处理，去除特殊字符，使其可以作为文件名
    data.title = data.title.replace(/[\\/:*?"<>|]/g, '')
    fs.writeFile('./pages/' + data.title + '.html', $.html(), (err) => {
         if (err) throw err;
         console.log('The file has been saved!');
    })
}




// 等待get_urls(url)执行完毕后再执行下面的代码
get_urls(url).then(() => {
    get_pages()
})
