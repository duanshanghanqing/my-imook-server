const { query } = require('../database/mysql/index')
class Recruit {
    constructor() {

    }
    // 添加职位
    static async add({ title, company, logo, money, education, year, keyword, position, industry, introduction, duty }) {
        let sql = `
        insert into recruit(
            title, company, logo, money, education, year, keyword, position, industry, introduction, duty
        ) values (?,?,?,?,?,?,?,?,?,?,?);
        `;
        let values = [title, company, logo, money, education, year, keyword, position, industry, introduction, duty];
        return await query(sql, values)
    }
}

module.exports = Recruit
