'use strict';

// Register `orderList` component, along with its associated controller and template
angular.
module('orderList').
component('orderList', {
	templateUrl: 'order-list/order-list.template.html',
	controller: ['$rootScope', '$scope', '$http', '$window', 'commonService',"$q",
		function OrderListontroller($rootScope, $scope, $http, $window, commonService, $q) {
			if (!commonService.init($scope)){
				return;
			}
		}	
	]
});