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
       		var zones = sharedDataService.getSharedLocalZones;
       		if(zones == null || zones.length == 0){
       			$scope.getZonesFromDb();
       		}
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
    $scope.noPaymentChecked = false;
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
    
    $scope.myNewArea;
     
    // for next and prev in practice list
    $scope.currentPage = 0;
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
	
	$scope.getLocalZoneById = function(id){
		var find = false;
		var myZones = sharedDataService.getSharedLocalZones();
		for(var i = 0; i < myZones.length && !find; i++){
			if(myZones[i].id == id){
				find = true;
				return myZones[i];
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
	    	
	    	$scope.zoneWS = $scope.correctMyZones(allZones);
	    	$scope.initZoneMap();
	    	$scope.initZonesOnMap($scope.zoneWS);
	    	sharedDataService.setSharedLocalZones($scope.zoneWS);
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
	
	$scope.correctMyGeometryPolyline = function(geo){
		//var corrected = [];
		var tmpLine = {
			points: null,
			//pointObjs: null
		};
		var points = [];
		for(var i = 0; i < geo.length; i++){
			var tmpPoint = {
				lat: geo[i].latitude,
				lng: geo[i].longitude
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
			points: null,
		};
		var points = [];
		for(var i = 0; i < geo.points.length; i++){
			var tmpPoint = geo.points[i];
			points.push(tmpPoint);
		}
		
		tmpPolygon.points = points;

		return tmpPolygon;
	};
	
	$scope.correctMyGeometryPolygonForArea = function(geo){
		var corrected = [];
		var tmpPol = {
			points: null,
		};
		var points = [];
		for(var i = 0; i < geo.length; i++){
			var tmpPoint = {
				lat: geo[i].latitude,
				lng: geo[i].longitude
			};
			points.push(tmpPoint);
		}
		
		tmpPol.points = points;
		corrected.push(tmpPol);
		
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
	
	$scope.checkIfPaymentChecked = function(){
		if($scope.myPayment.cash_checked || $scope.myPayment.automated_teller_checked || $scope.myPayment.prepaid_card_checked || $scope.myPayment.parcometro_checked){
			$scope.setMyPaymentoErrMode(false);
		} else {
			$scope.setMyPaymentoErrMode(true);
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
	
	$scope.correctMyZones = function(zones){
		var correctedZones = [];
		for(var i = 0; i < zones.length; i++){
			var correctZone = {
					id: zones[i].id,
					id_app: zones[i].id_app,
					color: zones[i].color,
					name: zones[i].name,
					submacro: zones[i].submacro,
					type: zones[i].type,
					note: zones[i].note,
					geometry: $scope.correctMyGeometryPolygon(zones[i].geometry)
			};
			correctedZones.push(correctZone);
		}
		return correctedZones;
	};
	
	$scope.correctMyZonesForStreet = function(zones){
		var correctedZones = [];
		for(var i = 0; i < zones.length; i++){
//			var correctZone = {
//					id: zones[i].id,
//					id_app: zones[i].id_app,
//					color: zones[i].color,
//					name: zones[i].name,
//					submacro: zones[i].submacro,
//					type: zones[i].type,
//					note: zones[i].note,
//					geometry: $scope.correctMyGeometryPolygon(zones[i].geometry)
//			};
//			correctedZones.push(correctZone);
			correctedZones.push(zones[i].id);
		}
		return correctedZones;
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
			for(var j = 0; j < streets[i].zones.length; j++){
				var zone = $scope.getLocalZoneById(streets[i].zones[j]);
				zones.push(zone);
			}
			var area = $scope.getLocalAreaById(streets[i].rateAreaId);
			var mystreet = streets[i];
			mystreet.area_name = area.name;
			mystreet.area_color= area.color;
			mystreet.myZones = zones;
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
	// RateArea
	$scope.setADetails = function(area){
		$scope.aViewMapReady = false;
		
		$scope.area = area;
		
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
		
		$scope.viewAreaPolygons = $scope.polygons;
		for(var i = 0; i < $scope.viewAreaPolygons.length; i++){
			if($scope.viewAreaPolygons[i].id == $scope.area.id){
				$scope.viewAreaPolygons.splice(i, 1);
			};
		};
		
		if($scope.area.geometry != null){
			$scope.myAreaPol = {
				id: area.id,
				path: $scope.correctPoints(area.geometry[0].points),
				stroke: {
				    color: $scope.correctColor(area.color),
				    weight: 10
				},
				editable: false,
				draggable: false,
				geodesic: false,
				visible: true,
				fill: {
				    color: $scope.correctColor(area.color),
				    opacity: 0.9
				}
			};
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
		
		$scope.street = street;
		
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		for(var i = 0; i < $scope.allArea.length; i++){
			if($scope.street.rateAreaId == $scope.allArea[i].id){
				$scope.myArea = $scope.allArea[i];
			}
		}
		
		
//		var toRemLat = 0;
//		var toRemLng = 0;
//		var sLat = "" + $scope.street.geometry.lat;
//		var sLng = "" + $scope.parckingMeter.geometry.lng;
//		if(sLat.length > $scope.gpsLength){
//			toRemLat = sLat.length - $scope.gpsLength;
//		}
//		if(sLng.length > $scope.gpsLength){
//			toRemLng = sLng.length - $scope.gpsLength;
//		}
//		$scope.setMyGeometry(sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng));
		
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
		
		$scope.viewStreetLines = $scope.geoStreets;
		for(var i = 0; i < $scope.viewStreetLines.length; i++){
			if($scope.viewStreetLines[i].id == $scope.street.id){
				$scope.viewStreetLines.splice(i, 1);
			};
		};
		
		if($scope.street.geometry != null){
			$scope.myStreetLine = {
				id: street.id,
				path: $scope.correctPoints(street.geometry.points),
				stroke: {
				    color: $scope.correctColor(street.color),
				    weight: 10
				},
				editable: false,
				draggable: false,
				geodesic: false,
				visible: true,
			};
		}
		
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
	
	// Street
	$scope.setZDetails = function(zone){
		$scope.zViewMapReady = false;
		
		$scope.zone = zone;
		
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
		
		$scope.viewZonePolygons = $scope.zone_polygons;
		for(var i = 0; i < $scope.viewZonePolygons.length; i++){
			if($scope.viewZonePolygons[i].id == $scope.zone.id){
				$scope.viewZonePolygons.splice(i, 1);
			};
		};
		
		if($scope.zone.geometry != null){
			$scope.myZonePol = {
				id: zone.id,
				path: $scope.correctPoints(zone.geometry.points),
				stroke: {
				    color: $scope.correctColor(zone.color),
				    weight: 10
				},
				editable: false,
				draggable: false,
				geodesic: false,
				visible: true,
				fill: {
				    color: $scope.correctColor(zone.color),
				    opacity: 0.9
				}
			};
		}
		
		$scope.viewModeZ = true;
		$scope.editModeZ = false;
		$scope.zViewMapReady = true;
	};
	
	$scope.closeZView = function(){
		$scope.getZonesFromDb();	// to refresh the data on page
		$scope.viewModeZ = false;
		$scope.editModeZ = false;
	};
	
	// Edit management
	// Area
	$scope.setAEdit = function(area){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
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
		
		// Polygon void object
		$scope.newArea = {
			path: null,
			stroke: {
			    color: '#000000',
			    weight: 3
			},
			editable: true,
			draggable: true,
			visible: true,
			geodesic: false,
			fill: {
			    color: $scope.correctColor('#000000'),
			    opacity: 0.7
			}
		};
		
		$scope.myColor = "";
		
		// Case edit
		if(area != null){
			$scope.isEditing = true;
			$scope.isInit = false;
			$scope.area = area;
			$scope.area.fee = $scope.correctDecimal(area.fee, 2);	// Here I cast the fee value to string and I change the '.' char in ',' char
			
			var areaCenter = $scope.mapCenter;
			
			$scope.myColor = $scope.correctColor(area.color);
			if(area.geometry != null){
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
			
			if(area.geometry != null){
				var tmpPol = "";
				var poligons = {};
				for(var i = 0; i < $scope.area.geometry[0].points.length; i++){
					var tmpPoint = $scope.area.geometry[0].points[i].lat + "," + $scope.area.geometry[0].points[i].lng;
					tmpPol = tmpPol + tmpPoint + ",";
				}
				tmpPol = tmpPol.substring(0, tmpPol.length-1);
				$scope.setMyPolGeometry(tmpPol);
			
				poligons = area.geometry[0];
				$scope.editArea = {
					id: area.id,
					path: $scope.correctPoints(poligons.points),
					stroke: {
					    color: $scope.correctColor(area.color),
					    weight: 3
					},
					editable: true,
					draggable: true,
					visible: true,
					fill: {
					    color: $scope.correctColor(area.color),
					    opacity: 0.7
					},
					events: {
					    dragend: function (polygon, eventName, args) {
					    	var path = args.path;
					    	
					    	console.log('polygon dragend: ' + JSON.stringify(path));
					    	$scope.setMyPolGeometry(path);
					    },
					    click: function (polygon, eventName, args) {
					    	var path = args.path;
					    	
					    	console.log('polygon click: ' + JSON.stringify(path));
					    	$scope.setMyPolGeometry(path);
					    },
					    mouseup: function (polygon, eventName, args) {
					    	var path = args.path;
					    	
					    	var tmpPol = "";
							for(var i = 0; i < path.length; i++){
								var tmpPoint = path[i].latitude + "," + path[i].longitude;
								tmpPol = tmpPol + tmpPoint + ",";
							}
							tmpPol = tmpPol.substring(0, tmpPol.length-1);
							$scope.setMyPolGeometry(tmpPol);
					    	
					    	console.log('polygon mouse up: ' + tmpPol);
					    }
					}
				};
			}	
		} else {
			var tmppol = [];
			
			$scope.aCreateMap = {
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
		            	tmppol.push(tmppos);
		            	$scope.newArea = $scope.updateMyNewArea(tmppol);
		            	$scope.refreshMap($scope.aCreateMap);
		            	
		            	var tmpPol = "";
						for(var i = 0; i < tmppol.length; i++){
							var tmpPoint = tmppol[i].latitude + "," + tmppol[i].longitude;
							tmpPol = tmpPol + tmpPoint + ",";
						}
						tmpPol = tmpPol.substring(0, tmpPol.length-1);
						$scope.setMyNewPolGeometry(tmpPol);
				    	console.log('New pol route: ' + tmpPol);
		            	
				    	//$scope.addMyNewMarker(tmppos, map);
					}
//					dblclick: function(map, eventName, args){
//						var e = args[0];
//		            	console.log("I am in double click event function" + e.latLng);
		            	//var latLngString = "" + e.latLng;
		            	
//		            	var geocoder = new google.maps.Geocoder();
//		    			geocoder.geocode({location:e.latLng}, function(response) {
//		    				var result = response[0].formatted_address;
//		    				if (result != undefined && result != null) {
//		    					$scope.street.streetReference = result.substring(0, result.indexOf(','));
//		    				}
//		    			});
//					}
				}
			};
		}
		$scope.viewModeA = false;
		$scope.editModeA = true;
	};
	
	// Streets
	$scope.setSEdit = function(street){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
		$scope.myZones = [];
		$scope.myArea = null;
		$scope.myNewArea = null;
		
		$scope.allArea = sharedDataService.getSharedLocalAreas();
		$scope.allZones = sharedDataService.getSharedLocalZones();
		$scope.setMyLineGeometry(null);
		
		$scope.street = {
			id: null,
			id_app: null,
			streetReference: null,
			slotNumber: null,
			handicappedSlotNumber: null,
			timedParkSlotNumber: null,
			freeParkSlotNumber: null,
			unusuableSlotNumber: null,
			color: null,
			rateAreaId: null,
			zones: null,
			geometry: null
		};
		
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
			$scope.isEditing = true;
			$scope.isInit = false;
			$scope.street = street;
		
			for(var i = 0; i < $scope.allArea.length; i++){
				if($scope.street.rateAreaId == $scope.allArea[i].id){
					$scope.myArea = $scope.allArea[i];
				}
			}
			
			for(var i = 0; i < street.myZones.length; i++){
				var tmpZone = {
						id: street.myZones[i].id,
						id_app: street.myZones[i].id_app,
						name: street.myZones[i].name,
						color: street.myZones[i].color,
						submacro: street.myZones[i].submacro,
						type: street.myZones[i].type,
						note: street.myZones[i].note,
						geometry: street.myZones[i].geometry
				};
				$scope.myZones.push(tmpZone);
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
			
			if(street.geometry != null){
				var tmpLine = "";
				var poligons = {};
				for(var i = 0; i < $scope.street.geometry.points.length; i++){
					var tmpPoint = $scope.street.geometry.points[i].lat + "," + $scope.street.geometry.points[i].lng;
					tmpLine = tmpLine + tmpPoint + ",";
				}
				tmpLine = tmpLine.substring(0, tmpLine.length-1);
				$scope.setMyLineGeometry(tmpLine);
			
				poligons = street.geometry;
				$scope.editStreet = {
					id: i,
					path: $scope.correctPoints(poligons.points),
					stroke: {
					    color: $scope.correctColor(street.color),
					    weight: 3
					},
					editable: true,
					draggable: true,
					visible: true,
					events: {
					    dragend: function (polyline, eventName, args) {
					    	var path = args.path;
					    	
					    	console.log('polyline dragend: ' + JSON.stringify(path));
					    	console.log('polyline new path: ' + JSON.stringify($scope.editStreet.path));
					    	$scope.setMyLineGeometry(path);
					    },
					    click: function (polyline, eventName, args) {
					    	var path = args.path;
					    	
					    	console.log('polyline click: ' + JSON.stringify(path));
					    	console.log('polyline new path: ' + JSON.stringify($scope.editStreet.path));
					    	$scope.setMyLineGeometry(path);
					    },
					    mouseup: function (polyline, eventName, args) {
					    	var path = args.path;
					    	
					    	var tmpLine = "";
							for(var i = 0; i < path.length; i++){
								var tmpPoint = path[i].latitude + "," + path[i].longitude;
								tmpLine = tmpLine + tmpPoint + ",";
							}
							tmpLine = tmpLine.substring(0, tmpLine.length-1);
							$scope.setMyLineGeometry(tmpLine);
					    	
					    	console.log('polyline mouse up: ' + tmpLine);
					    	console.log('polyline new path: ' + JSON.stringify($scope.editStreet.path));
					    }
					}
				};
			}	
		} else {
			//$scope.setMyGeometry("0,0");
			var tmppath = [];
			
			$scope.sCreateMap = {
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
		            	$scope.newStreet = $scope.updateMyNewStreet(tmppath);
		            	$scope.refreshMap($scope.sCreateMap);
		            	
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
		            	
		            	var geocoder = new google.maps.Geocoder();
		    			geocoder.geocode({location:e.latLng}, function(response) {
		    				var result = response[0].formatted_address;
		    				if (result != undefined && result != null) {
		    					$scope.street.streetReference = result.substring(0, result.indexOf(','));
		    				}
		    			});
					}
				}
			};
		}
		$scope.viewModeS = false;
		$scope.editModeS = true;
	};
	
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
		$scope.myArea = {};
		
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
			$scope.setMyGeometry(null);
			
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
			$scope.setMyGeometry(null);
			
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
	
	$scope.setZEdit = function(zone){
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
		$scope.zone = {
			id: null,
			id_app: null,
			nome: null,
			submacro: null,
			color: null,
			note: null,
			type: null,
			geometry: null
		};
		
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
			$scope.isEditing = true;
			$scope.isInit = false;
			$scope.zone = zone;
			
			var zoneCenter = $scope.mapCenter;
			
			$scope.myColor = $scope.correctColor(zone.color);
			if(zone.geometry != null){
				zoneCenter = {
					latitude: $scope.zone.geometry.points[0].lat,
					longitude: $scope.zone.geometry.points[0].lng
				};
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
			
			if(zone.geometry != null){
				var tmpPol = "";
				var poligons = {};
				for(var i = 0; i < $scope.zone.geometry.points.length; i++){
					var tmpPoint = $scope.zone.geometry.points[i].lat + "," + $scope.zone.geometry.points[i].lng;
					tmpPol = tmpPol + tmpPoint + ",";
				}
				tmpPol = tmpPol.substring(0, tmpPol.length-1);
				$scope.setMyPolGeometry(tmpPol);
			
				poligons = zone.geometry;
				$scope.editZone = {
					id: zone.id,
					path: $scope.correctPoints(poligons.points),
					stroke: {
					    color: $scope.correctColor(zone.color),
					    weight: 3
					},
					editable: true,
					draggable: true,
					visible: true,
					fill: {
					    color: $scope.correctColor(zone.color),
					    opacity: 0.7
					},
					events: {
					    dragend: function (polygon, eventName, args) {
					    	var path = args.path;
					    	
					    	console.log('polygon dragend: ' + JSON.stringify(path));
					    	$scope.setMyPolGeometry(path);
					    },
					    click: function (polygon, eventName, args) {
					    	var path = args.path;
					    	
					    	console.log('polygon click: ' + JSON.stringify(path));
					    	$scope.setMyPolGeometry(path);
					    },
					    mouseup: function (polygon, eventName, args) {
					    	var path = args.path;
					    	
					    	var tmpPol = "";
							for(var i = 0; i < path.length; i++){
								var tmpPoint = path[i].latitude + "," + path[i].longitude;
								tmpPol = tmpPol + tmpPoint + ",";
							}
							tmpPol = tmpPol.substring(0, tmpPol.length-1);
							$scope.setMyPolGeometry(tmpPol);
					    	
					    	console.log('polygon mouse up: ' + tmpPol);
					    }
					}
				};
			}	
		} else {
			//$scope.setMyGeometry("0,0");
			var tmppath = [];
			
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
	
	// Object Update methods
	// Area
	$scope.updateArea = function(form, color, polygon){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingAErrorMessage = false;
			
			var id = $scope.area.id;
			var method = 'PUT';
			var a = $scope.area;
			
			var decimalFee = $scope.correctDecimal(a.fee, 1);
			
			var data = {
				id: a.id,
				id_app: a.id_app,
				name: a.name,
				fee: parseFloat(decimalFee),
				timeSlot: a.timeSlot,
				smsCode: a.smsCode,
				color: a.color,
				geometry: $scope.correctMyGeometryPolygonForArea(polygon.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Area data : " + value);
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "area/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated street: " + result);
		    	if(result == "OK"){
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
	$scope.updateStreet = function(form, area, zones, polyline){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingSErrorMessage = false;
			
			var id = $scope.street.id;
			var method = 'PUT';
			var s = $scope.street;
			
			var data = {
				id: s.id,
				id_app: s.id_app,
				streetReference: s.streetReference,
				slotNumber: s.slotNumber,
				handicappedSlotNumber: s.handicappedSlotNumber,
				timedParkSlotNumber:s.timedParkSlotNumber,
				paidSlotNumber:s.paidSlotNumber,
				freeParkSlotNumber: s.freeParkSlotNumber,
				unusuableSlotNumber: s.unusuableSlotNumber,
				subscritionAllowedPark: s.subscritionAllowedPark,
				color: area.color,
				rateAreaId: area.id,
				zones: $scope.correctMyZonesForStreet(zones),
				geometry: $scope.correctMyGeometryPolyline(polyline.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Street data : " + value);
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "street/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated street: " + result);
		    	if(result == "OK"){
		    		$scope.getStreetsFromDb();
					$scope.editModeS = false;
		    	} else {
		    		$scope.editModeS = true;
		    		$scope.showUpdatingSErrorMessage = true;
		    	}
		    });
		}
	};
	
	
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
		}	
	};
	
	
	// Update Zone Object
	$scope.updateZone = function(form, myColor, polygon){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingZErrorMessage = false;
			
			var id = $scope.zone.id;
			var method = 'PUT';
			var z = $scope.zone;
			
			var data = {
				id: z.id,
				id_app: z.id_app,
				name: z.name,
				submacro: z.submacro,
				color: myColor.substring(1, myColor.length),	// I have to remove '#' char
				note: z.note,
				type: z.type,
				geometry: $scope.correctMyGeometryPolyline(polygon.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Zone data : " + value);
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated Zone: " + result);
		    	if(result == "OK"){
		    		$scope.getZonesFromDb();
					$scope.editModeZ = false;
		    	} else {
		    		$scope.editModeZ = true;
		    		$scope.showUpdatingZErrorMessage = true;
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
				$scope.deleteSMeter(street);
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
		var delZone = $dialogs.confirm("Attenzione", "Vuoi cancellare la zona '" + zone.name + "-" + zone.submacro + "'?");
			delZone.result.then(function(btn){
				// yes case
				$scope.deleteZone(zone);
				
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
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "area/" + area.id , null, $scope.authHeaders, null);
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
	$scope.deleteSMeter = function(street){
		$scope.showDeletingSErrorMessage = false;
		var method = 'DELETE';
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "street/" + street.rateAreaId + "/" + street.id , null, $scope.authHeaders, null);
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
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter/" + pMeter.areaId + "/"  + pMeter.id , null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted parkingmeter: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		$scope.getParkingMetersFromDb();
	    		//$scope.editModeA = false;
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
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure/" + pStruct.id, null, $scope.authHeaders, null);
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
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone/" + zone.id, null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	console.log("Deleted zone: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		$scope.getZonesFromDb();
	    		//$scope.editModeA = false;
	    	} else {
	    		//$scope.editModeA = true;
	    		$scope.showDeletingZErrorMessage = true;
	    	}
	    });
	};
	
	
	// Object Creation Methods
	// Area
	$scope.createArea = function(form, myColor, polygon){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingAErrorMessage = false;
			
			var method = 'POST';
			var a = $scope.area;
			
			var decimalFee = $scope.correctDecimal(a.fee, 1);
			
			var data = {
				id_app: $scope.myAppId,
				name: a.name,
				fee: parseFloat(decimalFee),
				timeSlot: a.timeSlot,
				smsCode: a.smsCode,
				color: myColor.substring(1, myColor.length),	// I have to remove '#' char
				geometry: $scope.correctMyGeometryPolygonForArea(polygon.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Area data : " + value);
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, value);
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
	
	
	// Street
	$scope.createStreet = function(form, area, zones, polyline){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingSErrorMessage = false;
			
			var method = 'POST';
			var s = $scope.street;
			
			var data = {
				id_app: $scope.myAppId,
				streetReference: s.streetReference,
				slotNumber: s.slotNumber,
				handicappedSlotNumber: s.handicappedSlotNumber,
				timedParkSlotNumber:s.timedParkSlotNumber,
				paidSlotNumber:s.paidSlotNumber,
				freeParkSlotNumber: s.freeParkSlotNumber,
				unusuableSlotNumber: s.unusuableSlotNumber,
				subscritionAllowedPark: s.subscritionAllowedPark,
				color: area.color,
				rateAreaId: area.id,
				zones: $scope.correctMyZonesForStreet(zones),
				geometry: $scope.correctMyGeometryPolyline(polyline.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Street data : " + value);
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "street", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Created street: " + JSON.stringify(result));
		    	if(result != null && result != ""){
		    		$scope.getStreetsFromDb();
					$scope.editModeS = false;
		    	} else {
		    		$scope.editModeS = true;
		    		$scope.showUpdatingSErrorMessage = true;
		    	}
		    	// Here I try to clear the area and the polyline values
		    	area = null;
		    	polyline = null;
		    });	
		}
	};
	
	
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
	$scope.createPstruct = function(form, paymode, geo){
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
	$scope.createZone = function(form, myColor, polygon){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingZErrorMessage = false;
			
			var method = 'POST';
			var z = $scope.zone;
			
			var data = {
				id_app: $scope.myAppId,
				name: z.name,
				submacro: z.submacro,
				color: myColor.substring(1, myColor.length),	// I have to remove '#' char
				note: z.note,
				type: z.type,
				geometry: $scope.correctMyGeometryPolyline(polygon.path)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Zone data : " + value);
			
		   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "zone", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Created zone: " + JSON.stringify(result));
		    	if(result != null && result != ""){
		    		$scope.getZonesFromDb();
					$scope.editModeZ = false;
		    	} else {
		    		$scope.editModeZ = true;
		    		$scope.showUpdatingZErrorMessage = true;
		    	}
		    });	
		}
	};
	
	// Maps management
	$scope.parkingMetersMarkers = [];
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	
	$scope.map = {};
	
	$scope.pmMarkerIcon = "imgs/markerIcons/parcometro.png";			// icon for parkingMeter object
	$scope.psMarkerIcon = "imgs/markerIcons/parcheggioStruttura.png";	// icon for parkingStructure object
	$scope.bpMarkerIcon = "imgs/markerIcons/puntobici.png";				// icon for bikePoint object
	
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
		center : "[" + $scope.mapCenter.latitude + "," + $scope.mapCenter.longitude + "]",
		zoom : 14
	};
	
	// I need this to resize the map (gray map problem on load)
    $scope.resizeMap = function(){
        google.maps.event.trigger($scope.map, 'resize');
        $scope.map.setCenter({lat: $scope.mapCenter.latitude,lng:$scope.mapCenter.longitude});
        $scope.map.setZoom(14);
        return true;
    };
	
	//For Street
    var poly = poly = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        editable:true,
        visible:true
    });
    $scope.$on('mapInitialized', function(evt, map) {
        poly.setMap(map);
    });
	
	$scope.addPath = function(event) {
	   var path = poly.getPath();
	   path.push(event.latLng);
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
	$scope.geoStreets = [];
	
	$scope.initAreasOnMap = function(areas){
		var area = {};
		var poligons = {};
		$scope.polygons = [];
		
		for(var i = 0; i < areas.length; i++){
			if(areas[i].geometry != null){
				poligons = areas[i].geometry;
				area = {
					id: areas[i].id,
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
		$scope.geoStreets = [];
		
		for(var i = 0; i < streets.length; i++){
			if(streets[i].geometry != null){
				poligons = streets[i].geometry;
				street = {
					id: streets[i].id,
					path: $scope.correctPoints(poligons.points),
					stroke: {
					    color: $scope.correctColor(streets[i].color),
					    weight: 3
					},
					editable: false,
					draggable: false,
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
		$scope.zone_polygons = [];
		
		for(var i = 0; i < zones.length; i++){
			if(zones[i].geometry != null){
				poligons = zones[i].geometry;
				zone = {
					id: zones[i].id,
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
			visible: true,	
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