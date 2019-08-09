(function() {
'use strict';
	angular
		.module('userQnaInfo')
		.factory('userQnaInfoService', userQnaInfoService);

	userQnaInfoService.$inject = ['$http', '$q', '$window', 'config', '$log', '$compile', '$rootScope'];
	function userQnaInfoService($http, $q, $window, config, $log, $compile, $scope) {
		var detailInfo = null;
		
		return {
			setDetailInfo : setDetailInfo,
			getDetailInfo : getDetailInfo,
		};
				
		function setDetailInfo(param){
			detailInfo = param
		}
		
		function getDetailInfo(){
			return detailInfo;
		}
	}
})();