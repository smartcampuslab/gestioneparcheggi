'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('parkingMeterService',['$rootScope', 'invokeWSService', 'sharedDataService', 'invokeWSServiceNS', 'invokeDashboardWSService', 'utilsService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, invokeWSServiceNS, invokeDashboardWSService, utilsService, gMapService){
	
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
	
	// PM get method without security
    this.getParkingMetersFromDbNS = function(showPm){
		var markers = [];
		var allPmeters = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/parkingmeter", null, sharedDataService.getAuthHeaders(), null);
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
	
	this.getProfitPMFromDb = function(year, month, weekday, dayType, hour, valueType){
		// period params
		var monthRange = sharedDataService.chekIfAllRange(month, 1);
		var weekRange = sharedDataService.chekIfAllRange(weekday, 2);
		var hourRange = sharedDataService.chekIfAllRange(hour, 3);
		var markers = [];
		var allPMs = [];
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/parkingmeters", params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(allPMs){
		    sharedDataService.setSharedLocalPms(allPMs);
		    gMapService.setProfitParkingMeter(allPMs);
		});
		return myDataPromise;
	};
	
	this.correctMyPmStatus = function(pm_status){
		var correctPmS = "ACTIVE";
		if(pm_status == "Active" || pm_status == "Attivo"){
			correctPmS = "ACTIVE";
		} else if(pm_status == "Disabled" || pm_status == "Spento"){
			correctPmS = "INACTIVE";
		} else {
			correctPmS = pm_status;
		}
		return correctPmS;
	};
	
	// PS update method
	this.updatePmeterInDb = function(pm, area, zone0, zone1, zone2, zone3, zone4, geometry, type, agencyId){
		var validityPeriod = [];
		var id = pm.id;
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId
		};
		var method = 'PUT';
		var data = {};
		if(type == 0){
			data = {
				id: pm.id,
				id_app: pm.id_app,
				code: pm.code,
				note: pm.note,
				status: this.correctMyPmStatus(pm.status),
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
				geometry: pm.geometry,
				agencyId: pm.agencyId
			};
		}
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Parkingmeter data : " + value);
		
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter/" + id, params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated parkinMeter: " + result.code);
	    });
	    return myDataPromise;
	};
	
	// PM create method
	this.createParkingMeterInDb = function(pm, area, zone0, zone1, zone2, zone3, zone4, geometry, agencyId){
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
			code: pm.code,
			note: pm.note,
			status: this.correctMyPmStatus(pm.status),
			areaId: area.id,
			zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
			geometry: gMapService.correctMyGeometry(geometry),
			agencyId: myAgencyList
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Parkingmeter data : " + value);
		
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Created parkinMeter: " + result.code);
	    });
	    return myDataPromise;
	};
	
	// PM delete method
	this.deleteParkingMeterInDb = function(pMeter, agencyId){
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId
		};
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter/" + pMeter.areaId + "/"  + pMeter.id , params, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted parkingmeter: " + pMeter.code);
	    });
	    return myDataPromise;
	};
	
	// PM csv supply file creation
	this.getPMSupplyCsv = function(parkingMeters){
		var method = 'POST';
		var value = utilsService.correctPMObjectForWS(parkingMeters);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/parkingmeter/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// PM csv profit file creation
	this.getPMProfitCsv = function(parkingMeters){
		var method = 'POST';
		var value = utilsService.correctProfitPMObjectForWS(parkingMeters);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/parkingmeter/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getHistorycalProfitPmFromDb: used to retrieve the historycal parking profit data from the db
	this.getHistorycalProfitPmFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/parkingmetercompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// ParkingMeter historycal profit csv data
	this.getProfitParkingHistoryCsv = function(dParking, matrixPAll){
		var method = 'POST';
		var params = {
				dparking_code: dParking.code,
				dparking_note: dParking.note,
				dparking_area: dParking.area.name
		};
		var value = JSON.stringify(matrixPAll);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/parkingmeterhistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};
	
}]);