const path = require('path')
const requireDirectory = require('require-directory')
const api = requireDirectory(module, path.join(__dirname, '..', 'routes', 'api'))
const render = requireDirectory(module, path.join(__dirname, '..', 'routes', 'render'))
/**
 * 路由中间件，实现自动注册路由功能
 */
module.exports = function (app) {
    //5级路由自动注册，以文件夹文件名称为路由名
    Object.keys(api).forEach((key1)=>{
        let obj1 = api[key1];
        if(obj1.constructor.name == "Object"){
            Object.keys(obj1).forEach((key2)=>{
                let obj2 = obj1[key2];
                if(obj2.constructor.name == "Object"){
                    Object.keys(obj2).forEach((key3)=>{
                        let obj3 = obj2[key3];
                        if(obj3.constructor.name == "Object"){
                            Object.keys(obj3).forEach((key4)=>{
                                let obj4 = obj3[key4];
                                if(obj4.constructor.name == "Object"){
                                    
                                }else{
                                    obj4.prefix(`/api/${key1}/${key2}/${key3}/${key4}`);
                                    app.use(obj4.routes(), obj4.allowedMethods());
                                }
                            });
                        }else{
                            obj3.prefix(`/api/${key1}/${key2}/${key3}`);
                            app.use(obj3.routes(), obj3.allowedMethods());
                        }
                    });
                }else{
                    obj2.prefix(`/api/${key1}/${key2}`);
                    app.use(obj2.routes(), obj2.allowedMethods());
                }
            });
        }else{
            obj1.prefix(`/api/${key1}`);
            app.use(obj1.routes(), obj1.allowedMethods());
        }
    });
    Object.keys(render).forEach((key) => {
        app.use(render[key].routes(), render[key].allowedMethods());
    });
}