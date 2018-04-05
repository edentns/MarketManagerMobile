(function() {
'use strict';
	angular
		.module('mallList')
		.factory('mallListService', mallListService);

	mallListService.$inject = ['$http', '$q', '$window', 'config'];
	function mallListService($http, $q, $window, config) {
		return {
			getStat: getStat,
			reloadMallStat: reloadMallStat
		};
		function getStat (param) {
			var url = config.api.stat;
			var def = $q.defer();
			
			$http.defaults.headers.common.NO_M = 'SYME17122901';
			
			var req = $http({
				method: 'POST',
				url: url,
				data: config.aes256.encrypt(param)
			});
			
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				var rtnVal = {};
				rtnVal.errorCode = "0";
				
				response.data = config.aes256.decrypt(response.data);
				
				rtnVal.response = response.data.results[0];
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				handleError(def, response, 500, 'Fail to get stat');
			});
			return def.promise;
		}
		
		function reloadMallStat (param) {
			var url = config.api.mo01MallList;
			var def = $q.defer();
			
			$http.defaults.headers.common.NO_M = 'SYME17122901';
			
			var req = $http({
				method: 'POST',
				url: url,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
				data: config.aes256.encrypt($.param(param))
			});
			
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				var rtnVal = {};
				rtnVal.errorCode = "0";
				
				response.data = config.aes256.decrypt(response.data);
								
				rtnVal.response = response.data;
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				handleError(def, response, 500, 'Fail to get stat');
			});
			return def.promise;
		}
		
		function handleError(def, response, defaultStatus, defaultMessage){
			var errorRes = {
				message: defaultMessage,
				status: defaultStatus
			};

			if (response.data == null) {
				errorRes.message = 'Fail to connect';
			} else if (response.data.error != null) {
				errorRes.message = response.data.error;
				if (response.data.status != null)
					errorRes.status = 401;
				else
					errorRes.status = response.data.status;
			}
			def.reject(errorRes);
		}

	}
})();