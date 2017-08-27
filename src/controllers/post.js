/**
 * Created by mac on 17/5/23.
 */
'use strict'
let moment = require('moment');


function Post() {
};
let that = module.exports = new Post();

Post.prototype.savePost = function*(req, res, next) {
	const title = req.body.title;
	const context = req.body.context;
	const createdAt = moment().format('YYYY-MM-DD HH:mm');
	const userId = req.userId;
	let yet = yield models.post.create({title, context, createdAt, userId});
	return yet;
}

Post.prototype.getPostList = function*(req, res, next) {
	const pageSize = parseInt(req.query.pageSize) || 3;
	const page = parseInt(req.query.page) || 1;
	const offset = (page - 1) * pageSize;
	const limit = pageSize;
	let yet = yield models.post.find({},{limit: limit, offset: offset});
	return yet;
}


