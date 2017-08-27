#!/usr/bin/env node

'use strict'
var fs = require('fs');
var path = require('path');
const constant = require('../src/common/constant.js');
const runEnv = process.env.NODE_ENV || 'production';
const Consul = require('zhike-consul');
const pkg = require('../package.json');
const cfgCenter = pkg.consulCfg[runEnv];
const cfgCenterURI = require('url').parse(cfgCenter.url);
var Sequelize = require('sequelize');
global.co = require('co');
global.thunkify = require('thunkify-wrap');
global.Sequelize = require('sequelize');

global._ = require('lodash');
require('../src/common/func.js');


