'use strict';

var Sequelize =  require('sequelize');
var db = require('../../lib/db');

var users = db.define('users', {
	id: {
		type: Sequelize.INTEGER,
		field: 'id',
		primaryKey: true,
		autoIncrement: true
	},
	first_name: {
		type: Sequelize.STRING,
		field: 'first_name',
		allowNull: false
	},
	last_name: {
		type: Sequelize.STRING,
		field: 'last_name',
		allowNull: false
	},
	phone: {
		type: Sequelize.STRING,
		field: 'phone',
		allowNull: false
	},
	username: {
		type: Sequelize.STRING,
		field: 'username',
		unique: true,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		field: 'email',
		unique: true,
		validate: {
			isEmail: true
		},
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		field: 'password',
		allowNull: false
	},
	status: {
		type: Sequelize.BOOLEAN,
		field: 'status',
		allowNull: false,
		defaultValue: 1
	},
	is_deleted: {
		type: Sequelize.BOOLEAN,
		field: 'is_deleted',
		allowNull: false,
		defaultValue: 0
	},
	createdAt: {
		type: Sequelize.DATE,
		field: 'created_at',
		allowNull: false,
		defaultValue: Sequelize.NOW
	},
	updatedAt: {
		type: Sequelize.DATE,
		field: 'updated_at',
		allowNull: false,
		defaultValue: Sequelize.NOW
	}
}, {
	freezeTableName: true
});

users.sync();

module.exports = users;