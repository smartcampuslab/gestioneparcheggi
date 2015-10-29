'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('ParkCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$route', '$location', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeWSServiceProxy', 'invokePdfServiceProxy', 'getMyMessages', '$timeout',
                               function($scope, $http, $routeParams, $rootScope, $route, $location, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, invokePdfServiceProxy, getMyMessages, $timeout) { 
	this.$scope = $scope;
    $scope.params = $routeParams;
    $scope.showLog = true;
    $scope.showLogDates = false;
    $scope.showDialogsSucc = false;
    
    $scope.maxAreas = 8;
    $scope.maxStreets = 8;
    $scope.maxPmeters = 7;
    $scope.maxPStructs = 8;
    $scope.maxZones = 8;
    $scope.maxMicroZones = 8;
    $scope.maxBPoints = 11;
    
    // DB type for zone. I have to implement a good solution for types
    var macrozoneType = "macrozona kml";
    var microzoneType = "microzona";
    
    // Variable declaration (without this in ie the edit/view features do not work)
    $scope.eStreet = {};
    $scope.area = {};
    $scope.parckingMeter = {};
    $scope.parkingStructure = {};
    $scope.zone = {};
    $scope.microzone = {};
    $scope.bikePoint = {};
    
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
    	//datepickerMode: "'year'",	// value setted in file lib/ui-bootstrap-tpls.min.js
        formatYear: 'yyyy',
        startingDay: 1,
        showWeeks: 'false'
    };

    $scope.initDate = new Date();
    $scope.formats = ['shortDate', 'dd/MM/yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];
    $scope.format = $scope.formats[0];
            
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
    var showMicroZones = false;
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
    
    $scope.initComponents = function(){
    	if($scope.editparktabs == null || $scope.editparktabs.length == 0){
	    	$scope.editparktabs = [];
	    	var parktabs = [];
	    	var area_tab_obj = {};
	    	var zone_tab_obj = {};
	    	var microzone_tab_obj = {};
	    	var street_tab_obj = {};
	    	var ps_tab_obj = {};
	    	var pm_tab_obj = {};
	    	var bp_tab_obj = {};
	    	$scope.showedObjects = sharedDataService.getVisibleObjList();
	    	for(var i = 0; i < $scope.showedObjects.length; i++){
	    		if($scope.showedObjects[i].id == 'Area'){
	    			$scope.loadAreaAttributes($scope.showedObjects[i].attributes);
	    			if($scope.checkIfObjectOnViewPage($scope.showedObjects[i])){
	    				showArea = true;
	    				area_tab_obj = { title:'Area', index: 1, content:"partials/edit/tabs/edit_area.html" };
	    			}
	    		}
	    		if($scope.showedObjects[i].id == 'Zone'){
	    			$scope.loadZoneAttributes($scope.showedObjects[i].attributes);
	    			if($scope.checkIfObjectOnViewPage($scope.showedObjects[i])){
	    				showZones = true;
	    				zone_tab_obj = { title:'Macrozona', index: 2, content:"partials/edit/tabs/edit_zone.html" };
	    			}
	    		}
	    		if($scope.showedObjects[i].id == 'MicroZone'){
	    			$scope.loadMicroZoneAttributes($scope.showedObjects[i].attributes);
	    			if($scope.checkIfObjectOnViewPage($scope.showedObjects[i])){
	    				showMicroZones = true;
	    				microzone_tab_obj = { title:'Via', index: 3, content:"partials/edit/tabs/edit_microzone.html" };
	    			}
	    		}
	    		if($scope.showedObjects[i].id == 'Street'){
	    			$scope.loadStreetAttributes($scope.showedObjects[i].attributes);
	    			if($scope.checkIfObjectOnViewPage($scope.showedObjects[i])){
	    				showStreets = true;
	    				street_tab_obj = { title:'Sottovia', index: 4, content:"partials/edit/tabs/edit_street.html" };
	    			}
	    		}	
	    		if($scope.showedObjects[i].id == 'Ps'){
	    			$scope.loadPsAttributes($scope.showedObjects[i].attributes);
	    			if($scope.checkIfObjectOnViewPage($scope.showedObjects[i])){
	    				showPs = true;
	    				ps_tab_obj = { title:'Parcheggio in struttura', index: 5, content:"partials/edit/tabs/edit_parkingstructure.html" };
	    			}
	    		}
	    		if($scope.showedObjects[i].id == 'Pm'){
	    			$scope.loadPmAttributes($scope.showedObjects[i].attributes);
	    			if($scope.checkIfObjectOnViewPage($scope.showedObjects[i])){
	    				showPm = true;
	    				pm_tab_obj = { title:'Parcometro', index: 6, content:"partials/edit/tabs/edit_parkingmeter.html" };
	    			}
	    		}
	    		if($scope.showedObjects[i].id == 'Bp'){
	    			$scope.loadBikeAttributes($scope.showedObjects[i].attributes);
	    			if($scope.checkIfObjectOnViewPage($scope.showedObjects[i])){
	    				showBp = true;
	    				bp_tab_obj = { title:'Punti Bici', index: 7, content:"partials/edit/tabs/edit_bike.html" };
	    			}
	    		}	
	    	}
	    	if(showArea){
	    		parktabs.push(area_tab_obj);
	    	}
	    	if(showZones){
	    		parktabs.push(zone_tab_obj);
	    	}
	    	if(showMicroZones){
	    		parktabs.push(microzone_tab_obj);
	    	}
	    	if(showStreets){
	    		parktabs.push(street_tab_obj);
	    	}
	    	if(showPs){
	    		parktabs.push(ps_tab_obj);
	    	}
	    	if(showPm){
	    		parktabs.push(pm_tab_obj);
	    	}
	    	if(showBp){
	    		parktabs.push(bp_tab_obj);
	    	}
	    	angular.copy(parktabs, $scope.editparktabs);
    	}
    };
    
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
    		if(attributes[i].code == 'note'){
    			$scope.a_note = attributes[i];
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
   		if(localArea == null || localArea.length == 0){
   			$scope.getAreasFromDb();
   		}
   		// I load the streets if there are no streets loaded
   		if($scope.streetWS == null || $scope.streetWS.length == 0){
    		$scope.getStreetsFromDb();
    	}
    	$scope.tabIndex = $index;
       	if(tab.index == 1){
       		$scope.getAreasFromDb();
       	}
       	if(tab.index == 2){ // era 5
       		//$scope.resizeMap();
       		$scope.getZonesFromDb(macrozoneType);
       	}
       	if(tab.index == 3){
       		$scope.getZonesFromDb(microzoneType);
       	}
       	if(tab.index == 4){	// era 2
       		var zones = sharedDataService.getSharedLocalZones;
       		if(zones == null || zones.length == 0){
       			$scope.getZonesFromDb(macrozoneType);
       		}
       		var microzones = sharedDataService.getSharedLocalMicroZones;
       		if(microzones == null || microzones.length == 0){
       			$scope.getZonesFromDb(microzoneType);
       		}
       		var pms = sharedDataService.getSharedLocalPms;
       		if(pms == null || pms.length == 0){
       			$scope.getParkingMetersFromDb();
       		}
       		$scope.getStreetsFromDb();
       	}
       	if(tab.index == 5){
       		//$scope.resizeMap();
       		$scope.getParkingStructuresFromDb();
       	}
       	if(tab.index == 6){	// era 3
       		//$scope.resizeMap();
       		$scope.getParkingMetersFromDb();
       		// I load the streets if there are no streets loaded
       		if($scope.streetWS == null || $scope.streetWS.length == 0){
	    		$scope.getStreetsFromDb();
	    	}
       	}
       	if(tab.index == 7){
       		$scope.getBikePointsFromDb();
       	}
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
    
    $scope.cash_mode = "CASH";
    $scope.automated_teller_mode = "AUTOMATED_TELLER";
    $scope.prepaid_card_mode = "PREPAID_CARD";
    $scope.parcometro = "PARCOMETRO";
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
    
    $scope.subscriptions = [
        {
        	value: true,
        	desc: "Si'"
        },
        {
        	value: false,
        	desc: "No"
        }
    ];
    
    $scope.areaWS = [];
    $scope.streetWS = [];
    $scope.pmeterWS = [];
    $scope.pstructWS = [];
    $scope.zoneWS = [];
    $scope.bpointWS = [];
    
    $scope.myNewArea;
     
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
    
    $scope.getAreasFromDb = function(){
    	$scope.areaMapReady = false;
		var allAreas = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allAreas);
	    	//console.log("rateAreas retrieved from db: " + JSON.stringify(result));
	    	
	    	$scope.areaWS = allAreas;
	    	//$scope.initAreaMap();
	    	if(showArea)$scope.resizeMap("viewArea");
	    	$scope.initAreasOnMap($scope.areaWS);
	    	sharedDataService.setSharedLocalAreas($scope.areaWS);
	    	$scope.areaMapReady = true;
	    });
	};
	
	$scope.getAreaByIdFromDb = function(id){
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area/"+ id, null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area/"+ id, null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	console.log("rateArea by id retrieved from db: " + JSON.stringify(result));
	    	return result;
	    });
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
					var sub = (myZones[i].submacro != null) ? myZones[i].submacro : myZones[i].submicro;
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
						label: myZones[i].name + "_" + sub
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
					var sub = (myMicroZones[i].submacro != null) ? myMicroZones[i].submacro : myMicroZones[i].submicro;
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
						label: myMicroZones[i].name + "_" + sub
					};
				}
				
			}
		}
		return corrMicrozone;
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
		return null;
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
	
	$scope.getStreetsFromDb = function(){
		$scope.streetMapReady = false;
		$scope.mapStreetSelectedMarkers = [];
		var allStreet = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeWSService.getProxy(method, appId + "/street", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allStreet);
	    	//console.log("streets retrieved from db: " + JSON.stringify(result));
	    	
	    	$scope.streetWS = $scope.initStreetsObjects(allStreet);
	    	//$scope.initStreetMap();
	    	if(showStreets)$scope.resizeMap("viewStreet");
	    	$scope.initStreetsOnMap($scope.streetWS);
	    	$scope.streetMapReady = true;
	    });
	};
	
	$scope.getParkingMetersFromDb = function(){
		$scope.editModePM = false;
		var markers = [];
		$scope.pmMapReady = false;
		var allPmeters = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter", null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allPmeters);
	    	//console.log("ParkingMeters retrieved from db: " + JSON.stringify(result));
	    	
	    	for (var i = 0; i <  allPmeters.length; i++) {
	    		markers.push(createMarkers(i, allPmeters[i], 1));
		    }
	    	
	    	$scope.pmeterWS = $scope.initPMObjects(allPmeters);
	    	sharedDataService.setSharedLocalPms($scope.pmeterWS);
	    	$scope.initPMeterMap(markers);
	    	if(showPm)$scope.resizeMap("viewPm");
	    	$scope.pmMapReady = true;
	    });
	};
	
	$scope.getParkingStructuresFromDb = function(){
		var markers = [];
		$scope.psMapReady = false;
		var allPstructs = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure", null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allPstructs);
	    	console.log("ParkingStructures retrieved from db: " + JSON.stringify(result));
	    	
	    	for (var i = 0; i <  allPstructs.length; i++) {
	    		markers.push(createMarkers(i, allPstructs[i], 2));
	    		allPstructs[i] = $scope.correctFeeData(allPstructs[i]);
		    }
	    	
	    	$scope.pstructWS = allPstructs;
	    	if(showPs)$scope.resizeMap("viewPs");
	    	$scope.initPStructMap(markers);
	    	$scope.psMapReady = true;
	    });
	};
	
	$scope.getZonesFromDb = function(z_type){
		$scope.zoneMapReady = false;
		var allZones = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + z_type, null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allZones);
	    	//console.log("Zone retrieved from db: " + JSON.stringify(result));
	    	if(z_type == macrozoneType){
	    		$scope.zoneWS = $scope.correctMyZones(allZones);
		    	if(showZones)$scope.resizeMap("viewZone");
		    	$scope.initZonesOnMap($scope.zoneWS, z_type);
		    	sharedDataService.setSharedLocalZones($scope.zoneWS);
	    	} else {
	    		$scope.microzoneWS = $scope.correctMyZones(allZones);
		    	if(showZones)$scope.resizeMap("viewMicroZone");
		    	$scope.initZonesOnMap($scope.microzoneWS, z_type);
		    	sharedDataService.setSharedLocalMicroZones($scope.microzoneWS);
	    	}
	    	$scope.zoneMapReady = true;
	    });
	};
	
	$scope.getBikePointsFromDb = function(){
		var markers = [];
		$scope.bpMapReady = false;
		var allBpoints = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint", null, $scope.authHeaders, null);
		var myDataPromise = invokeWSService.getProxy(method, appId + "/bikepoint", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
	    	angular.copy(result, allBpoints);
	    	console.log("BikePoints retrieved from db: " + JSON.stringify(result));
	    	
	    	for (var i = 0; i <  allBpoints.length; i++) {
	    		markers.push(createMarkers(i, allBpoints[i], 3));
		    }
	    	
	    	$scope.bpointWS = allBpoints;
	    	if(showBp)$scope.resizeMap("viewBike");
	    	$scope.initBPointMap(markers);
	    	$scope.bpMapReady = true;
	    });
	};
	
	// Utility methods
	$scope.correctColor = function(value){
		return "#" + value;
	};
	
	$scope.correctPointGoogle = function(point){
		return point.lat + "," + point.lng;
	};
	
	$scope.getPointFromLatLng = function(latLng, type){
		var point = "" + latLng;
		var pointCoord = point.split(",");
		var res;
		if(type == 1){
			var lat = pointCoord[0].substring(1, pointCoord[0].length);
			var lng = pointCoord[1].substring(0, pointCoord[1].length - 1);
		
			res = {
				latitude: lat,
				longitude: lng
			};
		} else {
			var lat = Number(pointCoord[0]);
			var lng = Number(pointCoord[1]);
			res = {
				lat: lat,
				lng: lng
			};
		}
		return res;
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
	
	$scope.correctMyGeometry = function(geo){
		var pos = geo.split(",");
		return {
			lat: pos[0],
			lng: pos[1]
		};
	};
	
	$scope.correctMyGeometryPolyline = function(geo){
		//var corrected = [];
		var tmpLine = {
			points: null
			//pointObjs: null
		};
		var points = [];
		for(var i = 0; i < geo.length; i++){
			var tmpPoint = {
				lat: Number(geo[i].latitude),
				lng: Number(geo[i].longitude)
			};
			points.push(tmpPoint);
		}
		
		tmpLine.points = points;
		//tmpLine.pointObjs = points;
		//corrected.push(tmpLine);
		
		return tmpLine;
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
	
	$scope.correctMyGeometryPolygonForArea = function(geo){
		var corrected = [];
		for(var j = 0; j < geo.length; j++){
			var points = [];
			for(var i = 0; i < geo[j].length; i++){
				var tmpPoint = {
					lat: geo[j][i].latitude,
					lng: geo[j][i].longitude
				};
				points.push(tmpPoint);
			}
			
			var tmpPol = {
				points: points
			};
			corrected.push(tmpPol);
		}
		return corrected;
	};
	
	$scope.correctMyPaymentMode = function(myPm){
		var correctedPm = [];
		if(myPm.cash_checked){
			correctedPm.push($scope.listaPagamenti[0].idObj);
		}
		if(myPm.automated_teller_checked){
			correctedPm.push($scope.listaPagamenti[1].idObj);
		}
		if(myPm.prepaid_card_checked){
			correctedPm.push($scope.listaPagamenti[2].idObj);
		}
		if(myPm.parcometro_checked){
			correctedPm.push($scope.listaPagamenti[3].idObj);
		}
		return correctedPm;
	};
	
	$scope.checkCorrectPaymode = function(myPm){
		var correctedPm = true;
		if(!myPm.cash_checked && !myPm.automated_teller_checked && !myPm.prepaid_card_checked && !myPm.parcometro_checked){
			correctedPm = false;
		}
		return correctedPm;
	};
	
	$scope.correctFeeData = function(struct){
		if(struct.fee_val != null){
			struct.fee_val = struct.fee_val / 100 + "";
			if(struct.fee_val.indexOf(".") > -1){
				struct.fee_val = struct.fee_val.replace(".", ",");
			}
		}
		return struct;
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
	
	// correctMyZones: used to correct the zone object with all the necessary data
	$scope.correctMyZones = function(zones){
		var correctedZones = [];
		for(var i = 0; i < zones.length; i++){
			var sub = (zones[i].submacro != null) ? zones[i].submacro : zones[i].submicro;
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
				label: zones[i].name + "_" + sub
			};
			correctedZones.push(correctZone);
		}
		return correctedZones;
	};
	
	$scope.correctMyZonesForStreet = function(zone, microzone){
		var correctedZones = [];
//		for(var i = 0; i < zones.length; i++){
//			if(zones[i].selected){
//				correctedZones.push(zones[i].id);
//			}
//		}
		if(zone != null){
			correctedZones.push(zone.id);
		}
		if(microzone != null){
			correctedZones.push(microzone.id);
		}
		return correctedZones;
	};
	
	$scope.correctMyPmsForStreet = function(pms){
		var correctedPms = [];
		for(var i = 0; i < pms.length; i++){
			if(pms[i].selected){
				//correctedPms.push(String(pms[i].code));
				correctedPms.push(String(pms[i].id));
			}
		}
		return correctedPms;
	};
	
//	$scope.setMyArea = function(area){
//		$scope.myNewArea = area;
//	};
	
	$scope.setMyPaymentoErrMode = function(value){
		$scope.noPaymentChecked = value;
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
						subzones.push($scope.addLabelToZoneObject(subzone));
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
					if(pm != null){
						pms.push(pm);
					}
				}
			}
			var area = $scope.getLocalAreaById(streets[i].rateAreaId);
			var mystreet = streets[i];
			mystreet.area_name = area.name;
			mystreet.area_color= area.color;
			mystreet.myZones = zones;
			mystreet.mySubZones = subzones;
			mystreet.myPms = pms;
			myStreets.push(mystreet);
		}
		return myStreets;
	};
	
	$scope.initPMObjects = function(pmeters){
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
			myPmeter.myStatus = (pmeters[i].status == 'ACTIVE')?"ON-ACTIVE":"OFF-INACTIVE";
			myPmeter.area_name = area.name,
			myPmeter.area_color= area.color;
			myPms.push(myPmeter);
		}
		return myPms;
	};
	
	$scope.correctObjId = function(id, i){
		if(i == 0){
			return id;
		} else {
			return id + '_' + i;
		}
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
	
	// View management
	// RateArea
	$scope.setADetails = function(area){
		$scope.aViewMapReady = false;
		$scope.mySpecialAreas = [];
		
		$scope.viewArea = area;
		
		// Init the map for view
		$scope.viewAreaMap = {
			control: {},
			center: $scope.mapCenter,
			zoom: 14,
			bounds: {},
			options: {
				scrollwheel: true
			}
		};
		
		//$scope.viewAreaPolygons = $scope.polygons;
		//for(var i = 0; i < $scope.polygons.length; i++){
		//	if($scope.polygons[i].id == $scope.area.id){
		//		$scope.viewAreaPolygons.splice(i, 1);
		//	};
		//};
		
		if(area.geometry != null && area.geometry.length > 0 && area.geometry[0].points.length > 0){
			// Move this code in the if blok to preserve from the udefined map exception
			var toHide = $scope.vAreaMap.shapes;
			if(area.geometry.length == 1){
				toHide[area.id].setMap(null);
			} else {
				for(var i = 0; i < area.geometry.length; i++){
					var myId = $scope.correctObjId(area.id, i);
					toHide[myId].setMap(null);
				}
			}
			
			for(var j = 0; j < area.geometry.length; j++){
			
				var tmpPol = "";
				for(var i = 0; i < area.geometry[j].points.length; i++){
					var tmpPoint = area.geometry[j].points[i].lat + "," + area.geometry[j].points[i].lng;
					tmpPol = tmpPol + tmpPoint + ",";
				}
				tmpPol = tmpPol.substring(0, tmpPol.length-1);
				$scope.setMyPolGeometry(tmpPol);
				
				$scope.myAreaPol = {
					id: $scope.correctObjId(area.id, j),
					path: $scope.correctPoints(area.geometry[j].points),
					gpath: $scope.correctPointsGoogle(area.geometry[j].points),
					stroke: {
					    color: $scope.correctColor(area.color),
					    weight: 4
					},
					data:area,
					info_windows_pos: $scope.correctPointGoogle(area.geometry[j].points[1]),
					info_windows_cod: "ma" + area.id,
					editable: false,
					draggable: false,
					geodesic: false,
					visible: true,
					fill: {
					    color: $scope.correctColor(area.color),
					    opacity: 0.8
					}
				};
				$scope.mySpecialAreas.push($scope.myAreaPol);
			}
		}
		
		$scope.viewModeA = true;
		$scope.editModeA = false;
		$scope.aViewMapReady = true;
	};
	
	$scope.closeAView = function(){
		$scope.getAreasFromDb();	// to refresh the data on page
		$scope.viewModeA = false;
		$scope.editModeA = false;
	};
	
	// Street
	$scope.setSDetails = function(street){
		$scope.sViewMapReady = false;
		$scope.mySpecialStreets = [];
		$scope.viewStreet = street;
		
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		for(var i = 0; i < $scope.allArea.length; i++){
			if(street.rateAreaId == $scope.allArea[i].id){
				$scope.myArea = $scope.allArea[i];
			}
		}
		
		$scope.allPms = sharedDataService.getSharedLocalPms();
		// I show only the pms in the same area of the street
		$scope.myPms = $scope.getPmsFromArea($scope.allPms, $scope.myArea);
		var myStreetPms = [];
		for(var j = 0; j < $scope.myPms.length; j++){
			$scope.myPms[j].selected = false;
			if(street.myPms != null && street.myPms.length > 0){
				for(var i = 0; i < street.myPms.length; i++){
					//if($scope.myPms[j].code == street.myPms[i].code){
					if($scope.myPms[j].id == street.myPms[i].id){	
						myStreetPms.push($scope.myPms[j]);
					}
				}
			}
		}
		
		// Init the map for view
		$scope.viewStreetMap = {
			control: {},
			center: $scope.mapCenter,
			zoom: 14,
			bounds: {},
			options: {
				scrollwheel: true
			}
		};
		
		if(street.geometry != null && street.geometry.points.length > 0){
			var toHide = $scope.vStreetMap.shapes;
			toHide[street.id].setMap(null);
			
			var tmpLine = "";
			for(var i = 0; i < street.geometry.points.length; i++){
				var tmpPoint = street.geometry.points[i].lat + "," + street.geometry.points[i].lng;
				tmpLine = tmpLine + tmpPoint + ",";
			}
			tmpLine = tmpLine.substring(0, tmpLine.length-1);
			$scope.setMyLineGeometry(tmpLine);
			
			var myAreaS = $scope.getLocalAreaById(street.rateAreaId);
			var myZones = [];
			var mySubZones = [];
			for(var j = 0; j < street.zones.length; j++){
				var zone = $scope.getLocalZoneById(street.zones[j], 1);
				if(zone == null){
					var subzone = $scope.getLocalMicroZoneById(street.zones[j], 1);
					if(subzone != null){
						mySubZones.push($scope.addLabelToZoneObject(subzone));
					}
				} else {
					myZones.push($scope.addLabelToZoneObject(zone));
				}
			}
			
			$scope.myStreetLine = {
				id: street.id,
				path: $scope.correctPoints(street.geometry.points),
				gpath: $scope.correctPointsGoogle(street.geometry.points),
				stroke: {
				    color: $scope.correctColor(street.color),
				    weight: 4
				},
				data: street,
				area: myAreaS,
				zones: myZones,
				microzones: mySubZones,
				pms: myStreetPms,
				info_windows_pos: $scope.correctPointGoogle(street.geometry.points[1]),
				info_windows_cod: "ms" + street.id,
				editable: false,
				draggable: false,
				geodesic: false,
				visible: true
			};
			
			$scope.mySpecialStreets.push($scope.myStreetLine);
		}
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
		$scope.getStreetsFromDb();	// to refresh the data on page
		$scope.viewModeS = false;
		$scope.editModeS = false;
	};
	
	// ParkingMeters
	$scope.setPmDetails = function(parkingMeter){
		//------ To be configured in external conf file!!!!!------
		var company = "";
		var appId = sharedDataService.getConfAppId();
		if(appId == 'rv'){ 
			company = "amr";
		} else {
			company = "tm";
		}
		//var baseUrl = "http://localhost:8080/parking-management/rest";
		//var baseUrl = sharedDataService.getConfUrlWs();
		var baseUrl = "rest";
		var defaultMarkerColor = "FF0000";
		//--------------------------------------------------------
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
		$scope.setMyGeometry(sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng));
		
		// Init the map for view
		$scope.pViewMeterMap = {
			control: {},
			center: $scope.mapCenter,
			zoom: 14,
			bounds: {},
			options: {
				scrollwheel: true
			}
		};
		
		var myAreaP = $scope.getLocalAreaById(parkingMeter.areaId);
		
		$scope.pViewMetersMarkers = $scope.parkingMetersMarkers;
		for(var i = 0; i < $scope.pViewMetersMarkers.length; i++){
			if($scope.pViewMetersMarkers[i].title == parkingMeter.code){
				$scope.pViewMetersMarkers.splice(i, 1);
			};
		}
		
		$scope.mySpecialMarker = {
			id: 0,
			coords: {
				latitude: parkingMeter.geometry.lat,
				longitude: parkingMeter.geometry.lng
			},
			position: parkingMeter.geometry.lat + "," + parkingMeter.geometry.lng,
			data: parkingMeter,
			area: myAreaP,
			visible:true,
			options: { 
				draggable: false,
				animation: ""	//1 "BOUNCE"
			},
			//icon: (appId == 'rv') ? $scope.useSelectedIcon($scope.getCorrectPmIconByAreaName(myAreaP.name)) : $scope.pmMarkerIcon
			icon: baseUrl+'/marker/'+company+'/parcometroneg/'+((myAreaP.color != null) ? myAreaP.color : defaultMarkerColor)	//$scope.pmMarkerIcon
		};
		$scope.mySpecialPMMarkers.push($scope.mySpecialMarker);
		
		$scope.viewModePM = true;
		$scope.editModePM = false;
		$scope.pmViewMapReady = true;
	};
	
	$scope.closeView = function(){
		$scope.mySpecialPMMarkers = [];
		$scope.getParkingMetersFromDb();	// to refresh the data on page
		$scope.viewModePM = false;
		$scope.editModePM = false;
	};
	
	// ParkingStructures
	$scope.setPsDetails = function(parkingStructure){
		$scope.psViewMapReady = false;
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
		$scope.setMyGeometry(sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng));
		
		// Init the map for view
		$scope.pViewStructMap = {
			control: {},
			center: $scope.mapCenter,
			zoom: 14,
			bounds: {},
			options: {
				scrollwheel: true
			}
		};
		
		$scope.myPaymentMode = $scope.castMyPaymentModeToString(parkingStructure.paymentMode);
		
		$scope.pViewStructMarkers = $scope.parkingStructureMarkers;
		for(var i = 0; i < $scope.pViewStructMarkers.length; i++){
			if($scope.pViewStructMarkers[i].title == parkingStructure.id){
				$scope.pViewStructMarkers.splice(i, 1);
			};
		}
		
		$scope.mySpecialPSMarker = {
			id: 0,
			coords: {
				latitude: parkingStructure.geometry.lat,
				longitude: parkingStructure.geometry.lng
			},
			position: parkingStructure.geometry.lat + "," + parkingStructure.geometry.lng,
			data: parkingStructure,
			visible: true,
			options: { 
				draggable: false,
				animation: 	""  //1 "BOUNCE"
			},
			icon: $scope.useSelectedIcon($scope.psMarkerIcon)
		};
		$scope.mySpecialPSMarkers.push($scope.mySpecialPSMarker);
		
		$scope.viewModePS = true;
		$scope.editModePS = false;
		$scope.psViewMapReady = true;
	};
	
	$scope.closePSView = function(){
		$scope.mySpecialPSMarkers = [];
		$scope.getParkingStructuresFromDb();	// to refresh the data on page
		$scope.viewModePS = false;
		$scope.editModePS = false;
	};
	
	// Zones
	$scope.setZDetails = function(zone){
		$scope.zViewMapReady = false;
		$scope.mySpecialZones = [];
		
		$scope.viewZone = zone;
		
		// Init the map for view
		$scope.viewZoneMap = {
			control: {},
			center: $scope.mapCenter,
			zoom: 13,
			bounds: {},
			options: {
				scrollwheel: true
			}
		};
		
		if(zone.geometryFromSubelement){
			
			var toHide = $scope.vZoneMap.shapes;
			var toMicroHide = $scope.vMicroZoneMap.shapes;
			
			var streets = zone.subelements;//$scope.loadStreetsFromZone(zones[i].id);
			var color = $scope.lightgray;
			if(streets != null && streets.length > 0){
				color = streets[0].area_color;
			}
			if(streets != null && streets.length > 0){
				for(var j = 0; j < streets.length; j++){
					if(toHide[$scope.correctObjId(zone.id,j)] != null){
						toHide[$scope.correctObjId(zone.id,j)].setMap(null);
					} else {
						if(toMicroHide[$scope.correctObjId(zone.id,j)] != null){
							toMicroHide[$scope.correctObjId(zone.id,j)].setMap(null);
						}
					}
					var polyline = streets[j].geometry;
					var pol_zone = {
						id: $scope.correctObjId(zone.id, j),
						path: $scope.correctPoints(polyline.points),
						gpath: $scope.correctPointsGoogle(polyline.points),
						stroke: {
						    color: $scope.correctColor(color),
						    weight: 5
						},
						data: zone,
						info_windows_pos: $scope.correctPointGoogle(polyline.points[1]),
						info_windows_cod: "z" + zone.id,
						editable: true,
						draggable: true,
						geodesic: false,
						visible: true,
						subelements: streets
					};
					$scope.mySpecialZones.push(pol_zone);
				}
			}		
		} else {
			if(zone.geometry != null && zone.geometry.points.length > 0){
				var toHide = $scope.vZoneMap.shapes;
				var toMicroHide = $scope.vMicroZoneMap.shapes;
				if(toHide[zone.id] != null){
					toHide[zone.id].setMap(null);
				} else {
					if(toMicroHide[zone.id] != null){
						toMicroHide[zone.id].setMap(null);
					}
				}
				
				$scope.myZonePol = {
					id: zone.id,
					path: $scope.correctPoints(zone.geometry.points),
					gpath: $scope.correctPointsGoogle(zone.geometry.points),
					stroke: {
					    color: $scope.correctColor(zone.color),
					    weight: 4
					},
					data: zone,
					info_windows_pos: $scope.correctPointGoogle(zone.geometry.points[1]),
					info_windows_cod: "mz" + zone.id,
					editable: false,
					draggable: false,
					geodesic: false,
					visible: true,
					fill: {
					    color: $scope.correctColor(zone.color),
					    opacity: 0.8
					}
				};
				$scope.mySpecialZones.push($scope.myZonePol);
			}			
		}
		
		$scope.viewModeZ = true;
		$scope.editModeZ = false;
		$scope.zViewMapReady = true;
	};
	
	$scope.closeZView = function(type){
		$scope.getZonesFromDb(type);	// to refresh the data on page
		$scope.viewModeZ = false;
		$scope.editModeZ = false;
	};
	
	// MicroZones
//	$scope.setMicroZDetails = function(zone){
//		$scope.microZViewMapReady = false;
//		$scope.mySpecialMicroZones = [];
//		
//		$scope.viewMicroZone = zone;
//		
//		// Init the map for view
//		$scope.viewZoneMap = {
//			control: {},
//			center: $scope.mapCenter,
//			zoom: 13,
//			bounds: {},
//			options: {
//				scrollwheel: true
//			}
//		};
//		
//		if(zone.geometryFromSubelement){
//			var elements = zone.subelements;
//			
//			var toHide = $scope.vZoneMap.shapes;
//			toHide[zone.id].setMap(null);
//			
//			$scope.myZonePol = {
//				id: zone.id,
//				path: null,
//				gpath: null,
//				stroke: {
//				    color: $scope.correctColor(zone.color),
//				    weight: 4
//				},
//				data: zone,
//				info_windows_pos: $scope.correctPointGoogle(elements[0].geometry.points[1]),
//				info_windows_cod: "mz" + zone.id,
//				editable: false,
//				draggable: false,
//				geodesic: false,
//				visible: true,
//				fill: {
//				    color: $scope.correctColor(zone.color),
//				    opacity: 0.8
//				},
//				subelements: zone.subelements
//			};
//			$scope.mySpecialMicroZones.push($scope.myZonePol);
//			
//		} else {
//			if(zone.geometry != null && zone.geometry.points.length > 0){
//				
//				var toHide = $scope.vZoneMap.shapes;
//				toHide[zone.id].setMap(null);
//				
//				$scope.myZonePol = {
//					id: zone.id,
//					path: $scope.correctPoints(zone.geometry.points),
//					gpath: $scope.correctPointsGoogle(zone.geometry.points),
//					stroke: {
//					    color: $scope.correctColor(zone.color),
//					    weight: 4
//					},
//					data: zone,
//					info_windows_pos: $scope.correctPointGoogle(zone.geometry.points[1]),
//					info_windows_cod: "mz" + zone.id,
//					editable: false,
//					draggable: false,
//					geodesic: false,
//					visible: true,
//					fill: {
//					    color: $scope.correctColor(zone.color),
//					    opacity: 0.8
//					}
//				};
//				$scope.mySpecialMicroZones.push($scope.myZonePol);
//			}			
//		}
//		
//		$scope.viewModeMicroZ = true;
//		$scope.editModeMicroZ = false;
//		$scope.microZViewMapReady = true;
//	};
	
	// BikePoints
	$scope.setBpDetails = function(bikePoint){
		$scope.bpViewMapReady = false;
		$scope.mySpecialBPMarkers = [];
		
		$scope.bikePoint = bikePoint;
		
		var toRemLat = 0;
		var toRemLng = 0;
		var sLat = "" + $scope.bikePoint.geometry.lat;
		var sLng = "" + $scope.bikePoint.geometry.lng;
		if(sLat.length > $scope.gpsLength){
			toRemLat = sLat.length - $scope.gpsLength;
		}
		if(sLng.length > $scope.gpsLength){
			toRemLng = sLng.length - $scope.gpsLength;
		}
		$scope.setMyGeometry(sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng));
		
		// Init the map for view
		$scope.pViewBikeMap = {
			control: {},
			center: $scope.mapCenter,
			zoom: 14,
			bounds: {},
			options: {
				scrollwheel: true
			}
		};
		
		$scope.pViewBikeMarkers = $scope.bikePointMarkers;
		for(var i = 0; i < $scope.pViewBikeMarkers.length; i++){
			if($scope.pViewBikeMarkers[i].title == $scope.bikePoint.id){
				$scope.pViewBikeMarkers.splice(i, 1);
				//$scope.bikePointMarkers[i].animation = "BOUNCE";
			};
		}
		
		var mySpecialBPMarker = {
			id: bikePoint.id,
			coords: {
				latitude: $scope.bikePoint.geometry.lat,
				longitude: $scope.bikePoint.geometry.lng
			},
			pos: $scope.bikePoint.geometry.lat + "," + $scope.bikePoint.geometry.lng,
			data: bikePoint,
			visible: true,
			options: { 
				draggable: false,
				animation: ""	//1 "BOUNCE"
			},
			icon: $scope.useSelectedIcon($scope.bpMarkerIcon)
		};
		$scope.mySpecialBPMarkers.push(mySpecialBPMarker);
		
		$scope.viewModeBP = true;
		$scope.editModeBP = false;
		$scope.bpViewMapReady = true;
	};
	
	$scope.closeBPView = function(){
		//$scope.mySpecialBPMarker.visible = false;
		$scope.mySpecialBPMarkers = [];
		$scope.getBikePointsFromDb();	// to refresh the data on page
		$scope.viewModeBP = false;
		$scope.editModeBP = false;
	};
	
	// Edit management
	// Area
	$scope.setAEdit = function(area){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
		$scope.myColor = "";
		
		// Case edit
		if(area != null){
			if(area.geometry == null || area.geometry.length == 0 || area.geometry[0].points.length == 0){
				garea.visible = true;					// here I show the polygon for creation
//				if($scope.editGArea != null){
//					$scope.editGArea.visible = false;	// and hide the edit polygon
//				}
			} else {
				garea.visible = false;		// here I hide the polygon for creation
			}
			garea.setPath([]);				// and clear the path
			// Here i check if there are old 'create/edit' polygons in editAreaMap and remove them from it
			if($scope.allNewAreas != null && $scope.allNewAreas.length > 0){
				for(var i = 0; i < $scope.allNewAreas.length; i++){
					$scope.allNewAreas[i].visible = false;
					$scope.allNewAreas[i].setMap(null);			// I clean the edit map form old polygons
					//$scope.eAreaMap.shapes[$scope.allNewAreas[i].id].setMap(null);	
				}
				$scope.allNewAreas = [];
			}
			if($scope.editNewAreas != null && $scope.editNewAreas.length > 0){
				for(var i = 0; i < $scope.editNewAreas.length; i++){
					$scope.editNewAreas[i].visible = false;
					$scope.editNewAreas[i].setMap(null);			// I clean the edit map form old polygons
					//$scope.eAreaMap.shapes[$scope.allNewAreas[i].id].setMap(null);	
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
			
			$scope.isEditing = true;
			$scope.isInit = false;
			angular.copy(area, $scope.area);
			$scope.area.fee = $scope.correctDecimal(area.fee, 2);	// Here I cast the fee value to string and I change the '.' char in ',' char
			
			var areaCenter = $scope.mapCenter;
			
			$scope.myColor = $scope.correctColor(area.color);
			if(area.geometry != null && area.geometry.length > 0 && area.geometry[0].points.length > 0){
				areaCenter = {
					latitude: $scope.area.geometry[0].points[0].lat,
					longitude: $scope.area.geometry[0].points[0].lng
				};
			}
			
			$scope.aEditMap = {
				control: {},
				center: areaCenter,
				zoom: 15,
				bounds: {},
				options: {
					scrollwheel: true
				}
			};
			
			if(area.geometry != null && area.geometry.length > 0 && area.geometry[0].points.length > 0){
				$scope.editGAreas = [];
				for(var j = 0; j < $scope.area.geometry.length; j++){
					var tmpPol = "";
					var poligons = {};
					for(var i = 0; i < $scope.area.geometry[j].points.length; i++){
						var tmpPoint = $scope.area.geometry[j].points[i].lat + "," + $scope.area.geometry[j].points[i].lng;
						tmpPol = tmpPol + tmpPoint + ",";
					}
					tmpPol = tmpPol.substring(0, tmpPol.length-1);
					$scope.setMyPolGeometry(tmpPol);
				
					poligons = area.geometry[j];
					$scope.editGArea = {
						id: $scope.correctObjId(area.id, j),
						path: $scope.correctPoints(poligons.points),
						gpath: $scope.correctPointsGoogle(poligons.points),
						stroke: {
						    color: $scope.correctColor(area.color),
						    weight: 3
						},
						geodesic: false,
						editable: true,
						draggable: true,
						visible: true,
						fill: {
						    color: $scope.correctColor(area.color),
						    opacity: 0.4
						}
					};
					$scope.editGAreas.push($scope.editGArea);
				}
			}	
		} else {
			//garea.setPath([]);									// here I clear the old path
			//garea.visible = true;									// here I show the polygon for creation
			
			//if($scope.editGArea != null){
			//	$scope.editGArea.visible = false;					// and hide the edit polygon
			//}
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
			// Here i check if there are old 'create/edit' polygons in editAreaMap and remove them from it
			if($scope.allNewAreas !=null && $scope.allNewAreas.length > 0){
				for(var i = 0; i < $scope.allNewAreas.length; i++){
					$scope.allNewAreas[i].visible = false;
					$scope.allNewAreas[i].setMap(null);			// I clean the edit map form old polygons
					//$scope.eAreaMap.shapes[$scope.allNewAreas[i].id].setMap(null);	// I clean the edit map form old polygons
				}
				$scope.allNewAreas = [];
			}
			if($scope.editNewAreas != null && $scope.editNewAreas.length > 0){
				for(var i = 0; i < $scope.editNewAreas.length; i++){
					$scope.editNewAreas[i].visible = false;
					$scope.editNewAreas[i].setMap(null);			// I clean the edit map form old polygons
					//$scope.eAreaMap.shapes[$scope.allNewAreas[i].id].setMap(null);	
				}
				$scope.editNewAreas = [];
			}
			if($scope.editGAreas !=null && $scope.editGAreas.length > 0){
				for(var i = 0; i < $scope.editGAreas.length; i++){
					$scope.editGAreas[i].visible = false;
					$scope.eAreaMap.shapes[$scope.editGAreas[i].id].setMap(null);	// I clean the edit map form old polygons
				}
				$scope.editGAreas = [];
			}
			
			$scope.setMyPolGeometry("");
			
			$scope.area = {
				id: null,
				id_app: null,
				name: null,
				fee: null,
				timeSlot: null,
				smsCode: null,
				color: null,
				geometry: null
			};
			
		}
		$scope.resizeMapTimed("editArea", false);
		$scope.viewModeA = false;
		$scope.editModeA = true;
	};
	
	$scope.getPmsFromArea = function(list, area){
		var myPmsInArea = [];
		for(var i = 0; i < list.length; i++){
			if(area != null){
				if(list[i].areaId == area.id){
					myPmsInArea.push(list[i]);
				}
			}
		}
		return myPmsInArea;
	};
	
	$scope.getAreaPM = function(area){
		$scope.myPms = $scope.getPmsFromArea(sharedDataService.getSharedLocalPms(), area);
	};
	
	// Streets
	$scope.setSEdit = function(street){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
		$scope.myZones = [];
		//$scope.myMacrozone = {};
		//$scope.myMicrozone = {};
		$scope.myPms = [];
		$scope.myArea = null;
		$scope.myNewArea = null;
		
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		$scope.allMicrozones = sharedDataService.getSharedLocalMicroZones();
		$scope.allZones = sharedDataService.getSharedLocalZones();
		$scope.allPms = sharedDataService.getSharedLocalPms();
		angular.copy($scope.allPms, $scope.myPms);
		$scope.setMyLineGeometry(null);
		angular.copy($scope.allZones, $scope.myZones);
		
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
			poly.visible = false;		// here I hide the polyline for creation
			poly.setPath([]);			// and clear the path
			
			$scope.isEditing = true;
			$scope.isInit = false;
			angular.copy(street, $scope.eStreet);
			//$scope.eStreet = street;
		
			for(var i = 0; i < $scope.allArea.length; i++){
				if(street.rateAreaId == $scope.allArea[i].id){
					$scope.myArea = $scope.allArea[i];
				}
			}
			
			for(var j = 0; j < $scope.myZones.length; j++){
				//$scope.myZones[j].selected = false;
				for(var i = 0; i < street.myZones.length; i++){
					if(street.myZones[i] != null){
						if($scope.myZones[j].id == street.myZones[i].id){
							$scope.myMacrozone = $scope.myZones[j];
							//$scope.myZones[j].selected = true;
						}
					}
				}
			}
			
			var found = false;
			for(var j = 0; j < $scope.allMicrozones.length; j++){
				for(var i = 0; (i < street.zones.length) && !found; i++){
					if($scope.allMicrozones[j].id == street.zones[i]){
						found = true;
						$scope.myMicrozone = $scope.allMicrozones[j];
					}
				}
			}
			
			// I show only the pms in the same area of the street
			$scope.myPms = $scope.getPmsFromArea($scope.allPms, $scope.myArea);
			
			for(var j = 0; j < $scope.myPms.length; j++){
				$scope.myPms[j].selected = false;
				for(var i = 0; i < street.myPms.length; i++){
					//if($scope.myPms[j].code ==  street.myPms[i].code){
					if($scope.myPms[j].id ==  street.myPms[i].id){	
						$scope.myPms[j].selected = true;
					}
				}
			}
			
			$scope.sEditMap = {
				control: {},
				center: $scope.mapCenter,
				zoom: 15,
				bounds: {},
				options: {
					scrollwheel: true
				}
			};
			
			if(street.geometry != null && street.geometry.points.length > 0){
				var tmpLine = "";
				var poligons = {};
				for(var i = 0; i < street.geometry.points.length; i++){
					var tmpPoint = street.geometry.points[i].lat + "," + street.geometry.points[i].lng;
					tmpLine = tmpLine + tmpPoint + ",";
				}
				tmpLine = tmpLine.substring(0, tmpLine.length-1);
				$scope.setMyLineGeometry(tmpLine);
			
				poligons = street.geometry;
				$scope.editGStreet = {
					id: i,
					path: $scope.correctPoints(poligons.points),
					gpath: $scope.correctPointsGoogle(poligons.points),
					stroke: {
					    color: $scope.correctColor(street.color),
					    opacity: 1.0,
					    weight: 3
					},
					editable: true,
					draggable: true,
					visible: true
				};
			} else {
				// case of street with geografic object not created
				poly.visible = true;					// here I show the polyline for creation
				if($scope.editGStreet != null){
					$scope.editGStreet.visible = false;	// and hide the edit polyline
				}
			}
		} else {
			$scope.myNewArea = {};
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
				handicappedSlotNumber: null,
				reservedSlotNumber: null,
				timedParkSlotNumber: null,
				freeParkSlotNumber: null,
				unusuableSlotNumber: null,
				color: null,
				rateAreaId: null,
				zones: null,
				parkingMeters: null,
				geometry: null
			};
			
			//$scope.eStreetMap.shapes.editPolyline.setMap(false);	// and hide the edit polyline
			//$scope.setMyGeometry("0,0");
			//var tmppath = [];
		}
		$scope.viewModeS = false;
		$scope.editModeS = true;
		$scope.resizeMapTimed("editStreet", false);
		//$scope.resizeMap("editStreet");
	};
	
	var pmEditCode = 0; // used in edit to check if a new code is already used
	
	// ParkingMeters
	$scope.setPmEdit = function(parkingMeter){
		$scope.editPmMarkers = [];
		$scope.newPmMarkers = [];
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		$scope.myArea = {};
		
		// Case edit
		if(parkingMeter != null){
			$scope.isEditing = true;
			$scope.isInit = false;
			pmEditCode = parkingMeter.code;	// Here I temporary store the value of the actual code
			angular.copy(parkingMeter, $scope.parckingMeter);
			if(parkingMeter.status == "ACTIVE"){
				$scope.myStatus = $scope.listaStati[0];
			} else {
				$scope.myStatus = $scope.listaStati[1];
			}
			for(var i = 0; i < $scope.allArea.length; i++){
				if(parkingMeter.areaId == $scope.allArea[i].id){
					$scope.myArea = $scope.allArea[i];
				}
			}
			
			$scope.pmEditMap = {
				control: {},
				center: $scope.mapCenter,
				zoom: 15,
				bounds: {},
				options: {
					scrollwheel: true
				}
			};
			
			$scope.setMyGeometry(parkingMeter.geometry.lat + "," + parkingMeter.geometry.lng);
			
			$scope.myPm = {
				id: 0,
				coords: {
					latitude: parkingMeter.geometry.lat,
					longitude: parkingMeter.geometry.lng
				},
				pos:parkingMeter.geometry.lat + "," + parkingMeter.geometry.lng,
				options: { 
					draggable: true
				},
				icon: $scope.pmMarkerIcon
//				events: {
//				    dragend: function (marker, eventName, args) {
//				    	var lat = marker.getPosition().lat();
//				    	var lng = marker.getPosition().lng();
//				    	console.log('marker dragend: ' + lat + "," + lng);
//				    	$scope.setMyGeometry(lat + "," + lng);
//				    }
//				}
			};
			$scope.editPmMarkers.push($scope.myPm);
			
		} else {
			$scope.setMyGeometry(null);
			
			$scope.parckingMeter = {
				id: null,
				code: null,
				note: null,
				status: null,
				areaId: null,
				geometry: null
			};
			
		}
		$scope.viewModePM = false;
		$scope.editModePM = true;
		$scope.resizeMapTimed("editPm", false);
	};
	
	// ParkingStructure
	$scope.setPsEdit = function(parkingStruct){
		var d = new Date(0);
		d.setHours(0);
		d.setMinutes(0);
		$scope.startTime = d;
		$scope.endTime = d;
				
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
		$scope.editPsMarkers = [];
		$scope.newPsMarkers = [];
		
		$scope.myPayment = {
			cash_checked: false,
			automated_teller_checked: false,
			prepaid_card_checked: false,
			parcometro_checked: false
		};
		
		$scope.openingPeriods = [];
		
		// Case edit
		if(parkingStruct != null){
			$scope.isEditing = true;
			$scope.isInit = false;
			
			if(parkingStruct.openingTime != null){
				$scope.openingPeriods = parkingStruct.openingTime.period;
			}
			
			angular.copy(parkingStruct, $scope.parkingStructure);
			for(var i = 0; i < parkingStruct.paymentMode.length; i++){
				switch(parkingStruct.paymentMode[i]){
					case $scope.cash_mode:
						$scope.myPayment.cash_checked = true;
						break;
					case $scope.automated_teller_mode: 
						$scope.myPayment.automated_teller_checked = true;
						break;
					case $scope.prepaid_card_mode: 
						$scope.myPayment.prepaid_card_checked = true;
						break;
					case $scope.parcometro: 
						$scope.myPayment.parcometro_checked = true;
						break;
				}
			}
			
			$scope.psEditMap = {
				control: {},
				center: $scope.mapCenter,
				zoom: 15,
				bounds: {},
				options: {
					scrollwheel: true
				}
			};
			
			$scope.setMyGeometry(parkingStruct.geometry.lat + "," + parkingStruct.geometry.lng);
			
			$scope.myPs = {
				id: 0,
				coords: {
					latitude: parkingStruct.geometry.lat,
					longitude: parkingStruct.geometry.lng
				},
				pos:parkingStruct.geometry.lat + "," + parkingStruct.geometry.lng,
				options: { 
					draggable: true
				},
				icon: $scope.psMarkerIcon
			};
			$scope.editPsMarkers.push($scope.myPs);
			
		} else {
			$scope.setMyGeometry(null);
			$scope.parkingStructure = {
				name: null,
				streetReference: null,
				managementMode: null,
				paymentMode: null,
				phoneNumber: null,
				fee: null,
				timeSlot: null,
				slotNumber: null,
				handicappedSlotNumber: null,
				unusuableSlotNumber: null,
				geometry: null
			};
		}
		$scope.viewModePS = false;
		$scope.editModePS = true;
		$scope.resizeMapTimed("editPs", false);
	};
	
	// Zone
	$scope.setZEdit = function(zone){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
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
		
		// Case edit
		if(zone != null){
			
			gzone.setPath([]);						// here I clear the old path
			
			$scope.isEditing = true;
			$scope.isInit = false;
			angular.copy(zone, $scope.zone);
			//$scope.zone = zone;
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
			
			$scope.zEditMap = {
				control: {},
				center: zoneCenter,
				zoom: 15,
				bounds: {},
				options: {
					scrollwheel: true
				}
			};
			
			if(zone.geometry != null && zone.geometry.points.length > 0){
				var tmpPol = "";
				var poligons = {};
				for(var i = 0; i < zone.geometry.points.length; i++){
					var tmpPoint = zone.geometry.points[i].lat + "," + zone.geometry.points[i].lng;
					tmpPol = tmpPol + tmpPoint + ",";
				}
				tmpPol = tmpPol.substring(0, tmpPol.length-1);
				$scope.setMyPolGeometry(tmpPol);
			
				poligons = zone.geometry;
				$scope.editGZone = {
					id: zone.id,
					path: $scope.correctPoints(poligons.points),
					gpath: $scope.correctPointsGoogle(poligons.points),
					stroke: {
					    color: $scope.correctColor(zone.color),
					    weight: 3
					},
					geodesic: false,
					editable: true,
					draggable: true,
					visible: true,
					fill: {
					    color: $scope.correctColor(zone.color),
					    opacity: 0.4
					}
				};
			}	
		} else {
			gzone.setPath([]);										// here I clear the old path
			gzone.visible = true;									// here I show the polyline for creation
			if($scope.editGZone != null){
				$scope.editGZone.visible = false;					// and hide the edit polyline
			}
			//$scope.setMyGeometry("0,0");
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
				geometry: null,
				geometryFromSubelement: false
			};
			
			$scope.zCreateMap = {
				control: {},
				center: $scope.mapCenter,
				zoom: 15,
				bounds: {},
				options: {
					scrollwheel: true
				},
				events: {
					click: function(map, eventName, args){
						var e = args[0];
		            	console.log("I am in click event function" + e.latLng);
		            	var latLngString = "" + e.latLng;
		            	var pos = latLngString.split(",");
		            	var lat = pos[0].substring(1, pos[0].length);
		            	var lng = pos[1].substring(1, pos[1].length-1);
		            	var tmppos = {
		            			latitude: lat,
		            			longitude: lng
		            	};
		            	tmppath.push(tmppos);
		            	$scope.newZone = $scope.updateMyNewZone(tmppath);
		            	$scope.refreshMap($scope.zCreateMap);
		            	
		            	var tmpLine = "";
						for(var i = 0; i < tmppath.length; i++){
							var tmpPoint = tmppath[i].latitude + "," + tmppath[i].longitude;
							tmpLine = tmpLine + tmpPoint + ",";
						}
						tmpLine = tmpLine.substring(0, tmpLine.length-1);
						$scope.setMyNewLineGeometry(tmpLine);
				    	console.log('New street route: ' + tmpLine);
		            	
				    	//$scope.addMyNewMarker(tmppos, map);
					},
					dblclick: function(map, eventName, args){
						var e = args[0];
		            	console.log("I am in double click event function" + e.latLng);
		            	//var latLngString = "" + e.latLng;
		            	
		            	//var geocoder = new google.maps.Geocoder();
		    			//geocoder.geocode({location:e.latLng}, function(response) {
		    			//	var result = response[0].formatted_address;
		    			//	if (result != undefined && result != null) {
		    			//		$scope.street.streetReference = result.substring(0, result.indexOf(','));
		    			//	}
		    			//});
					}
				}
			};
		}
		$scope.viewModeZ = false;
		$scope.editModeZ = true;
		$scope.resizeMapTimed("editZone", false);
	};
	
//	$scope.setMicroZEdit = function(microzone){
//		// Case create
//		$scope.isEditing = false;
//		$scope.isInit = true;
//		
//		$scope.myColor = "";
//		// Case edit
//		if(microzone != null){
//			
//			$scope.isEditing = true;
//			$scope.isInit = false;
//			angular.copy(microzone, $scope.microzone);
//			//$scope.zone = zone;
//			//var zoneCenter = $scope.mapCenter;
//			
//			$scope.myColor = $scope.correctColor(microzone.color);
//			if(microzone.geometry != null && microzone.geometry.points.length > 0){
//				zoneCenter = {
//					latitude: microzone.geometry.points[0].lat,
//					longitude: microzone.geometry.points[0].lng
//				};
//			}
//			
//			if(microzone.geometry != null && microzone.geometry.points.length > 0){
//				var tmpPol = "";
//				var poligons = {};
//				for(var i = 0; i < microzone.geometry.points.length; i++){
//					var tmpPoint = microzone.geometry.points[i].lat + "," + microzone.geometry.points[i].lng;
//					tmpPol = tmpPol + tmpPoint + ",";
//				}
//				tmpPol = tmpPol.substring(0, tmpPol.length-1);
//				$scope.setMyPolGeometry(tmpPol);
//			
//				poligons = microzone.geometry;
//				$scope.editGZone = {
//					id: zone.id,
//					path: $scope.correctPoints(poligons.points),
//					gpath: $scope.correctPointsGoogle(poligons.points),
//					stroke: {
//					    color: $scope.correctColor(microzone.color),
//					    weight: 3
//					},
//					geodesic: false,
//					editable: true,
//					draggable: true,
//					visible: true,
//					fill: {
//					    color: $scope.correctColor(microzone.color),
//					    opacity: 0.4
//					}
//				};
//			}	
//		} else {
//			var tmppath = [];
//			
//			$scope.microzone = {
//				id: null,
//				id_app: null,
//				nome: null,
//				submacro: null,
//				submicro: null,
//				color: null,
//				note: null,
//				type: null,
//				geometry: null,
//				geometryFromSubelement: false
//			};
//		}
//		$scope.viewModeMicroZ = false;
//		$scope.editModeMicroZ = true;
//		//$scope.resizeMapTimed("editZone", false);
//	};	
	
	// BikePoint
	$scope.setBpEdit = function(bikePoint){
		$scope.editBikePointMarkers = [];
		$scope.newBikePointMarkers = [];
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
			geometry: null
		};
		
		// Case edit
		if(bikePoint != null){
			$scope.isEditing = true;
			$scope.isInit = false;
			angular.copy(bikePoint, $scope.bikePoint);
			
			$scope.bpEditMap = {
				control: {},
				center: $scope.mapCenter,
				zoom: 15,
				bounds: {},
				options: {
					scrollwheel: true
				}
			};
			
			$scope.setMyGeometry($scope.bikePoint.geometry.lat + "," + $scope.bikePoint.geometry.lng);
			
			$scope.myBp = {
				id: 0,
				coords: {
					latitude: $scope.bikePoint.geometry.lat,
					longitude: $scope.bikePoint.geometry.lng
				},
				pos:$scope.bikePoint.geometry.lat + "," + $scope.bikePoint.geometry.lng,
				options: { 
					draggable: true
				},
				icon: $scope.bpMarkerIcon
			};
			$scope.editBikePointMarkers.push($scope.myBp);
			
		} else {
			$scope.setMyGeometry(null);
		}
		$scope.viewModeBP = false;
		$scope.editModeBP = true;
		$scope.resizeMapTimed("editBike", false);
	};
	
	$scope.setMyGeometry = function(value){
		$scope.myGeometry = value;
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
				    	$scope.setMyGeometry(lat + "," + lng);
				    }
				}
		};
	};
	
	$scope.setMyGeometry = function(value){
		$scope.myGeometry = value;
	};
	
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
				    	$scope.setMyGeometry(lat + "," + lng);
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
	    	$scope.myGeometry = ret.pos;
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
	    	$scope.myGeometry = ret.pos;
	    	$scope.getStructAddress(event);
	    	return $scope.newPsMarkers.push(ret);
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
	    	$scope.myGeometry = ret.pos;
	    	return $scope.newBikePointMarkers.push(ret);
		}
    };
	
	$scope.updatePmPos = function(event){
    	var pos = event.latLng;
    	$scope.myGeometry = pos.lat() + "," + pos.lng();
    };
    
    $scope.updatePsPos = function(event){
    	var pos = event.latLng;
    	$scope.myGeometry = pos.lat() + "," + pos.lng();
    	$scope.getStructAddress(event);
    };
    
    $scope.updatePos = function(event){
    	var pos = event.latLng;
    	$scope.myGeometry = pos.lat() + "," + pos.lng();
    };
    
    $scope.moveMarker = function(val){
    	if($scope.newBikePointMarkers!=null && $scope.newBikePointMarkers.length > 0){
    		$scope.newBikePointMarkers[0].pos = val;
    	}
    };
	
	// Object Update methods
	// Area
	$scope.updateArea = function(form, area, color){ //, polygon
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingAErrorMessage = false;
			
			var editCorrectedPath = [];
			var editPaths = [];
			if($scope.editGAreas != null &&  $scope.editGAreas.length > 0){
				// case edit polygons or adding polygons
				for(var j = 0; j < $scope.editGAreas.length; j++){
					var updatedAreaPol = {};
					if($scope.editGAreas[j].id != null){
						updatedAreaPol = $scope.map.shapes[$scope.editGAreas[j].id];
					}
					if(updatedAreaPol != null){
						var updatedPath = updatedAreaPol.getPath();
						if(updatedPath != null && updatedPath.length > 0){
							editCorrectedPath = [];
							for(var i = 0; i < updatedPath.length; i++){
								var point = $scope.getPointFromLatLng(updatedPath.j[i], 1);
								editCorrectedPath.push(point);
							}
							editPaths.push(editCorrectedPath);
						}
						//updatedAreaPol.setMap(null);	//Here I delete the area in edit map
					}
				}
				if($scope.aEditAddingPolygon){
					var createdPath = garea.getPath();
					editCorrectedPath = [];
					for(var i = 0; i < createdPath.length; i++){
						var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
						editCorrectedPath.push(point);
					}
					editPaths.push(editCorrectedPath);
					$scope.aEditAddingPolygon = false;
					
					if($scope.editNewAreas != null && $scope.editNewAreas.length > 0){
						for(var j = 0; j < $scope.editNewAreas.length; j++){
							createdPath = $scope.editNewAreas[j].getPath();
							editCorrectedPath = [];
							for(var i = 0; i < createdPath.length; i++){
								var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
								editCorrectedPath.push(point);
							};
							editPaths.push(editCorrectedPath);
						}
					}
				}
			}
			
//			var updatedPath = $scope.map.shapes.editAPolygon.getPath();
//			if(updatedPath != null && updatedPath.length > 0){
//				for(var i = 0; i < updatedPath.length; i++){
//					var point = $scope.getPointFromLatLng(updatedPath.j[i], 1);
//					editCorrectedPath.push(point);
//				}
//				editPaths.push(editCorrectedPath);
//			}
			else {
				//if($scope.aEditAddingPolygon || ($scope.allNewAreas != null && $scope.allNewAreas.length > 0) || (garea.visible == true)){
				// case creating polygons in area edit
				var createdPath = garea.getPath();
				for(var i = 0; i < createdPath.length; i++){
					var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
					editCorrectedPath.push(point);
				}
				editPaths.push(editCorrectedPath);
				if($scope.allNewAreas != null && $scope.allNewAreas.length > 0){
					for(var i = 0; i < $scope.allNewAreas.length; i++){
						createdPath = $scope.allNewAreas[i].getPath();
						editCorrectedPath = [];
						for(var i = 0; i < createdPath.length; i++){
							var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
							editCorrectedPath.push(point);
						};
						editPaths.push(editCorrectedPath);
					}
				}
			}
			
			var id = area.id;
			var appId = sharedDataService.getConfAppId();
			var method = 'PUT';
			
			var decimalFee = $scope.correctDecimal(area.fee, 1);
			
			var data = {
				id: area.id,
				id_app: area.id_app,
				name: area.name,
				fee: parseFloat(decimalFee),
				timeSlot: area.timeSlot,
				smsCode: area.smsCode,
				color: color.substring(1, color.length),
				note: area.note,
				geometry: $scope.correctMyGeometryPolygonForArea(editPaths)
				//geometry: $scope.correctMyGeometryPolygonForArea(polygon.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Area data : " + value);
			
		   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area/" + id, null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated street: " + result);
		    	if(result != null){ // == "OK"){
		    		$scope.getAreasFromDb();
					$scope.editModeA = false;
		    	} else {
		    		$scope.editModeA = true;
		    		$scope.showUpdatingAErrorMessage = true;
		    	}
		    });
		}
	};
	
	// Street
	$scope.updateStreet = function(form, street, area, zone, microzone, pms){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingSErrorMessage = false;
			
			var editCorrectedPath = [];
			var updatedPath = $scope.map.shapes.editPolyline.getPath();
			if(updatedPath != null && updatedPath.length > 0){
			for(var i = 0; i < updatedPath.length; i++){
				var point = $scope.getPointFromLatLng(updatedPath.j[i], 1);
				editCorrectedPath.push(point);
			}
			} else {
				var createdPath = poly.getPath();
				for(var i = 0; i < createdPath.length; i++){
					var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
					editCorrectedPath.push(point);
				}
			}
			//var calculatedPaidSlot = street.slotNumber - street.handicappedSlotNumber - street.reservedSlotNumber - street.timedParkSlotNumber - street.freeParkSlotNumber - street.freeParkSlotSignNumber - street.unusuableSlotNumber;
			var calculatedTotSlots = $scope.initIfNull(street.handicappedSlotNumber) + $scope.initIfNull(street.reservedSlotNumber) + $scope.initIfNull(street.paidSlotNumber) + $scope.initIfNull(street.timedParkSlotNumber) + $scope.initIfNull(street.freeParkSlotNumber) + $scope.initIfNull(street.freeParkSlotSignNumber) + $scope.initIfNull(street.unusuableSlotNumber);
			var id = street.id;
			var appId = sharedDataService.getConfAppId();
			var method = 'PUT';
			
			var data = {
				id: street.id,
				id_app: street.id_app,
				streetReference: street.streetReference,
				slotNumber: calculatedTotSlots,			//street.slotNumber,
				handicappedSlotNumber: street.handicappedSlotNumber,
				reservedSlotNumber: street.reservedSlotNumber,
				timedParkSlotNumber:street.timedParkSlotNumber,
				paidSlotNumber: street.paidSlotNumber,	//calculatedPaidSlot, //street.paidSlotNumber,
				freeParkSlotNumber: street.freeParkSlotNumber,
				freeParkSlotSignNumber: street.freeParkSlotSignNumber,
				unusuableSlotNumber: street.unusuableSlotNumber,
				subscritionAllowedPark: street.subscritionAllowedPark,
				color: area.color,
				rateAreaId: area.id,
				zones: $scope.correctMyZonesForStreet(zone, microzone),
				parkingMeters: $scope.correctMyPmsForStreet(pms),
				geometry: $scope.correctMyGeometryPolyline(editCorrectedPath)
				//geometry: $scope.correctMyGeometryPolyline(polyline.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Street data : " + value);
			
		    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street/" + id, null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/street/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated street: " + JSON.stringify(result));
		    	if(result != null){ // == "OK"){
		    		$scope.getStreetsFromDb();
		    		$scope.myMicrozone = null;
		    		$scope.myMacrozone = null;
					$scope.editModeS = false;
		    	} else {
		    		$scope.editModeS = true;
		    		$scope.showUpdatingSErrorMessage = true;
		    	}
		    });
		}
	};
	
	$scope.updateStreetPM = function(street){
		var id = street.id;
		var appId = sharedDataService.getConfAppId();
		var method = 'PUT';
		
		var data = {
			id: street.id,
			id_app: street.id_app,
			streetReference: street.streetReference,
			slotNumber: street.slotNumber,
			handicappedSlotNumber: street.handicappedSlotNumber,
			reservedSlotNumber: street.reservedSlotNumber,
			timedParkSlotNumber:street.timedParkSlotNumber,
			paidSlotNumber: street.paidSlotNumber,
			freeParkSlotNumber: street.freeParkSlotNumber,
			freeParkSlotSignNumber: street.freeParkSlotSignNumber,
			unusuableSlotNumber: street.unusuableSlotNumber,
			subscritionAllowedPark: street.subscritionAllowedPark,
			color: street.color,
			rateAreaId: street.rateAreaId,
			zones: street.zones,
			parkingMeters: street.parkingMeters,
			geometry: street.geometry
			//geometry: $scope.correctMyGeometryPolyline(polyline.path)
		};
		
	    var value = JSON.stringify(data);
	    if($scope.showLog) console.log("Street data : " + value);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street/" + id, null, $scope.authHeaders, value);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/street/" + id, null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Updated street: " + result);
	    	if(result != null){ // == "OK"){
	    		$scope.getStreetsFromDb();
	    	}	
	    });	
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
	
	// Update parkingMeter Object
	$scope.updatePmeter = function(form, pm, status, area, geometry){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingErrorMessage = false;
			
			var id = pm.id;
			var appId = sharedDataService.getConfAppId();
			var method = 'PUT';
			
			var data = {
				id: pm.id,
				id_app: pm.id_app,
				code: pm.code,
				note: pm.note,
				status: status.idObj,
				areaId: area.id,
				geometry: $scope.correctMyGeometry(geometry)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Parkingmeter data : " + value);
			
		    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter/" + id, null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated parkinMeter: " + result);
		    	if(result != null){ // == "OK"){
		    		$scope.getParkingMetersFromDb();
		    		$scope.editModePM = false;
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
				    				$scope.updateStreetPM($scope.streetWS[i]);
				    			}
				    		}
				    	}
				    }
				    oldCode = "";	// clear the code of the pm
			    }
		    	
		    });
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
	
	// Update ParkingStructure Object
	$scope.updatePstruct = function(form, ps, paymode, geo){
		if(!form.$valid){
			$scope.isInit=false;
			if(!$scope.checkCorrectPaymode(paymode)){
				$scope.setMyPaymentoErrMode(true);
			} else {
				$scope.setMyPaymentoErrMode(false);
			}
		} else {
			if(!$scope.checkCorrectPaymode(paymode)){
				$scope.isInit=false;
				$scope.setMyPaymentoErrMode(true);
			} else {
				$scope.isInit=true;
				$scope.showUpdatingPSErrorMessage = false;
				$scope.setMyPaymentoErrMode(false);
				
				var fee_eurocent = 0;
				if(ps.fee_val != null){
					if(ps.fee_val.indexOf(",") > -1){
						ps.fee_val = ps.fee_val.replace(",", ".");
					}
					fee_eurocent = Number(ps.fee_val) * 100;
				}
				
				// openingPeriod
				var openingPeriod = { period: [{from: "0:00", to: "23:59"}]};
				if($scope.openingPeriods != null && $scope.openingPeriods.length > 0){
					var cleanedPeriods = [];
					for(var i = 0; i < $scope.openingPeriods.length; i++){
						var cleanedPeriod = { from : $scope.openingPeriods[i].from, to: $scope.openingPeriods[i].to };
						cleanedPeriods.push(cleanedPeriod);
					}
					openingPeriod = { 
						period: cleanedPeriods	
					};
				}
				
				var id = ps.id;
				var appId = sharedDataService.getConfAppId();
				var method = 'PUT';
				
				var data = {
					id: ps.id,
					id_app: ps.id_app,
					name: ps.name,
					streetReference: ps.streetReference,
					fee_val: fee_eurocent,
					fee_note: ps.fee_note,
					timeSlot: ps.timeSlot,
					openingTime: openingPeriod,
					managementMode: ps.managementMode,
					phoneNumber: ps.phoneNumber,
					paymentMode: $scope.correctMyPaymentMode(paymode),
					slotNumber: ps.slotNumber,
					handicappedSlotNumber: ps.handicappedSlotNumber,
					unusuableSlotNumber: ps.unusuableSlotNumber,
					geometry: $scope.correctMyGeometry(geo),
					parkAndRide: ps.parkAndRide
				};
				
			    var value = JSON.stringify(data);
			    if($scope.showLog) console.log("Parkingmeter data : " + value);
				
				//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure/" + id, null, $scope.authHeaders, value);
			   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure/" + id, null, $scope.authHeaders, value);
			    myDataPromise.then(function(result){
			    	console.log("Updated parkingStructure: " + result);
			    	if(result != null){ // == "OK"){
			    		$scope.getParkingStructuresFromDb();
						$scope.editModePS = false;
						$scope.mySpecialPSMarkers = [];
			    	} else {
			    		$scope.editModePS = true;
			    		$scope.showUpdatingPSErrorMessage = true;
			    	}
			    });
			}
		}	
	};
	
	
	// Update Zone Object
	$scope.updateZone = function(form, zone, myColor){	//, polygon
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingZErrorMessage = false;
			
			var editCorrectedPath = [];
			var updatedPath = $scope.map.shapes.editZPolygon.getPath();
			if(updatedPath != null && updatedPath.length > 0){
				for(var i = 0; i < updatedPath.length; i++){
					var point = $scope.getPointFromLatLng(updatedPath.j[i], 1);
					editCorrectedPath.push(point);
				}
			} else {
				var createdPath = gzone.getPath();
				for(var i = 0; i < createdPath.length; i++){
					var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
					editCorrectedPath.push(point);
				}
			}
			
			var id = zone.id;
			var appId = sharedDataService.getConfAppId();
			var method = 'PUT';
			
			var data = {
				id: zone.id,
				id_app: zone.id_app,
				name: zone.name,
				submacro: zone.submacro,
				submicro: zone.submicro,
				color: myColor.substring(1, myColor.length),	// I have to remove '#' char
				note: zone.note,
				type: zone.type,
				geometry: $scope.correctMyGeometryPolyline(editCorrectedPath),
				geometryFromSubelement: zone.geometryFromSubelement
				//geometry: $scope.correctMyGeometryPolyline(polygon.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Zone data : " + value);
			
		    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone/" + id, null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated Zone: " + result);
		    	if(result != null){ // == "OK"){
		    		$scope.getZonesFromDb(zone.type);
					$scope.editModeZ = false;
		    	} else {
		    		$scope.editModeZ = true;
		    		$scope.showUpdatingZErrorMessage = true;
		    	}
		    });
		}
	};
	
	// Update BikePoint Object
	$scope.updateBpoint = function(form, geo){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingBPErrorMessage = false;
			
			var id = $scope.bikePoint.id;
			var appId = sharedDataService.getConfAppId();
			var method = 'PUT';
			var bp = $scope.bikePoint;
			
			var data = {
				id: bp.id,
				id_app: bp.id_app,
				name: bp.name,
				slotNumber: bp.slotNumber,
				bikeNumber: bp.bikeNumber,
				geometry: $scope.correctMyGeometry(geo)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Bikepoint data : " + value);
			
		   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint/" + id, null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/bikepoint/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated bikepoint: " + result);
		    	if(result != null){//== "OK"){
		    		$scope.getBikePointsFromDb();
					$scope.editModeBP = false;
		    	} else {
		    		$scope.editModeBP = true;
		    		$scope.showUpdatingBPErrorMessage = true;
		    	}
		    });
		}
	};
	
	// Prepare Delete Methods
	// Area
	$scope.setARemove = function(area){
		var delArea = $dialogs.confirm("Attenzione", "Vuoi cancellare l'area '" + area.name + "'? La cancellazione dell'area comportera' la rimozione di 'vie' e 'parcometri' ad essa associati. Continuare?");
			delArea.result.then(function(btn){
				// yes case
				$scope.deleteArea(area);
				// Call the delete method
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	// Street
	$scope.setSRemove = function(street){
		var delStreet = $dialogs.confirm("Attenzione", "Vuoi cancellare la via '" + street.streetReference + "'?");
			delStreet.result.then(function(btn){
				// yes case
				$scope.deleteStreet(street);
				// Call the delete method
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	// ParkingMeter
	$scope.setPmRemove = function(pMeter){
		var delParking = $dialogs.confirm("Attenzione", "Vuoi cancellare il parchimetro con codice '" + pMeter.code + "'?");
			delParking.result.then(function(btn){
				// yes case
				$scope.deletePMeter(pMeter);
				// Call the delete method
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	// ParkingStructure
	$scope.setPsRemove = function(pStruct){
		var delStruct = $dialogs.confirm("Attenzione", "Vuoi cancellare la struttura '" + pStruct.name + "'?");
			delStruct.result.then(function(btn){
				// yes case
				$scope.deletePStruct(pStruct);
				// Call the delete method
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	// Zone
	$scope.setZRemove = function(zone){
		var sub = (zone.submacro != null) ? zone.submacro : zone.submicro;
		var delZone = $dialogs.confirm("Attenzione", "Vuoi cancellare la zona '" + zone.name + "-" + sub + "'?");
			delZone.result.then(function(btn){
				// yes case
				$scope.deleteZone(zone);
				
				// Call the delete method
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	// BikePoint
	$scope.setBpRemove = function(bPoint){
		var delBike = $dialogs.confirm("Attenzione", "Vuoi cancellare il punto bici '" + bPoint.name + "'?");
			delBike.result.then(function(btn){
				// yes case
				$scope.deleteBPoint(bPoint);
				// Call the delete method
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	// Object Deleting Methods
	//Area
	$scope.deleteArea = function(area){
		$scope.showDeletingAErrorMessage = false;
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
		// area removing from gmap
		var toDelArea = $scope.vAreaMap.shapes;
		if(area.geometry.length == 1){
			if(toDelArea[area.id] != null){
				toDelArea[area.id].setMap(null);
			}
		} else {
			for(var i = 0; i < area.geometry.length; i++){
				var myId = $scope.correctObjId(area.id, i);
				if(toDelArea[myId] != null){
					toDelArea[myId].setMap(null);
				}
			}
		}
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area/" + area.id , null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area/" + area.id , null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted area: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		$scope.getAreasFromDb();
	    		//$scope.editModeA = false;
	    	} else {
	    		//$scope.editModeA = true;
	    		$scope.showDeletingAErrorMessage = true;
	    	}
	    });
	};
	
	// Street
	$scope.deleteStreet = function(street){
		$scope.showDeletingSErrorMessage = false;
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
		// street removing from gmap
		var toDelStreet = $scope.vStreetMap.shapes;
    	if(toDelStreet[street.id] != null){
    		toDelStreet[street.id].setMap(null);
    	}
		
    	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street/" + street.rateAreaId + "/" + street.id , null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/street/" + street.rateAreaId + "/" + street.id , null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted street: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		$scope.getStreetsFromDb();
	    		//$scope.editModeA = false;
	    	} else {
	    		//$scope.editModeA = true;
	    		$scope.showDeletingSErrorMessage = true;
	    	}
	    });
	};
	
	// ParkingMeter
	$scope.deletePMeter = function(pMeter){
		$scope.showDeletingPMErrorMessage = false;
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter/" + pMeter.areaId + "/"  + pMeter.id , null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter/" + pMeter.areaId + "/"  + pMeter.id , null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted parkingmeter: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		// Here I have to remove the pmCode from the street
	    		for(var i = 0; i < $scope.streetWS.length; i++){
			    	if($scope.streetWS[i].parkingMeters != null && $scope.streetWS[i].parkingMeters.length > 0){
			    		for(var p = 0; p < $scope.streetWS[i].parkingMeters.length; p++){
			    			if($scope.streetWS[i].parkingMeters[p] == pMeter.code){
			    				$scope.streetWS[i].parkingMeters.splice(p,1);
			    				$scope.updateStreetPM($scope.streetWS[i]);
			    			}
			    		}
			    	}
			    }
	    		$scope.getParkingMetersFromDb();
	    	} else {
	    		//$scope.editModeA = true;
	    		$scope.showDeletingPMErrorMessage = true;
	    	}
	    });
	};
	
	// ParkingStructure
	$scope.deletePStruct = function(pStruct){
		$scope.showDeletingPSErrorMessage = false;
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure/" + pStruct.id, null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure/" + pStruct.id, null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted struct: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		$scope.getParkingStructuresFromDb();
	    		//$scope.editModeA = false;
	    	} else {
	    		//$scope.editModeA = true;
	    		$scope.showDeletingPSErrorMessage = true;
	    	}
	    });
	};
	
	// Zone
	$scope.deleteZone = function(zone){
		$scope.showDeletingZErrorMessage = false;
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
		// zone removing from gmap
		var toDelZone = $scope.vZoneMap.shapes;
		var toDelMicroZone = $scope.vMicroZoneMap.shapes;
    	if(toDelZone[zone.id] != null){
    		toDelZone[zone.id].setMap(null);
    	} else {
    		if(toDelMicroZone[zone.id] != null){
    			toDelMicroZone[zone.id].setMap(null);
    		}
    	}
		
    	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone/" + zone.id, null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone/" + zone.id, null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted zone: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		// Here I have to remove the zone id from the street
	    		for(var i = 0; i < $scope.streetWS.length; i++){
			    	if($scope.streetWS[i].zones != null && $scope.streetWS[i].zones.length > 0){
			    		for(var z = 0; z < $scope.streetWS[i].zones.length; z++){
			    			if($scope.streetWS[i].zones[z] == zone.id){
			    				$scope.streetWS[i].zones.splice(z,1);
			    				$scope.updateStreetPM($scope.streetWS[i]);
			    			}
			    		}
			    	}
			    }
	    		$scope.getZonesFromDb(zone.type);
	    	} else {
	    		//$scope.editModeA = true;
	    		$scope.showDeletingZErrorMessage = true;
	    	}
	    });
	};
	
	// BikePoint
	$scope.deleteBPoint = function(bPoint){
		$scope.showDeletingBPErrorMessage = false;
		var method = 'DELETE';
		var appId = sharedDataService.getConfAppId();
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint/" + bPoint.id , null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, appId + "/bikepoint/" + bPoint.id , null, $scope.authHeaders, null);
	   	myDataPromise.then(function(result){
	    	console.log("Deleted bikePoint: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		$scope.getBikePointsFromDb();
	    		//$scope.editModeA = false;
	    	} else {
	    		//$scope.editModeA = true;
	    		$scope.showDeletingBPErrorMessage = true;
	    	}
	    });
	};
	
	
	// Object Creation Methods
	// Area
	$scope.createArea = function(form, area, myColor){ //, polygon
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingAErrorMessage = false;
			
			var newCorrectedPath = [];
			var createdPaths = [];
			var createdPath = garea.getPath();
			if(createdPath.length > 0){
				for(var i = 0; i < createdPath.length; i++){
					var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
					newCorrectedPath.push(point);
				};
				createdPaths.push(newCorrectedPath);
			}
			if($scope.allNewAreas != null && $scope.allNewAreas.length > 0){
				for(var j = 0; j < $scope.allNewAreas.length; j++){
					createdPath = $scope.allNewAreas[j].getPath();
					newCorrectedPath = [];
					for(var i = 0; i < createdPath.length; i++){
						var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
						newCorrectedPath.push(point);
					};
					createdPaths.push(newCorrectedPath);
				}
			}
			//$scope.allNewAreas = [];	// Here I clear the array of area polygons
			
			var method = 'POST';
			var appId = sharedDataService.getConfAppId();
			
			var decimalFee = $scope.correctDecimal(area.fee, 1);
			var data = {
				id_app: $scope.myAppId,
				name: area.name,
				fee: parseFloat(decimalFee),
				timeSlot: area.timeSlot,
				smsCode: area.smsCode,
				color: myColor.substring(1, myColor.length),	// I have to remove '#' char
				note: area.note,
				geometry: $scope.correctMyGeometryPolygonForArea(createdPaths)
				//geometry: $scope.correctMyGeometryPolygonForArea(polygon.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Area data : " + value);
			
		    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/area", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Created area: " + JSON.stringify(result));
		    	if(result != null && result != ""){
		    		$scope.getAreasFromDb();
		    		$scope.editModeA = false;
		    	} else {
		    		$scope.editModeA = true;
		    		$scope.showUpdatingAErrorMessage = true;
		    	}
		    });
		}
	};
	
	$scope.initIfNull = function(value){
		if(value == null || value == ""){
			value = 0;
		}
		return parseInt(value);
	};
	
	// Street
	$scope.createStreet = function(form, street, area, zone, microzone, pms){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingSErrorMessage = false;
			
			var newCorrectedPath = [];
			var createdPath = poly.getPath();
			for(var i = 0; i < createdPath.length; i++){
				var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
				newCorrectedPath.push(point);
			};
			//var calculatedPaidSlot = street.slotNumber - street.handicappedSlotNumber - street.reservedSlotNumber - street.timedParkSlotNumber - street.freeParkSlotNumber - street.freeParkSlotSignNumber - street.unusuableSlotNumber;
			var calculatedTotSlots = $scope.initIfNull(street.handicappedSlotNumber) + $scope.initIfNull(street.reservedSlotNumber) + $scope.initIfNull(street.paidSlotNumber) + $scope.initIfNull(street.timedParkSlotNumber) + $scope.initIfNull(street.freeParkSlotNumber) + $scope.initIfNull(street.freeParkSlotSignNumber) + $scope.initIfNull(street.unusuableSlotNumber);
			
			var method = 'POST';
			var appId = sharedDataService.getConfAppId();
			var data = {
				id_app: $scope.myAppId,
				streetReference: street.streetReference,
				slotNumber: calculatedTotSlots,//street.slotNumber,
				handicappedSlotNumber: street.handicappedSlotNumber,
				reservedSlotNumber : street.reservedSlotNumber,
				timedParkSlotNumber: street.timedParkSlotNumber,
				paidSlotNumber: street.paidSlotNumber,//calculatedPaidSlot, //street.paidSlotNumber,
				freeParkSlotNumber: street.freeParkSlotNumber,
				freeParkSlotSignNumber: street.freeParkSlotSignNumber,
				unusuableSlotNumber: street.unusuableSlotNumber,
				subscritionAllowedPark: street.subscritionAllowedPark,
				color: area.color,
				rateAreaId: area.id,
				zones: $scope.correctMyZonesForStreet(zone, microzone),
				parkingMeters: $scope.correctMyPmsForStreet(pms),
				geometry: $scope.correctMyGeometryPolyline(newCorrectedPath)
				//geometry: $scope.correctMyGeometryPolyline(polyline.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Street data : " + value);
			
		    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/street", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Created street: " + JSON.stringify(result));
		    	if(result != null && result != ""){
		    		$scope.getStreetsFromDb();
		    		$scope.myMicrozone = null;
		    		$scope.myMacrozone = null;
					$scope.editModeS = false;
		    	} else {
		    		$scope.editModeS = true;
		    		$scope.showUpdatingSErrorMessage = true;
		    	}
		    	// Here I try to clear the area and the polyline values
		    	area = null;
		    	//polyline = null;
		    });	
		}
	};
	
	
	// ParkingMeter
	$scope.createPmeter = function(form, pm, status, area, geometry){
		if(!form.$valid || showPMErrorCode){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingErrorMessage = false;
			
			var method = 'POST';
			var appId = sharedDataService.getConfAppId();
			var data = {
				id_app: $scope.myAppId,
				code: pm.code,
				note: pm.note,
				status: status.idObj,
				areaId: area.id,
				geometry: $scope.correctMyGeometry(geometry)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Parkingmeter data : " + value);
			
		    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter", null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingmeter", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Created parkinMeter: " + JSON.stringify(result));
		    	if(result != null && result != ""){
		    		$scope.getParkingMetersFromDb();
		    		$scope.editModePM = false;
		    	} else {
		    		$scope.editModePM = true;
		    		$scope.showUpdatingErrorMessage = true;
		    	}
		    });
		}
	};
	
	// ParkingStructure
	$scope.createPstruct = function(form, ps, paymode, geo){
		if(!form.$valid){
			$scope.isInit=false;
			if(!$scope.checkCorrectPaymode(paymode)){
				$scope.setMyPaymentoErrMode(true);
			} else {
				$scope.setMyPaymentoErrMode(false);
			}
		} else {
			if(!$scope.checkCorrectPaymode(paymode)){
				$scope.isInit=false;
				$scope.setMyPaymentoErrMode(true);
			} else {
				$scope.isInit=true;
				$scope.showUpdatingPSErrorMessage = false;
				$scope.setMyPaymentoErrMode(false);
				
				var fee_eurocent = 0;
				if(ps.fee_val != null){
					if(ps.fee_val.indexOf(",") > -1){
						ps.fee_val = ps.fee_val.replace(",", ".");
					}
					fee_eurocent = Number(ps.fee_val) * 100;
				}
				
				// openingPeriod
				var openingPeriod = { period: [{from: "0:00", to: "23:59"}]};
				if($scope.openingPeriods != null && $scope.openingPeriods.length > 0){
					var cleanedPeriods = [];
					for(var i = 0; i < $scope.openingPeriods.length; i++){
						var cleanedPeriod = { from : $scope.openingPeriods[i].from, to: $scope.openingPeriods[i].to };
						cleanedPeriods.push(cleanedPeriod);
					}
					openingPeriod = { 
						period: cleanedPeriods	
					};
				}
				
				var method = 'POST';
				var appId = sharedDataService.getConfAppId();
				var data = {
					id_app: $scope.myAppId,
					name: ps.name,
					streetReference: ps.streetReference,
					fee_val: fee_eurocent,
					fee_note: ps.fee_note,
					timeSlot : ps.timeSlot,
					openingTime: openingPeriod,
					managementMode: ps.managementMode,
					phoneNumber: ps.phoneNumber,
					paymentMode: $scope.correctMyPaymentMode(paymode),
					slotNumber: ps.slotNumber,
					handicappedSlotNumber: ps.handicappedSlotNumber,
					unusuableSlotNumber: ps.unusuableSlotNumber,
					geometry: $scope.correctMyGeometry(geo),
					parkAndRide: ps.parkAndRide
				};
				
			    var value = JSON.stringify(data);
			    if($scope.showLog) console.log("Parkingmeter data : " + value);
				
			   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure", null, $scope.authHeaders, value);
			   	var myDataPromise = invokeWSService.getProxy(method, appId + "/parkingstructure", null, $scope.authHeaders, value);
			    myDataPromise.then(function(result){
			    	console.log("Created parkingStructure: " + JSON.stringify(result));
			    	if(result != null && result != ""){
			    		$scope.getParkingStructuresFromDb();
						$scope.editModePS = false;
			    	} else {
			    		$scope.editModePS = true;
			    		$scope.showUpdatingPSErrorMessage = true;
			    	}
			    });	
			}
		}
	};
	
	// Street
	$scope.createZone = function(form, zone, myColor){	//, polygon
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingZErrorMessage = false;
			
			var newCorrectedPath = [];
			var createdPath = gzone.getPath();
			for(var i = 0; i < createdPath.length; i++){
				var point = $scope.getPointFromLatLng(createdPath.j[i], 1);
				newCorrectedPath.push(point);
			};
			
			var method = 'POST';
			var appId = sharedDataService.getConfAppId();
			var data = {
				id_app: $scope.myAppId,
				name: zone.name,
				submacro: zone.submacro,
				submicro: zone.submicro,
				color: myColor.substring(1, myColor.length),	// I have to remove '#' char
				note: zone.note,
				type: zone.type,
				geometry: $scope.correctMyGeometryPolyline(newCorrectedPath),
				geometryFromSubelement: zone.geometryFromSubelement
				//geometry: $scope.correctMyGeometryPolyline(polygon.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Zone data : " + value);
			
		   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone", null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/zone", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Created zone: " + JSON.stringify(result));
		    	if(result != null && result != ""){
		    		$scope.getZonesFromDb(zone.type);
					$scope.editModeZ = false;
		    	} else {
		    		$scope.editModeZ = true;
		    		$scope.showUpdatingZErrorMessage = true;
		    	}
		    });	
		}
	};
	
	// BikePoint
	$scope.createBpoint = function(form, geo){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingBPErrorMessage = false;
			
			var method = 'POST';
			var bp = $scope.bikePoint;
			var appId = sharedDataService.getConfAppId();
			
			var data = {
				id_app: $scope.myAppId,
				name: bp.name,
				slotNumber: bp.slotNumber,
				bikeNumber: bp.bikeNumber,
				geometry: $scope.correctMyGeometry(geo)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Bikepoint data : " + value);
			
		   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint", null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, appId + "/bikepoint", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Create bikePoint: " + JSON.stringify(result));
		    	if(result != null && result != ""){
		    		$scope.getBikePointsFromDb();
					$scope.editModeBP = false;
		    	} else {
		    		$scope.editModeBP = true;
		    		$scope.showUpdatingBPErrorMessage = true;
		    	}
		    });
		}
	};
	
	// Maps management
	$scope.parkingMetersMarkers = [];
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	
	//$scope.map = {};
	
	//$scope.pmMarkerIcon = "imgs/markerIcons/parcometro.png";			// icon for parkingMeter object
	$scope.pmMarkerIcon = "imgs/parkingMeterIcons/parcometro_general.png";			// icon for parkingMeter object
	//$scope.psMarkerIcon = "imgs/markerIcons/parcheggioStruttura.png";	// icon for parkingStructure object
	$scope.psMarkerIcon = "imgs/structIcons/parking_structures_general_outline.png";	// icon for parkingStructure object
	//$scope.bpMarkerIcon = "imgs/markerIcons/puntobici.png";				// icon for bikePoint object
	$scope.bpMarkerIcon = "imgs/bikeIcons/bicicle_outline.png";				// icon for bikePoint object
	$scope.streetMarkerIcon = "imgs/street_marker.png";					// icon for street marker
	
	$scope.refreshMap = function(map) {
        //optional param if you want to refresh you can pass null undefined or false or empty arg
        map.control.refresh(map.center);
        //$scope.map.control.refresh(null);
        map.control.getGMap().setZoom(5);
        map.control.getGMap().setZoom(map.zoom);
    };
	
	$scope.mapCenter = {
		latitude: 45.88875357753771,
		longitude: 11.037440299987793
	};
	
	$scope.mapOption = {
		center : sharedDataService.getConfMapCenter(),	//"[" + $scope.mapCenter.latitude + "," + $scope.mapCenter.longitude + "]",
		zoom : sharedDataService.getConfMapZoom()
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
			case "viewZone":
				map = $scope.vZoneMap;
				break;
			case "editZone":
				map = $scope.eZoneMap;	
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
	
	// I need this to resize the map (gray map problem on load)
    $scope.resizeMap = function(type){
    	
    	$scope.map = $scope.getCorrectMap(type);
    	if($scope.map != null){ 	// the first time I show the area map it is null
    		google.maps.event.trigger($scope.map, 'resize');
    		$scope.map.setCenter($scope.getPointFromLatLng($scope.mapOption.center, 2));
    	    $scope.map.setZoom(parseInt($scope.mapOption.zoom));
    	}
        return true;
    };
    
    $scope.resizeMapTimed = function(type, center){
    	
    	$scope.map = $scope.getCorrectMap(type);
    	$timeout(function(){ 
    		google.maps.event.trigger($scope.map, 'resize');
    		$scope.map.setCenter($scope.getPointFromLatLng($scope.mapOption.center, 2));
    		//$scope.map.setCenter({lat: $scope.mapCenter.latitude,lng:$scope.mapCenter.longitude});
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
	    	case "viewZone":
	    		$scope.vZoneMap = map;
	    		break;
	    	case "editZone":
	    		$scope.eZoneMap = map;
	    		gzone.setMap(map);
	    		break;
	    	case "viewMicroZone":
	    		$scope.vMicroZoneMap = map;
	    		break;
	    	case "editMicroZone":
	    		$scope.eMicroZoneMap = map;
	    		//gMicrozone.setMap(map);
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
				//$scope.eAreaMap.shapes[$scope.allNewAreas[i].id].setMap(null);	
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
	    var myPoint = $scope.getPointFromLatLng(event.latLng, 1);
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
	    path.push(event.latLng);
	    var myPoint = $scope.getPointFromLatLng(event.latLng, 1);
	    $scope.myAreaPath.push(myPoint);
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
		var myPoint = $scope.getPointFromLatLng(event.latLng, 1);
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
	    var myPoint = $scope.getPointFromLatLng(event.latLng, 1);
	    $scope.myZonePath.push(myPoint);
	    $scope.setMyPolGeometry($scope.myZonePath);
	    gzone.setMap($scope.map);
	};
	
	$scope.getStreetAddress = function(event){
		console.log("I am in get street address function" + event.latLng);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({location:event.latLng}, function(response) {
			var result = response[0].formatted_address;
			if (result != undefined && result != null) {
				$scope.eStreet.streetReference = result.substring(0, result.indexOf(','));
			}
		});
	};
	
	$scope.getStructAddress = function(event){
		console.log("I am in get struct address function" + event.latLng);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({location:event.latLng}, function(response) {
			var result = response[0].formatted_address;
			if (result != undefined && result != null) {
				$scope.parkingStructure.streetReference = result.substring(0, result.indexOf(','));
			}
		});
	};
	
	$scope.initAreaMap = function(){
		$scope.areaMap = {
			control: {},
			center: $scope.mapCenter,
		    zoom: 14,
		    bounds: {}
		};
			
		$scope.options = {
		    scrollwheel: true
		};
	};
	
	$scope.initStreetMap = function(){
		$scope.streetMap = {
			control: {},
			center: $scope.mapCenter,
		    zoom: 14,
		    bounds: {}
		};
			
		$scope.options = {
		    scrollwheel: true
		};
	};
	
	$scope.initZoneMap = function(){
		$scope.zoneMap = {
			control: {},
			center: $scope.mapCenter,
		    zoom: 13,
		    bounds: {}
		};
			
		$scope.options = {
		    scrollwheel: true
		};
	};
	
	$scope.polygons = [];
	$scope.zone_polygons = [];
	$scope.microzone_polygons = [];
	$scope.geoStreets = [];
	
	$scope.initAreasOnMap = function(areas){
		var area = {};
		var poligons = {};
		if($scope.polygons != null && $scope.polygons.length > 0){
			$scope.hideAllAreas(areas);	//Here I hide all the old areas
			$scope.polygons = [];
		}
		
		for(var i = 0; i < areas.length; i++){
			if(areas[i].geometry != null && areas[i].geometry.length > 0 && areas[i].geometry[0].points.length > 0){
				for(var j = 0; j < areas[i].geometry.length; j++){
					poligons = areas[i].geometry;
					area = {
						id: $scope.correctObjId(areas[i].id, j),
						path: $scope.correctPoints(poligons[j].points),
						gpath: $scope.correctPointsGoogle(poligons[j].points),
						stroke: {
						    color: $scope.correctColor(areas[i].color),
						    weight: 3
						},
						data: areas[i],
						info_windows_pos: $scope.correctPointGoogle(poligons[j].points[1]),
						info_windows_cod: "a" + areas[i].id,
						editable: false,
						draggable: false,
						geodesic: false,
						visible: true,
						fill: {
						    color: $scope.correctColor(areas[i].color),
						    opacity: 0.4
						}
					};
					$scope.polygons.push(area);
				}
			}
		}
	};
	
	$scope.hideAllAreas = function(areas){
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
    };
    
    $scope.addLabelToZoneObject = function(zone){
    	var sub = (zone.submacro != null) ? zone.submacro : zone.submicro;
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
    		label: zone.name + "_" + sub
    	};
    	return corrected_zone;
    };
	
	$scope.initStreetsOnMap = function(streets){
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
				var myZones = [];
				var mySubZones = [];
				for(var j = 0; j < streets[i].zones.length; j++){
					var zone = $scope.getLocalZoneById(streets[i].zones[j], 1);
					if(zone == null){
						var subzone = $scope.getLocalMicroZoneById(streets[i].zones[j], 1);
						if(subzone != null){
							mySubZones.push($scope.addLabelToZoneObject(subzone));
						}
					} else {
						myZones.push($scope.addLabelToZoneObject(zone));
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
					zones: myZones,
					microzones: mySubZones,
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
	};
	
	$scope.hideAllStreets = function(streets){
    	var toHideStreet = $scope.vStreetMap.shapes;
    	for(var i = 0; i < streets.length; i++){
    		if(toHideStreet[streets[i].id] != null){
    			toHideStreet[streets[i].id].setMap(null);		// I can access dinamically the value of the object shapes for street
    		}
    	}
    };
	
	$scope.initZonesOnMap = function(zones, type){
		var zone = {};
		var poligons = {};
		if(($scope.zone_polygons != null && $scope.zone_polygons.length > 0) || ($scope.microzone_polygons != null && $scope.microzone_polygons.length > 0)){
			if(type == macrozoneType){
				$scope.hideAllZones(zones);			//Here I hide all the old areas
				$scope.zone_polygons = [];
			} else {
				$scope.hideAllMicroZones(zones);	//Here I hide all the old areas
				$scope.microzone_polygons = [];
			}
		}
		
		for(var i = 0; i < zones.length; i++){
			if(zones[i].geometryFromSubelement){
				var streets = zones[i].subelements;//$scope.loadStreetsFromZone(zones[i].id);
				var color = $scope.lightgray;
				if(streets != null && streets.length > 0){
					color = streets[0].area_color;
				}
				if(streets != null && streets.length > 0){
					for(var j = 0; j < streets.length; j++){
						var polyline = streets[j].geometry;
						zone = {
							id: $scope.correctObjId(zones[i].id, j),
							path: $scope.correctPoints(polyline.points),
							gpath: $scope.correctPointsGoogle(polyline.points),
							stroke: {
							    color: $scope.correctColor(color),
							    weight: 3
							},
							data: zones[i],
							info_windows_pos: $scope.correctPointGoogle(polyline.points[1]),
							info_windows_cod: "z" + zones[i].id,
							editable: true,
							draggable: true,
							geodesic: false,
							visible: true,
							subelements: streets
						};
						if(type == macrozoneType){
							$scope.zone_polygons.push(zone);
						} else {
							$scope.microzone_polygons.push(zone);
						}
					}
				}
			} else {
				if(zones[i].geometry != null && zones[i].geometry.points.length > 0){
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
						info_windows_pos: $scope.correctPointGoogle(poligons.points[1]),
						info_windows_cod: "z" + zones[i].id,
						editable: true,
						draggable: true,
						geodesic: false,
						visible: true,
						fill: {
						    color: $scope.correctColor(zones[i].color),
						    opacity: 0.4
						}
					};
					if(type == macrozoneType){
						$scope.zone_polygons.push(zone);
					} else {
						$scope.microzone_polygons.push(zone);
					}
				}
			}
		}
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
	
	
//	$scope.initMicroZonesOnMap = function(zones){
//		var zone = {};
//		var poligons = {};
//		if($scope.microzone_polygons != null && $scope.microzone_polygons.length > 0){
//			$scope.hideAllMicroZones(zones);	//Here I hide all the old areas
//			$scope.microzone_polygons = [];
//		}
//		
//		for(var i = 0; i < zones.length; i++){
//			if(zones[i].geometryFromSubelement){
//				var streets = $scope.loadStreetsFromZone(zones[i].id);
//				var color = $scope.lightgray;
//				if(streets != null && streets.length > 0){
//					color = streets[0].area_color;
//				}
//				if(streets != null && streets.length > 0){
//					for(var j = 0; j < streets.length; j++){
//						var polyline = streets[j].geometry;
//						zone = {
//							id: $scope.correctObjId(zones[i].id, j),
//							path: $scope.correctPoints(polyline.points),
//							gpath: $scope.correctPointsGoogle(polyline.points),
//							stroke: {
//							    color: $scope.correctColor(color),
//							    weight: 3
//							},
//							data: zones[i],
//							info_windows_pos: $scope.correctPointGoogle(polyline.points[1]),
//							info_windows_cod: "z" + zones[i].id,
//							editable: true,
//							draggable: true,
//							geodesic: false,
//							visible: true,
//							subelements: streets
//						};
//						$scope.microzone_polygons.push(zone);	
//					}
//				}
//			} else {
//				if(zones[i].geometry != null && zones[i].geometry.points.length > 0){
//					poligons = zones[i].geometry;
//					zone = {
//						id: zones[i].id,
//						path: $scope.correctPoints(poligons.points),
//						gpath: $scope.correctPointsGoogle(poligons.points),
//						stroke: {
//						    color: $scope.correctColor(zones[i].color),
//						    weight: 3
//						},
//						data: zones[i],
//						info_windows_pos: $scope.correctPointGoogle(poligons.points[1]),
//						info_windows_cod: "z" + zones[i].id,
//						editable: true,
//						draggable: true,
//						geodesic: false,
//						visible: true,
//						fill: {
//						    color: $scope.correctColor(zones[i].color),
//						    opacity: 0.4
//						}
//					};
//					$scope.microzone_polygons.push(zone);
//				}
//			}
//		}
//	};
	
	$scope.hideAllZones = function(zones){
		if($scope.vZoneMap != null){
	    	var toHideZone = $scope.vZoneMap.shapes;
	    	for(var i = 0; i < zones.length; i++){
	    		if(toHideZone[zones[i].id] != null){
	    			toHideZone[zones[i].id].setMap(null);
	    		}
	    	}
		}
    };
    
	$scope.hideAllMicroZones = function(zones){
		if($scope.vMicroZoneMap != null){
	    	var toHideZone = $scope.vMicroZoneMap.shapes;
	    	for(var i = 0; i < zones.length; i++){
	    		if(zones[i].subelements != null && zones[i].subelements.length > 0){
	    			if(zones[i].subelements.length == 1){
	    				if(toHideZone[zones[i].id] != null){
	    	    			toHideZone[zones[i].id].setMap(null);
	    	    		}
	    			} else {
	    				for(var j = 0; j < zones[i].subelements.length; j++){
	    					var myId = $scope.correctObjId(zones[i].id, j);
	    					if(toHideZone[myId] != null){
	    						toHideZone[myId].setMap(null);
				    		}
	    				}
	    			}
	    		}	
	    	}
		}
    };
	
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
	
	$scope.initBPointMap = function(bpMarkers){
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
	};
	
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
		if($scope.myNewArea != null){
			color = $scope.myNewArea.color;
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
	
	
	var createMarkers = function(i, marker, type) {
		//------ To be configured in external conf file!!!!!------
		var company = "";
		var appId = sharedDataService.getConfAppId();
		if(appId == 'rv'){ 
			company = "amr";
		} else {
			company = "tm";
		}
		//var baseUrl = "http://localhost:8080/parking-management/rest";
		//var baseUrl = sharedDataService.getConfUrlWs();
		var baseUrl = "rest";
		var defaultMarkerColor = "FF0000";
		//--------------------------------------------------------
		var myIcon = "";
		var title = "";
		var myAreaPm = {};
		switch(type){
			case 1 : 
				//myIcon = $scope.pmMarkerIcon;
				myAreaPm = $scope.getLocalAreaById(marker.areaId);
				title = marker.code;
				//if(appId == 'rv'){ 
				//	myIcon = $scope.getCorrectPmIconByAreaName(myAreaPm.name);
				//} else {
					myIcon = baseUrl+'/marker/'+company+'/parcometro/'+((myAreaPm != null && myAreaPm.color != null) ? myAreaPm.color : defaultMarkerColor);
				//}
				break;
			case 2 : 
				myIcon = $scope.psMarkerIcon;
				title = marker.id;
				break;
			case 3 :
				myIcon = $scope.bpMarkerIcon;
				title = marker.id;
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
	};
	
	$scope.initPMeterMap = function(pmMarkers){
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
		
	};
	
	$scope.initPStructMap = function(psMarkers){
		$scope.pStructureMap = {
			control: {},
			center: $scope.mapCenter,
		    zoom: 14,
		    bounds: {}
		};
			
		$scope.options = {
		    scrollwheel: true
		};
		
		if(psMarkers!= null){
			$scope.parkingStructureMarkers = psMarkers;
		} else {
			$scope.parkingStructureMarkers = [];
		}
		$scope.addMarkerToMap($scope.pStructureMap, 2);
		
	};
	
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
		//$scope.$apply();
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