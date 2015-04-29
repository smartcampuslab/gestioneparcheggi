'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('InfoCtrl',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', 'sharedDataService',
                          function($scope, $http, $route, $routeParams, $rootScope, localize, sharedDataService, $location, $filter) { // , $location 

	$scope.showInfo = function(value){
    	switch(value){
    		case 0:
    			$scope.showInfo_0 = true;
    			break;
    		case 1:
    			$scope.showInfo_1 = true;
    			break;
    		case 2:
    			$scope.showInfo_2 = true;
    			break;
    		case 3:
    			$scope.showInfo_3 = true;
    			break;
    		case 4:
    			$scope.showInfo_4 = true;
    			break;
    		case 5:
    			$scope.showInfo_5 = true;
    			break;
    		case 6:
    			$scope.showInfo_6 = true;
    			break;
    		case 7:
    			$scope.showInfo_7 = true;
    			break;
    		case 71:
    			$scope.showInfo_71 = true;
    			break;
    		case 72:
    			$scope.showInfo_72 = true;
    			break;	
    		case 8:
    			$scope.showInfo_8 = true;
    			break;		
    		case 9:
    			$scope.showInfo_9 = true;
    			break;
    		case 10:
    			$scope.showInfo_10 = true;
    			break;
    		case 11:
    			$scope.showInfo_11 = true;
    			break;
    		case 12:
    			$scope.showInfo_12 = true;
    			break;
    		case 13:
    			$scope.showInfo_13 = true;
    			break;
    		case 14:
    			$scope.showInfo_14 = true;
    			break;
    		case 15:
    			$scope.showInfo_15 = true;
    			break;
    		case 19:
    			$scope.showInfo_19 = true;
    			break;
    		case 20:
    			$scope.showInfo_20 = true;
    			break;
    		case 111:
    			$scope.showInfo_111 = true;
    			break;	
    		case 112:
    			$scope.showInfo_112 = true;
    			break;	
    		default:
				break;
    	}	
    };
    
    $scope.hideInfo = function(value){
    	switch(value){
    		case 0:
    			$scope.showInfo_0 = false;
    			break;
    		case 1:
    			$scope.showInfo_1 = false;
    			break;
    		case 2:
    			$scope.showInfo_2 = false;
    			break;
    		case 3:
    			$scope.showInfo_3 = false;
    			break;
    		case 4:
    			$scope.showInfo_4 = false;
    			break;
    		case 5:
    			$scope.showInfo_5 = false;
    			break;
    		case 6:
    			$scope.showInfo_6 = false;
    			break;	
    		case 7:
    			$scope.showInfo_7 = false;
    			break;
    		case 71:
    			$scope.showInfo_71 = false;
    			break;
    		case 72:
    			$scope.showInfo_72 = false;
    			break;	
    		case 8:
    			$scope.showInfo_8 = false;
    			break;
    		case 9:
    			$scope.showInfo_9 = false;
    			break;
    		case 10:
    			$scope.showInfo_10 = false;
    			break;
    		case 11:
    			$scope.showInfo_11 = false;
    			break;
    		case 12:
    			$scope.showInfo_12 = false;
    			break;
    		case 13:
    			$scope.showInfo_13 = false;
    			break;
    		case 14:
    			$scope.showInfo_14 = false;
    			break;
    		case 15:
    			$scope.showInfo_15 = false;
    			break;
    		case 19:
    			$scope.showInfo_19 = false;
    			break;	
    		case 20:
    			$scope.showInfo_20 = false;
    			break;
    		case 111:
    			$scope.showInfo_111 = false;
    			break;
    		case 112:
    			$scope.showInfo_112 = false;
    			break;	
    		default:
				break;
    	}	
    };
	
}]);