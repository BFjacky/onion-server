//尝试获取成绩页面，并验证cookie是否有效
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const http = require('http');
const getScoreFromData = require('./getScoreFromData');
var iconv = require('iconv-lite');
const options = {
    hostname: '202.118.167.86',
    port: 9001,
    path: '/gradeLnAllAction.do?type=ln&oper=qbinfo&lnxndm=2016-2017å­¦å¹´æ¥(ä¸¤å­¦æ)',
    method: 'GET',
    headers: { 
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN',
        'Host': '202.118.167.86:9001',
        'Referer': 'http://202.118.167.86:9001/gradeLnAllAction.do?type=ln&oper=qb',
        'Cookie': ''
    }
};

//请求成绩页面的html 文件内容
module.exports = function cookieCheck(SchoolCookie) {
    let p = new Promise(function (resolve, reject) {
        
        options.headers.Cookie = SchoolCookie;
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
                //将获得的字符串解码成utf8
                let decodeHtmlData = iconv.decode(data, 'gbk');

                let flag = decodeHtmlData.indexOf('(两学期)" /></a>')
                
                resolve(flag)

            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(reason);
        });
        req.end();
    })

    return p;
}