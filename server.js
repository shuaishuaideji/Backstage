/**
 * Module dependencies.
 */

var express = require('express');
var Sequelize = require('sequelize');
var routers = require('./src/routers')
require('./src/common/global.js');

/**
 * Create app.
 */

app = express();
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
routers(app);


app.listen(10000, function () {
	console.log(' - listening on http://localhost:10000');
});

