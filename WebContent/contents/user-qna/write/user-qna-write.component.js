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
			}
						
			var initLoad = function () {
				
            };                         
                       
        	initLoad();
		}
	]
});