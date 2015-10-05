'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers'); //, ['angularFileUpload']

pm.controller('AuxCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$route', '$location', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeWSServiceProxy', 'invokePdfServiceProxy', 'invokeAuxWSService', 'getMyMessages', '$timeout','FileUploader',
                               function($scope, $http, $routeParams, $rootScope, $route, $location, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, invokePdfServiceProxy, invokeAuxWSService, getMyMessages, $timeout, FileUploader) { 
	this.$scope = $scope;
    $scope.params = $routeParams;
    
    // ---------------------------------- START Code for file upload ------------------------------------
	var uploader = $scope.uploader = new FileUploader({
		url: 'js/controllers/upload.php'
		//url: 'upload/upload.php'   
    });
	//var uploader = $scope.uploader = new FileUploader();
	
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
    
    
    $scope.showDetails = false;
    $scope.showFiltered = false;
    $scope.maxLogs = 15;
    
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
    
    $scope.logtabs = [ 
        { title:'Storico Rilevazioni', index: 1, content:"partials/aux/logs/global_logs.html", active: true },
        { title:'Rilevazioni occupazione vie', index: 2, content:"partials/aux/logs/street_logs.html", active: false },
        { title:'Rilevazioni occupazione parcheggi', index: 3, content:"partials/aux/logs/parking_logs.html", active: false },
        { title:'Rilevazioni ricavi parcometri', index: 4, content:"partials/aux/logs/pm_profit_logs.html", active: false },
        { title:'Rilevazioni ricavi parcheggi', index: 5, content:"partials/aux/logs/parking_profit_logs.html", active: false }
    ];
    
    $scope.setIndex = function($index){
    	switch($index){
	    	case 0:
	    		sharedDataService.setInGlobalLogPage(true);
	    		sharedDataService.setInStreetLogPage(false);
	    		sharedDataService.setInParkLogPage(false);
	    		sharedDataService.setInProfitParkLogPage(false);
	    		sharedDataService.setInProfitParkmeterLogPage(false);
	    		$scope.initGlobalLogs();
	    		break;
	    	case 1:
	    		sharedDataService.setInGlobalLogPage(false);
	    		sharedDataService.setInStreetLogPage(true);
	    		sharedDataService.setInParkLogPage(false);
	    		sharedDataService.setInProfitParkLogPage(false);
	    		sharedDataService.setInProfitParkmeterLogPage(false);
	    		$scope.initStreetLogs();
	    		break;
	    	case 2:
	    		sharedDataService.setInGlobalLogPage(false);
	    		sharedDataService.setInStreetLogPage(false);
	    		sharedDataService.setInParkLogPage(true);
	    		sharedDataService.setInProfitParkLogPage(false);
	    		sharedDataService.setInProfitParkmeterLogPage(false);
	    		$scope.initParkLogs();
	    		break;
	    	case 3:
	    		sharedDataService.setInGlobalLogPage(false);
	    		sharedDataService.setInStreetLogPage(false);
	    		sharedDataService.setInParkLogPage(false);
	    		sharedDataService.setInProfitParkLogPage(false);
	    		sharedDataService.setInProfitParkmeterLogPage(true);
	    		$scope.initProfitParkMeterLogs();
	    		break;	
	    	case 4:
	    		sharedDataService.setInGlobalLogPage(false);
	    		sharedDataService.setInStreetLogPage(false);
	    		sharedDataService.setInParkLogPage(false);
	    		sharedDataService.setInProfitParkLogPage(true);
	    		sharedDataService.setInProfitParkmeterLogPage(false);
	    		$scope.initProfitParkLogs();
	    		break;	
    	}
       	$scope.tabIndex = $index;
    };
    
    $scope.addtabs = [ 
        { title:'Occupazione via', index: 1, content:"partials/aux/adds/street_logs.html" },
        { title:'Occupazione parcheggio', index: 2, content:"partials/aux/adds/parking_logs.html" },
        { title:'Profitto parcometro', index: 3, content:"partials/aux/adds/parkmeter_profit_logs.html" },
        { title:'Profitto parcheggio', index: 4, content:"partials/aux/adds/parking_profit_logs.html" }
    ];
                  
    $scope.setAddIndex = function($index){
        $scope.tabIndex = $index;
    };
    
    $scope.authHeaders = {
        'Accept': 'application/json;charset=UTF-8'
    };
    
    $scope.logCounts = 0;
    $scope.logParkCounts = 0;
    $scope.logStreetCounts = 0;
    $scope.globalLogs = [];
    $scope.parkLogs = [];
    $scope.streetLogs = [];
    
    // For default
    $scope.initGlobalLogs = function(){
    	$scope.showDetails = false;
    	$scope.showFiltered = false;
    	//$scope.countAllLogsInDb();
    	$scope.getAllLogsFromDbTP();
    };
    
    // For parking occupancy
	$scope.initParkLogs = function(){
		$scope.showDetails = false;
		//$scope.getAllParkLogsFromDbTP();
		$scope.getAllParkLogsFromGlobalList();
    };
    
    // For parking profit
    $scope.initProfitParkLogs = function(){
		$scope.showDetails = false;
		//$scope.getAllParkProfitLogsFromDbTP();
		$scope.getAllParkProfitLogsFromGlobalList();
    };
    
    // For parkingmeter profit
    $scope.initProfitParkMeterLogs = function(){
		$scope.showDetails = false;
		//$scope.getAllParkMeterProfitLogsFromDbTP();
		$scope.getAllParkMeterProfitLogsFromGlobalList();
    };
    
    // For street
	$scope.initStreetLogs = function(){
		$scope.showDetails = false;
		//$scope.getAllStreetLogsFromDbTP();
		$scope.getAllStreetLogsFromGlobalList();
    };
    
//    $scope.countAllLogsInDb = function(){
//		var elements = 0;
//		var method = 'GET';
//		var appId = sharedDataService.getConfAppId();
//		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/log/count/all", null, $scope.authHeaders, null);
//		myDataPromise.then(function(result){
//		    console.log("log counted in db: " + JSON.stringify(result));
//		    elements = parseInt(result);
//		    $scope.logCounts = elements;
//		    $scope.logCountsPage = Math.ceil($scope.logCounts / $scope.maxLogs);
//		    if($scope.globalLogs.length != $scope.logCounts){
//		    	$scope.globalLogs = [];
//		    }
//		    $scope.getAllLogsFromDb(0);
//		});
//	};
//	
//	$scope.getAllLogsFromDb = function(skip){
//		if($scope.globalLogs.length < $scope.logCounts){
//			var method = 'GET';
//			var appId = sharedDataService.getConfAppId();
//			var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/log/all/" + skip, null, $scope.authHeaders, null);
//			myDataPromise.then(function(result){
//				//console.log("log finded in db: " + JSON.stringify(result));
//				$scope.globalLogs = $scope.globalLogs.concat(result);
//			    if(skip < $scope.logCounts && sharedDataService.isInGlobalLogPage()){
//			    	skip += 100;
//			   	$scope.getAllLogsFromDb(skip);
//			    } else {
//			    	console.log("All log finded: last skip = " + skip);
//			    }
//			});
//		} else {
//			console.log("global log already loaded.");
//		}
//	};
	
	$scope.getAllLogsFromDbTP = function(){
		$scope.globalLogs = [];
		$scope.isLoadingLogs = true;
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/tplog/all", null, $scope.authHeaders, null);
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
		    $scope.isLoadingLogs = false;
		});
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
	
//	$scope.countAllParkLogsInDb = function(){
//		var elements = 0;
//		var method = 'GET';
//		var appId = sharedDataService.getConfAppId();
//		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/log/count/parking", null, $scope.authHeaders, null);
//		myDataPromise.then(function(result){
//		    console.log("park log counted in db: " + JSON.stringify(result));
//		    elements = parseInt(result);
//		    $scope.logParkCounts = elements;
//		    $scope.logParkCountsPage = Math.ceil($scope.logParkCounts / $scope.maxLogs);
//		    if($scope.parkLogs.length != $scope.logParkCounts){
//		    	$scope.parkLogs = [];
//		    }
//		    $scope.getAllParkLogsFromDb(0);
//		});
//	};
//	
//	$scope.getAllParkLogsFromDb = function(skip){
//		if($scope.parkLogs.length < $scope.logParkCounts){
//			var method = 'GET';
//			var appId = sharedDataService.getConfAppId();
//			var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/log/parkings/" + skip, null, $scope.authHeaders, null);
//			myDataPromise.then(function(result){
//				console.log("park log finded in db: " + JSON.stringify(result));
//				$scope.parkLogs = $scope.parkLogs.concat(result);
//			    if(skip < $scope.logParkCounts && sharedDataService.isInParkLogPage()){
//			    	skip += 100;
//			    	$scope.getAllParkLogsFromDb(skip);
//			    } else {
//			    	console.log("Park log finded: last skip = " + skip + " counts = " + $scope.logParkCounts + " isInParkLogPage = " + sharedDataService.isInParkLogPage());
//			    }
//			});
//		} else {
//			console.log("park log already loaded.");
//		}
//	};
	
	$scope.getAllParkLogsFromDbTP = function(){
		$scope.parkLogs = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/tplog/parkings", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			var partialLogs = result;
			var corrLog = null;
			for(var i = 0; i < partialLogs.length; i++){
				corrLog = {
					id:	partialLogs[i].id,
					objId: partialLogs[i].objId,
					type: partialLogs[i].type,
					time: partialLogs[i].time,
					logPeriod : partialLogs[i].logPeriod,
					author: partialLogs[i].author,
					agency: partialLogs[i].agency,
			        deleted: partialLogs[i].deleted,
			        year: partialLogs[i].year,
			        month: partialLogs[i].month,
			        week_day: partialLogs[i].week_day,
			        timeSlot: partialLogs[i].timeSlot,
			        holyday: partialLogs[i].holyday,
			        isSystemLog: partialLogs[i].systemLog,
			        value: (partialLogs[i].valueString != null && partialLogs[i].valueString != "") ? JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString)) : {} //JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString))
				};
				//console.log("corrLog: " + JSON.stringify(corrLog));
				$scope.parkLogs.push(corrLog);
			}
			$scope.logParkCounts = partialLogs.length;
		    $scope.logParkCountsPage = Math.ceil($scope.logParkCounts / $scope.maxLogs);
		});
	};
	
	// Method getAllParkProfitLogsFromDbTP: used to retrieve all the logs of type parkstruct in the profitLogBean Table
	$scope.getAllParkProfitLogsFromDbTP = function(){
		$scope.parkProfitLogs = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/tplog/parkstructs", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			var partialLogs = result;
			var corrLog = null;
			for(var i = 0; i < partialLogs.length; i++){
				corrLog = {
					id:	partialLogs[i].id,
					objId: partialLogs[i].objId,
					type: partialLogs[i].type,
					time: partialLogs[i].time,
					logPeriod : partialLogs[i].logPeriod,
					author: partialLogs[i].author,
					agency: partialLogs[i].agency,
			        deleted: partialLogs[i].deleted,
			        year: partialLogs[i].year,
			        month: partialLogs[i].month,
			        week_day: partialLogs[i].week_day,
			        timeSlot: partialLogs[i].timeSlot,
			        holyday: partialLogs[i].holyday,
			        isSystemLog: partialLogs[i].systemLog,
			        value: (partialLogs[i].valueString != null && partialLogs[i].valueString != "") ? JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString)) : {} //JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString))
				};
				//console.log("corrLog: " + JSON.stringify(corrLog));
				$scope.parkProfitLogs.push(corrLog);
			}
			$scope.logParkCounts = partialLogs.length;
		    $scope.logParkCountsPage = Math.ceil($scope.logParkCounts / $scope.maxLogs);
		});
	};
	
	// Method getAllParkMeterProfitLogsFromDbTP: used to retrieve all the logs of type parkmeter in the dataLogBean Table
	$scope.getAllParkMeterProfitLogsFromDbTP = function(){
		$scope.pmProfitLogs = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/tplog/parkmeters", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			var partialLogs = result;
			var corrLog = null;
			for(var i = 0; i < partialLogs.length; i++){
				corrLog = {
					id:	partialLogs[i].id,
					objId: partialLogs[i].objId,
					type: partialLogs[i].type,
					time: partialLogs[i].time,
					logPeriod : partialLogs[i].logPeriod,
					author: partialLogs[i].author,
					agency: partialLogs[i].agency,
			        deleted: partialLogs[i].deleted,
			        year: partialLogs[i].year,
			        month: partialLogs[i].month,
			        week_day: partialLogs[i].week_day,
			        timeSlot: partialLogs[i].timeSlot,
			        holyday: partialLogs[i].holyday,
			        isSystemLog: partialLogs[i].systemLog,
			        value: (partialLogs[i].valueString != null && partialLogs[i].valueString != "") ? JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString)) : {} //JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString))
				};
				//console.log("corrLog: " + JSON.stringify(corrLog));
				$scope.pmProfitLogs.push(corrLog);
			}
			$scope.logParkCounts = partialLogs.length;
		    $scope.logParkCountsPage = Math.ceil($scope.logParkCounts / $scope.maxLogs);
		});
	};
	
//	$scope.countAllStreetLogsInDb = function(){
//		var elements = 0;
//		var method = 'GET';
//		var appId = sharedDataService.getConfAppId();
//		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/log/count/street", null, $scope.authHeaders, null);
//		myDataPromise.then(function(result){
//		    console.log("street log counted in db: " + JSON.stringify(result));
//		    elements = parseInt(result);
//		    $scope.logStreetCounts = elements;
//		    $scope.logStreetCountsPage = Math.ceil($scope.logStreetCounts / $scope.maxLogs);
//		    if($scope.streetLogs.length != $scope.logStreetCounts){
//		    	$scope.streetLogs = [];
//		    }
//		    $scope.getAllStreetLogsFromDb(0);
//		});
//	};
//	
//	$scope.getAllStreetLogsFromDb = function(skip){
//		if($scope.streetLogs.length < $scope.logStreetCounts){
//			var method = 'GET';
//			var appId = sharedDataService.getConfAppId();
//			var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/log/streets/" + skip, null, $scope.authHeaders, null);
//			myDataPromise.then(function(result){
//				//console.log("street log finded in db: " + JSON.stringify(result));
//				$scope.streetLogs = $scope.streetLogs.concat(result);
//			    if(skip < $scope.logStreetCounts && sharedDataService.isInStreetLogPage()){
//			    	skip += 100;
//			    	$scope.getAllStreetLogsFromDb(skip);
//			    } else {
//			    	console.log("Street log finded: last skip = " + skip + " counts = " + $scope.logStreetCounts + " isInStreetLogPage = " + sharedDataService.isInStreetLogPage());
//			    }
//			});
//		} else {
//			console.log("street log already loaded.");
//		}
//	};
	
	$scope.getAllStreetLogsFromDbTP = function(){
		$scope.streetLogs = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/tplog/streets", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
			var partialLogs = result;
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
				$scope.streetLogs.push(corrLog);
			}
			$scope.logStreetCounts = partialLogs.length;
		    $scope.logStreetCountsPage = Math.ceil($scope.logStreetCounts / $scope.maxLogs);
		});
	};
	
	// Method getAllParkLogsFromGlobalList: used to retrieve all the logs of type parking from the globalLogs list
	$scope.getAllParkLogsFromGlobalList = function(){
		$scope.parkLogs = [];
		for(var i = 0; i < $scope.globalLogs.length; i++){
			if($scope.globalLogs[i].type == "it.smartcommunitylab.parking.management.web.auxiliary.model.Parking"){
				$scope.parkLogs.push($scope.globalLogs[i]);
			}
		}
		$scope.logParkCounts = $scope.parkLogs.length;
	    $scope.logParkCountsPage = Math.ceil($scope.logParkCounts / $scope.maxLogs);
	};
	
	// Method getAllParkMeterProfitLogsFromGlobalList: used to retrieve all the logs of type parkmeter from the globalLogs list
	$scope.getAllParkMeterProfitLogsFromGlobalList = function(){
		$scope.pmProfitLogs = [];
		for(var i = 0; i < $scope.globalLogs.length; i++){
			if($scope.globalLogs[i].type == "it.smartcommunitylab.parking.management.web.auxiliary.model.ParkMeter"){
				$scope.pmProfitLogs.push($scope.globalLogs[i]);
			}
		}
		$scope.logParkCounts = $scope.pmProfitLogs.length;
	    $scope.logParkCountsPage = Math.ceil($scope.logParkCounts / $scope.maxLogs);
	};
	
	// Method getAllParkProfitLogsFromGlobalList: used to retrieve all the logs of type parkstruct from the globalLogs list
	$scope.getAllParkProfitLogsFromGlobalList = function(){
		$scope.parkProfitLogs = [];
		for(var i = 0; i < $scope.globalLogs.length; i++){
			if($scope.globalLogs[i].type == "it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct"){
				$scope.parkProfitLogs.push($scope.globalLogs[i]);
			}
		}
		$scope.logParkCounts = $scope.parkProfitLogs.length;
	    $scope.logParkCountsPage = Math.ceil($scope.logParkCounts / $scope.maxLogs);
	};
	
	// Method getAllStreetLogsFromGlobalList: used to retrieve all the logs of type street from the globalLogs list
	$scope.getAllStreetLogsFromGlobalList = function(){
		$scope.streetLogs = [];
		for(var i = 0; i < $scope.globalLogs.length; i++){
			if($scope.globalLogs[i].type == "it.smartcommunitylab.parking.management.web.auxiliary.model.Street"){
				$scope.streetLogs.push($scope.globalLogs[i]);
			}
		}
		$scope.logStreetCounts = $scope.streetLogs.length;
	    $scope.logStreetCountsPage = Math.ceil($scope.logStreetCounts / $scope.maxLogs);
	};
	
	$scope.viewDetails = function(type, log){
		$scope.showDetails = true;
		if(type == 1){
			$scope.showFiltered = false;
		}
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
	
	$scope.viewFiltered = function(log){
		$scope.filterForLog = log.objId;
		$scope.showFiltered = true;
	};
	
	$scope.closeFiltered = function(){
		$scope.filterForLog = null;
		$scope.showFiltered = false;
	};
	
	$scope.currentPage = 0;
	$scope.currentFilterPage = 0;
	$scope.numberOfPages = function(list){
       	if(list != null){
       		return Math.ceil(list.length/$scope.maxLogs);
       	} else {
       		return 0;
     	}
	};  
	
	$scope.correctEuroCent = function(eurocent){
		var intval = parseInt(eurocent);
		var totalEur = (intval / 100);
		return totalEur.toFixed(2) + " ";
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
						slotsPaying: parseInt(myStreetDetails.slotsPaying), 
						slotsOccupiedOnPaying: parseInt(myStreetDetails.slotsOccupiedOnPaying), 
						slotsTimed: parseInt(myStreetDetails.slotsTimed), 
						slotsOccupiedOnTimed: parseInt(myStreetDetails.slotsOccupiedOnTimed), 
						slotsHandicapped: parseInt(myStreetDetails.slotsHandicapped), 
						slotsOccupiedOnHandicapped: parseInt(myStreetDetails.slotsOccupiedOnHandicapped),
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
    	$scope.showMaxErrorPaing = false;
    	$scope.showMaxErrorTimed = false;
    	var available_free = street_details.slotsFree;
    	var available_paying = street_details.slotsPaying;
    	var available_timed = street_details.slotsTimed;
    	if(available_free!= null && available_free >= 0){
    		if(available_free < street_details.slotsOccupiedOnFree){
    			$scope.showMaxErrorFree = true;
    		}
    	}
    	if(available_paying!= null && available_paying >= 0){
    		if(available_paying < street_details.slotsOccupiedOnPaying){
    			$scope.showMaxErrorPaing = true;
    		}
    	}
    	if(available_timed!= null && available_timed >= 0){
    		if(available_timed < street_details.slotsOccupiedOnTimed){
    			$scope.showMaxErrorTimed = true;
    		}
    	}
    	if($scope.showMaxErrorFree || $scope.showMaxErrorPaing || $scope.showMaxErrorTimed){
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
    		// Case of ps occupation log
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
    	} else if(type == "4"){
    		// Case of ps occupation log
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
    	}
    };
    
    $scope.initActiveLogTab = function(id){
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
    
    
    
}]);    