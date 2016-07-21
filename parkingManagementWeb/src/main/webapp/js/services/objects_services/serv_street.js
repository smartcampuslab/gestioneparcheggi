'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('streetService',['$rootScope', 'invokeWSService', 'sharedDataService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, gMapService){
	
	this.showLog = false;
	
	// Streets get method
    this.getStreetsFromDb = function(showStreets){
		var allStreet = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeWSService.getProxy(method, appId + "/street", null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allStreet){
	    	// console.log("streets from DB " + JSON.stringify(result));
	    });
	    return myDataPromise;
	};
	
	// Street update method
	this.updateStreetInDb = function(street, area, zone0, zone1, zone2, zone3, zone4, pms, editPolyline){
		var calculatedTotSlots = sharedDataService.initIfNull(street.handicappedSlotNumber) + sharedDataService.initIfNull(street.reservedSlotNumber) + sharedDataService.initIfNull(street.paidSlotNumber) + sharedDataService.initIfNull(street.timedParkSlotNumber) + sharedDataService.initIfNull(street.freeParkSlotNumber) + sharedDataService.initIfNull(street.freeParkSlotSignNumber) + sharedDataService.initIfNull(street.unusuableSlotNumber);
		var id = street.id;
		var appId = sharedDataService.getConfAppId();
		var method = 'PUT';
		
		var data = {
			id: street.id,
			id_app: street.id_app,
			streetReference: street.streetReference,
			slotNumber: calculatedTotSlots,
			handicappedSlotNumber: street.handicappedSlotNumber,
			reservedSlotNumber: street.reservedSlotNumber,
			timedParkSlotNumber:street.timedParkSlotNumber,
			paidSlotNumber: street.paidSlotNumber,
			freeParkSlotNumber: street.freeParkSlotNumber,
			freeParkSlotSignNumber: street.freeParkSlotSignNumber,
			unusuableSlotNumber: street.unusuableSlotNumber,
			subscritionAllowedPark: street.subscritionAllowedPark,
			color: area.color,
			rateAreaId: area.id,
			zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
			parkingMeters: sharedDataService.correctMyPmsForStreet(pms),
			geometry: gMapService.correctMyGeometryPolyline(editPolyline)
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Street data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/street/" + id, null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated street: " + result.streetReference);
	    });
	    return myDataPromise;
	};
	
	// Used to update street relations with zones/parkingmeters
	this.updateStreetRelations = function(street){
		var id = street.id;
		var appId = sharedDataService.getConfAppId();
		var method = 'PUT';
		
		var data = {
			id: street.id,
			id_app: street.id_app,
			streetReference: street.streetReference,
			slotNumber: street.slotNumber,
			handicappedSlotNumber: street.handicappedSlotNumber,
			reservedSlotNumber: street.reservedSlotNumber,
			timedParkSlotNumber:street.timedParkSlotNumber,
			paidSlotNumber: street.paidSlotNumber,
			freeParkSlotNumber: street.freeParkSlotNumber,
			freeParkSlotSignNumber: street.freeParkSlotSignNumber,
			unusuableSlotNumber: street.unusuableSlotNumber,
			subscritionAllowedPark: street.subscritionAllowedPark,
			color: street.color,
			rateAreaId: street.rateAreaId,
			zones: street.zones,
			parkingMeters: street.parkingMeters,
			geometry: street.geometry
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Street data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/street/" + id, null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated street: " + result.streetReference);	
	    });	
	};
	
	// Street create method
	this.createStreetInDb = function(street, area, zone0, zone1, zone2, zone3, zone4, pms, createPolyline){
		var calculatedTotSlots = sharedDataService.initIfNull(street.handicappedSlotNumber) + sharedDataService.initIfNull(street.reservedSlotNumber) + sharedDataService.initIfNull(street.paidSlotNumber) + sharedDataService.initIfNull(street.timedParkSlotNumber) + sharedDataService.initIfNull(street.freeParkSlotNumber) + sharedDataService.initIfNull(street.freeParkSlotSignNumber) + sharedDataService.initIfNull(street.unusuableSlotNumber);
		var method = 'POST';
		var appId = sharedDataService.getConfAppId();
		var data = {
			id_app: appId,
			streetReference: street.streetReference,
			slotNumber: calculatedTotSlots,
			handicappedSlotNumber: street.handicappedSlotNumber,
			reservedSlotNumber: street.reservedSlotNumber,
			timedParkSlotNumber:street.timedParkSlotNumber,
			paidSlotNumber: street.paidSlotNumber,
			freeParkSlotNumber: street.freeParkSlotNumber,
			freeParkSlotSignNumber: street.freeParkSlotSignNumber,
			unusuableSlotNumber: street.unusuableSlotNumber,
			subscritionAllowedPark: street.subscritionAllowedPark,
			color: area.color,
			rateAreaId: area.id,
			zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
			parkingMeters: sharedDataService.correctMyPmsForStreet(pms),
			geometry: gMapService.correctMyGeometryPolyline(createPolyline)
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Street data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/street", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Created street: " + result.streetReference);
	    });
	    return myDataPromise;
	};
	
	// Street delete method
	this.deleteStreetInDb = function(street){
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
		var myDataPromise = invokeWSService.getProxy(method, appId + "/street/" + street.rateAreaId + "/" + street.id , null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted street: " + street.name);
	    });
	    return myDataPromise;
	};
}]);