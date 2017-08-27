/**
 * Created by SMALLWOLF on 2016/12/21.
 */
'use strict'

let Redis = require('redis');
let request = require('request');
let debug = require('debug')(`${PKG.name}:invoke`);
let client = Redis.createClient(CFG.cache.port, CFG.cache.host);
let cache = null;
function Cache() {
  let keyPrefix = 'uskid.invoke.cache_';
  this.setex = function* (key, value, secondExpired) {
    return yield thunkify(client.setex).bind(client)(keyPrefix + key, secondExpired, value);
  };
  this.has = function* (key) {
    let ret = yield thunkify(client.exists).bind(client)(keyPrefix + key);
    return ret === 1;
  };
  this.get = function* (key) {
    return yield thunkify(client.get).bind(client)(keyPrefix + key);
  };
  this.sendCommand = function*(cmd, args) {
    if (_.isArray(args)) {
      throw new Exception(1000);
    }
    return yield thunkify(client.send_command.bind(client))(cmd, args);
  };
  this.getKeyPrefix = function () {
    return keyPrefix;
  }
}

function* invoke(srvName, api, data, method, opts) {
  if (srvName === 'this') {
    srvName = 'uskidBackendPrivate';
  }
  let service = CFG[srvName];
  let url = service.url + api;
  let needTower = false;
  data = data || {};
  if (~api.indexOf('/private')) {
    needTower = true;
    data.tower = service.tower;
  }
  if (!/^http(s)?:/.test(url)) {
    url = 'http:' + url;
  }
  let _opts = {
    uri: url,
    json: true,
    jar: true,
    timeout: 60 * 1000
  };
  opts = opts || {};
  _opts = Object.assign({}, _opts, opts);
  _opts.method = method;
  if (method === 'get') {
    _opts.qs = data;
  }
  else if (method === 'post' || method === 'put') {
    _opts.body = data;
  }
  debug(_opts);
  let response = yield _.sendRequest(_opts);
  return response;
}
Object.defineProperty(invoke, 'cache', {
  get: function () {
    if (!cache) {
      cache = new Cache();
    }
    return cache;
  },
  set: function () {
    throw new Exception(errors.NoWritable);
  }
})
invoke.post = function*(srvName, api, data, opts) {
  return yield invoke(srvName, api, data, 'post', opts);
};
invoke.put = function*(srvName, api, data, opts) {
  return yield invoke(srvName, api, data, 'put', opts);
};

invoke.get = function*(srvName, api, data, opts) {
  opts = opts || {};

  let hash = '';
  let retData = {};
  opts.cache = opts.cache || false;
  if (opts.cache) {
    hash = _.md5(srvName + api + JSON.stringify(data));
  }
  let cacheData = yield invoke.cache.has(hash);
  console.log(srvName, api, data, opts)
  if ((opts.cache || opts.cache === undefined) && cacheData) {
    try {
      retData = yield invoke.cache.get(hash);
      retData = JSON.parse(retData);
      debug('get data from cache.');
      return retData;
    }
    catch (e) {
      debug('invoke get error:', e);
    }
  }
  retData = yield invoke(srvName, api, data, 'get', opts);
  if (opts.cache || opts.cache === undefined) {
    let ret = yield invoke.cache.setex(hash, JSON.stringify(retData), CFG.cache.time);
    debug('cache result:', ret);
  }
  return retData;
};

module.exports = invoke;