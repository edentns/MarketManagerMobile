(function() {
'use strict';
	angular
		.module('mallConfig')
		.factory('mallConfigSevice', mallConfigSevice);

	mallConfigSevice.$inject = ['$http', '$q', '$window', 'config'];
	function mallConfigSevice($http, $q, $window, config) {
		return {
			getMallSeller: getMallSeller,
			createMallSeller: createMallSeller,
			modifyMallSeller: modifyMallSeller,
			removeMallSeller: removeMallSeller,
			getMall: getMall
		};
		
		function getMallSeller () {
			var param = {
					procedureParam: "USP_MO_01STAT_GET"
				},
				url = config.api.stat,
				def = $q.defer();
			
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
				handleError(def, response, 500, 'Fail to get a mall');
			});
			return def.promise;
		}
		function createMallSeller (data) {
			var CUD = 'I';
			
			return doReq(CUD, data);
		}
		function modifyMallSeller (data) {
			var CUD = 'U';
			
			return doReq(CUD, data);
		}
		function removeMallSeller (data) {
			var CUD = 'D';
			
			return doReq(CUD, data);
		}
		function doReq(CUD, param){
			var def = $q.defer();
			
			$http.defaults.headers.common.NO_M = 'SYME17122901';
			var req = $http({
                method   : "POST",
                url		 : APP_CONFIG.domain +"/sy09Mrk/"+CUD,
                data     : config.aes256.encrypt(param)
            });
			
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				var rtnVal = {};
				rtnVal.errorCode = "0";
				response.data = config.aes256.decrypt(response.data);
				rtnVal.response = response.data.results[0];
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				if     (CUD === "I") handleError(def, response, 500, 'Fail to add a mall');
				else if(CUD === "U") handleError(def, response, 500, 'Fail to modify a mall');
				else if(CUD === "D") handleError(def, response, 500, 'Fail to remove a mall');
			});
			return def.promise;
		}
		function getMall () {
			var param = {
                    procedureParam: "USP_SY_09MRK01_GET"
            	},
            	url = config.api.stat,
            	def = $q.defer();
			
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
				handleError(def, response, 500, 'Fail to get a mall');
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