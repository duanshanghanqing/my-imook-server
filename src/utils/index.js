var crypto = require("crypto");//加载模块

//加密
const encryption = (date) => {
    //crypto.createCipher(algorithm, password);语法
    //参数1：要使用的加密的算法，参数2：算法的密码.返回一个 密码（cipher）对象
    var cipher = crypto.createCipher("bf", "abc");
    var ER = "";//定义一个加密结果(ER)

    //密码对象.update()进行加密，参数1:要加载的数据，
    //参数2:要加密数据的编码类型，参数3:加密完成的编码类型。
    //密码对象.update()返回的结果可能是不完整的。
    ER += cipher.update(date, "utf8", "hex");

    //最后(final)结束加密数据输出，以hex编码类型输出
    ER += cipher.final("hex");
    return ER;
}
// let encryptionRes = encryption("1234567");
// console.log(encryptionRes);


//解密
const decryption = (date) => {
    var Decrypt = crypto.createDecipher("bf", "abc");
    var DR = "";//定义一个解密结果

    //加密对象.update();第一个参数：要解密的数据
    //第二个：要解密的数据编码类型。第三个参数：解密完成的数据编码类型
    DR += Decrypt.update(date, "hex", "utf8");
    //最后(final)结束解密数据输出，以utf8编码类型输出
    DR += Decrypt.final("utf8");
    return DR;
}

// console.log(decryption(encryptionRes));

module.exports = {
    encryption,
    decryption
}