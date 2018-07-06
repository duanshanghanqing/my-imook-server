/**
 * desc:logger工具类
 */
const path = require('path')
const fs = require('fs')
const log4js = require('log4js');
const logConf = require('../config/log4js')

//创建log的目录
let appenders = logConf.appenders;
if (appenders) {
    let logDir = path.join(__dirname, "..", "..", "logs");
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    for (let a of appenders) {
        if (a.type && a.type == "dateFile") {
            let dir = path.join(__dirname, "..", "..", a.filename);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }
    }
}

//设置配置
log4js.configure(logConf);

//实现方法
class Log {
    constructor() {
    }

    /**
     * desc:记录info
     * @param  {String} info
     */
    static info(info){
        if (info) log4js.getLogger('info').info(info);
    }

    /**
     * desc:记录error
     * @param  {String} error
     */
    static error(error){
        if(error) log4js.getLogger('error').error(error);
    }
    /**
     * desc:记录warning
     * @param  {String} warn
     */
    static warn(warn){
        if(warn) log4js.getLogger('warn').warn(warn);
    }
}

module.exports = Log;
