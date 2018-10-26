(function() {
'use strict';
	angular
		.module('orderList')
		.factory('orderListSevice', orderListSevice);

	orderListSevice.$inject = ['$http', '$q', '$window', 'config'];
	function orderListSevice($http, $q, $window, config) {
		return {
			orderList : orderList
		};
		
    	/**
		 * 주문 목록 
		 */
    	function orderList(param) {				
			var url = config.api.orderList;

			$http.defaults.headers.common.NO_M = 'SYME17041121';
			
			return $http({
				method	: "GET",
				url		: url + $.param(param),
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" }
			})
		}
	}
})();