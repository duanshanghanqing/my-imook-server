const { query } = require('../database/mysql/index');
const { encryption, decryption } = require('../utils/index');
class User {
    constructor() {

    }

    //获取用户信息
    static async Login({ name, password }) {
        let sql = 'SELECT * FROM user  WHERE name = ? AND password = ?';
        let values = [name, encryption(password)];
        return await query(sql, values);
    }

    //检查用户名是否存在
    static async isUser({ name }){
        let sql = 'SELECT * FROM user  WHERE name = ?';
        let values = [name];
        return await query(sql, values);
    }

    //注册用户信息
    static async registerUserInfo({ name, age, nick, sex, phone, email, password, create_time, modified_time, role, portrait }) {
        let sql = `
        insert into user(
            name,
            age,
            nick,
            sex,
            phone,
            email,
            password,
            create_time,
            modified_time,
            role,
            portrait
        ) values (?,?,?,?,?,?,?,?,?,?,?);
        `;
        let values = [name, age, nick, sex, phone, email, encryption(password), create_time, modified_time, role, portrait];
        return await query(sql, values);
    }
}

module.exports = User