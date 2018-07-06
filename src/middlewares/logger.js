/**
 * desc :  用于记录post和get请求
 * @param  {object} req
 * @param  {object} res
 * @param  {default} next
 */
const logger = require('../utils/logger')
module.exports = function (app) {
    app.use(async (ctx, next) => {
        let req = ctx.request;
        switch (req.method) {
            case "POST":
                logger.info(`request_path:${req.path}, request_method:POST, request_params:${JSON.stringify(req.body)}`);
                break;
            case "GET":
                logger.info(`request_path:${req.path}, request_method:GET, request_params:${JSON.stringify(req.query)}`);
                break;
            default:
                logger.warn(`invalid request!`);
                next(new Error('invalid request!'));
                break;
        };
        await next()
    })
}