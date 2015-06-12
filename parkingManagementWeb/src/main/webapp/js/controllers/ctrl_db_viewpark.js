'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers', ['googlechart','angularAwesomeSlider']);
pm.controller('TimeFilterCtrl',['$scope', '$route', '$rootScope','$filter', 'localize',
                                function($scope, $route, $$rootScope, $filter, localize) {
	
	$scope.vis = 'vis_last_value';
	$scope.visOptions = ['vis_last_value','vis_medium', 'vis_medium_year', 'vis_medium_month', 'vis_medium_day'];
	var date = new Date();
	$scope.years = [];
	$scope.year = "";
	$scope.dayOptions = {value:'wd'};
	$scope.hourOptions = {value:'morning'};
	
	for (var i = 0; i < 5; i++) {
		$scope.years.push('' + date.getFullYear()-i);
	}
	var initialMonth = (date.getMonth() == 0 ? date.getMonth()+1 : date.getMonth());
	var endMonth = (date.getMonth()+1);
	$scope.monthSliderValue = "" + initialMonth +";"+endMonth + "";
	$scope.monthSliderOptions = {       
		    from: 1,
		    to: 12,
		    step: 1,
		    modelLabels: {'1': 'GE', '2': 'FE', '3': 'MA', '4': 'AP', '5': 'MA', '6': 'GI', '7':'LU', '8': 'AG', '9': 'SE', '10': 'OT', '11': 'NO', '12': 'DI'}
	};
	$scope.daySliderValue = (date.getDay() == 0 ? date.getDay() : date.getDay()-1)+";"+(date.getDay());
	$scope.daySliderOptions = {       
		    from: 1,
		    to: 7,
		    step: 1,
		    modelLabels: {'1': 'LU', '2': 'MA', '3': 'ME', '4': 'GI', '5': 'VE', '6': 'SA', '7':'DO'}
	};
	$scope.hourSliderValue = "10;12";
	$scope.hourSliderOptions = {
		    from: 0,
		    to: 23,
		    step: 1
	};
	
	$scope.updateYear = function(value){
		$scope.year = value;
		$scope.updateSearch();
	};
	
	$scope.updateMonth = function(value){
		$scope.monthSliderValue = value;
		$scope.updateSearch();
	};
	
	$scope.updateDay = function(value){
		$scope.daySliderValue = value;
		$scope.updateSearch();
	};
	
	$scope.updateHour = function(value){
		$scope.hourSliderValue = value;
		$scope.updateSearch();
	};
	
	$scope.updateSearch = function(){
	    console.log("Visualizzazione: " + $scope.vis);
	    console.log("Anno: " + $scope.year);
	    console.log("Mesi: " + $scope.monthSliderValue);
	    console.log("Giorno - tipo: " + $scope.dayOptions.value);
	    console.log("Giorni: " + $scope.daySliderValue);
	    var d = new Date();	// I retrieve the actual date
	    var weekDay = d.getDay() + 1; // In java calendar the weekday are from 1 to 7, in javascript from 0 to 6;
	    if($scope.hourOptions.value != "custom"){
	    	switch ($scope.hourOptions.value){
	    		case "morning": $scope.hourSliderValue = "10;12";
	    			break;
	    		case "afternoon": $scope.hourSliderValue = "14;18";
    				break;	
	    		case "night": $scope.hourSliderValue = "20;23";
					break;
 	    	}	
	    }
	    console.log("Fascia oraria: " + $scope.hourSliderValue);
	    
	    switch($scope.vis){
	    	case "vis_last_value": 
	    		$scope.getOccupancyStreetsFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1);
	    		$scope.getOccupancyParksFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, 2);
	    		break;
	    	case "vis_medium":
	    		$scope.getOccupancyStreetsFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2);
	    		$scope.getOccupancyParksFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2);
	    		break;
	    	case "vis_medium_year":
	    		$scope.getOccupancyStreetsFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2);
	    		$scope.getOccupancyParksFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2);
	    		break;
	    	case "vis_medium_month":
	    		$scope.getOccupancyStreetsFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2);
	    		$scope.getOccupancyParksFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2);
	    		break;
	    	case "vis_medium_day":
	    		$scope.getOccupancyStreetsFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2);
	    		$scope.getOccupancyParksFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2, 2);
	    		break;
	    	default: break;	
	    }
	};

}]);

pm.controller('ViewDashboardCtrlPark',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', 'sharedDataService', 'invokeDashboardWSService', 'invokeDashboardWSServiceNS', 'invokeWSServiceProxy', 
                          function($scope, $http, $route, $routeParams, $rootScope, localize, sharedDataService, invokeDashboardWSService, invokeDashboardWSServiceNS, invokeWSServiceProxy, $location, $filter) {

	$scope.disableThemes = false;	//Used to disable/enable themes buttons selection 
	
	$scope.parkingMetersMarkers = [];
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	$scope.mapParkingMetersMarkers = [];
	$scope.mapParkingStructureMarkers = [];
	$scope.mapBikePointMarkers = [];
	$scope.streetWS = [];
	$scope.mapStreets = [];
	$scope.mapZones = [];
	$scope.mapAreas = [];
	
	$scope.occupancyStreets = [];
	$scope.occupancyAreas = [];
	$scope.occupancyZones = [];
	$scope.occupancyParkingMeterMarkers = [];
	$scope.occupancyParkingStructureMarkers = [];
	
	$scope.lightgray = "#B0B0B0";//"#81EBBA";
	$scope.green = "#31B404";
	$scope.yellow = "#F7FE2E";
	$scope.orange = "#FF8000";
	$scope.red = "#DF0101";
	$scope.violet = "#8904B1";
	
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
    
    $scope.initComponents = function(){
	    if($scope.editparktabs == null || $scope.editparktabs.length == 0){
		   	$scope.showedObjects = sharedDataService.getVisibleObjList();
		   	for(var i = 0; i < $scope.showedObjects.length; i++){
		   		if($scope.showedObjects[i].id == 'Area'){
		   			$scope.loadAreaAttributes($scope.showedObjects[i].attributes);
		   		}
		   		if($scope.showedObjects[i].id == 'Street'){
		   			$scope.loadStreetAttributes($scope.showedObjects[i].attributes);
		   		}
		   		if($scope.showedObjects[i].id == 'Pm'){
		   			$scope.loadPmAttributes($scope.showedObjects[i].attributes);
		   		}
		   		if($scope.showedObjects[i].id == 'Ps'){
		   			$scope.loadPsAttributes($scope.showedObjects[i].attributes);
		   		}
		   		if($scope.showedObjects[i].id == 'Bp'){
		    		$scope.loadBikeAttributes($scope.showedObjects[i].attributes);
		    	}
		   		if($scope.showedObjects[i].id == 'Zone'){
		   			$scope.loadZoneAttributes($scope.showedObjects[i].attributes);
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
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				showArea = true;
    			}
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
    		if(attributes[i].code == 'pms'){
    			$scope.s_pms = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			$scope.s_geometry = attributes[i];
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				showStreets = true;
    			}
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
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				showPm = true;
    			}
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
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				showPs = true;
    			}
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
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				showBp = true;
    			}
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
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				showZones = true;
    			}
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
		//$scope.mapelements = {
		//	rateareas : false,
		//	streets : true,
		//	parkingmeters : true,
		//	parkingstructs : false,
		//	bikepoints : false,
		//	zones : false
		//};
		
		$scope.dashboard_space = {
			rate_area : false,
			macrozone : false,
			microzone : true,
			parkingmeter : false,
			parkingstructs : false
		};
		
		
		$scope.dashboard_topics = "parkSupply";
//		{
//			parkSupply : true,
//			occupation : false,
//			receipts : false,
//			timeCost : false,
//			pr : false,
//			budget : false
//		};
		
	};
	
	$scope.changeDashboardView = function(){
		switch($scope.dashboard_topics){
			case "parkSupply": 
				// Show parkingManagement objects
				$scope.switchStreetMapObject(2, null);
				$scope.switchZoneMapObject(2, null);
				$scope.switchAreaMapObject(2, null);
				$scope.switchParkingMapObject(2, null);
				break;
			case "occupation": 
				// Show occupation objects (with specifics colors)
				$scope.switchStreetMapObject(1, null);
				$scope.switchZoneMapObject(1, null);
				$scope.switchAreaMapObject(1, null);
				$scope.switchParkingMapObject(1, null);
				break;
			case "receipts": 
				break;
			case "timeCost": 
				break;
			case "pr": 
				break;
			case "budget": 
				break;
		}
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
		if(!$scope.dashboard_space.parkingmeter){ //$scope.mapelements.parkingmeters
			$scope.showParkingMetersMarkers();
		} else {
			$scope.hideParkingMetersMarkers();
		}
	};

	$scope.showParkingMetersMarkers = function() {
        $scope.mapParkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true,1);
        //$scope.refreshMap();
    };
    
    $scope.hideParkingMetersMarkers = function() {
    	$scope.mapParkingMetersMarkers = []; //$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide parkingStructures markers
    $scope.changeParkingStructuresMarkers = function(dashboardTopic){
    	//if(!$scope.mapelements.parkingstructs){
    	if(dashboardTopic == "parkSupply"){
    		if(!$scope.dashboard_space.parkingstructs){
    			$scope.showParkingStructuresMarkers(1);
			} else {
				$scope.hideParkingStructuresMarkers(1);
			}
    	} else {
    		if(!$scope.dashboard_space.parkingstructs){
    			$scope.showParkingStructuresMarkers(2);
			} else {
				$scope.hideParkingStructuresMarkers(2);
			}
    	}
	};
    
    $scope.showParkingStructuresMarkers = function(type) {
        if(type == 1){
        	$scope.mapParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        } else {
        	$scope.occupancyParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        }
    };
    
    $scope.hideParkingStructuresMarkers = function(type) {
    	if(type == 1){
    		$scope.mapParkingStructureMarkers = []; //$scope.setAllMarkersMap($scope.parkinStructureMarkers, null, false);
    	} else {
    		$scope.occupancyParkingStructureMarkers = [];
    	}
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
        $scope.mapBikePointMarkers = $scope.setAllMarkersMap($scope.bikePointMarkers, $scope.map, true, 1);
        //$scope.refreshMap();
    };
    
    $scope.hideBikePointsMarkers = function() {
    	$scope.mapBikePointMarkers = [];//$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide areas polygons
    $scope.changeAreaPolygons = function(dashboardTopic){
		//if(!$scope.mapelements.rateareas){
    	if(dashboardTopic == "parkSupply"){
			if(!$scope.dashboard_space.rate_area){
				$scope.showAreaPolygons(1);
			} else {
				$scope.hideAreaPolygons(1);
			}
    	} else {
    		if(!$scope.dashboard_space.rate_area){
				$scope.showAreaPolygons(2);
			} else {
				$scope.hideAreaPolygons(2);
			}
    	}
	};
    
    $scope.showAreaPolygons = function(type) {
    	if(type == 1){
    		$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true, type);
    	} else {
    		if($scope.occupancyAreas.length == 0){
    			$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, true, type, true);
    		} else {
    			$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, true, type, false);
    		}
    	}
    	//$scope.refreshMap();
    };
    
    // Method correctAreaId: used to add new areaMap object when an area is composed (more than one geometry object)
    $scope.correctAreaId = function(id, i){
		if(i == 0){
			return id;
		} else {
			return id + '_' + i;
		}
	};
	
	// Method cleanAreaId : used to get the correct areaId from a composed areaMap object id ( with "_")
	$scope.cleanAreaId = function(id){
		var indexUnderScore = id.indexOf("_");
		if( indexUnderScore > -1){
			return (id.substring(0, indexUnderScore));
		}
		return id;
	};
    
    $scope.hideAreaPolygons = function(type) {
    	if(type == 1){
    		$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, false, type, false);
    	} else {
    		$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, false, type, false);
    	}
    	$scope.hideAllAreas($scope.areaWS);

    };
    
    // Show/hide zones polygons
    $scope.changeZonePolygons = function(dashboardTopic){
		//if(!$scope.mapelements.zones){
    	if(dashboardTopic == "parkSupply"){
	    	if(!$scope.dashboard_space.macrozone){
				$scope.showZonePolygons(1);
			} else {
				$scope.hideZonePolygons(1);
			}
    	} else {
    		if(!$scope.dashboard_space.macrozone){
				$scope.showZonePolygons(2);
			} else {
				$scope.hideZonePolygons(2);
			}
    	}
	};
    
    $scope.showZonePolygons = function(type) {
    	if(type == 1){
    		$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true, type, false);
    	} else {
    		if($scope.occupancyZones.length == 0){
    			$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, true, type, true);
    		} else {
    			$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, true, type, false);
    		}
    	}
    };
    
    $scope.hideZonePolygons = function(type) {
    	if(type == 1){
    		$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, false, type, false);
    	} else {
    		$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, false, type, false);
    	}
    	$scope.hideAllZones();
    };
    
    // Show/hide streets polygons
    $scope.changeStreetPolylines = function(dashboardTopic){
		//if(!$scope.mapelements.streets){
    	if(!$scope.dashboard_space.microzone){
    		if(dashboardTopic == "parkSupply"){
    			$scope.showStreetPolylines(1);
    		} else if(dashboardTopic == "occupation"){
    			$scope.showStreetPolylines(2);
    		}
		} else {
			if(dashboardTopic == "parkSupply"){
				$scope.hideStreetPolylines(1);
    		} else if(dashboardTopic == "occupation"){
    			$scope.hideStreetPolylines(2);
    		}
		}
	};
    
    $scope.showStreetPolylines = function(type) {
    	if(type == 1){
    		$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true, type);
    		//$scope.switchStreetMapObject();
    	} else {
    		$scope.occupancyStreets = $scope.initStreetsOnMap($scope.streetWS, true, type);
    	}
    	//$scope.refreshMap();
    };
    
    $scope.hideStreetPolylines = function(type) {
    	if(type == 1){
    		$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, false, type);
    	} else {
    		$scope.occupancyStreets = $scope.initStreetsOnMap($scope.streetWS, false, type);
    	}
    	$scope.hideAllStreets();
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    $scope.hideAllStreets = function(){
    	var toDelStreet = $scope.map.shapes;
	    for(var i = 0; i < $scope.mapStreets.length; i++){
	    	toDelStreet[$scope.mapStreets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
	    }
    	for(var i = 0; i < $scope.occupancyStreets.length; i++){
	    	toDelStreet[$scope.occupancyStreets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
	    }
    };
    
    // Show/hide areas and zones polygons
    $scope.changeAreaAndZonePolygons = function(){
		if(!$scope.dashboard_space.macrozone){
			$scope.showAreaPolygons();
			$scope.showZonePolygons();
		} else {
			$scope.hideAreaPolygons();
			$scope.hideZonePolygons();
		}
	};
    
    // Show/hide streets polygons and parking struct
    $scope.changeStreetAndPS = function(){
    	if(!$scope.dashboard_space.microzone){
			$scope.showStreetPolylines();
			$scope.showParkingStructuresMarkers();
		} else {
			$scope.hideStreetPolylines();
			$scope.hideParkingStructuresMarkers();
		}
	};
    
    $scope.hideAllZones = function(){
    	var toDelZones = $scope.map.shapes;
    	for(var i = 0; i < $scope.mapZones.length; i++){
    		toDelZones[$scope.mapZones[i].id].setMap(null);		// I can access dinamically the value of the object shapes for zones
    	}
    	for(var i = 0; i < $scope.occupancyZones.length; i++){
    		toDelZones[$scope.occupancyZones[i].id].setMap(null);		// I can access dinamically the value of the object shapes for zones
    	}
    };
    
    $scope.hideAllAreas = function(areas){
//    	var toDelAreas = $scope.map.shapes;
//    	for(var i = 0; i < $scope.mapAreas.length; i++){
//    		toDelAreas[$scope.mapAreas[i].id].setMap(null);		// I can access dinamically the value of the object shapes for zones
//    	}
    	var toHideArea = $scope.map.shapes;
    	for(var i = 0; i < areas.length; i++){
    		if(areas[i].geometry != null && areas[i].geometry.length > 0){
	    		if(areas[i].geometry.length == 1){
	    			if(toHideArea[areas[i].id] != null){
		    			toHideArea[areas[i].id].setMap(null);
		    		}
	    		} else {
	    			for(var j = 0; j <  areas[i].geometry.length; j++){
	    				var myId = $scope.correctAreaId(areas[i].id, j);
	    				if(toHideArea[myId] != null){
			    			toHideArea[myId].setMap(null);
			    		}
	    			}
	    		}
    		}
    	}
    };
    
    $scope.setAllMarkersMap = function(markers, map, visible, type){
    	for(var i = 0; i < markers.length; i++){
    		markers[i].options.visible = visible;
    		markers[i].options.map = map;
    		if(type == 1){
    			markers[i].icon = $scope.psMarkerIcon;
    		} else {
    			var myIcon = $scope.getOccupancyIcon(markers[i].data.occupancyRate, 2);
        		markers[i].icon = myIcon;
    		}
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
		var company = "";
		var appId = sharedDataService.getConfAppId();
		if(appId == 'rv'){ 
			company = "amr";
		} else {
			company = "tm";
		}
		//var baseUrl = "http://localhost:8080/parking-management/rest/nosec/";
		//var baseUrl = sharedDataService.getConfUrlWs() + "/nosec/";
		var baseUrl = "rest/nosec";
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
				var averageOccupation = Math.floor((Math.random() * 100) + 1);
				marker.averageOccupation1012 = averageOccupation;
				//myIcon = $scope.getOccupancyIcon(averageOccupation, 2);
				//marker.slotOccupied = Math.floor(marker.slotNumber * averageOccupation / 100);
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
	  
	$scope.initAreasOnMap = function(areas, visible, type, firstInit){
		var area = {};
		var poligons = {};
		var tmpAreas = [];
		var aColor = "";
		
		for(var i = 0; i < areas.length; i++){
			var areaOccupancy = 0;
			if(type == 1){
				aColor = $scope.correctColor(areas[i].color);
			} else if(type == 2){
				areaOccupancy = $scope.getStreetsInAreaOccupancy(areas[i].id);
				aColor = $scope.getOccupancyColor(areaOccupancy);
			}
			
			if(areas[i].geometry != null && areas[i].geometry.length > 0 && areas[i].geometry[0].points.length > 0){
				for(var j = 0; j < areas[i].geometry.length; j++){
					poligons = areas[i].geometry;
					area = {
						id: $scope.correctAreaId(areas[i].id, j),
						path: $scope.correctPoints(poligons[j].points),
						gpath: $scope.correctPointsGoogle(poligons[j].points),
						stroke: {
						    color: aColor, //$scope.correctColor(areas[i].color),
						    weight: 3
						},
						data: areas[i],
						info_windows_pos: $scope.correctPointGoogle(poligons[j].points[1]),
						info_windows_cod: "a" + areas[i].id,
						editable: false,
						draggable: false,
						geodesic: false,
						visible: visible,
						fill: {
						    color: aColor, //$scope.correctColor(areas[i].color),
						    opacity: 0.7
						}
					};
					if(firstInit){	// I use this code only the first time I show the zone occupancy data
						area.data.slotNumber = $scope.getTotalSlotsInArea(areas[i].id);
						area.data.slotOccupied = Math.round(area.data.slotNumber * areaOccupancy / 100);
					}
					tmpAreas.push(area);
				}
			}
		}	
		return tmpAreas;
	};
	
	$scope.initStreetsOnMap = function(streets, visible, type){
		var street = {};
		var poligons = {};
		var tmpStreets = [];
		var sColor = "";
		
		for(var i = 0; i < streets.length; i++){
			var myAreaS = $scope.getLocalAreaById(streets[i].rateAreaId);
			var myZones = [];
			for(var j = 0; j < streets[i].zones.length; j++){
				var zone = $scope.getLocalZoneById(streets[i].zones[j]);
				myZones.push(zone);
			}
			
			if(type == 1){
				sColor = $scope.correctColor(streets[i].color);
			} else if(type == 2){
				sColor = $scope.getOccupancyColor(streets[i].occupancyRate);
			}
			
			if(streets[i].geometry != null){
				poligons = streets[i].geometry;
				street = {
					id: streets[i].id,
					path: $scope.correctPoints(poligons.points),
					gpath: $scope.correctPointsGoogle(poligons.points),
					stroke: {
					    color: sColor,
					    weight: (visible) ? 3 : 0
					},
					data: streets[i],
					area: myAreaS,
					zones: myZones,
					pms: streets[i].myPms,
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
	
	$scope.initZonesOnMap = function(zones, visible, type, firstInit){
		var zone = {};
		var poligons = {};
		var tmpZones = [];
		var zColor = "";
		
		for(var i = 0; i < zones.length; i++){
			var zoneOccupancy = 0;
			if(type == 1){
				zColor = $scope.correctColor(zones[i].color);
			} else if(type == 2){
				zoneOccupancy = $scope.getStreetsInZoneOccupancy(zones[i].id);
				zColor = $scope.getOccupancyColor(zoneOccupancy);
			}
			
			if(zones[i].geometry != null && zones[i].geometry.points != null && zones[i].geometry.points.length > 0){
				poligons = zones[i].geometry;
				zone = {
					id: zones[i].id,
					path: $scope.correctPoints(poligons.points),
					gpath: $scope.correctPointsGoogle(poligons.points),
					stroke: {
					    color: zColor,//$scope.correctColor(zones[i].color),
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
					    color: zColor,//$scope.correctColor(zones[i].color),
					    opacity: 0.7
					}
				};	
				if(firstInit){	// I use this code only the first time I show the zone occupancy data
					zone.data.slotNumber = $scope.getTotalSlotsInZone(zones[i].id);
					zone.data.slotOccupied = Math.round(zone.data.slotNumber * zoneOccupancy / 100);
				}
				tmpZones.push(zone);
			}
		}
		return tmpZones;
	};
	
	$scope.getLocalPmByCode = function(code){
		var find = false;
		var myPms = sharedDataService.getSharedLocalPms();
		for(var i = 0; i < myPms.length && !find; i++){
			var pmCodeString = String(myPms[i].code);
			if(pmCodeString.localeCompare(code) == 0){
				find = true;
				return myPms[i];
			}
		}
	};
	
	$scope.initStreetsObjects = function(streets){
		var myStreets = [];
		for(var i = 0; i < streets.length; i++){
			var zones = [];
			for(var j = 0; j < streets[i].zones.length; j++){
				var zone = $scope.getLocalZoneById(streets[i].zones[j]);
				zones.push(zone);
			}
			var pms = [];
			if(streets[i].parkingMeters != null){
				for(var x = 0; x < streets[i].parkingMeters.length; x++){
					var pm = $scope.getLocalPmByCode(streets[i].parkingMeters[x]);
					pms.push(pm);
				}
			}
			var area = $scope.getLocalAreaById(streets[i].rateAreaId);
			var mystreet = $scope.cleanStreetNullValue(streets[i]);// NB: I have to use the average occupancy value and not the data stored in db
			// ------------------------- TEST data -----------------------
			//var averageOccupation = Math.floor((Math.random() * 100) + 1);
			//mystreet.averageOccupation1012 = averageOccupation;
			//mystreet.freeParkSlotOccupied = Math.floor(mystreet.freeParkSlotNumber * averageOccupation / 100);
			//mystreet.freeParkSlotSignOccupied = Math.floor(mystreet.freeParkSlotSignNumber * averageOccupation / 100);
			//mystreet.paidSlotOccupied = Math.floor(mystreet.paidSlotNumber * averageOccupation / 100);
			//mystreet.timedParkSlotOccupied = Math.floor(mystreet.timedParkSlotNumber * averageOccupation / 100);
			//mystreet.handicappedSlotOccupied = Math.floor(mystreet.handicappedSlotNumber * averageOccupation / 100);
			//mystreet.reservedSlotOccupied = Math.floor(mystreet.reservedSlotNumber * averageOccupation / 100);
			// ----------------------------------------------------------
			mystreet.slotOccupied = $scope.getTotalOccupiedSlots(mystreet);
			//mystreet.slotOccupied = (mystreet.occupancyRate != -1)?Math.round(mystreet.slotNumber * mystreet.occupancyRate / 100):0;
			mystreet.area_name = area.name;
			mystreet.area_color= area.color;
			mystreet.myZones = zones;
			mystreet.myPms = pms;
			myStreets.push(mystreet);
		}
		return myStreets;
	};
	
	$scope.getTotalOccupiedSlots = function(s_object){
		return (s_object.freeParkOccupied +
				s_object.freeParkSlotSignOccupied + 
				s_object.paidSlotOccupied + 
				s_object.timedParkSlotOccupied + 
				s_object.handicappedSlotOccupied + 
				s_object.reservedSlotOccupied);
	};
	
	// Method cleanStreetNullValue: used to init to 0 the null value in the slotNumber data
	$scope.cleanStreetNullValue = function(s_object){
		var street = s_object;
		street.freeParkSlotNumber = (s_object.freeParkSlotNumber != null && s_object.freeParkSlotNumber > 0) ? s_object.freeParkSlotNumber : 0;
		street.freeParkSlotSignNumber = (s_object.freeParkSlotSignNumber != null && s_object.freeParkSlotSignNumber > 0) ? s_object.freeParkSlotSignNumber : 0;
		street.paidSlotNumber = (s_object.paidSlotNumber != null && s_object.freeParkSlotSignNumber > 0) ? s_object.paidSlotNumber : 0;
		street.timedParkSlotNumber = (s_object.timedParkSlotNumber != null && s_object.timedParkSlotNumber > 0) ? s_object.timedParkSlotNumber : 0;
		street.handicappedSlotNumber = (s_object.handicappedSlotNumber != null && s_object.handicappedSlotNumber > 0) ? s_object.handicappedSlotNumber : 0;
		street.reservedSlotNumber = (s_object.reservedSlotNumber != null && s_object.reservedSlotNumber > 0) ? s_object.reservedSlotNumber : 0;
		street.freeParkOccupied = (s_object.freeParkSlotOccupied != null && s_object.freeParkSlotOccupied > 0 && s_object.freeParkSlotNumber > 0) ? s_object.freeParkSlotOccupied : 0;
		street.freeParkSlotSignOccupied = (s_object.freeParkSlotSignOccupied != null && s_object.freeParkSlotSignOccupied > 0 && s_object.freeParkSlotSignNumber > 0) ? s_object.freeParkSlotSignOccupied : 0;
		street.paidSlotOccupied = (s_object.paidSlotOccupied != null && s_object.paidSlotOccupied > 0) ? s_object.paidSlotOccupied : 0;
		street.timedParkSlotOccupied = (s_object.timedParkSlotOccupied != null && s_object.timedParkSlotOccupied > 0) ? s_object.timedParkSlotOccupied : 0;
		street.handicappedSlotOccupied = (s_object.handicappedSlotOccupied != null && s_object.handicappedSlotOccupied > 0) ? s_object.handicappedSlotOccupied : 0;
		street.reservedSlotOccupied = (s_object.reservedSlotOccupied != null && s_object.reservedSlotOccupied > 0) ? s_object.reservedSlotOccupied : 0;
		return street;
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
	
	$scope.initWs = function(){
		$scope.parkingMetersMarkers = [];
		$scope.parkingStructureMarkers = [];
	   	$scope.initPage();
	   	$scope.initComponents();
		$scope.mapReady = false;
		$scope.getAreasFromDb();
	};
	
	 $scope.getAreasFromDb = function(){
		$scope.areaMapReady = false;
		var allAreas = [];
		var method = 'GET';
				
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "area", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, allAreas);
			//console.log("rateAreas retrieved from db: " + JSON.stringify(result));
			    
			$scope.areaWS = allAreas;
			if(showArea){
			    $scope.initAreasOnMap($scope.areaWS, false, 1, false);
			}    
			sharedDataService.setSharedLocalAreas($scope.areaWS);
			$scope.getParkingMetersFromDb();
		});
	};
	
	$scope.getStreetsFromDb = function(){
		$scope.streetMapReady = false;
		var allStreet = [];
		var method = 'GET';
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "street", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allStreet);
		    //console.log("streets retrieved from db: " + JSON.stringify(result));
		    	
		    $scope.streetWS = $scope.initStreetsObjects(allStreet);
		    if(showStreets){
		    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true, 1);
			}
		});
	};
	
	// Method correctParamsFromSemicolon: used to replace the semicolon with a comma
	$scope.correctParamsFromSemicolon = function(value){
		if(value != null){
			var res = value+"";
			if(res.indexOf(";") > -1){
				return res.replace(";",",");
			} else {
				return res;
			}
		} else {
			return value;
		}
	};
	
	// Method getOccupancyStreetsFromDb: used to retrieve te streets occupancy data from the db
	$scope.getOccupancyStreetsFromDb = function(year, month, weekday, dayType, hour, valueType){
		$scope.streetMapReady = false;
		var allStreet = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolon(month),
			weekday: $scope.correctParamsFromSemicolon(weekday),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hour),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		console.log("Params passed in ws get call" + JSON.stringify(params));
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/streets", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allStreet);
		    //console.log("streets occupancy retrieved from db: " + JSON.stringify(result));
		    	
		    $scope.streetWS = $scope.initStreetsObjects(allStreet);
		    if(showStreets){
		    	$scope.updateStreetOccupancy($scope.streetWS);
			}
		    if(showZones){
		    	$scope.updateZoneOccupancy();
		    }
		    if(showArea){
		    	$scope.updateAreaOccupancy();
		    }
		});
	};
	
	// Method getOccupancyParksFromDb: used to retrieve te parks occupancy data from the db
	$scope.getOccupancyParksFromDb = function(year, month, weekday, dayType, hour, valueType, callType){
		var allParks = [];
		var markers = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolon(month),
			weekday: $scope.correctParamsFromSemicolon(weekday),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hour),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		console.log("Params passed in ws get call for Parks" + JSON.stringify(params));
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructures", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allParks);
		    //console.log("streets occupancy retrieved from db: " + JSON.stringify(result));
		    
		    if(showPs){
		    	for (var i = 0; i <  allParks.length; i++) {
			    	markers.push(createMarkers(i, allParks[i], 2));
			    }
		    	angular.copy(markers, $scope.parkingStructureMarkers);
		    	$scope.updateParkOccupancy();
		    }
		    if(callType == 1){
		    	$scope.getBikePointFromDb();
		    }
		});
	};
	
	// Method getStreetsInZoneOccupancy: used to get the occupancy of the streets in a specific zone
	$scope.getStreetsInZoneOccupancy = function(z_id){
		var totalOccupancy = 0;
		var streetsInZone = 0;
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			for(var i = 0; i < $scope.streetWS.length; i++){
				var found = false;
				for(var j = 0; (j < $scope.streetWS[i].zones.length) && !found; j++){
					//var zone = $scope.getLocalZoneById(streets[i].zones[j]);
					//myZones.push(zone);
					if($scope.streetWS[i].zones[j] == z_id){
						found = true;
						streetsInZone += 1;
						totalOccupancy += $scope.streetWS[i].occupancyRate;
					}
				}
			}
		}
		if(streetsInZone != 0){
			return totalOccupancy / streetsInZone;
		} else {
			return -1;
		}
	};
	
	// Method getStreetsInAreaOccupancy: used to get the occupancy of the streets in a specific area
	$scope.getStreetsInAreaOccupancy = function(a_id){
		var totalOccupancy = 0;
		var streetsInArea = 0;
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			//var found = false;
			for(var i = 0; i < $scope.streetWS.length; i++){// && !found
				if($scope.streetWS[i].rateAreaId == a_id){
					//found = true;
					streetsInArea += 1;
					totalOccupancy += $scope.streetWS[i].occupancyRate;
				}
			}
		}
		if(streetsInArea != 0){
			return totalOccupancy / streetsInArea;
		} else {
			return -1;
		}
	};
	
	// Method getTotalSlotsInZone: used to count the total slots of a zone from the slots in streets
	$scope.getTotalSlotsInZone = function(z_id){
		var totalSlots = 0;
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			for(var i = 0; i < $scope.streetWS.length; i++){
				var found = false;
				for(var j = 0; (j < $scope.streetWS[i].zones.length) && !found; j++){
					//var zone = $scope.getLocalZoneById(streets[i].zones[j]);
					//myZones.push(zone);
					if($scope.streetWS[i].zones[j] == z_id){
						found = true;
						totalSlots += $scope.streetWS[i].slotNumber;
					}
				}
			}
		}
		return totalSlots;
	};
	
	// Method getTotalSlotsInArea: used to count the total slots of an area from the slots in streets
	$scope.getTotalSlotsInArea = function(a_id){
		var totalSlots = 0;
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			for(var i = 0; i < $scope.streetWS.length; i++){
				if($scope.streetWS[i].rateAreaId == a_id){
					totalSlots += $scope.streetWS[i].slotNumber;
				}
			}
		}
		return totalSlots;
	};
	
	// Method updateStreetOccupancy: update all street maps Object elements with new occupation data retrieved from db
	$scope.updateStreetOccupancy = function(streets){
		if($scope.dashboard_space.microzone){	// I check if the street check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapStreets.length == 0){
		   			$scope.mapStreets = $scope.initStreetsOnMap(streets, true, 1);
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap(streets, true, 1);
		   			$scope.switchStreetMapObject(3, tmpS);
		   		}
		   	} else {
		   		if($scope.occupancyStreets.length == 0){
		   			$scope.occupancyStreets = $scope.initStreetsOnMap(streets, true, 2);
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap(streets, true, 2);
		   	    	$scope.switchStreetMapObject(4, tmpS);
		    	}
		    }
		}
	};
	
	// Method updateZoneOccupancy: update all zone maps Object elements with new occupation data retrieved from db
	$scope.updateZoneOccupancy = function(){
		if($scope.dashboard_space.macrozone){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapZones.length == 0){
		   			$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true, 1, false);
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 1, false);
		   			$scope.switchZoneMapObject(3, tmpZ);
		   		}
		   	} else {
		   		if($scope.occupancyZones.length == 0){
		   			$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, true, 2, false);
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 2, false);
		   	    	$scope.switchZoneMapObject(4, tmpZ);
		    	}
		    }
		}
	};
	
	// Method updateAreaOccupancy: update all area maps Object elements with new occupation data retrieved from db
	$scope.updateAreaOccupancy = function(){
		if($scope.dashboard_space.rate_area){	// I check if the area check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapAreas.length == 0){
		   			$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true, 1, false);
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 1, false);
		   			$scope.switchAreaMapObject(3, tmpA);
		   		}
		   	} else {
		   		if($scope.occupancyAreas.length == 0){
		   			$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, true, 2, false);
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 2, false);
		   	    	$scope.switchAreaMapObject(4, tmpA);
		    	}
		    }
		}
	};
	
	// Method updateStreetOccupancy: update all street maps Object elements with new occupation data retrieved from db
	$scope.updateParkOccupancy = function(parks){
		if($scope.dashboard_space.parkingstructs){	// I check if the parkingstructures check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapParkingStructureMarkers.length == 0){
		   			$scope.mapParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
		   			$scope.switchParkingMapObject(3, tmpP);
		   		}
		   	} else {
		   		if($scope.occupancyParkingStructureMarkers.length == 0){
		   			$scope.occupancyParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 2);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 2);
		   	    	$scope.switchParkingMapObject(4, tmpP);
		    	}
		    }
		}
	};
		    
    $scope.getParkingMetersFromDb = function(){
	    var markers = [];
		var allParkingMeters = [];
		var method = 'GET';
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "parkingmeter", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, allParkingMeters);
		  	//console.log("Parking Meters retrieved from db: " + JSON.stringify(result));
		    //$scope.addParkingMetersMarkers(allParkingMeters);
		    	
		    if(showPm){
		    	for (var i = 0; i <  allParkingMeters.length; i++) {
		    		markers.push(createMarkers(i, allParkingMeters[i], 1));
		    	}
		    	angular.copy(markers, $scope.parkingMetersMarkers);
		    }
		    //$scope.parkingMetersMarkers = $scope.initPMObjects(allPmeters);
		    sharedDataService.setSharedLocalPms(allParkingMeters);
		    var d = new Date();
		    var hour = "10;12";
		    $scope.getOccupancyParksFromDb(d.getFullYear(), d.getMonth(), null, "wd", hour, 1, 1);
		    //$scope.getParkingStructuresFromDb();
		});
	};
	
	$scope.getParkingStructuresFromDb = function(){
		var markers = [];
		var allParkingStructures = [];
		var method = 'GET';
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "parkingstructure", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allParkingStructures);
		    console.log("Parking Structures retrieved from db: " + JSON.stringify(result));
		 
		    if(showPs){
		    	for (var i = 0; i <  allParkingStructures.length; i++) {
			    	markers.push(createMarkers(i, allParkingStructures[i], 2));
			    }
		    	angular.copy(markers, $scope.parkingStructureMarkers);
		    }
		   	$scope.getBikePointFromDb();
		});
	};
	
	$scope.getBikePointFromDb = function(){		
		var markers = [];
		var allBikePoints = [];
		var method = 'GET';
		
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint", null, $scope.authHeaders, null);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "bikepoint", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allBikePoints);
	    	console.log("BikePoints retrieved from db: " + JSON.stringify(result));
	    	
	    	if(showBp){
	    		for (var i = 0; i <  allBikePoints.length; i++) {
		    		markers.push(createMarkers(i, allBikePoints[i], 3));
			    }
	    		angular.copy(markers, $scope.bikePointMarkers);
	    		//$scope.initMap($scope.parkingMetersMarkers, $scope.parkingStructureMarkers, $scope.bikePointMarkers);
	    		//$scope.initMap($scope.parkingMetersMarkers, null, null);
	    		//$scope.initMap(null, $scope.parkingStructureMarkers, null);
	    	}
			$scope.getZonesFromDb();
		});
	};
	
	$scope.getZonesFromDb = function(){
		$scope.zoneMapReady = false;
		var allZones = [];
		var method = 'GET';
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "zone", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, allZones);
			console.log("Zone retrieved from db: " + JSON.stringify(result));
		    	
			$scope.zoneWS = $scope.correctMyZones(allZones);
		 	sharedDataService.setSharedLocalZones($scope.zoneWS);
		    if(showZones){
		    	$scope.initZonesOnMap($scope.zoneWS, false, 1, false);
		    }
		    //$scope.getStreetsFromDb();
		    var d = new Date();
		    var hour = "10;12";
		    $scope.getOccupancyStreetsFromDb(d.getFullYear(), d.getMonth(), null, "wd", hour, 1);
		});
	};
	
	$scope.detailsOpened = false;
	$scope.mapParkingMetersSelectedMarkers = [];
	$scope.mapParkingStructureSelectedMarkers = [];
	$scope.mapSelectedStreets = [];
	$scope.mapSelectedZones = [];
	$scope.mapSelectedAreas = [];
	var pMDet = false;
	var pSDet = false;
	var streetDet = false;
	var zoneDet = false;
	var areaDet = false;
	
	$scope.showPMDet = function(){
		pMDet = true;
		pSDet = false;
		streetDet = false;
		zoneDet = false;
		areaDet = false;
	};
	
	$scope.showPSDet = function(){
		pMDet = false;
		pSDet = true;
		streetDet = false;
		zoneDet = false;
		areaDet = false;
	};
	
	$scope.showStreetDet = function(){
		pMDet = false;
		pSDet = false;
		streetDet = true;
		zoneDet = false;
		areaDet = false;
	};
	
	$scope.showZoneDet = function(){
		pMDet = false;
		pSDet = false;
		streetDet = false;
		zoneDet = true;
		areaDet = false;
	};
	
	$scope.showAreaDet = function(){
		pMDet = false;
		pSDet = false;
		streetDet = false;
		zoneDet = false;
		areaDet = true;
	};
	
	$scope.showDetails = function(event, object, type, theme){
		$scope.theme = theme;	// used in close details panel
		switch(type){
			case 1:
				if(theme == 0){
					for(var i = 0; i < $scope.mapParkingMetersMarkers.length; i++){
						if($scope.mapParkingMetersMarkers[i].id == object.id){
							$scope.mapParkingMetersMarkers.splice(i, 1);
						}
					}
				} else {
					for(var i = 0; i < $scope.occupancyParkingMeterMarkers.length; i++){
						if($scope.occupancyParkingMeterMarkers[i].id == object.id){
							$scope.occupancyParkingMeterMarkers.splice(i, 1);
						}
					}
				}
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				$scope.showPMDet();
				object.options.animation = "BOUNCE";
				$scope.mapParkingMetersSelectedMarkers.push(object);
				$scope.pmDetails = object;
				break;
			case 2:
				if(theme == 0){
					for(var i = 0; i < $scope.mapParkingStructureMarkers.length; i++){
						if($scope.mapParkingStructureMarkers[i].id == object.id){
							$scope.mapParkingStructureMarkers.splice(i, 1);
						}
					}
				} else {
					for(var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
						if($scope.occupancyParkingStructureMarkers[i].id == object.id){
							$scope.occupancyParkingStructureMarkers.splice(i, 1);
						}
					}
				}	
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				$scope.showPSDet();
				object.options.animation = "BOUNCE";
				$scope.mapParkingStructureSelectedMarkers.push(object);
				$scope.psDetails = object;
				break;
			case 3:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 10;
				var toDelStreet = $scope.map.shapes;
			    toDelStreet[object.id].setMap(null);		// I can access dinamically the value of the object shapes for street
			    if(theme == 0){
				    for(var i = 0; i < $scope.mapStreets.length; i++){
				    	if($scope.mapStreets[i].id == object.id){
				    		$scope.mapStreets.splice(i, 1);
				    	}
				    }
			    } else {
			    	for(var i = 0; i < $scope.occupancyStreets.length; i++){
				    	if($scope.occupancyStreets[i].id == object.id){
				    		$scope.occupancyStreets.splice(i, 1);
				    	}
				    }
			    }
			    $scope.mapSelectedStreets.push(object);
			    $scope.showStreetDet();
				$scope.sDetails = object;
				break;
			case 4:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 10;
				var toDelZones = $scope.map.shapes;
			    toDelZones[object.id].setMap(null);		// I can access dinamically the value of the object shapes for street
			    if(theme == 0){
				    for(var i = 0; i < $scope.mapZones.length; i++){
				    	if($scope.mapZones[i].id == object.id){
				    		$scope.mapZones.splice(i, 1);
				    	}
				    }
			    } else {
			    	for(var i = 0; i < $scope.occupancyZones.length; i++){
				    	if($scope.occupancyZones[i].id == object.id){
				    		$scope.occupancyZones.splice(i, 1);
				    	}
				    }
			    }
			    $scope.mapSelectedZones.push(object);
			    $scope.showZoneDet();
				$scope.zDetails = object;
				break;
			case 5:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 10;
				var toDelAreas = $scope.map.shapes;
			    toDelAreas[object.id].setMap(null);		// I can access dinamically the value of the object shapes for street
			    if(theme == 0){
				    for(var i = 0; i < $scope.mapAreas.length; i++){
				    	if($scope.mapAreas[i].id == object.id){
				    		$scope.mapAreas.splice(i, 1);
				    	}
				    }
			    } else {
			    	for(var i = 0; i < $scope.occupancyAreas.length; i++){
				    	if($scope.occupancyAreas[i].id == object.id){
				    		$scope.occupancyAreas.splice(i, 1);
				    	}
				    }
			    }
			    $scope.mapSelectedAreas.push(object);
			    $scope.showAreaDet();
				$scope.aDetails = object;
				break;	
		};
		$scope.detailsOpened = true;
		return object;
	};
	
	$scope.hideDetails = function(event, object, type){
		$scope.detailsOpened = false;
		switch(type){
		case 1:
			if($scope.mapParkingMetersMarkers.length > 0){
				$scope.mapParkingMetersMarkers.push(object);
			} else {
				$scope.occupancyParkingMeterMarkers.push(object);
			}
			$scope.mapParkingMetersSelectedMarkers = [];
			break;
		case 2:
			if($scope.mapParkingStructureMarkers.length > 0){
				$scope.mapParkingStructureMarkers.push(object);
			} else {
				$scope.occupancyParkingStructureMarkers.push(object);
			}
			$scope.mapParkingStructureSelectedMarkers = [];
			break;
		case 3:
			$scope.mapSelectedStreets = [];
			var toDelStreet = $scope.map.shapes;
	    	toDelStreet[object.id].setMap(null);
	    	object.stroke.weight = 3;
	    	if($scope.mapStreets.length > 0){
	    		$scope.mapStreets.push(object);
	    	} else {
	    		$scope.occupancyStreets.push(object);
	    	}
			break;
		case 4:
			$scope.mapSelectedZones = [];
			var toDelZone = $scope.map.shapes;
	    	toDelZone[object.id].setMap(null);
	    	object.stroke.weight = 3;
	    	if($scope.mapZones.length > 0){
	    		$scope.mapZones.push(object);
	    	} else {
	    		$scope.occupancyZones.push(object);
	    	}
			break;
		case 5:
			$scope.mapSelectedAreas = [];
			var toDelArea = $scope.map.shapes;
	    	toDelArea[object.id].setMap(null);
	    	object.stroke.weight = 3;
	    	if($scope.mapAreas.length > 0){
	    		$scope.mapAreas.push(object);
	    	} else {
	    		$scope.occupancyAreas.push(object);
	    	}
			break;	
		};
	};
	
	$scope.showOccupancy = function(event, object, type, theme){
		$scope.theme = theme;	// used in close details panel
		switch(type){
			case 1:
				for(var i = 0; i < $scope.occupancyParkingMeterMarkers.length; i++){
					if($scope.occupancyParkingMeterMarkers[i].id == object.id){
						$scope.occupancyParkingMeterMarkers.splice(i, 1);
					}
				}
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				$scope.showPMDet();
				object.options.animation = "BOUNCE";
				$scope.mapParkingMetersSelectedMarkers.push(object);
				//$scope.pmDetails = object;
				// here i call the method that init the pie diagram
				break;
			case 2:
				for(var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
					if($scope.occupancyParkingStructureMarkers[i].id == object.id){
						$scope.occupancyParkingStructureMarkers.splice(i, 1);
					}
				}
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				$scope.showPSDet();
				object.options.animation = "BOUNCE";
				$scope.mapParkingStructureSelectedMarkers.push(object);
				$scope.psDetails = object;
				$scope.initPsOccupancyDiagram(object);
				break;
			case 3:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 10;
				var toDelStreet = $scope.map.shapes;
			    toDelStreet[object.id].setMap(null);		// I can access dinamically the value of the object shapes for street
			    for(var i = 0; i < $scope.occupancyStreets.length; i++){
				   	if($scope.occupancyStreets[i].id == object.id){
				   		$scope.occupancyStreets.splice(i, 1);
				   	}
			    }
			    $scope.mapSelectedStreets.push(object);
			    $scope.showStreetDet();
				object.data.freeParkSlotSignFree = (object.data.freeParkSlotSignNumber > 0) ? (object.data.freeParkSlotSignNumber - object.data.freeParkSlotSignOccupied) : 0;
				object.data.freeParkSlotFree = (object.data.freeParkSlotNumber > 0) ? (object.data.freeParkSlotNumber - object.data.freeParkSlotOccupied) : 0;
				object.data.paidSlotFree = (object.data.paidSlotNumber > 0 ) ? (object.data.paidSlotNumber - object.data.paidSlotOccupied) : 0;
				object.data.timedParkSlotFree = (object.data.timedParkSlotNumber > 0) ? (object.data.timedParkSlotNumber - object.data.timedParkSlotOccupied) : 0;
				object.data.handicappedSlotFree = (object.data.handicappedSlotNumber > 0) ? (object.data.handicappedSlotNumber - object.data.handicappedSlotOccupied) : 0;
				object.data.reservedSlotFree = (object.data.reservedSlotNumber > 0)? (object.data.reservedSlotNumber - object.data.reservedSlotOccupied) : 0;
			    $scope.sDetails = object;
			    $scope.initStreetOccupancyDiagram(object);
				break;
			case 4:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 10;
				var toDelZones = $scope.map.shapes;
			    toDelZones[object.id].setMap(null);		// I can access dinamically the value of the object shapes for street
			    if(theme == 0){
				    for(var i = 0; i < $scope.mapZones.length; i++){
				    	if($scope.mapZones[i].id == object.id){
				    		$scope.mapZones.splice(i, 1);
				    	}
				    }
			    } else {
			    	for(var i = 0; i < $scope.occupancyZones.length; i++){
				    	if($scope.occupancyZones[i].id == object.id){
				    		$scope.occupancyZones.splice(i, 1);
				    	}
				    }
			    }
			    $scope.mapSelectedZones.push(object);
			    $scope.showZoneDet();
				$scope.zDetails = object;
				$scope.initZoneOccupancyDiagram(object);
				break;
			case 5:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 10;
				var toDelAreas = $scope.map.shapes;
			    toDelAreas[object.id].setMap(null);		// I can access dinamically the value of the object shapes for street
			    if(theme == 0){
				    for(var i = 0; i < $scope.mapAreas.length; i++){
				    	if($scope.mapAreas[i].id == object.id){
				    		$scope.mapAreas.splice(i, 1);
				    	}
				    }
			    } else {
			    	for(var i = 0; i < $scope.occupancyAreas.length; i++){
				    	if($scope.occupancyAreas[i].id == object.id){
				    		$scope.occupancyAreas.splice(i, 1);
				    	}
				    }
			    }
			    $scope.mapSelectedAreas.push(object);
			    $scope.showAreaDet();
				$scope.aDetails = object;
				$scope.initAreaOccupancyDiagram(object);
				break;	
		};
		$scope.occupancyOpened = true;
		return object;
	};
	
	$scope.hideOccupancy = function(event, object, type){
		$scope.occupancyOpened = false;
		switch(type){
		case 1:
			if($scope.mapParkingMetersMarkers.length > 0){
				$scope.mapParkingMetersMarkers.push(object);
			} else {
				$scope.occupancyParkingMeterMarkers.push(object);
			}
			$scope.mapParkingMetersSelectedMarkers = [];
			break;
		case 2:
			if($scope.mapParkingStructureMarkers.length > 0){
				$scope.mapParkingStructureMarkers.push(object);
			} else {
				$scope.occupancyParkingStructureMarkers.push(object);
			}
			$scope.mapParkingStructureSelectedMarkers = [];
			break;
		case 3:
			$scope.mapSelectedStreets = [];
			var toDelStreet = $scope.map.shapes;
	    	toDelStreet[object.id].setMap(null);
	    	object.stroke.weight = 3;
	    	if($scope.mapStreets.length > 0){
	    		$scope.mapStreets.push(object);
	    	} else {
	    		$scope.occupancyStreets.push(object);
	    	}
			break;
		case 4:
			$scope.mapSelectedZones = [];
			var toDelZone = $scope.map.shapes;
	    	toDelZone[object.id].setMap(null);
	    	object.stroke.weight = 3;
	    	if($scope.mapZones.length > 0){
	    		$scope.mapZones.push(object);
	    	} else {
	    		$scope.occupancyZones.push(object);
	    	}
			break;
		case 5:
			$scope.mapSelectedAreas = [];
			var toDelArea = $scope.map.shapes;
	    	toDelArea[object.id].setMap(null);
	    	object.stroke.weight = 3;
	    	if($scope.mapAreas.length > 0){
	    		$scope.mapAreas.push(object);
	    	} else {
	    		$scope.occupancyAreas.push(object);
	    	}
			break;	
		};
	};
	
	$scope.isPMDetShow = function(){
		return pMDet;
	};
	
	$scope.isPSDetShow = function(){
		return pSDet;
	};
	
	$scope.isStreetDetShow = function(){
		return streetDet;
	};
	
	$scope.isZoneDetShow = function(){
		return zoneDet;
	};
	
	$scope.isAreaDetShow = function(){
		return areaDet;
	};
	
	$scope.closeAllDetails = function(theme){
		$scope.detailsOpened = false;
		$scope.occupancyOpened = false;
		if($scope.mapParkingMetersSelectedMarkers.length > 0){
			$scope.fixIfAlreadySelected($scope.mapParkingMetersSelectedMarkers, 1, theme);
		}
		if($scope.mapParkingStructureSelectedMarkers.length > 0){
			$scope.fixIfAlreadySelected($scope.mapParkingStructureSelectedMarkers, 2, theme);
		}
		if($scope.mapSelectedStreets.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedStreets, 3, theme);
		}
		if($scope.mapSelectedZones.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedZones, 4, theme);
		}
		if($scope.mapSelectedAreas.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedAreas, 5, theme);
		}
	};
	
	// Method used to check if an element is already selected
	$scope.fixIfAlreadySelected = function(list, type, theme){
		switch(type){
		case 1:
			if(list.length > 0){
				var object = list[0];
				object.options.animation = "";
				if(theme == 0){
					$scope.mapParkingMetersMarkers.push(object);
				} else {
					$scope.occupancyParkingMeterMarkers.push(object);
				}
			}
			$scope.mapParkingMetersSelectedMarkers = [];
			break;
		case 2:
			if(list.length > 0){
				var object = list[0];
				object.options.animation = "";
				if(theme == 0){
					$scope.mapParkingStructureMarkers.push(object);
				} else {
					$scope.occupancyParkingStructureMarkers.push(object);
				}
			}
			$scope.mapParkingStructureSelectedMarkers = [];
			break;
		case 3:
			if(list.length > 0){
				var object = list[0];
				var toDelStreet = $scope.map.shapes;
		    	toDelStreet[object.id].setMap(null);
		    	object.stroke.weight = 3;
		    	if(theme == 0){
		    		$scope.mapStreets.push(object);
		    	} else {
		    		$scope.occupancyStreets.push(object);
		    	}
			}
			$scope.mapSelectedStreets = [];
			break;
		case 4:
			if(list.length > 0){
				var object = list[0];
				var toDelZone = $scope.map.shapes;
		    	toDelZone[object.id].setMap(null);
		    	object.stroke.weight = 3;
		    	if(theme == 0){
		    		$scope.mapZones.push(object);
		    	} else {
		    		$scope.occupancyZones.push(object);
		    	}
			}
			$scope.mapSelectedZones = [];
			break;
		case 5:
			if(list.length > 0){
				var object = list[0];
				var toDelArea = $scope.map.shapes;
		    	toDelArea[object.id].setMap(null);
		    	object.stroke.weight = 3;
		    	if(theme == 0){
		    		$scope.mapAreas.push(object);
		    	} else {
		    		$scope.occupancyAreas.push(object);
		    	}
			}
			$scope.mapSelectedAreas = [];
			break;	
		}
	};
    
    // Method switchStreetMapObject: used to switch (in map) from street object to occupancy-street object
    $scope.switchStreetMapObject = function(type, newList){
    	var toHideStreets = $scope.map.shapes;
    	switch(type){
    		case 1:
    			for(var i = 0; i < $scope.mapStreets.length; i++){
    	    		toHideStreets[$scope.mapStreets[i].id].setMap(null);
    	    		var object = $scope.mapStreets[i];
    	    		object.stroke.color = $scope.getOccupancyColor(object.data.occupancyRate);	//averageOccupation1012
    	    		$scope.occupancyStreets.push(object);
    	    	}
    	    	$scope.mapStreets = [];
    			break;
    		case 2:
    			for(var i = 0; i < $scope.occupancyStreets.length; i++){
    	    		toHideStreets[$scope.occupancyStreets[i].id].setMap(null);
    	    		var object = $scope.occupancyStreets[i];
    	    		object.stroke.color = $scope.correctColor(object.data.color);
    	    		$scope.mapStreets.push(object);
    	    	}
    	    	$scope.occupancyStreets = [];
    			break;
    		case 3:
    			var tmpStreets = [];
    	    	for(var i = 0; i < $scope.mapStreets.length; i++){
    	    		toHideStreets[$scope.mapStreets[i].id].setMap(null);
    	    		var object = newList[i];
    	    		//object.stroke.color = $scope.getOccupancyColor(object.data.occupancyRate);	//averageOccupation1012
    	    		object.stroke.color = $scope.correctColor(object.data.color);
    	    		tmpStreets.push(object);
    	    	}
    	    	angular.copy(tmpStreets, $scope.mapStreets);
    			break;
    		case 4:
    			var tmpStreets = [];
    	    	for(var i = 0; i < $scope.occupancyStreets.length; i++){
    	    		toHideStreets[$scope.occupancyStreets[i].id].setMap(null);
    	    		var object = newList[i];
    	    		object.stroke.color = $scope.getOccupancyColor(object.data.occupancyRate);	//averageOccupation1012
    	    		tmpStreets.push(object);
    	    	}
    	    	angular.copy(tmpStreets, $scope.occupancyStreets);
    			break;	
    		default:break;
    	}
    	
    };
    
    // Method isCorrectNumber
    $scope.isCorrectNumber = function(number){
    	if(number > -1){
    		return true;
    	} else {
    		return false;
    	}
    };
    
    // Method switchZoneMapObject: used to switch (in map) from zone object to occupancy-zone object
    $scope.switchZoneMapObject = function(type, newList){
    	var toHideZones = $scope.map.shapes;
    	switch(type){
    		case 1:
    			for(var i = 0; i < $scope.mapZones.length; i++){
    	    		toHideZones[$scope.mapZones[i].id].setMap(null);
    	    		var object = $scope.mapZones[i];
    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.mapZones[i].id);
    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
    	    		object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
    	    		object.data.slotNumber = $scope.getTotalSlotsInZone($scope.mapZones[i].id);
    	    		object.data.slotOccupied = Math.round(object.data.slotNumber * zoneOccupancy / 100);
    	    		$scope.occupancyZones.push(object);
    	    	}
    	    	$scope.mapZones = [];
    			break;
    		case 2:
    			for(var i = 0; i < $scope.occupancyZones.length; i++){
    	    		toHideZones[$scope.occupancyZones[i].id].setMap(null);
    	    		var object = $scope.occupancyZones[i];
    	    		object.stroke.color = $scope.correctColor(object.data.color);
    	    		$scope.mapZones.push(object);
    	    	}
    	    	$scope.occupancyZones = [];
    			break;
    		case 3:
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.mapZones.length; i++){
    	    		toHideZones[$scope.mapZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		object.stroke.color = $scope.correctColor(object.data.color);
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.mapZones);
    			break;
    		case 4:
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.occupancyZones.length; i++){
    	    		toHideZones[$scope.occupancyZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.occupancyZones[i].id);
    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
    	    		object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
    	    		object.data.slotNumber =  $scope.getTotalSlotsInZone($scope.occupancyZones[i].id);
    	    		object.data.slotOccupied = Math.round(object.data.slotNumber * zoneOccupancy / 100);
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.occupancyZones);
    			break;	
    		default:break;
    	}
    };
    
    // Method switchAreaMapObject: used to switch (in map) from area object to occupancy-area object
    $scope.switchAreaMapObject = function(type, newList){
    	var toHideAreas = $scope.map.shapes;
    	switch(type){
    		case 1:
    			for(var i = 0; i < $scope.mapAreas.length; i++){
    	    		toHideAreas[$scope.mapAreas[i].id].setMap(null);
    	    		var object = $scope.mapAreas[i];
    	    		var myAreaId = $scope.cleanAreaId($scope.mapAreas[i].id);
    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
    	    		object.stroke.color = $scope.getOccupancyColor(areaOccupancy);	//Here I have to add the streets that compose the area
    	    		object.fill.color = $scope.getOccupancyColor(areaOccupancy);
    	    		object.data.slotNumber = $scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotOccupied = Math.round(object.data.slotNumber * areaOccupancy / 100);
    	    		$scope.occupancyAreas.push(object);
    	    	}
    	    	$scope.mapAreas = [];
    			break;
    		case 2:
    			for(var i = 0; i < $scope.occupancyAreas.length; i++){
    	    		toHideAreas[$scope.occupancyAreas[i].id].setMap(null);
    	    		var object = $scope.occupancyAreas[i];
    	    		object.stroke.color = $scope.correctColor(object.data.color);
    	    		object.fill.color = $scope.correctColor(object.data.color);
    	    		$scope.mapAreas.push(object);
    	    	}
    	    	$scope.occupancyAreas = [];
    			break;
    		case 3:
    			var tmpAreas = [];
    	    	for(var i = 0; i < $scope.mapAreas.length; i++){
    	    		toHideAreas[$scope.mapAreas[i].id].setMap(null);
    	    		var object = newList[i];
    	    		object.stroke.color = $scope.correctColor(object.data.color);
    	    		object.fill.color = $scope.correctColor(object.data.color);
    	    		tmpAreas.push(object);
    	    	}
    	    	angular.copy(tmpAreas, $scope.mapAreas);
    			break;
    		case 4:
    			var tmpAreas = [];
    	    	for(var i = 0; i < $scope.occupancyAreas.length; i++){
    	    		toHideAreas[$scope.occupancyAreas[i].id].setMap(null);
    	    		var object = newList[i];
    	    		var myAreaId = $scope.cleanAreaId($scope.occupancyAreas[i].id);
    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
    	    		object.stroke.color = $scope.getOccupancyColor(areaOccupancy);	//Here I have to add the streets that compose the area
    	    		object.fill.color = $scope.getOccupancyColor(areaOccupancy);
    	    		object.data.slotNumber =  $scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotOccupied = Math.round(object.data.slotNumber * areaOccupancy / 100);
    	    		tmpAreas.push(object);
    	    	}
    	    	angular.copy(tmpAreas, $scope.occupancyAreas);
    			break;	
    		default:break;
    	}
    };
    
    // Method switchParkingMapObject: used to switch (in map) from parking object to occupancy-parking object
    $scope.switchParkingMapObject = function(type, newList){
    	switch(type){
    		case 1:
    			for (var i = 0; i < $scope.mapParkingStructureMarkers.length; i++){
    	    		var myIcon = $scope.getOccupancyIcon($scope.mapParkingStructureMarkers[i].data.occupancyRate, 2);
    	    		var object = $scope.mapParkingStructureMarkers[i];
    	    		object.icon = myIcon;
    	    		$scope.occupancyParkingStructureMarkers.push(object);
    	    	};
    	    	$scope.mapParkingStructureMarkers = [];
    			break;
    		case 2:
    			for (var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
    	    		var object = $scope.occupancyParkingStructureMarkers[i];
    	    		object.icon = $scope.psMarkerIcon;
    	    		$scope.mapParkingStructureMarkers.push(object);
    	    	};
    	    	$scope.occupancyParkingStructureMarkers = [];
    			break;
    		case 3:
    			//var tmpStructs = [];
    	    	for(var i = 0; i < newList.length; i++){
    	    		//var object = newList[i];
    	    		$scope.mapParkingStructureMarkers[i].icon = $scope.psMarkerIcon;
    	    	}
    	    	//$scope.mapParkingStructureMarkers = [];
    	    	//angular.copy(tmpStructs, $scope.mapParkingStructureMarkers);
    			break;
    		case 4:
    			//var tmpStructs = [];
    	    	for(var i = 0; i <  newList.length; i++){
    	    		//var object = newList[i];
    	    		var myIcon = $scope.getOccupancyIcon(newList[i].data.occupancyRate, 2);
    	    		$scope.occupancyParkingStructureMarkers[i].icon = myIcon;
    	    		//tmpStructs.push(object);
    	    	}
    	    	//$scope.occupancyParkingStructureMarkers = [];
    	    	//angular.copy(tmpStructs, $scope.occupancyParkingStructureMarkers);
    			break;	
    		default:
    			break;
    	}
    	
    };

    
    $scope.getOccupancyColor = function(value){
    	if(value == -1){
    		return $scope.lightgray;
    	} else {
	    	if(value < 25){
	    		return $scope.green;
	    	} else if(value < 50){
	    		return $scope.yellow;
	    	} else if(value < 75){
	    		return $scope.orange;
	    	} else if(value < 90){
	    		return $scope.red;
	    	} else {
	    		return $scope.violet;
	    	}
    	}
    };
    
    $scope.getOccupancyIcon = function(value, type){
    	var image_url="";
    	if(value == -1){
    		switch(type){
    			case 1: break;
    			case 2:
    				image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_np.png";
    				break;
    			case 3: break;
    			default: break;
    		}
    	} else if(value < 25){
    		switch(type){
    			case 1: break;
    			case 2:
    				image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_green.png";
    				break;
    			case 3: break;
    			default: break;
    		}
    	} else if(value < 50){
    		switch(type){
				case 1: break;
				case 2:
					image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_yellow.png";
					break;
				case 3: break;
				default: break;
    		}
    	} else if(value < 75){
    		switch(type){
				case 1: break;
				case 2:
					image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_orange.png";
					break;
				case 3: break;
				default: break;
    		}
    	} else if(value < 90){
    		switch(type){
				case 1: break;
				case 2:
					image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_red.png";
					break;
				case 3: break;
				default: break;
			}
    	} else {
    		switch(type){
				case 1: break;
				case 2:
					image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_violet.png";
					break;
				case 3: break;
				default: break;
			}
    	}
    	return image_url;
    };
    
    // ---------------------------------------------- Start block Utilization diagrams --------------------------------------
    $scope.chartPsOccupancy = $scope.chart = {
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
  
    $scope.initPsOccupancyDiagram = function(structure){
    	$scope.chartPsOccupancy.data = [["Posti", "num"]];
  	
  	//for(var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
  		var object = structure.data;
  		var dataTot = [ "Liberi", object.slotNumber - object.slotOccupied ];
  		var dataOcc = [ "Occupati", object.slotOccupied ];
  		$scope.chartPsOccupancy.data.push(dataTot);
  		$scope.chartPsOccupancy.data.push(dataOcc);
  	//}
  		$scope.chartPsOccupancy.options.title = "Posti occupati in struttura";
    };
    
    $scope.chartStreetOccupancy = $scope.chart = {
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
    
    $scope.chartStreetFreeParkAvailability = $scope.chart = {
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
    
    $scope.chartStreetOccupiedParkComposition = $scope.chart = {
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
    
    $scope.initStreetOccupancyDiagram = function(street){
      	$scope.chartStreetOccupancy.data = [["Posti", "number"]];
      	$scope.chartStreetFreeParkAvailability.data = [["Posti liberi", "number"]];
      	$scope.chartStreetOccupiedParkComposition.data = [["Posti occupati", "number"]];
      	
      	var object = street.data;
      	// for Total slot
    	var dataTot = [ "Liberi", object.slotNumber - object.slotOccupied ];
    	var dataOcc = [ "Occupati", object.slotOccupied ];
    	$scope.chartStreetOccupancy.data.push(dataTot);
    	$scope.chartStreetOccupancy.data.push(dataOcc);
    	$scope.chartStreetOccupancy.options.title = "Posti in strada";
    	// for Free slot
    	var freeFree = [ "Gratuiti", object.freeParkSlotNumber - object.freeParkSlotOccupied ];
    	var freeFreeSigned = [ "Gratuiti (segnalati)", object.freeParkSlotSignNumber - object.freeParkSlotSignOccupied ];
    	var freePaid = [ "A pagamento", object.paidSlotNumber - object.paidSlotOccupied ];
    	var freeTimed = [ "Disco Orario", object.timedParkSlotNumber - object.timedParkSlotOccupied ];
    	var freeHandicapped = [ "Per disabili", object.handicappedSlotNumber - object.handicappedSlotOccupied ];
    	var freeReserved = [ "Riservati", object.reservedSlotNumber - object.reservedSlotOccupied ];
    	$scope.chartStreetFreeParkAvailability.data.push(freeFree);
    	$scope.chartStreetFreeParkAvailability.data.push(freeFreeSigned);
    	$scope.chartStreetFreeParkAvailability.data.push(freePaid);
    	$scope.chartStreetFreeParkAvailability.data.push(freeTimed);
    	$scope.chartStreetFreeParkAvailability.data.push(freeHandicapped);
    	$scope.chartStreetFreeParkAvailability.data.push(freeReserved);
    	$scope.chartStreetFreeParkAvailability.options.title = "Posti liberi in strada";
    	// for Occupied slot
    	var occupiedFree = [ "Gratuiti", object.freeParkSlotOccupied ];
    	var occupiedFreeSigned = [ "Gratuiti (segnalati)", object.freeParkSlotSignOccupied ];
    	//if(object.freeParkSlotSignOccupied == null){
    	//	occupiedFree = [ "Gratuiti", object.freeParkSlotOccupied ];
    	//	if(object.freeParkSlotOccupied == null){
    	//		occupiedFree = [ "Gratuiti", 0 ];
    	//	}
    	//}
    	var occupiedPaid = [ "A pagamento", object.paidSlotOccupied ];
    	var occupiedTimed = [ "Disco Orario", object.timedParkSlotOccupied ];
    	var occupiedHandicapped = [ "Per disabili", object.handicappedSlotOccupied ];
    	var occupiedReserved = [ "Riservati", object.reservedSlotOccupied ];
    	$scope.chartStreetOccupiedParkComposition.data.push(occupiedFree);
    	$scope.chartStreetOccupiedParkComposition.data.push(occupiedFreeSigned);
    	$scope.chartStreetOccupiedParkComposition.data.push(occupiedPaid);
    	$scope.chartStreetOccupiedParkComposition.data.push(occupiedTimed);
    	$scope.chartStreetOccupiedParkComposition.data.push(occupiedHandicapped);
    	$scope.chartStreetOccupiedParkComposition.data.push(occupiedReserved);
    	$scope.chartStreetOccupiedParkComposition.options.title = "Posti occupati in strada";
    	
    };
    
    $scope.chartZoneOccupancy = $scope.chart = {
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
    
    $scope.initZoneOccupancyDiagram = function(zone){
    	$scope.chartZoneOccupancy.data = [["Posti", "num"]];
  	//for(var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
  		var object = zone.data;
  		var dataTot = [ "Liberi", object.slotNumber - object.slotOccupied ];
  		var dataOcc = [ "Occupati", object.slotOccupied ];
  		$scope.chartZoneOccupancy.data.push(dataTot);
  		$scope.chartZoneOccupancy.data.push(dataOcc);
  	//}
  		$scope.chartZoneOccupancy.options.title = "Posti occupati in zona";
    };
    
    $scope.chartAreaOccupancy = $scope.chart = {
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
    
    $scope.initAreaOccupancyDiagram = function(area){
    	$scope.chartAreaOccupancy.data = [["Posti", "num"]];
    	var object = area.data;
  		var dataTot = [ "Liberi", object.slotNumber - object.slotOccupied ];
  		var dataOcc = [ "Occupati", object.slotOccupied ];
  		$scope.chartAreaOccupancy.data.push(dataTot);
  		$scope.chartAreaOccupancy.data.push(dataOcc);
  		$scope.chartAreaOccupancy.options.title = "Posti occupati in area";
    };
	
   // ---------------------------------------------- End block Utilization diagrams --------------------------------------
}]);