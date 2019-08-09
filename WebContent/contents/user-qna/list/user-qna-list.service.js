(function() {
'use strict';
	angular
		.module('userQnaList')
		.factory('userQnaListService', userQnaListService);

	userQnaListService.$inject = ['$http', '$q', '$window', 'config', '$log'];
	function userQnaListService($http, $q, $window, config, $log) {
		var ansStat = [];
		
		return {
			getQnaList : getQnaList,
			changeDateWatch : changeDateWatch,
			setAnsStat : setAnsStat,
			getAnsStat :getAnsStat,
			ansStatTrans : ansStatTrans
		};
		
		function getQnaList(param){
			var url = config.api.getUt02Db,
				def = $q.defer(),
				rtnVal = [];
	
			$http.defaults.headers.common.NO_M = 'SYME17122901';
			
			var req = $http({
				method: 'POST',
				url: url,
				data: param
			});
	
			req.then(function successCallback(response) {
				$http.defaults.headers.common.NO_M = '';
				try{
					if(response.data.results[0].length){
						rtnVal = response.data.results[0];
					}
					else{
						rtnVal = [];
					}
				}catch(e){
					$log.error(e);
				}
				def.resolve(rtnVal);
			}, function errorCallback(response) {
				def.resolve(response);
			});
			return def.promise;
		}
		
		//날짜 계산
		function changeDateWatch(date){
			var nowDate = new Date();			

			if(date === "3d"){
				nowDate.setDate(nowDate.getDate() - 3);
			}
			else if(date === "1w"){
				nowDate.setDate(nowDate.getDate() - 7);
			}
			else if(date === "1m"){
				nowDate.setMonth(nowDate.getMonth() - 1);
			}
			else{
				nowDate = new Date();
			}
			
			return nowDate;
		}
		//처리상태 셋
		function setAnsStat(arr){
			ansStat = arr;
		}
		//처리상태 겟
		function getAnsStat(){
			return ansStat;
		}
		//처리상태 바인딩
		function ansStatTrans(array){
			array.filter(function(item){
				angular.forEach(ansStat, function(compare){
					if(compare.CD_DEF === item.CD_ANSSTAT){
						item.NM_ANSSTAT = compare.NM_DEF;
						return true;
					}
				});
				return item;
			})
		}
	}
})();