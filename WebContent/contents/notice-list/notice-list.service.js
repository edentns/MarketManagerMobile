(function() {
'use strict';
	angular
		.module('noticeList')
		.factory('noticeListService', noticeListService);

	noticeListService.$inject = ['$http', '$q', '$window', 'config', '$log'];
	function noticeListService($http, $q, $window, config, $log) {
		return {
			getNotice: getNotice
		};					

		function getNotice (param){
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
				//rtnVal.errorCode = "0";		
				try{
					if(response.data.results[0].length){
						rtnVal = response.data.results[0];
					}
					else{
						rtnVal = [];
					}
				}catch(e){
					console.log(e);
				}				
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				//rtnVal.errorCode = "1";
				def.resolve(response);
			});
			return def.promise;
		}
	}
})();