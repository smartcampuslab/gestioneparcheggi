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
	this.occupancyStreetsWS = [];

	this.lightgray = "#B0B0B0";//"#81EBBA";
	this.lightgreen = "#37EC0E";
	this.green = "#31B404";
	this.yellow = "#F7FE2E";
	this.orange = "#FF8000";
	this.red = "#DF0101";
	this.violet = "#8904B1";
	this.blue = "#383BEE";
	
	this.psMarkerIcon = "imgs/structIcons/parking_structures_general_outline.png";	// icon for parkingStructure object
	this.bpMarkerIcon = "imgs/markerIcons/puntobici.png";							// icon for bikePoint object
	
	this.getPsMarkerIcon = function(){
		return this.psMarkerIcon;
	};
	
	this.getBpMarkerIcon = function(){
		return this.bpMarkerIcon;
	};
	
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
	
	this.setOccupancyStreet = function(list){
		this.occupancyStreetsWS = list;
	};
	
	this.getOccupancyStreet = function(){
		return this.occupancyStreetsWS;
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
	
    // Method getOccupancyIcon: retrieve the correct occupancy icon with the color of the occupancy value passed in input (for type ps)
    this.getOccupancyIcon = function(value, type){
    	var image_url="";
    	if(type == 1){			// corrected occupancy icon for parkingmeter
    		// no occupancy data for parkingmeters
    	} else if(type == 2){	// corrected profit icon for parkingmeter
	    	if(value == -1){
	    		//image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_np.png";
	    		image_url = "imgs/structIcons/parking_structures_gray_outline.png";
	    	} else if(value < 25){
	    		image_url = "imgs/structIcons/parking_structures_green_outline.png";
	    	} else if(value < 50){
				image_url = "imgs/structIcons/parking_structures_yellow_outline.png";
	    	} else if(value < 75){
				image_url = "imgs/structIcons/parking_structures_orange_outline.png";
	    	} else if(value < 90){
				image_url = "imgs/structIcons/parking_structures_red_outline.png";
	    	} else {
				image_url = "imgs/structIcons/parking_structures_violet_outline.png";
	    	}
    	}
    	return image_url;
    };
    
    // Method getProfitIcon: retrieve the correct profit icon with the color of the profit value passed in input (for type pm and ps)
    this.getProfitIcon = function(value, type){
    	//------ To be configured in external conf file!!!!!------
		var company = "";
		var appId = sharedDataService.getConfAppId();
		if(appId == 'rv'){ 
			company = "amr";
		} else {
			company = "tm";
		}
		var baseUrl = "rest/nosec";
		//--------------------------------------------------------
    	var image_url = "";
    	var color = "";
    	if(type == 1){			// corrected profit icon for parkingmeter
    		color = this.getProfitColor(value);
			image_url = baseUrl+'/marker/'+company+'/parcometro/' + this.plainColor(color);
    	} else if(type == 2){ 	// corrected profit icon for parkingstructures
	    	if(value == -1){
	    		image_url = "imgs/structIcons/parking_structures_gray_outline.png";
	    	} else if(value < 100){
	    		image_url = "imgs/structIcons/parking_structures_green_outline.png";
	    	} else if(value < 500){
	    		image_url = "imgs/structIcons/parking_structures_yellow_outline.png";
	    	} else if(value < 1000){
				image_url = "imgs/structIcons/parking_structures_violet_outline.png";
	    	} else {
				image_url = "imgs/structIcons/parking_structures_general_outline.png";
	    	}
    	}
    	return image_url;
    };
    
    // Method getTimeCostIcon: retrieve the correct time cost icon with the color of the extratime value passed in input (for type ps)
    this.getTimeCostIcon = function(value, type){
    	var image_url = "";
    	if(type == 1){			// corrected profit icon for parkingmeter
    		// no timeCost value for parking meters
    	} else if(type == 2){ 	// corrected profit icon for parkingstructures
    		if(value == null || value.extratime_estimation_max == null){
    			image_url = "imgs/structIcons/parking_structures_gray_outline.png";
        	} else {
    	    	if(value.extratime_estimation_max == 0){
    	    		image_url = "imgs/structIcons/parking_structures_green_outline.png";
    	    	} else if(value.extratime_estimation_max == 1){
    	    		image_url = "imgs/structIcons/parking_structures_green_outline.png";
    	    	} else if(value.extratime_estimation_max == 3){
    	    		image_url = "imgs/structIcons/parking_structures_yellow_outline.png";
    	    	} else if(value.extratime_estimation_max == 5){
    	    		image_url = "imgs/structIcons/parking_structures_orange_outline.png";
    	    	} else if(value.extratime_estimation_max == 10){
    	    		image_url = "imgs/structIcons/parking_structures_red_outline.png";
    	    	} else if(value.extratime_estimation_max == 15){
    	    		image_url = "imgs/structIcons/parking_structures_violet_outline.png";
    	    	}
        	}
    	}
    	return image_url;
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
	
	// Method getExtratimeFromOccupancyForHistorycalTable: used to get the correct value from historical occupancy data table
	this.getExtratimeFromOccupancyForHistorycalTable = function(occupancy){
		if(occupancy < 0){
			return "-1.0";
		} else if(occupancy < 10){
			return sharedDataService.getExtratimeWait()[0].extratime_estimation_min;
		} else if(occupancy < 20){
			return sharedDataService.getExtratimeWait()[1].extratime_estimation_min;
		} else if(occupancy < 30){
			return sharedDataService.getExtratimeWait()[2].extratime_estimation_min;
		} else if(occupancy < 40){
			return sharedDataService.getExtratimeWait()[3].extratime_estimation_min;
		} else if(occupancy < 50){
			return sharedDataService.getExtratimeWait()[4].extratime_estimation_min;
		} else if(occupancy < 60){
			return sharedDataService.getExtratimeWait()[5].extratime_estimation_min;
		} else if(occupancy < 70){
			return sharedDataService.getExtratimeWait()[6].extratime_estimation_min;
		} else if(occupancy < 80){
			return sharedDataService.getExtratimeWait()[7].extratime_estimation_min + " - " + sharedDataService.getExtratimeWait()[7].extratime_estimation_max;
		} else if(occupancy < 90){
			return sharedDataService.getExtratimeWait()[8].extratime_estimation_min + " - " + sharedDataService.getExtratimeWait()[8].extratime_estimation_max;
		} else if(occupancy < 100){
			return sharedDataService.getExtratimeWait()[9].extratime_estimation_min + " - " + sharedDataService.getExtratimeWait()[9].extratime_estimation_max;
		} else {
			return sharedDataService.getExtratimeWait()[10].extratime_estimation_min + " - " + sharedDataService.getExtratimeWait()[10].extratime_estimation_max;
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
	
	this.getSharedLocalZones = function(zindex){
		var zones = null;
		switch(zindex){
			case 0:
				zones = sharedDataService.getSharedLocalZones0();
				break;
			case 1: 
				zones = sharedDataService.getSharedLocalZones1();
				break;
			case 2: 
				zones = sharedDataService.getSharedLocalZones2();
				break;
			case 3: 
				zones = sharedDataService.getSharedLocalZones3();
				break;
			case 4: 
				zones = sharedDataService.getSharedLocalZones4();
				break;
			default: break;
		}
		return zones;
	};
	
	this.getLocalZoneById = function(id, type, zindex){
		var find = false;
		var corrZone = null;
		var myZones = this.getSharedLocalZones(zindex);
		if(myZones){
			for(var i = 0; i < myZones.length && !find; i++){
				if(myZones[i].id == id){
					find = true;
					if(type == 1){
						corrZone = myZones[i];
					} else {
						var sub = (myZones[i].submacro) ? myZones[i].submacro : ((myZones[i].submicro) ? myZones[i].submicro : null);
						var lbl = (sub) ? (myZones[i].name + "_" + sub) : myZones[i].name;
						corrZone = {
							id: myZones[i].id,
							id_app: myZones[i].id_app,
							color: myZones[i].color,
							name: myZones[i].name,
							submacro: myZones[i].submacro,
							submicro: myZones[i].submicro,
							type: myZones[i].type,
							note: myZones[i].note,
							geometry: this.correctMyGeometryPolygon(myZones[i].geometry),
							label: lbl
						};
					}			
				}
			}
		}
		return corrZone;
	};
	
	// Method used to create a correct label for a specific zone
	this.addLabelToZoneObject = function(zone){
		var sub = (zone.submacro) ? zone.submacro : ((zone.submicro) ? zone.submicro : null);
    	var lbl = (sub) ? (zone.name + "_" + sub) : zone.name;
    	var corrected_zone = {
    		id: zone.id,
    		id_app: zone.id_app,
    		color: zone.color,
    		name: zone.name,
    		submacro: zone.submacro,
    		submicro: zone.submicro,
    		type: zone.type,
    		note: zone.note,
    		geometry: zone.geometry,
    		geometryFromSubelement: zone.geometryFromSubelement,
    		subelements: zone.subelements,
    		label: lbl
    	};
    	return corrected_zone;
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
			} else if(type == 2){
				var slotsInArea = sharedDataService.getTotalSlotsInArea(areas[i].id, this.occupancyStreetsWS);
				areaOccupancy = sharedDataService.getStreetsInAreaOccupancy(areas[i].id, this.occupancyStreetsWS);
				if(areaOccupancy != -1){
					areaOccupancy = slotsInArea[2];
				}
				aColor = this.getOccupancyColor(areaOccupancy);
			} else if(type == 3){
				areaProfit = sharedDataService.getPMsInAreaProfit(areas[i].id, this.profitParkingMeterWS);
				aColor = this.getProfitColor(areaProfit[0]);
			} else if(type == 4){
				var slotsInArea = sharedDataService.getTotalSlotsInArea(areas[i].id, this.occupancyStreetsWS);
				areaOccupancy = sharedDataService.getStreetsInAreaOccupancy(areas[i].id, this.occupancyStreetsWS);
				if(areaOccupancy != -1){
					areaOccupancy = slotsInArea[2];
				}
				timeCost = this.getExtratimeFromOccupancy(areaOccupancy);
				areas[i].extratime = timeCost;
				aColor = this.getTimeCostColor(timeCost);
			}
			areas[i].profit = areaProfit[0];
			areas[i].tickets = areaProfit[1];
			areas[i].pmsInArea = areaProfit[2];
			
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
	
//	this.initAreasOnMapComplete = function(areas, visible, type, firstInit, firstTime){
//		var area = {};
//		var poligons = {};
//		var tmpAreas = [];
//		var aColor = "";
//		var timeCost = {};
//		
//		for(var i = 0; i < areas.length; i++){
//			var areaOccupancy = 0;
//			var areaProfit = [];
//			if(type == 1){
//				aColor = this.correctColor(areas[i].color);
//			} else if(type == 2){
//				var slotsInArea = sharedDataService.getTotalSlotsInArea(areas[i].id, this.occupancyStreetsWS);
//				areaOccupancy = sharedDataService.getStreetsInAreaOccupancy(areas[i].id, this.occupancyStreetsWS);
//				if(areaOccupancy != -1){
//					areaOccupancy = slotsInArea[2];
//				}
//				aColor = this.getOccupancyColor(areaOccupancy);
//			} else if(type == 3){
//				areaProfit = sharedDataService.getPMsInAreaProfit(areas[i].id, this.profitParkingMeterWS);
//				aColor = this.getProfitColor(areaProfit[0]);
//			} else if(type == 4){
//				var slotsInArea = sharedDataService.getTotalSlotsInArea(areas[i].id, this.occupancyStreetsWS);
//				areaOccupancy = sharedDataService.getStreetsInAreaOccupancy(areas[i].id, this.occupancyStreetsWS);
//				if(areaOccupancy != -1){
//					areaOccupancy = slotsInArea[2];
//				}
//				timeCost = this.getExtratimeFromOccupancy(areaOccupancy);
//				areas[i].extratime = timeCost;
//				aColor = this.getTimeCostColor(timeCost);
//			} 
//			
//			if(firstInit){	// I use this code only the first time I show the zone occupancy data
//				var slotsInArea = sharedDataService.getTotalSlotsInArea(areas[i].id, this.occupancyStreetsWS);
//				areas[i].slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(areas[i].id);
//				areas[i].slotOccupied = slotsInArea[1]; //Math.round(area.data.slotNumber * areaOccupancy / 100);
//			}
//			areas[i].profit = areaProfit[0];
//			areas[i].tickets = areaProfit[1];
//			areas[i].pmsInArea = areaProfit[2];
//			
//			if(areas[i].geometry != null && areas[i].geometry.length > 0 && areas[i].geometry[0].points.length > 0){
//				var zones0 = [];
//				var zones1 = [];
//				var zones2 = [];
//				var zones3 = [];
//				var zones4 = [];
//				// zone init
//				if(areas[i].zones){
//					for(var j = 0; j < areas[i].zones.length; j++){
//						var z0 = this.getLocalZoneById(areas[i].zones[j], 1, 0);
//						var z1 = this.getLocalZoneById(areas[i].zones[j], 1, 1);
//						var z2 = this.getLocalZoneById(areas[i].zones[j], 1, 2);
//						var z3 = this.getLocalZoneById(areas[i].zones[j], 1, 3);
//						var z4 = this.getLocalZoneById(areas[i].zones[j], 1, 4);
//						if(z0 != null){
//							zones0.push(this.addLabelToZoneObject(z0));
//						} else if(z1 != null){
//							zones1.push(this.addLabelToZoneObject(z1));
//						} else if(z2 != null){
//							zones2.push(this.addLabelToZoneObject(z2));
//						} else if(z3 != null){
//							zones3.push(this.addLabelToZoneObject(z3));
//						} else if(z4 != null){
//							zones4.push(this.addLabelToZoneObject(z4));
//						}
//					}
//				}
//				for(var j = 0; j < areas[i].geometry.length; j++){
//					poligons = areas[i].geometry;
//					area = {
//						id: this.correctAreaId(areas[i].id, j),
//						path: this.correctPoints(poligons[j].points),
//						gpath: this.correctPointsGoogle(poligons[j].points),
//						stroke: {
//						    color: aColor, //$scope.correctColor(areas[i].color),
//						    weight: 3,
//						    opacity: 0.7
//						},
//						data: areas[i],
//						zones0: zones0,
//						zones1: zones1,
//						zones2: zones2,
//						zones3: zones3,
//						zones4: zones4,
//						info_windows_pos: this.correctPointGoogle(poligons[j].points[1]),
//						info_windows_cod: "a" + areas[i].id,
//						editable: false,
//						draggable: false,
//						geodesic: false,
//						visible: visible,
//						fill: {
//						    color: aColor, //$scope.correctColor(areas[i].color),
//						    opacity: 0.5
//						}
//					};
//					tmpAreas.push(area);
//				}
//			}
//		}
//		if(!firstTime){
//			this.closeLoadingMap();
//		}
//		return [tmpAreas, areas];
//	};
	
	this.initZonesOnMap = function(zones, visible, type, firstInit, firstTime){
		var zone = {};
		var poligons = {};
		var tmpZones = [];
		var timeCost = "";
		var zColor = "";
		
		if(zones){
			for(var i = 0; i < zones.length; i++){
				var zoneOccupancy = 0;
				var zoneProfit = 0;
				if(type == 1){
					zColor = this.correctColor(zones[i].color);
				} else if(type == 2){
					var slotsInZone = sharedDataService.getTotalSlotsInZone(zones[i].id, this.occupancyStreetsWS);
					zoneOccupancy = sharedDataService.getStreetsInZoneOccupancy(zones[i].id, this.occupancyStreetsWS);
					if(zoneOccupancy != -1){
						zoneOccupancy = slotsInZone[2];
					}
					zColor = this.getOccupancyColor(zoneOccupancy);
				} else if(type == 3){
					zoneProfit = sharedDataService.getPmsInZoneProfit(zones[i].id, this.profitParkingMeterWS);
					zColor = this.getProfitColor(zoneProfit[0]);
				} else if(type == 4){
					var slotsInZone = sharedDataService.getTotalSlotsInZone(zones[i].id, this.occupancyStreetsWS);
					zoneOccupancy = sharedDataService.getStreetsInZoneOccupancy(zones[i].id, this.occupancyStreetsWS);
					if(zoneOccupancy != -1){
						zoneOccupancy = slotsInZone[2];
					}
					timeCost = this.getExtratimeFromOccupancy(zoneOccupancy);
					zones[i].extratime = timeCost;
					zColor = this.getTimeCostColor(timeCost);
				}
				
				if(firstInit){	// I use this code only the first time I show the zone occupancy data
					var slotsInZone = sharedDataService.getTotalSlotsInZone(zones[i].id, this.occupancyStreetsWS);
					zones[i].slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone(zones[i].id);
					zones[i].slotOccupied = slotsInZone[1]; //Math.round(zone.data.slotNumber * zoneOccupancy / 100);
					// profit data
					zoneProfit = sharedDataService.getPmsInZoneProfit(zones[i].id, this.profitParkingMeterWS);
					zones[i].profit = zoneProfit[0];	// sum of profit from pms in zone
					zones[i].tickets = zoneProfit[1];	// sum of tickets from pms in zone
					zones[i].pmsInZone = zoneProfit[2];
					zones[i].slotPaid = sharedDataService.getPaidSlotsInZone(zones[i].id, this.occupancyStreetsWS);
				}
				if(zoneProfit != 0){
					// case profit updated
					zones[i].profit = zoneProfit[0];	// sum of profit from pms in zone
					zones[i].tickets = zoneProfit[1];	// sum of tickets from pms in zone
					zones[i].pmsInZone = zoneProfit[2];
					zones[i].slotPaid = sharedDataService.getPaidSlotsInZone(zones[i].id, this.occupancyStreetsWS);
				} else {
					// case profit keep value
					zones[i].profit = zones[i].profit;
					zones[i].tickets = zones[i].tickets;
					zones[i].pmsInZone = zones[i].pmsInZone;
					zones[i].slotPaid = zones[i].slotPaid;
				}
				
				if(zones[i].geometryFromSubelement){
					var streets = sharedDataService.loadStreetsFromZone(zones[i].id, this.occupancyStreetsWS);//zones[i].subelements;//$scope.loadStreetsFromZone(zones[i].id);
					var color = this.correctColor(this.lightgray);
					if(streets != null && streets.length > 0){
						if(type == 1){
							var z_col = streets[0].area_color;
							zones[i].color = z_col;	// here I force to use the color of the street and not the eventualy color of the zone
							color = this.correctColor(z_col);
						} else {
							color = zColor;
						}
					}
					if(streets != null && streets.length > 0){
						for(var j = 0; j < streets.length; j++){
							var polyline = streets[j].geometry;
							zone = {
								id: "mz" +	streets[j].id,	//$scope.correctObjId(zones[i].id, j),	// I try to use id of street instead of id of zone
								type: "polyline",
								path: this.correctPoints(polyline.points),
								gpath: this.correctPointsGoogle(polyline.points),
								stroke: {
								    color: color,
								    weight: 3,
								    opacity: 0.5
								},
								data: zones[i],
								info_windows_pos: this.correctPointGoogle(polyline.points[1]),
								info_windows_cod: "z" + zones[i].id,
								editable: true,
								draggable: true,
								geodesic: false,
								visible: visible,
								subelements: streets
							};
							tmpZones.push(zone);
						}
					}
				} else {
					if(zones[i].geometry != null && zones[i].geometry.points != null && zones[i].geometry.points.length > 0){
						poligons = zones[i].geometry;
						zone = {
							id: zones[i].id,
							type: "polygon",
							path: this.correctPoints(poligons.points),
							gpath: this.correctPointsGoogle(poligons.points),
							stroke: {
							    color: zColor,//$scope.correctColor(zones[i].color),
							    weight: 3,
							    opacity: 0.7
							},
							data: zones[i],
							info_windows_cod: "z" + zones[i].id,
							info_windows_pos: this.correctPointGoogle(poligons.points[1]),
							editable: true,
							draggable: true,
							geodesic: false,
							visible: visible,
							fill: {
							    color: zColor,//$scope.correctColor(zones[i].color),
							    opacity: 0.5
							}
						};	
						
						tmpZones.push(zone);
					}
				}
			}
		}
		if(!firstTime){
			this.closeLoadingMap();
		}
		return [tmpZones, zones];
	};
	
	// correctMyZones: used to correct the zone object with all the necessary data
	this.correctMyZones = function(zones){
		var correctedZones = [];
		for(var i = 0; i < zones.length; i++){
			var corrType = sharedDataService.getCorrectZoneType(zones[i].type);
			var sub = (zones[i].submacro) ? zones[i].submacro : ((zones[i].submicro) ? zones[i].submicro : null);
			var lbl = (sub) ? (zones[i].name + "_" + sub) : zones[i].name;
			var correctZone = {
				id: zones[i].id,
				id_app: zones[i].id_app,
				color: zones[i].color,
				name: zones[i].name,
				submacro: zones[i].submacro,
				submicro: zones[i].submicro,
				type: zones[i].type,
				myType: corrType,
				note: zones[i].note,
				geometry: this.correctMyGeometryPolygon(zones[i].geometry),
				geometryFromSubelement: zones[i].geometryFromSubelement,
				subelements: sharedDataService.loadStreetsFromZone(zones[i].id, this.occupancyStreetsWS),
				label: lbl
			};
			correctedZones.push(correctZone);
		}
		return correctedZones;
	};	
	
//	this.initZonesOnMapComplete = function(zones, visible, type, firstInit, firstTime){
//		var zone = {};
//		var poligons = {};
//		var tmpZones = [];
//		var timeCost = "";
//		var zColor = "";
//		
//		if(zones){
//			for(var i = 0; i < zones.length; i++){
//				var zoneOccupancy = 0;
//				var zoneProfit = 0;
//				if(type == 1){
//					zColor = $scope.correctColor(zones[i].color);
//				} else if(type == 2){
//					var slotsInZone = $scope.getTotalSlotsInZone(zones[i].id);
//					zoneOccupancy = $scope.getStreetsInZoneOccupancy(zones[i].id);
//					if(zoneOccupancy != -1){
//						zoneOccupancy = slotsInZone[2];
//					}
//					zColor = $scope.getOccupancyColor(zoneOccupancy);
//				} else if(type == 3){
//					zoneProfit = $scope.getStreetsInZoneProfit(zones[i].id);
//					zColor = $scope.getProfitColor(zoneProfit[0]);
//				} else if(type == 4){
//					var slotsInZone = $scope.getTotalSlotsInZone(zones[i].id);
//					zoneOccupancy = $scope.getStreetsInZoneOccupancy(zones[i].id);
//					if(zoneOccupancy != -1){
//						zoneOccupancy = slotsInZone[2];
//					}
//					timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
//					zones[i].extratime = timeCost;
//					zColor = $scope.getTimeCostColor(timeCost);
//				}
//				
//				if(firstInit){	// I use this code only the first time I show the zone occupancy data
//					var slotsInZone = $scope.getTotalSlotsInZone(zones[i].id);
//					zones[i].slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone(zones[i].id);
//					zones[i].slotOccupied = slotsInZone[1]; //Math.round(zone.data.slotNumber * zoneOccupancy / 100);
//					// profit data
//					zoneProfit = $scope.getStreetsInZoneProfit(zones[i].id);
//					zones[i].profit = zoneProfit[0];	// sum of profit from pms in zone
//					zones[i].tickets = zoneProfit[1];	// sum of tickets from pms in zone
//					zones[i].streetInZone = zoneProfit[2];
//					zones[i].slotPaid = $scope.getPaidSlotsInZone(zones[i].id);
//				}
//				if(zoneProfit != 0){
//					// case profit updated
//					zones[i].profit = zoneProfit[0];	// sum of profit from pms in zone
//					zones[i].tickets = zoneProfit[1];	// sum of tickets from pms in zone
//					zones[i].streetInZone = zoneProfit[2];
//					zones[i].slotPaid = $scope.getPaidSlotsInZone(zones[i].id);
//				} else {
//					// case profit keep value
//					zones[i].profit = zones[i].profit;
//					zones[i].tickets = zones[i].tickets;
//					zones[i].streetInZone = zones[i].streetInZone;
//					zones[i].slotPaid = zones[i].slotPaid;
//				}
//				
//				if(zones[i].geometryFromSubelement){
//					var streets = $scope.loadStreetsFromZone(zones[i].id);//zones[i].subelements;//$scope.loadStreetsFromZone(zones[i].id);
//					var color = $scope.correctColor($scope.lightgray);
//					if(streets != null && streets.length > 0){
//						if(type == 1){
//							var z_col = streets[0].area_color;
//							zones[i].color = z_col;	// here I force to use the color of the street and not the eventualy color of the zone
//							color = $scope.correctColor(z_col);
//						} else {
//							color = zColor;
//						}
//					}
//					if(streets != null && streets.length > 0){
//						for(var j = 0; j < streets.length; j++){
//							var polyline = streets[j].geometry;
//							zone = {
//								id: "mz" +	streets[j].id,	//$scope.correctObjId(zones[i].id, j),	// I try to use id of street instead of id of zone
//								type: "polyline",
//								path: $scope.correctPoints(polyline.points),
//								gpath: $scope.correctPointsGoogle(polyline.points),
//								stroke: {
//								    color: color,
//								    weight: 3,
//								    opacity: 0.5
//								},
//								data: zones[i],
//								info_windows_pos: $scope.correctPointGoogle(polyline.points[1]),
//								info_windows_cod: "z" + zones[i].id,
//								editable: true,
//								draggable: true,
//								geodesic: false,
//								visible: visible,
//								subelements: streets
//							};
//							tmpZones.push(zone);
//						}
//					}
//				} else {
//					if(zones[i].geometry != null && zones[i].geometry.points != null && zones[i].geometry.points.length > 0){
//						poligons = zones[i].geometry;
//						zone = {
//							id: zones[i].id,
//							type: "polygon",
//							path: $scope.correctPoints(poligons.points),
//							gpath: $scope.correctPointsGoogle(poligons.points),
//							stroke: {
//							    color: zColor,//$scope.correctColor(zones[i].color),
//							    weight: 3,
//							    opacity: 0.7
//							},
//							data: zones[i],
//							info_windows_cod: "z" + zones[i].id,
//							info_windows_pos: $scope.correctPointGoogle(poligons.points[1]),
//							editable: true,
//							draggable: true,
//							geodesic: false,
//							visible: visible,
//							fill: {
//							    color: zColor,//$scope.correctColor(zones[i].color),
//							    opacity: 0.5
//							}
//						};	
//						
//						tmpZones.push(zone);
//					}
//				}
//			}
//		}
//		if(!firstTime){
//			gMapService.closeLoadingMap();
//		}
//		return [tmpZones, zones];
//	};

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
	
	// Method to calculate the profit value for streets
	this.calculateProfitForStreets = function(streets){
		for(var i = 0; i < streets.length; i++){
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
		}
		return streets;
	};
	
//	this.initStreetsOnMapComplete = function(streets, visible, type, onlyData){
//		var street = {};
//		var poligons = {};
//		var tmpStreets = [];
//		var sColor = "";
//		var timeCost = {};
//		
//		for(var i = 0; i < streets.length; i++){
//			var myAreaS = sharedDataService.getLocalAreaById(streets[i].rateAreaId);
//			var parkingMeters = streets[i].parkingMeters;
//			var totalProfit = 0;
//			var totalTickets = 0;
//			if(parkingMeters != null){
//				for(var j = 0; j < parkingMeters.length; j++){
//					if(parkingMeters[j] != null){
//						var composedProfit = this.getActualPmProfit(parkingMeters[j]);
//						var profit = composedProfit[0];
//						var tickets = composedProfit[1];
//						if(profit != -1){
//							totalProfit += profit;
//							totalTickets += tickets;
//						}
//					}
//				}
//			}
//			if(totalProfit == 0){
//				streets[i].profit = -1;
//			} else {
//				streets[i].profit = totalProfit;
//			}
//			if(totalTickets == 0){
//				streets[i].tickets = -1;
//			} else {
//				streets[i].tickets = totalTickets;
//			}	
//			if(!onlyData){
//				if(type == 1){
//					sColor = this.correctColor(streets[i].color);
//				} else if(type == 2){
//					sColor = this.getOccupancyColor(streets[i].occupancyRate);
//				} else if(type == 3){
//					sColor = this.getProfitColor(streets[i].profit);
//				} else if(type == 4){
//					timeCost = this.getExtratimeFromOccupancy(streets[i].occupancyRate);
//					streets[i].extratime = timeCost;
//					sColor = this.getTimeCostColor(timeCost);
//				}
//			
//				if(streets[i].geometry != null){
//					poligons = streets[i].geometry;
//					street = {
//						id: streets[i].id,
//						path: this.correctPoints(poligons.points),
//						gpath: this.correctPointsGoogle(poligons.points),
//						stroke: {
//						    color: sColor,
//						    weight: (visible) ? 3 : 0,
//						    opacity: 0.7
//						},
//						data: streets[i],
//						area: myAreaS,
////						zones0: streets[i].myZones0,
////						zones1: streets[i].myZones1,
////						zones2: streets[i].myZones2,
////						zones3: streets[i].myZones3,
////						zones4: streets[i].myZones4,
////						pms: streets[i].myPms,
//						info_windows_pos: this.correctPointGoogle(poligons.points[1]),
//						info_windows_cod: "s" + streets[i].id,
//						editable: false,
//						draggable: false,
//						geodesic: false,
//						visible: visible
//					};
//					tmpStreets.push(street);
//				}
//			}
//		}
//		this.closeLoadingMap();
//		return [tmpStreets, streets];
//	}
	
    this.setAllMarkersMap = function(markers, map, visible, type){
    	//------ To be configured in external conf file!!!!!------
		var company = "tm";
		/*var appId = sharedDataService.getConfAppId();
		if(appId == 'rv'){ 
			company = "amr";
		} else {
			company = "tm";
		}*/
		var baseUrl = "rest/nosec";
		var defaultMarkerColor = "FF0000";
		var myMarkers = [];	//Important: here I create a copy so the input list remain intact
		//--------------------------------------------------------
		var myAreaPm = {};
		for(var i = 0; i < markers.length; i++){
			var myMarker = markers[i];
			myMarker.options.visible = visible;
			myMarker.options.map = map;
    		switch(type){
	    		case 0:
					myAreaPm = sharedDataService.getLocalAreaById(markers[i].data.areaId);
					myMarker.icon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
	    			break;
	    		case 1:
	    			myMarker.icon = this.psMarkerIcon;
	    			break;
	    		case 2:
	    			var myIcon = this.getOccupancyIcon(markers[i].data.occupancyRate, 2);
	    			myMarker.icon = myIcon;
	    			break;
	    		case 3:
	    			var myIcon = this.getProfitIcon(markers[i].data.profit, 2);
	    			myMarker.icon = myIcon;
	    			break;
	    		case 4:
	    			var occupancy = markers[i].data.occupancyRate;
	    			var timeCost = this.getExtratimeFromOccupancy(occupancy);
	    			var myIcon = this.getTimeCostIcon(timeCost, 2);
	    			myMarker.icon = myIcon;
	    			myMarker.data.extratime = timeCost;
	    			break;
	    		case 5:		// profit icon for parking meter
	    			var myIcon = this.getProfitIcon(markers[i].data.profit, 1);
	    			myMarker.icon = myIcon;
	    			break;
	    		default:
	    			break;
    		}
    		myMarkers.push(myMarker);
    	}
    	this.closeLoadingMap();
    	return myMarkers;
    };
    
    // --------------------------------- Block for map object repainting -----------------------------------------
    
    
    
    
    // -----------------------------------------------------------------------------------------------------------
    
    // Method initPMObject: used to init a pm object with all the related object data
	this.initPMObject = function(pmeter){
		var area = sharedDataService.getLocalAreaById(pmeter.data.areaId);
		var zones0 = [];
		var zones1 = [];
		var zones2 = [];
		var zones3 = [];
		var zones4 = [];
		// zone init
		if(pmeter.zones){
			for(var j = 0; j < pmeter.data.zones.length; j++){
				var z0 = this.getLocalZoneById(pmeter.data.zones[j], 2, 0);
				var z1 = this.getLocalZoneById(pmeter.data.zones[j], 2, 1);
				var z2 = this.getLocalZoneById(pmeter.data.zones[j], 2, 2);
				var z3 = this.getLocalZoneById(pmeter.data.zones[j], 2, 3);
				var z4 = this.getLocalZoneById(pmeter.data.zones[j], 2, 4);
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
		pmeter.myStatus = (pmeter.data.status == 'ACTIVE')?"ON-ACTIVE":"OFF-INACTIVE";
		pmeter.data.area_name = area.name,
		pmeter.data.area_color= area.color;
		pmeter.data.myZones0 = zones0;
		pmeter.data.myZones1 = zones1;
		pmeter.data.myZones2 = zones2;
		pmeter.data.myZones3 = zones3;
		pmeter.data.myZones4 = zones4;
		// To align with old management
		pmeter.area = area;
		pmeter.zones0 = zones0;
		pmeter.zones1 = zones1;
		pmeter.zones2 = zones2;
		pmeter.zones3 = zones3;
		pmeter.zones4 = zones4;
		return pmeter;
	};
	
	// Method initPSObject: used to init a ps object with all the related object data
	this.initPSObject = function(ps){
		var zones0 = [];
		var zones1 = [];
		var zones2 = [];
		var zones3 = [];
		var zones4 = [];
		// zone init
		if(ps.zones){
			for(var j = 0; j < ps.zones.length; j++){
				var z0 = this.getLocalZoneById(ps.zones[j], 2, 0);
				var z1 = this.getLocalZoneById(ps.zones[j], 2, 1);
				var z2 = this.getLocalZoneById(ps.zones[j], 2, 2);
				var z3 = this.getLocalZoneById(ps.zones[j], 2, 3);
				var z4 = this.getLocalZoneById(ps.zones[j], 2, 4);
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
		ps.myZones0 = zones0;
		ps.myZones1 = zones1;
		ps.myZones2 = zones2;
		ps.myZones3 = zones3;
		ps.myZones4 = zones4;
		return ps;
	};
	
	this.initStreetObject = function(street){
		var zones0 = [];
		var zones1 = [];
		var zones2 = [];
		var zones3 = [];
		var zones4 = [];
		// zone init
		for(var j = 0; j < street.data.zones.length; j++){
			var z0 = this.getLocalZoneById(street.data.zones[j], 2, 0);
			var z1 = this.getLocalZoneById(street.data.zones[j], 2, 1);
			var z2 = this.getLocalZoneById(street.data.zones[j], 2, 2);
			var z3 = this.getLocalZoneById(street.data.zones[j], 2, 3);
			var z4 = this.getLocalZoneById(street.data.zones[j], 2, 4);
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
		var pms = [];
		if(street.data.parkingMeters != null){
			for(var x = 0; x < street.data.parkingMeters.length; x++){
				var pm = sharedDataService.getLocalPmById(street.data.parkingMeters[x]);
				if(pm != null){
					pms.push(pm);
				}
			}
		}
		var area = sharedDataService.getLocalAreaById(street.data.rateAreaId);
		street.data = sharedDataService.cleanStreetNullValue(street.data);
		street.data.slotOccupied = sharedDataService.getTotalOccupiedSlots(street.data);
		street.data.extratime = this.getExtratimeFromOccupancy(street.data.occupancyRate);
		street.data.area_name = area.name;
		street.data.area_color= area.color;
		street.data.area = area;
		street.data.myZones0 = zones0;
		street.data.myZones1 = zones1;
		street.data.myZones2 = zones2;
		street.data.myZones3 = zones3;
		street.data.myZones4 = zones4;
		street.data.myPms = pms;
		// To align with old management
		street.area = area;
		street.zones0 = zones0;
		street.zones1 = zones1;
		street.zones2 = zones2;
		street.zones3 = zones3;
		street.zones4 = zones4;
		street.pms = pms;
		return street;
	};
	
	this.initAreaObject = function(area){
		var zones0 = [];
		var zones1 = [];
		var zones2 = [];
		var zones3 = [];
		var zones4 = [];
		// zone init
		if(area.data.zones){
			for(var j = 0; j < area.data.zones.length; j++){
				var z0 = this.getLocalZoneById(area.data.zones[j], 2, 0);
				var z1 = this.getLocalZoneById(area.data.zones[j], 2, 1);
				var z2 = this.getLocalZoneById(area.data.zones[j], 2, 2);
				var z3 = this.getLocalZoneById(area.data.zones[j], 2, 3);
				var z4 = this.getLocalZoneById(area.data.zones[j], 2, 4);
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
		//var areaProfit = sharedDataService.getPMsInAreaProfit(area.id, this.profitParkingMeterWS);
		// for profit
		/*if(firstInit){	// I use this code only the first time I show the zone occupancy data
			var slotsInArea = sharedDataService.getTotalSlotsInArea(area.id, this.occupancyStreetsWS);
			area.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(areas[i].id);
			area.slotOccupied = slotsInArea[1]; //Math.round(area.data.slotNumber * areaOccupancy / 100);
		}*/
		/*area.data.profit = areaProfit[0];
		area.data.tickets = areaProfit[1];
		area.data.pmsInArea = areaProfit[2];*/
		area.data.myZones0 = zones0;
		area.data.myZones1 = zones1;
		area.data.myZones2 = zones2;
		area.data.myZones3 = zones3;
		area.data.myZones4 = zones4;
		area.zones0 = zones0;
		area.zones1 = zones1;
		area.zones2 = zones2;
		area.zones3 = zones3;
		area.zones4 = zones4;
		return area;
	};
	
	// Method createMarkers: used to create a graphic parker object to be show in google map
	this.createMarkers = function(i, marker, type) {
		//------ To be configured in external conf file!!!!!------
		var company = "amr";
		var baseUrl = "rest/nosec";
		var defaultMarkerColor = "FF0000";
		//--------------------------------------------------------
		var myIcon = "";
		var myAreaPm = {};
		var color = "";
		var cid = "";
		/*var zones0 = [];
		var zones1 = [];
		var zones2 = [];
		var zones3 = [];
		var zones4 = [];*/
		switch(type){
			case 1 : 
				myAreaPm = sharedDataService.getLocalAreaById(marker.areaId);
				myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
				cid = "c" + marker.id;
				break;
			case 2 : 
				myIcon = this.psMarkerIcon;
				break;
			case 3 :
				myIcon = this.bpMarkerIcon;
				break;
			case 4 :
				myIcon = this.getOccupancyIcon(marker.occupancyRate, 2);	//get the correct profit icon from the ps profit value
				break;
			case 5 :
				color = this.getProfitColor(marker.profit);
				myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((marker.profit != null) ? this.plainColor(color) : defaultMarkerColor);
				cid = "c" + marker.id;
				break;
			case 6 :
				myIcon = this.getProfitIcon(marker.profit, 2);	//get the correct profit icon from the ps profit value
				break;
		}
		// zone init
		if(marker.zones){
			/*for(var j = 0; j < marker.zones.length; j++){
				var z0 = $scope.getLocalZoneById(marker.zones[j], 1, 0);
				var z1 = $scope.getLocalZoneById(marker.zones[j], 1, 1);
				var z2 = $scope.getLocalZoneById(marker.zones[j], 1, 2);
				var z3 = $scope.getLocalZoneById(marker.zones[j], 1, 3);
				var z4 = $scope.getLocalZoneById(marker.zones[j], 1, 4);
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
			}*/
		}
		
		var ret = {
			data: marker,
			id: i	
		};
		if(marker.geometry != null){
			ret = {
				id: i,
				position: marker.geometry.lat + "," + marker.geometry.lng,
			    coords: { 
			        latitude: marker.geometry.lat,
			        longitude: marker.geometry.lng
			    },
			    options: { 
			    	draggable: true,
			    	visible: true,
			    	map: null
			    },
			    cid : cid,
				data: marker,
				area: marker.area,
				/*zones0: zones0,
				zones1: zones1,
				zones2: zones2,
				zones3: zones3,
				zones4: zones4,*/
				icon: myIcon,
				myprofitColor: color,
				showWindow: false
			};
			ret.closeClick = function () {
		        ret.showWindow = false;
		    };
		    ret.onClick = function () {
		    	console.log("I am in ret marker click event function: " + ret.data.code);
		    	ret.showWindow = !ret.showWindow;
		    };
		}
		return ret;
	};
	
	
	// ---------------------------------------------- Start block Utilization diagrams --------------------------------------
	this.initAllDiagrams = function(){
    	this.chartPsOccupancy.data = [["Posti", "num"]];
    	this.chartStreetParkAvailability.data = [["Posti", "number"]];
    	this.chartStreetOccupancy.data = [["Posti", "number"]];
      	this.chartStreetFreeParkAvailability.data = [["Posti liberi", "number"]];
      	this.chartStreetOccupiedParkComposition.data = [["Posti occupati", "number"]];
      	this.chartZoneOccupancy.data = [["Posti", "num"]];
      	this.chartAreaOccupancy.data = [["Posti", "num"]];
      	this.chartPsOccupancy_eng.data = [["Slots", "num"]];
      	this.chartStreetParkAvailability_eng.data = [["Slots", "number"]];
    	this.chartStreetOccupancy_eng.data = [["Slots", "number"]];
      	this.chartStreetFreeParkAvailability_eng.data = [["Free slots", "number"]];
      	this.chartStreetOccupiedParkComposition_eng.data = [["Occupied slots", "number"]];
      	this.chartZoneOccupancy_eng.data = [["Slots", "num"]];
      	this.chartAreaOccupancy_eng.data = [["Slots", "num"]];
    };
    
    this.chartPsOccupancy = this.chart = {
  		  "type": "PieChart",
  		  "data": [],
  		  "options": {
  		    "displayExactValues": true,
  		    "width": "100%",
  		    "height": "100%",
  		    "is3D": true,
  		    "legend": {
  		    	"position": 'top',
  		    	"textStyle": {"color": 'black', "fontSize" : 10}
      	    },
  		    "chartArea": {
  		      "left": 5,
  		      "top": 50,
  		      "bottom": 0,
  		      "width": "100%",
  		      "height": "100%"
  		    }
  		  },
  		  "formatters": {
  		    "number": [
  		      {
  		        "columnNum": 1,
  		        "pattern": "#0 posti"
  		      }
  		    ]
  		  },
  		  "displayed": true
    };
    
    this.chartPsOccupancy_eng = this.chart = {
    		  "type": "PieChart",
    		  "data": [],
    		  "options": {
    		    "displayExactValues": true,
    		    "width": "100%",
    		    "height": "100%",
    		    "is3D": true,
    		    "legend": {
    		    	"position": 'top',
    		    	"textStyle": {"color": 'black', "fontSize" : 10}
        	    },
    		    "chartArea": {
    		      "left": 5,
    		      "top": 50,
    		      "bottom": 0,
    		      "width": "100%",
    		      "height": "100%"
    		    }
    		  },
    		  "formatters": {
    		    "number": [
    		      {
    		        "columnNum": 1,
    		        "pattern": "#0 slots"
    		      }
    		    ]
    		  },
    		  "displayed": true
      };
    
    this.getChartPsOccupancy = function(lang){
    	if(lang=="ita"){
    		return this.chartPsOccupancy;
    	} else {
    		return this.chartPsOccupancy_eng;
    	}
    };
  
    this.initPsOccupancyDiagram = function(structure, type){
    	this.chartPsOccupancy.data = [["Posti", "num"]];
    	this.chartPsOccupancy_eng.data = [["Slots", "num"]];
  		var object;
  		if(type == 1){
  			object = structure.data;
  		} else {
  			object = structure;
  		}
  		var available = object.slotNumber;
  		var occ = parseInt(object.payingSlotOccupied) + parseInt(object.handicappedSlotOccupied);
  		if(object.unusuableSlotNumber != -1){
  			available -= object.unusuableSlotNumber;
  		}
  		// Ita
  		var dataTot = [ "Liberi", available - occ ];
  		var dataOcc = [ "Occupati", occ ];
  		this.chartPsOccupancy.data.push(dataTot);
  		this.chartPsOccupancy.data.push(dataOcc);
  		this.chartPsOccupancy.options.title = "Posti occupati in struttura";
  		// Eng
  		var dataTot_eng = [ "Free", available - occ ];
  		var dataOcc_eng = [ "Occupied", occ ];
  		this.chartPsOccupancy_eng.data.push(dataTot_eng);
  		this.chartPsOccupancy_eng.data.push(dataOcc_eng);
  		this.chartPsOccupancy_eng.options.title = "Occupied slots in structure";
    };
    
    this.chartStreetParkAvailability = this.chart = {
        "type": "PieChart",
        "data": [],
        "options": {
            "displayExactValues": true,
            "width": "100%",
            "height": "100%",
            "is3D": true,
            "legend": {
            	"position": 'top',
            	"textStyle": {"color": 'black', "fontSize" : 10}
            },
       	    "chartArea": {
       	      "left": 5,
       	      "top": 50,
       	      "bottom": 0,
       	      "width": "100%",
       	      "height": "100%"
       	    }
       	},
       	"formatters": {
       	    "number": [
       	        {
       	        	"columnNum": 1,
       	        	"pattern": "#0 posti"
       	        }
       	    ]
       	},
       	"displayed": true
    };
    
    this.chartStreetParkAvailability_eng = this.chart = {
            "type": "PieChart",
            "data": [],
            "options": {
                "displayExactValues": true,
                "width": "100%",
                "height": "100%",
                "is3D": true,
                "legend": {
                	"position": 'top',
                	"textStyle": {"color": 'black', "fontSize" : 10}
                },
           	    "chartArea": {
           	      "left": 5,
           	      "top": 50,
           	      "bottom": 0,
           	      "width": "100%",
           	      "height": "100%"
           	    }
           	},
           	"formatters": {
           	    "number": [
           	        {
           	        	"columnNum": 1,
           	        	"pattern": "#0 slots"
           	        }
           	    ]
           	},
           	"displayed": true
        };
    
    this.getChartStreetParkAvailability = function(lang){
    	if(lang=="ita"){
    		return this.chartStreetParkAvailability;
    	} else {
    		return this.chartStreetParkAvailability_eng;
    	}
    };
    
    this.initStreetParkSupplyDiagram = function(street, type){
      	this.chartStreetParkAvailability.data = [["Posti", "number"]];
      	this.chartStreetParkAvailability_eng.data = [["Slots", "number"]];
      	var object = null;
      	if(type == 1){
      		object = street.data;
      	} else {
      		object = street;
      	}
    	// for slot composition ita
    	var freeFree = [ "Gratuiti", object.freeParkSlotNumber ];
    	var freeFreeSigned = [ "Gratuiti (segnalati)", object.freeParkSlotSignNumber ];
    	var freePaid = [ "A pagamento", object.paidSlotNumber ];
    	var freeTimed = [ "Disco Orario", object.timedParkSlotNumber ];
    	var freeHandicapped = [ "Per disabili", object.handicappedSlotNumber ];
    	var freeReserved = [ "Riservati", object.reservedSlotNumber ];
    	this.chartStreetParkAvailability.data.push(freeFree);
    	this.chartStreetParkAvailability.data.push(freeFreeSigned);
    	this.chartStreetParkAvailability.data.push(freePaid);
    	this.chartStreetParkAvailability.data.push(freeTimed);
    	this.chartStreetParkAvailability.data.push(freeHandicapped);
    	this.chartStreetParkAvailability.data.push(freeReserved);
    	this.chartStreetParkAvailability.options.title = "Composizione posti";
    	// eng
    	var freeFree_eng = [ "Free", object.freeParkSlotNumber ];
    	var freeFreeSigned_eng = [ "Free (signed)", object.freeParkSlotSignNumber ];
    	var freePaid_eng = [ "Paid", object.paidSlotNumber ];
    	var freeTimed_eng = [ "Timed", object.timedParkSlotNumber ];
    	var freeHandicapped_eng = [ "Handicapped", object.handicappedSlotNumber ];
    	var freeReserved_eng = [ "Reserved", object.reservedSlotNumber ];
    	this.chartStreetParkAvailability_eng.data.push(freeFree_eng);
    	this.chartStreetParkAvailability_eng.data.push(freeFreeSigned_eng);
    	this.chartStreetParkAvailability_eng.data.push(freePaid_eng);
    	this.chartStreetParkAvailability_eng.data.push(freeTimed_eng);
    	this.chartStreetParkAvailability_eng.data.push(freeHandicapped_eng);
    	this.chartStreetParkAvailability_eng.data.push(freeReserved_eng);
    	this.chartStreetParkAvailability_eng.options.title = "Slots composition";
    };
    
    this.chartStreetOccupancy = this.chart = {
    	"type": "PieChart",
    	"data": [],
    	"options": {
    	    "displayExactValues": true,
    	    "width": "100%",
    	    "height": "100%",
    	    "is3D": true,
    	    "legend": {
    	    	"position": 'top',
    	    	"textStyle": {"color": 'black', "fontSize" : 10}
            },
    	    "chartArea": {
    	      "left": 5,
    	      "top": 50,
    	      "bottom": 0,
    	      "width": "100%",
    	      "height": "100%"
    	    }
    	},
    	"formatters": {
    	    "number": [
    	        {
    	        	"columnNum": 1,
    	        	"pattern": "#0 posti"
    	        }
    	    ]
    	},
    	"displayed": true
    };
    
    this.chartStreetFreeParkAvailability = this.chart = {
        "type": "PieChart",
        "data": [],
        "options": {
            "displayExactValues": true,
            "width": "100%",
            "height": "100%",
            "is3D": true,
            "legend": {
            	"position": 'top',
       	    	"textStyle": {"color": 'black', "fontSize" : 10}
            },
       	    "chartArea": {
       	      "left": 5,
       	      "top": 50,
       	      "bottom": 0,
       	      "width": "100%",
       	      "height": "100%"
       	    }
       	},
      	"formatters": {
       	    "number": [
      	        {
       	        	"columnNum": 1,
       	        	"pattern": "#0 posti"
       	        }
       	    ]
       	},
      	"displayed": true
    };
    
    this.chartStreetOccupiedParkComposition = this.chart = {
        "type": "PieChart",
        "data": [],
        "options": {
            "displayExactValues": true,
            "width": "100%",
            "height": "100%",
            "is3D": true,
            "legend": {
              	"position": 'top',
       	    	"textStyle": {"color": 'black', "fontSize" : 10}
            },
       	    "chartArea": {
       	      "left": 5,
       	      "top": 50,
       	      "bottom": 0,
       	      "width": "100%",
       	      "height": "100%"
       	    }
       	},
      	"formatters": {
       	    "number": [
      	        {
       	        	"columnNum": 1,
       	        	"pattern": "#0 posti"
       	        }
       	    ]
       	},
      	"displayed": true
    };
    
    this.chartStreetOccupancy_eng = this.chart = {
        	"type": "PieChart",
        	"data": [],
        	"options": {
        	    "displayExactValues": true,
        	    "width": "100%",
        	    "height": "100%",
        	    "is3D": true,
        	    "legend": {
        	    	"position": 'top',
        	    	"textStyle": {"color": 'black', "fontSize" : 10}
                },
        	    "chartArea": {
        	      "left": 5,
        	      "top": 50,
        	      "bottom": 0,
        	      "width": "100%",
        	      "height": "100%"
        	    }
        	},
        	"formatters": {
        	    "number": [
        	        {
        	        	"columnNum": 1,
        	        	"pattern": "#0 slots"
        	        }
        	    ]
        	},
        	"displayed": true
        };
        
        this.chartStreetFreeParkAvailability_eng = this.chart = {
            "type": "PieChart",
            "data": [],
            "options": {
                "displayExactValues": true,
                "width": "100%",
                "height": "100%",
                "is3D": true,
                "legend": {
                	"position": 'top',
           	    	"textStyle": {"color": 'black', "fontSize" : 10}
                },
           	    "chartArea": {
           	      "left": 5,
           	      "top": 50,
           	      "bottom": 0,
           	      "width": "100%",
           	      "height": "100%"
           	    }
           	},
          	"formatters": {
           	    "number": [
          	        {
           	        	"columnNum": 1,
           	        	"pattern": "#0 slots"
           	        }
           	    ]
           	},
          	"displayed": true
        };
        
        this.chartStreetOccupiedParkComposition_eng = this.chart = {
            "type": "PieChart",
            "data": [],
            "options": {
                "displayExactValues": true,
                "width": "100%",
                "height": "100%",
                "is3D": true,
                "legend": {
                  	"position": 'top',
           	    	"textStyle": {"color": 'black', "fontSize" : 10}
                },
           	    "chartArea": {
           	      "left": 5,
           	      "top": 50,
           	      "bottom": 0,
           	      "width": "100%",
           	      "height": "100%"
           	    }
           	},
          	"formatters": {
           	    "number": [
          	        {
           	        	"columnNum": 1,
           	        	"pattern": "#0 slots"
           	        }
           	    ]
           	},
          	"displayed": true
        };
        
    this.getChartStreetOccupancy = function(lang){
    	if(lang=="ita"){
    		return this.chartStreetOccupancy;
    	} else {
    		return this.chartStreetOccupancy_eng;
    	}
    }; 
    
    this.getChartStreetFreeParkAvailability = function(lang){
    	if(lang=="ita"){
    		return this.chartStreetFreeParkAvailability;
    	} else {
    		return this.chartStreetFreeParkAvailability_eng;
    	}
    }; 
    
    this.getChartStreetOccupiedParkComposition = function(lang){
    	if(lang=="ita"){
    		return this.chartStreetOccupiedParkComposition;
    	} else {
    		return this.chartStreetOccupiedParkComposition_eng;
    	}
    }; 
    
    this.initStreetOccupancyDiagram = function(street, type){
      	this.chartStreetOccupancy.data = [["Posti", "number"]];
      	this.chartStreetFreeParkAvailability.data = [["Posti liberi", "number"]];
      	this.chartStreetOccupiedParkComposition.data = [["Posti occupati", "number"]];
      	this.chartStreetOccupancy_eng.data = [["Slots", "number"]];
      	this.chartStreetFreeParkAvailability_eng.data = [["Free slots", "number"]];
      	this.chartStreetOccupiedParkComposition_eng.data = [["Occupied slots", "number"]];
      	var object = null;
      	if(type == 1){
      		object = street.data;
      	} else {
      		object = street;
      	}
      	// for Total slot
    	var dataTot = [ "Liberi", object.slotNumber - object.unusuableSlotNumber - object.slotOccupied ];
    	var dataOcc = [ "Occupati", object.slotOccupied ];
    	var dataTot_eng = [ "Free", object.slotNumber - object.unusuableSlotNumber - object.slotOccupied ];
    	var dataOcc_eng = [ "Occupied", object.slotOccupied ];
    	this.chartStreetOccupancy.data.push(dataTot);
    	this.chartStreetOccupancy.data.push(dataOcc);
    	this.chartStreetOccupancy.options.title = "Posti in strada";
    	this.chartStreetOccupancy_eng.data.push(dataTot_eng);
    	this.chartStreetOccupancy_eng.data.push(dataOcc_eng);
    	this.chartStreetOccupancy_eng.options.title = "Slots in street";
    	// for Free slot
    	var freeFree = [ "Gratuiti", object.freeParkSlotNumber - object.freeParkSlotOccupied ];
    	var freeFreeSigned = [ "Gratuiti (segnalati)", object.freeParkSlotSignNumber - object.freeParkSlotSignOccupied ];
    	var freePaid = [ "A pagamento", object.paidSlotNumber - object.paidSlotOccupied ];
    	var freeTimed = [ "Disco Orario", object.timedParkSlotNumber - object.timedParkSlotOccupied ];
    	var freeHandicapped = [ "Per disabili", object.handicappedSlotNumber - object.handicappedSlotOccupied ];
    	var freeReserved = [ "Riservati", object.reservedSlotNumber - object.reservedSlotOccupied ];
    	var freeFree_eng = [ "Free", object.freeParkSlotNumber - object.freeParkSlotOccupied ];
    	var freeFreeSigned_eng = [ "Free (signed)", object.freeParkSlotSignNumber - object.freeParkSlotSignOccupied ];
    	var freePaid_eng = [ "Paid", object.paidSlotNumber - object.paidSlotOccupied ];
    	var freeTimed_eng = [ "Timed", object.timedParkSlotNumber - object.timedParkSlotOccupied ];
    	var freeHandicapped_eng = [ "Handicapped", object.handicappedSlotNumber - object.handicappedSlotOccupied ];
    	var freeReserved_eng = [ "Reserved", object.reservedSlotNumber - object.reservedSlotOccupied ];
    	this.chartStreetFreeParkAvailability.data.push(freeFree);
    	this.chartStreetFreeParkAvailability.data.push(freeFreeSigned);
    	this.chartStreetFreeParkAvailability.data.push(freePaid);
    	this.chartStreetFreeParkAvailability.data.push(freeTimed);
    	this.chartStreetFreeParkAvailability.data.push(freeHandicapped);
    	this.chartStreetFreeParkAvailability.data.push(freeReserved);
    	this.chartStreetFreeParkAvailability.options.title = "Posti liberi in strada";
    	this.chartStreetFreeParkAvailability_eng.data.push(freeFree_eng);
    	this.chartStreetFreeParkAvailability_eng.data.push(freeFreeSigned_eng);
    	this.chartStreetFreeParkAvailability_eng.data.push(freePaid_eng);
    	this.chartStreetFreeParkAvailability_eng.data.push(freeTimed_eng);
    	this.chartStreetFreeParkAvailability_eng.data.push(freeHandicapped_eng);
    	this.chartStreetFreeParkAvailability_eng.data.push(freeReserved_eng);
    	this.chartStreetFreeParkAvailability_eng.options.title = "Free slots in street";
    	// for Occupied slot
    	var occupiedFree = [ "Gratuiti", object.freeParkSlotOccupied ];
    	var occupiedFreeSigned = [ "Gratuiti (segnalati)", object.freeParkSlotSignOccupied ];
    	var occupiedPaid = [ "A pagamento", object.paidSlotOccupied ];
    	var occupiedTimed = [ "Disco Orario", object.timedParkSlotOccupied ];
    	var occupiedHandicapped = [ "Per disabili", object.handicappedSlotOccupied ];
    	var occupiedReserved = [ "Riservati", object.reservedSlotOccupied ];
    	var occupiedFree_eng = [ "Free", object.freeParkSlotOccupied ];
    	var occupiedFreeSigned_eng = [ "Free (signed)", object.freeParkSlotSignOccupied ];
    	var occupiedPaid_eng = [ "Paid", object.paidSlotOccupied ];
    	var occupiedTimed_eng = [ "Timed", object.timedParkSlotOccupied ];
    	var occupiedHandicapped_eng = [ "Handicapped", object.handicappedSlotOccupied ];
    	var occupiedReserved_eng = [ "Reserved", object.reservedSlotOccupied ];
    	this.chartStreetOccupiedParkComposition.data.push(occupiedFree);
    	this.chartStreetOccupiedParkComposition.data.push(occupiedFreeSigned);
    	this.chartStreetOccupiedParkComposition.data.push(occupiedPaid);
    	this.chartStreetOccupiedParkComposition.data.push(occupiedTimed);
    	this.chartStreetOccupiedParkComposition.data.push(occupiedHandicapped);
    	this.chartStreetOccupiedParkComposition.data.push(occupiedReserved);
    	this.chartStreetOccupiedParkComposition.options.title = "Posti occupati in sottovia";
    	this.chartStreetOccupiedParkComposition_eng.data.push(occupiedFree_eng);
    	this.chartStreetOccupiedParkComposition_eng.data.push(occupiedFreeSigned_eng);
    	this.chartStreetOccupiedParkComposition_eng.data.push(occupiedPaid_eng);
    	this.chartStreetOccupiedParkComposition_eng.data.push(occupiedTimed_eng);
    	this.chartStreetOccupiedParkComposition_eng.data.push(occupiedHandicapped_eng);
    	this.chartStreetOccupiedParkComposition_eng.data.push(occupiedReserved_eng);
    	this.chartStreetOccupiedParkComposition_eng.options.title = "Occupied slots in park";
    };
    
    this.chartZoneOccupancy = this.chart = {
        	"type": "PieChart",
        	"data": [],
        	"options": {
        	    "displayExactValues": true,
        	    "width": "100%",
        	    "height": "100%",
        	    "is3D": true,
        	    "legend": {
        	    	"position": 'top',
        	    	"textStyle": {"color": 'black', "fontSize" : 10}
                },
        	    "chartArea": {
        	      "left": 5,
        	      "top": 50,
        	      "bottom": 0,
        	      "width": "100%",
        	      "height": "100%"
        	    }
        	},
        	"formatters": {
        	    "number": [
        	        {
        	        	"columnNum": 1,
        	        	"pattern": "#0 posti"
        	        }
        	    ]
        	},
        	"displayed": true
        };
    
    this.chartZoneOccupancy_eng = this.chart = {
        	"type": "PieChart",
        	"data": [],
        	"options": {
        	    "displayExactValues": true,
        	    "width": "100%",
        	    "height": "100%",
        	    "is3D": true,
        	    "legend": {
        	    	"position": 'top',
        	    	"textStyle": {"color": 'black', "fontSize" : 10}
                },
        	    "chartArea": {
        	      "left": 5,
        	      "top": 50,
        	      "bottom": 0,
        	      "width": "100%",
        	      "height": "100%"
        	    }
        	},
        	"formatters": {
        	    "number": [
        	        {
        	        	"columnNum": 1,
        	        	"pattern": "#0 slots"
        	        }
        	    ]
        	},
        	"displayed": true
        };
    
    this.getChartZoneOccupancy = function(lang){
    	if(lang=="ita"){
    		return this.chartZoneOccupancy;
    	} else {
    		return this.chartZoneOccupancy_eng;
    	}
    }; 
    
    this.initZoneOccupancyDiagram = function(zone, type){
    	this.chartZoneOccupancy.data = [["Posti", "num"]];
    	this.chartZoneOccupancy_eng.data = [["Slots", "num"]];
    	var object;
    	if(type == 1){
    		object = zone.data;
    	} else {
    		object = zone;
    	}
  		var dataTot = [ "Liberi", object.slotNumber - object.slotOccupied ];
  		var dataOcc = [ "Occupati", object.slotOccupied ];
  		this.chartZoneOccupancy.data.push(dataTot);
  		this.chartZoneOccupancy.data.push(dataOcc);
  		var dataTot_eng = [ "Free", object.slotNumber - object.slotOccupied ];
  		var dataOcc_eng = [ "Occupated", object.slotOccupied ];
  		this.chartZoneOccupancy_eng.data.push(dataTot_eng);
  		this.chartZoneOccupancy_eng.data.push(dataOcc_eng);
  		this.chartZoneOccupancy.options.title = "Posti occupati in zona";
  		this.chartZoneOccupancy_eng.options.title = "Occupied slots in zone";
    };
    
    this.chartMicroZoneOccupancy = this.chart = {
        	"type": "PieChart",
        	"data": [],
        	"options": {
        	    "displayExactValues": true,
        	    "width": "100%",
        	    "height": "100%",
        	    "is3D": true,
        	    "legend": {
        	    	"position": 'top',
        	    	"textStyle": {"color": 'black', "fontSize" : 10}
                },
        	    "chartArea": {
        	      "left": 5,
        	      "top": 50,
        	      "bottom": 0,
        	      "width": "100%",
        	      "height": "100%"
        	    }
        	},
        	"formatters": {
        	    "number": [
        	        {
        	        	"columnNum": 1,
        	        	"pattern": "#0 posti"
        	        }
        	    ]
        	},
        	"displayed": true
        };
    
    this.chartMicroZoneOccupancy_eng = this.chart = {
        	"type": "PieChart",
        	"data": [],
        	"options": {
        	    "displayExactValues": true,
        	    "width": "100%",
        	    "height": "100%",
        	    "is3D": true,
        	    "legend": {
        	    	"position": 'top',
        	    	"textStyle": {"color": 'black', "fontSize" : 10}
                },
        	    "chartArea": {
        	      "left": 5,
        	      "top": 50,
        	      "bottom": 0,
        	      "width": "100%",
        	      "height": "100%"
        	    }
        	},
        	"formatters": {
        	    "number": [
        	        {
        	        	"columnNum": 1,
        	        	"pattern": "#0 slots"
        	        }
        	    ]
        	},
        	"displayed": true
        };
    
    this.getChartMicroZoneOccupancy = function(lang){
    	if(lang=="ita"){
    		return this.chartMicroZoneOccupancy;
    	} else {
    		return this.chartMicroZoneOccupancy_eng;
    	}
    }; 
    
    this.initMicroZoneOccupancyDiagram = function(zone, type){
    	this.chartMicroZoneOccupancy.data = [["Posti", "num"]];
    	this.chartMicroZoneOccupancy_eng.data = [["Slots", "num"]];
    	var object;
    	if(type == 1){
    		object = zone.data;
    	} else {
    		object = zone;
    	}
    	// ita
  		var dataTot = [ "Liberi", object.slotNumber - object.slotOccupied ];
  		var dataOcc = [ "Occupati", object.slotOccupied ];
  		this.chartMicroZoneOccupancy.data.push(dataTot);
  		this.chartMicroZoneOccupancy.data.push(dataOcc);
  		// eng
  		var dataTot_eng = [ "Free", object.slotNumber - object.slotOccupied ];
  		var dataOcc_eng = [ "Occupied", object.slotOccupied ];
  		this.chartMicroZoneOccupancy_eng.data.push(dataTot_eng);
  		this.chartMicroZoneOccupancy_eng.data.push(dataOcc_eng);
  		this.chartMicroZoneOccupancy.options.title = "Posti occupati in via";
  		this.chartMicroZoneOccupancy_eng.options.title = "Occupied slots in street";
    };    
    
    this.chartAreaOccupancy = this.chart = {
        "type": "PieChart",
        "data": [],
        "options": {
            "displayExactValues": true,
            "width": "100%",
            "height": "100%",
            "is3D": true,
            "legend": {
            	"position": 'top',
            	"textStyle": {"color": 'black', "fontSize" : 10}
            },
            "chartArea": {
              "left": 5,
              "top": 50,
              "bottom": 0,
              "width": "100%",
              "height": "100%"
            }
        },
        "formatters": {
            "number": [
                {
                	"columnNum": 1,
                	"pattern": "#0 posti"
                }
            ]
        },
      	"displayed": true
    };
    
    this.chartAreaOccupancy_eng = this.chart = {
            "type": "PieChart",
            "data": [],
            "options": {
                "displayExactValues": true,
                "width": "100%",
                "height": "100%",
                "is3D": true,
                "legend": {
                	"position": 'top',
                	"textStyle": {"color": 'black', "fontSize" : 10}
                },
                "chartArea": {
                  "left": 5,
                  "top": 50,
                  "bottom": 0,
                  "width": "100%",
                  "height": "100%"
                }
            },
            "formatters": {
                "number": [
                    {
                    	"columnNum": 1,
                    	"pattern": "#0 slots"
                    }
                ]
            },
          	"displayed": true
        };
    
    this.getChartAreaOccupancy = function(lang){
    	if(lang=="ita"){
    		return this.chartAreaOccupancy;
    	} else {
    		return this.chartAreaOccupancy_eng;
    	}
    };     
    
    this.initAreaOccupancyDiagram = function(area, type){
    	this.chartAreaOccupancy.data = [["Posti", "num"]];
    	this.chartAreaOccupancy_eng.data = [["Slots", "num"]];
    	var object;
    	if(type == 1){
    		object = area.data;
    	} else {
    		object = area;
    	}
    	// ita
  		var dataTot = [ "Liberi", object.slotNumber - object.slotOccupied ];
  		var dataOcc = [ "Occupati", object.slotOccupied ];
  		this.chartAreaOccupancy.data.push(dataTot);
  		this.chartAreaOccupancy.data.push(dataOcc);
  		this.chartAreaOccupancy.options.title = "Posti occupati in area";
  		// eng
  		var dataTot_eng = [ "Free", object.slotNumber - object.slotOccupied ];
  		var dataOcc_eng = [ "Occupied", object.slotOccupied ];
  		this.chartAreaOccupancy_eng.data.push(dataTot_eng);
  		this.chartAreaOccupancy_eng.data.push(dataOcc_eng);
  		this.chartAreaOccupancy_eng.options.title = "Street occupied in area";
    };
	
    // ---------------------------------------------- End block Utilization diagrams --------------------------------------
	


}]);