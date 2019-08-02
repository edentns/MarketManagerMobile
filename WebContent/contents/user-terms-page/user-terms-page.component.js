"use strict";

/**
 * @ngdoc function
 * @name
 * modal - 약관보기
 */
angular.module("userTermsPage").
component("userTermsPage", {
	templateUrl : "contents/user-terms-page/user-terms-page.template.html",
	controller : ['$rootScope', '$scope', '$http', '$window', 'userCreateSevice',
	    function UserTermsPageController($rootScope, $scope, $http, $window, userCreateSevice) {		
		
			var userTerms = $scope.userTerms = {
				dcCla001 : "",
				dcCla002 : "",
				dcCla003 : ""
			}
			
			var init = function (){
				userCreateSevice.selectCla('001').then(function (res) {
					if(res.status === 200) {
						userTerms.dcCla001 = res.data;
						userCreateSevice.selectCla('002').then(function (res) {
							if(res.status === 200) {
								userTerms.dcCla002 = res.data;
								userCreateSevice.selectCla('003').then(function (res) {
									if(res.status === 200) {
										userTerms.dcCla003 = res.data;
									}
								});
							}
						});
					}
				});	
			}
			
			init();	
	}]
});