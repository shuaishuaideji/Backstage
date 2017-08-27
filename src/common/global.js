'use strict';

// 全局变量
global.thunkify = require('thunkify-wrap');
global.co = require('co');
global._ = require('lodash');
global.assert = require('assert');
global.Sequelize = require('sequelize');
require('./func');
global.PKG = require('../../package.json');
global.constant = require('./constant.js');
global.errorconstant = require('./errorconstant.js');
global.run = require('./run.js');

// 数据库
global.db = new Sequelize('test', 'root', '123456');
// 全局错误
global.errors = require('./errors');
global.Exception = function (code, msg, detail) {
  Error.stackTraceLimit = 6;
  this.code = code;
  this.msg = msg || errors[code];
  this.detail = detail;
  this.name = `Error ${this.code}:${this.msg}`;
  if (this.code > 20000) {
    Error.captureStackTrace(this, this.constructor);
  }
};

// global.invoke = require('./invoke');

// 控制器/模型
global.ctrls = require('./ctrls.js');
global.models = require('./models.js');
