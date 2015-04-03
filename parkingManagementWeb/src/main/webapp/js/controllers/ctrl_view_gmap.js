'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('ViewCtrlGmap',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', 'sharedDataService', 'invokeWSService', 'invokeWSServiceNS', 'invokeWSServiceProxy', //'uiGmapGoogleMapApi', 'uiGmapIsReady',
                          function($scope, $http, $route, $routeParams, $rootScope, localize, sharedDataService, invokeWSService, invokeWSServiceNS, invokeWSServiceProxy, $location, $filter) { // , uiGmapGoogleMapApi, uiGmapIsReady,

	
	$scope.parkingMetersMarkers = [];
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	
	$scope.pmMarkerIcon = "imgs/markerIcons/parcometro.png";			// icon for parkingMeter object
	$scope.psMarkerIcon = "imgs/markerIcons/parcheggioStruttura.png";	// icon for parkingStructure object
	$scope.bpMarkerIcon = "imgs/markerIcons/puntobici.png";				// icon for bikePoint object
	
	$scope.authHeaders = {
	    'Accept': 'application/json;charset=UTF-8'
	};
	
	// ----------------------- Block to read conf params and show/hide elements -----------------------
    var showArea = false;
    var showStreets = false;
    var showPm = false;
    var showPs = false;
    var showBp = false;
    var showZones = false;
    
    $scope.isAreaVisible = function(){
    	return showArea;
    };
    
    $scope.isStreetVisible = function(){
    	return showStreets;
    };

    $scope.isPmVisible = function(){
    	return showPm;
    };

    $scope.isPsVisible = function(){
    	return showPs;
    };
    
    $scope.isBpVisible = function(){
    	return showBp;
    };

    $scope.isZonesVisible = function(){
    	return showZones;
    };
    
    $scope.initComponents = function(value){
    	if(value){
    		showArea = true;
    		showStreets = true;
    		showPm = true;
    		showPs = true;
    		showBp = true;
    		showZones = true;
    	} else {
	    	if($scope.editparktabs == null || $scope.editparktabs.length == 0){
		    	$scope.showedObjects = sharedDataService.getVisibleObjList();
		    	for(var i = 0; i < $scope.showedObjects.length; i++){
		    		if($scope.showedObjects[i].id == 'Area'){
		    			showArea = true;
		    			$scope.loadAreaAttributes($scope.showedObjects[i].attributes);
		    		}
		    		if($scope.showedObjects[i].id == 'Street'){
		    			showStreets = true;
		    			$scope.loadStreetAttributes($scope.showedObjects[i].attributes);
		    		}
		    		if($scope.showedObjects[i].id == 'Pm'){
		    			showPm = true;
		    			$scope.loadPmAttributes($scope.showedObjects[i].attributes);
		    		}
		    		if($scope.showedObjects[i].id == 'Ps'){
		    			showPs = true;
		    			$scope.loadPsAttributes($scope.showedObjects[i].attributes);
		    		}
		    		if($scope.showedObjects[i].id == 'Bp'){
		    			showBp = true;
			    		$scope.loadBikeAttributes($scope.showedObjects[i].attributes);
			    	}
		    		if($scope.showedObjects[i].id == 'Zone'){
		    			showZones = true;
		    			$scope.loadZoneAttributes($scope.showedObjects[i].attributes);
		    		}
		    	}
	    	}
    	}
    };
    
    //Area Component settings
    $scope.loadAreaAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			$scope.a_name = attributes[i];
    		}
    		if(attributes[i].code == 'fee'){
    			$scope.a_fee = attributes[i];
    		}
    		if(attributes[i].code == 'timeSlot'){
    			$scope.a_timeSlot = attributes[i];
    		}
    		if(attributes[i].code == 'smsCode'){
    			$scope.a_smsCode = attributes[i];
    		}
    		if(attributes[i].code == 'color'){
    			$scope.a_color = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			$scope.a_geometry = attributes[i];
    		}
    		
    	}
    };
    
    //Street Component settings
    $scope.loadStreetAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'streetReference'){
    			$scope.s_streetRef = attributes[i];
    		}
    		if(attributes[i].code == 'slotNumber'){
    			$scope.s_slotNum = attributes[i];
    		}
    		if(attributes[i].code == 'handicappedSlotNumber'){
    			$scope.s_handicappedSlot = attributes[i];
    		}
    		if(attributes[i].code == 'timedParkSlotNumber'){
    			$scope.s_timedSlot = attributes[i];
    		}
    		if(attributes[i].code == 'freeParkSlotNumber'){
    			$scope.s_freeSlot = attributes[i];
    		}
    		if(attributes[i].code == 'unusuableSlotNumber'){
    			$scope.s_unusuableSlot = attributes[i];
    		}
    		if(attributes[i].code == 'subscritionAllowedPark'){
    			$scope.s_subscrition = attributes[i];
    		}
    		if(attributes[i].code == 'rateAreaId'){
    			$scope.s_areaId = attributes[i];
    		}
    		if(attributes[i].code == 'zones'){
    			$scope.s_zones = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			$scope.s_geometry = attributes[i];
    		}
    	}
    };
    
    //Pm Component settings
    $scope.loadPmAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'code'){
    			$scope.pm_code = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			$scope.pm_note = attributes[i];
    		}
    		if(attributes[i].code == 'status'){
    			$scope.pm_status = attributes[i];
    		}
    		if(attributes[i].code == 'rateArea'){
    			$scope.pm_rateArea = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			$scope.pm_geometry = attributes[i];
    		}
    	}
    };
    
    //Ps Component settings
    $scope.loadPsAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			$scope.ps_name = attributes[i];
    		}
    		if(attributes[i].code == 'streetReference'){
    			$scope.ps_address = attributes[i];
    		}
    		if(attributes[i].code == 'managementMode'){
    			$scope.ps_management = attributes[i];
    		}
    		if(attributes[i].code == 'paymentMode'){
    			$scope.ps_payment = attributes[i];
    		}
    		if(attributes[i].code == 'fee'){
    			$scope.ps_fee = attributes[i];
    		}
    		if(attributes[i].code == 'timeSlot'){
    			$scope.ps_timeSlot = attributes[i];
    		}
    		if(attributes[i].code == 'slotNumber'){
    			$scope.ps_slotNumber = attributes[i];
    		}
    		if(attributes[i].code == 'handicappedSlotNumber'){
    			$scope.ps_handicappedSlot = attributes[i];
    		}
    		if(attributes[i].code == 'unusuableSlotNumber'){
    			$scope.ps_unusuableSlot = attributes[i];
    		}
    		if(attributes[i].code == 'phoneNumber'){
    			$scope.ps_phoneNumber = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			$scope.ps_geometry = attributes[i];
    		}
    	}
    };
    
    //BikePoint Component settings
    $scope.loadBikeAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			$scope.bp_name = attributes[i];
    		}
    		if(attributes[i].code == 'bikeNumber'){
    			$scope.bp_bikeNumber = attributes[i];
    		}
    		if(attributes[i].code == 'slotNumber'){
    			$scope.bp_slotNumber = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			$scope.bp_geometry = attributes[i];
    		}
    	}
    };
    
    //Zones Component settings
    $scope.loadZoneAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			$scope.zone_name = attributes[i];
    		}
    		if(attributes[i].code == 'submacro'){
    			$scope.zone_submacro = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			$scope.zone_note = attributes[i];
    		}
    		if(attributes[i].code == 'status'){
    			$scope.zone_status = attributes[i];
    		}
    		if(attributes[i].code == 'type'){
    			$scope.zone_type = attributes[i];
    		}
    		if(attributes[i].code == 'color'){
    			$scope.zone_color = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			$scope.zone_geometry = attributes[i];
    		}
    	}
    };
    // ---------------------- End Block to read conf params and show/hide elements ---------------------
	
	$scope.cash_mode = "CASH";
    $scope.automated_teller_mode = "AUTOMATED_TELLER";
    $scope.prepaid_card_mode = "PREPAID_CARD";
    $scope.parcometro = "PARCOMETRO";
    
	$scope.listaPagamenti = [
	    {
	         idObj: $scope.cash_mode,
	         descrizione: "Contanti"
	    },
	    {
	         idObj: $scope.automated_teller_mode,
	         descrizione: "Cassa automatica"
	    },
	    {
	         idObj: $scope.prepaid_card_mode,
	         descrizione: "Carta prepagata"
	    },
	    {
	         idObj: $scope.parcometro,
	         descrizione: "Parcometro"
	    }
	];
	
	$scope.mapCenter = {
		latitude: 45.88875357753771,
	    longitude: 11.037440299987793
	};
	
	$scope.mapOption = {
		center : sharedDataService.getConfMapCenter(),	//"[" + $scope.mapCenter.latitude + "," + $scope.mapCenter.longitude + "]",
		zoom : parseInt(sharedDataService.getConfMapZoom())
	};
	
	
	$scope.initPage = function(){
		$scope.mapelements = {
			rateareas : false,
			streets : true,
			parkingmeters : true,
			parkingstructs : false,
			bikepoints : false,
			zones : false
		};
		
	};
	
	// ------------------------------- Utility methods ----------------------------------------
	$scope.correctColor = function(value){
		return "#" + value;
	};
	
	$scope.correctPointGoogle = function(point){
		return point.lat + "," + point.lng;
	};
	
	$scope.correctPoints = function(points){
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
	
	$scope.correctPointsGoogle = function(points){
		var corr_points = "[";
		for(var i = 0; i < points.length; i++){
			var point = "[ " + points[i].lat + "," + points[i].lng + "]";
			corr_points = corr_points +point + ",";
		}
		corr_points = corr_points.substring(0, corr_points.length-1);
		corr_points = corr_points + "]";
		return corr_points;
	};
	
	$scope.correctMyGeometryPolygon = function(geo){
		var tmpPolygon = {
			points: null,
		};
		var points = [];
		for(var i = 0; i < geo.points.length; i++){
			var tmpPoint = geo.points[i];
			points.push(tmpPoint);
		}
		
		tmpPolygon.points = points;

		return tmpPolygon;
	};
	
	$scope.correctMyZones = function(zones){
		var correctedZones = [];
		for(var i = 0; i < zones.length; i++){
			var correctZone = {
					id: zones[i].id,
					id_app: zones[i].id_app,
					color: zones[i].color,
					name: zones[i].name,
					submacro: zones[i].submacro,
					type: zones[i].type,
					note: zones[i].note,
					geometry: $scope.correctMyGeometryPolygon(zones[i].geometry)
			};
			correctedZones.push(correctZone);
		}
		return correctedZones;
	};
	
	$scope.castMyPaymentModeToString = function(myPm){
		var correctedPm = "";
		for(var i = 0; i < myPm.length; i++){
			var stringVal = "";
			switch (myPm[i]){
				case $scope.cash_mode : 
					stringVal = $scope.listaPagamenti[0].descrizione;
					break;
				case $scope.automated_teller_mode: 
					stringVal = $scope.listaPagamenti[1].descrizione;
					break;
				case $scope.prepaid_card_mode: 
					stringVal = $scope.listaPagamenti[2].descrizione;
					break;
				case $scope.parcometro: 
					stringVal = $scope.listaPagamenti[3].descrizione;
					break;
				default: break;
			}
			correctedPm = correctedPm + stringVal + ",";
		}
		correctedPm = correctedPm.substring(0, correctedPm.length-1);
		return correctedPm;
	};
	
	// ----------------------------------------------------------------------------------------------
	
	$scope.initMap = function(pmMarkers, psMarkers, bpMarkers){
		
		$scope.options = {
		    scrollwheel: true
		};
		
		if(pmMarkers!= null){
			$scope.mapParkingMetersMarkers = pmMarkers;
		} else {
			$scope.mapParkingMetersMarkers = [];
		}
		if(psMarkers != null){
			$scope.mapParkingStructureMarkers = psMarkers;
		} else {
			$scope.mapParkingStructureMarkers = [];
		}
		if(bpMarkers != null){
			$scope.mapBikePointMarkers = bpMarkers;
		} else {
			$scope.mapBikePointMarkers = [];
		}
		//$scope.addMarkerToMap($scope.map);
		$scope.mapReady = true;
		//$scope.$apply();
	};
	
	$scope.addMarkerToMap = function(map){
		if($scope.parkingMetersMarkers != null){
			for(var i = 0; i < $scope.parkingMetersMarkers.length; i++){
				$scope.parkingMetersMarkers[i].options.map = map;
			}
		}
		if($scope.parkingStructureMarkers != null){
			for(var i = 0; i < $scope.parkingStructureMarkers.length; i++){
				$scope.parkingStructureMarkers[i].options.map = map;
			}
		}
		if($scope.bikePointMarkers != null){
			for(var i = 0; i < $scope.bikePointMarkers.length; i++){
				$scope.bikePointMarkers[i].options.map = map;
			}
		}
	};
	
	// Show/hide parkingMeters markers
	$scope.changeParkingMetersMarkers = function(){
		if(!$scope.mapelements.parkingmeters){
			$scope.showParkingMetersMarkers();
		} else {
			$scope.hideParkingMetersMarkers();
		}
	};

	$scope.showParkingMetersMarkers = function() {
        $scope.mapParkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true);
        //$scope.refreshMap();
    };
    
    $scope.hideParkingMetersMarkers = function() {
    	$scope.mapParkingMetersMarkers = []; //$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide parkingStructures markers
    $scope.changeParkingStructuresMarkers = function(){
		if(!$scope.mapelements.parkingstructs){
			$scope.showParkingStructuresMarkers();
		} else {
			$scope.hideParkingStructuresMarkers();
		}
	};
    
    $scope.showParkingStructuresMarkers = function() {
        $scope.mapParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true);
        //$scope.refreshMap();
    };
    
    $scope.hideParkingStructuresMarkers = function() {
    	$scope.mapParkingStructureMarkers = []; //$scope.setAllMarkersMap($scope.parkinStructureMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide bikePoints markers
    $scope.changeBikePointsMarkers = function(){
		if(!$scope.mapelements.bikepoints){
			$scope.showBikePointsMarkers();
		} else {
			$scope.hideBikePointsMarkers();
		}
	};
    
    $scope.showBikePointsMarkers = function() {
        $scope.mapBikePointMarkers = $scope.setAllMarkersMap($scope.bikePointMarkers, $scope.map, true);
        //$scope.refreshMap();
    };
    
    $scope.hideBikePointsMarkers = function() {
    	$scope.mapBikePointMarkers = [];//$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide areas polygons
    $scope.changeAreaPolygons = function(){
		if(!$scope.mapelements.rateareas){
			$scope.showAreaPolygons();
		} else {
			$scope.hideAreaPolygons();
		}
	};
    
    $scope.showAreaPolygons = function() {
    	$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true);
        //$scope.refreshMap();
    };
    
    $scope.hideAreaPolygons = function() {
    	$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, false);
    	$scope.hideAllAreas();
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide zones polygons
    $scope.changeZonePolygons = function(){
		if(!$scope.mapelements.zones){
			$scope.showZonePolygons();
		} else {
			$scope.hideZonePolygons();
		}
	};
    
    $scope.showZonePolygons = function() {
    	$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true);
        //$scope.refreshMap();
    };
    
    $scope.hideZonePolygons = function() {
    	$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, false);
    	$scope.hideAllZones();
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide streets polygons
    $scope.changeStreetPolylines = function(){
		if(!$scope.mapelements.streets){
			$scope.showStreetPolylines();
		} else {
			$scope.hideStreetPolylines();
		}
	};
    
    $scope.showStreetPolylines = function() {
    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true);
        //$scope.refreshMap();
    };
    
    $scope.hideStreetPolylines = function() {
    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, false);
    	$scope.hideAllStreets();
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    $scope.hideAllStreets = function(){
    	var toDelStreet = $scope.map.shapes;
    	for(var i = 0; i < $scope.mapStreets.length; i++){
    		toDelStreet[$scope.mapStreets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
    	}
    };
    
    $scope.hideAllZones = function(){
    	var toDelZones = $scope.map.shapes;
    	for(var i = 0; i < $scope.mapZones.length; i++){
    		toDelZones[$scope.mapZones[i].id].setMap(null);		// I can access dinamically the value of the object shapes for zones
    	}
    };
    
    $scope.hideAllAreas = function(){
    	var toDelAreas = $scope.map.shapes;
    	for(var i = 0; i < $scope.mapAreas.length; i++){
    		toDelAreas[$scope.mapAreas[i].id].setMap(null);		// I can access dinamically the value of the object shapes for zones
    	}
    };
    
    $scope.setAllMarkersMap = function(markers, map, visible){
    	for(var i = 0; i < markers.length; i++){
    		markers[i].options.visible = visible;
    		markers[i].options.map = map;
    	}
    	return markers;
    };
    
    $scope.refreshMap = function() {
        //optional param if you want to refresh you can pass null undefined or false or empty arg
        $scope.map.control.refresh($scope.mapCenter);
        //$scope.map.control.refresh(null);
        $scope.map.control.getGMap().setZoom(5);
        $scope.map.control.getGMap().setZoom(14);
    };
	
	var createMarkers = function(i, marker, type) {
		//------ To be configured in external conf file!!!!!------
		var company = "amr";
		var baseUrl = "http://localhost:8080/parking-management/rest/nosec/";
		var defaultMarkerColor = "FF0000";
		//--------------------------------------------------------
		
		var myIcon = "";
		var myAreaPm = {};
		var cid = "";
		switch(type){
			case 1 : 
				//myIcon = $scope.pmMarkerIcon;
				myAreaPm = $scope.getLocalAreaById(marker.areaId);
				myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
				cid = "c" + marker.id;
				break;
			case 2 : 
				myIcon = $scope.psMarkerIcon; 
				break;
			case 3 :
				myIcon = $scope.bpMarkerIcon;
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
				area: myAreaPm,
				icon: myIcon,
				showWindow: false
			};
			ret.closeClick = function () {
		        ret.showWindow = false;
		        //$scope.$apply();
		    };
		    ret.onClick = function () {
		    	console.log("I am in ret marker click event function: " + ret.data.code);
		    	ret.showWindow = !ret.showWindow;
		    };
		}
		return ret;
	};
	  
	$scope.initAreasOnMap = function(areas, visible){
		var area = {};
		var poligons = {};
		var tmpAreas = [];
		
		if(areas != null){
			for(var i = 0; i < areas.length; i++){
				if(areas[i].geometry != null){
					poligons = areas[i].geometry;
					area = {
						id: areas[i].id,
						path: $scope.correctPoints(poligons[0].points),
						gpath: $scope.correctPointsGoogle(poligons[0].points),
						stroke: {
						    color: $scope.correctColor(areas[i].color),
						    weight: 3
						},
						data: areas[i],
						info_windows_pos: $scope.correctPointGoogle(poligons[0].points[1]),
						info_windows_cod: "a" + areas[i].id,
						editable: true,
						draggable: true,
						geodesic: false,
						visible: visible,
						fill: {
						    color: $scope.correctColor(areas[i].color),
						    opacity: 0.7
						}
					};
					tmpAreas.push(area);
				}
			}
		}
		return tmpAreas;
	};
	
	$scope.initStreetsOnMap = function(streets, visible){
		var street = {};
		var poligons = {};
		var tmpStreets = [];
		
		for(var i = 0; i < streets.length; i++){
			var myAreaS = $scope.getLocalAreaById(streets[i].rateAreaId);
			var myZones = [];
			for(var j = 0; j < streets[i].zones.length; j++){
				var zone = $scope.getLocalZoneById(streets[i].zones[j]);
				myZones.push(zone);
			}
			if(streets[i].geometry != null){
				poligons = streets[i].geometry;
				street = {
					id: streets[i].id,
					path: $scope.correctPoints(poligons.points),
					gpath: $scope.correctPointsGoogle(poligons.points),
					stroke: {
					    color: $scope.correctColor(streets[i].color),
					    weight: (visible) ? 3 : 0
					},
					data: streets[i],
					area: myAreaS,
					zones: myZones,
					info_windows_pos: $scope.correctPointGoogle(poligons.points[1]),
					info_windows_cod: "s" + streets[i].id,
					editable: false,
					draggable: false,
					geodesic: false,
					visible: visible
					//icons:
				};
				//street.setMap($scope.map);
				tmpStreets.push(street);
			}
		}
		return tmpStreets;
	};
	
	$scope.initZonesOnMap = function(zones, visible){
		var zone = {};
		var poligons = {};
		var tmpZones = [];
		
		for(var i = 0; i < zones.length; i++){
			if(zones[i].geometry != null){
				poligons = zones[i].geometry;
				zone = {
					id: zones[i].id,
					path: $scope.correctPoints(poligons.points),
					gpath: $scope.correctPointsGoogle(poligons.points),
					stroke: {
					    color: $scope.correctColor(zones[i].color),
					    weight: 3
					},
					data: zones[i],
					info_windows_cod: "z" + zones[i].id,
					info_windows_pos: $scope.correctPointGoogle(poligons.points[1]),
					editable: true,
					draggable: true,
					geodesic: false,
					visible: visible,
					fill: {
					    color: $scope.correctColor(zones[i].color),
					    opacity: 0.7
					}
				};
				tmpZones.push(zone);
			}
		}
		return tmpZones;
	};
	
	$scope.initStreetsObjects = function(streets){
		var myStreets = [];
		for(var i = 0; i < streets.length; i++){
			var zones = [];
			for(var j = 0; j < streets[i].zones.length; j++){
				var zone = $scope.getLocalZoneById(streets[i].zones[j]);
				zones.push(zone);
			}
			var area = $scope.getLocalAreaById(streets[i].rateAreaId);
			var mystreet = streets[i];
			mystreet.area_name = area.name;
			mystreet.area_color= area.color;
			mystreet.myZones = zones;
			myStreets.push(mystreet);
		}
		return myStreets;
	};
	
	$scope.getLocalAreaById = function(id){
		var find = false;
		var myAreas = sharedDataService.getSharedLocalAreas();
		for(var i = 0; i < myAreas.length && !find; i++){
			if(myAreas[i].id == id){
				find = true;
				return myAreas[i];
			}
		}
	};
	
	$scope.getLocalZoneById = function(id){
		var find = false;
		var myZones = sharedDataService.getSharedLocalZones();
		for(var i = 0; i < myZones.length && !find; i++){
			if(myZones[i].id == id){
				find = true;
				return myZones[i];
			}
		}
	};
	
	$scope.initWs = function(value){
		$scope.parkingMetersMarkers = [];
		$scope.parkingStructureMarkers = [];
	   	$scope.initPage();
	   	$scope.initComponents(value);
		$scope.mapReady = false;
		$scope.getAreasFromDb();
	};
	
	 $scope.getAreasFromDb = function(){
		if(showArea){
		    $scope.areaMapReady = false;
			var allAreas = [];
			var method = 'GET';
				
			//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, null);
			var myDataPromise = invokeWSServiceNS.getProxy(method, "area", null, $scope.authHeaders, null);
			myDataPromise.then(function(result){
				angular.copy(result, allAreas);
				console.log("rateAreas retrieved from db: " + JSON.stringify(result));
			    	
			   	$scope.areaWS = allAreas;
			    $scope.initAreasOnMap($scope.areaWS, false);
			   	//$scope.hideAreaPolygons();
			   	
			    sharedDataService.setSharedLocalAreas($scope.areaWS);
			    $scope.getParkingMetersFromDb();
			});
		} else {
			$scope.getParkingMetersFromDb();
		}
	};
	
	$scope.getStreetsFromDb = function(){
		if(showStreets){
			$scope.streetMapReady = false;
			var allStreet = [];
			var method = 'GET';
			
		   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		   	var myDataPromise = invokeWSServiceNS.getProxy(method, "street", null, $scope.authHeaders, null);
		    myDataPromise.then(function(result){
		    	angular.copy(result, allStreet);
		    	console.log("streets retrieved from db: " + JSON.stringify(result));
		    	
		    	$scope.streetWS = $scope.initStreetsObjects(allStreet);
		    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true);
		    });
		}
	};
		    
    $scope.getParkingMetersFromDb = function(){
    	if(showPm){
	    	var markers = [];
			var allParkingMeters = [];
			var method = 'GET';
			
		   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter", null, $scope.authHeaders, null);
		   	var myDataPromise = invokeWSServiceNS.getProxy(method, "parkingmeter", null, $scope.authHeaders, null);
		    myDataPromise.then(function(result){
		    	angular.copy(result, allParkingMeters);
		    	console.log("Parking Meters retrieved from db: " + JSON.stringify(result));
		    	//$scope.addParkingMetersMarkers(allParkingMeters);
		    	
		    	for (var i = 0; i <  allParkingMeters.length; i++) {
		    		markers.push(createMarkers(i, allParkingMeters[i], 1));
			    }
		    	angular.copy(markers, $scope.parkingMetersMarkers);
		    	//$scope.parkingMetersMarkers = $scope.initPMObjects(allPmeters);
		    	$scope.getParkingStructuresFromDb();
		    });
    	} else {
    		$scope.getParkingStructuresFromDb();
    	}
	};
	
	$scope.getParkingStructuresFromDb = function(){
		if(showPs){
			var markers = [];
			var allParkingStructures = [];
			var method = 'GET';
			
		   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure", null, $scope.authHeaders, null);
		   	var myDataPromise = invokeWSServiceNS.getProxy(method, "parkingstructure", null, $scope.authHeaders, null);
		    myDataPromise.then(function(result){
		    	angular.copy(result, allParkingStructures);
		    	console.log("Parking Structures retrieved from db: " + JSON.stringify(result));
		    	for (var i = 0; i <  allParkingStructures.length; i++) {
		    		markers.push(createMarkers(i, allParkingStructures[i], 2));
			    }
		    	angular.copy(markers, $scope.parkingStructureMarkers);
		    	$scope.getBikePointFromDb();
		    });
		} else {
			$scope.getBikePointFromDb();
		}
	};
	
	$scope.getBikePointFromDb = function(){
		if(showBp){
			var markers = [];
			var allBikePoints = [];
			var method = 'GET';
			
			//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint", null, $scope.authHeaders, null);
		   	var myDataPromise = invokeWSServiceNS.getProxy(method, "bikepoint", null, $scope.authHeaders, null);
		    myDataPromise.then(function(result){
		    	angular.copy(result, allBikePoints);
		    	console.log("BikePoints retrieved from db: " + JSON.stringify(result));
		    	for (var i = 0; i <  allBikePoints.length; i++) {
		    		markers.push(createMarkers(i, allBikePoints[i], 3));
			    }
		    	angular.copy(markers, $scope.bikePointMarkers);
		    	//$scope.initMap($scope.parkingMetersMarkers, $scope.parkingStructureMarkers, $scope.bikePointMarkers);
		    	$scope.initMap($scope.parkingMetersMarkers, null, null);
		    	$scope.getZonesFromDb();
		    });
		} else {
			$scope.getZonesFromDb();
		}
	};
	
	$scope.getZonesFromDb = function(){
		if(showZones){
			$scope.zoneMapReady = false;
			var allZones = [];
			var method = 'GET';
			
			//var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone", null, $scope.authHeaders, null);
		   	var myDataPromise = invokeWSServiceNS.getProxy(method, "zone", null, $scope.authHeaders, null);
		    myDataPromise.then(function(result){
		    	angular.copy(result, allZones);
		    	console.log("Zone retrieved from db: " + JSON.stringify(result));
		    	
		    	$scope.zoneWS = $scope.correctMyZones(allZones);
		    	sharedDataService.setSharedLocalZones($scope.zoneWS);
		    	$scope.initZonesOnMap($scope.zoneWS, false);
		    	$scope.getStreetsFromDb();
		    });
		} else {
			$scope.getStreetsFromDb();
		}
	};
	
	
	
}]);