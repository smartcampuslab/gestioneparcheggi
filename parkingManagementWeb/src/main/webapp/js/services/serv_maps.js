'use strict';

/* Services for maps management */
var pmServices = angular.module('pmServices');
pm.service('gMapService',['$rootScope', '$dialogs', 'sharedDataService', 
                  function($rootScope, $dialogs, sharedDataService){
	
	// context variables;
	this.profitParkingMeterWS = [];
	this.rateAreaWS = [];
	this.zone0WS = [];
	this.zone1WS = [];
	this.zone2WS = [];
	this.zone3WS = [];
	this.zone4WS = [];

	this.lightgray = "#B0B0B0";//"#81EBBA";
	this.lightgreen = "#37EC0E";
	this.green = "#31B404";
	this.yellow = "#F7FE2E";
	this.orange = "#FF8000";
	this.red = "#DF0101";
	this.violet = "#8904B1";
	this.blue = "#383BEE";
	
	this.wait_dialog_text_string_it = "Aggiornamento dati in corso...";
	this.wait_dialog_text_string_en = "Loading elements...";
	this.wait_dialog_title_string_it = "Attendere Prego";
	this.wait_dialog_title_string_en = "Please Wait";
	this.progress = 25;
	
	this.setProfitParkingMeter = function(list){
		this.profitParkingMeterWS = list;
	};
	
	this.getProfitParkingMeter = function(){
		return this.profitParkingMeterWS;
	};
	
	this.setRateArea = function(list){
		this.rateAreaWS = list;
	};
	
	this.getRateArea = function(){
		return this.rateAreaWS;
	};
	
	this.getLoadingText = function(){
		if(sharedDataService.getUsedLanguage() == 'ita'){
			return this.wait_dialog_text_string_it;
		} else {
			return this.wait_dialog_text_string_en;
		}
	};
	
	this.getLoadingTitle = function(){
		if(sharedDataService.getUsedLanguage() == 'ita'){
			return this.wait_dialog_title_string_it;
		} else {
			return this.wait_dialog_title_string_en;
		}
	};
	
	this.loadMapsObject = function(){
		this.progress += 25;
		$dialogs.wait(this.getLoadingText(),this.progress, this.getLoadingTitle());
	};
	
	this.updateLoadingMapState = function(){
		this.progress += 25;
    	$rootScope.$broadcast('dialogs.wait.progress',{msg: this.getLoadingText(),'progress': this.progress, m_title: this.getLoadingTitle()});
	};
	
	this.closeLoadingMap = function(){
		this.progress = 100;
    	$rootScope.$broadcast('dialogs.wait.complete');
	};
	
	// used to force the gmap to be refreshed
	this.refreshMap = function(map) {
        map.control.refresh($scope.mapCenter);
        //map.control.refresh(null);
        map.control.getGMap().setZoom(5);
        map.control.getGMap().setZoom(14);
        
        return map;
    };
    
    // used to correct color to be used in map
    this.correctColor = function(value){
		return "#" + value;
	};
	
	// used to get the color to be saved in db
	this.plainColor = function(value){
		return value.substring(1, value.length);
	};
	
	// used to correct a point to be used in gmap
	this.correctPointGoogle = function(point){
		return point.lat + "," + point.lng;
	};
	
	// used to correct points like db format
	this.correctPoints = function(points){
		var corr_points = [];
		for(var i = 0; i < points.length; i++){
			var point = {
				latitude: points[i].lat,
				longitude: points[i].lng
			};
			corr_points.push(point);
		}
		return corr_points;
	};
	
	// used to correct points like google maps format
	this.correctPointsGoogle = function(points){
		var corr_points = "[";
		for(var i = 0; i < points.length; i++){
			var point = "[ " + points[i].lat + "," + points[i].lng + "]";
			corr_points = corr_points +point + ",";
		}
		corr_points = corr_points.substring(0, corr_points.length-1);
		corr_points = corr_points + "]";
		return corr_points;
	};
	
	// used to correct polygon to be saved in db
	this.correctMyGeometryPolygon = function(geo){
		var tmpPolygon = {
			points: null
		};
		var points = [];
		if(geo != null && geo.points != null && geo.points.length > 0){
			for(var i = 0; i < geo.points.length; i++){
				var tmpPoint = geo.points[i];
				points.push(tmpPoint);
			}
		}
		
		tmpPolygon.points = points;

		return tmpPolygon;
	};
	
    this.getTimeCostColor = function(value){
    	if(value == null || value.extratime_estimation_max == null){
    		return this.lightgray;
    	} else {
	    	if(value.extratime_estimation_max == 0){
	    		return this.lightgreen;
	    	} else if(value.extratime_estimation_max == 1){
	    		return this.green;
	    	} else if(value.extratime_estimation_max == 3){
	    		return this.yellow;
	    	} else if(value.extratime_estimation_max == 5){
	    		return this.orange;
	    	} else if(value.extratime_estimation_max == 10){
	    		return this.red;
	    	} else if(value.extratime_estimation_max == 15){
	    		return this.violet;
	    	}
    	}
    };
    
    this.getOccupancyColor = function(value){
    	if(value == -1){
    		return this.lightgray;
    	} else {
	    	if(value < 25){
	    		return this.green;
	    	} else if(value < 50){
	    		return this.yellow;
	    	} else if(value < 75){
	    		return this.orange;
	    	} else if(value < 90){
	    		return this.red;
	    	} else {
	    		return this.violet;
	    	}
    	}
    };
    
    this.getProfitColor = function(value){
    	if(value == -1){
    		return this.lightgray;
    	} else {
	    	if(value < 100000){
	    		return this.lightgreen;
	    	} else if(value < 200000){
	    		return this.green;
	    	} else if(value < 500000){
	    		return this.orange;
	    	} else if(value < 1000000){
	    		return this.violet;
	    	} else {
	    		return this.blue;
	    	}
    	}
    };
    
	// Method getExtratimeFromOccupancy: retrieve the correct extratime value from the occupancy rate of the object
	this.getExtratimeFromOccupancy = function(occupancy){
		if(occupancy < 0){
			return null;
		} else if(occupancy < 10){
			return sharedDataService.getExtratimeWait()[0];
		} else if(occupancy < 20){
			return sharedDataService.getExtratimeWait()[1];
		} else if(occupancy < 30){
			return sharedDataService.getExtratimeWait()[2];
		} else if(occupancy < 40){
			return sharedDataService.getExtratimeWait()[3];
		} else if(occupancy < 50){
			return sharedDataService.getExtratimeWait()[4];
		} else if(occupancy < 60){
			return sharedDataService.getExtratimeWait()[5];
		} else if(occupancy < 70){
			return sharedDataService.getExtratimeWait()[6];
		} else if(occupancy < 80){
			return sharedDataService.getExtratimeWait()[7];
		} else if(occupancy < 90){
			return sharedDataService.getExtratimeWait()[8];
		} else if(occupancy < 100){
			return sharedDataService.getExtratimeWait()[9];
		} else {
			return sharedDataService.getExtratimeWait()[10];
		}
	};
	
	this.getActualPmProfit = function(pmId){
		var pmdata = null;
		var found = false;
		for(var i = 0; ((i < this.profitParkingMeterWS.length) && (!found)); i++){
			if(this.profitParkingMeterWS[i].id == pmId){
				pmdata = this.profitParkingMeterWS[i];
				found = true;
			}
		}
		return [pmdata.profit, pmdata.tickets];
	};
	
    // Method correctAreaId: used to add new areaMap object when an area is composed (more than one geometry object)
    this.correctAreaId = function(id, i){
		if(i == 0){
			return id;
		} else {
			return id + '_' + i;
		}
	};
	
	// light version of initAreasOnMap function
	this.initAreasOnMap = function(areas, visible, type, firstInit, firstTime){
		var area = {};
		var poligons = {};
		var tmpAreas = [];
		var aColor = "";
		var timeCost = {};
		
		for(var i = 0; i < areas.length; i++){
			var areaOccupancy = 0;
			var areaProfit = [];
			if(type == 1){
				aColor = this.correctColor(areas[i].color);
			} /*else if(type == 2){
				var slotsInArea = $scope.getTotalSlotsInArea(areas[i].id);
				areaOccupancy = $scope.getStreetsInAreaOccupancy(areas[i].id);
				if(areaOccupancy != -1){
					areaOccupancy = slotsInArea[2];
				}
				aColor = this.getOccupancyColor(areaOccupancy);
			} else if(type == 3){
				areaProfit = $scope.getPMsInAreaProfit(areas[i].id);
				aColor = this.getProfitColor(areaProfit[0]);
			} else if(type == 4){
				var slotsInArea = $scope.getTotalSlotsInArea(areas[i].id);
				areaOccupancy = $scope.getStreetsInAreaOccupancy(areas[i].id);
				if(areaOccupancy != -1){
					areaOccupancy = slotsInArea[2];
				}
				timeCost = $scope.getExtratimeFromOccupancy(areaOccupancy);
				areas[i].extratime = timeCost;
				aColor = this.getTimeCostColor(timeCost);
			}*/
			
			if(areas[i].geometry != null && areas[i].geometry.length > 0 && areas[i].geometry[0].points.length > 0){
				for(var j = 0; j < areas[i].geometry.length; j++){
					poligons = areas[i].geometry;
					area = {
						id: this.correctAreaId(areas[i].id, j),
						path: this.correctPoints(poligons[j].points),
						gpath: this.correctPointsGoogle(poligons[j].points),
						stroke: {
						    color: aColor, //$scope.correctColor(areas[i].color),
						    weight: 3,
						    opacity: 0.7
						},
						data: areas[i],
						info_windows_pos: this.correctPointGoogle(poligons[j].points[1]),
						info_windows_cod: "a" + areas[i].id,
						editable: false,
						draggable: false,
						geodesic: false,
						visible: visible,
						fill: {
						    color: aColor, //$scope.correctColor(areas[i].color),
						    opacity: 0.5
						}
					};
					tmpAreas.push(area);
				}
			}
		}
		if(!firstTime){
			this.closeLoadingMap();
		}
		return [tmpAreas, areas];
	};
	
	this.initAreasOnMapComplete = function(areas, visible, type, firstInit, firstTime){
		var area = {};
		var poligons = {};
		var tmpAreas = [];
		var aColor = "";
		var timeCost = {};
		
		for(var i = 0; i < areas.length; i++){
			var areaOccupancy = 0;
			var areaProfit = [];
			if(type == 1){
				aColor = this.correctColor(areas[i].color);
			} else if(type == 2){
				var slotsInArea = $scope.getTotalSlotsInArea(areas[i].id);
				areaOccupancy = $scope.getStreetsInAreaOccupancy(areas[i].id);
				if(areaOccupancy != -1){
					areaOccupancy = slotsInArea[2];
				}
				aColor = this.getOccupancyColor(areaOccupancy);
			} else if(type == 3){
				areaProfit = $scope.getPMsInAreaProfit(areas[i].id);
				aColor = this.getProfitColor(areaProfit[0]);
			} else if(type == 4){
				var slotsInArea = $scope.getTotalSlotsInArea(areas[i].id);
				areaOccupancy = $scope.getStreetsInAreaOccupancy(areas[i].id);
				if(areaOccupancy != -1){
					areaOccupancy = slotsInArea[2];
				}
				timeCost = $scope.getExtratimeFromOccupancy(areaOccupancy);
				areas[i].extratime = timeCost;
				aColor = this.getTimeCostColor(timeCost);
			} 
			
			if(firstInit){	// I use this code only the first time I show the zone occupancy data
				var slotsInArea = $scope.getTotalSlotsInArea(areas[i].id);
				areas[i].slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(areas[i].id);
				areas[i].slotOccupied = slotsInArea[1]; //Math.round(area.data.slotNumber * areaOccupancy / 100);
			}
			areas[i].profit = areaProfit[0];
			areas[i].tickets = areaProfit[1];
			areas[i].pmsInArea = areaProfit[2];
			
			if(areas[i].geometry != null && areas[i].geometry.length > 0 && areas[i].geometry[0].points.length > 0){
				var zones0 = [];
				var zones1 = [];
				var zones2 = [];
				var zones3 = [];
				var zones4 = [];
				// zone init
				if(areas[i].zones){
					for(var j = 0; j < areas[i].zones.length; j++){
						var z0 = $scope.getLocalZoneById(areas[i].zones[j], 1, 0);
						var z1 = $scope.getLocalZoneById(areas[i].zones[j], 1, 1);
						var z2 = $scope.getLocalZoneById(areas[i].zones[j], 1, 2);
						var z3 = $scope.getLocalZoneById(areas[i].zones[j], 1, 3);
						var z4 = $scope.getLocalZoneById(areas[i].zones[j], 1, 4);
						if(z0 != null){
							zones0.push($scope.addLabelToZoneObject(z0));
						} else if(z1 != null){
							zones1.push($scope.addLabelToZoneObject(z1));
						} else if(z2 != null){
							zones2.push($scope.addLabelToZoneObject(z2));
						} else if(z3 != null){
							zones3.push($scope.addLabelToZoneObject(z3));
						} else if(z4 != null){
							zones4.push($scope.addLabelToZoneObject(z4));
						}
					}
				}
				for(var j = 0; j < areas[i].geometry.length; j++){
					poligons = areas[i].geometry;
					area = {
						id: $scope.correctAreaId(areas[i].id, j),
						path: $scope.correctPoints(poligons[j].points),
						gpath: $scope.correctPointsGoogle(poligons[j].points),
						stroke: {
						    color: aColor, //$scope.correctColor(areas[i].color),
						    weight: 3,
						    opacity: 0.7
						},
						data: areas[i],
						zones0: zones0,
						zones1: zones1,
						zones2: zones2,
						zones3: zones3,
						zones4: zones4,
						info_windows_pos: $scope.correctPointGoogle(poligons[j].points[1]),
						info_windows_cod: "a" + areas[i].id,
						editable: false,
						draggable: false,
						geodesic: false,
						visible: visible,
						fill: {
						    color: aColor, //$scope.correctColor(areas[i].color),
						    opacity: 0.5
						}
					};
					tmpAreas.push(area);
				}
			}
		}
		if(!firstTime){
			gMapService.closeLoadingMap();
		}
		return [tmpAreas, areas];
	};

	// light version of initStreetsOnMap: retrieve only the data from ws call without relationated objects
	this.initStreetsOnMap = function(streets, visible, type, onlyData){
		var street = {};
		var poligons = {};
		var tmpStreets = [];
		var sColor = "";
		var timeCost = {};
		
		for(var i = 0; i < streets.length; i++){	
			if(!onlyData){
				if(type == 1){
					sColor = this.correctColor(streets[i].color);
				} else if(type == 2){
					sColor = this.getOccupancyColor(streets[i].occupancyRate);
				} /*else if(type == 3){
					sColor = this.getProfitColor(streets[i].profit);
				} */else if(type == 4){
					timeCost = this.getExtratimeFromOccupancy(streets[i].occupancyRate);
					streets[i].extratime = timeCost;
					sColor = this.getTimeCostColor(timeCost);
				}
			
				if(streets[i].geometry != null){
					poligons = streets[i].geometry;
					street = {
						id: streets[i].id,
						path: this.correctPoints(poligons.points),
						gpath: this.correctPointsGoogle(poligons.points),
						stroke: {
						    color: sColor,
						    weight: (visible) ? 3 : 0,
						    opacity: 0.7
						},
						data: streets[i],
						info_windows_pos: this.correctPointGoogle(poligons.points[1]),
						info_windows_cod: "s" + streets[i].id,
						editable: false,
						draggable: false,
						geodesic: false,
						visible: visible
					};
					tmpStreets.push(street);
				}
			}
		}
		this.closeLoadingMap();
		return [tmpStreets, streets];
	};
	
	this.initStreetsOnMapComplete = function(streets, visible, type, onlyData){
		var street = {};
		var poligons = {};
		var tmpStreets = [];
		var sColor = "";
		var timeCost = {};
		
		for(var i = 0; i < streets.length; i++){
			var myAreaS = $scope.getLocalAreaById(streets[i].rateAreaId);
			var parkingMeters = streets[i].parkingMeters;
			var totalProfit = 0;
			var totalTickets = 0;
			if(parkingMeters != null){
				for(var j = 0; j < parkingMeters.length; j++){
					if(parkingMeters[j] != null){
						var composedProfit = this.getActualPmProfit(parkingMeters[j]);
						var profit = composedProfit[0];
						var tickets = composedProfit[1];
						if(profit != -1){
							totalProfit += profit;
							totalTickets += tickets;
						}
					}
				}
			}
			if(totalProfit == 0){
				streets[i].profit = -1;
			} else {
				streets[i].profit = totalProfit;
			}
			if(totalTickets == 0){
				streets[i].tickets = -1;
			} else {
				streets[i].tickets = totalTickets;
			}	
			if(!onlyData){
				if(type == 1){
					sColor = this.correctColor(streets[i].color);
				} else if(type == 2){
					sColor = this.getOccupancyColor(streets[i].occupancyRate);
				} else if(type == 3){
					sColor = this.getProfitColor(streets[i].profit);
				} else if(type == 4){
					timeCost = this.getExtratimeFromOccupancy(streets[i].occupancyRate);
					streets[i].extratime = timeCost;
					sColor = this.getTimeCostColor(timeCost);
				}
			
				if(streets[i].geometry != null){
					poligons = streets[i].geometry;
					street = {
						id: streets[i].id,
						path: this.correctPoints(poligons.points),
						gpath: this.correctPointsGoogle(poligons.points),
						stroke: {
						    color: sColor,
						    weight: (visible) ? 3 : 0,
						    opacity: 0.7
						},
						data: streets[i],
						area: myAreaS,
//						zones0: streets[i].myZones0,
//						zones1: streets[i].myZones1,
//						zones2: streets[i].myZones2,
//						zones3: streets[i].myZones3,
//						zones4: streets[i].myZones4,
//						pms: streets[i].myPms,
						info_windows_pos: this.correctPointGoogle(poligons.points[1]),
						info_windows_cod: "s" + streets[i].id,
						editable: false,
						draggable: false,
						geodesic: false,
						visible: visible
					};
					tmpStreets.push(street);
				}
			}
		}
		$scope.closeLoadingMap();
		return [tmpStreets, streets];
	}


}]);