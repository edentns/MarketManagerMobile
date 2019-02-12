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
                	{ nm : '전체', val : '001,002,004,005'},                	
                	{ nm : '신규주문', val : '001'},
                	{ nm : '상품준비중', val : '002'},
                	{ nm : '배송중', val : '004'},
                	{ nm : '취소요청', val : '001'},
                	{ nm : '반품요청', val : '004,005'},
                	{ nm : '교환요청', val : '004,005'}
                ],
                selectedVal : { nm : '전체', val : '001,002,004,005'}                
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
        			local.list = orderListSevice.fncList(result[0], orderList);         
        			local.lisTsize = local.list.length;
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
            //주문확정
            $scope.orderConfirm = function(){
            	var local = orderList;
            	var willSendConfirmListSize = local.chkedDList.length; 
            	var param = local.chkedDList;            	
            	var tmpCclChk = [];
            	
            	tmpCclChk = param.filter(function(item){
            		if(item.OTHER_ORDSTAT === "취소요청"){
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
            //주문취소
            $scope.orderCancel= function(){
            	var local = orderList;
            	var willSendCclListSize = local.chkedDList.length; 
            	var param = local.chkedDList;
            	
            	if(willSendCclListSize > 1){
            		alert("주문취소는 한건씩만 처리할 수 있습니다.");
            	}
            };
        	initLoad();
		}
	]
});