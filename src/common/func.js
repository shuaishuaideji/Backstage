'use strict';
// 引用
const crypto = require('crypto');
const request = require('request');
const moment = require('moment');
Array.prototype.uniq = function () {
  return _.uniq(this);
};
Array.prototype.compact = function () {
  return _.compact(this);
};
/**
 *
 * @param bookingInfo
 *          bookingInfo.teacherId
 *          bookingInfo.inOneDay
 *          bookingInfo.lessonType
 *          bookingInfo.startTime
 * @param childId
 * @param teacherId
 */
_.sendEmail = function* (bookingInfo, type) {
  try {
    let child = yield models.child.get({id: bookingInfo.childId});
    let teacher = {};
    if (~[constant.LESSON_TYPE.IT_TEST, constant.LESSON_TYPE.KICK_OFF].indexOf(bookingInfo.lessonType)) {
      teacher = _.getUserAvatar([bookingInfo.teacherId])[bookingInfo.teacherId] || {};
    }
    else {
      teacher = yield models.teacherInfo.get({teacherId: bookingInfo.teacherId});
    }

    let msgTeml = {};
    if (type === 'booked') {
      msgTeml = bookingInfo.startTime * 1000 - new Date().getTime() > constant.ONE_DAY_MILS ? constant.TEACHER_BOOKINGS_MSGTEMPLATE.booked : constant.TEACHER_BOOKINGS_MSGTEMPLATE.booked24hour;
    }
    else if (type === 'cancel') {
      // 两小时之内取消
      if (bookingInfo.startTime * 1000 - new Date().getTime() <= 2 * 3600 * 1000) {
        msgTeml = constant.TEACHER_BOOKINGS_MSGTEMPLATE.cancel2hour;
      }
      else if (bookingInfo.startTime * 1000 - new Date().getTime() <= constant.ONE_DAY_MILS) {
        msgTeml = constant.TEACHER_BOOKINGS_MSGTEMPLATE.cancel24hour;
      }
      else {
        msgTeml = constant.TEACHER_BOOKINGS_MSGTEMPLATE.cancel;
      }
    }
    else {
      return 0;
    }
    let timezone = teacher.timezone || 'Asia/Beijing';
    let startTime = moment(bookingInfo.startTime * 1000).tz(timezone).format('dddd, MMMM Do YYYY, h:mm A') + ', Timezone:' + timezone;
    let content = msgTeml.content.replace(/\{0\}/g, child.englishName).replace(/\{1\}/g, startTime);
    yield invoke.post('imService', '/private/email', {
      sender: 'uskid@innobuddy.com',
      receiverIds: teacher.teacherId,
      receivers: constant.FIXED_NOTICE_EMAIL,
      content: content,
      subject: msgTeml.subject
    });
  }
  catch (e) {
    console.error('send email error:', e);
  }
}
_.getUserInfos = function*(ids, fields) {
  if (_.isEmptyOrNull(ids) || ids.length === 0) {
    return {};
  }
  fields = fields || ['phone', 'nickname', 'avatar'];
  let usersObj = {};
  let users = yield invoke.get('userService', '/private/users', {
    ids: ids.join(','),
    tower: CFG.userService.tower
  });
  users.forEach(user=> {
    usersObj[user.id] = _.getFields(user, fields);
  });

  return usersObj;
};
_.getUserAvatar = function*(ids) {
  if (_.isEmptyOrNull(ids) || ids.length === 0) {
    return {};
  }
  let usersObj = {};
  let users = yield invoke.get('userService', '/private/users', {
    ids: ids.join(','),
    tower: CFG.userService.tower
  });
  users.forEach(user=> {
    delete user.phone;
    delete user.email;
    delete user.balance;
    delete user.avatar;
    usersObj[user.id] = user;
  });

  return usersObj;
};
_.isEmail = function (email) {
  const reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
  return reg.test(email);
};
_.isPhone = function (phone) {
  const reg = /^(([0+]\d{2,3})?(\d{2,3}))(\d{7,8})(\d{3,})?$/;
  return reg.test(phone);
};
_.noHTML = function (html, limitLength) {
  html = html || '';
  html = html.replace(/<[^>]+>/g, '');
  if (html.length > limitLength) {
    html = `${html.substr(0, limitLength)}...`;
  }

  return html;
};
_.requireUser = function*(req, res, next) {
  if (!req.user || !req.user.id) {
    throw new Exception(30005);
  }
  next();
};
_.getDateAndMinute = function (date) {
  let timestamp = 0;
  if (!_.isNumber(date)) {
    timestamp = date.getTime();
  }
  else {
    timestamp = date;
  }
  let onlyDate = Math.floor(timestamp / 86400000) * 86400000;
  let onlyMinute = Math.floor((timestamp % 86400000) / 60000);
  return {date: onlyDate, minute: onlyMinute};
};
_.getWeekDate = function (date) {
  let now = date || new Date();
  if (_.isNumber(now)) {
    now = new Date(now);
  }
  let nowTime = now.getTime();
  let day = now.getDay();
  let oneDayLong = 24 * 60 * 60 * 1000;
  let MondayTime = nowTime - (day - 1) * oneDayLong;
  let SundayTime = nowTime + (7 - day) * oneDayLong;
  let monday = _.getDateAndMinute(MondayTime).date;
  let sunday = _.getDateAndMinute(SundayTime).date + oneDayLong - 1;
  return {monday: monday, sunday: sunday};
}
_.diffOneDay = function diffOneDay(lastDate, timezone, curDate) {
  if (!lastDate) {
    return constant.TIMEDIFF_STATUS.INONE;
  }
  timezone = timezone || '+08:00';
  lastDate = typeof lastDate === 'string' ? lastDate : lastDate.toISOString();
  lastDate = moment(lastDate).utcOffset(timezone);
  if (curDate) {
    curDate = typeof curDate === 'string' ? curDate : curDate.toISOString();
    curDate = moment(curDate).utcOffset(timezone);
  }
  else {
    curDate = moment().Offset(timezone);
  }
  const curDateStr = curDate.format('YYYY-MM-DD');
  const lastDateStr = lastDate.format('YYYY-MM-DD');
  if (lastDateStr === curDateStr) {
    return constant.TIMEDIFF_STATUS.INONE;
  }
  const days = moment(lastDateStr).diff(curDateStr, 'days');
  if (days === -1) {
    return constant.TIMEDIFF_STATUS.YESTERDAY;
  }

  return constant.TIMEDIFF_STATUS.DIFFGREATEONEDAY;
};

_.secretPhone = function (phone) {
  phone = phone.split('');
  phone.splice(3, 5, '*', '*', '*', '*', '*');

  return phone.join('');
};
_.sendRequest = thunkify(function (opts, callback) {
  if (!~opts.uri.indexOf('http:')) {
    opts.uri = 'http:' + opts.uri;
  }
  if (opts.jar === undefined) {
    opts.jar = true;
  }
  let originRes = opts.proxyRes;
  request(opts, function (err, req, body) {
    if (err) {
      callback(err, null);
    }
    else {
      if (opts.json) {
        if (body.code !== undefined && body.code !== 0) {
          return callback(new Exception(body.code, body.msg || body.data || body));
        }
        callback(null, body.data || body);
      }
      else {
        callback(null, body);
      }
    }
    if (originRes && req && req.headers['set-cookie'] && !opts.notSetCookie) {
      originRes.setHeader('set-cookie', req.headers['set-cookie']);
    }
  });
});
// 提取字段
_.getFields = function (data, fields, notSetNull) {
  const obj = {};
  for (let i = 0; i < fields.length; i++) {
    if (data[fields[i]] !== undefined) {
      obj[fields[i]] = data[fields[i]];
    } else if (notSetNull) {
      obj[fields[i]] = undefined;
    }
  }

  return obj;
};

_.age = function diffOneDay(birthday) {
  if (!birthday) {
    return 0;
  }
  let birth = moment(birthday);
  if (!birth.isValid()) {
    return 0;
  }
  const age = moment().diff(birth, 'years');
  return age >= 0 ? age : 0;
};
_.isEmptyOrNull = function (val) {
  switch (Object.prototype.toString.call(val)) {
    case '[object String]':
      return val.length === 0 || val.toLowerCase() === 'null';
    case '[object Array]':
      return val.length === 0;
    case '[object Function]':
      return !0;
    case '[object Number]':
      return val === 0 || val === NaN;
    case '[object Object]':
      return Object.keys(val).length === 0;
    case '[object Null]':
      return !0;
    case '[object Undefined]':
      return !0;
    default:
      break;
  }
};

// 随机生成字符串
_.randString = function (len) {
  len = len || 32;
  const dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let res = '';
  for (let i = 0; i < len; i++) {
    res += dict[parseInt(Math.random() * dict.length, 10)];
  }

  return res;
};
// 随机生成字符串
_.randStringV2 = function (len, seed) {
  len = len || 32;
  const dict = seed || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let res = '';
  for (let i = 0; i < len; i++) {
    res += dict[parseInt(Math.random() * dict.length, 10)];
  }

  return res;
};

// 生成MD5
_.md5 = function (s) {
  return crypto.createHash('md5').update(s, 'utf8').digest('hex'); // eslint-disable-line
};

// 将下划线命名转换为驼峰命名
_.toCamel = function (name) {
  let newName = '';
  let underline = false;
  for (let i = 0; i < name.length; i++) {
    if (name[i] === '_' || name[i] === '-') {
      underline = true;
    } else {
      newName += underline ? name[i].toUpperCase() : name[i];
      underline = false;
    }
  }


  return newName;
};

/**
 *
 * @param prefix {Array<String>} 属性前缀
 * @param source {Object} 源对象
 * @param target... {Array<Object>} 要合并属性的对象数组
 * @returns {*}
 */
_.combineModel = function () {
  const source = arguments[1];
  if (arguments.length < 3) {
    return source;
  }
  let prefix = arguments[0];
  const target = Array.prototype.slice.call(arguments, 2, arguments.length);
  prefix = !_.isArray(prefix) ? [prefix] : prefix;
  for (let i = 0; i < target.length; i++) {
    for (const k in target[i]) {
      source[_.toCamel((prefix[i] ? `${prefix[i]}_` : '') + k)] = target[i][k];
    }
  }

  return source;
};

/**
 * 将一维数组转换带有子节点的tree
 * @param arr 一维数组
 * @param idField 节点的ID属性名称
 * @param pidfield 父节点属性名称
 * @param parentId 指定从哪一级开始转换 默认：0(从根节点开始)
 * @returns {Array}
 */
_.transferArrayToTree = function (arr, idField, pidfield, parentId) {
  idField = idField || 'id';
  pidfield = pidfield || 'pid';
  parentId = parentId || null;
  const rows = [];
  for (let i = 0; i < arr.length; i++) {
    rows.push(arr[i]);
  }
  const roots = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (_.isNull(parentId)) {
      if (_.isEmpty(row[pidfield])) {
        roots.push(row);
        rows.splice(i, 1);
        i--;
      }
    } else {
      if (row[pidfield] === parentId) {
        roots.push(row);
        rows.splice(i, 1);
        i--;
      }
    }
  }
  const toDo = [];
  for (let i = 0; i < roots.length; i++) {
    toDo.push(roots[i]);
  }
  while (toDo.length) {
    const node = toDo.shift();
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row[pidfield] === node[idField]) {
        if (node.children) {
          node.children.push(row);
        } else {
          node.children = [row];
        }
        toDo.push(row);
        rows.splice(i, 1);
        i--;
      }
    }
  }

  return roots;
};

// 获取IP地址
_.getIp = function (req) {
  let ip = req.headers['x-forwarded-for']
    || req.connection.remoteAddress
    || req.socket.remoteAddress;

  if (ip.match(/\d+\.\d+\.\d+\.\d+/)) {
    ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
  } else {
    ip = '0.0.0.0';
  }

  return ip;
};

/**
 * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
_.dateFormat = function (fmt, d) {
  const date = new Date(d);
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds(), // 毫秒
  };
  const week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d',
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1,
      (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468' : '')
      + week[`${date.getDay()}`]
    );
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
    }
  }

  return fmt;
};

_.obj2Camel = function (obj) {
  for (const prop in obj) {
    if (prop.indexOf('_') !== -1) {
      obj[_.toCamel(prop)] = obj[prop];
      delete obj[prop];
    }
  }

  return obj;
};

_.array2Camel = function (arr) {
  return _.map(arr, function (i) {
    return _.obj2Camel(i);
  });
};

_.getArrayObjFields = function (arr, field) {
  return _.map(arr, function (i) {
    return i[field];
  });
};

_.checkDate = function (str, type) {
  switch (type) {
    case 2://短日期，形如 (2008-09-13)
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
      if (r == null)return false;
      var d = new Date(r[1], r[3] - 1, r[4]);
      return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
      break;
    case 3://短时间，形如 (23:30:06)
      var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
      if (a == null) {
        alert('输入的参数不是时间格式');
        return false;
      }
      if (a[1] > 24 || a[3] > 60 || a[4] > 60) {

        return false
      }
      return true;
      break;
    default://长时间，形如 (2008-09-13 23:30:06)
      var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
      var r = str.match(reg);
      if (r == null)return false;
      var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
      return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
      break;
  }
}
_.showPhone= function (phone) {
  if(phone&&phone.length>10){
    return phone.substring(0,3)+"***"+phone.substring(9)
  }else{
    return phone
  }
}