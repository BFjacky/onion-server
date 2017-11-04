const myRedis = require('../../redis/useRedis');
const pswd = "19951227";
module.exports = () => {
    //设置cookie过期时间为30天;
    const days = 30;
    //我的cookie名称
    const cookieName = 'Jonionid'
    //向浏览器返回新cookie，并将cookie存入数据库
    let newCookie = function (ctx) {
        console.log('生成新的有效cookie')
        let options = {
            maxAge: 1000 * 60 * 60 * 24 * days,
            // 加密之后还需解密吧
            //encrypt: true,
        };
        //随机生成cookie的字符串;
        let cookieStr = 'suijizifuchua123n';
        //向客户端返回新设置的cookie
        ctx.cookies.set(cookieName, cookieStr, options);
        console.log('设置了新cookie:', ctx.cookies.get(cookieName));
        //将cookie 存入redis数据库中;
        let user = {
            name: '陈云飞',
        };
        user = JSON.stringify(user);
        myRedis.set(cookieStr, user);
    }
    return async function cookieMiddle(ctx, next) {
        console.log(ctx.cookies.get(cookieName))
        //---设置可跨域访问----
        ctx.response.append("Access-Control-Allow-Origin", "http://localhost:8080");
        ctx.response.append("Access-Control-Allow-Credentials", "true");
        ctx.response.append("Access-Control-Allow-Methods", "*");
        //登陆界面
        if (ctx.request.query.islogin) {
            console.log('进入了登陆界面')
            //客户端无cookie 
            if (ctx.cookies.get(cookieName) === undefined) {
                console.log('客户端没有cookie');
                //判断登陆密码
                if (ctx.request.query.pswd === pswd) {
                    console.log('密码正确！')
                    //返回一个新的合法cookie
                    newCookie(ctx);
                    //响应登陆成功的消息
                    let newMessage = {
                        login: 'success',
                    }
                    ctx.newMessage = JSON.stringify(newMessage);

                }
                else {
                    console.log('密码错误');
                    let newMessage = {
                        login: 'fail',
                    }
                    ctx.newMessage = JSON.stringify(newMessage);

                }
                await next();
                return;
            }
            //客户端有cookie
            console.log('客户端有cookie')
            let clientCookie = ctx.cookies.get(cookieName);
            //从数据库中查询该cookie是否存在,并有对应的用户信息
            let queryRes = myRedis.get(clientCookie);
            //用户信息不存在或不合法
            if (queryRes == '' || queryRes == null || queryRes == undefined) {
                console.log('用户信息不存在')
                let newMessage = {
                    login: 'fail',
                }
                ctx.newMessage = JSON.stringify(newMessage);
                await next();
                return;
            }
            //用户信息合理，可登录
            console.log('用户信息合法!');
            let newMessage = {
                login: 'success',
            }
            ctx.newMessage = JSON.stringify(newMessage);
            await next();
            return;
        }
        //非登陆页面无cookie
        if (ctx.cookies.get(cookieName) === undefined) {
            let newMessage = {
                login: 'fail',
            }
            ctx.newMessage = JSON.stringify(newMessage);
            await next();
            return;
        }
        //非登陆页面有cookie
        let clientCookie = ctx.cookies.get(cookieName);
        //从数据库中查询该cookie是否存在,并有对应的用户信息
        let queryRes = myRedis.get(clientCookie);
        //用户信息不存在或不合法
        if (queryRes == '' || queryRes == null || queryRes == undefined) {
            console.log('用户信息不存在')
            let newMessage = {
                login: 'fail',
            }
            ctx.newMessage = JSON.stringify(newMessage);
            await next();
            return;
        }
        //用户信息合理，可登录
        console.log('用户信息合法!');
        let newMessage = {
            login: 'success',
        }
        ctx.newMessage = JSON.stringify(newMessage);
        await next();
        return;
    }
}