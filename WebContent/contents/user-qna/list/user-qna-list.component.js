'use strict';

// Register `userQnaList` component, along with its associated controller and template
angular.module('userQnaList').
component('userQnaList', {
	templateUrl: 'contents/user-qna/list/user-qna-list.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', '$timeout', 'commonService', "$q", "userQnaListService", '$log', '$location',
		function UserQnaListController($rootScope, $route, $scope, $http, $window, $timeout, commonService, $q, userQnaListService, $log, $location) {
			if (!commonService.init($scope)){
				return;
			}
			
			var userQnaList = $scope.userQnaList = {             
			}
						
			var initLoad = function () {
            };                
            
            $scope.writeClick = function(){
            	$location.href="#!/user-qna-info";
            }
                       
        	initLoad();
		}
	]
});