const fs = require('fs')
const path = require('path')
const Busboy = require('busboy')

//默认配置
let defineOption = {
  saveUrl: __dirname,
  uploadStart: function () {

  },
  onFile: function () {

  },
  onEnd: function () {

  },
  onField: function () {

  },
  onFinish: function () {

  },
  onError: function () {

  }
}

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync( dirname ) {
  if (fs.existsSync( dirname )) {
    return true
  } else {
    if (mkdirsSync( path.dirname(dirname)) ) {
      fs.mkdirSync( dirname )
      return true
    }
  }
}

//封装上传方法
const upload = (ctx, option = {}) => {
  //浅拷贝
  let newOption = Object.assign(defineOption, option)

  //返回Promise
  return new Promise((resolve, reject) => {
    //开始上传
    newOption.uploadStart()

    //上传返回结果
    let result = {
      success: false,
      formData: {}
    }

    //请求
    let req = ctx.req
    //实例化
    let busboy = new Busboy({ headers: req.headers })
    req.pipe(busboy)

    // 解析请求文件事件
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      //解析文件
      newOption.onFile()
      //创建目录
      mkdirsSync(newOption.saveUrl)
      // 文件保存到制定路径
      let fileUrl = path.join(newOption.saveUrl,(new Date()*1)+"-"+filename)
      file.pipe(fs.createWriteStream(fileUrl))
      // 文件写入事件结束
      file.on('end', function () {
        //写入事件结束
        newOption.onEnd(file)
        result.success = true
      })
    })

    // 解析表单中其他字段信息
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      result.formData[fieldname] = val;
      newOption.onField(result.formData)
    })

    // 解析结束事件
    busboy.on('finish', function () {
      resolve(result)
      newOption.onFinish(result)
    })

    // 解析错误事件
    busboy.on('error', function (err) {
      reject(result)
      newOption.onError(result)
    })
  })
}
module.exports = upload