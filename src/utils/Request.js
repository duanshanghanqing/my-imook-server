const querystring = require('querystring')
const fs = require('fs')
const rp = require('request-promise')
const request = require('request')
const FormStream = require('formstream')
const logger = require('./logger')
const { domain } = require('../config/index')

const publicError = function (msg) {
  return { code: '-1', msg: msg, data: [] }
}

class Request {
  // 转发数据
  static async send (_config) {
    // 参数对象
    let soaopt = Object.assign({ headers: {}, method: 'get' }, _config)
    Object.assign(soaopt.headers, { 'Content-Type': 'application/json' })

    // ?key=value
    let queryStringStr = ''
    if (soaopt.queryString && typeof soaopt.queryString === 'object') {
      let stringify = querystring.stringify(soaopt.queryString)
      if (stringify !== '') {
        queryStringStr = '?' + stringify
      }
    }

    // 请求后端的url，如果传wwwUrl侧使用wwwUrl，没有侧使用apiUrl
    let url = ''
    // 请求后端api接口地址
    if (soaopt.apiUrl && soaopt.apiUrl !== '') {
      url = `${soaopt.apiUrl}${queryStringStr}`
    } else {
      console.error('address error')
      return publicError('address error')
    }

    // 扩展数据，可能有的接口通过地址传递参数，还需要在body上在带点参数。post请求居多
    let requestData = soaopt.requestData

    // 请求方式
    let method = soaopt.method.toLowerCase()

    let options
    if (method === 'get') {
      options = {
        method: 'GET',
        uri: url,
        qs: requestData,
        headers: soaopt.headers,
        json: true
      }
    } else if (method === 'post') {
      options = {
        method: 'POST',
        uri: url,
        body: JSON.stringify(requestData),
        headers: soaopt.headers
      }
    } else if (method === 'put') {
      options = {
        method: 'PUT',
        uri: url,
        body: JSON.stringify(requestData),
        headers: soaopt.headers
      }
    } else if (method === 'delete') {
      options = {
        method: 'DELETE',
        uri: url,
        body: JSON.stringify(requestData),
        headers: soaopt.headers
      }
    }

    // 发送请求
    let result = {}
    let t = 0
    try {
      let t1 = new Date() * 1
      result = await rp(options)
      let t2 = new Date() * 1
      t = (t2 - t1) / 1000
    } catch (e) {
      // 记录error
      logger.error(
        `\n===> ${JSON.stringify(options)} \nerror: ${e}\n\n\n`
      )
      return publicError('Server API Error')
    }

    // 返回结果没意义处理
    if (result === undefined || result === null || result === '') {
      logger.error(
        `\n===> ${JSON.stringify(options)} \n===> ${result}\n\n\n`
      )
      return publicError('Server API return no JSON')
    }

    // 返回结果如果是json字符串，转换成json对象
    if (result && typeof result === 'string') {
      try {
        result = JSON.parse(result)
      } catch (e) {
        logger.error(
          `\n===> ${JSON.stringify(options)} \n===> ${result}\n\n\n`
        )
        return publicError('Server API return no JSON')
      }
    }

    // 返回的json中没有code 或 code不等于0统一处理为错误
    if (result && typeof result === 'object' && result.code && result.code.toString() !== '0') {
      logger.warn(
        `\n===> ${JSON.stringify(options)} \n===> ${JSON.stringify(
          result
        )} \n===> api Time : ${t}\n\n\n`
      )
    } else {
      logger.info(
        `\n===> ${JSON.stringify(options)} \n===> ${JSON.stringify(
          result
        )} \n===> api Time : ${t}\n\n\n`
      )
    }

    result.ApiTime = t

    return result
  }

  // 转发文件和数据
  static async fileForward (_config) {
    let soaopt = Object.assign(
      { headers: { 'Content-Type': 'application/json' }, method: 'get' },
      _config
    )
    let { requestData, files, method, apiUrl, headers } = soaopt

    var form = FormStream()
    // 装配数据
    if (requestData && Object.prototype.toString.call(requestData) === '[object Object]') {
      Object.keys(requestData).forEach(key => {
        form.field(key, requestData[key])
      })
    }

    // 装配文件
    if (Object.prototype.toString.call(files) === '[object Object]') {
      files = Object.values(files)
    }
    if (Array.isArray(files)) {
      files.forEach(item => {
        form.file(item.fieldName, item.path, item.name)
      })
    }

    let options = {
      method: method,
      preambleCRLF: true,
      postambleCRLF: true,
      uri: apiUrl,
      headers: Object.assign(headers, form.headers())
    }

    let t = 0
    let t1 = new Date() * 1
    return new Promise((resolve, reject) => {
      // 转发数据
      form.pipe(
        request(options, (error, response, body) => {
          let t2 = new Date() * 1
          t = (t2 - t1) / 1000

          if (error) {
            logger.error(
              `\n===> ${JSON.stringify(
                options
              )} \nerror: ${error}\n\n\n`
            )
            resolve(publicError('Server API Error'))
          } else {
            // 返回结果如果是json字符串，转换成json对象
            if (body && typeof body === 'string') {
              try {
                body = JSON.parse(body)
              } catch (e) {
                logger.error(
                  `\n===> ${JSON.stringify(
                    options
                  )} \n===> ${body}\n\n\n`
                )
                resolve(
                  publicError('Server API return no JSON')
                )
              }
            }

            body.ApiTime = t

            // 返回的json中没有code 或 code不等于0统一处理为错误
            if (body && typeof body === 'object' && body.code.toString() !== '0') {
              logger.warn(
                `\n===> ${JSON.stringify(
                  options
                )} \n===> ${JSON.stringify(
                  body
                )} \n===> api Time : ${t}\n\n\n`
              )
            } else {
              logger.info(
                `\n===> ${JSON.stringify(
                  options
                )} \n===> ${JSON.stringify(
                  body
                )} \n===> api Time : ${t}\n\n\n`
              )
            }

            // 删除临时目录文件
            if (Array.isArray(files)) {
              files.forEach(item => {
                if (fs.existsSync(item.path)) {
                  fs.unlinkSync(item.path)
                }
              })
            }

            // 返回内使用的数据
            resolve(body)
          }
        })
      )
    })
  }
}

/*
(async function(){
    let res = await Request.fileForward({
        method: 'post',
        uri: 'https://aapi.laifuyun.com/v2/mails/import',
        data: {
            accessToken: 'O2eYZmEufPNblRKO',
            a: 'aValue',
            targetFolder: 123,
            emailAddress: '490771426@qq.com'
        },
        files:[
            {
                fieldName: 'fileToUpload',
                path: './a.png',
                name: 'a.png'
            }
        ]
    })
    console.log(res)
})()
*/

// 挂载域名
Request.domain = domain

module.exports = Request