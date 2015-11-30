'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');//, ['googlechart','angular-spinkit']
pm.controller('TimeFilterCtrl',['$scope', '$route', '$rootScope','$filter', 'localize', 'sharedDataService',
                                function($scope, $route, $rootScope, $filter, localize, sharedDataService) {
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
	//$scope.daySliderValue = "1;2;3;4;5;6;7";//(date.getDay() == 0 ? date.getDay() : date.getDay()-1)+";"+(date.getDay());
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
		if(value.mo){
			arr +="1,";
		}
		if(value.tu){
			arr +="2,";
		}
		if(value.we){
			arr +="3,";
		}
		if(value.th){
			arr +="4,";
		}
		if(value.fr){
			arr +="5,";
		}
		if(value.sa){
			arr +="6,";
		}
		if(value.su){
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
		$scope.loadMapsObject();
		//$scope.alignSelectedObjects();
		//$scope.setAllMapObjectLoaded(false);
		//$scope.loadModal();
		//$dialogs.load("","");
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

pm.controller('ViewDashboardCtrlPark',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', '$dialogs', 'sharedDataService', 'invokeDashboardWSService', 'invokeDashboardWSServiceNS', 'invokeWSServiceProxy', '$timeout', 
                          function($scope, $http, $route, $routeParams, $rootScope, localize, $dialogs, sharedDataService, invokeDashboardWSService, invokeDashboardWSServiceNS, invokeWSServiceProxy, $timeout, $location, $filter) {

	$scope.disableThemes = false;	//Used to disable/enable themes buttons selection
	$scope.showLogs = false;
	
	$scope.wait_dialog_text_string_it = "Aggiornamento dati in corso...";
	$scope.wait_dialog_text_string_en = "Loading elements...";
	$scope.wait_dialog_title_string_it = "Attendere Prego";
	$scope.wait_dialog_title_string_en = "Please Wait";
	
	$scope.parkingMetersMarkers = [];
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
	$scope.mapAreas = [];
	$scope.actualParks = [];
	
	$scope.occupancyStreets = [];
	$scope.occupancyAreas = [];
	$scope.occupancyZones = [];
	$scope.occupancyMicroZones = [];
	$scope.occupancyParkingMeterMarkers = [];
	$scope.occupancyParkingStructureMarkers = [];
	$scope.mapStreetSelectedMarkers = [];
	
	$scope.profitStreets = [];
	$scope.profitAreas = [];
	$scope.profitZones = [];
	$scope.profitMicroZones = [];
	$scope.profitParkingMetersMarkers = [];
	$scope.profitParkingStructureMarkers = [];
	$scope.profitStructWS = [];
	
	$scope.timeCostStreets = [];
	$scope.timeCostAreas = [];
	$scope.timeCostZones = [];
	$scope.timeCostMicroZones = [];
	$scope.timeCostParkingStructureMarkers = [];
	
	$scope.profitStreetsList = [];
	$scope.profitZoneList = [];
	$scope.profitAreaList = [];
	
	$scope.myTmpZoneOccupation = [];	//MB28072015: added this variable to manage average zone occupation
	$scope.useAverageZoneOccupation = false;	// to remove this feature set the variable to false
	var showOtherFilterSettings = false;
	
	$scope.addReportFunctions = false;
	
	 // DB type for zone. I have to implement a good solution for types
    var macrozoneType = "macrozona kml";
    var microzoneType = "microzona";
	
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
	
	$scope.authHeaders = {
	    'Accept': 'application/json;charset=UTF-8'
	};
	
	$scope.getLoadingText = function(){
		if(sharedDataService.getUsedLanguage() == 'ita'){
			return $scope.wait_dialog_text_string_it;
		} else {
			return $scope.wait_dialog_text_string_en;
		}
	};
	
	$scope.getLoadingTitle = function(){
		if(sharedDataService.getUsedLanguage() == 'ita'){
			return $scope.wait_dialog_title_string_it;
		} else {
			return $scope.wait_dialog_title_string_en;
		}
	};
	
	$scope.progress = 25;
	
	$scope.loadMapsObject = function(){
		$scope.progress += 25;
		$dialogs.wait($scope.getLoadingText(),$scope.progress, $scope.getLoadingTitle());
	};
	
	$scope.updateLoadingMapState = function(){
		$scope.progress += 25;
    	$rootScope.$broadcast('dialogs.wait.progress',{msg: $scope.getLoadingText(),'progress': $scope.progress, m_title: $scope.getLoadingTitle()});
	};
	
	$scope.closeLoadingMap = function(){
		$scope.progress = 100;
    	$rootScope.$broadcast('dialogs.wait.complete');
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
					if(type == "macrozone"){
						if(exlude != "macrozone"){
							$scope.title_map += "Macrozone, ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone"){
						if(exlude != "microzone"){
							$scope.title_map += "Vie, ";
							$scope.title_map_eng += "Streets, ";
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
					if(type == "macrozone"){
						if(exlude != "macrozone"){
							$scope.title_map += "Macrozone, ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone"){
						if(exlude != "microzone"){
							$scope.title_map += "Vie, ";
							$scope.title_map_eng += "Streets, ";
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
					if(type == "macrozone"){
						if(exlude != "macrozone"){
							$scope.title_map += "Macrozone, ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone"){
						if(exlude != "microzone"){
							$scope.title_map += "Vie, ";
							$scope.title_map_eng += "Streets, ";
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
					if(type == "macrozone"){
						if(exlude != "macrozone"){
							$scope.title_map += "Macrozone, ";
							$scope.title_map_eng += "Macrozones, ";
						}
						$scope.controlCheckedArea(exlude);
					}
					if(type == "microzone"){
						if(exlude != "microzone"){
							$scope.title_map += "Vie, ";
							$scope.title_map_eng += "Streets, ";
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
		if($scope.dashboard_space.macrozone && (exlude != "macrozone")){
			$scope.title_map += "Macrozone, ";
			$scope.title_map_eng += "Macrozones, ";
		}
		if($scope.dashboard_space.microzone && (exlude != "microzone")){
			$scope.title_map += "Vie, ";
			$scope.title_map_eng += "Streets, ";
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
    var showZones = false;
    var showMicroZones = false;
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
    
    $scope.isMicrozonesVisible = function(){
    	return showMicroZones;
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
		   		if($scope.showedObjects[i].id == 'MicroZone'){
		   			$scope.loadMicroZoneAttributes($scope.showedObjects[i].attributes);
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
    		if(attributes[i].code == 'reservedSlotNumber'){
    			$scope.s_reservedSlot = attributes[i];
    		}
    		if(attributes[i].code == 'timedParkSlotNumber'){
    			$scope.s_timedSlot = attributes[i];
    		}
    		if(attributes[i].code == 'paidSlotNumber'){
    			$scope.s_paidSlot = attributes[i];
    		}
    		if(attributes[i].code == 'freeParkSlotNumber'){
    			$scope.s_freeSlot = attributes[i];
    		}
    		if(attributes[i].code == 'freeParkSlotSignNumber'){
    			$scope.s_freeSlotSign = attributes[i];
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
    		if(attributes[i].code == 'manager'){
    			$scope.ps_manager = attributes[i];
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
    		if(attributes[i].code == 'submicro'){
    			$scope.zone_submicro = attributes[i];
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
    		if(attributes[i].code == 'geomFromSubelement'){
    			$scope.zone_geom_from_subelement = attributes[i];
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				showZones = true;
    			}
    		}
    	}
    };
    
  //MicroZones Component settings
    $scope.loadMicroZoneAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			$scope.microzone_name = attributes[i];
    		}
    		if(attributes[i].code == 'submacro'){
    			$scope.microzone_submacro = attributes[i];
    		}
    		if(attributes[i].code == 'submicro'){
    			$scope.microzone_submicro = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			$scope.microzone_note = attributes[i];
    		}
    		if(attributes[i].code == 'status'){
    			$scope.microzone_status = attributes[i];
    		}
    		if(attributes[i].code == 'type'){
    			$scope.microzone_type = attributes[i];
    		}
    		if(attributes[i].code == 'color'){
    			$scope.microzone_color = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			$scope.microzone_geometry = attributes[i];
    		}
    		if(attributes[i].code == 'geomFromSubelement'){
    			$scope.microzone_geom_from_subelement = attributes[i];
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				showMicroZones = true;
    			}
    		}
    	}
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
    		// case index 1: map view
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
    $scope.numberOfPages = function(type, list){
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
       		if($scope.zoneWS != null){
       			if(list == null || list.length == 0){
       				return Math.ceil($scope.zoneWS.length/$scope.maxZones);
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
       		if($scope.profitZonesList != null){
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
		center : sharedDataService.getConfMapCenter(),	//"[" + $scope.mapCenter.latitude + "," + $scope.mapCenter.longitude + "]",
		zoom : parseInt(sharedDataService.getConfMapZoom()),
		styles : myStyles
	};
	
	
	$scope.initPage = function(){	//type
		$scope.dashboard_space = {
			rate_area : false,
			macrozone : false,
			microzone : false,
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
		//if(type == 1){
		$scope.dashboard_topics = "parkSupply";
		//} else {
		$scope.dashboard_topics_list = "parkSupply"; 	//"occupation";
		//}
		
		sharedDataService.setFilterTopicList($scope.dashboard_topics_list);
		sharedDataService.setFilterSpace($scope.dashboard_space_list);
	};
	 
	// Method changeFilterSetup: used to keep in memory the filter option after tab swith (from map to list and vice versa)
	$scope.changeFilterSetup = function(type){
		if(type == 1){
			// case of map
			if($scope.dashboard_space_list == "rate_area"){
				$scope.dashboard_space.rate_area = true;
			} else if($scope.dashboard_space_list == "macrozone"){
				$scope.dashboard_space.macrozone = true;
			} else if($scope.dashboard_space_list == "microzone"){
				$scope.dashboard_space.microzone = true;
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
			} else if($scope.dashboard_space.macrozone){
				$scope.dashboard_space_list = "macrozone";
			} else if($scope.dashboard_space.microzone){
				$scope.dashboard_space_list = "microzone";
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
		}
			
//		$scope.dashboard_filter = {
//			months : true,
//			dows : true,
//			hours : true
//		};
		
		sharedDataService.setFilterTopicList($scope.dashboard_topics_list);
		sharedDataService.setFilterSpace($scope.dashboard_space_list);
	};
	
	// method clearAllSpaceFilter: used to clear all the space setting after change the dashboard view (map or list)
	$scope.clearAllSpaceFilter = function(type){
		if(type == 1){
			$scope.dashboard_space_list = "";
		} else {
			$scope.dashboard_space.rate_area = false;
			$scope.dashboard_space.macrozone = false;
			$scope.dashboard_space.microzone = false;
			$scope.dashboard_space.microzone_part = false;
			$scope.dashboard_space.parkingmeter = false;
			$scope.dashboard_space.parkingstructs = false;
		}
	};
	
	$scope.showZList = false;
	$scope.showMicroZList = false;
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
				$scope.hideAllZones();
				$scope.hideAllStreets(false);
			}
			switch($scope.dashboard_topics){
				case "parkSupply": 
					// Show profit objects (with specifics colors)
					if(autoInit){
						if($scope.dashboard_space.rate_area){
							$scope.showAreaPolygons(1);
						} else if($scope.dashboard_space.macrozone){
							$scope.showZonePolygons(1);
						} else if($scope.dashboard_space.microzone){
							//$scope.showStreetPolylines(1);
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
						$scope.switchStreetMapObject(2, null, false);
						$scope.switchZoneMapObject(2, null);
						$scope.switchMicroZoneMapObject(2, null);
						$scope.switchAreaMapObject(2, null);
						$scope.switchParkingMapObject(2, null);
						$scope.switchPMMapObject(2, null);
					}
					if(!$scope.dashboard_space.parkingmeter){
						// Hide the parkingMeters and uncheck the checkBox
						if($scope.mapParkingMetersSelectedMarkers != null && $scope.mapParkingMetersSelectedMarkers.length > 0){
							var object = $scope.mapParkingMetersSelectedMarkers[0];
							object.options.animation = "";
							$scope.mapParkingMetersMarkers.push(object);
							$scope.mapParkingMetersSelectedMarkers = [];
						}
						$scope.hideParkingMetersMarkers();
					}
					break;
				case "occupation": 
					// Show occupation objects (with specifics colors)
					$scope.show_occupancy_legend_button = true;
					$scope.show_profit_legend_button = false;
					$scope.show_time_legend_button = false;
					if(autoInit){
						if($scope.dashboard_space.rate_area){
							$scope.showAreaPolygons(2);
						} else if($scope.dashboard_space.macrozone){
							$scope.showZonePolygons(2);
						} else if($scope.dashboard_space.microzone){
							//$scope.showStreetPolylines(2);
						} else if($scope.dashboard_space.microzone_part){
							$scope.showStreetPolylines(2);
						} else if($scope.dashboard_space.parkingstructs){
							$scope.showParkingStructuresMarkers(2);
						}
					} else {
						$scope.dashboard_space.microzone_part = true;
						$scope.dashboard_space.parkingmeter = false;
						$scope.switchStreetMapObject(1, null, false);
						$scope.switchMicroZoneMapObject(1, null);
						$scope.switchZoneMapObject(1, null);
						$scope.switchAreaMapObject(1, null);
						$scope.switchParkingMapObject(1, null);	
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
					$scope.show_occupancy_legend_button = false;
					$scope.show_profit_legend_button = true;
					$scope.show_time_legend_button = false;
					// Show profit objects (with specifics colors)
					if(autoInit){
						if($scope.dashboard_space.rate_area){
							$scope.showAreaPolygons(3);
						} else if($scope.dashboard_space.macrozone){
							$scope.showZonePolygons(3);
						} else if($scope.dashboard_space.microzone){
							$scope.showMicroZonePolygons(3);
						} else if($scope.dashboard_space.microzone_part){
							$scope.showStreetPolylines(3);
						} else if($scope.dashboard_space.parkingmeter){
							$scope.showProfitPMMarkers();
						} else if($scope.dashboard_space.parkingstructs){
							$scope.showParkingStructuresMarkers(3);
						}
					} else {
						if(!$scope.dashboard_space.parkingmeter){
							$scope.showProfitPMMarkers();	// here I show the parkingMeter on he map
						} else {
							$scope.switchPMMapObject(5, null);
						}	
						$scope.dashboard_space.microzone_part = false;
						$scope.dashboard_space.parkingmeter = true;
						$scope.switchStreetMapObject(5, null, true);
						$scope.switchMicroZoneMapObject(5, null);
						$scope.switchZoneMapObject(5, null);
						$scope.switchAreaMapObject(5, null);
						$scope.switchParkingMapObject(5, null);	
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
						} else if($scope.dashboard_space.macrozone){
							$scope.showZonePolygons(4);
						} else if($scope.dashboard_space.microzone){
							$scope.showMicroZonePolygons(4);
						} else if($scope.dashboard_space.microzone_part){
							$scope.showStreetPolylines(4);
						} else if($scope.dashboard_space.parkingstructs){
							$scope.showParkingStructuresMarkers(4);
						}
					} else {
						$scope.dashboard_space.microzone_part = true;
						$scope.dashboard_space.parkingmeter = false;
						$scope.switchStreetMapObject(7, null, false);
						$scope.switchMicroZoneMapObject(7, null);
						$scope.switchZoneMapObject(7, null);
						$scope.switchAreaMapObject(7, null);
						$scope.switchParkingMapObject(7, null);
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
						} else if($scope.dashboard_space_list == "macrozone"){
							$scope.showZoneList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "microzone"){
							$scope.showMicroZoneList($scope.dashboard_topics_list);
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
						} else if($scope.dashboard_space_list == "macrozone"){
							$scope.showZoneList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "microzone"){
							$scope.showMicroZoneList($scope.dashboard_topics_list);
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
						} else if($scope.dashboard_space_list == "macrozone"){
							$scope.showZoneList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "microzone"){
							$scope.showMicroZoneList($scope.dashboard_topics_list);
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
						} else if($scope.dashboard_space_list == "macrozone"){
							$scope.showZoneList($scope.dashboard_topics_list);
						} else if($scope.dashboard_space_list == "microzone"){
							$scope.showMicroZoneList($scope.dashboard_topics_list);
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
	
	$scope.showZoneList = function(type){
		$scope.switchListShowType(type);
		$scope.showMicroZList = false;
		$scope.showZList = true;
		$scope.showSList = false;
		$scope.showAList = false;
		$scope.showPSList = false;
		$scope.showPMList = false;
	};
	
	$scope.showMicroZoneList = function(type){
		$scope.switchListShowType(type);
		$scope.showMicroZList = true;
		$scope.showZList = false;
		$scope.showSList = false;
		$scope.showAList = false;
		$scope.showPSList = false;
		$scope.showPMList = false;
	};
	
	$scope.showAreaList = function(type){
		$scope.switchListShowType(type);
		$scope.showMicroZList = false;
		$scope.showAList = true;
		$scope.showZList = false;
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
		$scope.showZList = false;
		$scope.showAList = false;
		$scope.showPSList = false;
		$scope.showPMList = false;
	};
	
	$scope.showStructList = function(type){
		$scope.switchListShowType(type);
		$scope.showMicroZList = false;
		$scope.showPSList = true;
		$scope.showZList = false;
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
		$scope.showZList = false;
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
	
	// correctMyZones: used to correct the zone object with all the necessary data
	$scope.correctMyZones = function(zones){
		var correctedZones = [];
		for(var i = 0; i < zones.length; i++){
			var correctZone = {
				id: zones[i].id,
				id_app: zones[i].id_app,
				color: zones[i].color,
				name: zones[i].name,
				submacro: zones[i].submacro,
				submicro: zones[i].submicro,
				type: zones[i].type,
				note: zones[i].note,
				geometry: $scope.correctMyGeometryPolygon(zones[i].geometry),
				geometryFromSubelement: zones[i].geometryFromSubelement,
				subelements: $scope.loadStreetsFromZone(zones[i].id),
				label: zones[i].name + "_" + zones[i].submacro
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
	
	$scope.correctObjId = function(id, i){
		if(i == 0){
			return id;
		} else {
			return id + '_' + i;
		}
	};	
	
	// Method checkIfAlreadyPresentInList: used to check if an element is already present in a list
	$scope.checkIfAlreadyPresentInList = function(list, element){
		var found = false;
		for(var i = 0; ((i < list.lenght) && !found); i++){
			if(list[i] == element){
				found = true;
			}
		}
		return found;
	};
	
	$scope.addLabelToZoneObject = function(zone){
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
    		label: zone.name + "_" + zone.submacro
    	};
    	return corrected_zone;
    };	
    
    $scope.loadStreetsFromZone = function(z_id){
		var z_streets = [];
		if($scope.streetWS != null && $scope.streetWS.length > 0){
			for(var i = 0; i < $scope.streetWS.length; i++){
				var found = false;
				for(var j = 0; (j < $scope.streetWS[i].zones.length) && !found; j++){
					if($scope.streetWS[i].zones[j] == z_id){
						found = true;
						z_streets.push($scope.streetWS[i]);
					}
				}
			}
		}
		return z_streets;
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
			toHideArea[$scope.mapSelectedAreas[0].id].setMap(null);
			$scope.mapSelectedAreas = [];
		}
		// For Zone
		if($scope.mapSelectedZones != null && $scope.mapSelectedZones.length > 0){
			var toHideZone = $scope.map.shapes;
			toHideZone[$scope.mapSelectedZones[0].id].setMap(null);
			$scope.mapSelectedZones = [];
		}
		// For MicroZone
		if($scope.mapSelectedMicroZones != null && $scope.mapSelectedMicroZones.length > 0){
			var toHideZone = $scope.map.shapes;
			toHideZone[$scope.mapSelectedMicroZones[0].id].setMap(null);
			$scope.mapSelectedMicroZones = [];
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
	
//	$scope.initMap = function(pmMarkers, psMarkers, bpMarkers){
//		$scope.options = {
//		    scrollwheel: true
//		};
//		
//		if(pmMarkers!= null){
//			$scope.mapParkingMetersMarkers = pmMarkers;
//		} else {
//			$scope.mapParkingMetersMarkers = [];
//		}
//		if(psMarkers != null){
//			$scope.mapParkingStructureMarkers = psMarkers;
//		} else {
//			$scope.mapParkingStructureMarkers = [];
//		}
//		if(bpMarkers != null){
//			$scope.mapBikePointMarkers = bpMarkers;
//		} else {
//			$scope.mapBikePointMarkers = [];
//		}
//		$scope.mapReady = true;
//		//$scope.$apply();
//	};
	
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
	$scope.changeParkingMetersMarkers = function(dashboardTopic){
		if(dashboardTopic == "parkSupply"){
			if(!$scope.dashboard_space.parkingmeter){ //$scope.mapelements.parkingmeters
				$scope.showParkingMetersMarkers();
			} else {
				$scope.hideParkingMetersMarkers();
			}	
		} else if(dashboardTopic == "receipts"){
			if(!$scope.dashboard_space.parkingmeter){ //$scope.mapelements.parkingmeters
				$scope.showProfitPMMarkers();
			} else {
				$scope.hideParkingMetersMarkers();
			}
		}
		if(!$scope.dashboard_space.parkingmeter){ //$scope.mapelements.parkingmeters
			$scope.update_title_map(true, "parkingmeter", "");
		} else {
			$scope.update_title_map(true, "parkingmeter", "parkingmeter");
		}
	};

	$scope.showParkingMetersMarkers = function() {
        $scope.mapParkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 0);
        //$scope.refreshMap();
    };
    
    $scope.hideParkingMetersMarkers = function() {
    	$scope.mapParkingMetersMarkers = []; //$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
    	$scope.profitParkingMetersMarkers = [];
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
    	if($scope.mapParkingMetersSelectedMarkers != null && $scope.mapParkingMetersSelectedMarkers.length > 0){
    		$scope.parkingMetersMarkers.push($scope.mapParkingMetersSelectedMarkers[0]);
    	}
    	$scope.mapParkingMetersSelectedMarkers = [];
    	//$scope.refreshMap();
        //$scope.$apply();
    };
    
    $scope.showProfitPMMarkers = function(){
    	$scope.profitParkingMetersMarkers =  $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 5);
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
        	$scope.mapParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        } else if(type == 2){
        	$scope.occupancyParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        } else if(type == 3){
        	$scope.profitParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        } else if(type == 4){
        	$scope.timeCostParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, type);
        }
    };
    
    $scope.hideParkingStructuresMarkers = function(type) {
    	if(type == null){
    		$scope.mapParkingStructureMarkers = [];
    		$scope.occupancyParkingStructureMarkers = [];
    		$scope.profitParkingStructureMarkers = [];
    		$scope.timeCostParkingStructureMarkers = [];
    	} else if(type == 1){
    		$scope.mapParkingStructureMarkers = []; //$scope.setAllMarkersMap($scope.parkinStructureMarkers, null, false);
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
    	//$scope.mapStreetSelectedMarkers = [];
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
    		$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true, type, false, false)[0];
    	} else if(type == 2){
    		if($scope.occupancyAreas.length == 0){
    			$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, true, type, true, false)[0];
    		} else {
    			$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, true, type, false, false)[0];
    		}
    	} else if(type == 3){
    		if($scope.profitAreas.length == 0){
    			$scope.profitAreas = $scope.initAreasOnMap($scope.areaWS, true, type, true, false)[0];
    		} else {
    			$scope.profitAreas = $scope.initAreasOnMap($scope.areaWS, true, type, false, false)[0];
    		}
    	} else if(type == 4){
    		if($scope.timeCostAreas.length == 0){
    			$scope.timeCostAreas = $scope.initAreasOnMap($scope.areaWS, true, type, true, false)[0];
    		} else {
    			$scope.timeCostAreas = $scope.initAreasOnMap($scope.areaWS, true, type, false, false)[0];
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
    		$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, false, type, false, false)[0];
    	} else if(type == 2){
    		$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, false, type, false, false)[0];
    	} else if(type == 3){
    		$scope.profitAreas = $scope.initAreasOnMap($scope.areaWS, false, type, false, false)[0];
    	} else if(type == 4){
    		$scope.timeCostAreas = $scope.initAreasOnMap($scope.areaWS, false, type, false, false)[0];
    	}
    	$scope.hideAllAreas($scope.areaWS);
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
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
    	} else if(dashboardTopic == "timeCost"){
    		if(!$scope.dashboard_space.macrozone){
				$scope.showZonePolygons(4);
			} else {
				$scope.hideZonePolygons(4);
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
    		$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true, type, false, false)[0];
    	} else if(type == 2){
    		if($scope.occupancyZones.length == 0){
    			$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, true, type, true, false)[0];
    		} else {
    			$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, true, type, false, false)[0];
    		}
    	} else if(type == 3){
    		if($scope.profitZones.length == 0){
    			$scope.profitZones = $scope.initZonesOnMap($scope.zoneWS, true, type, true, false)[0];
    		} else {
    			$scope.profitZones = $scope.initZonesOnMap($scope.zoneWS, true, type, false, false)[0];
    		}
    	} else if(type == 4){
    		if($scope.timeCostZones.length == 0){
    			$scope.timeCostZones = $scope.initZonesOnMap($scope.zoneWS, true, type, true, false)[0];
    		} else {
    			$scope.timeCostZones = $scope.initZonesOnMap($scope.zoneWS, true, type, false, false)[0];
    		}
    	}
    };
    
    $scope.hideZonePolygons = function(type) {
    	if(type == 1){
    		$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, false, type, false, false)[0];
    	} else if(type == 2){
    		$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, false, type, false, false)[0];
    	} else if(type == 3){
    		$scope.profitZones = $scope.initZonesOnMap($scope.zoneWS, false, type, false, false)[0];
    	} else if(type == 4){
    		$scope.timeCostZones = $scope.initZonesOnMap($scope.zoneWS, false, type, false, false)[0];
    	}
    	$scope.hideAllZones();
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
    };
    
    // Show/hide microzones polygons
    $scope.changeMicrozonePolygons = function(dashboardTopic){
		//if(!$scope.mapelements.zones){
    	if(dashboardTopic == "parkSupply"){
	    	if(!$scope.dashboard_space.microzone){
				$scope.showMicroZonePolygons(1);
			} else {
				$scope.hideMicroZonePolygons(1);
			}
    	} else if(dashboardTopic == "occupation"){
    		if(!$scope.dashboard_space.microzone){
				$scope.showMicroZonePolygons(2);
			} else {
				$scope.hideMicroZonePolygons(2);
			}
    	} else if(dashboardTopic == "receipts"){
    		if(!$scope.dashboard_space.microzone){
				$scope.showMicroZonePolygons(3);
			} else {
				$scope.hideMicroZonePolygons(3);
			}
    	} else if(dashboardTopic == "timeCost"){
    		if(!$scope.dashboard_space.microzone){
				$scope.showMicroZonePolygons(4);
			} else {
				$scope.hideMicroZonePolygons(4);
			}
    	}
    	if(!$scope.dashboard_space.microzone){
    		$scope.update_title_map(true, "microzone", "");
    	} else {
    		$scope.update_title_map(true, "microzone", "microzone");
    	}
	};   
	
	$scope.showMicroZonePolygons = function(type) {
    	if(type == 1){
    		$scope.mapMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, type, false, false)[0];
    	} else if(type == 2){
    		if($scope.occupancyMicroZones.length == 0){
    			$scope.occupancyMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, type, true, false)[0];
    		} else {
    			$scope.occupancyMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, type, false, false)[0];
    		}
    	} else if(type == 3){
    		if($scope.profitMicroZones.length == 0){
    			$scope.profitMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, type, true, false)[0];
    		} else {
    			$scope.profitMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, type, false, false)[0];
    		}
    	} else if(type == 4){
    		if($scope.timeCostMicroZones.length == 0){
    			$scope.timeCostMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, type, true, false)[0];
    		} else {
    			$scope.timeCostMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, type, false, false)[0];
    		}
    	}
    };
    
    $scope.hideMicroZonePolygons = function(type) {
    	if(type == 1){
    		$scope.mapMicroZones = $scope.initZonesOnMap($scope.microzoneWS, false, type, false, false)[0];
    	} else if(type == 2){
    		$scope.occupancyMicroZones = $scope.initZonesOnMap($scope.microzoneWS, false, type, false, false)[0];
    	} else if(type == 3){
    		$scope.profitMicroZones = $scope.initZonesOnMap($scope.microzoneWS, false, type, false, false)[0];
    	} else if(type == 4){
    		$scope.timeCostMicroZones = $scope.initZonesOnMap($scope.microzoneWS, false, type, false, false)[0];
    	}
    	$scope.hideAllMicroZones();
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
    };	
    
    // Show/hide streets polygons
    $scope.changeStreetPolylines = function(dashboardTopic){
		//if(!$scope.mapelements.streets){
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
    		$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true, type, false)[0];
    	} else if(type == 2) {
    		$scope.occupancyStreets = $scope.initStreetsOnMap($scope.streetWS, true, type, false)[0];
    	} else if(type == 3){
    		$scope.profitStreets = $scope.initStreetsOnMap($scope.streetWS, true, type, false)[0];
    	} else if(type == 4){
    		$scope.timeCostStreets = $scope.initStreetsOnMap($scope.streetWS, true, type, false)[0];
    	}
    };
    
    $scope.hideStreetPolylines = function(type) {
    	if(type == 1){
    		$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, false, type, false)[0];
    	} else if(type == 2){
    		$scope.occupancyStreets = $scope.initStreetsOnMap($scope.streetWS, false, type, false)[0];
    	} else if(type == 3){
    		$scope.profitStreets = $scope.initStreetsOnMap($scope.streetWS, false, type, false)[0];
    	} else if(type == 4){
    		$scope.timeCostStreets = $scope.initStreetsOnMap($scope.streetWS, false, type, false)[0];
    	}
    	$scope.hideAllStreets(false);
    	$scope.detailsOpened = false;
    	$scope.occupancyOpened = false;
    	$scope.profitOpened = false;
    	$scope.timeCostOpened = false;
    	$scope.mapStreetSelectedMarkers = [];
        //$scope.$apply();
    };
    
    $scope.hideAllStreets = function(all){
    	if($scope.map != null){
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
	    	for(var i = 0; i < $scope.timeCostStreets.length; i++){
		    	toDelStreet[$scope.timeCostStreets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
	    	}
	    	if(all){
	    		toDelStreet = null;
	    		$scope.mapStreets = [];
	    		$scope.occupancyStreets = [];
	    		$scope.profitStreets = [];
	    		$scope.timeCostStreets = [];
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
    	for(var i = 0; i < $scope.timeCostZones.length; i++){
    		toDelZones[$scope.timeCostZones[i].id].setMap(null);		// I can access dinamically the value of the object shapes for zones
    	}
    	$scope.alignSelectedObjects();
    };
    
    $scope.hideAllMicroZones = function(){
	    var toHideZone = $scope.map.shapes;
	    for(var i = 0; i < $scope.mapMicroZones.length; i++){
	    	if(toHideZone[$scope.mapMicroZones[i].id] != null){
    			toHideZone[$scope.mapMicroZones[i].id].setMap(null);
    		}	
	    }
	    for(var i = 0; i < $scope.occupancyMicroZones.length; i++){
	    	if(toHideZone[$scope.occupancyMicroZones[i].id] != null){
    			toHideZone[$scope.occupancyMicroZones[i].id].setMap(null);
    		}
    	}
    	for(var i = 0; i < $scope.profitMicroZones.length; i++){
    		if(toHideZone[$scope.profitMicroZones[i].id] != null){
    			toHideZone[$scope.profitMicroZones[i].id].setMap(null);
    		}
    	}
    	for(var i = 0; i < $scope.timeCostMicroZones.length; i++){
    		if(toHideZone[$scope.timeCostMicroZones[i].id] != null){
    			toHideZone[$scope.timeCostMicroZones[i].id].setMap(null);
    		}
    	}
    	$scope.alignSelectedObjects();
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
	    				var myId = $scope.correctAreaId(areas[i].id, j);
	    				if(toHideArea[myId] != null){
			    			toHideArea[myId].setMap(null);
			    		}
	    			}
	    		}
    		}
    	}
    	$scope.alignSelectedObjects();
    };
    
    $scope.setAllMarkersMap = function(markers, map, visible, type){
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
		var myAreaPm = {};
		for(var i = 0; i < markers.length; i++){
    		markers[i].options.visible = visible;
    		markers[i].options.map = map;
    		switch(type){
	    		case 0:
	    			//myIcon = $scope.pmMarkerIcon;
					myAreaPm = $scope.getLocalAreaById(markers[i].data.areaId);
					//myIcon = $scope.getCorrectPmIconByAreaName(myAreaPm.name);
					markers[i].icon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
	    			break;
	    		case 1:
	    			markers[i].icon = $scope.psMarkerIcon;
	    			break;
	    		case 2:
	    			var myIcon = $scope.getOccupancyIcon(markers[i].data.occupancyRate, 2);
	        		markers[i].icon = myIcon;
	    			break;
	    		case 3:
	    			var myIcon = $scope.getProfitIcon(markers[i].data.profit, 2);
	        		markers[i].icon = myIcon;
	    			break;
	    		case 4:
	    			var occupancy = markers[i].data.occupancyRate;
	    			var timeCost = $scope.getExtratimeFromOccupancy(occupancy);
	    			var myIcon = $scope.getTimeCostIcon(timeCost, 2);
	        		markers[i].icon = myIcon;
	        		markers[i].data.extratime = timeCost;
	    			break;
	    		case 5:		// profit icon for parking meter
	    			var myIcon = $scope.getProfitIcon(markers[i].data.profit, 1);
	        		markers[i].icon = myIcon;
	    			break;	
    		}
    	}
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
				myAreaPm = $scope.getLocalAreaById(marker.areaId);
				//myIcon = $scope.getCorrectPmIconByAreaName(myAreaPm.name);
				myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
				cid = "c" + marker.id;
				break;
			case 2 : 
				myIcon = $scope.psMarkerIcon;
				break;
			case 3 :
				myIcon = $scope.bpMarkerIcon;
				break;
			case 4 :
				myIcon = $scope.getOccupancyIcon(marker.occupancyRate, 2);	//get the correct profit icon from the ps profit value
				break;
				break;
			case 5 :
				color = $scope.getProfitColor(marker.profit);
				//myIcon = $scope.getCorrectPmIconByAreaName(myAreaPm.name);
				myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((marker.profit != null) ? $scope.plainColor(color) : defaultMarkerColor);
				cid = "c" + marker.id;
				break;
			case 6 :
				//myIcon = $scope.psMarkerIcon;
				myIcon = $scope.getProfitIcon(marker.profit, 2);	//get the correct profit icon from the ps profit value
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
		var timeCost = {};
		
		for(var i = 0; i < areas.length; i++){
			var areaOccupancy = 0;
			var areaProfit = [];
			if(type == 1){
				aColor = $scope.correctColor(areas[i].color);
			} else if(type == 2){
				var slotsInArea = $scope.getTotalSlotsInArea(areas[i].id);
				areaOccupancy = $scope.getStreetsInAreaOccupancy(areas[i].id);
				if(areaOccupancy != -1){
					areaOccupancy = slotsInArea[2];
				}
				aColor = $scope.getOccupancyColor(areaOccupancy);
			} else if(type == 3){
				areaProfit = $scope.getPMsInAreaProfit(areas[i].id);
				aColor = $scope.getProfitColor(areaProfit[0]);
			} else if(type == 4){
				var slotsInArea = $scope.getTotalSlotsInArea(areas[i].id);
				areaOccupancy = $scope.getStreetsInAreaOccupancy(areas[i].id);
				if(areaOccupancy != -1){
					areaOccupancy = slotsInArea[2];
				}
				timeCost = $scope.getExtratimeFromOccupancy(areaOccupancy);
				areas[i].extratime = timeCost;
				aColor = $scope.getTimeCostColor(timeCost);
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
					tmpAreas.push(area);
				}
			}
		}
		if(!firstTime){
			$scope.closeLoadingMap();
		}
		return [tmpAreas, areas];
	};
	
	$scope.updateAreasOccupancyTimeCost = function(){
		for(var i = 0; i < $scope.areaWS.length; i++){
			var slotsInArea = $scope.getTotalSlotsInArea($scope.areaWS[i].id);
			$scope.areaWS[i].slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(areas[i].id);
			$scope.areaWS[i].slotOccupied = slotsInArea[1]; //Math.round(area.data.slotNumber * areaOccupancy / 100);
			var areaOccupancy = $scope.getStreetsInAreaOccupancy($scope.areaWS[i].id);
			if(areaOccupancy != -1){
				areaOccupancy = slotsInArea[2];
			}
			var timeCost = $scope.getExtratimeFromOccupancy(areaOccupancy);
			$scope.areaWS[i].occupancy = (areaOccupancy != -1) ? Math.round(areaOccupancy) : areaOccupancy;
			$scope.areaWS[i].extratime = timeCost;
		}
	};
	
	$scope.initStreetsOnMap = function(streets, visible, type, onlyData){
		var street = {};
		var poligons = {};
		var tmpStreets = [];
		var sColor = "";
		var timeCost = {};
		
		for(var i = 0; i < streets.length; i++){
			var myAreaS = $scope.getLocalAreaById(streets[i].rateAreaId);
			//var myZones = [];
			//var mySubzones = [];
			//for(var j = 0; j < streets[i].myZones.length; j++){
			//	var zone = $scope.getLocalZoneById(streets[i].myZones[j], 2);
			//	if(zone == null){
			//		var subzone = $scope.getLocalMicroZoneById(streets[i].myMicroZones[j], 2);
			//		if(subzone != null){
			//			mySubzones.push(subzone);
			//		}
			//	} else {
			//		myZones.push($scope.addLabelToZoneObject(zone));
			//	}
			//}
			var parkingMeters = streets[i].myPms;
			var totalProfit = 0;
			var totalTickets = 0;
			if(parkingMeters != null){
				for(var j = 0; j < parkingMeters.length; j++){
					if(parkingMeters[j] != null){
						var profit = $scope.getActualPmProfit(parkingMeters[j].id)[0];
						var tickets = $scope.getActualPmProfit(parkingMeters[j].id)[1];
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
					sColor = $scope.correctColor(streets[i].color);
				} else if(type == 2){
					sColor = $scope.getOccupancyColor(streets[i].occupancyRate);
				} else if(type == 3){
					sColor = $scope.getProfitColor(streets[i].profit);
				} else if(type == 4){
					timeCost = $scope.getExtratimeFromOccupancy(streets[i].occupancyRate);
					streets[i].extratime = timeCost;
					sColor = $scope.getTimeCostColor(timeCost);
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
						zones: streets[i].myZones,
						microzones: streets[i].myMicroZones, //mySubzones,
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
		}
		$scope.closeLoadingMap();
		return [tmpStreets, streets];
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
		return [pmdata.profit, pmdata.tickets];
	};
	
	$scope.updateZonesOccupancyTimeCost = function(){
		for(var i = 0; i < $scope.zoneWS.length; i++){
			var slotsInZone = $scope.getTotalSlotsInZone($scope.zoneWS[i].id);
			$scope.zoneWS[i].slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone(zones[i].id);
			$scope.zoneWS[i].slotOccupied = slotsInZone[1];
			var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.zoneWS[i].id);
			if(zoneOccupancy != -1){
				zoneOccupancy = slotsInZone[2];
			}
			var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
			$scope.zoneWS[i].occupancy = (zoneOccupancy != -1) ? Math.round(zoneOccupancy) : zoneOccupancy;
			$scope.zoneWS[i].zColor = $scope.getOccupancyColor(zoneOccupancy);
			$scope.zoneWS[i].extratime = timeCost;
		}
	};
	
	$scope.updateMicroZonesOccupancyTimeCost = function(){
		for(var i = 0; i < $scope.microzoneWS.length; i++){
			var slotsInZone = $scope.getTotalSlotsInZone($scope.microzoneWS[i].id);
			$scope.microzoneWS[i].slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone(zones[i].id);
			$scope.microzoneWS[i].slotOccupied = slotsInZone[1];
			var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.microzoneWS[i].id);
			if(zoneOccupancy != -1){
				zoneOccupancy = slotsInZone[2];
			}
			var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
			$scope.microzoneWS[i].occupancy = (zoneOccupancy != -1) ? Math.round(zoneOccupancy) : zoneOccupancy;
			$scope.microzoneWS[i].zColor = $scope.getOccupancyColor(zoneOccupancy);
			$scope.microzoneWS[i].extratime = timeCost;
		}
	};
	
	// Method getExtratimeFromOccupancy: retrieve the correct extratime value from the occupancy rate of the object
	$scope.getExtratimeFromOccupancy = function(occupancy){
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
	
	$scope.getExtratimeFromOccupancyForHistorycalTable = function(occupancy){
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
	
	
	$scope.initZonesOnMap = function(zones, visible, type, firstInit, firstTime){
		var zone = {};
		var poligons = {};
		var tmpZones = [];
		var timeCost = "";
		var zColor = "";
		
		for(var i = 0; i < zones.length; i++){
			var zoneOccupancy = 0;
			var zoneProfit = 0;
			if(type == 1){
				zColor = $scope.correctColor(zones[i].color);
			} else if(type == 2){
				var slotsInZone = $scope.getTotalSlotsInZone(zones[i].id);
				zoneOccupancy = $scope.getStreetsInZoneOccupancy(zones[i].id);
				if(zoneOccupancy != -1){
					zoneOccupancy = slotsInZone[2];
				}
				zColor = $scope.getOccupancyColor(zoneOccupancy);
			} else if(type == 3){
				zoneProfit = $scope.getStreetsInZoneProfit(zones[i].id);
				//console.log(zones[i].name + " profit: " + zoneProfit[0] + " , " + zoneProfit[1]);
				zColor = $scope.getProfitColor(zoneProfit[0]);
			} else if(type == 4){
				var slotsInZone = $scope.getTotalSlotsInZone(zones[i].id);
				zoneOccupancy = $scope.getStreetsInZoneOccupancy(zones[i].id);
				if(zoneOccupancy != -1){
					zoneOccupancy = slotsInZone[2];
				}
				timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
				zones[i].extratime = timeCost;
				zColor = $scope.getTimeCostColor(timeCost);
			}
			
			if(firstInit){	// I use this code only the first time I show the zone occupancy data
				var slotsInZone = $scope.getTotalSlotsInZone(zones[i].id);
				zones[i].slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone(zones[i].id);
				zones[i].slotOccupied = slotsInZone[1]; //Math.round(zone.data.slotNumber * zoneOccupancy / 100);
			}
			zones[i].slotPaid = $scope.getPaidSlotsInZone(zones[i].id);
			zones[i].profit = zoneProfit[0];	// sum of profit from pms in zone
			zones[i].tickets = zoneProfit[1];	// sum of tickets from pms in zone
			zones[i].streetInZone = zoneProfit[2];
			
			if(zones[i].geometryFromSubelement){
				var streets = $scope.loadStreetsFromZone(zones[i].id);//zones[i].subelements;//$scope.loadStreetsFromZone(zones[i].id);
				var color = $scope.correctColor($scope.lightgray);
				if(streets != null && streets.length > 0){
					if(type == 1){
						color = $scope.correctColor(streets[0].area_color);
					} else {
						color = zColor;
					}
				}
				if(streets != null && streets.length > 0){
					for(var j = 0; j < streets.length; j++){
						var polyline = streets[j].geometry;
						zone = {
							id: "mz" +	streets[j].id,	//$scope.correctObjId(zones[i].id, j),	// I try to use id of street instead of id of zone
							path: $scope.correctPoints(polyline.points),
							gpath: $scope.correctPointsGoogle(polyline.points),
							stroke: {
							    color: color,
							    weight: 3,
							    opacity: 0.5
							},
							data: zones[i],
							info_windows_pos: $scope.correctPointGoogle(polyline.points[1]),
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
					
					tmpZones.push(zone);
				}
			}
		}
		if(!firstTime){
			$scope.closeLoadingMap();
		}
		return [tmpZones, zones];
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
	
	$scope.getLocalPmById = function(objId){
		var find = false;
		var myPms = sharedDataService.getSharedLocalPms();
		for(var i = 0; i < myPms.length && !find; i++){
			var pmIdString = String(myPms[i].id);
			if(pmIdString.localeCompare(objId) == 0){
				find = true;
				return myPms[i];
			}
		}
		return null;
	};	
	
	$scope.initStreetsObjects = function(streets){
		var myStreets = [];
		for(var i = 0; i < streets.length; i++){
			var zones = [];
			var subzones = [];
			for(var j = 0; j < streets[i].zones.length; j++){
				var zone = $scope.getLocalZoneById(streets[i].zones[j], 2);
				if(zone == null){
					var subzone = $scope.getLocalMicroZoneById(streets[i].zones[j], 2);
					if(subzone != null){
						subzones.push(subzone);
					}
				} else {
					zones.push($scope.addLabelToZoneObject(zone));
				}
			}
			var pms = [];
			if(streets[i].parkingMeters != null){
				for(var x = 0; x < streets[i].parkingMeters.length; x++){
					//var pm = $scope.getLocalPmByCode(streets[i].parkingMeters[x]);
					var pm = $scope.getLocalPmById(streets[i].parkingMeters[x]);
					pms.push(pm);
				}
			}
			var area = $scope.getLocalAreaById(streets[i].rateAreaId);
			var mystreet = $scope.cleanStreetNullValue(streets[i]);// NB: I have to use the average occupancy value and not the data stored in db
			mystreet.slotOccupied = $scope.getTotalOccupiedSlots(mystreet);
			//mystreet.slotOccupied = (mystreet.occupancyRate != -1)?Math.round(mystreet.slotNumber * mystreet.occupancyRate / 100):0;
			mystreet.extratime = $scope.getExtratimeFromOccupancy(mystreet.occupancyRate);
			mystreet.area_name = area.name;
			mystreet.area_color= area.color;
			mystreet.myZones = zones;
			mystreet.myMicroZones = subzones;
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
		street.unusuableSlotNumber = (s_object.unusuableSlotNumber != null && s_object.unusuableSlotNumber > 0) ? s_object.unusuableSlotNumber : 0;
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
	
	$scope.getLocalZoneById = function(id, type){
		var find = false;
		var corrZone = null;
		var myZones = sharedDataService.getSharedLocalZones();
		for(var i = 0; i < myZones.length && !find; i++){
			if(myZones[i].id == id){
				find = true;
				if(type == 1){
					corrZone = myZones[i];
				} else {
					corrZone = {
						id: myZones[i].id,
						id_app: myZones[i].id_app,
						color: myZones[i].color,
						name: myZones[i].name,
						submacro: myZones[i].submacro,
						submicro: myZones[i].submicro,
						type: myZones[i].type,
						note: myZones[i].note,
						geometry: $scope.correctMyGeometryPolygon(myZones[i].geometry),
						label: myZones[i].name + "_" + myZones[i].submacro
					};
				}			
			}
		}
		return corrZone;
	};	
	
	$scope.getLocalMicroZoneById = function(id, type){
		var find = false;
		var myMicroZones = sharedDataService.getSharedLocalMicroZones();
		var corrMicrozone = null;
		for(var i = 0; i < myMicroZones.length && !find; i++){
			if(myMicroZones[i].id == id){
				find = true;
				if(type == 1){
					corrMicrozone = myMicroZones[i];
				} else {
					corrMicrozone = {
						id: myMicroZones[i].id,
						id_app: myMicroZones[i].id_app,
						color: myMicroZones[i].color,
						name: myMicroZones[i].name,
						submacro: myMicroZones[i].submacro,
						submicro: myMicroZones[i].submicro,
						type: myMicroZones[i].type,
						note: myMicroZones[i].note,
						geometry: $scope.correctMyGeometryPolygon(myMicroZones[i].geometry),
						label: myMicroZones[i].name + "_" + myMicroZones[i].submicro
					};
				}
				
			}
		}
		return corrMicrozone;
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
	
	$scope.initWsView = function(type, isInit){
		$scope.hideAllStreets(true);	// Method used to hide all streets from map after tab switch
		//$scope.parkingMetersMarkers = [];
		//$scope.parkingStructureMarkers = [];
	   	if(!isInit){
	   		$scope.changeFilterSetup(type);
	   	} else {
	   		$scope.initPage();
	   		$scope.loadMapsObject();	// To show modal waiting spinner
	   		$scope.initComponents();
	   		$scope.getAreasFromDb();
	   		$scope.initAllDiagrams();
	   	}
		$scope.mapReady = false;
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
			    
			$scope.areaWS = allAreas;
			if(showArea){
			    $scope.initAreasOnMap($scope.areaWS, false, 1, false, true)[0];
			}    
			sharedDataService.setSharedLocalAreas($scope.areaWS);
			//$scope.getParkingMetersFromDb();
			//var d = new Date();
		    //var hour = "10;12";
		    //$scope.getProfitPMFromDb(d.getFullYear(), d.getMonth(), null, "wd", hour, 2, true);
		    $scope.getProfitPMFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, true);
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
		    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true, 1, false)[0];
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
		    
		    if(isFirst){
		    	$scope.getOccupancyParksFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);
		    	//$scope.getProfitParksFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);
		    	$scope.dashboard_space.microzone_part = true;
		    	$scope.dashboard_topics == "parkSupply";
		    	if(showStreets){
			    	$scope.updateStreetOccupancy($scope.streetWS);
				}
		    } else {
		    	if(showStreets){
			    	$scope.updateStreetOccupancy($scope.streetWS);
				}
			    if(showZones){
			    	$scope.updateZoneOccupancy(true);
			    }
			    if(showMicroZones){
			    	$scope.updateMicroZoneOccupancy(true);
			    }
			    if(showArea){
			    	$scope.updateAreaOccupancy(true);
			    }
		    }
		    // For list data
			$scope.updateZonesOccupancyTimeCost();
			$scope.updateMicroZonesOccupancyTimeCost();
			$scope.updateAreasOccupancyTimeCost();
		});
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/parkingmeters", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allPMs);
		    $scope.parkingMeterWS = $scope.initPMObjects(allPMs);
		    
		    if(showPm){
		    	for (var i = 0; i <  $scope.parkingMeterWS.length; i++) {
		    		markers.push(createMarkers(i, $scope.parkingMeterWS[i], 5));
		    	}
		    	angular.copy(markers, $scope.parkingMetersMarkers);
		    	$scope.updatePMProfit();
		    }
		    sharedDataService.setSharedLocalPms(allPMs);
		    
		    if(isFirst){
		    	//$scope.getOccupancyParksFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);
		    	$scope.getZonesFromDb(isFirst, macrozoneType);
				$scope.getZonesFromDb(isFirst, microzoneType);
		    } else {
		    	if(showStreets){
			    	$scope.updateStreetProfit(isFirst, $scope.dashboard_space.microzone_part);
				}
			    if(showArea){
			    	$scope.updateAreaProfit(isFirst);
			    }
			    if(showZones){
			    	$scope.updateZoneProfit(isFirst);
			    }
			    if(showMicroZones){
			    	$scope.updateMicroZoneProfit(isFirst);
			    }
		    	$scope.closeLoadingMap();
		    }
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/parkstructs", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allPSs);
		    //$scope.updateLoadingMapState();
		    $scope.profitStructWS = allPSs;
		    $scope.allDataStructWS = $scope.mergeParkDbData($scope.pstructWS, $scope.profitStructWS);	// here I obtain an object with correct occupancy and profit data
		    
			if(showPs){
				for (var i = 0; i <  $scope.allDataStructWS.length; i++) {
			    	markers.push(createMarkers(i, $scope.allDataStructWS[i], 6));
			    }
			   	angular.copy(markers, $scope.parkingStructureMarkers);
			   	$scope.updateParkProfit();
			}
			if(showStreets){
				if(isFirst){
					$scope.updateStreetProfit(isFirst, $scope.dashboard_space.microzone_part);
				}
			}
			if(showArea){
		    	if(isFirst){
		    		$scope.updateAreaProfit(isFirst);
		    	}
		    }
			if(showZones){
				if(isFirst){
					$scope.updateZoneProfit(isFirst);
				}
			}
			if(showMicroZones){
				if(isFirst){
					$scope.updateMicroZoneProfit(isFirst);
				}
			}
			
			// ---- Init street area filter
			$scope.allAreaFilter = [];
			angular.copy(sharedDataService.getSharedLocalAreas(),$scope.allAreaFilter);
			if($scope.allAreaFilter != null && $scope.allAreaFilter.length > 0 && $scope.allAreaFilter[0].id != ''){
				$scope.allAreaFilter.splice(0,0,{id:'', name: "Tutte"});
			}
			$scope.streetAreaFilter = $scope.allAreaFilter[0].id;
			// ----------------------------
			
			//$scope.closeLoadingMap();
		});
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
		    if(cost_type == 1){ // case of occupancy cost
			    if(!isInList){
				    if(showStreets){
				    	$scope.updateStreetOccupancy($scope.streetWS);
					}
				    if(showZones){
				    	$scope.updateZoneOccupancy(false);
				    }
				    if(showMicroZones){
				    	$scope.updateMicroZoneOccupancy(false);
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
				    if(showZones){
				    	$scope.updateZoneTimeCost(false);
				    }
				    if(showMicroZones){
				    	$scope.updateMicroZoneTimeCost(false);
				    }
				    if(showArea){
				    	$scope.updateAreaTimeCost(false);
				    }
			    }
		    }
		    $scope.updateZonesOccupancyTimeCost();
		    $scope.updateMicroZonesOccupancyTimeCost();
	    	$scope.updateAreasOccupancyTimeCost();
	    	$scope.closeLoadingMap();
		});
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
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructures", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allParks);
		    //console.log("streets occupancy retrieved from db: " + JSON.stringify(result));
		    $scope.updateLoadingMapState();
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
			    	markers.push(createMarkers(i, allParks[i], 4));
			    }
			   	angular.copy(markers, $scope.parkingStructureMarkers);
			   	$scope.updateParkOccupancy();
			}
		    if(isFirst){
		    	$scope.getBikePointFromDb(isFirst);
		    }
		});
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
			
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancychanged/" + idApp + "/parkingstructures", params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, allParks);
		    //console.log("streets occupancy retrieved from db: " + JSON.stringify(result));
		    $scope.updateLoadingMapState();
		    
		    allParks = $scope.mergeParksObjects(allParks, oldParks);
		    $scope.actualParks = allParks;
		    $scope.pstructWS = allParks;
		    $scope.allDataStructWS = $scope.mergeParkDbData($scope.pstructWS, $scope.profitStructWS);	// here I obtain an object with correct occupancy and profit data
		    
			if(showPs){
			    for (var i = 0; i <  $scope.allDataStructWS.length; i++) {
				    markers.push(createMarkers(i, $scope.allDataStructWS[i], 4));
				}
			    angular.copy(markers, $scope.parkingStructureMarkers);
			    if(cost_type == 1){ // case of occuppancy cost
			    	$scope.updateParkOccupancy();
			    } else {			// case of time cost
			    	$scope.updateParkTimeCost();
			    }
			}
		    if(callType == 1){
		    	$scope.getBikePointFromDb(false);
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
					//if(cost_type == 2){
						timeCost = $scope.getExtratimeFromOccupancy(occupancyStructs[i].occupancyRate);
					//}
					var p = {
						id: occupancyStructs[i].id,
						id_app: occupancyStructs[i].id_app,
						name: occupancyStructs[i].name,
						streetReference: occupancyStructs[i].streetReference,
						managementMode: occupancyStructs[i].managementMode,
						manager: occupancyStructs[i].manager,
						fee_val: $scope.correctFeeData(occupancyStructs[i].fee_val),
						fee_note: occupancyStructs[i].fee_note,
						timeSlot: occupancyStructs[i].timeSlot,
						openingTime: occupancyStructs[i].openingTime,
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
						lastChange: profitStructs[j].lastChange,
						occupancyRate: occupancyStructs[i].occupancyRate,
						parkAndRide: profitStructs[j].parkAndRide,
						profit : profitStructs[j].profit,
						tickets : profitStructs[j].tickets,
						extratime: timeCost
					};
					mergedStructs.push(p);
				}
			}
		}
		return mergedStructs;
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
	
	// Method getStreetsInZoneProfit: used to retrieve the profit data from the streets that compose a zone
	$scope.getStreetsInZoneProfit = function(z_id){
		var totalProfit = 0;
		var totalTickets = 0;
		var streetsInZone = 0;
		var myPms = [];
		if($scope.profitStreets != null && $scope.profitStreets.length > 0){				// map page case
			for(var i = 0; i < $scope.profitStreets.length; i++){
				var found = false;
				// zone case
				for(var j = 0; (j < $scope.profitStreets[i].zones.length && !found); j++){ 
					if($scope.profitStreets[i].zones[j].id == z_id){
						found = true;
						streetsInZone += 1;
						if($scope.profitStreets[i].pms != null && $scope.profitStreets[i].pms.length > 0){
							for(var x = 0; x < $scope.profitStreets[i].pms.length; x++){
								if($scope.profitStreets[i].pms[x] != null){
									if(!$scope.checkIfAlreadyPresentInList(myPms, $scope.profitStreets[i].pms[x].id)){
										myPms.push($scope.profitStreets[i].pms[x].id);
									}
								}
							}
						}
					}
				}
				// microzone case
				if(!found && $scope.profitStreets[i].microzones != null){
					for(var j = 0; (j < $scope.profitStreets[i].microzones.length && !found); j++){ 
						if($scope.profitStreets[i].microzones[j].id == z_id){
							found = true;
							streetsInZone += 1;
							if($scope.profitStreets[i].pms != null && $scope.profitStreets[i].pms.length > 0){
								for(var x = 0; x < $scope.profitStreets[i].pms.length; x++){
									if($scope.profitStreets[i].pms[x] != null){
										if(!$scope.checkIfAlreadyPresentInList(myPms, $scope.profitStreets[i].pms[x].id)){
											myPms.push($scope.profitStreets[i].pms[x].id);
										}
									}
								}
							}
						}
					}
				}
			}
		} else if($scope.profitStreetsList != null && $scope.profitStreetsList.length > 0){	// list page case
			for(var i = 0; i < $scope.profitStreetsList.length; i++){
				var found = false;
				// zone case
				for(var j = 0; (j < $scope.profitStreetsList[i].zones.length && !found); j++){ 
					if($scope.profitStreetsList[i].zones[j] == z_id){
						found = true;
						streetsInZone += 1;
						if($scope.profitStreetsList[i].myPms != null && $scope.profitStreetsList[i].myPms.length > 0){
							for(var x = 0; x < $scope.profitStreetsList[i].myPms.length; x++){
								if($scope.profitStreetsList[i].myPms[x] != null){
									if(!$scope.checkIfAlreadyPresentInList(myPms, $scope.profitStreetsList[i].myPms[x].id)){
										myPms.push($scope.profitStreetsList[i].myPms[x].id);
									}
								}
							}
						}
					}
				}
				// microzone case
				if(!found && $scope.profitStreetsList[i].microzones != null){
					for(var j = 0; (j < $scope.profitStreetsList[i].microzones.length && !found); j++){ 
						if($scope.profitStreetsList[i].microzones[j] == z_id){
							found = true;
							streetsInZone += 1;
							if($scope.profitStreetsList[i].myPms != null && $scope.profitStreetsList[i].myPms.length > 0){
								for(var x = 0; x < $scope.profitStreetsList[i].myPms.length; x++){
									if($scope.profitStreetsList[i].myPms[x] != null){
										if(!$scope.checkIfAlreadyPresentInList(myPms, $scope.profitStreetsList[i].myPms[x].id)){
											myPms.push($scope.profitStreetsList[i].myPms[x].id);
										}
									}
								}
							}
						}
					}
				}
			}
		}
		if(myPms.length > 0){
			totalProfit = $scope.getTotalProfitFromPmList(myPms)[0];
			totalTickets = $scope.getTotalProfitFromPmList(myPms)[1];
		}
		if(totalProfit > 0){
			return [totalProfit, totalTickets, streetsInZone]; // / streetsInZone;
		} else {
			return [-1, -1, streetsInZone];
		}
	};
	
	// Method getTotalProfitFromPmList: used to retrieve the pms objects from the pm ids
	$scope.getTotalProfitFromPmList = function(list){
		var totalProfit = 0;
		var totalTickets = 0;
		for(var i = 0; i < list.length; i++){
			for(var j = 0; j < $scope.parkingMeterWS.length; j++){
				if(list[i] == $scope.parkingMeterWS[j].id){
					if($scope.parkingMeterWS[j].profit > 0){
						totalProfit += $scope.parkingMeterWS[j].profit;
					}
					if($scope.parkingMeterWS[j].tickets > 0){
						totalTickets += $scope.parkingMeterWS[j].tickets;
					}
				}
			}
		}
		return [totalProfit, totalTickets];
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
	
	$scope.getPMsInAreaProfit = function(a_id){
		var totalProfit = 0;
		var totalTickets = 0;
		var pmsInArea = 0;
		var noData = true;
		if($scope.parkingMeterWS != null && $scope.parkingMeterWS.length > 0){
			//var found = false;
			for(var i = 0; i < $scope.parkingMeterWS.length; i++){// && !found
				if($scope.parkingMeterWS[i].areaId == a_id){
					//found = true;
					pmsInArea += 1;
					if($scope.parkingMeterWS[i].profit > 0){
						totalProfit += $scope.parkingMeterWS[i].profit;
						noData = false;
					}
					if($scope.parkingMeterWS[i].tickets > 0){
						totalTickets += $scope.parkingMeterWS[i].tickets;
					}
				}
			}
		}
		if(pmsInArea != 0 && !noData){
			return [totalProfit, totalTickets, pmsInArea]; // / pmsInArea;
		} else {
			return [-1, -1, pmsInArea];
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
						totalSlots += (mystreet.slotNumber - mystreet.unusuableSlotNumber);
						occupiedSlots += tmp_occ;
					}
				}
			}
		}
		var occupation = (occupiedSlots == 0) ? -1 : Math.round((100 * occupiedSlots) / totalSlots);
		return [totalSlots, occupiedSlots, occupation];
	};
	
	// Method getPaidSlotsInZone: used to count the total slots of a zone from the slots in streets
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
					totalSlots += (mystreet.slotNumber - mystreet.unusuableSlotNumber);
					occupiedSlots += tmp_occ;
				}
			}
		}
		var occupation = (occupiedSlots == 0) ? -1 : Math.round((100 * occupiedSlots) / totalSlots);
		return [totalSlots, occupiedSlots, occupation];
	};
	
	// Method updateStreetOccupancy: update all street maps Object elements with new occupation data retrieved from db
	$scope.updateStreetOccupancy = function(streets){
		if($scope.dashboard_space.microzone_part){	// I check if the street check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapStreets.length == 0){
		   			$scope.mapStreets = $scope.initStreetsOnMap(streets, true, 1, false)[0];
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap(streets, true, 1, false)[0];
		   			$scope.switchStreetMapObject(3, tmpS, false);
		   		}
		   	} else {
		   		if($scope.occupancyStreets.length == 0){
		   			$scope.occupancyStreets = $scope.initStreetsOnMap(streets, true, 2, false)[0];
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap(streets, true, 2, false)[0];
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
		   			$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true, 1, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 1, false, firstTime)[0];
		   			$scope.switchZoneMapObject(3, tmpZ);
		   		}
		   	} else {
		   		if($scope.occupancyZones.length == 0){
		   			$scope.occupancyZones = $scope.initZonesOnMap($scope.zoneWS, true, 2, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 2, false, firstTime)[0];
		   	    	$scope.switchZoneMapObject(4, tmpZ);
		    	}
		    }
		}
	};
	
	// Method updateMicroZoneOccupancy: update all microzone maps Object elements with new occupation data retrieved from db
	$scope.updateMicroZoneOccupancy = function(firstTime){
		if($scope.dashboard_space.microzone){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapMicroZones.length == 0){
		   			$scope.mapMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, 1, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.microzoneWS, true, 1, false, firstTime)[0];
		   			$scope.switchMicroZoneMapObject(3, tmpZ);
		   		}
		   	} else {
		   		if($scope.occupancyMicroZones.length == 0){
		   			$scope.occupancyMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, 2, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.microzoneWS, true, 2, false, firstTime)[0];
		   	    	$scope.switchMicroZoneMapObject(4, tmpZ);
		    	}
		    }
		}
	};
	
	// Method updateAreaOccupancy: update all area maps Object elements with new occupation data retrieved from db
	$scope.updateAreaOccupancy = function(firstTime){
		if($scope.dashboard_space.rate_area){	// I check if the area check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapAreas.length == 0){
		   			$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime)[0];
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime)[0];
		   			$scope.switchAreaMapObject(3, tmpA);
		   		}
		   	} else {
		   		if($scope.occupancyAreas.length == 0){
		   			$scope.occupancyAreas = $scope.initAreasOnMap($scope.areaWS, true, 2, false, firstTime)[0];
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 2, false, firstTime)[0];
		   	    	$scope.switchAreaMapObject(4, tmpA);
		    	}
		    }
		}
	};
	
	// Method updateAreaTimeCost: update all area maps Object elements with new time cost data retrieved from occupation in db
	$scope.updateAreaTimeCost = function(firstTime){
		if($scope.dashboard_space.rate_area){	// I check if the area check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapAreas.length == 0){
		   			$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime)[0];
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime)[0];
		   			$scope.switchAreaMapObject(7, tmpA);
		   		}
		   	} else {
		   		if($scope.timeCostAreas.length == 0){
		   			$scope.timeCostAreas = $scope.initAreasOnMap($scope.areaWS, true, 4, false, firstTime)[0];
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 4, false, firstTime)[0];
		   	    	$scope.switchAreaMapObject(8, tmpA);
		    	}
		    }
		}
	};
	
	// Method updateParkOccupancy: update all parking structure maps Object elements with new occupation data retrieved from db
	$scope.updateParkOccupancy = function(){
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
	
	// Method updateParkTimeCost: update all parking structure maps Object elements with new time cost data retrieved from occupancy in db
	$scope.updateParkTimeCost = function(){
		if($scope.dashboard_space.parkingstructs){	// I check if the parkingstructures check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapParkingStructureMarkers.length == 0){
		   			$scope.mapParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
		   			$scope.switchParkingMapObject(7, tmpP);
		   		}
		   	} else {
		   		if($scope.timeCostParkingStructureMarkers.length == 0){
		   			$scope.timeCostParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 4);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 4);
		   	    	$scope.switchParkingMapObject(8, tmpP);
		    	}
		    }
		}
	};	
	
	// Method updateStreetProfit: update all street maps Object elements with new profit data retrieved from db
	$scope.updateStreetProfit = function(firstTime, show){
		$scope.profitStreetsList = $scope.initStreetsOnMap($scope.streetWS, show, 3, firstTime)[1];
		if($scope.dashboard_space.microzone_part && $scope.dashboard_topics_list != "receipts" && !firstTime){	// I check if the street check is selected
			if($scope.dashboard_topics == "parkSupply"){
				if($scope.mapStreets.length == 0){
			   		$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, show, 1, false)[0];
			   	} else {
			   		var tmpS = $scope.initStreetsOnMap($scope.streetWS, show, 1, false)[0];
			   		$scope.switchStreetMapObject(5, tmpS, false);
			   	}
			} else {
				if($scope.profitStreets.length == 0){
			   		$scope.profitStreets = $scope.initStreetsOnMap($scope.streetWS, show, 3, false)[0];
			   	} else {
			   		var tmpS = $scope.initStreetsOnMap($scope.streetWS, show, 3, false)[0];
			   		$scope.switchStreetMapObject(6, tmpS, false);
			    }
			}
		}
	};
	
	// Method updateZoneProfit: update all zone maps Object elements with new occupation data retrieved from db
	$scope.updateZoneProfit = function(firstTime){
		$scope.profitZonesList = $scope.initZonesOnMap($scope.zoneWS, true, 3, false, firstTime)[1];
		if($scope.dashboard_space.macrozone && $scope.dashboard_topics_list != "receipts"){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapZones.length == 0){
		   			$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true, 1, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 1, false, firstTime)[0];
		   			$scope.switchZoneMapObject(5, tmpZ);
		   		}
		   	} else {
		   		if($scope.profitZones.length == 0){
		   			$scope.profitZones = $scope.initZonesOnMap($scope.zoneWS, true, 3, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 3, false, firstTime)[0];
		   	    	$scope.switchZoneMapObject(6, tmpZ);
		    	}
		    }
		}
	};
	
	$scope.updateMicroZoneProfit = function(firstTime){
		$scope.profitMicroZonesList = $scope.initZonesOnMap($scope.microzoneWS, true, 3, false, firstTime)[1];
		if($scope.dashboard_space.microzone && $scope.dashboard_topics_list != "receipts"){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapMicroZones.length == 0){
		   			$scope.mapMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, 1, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.microzoneWS, true, 1, false, firstTime)[0];
		   			$scope.switchMicroZoneMapObject(5, tmpZ);
		   		}
		   	} else {
		   		if($scope.profitMicroZones.length == 0){
		   			$scope.profitMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, 3, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.microzoneWS, true, 3, false, firstTime)[0];
		   	    	$scope.switchMicroZoneMapObject(6, tmpZ);
		    	}
		    }
		}
	};
	
	// Method updateAreaOccupancy: update all area maps Object elements with new occupation data retrieved from db
	$scope.updateAreaProfit = function(firstTime){
		$scope.profitAreaList = $scope.initAreasOnMap($scope.areaWS, true, 3, false, firstTime)[1];
		if($scope.dashboard_space.rate_area && $scope.dashboard_topics_list != "receipts"){	// I check if the area check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapAreas.length == 0){
		   			$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime)[0];
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 1, false, firstTime)[0];
		   			$scope.switchAreaMapObject(5, tmpA);
		   		}
		   	} else {
		   		if($scope.profitAreas.length == 0){
		   			$scope.profitAreas = $scope.initAreasOnMap($scope.areaWS, true, 3, false, firstTime)[0];
		   		} else {
		   			var tmpA = $scope.initAreasOnMap($scope.areaWS, true, 3, false, firstTime)[0];
		   	    	$scope.switchAreaMapObject(6, tmpA);
		    	}
		    }
		}
	};
	
	// Method updateParkProfit: update all struct maps Object elements with new profit data retrieved from db
	$scope.updateParkProfit = function(){
		if($scope.dashboard_space.parkingstructs){	// I check if the parkingstructures check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapParkingStructureMarkers.length == 0){
		   			$scope.mapParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 1);
		   			$scope.switchParkingMapObject(5, tmpP);
		   		}
		   	} else {
		   		if($scope.profitParkingStructureMarkers.length == 0){
		   			$scope.profitParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 3);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true, 3);
		   	    	$scope.switchParkingMapObject(6, tmpP);
		    	}
		    }
		}
	};
	
	// Method updatePMProfit: update all parking meters maps Object elements with new profit data retrieved from db
	$scope.updatePMProfit = function(){
		if($scope.dashboard_space.parkingmeter){	// I check if the parkingstructures check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapParkingMetersMarkers.length == 0){
		   			$scope.mapParkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 0);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 0);
		   			$scope.switchPMMapObject(5, tmpP);
		   		}
		   	} else {
		   		if($scope.profitParkingMetersMarkers.length == 0){
		   			$scope.profitParkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 0);
		   		} else {
		   			var tmpP = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true, 0);
		   	    	$scope.switchPMMapObject(6, tmpP);
		    	}
		    }
		}
	};
	
	// Method updateStreetTimeCost: update all street maps Object elements with new time cost data retrieved from occupancy in db
	$scope.updateStreetTimeCost = function(streets){
		if($scope.dashboard_space.microzone_part){	// I check if the street check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapStreets.length == 0){
		   			$scope.mapStreets = $scope.initStreetsOnMap(streets, true, 1, false)[0];
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap(streets, true, 1, false)[0];
		   			$scope.switchStreetMapObject(7, tmpS, false);
		   		}
		   	} else {
		   		if($scope.timeCostStreets.length == 0){
		   			$scope.timeCostStreets = $scope.initStreetsOnMap(streets, true, 4, false)[0];
		   		} else {
		   			var tmpS = $scope.initStreetsOnMap(streets, true, 4, false)[0];
		   	    	$scope.switchStreetMapObject(8, tmpS, false);
		    	}
		    }
		}
	};
	
	// Method updateZoneTimeCost: update all zone maps Object elements with new time cost data retrieved from occupancy in db
	$scope.updateZoneTimeCost = function(firstTime){
		if($scope.dashboard_space.macrozone){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapZones.length == 0){
		   			$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true, 1, fals, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 1, false, firstTime)[0];
		   			$scope.switchZoneMapObject(7, tmpZ);
		   		}
		   	} else {
		   		if($scope.timeCostZones.length == 0){
		   			$scope.timeCostZones = $scope.initZonesOnMap($scope.zoneWS, true, 4, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.zoneWS, true, 4, false, firstTime)[0];
		   	    	$scope.switchZoneMapObject(8, tmpZ);
		    	}
		    }
		}
	};
	
	// Method updateMicroZoneTimeCost: update all zone maps Object elements with new time cost data retrieved from occupancy in db
	$scope.updateMicroZoneTimeCost = function(firstTime){
		if($scope.dashboard_space.microzone){	// I check if the zone check is selected
		    if($scope.dashboard_topics == "parkSupply"){
		   		if($scope.mapMicroZones.length == 0){
		   			$scope.mapMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, 1, fals, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.microzoneWS, true, 1, false, firstTime)[0];
		   			$scope.switchMicroZoneMapObject(7, tmpZ);
		   		}
		   	} else {
		   		if($scope.timeCostMicroZones.length == 0){
		   			$scope.timeCostMicroZones = $scope.initZonesOnMap($scope.microzoneWS, true, 4, false, firstTime)[0];
		   		} else {
		   			var tmpZ = $scope.initZonesOnMap($scope.microzoneWS, true, 4, false, firstTime)[0];
		   	    	$scope.switchMicroZoneMapObject(8, tmpZ);
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
		    $scope.getOccupancyParksFromDb(d.getFullYear(), d.getMonth(), null, "wd", hour, 1, true);
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
		   	$scope.getBikePointFromDb(false);
		});
	};
	
	$scope.getBikePointFromDb = function(isFirst){		
		var markers = [];
		var allBikePoints = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/bikepoint", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allBikePoints);
	    	//console.log("BikePoints retrieved from db: " + JSON.stringify(result));
	    	
	    	if(showBp){
	    		for (var i = 0; i <  allBikePoints.length; i++) {
		    		markers.push(createMarkers(i, allBikePoints[i], 3));
			    }
	    		angular.copy(markers, $scope.bikePointMarkers);
	    	}
	    	if(isFirst){
	    		//$scope.getZonesFromDb(isFirst, macrozoneType);
	    		//$scope.getZonesFromDb(isFirst, microzoneType);
	    		$scope.getProfitParksFromDb("", "1;12", "1,2,3,4,5,6,7", null, "0;23", 2, isFirst);
	    	}	
		});
	};
	
	$scope.getZonesFromDb = function(isFirst, type){
		$scope.zoneMapReady = false;
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, appId + "/zone/" + type, null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			angular.copy(result, allZones);
			//console.log("Zone retrieved from db: " + JSON.stringify(result));
		    if(type == macrozoneType){	
				$scope.zoneWS = $scope.correctMyZones(allZones);
			 	sharedDataService.setSharedLocalZones($scope.zoneWS);
			    if(showZones){
			    	$scope.initZonesOnMap($scope.zoneWS, false, 1, false, true);
			    }
		    } else {
		    	$scope.microzoneWS = $scope.correctMyZones(allZones);
			 	sharedDataService.setSharedLocalMicroZones($scope.microzoneWS);
			    if(showMicroZones){
			    	$scope.initZonesOnMap($scope.microzoneWS, false, 1, false, true);
			    }
		    }
		    //$scope.getStreetsFromDb();
		    //var d = new Date();
		    //var hour = "10;12";
		    //$scope.getOccupancyStreetsFromDb(d.getFullYear(), d.getMonth(), null, "wd", hour, 1, isFirst);
		    if(type == macrozoneType){
		    	$scope.getOccupancyStreetsFromDb("", "1;12", "1,2,3,4,5,6,7", "custom", "0;23", 2, isFirst);
		    }
		});
	};
	
	$scope.detailsOpened = false;
	$scope.mapParkingMetersSelectedMarkers = [];
	$scope.mapParkingStructureSelectedMarkers = [];
	$scope.mapSelectedStreets = [];
	$scope.mapSelectedZones = [];
	$scope.mapSelectedMicroZones = [];
	$scope.mapSelectedAreas = [];
	var pMDet = false;
	var pSDet = false;
	var streetDet = false;
	var zoneDet = false;
	var microZoneDet = false;
	var areaDet = false;
	
	$scope.showPMDet = function(){
		pMDet = true;
		pSDet = false;
		streetDet = false;
		zoneDet = false;
		microZoneDet = false;
		areaDet = false;
	};
	
	$scope.showPSDet = function(){
		pMDet = false;
		pSDet = true;
		streetDet = false;
		zoneDet = false;
		microZoneDet = false;
		areaDet = false;
	};
	
	$scope.showStreetDet = function(){
		pMDet = false;
		pSDet = false;
		streetDet = true;
		zoneDet = false;
		microZoneDet = false;
		areaDet = false;
	};
	
	$scope.showMicroZoneDet = function(){
		pMDet = false;
		pSDet = false;
		streetDet = false;
		microZoneDet = true;
		zoneDet = false;
		areaDet = false;
	};
	
	$scope.showZoneDet = function(){
		pMDet = false;
		pSDet = false;
		streetDet = false;
		microZoneDet = false;
		zoneDet = true;
		areaDet = false;
	};
	
	$scope.showAreaDet = function(){
		pMDet = false;
		pSDet = false;
		streetDet = false;
		microZoneDet = false;
		zoneDet = false;
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
	
	$scope.isZoneDetShow = function(){
		return zoneDet;
	};
	
	$scope.isAreaDetShow = function(){
		return areaDet;
	};
	
	$scope.isMicroZoneDetShow = function(){
		return microZoneDet;
	};	
	
	// Method show Details: used to show an object details when selected on map
	// params: - event (click on element in map);
	//		   - object: selected object;
	//	 	   - type: type of object: 1 pm, 2 ps, 3 street, 4 zone, 5 area, 6 microzone;
	//		   - theme: theme of the selection: 0 availability, 1 occupancy, 2 profit, 3 time cost;
	$scope.showDetails = function(event, object, type, theme){	
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
					myAreaPm = $scope.getLocalAreaById(object.data.areaId);
					object.icon = baseUrl+'/marker/'+company+'/parcometroneg/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
				} else if(theme == 2){
					var color = $scope.plainColor(object.myprofitColor);
					object.icon = baseUrl+'/marker/'+company+'/parcometroneg/'+((color != null && color != "") ? color : defaultMarkerColor);
				}
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
					$scope.initPsOccupancyDiagram(object, 1);
				}
				break;
			case 3:
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
			    	$scope.initStreetOccupancyDiagram(object, 1);
			    }
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
			    } else if(theme == 1){
			    	for(var i = 0; i < $scope.occupancyZones.length; i++){
				    	if($scope.occupancyZones[i].id == object.id){
				    		$scope.occupancyZones.splice(i, 1);
				    	}
				    }
			    } else if(theme == 2){
			    	for(var i = 0; i < $scope.profitZones.length; i++){
				    	if($scope.profitZones[i].id == object.id){
				    		$scope.profitZones.splice(i, 1);
				    	}
				    }
			    } else if(theme == 3){
			    	for(var i = 0; i < $scope.timeCostZones.length; i++){
				    	if($scope.timeCostZones[i].id == object.id){
				    		$scope.timeCostZones.splice(i, 1);
				    	}
				    }
			    }
			    $scope.mapSelectedZones.push(object);
			    $scope.showZoneDet();
				$scope.zDetails = object;
				if(theme == 1 || theme == 3){
					$scope.initZoneOccupancyDiagram(object, 1);	
				}
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
					$scope.initAreaOccupancyDiagram(object, 1);
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
							path: $scope.correctPoints(polyline.points),
							gpath: $scope.correctPointsGoogle(polyline.points),
							stroke: {
							    color: object.stroke.color,
							    weight: 4,
							    opacity: 1.0
							},
							data: object.data,
							info_windows_pos: $scope.correctPointGoogle(polyline.points[1]),
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
			    $scope.showMicroZoneDet();
				$scope.microZDetails = object;
				if(theme == 1 || theme == 3){
					$scope.initMicroZoneOccupancyDiagram(object, 1);	
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
	
	$scope.hideDetails = function(event, object, type){
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
			$scope.mapSelectedZones = [];
			var toDelZone = $scope.map.shapes;
	    	toDelZone[object.id].setMap(null);
	    	object.stroke.weight = 3;
	    	object.stroke.opacity = 0.7;
			object.fill.opacity = 0.5;
	    	if($scope.mapZones.length > 0){
	    		$scope.mapZones.push(object);
	    	} else if($scope.occupancyZones.length > 0){
	    		$scope.occupancyZones.push(object);
	    	} else if($scope.profitZones.length > 0){
	    		$scope.profitZones.push(object);
	    	} else if($scope.timeCostZones.length > 0){
	    		$scope.timeCostZones.push(object);
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
	    	} else if($scope.occupancyAreas.length > 0){
	    		$scope.occupancyAreas.push(object);
	    	} else if($scope.profitAreas.length > 0){
	    		$scope.profitAreas.push(object);
	    	} else if($scope.timeCostAreas.length > 0){
	    		$scope.timeCostAreas.push(object);
	    	}
			break;
		case 6:
			var subele = object.subelements;
			if(subele != null){
				for(var i = 0; i < subele.length; i++){
					var s = subele[i];
				//if(list.length > 0){
				//	var object = list[0];
					var toDelZone = $scope.map.shapes;
					var sid = "mz" + s.id;
			    	toDelZone[sid].setMap(null);
			    	
			    	var polyline = s.geometry;
					var mzone = {
							id: sid,
							path: $scope.correctPoints(polyline.points),
							gpath: $scope.correctPointsGoogle(polyline.points),
							stroke: {
							    color: object.stroke.color,
							    weight: 3,
							    opacity: 0.5
							},
							data: object.data,
							info_windows_pos: $scope.correctPointGoogle(polyline.points[1]),
							info_windows_cod: "z" + object.id,
							editable: true,
							draggable: true,
							geodesic: false,
							visible: true,
							subelements: object.subelements
					};
			    	
			    	if($scope.theme == 0){
			    		$scope.mapMicroZones.push(mzone);
			    	} else if($scope.theme == 1){
			    		$scope.occupancyMicroZones.push(mzone);
			    	} else if($scope.theme == 2){
			    		$scope.profitMicroZones.push(mzone);
			    	} else if($scope.theme == 3){
			    		$scope.timeCostMicroZones.push(mzone);
			    	}
				}
			}
			$scope.mapSelectedMicroZones = [];
//			$scope.mapSelectedMicroZones = [];
//			var toDelZone = $scope.map.shapes;
//	    	toDelZone[object.id].setMap(null);
//	    	object.stroke.weight = 3;
//	    	object.stroke.opacity = 0.6;
//	    	if($scope.mapMicroZones.length > 0){
//	    		$scope.mapMicroZones.push(object);
//	    	} else if($scope.occupancyMicroZones.length > 0){
//	    		$scope.occupancyMicroZones.push(object);
//	    	} else if($scope.profitMicroZones.length > 0){
//	    		$scope.profitMicroZones.push(object);
//	    	} else if($scope.timeCostMicroZones.length > 0){
//	    		$scope.timeCostMicroZones.push(object);
//	    	}
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

	$scope.showDetailsInList = function(object, type){
		switch(type){
			case 1:
				$scope.showPMDet();
				$scope.pmDetails = object;
				break;
			case 2:
				$scope.showPSDet();
				$scope.psDetails = object;
				//$scope.initPsOccupancyDiagram(object, 0);
				break;
			case 3:
			    $scope.showStreetDet();
				$scope.sDetails = object;
				$scope.initStreetParkSupplyDiagram(object, 2);
				break;
			case 4:
			    $scope.showZoneDet();
				$scope.zDetails = object;
				$scope.initZoneOccupancyDiagram(object, 2);
				break;
			case 5:
			    $scope.showAreaDet();
				$scope.aDetails = object;
				//$scope.initAreaOccupancyDiagram(object, 2);
				break;	
			case 6:
			    $scope.showMicroZoneDet();
				$scope.microZDetails = object;
				$scope.initMicroZoneOccupancyDiagram(object, 2);
				break;	
		};
		$scope.detailsOpened = true;
		return object;
	};	
	
	$scope.showOccupancyInList = function(object, type){
		$scope.showReportComparation = false;
		$scope.showCreatedCmpReport = false;
		switch(type){
			case 1:
				$scope.showPMDet();
				$scope.pmDetails = object;
				break;
			case 2:
				$scope.showPSDet();
				$scope.psDetails = object;
				$scope.initPsOccupancyDiagram(object, 0);
				$scope.showReportCompare("1", "2", 2, 1);	// 2 = ps, 1 = occupancy
				break;
			case 3:
			    $scope.showStreetDet();
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
			    $scope.initStreetOccupancyDiagram(object, 2);
			    // To show the historycal data
			    $scope.showReportCompare("1", "2", 3, 1);	// 3 = street, 1 = occupancy
				break;
			case 4:
			    $scope.showZoneDet();
				$scope.zDetails = object;
				$scope.initZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 5, 1);	// 5 = zone, 1 = occupancy
				break;
			case 5:
			    $scope.showAreaDet();
				$scope.aDetails = object;
				$scope.initAreaOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 4, 1);	// 4 = area, 1 = occupancy
				break;
			case 6:
			    $scope.showMicroZoneDet();
				$scope.microZDetails = object;
				$scope.initMicroZoneOccupancyDiagram(object, 2);
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
	
	$scope.showTimeCostInList = function(object, type){
		switch(type){
			case 1:
				$scope.showPMDet();
				$scope.pmDetails = object;
				break;
			case 2:
				$scope.showPSDet();
				$scope.psDetails = object;
				$scope.initPsOccupancyDiagram(object, 0);
				$scope.showReportCompare("1","2", 2, 3);	// 2 = ps, 3 = time cost
				break;
			case 3:
			    $scope.showStreetDet();
				$scope.sDetails = object;
			    $scope.initStreetOccupancyDiagram(object, 2);
			    $scope.showReportCompare("1","2", 3, 3);	// 3 = street, 3 = time cost
				break;
			case 4:
			    $scope.showZoneDet();
				$scope.zDetails = object;
				$scope.initZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1","2", 5, 3);	// 5 = zone, 3 = time cost
				break;
			case 5:
			    $scope.showAreaDet();
				$scope.aDetails = object;
				$scope.initAreaOccupancyDiagram(object, 2);
				$scope.showReportCompare("1","2", 4, 3);	// 4 = area, 3 = time cost
				break;	
			case 6:
			    $scope.showMicroZoneDet();
				$scope.microZDetails = object;
				$scope.initMicroZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1","2", 6, 3);	// 6 = microzone, 3 = time cost
				break;	
		};
		$scope.timeCostOpened = true;
		return object;
	};	
	
	
	$scope.showProfitInList = function(object, type){
		switch(type){
			case 1:
				$scope.showPMDet();
				$scope.pmDetails = object;
				// To show the historycal data
			    $scope.showReportCompare("1", "2", 1, 2);	// 1 = parking meters, 2 = profit
				break;
			case 2:
				$scope.showPSDet();
				$scope.psDetails = object;
				//$scope.initPsOccupancyDiagram(object, 0);
				$scope.showReportCompare("1", "2", 2, 2);	// 2 = parkingstructs, 2 = profit
				break;
			case 3:
			    $scope.showStreetDet();
				$scope.sDetails = object;
			    //$scope.initStreetOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 3, 2);	// 3 = street, 2 = profit
				break;
			case 4:
			    $scope.showZoneDet();
				$scope.zDetails = object;
				//$scope.initZoneOccupancyDiagram(object, 2);
				$scope.showReportCompare("1", "2", 5, 2);	// 5 = zone, 2 = profit
				break;
			case 5:
			    $scope.showAreaDet();
				$scope.aDetails = object;
				//$scope.initAreaOccupancyDiagram(object);
				$scope.showReportCompare("1", "2", 4, 2);	// 4 = area, 2 = profit
				break;
			case 6:
			    $scope.showMicroZoneDet();
				$scope.microZDetails = object;
				//$scope.initZoneOccupancyDiagram(object, 2);
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
		if($scope.mapSelectedZones.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedZones, 4, theme);
		}
		if($scope.mapSelectedAreas.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedAreas, 5, theme);
		}
		if($scope.mapSelectedMicroZones.length > 0){
			$scope.fixIfAlreadySelected($scope.mapSelectedMicroZones, 6, theme);
		}
	};
	
	$scope.closeAllDetailsList = function(){
		$scope.detailsOpened = false;
		$scope.occupancyOpened = false;
		$scope.profitOpened = false;
		$scope.timeCostOpened = false;
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
			if(list.length > 0){
				var object = list[0];
				var toDelZone = $scope.map.shapes;
		    	toDelZone[object.id].setMap(null);
		    	object.stroke.weight = 3;
		    	object.stroke.opacity = 0.7;
		    	object.fill.opacity = 0.5;
		    	if(theme == 0){
		    		$scope.mapZones.push(object);
		    	} else if(theme == 1){
		    		$scope.occupancyZones.push(object);
		    	} else if(theme == 2){
		    		$scope.profitZones.push(object);
		    	} else if(theme == 3){
		    		$scope.timeCostZones.push(object);
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
			for(var i = 0; i < list.length; i++){
				var object = list[i];				
			//if(list.length > 0){
			//	var object = list[0];
				var toDelZone = $scope.map.shapes;
				
		    	toDelZone[object.id].setMap(null);
		    	object.stroke.weight = 3;
		    	object.stroke.opacity = 0.5;
		    	if(theme == 0){
		    		$scope.mapMicroZones.push(object);
		    	} else if(theme == 1){
		    		$scope.occupancyMicroZones.push(object);
		    	} else if(theme == 2){
		    		$scope.profitMicroZones.push(object);
		    	} else if(theme == 3){
		    		$scope.timeCostMicroZones.push(object);
		    	}
			}
			$scope.mapSelectedMicroZones = [];
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
    		$scope.timeCostOpened = false;
			var toHideStreet = $scope.map.shapes;
			var object = {};
			angular.copy($scope.mapSelectedStreets[0], object);
			object.stroke.weight = 3;
			object.stroke.opacity = 0.7;
			if(type == 1 || type == 3){
				$scope.mapStreets.push(object);
			} else if(type == 2 || type == 4) {
				$scope.occupancyStreets.push(object);
			} else if(type == 5 || type == 6) {
				$scope.profitStreets.push(object);
			} else if(type == 7 || type == 8) {
				$scope.timeCostStreets.push(object);
			}
			toHideStreet[$scope.mapSelectedStreets[0].id].setMap(null);
			$scope.mapSelectedStreets = [];
		}
    	var toHideStreets = $scope.map.shapes;
    	switch(type){
    		case 1:	// from street/profit/timeCost to occupancy
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
    			} else if($scope.timeCostStreets.length > 0){
    				for(var i = 0; i < $scope.timeCostStreets.length; i++){
	    	    		toHideStreets[$scope.timeCostStreets[i].id].setMap(null);
	    	    		var object = $scope.timeCostStreets[i];
	    	    		object.stroke.color = $scope.getOccupancyColor(object.data.occupancyRate);	//averageOccupation1012
	    	    		$scope.occupancyStreets.push(object);
	    	    	}
	    	    	$scope.timeCostStreets = [];
    			}
    			$scope.showStreetPolylines(2);
    			break;
    		case 2: // from occupancy/profit/timeCost to street
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
    			} else if($scope.timeCostStreets.length > 0){
    				for(var i = 0; i < $scope.timeCostStreets.length; i++){
	    	    		toHideStreets[$scope.timeCostStreets[i].id].setMap(null);
	    	    		var object = $scope.timeCostStreets[i];
	    	    		object.stroke.color = $scope.correctColor(object.data.color);
	    	    		$scope.mapStreets.push(object);
	    	    	}
	    	    	$scope.timeCostStreets = [];
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
    		case 5: // from street/occupancy/timeCost to profit
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
    			} else if($scope.timeCostStreets.length > 0){
    				for(var i = 0; i < $scope.timeCostStreets.length; i++){
        	    		toHideStreets[$scope.timeCostStreets[i].id].setMap(null);
        	    		var object = $scope.timeCostStreets[i];
        	    		object.stroke.color = $scope.getProfitColor(object.data.profit);
        	    		$scope.profitStreets.push(object);
        	    	}
        	    	$scope.timeCostStreets = [];
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
    	    		object.stroke.color = $scope.getProfitColor(object.data.profit);		//profit data
    	    		tmpStreets.push(object);
    	    	}
    	    	angular.copy(tmpStreets, $scope.profitStreets);
    			break;
    		case 7: // from street/occupancy/profit to timeCost
    			if($scope.mapStreets.length > 0){
	    			for(var i = 0; i < $scope.mapStreets.length; i++){
	    	    		toHideStreets[$scope.mapStreets[i].id].setMap(null);
	    	    		var object = $scope.mapStreets[i];
	    	    		object.stroke.color = $scope.getTimeCostColor(object.data.extratime);	//averageOccupation1012
	    	    		object.visible = true;
	    	    		$scope.timeCostStreets.push(object);
	    	    	}
	    	    	$scope.mapStreets = [];
    			} else if($scope.occupancyStreets.length > 0){
    				for(var i = 0; i < $scope.occupancyStreets.length; i++){
        	    		toHideStreets[$scope.occupancyStreets[i].id].setMap(null);
        	    		var object = $scope.occupancyStreets[i];
        	    		object.stroke.color = $scope.getTimeCostColor(object.data.extratime);
        	    		object.visible = true;
        	    		$scope.timeCostStreets.push(object);
        	    	}
        	    	$scope.occupancyStreets = [];
    			} else if($scope.profitStreets.length > 0){
    				for(var i = 0; i < $scope.profitStreets.length; i++){
        	    		toHideStreets[$scope.profitStreets[i].id].setMap(null);
        	    		var object = $scope.profitStreets[i];
        	    		object.stroke.color = $scope.getTimeCostColor(object.data.extratime);
        	    		object.visible = true;
        	    		$scope.timeCostStreets.push(object);
        	    	}
        	    	$scope.profitStreets = [];
    			}
    			$scope.showStreetPolylines(4);
    			//if(firstTime){
    	    	//	$scope.hideStreetPolylines(3);
    	    	//}
    			break;
    		case 8: // from timeCost to timeCost
    			var tmpStreets = [];
    	    	for(var i = 0; i < $scope.timeCostStreets.length; i++){
    	    		toHideStreets[$scope.timeCostStreets[i].id].setMap(null);
    	    		var object = newList[i];
    	    		object.stroke.color = $scope.getTimeCostColor(object.data.extratime);	//time cost data
    	    		tmpStreets.push(object);
    	    	}
    	    	angular.copy(tmpStreets, $scope.timeCostStreets);
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
			} else if (type == 2 || type == 4){
				$scope.occupancyZones.push(object);
			} else if (type == 5 || type == 6){
				$scope.profitZones.push(object);
			} else if (type == 7 || type == 8){
				$scope.timeCostZones.push(object);
			}
			toHideZone[$scope.mapSelectedZones[0].id].setMap(null);
			$scope.mapSelectedZones = [];
		}
    	var toHideZones = $scope.map.shapes;
    	switch(type){
    		case 1: // from availability/profit/timeCost to occupancy
    			if($scope.mapZones != null && $scope.mapZones.length > 0){
	    			for(var i = 0; i < $scope.mapZones.length; i++){
	    	    		toHideZones[$scope.mapZones[i].id].setMap(null);
	    	    		var object = $scope.mapZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.mapZones[i].id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
	    	    		object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
	    	    		$scope.occupancyZones.push(object);
	    	    	}
	    			$scope.mapZones = [];
    			}
    			if($scope.profitZones != null && $scope.profitZones.length > 0){
	    			for(var i = 0; i < $scope.profitZones.length; i++){
	    	    		toHideZones[$scope.profitZones[i].id].setMap(null);
	    	    		var object = $scope.profitZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.profitZones[i].id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.profitZones[i].id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
	    	    		object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
	    	    		$scope.occupancyZones.push(object);
	    	    	}
	    			$scope.profitZones = [];
    			}
    			if($scope.timeCostZones != null && $scope.timeCostZones.length > 0){
	    			for(var i = 0; i < $scope.timeCostZones.length; i++){
	    	    		toHideZones[$scope.timeCostZones[i].id].setMap(null);
	    	    		var object = $scope.timeCostZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.timeCostZones[i].id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.timeCostZones[i].id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
	    	    		object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
	    	    		$scope.occupancyZones.push(object);
	    	    	}
	    			$scope.timeCostZones = [];
    			}
    			break;
    		case 2: // from occupancy/profit/timeCost to availability
    			if($scope.occupancyZones != null && $scope.occupancyZones.length > 0){
	    			for(var i = 0; i < $scope.occupancyZones.length; i++){
	    	    		toHideZones[$scope.occupancyZones[i].id].setMap(null);
	    	    		var object = $scope.occupancyZones[i];
	    	    		object.stroke.color = $scope.correctColor(object.data.color);
	    	    		$scope.mapZones.push(object);
	    	    	}
	    	    	$scope.occupancyZones = [];
    			}
    			if($scope.profitZones != null && $scope.profitZones.length > 0){
    				for(var i = 0; i < $scope.profitZones.length; i++){
        	    		toHideZones[$scope.profitZones[i].id].setMap(null);
        	    		var object = $scope.profitZones[i];
        	    		object.stroke.color = $scope.correctColor(object.data.color);
        	    		$scope.mapZones.push(object);
        	    	}
        	    	$scope.profitZones = [];
    			}
    			if($scope.timeCostZones != null && $scope.timeCostZones.length > 0){
    				for(var i = 0; i < $scope.timeCostZones.length; i++){
        	    		toHideZones[$scope.timeCostZones[i].id].setMap(null);
        	    		var object = $scope.timeCostZones[i];
        	    		object.stroke.color = $scope.correctColor(object.data.color);
        	    		$scope.mapZones.push(object);
        	    	}
        	    	$scope.timeCostZones = [];
    			}
    			break;
    		case 3: // from availability to availability
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.mapZones.length; i++){
    	    		toHideZones[$scope.mapZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		object.stroke.color = $scope.correctColor(object.data.color);
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.mapZones);
    			break;
    		case 4: // from occupancy to occupancy
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.occupancyZones.length; i++){
    	    		toHideZones[$scope.occupancyZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.occupancyZones[i].id);
    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.occupancyZones[i].id);
    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.occupancyZones[i].id);
    	    		if(zoneOccupancy != -1){
    	    			zoneOccupancy = slotsInZone[2];
    	    		}
    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
    	    		object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.occupancyZones);
    			break;
    		case 5: // from availability/occupancy/timeCost to profit
    			if($scope.mapZones != null && $scope.mapZones.length > 0){
	    			for(var i = 0; i < $scope.mapZones.length; i++){
	    	    		toHideZones[$scope.mapZones[i].id].setMap(null);
	    	    		var object = $scope.mapZones[i];
	    	    		var zoneProfit = $scope.getStreetsInZoneProfit($scope.mapZones[i].data.id);
	    	    		object.stroke.color = $scope.getProfitColor(zoneProfit[0]);	//Here I have to add the streets that compose the zone
	    	    		object.fill.color = $scope.getProfitColor(zoneProfit[0]);
	    	    		$scope.profitZones.push(object);
	    	    	}
	    			$scope.mapZones = [];
    			}
    			if($scope.occupancyZones != null && $scope.occupancyZones.length > 0){
	    			for(var i = 0; i < $scope.occupancyZones.length; i++){
	    	    		toHideZones[$scope.occupancyZones[i].id].setMap(null);
	    	    		var object = $scope.occupancyZones[i];
	    	    		var zoneProfit = $scope.getStreetsInZoneProfit($scope.occupancyZones[i].data.id);
	    	    		object.stroke.color = $scope.getProfitColor(zoneProfit[0]);	//Here I have to add the streets that compose the zone
	    	    		object.fill.color = $scope.getProfitColor(zoneProfit[0]);
	    	    		$scope.profitZones.push(object);
	    	    	}
	    			$scope.occupancyZones = [];
    			}
    			if($scope.timeCostZones != null && $scope.timeCostZones.length > 0){
	    			for(var i = 0; i < $scope.timeCostZones.length; i++){
	    	    		toHideZones[$scope.timeCostZones[i].id].setMap(null);
	    	    		var object = $scope.timeCostZones[i];
	    	    		var zoneProfit = $scope.getStreetsInZoneProfit($scope.timeCostZones[i].data.id);
	    	    		object.stroke.color = $scope.getProfitColor(zoneProfit[0]);	//Here I have to add the streets that compose the zone
	    	    		object.fill.color = $scope.getProfitColor(zoneProfit[0]);
	    	    		$scope.profitZones.push(object);
	    	    	}
	    			$scope.timeCostZones = [];
    			}
    			break;
    		case 6: // from profit to profit
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.profitZones.length; i++){
    	    		toHideZones[$scope.profitZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		//var zoneProfit = $scope.getStreetsInZoneProfit($scope.profitZones[i].id);
    	    		object.stroke.color = $scope.getProfitColor(object.data.profit);	//Here I have to add the streets that compose the zone
    	    		object.fill.color = $scope.getProfitColor(object.data.profit);
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.profitZones);
    			break;
    		case 7: // from availability/occupancy/profit to timeCost
    			if($scope.mapZones != null && $scope.mapZones.length > 0){
	    			for(var i = 0; i < $scope.mapZones.length; i++){
	    	    		toHideZones[$scope.mapZones[i].id].setMap(null);
	    	    		var object = $scope.mapZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.mapZones[i].id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
	    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);	//Here I have to add the streets that compose the zone
	    	    		object.fill.color = $scope.getTimeCostColor(timeCost);
	    	    		object.data.extratime = timeCost;
	    	    		$scope.timeCostZones.push(object);
	    	    	}
	    			$scope.mapZones = [];
    			}
    			if($scope.occupancyZones != null && $scope.occupancyZones.length > 0){
	    			for(var i = 0; i < $scope.occupancyZones.length; i++){
	    	    		toHideZones[$scope.occupancyZones[i].id].setMap(null);
	    	    		var object = $scope.occupancyZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.occupancyZones[i].id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.occupancyZones[i].id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
	    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);	//Here I have to add the streets that compose the zone
	    	    		object.fill.color = $scope.getTimeCostColor(timeCost);
	    	    		object.data.extratime = timeCost;
	    	    		$scope.timeCostZones.push(object);
	    	    	}
	    			$scope.occupancyZones = [];
    			}
    			if($scope.profitZones != null && $scope.profitZones.length > 0){
	    			for(var i = 0; i < $scope.profitZones.length; i++){
	    	    		toHideZones[$scope.profitZones[i].id].setMap(null);
	    	    		var object = $scope.profitZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.profitZones[i].id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.profitZones[i].id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
	    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);	//Here I have to add the streets that compose the zone
	    	    		object.fill.color = $scope.getTimeCostColor(timeCost);
	    	    		object.data.extratime = timeCost;
	    	    		$scope.timeCostZones.push(object);
	    	    	}
	    			$scope.profitZones = [];
    			}
    			break;
    		case 8: // from timeCost to timeCost
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.timeCostZones.length; i++){
    	    		toHideZones[$scope.timeCostZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.timeCostZones[i].id);
    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.occupancyZones[i].id);
    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.timeCostZones[i].id);
    	    		if(zoneOccupancy != -1){
    	    			zoneOccupancy = slotsInZone[2];
    	    		}
    				var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);	//Here I have to add the streets that compose the zone
    	    		object.fill.color = $scope.getTimeCostColor(timeCost);
    	    		object.data.extratime = timeCost;
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.timeCostZones);
    			break;	
    		default:break;
    	}
    };
    
    // Method switchMicroZoneMapObject: used to switch (in map) from zone object to occupancy-zone object
    $scope.switchMicroZoneMapObject = function(type, newList){
    	if($scope.mapSelectedMicroZones != null && $scope.mapSelectedMicroZones.length > 0){
    		$scope.detailsOpened = false;	// I close the details column
    		$scope.occupancyOpened = false;
    		$scope.profitOpened = false;
			var toHideZone = $scope.map.shapes;
			var object = {};
			angular.copy($scope.mapSelectedMicroZones[0], object);
			object.stroke.weight = 3;
			object.stroke.opacity = 1;
	    	//object.fill.opacity = 0.5;
			if(type == 1 || type == 3){
				$scope.mapMicroZones.push(object);
			} else if (type == 2 || type == 4){
				$scope.occupancyMicroZones.push(object);
			} else if (type == 5 || type == 6){
				$scope.profitMicroZones.push(object);
			} else if (type == 7 || type == 8){
				$scope.timeCostMicroZones.push(object);
			}
			toHideZone[$scope.mapSelectedMicroZones[0].id].setMap(null);
			$scope.mapSelectedMicroZones = [];
		}
    	var toHideZones = $scope.map.shapes;
    	switch(type){
    		case 1: // from availability/profit/timeCost to occupancy
    			if($scope.mapMicroZones != null && $scope.mapMicroZones.length > 0){
	    			for(var i = 0; i < $scope.mapMicroZones.length; i++){
	    	    		toHideZones[$scope.mapMicroZones[i].id].setMap(null);
	    	    		var object = $scope.mapMicroZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.mapMicroZones[i].data.id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.mapMicroZones[i].data.id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
	    	    		//object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
	    	    		$scope.occupancyMicroZones.push(object);
	    	    	}
	    			$scope.mapMicroZones = [];
    			}
    			if($scope.profitMicroZones != null && $scope.profitMicroZones.length > 0){
	    			for(var i = 0; i < $scope.profitMicroZones.length; i++){
	    	    		toHideZones[$scope.profitMicroZones[i].id].setMap(null);
	    	    		var object = $scope.profitMicroZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.profitMicroZones[i].data.id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.profitMicroZones[i].data.id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
	    	    		//object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
	    	    		$scope.occupancyMicroZones.push(object);
	    	    	}
	    			$scope.profitMicroZones = [];
    			}
    			if($scope.timeCostMicroZones != null && $scope.timeCostMicroZones.length > 0){
	    			for(var i = 0; i < $scope.timeCostMicroZones.length; i++){
	    	    		toHideZones[$scope.timeCostMicroZones[i].id].setMap(null);
	    	    		var object = $scope.timeCostMicroZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.timeCostMicroZones[i].data.id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.timeCostMicroZones[i].data.id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
	    	    		//object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
	    	    		$scope.occupancyMicroZones.push(object);
	    	    	}
	    			$scope.timeCostMicroZones = [];
    			}
    			break;
    		case 2: // from occupancy/profit/timeCost to availability
    			if($scope.occupancyMicroZones != null && $scope.occupancyMicroZones.length > 0){
	    			for(var i = 0; i < $scope.occupancyMicroZones.length; i++){
	    	    		toHideZones[$scope.occupancyMicroZones[i].id].setMap(null);
	    	    		var object = $scope.occupancyMicroZones[i];
	    	    		object.stroke.color = $scope.correctColor(object.data.color);
	    	    		$scope.mapZones.push(object);
	    	    	}
	    	    	$scope.occupancyMicroZones = [];
    			}
    			if($scope.profitMicroZones != null && $scope.profitMicroZones.length > 0){
    				for(var i = 0; i < $scope.profitMicroZones.length; i++){
        	    		toHideZones[$scope.profitMicroZones[i].id].setMap(null);
        	    		var object = $scope.profitMicroZones[i];
        	    		object.stroke.color = $scope.correctColor(object.data.color);
        	    		$scope.mapMicroZones.push(object);
        	    	}
        	    	$scope.profitMicroZones = [];
    			}
    			if($scope.timeCostMicroZones != null && $scope.timeCostMicroZones.length > 0){
    				for(var i = 0; i < $scope.timeCostMicroZones.length; i++){
        	    		toHideZones[$scope.timeCostMicroZones[i].id].setMap(null);
        	    		var object = $scope.timeCostMicroZones[i];
        	    		object.stroke.color = $scope.correctColor(object.data.color);
        	    		$scope.mapMicroZones.push(object);
        	    	}
        	    	$scope.timeCostMicroZones = [];
    			}
    			break;
    		case 3: // from availability to availability
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.mapMicroZones.length; i++){
    	    		toHideZones[$scope.mapMicroZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		object.stroke.color = $scope.correctColor(object.data.color);
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.mapMicroZones);
    			break;
    		case 4: // from occupancy to occupancy
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.occupancyMicroZones.length; i++){
    	    		toHideZones[$scope.occupancyMicroZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.occupancyMicroZones[i].data.id);
    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.occupancyZones[i].id);
    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.occupancyMicroZones[i].data.id);
    	    		if(zoneOccupancy != -1){
    	    			zoneOccupancy = slotsInZone[2];
    	    		}
    	    		object.stroke.color = $scope.getOccupancyColor(zoneOccupancy);	//Here I have to add the streets that compose the zone
    	    		//object.fill.color = $scope.getOccupancyColor(zoneOccupancy);
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.occupancyMicroZones);
    			break;
    		case 5: // from availability/occupancy/timeCost to profit
    			if($scope.mapMicroZones != null && $scope.mapMicroZones.length > 0){
	    			for(var i = 0; i < $scope.mapMicroZones.length; i++){
	    	    		toHideZones[$scope.mapMicroZones[i].id].setMap(null);
	    	    		var object = $scope.mapMicroZones[i];
	    	    		var zoneProfit = $scope.getStreetsInZoneProfit($scope.mapMicroZones[i].data.id);
	    	    		object.stroke.color = $scope.getProfitColor(zoneProfit[0]);	//Here I have to add the streets that compose the zone
	    	    		//object.fill.color = $scope.getProfitColor(zoneProfit[0]);
	    	    		$scope.profitMicroZones.push(object);
	    	    	}
	    			$scope.mapMicroZones = [];
    			}
    			if($scope.occupancyMicroZones != null && $scope.occupancyMicroZones.length > 0){
	    			for(var i = 0; i < $scope.occupancyMicroZones.length; i++){
	    	    		toHideZones[$scope.occupancyMicroZones[i].id].setMap(null);
	    	    		var object = $scope.occupancyMicroZones[i];
	    	    		var zoneProfit = $scope.getStreetsInZoneProfit($scope.occupancyMicroZones[i].data.id);
	    	    		object.stroke.color = $scope.getProfitColor(zoneProfit[0]);	//Here I have to add the streets that compose the zone
	    	    		//object.fill.color = $scope.getProfitColor(zoneProfit[0]);
	    	    		$scope.profitMicroZones.push(object);
	    	    	}
	    			$scope.occupancyMicroZones = [];
    			}
    			if($scope.timeCostMicroZones != null && $scope.timeCostMicroZones.length > 0){
	    			for(var i = 0; i < $scope.timeCostMicroZones.length; i++){
	    	    		toHideZones[$scope.timeCostMicroZones[i].id].setMap(null);
	    	    		var object = $scope.timeCostMicroZones[i];
	    	    		var zoneProfit = $scope.getStreetsInZoneProfit($scope.timeCostMicroZones[i].data.id);
	    	    		object.stroke.color = $scope.getProfitColor(zoneProfit[0]);	//Here I have to add the streets that compose the zone
	    	    		//object.fill.color = $scope.getProfitColor(zoneProfit[0]);
	    	    		$scope.profitMicroZones.push(object);
	    	    	}
	    			$scope.timeCostMicroZones = [];
    			}
    			break;
    		case 6: // from profit to profit
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.profitMicroZones.length; i++){
    	    		toHideZones[$scope.profitMicroZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		//var zoneProfit = $scope.getStreetsInZoneProfit($scope.profitZones[i].id);
    	    		object.stroke.color = $scope.getProfitColor(object.data.profit);	//Here I have to add the streets that compose the zone
    	    		//object.fill.color = $scope.getProfitColor(object.data.profit);
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.profitMicroZones);
    			break;
    		case 7: // from availability/occupancy/profit to timeCost
    			if($scope.mapMicroZones != null && $scope.mapMicroZones.length > 0){
	    			for(var i = 0; i < $scope.mapMicroZones.length; i++){
	    	    		toHideZones[$scope.mapMicroZones[i].id].setMap(null);
	    	    		var object = $scope.mapMicroZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.mapMicroZones[i].data.id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.mapMicroZones[i].data.id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
	    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);	//Here I have to add the streets that compose the zone
	    	    		//object.fill.color = $scope.getTimeCostColor(timeCost);
	    	    		object.data.extratime = timeCost;
	    	    		$scope.timeCostMicroZones.push(object);
	    	    	}
	    			$scope.mapMicroZones = [];
    			}
    			if($scope.occupancyMicroZones != null && $scope.occupancyMicroZones.length > 0){
	    			for(var i = 0; i < $scope.occupancyMicroZones.length; i++){
	    	    		toHideZones[$scope.occupancyMicroZones[i].id].setMap(null);
	    	    		var object = $scope.occupancyMicroZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.occupancyMicroZones[i].data.id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.occupancyMicroZones[i].data.id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
	    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);	//Here I have to add the streets that compose the zone
	    	    		//object.fill.color = $scope.getTimeCostColor(timeCost);
	    	    		object.data.extratime = timeCost;
	    	    		$scope.timeCostMicroZones.push(object);
	    	    	}
	    			$scope.occupancyMicroZones = [];
    			}
    			if($scope.profitMicroZones != null && $scope.profitMicroZones.length > 0){
	    			for(var i = 0; i < $scope.profitMicroZones.length; i++){
	    	    		toHideZones[$scope.profitMicroZones[i].id].setMap(null);
	    	    		var object = $scope.profitMicroZones[i];
	    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.profitMicroZones[i].data.id);
	    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.mapZones[i].id);
	    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
	    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.profitMicroZones[i].data.id);
	    	    		if(zoneOccupancy != -1){
	    	    			zoneOccupancy = slotsInZone[2];
	    	    		}
	    	    		var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
	    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);	//Here I have to add the streets that compose the zone
	    	    		//object.fill.color = $scope.getTimeCostColor(timeCost);
	    	    		object.data.extratime = timeCost;
	    	    		$scope.timeCostMicroZones.push(object);
	    	    	}
	    			$scope.profitMicroZones = [];
    			}
    			break;
    		case 8: // from timeCost to timeCost
    			var tmpZones = [];
    	    	for(var i = 0; i < $scope.timeCostMicroZones.length; i++){
    	    		toHideZones[$scope.timeCostMicroZones[i].id].setMap(null);
    	    		var object = newList[i];
    	    		var slotsInZone = $scope.getTotalSlotsInZone($scope.timeCostMicroZones[i].data.id);
    	    		object.data.slotNumber = slotsInZone[0]; //$scope.getTotalSlotsInZone($scope.occupancyZones[i].id);
    	    		object.data.slotOccupied = slotsInZone[1]; //Math.round(object.data.slotNumber * zoneOccupancy / 100);
    	    		var zoneOccupancy = $scope.getStreetsInZoneOccupancy($scope.timeCostMicroZones[i].data.id);
    	    		if(zoneOccupancy != -1){
    	    			zoneOccupancy = slotsInZone[2];
    	    		}
    				var timeCost = $scope.getExtratimeFromOccupancy(zoneOccupancy);
    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);	//Here I have to add the streets that compose the zone
    	    		//object.fill.color = $scope.getTimeCostColor(timeCost);
    	    		object.data.extratime = timeCost;
    	    		tmpZones.push(object);
    	    	}
    	    	angular.copy(tmpZones, $scope.timeCostMicroZones);
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
			} else if(type == 2 || type == 4){
				$scope.occupancyAreas.push(object);
			} else if(type == 5 || type == 6){
				$scope.profitAreas.push(object);
			} else if(type == 7 || type == 8){
				$scope.profitAreas.push(object);
			}
			toHideArea[$scope.mapSelectedAreas[0].id].setMap(null);
			$scope.mapSelectedAreas = [];
		}
    	switch(type){
    		case 1: // from availability/profit/timeCost to occupancy
    			if($scope.mapAreas != null && $scope.mapAreas.length > 0){
	    			for(var i = 0; i < $scope.mapAreas.length; i++){
	    	    		toHideAreas[$scope.mapAreas[i].id].setMap(null);
	    	    		var object = $scope.mapAreas[i];
	    	    		var myAreaId = $scope.cleanAreaId($scope.mapAreas[i].id);
	    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
	    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
	    	    		if(areaOccupancy != -1){
	    	    			areaOccupancy = slotsInArea[2];
	    	    		}
	    	    		object.stroke.color = $scope.getOccupancyColor(areaOccupancy);	//Here I have to add the streets that compose the area
	    	    		object.fill.color = $scope.getOccupancyColor(areaOccupancy);
	    	    		$scope.occupancyAreas.push(object);
	    	    	}
	    	    	$scope.mapAreas = [];
    			}
    			if($scope.profitAreas != null && $scope.profitAreas.length > 0){
	    			for(var i = 0; i < $scope.profitAreas.length; i++){
	    	    		toHideAreas[$scope.profitAreas[i].id].setMap(null);
	    	    		var object = $scope.profitAreas[i];
	    	    		var myAreaId = $scope.cleanAreaId($scope.profitAreas[i].id);
	    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
	    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
	    	    		if(areaOccupancy != -1){
	    	    			areaOccupancy = slotsInArea[2];
	    	    		}
	    	    		object.stroke.color = $scope.getOccupancyColor(areaOccupancy);	//Here I have to add the streets that compose the area
	    	    		object.fill.color = $scope.getOccupancyColor(areaOccupancy);
	    	    		$scope.occupancyAreas.push(object);
	    	    	}
	    	    	$scope.profitAreas = [];
    			}
    			if($scope.timeCostAreas != null && $scope.timeCostAreas.length > 0){
	    			for(var i = 0; i < $scope.timeCostAreas.length; i++){
	    	    		toHideAreas[$scope.timeCostAreas[i].id].setMap(null);
	    	    		var object = $scope.timeCostAreas[i];
	    	    		var myAreaId = $scope.cleanAreaId($scope.timeCostAreas[i].id);
	    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
	    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
	    	    		if(areaOccupancy != -1){
	    	    			areaOccupancy = slotsInArea[2];
	    	    		}
	    	    		object.stroke.color = $scope.getOccupancyColor(areaOccupancy);	//Here I have to add the streets that compose the area
	    	    		object.fill.color = $scope.getOccupancyColor(areaOccupancy);
	    	    		$scope.occupancyAreas.push(object);
	    	    	}
	    	    	$scope.timeCostAreas = [];
    			}
    			break;
    		case 2: // from occupancy/profit/timeCost to availability
    			if($scope.occupancyAreas != null && $scope.occupancyAreas.length > 0){
    				for(var i = 0; i < $scope.occupancyAreas.length; i++){
    					toHideAreas[$scope.occupancyAreas[i].id].setMap(null);
    					var object = $scope.occupancyAreas[i];
    					object.stroke.color = $scope.correctColor(object.data.color);
    					object.fill.color = $scope.correctColor(object.data.color);
    					$scope.mapAreas.push(object);
    				}
    				$scope.occupancyAreas = [];
    			}
    			if($scope.profitAreas != null && $scope.profitAreas.length > 0){
    				for(var i = 0; i < $scope.profitAreas.length; i++){
    					toHideAreas[$scope.profitAreas[i].id].setMap(null);
    					var object = $scope.profitAreas[i];
    					object.stroke.color = $scope.correctColor(object.data.color);
    					object.fill.color = $scope.correctColor(object.data.color);
    					$scope.mapAreas.push(object);
    				}
    				$scope.profitAreas = [];
    			}
    			if($scope.timeCostAreas != null && $scope.timeCostAreas.length > 0){
    				for(var i = 0; i < $scope.timeCostAreas.length; i++){
    					toHideAreas[$scope.timeCostAreas[i].id].setMap(null);
    					var object = $scope.timeCostAreas[i];
    					object.stroke.color = $scope.correctColor(object.data.color);
    					object.fill.color = $scope.correctColor(object.data.color);
    					$scope.mapAreas.push(object);
    				}
    				$scope.timeCostAreas = [];
    			}
    			break;
    		case 3: // from availability to availability
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
    		case 4: // from occupancy to occupancy
    			var tmpAreas = [];
    	    	for(var i = 0; i < $scope.occupancyAreas.length; i++){
    	    		toHideAreas[$scope.occupancyAreas[i].id].setMap(null);
    	    		var object = newList[i];
    	    		var myAreaId = $scope.cleanAreaId($scope.occupancyAreas[i].id);
    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
    	    		if(areaOccupancy == -1){
    	    			areaOccupancy = slotsInArea[2];
    	    		}
    	    		object.stroke.color = $scope.getOccupancyColor(areaOccupancy);	//Here I have to add the streets that compose the area
    	    		object.fill.color = $scope.getOccupancyColor(areaOccupancy);
    	    		tmpAreas.push(object);
    	    	}
    	    	angular.copy(tmpAreas, $scope.occupancyAreas);
    			break;
    		case 5: // from availability/occupancy/timeCost to profit
    			if($scope.mapAreas != null && $scope.mapAreas.length > 0){
	    			for(var i = 0; i < $scope.mapAreas.length; i++){
	    	    		toHideAreas[$scope.mapAreas[i].id].setMap(null);
	    	    		var object = $scope.mapAreas[i];
	    	    		var myAreaId = $scope.cleanAreaId($scope.mapAreas[i].id);
	    	    		var areaProfit = $scope.getPMsInAreaProfit(myAreaId);
	    	    		object.stroke.color = $scope.getProfitColor(areaProfit[0]);	//Here I have to add the streets that compose the area
	    	    		object.fill.color = $scope.getProfitColor(areaProfit[0]);
	    	    		$scope.profitAreas.push(object);
	    	    	}
	    	    	$scope.mapAreas = [];
    			}
    			if($scope.occupancyAreas != null && $scope.occupancyAreas.length > 0){
    				for(var i = 0; i < $scope.occupancyAreas.length; i++){
	    	    		toHideAreas[$scope.occupancyAreas[i].id].setMap(null);
	    	    		var object = $scope.occupancyAreas[i];
	    	    		var myAreaId = $scope.cleanAreaId($scope.occupancyAreas[i].id);
	    	    		var areaProfit = $scope.getPMsInAreaProfit(myAreaId);
	    	    		object.stroke.color = $scope.getProfitColor(areaProfit[0]);	//Here I have to add the streets that compose the area
	    	    		object.fill.color = $scope.getProfitColor(areaProfit[0]);
	    	    		$scope.profitAreas.push(object);
	    	    	}
	    	    	$scope.occupancyAreas = [];
    			}
    			if($scope.timeCostAreas != null && $scope.timeCostAreas.length > 0){
    				for(var i = 0; i < $scope.timeCostAreas.length; i++){
	    	    		toHideAreas[$scope.timeCostAreas[i].id].setMap(null);
	    	    		var object = $scope.timeCostAreas[i];
	    	    		var myAreaId = $scope.cleanAreaId($scope.timeCostAreas[i].id);
	    	    		var areaProfit = $scope.getPMsInAreaProfit(myAreaId);
	    	    		object.stroke.color = $scope.getProfitColor(areaProfit[0]);	//Here I have to add the streets that compose the area
	    	    		object.fill.color = $scope.getProfitColor(areaProfit[0]);
	    	    		$scope.profitAreas.push(object);
	    	    	}
	    	    	$scope.timeCostAreas = [];
    			}
    			break;
    		case 6: // from profit to profit
    			var tmpAreas = [];
    	    	for(var i = 0; i < $scope.profitAreas.length; i++){
    	    		toHideAreas[$scope.profitAreas[i].id].setMap(null);
    	    		var object = newList[i];
    	    		//var myAreaId = $scope.cleanAreaId($scope.profitAreas[i].id);
    	    		//var areaProfit = $scope.getPMsInAreaProfit(myAreaId);
    	    		object.stroke.color = $scope.getProfitColor(object.data.profit);	//Here I have to add the streets that compose the area
    	    		object.fill.color = $scope.getProfitColor(object.data.profit);
    	    		tmpAreas.push(object);
    	    	}
    	    	angular.copy(tmpAreas, $scope.profitAreas);
    			break;
    		case 7: // from availability/occupancy/profit to timeCost
    			if($scope.mapAreas != null && $scope.mapAreas.length > 0){
	    			for(var i = 0; i < $scope.mapAreas.length; i++){
	    	    		toHideAreas[$scope.mapAreas[i].id].setMap(null);
	    	    		var object = $scope.mapAreas[i];
	    	    		var myAreaId = $scope.cleanAreaId($scope.mapAreas[i].id);
	    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
	    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
	    	    		if(areaOccupancy != -1){
	    	    			areaOccupancy = slotsInArea[2];
	    	    		}
	    	    		var timeCost = $scope.getExtratimeFromOccupancy(areaOccupancy);
	    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);
	    	    		object.fill.color = $scope.getTimeCostColor(timeCost);
	    	    		object.data.extratime = timeCost;
	    	    		$scope.occupancyAreas.push(object);
	    	    	}
	    	    	$scope.mapAreas = [];
    			}
    			if($scope.profitAreas != null && $scope.profitAreas.length > 0){
	    			for(var i = 0; i < $scope.profitAreas.length; i++){
	    	    		toHideAreas[$scope.profitAreas[i].id].setMap(null);
	    	    		var object = $scope.profitAreas[i];
	    	    		var myAreaId = $scope.cleanAreaId($scope.profitAreas[i].id);
	    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
	    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
	    	    		if(areaOccupancy != -1){
	    	    			areaOccupancy = slotsInArea[2];
	    	    		}
	    	    		var timeCost = $scope.getExtratimeFromOccupancy(areaOccupancy);
	    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);
	    	    		object.fill.color = $scope.getTimeCostColor(timeCost);
	    	    		object.data.extratime = timeCost;
	    	    		$scope.occupancyAreas.push(object);
	    	    	}
	    	    	$scope.profitAreas = [];
    			}
    			if($scope.timeCostAreas != null && $scope.timeCostAreas.length > 0){
	    			for(var i = 0; i < $scope.timeCostAreas.length; i++){
	    	    		toHideAreas[$scope.timeCostAreas[i].id].setMap(null);
	    	    		var object = $scope.timeCostAreas[i];
	    	    		var myAreaId = $scope.cleanAreaId($scope.timeCostAreas[i].id);
	    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
	    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
	    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
	    	    		if(areaOccupancy != -1){
	    	    			areaOccupancy = slotsInArea[2];
	    	    		}
	    	    		var timeCost = $scope.getExtratimeFromOccupancy(areaOccupancy);
	    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);
	    	    		object.fill.color = $scope.getTimeCostColor(timeCost);
	    	    		object.data.extratime = timeCost;
	    	    		$scope.occupancyAreas.push(object);
	    	    	}
	    	    	$scope.timeCostAreas = [];
    			}
    			break;
    		case 8: // from timeCost to timeCost
    			var tmpAreas = [];
    	    	for(var i = 0; i < $scope.timeCostAreas.length; i++){
    	    		toHideAreas[$scope.timeCostAreas[i].id].setMap(null);
    	    		var object = newList[i];
    	    		var myAreaId = $scope.cleanAreaId($scope.timeCostAreas[i].id);
    	    		var slotsInArea = $scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotNumber = slotsInArea[0]; //$scope.getTotalSlotsInArea(myAreaId);
    	    		object.data.slotOccupied = slotsInArea[1]; //Math.round(object.data.slotNumber * areaOccupancy / 100);
    	    		var areaOccupancy = $scope.getStreetsInAreaOccupancy(myAreaId);
    	    		if(areaOccupancy != -1){
    	    			areaOccupancy = slotsInArea[2];
    	    		}
    	    		var timeCost = $scope.getExtratimeFromOccupancy(areaOccupancy);
    	    		object.stroke.color = $scope.getTimeCostColor(timeCost);
    	    		object.fill.color = $scope.getTimeCostColor(timeCost);
    	    		object.data.extratime = timeCost;
    	    		tmpAreas.push(object);
    	    	}
    	    	angular.copy(tmpAreas, $scope.timeCostAreas);
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
    		} else if(type == 2 || type == 4) {
    			$scope.occupancyParkingStructureMarkers.push(object);
    		} else if(type == 5 || type == 6) {
    			$scope.profitParkingStructureMarkers.push(object);
    		} else if(type == 7 || type == 8) {
    			$scope.timeCostParkingStructureMarkers.push(object);
    		}
			$scope.mapParkingStructureSelectedMarkers = [];
		}
    	switch(type){
    		case 1: // from availability/profit/timeCost to occupancy
    			if($scope.mapParkingStructureMarkers != null && $scope.mapParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.mapParkingStructureMarkers.length; i++){
	    	    		var myIcon = $scope.getOccupancyIcon($scope.mapParkingStructureMarkers[i].data.occupancyRate, 2);
	    	    		var object = $scope.mapParkingStructureMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.occupancyParkingStructureMarkers.push(object);
	    	    	};
	    	    	$scope.mapParkingStructureMarkers = [];
    			}
    			if($scope.profitParkingStructureMarkers != null && $scope.profitParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.profitParkingStructureMarkers.length; i++){
	    	    		var myIcon = $scope.getOccupancyIcon($scope.profitParkingStructureMarkers[i].data.occupancyRate, 2);
	    	    		var object = $scope.profitParkingStructureMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.occupancyParkingStructureMarkers.push(object);
	    	    	};
	    	    	$scope.profitParkingStructureMarkers = [];
    			}
    			if($scope.timeCostParkingStructureMarkers != null && $scope.timeCostParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.timeCostParkingStructureMarkers.length; i++){
	    	    		var myIcon = $scope.getOccupancyIcon($scope.timeCostParkingStructureMarkers[i].data.occupancyRate, 2);
	    	    		var object = $scope.timeCostParkingStructureMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.occupancyParkingStructureMarkers.push(object);
	    	    	};
	    	    	$scope.timeCostParkingStructureMarkers = [];
    			}
    			break;
    		case 2: // from occupancy/profit/timeCost to availability
    			if($scope.occupancyParkingStructureMarkers != null && $scope.occupancyParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
	    	    		var object = $scope.occupancyParkingStructureMarkers[i];
	    	    		object.icon = $scope.psMarkerIcon;
	    	    		$scope.mapParkingStructureMarkers.push(object);
	    	    	};
	    	    	$scope.occupancyParkingStructureMarkers = [];
    			}
    			if($scope.profitParkingStructureMarkers != null && $scope.profitParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.profitParkingStructureMarkers.length; i++){
	    	    		var object = $scope.profitParkingStructureMarkers[i];
	    	    		object.icon = $scope.psMarkerIcon;
	    	    		$scope.mapParkingStructureMarkers.push(object);
	    	    	};
	    	    	$scope.profitParkingStructureMarkers = [];
    			}
    			if($scope.timeCostParkingStructureMarkers != null && $scope.timeCostParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.timeCostParkingStructureMarkers.length; i++){
	    	    		var object = $scope.timeCostParkingStructureMarkers[i];
	    	    		object.icon = $scope.psMarkerIcon;
	    	    		$scope.mapParkingStructureMarkers.push(object);
	    	    	};
	    	    	$scope.timeCostParkingStructureMarkers = [];
    			}
    			break;
    		case 3: // from availability to availability
    	    	for(var i = 0; i < newList.length; i++){
    	    		$scope.mapParkingStructureMarkers[i].icon = $scope.psMarkerIcon;
    	    	}
    			break;
    		case 4: // from occupancy to occupancy
    	    	for(var i = 0; i <  newList.length; i++){
    	    		var myIcon = $scope.getOccupancyIcon(newList[i].data.occupancyRate, 2);
    	    		$scope.occupancyParkingStructureMarkers[i].icon = myIcon;
    	    	}
    			break;
    		case 5: // from availability/occupancy/timeCost to profit
    			if($scope.mapParkingStructureMarkers != null && $scope.mapParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.mapParkingStructureMarkers.length; i++){
	    	    		var myIcon = $scope.getProfitIcon($scope.mapParkingStructureMarkers[i].data.profit, 2);
	    	    		var object = $scope.mapParkingStructureMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.profitParkingStructureMarkers.push(object);
	    	    	}
	    	    	$scope.mapParkingStructureMarkers = [];
    			}
    			if($scope.occupancyParkingStructureMarkers != null && $scope.occupancyParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
	    	    		var myIcon = $scope.getProfitIcon($scope.occupancyParkingStructureMarkers[i].data.profit, 2);
	    	    		var object = $scope.occupancyParkingStructureMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.profitParkingStructureMarkers.push(object);
	    	    	}
	    	    	$scope.occupancyParkingStructureMarkers = [];
    			}
    			if($scope.timeCostParkingStructureMarkers != null && $scope.timeCostParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.timeCostParkingStructureMarkers.length; i++){
	    	    		var myIcon = $scope.getProfitIcon($scope.timeCostParkingStructureMarkers[i].data.profit, 2);
	    	    		var object = $scope.timeCostParkingStructureMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.profitParkingStructureMarkers.push(object);
	    	    	}
	    	    	$scope.timeCostParkingStructureMarkers = [];
    			}
    			break;
    		case 6: // from profit to profit
    			for(var i = 0; i <  newList.length; i++){
    	    		var myIcon = $scope.getProfitIcon(newList[i].data.profit, 2);
    	    		$scope.profitParkingStructureMarkers[i].icon = myIcon;
    	    	}
    			break;
    		case 7: // from availability/occupancy/profit to timeCost 
    			if($scope.mapParkingStructureMarkers != null && $scope.mapParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.mapParkingStructureMarkers.length; i++){
	    				var timeCost = $scope.getExtratimeFromOccupancy($scope.mapParkingStructureMarkers[i].data.occupancyRate);
		    			var myIcon = $scope.getTimeCostIcon(timeCost, 2);
	    	    		var object = $scope.mapParkingStructureMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.timeCostParkingStructureMarkers.push(object);
	    	    	};
	    	    	$scope.mapParkingStructureMarkers = [];
    			}
    			if($scope.profitParkingStructureMarkers != null && $scope.profitParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.profitParkingStructureMarkers.length; i++){
	    				var timeCost = $scope.getExtratimeFromOccupancy($scope.profitParkingStructureMarkers[i].data.occupancyRate);
		    			var myIcon = $scope.getTimeCostIcon(timeCost, 2);
	    	    		var object = $scope.profitParkingStructureMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.timeCostParkingStructureMarkers.push(object);
	    	    	};
	    	    	$scope.profitParkingStructureMarkers = [];
    			}
    			if($scope.occupancyParkingStructureMarkers != null && $scope.occupancyParkingStructureMarkers.length > 0){
	    			for (var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
	    				var timeCost = $scope.getExtratimeFromOccupancy($scope.occupancyParkingStructureMarkers[i].data.occupancyRate);
		    			var myIcon = $scope.getTimeCostIcon(timeCost, 2);
	    	    		var object = $scope.occupancyParkingStructureMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.timeCostParkingStructureMarkers.push(object);
	    	    	};
	    	    	$scope.occupancyParkingStructureMarkers = [];
    			}
    			break;
    		case 8: // from timeCost to timeCost
    	    	for(var i = 0; i <  newList.length; i++){
    	    		var myIcon = $scope.getTimeCostIcon(newList[i].data.extratime, 2);
    	    		$scope.timeCostParkingStructureMarkers[i].icon = myIcon;
    	    	}
    			break;	
    		default:
    			break;
    	}
    	
    };
    
    // Method switchPMMapObject: used to switch (in map) from pm object to profit-pm object
    $scope.switchPMMapObject = function(type, newList){
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
		var myAreaPm = "";
		var myIcon = "";
    	if($scope.mapParkingMetersSelectedMarkers != null && $scope.mapParkingMetersSelectedMarkers.length > 0){
    		$scope.detailsOpened = false;	// I close the details column
    		$scope.occupancyOpened = false;
    		$scope.profitOpened = false;
    		var object = $scope.mapParkingMetersSelectedMarkers[0];
    		object.options.animation = "";
    		if(type == 1 || type == 3){
    			$scope.mapParkingMetersMarkers.push(object);
    		} else if(type == 2 || type == 4) {
    			//$scope.occupancyParkingMetersMarkers.push(object);
    		} else if(type == 5 || type == 6) {
    			$scope.profitParkingMetersMarkers.push(object);
    		}
			$scope.mapParkingMetersSelectedMarkers = [];
		}
    	switch(type){
    		case 1: // from availability/profit to occupancy
    			// occupancy non used for parkingmeters
    			break;
    		case 2: // from occupancy/profit to availability
    			if($scope.profitParkingMetersMarkers != null && $scope.profitParkingMetersMarkers.length > 0){
	    			for (var i = 0; i < $scope.profitParkingMetersMarkers.length; i++){
	    	    		var object = $scope.profitParkingMetersMarkers[i];
	    	    		
	    	    		myAreaPm = $scope.getLocalAreaById(object.data.areaId);
	    				myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
	    	    		
	    	    		object.icon = myIcon;
	    	    		$scope.mapParkingMetersMarkers.push(object);
	    	    	};
	    	    	$scope.profitParkingMetersMarkers = [];
    			}
    			break;
    		case 3: // from availability to availability
    	    	for(var i = 0; i < newList.length; i++){
    	    		$scope.mapParkingMetersMarkers[i].icon = newList[i].data.icon;
    	    	}
    			break;
    		case 4: // from occupancy to occupancy
    	    	// occupancy not used for parkingmeters
    			break;
    		case 5: // from availability/occupancy to profit
    			if($scope.mapParkingMetersMarkers != null && $scope.mapParkingMetersMarkers.length > 0){
	    			for (var i = 0; i < $scope.mapParkingMetersMarkers.length; i++){
	    	    		var myIcon = $scope.getProfitIcon($scope.mapParkingMetersMarkers[i].data.profit, 1);
	    	    		var object = $scope.mapParkingMetersMarkers[i];
	    	    		object.icon = myIcon;
	    	    		$scope.profitParkingMetersMarkers.push(object);
	    	    	}
	    	    	$scope.mapParkingMetersMarkers = [];
    			}
    			break;
    		case 6: // from profit to profit
    			for(var i = 0; i <  newList.length; i++){
    	    		var myIcon = $scope.getProfitIcon(newList[i].data.profit, 1);
    	    		$scope.profitParkingMetersMarkers[i].icon = myIcon;
    	    	}
    			break;	
    		default:
    			break;
    	}
    	
    };
    
    $scope.getProfitColor = function(value){
    	if(value == -1){
    		return $scope.lightgray;
    	} else {
	    	if(value < 100000){
	    		return $scope.lightgreen;
	    	} else if(value < 200000){
	    		return $scope.green;
	    	} else if(value < 500000){
	    		return $scope.orange;
	    	} else if(value < 1000000){
	    		return $scope.violet;
	    	} else {
	    		return $scope.blue;
	    	}
    	}
    };
    
    $scope.getTimeCostColor = function(value){
    	if(value == null || value.extratime_estimation_max == null){
    		return $scope.lightgray;
    	} else {
	    	if(value.extratime_estimation_max == 0){
	    		return $scope.lightgreen;
	    	} else if(value.extratime_estimation_max == 1){
	    		return $scope.green;
	    	} else if(value.extratime_estimation_max == 3){
	    		return $scope.yellow;
	    	} else if(value.extratime_estimation_max == 5){
	    		return $scope.orange;
	    	} else if(value.extratime_estimation_max == 10){
	    		return $scope.red;
	    	} else if(value.extratime_estimation_max == 15){
	    		return $scope.violet;
	    	}
    	}
    };
    
    // Method getProfitIcon: retrieve the correct profit icon with the color of the profit value passed in input (for type pm and ps)
    $scope.getProfitIcon = function(value, type){
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
    		color = $scope.getProfitColor(value);
			image_url = baseUrl+'/marker/'+company+'/parcometro/'+$scope.plainColor(color);
    	} else if(type == 2){ 	// corrected profit icon for parkingstructures
	    	if(value == -1){
	    		//image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_np.png";
	    		image_url = "imgs/structIcons/parking_structures_gray_outline.png";
	    	} else if(value < 100){
	    		image_url = "imgs/structIcons/parking_structures_green_outline.png";
	    	} else if(value < 500){
	    		image_url = "imgs/structIcons/parking_structures_yellow_outline.png";
	    	} else if(value < 1000){
				image_url = "imgs/structIcons/parking_structures_violet_outline.png";
	    	} else {
				//image_url = "imgs/markerIcons/ps_occupancy/parcheggioStruttura_violet.png";
				image_url = "imgs/structIcons/parking_structures_general_outline.png";
	    	}
    	}
    	return image_url;
    };
    
    // Method getTimeCostIcon: retrieve the correct time cost icon with the color of the extratime value passed in input (for type ps)
    $scope.getTimeCostIcon = function(value, type){
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
    
    $scope.getTimeCostColor = function(value){
    	if(value == null || value.extratime_estimation_max == null){
    		return $scope.lightgray;
    	} else {
	    	if(value.extratime_estimation_max == 0){
	    		return $scope.lightgreen;
	    	} else if(value.extratime_estimation_max == 1){
	    		return $scope.green;
	    	} else if(value.extratime_estimation_max == 3){
	    		return $scope.yellow;
	    	} else if(value.extratime_estimation_max == 5){
	    		return $scope.orange;
	    	} else if(value.extratime_estimation_max == 10){
	    		return $scope.red;
	    	} else if(value.extratime_estimation_max == 15){
	    		return $scope.violet;
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
    
    // Method getProfitIcon: retrieve the correct occupancy icon with the color of the occupancy value passed in input (for type ps)
    $scope.getOccupancyIcon = function(value, type){
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
    
    // ---------------------------------------------- Start block Utilization diagrams --------------------------------------
    $scope.initAllDiagrams = function(){
    	$scope.chartPsOccupancy.data = [["Posti", "num"]];
    	$scope.chartStreetParkAvailability.data = [["Posti", "number"]];
    	$scope.chartStreetOccupancy.data = [["Posti", "number"]];
      	$scope.chartStreetFreeParkAvailability.data = [["Posti liberi", "number"]];
      	$scope.chartStreetOccupiedParkComposition.data = [["Posti occupati", "number"]];
      	$scope.chartZoneOccupancy.data = [["Posti", "num"]];
      	$scope.chartAreaOccupancy.data = [["Posti", "num"]];
    };
    
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
  		var available = object.slotNumber;
  		var occ = parseInt(object.payingSlotOccupied) + parseInt(object.handicappedSlotOccupied);
  		if(object.unusuableSlotNumber != -1){
  			available -= object.unusuableSlotNumber;
  		}
  		var dataTot = [ "Liberi", available - occ ];
  		var dataOcc = [ "Occupati", occ ];
  		$scope.chartPsOccupancy.data.push(dataTot);
  		$scope.chartPsOccupancy.data.push(dataOcc);
  	//}
  		$scope.chartPsOccupancy.options.title = "Posti occupati in struttura";
    };
    
    $scope.chartStreetParkAvailability = $scope.chart = {
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
    
    $scope.initStreetParkSupplyDiagram = function(street, type){
      	$scope.chartStreetParkAvailability.data = [["Posti", "number"]];
      	var object = null;
      	if(type == 1){
      		object = street.data;
      	} else {
      		object = street;
      	}
    	// for slot composition
    	var freeFree = [ "Gratuiti", object.freeParkSlotNumber ];
    	var freeFreeSigned = [ "Gratuiti (segnalati)", object.freeParkSlotSignNumber ];
    	var freePaid = [ "A pagamento", object.paidSlotNumber ];
    	var freeTimed = [ "Disco Orario", object.timedParkSlotNumber ];
    	var freeHandicapped = [ "Per disabili", object.handicappedSlotNumber ];
    	var freeReserved = [ "Riservati", object.reservedSlotNumber ];
    	$scope.chartStreetParkAvailability.data.push(freeFree);
    	$scope.chartStreetParkAvailability.data.push(freeFreeSigned);
    	$scope.chartStreetParkAvailability.data.push(freePaid);
    	$scope.chartStreetParkAvailability.data.push(freeTimed);
    	$scope.chartStreetParkAvailability.data.push(freeHandicapped);
    	$scope.chartStreetParkAvailability.data.push(freeReserved);
    	$scope.chartStreetParkAvailability.options.title = "Composizione posti";	
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
    	var dataTot = [ "Liberi", object.slotNumber - object.unusuableSlotNumber - object.slotOccupied ];
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
    	$scope.chartStreetOccupiedParkComposition.options.title = "Posti occupati in sottovia";
    	
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
    
    $scope.chartMicroZoneOccupancy = $scope.chart = {
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
    
    $scope.initMicroZoneOccupancyDiagram = function(zone, type){
    	$scope.chartMicroZoneOccupancy.data = [["Posti", "num"]];
  	//for(var i = 0; i < $scope.occupancyParkingStructureMarkers.length; i++){
    	var object;
    	if(type == 1){
    		object = zone.data;
    	} else {
    		object = zone;
    	}
  		var dataTot = [ "Liberi", object.slotNumber - object.slotOccupied ];
  		var dataOcc = [ "Occupati", object.slotOccupied ];
  		$scope.chartMicroZoneOccupancy.data.push(dataTot);
  		$scope.chartMicroZoneOccupancy.data.push(dataOcc);
  	//}
  		$scope.chartMicroZoneOccupancy.options.title = "Posti occupati in via";
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
		var value = JSON.stringify($scope.streetWS);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/street/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetSupplyCvsFile = result;
	    	window.location.href = $scope.streetSupplyCvsFile;
	    });	
	};
	
	$scope.getPMSupplyCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.parkingMeterWS);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/parkingmeter/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.pmSupplyCvsFile = result;
	    	window.location.href = $scope.pmSupplyCvsFile;
	    });	
	};
	
	$scope.getZoneSupplyCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.zoneWS);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/zone/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneSupplyCvsFile = result;
	    	window.location.href = $scope.zoneSupplyCvsFile;
	    });	
	};
	
	$scope.getAreaSupplyCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.areaWS);
		
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "supply/area/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaSupplyCvsFile = result;
	    	window.location.href = $scope.areaSupplyCvsFile;
	    });	
	};
	
	$scope.getStructureSupplyCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.pstructWS);
		
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
		//var appId = sharedDataService.getConfAppId();
		var value = JSON.stringify($scope.streetWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/street/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetCvsFile = result;
	    	window.location.href = $scope.streetCvsFile;
	    });	
	};
	
	$scope.getZoneOccupancyCsv = function(){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var value = JSON.stringify($scope.zoneWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/zone/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneCvsFile = result;
	    	window.location.href = $scope.zoneCvsFile;
	    });	
	};
	
	$scope.getAreaOccupancyCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.areaWS);
	    console.log("Area list data : " + value);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/area/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaCvsFile = result;
	    	window.location.href = $scope.areaCvsFile;
	    });	
	};
	
	$scope.getStructureOccupancyCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.pstructWS);
	    console.log("Structure list data : " + value);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/parkingstructures/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.structCvsFile = result;
//	    	$scope.structCvsFileName = result.substring(4, result.length);
	    	window.location.href = $scope.structCvsFile;
	    });	
	};
	// --------------------------------------------- End of block for occupancy CSV creation ----------------------------------------
	
	// -------------------------------------------------- Block for profit CSV creation ---------------------------------------------
	$scope.getStreetProfitCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.profitStreetsList);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/street/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetProfitCvsFile = result;
	    	window.location.href = $scope.streetProfitCvsFile;
	    });	
	};
	
	$scope.getPMProfitCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.parkingMeterWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/parkingmeter/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.pmProfitCvsFile = result;
	    	window.location.href = $scope.pmProfitCvsFile;
	    });	
	};
	
	$scope.getZoneProfitCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.profitZonesList);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/zone/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneProfitCvsFile = result;
	    	window.location.href = $scope.zoneProfitCvsFile;
	    });	
	};
	
	$scope.getAreaProfitCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.profitAreaList);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/area/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaProfitCvsFile = result;
	    	window.location.href = $scope.areaProfitCvsFile;
	    });	
	};
	
	$scope.getStructureProfitCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.profitStructWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
		var value = JSON.stringify($scope.streetWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/street/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.streetTimeCostCvsFile = result;
	    	window.location.href = $scope.streetTimeCostCvsFile;
	    });	
	};
	
	$scope.getZoneTimeCostCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.zoneWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/zone/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.zoneTimeCostCvsFile = result;
	    	window.location.href = $scope.zoneTimeCostCvsFile;
	    });	
	};
	
	$scope.getAreaTimeCostCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.areaWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeDashboardWSService.getProxy(method, "timeCost/area/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	if($scope.showLogs)console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.areaTimeCostCvsFile = result;
	    	window.location.href = $scope.areaTimeCostCvsFile;
	    });	
	};
	
	$scope.getStructureTimeCostCsv = function(){
		var method = 'POST';
		var value = JSON.stringify($scope.allDataStructWS);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
	$scope.matrixMicroZoneOcc = [];
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
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
				darea_fee: dArea.fee,
				darea_totalslot: dArea.slotNumber
		};
		var value = JSON.stringify($scope.matrixAreaOcc);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
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
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/zonecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixMicroZoneOcc);
		    console.log("microzone occupancy history retrieved from db: " + JSON.stringify(result));
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
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
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
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
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
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
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
			if($scope.showLogs)console.log("area profit history retrieved from db: " + JSON.stringify(result));
		});
	};
	
	// Area historycal profit csv data
	$scope.getProfitAreaHistoryCsv = function(dArea){
		var method = 'POST';
		var params = {
				darea_name: dArea.name,
				darea_fee: dArea.fee,
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "profit/" + idApp + "/zonecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
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
			console.log("microzone profit history retrieved from db: " + JSON.stringify(result));
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
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
		    console.log("street profit history retrieved from db: " + JSON.stringify(result));
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
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
		    console.log("parking profit history retrieved from db: " + JSON.stringify(result));
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
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
		    		$scope.matrixAreaTimeCost[i][j] = $scope.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
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
				darea_fee: dArea.fee,
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
		    		$scope.matrixZoneTimeCost[i][j] = $scope.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
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
		    		$scope.matrixMicroZoneTimeCost[i][j] = $scope.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/streetcompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixTimeCost);
		    for(var i = 1; i < result.length; i++){
		    	for(var j = 1; j < result[i].length; j++){
		    		$scope.matrixTimeCost[i][j] = $scope.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
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
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
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
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeDashboardWSService.getProxy(method, "occupancy/" + idApp + "/parkingstructurecompare/" + id, params, $scope.authHeaders, null);
		myDataPromise.then(function(result){
		    angular.copy(result, $scope.matrixTimeCost);
		    for(var i = 1; i < result.length; i++){
		    	for(var j = 1; j < result[i].length; j++){
		    		$scope.matrixTimeCost[i][j] = $scope.getExtratimeFromOccupancyForHistorycalTable(Number(result[i][j]));
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