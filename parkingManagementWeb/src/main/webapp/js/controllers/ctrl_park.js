'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('ParkCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$route', '$location', '$dialogs', 'sharedDataService', '$filter', 'initializeService','gMapService','areaService', 'streetService', 'zoneService', 'structureService', 'parkingMeterService', 'bikePointService', 'getMyMessages','$timeout',
                   function($scope, $http, $routeParams, $rootScope, $route, $location, $dialogs, sharedDataService, $filter, initializeService, gMapService, areaService, streetService, zoneService, structureService, parkingMeterService, bikePointService, getMyMessages, $timeout) { 
	this.$scope = $rootScope;
    $scope.params = $routeParams;
    $scope.showLog = true;
    $scope.showLogDates = false;
    $scope.showDialogsSucc = false;
    
    $scope.maxAreas = 8;
    $scope.maxStreets = 8;
    $scope.maxPmeters = 9;
    $scope.maxPStructs = 8;
    $scope.maxZones = 12;
    $scope.maxMicroZones = 8;
    $scope.maxBPoints = 11;
    
    $scope.dayMON = "MO";
    $scope.dayTUE = "TU";
    $scope.dayWED = "WE";
    $scope.dayTHU = "TH";
    $scope.dayFRI = "FR";
    $scope.daySAT = "SA";
    $scope.daySUN = "SU";
    
    // DB type for zone
    var zoneTabList = [];
    
    // Variable declaration (without this in ie the edit/view features do not work)
    $scope.eStreet = {};
    $scope.area = {};
    $scope.parckingMeter = {};
    $scope.parkingStructure = {};
    $scope.zone = {};
    $scope.microzone = {};
    $scope.bikePoint = {};
    $scope.myGeometry = "";
	$scope.myLineGeometry = null;
	$scope.myNewLineGeometry = null;
	$scope.myPolGeometry = "";
	$scope.myNewPolGeometry = null;
    
    $scope.openingPeriods = [];
    $scope.timePeriod = {};
    
    $scope.multiSelSettings = {displayProp: 'name'-'submacro'};
    
    $scope.authHeaders = {
        'Accept': 'application/json;charset=UTF-8'
    };
    
    // Regex
    $scope.gpsPos = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/;
    $scope.onlyNumbers = /^\d+$/;
    $scope.decimalNumbers = /^([0-9]+)[\,]{0,1}[0-9]{0,2}$/;
    $scope.datePatternIt=/^\d{1,2}\/\d{1,2}\/\d{4}$/;
    $scope.dateDDMMPatternIt=/^\d{1,2}\/\d{1,2}$/;
    $scope.datePattern=/^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/i;
    $scope.datePattern2=/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/i;
    $scope.datePattern3=/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/i;
    $scope.timePattern=/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
    $scope.periodPattern=/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d) - (?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)?([\s])?([\/])?([\s])?(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)?([\s])?([-])?([\s])?(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
    $scope.phonePattern=/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;

    $scope.logout = function() {
    	// Clear some session variables
    	sharedDataService.setName(null);
        sharedDataService.setSurname(null);
        sharedDataService.setBase64(null);
        $scope.user_token = null;
        
    	window.location.href = "logout";
    };
    
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
    	startingDay: 1,
        showWeeks: 'false',
        maxMode: 'month',
        datepickerMode:'month'
    };

    $scope.initDate = new Date();
    $scope.formats = ['shortDate', 'dd/MM/yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'dd/MM'];
    $scope.format = $scope.formats[5];
    
    $scope.getPlaceHolder = function(){
	    var local_placeholder = '';
    	if(sharedDataService.getUsedLanguage() == 'ita'){
	    	local_placeholder = "gg/MM";
	    } else if(sharedDataService.getUsedLanguage() == 'eng'){
	    	local_placeholder = "dd/MM";
	    }
    	return local_placeholder;
    };
            
    $scope.tabIndex = 0;
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
    
    // ----------------------- Block to read conf params and show/hide elements -----------------------
    var showArea = false;
    var showStreets = false;
    var showPm = false;
    var showPs = false;
    var showZones = false;
    //var showMicroZones = false;
    var showBp = false;
    
    // Methods to show/hide street area filter
    $scope.showAreaFilter = function(){
    	$scope.showAreaStreetFilter = true;
    };
    
    $scope.hideAreaFilter = function(){
    	$scope.streetAreaFilter = '';
    	$scope.showAreaStreetFilter = false;
    };
    
    // Methods to show/hide pm area filter
    $scope.showPmAreaFilter = function(){
    	$scope.showAreaPmFilter = true;
    };
    
    $scope.hidePmAreaFilter = function(){
    	$scope.pmAreaFilter = '';
    	$scope.showAreaPmFilter = false;
    };
    
    // Methods to show/hide pm status filter
    $scope.showPmStatusFilter = function(){
    	$scope.showStatusPmFilter = true;
    };
    
    $scope.hidePmStatusFilter = function(){
    	//$scope.pmStatusFilter = '';
    	$scope.showStatusPmFilter = false;
    };
    
    // Methods to show/hide street name filter
    $scope.showStreetNameFilter = function(){
    	$scope.showStreetFilter = true;
    };
    
    $scope.hideStreetNameFilter = function(){
    	$scope.showStreetFilter = false;
    };
    
    // Methods to show/hide zone name filter
    $scope.showZoneNameFilter = function(){
    	$scope.showZoneFilter = true;
    };
    
    $scope.hideZoneNameFilter = function(){
    	$scope.showZoneFilter = false;
    };
    
    // Methods to show/hide area name filter
    $scope.showAreaNameFilter = function(){
    	$scope.showAreaNFilter = true;
    };
    
    $scope.hideAreaNameFilter = function(){
    	$scope.showAreaNFilter = false;
    };
    
    // Methods to show/hide area agency filter
    $scope.showAgencyAFilter = function(){
    	$scope.showAgencyAreaFilter = true;
    };
    
    $scope.hideAgencyAFilter = function(){
    	$scope.showAgencyAreaFilter = false;
    };
    
    // Methods to show/hide zone agency filter
    $scope.showAgencyZFilter = function(){
    	$scope.showAgencyZoneFilter = true;
    };
    
    $scope.hideAgencyZFilter = function(){
    	$scope.showAgencyZoneFilter = false;
    };
    
    // Methods to show/hide street agency filter
    $scope.showAgencySFilter = function(){
    	$scope.showAgencyStreetFilter = true;
    };
    
    $scope.hideAgencySFilter = function(){
    	$scope.showAgencyStreetFilter = false;
    };
    
    // Methods to show/hide struct agency filter
    $scope.showAgencyPSFilter = function(){
    	$scope.showAgencyPStructFilter = true;
    };
    
    $scope.hideAgencyPSFilter = function(){
    	$scope.showAgencyPStructFilter = false;
    };
    
    // Methods to show/hide parkingmeter agency filter
    $scope.showAgencyPMFilter = function(){
    	$scope.showAgencyPMeterFilter = true;
    };
    
    $scope.hideAgencyPMFilter = function(){
    	$scope.showAgencyPMeterFilter = false;
    };
    
    // Methods to show/hide bikepoint agency filter
    $scope.showAgencyBPFilter = function(){
    	$scope.showAgencyBPointFilter = true;
    };
    
    $scope.hideAgencyBPFilter = function(){
    	$scope.showAgencyBPointFilter = false;
    };
    
    // Methods to show/hide ps name filter
    $scope.showPsNameFilter = function(){
    	$scope.showPsFilter = true;
    };
    
    $scope.hidePsNameFilter = function(){
    	$scope.showPsFilter = false;
    };
    
    // Methods to show/hide bp name filter
    $scope.showBpNameFilter = function(){
    	$scope.showBpFilter = true;
    };
    
    $scope.hideBpNameFilter = function(){
    	$scope.showBpFilter = false;
    };
    
    // Methods to show/hide note filter
    $scope.showNoteFilter = function(){
    	$scope.showNotFilter = true;
    };
    
    $scope.hideNoteFilter = function(){
    	$scope.showNotFilter = false;
    };
    
    $scope.checkStatusClass = function(status){
    	if(status == 'ACTIVE'){
    		return "success";
    	} else {
    		return "danger";
    	}
    };
    
    $scope.errorTimePeriodStructure = false;
    $scope.setErrorsPeriodTimeOverlap = function(value){
    	$scope.errorTimePeriodStructure = value;
    };
    
    $scope.isErrorsPeriodTimeOverlap = function(){
    	return $scope.errorTimePeriodStructure;
    };
    
    $scope.errorTimeFromToStructure = false;
    $scope.setErrorsPeriodTimeFromTo = function(value){
    	$scope.errorTimeFromToStructure = value;
    };
    
    $scope.isErrorsPeriodTimeFromTo = function(){
    	return $scope.errorTimeFromToStructure;
    };
    
    $scope.manageVehicleTypes = function(type){
    	var corrConfigurationType = initializeService.getSlotConfigurationByType(type);
    	return corrConfigurationType;
    };
    
    $scope.showHideSlotsByVehicle = function(type, type_s_ps){
    	if(type){
    		$scope.showErrorTypeReq = false;
    		if(type_s_ps == 0){
    			$scope.newVSC = $scope.manageVehicleTypes(type);
    		} else {
    			$scope.newVSC = $scope.manageVehicleTypesPs(type);
    		}
    	}
    };
    
    $scope.manageVehicleTypesPs = function(type){
    	var corrConfigurationType = initializeService.getSlotConfigurationByTypePs(type);
    	return corrConfigurationType;
    };
    
    // Method used to translate the vehicle type in the correct i18n key
    $scope.getVehicleKey = function(car_type){
    	var corr_type_key = "car_vehicle";
    	var vehicleTypes = initializeService.getSlotsTypes();
    	for(var i = 0; i < vehicleTypes.length; i++){
    		if(vehicleTypes[i].name == car_type){
    			corr_type_key = vehicleTypes[i].language_key;
    		}
    	}
    	return corr_type_key;
    };
    
    $scope.showVehicleSlotsPanel = function(index){
    	vehicleTypesList[index].show = true;
    };
    
    $scope.hideVehicleSlotsPanel = function(index){
    	vehicleTypesList[index].show = false;
    };
    
    $scope.vehicle_slots_panel_showed = function(index){
    	return vehicleTypesList[index].show;
    };
    
    $scope.showVehicleSlotsPanelNew = function(){
    	vehicleTypesNew = true;
    };
    
    $scope.hideVehicleSlotsPanelNew = function(){
    	vehicleTypesNew = false;
    };
    
    $scope.vehicle_slots_panel_showed_new = function(){
    	return vehicleTypesNew;
    };
    
    var agencyId;
    // Init edit pages element from initialize service
    $scope.initComponents = function(){
    	if($scope.editparktabs == null || $scope.editparktabs.length == 0){
	    	$scope.editparktabs = [];
	    	$scope.aconf = initializeService.getAreaConfData();
	    	$scope.sconf = initializeService.getStreetConfData();
	    	$scope.slot_conf_street = initializeService.getStreetSlotConfiguration();
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
	    	showArea = initializeService.isShowedAreaEdit();
	    	showStreets = initializeService.isShowedStreetEdit();
	    	showPm = initializeService.isShowedPmEdit();
	    	showPs = initializeService.isShowedPsEdit();
	    	showZones = initializeService.isShowedZone0Edit() || initializeService.isShowedZone1Edit() || initializeService.isShowedZone2Edit();	// TODO: manage more zones
	    	showBp = initializeService.isShowedBpEdit();
	    	var parktabs = [];
	    	var zone_tab_list = [];
	    	var area_tab_obj = { title:'manage_area_tab', index: 1, content:"partials/edit/tabs/edit_area.html" };
	    	var street_tab_obj = { title:'manage_street_tab', index: 7, content:"partials/edit/tabs/edit_street.html" };
	    	var ps_tab_obj = { title:'manage_structure_tab', index: 8, content:"partials/edit/tabs/edit_parkingstructure.html" };
	    	var pm_tab_obj = { title:'manage_parkingmeter_tab', index: 9, content:"partials/edit/tabs/edit_parkingmeter.html" };
	    	var bp_tab_obj = { title:'manage_bikepoint_tab', index: 10, content:"partials/edit/tabs/edit_bike.html" };
	    	if(showArea)parktabs.push(area_tab_obj);
	    	zoneTabList = initializeService.getZonePagesDataList();
	    	if(zoneTabList != null && zoneTabList.length > 0){
	    		for(var z = 0; z < zoneTabList.length; z++){
	    			parktabs.push(zoneTabList[z].tab);
	    		}
	    	}
	    	if(showStreets)parktabs.push(street_tab_obj);
	    	if(showPs)parktabs.push(ps_tab_obj);
	    	if(showPm)parktabs.push(pm_tab_obj);
	    	if(showBp)parktabs.push(bp_tab_obj);
	    	$scope.agencyId = agencyId = sharedDataService.getConfUserAgency().id;
	    	$scope.areaPermissions = sharedDataService.getAgencyPermissionsForObject("area");
	    	$scope.zonePermissions = sharedDataService.getAgencyPermissionsForObject("zone");
	    	$scope.streetPermissions = sharedDataService.getAgencyPermissionsForObject("street");
	    	$scope.psPermissions = sharedDataService.getAgencyPermissionsForObject("structure");
	    	$scope.pmPermissions = sharedDataService.getAgencyPermissionsForObject("parkingmeter");
	    	$scope.bikePermissions = sharedDataService.getAgencyPermissionsForObject("bike");
	    	var appId = sharedDataService.getConfAppId();
	    	var agenciesConf = sharedDataService.getAgenciesByDbId(appId);
	    	$scope.allAgencyFilter = [{
	    		id: "",
	    		name: "Tutto"
	    	},{
	    		id: agencyId,
	    		name: "Miei dati"
	    	}];
	    	for(var i = 0; i < agenciesConf.length; i ++){
	    		if(agenciesConf[i].id != agencyId){
	    			var tmpAgency = {
	    				id: agenciesConf[i].id,
	    				name: agenciesConf[i].name
	    			};
	    			$scope.allAgencyFilter.push(tmpAgency);
	    		}
	    	}
	    	$scope.agencyAreaFilter = "";		// default value
	    	$scope.agencyBPointFilter = "";		// default value
	    	$scope.agencyPMeterFilter = "";		// default value
	    	$scope.agencyPStructFilter = ""; 	// default value
	    	$scope.agencyStreetFilter = ""; 	// default value
	    	$scope.agencyZoneFilter = "";		// default value
	    	angular.copy(parktabs, $scope.editparktabs);
    	}
    };
    
    $scope.isMyAgency = function(agency){
    	//return (agencyId == agency);
    	if(agency){
    		return (agency.indexOf(agencyId) !== -1);
    	} else {
    		return false;
    	}
    };
    
    // -------------------------------- New part for periods and rate ----------------------------------
    $scope.isPeriodFormVisible = false;
    
    $scope.isInitPeriod = true;
    $scope.notValidDateFrom = false;
    $scope.notValidDateTo = false;
    $scope.tmpPr = {};
    $scope.pr  = {
	    from: "01/01",
	    to: "31/12",
	    weekDays: [true, true, true, true, true, true, true],
	    timeSlot: "00:00 - 23:59",
	    timeSlots: [
	        {
	        	from: "00:00",
	        	to: "23:59"
	        }
	    ],
	    rateValue: 0.0,
	    //dayOrNight: $scope.all_mode,
	    holiday: false,
	    note: null
	};
    
    $scope.all_mode = "all mode";
    $scope.day_mode = "day mode";
    $scope.night_mode = "night mode";
    
    $scope.clearPr = function(){
    	angular.copy($scope.pr, $scope.tmpPr);	// here I copy the pr object to use in edit and create form validation (object has to be != null)
	    $scope.pr  = {
	    	from: "01/01",
	    	to: "31/12",
	    	weekDays: [true, true, true, true, true, true, true],
	    	timeSlot: null,
	    	timeSlots: [],
	    	rateValue: "",//"0,00",
	    	//dayOrNight: $scope.all_mode,
	    	holiday: false,
	    	note: null
	    };
    };
    //$scope.clearPr();
    
    $scope.showPForm = function(){
    	$scope.clearPr();	// To clean the form input data
    	$scope.isPeriodFormVisible = true;
    };
    
    $scope.saveAndClosePForm = function(){
    	$scope.isPeriodFormVisible = false;
    	angular.copy($scope.tmpPr, $scope.pr);
    };
    
    $scope.someSelectedDay = function(weekdays){
    	var somes = false;
		if(weekdays){
			for(var i = 0; i < weekdays.length; i++){
				if(weekdays[i]){
					somes = true;
				}
			}
		}
		return somes;
    };
    
    $scope.addRatePeriod = function(period, form, type){
    	$scope.isInitPeriod = false;
    	$scope.notValidDateFrom = false;
    	$scope.notValidDateTo = false;
    	
    	if(type == 0){
	    	if($scope.area.validityPeriod == null){
	    		$scope.area.validityPeriod = [];
	    	}
    	} else {
    		if($scope.parkingStructure.validityPeriod == null){
	    		$scope.parkingStructure.validityPeriod = [];
	    	}
    	}	
	    if((type == 0 && (form.pFromDate.$error.required || form.pFromDate.$error.pattern)) || 
	    		(type == 0 && (form.pToDate.$error.required || form.pToDate.$error.pattern)) || 
	    		form.pWeekDays.$error.required ||
	    		(form.pTime.$error.required || form.pTime.$error.pattern) || 
	    		(form.pFee.$error.required || form.pFee.$error.pattern) ||
	    		form.pNote.$error.required){
	    	// show error messages
	    	if(!$scope.checkExistingDate(period.from)){
	    		$scope.notValidDateFrom = true;
	    	}
	    	if(!$scope.checkExistingDate(period.to)){
	    		$scope.notValidDateTo = true;
	    	}
	    } else {
	    	if(type == 0){
		    	if(!$scope.checkExistingDate(period.from)){
		    		$scope.notValidDateFrom = true;
		    	}
		    	if(!$scope.checkExistingDate(period.to)){
		    		$scope.notValidDateTo = true;
		    	}
	    	}
	    	if(!$scope.notValidDateFrom && !$scope.notValidDateTo){
		   		var periodData = {};
		   		period.rateValue = Math.ceil(parseFloat($scope.correctDecimal(period.rateValue, 1)) * 100);	// here I force the cast to int
		   		period.weekDays = $scope.getWeekDaysFromArray(period.weekDays, 1),
		   		angular.copy(period, periodData);
		   		if(type == 0){
		   			$scope.area.validityPeriod.push(periodData);
		   		} else {
		   			$scope.parkingStructure.validityPeriod.push(periodData);
		   		}
		   		$scope.clearPr();
		   		$scope.isInitPeriod = true;
		   		// here I call the close form method
			    $scope.saveAndClosePForm();
	    	}
    	}
    };
    
    $scope.checkExistingDate = function(date){
    	var corr = false;
    	if(date){
    		var allDate = date.split("/");
    		if(allDate.length == 2){
    			var dd = parseInt(allDate[0]);
    			var mm = parseInt(allDate[1]);
    			if(mm < 13){
    				switch(mm){
    					case 1:
    						if(dd <= 31){
    							corr = true;
    						}
    						break;
    					case 2:
    						if(dd <= 29){
    							corr = true;
    						}
    						break;
    					case 3:
    						if(dd <= 31){
    							corr = true;
    						}
    						break;
    					case 4:
    						if(dd <= 30){
    							corr = true;
    						}
    						break;
    					case 5:
    						if(dd <= 31){
    							corr = true;
    						}
    						break;
    					case 6:
    						if(dd <= 30){
    							corr = true;
    						}
    						break;
    					case 7:
    						if(dd <= 31){
    							corr = true;
    						}
    						break;
    					case 8:
    						if(dd <= 31){
    							corr = true;
    						}
    						break;
    					case 9:
    						if(dd <= 30){
    							corr = true;
    						}
    						break;
    					case 10:
    						if(dd <= 31){
    							corr = true;
    						}
    						break;
    					case 11:
    						if(dd <= 30){
    							corr = true;
    						}
    						break;
    					case 12:
    						if(dd <= 31){
    							corr = true;
    						}
    						break;
    					default: 
    						break;
    				}
    			}
    		}
    	}
    	return corr;
    };
    
    $scope.deleteRatePeriod = function(period, type){
    	if(type == 0){
	    	var index = $scope.area.validityPeriod.indexOf(period);
	    	if(index > -1) {
	    		$scope.area.validityPeriod.splice(index, 1);
	    	}
    	} else {
    		var index = $scope.parkingStructure.validityPeriod.indexOf(period);
	    	if(index > -1) {
	    		$scope.parkingStructure.validityPeriod.splice(index, 1);
	    	}
    	}
    };
    
    $scope.getCorrectTimeSlotsToString = function(timeSlots){
    	return sharedDataService.correctTimeSlotsToString(timeSlots);
    };
    
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
    
    $scope.getHourSlotsFromArray = function(hourStrings){
    	var hoursArray = [];
    	var values = hourStrings.split("/");
    	for(var i = 0; i < values.length; i++){
    		hoursArray.push(values[i]);
    	}
    	return hoursArray;
    };
    
    $scope.getHourSlotsFromTimePeriodArray = function(timePeriods){
    	var hoursArray = [];
    	if(timePeriods){
	    	var values = timePeriods;
	    	for(var i = 0; i < values.length; i++){
	    		hoursArray.push(values[i].from + " - " + values[i].to);
	    	}
    	}
    	return hoursArray;
    };
    
    // -------------------------------------------------------------------------------------------------
    
    $scope.checkIfObjectOnViewPage = function(object){
    	var showOnPages = false;
    	if(object != null && object.attributes != null){
    		var attr = object.attributes;
    		for(var i = 0; i < attr.length; i++){
    			if(attr[i].code == "viewPage"){
    				if(attr[i].visible){
    					showOnPages = true;
    				}
    			}
    		}
    	}
    	return showOnPages;
    };
    
    $scope.getUsedLang = function(){
    	return sharedDataService.getUsedLanguage();
    };
    
    $scope.isUsedItaLang = function(){
    	return ($scope.getUsedLang() == 'ita');
    };
    
    $scope.isUsedEngLang = function(){
    	return ($scope.getUsedLang() == 'eng');
    };
    
    $scope.manageZonePagePersonalization = function(tab_index){
    	$scope.zpc = zoneTabList[tab_index-2];
    	//$scope.zpc = $scope.zonesPg[tab_index-2];
    	var indx = tab_index-2;
    	$scope.zoneDetailId = "viewZone" + indx;
    };
    // ---------------------- End Block to read conf params and show/hide elements ---------------------
    
    // The tab directive will use this data
    //$scope.editparktabs = [ 
    //    { title:'Area', index: 1, content:"partials/edit/tabs/edit_area.html" },
    //    { title:'Via', index: 2, content:"partials/edit/tabs/edit_street.html" },
    //    { title:'Parcometro', index: 3, content:"partials/edit/tabs/edit_parkingmeter.html" },
    //    { title:'Parcheggio in struttura', index: 4, content:"partials/edit/tabs/edit_parkingstructure.html" },
    //    { title:'Zona', index: 5, content:"partials/edit/tabs/edit_zone.html" }
    //];
           
    $scope.setIndex = function($index, tab){
    	var localArea = sharedDataService.getSharedLocalAreas();
    	$scope.tabIndex = $index;
    	// zone loading
    	if(tab.index < 2 || tab.index > 6){
    		// check for shared zones only if not in zones tabs
	    	for(var i = 0; i < zoneTabList.length; i++){
	    		var type = zoneTabList[i].type;
	    		var zone = sharedDataService.getSharedLocalZones(i);
	    		if(!zone[0]){
	    			$scope.getAllZones(type, i);
	    		}
	    	}
    	}
    	// area loading
   		if(localArea == null || localArea.length == 0){
   			$scope.getAllAreas();
   			localArea = sharedDataService.getSharedLocalAreas();
   		}
  
       	if(tab.index == 1){
       		// area loading
       		if(localArea == null || localArea.length == 0){
       			$scope.getAllAreas();
       		} else {
       			$scope.areaWS = localArea;
       			$scope.polygons = gMapService.getAreaPolygons();
       			gMapService.closeLoadingMap();
       		}
       	}
       	if(tab.index >= 2 && tab.index <= 6){
       		// zones case
       		$scope.manageZonePagePersonalization(tab.index);
       		var zindex = tab.index - 2;
       		var type = zoneTabList[zindex].type;
       		$scope.getAllZones(type, zindex);
       	}
       	if(tab.index == 7){
       		// street case
       		var pms = sharedDataService.getSharedLocalPms();
       		if(pms == null || pms.length == 0){
       			$scope.getAllParkingMeters();
       		} else {
       			$scope.pmeterWS = sharedDataService.getSharedLocalPms();
    	    	$scope.initFiltersForPM();
    	    	if(showPm)$scope.resizeMap("viewPm");
    	    	$scope.parkingMetersMarkers = gMapService.getParkingMetersMarkers();
    	    	$scope.pmMapReady = true;
    	    	gMapService.closeLoadingMap();
       		}
       		var s = sharedDataService.getSharedLocalStreets();
       		if(s == null || s.length == 0){
       			$scope.getAllStreets();
       		} else {
       			$scope.streetWS = gMapService.initAllStreetObjects(s);
    	    	if(showStreets) {
    	    		gMapService.setStreetPolylines(gMapService.initStreetsOnMap($scope.streetWS, true, 1, false)[0]);
    	    		$scope.resizeMap("viewStreet");
    	    		if($scope.vStreetMap){
    	    			var toHide = $scope.vStreetMap.shapes;
    	    			$scope.vStreetMap.shapes = gMapService.hideAllStreets(s, toHide);
    	    		}
    				$scope.geoStreets = gMapService.getStreetPolylines();
    	    	}
    	    	$scope.allAreaFilter = sharedDataService.getAreaFilter();
    			$scope.streetAreaFilter = $scope.allAreaFilter[0].id;
    			gMapService.closeLoadingMap();
       		}
       	}
       	if(tab.index == 8){
       		// parking structure case
       		var ps = sharedDataService.getSharedLocalPs();
       		if(ps == null || ps.length == 0){
       			$scope.getAllParkingStructures();
       		} else {
       			$scope.pstructWS = ps;
    			if(showPs){
    				var pMarkers = gMapService.getParkingStructuresMarkers();
    				$scope.parkingStructureMarkers = (pMarkers) ? pMarkers : [];
    				$scope.resizeMap("viewPs");
    			}
    			gMapService.closeLoadingMap();
       		}
       	}
       	if(tab.index == 9){
       		// parking meters case
       		var s = sharedDataService.getSharedLocalStreets();
       		if(s == null || s.length == 0){
	    		$scope.getAllStreets();
	    	} else {
	    		$scope.streetWS = gMapService.initAllStreetObjects(s);
    	    	if(showStreets) {
    	    		gMapService.setStreetPolylines(gMapService.initStreetsOnMap($scope.streetWS, true, 1, false)[0]);
    	    		$scope.resizeMap("viewStreet");
    	    		if($scope.vStreetMap){
    	    			var toHide = $scope.vStreetMap.shapes;
    	    			$scope.vStreetMap.shapes = gMapService.hideAllStreets(s, toHide);
    	    		}
    				$scope.geoStreets = gMapService.getStreetPolylines();
    				gMapService.closeLoadingMap();
    	    	}
    	    	$scope.allAreaFilter = sharedDataService.getAreaFilter();
    			$scope.streetAreaFilter = $scope.allAreaFilter[0].id;
	    	}
       		var pms = sharedDataService.getSharedLocalPms();
       		if(pms == null || pms.length == 0){
       			$scope.getAllParkingMeters();
       		} else {
       			$scope.pmeterWS = sharedDataService.getSharedLocalPms();
    	    	$scope.initFiltersForPM();
    	    	if(showPm)$scope.resizeMap("viewPm");
    	    	$scope.parkingMetersMarkers = gMapService.getParkingMetersMarkers();
    	    	$scope.pmMapReady = true;
    	    	gMapService.closeLoadingMap();
       		}
       	}
       	if(tab.index == 10){
       		// bike points case
       		$scope.getAllBikePoints();
       	}
    };  
    
    $scope.listaStati = [{
			idObj: "ACTIVE",
			descrizione: "Attivo",
			descrizione_eng: "Active",
			language_key: "pm_state_active",
			filter: "ON-ACTIVE"
		},
		{
			idObj: "INACTIVE",
			descrizione: "Disattivo",
			descrizione_eng: "Off",
			language_key: "pm_state_disabled",
			filter: "OFF-INACTIVE"
		}
	];
    
    /*$scope.cash_mode = "CASH";
    $scope.automated_teller_mode = "AUTOMATED_TELLER";
    $scope.prepaid_card_mode = "PREPAID_CARD";
    $scope.parcometro = "PARCOMETRO";*/
    $scope.noPaymentChecked = false;
    $scope.gpsLength = 9;
    $scope.myAppId = "rv";
    $scope.lightgray = "#B0B0B0";
    
    $scope.myPath = [];
    $scope.aEditAddingPolygon = false;	// used for area update with polygon adding
    $scope.myAreaPath = [];
    $scope.allNewAreas = [];
    $scope.editNewAreas = [];
    $scope.editGAreas = [];
    $scope.myZonePath = [];
    $scope.mySpecialStreets = [];
    $scope.mySpecialAreas = [];
    $scope.mySpecialZones = [];
    $scope.mySpecialPMMarkers = [];
    $scope.mySpecialPSMarkers = [];
    $scope.mapStreetSelectedMarkers = [];
    
    // global variable used to store the map objects istances (with ng-map is the only way to manage more maps in an html page) 
    $scope.vAreaMap = null;
    $scope.eAreaMap = null;
    $scope.vStreetMap = null;
    $scope.eStreetMap = null;
    $scope.vPmMap = null;
    $scope.ePmMap = null;
    $scope.vPsMap = null;
    $scope.ePsMap = null;
    $scope.vZonaMap = null;
    $scope.eZonaMap = null;
    $scope.eZoneCenter0 = null;
    $scope.eZoneCenter1 = null;
    $scope.eZoneCenter2 = null;
    $scope.eZoneCenter3 = null;
    $scope.eZoneCenter4 = null;
    
    $scope.listaPagamenti = sharedDataService.getListaPagamenti();
    	/*[
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
	];*/
    
    $scope.subscriptions = [
        {
        	value: true,
        	desc: "Si'",
        	desc_eng: "Yes"
        },
        {
        	value: false,
        	desc: "No",
        	desc_eng: "No"
        }
    ];
    
    $scope.areaWS = [];
    $scope.streetWS = [];
    $scope.pmeterWS = [];
    $scope.pstructWS = [];
    $scope.zoneWS = [];
    $scope.bpointWS = [];
    
    //$scope.myNewArea;
     
    // for next and prev in practice list
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
       			if(list == null || list.length == 0){
       				return Math.ceil($scope.bpointWS.length/$scope.maxBPoints);
       			} else {
       				return Math.ceil(list.length/$scope.maxBPoints);
       			}
       		} else {
       			return 0;
     		}
       	} else if(type == 7){
       		if($scope.microzoneWS != null){
       			if(list == null || list.length == 0){
       				return Math.ceil($scope.microzoneWS.length/$scope.maxMicroZones);
       			} else {
       				return Math.ceil(list.length/$scope.maxMicroZones);
       			}
       		} else {
       			return 0;
     		}
       	}
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
	
	$scope.getLocalZoneById = function(id, type, zindex){
		var find = false;
		var corrZone = null;
		var myZones = sharedDataService.getSharedLocalZones(zindex);
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
							geometry: $scope.correctMyGeometryPolygon(myZones[i].geometry),
							label: lbl
						};
					}			
				}
			}
		}
		return corrZone;
	};
	
	
	$scope.getLocalZoneByType = function(zones, type, zindex){
		var find = false;
		var corrZone = null;
		var corrZones = [];
		var myZones = sharedDataService.getSharedLocalZones(zindex);
		if(myZones){
			for(var j = 0; j < zones.length; j++){
				for(var i = 0; i < myZones.length && !find; i++){
					if(myZones[i].id == zones[j]){
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
								geometry: $scope.correctMyGeometryPolygon(myZones[i].geometry),
								label: lbl
							};
						}			
					}
				}
				corrZones.push(corrZone);
			}
		}
		return corrZones;
	};
	
	$scope.initFiltersForPM = function(){
		$scope.allPmAreaFilter = [];
		angular.copy(sharedDataService.getSharedLocalAreas(),$scope.allPmAreaFilter);
		if($scope.allPmAreaFilter != null && $scope.allPmAreaFilter.length > 0 && $scope.allPmAreaFilter[0].id != ''){
			$scope.allPmAreaFilter.splice(0,0,{id:'', name: "Tutte"});
		}
		if($scope.allPmAreaFilter.length > 0){
			$scope.pmAreaFilter = $scope.allPmAreaFilter[0].id;
		}
		
		$scope.allPmStatusFilter = [];
		angular.copy($scope.listaStati, $scope.allPmStatusFilter);
		if($scope.allPmStatusFilter != null && $scope.allPmStatusFilter.length > 0 && $scope.allPmStatusFilter[0].idObj != ''){
			$scope.allPmStatusFilter.splice(0, 0, {idObj:"", descrizione: "Tutti"});
		}
		$scope.pmStatusFilter = $scope.allPmStatusFilter[0].filter;
	};
	
	// Utility methods
	$scope.correctColor = function(value){
		return "#" + value;
	};
	
	$scope.checkCorrectPaymode = function(myPm, isReq){
		var correctedPm = true;
		if(isReq){
			if(!myPm.cash_checked && !myPm.automated_teller_checked && !myPm.prepaid_card_checked && !myPm.parcometro_checked){
				correctedPm = false;
			}
		}
		return correctedPm;
	};
	
	$scope.checkIfPaymentChecked = function(value){
		if(value){
			if($scope.myPayment.cash_checked || $scope.myPayment.automated_teller_checked || $scope.myPayment.prepaid_card_checked || $scope.myPayment.parcometro_checked){
				$scope.setMyPaymentoErrMode(false);
			} else {
				$scope.setMyPaymentoErrMode(true);
			}
		} else {
			$scope.setMyPaymentoErrMode(false);
		}
	};
	
	$scope.castMyPaymentModeToString = function(myPm){
		return sharedDataService.castMyPaymentModeToString(myPm);
	};
	
	$scope.setMyPaymentoErrMode = function(value){
		$scope.noPaymentChecked = value;
	};
	
/*	$scope.initAreasObjects = function(areas){
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
			var myarea = areas[i];
			myarea.myZones0 = zones0;
			myarea.myZones1 = zones1;
			myarea.myZones2 = zones2;
			myarea.myZones3 = zones3;
			myarea.myZones4 = zones4;
			myAreas.push(myarea);
		}
		return myAreas;
	};*/
	
	/*$scope.initStreetsObjects = function(streets){
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
			var pms = [];
			if(streets[i].parkingMeters != null){
				for(var x = 0; x < streets[i].parkingMeters.length; x++){
					var pm = $scope.getLocalPmById(streets[i].parkingMeters[x]);
					if(pm != null){
						pms.push(pm);
					}
				}
			}
			var area = $scope.getLocalAreaById(streets[i].rateAreaId);
			var mystreet = streets[i];
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
	};*/
	
	/*$scope.initPMObjects = function(pmeters){
		$scope.allPmAreaFilter = [];
		angular.copy(sharedDataService.getSharedLocalAreas(),$scope.allPmAreaFilter);
		if($scope.allPmAreaFilter != null && $scope.allPmAreaFilter.length > 0 && $scope.allPmAreaFilter[0].id != ''){
			$scope.allPmAreaFilter.splice(0,0,{id:'', name: "Tutte"});
		}
		if($scope.allPmAreaFilter.length > 0){
			$scope.pmAreaFilter = $scope.allPmAreaFilter[0].id;
		}
		
		$scope.allPmStatusFilter = [];
		angular.copy($scope.listaStati, $scope.allPmStatusFilter);
		if($scope.allPmStatusFilter != null && $scope.allPmStatusFilter.length > 0 && $scope.allPmStatusFilter[0].idObj != ''){
			$scope.allPmStatusFilter.splice(0, 0, {idObj:"", descrizione: "Tutti"});
		}
		$scope.pmStatusFilter = $scope.allPmStatusFilter[0].filter;
		
		var myPms = [];
		for(var i = 0; i < pmeters.length; i++){
			var area = $scope.getLocalAreaById(pmeters[i].areaId);
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
			myPmeter.myStatus = (pmeters[i].status == 'ACTIVE')?"ON-ACTIVE":"OFF-INACTIVE";
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
	
	/*$scope.initPSObjects = function(ps){
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
			var myps = ps[i];
			myps.myZones0 = zones0;
			myps.myZones1 = zones1;
			myps.myZones2 = zones2;
			myps.myZones3 = zones3;
			myps.myZones4 = zones4;
			myPs.push(myps);
		}
		return myPs;
	};*/
	
	/*$scope.initBPObjects = function(bp){
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
			var mybp = bp[i];
			mybp.myZones0 = zones0;
			mybp.myZones1 = zones1;
			mybp.myZones2 = zones2;
			mybp.myZones3 = zones3;
			mybp.myZones4 = zones4;
			myBp.push(mybp);
		}
		return myBp;
	};*/
	
	$scope.correctObjId = function(id, i){
		if(i == 0){
			return id;
		} else {
			return id + '_' + i;
		}
	};
	
	$scope.useNormalIcon = function(icon){
		if(icon.indexOf(".png") > -1){
			icon = icon.substring(0, icon.length - 4);
		}
		return icon + "_outline.png";
	};
	
	$scope.completeAreaData = function(area){
		var areaMapObj = gMapService.setAreaMapDetails(area, 0);
		area.data = areaMapObj.data;
		return area;
	};

	
	// Zones
	$scope.getCorrectMapZone = function(zindex){
		var toHide = null;
		switch(zindex){
			case 0: 
				if($scope.vZoneMap0 != null){
					toHide = $scope.vZoneMap0.shapes;
				}
				break;
			case 1: 
				if($scope.vZoneMap1 != null){
					toHide = $scope.vZoneMap1.shapes;
				}
				break;
			case 2: 
				if($scope.vZoneMap2 != null){
					toHide = $scope.vZoneMap2.shapes;
				}
				break;
			case 3: 
				if($scope.vZoneMap3 != null){
					toHide = $scope.vZoneMap3.shapes;
				}
				break;
			case 4: 
				if($scope.vZoneMap4 != null){
					toHide = $scope.vZoneMap4.shapes;
				}
				break;
			default: break;
		}
		return toHide;
	};
	
	$scope.getAreaPM = function(area){
		$scope.myPms = sharedDataService.getPmsFromArea(sharedDataService.getSharedLocalPms(), area);
	};
	
	var pmEditCode = 0; // used in edit to check if a new code is already used
	
	
	$scope.getCorrectZoneType = function(type){
		var corrType = null;
		var types = sharedDataService.getZoneTypeList();
		if(types){
			var found = false;
			for(var i = 0; (i < types.length && !found); i++){
				if(types[i].value == type){
					corrType = types[i];
					found = true;
				}
			}
		}
		return corrType;
	};
	
	/*$scope.setMyGeometry = function(value){
		$scope.myGeometry = value;
	};*/
	
	/*$scope.getMyGeometry = function(){
		return $scope.myGeometry;
	};*/
	
	$scope.setMyLineGeometry = function(value){
		$scope.myLineGeometry = value;
	};
	
	$scope.setMyNewLineGeometry = function(value){
		$scope.myNewLineGeometry = value;
	};
	
	$scope.setMyPolGeometry = function(value){
		$scope.myPolGeometry = value;
	};
	
	$scope.setMyNewPolGeometry = function(value){
		$scope.myNewPolGeometry = value;
	};
	
	$scope.addMyNewMarker = function(pos, map){
		$scope.myNewPm = {
				id: 0,
				coords: {
					latitude: pos.lat,
					longitude: pos.lng
				},
				options: { 
					draggable: true,
					visible: true
				},
				map: map,
				events: {
				    dragend: function (marker, eventName, args) {
				    	var lat = marker.getPosition().lat();
				    	var lng = marker.getPosition().lng();
				    	console.log('marker dragend: ' + lat + "," + lng);
				    	//$scope.setMyGeometry(lat + "," + lng);
				    	$scope.myGeometry = lat + "," + lng;
				    }
				}
		};
	};
	
	$scope.addNewPmMarker = function(event) {
		if(!$scope.isEditing){
			$scope.newPmMarkers = []; 	// I permit only one marker a time
	        var pos = event.latLng;
	        var i = 0;
	        
	    	var ret = {
	    		id: i,
	    		pos: pos.lat() + "," + pos.lng(),
	    		options: { 
	    		   	draggable: true,
	    		   	visible: true
	    		},
	    		icon: $scope.pmMarkerIcon
	    	};
	    	$scope.parckingMeter.myGeometry = ret.pos;
	    	//$scope.setMyGeometry(ret.pos);
	    	return $scope.newPmMarkers.push(ret);
		}
    };
    
    $scope.addNewPsMarker = function(event) {
		if(!$scope.isEditing){
			$scope.newPsMarkers = []; 	// I permit only one marker a time
	        var pos = event.latLng;
	        var i = 0;
	        
	    	var ret = {
	    		id: i,
	    		pos: pos.lat() + "," + pos.lng(),
	    		options: { 
	    		   	draggable: true,
	    		   	visible: true
	    		},
	    		icon: $scope.psMarkerIcon
	    	};
	    	$scope.parkingStructure.myGeometry = ret.pos;
	    	//$scope.setMyGeometry(ret.pos);
	    	$scope.getStructAddress(event);
	    	return $scope.newPsMarkers.push(ret);
		}
    };
    
    $scope.addNewCentresMarker = function(event) {
		if(!$scope.isEditing){
			$scope.newCentres = []; 	// I permit only one marker a time
	        var pos = event.latLng;
	        var i = 0;
	        
	    	var ret = {
	    		id: i,
	    		pos: pos.lat() + "," + pos.lng(),
	    		options: { 
	    		   	draggable: true,
	    		   	visible: true
	    		}
	    	};
	    	$scope.myGeometry = ret.pos;
	    	//$scope.setMyGeometry(ret.pos);
	    	return $scope.newCentres.push(ret);
		}
    };
    
    $scope.addNewMarker = function(event) {
		if(!$scope.isEditing){
			$scope.newBikePointMarkers = []; 	// I permit only one marker a time
	        var pos = event.latLng;
	        var i = 0;
	        
	    	var ret = {
	    		id: i,
	    		pos: pos.lat() + "," + pos.lng(),
	    		options: { 
	    		   	draggable: true,
	    		   	visible: true
	    		},
	    		icon: $scope.bpMarkerIcon
	    	};
	    	$scope.bikePoint.myGeometry = ret.pos;
	    	//$scope.setMyGeometry(ret.pos);
	    	return $scope.newBikePointMarkers.push(ret);
		}
    };
	
	$scope.updatePmPos = function(event){
    	var pos = event.latLng;
    	$scope.parckingMeter.myGeometry = pos.lat() + "," + pos.lng();
    	//var geom = pos.lat() + "," + pos.lng();
    	//$scope.setMyGeometry(geom);
    };
    
    $scope.updatePsPos = function(event){
    	var pos = event.latLng;
    	$scope.parkingStructure.myGeometry = pos.lat() + "," + pos.lng();
    	//var geom = pos.lat() + "," + pos.lng();
    	//$scope.setMyGeometry(geom);
    	$scope.getStructAddress(event);
    };
    
    $scope.updateCenterPos = function(event){
    	var pos = event.latLng;
    	$scope.myGeometry = pos.lat() + "," + pos.lng();
    	//var geom = pos.lat() + "," + pos.lng();
    	//$scope.setMyGeometry(geom);
    };
    
    $scope.updatePos = function(event){
    	var pos = event.latLng;
    	$scope.bikePoint.myGeometry = pos.lat() + "," + pos.lng();
    	//var geom = pos.lat() + "," + pos.lng();
    	//$scope.setMyGeometry(geom);
    };
    
    $scope.moveMarker = function(val){
    	if($scope.newBikePointMarkers!=null && $scope.newBikePointMarkers.length > 0){
    		$scope.newBikePointMarkers[0].pos = val;
    	}
    };
	
	var showPMErrorCode = false;
	
	$scope.isPMErrorCodeShowed = function(){
		return showPMErrorCode;
	};
	
	var isPMCodeUpdated = false;
	var oldCode = "";
	
	$scope.saveActualCodeValue = function(old_code){
		if(oldCode == ""){
			oldCode = old_code;
		}
	};
	
	// Method checkIfAlreadyExist: used to check i a pm code is already used
	$scope.checkIfAlreadyExist = function(pm_code){
		var found = false;
		isPMCodeUpdated = false;
		if(!$scope.isEditing){
			for(var i = 0; ((i < $scope.pmeterWS.length) && !found); i++){
				if($scope.pmeterWS[i].code == pm_code){
					found = true;
				}
			}
		} else {
			if(pm_code != pmEditCode){
				for(var i = 0; ((i < $scope.pmeterWS.length) && !found); i++){
					if($scope.pmeterWS[i].code == pm_code){
						found = true;
					}
				}
			}
		}
		if(found){
			showPMErrorCode = true;
		} else {
			showPMErrorCode = false;
			isPMCodeUpdated = true;
		}
	};
	
	$scope.addOpeningPeriod = function(start, end){
		var from = $scope.addZero(start.getHours()) + ":" + $scope.addZero(start.getMinutes());
		var to = $scope.addZero(end.getHours()) + ":" + $scope.addZero(end.getMinutes());
		var period = {from: from, to: to};
		//var newPeriod = angular.copy(period);
		var d = new Date(0);
		d.setHours(0);
		d.setMinutes(0);
		// Controls on period
		$scope.setErrorsPeriodTimeOverlap(false);
		$scope.setErrorsPeriodTimeFromTo(false);
		var inserted = false;
		if(start.getTime() > end.getTime()){
			$scope.setErrorsPeriodTimeFromTo(true);
		} else {
			if($scope.openingPeriods == null || $scope.openingPeriods.length == 0){
				$scope.openingPeriods.push(period);
				$scope.resetTime(d);
				inserted = true;
			} else {
				var timeStor = null;
				for(var i = 0; (i < $scope.openingPeriods.length && !inserted); i++){
					var timeA_stor = $scope.correctTime($scope.openingPeriods[i].to);
					timeStor = $scope.castToTime(timeA_stor);
					var timeDa_stor = $scope.correctTime($scope.openingPeriods[i].from);
					var fromTime_stor = $scope.castToTime(timeDa_stor);
					if(end.getTime()< timeStor.getTime()){
						if(end.getTime()< fromTime_stor.getTime()){
							if(i == 0){
								// Case of new Date smaller than a Date in the first position of the array
								$scope.openingPeriods.splice(i, 0, period);
								$scope.resetTime(d);
								inserted = true;
							} else {
								var timeA_stor_beforePos = $scope.correctTime($scope.openingPeriods[i-1].to);
				       			var toTime_stor_beforePos = $scope.castToTime(timeA_stor_beforePos);
								if(start.getTime() >= toTime_stor_beforePos.getTime()){
									// Case of new Date smaller than a Date in the "i" position of the array
									// and bigger than a date in the "i-1" position in the array
									$scope.storicoResidenza.splice(i, 0, period);
									$scope.resetTime(d);
									inserted = true;
								} else {
									// Here I have overlap
								}
							}
						} else {
							// Here I have overlap
						}
					}
				}
				if(inserted == false){
	   				if(start.getTime() >= timeStor.getTime()){
	   					// Case of new Date bigger than the last array Date
	   					$scope.openingPeriods.push(period);
	   					$scope.resetTime(d);
	   					inserted = true;
	   				} else {
	   					// Overlap.....
	   					$scope.setErrorsPeriodTimeOverlap(true);
	   				}
	   			}
			}
		}
		
	};
	
	$scope.deleteOpeningPeriod = function(period){
		for(var i = 0; i < $scope.openingPeriods.length; i++){
			if($scope.openingPeriods[i].from == period.from && $scope.openingPeriods[i].to == period.to){
				$scope.openingPeriods.splice(i, 1);
			}
		}
	};
	
	$scope.changedTime = function(type){
		if(type == 1){
			// start time
			$scope.timePeriod.from = $scope.startTime.getHours() + ":" + $scope.startTime.getMinutes();
		} else {
			// end time
			$scope.timePeriod.to = $scope.endTime.getHours() + ":" + $scope.endTime.getMinutes();
		}
	};	
	
	// ########################################### Method for AREA ####################################
    
    // Retrieve all Area Method
    $scope.getAllAreas = function(){
    	gMapService.loadMapsObject();	// To show modal waiting spinner
		$scope.polygons = [];
		var promiseAreas = areaService.getAreasFromDb(showArea);
		promiseAreas.then(function(result){
			$scope.areaWS = result;
			var toHide = $scope.vAreaMap.shapes;
			$scope.vAreaMap.shapes = gMapService.hideAllAreas(result, toHide);
			$scope.polygons = gMapService.getAreaPolygons();
			gMapService.closeLoadingMap();
		});
	};
    
	// Create Area Method
	$scope.createArea = function(form, area, myColor, zone0, zone1, zone2, zone3, zone4){ //, polygon
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingAErrorMessage = false;
			
			var newCorrectedPath = [];
			var createdPaths = [];
			createdPaths = gMapService.createPolygonInAreaEdit(garea, newCorrectedPath, createdPaths, $scope.allNewAreas);
			
			var updateResponse = areaService.createAreaInDb(area, myColor, zone0, zone1, zone2, zone3, zone4, createdPaths, agencyId);
			updateResponse.then(function(result){
				if(result != null && result != ""){
		    		$scope.getAllAreas();
		    		$scope.myAZone0 = null;
		    		$scope.myAZone1 = null;
		    		$scope.myAZone2 = null;
		    		$scope.myAZone3 = null;
		    		$scope.myAZone4 = null;
		    		$scope.editModeA = false;
		    	} else {
		    		$scope.editModeA = true;
		    		$scope.showUpdatingAErrorMessage = true;
		    	}
			});
		}
	};
	
	// Update Area Method
	$scope.updateArea = function(form, area, color, zone0, zone1, zone2, zone3, zone4){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingAErrorMessage = false;
			var editCorrectedPath = [];
			var editPaths = [];
			if($scope.editGAreas != null && $scope.editGAreas.length > 0){
				// case edit polygons or adding polygons
				editPaths = gMapService.udpatePolygonInAreaEdit($scope.editGAreas, $scope.map, editCorrectedPath, editPaths);
				/*for(var j = 0; j < $scope.editGAreas.length; j++){
					var updatedAreaPol = {};
					if($scope.editGAreas[j].id != null){
						updatedAreaPol = $scope.map.shapes[$scope.editGAreas[j].id];
					}
					if(updatedAreaPol != null){
						var updatedPath = updatedAreaPol.getPath();
						if(updatedPath != null && updatedPath.length > 0){
							editCorrectedPath = [];
							for(var i = 0; i < updatedPath.length; i++){
								var point = $scope.getPointFromLatLng(updatedPath.b[i], 1);
								if(point)editCorrectedPath.push(point);
							}
							editPaths.push(editCorrectedPath);
						}
					}
				}*/
				if($scope.aEditAddingPolygon){
					editPaths = gMapService.addNewPolygonInAreaEdit(garea, editCorrectedPath, editPaths, $scope.editNewAreas);
					$scope.aEditAddingPolygon = false;
					/*var createdPath = garea.getPath();
					editCorrectedPath = [];
					for(var i = 0; i < createdPath.length; i++){
						var point = $scope.getPointFromLatLng(createdPath.b[i], 1);
						if(point)editCorrectedPath.push(point);
					}
					editPaths.push(editCorrectedPath);
					if($scope.editNewAreas != null && $scope.editNewAreas.length > 0){
						for(var j = 0; j < $scope.editNewAreas.length; j++){
							createdPath = $scope.editNewAreas[j].getPath();
							editCorrectedPath = [];
							for(var i = 0; i < createdPath.length; i++){
								var point = $scope.getPointFromLatLng(createdPath.b[i], 1);
								editCorrectedPath.push(point);
							};
							editPaths.push(editCorrectedPath);
						}
					}*/
				}
			}
			else {
				if(garea && garea.getPath()){
					editPaths = gMapService.createPolygonInAreaEdit(garea, editCorrectedPath, editPaths, $scope.allNewAreas);
				}
			}
			
			var updateResponse = areaService.updateAreaInDb(area, color, zone0, zone1, zone2, zone3, zone4, editPaths, 0, agencyId);
			updateResponse.then(function(result){
				if(result != null){
		    		//$scope.getAreasFromDb();
		    		$scope.getAllAreas();
					$scope.editModeA = false;
		    	} else {
		    		$scope.editModeA = true;
		    		$scope.showUpdatingAErrorMessage = true;
		    	}
			});
		}
	};
	
	// Area prepare delete method
	$scope.setARemove = function(area){
		var delArea = $dialogs.confirm("Attenzione", "Vuoi cancellare l'area '" + area.name + "'? La cancellazione dell'area comportera' la rimozione di 'vie' e 'parcometri' ad essa associati. Continuare?");
			delArea.result.then(function(btn){
				// yes case
				$scope.deleteArea(area);
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	//Delete Area Method
	$scope.deleteArea = function(area){
		$scope.showDeletingAErrorMessage = false;
		// area removing from gmap
		gMapService.removeAreaPolygons($scope.vAreaMap, area);
		
		var deleteResponse = areaService.deleteAreaInDb(area, agencyId);
		deleteResponse.then(function(result){
			if(result != null && result != ""){
	    		//$scope.getAreasFromDb();
	    		$scope.getAllAreas();
	    		$scope.getAllStreets();	// here I recall the getAllStreet and getAllParkingMeters functions to refresh lists
	    		$scope.getAllParkingMeters();
	    	} else {
	    		$scope.showDeletingAErrorMessage = true;
	    	}
		});
	};
	
	// Used to reload the area relations with zones
	$scope.updateAreaZoneRelations = function(area){
		var updateResponse = areaService.updateAreaInDb(area, null, null, null, null, null, null, null, 1);
		updateResponse.then(function(result){
			if(result != null){ // == "OK"){
		    	$scope.getAreasFromDb();
		    }
		});
	};
	
	// Load details Area Method
	$scope.setADetails = function(area){
		$scope.aViewMapReady = false;
		$scope.mySpecialAreas = gMapService.setAreaMapDetails(area, 0);
		var toHide = $scope.vAreaMap.shapes;
		$scope.vAreaMap.shapes = gMapService.deleteAreaMapObjects(area, toHide);
		$scope.viewArea = area;
		$scope.viewModeA = true;
		$scope.editModeA = false;
		$scope.aViewMapReady = true;
	};
	
	$scope.closeAView = function(){
		$scope.mySpecialAreas = [];
		$scope.getAllAreas();
		$scope.viewModeA = false;
		$scope.editModeA = false;
	};
	
	// Load edit data Area Method
	$scope.setAEdit = function(area){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		$scope.myColor = "";
		$scope.allMunicipality = sharedDataService.getMunicipalityVals();
		// zones management
		$scope.myAZone0 = null;
		$scope.myAZone1 = null;
		$scope.myAZone2 = null;
		$scope.myAZone3 = null;
		$scope.myAZone4 = null;
		$scope.aZones0 = sharedDataService.getSharedLocalZones0();
		$scope.aZones1 = sharedDataService.getSharedLocalZones1();
		$scope.aZones2 = sharedDataService.getSharedLocalZones2();
		$scope.aZones3 = sharedDataService.getSharedLocalZones3();
		$scope.aZones4 = sharedDataService.getSharedLocalZones4();
		
		// Case edit
		if(area != null){
			if(area.zones){
				for(var i = 0; i < area.zones.length; i++){
					var z0 = gMapService.getLocalZoneById(area.zones[i], 1, 0);
					var z1 = gMapService.getLocalZoneById(area.zones[i], 1, 1);
					var z2 = gMapService.getLocalZoneById(area.zones[i], 1, 2);
					var z3 = gMapService.getLocalZoneById(area.zones[i], 1, 3);
					var z4 = gMapService.getLocalZoneById(area.zones[i], 1, 4);
					if(z0 != null){
						$scope.myAZone0 = z0;
					} else if(z1 != null){
						$scope.myAZone1 = z1;
					} else if(z2 != null){
						$scope.myAZone2 = z2;
					} else if(z3 != null){
						$scope.myAZone3 = z3;
					} else if(z4 != null){
						$scope.myAZone4 = z4;
					}
				}
			}
			
			if(area.geometry == null || area.geometry.length == 0 || area.geometry[0].points.length == 0){
				garea.visible = true;		// here I show the polygon for creation
			} else {
				garea.visible = false;		// here I hide the polygon for creation
			}
			garea.setPath([]);				// and clear the path
			$scope.clearCreateEditPolygonsForAreas();
			
			$scope.isEditing = true;
			$scope.isInit = false;
			angular.copy(area, $scope.area);
			
			var areaCenter = $scope.mapCenter;
			$scope.myColor = $scope.correctColor(area.color);
			if(area.geometry != null && area.geometry.length > 0 && area.geometry[0].points.length > 0){
				areaCenter = {
					latitude: $scope.area.geometry[0].points[0].lat,
					longitude: $scope.area.geometry[0].points[0].lng
				};
				$scope.editGAreas = gMapService.setAreaMapDetails(area, 1);
			}
		} else {
			garea.setMap(null);					// here I clear the old path				
			garea = new google.maps.Polygon({
		        strokeColor: '#000000',
		        strokeOpacity: 1.0,
		        strokeWeight: 3,
		        fillColor: '#000000',
		        fillOpacity: 0.4,
		        editable:true,
		        draggable:true,
		        visible:true
		    });
			$scope.clearCreateEditPolygonsForAreas();
			
			$scope.setMyPolGeometry("");
			$scope.area = {
				id: null,
				id_app: null,
				name: null,
				validityPeriod: null,
				timeSlot: null,
				smsCode: null,
				color: null,
				note: null,
				geometry: null,
				zones: null
			};
			
		}
		$scope.resizeMapTimed("editArea", false);
		$scope.viewModeA = false;
		$scope.editModeA = true;
	};
	
	$scope.clearCreateEditPolygonsForAreas = function() {
		// Here i check if there are old 'create/edit' polygons in editAreaMap and remove them from it
		if($scope.allNewAreas != null && $scope.allNewAreas.length > 0){
			for(var i = 0; i < $scope.allNewAreas.length; i++){
				$scope.allNewAreas[i].visible = false;
				$scope.allNewAreas[i].setMap(null);			// I clean the edit map form old polygons
			}
			$scope.allNewAreas = [];
		}
		if($scope.editNewAreas != null && $scope.editNewAreas.length > 0){
			for(var i = 0; i < $scope.editNewAreas.length; i++){
				$scope.editNewAreas[i].visible = false;
				$scope.editNewAreas[i].setMap(null);			// I clean the edit map form old polygons
			}
			$scope.editNewAreas = [];
		}
		if($scope.editGAreas != null && $scope.editGAreas.length > 0){
			for(var i = 0; i < $scope.editGAreas.length; i++){
				$scope.editGAreas[i].visible = false;
				if($scope.editGAreas[i].id == null){
					$scope.editGAreas[i].setMap(null);
				} else {
					$scope.eAreaMap.shapes[$scope.editGAreas[i].id].setMap(null);	// I clean the edit map form old polygons
				}
			}
			$scope.editGAreas = [];
		}
	};
	
	// ########################## Methods For ZONES #############################
	
	// Method used to retrieve all zones from db and show the on map (if have geometry)
	$scope.getAllZones = function(z_type, tindex){
		gMapService.loadMapsObject();	// To show modal waiting spinner
		$scope.zoneWS = [];	// clear zones;
		var myZonePromise = zoneService.getZonesFromDb(z_type);
		myZonePromise.then(function(result){
			$scope.zoneWS = gMapService.correctMyZones(result);
		    if(showZones){
		    	$scope.initZonesOnMap($scope.zoneWS, tindex);
		    	$scope.resizeMap("viewZone" + tindex);
		    }
		    sharedDataService.setSharedLocalZones($scope.zoneWS, tindex);
		    gMapService.closeLoadingMap();
		});
	}
	
	// Method used to add a zone to a specific type list
    $scope.addZonePoligonToList = function(zone, index){
    	switch(index){
	    	case 0: $scope.zone_polygons0.push(zone);
				break;
			case 1: $scope.zone_polygons1.push(zone);
				break;
			case 2: $scope.zone_polygons2.push(zone);
				break;
			case 3: $scope.zone_polygons3.push(zone);
				break;
			case 4: $scope.zone_polygons4.push(zone);
				break;
			default: break;
		}	
    };
	
    // Method used to inithialize the zones on map and to hide the old zones
	$scope.initZonesOnMap = function(zones, index){
		var zone = {};
		var poligons = {};
		
		switch(index){
			case 0: 
				if($scope.zone_polygons0 != null && $scope.zone_polygons0.length > 0){
					$scope.vZoneMap0.shapes = $scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.zone_polygons0 = [];
				}
				break;
			case 1: 
				if($scope.zone_polygons1 != null && $scope.zone_polygons1.length > 0){
					$scope.vZoneMap1.shapes = $scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.zone_polygons1 = [];
				}
				break;
			case 2: 
				if($scope.zone_polygons2 != null && $scope.zone_polygons2.length > 0){
					$scope.vZoneMap2.shapes = $scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.zone_polygons2 = [];
				}
				break;
			case 3: 
				if($scope.zone_polygons3 != null && $scope.zone_polygons3.length > 0){
					$scope.vZoneMap3.shapes = $scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.zone_polygons3 = [];
				}
				break;
			case 4: 
				if($scope.zone_polygons4 != null && $scope.zone_polygons4.length > 0){
					$scope.vZoneMap4.shapes = $scope.hideAllZones(zones, index);	//Here I hide all the old zone
					$scope.zone_polygons4 = [];
				}
				break;
			default: break;
		}
		
		var zonesOnMap = gMapService.initZonesOnMap(zones, true, 1, false, true)[0];
		for(var i = 0; i < zonesOnMap.length; i++){
			zone = zonesOnMap[i];
			$scope.addZonePoligonToList(zone, index);
		}
	};
	
	// Method hideAllZone: used to hide in map the poligon or polyline relative to a zona
	$scope.hideAllZones = function(zones, index){
		var toHideZone = $scope.getCorrectMapZone(index);
		return gMapService.hideZonePolygons(toHideZone, zones);
    };
	
	// Zone details data
	$scope.setZDetails = function(zone, zindex){
		$scope.zViewMapReady = false;
		$scope.mySpecialZones = [];
		$scope.viewZone = zone;
		
		if(zone.centermap){
			var toRemLat = 0;
			var toRemLng = 0;
			var sLat = "" + zone.centermap.lat;
			var sLng = "" + zone.centermap.lng;
			if(sLat.length > $scope.gpsLength){
				toRemLat = sLat.length - $scope.gpsLength;
			}
			if(sLng.length > $scope.gpsLength){
				toRemLng = sLng.length - $scope.gpsLength;
			}
			//$scope.setMyGeometry(sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng));
			$scope.myGeometry = sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng);
		} else {
			//$scope.setMyGeometry(null);
			$scope.myGeometry = null;
		}
		
		var toHide = $scope.getCorrectMapZone(zindex);
		$scope.mySpecialZones = gMapService.setZoneMapDetails(zone, toHide, 0);
		
		$scope.viewModeZ = true;
		$scope.editModeZ = false;
		$scope.zViewMapReady = true;
	};
	
	$scope.closeZView = function(type){
		var zindex = $scope.tabIndex - 1;
		$scope.getAllZones(type, zindex);	// to refresh the data on page
		$scope.closeAllSpecialZones();
		$scope.mySpecialZones = [];
		$scope.viewModeZ = false;
		$scope.editModeZ = false;
	};
	
	$scope.closeAllSpecialZones = function(){
		for(var i = 0; i < 5; i++){
			var toHide = $scope.getCorrectMapZone(i);
			if(toHide != null){
				for(var z = 0; z < $scope.mySpecialZones.length; z++){
					toHide[$scope.mySpecialZones[z].id].setMap(null);
				}
			}
		}
	};
	
	// Zone edit data
	$scope.setZEdit = function(zone){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		$scope.allZoneTypes = sharedDataService.getZoneTypeList();
		$scope.editCentres = [];
		$scope.myColor = "";
		
		// Polyline void object
		$scope.newZone = {
			path: null,
			stroke: {
			    color: '#000000',
			    weight: 3
			},
			editable: true,
			draggable: true,
			visible: true,
			geodesic: false
		};
		//$scope.setMyGeometry(null);
		$scope.myGeometry = null;
		
		// Case edit
		if(zone != null){
			if(zone.type){
				$scope.myType = $scope.getCorrectZoneType(zone.type);
			}
			gzone.setPath([]);						// here I clear the old path
			$scope.isEditing = true;
			$scope.isInit = false;
			angular.copy(zone, $scope.zone);
			var zoneCenter = $scope.mapCenter;
			$scope.myColor = $scope.correctColor(zone.color);
			if(zone.geometry != null && zone.geometry.points.length > 0){
				zoneCenter = {
					latitude: zone.geometry.points[0].lat,
					longitude: zone.geometry.points[0].lng
				};
				gzone.visible = false;
			} else {
				gzone.visible = true;					// here I show the creation polygon
				if($scope.editGZone != null){			
					$scope.editGZone.visible = false;	// and hide the edit polygon
				}
			}
			if(zone.centermap){
				//$scope.setMyGeometry(zone.centermap.lat + "," + zone.centermap.lng);
				$scope.myGeometry = zone.centermap.lat + "," + zone.centermap.lng;
			}
			if(zone.geometry != null && zone.geometry.points.length > 0){
				var tmpPol = "";
				var poligons = {};
				for(var i = 0; i < zone.geometry.points.length; i++){
					var tmpPoint = zone.geometry.points[i].lat + "," + zone.geometry.points[i].lng;
					tmpPol = tmpPol + tmpPoint + ",";
				}
				tmpPol = tmpPol.substring(0, tmpPol.length-1);
				$scope.setMyPolGeometry(tmpPol);
			
				var myZonesPolygons = gMapService.setZoneMapDetails(zone, null, 1);
				$scope.editGZone = (myZonesPolygons && myZonesPolygons.length > 0) ? myZonesPolygons[0] : {};
			}	
		} else {
			gzone.setPath([]);										// here I clear the old path
			gzone.visible = true;									// here I show the polyline for creation
			if($scope.editGZone != null){
				$scope.editGZone.visible = false;					// and hide the edit polyline
			}
			var tmppath = [];
			$scope.zone = {
				id: null,
				id_app: null,
				nome: null,
				submacro: null,
				submicro: null,
				color: null,
				note: null,
				type: null,
				myType: null,
				geometry: null,
				centermap: null,
				geometryFromSubelement: false
			};
		}
		$scope.viewModeZ = false;
		$scope.editModeZ = true;
		var indx = $scope.tabIndex - 1;
		$scope.resizeMapTimed("editZone" + indx, true);
	};
	
	// Update Zone Object
	$scope.updateZone = function(form, zone, myColor, center, type){	//, polygon
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingZErrorMessage = false;
			var corrType = (type) ? type.value : null;
			var editCorrectedPath = [];
			var updatedPath = $scope.map.shapes.editZPolygon.getPath();
			if(updatedPath != null && updatedPath.length > 0){
				for(var i = 0; i < updatedPath.length; i++){
					var point = gMapService.getPointFromLatLng(updatedPath.b[i], 1);
					editCorrectedPath.push(point);
				}
			} else {
				var createdPath = gzone.getPath();
				for(var i = 0; i < createdPath.length; i++){
					var point = gMapService.getPointFromLatLng(createdPath.b[i], 1);
					editCorrectedPath.push(point);
				}
			}
			
			var zindex = $scope.tabIndex - 1;
			var myZonePromise = zoneService.updateZoneInDb(zone, myColor, center, corrType, editCorrectedPath, agencyId);
			myZonePromise.then(function(result){
		    	if(result != null){ // == "OK"){
		    		$scope.getAllZones(corrType, zindex);
					$scope.editModeZ = false;
					$scope.myType = null;
		    	} else {
		    		$scope.editModeZ = true;
		    		$scope.showUpdatingZErrorMessage = true;
		    	}
		    });
		}
	};	
	
	// Create Zone Object
	$scope.createZone = function(form, zone, myColor, center, type){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingZErrorMessage = false;
			var corrType = (type) ? type.value : null;
			var newCorrectedPath = [];
			var createdPath = gzone.getPath();
			for(var i = 0; i < createdPath.length; i++){
				var point = gMapService.getPointFromLatLng(createdPath.b[i], 1);
				newCorrectedPath.push(point);
			};
			
			var zindex = $scope.tabIndex - 1;
			var myDataPromise = zoneService.createZoneInDb(zone, myColor, center, corrType, newCorrectedPath, agencyId);
			myDataPromise.then(function(result){
		    	if(result != null && result != ""){
		    		$scope.getAllZones(corrType, zindex);
					$scope.editModeZ = false;
					$scope.myType = null;
		    	} else {
		    		$scope.editModeZ = true;
		    		$scope.showUpdatingZErrorMessage = true;
		    	}
		    });
		}
	};	
	
	// Zone delete method
	$scope.deleteZone = function(zone){
		$scope.showDeletingZErrorMessage = false;
		
		// zone removing from gmap
		var zindex = $scope.tabIndex - 1;
		var toDelZone = $scope.getCorrectMapZone(zindex);
    	if(toDelZone[zone.id] != null){
    		toDelZone[zone.id].setMap(null);
    	}
    	
	   	var myDataPromise = zoneService.deleteZoneInDb(zone, agencyId);
	    myDataPromise.then(function(result){
	    	if(result != null && result != ""){
	    		// Here I have to remove the zone id from the street
	    		for(var i = 0; i < $scope.streetWS.length; i++){
			    	if($scope.streetWS[i].zones != null && $scope.streetWS[i].zones.length > 0){
			    		for(var z = 0; z < $scope.streetWS[i].zones.length; z++){
			    			if($scope.streetWS[i].zones[z] == zone.id){
			    				$scope.streetWS[i].zones.splice(z,1);
			    				$scope.updateStreetRel($scope.streetWS[i]);
			    			}
			    		}
			    	}
			    }
	    		// Here I have to check and remove the zone id from the areas
	    		for(var i = 0; i < $scope.areaWS.length; i++){
	    			if($scope.areaWS[i].zones != null && $scope.areaWS[i].zones.length != null && $scope.areaWS[i].zones.length > 0){
	    				for(var z = 0; z < $scope.areaWS[i].zones.length; z++){
	    					if($scope.areaWS[i].zones[z] == zone.id){
			    				$scope.areaWS[i].zones.splice(z,1);
			    				$scope.updateAreaZoneRelations($scope.areaWS[i]);
			    			}
	    				}
	    			}
	    		}
	    		// Here I have to check and remove the zone id from the pss
	    		for(var i = 0; i < $scope.pstructWS.length; i++){
	    			if($scope.pstructWS[i].zones != null && $scope.pstructWS[i].zones.length != null && $scope.pstructWS[i].zones.length > 0){
	    				for(var z = 0; z < $scope.pstructWS[i].zones.length; z++){
	    					if($scope.pstructWS[i].zones[z] == zone.id){
			    				$scope.pstructWS[i].zones.splice(z,1);
			    				$scope.updatePstruct(1, $scope.pstructWS[i]);
			    			}
	    				}
	    			}
	    		}
	    		// Here I have to check and remove the zone id from the pms
	    		for(var i = 0; i < $scope.pmeterWS.length; i++){
	    			if($scope.pmeterWS[i].zones != null && $scope.pmeterWS[i].zones.length != null && $scope.pmeterWS[i].zones.length > 0){
	    				for(var z = 0; z < $scope.pmeterWS[i].zones.length; z++){
	    					if($scope.pmeterWS[i].zones[z] == zone.id){
			    				$scope.pmeterWS[i].zones.splice(z,1);
			    				$scope.updatePmeter(1, $scope.pmeterWS[i]);
			    			}
	    				}
	    			}
	    		}
	    		// Here I have to check and remove the zone id from the bps
	    		for(var i = 0; i < $scope.bpointWS.length; i++){
	    			if($scope.bpointWS[i].zones != null && $scope.bpointWS[i].zones.length != null && $scope.bpointWS[i].zones.length > 0){
	    				for(var z = 0; z < $scope.bpointWS[i].zones.length; z++){
	    					if($scope.bpointWS[i].zones[z] == zone.id){
			    				$scope.bpointWS[i].zones.splice(z,1);
			    				$scope.updateBpoint(1, $scope.bpointWS[i]);
			    			}
	    				}
	    			}
	    		}
	    		$scope.getAllZones(zone.type, zindex);
	    	} else {
	    		$scope.showDeletingZErrorMessage = true;
	    	}
	    });
	};
	
	// Zone prepare delete method
	$scope.setZRemove = function(zone){
		var sub = (zone.submacro != null) ? zone.submacro : ((zone.submicro != null) ? zone.submicro : null);
		var lbl = (sub) ? zone.name + "-" + sub : zone.name;
		var delZone = $dialogs.confirm("Attenzione", "Vuoi cancellare la zona '" + lbl + "'?");
			delZone.result.then(function(btn){
				// yes case
				$scope.deleteZone(zone);
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	//################################## Street Methods ###################################
	
	// Street retrieve method
	$scope.getAllStreets = function(){
		gMapService.loadMapsObject();	// To show modal waiting spinner
		$scope.mapStreetSelectedMarkers = [];
		$scope.geoStreets = [];
		var promiseStreets = streetService.getStreetsFromDb(showStreets);
		promiseStreets.then(function(result){
			$scope.streetWS = gMapService.initAllStreetObjects(result);
	    	if(showStreets) {
	    		gMapService.setStreetPolylines(gMapService.initStreetsOnMap($scope.streetWS, true, 1, false)[0]);
	    		$scope.resizeMap("viewStreet");
				var toHide = $scope.vStreetMap.shapes;
				$scope.vStreetMap.shapes = gMapService.hideAllStreets(result, toHide);
				$scope.geoStreets = gMapService.getStreetPolylines();
	    	}
	    	$scope.allAreaFilter = sharedDataService.getAreaFilter();
			$scope.streetAreaFilter = $scope.allAreaFilter[0].id;
			gMapService.closeLoadingMap();
		});
	};
	
	// Init Street details method
	$scope.setSDetails = function(street){
		$scope.sViewMapReady = false;
		$scope.mySpecialStreets = gMapService.setStreetMapDetails(street, 0);
		$scope.viewStreet = street;
		
		var toHide = $scope.vStreetMap.shapes;
		$scope.vStreetMap.shapes = gMapService.deleteStreetMapObject(street, toHide);
		
		// Here I add the street marker icon
	    var streetMarker = {
			id: 0 + "sm",
			position: street.geometry.points[1].lat + "," + street.geometry.points[1].lng,
			options: { 
				draggable: false,
			  	visible: true,
			   	map: null
			},
			icon: $scope.streetMarkerIcon,
			data: street,
			showWindow: false
		};
	    $scope.mapStreetSelectedMarkers.push(streetMarker);
		
		$scope.viewModeS = true;
		$scope.editModeS = false;
		$scope.sViewMapReady = true;
	};
	
	$scope.closeSView = function(){
		$scope.getAllStreets();	// to refresh the data on page
		$scope.viewModeS = false;
		$scope.editModeS = false;
	};
	
	var vehicleTypesList = [];
    var vehicleTypesNew = false;
    
    // Method used to inithialize the vehicle type slots configuration elements in street editing / creation (create the panels and select values)
    $scope.inithializeVehicleTypeList = function(activedSlotsConfiguration, type){
    	vehicleTypesList = initializeService.getSlotsTypesByObject(type);	//initializeService.getSlotsTypes();
    	for(var i = 0; i < vehicleTypesList.length; i++){
    		vehicleTypesList[i].show = false;
    	}
    	$scope.newVehicleList = angular.copy(vehicleTypesList);
    	if(activedSlotsConfiguration){
	    	for(var i = 0; i < activedSlotsConfiguration.length; i++){
	    		var found = false;
	    		for(var j = 0; (j < $scope.newVehicleList.length) && !found; j++)
	    		if($scope.newVehicleList[j].name == activedSlotsConfiguration[i].vehicleType){
	    			$scope.newVehicleList.splice(j, 1);
	    			found = true;
	    		}
	    	}
    	}
    };
    
    // Method used to add a new vehicle type slot configuration in a street
    $scope.addNewConfigurationSlots = function(newSlotsConf, type){
    	if(newSlotsConf != null && newSlotsConf.vehicleType && newSlotsConf.vehicleType != ""){
    		$scope.showErrorTypeReq = false;
    		$scope.isInitNS=true;
    		var newSlotConfiguration = {
    			vehicleType: newSlotsConf.vehicleType,
    			vehicleTypeActive: true,
    			handicappedSlotNumber: newSlotsConf.handicappedSlotNumber,
    			reservedSlotNumber: newSlotsConf.reservedSlotNumber,
    			timedParkSlotNumber:newSlotsConf.timedParkSlotNumber,
    			paidSlotNumber: newSlotsConf.paidSlotNumber,
    			freeParkSlotNumber: newSlotsConf.freeParkSlotNumber,
    			freeParkSlotSignNumber: newSlotsConf.freeParkSlotSignNumber,
    			rechargeableSlotNumber: newSlotsConf.rechargeableSlotNumber,
    			loadingUnloadingSlotNumber: newSlotsConf.loadingUnloadingSlotNumber,
    			pinkSlotNumber: newSlotsConf.pinkSlotNumber,
    			carSharingSlotNumber: newSlotsConf.carSharingSlotNumber
    		};
    		if(type == 0){
    			$scope.eStreet.slotsConfiguration.push(newSlotConfiguration);
    			$scope.inithializeVehicleTypeList($scope.eStreet.slotsConfiguration, type);
    		} else {
    			$scope.parkingStructure.slotsConfiguration.push(newSlotConfiguration);
    			$scope.inithializeVehicleTypeList($scope.parkingStructure.slotsConfiguration, type);
    		}
    		$scope.initVehicleType(type);
    		$scope.hideVehicleSlotsPanelNew();
    	} else {
    		$scope.showErrorTypeReq = true;
    		$scope.isInitNS=false;
    	}
    };
    
    // Method used to init the vehicle type for a new slot configuration creation (show the placeholder)
    $scope.initVehicleType = function(type){
    	if(type == 0){
	    	$scope.newSlotsConf = {
	    		vehicleType: "",
	    		vehicleTypeActive: false,
	    		handicappedSlotNumber: null,
    			reservedSlotNumber: null,
    			timedParkSlotNumber: null,
    			paidSlotNumber: null,
    			freeParkSlotNumber: null,
    			freeParkSlotSignNumber: null,
    			rechargeableSlotNumber: null,
    			loadingUnloadingSlotNumber: null,
    			pinkSlotNumber: null,
    			carSharingSlotNumber: null
	    	};
    	} else {
    		$scope.newSlotsConfPS = {
    			vehicleType: "",
    			vehicleTypeActive: false,
    			handicappedSlotNumber: null,
    			reservedSlotNumber: null,
    			timedParkSlotNumber: null,
    			paidSlotNumber: null,
    			freeParkSlotNumber: null,
    			freeParkSlotSignNumber: null,
    			rechargeableSlotNumber: null,
    			loadingUnloadingSlotNumber: null,
    			pinkSlotNumber: null,
    			carSharingSlotNumber: null
    		};
    	}
    };
    
    // Method used to delete a specific vehicle type slot configuration in street / ps (switched by type: 0 = street; 1 = ps)
    $scope.deleteVehicleTypeSlots = function(vehicleTypeSlots, type){
    	if(vehicleTypeSlots && vehicleTypeSlots.vehicleType){
    	var found = false
    		if(type == 0){
		    	for(var i = 0; (i < $scope.eStreet.slotsConfiguration.length) && !found; i++){
		    		if($scope.eStreet.slotsConfiguration[i].vehicleType == vehicleTypeSlots.vehicleType){
		    			$scope.eStreet.slotsConfiguration.splice(i, 1);	// remove the specific element from slot configuration list
		    			found = true;
		    		}
		    	}
	    		$scope.inithializeVehicleTypeList($scope.eStreet.slotsConfiguration, type);
    		} else {
    			for(var i = 0; (i < $scope.parkingStructure.slotsConfiguration.length) && !found; i++){
    	    		if($scope.parkingStructure.slotsConfiguration[i].vehicleType == vehicleTypeSlots.vehicleType){
    	    			$scope.parkingStructure.slotsConfiguration.splice(i, 1);	// remove the specific element from slot configuration list
    	    			found = true;
    	    		}
    	    	}
        		$scope.inithializeVehicleTypeList($scope.parkingStructure.slotsConfiguration, type);
    		}
    	}
    };
	
	// Init Streets edit data method
	$scope.setSEdit = function(street){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		$scope.isInitNS = true;
		$scope.myPms = [];
		$scope.myArea = null;
		$scope.myNewArea = null;
		gMapService.setMyNewArea(null);
		$scope.myZone0 = null;
		$scope.myZone1 = null;
		$scope.myZone2 = null;
		$scope.myZone3 = null;
		$scope.myZone4 = null;
		
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		$scope.allPms = sharedDataService.getSharedLocalPms();
		$scope.sZones0 = sharedDataService.getSharedLocalZones0();
		$scope.sZones1 = sharedDataService.getSharedLocalZones1();
		$scope.sZones2 = sharedDataService.getSharedLocalZones2();
		$scope.sZones3 = sharedDataService.getSharedLocalZones3();
		$scope.sZones4 = sharedDataService.getSharedLocalZones4();
		angular.copy($scope.allPms, $scope.myPms);
		$scope.setMyLineGeometry(null);
		
		// Polyline void object
		$scope.newStreet = {
			path: null,
			stroke: {
			    color: '#000000',
			    weight: 3
			},
			editable: true,
			draggable: true,
			visible: true,
			geodesic: false
		};
		
		// Case edit
		if(street != null){
			$scope.inithializeVehicleTypeList(street.slotsConfiguration, 0);
			poly.visible = false;		// here I hide the polyline for creation
			poly.setPath([]);			// and clear the path
			
			$scope.isEditing = true;
			$scope.isInit = false;
			angular.copy(street, $scope.eStreet);
		
			for(var i = 0; i < $scope.allArea.length; i++){
				if(street.rateAreaId == $scope.allArea[i].id){
					$scope.myArea = $scope.allArea[i];
				}
			}	
			for(var i = 0; i < street.zones.length; i++){
				var z0 = sharedDataService.getLocalZoneById(street.zones[i], 1, 0);
				var z1 = sharedDataService.getLocalZoneById(street.zones[i], 1, 1);
				var z2 = sharedDataService.getLocalZoneById(street.zones[i], 1, 2);
				var z3 = sharedDataService.getLocalZoneById(street.zones[i], 1, 3);
				var z4 = sharedDataService.getLocalZoneById(street.zones[i], 1, 4);
				if(z0 != null){
					$scope.myZone0 = z0;
				} else if(z1 != null){
					$scope.myZone1 = z1;
				} else if(z2 != null){
					$scope.myZone2 = z2;
				} else if(z3 != null){
					$scope.myZone3 = z3;
				} else if(z4 != null){
					$scope.myZone4 = z4;
				}
			}
			
			// I show only the pms in the same area of the street
			$scope.myPms = sharedDataService.getPmsFromArea($scope.allPms, $scope.myArea);
			for(var j = 0; j < $scope.myPms.length; j++){
				$scope.myPms[j].selected = false;
				if(street.parkingMeters){
					for(var i = 0; i < street.parkingMeters.length; i++){
						if($scope.myPms[j].id ==  street.parkingMeters[i]){	
							$scope.myPms[j].selected = true;
						}
					}
				}
			}
			
			if(street.geometry != null && street.geometry.points.length > 0){
				var tmpLine = "";
				for(var i = 0; i < street.geometry.points.length; i++){
					var tmpPoint = street.geometry.points[i].lat + "," + street.geometry.points[i].lng;
					tmpLine = tmpLine + tmpPoint + ",";
				}
				tmpLine = tmpLine.substring(0, tmpLine.length-1);
				$scope.setMyLineGeometry(tmpLine);
				var streetsList = gMapService.setStreetMapDetails(street, 1);
				$scope.editGStreet = (streetsList && streetsList.length > 0) ? streetsList[0] : {};
				
			} else {
				// case of street with geografic object not created
				poly.visible = true;					// here I show the polyline for creation
				if($scope.editGStreet != null){
					$scope.editGStreet.visible = false;	// and hide the edit polyline
				}
			}
		} else {
			$scope.inithializeVehicleTypeList(null, 0);
			gMapService.setMyNewArea({});
			poly.setPath([]);										// here I clear the old path
			poly.visible = true;									// here I show the polyline for creation
			if($scope.editGStreet != null){
				$scope.editGStreet.visible = false;					// and hide the edit polyline
			}
			$scope.eStreet = {
				id: null,
				id_app: null,
				streetReference: null,
				slotNumber: null,
				slotsConfiguration: [],
				/*handicappedSlotNumber: null,
				reservedSlotNumber: null,
				timedParkSlotNumber: null,
				freeParkSlotNumber: null,
				unusuableSlotNumber: null,*/
				color: null,
				rateAreaId: null,
				zones: null,
				parkingMeters: null,
				geometry: null
			};
		}
		$scope.initVehicleType(0);
		$scope.viewModeS = false;
		$scope.editModeS = true;
		$scope.resizeMapTimed("editStreet", false);
	};
	
	// Street update method
	$scope.updateStreet = function(form, street, area, zone0, zone1, zone2, zone3, zone4, pms){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingSErrorMessage = false;
			var editCorrectedPath = gMapService.updatePolylineInStreetEdit($scope.map, poly);
			var myStreetPromise = streetService.updateStreetInDb(street, area, zone0, zone1, zone2, zone3, zone4, pms, editCorrectedPath, 0, agencyId);
			myStreetPromise.then(function(result){
				if(result != null){ // == "OK"){
		    		$scope.getAllStreets();
		    		$scope.myZone0 = null;
		    		$scope.myZone1 = null;
		    		$scope.myZone2 = null;
		    		$scope.myZone3 = null;
		    		$scope.myZone4 = null;
					$scope.editModeS = false;
		    	} else {
		    		$scope.editModeS = true;
		    		$scope.showUpdatingSErrorMessage = true;
		    	}
			});
		}
	};
	
	// Used to update street relations with zones/parkingmeters
	$scope.updateStreetRel = function(street){
	   	var myDataPromise = streetService.updateStreetInDb(street, null, null, null, null, null, null, null, null, 1);
	    myDataPromise.then(function(result){
	    	if(result != null){ // == "OK"){
	    		$scope.getAllStreets();
	    	}	
	    });
	};
	
	// Street creation method
	$scope.createStreet = function(form, street, area, zone0, zone1, zone2, zone3, zone4, pms){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingSErrorMessage = false;
			
			var newCorrectedPath = [];
			var createdPath = poly.getPath();
			for(var i = 0; i < createdPath.length; i++){
				var point = gMapService.getPointFromLatLng(createdPath.b[i], 1);
				newCorrectedPath.push(point);
			};
			var myStreetPromise = streetService.createStreetInDb(street, area, zone0, zone1, zone2, zone3, zone4, pms, newCorrectedPath, agencyId);
		    myStreetPromise.then(function(result){
		    	if(result != null && result != ""){
		    		$scope.getAllStreets();
		    		$scope.myZone0 = null;
		    		$scope.myZone1 = null;
		    		$scope.myZone2 = null;
		    		$scope.myZone3 = null;
		    		$scope.myZone4 = null;
					$scope.editModeS = false;
		    	} else {
		    		$scope.editModeS = true;
		    		$scope.showUpdatingSErrorMessage = true;
		    	}
		    	// Here I try to clear the area and the polyline values
		    	area = null;
		    });
		}
	};
	
	// Street delete method
	$scope.deleteStreet = function(street){
		$scope.showDeletingSErrorMessage = false;
		var toDelStreet = gMapService.deleteStreetMapObject(street, $scope.vStreetMap.shapes);
		
    	var myStreetPromise = streetService.deleteStreetInDb(street, agencyId);
	    myStreetPromise.then(function(result){
	    	console.log("Deleted street: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		$scope.getAllStreets();
	    	} else {
	    		$scope.showDeletingSErrorMessage = true;
	    	}
	    });
	};
	
	// Street prepare delete method
	$scope.setSRemove = function(street){
		var delStreet = $dialogs.confirm("Attenzione", "Vuoi cancellare la via '" + street.streetReference + "'?");
			delStreet.result.then(function(btn){
				// yes case
				$scope.deleteStreet(street);
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	//################################## ParkingMeters Methods ###################################
	
	// Retrieve all PM objects from db
	$scope.getAllParkingMeters = function(){
		gMapService.loadMapsObject();	// To show modal waiting spinner
		$scope.editModePM = false;
		$scope.pmMapReady = false;
		var myDataPromise = parkingMeterService.getParkingMetersFromDb(showPm);
	    myDataPromise.then(function(result){
	    	$scope.pmeterWS = sharedDataService.getSharedLocalPms();
	    	$scope.initFiltersForPM();
	    	if(showPm)$scope.resizeMap("viewPm");
	    	$scope.parkingMetersMarkers = gMapService.getParkingMetersMarkers();
	    	$scope.pmMapReady = true;
	    	gMapService.closeLoadingMap();
	    });
	};
	
	// ParkingMeters load details method
	$scope.setPmDetails = function(parkingMeter){
		$scope.pmViewMapReady = false;
		$scope.mySpecialPMMarkers = [];
		$scope.viewParckingMeter = parkingMeter;
		
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		for(var i = 0; i < $scope.allArea.length; i++){
			if(parkingMeter.areaId == $scope.allArea[i].id){
				$scope.myArea = $scope.allArea[i];
			}
		}
		
		var toRemLat = 0;
		var toRemLng = 0;
		var sLat = "" + parkingMeter.geometry.lat;
		var sLng = "" + parkingMeter.geometry.lng;
		if(sLat.length > $scope.gpsLength){
			toRemLat = sLat.length - $scope.gpsLength;
		}
		if(sLng.length > $scope.gpsLength){
			toRemLng = sLng.length - $scope.gpsLength;
		}
		//$scope.setMyGeometry(sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng));
		$scope.parckingMeter.myGeometry = sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng);
		
		$scope.pViewMetersMarkers = $scope.parkingMetersMarkers;
		for(var i = 0; i < $scope.pViewMetersMarkers.length; i++){
			if($scope.pViewMetersMarkers[i].title == parkingMeter.code){
				$scope.pViewMetersMarkers.splice(i, 1);
			};
		}
		
		$scope.mySpecialPMMarkers = gMapService.setParkingMeterMapDetails(parkingMeter, 0);
		$scope.viewModePM = true;
		$scope.editModePM = false;
		$scope.pmViewMapReady = true;
	};
	
	$scope.closeView = function(){
		$scope.mySpecialPMMarkers = [];
		$scope.getAllParkingMeters();	// to refresh the data on page
		$scope.viewModePM = false;
		$scope.editModePM = false;
	};
	
	// ParkingMeters edit data load
	$scope.setPmEdit = function(parkingMeter){
		$scope.editPmMarkers = [];
		$scope.newPmMarkers = [];
		// zones management
		$scope.myPmZone0 = null;
		$scope.myPmZone1 = null;
		$scope.myPmZone2 = null;
		$scope.myPmZone3 = null;
		$scope.myPmZone4 = null;
		//$scope.myPmStatus = $scope.listaStati[0];	// default is active TODO: correct!!!
		$scope.pmZones0 = sharedDataService.getSharedLocalZones0();
		$scope.pmZones1 = sharedDataService.getSharedLocalZones1();
		$scope.pmZones2 = sharedDataService.getSharedLocalZones2();
		$scope.pmZones3 = sharedDataService.getSharedLocalZones3();
		$scope.pmZones4 = sharedDataService.getSharedLocalZones4();
		
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		$scope.myArea = {};
		
		// Case edit
		if(parkingMeter != null){
			$scope.isEditing = true;
			$scope.isInit = false;
			if(parkingMeter.zones){
				for(var i = 0; i < parkingMeter.zones.length; i++){
					var z0 = $scope.getLocalZoneById(parkingMeter.zones[i], 1, 0);
					var z1 = $scope.getLocalZoneById(parkingMeter.zones[i], 1, 1);
					var z2 = $scope.getLocalZoneById(parkingMeter.zones[i], 1, 2);
					var z3 = $scope.getLocalZoneById(parkingMeter.zones[i], 1, 3);
					var z4 = $scope.getLocalZoneById(parkingMeter.zones[i], 1, 4);
					if(z0 != null){
						$scope.myPmZone0 = z0;
					} else if(z1 != null){
						$scope.myPmZone1 = z1;
					} else if(z2 != null){
						$scope.myPmZone2 = z2;
					} else if(z3 != null){
						$scope.myPmZone3 = z3;
					} else if(z4 != null){
						$scope.myPmZone4 = z4;
					}
				}
			}
			
			pmEditCode = parkingMeter.code;	// Here I temporary store the value of the actual code
			angular.copy(parkingMeter, $scope.parckingMeter);
			for(var i = 0; i < $scope.allArea.length; i++){
				if(parkingMeter.areaId == $scope.allArea[i].id){
					$scope.myArea = $scope.allArea[i];
				}
			}
			
			//$scope.setMyGeometry(parkingMeter.geometry.lat + "," + parkingMeter.geometry.lng);
			$scope.parckingMeter.myGeometry = parkingMeter.geometry.lat + "," + parkingMeter.geometry.lng
			$scope.editPmMarkers = gMapService.setParkingMeterMapDetails(parkingMeter, 1);
			
		} else {
			//$scope.setMyGeometry(null);
			$scope.parckingMeter = {
				id: null,
				code: null,
				note: null,
				status: "",
				areaId: null,
				zones: null,
				geometry: null
			};
			$scope.parckingMeter.myGeometry = null;
		}
		$scope.viewModePM = false;
		$scope.editModePM = true;
		$scope.resizeMapTimed("editPm", false);
	};
	
	// Update parkingMeter Object
	$scope.updatePmeter = function(type, pm, form, area, geometry, zone0, zone1, zone2, zone3, zone4){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			//if(form.pStatus.$dirty){	// if pm status value is dirty
			//	status = form.pStatus.$modelValue;	// force to use form value;
			//}
			
			var myDataPromise = parkingMeterService.updatePmeterInDb(pm, area, zone0, zone1, zone2, zone3, zone4, geometry, type, agencyId);
		    myDataPromise.then(function(result){
		    	if(result != null){ // == "OK"){
		    		$scope.getAllParkingMeters();
		    		$scope.editModePM = false;
		    		$scope.myPmZone0 = null;
		    		$scope.myPmZone1 = null;
		    		$scope.myPmZone2 = null;
		    		$scope.myPmZone3 = null;
		    		$scope.myPmZone4 = null;
		    		$scope.mySpecialPMMarkers = [];
		    	} else {
		    		$scope.editModePM = true;
		    		$scope.showUpdatingErrorMessage = true;
		    	}
		    	
		    	if(isPMCodeUpdated){
			    	// Case of update of code: I have to align the street
				    for(var i = 0; i < $scope.streetWS.length; i++){
				    	if($scope.streetWS[i].parkingMeters != null && $scope.streetWS[i].parkingMeters.length > 0){
				    		for(var p = 0; p < $scope.streetWS[i].parkingMeters.length; p++){
				    			if($scope.streetWS[i].parkingMeters[p] == oldCode){
				    				$scope.streetWS[i].parkingMeters[p] = pm.code;	// Update the pm code in street pm list
				    				$scope.updateStreetRel($scope.streetWS[i]);
				    			}
				    		}
				    	}
				    }
				    oldCode = "";	// clear the code of the pm
			    }
		    });
		}
	};
	
	// ParkingMeter create object method
	$scope.createPmeter = function(form, pm, area, geometry, zone0, zone1, zone2, zone3, zone4){
		if(!form.$valid || showPMErrorCode){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingErrorMessage = false;
			var myDataPromise = parkingMeterService.createParkingMeterInDb(pm, area, zone0, zone1, zone2, zone3, zone4, geometry, agencyId);
			myDataPromise.then(function(result){
		    	if(result != null && result != ""){
		    		$scope.getAllParkingMeters();
		    		$scope.myPmZone0 = null;
		    		$scope.myPmZone1 = null;
		    		$scope.myPmZone2 = null;
		    		$scope.myPmZone3 = null;
		    		$scope.myPmZone4 = null;
		    		$scope.editModePM = false;
		    	} else {
		    		$scope.editModePM = true;
		    		$scope.showUpdatingErrorMessage = true;
		    	}
		    });
		}
	};
	
	// ParkingMeter delete method
	$scope.deletePMeter = function(pMeter){
		$scope.showDeletingPMErrorMessage = false;
		
	   	var myDataPromise = parkingMeterService.deleteParkingMeterInDb(pMeter, agencyId);
	    myDataPromise.then(function(result){
	    	console.log("Deleted parkingmeter: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		// Here I have to remove the pmCode from the street
	    		for(var i = 0; i < $scope.streetWS.length; i++){
			    	if($scope.streetWS[i].parkingMeters != null && $scope.streetWS[i].parkingMeters.length > 0){
			    		for(var p = 0; p < $scope.streetWS[i].parkingMeters.length; p++){
			    			if($scope.streetWS[i].parkingMeters[p] == pMeter.code){
			    				$scope.streetWS[i].parkingMeters.splice(p,1);
			    				$scope.updateStreetRel($scope.streetWS[i]);
			    			}
			    		}
			    	}
			    }
	    		$scope.getAllParkingMeters();
	    	} else {
	    		$scope.showDeletingPMErrorMessage = true;
	    	}
	    });
	};
	
	// ParkingMeter prepare delete method
	$scope.setPmRemove = function(pMeter){
		var delParking = $dialogs.confirm("Attenzione", "Vuoi cancellare il parchimetro con codice '" + pMeter.code + "'?");
			delParking.result.then(function(btn){
				// yes case
				$scope.deletePMeter(pMeter);
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	//################################## ParkingStructures Methods ###################################
	
	// Method to retrieve all parkingStructures from db
	$scope.getAllParkingStructures = function(){
		gMapService.loadMapsObject();	// To show modal waiting spinner
		//var markers = [];
		var myDataPromise = structureService.getParkingStructuresFromDb(showPs);
		myDataPromise.then(function(result){
			$scope.pstructWS = result;
			if(showPs){
				var pMarkers = gMapService.getParkingStructuresMarkers();
				$scope.parkingStructureMarkers = (pMarkers) ? pMarkers : [];
				$scope.resizeMap("viewPs");
				gMapService.closeLoadingMap();
			}
		});
	};
	
	// ParkingStructures details method
	$scope.setPsDetails = function(parkingStructure){
		$scope.mySpecialPSMarkers = [];
		$scope.viewParkingStructure = parkingStructure;
		
		if(parkingStructure.openingTime != null){
			$scope.openingPeriods = parkingStructure.openingTime.period;
		}
		
		var toRemLat = 0;
		var toRemLng = 0;
		var sLat = "" + parkingStructure.geometry.lat;
		var sLng = "" + parkingStructure.geometry.lng;
		if(sLat.length > $scope.gpsLength){
			toRemLat = sLat.length - $scope.gpsLength;
		}
		if(sLng.length > $scope.gpsLength){
			toRemLng = sLng.length - $scope.gpsLength;
		}
		//$scope.setMyGeometry(sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng));
		$scope.parkingStructure.myGeometry = sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng);
		$scope.myPaymentMode = sharedDataService.castMyPaymentModeToString(parkingStructure.paymentMode);
		
		$scope.pViewStructMarkers = $scope.parkingStructureMarkers;
		for(var i = 0; i < $scope.pViewStructMarkers.length; i++){
			if($scope.pViewStructMarkers[i].title == parkingStructure.id){
				$scope.pViewStructMarkers.splice(i, 1);
			};
		}
		
		$scope.mySpecialPSMarkers = gMapService.setParkingStructureMapDetails(parkingStructure, 0);
		$scope.viewModePS = true;
		$scope.editModePS = false;
	};
	
	$scope.closePSView = function(){
		$scope.mySpecialPSMarkers = [];
		$scope.getAllParkingStructures();	// to refresh the data on page
		$scope.viewModePS = false;
		$scope.editModePS = false;
	};
	
	// ParkingStructure init edit data method
	$scope.setPsEdit = function(parkingStruct){
		var d = new Date(0);
		d.setHours(0);
		d.setMinutes(0);
		$scope.startTime = d;
		$scope.endTime = d;
		// zones management
		$scope.myPsZone0 = null;
		$scope.myPsZone1 = null;
		$scope.myPsZone2 = null;
		$scope.myPsZone3 = null;
		$scope.myPsZone4 = null;
		$scope.psZones0 = sharedDataService.getSharedLocalZones0();
		$scope.psZones1 = sharedDataService.getSharedLocalZones1();
		$scope.psZones2 = sharedDataService.getSharedLocalZones2();
		$scope.psZones3 = sharedDataService.getSharedLocalZones3();
		$scope.psZones4 = sharedDataService.getSharedLocalZones4();
				
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
		$scope.editPsMarkers = [];
		$scope.newPsMarkers = [];
		
		$scope.allManagers = sharedDataService.getPsManagerVals();
		
		$scope.myPayment = {
			cash_checked: false,
			automated_teller_checked: false,
			prepaid_card_checked: false,
			parcometro_checked: false
		};
		$scope.openingPeriods = [];
		
		// Case edit
		if(parkingStruct != null){
			$scope.inithializeVehicleTypeList(parkingStruct.slotsConfiguration, 1);
			$scope.isEditing = true;
			$scope.isInit = false;
			if(parkingStruct.zones){
				for(var i = 0; i < parkingStruct.zones.length; i++){
					var z0 = gMapService.getLocalZoneById(parkingStruct.zones[i], 1, 0);
					var z1 = gMapService.getLocalZoneById(parkingStruct.zones[i], 1, 1);
					var z2 = gMapService.getLocalZoneById(parkingStruct.zones[i], 1, 2);
					var z3 = gMapService.getLocalZoneById(parkingStruct.zones[i], 1, 3);
					var z4 = gMapService.getLocalZoneById(parkingStruct.zones[i], 1, 4);
					if(z0 != null){
						$scope.myPsZone0 = z0;
					} else if(z1 != null){
						$scope.myPsZone1 = z1;
					} else if(z2 != null){
						$scope.myPsZone2 = z2;
					} else if(z3 != null){
						$scope.myPsZone3 = z3;
					} else if(z4 != null){
						$scope.myPsZone4 = z4;
					}
				}
			}
			
			if(parkingStruct.openingTime != null){
				$scope.openingPeriods = parkingStruct.openingTime.period;
			}
			
			angular.copy(parkingStruct, $scope.parkingStructure);
			$scope.myPayment = sharedDataService.checkMyPaymentMode(parkingStruct.paymentMode, $scope.myPayment);
			//$scope.setMyGeometry(parkingStruct.geometry.lat + "," + parkingStruct.geometry.lng);
			$scope.parkingStructure.myGeometry = parkingStruct.geometry.lat + "," + parkingStruct.geometry.lng;
			$scope.editPsMarkers = gMapService.setParkingStructureMapDetails(parkingStruct, 1);
			
		} else {
			$scope.inithializeVehicleTypeList(null, 1);
			//$scope.setMyGeometry(null);
			$scope.parkingStructure = {
				name: null,
				streetReference: null,
				managementMode: null,
				paymentMode: null,
				phoneNumber: null,
				fee: null,
				timeSlot: null,
				slotNumber: null,
				slotsConfiguration: [],
				/*handicappedSlotNumber: null,
				unusuableSlotNumber: null,*/
				zones: null,
				geometry: null
			};
			$scope.parkingStructure.myGeometry = null;
		}
		$scope.initVehicleType(1);
		$scope.viewModePS = false;
		$scope.editModePS = true;
		$scope.resizeMapTimed("editPs", false);
	};
	
	// ParkingStructure prepare delete method
	$scope.setPsRemove = function(pStruct){
		var delStruct = $dialogs.confirm("Attenzione", "Vuoi cancellare la struttura '" + pStruct.name + "'?");
			delStruct.result.then(function(btn){
				// yes case
				$scope.deletePStruct(pStruct);
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	// Update ParkingStructure Object
	$scope.updatePstruct = function(type, ps, form, paymode, geo, req, zone0, zone1, zone2, zone3, zone4){
		if(!form.$valid){
			$scope.isInit=false;
			if(!$scope.checkCorrectPaymode(paymode, req)){
				$scope.setMyPaymentoErrMode(true);
			} else {
				$scope.setMyPaymentoErrMode(false);
			}
		} else {
			if(!$scope.checkCorrectPaymode(paymode, req)){
				$scope.isInit=false;
				$scope.setMyPaymentoErrMode(true);
			} else {
				$scope.isInit=true;
				$scope.showUpdatingPSErrorMessage = false;
				$scope.setMyPaymentoErrMode(false);
				
				var myStructurePromise = structureService.updateParkingStructureInDb(ps, paymode, zone0, zone1, zone2, zone3, zone4, geo, type, agencyId);
				myStructurePromise.then(function(result){
					if(result != null){ // == "OK"){
			    		$scope.getAllParkingStructures();
						$scope.editModePS = false;
						$scope.myPsZone0 = null;
			    		$scope.myPsZone1 = null;
			    		$scope.myPsZone2 = null;
			    		$scope.myPsZone3 = null;
			    		$scope.myPsZone4 = null;
						$scope.mySpecialPSMarkers = [];
			    	} else {
			    		$scope.editModePS = true;
			    		$scope.showUpdatingPSErrorMessage = true;
			    	}
				});
			}
		}	
	};
	
	// ParkingStructure creation method
	$scope.createPstruct = function(form, ps, paymode, geo, req, zone0, zone1, zone2, zone3, zone4){
		if(!form.$valid){
			$scope.isInit=false;
			if(!$scope.checkCorrectPaymode(paymode, req)){
				$scope.setMyPaymentoErrMode(true);
			} else {
				$scope.setMyPaymentoErrMode(false);
			}
		} else {
			if(!$scope.checkCorrectPaymode(paymode, req)){
				$scope.isInit=false;
				$scope.setMyPaymentoErrMode(true);
			} else {
				$scope.isInit=true;
				$scope.showUpdatingPSErrorMessage = false;
				$scope.setMyPaymentoErrMode(false);
				
				var myPSPromise = structureService.createParkingStructureInDb(ps, paymode, zone0, zone1, zone2, zone3, zone4, geo, agencyId);
				myPSPromise.then(function(result){
			    	if(result != null && result != ""){
			    		$scope.getAllParkingStructures();
						$scope.editModePS = false;
						$scope.myPsZone0 = null;
						$scope.myPsZone1 = null;
						$scope.myPsZone2 = null;
						$scope.myPsZone3 = null;
						$scope.myPsZone4 = null;
			    	} else {
			    		$scope.editModePS = true;
			    		$scope.showUpdatingPSErrorMessage = true;
			    	}
			    });
				
			}
		}
	};
	
	// ParkingStructure
	$scope.deletePStruct = function(pStruct){
		$scope.showDeletingPSErrorMessage = false;
		var myPSPromise = structureService.deleteParkingStructureInDb(pStruct, agencyId);
		myPSPromise.then(function(result){
	    	if(result != null && result != ""){
	    		$scope.getAllParkingStructures();
	    	} else {
	    		$scope.showDeletingPSErrorMessage = true;
	    	}
	    });
	};
	
	// ##################################### Bike point methods #######################################
	
	// Method to retrieve all bike points
	$scope.getAllBikePoints = function(){
		gMapService.loadMapsObject();	// To show modal waiting spinner
		$scope.bikePointMarkers = [];
		$scope.bpMapReady = false;
		var allBpoints = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = bikePointService.getBikePointsFromDb(showBp);
		myDataPromise.then(function(allBpoints){
	    	$scope.bpointWS = sharedDataService.getSharedLocalBps();
	    	if(showBp){
	    		$scope.resizeMap("viewBike");
	    		$scope.bikePointMarkers = gMapService.getBikePointsMarkers();
	    	}
	    	$scope.bpMapReady = true;
	    	gMapService.closeLoadingMap();
	    });
	};
	
	// BikePoints load details data method
	$scope.setBpDetails = function(bikePoint){
		$scope.bpViewMapReady = false;
		$scope.mySpecialBPMarkers = [];
		
		$scope.bikePoint = bikePoint;
		var toRemLat = 0;
		var toRemLng = 0;
		var sLat = "" + bikePoint.geometry.lat;
		var sLng = "" + bikePoint.geometry.lng;
		if(sLat.length > $scope.gpsLength){
			toRemLat = sLat.length - $scope.gpsLength;
		}
		if(sLng.length > $scope.gpsLength){
			toRemLng = sLng.length - $scope.gpsLength;
		}
		//$scope.setMyGeometry(sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng));
		$scope.bikePoint.myGeometry = sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng);
		
		$scope.pViewBikeMarkers = $scope.bikePointMarkers;
		for(var i = 0; i < $scope.pViewBikeMarkers.length; i++){
			if($scope.pViewBikeMarkers[i].title == $scope.bikePoint.id){
				$scope.pViewBikeMarkers.splice(i, 1);
			};
		}
		
		$scope.mySpecialBPMarkers = gMapService.setBikePointMapDetails(bikePoint, 0);
		$scope.viewModeBP = true;
		$scope.editModeBP = false;
		$scope.bpViewMapReady = true;
	};
	
	$scope.closeBPView = function(){
		$scope.mySpecialBPMarkers = [];
		$scope.getAllBikePoints();	// to refresh the data on page
		$scope.viewModeBP = false;
		$scope.editModeBP = false;
	};
	
	// BikePoint load edit details method
	$scope.setBpEdit = function(bikePoint){
		$scope.mySpecialBPMarkers = [];
		$scope.editBikePointMarkers = [];
		$scope.newBikePointMarkers = [];
		// zones management
		$scope.myBpZone0 = null;
		$scope.myBpZone1 = null;
		$scope.myBpZone2 = null;
		$scope.myBpZone3 = null;
		$scope.myBpZone4 = null;
		$scope.bpZones0 = sharedDataService.getSharedLocalZones0();
		$scope.bpZones1 = sharedDataService.getSharedLocalZones1();
		$scope.bpZones2 = sharedDataService.getSharedLocalZones2();
		$scope.bpZones3 = sharedDataService.getSharedLocalZones3();
		$scope.bpZones4 = sharedDataService.getSharedLocalZones4();
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		//$scope.resizeMap();
		$scope.bikePoint = {
			id: null,
			id_app: null,
			name: null,
			slotNumber: null,
			bikeNumber: null,
			zones: null,
			geometry: null
		};
		
		// Case edit
		if(bikePoint != null){
			$scope.isEditing = true;
			$scope.isInit = false;
			angular.copy(bikePoint, $scope.bikePoint);
			
			if(bikePoint.zones){
				for(var i = 0; i < bikePoint.zones.length; i++){
					var z0 = gMapService.getLocalZoneById(bikePoint.zones[i], 1, 0);
					var z1 = gMapService.getLocalZoneById(bikePoint.zones[i], 1, 1);
					var z2 = gMapService.getLocalZoneById(bikePoint.zones[i], 1, 2);
					var z3 = gMapService.getLocalZoneById(bikePoint.zones[i], 1, 3);
					var z4 = gMapService.getLocalZoneById(bikePoint.zones[i], 1, 4);
					if(z0 != null){
						$scope.myBpZone0 = z0;
					} else if(z1 != null){
						$scope.myBpZone1 = z1;
					} else if(z2 != null){
						$scope.myBpZone2 = z2;
					} else if(z3 != null){
						$scope.myBpZone3 = z3;
					} else if(z4 != null){
						$scope.myBpZone4 = z4;
					}
				}
			}
			//$scope.setMyGeometry(bikePoint.geometry.lat + "," + bikePoint.geometry.lng);
			$scope.bikePoint.myGeometry = bikePoint.geometry.lat + "," + bikePoint.geometry.lng;
			$scope.editBikePointMarkers = gMapService.setBikePointMapDetails(bikePoint, 1);
			
		} else {
			//$scope.setMyGeometry(null);
			$scope.bikePoint.myGeometry = null;
		}
		$scope.viewModeBP = false;
		$scope.editModeBP = true;
		$scope.resizeMapTimed("editBike", false);
	};
	
	// Update BikePoint Object
	$scope.updateBpoint = function(type, bp, form, geo, zone0, zone1, zone2, zone3, zone4){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingBPErrorMessage = false;
			//var bp = $scope.bikePoint;
			var myDataPromise = bikePointService.updateBikePointInDb(bp, zone0, zone1, zone2, zone3, zone4, geo, type, agencyId);
			myDataPromise.then(function(result){
		    	if(result != null){//== "OK"){
		    		$scope.getAllBikePoints();
		    		$scope.myBpZone0 = null;
		    		$scope.myBpZone1 = null;
		    		$scope.myBpZone2 = null;
		    		$scope.myBpZone3 = null;
		    		$scope.myBpZone4 = null;
					$scope.editModeBP = false;
		    	} else {
		    		$scope.editModeBP = true;
		    		$scope.showUpdatingBPErrorMessage = true;
		    	}
		    });
		}
	};
	
	// Create BikePoint object
	$scope.createBpoint = function(form, bp, geo, zone0, zone1, zone2, zone3, zone4){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingBPErrorMessage = false;
			var myDataPromise = bikePointService.createBikePointInDb(bp, zone0, zone1, zone2, zone3, zone4, geo, agencyId);
			myDataPromise.then(function(result){
		    	if(result != null && result != ""){
		    		$scope.getAllBikePoints();
		    		$scope.myBpZone0 = null;
					$scope.myBpZone1 = null;
					$scope.myBpZone2 = null;
					$scope.myBpZone3 = null;
					$scope.myBpZone4 = null;
					$scope.editModeBP = false;
		    	} else {
		    		$scope.editModeBP = true;
		    		$scope.showUpdatingBPErrorMessage = true;
		    	}
		    });
		}
	};
	
	// BikePoint
	$scope.deleteBPoint = function(bPoint){
		$scope.showDeletingBPErrorMessage = false;
		var myDataPromise = bikePointService.deleteBikePointInDb(bPoint, agencyId);
		myDataPromise.then(function(result){
	    	console.log("Deleted bikePoint: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		$scope.getAllBikePoints();
	    	} else {
	    		$scope.showDeletingBPErrorMessage = true;
	    	}
	    });
	};
	
	// BikePoint prepare delete method
	$scope.setBpRemove = function(bPoint){
		var delBike = $dialogs.confirm("Attenzione", "Vuoi cancellare il punto bici '" + bPoint.name + "'?");
			delBike.result.then(function(btn){
				// yes case
				$scope.deleteBPoint(bPoint);
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	
	// Maps management
	$scope.parkingMetersMarkers = [];
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	$scope.pmMarkerIcon = "imgs/parkingMeterIcons/parcometro_general.png";			// icon for parkingMeter object
	$scope.psMarkerIcon = "imgs/structIcons/parking_structures_general_outline.png";	// icon for parkingStructure object
	$scope.bpMarkerIcon = "imgs/bikeIcons/bicicle_outline.png";				// icon for bikePoint object
	$scope.streetMarkerIcon = "imgs/street_marker.png";					// icon for street marker
	
	$scope.refreshMap = function(map) {
        //optional param if you want to refresh you can pass null undefined or false or empty arg
        map.control.refresh(map.center);
        map.control.getGMap().setZoom(5);
        map.control.getGMap().setZoom(map.zoom);
    };
	
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
		zoom : sharedDataService.getConfMapZoom(),
		styles : myStyles
	};
	
	$scope.getCorrectMap = function(type){
		var map = null;
		switch(type){
			case "viewArea":
				map = $scope.vAreaMap;
				break;
			case "editArea":
				map = $scope.eAreaMap;
				break;
			case "viewStreet":
				map = $scope.vStreetMap;
				break;
			case "editStreet":
				map = $scope.eStreetMap;
				break;
			case "viewPm":
				map = $scope.vPmMap;
				break;
			case "editPm":
				map = $scope.ePmMap;
				break;
			case "viewPs":
				map = $scope.vPsMap;
				break;
			case "editPs":
				map = $scope.ePsMap;	
				break;
			case "viewZone0":
				map = $scope.vZoneMap0;
				break;
			case "editZone0":
				map = $scope.eZoneMap0;	
				break;
			case "viewZone1":
				map = $scope.vZoneMap1;
				break;
			case "editZone1":
				map = $scope.eZoneMap1;	
				break;
			case "viewZone2":
				map = $scope.vZoneMap2;
				break;
			case "editZone2":
				map = $scope.eZoneMap2;	
				break;
			case "viewZone3":
				map = $scope.vZoneMap3;
				break;
			case "editZone3":
				map = $scope.eZoneMap3;	
				break;
			case "viewZone4":
				map = $scope.vZoneMap4;
				break;
			case "editZone4":
				map = $scope.eZoneMap4;	
				break;
			case "editZoneCenter0":
				map = $scope.eZoneCenter0;
				break;
			case "editZoneCenter1":
				map = $scope.eZoneCenter1;
				break;
			case "editZoneCenter2":
				map = $scope.eZoneCenter2;
				break;
			case "editZoneCenter3":
				map = $scope.eZoneCenter3;
				break;
			case "editZoneCenter4":
				map = $scope.eZoneCenter4;
				break;
			case "viewMicroZone":
				map = $scope.vMicroZoneMap;
				break;
			case "editMicroZone":
				map = $scope.eMicroZoneMap;	
				break;	
			case "viewBike":
				map = $scope.vBpMap;
				break;
			case "editBike":
				map = $scope.eBpMap;	
				break;	
			default:
				break;
		}
		return map;
	};
	
	//$scope.map = gMapService.getMap();
	
	// I need this to resize the map (gray map problem on load)
    $scope.resizeMap = function(type){
    	$scope.map = $scope.getCorrectMap(type);
    	if($scope.map != null){ 	// the first time I show the area map it is null
    		google.maps.event.trigger($scope.map, 'resize');
    		$scope.map.setCenter(gMapService.getPointFromLatLng($scope.mapOption.center, 2));
    	    $scope.map.setZoom(parseInt($scope.mapOption.zoom));
    	}
        return true;
    };
    
    $scope.resizeMapTimed = function(type, center){
    	$scope.map = $scope.getCorrectMap(type);
    	$timeout(function(){ 
    		google.maps.event.trigger($scope.map, 'resize');
    		$scope.map.setCenter(gMapService.getPointFromLatLng($scope.mapOption.center, 2));
    		if(center)$scope.map.setZoom(parseInt($scope.mapOption.zoom));
    	}, 1000);
    };
	
    //For Area
    var garea = garea = new google.maps.Polygon({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillColor: '#000000',
        fillOpacity: 0.4,
        editable:true,
        draggable:true,
        visible:true
    });
    
	//For Street
    var poly = poly = new google.maps.Polyline({
        strokeColor: ($scope.myNewArea != null)?$scope.correctColor($scope.myNewArea.color):'#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        editable:true,
        draggable:true,
        visible:true
    });
    
    //For Zone
    var gzone = gzone = new google.maps.Polygon({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillColor: '#000000',
        fillOpacity: 0.35,
        editable:true,
        draggable:true,
        visible:true
    }); 
    
    $scope.$on('mapInitialized', function(evt, map) {
    	switch(map.id){
	    	case "viewArea":
	    		$scope.vAreaMap = map;
	    		$scope.vAreaMap.mouseover = function(data){
	    			return $scope.completeAreaData(data);
	    		}
	    		break;
	    	case "editArea":
	    		$scope.eAreaMap = map;
	    		garea.setMap(map);
	    		break;	
	    	case "viewStreet":
	    		$scope.vStreetMap = map;
	    		break;
	    	case "editStreet":
	    		$scope.eStreetMap = map;
	    		poly.setMap(map);
	    		break;
	    	case "viewPm":
	    		$scope.vPmMap = map;
	    		break;
	    	case "editPm":
	    		$scope.ePmMap = map;
	    		break;	
	    	case "viewPs":
	    		$scope.vPsMap = map;
	    		break;
	    	case "editPs":
	    		$scope.ePsMap = map;
	    		break;
	    	case "viewZone0":
	    		$scope.vZoneMap0 = map;
	    		break;
	    	case "editZone0":
	    		$scope.eZoneMap0 = map;
	    		gzone.setMap(map);
	    		break;
	    	case "viewZone1":
	    		$scope.vZoneMap1 = map;
	    		break;
	    	case "editZone1":
	    		$scope.eZoneMap1 = map;
	    		gzone.setMap(map);
	    		break;
	    	case "viewZone2":
	    		$scope.vZoneMap2 = map;
	    		break;
	    	case "editZone2":
	    		$scope.eZoneMap2 = map;
	    		gzone.setMap(map);
	    		break;
	    	case "viewZone3":
	    		$scope.vZoneMap3 = map;
	    		break;
	    	case "editZone3":
	    		$scope.eZoneMap3 = map;
	    		gzone.setMap(map);
	    		break;
	    	case "viewZone4":
	    		$scope.vZoneMap4 = map;
	    		break;
	    	case "editZone4":
	    		$scope.eZoneMap4 = map;
	    		gzone.setMap(map);
	    		break;
	    	case "editZoneCenter0":
				$scope.eZoneCenter0 = map;
				break;
			case "editZoneCenter1":
				$scope.eZoneCenter1 = map;
				break;
			case "editZoneCenter2":
				$scope.eZoneCenter2 = map;
				break;
			case "editZoneCenter3":
				$scope.eZoneCenter3 = map;
				break;
			case "editZoneCenter4":
				$scope.eZoneCenter4 = map;
				break;	
	    	case "viewMicroZone":
	    		$scope.vMicroZoneMap = map;
	    		break;
	    	case "editMicroZone":
	    		$scope.eMicroZoneMap = map;
	    		break;	
	    	case "viewBike":
	    		$scope.vBpMap = map;
	    		break;
	    	case "editBike":
	    		$scope.eBpMap = map;
	    		break;	
	    	default: break;
    	}
    });
	
    $scope.removeAllNewPolygons = function(){
    	garea.setMap(null);
    	garea.setPath([]);				// and clear the path
		// Here i check if there are old 'create/edit' polygons in editAreaMap and remove them from it
		if($scope.allNewAreas != null && $scope.allNewAreas.length > 0){
			for(var i = 0; i < $scope.allNewAreas.length; i++){
				$scope.allNewAreas[i].visible = false;
				$scope.allNewAreas[i].setMap(null);			// I clean the edit map form old polygons
			}
			$scope.allNewAreas = [];
		}
    };
    
    $scope.removeLastNewPolygon = function(){
    	garea.setMap(null);
    	garea.setPath([]);				// and clear the path
    };
    
    $scope.removeAreaPath = function(event, value){
    	var found = false;
    	console.log("Area to remove" + JSON.stringify(value)); 
    	for(var i = 0; !found && (i < $scope.editGAreas.length); i++){
    		if($scope.editGAreas[i].id == value.id){
    			$scope.eAreaMap.shapes[$scope.editGAreas[i].id].setMap(null);
    			$scope.vAreaMap.shapes[$scope.editGAreas[i].id].setMap(null);	//remove polygon from area view map too
    			$scope.editGAreas.splice(i, 1);
    			found = true;
    		}
    	}
    	if(!found){
    		garea.setPath([]);
    		garea.setMap(null);
    	}
    };
    
	$scope.addAreaPath = function(event){
	    var path = garea.getPath();
	    if(path.length == 0){
		    //$scope.getStreetAddress(event);	// Retrieve the address from the map
		    $scope.myAreaPath = [];
	    }
	    path.push(event.latLng);
	    var myPoint = gMapService.getPointFromLatLng(event.latLng, 1);
	    $scope.myAreaPath.push(myPoint);
	    $scope.setMyPolGeometry($scope.myAreaPath);
	    garea.setPath(path);
	    garea.setMap($scope.map);
	};
	
	$scope.addNewAreaPath = function(event){
		// Check if I am in creation or update operation
		if($scope.editGAreas != null &&  $scope.editGAreas.length > 0){
			$scope.aEditAddingPolygon = true;	//editing
			if(garea.visible){
				$scope.editNewAreas.push(garea);
			}
		} else {
			$scope.allNewAreas.push(garea);		//creation
		}
		// Here I create a new Area
		garea = new google.maps.Polygon({
	        strokeColor: '#000000',
	        strokeOpacity: 1.0,
	        strokeWeight: 3,
	        fillColor: '#000000',
	        fillOpacity: 0.4,
	        editable:true,
	        draggable:true,
	        visible:true
	    });
		
	    var path = garea.getPath();
	    if(path.length == 0){
		    //$scope.getStreetAddress(event);	// Retrieve the address from the map
		    $scope.myAreaPath = [];
	    }
	    if(event){
	    	path.push(event.latLng);
	    	var myPoint = gMapService.getPointFromLatLng(event.latLng, 1);
	    	$scope.myAreaPath.push(myPoint);
	    }
	    $scope.setMyPolGeometry($scope.myAreaPath);
	    garea.setMap($scope.map);
	};
	
	$scope.addPath = function(event){
	    var path = poly.getPath();
		if(path.length == 0){
		   $scope.getStreetAddress(event);	// Retrieve the street address from the map
		   $scope.myPath = [];
		}
		path.push(event.latLng);
		var myPoint = gMapService.getPointFromLatLng(event.latLng, 1);
		$scope.myPath.push(myPoint);
		$scope.setMyLineGeometry($scope.myPath);
		poly.setMap($scope.map);
	};
	
	$scope.addZonePath = function(event){
	    var path = gzone.getPath();
	    if(path.length == 0){
		    //$scope.getStreetAddress(event);	// Retrieve the address from the map
		    $scope.myZonePath = [];
	    }
	    path.push(event.latLng);
	    var myPoint = gMapService.getPointFromLatLng(event.latLng, 1);
	    if(myPoint){
	    	$scope.myGeometry = myPoint.latitude + "," + myPoint.longitude;
	    	//var geom = myPoint.latitude + "," + myPoint.longitude;
	    	//$scope.setMyGeometry(geom);
	    }
	    $scope.myZonePath.push(myPoint);
	    $scope.setMyPolGeometry($scope.myZonePath);
	    gzone.setMap($scope.map);
	};
	
	$scope.getStreetAddress = function(event){
		//console.log("I am in get street address function" + event.latLng);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({location:event.latLng}, function(response) {
			var result = response[0].formatted_address;
			if (result != undefined && result != null) {
				$scope.eStreet.streetReference = result.substring(0, result.indexOf(','));
			}
		});
	};
	
	$scope.getStructAddress = function(event){
		//console.log("I am in get struct address function" + event.latLng);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({location:event.latLng}, function(response) {
			var result = response[0].formatted_address;
			if (result != undefined && result != null) {
				$scope.parkingStructure.streetReference = result.substring(0, result.indexOf(','));
			}
		});
	};
	
	$scope.closeAllInfoWindows = function(){
		var infoWindow = $scope.vAreaMap.InfoWindow();
		infoWindow.close($scope.vAreaMap);
	};
	
	$scope.polygons = [];
	$scope.zone_polygons = [];
	$scope.microzone_polygons = [];
	$scope.geoStreets = [];
	$scope.zone_polygons0 = [];
	$scope.zone_polygons1 = [];
	$scope.zone_polygons2 = [];
	$scope.zone_polygons3 = [];
	$scope.zone_polygons4 = [];
	
	/*$scope.hideAllAreas = function(areas){
    	var toHideArea = $scope.vAreaMap.shapes;
    	for(var i = 0; i < areas.length; i++){
    		if(areas[i].geometry != null && areas[i].geometry.length > 0){
	    		if(areas[i].geometry.length == 1){
	    			if(toHideArea[areas[i].id] != null){
		    			toHideArea[areas[i].id].setMap(null);
		    		}
	    		} else {
	    			for(var j = 0; j <  areas[i].geometry.length; j++){
	    				var myId = $scope.correctObjId(areas[i].id, j);
	    				if(toHideArea[myId] != null){
			    			toHideArea[myId].setMap(null);
			    		}
	    			}
	    		}
    		}
    	}
    };*/
	
	/*$scope.initStreetsOnMap = function(streets){
		var street = {};
		var poligons = {};
		if($scope.geoStreets != null && $scope.geoStreets.length > 0){
			$scope.hideAllStreets(streets);	//Here I hide all the old streets
			$scope.geoStreets = [];
		}
		
		$scope.allAreaFilter = [];
		angular.copy(sharedDataService.getSharedLocalAreas(), $scope.allAreaFilter);
		if($scope.allAreaFilter != null && $scope.allAreaFilter.length > 0 && $scope.allAreaFilter[0].id != ''){
			$scope.allAreaFilter.splice(0,0,{id:'', name: "Tutte"});
		}
		$scope.streetAreaFilter = $scope.allAreaFilter[0].id;
		
		for(var i = 0; i < streets.length; i++){
			if(streets[i].geometry != null && streets[i].geometry.points.length > 0){
				poligons = streets[i].geometry;
				var myAreaS = $scope.getLocalAreaById(streets[i].rateAreaId);
				var zones0 = [];
				var zones1 = [];
				var zones2 = [];
				var zones3 = [];
				var zones4 = [];
				// zone init
				for(var j = 0; j < streets[i].zones.length; j++){
					var z0 = $scope.getLocalZoneById(streets[i].zones[j], 1, 0);
					var z1 = $scope.getLocalZoneById(streets[i].zones[j], 1, 1);
					var z2 = $scope.getLocalZoneById(streets[i].zones[j], 1, 2);
					var z3 = $scope.getLocalZoneById(streets[i].zones[j], 1, 3);
					var z4 = $scope.getLocalZoneById(streets[i].zones[j], 1, 4);
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
				
				street = {
					id: streets[i].id,
					path: $scope.correctPoints(poligons.points),
					gpath: $scope.correctPointsGoogle(poligons.points),
					stroke: {
					    color: $scope.correctColor(streets[i].color),
					    weight: 3
					},
					data: streets[i],
					area: myAreaS,
					zones0: zones0,
					zones1: zones1,
					zones2: zones2,
					zones3: zones3,
					zones4: zones4,
					pms: streets[i].myPms,
					info_windows_pos: $scope.correctPointGoogle(poligons.points[1]),
					info_windows_cod: "s" + streets[i].id,
					editable: false,
					draggable: false,
					geodesic: false,
					visible: true
					//icons:
				};
				$scope.geoStreets.push(street);
			}
		}
	};*/
	
	/*$scope.hideAllStreets = function(streets){
    	var toHideStreet = $scope.vStreetMap.shapes;
    	for(var i = 0; i < streets.length; i++){
    		if(toHideStreet[streets[i].id] != null){
    			toHideStreet[streets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
    		}
    	}
    };*/
	
	/*$scope.loadStreetsFromZone = function(z_id){
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
	};*/
	
	$scope.addMarkerToMap = function(map, type){
		switch(type){
			case 1: 
				if($scope.parkingMetersMarkers != null){
					for(var i = 0; i < $scope.parkingMetersMarkers.length; i++){
						$scope.parkingMetersMarkers[i].options.map = map;
					}
				};
				break;
			case 2: 
				if($scope.parkingStructureMarkers != null){
					for(var i = 0; i < $scope.parkingStructureMarkers.length; i++){
						$scope.parkingStructureMarkers[i].options.map = map;
					}
				};
				break;
			case 3:
				if($scope.bikePointMarkers != null){
					for(var i = 0; i < $scope.bikePointMarkers.length; i++){
						$scope.bikePointMarkers[i].options.map = map;
					}
				};
				break;
		}
	};
	
	/*$scope.initBPointMap = function(bpMarkers){
		$scope.bPointMap = {
			control: {},
			center: $scope.mapCenter,
		    zoom: 14,
		    bounds: {}
		};
			
		$scope.options = {
		    scrollwheel: true
		};
		
		if(bpMarkers!= null){
			$scope.bikePointMarkers = bpMarkers;
		} else {
			$scope.bikePointMarkers = [];
		}
		$scope.addMarkerToMap($scope.bPointMap, 3);
		
		$scope.mySpecialBPMarkers = [];
	};*/
	
	$scope.updateMyNewArea = function(path){
		var color = "000000";
		if($scope.myColor != null){
			color = $scope.myColor;
		}
		var newArea = {
			id: 0,
			path: path,
			stroke: {
			    color: $scope.correctColor(color),
			    weight: 3
			},
			editable: true,
			draggable: true,
			geodesic: false,
			visible: true,
			fill: {
			    color: $scope.correctColor(color),
			    opacity: 0.7
			}
		};
		return newArea;
	};
	
	$scope.updateMyNewStreet = function(path){
		var color = "000000";
		var myNewArea = gMapService.getMyNewArea();
		if(myNewArea != null){
			color = myNewArea.color;
		}
		var newStreet = {
			id: 0,
			path: path,
			stroke: {
			    color: $scope.correctColor(color),
			    weight: 3
			},
			editable: true,
			draggable: true,
			geodesic: false,
			visible: true
		};
		return newStreet;
	};
	
	$scope.updateMyNewZone = function(path){
		var color = "000000";
		if($scope.myColor != null){
			color = $scope.myColor;
		}
		var newZone = {
			id: 0,
			path: path,
			stroke: {
			    color: $scope.correctColor(color),
			    weight: 3
			},
			editable: true,
			draggable: true,
			geodesic: false,
			visible: true,
			fill: {
			    color: $scope.correctColor(color),
			    opacity: 0.7
			}
		};
		return newZone;
	};
	
	/*var createMarkers = function(i, marker, type) {
		//------ To be configured in external conf file!!!!!------
		var company = "";
		var appId = sharedDataService.getConfAppId();
		if(appId == 'rv'){ 
			company = "amr";
		} else {
			company = "tm";
		}
		//var baseUrl = sharedDataService.getConfUrlWs();
		var baseUrl = "rest";
		var defaultMarkerColor = "FF0000";
		//--------------------------------------------------------
		var myIcon = "";
		var title = "";
		var myAreaPm = {};
		var zones0 = [];
		var zones1 = [];
		var zones2 = [];
		var zones3 = [];
		var zones4 = [];
		switch(type){
			case 1 : 
				//myIcon = $scope.pmMarkerIcon;
				myAreaPm = $scope.getLocalAreaById(marker.areaId);
				title = marker.code;
				myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm != null && myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
				break;
			case 2 : 
				myIcon = $scope.psMarkerIcon;
				title = marker.id;
				break;
			case 3 :
				myIcon = $scope.bpMarkerIcon;
				title = marker.id;
		}
		// zone init
		if(marker.zones){
			for(var j = 0; j < marker.zones.length; j++){
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
			}
		}
		
		var ret = {
			title: title,
			id: i	
		};
		if(marker.geometry != null){
			ret = {
				id: i,
			    coords: { 
			        latitude: marker.geometry.lat,
			        longitude: marker.geometry.lng
			    },
			    position: "[" + marker.geometry.lat + "," + marker.geometry.lng + "]",
			    options: { 
			    	draggable: true,
			    	visible: true,
			    	map: null
			    },
			    data: marker,
			    area: myAreaPm,
			    zones0: zones0,
				zones1: zones1,
				zones2: zones2,
				zones3: zones3,
				zones4: zones4,
			    showWindow: false,
				title: title,
				icon: myIcon
			};
			ret.closeClick = function () {
		        ret.showWindow = false;
		        $scope.$apply();
		    };
		    ret.click = function (marker, eventName, model, args) {
		        $scope.onMarkerClicked(ret);
		    };
		}
		return ret;
	};*/
	
	/*$scope.initPMeterMap = function(pmMarkers){
		$scope.pMeterMap = {
			control: {},
			center: $scope.mapCenter,
		    zoom: 14,
		    bounds: {}
		};
			
		$scope.options = {
		    scrollwheel: true
		};
		
		if(pmMarkers!= null){
			$scope.parkingMetersMarkers = pmMarkers;
		} else {
			$scope.parkingMetersMarkers = [];
		}
		$scope.addMarkerToMap($scope.pMeterMap, 1);
		
	};*/
	
	/*$scope.initPStructMap = function(psMarkers){
		
		if(psMarkers!= null){
			$scope.parkingStructureMarkers = psMarkers;
		} else {
			$scope.parkingStructureMarkers = [];
		}
		//$scope.addMarkerToMap($scope.pStructureMap, 2);
		
	};*/
	
	$scope.initMap = function(pmMarkers, psMarkers, bpMarkers){
		
		$scope.pmap = {
			control: {},
			center: $scope.mapCenter,
		    zoom: 14,
		    bounds: {}
		};
		
		$scope.options = {
		    scrollwheel: true
		};
		
		if(pmMarkers!= null){
			$scope.parkingMetersMarkers = pmMarkers;
		} else {
			$scope.parkingMetersMarkers = [];
		}
		if(psMarkers != null){
			$scope.parkingStructureMarkers = psMarkers;
		} else {
			$scope.parkingStructureMarkers = [];
		}
		if(bpMarkers != null){
			$scope.bikePointMarkers = bpMarkers;
		} else {
			$scope.bikePointMarkers = [];
		}
		$scope.addMarkerToMap($scope.map);
		$scope.mapReady = true;
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
	   
    // --------------------------- End Section for Anni Residenza, Anzianità lavorativa e Disabilità -------------------------
            
    // ---------------------------------- Methods to manage and cast dates ----------------------------------------  
    // Method used to correct decimal value from portal format (with ',') to epu format (with '.') and vice versa
    $scope.correctDecimal = function(num, type){
       	var res = '';
       	if(num != null && num != ''){
       		if(type == 1){
       			res = num.replace(",",".");
       		} else {
       			num = num.toString();
       			res = num.replace(".",",");
       		}
       	}
       	return res;
    };
            
    $scope.correctDate = function(date){
       	if(date!= null){
       		if(date instanceof Date){
       			var correct = "";
       			var day = date.getDate();
       			var month = date.getMonth() + 1;
       			var year = date.getFullYear();
       			correct = year + "-" + month + "-" + day;
       			return correct;
       		} else {
       			var res = date.split("/");
       			correct = res[2] + "-" + res[1] + "-" + res[0];
       			return correct;
       		}
       	} else {
       		return date;
       	}
    };
    
    $scope.correctTime = function(date){
       	if(date!= null){
       		if(date instanceof Date){
       			var correct = "";
       			var hours = date.getHour();
       			var minutes = date.getMinutes();
       			correct = $scope.addZero(hours) + ":" + $scope.addZero(minutes);
       			return correct;
       		} else {
       			var res = date.split(":");
       			correct = res[0] + ":" + res[1];
       			return correct;
       		}
       	} else {
       		return date;
       	}
    };
            
    $scope.correctDateIt = function(date){
    	if(date != null){
	    	if(date instanceof Date){
	    		// if date is a Date
	    		var correct = "";
	       		var day = date.getDate();
	       		var month = date.getMonth() + 1;
	       		var year = date.getFullYear();
	       		correct = $scope.addZero(day) + "/" + $scope.addZero(month) + "/" + year;
	       		return correct;
	    	} else {
	    		// if date is a String
		       	if(date.indexOf("/") > -1){
		       		var res = date.split("/");
		       		var correct = "";
		       		correct = $scope.addZero(res[0]) + "/" + $scope.addZero(res[1]) + "/" + res[2];
		       		return correct;
		      	} else {
		        	if(date != null){
		        		var res = date.split("-");
		        		var correct = "";
		        	   	correct = $scope.addZero(res[2]) + "/" + $scope.addZero(res[1]) + "/" + res[0];
		        	   	return correct;
		        	} else {
		            	return date;
		            }
		        }
	    	}
    	} else {
    		return date;
    	}
    };
            
    $scope.castToDate = function(stringDate){
    	if(stringDate != null && stringDate!= "" ){
    		var res = stringDate.split("-");
    		var month = parseInt(res[1]) - 1; // the month start from 0 to 11;
    		return new Date(res[0], month, res[2]);
    	} else {
    		return null;
    	}
    };
    
    $scope.castToTime = function(stringDate){
    	if(stringDate != null && stringDate!= "" ){
    		var res = stringDate.split(":");
    		var d = new Date(0);
    		d.setHours(res[0]);
    		d.setMinutes(res[1]);
    		return d;
    	} else {
    		return null;
    	}
    };
    
    $scope.addZero = function(value){
    	var string_val = '';
    	if(value < 10){
    		string_val = value.toString();
    		if(string_val.length < 2){
    			string_val = '0' + value.toString();
    		}
    	} else {
    		string_val = value.toString();
    	}
    	return string_val;
    };
    
    // Method used to find the distance in milliseconds between two dates
    $scope.getDifferenceBetweenDates = function(dataDa, dataA){
    	var dateDa = $scope.correctDate(dataDa);
   		var dateA = $scope.correctDate(dataA);
   		var fromDate = $scope.castToDate(dateDa);
   		var toDate = $scope.castToDate(dateA);
   		if($scope.showLogDates){
   			console.log("Data da " + fromDate);
   			console.log("Data a " + toDate);
   		}
   		var difference = toDate.getTime() - fromDate.getTime();
   		return difference;
    };
    
    // ------------------------------ End of block for Methods to manage and cast dates -----------------------------      
          
}]);