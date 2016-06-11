'use strict';

var jwt = require('jsonwebtoken');
var jwtSecret = require('../config').jwtSecret;
var jwtAuth = require('../jwtmiddleware').jwtAuth;

module.exports = function(server){
	var io = require('socket.io')(server);
	var connected_users = [];
	var connected_users_username = [];

	//io.use(jwtAuth({secret: jwtSecret}));

	io.on('connection', function(client){
		client.on('userAdd', function(data){
			jwt.verify(data.token, jwtSecret, function(err, decoded){
				client.userInfo = decoded;
				connected_users_username.push(client.userInfo.username);
				connected_users.push(client);
				console.log(decoded.username + ' connected');
				updateUsers();
			});
			// client.broadcast.emit('connected users', connected_users);
		});

		client.on('disconnect', function(){
			if(client.userInfo){
				console.log(client.userInfo.username + ' disconnected');
				var uIndex = connected_users_username.indexOf(client.userInfo.username);
				if(uIndex > -1) connected_users_username.splice(uIndex, 1);
			}
			var index = connected_users.indexOf(client);
			if(index > -1) connected_users.splice(index, 1);
			updateUsers();
		});
		
		client.on('chat message', function(data){
			data.userInfo = client.userInfo;
			client.broadcast.emit('chat message', data)
		});

		client.on('private message', function(data){
			data.userInfo = client.userInfo;
			connected_users.forEach(function(value){
				if(data.msg_to == value.userInfo.username){
					value.emit('private message', data);
				}
			});

			// connected_users[].emit('chat message', data)
		});

		var updateUsers = function(){
			//console.log(connected_users_username);
			io.emit('connected users', connected_users_username);
		}

	});

};