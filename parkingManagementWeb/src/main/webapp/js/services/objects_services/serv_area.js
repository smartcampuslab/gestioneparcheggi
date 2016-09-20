'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('areaService',['$rootScope', 'invokeWSService', 'invokeWSServiceNS', 'invokeDashboardWSService', 'sharedDataService', 'utilsService', 'gMapService',
                 function($rootScope, invokeWSService, invokeWSServiceNS, invokeDashboardWSService, sharedDataService, utilsService, gMapService){
	
	this.showLog = false;
	
	// Area get method
    this.getAreasFromDb = function(showArea, agencyId){
		var allAreas = [];
		var method = 'GET';
		var params = null;
		if(agencyId){
			params = {
				agencyId: agencyId,
				noCache: new Date().getTime()
			};
		}
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area", params, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allAreas){
	    	allAreas = gMapService.initAllAreaObjects(allAreas);	// The only solution found to retrieve all data;
	    	if(showArea){
	    		gMapService.setAreaPolygons(gMapService.initAreasOnMap(allAreas, true, 1, false, true)[0]);
	    	}
	    	sharedDataService.setSharedLocalAreas(allAreas);
	    });
	    return myDataPromise;
	};
	
	// Area get method without security
	this.getAreasFromDbNS = function(showArea){
		var allAreas = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSServiceNS.getProxy(method, appId + "/area", null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allAreas){
	    	allAreas = gMapService.initAllAreaObjects(allAreas);	// The only solution found to retrieve all data;
	    	if(showArea){
	    		gMapService.setAreaPolygons(gMapService.initAreasOnMap(allAreas, true, 1, false, true)[0]);
	    	}
	    	sharedDataService.setSharedLocalAreas(allAreas);
	    });
	    return myDataPromise;
	};
	
	this.getAreaByIdFromDb = function(id){
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area/"+ id, null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	//console.log("rateArea by id retrieved from db: " + JSON.stringify(result));
	    	return result;
	    });
	};
	
	// Area update method
	this.updateAreaInDb = function(area, color, zone0, zone1, zone2, zone3, zone4, editPaths, type, agencyId){
		var validityPeriod = [];
		if(type == 0){
			if(area.validityPeriod){
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
			}
		}
			
		var id = area.id;
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId
		};
		var method = 'PUT';
		var data = {};
		if(type == 0){
			data = {
				id: area.id,
				id_app: area.id_app,
				name: area.name,
				validityPeriod: validityPeriod,
				smsCode: area.smsCode,
				color: color.substring(1, color.length),
				note: area.note,
				zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
				geometry: gMapService.correctMyGeometryPolygonForArea(editPaths)
			};
		} else {
			data = {
				id: area.id,
				id_app: area.id_app,
				name: area.name,
				validityPeriod: area.validityPeriod,
				smsCode: area.smsCode,
				color: area.color,
				note: area.note,
				zones: area.zones,
				geometry: area.geometry,
				agencyId: area.agencyId
			};
		}
			
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Area data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area/" + id, params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated area: " + result.name);
		});
	    return myDataPromise;
	}; 
	
	// Area create method
	this.createAreaInDb = function(area, myColor, zone0, zone1, zone2, zone3, zone4, createdPaths, agencyId){
		var method = 'POST';
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId
		};
		var myAgencyList = []
		if(agencyId){
			myAgencyList.push(agencyId);
		}
		var validityPeriod = [];
		if(area.validityPeriod){
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
		}
		
		var data = {
			id_app: appId,
			name: area.name,
			validityPeriod: validityPeriod,
			smsCode: area.smsCode,
			color: myColor.substring(1, myColor.length),	// I have to remove '#' char
			note: area.note,
			zones: sharedDataService.correctMyZonesForStreet(zone0, zone1, zone2, zone3, zone4),
			geometry: gMapService.correctMyGeometryPolygonForArea(createdPaths),
			agencyId: myAgencyList		// in this case I set the agencyId
		};
		
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Area data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Created area: " + result.name);
	    });
	    return myDataPromise;
	};
	
	// Area delete method
	this.deleteAreaInDb = function(area, agencyId){
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		var params = {
			agencyId: agencyId	
		};
		
		var myDataPromise = invokeWSService.getProxy(method, appId + "/area/" + area.id , params, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted area: " +area.name);
	    });
	    return myDataPromise;
	};
	
	// Method getAreaSupplyCsv: used to crate a report csv file from the areaWS list (supply data)
	this.getAreaSupplyCsv = function(areas){
		var method = 'POST';
		var value = utilsService.correctAreaObjectForWS(areas);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/area/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getAreaOccupancyCsv: used to crate a report csv file from the areaWS list (occupancy data)
	this.getAreaOccupancyCsv = function(areas){
		var method = 'POST';
		var value = utilsService.correctAreaOccObjectForWS(areas);
		
	    if(this.showLog)console.log("Area list data : " + value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/area/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getAreaProfitCsv: used to get the csv file of the report of area profit
	this.getAreaProfitCsv = function(areas){
		var method = 'POST';
		var value = utilsService.correctAreaProfitObjectForWS(areas);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/area/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getAreaTimeCostCsv: used to get the csv file of the report of area time cost
	this.getAreaTimeCostCsv = function(areas){
		var method = 'POST';
		var value = utilsService.correctAreaTimeCostObjectForWS(areas);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/area/csv", null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// method used to retrieve historical occupancy data of area
	this.getHistorycalOccupancyAreaFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/areacompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Create history occupancy csv file for area
	this.getOccupancyAreaHistoryCsv = function(dArea, matrixAreaOcc){
		var method = 'POST';
		var params = {
				darea_name: dArea.name,
				darea_fee: (dArea.validityPeriod) ? utilsService.correctRatePeriodsForWSAsString(dArea.validityPeriod) : null,
				darea_totalslot: dArea.slotNumber
		};
		var value = JSON.stringify(matrixAreaOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/areahistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};
	
	this.getHistorycalProfitAreaFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/areacompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Area historycal profit csv data
	this.getProfitAreaHistoryCsv = function(dArea, matrixPAreaAll){
		var method = 'POST';
		var params = {
				darea_name: dArea.name,
				darea_fee: (dArea.validityPeriod) ? utilsService.correctRatePeriodsForWSAsString(dArea.validityPeriod) : null,
				darea_totalslot: dArea.slotNumber
		};
		var value = JSON.stringify(matrixPAreaAll);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/areahistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });	
	    return myDataPromise;
	};
	
	// Method getHistorycalTimeCostAreaFromDb: used to retrieve the historycal streets extratime cost data from the db
	this.getHistorycalTimeCostAreaFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
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
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/areacompare/" + id, params, sharedDataService.getAuthHeaders(), null);
		myDataPromise.then(function(result){
		});
		return myDataPromise;
	};
	
	// Area historycal time cost csv data
	this.getTimeCostAreaHistoryCsv = function(dArea, matrixAreaTimeCost){
		var method = 'POST';
		var params = {
				darea_name: dArea.name,
				darea_fee: (dArea.validityPeriod) ? utilsService.correctRatePeriodsForWSAsString(dArea.validityPeriod) : null,
				darea_totalslot: dArea.slotNumber
		};
		var value = JSON.stringify(matrixAreaTimeCost);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/areahistory/csv", params, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    });
	    return myDataPromise;
	};	
	
}]);