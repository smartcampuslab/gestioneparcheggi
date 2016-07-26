'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('zoneService', ['$rootScope', 'invokeWSService', 'sharedDataService', 'invokeWSServiceNS', 'gMapService',
                    function($rootScope, invokeWSService, sharedDataService, invokeWSServiceNS, gMapService){
	
	this.showLog = false;
	
	// Get zones from DB method
	this.getZonesFromDb = function(z_type){
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + z_type, null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allZones){
	    	
	    });
	    return myDataPromise;
	};
	
	// Get zones from DB method
	this.getZonesFromDbNS = function(z_type){
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/zone/" + z_type, null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allZones){
	    	
	    });
	    return myDataPromise;
	};
	
	// Zone update method
	this.updateZoneInDb = function(zone, myColor, center, corrType, editCorrectedPath){
		var id = zone.id;
		var appId = sharedDataService.getConfAppId();
		var method = 'PUT';
		
		var data = {
			id: zone.id,
			id_app: zone.id_app,
			name: zone.name,
			submacro: zone.submacro,
			submicro: zone.submicro,
			color: myColor.substring(1, myColor.length),	// I have to remove '#' char
			note: zone.note,
			type: corrType,
			centermap: gMapService.correctMyGeometry(center),
			geometry: gMapService.correctMyGeometryPolyline(editCorrectedPath),
			geometryFromSubelement: zone.geometryFromSubelement
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Zone data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + id, null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated Zone: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// Zone create method
	this.createZoneInDb = function(zone, myColor, center, corrType, newCorrectedPath){
		var method = 'POST';
		var appId = sharedDataService.getConfAppId();
		var data = {
			id_app: appId,
			name: zone.name,
			submacro: zone.submacro,
			submicro: zone.submicro,
			color: myColor.substring(1, myColor.length),	// I have to remove '#' char
			note: zone.note,
			type: corrType,
			centermap: gMapService.correctMyGeometry(center),
			geometry: gMapService.correctMyGeometryPolyline(newCorrectedPath),
			geometryFromSubelement: zone.geometryFromSubelement
		};
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Zone data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Created zone: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// Zone delete method
	this.deleteZoneInDb = function(zone){
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
		var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + zone.id, null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted zones: " + zone.name);
	    });
	    return myDataPromise;
	};
	
	
}]);