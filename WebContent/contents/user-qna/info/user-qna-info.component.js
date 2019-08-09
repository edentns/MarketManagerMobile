'use strict';

// Register `userQnaInfo` component, along with its associated controller and template
angular.module('userQnaInfo').
component('userQnaInfo', {
	templateUrl: 'contents/user-qna/info/user-qna-info.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', '$timeout', 'commonService', "$q", "userQnaInfoService", "userQnaWriteService", '$log',
		function UserQnaInfoController($rootScope, $route, $scope, $http, $window, $timeout, commonService, $q, userQnaInfoService, userQnaWriteService, $log) {
			if (!commonService.init($scope)){
				return;
			}
			
			var userQnaInfo = $scope.userQnaInfo = {
				detailInfo : {},
			}
						
			var initLoad = function () {
				var me = userQnaInfo;
				me.detailInfo = userQnaInfoService.getDetailInfo();
            };         
            //삭제
            userQnaInfo.qaDelete = function(){
            	if(!confirm("삭제하시겠습니까?")){
            		return false;
            	};            	
            	
            	var me = this,
                	qaNo = me.detailInfo.NO_QA;
            	
            	if(!qaNo){
            		$log.error("필수값 에러");
            		alert("삭제에 실패하였습니다.\n관리자에게 문의해주세요.");
        			return false;
            	}
            	
            	userQnaWriteService.qaCrud(qaNo, "D").then(function(res){
            		var status = res.status;
            		if(!status){
            			alert("삭제 되었습니다.");
            			location.href="#!/user-qna-list";
            		}
            		else{
            			$log.error(res.data, res.status);
            			alert("삭제에 실패하였습니다.\n관리자에게 문의해주세요.");
            			return false;
            		}
            	},function(err){
            		$log.error(err);
            		alert("삭제에 실패하였습니다.\n관리자에게 문의해주세요.");
        			return false;
            	});
            };
            //업데이트
            userQnaInfo.qaUpdate = function(){
            	var me = this;
            	userQnaWriteService.setDetailInfo(me.detailInfo);
            	location.href="#!/user-qna-write";
            }
            
        	initLoad();
		}
	]
});