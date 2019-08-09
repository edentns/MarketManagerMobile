'use strict';

var app=angular.module('sellorToolApp');

app.directive("backtotop", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            if(this.pageYOffset > 75){
              element[0].style.display = "block";
            }else{
              element[0].style.display = "none";
            }
            scope.$apply();
        });
    };
});

app.config(['$locationProvider' ,'$routeProvider', 'cfpLoadingBarProvider',
  function config($locationProvider, $routeProvider, cfpLoadingBarProvider) {
    $locationProvider.hashPrefix('!');
    cfpLoadingBarProvider.includeSpinner = false;
    $routeProvider.
      when('/login', {
        template:'<login></login>'
      }).
      when('/malls', {
        template:'<mall-list></mall-list>'
      }).
      when('/mall-config', {
        template:'<mall-config></mall-config>'
      }).
      when('/user-setting', {
        template:'<user-setting></user-setting>'
      }).
      when('/user-create', {
        template:'<user-create></user-create>'
      }).
      when('/user-terms', {
          template:'<user-terms></user-terms>'
      }).
      when('/user-terms-page', {
          template:'<user-terms-page></user-terms-page>'
      }).
      when('/order-list/:noMrk/:nmMrk/:userId', {
        template:'<order-list></order-list>'
      }).
      when('/notice-list', {
          template:'<notice-list></notice-list>'
      }).
      when('/notice-info/:kind/:no', {
          template:'<notice-info></notice-info>'
      }).
      when('/user-qna-info', {
          template:'<user-qna-info></user-qna-info>'
      }).
      when('/user-qna-list', {
          template:'<user-qna-list></user-qna-list>'
      }).
      when('/user-qna-write', {
          template:'<user-qna-write></user-qna-write>'
      }).
      otherwise('/login');
	}
])
.config(function($mdDateLocaleProvider) {
    moment.locale("ko");
    
    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'L', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };
    	
	$mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('YYYY-MM-DD');
	};
});

angular.module('textAngular').config(['$provide', function($provide) {
	$provide.decorator('taOptions', ['$delegate',
       function textAngularManager($delegate) {
		   var toolbar = [ 
	           	            /*["h1", "h2", "h3", "h4", "h5", "h6", "p", "pre", "quote"],*/
	           	            ["bold", "italics", "underline", "strikeThrough", "ul", "ol",/* "redo",*/ "undo"/*, "clear"*/],
	           	            ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"]
	           	            /*["html", "insertImage", "insertLink", "insertVideo", "wordcount", "charcount"]*/
	  		             ];
		   $delegate.toolbar = toolbar;
	  	   return $delegate;
  	   }	
  	]);
}]);


