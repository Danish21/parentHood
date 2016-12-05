angular.module('appname.controllers', [])
	.controller('BaseCtrl', ['$scope', 'logoutService', 'categoryService', '$location', function ($scope, logoutService, categoryService, $location) {
		$scope.logout = function () {
			logoutService.logout();
		};
		$scope.categoryService = categoryService;
		$scope.onSelect = function ($item, $model, $label) {
			$location.path('/post/' + $item._id);
		};
	}])
	.controller('tempCtrl', ['$scope', 'logginService', 'logoutService', 'toastr', '$rootScope', '$location', function ($scope, logginService, logoutService, toastr, $rootScope, $location) {
		$scope.login = function () {
			if ($scope.email && $scope.password) {
				logginService.loggin($scope.email, $scope.password).then(function (result) {
					if (result.status === 'OK') {
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
	.controller('signupCtrl', ['$scope', 'signupService', 'toastr', '$rootScope', '$location', function ($scope, signupService, toastr, $rootScope, $location) {
		$scope.signup = function () {
			if ($scope.firstName && $scope.lastName && $scope.email && $scope.password) {
				var data = {
					email: $scope.email,
					password: $scope.password,
					firstName: $scope.firstName,
					lastName: $scope.lastName
				};
				signupService.signup(data).then(function (result) {
					if (result.status === 'OK') {
						$rootScope.currentUser = result.user;
						$location.path('/home');
					}
				});
			} else {
				toastr.error('All fields are required');
			}
		}

	}])
	.controller('homeCtrl', ['$scope', 'profileService', '$rootScope', '$uibModal', 'categoryService', 'savedPostsService', 'postService', function ($scope, profileService, $rootScope, $uibModal, categoryService, savedPostsService, postService) {
		$scope.init = function () {
			categoryService.refreshData().then(function (result) {
			});
			savedPostsService.refreshData().then(function (result) {
			});
		};

		$scope.savePost = function (post) {
			return postService.savePost(post).then(() => $scope.init())
		}

		$scope.unsavePost = function (post) {
			return postService.unsavePost(post).then(() => $scope.init())
		}

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

		$scope.getPosts = function (category) {
			return categoryService.getCategories()[category].map(post => Object.assign(post, { saved: savedPostsService.isSaved(post) }))
		}

		$scope.categoryService = categoryService;
		$scope.init();
	}])
	.controller('eventsCtrl', ['$scope', 'profileService', '$rootScope', '$uibModal', 'categoryService', '$location', function ($scope, profileService, $rootScope, $uibModal, categoryService, $location) {
		$scope.init = function () {
			$scope.calendarView = 'month';
			$scope.viewDate = new Date();
			categoryService.refreshData().then(function (result) {
				$scope.events = categoryService.getCategories()['Events'].map($scope.setStartAndEndtime);
			});
		};
		$scope.setStartAndEndtime = function (event) {
			event.startsAt = new Date(event.date);
			event.startsAt.setDate(event.startsAt.getDate() + 2);
			return event;
		};

		$scope.eventClicked = function (event) {
			$location.path('/post/' + event._id);
		}

		$scope.categoryService = categoryService;
		$scope.init();
	}])
	.controller('postsPageCtrl', ['$scope', '$routeParams', 'profileService', '$rootScope', '$uibModal', 'categoryService', 'postService', 'savedPostsService', function ($scope, $routeParams, profileService, $rootScope, $uibModal, categoryService, postService, savedPostsService) {

		$scope.init = function () {
			categoryService.refreshData().then(function (result) {
				if ($routeParams.id) {
					$scope.post = categoryService.getAllPosts().find(function (post) { return post._id == $routeParams.id });
					$scope.post.saved = savedPostsService.isSaved($scope.post);
					$scope.newComment = {
						post_id: $scope.post._id,
						user_id: $rootScope.currentUser._id
					}
					$scope.createNewComment = function () {
						postService.addComment($scope.newComment);
						$scope.newComment.text = "";
					}
				}
			});
			postService.refreshData().then(function (result) {

			});
			savedPostsService.refreshData().then(function (result) {
				if ($scope.post)
					$scope.post.saved = savedPostsService.isSaved($scope.post);
			});
		};

		$scope.savePost = function (post) {
			return postService.savePost(post).then(() => $scope.init())
		}

		$scope.unsavePost = function (post) {
			return postService.unsavePost(post).then(() => $scope.init())
		}

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

		$scope.getPosts = function (category) {
			return categoryService.getCategories()[category].map(post => Object.assign(post, { saved: savedPostsService.isSaved(post) }))
		}

		$scope.categoryService = categoryService;
		$scope.postService = postService;
		$scope.init();
	}])
	.controller('savedPostsCtrl', ['$scope', '$routeParams', '$rootScope', '$uibModal', 'postService', 'savedPostsService', '$location', function ($scope, $routeParams, $rootScope, $uibModal, postService, savedPostsService, $location) {
		$scope.init = function () {
			savedPostsService.refreshData().then(function (result) {
				$scope.savedPosts = result;
			});
		};

		$scope.unsavePost = function (post) {
			return postService.unsavePost(post).then(() => $scope.init())
		}

		$scope.open = function (post) {
			$location.path('/post/' + post._id);
		};

		$scope.savedPostsService = savedPostsService;
		$scope.init();
	}])
	.controller('newPostCtrl', ['$rootScope', '$scope', '$uibModalInstance', 'categoryService', 'postType', function ($rootScope, $scope, $uibModalInstance, categoryService, postType) {
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
	.controller('settingsCtrl', ['$scope', 'userService', 'toastr', function ($scope, userService, toastr) {
		$scope.userService = userService;
		$scope.subs = angular.copy(userService.getSubscriptions());
		$scope.text = {
			val: angular.copy(userService.getText())
		};

		$scope.save = function () {
			console.log($scope.textNotification);
			userService.updateSubscriptions($scope.subs, $scope.text.val);
			$scope.subs = angular.copy(userService.getSubscriptions());
			$scope.text = {
				val: angular.copy(userService.getText())
			};
			toastr.success('Notifications updated');
		};
		$scope.cancel = function () {
			$scope.subs = angular.copy(userService.getSubscriptions());
			$scope.text = {
				val: angular.copy(userService.getText())
			};
			toastr.warning('Update canceled');
		};
	}])
	.controller('userProfileCtrl', ['$scope', '$uibModalInstance', '$window', 'user', function ($scope, $uibModalInstance, $window, user) {
		$scope.user = user;

		$scope.mail = function () {
			$window.open("mailto:" + user.local.email + "?subject=" + "" + "&body=" + "", "_self");
		};

		$scope.block = function () {
			$uibModalInstance.dismiss('cancel');
		}
	}]);
