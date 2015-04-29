'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('IframeCtrl',['$scope', '$http', '$route', '$routeParams', '$rootScope', '$sce', 'localize', 'sharedDataService',
                          function($scope, $http, $route, $routeParams, $rootScope, $sce, localize, sharedDataService, $location, $filter) { // , $location 
	
	$scope.frameWidth = "100";
	$scope.frameHeight = "800";
	
	$scope.selectedUrl = "http://localhost:8080/myweb";
	
	$scope.urlList = [{desc:"localhost", value: "http://localhost:8080/myweb"},
	                  {desc:"10.0.2.2", value: "http://10.0.2.2:8080/myweb"},
	                  {desc:"dev", value: "https://dev.smartcommunitylab.it/myweb"},
	                  {desc:"produzione", value: "https://tn.smartcommunitylab.it/myweb"}];
	
	$scope.logout = function() {
        window.location.href = "myweb/logout";
    };
    
    $scope.getSelectedUrl = function(){
    	return $sce.trustAsResourceUrl($scope.selectedUrl);
    };
	
}]);