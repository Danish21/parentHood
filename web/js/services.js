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
			var url = "http://localhost:3000/api/login";
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
			var url = "http://localhost:3000/api/logout";
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
			var url = "http://localhost:3000/api/signup";
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
			var url = "http://localhost:3000/getuserinfo";
			return ulhttp.get(url,data).then(function (result) {
				result = ulhttp.handleError(result);
				return result;
			});
		}
	};
})
.factory('categoryService', function(){
	var self = this;
	var categories = {
		'Events': [],
		'Buy/Sell': [],
		'Recommendation': [],
		'Connections':[],
	};
	return {
		getCategories: function (data) {
			return categories;
		},
		addPost: function (post) {
			post.date = Date.now();
			categories[post.category].push(post);
		},
		getAllPosts: function () {
			var posts = [];
			for (var key in categories) {
			   	if (categories.hasOwnProperty(key)) {
			   		posts = posts.concat(categories[key]);
			   	}
			}
			return posts;
		}
	};
})
.factory('userService', function($rootScope, categoryService){
	var times = ['RealTime', 'Daily', 'Twice Daily', 'Unsubscribe'];
	var defaultSubs = {};
	Object.keys(categoryService.getCategories()).forEach(function(category) {
		defaultSubs[category] = 'RealTime';
	});
	return {
		getSubscriptions: function (data) {
			if ($rootScope.currentUser && $rootScope.currentUser.subs) {
				return $rootScope.currentUser.subs;
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
			$rootScope.currentUser.subs = newSubs;
		},
		getTimes: function () {
			return times;
		}
	};
});
