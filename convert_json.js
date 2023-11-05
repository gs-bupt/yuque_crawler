const fs = require('fs');
value="data:%7B%22status%22%3A%22done%22%2C%22name%22%3A%2212306%E5%88%97%E8%BD%A6%E6%9F%A5%E8%AF%A2%E8%AF%B7%E6%B1%82%E7%A4%BA%E6%84%8F.mov%22%2C%22size%22%3A14314914%2C%22taskId%22%3A%22ub15ea732-e332-4e98-80cf-0e29d7aae9b%22%2C%22taskType%22%3A%22upload%22%2C%22url%22%3Anull%2C%22cover%22%3Anull%2C%22videoId%22%3A%22inputs%2Fprod%2Fyuque%2F2023%2F331027%2Fmov%2F1693638265964-7f9a01eb-f260-4410-a8b7-6ca8f42d4a5d.mov%22%2C%22download%22%3Afalse%2C%22__spacing%22%3A%22both%22%2C%22id%22%3A%22q0g23%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%7D"

// 将decodeURIComponent(value)的结果保存为文件
fs.writeFileSync('result.json', decodeURIComponent(value), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
})

