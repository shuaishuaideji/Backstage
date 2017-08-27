/**
 * Created by SMALLWOLF on 2016/12/23.
 */
'use strict'

// 引用
const fs = require('fs');
const path = require('path');
// 加载所有路由
let routers = [];
const baseDir = `${__dirname}`;
const dirs = fs.readdirSync(`${__dirname}`);
for (let i = 0; i < dirs.length; i++) {
  if (path.extname(dirs[i]) !== '.js' || ~dirs[i].indexOf('index.js')) continue;
  routers.push(require(`${baseDir}/${dirs[i]}`));
}
function attachRouter(server) {
  for(let i=0; i < routers.length; i++){
    routers[i](server);
  }
}
// 导出
module.exports = attachRouter;


