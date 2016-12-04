angular.module('summerproject',['ngRoute', 'ngResource','appname.controllers', 'appname.services','ngAnimate','toastr', 'ui.bootstrap', 'angularMoment', 'ui.rCalendar', 'mwl.calendar']).
	config(['$routeProvider', 'toastrConfig', function($routeProvider, toastrConfig) {
		'use strict';
		$routeProvider.
		 when('/login', {title: 'Home', templateUrl: 'partials/login.html', controller: 'tempCtrl', resolve: {loginRedirect: loginRedirect }})
		.when('/signup', {title: 'signup', templateUrl: 'partials/signup.html', controller: 'signupCtrl'})
		.when('/home', {title: 'Home', templateUrl: 'partials/home.html', controller: 'homeCtrl', resolve: {logincheck: checkLogin}})
		.when('/Ask the NeighborHood', {title: 'Ask the NeighborHood', templateUrl: 'partials/connections.html', controller: 'postsPageCtrl', resolve: {logincheck: checkLogin}})
		.when('/saved_posts', {title: 'Saved Posts', templateUrl: 'partials/saved-posts.html', controller: 'savedPostsCtrl', resolve: {logincheck: checkLogin}})
		.when('/events', {title: 'Events', templateUrl: 'partials/events.html', controller: 'eventsCtrl', resolve: {logincheck: checkLogin}})
		.when('/post/:id', {title: 'Post', templateUrl: 'partials/connection.html', controller: 'postsPageCtrl', resolve: {logincheck: checkLogin}})
		.when('/settings', {title: 'Settings', templateUrl: 'partials/settings.html', controller: 'settingsCtrl', resolve: {logincheck: checkLogin}})
		.otherwise({ redirectTo: '/login'});

		angular.extend(toastrConfig, {
		    positionClass: 'toast-top-center',
  		});
	}]).
    run(['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {

    	var loginSetIntialData = function () {

			$http.get('/api/loggedin').success(function (user) {
				if (user!=0) {
					$rootScope.currentUser = user;
				}
				//User is not Authenticated
				else {
					$rootScope.currentUser =undefined;
				}
			}).error(function(result){
				$rootScope.currentUser =undefined;
			});
		}();

    }]);

	var checkLogin =  function  ($q, $http, $location,$rootScope,toastr) {
		var deffered = $q.defer();

		$http.get('/api/loggedin').success(function (user) {
			//User is authenticated
			if (user!=0) {
				$rootScope.currentUser = user;
				deffered.resolve();
			}
			//User is not Authenticated
			else {
				$rootScope.currentUser = undefined;
				deffered.reject();
				$location.url('/login');
				toastr.error('Please Login First');
			}
		}).error(function(result){
			$location.url('/login');
		});

	};

	var loginRedirect = function ($q, $http, $location,$rootScope) {
		var deffered = $q.defer();
		$http.get('/api/loggedin').success(function (user) {
			//User is authenticated
			if (user!=0) {
				$rootScope.currentUser = user;
				deffered.reject();
				$location.url('/home');
			}
			//User is not Authenticated
			else {
				$rootScope.currentUser = undefined;
				deffered.resolve();
			}
		})
	};
