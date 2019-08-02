'use strict';

// Register `userQnaInfo` component, along with its associated controller and template
angular.module('userQnaInfo').
component('userQnaInfo', {
	templateUrl: 'contents/user-qna/info/user-qna-info.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', '$timeout', 'commonService', "$q", "userQnaInfoService", '$log',
		function UserQnaInfoController($rootScope, $route, $scope, $http, $window, $timeout, commonService, $q, userQnaInfoService, $log) {
			if (!commonService.init($scope)){
				return;
			}
			
			var userQnaInfo = $scope.userQnaInfo = {             
			}
						
			var initLoad = function () {
            };                         
                       
        	initLoad();
		}
	]
});