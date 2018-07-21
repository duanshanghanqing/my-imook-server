const router = require('koa-router')();
const User = require('../../service/User');
router.get('/test',async function (ctx, next) {
  let returnData = ctx.state.config.initData();
  let { reqParams } = ctx.state;
  console.log(reqParams);
  ctx.body = returnData;
}).post('/test',async function (ctx, next) {
  let returnData = ctx.state.config.initData();
  let { reqParams } = ctx.state;
  console.log(reqParams);
  ctx.body = returnData;
}).put('/test',async function (ctx, next) {
  let returnData = ctx.state.config.initData();
  let { reqParams } = ctx.state;
  console.log(reqParams);
  ctx.body = returnData;
})

//登录
router.post('/login',async (ctx, next) => {
  let returnData = ctx.state.config.initData();
  let { reqParams } = ctx.state;
  try{
    //查询数据库
    let LoginRes = await User.Login(reqParams);
    if(Array.isArray(LoginRes) && LoginRes.length > 0){
      returnData.data = LoginRes[0];
      delete returnData.data.password;
      //生成Token保存到session中
      ctx.session.Token = (returnData.data.name || returnData.data.email || returnData.data.phone).charCodeAt(0).toString(16) + new Date()*1;
      returnData.data.Token = ctx.session.Token;
    }else{
      returnData = ctx.state.config.nodeApiError({msg:"登录失败!"});
    }
  }catch(e){
    console.error("User.Login error");
    returnData = ctx.state.config.nodeApiError();
  }

  ctx.body = returnData;
});

//注册
router.post('/registerUserInfo', async (ctx, next) => {
  let returnData = ctx.state.config.initData();
  let { reqParams } = ctx.state;
  //用户名唯一,检查用户名是否注册
  try {
     let Res = await User.isUser(reqParams);
     if(Res.length > 0){
        return ctx.body = ctx.state.config.nodeApiError({msg:"用户名已注册!"});
     }
  } catch (e) {
    console.error("User.isUser error");
    return ctx.body = ctx.state.config.nodeApiError();
  }

  try {
    await User.registerUserInfo(reqParams);
    returnData.msg = "注册成功";
  } catch (e) {
    console.error("User.registerUserInfo error");
    returnData = ctx.state.config.nodeApiError();
  }
  ctx.body = returnData;
})

// 获取用户信息
router.get('/getUserInfo', async (ctx, next) => {
  let returnData = ctx.state.config.initData();
  ctx.body = returnData;
})

module.exports = router
