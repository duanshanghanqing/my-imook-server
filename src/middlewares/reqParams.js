//合并请求参数，解决xxs攻击
const xss = require('xss')
//挂载全局应用配置
const config = require('../config/index')

module.exports = function (app) {
    app.use(async (ctx, next) => {
        let { request, method } = ctx;
        let params = {};
        Object.assign(params,request.body || {},request.query || {});
        let reqParams = {}
        Object.keys(params).forEach(function (key) {
            //只有值时字符串类型时，做xss处理
            if (typeof params[key] === "string") {
                reqParams[key] = xss(params[key]);
            } else {
                reqParams[key] = params[key];
            }
        })
        ctx.state.reqParams = reqParams;
        ctx.state.config = config;

        await next()
    })
}