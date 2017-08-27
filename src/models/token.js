/**
 * Created by mac on 17/4/27.
 */
'use strict'
let util = require('util');
let BaseModel = require('./base.js');
let Model = function () {
	BaseModel.call(this, BaseModel.getFilename(module));
};
util.inherits(Model, BaseModel);
let that = module.exports = new Model();


/*
 Model.prototype.Demo = function* (){};
 */

Model.prototype.create = function* (data) {
	let ret = yield this.orm.create(data);
	return ret;
};
