'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
module('login').
component('login', {
	templateUrl: 'login/login.template.html',
	controller: ['$rootScope', '$scope', '$window', 'commonService', 'loginService',
		function LoginController($rootScope, $scope,  $window, commonService, loginService) {
			if (commonService.isLogin()) {
				$window.location.href = "#!/malls";
				return;
			}
			$scope.isDisabled = false;
			$scope.login = function() {
				if (checkLoginFields() == false) {
					return;
				}
				$scope.isDisabled = true;
				var login = loginService.login($scope.bsCd, $scope.userId, $scope.password);
				login.then(function successCallback(data) {
					//jim 
					ga('send','event','로그인 페이지','click','로긴 성공');

					$scope.isDisabled = false;
					$rootScope.userId = $scope.userId;
					$window.sessionStorage.setItem("userId",$rootScope.userId);
					
					//$window.sessionStorage.setItem("authorization",$rootScope.authorization);
					$rootScope.hasMall = true;
					$window.sessionStorage.setItem("hasMall", true);
					$window.location.href = "#!/malls";
				}, function errorCallback(errorMessage) {
					//jim 
					ga('send','event','로그인 페이지','click','로긴 실패');
					$scope.isDisabled = false;
					$window.alert(errorMessage);
				});
			};
			$scope.createUser = function() {
				ga('send','event','로그인 페이지','click','가입하기');
			};
			$scope.moveGooglePlay = function() {
				ga('send','event','로그인 페이지','click','GooglePlay 이동');
				return true;
			};
			// Login 하기 전에 유효성 검증
			var checkLoginFields = function() {
				if ($scope.bsCd == undefined || $scope.bsCd === "") {
					$window.alert("회사코드를 입력하세요.");
					return false;
				}
				
				if ($scope.userId == undefined || $scope.userId === "") {
					$window.alert("ID를 입력하세요.");
					return false;
				}

				if ($scope.password == undefined || $scope.password === "") {
					$window.alert("Password를 입력하세요.");
					return false;
				}
			};
		}
	]
});