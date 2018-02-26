'use strict';

// Register `userCreate` component, along with its associated controller and template
angular.
module('userCreate').
component('userCreate', {
	templateUrl: 'user-create/user-create.template.html',
	controller: ['$rootScope', '$scope', '$http', '$window', 'commonService', 'userCreateSevice',
		function UserCreateController($rootScope, $scope, $http, $window, commonService, userCreateSevice) {
			$scope.login = function(){
				$window.location.href = "#!/login";
			};
			$scope.isDisabled = false;
			$scope.createUser = function() {
				if (checkUserFields() == false) {
					return;
				}
				$scope.isDisabled = true;
				var newUserReq = userCreateSevice.createUser(getCreateUserBody());
				
				newUserReq.then(function successCallback(data) {
					$scope.isDisabled = false;
					//jimga
					ga('send','event','로그인 페이지','click','가입하기 성공');
					if (data.errorCode === "0") {
						ga('send','event','로그인 페이지','click','가입하기 성공');
						$window.alert($scope.userId + "님이 가입되었습니다.");
						$window.location.href = "#!/login";
						
					} else {
						ga('send','event','로그인 페이지','click','가입하기 실패');
						// TODO: 에러 처리
					}
				}, function errorCallback(data) {
					$scope.isDisabled = false;
					$window.alert(data.message);
				});

				function getCreateUserBody() {
					var body = {
						// "sellerId": $scope.userId,
						"email": $scope.email,
						"mobile": $scope.mobile,
						// "sellerPwd": $scope.pwd
						"username": $scope.userId,
						"password": $scope.pwd
					};

					return body;
				};
			};

			// Seller를 생성하기 전에 유효성 검증
			var checkUserFields = function() {
				if ($scope.userId == undefined || $scope.userId === "") {
					$window.alert("User ID를 입력하세요."); // TODO: 글자 제한 표시 및 유효성 검증 필요
					return false;
				}

				if ($scope.email == undefined || $scope.email === "") {
					$window.alert("email을 입력하세요."); // TODO: 이메일 여부 확인 및 인증 필요??
					return false;
				}

				if ($scope.mobile == undefined || $scope.mobile === "") {
					$window.alert("휴대폰 번호를 입력하세요.");
					return false;
				}

				if ($scope.pwd == undefined || $scope.pwd === "") {
					$window.alert("비밀번호를 입력하세요.");
					return false;
				}

				if ($scope.confirmPwd == undefined || $scope.confirmPwd === "") {
					$window.alert("확인할 비밀번호를 입력하세요.");
					return false;
				}

				if ($scope.pwd === $scope.confirmPwd) {
					// 두 비밀번호가 일치
					return true;
				}

				$window.alert("두 비밀번호가 일치하지 않습니다.");
				return false;
			};
		}
	]
});