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
                url		 : config.api.sy09Mrk + "/" + CUD,
                data     : config.aes256.encrypt(param)
            });
			
			req.then(function successCallback(response) {
				if(response.status === 200) {

					if(CUD === "I" || CUD === "U") {
						var patamCon = {
	                    	NO_MNGMRK: param[0].NO_MNGMRK,
	                    	DC_MRKID: param[0].DC_MRKID,
	                    	NM_SHOP: param[0].NM_SHOP
	                    };
						
						conMrk(patamCon).then(function successCallback(data) {
							if(data.status === 200) {
								getMallSeller().then(function successCallback(data) {
									if (data.errorCode === "0") {
										def.resolve(data);
									} 
									else {
										def.reject({"message":data.data});
									}
								});
							} 
							else {
								def.reject({"message":data.data});
							}
						}, function errorCallback(response) {
							$http.defaults.headers.common.NO_M = '';
							def.reject({"message":data.data});
						});
					}
					else {
						getMallSeller().then(function successCallback(data) {
							if (data.errorCode === "0") {
								def.resolve(data);
							} 
							else {
								def.reject({"message":data.data});
							}
						});
					}
				}
				else {
					def.reject({"message":response.data});
				}
			}, function errorCallback(response) {
				def.reject({"message":response.data});
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

    	function conMrk( aParam ) {
			$http.defaults.headers.common.NO_M = 'SYME17122901';
            return $http({
                method   : "POST",
                url		 : config.api.sy09MrkCons,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
                data     : $.param(aParam)
            });
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