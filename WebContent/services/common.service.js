(function() {
'use strict';
	angular
		.module('sellorToolApp')
		.factory('commonService', commonService);

	commonService.$inject = ['$rootScope', '$window', 'config', '$http'];
	function commonService($rootScope,  $window, config, $http) {
		return {
			isLogin: isLogin,
			logout: logout,
			long2date: long2date,
			short2date: short2date,
			init: init,
			getPagingPage: getPagingPage
		};
		function init($scope){
			if(!isLogin()) {
			 	$window.location.href = "#!/login";
			 	return false;
			}
			else{
				if ($scope.userId == null)
					$scope.userId = $rootScope.userId;
			}
			$scope.isCollapsedNav = true;
		    $scope.$on('$routeChangeSuccess', function () {
		        $scope.isCollapsedNav = true;
		    });
			$scope.isActive = function (viewLocation) {
				var location = $window.location.hash.split('/');
				return viewLocation === location[0]+'/'+location[1];
    		};
			$scope.logout = function() {
				if(confirm("로그아웃 하시겠습니까?")){
					logout();
					$window.location.href = "#!/login";
				};
			};
			$scope.short2date = function(timestamp) {
				return short2date(timestamp);
			};
			$scope.long2date = function(timestamp) {
				return long2date(timestamp);
			};
			$scope.noMall = function() {
				if ($rootScope.hasMall != null){
					return !$rootScope.hasMall;
				}else if ($window.sessionStorage.getItem("hasMall") != null){
					return !$window.sessionStorage.getItem("hasMall");
				}else {
					return true;
				}
			};		
			return true;
		}
		function isLogin () {
			var result = false;
			if($rootScope.userId == null || $rootScope.userId === "") {
				var userId = $window.sessionStorage.getItem("userId");
				if (userId != undefined && userId != null && userId != ''){
					$rootScope.userId = userId
					result = true;
				}
			}else{
				result = true;
			}
			return result;
		}
		function logout () {
			$rootScope.userId = "";
			$window.sessionStorage.clear();
			
			var req = $http({
					method	: "POST",
					url		: config.api.logout,
					headers	: {
						"Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8",
						NO_M : ""
					}
				});
			
			req.then(function successCallback(response) {
			}, function errorCallback(response) {
			});
		}
		function long2date(timestamp){
			try {
				return moment(timestamp).format('YYYY-MM-DD HH:mm');
			} catch (err) {
				return '';
			}
		}

		function short2date(timestamp){
			try {
				return moment(timestamp).format('YYYY-MM-DD');
			} catch (err) {
				return '';
			}
		}
		
		function getPagingPage(list, currentPage, numPerPage){
			var rstList = [];
        	var begin = ((currentPage - 1) * numPerPage),
      	  		end = begin + numPerPage;

        	rstList = list.slice(begin, end);

        	/*rstList = rstList.filter(function(item){
        		var tmp = item;
        		
        		tmp.ROW_CHK = false;
        		tmp.hoverClass = "";
        		return tmp;
        	});*/
        	
        	return rstList;
		}
	}
})();