'use strict';

// Register `orderList` component, along with its associated controller and template
angular.module('orderList').
component('orderList', {
	templateUrl: 'order-list/order-list.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', '$timeout', 'commonService', "$q", "orderListSevice",
		function OrderListontroller($rootScope, $route, $scope, $http, $window, $timeout, commonService, $q, orderListSevice) {
			if (!commonService.init($scope)){
				return;
			}
			
			$scope.orderList = {
				list : [],
				filtereDlist : [],
                maxSize : 5,
                lisTsize : 0,
                nmMrk : '',
                userId : '',
                currentPage : 1,
                numPerPage : 5,
                selectedOptions : [
                	{ nm : '전체', val : '001,002,004'},
                	{ nm : '신규주문', val : '001'},
                	{ nm : '상품준비중', val : '002'},
                	{ nm : '배송중', val : '004'}
                ],
                selectedVal : { nm : '전체', val : '001,002,004'}
			}
			
			var initLoad = function () {
            	var sParam = $route.current.params,
            	    local = $scope.orderList;
            	
            	var ordParam = {
    				NM_MRKITEM : '',
				    NO_MRK : sParam.noMrk, 
				    CD_ORDSTAT : local.selectedVal.val,   
				    NO_MRKORD : '',
    				NM_PCHR : '',
				    DTS_CHK : '003',  
				    DTS_FROM : '*',           
				    DTS_TO : '*'
				}
                $q.all([
        			orderListSevice.orderList(ordParam).then(function (res) {
        				if(res.status === 200) {
            				return res.data;
        				}
        			})
                ]).then(function (result) {
                	var	tempList = [];
                	
                	local.list = result[0];
                	local.lisTsize = result[0].length;
                	                	
                	//순번 넣으려구 하드코딩을 함, db에서 해두 되는데 그냥 싫음
                	for(var i=0; i<local.lisTsize; i++){
                		tempList.push(angular.extend({rownum:i+1},local.list[i]));
                	}
                	
                	local.list = tempList;                	
                	local.nmMrk = sParam.nmMrk;  
                	local.userId = sParam.userId;  
                	                  	
                    //local.currentPage = 1;
                    //local.numPerPage = 5;
                	
                	pagerEvt();
                	
					ga('send','event','상세조회 페이지','click','상세 조회('+local.selectedVal.nm+')');
                });
            };
            
            var pagerEvt = function(){
            	var local = $scope.orderList;
            	var begin = ((local.currentPage - 1) * local.numPerPage),
          	  		end = begin + local.numPerPage;

            	local.filtereDlist = local.list.slice(begin, end);
            }

            $scope.$watch("orderList.currentPage + orderList.numPerPage", function() {
            	pagerEvt();
            }); 
            
            $scope.ordOnChange = function(){
            	initLoad();    
            }
                        
        	initLoad();          
		}
	]
});