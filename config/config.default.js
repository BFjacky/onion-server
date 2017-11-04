'use strict';
const path = require('path');
const cookie = require('../app/middleware/cookie.js');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1508735418104_3269';

  // add your config here
  config.middleware = ['cookie'];

  //add static file server
  config.static = {
    prefix: "/static/",
    dir: path.join(appInfo.baseDir, 'app/static'),
    dynamic: true
  }
  return config;
};
