const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const http = require('http');
//引入解码库
var iconv = require('iconv-lite');
let postData;
let prePostData = {
    zjh: '',
    mm: '',
    v_yzm: '',
    zjh1: '',
    tips: '',
    lx: '',
    evalue: '',
    eflag: '',
    fs: '',
    dzslh: '',
};
const options = {
    hostname: '202.118.167.86',
    port: 9001,
    path: '/loginAction.do',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': '',
        'Cookie': '',
    }
};
module.exports = function tryLogin(obj) {

    let p = new Promise(function (resolve, reject) {
        //接受到obj之后设置一下请求信息-------------------------------------
        prePostData.zjh = obj.stuId;
        prePostData.mm = obj.password;
        prePostData.v_yzm = obj.captcha;
        postData = querystring.stringify(prePostData);
        options.headers.Cookie = obj.cookie;
        options.headers['Content-Length'] = Buffer.byteLength(postData);
        //----------------------------------------------------------------

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
                let decodeHtmlData = iconv.decode(data, 'gbk');

                //判断是否进入到教务处系统
                let flag = decodeHtmlData.indexOf('<title>学分制综合教务</title>');

                if (flag != -1) {
                    //登陆成功执行标记fullfilled
                    resolve('nothing')
                }
                else {
                  
                    reject('请求登陆失败了', 'nothing');
                }
            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });

        // 写入数据到请求主体
        req.write(postData);
        req.end();
    })
    return p;
}