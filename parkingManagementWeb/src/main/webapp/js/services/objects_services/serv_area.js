'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.services('areaService', function($rootScope, invokeWSService, sharedDataService){
	
    this.getAreasFromDb = function(){
    	$scope.areaMapReady = false;
		var allAreas = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area", null, $scope.authHeaders, null);
	    myDataPromise.then(function(allAreas){
	    	$scope.areaWS = $scope.initAreasObjects(allAreas);
	    	if(showArea)$scope.resizeMap("viewArea");
	    	$scope.initAreasOnMap($scope.areaWS);
	    	sharedDataService.setSharedLocalAreas($scope.areaWS);
	    	$scope.areaMapReady = true;
	    });
	};
	
	$scope.getAreasFromDb = function(){
		var allAreas = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/area", null, $scope.authHeaders, null);
		myDataPromise.then(function(allAreas){
			$scope.areaWS = allAreas;
			if(showArea){
			    //$scope.initAreasOnMap($scope.areaWS, false, 1, false, true)[0];
			    gMapService.initAreasOnMap($scope.areaWS, false, 1, false, true)[0];	//MB_lightWS
			}    
			sharedDataService.setSharedLocalAreas($scope.areaWS);
		});
		return myDataPromise;
	};
	
	
});