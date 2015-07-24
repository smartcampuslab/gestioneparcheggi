'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('AuxCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$route', '$location', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeWSServiceProxy', 'invokePdfServiceProxy', 'invokeAuxWSService', 'getMyMessages', '$timeout',
                               function($scope, $http, $routeParams, $rootScope, $route, $location, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, invokePdfServiceProxy, invokeAuxWSService, getMyMessages, $timeout) { 
	this.$scope = $scope;
    $scope.params = $routeParams;
    
    $scope.showDetails = false;
    $scope.showFiltered = false;
    $scope.maxLogs = 15;
    
    $scope.logtabs = [ 
        { title:'Log generale', index: 1, content:"partials/aux/logs/global_logs.html" },
        { title:'Log vie', index: 2, content:"partials/aux/logs/street_logs.html" },
        { title:'Log parcheggi', index: 3, content:"partials/aux/logs/parking_logs.html" }
    ];
    
    $scope.setIndex = function($index){
    	switch($index){
	    	case 0:
	    		sharedDataService.setInGlobalLogPage(true);
	    		sharedDataService.setInStreetLogPage(false);
	    		sharedDataService.setInParkLogPage(false);
	    		$scope.initGlobalLogs();
	    		break;
	    	case 1:
	    		sharedDataService.setInGlobalLogPage(false);
	    		sharedDataService.setInStreetLogPage(true);
	    		sharedDataService.setInParkLogPage(false);
	    		$scope.initStreetLogs();
	    		break;
	    	case 2:
	    		sharedDataService.setInGlobalLogPage(false);
	    		sharedDataService.setInStreetLogPage(false);
	    		sharedDataService.setInParkLogPage(true);
	    		$scope.initParkLogs();
	    		break;
    	}
       	$scope.tabIndex = $index;
    };
    
    $scope.addtabs = [ 
        { title:'Nuovo log via', index: 1, content:"partials/aux/adds/street_logs.html" },
        { title:'Nuovo log parcheggio', index: 2, content:"partials/aux/adds/parking_logs.html" }
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
					author: partialLogs[i].author,
					agency: partialLogs[i].agency,
			        deleted: partialLogs[i].deleted,
			        year: partialLogs[i].year,
			        month: partialLogs[i].month,
			        week_day: partialLogs[i].week_day,
			        timeSlot: partialLogs[i].tileSlot,
			        holyday: partialLogs[i].holyday,
			        value: (partialLogs[i].valueString != null && partialLogs[i].valueString != "") ? JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString)) : {} //JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString))
				};
				//console.log("corrLog: " + JSON.stringify(corrLog));
				$scope.globalLogs.push(corrLog);
			}	
			$scope.logCounts =  partialLogs.length;
		    $scope.logCountsPage = Math.ceil($scope.logCounts / $scope.maxLogs);
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
	
	// For parking
	$scope.initParkLogs = function(){
		$scope.showDetails = false;
    	//$scope.countAllParkLogsInDb();
		$scope.getAllParkLogsFromDbTP();
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
					author: partialLogs[i].author,
					agency: partialLogs[i].agency,
			        deleted: partialLogs[i].deleted,
			        year: partialLogs[i].year,
			        month: partialLogs[i].month,
			        week_day: partialLogs[i].week_day,
			        timeSlot: partialLogs[i].tileSlot,
			        holyday: partialLogs[i].holyday,
			        value: (partialLogs[i].valueString != null && partialLogs[i].valueString != "") ? JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString)) : {} //JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString))
				};
				//console.log("corrLog: " + JSON.stringify(corrLog));
				$scope.parkLogs.push(corrLog);
			}
			$scope.logParkCounts = partialLogs.length;
		    $scope.logParkCountsPage = Math.ceil($scope.logParkCounts / $scope.maxLogs);
		});
	};
	
	// For street
	$scope.initStreetLogs = function(){
		$scope.showDetails = false;
    	//$scope.countAllStreetLogsInDb();
		$scope.getAllStreetLogsFromDbTP();
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
					author: partialLogs[i].author,
					agency: partialLogs[i].agency,
			        deleted: partialLogs[i].deleted,
			        year: partialLogs[i].year,
			        month: partialLogs[i].month,
			        week_day: partialLogs[i].week_day,
			        timeSlot: partialLogs[i].tileSlot,
			        holyday: partialLogs[i].holyday,
			        value: (partialLogs[i].valueString != null && partialLogs[i].valueString != "") ? JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString)) : {} //JSON.parse($scope.cleanStringForJSON(partialLogs[i].valueString))
				};
				//console.log("corrLog: " + JSON.stringify(corrLog));
				$scope.streetLogs.push(corrLog);
			}
			$scope.logStreetCounts = partialLogs.length;
		    $scope.logStreetCountsPage = Math.ceil($scope.logStreetCounts / $scope.maxLogs);
		});
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
		$scope.getStreetsFromDb();
	};
	
	// Method getStreetsFromDb: used to init the input select in log creation
	$scope.getStreetsFromDb = function(){
		$scope.allStreet = [];
		var allStreet = [];
		var method = 'GET';
		var appId = sharedDataService.getConfAppId();
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
		var myDataPromise = invokeWSService.getProxy(method, appId + "/street", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allStreet);
	    	$scope.allStreet = $scope.initStreetsObjects(allStreet);
	    	$scope.streetLoadedAndSelected = false;
	    });
	};
	
	$scope.initStreetsObjects = function(streets){
		var myStreets = [];
		for(var i = 0; i < streets.length; i++){
			var zones = [];
			var pms = [];
			var area = $scope.getLocalAreaById(streets[i].rateAreaId);
			var mystreet = streets[i];
			mystreet.area_name = area.name;
			mystreet.area_color= area.color;
			mystreet.myZones = zones;
			mystreet.myPms = pms;
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
	
	$scope.getDetailData = function(street){
		$scope.myStreetDetails = street;
		$scope.streetLoadedAndSelected = true;
	};
    
}]);    