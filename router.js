const Router = require('koa-router');
const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const router = new Router({
  methods
});
const service = require('./service.js');
// 上传图片
const multer = require('./multer.js');

router.get('/index', async (ctx, next) => {
  await service.showIndex(ctx);
});

router.post('/books/book', async (ctx, next) => {
  await service.addBook(ctx);
});

router.get('/books/book/:id', async (ctx, next) => {
  await service.getBookById(ctx);
});

router.put('/books/book', async (ctx, next) => {
  await service.editBook(ctx);
});

router.delete('/books/book/:id', async (ctx, next) => {
  await service.deleteBook(ctx);
});

router.post('/books/upload', multer.array('file') , async (ctx, next) => {
  await service.upLoadBook(ctx);
});


// ============== 以下与图书管理无关，单图和多图的上传功能 =================
// muilter.single('file'), //适用于单文件上传
// muilter.array('file',num), //适用于多文件上传，num为最多上传个数，上传文件的数量可以小于num,
// muilter.fields(fields), //适用于混合上传，比如A类文件1个，B类文件2个。官方API有详细说明。
router.post('/upLoadImg', multer.array('file') , async (ctx, next) => {
  // console.log(ctx)
  await service.upLoadImg(ctx);
});

module.exports = router;