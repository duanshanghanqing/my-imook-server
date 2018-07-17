
//删除数据库
const dropDataBase = (dataBaseName) => {
    //删除数据库如果存在的情况下
    return `drop database if exists ${dataBaseName};`;
}

//创建数据库
const createDataBase = (dataBaseName) => {
    //创建数据库如果不存在情况下，设置默认字符集为utf8
    return `create database if not exists ${dataBaseName} default character set utf8;`;
}

//显示数据库
const showDataBases = () => {
    return `show databases;`;
}

//使用数据库
const useDataBase = (dataBaseName) => {
    return `use ${dataBaseName};`;
}

//查看所有表
const showTables = () => {
    return `show tables;`;
}

const user = require("./user");
const recruit = require("./recruit");
module.exports = Object.assign({
    dropDataBase,
    createDataBase,
    showDataBases,
    useDataBase,
    showTables
}, user, recruit)