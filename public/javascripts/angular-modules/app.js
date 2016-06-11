'use strict';

var dependencies = [
	'ui.router',
	'ngMaterial',
	'ngAnimate',
	'controllers',
	'webService'
];

var myApp = angular.module('myApp', dependencies);

myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider){
	$httpProvider.interceptors.push('authInterceptor');

	$urlRouterProvider.otherwise('404');

	$stateProvider
		.state('home', {url: '/', templateUrl: '/home', controller: 'mainController'})
			.state('home.chatBox', {views:{'def':{templateUrl: '/chatBox', controller: 'chatController'}}, url: 'chatBox'})
			.state('home.privateChat', {views:{'def':{templateUrl: '/chatBox', controller: 'privateChatController'}}, url:'private/:username'})
		.state('root', {url: '', controller: 'rootController'})
		.state('login', {url: '/login', templateUrl: '/login', controller: 'loginController'})
		.state('signup', {url: '/signup', templateUrl: '/signup', controller: 'loginController'})
		.state('404', {url: '/404', templateUrl: '/404', controller: '404'})
}]);