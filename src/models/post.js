/**
 * Created by mac on 17/5/23.
 */

'use strict'
let util = require('util');
let BaseModel = require('./base.js');
let Model = function () {
	BaseModel.call(this, BaseModel.getFilename(module));
};
util.inherits(Model, BaseModel);
let that = module.exports = new Model();


Model.prototype.create = function* (where) {
	let ret = yield this.orm.create(where);
	return ret;
};