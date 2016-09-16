'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('sharedDataService', function($window, $dialogs, $timeout){
	
	// This section is shared between all the controllers
	// Shared field description
	this.usedLanguage = 'ita';
	this.name = '';
	this.surname = '';
	this.ERRCONSTANT = "<title>MetroParco - Login</title>";
	
	this.getErrConstant = function(){
		return this.ERRCONSTANT;
	}
	
    this.authHeaders = {
        'Accept': 'application/json;charset=UTF-8'
    };
    
    this.getAuthHeaders = function(){
    	return this.authHeaders;
    };
    
    this.vehicle_type = "Car";
	
	// Shared field app conf
	this.conf_app_id;
	this.conf_url_ws;
	this.conf_map_zoom;
	this.conf_map_center;
	this.conf_map_recenter;
	this.conf_visible_obj_list = [];
	
	this.conf_show_area;
	this.conf_show_street;
	this.conf_show_pm;
	this.conf_show_ps;
	this.conf_show_bp;
	this.conf_show_zone;
	this.conf_user_agency;
	
	this.ueCitizen = false;
	this.familyAllowances = false;
	this.loading = false;
	this.userIdentity = 'HMTRND69R11Z100M';
	this.base64 = '';
	
	this.sharedLocalAreas = [];
	this.sharedLocalStreets = [];
	this.sharedLocalZones0 = [];
	this.sharedLocalZones1 = [];
	this.sharedLocalZones2 = [];
	this.sharedLocalZones3 = [];
	this.sharedLocalZones4 = [];
	this.sharedLocalMicroZones = [];
	this.sharedLocalPms = [];
	this.sharedLocalPs = [];
	this.sharedLocalBps = [];
	
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
  
    this.flux_view_tabs = [];
    this.showOccStreetLogEdit = false;
    this.showOccStructLogEdit = false;
    this.showProfPMLogEdit = false;
    this.showProfStructLogEdit = false;
    
    // Shared filter fields and methods
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
    
    this.setVehicleType = function(vt){
    	this.vehicle_type = vt;
    };
    
    this.getVehicleType = function(){
    	return this.vehicle_type;
    };
    
    this.report_list.push(this.preloaded_report_1);
    this.report_list.push(this.preloaded_report_2);
    
    this.zone_type_list = [];
    this.microzone_type = "";
    this.marcozone_type = "";
    
    this.ps_managers = [];
    this.municipality = [];
    
    this.setZoneTypeList = function(value){
    	this.zone_type_list = value;
    };
    
    this.getZoneTypeList = function(){
    	return this.zone_type_list;
    };
    
    this.setMicroZoneType = function(value){
    	this.microzone_type = value;
    };
    
    this.getMicroZoneType = function(){
    	return this.microzone_type;
    };
    
    this.setMacroZoneType = function(value){
    	this.macrozone_type = value;
    };
    
    this.getMacroZoneType = function(){
    	return this.macrozone_type;
    };  
    
    this.setPsManagerVals = function(value){
    	this.ps_managers = value;
    };
    
    this.getPsManagerVals = function(){
    	return this.ps_managers;
    };
    
    this.setMunicipalityVals = function(value){
    	this.municipality = value;
    };
    
    this.getMunicipalityVals = function(){
    	return this.municipality;
    };
    
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
    
    this.setReportName = function(value){
    	this.report_name = value;
    };
    this.getReportName = function(){
    	return this.report_name;
    };
    
    this.setConfUserAgency = function(list){
    	this.conf_user_agency = list;
    };
    
    this.getConfUserAgency = function(){
    	return this.conf_user_agency;
    };
    
    this.getAgencyPermissionsForObject = function(obj){
    	return this.conf_user_agency[obj];
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
	
	this.getFluxViewTabs = function(){
		return this.flux_view_tabs;
	};
	this.setFluxViewTabs = function(value){
		this.flux_view_tabs = value;
	};
	
	this.getOccStreetLogEdit = function(){
		return this.showOccStreetLogEdit;
	};
	this.setOccStreetLogEdit = function(value){
		this.showOccStreetLogEdit = value;
	};
	
	this.getOccStructLogEdit = function(){
		return this.showOccStructLogEdit;
	};
	this.setOccStructLogEdit = function(value){
		this.showOccStructLogEdit = value;
	};
	
	this.getProfPmLogEdit = function(){
		return this.showProfPMLogEdit;
	};
	this.setProfPmLogEdit = function(value){
		this.showProfPMLogEdit = value;
	};
	
	this.getProfStructLogEdit = function(){
		return this.showProfStructLogEdit;
	};
	this.setProfStructLogEdit = function(value){
		this.showProfStructLogEdit = value;
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
	
	this.getConfMapRecenter = function(){
		return this.conf_map_recenter;
	};
	
	this.setConfMapRecenter = function(value){
		this.conf_map_recenter = value;
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
	
	this.getSharedLocalStreets = function(){
		return this.sharedLocalStreets;
	};
	
	this.setSharedLocalStreets = function(list){
		this.sharedLocalStreets = list;
	};
	
	// Zones
	this.getSharedLocalZones0 = function(){
		return this.sharedLocalZones0;
	};
	
	this.setSharedLocalZones0 = function(list){
		this.sharedLocalZones0 = list;
	};
	
	this.getSharedLocalZones1 = function(){
		return this.sharedLocalZones1;
	};
	
	this.setSharedLocalZones1 = function(list){
		this.sharedLocalZones1 = list;
	};
	
	this.getSharedLocalZones2 = function(){
		return this.sharedLocalZones2;
	};
	
	this.setSharedLocalZones2 = function(list){
		this.sharedLocalZones2 = list;
	};
	
	this.getSharedLocalZones3 = function(){
		return this.sharedLocalZones3;
	};
	
	this.setSharedLocalZones3 = function(list){
		this.sharedLocalZones3 = list;
	};
	
	this.getSharedLocalZones4 = function(){
		return this.sharedLocalZones4;
	};
	
	this.setSharedLocalZones4 = function(list){
		this.sharedLocalZones4 = list;
	};
	
	this.getSharedLocalPms = function(){
		return this.sharedLocalPms;
	};
	
	this.setSharedLocalPms = function(list){
		this.sharedLocalPms = list;
	};
	
	this.getSharedLocalPs = function(){
		return this.sharedLocalPs;
	};
	
	this.setSharedLocalPs = function(list){
		this.sharedLocalPs = list;
	};
	
	this.getSharedLocalBps = function(){
		return this.sharedLocalBps;
	};
	
	this.setSharedLocalBps = function(list){
		this.sharedLocalBps = list;
	};
	
	
	this.setUserId = function(value){
		this.userId = value;
	};
	
	this.getUserId = function(){
		return this.userId;
	};
	
	// ----- List of functions shared between controllers  -------------------------------------------- 
	//       (for objects data extensions like occupancy, slots number, profit data...)
	
	this.setSharedLocalZones = function(zones, zindex){
		switch(zindex){
			case 0:
				this.setSharedLocalZones0(zones);
				break;
			case 1: 
				this.setSharedLocalZones1(zones);
				break;
			case 2: 
				this.setSharedLocalZones2(zones);
				break;
			case 3: 
				this.setSharedLocalZones3(zones);
				break;
			case 4: 
				this.setSharedLocalZones4(zones);
				break;
			default: break;
		}
	};
	
	this.getSharedLocalZones = function(zindex){
		var zones = null;
		switch(zindex){
			case 0:
				zones = this.getSharedLocalZones0();
				break;
			case 1: 
				zones = this.getSharedLocalZones1();
				break;
			case 2: 
				zones = this.getSharedLocalZones2();
				break;
			case 3: 
				zones = this.getSharedLocalZones3();
				break;
			case 4: 
				zones = this.getSharedLocalZones4();
				break;
			default: break;
		}
		return zones;
	};
	
	this.getPmsFromArea = function(list, area){
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
	
	
	// Method getTotalSlotsInZone: used to count the total slots of a zone from the slots in streets
	this.getTotalSlotsInZone = function(z_id, occStreetList, vehicleType){
		var totalSlots = 0;
		var occupiedSlots = 0;
		if(occStreetList != null && occStreetList.length > 0){
			for(var i = 0; i < occStreetList.length; i++){
				var found = false;
				for(var j = 0; (j < occStreetList[i].zones.length) && !found; j++){
					//var zone = $scope.getLocalZoneById(streets[i].zones[j]);
					//myZones.push(zone);
					if(occStreetList[i].zones[j] == z_id){
						found = true;
						if(occStreetList[i].slotsConfiguration){
							for(var j = 0; j < occStreetList[i].slotsConfiguration.length; j++){
								var tmpSlotConf = occStreetList[i].slotsConfiguration[j];
								if(vehicleType){
									if(tmpSlotConf.vehicleType == vehicleType){
										var slotConf = this.cleanStreetNullValue(tmpSlotConf);// NB: I have to use the average occupancy value and not the data stored in db
										var tmp_occ = this.getTotalOccupiedSlots(slotConf);
										totalSlots += (slotConf.slotNumber - slotConf.unusuableSlotNumber);
										occupiedSlots += tmp_occ;
										break;
									}
								} else {
									var slotConf = this.cleanStreetNullValue(occStreetList[i].slotsConfiguration[j]);// NB: I have to use the average occupancy value and not the data stored in db
									var tmp_occ = this.getTotalOccupiedSlots(slotConf);
									totalSlots += (slotConf.slotNumber - slotConf.unusuableSlotNumber);
									occupiedSlots += tmp_occ;
								}
							}
						}
					}
				}
			}
		}
		var occupation = (occupiedSlots == 0) ? -1 : Math.round((100 * occupiedSlots) / totalSlots);
		return [totalSlots, occupiedSlots, occupation];
	};
	
	// Method getTotalSlotsInArea: used to count the total slots of an area from the slots in streets
	this.getTotalSlotsInArea = function(a_id, occStreetList, vehicleType){
		var totalSlots = 0;
		var occupiedSlots = 0;
		if(occStreetList != null && occStreetList.length > 0){
			for(var i = 0; i < occStreetList.length; i++){
				if(occStreetList[i].rateAreaId == a_id){
					if(occStreetList[i].slotsConfiguration){
						for(var j = 0; j < occStreetList[i].slotsConfiguration.length; j++){
							var tmpSlotConf = occStreetList[i].slotsConfiguration[j];
							if(vehicleType){
								if(tmpSlotConf.vehicleType == vehicleType){
									var slotConf = this.cleanStreetNullValue(tmpSlotConf);// NB: I have to use the average occupancy value and not the data stored in db
									var tmp_occ = this.getTotalOccupiedSlots(slotConf);
									totalSlots += (slotConf.slotNumber - slotConf.unusuableSlotNumber);
									occupiedSlots += tmp_occ;
									break;
								}
							} else {
								var slotConf = this.cleanStreetNullValue(occStreetList[i].slotsConfiguration[j]);// NB: I have to use the average occupancy value and not the data stored in db
								var tmp_occ = this.getTotalOccupiedSlots(slotConf);
								totalSlots += (slotConf.slotNumber - slotConf.unusuableSlotNumber);
								occupiedSlots += tmp_occ;
							}
						}
					}
				}
			}
		}
		var occupation = (occupiedSlots == 0) ? -1 : Math.round((100 * occupiedSlots) / totalSlots);
		return [totalSlots, occupiedSlots, occupation];
	};
	
	// Method used to get the total slots occupied in a street object
	this.getTotalOccupiedSlots = function(s_object){
		return (s_object.freeParkSlotOccupied +
				s_object.freeParkSlotSignOccupied + 
				s_object.paidSlotOccupied + 
				s_object.timedParkSlotOccupied + 
				s_object.handicappedSlotOccupied + 
				s_object.reservedSlotOccupied + 
				s_object.rechargeableSlotOccupied +
				s_object.loadingUnloadingSlotOccupied + 
				s_object.pinkSlotOccupied + 
				s_object.carSharingSlotOccupied);
	};
	
	// Method cleanStreetNullValue: used to init to 0 the null value in the slotNumber data and to init to the correct value the valorize slots
	this.cleanStreetNullValue = function(s_object){
		var street = {};
		if(s_object){
			street = s_object;
			street.freeParkSlotNumber = (s_object.freeParkSlotNumber != null && s_object.freeParkSlotNumber > 0) ? s_object.freeParkSlotNumber : 0;
			street.freeParkSlotSignNumber = (s_object.freeParkSlotSignNumber != null && s_object.freeParkSlotSignNumber > 0) ? s_object.freeParkSlotSignNumber : 0;
			street.paidSlotNumber = (s_object.paidSlotNumber != null && s_object.paidSlotNumber > 0) ? s_object.paidSlotNumber : 0;
			street.timedParkSlotNumber = (s_object.timedParkSlotNumber != null && s_object.timedParkSlotNumber > 0) ? s_object.timedParkSlotNumber : 0;
			street.handicappedSlotNumber = (s_object.handicappedSlotNumber != null && s_object.handicappedSlotNumber > 0) ? s_object.handicappedSlotNumber : 0;
			street.reservedSlotNumber = (s_object.reservedSlotNumber != null && s_object.reservedSlotNumber > 0) ? s_object.reservedSlotNumber : 0;
			// new street slot types
			street.rechargeableSlotNumber = (street.rechargeableSlotNumber != null && street.rechargeableSlotNumber > 0) ? street.rechargeableSlotNumber : 0;
			street.loadingUnloadingSlotNumber = (street.loadingUnloadingSlotNumber != null && street.loadingUnloadingSlotNumber > 0) ? street.loadingUnloadingSlotNumber : 0;
			street.pinkSlotNumber = (street.pinkSlotNumber != null && street.pinkSlotNumber > 0) ? street.pinkSlotNumber : 0;
			street.carSharingSlotNumber = (street.carSharingSlotNumber != null && street.carSharingSlotNumber > 0) ? street.carSharingSlotNumber : 0;
			// ----------------------------------------------------------------
			street.freeParkSlotOccupied = (s_object.freeParkSlotOccupied != null && s_object.freeParkSlotOccupied > 0 && s_object.freeParkSlotNumber > 0) ? s_object.freeParkSlotOccupied : 0;
			street.freeParkSlotSignOccupied = (s_object.freeParkSlotSignOccupied != null && s_object.freeParkSlotSignOccupied > 0 && s_object.freeParkSlotSignNumber > 0) ? s_object.freeParkSlotSignOccupied : 0;
			street.paidSlotOccupied = (s_object.paidSlotOccupied != null && s_object.paidSlotOccupied > 0) ? s_object.paidSlotOccupied : 0;
			street.timedParkSlotOccupied = (s_object.timedParkSlotOccupied != null && s_object.timedParkSlotOccupied > 0) ? s_object.timedParkSlotOccupied : 0;
			street.handicappedSlotOccupied = (s_object.handicappedSlotOccupied != null && s_object.handicappedSlotOccupied > 0) ? s_object.handicappedSlotOccupied : 0;
			street.reservedSlotOccupied = (s_object.reservedSlotOccupied != null && s_object.reservedSlotOccupied > 0) ? s_object.reservedSlotOccupied : 0;
			// new street slot types
			street.rechargeableSlotOccupied = (street.rechargeableSlotOccupied != null && street.rechargeableSlotOccupied > 0) ? street.rechargeableSlotOccupied : 0;
			street.loadingUnloadingSlotOccupied = (street.loadingUnloadingSlotOccupied != null && street.loadingUnloadingSlotOccupied > 0) ? street.loadingUnloadingSlotOccupied : 0;
			street.pinkSlotOccupied = (street.pinkSlotOccupied != null && street.pinkSlotOccupied > 0) ? street.pinkSlotOccupied : 0;
			street.carSharingSlotOccupied = (street.carSharingSlotOccupied != null && street.carSharingSlotOccupied > 0) ? street.carSharingSlotOccupied : 0;
			street.unusuableSlotNumber = (s_object.unusuableSlotNumber != null && s_object.unusuableSlotNumber > 0) ? s_object.unusuableSlotNumber : 0;
		}
		return street;
	};
	
	// Method getStreetInZoneOccupancy: used to get the occupancy in all the streets in a specific zone
	this.getStreetsInZoneOccupancy = function(z_id, occStreetList){
		var totalOccupancy = 0;
		var streetsInZone = 0;
		var noData = true;
		if(occStreetList != null && occStreetList.length > 0){
			for(var i = 0; i < occStreetList.length; i++){
				var found = false;
				for(var j = 0; (j < occStreetList[i].zones.length) && !found; j++){
					//var zone = $scope.getLocalZoneById(streets[i].zones[j]);
					//myZones.push(zone);
					if(occStreetList[i].zones[j] == z_id){
						found = true;
						streetsInZone += 1;
						if(occStreetList[i].occupancyRate > -1){
							totalOccupancy += occStreetList[i].occupancyRate;
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
	
	// Method getStreetsInAreaOccupancy: used to get the occupancy of the streets in a specific area
	this.getStreetsInAreaOccupancy = function(a_id, occStreetList){
		var totalOccupancy = 0;
		var streetsInArea = 0;
		var noData = true;
		if(occStreetList != null && occStreetList.length > 0){
			//var found = false;
			for(var i = 0; i < occStreetList.length; i++){// && !found
				if(occStreetList[i].rateAreaId == a_id){
					//found = true;
					streetsInArea += 1;
					if(occStreetList[i].occupancyRate > 0){
						totalOccupancy += occStreetList[i].occupancyRate;
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
	
	// Method getPmsInZoneProfit: used to get the parking meter profit data from a specific zone
	this.getPmsInZoneProfit = function(z_id, profitPmList){
		var totalProfit = 0;
		var totalTickets = 0;
		var pmsInZone = 0;
		var myPms = [];
		if(profitPmList != null && profitPmList.length > 0){			// map page case
			for(var i = 0; i < profitPmList.length; i++){
				var found = false;
				// all zone case
				if(profitPmList[i].zones){
					for(var j = 0; (j < profitPmList[i].zones.length && !found); j++){ 
						if(profitPmList[i].zones[j] == z_id){
							found = true;
							pmsInZone += 1;
							if(!this.checkIfAlreadyPresentInList(myPms, profitPmList[i].id)){
								myPms.push(profitPmList[i].id);
							}
						}
					}
				}
			}
		}
		if(myPms.length > 0){
			var totalProfitData = this.getTotalProfitFromPmList(myPms, profitPmList);
			totalProfit = totalProfitData[0];
			totalTickets = totalProfitData[1];
		}
		if(totalProfit > 0){
			return [totalProfit, totalTickets, pmsInZone]; // / streetsInZone;
		} else {
			return [-1, -1, pmsInZone];
		}
	};
	
	// Method loadStreetsFromZone: used to load all streets contained in a zone
    this.loadStreetsFromZone = function(z_id, streetList){
		var z_streets = [];
		if(streetList != null && streetList.length > 0){
			for(var i = 0; i < streetList.length; i++){
				var found = false;
				for(var j = 0; (j < streetList[i].zones.length) && !found; j++){
					if(streetList[i].zones[j] == z_id){
						found = true;
						z_streets.push(streetList[i]);
					}
				}
			}
		}
		return z_streets;
	};
	
	// Method getPaidSlotsInZone: used to count the total slots of a zone from the slots in streets
	this.getPaidSlotsInZone = function(z_id, streetList){
		var totalSlots = 0;
		if(streetList != null && streetList.length > 0){
			for(var i = 0; i < streetList.length; i++){
				var found = false;
				for(var j = 0; (j < streetList[i].zones.length) && !found; j++){
					if(streetList[i].zones[j] == z_id){
						found = true;
						var mystreet = this.cleanStreetNullValue(streetList[i]);// NB: I have to use the average occupancy value and not the data stored in db
						totalSlots += mystreet.paidSlotNumber;
						
					}
				}
			}
		}
		return totalSlots;
	};	
	
	// Method checkIfAlreadyPresentInList: used to check if an element is already present in a list
	this.checkIfAlreadyPresentInList = function(list, element){
		var found = false;
		for(var i = 0; ((i < list.lenght) && !found); i++){
			if(list[i] == element){
				found = true;
			}
		}
		return found;
	};
	
	// Method cleanAreaId : used to get the correct areaId from a composed areaMap object id ( with "_")
	this.cleanAreaId = function(id){
		var indexUnderScore = id.indexOf("_");
		if( indexUnderScore > -1){
			return (id.substring(0, indexUnderScore));
		}
		return id;
	};
	
	// Method getCorrectZoneType: used to get the correct type from a zone
	this.getCorrectZoneType = function(type){
		var corrType = null;
		var types = this.getZoneTypeList();
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
	
	// Method getLocalPmByCode: used to retrieve the parking meter data from the code
	this.getLocalPmByCode = function(code){
		var find = false;
		var myPms = this.getSharedLocalPms();
		for(var i = 0; i < myPms.length && !find; i++){
			var pmCodeString = String(myPms[i].code);
			if(pmCodeString.localeCompare(code) == 0){
				find = true;
				return myPms[i];
			}
		}
	};
	
	// Method getLocalPmById: used to retrieve the parking meter data from the id
	this.getLocalPmById = function(objId){
		var find = false;
		var myPms = this.getSharedLocalPms();
		for(var i = 0; i < myPms.length && !find; i++){
			var pmIdString = String(myPms[i].id);
			if(pmIdString.localeCompare(objId) == 0){
				find = true;
				return myPms[i];
			}
		}
		return null;
	};
	
	// Method getStreetsInZoneProfit: used to retrieve the profit data from the streets that compose a zone
	this.getStreetsInZoneProfit = function(z_id, profitStreetList, profitStreetDataList, profitPMs){
		var totalProfit = 0;
		var totalTickets = 0;
		var streetsInZone = 0;
		var myPms = [];
		if(profitStreetList != null && profitStreetList.length > 0){			// map page case
			for(var i = 0; i < profitStreetList.length; i++){
				var found = false;
				// all zones case
				for(var j = 0; (j < profitStreetList[i].zones.length && !found); j++){ 
					if(profitStreetList[i].zones[j] == z_id){
						found = true;
						streetsInZone += 1;
						if(profitStreetList[i].parkingMeters != null && profitStreetList[i].parkingMeters.length > 0){
							for(var x = 0; x < profitStreetList[i].parkingMeters.length; x++){
								if(profitStreetList[i].parkingMeters[x] != null){
									if(!this.checkIfAlreadyPresentInList(myPms, profitStreetList[i].parkingMeters[x])){
										myPms.push(profitStreetList[i].parkingMeters[x]);
									}
								}
							}
						}
					}
				}
			}
		} else if(profitStreetDataList != null && profitStreetDataList.length > 0){	// list page case
			for(var i = 0; i < profitStreetDataList.length; i++){
				var found = false;
				if(profitStreetDataList[i].zones != null){
					for(var j = 0; (j < profitStreetDataList[i].zones.length && !found); j++){ 
						if(profitStreetDataList[i].zones[j] == z_id){
							found = true;
							streetsInZone += 1;
							if(profitStreetDataList[i].parkingMeters != null && profitStreetDataList[i].parkingMeters.length > 0){
								for(var x = 0; x < profitStreetDataList[i].parkingMeters.length; x++){
									if(profitStreetDataList[i].parkingMeters[x] != null){
										if(!this.checkIfAlreadyPresentInList(myPms, profitStreetDataList[i].parkingMeters[x])){
											myPms.push(profitStreetDataList[i].parkingMeters[x]);
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
			var totalProfitData = this.getTotalProfitFromPmList(myPms, profitPMs);
			totalProfit = totalProfitData[0];
			totalTickets = totalProfitData[1];
		}
		if(totalProfit > 0){
			return [totalProfit, totalTickets, myPms.length]; //streetsInZone
		} else {
			return [-1, -1, myPms.length];	//streetsInZone
		}
	};
	
	// Method getPMsInAreaProfit: used to get the profit data of the parking meters of a specific area
	this.getPMsInAreaProfit = function(a_id, profitPmList){
		var totalProfit = 0;
		var totalTickets = 0;
		var pmsInArea = 0;
		var noData = true;
		if(profitPmList != null && profitPmList.length > 0){
			//var found = false;
			for(var i = 0; i < profitPmList.length; i++){// && !found
				if(profitPmList[i].areaId == a_id){
					//found = true;
					pmsInArea += 1;
					if(profitPmList[i].profit > 0){
						totalProfit += profitPmList[i].profit;
						noData = false;
					}
					if(profitPmList[i].tickets > 0){
						totalTickets += profitPmList[i].tickets;
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
	
	// Method getTotalProfitFromPmList: used to retrieve the pms objects from the pm ids
	this.getTotalProfitFromPmList = function(list, profitPmList){
		var totalProfit = 0;
		var totalTickets = 0;
		for(var i = 0; i < list.length; i++){
			for(var j = 0; j < profitPmList.length; j++){
				if(list[i] == profitPmList[j].id){
					if(profitPmList[j].profit > 0){
						totalProfit += profitPmList[j].profit;
					}
					if(profitPmList[j].tickets > 0){
						totalTickets += profitPmList[j].tickets;
					}
				}
			}
		}
		return [totalProfit, totalTickets];
	};
	
	// Method getLocarAreaById: used to get LocalArea data from areaId
	this.getLocalAreaById = function(id){
		var find = false;
		var myAreas = this.getSharedLocalAreas();
		for(var i = 0; i < myAreas.length && !find; i++){
			if(myAreas[i].id == id){
				find = true;
				return myAreas[i];
			}
		}
	};
	
	// Method addLabelToZoneObject: used to add a label to the zone object to be used in the relation configuring
    this.addLabelToZoneObject = function(zone){
    	var sub = (zone.submacro) ? zone.submacro : ((zone.submicro) ? zone.submicro : null);
    	var lbl = (sub) ? (zone.name + "_" + sub) : zone.name;
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
    		label: lbl
    	};
    	return corrected_zone;
    };
    
	// used to correct polygon to be saved in db - it is already present in sharedDataService but copied here to avoid circular dependency
	this.correctMyGeometryPolygon = function(geo){
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
    
    // Method getLocaZoneById: used to get the zone list by the id and the z_index
	this.getLocalZoneById = function(id, type, zindex){
		var find = false;
		var corrZone = null;
		var myZones = this.getSharedLocalZones(zindex);
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
							geometry: this.correctMyGeometryPolygon(myZones[i].geometry),
							label: lbl
						};
					}			
				}
			}
		}
		return corrZone;
	};
	
	this.correctMyZonesForStreet = function(zone0, zone1, zone2, zone3, zone4){
		var correctedZones = [];
		if(zone0){
			correctedZones.push(zone0.id);
		}
		if(zone1){
			correctedZones.push(zone1.id);
		}
		if(zone2){
			correctedZones.push(zone2.id);
		}
		if(zone3){
			correctedZones.push(zone3.id);
		}
		if(zone4){
			correctedZones.push(zone4.id);
		}
		return correctedZones;
	};
	
	// Method correctParamsFromSemicolon: used to replace the semicolon with a comma
	this.correctParamsFromSemicolon = function(value){
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
	this.correctParamsFromSemicolonForMonth = function(value){
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
	this.chekIfAllRange = function(arr, type){
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
	
	// correctMyZones: used to correct the zone object with all the necessary data
	/*this.correctMyZones = function(zones){
		var correctedZones = [];
		for(var i = 0; i < zones.length; i++){
			var sub = (zones[i].submacro) ? zones[i].submacro : ((zones[i].submicro) ? zones[i].submicro : null);
			var corrType = this.getCorrectZoneType(zones[i].type);
			var lbl = (sub) ? (zones[i].name + "_" + sub) : zones[i].name;
			var correctZone = {
				id: zones[i].id,
				id_app: zones[i].id_app,
				color: zones[i].color,
				name: zones[i].name,
				submacro: zones[i].submacro,
				submicro: zones[i].submicro,
				type: zones[i].type,
				myType: corrType,
				note: zones[i].note,
				geometry: this.correctMyGeometryPolygon(zones[i].geometry),
				centermap: zones[i].centermap,
				geometryFromSubelement: zones[i].geometryFromSubelement,
				subelements: this.loadStreetsFromZone(zones[i].id),
				label: lbl
			};
			correctedZones.push(correctZone);
		}
		return correctedZones;
	};*/
	
	this.correctMyPmsForStreet = function(pms){
		var correctedPms = [];
		for(var i = 0; i < pms.length; i++){
			if(pms[i].selected){
				correctedPms.push(String(pms[i].id));
			}
		}
		return correctedPms;
	};
	
	this.initIfNull = function(value){
		if(value == null || value == ""){
			value = 0;
		}
		return parseInt(value);
	};
	
	this.configureSlotsForObject = function(sc){
		var myScConf = {
			carSharingSlotNumber: this.initIfNull(sc.carSharingSlotNumber),
			carSharingSlotOccupied: this.initIfNull(sc.carSharingSlotOccupied),
			freeParkSlotNumber: this.initIfNull(sc.freeParkSlotNumber),
			freeParkSlotOccupied: this.initIfNull(sc.freeParkSlotOccupied),
			freeParkSlotSignNumber: this.initIfNull(sc.freeParkSlotSignNumber),
			freeParkSlotSignOccupied: this.initIfNull(sc.freeParkSlotSignNumber),
			handicappedSlotNumber: this.initIfNull(sc.handicappedSlotNumber),
			handicappedSlotOccupied: this.initIfNull(sc.handicappedSlotOccupied),
			loadingUnloadingSlotNumber: this.initIfNull(sc.loadingUnloadingSlotNumber),
			loadingUnloadingSlotOccupied: this.initIfNull(sc.loadingUnloadingSlotOccupied),
			paidSlotNumber: this.initIfNull(sc.paidSlotNumber),
			paidSlotOccupied: this.initIfNull(sc.paidSlotOccupied),
			pinkSlotNumber: this.initIfNull(sc.pinkSlotNumber),
			pinkSlotOccupied: this.initIfNull(sc.pinkSlotOccupied),
			rechargeableSlotNumber: this.initIfNull(sc.rechargeableSlotNumber),
			rechargeableSlotOccupied: this.initIfNull(sc.rechargeableSlotOccupied),
			reservedSlotNumber: this.initIfNull(sc.reservedSlotNumber),
			reservedSlotOccupied: this.initIfNull(sc.reservedSlotOccupied),
			slotNumber: this.initIfNull(sc.slotNumber),
			slotOccupied: this.initIfNull(sc.slotOccupied),
			timedParkSlotNumber: this.initIfNull(sc.timedParkSlotNumber),
			timedParkSlotOccupied: this.initIfNull(sc.timedParkSlotOccupied),
			unusuableSlotNumber: this.initIfNull(sc.unusuableSlotNumber),
			vehicleType: sc.vehicleType,
			vehicleTypeActive: sc.vehicleTypeActive
		};
		return myScConf;
	};
	
	//Used to solve the problem of occupancy update when a street is updated in data management:
	//now I update only the static data (not occupancy)
	this.configureSlotsForObjectNotDynamic = function(sc){
		var myScConf = {
			carSharingSlotNumber: this.initIfNull(sc.carSharingSlotNumber),
			freeParkSlotNumber: this.initIfNull(sc.freeParkSlotNumber),
			freeParkSlotSignNumber: this.initIfNull(sc.freeParkSlotSignNumber),
			handicappedSlotNumber: this.initIfNull(sc.handicappedSlotNumber),
			loadingUnloadingSlotNumber: this.initIfNull(sc.loadingUnloadingSlotNumber),
			paidSlotNumber: this.initIfNull(sc.paidSlotNumber),
			pinkSlotNumber: this.initIfNull(sc.pinkSlotNumber),
			rechargeableSlotNumber: this.initIfNull(sc.rechargeableSlotNumber),
			reservedSlotNumber: this.initIfNull(sc.reservedSlotNumber),
			slotNumber: this.initIfNull(sc.slotNumber),
			timedParkSlotNumber: this.initIfNull(sc.timedParkSlotNumber),
			unusuableSlotNumber: this.initIfNull(sc.unusuableSlotNumber),
			vehicleType: sc.vehicleType,
			vehicleTypeActive: sc.vehicleTypeActive
		};
		return myScConf;
	};
	
	this.getAreaFilter = function(){
		var allAreaFilter = [];
		angular.copy(this.getSharedLocalAreas(), allAreaFilter);
		if(allAreaFilter != null && allAreaFilter.length > 0 && allAreaFilter[0].id != ''){
			allAreaFilter.splice(0,0,{id:'', name: "Tutte"});
		}
		return allAreaFilter;
	};
	
	this.cash_mode = "CASH";
    this.automated_teller_mode = "AUTOMATED_TELLER";
    this.prepaid_card_mode = "PREPAID_CARD";
    this.parcometro = "PARCOMETRO";
	
	this.listaPagamenti = [
	    {
	        idObj: this.cash_mode,
	        descrizione: "Contanti"
	    },
	    {
	        idObj: this.automated_teller_mode,
	        descrizione: "Cassa automatica"
	    },
	    {
	        idObj: this.prepaid_card_mode,
	        descrizione: "Carta prepagata"
	    },
	    {
	        idObj: this.parcometro,
	        descrizione: "Parcometro"
	    }
	];
	
	this.getListaPagamenti = function(){
		return this.listaPagamenti;
	};
	
	this.correctMyPaymentMode = function(myPm){
		var correctedPm = [];
		if(myPm.cash_checked){
			correctedPm.push(this.listaPagamenti[0].idObj);
		}
		if(myPm.automated_teller_checked){
			correctedPm.push(this.listaPagamenti[1].idObj);
		}
		if(myPm.prepaid_card_checked){
			correctedPm.push(this.listaPagamenti[2].idObj);
		}
		if(myPm.parcometro_checked){
			correctedPm.push(this.listaPagamenti[3].idObj);
		}
		return correctedPm;
	};
	
	this.castMyPaymentModeToString = function(myPm){
		var correctedPm = "";
		for(var i = 0; i < myPm.length; i++){
			var stringVal = "";
			switch (myPm[i]){
				case this.cash_mode : 
					stringVal = this.listaPagamenti[0].descrizione;
					break;
				case this.automated_teller_mode: 
					stringVal = this.listaPagamenti[1].descrizione;
					break;
				case this.prepaid_card_mode: 
					stringVal = this.listaPagamenti[2].descrizione;
					break;
				case this.parcometro: 
					stringVal = this.listaPagamenti[3].descrizione;
					break;
				default: break;
			}
			correctedPm = correctedPm + stringVal + ",";
		}
		correctedPm = correctedPm.substring(0, correctedPm.length-1);
		return correctedPm;
	};
	
	this.checkMyPaymentMode = function(paymentMode, myPayment){
		for(var i = 0; i < paymentMode.length; i++){
			switch(paymentMode[i]){
				case this.cash_mode:
					myPayment.cash_checked = true;
					break;
				case this.automated_teller_mode: 
					myPayment.automated_teller_checked = true;
					break;
				case this.prepaid_card_mode: 
					myPayment.prepaid_card_checked = true;
					break;
				case this.parcometro: 
					myPayment.parcometro_checked = true;
					break;
			}
		}
		return myPayment;
	};
	
	//Useful method to redirect to login and show session timeout modal
	this.sessionTimeOutNotifier = function(){
		if(this.getUsedLanguage() == 'ita'){
			$dialogs.notify("Errore sessione scaduta", "La sessione e' scaduta. Verrai riportato alla pagina di login");
		} else {
			$dialogs.notify("Error session expired", "Your session is expired. You will redirect to login page");
		}
		$timeout(function(){ 
			$window.location.href = "/metroparco/error";
		}, 2000);
	};
	
	// ----- End of part for functions shared between controllers  -------------------------------------
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
pm.factory('invokeWSService', function($http, $q, $window, sharedDataService) {
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
				if(typeof data === 'string'){
					if(data.indexOf(sharedDataService.getErrConstant()) != -1){
						sharedDataService.sessionTimeOutNotifier();
					} else {
						deferred.resolve(data);
					}
				} else {
					deferred.resolve(data);
				} 
			}).error(function(data) {
				var status = data.status;
			    if (status == 401) {
			      $window.location = "/metroparco/error";
			      return;
			    }
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params != null){
			$http({
				method : method,
				url : url + funcName,
				params : params,// + '&noCache=' + new Date().getTime(),
				headers : headers,
				data : data
			}).success(function(data) {
				if(data.indexOf(sharedDataService.getErrConstant()) != -1){
					sharedDataService.sessionTimeOutNotifier();
				} else {
					deferred.resolve(data);
				}
			}).error(function(data) {
				var status = data.status;
			    if (status == 401) {
			      window.location = "/login";
			      return;
			    }
				//console.log("Returned data FAIL: " + JSON.stringify(data));
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
				if(typeof data === 'string'){
					if(data.indexOf(sharedDataService.getErrConstant()) != -1){
						sharedDataService.sessionTimeOutNotifier();
					} else {
						deferred.resolve(data);
					}
				} else {
					deferred.resolve(data);
				}
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
				//console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		} else if(method == 'GET' && params != null){
			$http({
				method : method,
				url : url + funcName,
				params : params, // + '&noCache=' + new Date().getTime(),
				headers : headers,
				data : data
			}).success(function(data) {
				//console.log("Returned data ok: " + JSON.stringify(data));
				deferred.resolve(data);
			}).error(function(data) {
				//console.log("Returned data FAIL: " + JSON.stringify(data));
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
				//console.log("Returned data FAIL: " + JSON.stringify(data));
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
pm.factory('invokeDashboardWSService', function($http, $q, sharedDataService) {
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
				if(typeof data === 'string'){
					if(data.indexOf(sharedDataService.getErrConstant()) != -1){
						sharedDataService.sessionTimeOutNotifier();
					} else {
						deferred.resolve(data);
					}
				} else {
					deferred.resolve(data);
				}
			}).error(function(data) {
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
				if(typeof data === 'string'){
					if(data.indexOf(sharedDataService.getErrConstant()) != -1){
						sharedDataService.sessionTimeOutNotifier();
					} else {
						deferred.resolve(data);
					}
				} else {
					deferred.resolve(data);
				}
			}).error(function(data) {
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
				if(typeof data === 'string'){
					if(data.indexOf(sharedDataService.getErrConstant()) != -1){
						sharedDataService.sessionTimeOutNotifier();
					} else {
						deferred.resolve(data);
					}
				} else {
					deferred.resolve(data);
				}
			}).error(function(data) {
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
pm.factory('invokeAuxWSService', function($http, $q, sharedDataService) {
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
				if(typeof data === 'string'){
					if(data.indexOf(sharedDataService.getErrConstant()) != -1){
						sharedDataService.sessionTimeOutNotifier();
					} else {
						deferred.resolve(data);
					}
				} else {
					deferred.resolve(data);
				}
			}).error(function(data) {
				//console.log("Returned data FAIL: " + JSON.stringify(data));
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
				if(typeof data === 'string'){
					if(data.indexOf(sharedDataService.getErrConstant()) != -1){
						sharedDataService.sessionTimeOutNotifier();
					} else {
						deferred.resolve(data);
					}
				} else {
					deferred.resolve(data);
				}
			}).error(function(data) {
				//console.log("Returned data FAIL: " + JSON.stringify(data));
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
				if(typeof data === 'string'){
					if(data.indexOf(sharedDataService.getErrConstant()) != -1){
						sharedDataService.sessionTimeOutNotifier();
					} else {
						deferred.resolve(data);
					}
				} else {
					deferred.resolve(data);
				}
			}).error(function(data) {
				//console.log("Returned data FAIL: " + JSON.stringify(data));
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
pm.factory('invokePdfServiceProxy', function($http, $q, sharedDataService) {
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
			if(typeof data === 'string'){
				if(data.indexOf(sharedDataService.getErrConstant()) != -1){
					sharedDataService.sessionTimeOutNotifier();
				} else {
					deferred.resolve(data);
				}
			} else {
				deferred.resolve(data);
			}
		}).error(function(data) {
			console.log("Returned data FAIL: " + JSON.stringify(data));
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	return {getProxy : getProxy};
});
pm.factory('checkSession', function($http, $q, $interval, invokeDashboardWSService, sharedDataService) {
	//var timeIntervalMillis = 10000;
	
	var checkSessionActive = function(){
		//$interval(function() {
			var method = 'GET';
			var myDataPromise = invokeDashboardWSService.getProxy(method, "session", null, sharedDataService.getAuthHeaders(), null);
			myDataPromise.then(function(result){
				console.log("check session result " + result)
			});
			return myDataPromise;
		//}, timeIntervalMillis);
	};
	
	return {checkSessionActive : checkSessionActive};
});
