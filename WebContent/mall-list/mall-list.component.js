'use strict';

// Register `mallList` component, along with its associated controller and template
angular.
module('mallList').
component('mallList', {
	templateUrl: 'mall-list/mall-list.template.html',
	controller: ['$rootScope', '$scope', '$window', '$anchorScroll', '$location', 'commonService', 'mallListService',
		function MallListController($rootScope, $scope, $window, $anchorScroll, $location, commonService, mallListService ) { 
			if (!commonService.init($scope)){
				return;
			}
			$scope.moveTo = function(cssId){
				var element = angular.element("#"+cssId);
				window.scrollTo(0, 0);
				window.scrollTo(0, element.position().top -110); 
			}
			// 각 Mall Seller의 판매 실적을 가져옴
			var param = {
				procedureParam: "USP_MO_01STAT_GET",
			}
			
			var req = mallListService.getStat(param);
			req.then(function successCallback(data) {
				if (data.errorCode === "0") {
					if (data.response.length == 0){
						$rootScope.hasMall = false;
						$window.sessionStorage.setItem("hasMall", false);
						$window.location.href = "#!/mall-config";
						return;
					}
					$rootScope.hasMall = true;
					$window.sessionStorage.setItem("hasMall", true);
					$scope.mallStat = data.response;
					for (var i = 0; i < $scope.mallStat.length; i++) {
						$scope.mallStat[i].isDisabled = false;
						$scope.mallStat[i].total = $scope.mallStat[i].QT_NEWORD + $scope.mallStat[i].QT_INQ  + 
						                           $scope.mallStat[i].QT_ECHG   + $scope.mallStat[i].QT_TKBK + 
						                           $scope.mallStat[i].QT_CCL;
					}
				} else {
					// TODO: 에러 처리
				}
			}, function errorCallback(data) {
				$window.alert(data.message);
			});
			$scope.reloadMallStat = function(NO_MRK) {
				var index = -1;
				for (var i = 0; index == -1 && i < $scope.mallStat.length; i++) {
					if ($scope.mallStat[i].NO_MRK === NO_MRK) {
						index = i;
					}
				}
				if (!$scope.mallStat[index].isDisabled){
					$scope.mallStat[index].isDisabled = true;
					var req = mallListService.getStat($rootScope.authorization, NO_MRK);
					req.then(function successCallback(data) {
						$scope.mallStat[index].isDisabled = false;
						if (data.errorCode === "0") {
							$scope.mallStat[index].NM_MNGMRK     = data.response.NM_MNGMRK;
							$scope.mallStat[index].DC_SALEMNGURL = data.response.DC_SALEMNGURL;
							$scope.mallStat[index].DC_MRKID      = data.response.DC_MRKID;
							$scope.mallStat[index].QT_NEWORD     = data.response.QT_NEWORD;
							$scope.mallStat[index].QT_INQ        = data.response.QT_INQ;
							$scope.mallStat[index].QT_ECHG       = data.response.QT_ECHG;
							$scope.mallStat[index].QT_TKBK       = data.response.QT_TKBK;
							$scope.mallStat[index].QT_CCL        = data.response.QT_CCL;
							$scope.mallStat[index].DTS_UPDATE    = data.response.DTS_UPDATE;
							$scope.mallStat[index].total = $scope.mallStat[index].QT_NEWORD + $scope.mallStat[index].QT_INQ  + 
							                               $scope.mallStat[index].QT_ECHG   + $scope.mallStat[index].QT_TKBK + 
							                               $scope.mallStat[index].QT_CCL;
						} else {
							// TODO: 에러 처리
						}
					}, function errorCallback(data) {
						$scope.mallStat[index].isDisabled = false;
						$window.alert(data.message);
					});
				}
				
			};

			$scope.hasError = function(timestamp, gap) {
				if (timestamp == null)
					timestamp = 0;
				
				var date = new Date();
				var now = date.getTime();
				
				var result = true;
				if ((now - gap) <  timestamp){
					result = false;
				}
				return result;
			};
		}
	]
});