const db = require('./db.js');

// 排序
function keysort(key,sortType){
  return function(a,b){
      return sortType ?~~(a[key]<b[key]):~~(a[key]>b[key])
  }
}

exports.showIndex = (ctx) => {
  return new Promise((reslove,reject)=>{
    let sql = 'select * from book';
    let data = null;
    // ctx.body="Hello JSPang";
    db.base(sql, data, (result)=>{
      result.sort(keysort('id',false));
      ctx.body = result;
      reslove()
    })
  })
}

// 添加数据
exports.addBook = (ctx) => {
  return new Promise((reslove,reject)=>{
    const info = ctx.request.body;
    let sql = 'insert into book set ?';

    db.base(sql, info, (result)=>{
      if(result.affectedRows == 1){
        ctx.body = {flag : 1};
        reslove()
      }else{
        ctx.body = {flag : 2};
        reslove()
      }  
    })
  })
}

exports.getBookById = (ctx) => {
  return new Promise((reslove,reject)=>{
    let id = ctx.params.id;
    let sql = 'select * from book where id=?';
    let data = [id];
    db.base(sql,data,(result)=>{
      ctx.body = result[0];
      reslove();
    })
  })
};

exports.editBook = (ctx) => {
  return new Promise((reslove,reject)=>{
    let info = ctx.request.body;
    let sql = 'update book set name=?,author=?,category=?,description=? where id=?';
    let data = [info.name,info.author,info.category,info.description,info.id];
    db.base(sql,data,(result)=>{
      if(result.affectedRows == 1){
        ctx.body = {flag : 1};
        reslove()
      }else{
        ctx.body = {flag : 2};
        reslove()
      }  
    })
  })
};

exports.deleteBook = (ctx) => {
  return new Promise((reslove,reject)=>{
    let id = ctx.params.id;
    let sql = 'delete from book where id=?';
    let data = [id];
    db.base(sql,data,(result)=>{
      if(result.affectedRows == 1){
        ctx.body = {flag : 1};
        reslove()
      }else{
        ctx.body = {flag : 2};
        reslove()
      }  
    })
  })
};


// 上传图片
exports.upLoadImg = (ctx) => {
    // console.log(ctx.req.files);
    let files = ctx.req.files;
    let url = [];
    for (let i=0;i<files.length;i++) {
      url.push(`http://${ctx.request.header.host}/uploads/${files[i].filename}`);
    }
    // 多文件上传
    // ctx.body = { code: 200, data: "上传成功" }
    // 单文件上传, 返回服务器中的图片地址
    ctx.body = { code : 200, url }
};