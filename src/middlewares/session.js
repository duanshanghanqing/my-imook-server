
const session = require('koa-session')
module.exports = function (app) {
  app.keys = ['some secret hurr'];
  let CONFIG = {
    key: 'koa:sess',  // (string) cookie key (default is koa:sess) ->（字符串类型）cookie 的键（默认是 koa:sess）
    maxAge: 86400000, // (number) maxAge in ms (default is 1 days) -> (数值类型) 最长时间在秒（默认一天）
    overwrite: true,  // (boolean) can overwrite or not (default true) ->(布尔类型) 可以覆盖或不可以，（默认覆盖）
    httpOnly: true,   // (boolean) httpOnly or not (default true) (布尔类型) 只使用 http ，或不不适用http。（默认使用）
    signed: true,     // (boolean) signed or not (default true)
  };
  app.use(session(CONFIG, app));
  // ctx.session.views = 0;//设置值
  // ctx.session.views //获取值
}


/*
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const redisConfig = require('../config/redis');
module.exports = function (app) {
  app.keys = ['keys', 'keykeys'];
  app.use(session({
    store: redisStore(redisConfig)
  }));
}
*/