const router = require('koa-router')()
const User = require('../../service/User')
const path = require('path')
const upload = require('../../utils/upload')
const imgVerification = require('../../utils/imgVerification')

router.get('/', async (ctx, next) => {
  ctx.session.views = 123456

  let verification = imgVerification()
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    imgUrl:verification.imgUrl
  })
})

router.post('/file', async (ctx, next) => {
  let res = await upload(ctx, {
    saveUrl: path.join(__dirname, '..', '..', '..', 'public', 'file')
  })
  console.log(res)
  ctx.body = {}
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string session:' + (parseInt(ctx.session.views) + 11)
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
