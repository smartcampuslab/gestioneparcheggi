'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('structureService',['$rootScope', 'invokeWSService', 'sharedDataService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, gMapService){
	
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
	
	
	// PS update method
	this.updateParkingStructuresInDb = function(ps, paymode, zone0, zone1, zone2, zone3, zone4, geo, type){
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
				zones: gMapService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
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
	    if(this.showLog) console.log("Parkingmeter data : " + value);
		
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure/" + id, null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated parkingStructure: " + result.name);
	    });
	    return myDataPromise;
	}; 
	
	// Area create method
	this.createAreaInDb = function(area, myColor, zone0, zone1, zone2, zone3, zone4, createdPaths){
		var method = 'POST';
		var appId = sharedDataService.getConfAppId();
		
		var validityPeriod = [];
		for(var i = 0; i < area.validityPeriod.length; i++){
			var corrPeriod = {
				from: area.validityPeriod[i].from,
				to: area.validityPeriod[i].to,
				weekDays: area.validityPeriod[i].weekDays,
				timeSlot: area.validityPeriod[i].timeSlot,
				rateValue: area.validityPeriod[i].rateValue,
				holiday: area.validityPeriod[i].holiday,
				note: area.validityPeriod[i].note
			};
			validityPeriod.push(corrPeriod);
		}
		
		var data = {
			id_app: area.id_app,
			name: area.name,
			validityPeriod: validityPeriod,
			smsCode: area.smsCode,
			color: myColor.substring(1, myColor.length),	// I have to remove '#' char
			note: area.note,
			zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
			geometry: gMapService.correctMyGeometryPolygonForArea(createdPaths)
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Area data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Created area: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// Area delete method
	this.deleteAreaInDb = function(area){
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
		var myDataPromise = invokeWSService.getProxy(method, appId + "/area/" + area.id , null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted area: " +area.name);
	    });
	    return myDataPromise;
	};
}]);