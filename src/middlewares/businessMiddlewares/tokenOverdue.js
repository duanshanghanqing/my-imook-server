module.exports = (app) => {
    //不需要拦截的
    let urls = ["/api/user/registerUserInfo","/api/user/login"];
    app.use(async (ctx, next) => {
        if(ctx.originalUrl.indexOf("/api") > -1){//说明是接口请求
            if (urls.indexOf(ctx.path) > -1) {
                await next();
            } else {
                if (ctx.session.Token == "" || ctx.session.Token == null || ctx.session.Token == undefined) {
                    ctx.body = ctx.state.config.nodeApiError({ msg: "token overdue!" });
                } else {
                    await next();
                }
            }
        }else{
            await next();
        }
    })
}