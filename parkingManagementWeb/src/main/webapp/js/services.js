'use strict';

/* Services */
var pmServices = angular.module('pmServices', ['ngResource']);
pm.service('sharedDataService', function(){
	// This section is shared between all the controllers
	
	// Shared field description
	this.usedLanguage = 'ita';
	this.name = '';
	this.surname = '';
	
	// Shared field app conf
	this.conf_app_id;
	this.conf_url_ws;
	this.conf_map_zoom;
	this.conf_map_center;
	this.conf_visible_obj_list = [];
	
	this.conf_show_area;
	this.conf_show_street;
	this.conf_show_pm;
	this.conf_show_ps;
	this.conf_show_bp;
	this.conf_show_zone;
	
	this.ueCitizen = false;
	this.familyAllowances = false;
	this.loading = false;
	this.userIdentity = 'HMTRND69R11Z100M';
	this.base64 = '';
	
	this.sharedLocalAreas = [];
	this.sharedLocalZones = [];
	this.sharedLocalPms = [];
	
	this.allFamilyUpdated = false;
	this.isTest = false;
	this.userId = '';
	
	this.inGlobalLogPage = false;
	this.inParkLogPage = false;
	this.inStreetLogPage = false;
	this.inProfitParkLogPage = false;
	this.inProfitParkmeterLogPage = false;
	
	// Shared time variables
	//-------------------------------------------------------------
	this.three_years_millis = 1000 * 60 * 60 * 24 * 365 * 3;	// I consider an year of 360 days
	this.two_years_millis = 1000 * 60 * 60 * 24 * 365 * 2;
	this.one_year_millis = 1000 * 60 * 60 * 24 * 365; 			// I consider an year of 360 days (12 month of 30 days)
	this.one_year_365_millis = 1000 * 60 * 60 * 24 * 365; 		// I consider an year of 365 days
	this.one_month_millis = 1000 * 60 * 60 * 24 * 30;			// Milliseconds of a month
	this.one_day_millis = 1000 * 60 * 60 * 24 * 2; 				// Milliseconds of a day
	this.six_hours_millis = 1000 * 60 * 60 * 6;					// Milliseconds in six hours
	//-------------------------------------------------------------
	
	this.infoPanelAss = false; 			// default value: the panel is closed
	this.infoPanelLoc = false; 			// default value: the panel is closed
	this.infoPanelStatesAss = false;	// default value: the panel is closed
	this.infoPanelStatesLoc = false;	// default value: the panel is closed
	
	this.isInList = false;
	
//	this.searchTab = '';
//	this.searchOpt = '';
//	this.searchVal = '';
//	this.searchList = [];
	
	this.utente = {};
	
	this.idDomanda = '';
	
    this.static_ambiti = [];
    this.static_comuni = [];
    this.static_edizioni = [];
            
    this.genders = [
         'Femminile',
         'Maschile'
    ];
            
    this.yes_no = [
         {code: 'true' , title: 'Si'},
         {code: 'false' , title: 'No'}
    ];    
    
    this.yes_no_val = [
         {value: true , title: 'Si'},
         {value: false , title: 'No'}
    ];
    
    // Array with extratime minute to find a park place in different case of occupancy level
    this.extratime_wait = [
         {occupancy:  0, difficulty_level: 'Null', extratime_estimation_min: 0, extratime_estimation_max: 0},
         {occupancy:  10, difficulty_level: 'Null', extratime_estimation_min: 0, extratime_estimation_max: 0},
         {occupancy:  20, difficulty_level: 'Null', extratime_estimation_min: 0, extratime_estimation_max: 0},
         {occupancy:  30, difficulty_level: 'Null', extratime_estimation_min: 0, extratime_estimation_max: 0},
         {occupancy:  40, difficulty_level: 'Null', extratime_estimation_min: 0, extratime_estimation_max: 0},
         {occupancy:  50, difficulty_level: 'Null', extratime_estimation_min: 0, extratime_estimation_max: 0},
         {occupancy:  60, difficulty_level: 'Low', extratime_estimation_min: 1, extratime_estimation_max: 1},
         {occupancy:  70, difficulty_level: 'Medium', extratime_estimation_min: 1, extratime_estimation_max: 3},
         {occupancy:  80, difficulty_level: 'High', extratime_estimation_min: 2, extratime_estimation_max: 5},
         {occupancy:  90, difficulty_level: 'Very High', extratime_estimation_min: 3, extratime_estimation_max: 10},
         {occupancy:  100, difficulty_level: 'Impossible', extratime_estimation_min: 5, extratime_estimation_max: 15},
    ];
  
    
    // Shared filter fields and mothods
    this.filter_topiclist;
    this.filter_space;
    this.filter_vis;
    this.filter_year;
    this.filter_month;
    this.filter_dowType;
    this.filter_dowVal;
    this.filter_hour;
    
    this.report_name;
    this.saved_report = {
    	id : '',	
    	name : '', 
    	description: {},
    	periodic : '', 
    	startperiod : '', 
    	mail : ''
    };
    this.report_list=[];
    
    this.preloaded_report_1 = {
    	id: 1,
    	name: 'parcometro_incasso_2015_settembre_feriale',
    	description : {
    		dow: "feriale",
    		hour: null,
    		month: "settembre",
    		space: "parcometro",
    		topic: "incasso",
    		vis: "valore medio",
    		year: "2015",
    	},
    	periodic : '2',
    	startperiod : new Date(1441058400000),
    	mail : 'prova@prova.it;test@test.it'
    };
    				
    this.preloaded_report_2 = {
    	id: 2,
    	name: 'dati_storici_parcometro_incasso_gennaio_dicembre',
    	description : {
    		dow: null,
    		hour: null,
    		month: "gennaio-dicembre",
    		space: "parcometro",
    		topic: "incasso",
    		vis: "valore medio",
    		year: "tutti",
    	},
    	periodic : '1',
    	startperiod : new Date(1441058400000),
    	mail : 'prova@prova.it'
    };
    
    this.report_list.push(this.preloaded_report_1);
    this.report_list.push(this.preloaded_report_2);
    
    this.setFilterTopicList = function(value){
    	this.filter_topiclist = value;
    };
    this.getFilterTopicList = function(){
    	return this.filter_topiclist;
    };
    
    this.setFilterSpace = function(value){
    	this.filter_space = value;
    };
    this.getFilterSpace = function(){
    	return this.filter_space;
    };
    
    this.setFilterVis = function(value){
    	this.filter_vis = value;
    };
    this.getFilterVis = function(){
    	return this.filter_vis;
    };
    
    this.setFilterYear = function(value){
    	this.filter_year = value;
    };
    this.getFilterYear = function(){
    	return this.filter_year;
    };
    
    this.setFilterMonth = function(value){
        this.filter_month = value;
    };
    this.getFilterMonth = function(){
    	return this.filter_month;
    };
    
    this.setFilterDowType = function(value){
        this.filter_dowType = value;
    };
    this.getFilterDowType = function(){
    	return this.filter_dowType;
    };
    
    this.setFilterDowVal = function(value){
        this.filter_dowVal = value;
    };
    this.getFilterDowVal = function(){
    	return this.filter_dowVal;
    };
    
    this.setFilterHour = function(value){
        this.filter_hour = value;
    };
    this.getFilterHour = function(){
    	return this.filter_hour;
    };
    
    this.setExtratimeWait = function(value){
    	this.extratime_wait = value;
    };
	
    this.getExtratimeWait = function(){
    	return this.extratime_wait;
    };
    
    this.setReportName = function(value){
    	this.report_name = value;
    };
    this.getReportName = function(){
    	return this.report_name;
    };
    
    this.setSavedReport = function(value){
    	this.saved_report = value;
    };
    this.getSavedReport = function(){
    	return this.saved_report;
    };
    
    this.addReportInList = function(report){
    	this.report_list.push(report);
    };
    this.getReportInList = function(report){
    	return this.report_list;
    };
    
	// Get and Set methods
	this.getUsedLanguage = function(){
		var value = sessionStorage.language;
		return this.usedLanguage;
	};
	
	this.setUsedLanguage = function(value){
		sessionStorage.language = value;
		this.usedLanguage = value;
	};
	
	this.getName = function(){
		return this.name;
	};
	
	this.setName = function(value){
		this.name = value;
	};
	
	this.getSurname = function(){
		return this.surname;
	};
	
	this.setSurname = function(value){
		this.surname = value;
	};
	
	this.setIsInList = function(value){
		this.isInList = value;
	};
	
	this.getIsInList = function(){
		return this.isInList;
	};
	
	this.isLoading = function(){
		return this.loading;
	};
	
	this.setLoading = function(value){
		this.loading = value;
	};
	
	this.setUserIdentity = function(value){
		//this.userIdentity = value;
		this.utente.codiceFiscale;
	};
	
	this.setInGlobalLogPage = function(value){
		this.inGlobalLogPage = value;
	};
	
	this.isInGlobalLogPage = function(){
		return this.inGlobalLogPage;
	};
//	
//	this.setInParkLogPage = function(value){
//		this.inParkLogPage = value;
//	};
//	
//	this.isInParkLogPage = function(){
//		return this.inParkLogPage;
//	};
//	
//	this.setInStreetLogPage = function(value){
//		this.inStreetLogPage = value;
//	};
//	
//	this.isInStreetLogPage = function(){
//		return this.inStreetLogPage;
//	};
//	
//	this.setInProfitParkLogPage = function(value){
//		this.inProfitParkLogPage = value;
//	};
//	
//	this.isInProfitParkLogPage = function(){
//		return this.inProfitParkLogPage;
//	};
//	
//	this.setInProfitParkmeterLogPage = function(value){
//		this.inProfitParkmeterLogPage = value;
//	};
//	
//	this.isInProfitParkmeterLogPage = function(){
//		return this.inProfitParkmeterLogPage;
//	};
	
//	this.getUserIdentity = function(){
//		return this.utente.codiceFiscale;
//	};
	
	// ----------------- ONLY FOR TESTS-------------
	this.getUserIdentity = function(){
		if(this.utente.codiceFiscale == null || this.utente.codiceFiscale == ""){
			return this.userIdentity;
		}
		else {
			return this.utente.codiceFiscale;
		}
	};
	//---------------------------------------------
	
	this.setMail = function(value){
		
		this.utente.email = value;
	};	
	
	this.getMail = function(){
		//return this.mail;
		return this.utente.email;
	};
	
	// ----------------- ONLY FOR TESTS-------------
	this.setBase64 = function(value){
		if(value == null || value == ""){
			this.base64 = 'MIIE6TCCA9GgAwIBAgIDBzMlMA0GCSqGSIb3DQEBBQUAMIGBMQswCQYDVQQGEwJJVDEYMBYGA1UECgwPUG9zdGVjb20gUy5wLkEuMSIwIAYDVQQLDBlTZXJ2aXppIGRpIENlcnRpZmljYXppb25lMTQwMgYDVQQDDCtQcm92aW5jaWEgQXV0b25vbWEgZGkgVHJlbnRvIC0gQ0EgQ2l0dGFkaW5pMB4XDTExMTEyMzAwMjQ0MloXDTE3MTEyMjAwNTk1OVowgY4xCzAJBgNVBAYTAklUMQ8wDQYDVQQKDAZUUy1DTlMxJTAjBgNVBAsMHFByb3ZpbmNpYSBBdXRvbm9tYSBkaSBUcmVudG8xRzBFBgNVBAMMPkJSVE1UVDg1TDAxTDM3OFMvNjA0MjExMDE5NzU3MTAwNy53aTRldjVNeCtFeWJtWnJkTllhMVA3ZUtkY1U9MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsF81BDJjAQat9Lfo/1weA0eePTsEbwTe/0QqlArfOTG3hfLEiSd+mDNsBUJo+cRXZMp677y9a1kYlB+IDY3LGH36Bs1QxM14KA6WB67KX4ZaXENew6Qm7NnkMRboKQiIOUmw1l4OiTETfqKWyFqfAtnyLHd8ZZ6qfjgSsJoSHoQIDAQABo4IB3TCCAdkwge0GA1UdIASB5TCB4jCBrAYFK0wQAgEwgaIwgZ8GCCsGAQUFBwICMIGSDIGPSWRlbnRpZmllcyBYLjUwOSBhdXRoZW50aWNhdGlvbiBjZXJ0aWZpY2F0ZXMgaXNzdWVkIGZvciB0aGUgaXRhbGlhbiBOYXRpb25hbCBTZXJ2aWNlIENhcmQgKENOUykgcHJvamVjdCBpbiBhY2NvcmRpbmcgdG8gdGhlIGl0YWxpYW4gcmVndWxhdGlvbiAwMQYGK0wLAQMBMCcwJQYIKwYBBQUHAgEWGWh0dHA6Ly9wb3N0ZWNlcnQucG9zdGUuaXQwOgYIKwYBBQUHAQEELjAsMCoGCCsGAQUFBzABhh5odHRwOi8vcG9zdGVjZXJ0LnBvc3RlLml0L29jc3AwDgYDVR0PAQH/BAQDAgeAMBMGA1UdJQQMMAoGCCsGAQUFBwMCMB8GA1UdIwQYMBaAFO5h8R6jQnz/4EeFe3FeW6ksaogHMEYGA1UdHwQ/MD0wO6A5oDeGNWh0dHA6Ly9wb3N0ZWNlcnQucG9zdGUuaXQvY25zL3Byb3ZpbmNpYXRyZW50by9jcmwuY3JsMB0GA1UdDgQWBBRF3Z13QZAmn85HIYPyIg3QE8WM2DANBgkqhkiG9w0BAQUFAAOCAQEAErn/asyA6AhJAwOBmxu90umMNF9ti9SX5X+3+pcqLbvKOgCNfjhGJZ02ruuTMO9uIi0DIDvR/9z8Usyf1aDktYvyrMeDZER+TyjviA3ntYpFWWIh1DiRnAxuGYf6Pt6HNehodf1lhR7TP+iejH24kS2LkqUyiP4J/45sTK6JNMXPVT3dk/BAGE1cFCO9FI3QyckstPp64SEba2+LTunEEA4CKPbTQe7iG4FKpuU6rqxLQlSXiPVWZkFK57bAUpVL/CLc7unlFzIccjG/MMvjWcym9L3LaU//46AV2hR8pUfZevh440wAP/WYtomffkITrMNYuD1nWxL7rUTUMkvykw==';
		} else {
			this.base64 = value;
		}
	};
	//----------------------------------------------
	
//	this.setBase64 = function(value){
//		this.base64 = value;
//	};
	
	
	this.getBase64 = function(){
		return this.base64;
	};
	
	this.setUtente = function(nome, cognome, sesso, dataNascita, provinciaNascita, luogoNascita, codiceFiscale, cellulare, email, indirizzoRes, capRes, cittaRes, provinciaRes){
		this.utente.nome = nome;
		this.utente.cognome = cognome;
		this.utente.sesso = sesso;
		this.utente.dataNascita = dataNascita;
		this.utente.provinciaNascita = provinciaNascita;
		this.utente.luogoNascita = luogoNascita;
		this.utente.codiceFiscale = codiceFiscale;
		this.utente.cellulare = cellulare;
		if(email != null && email != ""){
			this.utente.email = email;
		}
		this.utente.indirizzoRes = indirizzoRes;
		this.utente.capRes = capRes; 
		this.utente.cittaRes = cittaRes; 
		this.utente.provinciaRes = provinciaRes;
	};
	
	this.getUtente = function(){
		return this.utente;
	};
	
	// Lists getters
	this.getConfAppId = function(){
		return this.conf_app_id;
	};
	
	this.setConfAppId = function(value){
		this.conf_app_id = value;
	};
	
	this.getConfUrlWs = function(){
		return this.conf_url_ws;
	};
	
	this.setConfUrlWs = function(value){
		this.conf_url_ws = value;
	};
	
	this.getConfMapZoom = function(){
		return this.conf_map_zoom;
	};
	
	this.setConfMapZoom = function(value){
		this.conf_map_zoom = value;
	};
	
	this.getConfMapCenter = function(){
		return this.conf_map_center;
	};
	
	this.setConfMapCenter = function(value){
		this.conf_map_center = value;
	};
	
	this.setVisibleObjList = function(value){
		this.conf_visible_obj_list = value;
	};
	
	this.getVisibleObjList = function(){
		return this.conf_visible_obj_list;
	};
	
	this.setShowArea = function(value){
		this.conf_show_area = value;
	};
	
	this.getShowArea = function(){
		return this.conf_show_area;
	};
	
	this.setShowStreet = function(value){
		this.conf_show_street = value;
	};
	
	this.getShowStreet = function(){
		return this.conf_show_street;
	};
	
	this.setShowPm = function(value){
		this.conf_show_pm = value;
	};
	
	this.getShowPm = function(){
		return this.conf_show_pm;
	};
	
	this.setShowPs = function(value){
		this.conf_show_ps = value;
	};
	
	this.getShowPs = function(){
		return this.conf_show_ps;
	};
	
	this.setShowBp = function(value){
		this.conf_show_bp = value;
	};
	
	this.getShowBp = function(){
		return this.conf_show_bp;
	};
	
	this.setShowZone = function(value){
		this.conf_show_zone = value;
	};
	
	this.getShowZone = function(){
		return this.conf_show_zone;
	};
	
	this.getYesNoVal = function(){
		return this.yes_no_val;
	};
	
	this.getYesNo = function(){
		return this.yes_no;
	};
	
	this.getYesNoVal = function(){
		return this.yes_no_val;
	};
	
	this.getInfoPanelAss = function(){
		return this.infoPanelAss;
	};
	
	this.getInfoPanelLoc = function(){
		return this.infoPanelLoc;
	};
	
	this.getThreeYearsMillis = function(){
		return this.three_years_millis;
	};
	
	this.getTwoYearsMillis = function(){
		return this.two_years_millis;
	};
	
	this.getOneYearMillis = function(){
		return this.one_year_millis;
	};
	
	this.getOneYear365Millis = function(){
		return this.one_year_365_millis;
	};
	
	this.getOneMonthMillis = function(){
		return this.one_month_millis;
	};
	
	this.getOneDayMillis = function(){
		return this.one_day_millis;
	};
	
	this.getSixHoursMillis = function(){
		return this.six_hours_millis;
	};
	
	
	this.getSharedLocalAreas = function(){
		return this.sharedLocalAreas;
	};
	
	this.setSharedLocalAreas = function(list){
		this.sharedLocalAreas = list;
	};
	
	this.getSharedLocalZones = function(){
		return this.sharedLocalZones;
	};
	
	this.setSharedLocalZones = function(list){
		this.sharedLocalZones = list;
	};
	
	this.getSharedLocalPms = function(){
		return this.sharedLocalPms;
	};
	
	this.setSharedLocalPms = function(list){
		this.sharedLocalPms = list;
	};
	
	
	this.setUserId = function(value){
		this.userId = value;
	};
	
	this.getUserId = function(){
		return this.userId;
	};
	
	
});

//Message retriever method
pm.factory('getMyMessages', function($http, $q) {
	
	//var _this = this;

    var promiseToHaveData = function() {
        var deferred = $q.defer();
        
        var fileJson = '';
        if(this.usedLanguage == 'ita'){
        	fileJson = 'i18n/resources-locale_it-IT.json';
        } else {
        	fileJson = 'i18n/resources-locale_en-US.json';
        }

        $http.get(fileJson)
            .success(function(data) {
                //angular.extend(_this, data);
                deferred.resolve(data);
                // Funzione di caricamento stringhe messaggi in variabili di service
                //console.log("Finded message data: " + JSON.stringify(data));
            })
            .error(function() {
                deferred.reject('could not find someFile.json');
                console.log("Error in message data recovery.");
            });

        return deferred.promise;
    };
    return {promiseToHaveData : promiseToHaveData};

});

// Proxy Methods section
pm.factory('invokeWSService', function($http, $q) {
	var url = 'rest/';
	var getProxy = function(method, funcName, params, headers, data){
		var deferred = $q.defer();
		if(method == 'GET' && params == null){
			$http({
				method : method,
				url : url + funcName + '?noCache=' + new Date().getTime(),
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params != null){
			$http({
				method : method,
				url : url + funcName,
				params : params + '&noCache=' + new Date().getTime(),
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else {
			$http({
				method : method,
				url : url + funcName,
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
pm.factory('invokeWSServiceNS', function($http, $q) {
	var url = 'rest/nosec/';
	var getProxy = function(method, funcName, params, headers, data){
		var deferred = $q.defer();
		if(method == 'GET' && params == null){
			$http({
				method : method,
				url : url + funcName + '?noCache=' + new Date().getTime(),
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params != null){
			$http({
				method : method,
				url : url + funcName,
				params : params + '&noCache=' + new Date().getTime(),
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else {
			$http({
				method : method,
				url : url + funcName,
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
pm.factory('invokeDashboardWSService', function($http, $q) {
	var url = 'dashboard/rest/';
	var getProxy = function(method, funcName, params, headers, data){
		var deferred = $q.defer();
		if(method == 'GET' && params == null){
			$http({
				method : method,
				url : url + funcName + '?noCache=' + new Date().getTime(),
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params != null){
			$http({
				method : method,
				url : url + funcName,
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else {
			$http({
				method : method,
				url : url + funcName,
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
pm.factory('invokeAuxWSService', function($http, $q) {
	var url = 'auxiliary/rest/';
	var getProxy = function(method, funcName, params, headers, data){
		var deferred = $q.defer();
		if(method == 'GET' && params == null){
			$http({
				method : method,
				url : url + funcName + '?noCache=' + new Date().getTime(),
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params != null){
			$http({
				method : method,
				url : url + funcName,
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else {
			$http({
				method : method,
				url : url + funcName,
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
pm.factory('invokeDashboardWSServiceNS', function($http, $q) {
	var url = 'dashboard/rest/nosec/';
	var getProxy = function(method, funcName, params, headers, data){
		var deferred = $q.defer();
		if(method == 'GET' && params == null){
			$http({
				method : method,
				url : url + funcName + '?noCache=' + new Date().getTime(),
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params != null){
			$http({
				method : method,
				url : url + funcName,
				params : params + '&noCache=' + new Date().getTime(),
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else {
			$http({
				method : method,
				url : url + funcName,
				params : params,
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
pm.factory('invokeWSServiceProxy', function($http, $q) {
	var getProxy = function(method, funcName, params, headers, data){
		var deferred = $q.defer();
		
		//var url = 'http://localhost:8080/service.epu/';
		//var urlWS = url + funcName;
		var urlWS = funcName;
		if(params != null){
			urlWS += '?';
			for(var propertyName in params) {
				urlWS += propertyName + '=' + params[propertyName];
				urlWS += '&';
			};
			urlWS = urlWS.substring(0, urlWS.length - 1); // I remove the last '&'
		}
		//console.log("Proxy Service: url completo " + urlWS);
		
		if(method == 'GET' && params != null){
			$http({
				method : method,
				url : 'rest/allGet',
				params : {
					"urlWS" : urlWS + '&noCache=' + new Date().getTime()	// quela mer.. de ie el cacheava tut e con sta modifica el funzia
				},
				headers : headers
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params == null){
			$http({
				method : method,
				url : 'rest/allGet',
				params : {
					"urlWS" : urlWS + '?noCache=' + new Date().getTime()	// quela mer.. de ie el cacheava tut e con sta modifica el funzia
				},
				headers : headers
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'POST'){
			$http({
				method : method,
				url : 'rest/allPost',
				params : {
					"urlWS" : urlWS
				},
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'PUT'){
			$http({
				method : method,
				url : 'rest/allPut',
				params : {
					"urlWS" : urlWS
				},
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'DELETE'){
			$http({
				method : method,
				url : 'rest/allDelete',
				params : {
					"urlWS" : urlWS	// quela mer.. de ie el cacheava tut e con sta modifica el funzia
				},
				headers : headers
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		}
			
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
pm.factory('invokePdfServiceProxy', function($http, $q) {
	var getProxy = function(method, funcName, params, headers, data){
		var deferred = $q.defer();
		
		$http({
			method : method,
			url : funcName,
			params : params,
			headers : headers,
			data : data
		}).success(function(data) {
			//console.log("Returned data ok: " + JSON.stringify(data));
			deferred.resolve(data);
		}).error(function(data) {
			console.log("Returned data FAIL: " + JSON.stringify(data));
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
