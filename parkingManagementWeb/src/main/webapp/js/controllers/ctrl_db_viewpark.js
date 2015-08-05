'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers', ['googlechart','angularAwesomeSlider','angular-spinkit']);
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
		$scope.loadMapsObject();
		//$scope.alignSelectedObjects();
		//$scope.setAllMapObjectLoaded(false);
		//$scope.loadModal();
		//$dialogs.load("","");
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
	    if($scope.dashboard_topics == "occupation"){
		    switch($scope.vis){
		    	case "vis_last_value": 
		    		//$scope.getOccupancyStreetsFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1);
		    		$scope.getOccupancyStreetsUpdatesFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, $scope.streetWS);
		    		//$scope.getOccupancyParksFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, 2);
		    		$scope.getOccupancyParksUpdatedFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, 2, $scope.actualParks);
		    		
		    		break;
		    	case "vis_medium":
		    		//$scope.getOccupancyStreetsFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2);
		    		$scope.getOccupancyStreetsUpdatesFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, $scope.streetWS);
		    		//$scope.getOccupancyParksFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2);
		    		$scope.getOccupancyParksUpdatedFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks);
		    		break;
		    	case "vis_medium_year":
		    		//$scope.getOccupancyStreetsFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2);
		    		$scope.getOccupancyStreetsUpdatesFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, $scope.streetWS);
		    		//$scope.getOccupancyParksFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2);
		    		$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks);
		    		break;
		    	case "vis_medium_month":
		    		//$scope.getOccupancyStreetsFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2);
		    		$scope.getOccupancyStreetsUpdatesFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, $scope.streetWS);
		    		//$scope.getOccupancyParksFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2);
		    		$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks);
		    		break;
		    	case "vis_medium_day":
		    		//$scope.getOccupancyStreetsFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2);
		    		$scope.getOccupancyStreetsUpdatesFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2, $scope.streetWS);
		    		//$scope.getOccupancyParksFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2, 2);
		    		$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2, 2, $scope.actualParks);
		    		break;
		    	default: break;	
		    }
	    } else if($scope.dashboard_topics == "receipts"){
	    	switch($scope.vis){
		    	case "vis_last_value": 
		    		$scope.getProfitPMFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, false);
		    		//$scope.getOccupancyParksUpdatedFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, 2, $scope.actualParks);
		    		break;
		    	case "vis_medium":
		    		$scope.getProfitPMFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, false);
		    		//$scope.getOccupancyParksUpdatedFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks);
		    		break;
		    	case "vis_medium_year":
		    		$scope.getProfitPMFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, false);
		    		//$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks);
		    		break;
		    	case "vis_medium_month":
		    		$scope.getProfitPMFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, false);
		    		//$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks);
		    		break;
		    	case "vis_medium_day":
		    		$scope.getProfitPMFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 1, false);
		    		//$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2, 2, $scope.actualParks);
		    		break;
		    	default: break;
	    	}
	    }
	};

}]);

pm.controller('ViewDashboardCtrlPark',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', '$dialogs', 'sharedDataService', 'invokeDashboardWSService', 'invokeDashboardWSServiceNS', 'invokeWSServiceProxy', 
                          function($scope, $http, $route, $routeParams, $rootScope, localize, $dialogs, sharedDataService, invokeDashboardWSService, invokeDashboardWSServiceNS, invokeWSServiceProxy, $location, $filter) {

	$scope.disableThemes = false;	//Used to disable/enable themes buttons selection
	$scope.showLogs = false;
	
	$scope.parkingMetersMarkers = [];
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	$scope.mapParkingMetersMarkers = [];
	$scope.mapParkingStructureMarkers = [];
	$scope.mapBikePointMarkers = [];
	$scope.streetWS = [];
	$scope.pstructWS = [];
	$scope.mapStreets = [];
	$scope.mapZones = [];
	$scope.mapAreas = [];
	$scope.actualParks = [];
	
	$scope.occupancyStreets = [];
	$scope.occupancyAreas = [];
	$scope.occupancyZones = [];
	$scope.occupancyParkingMeterMarkers = [];
	$scope.occupancyParkingStructureMarkers = [];
	$scope.mapStreetSelectedMarkers = [];
	
	$scope.profitStreets = [];
	$scope.profitAreas = [];
	$scope.profitZones = [];
	$scope.profitParkingMeterMarkers = [];
	$scope.profitParkingStructureMarkers = [];
	
	$scope.myTmpZoneOccupation = [];	//MB28072015: added this variable to manage average zone occupation
	$scope.useAverageZoneOccupation = false;	// to remove this feature set the variable to false
	var showOtherFilterSettings = false;
	
	$scope.setAverageZoneValue = function(value){
		$scope.useAverageZoneOccupation = value;
	};
	
	$scope.showOtherSettings = function(value){
		showOtherFilterSettings = value;
	};
	
	$scope.isOtherSettingsShow = function(){
		return showOtherFilterSettings;
	};
	
	$scope.lightgray = "#B0B0B0";//"#81EBBA";
	$scope.lightgreen = "#37EC0E";
	$scope.green = "#31B404";
	$scope.yellow = "#F7FE2E";
	$scope.orange = "#FF8000";
	$scope.red = "#DF0101";
	$scope.violet = "#8904B1";
	$scope.blue = "#383BEE";
	
	$scope.pmMarkerIcon = "imgs/markerIcons/parcometro.png";			// icon for parkingMeter object
	//$scope.psMarkerIcon = "imgs/markerIcons/parcheggioStruttura.png";	// icon for parkingStructure object
	$scope.psMarkerIcon = "imgs/structIcons/parking_structures_general_outline.png";	// icon for parkingStructure object
	$scope.bpMarkerIcon = "imgs/markerIcons/puntobici.png";				// icon for bikePoint object
	$scope.streetMarkerIcon = "imgs/street_marker.png";					// icon for street marker
	
	$scope.authHeaders = {
	    'Accept': 'application/json;charset=UTF-8'
	};
	
	$scope.progress = 25;
	
	$scope.loadMapsObject = function(){
		$scope.progress += 25;
		$dialogs.wait("Aggiornamento dati su mappa in corso...",$scope.progress);
	};
	
	$scope.updateLoadingMapState = function(){
		$scope.progress += 25;
    	$rootScope.$broadcast('dialogs.wait.progress',{msg: "Aggiornamento dati su mappa in corso...",'progress': $scope.progress});
	};
	
	$scope.closeLoadingMap = function(){
		$scope.progress = 100;
    	$rootScope.$broadcast('dialogs.wait.complete');
	};
	
	// --------------- Block for title of the map (describe the element showed in the map ------------------
	$scope.title_map = "Offerta di sosta: Vie";
	$scope.update_title_map = function(inverse, type, exlude){
		switch ($scope.dashboard_topics){
			case "parkSupply": 
				$scope.title_map = "Offerta di sosta: ";
				if(!inverse){
					$scope.controlCheckedArea("");
				} else {
					if(type == "rate_area"){
						if(exlude != "rate_area"){
							$scope.title_map += "Aree Tariffarie, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "macrozone"){
						if(exlude != "macrozone"){
							$scope.title_map += "Macrozone, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone"){
						if(exlude != "microzone"){
							$scope.title_map += "Vie, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "parkingstructs"){
						if(exlude != "parkingstructs"){
							$scope.title_map += "Strutture Parcheggio, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "parkingmeter"){
						if(exlude != "parkingmeter"){
							$scope.title_map += "Parcometri, ";
						}
						$scope.controlCheckedArea(exlude);
					}
				}
				break;
			case "occupation": 
				$scope.title_map = "Occupazione: ";
				if(!inverse){
					$scope.controlCheckedArea("");
				} else {
					if(type == "rate_area"){
						if(exlude != "rate_area"){
							$scope.title_map += "Aree Tariffarie, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "macrozone"){
						if(exlude != "macrozone"){
							$scope.title_map += "Macrozone, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone"){
						if(exlude != "microzone"){
							$scope.title_map += "Vie, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "parkingstructs"){
						if(exlude != "parkingstructs"){
							$scope.title_map += "Strutture Parcheggio, ";
						}
						$scope.controlCheckedArea(exlude);
					}
				}
				break;
			case "receipts": 
				$scope.title_map = "Incasso: ";
				if(!inverse){
					$scope.controlCheckedArea("");
				} else {
					if(type == "rate_area"){
						if(exlude != "rate_area"){
							$scope.title_map += "Aree Tariffarie, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "macrozone"){
						if(exlude != "macrozone"){
							$scope.title_map += "Macrozone, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone"){
						if(exlude != "microzone"){
							$scope.title_map += "Vie, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "parkingstructs"){
						if(exlude != "parkingstructs"){
							$scope.title_map += "Strutture Parcheggio, ";
						}
						$scope.controlCheckedArea(exlude);
					}
				}
				break;	
			default: break;
		}
		$scope.title_map = $scope.title_map.substring(0, $scope.title_map.length - 2);
	};
	
	$scope.controlCheckedArea = function(exlude){
		if($scope.dashboard_space.rate_area && (exlude != "rate_area")){
			$scope.title_map += "Aree Tariffarie, ";
		}
		if($scope.dashboard_space.macrozone && (exlude != "macrozone")){
			$scope.title_map += "Macrozone, ";
		}
		if($scope.dashboard_space.microzone && (exlude != "microzone")){
			$scope.title_map += "Vie, ";
		}
		if($scope.dashboard_space.parkingstructs && (exlude != "parkingstructs")){
			$scope.title_map += "Strutture Parcheggio, ";
		}
		if($scope.dashboard_space.parkingmeter && (exlude != "parkingmeter")){
			$scope.title_map += "Parcometri, ";
		}
	};
	
	// ---------------------------------------------------------------------------------------------
	
	// ----------------------- Block to read conf params and show/hide elements -----------------------
    var showArea = false;
    var showStreets = false;
    var showPm = false;
    var showPs = false;
    var showBp = false;
    var showZones = false;
    $scope.allMapObjectLoaded = false;
    
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
    
    $scope.setAllMapObjectLoaded = function(value){
    	$scope.allMapObjectLoaded = value;
    };
    
    $scope.getAllMapObjectLoaded = function(){
    	return $scope.allMapObjectLoaded;
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
    $scope.tabIndex = 0;
    $scope.viewparktabs = [ 
        { title:'Mappa', index: 1, content:"partials/dashboard/tabs/viewpark_map.html" },
        { title:'Lista', index: 2, content:"partials/dashboard/tabs/viewpark_list.html", disabled:false }
    ];
    
    $scope.setIndex = function($index){
    	if($index > 0){
    		sharedDataService.setIsInList(true);
    	} else {
    		sharedDataService.setIsInList(false);
    	}
       	$scope.tabIndex = $index;
    };
    
    $scope.maxStreets = 13;
    $scope.maxZones = 13;
    $scope.maxAreas = 13;
    $scope.maxPStructs = 13;
    
    $scope.currentPage = 0;
    $scope.numberOfPages = function(type, list){
       	if(type == 1){
       		if($scope.areaWS != null){
       			return Math.ceil($scope.areaWS.length/$scope.maxAreas);
       		} else {
       			return 0;
      		}
       	} else if(type == 2) {
       		if($scope.streetWS != null){
       			return Math.ceil(list.length/$scope.maxStreets);
       		} else {
       			return 0;
     		}
       	} else if(type == 3){
       		if($scope.pmeterWS != null){
       			return Math.ceil(list.length/$scope.maxPmeters);
       		} else {
       			return 0;
     		}
       	} else if(type == 4){
       		if($scope.pstructWS != null){
       			return Math.ceil($scope.pstructWS.length/$scope.maxPStructs);
       		} else {
       			return 0;
     		}
       	} else if(type == 5){
       		if($scope.zoneWS != null){
       			return Math.ceil($scope.zoneWS.length/$scope.maxZones);
       		} else {
       			return 0;
     		}
       	} else if(type == 6){
       		if($scope.bpointWS != null){
       			return Math.ceil($scope.bpointWS.length/$scope.maxBPoints);
       		} else {
       			return 0;
     		}
       	}
    };
    
    
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
	
	var myStyles =[
	    {
	    	featureType: "poi",
	        elementType: "labels",
	        stylers: [
	            { visibility: "off" }
	        ]
	    },
	    {
	    	featureType: "transit.station",
	    	elementType: "all",
	        stylers: [
	            { visibility: "off" }
	        ]
	    }
	];
	
	$scope.mapOption = {
		center : sharedDataService.getConfMapCenter(),	//"[" + $scope.mapCenter.latitude + "," + $scope.mapCenter.longitude + "]",
		zoom : parseInt(sharedDataService.getConfMapZoom()),
		styles : myStyles
	};
	
	
	$scope.initPage = function(){
		
		$scope.dashboard_space = {
			rate_area : false,
			macrozone : false,
			microzone : true,
			parkingmeter : false,
			parkingstructs : false
		};
		
		$scope.dashboard_space_list = "microzone";
		
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
	
	$scope.showZList = false;
	$scope.showSList = true;
	$scope.showAList = false;
	$scope.showPSList = false;
	
	$scope.changeDashboardView = function(){
		switch($scope.dashboard_topics){
			case "parkSupply": 
				// Show profit objects (with specifics colors)
				$scope.dashboard_space = {
					rate_area : false,
					macrozone : false,
					microzone : true,
					parkingmeter : false,
					parkingstructs : false
				};
				// Show parkingManagement objects
				$scope.switchStreetMapObject(2, null, false);
				$scope.switchZoneMapObject(2, null);
				$scope.switchAreaMapObject(2, null);
				$scope.switchParkingMapObject(2, null);
				// Hide the parkingMeters and uncheck the checkBox
				if($scope.mapParkingMetersSelectedMarkers != null && $scope.mapParkingMetersSelectedMarkers.length > 0){
					var object = $scope.mapParkingMetersSelectedMarkers[0];
					object.options.animation = "";
					$scope.mapParkingMetersMarkers.push(object);
					$scope.mapParkingMetersSelectedMarkers = [];
				}
				$scope.hideParkingMetersMarkers();
				break;
			case "occupation": 
				// Show occupation objects (with specifics colors)
				$scope.switchStreetMapObject(1, null, false);
				$scope.switchZoneMapObject(1, null);
				$scope.switchAreaMapObject(1, null);
				$scope.switchParkingMapObject(1, null);
				// Hide the parkingMeters and uncheck the checkBox
				if($scope.mapParkingMetersSelectedMarkers != null && $scope.mapParkingMetersSelectedMarkers.length > 0){
					var object = $scope.mapParkingMetersSelectedMarkers[0];
					object.options.animation = "";
					$scope.mapParkingMetersMarkers.push(object);
					$scope.mapParkingMetersSelectedMarkers = [];
				}
				$scope.hideParkingMetersMarkers();
				$scope.dashboard_space.parkingmeter = false;
				break;
			case "receipts": 
				// Show profit objects (with specifics colors)
				$scope.dashboard_space = {
					rate_area : false,
					macrozone : false,
					microzone : false,
					parkingmeter : true,
					parkingstructs : false
				};
				$scope.showProfitPMMarkers();	// here I show the parkingMeter on he map
				$scope.switchStreetMapObject(5, null, true);
				$scope.switchZoneMapObject(5, null);
				$scope.switchAreaMapObject(5, null);
				$scope.switchParkingMapObject(5, null);
				break;
			case "timeCost": 
				break;
			case "pr": 
				break;
			case "budget": 
				break;
		}
		$scope.update_title_map(false, "", "");
	};
	
	$scope.showZoneList = function(){
		$scope.showZList = true;
		$scope.showSList = false;
		$scope.showAList = false;
		$scope.showPSList = false;
	};
	
	$scope.showAreaList = function(){
		$scope.showAList = true;
		$scope.showZList = false;
		$scope.showSList = false;
		$scope.showPSList = false;
	};
	
	$scope.showStreetList = function(){
		$scope.showSList = true;
		$scope.showZList = false;
		$scope.showAList = false;
		$scope.showPSList = false;
	};
	
	$scope.showStructList = function(){
		$scope.showPSList = true;
		$scope.showZList = false;
		$scope.showSList = false;
		$scope.showAList = false;
	};
	
	
	// ------------------------------- Utility methods ----------------------------------------
	$scope.correctColor = function(value){
		return "#" + value;
	};
	
	$scope.plainColor = function(value){
		return value.substring(1, value.length);
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
	
	$scope.correctEuroCent = function(eurocent){
		var intval = parseInt(eurocent);
		var totalEur = (intval / 100);
		return totalEur.toFixed(2) + " ";
	};
	
	// ----------------------------------------------------------------------------------------------
	
	// Method alignSelectedObjects: used to hide all selected object when the filter stat is changed
	// (if I don't clear the data the selected object remain on the map)
	$scope.alignSelectedObjects = function(){
		$scope.detailsOpened = false;	// I close the details column
		$scope.occupancyOpened = false;
		$scope.profitOpened = false;
		// For Area
		if($scope.mapSelectedAreas != null && $scope.mapSelectedAreas.length > 0){
			var toHideArea = $scope.map.shapes;
			var object = {};
			angular.copy($scope.mapSelectedAreas[0], object);
			object.stroke.weight = 3;
			toHideArea[$scope.mapSelectedAreas[0].id].setMap(null);
			$scope.mapSelectedAreas = [];
		}
		// For Zone
		if($scope.mapSelectedZones != null && $scope.mapSelectedZones.length > 0){
			var toHideZone = $scope.map.shapes;
			toHideZone[$scope.mapSelectedZones[0].id].setMap(null);
			$scope.mapSelectedZones = [];
		}
		// For Streets
		if($scope.mapSelectedStreets != null && $scope.mapSelectedStreets.length > 0){
			var toHideStreet = $scope.map.shapes;
			toHideStreet[$scope.mapSelectedStreets[0].id].setMap(null);
			$scope.mapSelectedStreets = [];
		}
		// For ParkingStructure
		if($scope.mapParkingStructureSelectedMarkers != null && $scope.mapParkingStructureSelectedMarkers.length > 0){
			$scope.mapParkingStructureSelectedMarkers = [];
		}
	};
	
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
			$scope.update_title_map(true, "parkingmeter", "");
		} else {
			$scope.hideParkingMetersMarkers();
			$scope.update_title_map(true, "parkingmeter", "parkingmeter");
		}
	};

	$scope.showParkingMetersMarkers = function() {
        $scope.mapParkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 0);
        //$scope.refreshMap();
    };
    
    $scope.hideParkingMetersMarkers = function() {
    	$scope.mapParkingMetersMarkers = []; //$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
    	$scope.profitParkingMeterMarkers = [];
    	//$scope.refreshMap();
        //$scope.$apply();
    };
    
    $scope.showProfitPMMarkers = function(){
    	$scope.profitParkingMeterMarkers =  $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 3);
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
    	if(!$scope.dashboard_space.parkingstructs){
    		$scope.update_title_map(true, "parkingstructs", "");
    	} else {
    		$scope.update_title_map(true, "parkingstructs", "parkingstructs");
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
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
    	//$scope.$apply();
    };
    
    // Show/hide bikePoints markers
    $scope.changeBikePointsMarkers = function(){
		if(!$scope.mapelements.bikepoints){
			$scope.showBikePointsMarkers();
			$scope.update_title_map(true, "bike_point", "");
		} else {
			$scope.hideBikePointsMarkers();
			$scope.update_title_map(true, "bike_point", "bike_point");
		}
	};
    
    $scope.showBikePointsMarkers = function() {
        $scope.mapBikePointMarkers = $scope.setAllMarkersMap($scope.bikePointMarkers, $scope.map, true, 1);
        //$scope.refreshMap();
    };
    
    $scope.hideBikePointsMarkers = function() {
    	$scope.mapBikePointMarkers = [];//$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
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
    	if(!$scope.dashboard_space.rate_area){
    		$scope.update_title_map(true, "rate_area", "");
    	} else {
    		$scope.update_title_map(true, "rate_area", "rate_area");
    	}
	};
    
    $scope.showAreaPolygons = function(type) {
    	if(type == 1){
    		$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true, type, false, false);
    	} else {
    		if($scope.occupancyAreas.length == 0){
    			$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, true, type, true, false);
    		} else {
    			$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, true, type, false, false);
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
    		$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, false, type, false, false);
    	} else {
    		$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, false, type, false, false);
    	}
    	$scope.hideAllAreas($scope.areaWS);
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.mapStreetSelectedMarkers = [];

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
    	} else if(dashboardTopic == "occupation"){
    		if(!$scope.dashboard_space.macrozone){
				$scope.showZonePolygons(2);
			} else {
				$scope.hideZonePolygons(2);
			}
    	} else if(dashboardTopic == "receipts"){
    		if(!$scope.dashboard_space.macrozone){
				$scope.showZonePolygons(3);
			} else {
				$scope.hideZonePolygons(3);
			}
    	}
    	if(!$scope.dashboard_space.macrozone){
    		$scope.update_title_map(true, "macrozone", "");
    	} else {
    		$scope.update_title_map(true, "macrozone", "macrozone");
    	}
	};
    
    $scope.showZonePolygons = function(type) {
    	if(type == 1){
    		$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true, type, false, false);
    	} else if(type == 2){
    		if($scope.occupancyZones.length == 0){
    			$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, true, type, true, false);
    		} else {
    			$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, true, type, false, false);
    		}
    	} else if(type == 3){
    		if($scope.profitZones.length == 0){
    			$scope.profitZones = $scope.initZonesOnMap($scope.zoneWS, true, type, true, false);
    		} else {
    			$scope.profitZones = $scope.initZonesOnMap($scope.zoneWS, true, type, false, false);
    		}
    	}
    };
    
    $scope.hideZonePolygons = function(type) {
    	if(type == 1){
    		$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, false, type, false, false);
    	} else if(type == 2){
    		$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, false, type, false, false);
    	} else if(type == 3){
    		$scope.profitZones = $scope.initZonesOnMap($scope.zoneWS, false, type, false, false);
    	}
    	$scope.hideAllZones();
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
    };
    
    // Show/hide streets polygons
    $scope.changeStreetPolylines = function(dashboardTopic){
		//if(!$scope.mapelements.streets){
    	if(!$scope.dashboard_space.microzone){
    		if(dashboardTopic == "parkSupply"){
    			$scope.showStreetPolylines(1);
    		} else if(dashboardTopic == "occupation"){
    			$scope.showStreetPolylines(2);
    		} else if(dashboardTopic == "receipts"){
    			$scope.showStreetPolylines(3);
    		}
		} else {
			if(dashboardTopic == "parkSupply"){
				$scope.hideStreetPolylines(1);
    		} else if(dashboardTopic == "occupation"){
    			$scope.hideStreetPolylines(2);
    		} else if(dashboardTopic == "receipts"){
    			$scope.hideStreetPolylines(3);
    		}
		}
    	if(!$scope.dashboard_space.microzone){
    		$scope.update_title_map(true, "microzone", "");
    	} else {
    		$scope.update_title_map(true, "microzone", "microzone");
    	}
	};
    
    $scope.showStreetPolylines = function(type) {
    	if(type == 1){
    		$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true, type);
    	} else if(type == 2) {
    		$scope.occupancyStreets = $scope.initStreetsOnMap($scope.streetWS, true, type);
    	} else if(type == 3){
    		$scope.profitStreets = $scope.initStreetsOnMap($scope.streetWS, true, type);
    	}
    	//$scope.refreshMap();
    };
    
    $scope.hideStreetPolylines = function(type) {
    	if(type == 1){
    		$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, false, type);
    	} else if(type == 2){
    		$scope.occupancyStreets = $scope.initStreetsOnMap($scope.streetWS, false, type);
    	} else if(type == 3){
    		$scope.profitStreets = $scope.initStreetsOnMap($scope.streetWS, false, type);
    	}
    	$scope.hideAllStreets();
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    $scope.hideAllStreets = function(){
    	var toDelStreet = $scope.map.shapes;
	    for(var i = 0; i < $scope.mapStreets.length; i++){
	    	toDelStreet[$scope.mapStreets[i].id].setMap(null);			// I can access dinamically the value of the object shapes for street
	    }
    	for(var i = 0; i < $scope.occupancyStreets.length; i++){
	    	toDelStreet[$scope.occupancyStreets[i].id].setMap(null);	// I can access dinamically the value of the object shapes for street
	    }
    	for(var i = 0; i < $scope.profitStreets.length; i++){
	    	toDelStreet[$scope.profitStreets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
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
    		toDelZones[$scope.mapZones[i].id].setMap(null);			// I can access dinamically the value of the object shapes for zones
    	}
    	for(var i = 0; i < $scope.occupancyZones.length; i++){
    		toDelZones[$scope.occupancyZones[i].id].setMap(null);	// I can access dinamically the value of the object shapes for zones
    	}
    	for(var i = 0; i < $scope.profitZones.length; i++){
    		toDelZones[$scope.profitZones[i].id].setMap(null);		// I can access dinamically the value of the object shapes for zones
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
    		} else if(type == 2) {
    			var myIcon = $scope.getOccupancyIcon(markers[i].data.occupancyRate, 2);
        		markers[i].icon = myIcon;
    		}
    	}
    	//$scope.setAllMapObjectLoaded(true);
    	//$scope.closeModal();
    	$scope.closeLoadingMap();
    	return markers;
    };
    
    $scope.refreshMap = function() {
        //optional param if you want to refresh you can pass null undefined or false or empty arg
        $scope.map.control.refresh($scope.mapCenter);
        //$scope.map.control.refresh(null);
        $scope.map.control.getGMap().setZoom(5);
        $scope.map.control.getGMap().setZoom(14);
    };
    
    $scope.getCorrectPmIconByAreaName = function(areaName){
    	var myIcon = "";
    	switch(areaName){
    		case "Rossa":
    			myIcon = "imgs/parkingMeterIcons/parchimetro_red_outline.png";
    			break;
    		case "Gialla":
    			myIcon = "imgs/parkingMeterIcons/parchimetro_yellow_outline.png";
    			break;
    		case "Arancio (Ospedale)":
    			myIcon = "imgs/parkingMeterIcons/parchimetro_orange_outline.png";
    			break;
    		default:
    			break;
    		
    	}
    	return myIcon;
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
		var color = "";
		var cid = "";
		switch(type){
			case 1 : 
				//myIcon = $scope.pmMarkerIcon;
				//myAreaPm = $scope.getLocalAreaById(marker.areaId);
				//myIcon = $scope.getCorrectPmIconByAreaName(myAreaPm.name);
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
				break;
			case 4 :
				color = $scope.getProfitColor(marker.profit);
				//myIcon = $scope.getCorrectPmIconByAreaName(myAreaPm.name);
				myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((marker.profit != null) ? $scope.plainColor(color) : defaultMarkerColor);
				cid = "c" + marker.id;
				break;
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
				icon: myIcon,
				myprofitColor: color,
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
	  
	$scope.initAreasOnMap = function(areas, visible, type, firstInit, firstTime){
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
						    weight: 3,
						    opacity: 0.7
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
						    opacity: 0.5
						}
					};
					if(firstInit){	// I use this code only the first time I show the zone occupancy data
						var slotsInArea = $scope.getTotalSlotsInArea(areas[i].id);
						area.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(areas[i].id);
						area.data.slotOccupied = slotsInArea[1]; //Math.round(area.data.slotNumber * areaOccupancy / 100);
					}
					tmpAreas.push(area);
				}
			}
		}
		if(!firstTime){
			$scope.closeLoadingMap();
		}
		return tmpAreas;
	};
	
	$scope.updateAreasOccupancy = function(){
		for(var i = 0; i < $scope.areaWS.length; i++){
			var areaOccupancy = $scope.getStreetsInAreaOccupancy($scope.areaWS[i].id);
			$scope.areaWS[i].occupancy = (areaOccupancy != -1) ? Math.round(areaOccupancy) : areaOccupancy;
			var slotsInArea = $scope.getTotalSlotsInArea($scope.areaWS[i].id);
			$scope.areaWS[i].slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(areas[i].id);
			$scope.areaWS[i].slotOccupied = slotsInArea[1]; //Math.round(area.data.slotNumber * areaOccupancy / 100);		
		}
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
			var parkingMeters = streets[i].myPms;
			var totalProfit = 0;
			if(parkingMeters != null){
				for(var j = 0; j < parkingMeters.length; j++){
					if(parkingMeters[j] != null){
						var profit = $scope.getActualPmProfit(parkingMeters[j].id);
						if(profit != -1){
							totalProfit += profit;
						}
					}
				}
			}
			if(totalProfit == 0){
				streets[i].profit = -1;
			} else {
				streets[i].profit = totalProfit;
			}
			
//			if(streets[i].occupancyRate == -1){
//				var found = false;
//				for(var x = 0; x < $scope.myTmpZoneOccupation.length; x++){
//					if(myZones[0].id == $scope.myTmpZoneOccupation[x].id){
//						streets[i].occupancyRate = $scope.myTmpZoneOccupation[x].occupancy;
//						found = true;
//					}
//				}
//				if(!found){
//					var zVal = {
//						id: myZones[0].id,
//						occupancy: Math.floor($scope.getStreetsInZoneOccupancy(myZones[0].id))	// here I calculate the zone average occupancy
//					};
//					$scope.myTmpZoneOccupation.push(zVal);
//					streets[i].occupancyRate = zVal.occupancy;
//				}
//				//streets[i].occupancyRate = $scope.getStreetsInZoneOccupancy(myZones[0].id);	// average occupation for zone
//			}
			if(type == 1){
				sColor = $scope.correctColor(streets[i].color);
			} else if(type == 2){
				sColor = $scope.getOccupancyColor(streets[i].occupancyRate);
			} else if(type == 3){
				sColor = $scope.getProfitColor(streets[i].profit);
			}
			
			if(streets[i].geometry != null){
				poligons = streets[i].geometry;
				street = {
					id: streets[i].id,
					path: $scope.correctPoints(poligons.points),
					gpath: $scope.correctPointsGoogle(poligons.points),
					stroke: {
					    color: sColor,
					    weight: (visible) ? 3 : 0,
					    opacity: 0.7
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
		//$scope.setAllMapObjectLoaded(true);
		//$scope.closeModal();
		$scope.closeLoadingMap();
		return tmpStreets;
	};
	
	$scope.getActualPmProfit = function(pmId){
		var pmdata = null;
		var found = false;
		for(var i = 0; ((i < $scope.parkingMeterWS.length) && (!found)); i++){
			if($scope.parkingMeterWS[i].id == pmId){
				pmdata = $scope.parkingMeterWS[i];
				found = true;
			}
		}
		return pmdata.profit;
	};
	
	$scope.updateZonesOccupancy = function(){
		for(var i = 0; i < $scope.zoneWS.length; i++){
			var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.zoneWS[i].id);
			//$scope.zoneWS[i].occupancy = (zoneOccupancy != -1) ? zoneOccupancy.toFixed(2) : zoneOccupancy;
			$scope.zoneWS[i].occupancy = (zoneOccupancy != -1) ? Math.round(zoneOccupancy) : zoneOccupancy;
			$scope.zoneWS[i].zColor = $scope.getOccupancyColor(zoneOccupancy);
			var slotsInZone = $scope.getTotalSlotsInZone($scope.zoneWS[i].id);
			$scope.zoneWS[i].slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone(zones[i].id);
			$scope.zoneWS[i].slotOccupied = slotsInZone[1];
		}
	};
	
	
	$scope.initZonesOnMap = function(zones, visible, type, firstInit, firstTime){
		var zone = {};
		var poligons = {};
		var tmpZones = [];
		var zColor = "";
		
		for(var i = 0; i < zones.length; i++){
			var zoneOccupancy = 0;
			var zoneProfit = 0;
			if(type == 1){
				zColor = $scope.correctColor(zones[i].color);
			} else if(type == 2){
				zoneOccupancy = $scope.getStreetsInZoneOccupancy(zones[i].id);
				zColor = $scope.getOccupancyColor(zoneOccupancy);
			} else if(type == 3){
				zoneProfit = $scope.getStreetsInZoneProfit(zones[i].id);
				zColor = $scope.getProfitColor(zoneProfit);
			}
			
			if(zones[i].geometry != null && zones[i].geometry.points != null && zones[i].geometry.points.length > 0){
				poligons = zones[i].geometry;
				zone = {
					id: zones[i].id,
					path: $scope.correctPoints(poligons.points),
					gpath: $scope.correctPointsGoogle(poligons.points),
					stroke: {
					    color: zColor,//$scope.correctColor(zones[i].color),
					    weight: 3,
					    opacity: 0.7
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
					    opacity: 0.5
					}
				};	
				if(firstInit){	// I use this code only the first time I show the zone occupancy data
					var slotsInZone = $scope.getTotalSlotsInZone(zones[i].id);
					zone.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone(zones[i].id);
					zone.data.slotOccupied = slotsInZone[1]; //Math.round(zone.data.slotNumber * zoneOccupancy / 100);
					zone.data.slotPaid = $scope.getPaidSlotsInZone(zones[i].id);
					zone.data.profit = zoneProfit;
				}
				tmpZones.push(zone);
			}
		}
		if(!firstTime){
			$scope.closeLoadingMap();
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
		street.paidSlotNumber = (s_object.paidSlotNumber != null && s_object.paidSlotNumber > 0) ? s_object.paidSlotNumber : 0;
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
	
	$scope.initPMObjects = function(parkMeters){
		var myPMs = [];
		for(var i = 0; i < parkMeters.length; i++){
			var area = $scope.getLocalAreaById(parkMeters[i].areaId);
			var myPM = parkMeters[i];
			myPM.area = area;
			myPM.area_name = area.name;
			myPM.area_color= area.color;
			myPMs.push(myPM);
		}
		return myPMs;
	};
	
	$scope.initWsView = function(){
		$scope.loadMapsObject();	// To show modal waiting spinner
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
		var appId = sharedDataService.getConfAppId();
				
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/area", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, allAreas);
			//console.log("rateAreas retrieved from db: " + JSON.stringify(result));
			    
			$scope.areaWS = allAreas;
			if(showArea){
			    $scope.initAreasOnMap($scope.areaWS, false, 1, false, true);
			}    
			sharedDataService.setSharedLocalAreas($scope.areaWS);
			//$scope.getParkingMetersFromDb();
			var d = new Date();
		    var hour = "10;12";
		    $scope.getProfitPMFromDb(d.getFullYear(), d.getMonth(), null, "wd", hour, 2, true);
		});
	};
	
	$scope.getStreetsFromDb = function(){
		$scope.streetMapReady = false;
		var allStreet = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/street", null, $scope.authHeaders, null);
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
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/streets", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allStreet);
		    //console.log("streets occupancy retrieved from db: " + JSON.stringify(result));
		    $scope.updateLoadingMapState();
		    $scope.myTmpZoneOccupation = [];
		    $scope.streetWS = $scope.initStreetsObjects(allStreet);
		    if($scope.useAverageZoneOccupation){
			    for(var i = 0; i < $scope.streetWS.length; i++){
				    if($scope.streetWS[i].occupancyRate == -1){
						var found = false;
						for(var x = 0; x < $scope.myTmpZoneOccupation.length; x++){
							if($scope.streetWS[i].myZones[0].id == $scope.myTmpZoneOccupation[x].id){
								$scope.streetWS[i].occupancyRate = $scope.myTmpZoneOccupation[x].occupancy;
								found = true;
							}
						}
						if(!found){
							var zVal = {
								id: $scope.streetWS[i].myZones[0].id,
								occupancy: Math.floor($scope.getStreetsInZoneOccupancy($scope.streetWS[i].myZones[0].id))	// here I calculate the zone average occupancy
							};
							$scope.myTmpZoneOccupation.push(zVal);
							$scope.streetWS[i].occupancyRate = zVal.occupancy;
						}
				    }
			    }
		    }
		    
		    if(showStreets){
		    	$scope.updateStreetOccupancy($scope.streetWS);
			}
		    if(showZones){
		    	$scope.updateZoneOccupancy(true);
		    }
		    if(showArea){
		    	$scope.updateAreaOccupancy(true);
		    }
		    //var isInList = sharedDataService.getIsInList();
		    //if(isInList){
		    $scope.updateZonesOccupancy();
		    $scope.updateAreasOccupancy();
		    //}
		});
	};
	
	// Method getOccupancyStreetsFromDb: used to retrieve te streets occupancy data from the db
	$scope.getProfitPMFromDb = function(year, month, weekday, dayType, hour, valueType, isFirst){
		$scope.streetMapReady = false;
		var markers = [];
		var allPMs = [];
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
		console.log("Params passed in ws get call" + JSON.stringify(params)); //if($scope.showLogs)
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/parkingmeters", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allPMs);
		    console.log("pms profit retrieved from db: " + JSON.stringify(result));	//if($scope.showLogs)
		    //$scope.updateLoadingMapState();
		    $scope.parkingMeterWS = $scope.initPMObjects(allPMs);
		    
		    if(showPm){
		    	for (var i = 0; i <  $scope.parkingMeterWS.length; i++) {
		    		markers.push(createMarkers(i, $scope.parkingMeterWS[i], 4));
		    	}
		    	angular.copy(markers, $scope.parkingMetersMarkers);
		    }
		    sharedDataService.setSharedLocalPms(allPMs);
		    
		    if(showStreets){
		    	$scope.updateStreetProfit(true, $scope.dashboard_space.microzone);
			}
		    if(showZones){
		    	$scope.updateZoneProfit(true);
		    }
		    if(showArea){
		    	$scope.updateAreaProfit(true);
		    }
		    
		    if(isFirst){
		    	var d = new Date();
		    	var hour = "10;12";
		    	$scope.getOccupancyParksFromDb(d.getFullYear(), d.getMonth(), null, "wd", hour, 1, 1);
		    } else {
		    	$scope.closeLoadingMap();
		    }
		});
	};
	
	// Method getOccupancyStreetsFromDb: used to retrieve te streets occupancy data from the db
	$scope.getOccupancyStreetsUpdatesFromDb = function(year, month, weekday, dayType, hour, valueType, oldStreets){
		$scope.streetMapReady = false;
		$scope.streetCvsFile = "";
		$scope.zoneCvsFile = "";
		$scope.areaCvsFile = "";
		$scope.structCvsFile = "";
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
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancychanged/" + idApp + "/streets", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allStreet);
		    //console.log("streets occupancy retrieved from db: " + JSON.stringify(result));
		    $scope.updateLoadingMapState();
		    $scope.myTmpZoneOccupation = [];
		    allStreet = $scope.mergeStreetsObjects(allStreet, oldStreets);	
		    $scope.streetWS = $scope.initStreetsObjects(allStreet);
		    if($scope.useAverageZoneOccupation){
			    for(var i = 0; i < $scope.streetWS.length; i++){
				    if($scope.streetWS[i].occupancyRate == -1){
						var found = false;
						for(var x = 0; x < $scope.myTmpZoneOccupation.length; x++){
							if($scope.streetWS[i].myZones[0].id == $scope.myTmpZoneOccupation[x].id){
								$scope.streetWS[i].occupancyRate = $scope.myTmpZoneOccupation[x].occupancy;
								found = true;
							}
						}
						if(!found){
							var zVal = {
								id: $scope.streetWS[i].myZones[0].id,
								occupancy: Math.floor($scope.getStreetsInZoneOccupancy($scope.streetWS[i].myZones[0].id))	// here I calculate the zone average occupancy
							};
							$scope.myTmpZoneOccupation.push(zVal);
							$scope.streetWS[i].occupancyRate = zVal.occupancy;
						}
				    }
			    }
		    }
		    
		    var isInList = sharedDataService.getIsInList();
		    if(!isInList){
			    if(showStreets){
			    	$scope.updateStreetOccupancy($scope.streetWS);
				}
			    if(showZones){
			    	$scope.updateZoneOccupancy(false);
			    }
			    if(showArea){
			    	$scope.updateAreaOccupancy(false);
			    }
		    } else {
		    	$scope.updateZonesOccupancy();
		    	$scope.updateAreasOccupancy();
		    	$scope.closeLoadingMap();
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
		if($scope.showLogs)console.log("Params passed in ws get call for Parks" + JSON.stringify(params));
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructures", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allParks);
		    //console.log("streets occupancy retrieved from db: " + JSON.stringify(result));
		    $scope.updateLoadingMapState();
		    $scope.actualParks = allParks;
		    $scope.pstructWS = allParks;
		    
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
		    //$scope.updateParksOccupancy();
		});
	};
	
	// Method getOccupancyParksFromDb: used to retrieve te parks occupancy data from the db
	$scope.getOccupancyParksUpdatedFromDb = function(year, month, weekday, dayType, hour, valueType, callType, oldParks){
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
		if($scope.showLogs)console.log("Params passed in ws get call for Parks" + JSON.stringify(params));
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancychanged/" + idApp + "/parkingstructures", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allParks);
		    //console.log("streets occupancy retrieved from db: " + JSON.stringify(result));
		    $scope.updateLoadingMapState();
		    
		    allParks = $scope.mergeParksObjects(allParks, oldParks);
		    $scope.actualParks = allParks;
		    $scope.pstructWS = allParks;
		    
		    //var isInList = sharedDataService.getIsInList();
		    //if(!isInList){
			    if(showPs){
			    	for (var i = 0; i <  allParks.length; i++) {
				    	markers.push(createMarkers(i, allParks[i], 2));
				    }
			    	angular.copy(markers, $scope.parkingStructureMarkers);
			    	$scope.updateParkOccupancy();
			    }
		    //} else {
		    //	$scope.updateParksOccupancy();
		    //}
		    if(callType == 1){
		    	$scope.getBikePointFromDb();
		    }
		});
	};
	
	// Method mergeStreetsObjects: used to merge the dynamic stat data with the complete streets data
	$scope.mergeStreetsObjects = function(newStreets, oldStreets){
		var mergedStreets = [];
		for(var i = 0; i < oldStreets.length; i++){
			var found = false;
			for(var j = 0; ((j < newStreets.length) && !found); j++){
				if(oldStreets[i].id == newStreets[j].id){
					found = true;
					var s = {
						id: oldStreets[i].id,
						id_app: oldStreets[i].id_app,
						streetReference : oldStreets[i].streetReference,
						slotNumber: newStreets[j].slotNumber,
						freeParkSlotNumber: newStreets[j].freeParkSlotNumber,
						freeParkSlotOccupied: newStreets[j].freeParkSlotOccupied,
						freeParkSlotSignNumber: newStreets[j].freeParkSlotSignNumber,
						freeParkSlotSignOccupied: newStreets[j].freeParkSlotSignOccupied,
						paidSlotNumber: newStreets[j].paidSlotNumber,
						paidSlotOccupied: newStreets[j].paidSlotOccupied,
						timedParkSlotNumber: newStreets[j].timedParkSlotNumber,
						timedParkSlotOccupied: newStreets[j].timedParkSlotOccupied,
						reservedSlotNumber: newStreets[j].reservedSlotNumber,
						reservedSlotOccupied: newStreets[j].reservedSlotOccupied,
						handicappedSlotNumber: newStreets[j].handicappedSlotNumber,
						handicappedSlotOccupied: newStreets[j].handicappedSlotOccupied,
						unusuableSlotNumber: newStreets[j].unusuableSlotNumber,
						subscritionAllowedPark: oldStreets[i].subscritionAllowedPark,
						rateAreaId: oldStreets[i].rateAreaId,
						geometry: oldStreets[i].geometry,
						color: oldStreets[i].color,
						zones: oldStreets[i].zones,
						parkingMeters: oldStreets[i].parkingMeters,
						lastChange: oldStreets[i].lastChange,
						occupancyRate: newStreets[i].occupancyRate
					};
					mergedStreets.push(s);
				}
			}
		}
		return mergedStreets;
	};
	
	// Method mergeParksObjects: used to merge the dynamic stat data with the complete parks data
	$scope.mergeParksObjects = function(newParks, oldParks){
		var mergedParks = [];
		for(var i = 0; i < oldParks.length; i++){
			var found = false;
			for(var j = 0; ((j < newParks.length) && !found); j++){
				if(oldParks[i].id == newParks[j].id){
					found = true;
					var p = {
						id: oldParks[i].id,
						id_app: oldParks[i].id_app,
						name: oldParks[i].name,
						streetReference: oldParks[i].streetReference,
						managementMode: oldParks[i].managementMode,
						fee: oldParks[i].fee,
						timeSlot: oldParks[i].timeSlot,
						slotNumber: newParks[j].slotNumber,
						slotOccupied: newParks[j].slotOccupied,
						handicappedSlotNumber: newParks[j].handicappedSlotNumber,
						handicappedSlotOccupied: newParks[j].handicappedSlotOccupied,
						unusuableSlotNumber: newParks[j].unusuableSlotNumber,
						geometry: oldParks[i].geometry,
						paymentMode: oldParks[i].paymentMode,
						phoneNumber: oldParks[i].phoneNumber,
						lastChange: oldParks[i].lastChange,
						occupancyRate: newParks[j].occupancyRate
					};
					mergedParks.push(p);
				}
			}
		}
		return mergedParks;
		
	};
	
	// Method getStreetsInZoneOccupancy: used to get the occupancy of the streets in a specific zone
	$scope.getStreetsInZoneOccupancy = function(z_id){
		var totalOccupancy = 0;
		var streetsInZone = 0;
		var noData = true;
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			for(var i = 0; i < $scope.streetWS.length; i++){
				var found = false;
				for(var j = 0; (j < $scope.streetWS[i].zones.length) && !found; j++){
					//var zone = $scope.getLocalZoneById(streets[i].zones[j]);
					//myZones.push(zone);
					if($scope.streetWS[i].zones[j] == z_id){
						found = true;
						streetsInZone += 1;
						if($scope.streetWS[i].occupancyRate > -1){
							totalOccupancy += $scope.streetWS[i].occupancyRate;
							noData = false;
						}
					}
				}
			}
		}
		if(streetsInZone != 0 && !noData){
			return totalOccupancy / streetsInZone;
		} else {
			return -1;
		}
	};
	
	$scope.getStreetsInZoneProfit = function(z_id){
		var totalProfit = 0;
		var streetsInZone = 0;
		var noData = true;
		if($scope.profitStreets != null && $scope.profitStreets.length > 0){
			for(var i = 0; i < $scope.profitStreets.length; i++){
				var found = false;
				for(var j = 0; (j < $scope.profitStreets[i].zones.length) && !found; j++){
					if($scope.profitStreets[i].zones[j] == z_id){
						found = true;
						streetsInZone += 1;
						if($scope.profitStreets[i].profit > -1){
							totalProfit += $scope.profitStreets[i].profit;
							noData = false;
						}
					}
				}
			}
		}
		if(streetsInZone != 0 && !noData){
			return totalProfit; // / streetsInZone;
		} else {
			return -1;
		}
	};
	
	// Method getStreetsInAreaOccupancy: used to get the occupancy of the streets in a specific area
	$scope.getStreetsInAreaOccupancy = function(a_id){
		var totalOccupancy = 0;
		var streetsInArea = 0;
		var noData = true;
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			//var found = false;
			for(var i = 0; i < $scope.streetWS.length; i++){// && !found
				if($scope.streetWS[i].rateAreaId == a_id){
					//found = true;
					streetsInArea += 1;
					if($scope.streetWS[i].occupancyRate > 0){
						totalOccupancy += $scope.streetWS[i].occupancyRate;
						noData = false;
					}
				}
			}
		}
		if(streetsInArea != 0 && !noData){
			return totalOccupancy / streetsInArea;
		} else {
			return -1;
		}
	};
	
	// Method getTotalSlotsInZone: used to count the total slots of a zone from the slots in streets
	$scope.getTotalSlotsInZone = function(z_id){
		var totalSlots = 0;
		var occupiedSlots = 0;
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			for(var i = 0; i < $scope.streetWS.length; i++){
				var found = false;
				for(var j = 0; (j < $scope.streetWS[i].zones.length) && !found; j++){
					//var zone = $scope.getLocalZoneById(streets[i].zones[j]);
					//myZones.push(zone);
					if($scope.streetWS[i].zones[j] == z_id){
						found = true;
						var mystreet = $scope.cleanStreetNullValue($scope.streetWS[i]);// NB: I have to use the average occupancy value and not the data stored in db
						var tmp_occ = $scope.getTotalOccupiedSlots(mystreet);
						totalSlots += mystreet.slotNumber;
						occupiedSlots += tmp_occ;
						
					}
				}
			}
		}
		return [totalSlots, occupiedSlots];
	};
	
	// Method getTotalSlotsInZone: used to count the total slots of a zone from the slots in streets
	$scope.getPaidSlotsInZone = function(z_id){
		var totalSlots = 0;
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			for(var i = 0; i < $scope.streetWS.length; i++){
				var found = false;
				for(var j = 0; (j < $scope.streetWS[i].zones.length) && !found; j++){
					//var zone = $scope.getLocalZoneById(streets[i].zones[j]);
					//myZones.push(zone);
					if($scope.streetWS[i].zones[j] == z_id){
						found = true;
						var mystreet = $scope.cleanStreetNullValue($scope.streetWS[i]);// NB: I have to use the average occupancy value and not the data stored in db
						totalSlots += mystreet.paidSlotNumber;
						
					}
				}
			}
		}
		return totalSlots;
	};	
	
	// Method getTotalSlotsInArea: used to count the total slots of an area from the slots in streets
	$scope.getTotalSlotsInArea = function(a_id){
		var totalSlots = 0;
		var occupiedSlots = 0;
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			for(var i = 0; i < $scope.streetWS.length; i++){
				if($scope.streetWS[i].rateAreaId == a_id){
					var mystreet = $scope.cleanStreetNullValue($scope.streetWS[i]);// NB: I have to use the average occupancy value and not the data stored in db
					var tmp_occ = $scope.getTotalOccupiedSlots(mystreet);
					totalSlots += mystreet.slotNumber;
					occupiedSlots += tmp_occ;
				}
			}
		}
		return [totalSlots, occupiedSlots];
	};
	
	// Method updateStreetOccupancy: update all street maps Object elements with new occupation data retrieved from db
	$scope.updateStreetOccupancy = function(streets){
		if($scope.dashboard_space.microzone){	// I check if the street check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapStreets.length == 0){
		   			$scope.mapStreets = $scope.initStreetsOnMap(streets, true, 1);
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap(streets, true, 1);
		   			$scope.switchStreetMapObject(3, tmpS, false);
		   		}
		   	} else {
		   		if($scope.occupancyStreets.length == 0){
		   			$scope.occupancyStreets = $scope.initStreetsOnMap(streets, true, 2);
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap(streets, true, 2);
		   	    	$scope.switchStreetMapObject(4, tmpS, false);
		    	}
		    }
		}
	};
	
	// Method updateZoneOccupancy: update all zone maps Object elements with new occupation data retrieved from db
	$scope.updateZoneOccupancy = function(firstTime){
		if($scope.dashboard_space.macrozone){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapZones.length == 0){
		   			$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true, 1, fals, firstTime);
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 1, false, firstTime);
		   			$scope.switchZoneMapObject(3, tmpZ);
		   		}
		   	} else {
		   		if($scope.occupancyZones.length == 0){
		   			$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, true, 2, false, firstTime);
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 2, false, firstTime);
		   	    	$scope.switchZoneMapObject(4, tmpZ);
		    	}
		    }
		}
	};
	
	// Method updateAreaOccupancy: update all area maps Object elements with new occupation data retrieved from db
	$scope.updateAreaOccupancy = function(firstTime){
		if($scope.dashboard_space.rate_area){	// I check if the area check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapAreas.length == 0){
		   			$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime);
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime);
		   			$scope.switchAreaMapObject(3, tmpA);
		   		}
		   	} else {
		   		if($scope.occupancyAreas.length == 0){
		   			$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, true, 2, false, firstTime);
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 2, false, firstTime);
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
	
	// Method updateStreetOccupancy: update all street maps Object elements with new occupation data retrieved from db
	$scope.updateStreetProfit = function(firstTime, show){
		if($scope.dashboard_space.microzone){	// I check if the street check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapStreets.length == 0){
		   			$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, show, 1);
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap($scope.streetWS, show, 1);
		   			$scope.switchStreetMapObject(5, tmpS, false);
		   		}
		   	} else {
		   		if($scope.profitStreets.length == 0){
		   			$scope.profitStreets = $scope.initStreetsOnMap($scope.streetWS, show, 3);
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap($scope.streetWS, show, 3);
		   	    	$scope.switchStreetMapObject(6, tmpS, false);
		    	}
		    }
		}
	};
	
	// Method updateZoneOccupancy: update all zone maps Object elements with new occupation data retrieved from db
	$scope.updateZoneProfit = function(firstTime){
		if($scope.dashboard_space.macrozone){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapZones.length == 0){
		   			$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true, 1, false, firstTime);
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 1, false, firstTime);
		   			$scope.switchZoneMapObject(3, tmpZ);
		   		}
		   	} else {
		   		if($scope.profitZones.length == 0){
		   			$scope.profitZones = $scope.initZonesOnMap($scope.zoneWS, true, 3, false, firstTime);
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 3, false, firstTime);
		   	    	$scope.switchZoneMapObject(4, tmpZ);
		    	}
		    }
		}
	};
	
	// Method updateAreaOccupancy: update all area maps Object elements with new occupation data retrieved from db
	$scope.updateAreaProfit = function(firstTime){
		if($scope.dashboard_space.rate_area){	// I check if the area check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapAreas.length == 0){
		   			$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime);
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime);
		   			$scope.switchAreaMapObject(3, tmpA);
		   		}
		   	} else {
		   		if($scope.profitAreas.length == 0){
		   			$scope.profitAreas = $scope.initAreasOnMap($scope.areaWS, true, 3, false, firstTime);
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 3, false, firstTime);
		   	    	$scope.switchAreaMapObject(4, tmpA);
		    	}
		    }
		}
	};
	
	// Method updateStreetOccupancy: update all street maps Object elements with new occupation data retrieved from db
	$scope.updateParkProfit = function(parks){
		if($scope.dashboard_space.parkingstructs){	// I check if the parkingstructures check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapParkingStructureMarkers.length == 0){
		   			$scope.mapParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
		   			$scope.switchParkingMapObject(3, tmpP);
		   		}
		   	} else {
		   		if($scope.profitParkingStructureMarkers.length == 0){
		   			$scope.profitParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 3);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 3);
		   	    	$scope.switchParkingMapObject(4, tmpP);
		    	}
		    }
		}
	};
		    
    $scope.getParkingMetersFromDb = function(){
	    var markers = [];
		var allParkingMeters = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/parkingmeter", null, $scope.authHeaders, null);
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
		var appId = sharedDataService.getConfAppId();
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/parkingstructure", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allParkingStructures);
		    //console.log("Parking Structures retrieved from db: " + JSON.stringify(result));
		    $scope.pstructWS = allParkingStructures;
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
		var appId = sharedDataService.getConfAppId();
		
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint", null, $scope.authHeaders, null);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/bikepoint", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allBikePoints);
	    	//console.log("BikePoints retrieved from db: " + JSON.stringify(result));
	    	
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
		var appId = sharedDataService.getConfAppId();
		
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/zone", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, allZones);
			//console.log("Zone retrieved from db: " + JSON.stringify(result));
		    	
			$scope.zoneWS = $scope.correctMyZones(allZones);
		 	sharedDataService.setSharedLocalZones($scope.zoneWS);
		    if(showZones){
		    	$scope.initZonesOnMap($scope.zoneWS, false, 1, false, true);
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
				var company = "";
				var appId = sharedDataService.getConfAppId();
				if(appId == 'rv'){ 
					company = "amr";
				} else {
					company = "tm";
				}
				var baseUrl = "rest/nosec";
				var defaultMarkerColor = "FF0000";
				var myAreaPm = {};
				
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
				//object.options.animation = "BOUNCE";
				//object.icon = $scope.useSelectedIcon(object.icon);
				myAreaPm = $scope.getLocalAreaById(object.data.areaId);
				object.icon = baseUrl+'/marker/'+company+'/parcometroneg/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
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
				//object.options.animation = "BOUNCE";
				object.icon = $scope.useSelectedIcon(object.icon);
				$scope.mapParkingStructureSelectedMarkers.push(object);
				$scope.psDetails = object;
				break;
			case 3:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 4;	//10
				object.stroke.opacity = 1.0;
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
			    // Here I add the street marker icon
			    var streetMarker = {
					id: 0 + "sm",
					position: object.path[1].latitude + "," + object.path[1].longitude,
					options: { 
						draggable: false,
					  	visible: true,
					   	map: null
					},
					icon: $scope.streetMarkerIcon,
					data: object,
					showWindow: false
				};
			    $scope.mapStreetSelectedMarkers.push(streetMarker);
			    $scope.showStreetDet();
				$scope.sDetails = object;
				break;
			case 4:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 3;	//10
				object.stroke.opacity = 1.0;
				object.fill.opacity = 0.8;
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
				object.stroke.weight = 3;
				object.stroke.opacity = 1.0;
				object.fill.opacity = 0.8;
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
		$scope.occupancyOpened = false;
		$scope.profitOpened = false;
		switch(type){
		case 1:
			var company = "";
			var appId = sharedDataService.getConfAppId();
			if(appId == 'rv'){ 
				company = "amr";
			} else {
				company = "tm";
			}
			var baseUrl = "rest/nosec";
			var defaultMarkerColor = "FF0000";
			var myAreaPm = {};
			myAreaPm = $scope.getLocalAreaById(object.data.areaId);
			//object.icon = $scope.useNormalIcon(object.icon);
			if($scope.theme == 0){
				object.icon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
			} else if($scope.theme == 2){
				var color = $scope.plainColor(object.myprofitColor);
				object.icon = baseUrl+'/marker/'+company+'/parcometro/'+((color != null && color != "") ? color : defaultMarkerColor);
			}
			if($scope.mapParkingMetersMarkers.length > 0){
				$scope.mapParkingMetersMarkers.push(object);
			} else if($scope.occupancyParkingMeterMarkers.length > 0){
				$scope.occupancyParkingMeterMarkers.push(object);
			} else if($scope.profitParkingMeterMarkers.length > 0){
				$scope.profitParkingMeterMarkers.push(object);
			}
			$scope.mapParkingMetersSelectedMarkers = [];
			break;
		case 2:
			object.icon = $scope.useNormalIcon(object.icon);
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
	    	object.stroke.opacity = 0.7;
	    	if($scope.mapStreets.length > 0){
	    		$scope.mapStreets.push(object);
	    	} else {
	    		$scope.occupancyStreets.push(object);
	    	}
	    	$scope.mapStreetSelectedMarkers = [];
			break;
		case 4:
			$scope.mapSelectedZones = [];
			var toDelZone = $scope.map.shapes;
	    	toDelZone[object.id].setMap(null);
	    	object.stroke.weight = 3;
	    	object.stroke.opacity = 0.7;
			object.fill.opacity = 0.5;
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
	    	object.stroke.opacity = 0.7;
	    	object.fill.opacity = 0.5;
	    	if($scope.mapAreas.length > 0){
	    		$scope.mapAreas.push(object);
	    	} else {
	    		$scope.occupancyAreas.push(object);
	    	}
			break;	
		};
	};
	
	$scope.useSelectedIcon = function(icon){
		if(icon.indexOf("_outline") > -1){
			icon = icon.substring(0, icon.length - 12);
		}
		return icon + ".png";
	};	
	
	$scope.useNormalIcon = function(icon){
		if(icon.indexOf(".png") > -1){
			icon = icon.substring(0, icon.length - 4);
		}
		return icon + "_outline.png";
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
				//object.options.animation = "BOUNCE";
				object.icon = $scope.useSelectedIcon(object.icon);
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
				//object.options.animation = "BOUNCE";
				object.icon = $scope.useSelectedIcon(object.icon);
				$scope.mapParkingStructureSelectedMarkers.push(object);
				$scope.psDetails = object;
				$scope.initPsOccupancyDiagram(object);
				break;
			case 3:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 4; //10;
				object.stroke.opacity = 1.0;
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
				 // Here I add the street marker icon
			    var streetMarker = {
					id: 0 + "sm",
					position: object.path[1].latitude + "," + object.path[1].longitude,
					options: { 
						draggable: false,
					  	visible: true,
					   	map: null
					},
					icon: $scope.streetMarkerIcon,
					data: object,
					showWindow: false
				};
			    $scope.mapStreetSelectedMarkers.push(streetMarker);
				$scope.sDetails = object;
			    $scope.initStreetOccupancyDiagram(object, 1);
				break;
			case 4:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 3; //10;
				object.stroke.opacity = 1.0;
				object.fill.opacity = 0.8;
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
				$scope.initZoneOccupancyDiagram(object, 1);
				break;
			case 5:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 3; //10;
				object.stroke.opacity = 1.0;
				object.fill.opacity = 0.8;
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
	
	$scope.showOccupancyInList = function(object, type){
		switch(type){
			case 1:
				$scope.showPMDet();
				$scope.pmDetails = object;
				break;
			case 2:
				$scope.showPSDet();
				$scope.psDetails = object;
				$scope.initPsOccupancyDiagram(object);
				break;
			case 3:
			    $scope.showStreetDet();
				object.freeParkSlotSignFree = (object.freeParkSlotSignNumber > 0) ? (object.freeParkSlotSignNumber - object.freeParkSlotSignOccupied) : 0;
				object.freeParkSlotFree = (object.freeParkSlotNumber > 0) ? (object.freeParkSlotNumber - object.freeParkSlotOccupied) : 0;
				object.paidSlotFree = (object.paidSlotNumber > 0 ) ? (object.paidSlotNumber - object.paidSlotOccupied) : 0;
				object.timedParkSlotFree = (object.timedParkSlotNumber > 0) ? (object.timedParkSlotNumber - object.timedParkSlotOccupied) : 0;
				object.handicappedSlotFree = (object.handicappedSlotNumber > 0) ? (object.handicappedSlotNumber - object.handicappedSlotOccupied) : 0;
				object.reservedSlotFree = (object.reservedSlotNumber > 0)? (object.reservedSlotNumber - object.reservedSlotOccupied) : 0;
				$scope.sDetails = object;
			    $scope.initStreetOccupancyDiagram(object, 2);
				break;
			case 4:
			    $scope.showZoneDet();
				$scope.zDetails = object;
				$scope.initZoneOccupancyDiagram(object, 2);
				break;
			case 5:
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
	    	object.stroke.opacity = 0.7;
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
	    	object.stroke.opacity = 0.7;
			object.fill.opacity = 0.5;
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
	    	object.stroke.opacity = 0.7;
	    	object.fill.opacity = 0.5;
	    	if($scope.mapAreas.length > 0){
	    		$scope.mapAreas.push(object);
	    	} else {
	    		$scope.occupancyAreas.push(object);
	    	}
			break;	
		};
	};
	
	$scope.showProfitDetails = function(event, object, type, theme){
		$scope.theme = theme;	// used in close details panel
		switch(type){
			case 1:
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
				for(var i = 0; i < $scope.profitParkingMeterMarkers.length; i++){
					if($scope.profitParkingMeterMarkers[i].id == object.id){
						$scope.profitParkingMeterMarkers.splice(i, 1);
					}
				}
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				$scope.showPMDet();
				var color = $scope.plainColor(object.myprofitColor);
				object.icon = baseUrl+'/marker/'+company+'/parcometroneg/'+((color != null && color != "") ? color : defaultMarkerColor);
				$scope.mapParkingMetersSelectedMarkers.push(object);
				$scope.pmDetails = object;
				break;
			case 2:
				for(var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
					if($scope.occupancyParkingStructureMarkers[i].id == object.id){
						$scope.occupancyParkingStructureMarkers.splice(i, 1);
					}
				}
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				$scope.showPSDet();
				//object.options.animation = "BOUNCE";
				object.icon = $scope.useSelectedIcon(object.icon);
				$scope.mapParkingStructureSelectedMarkers.push(object);
				$scope.psDetails = object;
				$scope.initPsOccupancyDiagram(object);
				break;
			case 3:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 4; //10;
				object.stroke.opacity = 1.0;
				var toDelStreet = $scope.map.shapes;
			    toDelStreet[object.id].setMap(null);		// I can access dinamically the value of the object shapes for street
			    for(var i = 0; i < $scope.profitStreets.length; i++){
				   	if($scope.profitStreets[i].id == object.id){
				   		$scope.profitStreets.splice(i, 1);
				   	}
			    }
			    $scope.mapSelectedStreets.push(object);
			    $scope.showStreetDet();
				 // Here I add the street marker icon
			    var streetMarker = {
					id: 0 + "sm",
					position: object.path[1].latitude + "," + object.path[1].longitude,
					options: { 
						draggable: false,
					  	visible: true,
					   	map: null
					},
					icon: $scope.streetMarkerIcon,
					data: object,
					showWindow: false
				};
			    $scope.mapStreetSelectedMarkers.push(streetMarker);
				$scope.sDetails = object;
			    //$scope.initStreetOccupancyDiagram(object, 1);
				break;
			case 4:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 3; //10;
				object.stroke.opacity = 1.0;
				object.fill.opacity = 0.8;
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
				$scope.initZoneOccupancyDiagram(object, 1);
				break;
			case 5:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				object.stroke.weight = 3; //10;
				object.stroke.opacity = 1.0;
				object.fill.opacity = 0.8;
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
		$scope.profitOpened = true;
		return object;
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
		$scope.profitOpened = false;
		$scope.mapStreetSelectedMarkers = [];
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
	
	$scope.closeAllDetailsList = function(){
		$scope.detailsOpened = false;
		$scope.occupancyOpened = false;
		$scope.profitOpened = false;
	};
	
	// Method used to check if an element is already selected
	$scope.fixIfAlreadySelected = function(list, type, theme){
		switch(type){
		case 1:
			if(list.length > 0){
				var object = list[0];
				var company = "";
				var appId = sharedDataService.getConfAppId();
				if(appId == 'rv'){ 
					company = "amr";
				} else {
					company = "tm";
				}
				var baseUrl = "rest/nosec";
				var defaultMarkerColor = "FF0000";
				
				if(theme == 0){
					var myAreaPm = {};
					myAreaPm = $scope.getLocalAreaById(object.data.areaId);
					object.icon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
					$scope.mapParkingMetersMarkers.push(object);
				} else if(theme == 1){
					$scope.occupancyParkingMeterMarkers.push(object);
				} else if(theme == 2){
					var color = $scope.plainColor(object.myprofitColor);
					object.icon = baseUrl+'/marker/'+company+'/parcometro/'+((color != null && color != "") ? color : defaultMarkerColor);
					$scope.profitParkingMeterMarkers.push(object);
				}
			}
			$scope.mapParkingMetersSelectedMarkers = [];
			break;
		case 2:
			if(list.length > 0){
				var object = list[0];
				//object.options.animation = "";
				object.icon = $scope.useNormalIcon(object.icon);
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
		    	object.stroke.opacity = 0.7;
		    	if(theme == 0){
		    		$scope.mapStreets.push(object);
		    	} else if(theme == 1){
		    		$scope.occupancyStreets.push(object);
		    	} else if(theme == 2){
		    		$scope.profitStreets.push(object);
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
		    	object.stroke.opacity = 0.7;
		    	object.fill.opacity = 0.5;
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
		    	object.stroke.opacity = 0.7;
		    	object.fill.opacity = 0.5;
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
    $scope.switchStreetMapObject = function(type, newList, firstTime){
    	// block to close detail data / occupancy data and to hide all occupancy streets in map
    	if($scope.mapSelectedStreets != null && $scope.mapSelectedStreets.length > 0){
    		$scope.mapStreetSelectedMarkers = [];
    		$scope.detailsOpened = false;	// I close the details column
    		$scope.occupancyOpened = false;
    		$scope.profitOpened = false;
			var toHideStreet = $scope.map.shapes;
			var object = {};
			angular.copy($scope.mapSelectedStreets[0], object);
			object.stroke.weight = 3;
			object.stroke.opacity = 0.7;
			if(type == 1 || type == 3){
				$scope.mapStreets.push(object);
			} else if(type == 2 || type == 4) {
				$scope.occupancyStreets.push(object);
			} else {
				$scope.profitStreets.push(object);
			}
			toHideStreet[$scope.mapSelectedStreets[0].id].setMap(null);
			$scope.mapSelectedStreets = [];
		}
    	var toHideStreets = $scope.map.shapes;
    	switch(type){
    		case 1:	// from street/profit to occupancy
    			if($scope.mapStreets.length > 0){
	    			for(var i = 0; i < $scope.mapStreets.length; i++){
	    	    		toHideStreets[$scope.mapStreets[i].id].setMap(null);
	    	    		var object = $scope.mapStreets[i];
	    	    		object.stroke.color = $scope.getOccupancyColor(object.data.occupancyRate);	//averageOccupation1012
	    	    		$scope.occupancyStreets.push(object);
	    	    	}
	    	    	$scope.mapStreets = [];
    			} else if($scope.profitStreets.length > 0){
    				for(var i = 0; i < $scope.profitStreets.length; i++){
	    	    		toHideStreets[$scope.profitStreets[i].id].setMap(null);
	    	    		var object = $scope.profitStreets[i];
	    	    		object.stroke.color = $scope.getOccupancyColor(object.data.occupancyRate);	//averageOccupation1012
	    	    		$scope.occupancyStreets.push(object);
	    	    	}
	    	    	$scope.profitStreets = [];
    			}
    			$scope.showStreetPolylines(2);
    			break;
    		case 2: // from occupancy/profit to street
    			if($scope.occupancyStreets.length > 0){
	    			for(var i = 0; i < $scope.occupancyStreets.length; i++){
	    	    		toHideStreets[$scope.occupancyStreets[i].id].setMap(null);
	    	    		var object = $scope.occupancyStreets[i];
	    	    		object.stroke.color = $scope.correctColor(object.data.color);
	    	    		$scope.mapStreets.push(object);
	    	    	}
	    	    	$scope.occupancyStreets = [];
    			} else if($scope.profitStreets.length > 0){
    				for(var i = 0; i < $scope.profitStreets.length; i++){
	    	    		toHideStreets[$scope.profitStreets[i].id].setMap(null);
	    	    		var object = $scope.profitStreets[i];
	    	    		object.stroke.color = $scope.correctColor(object.data.color);
	    	    		$scope.mapStreets.push(object);
	    	    	}
	    	    	$scope.profitStreets = [];
    			}
    			$scope.showStreetPolylines(1);
    			break;	
    		case 3: // from streets to streets
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
    		case 4: // from occupancy to occupancy
    			var tmpStreets = [];
    	    	for(var i = 0; i < $scope.occupancyStreets.length; i++){
    	    		toHideStreets[$scope.occupancyStreets[i].id].setMap(null);
    	    		var object = newList[i];
    	    		object.stroke.color = $scope.getOccupancyColor(object.data.occupancyRate);	//averageOccupation1012
    	    		tmpStreets.push(object);
    	    	}
    	    	angular.copy(tmpStreets, $scope.occupancyStreets);
    			break;	
    		case 5: // from street/occupancy to profit
    			if($scope.mapStreets.length > 0){
	    			for(var i = 0; i < $scope.mapStreets.length; i++){
	    	    		toHideStreets[$scope.mapStreets[i].id].setMap(null);
	    	    		var object = $scope.mapStreets[i];
	    	    		object.stroke.color = $scope.getProfitColor(object.data.profit);	//averageOccupation1012
	    	    		$scope.profitStreets.push(object);
	    	    	}
	    	    	$scope.mapStreets = [];
    			} else if($scope.occupancyStreets.length > 0){
    				for(var i = 0; i < $scope.occupancyStreets.length; i++){
        	    		toHideStreets[$scope.occupancyStreets[i].id].setMap(null);
        	    		var object = $scope.occupancyStreets[i];
        	    		object.stroke.color = $scope.getProfitColor(object.data.profit);
        	    		$scope.profitStreets.push(object);
        	    	}
        	    	$scope.occupancyStreets = [];
    			}
    			if(firstTime){
    	    		$scope.hideStreetPolylines(3);
    	    	}
    			break;
    		case 6: // from profit to profit
    			var tmpStreets = [];
    	    	for(var i = 0; i < $scope.profitStreets.length; i++){
    	    		toHideStreets[$scope.profitStreets[i].id].setMap(null);
    	    		var object = newList[i];
    	    		object.stroke.color = $scope.getProfitColor(object.data.profit);	//profit data
    	    		tmpStreets.push(object);
    	    	}
    	    	angular.copy(tmpStreets, $scope.profitStreets);
    			break;
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
    	if($scope.mapSelectedZones != null && $scope.mapSelectedZones.length > 0){
    		$scope.detailsOpened = false;	// I close the details column
    		$scope.occupancyOpened = false;
    		$scope.profitOpened = false;
			var toHideZone = $scope.map.shapes;
			var object = {};
			angular.copy($scope.mapSelectedZones[0], object);
			object.stroke.weight = 3;
			object.stroke.opacity = 0.7;
	    	object.fill.opacity = 0.5;
			if(type == 1 || type == 3){
				$scope.mapZones.push(object);
			} else {
				$scope.occupancyZones.push(object);
			}
			toHideZone[$scope.mapSelectedZones[0].id].setMap(null);
			$scope.mapSelectedZones = [];
		}
    	var toHideZones = $scope.map.shapes;
    	switch(type){
    		case 1:
    			for(var i = 0; i < $scope.mapZones.length; i++){
    	    		toHideZones[$scope.mapZones[i].id].setMap(null);
    	    		var object = $scope.mapZones[i];
    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.mapZones[i].id);
    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
    	    		object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.mapZones[i].id);
    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
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
    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.occupancyZones[i].id);
    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.occupancyZones[i].id);
    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
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
    	if($scope.mapSelectedAreas != null && $scope.mapSelectedAreas.length > 0){
    		$scope.detailsOpened = false;	// I close the details column
    		$scope.occupancyOpened = false;
    		$scope.profitOpened = false;
			var toHideArea = $scope.map.shapes;
			var object = {};
			angular.copy($scope.mapSelectedAreas[0], object);
			object.stroke.weight = 3;
			object.stroke.opacity = 0.7;
	    	object.fill.opacity = 0.5;
			if(type == 1 || type == 3){
				$scope.mapAreas.push(object);
			} else {
				$scope.occupancyAreas.push(object);
			}
			toHideArea[$scope.mapSelectedAreas[0].id].setMap(null);
			$scope.mapSelectedAreas = [];
		}
    	switch(type){
    		case 1:
    			for(var i = 0; i < $scope.mapAreas.length; i++){
    	    		toHideAreas[$scope.mapAreas[i].id].setMap(null);
    	    		var object = $scope.mapAreas[i];
    	    		var myAreaId = $scope.cleanAreaId($scope.mapAreas[i].id);
    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
    	    		object.stroke.color = $scope.getOccupancyColor(areaOccupancy);	//Here I have to add the streets that compose the area
    	    		object.fill.color = $scope.getOccupancyColor(areaOccupancy);
    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
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
    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
    	    		tmpAreas.push(object);
    	    	}
    	    	angular.copy(tmpAreas, $scope.occupancyAreas);
    			break;	
    		default:break;
    	}
    };
    
    // Method switchParkingMapObject: used to switch (in map) from parking object to occupancy-parking object
    $scope.switchParkingMapObject = function(type, newList){
    	if($scope.mapParkingStructureSelectedMarkers != null && $scope.mapParkingStructureSelectedMarkers.length > 0){
    		$scope.detailsOpened = false;	// I close the details column
    		$scope.occupancyOpened = false;
    		$scope.profitOpened = false;
    		var object = $scope.mapParkingStructureSelectedMarkers[0];
    		object.options.animation = "";
    		if(type == 1 || type == 3){
    			$scope.mapParkingStructureMarkers.push(object);
    		} else {
    			$scope.occupancyParkingStructureMarkers.push(object);
    		}
			$scope.mapParkingStructureSelectedMarkers = [];
		}
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
    
    $scope.getProfitColor = function(value){
    	if(value == -1){
    		return $scope.lightgray;
    	} else {
	    	if(value < 100){
	    		return $scope.lightgreen;
	    	} else if(value < 500){
	    		return $scope.green;
	    	} else if(value < 1000){
	    		return $scope.violet;
	    	} else {
	    		return $scope.blue;
	    	}
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
    				//image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_np.png";
    				image_url = "imgs/structIcons/parking_structures_gray_outline.png";
    				break;
    			case 3: break;
    			default: break;
    		}
    	} else if(value < 25){
    		switch(type){
    			case 1: break;
    			case 2:
    				//image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_green.png";
    				image_url = "imgs/structIcons/parking_structures_green_outline.png";
    				break;
    			case 3: break;
    			default: break;
    		}
    	} else if(value < 50){
    		switch(type){
				case 1: break;
				case 2:
					//image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_yellow.png";
					image_url = "imgs/structIcons/parking_structures_yellow_outline.png";
					break;
				case 3: break;
				default: break;
    		}
    	} else if(value < 75){
    		switch(type){
				case 1: break;
				case 2:
					//image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_orange.png";
					image_url = "imgs/structIcons/parking_structures_orange_outline.png";
					break;
				case 3: break;
				default: break;
    		}
    	} else if(value < 90){
    		switch(type){
				case 1: break;
				case 2:
					//image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_red.png";
					image_url = "imgs/structIcons/parking_structures_red_outline.png";
					break;
				case 3: break;
				default: break;
			}
    	} else {
    		switch(type){
				case 1: break;
				case 2:
					//image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_violet.png";
					image_url = "imgs/structIcons/parking_structures_violet_outline.png";
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
  
    $scope.initPsOccupancyDiagram = function(structure, type){
    	$scope.chartPsOccupancy.data = [["Posti", "num"]];
  	
  	//for(var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
  		var object;
  		if(type == 1){
  			object = structure.data;
  		} else {
  			object = structure;
  		}
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
    
    $scope.initStreetOccupancyDiagram = function(street, type){
      	$scope.chartStreetOccupancy.data = [["Posti", "number"]];
      	$scope.chartStreetFreeParkAvailability.data = [["Posti liberi", "number"]];
      	$scope.chartStreetOccupiedParkComposition.data = [["Posti occupati", "number"]];
      	var object = null;
      	if(type == 1){
      		object = street.data;
      	} else {
      		object = street;
      	}
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
    
    $scope.initZoneOccupancyDiagram = function(zone, type){
    	$scope.chartZoneOccupancy.data = [["Posti", "num"]];
  	//for(var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
    	var object;
    	if(type == 1){
    		object = zone.data;
    	} else {
    		object = zone;
    	}
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
    
    $scope.initAreaOccupancyDiagram = function(area, type){
    	$scope.chartAreaOccupancy.data = [["Posti", "num"]];
    	var object;
    	if(type == 1){
    		object = area.data;
    	} else {
    		object = area;
    	}
  		var dataTot = [ "Liberi", object.slotNumber - object.slotOccupied ];
  		var dataOcc = [ "Occupati", object.slotOccupied ];
  		$scope.chartAreaOccupancy.data.push(dataTot);
  		$scope.chartAreaOccupancy.data.push(dataOcc);
  		$scope.chartAreaOccupancy.options.title = "Posti occupati in area";
    };
	
   // ---------------------------------------------- End block Utilization diagrams --------------------------------------
    
   // ---------------------------------------------- Block for info panels ----------------------------------------------
    
    $scope.showInfo = function(value){
    	switch(value){
    		case 0:
    			$scope.showInfo_0 = true;
    			break;
    		case 1:
    			$scope.showInfo_1 = true;
    			break;
    		default:
				break;
    	}	
    };
    
    $scope.hideInfo = function(value){
    	switch(value){
    		case 0:
    			$scope.showInfo_0 = false;
    			break;
    		case 1:
    			$scope.showInfo_1 = false;
    			break;
    		default:
				break;
    	}	
    };
   
    // ------------------------------------------ End of block for info panels -------------------------------------------
    $scope.streetCvsFile = "";
    $scope.streetCvsFileName = "";
    $scope.zoneCvsFile = "";
    $scope.zoneCvsFileName = "";
    $scope.areaCvsFile = "";
    $scope.areaCvsFileName = "";
    $scope.structCvsFile = "";
    $scope.structCvsFileName = "";
    
    $scope.getStreetOccupancyCsv = function(){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var value = JSON.stringify($scope.streetWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "street/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetCvsFile = result;
	    	window.location.href = $scope.streetCvsFile;
	    });	
	};
	
	$scope.getZoneOccupancyCsv = function(){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var value = JSON.stringify($scope.zoneWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "zone/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneCvsFile = result;
	    	window.location.href = $scope.zoneCvsFile;
	    });	
	};
	
	$scope.getAreaOccupancyCsv = function(){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		
		var value = JSON.stringify($scope.areaWS);
	    console.log("Area list data : " + value);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "area/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaCvsFile = result;
	    	window.location.href = $scope.areaCvsFile;
	    });	
	};
	
	$scope.getStructureOccupancyCsv = function(){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var value = JSON.stringify($scope.pstructWS);
	    console.log("Structure list data : " + value);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "parkingstructures/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.structCvsFile = result;
//	    	$scope.structCvsFileName = result.substring(4, result.length);
	    	window.location.href = $scope.structCvsFile;
	    });	
	};
    
}]);