const querystring = require('querystring');
import rp from 'request-promise';
import api from '../config/api'
import logger from './logger';
import mockData from './mockData'
import { isMock, STAGE_ENV } from '../config/index'

let domain = api.domain[STAGE_ENV]


const publicError = function(msg) {
    return { code: "-1", msg: msg, data: [] }
}
class Request {
    /**
     * @desc 构造函数
     */
    constructor() {

    }

    /**
     * type：post
     * @param {data}  请求的数据
     * @param {soaOpt}请求的配置
     */
    static async post({ data, soaOpt }) {
        let soaopt = Object.assign({ headers: {} }, soaOpt);
        //是否使用Moke数据
        if (isMock) {
            return mockData(soaopt.moduleName, soaopt.actionName);
        }

        //请求后端api接口地址
        let url = '';
        if (soaopt && soaopt.moduleName && soaopt.actionName) {
            url = `${domain}${api[soaopt.moduleName][soaopt.actionName]}`
        } else {
            console.error("address error");
            return publicError("address error");
        }

        let options = {
            method: 'POST',
            uri: url,
            body: JSON.stringify(data),
            headers: soaopt.headers
        }
        let result;
        try {
            result = await rp(options);
        } catch (e) {
            //记录error
            logger.error(`Server_API_Error:${url} ==> soaOpt:${JSON.stringify(soaopt)}`);
            logger.error(`Server_API_Error:${url} ==>   data:${JSON.stringify(data)}`);
            return publicError("Server API Error");
        }

        //返回结果如果是json字符串，转换成json对象
        if (typeof result === "string") {
            try {
                result = eval('(' + result + ')');
            } catch (e) {
                return publicError("Server API return no JSON");
            }
        }

        //返回的json中没有code 或 code不等于0统一处理为错误
        if (result.code.toString() != "0") {
            logger.error(`Server_API_Error:${url} ==> resultData:${JSON.stringify(result)}`);
            return result;
        }

        console.info(`Server ok \n==> ${url} \n==> ${JSON.stringify(data)} \n==> ${JSON.stringify(result)}`);
        return result;
    }


    /**
     * type：get
     * @param {data}  请求的数据
     * @param {soaOpt}请求的配置
     */
    static async get({ data, soaOpt }) {
        let soaopt = Object.assign({ headers: { Authorization: "Basic dGVzdDo4ODg4ODg=" } }, soaOpt);
        //是否使用Moke数据
        if (isMock) {
            return mockData(soaopt.moduleName, soaopt.actionName);
        }


        let url = '';
        if (soaopt && soaopt.moduleName && soaopt.actionName) {
            url = `${domain}${api[soaopt.moduleName][soaopt.actionName]}`
        } else {
            console.error("address error");
            return publicError("address error");
        }

        let options = {
            method: 'GET',
            uri: url,
            qs: data,
            headers: soaopt.headers,
            json: true // 自动解析响应中的JSON字符串
        }
        let result;
        try {
            result = await rp(options);
        } catch (e) {
            //记录error
            logger.error(`Server_API_Error:${url}?${querystring.stringify(data)} \n==> soaOpt:${JSON.stringify(soaopt)}`);
            logger.error(`Server_API_Error:${url}?${querystring.stringify(data)} \n==> result:${JSON.stringify(result)}`);
            return publicError("API Error");
        }

        //返回结果如果是json字符串，转换成json对象
        if (typeof result === "string") {
            try {
                result = eval('(' + result + ')');
            } catch (e) {
                return publicError("Server API return no JSON");
            }
        }

        //返回的json中没有code 或 code不等于0统一处理为错误
        if (result.code.toString() != "0") {
            logger.error(`Server_API_Error:${url}?${querystring.stringify(data)} \n==> data:${JSON.stringify(data)} \n==> result:${JSON.stringify(result)}`);
            return result;
        }

        console.info(`Server ok \n==> ${url}?${querystring.stringify(data)} \n==> ${JSON.stringify(data)} \n==> ${JSON.stringify(result)}`);
        return result;
    }

    /**
     * type：RESTful
     * 数据就是地址
     * @param {data}  请求的数据
     * @param {soaOpt}请求的配置
     */
    static async RESTful({ data, soaOpt }) {
        //参数对象
        let soaopt = Object.assign({ headers: {}, method: 'get', extendData: {} }, soaOpt);

        //把数据放在地址里
        let urlData = '';
        if (data && typeof data === "object") {
            Object.keys(data).forEach(function(key) {
                urlData += `/${data[key]}`
            })
        }

        //?key=value
        let queryString = '';
        if (soaopt.queryString && typeof soaopt.queryString === "object") {
            queryString += '?';
            Object.keys(soaopt.queryString).forEach(function(key) {
                queryString += `${key}=${soaopt.queryString[key]}`;
            })
        }

        //是否使用Moke数据
        if (isMock) {
            return mockData(soaopt.moduleName, soaopt.actionName);
        }

        //请求后端的url，如果传apiUrl侧使用apiUrl，没有侧使用api.js内的url
        let url = '';
        if (soaopt.apiUrl && soaopt.apiUrl != '') {
            url = `${soaopt.apiUrl}${urlData}${queryString}`;
        } else {
            //请求后端api接口地址
            if (soaopt.moduleName && soaopt.actionName) {
                url = `${domain}${api[soaopt.moduleName][soaopt.actionName]}${urlData}${queryString}`;
            } else {
                console.error("address error");
                return publicError("address error");
            }
        }


        //扩展数据，可能有的接口通过地址传递参数，还需要在body上在带点参数。post请求居多
        let extendData = soaopt.extendData;

        //请求方式
        let method = soaopt.method.toLowerCase();
        let options;
        if (method == 'get') {
            options = {
                method: 'GET',
                uri: url,
                qs: extendData,
                headers: soaopt.headers,
                json: true // 自动解析响应中的JSON字符串
            }
        } else if (method == 'post') {
            options = {
                method: 'POST',
                uri: url,
                body: JSON.stringify(extendData),
                headers: soaopt.headers
            }
        } else if (method == 'put') {
            options = {
                method: 'put',
                uri: url,
                body: JSON.stringify(extendData),
                headers: soaopt.headers
            }
        } else if (method == 'delete') {
            options = {
                method: 'delete',
                uri: url,
                body: JSON.stringify(extendData),
                headers: soaopt.headers
            }
        }

        //发送请求
        let result;
        try {
            result = await rp(options);
        } catch (e) {
            //记录error
            logger.error(`Server_API_Error:${url} ==> soaOpt:${JSON.stringify(soaopt)}`);
            logger.error(`Server_API_Error:${url} ==> extendData:${JSON.stringify(extendData)}`);
            return publicError("Server API Error");
        }

        //返回结果如果是json字符串，转换成json对象
        if (typeof result === "string") {
            try {
                result = eval('(' + result + ')');
            } catch (e) {
                return publicError("Server API return no JSON");
            }
        }

        //返回的json中没有code 或 code不等于0统一处理为错误
        if (result.code.toString() != "0") {
            logger.error(`Server_API_Error:${url} ==> resultData:${JSON.stringify(result)}`);
            return result;
        }

        console.info(`Server ok \n==> ${url} \n==> ${JSON.stringify(extendData)} \n==> ${JSON.stringify(result)}`);
        return result;
    }
}
/*
//页面查询参数
let reqData = {
    module: "13482385237",
    action: 'send'
};
//请求参数
var options = {
    data: reqData,
    soaOpt: {
        moduleName: "public",
        actionName: "VerificationCode",
        //apiUrl: "www.baidu.com",
        method: 'POST',
        extendData: {
            name: "zhangshan"
        }
    }
}
Request.RESTful(options)
*/
export default Request;