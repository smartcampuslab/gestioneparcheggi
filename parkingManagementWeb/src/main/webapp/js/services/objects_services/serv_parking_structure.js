'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('structureService',['$rootScope', 'invokeWSService', 'sharedDataService', 'invokeWSServiceNS', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, invokeWSServiceNS, gMapService){
	
	this.showLog = false;
	
	// PS get method
    this.getParkingStructuresFromDb = function(showPs){
    	var markers = [];
    	var allPstructs = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure", null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allPstructs){
	    	allPstructs = gMapService.initAllPSObjects(allPstructs);	// The only solution found to retrieve all data;
	    	if(showPs){
	    		for (var i = 0; i <  allPstructs.length; i++) {
		    		markers.push(gMapService.createMarkers(i, allPstructs[i], 2));
		    		//allPstructs[i] = $scope.correctFeeData(allPstructs[i]);
			    }
	    		gMapService.setParkingStructuresMarkers(markers);
	    	}
	    });
	    return myDataPromise;
	};
	
	// PS get method without security
    this.getParkingStructuresFromDbNS = function(showPs){
    	var markers = [];
    	var allPstructs = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/parkingstructure", null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allPstructs){
	    	allPstructs = gMapService.initAllPSObjects(allPstructs);	// The only solution found to retrieve all data;
	    	if(showPs){
	    		for (var i = 0; i <  allPstructs.length; i++) {
		    		markers.push(gMapService.createMarkers(i, allPstructs[i], 2));
		    		//allPstructs[i] = $scope.correctFeeData(allPstructs[i]);
			    }
	    		gMapService.setParkingStructuresMarkers(markers);
	    	}
	    });
	    return myDataPromise;
	};
	
	// PS update method
	this.updateParkingStructureInDb = function(ps, paymode, zone0, zone1, zone2, zone3, zone4, geo, type){
		var validityPeriod = [];
		var id = ps.id;
		var appId = sharedDataService.getConfAppId();
		var method = 'PUT';
		var data = {};
		if(type == 0){
			for(var i = 0; i < ps.validityPeriod.length; i++){
				var corrPeriod = {
					from: ps.validityPeriod[i].from,
					to: ps.validityPeriod[i].to,
					weekDays: ps.validityPeriod[i].weekDays,
					timeSlot: ps.validityPeriod[i].timeSlot,
					rateValue: ps.validityPeriod[i].rateValue,
					holiday: ps.validityPeriod[i].holiday,
					note: ps.validityPeriod[i].note
				};
				validityPeriod.push(corrPeriod);
			}
			var totalStructSlots = sharedDataService.initIfNull(ps.payingSlotNumber) + sharedDataService.initIfNull(ps.handicappedSlotNumber); // + sharedDataService.initIfNull(ps.unusuableSlotNumber);
			data = {
				id: ps.id,
				id_app: ps.id_app,
				name: ps.name,
				streetReference: ps.streetReference,
				validityPeriod: validityPeriod,
				manager: ps.manager,
				managementMode: ps.managementMode,
				phoneNumber: ps.phoneNumber,
				paymentMode: sharedDataService.correctMyPaymentMode(paymode),
				slotNumber: totalStructSlots,
				payingSlotNumber: ps.payingSlotNumber,
				handicappedSlotNumber: ps.handicappedSlotNumber,
				unusuableSlotNumber: ps.unusuableSlotNumber,
				geometry: gMapService.correctMyGeometry(geo),
				zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
				parkAndRide: ps.parkAndRide
			};
		} else {
			data = {
				id: ps.id,
				id_app: ps.id_app,
				name: ps.name,
				streetReference: ps.streetReference,
				validityPeriod: ps.validityPeriod,
				manager: ps.manager,
				managementMode: ps.managementMode,
				phoneNumber: ps.phoneNumber,
				paymentMode: ps.paymentMode,
				slotNumber: ps.slotNumber,
				payingSlotNumber: ps.payingSlotNumber,
				handicappedSlotNumber: ps.handicappedSlotNumber,
				unusuableSlotNumber: ps.unusuableSlotNumber,
				geometry: ps.geometry,
				zones: ps.zones,
				parkAndRide: ps.parkAndRide
			};
		}
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("ParkingStructure data : " + value);
		
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure/" + id, null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated parkingStructure: " + result.name);
	    });
	    return myDataPromise;
	}; 
	
	// PS create method
	this.createParkingStructureInDb = function(ps, paymode, zone0, zone1, zone2, zone3, zone4, geo){
		var method = 'POST';
		var appId = sharedDataService.getConfAppId();
		
		var validityPeriod = [];
		for(var i = 0; i < ps.validityPeriod.length; i++){
			var corrPeriod = {
				from: ps.validityPeriod[i].from,
				to: ps.validityPeriod[i].to,
				weekDays: ps.validityPeriod[i].weekDays,
				timeSlot: ps.validityPeriod[i].timeSlot,
				rateValue: ps.validityPeriod[i].rateValue,
				holiday: ps.validityPeriod[i].holiday,
				note: ps.validityPeriod[i].note
			};
			validityPeriod.push(corrPeriod);
		}
		
		var totalStructSlots = sharedDataService.initIfNull(ps.payingSlotNumber) + sharedDataService.initIfNull(ps.handicappedSlotNumber);// + sharedDataService.initIfNull(ps.unusuableSlotNumber);
		var method = 'POST';
		var appId = sharedDataService.getConfAppId();
		var data = {
			id_app: appId,
			name: ps.name,
			streetReference: ps.streetReference,
			validityPeriod: validityPeriod,
			managementMode: ps.managementMode,
			manager: ps.manager,
			phoneNumber: ps.phoneNumber,
			paymentMode: sharedDataService.correctMyPaymentMode(paymode),
			slotNumber: totalStructSlots,
			payingSlotNumber: ps.payingSlotNumber,
			handicappedSlotNumber: ps.handicappedSlotNumber,
			unusuableSlotNumber: ps.unusuableSlotNumber,
			geometry: gMapService.correctMyGeometry(geo),
			zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
			parkAndRide: ps.parkAndRide
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLogDates) console.log("ParkingStructure data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Created parkingStructure: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// PS delete method
	this.deleteParkingStructureInDb = function(ps){
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure/" + ps.id, null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted struct: " + ps.name);
	    });
	    return myDataPromise;
	};
}]);