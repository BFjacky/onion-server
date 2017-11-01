/*
    请求得到一个 cookie 和 验证码 
*/

const http = require('http');
const fs = require('fs');
const path = require('path');

const options = {
    hostname: '202.118.167.86',
    port: 9001,
    path: '/',
    method: 'get',
}

module.exports = function runRequestLoginCond() {
    let p = new Promise(function (resolve, reject) {
        //请求登录页面
        const req = http.request(options, (res) => {
            //获得cookie
            const cookie = res.headers['set-cookie'][0].split(';')[0];
            const imageOptions = {
                hostname: '202.118.167.86',
                port: 9001,
                path: '/validateCodeAction.do',
                method: 'get',
                headers: {
                    Cookie: cookie,
                }
            };


            //请求与该cookie 绑定的 captcha
            const imageReq = http.request(imageOptions, (imageRes) => {
                let chunks = [];
                let length = 0;
                imageRes.on('data', (chunk) => {
                    chunks.push(chunk);
                    length += chunk.length;
                });
                imageRes.on('end', () => {
                    data = new Buffer(length);
                    data = Buffer.concat(chunks, length)
                    //fs.writeFileSync(path.join(__dirname, '../', 'public', 'js', '/captcha.jpg'), data);
                    /*
                    返回结果数据
                        result[0] : cookie
                        result[1] : captcha
                    */
                    let result = [];
                    result[0] = cookie;
                    result[1] = data;
                    resolve(result);
                });
            });
            imageReq.end();
        });
        req.end();
    })
    return p;
}