(function() {
'use strict';
	angular.module('mallList')
		.factory('mallListService', mallListService);

	mallListService.$inject = ['$http', '$q', '$window', 'config'];
	function mallListService($http, $q, $window, config) {
		return {
			getStat: getStat,
			reloadMallStat: reloadMallStat
		};
		function getStat (param) {
			var url = config.api.stat,
				def = $q.defer(),
				rtnVal = {};	
			
			$http.defaults.headers.common.NO_M = 'SYME17122901';
			
			var req = $http({
				method: 'POST',
				url: url,
				data: param
			});

			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				rtnVal.errorCode = "0";
				rtnVal.response = response.data.results[0];
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				rtnVal.errorCode = "1";
				def.resolve(rtnVal);
			});
			return def.promise;
		}
		
		function reloadMallStat (param) {
			var url = config.api.mo01MallList,
				def = $q.defer(),
				rtnVal = {};
			
			$http.defaults.headers.common.NO_M = 'SYME17122901';
			
			var req = $http({
				method: 'POST',
				url: url,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
				data: $.param(param)
			});
			
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				rtnVal.errorCode = "0";								
				rtnVal.response = response.data;
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				rtnVal.errorCode = "1";
				rtnVal.message = response.data;
				def.resolve(rtnVal);
			});
			return def.promise;
		}
	}
})();