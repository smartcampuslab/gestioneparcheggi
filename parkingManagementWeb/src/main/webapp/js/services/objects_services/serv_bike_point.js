'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('bikePointService',['$rootScope', 'invokeWSService', 'sharedDataService', 'invokeWSServiceNS', 'invokeDashboardWSService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, invokeWSServiceNS, invokeDashboardWSService, gMapService){
	
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
	
	// BP get method without security
	this.getBikePointsFromDbNS = function(showBp){
		var markers = [];
		var allBpoints = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/bikepoint", null, sharedDataService.getAuthHeaders(), null);
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
	
	// BP get method for dashboard
	this.getBikePointsFromDbDashboard = function(){
		var markers = [];
		var allBpoints = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/bikepoint", null, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(allBpoints){
	    });
		return myDataPromise;
	};
	
	// BP update method
	this.updateBikePointInDb = function(bp, zone0, zone1, zone2, zone3, zone4, geometry, type, agencyId){
		var id = bp.id;
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId
		};
		var method = 'PUT';
		
		var data = {};
		if(type == 0){
			data = {
				id: bp.id,
				id_app: bp.id_app,
				name: bp.name,
				slotNumber: bp.slotNumber,
				bikeNumber: bp.bikeNumber,
				zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
				geometry: gMapService.correctMyGeometry(geometry)
			};
		} else {
			data = {
				id: bp.id,
				id_app: bp.id_app,
				name: bp.name,
				slotNumber: bp.slotNumber,
				bikeNumber: bp.bikeNumber,
				zones: bp.zones,
				geometry: bp.geometry,
				agencyId: bp.agencyId
			};
		}
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Bikepoint data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/bikepoint/" + id, params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated bikepoint: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// BP create method
	this.createBikePointInDb = function(bp, zone0, zone1, zone2, zone3, zone4, geometry, agencyId){
		var method = 'POST';
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId
		};
		var myAgencyList = []
		if(agencyId){
			myAgencyList.push(agencyId);
		}
		var data = {
			id_app: appId,
			name: bp.name,
			slotNumber: bp.slotNumber,
			bikeNumber: bp.bikeNumber,
			zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
			geometry: gMapService.correctMyGeometry(geometry),
			agencyId: myAgencyList
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Bikepoint data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/bikepoint", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Create bikePoint: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// PM delete method
	this.deleteBikePointInDb = function(bp, agencyId){
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId
		};
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/bikepoint/" + bp.id , params, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted bikepoint: " + bp.name);
	    });
	    return myDataPromise;
	};
}]);