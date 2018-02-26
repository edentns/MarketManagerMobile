(function() {
'use strict';
	angular
		.module('userSetting')
		.factory('userSettingSevice', userSettingSevice);

	userSettingSevice.$inject = ['$http', '$q', '$window', 'config'];
	function userSettingSevice($http, $q, $window, config) {
		return {
			getSeller: getSeller,
			modifySeller:modifySeller,
		};
		
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
				data: config.aes256.encrypt(param)
			});
			
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				var rtnVal = {};
				rtnVal.errorCode = "0";
				response.data = config.aes256.decrypt(response.data);
				rtnVal.response = response.data.results[0][0];
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				handleError(def, response, 500, 'Fail to get a seller');
			});
			return def.promise;
		}
		function modifySeller (accessToken, data) {
			var url = config.api.seller;
			return doReq(accessToken,url,"PUT",data, 500,'Fail to modify a seller');
		}
		function doReq(accessToken, url, method, data, errorDefaultCode, errorDefaultMessage){
			var def = $q.defer();
			var reqOption = {
				method: method,
				url: url,
				headers: {
					"Authorization": accessToken
				}
			};
			if (data != undefined)
				reqOption.data = data;

			var req = $http(reqOption);
			req.then(function successCallback(response) {
				response.data = config.aes256.decrypt(response.data);
				def.resolve(response.data);
			}, function errorCallback(response) {
				handleError(def, response, errorDefaultCode, errorDefaultMessage);
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