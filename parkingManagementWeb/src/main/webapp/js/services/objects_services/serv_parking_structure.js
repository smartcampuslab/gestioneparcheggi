'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('structureService',['$rootScope', 'invokeWSService', 'sharedDataService', 'invokeWSServiceNS', 'invokeDashboardWSService', 'utilsService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, invokeWSServiceNS, invokeDashboardWSService, utilsService, gMapService){
	
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
    this.getParkingStructuresFromDbNS = function(showPs, agencyId){
    	var markers = [];
    	var allPstructs = [];
		var method = 'GET';
		var params = null;
		if(agencyId != null && agencyId != ""){
			params = {
				agencyId: agencyId
			}
		}
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/parkingstructure", params, sharedDataService.getAuthHeaders(), null);
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
	
	// Method getProfitStructFromDb: used to retrieve te streets occupancy data from the db
	this.getProfitParksFromDb = function(year, month, weekday, dayType, hour, valueType, agencyId){
		// period params
		var monthRange = sharedDataService.chekIfAllRange(month, 1);
		var weekRange = sharedDataService.chekIfAllRange(weekday, 2);
		var hourRange = sharedDataService.chekIfAllRange(hour, 3);
		var markers = [];
		var allPSs = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: sharedDataService.correctParamsFromSemicolon(year),
			month: sharedDataService.correctParamsFromSemicolonForMonth(monthRange),
			weekday: sharedDataService.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: sharedDataService.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			agencyId: agencyId,
			noCache: new Date().getTime()
		};
		if(this.showLog)console.log("Params passed in ws get call" + JSON.stringify(params)); 	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profitchanged/" + idApp + "/parkstructs", params, sharedDataService.getAuthHeaders(), null);	//MB_lightWS: invoke only profitchanged instead of profit
		myDataPromise.then(function(allPSs){
		});
		return myDataPromise;
	};
	
	// Occupancy Park retrieving method
	this.getOccupancyParksFromDb = function(year, month, weekday, dayType, hour, valueType, agencyId){
		// period params
		var monthRange = sharedDataService.chekIfAllRange(month, 1);
		var weekRange = sharedDataService.chekIfAllRange(weekday, 2);
		var hourRange = sharedDataService.chekIfAllRange(hour, 3);
		var allParks = [];
		var markers = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: sharedDataService.correctParamsFromSemicolon(year),
			month: sharedDataService.correctParamsFromSemicolonForMonth(monthRange),
			weekday: sharedDataService.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: sharedDataService.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			vehicleType: sharedDataService.getVehicleType(),
			agencyId: agencyId,
			noCache: new Date().getTime()
		};
		if(this.showLog)console.log("Params passed in ws get call for Parks" + JSON.stringify(params));
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructures", params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(allParks){
		});
		return myDataPromise;
	};
	
	// Method getOccupancyParksUpdatedFromDb: used to retrieve te parks occupancy data from the db
	this.getOccupancyParksUpdatedFromDb = function(year, month, weekday, dayType, hour, valueType, agencyId){
		// period params
		var monthRange = sharedDataService.chekIfAllRange(month, 1);
		var weekRange = sharedDataService.chekIfAllRange(weekday, 2);
		var hourRange = sharedDataService.chekIfAllRange(hour, 3);
		var allParks = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: sharedDataService.correctParamsFromSemicolon(year),
			month: sharedDataService.correctParamsFromSemicolonForMonth(monthRange),
			weekday: sharedDataService.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: sharedDataService.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			vehicleType: sharedDataService.getVehicleType(),
			agencyId: agencyId,
			noCache: new Date().getTime()
		};
		if(this.showLog)console.log("Params passed in ws get call for Parks" + JSON.stringify(params));
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancychanged/" + idApp + "/parkingstructures", params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(allParks){
		});
		return myDataPromise;
	};
	
	// PS update method
	this.updateParkingStructureInDb = function(ps, paymode, zone0, zone1, zone2, zone3, zone4, geo, type, agencyId){
		var username = sharedDataService.getName();
		var validityPeriod = [];
		var id = ps.id;
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId,
			username: username
		};
		var method = 'PUT';
		var data = {};
		if(type == 0){
			if(ps.validityPeriod){
				for(var i = 0; i < ps.validityPeriod.length; i++){
					var tSlots = sharedDataService.correctTimeSlots(ps.validityPeriod[i].timeSlot);
					var corrPeriod = {
						from: ps.validityPeriod[i].from,
						to: ps.validityPeriod[i].to,
						weekDays: ps.validityPeriod[i].weekDays,
						timeSlot: ps.validityPeriod[i].timeSlot,
						timeSlots: tSlots,
						rateValue: ps.validityPeriod[i].rateValue,
						holiday: ps.validityPeriod[i].holiday,
						note: ps.validityPeriod[i].note
					};
					validityPeriod.push(corrPeriod);
				}
			}
			var psSlots = 0;
			if(ps.slotsConfiguration){
				for(var i = 0; i < ps.slotsConfiguration.length; i++){
					var sc = ps.slotsConfiguration[i];
					var calculatedTotSlots = sharedDataService.initIfNull(sc.handicappedSlotNumber) + sharedDataService.initIfNull(sc.reservedSlotNumber) + sharedDataService.initIfNull(sc.paidSlotNumber) + sharedDataService.initIfNull(sc.timedParkSlotNumber) + sharedDataService.initIfNull(sc.freeParkSlotNumber) + sharedDataService.initIfNull(sc.freeParkSlotSignNumber) + sharedDataService.initIfNull(sc.rechargeableSlotNumber) + sharedDataService.initIfNull(sc.loadingUnloadingSlotNumber) + sharedDataService.initIfNull(sc.pinkSlotNumber) + sharedDataService.initIfNull(sc.carSharingSlotNumber) + sharedDataService.initIfNull(sc.unusuableSlotNumber);
					ps.slotsConfiguration[i].slotNumber = calculatedTotSlots;
					ps.slotsConfiguration[i] = sharedDataService.configureSlotsForObjectNotDynamic(ps.slotsConfiguration[i]);
					if(sc.vehicleTypeActive){
						psSlots += calculatedTotSlots;
					}
				}
			}
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
				slotNumber: psSlots,
				slotsConfiguration: ps.slotsConfiguration,
				/*payingSlotNumber: ps.payingSlotNumber,
				handicappedSlotNumber: ps.handicappedSlotNumber,
				unusuableSlotNumber: ps.unusuableSlotNumber,*/
				geometry: gMapService.correctMyGeometry(geo),
				zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
				parkAndRide: ps.parkAndRide,
				abuttingPark: ps.abuttingPark
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
				slotsConfiguration: ps.slotsConfiguration,
				/*payingSlotNumber: ps.payingSlotNumber,
				handicappedSlotNumber: ps.handicappedSlotNumber,
				unusuableSlotNumber: ps.unusuableSlotNumber,*/
				geometry: ps.geometry,
				zones: ps.zones,
				parkAndRide: ps.parkAndRide,
				abuttingPark: ps.abuttingPark,
				algoritmData: ps.algoritmData,
				agencyId: ps.agencyId
			};
		}
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("ParkingStructure data : " + value);
		
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure/" + id, params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated parkingStructure: " + result.name);
	    });
	    return myDataPromise;
	}; 
	
	// PS create method
	this.createParkingStructureInDb = function(ps, paymode, zone0, zone1, zone2, zone3, zone4, geo, agencyId){
		var username = sharedDataService.getName();
		var method = 'POST';
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId,
			username: username
		};
		var myAgencyList = []
		if(agencyId){
			myAgencyList.push(agencyId);
		}
		var validityPeriod = [];
		if(ps.validityPeriod){
			for(var i = 0; i < ps.validityPeriod.length; i++){
				var tSlots = sharedDataService.correctTimeSlots(ps.validityPeriod[i].timeSlot);
				var corrPeriod = {
					from: ps.validityPeriod[i].from,
					to: ps.validityPeriod[i].to,
					weekDays: ps.validityPeriod[i].weekDays,
					timeSlot: ps.validityPeriod[i].timeSlot,
					timeSlots: tSlots,
					rateValue: ps.validityPeriod[i].rateValue,
					holiday: ps.validityPeriod[i].holiday,
					note: ps.validityPeriod[i].note
				};
				validityPeriod.push(corrPeriod);
			}
		}
		
		var psSlots = 0;
		if(ps.slotsConfiguration){
			for(var i = 0; i < ps.slotsConfiguration.length; i++){
				var sc = ps.slotsConfiguration[i];
				var calculatedTotSlots = sharedDataService.initIfNull(sc.handicappedSlotNumber) + sharedDataService.initIfNull(sc.reservedSlotNumber) + sharedDataService.initIfNull(sc.paidSlotNumber) + sharedDataService.initIfNull(sc.timedParkSlotNumber) + sharedDataService.initIfNull(sc.freeParkSlotNumber) + sharedDataService.initIfNull(sc.freeParkSlotSignNumber) + sharedDataService.initIfNull(sc.rechargeableSlotNumber) + sharedDataService.initIfNull(sc.loadingUnloadingSlotNumber) + sharedDataService.initIfNull(sc.pinkSlotNumber) + sharedDataService.initIfNull(sc.carSharingSlotNumber) + sharedDataService.initIfNull(sc.unusuableSlotNumber);
				ps.slotsConfiguration[i].slotNumber = calculatedTotSlots;
				ps.slotsConfiguration[i] = sharedDataService.configureSlotsForObjectNotDynamic(ps.slotsConfiguration[i]);
				if(sc.vehicleTypeActive){
					psSlots += calculatedTotSlots;
				}
			}
		}
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
			slotNumber: psSlots,
			slotsConfiguration: ps.slotsConfiguration,
			/*payingSlotNumber: ps.payingSlotNumber,
			handicappedSlotNumber: ps.handicappedSlotNumber,
			unusuableSlotNumber: ps.unusuableSlotNumber,*/
			geometry: gMapService.correctMyGeometry(geo),
			zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
			parkAndRide: ps.parkAndRide,
			abuttingPark: ps.abuttingPark,
			agencyId: myAgencyList
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("ParkingStructure data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Created parkingStructure: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// PS delete method
	this.deleteParkingStructureInDb = function(ps, agencyId){
		var username = sharedDataService.getName();
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId,
			username: username
		};
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure/" + ps.id, params, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted struct: " + ps.name);
	    });
	    return myDataPromise;
	};
	
	// PS create supply csv file
	this.getStructureSupplyCsv = function(structures){
		var method = 'POST';
		var value = utilsService.correctStructObjectForWS(structures);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/parkingstructures/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// PS create occupancy csv file
	this.getStructureOccupancyCsv = function(structures){
		var method = 'POST';
		var params = {
			vehicleType: sharedDataService.getVehicleType()
		};
		var value = utilsService.correctOccStructObjectForWS(structures);
	    if(this.showLog)console.log("Structure list data : " + value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/parkingstructures/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};
	
	// PS create profit csv file
	this.getStructureProfitCsv = function(structures){
		var method = 'POST';
		var value = utilsService.correctStructProfitObjectForWS(structures);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/parkingstructures/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// PS create timecost csv file
	this.getStructureTimeCostCsv = function(structures){
		var method = 'POST';
		var value = utilsService.correctStructTimeCostObjectForWS(structures);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/parkingstructures/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getHistorycalOccupancyParkingFromDb: used to retrieve the historycal parking occupancy data from the db
	this.getHistorycalOccupancyParkingFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = sharedDataService.chekIfAllRange(month, 1);
		var weekRange = sharedDataService.chekIfAllRange(weekday, 2);
		var hourRange = sharedDataService.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: sharedDataService.correctParamsFromSemicolon(year),
			month: sharedDataService.correctParamsFromSemicolonForMonth(monthRange),
			weekday: sharedDataService.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: sharedDataService.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			vehicleType: sharedDataService.getVehicleType(),
			noCache: new Date().getTime()
		};
		if(this.showLog)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructurecompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// create a csv file with parking structure historycal occupancy
	this.getOccupancyParkingHistoryCsv = function(dParking, matrixOcc){
		var method = 'POST';
		var params = {
			dparking_name: dParking.name,
			dparking_streetreference: dParking.streetReference,
			dparking_totalslot: dParking.slotNumber
		};
		var value = JSON.stringify(matrixOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/parkingstructureshistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Retrieve all historycal profit parkingStructures data from db
	this.getHistorycalProfitPsFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = sharedDataService.chekIfAllRange(month, 1);
		var weekRange = sharedDataService.chekIfAllRange(weekday, 2);
		var hourRange = sharedDataService.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: sharedDataService.correctParamsFromSemicolon(year),
			month: sharedDataService.correctParamsFromSemicolonForMonth(monthRange),
			weekday: sharedDataService.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: sharedDataService.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if(this.showLog)console.log("Params passed in ws get call" + JSON.stringify(params));
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/parkstructcompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// ParkiStruct historycal profit csv data
	this.getProfitParkStructHistoryCsv = function(dParkstruct, matrixPAll){
		var method = 'POST';
		var params = {
			dparkstruct_name: dParkstruct.name,
			dparkstruct_streetreference: dParkstruct.streetReference,
			dparkstruct_totalslot: dParkstruct.slotNumber
		};
		var value = JSON.stringify(matrixPAll);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/parkstructhistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getHistorycalTimeCostParkingFromDb: used to retrieve the historycal parking occupancy data from the db
	this.getHistorycalTimeCostParkingFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = sharedDataService.chekIfAllRange(month, 1);
		var weekRange = sharedDataService.chekIfAllRange(weekday, 2);
		var hourRange = sharedDataService.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: sharedDataService.correctParamsFromSemicolon(year),
			month: sharedDataService.correctParamsFromSemicolonForMonth(monthRange),
			weekday: sharedDataService.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: sharedDataService.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			vehicleType: sharedDataService.getVehicleType(),
			noCache: new Date().getTime()
		};
		if(this.showLog)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructurecompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Parking historycal occupancy csv data
	this.getTimeCostParkingHistoryCsv = function(dParking, matrixTimeCost){
		var method = 'POST';
		var params = {
			dparking_name: dParking.name,
			dparking_streetreference: dParking.streetReference,
			dparking_totalslot: dParking.slotNumber
		};
		var value = JSON.stringify(matrixTimeCost);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/parkingstructureshistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
}]);