/**
 * Created by mac on 17/5/23.
 */
module.exports = function (app) {
	app.post('/post', run(ctrls.post.savePost));
	app.get('/postList', run(ctrls.post.getPostList));
}
