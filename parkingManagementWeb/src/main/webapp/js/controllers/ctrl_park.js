'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('ParkCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$route', '$location', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeWSServiceProxy', 'invokePdfServiceProxy', 'getMyMessages', '$base64','$timeout',
                               function($scope, $http, $routeParams, $rootScope, $route, $location, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, invokePdfServiceProxy, getMyMessages, $base64, $timeout) { 
	this.$scope = $scope;
    $scope.params = $routeParams;
    $scope.showLog = true;
    $scope.showLogDates = false;
    $scope.showDialogsSucc = false;

    var cod_ente = "24";
    
    $scope.maxAreas = 10;
    $scope.maxStreets = 10;
    $scope.maxPmeters = 10;
    $scope.maxPStructs = 10;
    $scope.maxZones = 10;
    
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
    $scope.periodPattern=/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d) - (?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
    $scope.phonePattern=/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;

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
    
    // The tab directive will use this data
    $scope.editparktabs = [ 
        { title:'Area', index: 1, content:"partials/edit/tabs/edit_area.html" },
        { title:'Via', index: 2, content:"partials/edit/tabs/edit_street.html" },
        { title:'Parcometro', index: 3, content:"partials/edit/tabs/edit_parkingmeter.html" },
        { title:'Parcheggio in struttura', index: 4, content:"partials/edit/tabs/edit_parkingstructure.html" },
        { title:'Zona', index: 5, content:"partials/edit/tabs/edit_zone.html" }
    ];
           
    $scope.setIndex = function($index){
       	$scope.tabIndex = $index;
       	if($index == 0){
       		$scope.getAreasFromDb();
       	}
       	if($index == 1){
       		$scope.getStreetsFromDb();
       	}
       	if($index == 2){
       		$scope.getParkingMetersFromDb();
       	}
       	if($index == 3){
       		$scope.getParkingStructuresFromDb();
       	}
       	if($index == 4){
       		$scope.getZonesFromDb();
       	}
    };  
    
    $scope.cash_mode = "CASH";
    $scope.automated_teller_mode = "AUTOMATED_TELLER";
    $scope.prepaid_card_mode = "PREPAID_CARD";
    $scope.parcometro = "PARCOMETRO";
    $scope.gpsLength = 9;
    $scope.myAppId = "rv";
    
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
    
    $scope.areaWS = [];
    $scope.streetWS = [];
    $scope.pmeterWS = [];
    $scope.pstructWS = [];
    $scope.zoneWS = [];
     
    // for next and prev in practice list
    $scope.currentPage = 0;
    $scope.currentClassPage = 0;	// for classification
    $scope.numberOfPages = function(type){
       	if(type == 1){
       		if($scope.areaWS != null){
       			return Math.ceil($scope.areaWS.length/$scope.maxAreas);
       		} else {
       			return 0;
      		}
       	} else if(type == 2) {
       		if($scope.streetWS != null){
       			return Math.ceil($scope.streetWS.length/$scope.maxStreets);
       		} else {
       			return 0;
     		}
       	} else if(type == 3){
       		if($scope.pmeterWS != null){
       			return Math.ceil($scope.pmeterWS.length/$scope.maxPmeters);
       		} else {
       			return 0;
     		}
       	} else if(type == 4){
       		if($scope.pstructWS != null){
       			return Math.ceil($scope.pstructWS.length/$scope.maxPStructs);
       		} else {
       			return 0;
     		}
       	} else if(type == 5){
       		if($scope.zoneWS != null){
       			return Math.ceil($scope.zoneWS.length/$scope.maxZones);
       		} else {
       			return 0;
     		}
       	} else {
       		if($scope.finalClass != null){
       			return Math.ceil($scope.finalClass.length/$scope.maxClassPractices);
       		} else {
       			return 0;
     		}
       	}
    };
    
    $scope.getAreasFromDb = function(){
    	$scope.areaMapReady = false;
		var allAreas = [];
		var method = 'GET';
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allAreas);
	    	console.log("rateAreas retrieved from db: " + JSON.stringify(result));
	    	
	    	$scope.areaWS = allAreas;
	    	$scope.initAreaMap();
	    	$scope.initAreasOnMap($scope.areaWS);
	    	sharedDataService.setSharedLocalAreas($scope.areaWS);
	    	$scope.areaMapReady = true;
	    });
	};
	
	$scope.getAreaByIdFromDb = function(id){
		var method = 'GET';
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "area/"+ id, null, $scope.authHeaders, null);
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
	
	$scope.getStreetsFromDb = function(){
		$scope.streetMapReady = false;
		var allStreet = [];
		var method = 'GET';
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allStreet);
	    	console.log("streets retrieved from db: " + JSON.stringify(result));
	    	
	    	$scope.streetWS = $scope.initStreetsObjects(allStreet);
	    	$scope.initStreetMap();
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
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allPmeters);
	    	console.log("ParkingMeters retrieved from db: " + JSON.stringify(result));
	    	
	    	for (var i = 0; i <  allPmeters.length; i++) {
	    		markers.push(createMarkers(i, allPmeters[i], 1));
		    }
	    	
	    	$scope.pmeterWS = $scope.initPMObjects(allPmeters);
	    	$scope.initPMeterMap(markers);
	    	//$scope.initStreetsOnMap($scope.streetWS);
	    	$scope.pmMapReady = true;
	    });
	};
	
	$scope.getParkingStructuresFromDb = function(){
		var markers = [];
		$scope.psMapReady = false;
		var allPstructs = [];
		var method = 'GET';
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allPstructs);
	    	console.log("ParkingStructures retrieved from db: " + JSON.stringify(result));
	    	
	    	for (var i = 0; i <  allPstructs.length; i++) {
	    		markers.push(createMarkers(i, allPstructs[i], 2));
		    }
	    	
	    	$scope.pstructWS = allPstructs;
	    	$scope.initPStructMap(markers);
	    	//$scope.initStreetsOnMap($scope.streetWS);
	    	$scope.psMapReady = true;
	    });
	};
	
	$scope.getZonesFromDb = function(){
		$scope.zoneMapReady = false;
		var allZones = [];
		var method = 'GET';
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allZones);
	    	console.log("Zone retrieved from db: " + JSON.stringify(result));
	    	
	    	$scope.zoneWS = allZones;
	    	$scope.initZoneMap();
	    	$scope.initZonesOnMap($scope.zoneWS);
	    	$scope.zoneMapReady = true;
	    });
	};
	
	// Utility methods
	$scope.correctColor = function(value){
		return "#" + value;
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
	
	$scope.correctMyGeometry = function(geo){
		var pos = geo.split(",");
		return {
			lat: pos[0],
			lng: pos[1]
		};
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
	
	$scope.initStreetsObjects = function(streets){
		var myStreets = [];
		for(var i = 0; i < streets.length; i++){
			var area = $scope.getLocalAreaById(streets[i].rateAreaId);
			var mystreet = streets[i];
			mystreet.area_name = area.name,
			mystreet.area_color= area.color;
			myStreets.push(mystreet);
		}
		return myStreets;
	};
	
	$scope.initPMObjects = function(pmeters){
		var myPms = [];
		for(var i = 0; i < pmeters.length; i++){
			var area = $scope.getLocalAreaById(pmeters[i].areaId);
			var myPmeter = pmeters[i];
			myPmeter.area_name = area.name,
			myPmeter.area_color= area.color;
			myPms.push(myPmeter);
		}
		return myPms;
	};
	
	// View management
	// ParkingMeters
	$scope.setPmDetails = function(parkingMeter){
		$scope.pmViewMapReady = false;
		
		$scope.parckingMeter = parkingMeter;
		
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		for(var i = 0; i < $scope.allArea.length; i++){
			if($scope.parckingMeter.areaId == $scope.allArea[i].id){
				$scope.myArea = $scope.allArea[i];
			}
		}
		
		var toRemLat = 0;
		var toRemLng = 0;
		var sLat = "" + $scope.parckingMeter.geometry.lat;
		var sLng = "" + $scope.parckingMeter.geometry.lng;
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
		
		$scope.pViewMetersMarkers = $scope.parkingMetersMarkers;
		for(var i = 0; i < $scope.pViewMetersMarkers.length; i++){
			if($scope.pViewMetersMarkers[i].title == $scope.parckingMeter.code){
				$scope.pViewMetersMarkers.splice(i, 1);
			};
		}
		
		$scope.mySpecialMarker = {
			id: 0,
			coords: {
				latitude: $scope.parckingMeter.geometry.lat,
				longitude: $scope.parckingMeter.geometry.lng
			},
			options: { 
				draggable: false,
				animation: 1
			},
			icon: $scope.pmMarkerIcon
		};
		
		$scope.viewModePM = true;
		$scope.editModePM = false;
		$scope.pmViewMapReady = true;
	};
	
	$scope.closeView = function(){
		$scope.getParkingMetersFromDb();	// to refresh the data on page
		$scope.viewModePM = false;
		$scope.editModePM = false;
	};
	
	// ParkingStructures
	$scope.setPsDetails = function(parkingStructure){
		$scope.psViewMapReady = false;
		
		$scope.parkingStructure = parkingStructure;
		
		var toRemLat = 0;
		var toRemLng = 0;
		var sLat = "" + $scope.parkingStructure.geometry.lat;
		var sLng = "" + $scope.parkingStructure.geometry.lng;
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
			if($scope.pViewStructMarkers[i].title == $scope.parkingStructure.id){
				$scope.pViewStructMarkers.splice(i, 1);
			};
		}
		
		$scope.mySpecialPSMarker = {
			id: 0,
			coords: {
				latitude: $scope.parkingStructure.geometry.lat,
				longitude: $scope.parkingStructure.geometry.lng
			},
			options: { 
				draggable: false,
				animation: 1
			},
			icon: $scope.psMarkerIcon
		};
		
		$scope.viewModePS = true;
		$scope.editModePS = false;
		$scope.psViewMapReady = true;
	};
	
	$scope.closePSView = function(){
		$scope.getParkingStructuresFromDb();	// to refresh the data on page
		$scope.viewModePS = false;
		$scope.editModePS = false;
	};
	
	// Edit management
	// ParkingMeters
	$scope.setPmEdit = function(parkingMeter){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		$scope.listaStati = [{
				idObj: "ACTIVE",
				descrizione: "Attivo"
			},
			{
				idObj: "INACTIVE",
				descrizione: "Disattivo"
			}
		];
		
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		
		$scope.parckingMeter = {
			id: null,
			code: null,
			note: null,
			status: null,
			areaId: null,
			geometry: null
		};
		$scope.mystatus = "Seleziona lo stato del parcometro";
		
		// Case edit
		if(parkingMeter != null){
			$scope.isEditing = true;
			$scope.isInit = false;
			$scope.parckingMeter = parkingMeter;
			if(parkingMeter.status == "ACTIVE"){
				$scope.myStatus = $scope.listaStati[0];
			} else {
				$scope.myStatus = $scope.listaStati[1];
			}
			for(var i = 0; i < $scope.allArea.length; i++){
				if($scope.parckingMeter.areaId == $scope.allArea[i].id){
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
			
			$scope.setMyGeometry($scope.parckingMeter.geometry.lat + "," + $scope.parckingMeter.geometry.lng);
			
			$scope.myPm = {
				id: 0,
				coords: {
					latitude: $scope.parckingMeter.geometry.lat,
					longitude: $scope.parckingMeter.geometry.lng
				},
				options: { 
					draggable: true
				},
				events: {
				    dragend: function (marker, eventName, args) {
				    	var lat = marker.getPosition().lat();
				    	var lng = marker.getPosition().lng();
				    	console.log('marker dragend: ' + lat + "," + lng);
				    	$scope.setMyGeometry(lat + "," + lng);
				    }
				}
			};
			// animation: 1 to set the marker bounce
			
		} else {
			$scope.setMyGeometry("0,0");
			
			$scope.pmCreateMap = {
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
		            			lat: lat,
		            			lng: lng
		            	};
		            	$scope.setMyGeometry(lat + "," + lng);
		            	$scope.addMyNewMarker(tmppos, map);
					}
				}
			};
		}
		$scope.viewModePM = false;
		$scope.editModePM = true;
	};
	
	// ParkingStructure
	$scope.setPsEdit = function(parkingStruct){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
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
		
		$scope.myPayment = {
			cash_checked: false,
			automated_teller_checked: false,
			prepaid_card_checked: false,
			parcometro_checked: false
		};
		
		// Case edit
		if(parkingStruct != null){
			$scope.isEditing = true;
			$scope.isInit = false;
			$scope.parkingStructure = parkingStruct;
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
			
			$scope.setMyGeometry($scope.parkingStructure.geometry.lat + "," + $scope.parkingStructure.geometry.lng);
			
			$scope.myPs = {
				id: 0,
				coords: {
					latitude: $scope.parkingStructure.geometry.lat,
					longitude: $scope.parkingStructure.geometry.lng
				},
				options: { 
					draggable: true
				},
				events: {
				    dragend: function (marker, eventName, args) {
				    	var lat = marker.getPosition().lat();
				    	var lng = marker.getPosition().lng();
				    	console.log('marker dragend: ' + lat + "," + lng);
				    	$scope.setMyGeometry(lat + "," + lng);
				    }
				}
			};
			
		} else {
			$scope.setMyGeometry("0,0");
			
			$scope.psCreateMap = {
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
		            			lat: lat,
		            			lng: lng
		            	};
		            	$scope.setMyGeometry(lat + "," + lng);
		            	$scope.addMyNewMarker(tmppos, map);
					}
				}
			};
		}
		$scope.viewModePS = false;
		$scope.editModePS = true;
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
	
	// Object Update methods
	// Update parkingMeter Object
	$scope.updatePmeter = function(form, status, area, geometry){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingErrorMessage = false;
			
			var id = $scope.parckingMeter.id;
			var method = 'PUT';
			var pm = $scope.parckingMeter;
			
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
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated parkinMeter: " + result);
		    	if(result == "OK"){
		    		$scope.getParkingMetersFromDb();
		    		$scope.editModePM = false;
		    	} else {
		    		$scope.editModePM = true;
		    		$scope.showUpdatingErrorMessage = true;
		    	}
		    });
		}
	};
	
	// Update ParkingStructure Object
	$scope.updatePstruct = function(form, paymode, geo){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingPSErrorMessage = false;
			
			var id = $scope.parkingStructure.id;
			var method = 'PUT';
			var ps = $scope.parkingStructure;
			
			var data = {
				id: ps.id,
				id_app: ps.id_app,
				name: ps.name,
				streetReference: ps.streetReference,
				fee: ps.fee,
				timeSlot : ps.timeSlot,
				managementMode: ps.managementMode,
				phoneNumber: ps.phoneNumber,
				paymentMode: $scope.correctMyPaymentMode(paymode),
				slotNumber: ps.slotNumber,
				handicappedSlotNumber: ps.handicappedSlotNumber,
				unusuableSlotNumber: ps.unusuableSlotNumber,
				geometry: $scope.correctMyGeometry(geo)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Parkingmeter data : " + value);
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated parkingStructure: " + result);
		    	if(result == "OK"){
		    		$scope.getParkingStructuresFromDb();
					$scope.editModePS = false;
		    	} else {
		    		$scope.editModePS = true;
		    		$scope.showUpdatingPSErrorMessage = true;
		    	}
		    });
		}
	};
	
	
	// Object Creation Methods
	// ParkingMeter
	$scope.createPmeter = function(form, status, area, geometry){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingErrorMessage = false;
			
			var method = 'POST';
			var pm = $scope.parckingMeter;
			
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
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated parkinMeter: " + JSON.stringify(result));
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
	$scope.createPstruct = function(form, paymode, geo){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingPSErrorMessage = false;
			
			var method = 'POST';
			var ps = $scope.parkingStructure;
			
			var data = {
				id_app: $scope.myAppId,
				name: ps.name,
				streetReference: ps.streetReference,
				fee: ps.fee,
				timeSlot : ps.timeSlot,
				managementMode: ps.managementMode,
				phoneNumber: ps.phoneNumber,
				paymentMode: $scope.correctMyPaymentMode(paymode),
				slotNumber: ps.slotNumber,
				handicappedSlotNumber: ps.handicappedSlotNumber,
				unusuableSlotNumber: ps.unusuableSlotNumber,
				geometry: $scope.correctMyGeometry(geo)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Parkingmeter data : " + value);
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated parkingStructure: " + JSON.stringify(result));
		    	if(result != null && result != ""){
		    		$scope.getParkingStructuresFromDb();
					$scope.editModePS = false;
		    	} else {
		    		$scope.editModePS = true;
		    		$scope.showUpdatingPSErrorMessage = true;
		    	}
		    });
			
			
			
		}
	};
	
	// Maps management
	$scope.parkingMetersMarkers = [];
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	
	$scope.pmMarkerIcon = "imgs/markerIcons/parcometro.png";			// icon for parkingMeter object
	$scope.psMarkerIcon = "imgs/markerIcons/parcheggioStruttura.png";	// icon for parkingStructure object
	$scope.bpMarkerIcon = "imgs/markerIcons/puntobici.png";				// icon for bikePoint object
	
	$scope.mapCenter = {
		latitude: 45.88875357753771,
		longitude: 11.037440299987793
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
		    zoom: 10,
		    bounds: {}
		};
			
		$scope.options = {
		    scrollwheel: true
		};
	};
	
	$scope.polygons = [];
	$scope.zone_polygons = [];
	$scope.geoStreets = [];
	
	$scope.initAreasOnMap = function(areas){
		var area = {};
		var poligons = {};
		
		for(var i = 0; i < areas.length; i++){
			if(areas[i].geometry != null){
				poligons = areas[i].geometry;
				area = {
					id: i,
					path: $scope.correctPoints(poligons[0].points),
					stroke: {
					    color: $scope.correctColor(areas[i].color),
					    weight: 3
					},
					editable: true,
					draggable: true,
					geodesic: false,
					visible: true,
					fill: {
					    color: $scope.correctColor(areas[i].color),
					    opacity: 0.7
					}
				};
				$scope.polygons.push(area);
			}
		}
	};
	
	$scope.initStreetsOnMap = function(streets){
		var street = {};
		var poligons = {};
		
		for(var i = 0; i < streets.length; i++){
			if(streets[i].geometry != null){
				poligons = streets[i].geometry;
				street = {
					id: i,
					path: $scope.correctPoints(poligons.points),
					stroke: {
					    color: $scope.correctColor(streets[i].color),
					    weight: 3
					},
					editable: true,
					draggable: true,
					geodesic: false,
					visible: true,
					//icons:
				};
				$scope.geoStreets.push(street);
			}
		}
	};
	
	$scope.initZonesOnMap = function(zones){
		var zone = {};
		var poligons = {};
		
		for(var i = 0; i < zones.length; i++){
			if(zones[i].geometry != null){
				poligons = zones[i].geometry;
				zone = {
					id: i,
					path: $scope.correctPoints(poligons.points),
					stroke: {
					    color: $scope.correctColor(zones[i].color),
					    weight: 3
					},
					editable: true,
					draggable: true,
					geodesic: false,
					visible: true,
					fill: {
					    color: $scope.correctColor(zones[i].color),
					    opacity: 0.7
					}
				};
				$scope.zone_polygons.push(zone);
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
	
	
	var createMarkers = function(i, marker, type) {
		var myIcon = "";
		var title = "";
		switch(type){
			case 1 : 
				myIcon = $scope.pmMarkerIcon;
				title = marker.code;
				break;
			case 2 : 
				myIcon = $scope.psMarkerIcon;
				title = marker.id;
				break;
			case 3 :
				myIcon = $scope.bpMarkerIcon;
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
			    options: { 
			    	draggable: true,
			    	visible: true,
			    	map: null
			    },
				title: title,
				icon: myIcon,
				showWindow: false,
			    events: {
			    	mouseover: function(marker, eventName, args) {
			    		var e = args[0];
			    		console.log("I am in marker mouseover event function " + e);
			    		marker.show = true;
//			    	 	$scope.$apply();
			    	},
			    	click: function (marker, eventName, args){
		            	var e = args[0];
		            	console.log("I am in marker click event function " + e.latLng);
		            	//$scope.$apply();
		            }	
			    }
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
	
//	$scope.polygons = [
//	    {
//	       id: 1,
//	       path: [
//	           {
//	               latitude: 45.893244,
//	               longitude: 11.024332
//	           },
//	           {
//	               latitude: 45.894140,
//	               longitude: 11.029181
//	           },
//	           {
//	               latitude: 45.891063,
//	               longitude: 11.034288
//	           },
//	           {
//	               latitude: 45.886493,
//	               longitude: 11.032700
//	           },
//	           {
//	               latitude: 45.884671,
//	               longitude: 11.026263
//	           }
//	       ],
//	       stroke: {
//	          color: '#29ea30',
//	          weight: 3
//	       },
//	       editable: true,
//	       draggable: true,
//	       geodesic: false,
//	       visible: true,
//	       fill: {
//	          color: '#29ea30',
//	          opacity: 0.7
//	       }
//	    }
//	];
	   
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