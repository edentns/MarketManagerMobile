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
			conMrk: conMrk,
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
				data: param
			});
			
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				var rtnVal = {};
				rtnVal.errorCode = "0";
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
                data     : param
            });
			
			req.then(function successCallback(response) {
				if(response.status === 200) {
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
				data: param
			});
			
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				var rtnVal = {};
				rtnVal.errorCode = "0";
				rtnVal.response = response.data.results[0];
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				handleError(def, response, 500, 'Fail to get a mall');
			});
			return def.promise;
		}

    	function conMrk( aParam ) {
    		var def = $q.defer();
    		
			$http.defaults.headers.common.NO_M = 'SYME17122901';
            var req = $http({
                method  : "POST",
                url		: config.api.sy09MrkCons,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
                data    : $.param(aParam)
            });
            
            req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				var rtnVal = {};
				rtnVal.errorCode = "0";
				//rtnVal.response = response.data.results[0];
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				//handleError(def, response, 500, '연동에 실패하였습니다.');
				if(response.data != null && response.data !== "") 
					def.reject({errorCode:"1", message:response.data});
				else
					def.reject({errorCode:"1", message:"연동에 실패하였습니다."});
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