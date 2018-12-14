(function() {
'use strict';
	angular
		.module('orderList')
		.factory('orderListSevice', orderListSevice);

	orderListSevice.$inject = ['$http', '$q', '$window', 'config', '$log'];
	function orderListSevice($http, $q, $window, config, $log) {
		return {
			orderList : orderList,
			chkOnChange : chkOnChange,
			orderConfirm : orderConfirm
		};
				
    	/**
		 * 주문 목록 
		 */
    	function orderList(param) {				
			var url = config.api.orderList;

			$http.defaults.headers.common.NO_M = 'SYME17041121';
			
			return $http({
				method	: "GET",
				url		: url + $.param(param),
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" }
			})
		}
    	
    	/**
		 * 주문 확정
		 */
    	function orderConfirm(param){
	    	var url = config.api.orderConfirm;
	
			$http.defaults.headers.common.NO_M = 'SYME17041121';
			
			return $http({
				method	: "PUT",
				url		: url,
				data    : param,
				headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" }
			})
    	}
    	
    	/**
		 * 체크박스 체크, 언체크에 따라 주문상태변화
		 */
    	function chkOnChange(self, param){
        	var chkedParamNum = param.rownum;
        	            	
        	if(param.ROW_CHK){
        		param.hoverClass = "success";
        		self.chkedDList.push(param);      
        		self.ordStatForBtn = (self.ordStatForBtn != param.CD_ORDSTAT && self.ordStatForBtn) ? "" : param.CD_ORDSTAT; // 버튼 (보이기/안보이기) 로직
        	}
        	else{
        		param.hoverClass = "";

				if(self.chkedDList.length === 1){
					self.chkedDList = [];    
					self.ordStatForBtn  = "";
    			}
				else{
					self.chkedDList = self.chkedDList.filter(function(item){
        				if(item.rownum !== chkedParamNum){
            				return item;
            			}
                	});  
					// 버튼 (보이기/안보이기) 로직
					angular.forEach(self.chkedDList, function(item, idx){
						if(idx === 0){
							self.ordStatForBtn = item.CD_ORDSTAT;
						}
						else if(idx > 0){
							self.ordStatForBtn = (self.ordStatForBtn !== item.CD_ORDSTAT) ? "" :item.CD_ORDSTAT;    							
						}
					});
				}
        	}
			//$log.info("list = ",self.chkedDList);
    	}
	}
})();