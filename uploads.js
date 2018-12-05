/*
 * 利用koa-body实现单文件和多文件上传功能
*/

const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const static = require('koa-static');
const app = new Koa();
const Router = require('koa-router');
const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const router = new Router({
  methods
});

const koaBody = require('koa-body');
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));

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

// 上传单个文件
router.post('/uploadfile', async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  // `${Date.now()}-${file.originalname}`
  let filePath = path.join(__dirname, 'static/uploads/') + `/${Date.now()}-${file.name}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  ctx.body = "上传成功！";
});


// 上传多个文件
router.post('/uploadfiles', async (ctx, next) => {
  // 上传多个文件
  const files = ctx.request.files.file; // 获取上传文件
  for (let file of files) {
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    // 获取上传文件扩展名
    let filePath = path.join(__dirname, 'static/uploads/') + `/${Date.now()}-${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
  }
  ctx.body = "上传成功！";
});



app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, ()=>{
  console.log('runing...')
})