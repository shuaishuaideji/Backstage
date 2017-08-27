const ALY = require('aliyun-sdk');

const oss = new ALY.OSS({
  'accessKeyId': CFG.oss.key,
  'secretAccessKey': CFG.oss.secret,
  'endpoint': CFG.oss.endpoint,
  // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
  'apiVersion': '2013-10-15',
});

module.exports = oss;
