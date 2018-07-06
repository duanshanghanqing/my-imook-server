//是否使用moke数据
const isMock = !true;

//初始化数据
const initData = function(option = {}) {
    return Object.assign({ data: {}, code: "0", msg: "data return Success" }, option);
};

//没有moke数据时返回
const noMockData = function(option = {}) {
    return Object.assign({ data: [], code: "0", msg: "data return Success" }, option);
};

//node接口服务报错
const nodeApiError = function(option = {}) {
    return Object.assign({ data: [], code: "-1", msg: "node api error!" }, option);
};

//接口成功统一返回状态
const RES_OK = "0";

//获取阶段环境
const STAGE_ENV = process.env.STAGE_ENV || 'dev';

module.exports = {
    isMock,
    initData,
    noMockData,
    nodeApiError,
    RES_OK,
    STAGE_ENV
}