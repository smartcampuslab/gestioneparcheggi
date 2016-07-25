'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('parkingMeterService',['$rootScope', 'invokeWSService', 'sharedDataService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, gMapService){
	
	this.showLog = false;
	
	// PM get method
    this.getParkingMetersFromDb = function(showPm){
		var markers = [];
		var allPmeters = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter", null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allPmeters){
	    	allPmeters = gMapService.initAllPMObjects(allPmeters);	// The only solution found to retrieve all data;
	    	sharedDataService.setSharedLocalPms(allPmeters);
	    	if(showPm){
	    		for (var i = 0; i <  allPmeters.length; i++) {
		    		markers.push(gMapService.createMarkers(i, allPmeters[i], 1));
			    }
	    		gMapService.setParkingMetersMarkers(markers);
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