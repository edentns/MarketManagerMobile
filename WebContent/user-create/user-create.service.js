(function() {
'use strict';
	angular
		.module('userCreate')
		.factory('userCreateSevice', userCreateSevice);

	userCreateSevice.$inject = ['$http', '$q', '$window', 'config'];
	function userCreateSevice($http, $q, $window, config) {
		return {
			createUser: createUser,
		};
		
		function createUser (data) {
			var url = config.api.seller;
			return doReq(url,"POST",data, 500,'Fail to create a user');
		}
		function doReq(url, method, data, errorDefaultCode, errorDefaultMessage){
			var def = $q.defer();
			var reqOption = {
				method: method,
				url: url
			};
			if (data != undefined)
				reqOption.data = data;

			var req = $http(reqOption);
			req.then(function successCallback(response) {
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