'use strict';

// Register `userSetting` component, along with its associated controller and template
angular.
module('userSetting').
component('userSetting', {
	templateUrl: 'user-setting/user-setting.template.html',
	controller: ['$rootScope', '$scope', '$http', '$window', 'commonService', 'userSettingSevice',
		function UserSettingController($rootScope, $scope, $http, $window, commonService, userSettingSevice) {
			if (!commonService.init($scope)){
				return;
			}
			
			// 각 Mall Seller의 판매 실적을 가져옴
			var reqUserInfo = userSettingSevice.getSeller();
			reqUserInfo.then(function successCallback(data) {
				if (data.errorCode === "0") {
					$scope.DC_EMIADDR = data.response.DC_EMIADDR;
					$scope.NO_CEPH = data.response.NO_CEPH;
				} else {
					// TODO: 에러 처리
				}
			}, function errorCallback(data) {
				$window.alert(data.message);
			});

			$scope.updateUser = function() {
				if (checkUserFields() == false) {
					return;
				}
				
				var updateUser = userSettingSevice.modifySeller(getUpdateUserBody());
				updateUser.then(function successCallback(data) {
					if (data.errorCode === "0") {
						$scope.newPwd = "";
						$scope.confirmPwd = "";

						$window.alert("사용자 정보가 수정되었습니다.");
					} else {
						// TODO: 에러 처리
					}
				}, function errorCallback(data) {
					$window.alert(data.message);
				});

				function getUpdateUserBody() {
					var body = {
						"DC_ID"  : $scope.userId,
						"DC_EMIADDR": $scope.DC_EMIADDR,
						"NO_CEPH": $scope.NO_CEPH
					};

					if (!($scope.newPwd == undefined) && !($scope.newPwd === "")) {
						body.DC_PWD = $scope.newPwd;
						body.NEW_DC_PWD = $scope.newPwd;
					}

					return body;
				};
			};

			// Seller를 수정 하기 전에 유효성 검증
			var checkUserFields = function() {
				if ($scope.DC_EMIADDR == undefined || $scope.DC_EMIADDR === "") {
					$window.alert("이메일을 입력하세요.");
					return false;
				}

				if ($scope.NO_CEPH == undefined || $scope.NO_CEPH === "") {
					$window.alert("휴대폰 번호를 입력하세요.");
					return false;
				}

				if ($scope.newPwd === "" && $scope.confirmPwd === "") {
					// 이건 단순히 정보 업데이트
					return true;
				}
				if ($scope.newPwd === undefined && $scope.confirmPwd === undefined) {
					// 이건 단순히 정보 업데이트
					return true;
				}

				if ($scope.newPwd == undefined || $scope.newPwd === "") {
					$window.alert("새로운 비밀번호를 입력하세요.");
					return false;
				}

				if ($scope.confirmPwd == undefined || $scope.confirmPwd === "") {
					$window.alert("확인할 비밀번호를 입력하세요.");
					return false;
				}

				if ($scope.newPwd === $scope.confirmPwd) {
					// 새로 변경할 비밀번호가 일치
					return true;
				}

				$window.alert("변경할 비밀번호가 일치하지 않습니다.");
				return false;
			};
		}
	]
});