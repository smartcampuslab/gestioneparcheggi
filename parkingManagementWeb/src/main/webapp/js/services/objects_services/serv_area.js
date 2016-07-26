'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('areaService',['$rootScope', 'invokeWSService', 'invokeWSServiceNS', 'sharedDataService', 'gMapService',
                 function($rootScope, invokeWSService, invokeWSServiceNS, sharedDataService, gMapService){
	
	this.showLog = false;
	
	// Area get method
    this.getAreasFromDb = function(showArea){
		var allAreas = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area", null, sharedDataService.getAuthHeaders(), null);
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
	this.updateAreaInDb = function(area, color, zone0, zone1, zone2, zone3, zone4, editPaths, type){
		var validityPeriod = [];
		if(type == 0){
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
			
		var id = area.id;
		var appId = sharedDataService.getConfAppId();
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
				geometry: area.geometry
			};
		}
			
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Area data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area/" + id, null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	console.log("Updated area: " + result.name);
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