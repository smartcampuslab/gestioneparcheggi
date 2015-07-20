'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('AuxCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$route', '$location', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeWSServiceProxy', 'invokePdfServiceProxy', 'invokeAuxWSService', 'getMyMessages', '$timeout',
                               function($scope, $http, $routeParams, $rootScope, $route, $location, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, invokePdfServiceProxy, invokeAuxWSService, getMyMessages, $timeout) { 
	this.$scope = $scope;
    $scope.params = $routeParams;
    
    $scope.maxLogs = 10;
    
    $scope.logtabs = [ 
        { title:'Log generale', index: 1, content:"partials/aux/logs/global_logs.html" },
        { title:'Log vie', index: 2, content:"partials/aux/logs/street_logs.html" },
        { title:'Log parcheggi', index: 3, content:"partials/aux/logs/parking_logs.html" }
    ];
    
    $scope.authHeaders = {
        'Accept': 'application/json;charset=UTF-8'
    };
    
    $scope.logCounts = 0;
    $scope.globalLogs = [];
    
    $scope.initGlobalLogs = function(){
    	$scope.countAllLogsInDb();
    	$scope.getAllLogsFromDb(0);
    };
    
    $scope.countAllLogsInDb = function(){
		var elements = 0;
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/log/count/all", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    console.log("log counted in db: " + JSON.stringify(result));
		    elements = parseInt(result);
		    $scope.logCounts = elements;
		});
	};
	
	$scope.getAllLogsFromDb = function(skip){
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/log/all/" + skip, null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			console.log("log finded in db: " + JSON.stringify(result));
		    angular.copy(result, $scope.globalLogs);
		});
	};
    
    
}]);    