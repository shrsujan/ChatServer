'use strict';

var service = angular.module("webService" ,[]);
	
service.factory('authInterceptor', ['$rootScope', '$q', '$window', '$injector', function($rootScope, $q, $window, $injector) {
	var inFlightAuthRequest = null;
	return {
		request: function(config) {
			config.headers = config.headers || {};

			if($window.localStorage.cb_token){
				config.headers.Authorization = 'Bearer ' + $window.localStorage.cb_token;
			}
			if($window.sessionStorage.cb_refreshToken){
				config.headers.RefreshAuthorization = 'Bearer ' + $window.sessionStorage.cb_refreshToken;
			}
			return config;
		},
		responseError: function(response) {
			if(response.status === 401){
				if(response.data.errorCode){
					switch (response.data.errorCode	){
						case 401:
							var deferred = $q.defer();
							if(!inFlightAuthRequest){
								$window.sessionStorage.cb_refreshToken = response.data.refreshToken;
								inFlightAuthRequest = $injector.get("$http").get('/api/v1/users/refreshToken');
							}
							inFlightAuthRequest.then(function(r){
								inFlightAuthRequest = null;
								if(r.data.token){
									$window.localStorage.cb_token = r.data.token;
									$injector.get("$http")(response.config).then(function(resp){
										deferred.resolve(resp);
									}, function(resp){
										deferred.reject();
									});
								} else{
									deferred.reject();
								}
							}, function(response){
								inFlightAuthRequest = null;
								deferred.reject();
								delete $window.localStorage.cb_token;
								delete $window.sessionStorage.cb_refreshToken;
								$injector.get("state").go("login");
							});
							return deferred.promise;
							break;

						default:
							delete $window.localStorage.cb_token;
							delete $window.sessionStorage.cb_refreshToken;
							$injector.get("state").go("login");
							break;
					}
				}
			}
			return response || $q.when(response);
		}
	};
}]);


service.factory('socket', ['$rootScope', function ($rootScope) {

    var socket = io.connect();
    var disconnecting;

    return {

		on: function (eventName, callback) {
			// socket.on(eventName, callback);
			socket.on(eventName, function () {

			  	var args = arguments;
			  	if (!disconnecting) {
			    	$rootScope.$apply(function () {
			      		callback.apply(socket, args);
					});
			  	}/* else {
			    	callback.apply(socket, args);
			  	}*/
			});
		},

		emit: function (eventName, data, callback) {
			// socket.emit(eventName, data, token);
			if(!disconnecting){
				socket.emit(eventName, data, function () {
				  var args = arguments;
				  $rootScope.$apply(function () {
				    if (callback) {
				      callback.apply(socket, args);
				    }
				  });
				});
			}
		},

		pause: function () {
			disconnecting = true;
			// socket.disconnect();
		},

		resume: function(){
			disconnecting = false;
		},

		connect: function(callback){
			disconnecting = false;
			if(callback) callback();
		},

		disconnect: function () {
			disconnecting = true;
			// socket.disconnect();
		},

		socket: socket

	}
	
}]);

service.service('currentUserInfo', ['$http', function($http){
	
}]);