"use strict";

/**
 * @ngdoc function
 * @name
 * modal - 약관보기
 */
angular.module("userTerms").
component("userTerms", {
	templateUrl : "contents/user-terms/user-terms.template.html",
	bindings: {
	    resolve: '<',
	    close: '&',
	    dismiss: '&'
	},
	controller : function () {
		
		var $ctrl = this;
		
		/**
		 * ===================================================
		 * @description 회원가입
		 * ===================================================
		 */
		$ctrl.$onInit = function () {
	        $ctrl.DC_CLA001 = $ctrl.resolve.resData.DC_CLA001;
	        $ctrl.DC_CLA002 = $ctrl.resolve.resData.DC_CLA002;
	        $ctrl.DC_CLA003 = $ctrl.resolve.resData.DC_CLA003;	       
		};
		
		/**
		 * 약관창 닫기
		 */
		$ctrl.cancel = function () {
			$ctrl.dismiss({$value: 'cancel'});
		};			
	}
});