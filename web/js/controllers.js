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
	$scope.init = function () {
		categoryService.refreshData().then(function (result) {
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
			console.log('added post');
	    }, function () {
	      	console.log('dismissed');
	    });
	};

	$scope.categoryService = categoryService;
	$scope.init();
}])
.controller('newPostCtrl',['$rootScope', '$scope', '$uibModalInstance', 'categoryService', 'postType', function($rootScope, $scope, $uibModalInstance, categoryService, postType){
	$scope.categoryService = categoryService;
	$scope.post = {
		category: (postType) ? postType : Object.keys(categoryService.getCategories())[0],
		user_id: $rootScope.currentUser._id,
	};

	$scope.ok = function () {
		categoryService.addPost($scope.post).then(function (result) {
			$uibModalInstance.close('good');
		});		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}])
.controller('settingsCtrl',['$scope','userService', 'toastr', function($scope, userService, toastr) {
	$scope.userService = userService;
	$scope.subs = angular.copy(userService.getSubscriptions());

	$scope.save = function() {
		userService.updateSubscriptions($scope.subs);
		$scope.subs = angular.copy(userService.getSubscriptions());
		toastr.success('Notifications updated');
	};
	$scope.cancel = function() {
		$scope.subs = angular.copy(userService.getSubscriptions());
		toastr.warning('Update canceled');
	};
}])
.controller('userProfileCtrl',['$scope','$uibModalInstance', '$window', 'user', function($scope, $uibModalInstance, $window, user){
	$scope.user = user;

	$scope.mail = function() {
    	$window.open("mailto:"+ user.local.email + "?subject=" + "" +"&body="+ "","_self");
	};

	$scope.block = function() {
		$uibModalInstance.dismiss('cancel');
	}
}]);