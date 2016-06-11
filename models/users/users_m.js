'use strict';

var users = require('./tbl_users');

module.exports = {
	create: function(options, success, error){
		users.create(options.data).then(success, error);
	},

	read: function(options, success, error){
		users.findAll({where: options.where}).then(success, error);
	},

	update: function(options, success, error){
		users.update(options.data, {where: options.where}).then(success, error);
	},

	authenticate: function(options, success, error){
		var query = {
			where: {
				$or: {
					username: options.where.username,
					email: options.where.username
				}
			}
		}
		users.findAll(query).then(success, error);
	}
}