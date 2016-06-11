'use strict';

var chatBox = require('./chatBox');

module.exports = function(app){
	app.get('/chatBox', chatBox.renderChatBox);
}