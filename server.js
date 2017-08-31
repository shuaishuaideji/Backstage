/**
 * Module dependencies.
 */

var express = require('express');
var Sequelize = require('sequelize');
/**
 * Create app.
 */

app = express();
var sequelize = new Sequelize('test', 'root', '12345678');
var bodyParser = require('body-parser');

/**
 * Configure app.
 */

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false})
app.use(express.static('resources'));
app.use(bodyParser());
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Credentials','true');
	next();
};
app.use(allowCrossDomain)
/**
 * Main route
 */
var User = sequelize.define('User', {
		id: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: 'int(11)',
			field: 'id'
		},
		account: {
			type: 'varchar(20)',
			field: 'account',
		},
		password: {
			type: 'int(11)',
			field: 'password'
		},
	}
	, {
		tableName: 'user',
		createdAt: false,
		updatedAt: false
	});

app.get('/', function (req, res, next) {
    User.findOne({
		account: 'fengwenhua',
	}).then((re)=>{res.json(re)})
	// res.render('login');
});
app.post('/sign', function (req, res, next) {
	User.create({
		account: req.body.account,
		password: req.body.password,
	})
});

app.listen(10086, function () {
	console.log(' - listening on http://localhost:10086');
});

