'use strict';

// Register `orderList` component, along with its associated controller and template
angular.
module('orderList').
component('orderList', {
	templateUrl: 'order-list/order-list.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', 'commonService',"$q", "orderListSevice",
		function OrderListontroller($rootScope, $route, $scope, $http, $window, commonService, $q, orderListSevice) {
			if (!commonService.init($scope)){
				return;
			}
			
			$scope.orderList = {
				list : [],
				filtereDlist : [],
                maxSize : 5,
                lisTsize : 0,
                nmMrk : '',
                userId : ''
			}
			
			var initLoad = function () {
            	var sParam = $route.current.params;
            	var ordParam = {
    				NM_MRKITEM : '',
				    NO_MRK : sParam.noMrk, 
				    CD_ORDSTAT : '001',   
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
                	var local = $scope.orderList,
                		tempList = [];
                	
                	local.list = result[0];
                	local.lisTsize = result[0].length;
                	
                	local.currentPage = 1;
                	local.numPerPage = 5;
                	
                	//순번 넣으려구 하드코딩을 함, db에서 해두 되는데 그냥 싫음
                	for(var i=0; i<local.lisTsize; i++){
                		tempList.push(angular.extend({rownum:i+1},local.list[i]));
                	}
                	
                	local.list = tempList;
                	
                	local.nmMrk = sParam.nmMrk;  
                	local.userId = sParam.userId;  

					ga('send','event','상세조회 페이지','click','상세 조회');
                });
            };

            $scope.$watch("orderList.currentPage + orderList.numPerPage", function() {
            	var local = $scope.orderList;
            	var begin = ((local.currentPage - 1) * local.numPerPage),
              	  	end = begin + local.numPerPage;

            	local.filtereDlist = local.list.slice(begin, end);
            });
            
            initLoad();
		}
	]
});