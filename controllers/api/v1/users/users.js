'use strict';

var jwt = require('jsonwebtoken');
var jwtSecret = require('../../../../config').jwtSecret;

module.exports = {

	collect: function(req, res, next){
		var fields = ['username'];
		var reqdata = {};
		fields.forEach(function(entry){
			if(typeof(req.body[entry] != 'undefined'))
				reqdata[entry] = req.sanitize(req.body[entry]);
			if(typeof(req.query[entry]) != 'undefined')
				reqdata[entry] = req.sanitize(req.query[entry]);
			if(typeof(req.params[entry]) != 'undefined')
				reqdata[entry] = req.sanitize(req.params[entry]);
		});
		req.cb_userData = reqdata;
		next();
	},

	getUser: function(req, res, next){
		if(!req.cb_userData.username) next(new Error("username not provided"));
		if(req.cb_userData.username){
			var options = {
				where: {
					username: req.cb_userData.username
				}
			};
			req.users.read(options, success, error);
			function success(result){
				if(result == '') next(new Error("no such username not found"));
				else{
					req.cdata = {
						success: 1,
						message: "user info retrieved successfully",
						data: result
					};
					next();
				}
			}
			function error(err){
				if(err) next(err);
			}
		}
	},

	getAllUsers: function(req, res, next){
		var options = {
			where: {
				is_deleted: 0,
				username: {
					$ne: req.user.username
				}
			}
		};
		req.users.read(options, success, error);
		function success(result){
			if(result == ''){
				req.cdata = {
					success: 1,
					message: "No users in the table"
				};
				next();
			} else{
				req.cdata = {
					success: 1,
					message: "users retrieved successfully",
					data: result
				};
				next();
			}
		}
		function error(err){
			if(err) next(err);
		}
	},

	refreshToken: function(req, res, next){
		if(typeof(req.refreshTokenData) == 'undefined'){
			res.status(401).json({
				result: 'failure',
				success: 0,
				error: 1,
				error_msg: 'Middleware error',
				statusCode: 401
			});
		} else{
			let accessToken = jwt.sign({id: req.refreshTokenData.id, username:req.refreshTokenData.username, email:req.refreshTokenData.email}, jwtSecret, {expiresIn: 10});
			res.status(401).json({
				result: 'failure',
				success: 0,
				error: 1,
				error_msg: 'Refresh token to be provided here',
				token: accessToken,
				statusCode: 401
			});
		}
	}
};