angular.module('appname.services',[])
.factory('ulhttp', function ($http,toastr) {
	return {
		handleError: function (result) {
			result = result.data;
			if(result.status!== 'OK'){
				toastr.error(result.message);
			}
			return result;
		},
		post: function (url, data) {
			return $http.post(url,data);
		},
		get: function (url,data) {
			return $http.get(url, data);
		}
	};
})
.factory('logginService', function(ulhttp){
	return {
		loggin: function (email,password) {
			var url = "/api/login";
			var data = {
				email: email,
				password: password
			};
			return ulhttp.post(url,data).then(function (result) {
				result = ulhttp.handleError(result);
				return result;
			});
		}
	};
})
.factory('logoutService', function(ulhttp,$rootScope,toastr, $location){
	return {
		logout: function (email,password) {
			var url = "/api/logout";
			ulhttp.get(url).then(function (result) {
				if(result.data.status === 'OK'){
					toastr.success('Logged Out');
					$location.path('/login');
				} else {
					toastr.error('Something went wrong');
				}
			});
		}
	};
})
.factory('signupService', function(ulhttp){
	return {
		signup: function (data) {
			var url = "/api/signup";
			return ulhttp.post(url,data).then(function (result) {
				result = ulhttp.handleError(result);
				return result;
			});
		}
	};
})
.factory('profileService', function(ulhttp){
	return {
		getUserInfo: function (data) {
			var url = "/getuserinfo";
			return ulhttp.get(url,data).then(function (result) {
				result = ulhttp.handleError(result);
				return result;
			});
		}
	};
})
.factory('categoryService', function(ulhttp){
	var self = this;
	var categories = {
		'Alerts' : [],
		'Events': [],
		'Buy/Sell': [],
		'Recommendations': [],
		'Connections':[],
	};
	var filterByCat = function (cat, post) {
		return post.category === cat;
	}
	var service = {
		getCategories: function (data) {
			return categories;
		},
		refreshData: function () {
			var url = "/api/posts";
			return ulhttp.get(url,{}).then(function (result) {
				posts = ulhttp.handleError(result).posts;
				categories = {
					'Alerts' : posts.filter(filterByCat.bind(this, 'Alerts')),
					'Events': posts.filter(filterByCat.bind(this, 'Events')),
					'Buy/Sell': posts.filter(filterByCat.bind(this, 'Buy/Sell')),
					'Recommendations': posts.filter(filterByCat.bind(this, 'Recommendations')),
					'Inquiries': posts.filter(filterByCat.bind(this, 'Inquiries')),
				};
				return posts;
			});
		},
		addPost: function (post) {
			var url = "/api/posts";
			return ulhttp.post(url, post).then(function (result) {
				result = ulhttp.handleError(result);
				return service.refreshData();
			});
		},
		getAllPosts: function () {
			var posts = [];
			for (var key in categories) {
			   	if (categories.hasOwnProperty(key)) {
			   		posts = posts.concat(categories[key]);
			   	}
			}
			return posts;
		},
		mostRecentAlert: function() {
			var alerts = categories['Alerts'];
			return (alerts && alerts.length > 0) ? alerts[alerts.length-1] : {};
		}
	};
	return service;
})
.factory('userService', function($rootScope, categoryService){
	var times = ['RealTime', 'Daily', 'Twice Daily', 'Unsubscribe'];
	var defaultSubs = {};
	Object.keys(categoryService.getCategories()).forEach(function(category) {
		defaultSubs[category] = 'RealTime';
	});
	var subs = null;
	return {
		getSubscriptions: function (data) {
			if (subs) {
				return subs;
			} else {
				return defaultSubs;
			}
		},
		updateSubscriptions: function (update) {
			var newSubs = {};
			for (var key in update) {
			   	if (update.hasOwnProperty(key)) {
			   	  	if (update[key] !== 'Unsubscribe') {
			   	  		newSubs[key] = update[key];
			   	  	}
			   	}
			}
			subs = newSubs;
		},
		getTimes: function () {
			return times;
		}
	};
});
