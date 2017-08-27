'use strict';

// 引用
const fs = require('fs');
const path = require('path');

// 加载所有模型
const exportsObj = {};
const basePath = `${__dirname}/../models/`;
const dir = fs.readdirSync(basePath);
for (let i = 0; i < dir.length; i++) {
  if (path.extname(dir[i]) !== '.js') continue;
  exportsObj[_.toCamel(path.basename(dir[i], '.js'))] = require(`${basePath}${dir[i]}`);
}

// 导出
module.exports = exportsObj;
