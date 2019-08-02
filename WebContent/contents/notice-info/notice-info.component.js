'use strict';

// Register `noticeList` component, along with its associated controller and template
angular.module('noticeInfo').
component('noticeInfo', {
	templateUrl: 'contents/notice-info/notice-info.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', '$timeout', 'commonService', "$q", "noticeInfoService", '$log', '$compile',
		function NoticeInfoController($rootScope, $route, $scope, $http, $window, $timeout, commonService, $q, noticeInfoService, $log, $compile) {
			if (!commonService.init($scope)){
				return;
			}
			
			var noticeInfo = $scope.noticeInfo = {
				detail : {},
				htmlContentAppend : ""
			}
						
			var initLoad = function () {
				var me = noticeInfo; 
            	var sParam = $route.current.params,
            		kind = sParam.kind,
            		noNotice = sParam.no,
            		pParam = {
    					procedureParam: "USP_MA_05NOTICE_SEARCH01_DETAIL_GET&KIND_@s|NO_@s",
    					KIND_: kind,
                    	NO_: noNotice
            		};
            	
            	noticeInfoService.getDetailNotice(pParam).then(function(res){
            		var divElement, htmlElement;
            		me.detail = res[0];
            		
                	divElement = angular.element(document.querySelector('.notice-info'));
                	htmlElement = angular.element("<div>"+me.detail.DC_HTMLCONTENT+"</div>");
            		
            		divElement.append(htmlElement);
            		$compile(divElement)($scope);
            	}, function(err){
            		me.detail = {};
            	});
            };
           
        	initLoad();
		}
	]
});