(function() {
'use strict';
	angular
		.module('userQnaWrite')
		.factory('userQnaWrite', userQnaWrite);

	userQnaWrite.$inject = ['$http', '$q', '$window', 'config', '$log'];
	function userQnaWrite($http, $q, $window, config, $log) {
		return {
			
		};
	}
})();