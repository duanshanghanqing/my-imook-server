/**
 * desc:加载全局中间件
 */
//合并请求参数
const reqParams = require('./reqParams');
//session回话
const session = require('./session');
//jsonp跨域
const jsonp = require('./jsonp');
//路由注册
const routerRegister = require('./routerRegister');
//日志记录
const logger = require('./logger');

//业务中间件
const businessMiddlewares = require('./businessMiddlewares/index');
module.exports = function (app) {
    session(app);
    logger(app);
    jsonp(app);
    reqParams(app);
    businessMiddlewares(app);
    routerRegister(app);
}