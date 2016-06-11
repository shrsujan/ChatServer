'use strict';

var home = require('./home');

module.exports = function(app){
	app.get('/home', home.renderHome);
}