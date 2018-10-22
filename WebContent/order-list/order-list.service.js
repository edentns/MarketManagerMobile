(function() {
'use strict';
	angular
		.module('userCreate')
		.factory('userCreateSevice', userCreateSevice);

	userCreateSevice.$inject = ['$http', '$q', '$window', 'config'];
	function userCreateSevice($http, $q, $window, config) {
		return {
			createUser : createUser,
			dupCheckNmC: dupCheckNmC,
			doChkMe    : doChkMe,
			selectCla  : selectCla,
		};
		
		function dupCheckNmC(nmC, dcEmiaddr){
			return $http({
				method	: "POST",
				url		: config.api.dupCheckNmC,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
				data    : $.param({L_NM_C:nmC, L_DC_EMIADDR:dcEmiaddr})
			});
		}
		
		function doChkMe(email){
			return $http({
				method	: "POST",
				url		: config.api.doChkMe,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
				data	: $.param({DC_EMIADDR:email})
			});
		}
		
		/**
		 * 회원가입
		 * @param {{}} data
		 * @returns {*}
		 */
		function createUser(userJoinVO) {
			$http.defaults.headers.common.NO_M = '';
			
			return $http({
				method	: "POST",
				url		: config.api.createUser,
				headers	: { "Content-Type": "application/json; text/plain; */*; charset=utf-8" },
				data    : userJoinVO
			});
		}
		
		/**
		 * 약관조회
		 * @param {{NM_C:string}} userDataSet
		 * @returns {*}
		 */
		function selectCla (cdClaclft) {
			return $http({
				method	: "GET",
				url		: config.api.selectCla+cdClaclft,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" }
			});
		}
	}
})();