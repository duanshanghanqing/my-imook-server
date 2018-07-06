const mysql = require('mysql')
const mysqlConfig = require('../../config/mysql')

// 创建数据池
const pool = mysql.createPool(mysqlConfig)
/*
// 在数据池中进行会话操作
pool.getConnection(function(err, connection) {
   connection.query('SELECT * FROM user',  (error, results, fields) => {
     console.log(results, fields);
     // 结束会话
     connection.release();
     // 如果有错误就抛出
     if (error) throw error;
   })
 })
*/

//使用数据池，封装query方法，返回Promise对象，使用async/await调用
const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                let querySql = connection.query({ 'sql': sql, 'timeout': 60000, 'values': values }, (error, results, fields) => {
                    if (err && err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
                        throw new Error('sql操作超时！');
                    }

                    if (err) {
                        reject(err)
                    } else {
                        resolve(results)
                    }
                    connection.release()
                });
                console.log(querySql.sql)
            }
        })
    })
}

module.exports = { query }