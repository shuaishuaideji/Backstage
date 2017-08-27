/**
 * Created by SMALLWOLF on 2016/12/13.
 */
'use strict'

function CONSTANT() {
}
CONSTANT.FIXED_NOTICE_EMAIL = 'fengxiaoye@innobuddy.com';
CONSTANT.DATABASE_TABLE = 'uskid';
CONSTANT.VIDEO_CONVERT_STATUS = {
  DEFALUT: 0, // 默认状态
  SUCCESS: 1, // 生成成功
  FAILED: 2, // 生成失败
  EMPTY_VIDEO: 3, // 空视频,(教师和学生都没进入教室)
};
// 订单状态
CONSTANT.ORDER_STATUS = {
  PAYMENT_SUCCESS: 1,
  PAYMENT_WAITING: 2,
  PAYMENT_CANCEL: 3,
  PAYMENT_SUBMISSION: 4,
  PAYMENT_APPROVAL: 5
};
CONSTANT.PAY_PLAT = 4;
CONSTANT.FRONTAPI_CONFIG_KEY = 'uskidBackendPrivate';
CONSTANT.USER_TOKEN_KEY = 'us_user';
CONSTANT.ROOM_DURATION = 60;
CONSTANT.PRE_START_LESSON_DURATION = 30 * 60 * 1000;
CONSTANT.NOT_SEND = new Date().toString(23);
CONSTANT.ONE_DAY_MILS = 24 * 60 * 60 * 1000;
CONSTANT.STAFF_COOKIE_TOKEN_KEY = 'staff_token';
CONSTANT.BOOKING_PERMISSION_ID = 1;
CONSTANT.TABLE_PREFIX = 'uskid_';
CONSTANT.EMAIL_LENGTH_LIMIT = 50;
CONSTANT.NAME_LENGTH_LIMIT = 100;
CONSTANT.DESC_LENGTH_LIMIT = 200;
CONSTANT.PHONE_LENGTH_LIMIT = 20;
CONSTANT.LESSION_SN_LENGTH_LIMIT = 20;
CONSTANT.SINGLE_URL_LENGTH_LIMIT = 20;
CONSTANT.ARRAY_URL_LENGTH_LIMIT = 300;
CONSTANT.SKYPE_LENGTH_LIMIT = 20;
CONSTANT.ADDRESS_LENGTH_LIMIT = 20;
CONSTANT.PAGESIZE = 20;
CONSTANT.COMMENT_SOURCE_TYPE = {
  BOOKING: 1,
};
CONSTANT.COMMENT_STAUTS = {
  DELETE:-1,
  INIT:0,
  PASS:1
}
CONSTANT.SEX = {
  BOY: 1,
  GIRL: 2,
  SECRET: 3
};
CONSTANT.ENABLED_STATUS = {
  ENABLE: 1,
  DISABLE: 0,
};
CONSTANT.IN_ONE_DAY = {
  NO_24HOUR: 0,
  TEACHER_24HOUR: 1,
  CHILD_24HOUR: 2
};
CONSTANT.MESSAGE_SETTING = {
  SMS: 1,
  WEIXIN: 2,
  EMAIL: 5,
  WEIXIN_SMS: 3,
  SMS_EMAIL: 6,
  WEIXIN_EMAIL: 7,
  WEIXIN_SMS_EMAIL: 8,
};
CONSTANT.STATUS_TYPE = {
  DELETED: -1,
  NORMAL: 0,
  UNPUBLISH: 1,
  LOCK: 2,
};
CONSTANT.NORMAL_SHOW_DATA_STATUS = [CONSTANT.STATUS_TYPE.NORMAL, CONSTANT.STATUS_TYPE.UNPUBLISH];
CONSTANT.ACTION_SALARY_TYPE = {
  DECREASE: 2,
  INCREASE: 1
};
CONSTANT.USERROLE = {
  PARENT: 1,
  TEACHER: 2,
  UNKNOWN: -1
};
CONSTANT.USER_STATUS = {
  IN_SERVICE: 50,     // 在职
  QUIT: 51,            // 辞职
  FIRE: 52,            // 解雇
  TRIAL: 53,           // 试用
};

CONSTANT.ROOM_USER_ROLE = {
  SPEAKER: 1,         // 主讲人
  LISTENER: 2,       // 听课人
  SURVEILLANT: 3,   // 监课者
  ASSISTANT: 4,    // 助教
};
CONSTANT.SELECTED_STATUS = {
  SELECTED: 1,
  CANCLE: 0,
};

//老师级别对应的工资
CONSTANT.BASESALARY = {
  1: 8.5,
  2: 9,
  3: 9.5,
  4: 10,
  5: 11,
  6: 12,
  7: 13,
  8: 14
}

CONSTANT.SALARYTYPE = {
  ATTEND: {
    type: 1,
    money: 1,
    name: "出席奖励",
    engName: "",
  },
  ATTEND_24HOUR: {
    type: 2,
    money: 2,
    name: "24小时内出席奖励",
    engName: "",
  },
  FEEDBACK: {
    type: 3,
    money: 1,
    name: "feedback奖励",
    engName: "",
  },
  OTHER: {
    type: 3,
  }
};

CONSTANT.LESSON_STATUS = {
  BOOKING: 10,                   // 预约成功
  NOSTART_CHILD: 12,            // 学生未上课   //一半工资
  CANCLE_TEACHER: 13,          // 老师取消
  NOSTART_TEACHER: 14,          // 老师未上课
  ENDWAY_CHILD: 15,             // 学生中途结束  //工资
  ENDWAY_TEACHER: 16,           // 老师中途结束
  CANCLE_TEACHER_24HOUR: 17,   // 老师24小时之内取消  (学生预约了在24小时内取消)
  CANCLE_CHILD_24HOUR: 18,     // 学生24小时之内取消 //一半工资
  CANCLE_CHILD: 19,             // 学生取消
  DONE: 20,                       // 正常结束   //工资
  ITTEST_TEACHER_FAIL: 21,      // 老师IT故障
  ITTEST_CHILD_FAIL: 22,        //学生IT故障  //工资
  STATUS_CONFIRM: 23,            // 状态待确认
  CONVERT_RECORDING: 24,           // 回放生成中
  EXPIRED: 40,                     // 已过期
  TIMESLOT: 100                    // 教师预约
};

// 孩子显示的历史课程
CONSTANT.CONFIRM_STATUSES = [
  CONSTANT.LESSON_STATUS.CANCLE_CHILD_24HOUR, CONSTANT.LESSON_STATUS.ITTEST_CHILD_FAIL,
  CONSTANT.LESSON_STATUS.ENDWAY_CHILD, CONSTANT.LESSON_STATUS.DONE, CONSTANT.LESSON_STATUS.CONVERT_RECORDING,
];

CONSTANT.ROOM_TYPE = {
  ONE_TO_ONE: 1,
  ONE_TO_MANY: 2
};

CONSTANT.LESSON_TYPE = {
  FREE_OPEN_CLASS: 1,
  MAJOR_CLASS: 2,
  KICK_OFF: 3,
  MVP_OPEN_CLASS: 4,
  TRIAL: 5,
  IT_TEST: 6,
  OTHER:1000
};

CONSTANT.COMMENT_TYPE = {
  TEACHER_TO_CHILD: 1,
  CHILD_TO_TEACHER: 2,
};

CONSTANT.DUOBEI_API = {
  CREAT_ROOM_V3: {
    url: '/api/v3/room/create',
    params: {
      title: {
        type: 'string',
        optional: false
      },
      video: {
        type: 'number',
        optional: false
      },
      startTime: {
        type: 'string',
        optional: false
      },
      duration: {
        type: 'number',
        optional: false,
        gte: 1,
        lte: 5
      },
      roomType: {
        type: 'number',
        optional: false,
        gte: 1,
        lte: 2
      }
    }
  },
  CREAT_ROOM_V4: {
    url: '/api/v4/room/create',
    params: {
      timestamp: {
        type: 'number',
        comment: '',
        optional: false
      },
      title: {
        type: 'string',
        comment: '',
        optional: false
      },
      video: {
        type: 'number',
        comment: '',
        optional: false
      },
      startTime: {
        type: 'string',
        comment: '',
        optional: false
      },
      length: {
        comment: '房间时长，单位:分钟',
        type: 'number',
        optional: false,
        gte: 30,
        lte: 300
      },
      roomType: {
        comment: '房间类型，1v1:1,1vN:2',
        type: 'number',
        optional: false,
        gte: 1,
        lte: 2
      }
    }
  },
  DELETE_ROOM: {
    url: '/api/v3/room/delete',
    params: {
      timestamp: {
        type: 'number',
        comment: '',
        optional: false
      },
      roomId: {
        comment: '房间ID',
        type: 'string',
        optional: false,
      }
    }
  },
  ENTER_ROOM: {
    url: 'http://api.duobeiyun.com/api/v3/room/enter',
    params: {
      timestamp: {
        type: 'number',
        comment: '',
        optional: false
      },
      roomId: {
        comment: '房间ID',
        type: 'any',
        optional: false,
      },
      uid: {
        comment: '用户在自己网站上的唯一标识,不能重复',
        type: 'any',
        optional: false,
      },
      nickname: {
        comment: '用户在房间内的昵称',
        type: 'string',
        optional: false,
      },
      userRole: {
        comment: '可选值为1,2,3,4。 值为1时表示以 主讲人身份进入教室，值为2时表示以听众身份进入教室，值为3时表示以隐身监课者身份进入，值为4时表示以房间助教身份进入教室。当请求不加该参 数时默认以听众身份进入',
        type: 'number',
        optional: false,
      },
      deviceType: {
        comment: '	可选值1,2. 当不填deviceType时, 会根据userAgent判断用户访问设备, 并返回页面; 值为1时返回PC客户端; 值为2时返回手机端教室',
        type: 'number',
        optional: true,
      }
    }
  },
  ROOM_LIST: {
    url: '/api/v3/room/list',
    params: {
      timestamp: {
        type: 'number',
        comment: '',
        optional: false
      },
      title: {
        comment: '根据标题模糊查询',
        type: 'any',
        optional: true,
      },
      startTime: {
        comment: '开始时间早于这个时间的房间,格式unix_timestamp',
        type: 'number',
        optional: true,
      },
      endTime: {
        comment: '开始时间晚于这个时间的房间,格式unix_timestamp',
        type: 'number',
        optional: true,
      },
      pageNo: {
        comment: '第几页',
        type: 'number',
        optional: true,
      },
    }
  },
  ROOM_DETAIL: {
    url: '/api/v3/room/detail',
    params: {
      timestamp: {
        type: 'number',
        comment: '',
        optional: false
      },
      roomId: {
        comment: '房间ID',
        type: 'any',
        optional: false,
      },
    }
  },
  UPLOAD_FILE: {
    url: '/api/v3/documents/upload',
    params: {
      timestamp: {
        type: 'number',
        comment: '',
        optional: false
      },
      slidesFile: {
        comment: '文件',
        optional: true
      }
    }
  },
  ATTACH_DOC: {
    url: '/api/v3/room/attachDocument',
    params: {
      timestamp: {
        type: 'number',
        comment: '',
        optional: false
      },
      documentId: {
        comment: '文档的UUID，不是documentId',
        optional: false
      },
      roomId: {
        comment: '',
        optional: false
      }
    }
  },
  GET_DOC_INFO: {
    url: '/api/v3/documents/status',
    params: {
      timestamp: {
        type: 'number',
        comment: '',
        optional: false
      },
      documentId: {
        comment: '文档的documentId',
        optional: false
      },
    }
  }
};

CONSTANT.FIXED_NOTICE_EMAIL = 'wangmengmeng@innobuddy.com';
CONSTANT.TEACHER_BOOKINGS_MSGTEMPLATE = {
  booked24hour: {
    subject: 'USKid: New Short-Notice Booking!',
    content: [
      'Good news! You’ve been booked for a Short-Notice class!',
      'Student Name: {0}',
      'Date & Time: {1}',
      'Please log in to the USKid Teacher Portal (<a href="http://uskid.smartstudy.com/teacher/signin">http://uskid.smartstudy.com/teacher/signin</a>) to see booking details and to access course materials. As this is a short-notice class, you will receive an additional USD 2 for teaching this class!',
      'Thanks and happy teaching!',
      'The USKid Beijing Team',].join('</br>')
  },
  booked: {
    subject: 'USKid: New Short-Notice Booking!',
    content: [
      'Good news! You’ve been booked for a class!',
      'Student Name: {0}',
      'Date & Time: {1}',
      'Please log in to the USKid Teacher Portal (<a href="http://uskid.smartstudy.com/teacher/signin">http://uskid.smartstudy.com/teacher/signin</a>) to see booking details and to access course materials.',
      'Thanks and happy teaching!',
      'The USKid Beijing Team',].join('</br>')
  },
  cancel: {
    subject: 'USKID: Class Cancellation Notice!',
    content: [
      'We regret to inform you that the following class has been cancelled by the student:',
      'Student Name: {0}',
      'Date & Time: {1}',
      'Should you choose to do so, you may log in to the USKid Teacher Portal (<a href="http://uskid.smartstudy.com/teacher/signin">http://uskid.smartstudy.com/teacher/signin</a>) to make timeslots available for short-notice classes. This may increase the odds of you obtaining a replacement booking.',
      'As this cancellation occurred more than 24 hours prior to the scheduled start time, you will unfortunately not receive compensation for this class.',
      'We apologize for the inconvenience!',
      'Sincerely,',
      'The USKid Beijing Team',
    ].join('</br>')
  },
  cancel24hour: {
    subject: 'USKID: Class Cancellation Notice!',
    content: [
      'We regret to inform you that the following class has been cancelled by the student:',
      'Student Name: {0}',
      'Date & Time: {1}',
      'Should you choose to do so, you may log in to the USKid Teacher Portal (<a href="http://uskid.smartstudy.com/teacher/signin">http://uskid.smartstudy.com/teacher/signin</a>) to make timeslots available for short-notice classes. This may increase the odds of you obtaining a replacement booking.',
      'As this cancellation occurred between 2 and 24 hours prior to the scheduled start time, you will receive 50% of your base fee for this class. As a reminder, should you receive a replacement booking in this time slot, you will only receive payment for the taught class.',
      'Sorry for the inconvenience!',
      'Sincerely,',
      'The USKid Beijing Team',
    ].join('</br>')
  },
  cancel2hour: {
    subject: 'USKID: Class Cancellation Notice!',
    content: [
      'We regret to inform you that the following class has been cancelled by the student:',
      'Student Name: {0}',
      'Date & Time: {1}',
      'Should you choose to do so, you may log in to the USKid Teacher Portal (<a href="http://uskid.smartstudy.com/teacher/signin">http://uskid.smartstudy.com/teacher/signin</a>) to make timeslots available for short-notice classes. This may increase the odds of you obtaining a replacement booking.',
      'As this cancellation occurredless than 2 hours prior to the scheduled start time, you will receive 100% of your base fee for this class. As a reminder, should you receive a replacement booking in this time slot, you will only receive payment for the taught class.',
      'Sorry for the inconvenience!',
      'Sincerely,',
      'The USKid Beijing Team',
    ].join('</br>')
  },
};
module.exports = CONSTANT;