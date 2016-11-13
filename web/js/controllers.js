angular.module('appname.controllers',[])
.controller('BaseCtrl', ['$scope', 'logoutService', 'categoryService',  function ($scope,logoutService, categoryService) {
        $scope.logout = function () {
        	logoutService.logout();
        };
        $scope.categoryService = categoryService;
        $scope.onSelect = function ($item, $model, $label) {
		    console.log($item);
		    console.log($model);
		    console.log($label);
		};
 }])
.controller('tempCtrl',['$scope', 'logginService', 'logoutService','toastr','$rootScope','$location', function($scope, logginService,logoutService,toastr,$rootScope,$location){
	$scope.login = function () {
		if ($scope.email && $scope.password) {
			logginService.loggin($scope.email,$scope.password).then(function (result) {
				if(result.status === 'OK'){
					$rootScope.currentUser = result.user;
					$location.path('/home');
					toastr.success('Logged In');
				}
			});
		} else {
			toastr.error('Must provide a valid email and password');
		}
	};
}])
.controller('signupCtrl',['$scope','signupService','toastr','$rootScope','$location', function($scope,signupService,toastr,$rootScope,$location){
	$scope.signup = function () {
		if($scope.firstName && $scope.lastName && $scope.email && $scope.password){
			var data= {
				email: $scope.email,
				password: $scope.password,
				firstName: $scope.firstName,
				lastName: $scope.lastName
			};
			signupService.signup(data).then(function (result) {
				if(result.status === 'OK'){
					$rootScope.currentUser = result.user;
					$location.path('/home');
				}
			});
		} else {
			toastr.error('All fields are required');
		}
	}
	
}])
.controller('homeCtrl',['$scope','profileService','$rootScope', '$uibModal', 'categoryService', function($scope, profileService, $rootScope, $uibModal, categoryService){
	$scope.getuserinfo = function () {
		profileService.getUserInfo().then(function (result) {
			if(result.status === 'OK'){
				$scope.user = result.user;
			} 
		});
	};
	$scope.openUserInfo = function (user) {
		var modalInstance = $uibModal.open({
			templateUrl: './partials/profile-modal.html',
			controller: 'userProfileCtrl',
			resolve: {
				user: function () {
					return user;
				}
			}
		}).result.then(function (newPost) {
	      	console.log("resolved");
	    }, function () {
	      	console.log('dismissed');
	    });
	};
  	$scope.open = function (type) {
		var modalInstance = $uibModal.open({
			templateUrl: './partials/new-post.html',
			controller: 'newPostCtrl',
			resolve: {
				postType: function () {
					return type;
				}
			}
		}).result.then(function (newPost) {
	      	categoryService.addPost(newPost);
	    }, function () {
	      	console.log('dismissed');
	    });
	};
	$scope.categoryService = categoryService;
	$scope.getuserinfo();
}])
.controller('newPostCtrl',['$rootScope', '$scope', '$uibModalInstance', 'categoryService', 'postType', function($rootScope, $scope, $uibModalInstance, categoryService, postType){
	$scope.categoryService = categoryService;
	$scope.post = {
		category: (postType) ? postType : Object.keys(categoryService.getCategories())[0],
		user: $rootScope.currentUser
	};

	$scope.ok = function () {
		$uibModalInstance.close($scope.post);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}])
.controller('settingsCtrl',['$scope','userService', function($scope, userService){
	$scope.userService = userService;
	$scope.subs = angular.copy(userService.getSubscriptions());

	$scope.save = function() {
		userService.updateSubscriptions($scope.subs);
		$scope.subs = angular.copy(userService.getSubscriptions());
	};
	$scope.cancel = function() {
		$scope.subs = angular.copy(userService.getSubscriptions());
	};
}])
.controller('userProfileCtrl',['$scope','$uibModalInstance', '$window', 'user', function($scope, $uibModalInstance, $window, user){
	$scope.user = user;
	console.log(user);

	$scope.mail = function() {
    	$window.open("mailto:"+ user.local.email + "?subject=" + "" +"&body="+ "","_self");
	};

	$scope.block = function() {
		$uibModalInstance.dismiss('cancel');
	}
}]);