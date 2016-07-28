'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('streetService',['$rootScope', 'invokeWSService', 'sharedDataService', 'invokeWSServiceNS', 'invokeDashboardWSService', 'utilsService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, invokeWSServiceNS, invokeDashboardWSService, utilsService, gMapService){
	
	this.showLog = false;
	
	// Streets get method
    this.getStreetsFromDb = function(showStreets){
		var allStreet = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeWSService.getProxy(method, appId + "/street", null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allStreet){
	    	// console.log("streets from DB " + JSON.stringify(result));
	    	gMapService.setOccupancyStreet(allStreet);
	    });
	    return myDataPromise;
	};
	
	// Streets get method without security
    this.getStreetsFromDbNS = function(showStreets){
		var allStreet = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/street", null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allStreet){
	    	gMapService.setOccupancyStreet(allStreet);
	    });
	    return myDataPromise;
	};
	
	// Method getOccupancyStreetsFromDb: used to retrieve te streets occupancy data from the db
	this.getOccupancyStreetsFromDb = function(year, month, weekday, dayType, hour, valueType){
		var allStreet = [];
		// period params
		var monthRange = sharedDataService.chekIfAllRange(month, 1);
		var weekRange = sharedDataService.chekIfAllRange(weekday, 2);
		var hourRange = sharedDataService.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: sharedDataService.correctParamsFromSemicolon(year),
			month: sharedDataService.correctParamsFromSemicolonForMonth(monthRange),
			weekday: sharedDataService.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: sharedDataService.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		if(this.showLog)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/streets", params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(allStreet){
		});
		return myDataPromise;
	};
	
	// Method getOccupancyStreetsUpdatesFromDb: used to retrieve te streets occupancy data from the db
	this.getOccupancyStreetsUpdatesFromDb = function(year, month, weekday, dayType, hour, valueType){
		// period params
		var monthRange = sharedDataService.chekIfAllRange(month, 1);
		var weekRange = sharedDataService.chekIfAllRange(weekday, 2);
		var hourRange = sharedDataService.chekIfAllRange(hour, 3);
		
		var allStreet = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: sharedDataService.correctParamsFromSemicolon(year),
			month: sharedDataService.correctParamsFromSemicolonForMonth(monthRange),
			weekday: sharedDataService.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: sharedDataService.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		if(this.showLog)console.log("Params passed in ws get call" + JSON.stringify(params));
			
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancychanged/" + idApp + "/streets", params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(allStreet){
		});
		return myDataPromise;
	};
	
	// Street update method
	this.updateStreetInDb = function(street, area, zone0, zone1, zone2, zone3, zone4, pms, editPolyline, type){
		var calculatedTotSlots = sharedDataService.initIfNull(street.handicappedSlotNumber) + sharedDataService.initIfNull(street.reservedSlotNumber) + sharedDataService.initIfNull(street.paidSlotNumber) + sharedDataService.initIfNull(street.timedParkSlotNumber) + sharedDataService.initIfNull(street.freeParkSlotNumber) + sharedDataService.initIfNull(street.freeParkSlotSignNumber) + sharedDataService.initIfNull(street.unusuableSlotNumber);
		var id = street.id;
		var appId = sharedDataService.getConfAppId();
		var method = 'PUT';
		
		var data = {};
		if(type == 0){
			data = {
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
		} else {
			data = {
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
		}
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Street data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/street/" + id, null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated street: " + result.streetReference);
	    });
	    return myDataPromise;
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
	
	// Street csv supply creation
	this.getStreetSupplyCsv = function(streets){
		var method = 'POST';
		var value = utilsService.correctStreetObjectForWS(streets);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/street/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Street csv occupancy creation
	this.getStreetOccupancyCsv = function(streets){
		var method = 'POST';
		var value = utilsService.correctOccStreetObjectForWS(streets);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/street/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Street csv profit creation
	this.getStreetProfitCsv = function(profitStreetsList){
		var method = 'POST';
		var value = utilsService.correctProfitStreetObjectForWS(profitStreetsList);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/street/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Street csv time cost creation
	this.getStreetTimeCostCsv = function(streets){
		var method = 'POST';
		var value = utilsService.correctTimeCostStreetObjectForWS(streets);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/street/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getHistorycalOccupancyStreetFromDb: used to retrieve the historycal streets occupancy data from the db
	this.getHistorycalOccupancyStreetFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/streetcompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Street historycal occupancy csv data
	this.getOccupancyStreetHistoryCsv = function(dStreet, matrixOcc){
		var method = 'POST';
		var params = {
				dstreet_name: dStreet.streetReference,
				dstreet_area: dStreet.area_name,
				dstreet_totalslot: dStreet.slotNumber
		};
		var value = JSON.stringify(matrixOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/streethistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};
	
	// Method getHistorycalProfitStreetFromDb: used to retrieve the historycal street profit data from the db
	this.getHistorycalProfitStreetFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/streetcompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Street historycal profit csv data
	this.getProfitStreetHistoryCsv = function(dStreet, matrixPStreetAll){
		var method = 'POST';
		var params = {
				dstreet_name: dStreet.streetReference,
				dstreet_area: dStreet.area_name,
				dstreet_totalslot: dStreet.slotNumber
		};
		var value = JSON.stringify($scope.matrixPStreetAll);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/streethistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};
	
	// Method getHistorycalTimeCostStreetFromDb: used to retrieve the historycal streets extratime cost data from the db
	this.getHistorycalTimeCostStreetFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/streetcompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Street historycal occupancy csv data
	this.getTimeCostStreetHistoryCsv = function(dStreet, matrixTimeCost){
		var method = 'POST';
		var params = {
				dstreet_name: dStreet.streetReference,
				dstreet_area: dStreet.area_name,
				dstreet_totalslot: dStreet.slotNumber
		};
		var value = JSON.stringify(matrixTimeCost);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/streethistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};
	
	
}]);