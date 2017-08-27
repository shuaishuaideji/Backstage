/**
 * Created by SMALLWOLF on 2017/1/19.
 */
'use strict'

let inspector = require('schema-inspector');
let qs = require('querystring');
let fs = require('fs');
let request = require('request');
let debug = require('debug')(`${PKG.name}:duobeiapi`);
let buildData = function (data, partnerId, appKey, excludes) {
  excludes = excludes || [];
  data.partner = partnerId;
  let keys = Object.keys(data);
  keys = _.difference(keys, excludes);
  keys.sort((a, b) => {
    return a.localeCompare(b);
  });
  let retData = {};
  let encodeStr = [];
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (data[key]) {
      retData[key] = data[key];
      encodeStr.push(key + '=' + data[key]);
    }
  }
  encodeStr = encodeStr.join('&') + appKey;
  retData.sign = _.md5(encodeStr);
  return retData;
};
let _req = thunkify(function (opts, callback) {
  request(opts, function (err, req, body) {
    if (err) {
      callback(err, null);
    }
    else {
      if (opts.json) {
        if (!body.success) {
          if (!body.error) {
            console.error(body);
          }
          return callback(new Exception(-1003, body.error));
        }
        callback(null, body);
      }
      else {
        callback(null, body);
      }
    }
  });
});
function schemaCheck(data, schema) {
  let rule = {
    type: 'object',
    properties: schema
  };
  let result = inspector.validate(rule, data);
  return result;
}
function* invoke(api, data, method, isJson) {
  if (api.params) {
    let result = schemaCheck(data, api.params);
    if (!result.valid) {
      throw new Exception(errors.ArgsError, null, result.format());
    }
  }
  let url = /^http(s)?:\/\//i.test(api.url) ? api.url : invoke.duobeiCfg.baseUrl + api.url;
  let opts = {
    uri: url,
    cache: false,
    headers: {
      'cache-control': 'no-cache'
    },
    json: isJson === undefined ? true : isJson,
    timeout: 100 * 1000
  };
  if (method === 'get') {
    opts.method = 'get';
    opts.qs = buildData(data, invoke.duobeiCfg.partner, invoke.duobeiCfg.appKey);
  }
  else if (method === 'post' || method === 'put') {
    opts.method = 'post';
    opts.form = buildData(data, invoke.duobeiCfg.partner, invoke.duobeiCfg.appKey);
  }
  debug(opts);
  let response = yield _req(opts);
  return response;
}
invoke.post = function*(api, data) {
  return yield invoke(api, data, 'post');
};
Object.defineProperties(invoke, {
  duobeiCfg: {
    value: CFG.uskidBackendPrivate.duobeiApi,
    writable: false,
    enumerable: true,
    configurable: false
  },
});

invoke.get = function*(api, data, isJson) {
  let retData = yield invoke(api, data, 'get', isJson);
  return retData;
};
invoke.getRoomInfo = function*(roomId) {
  let data = {timestamp: new Date().getTime(), roomId: roomId};
  let response = yield invoke.post(constant.DUOBEI_API.ROOM_DETAIL, data);
  return response.course;
};
invoke.getDocStatus = function*(documentUuid) {
  let data = {timestamp: new Date().getTime(), documentId: documentUuid};
  let response = yield invoke.post(constant.DUOBEI_API.GET_DOC_INFO, data);
  return response.status;
};
invoke.uploadDoc = function*(docPath) {
  let api = {url: constant.DUOBEI_API.UPLOAD_FILE.url};
  let data = {timestamp: new Date().getTime()};
  let url = /^http(s)?:\/\//i.test(api.url) ? api.url : invoke.duobeiCfg.baseUrl + api.url;
  let opts = {
    uri: url,
    cache: false,
    headers: {
      'cache-control': 'no-cache'
    },
    json: true,
    timeout: 100 * 60 * 1000
  };
  let signedData = buildData(data, invoke.duobeiCfg.partner, invoke.duobeiCfg.appKey, ['slidesFile']);
  signedData.slidesFile = fs.createReadStream(docPath);
  opts.method = 'post';
  opts.formData = signedData;
  debug(opts);
  let response = yield _req(opts);
  return {documentId: response.documentId, uuid: response.uuid};
};
invoke.attachDocment = function*(roomId, documentUuid) {
  let data = {timestamp: new Date().getTime(), documentId: documentUuid, roomId: roomId};
  let response = yield invoke.post(constant.DUOBEI_API.ATTACH_DOC, data);
  return response;
};
invoke.createRoom = function*(data) {
  data.timestamp = new Date().getTime();
  let response = yield invoke.post(constant.DUOBEI_API.CREAT_ROOM_V4, data);
  return response.room;
};
invoke.deleteRoom = function*(roomId) {
  let response = yield invoke.post(constant.DUOBEI_API.DELETE_ROOM, {roomId: roomId, timestamp: new Date().getTime()});
  return response.room;
};
invoke.generateEnterRoomUrl = function*(roomInfo, userId, nickname, userRole, deviceType, startTime, endTime) {
  let params = {
    roomId: roomInfo.roomId,
    uid: userId,
    nickname: nickname,
    userRole: userRole,
    timestamp: new Date().getTime()
  };
  if (deviceType) {
    params.deviceType = deviceType;
  }
  if (startTime) {
    params.psTime = startTime;
  }
  if (endTime) {
    params.peTime = endTime;
  }
  params = buildData(params, invoke.duobeiCfg.partner, invoke.duobeiCfg.appKey);
  let result = schemaCheck(params, constant.DUOBEI_API.ENTER_ROOM.params);
  if (!result.valid) {
    throw new Exception(20004, null, result.format());
  }
  const enterUrl = `${constant.DUOBEI_API.ENTER_ROOM.url}?${qs.stringify(params)}`;
  return enterUrl;
};
invoke.generateRoomHtml = function*(roomInfo, userId, nickname, userRole, deviceType, startTime, endTime) {
  let params = {
    roomId: roomInfo.roomId,
    uid: userId,
    nickname: nickname,
    userRole: userRole,
    timestamp: new Date().getTime()
  };
  if (deviceType) {
    params.deviceType = deviceType;
  }
  const roomHtml = yield invoke.get(constant.DUOBEI_API.ENTER_ROOM, params, false);
  return roomHtml;
};
invoke.getRoomsInfo = function*(condition) {
  let params = {
    timestamp: new Date().getTime(),
  };
  params = _.assign(params, condition);
  const data = yield invoke.get(constant.DUOBEI_API.ROOM_LIST, params, false);
  return data;
};
module.exports = invoke;