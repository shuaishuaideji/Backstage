'use strict'

let util = require('util');
let path = require('path');
let Model = function (schema) {
	// 私有变量
	let _orm = require(path.join(__dirname, '/../schemas', schema + '.js'));

	// 实例变量
	this.name = _.toCamel(schema);
	Object.defineProperty(this, 'orm', {
		enumerable: false,
		value: _orm
	});
	Object.freeze(this.orm);
};
let _assign = function (/*args...*/) {
	return Object.assign.apply({}, Array.prototype.slice.call(arguments, 0, arguments.length));
};
Model.prototype = {
	create: function* (data,opts) {
		let curDate = new Date();
		data.createdAt = curDate;
		data.updatedAt = curDate;
		let ret = yield this.orm.create(data, opts);
	},
	get: function* (where, opts) {
		opts = opts || {};
		let isThrowNoExist = opts.throwError === undefined ? true : opts.throwError;
		delete opts.throwError;
		if (typeof(opts.raw) === 'undefined') {
			opts.raw = true;
		}
		let ret = yield this.orm.findOne(_assign({where: where}, opts));
		if (!ret && isThrowNoExist) {
			throw new Exception(30003);
		}
		return ret;
	},
	find: function* (where, opts) {
		opts = opts || {};
		if (typeof(opts.raw) === 'undefined') {
			opts.raw = true;
		}
		return yield this.orm.findAll(_assign({where: where}, opts));
	},
	count: function* (where, opts) {
		opts = opts || {};
		if (typeof(opts.raw) === 'undefined') {
			opts.raw = true;
		}
		return yield this.orm.count(_assign({where: where}, opts));
	},
	update: function* (where, data, opts) {
		opts = opts || {};
		let curDate = new Date();
		let isThrowNoExist = opts.throwError === undefined ? true : opts.throwError;
		delete opts.throwError;
		let updateData = {updatedAt: curDate};
		Object.assign(updateData, data);
		let ret = yield this.orm.update(updateData, Object.assign(opts, {
			where: where
		}));
		if (ret[0] === 0 && isThrowNoExist) {
			throw new Exception(20003);
		}
		return ret[0];
	},
	delete: function* (where) {
		let affectRow =
			yield this.orm.update({status: constant.STATUS_TYPE.DELETED}, {
				where: where
			});
		if (affectRow[0] === 0) {
			throw new Exception(20003);
		}
		return affectRow[0];
	},
	getPagerData: function* (where, opts) {
		opts = opts || {};
		let page = parseInt(where.page);
		let limit = parseInt(where.pageSize);
		let offset = (page - 1) * limit;
		delete where.page;
		delete where.pageSize;
		opts = Object.assign(opts, {where: where}, {offset: offset, limit: limit});
		if (typeof(opts.raw) === 'undefined') {
			opts.raw = true;
		}
		let data = yield this.orm.findAndCount(opts);
		data.totalPage = Math.ceil(data.count / limit);
		data.pageSize = limit;
		data.page = page;
		return data;
	}
}
;
Model.getFilename = (m)=> {
	let path = m.filename.split(/[\/\\]/);
	let filename = path[path.length - 1].replace(/\.js/ig, '');
	return filename;
};
Model.tranWrap = function (context, fn) {
	return function* () {
		let tran = yield db.transaction();
		let args = Array.prototype.slice.call(arguments);
		args.push(tran);
		try {
			let ret = yield context[fn].apply(context, args);
			yield tran.commit();
			return ret;
		}
		catch (err) {
			yield tran.rollback();
			throw err;
		}
	};
}
module.exports = Model;
/**
 * Created by mac on 17/8/24.
 */
