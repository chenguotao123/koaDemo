const mysql = require('mysql');
let db = {}

// 增删查改调用
db.base = (connection, sql, paras, callback) => {
    connection.query(sql, paras, function (error, results, fields) {
        if (error) throw error;
        callback(results);
    });
}

//关闭数据库
db.close = function(connection){
    //关闭连接
    connection.end(function(err){
        if(err) {
            return;
        }else{
            // console.log('关闭连接');
        }
    });
}

//获取数据库连接
db.connection = function(){
    //数据库配置
    let connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'root',
        database:'book',
        port:3306
    });
    //数据库连接
    connection.connect(function(err){
        if(err){
            console.log(err);
            return;
        }
    });
    return connection;
}
module.exports = db;

// exports.base =  (sql,data,callback) => {
//   const mysql      = require('mysql');
//   const connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'root',
//     database : 'book'
//   });
//   connection.connect();

//   connection.query(sql, data, function (error, results, fields) {
//     if (error) throw error;
//     callback(results)
//     // console.log('The solution is: ', results[0].solution);
//   });
   
//   connection.end();
// }