'use strict';

var Sequelize = require('sequelize');
var db = require('../config').db;

var sequelize = new Sequelize(db.database, db.user, db.password, {
	host: db.host,
	dialect: 'mysql',
	timezone: '+05:45',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

module.exports = sequelize;