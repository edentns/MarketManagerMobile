(function() {
'use strict';
	angular
		.module('login')
		.factory('loginService', loginService);

	loginService.$inject = ['$http', '$q', '$window', '$httpParamSerializerJQLike', 'config'];
	function loginService($http, $q, $window, $httpParamSerializerJQLike, config) {
		return {
			login: getToken
		};

		function getToken (bsCd, username, password) {
			var loginUrl = config.api.oauthToken;
			var def = $q.defer();

			$http.defaults.headers.common.NO_M = '';
			
			var login =  $http({
				method: 'POST',
				url: loginUrl,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
				data	: $.param({NO_C : bsCd, user : username, password : password})
			});
			
			login.then(function successCallback(response) {
				var result = null
				if (response != null && response.data != null) {
					if(response.status === 200) {
						result = response.data;
					}
					else {
						def.reject(response.data);
					}
					def.resolve(result);
				}else{
					def.reject("로그인 실패하였습니다..");
				}
			}, function errorCallback(response) {
				if(response.data != null && response.data != null) {
					def.reject(response.data);
				}
				else {
					def.reject("로그인 실패하였습니다...");
				}
			});
			return def.promise;
		}
	}
})();