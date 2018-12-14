'use strict';

// Register `orderList` component, along with its associated controller and template
angular.module('orderList').
component('orderList', {
	templateUrl: 'order-list/order-list.template.html',
	controller: ['$rootScope', '$route', '$scope', '$http', '$window', '$timeout', 'commonService', "$q", "orderListSevice", '$log',
		function OrderListontroller($rootScope, $route, $scope, $http, $window, $timeout, commonService, $q, orderListSevice, $log) {
			if (!commonService.init($scope)){
				return;
			}
			
			var orderList = $scope.orderList = {
				ordStatForBtn : "",
				list : [],
				filtereDlist : [],
				chkedDList : [], 
                maxSize : 5,
                lisTsize : 0,
                nmMrk : '',
                userId : '',
                currentPage : 1,
                numPerPage : 5,
                selectedOptions : [
                	/*{ nm : '전체', val : '001,002,004,006,007,008'},*/
                	{ nm : '전체', val : '001,002,004,006'},
                	{ nm : '신규주문', val : '001'},
                	{ nm : '상품준비중', val : '002'},
                	{ nm : '배송중', val : '004'},
                	{ nm : '주문취소', val : '006'}/*,
                	{ nm : '반품', val : '007'},
                	{ nm : '교환', val : '008'}*/
                ],
                /*selectedVal : { nm : '전체', val : '001,002,004,006,007,008'}*/
                selectedVal : { nm : '전체', val : '001,002,004,006'}
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
            	var local = orderList;
            	var begin = ((local.currentPage - 1) * local.numPerPage),
          	  		end = begin + local.numPerPage;

            	local.filtereDlist = local.list.slice(begin, end);

            	initVar(local); //페이지 변화 있을대마다 선택된 데이터들 모두 초기화 시킴
            }
            
            var initVar = function(self){
            	self.chkedDList = [];    
            	self.ordStatForBtn  = "";
            	self.filtereDlist = self.filtereDlist.filter(function(item){
            		var tmp = item;
            		
            		tmp.ROW_CHK = false;
            		tmp.hoverClass = "";
            		return tmp;
            	});
            };

            $scope.$watch("orderList.currentPage + orderList.numPerPage", function() {
            	pagerEvt();
            }); 
                        
            $scope.ordOnChange = function(){
            	initLoad();    
            };
            
            $scope.chkOnChange = function(param){
            	orderListSevice.chkOnChange(orderList ,param);
            };
            
            $scope.orderConfirm = function(){
            	var local = orderList;
            	var willSendConfirmListSize = orderList.chkedDList.length; 
            	var param = orderList.chkedDList;            	
            	var tmpCclChk = [];
            	
            	tmpCclChk = param.filter(function(item){
            		if(item.CD_CCLSTAT){
            			return item;
            		}
            	});
            	
            	if(tmpCclChk.length){
            		alert("취소요청 된 신규주문이 있습니다.확인 후 다시 선택해주세요.");
            		return false;
            	}
            	
            	if(confirm("총 "+willSendConfirmListSize+"건의 주문을 확정하시겠습니까?")){
            		var rqtParam = {
            			data : param
            		}
            		
            		orderListSevice.orderConfirm(rqtParam).then(function (res) {
        				if(res.status === 200) {
        					initLoad();
        					ga('send','event','상세조회 페이지','click','주문 확정');
            				alert("주문확정 처리 되었습니다.");   				
        				}
        				else{
        					alert("주문확정을 실패하였습니다.\n관리자에게 문의바랍니다.");
        				}
        			},function(res){
        				alert("주문확정 시스템 오류 입니다.\n관리자에게 문의바랍니다.");
        			})
            	}
            };
            
            $scope.orderCancel= function(){
            	var local = orderList;
            	var willSendCclListSize = orderList.chkedDList.length; 
            	var param = orderList.chkedDList;
            	
            	if(willSendCclListSize > 1){
            		alert("주문취소는 한건씩만 처리할 수 있습니다.");
            	}
            };
        	initLoad();
		}
	]
});