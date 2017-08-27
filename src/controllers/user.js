/**
 * Created by mac on 17/4/27.
 */
'use strict'


function User() {
};
let that = module.exports = new User();

User.prototype.signUp = function*(req, res, next) {
	const {account, password, phone, nickName} = req.body;
	const token = Date.parse(new Date());
	let hasAccount = yield models.user.hasAccount({account});
	console.log(hasAccount);
	if (hasAccount) {
		throw new Exception(10001);
		return;
	}
	let ret0 = yield models.user.create({account, phone, nickName});
	let ret0Json = Object.assign(ret0.dataValues);
	const userId = ret0.id;
	let ret1 = yield models.token.create({userId, password, token})
	ret0Json.token = ret1.token;
	console.log(ret1.token, ret0Json);
	return ret0Json
}

User.prototype.signIn = function*(req, res, next) {
	const {account, password} = req.body;
	let userInfo = yield models.user.get({account}, {throwError: false});
	if (!userInfo) {
		throw new Exception(10002);
		return;
	}
	let tokenInfo = yield models.token.get({userId: userInfo.id}, {throwError: false});
	if (tokenInfo.password !== password) {
		throw new Exception(10003);
		return;
	}
	const token = Date.parse(new Date());
	yield models.token.update({userId: userInfo.id},{token})
	userInfo.token = token;
	return userInfo;
}


