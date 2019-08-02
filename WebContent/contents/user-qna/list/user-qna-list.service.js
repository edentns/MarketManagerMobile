(function() {
'use strict';
	angular
		.module('userQnaList')
		.factory('userQnaListService', userQnaListService);

	userQnaListService.$inject = ['$http', '$q', '$window', 'config', '$log'];
	function userQnaListService($http, $q, $window, config, $log) {
		return {
			
		};
	}
})();