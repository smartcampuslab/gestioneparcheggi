'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');//, ['googlechart','angular-spinkit']
pm.controller('TimeFilterCtrl',['$scope', '$route', '$rootScope','$filter', 'localize', 'sharedDataService', 'initializeService', 'gMapService', 
                                function($scope, $route, $rootScope, $filter, localize, sharedDataService, initializeService, gMapService) {
	$scope.vis = 'vis_medium'; //vis_last_value
	$scope.visOptions = ['vis_medium','vis_last_value', 'vis_medium_year', 'vis_medium_month', 'vis_medium_day'];
	var date = new Date();
	$scope.years = [];
	$scope.year = "";
	$scope.dayOptions = {value:'custom'};//{value:'wd'};
	$scope.hourOptions = {value:'custom'};//{value:'morning'};
	
	for (var i = 0; i < 5; i++) {
		$scope.years.push('' + date.getFullYear()-i);
	}
	var initialMonth = (date.getMonth() == 0 ? date.getMonth()+1 : date.getMonth());
	var endMonth = (date.getMonth()+1);
	$scope.monthSliderValue = "1;12";//"" + initialMonth +";"+endMonth + "";
	$scope.monthSliderOptions = {       
		    from: 1,
		    to: 12,
		    step: 1,
		    modelLabels: {'1': 'GE', '2': 'FE', '3': 'MA', '4': 'AP', '5': 'MA', '6': 'GI', '7':'LU', '8': 'AG', '9': 'SE', '10': 'OT', '11': 'NO', '12': 'DI'}
	};
	$scope.monthSliderOptionsEng = {       
		    from: 1,
		    to: 12,
		    step: 1,
		    modelLabels: {'1': 'JA', '2': 'FE', '3': 'MA', '4': 'AP', '5': 'MA', '6': 'JU', '7':'JU', '8': 'AU', '9': 'SE', '10': 'OC', '11': 'NO', '12': 'DE'}
	};
	$scope.daySliderValue = "1,2,3,4,5,6,7";
	$scope.daySliderOptions = {       
		    from: 1,
		    to: 7,
		    step: 1,
		    modelLabels: {'1': 'LU', '2': 'MA', '3': 'ME', '4': 'GI', '5': 'VE', '6': 'SA', '7':'DO'}
	};
	$scope.dow_val = {
		mo : true,
		tu : true,
		we : true,
		th : true,
		fr : true,
		sa : true,
		su : true
	};
	
	$scope.toWeekArray = function(value){
		var arr = "";
		if(value.su){
			arr +="1,";
		}
		if(value.mo){
			arr +="2,";
		}
		if(value.tu){
			arr +="3,";
		}
		if(value.we){
			arr +="4,";
		}
		if(value.th){
			arr +="5,";
		}
		if(value.fr){
			arr +="6,";
		}
		if(value.sa){
			arr +="7,";
		}
		arr = arr.substring(0, arr.length-1);
		return arr;
	};	
	
	$scope.hourSliderValue = "0;23";//"10;12";
	$scope.hourSliderOptions = {
		    from: 0,
		    to: 23,
		    step: 1
	};
	
	$scope.isActiveItalian = function(){
        return (sharedDataService.getUsedLanguage() == 'ita');
    };
                  			
    $scope.isActiveEnglish = function(){
    	return (sharedDataService.getUsedLanguage() == 'eng');
    };
	
	// init shared filter values
	sharedDataService.setFilterVis($scope.vis);	
	sharedDataService.setFilterYear($scope.year);
    sharedDataService.setFilterMonth($scope.monthSliderValue);
    sharedDataService.setFilterDowType($scope.dayOptions.value);
    sharedDataService.setFilterDowVal($scope.daySliderValue);
    sharedDataService.setFilterHour($scope.hourSliderValue);
	
	// Method updateFilterObject: used to set to "all" the value of months (case type == 1), day of week (case type == 2) or hours (case type == 3)
	$scope.updateFilterObject = function(filter, type){	//, filtertype
		switch (type){
			case 1: // months
				if(filter.months){	// reverse case 
					$scope.monthSliderValue = "1;12";
				}
				break;
			case 2: // day of week
				if(filter.dows){	// reverse case 
					$scope.dayOptions.value = "custom";
					$scope.daySliderValue = "1,2,3,4,5,6,7";	//"1;7";
					$scope.dow_val = {
						mo : true,
						tu : true,
						we : true,
						th : true,
						fr : true,
						sa : true,
						su : true
					};
				}
				break;
			case 3:	// hours
				if(filter.hours){	// reverse case 
					$scope.hourOptions.value = "custom";
					$scope.hourSliderValue = "0;23";
				}
				break;
		}
		$scope.updateSearch();	//filtertype
	};
	
	$scope.updateYear = function(value){	//, type
		$scope.year = value;
		$scope.updateSearch();
	};
	
	$scope.updateMonth = function(value){	//, type
		$scope.monthSliderValue = value;
		$scope.updateSearch();
	};
	
	$scope.updateDay = function(value){		//, type
		//$scope.daySliderValue = value;
		//$scope.dow_val = value;
		$scope.updateSearch();
	};
	
	$scope.updateHour = function(value){	//, type
		$scope.hourSliderValue = value;
		$scope.updateSearch();
	};
	
	$scope.updateSearch = function(){	//type
		var type = 1;
		if(sharedDataService.getIsInList()){
			type = 2;
		}
		$scope.closeAllDetailsList();
		gMapService.loadMapsObject();
	    console.log("Visualizzazione: " + $scope.vis);
	    console.log("Anno: " + $scope.year);
	    console.log("Mesi: " + $scope.monthSliderValue);
	    console.log("Giorno - tipo: " + $scope.dayOptions.value);
	    $scope.daySliderValue = $scope.toWeekArray($scope.dow_val);
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
	    //--------------- Shared filter params ----------------
	    sharedDataService.setFilterVis($scope.vis);	
	    sharedDataService.setFilterYear($scope.year);
	    sharedDataService.setFilterMonth($scope.monthSliderValue);
	    sharedDataService.setFilterDowType($scope.dayOptions.value);
	    sharedDataService.setFilterDowVal($scope.daySliderValue);
	    sharedDataService.setFilterHour($scope.hourSliderValue);
	    //-----------------------------------------------------
	    if((type == 1 && $scope.dashboard_topics == "occupation") || (type == 2 && $scope.dashboard_topics_list == "occupation")){
		    switch($scope.vis){
		    	case "vis_last_value": 
		    		//$scope.getOccupancyStreetsFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1);
		    		$scope.getOccupancyStreetsUpdatesFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, $scope.streetWS, 1);
		    		//$scope.getOccupancyParksFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, 2);
		    		$scope.getOccupancyParksUpdatedFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, 2, $scope.actualParks, 1);
		    		break;
		    	case "vis_medium":
		    		$scope.getOccupancyStreetsUpdatesFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, $scope.streetWS, 1);
		    		$scope.getOccupancyParksUpdatedFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks, 1);
		    		break;
		    	case "vis_medium_year":
		    		$scope.getOccupancyStreetsUpdatesFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, $scope.streetWS, 1);
		    		$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks, 1);
		    		break;
		    	case "vis_medium_month":
		    		$scope.getOccupancyStreetsUpdatesFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, $scope.streetWS, 1);
		    		$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks, 1);
		    		break;
		    	case "vis_medium_day":
		    		$scope.getOccupancyStreetsUpdatesFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2, $scope.streetWS, 1);
		    		$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2, 2, $scope.actualParks, 1);
		    		break;
		    	default: break;	
		    }
	    } else if((type == 1 && $scope.dashboard_topics == "receipts") || (type == 2 && $scope.dashboard_topics_list == "receipts")){
	    	switch($scope.vis){
		    	case "vis_last_value": 
		    		$scope.getProfitPMFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, false);
		    		$scope.getProfitParksFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, false);
		    		//$scope.getOccupancyParksUpdatedFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, 2, $scope.actualParks);
		    		break;
		    	case "vis_medium":
		    		$scope.getProfitPMFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, false);
		    		$scope.getProfitParksFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, false);
		    		break;
		    	case "vis_medium_year":
		    		$scope.getProfitPMFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, false);
		    		$scope.getProfitParksFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, false);
		    		break;
		    	case "vis_medium_month":
		    		$scope.getProfitPMFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, false);
		    		$scope.getProfitParksFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, false);
		    		break;
		    	case "vis_medium_day":
		    		$scope.getProfitPMFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 1, false);
		    		$scope.getProfitParksFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 1, false);
		    		break;
		    	default: break;
	    	}
	    } else if((type == 1 && $scope.dashboard_topics == "timeCost") || (type == 2 && $scope.dashboard_topics_list == "timeCost")){
	    	switch($scope.vis){
	    	case "vis_last_value": 
	    		$scope.getOccupancyStreetsUpdatesFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, $scope.streetWS, 2);
	    		$scope.getOccupancyParksUpdatedFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 1, 2, $scope.actualParks, 2);
	    		break;
	    	case "vis_medium":
	    		$scope.getOccupancyStreetsUpdatesFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, $scope.streetWS, 2);
	    		$scope.getOccupancyParksUpdatedFromDb($scope.year, $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks, 2);
	    		break;
	    	case "vis_medium_year":
	    		$scope.getOccupancyStreetsUpdatesFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, $scope.streetWS, 2);
	    		$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), $scope.monthSliderValue, $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks, 2);
	    		break;
	    	case "vis_medium_month":
	    		$scope.getOccupancyStreetsUpdatesFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, $scope.streetWS, 2);
	    		$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), d.getMonth(), $scope.daySliderValue, $scope.dayOptions.value, $scope.hourSliderValue, 2, 2, $scope.actualParks, 2);
	    		break;
	    	case "vis_medium_day":
	    		$scope.getOccupancyStreetsUpdatesFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2, $scope.streetWS, 2);
	    		$scope.getOccupancyParksUpdatedFromDb(d.getFullYear(), d.getMonth(), weekDay, null, $scope.hourSliderValue, 2, 2, $scope.actualParks, 2);
	    		break;
	    	default: break;	
	    	}
	    }
	};

}]);

pm.controller('ViewDashboardCtrlPark',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', '$dialogs', 'sharedDataService', 'invokeDashboardWSService', 'invokeDashboardWSServiceNS', 'invokeWSServiceProxy', 'initializeService', 'utilsService', 'gMapService', 'areaService', 'zoneService', '$timeout', '$q', 
                               function($scope, $http, $route, $routeParams, $rootScope, localize, $dialogs, sharedDataService, invokeDashboardWSService, invokeDashboardWSServiceNS, invokeWSServiceProxy, initializeService, utilsService, gMapService, areaService, zoneService, $timeout, $q, $location, $filter) {

	$scope.disableThemes = false;	//Used to disable/enable themes buttons selection
	$scope.showLogs = false;
	
	$scope.firstLoad = true;
	
    $scope.all_mode = "all mode";
    $scope.day_mode = "day mode";
    $scope.night_mode = "night mode";
    
    $scope.ita_lang = "ita";
    $scope.eng_lang = "eng";
	
	$scope.wait_dialog_text_string_it = "Aggiornamento dati in corso...";
	$scope.wait_dialog_text_string_en = "Loading elements...";
	$scope.wait_dialog_title_string_it = "Attendere Prego";
	$scope.wait_dialog_title_string_en = "Please Wait";
	
	$scope.parkingMetersMarkers = [];	// list from DB
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	$scope.mapParkingMetersMarkers = [];
	$scope.mapParkingStructureMarkers = [];
	$scope.mapBikePointMarkers = [];
	$scope.streetWS = [];
	$scope.microzoneWS = [];
	$scope.pstructWS = [];
	$scope.allDataStructWS = [];
	$scope.mapStreets = [];
	$scope.mapZones = [];
	$scope.mapMicroZones = [];
	// multi mapZones objects;
	$scope.mapZones0 = [];
	$scope.mapZones1 = [];
	$scope.mapZones2 = [];
	$scope.mapZones3 = [];
	$scope.mapZones4 = [];
	
	$scope.mapAreas = [];
	$scope.actualParks = [];
	
	$scope.occupancyStreets = [];
	$scope.occupancyAreas = [];
	$scope.occupancyZones = [];
	$scope.occupancyMicroZones = [];
	// multi occupancyZones objects;
	$scope.occupancyZones0 = [];
	$scope.occupancyZones1 = [];
	$scope.occupancyZones2 = [];
	$scope.occupancyZones3 = [];
	$scope.occupancyZones4 = [];
	$scope.occupancyParkingMeterMarkers = [];
	$scope.occupancyParkingStructureMarkers = [];
	$scope.mapStreetSelectedMarkers = [];
	
	$scope.profitStreets = [];
	$scope.profitAreas = [];
	$scope.profitZones = [];
	$scope.profitMicroZones = [];
	// multi profitZones objects;
	$scope.profitZones0 = [];
	$scope.profitZones1 = [];
	$scope.profitZones2 = [];
	$scope.profitZones3 = [];
	$scope.profitZones4 = [];
	$scope.profitParkingMetersMarkers = [];
	$scope.profitParkingStructureMarkers = [];
	$scope.profitStructWS = [];
	
	$scope.timeCostStreets = [];
	$scope.timeCostAreas = [];
	$scope.timeCostZones = [];
	$scope.timeCostMicroZones = [];
	// multi timeCostZones objects;
	$scope.timeCostZones0 = [];
	$scope.timeCostZones1 = [];
	$scope.timeCostZones2 = [];
	$scope.timeCostZones3 = [];
	$scope.timeCostZones4 = [];
	$scope.timeCostParkingStructureMarkers = [];
	
	$scope.profitStreetsList = [];
	$scope.profitZoneList = [];
	$scope.profitAreaList = [];
	$scope.zone0_label = initializeService.getLabel0();
	$scope.zone1_label = initializeService.getLabel1();
	$scope.zone2_label = initializeService.getLabel2();
	$scope.zone3_label = initializeService.getLabel3();
	$scope.zone4_label = initializeService.getLabel4();
	
	$scope.myTmpZoneOccupation = [];	//MB28072015: added this variable to manage average zone occupation
	$scope.useAverageZoneOccupation = false;	// to remove this feature set the variable to false
	var showOtherFilterSettings = false;
	
	$scope.addReportFunctions = false;
	
	 // DB type for zone. I have to implement a good solution for types
    var macrozoneType = "zonemacro";
    var microzoneType = "zonemicro";
    
    $scope.setMapZoneList = function(z_index, value){
    	switch(z_index){
	    	case 0:
	    		$scope.mapZones0 = value;
	    		break;
	    	case 1:
	    		$scope.mapZones1 = value;
	    		break;
	    	case 2:
	    		$scope.mapZones2 = value;
	    		break;
	    	case 3:
	    		$scope.mapZones3 = value;
	    		break;
	    	case 4:
	    		$scope.mapZones4 = value;
	    		break;
    	}
    };
    
    $scope.getMapZoneList = function(z_index){
    	switch(z_index){
	    	case 0:
	    		return $scope.mapZones0;
	    		break;
	    	case 1:
	    		return $scope.mapZones1;
	    		break;
	    	case 2:
	    		return $scope.mapZones2;
	    		break;
	    	case 3:
	    		return $scope.mapZones3;
	    		break;
	    	case 4:
	    		return $scope.mapZones4;
	    		break;
    	}
    };
    
    $scope.setOccupancyZoneList = function(z_index, value){
    	switch(z_index){
	    	case 0:
	    		$scope.occupancyZones0 = value;
	    		break;
	    	case 1:
	    		$scope.occupancyZones1 = value;
	    		break;
	    	case 2:
	    		$scope.occupancyZones2 = value;
	    		break;
	    	case 3:
	    		$scope.occupancyZones3 = value;
	    		break;
	    	case 4:
	    		$scope.occupancyZones4 = value;
	    		break;
    	}
    };
    
    $scope.getOccupancyZoneList = function(z_index){
    	switch(z_index){
	    	case 0:
	    		return $scope.occupancyZones0;
	    		break;
	    	case 1:
	    		return $scope.occupancyZones1;
	    		break;
	    	case 2:
	    		return $scope.occupancyZones2;
	    		break;
	    	case 3:
	    		return $scope.occupancyZones3;
	    		break;
	    	case 4:
	    		return $scope.occupancyZones4;
	    		break;
    	}
    };
    
    $scope.setProfitZoneList = function(z_index, value){
    	switch(z_index){
	    	case 0:
	    		$scope.profitZones0 = value;
	    		break;
	    	case 1:
	    		$scope.profitZones1 = value;
	    		break;
	    	case 2:
	    		$scope.profitZones2 = value;
	    		break;
	    	case 3:
	    		$scope.profitZones3 = value;
	    		break;
	    	case 4:
	    		$scope.profitZones4 = value;
	    		break;
    	}
    };
    
    $scope.getProfitZoneList = function(z_index){
    	switch(z_index){
	    	case 0:
	    		return $scope.profitZones0;
	    		break;
	    	case 1:
	    		return $scope.profitZones1;
	    		break;
	    	case 2:
	    		return $scope.profitZones2;
	    		break;
	    	case 3:
	    		return $scope.profitZones3;
	    		break;
	    	case 4:
	    		return $scope.profitZones4;
	    		break;
    	}
    };
    
    $scope.setTimeCostZoneList = function(z_index, value){
    	switch(z_index){
	    	case 0:
	    		$scope.timeCostZones0 = value;
	    		break;
	    	case 1:
	    		$scope.timeCostZones1 = value;
	    		break;
	    	case 2:
	    		$scope.timeCostZones2 = value;
	    		break;
	    	case 3:
	    		$scope.timeCostZones3 = value;
	    		break;
	    	case 4:
	    		$scope.timeCostZones4 = value;
	    		break;
    	}
    };
    
    $scope.getTimeCostZoneList = function(z_index){
    	switch(z_index){
	    	case 0:
	    		return $scope.timeCostZones0;
	    		break;
	    	case 1:
	    		return $scope.timeCostZones1;
	    		break;
	    	case 2:
	    		return $scope.timeCostZones2;
	    		break;
	    	case 3:
	    		return $scope.timeCostZones3;
	    		break;
	    	case 4:
	    		return $scope.timeCostZones4;
	    		break;
    	}
    };
	
	$scope.setAverageZoneValue = function(value){
		$scope.useAverageZoneOccupation = value;
	};
	
	$scope.showOtherSettings = function(value){
		showOtherFilterSettings = value;
	};
	
	$scope.isOtherSettingsShow = function(){
		return showOtherFilterSettings;
	};
	
	$scope.reportShareList = [];
	$scope.lightgray = "#B0B0B0";//"#81EBBA";
	$scope.lightgreen = "#37EC0E";
	$scope.green = "#31B404";
	$scope.yellow = "#F7FE2E";
	$scope.orange = "#FF8000";
	$scope.red = "#DF0101";
	$scope.violet = "#8904B1";
	$scope.blue = "#383BEE";
	$scope.pmMarkerIcon = "imgs/markerIcons/parcometro.png";			// icon for parkingMeter object
	$scope.psMarkerIcon = "imgs/structIcons/parking_structures_general_outline.png";	// icon for parkingStructure object
	$scope.bpMarkerIcon = "imgs/markerIcons/puntobici.png";				// icon for bikePoint object
	$scope.streetMarkerIcon = "imgs/street_marker.png";					// icon for street marker
	
	$scope.dayMON = "MO";
    $scope.dayTUE = "TU";
    $scope.dayWED = "WE";
    $scope.dayTHU = "TH";
    $scope.dayFRI = "FR";
    $scope.daySAT = "SA";
    $scope.daySUN = "SU";
	
	$scope.getWeekDaysFromArray = function(weekDaysBool, type){
    	var weekDaysString = [];
    	if(type == 0){
    		for(var i = 0; i < weekDaysBool.length; i++){
    			// case type 0: I have a string of vals 'MO', 'TU' ecc.... and i have to get the relative i18n value
        		switch(weekDaysBool[i]){
        			case $scope.dayMON: 
        				weekDaysString.push('period_monday');
        				break;
        			case $scope.dayTUE: 
        				weekDaysString.push('period_tuesday');
        				break;
        			case $scope.dayWED: 
        				weekDaysString.push('period_wednesday');
        				break;
        			case $scope.dayTHU: 
        				weekDaysString.push('period_thursday');
        				break;
        			case $scope.dayFRI: 
        				weekDaysString.push('period_friday');
        				break;
        			case $scope.daySAT: 
        				weekDaysString.push('period_saturday');
        				break;
        			case $scope.daySUN: 
        				weekDaysString.push('period_sunday');
        				break;	
        			default: break;
        		}
    		}
    	} else {
    	if(weekDaysBool){
    		for(var i = 0; i < weekDaysBool.length; i++){
    			switch(i){
    				case 0:
    					if(weekDaysBool[i]){
    						weekDaysString.push($scope.dayMON);
    					}
    					break;
    				case 1: 
    					if(weekDaysBool[i]){
    						weekDaysString.push($scope.dayTUE);
    					}
    					break;
    				case 2: 
    					if(weekDaysBool[i]){
    						weekDaysString.push($scope.dayWED);
    					}
    					break;
    				case 3: 
    					if(weekDaysBool[i]){
    						weekDaysString.push($scope.dayTHU);
    					}
    					break;
    				case 4: 
    					if(weekDaysBool[i]){
    						weekDaysString.push($scope.dayFRI);
    					}
    					break;
    				case 5: 
    					if(weekDaysBool[i]){
    						weekDaysString.push($scope.daySAT);
    					}
    					break;
    				case 6: 
    					if(weekDaysBool[i]){
    						weekDaysString.push($scope.daySUN);
    					}
    					break;
    				default: break;
    			}
    		}
    	}
    	}
    	return weekDaysString;
    };
	
	$scope.authHeaders = {
	    'Accept': 'application/json;charset=UTF-8'
	};
	
	$scope.launchReport = function(report){
		if(report!=null){
			if(report != 'history'){
				sharedDataService.setSavedReport(report);
			} else {
				var rep_name = "dati_storici_" + $scope.generateReportName();
				sharedDataService.setReportName(rep_name);
			}
		} else {
			var rep_name = $scope.generateReportName();
			sharedDataService.setReportName(rep_name);
		}
		var dlg = $dialogs.create('/dialogs/report.html','reportCtrl',{},{key: false,back: 'static'});
        dlg.result.then(function(name){
            $scope.name = name;
          },function(){
            $scope.name = 'You decided not to enter in your name, that makes me sad.';
          });
	};
	
	$scope.generateReportName = function(){
		
		//--------------- Shared filter params ----------------
		var year = sharedDataService.getFilterYear();
		var month = sharedDataService.getFilterMonth();
		var dowType = sharedDataService.getFilterDowType();
		var dowVal = sharedDataService.getFilterDowVal();
		var hour = sharedDataService.getFilterHour();
		//-----------------------------------------------------
		
		var title_map = "";
		if($scope.dashboard_space_list == "rate_area"){
			title_map = "areatariffazione_";
		} else if($scope.dashboard_space_list == "macrozone"){
			title_map = "macrozona_";
		} else if($scope.dashboard_space_list == "microzone"){
			title_map = "via_";
		} else if($scope.dashboard_space_list == "microzone_part"){
			title_map = "sottovia_";
		} else if($scope.dashboard_space_list == "parkingstructs"){
			title_map = "parcheggiostruttura_";
		} else if($scope.dashboard_space_list == "parkingmeter"){
			title_map = "parcometro_";
		}
		
		switch ($scope.dashboard_topics_list){
			case "occupation": 
				title_map += "occupazione_";
				break;
			case "receipts": 
				title_map += "incasso_";
				break;
			case "timeCost": 
				title_map += "costoaccesso_";
				break;	
			default: break;
		}
		
		if(year != null && year != ""){
			title_map += year + "_";
		}
		
		if(month != null && month != ""){
			var months_val = month.split(";");
			if(months_val.length > 1){
				title_map += $scope.getCorrectTitleValFromFilter(months_val[0], 1) + $scope.getCorrectTitleValFromFilter(months_val[1], 1);
			} else {
				title_map += $scope.getCorrectTitleValFromFilter(months_val[0], 1);
			}
		}
		
		if(dowType != null && dowType != ""){
			if(dowType != "custom"){
				if(dowType == "we"){
					title_map += "festivo_";
				} else {
					title_map += "feriale_";
				}
			} else {
				var week_day_title = "";
				var dow_value = dowVal.split(",");
				if(dow_value.length == 7){
					week_day_title = "tutti_";
				} else {
					for(var i = 0; i < dow_value.length; i++){
						if(dow_value[i] == "1"){
							week_day_title+="lu_";
						}
						if(dow_value[i] == "2"){
							week_day_title+="ma_";
						}
						if(dow_value[i] == "3"){
							week_day_title+="me_";
						}
						if(dow_value[i] == "4"){
							week_day_title+="gi_";
						}
						if(dow_value[i] == "5"){
							week_day_title+="ve_";
						}
						if(dow_value[i] == "6"){
							week_day_title+="sa_";
						}
						if(dow_value[i] == "7"){
							week_day_title+="do_";
						}
					}
					//week_day_title = week_day_title.substring(0, week_day_title.length-1);
				}
				title_map += week_day_title;
//				if(dow_value.length > 1){
//					title_map += $scope.getCorrectTitleValFromFilter(dow_value[0], 2) + $scope.getCorrectTitleValFromFilter(dow_value[1], 2);
//				} else {
//					title_map += $scope.getCorrectTitleValFromFilter(dow_value[0], 2);
//				}
			}
		}
		
		if(hour != null && hour != ""){
			var hour_val = hour.split(";");
			if(hour_val.length > 1){
				title_map += hour_val[0] + "_" + hour_val[1];
			} else {
				title_map += hour_val[0];
			}
			
		}
		return title_map; // + ".csv"
	};
	
	$scope.getCorrectTitleValFromFilter = function(value, type){
		var val_title = "";
		if(type == 1){
			// months
			switch(value){
				case "1":
					val_title = "gennaio_";
					break;
				case "2":
					val_title = "febbraio_";
					break;
				case "3":
					val_title = "marzo_";
					break;
				case "4":
					val_title = "aprile_";
					break;
				case "5":
					val_title = "maggio_";
					break;
				case "6":
					val_title = "giugno_";
					break;
				case "7":
					val_title = "luglio_";
					break;
				case "8":
					val_title = "agosto_";
					break;
				case "9":
					val_title = "settembre_";
					break;
				case "10":
					val_title = "ottobre_";
					break;
				case "11":
					val_title = "novembre_";
					break;
				case "12":
					val_title = "dicembre_";
					break;
			}
		} else if(type == 2){
			// day of week
			switch(value){
				case "1":
					val_title = "lunedi_";
					break;
				case "2":
					val_title = "martedi_";
					break;
				case "3":
					val_title = "mercoledi_";
					break;
				case "4":
					val_title = "giovedi_";
					break;
				case "5":
					val_title = "venerdi_";
					break;
				case "6":
					val_title = "sabato_";
					break;
				case "7":
					val_title = "domenica_";
					break;
			}
		}
		return val_title;
	};
	
	// --------------- Block for title of the map (describe the element showed in the map ------------------
	$scope.getZoneLabelFromConfigurationFile = function(id){
		var allZoneTypes = sharedDataService.getZoneTypeList();
		var zonelabel0 = "";
		var zonelabel1 = "";
		var zonelabel2 = "";
		var zonelabel3 = "";
		var zonelabel4 = "";
		for(var i = 0; i < allZoneTypes.length; i++){
			switch(i){
				case 0:
					zonelabel0 = allZoneTypes[i];
					break;
				case 1: 
					zonelabel1 = allZoneTypes[i];
					break;
				case 2: 
					zonelabel2 = allZoneTypes[i];
					break;
				case 3: 
					zonelabel3 = allZoneTypes[i];
					break;
				case 4: 
					zonelabel4 = allZoneTypes[i];
					break;
			}
		}
		switch(id){
			case 0:
				return zonelabel0;
				break;
			case 1: 
				return zonelabel1;
				break;
			case 2: 
				return zonelabel2;
				break;
			case 3: 
				return zonelabel3;
				break;
			case 4: 
				return zonelabel4;
				break;
		}
	}
	
	$scope.title_map = "Offerta di sosta: Parcheggi";
	$scope.title_map_eng = "Parking supply: Parking lots";
	$scope.update_title_map = function(inverse, type, exlude){
		switch ($scope.dashboard_topics){
			case "parkSupply": 
				$scope.title_map = "Offerta di sosta: ";
				$scope.title_map_eng = "Parking supply: ";
				if(!inverse){
					$scope.controlCheckedArea("");
				} else {
					if(type == "rate_area"){
						if(exlude != "rate_area"){
							$scope.title_map = "Aree Tariffarie, ";
							$scope.title_map_eng = "Rateing areas, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone0"){
						if(exlude != "zone0"){
							$scope.title_map +=$scope.getZoneLabelFromConfigurationFile(0).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone1"){
						if(exlude != "zone1"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(1).label + ", ";
							$scope.title_map_eng += "Streets, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone2"){
						if(exlude != "zone2"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(2).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone3"){
						if(exlude != "zone3"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(3).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone4"){
						if(exlude != "zone4"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(4).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone_part"){
						if(exlude != "microzone_part"){
							$scope.title_map += "Parcheggi, ";
							$scope.title_map_eng += "Parking lots, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "parkingstructs"){
						if(exlude != "parkingstructs"){
							$scope.title_map += "Strutture Parcheggio, ";
							$scope.title_map_eng += "Parking structures, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "parkingmeter"){
						if(exlude != "parkingmeter"){
							$scope.title_map += "Parcometri, ";
							$scope.title_map_eng += "Parking meters, ";
						}
						$scope.controlCheckedArea(exlude);
					}
				}
				break;
			case "occupation": 
				$scope.title_map = "Occupazione: ";
				$scope.title_map_eng = "Occupation: ";
				if(!inverse){
					$scope.controlCheckedArea("");
				} else {
					if(type == "rate_area"){
						if(exlude != "rate_area"){
							$scope.title_map = "Aree Tariffarie, ";
							$scope.title_map_eng = "Rateing areas, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone0"){
						if(exlude != "zone0"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(0).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone1"){
						if(exlude != "zone1"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(1).label + ", ";
							$scope.title_map_eng += "Streets, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone2"){
						if(exlude != "zone2"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(2).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone3"){
						if(exlude != "zone3"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(3).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone4"){
						if(exlude != "zone4"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(4).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone_part"){
						if(exlude != "microzone_part"){
							$scope.title_map += "Parcheggi, ";
							$scope.title_map_eng += "Parking lots, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "parkingstructs"){
						if(exlude != "parkingstructs"){
							$scope.title_map += "Strutture Parcheggio, ";
							$scope.title_map_eng += "Parking structures, ";
						}
						$scope.controlCheckedArea(exlude);
					}
				}
				break;
			case "receipts": 
				$scope.title_map = "Incasso: ";
				$scope.title_map_eng = "Profit: ";
				if(!inverse){
					$scope.controlCheckedArea("");
				} else {
					if(type == "rate_area"){
						if(exlude != "rate_area"){
							$scope.title_map = "Aree Tariffarie, ";
							$scope.title_map_eng = "Rateing areas, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone0"){
						if(exlude != "zone0"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(0).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone1"){
						if(exlude != "zone1"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(1).label + ", ";
							$scope.title_map_eng += "Streets, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone2"){
						if(exlude != "zone2"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(2).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone3"){
						if(exlude != "zone3"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(3).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone4"){
						if(exlude != "zone4"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(4).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone_part"){
						if(exlude != "microzone_part"){
							$scope.title_map += "Parcheggi, ";
							$scope.title_map_eng += "Parking lots, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "parkingstructs"){
						if(exlude != "parkingstructs"){
							$scope.title_map += "Strutture Parcheggio, ";
							$scope.title_map_eng += "Parking structures, ";
						}
						$scope.controlCheckedArea(exlude);
					}
				}
				break;
			case "timeCost": 
				$scope.title_map = "Costo di accesso: ";
				$scope.title_map_eng = "Searching time: ";
				if(!inverse){
					$scope.controlCheckedArea("");
				} else {
					if(type == "rate_area"){
						if(exlude != "rate_area"){
							$scope.title_map = "Aree Tariffarie, ";
							$scope.title_map_eng = "Rateing areas, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone0"){
						if(exlude != "zone0"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(0).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone1"){
						if(exlude != "zone1"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(1).label + ", ";
							$scope.title_map_eng += "Streets, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone2"){
						if(exlude != "zone2"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(2).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone3"){
						if(exlude != "zone3"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(3).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "zone4"){
						if(exlude != "zone4"){
							$scope.title_map += $scope.getZoneLabelFromConfigurationFile(4).label + ", ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone_part"){
						if(exlude != "microzone_part"){
							$scope.title_map += "Parcheggi, ";
							$scope.title_map_eng += "Parking lots, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "parkingstructs"){
						if(exlude != "parkingstructs"){
							$scope.title_map += "Strutture Parcheggio, ";
							$scope.title_map_eng += "Parking structures, ";
						}
						$scope.controlCheckedArea(exlude);
					}
				}
				break;	
			default: break;
		}
		$scope.title_map = $scope.title_map.substring(0, $scope.title_map.length - 2);
		$scope.title_map_eng = $scope.title_map_eng.substring(0, $scope.title_map_eng.length - 2);
	};
	
	$scope.controlCheckedArea = function(exlude){
		if($scope.dashboard_space.rate_area && (exlude != "rate_area")){
			$scope.title_map += "Aree Tariffarie, ";
			$scope.title_map_eng += "Rateing areas, ";
		}
		if($scope.dashboard_space.zone0 && (exlude != "zone0")){
			$scope.title_map += $scope.getZoneLabelFromConfigurationFile(0).label + ", ";
			$scope.title_map_eng += "Macrozones, ";
		}
		if($scope.dashboard_space.zone1 && (exlude != "zone1")){
			$scope.title_map += $scope.getZoneLabelFromConfigurationFile(1).label + ", ";
			$scope.title_map_eng += "Streets, ";
		}
		if($scope.dashboard_space.zone2 && (exlude != "zone2")){
			$scope.title_map += $scope.getZoneLabelFromConfigurationFile(2).label + ", ";
			$scope.title_map_eng += "Macrozones, ";
		}
		if($scope.dashboard_space.zone3 && (exlude != "zone3")){
			$scope.title_map += $scope.getZoneLabelFromConfigurationFile(3).label + ", ";
			$scope.title_map_eng += "Macrozones, ";
		}
		if($scope.dashboard_space.zone4 && (exlude != "zone4")){
			$scope.title_map += $scope.getZoneLabelFromConfigurationFile(4).label + ", ";
			$scope.title_map_eng += "Macrozones, ";
		}
		if($scope.dashboard_space.microzone_part && (exlude != "microzone_part")){
			$scope.title_map += "Parcheggi, ";
			$scope.title_map_eng += "Parking lots, ";
		}
		if($scope.dashboard_space.parkingstructs && (exlude != "parkingstructs")){
			$scope.title_map += "Strutture Parcheggio, ";
			$scope.title_map_eng += "Parking structures, ";
		}
		if($scope.dashboard_space.parkingmeter && (exlude != "parkingmeter")){
			$scope.title_map += "Parcometri, ";
			$scope.title_map_eng += "Parkingmeters, ";
		}
	};
	
	$scope.isActiveItalian = function(){
        return (sharedDataService.getUsedLanguage() == 'ita');
    };
                  			
    $scope.isActiveEnglish = function(){
    	return (sharedDataService.getUsedLanguage() == 'eng');
    };
	
	// ---------------------------------------------------------------------------------------------
	
	$scope.$on('mapInitialized', function(evt, map) {
    	switch(map.id){
	    	case "viewMap":
	    		$scope.map = map;
	    		break;
	    	default: break;
    	}
    });
	
	// ----------------------- Block to read conf params and show/hide elements -----------------------
    var showArea = false;
    var showStreets = false;
    var showPm = false;
    var showPs = false;
    var showBp = false;
    var showZones0 = false;
    var showZones1 = false;
    var showZones2 = false;
    var showZones3 = false;
    var showZones4 = false;
    
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

    $scope.isZonesVisible0 = function(){
    	return showZones0;
    };
    
    $scope.isZonesVisible1 = function(){
    	return showZones1;
    };
    
    $scope.isZonesVisible2 = function(){
    	return showZones2;
    };
    
    $scope.isZonesVisible3 = function(){
    	return showZones3;
    };
    
    $scope.isZonesVisible4 = function(){
    	return showZones4;
    };
    
    $scope.setAllMapObjectLoaded = function(value){
    	$scope.allMapObjectLoaded = value;
    };
    
    $scope.getAllMapObjectLoaded = function(){
    	return $scope.allMapObjectLoaded;
    };
    
    // Methods to show/hide street area filter
    $scope.showSAreaFilter = function(){
    	$scope.showAreaStreetFilter = true;
    };
    
    $scope.hideSAreaFilter = function(){
    	//$scope.streetAreaFilter = null;
    	$scope.showAreaStreetFilter = false;
    };
    
    // Methods to show/hide street name filter
    $scope.showStreetNameFilter = function(){
    	$scope.showStreetFilter = true;
    };
    
    $scope.hideStreetNameFilter = function(){
    	//$scope.nameFilter = null;
    	$scope.showStreetFilter = false;
    };
    
    // Methods to show/hide area name filter
    $scope.showAreaNameFilter = function(){
    	$scope.showAreaFilter = true;
    };
    
    $scope.hideAreaNameFilter = function(){
    	//$scope.nameFilter = null;
    	$scope.showAreaFilter = false;
    };
    
    // Methods to show/hide zone name filter
    $scope.showZoneNameFilter = function(){
    	$scope.showZoneFilter = true;
    };
    
    $scope.hideZoneNameFilter = function(){
    	//$scope.nameFilter = null;
    	$scope.showZoneFilter = false;
    };
    
    // Methods to show/hide code filter
    $scope.showCodeFilter = function(){
    	$scope.showCodFilter = true;
    };
    
    $scope.hideCodeFilter = function(){
    	//$scope.nameFilter = null;
    	$scope.showCodFilter = false;
    };
    
    // Methods to show/hide note filter
    $scope.showNoteFilter = function(){
    	$scope.showNotFilter = true;
    };
    
    $scope.hideNoteFilter = function(){
    	//$scope.nameFilter = null;
    	$scope.showNotFilter = false;
    };
    
    // Methods to show/hide pm status filter
    $scope.showPmStatusFilter = function(){
    	$scope.showStatusPmFilter = true;
    };
    
    $scope.hidePmStatusFilter = function(){
    	//$scope.pmStatusFilter = '';
    	$scope.showStatusPmFilter = false;
    };
    
    // Methods to show/hide pm area filter
    $scope.showPmAreaFilter = function(){
    	$scope.showAreaPmFilter = true;
    };
    
    $scope.hidePmAreaFilter = function(){
    	$scope.pmAreaFilter = '';
    	$scope.showAreaPmFilter = false;
    };
    
    // Methods to show/hide ps area filter
    $scope.showPsNameFilter = function(){
    	$scope.showPsFilter = true;
    };
    
    $scope.hidePsNameFilter = function(){
    	$scope.pmAreaFilter = '';
    	$scope.showPsFilter = false;
    };    
    
    $scope.initComponents = function(){
	    if($scope.editparktabs == null || $scope.editparktabs.length == 0){
	    	$scope.aconf = initializeService.getAreaConfData();
	    	$scope.sconf = initializeService.getStreetConfData();
	    	$scope.pmconf = initializeService.getPmConfData();
	    	$scope.psconf = initializeService.getPsConfData();
	    	$scope.bpconf = initializeService.getBpConfData();
	    	$scope.zconf0 = initializeService.getZoneAttData0();
	    	$scope.zconf1 = initializeService.getZoneAttData1();
	    	$scope.zconf2 = initializeService.getZoneAttData2();
	    	$scope.zconf3 = initializeService.getZoneAttData3();
	    	$scope.zconf4 = initializeService.getZoneAttData4();
	    	$scope.zone0_label = initializeService.getLabel0();
	    	$scope.zone1_label = initializeService.getLabel1();
	    	$scope.zone2_label = initializeService.getLabel2();
	    	$scope.zone3_label = initializeService.getLabel3();
	    	$scope.zone4_label = initializeService.getLabel4();
	    	showArea = initializeService.isShowedAreaDB();
	    	showStreets = initializeService.isShowedStreetDB();
	    	showPm = initializeService.isShowedPmDB();
	    	showPs = initializeService.isShowedPsDB();
	    	showZones0 = initializeService.isShowedZone0DB();
	    	showZones1 = initializeService.isShowedZone1DB();
	    	showZones2 = initializeService.isShowedZone2DB();
	    	showZones3 = initializeService.isShowedZone3DB();
	    	showZones4 = initializeService.isShowedZone4DB();
	    	showBp = initializeService.isShowedBpDB();
	    }
    };
    
    $scope.getCorrectZoneTypeFromId = function(id){
		var type = null;
		var zonePageDataList = initializeService.getZonePagesDataList();
    	var found = false
    	for(var i = 0; i < zonePageDataList.length && !found; i++){
			if(zonePageDataList[i].id == id){
				type = zonePageDataList[i].type;
				found = true;
			}
		}
    	return type;
	};
    
    // ---------------------- End Block to read conf params and show/hide elements ---------------------   
    $scope.tabIndex = 0;
    $scope.viewparktabs = [ 
        { title:'dash_map_tab', index: 1, content:"partials/dashboard/tabs/viewpark_map.html" },
        { title:'dash_list_tab', index: 2, content:"partials/dashboard/tabs/viewpark_list.html", disabled:false }
    ];
    
    $scope.firstIndexSet = true;
    
    $scope.setIndex = function($index){
    	if($index > 0){
    		// case index 1: list view
    		$scope.closeAllDetails($scope.theme);
    		sharedDataService.setIsInList(true);
    		$scope.initWsView(2, $scope.firstIndexSet);
    	} else {
    		// case index 0: map view
    		sharedDataService.setIsInList(false);
    		$scope.initWsView(1, $scope.firstIndexSet);
    		if($scope.firstIndexSet){
    			$scope.firstIndexSet = false;
    		};
    	}
       	$scope.tabIndex = $index;
    };
    
    $scope.isInListTab = function(){
    	return sharedDataService.getIsInList();
    };
    
    $scope.maxStreets = 13;
    $scope.maxZones = 13;
    $scope.maxMicroZones = 13;
    $scope.maxAreas = 13;
    $scope.maxPStructs = 13;
    $scope.maxPMeters = 13;
    
    $scope.currentPage = 0;
    $scope.numberOfPages = function(type, list, z_index){
       	if(type == 1){
       		if($scope.areaWS != null){
       			if(list == null || list.length == 0){
       				return Math.ceil($scope.areaWS.length/$scope.maxAreas);
       			} else {
       				return Math.ceil(list.length/$scope.maxAreas);
       			}
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
       			if(list == null || list.length == 0){
       				return Math.ceil($scope.pstructWS.length/$scope.maxPStructs);
       			} else {
       				return Math.ceil(list.length/$scope.maxPStructs);
       			}
       		} else {
       			return 0;
     		}
       	} else if(type == 5){
       		var myZones = $scope.getZoneListFromIndex(z_index);
       		if(myZones != null){
       			if(list == null || list.length == 0){
       				return Math.ceil(myZones.length/$scope.maxZones);
       			} else {
       				return Math.ceil(list.length/$scope.maxZones);
       			}
       		} else {
       			return 0;
     		}
       	} else if(type == 6){
       		if($scope.bpointWS != null){
       			return Math.ceil($scope.bpointWS.length/$scope.maxBPoints);
       		} else {
       			return 0;
     		}
       	} else if(type == 7){
       		if($scope.profitStreetsList != null){
       			return Math.ceil(list.length/$scope.maxStreets);
       		} else {
       			return 0;
     		}
       	} else if(type == 8){
       		if($scope.parkingMeterWS != null){
       			return Math.ceil(list.length/$scope.maxPMeters);
       		} else {
       			return 0;
     		}
       	} else if(type == 9){
       		var profitList = []
       		switch(z_index){
       			case 0: profitList = $scope.profitZonesList0;
       				break;
       			case 1: profitList = $scope.profitZonesList1;
   					break;
       			case 2: profitList = $scope.profitZonesList2;
   					break;
       			case 3: profitList = $scope.profitZonesList3;
   					break;
       			case 4: profitList = $scope.profitZonesList4;
   					break;
       		}
       		if(profitList != null){
       			return Math.ceil(list.length/$scope.maxZones);
       		} else {
       			return 0;
       		}
       	} else if(type == 10){
       		if($scope.profitStructWS != null){
       			return Math.ceil(list.length/$scope.maxPStructs);
       		} else {
       			return 0;
       		}
       	} else if(type == 11){
       		if($scope.microzoneWS != null){
       			if(list == null || list.length == 0){
       				return Math.ceil($scope.microzoneWS.length/$scope.maxMicroZones);
       			} else {
       				return Math.ceil(list.length/$scope.maxMicroZones);
       			}
       		} else {
       			return 0;
     		}
       	} else if(type == 12){
       		if($scope.profitMicroZonesList != null){
       			if(list == null || list.length == 0){
       				return Math.ceil($scope.profitMicroZonesList.length/$scope.maxMicroZones);
       			} else {
       				return Math.ceil(list.length/$scope.maxMicroZones);
       			}
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
		center : sharedDataService.getConfMapCenter(),
		zoom : parseInt(sharedDataService.getConfMapZoom()),
		styles : myStyles
	};
	
	
	$scope.initPage = function(){	//type
		$scope.dashboard_space = {
			rate_area : false,
			zone0: false,
			zone1: false,
			zone2: false,
			zone3: false,
			zone4: false,
			microzone_part : true,
			parkingmeter : false,
			parkingstructs : false
		};
		
		$scope.dashboard_filter = {
			months : false,
			dows : false,
			hours : false
		};
		
		$scope.dashboard_space_list = "microzone_part";
		$scope.dashboard_topics = "parkSupply";
		$scope.dashboard_topics_list = "parkSupply";
		
		sharedDataService.setFilterTopicList($scope.dashboard_topics_list);
		sharedDataService.setFilterSpace($scope.dashboard_space_list);
	};
	 
	// Method changeFilterSetup: used to keep in memory the filter option after tab swith (from map to list and vice versa)
	$scope.changeFilterSetup = function(type){
		if(type == 1){
			// case of map
			if($scope.dashboard_space_list == "rate_area"){
				$scope.dashboard_space.rate_area = true;
			} else if($scope.dashboard_space_list == "zone0"){
				$scope.dashboard_space.zone0 = true;
			} else if($scope.dashboard_space_list == "zone1"){
				$scope.dashboard_space.zone1 = true;
			} else if($scope.dashboard_space_list == "zone2"){
				$scope.dashboard_space.zone2 = true;
			} else if($scope.dashboard_space_list == "zone3"){
				$scope.dashboard_space.zone3 = true;
			} else if($scope.dashboard_space_list == "zone4"){
				$scope.dashboard_space.zone4 = true;
			} else if($scope.dashboard_space_list == "microzone_part"){
				$scope.dashboard_space.microzone_part = true;
			} else if($scope.dashboard_space_list == "parkingmeter"){
				$scope.dashboard_space.parkingmeter = true;
			} else if($scope.dashboard_space_list == "parkingstructs"){
				$scope.dashboard_space.parkingstructs = true;
			}
			$scope.dashboard_topics = $scope.dashboard_topics_list;
			$scope.clearAllSpaceFilter(1);
			$scope.changeDashboardView(1, true);
		} else {
			// case of list
			if($scope.dashboard_space.rate_area){
				$scope.dashboard_space_list = "rate_area";
			} else if($scope.dashboard_space.zone0){
				$scope.dashboard_space_list = "zone0";
			} else if($scope.dashboard_space.zone1){
				$scope.dashboard_space_list = "zone1";
			} else if($scope.dashboard_space.zone2){
				$scope.dashboard_space_list = "zone2";
			} else if($scope.dashboard_space.zone3){
				$scope.dashboard_space_list = "zone3";
			} else if($scope.dashboard_space.zone4){
				$scope.dashboard_space_list = "zone4";
			} else if($scope.dashboard_space.microzone_part){
				$scope.dashboard_space_list = "microzone_part";
			} else if($scope.dashboard_space.parkingmeter){
				$scope.dashboard_space_list = "parkingmeter";
			} else if($scope.dashboard_space.parkingstructs){
				$scope.dashboard_space_list = "parkingstructs";
			}
			$scope.dashboard_topics_list = $scope.dashboard_topics;
			$scope.clearAllSpaceFilter(2);
			$scope.changeDashboardView(2, true);
			// Here I init all the objects
			if($scope.streetWS && $scope.streetWS.length > 0){
				$scope.streetWS = $scope.initAreasForStreetsObjects($scope.streetWS);	// when I switch to list view I update the street list with the area data
				$scope.profitStreetsList = gMapService.initStreetsOnMap($scope.streetWS, true, 3, false)[1];
			}
			if($scope.areaWS && $scope.areaWS.length > 0){
				$scope.profitAreaList = gMapService.initAreasOnMap($scope.areaWS, true, 3, false, true)[1];
			}
			if(showZones0){
				if($scope.zonesWS0 && $scope.zonesWS0.length){
					$scope.initZoneProfitLists(0, false);
				}
			}
			if(showZones1){
				if($scope.zonesWS0 && $scope.zonesWS1.length){
					$scope.initZoneProfitLists(1, false);
				}
			}
			if(showZones2){
				if($scope.zonesWS0 && $scope.zonesWS2.length){
					$scope.initZoneProfitLists(2, false);
				}
			}
			if(showZones3){
				if($scope.zonesWS0 && $scope.zonesWS3.length){
					$scope.initZoneProfitLists(3, false);
				}
			}
			if(showZones4){
				if($scope.zonesWS0 && $scope.zonesWS4.length){
					$scope.initZoneProfitLists(4, false);
				}
			}
		}
		sharedDataService.setFilterTopicList($scope.dashboard_topics_list);
		sharedDataService.setFilterSpace($scope.dashboard_space_list);
	};
	
	// method clearAllSpaceFilter: used to clear all the space setting after change the dashboard view (map or list)
	$scope.clearAllSpaceFilter = function(type){
		if(type == 1){
			$scope.dashboard_space_list = "";
		} else {
			$scope.dashboard_space.rate_area = false;
			$scope.dashboard_space.zone0 = false;
			$scope.dashboard_space.zone1 = false;
			$scope.dashboard_space.zone2 = false;
			$scope.dashboard_space.zone3 = false;
			$scope.dashboard_space.zone4 = false;
			$scope.dashboard_space.microzone_part = false;
			$scope.dashboard_space.parkingmeter = false;
			$scope.dashboard_space.parkingstructs = false;
		}
	};
	
	$scope.showZList0 = false;
	$scope.showZList1 = false;
	$scope.showZList2 = false;
	$scope.showZList3 = false;
	$scope.showZList4 = false;
	$scope.showSList = true;
	$scope.showAList = false;
	$scope.showPSList = false;
	$scope.showPMList = false;
	
	$scope.showParkSupplyLists = true;
	$scope.showOccupationLists = false;
	$scope.showProfitLists = false;
	$scope.showTimeCostLists = false;
	
	
	$scope.changeDashboardView = function(type, autoInit){
		$scope.closeAllLegend();
		if(type == 1){
			if(autoInit){
				$scope.hideAllAreas($scope.areaWS);
				$scope.hideAllStreets(false);
				$scope.hideAllZones();
			}
			switch($scope.dashboard_topics){
				case "parkSupply": 
					// Show profit objects (with specifics colors)
					if(autoInit){
						if($scope.dashboard_space.rate_area){
							$scope.showAreaPolygons(1);
						} else if($scope.dashboard_space.zone0){
							$scope.showZonePolygons(1, 0);
						} else if($scope.dashboard_space.zone1){
							$scope.showZonePolygons(1, 1);
						} else if($scope.dashboard_space.zone2){
							$scope.showZonePolygons(1, 2);
						} else if($scope.dashboard_space.zone3){
							$scope.showZonePolygons(1, 3);
						} else if($scope.dashboard_space.zone4){
							$scope.showZonePolygons(1, 4);
						} else if($scope.dashboard_space.microzone_part){
							$scope.showStreetPolylines(1);
						} else if($scope.dashboard_space.parkingmeter){
							$scope.showParkingMetersMarkers();
						} else if($scope.dashboard_space.parkingstructs){
							$scope.showParkingStructuresMarkers(1);
						}
					} else {
						$scope.dashboard_space.microzone_part = true;
						$scope.dashboard_space.parkingmeter = false;
						// Show parkingManagement objects
						$scope.switchStreetMapObject(1, $scope.dashboard_space.microzone_part);
						if(showZones0)$scope.switchZoneMapObject(1, 0, $scope.dashboard_space.zone0);
						if(showZones1)$scope.switchZoneMapObject(1, 1, $scope.dashboard_space.zone1);
						if(showZones2)$scope.switchZoneMapObject(1, 2, $scope.dashboard_space.zone2);
						if(showZones3)$scope.switchZoneMapObject(1, 3, $scope.dashboard_space.zone3);
						if(showZones4)$scope.switchZoneMapObject(1, 4, $scope.dashboard_space.zone4);
						$scope.switchAreaMapObject(1, $scope.dashboard_space.rate_area);
						$scope.switchPMMapObject(1, $scope.dashboard_space.parkingmeter);
						$scope.switchParkingMapObject(1, $scope.dashboard_space.parkingstructs);
						//$scope.showParkingMetersMarkers();
					}
//					if(!$scope.dashboard_space.parkingmeter){
//						// Hide the parkingMeters and uncheck the checkBox
//						if($scope.mapParkingMetersSelectedMarkers != null && $scope.mapParkingMetersSelectedMarkers.length > 0){
//							var object = $scope.mapParkingMetersSelectedMarkers[0];
//							object.options.animation = "";
//							$scope.mapParkingMetersMarkers.push(object);
//							$scope.mapParkingMetersSelectedMarkers = [];
//						}
//						$scope.hideParkingMetersMarkers();
//					}
					break;
				case "occupation": 
					// Show occupation objects (with specifics colors)
					$scope.show_occupancy_legend_button = true;
					$scope.show_profit_legend_button = false;
					$scope.show_time_legend_button = false;
					if(autoInit){
						if($scope.dashboard_space.rate_area){
							$scope.showAreaPolygons(2);
						} else if($scope.dashboard_space.zone0){
							$scope.showZonePolygons(2, 0);
						} else if($scope.dashboard_space.zone1){
							$scope.showZonePolygons(2, 1);
						} else if($scope.dashboard_space.zone2){
							$scope.showZonePolygons(2, 2);
						} else if($scope.dashboard_space.zone3){
							$scope.showZonePolygons(2, 3);
						} else if($scope.dashboard_space.zone4){
							$scope.showZonePolygons(2, 4);
						} else if($scope.dashboard_space.microzone_part){
							$scope.showStreetPolylines(2);
						} else if($scope.dashboard_space.parkingstructs){
							$scope.showParkingStructuresMarkers(2);
						}
					} else {
						$scope.dashboard_space.microzone_part = true;
						$scope.dashboard_space.parkingmeter = false;
						$scope.switchStreetMapObject(2, $scope.dashboard_space.microzone_part);
						if(showZones0)$scope.switchZoneMapObject(2, 0, $scope.dashboard_space.zone0);
						if(showZones1)$scope.switchZoneMapObject(2, 1, $scope.dashboard_space.zone1);
						if(showZones2)$scope.switchZoneMapObject(2, 2, $scope.dashboard_space.zone2);
						if(showZones3)$scope.switchZoneMapObject(2, 3, $scope.dashboard_space.zone3);
						if(showZones4)$scope.switchZoneMapObject(2, 4, $scope.dashboard_space.zone4);
						$scope.switchAreaMapObject(2, $scope.dashboard_space.rate_area);
						$scope.switchParkingMapObject(2, $scope.dashboard_space.parkingstructs);
					}
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
					if($scope.firstLoad){
						$scope.updateProfitDataForFirstLoad();	// here I update the profit data for first time
						console.log("in first load");
						$scope.firstLoad = false;
					}
					$scope.show_occupancy_legend_button = false;
					$scope.show_profit_legend_button = true;
					$scope.show_time_legend_button = false;
					// Show profit objects (with specifics colors)
					if(autoInit){
						if($scope.dashboard_space.rate_area){
							$scope.showAreaPolygons(3);
						} else if($scope.dashboard_space.zone0){
							$scope.showZonePolygons(3, 0);
						} else if($scope.dashboard_space.zone1){
							$scope.showZonePolygons(3, 1);
						} else if($scope.dashboard_space.zone2){
							$scope.showZonePolygons(3, 2);
						} else if($scope.dashboard_space.zone3){
							$scope.showZonePolygons(3, 3);
						} else if($scope.dashboard_space.zone4){
							$scope.showZonePolygons(3, 4);
						} else if($scope.dashboard_space.microzone_part){
							$scope.showStreetPolylines(3);
						} else if($scope.dashboard_space.parkingmeter){
							$scope.showProfitPMMarkers();
						} else if($scope.dashboard_space.parkingstructs){
							$scope.showParkingStructuresMarkers(3);
						}
					} else {
						$scope.dashboard_space.microzone_part = false;
						$scope.dashboard_space.parkingmeter = true;
						$scope.switchPMMapObject(2, $scope.dashboard_space.parkingmeter);
						$scope.switchStreetMapObject(3, $scope.dashboard_space.microzone_part);
						if(showZones0)$scope.switchZoneMapObject(3, 0, $scope.dashboard_space.zone0);
						if(showZones1)$scope.switchZoneMapObject(3, 1, $scope.dashboard_space.zone1);
						if(showZones2)$scope.switchZoneMapObject(3, 2, $scope.dashboard_space.zone2);
						if(showZones3)$scope.switchZoneMapObject(3, 3, $scope.dashboard_space.zone3);
						if(showZones4)$scope.switchZoneMapObject(3, 4, $scope.dashboard_space.zone4);
						$scope.switchAreaMapObject(3, $scope.dashboard_space.rate_area);
						$scope.switchParkingMapObject(3, $scope.dashboard_space.parkingstructs);
					}
					break;
				case "timeCost": 
					$scope.show_occupancy_legend_button = false;
					$scope.show_profit_legend_button = false;
					$scope.show_time_legend_button = true;
					// Show occupation objects (with specifics colors)
					if(autoInit){
						if($scope.dashboard_space.rate_area){
							$scope.showAreaPolygons(4);
						} else if($scope.dashboard_space.zone0){
							$scope.showZonePolygons(4, 0);
						} else if($scope.dashboard_space.zone1){
							$scope.showZonePolygons(4, 1);
						} else if($scope.dashboard_space.zone2){
							$scope.showZonePolygons(4, 2);
						} else if($scope.dashboard_space.zone3){
							$scope.showZonePolygons(4, 3);
						} else if($scope.dashboard_space.zone4){
							$scope.showZonePolygons(4, 4);
						} else if($scope.dashboard_space.microzone_part){
							$scope.showStreetPolylines(4);
						} else if($scope.dashboard_space.parkingstructs){
							$scope.showParkingStructuresMarkers(4);
						}
					} else {
						$scope.dashboard_space.microzone_part = true;
						$scope.dashboard_space.parkingmeter = false;
						$scope.switchStreetMapObject(4, $scope.dashboard_space.microzone_part);
						if(showZones0)$scope.switchZoneMapObject(4, 0, $scope.dashboard_space.zone0);
						if(showZones1)$scope.switchZoneMapObject(4, 1, $scope.dashboard_space.zone1);
						if(showZones2)$scope.switchZoneMapObject(4, 2, $scope.dashboard_space.zone2);
						if(showZones3)$scope.switchZoneMapObject(4, 3, $scope.dashboard_space.zone3);
						if(showZones4)$scope.switchZoneMapObject(4, 4, $scope.dashboard_space.zone4);
						$scope.switchAreaMapObject(4, $scope.dashboard_space.rate_area);
						$scope.switchParkingMapObject(4, $scope.dashboard_space.parkingstructs);
					}	
					if($scope.mapParkingMetersSelectedMarkers != null && $scope.mapParkingMetersSelectedMarkers.length > 0){
						// Hide the parkingMeters and uncheck the checkBox
						var object = $scope.mapParkingMetersSelectedMarkers[0];
						object.options.animation = "";
						$scope.mapParkingMetersMarkers.push(object);
						$scope.mapParkingMetersSelectedMarkers = [];
					}
					$scope.hideParkingMetersMarkers();
					$scope.dashboard_space.parkingmeter = false;
					break;
				case "pr": 
					break;
				case "budget": 
					break;
			}
		} else {
			$scope.closeAllDetailsList();
			switch($scope.dashboard_topics_list){
				case "parkSupply":
					// Show occupation objects (with specifics colors)
					if(autoInit){
						if($scope.dashboard_space_list == "rate_area"){
							$scope.showAreaList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "zone0"){
							$scope.showZoneList($scope.dashboard_topics_list, 0);
						} else if($scope.dashboard_space_list == "zone1"){
							$scope.showZoneList($scope.dashboard_topics_list, 1);
						} else if($scope.dashboard_space_list == "zone2"){
							$scope.showZoneList($scope.dashboard_topics_list, 2);
						} else if($scope.dashboard_space_list == "zone3"){
							$scope.showZoneList($scope.dashboard_topics_list, 3);
						} else if($scope.dashboard_space_list == "zone4"){
							$scope.showZoneList($scope.dashboard_topics_list, 4);
						} else if($scope.dashboard_space_list == "microzone_part"){
							$scope.showStreetList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "parkingmeter"){
							$scope.showPMeterList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "parkingstructs"){
							$scope.showStructList($scope.dashboard_topics_list);
						}
					} else {
						$scope.dashboard_space_list = "microzone_part";
						$scope.showStreetList($scope.dashboard_topics_list);
					}
					break;
				case "occupation": 
					$scope.show_occupancy_legend_button = true;
					$scope.show_profit_legend_button = false;
					$scope.show_time_legend_button = false;
					// Show occupation objects (with specifics colors)
					if(autoInit){
						if($scope.dashboard_space_list == "rate_area"){
							$scope.showAreaList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "zone0"){
							$scope.showZoneList($scope.dashboard_topics_list, 0);
						} else if($scope.dashboard_space_list == "zone1"){
							$scope.showZoneList($scope.dashboard_topics_list, 1);
						} else if($scope.dashboard_space_list == "zone2"){
							$scope.showZoneList($scope.dashboard_topics_list, 2);
						} else if($scope.dashboard_space_list == "zone3"){
							$scope.showZoneList($scope.dashboard_topics_list, 3);
						} else if($scope.dashboard_space_list == "zone4"){
							$scope.showZoneList($scope.dashboard_topics_list, 4);
						} else if($scope.dashboard_space_list == "microzone_part"){
							$scope.showStreetList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "parkingmeter"){
							$scope.showPMeterList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "parkingstructs"){
							$scope.showStructList($scope.dashboard_topics_list);
						}
					} else {
						$scope.dashboard_space_list = "microzone_part";
						$scope.showStreetList($scope.dashboard_topics_list);
					}
					break;
				case "receipts": 
					$scope.show_occupancy_legend_button = false;
					$scope.show_profit_legend_button = true;
					$scope.show_time_legend_button = false;
					// Show profit objects (with specifics colors)
					if(autoInit){
						if($scope.dashboard_space_list == "rate_area"){
							$scope.showAreaList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "zone0"){
							$scope.showZoneList($scope.dashboard_topics_list, 0);
						} else if($scope.dashboard_space_list == "zone1"){
							$scope.showZoneList($scope.dashboard_topics_list, 1);
						} else if($scope.dashboard_space_list == "zone2"){
							$scope.showZoneList($scope.dashboard_topics_list, 2);
						} else if($scope.dashboard_space_list == "zone3"){
							$scope.showZoneList($scope.dashboard_topics_list, 3);
						} else if($scope.dashboard_space_list == "zone4"){
							$scope.showZoneList($scope.dashboard_topics_list, 4);
						} else if($scope.dashboard_space_list == "microzone_part"){
							$scope.showStreetList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "parkingmeter"){
							$scope.showPMeterList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "parkingstructs"){
							$scope.showStructList($scope.dashboard_topics_list);
						}
					} else {
						$scope.dashboard_space_list = "parkingmeter";
						$scope.showPMeterList($scope.dashboard_topics_list);
					}
					break;
				case "timeCost": 
					$scope.show_occupancy_legend_button = false;
					$scope.show_profit_legend_button = false;
					$scope.show_time_legend_button = true;
					// Show occupation objects (with specifics colors)
					if(autoInit){
						if($scope.dashboard_space_list == "rate_area"){
							$scope.showAreaList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "zone0"){
							$scope.showZoneList($scope.dashboard_topics_list, 0);
						} else if($scope.dashboard_space_list == "zone1"){
							$scope.showZoneList($scope.dashboard_topics_list, 1);
						} else if($scope.dashboard_space_list == "zone2"){
							$scope.showZoneList($scope.dashboard_topics_list, 2);
						} else if($scope.dashboard_space_list == "zone3"){
							$scope.showZoneList($scope.dashboard_topics_list, 3);
						} else if($scope.dashboard_space_list == "zone4"){
							$scope.showZoneList($scope.dashboard_topics_list, 4);
						} else if($scope.dashboard_space_list == "microzone_part"){
							$scope.showStreetList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "parkingmeter"){
							$scope.showPMeterList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "parkingstructs"){
							$scope.showStructList($scope.dashboard_topics_list);
						}
					} else {
						$scope.dashboard_space_list = "microzone_part";
						$scope.showStreetList($scope.dashboard_topics_list);
					}
					break;
				case "pr": 
					break;
				case "budget": 
					break;
			}
			sharedDataService.setFilterTopicList($scope.dashboard_topics_list);
			sharedDataService.setFilterSpace($scope.dashboard_space_list);
			// here I init the reportsharedList
			$scope.reportShareList = sharedDataService.getReportInList();
		}
		$scope.update_title_map(false, "", "");
		
	};
	
	$scope.switchListShowType = function(type){
		$scope.closeAllDetailsList();
		if(type == "parkSupply"){
			$scope.showParkSupplyLists = true;
			$scope.showOccupationLists = false;
			$scope.showProfitLists = false;
			$scope.showTimeCostLists = false;
		} else if(type == "occupation"){
			$scope.showParkSupplyLists = false;
			$scope.showOccupationLists = true;
			$scope.showProfitLists = false;
			$scope.showTimeCostLists = false;
		} else if(type == "receipts"){
			$scope.showParkSupplyLists = false;
			$scope.showOccupationLists = false;
			$scope.showProfitLists = true;
			$scope.showTimeCostLists = false;
		} else if(type == "timeCost"){
			$scope.showParkSupplyLists = false;
			$scope.showOccupationLists = false;
			$scope.showProfitLists = false;
			$scope.showTimeCostLists = true;
		}
	};
	
	$scope.showZoneList = function(type, z_index){
		$scope.switchListShowType(type);
		switch(z_index){
		case 0:
			$scope.showZList0 = true;
			$scope.showZList1 = false;
			$scope.showZList2 = false;
			$scope.showZList3 = false;
			$scope.showZList4 = false;
			break;
		case 1: 
			$scope.showZList0 = false;
			$scope.showZList1 = true;
			$scope.showZList2 = false;
			$scope.showZList3 = false;
			$scope.showZList4 = false;
			break;
		case 2: 
			$scope.showZList0 = false;
			$scope.showZList1 = false;
			$scope.showZList2 = true;
			$scope.showZList3 = false;
			$scope.showZList4 = false;
			break;
		case 3: 
			$scope.showZList0 = false;
			$scope.showZList1 = false;
			$scope.showZList2 = false;
			$scope.showZList3 = true;
			$scope.showZList4 = false;
			break;
		case 4: 
			$scope.showZList0 = false;
			$scope.showZList1 = false;
			$scope.showZList2 = false;
			$scope.showZList3 = false;
			$scope.showZList4 = true;
			break;
		};
		$scope.showSList = false;
		$scope.showAList = false;
		$scope.showPSList = false;
		$scope.showPMList = false;
	};
	
	$scope.hideZoneList = function(z_index){
		if(z_index != null){
			switch(z_index){
			case 0:
				$scope.showZList0 = false;
				break;
			case 1: 
				$scope.showZList1 = false;
				break;
			case 2: 
				$scope.showZList2 = false;
				break;
			case 3: 
				$scope.showZList3 = false;
				break;
			case 4: 
				$scope.showZList4 = false;
				break;
			};
		} else {
			$scope.showZList0 = false;
			$scope.showZList1 = false;
			$scope.showZList2 = false;
			$scope.showZList3 = false;
			$scope.showZList4 = false;
		}
	};
	
	$scope.showAreaList = function(type){
		$scope.switchListShowType(type);
		$scope.showMicroZList = false;
		$scope.showAList = true;
		$scope.hideZoneList();
		$scope.showSList = false;
		$scope.showPSList = false;
		$scope.showPMList = false;
	};
	
	$scope.showStreetList = function(type){
		// ---- Init street area filter
		$scope.allAreaFilter = [];
		angular.copy(sharedDataService.getSharedLocalAreas(),$scope.allAreaFilter);
		if($scope.allAreaFilter != null && $scope.allAreaFilter.length > 0 && $scope.allAreaFilter[0].id != ''){
			$scope.allAreaFilter.splice(0,0,{id:'', name: "Tutte"});
		}
		$scope.streetAreaFilter = $scope.allAreaFilter[0].id;
		// ----------------------------
		$scope.switchListShowType(type);
		$scope.showMicroZList = false;
		$scope.showSList = true;
		$scope.hideZoneList();
		$scope.showAList = false;
		$scope.showPSList = false;
		$scope.showPMList = false;
	};
	
	$scope.showStructList = function(type){
		$scope.switchListShowType(type);
		$scope.showMicroZList = false;
		$scope.showPSList = true;
		$scope.hideZoneList();
		$scope.showSList = false;
		$scope.showAList = false;
		$scope.showPMList = false;
	};
	
	$scope.showPMeterList = function(type){
		$scope.allPmStatusFilter = [];
		angular.copy($scope.listaStati, $scope.allPmStatusFilter);
		if($scope.allPmStatusFilter != null && $scope.allPmStatusFilter.length > 0 && $scope.allPmStatusFilter[0].idObj != ''){
			$scope.allPmStatusFilter.splice(0, 0, {idObj:"", descrizione: "Tutti"});
		}
		$scope.allPmAreaFilter = [];
		angular.copy(sharedDataService.getSharedLocalAreas(),$scope.allPmAreaFilter);
		if($scope.allPmAreaFilter != null && $scope.allPmAreaFilter.length > 0 && $scope.allPmAreaFilter[0].id != ''){
			$scope.allPmAreaFilter.splice(0,0,{id:'', name: "Tutte"});
		}
		if($scope.allPmAreaFilter.length > 0){
			$scope.pmAreaFilter = $scope.allPmAreaFilter[0].id;
		}
		$scope.pmStatusFilter = $scope.allPmStatusFilter[0].filter;
		$scope.switchListShowType(type);
		$scope.showMicroZList = false;
		$scope.showPSList = false;
		$scope.hideZoneList();
		$scope.showSList = false;
		$scope.showAList = false;
		$scope.showPMList = true;
	};
	
	// ------------------------------- Utility methods ----------------------------------------
	$scope.correctFeeData = function(fee_val){
		if(fee_val != null){
			fee_val = fee_val / 100 + "";
			if(fee_val.indexOf(".") > -1){
				fee_val = fee_val.replace(".", ",");
			}
		}
		return fee_val;
	};
	
	$scope.listaStati = [{
			idObj: "ACTIVE",
			descrizione: "Attivo",
			filter: "ON-ACTIVE"
		},
		{
			idObj: "INACTIVE",
			descrizione: "Disattivo",
			filter: "OFF-INACTIVE"
		}
	];
	
	$scope.getUsedLang = function(){
    	return sharedDataService.getUsedLanguage();
    };
    
    $scope.isUsedItaLang = function(){
    	return ($scope.getUsedLang() == 'ita');
    };
    
    $scope.isUsedEngLang = function(){
    	return ($scope.getUsedLang() == 'eng');
    };
	
	$scope.correctColor = function(value){
		return "#" + value;
	};
	
	$scope.getOccupancyColor = function(value){
		return gMapService.getOccupancyColor(value);
	};
	
	$scope.getProfitColor = function(value){
		return gMapService.getProfitColor(value);
	};
	
	$scope.getTimeCostColor = function(value){
		return gMapService.getTimeCostColor(value);
	};
	
	$scope.plainColor = function(value){
		return value.substring(1, value.length);
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
	
	$scope.correctObjId = function(id, i){
		if(i == 0){
			return id;
		} else {
			return id + '_' + i;
		}
	};	
	
	// ----------------------------------------------------------------------------------------------
	
	// Method alignSelectedObjects: used to hide all selected object when the filter stat is changed
	// (if I don't clear the data the selected object remain on the map)
	$scope.alignSelectedObjects = function(){
		$scope.detailsOpened = false;	// I close the details column
		$scope.occupancyOpened = false;
		$scope.profitOpened = false;
		$scope.timeCostOpened = false;
		// For Area
		if($scope.mapSelectedAreas != null && $scope.mapSelectedAreas.length > 0){
			var toHideArea = $scope.map.shapes;
			var object = {};
			angular.copy($scope.mapSelectedAreas[0], object);
			object.stroke.weight = 3;
			for(var i = 0; i < $scope.mapSelectedAreas.length; i++){
				toHideArea[$scope.mapSelectedAreas[i].id].setMap(null);
			}
			$scope.mapSelectedAreas = [];
		}
		// For Zone
		if(showZones0){
			var selectedZones = $scope.getMapSelectedZones(0);
			if(selectedZones != null && selectedZones.length > 0){
				var toHideZone = $scope.map.shapes;
				toHideZone[selectedZones[0].id].setMap(null);
				$scope.setMapSelectedZones(0, []);
			}
		}
		if(showZones1){
			var selectedZones = $scope.getMapSelectedZones(1);
			if(selectedZones != null && selectedZones.length > 0){
				var toHideZone = $scope.map.shapes;
				toHideZone[selectedZones[0].id].setMap(null);
				$scope.setMapSelectedZones(1, []);
			}
		}
		if(showZones2){
			var selectedZones = $scope.getMapSelectedZones(2);
			if(selectedZones != null && selectedZones.length > 0){
				var toHideZone = $scope.map.shapes;
				toHideZone[selectedZones[0].id].setMap(null);
				$scope.setMapSelectedZones(2, []);
			}
		}
		if(showZones3){
			var selectedZones = $scope.getMapSelectedZones(3);
			if(selectedZones != null && selectedZones.length > 0){
				var toHideZone = $scope.map.shapes;
				toHideZone[selectedZones[0].id].setMap(null);
				$scope.setMapSelectedZones(3, []);
			}
		}
		if(showZones4){
			var selectedZones = $scope.getMapSelectedZones(4);
			if(selectedZones != null && selectedZones.length > 0){
				var toHideZone = $scope.map.shapes;
				toHideZone[selectedZones[0].id].setMap(null);
				$scope.setMapSelectedZones(4, []);
			}
		}
		// For Streets
		if($scope.mapSelectedStreets != null && $scope.mapSelectedStreets.length > 0){
			var toHideStreet = $scope.map.shapes;
			toHideStreet[$scope.mapSelectedStreets[0].id].setMap(null);
			$scope.mapSelectedStreets = [];
		}
		// For ParkingStructure
		if($scope.mapParkingStructureSelectedMarkers != null && $scope.mapParkingStructureSelectedMarkers.length > 0){
    		if($scope.mapParkingStructureMarkers != null && $scope.mapParkingStructureMarkers.length > 0){
    			$scope.mapParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
    		} else if($scope.occupancyParkingStructureMarkers != null && $scope.occupancyParkingStructureMarkers.length > 0) {
    			$scope.updateParkOccupancy();
    		} else if($scope.profitParkingStructureMarkers != null && $scope.profitParkingStructureMarkers.length > 0) {
    			$scope.updateParkProfit();
    		} else if($scope.timeCostParkingStructureMarkers != null && $scope.timeCostParkingStructureMarkers.length > 0) {
    			$scope.updateParkTimeCost();
    		}
    	}
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
	
	$scope.removeMarkersFromMap = function(){
		if($scope.map && $scope.map.markers){
			$scope.map.markers = null;
		}
	};
	
	// Show/hide parkingMeters markers
	$scope.changeParkingMetersMarkers = function(dashboardTopic){
		if(dashboardTopic == "parkSupply"){
			if(!$scope.dashboard_space.parkingmeter){
				$scope.showParkingMetersMarkers();
			} else {
				$scope.hideParkingMetersMarkers();
			}	
		} else if(dashboardTopic == "receipts"){
			if(!$scope.dashboard_space.parkingmeter){
				$scope.showProfitPMMarkers();
			} else {
				$scope.hideParkingMetersMarkers();
			}
		}
		if(!$scope.dashboard_space.parkingmeter){
			$scope.update_title_map(true, "parkingmeter", "");
		} else {
			$scope.update_title_map(true, "parkingmeter", "parkingmeter");
		}
	};

	$scope.showParkingMetersMarkers = function() {
        $scope.mapParkingMetersMarkers = gMapService.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 0);	//MB_lightWS
    };
    
    $scope.showProfitPMMarkers = function(){
    	$scope.profitParkingMetersMarkers = gMapService.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 5);	//MB_lightWS
    };
    
    $scope.hideParkingMetersMarkers = function() {
    	$scope.mapParkingMetersMarkers = [];
    	$scope.profitParkingMetersMarkers = [];
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
    	if($scope.mapParkingMetersSelectedMarkers != null && $scope.mapParkingMetersSelectedMarkers.length > 0){
    		$scope.parkingMetersMarkers.push($scope.mapParkingMetersSelectedMarkers[0]);
    	}
    	$scope.mapParkingMetersSelectedMarkers = [];
    	$scope.alignSelectedObjects();
    };
    
    // Show/hide parkingStructures markers
    $scope.changeParkingStructuresMarkers = function(dashboardTopic){
    	if(dashboardTopic == "parkSupply"){
    		if(!$scope.dashboard_space.parkingstructs){
    			$scope.showParkingStructuresMarkers(1);
			} else {
				$scope.hideParkingStructuresMarkers(1);
			}
    	} else if(dashboardTopic == "occupation"){
    		if(!$scope.dashboard_space.parkingstructs){
    			$scope.showParkingStructuresMarkers(2);
			} else {
				$scope.hideParkingStructuresMarkers(2);
			}
    	} else if(dashboardTopic == "receipts"){
    		if(!$scope.dashboard_space.parkingstructs){
    			$scope.showParkingStructuresMarkers(3);
			} else {
				$scope.hideParkingStructuresMarkers(3);
			}
    	} else if(dashboardTopic == "timeCost"){
    		if(!$scope.dashboard_space.parkingstructs){
    			$scope.showParkingStructuresMarkers(4);
			} else {
				$scope.hideParkingStructuresMarkers(4);
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
        	$scope.mapParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        } else if(type == 2){
        	$scope.occupancyParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        } else if(type == 3){
        	$scope.profitParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        } else if(type == 4){
        	$scope.timeCostParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        }
    };
    
    $scope.hideParkingStructuresMarkers = function(type) {
    	if(type == null){
    		$scope.mapParkingStructureMarkers = [];
    		$scope.occupancyParkingStructureMarkers = [];
    		$scope.profitParkingStructureMarkers = [];
    		$scope.timeCostParkingStructureMarkers = [];
    	} else if(type == 1){
    		$scope.mapParkingStructureMarkers = [];
    	} else if(type == 2){
    		$scope.occupancyParkingStructureMarkers = [];
    	} else if(type == 3){
    		$scope.profitParkingStructureMarkers = [];
    	} else if(type == 4){
    		$scope.timeCostParkingStructureMarkers = [];
    	}
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
    	if($scope.mapParkingStructureSelectedMarkers != null && $scope.mapParkingStructureSelectedMarkers.length > 0){
    		$scope.parkingStructureMarkers.push($scope.mapParkingStructureSelectedMarkers[0]);
    	}
    	$scope.mapParkingStructureSelectedMarkers = [];
    	$scope.alignSelectedObjects();
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
        $scope.mapBikePointMarkers = gMapService.setAllMarkersMap($scope.bikePointMarkers, $scope.map, true, 1);
    };
    
    $scope.hideBikePointsMarkers = function() {
    	$scope.mapBikePointMarkers = [];
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide areas polygons
    $scope.changeAreaPolygons = function(dashboardTopic){
    	if(dashboardTopic == "parkSupply"){
			if(!$scope.dashboard_space.rate_area){
				$scope.showAreaPolygons(1);
			} else {
				$scope.hideAreaPolygons(1);
			}
    	} else if(dashboardTopic == "occupation"){
    		if(!$scope.dashboard_space.rate_area){
				$scope.showAreaPolygons(2);
			} else {
				$scope.hideAreaPolygons(2);
			}
    	} else if(dashboardTopic == "receipts"){
    		if(!$scope.dashboard_space.rate_area){
				$scope.showAreaPolygons(3);
			} else {
				$scope.hideAreaPolygons(3);
			}
    	} else if(dashboardTopic == "timeCost"){
    		if(!$scope.dashboard_space.rate_area){
				$scope.showAreaPolygons(4);
			} else {
				$scope.hideAreaPolygons(4);
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
    		$scope.mapAreas = gMapService.initAreasOnMap($scope.areaWS, true, type, false, false)[0];
    	} else if(type == 2){
    		if($scope.occupancyAreas.length == 0){
    			$scope.occupancyAreas = gMapService.initAreasOnMap($scope.areaWS, true, type, true, false)[0];
    		} else {
    			$scope.occupancyAreas = gMapService.initAreasOnMap($scope.areaWS, true, type, false, false)[0];
    		}
    	} else if(type == 3){
    		if($scope.profitAreas.length == 0){
    			$scope.profitAreas = gMapService.initAreasOnMap($scope.areaWS, true, type, true, false)[0];
    		} else {
    			$scope.profitAreas = gMapService.initAreasOnMap($scope.areaWS, true, type, false, false)[0];
    		}
    	} else if(type == 4){
    		if($scope.timeCostAreas.length == 0){
    			$scope.timeCostAreas = gMapService.initAreasOnMap($scope.areaWS, true, type, true, false)[0];
    		} else {
    			$scope.timeCostAreas = gMapService.initAreasOnMap($scope.areaWS, true, type, false, false)[0];
    		}
    	}
    };
    
    $scope.hideAreaPolygons = function(type) {
    	if(type == 1){
    		$scope.mapAreas = gMapService.initAreasOnMap($scope.areaWS, false, type, false, false)[0];
    	} else if(type == 2){
    		$scope.occupancyAreas = gMapService.initAreasOnMap($scope.areaWS, false, type, false, false)[0];
    	} else if(type == 3){
    		$scope.profitAreas = gMapService.initAreasOnMap($scope.areaWS, false, type, false, false)[0];
    	} else if(type == 4){
    		$scope.timeCostAreas = gMapService.initAreasOnMap($scope.areaWS, false, type, false, false)[0];
    	}
    	$scope.hideAllAreas($scope.areaWS);
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
    	$scope.mapStreetSelectedMarkers = [];

    };
    
    // Show/hide zones polygons
    $scope.changeZonePolygons = function(dashboardTopic, z_index){
    	if(dashboardTopic == "parkSupply"){
	    	if(!$scope.checkZoneSelectedByIndex(z_index)){
				$scope.showZonePolygons(1, z_index);
			} else {
				$scope.hideZonePolygons(1, z_index);
			}
    	} else if(dashboardTopic == "occupation"){
    		if(!$scope.checkZoneSelectedByIndex(z_index)){
				$scope.showZonePolygons(2, z_index);
			} else {
				$scope.hideZonePolygons(2, z_index);
			}
    	} else if(dashboardTopic == "receipts"){
    		if(!$scope.checkZoneSelectedByIndex(z_index)){
				$scope.showZonePolygons(3, z_index);
			} else {
				$scope.hideZonePolygons(3, z_index);
			}
    	} else if(dashboardTopic == "timeCost"){
    		if(!$scope.checkZoneSelectedByIndex(z_index)){
				$scope.showZonePolygons(4, z_index);
			} else {
				$scope.hideZonePolygons(4, z_index);
			}
    	}
    	if(!$scope.checkZoneSelectedByIndex(z_index)){
    		$scope.update_title_map(true, "zone" + z_index, "");
    	} else {
    		$scope.update_title_map(true, "zone" + z_index, "zone" + z_index);
    	}
	};
    
    $scope.showZonePolygons = function(type, z_index) {
    	var myZones = $scope.getZoneListFromIndex(z_index);
    	if(type == 1){
    		var mapzones = gMapService.initZonesOnMap(myZones, true, type, false, false)[0];
    		$scope.setMapZoneList(z_index, mapzones);
    	} else if(type == 2){
    		var zoneoccupancyOnMap = $scope.getOccupancyZoneList(z_index);
    		if(zoneoccupancyOnMap.length == 0){
    			zoneoccupancyOnMap = gMapService.initZonesOnMap(myZones, true, type, true, false)[0];
    		} else {
    			zoneoccupancyOnMap = gMapService.initZonesOnMap(myZones, true, type, false, false)[0];
    		}
    		$scope.setOccupancyZoneList(z_index, zoneoccupancyOnMap);
    	} else if(type == 3){
    		var zoneprofitOnMap = $scope.getProfitZoneList(z_index);
    		if(zoneprofitOnMap.length == 0){
    			zoneprofitOnMap = gMapService.initZonesOnMap(myZones, true, type, true, false)[0];
    		} else {
    			zoneprofitOnMap = gMapService.initZonesOnMap(myZones, true, type, false, false)[0];
    		}
    		$scope.setProfitZoneList(z_index, zoneprofitOnMap);
    	} else if(type == 4){
    		var zonetimecostOnMap = $scope.getTimeCostZoneList(z_index);
    		if(zonetimecostOnMap.length == 0){
    			zonetimecostOnMap = gMapService.initZonesOnMap(myZones, true, type, true, false)[0];
    		} else {
    			zonetimecostOnMap = gMapService.initZonesOnMap(myZones, true, type, false, false)[0];
    		}
    		$scope.setTimeCostZoneList(z_index, zonetimecostOnMap);
    	}
    };
    
    $scope.hideZonePolygons = function(type, z_index) {
    	var myZones = $scope.getZoneListFromIndex(z_index);
    	if(type == 1){
    		var mapzones = gMapService.initZonesOnMap(myZones, false, type, false, false)[0];
    		$scope.setMapZoneList(z_index, mapzones);
    	} else if(type == 2){
    		var zoneoccupancyOnMap = gMapService.initZonesOnMap(myZones, false, type, false, false)[0];
    		$scope.setOccupancyZoneList(z_index, zoneoccupancyOnMap);
    	} else if(type == 3){
    		var zoneprofitOnMap = gMapService.initZonesOnMap(myZones, false, type, false, false)[0];
    		$scope.setProfitZoneList(z_index, zoneprofitOnMap);
    	} else if(type == 4){
    		var zonetimecostOnMap = gMapService.initZonesOnMap(myZones, false, type, false, false)[0];
    		$scope.setTimeCostZoneList(z_index, zonetimecostOnMap);
    	}
    	$scope.hideAllZones(z_index);
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
    };
    
    // Show/hide streets polygons
    $scope.changeStreetPolylines = function(dashboardTopic){
    	if(!$scope.dashboard_space.microzone_part){
    		if(dashboardTopic == "parkSupply"){
    			$scope.showStreetPolylines(1);
    		} else if(dashboardTopic == "occupation"){
    			$scope.showStreetPolylines(2);
    		} else if(dashboardTopic == "receipts"){
    			$scope.showStreetPolylines(3);
    		} else if(dashboardTopic == "timeCost"){
    			$scope.showStreetPolylines(4);
    		}
		} else {
			if(dashboardTopic == "parkSupply"){
				$scope.hideStreetPolylines(1);
    		} else if(dashboardTopic == "occupation"){
    			$scope.hideStreetPolylines(2);
    		} else if(dashboardTopic == "receipts"){
    			$scope.hideStreetPolylines(3);
    		} else if(dashboardTopic == "timeCost"){
    			$scope.hideStreetPolylines(4);
    		}
		}
    	if(!$scope.dashboard_space.microzone_part){
    		$scope.update_title_map(true, "microzone_part", "");
    	} else {
    		$scope.update_title_map(true, "microzone_part", "microzone_part");
    	}
	};
    
    $scope.showStreetPolylines = function(type) {
    	if(type == 1){
    		$scope.mapStreets = gMapService.initStreetsOnMap($scope.streetWS, true, type, false)[0];
    	} else if(type == 2) {
    		$scope.occupancyStreets = gMapService.initStreetsOnMap($scope.streetWS, true, type, false)[0];
    	} else if(type == 3){
    		$scope.profitStreets = gMapService.initStreetsOnMap($scope.streetWS, true, type, false)[0];
    	} else if(type == 4){
    		$scope.timeCostStreets = gMapService.initStreetsOnMap($scope.streetWS, true, type, false)[0];
    	}
    };
    
    $scope.hideStreetPolylines = function(type) {
    	if(type == 1){
    		$scope.mapStreets = gMapService.initStreetsOnMap($scope.streetWS, false, type, false)[0];
    	} else if(type == 2){
    		$scope.occupancyStreets = gMapService.initStreetsOnMap($scope.streetWS, false, type, false)[0];
    	} else if(type == 3){
    		$scope.profitStreets = gMapService.initStreetsOnMap($scope.streetWS, false, type, false)[0];
    	} else if(type == 4){
    		$scope.timeCostStreets = gMapService.initStreetsOnMap($scope.streetWS, false, type, false)[0];
    	}
    	$scope.hideAllStreets(false);
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
    };
    
    $scope.hideAllStreets = function(all){
    	if($scope.map != null){
	    	var toDelStreet = $scope.map.shapes;
		    for(var i = 0; i < $scope.mapStreets.length; i++){
		    	if(toDelStreet[$scope.mapStreets[i].id]){
		    		toDelStreet[$scope.mapStreets[i].id].setMap(null);			// I can access dinamically the value of the object shapes for street
		    	}
		    }
	    	for(var i = 0; i < $scope.occupancyStreets.length; i++){
	    		if(toDelStreet[$scope.occupancyStreets[i].id]){
	    			toDelStreet[$scope.occupancyStreets[i].id].setMap(null);	// I can access dinamically the value of the object shapes for street
	    		}
	    	}
	    	for(var i = 0; i < $scope.profitStreets.length; i++){
		    	if(toDelStreet[$scope.profitStreets[i].id]){
		    		toDelStreet[$scope.profitStreets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
		    	}
		    }
	    	for(var i = 0; i < $scope.timeCostStreets.length; i++){
		    	if(toDelStreet[$scope.timeCostStreets[i].id]){
		    		toDelStreet[$scope.timeCostStreets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
		    	}
	    	}
	    	if(all){
	    		toDelStreet = null;
	    		$scope.mapStreets = [];
	    		$scope.occupancyStreets = [];
	    		$scope.profitStreets = [];
	    		$scope.timeCostStreets = [];
	    		$scope.mapStreetSelectedMarkers = [];
	    	}
	    	$scope.alignSelectedObjects();
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
    
    $scope.hideAllZones = function(z_index){
    	if(z_index != null){
    		$scope.hideAllZoneByIndex(z_index);
    	} else {
    		if(showZones0){
    			$scope.hideAllZoneByIndex(0);
    		}
    		if(showZones1){
    			$scope.hideAllZoneByIndex(1);
    		}
    		if(showZones2){
    			$scope.hideAllZoneByIndex(2);
    		}
    		if(showZones3){
    			$scope.hideAllZoneByIndex(3);
    		}
    		if(showZones4){
    			$scope.hideAllZoneByIndex(4);
    		}
    	}
    };
    
    $scope.hideAllZoneByIndex = function(z_index){
    	if($scope.map != null){
	    	var toDelZones = $scope.map.shapes;
	    	var selectedZone = $scope.getMapSelectedZones(z_index);
	    	var mapzone = $scope.getMapZoneList(z_index);
	    	var zoneoccupancyOnMap = $scope.getOccupancyZoneList(z_index);
	    	var zoneprofitOnMap = $scope.getProfitZoneList(z_index);
	    	var zonetimecostOnMap = $scope.getTimeCostZoneList(z_index);
	    	for(var i = 0; i < selectedZone.length; i++){
	    		if(toDelZones[selectedZone[i].id]){
	    			toDelZones[selectedZone[i].id].setMap(null);
	    		}
	    	}
	    	$scope.setMapSelectedZones(z_index, []);
	    	for(var i = 0; i < mapzone.length; i++){
	    		if(toDelZones[mapzone[i].id]){
	    			toDelZones[mapzone[i].id].setMap(null);
	    		}
	    	}
	    	for(var i = 0; i < zoneoccupancyOnMap.length; i++){
	    		if(toDelZones[zoneoccupancyOnMap[i].id]){
	    			toDelZones[zoneoccupancyOnMap[i].id].setMap(null);
	    		}
	    	}
	    	for(var i = 0; i < zoneprofitOnMap.length; i++){
	    		if(toDelZones[zoneprofitOnMap[i].id]){
	    			toDelZones[zoneprofitOnMap[i].id].setMap(null);
	    		}
	    	}
	    	for(var i = 0; i < zonetimecostOnMap.length; i++){
	    		if(toDelZones[zonetimecostOnMap[i].id]){
	    			toDelZones[zonetimecostOnMap[i].id].setMap(null);
	    		}
	    	}
	    	$scope.alignSelectedObjects();
    	}
    }; 
    
    $scope.hideAllAreas = function(areas){
    	var toHideArea = $scope.map.shapes;
    	for(var i = 0; i < areas.length; i++){
    		if(areas[i].geometry != null && areas[i].geometry.length > 0){
	    		if(areas[i].geometry.length == 1){
	    			if(toHideArea[areas[i].id] != null){
		    			toHideArea[areas[i].id].setMap(null);
		    		}
	    		} else {
	    			for(var j = 0; j <  areas[i].geometry.length; j++){
	    				//var myId = $scope.correctAreaId(areas[i].id, j); //MB_lightWS
	    				var myId = gMapService.correctAreaId(areas[i].id, j); //MB_lightWS
	    				if(toHideArea[myId] != null){
			    			toHideArea[myId].setMap(null);
			    		}
	    			}
	    		}
    		}
    	}
    	$scope.alignSelectedObjects();
    };
	
	$scope.updateAreasOccupancyTimeCost = function(){
		if($scope.areaWS){
			for(var i = 0; i < $scope.areaWS.length; i++){
				var slotsInArea = sharedDataService.getTotalSlotsInArea($scope.areaWS[i].id, $scope.streetWS);
				$scope.areaWS[i].slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(areas[i].id);
				$scope.areaWS[i].slotOccupied = slotsInArea[1]; //Math.round(area.data.slotNumber * areaOccupancy / 100);
				var areaOccupancy = sharedDataService.getStreetsInAreaOccupancy($scope.areaWS[i].id, $scope.streetWS);
				if(areaOccupancy != -1){
					areaOccupancy = slotsInArea[2];
				}
				var timeCost = gMapService.getExtratimeFromOccupancy(areaOccupancy);
				$scope.areaWS[i].occupancy = (areaOccupancy != -1) ? Math.round(areaOccupancy) : areaOccupancy;
				$scope.areaWS[i].extratime = timeCost;
			}
		}
	};
	
	$scope.initAreasObjects = function(areas){
		var myAreas = [];
		for(var i = 0; i < areas.length; i++){
			var zones0 = [];
			var zones1 = [];
			var zones2 = [];
			var zones3 = [];
			var zones4 = [];
			// zone init
			if(areas[i].zones){
				for(var j = 0; j < areas[i].zones.length; j++){
					var z0 = $scope.getLocalZoneById(areas[i].zones[j], 2, 0);
					var z1 = $scope.getLocalZoneById(areas[i].zones[j], 2, 1);
					var z2 = $scope.getLocalZoneById(areas[i].zones[j], 2, 2);
					var z3 = $scope.getLocalZoneById(areas[i].zones[j], 2, 3);
					var z4 = $scope.getLocalZoneById(areas[i].zones[j], 2, 4);
					if(z0 != null){
						zones0.push(gMapService.addLabelToZoneObject(z0));
					} else if(z1 != null){
						zones1.push(gMapService.addLabelToZoneObject(z1));
					} else if(z2 != null){
						zones2.push(gMapService.addLabelToZoneObject(z2));
					} else if(z3 != null){
						zones3.push(gMapService.addLabelToZoneObject(z3));
					} else if(z4 != null){
						zones4.push(gMapService.addLabelToZoneObject(z4));
					}
				}
			}
			var myarea = areas[i];
			myarea.myZones0 = zones0;
			myarea.myZones1 = zones1;
			myarea.myZones2 = zones2;
			myarea.myZones3 = zones3;
			myarea.myZones4 = zones4;
			myAreas.push(myarea);
		}
		return myAreas;
	};
	
	$scope.initStreetsObjects = function(streets){
		var myStreets = [];
		for(var i = 0; i < streets.length; i++){
			var zones0 = [];
			var zones1 = [];
			var zones2 = [];
			var zones3 = [];
			var zones4 = [];
			// zone init
			for(var j = 0; j < streets[i].zones.length; j++){
				var z0 = $scope.getLocalZoneById(streets[i].zones[j], 2, 0);
				var z1 = $scope.getLocalZoneById(streets[i].zones[j], 2, 1);
				var z2 = $scope.getLocalZoneById(streets[i].zones[j], 2, 2);
				var z3 = $scope.getLocalZoneById(streets[i].zones[j], 2, 3);
				var z4 = $scope.getLocalZoneById(streets[i].zones[j], 2, 4);
				if(z0 != null){
					zones0.push(gMapService.addLabelToZoneObject(z0));
				} else if(z1 != null){
					zones1.push(gMapService.addLabelToZoneObject(z1));
				} else if(z2 != null){
					zones2.push(gMapService.addLabelToZoneObject(z2));
				} else if(z3 != null){
					zones3.push(gMapService.addLabelToZoneObject(z3));
				} else if(z4 != null){
					zones4.push(gMapService.addLabelToZoneObject(z4));
				}
			}
			var pms = [];
			if(streets[i].parkingMeters != null){
				for(var x = 0; x < streets[i].parkingMeters.length; x++){
					var pm = sharedDataService.getLocalPmById(streets[i].parkingMeters[x]);
					if(pm != null){
						pms.push(pm);
					}
				}
			}
			var area = sharedDataService.getLocalAreaById(streets[i].rateAreaId);
			var mystreet = sharedDataService.cleanStreetNullValue(streets[i]);
			mystreet.slotOccupied = sharedDataService.getTotalOccupiedSlots(mystreet);
			mystreet.extratime = gMapService.getExtratimeFromOccupancy(mystreet.occupancyRate);
			mystreet.area_name = area.name;
			mystreet.area_color= area.color;
			mystreet.myZones0 = zones0;
			mystreet.myZones1 = zones1;
			mystreet.myZones2 = zones2;
			mystreet.myZones3 = zones3;
			mystreet.myZones4 = zones4;
			mystreet.myPms = pms;
			myStreets.push(mystreet);
		}
		return myStreets;
	};
	
	$scope.initAreasForStreetsObjects = function(streets){
		for(var i = 0; i < streets.length; i++){
			var area = sharedDataService.getLocalAreaById(streets[i].rateAreaId);
			streets[i].area_name = area.name;
			streets[i].area_color= area.color;
			streets[i].area = area;
		}
		return streets;
	}
	
	// New method to init street objects on map (easy way, only gographics correction)
	$scope.initStreetsObjectsLight = function(streets){
		var myStreets = [];
		for(var i = 0; i < streets.length; i++){
			var mystreet = sharedDataService.cleanStreetNullValue(streets[i]);
			mystreet.slotOccupied = sharedDataService.getTotalOccupiedSlots(mystreet);
			mystreet.extratime = gMapService.getExtratimeFromOccupancy(mystreet.occupancyRate);
			mystreet.area_color= streets[i].color;
			myStreets.push(mystreet);
		}
		return myStreets;
	};
	
	/*$scope.initPMObjects = function(pmeters){
		var myPms = [];
		for(var i = 0; i < pmeters.length; i++){
			var area = sharedDataService.getLocalAreaById(pmeters[i].areaId);
			var myPmeter = pmeters[i];
			var zones0 = [];
			var zones1 = [];
			var zones2 = [];
			var zones3 = [];
			var zones4 = [];
			// zone init
			if(pmeters[i].zones){
				for(var j = 0; j < pmeters[i].zones.length; j++){
					var z0 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 0);
					var z1 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 1);
					var z2 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 2);
					var z3 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 3);
					var z4 = $scope.getLocalZoneById(pmeters[i].zones[j], 2, 4);
					if(z0 != null){
						zones0.push(gMapService.addLabelToZoneObject(z0));
					} else if(z1 != null){
						zones1.push(gMapService.addLabelToZoneObject(z1));
					} else if(z2 != null){
						zones2.push(gMapService.addLabelToZoneObject(z2));
					} else if(z3 != null){
						zones3.push(gMapService.addLabelToZoneObject(z3));
					} else if(z4 != null){
						zones4.push(gMapService.addLabelToZoneObject(z4));
					}
				}
			}
			myPmeter.myStatus = (pmeters[i].status == 'ACTIVE')?"ON-ACTIVE":"OFF-INACTIVE";
			myPmeter.area = area;
			myPmeter.area_name = area.name,
			myPmeter.area_color= area.color;
			myPmeter.myZones0 = zones0;
			myPmeter.myZones1 = zones1;
			myPmeter.myZones2 = zones2;
			myPmeter.myZones3 = zones3;
			myPmeter.myZones4 = zones4;
			myPms.push(myPmeter);
		}
		return myPms;
	};*/
	
	$scope.initPMObjectsLight = function(pmeters){
		var myPms = [];
		for(var i = 0; i < pmeters.length; i++){
			var myPmeter = pmeters[i];
			myPmeter.myStatus = (pmeters[i].status == 'ACTIVE')?"ON-ACTIVE":"OFF-INACTIVE";
			myPms.push(myPmeter);
		}
		return myPms;
	};
	
	$scope.initPSObjects = function(ps){
		var myPs = [];
		for(var i = 0; i < ps.length; i++){
			var zones0 = [];
			var zones1 = [];
			var zones2 = [];
			var zones3 = [];
			var zones4 = [];
			// zone init
			if(ps[i].zones){
				for(var j = 0; j < ps[i].zones.length; j++){
					var z0 = $scope.getLocalZoneById(ps[i].zones[j], 2, 0);
					var z1 = $scope.getLocalZoneById(ps[i].zones[j], 2, 1);
					var z2 = $scope.getLocalZoneById(ps[i].zones[j], 2, 2);
					var z3 = $scope.getLocalZoneById(ps[i].zones[j], 2, 3);
					var z4 = $scope.getLocalZoneById(ps[i].zones[j], 2, 4);
					if(z0 != null){
						zones0.push(gMapService.addLabelToZoneObject(z0));
					} else if(z1 != null){
						zones1.push(gMapService.addLabelToZoneObject(z1));
					} else if(z2 != null){
						zones2.push(gMapService.addLabelToZoneObject(z2));
					} else if(z3 != null){
						zones3.push(gMapService.addLabelToZoneObject(z3));
					} else if(z4 != null){
						zones4.push(gMapService.addLabelToZoneObject(z4));
					}
				}
			}
			var myps = ps[i];
			myps.myZones0 = zones0;
			myps.myZones1 = zones1;
			myps.myZones2 = zones2;
			myps.myZones3 = zones3;
			myps.myZones4 = zones4;
			myPs.push(myps);
		}
		return myPs;
	};
	
	$scope.initBPObjects = function(bp){
		var myBp = [];
		for(var i = 0; i < bp.length; i++){
			var zones0 = [];
			var zones1 = [];
			var zones2 = [];
			var zones3 = [];
			var zones4 = [];
			// zone init
			if(bp[i].zones){
				for(var j = 0; j < bp[i].zones.length; j++){
					var z0 = $scope.getLocalZoneById(bp[i].zones[j], 2, 0);
					var z1 = $scope.getLocalZoneById(bp[i].zones[j], 2, 1);
					var z2 = $scope.getLocalZoneById(bp[i].zones[j], 2, 2);
					var z3 = $scope.getLocalZoneById(bp[i].zones[j], 2, 3);
					var z4 = $scope.getLocalZoneById(bp[i].zones[j], 2, 4);
					if(z0 != null){
						zones0.push(gMapService.addLabelToZoneObject(z0));
					} else if(z1 != null){
						zones1.push(gMapService.addLabelToZoneObject(z1));
					} else if(z2 != null){
						zones2.push(gMapService.addLabelToZoneObject(z2));
					} else if(z3 != null){
						zones3.push(gMapService.addLabelToZoneObject(z3));
					} else if(z4 != null){
						zones4.push(gMapService.addLabelToZoneObject(z4));
					}
				}
			}
			var mybp = bp[i];
			mybp.myZones0 = zones0;
			mybp.myZones1 = zones1;
			mybp.myZones2 = zones2;
			mybp.myZones3 = zones3;
			mybp.myZones4 = zones4;
			myBp.push(mybp);
		}
		return myBp;
	};
	
	$scope.getSharedLocalZones = function(zindex){
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
	
	$scope.setSharedLocalZones = function(zones, zindex){
		switch(zindex){
			case 0:
				sharedDataService.setSharedLocalZones0(zones);
				break;
			case 1: 
				sharedDataService.setSharedLocalZones1(zones);
				break;
			case 2: 
				sharedDataService.setSharedLocalZones2(zones);
				break;
			case 3: 
				sharedDataService.setSharedLocalZones3(zones);
				break;
			case 4: 
				sharedDataService.setSharedLocalZones4(zones);
				break;
			default: break;
		}
	};
	
	$scope.initWsView = function(type, isInit){
		$scope.hideAllStreets(true);	// Method used to hide all streets from map after tab switch
	   	if(!isInit){
	   		$scope.changeFilterSetup(type);
	   	} else {
	   		$scope.initComponents();
	   		$scope.initPage();
	   		gMapService.loadMapsObject();	// To show modal waiting spinner
	   		$scope.retrieveAllDataFromDBParallel();
	   		gMapService.initAllDiagrams();
	   	}
		$scope.mapReady = false;
	};
	
	$scope.updateProfitDataForFirstLoad = function(){
		if(showStreets){
			$scope.updateStreetProfit(true, $scope.dashboard_space.microzone_part);
		}
		if(showArea){
	    	$scope.updateAreaProfit(true);
	    }
		if(showZones0){
			$scope.updateZoneProfit(true, 0);
		}
		if(showZones1){
			$scope.updateZoneProfit(true, 1);
		}
		if(showZones2){
			$scope.updateZoneProfit(true, 2);
		}
		if(showZones3){
			$scope.updateZoneProfit(true, 3);
		}
		if(showZones4){
			$scope.updateZoneProfit(true, 4);
		}
	}
	
	// retrieve all data Parallel: function that retrieve data in parallel way 
	$scope.retrieveAllDataFromDBParallel = function(){
		var isFirst = true;
		var returnedAreas = $scope.getAllAreas();
		returnedAreas.then(function(result){
			sharedDataService.setSharedLocalAreas(result);
		});
		$scope.getProfitPMFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);
		var returnedStreets = $scope.getOccupancyStreetsFromDb("", "1;12", "1,2,3,4,5,6,7", "custom", "0;23", 2, isFirst);
		returnedStreets.then(function(result){
			gMapService.setOccupancyStreet(result);
		});
		var returnedPs = $scope.getOccupancyParksFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);
		returnedPs.then(function(result){
			$scope.getProfitParksFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);	// light version return only profit data
		});
		if(showZones0){
			var type = $scope.getCorrectZoneTypeFromId(2);
			$scope.getAllZones(type, 0);
		}
		if(showZones1){
			var type = $scope.getCorrectZoneTypeFromId(3);
			$scope.getAllZones(type, 1);
		}
		if(showZones2){
			var type = $scope.getCorrectZoneTypeFromId(4);
			$scope.getAllZones(type, 2);
		}
		if(showZones3){
			var type = $scope.getCorrectZoneTypeFromId(5);
			$scope.getAllZones(type, 3);
		}
		if(showZones4){
			var type = $scope.getCorrectZoneTypeFromId(6);
			$scope.getAllZones(type, 4);
		}
		$scope.getBikePointFromDb(isFirst);
	};
	
	$scope.retrieveAllDataFromDBSerial = function(){
		var isFirst = true;
		var myAreaReturnData = $scope.getAllAreas();
		myAreaReturnData.then(function(result){
			if(showZones0){
				var type = $scope.getCorrectZoneTypeFromId(2);
				return $scope.getAllZones(type, 0);
			} else {
				var deferred = $q.defer();
				deferred.resolve(true);
				return deferred.promise;
			}
		}).then(function(result){
			if(showZones1){
				var type = $scope.getCorrectZoneTypeFromId(3);
				return $scope.getAllZones(type, 1);
			} else {
				var deferred = $q.defer();
				deferred.resolve(true);
				return deferred.promise;
			}
		}).then(function(result){
			if(showZones2){
				var type = $scope.getCorrectZoneTypeFromId(4);
				return $scope.getAllZones(type, 2);
			} else {
				var deferred = $q.defer();
				deferred.resolve(true);
				return deferred.promise;
			}
		}).then(function(result){
			if(showZones3){
				var type = $scope.getCorrectZoneTypeFromId(5);
				return $scope.getAllZones(type, 3);
			} else {
				var deferred = $q.defer();
				deferred.resolve(true);
				return deferred.promise;
			}
		}).then(function(result){
			if(showZones4){
				var type = $scope.getCorrectZoneTypeFromId(6);
				return $scope.getAllZones(type, 4);
			} else {
				var deferred = $q.defer();
				deferred.resolve(true);
				return deferred.promise;
			}
		}).then(function(result){
			return $scope.getProfitPMFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);
		}).then(function(result){
			return $scope.getOccupancyStreetsFromDb("", "1;12", "1,2,3,4,5,6,7", "custom", "0;23", 2, isFirst);
		}).then(function(result){
			$scope.dashboard_space.microzone_part = true;
	    	$scope.dashboard_topics == "parkSupply";
	    	if(showStreets){
		    	$scope.updateStreetOccupancy($scope.streetWS);
			}
			return $scope.getOccupancyParksFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);
		}).then(function(result){
			return $scope.getBikePointFromDb(isFirst);
		}).then(function(result){
			return $scope.getProfitParksFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);
		}).then(function(result){
			if(showStreets){
				$scope.updateStreetProfit(isFirst, $scope.dashboard_space.microzone_part);
			}
			if(showArea){
		    	$scope.updateAreaProfit(isFirst);
		    	//$scope.areaWS = $scope.initAreasObjects($scope.areaWS);	//MB_lightWS	(no cycle to zones)
		    }
			if(showZones0){
				$scope.updateZoneProfit(isFirst, 0);
			}
			if(showZones1){
				$scope.updateZoneProfit(isFirst, 1);
			}
			if(showZones2){
				$scope.updateZoneProfit(isFirst, 2);
			}
			if(showZones3){
				$scope.updateZoneProfit(isFirst, 3);
			}
			if(showZones4){
				$scope.updateZoneProfit(isFirst, 4);
			}
			if(showPs){
				//$scope.pstructWS = $scope.initPSObjects($scope.pstructWS);	//MB_lightWS
				//$scope.allDataStructWS = $scope.initPSObjects($scope.allDataStructWS);	//MB_lightWS
			}
		})
	};
	
	// Methid getAreasFromDb: used to retrieve the rate area data form the DB
	/*$scope.getAreasFromDb = function(){
		var allAreas = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/area", null, $scope.authHeaders, null);
		myDataPromise.then(function(allAreas){
			$scope.areaWS = allAreas;
			if(showArea){
			    //$scope.initAreasOnMap($scope.areaWS, false, 1, false, true)[0];
			    gMapService.initAreasOnMap($scope.areaWS, false, 1, false, true)[0];	//MB_lightWS
			}    
			sharedDataService.setSharedLocalAreas($scope.areaWS);
		});
		return myDataPromise;
	};*/
	
	// Retrieve all Area Method
    $scope.getAllAreas = function(){
		$scope.polygons = [];
		var promiseAreas = areaService.getAreasFromDb(showArea);
		promiseAreas.then(function(result){
			$scope.areaWS = result;
			if(showArea){
			    gMapService.initAreasOnMap($scope.areaWS, false, 1, false, true)[0];	//MB_lightWS
			}    
			sharedDataService.setSharedLocalAreas($scope.areaWS);
		});
		return promiseAreas;
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
	
	// Method correctParamsFromSemicolonForMonth: used to replace the semicolon with a comma. In this case the vales are 
	// corrected becouse in the slider the month range is 1-12 but in java is 0, 11
	$scope.correctParamsFromSemicolonForMonth = function(value){
		if(value != null){
			var res = value+"";
			if(res.indexOf(";") > -1){
				var arr = res.split(";");
				var val1 = parseInt(arr[0]) - 1;
				var val2 = parseInt(arr[1]) - 1;
				return val1 + "," + val2;
			} else if(res.indexOf(",") > -1){
				var arr = res.split(",");
				var val1 = parseInt(arr[0]) - 1;
				var val2 = parseInt(arr[1]) - 1;
				return val1 + "," + val2;
			} else {
				var val = parseInt(res) - 1;
				return val + "";
			}
		} else {
			return value;
		}
	};
	
	// Method chekIfAllRange: used to control if a range is complete. In this case the range value is set to null
	$scope.chekIfAllRange = function(arr, type){
		var corrVal = arr;
		var res;
		switch(type){
			case 1:	// months
				if(arr != null && arr != ""){
					arr = arr + ""; // to force to string
					if(arr.indexOf(";") > -1){
						res = arr.split(";");
						if(res[0] == "1" && res[1] == "12"){
							corrVal = null;
						}
					}
				}
				break;
			case 2: // week day
				if(arr != null && arr != ""){
					arr = arr + ""; // to force to string
					if(arr.indexOf(",") > -1){
						res = arr.split(",");
						//if(res[0] == "1" && res[1] == "7"){
						if(res.length == 7){	// all day selected	
							corrVal = null;
						}
					}
				}
				break;
			case 3: // hour
				if(arr != null && arr != ""){
					arr = arr + ""; // to force to string
					if(arr.indexOf(";") > -1){
						res = arr.split(";");
						if(res[0] == "0" && res[1] == "23"){
							corrVal = null;
						}
					}
				}
				break;
			default: break;
		}
		return corrVal;
	};
	
	// Method getOccupancyStreetsFromDb: used to retrieve te streets occupancy data from the db
	$scope.getOccupancyStreetsFromDb = function(year, month, weekday, dayType, hour, valueType, isFirst){
		// period params
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		$scope.streetMapReady = false;
		var allStreet = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/streets", params, $scope.authHeaders, null);
		myDataPromise.then(function(allStreet){
		    //console.log("streets occupancy retrieved from db: " + JSON.stringify(result));
		    gMapService.updateLoadingMapState();
		    $scope.myTmpZoneOccupation = [];
		    //$scope.streetWS = $scope.initStreetsObjects(allStreet);
		    $scope.streetWS = $scope.initStreetsObjectsLight(allStreet);	//MB_lightWS
		    gMapService.setOccupancyStreet($scope.streetWS);
		    // TODO: it will not working with the light object initialization... to be corrected
		    /*if($scope.useAverageZoneOccupation){	
			    for(var i = 0; i < $scope.streetWS.length; i++){
				    if($scope.streetWS[i].occupancyRate == -1){
						var found = false;
						for(var x = 0; x < $scope.myTmpZoneOccupation.length; x++){
							if($scope.streetWS[i].myZones0[0].id == $scope.myTmpZoneOccupation[x].id){
								$scope.streetWS[i].occupancyRate = $scope.myTmpZoneOccupation[x].occupancy;
								found = true;
							}
						}
						if(!found){
							var zVal = {
								id: $scope.streetWS[i].myZones0[0].id,
								occupancy: Math.floor($scope.getStreetsInZoneOccupancy($scope.streetWS[i].myZones0[0].id))	// here I calculate the zone average occupancy
							};
							$scope.myTmpZoneOccupation.push(zVal);
							$scope.streetWS[i].occupancyRate = zVal.occupancy;
						}
				    }
			    }
		    }*/
		    if(showStreets){
			   	$scope.updateStreetOccupancy($scope.streetWS);
			}
			if(showZones0){
		    	$scope.updateZoneOccupancy(true, 0);
		    }
		    if(showZones1){
		    	$scope.updateZoneOccupancy(true, 1);
		    }
		    if(showZones2){
		    	$scope.updateZoneOccupancy(true, 2);
		    }
		    if(showZones3){
		    	$scope.updateZoneOccupancy(true, 3);
		    }
		    if(showZones4){
		    	$scope.updateZoneOccupancy(true, 4);
		    }
		    if(showArea){
		    	$scope.updateAreaOccupancy(true);
		    }
		    // For timeCost zones
			if(showZones0){
				$scope.updateZonesOccupancyTimeCost(0);
			}
			if(showZones1){
				$scope.updateZonesOccupancyTimeCost(1);
			}
			if(showZones2){
				$scope.updateZonesOccupancyTimeCost(2);
			}
			if(showZones3){
				$scope.updateZonesOccupancyTimeCost(3);
			}
			if(showZones4){
				$scope.updateZonesOccupancyTimeCost(4);
			}
			$scope.updateAreasOccupancyTimeCost();
		});
		return myDataPromise;
	};
	
	// Method getProfitPMFromDb: used to retrieve te streets occupancy data from the db
	$scope.getProfitPMFromDb = function(year, month, weekday, dayType, hour, valueType, isFirst){
		// period params
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		$scope.streetMapReady = false;
		var markers = [];
		var allPMs = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/parkingmeters", params, $scope.authHeaders, null);
		myDataPromise.then(function(allPMs){
		    //$scope.parkingMeterWS = $scope.initPMObjects(allPMs);
		    $scope.parkingMeterWS = $scope.initPMObjectsLight(allPMs);	//MB_lightWS
		    
		    if(showPm){
		    	for (var i = 0; i <  $scope.parkingMeterWS.length; i++) {
		    		markers.push(gMapService.createMarkers(i, $scope.parkingMeterWS[i], 5));	//MB_lightWS
		    	}
		    	angular.copy(markers, $scope.parkingMetersMarkers);
		    	$scope.updatePMProfit();
		    }
		    sharedDataService.setSharedLocalPms(allPMs);
		    gMapService.setProfitParkingMeter(allPMs);
		    
		    if(!isFirst){
			    if(showStreets){
				   	$scope.updateStreetProfit(isFirst, $scope.dashboard_space.microzone_part);
				}
			    if(showArea){
			    	$scope.updateAreaProfit(isFirst);
			    }
			    if(showZones0){
			    	$scope.updateZoneProfit(isFirst, 0);
			    }
			    if(showZones1){
			    	$scope.updateZoneProfit(isFirst, 1);
			    }
			    if(showZones2){
			    	$scope.updateZoneProfit(isFirst, 2);
			    }
			    if(showZones3){
			    	$scope.updateZoneProfit(isFirst, 3);
			    }
			    if(showZones4){
			    	$scope.updateZoneProfit(isFirst, 4);
			    }
			    gMapService.closeLoadingMap();
		    }
		});
		return myDataPromise;
	};
	
	// Method getOccupancyStreetsUpdatesFromDb: used to retrieve te streets occupancy data from the db
	$scope.getOccupancyStreetsUpdatesFromDb = function(year, month, weekday, dayType, hour, valueType, oldStreets, cost_type){
		$scope.streetMapReady = false;
		$scope.streetCvsFile = "";
		$scope.zoneCvsFile = "";
		$scope.areaCvsFile = "";
		$scope.structCvsFile = "";
		// period params
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		
		var allStreet = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));
			
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancychanged/" + idApp + "/streets", params, $scope.authHeaders, null);
		myDataPromise.then(function(allStreet){
		    //angular.copy(result, allStreet);
		    gMapService.updateLoadingMapState();
		    $scope.myTmpZoneOccupation = [];
		    allStreet = $scope.mergeStreetsObjects(allStreet, oldStreets);	
		    //$scope.streetWS = $scope.initStreetsObjects(allStreet);
		    $scope.streetWS = $scope.initStreetsObjectsLight(allStreet);	//MB_lightWS
		    if($scope.streetWS && $scope.streetWS.length > 0){
			    gMapService.setOccupancyStreet($scope.streetWS);
			    if($scope.useAverageZoneOccupation){
				    for(var i = 0; i < $scope.streetWS.length; i++){
					    if($scope.streetWS[i].occupancyRate == -1){
							var found = false;
							for(var x = 0; x < $scope.myTmpZoneOccupation.length; x++){
								if($scope.streetWS[i].myZones0[0].id == $scope.myTmpZoneOccupation[x].id){
									$scope.streetWS[i].occupancyRate = $scope.myTmpZoneOccupation[x].occupancy;
									found = true;
								}
							}
							if(!found){
								var zVal = {
									id: $scope.streetWS[i].myZones0[0].id,
									occupancy: Math.floor(sharedDataService.getStreetsInZoneOccupancy($scope.streetWS[i].myZones0[0].id, $scope.streetWS))	// here I calculate the zone average occupancy
								};
								$scope.myTmpZoneOccupation.push(zVal);
								$scope.streetWS[i].occupancyRate = zVal.occupancy;
							}
					    }
				    }
			    }
			    
			    var isInList = sharedDataService.getIsInList();
			    if(isInList){
			    	$scope.streetWS = $scope.initAreasForStreetsObjects($scope.streetWS);
			    }
			    if(cost_type == 1){ // case of occupancy cost
				    if(!isInList){
					    if(showStreets){
					    	$scope.updateStreetOccupancy($scope.streetWS);
						}
					    if(showZones0){
					    	$scope.updateZoneOccupancy(false, 0);
					    }
					    if(showZones1){
					    	$scope.updateZoneOccupancy(false, 1);
					    }
					    if(showZones2){
					    	$scope.updateZoneOccupancy(false, 2);
					    }
					    if(showZones3){
					    	$scope.updateZoneOccupancy(false, 3);
					    }
					    if(showZones4){
					    	$scope.updateZoneOccupancy(false, 4);
					    }
					    if(showArea){
					    	$scope.updateAreaOccupancy(false);
					    }
				    }
			    } else {			// case of time cost
			    	if(!isInList){
					    if(showStreets){
					    	$scope.updateStreetTimeCost($scope.streetWS);
						}
					    if(showZones0){
					    	$scope.updateZoneTimeCost(false, 0);
					    }
					    if(showZones1){
					    	$scope.updateZoneTimeCost(false, 1);
					    }
					    if(showZones2){
					    	$scope.updateZoneTimeCost(false, 2);
					    }
					    if(showZones3){
					    	$scope.updateZoneTimeCost(false, 3);
					    }
					    if(showZones4){
					    	$scope.updateZoneTimeCost(false, 4);
					    }
					    if(showArea){
					    	$scope.updateAreaTimeCost(false);
					    }
				    }
			    }
			    //$scope.updateZonesOccupancyTimeCost();
			    if(showZones0){
			    	$scope.updateZonesOccupancyTimeCost(0);
			    }
			    if(showZones1){
			    	$scope.updateZonesOccupancyTimeCost(1);
			    }
			    if(showZones2){
			    	$scope.updateZonesOccupancyTimeCost(2);
			    }
			    if(showZones3){
			    	$scope.updateZonesOccupancyTimeCost(3);
			    }
			    if(showZones4){
			    	$scope.updateZonesOccupancyTimeCost(4);
			    }		    
			    //$scope.updateMicroZonesOccupancyTimeCost();
		    	$scope.updateAreasOccupancyTimeCost();
		    }
	    	gMapService.closeLoadingMap();
		});
	};
	
	// Method getProfitStructFromDb: used to retrieve te streets occupancy data from the db
	$scope.getProfitParksFromDb = function(year, month, weekday, dayType, hour, valueType, isFirst){
		// period params
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		$scope.streetMapReady = false;
		var markers = [];
		var allPSs = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params)); 	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profitchanged/" + idApp + "/parkstructs", params, $scope.authHeaders, null);	//MB_lightWS: invoke only profitchanged instead of profit
		myDataPromise.then(function(allPSs){
		    //angular.copy(result, allPSs);
		    $scope.profitStructWS = $scope.mergeParkDbData($scope.pstructWS, allPSs);
		    //$scope.mergeParkDbData($scope.pstructWS, $scope.profitStructWS);	// here I obtain an object with correct occupancy and profit data
		    angular.copy( $scope.profitStructWS, $scope.allDataStructWS);
		    
			if(showPs){
				for (var i = 0; i <  $scope.allDataStructWS.length; i++) {
			    	markers.push(gMapService.createMarkers(i, $scope.allDataStructWS[i], 6));	//MB_lightWS
			    }
				//$scope.parkingStructureMarkers = markers;
			   	angular.copy(markers, $scope.parkingStructureMarkers);
			   	$scope.updateParkProfit();
			}
			
			// ---- Init street area filter
			//$scope.allAreaFilter = [];	MB_lightWS: used in list version: TODO - understand how to include only in list version
			//angular.copy(sharedDataService.getSharedLocalAreas(),$scope.allAreaFilter);
			//if($scope.allAreaFilter != null && $scope.allAreaFilter.length > 0 && $scope.allAreaFilter[0].id != ''){
			//	$scope.allAreaFilter.splice(0,0,{id:'', name: "Tutte"});
			//}
			//$scope.streetAreaFilter = $scope.allAreaFilter[0].id;
			// ----------------------------
		});
		return myDataPromise;
	};
	
	
	// Method getOccupancyParksFromDb: used to retrieve te parks occupancy data from the db
	$scope.getOccupancyParksFromDb = function(year, month, weekday, dayType, hour, valueType, isFirst){
		// period params
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var allParks = [];
		var markers = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call for Parks" + JSON.stringify(params));
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructures", params, $scope.authHeaders, null);
		myDataPromise.then(function(allParks){
		    //angular.copy(result, allParks);
		    gMapService.updateLoadingMapState();
		    $scope.actualParks = allParks;
		    $scope.pstructWS = allParks;
		    
		    // to correct null values in parking slots
		    for(var i = 0; i < $scope.pstructWS.length; i++){
		    	if($scope.pstructWS[i].unusuableSlotNumber == null || $scope.pstructWS[i].unusuableSlotNumber == ""){
		    		$scope.pstructWS[i].unusuableSlotNumber = 0;
		    	}
		    	if($scope.pstructWS[i].payingSlotOccupied == null || $scope.pstructWS[i].payingSlotOccupied == ""){
		    		$scope.pstructWS[i].payingSlotOccupied = 0;
		    	}
		    	if($scope.pstructWS[i].handicappedSlotOccupied == null || $scope.pstructWS[i].handicappedSlotOccupied == ""){
		    		$scope.pstructWS[i].handicappedSlotOccupied = 0;
		    	}
		    }
		    
			if(showPs){
				for (var i = 0; i <  allParks.length; i++) {
			    	markers.push(gMapService.createMarkers(i, allParks[i], 4));	//MB_lightWS
			    }
			   	angular.copy(markers, $scope.parkingStructureMarkers);
			   	$scope.updateParkOccupancy();
			}
		});
		return myDataPromise;
	};
	
	// Method getOccupancyParksUpdatedFromDb: used to retrieve te parks occupancy data from the db
	$scope.getOccupancyParksUpdatedFromDb = function(year, month, weekday, dayType, hour, valueType, callType, oldParks, cost_type){
		// period params
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var allParks = [];
		var markers = [];
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call for Parks" + JSON.stringify(params));
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancychanged/" + idApp + "/parkingstructures", params, $scope.authHeaders, null);
		myDataPromise.then(function(allParks){
		    //angular.copy(result, allParks);
		    gMapService.updateLoadingMapState();
		    allParks = $scope.mergeParksObjects(allParks, oldParks);
		    $scope.actualParks = allParks;
		    $scope.pstructWS = allParks;
		    $scope.allDataStructWS = $scope.mergeParkDbData($scope.pstructWS, $scope.profitStructWS);	// here I obtain an object with correct occupancy and profit data
		    
			if(showPs){
			    for (var i = 0; i <  $scope.allDataStructWS.length; i++) {
				    markers.push(gMapService.createMarkers(i, $scope.allDataStructWS[i], 4));	//MB_lightWS
				}
			    angular.copy(markers, $scope.parkingStructureMarkers);
			    if(cost_type == 1){ // case of occupancy cost
			    	$scope.updateParkOccupancy();
			    } else {			// case of time cost
			    	$scope.updateParkTimeCost();
			    }
			}
		    /*if(callType == 1){
		    	$scope.getBikePointFromDb(false);
		    }*/
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
					if(newParks[j].unusuableSlotNumber == null || newParks[j].unusuableSlotNumber == ""){
						newParks[j].unusuableSlotNumber = 0;
					}
					found = true;
					var p = {
						id: oldParks[i].id,
						id_app: oldParks[i].id_app,
						name: oldParks[i].name,
						streetReference: oldParks[i].streetReference,
						managementMode: oldParks[i].managementMode,
						manager: oldParks[i].manager,
						fee: oldParks[i].fee,
						timeSlot: oldParks[i].timeSlot,
						slotNumber: newParks[j].slotNumber,
						slotOccupied: parseInt(newParks[j].payingSlotOccupied) + parseInt(newParks[j].handicappedSlotOccupied), 
						payingSlotNumber: newParks[j].payingSlotNumber,
						payingSlotOccupied: newParks[j].payingSlotOccupied,
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
	
	// Method mergeParkDbData: used to merge the db data from occupancy park and profit park
	$scope.mergeParkDbData = function(occupancyStructs, profitStructs){
		var mergedStructs = [];
		for(var i = 0; i < occupancyStructs.length; i++){
			var found = false;
			var timeCost = {};
			for(var j = 0; ((j < profitStructs.length) && !found); j++){
				if(occupancyStructs[i].id == profitStructs[j].id){
					found = true;
					timeCost = gMapService.getExtratimeFromOccupancy(occupancyStructs[i].occupancyRate);
					var p = {
						id: occupancyStructs[i].id,
						id_app: occupancyStructs[i].id_app,
						name: occupancyStructs[i].name,
						streetReference: occupancyStructs[i].streetReference,
						managementMode: occupancyStructs[i].managementMode,
						manager: occupancyStructs[i].manager,
						validityPeriod: occupancyStructs[i].validityPeriod,
						slotNumber: occupancyStructs[i].slotNumber,
						slotOccupied: parseInt(occupancyStructs[i].payingSlotOccupied) + parseInt(occupancyStructs[i].handicappedSlotOccupied), 
						payingSlotNumber: occupancyStructs[i].payingSlotNumber,
						payingSlotOccupied: occupancyStructs[i].payingSlotOccupied,
						handicappedSlotNumber: occupancyStructs[i].handicappedSlotNumber,
						handicappedSlotOccupied: occupancyStructs[i].handicappedSlotOccupied,
						unusuableSlotNumber: occupancyStructs[i].unusuableSlotNumber,
						geometry: occupancyStructs[i].geometry,
						paymentMode: occupancyStructs[i].paymentMode,
						phoneNumber: occupancyStructs[i].phoneNumber,
						lastChange: occupancyStructs[j].lastChange,
						occupancyRate: occupancyStructs[i].occupancyRate,
						parkAndRide: occupancyStructs[j].parkAndRide,
						profit : profitStructs[j].profit,
						tickets : profitStructs[j].tickets,
						//zone0: occupancyStructs[i].zone0,
						//zone1: occupancyStructs[i].zone1,
						//zone2: occupancyStructs[i].zone2,
						//zone3: occupancyStructs[i].zone3,
						//zone4: occupancyStructs[i].zone4,
						zones: (occupancyStructs[i].zones) ? occupancyStructs[i].zones : profitStructs[i].zones,
						extratime: timeCost
					};
					mergedStructs.push(p);
				}
			}
		}
		return mergedStructs;
	};
	
	// Method updateStreetOccupancy: update all street maps Object elements with new occupation data retrieved from db
	$scope.updateStreetOccupancy = function(streets){
		if($scope.dashboard_space.microzone_part){	// I check if the street check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		    	$scope.hideStreetPolylines(1);
		   		$scope.mapStreets = gMapService.initStreetsOnMap(streets, true, 1, false)[0];
		   	} else {
		   		$scope.hideStreetPolylines(2);
		   		$scope.occupancyStreets = gMapService.initStreetsOnMap(streets, true, 2, false)[0];
		    }
		}
	};
	
	$scope.checkZoneSelectedByIndex = function(z_index){
		var checked = false;
		switch(z_index){
			case 0: 
				checked = $scope.dashboard_space.zone0;
				break;
			case 1:
				checked = $scope.dashboard_space.zone1;
				break;
			case 2: 
				checked = $scope.dashboard_space.zone2;
				break;
			case 3: 
				checked = $scope.dashboard_space.zone3;
				break;
			case 4: 
				checked = $scope.dashboard_space.zone4;
				break;
		}
		return checked;
	};
	
	// Method updateZoneOccupancy: update all zone maps Object elements with new occupation data retrieved from db
	$scope.updateZoneOccupancy = function(firstTime, z_index){
		var myZones = $scope.getZoneListFromIndex(z_index);
		if($scope.checkZoneSelectedByIndex(z_index)){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		    	$scope.hideZonePolygons(1, z_index);
		   		var zoneOnMap = gMapService.initZonesOnMap(myZones, true, 1, false, firstTime)[0];	//MB_lightWS
		   		$scope.setMapZoneList(z_index, zoneOnMap);
		   	} else {
		   		$scope.hideZonePolygons(2, z_index);
		   		var occupancyOnMap = gMapService.initZonesOnMap(myZones, true, 2, false, firstTime)[0];	//MB_lightWS
		   		$scope.setOccupancyZoneList(z_index, occupancyOnMap);
		    }
		}
	};
	
	// Method updateAreaOccupancy: update all area maps Object elements with new occupation data retrieved from db
	$scope.updateAreaOccupancy = function(firstTime){
		if($scope.dashboard_space.rate_area){	// I check if the area check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		    	$scope.hideAreaPolygons(1);
		   		$scope.mapAreas = gMapService.initAreasOnMap($scope.areaWS, true, 1, false, firstTime)[0];	//MB_lightWS
		   	} else {
		   		$scope.hideAreaPolygons(2);
		   		$scope.occupancyAreas = gMapService.initAreasOnMap($scope.areaWS, true, 2, false, firstTime)[0];	//MB_lightWS
		    }
		}
	};
	
	// Method updateAreaTimeCost: update all area maps Object elements with new time cost data retrieved from occupation in db
	$scope.updateAreaTimeCost = function(firstTime){
		if($scope.dashboard_space.rate_area){	// I check if the area check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		    	$scope.hideAreaPolygons(1);
		    	$scope.mapAreas = gMapService.initAreasOnMap($scope.areaWS, true, 1, false, firstTime)[0];	//MB_lightWS
		   	} else {
		   		$scope.hideAreaPolygons(4);
		   		$scope.timeCostAreas = gMapService.initAreasOnMap($scope.areaWS, true, 4, false, firstTime)[0];	//MB_lightWS
		    }
		}
	};
	
	// Method updateParkOccupancy: update all parking structure maps Object elements with new occupation data retrieved from db
	$scope.updateParkOccupancy = function(){
		if($scope.dashboard_space.parkingstructs){	// I check if the parkingstructures check is selected
			$scope.closeAllDetailsList();
			$scope.mapParkingStructureSelectedMarkers = [];
		    if($scope.dashboard_topics == "parkSupply"){
		    	$scope.mapParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);	//MB_lightWS
		   	} else {
		   		$scope.occupancyParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 2);	//MB_lightWS
		    }
		}
	};
	
	// Method updateParkTimeCost: update all parking structure maps Object elements with new time cost data retrieved from occupancy in db
	$scope.updateParkTimeCost = function(){
		if($scope.dashboard_space.parkingstructs){	// I check if the parkingstructures check is selected
			$scope.closeAllDetailsList();
			$scope.mapParkingStructureSelectedMarkers = [];
			if($scope.dashboard_topics == "parkSupply"){
		    	$scope.mapParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);	//MB_lightWS
		   	} else {
		   		$scope.timeCostParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 4);	//MB_lightWS
		    }
		}
	};
	
	// Method updateZoneOccupancyTimeCost: update all zone maps Object elements with new time cost data retrieved from occupancy in db
	$scope.updateZonesOccupancyTimeCost = function(z_index){
		var myZones = $scope.getZoneListFromIndex(z_index);
		if(myZones){
			for(var i = 0; i < myZones.length; i++){							//$scope.zoneWS
				var slotsInZone = sharedDataService.getTotalSlotsInZone(myZones[i].id, $scope.streetWS);	//$scope.zoneWS
				myZones[i].slotNumber = slotsInZone[0];							//$scope.zoneWS
				myZones[i].slotOccupied = slotsInZone[1];						//$scope.zoneWS
				var zoneOccupancy = sharedDataService.getStreetsInZoneOccupancy(myZones[i].id, $scope.streetWS);	//$scope.zoneWS
				if(zoneOccupancy != -1){
					zoneOccupancy = slotsInZone[2];
				}
				var timeCost = gMapService.getExtratimeFromOccupancy(zoneOccupancy);
				myZones[i].occupancy = (zoneOccupancy != -1) ? Math.round(zoneOccupancy) : zoneOccupancy;	//$scope.zoneWS
				myZones[i].zColor = gMapService.getOccupancyColor(zoneOccupancy);								//$scope.zoneWS
				myZones[i].extratime = timeCost;															//$scope.zoneWS
				$scope.setZoneListFromIndex(z_index, myZones);
			}
		}
	};
	
	// Method updateStreetProfit: update all street maps Object elements with new profit data retrieved from db
	$scope.updateStreetProfit = function(firstTime, show){
		$scope.streetWS = gMapService.calculateProfitForStreets($scope.streetWS);	//MB_lightWS
		$scope.profitStreetsList = gMapService.initStreetsOnMap($scope.streetWS, show, 3, firstTime)[1];
		if($scope.dashboard_space.microzone_part && !firstTime){	// I check if the street check is selected // && $scope.dashboard_topics_list != "receipts"
			if($scope.dashboard_topics == "parkSupply"){
				$scope.hideStreetPolylines(1);
			   	$scope.mapStreets = gMapService.initStreetsOnMap($scope.streetWS, show, 1, false)[0];
			} else {
				$scope.hideStreetPolylines(3);
			   	$scope.profitStreets = gMapService.initStreetsOnMap($scope.streetWS, show, 3, false)[0];
			}
		}
	};
	
	$scope.getZoneListFromIndex = function(z_index){
		var myzones = [];
		switch(z_index){
			case 0: 
				myzones = $scope.zoneWS0;
				break;
			case 1:
				myzones = $scope.zoneWS1;
				break;
			case 2: 
				myzones = $scope.zoneWS2;
				break;
			case 3: 
				myzones = $scope.zoneWS3;
				break;
			case 4: 
				myzones = $scope.zoneWS4;
				break;
		}
		return myzones;
	};
	
	$scope.setZoneListFromIndex = function(z_index, list){
		switch(z_index){
			case 0: 
				$scope.zoneWS0 = list;
				break;
			case 1:
				$scope.zoneWS1 = list;
				break;
			case 2: 
				$scope.zoneWS2 = list;
				break;
			case 3: 
				$scope.zoneWS3 = list;
				break;
			case 4: 
				$scope.zoneWS4 = list;
				break;
		}
	};
	
	$scope.initZoneProfitLists = function(z_index, firstTime){
		var myZones = $scope.getZoneListFromIndex(z_index);
		switch(z_index){
			case 0: 
				$scope.profitZonesList0 = gMapService.initZonesOnMap(myZones, true, 3, false, firstTime)[1];
				break;
			case 1: 
				$scope.profitZonesList1 = gMapService.initZonesOnMap(myZones, true, 3, false, firstTime)[1];
				break;
			case 2: 
				$scope.profitZonesList2 = gMapService.initZonesOnMap(myZones, true, 3, false, firstTime)[1];
				break;
			case 3: 
				$scope.profitZonesList3 = gMapService.initZonesOnMap(myZones, true, 3, false, firstTime)[1];
				break;
			case 4: 
				$scope.profitZonesList4 = gMapService.initZonesOnMap(myZones, true, 3, false, firstTime)[1];
				break;
		}
	};
	
	// Method updateZoneProfit: update all zone maps Object elements with new occupation data retrieved from db
	$scope.updateZoneProfit = function(firstTime, z_index){
		var myZones = $scope.getZoneListFromIndex(z_index);
		$scope.initZoneProfitLists(z_index, firstTime);
		var selected_zone = $scope.checkZoneSelectedByIndex(z_index);
		if(selected_zone){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		    	$scope.hideZonePolygons(1, z_index);
		   		var zoneOnMap = gMapService.initZonesOnMap(myZones, true, 1, false, firstTime)[0];	//MB_lightWS
		   		$scope.setMapZoneList(z_index, zoneOnMap);
		   	} else {
		   		$scope.hideZonePolygons(3, z_index);
		   		var zoneprofitOnMap = gMapService.initZonesOnMap(myZones, true, 3, false, firstTime)[0];	//MB_lightWS
		   		$scope.setProfitZoneList(z_index, zoneprofitOnMap);
		    }
		}
		if(firstTime){
			var zoneOnMap = $scope.getMapZoneList(z_index);
			zoneOnMap = gMapService.initZonesOnMap(myZones, false, 1, true, firstTime)[0];	//MB_lightWS
   			$scope.setMapZoneList(z_index, zoneOnMap);
		}
	};
	
	// Method updateAreaOccupancy: update all area maps Object elements with new occupation data retrieved from db
	$scope.updateAreaProfit = function(firstTime){
		$scope.profitAreaList = gMapService.initAreasOnMap($scope.areaWS, true, 3, false, firstTime)[1];
		if($scope.dashboard_space.rate_area){	// I check if the area check is selected	// && $scope.dashboard_topics_list != "receipts"
		    if($scope.dashboard_topics == "parkSupply"){
		    	$scope.hideAreaPolygons(1);
		    	$scope.mapAreas = gMapService.initAreasOnMap($scope.areaWS, true, 1, false, firstTime)[0];	//MB_lightWS
		   	} else {
		   		$scope.hideAreaPolygons(3);
		   		$scope.profitAreas = gMapService.initAreasOnMap($scope.areaWS, true, 3, false, firstTime)[0];	//MB_lightWS
		    }
		}
	};
	
	// Method updateParkProfit: update all struct maps Object elements with new profit data retrieved from db
	$scope.updateParkProfit = function(){
		if($scope.dashboard_space.parkingstructs){	// I check if the parkingstructures check is selected
			$scope.closeAllDetailsList();
			$scope.mapParkingStructureSelectedMarkers = [];
			if($scope.dashboard_topics == "parkSupply"){
		    	$scope.mapParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);	//MB_lightWS
		   	} else {
		   		$scope.profitParkingStructureMarkers = gMapService.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 3);	//MB_lightWS
		    }
		}
	};
	
	// Method updatePMProfit: update all parking meters maps Object elements with new profit data retrieved from db
	$scope.updatePMProfit = function(){
		if($scope.dashboard_space.parkingmeter){	// I check if the parkingstructures check is selected
		    // here I close eventually opened details view
			$scope.closeAllDetailsList();
			$scope.mapParkingMetersSelectedMarkers = [];
			if($scope.dashboard_topics == "parkSupply"){
				$scope.mapParkingMetersMarkers = gMapService.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 0);	//MB_lightWS
		   	} else {
		   		$scope.profitParkingMetersMarkers = gMapService.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 5);	//MB_lightWS
		    }
		}
	};
	
	// Method updateStreetTimeCost: update all street maps Object elements with new time cost data retrieved from occupancy in db
	$scope.updateStreetTimeCost = function(streets){
		if($scope.dashboard_space.microzone_part){	// I check if the street check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		    	$scope.hideStreetPolylines(1);
		   		$scope.mapStreets = $scope.initStreetsOnMap(streets, true, 1, false)[0];
		   	} else {
		   		$scope.hideStreetPolylines(4);
		   		$scope.timeCostStreets = $scope.initStreetsOnMap(streets, true, 4, false)[0];
		    }
		}
	};
	
	// Method updateZoneTimeCost: update all zone maps Object elements with new time cost data retrieved from occupancy in db
	$scope.updateZoneTimeCost = function(firstTime, z_index){
		var myZones = $scope.getZoneListFromIndex(z_index);
		if($scope.checkZoneSelectedByIndex(z_index)){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		    	$scope.hideZonePolygons(1, z_index);
		    	var zoneOnMap = gMapService.initZonesOnMap(myZones, true, 1, false, firstTime)[0];	//MB_lightWS
		   		$scope.setMapZoneList(z_index, zoneOnMap);
		   	} else {
		   		$scope.hideZonePolygons(4, z_index);
		   		var zonetimecostOnMap = gMapService.initZonesOnMap(myZones, true, 4, false, firstTime)[0];	//MB_lightWS
		   		$scope.setTimeCostZoneList(z_index, zonetimecostOnMap);
		    }
		}
	};
	
	$scope.getBikePointFromDb = function(isFirst){
		var markers = [];
		var allBikePoints = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/bikepoint", null, $scope.authHeaders, null);
	    myDataPromise.then(function(allBikePoints){
	    	//angular.copy(result, allBikePoints);   	
	    	if(showBp){
	    		for (var i = 0; i <  allBikePoints.length; i++) {
		    		markers.push(gMapService.createMarkers(i, allBikePoints[i], 3));	//MB_lightWS
			    }
	    		angular.copy(markers, $scope.bikePointMarkers);
	    	}
		});
	    return myDataPromise;
	};
	
	$scope.getAllZones = function(z_type, tindex){
		$scope.zoneMapReady = false;
		
		var allZones = [];
		var myZonePromise = zoneService.getZonesFromDb(z_type);
		myZonePromise.then(function(allZones){
		//var method = 'GET';
		//var appId = sharedDataService.getConfAppId();
	   	//var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/zone/" + z_type, null, $scope.authHeaders, null);
	    //myDataPromise.then(function(allZones){
	    	//angular.copy(result, allZones);
	    	switch(tindex){
	    		case 0:
	    			if(showZones0){
	    				$scope.zoneWS0 = gMapService.correctMyZones(allZones);
				    	//$scope.initZonesOnMap($scope.zoneWS0, false, 1, false, true);
				    	gMapService.initZonesOnMap($scope.zoneWS0, false, 1, false, true);	//MB_lightWS
				    	$scope.setSharedLocalZones($scope.zoneWS0, tindex);
				    }
	    			break;
	    		case 1: 
	    			if(showZones1){
	    				$scope.zoneWS1 = gMapService.correctMyZones(allZones);
				    	//$scope.initZonesOnMap($scope.zoneWS1, false, 1, false, true);
				    	gMapService.initZonesOnMap($scope.zoneWS1, false, 1, false, true);	//MB_lightWS
				    	$scope.setSharedLocalZones($scope.zoneWS1, tindex);
				    }
	    			break;
	    		case 2: 
	    			if(showZones2){
	    				$scope.zoneWS2 = gMapService.correctMyZones(allZones);
				    	//$scope.initZonesOnMap($scope.zoneWS2, false, 1, false, true);
				    	gMapService.initZonesOnMap($scope.zoneWS2, false, 1, false, true);	//MB_lightWS
				    	$scope.setSharedLocalZones($scope.zoneWS2, tindex);
				    }
	    			break;
	    		case 3:
	    			if(showZones3){
	    				$scope.zoneWS3 = gMapService.correctMyZones(allZones);
				    	//$scope.initZonesOnMap($scope.zoneWS3, false, 1, false, true);
				    	gMapService.initZonesOnMap($scope.zoneWS3, false, 1, false, true);	//MB_lightWS
				    	$scope.setSharedLocalZones($scope.zoneWS3, tindex);
				    }
	    			break;
	    		case 4:
	    			if(showZones4){
	    				$scope.zoneWS4 = gMapService.correctMyZones(allZones);
				    	//$scope.initZonesOnMap($scope.zoneWS4, false, 1, false, true);
				    	gMapService.initZonesOnMap($scope.zoneWS4, false, 1, false, true);	//MB_lightWS
				    	$scope.setSharedLocalZones($scope.zoneWS4, tindex);
				    }
	    			break;
	    	};
	    	$scope.zoneMapReady = true;
	    });
	    return myZonePromise;
	};
	
	$scope.detailsOpened = false;
	$scope.mapParkingMetersSelectedMarkers = [];
	$scope.mapParkingStructureSelectedMarkers = [];
	$scope.mapSelectedStreets = [];
	$scope.mapSelectedZones0 = [];
	$scope.mapSelectedZones1 = [];
	$scope.mapSelectedZones2 = [];
	$scope.mapSelectedZones3 = [];
	$scope.mapSelectedZones4 = [];
	$scope.mapSelectedAreas = [];
	var pMDet = false;
	var pSDet = false;
	var streetDet = false;
	var zoneDet0 = false;
	var zoneDet1 = false;
	var zoneDet2 = false;
	var zoneDet3 = false;
	var zoneDet4 = false;
	//var microZoneDet = false;
	var areaDet = false;
	
	$scope.getMapSelectedZones = function(z_index){
		switch(z_index){
			case 0: 
				return $scope.mapSelectedZones0 = [];
				break;
			case 1: 
				return $scope.mapSelectedZones1 = [];
				break;
			case 2: 
				return $scope.mapSelectedZones2 = [];
				break;
			case 3: 
				return $scope.mapSelectedZones3 = [];
				break;
			case 4: 
				return $scope.mapSelectedZones4 = [];
				break;
		}
	};
	
	$scope.setMapSelectedZones = function(z_index, list){
		switch(z_index){
			case 0: 
				$scope.mapSelectedZones0 = list;
				break;
			case 1: 
				$scope.mapSelectedZones1 = list;
				break;
			case 2: 
				$scope.mapSelectedZones2 = list;
				break;
			case 3: 
				$scope.mapSelectedZones3 = list;
				break;
			case 4: 
				$scope.mapSelectedZones4 = list;
				break;
		}
	};
	
	$scope.setZoneDet = function(value, z_index){
		switch(z_index){
			case 0: 
				zoneDet0 = value;
				break;
			case 1:
				zoneDet1 = value;
				break;
			case 2: 
				zoneDet2 = value;
				break;
			case 3: 
				zoneDet3 = value;
				break;
			case 4: 
				zoneDet4 = value;
				break;
		}
	};
	
	$scope.setZoneDetAll = function(value){
		zoneDet0 = value;
		zoneDet1 = value;
		zoneDet2 = value;
		zoneDet3 = value;
		zoneDet4 = value;
	};
	
	$scope.showPMDet = function(){
		pMDet = true;
		pSDet = false;
		streetDet = false;
		$scope.setZoneDetAll(false);
		areaDet = false;
	};
	
	$scope.showPSDet = function(){
		pMDet = false;
		pSDet = true;
		streetDet = false;
		$scope.setZoneDetAll(false);
		areaDet = false;
	};
	
	$scope.showStreetDet = function(){
		pMDet = false;
		pSDet = false;
		streetDet = true;
		$scope.setZoneDetAll(false);
		areaDet = false;
	};
	
	$scope.showZoneDet = function(z_index){
		pMDet = false;
		pSDet = false;
		streetDet = false;
		$scope.setZoneDetAll(false);
		$scope.setZoneDet(true, z_index);
		areaDet = false;
	};
	
	$scope.showAreaDet = function(){
		pMDet = false;
		pSDet = false;
		streetDet = false;
		$scope.setZoneDetAll(false);
		areaDet = true;
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
	
	$scope.isZoneDetShow = function(z_index){
		switch(z_index){
			case 0:
				return zoneDet0;
				break;
			case 1:
				return zoneDet1;
				break;
			case 2:
				return zoneDet2;
				break;
			case 3: 
				return zoneDet3;
				break;
			case 4:
				return zoneDet4;
				break;
		}		
	};
	
	$scope.isAreaDetShow = function(){
		return areaDet;
	};
	
	// Method show Details: used to show an object details when selected on map
	// params: - event (click on element in map);
	//		   - object: selected object;
	//	 	   - type: type of object: 1 pm, 2 ps, 3 street, 4 zone, 5 area, 6 microzone;
	//		   - theme: theme of the selection: 0 availability, 1 occupancy, 2 profit, 3 time cost;
	$scope.showDetails = function(event, object, type, theme, z_index){	
		$scope.theme = theme;	// used in close details panel
		switch(type){
			case 1:
				object = gMapService.initPMObject(object, 0);	//MB_lightWS
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
				//--------------------------------------------------------
				var myAreaPm = {};
				if(theme == 0){
					for(var i = 0; i < $scope.mapParkingMetersMarkers.length; i++){
						if($scope.mapParkingMetersMarkers[i].id == object.id){
							$scope.mapParkingMetersMarkers.splice(i, 1);
						}
					}
				} else if(theme == 2) {
					for(var i = 0; i < $scope.profitParkingMetersMarkers.length; i++){
						if($scope.profitParkingMetersMarkers[i].id == object.id){
							$scope.profitParkingMetersMarkers.splice(i, 1);
						}
					}
				}
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				$scope.showPMDet();
				if(theme == 0){
					myAreaPm = sharedDataService.getLocalAreaById(object.data.areaId);
					object.icon = baseUrl+'/marker/'+company+'/parcometroneg/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
				} else if(theme == 2){
					var color = $scope.plainColor(object.myprofitColor);
					object.icon = baseUrl+'/marker/'+company+'/parcometroneg/'+((color != null && color != "") ? color : defaultMarkerColor);
				}
				$scope.mapParkingMetersSelectedMarkers.push(object);
				$scope.pmDetails = object;
				break;	
			case 2:
				object = gMapService.initPSObject(object);
				if(theme == 0){
					for(var i = 0; i < $scope.mapParkingStructureMarkers.length; i++){
						if($scope.mapParkingStructureMarkers[i].id == object.id){
							$scope.mapParkingStructureMarkers.splice(i, 1);
						}
					}
				} else if(theme == 1){
					for(var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
						if($scope.occupancyParkingStructureMarkers[i].id == object.id){
							$scope.occupancyParkingStructureMarkers.splice(i, 1);
						}
					}
				} else if(theme == 2){
					for(var i = 0; i < $scope.profitParkingStructureMarkers.length; i++){
						if($scope.profitParkingStructureMarkers[i].id == object.id){
							$scope.profitParkingStructureMarkers.splice(i, 1);
						}
					}
				} else if(theme == 3){
					for(var i = 0; i < $scope.timeCostParkingStructureMarkers.length; i++){
						if($scope.timeCostParkingStructureMarkers[i].id == object.id){
							$scope.timeCostParkingStructureMarkers.splice(i, 1);
						}
					}
				}	
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				$scope.showPSDet();
				object.icon = $scope.useSelectedIcon(object.icon);
				$scope.mapParkingStructureSelectedMarkers.push(object);
				$scope.psDetails = object;
				if(theme == 1 || theme == 3){
					gMapService.initPsOccupancyDiagram(object, 1);
				}
				break;
			case 3:
				object = gMapService.initStreetObject(object, 0);
				$scope.closeAllDetails(theme);		// Here I check if there is a selected object and I fix it
				object.stroke.weight = 4;			//10
				object.stroke.opacity = 1.0;
				var toDelStreet = $scope.map.shapes;
			    toDelStreet[object.id].setMap(null);		// I can access dinamically the value of the object shapes for street
			    if(theme == 0){
				    for(var i = 0; i < $scope.mapStreets.length; i++){
				    	if($scope.mapStreets[i].id == object.id){
				    		$scope.mapStreets.splice(i, 1);
				    	}
				    }
			    } else if(theme == 1){
			    	for(var i = 0; i < $scope.occupancyStreets.length; i++){
				    	if($scope.occupancyStreets[i].id == object.id){
				    		$scope.occupancyStreets.splice(i, 1);
				    	}
				    }
			    } else if(theme == 2){
			    	for(var i = 0; i < $scope.profitStreets.length; i++){
					   	if($scope.profitStreets[i].id == object.id){
					   		$scope.profitStreets.splice(i, 1);
					   	}
				    }
			    } else if(theme == 3){
			    	for(var i = 0; i < $scope.timeCostStreets.length; i++){
					   	if($scope.timeCostStreets[i].id == object.id){
					   		$scope.timeCostStreets.splice(i, 1);
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
			    
			    if(theme == 1){
			    	var freeParkSlotDisp = (object.data.freeParkSlotNumber > 0) ? (object.data.freeParkSlotNumber - object.data.freeParkSlotOccupied) : 0;
			    	var freeParkSlotSignDisp = (object.data.freeParkSlotSignNumber > 0) ? (object.data.freeParkSlotSignNumber - object.data.freeParkSlotSignOccupied) : 0;
			    	var paidSlotDisp = (object.data.paidSlotNumber > 0 ) ? (object.data.paidSlotNumber - object.data.paidSlotOccupied) : 0;
			    	var timedParkSlotDisp = (object.data.timedParkSlotNumber > 0) ? (object.data.timedParkSlotNumber - object.data.timedParkSlotOccupied) : 0;
			    	var handicappedSlotDisp = (object.data.handicappedSlotNumber > 0) ? (object.data.handicappedSlotNumber - object.data.handicappedSlotOccupied) : 0;
			    	var reservedSlotDisp = (object.data.reservedSlotNumber > 0)? (object.data.reservedSlotNumber - object.data.reservedSlotOccupied) : 0;
			    	var unusuableSlot = object.data.unusuableSlotNumber;
			    	// block to manage free slots and unusualbed slots
			    	if(unusuableSlot > 0 && freeParkSlotDisp > 0){
			    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(freeParkSlotDisp,unusuableSlot);
			    		freeParkSlotDisp = tmpSlots[0];
			    		unusuableSlot = tmpSlots[1];
			    	}
			    	if(unusuableSlot > 0 && freeParkSlotSignDisp > 0){
			    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(freeParkSlotSignDisp,unusuableSlot);
			    		freeParkSlotSignDisp = tmpSlots[0];
			    		unusuableSlot = tmpSlots[1];
			    	}
			    	if(unusuableSlot > 0 && paidSlotDisp > 0){
			    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(paidSlotDisp,unusuableSlot);
			    		paidSlotDisp = tmpSlots[0];
			    		unusuableSlot = tmpSlots[1];
			    	}
			    	if(unusuableSlot > 0 && timedParkSlotDisp > 0){
			    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(timedParkSlotDisp,unusuableSlot);
			    		timedParkSlotDisp = tmpSlots[0];
			    		unusuableSlot = tmpSlots[1];
			    	}
			    	if(unusuableSlot > 0 && handicappedSlotDisp > 0){
			    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(handicappedSlotDisp,unusuableSlot);
			    		handicappedSlotDisp = tmpSlots[0];
			    		unusuableSlot = tmpSlots[1];
			    	}
			    	if(unusuableSlot > 0 && reservedSlotDisp > 0){
			    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(reservedSlotDisp,unusuableSlot);
			    		reservedSlotDisp = tmpSlots[0];
			    		unusuableSlot = tmpSlots[1];
			    	}
			    	object.data.freeParkSlotFree = freeParkSlotDisp;
			    	object.data.freeParkSlotSignFree = freeParkSlotSignDisp;
					object.data.paidSlotFree = paidSlotDisp;
					object.data.timedParkSlotFree = timedParkSlotDisp;
					object.data.handicappedSlotFree = handicappedSlotDisp;
					object.data.reservedSlotFree = reservedSlotDisp;
			    }
			    $scope.showStreetDet();
				$scope.sDetails = object;
			    
			    if(theme == 1 || theme == 3){
			    	gMapService.initStreetOccupancyDiagram(object, 1);
			    }
				break;	
			case 4:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				var toDelZones = $scope.map.shapes;
				var mapSelectedZ = $scope.getMapSelectedZones(z_index);;
				var zoneOnMap = $scope.getMapZoneList(z_index);
		    	var zoneoccupancyOnMap = $scope.getOccupancyZoneList(z_index);
		    	var zoneprofitOnMap = $scope.getProfitZoneList(z_index);
		    	var zonetimecostOnMap = $scope.getTimeCostZoneList(z_index);
				if(object.subelements && object.subelements.length && object.subelements.length > 0){
					for(var z = 0; z < object.subelements.length; z++){
						var s = object.subelements[z];
						var subId = "mz" + s.id;
						toDelZones[subId].setMap(null);
						if(theme == 0){
						    for(var i = 0; i < zoneOnMap.length; i++){	//$scope.mapMicroZones
						    	if(zoneOnMap[i].id == subId){			//$scope.mapMicroZones
						    		zoneOnMap.splice(i, 1);				//$scope.mapMicroZones
						    	}
						    }
					    } else if(theme == 1){
					    	for(var i = 0; i < zoneoccupancyOnMap.length; i++){	//$scope.occupancyMicroZones
						    	if(zoneoccupancyOnMap[i].id == subId){			//$scope.occupancyMicroZones
						    		zoneoccupancyOnMap.splice(i, 1);			//$scope.occupancyMicroZones
						    	}
						    }
					    } else if(theme == 2){
					    	for(var i = 0; i < zoneprofitOnMap.length; i++){	//$scope.profitMicroZones
						    	if(zoneprofitOnMap[i].id == subId){				//$scope.profitMicroZones
						    		zoneprofitOnMap.splice(i, 1);				//$scope.profitMicroZones
						    	}
						    }
					    } else if(theme == 3){
					    	for(var i = 0; i < zonetimecostOnMap.length; i++){	//$scope.timeCostMicroZones
						    	if(zonetimecostOnMap[i].id == subId){			//$scope.timeCostMicroZones
						    		zonetimecostOnMap.splice(i, 1);				//$scope.timeCostMicroZones
						    	}
						    }
					    }
						var polyline = s.geometry;
						var mzone = {
								id: "mz" +	s.id,	//$scope.correctObjId(zones[i].id, j),	// I try to use id of street instead of id of zone
								type: "polyline",
								path: gMapService.correctPoints(polyline.points),
								gpath: gMapService.correctPointsGoogle(polyline.points),
								stroke: {
								    color: object.stroke.color,
								    weight: 4,
								    opacity: 1.0
								},
								data: object.data,
								info_windows_pos: gMapService.correctPointGoogle(polyline.points[1]),
								info_windows_cod: "z" + object.id,
								editable: true,
								draggable: true,
								geodesic: false,
								visible: true,
								subelements: object.subelements
							};
							mapSelectedZ.push(mzone);
					}
				} else {
					object.stroke.weight = 3;
					object.stroke.opacity = 1.0;
					object.fill.opacity = 0.8;
				    toDelZones[object.id].setMap(null);
				    if(theme == 0){
					    for(var i = 0; i < zoneOnMap.length; i++){	//$scope.mapZones
					    	if(zoneOnMap[i].id == object.id){		//$scope.mapZones
					    		zoneOnMap.splice(i, 1);				//$scope.mapZones
					    	}
					    }
				    } else if(theme == 1){
				    	for(var i = 0; i < zoneoccupancyOnMap.length; i++){	//$scope.occupancyZones
					    	if(zoneoccupancyOnMap[i].id == object.id){		//$scope.occupancyZones
					    		zoneoccupancyOnMap.splice(i, 1);			//$scope.occupancyZones
					    	}
					    }
				    } else if(theme == 2){
				    	for(var i = 0; i < zoneprofitOnMap.length; i++){	//$scope.profitZones
					    	if(zoneprofitOnMap[i].id == object.id){			//$scope.profitZones
					    		zoneprofitOnMap.splice(i, 1);				//$scope.profitZones
					    	}
					    }
				    } else if(theme == 3){
				    	for(var i = 0; i < zonetimecostOnMap.length; i++){	//$scope.timeCostZones
					    	if(zonetimecostOnMap[i].id == object.id){		//$scope.timeCostZones
					    		zonetimecostOnMap.splice(i, 1);				//$scope.timeCostZones
					    	}
					    }
				    }
				    mapSelectedZ.push(object);
				}
			    $scope.setMapSelectedZones(z_index, mapSelectedZ);
			    $scope.showZoneDet(z_index);
				$scope.zDetails = object;
				if(theme == 1 || theme == 3){
					gMapService.initZoneOccupancyDiagram(object, 1);	
				}
				$scope.setMapZoneList(z_index, zoneOnMap);
			    $scope.setOccupancyZoneList(z_index, zoneoccupancyOnMap);
			    $scope.setProfitZoneList(z_index, zoneprofitOnMap);
			    $scope.setTimeCostZoneList(z_index, zonetimecostOnMap);
				break;
			case 5:
				object = gMapService.initAreaObject(object, 0);
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
			    } else if(theme == 1){
			    	for(var i = 0; i < $scope.occupancyAreas.length; i++){
				    	if($scope.occupancyAreas[i].id == object.id){
				    		$scope.occupancyAreas.splice(i, 1);
				    	}
				    }
			    } else if(theme == 2){
			    	for(var i = 0; i < $scope.profitAreas.length; i++){
				    	if($scope.profitAreas[i].id == object.id){
				    		$scope.profitAreas.splice(i, 1);
				    	}
				    }
			    } else if(theme == 3){
			    	for(var i = 0; i < $scope.timeCostAreas.length; i++){
				    	if($scope.timeCostAreas[i].id == object.id){
				    		$scope.timeCostAreas.splice(i, 1);
				    	}
				    }
			    }
			    $scope.mapSelectedAreas.push(object);
			    $scope.showAreaDet();
				$scope.aDetails = object;
				if(theme == 1 || theme == 3){
					gMapService.initAreaOccupancyDiagram(object, 1);
				}
				break;
			case 6:
				$scope.closeAllDetails(theme);	// Here I check if there is a selected object and I fix it
				var toDelZones = $scope.map.shapes;
				for(var z = 0; z < object.subelements.length; z++){
					var s = object.subelements[z];
					var subId = "mz" + s.id;
				    //toDelZones[object.id].setMap(null);		// I can access dinamically the value of the object shapes for street
					toDelZones[subId].setMap(null);
					if(theme == 0){
					    for(var i = 0; i < $scope.mapMicroZones.length; i++){
					    	if($scope.mapMicroZones[i].id == subId){		//object.id
					    		$scope.mapMicroZones.splice(i, 1);
					    	}
					    }
				    } else if(theme == 1){
				    	for(var i = 0; i < $scope.occupancyMicroZones.length; i++){
					    	if($scope.occupancyMicroZones[i].id == subId){	//object.id
					    		$scope.occupancyMicroZones.splice(i, 1);
					    	}
					    }
				    } else if(theme == 2){
				    	for(var i = 0; i < $scope.profitMicroZones.length; i++){
					    	if($scope.profitMicroZones[i].id == subId){		//object.id
					    		$scope.profitMicroZones.splice(i, 1);
					    	}
					    }
				    } else if(theme == 3){
				    	for(var i = 0; i < $scope.timeCostMicroZones.length; i++){
					    	if($scope.timeCostMicroZones[i].id == subId){	//object.id
					    		$scope.timeCostMicroZones.splice(i, 1);
					    	}
					    }
				    }
					var polyline = s.geometry;
					var mzone = {
							id: "mz" +	s.id,	//$scope.correctObjId(zones[i].id, j),	// I try to use id of street instead of id of zone
							path: gMapService.correctPoints(polyline.points),
							gpath: gMapService.correctPointsGoogle(polyline.points),
							stroke: {
							    color: object.stroke.color,
							    weight: 4,
							    opacity: 1.0
							},
							data: object.data,
							info_windows_pos: gMapService.correctPointGoogle(polyline.points[1]),
							info_windows_cod: "z" + object.id,
							editable: true,
							draggable: true,
							geodesic: false,
							visible: true,
							subelements: object.subelements
						};
			    	//$scope.mapSelectedMicroZones.push(object);
			    	$scope.mapSelectedMicroZones.push(mzone);
				}
			    //$scope.showMicroZoneDet();
				$scope.microZDetails = object;
				if(theme == 1 || theme == 3){
					gMapService.initMicroZoneOccupancyDiagram(object, 1);	
				}
				break;	
		};
		switch(theme){
			case 0:
				$scope.detailsOpened = true;
				break;
			case 1:
				$scope.occupancyOpened = true;
				break;
			case 2:
				$scope.profitOpened = true;
				break;
			case 3:
				$scope.timeCostOpened = true;
				break;	
			default:
				break;
		};
		return object;
	};
	
	$scope.hideDetails = function(event, object, type, theme, z_index){
		$scope.detailsOpened = false;
		$scope.occupancyOpened = false;
		$scope.profitOpened = false;
		$scope.timeCostOpened = false;
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
			myAreaPm = sharedDataService.getLocalAreaById(object.data.areaId);
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
			} else if($scope.profitParkingMetersMarkers.length > 0){
				$scope.profitParkingMetersMarkers.push(object);
			} else if($scope.timeCostParkingMetersMarkers.length > 0){
				$scope.timeCostParkingMetersMarkers.push(object);
			}
			$scope.mapParkingMetersSelectedMarkers = [];
			break;
		case 2:
			object.icon = $scope.useNormalIcon(object.icon);
			if($scope.mapParkingStructureMarkers.length > 0){
				$scope.mapParkingStructureMarkers.push(object);
			} else if($scope.occupancyParkingStructureMarkers.length > 0){
				$scope.occupancyParkingStructureMarkers.push(object);
			} else if($scope.profitParkingStructureMarkers.length){
				$scope.profitParkingStructureMarkers.push(object);
			} else if($scope.timeCostParkingStructureMarkers.length){
				$scope.timeCostParkingStructureMarkers.push(object);
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
	    	} else if($scope.occupancyStreets.length > 0){
	    		$scope.occupancyStreets.push(object);
	    	} else if($scope.profitStreets.length > 0){
	    		$scope.profitStreets.push(object);
	    	} else if($scope.timeCostStreets.length > 0){
	    		$scope.timeCostStreets.push(object);
	    	}
	    	$scope.mapStreetSelectedMarkers = [];
			break;
		case 4:
			var mapSelectedZ = $scope.getMapSelectedZones(z_index);
			var zoneOnMap = $scope.getMapZoneList(z_index);
		    var zoneoccupancyOnMap = $scope.getOccupancyZoneList(z_index);
		    var zoneprofitOnMap = $scope.getProfitZoneList(z_index);
		    var zonetimecostOnMap = $scope.getTimeCostZoneList(z_index);
		    var toDelZone = $scope.map.shapes;
		    var subele = object.subelements;
		    if(subele && subele.length > 0){	// case zone with subelements
		    	for(var i = 0; i < subele.length; i++){
					var s = subele[i];
					var sid = "mz" + s.id;
			    	toDelZone[sid].setMap(null);
			    	var polyline = s.geometry;
					var mzone = {
							id: sid,
							type: "polyline",
							path: gMapService.correctPoints(polyline.points),
							gpath: gMapService.correctPointsGoogle(polyline.points),
							stroke: {
							    color: object.stroke.color,
							    weight: 3,
							    opacity: 0.5
							},
							data: object.data,
							info_windows_pos: gMapService.correctPointGoogle(polyline.points[1]),
							info_windows_cod: "z" + object.id,
							editable: true,
							draggable: true,
							geodesic: false,
							visible: true,
							subelements: object.subelements
					};
			    	if($scope.theme == 0){
			    		zoneOnMap.push(mzone);
			    	} else if($scope.theme == 1){
			    		zoneoccupancyOnMap.push(mzone);
			    	} else if($scope.theme == 2){
			    		zoneprofitOnMap.push(mzone);
			    	} else if($scope.theme == 3){
			    		zonetimecostOnMap.push(mzone);
			    	}
				}
		    } else {	// zone standard
		    	toDelZone[object.id].setMap(null);
		    	object.stroke.weight = 3;
		    	object.stroke.opacity = 0.7;
				object.fill.opacity = 0.5;
		    	if(theme == 0){	
		    		zoneOnMap.push(object);	
		    	} else if(theme == 1){
		    		zoneoccupancyOnMap.push(object);
		    	} else if(theme == 2){
		    		zoneprofitOnMap.push(object);
		    	} else if(theme == 3){
		    		zonetimecostOnMap.push(object);
		    	}
		    }
			//$scope.mapSelectedZones = [];
		    mapSelectedZ = [];
	    	$scope.setMapSelectedZones(z_index, mapSelectedZ);
			$scope.setMapZoneList(z_index, zoneOnMap);
		    $scope.setOccupancyZoneList(z_index, zoneoccupancyOnMap);
		    $scope.setProfitZoneList(z_index, zoneprofitOnMap);
		    $scope.setTimeCostZoneList(z_index, zonetimecostOnMap);
			break;
		case 5:
			$scope.mapSelectedAreas = [];
			var toDelArea = $scope.map.shapes;
	    	toDelArea[object.id].setMap(null);
	    	object.stroke.weight = 3;
	    	object.stroke.opacity = 0.7;
	    	object.fill.opacity = 0.5;
	    	if(theme == 0){
	    		$scope.mapAreas.push(object);
	    	} else if(theme == 1){
	    		$scope.occupancyAreas.push(object);
	    	} else if(theme == 2){
	    		$scope.profitAreas.push(object);
	    	} else if(theme == 3){
	    		$scope.timeCostAreas.push(object);
	    	}
			break;
		case 6:
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

	$scope.showDetailsInList = function(object, type, z_index){
		switch(type){
			case 1:
				$scope.showPMDet();
				var pmObj = {
					data : object	
				};
				$scope.pmDetails = gMapService.initPMObject(pmObj, 0).data;
				break;
			case 2:
				$scope.showPSDet();
				$scope.psDetails = object;
				//gMapService.initPsOccupancyDiagram(object, 0);
				break;
			case 3:
			    $scope.showStreetDet();
			    var sObj = {
			    	data : object
			    };
			    $scope.sDetails = gMapService.initStreetObject(sObj, 0).data;
				gMapService.initStreetParkSupplyDiagram(object, 2);
				break;
			case 4:
			    $scope.showZoneDet(z_index);
				$scope.zDetails = object;
				gMapService.initZoneOccupancyDiagram(object, 2);
				break;
			case 5:
			    $scope.showAreaDet();
				$scope.aDetails = object;
				//gMapService.initAreaOccupancyDiagram(object, 2);
				break;	
			case 6:
			    //$scope.showMicroZoneDet();
				$scope.microZDetails = object;
				gMapService.initMicroZoneOccupancyDiagram(object, 2);
				break;	
		};
		$scope.detailsOpened = true;
		return object;
	};	
	
	$scope.showOccupancyInList = function(object, type, z_index){
		$scope.showReportComparation = false;
		$scope.showCreatedCmpReport = false;
		switch(type){
			case 1:
				$scope.showPMDet();
				var pmObj = {
					data : object	
				};
				$scope.pmDetails = gMapService.initPMObject(pmObj, 0).data;
				break;
			case 2:
				$scope.showPSDet();
				$scope.psDetails = object;
				gMapService.initPsOccupancyDiagram(object, 0);
				$scope.showReportCompare("1", "2", 2, 1);	// 2 = ps, 1 = occupancy
				break;
			case 3:
			    $scope.showStreetDet();
			    var sObj = {
				    data : object
				};
				object = gMapService.initStreetObject(sObj, 0).data;
				// Block to manage free slots and unusuabled slots
				var freeParkSlotDisp = (object.freeParkSlotNumber > 0) ? (object.freeParkSlotNumber - object.freeParkSlotOccupied) : 0;
		    	var freeParkSlotSignDisp = (object.freeParkSlotSignNumber > 0) ? (object.freeParkSlotSignNumber - object.freeParkSlotSignOccupied) : 0;
		    	var paidSlotDisp = (object.paidSlotNumber > 0 ) ? (object.paidSlotNumber - object.paidSlotOccupied) : 0;
		    	var timedParkSlotDisp = (object.timedParkSlotNumber > 0) ? (object.timedParkSlotNumber - object.timedParkSlotOccupied) : 0;
		    	var handicappedSlotDisp = (object.handicappedSlotNumber > 0) ? (object.handicappedSlotNumber - object.handicappedSlotOccupied) : 0;
		    	var reservedSlotDisp = (object.reservedSlotNumber > 0)? (object.reservedSlotNumber - object.reservedSlotOccupied) : 0;
		    	var unusuableSlot = object.unusuableSlotNumber;
		    	// block to manage free slots and unusualbed slots
		    	if(unusuableSlot > 0 && freeParkSlotDisp > 0){
		    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(freeParkSlotDisp,unusuableSlot);
		    		freeParkSlotDisp = tmpSlots[0];
		    		unusuableSlot = tmpSlots[1];
		    	}
		    	if(unusuableSlot > 0 && freeParkSlotSignDisp > 0){
		    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(freeParkSlotSignDisp,unusuableSlot);
		    		freeParkSlotSignDisp = tmpSlots[0];
		    		unusuableSlot = tmpSlots[1];
		    	}
		    	if(unusuableSlot > 0 && paidSlotDisp > 0){
		    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(paidSlotDisp,unusuableSlot);
		    		paidSlotDisp = tmpSlots[0];
		    		unusuableSlot = tmpSlots[1];
		    	}
		    	if(unusuableSlot > 0 && timedParkSlotDisp > 0){
		    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(timedParkSlotDisp,unusuableSlot);
		    		timedParkSlotDisp = tmpSlots[0];
		    		unusuableSlot = tmpSlots[1];
		    	}
		    	if(unusuableSlot > 0 && handicappedSlotDisp > 0){
		    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(handicappedSlotDisp,unusuableSlot);
		    		handicappedSlotDisp = tmpSlots[0];
		    		unusuableSlot = tmpSlots[1];
		    	}
		    	if(unusuableSlot > 0 && reservedSlotDisp > 0){
		    		var tmpSlots = $scope.calculateFreeAndUnusuableSlots(reservedSlotDisp,unusuableSlot);
		    		reservedSlotDisp = tmpSlots[0];
		    		unusuableSlot = tmpSlots[1];
		    	}
				object.freeParkSlotFree = freeParkSlotDisp;
				object.freeParkSlotSignFree = freeParkSlotSignDisp;
				object.paidSlotFree = paidSlotDisp;
				object.timedParkSlotFree = timedParkSlotDisp;
				object.handicappedSlotFree = handicappedSlotDisp;
				object.reservedSlotFree = reservedSlotDisp;
				
				$scope.sDetails = object;
				gMapService.initStreetOccupancyDiagram(object, 2);
			    // To show the historycal data
			    $scope.showReportCompare("1", "2", 3, 1);	// 3 = street, 1 = occupancy
				break;
			case 4:
			    $scope.showZoneDet(z_index);
				$scope.zDetails = object;
				gMapService.initZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 5, 1);	// 5 = zone, 1 = occupancy
				break;
			case 5:
			    $scope.showAreaDet();
				$scope.aDetails = object;
				gMapService.initAreaOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 4, 1);	// 4 = area, 1 = occupancy
				break;
			case 6:
			    //$scope.showMicroZoneDet();
				$scope.microZDetails = object;
				gMapService.initMicroZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 6, 1);	// 6 = microzone, 1 = occupancy
				break;	
		};
		$scope.occupancyOpened = true;
		return object;
	};
	
	$scope.calculateFreeAndUnusuableSlots = function(free, unusuable){
		free = free - unusuable;
		if(free < 0){
			unusuable = free * -1;		// I trasform the slots to positive;
			free = 0;
		} else {
			unusuable = 0;
		}
		return [free, unusuable];
	};
	
	$scope.showTimeCostInList = function(object, type, z_index){
		switch(type){
			case 1:
				$scope.showPMDet();
				$scope.pmDetails = object;
				var pmObj = {
					data : object	
				};
				$scope.pmDetails = gMapService.initPMObject(pmObj, 0).data;
				break;
			case 2:
				$scope.showPSDet();
				$scope.psDetails = object;
				gMapService.initPsOccupancyDiagram(object, 0);
				$scope.showReportCompare("1","2", 2, 3);	// 2 = ps, 3 = time cost
				break;
			case 3:
			    $scope.showStreetDet();
			    var sObj = {
					data : object
				};
			    $scope.sDetails = gMapService.initStreetObject(sObj, 0).data;
				gMapService.initStreetOccupancyDiagram(object, 2);
			    $scope.showReportCompare("1","2", 3, 3);	// 3 = street, 3 = time cost
				break;
			case 4:
			    $scope.showZoneDet(z_index);
				$scope.zDetails = object;
				gMapService.initZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1","2", 5, 3);	// 5 = zone, 3 = time cost
				break;
			case 5:
			    $scope.showAreaDet();
				$scope.aDetails = object;
				gMapService.initAreaOccupancyDiagram(object, 2);
				$scope.showReportCompare("1","2", 4, 3);	// 4 = area, 3 = time cost
				break;	
			case 6:
			    //$scope.showMicroZoneDet();
				$scope.microZDetails = object;
				gMapService.initMicroZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1","2", 6, 3);	// 6 = microzone, 3 = time cost
				break;	
		};
		$scope.timeCostOpened = true;
		return object;
	};	
	
	
	$scope.showProfitInList = function(object, type, z_index){
		switch(type){
			case 1:
				$scope.showPMDet();
				$scope.pmDetails = object;
				var pmObj = {
					data : object	
				};
				$scope.pmDetails = gMapService.initPMObject(pmObj,0).data;
				// To show the historycal data
			    $scope.showReportCompare("1", "2", 1, 2);	// 1 = parking meters, 2 = profit
				break;
			case 2:
				$scope.showPSDet();
				$scope.psDetails = object;
				//gMapService.initPsOccupancyDiagram(object, 0);
				$scope.showReportCompare("1", "2", 2, 2);	// 2 = parkingstructs, 2 = profit
				break;
			case 3:
			    $scope.showStreetDet();
			    var sObj = {
					data : object
				};
				$scope.sDetails = gMapService.initStreetObject(sObj, 0).data;
			    //gMapService.initStreetOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 3, 2);	// 3 = street, 2 = profit
				break;
			case 4:
			    $scope.showZoneDet(z_index);
				$scope.zDetails = object;
				//gMapService.initZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 5, 2);	// 5 = zone, 2 = profit
				break;
			case 5:
			    $scope.showAreaDet();
				$scope.aDetails = object;
				//gMapService.initAreaOccupancyDiagram(object);
				$scope.showReportCompare("1", "2", 4, 2);	// 4 = area, 2 = profit
				break;
			case 6:
			    $scope.showMicroZoneDet();
				$scope.microZDetails = object;
				//gMapService.initZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 6, 2);	// 6 = microzone, 2 = profit
				break;	
		};
		$scope.profitOpened = true;
		return object;
	};
	
	$scope.closeAllDetails = function(theme){
		$scope.detailsOpened = false;
		$scope.occupancyOpened = false;
		$scope.profitOpened = false;
		$scope.timeCostOpened = false;
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
		if($scope.mapSelectedZones0.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedZones0, 4, theme, 0);
		}
		if($scope.mapSelectedZones1.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedZones1, 4, theme, 1);
		}
		if($scope.mapSelectedZones2.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedZones2, 4, theme, 2);
		}
		if($scope.mapSelectedZones3.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedZones3, 4, theme, 3);
		}
		if($scope.mapSelectedZones4.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedZones4, 4, theme, 4);
		}
		if($scope.mapSelectedAreas.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedAreas, 5, theme);
		}
	};
	
	$scope.closeAllDetailsList = function(){
		$scope.detailsOpened = false;
		$scope.occupancyOpened = false;
		$scope.profitOpened = false;
		$scope.timeCostOpened = false;
	};
	
	// Method used to check if an element is already selected
	$scope.fixIfAlreadySelected = function(list, type, theme, z_index){
		switch(type){
		case 1:
			if(list.length > 0){
				var object = list[0];
				var company = "tm";
				/*var appId = sharedDataService.getConfAppId();
				if(appId == 'rv'){ 
					company = "amr";
				} else {
					company = "tm";
				}*/
				var baseUrl = "rest/nosec";
				var defaultMarkerColor = "FF0000";
				
				if(theme == 0){
					var myAreaPm = {};
					myAreaPm = sharedDataService.getLocalAreaById(object.data.areaId);
					object.icon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
					$scope.mapParkingMetersMarkers.push(object);
				} else if(theme == 1){
					$scope.occupancyParkingMeterMarkers.push(object);
				} else if(theme == 2){
					var color = $scope.plainColor(object.myprofitColor);
					object.icon = baseUrl+'/marker/'+company+'/parcometro/'+((color != null && color != "") ? color : defaultMarkerColor);
					$scope.profitParkingMetersMarkers.push(object);
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
				} else if(theme == 1){
					$scope.occupancyParkingStructureMarkers.push(object);
				} else if(theme == 2){
					$scope.profitParkingStructureMarkers.push(object);
				} else if(theme == 3){
					$scope.timeCostParkingStructureMarkers.push(object);
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
		    	} else if(theme == 3){
		    		$scope.timeCostStreets.push(object);
		    	}
			}
			$scope.mapSelectedStreets = [];
			break;
		case 4:
			var zoneOnMap = $scope.getMapZoneList(z_index);
	    	var zoneoccupancyOnMap = $scope.getOccupancyZoneList(z_index);
	    	var zoneprofitOnMap = $scope.getProfitZoneList(z_index);
	    	var zonetimecostOnMap = $scope.getTimeCostZoneList(z_index);
			if(list.length > 0){
				for(var i = 0; i < list.length; i++){
					var object = list[i];
					var toDelZone = $scope.map.shapes;
			    	toDelZone[object.id].setMap(null);
			    	object.stroke.weight = 3;
			    	if(object.fill){
			    		// case polygon
			    		object.stroke.opacity = 0.7;
			    		object.fill.opacity = 0.5;
			    	} else {
			    		// case polyline
			    		object.stroke.opacity = 0.5;
			    	}
			    	if(theme == 0){
			    		zoneOnMap.push(object);		//$scope.mapZones
			    	} else if(theme == 1){
			    		zoneoccupancyOnMap.push(object);	//$scope.occupancyZones
			    	} else if(theme == 2){
			    		zoneprofitOnMap.push(object);		//$scope.profitZones
			    	} else if(theme == 3){
			    		zonetimecostOnMap.push(object);		//$scope.timeCostZones
			    	}
				}
			}
			$scope.setMapSelectedZones(z_index, []);	//$scope.mapSelectedZones = [];
			$scope.setMapZoneList(z_index, zoneOnMap);
		    $scope.setOccupancyZoneList(z_index, zoneoccupancyOnMap);
		    $scope.setProfitZoneList(z_index, zoneprofitOnMap);
		    $scope.setTimeCostZoneList(z_index, zonetimecostOnMap);
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
		    	} else if(theme == 1){
		    		$scope.occupancyAreas.push(object);
		    	} else if(theme == 2){
		    		$scope.profitAreas.push(object);
		    	} else if(theme == 3){
		    		$scope.timeCostAreas.push(object);
		    	}
			}
			$scope.mapSelectedAreas = [];
			break;
		case 6:
			break;	
		}
	};
    
    // Method switchStreetMapObject: used to switch (in map) from street object to occupancy-street object
    $scope.switchStreetMapObject = function(type, showStreets){
    	switch(type){
    		case 1: // from occupancy/profit/timeCost to street
    			$scope.hideAllStreets(true);
    			if(showStreets)$scope.showStreetPolylines(1);
    			break;
    		case 2:	// from street/profit/timeCost to occupancy
    			$scope.hideAllStreets(true);
    			if(showStreets)$scope.showStreetPolylines(2);
    			break;	
    		case 3: // from street/occupancy/timeCost to profit
    			$scope.hideAllStreets(true);
    			if(showStreets)$scope.showStreetPolylines(3);
    			break;
    		case 4: // from street/occupancy/profit to timeCost
    			$scope.hideAllStreets(true);
    			if(showStreets)$scope.showStreetPolylines(4);
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
    $scope.switchZoneMapObject = function(type, z_index, showZones){
    	switch(type){
    		case 1: // from occupancy/profit/timeCost to availability
    			$scope.hideAllZones(z_index);
    			if(showZones)$scope.showZonePolygons(1, z_index);
    			break;
    		case 2: // from availability/profit/timeCost to occupancy
    			$scope.hideAllZones(z_index);
    			if(showZones)$scope.showZonePolygons(2, z_index);
    			break;	
    		case 3: // from availability/occupancy/timeCost to profit
    			$scope.hideAllZones(z_index);
    			if(showZones)$scope.showZonePolygons(3, z_index);
    			break;
    		case 4: // from availability/occupancy/profit to timeCost
    			$scope.hideAllZones(z_index);
    			if(showZones)$scope.showZonePolygons(4, z_index);
    			break;	
    		default:break;
    	}
    };
    
    // Method switchAreaMapObject: used to switch (in map) from area object to occupancy-area object
    $scope.switchAreaMapObject = function(type, showAreas){
    	switch(type){
    		case 1: // from occupancy/profit/timeCost to availability
    			$scope.hideAllAreas($scope.areaWS);
    			if(showAreas)$scope.showAreaPolygons(1);
    			break;
    		case 2: // from availability/profit/timeCost to occupancy
    			$scope.hideAllAreas($scope.areaWS);
    			if(showAreas)$scope.showAreaPolygons(2);
    			break;	
    		case 3: // from availability/occupancy/timeCost to profit
    			$scope.hideAllAreas($scope.areaWS);
    			if(showAreas)$scope.showAreaPolygons(3);
    			break;
    		case 4: // from availability/occupancy/profit to timeCost
    			$scope.hideAllAreas($scope.areaWS);
    			if(showAreas)$scope.showAreaPolygons(4);
    			break;
    		default:break;
    	}
    };
    
    // Method switchParkingMapObject: used to switch (in map) from parking object to occupancy-parking object
    $scope.switchParkingMapObject = function(type, showPSs){
    	switch(type){
    		case 1: // from occupancy/profit/timeCost to availability
    			$scope.hideParkingStructuresMarkers(2);
    			$scope.hideParkingStructuresMarkers(3);
    			$scope.hideParkingStructuresMarkers(4);
    			if(showPSs)$scope.showParkingStructuresMarkers(1);
    			break;
    		case 2: // from availability/profit/timeCost to occupancy
    			$scope.hideParkingStructuresMarkers(1);
    			$scope.hideParkingStructuresMarkers(3);
    			$scope.hideParkingStructuresMarkers(4);
    			if(showPSs)$scope.showParkingStructuresMarkers(2);
    			break;
    		case 3: // from availability/occupancy/timeCost to profit
    			$scope.hideParkingStructuresMarkers(1);
    			$scope.hideParkingStructuresMarkers(2);
    			$scope.hideParkingStructuresMarkers(4);
    			if(showPSs)$scope.showParkingStructuresMarkers(3);
    			break;
    		case 4: // from availability/occupancy/profit to timeCost 
    			$scope.hideParkingStructuresMarkers(1);
    			$scope.hideParkingStructuresMarkers(2);
    			$scope.hideParkingStructuresMarkers(3);
    			if(showPSs)$scope.showParkingStructuresMarkers(4);
    			break;
    		default:
    			break;
    	}
    };
    
    // Method switchPMMapObject: used to switch (in map) from pm object to profit-pm object
    $scope.switchPMMapObject = function(type, showPMs){
		var myAreaPm = "";
		var myIcon = "";
    	if($scope.mapParkingMetersSelectedMarkers != null && $scope.mapParkingMetersSelectedMarkers.length > 0){
    		$scope.closeAllDetailsList();	// Close all details window
			$scope.mapParkingMetersSelectedMarkers = [];
		}
    	switch(type){
    		case 1: // from occupancy/profit to availability
    			if(showPMs)$scope.showParkingMetersMarkers();
    			$scope.profitParkingMetersMarkers = [];
    			break;
    		case 2: // from availability/occupancy to profit
    			if(showPMs)$scope.showProfitPMMarkers();
    			$scope.mapParkingMetersMarkers = [];
    			break;	
    		default:
    			break;
    	}
    };
    
    // ---------------------------------------------- Start block Utilization diagrams --------------------------------------
    $scope.chartPsOccupancy = gMapService.getChartPsOccupancy($scope.ita_lang);
    $scope.chartPsOccupancy_eng = gMapService.getChartPsOccupancy($scope.eng_lang);
    $scope.chartStreetParkAvailability = gMapService.getChartStreetParkAvailability($scope.ita_lang);
    $scope.chartStreetParkAvailability_eng = gMapService.getChartStreetParkAvailability($scope.eng_lang);
    $scope.chartStreetOccupancy = gMapService.getChartStreetOccupancy($scope.ita_lang);
    $scope.chartStreetOccupancy_eng = gMapService.getChartStreetOccupancy($scope.eng_lang);
    $scope.chartStreetFreeParkAvailability = gMapService.getChartStreetFreeParkAvailability($scope.ita_lang);
    $scope.chartStreetFreeParkAvailability_eng = gMapService.getChartStreetFreeParkAvailability($scope.eng_lang);
    $scope.chartStreetOccupiedParkComposition = gMapService.getChartStreetOccupiedParkComposition($scope.ita_lang);
    $scope.chartStreetOccupiedParkComposition_eng = gMapService.getChartStreetOccupiedParkComposition($scope.eng_lang);
    $scope.chartZoneOccupancy = gMapService.getChartZoneOccupancy($scope.ita_lang);
    $scope.chartZoneOccupancy_eng = gMapService.getChartZoneOccupancy($scope.eng_lang);
    $scope.chartMicroZoneOccupancy = gMapService.getChartMicroZoneOccupancy($scope.ita_lang);
    $scope.chartMicroZoneOccupancy_eng = gMapService.getChartMicroZoneOccupancy($scope.eng_lang);
    $scope.chartAreaOccupancy = gMapService.getChartAreaOccupancy($scope.ita_lang);
    $scope.chartAreaOccupancy_eng = gMapService.getChartAreaOccupancy($scope.eng_lang);
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
    		case 2:
    			$scope.showInfo_2 = true;
    			break;
    		case 3:
    			$scope.showInfo_3 = true;
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
    		case 2:
    			$scope.showInfo_2 = false;
    			break;
    		case 3:
    			$scope.showInfo_3 = false;
    			break;	
    		default:
				break;
    	}	
    };
   
    // ------------------------------------------ End of block for info panels -------------------------------------------
    $scope.streetSupplyCvsFile = "";
    $scope.pmSupplyCvsFile = "";
    $scope.zoneSupplyCvsFile = "";
    $scope.areaSupplyCvsFile = "";
    $scope.structSupplyCvsFile = "";
    
    $scope.streetCvsFile = "";
    $scope.streetCvsFileName = "";
    $scope.zoneCvsFile = "";
    $scope.zoneCvsFileName = "";
    $scope.areaCvsFile = "";
    $scope.areaCvsFileName = "";
    $scope.structCvsFile = "";
    $scope.structCvsFileName = "";
    
    $scope.streetProfitCvsFile = "";
    $scope.pmProfitCvsFile = "";
    $scope.zoneProfitCvsFile = "";
    $scope.areaProfitCvsFile = "";
    $scope.structProfitCvsFile = "";
    
    $scope.streetTimeCostCvsFile = "";
    $scope.zoneTimeCostCvsFile = "";
    $scope.areaTimeCostCvsFile = "";
    $scope.structTimeCostCvsFile = "";
    
    // -------------------------------------------------- Block for supply CSV creation ---------------------------------------------
	$scope.getStreetSupplyCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.streetWS);
		var value = utilsService.correctStreetObjectForWS($scope.streetWS);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/street/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetSupplyCvsFile = result;
	    	window.location.href = $scope.streetSupplyCvsFile;
	    });	
	};
	
	$scope.getPMSupplyCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.parkingMeterWS);
		var value = utilsService.correctPMObjectForWS($scope.parkingMeterWS);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/parkingmeter/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.pmSupplyCvsFile = result;
	    	window.location.href = $scope.pmSupplyCvsFile;
	    });	
	};
	
	$scope.getZoneSupplyCsv = function(z_index){
		var method = 'POST';
		var value = "";
		switch(z_index){
			case 0:
				//value = JSON.stringify($scope.zoneWS0);
				value = utilsService.correctZoneObjectForWS($scope.zoneWS0);
				break;
			case 1:
				//value = JSON.stringify($scope.zoneWS1);
				value = utilsService.correctZoneObjectForWS($scope.zoneWS1);
				break;
			case 2:
				//value = JSON.stringify($scope.zoneWS2);
				value = utilsService.correctZoneObjectForWS($scope.zoneWS2);
				break;
			case 3:
				//value = JSON.stringify($scope.zoneWS3);
				value = utilsService.correctZoneObjectForWS($scope.zoneWS3);
				break;
			case 4:
				//value = JSON.stringify($scope.zoneWS4);
				value = utilsService.correctZoneObjectForWS($scope.zoneWS4);
				break;
		}
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/zone/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneSupplyCvsFile = result;
	    	window.location.href = $scope.zoneSupplyCvsFile;
	    });	
	};
	
	// Method getAreaSupplyCsv: used to crate a report csv file from the areaWS list (supply data)
	$scope.getAreaSupplyCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.areaWS);
		var value = utilsService.correctAreaObjectForWS($scope.areaWS);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/area/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaSupplyCvsFile = result;
	    	window.location.href = $scope.areaSupplyCvsFile;
	    });	
	};
	
	$scope.getStructureSupplyCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.pstructWS);
		var value = utilsService.correctStructObjectForWS($scope.pstructWS);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/parkingstructures/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.structSupplyCvsFile = result;
	    	window.location.href = $scope.structSupplyCvsFile;
	    });	
	};
	// ---------------------------------------------- End of block for supply CSV creation ------------------------------------------
    
    // ------------------------------------------- Block for occupancy CSV creation --------------------------------------
    $scope.getStreetOccupancyCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.streetWS);
		var value = utilsService.correctOccStreetObjectForWS($scope.streetWS);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/street/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetCvsFile = result;
	    	window.location.href = $scope.streetCvsFile;
	    });	
	};
	
	$scope.getZoneOccupancyCsv = function(z_index){
		var method = 'POST';
		var value = "";
		switch(z_index){
			case 0:
				//value = JSON.stringify($scope.zoneWS0);
				value = utilsService.correctOccZoneObjectForWS($scope.zoneWS0);
				break;
			case 1:
				//value = JSON.stringify($scope.zoneWS1);
				value = utilsService.correctOccZoneObjectForWS($scope.zoneWS1);
				break;
			case 2:
				//value = JSON.stringify($scope.zoneWS2);
				value = utilsService.correctOccZoneObjectForWS($scope.zoneWS2);
				break;
			case 3:
				//value = JSON.stringify($scope.zoneWS3);
				value = utilsService.correctOccZoneObjectForWS($scope.zoneWS3);
				break;
			case 4:
				//value = JSON.stringify($scope.zoneWS4);
				value = utilsService.correctOccZoneObjectForWS($scope.zoneWS4);
				break;
		}
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/zone/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneCvsFile = result;
	    	window.location.href = $scope.zoneCvsFile;
	    });	
	};
	
	// Method getAreaOccupancyCsv: used to crate a report csv file from the areaWS list (occupancy data)
	$scope.getAreaOccupancyCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.areaWS);
		var value = utilsService.correctAreaOccObjectForWS($scope.areaWS);
		
	    console.log("Area list data : " + value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/area/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaCvsFile = result;
	    	window.location.href = $scope.areaCvsFile;
	    });	
	};
	
	$scope.getStructureOccupancyCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.pstructWS);
		var value = utilsService.correctOccStructObjectForWS($scope.pstructWS);
	    console.log("Structure list data : " + value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/parkingstructures/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.structCvsFile = result;
	    	window.location.href = $scope.structCvsFile;
	    });	
	};
	// --------------------------------------------- End of block for occupancy CSV creation ----------------------------------------
	
	// -------------------------------------------------- Block for profit CSV creation ---------------------------------------------
	$scope.getStreetProfitCsv = function(){
		var method = 'POST';
		var value = utilsService.correctProfitStreetObjectForWS($scope.profitStreetsList);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/street/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetProfitCvsFile = result;
	    	window.location.href = $scope.streetProfitCvsFile;
	    });	
	};
	
	$scope.getPMProfitCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.parkingMeterWS);
		var value = utilsService.correctProfitPMObjectForWS($scope.parkingMeterWS);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/parkingmeter/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.pmProfitCvsFile = result;
	    	window.location.href = $scope.pmProfitCvsFile;
	    });	
	};
	
	$scope.getZoneProfitCsv = function(z_index){
		var method = 'POST';
		var value = "";
		switch(z_index){
			case 0:
				value = utilsService.correctProfitZoneObjectForWS($scope.profitZonesList0);
				break;
			case 1:
				value = utilsService.correctProfitZoneObjectForWS($scope.profitZonesList1);
				break;
			case 2:
				value = utilsService.correctProfitZoneObjectForWS($scope.profitZonesList2);
				break;
			case 3:
				value = utilsService.correctProfitZoneObjectForWS($scope.profitZonesList3);
				break;
			case 4:
				value = utilsService.correctProfitZoneObjectForWS($scope.profitZonesList4);
				break;
		}
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/zone/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneProfitCvsFile = result;
	    	window.location.href = $scope.zoneProfitCvsFile;
	    });	
	};
	
	// Method getAreaProfitCsv: used to get the csv file of the report of area profit
	$scope.getAreaProfitCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.profitAreaList);
		var value = utilsService.correctAreaProfitObjectForWS($scope.profitAreaList);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/area/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaProfitCvsFile = result;
	    	window.location.href = $scope.areaProfitCvsFile;
	    });	
	};
	
	$scope.getStructureProfitCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.profitStructWS);
		var value = utilsService.correctStructProfitObjectForWS($scope.profitStructWS);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/parkingstructures/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.structProfitCvsFile = result;
	    	window.location.href = $scope.structProfitCvsFile;
	    });	
	};
	// ---------------------------------------------- End of block for profit CSV creation ------------------------------------------
	
	// ------------------------------------------------ Block for time cost CSV creation ---------------------------------------------
	$scope.getStreetTimeCostCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.streetWS);
		var value = utilsService.correctTimeCostStreetObjectForWS($scope.streetWS);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/street/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetTimeCostCvsFile = result;
	    	window.location.href = $scope.streetTimeCostCvsFile;
	    });	
	};
	
	$scope.getZoneTimeCostCsv = function(z_index){
		var method = 'POST';
		var value = "";
		switch(z_index){
			case 0:
				//value = JSON.stringify($scope.zoneWS0);
				value = utilsService.correctTimeCostZoneObjectForWS($scope.zoneWS0);
				break;
			case 1:
				//value = JSON.stringify($scope.zoneWS1);
				value = utilsService.correctTimeCostZoneObjectForWS($scope.zoneWS1);
				break;
			case 2:
				//value = JSON.stringify($scope.zoneWS2);
				value = utilsService.correctTimeCostZoneObjectForWS($scope.zoneWS2);
				break;
			case 3:
				//value = JSON.stringify($scope.zoneWS3);
				value = utilsService.correctTimeCostZoneObjectForWS($scope.zoneWS3);
				break;
			case 4:
				//value = JSON.stringify($scope.zoneWS4);
				value = utilsService.correctTimeCostZoneObjectForWS($scope.zoneWS4);
				break;
		}
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/zone/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneTimeCostCvsFile = result;
	    	window.location.href = $scope.zoneTimeCostCvsFile;
	    });	
	};
	
	// Method getAreaTimeCostCsv: used to get the csv file of the report of area time cost
	$scope.getAreaTimeCostCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.areaWS);
		var value = utilsService.correctAreaTimeCostObjectForWS($scope.areaWS);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/area/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaTimeCostCvsFile = result;
	    	window.location.href = $scope.areaTimeCostCvsFile;
	    });	
	};
	
	$scope.getStructureTimeCostCsv = function(){
		var method = 'POST';
		//var value = JSON.stringify($scope.allDataStructWS);
		var value = utilsService.correctStructTimeCostObjectForWS($scope.allDataStructWS);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/parkingstructures/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.structTimeCostCvsFile = result;
	    	window.location.href = $scope.structTimeCostCvsFile;
	    });	
	};
	// -------------------------------------------- End of block for time cost CSV creation -----------------------------------------
    
	// --------------------------------------------- New block for report compare creation ------------------------------------------
	
	//$scope.showReportComparation = false;
	//$scope.showCreatedCmpReport = false;
	$scope.verticalCompData = "1";
	$scope.orizontalCompData = "2";
	$scope.lockOrizontalValSelect = true;
	$scope.isCompInit = true;
	$scope.matrixOcc = [];
	$scope.matrixZoneOcc = [];
	//$scope.matrixMicroZoneOcc = [];
	$scope.matrixAreaOcc = [];
	$scope.matrixProf = [];
	$scope.matrixTick = [];
	$scope.matrixPAll = [];
	$scope.matrixStreetProf = [];
	$scope.matrixStreetTick = [];
	$scope.matrixPStreetAll = [];
	$scope.matrixZoneProf = [];
	$scope.matrixZoneTick = [];
	$scope.matrixPZoneAll = [];
	$scope.matrixMicroZoneProf = [];
	$scope.matrixMicroZoneTick = [];
	$scope.matrixPMicroZoneAll = [];
	$scope.matrixAreaProf = [];
	$scope.matrixAreaTick = [];
	$scope.matrixPAreaAll = [];
	$scope.matrixTimeCost = [];
	$scope.matrixZoneTimeCost = [];
	$scope.matrixMicroZoneTimeCost = [];
	$scope.matrixAreaTimeCost = [];
	
	// list for vertical and orizontal value;
	$scope.allCmpVal = [
	    {cod:"1", val:"Anni", eng_val: "Years"},
	    {cod:"2", val:"Mesi", eng_val: "Months"},
	    {cod:"3", val:"Giorni settimana", eng_val: "Days of Week"},
	    {cod:"4", val:"Ore", eng_val: "Hours"}
	];
	
	$scope.filteredOCmpVal = [
	    {cod:"2", val:"Mesi", eng_val: "Months"},
		{cod:"3", val:"Giorni settimana", eng_val: "Days of Week"},
		{cod:"4", val:"Ore", eng_val: "Hours"}                     
	];
	
	$scope.filteredVCmpVal = [
	    {cod:"1", val:"Anni", eng_val: "Years"},
		{cod:"3", val:"Giorni settimana", eng_val: "Days of Week"},
		{cod:"4", val:"Ore", eng_val: "Hours"}                     
	];
	
	$scope.updateOrizzSelect = function(verticalVal){
		angular.copy($scope.allCmpVal, $scope.filteredOCmpVal);
		for(var i = 0; i < $scope.allCmpVal.length; i++){
			if(verticalVal == $scope.allCmpVal[i].cod){
				$scope.filteredOCmpVal.splice(i, 1);
			}
		}
	};
	
	$scope.updateVerticalSelect = function(orizontalVal){
		angular.copy($scope.allCmpVal, $scope.filteredVCmpVal);
		for(var i = 0; i < $scope.allCmpVal.length; i++){
			if(orizontalVal == $scope.allCmpVal[i].cod){
				$scope.filteredVCmpVal.splice(i, 1);
			}
		}
	};
	
	$scope.createReportCompare = function(){
		//$scope.showReportComparation = true;
		//$scope.showCreatedCmpReport = false;
		$scope.lockOrizontalValSelect = true;
		$scope.isCompInit = true;
	};
	
	$scope.updateReportCompare = function(form, verticalVal, orizontalVal, object, type){
		//$scope.showReportComparation = false;
		//$scope.showCreatedCmpReport = true;
		if(form.$invalid){
			$scope.isCompInit = false;
		} else {
			//--------------- Shared filter params ----------------
			var year = sharedDataService.getFilterYear();
			var month = sharedDataService.getFilterMonth();
			var dowType = sharedDataService.getFilterDowType();
			var dowVal = sharedDataService.getFilterDowVal();
			var hour = sharedDataService.getFilterHour();
			var visVal = sharedDataService.getFilterVis();
			var valueType = 2;
			if(visVal == "vis_last_value"){
				valueType = 1;
			}
			//-----------------------------------------------------
		
			switch(object){
				case 1: 
					// pm
					if(type == 1){
						// occupation data (in pm no)
					} else if(type == 2){
						// profit data
						$scope.getHistorycalProfitPmFromDb($scope.pmDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 3){
						// time cost data (in pm no)
					}
					break;
				case 2: 
					// ps
					if(type == 1){
						// occupation data
						$scope.getHistorycalOccupancyParkingFromDb($scope.psDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 2){
						// profit data
						$scope.getHistorycalProfitPsFromDb($scope.psDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 3){
						// time cost data
						$scope.getHistorycalTimeCostParkingFromDb($scope.psDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					}
					break;
				case 3: 
					// street
					if(type == 1){
						// occupation data
						// Here I have to create the historycal data
						$scope.getHistorycalOccupancyStreetFromDb($scope.sDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 2){
						// profit data
						$scope.getHistorycalProfitStreetFromDb($scope.sDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 3){
						// time cost data
						$scope.getHistorycalTimeCostStreetFromDb($scope.sDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					}
					break;
				case 4: 
					// area
					if(type == 1){
						// occupation data
						$scope.getHistorycalOccupancyAreaFromDb($scope.aDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 2){
						// profit data
						$scope.getHistorycalProfitAreaFromDb($scope.aDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 3){
						// time cost data
						$scope.getHistorycalTimeCostAreaFromDb($scope.aDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					}
					break;
				case 5: 
					// zone
					if(type == 1){
						// occupation data
						$scope.getHistorycalOccupancyZoneFromDb($scope.zDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 2){
						// profit data
						$scope.getHistorycalProfitZoneFromDb($scope.zDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 3){
						// time cost data
						$scope.getHistorycalTimeCostZoneFromDb($scope.zDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					}
					break;
				case 6: 
					// microzone
					if(type == 1){
						// occupation data
						$scope.getHistorycalOccupancyMicroZoneFromDb($scope.microZDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 2){
						// profit data
						$scope.getHistorycalProfitMicroZoneFromDb($scope.microZDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					} else if(type == 3){
						// time cost data
						$scope.getHistorycalTimeCostMicroZoneFromDb($scope.microZDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
					}
					break;	
			}
		
		}
	};
	
	$scope.showReportCompare = function(verticalVal, orizontalVal, object, type){
		//--------------- Shared filter params ----------------
		var year = sharedDataService.getFilterYear();
		var month = sharedDataService.getFilterMonth();
		var dowType = sharedDataService.getFilterDowType();
		var dowVal = sharedDataService.getFilterDowVal();
		var hour = sharedDataService.getFilterHour();
		var visVal = sharedDataService.getFilterVis();
		var valueType = 2;
		if(visVal == "vis_last_value"){
			valueType = 1;
		}
		//-----------------------------------------------------
		
		switch(object){
		case 1: 
			// pm
			if(type == 1){
				// occupation data (in pm no)
			} else if(type == 2){
				// profit data
				$scope.getHistorycalProfitPmFromDb($scope.pmDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 3){
				// time cost data (in pm no)
			}
			break;
		case 2: 
			// ps
			if(type == 1){
				// occupation data
				$scope.getHistorycalOccupancyParkingFromDb($scope.psDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 2){
				// profit data
				$scope.getHistorycalProfitPsFromDb($scope.psDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 3){
				// time cost data
				$scope.getHistorycalTimeCostParkingFromDb($scope.psDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			}
			break;
		case 3: 
			// street
			if(type == 1){
				// occupation data
				$scope.getHistorycalOccupancyStreetFromDb($scope.sDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 2){
				// profit data
				$scope.getHistorycalProfitStreetFromDb($scope.sDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 3){
				// time cost data
				$scope.getHistorycalTimeCostStreetFromDb($scope.sDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			}
			break;
		case 4: 
			// area
			if(type == 1){
				// occupation data
				$scope.getHistorycalOccupancyAreaFromDb($scope.aDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 2){
				// profit data
				$scope.getHistorycalProfitAreaFromDb($scope.aDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 3){
				// time cost data
				$scope.getHistorycalTimeCostAreaFromDb($scope.aDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			}
			break;
		case 5: 
			// zone
			if(type == 1){
				// occupation data
				$scope.getHistorycalOccupancyZoneFromDb($scope.zDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 2){
				// profit data
				$scope.getHistorycalProfitZoneFromDb($scope.zDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 3){
				// time cost data
				$scope.getHistorycalTimeCostZoneFromDb($scope.zDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			}
			break;
		case 6: 
			// microzone
			if(type == 1){
				// occupation data
				$scope.getHistorycalOccupancyMicroZoneFromDb($scope.microZDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 2){
				// profit data
				$scope.getHistorycalProfitMicroZoneFromDb($scope.microZDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			} else if(type == 3){
				// time cost data
				$scope.getHistorycalTimeCostMicroZoneFromDb($scope.microZDetails.id, verticalVal, orizontalVal, year, month, dowVal, dowType, hour, valueType);
			}
			break;	
		}
		
	};
	
	// ---------------------------------------------------------- WS call --------------------------------------------------------

	// Method getHistorycalOccupancyStreetsFromDb: used to retrieve the historycal streets occupancy data from the db
	$scope.getHistorycalOccupancyAreaFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/areacompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixAreaOcc);
		    if($scope.showLogs)console.log("area occupancy history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Zone historycal occupancy csv data
	$scope.getOccupancyAreaHistoryCsv = function(dArea){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
				darea_name: dArea.name,
				darea_fee: (dArea.validityPeriod) ? utilsService.correctRatePeriodsForWSAsString(dArea.validityPeriod) : null,
				darea_totalslot: dArea.slotNumber
		};
		var value = JSON.stringify($scope.matrixAreaOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/areahistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneOccCvsHistorycalFile = result;
	    	window.location.href = $scope.zoneOccCvsHistorycalFile;
	    });	
	};	
	
	// Method getHistorycalOccupancyZoneFromDb: used to retrieve the historycal zones occupancy data from the db
	$scope.getHistorycalOccupancyZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/zonecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixZoneOcc);
		    if($scope.showLogs)console.log("zone occupancy history retrieved from db: " + JSON.stringify(result));
		});
	};	
	
	// Zone historycal occupancy csv data
	$scope.getOccupancyZoneHistoryCsv = function(dZone){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
				dzone_name: dZone.name,
				dzone_sub: dZone.submacro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify($scope.matrixZoneOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/zonehistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneOccCvsHistorycalFile = result;
	    	window.location.href = $scope.zoneOccCvsHistorycalFile;
	    });	
	};
	
	// Method getHistorycalOccupancyMicroZoneFromDb: used to retrieve the historycal microzone occupancy data from the db
	$scope.getHistorycalOccupancyMicroZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/zonecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixMicroZoneOcc);
		    if($scope.showLogs)console.log("microzone occupancy history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Zone historycal occupancy csv data
	$scope.getOccupancyMicroZoneHistoryCsv = function(dZone){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
				dzone_name: dZone.name,
				dzone_submacro: dZone.submacro,
				dzone_submicro: dZone.submicro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify($scope.matrixMicroZoneOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/zonehistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneOccCvsHistorycalFile = result;
	    	window.location.href = $scope.zoneOccCvsHistorycalFile;
	    });	
	};	
	
	// Method getHistorycalOccupancyStreetFromDb: used to retrieve the historycal streets occupancy data from the db
	$scope.getHistorycalOccupancyStreetFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		$scope.streetMapReady = false;
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/streetcompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixOcc);
		    if($scope.showLogs)console.log("street occupancy history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Street historycal occupancy csv data
	$scope.getOccupancyStreetHistoryCsv = function(dStreet){
		var method = 'POST';
		var params = {
				dstreet_name: dStreet.streetReference,
				dstreet_area: dStreet.area_name,
				dstreet_totalslot: dStreet.slotNumber
		};
		var value = JSON.stringify($scope.matrixOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/streethistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetOccCvsHistorycalFile = result;
	    	window.location.href = $scope.streetOccCvsHistorycalFile;
	    });	
	};
	
	// Method getHistorycalOccupancyParkingFromDb: used to retrieve the historycal parking occupancy data from the db
	$scope.getHistorycalOccupancyParkingFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		$scope.streetMapReady = false;
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructurecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixOcc);
		    if($scope.showLogs)console.log("parking occupancy history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Parking historycal occupancy csv data
	$scope.getOccupancyParkingHistoryCsv = function(dParking){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
			dparking_name: dParking.name,
			dparking_streetreference: dParking.streetReference,
			dparking_totalslot: dParking.slotNumber
		};
		var value = JSON.stringify($scope.matrixOcc);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupation/parkingstructureshistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.parkingOccCvsHistorycalFile = result;
	    	window.location.href = $scope.parkingOccCvsHistorycalFile;
	    });	
	};	

	// Method getHistorycalProfitAreaFromDb: used to retrieve the historycal area profit data from the db
	$scope.getHistorycalProfitAreaFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		$scope.loadingMatrix = true;
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/areacompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, $scope.matrixPAreaAll);
			angular.copy(result, $scope.matrixAreaProf);
			angular.copy(result, $scope.matrixAreaTick);
			for(var i = 1; i < result.length; i++){
				for(var j = 1; j < result[i].length; j++){
					var res = result[i][j].split("/");
					if(res[0] != "-1.0"){
						var prof = Number(res[0]) / 100;
						$scope.matrixAreaProf[i][j] = prof.toFixed(2);	// profit matrix
					} else {
						$scope.matrixAreaProf[i][j] = res[0];
					}
					if(res[1] != "-1.0"){
						var tick = Number(res[1]);
						$scope.matrixAreaTick[i][j] = tick.toFixed(0);	// ticket matrix
					} else {
						$scope.matrixAreaTick[i][j] = res[1];
					}
				}
			}
			$scope.loadingMatrix = false;
			if($scope.showLogs)console.log("area profit history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Area historycal profit csv data
	$scope.getProfitAreaHistoryCsv = function(dArea){
		var method = 'POST';
		var params = {
				darea_name: dArea.name,
				darea_fee: (dArea.validityPeriod) ? utilsService.correctRatePeriodsForWSAsString(dArea.validityPeriod) : null,
				darea_totalslot: dArea.slotNumber
		};
		var value = JSON.stringify($scope.matrixPAreaAll);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/areahistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneProfCvsHistorycalFile = result;
	    	window.location.href = $scope.zoneProfCvsHistorycalFile;
	    });	
	};	
	
	// Method getHistorycalProfitZoneFromDb: used to retrieve the historycal zone profit data from the db
	$scope.getHistorycalProfitZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/zonecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			var profDataPresent = false;
			if(result != null && result != ""){
				profDataPresent = true;
				angular.copy(result, $scope.matrixPZoneAll);
				angular.copy(result, $scope.matrixZoneProf);
				angular.copy(result, $scope.matrixZoneTick);
				for(var i = 1; i < result.length; i++){
					for(var j = 1; j < result[i].length; j++){
						var res = result[i][j].split("/");
						if(res[0] != "-1.0"){
							var prof = Number(res[0]) / 100;
							$scope.matrixZoneProf[i][j] = prof.toFixed(2);	// profit matrix
						} else {
							$scope.matrixZoneProf[i][j] = res[0];
						}
						if(res[1] != "-1.0"){
							var tick = Number(res[1]);
							$scope.matrixZoneTick[i][j] = tick.toFixed(0);	// ticket matrix
						} else {
							$scope.matrixZoneTick[i][j] = res[1];
						}
					}
				}
			} else {
				profDataPresent = false;
			}
			$scope.showZoneProfMatrix = profDataPresent;
			if($scope.showLogs)console.log("zone profit history retrieved from db: " + JSON.stringify(result));
		});
	};	
	
	// Zone historycal profit csv data
	$scope.getProfitZoneHistoryCsv = function(dZone){
		var method = 'POST';
		var params = {
				dzone_name: dZone.name,
				dzone_sub: dZone.submacro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify($scope.matrixPZoneAll);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/zonehistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneProfCvsHistorycalFile = result;
	    	window.location.href = $scope.zoneProfCvsHistorycalFile;
	    });	
	};
	
	// Method getHistorycalProfitZoneFromDb: used to retrieve the historycal zone profit data from the db
	$scope.getHistorycalProfitMicroZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/zonecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			var profDataPresent = false;
			if(result != null && result != ""){
				profDataPresent = true;
				angular.copy(result, $scope.matrixPMicroZoneAll);
				angular.copy(result, $scope.matrixMicroZoneProf);
				angular.copy(result, $scope.matrixMicroZoneTick);
				for(var i = 1; i < result.length; i++){
					for(var j = 1; j < result[i].length; j++){
						var res = result[i][j].split("/");
						if(res[0] != "-1.0"){
							var prof = Number(res[0]) / 100;
							$scope.matrixMicroZoneProf[i][j] = prof.toFixed(2);	// profit matrix
						} else {
							$scope.matrixMicroZoneProf[i][j] = res[0];
						}
						if(res[1] != "-1.0"){
							var tick = Number(res[1]);
							$scope.matrixMicroZoneTick[i][j] = tick.toFixed(0);	// ticket matrix
						} else {
							$scope.matrixMicroZoneTick[i][j] = res[1];
						}
					}
				}
			} else {
				profDataPresent = false;
			}
			$scope.showMicroZProfMatrix = profDataPresent;
			if($scope.showLogs)console.log("microzone profit history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Zone historycal profit csv data
	$scope.getProfitMicroZoneHistoryCsv = function(dZone){
		var method = 'POST';
		var params = {
				dzone_name: dZone.name,
				dzone_submacro: dZone.submacro,
				dzone_submicro: dZone.submicro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify($scope.matrixPMicroZoneAll);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/zonehistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneProfCvsHistorycalFile = result;
	    	window.location.href = $scope.zoneProfCvsHistorycalFile;
	    });	
	};	
	
	// Method getHistorycalProfitStreetFromDb: used to retrieve the historycal street profit data from the db
	$scope.getHistorycalProfitStreetFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/streetcompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, $scope.matrixPStreetAll);
			angular.copy(result, $scope.matrixStreetProf);
			angular.copy(result, $scope.matrixStreetTick);
			for(var i = 1; i < result.length; i++){
				for(var j = 1; j < result[i].length; j++){
					var res = result[i][j].split("/");
					if(res[0] != "-1.0"){
						var prof = Number(res[0]) / 100;
						$scope.matrixStreetProf[i][j] = prof.toFixed(2);	// profit matrix
					} else {
						$scope.matrixStreetProf[i][j] = res[0];
					}
					if(res[1] != "-1.0"){
						var tick = Number(res[1]);
						$scope.matrixStreetTick[i][j] = tick.toFixed(0);	// ticket matrix
					} else {
						$scope.matrixStreetTick[i][j] = res[1];
					}
				}
			}
			if($scope.showLogs)console.log("street profit history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Street historycal profit csv data
	$scope.getProfitStreetHistoryCsv = function(dStreet){
		var method = 'POST';
		var params = {
				dstreet_name: dStreet.streetReference,
				dstreet_area: dStreet.area_name,
				dstreet_totalslot: dStreet.slotNumber
		};
		var value = JSON.stringify($scope.matrixPStreetAll);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/streethistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetProfCvsHistorycalFile = result;
	    	window.location.href = $scope.streetProfCvsHistorycalFile;
	    });	
	};		
	
	// Method getHistorycalProfitPmFromDb: used to retrieve the historycal parking profit data from the db
	$scope.getHistorycalProfitPmFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		$scope.streetMapReady = false;
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/parkingmetercompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, $scope.matrixPAll);
			angular.copy(result, $scope.matrixProf);
			angular.copy(result, $scope.matrixTick);
			for(var i = 1; i < result.length; i++){
				for(var j = 1; j < result[i].length; j++){
					var res = result[i][j].split("/");
					if(res[0] != "-1.0"){
						var prof = Number(res[0]) / 100;
						$scope.matrixProf[i][j] = prof.toFixed(2);	// profit matrix
					} else {
						$scope.matrixProf[i][j] = res[0];
					}
					if(res[1] != "-1.0"){
						var tick = Number(res[1]);
						$scope.matrixTick[i][j] = tick.toFixed(0);	// ticket matrix
					} else {
						$scope.matrixTick[i][j] = res[1];
					}
				}
			}
			if($scope.showLogs)console.log("parking profit history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// ParkingMeter historycal profit csv data
	$scope.getProfitParkingHistoryCsv = function(dParking){
		var method = 'POST';
		var params = {
				dparking_code: dParking.code,
				dparking_note: dParking.note,
				dparking_area: dParking.area.name
		};
		var value = JSON.stringify($scope.matrixPAll);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/parkingmeterhistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.parkingProfCvsHistorycalFile = result;
	    	window.location.href = $scope.parkingProfCvsHistorycalFile;
	    });	
	};
	
	// Method getHistorycalProfitPsFromDb: used to retrieve the historycal parkStruct profit data from the db
	$scope.getHistorycalProfitPsFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		$scope.streetMapReady = false;
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/parkstructcompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, $scope.matrixPAll);
			angular.copy(result, $scope.matrixProf);
			angular.copy(result, $scope.matrixTick);
			for(var i = 1; i < result.length; i++){
				for(var j = 1; j < result[i].length; j++){
					var res = result[i][j].split("/");
					if(res[0] != "-1.0"){
						var prof = Number(res[0]) / 100;
						$scope.matrixProf[i][j] = prof.toFixed(2);	// profit matrix
					} else {
						$scope.matrixProf[i][j] = res[0];
					}
					if(res[1] != "-1.0"){
						var tick = Number(res[1]);
						$scope.matrixTick[i][j] = tick.toFixed(0);	// ticket matrix
					} else {
						$scope.matrixTick[i][j] = res[1];
					}
				}
			}
			if($scope.showLogs)console.log("parkstruct profit history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// ParkiStruct historycal time cost csv data
	$scope.getProfitParkStructHistoryCsv = function(dParkstruct){
		var method = 'POST';
		var params = {
			dparkstruct_name: dParkstruct.name,
			dparkstruct_streetreference: dParkstruct.streetReference,
			dparkstruct_totalslot: dParkstruct.slotNumber
		};
		var value = JSON.stringify($scope.matrixPAll);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/parkstructhistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.parkstructProfCvsHistorycalFile = result;
	    	window.location.href = $scope.parkstructProfCvsHistorycalFile;
	    });	
	};
	
	// Method getHistorycalTimeCostAreaFromDb: used to retrieve the historycal streets extratime cost data from the db
	$scope.getHistorycalTimeCostAreaFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/areacompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixAreaTimeCost);
		    for(var i = 1; i < result.length; i++){
		    	for(var j = 1; j < result[i].length; j++){
		    		$scope.matrixAreaTimeCost[i][j] = gMapService.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
			    }
		    }
		    if($scope.showLogs)console.log("area timecost history retrieved from db: " + JSON.stringify(result));
		});
	};	
	
	// Area historycal time cost csv data
	$scope.getTimeCostAreaHistoryCsv = function(dArea){
		var method = 'POST';
		var params = {
				darea_name: dArea.name,
				darea_fee: (dArea.validityPeriod) ? utilsService.correctRatePeriodsForWSAsString(dArea.validityPeriod) : null,
				darea_totalslot: dArea.slotNumber
		};
		var value = JSON.stringify($scope.matrixAreaTimeCost);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/areahistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaTimeCostCvsHistorycalFile = result;
	    	window.location.href = $scope.areaTimeCostCvsHistorycalFile;
	    });	
	};	
	
	// Method getHistorycalTimeCostZoneFromDb: used to retrieve the historycal zone extratime cost data from the db
	$scope.getHistorycalTimeCostZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/zonecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixZoneTimeCost);
		    for(var i = 1; i < result.length; i++){
		    	for(var j = 1; j < result[i].length; j++){
		    		$scope.matrixZoneTimeCost[i][j] = gMapService.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
			    }
		    }
		    if($scope.showLogs)console.log("zone timecost history retrieved from db: " + JSON.stringify(result));
		});
	};	
	
	// Zone historycal time cost csv data
	$scope.getTimeCostZoneHistoryCsv = function(dZone){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
				dzone_name: dZone.name,
				dzone_sub: dZone.submacro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify($scope.matrixZoneTimeCost);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/zonehistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneTimeCostCvsHistorycalFile = result;
	    	window.location.href = $scope.zoneTimeCostCvsHistorycalFile;
	    });	
	};
	
	// Method getHistorycalTimeCostMicroZoneFromDb: used to retrieve the historycal microzone extratime cost data from the db
	$scope.getHistorycalTimeCostMicroZoneFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/zonecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixMicroZoneTimeCost);
		    for(var i = 1; i < result.length; i++){
		    	for(var j = 1; j < result[i].length; j++){
		    		$scope.matrixMicroZoneTimeCost[i][j] = gMapService.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
			    }
		    }
		    console.log("microzone timecost history retrieved from db: " + JSON.stringify(result));
		});
	};	
	
	// MicroZone historycal time cost csv data
	$scope.getTimeCostMicroZoneHistoryCsv = function(dZone){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
				dzone_name: dZone.name,
				dzone_submacro: dZone.submacro,
				dzone_submicro: dZone.submicro,
				dzone_totalslot: dZone.slotNumber
		};
		var value = JSON.stringify($scope.matrixMicroZoneTimeCost);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/zonehistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneTimeCostCvsHistorycalFile = result;
	    	window.location.href = $scope.zoneTimeCostCvsHistorycalFile;
	    });	
	};	
	
	// Method getHistorycalTimeCostStreetFromDb: used to retrieve the historycal streets extratime cost data from the db
	$scope.getHistorycalTimeCostStreetFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		$scope.streetMapReady = false;
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/streetcompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixTimeCost);
		    for(var i = 1; i < result.length; i++){
		    	for(var j = 1; j < result[i].length; j++){
		    		$scope.matrixTimeCost[i][j] = gMapService.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
			    }
		    }
		    if($scope.showLogs)console.log("street timecost history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Street historycal occupancy csv data
	$scope.getTimeCostStreetHistoryCsv = function(dStreet){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
				dstreet_name: dStreet.streetReference,
				dstreet_area: dStreet.area_name,
				dstreet_totalslot: dStreet.slotNumber
		};
		var value = JSON.stringify($scope.matrixTimeCost);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/streethistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetTimeCostCvsHistorycalFile = result;
	    	window.location.href = $scope.streetTimeCostCvsHistorycalFile;
	    });	
	};	
	
	// Method getHistorycalTimeCostParkingFromDb: used to retrieve the historycal parking occupancy data from the db
	$scope.getHistorycalTimeCostParkingFromDb = function(id, verticalVal, orizontalVal, year, month, weekday, dayType, hour, valueType){
		// period params
		var language = (sharedDataService.getUsedLanguage() == 'ita')?0:1;
		var monthRange = $scope.chekIfAllRange(month, 1);
		var weekRange = $scope.chekIfAllRange(weekday, 2);
		var hourRange = $scope.chekIfAllRange(hour, 3);
		$scope.streetMapReady = false;
		var idApp = sharedDataService.getConfAppId();
		var method = 'GET';
		var params = {
			verticalVal: verticalVal,
			orizontalVal: orizontalVal,
			year: $scope.correctParamsFromSemicolon(year),
			month: $scope.correctParamsFromSemicolonForMonth(monthRange),
			weekday: $scope.correctParamsFromSemicolon(weekRange),
			dayType: dayType,
			hour: $scope.correctParamsFromSemicolon(hourRange),
			valueType: valueType,
			lang: language,
			noCache: new Date().getTime()
		};
		if($scope.showLogs)console.log("Params passed in ws get call" + JSON.stringify(params));	
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructurecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixTimeCost);
		    for(var i = 1; i < result.length; i++){
		    	for(var j = 1; j < result[i].length; j++){
		    		$scope.matrixTimeCost[i][j] = gMapService.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
			    }
		    }
		    if($scope.showLogs)console.log("parking timecost history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Parking historycal occupancy csv data
	$scope.getTimeCostParkingHistoryCsv = function(dParking){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var params = {
			dparking_name: dParking.name,
			dparking_streetreference: dParking.streetReference,
			dparking_totalslot: dParking.slotNumber
		};
		var value = JSON.stringify($scope.matrixTimeCost);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timecost/parkingstructureshistory/csv", params, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.parkingTimeCostCvsHistorycalFile = result;
	    	window.location.href = $scope.parkingTimeCostCvsHistorycalFile;
	    });	
	};
	
	// ---------------------------------------------------------- End of WS call ----------------------------------------------------
	
	// -------------------------------------------- End of block for report compare creation -----------------------------------------

	//----------------------------------- legend part --------------------------------------
	
	var showLegendOcc = false;
	var showLegendProf = false;
	var showLegendTime = false;
	
	$scope.show_occupancy_legend_button = false;
	$scope.show_profit_legend_button = false;
	$scope.show_time_legend_button = false;
	
	$scope.showLegend = function(type){
		if(type == 1){
			showLegendOcc = true;
			showLegendProf = false;
			showLegendTime = false;
		} else if(type == 2){
			showLegendOcc = false;
			showLegendProf = true;
			showLegendTime = false;
		} else if(type == 3){
			showLegendOcc = false;
			showLegendProf = false;
			showLegendTime = true;
		}
	};
	
	$scope.isOccupancyLegendShow = function(){
		return showLegendOcc;
	};
	
	$scope.isProfitLegendShow = function(){
		return showLegendProf;
	};
	
	$scope.isTimeLegendShow = function(){
		return showLegendTime;
	};
	
	$scope.closeAllLegend = function(){
		showLegendOcc = false;
		showLegendProf = false;
		showLegendTime = false;
	};

	//------------------------------ end of legend part -------------------------------------

}]);

pm.controller('reportCtrl',['$scope', '$modalInstance', 'data', 'sharedDataService',
    function($scope, $modalInstance, data, sharedDataService) {
		
	$scope.mailPattern=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	$scope.isInit = true;
	
	//var shared_name = sharedDataService.getReportName();
	$scope.report = {
		id : '',
		name : '', 
		description: {},
		periodic : '', 
		startperiod : '', 
		mail : ''
	};
	
	$scope.isperiod = false;
	$scope.periods = [
	    { id:'1', title:"Annuale" },
	    { id:'2', title:"Mensile" },
	    { id:'3', title:"Settimanale" },
	    { id:'4', title:"Giornaliero" }
	];
	$scope.myPeriod = null;
	
	// ------------------ Start datetimepicker section -----------------------
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        //$scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
         return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
         $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        showWeeks: 'false'
    };

    $scope.initDate = new Date();
    $scope.formats = ['shortDate', 'dd/MM/yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];
    $scope.format = $scope.formats[0];
              
    //---------------- End datetimepicker section------------
    
    // ----------------------- Start timepicker section ---------------------------
    $scope.startTime = new Date(0);
    $scope.endTime = new Date(0);
    
    $scope.ismeridian = false;
    $scope.hstep = 1;	// hour step
    $scope.mstep = 1;	// minute step
    
    $scope.clearTime = function() {
        $scope.startTime = null;
        $scope.endTime = null;        
    };
    
    $scope.resetTime = function(date){
    	$scope.startTime = date;
    	$scope.endTime = date;
    };
    // ------------------------ End timepicker section ------------------------------
	
	
	$scope.readReportName = function(){
		$scope.myPeriod = null;
		$scope.report = sharedDataService.getSavedReport();
		if($scope.report.id != ''){
			// load saved report data
			if( $scope.report.periodic != ''){
				$scope.isperiod = true;
				var id = Number($scope.report.periodic);
				$scope.myPeriod = $scope.periods[id -1];
			}
			$scope.rep_topic = $scope.report.description.topic;
			$scope.rep_space = $scope.report.description.space;
			$scope.rep_vis = $scope.report.description.vis;
			$scope.rep_year = $scope.report.description.year;
			$scope.rep_month = $scope.report.description.month;
			$scope.rep_dow = $scope.report.description.dow;
			$scope.rep_hour = $scope.report.description.hour;
		} else {
			// generate new report data
			$scope.report.name = sharedDataService.getReportName();
			$scope.isInit = true;
			//--------------- Shared filter params ----------------
			var topics = sharedDataService.getFilterTopicList();
			var space = sharedDataService.getFilterSpace();
			var vis = sharedDataService.getFilterVis();	
			var year = sharedDataService.getFilterYear();
			var month = sharedDataService.getFilterMonth();
			var dowType = sharedDataService.getFilterDowType();
			var dowVal = sharedDataService.getFilterDowVal();
			var hour = sharedDataService.getFilterHour();
			//-----------------------------------------------------
			
			if(space == "rate_area"){
				$scope.rep_space = "area tariffazione";
			} else if(space == "macrozone"){
				$scope.rep_space = "macrozona";
			} else if(space == "microzone"){
				$scope.rep_space = "via";
			} else if(space == "parkingstructs"){
				$scope.rep_space = "parcheggio struttura";
			} else if(space == "parkingmeter"){
				$scope.rep_space = "parcometro";
			}
			
			switch (topics){
				case "occupation": 
					$scope.rep_topic = "occupazione";
					break;
				case "receipts": 
					$scope.rep_topic = "incasso";
					break;
				case "timeCost": 
					$scope.rep_topic = "costoaccesso";
					break;	
				default: break;
			}
			
			$scope.rep_vis = $scope.correctVisFromFilter(vis);
			$scope.rep_year = (year == null || year == "")?"tutti":year;
			if(month == null || month == ""){
				$scope.rep_month = "tutti";
			} else {
				var month_val = month.split(";");
				if(month_val.length > 1){
					$scope.rep_month = $scope.getCorrectTitleDescFromFilter(month_val[0], 1) + "-" + $scope.getCorrectTitleDescFromFilter(month_val[1], 1);
				} else {
					$scope.rep_month = $scope.getCorrectTitleDescFromFilter(month_val[0], 1);
				}
			}
			if(dowType != null && dowType != ""){
				if(dowType != "custom"){
					if(dowType == "we"){
						$scope.rep_dow = "festivo";
					} else {
						$scope.rep_dow = "feriale";
					}
				} else {
//					var dow_value = dowVal.split(";");
//					if(dow_value.length > 1){
//						$scope.rep_dow = $scope.getCorrectTitleDescFromFilter(dow_value[0], 2) + $scope.getCorrectTitleDescFromFilter(dow_value[1], 2);
//					} else {
//						$scope.rep_dow = $scope.getCorrectTitleDescFromFilter(dow_value[0], 2);
//					}
					var week_day_title = "";
					var dow_value = dowVal.split(",");
					if(dow_value.length == 7){
						$scope.rep_dow = "tutti";
					} else {
						for(var i = 0; i < dow_value.length; i++){
							if(dow_value[i] == "1"){
								week_day_title+="lu_";
							}
							if(dow_value[i] == "2"){
								week_day_title+="ma_";
							}
							if(dow_value[i] == "3"){
								week_day_title+="me_";
							}
							if(dow_value[i] == "4"){
								week_day_title+="gi_";
							}
							if(dow_value[i] == "5"){
								week_day_title+="ve_";
							}
							if(dow_value[i] == "6"){
								week_day_title+="sa_";
							}
							if(dow_value[i] == "7"){
								week_day_title+="do_";
							}
						}
						$scope.rep_dow = week_day_title.substring(0, week_day_title.length-1);
					}					
				}
			}
			if(hour != null && hour != ""){
				var hour_val = hour.split(";");
				if(hour_val.length > 1){
					$scope.rep_hour = hour_val[0] + "-" + hour_val[1];
				} else {
					$scope.rep_hour = hour_val[0];
				}
			}	
			
			$scope.report.description = {
				topic: 	$scope.rep_topic,
				space: $scope.rep_space,
				vis: $scope.rep_vis,
				year: $scope.rep_year,
				month: $scope.rep_month,
				dow: $scope.rep_dow,
				hour: $scope.rep_hour
			};
		}
	};
	
	$scope.correctVisFromFilter = function(vis){
		var value = "";
		switch(vis){
			case 'vis_medium': 
				value = "ultimo valore";
				break;
			case 'vis_last_value': 
				value = "valore medio";
				break;
			case 'vis_medium_year': 
				value = "medio ultimo anno";
				break;
			case 'vis_medium_month': 
				value = "medio ultimo mese";
				break;
			case 'vis_medium_day': 
				value = "medio ultimo giorno";
				break;
		}
		return value;
	};
	
	$scope.getCorrectTitleDescFromFilter = function(value, type){
		var val_title = "";
		if(type == 1){
			// months
			switch(value){
				case "1":
					val_title = "gennaio";
					break;
				case "2":
					val_title = "febbraio";
					break;
				case "3":
					val_title = "marzo";
					break;
				case "4":
					val_title = "aprile";
					break;
				case "5":
					val_title = "maggio";
					break;
				case "6":
					val_title = "giugno";
					break;
				case "7":
					val_title = "luglio";
					break;
				case "8":
					val_title = "agosto";
					break;
				case "9":
					val_title = "settembre";
					break;
				case "10":
					val_title = "ottobre";
					break;
				case "11":
					val_title = "novembre";
					break;
				case "12":
					val_title = "dicembre";
					break;
			}
		} else if(type == 2){
			// day of week
			switch(value){
				case "1":
					val_title = "lunedi";
					break;
				case "2":
					val_title = "martedi";
					break;
				case "3":
					val_title = "mercoledi";
					break;
				case "4":
					val_title = "giovedi";
					break;
				case "5":
					val_title = "venerdi";
					break;
				case "6":
					val_title = "sabato";
					break;
				case "7":
					val_title = "domenica";
					break;
			}
		}
		return val_title;
	};	
	
	var now = Date.now();
	$scope.initperioddate = now;
	
	$scope.cancel = function(){
	    $modalInstance.dismiss('canceled');  
	    $scope.clearReport();
		sharedDataService.setSavedReport($scope.report);
	}; // end cancel
	  
	$scope.save = function(form){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.report.id = sharedDataService.getReportInList().length + 1;
			$modalInstance.close($scope.report);
			sharedDataService.addReportInList($scope.report);
			$scope.clearReport();
			sharedDataService.setSavedReport($scope.report);
		}
	}; // end save
	  
	$scope.clearReport = function(){
		$scope.report = {
			id : '',
			name : '', 
			description: {},
			periodic : '', 
			startperiod : '', 
			mail : ''
		};
	};
	
	$scope.hitEnter = function(evt){
	    if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.name,null) || angular.equals($scope.name,'')))
		$scope.save();
	}; // end hitEnter
}]);