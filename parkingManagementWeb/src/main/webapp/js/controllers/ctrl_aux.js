'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers'); //, ['angularFileUpload']

pm.controller('AuxCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$route', '$location', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeWSServiceProxy', 'invokePdfServiceProxy', 'invokeAuxWSService', 'getMyMessages', '$timeout','FileUploader',
                               function($scope, $http, $routeParams, $rootScope, $route, $location, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, invokePdfServiceProxy, invokeAuxWSService, getMyMessages, $timeout, FileUploader) { 
	this.$scope = $scope;
    $scope.params = $routeParams;
    $scope.systemUserNumber = 999;
    
    // ---------------------------------- START Code for file upload ------------------------------------
	var uploader = $scope.uploader = new FileUploader({
		url: 'js/controllers/upload.php'
		//url: 'upload/upload.php'   
    });
	
	// FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
    
    $scope.selectedFile = [];
    $scope.uploadProgress = 0;
    
    $scope.onFileSelect = function ($files) {
        $scope.uploadProgress = 0;
        $scope.selectedFile = $files;
    };
    
    // ---------------------------------- END Code for file upload ------------------------------------    
    
    
    $scope.onlyNumbers = /^\d+$/;
    $scope.decimalNumbers = /^([0-9]+)[\,]{0,1}[0-9]{0,2}$/;
    $scope.timePattern=/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
    
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
    
    $scope.getPlaceHolder = function(){
	    var local_placeholder = '';
    	if(sharedDataService.getUsedLanguage() == 'ita'){
	    	local_placeholder = "gg/MM/aaaa";
	    } else if(sharedDataService.getUsedLanguage() == 'eng'){
	    	local_placeholder = "dd/MM/yyyy";
	    }
    	return local_placeholder;
    };
              
    //---------------- End datetimepicker section------------
    
    $scope.myPmProfitDetails = {};
    $scope.myStreetDetails = {};
    $scope.myParkingDetails = {};
    $scope.myParkingProfitDetails = {};
    
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
    
    // ----------------------- Block to read conf params and show/hide elements -----------------------
    var showArea = false;
    var showStreets = false;
    var showPm = false;
    var showPs = false;
    var showBp = false;
    var showZones = false;
    var showBtnAddOccStreet = false;
    var showBtnAddOccStruct = false;
    var showBtnAddProfPm = false;
    var showBtnAddProfStruct = false;
    $scope.f_occStreet = null;
    $scope.f_occStruct = null;
    $scope.f_profParkingMeter = null;
    $scope.f_profStruct = null;
    $scope.f_allLogs = null;
    $scope.logtabs = [];
    
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
    
    $scope.isOccStreetAddShow = function(){
    	return sharedDataService.getOccStreetLogEdit();
    };
    
    $scope.isOccStructAddShow = function(){
    	return sharedDataService.getOccStructLogEdit();
    };
    
    $scope.isProfPmAddShow = function(){
    	return sharedDataService.getProfPmLogEdit();
    };
    
    $scope.isProfStructAddShow = function(){
    	return sharedDataService.getProfStructLogEdit();
    };
    
    $scope.initComponents = function(){
	    if($scope.logtabs == null || $scope.logtabs.length == 0){
	    	var logAuxTabs = [];
	    	var street_occ_tab_obj = {};
	    	var struct_occ_tab_obj = {};
	    	var pm_profit_tab_obj = {};
	    	var struct_profit_tab_obj = {};
	    	var all_logs_tab_obj = {};
		   	$scope.showedObjects = sharedDataService.getVisibleObjList();
		   	for(var i = 0; i < $scope.showedObjects.length; i++){
		   		//if($scope.showedObjects[i].id == 'Area'){
		   		//	$scope.loadAreaAttributes($scope.showedObjects[i].attributes);
		   		//}
		   		if($scope.showedObjects[i].id == 'Street'){
		   			$scope.loadStreetAttributes($scope.showedObjects[i].attributes);
		   		}
		   		if($scope.showedObjects[i].id == 'Pm'){
		   			$scope.loadPmAttributes($scope.showedObjects[i].attributes);
		   		}
		   		if($scope.showedObjects[i].id == 'Ps'){
		   			$scope.loadPsAttributes($scope.showedObjects[i].attributes);
		   		}
		   		//if($scope.showedObjects[i].id == 'Bp'){
		    	//	$scope.loadBikeAttributes($scope.showedObjects[i].attributes);
		    	//}
		   		//if($scope.showedObjects[i].id == 'Zone'){
		   		//	$scope.loadZoneAttributes($scope.showedObjects[i].attributes);
		   		//}
		   		if($scope.showedObjects[i].id == 'Flux'){
		   			var flux_obj = $scope.showedObjects[i].attributes;
		   			$scope.loadFluxAttributes(flux_obj);	
		   			for(var j = 0; j < flux_obj.length; j++){
		   				if(flux_obj[j].code == "occupancyStreet"){
		   					street_occ_tab_obj =  { title:'Rilevazioni occupazione vie', index: 1, content:"partials/aux/logs/street_logs.html", active: false, path: "/tplog/streets" };
		   				}
		   				if(flux_obj[j].code == "occupancyStruct"){
		   					struct_occ_tab_obj = { title:'Rilevazioni occupazione parcheggi', index: 2, content:"partials/aux/logs/parking_logs.html", active: false, path: "/tplog/parkings" };
		   				}
		   				if(flux_obj[j].code == "profitParkingMeter"){
		   					pm_profit_tab_obj =  { title:'Rilevazioni ricavi parcometri', index: 3, content:"partials/aux/logs/pm_profit_logs.html", active: false, path: "/tplog/parkmeters" };
		   				}
		   				if(flux_obj[j].code == "profitStruct"){
		   					struct_profit_tab_obj =  { title:'Rilevazioni ricavi parcheggi', index: 4, content:"partials/aux/logs/parking_profit_logs.html", active: false, path: "/tplog/parkstructs" };
		   				}
		   				if(flux_obj[j].code == "allLogs"){
		   					all_logs_tab_obj =  { title:'Storico Rilevazioni', index: 5, content:"partials/aux/logs/global_logs.html", active: true, path: "/tplog/all"};
		   				}
		   			}
		   		}
		   	}
		   	// Here I check if I have to show/hide the log add buttons
			if($scope.f_occStreet.editable){
				sharedDataService.setOccStreetLogEdit(true);
		   	}
		   	if($scope.f_occStruct.editable){
		   		sharedDataService.setOccStructLogEdit(true);
		   	}
		   	if($scope.f_profParkingMeter.editable){
		   		sharedDataService.setProfPmLogEdit(true);
		   	}
		   	if($scope.f_profStruct.editable){
		   		sharedDataService.setProfStructLogEdit(true);
		   	}
		   	// Here I load the tabs for logs
		   	if($scope.f_occStreet.visible){
		   		logAuxTabs.push(street_occ_tab_obj);
		   	}
		   	if($scope.f_occStruct.visible){
		   		logAuxTabs.push(struct_occ_tab_obj);
		   	}
		   	if($scope.f_profParkingMeter.visible){
		   		logAuxTabs.push(pm_profit_tab_obj);
		   	}
		   	if($scope.f_profStruct.visible){
		   		logAuxTabs.push(struct_profit_tab_obj);
		   	}
		   	if($scope.f_allLogs.visible){
		   		logAuxTabs.push(all_logs_tab_obj);
		   	}
		   	angular.copy(logAuxTabs, $scope.logtabs);
		   	sharedDataService.setFluxViewTabs($scope.logtabs);
	    }
//	    if($scope.addtabs == null || $scope.addtabs.length == 0){
//	    	var logAuxTabs = [];
//	    	var street_occ_tab_obj = {};
//	    	var struct_occ_tab_obj = {};
//	    	var pm_profit_tab_obj = {};
//	    	var struct_profit_tab_obj = {};
//		   	$scope.showedObjects = sharedDataService.getVisibleObjList();
//		   	for(var i = 0; i < $scope.showedObjects.length; i++){
//		   		if($scope.showedObjects[i].id == 'Street'){
//		   			$scope.loadStreetAttributes($scope.showedObjects[i].attributes);
//		   		}
//		   		if($scope.showedObjects[i].id == 'Pm'){
//		   			$scope.loadPmAttributes($scope.showedObjects[i].attributes);
//		   		}
//		   		if($scope.showedObjects[i].id == 'Ps'){
//		   			$scope.loadPsAttributes($scope.showedObjects[i].attributes);
//		   		}
//		   		if($scope.showedObjects[i].id == 'Flux'){
//		   			var flux_obj = $scope.showedObjects[i].attributes;
//		   			$scope.loadFluxAttributes(flux_obj);	
//		   			for(var j = 0; j < flux_obj.length; j++){
//		   				if(flux_obj[j].code == "occupancyStreet"){
//		   					street_occ_tab_obj =  { title:'Occupazione via', index: 1, content:"partials/aux/adds/street_logs.html", active:false };
//		   				}
//		   				if(flux_obj[j].code == "occupancyStruct"){
//		   					struct_occ_tab_obj = { title:'Occupazione parcheggio', index: 2, content:"partials/aux/adds/parking_logs.html", active:false };
//		   				}
//		   				if(flux_obj[j].code == "profitParkingMeter"){
//		   					pm_profit_tab_obj =  { title:'Profitto parcometro', index: 3, content:"partials/aux/adds/parkmeter_profit_logs.html", active:false };
//		   				}
//		   				if(flux_obj[j].code == "profitStruct"){
//		   					struct_profit_tab_obj = { title:'Profitto parcheggio', index: 4, content:"partials/aux/adds/parking_profit_logs.html", active:false };
//		   				}
//		   			}
//		   		}
//		   	}
//		   	// Here I load the tabs for logs
//		   	if($scope.f_occStreet.editable){
//		   		logAuxTabs.push(street_occ_tab_obj);
//		   	}
//		   	if($scope.f_occStruct.editable){
//		   		logAuxTabs.push(struct_occ_tab_obj);
//		   	}
//		   	if($scope.f_profParkingMeter.editable){
//		   		logAuxTabs.push(pm_profit_tab_obj);
//		   	}
//		   	if($scope.f_profStruct.editable){
//		   		logAuxTabs.push(struct_profit_tab_obj);
//		   	}
//		   	angular.copy(logAuxTabs, $scope.addtabs);
//		   	sharedDataService.setFluxAddTabs($scope.addtabs);
//	    }	    
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
    
    //Flux Component settings
    $scope.loadFluxAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'occupancyStreet'){
    			$scope.f_occStreet = attributes[i];
    		}
    		if(attributes[i].code == 'occupancyStruct'){
    			$scope.f_occStruct = attributes[i];
    		}
    		if(attributes[i].code == 'profitParkingMeter'){
    			$scope.f_profParkingMeter = attributes[i];
    		}
    		if(attributes[i].code == 'profitStruct'){
    			$scope.f_profStruct = attributes[i];
    		}
    		if(attributes[i].code == 'allLogs'){
    			$scope.f_allLogs = attributes[i];
    		}
    	}
    };    
    // ---------------------- End Block to read conf params and show/hide elements ---------------------       
    
    $scope.showDetails = false;
    $scope.showFiltered = false;
    $scope.maxLogs = 15;
    
    // reset tab view in log lists
    var resetView = function() {
    	$scope.showDetails = false;
    	$scope.showFiltered = false;
    };
    
    // switch tab, reset view to list, load data with the corresponding data page
    $scope.setIndex = function(idx){
    	resetView();
       	$scope.tabIndex = idx;
    	loadLogs();
    };
    
    $scope.authHeaders = {
        'Accept': 'application/json;charset=UTF-8'
    };
    
    // load remote data
	var loadData = function(path, skip, count){
	    $scope.progress = 25;
		$dialogs.wait("Aggiornamento dati in corso...", $scope.progress);

		$scope.isLoadingLogs = true;
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + path, {skip: skip, count: count}, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			var partialLogs = result;//$scope.globalLogs.concat(result);
			var corrLog = null;
			var nulogs = [];
			for(var i = 0; i < partialLogs.length; i++){
				corrLog = {
					id:	partialLogs[i].id,
					objId: partialLogs[i].objId,
					type: partialLogs[i].type,
					time: partialLogs[i].time,
					logPeriod: partialLogs[i].logPeriod,
					author: partialLogs[i].author,
					agency: partialLogs[i].agency,
			        deleted: partialLogs[i].deleted,
			        year: partialLogs[i].year,
			        month: partialLogs[i].month,
			        week_day: partialLogs[i].week_day,
			        timeSlot: partialLogs[i].tileSlot,
			        holyday: partialLogs[i].holyday,
			        isSystemLog: partialLogs[i].systemLog,
			        value: (partialLogs[i].valueString != null && partialLogs[i].valueString != "") ? JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString)) : {} //JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString))
				};
				//console.log("corrLog: " + JSON.stringify(corrLog));
				nulogs.push(corrLog);
			}
			$scope.logtabs[$scope.tabIndex].data = nulogs;
			$scope.progress += 25;
	    	$rootScope.$broadcast('dialogs.wait.progress',{msg: "Aggiornamento dati in corso...",'progress': $scope.progress});
	    	
			invokeAuxWSService.getProxy(method, appId + path+"/count", null, $scope.authHeaders, null)
			.then(function(result) {
				$scope.logtabs[$scope.tabIndex].count = result;
			    $scope.isLoadingLogs = false;
				$scope.progress = 100;
		    	$rootScope.$broadcast('dialogs.wait.complete');
			});
		});
	};
    // load data for the current tab for the current page
    var loadLogs = function() {
    	if($scope.logtabs == null || $scope.logtabs.length == 0){
    		$scope.logtabs = sharedDataService.getFluxViewTabs();
    	}
    	if (!$scope.tabIndex) $scope.tabIndex = 0;
    	var logtab = $scope.logtabs[$scope.tabIndex];
    	var page = logtab.page;
    	if (!page) page = 0;
    	var skip = page * $scope.maxLogs;
    	loadData(logtab.path, skip, $scope.maxLogs);
    };

	// Method cleanStringFroJSON: used to clean the saved valueString to be accepted in JSON.parse function
	$scope.cleanStringForJSON = function(value){
		var corrected = "";
		if(value != null){
			corrected = value.replace(/\n\t|NumberLong|\(|\)/g, "");
			//console.log("corrected " + corrected);
		};
		return corrected;
	};
	
	$scope.getCurrentPage = function() {
		var p = $scope.logtabs[$scope.tabIndex].page;
		if (!p) p = 0;
		return p;
	};

	$scope.stepPage = function(shift) {
		var p = $scope.getCurrentPage();
		var np = p + shift;
		if (np < 0) return;
		$scope.logtabs[$scope.tabIndex].page = np;
		loadLogs();
	};

	$scope.gotoPage = function(page) {
		$scope.logtabs[$scope.tabIndex].page = page;
		loadLogs();
	};	
	
	$scope.totalPages = function() {
		return Math.ceil($scope.logtabs[$scope.tabIndex].count / $scope.maxLogs);
	};
	
	$scope.getLogData = function() {
		//$scope.globalLogs = $scope.logtabs[$scope.tabIndex].data;
		return $scope.logtabs[$scope.tabIndex].data;
	};
	
	// Used to load all logs from db (only for CSV creation)
	$scope.getAllLogsFromDbTP = function(){
		$scope.globalLogs = [];
		$scope.isAllLogLoaded = false;
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/tplog/all", {skip: 0, count: 250}, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			var partialLogs = result;//$scope.globalLogs.concat(result);
			var corrLog = null;
			for(var i = 0; i < partialLogs.length; i++){
				corrLog = {
					id:	partialLogs[i].id,
					objId: partialLogs[i].objId,
					type: partialLogs[i].type,
					time: partialLogs[i].time,
					logPeriod: partialLogs[i].logPeriod,
					author: partialLogs[i].author,
					agency: partialLogs[i].agency,
			        deleted: partialLogs[i].deleted,
			        year: partialLogs[i].year,
			        month: partialLogs[i].month,
			        week_day: partialLogs[i].week_day,
			        timeSlot: partialLogs[i].tileSlot,
			        holyday: partialLogs[i].holyday,
			        isSystemLog: partialLogs[i].systemLog,
			        value: (partialLogs[i].valueString != null && partialLogs[i].valueString != "") ? JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString)) : {} //JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString))
				};
				//console.log("corrLog: " + JSON.stringify(corrLog));
				$scope.globalLogs.push(corrLog);
			}
			//$scope.getAllProfitLogsFromDbTP();
			$scope.logCounts =  partialLogs.length;
		    $scope.logCountsPage = Math.ceil($scope.logCounts / $scope.maxLogs);
		    $scope.isAllLogLoaded = true;
		});
	};
	
	
	$scope.viewDetails = function(type, log){
		$scope.showDetails = true;
//		if(type == 1){
//			$scope.showFiltered = false;
//		}
		$scope.logDetails = log;
		$scope.json_log_value = JSON.stringify(log, undefined, 4);
	};
	
	$scope.closeDetails = function(type){
		$scope.showDetails = false;
		if(type == 1){
			$scope.showFiltered = true;
		}
		$scope.logDetails = {};
	};
	
//	$scope.viewFiltered = function(log){
//		$scope.filterForLog = log.objId;
//		$scope.showFiltered = true;
//	};
//	
//	$scope.closeFiltered = function(){
//		$scope.filterForLog = null;
//		$scope.showFiltered = false;
//	};
//	
//	$scope.numberOfPages = function(list){
//       	if(list != null){
//       		return Math.ceil(list.length/$scope.maxLogs);
//       	} else {
//       		return 0;
//     	}
//	};  
	
	$scope.correctEuroCent = function(eurocent){
		var intval = parseInt(eurocent);
		var totalEur = (intval / 100);
		return totalEur.toFixed(2) + " ";
	};
	
    $scope.addtabs = [ 
        { title:'Occupazione via', index: 1, content:"partials/aux/adds/street_logs.html", active:false },
        { title:'Occupazione parcheggio', index: 2, content:"partials/aux/adds/parking_logs.html", active:false },
        { title:'Profitto parcometro', index: 3, content:"partials/aux/adds/parkmeter_profit_logs.html", active:false },
        { title:'Profitto parcheggio', index: 4, content:"partials/aux/adds/parking_profit_logs.html", active:false }
    ];
                                
    $scope.setAddIndex = function($index){
    	$scope.tabIndex = $index;
    };
                  

	// --------------------------------------------- Block for csv ---------------------------------------------
	$scope.globalLogCvsFile = "";
	
	$scope.getAllLogCsv = function(){
		var method = 'POST';
		//var appId = sharedDataService.getConfAppId();
		var value = JSON.stringify($scope.globalLogs);
		
	    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
	   	var myDataPromise = invokeAuxWSService.getProxy(method, "globallogs/csv", null, $scope.authHeaders, value);
	    myDataPromise.then(function(result){
	    	console.log("Created csv file: " + JSON.stringify(result));
	    	$scope.globalLogCvsFile = result;
	    	window.location.href = $scope.globalLogCvsFile;
	    });	
	};
	
	// ------------------------------------------- End of block for csv ----------------------------------------
    
	$scope.allStreet = [];
	$scope.myStreet = {};
	$scope.myStreetDetails = {};
	
	// Method initStreetLogCreation: used to init the creation street page log
	$scope.initStreetLogCreation = function(){
		$scope.showUpdatingSErrorMessage = false;
		$scope.showUpdatingSSuccessMessage = false;
		$scope.isInit = true;
		$scope.getStreetsFromDb();
	};
	
	$scope.initParkLogCreation = function(){
		$scope.showUpdatingPErrorMessage = false;
		$scope.showUpdatingPSuccessMessage = false;
		$scope.isInit = true;
		$scope.getParkingsFromDb();
	};
	
	$scope.initParkProfitLogCreation = function(){
		$scope.showUpdatingPErrorMessage = false;
		$scope.showUpdatingPSuccessMessage = false;
		$scope.isInit = true;
		$scope.getParkingsProfitFromDb();
	};
	
	$scope.initPmProfitLogCreation = function(){
		$scope.showUpdatingPMErrorMessage = false;
		$scope.showUpdatingPMSuccessMessage = false;
		$scope.isInit = true;
		$scope.getPmProfitFromDb();
	};
	
	// Method getStreetsFromDb: used to init the input select in street log creation
	$scope.getStreetsFromDb = function(){
		$scope.allStreet = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/streets", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, $scope.allStreet);
	    	$scope.streetLoadedAndSelected = false;
	    });
	};
	
	// Method getParksFromDb: used to init the input select in park log creation
	$scope.getParkingsFromDb = function(){
		$scope.allParking = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkings", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, $scope.allParking);
	    	$scope.parkLoadedAndSelected = false;
	    	//$scope.parkProfitLoadedAndSelected = false;
	    });
	};
	
	// Method getParkingsProfitFromDb: used to init the input select in park profit log creation
	$scope.getParkingsProfitFromDb = function(){
		$scope.allParkingProfit = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkings", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, $scope.allParkingProfit);
	    	for(var i = 0; i < $scope.allParkingProfit.length; i ++){
	    		$scope.allParkingProfit[i].id = $scope.correctProfitLogId($scope.allParkingProfit[i].id);
	    	}
	    	//$scope.parkLoadedAndSelected = false;
	    	$scope.parkProfitLoadedAndSelected = false;
	    });
	};
	
	// Method getPmProfitFromDb: used to init the input select in pm profit log creation
	$scope.getPmProfitFromDb = function(){
		$scope.allPmProfit = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkingmeters", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, $scope.allPmProfit);
	    	//for(var i = 0; i < $scope.allPmProfit.length; i ++){
	    	//	$scope.allParkingProfit[i].id = $scope.correctProfitLogId($scope.allParkingProfit[i].id);
	    	//}
	    	$scope.pmProfitLoadedAndSelected = false;
	    });
	};
	
	$scope.getDetailData = function(street){
		$scope.myStreetDetails = street;
		$scope.initTimeValues();
		$scope.streetLoadedAndSelected = true;
		// to hide the messages (error or success)
		$scope.showUpdatingSErrorMessage = false;
		$scope.showUpdatingSSuccessMessage = false;
	};
	
	$scope.getParkDetailData = function(park){
		$scope.myParkingDetails = park;
		$scope.initParkTimeValues(1);
		$scope.parkLoadedAndSelected = true;
		// to hide the messages (error or success)
		$scope.showUpdatingPErrorMessage = false;
		$scope.showUpdatingPSuccessMessage = false;
	};
	
	$scope.getParkProfitDetailData = function(park){
		$scope.myParkingProfitDetails = park;
		$scope.initParkTimeValues(2);
		$scope.parkProfitLoadedAndSelected = true;
		// to hide the messages (error or success)
		$scope.showUpdatingPErrorMessage = false;
		$scope.showUpdatingPSuccessMessage = false;
	};
	
	$scope.getPmProfitDetailData = function(parkmeter){
		$scope.myPmProfitDetails = parkmeter;
		$scope.initParkTimeValues(3);
		$scope.pmProfitLoadedAndSelected = true;
		// to hide the messages (error or success)
		$scope.showUpdatingPMErrorMessage = false;
		$scope.showUpdatingPMSuccessMessage = false;
	};
	
	$scope.initTimeValues = function(){
		var now = new Date();
		$scope.myStreetDetails.loghour = $scope.addZero(now.getDate()) + "/" + $scope.addZero(now.getMonth() + 1) + "/" + now.getFullYear();
		//$scope.myStreetDetails.logtime = $scope.addZero(now.getHours()) + ":" + $scope.addZero(now.getMinutes()) + ":" + $scope.addZero(now.getSeconds());
		$scope.myStreetDetails.logtime = now;
		$scope.myStreetDetails.startTimePeriod = new Date(0);
		$scope.myStreetDetails.endTimePeriod = new Date(0);
	};
	
	$scope.initParkTimeValues = function(type){
		var now = new Date();
		if(type == 1){
			$scope.myParkingDetails.loghour = $scope.addZero(now.getDate()) + "/" + $scope.addZero(now.getMonth() + 1) + "/" + now.getFullYear();
			//$scope.myParkingDetails.logtime = $scope.addZero(now.getHours()) + ":" + $scope.addZero(now.getMinutes()) + ":" + $scope.addZero(now.getSeconds());
			$scope.myParkingDetails.logtime = now;
			$scope.myParkingDetails.startTimePeriod = new Date(0);
			$scope.myParkingDetails.endTimePeriod = new Date(0);
		} else if(type == 2){
			$scope.myParkingProfitDetails.loghour = $scope.addZero(now.getDate()) + "/" + $scope.addZero(now.getMonth() + 1) + "/" + now.getFullYear();
			//$scope.myParkingDetails.logtime = $scope.addZero(now.getHours()) + ":" + $scope.addZero(now.getMinutes()) + ":" + $scope.addZero(now.getSeconds());
			$scope.myParkingProfitDetails.logtime = now;
			$scope.myParkingProfitDetails.startTimePeriod = new Date(0);
			$scope.myParkingProfitDetails.endTimePeriod = new Date(0);
		} else if(type == 3){
			$scope.myPmProfitDetails.loghour = $scope.addZero(now.getDate()) + "/" + $scope.addZero(now.getMonth() + 1) + "/" + now.getFullYear();
			$scope.myPmProfitDetails.logtime = now;
			$scope.myPmProfitDetails.startTimePeriod = new Date(0);
			$scope.myPmProfitDetails.endTimePeriod = new Date(0);
		}
	};
	
	// Method insertStreetLog: used to insert in the db (table dataLogBean) a new street log
	$scope.insertStreetLog = function(form, myStreetDetails){
		$scope.showUpdatingSErrorMessage = false;
		$scope.showUpdatingSSuccessMessage = false;
		myStreetDetails.user = $scope.systemUserNumber;
		
		if($scope.checkCorrectSlots(myStreetDetails)){
			
			var periodFrom = (myStreetDetails.logPeriodFrom != null) ? new Date(myStreetDetails.logPeriodFrom) : null;
			var periodTo = (myStreetDetails.logPeriodTo != null) ? new Date(myStreetDetails.logPeriodTo) : null;
			if(periodFrom != null)periodFrom.setHours(myStreetDetails.startTimePeriod.getHours(), myStreetDetails.startTimePeriod.getMinutes(), 0, 0);
			if(periodTo != null)periodTo.setHours(myStreetDetails.endTimePeriod.getHours(), myStreetDetails.endTimePeriod.getMinutes(), 0, 0);
			
			if($scope.checkCorrectPeriodDates(periodFrom, periodTo)){
				if(form.$invalid){
					$scope.isInit = false;
				} else {
					var method = 'POST';
					var appId = sharedDataService.getConfAppId();
					var logId = myStreetDetails.id;
					var user = myStreetDetails.user;
					var streetLogDet = {
						id: myStreetDetails.id, 
						agency: myStreetDetails.agency, 
						position: myStreetDetails.position, 
						name: myStreetDetails.name, 
						description: myStreetDetails.description,
						updateTime: $scope.getLogMillis(myStreetDetails.loghour, myStreetDetails.logtime), 
						user: parseInt(myStreetDetails.user), 
						slotsFree: parseInt(myStreetDetails.slotsFree), 
						slotsOccupiedOnFree: parseInt(myStreetDetails.slotsOccupiedOnFree), 
						slotsFreeSigned: parseInt(myStreetDetails.slotsFreeSigned), 
						slotsOccupiedOnFreeSigned: parseInt(myStreetDetails.slotsOccupiedOnFreeSigned), 
						slotsPaying: parseInt(myStreetDetails.slotsPaying), 
						slotsOccupiedOnPaying: parseInt(myStreetDetails.slotsOccupiedOnPaying), 
						slotsTimed: parseInt(myStreetDetails.slotsTimed), 
						slotsOccupiedOnTimed: parseInt(myStreetDetails.slotsOccupiedOnTimed), 
						slotsHandicapped: parseInt(myStreetDetails.slotsHandicapped), 
						slotsOccupiedOnHandicapped: parseInt(myStreetDetails.slotsOccupiedOnHandicapped),
						slotsReserved: parseInt(myStreetDetails.slotsReserved), 
						slotsOccupiedOnReserved: parseInt(myStreetDetails.slotsOccupiedOnReserved),
						slotsUnavailable: parseInt(myStreetDetails.slotsUnavailable), 
						polyline: myStreetDetails.polyline, 
						areaId: myStreetDetails.areaId,
						version: myStreetDetails.version,
						lastChange:myStreetDetails.lastChange
					};
					
					var params = {
						isSysLog: true,
						period: (periodFrom != null && periodTo != null) ? [periodFrom.getTime(), periodTo.getTime()] : null
					};
					var value = JSON.stringify(streetLogDet);
					console.log("streetLogDet: " + value);
					
				    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
				   	var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/streets/" + logId + "/" + user, params, $scope.authHeaders, value);
				    myDataPromise.then(function(result){
				    	console.log("Insert street log: " + JSON.stringify(result));
				    	if(result == "OK"){
				    		$scope.showUpdatingSErrorMessage = false;
				    		$scope.showUpdatingSSuccessMessage = true;
				    	} else {
				    		$scope.showUpdatingSErrorMessage = true;
				    		$scope.showUpdatingSSuccessMessage = false;
				    	}
				    });	
				}
			}
		}
	};
	
	// Method insertParkingLog: used to insert in the db (table dataLogBean) a new parking log
	$scope.insertParkingLog = function(form, myParkingDetails){
		$scope.showUpdatingPErrorMessage = false;
		$scope.showUpdatingPSuccessMessage = false;
		myParkingDetails.user = $scope.systemUserNumber;
		if($scope.checkCorrectParkSlots(myParkingDetails)){
			
			var periodFrom = (myParkingDetails.logPeriodFrom != null) ? new Date(myParkingDetails.logPeriodFrom) : null;
			var periodTo = (myParkingDetails.logPeriodTo != null) ? new Date(myParkingDetails.logPeriodTo) : null;
			if(periodFrom != null)periodFrom.setHours(myParkingDetails.startTimePeriod.getHours(), myParkingDetails.startTimePeriod.getMinutes(), 0, 0);
			if(periodTo != null)periodTo.setHours(myParkingDetails.endTimePeriod.getHours(), myParkingDetails.endTimePeriod.getMinutes(), 0, 0);
			
			if($scope.checkCorrectPeriodDates(periodFrom, periodTo)){
				if(form.$invalid){
					$scope.isInit = false;
				} else {
					var method = 'POST';
					var appId = sharedDataService.getConfAppId();
					var logId = myParkingDetails.id;
					var user = myParkingDetails.user;
					var parkingLogDet = {
						id: myParkingDetails.id, 
						agency: myParkingDetails.agency, 
						position: myParkingDetails.position, 
						name: myParkingDetails.name, 
						description: myParkingDetails.description,
						updateTime: $scope.getLogMillis(myParkingDetails.loghour, myParkingDetails.logtime), 
						user: parseInt(myParkingDetails.user), 
						slotsTotal: parseInt(myParkingDetails.slotsTotal), 
						slotsOccupiedOnTotal: parseInt(myParkingDetails.slotsOccupiedOnTotal),
						slotsUnavailable: parseInt(myParkingDetails.slotsUnavailable), 
						lastChange:myParkingDetails.lastChange
					};
					
					var params = {
						isSysLog: true,
						period: (periodFrom != null && periodTo != null) ? [periodFrom.getTime(), periodTo.getTime()] : null
					};
					var value = JSON.stringify(parkingLogDet);
					console.log("parkingLogDet: " + value);
					
				   	var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkings/" + logId + "/" + user, params, $scope.authHeaders, value);
				    myDataPromise.then(function(result){
				    	console.log("Insert parking log: " + JSON.stringify(result));
				    	if(result == "OK"){
				    		$scope.showUpdatingPErrorMessage = false;
				    		$scope.showUpdatingPSuccessMessage = true;
				    	} else {
				    		$scope.showUpdatingPErrorMessage = true;
				    		$scope.showUpdatingPSuccessMessage = false;
				    	}
				    });	
				}
			}
		}
	};
	
	// Method insertParkingLog: used to insert in the db (table dataLogBean) a new parking log
	$scope.insertParkingProfitLog = function(form, myParkingProfitDetails){
		$scope.showUpdatingPErrorMessage = false;
		$scope.showUpdatingPSuccessMessage = false;
		myParkingProfitDetails.user = $scope.systemUserNumber;
		if($scope.checkCorrectParkSlots(myParkingProfitDetails)){
			
			var periodFrom = (myParkingProfitDetails.logPeriodFrom != null) ? new Date(myParkingProfitDetails.logPeriodFrom) : null;
			var periodTo = (myParkingProfitDetails.logPeriodTo != null) ? new Date(myParkingProfitDetails.logPeriodTo) : null;
			if(periodFrom != null)periodFrom.setHours(myParkingProfitDetails.startTimePeriod.getHours(), myParkingProfitDetails.startTimePeriod.getMinutes(), 0, 0);
			if(periodTo != null)periodTo.setHours(myParkingProfitDetails.endTimePeriod.getHours(), myParkingProfitDetails.endTimePeriod.getMinutes(), 0, 0);
			
			if($scope.checkCorrectPeriodDates(periodFrom, periodTo)){
				if(form.$invalid){
					$scope.isInit = false;
				} else {
					var method = 'POST';
					var appId = sharedDataService.getConfAppId();
					var logId = myParkingProfitDetails.id;
					var user = myParkingProfitDetails.user;
					var parkingLogDet = {
						id: myParkingProfitDetails.id, 
						agency: myParkingProfitDetails.agency, 
						position: myParkingProfitDetails.position, 
						name: myParkingProfitDetails.name, 
						description: myParkingProfitDetails.description,
						updateTime: $scope.getLogMillis(myParkingProfitDetails.loghour, myParkingProfitDetails.logtime), 
						user: parseInt(myParkingProfitDetails.user), 
						//slotsTotal: parseInt(myParkingProfitDetails.slotsTotal), 
						//slotsOccupiedOnTotal: parseInt(myParkingDetails.slotsOccupiedOnTotal),
						//slotsUnavailable: parseInt(myParkingDetails.slotsUnavailable), 
						lastChange:myParkingProfitDetails.lastChange,
						profit: parseInt(myParkingProfitDetails.profit),
						tickets: parseInt(myParkingProfitDetails.tickets)
					};
					
					var params = {
						isSysLog: true,
						period: (periodFrom != null && periodTo != null) ? [periodFrom.getTime(), periodTo.getTime()] : null
					};
					var value = JSON.stringify(parkingLogDet);
					console.log("parkingLogDet: " + value);
					
				   	var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkstructprofit/" + logId + "/" + user, params, $scope.authHeaders, value);
				    myDataPromise.then(function(result){
				    	console.log("Insert parking log: " + JSON.stringify(result));
				    	if(result == "OK"){
				    		$scope.showUpdatingPErrorMessage = false;
				    		$scope.showUpdatingPSuccessMessage = true;
				    	} else {
				    		$scope.showUpdatingPErrorMessage = true;
				    		$scope.showUpdatingPSuccessMessage = false;
				    	}
				    });	
				}
			}
		}
	};
	
	// Method insertPmProfitLog: used to insert in the db (table dataLogBean) a new parkingmeter log
	$scope.insertPmProfitLog = function(form, myPmProfitDetails){
		$scope.showUpdatingPMErrorMessage = false;
		$scope.showUpdatingPMSuccessMessage = false;
		//if($scope.checkCorrectParkSlots(myParkingProfitDetails)){
		myPmProfitDetails.user = $scope.systemUserNumber;
		var periodFrom = (myPmProfitDetails.logPeriodFrom != null) ? new Date(myPmProfitDetails.logPeriodFrom) : null;
		var periodTo = (myPmProfitDetails.logPeriodTo != null) ? new Date(myPmProfitDetails.logPeriodTo) : null;
		if(periodFrom != null)periodFrom.setHours(myPmProfitDetails.startTimePeriod.getHours(), myPmProfitDetails.startTimePeriod.getMinutes(), 0, 0);
		if(periodTo != null)periodTo.setHours(myPmProfitDetails.endTimePeriod.getHours(), myPmProfitDetails.endTimePeriod.getMinutes(), 0, 0);
			
		if($scope.checkCorrectPeriodDates(periodFrom, periodTo)){
			if(form.$invalid){
				$scope.isInit = false;
			} else {
				var method = 'POST';
				var appId = sharedDataService.getConfAppId();
				var logId = myPmProfitDetails.id;
				var user = myPmProfitDetails.user;
				var parkingMeterLogDet = {
					id: myPmProfitDetails.id, 
					agency: myPmProfitDetails.agency, 
					position: myPmProfitDetails.position, 
					code: myPmProfitDetails.code,
					note: myPmProfitDetails.note,
					status: myPmProfitDetails.status,
					updateTime: $scope.getLogMillis(myPmProfitDetails.loghour, myPmProfitDetails.logtime), 
					user: parseInt(myPmProfitDetails.user), 
					areaId: myPmProfitDetails.areaId,
					lastChange:myPmProfitDetails.lastChange,
					profit: parseInt(myPmProfitDetails.profit),
					tickets: parseInt(myPmProfitDetails.tickets)
				};
				var params = {
					isSysLog: true,
					period: (periodFrom != null && periodTo != null) ? [periodFrom.getTime(), periodTo.getTime()] : null
				};
				var value = JSON.stringify(parkingMeterLogDet);
				console.log("parkingMeterLogDet: " + value);
				
			   	var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkingmeters/" + logId + "/" + user, params, $scope.authHeaders, value);
			    myDataPromise.then(function(result){
			    	console.log("Insert parking log: " + JSON.stringify(result));
			    	if(result == "OK"){
			    		$scope.showUpdatingPMErrorMessage = false;
			    		$scope.showUpdatingPMSuccessMessage = true;
			    	} else {
			    		$scope.showUpdatingPMErrorMessage = true;
			    		$scope.showUpdatingPMSuccessMessage = false;
			    	}
			    });	
			}
		}
	};	
	
	// Method composeLogId: method used to compose the correct log id with the object type, app id and the log id
	$scope.composeLogId = function(type, appId, logId){
		if(type == 1){
			return "street@" + appId + "@" + logId;
		} else if(type == 2){
			return "parking@" + appId + "@" + logId;
		} else if(type == 3){
			return "parkstruct@" + appId + "@" + logId;
		} else {
			return "parkingmeter@" + appId + "@" + logId;
		}
	};
	
	$scope.correctProfitLogId = function(logId){
		var res = logId.split("@");
		return "parkstruct@" + res[1] + "@" + res[2];
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
    
    // Method checkCorrectSlots: used to check if the street occupancy values are correct
    $scope.checkCorrectSlots = function(street_details){
    	$scope.showMaxErrorFree = false;
    	$scope.showMaxErrorFreeSigned = false;
    	$scope.showMaxErrorPaing = false;
    	$scope.showMaxErrorTimed = false;
    	$scope.showMaxErrorHandicapped = false;
    	$scope.showMaxErrorReserved = false;
    	$scope.showMaxErrorUnusuable = false;
    	var available_free = street_details.slotsFree;
    	var available_free_signed = street_details.slotsFreeSigned;
    	var available_paying = street_details.slotsPaying;
    	var available_timed = street_details.slotsTimed;
    	var available_handicapped = street_details.slotsHandicapped;
    	var available_reserved = street_details.slotsReserved;
    	var available_all = available_free + available_free_signed + available_paying + available_timed + available_handicapped + available_reserved;
    	var occupied_all = 0;
    	if(available_free!= null && available_free >= 0){
    		occupied_all += street_details.slotsOccupiedOnFree;
    		if(available_free < street_details.slotsOccupiedOnFree){
    			$scope.showMaxErrorFree = true;
    		}
    	}
    	if(available_free_signed!= null && available_free_signed >= 0){
    		occupied_all += street_details.slotsOccupiedOnFreeSigned;
    		if(available_free_signed < street_details.slotsOccupiedOnFreeSigned){
    			$scope.showMaxErrorFreeSigned = true;
    		}
    	}
    	if(available_paying!= null && available_paying >= 0){
    		occupied_all += street_details.slotsOccupiedOnPaying;
    		if(available_paying < street_details.slotsOccupiedOnPaying){
    			$scope.showMaxErrorPaing = true;
    		}
    	}
    	if(available_timed!= null && available_timed >= 0){
    		occupied_all += street_details.slotsOccupiedOnTimed;
    		if(available_timed < street_details.slotsOccupiedOnTimed){
    			$scope.showMaxErrorTimed = true;
    		}
    	}
    	if(available_handicapped!= null && available_handicapped >= 0){
    		occupied_all += street_details.slotsOccupiedOnHandicapped;
    		if(available_handicapped < street_details.slotsOccupiedOnHandicapped){
    			$scope.showMaxErrorHandicapped = true;
    		}
    	}
    	if(available_reserved!= null && available_reserved >= 0){
    		occupied_all += street_details.slotsOccupiedOnReserved;
    		if(available_reserved < street_details.slotsOccupiedOnReserved){
    			$scope.showMaxErrorReserved = true;
    		}
    	}
    	var free_all = available_all - occupied_all;
    	if(free_all > 0){
    		if(free_all < street_details.slotsUnavailable){
    			$scope.showMaxErrorUnusuable = true;
    		}
    	}
    	if($scope.showMaxErrorFree || $scope.showMaxErrorFreeSigned || $scope.showMaxErrorPaing || $scope.showMaxErrorTimed  || $scope.showMaxErrorHandicapped || $scope.showMaxErrorReserved || $scope.showMaxErrorUnusuable){
    		return false;
    	} else {
    		return true;
    	}
    };
    
    // Method checkCorrectPeriodDates: used to control the date correctness
    $scope.checkCorrectPeriodDates = function(data_from, data_to){
    	$scope.showErrorFromMajorTo = false;
    	$scope.showErrorEmptyVal = false;
    	if(data_from != null && data_to != null){
    		if(data_from.getTime() > data_to.getTime()){
    			$scope.showErrorFromMajorTo = true;
    		}
    	} else {
    		if((data_from != null && data_to == null) || (data_to != null && data_from == null)){
    			$scope.showErrorEmptyVal = true;
    		}
    	}
    	if($scope.showErrorFromMajorTo || $scope.showErrorEmptyVal){
    		return false;
    	} else {
    		return true;
    	}
    };
    
    // Method checkCorrectParkSlots: used to check if the parking occupancy value is correct
    $scope.checkCorrectParkSlots = function(park_details){
    	$scope.showMaxError = false;
    	var available = park_details.slotsTotal;
    	if(available!= null && available >= 0){
    		if(available < park_details.slotsOccupiedOnTotal){
    			$scope.showMaxError = true;
    		}
    	}
    	if($scope.showMaxError){
    		return false;
    	} else {
    		return true;
    	}
    };
    
    // Method getLogMillis: used to cast a date value in a long milliseconds
    $scope.getLogMillis = function(date, time){
    	var millis = 0;
    	var hours = 0;
   		var minutes = 0;
   		var seconds = 0;
    	if(time instanceof Date){
    		hours = time.getHours();
       		minutes = time.getMinutes();
       		seconds = time.getSeconds();
    	} else {
    		var res = time.split(":");
       		hours = res[0];
       		minutes = res[1];
       		seconds = res[2];
    	}
    	if(date instanceof Date){
    		// if date is a Date
       		date.setHours(hours);
       		date.setMinutes(minutes);
       		date.setSeconds(seconds);
       		millis = date.getTime();
    	} else {
    		var d = date.split("/");
    		var dd = d[0];
    		var mm = (parseInt(d[1]) - 1) + "";
    		var yy = d[2];
    		var nDate = new Date();
    		nDate.setFullYear(yy, mm, dd);
    		nDate.setHours(hours);
       		nDate.setMinutes(minutes);
       		nDate.setSeconds(seconds);
       		millis = nDate.getTime();
    	}
    	return millis;
    };
    
    $scope.setUploadParams = function(type, period){
    	if(type == "1"){
    		// Case of street occupation log
    		$scope.uploadFileType = "Log occupazione vie";
    		switch (period){
    			case "1":
    				// No period
    				$scope.uploadFilePeriod = "Valori attuali";
    				//uploadPanelClass = "panel panel-success";
    				break;
    			case "2":
    				// Months
    				$scope.uploadFilePeriod = "Valori mensili";
    				//uploadPanelClass = "panel panel-info";
    				break;
    			case "3":
    				// Years
    				$scope.uploadFilePeriod = "Valori annuali";
    				//uploadPanelClass = "panel panel-warning";
    				break;	
    			case "4":
    				// Dows
    				$scope.uploadFilePeriod = "Valori giorno settimana";
    				//uploadPanelClass = "panel panel-danger";
    				break;
    			case "5":
    				// Hours
    				$scope.uploadFilePeriod = "Valori orari";
    				//uploadPanelClass = "panel panel-danger";
    				break;	
    		}
    	} else if(type == "2"){
    		// Case of ps occupation log
    		$scope.uploadFileType = "Log occupazione strutture";
    		switch (period){
    			case "0":
    				// No period
    				$scope.uploadFilePeriod = "Valori attuali";
    				//uploadPanelClass = "panel panel-success";
    				break;
    			case "1":
    				// Months
    				$scope.uploadFilePeriod = "Valori mensili";
    				//uploadPanelClass = "panel panel-info";
    				break;
    			case "2":
    				// Years
    				$scope.uploadFilePeriod = "Valori annuali";
    				//uploadPanelClass = "panel panel-warning";
    				break;	
    			case "3":
    				// Dows
    				$scope.uploadFilePeriod = "Valori giorno settimana";
    				//uploadPanelClass = "panel panel-danger";
    				break;
    			case "4":
    				// Hours
    				$scope.uploadFilePeriod = "Valori orari";
    				//uploadPanelClass = "panel panel-danger";
    				break;	
    		}
    	} else if(type == "3"){
    		// Case of ps profit log
    		$scope.uploadFileType = "Log incassi parcometri";
    		switch (period){
    			case "0":
    				// No period
    				$scope.uploadFilePeriod = "Valori attuali";
    				//uploadPanelClass = "panel panel-success";
    				break;
    			case "1":
    				// Months
    				$scope.uploadFilePeriod = "Valori mensili";
    				//uploadPanelClass = "panel panel-info";
    				break;
    			case "2":
    				// Years
    				$scope.uploadFilePeriod = "Valori annuali";
    				//uploadPanelClass = "panel panel-warning";
    				break;	
    			case "3":
    				// Dows
    				$scope.uploadFilePeriod = "Valori giorno settimana";
    				//uploadPanelClass = "panel panel-danger";
    				break;
    			case "4":
    				// Hours
    				$scope.uploadFilePeriod = "Valori orari";
    				//uploadPanelClass = "panel panel-danger";
    				break;	
    		}
    	} else if(type == "4"){
    		// Case of pm profit log
    		$scope.uploadFileType = "Log incassi strutture";
    		switch (period){
    			case "0":
    				// No period
    				$scope.uploadFilePeriod = "Valori attuali";
    				//uploadPanelClass = "panel panel-success";
    				break;
    			case "1":
    				// Months
    				$scope.uploadFilePeriod = "Valori mensili";
    				//uploadPanelClass = "panel panel-info";
    				break;
    			case "2":
    				// Years
    				$scope.uploadFilePeriod = "Valori annuali";
    				//uploadPanelClass = "panel panel-warning";
    				break;	
    			case "3":
    				// Dows
    				$scope.uploadFilePeriod = "Valori giorno settimana";
    				//uploadPanelClass = "panel panel-danger";
    				break;
    			case "4":
    				// Hours
    				$scope.uploadFilePeriod = "Valori orari";
    				//uploadPanelClass = "panel panel-danger";
    				break;	
    		}
    	} 
    };
    
    $scope.initActiveLogTab = function(id){
    	if($scope.logtabs == null || $scope.logtabs.length == 0){
    		$scope.logtabs = sharedDataService.getFluxViewTabs();
    	}
    	if(id > 4) id = id - 4;
    	$scope.setIndex(id-1);
    	for(var i = 0; i < $scope.logtabs.length; i++){
    		if(i == (id - 1)){
    			$scope.logtabs[i].active = true;
    		} else {
    			$scope.logtabs[i].active = false;
    		}
    	}
    };
    
    $scope.initActiveAddLogTab = function(id){
    	if(id > 4) id = id - 4;
    	$scope.setAddIndex(id-1);
    	for(var i = 0; i < $scope.addtabs.length; i++){
    		if(i == (id - 1)){
    			$scope.addtabs[i].active = true;
    		} else {
    			$scope.addtabs[i].active = false;
    		}
    	}
    };
    
    // Method loadLogData: used to load the log data in the DB mongo
    $scope.loadLogData = function(cat, type){
    	var appId = sharedDataService.getConfAppId();
    	var user = "999";
    	$scope.progress = 25;
 		$dialogs.wait("Aggiornamento dati in corso...", $scope.progress);
 		cat = 10;// for test to skip the web service call
 		if(cat == 1){
    		// Case street occupancy log
	    	switch(type){
	    		case 1:
	    			// Case months value
	    			var out_obj = angular.element(out);
	    	    	
	    			var method = 'POST';
	    	    	var fileVal = {	
	    	    		logData: (out_obj.context.innerText != null) ? out_obj.context.innerText : out_obj.context.innerHTML
	    	        };
	    	    	var params = {
	    				isSysLog: true,
	    				period : null
	    			};
	    	                	
	    	        var value = JSON.stringify(fileVal);
	    	        if($scope.showLog) console.log("Json value " + value);
	    	                	
	    	        var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/streets/fileupload/" + user, params, $scope.authHeaders, value);	
	    	        $scope.progress += 25;
	    	    	$rootScope.$broadcast('dialogs.wait.progress',{msg: "Aggiornamento dati in corso...",'progress': $scope.progress});
	    	        myDataPromise.then(function(result){
	    	           if(result != null && result != ""){	// I have to check if it is correct
	    	        	   console.log("Occupancy street file upload result: " + result);
	    	        	   //$scope.provvClass = result.userClassList;
	    	        	   //$scope.setLoadedPracticeVisible();
	    	        	   //$scope.ctUpdateProvv(1, "UPLOADED");
	    	        	   $scope.progress = 100;
	    	        	   $rootScope.$broadcast('dialogs.wait.complete');
	    	           }
	    	        });
	    			break;	    			
	    		default: break;	
	    	}	    	
    	}
 		if(cat == 2){
    		// Case ps occupancy log
	    	switch(type){
	    		case 1:
	    			// Case months value
	    			var out_obj = angular.element(out);
	    	    	
	    			var method = 'POST';
	    	    	var fileVal = {	
	    	    		logData: (out_obj.context.innerText != null) ? out_obj.context.innerText : out_obj.context.innerHTML
	    	        };
	    	    	var params = {
	    				isSysLog: true,
	    				period : null
	    			};
	    	                	
	    	        var value = JSON.stringify(fileVal);
	    	        if($scope.showLog) console.log("Json value " + value);
	    	                	
	    	        var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkings/fileupload/" + user, params, $scope.authHeaders, value);	
	    	        $scope.progress += 25;
	    	    	$rootScope.$broadcast('dialogs.wait.progress',{msg: "Aggiornamento dati in corso...",'progress': $scope.progress});
	    	        myDataPromise.then(function(result){
	    	           if(result != null && result != ""){	// I have to check if it is correct
	    	        	   console.log("Occupancy struct file upload result: " + result);
	    	        	   //$scope.provvClass = result.userClassList;
	    	        	   //$scope.setLoadedPracticeVisible();
	    	        	   //$scope.ctUpdateProvv(1, "UPLOADED");
	    	        	   $scope.progress = 100;
	    	        	   $rootScope.$broadcast('dialogs.wait.complete');
	    	           }
	    	        });
	    			break;	    			
	    		default: break;	
	    	}	    	
    	} 		
 		if(cat == 3){
    		// Case pm profit log
	    	switch(type){
	    		case 1:
	    			// Case months value
	    			var out_obj = angular.element(out);
	    	    	
	    			var method = 'POST';
	    	    	var fileVal = {	
	    	    		logData: (out_obj.context.innerText != null) ? out_obj.context.innerText : out_obj.context.innerHTML
	    	        };
	    	    	var params = {
	    				isSysLog: true,
	    				period : null
	    			};
	    	                	
	    	        var value = JSON.stringify(fileVal);
	    	        if($scope.showLog) console.log("Json value " + value);
	    	                	
	    	        var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkingmeters/fileupload/" + user, params, $scope.authHeaders, value);	
	    	        $scope.progress += 25;
	    	    	$rootScope.$broadcast('dialogs.wait.progress',{msg: "Aggiornamento dati in corso...",'progress': $scope.progress});
	    	        myDataPromise.then(function(result){
	    	           if(result != null && result != ""){	// I have to check if it is correct
	    	        	   console.log("Profit pm file upload result: " + result);
	    	        	   //$scope.provvClass = result.userClassList;
	    	        	   //$scope.setLoadedPracticeVisible();
	    	        	   //$scope.ctUpdateProvv(1, "UPLOADED");
	    	        	   $scope.progress = 100;
	    	        	   $rootScope.$broadcast('dialogs.wait.complete');
	    	           }
	    	        });
	    			break;	    			
	    		default: break;	
	    	}	    	
    	}	
    	if(cat == 4){
    		// Case ps profit log
	    	switch(type){
	    		case 1:
	    			// Case months value
	    			var out_obj = angular.element(out);
	    	    	
	    			var method = 'POST';
	    	    	var fileVal = {	
	    	    		logData: (out_obj.context.innerText != null) ? out_obj.context.innerText : out_obj.context.innerHTML
	    	        };
	    	    	var params = {
	    				isSysLog: true,
	    				period : null
	    			};
	    	                	
	    	        var value = JSON.stringify(fileVal);
	    	        if($scope.showLog) console.log("Json value " + value);
	    	                	
	    	        var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkstructprofit/fileupload/" + user, params, $scope.authHeaders, value);	
	    	        $scope.progress += 25;
	    	    	$rootScope.$broadcast('dialogs.wait.progress',{msg: "Aggiornamento dati in corso...",'progress': $scope.progress});
	    	        myDataPromise.then(function(result){
	    	           if(result != null && result != ""){	// I have to check if it is correct
	    	        	   console.log("Profit ps file upload result: " + result);
	    	        	   $scope.progress = 100;
	    	        	   $rootScope.$broadcast('dialogs.wait.complete');
	    	           }
	    	        });
	    			break;	    			
	    		default: break;	
	    	}
    	}	
    };
    
    $scope.showLogManualCreation = function(){
    	$scope.showManualInsertion = true;
    };
    
    $scope.hideLogManualCreation = function(){
    	$scope.showManualInsertion = false;
    };
    
}]);    