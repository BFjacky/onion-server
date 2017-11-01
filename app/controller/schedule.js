'use strict';
const fs = require('fs');
const path = require('path');
module.exports = app => {
    class ScheController extends app.Controller {
        async index() {
            let res = fs.readFileSync(path.join(__dirname,'../public','/index.html'));
            this.ctx.response.append("content-type", "text/html");
            this.ctx.response.body = res;
        }
    }
    return ScheController;
};
