'use strict';

// Register `userQnaList` component, along with its associated controller and template
angular.module('userQnaList').
component('userQnaList', {
	templateUrl: 'contents/user-qna/list/user-qna-list.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', '$timeout', 'commonService', "$q", "userQnaListService", 'userQnaInfoService', '$log', '$location',
		function UserQnaListController($rootScope, $route, $scope, $http, $window, $timeout, commonService, $q, userQnaListService, userQnaInfoService, $log, $location) {
			if (!commonService.init($scope)){
				return;
			}
			
			var userQnaList = $scope.userQnaList = {
				isList : true,
				list : "",
				inputSearch : "",
				qnaListUrl : "USP_SY_16QA_GET&L_CONT@s|L_CD_ANSSTAT@s|L_START_DATE@s|L_END_DATE@s",			
				selectValue : {'NM_DEF' : '전체', 'CD_DEF' : '*'},
				pagingLst : [],
				currentPage : 1,
				numPerPage : 10,
				lstSize : 0,
                maxSize : 5,
                selectList : null,
                btwRadioModel : "1w",
                btwStartDatePicker : "",
                btwEndDatePicker : new Date()
			}
						
			var initLoad = function () {
				var me = userQnaList;							
				var commonCodeParam = {
    					lnomngcdhd: "SYCH00091",
    					lcdcls: "SY_000031"
    				};		
				
				$q.all([
					commonService.getCommonCodeList(commonCodeParam).then(function(res){
        				return res;
	        		})
                ]).then(function (result) {
                	//me.selectList = result[0];
                	userQnaListService.setAnsStat(result[0]);
                	me.selectList = userQnaListService.getAnsStat();
                	//조회
                	me.search();
                });
            };
                               
            $scope.$watch("userQnaList.btwRadioModel", function(newValue) {
				var me = userQnaList;
				userQnaList.btwStartDatePicker = userQnaListService.changeDateWatch(newValue);
            });
            
            $scope.$watch("userQnaList.currentPage + userQnaList.numPerPage", function() {
            	var me = userQnaList;
            	me.pagingLst = commonService.getPagingPage(me.list, me.currentPage, me.numPerPage);
            });
            
            userQnaList.clickiFilterInit = function(e){
            	var me = this;
            	
            	me.inputSearch = "";
            	me.selectValue = userQnaListService.getAnsStat()[0];
            	me.btwRadioModel = "1w";    
            	me.btwEndDatePicker = new Date();

            	e.preventDefault();
            };
            
            userQnaList.loadDetailInfo = function (param){
            	userQnaInfoService.setDetailInfo(param);
            }
            
            //조회
            userQnaList.search = function(e){
				var me = this;
            	var qnaListParam = {
					procedureParam: me.qnaListUrl,
					L_CONT: me.inputSearch,
					L_CD_ANSSTAT : me.selectValue.CD_DEF,
					L_CD_ANSSTAT_INDEX : "",
					L_PERIOD : "",
					L_START_DATE : commonService.short2date(me.btwStartDatePicker).replace(/-/g, ''),
					L_END_DATE : commonService.short2date(me.btwEndDatePicker).replace(/-/g, '')
            	};
            	var list = []; 
            	
            	if(e){
                	e.preventDefault();
            	}
            	
        		commonService.getUt02Db(qnaListParam).then(function(res){
                    me.list = res;
                    me.lstSize = res.length;
                    userQnaListService.ansStatTrans(me.list);
                    me.pagingLst = commonService.getPagingPage(me.list, me.currentPage, me.numPerPage);
                    if(me.lstSize > 0){
                        me.isList = true;
                    }
                    else{
                    	me.isList = false;
                    }
                });
            }            
            
        	initLoad();
		}
	]
});