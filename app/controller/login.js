'use strict';

module.exports = app => {
  class LoginController extends app.Controller {
    async check() {
      console.log(this.ctx.newMessage);
      this.ctx.body = this.ctx.newMessage;
    }
  }
  return LoginController;
};
