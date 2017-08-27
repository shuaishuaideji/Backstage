/**
 * Created by mac on 17/4/27.
 */
/**
 * Created by SMALLWOLF on 2016/12/7.
 */
'use strict'

require('./global.js');
let pkg = PKG;
let restify = require('restify');
let CookieParser = require('restify-cookies');
const redis = require('redis')
const redisClient = redis.createClient();
let reqLog = require('debug')(pkg.name + ':server');
reqLog.log = console.log.bind(console);
let router = require('../routers');
restify.CORS.matchOrigin = function () {
	return true;
}
let server = restify.createServer({
	name: pkg.name,
	version: '1.0.1',
	formatters: Object.assign({}, {
		'text/html': function (req, res, body, cb) {
			if (body instanceof Error) {
				res.statusCode = body.statusCode || 500;
			}

			if (!Buffer.isBuffer(body)) {
				body = new Buffer(body.toString());
			}

			res.setHeader('Content-Length', body.length);
			res.setHeader('Content-Type', 'text/html');
			return cb(null, body);
		}
	}, restify.formatters)
});
server.use(restify.CORS({
	credentials: true
}));
//server.use(restify.requestLogger({
//  log: bunyan.createLogger({
//    name: pkg.name,
//    stream: process.stdout
//  })
//}));
server.use(restify.queryParser({plainObjects: false}));
server.use(CookieParser.parse);
server.use(restify.bodyParser({
	maxBodySize: 0,
	mapParams: false,
	mapFiles: false,
	overrideParams: false,
	keepExtensions: true,
	uploadDir: require('os').tmpdir(),
	multiples: true,
	//hash: 'sha1'
}));
//server.on('after', restify.auditLogger({
//  log: bunyan.createLogger({
//    name: 'audit',
//    stream: process.stdout
//  })
//}));
server.use(run(function* getUserInfo(req, res, next) {
	if (req.query) {
		req.token = req.query.token;
		delete req.query.token;
	}
	if (req.body && !req.token) {
		req.token = req.body.token;
		delete req.body.token;
	}
	if (!req.token) {
		req.token = 'unknown';
	}
	req.userId = '';

	if (req.token === 'unknown') {
		next();
		return;
	}
	console.log(models.token.get);
	const userId = redisClient.get(`token${req.token}123`, function (err, reply) {
		console.log('--------', reply.toString()); // Will print `OK`
	});
	console.log('-----', userId);

	let tokenInfo = yield models.token.get({token: req.token}, {throwError: false});
	if(tokenInfo){
		req.userId = tokenInfo.userId;
		redisClient.set(`token${req.token}`, tokenInfo.userId);
		next();
	} else {
		throw new Exception(10004);
	}


}));

router(server);




server.on('NotFound', run(function*(request, response, route, cb) {
	let err = new Exception(20002, route.message);
	throw err;
}));
server.on('MethodNotAllowed', run(function*(request, response, route, cb) {
	let err = new Exception(20005, route.message);
	throw err;
}));
server.on('VersionNotAllowed', run(function*(request, response, route, cb) {
	let err = new Exception(20006, route.message);
	throw err;
}));
server.on('uncaughtException', function (request, response, route, error) {
	let err = new Exception(20009);
	err.msg += `[${error.message}]`;
	console.error(request.url, error.stack || error);
	response.send(err);
});
server.listen(10000);
console.log('localhost:10000')
module.exports = server;


