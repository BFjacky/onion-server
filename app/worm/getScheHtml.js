const getScheduleFromData = require('./getScheduleFromData.js');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const http = require('http');
var iconv = require('iconv-lite');
const options = {
    hostname: '202.118.167.86',
    port: 9001,
    path: '/xkAction.do?actionType=6',
    method: 'GET',
    headers: {

        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN',
        'Host': '202.118.167.86:9001',
        'Referer': 'http://202.118.167.86:9001/menu/menu.jsp',
        'Cookie': ''
    }
};

module.exports =function runGetSchedule(neauCookie) {
    let p = new Promise(function (resolve, reject) {
        //请求Schedule html文件内容
        options.headers.Cookie = neauCookie;
        const req = http.request(options, (res) => {
            var chunks = [];
            let size = 0;
            res.on('data', (chunk) => {
                chunks.push(chunk);
                size += chunk.length;
            });
            res.on('end', () => {
                data = new Buffer(size);
                data = Buffer.concat(chunks, size);
                //解码为utf8
                let decodeHtmlData = iconv.decode(data, 'gbk');
                
                let schedule = getScheduleFromData(decodeHtmlData)
                resolve(schedule);

            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(reason,'失败了');
        });
        req.end();

    })

    return p;
}

