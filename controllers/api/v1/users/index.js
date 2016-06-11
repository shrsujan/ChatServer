'use strict';

var users = require('./users');
var mw = require('../middleware');
var version = require('../../../../config').versions.v1;

module.exports = function(app){
	app.get(version + '/users/view', users.getAllUsers, mw.respond, mw.error);
	app.post(version + '/users/view', users.collect, users.getUser, mw.respond, mw.error);
	app.get(version + '/users/refreshToken', users.refreshToken, mw.respond, mw.error);
}