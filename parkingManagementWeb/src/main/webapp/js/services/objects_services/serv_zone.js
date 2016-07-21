'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('zoneService', ['$rootScope', 'invokeWSService', 'sharedDataService', 'gMapService',
                    function($rootScope, invokeWSService, sharedDataService, gMapService){
	
	this.showLog = false;
	
	this.getZonesFromDb = function(z_type){
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + z_type, null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allZones){
	    	
	    });
	    return myDataPromise;
	};
	
	
}]);