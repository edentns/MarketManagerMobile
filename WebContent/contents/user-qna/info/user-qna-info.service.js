(function() {
'use strict';
	angular
		.module('userQnaInfo')
		.factory('userQnaInfoService', userQnaInfoService);

	userQnaInfoService.$inject = ['$http', '$q', '$window', 'config', '$log'];
	function userQnaInfoService($http, $q, $window, config, $log) {
		return {
			
		};
	}
})();