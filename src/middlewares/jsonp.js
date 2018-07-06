const jsonp = require('koa-jsonp')
module.exports = function (app) {
    // 使用中间件
    app.use(jsonp())
    /*
    //使用
    app.use( async ( ctx ) => {
        let returnData = {
            success: true,
            data: {
            text: 'this is a jsonp api',
            time: new Date().getTime(),
            }
        }
        // 直接输出JSON
        ctx.body = returnData
    })
    */
}