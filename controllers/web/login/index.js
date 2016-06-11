'use strict';

var login = require('./login');

module.exports = function(app){
	app.get('/', login.layout);
	app.get('/login', login.login);
	app.get('/signup', login.signup);
}