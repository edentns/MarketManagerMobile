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
			
			var encData = config.aes256.encrypt($.param({NO_C : bsCd, user : username, password : password}));
			
			var login =  $http({
				method: 'POST',
				url: loginUrl,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
				data	: encData
			});
			
			login.then(function successCallback(response) {
				var result = null
				if (response != null && response.data != null){
					if (response.data.expires_in < 100){
						result = refreshToken(response.data.refresh_token);
					}else{
						response.data = config.aes256.decrypt(response.data);
						result = response.data;
					}
					def.resolve(result);
				}else{
					handleError(def, response, 'Fail to login');
				}
			}, function errorCallback(response) {
				handleError(def, response, 'Fail to login');
			});
			return def.promise;

		}

		function refreshToken (refresh_token) {
			var def = $q.defer();
			var url = config.api.oauthToken;
			var tokenReq =  $http({
				method: 'POST',
				url: url,
				headers: {
					"Authorization": "Basic "+config.auth.secret,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
    			data: $httpParamSerializerJQLike({'refresh_token': refresh_token, 'grant_type': 'refresh_token'})
			});
			tokenReq.then(function successCallback(response) {
				def.resolve(response.data);
			}, function errorCallback(response) {
				handleError(def, response, 'Fail to login');
			});
			return def.promise;
		}
		function handleError(def, response, defaultMessage){
			var errorMessage = defaultMessage;
			if (response.data == null) {
				errorMessage = 'Fail to connect';
			} else if (response.data.error_description != null) {
				errorMessage = response.data.error_description;
			}
			def.reject(errorMessage);
		}

	}
})();