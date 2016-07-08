'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('areaService',['$rootScope', 'invokeWSService', 'sharedDataService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, gMapService){
	
	this.showLog = false;
	
	// Areas get method
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
	this.updateAreaInDb = function(area, color, zone0, zone1, zone2, zone3, zone4, editPaths){
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
			
		var id = area.id;
		var appId = sharedDataService.getConfAppId();
		var method = 'PUT';
		var data = {
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
			
	    var value = JSON.stringify(data);
	    if(this.showLog) console.log("Area data : " + value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area/" + id, null, sharedDataService.getAuthHeaders(), value);
	    myDataPromise.then(function(result){
	    	if(this.showLog) console.log("Updated street: " + result);
		});
	    return myDataPromise;
	}; 
}]);