'use strict';

// Register `mallConfig` component, along with its associated controller and template
angular.
module('mallConfig').
component('mallConfig', {
	templateUrl: 'mall-config/mall-config.template.html',
	controller: ['$rootScope', '$scope', '$window', '$anchorScroll', '$location', 'commonService', 'mallConfigSevice',
		function MallConfigController($rootScope, $scope, $window, $anchorScroll, $location, commonService, mallConfigSevice) {
			if (!commonService.init($scope)){
				return;
			}
			$scope.isEditing = false;
			$scope.isDisabled = false;
			$scope.showForm = function() {
				$scope.isFormVisible = true;
			};
			var reqMallSeller = mallConfigSevice.getMallSeller();
			reqMallSeller.then(function successCallback(data) {
				if (data.errorCode === "0") {
					$scope.mallConfiguration = data.response;
					if($scope.mallConfiguration.length == 0){
						$rootScope.hasMall = false;
						$window.sessionStorage.setItem("hasMall", false);
					}
				} else {
					// TODO: 에러처리
				}
			}, function errorCallback(data) {
				//$window.alert(data.message);
			});

			// Seller Tool에서 관리하는 Mall들의 리스트를 가져옴
			var reqMallList = mallConfigSevice.getMall();
			reqMallList.then(function successCallback(data) {
				if (data.errorCode === "0") {
					$scope.mallList = data.response;
				} else {
					// TODO: 에러처리
				}
			}, function errorCallback(data) {
				//$window.alert(data.message);
			});

			// Mall Seller 리스트의 Edit 버튼을 누르면 해당 id의 것을 편집하도록
			$scope.editMall = function(NO_MRK) {
				$scope.editingMallId = NO_MRK;
				$scope.isEditing = true;
				$anchorScroll();
				for (var i = 0; i < $scope.mallConfiguration.length; i++) {
					if ($scope.mallConfiguration[i].NO_MRK === NO_MRK) {
						for (var j = 0; j < $scope.mallList.length; j++) {
							if ($scope.mallConfiguration[i].NO_MNGMRK === $scope.mallList[j].NO_MNGMRK) {
								$scope.selectedMall = $scope.mallList[j];
								// $window.alert("mallId = " + $scope.selectedMall.mallId + ", name = " + $scope.selectedMall.mallName);
								break;
							}
						}
						// $scope.selectedMall
						$scope.NM_MRK   = $scope.mallConfiguration[i].NM_MRK;
						$scope.NM_SHOP  = $scope.mallConfiguration[i].NM_SHOP;
						$scope.DC_MRKID = $scope.mallConfiguration[i].DC_MRKID;
						$scope.DC_PWD   = $scope.mallConfiguration[i].DC_PWD;
						break;
					}
				}
			};
			
			$scope.conMrk = function(NO_MNGMRK, DC_MRKID, NM_SHOP) {
				var paramCon = {
		            	NO_MNGMRK: NO_MNGMRK,
		            	DC_MRKID: DC_MRKID,
		            	NM_SHOP: NM_SHOP
		            };
		            
				var conMrk = mallConfigSevice.conMrk(paramCon);
				conMrk.then(function successCallback(data) {
					if(data.errorCode === "0") {
						mallConfigSevice.getMallSeller().then(function successCallback(data) {
							if (data.errorCode === "0") {
								$scope.mallConfiguration = data.response;
							} 
							else {
								//def.reject({"message":data.data});
							}
						});
					} 
					else {
						$window.alert(data.message);
					}
				}, function errorCallback(data) {
					//$scope.isDisabled = false;
					$window.alert(data.message);
				});
			};
			
			// 새로운 Mall Seller를 추가
			$scope.addMall = function() {
				if (checkEditingFields() == false || $scope.isDisabled) {
					return;
				}
				$scope.isDisabled = true;
				var data = [{
					"NO_MNGMRK"  : $scope.selectedMall.NO_MNGMRK,
					"DC_MRKID"   : $scope.DC_MRKID,
					"DC_PWD"     : $scope.DC_PWD,
					"NEW_DC_PWD" : $scope.DC_PWD,
					"NM_MRK"     : $scope.NM_MRK,
					"NM_SHOP"    : ($scope.NM_SHOP===undefined)?'':$scope.NM_SHOP,
					"API_KEY"    : "",
					"NEW_API_KEY": "",
					"YN_USE"     : "Y"
				}];
				
				var addMallSeller = mallConfigSevice.createMallSeller(data);
				addMallSeller.then(function successCallback(data) {
					if (data.errorCode === "0") {
						$scope.mallConfiguration = data.response;
						$scope.cancelMall();
						$rootScope.hasMall = true;
						$window.sessionStorage.setItem("hasMall", true);
					} else {
						// TODO: 에러처리
					}
				}, function errorCallback(data) {
					$scope.isDisabled = false;
					$window.alert(data.message);
				});
			};

			// 기존 Mall Seller를 수정
			$scope.updateMall = function() {
				if (checkEditingFields() == false || $scope.isDisabled) {
					return;
				}
				$scope.isDisabled = true;
				var data = [{
					"NO_MRK"    : $scope.editingMallId,
					"NO_MNGMRK" : $scope.selectedMall.NO_MNGMRK,
					"DC_MRKID"  : $scope.DC_MRKID,
					"DC_PWD"    : $scope.DC_PWD,
					"NEW_DC_PWD": $scope.DC_PWD,
					"NM_MRK"    : $scope.NM_MRK,
					"NM_SHOP"   : ($scope.NM_SHOP===undefined)?'':$scope.NM_SHOP,
					"YN_USE"    : "Y",
				}];
				var updateMallSeller = mallConfigSevice.modifyMallSeller(data);
				updateMallSeller.then(function successCallback(data) {
					if (data.errorCode === "0") {
						$scope.mallConfiguration = data.response;
						$scope.cancelMall();
					} else {
						// TODO: 에러 처리
					}
				}, function errorCallback(data) {
					$window.alert(data.message);
				});
			};

			// Mall Seller 중 하나를 삭제할 때 (이 버튼은 정말 삭제할 것인지 확인하는 팝업창에 있음)
			$scope.deleteMall = function(data) {
				if ($scope.isDisabled) {
					return;
				}
				$scope.isDisabled = true;
				
				var data = [{
					"NO_MRK"    : data.NO_MRK,
					"NO_MNGMRK" : data.NO_MNGMRK,
					"DC_MRKID"  : data.DC_MRKID,
					"DC_PWD"    : data.DC_PWD,
					"NEW_DC_PWD": data.DC_PWD,
					"NM_MRK"    : data.NM_MRK
				}];
				var deleteMallSeller = mallConfigSevice.removeMallSeller(data);
				deleteMallSeller.then(function successCallback(data) {
					$scope.isDisabled = true;
					if (data.errorCode === "0") {
						$scope.mallConfiguration = data.response;
						$scope.cancelMall();
//						for (var i = 0; i < $scope.mallConfiguration.length; i++) {
//							if ($scope.mallConfiguration[i].NO_MRK === NO_MRK) {
//								$scope.mallConfiguration.splice(i, 1);
//								break;
//							}
//						}
//						// $scope.mallConfiguration.remove(mall);
//						$scope.mallCount = $scope.mallConfiguration.length;
					} else {
						// TODO: 에러 처리
					}
				}, function errorCallback(data) {
					$window.alert(data.message);
				});
			};

			// Mall Seller를 추가/수정 하는 부분을 지움 (수정하다가 취소 버튼을 누른 경우 or 신규 추가가 완료된 경우) 
			$scope.cancelMall = function() {
				$scope.selectedMall  = null;
				$scope.DC_MRKID      = null;
				$scope.DC_PWD        = null;
				$scope.NM_MRK        = null;
				$scope.NM_SHOP       = null;
				$scope.isEditing     = false;
				$scope.isDisabled    = false;
				$scope.isFormVisible = false;
			};

			// Mall Seller를 추가/수정 하기 전에 유효성 검증
			var checkEditingFields = function() {
				if ($scope.selectedMall == undefined || $scope.selectedMall == null) {
					$window.alert("Mall을 선택하세요.");
					return false;
				}

				if ($scope.NM_MRK == undefined || $scope.NM_MRK === "") {
					$window.alert("마켓명을 입력하세요.");
					return false;
				}
				
				if ($scope.DC_MRKID == undefined || $scope.DC_MRKID === "") {
					$window.alert("ID를 입력하세요.");
					return false;
				}

				if ($scope.DC_PWD == undefined || $scope.DC_PWD === "") {
					$window.alert("Password를 입력하세요.");
					return false;
				}
			};
		}
	]
});