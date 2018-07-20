const router = require('koa-router')();
const Recruit = require('../../service/Recruit');

// 添加职位
router.post('/add', async (ctx, next) => {
    let returnData = ctx.state.config.initData();
    let { reqParams } = ctx.state;
    try {
        let { serverStatus } = await Recruit.add(reqParams);
        if(serverStatus === 2){
          returnData.msg = '添加成功'
        }
     } catch (e) {
       console.error("Recruit.add error");
       return ctx.body = ctx.state.config.nodeApiError();
    }
    ctx.body = returnData;
  })
  

module.exports = router
