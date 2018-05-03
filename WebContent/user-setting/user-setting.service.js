(function() {
'use strict';
	angular
		.module('userSetting')
		.factory('userSettingSevice', userSettingSevice);

	userSettingSevice.$inject = ['$http', '$q', '$window', 'config'];
	function userSettingSevice($http, $q, $window, config) {
		return {
			getSeller: getSeller,
			getCdPushProc: getCdPushProc,
			modifySeller:modifySeller,
		};
		
		function getCdPushProc(pushkey) {
			var param = {
					procedureParam: "USP_SY_05PUSHPROC_GET&L_KEY_TOKEN@s",
					L_KEY_TOKEN: pushkey
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
				rtnVal.response = response.data.results[0][0];
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				handleError(def, response, 500, 'Fail to get a seller');
			});
			return def.promise;
		}
		
		function getSeller () {
			var param = {
					procedureParam: "USP_SY_05MyInfo_GET"
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
				rtnVal.response = response.data.results[0][0];
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				handleError(def, response, 500, 'Fail to get a seller');
			});
			return def.promise;
		}
		function modifySeller (data) {
			var url = config.api.user;
			return doReq(url,"PUT",data, 500,'Fail to modify a seller');
		}
		function doReq(url, method, data, errorDefaultCode, errorDefaultMessage){
			var def = $q.defer();
			var reqOption = {
				method: method,
				url: url
			};
			if (data != undefined)
				reqOption.data = data;

			$http.defaults.headers.common.NO_M = 'SYME17122901';
			var req = $http(reqOption);
			req.then(function successCallback(response) {
				var retData = {};				
				if(response.status == 200) { 
					retData.errorCode = "0"
					def.resolve(retData);
				}
				else {
					retData.message = response.data;
					def.reject(retData);
				}
			}, function errorCallback(response) {
				var retData = {};
				retData.message = response.data;
				def.reject(retData);
			});

			$http.defaults.headers.common.NO_M = '';
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