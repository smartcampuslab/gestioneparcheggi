'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('MainCtrl',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', '$locale', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService','invokeWSServiceProxy','invokePdfServiceProxy','getMyMessages','$timeout',
    function($scope, $http, $route, $routeParams, $rootScope, localize, $locale, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, invokePdfServiceProxy, getMyMessages, $timeout) {

    //$rootScope.frameOpened = false;
	var cod_ente = "24";
    
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
    //$scope.user_token = token;
    $scope.user_token = "";
                  			
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
    	var myDataMsg = getMyMessages.promiseToHaveData('eng');
    	myDataMsg.then(function(result){
    		sharedDataService.inithializeAllMessages(result);
    	});
    };
    
    $scope.setItalianLanguage = function(){
    	$scope.used_lang = "i18n/angular-locale_it-IT.js";
    	itaLanguage = "active";
    	engLanguage = "";
    	//$scope.setUserLocale("it-IT");
    	//$locale.id = "it-IT";
    	localize.setLanguage('it-IT');
    	sharedDataService.setUsedLanguage('ita');
    	var myDataMsg = getMyMessages.promiseToHaveData('ita');
    	myDataMsg.then(function(result){
    	    sharedDataService.inithializeAllMessages(result);
    	});
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
    var home = "active";
    var editingPark = "";
    var editingBike = "";
    var viewingAll = "";
    
    $scope.option = {
    		
    };
        
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
    	editingPark = "";
    	editingBike = "";
    	viewingAll = "";
        //window.document.location = "./";
        $scope.showHome();
    };
    
    $scope.setEditingParkActive = function(){
    	home = "";
        editingPark = "active";
        editingBike = "";
        viewingAll = "";
    };
    
    $scope.isEditingParkActive = function(){
        return editingPark;
    };
    
    $scope.setEditingBikeActive = function(){
    	home = "";
        editingPark = "";
        editingBike = "active";
        viewingAll = "";
    };
    
    $scope.isEditingBikeActive = function(){
        return editingBike;
    };
    
    $scope.setViewAllActive = function(){
    	home = "";
        editingPark = "";
        editingBike = "";
        viewingAll = "active";
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
        token = null;
        userId = null;
        user_name = null;
        user_surname = null;
        
    	window.location.href = "myweb/logout";
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
    //sharedDataService.setName(user_name);
    //sharedDataService.setSurname(user_surname);
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
    
    // ----------------- Practice sections ----------------
    
    $scope.setLoadingPractice = function(value){
    	$scope.isLoadingPractice = value;
    };
    
    // Method that read the list of the practices from the ws of infoTn
    $scope.getPracticesWS = function() {
    	$scope.setHListTabs();
    	//window.location.reload(true);	// To force the page refresh - this goes in a loop
    	$scope.setLoadingPractice(true);
    	var method = 'GET';
    	var params = {
			idEnte:"24",
			userIdentity: $scope.userCF
		};
    	var myDataPromise = invokeWSServiceProxy.getProxy(method, "RicercaPratiche", params, $scope.authHeaders, null);
    	myDataPromise.then(function(result){
    		$scope.practicesWS = result.domanda;
    		//console.log("Pratiche recuperate da ws: " + $scope.practicesWS);
    		$scope.getPracticesMyWeb();
    		//$scope.setLoadingPractice(false);
    	});
    };
    
    // Method that read the list of the practices from the local mongo DB
    $scope.getPracticesMyWeb = function() {
    	//$scope.setLoadingPractice(true);
    	var method = 'GET';
    	var params = {
			userIdentity: $scope.userCF
		};
    	var myDataPromise = invokeWSServiceProxy.getProxy(method, "GetPraticheMyWeb", params, $scope.authHeaders, null);
    	myDataPromise.then(function(result){
    		$scope.practicesMy = result;
    		//console.log("Pratiche recuperate da myweb: " + $scope.practicesMy);
    		//$scope.mergePracticesData($scope.practicesWS, $scope.practicesMy, null);
    		$scope.getPracticesWSNoOnline();
    		//$scope.setLoadingPractice(false);
    	});
    };
    
 // Method that read the list of the practices from the ws of infoTn
    $scope.getPracticesWSNoOnline = function() {
    	//window.location.reload(true);	// To force the page refresh - this goes in a loop
    	//$scope.setLoadingPractice(true);
    	var method = 'GET';
    	var params = {
			idEnte:"24",
			userIdentity: $scope.userCF,
			online: false
		};
    	var myDataPromise = invokeWSServiceProxy.getProxy(method, "RicercaPratiche", params, $scope.authHeaders, null);
    	myDataPromise.then(function(result){
    		$scope.practicesWSNO = result.domanda;
    		//console.log("Pratiche recuperate da ws: " + $scope.practicesWS);
    		//$scope.getPracticesMyWeb();
    		$scope.mergePracticesData($scope.practicesWS, $scope.practicesMy, $scope.practicesWSNO);
    	});
    };
    
    // Method that add the correct status value to every practice in list
    // It merge the value from two lists: practices from ws and practices from local mongo
    $scope.mergePracticesData = function(practiceListWs, practiceListMy, practiceListWsNoOnline){
    	$scope.practicesOldEF = [];
    	var now = new Date();
    	var nowMillis = now.getTime();
    	if(practiceListWs != null){
	    	for(var i = 0; i < practiceListWs.length; i++){
	    		var millisCloseDate = practiceListWs[i].edizioneFinanziata.edizione.dataChiusura;
	    		var millisCloseDateWithSixMonths = Number(millisCloseDate) + sharedDataService.getOneMonthMillis() * 6;
       			if(millisCloseDateWithSixMonths > nowMillis){
		    		for(var j = 0; j < practiceListMy.length; j++){
		    			if(practiceListWs[i].idObj == practiceListMy[j].idDomanda){
		    				practiceListWs[i].online = true;
		    				practiceListWs[i].myStatus = practiceListMy[j].status;
		    				practiceListWs[i].showPdf = (practiceListMy[j].autocertificazione != null && practiceListMy[j].autocertificazione != "") ? true : false;
		    				if(practiceListMy[j].status == 'ACCETTATA'){
		    					$scope.practicesWSM.push(practiceListWs[i]);
		    				}
		    				break;
		    			}
		    		}
       			} else {
       				// Here I save the data in the list for old financial edition
       				for(var j = 0; j < practiceListMy.length; j++){
		    			if(practiceListWs[i].idObj == practiceListMy[j].idDomanda){
		    				practiceListWs[i].online = true;
		    				practiceListWs[i].myStatus = practiceListMy[j].status;
		    				practiceListWs[i].showPdf = (practiceListMy[j].autocertificazione != null && practiceListMy[j].autocertificazione != "") ? true : false;
		    				if(practiceListMy[j].status == 'ACCETTATA'){
		    					$scope.practicesOldEF.push(practiceListWs[i]);
		    				}
		    				break;
		    			}
		    		}
       				// Here I save the data in the list for old financial edition
       				//$scope.practicesOldEF.push(practiceListWs[i]);
       			}
	    	}
    	}
    	if(practiceListWsNoOnline != null){
	    	for(var i = 0; i < practiceListWsNoOnline.length; i++){
	    		var millisCloseDate = practiceListWsNoOnline[i].edizioneFinanziata.edizione.dataChiusura;
	    		var millisCloseDateWithSixMonths = Number(millisCloseDate) + sharedDataService.getOneMonthMillis() * 6;
       			if(millisCloseDateWithSixMonths > nowMillis){
       				practiceListWsNoOnline[i].online = false;
       				practiceListWsNoOnline[i].myStatus = 'ACCETTATA';
       				practiceListWsNoOnline[i].showPdf = false;
       				$scope.practicesWSM.push(practiceListWsNoOnline[i]);
       			} else {
       				// Here I save the data in the list for old financial edition
       				practiceListWsNoOnline[i].online = false;
       				practiceListWsNoOnline[i].myStatus = 'ACCETTATA';
           			practiceListWsNoOnline[i].showPdf = false;
           			$scope.practicesOldEF.push(practiceListWsNoOnline[i]);
       			}
	    	}
    	}
    	
    	$scope.setLoadingPractice(false);
    	
    	// I consider only the practices that has been accepted
    	//$scope.practicesWSM = practiceListWs;
    };
    
    // ------------------------- Block that manage the tab switching (in practice home list) ---------------------------
    $scope.setHListTabs = function(){
        $scope.setHListIndex(0);
        //$scope.setFrameOpened(true);
    };
            
    $scope.hListTabs = [ 
        { title:'Pratiche Recenti', index: 1, content:"partials/list/recent.html" },
        { title:'Scorse Edizioni', index: 2, content:"partials/list/old_ef.html" }, //, disabled:true
        { title:'', index: 3, content:"partials/list/practice_state.html", disabled:true }
    ];
            
    // Method nextTab to switch the input forms to the next tab and to call the correct functions
    $scope.nextHListTab = function(value, type, param1, param2, param3, param4){
       	switch(type){
       		case 1: $scope.setFrameOpened(false);
       			$scope.stampaScheda(value, 0);	
       			$scope.fromHList = 1;
       			break;
       		case 2: $scope.setFrameOpened(false);
       			$scope.stampaScheda(value, 0);
       			$scope.fromHList = 2;
   				break;	
       		default:
       			break;
        }
        // After the end of all operations the tab is swithced
        $scope.hListTabs[$scope.tabHListIndex].active = false;	// deactive actual tab
        $scope.tabHListIndex = 2;								// increment tab index
        $scope.hListTabs[$scope.tabHListIndex].title = "Dettagli";
        $scope.hListTabs[$scope.tabHListIndex].active = true;	// active new tab
        $scope.hListTabs[$scope.tabHListIndex].disabled = false;
    };
            
    $scope.prevHListTab = function(type){
    	$scope.hListTabs[$scope.tabHListIndex].title = "";
    	$scope.hListTabs[$scope.tabHListIndex].active = false;	// deactive actual tab
    	$scope.hListTabs[$scope.tabHListIndex].disabled = true;
    	$scope.tabHListIndex = type - 1;
    	$scope.hListTabs[$scope.tabHListIndex].active = true;	// active new tab
    };
            
    $scope.setHListIndex = function($index){
       	$scope.tabHListIndex = $index;
       	if($index != 2){ 						// I have to deactive and hide the last tab (details)
       		$scope.hListTabs[2].title = "";
       		$scope.hListTabs[2].active = false;	// deactive actual tab
        	$scope.hListTabs[2].disabled = true;
       	}
    };
    
    // ----------------------- End of Block that manage the tab switching (in practice home list) ----------------------
    
    $scope.progress = 0;
    var msgs = [
       	'Ricerca dati pratica...',
       	'Caricamento dati pratica...',
       	'Creazione file pdf...',
       	'Stampa file'
    ];
    var i_m = 0;
    
    $scope.stampaPDF = function(idPratica){
    	i_m = 0;
    	$scope.progress = 25;
    	//$scope.setLoadingPractice(true);
    	$dialogs.wait(msgs[i_m++],$scope.progress);
    	$scope.getElenchi(idPratica, 1);
    	//$scope.openDoc("pdf/scheda_2991127119775409315.pdf");
    };
    
    // Used to set the componenti object value
    $scope.setComponenti = function(value){
       	$scope.componenti = value;
    };
    
    $scope.sep = {};
    $scope.strutturaRec = {};
    $scope.strutturaRec2 = {};
    $scope.struttureRec = [];
    $scope.storicoResidenza = [];
    $scope.componenteMaxResidenza = "";
    $scope.componenteMaxResidenza_Obj = {};
    $scope.componenteAIRE = "";
    $scope.residenzaAnni = 0;
    $scope.aireAnni = 0;
    $scope.compRecStructTot1 = 0;
    $scope.compRecStructTot2 = 0;
    $scope.textColorTotRes = "";
    
    $scope.setStrutturaRec = function(value){
       	$scope.strutturaRec = value;	// c'era un errore! Era -> $scope.setStrutturaRec = value;
    };
    
    // Method used to print the practice data on a json object
    $scope.stampaScheda = function(idPratica, type){
      	$scope.setLoadingPractice(true);
            	
       	var stampaScheda = {
           	userIdentity: $scope.userCF,
           	idDomanda: idPratica
        };
            	
      	var value = JSON.stringify(stampaScheda);
        	if($scope.showLog) console.log("Dati scheda domanda : " + value);
            	
           	var method = 'POST';
           	var myDataPromise = invokeWSServiceProxy.getProxy(method, "StampaJSON", null, $scope.authHeaders, value);	

           	myDataPromise.then(function(result){
           	if(result != null && result != ""){	// I have to check if it is correct
	       		$scope.scheda = result.domanda.assegnazioneAlloggio;
	       		$scope.punteggi = result.domanda.dati_punteggi_domanda.punteggi;
	       		$scope.punteggiTotali = $scope.cleanTotal(result.domanda.dati_punteggi_domanda.punteggi.punteggio_totale.totale_PUNTEGGIO.dettaglio.calcolo); //$scope.cleanTotal() + ",00"
	       		$scope.getElenchi(idPratica, type);
	       		//$scope.setLoadingPractice(false);
        	} else {
        		$scope.setLoadingPractice(false);
        		$dialogs.error(sharedDataService.getMsgErrPracticeViewJson());
        	}
       	});
    };
    
    // Method to obtain the Practice data by the id of the request
    // Params: idDomanda -> object id of the practice; type -> call mode of the function (1 standard, 2 edit mode, 3 view mode, 4 cons mode)
    $scope.getPracticeData = function(idDomanda, type) {
          
       	var method = 'GET';
       	var params = {
       		idDomanda:idDomanda,
       		idEnte:cod_ente,
       		userIdentity: $scope.userCF
       	};
          	
       	var myDataPromise = invokeWSServiceProxy.getProxy(method, "GetDatiPratica", params, $scope.authHeaders, null);	
       	myDataPromise.then(function(result){
            if(result.esito == 'OK'){
        	    $scope.practice = result.domanda;
        	    		
        	    // split practice data into differents objects
        	    $scope.extracomunitariType = $scope.practice.extracomunitariType;
        	    $scope.residenzaType = $scope.practice.residenzaType;    
        	    $scope.nucleo = $scope.practice.nucleo;
        	    $scope.setComponenti($scope.nucleo.componente);
        	    $scope.setPhone($scope.nucleo.componente);
           		// View mode
        	    if(type == 1){
        	    	$scope.progress += 25;
        	    	$rootScope.$broadcast('dialogs.wait.progress',{msg: msgs[i_m++],'progress': $scope.progress});
        	    }
        	    $scope.getAutocertificationData(idDomanda, type);
        	    $scope.indicatoreEco = $scope.nucleo.indicatoreEconomico;
        	} else {
            	$scope.setLoading(false);
            	$dialogs.error(result.error);
            }
        });        	
    };
    
    // Method used to store the user phone in a scope variable
    $scope.setPhone = function(nucleo){
    	for(var i = 0; i < nucleo.length; i++){
    		if(nucleo[i].richiedente){
    			$scope.userPhone = nucleo[i].variazioniComponente.telefono;
    		}
    	}
    };
    
    // Method used to load the autocertification data from the myweb local db
    // Params: idDomanda -> practice object id; type -> call mode of the function. If 0 only init the autocert params (edit mode), if 1 the method call the payPratica method, if 2 the method init the autocert params (view mode)
    $scope.getAutocertificationData = function(idDomanda, type){
    	
    	$scope.storicoResidenza = [];
    	$scope.sep = {};
    	$scope.separationType = "";
    	$scope.struttureRec = [];
    	
    	var autocert_ok = {
    		history_struts : false,
    		history_res : false,
    		trib : false
    	};
    	
    	var method = 'GET';
       	var params = {
       		idDomanda:idDomanda,
       		userIdentity: $scope.userCF
       	};
          	
       	var myDataPromise = invokeWSServiceProxy.getProxy(method, "GetPraticaMyWeb", params, $scope.authHeaders, null);	
       	myDataPromise.then(function(result){
            if((result != null) && (result.autocertificazione != null)){
            	if(type == 0){
	        	    // Here i read and save the autocertification data and inithialize this three objects
	        	    // ---------------------- Rec struct section -------------------
	        	    var structs = result.autocertificazione.componenti;
	        	    if(structs.length > 0){
	        	    	autocert_ok.history_struts = true;
	        	    }
	        	    var struct = {};
	        	    var index = 0;
	        	    for(var i = 0; i < structs.length; i++){
	        	    	var tot = 0;
	        	    	for(var j = 0; j < structs[i].strutture.length; j++){
	        	    		var from = structs[i].strutture[j].dal;
	        	    		var to = structs[i].strutture[j].al;
	        	    		var nameStruct = structs[i].strutture[j].nome;
	        	    		var nameAndPlace = nameStruct.split(" (");
	        	    		var distance = $scope.getDifferenceBetweenDates(from, to);
		        	    	struct = {
		        	    		id : index,
		        	    		structName : nameAndPlace[0],
		        	    		structPlace : nameAndPlace[1].replace(")",""),
		        	    		dataDa : from,
		        	    		dataA: to,
		        	    		distance: distance,
		        	    		componenteName: structs[i].nominativo
		        	    	};
		        	    	tot += distance;
		        	    	$scope.struttureRec.push(struct);
		        	    	index++;
	        	    	}
	        	    	if(i == 0){
	        	    		$scope.setResInStructComp1(tot);
	        	    		$scope.strutturaRec.componenteName = structs[i].nominativo;
	        	    	} else {
	        	    		$scope.setResInStructComp2(tot);
	        	    		$scope.strutturaRec2.componenteName = structs[i].nominativo;
	        	    	}
	        	    }
	            	// -------------------------------------------------------------
	            	
	            	// ---------------------- Res years section --------------------
	            	$scope.componenteMaxResidenza = result.autocertificazione.componenteMaggiorResidenza;
	    			var componentData = $scope.getComponentsDataByName($scope.componenteMaxResidenza);
	    			if(componentData != null && componentData != {}){
	    				$scope.componenteMaxResidenza_Obj = angular.copy(componentData);
	    			}
	    			
	            	var periods = result.autocertificazione.periodiResidenza;
	            	if(periods.length > 0){
	        	    	autocert_ok.history_res = true;
	        	    }
	            	var period = {};
	            	for(var i = 0; i < periods.length; i++){
	            		if(periods[i].comune != null && periods[i].al != null){
	            			var da = "";
	            			var a = "";
	            			if(periods[i].dal == null || periods[i].dal == ""){
	            				// here I have to find the "componenteMaxResidenza" date of birth
	            				da = new Date(componentData.persona.dataNascita);
	            				da = $scope.correctDateIt(da);
	            			} else {
	            				da = periods[i].dal;
	            			}
	            			a = periods[i].al;
	            		
	            			period = {
	            				id: i,	
	            				idComuneResidenza: $scope.getIdByComuneDesc(periods[i].comune),
	            				dataDa: da,
	            				dataA: a,
	            				isAire: periods[i].aire,
	            				difference: $scope.getDifferenceBetweenDates(da, a)
	            			};
	            			$scope.storicoResidenza.push(period);
	            		}
	            	}
	            	$scope.calcolaStoricoRes(componentData);
	            	// -------------------------------------------------------------
	            	
				    // --------------------- Sep get section -----------------------
	            	var t_cons = result.autocertificazione.tribunaleConsensuale;
	            	var t_jud = result.autocertificazione.tribunaleGiudiziale;
	            	var t_tmp = result.autocertificazione.tribunaleTemporaneo;
				    if(t_cons != null && t_cons != ""){
				    	$scope.separationType = 'consensual';
				    	$scope.sep.consensual = {};
				    	var data = {
				    			data : result.autocertificazione.dataConsensuale,
				    			trib : result.autocertificazione.tribunaleConsensuale
				    	};
				    	$scope.sep.consensual = data;
				    } else if(t_jud != null && t_jud != ""){
				    	$scope.separationType = 'judicial';
				    	$scope.sep.judicial = {};
				    	var data = {
				    			data : result.autocertificazione.dataGiudiziale,
				    			trib : result.autocertificazione.tribunaleGiudiziale
				    	};
				    	$scope.sep.judicial = data;
				    } else if(t_tmp != null && t_tmp != ""){
				    	$scope.separationType = 'tmp';
				    	$scope.sep.tmp = {};
				    	var data = {
				    			data : result.autocertificazione.dataTemporaneo,
				    			trib : result.autocertificazione.tribunaleTemporaneo
				    	};
				    	$scope.sep.tmp = data;
				    	
				    } else {
				    	$scope.separationType = "nothing";
				    	$scope.sep = {};
				    }
				    if($scope.sep != null){
				    	autocert_ok.trib = true;
				    }
            	} else {
            		$scope.progress += 25;
            		$rootScope.$broadcast('dialogs.wait.progress',{msg: msgs[i_m++],'progress': $scope.progress});
            		var autocertificazione = result.autocertificazione;
            		$scope.getSchedaPDF(autocertificazione);
            	}
				// ------------------------------------------------------------
				$scope.setLoadingPractice(false);
	        } else {
	        	if(type == 1){
	        		$scope.progress = 100;
	            	$rootScope.$broadcast('dialogs.wait.complete');
	            	$dialogs.notify(sharedDataService.getMsgTextAttention(), sharedDataService.getMsgErrPracticeViewPdf());
	        	}
			    $scope.setLoadingPractice(false);
	        }	
        });
    };
    
    // Method to full the "elenchi" used in the app
    $scope.getElenchi = function(idPratica, type) {
            	
       	var tmp_ambiti = sharedDataService.getStaticAmbiti();
       	var tmp_comuni = sharedDataService.getStaticComuni();
       	//var tmp_edizioni = sharedDataService.getStaticEdizioni();
            	
       	var method = 'GET';
       	var params = {
    		idEnte:cod_ente,
    		userIdentity: $scope.userCF
    	};
            	
       	if((tmp_ambiti == null && tmp_comuni == null) || (tmp_ambiti.length == 0 && tmp_comuni.length == 0)){
        	var myDataPromise = invokeWSServiceProxy.getProxy(method, "Elenchi", params, $scope.authHeaders, null);
        	myDataPromise.then(function(result){
        		sharedDataService.setStaticAmbiti(result.ambitiTerritoriali);
        		sharedDataService.setStaticComuni(result.comuni);
            	//listaEdizioniFinanziate = result.edizioniFinanziate;
        		sharedDataService.setStaticEdizioni(result.edizioniFinanziate);
            	// the first time I use the portal the lists are initialized
            	$scope.listaComuni = result.comuni;
        		$scope.listaComuniVallagarina = $scope.getOnlyComunity(result.comuni);
        		$scope.listaAmbiti = result.ambitiTerritoriali;
        		$scope.getPracticeData(idPratica, type);
        	});
       	} else {
       		$scope.listaComuni = sharedDataService.getStaticComuni();
       		$scope.listaComuniVallagarina = $scope.getOnlyComunity(sharedDataService.getStaticComuni());
       		$scope.listaAmbiti = sharedDataService.getStaticAmbiti();
       		$scope.getPracticeData(idPratica, type);
       	}
       	
    };
    
 // method to obtain the link to the pdf of the practice
    $scope.getSchedaPDF = function(autocert){
            	
        var getPDF = {
        	domandaInfo : {
        		idDomanda: $scope.practice.idObj,	
               	userIdentity: $scope.userCF,
               	version : $scope.practice.versione
        	},
        	autocertificazione : autocert
        };      	
            	
        var value = JSON.stringify(getPDF);
        if($scope.showLog) console.log("Dati richiesta PDF : " + value);
           	
        var method = 'POST';
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "GetPDF", null, $scope.authHeaders, value);	

        myDataPromise.then(function(result){
        	if(result.error != null){
        		var message = JSON.stringify(result.error);
        		if(message.indexOf("ALC-") != -1){ // to solve bug pdf conversion in infoTN JB
        			$dialogs.notify(sharedDataService.getMsgTextAttention(), sharedDataService.getMsgErrPracticeViewPdf());
        		} else {
        			message = message.replace("è", "e'");
        			$dialogs.notify(sharedDataService.getMsgTextAttention(), message);
        		}
        		$scope.setLoadingPractice(false);
        	} else if(result.exception != null){
        		var message = JSON.stringify(result.exception);
        		if(message.indexOf("ALC-") != -1){ // to solve bug pdf conversion in infoTN JB
        			$dialogs.notify(sharedDataService.getMsgTextAttention(), sharedDataService.getMsgErrPracticeViewPdf());
        		} else {
        			message = message.replace("è", "e'");
        			$dialogs.notify(sharedDataService.getMsgTextAttention(), message);
        		}
        		$scope.setLoadingPractice(false);
        	} else {
        		$scope.progress += 25;
        		$rootScope.$broadcast('dialogs.wait.progress',{msg: msgs[i_m++],'progress': $scope.progress});
            	$scope.createPdf(result);			
        	    $scope.setLoadingPractice(false);
            }
        });
    };
    
    $scope.openDoc = function(value){
    	window.open(value);
    };
    
    $scope.createPdf = function(data){
    	var method = 'POST';
        var myDataPromise = invokePdfServiceProxy.getProxy(method, "rest/pdf", null, $scope.authHeaders, data);	
            	
        myDataPromise.then(function(result){
        	$scope.progress = 100;
        	$rootScope.$broadcast('dialogs.wait.complete');
        	var filePdf = "pdf/" + result;
        	$scope.openDoc(filePdf);
        	
        	// Here I have to whait some times and then I remove the file
//        	for(var i= 0; i < 2000; i++){
//        		if(i%100 == 0){
//        			if($scope.showLog);
//        		}
//        	}
        	var timeout = $timeout(function() {$scope.deletePdf(filePdf);}, 5000);
	    });
    }; 
    
    $scope.deletePdf = function(name){
    	var res = name.split("/");
    	var last = res.length - 1;
    	if($scope.showLog) console.log("File to delete : " + res[last]);
    	var params = {
    		filename:res[last]
    	};
    	var method = 'DELETE';
        var myDataPromise = invokePdfServiceProxy.getProxy(method, "rest/pdf", params, $scope.authHeaders, null);
            	
        myDataPromise.then(function(result){
        	if(result){
        		if($scope.showLog) console.log("Cancellazione file " + name + " OK");
        	} else {
        		if($scope.showLog) console.log("Errore cancellazione file " + name + " OK");
        	}
        });
    };
    
    $scope.calcolaStoricoRes = function(ft_component){
       	$scope.showNoStoricoMessage = false;			 // I use this variable in the editing of a component: when I add a storicoResidenza I have to set to False
       	var totMillis = 0;
       	var totMillisInYear = sharedDataService.getOneYearMillis(); //1000 * 60 * 60 * 24 * 360; // I consider an year of 360 days (12 month of 30 days)
       	for(var i = 0; i < $scope.storicoResidenza.length; i++){
       		totMillis += $scope.storicoResidenza[i].difference;
       	}
       	var anniRes = totMillis/totMillisInYear;
       	$scope.setAnni(Math.floor(anniRes), ft_component, 1);
      	//$scope.setSRFormVisible(false);
    };
            
    $scope.setErrorMessageStoricoRes = function(value){
      	$scope.errorsMessageStoricoRes = value;
    };
            
    // Method setAnni: used with param type == 1 -> to update "anniResidenza";
    // 				   used with param type == 2 -> to update "anniLavoro";	
    //				   used with param type == 3 -> to update "anniAIRE";
    $scope.setAnni = function(value, ft_component, type){
      	// find the righ componente in $scope.componenti
      	for(var i = 0; i < $scope.componenti.length; i++){
       		if($scope.componenti[i].idObj == ft_component.idObj){
       			if(type == 1){
       				$scope.componenti[i].variazioniComponente.anniResidenza = value;
      				$scope.componenteMaxResidenza = $scope.componenti[i].persona.cognome  + ", " + $scope.componenti[i].persona.nome;
       				$scope.componenteMaxResidenza_Obj = angular.copy($scope.componenti[i]);
       				$scope.residenzaAnni = value;
       			} else if(type == 2){
       				$scope.componenti[i].variazioniComponente.anniLavoro = value;
      			} else {
       				$scope.componenti[i].variazioniComponente.anniAire = value;
       				$scope.componenteAIRE = $scope.componenti[i].persona.cognome  + ", " + $scope.componenti[i].persona.nome;
       				$scope.aireAnni = value;
       			}
       		}
       	}
    };
    
    $scope.setResInStructComp1 = function(tot){
    	$scope.compRecStructTot1 = tot;
    };
    
    $scope.setResInStructComp2 = function(tot){
    	$scope.compRecStructTot2 = tot;
    };
    
    $scope.getOnlyComunity = function(list){
       	var correctList = [];
      	var vallagarinaList = sharedDataService.getVallagarinaMunicipality();
       	if(list != null && list.length > 0){
       		for(var i = 0; i < list.length; i++){
       			for(var y = 0; y < vallagarinaList.length; y++){
        			if(list[i].descrizione == vallagarinaList[y]){
        				correctList.push(list[i]);
        	    		break;
        	    	}
            	}
            }
        }
        return correctList;
    };
    
    // Method to get the "comune" description by the id
    $scope.getComuneById = function(id, type){
    	if(id != null){
      		var description = "";
       		if(type == 1 || type == 2){
       		if($scope.listaComuni != null){
       			var found;
        			if(type == 1){
        				found = $filter('idToMunicipality')($scope.listaComuni, id);
        			} else {
        				found = $filter('idToDescComune')(id, $scope.listaComuni);
        			} 
        			if(found != null){
        				description = found.descrizione;
        			}
        		}
       		}
       		if(type == 3){
       			if($scope.listaAmbiti != null){
       				var found;
        	    	found = $filter('idToDescComune')(id, $scope.listaAmbiti);
        	    	if(found != null){
        	    		description = found.descrizione;
        	    	}
        	   	}
            }
            //$scope.comuneById = description;
            return description;
        } else {
        	//$scope.comuneById = "";
        	return "";
        }
    };
    
    // Method to get the "idObj" of a "comune" by the description
    $scope.getIdByComuneDesc = function(desc){
    	var idObj = "";
    	if($scope.listaComuni != null && $scope.listaComuni.length > 0){
	    	var found = $filter('descComuneToId')(desc, $scope.listaComuni);
	    	if(found != null){
	    		idObj = found.idObj;
	    	}
    	}
    	return idObj;
    };
    
    // Method to correct the decimal value showed in json object
    $scope.cleanTotal = function(value){
        var str = value;
        str = str.substring(0,str.length-3); //to remove the ",00"
        str = str.replace(".", "");
        var num = parseFloat(str);
        var correct = num/100;
        correct = correct.toFixed(2);
        str = correct.toString();
        str = str.replace(".", ",");
        return str;
    };
    
    // Method used to get the data from a component having the name - surname string
    $scope.getComponentsDataByName = function(name){
    	var nameSurname = name.split(", ");
    	var maxResSurname = nameSurname[0];
    	var maxResName = nameSurname[1];
    	var componentData = {};
    	
    	for(var i = 0; i < $scope.componenti.length; i++){
    		if(($scope.componenti[i].persona.cognome == maxResSurname) && ($scope.componenti[i].persona.nome == maxResName)){
    			componentData = angular.copy($scope.componenti[i]);
    		}
       	}
    	
    	return componentData;
    };
    
    // Method used to find the distance in milliseconds between two dates
    $scope.getDifferenceBetweenDates = function(dataDa, dataA){
    	var dateDa = $scope.correctDate(dataDa);
   		var dateA = $scope.correctDate(dataA);
   		var fromDate = $scope.castToDate(dateDa);
   		var toDate = $scope.castToDate(dateA);
   		if($scope.showLog){
   			console.log("Data da " + fromDate);
   			console.log("Data a " + toDate);
   		}
   		var difference = toDate.getTime() - fromDate.getTime();
   		return difference;
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
            
    $scope.correctDateIt = function(date){
    	if(date != null){
	    	if(date instanceof Date){
	    		// if date is a Date
	    		var correct = "";
	       		var day = date.getDate();
	       		var month = date.getMonth() + 1;
	       		var year = date.getFullYear();
	       		correct = day + "/" + month + "/" + year;
	       		return correct;
	    	} else {
	    		// if date is a String
		       	if(date.indexOf("/") > -1){
		       		return date;
		      	} else {
		        	if(date != null){
		        		var res = date.split("-");
		        		var correct = "";
		        	   	correct=res[2] + "/" + res[1] + "/" + res[0];
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
    
                  			
    // for next and prev in practice list
    $scope.currentPage = 0;
    $scope.currentPageOldEF = 0;
	
	$scope.numberOfPages = function(){
		if($scope.practicesWS == null){
			return 0;
		}
		return Math.ceil($scope.practicesWSM.length/$scope.maxPractices);
	};
	
	$scope.numberOfPagesOld = function(){
		if($scope.practicesOldEF == null){
			return 0;
		}
		return Math.ceil($scope.practicesOldEF.length/$scope.maxPractices);
	};
                  			
    var newPractice = false;
                  			
    $scope.newPracticeShow = function(){
    	newPractice = true;
    };
                  			
    $scope.newPracticeHide = function(){
    	newPractice = false;
    };
                  			
   	$scope.isNewPractice = function(){
   		return newPractice;
    };
      
    $scope.utenteCS = sharedDataService.getUtente();
    
    //  -------------------------- Section for classification view ------------------------------
    
    // Method checkInClassification: used to check if a list of user practice is in classification or not
    $scope.checkInClassification = function(list){
    	
    };
    
    //  ------------------------ End of Section for classification view ----------------------------
                  			
}]);