'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.services('zonesService', function($rootScope, invokeWSService, sharedDataService){
	
	this.getZonesFromDb = function(z_type, tindex){
		$scope.zoneMapReady = false;
		$scope.zoneWS = [];	// clear zones;
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + z_type, null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allZones);
	    	$scope.zoneWS = $scope.correctMyZones(allZones);	
		    if(showZones)$scope.resizeMap("viewZone" + tindex);
		    $scope.initZonesOnMap($scope.zoneWS, tindex);
		    $scope.setSharedLocalZones($scope.zoneWS, tindex);
	    	$scope.zoneMapReady = true;
	    });
	};
	
	
});