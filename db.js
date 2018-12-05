
exports.base =  (sql,data,callback) => {
  const mysql      = require('mysql');
  const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'book'
  });
  connection.connect();

  connection.query(sql, data, function (error, results, fields) {
    if (error) throw error;
    callback(results)
    // console.log('The solution is: ', results[0].solution);
  });
   
  connection.end();
}