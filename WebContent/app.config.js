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
      when('/order-list/:noMrk/:nmMrk/:userId', {
        template:'<order-list></order-list>'
      }).
      otherwise('/login');   
  }
]);