'use strict';

// Register `noticeList` component, along with its associated controller and template
angular.module('noticeList').
component('noticeList', {
	templateUrl: 'contents/notice-list/notice-list.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', '$timeout', 'commonService', "$q", "noticeListService", '$log',
		function NoticeListController($rootScope, $route, $scope, $http, $window, $timeout, commonService, $q, noticeListService, $log) {
			if (!commonService.init($scope)){
				return;
			}
			
			var noticeList = $scope.noticeList = {
				list : "",
				inputSearch : "",
				noticeUrl : "USP_SY_14NOTICE01_GET&SEARCH_@s|ARR_CD_NO@s|NOTI_TO@s|NOTI_FROM@s",
				kind : ["*","001","002"],					//게시글 종류
				toDate : "20170101010101",
				fromDate : "20200101010101", 
				pagingLst : [],
				currentPage : 1,
				numPerPage : 10,
				lstSize : 0,
                maxSize : 5,
			}
						
			var initLoad = function () {
				var me = noticeList;
            	var noticeParam = {
    					procedureParam: me.noticeUrl,
    					SEARCH_: me.inputSearch,
                    	ARR_CD_NO: me.kind[0],
                    	NOTI_TO: me.toDate, 
                    	NOTI_FROM: me.fromDate
    				}
                $q.all([
                    noticeListService.getNotice(noticeParam).then(function(res){                    	
                    	return res;
                    }),            			
                ]).then(function (result) {
                    me.list = result[0];                    
                    me.lstSize = result[0].length;           
                    
                    me.pagingLst = commonService.getPagingPage(me.list, me.currentPage, me.numPerPage);
                });	
            };
            //초기화
            var initialize = function(){
				var me = noticeList;
            	me.inputSearch = "";
            	me.lstSize = 0;
            	me.pagingLst = [];
            };
            //게시글 종류별로 불러오기
            $scope.kindListClick = function(kind){
				var me = noticeList;
            	var param = {
					procedureParam: me.noticeUrl,
					SEARCH_: "",
                	ARR_CD_NO: "",
                	NOTI_TO: me.toDate, 
                	NOTI_FROM: me.fromDate
            	};
            	
            	if(kind === "all"){
            		param.ARR_CD_NO = me.kind[0];
            	}
            	else if(kind === "normal"){
            		param.ARR_CD_NO = me.kind[1];
            	}
            	else if(kind === "important"){
            		param.ARR_CD_NO = me.kind[2];
            	}
            	else if(kind === "input"){
            		if(!me.inputSearch){
            			alert("검색어를 입력해 주세요~!");
                		return false;
            		}
            		param.ARR_CD_NO = me.kind[0];
            		param.SEARCH_ = me.inputSearch;
            	}
            	else{
            		alert("잘못 선택하셨습니다요~!");
            		return false;
            	}
            	
            	noticeListService.getNotice(param).then(function(res){
                    me.list = res;
            		me.inputSearch = "";				//검색어 초기화
                    me.lstSize = me.list.length;		//리스트 사이즈 삽입                    
                    me.pagingLst = commonService.getPagingPage(me.list, me.currentPage, me.numPerPage);
                },function(err){
                	initialize();
                	console.log("get list load error ==> ", err);
                });
            }
           
            $scope.$watch("noticeList.currentPage + noticeList.numPerPage", function() {
            	var me = noticeList;
            	me.pagingLst = commonService.getPagingPage(me.list, me.currentPage, me.numPerPage);
            });
                        
        	initLoad();
		}
	]
});