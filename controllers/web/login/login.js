'use strict';

var config = require('../../../config');
var jwt = require('jsonwebtoken');
var jwtSecret = config.jwtSecret;

module.exports = {

	layout: function(req, res, next){
		res.render('layout');
	},

	login: function(req, res, next){
		res.render('login/login');
	},

	signup: function(req, res, next){
		res.render('login/signup');
	}

}