(function() {
'use strict';
	angular
		.module('userQnaWrite')
		.factory('userQnaWriteService', userQnaWriteService);

	userQnaWriteService.$inject = ['$http', '$q', '$window', 'config', '$log'];
	function userQnaWriteService($http, $q, $window, config, $log) {
		var detailInfo = null;
		
		return {
			qaCrud : qaCrud,
			setDetailInfo : setDetailInfo,
			getDetailInfo : getDetailInfo,
		};
		
		function qaCrud(param, CUD) {
			var url = "",///config.api.qaSave+CUD,
				def = $q.defer(),
				rtnVal = [],
				req = "";
			
			$http.defaults.headers.common.NO_M = 'SYME17122901';
			
			if(CUD === 'I' || CUD === 'U'){
				url = config.api.qaSave+CUD;
			}
			else{
				url = config.api.qaDelete;
			}
			
			req = $http({
				method: 'POST',
				url: url,
				data: param
			});
	
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				def.resolve(response.data);
			}, function errorCallback(response) {
				def.resolve(response);
			});
			return def.promise;
		}		
		
		function setDetailInfo(param){
			detailInfo = param
		}
		
		function getDetailInfo(){
			return detailInfo;
		}
	}
})();