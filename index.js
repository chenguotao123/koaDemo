const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const app = new Koa();
const router = require('./router.js');
// const rest = require('./restfulAPI.js');
// app.use(rest.restify('/api')); //使用中间件写法，并且声明api接口的路径

const bodyParser = require('koa-bodyparser');
app.use(bodyParser());


app.use(static(
  path.join( __dirname,  './static')
))

router.all('*',function (ctx, next) {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, myheader');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('runing...')
})