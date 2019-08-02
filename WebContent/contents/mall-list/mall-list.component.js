'use strict';

// Register `mallList` component, along with its associated controller and template
angular.
module('mallList').
component('mallList', {
	templateUrl: 'contents/mall-list/mall-list.template.html',
	controller: ['$rootScope', '$scope', '$window', '$anchorScroll', '$location', '$routeParams', 'commonService', 'mallListService', 'noticeListService',
		function MallListController($rootScope, $scope, $window, $anchorScroll, $location, $routeParams, commonService, mallListService, noticeListService) { 
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
					procedureParam: "USP_MO_01STAT_GET"
				},
				noticeParam = {
					procedureParam: "USP_SY_14NOTICE01_GET&SEARCH_@s|ARR_CD_NO@s|NOTI_TO@s|NOTI_FROM@s",
					SEARCH_: "",
                	ARR_CD_NO: "*",
                	NOTI_TO: "20170101010101",
                	NOTI_FROM: "20200101010101"
				};
					
			var req = mallListService.getStat(param);
			var noticeReq = noticeListService.getNotice(noticeParam);
						
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
						                           $scope.mallStat[i].QT_SHPING + $scope.mallStat[i].QT_SHPRDY + 
						                           $scope.mallStat[i].QT_CCL    + $scope.mallStat[i].QT_ITEMINQ;
					}
				} else {
					// TODO: 에러 처리
				}
			}, function errorCallback(data) {
				//$window.alert(data.message);
			});
			
			// 공지사항		
			noticeReq.then(function successCallback(data) {				
				var res = data;
				var importantNotice = [];
				
				for(var i=0, cnt=res.length; i<cnt; i++ ){
					var dts = res[i].DTS_INSERT.split(' ');
					res[i].DTS_INSERT = dts[0];
					if(res[i].CD_NOTICE === "002"){
						importantNotice.push(res[i]);
					}
				}
				
				$scope.notice = res;
				$scope.importantNotice = importantNotice;				
			}, function errorCallback(data) {
				$scope.notice = [];
				$scope.importantNotice = [];
				console.log("mall list load error ==> ",data.message);
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
					// 각 Mall Seller의 판매 실적을 가져옴
					var param = {
						DC_MRKID: $scope.mallStat[index].DC_MRKID,
						NO_MNGMRK: $scope.mallStat[index].NO_MNGMRK
					};
					
					var req = mallListService.reloadMallStat(param);
					req.then(function successCallback(data) {
						$scope.mallStat[index].isDisabled = false;
						if (data.errorCode === "0") {
							var updateDt = new Date(data.response.gdatetime);
							var month = '' + (updateDt.getMonth()+1);
							var day = '' + updateDt.getDate();
							var hour = '' + updateDt.getHours();
							var min = '' + updateDt.getMinutes();
							
							if(month.length < 2) month = '0' + month;
							if(day.length < 2) day = '0' + day;
							if(hour.length < 2) hour = '0' + hour;
							if(min.length < 2) min = '0' + min;
							
							$scope.mallStat[index].QT_NEWORD     = data.response.neworder*1;
							$scope.mallStat[index].QT_INQ        = data.response.inquiryinfo*1;
							$scope.mallStat[index].QT_ITEMINQ    = data.response.iteminquiry*1;
							$scope.mallStat[index].QT_ECHG       = data.response.exchangeorder*1;
							$scope.mallStat[index].QT_TKBK       = data.response.returnsorder*1;
							$scope.mallStat[index].QT_CCL        = data.response.cancelorder*1;
							
							$scope.mallStat[index].QT_SHPING     = data.response.itemdelivery*1; 	//상품배송
							$scope.mallStat[index].QT_SHPRDY     = data.response.itemprepare*1;		//상품준비	
							
							$scope.mallStat[index].DTS_UPDATE    = [updateDt.getFullYear(), month, day].join('-') + ' ' + [hour, min].join(':');
							$scope.mallStat[index].total = $scope.mallStat[index].QT_NEWORD + $scope.mallStat[index].QT_INQ  + 
							                               $scope.mallStat[index].QT_ECHG   + $scope.mallStat[index].QT_TKBK + 
								                           $scope.mallStat[index].QT_SHPING + $scope.mallStat[index].QT_SHPRDY + 
							                               $scope.mallStat[index].QT_CCL    + $scope.mallStat[index].QT_ITEMINQ;
							
							$window.alert("정보를 조회하였습니다.");
						} else {
							if(data.message !== null && data.message !== '') {
								$window.alert(data.message);
							}
							else if(data.data !== null && data.data !== '') {
								$window.alert(data.data);
							}
						}
					}, function errorCallback(data) {
						$scope.mallStat[index].isDisabled = false;
						if(data.message !== null && data.message !== '') {
							$window.alert(data.message);
						}
						else if(data.data !== null && data.data !== '') {
							$window.alert(data.data);
						}
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
			
			$scope.goOpenMrkLink = function(){
				ga('send','event','마켓 리스트 페이지','click','마켓링크 클릭');
			}
		}
	]
});