'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('MainCtrl',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', '$locale', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeDashboardWSService', 'invokeWSServiceProxy','invokePdfServiceProxy','getMyMessages','$timeout',
    function($scope, $http, $route, $routeParams, $rootScope, localize, $locale, $dialogs, sharedDataService, $filter, invokeWSService, invokeDashboardWSService, invokeWSServiceProxy, invokePdfServiceProxy, getMyMessages, $timeout) {
    
    $scope.setFrameOpened = function(value){
    	$rootScope.frameOpened = value;
    };
    
    $scope.setViewTabs = function(){
    	//$scope.setViewIndex(0);
    	$scope.hideHome();
    	$scope.setNextButtonViewLabel("Chiudi");
    	$scope.setFrameOpened(true);
    };
    
    $scope.setNextButtonViewLabel = function(value){
    	$rootScope.buttonNextViewLabel = value;
    };

    $scope.$route = $route;
    //$scope.$location = $location;
    $scope.$routeParams = $routeParams;
    //this.params = $routeParams;
    
    $scope.userCF = sharedDataService.getUserIdentity(); 
    
    $scope.app ;
                  			
    //$scope.citizenId = userId;
    $scope.user_token = token;
    //$scope.user_token = "";
                  			
    // new elements for view
    $scope.currentView;
    $scope.editMode;
    $scope.currentViewDetails;
                  			
    // max practices displayed in home list
    $scope.maxPractices = 10;
    $scope.practicesWSM = [];

    // for language icons
    var itaLanguage = "active";
    var engLanguage = "";
    
	// for localization
    $scope.setEnglishLanguage = function(){
    	$scope.used_lang = "i18n/angular-locale_en-EN.js";
    	itaLanguage = "";
    	engLanguage = "active";
    	//$scope.setUserLocale("en-US");
    	//$locale.id = "en-US";
    	localize.setLanguage('en-US');
    	sharedDataService.setUsedLanguage('eng');
    	//var myDataMsg = getMyMessages.promiseToHaveData('eng');
    	//myDataMsg.then(function(result){
    	//	sharedDataService.inithializeAllMessages(result);
    	//});
    };
    
    $scope.setItalianLanguage = function(){
    	$scope.used_lang = "i18n/angular-locale_it-IT.js";
    	itaLanguage = "active";
    	engLanguage = "";
    	//$scope.setUserLocale("it-IT");
    	//$locale.id = "it-IT";
    	localize.setLanguage('it-IT');
    	sharedDataService.setUsedLanguage('ita');
    	//var myDataMsg = getMyMessages.promiseToHaveData('ita');
    	//myDataMsg.then(function(result){
    	//    sharedDataService.inithializeAllMessages(result);
    	//});
    };
    
    $scope.setUserLocale = function(lan){
    	var lan_uri = '';
    	if(lan == "it-IT"){
    		lan_uri = 'i18n/angular-locale_it-IT.js';
    	} else if (lan == "en-US"){
    		lan_uri = 'i18n/angular-locale_en-EN.js';
    	}
//    	$http.get(lan_uri).then(function(results){
//    		console.log("Risultato get locale " + results);
//    		angular.copy(results.data, $locale);
//    	});
    	$http.get(lan_uri)
    		.success(function(results){
    			console.log("Success get locale " + results);
    			$locale = results;
    			//angular.copy(results, $locale);
    			$locale.id;
    		})
    		.error(function(results) {
        	console.log("Error get locale " + results);
        });
    };
    
    $scope.isActiveItaLang = function(){
        return itaLanguage;
    };
                  			
    $scope.isActiveEngLang = function(){
    	return engLanguage;
    };
    
    // for services selection
    var homeShowed = true;
    // for menu manageing
    var home = "";
    var parkhome = "";
    var auxhome = "";
    
    var homeSubPark = "";
    var editingPark = "active";
    var editingBike = "";
    var viewingAll = "";
    
    // ----------------------- Dashboard section ----------------------
    var dashboard = "active";
    
    $scope.setHomeDashboardActive = function(){
    	home = "";
    	dashboard = "active";
    	parkhome = "";
    	auxhome = "";
    	viewingAll = "";
    	sharedDataService.setInGlobalLogPage(false);
    };
    
    $scope.isHomeDashboardActive = function(){
        return dashboard;
    };
    // ------------------- End of Dashboard section -------------------
        
    $scope.hideHome = function(){
    	homeShowed = false;   		
    };
    
    $scope.showHome = function(){
    	homeShowed = true;
    };            			
                  			
    $scope.isHomeShowed = function(){
    	return homeShowed;
    };
    
    $scope.isHomeActive = function(){
    	return home;
    };
      
    $scope.home = function() {
    	$scope.setFrameOpened(false);
    	// I refresh all the actived Link
    	home="active";
    	dashboard = "";	// Used for dashboard
    	parkhome = "";
    	auxhome = "";
    	
    	homeSubPark = "";
    	editingPark = "";
    	editingBike = "";
    	viewingAll = "";
        //window.document.location = "./";
        $scope.showHome();
        sharedDataService.setInGlobalLogPage(false);
    };
    
    $scope.setHomeParkActive = function(){
    	home = "";
    	dashboard = "";	// Used for dashboard
    	parkhome = "active";
    	auxhome = "";
    	
    	//homeSubPark = "active";
    	//editingPark = "";
    	homeSubPark = "";
    	editingPark = "active";
    	editingBike = "";
    	viewingAll = "";
    	sharedDataService.setInGlobalLogPage(false);
    };
    
    $scope.isHomeParkActive = function(){
        return parkhome;
    };
    
    $scope.setHomeAuxActive = function(){
    	home = "";
    	dashboard = "";	// Used for dashboard
    	parkhome = "";
    	auxhome = "active";
    	viewingAll = "";
    };
    
    $scope.isHomeAuxActive = function(){
        return auxhome;
    };
    
    $scope.setHomeSubParkActive = function(){
    	homeSubPark = "active";
        editingPark = "";
        editingBike = "";
        viewingAll = "";
    };
    
    $scope.isHomeSubParkActive = function(){
        return homeSubPark;
    };
    
    $scope.setEditingParkActive = function(){
    	homeSubPark = "";
        editingPark = "active";
        editingBike = "";
        viewingAll = "";
    };
    
    $scope.isEditingParkActive = function(){
        return editingPark;
    };
    
    $scope.setEditingBikeActive = function(){
    	homeSubPark = "";
        editingPark = "";
        editingBike = "active";
        viewingAll = "";
    };
    
    $scope.isEditingBikeActive = function(){
        return editingBike;
    };
    
    $scope.setViewAllActive = function(){
    	parkhome = "";
    	homeSubPark = "";
        editingPark = "";
        editingBike = "";
        viewingAll = "active";
        auxhome = "";
        dashboard = "";
        sharedDataService.setInGlobalLogPage(false);
    };
    
    $scope.isViewAllActive = function(){
        return viewingAll;
    };
    
    $scope.logout = function() {
    	// Clear some session variables
    	sharedDataService.setName(null);
        sharedDataService.setSurname(null);
        sharedDataService.setBase64(null);
        $scope.user_token = null;
        sharedDataService.setInGlobalLogPage(false);
        
    	window.location.href = "logout";
    };
                  		    
    $scope.getToken = function() {
        return 'Bearer ' + $scope.user_token;
    };
                  		    
    $scope.authHeaders = {
         'Authorization': $scope.getToken(),
         'Accept': 'application/json;charset=UTF-8'
    };
                  		    
    // ------------------- User section ------------------
    //$scope.retrieveUserData = function() {
    	//$scope.getUser();				// retrieve user data
    	//$scope.getUserUeNationality();	// retrieve the user ue/extraue Nationality
    //};
    
//    $scope.user;
//    $scope.getUser = function() {
//    	console.log("user id " + $scope.citizenId );
//    	$http({
//        	method : 'GET',
//        	url : 'rest/citizen/user/' + $scope.citizenId,
//        	params : {},
//            headers : $scope.authHeaders
//        }).success(function(data) {
//        	$scope.user = data;
//        }).error(function(data) {
//        });
//    };
    
    // For user shared data
    if(user_name != null && user_surname != null){
    	sharedDataService.setName(user_name);
    	sharedDataService.setSurname(user_surname);
    }
    
    sharedDataService.setConfAppId(conf_app_id);
    //sharedDataService.setConfUrlWs(conf_url_ws);
    sharedDataService.setConfMapCenter(conf_map_center);
    sharedDataService.setConfMapZoom(conf_map_zoom);
    
    $scope.widget_inport_url = conf_widget_url + "/viewall/" + conf_app_id;
 
    $scope.loadConfObject = function(data){
    	var visibleObjList = [];
    	var allObjs = data.split("}]}");
    	for(var i = 0; i < allObjs.length - 1; i++){
    		var objFields = allObjs[i].split(", attributes=[{");
    		var ids = objFields[0].split("=");
    		var showedObj = {
    				id : ids[1],
    				attributes: $scope.correctAtributes(objFields[1])
    		};
    		visibleObjList.push(showedObj);
    	}
    	sharedDataService.setVisibleObjList(visibleObjList);
    };
    
    $scope.correctAtributes = function(data){
    	var corrAttribList = [];
    	var attribList = data.split("}, {");
    	for(var i = 0; i < attribList.length; i++){
    		var attribObj = attribList[i].split(", ");
    		var code = "";
    		var editable = "";
    		var visible = "";
    		var required = "";
    		for(var j = 0; j < attribObj.length; j++){
    			var rec = attribObj[j].split("=");
    			if(rec[0].indexOf("code") > -1){
    				code = rec[1];
    			}
    			if(rec[0].indexOf("editable") > -1){
    				editable = (rec[1] === 'true');
    			}
    			if(rec[0].indexOf("visible") > -1){
    				visible = (rec[1] === 'true');
    			}
    			if(rec[0].indexOf("required") > -1){
    				required = (rec[1] === 'true');
    			}
    		}
    		var attrib = {
    			code: code,
    			visible: visible,
    			required: required,
    			editable: editable
    		};
    		corrAttribList.push(attrib);
    	}
    	return corrAttribList;
    };
    
    $scope.loadConfObject(object_to_show);
    
//    $scope.setAppId = function(){
//		var url = "appid";
//		if(no_sec == "true"){
//			url = "nosec/appid";
//		}
//		var method = 'POST';
//		var value = sharedDataService.getConfAppId();
//		if($scope.showLog) console.log("App id data : " + value);
//			
//		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, value);
//		var myDataPromise = invokeWSService.getProxy(method, url, null, $scope.authHeaders, value);
//		myDataPromise.then(function(result){
//			if(result != null && result != ""){
//				//console.log("App Id Ok: " + result);
//			} else {
//				console.log("App Id KO. Not Set. " + result);	
//			}
//		});
//	};
	
//	$scope.setDashboardAppId = function(){
//		var url = "appid";
//		var method = 'POST';
//		var value = sharedDataService.getConfAppId();
//		if($scope.showLog) console.log("App id dashboard data : " + value);
//			
//		//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, value);
//		var myDataPromise = invokeDashboardWSService.getProxy(method, url, null, $scope.authHeaders, value);
//		myDataPromise.then(function(result){
//			if(result != null && result != ""){
//				//console.log("App Id Ok: " + result);
//			} else {
//				console.log("App Id dashboard KO. Not Set. " + result);	
//			}
//		});
//	};
	
//	$scope.setAppId();
//	$scope.setDashboardAppId();
	
	$scope.initComponents = function(){
	    $scope.showedObjects = sharedDataService.getVisibleObjList();
	    $scope.showBikeMenuLink = false;
	    $scope.showDashboardMenuLink = false;
	    $scope.showAuxMenuLink = false;
	    for(var i = 0; i < $scope.showedObjects.length; i++){
	    	if($scope.showedObjects[i].id == 'Bp'){
	    		$scope.showBikeMenuLink = true;
	    	}
	    	if($scope.showedObjects[i].id == 'Dashboard'){
	    		if($scope.showedObjects[i].attributes[0].visible){
	    			$scope.showDashboardMenuLink = true;
	    			$scope.setHomeDashboardActive();
	    		} else {
	    			$scope.showDashboardMenuLink = false;
	    		}
	    	}
	    	if($scope.showedObjects[i].id == 'Flux'){
	    		if($scope.showedObjects[i].attributes[0].visible){
	    			$scope.showAuxMenuLink = true;
	    		} else {
	    			$scope.showAuxMenuLink = false;
	    		}
	    	}
	    }
	    if($scope.showDashboardMenuLink == false){
	    	$scope.setHomeParkActive();
			//window.location.href = "home";
	    }
    };
    
    $scope.initComponents();
    
    //console.log("Conf data " + object_to_show);
    //sharedDataService.setBase64(base64);
    //sharedDataService.setBase64('MIIE6TCCA9GgAwIBAgIDBzMlMA0GCSqGSIb3DQEBBQUAMIGBMQswCQYDVQQGEwJJVDEYMBYGA1UECgwPUG9zdGVjb20gUy5wLkEuMSIwIAYDVQQLDBlTZXJ2aXppIGRpIENlcnRpZmljYXppb25lMTQwMgYDVQQDDCtQcm92aW5jaWEgQXV0b25vbWEgZGkgVHJlbnRvIC0gQ0EgQ2l0dGFkaW5pMB4XDTExMTEyMzAwMjQ0MloXDTE3MTEyMjAwNTk1OVowgY4xCzAJBgNVBAYTAklUMQ8wDQYDVQQKDAZUUy1DTlMxJTAjBgNVBAsMHFByb3ZpbmNpYSBBdXRvbm9tYSBkaSBUcmVudG8xRzBFBgNVBAMMPkJSVE1UVDg1TDAxTDM3OFMvNjA0MjExMDE5NzU3MTAwNy53aTRldjVNeCtFeWJtWnJkTllhMVA3ZUtkY1U9MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsF81BDJjAQat9Lfo/1weA0eePTsEbwTe/0QqlArfOTG3hfLEiSd+mDNsBUJo+cRXZMp677y9a1kYlB+IDY3LGH36Bs1QxM14KA6WB67KX4ZaXENew6Qm7NnkMRboKQiIOUmw1l4OiTETfqKWyFqfAtnyLHd8ZZ6qfjgSsJoSHoQIDAQABo4IB3TCCAdkwge0GA1UdIASB5TCB4jCBrAYFK0wQAgEwgaIwgZ8GCCsGAQUFBwICMIGSDIGPSWRlbnRpZmllcyBYLjUwOSBhdXRoZW50aWNhdGlvbiBjZXJ0aWZpY2F0ZXMgaXNzdWVkIGZvciB0aGUgaXRhbGlhbiBOYXRpb25hbCBTZXJ2aWNlIENhcmQgKENOUykgcHJvamVjdCBpbiBhY2NvcmRpbmcgdG8gdGhlIGl0YWxpYW4gcmVndWxhdGlvbiAwMQYGK0wLAQMBMCcwJQYIKwYBBQUHAgEWGWh0dHA6Ly9wb3N0ZWNlcnQucG9zdGUuaXQwOgYIKwYBBQUHAQEELjAsMCoGCCsGAQUFBzABhh5odHRwOi8vcG9zdGVjZXJ0LnBvc3RlLml0L29jc3AwDgYDVR0PAQH/BAQDAgeAMBMGA1UdJQQMMAoGCCsGAQUFBwMCMB8GA1UdIwQYMBaAFO5h8R6jQnz/4EeFe3FeW6ksaogHMEYGA1UdHwQ/MD0wO6A5oDeGNWh0dHA6Ly9wb3N0ZWNlcnQucG9zdGUuaXQvY25zL3Byb3ZpbmNpYXRyZW50by9jcmwuY3JsMB0GA1UdDgQWBBRF3Z13QZAmn85HIYPyIg3QE8WM2DANBgkqhkiG9w0BAQUFAAOCAQEAErn/asyA6AhJAwOBmxu90umMNF9ti9SX5X+3+pcqLbvKOgCNfjhGJZ02ruuTMO9uIi0DIDvR/9z8Usyf1aDktYvyrMeDZER+TyjviA3ntYpFWWIh1DiRnAxuGYf6Pt6HNehodf1lhR7TP+iejH24kS2LkqUyiP4J/45sTK6JNMXPVT3dk/BAGE1cFCO9FI3QyckstPp64SEba2+LTunEEA4CKPbTQe7iG4FKpuU6rqxLQlSXiPVWZkFK57bAUpVL/CLc7unlFzIccjG/MMvjWcym9L3LaU//46AV2hR8pUfZevh440wAP/WYtomffkITrMNYuD1nWxL7rUTUMkvykw==');
    //sharedDataService.setMail(user_mail);
    //sharedDataService.setUtente(nome, cognome, sesso, dataNascita, provinciaNascita, luogoNascita, codiceFiscale, cellulare, email, indirizzoRes, capRes, cittaRes, provinciaRes );
    
    $scope.getUserName = function(){
  	  return sharedDataService.getName();
    };
    
    $scope.getUserSurname = function(){
  	  return sharedDataService.getSurname();
    };
    
    $scope.getMail = function(){
      return sharedDataService.getMail();
    };
    
    $scope.setMail = function(value){
    	sharedDataService.setMail(value);
    };
    
//    $scope.isUeCitizen = function(){
//    	return sharedDataService.getUeCitizen();
//    };
    
    $scope.translateUserGender = function(value){
    	if(sharedDataService.getUsedLanguage() == 'eng'){
    		if(value == 'maschio'){
    			return 'male';
    		} else {
    			return 'female';
    		}
    	} else {
    		return value;
    	}
    };
    
    
                  			
}]);