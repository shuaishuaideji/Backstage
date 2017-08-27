/**
 * Created by SMALLWOLF on 2016/12/7.
 */
'use strict'
const constant = require('./constant.js');
let debug = require('debug')(`${PKG.name}:run`);
let inspector = require('schema-inspector');
function schemaCheck(data, schema) {
  let rule = {
    type: 'object',
    properties: schema
  };
  debug(data);
  let result = inspector.validate(rule, data);
  return result;
};
module.exports = function (fn) {
  function requestHandle(req, res, next) {
    // 参数检查
    if (fn.params) {
      let method = req.method.toLocaleLowerCase();
      let result = schemaCheck((method === 'get' || method === 'delete') ? req.query : req.body, fn.params);
      if (!result.valid) {
        throw new Exception(20004, '参数错误', result.format());
      }
    }
    //if (fn.permissions) {
    //  let hasRoles = _.intersection(req.user.role.permissions && req.user.role.permissions.array || [], fn.permissions);
    //  if (hasRoles.length === 0) {
    //    res.status(401);
    //    throw new Exception(20001, '参数错误', result.format());
    //  }
    //}
    // 处理请求
    co(fn, req, res, next)
      .then((data)=> {
        if (data !== undefined && data !== constant.NOT_SEND) {
          res.json(200, {data: data, code: 0});
          res.end();
        }
        if (data === constant.NOT_SEND) {
          res.end();
        }
      })
      .catch((error)=> {
        console.error(error.stack || error);
        if (!error.code) {
          let msg = error.message;
          error = new Exception(20003);
          error.msg = error.msg + `[${msg}]`;
        }
        res.send(200, error);
        res.end();
      })
      .then(()=> {
        if (res.finished) {
          console.log(req.url, req.method, res.statusCode, `${new Date().getTime() - req._time}ms`);
        }
      })
  }

  requestHandle.params = fn.params;
  Object.freeze(requestHandle.params);
  return requestHandle;
};

