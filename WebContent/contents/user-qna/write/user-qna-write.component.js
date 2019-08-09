'use strict';

// Register `userQnaWrite` component, along with its associated controller and template
angular.module('userQnaWrite').
component('userQnaWrite', {
	templateUrl: 'contents/user-qna/write/user-qna-write.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', '$timeout', 'commonService', "$q", "userQnaWriteService", '$log',
		function UserQnaWriteController($rootScope, $route, $scope, $http, $window, $timeout, commonService, $q, userQnaWriteService, $log) {
			if (!commonService.init($scope)){
				return;
			}
			
			var userQnaWrite = $scope.userQnaWrite = {
				DC_HTMLINQCTT : "",
				DC_INQTITLE : ""
			}
						
			var initLoad = function () {
				var me = userQnaWrite;
				var detailInfo = userQnaWriteService.getDetailInfo();
				
				if(detailInfo){
					//$log.info(detailInfo);
					me.DC_HTMLINQCTT = detailInfo.DC_HTMLINQCTT;
					me.DC_INQTITLE = detailInfo.DC_INQTITLE;
					me.NO_QA = detailInfo.NO_QA;
					me.CD_ANSSTAT = detailInfo.CD_ANSSTAT;
					me.isUpdate = true;
				}
            };       
            
            //문의 등록
            userQnaWrite.save = function(){
            	var me = this,
            		param = [{
            			DC_HTMLINQCTT : me.DC_HTMLINQCTT,
            			DC_INQTITLE : me.DC_INQTITLE
            		}];
            	
            	if(!me.DC_HTMLINQCTT){
            		alert("내용을 입력해 주세요.");
            		return false;
            	}
            	if(!me.DC_INQTITLE){
            		alert("제목을 입력해 주세요.");
            		return false;
            	}
            	
            	userQnaWriteService.qaCrud(param, "I").then(function(res){
            		//return 값  게시글 번호
            		//console.log(res);
            		if(res){
            			alert("문의가 등록되었습니다.");
            			location.href="#!/user-qna-list";
            		}
            		else{
            			$log.info(status, res.data);
            			alert("문의 등록에 실패하였습니다.\n관리자에 문의하세요.");
            		}
            	},function(err){
        			$log.info(err);
            		alert("문의 등록에 실패하였습니다.\n관리자에 문의하세요.");
            	})
            };
            //문의수정
            userQnaWrite.update = function(){
            	var me = this,
        			param = [{
	        			DC_HTMLINQCTT : me.DC_HTMLINQCTT,
	        			DC_INQTITLE : me.DC_INQTITLE,
	        			NO_QA : me.NO_QA,
	        			CD_ANSSTAT : me.CD_ANSSTAT,
        			}];
            	
            	if(!me.DC_HTMLINQCTT){
            		alert("내용을 입력해 주세요.");
            		return false;
            	}
            	if(!me.DC_INQTITLE){
            		alert("제목을 입력해 주세요.");
            		return false;
            	}
            	if(!me.NO_QA){
            		alert("문의 등록에 실패하였습니다.\n관리자에 문의하세요.");
            		return false;
            	}
            	
            	userQnaWriteService.qaCrud(param, "U").then(function(res){
            		var status = res.status;
            		
            		if(!status){
            			alert("문의가 수정되었습니다.");
            			location.href="#!/user-qna-list";
            		}
            		else{
            			$log.info(status, res.data);
            			alert("문의수정에 실패하였습니다.\n관리자에 문의하세요.");
            		}
            	},function(err){
        			$log.info(err);
            		alert("문의수정에 실패하였습니다.\n관리자에 문의하세요.");
            	})
            }
                       
        	initLoad();
		}
	]
});