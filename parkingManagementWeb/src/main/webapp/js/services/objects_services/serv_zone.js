'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('zoneService', ['$rootScope', 'invokeWSService', 'sharedDataService', 'invokeWSServiceNS', 'invokeDashboardWSService', 'utilsService', 'gMapService',
                    function($rootScope, invokeWSService, sharedDataService, invokeWSServiceNS, invokeDashboardWSService, utilsService, gMapService){
	
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
	
	// Get zones from DB method without service
	this.getZonesFromDbNS = function(z_type){
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/zone/" + z_type, null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allZones){
	    	
	    });
	    return myDataPromise;
	};
	
	// Get zones from DB method without service
	this.getZonesFromDbDashboard = function(z_type){
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/zone/" + z_type, null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allZones){
	    	
	    });
	    return myDataPromise;
	};
	
	// Zone update method
	this.updateZoneInDb = function(zone, myColor, center, corrType, editCorrectedPath, agencyId){
		var id = zone.id;
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId
		};
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
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + id, params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated Zone: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// Zone create method
	this.createZoneInDb = function(zone, myColor, center, corrType, newCorrectedPath, agencyId){
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
			name: zone.name,
			submacro: zone.submacro,
			submicro: zone.submicro,
			color: myColor.substring(1, myColor.length),	// I have to remove '#' char
			note: zone.note,
			type: corrType,
			centermap: gMapService.correctMyGeometry(center),
			geometry: gMapService.correctMyGeometryPolyline(newCorrectedPath),
			geometryFromSubelement: zone.geometryFromSubelement,
			agencyId: myAgencyList
		};
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Zone data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Created zone: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// Zone delete method
	this.deleteZoneInDb = function(zone, agencyId){
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId	
		};
		
		var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + zone.id, params, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted zones: " + zone.name);
	    });
	    return myDataPromise;
	};
	
	// Zone create supply csv file
	this.getZoneSupplyCsv = function(z_index, zones0, zones1, zones2, zones3, zones4){
		var method = 'POST';
		var value = "";
		switch(z_index){
			case 0:
				value = utilsService.correctZoneObjectForWS(zones0);
				break;
			case 1:
				value = utilsService.correctZoneObjectForWS(zones1);
				break;
			case 2:
				value = utilsService.correctZoneObjectForWS(zones2);
				break;
			case 3:
				value = utilsService.correctZoneObjectForWS(zones3);
				break;
			case 4:
				value = utilsService.correctZoneObjectForWS(zones4);
				break;
		}
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/zone/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Zone create occupancy csv file
	this.getZoneOccupancyCsv = function(z_index, zones0, zones1, zones2, zones3, zones4){
		var method = 'POST';
		var value = "";
		switch(z_index){
			case 0:
				value = utilsService.correctOccZoneObjectForWS(zones0);
				break;
			case 1:
				value = utilsService.correctOccZoneObjectForWS(zones1);
				break;
			case 2:
				value = utilsService.correctOccZoneObjectForWS(zones2);
				break;
			case 3:
				value = utilsService.correctOccZoneObjectForWS(zones3);
				break;
			case 4:
				value = utilsService.correctOccZoneObjectForWS(zones4);
				break;
		}
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/zone/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Zone create profit csv file
	this.getZoneProfitCsv = function(z_index, zones0, zones1, zones2, zones3, zones4){
		var method = 'POST';
		var value = "";
		switch(z_index){
			case 0:
				value = utilsService.correctProfitZoneObjectForWS(zones0);
				break;
			case 1:
				value = utilsService.correctProfitZoneObjectForWS(zones1);
				break;
			case 2:
				value = utilsService.correctProfitZoneObjectForWS(zones2);
				break;
			case 3:
				value = utilsService.correctProfitZoneObjectForWS(zones3);
				break;
			case 4:
				value = utilsService.correctProfitZoneObjectForWS(zones4);
				break;
		}
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/zone/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	this.getZoneTimeCostCsv = function(z_index, zones0, zones1, zones2, zones3, zones4){
		var method = 'POST';
		var value = "";
		switch(z_index){
			case 0:
				value = utilsService.correctTimeCostZoneObjectForWS(zones0);
				break;
			case 1:
				value = utilsService.correctTimeCostZoneObjectForWS(zones1);
				break;
			case 2:
				value = utilsService.correctTimeCostZoneObjectForWS(zones2);
				break;
			case 3:
				value = utilsService.correctTimeCostZoneObjectForWS(zones3);
				break;
			case 4:
				value = utilsService.correctTimeCostZoneObjectForWS(zones4);
				break;
		}
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/zone/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// method used to retrieve historical occupancy data of zone
	this.getHistorycalOccupancyZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/zonecompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Zone historycal occupancy csv data
	this.getOccupancyZoneHistoryCsv = function(dZone, matrixZoneOcc){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
				dzone_name: dZone.name,
				dzone_sub: dZone.submacro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify(matrixZoneOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/zonehistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getHistorycalOccupancyMicroZoneFromDb: used to retrieve the historycal microzone occupancy data from the db
	this.getHistorycalOccupancyMicroZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/zonecompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Zone historycal occupancy csv data
	this.getOccupancyMicroZoneHistoryCsv = function(dZone, matrixMicroZoneOcc){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
				dzone_name: dZone.name,
				dzone_submacro: dZone.submacro,
				dzone_submicro: dZone.submicro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify(matrixMicroZoneOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/zonehistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getHistorycalProfitZoneFromDb: used to retrieve the historycal zone profit data from the db
	this.getHistorycalProfitZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/zonecompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};	
	
	// Zone historycal profit csv data
	this.getProfitZoneHistoryCsv = function(dZone, matrixPZoneAll){
		var method = 'POST';
		var params = {
				dzone_name: dZone.name,
				dzone_sub: dZone.submacro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify(matrixPZoneAll);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/zonehistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getHistorycalProfitZoneFromDb: used to retrieve the historycal zone profit data from the db
	this.getHistorycalProfitMicroZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/zonecompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Zone historycal profit csv data
	this.getProfitMicroZoneHistoryCsv = function(dZone, matrixPMicroZoneAll){
		var method = 'POST';
		var params = {
				dzone_name: dZone.name,
				dzone_submacro: dZone.submacro,
				dzone_submicro: dZone.submicro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify(matrixPMicroZoneAll);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/zonehistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};
	
	// Method getHistorycalTimeCostZoneFromDb: used to retrieve the historycal zone extratime cost data from the db
	this.getHistorycalTimeCostZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/zonecompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};	
	
	// Zone historycal time cost csv data
	this.getTimeCostZoneHistoryCsv = function(dZone, matrixZoneTimeCost){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
				dzone_name: dZone.name,
				dzone_sub: dZone.submacro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify(matrixZoneTimeCost);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/zonehistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};
	
	// Method getHistorycalTimeCostMicroZoneFromDb: used to retrieve the historycal microzone extratime cost data from the db
	this.getHistorycalTimeCostMicroZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/zonecompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};	
	
	// MicroZone historycal time cost csv data
	this.getTimeCostMicroZoneHistoryCsv = function(dZone, matrixMicroZoneTimeCost){
		var method = 'POST';
		var params = {
				dzone_name: dZone.name,
				dzone_submacro: dZone.submacro,
				dzone_submicro: dZone.submicro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify(matrixMicroZoneTimeCost);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/zonehistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};	
	
}]);