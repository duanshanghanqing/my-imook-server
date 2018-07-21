const { query } = require('../database/mysql/index');
const { encryption } = require('../utils/index');
class User {
    constructor() {

    }

    //获取用户信息
    static async Login({ name, email, phone, password }) {
        let sql = '';
        if (name) {
            sql = 'SELECT * FROM user  WHERE name = ? AND password = ?';
            return await query(sql, [name, encryption(password)]);
        }
        if(email){
            sql = 'SELECT * FROM user  WHERE email = ? AND password = ?';
            return await query(sql, [email, encryption(password)]);
        }
        if(phone){
            sql = 'SELECT * FROM user  WHERE phone = ? AND password = ?';
            return await query(sql, [phone, encryption(password)]);
        }
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