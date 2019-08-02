(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name edtApp.common.service:InterceptorSvc
	 */
	angular.module("sellorToolApp")
		.factory("InterceptorSvc", ["$rootScope", "$q", "$location", 'config', '$window', function ($rootScope, $q, $location, allConfig, $window) {
			function init() {// 초기화
			}

			return {
				request: function (config) {
					if(allConfig.encrypt &&
					   config.data && 
					   config.method !== "GET") {
						if(config.data != null && typeof config.data == 'object') {
							config.data = JSON.stringify(config.data);
						}
						config.data = allConfig.aes256.encrypt(config.data);
					}
					
					return config;
				},
				response: function (config) {
					if(config.data && config.data.enc) {
						config.data = allConfig.aes256.decrypt(config.data);
					}
					
					try {
						config.data = JSON.parse(config.data);
					}
					catch(e) {
					}
					
					return config;
				},
				responseError: function (config) {
					var defer   = $q.defer(),
					    msg     = '';
//
					switch (config.status) {
						case 400:// 로그인 실패
							defer.reject(config);
							break;
						case 401:// 로그인 상태가 아닐경우
							//if ($location.$$path !== '/99sy/syLogin' && $location.$$path !== '/99sy/syUserJoin') {
								alert('[' + config.status + '] 로그인 상태가 아닙니다.');
								//init();
								//$location.url('/99sy/syLogin');
								$rootScope.userId = "";
								$window.sessionStorage.clear();
								$window.location.href = "#!/login";
								//commonService.logout();
								defer.reject(config);
							//}
							//defer.resolve(config);

							break;
						case 404:// 페이지 없음
							defer.reject(config);
							break;
						default:
							if (config.statusText !== '') {
								msg += config.statusText +'\n';
							}

							if(config.data != null && config.data === "") {
								alert(msg += 'System에 장애가 발생하였습니다. \n잠시 후에 다시 시도해주세요.');
							}

							defer.reject(config);
							break;
					}

					return defer.promise;
				}
			};
		}]);
}());