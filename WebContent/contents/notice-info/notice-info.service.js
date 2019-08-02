(function() {
'use strict';
	angular
		.module('noticeInfo')
		.factory('noticeInfoService', noticeInfoService);

	noticeInfoService.$inject = ['$http', '$q', '$window', 'config', '$log'];
	function noticeInfoService($http, $q, $window, config, $log) {
		return {
			getDetailNotice: getDetailNotice
		};		
			
		function getDetailNotice (param){
			var url = config.api.getUt02Db,
				def = $q.defer(),
				rtnVal = [];	
		
			$http.defaults.headers.common.NO_M = 'SYME17122901';
			
			var req = $http({
				method: 'POST',
				url: url,
				data: param
			});
	
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				try{
					if(response.data.results[2].length){
						rtnVal = response.data.results[2];
					}
					else{
						rtnVal = [];
					}
				}catch(e){
					console.log(e);
					rtnVal = [];
				}
				def.resolve(rtnVal);
			}, function errorCallback(error) {
				def.resolve(error);
			});
			return def.promise;
		}
	}
})();