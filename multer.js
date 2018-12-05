/*
 * 利用koa-multer实现单或多文件上传功能
*/
const multer = require('koa-multer');
//以下是配置
const storage = multer.diskStorage({
	//定义文件保存路径
	destination:function(req,file,cb){
	    cb(null,'./static/uploads');// 路径根据具体而定。如果不存在的话会自动创建一个路径
	},                       // 注意这里有个，
	// 修改文件名
	filename:function(req,file,cb){
	    var fileFormat = (file.originalname).split(".");
    	    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
})
module.exports = multer({ storage: storage });
// muilter.single('file'), //适用于单文件上传
// muilter.array('file',num), //适用于多文件上传，num为最多上传个数，上传文件的数量可以小于num,
// muilter.fields(fields), //适用于混合上传，比如A类文件1个，B类文件2个。官方API有详细说明。
// router.post('/upLoadImg', upload.array('file') , async (ctx, next) => {
//   // console.log(ctx)
//   await service.upLoadImg(ctx);
//   // ctx.body = result;
// });