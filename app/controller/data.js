'use strict';
const course_cyf = require('../../mongo/course_cyf.js')
const course_dyy = require('../../mongo/course_dyy.js')
const home = require('./home');
const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const whetherMongo = require('../../mongo/whether.js');
module.exports = app => {
  class DataController extends app.Controller {
    async DyySche() {
      this.ctx.response.append("Access-Control-Allow-Origin", "*");
      this.ctx.response.append("Access-Control-Allow-Credentials", "true");
      this.ctx.response.append("Access-Control-Allow-Methods", "*");
      this.ctx.body = course_dyy;
    }
    async CyfSche() {
      this.ctx.response.append("Access-Control-Allow-Origin", "*");
      this.ctx.response.append("Access-Control-Allow-Credentials", "true");
      this.ctx.response.append("Access-Control-Allow-Methods", "*");
      this.ctx.body = course_cyf;
    }
    //获得某一个城市的天气信息
    async whether() {
      //---设置可跨域访问----
      this.ctx.response.append("Access-Control-Allow-Origin", "*");
      this.ctx.response.append("Access-Control-Allow-Credentials", "true");
      this.ctx.response.append("Access-Control-Allow-Methods", "*");

      //设置cityid，以后一传参数的方式来运行
      let cityid = "166";
      //设置过期时间
      const timeOut = 15;

      //根据cityid查询数据库
      let getByCityid = function (cityid) {
        return new Promise((resolve, reject) => {
          whetherMongo.find({ cityid: cityid }, (err, res) => {
            if (err) {
              reject(err);
            } else {
              //传出 变更时间
              resolve(res);
            }
          })
        })
      }
      //在数据库中查询 该cityid 的信息变更时间
      let result = await getByCityid(cityid)
      if (result[0] !== undefined) {
        let begin = result[0].changetime;
        let now = new Date();
        now = now.getTime();
        let intervalTime = now - begin;
        if (intervalTime <= 1000 * 60 * timeOut) {
          //如果小于15分钟 不更新新数据 直接返回旧数据
          console.log('不需要更新');
          result = JSON.stringify(result);
          this.ctx.body = result;
          return;
        }
      }
      //根据api获取天气信息
      let getWhether = function () {
        return new Promise((resolve, reject) => {
          //---设置请求条件---
          let appCode = "3cde040faf824d8cbf12312bceaa484d";
          let options = {
            hostname: 'jisutianqi.market.alicloudapi.com',
            port: 80,
            path: '/weather/query?cityid=' + cityid,
            method: 'GET',
            headers: {
              'Authorization': "APPCODE " + appCode
            }
          };
          //---------------------

          const req = http.request(options, (res) => {
            var chunks = [];
            let size = 0;
            res.on('data', (chunk) => {
              chunks.push(chunk);
              size += chunk.length;
            });
            res.on('end', () => {
              let data = new Buffer(size);
              data = Buffer.concat(chunks, size);
              data = data.toString();
              let whetherObj = JSON.parse(data);
              resolve(whetherObj);
            });
          });
          req.on('error', (e) => {
            reject(e);
          });
          req.end();
        })
      }

      //获取天气信息并赋值给whetherObj
      let whetherObj = await getWhether();

      //获取当前时间(毫秒数)
      let date = new Date();
      let changetime = date.getTime();
      whetherObj.result.changetime = changetime;

      //插入数据库--------
      let whereObj = { cityid: whetherObj.result.cityid };
      let updateObj = whetherObj.result;
      let cond = { upsert: true, multi: true };
      whetherMongo.update(whereObj, updateObj, cond, function (err, res) {
        if (err) {
          console.log('ERROR:', err);
        } else {
          console.log(res);
        }
      })
      //----------------------

      this.ctx.body = JSON.stringify(whetherObj.result);
    }
  }
  return DataController;
};
