const path = require('path');
const mysql = require('mysql');
const mysqlConfig = require('../../config/mysql');

//记录使用的库
const database = mysqlConfig.database;

//初始化只连接数据库
delete mysqlConfig.database;
// 创建数据池
const pool = mysql.createPool(mysqlConfig);

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

const sql = require("./sql/index");

//初始化
; (async function () {

    // 删除数据库
    await query(sql.dropDataBase(database));
    // 创建数据库
    await query(sql.createDataBase(database));
    //查看数据库
    await query(sql.showDataBases());
    // 使用数据库
    await query(sql.useDataBase(database));

    // 初始化user表
    await query(sql.create_user);
    // 初始化招聘表
    await query(sql.create_recruit);


    /*
    // 插入一些数据
    for (var i = 0; i < 100; i++) {
        await query(sql.insert_user, ['name' + (i), 10 + i, 'nick' + (i), '男', '13482385237', '490771345gaojunfeng@qq.com', '123456', new Date() * 1, new Date() * 1,"BOOS","http://fanyi.baidu.com/static/translation/img/header/logo_cbfea26.png"]);
    }
    // 数据更新
    await query(sql.update_user, ['new contect', 8]);
    // 查询修改后的数据
    let queryRes = await query(sql.select_user, [3, 20]);
    console.log(queryRes);
    */
})()