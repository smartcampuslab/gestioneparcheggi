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
    
    $scope.onlyNumbers = /^\d+$/;
    $scope.timePattern=/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
    
    $scope.logtabs = [ 
        { title:'Log generale', index: 1, content:"partials/aux/logs/global_logs.html" },
        { title:'Log vie', index: 2, content:"partials/aux/logs/street_logs.html" },
        { title:'Log parcheggi', index: 3, content:"partials/aux/logs/parking_logs.html" }
    ];
    
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
	    });
	};
	
	$scope.getDetailData = function(street){
		$scope.myStreetDetails = street;
		$scope.streetLoadedAndSelected = true;
		// to hide the messages (error or success)
		$scope.showUpdatingSErrorMessage = false;
		$scope.showUpdatingSSuccessMessage = false;
	};
	
	$scope.getParkDetailData = function(park){
		$scope.myParkingDetails = park;
		$scope.parkLoadedAndSelected = true;
		// to hide the messages (error or success)
		$scope.showUpdatingPErrorMessage = false;
		$scope.showUpdatingPSuccessMessage = false;
	};
	
	// Method insertStreetLog: used to insert in the db (table dataLogBean) a new street log
	$scope.insertStreetLog = function(form, myStreetDetails){
		$scope.showUpdatingSErrorMessage = false;
		$scope.showUpdatingSSuccessMessage = false;
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
			
			var value = JSON.stringify(streetLogDet);
			console.log("streetLogDet: " + value);
			
		    //var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
		   	var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/streets/" + logId + "/" + user, null, $scope.authHeaders, value);
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
	};
	
	// Method insertParkingLog: used to insert in the db (table dataLogBean) a new parking log
	$scope.insertParkingLog = function(form, myParkingDetails){
		$scope.showUpdatingPErrorMessage = false;
		$scope.showUpdatingPSuccessMessage = false;
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
			
			var value = JSON.stringify(parkingLogDet);
			console.log("parkingLogDet: " + value);
			
		   	var myDataPromise = invokeAuxWSService.getProxy(method, appId + "/parkings/" + logId + "/" + user, null, $scope.authHeaders, value);
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
	};
	
	// Method composeLogId: method used to compose the correct log id with the object type, app id and the log id
	$scope.composeLogId = function(type, appId, logId){
		if(type == 1){
			return "street@" + appId + "@" + logId;
		} else {
			return "parking@" + appId + "@" + logId;
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
    
    $scope.getLogMillis = function(date, time){
    	var millis = 0;
    	var res = time.split(":");
   		var hours = res[0];
   		var minutes = res[1];
   		var seconds = res[2];
    	
    	if(date instanceof Date){
    		// if date is a Date
       		date.setHours(hours);
       		date.setMinutes(minutes);
       		date.setSeconds(seconds);
       		millis = date.getTime();
    	}
    	return millis;
    };
    
}]);    