/**
 * Created by mac on 17/4/27.
 */
'use strict'

module.exports = function (app) {
	app.post('/signUp', run(ctrls.user.signUp));
	app.post('/login', run(ctrls.user.signIn));

}