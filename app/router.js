'use strict';
module.exports = app => {
  app.get('/', 'schedule.index');
  app.get('/DyySche', 'data.DyySche');
  app.get('/CyfSche', 'data.CyfSche');
  app.get('/whether', 'data.whether');
  app.get('/login', 'login.check');
};
