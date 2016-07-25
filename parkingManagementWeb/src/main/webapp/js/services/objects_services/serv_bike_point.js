'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('bikePointService',['$rootScope', 'invokeWSService', 'sharedDataService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, gMapService){
	
	this.showLog = false;
	// BP get method
	this.getBikePointsFromDb = function(showBp){
		var markers = [];
		var allBpoints = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeWSService.getProxy(method, appId + "/bikepoint", null, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(allBpoints){
	    	allBpoints = gMapService.initAllBPObjects(allBpoints);	// The only solution found to retrieve all data;
	    	sharedDataService.setSharedLocalBps(allBpoints);
	    	if(showBp){
		    	for (var i = 0; i <  allBpoints.length; i++) {
		    		markers.push(gMapService.createMarkers(i, allBpoints[i], 3));
			    }
		    	gMapService.setBikePointsMarkers(markers);
	    	}
	    });
		return myDataPromise;
	};
	
	// PS update method
	this.updatePmeter = function(pm, status, area, zone0, zone1, zone2, zone3, zone4, geometry, type){
		var validityPeriod = [];
		var id = pm.id;
		var appId = sharedDataService.getConfAppId();
		var method = 'PUT';
		var data = {};
		if(type == 0){
			data = {
				id: pm.id,
				id_app: pm.id_app,
				code: pm.code,
				note: pm.note,
				status: status.idObj,
				areaId: area.id,
				zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
				geometry: gMapService.correctMyGeometry(geometry)
			};
		} else {
			data = {
				id: pm.id,
				id_app: pm.id_app,
				code: pm.code,
				note: pm.note,
				status: pm.status,
				areaId: pm.areaId,
				zones: pm.zones,
				geometry: pm.geometry
			};
		}
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Parkingmeter data : " + value);
		
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter/" + id, null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated parkinMeter: " + result.code);
	    });
	    return myDataPromise;
	};
	
	// PM create method
	this.createParkingMeterInDb = function(pm, status, area, zone0, zone1, zone2, zone3, zone4, geometry){
		var method = 'POST';
		var appId = sharedDataService.getConfAppId();
		var data = {
			id_app: appId,
			code: pm.code,
			note: pm.note,
			status: status.idObj,
			areaId: area.id,
			zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
			geometry: gMapService.correctMyGeometry(geometry)
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Parkingmeter data : " + value);
		
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Created parkinMeter: " + result.code);
	    });
	    return myDataPromise;
	};
	
	// PM delete method
	this.deleteParkingMeterInDb = function(pMeter){
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter/" + pMeter.areaId + "/"  + pMeter.id , null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted parkingmeter: " + pMeter.code);
	    });
	    return myDataPromise;
	};
}]);