'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('areaService',['$rootScope', 'invokeWSService', 'sharedDataService', 'gMapService',
                 function($rootScope, invokeWSService, sharedDataService, gMapService){
	
    this.getAreasFromDb = function(showArea){
		var allAreas = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area", null, sharedDataService.getAuthHeaders(), null);
	    myDataPromise.then(function(allAreas){
	    	//$scope.areaWS = this.initAreasObjects(allAreas);
	    	if(showArea){
	    		gMapService.resizeMap("viewArea");
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
	
	// Method used when an area object is selected. It add the zone details to the area object
	this.initAreaObject = function(area){
		var myArea = {};
		//for(var i = 0; i < areas.length; i++){
			var zones0 = [];
			var zones1 = [];
			var zones2 = [];
			var zones3 = [];
			var zones4 = [];
			// zone init
			if(area.zones){
				for(var j = 0; j < areas[i].zones.length; j++){
					var z0 = this.getLocalZoneById(areas[i].zones[j], 2, 0);
					var z1 = this.getLocalZoneById(areas[i].zones[j], 2, 1);
					var z2 = this.getLocalZoneById(areas[i].zones[j], 2, 2);
					var z3 = this.getLocalZoneById(areas[i].zones[j], 2, 3);
					var z4 = this.getLocalZoneById(areas[i].zones[j], 2, 4);
					if(z0 != null){
						zones0.push(this.addLabelToZoneObject(z0));
					} else if(z1 != null){
						zones1.push(this.addLabelToZoneObject(z1));
					} else if(z2 != null){
						zones2.push(this.addLabelToZoneObject(z2));
					} else if(z3 != null){
						zones3.push(this.addLabelToZoneObject(z3));
					} else if(z4 != null){
						zones4.push(this.addLabelToZoneObject(z4));
					}
				}
			}
			var myArea = area;
			myArea.myZones0 = zones0;
			myArea.myZones1 = zones1;
			myArea.myZones2 = zones2;
			myArea.myZones3 = zones3;
			myArea.myZones4 = zones4;
		//}
		return myArea;
	};
	
	
}]);