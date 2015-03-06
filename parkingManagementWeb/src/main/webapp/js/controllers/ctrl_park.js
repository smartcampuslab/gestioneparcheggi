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
    
    // Regex
    $scope.gpsPos = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/;
    $scope.onlyNumbers = /^\d+$/;
    $scope.decimalNumbers = /^([0-9]+)[\,]{0,1}[0-9]{0,2}$/;
    $scope.datePatternIt=/^\d{1,2}\/\d{1,2}\/\d{4}$/;
    $scope.datePattern=/^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/i;
    $scope.datePattern2=/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/i;
    $scope.datePattern3=/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/i;
    $scope.timePattern=/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
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
		$scope.setMyGeometry($scope.parckingMeter.geometry.lat + "," + $scope.parckingMeter.geometry.lng);
		
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
		
		$scope.listaPagamenti = [{
				idObj: "CASH",
				descrizione: "Contanti",
				checked: false
			},
			{
				idObj: "AUTOMATED_TELLER",
				descrizione: "Cassa automatica",
				checked: false
			},
			{
				idObj: "PREPAID_CARD",
				descrizione: "Carta prepagata",
				checked: false
			},
			{
				idObj: "PARCOMETRO",
				descrizione: "Parcometro",
				checked: false
			}
		];
		
		$scope.parckingStructure = {
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
			$scope.parckingStructure = parkingStruct;
			for(var i = 0; i < parkingStruct.paymentMode.length; i++){
				switch(parkingStruct.paymentMode[i]){
					case "CASH":
						$scope.myPayment.cash_checked = true;
						break;
					case "AUTOMATED_TELLER": 
						$scope.myPayment.automated_teller_checked = true;
						break;
					case "PREPAID_CARD": 
						$scope.myPayment.prepaid_card_checked = true;
						break;
					case "PARCOMETRO": 
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
			
			$scope.setMyGeometry($scope.parckingStructure.geometry.lat + "," + $scope.parckingStructure.geometry.lng);
			
			$scope.myPs = {
				id: 0,
				coords: {
					latitude: $scope.parckingStructure.geometry.lat,
					longitude: $scope.parckingStructure.geometry.lng
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
		// TO FINISH
		
		$scope.getParkingStructuresFromDb();
		$scope.editModePS = false;
		
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
		switch(type){
			case 1 : 
				myIcon = $scope.pmMarkerIcon; 
				break;
			case 2 : 
				myIcon = $scope.psMarkerIcon; 
				break;
			case 3 :
				myIcon = $scope.bpMarkerIcon;
		}
		
		var ret = {
			title: marker.code,
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
				title: marker.code,
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
      
    
    // ------------------------------------ Start of block WS INFOTN service call methods ---------------------------------
    $scope.setPracticeLoaded = function(value){
       	$scope.practiceLoaded = value;
    };
            
    $scope.getPracticesEpu = function() {
       	$scope.setPracticeLoaded(false);
       	var method = 'GET';
       	var params = {
       		idEnte:cod_ente,
       		userIdentity: $scope.userCF
       	};
            	
       	var myDataPromise = invokeWSServiceProxy.getProxy(method, "RicercaPratiche", params, $scope.authHeaders, null);	
       	myDataPromise.then(function(result){
       		if(result.esito == 'OK'){
   	    		$scope.practicesEpu = result.domanda;
   	    		if($scope.showLog) console.log("Recupero domande utente " + $scope.practicesEpu);
       		} else {
   	    		$dialogs.error(sharedDataService.getMsgErrPracticeRecovery());
       		}
       		$scope.setPracticeLoaded(true);
       	});
    };
    
    // ################################ Start of block - Practice creation, read, delete ###############################
         
    // Method used to create a new practice and to inithialize all the principal variables
    $scope.createPractice = function(ec_type, res_type, dom_type, practice, oldPractice){
    	
    	var tmp_scadenza = $scope.correctDate(ec_type.scadenzaPermessoSoggiorno);
       	var scad = null;
       	if(tmp_scadenza != null){
       		scad = $scope.castToDate(tmp_scadenza);
       		var now = new Date();
       		if(scad.getTime() < now.getTime()){
       			var oneDay = sharedDataService.getOneDayMillis(); //1000 * 60 * 60 * 24 * 1;
       			scad = new Date(now.getTime() + oneDay);
       		}
       	}
            	
       	if(sharedDataService.getMail() == null || sharedDataService.getMail() == ''){
       		sharedDataService.setMail($scope.tmp_user.mail);	// I set the mail for the user that do not have the info in the card
       	} else {
       		$scope.tmp_user.mail = sharedDataService.getMail();
       	}
            	
       	if($scope.checkRequirement() == false){
       		$scope.setLoading(false);
       		return false;
       	}
       	var extraComType = {};
       	if(ec_type != null){
       		extraComType = {
        		permesso: ec_type.permesso,
        		lavoro : ec_type.lavoro,
        		ricevutaPermessoSoggiorno : ec_type.ricevutaPermessoSoggiorno,
        		scadenzaPermessoSoggiorno : (scad != null)?scad.getTime():scad
           	};
        }
            	
        res_type.cittadinanzaUE = $scope.isUeCitizen();
        var edizione = $scope.getCorrectEdizioneFinanziataTest($scope.getFamilyAllowaces(), sharedDataService.getUeCitizen()); //$scope.getCorrectEdizioneFinanziata($scope.getFamilyAllowaces(), sharedDataService.getUeCitizen());
        var pratica = {	
        	input : {
        		domandaType : {
        			extracomunitariType: extraComType, //extraComType,//ec_type,
        			idEdizioneFinanziata : edizione,
        			numeroDomandaICEF : dom_type.numeroDomandaIcef,
        			residenzaType : res_type
        		},
            	idEnte : cod_ente,
            	userIdentity : $scope.userCF
            },
            cpsData : {
            	email : sharedDataService.getMail(), //(sharedDataService.getMail() == null || sharedDataService.getMail() == '')? $scope.tmp_user.mail : sharedDataService.getMail(),
            	nome : sharedDataService.getName(),
            	cognome : sharedDataService.getSurname(),
            	codiceFiscale : sharedDataService.getUserIdentity(),
            	certBase64 : sharedDataService.getBase64()
            }
        };
            	
        var value = JSON.stringify(pratica);
        if($scope.showLog) console.log("Json value " + value);
            	
        var method = 'POST';
        //var myDataPromise = invokeWSService.getProxy(method, "CreaPratica", null, $scope.authHeaders, value);	
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "CreaPratica", null, $scope.authHeaders, value);	
            	
        myDataPromise.then(function(result){
        	if(result.esito == 'OK'){
        		// Added CF check: if CF card is different that CF Ric I show an error and I block the practice editing
        		var componenti = result.domanda.nucleo.componente;
        		var checkRic = $scope.checkRichiedente(componenti);
        		if(checkRic == 1){	// MB17092014: added check for CF in creation
	        		sharedDataService.setIdDomanda(result.domanda.idObj);
	        		// Retrieve the elenchi info
	                $scope.getElenchi();
	                // Here I have to call the setAutocertificazione method to update the storicoStructRec data
	                if(((res_type.numeroComponenti != null) && (res_type.numeroComponenti > 0))  || (oldPractice != null)){
	                	$scope.setAutocertificazione(result.domanda.idObj, result.domanda.versione);
	                } else {
	                	$scope.struttureRec = []; // Clear the data in struttureRec
	                }
	        		// Here I call the getPracticeMethod
	               	$scope.getPracticeData(result.domanda.idObj, 1, oldPractice);
        		} else if(checkRic == 2){
        			// Here I call the getPracticeMethod
	        		sharedDataService.setIdDomanda(result.domanda.idObj);
	        		// Here I have to call the "change richiedente" method to change the ric CF
	        		$dialogs.notify(sharedDataService.getMsgTextAttention(),sharedDataService.getMsgErrPracticeCreationRichiedenteDonna());
		        	$scope.switchRichiedente($scope.old_ric, $scope.new_ric, res_type, result.domanda, 1, oldPractice);
        		} else {
        			// Here I have to call the method that delete/hide the created practice
        			$scope.deletePractice($scope.userCF, result.domanda.idObj, result.domanda.versione);
        			$scope.setLoading(false);
            		$dialogs.error(sharedDataService.getMsgErrPracticeCreationIcef()); // Icef not correct becouse it belongs to another family
            		return false;
        		}
        		
        	} else {
        		$scope.setLoading(false);
        		$dialogs.error(sharedDataService.getMsgErrPracticeCreationIcef());
        		return false;
        	}
        });	
            	
    };
    
    // Method used to delete a practice (when a user found an icef of another user)
    $scope.deletePractice = function(userId, practiceId, version){
    	var deleteBody = {
    		userIdentity : userId,
    		idDomanda : practiceId,
    		version : version
    	};
    	
    	var value = JSON.stringify(deleteBody);
        if($scope.showLog) console.log("Json value " + value);
            	
        var method = 'POST';
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "EliminaPratica", null, $scope.authHeaders, value);	
            	
        myDataPromise.then(function(result){
        	if(result.esito == 'OK'){
        		if($scope.showLog) console.log("Practice deleting success!");
        	} else {
        		if($scope.showLog) console.log("Practice deleting error!");
        	}
        });
    };
    
    $scope.new_ric = '';
    $scope.old_ric = '';
        	
    $scope.setLoading = function(loading) {
    	$scope.isLoading = loading;
    };
        	
    $scope.setLoadingRic = function(loading) {
    	$scope.isLoadingRic = loading;
    };
        	
    $scope.setLoadingPSC = function(loading) {
    	$scope.isLoadingPSC = loading;
    };
        	
    $scope.setLoadingAss = function(loading) {
    	$scope.isLoadingAss = loading;
    };
       	
    // Method to obtain the Practice data by the id of the request
    // Params: idDomanda -> object id of the practice; type -> call mode of the function (1 standard, 2 edit mode, 3 view mode, 4 cons mode)
    $scope.getPracticeData = function(idDomanda, type, oldPractice) {
    	
    	if(type == 2 || type == 4){
    		$scope.setLoading(true);
       		sharedDataService.setIdDomanda(idDomanda);
       	}
          
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
        	    
        	    if(oldPractice != null){
        	    	// case preload of last practice
        	    	$scope.practice = $scope.mergePracticeData(oldPractice, $scope.practice); // I copy all value from oldPractice to newPractice
        	    	
        	    	$scope.tmpAmbitoTerritoriale = $scope.practice.ambitoTerritoriale1;
        	    	if($scope.tmpAmbitoTerritoriale != null && $scope.tmpAmbitoTerritoriale != ''){
        	    		$scope.myAmbito={
        	    			idObj: $scope.tmpAmbitoTerritoriale.idObj,
        	    			descrizione: $scope.getComuneById($scope.tmpAmbitoTerritoriale.idObj, 3)
        	    		};
        	    		$scope.practice.ambitoTerritoriale1 = $scope.myAmbito.idObj;
        	    	}
        	    	$scope.tmp_user.mail = sharedDataService.getMail();
        	    	$scope.getElenchi();
        	    	if($scope.getFamilyAllowaces() == true){
        	    		$scope.initAlloggioFromEpu($scope.practice.alloggioOccupato);
        	    	}
        	    	$scope.extracomunitariType = $scope.practice.extracomunitariType;
	        	    $scope.residenzaType = $scope.practice.residenzaType;    
	        	    $scope.nucleo = $scope.practice.nucleo;
	        	    $scope.setComponenti($scope.practice.nucleo.componente);
	        	    $scope.indicatoreEco = $scope.nucleo.indicatoreEconomico;
	        	    
	        	    $scope.getAutocertificationData(idDomanda, 10);
        	    	
        	    } else {
        	    	if(type == 99){
        	    		$scope.oldPractice = $scope.practice;
        	    		
        	    		if($scope.isUeCitizen() == false){
        	    			$scope.extracomunitariType = $scope.practice.extracomunitariType;
        	    			$scope.extracomunitariType.scadenzaPermessoSoggiorno = new Date($scope.extracomunitariType.scadenzaPermessoSoggiorno);
    		        	    $scope.checkScadenzaPermesso($scope.extracomunitariType.scadenzaPermessoSoggiorno);
        	    		}
        	    		$scope.residenzaType = $scope.practice.residenzaType;
		        	    if($scope.residenzaType.tipoResidenza == $scope.rtypes_inidoneo[0].value){
		        	    	$scope.isInidoneoForRoomsNum = true;
		        	    }
        	    		
        	    		$scope.nucleo = $scope.practice.nucleo;
    	        	    $scope.setComponenti($scope.nucleo.componente);
        	    		$scope.getAutocertificationData(idDomanda, 0);
        	    		$scope.setPhone($scope.nucleo.componente);
        	    	} else {
	        	    	if(type == 2){
		        	    	$scope.tmpAmbitoTerritoriale = $scope.practice.ambitoTerritoriale1;
		        	    	if($scope.tmpAmbitoTerritoriale != null && $scope.tmpAmbitoTerritoriale != ''){
		        	    		$scope.myAmbito={
		        	    			idObj: $scope.tmpAmbitoTerritoriale.idObj,
		        	    			descrizione: $scope.getComuneById($scope.tmpAmbitoTerritoriale.idObj, 3)
		        	    		};
		        	    		$scope.practice.ambitoTerritoriale1 = $scope.myAmbito.idObj;
		        	    	}
		        	    	$scope.tmp_user.mail = sharedDataService.getMail();
		        	    	$scope.getElenchi();
		        	    	$scope.initAlloggioFromEpu($scope.practice.alloggioOccupato);
		        	    } else if(type == 3){
		        	    	// Added to fix Gasperotti 20141017
		        	    	$scope.tmpAmbitoTerritoriale = $scope.practice.ambitoTerritoriale1;
		        	    	if($scope.tmpAmbitoTerritoriale != null && $scope.tmpAmbitoTerritoriale != ''){
		        	    		$scope.myAmbito={
		        	    			idObj: $scope.tmpAmbitoTerritoriale.idObj,
		        	    			descrizione: $scope.getComuneById($scope.tmpAmbitoTerritoriale.idObj, 3)
		        	    		};
		        	    		$scope.practice.ambitoTerritoriale1 = $scope.myAmbito.idObj;
		        	    	}
		        	    }
		        	    		
		        	    // split practice data into differents objects
		        	    $scope.extracomunitariType = $scope.practice.extracomunitariType;
		        	    $scope.residenzaType = $scope.practice.residenzaType;    
		        	    $scope.nucleo = $scope.practice.nucleo;
		        	    $scope.setPhone($scope.nucleo.componente);
	        	    	
		        	    //$scope.nucleo.monoGenitore = $scope.practice.nucleo.monoGenitore == true ? 'true' : 'false';
		        	    //$scope.nucleo.alloggioSbarrierato = $scope.practice.nucleo.alloggioSbarrierato == true ? 'true' : 'false';
		        	    $scope.setComponenti($scope.nucleo.componente);
		        	    if(type == 2){
		        	    	// Here I have to call the check Richiedente
		        	    	var checkRic = $scope.checkRichiedente($scope.nucleo.componente);
		            		if(checkRic == 1){	// MB21102014: added check for CF in edit
		    	        		// Here I call the getPracticeMethod
		            			$scope.getAutocertificationData(idDomanda, 0);
		            		} else if(checkRic == 2){
		    	        		// Here I have to call the "change richiedente" method to change the ric CF
		    		        	$scope.switchRichiedente($scope.old_ric, $scope.new_ric, null, result.domanda, 2, null);
		            		} else {
		            			$scope.getAutocertificationData(idDomanda, 0);
		            		}
		           		} else if(type == 3){
		           			// View mode
		           			$scope.getElenchi();
		           			$scope.getAutocertificationData(idDomanda, 2);
		           		}
		        	    $scope.indicatoreEco = $scope.nucleo.indicatoreEconomico;
		        	    
		        	    if(type == 1){
		        	    	$scope.setLoading(false);
		        	    	if($scope.checkICEF($scope.practice) == true){
		        	    		if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccPracticeCreation1() + result.domanda.identificativo + sharedDataService.getMsgSuccPracticeCreation2());
		        	    		$scope.continueNextTab();
		        	    	} else {
		        	    		$dialogs.error(sharedDataService.getMsgErrPracticeCreationIcefHigh());
		        	    	}
		        	    } else if(type == 4){
		        	    	
		        			$scope.tmpAmbitoTerritoriale = $scope.practice.ambitoTerritoriale1;
		        	    	if($scope.tmpAmbitoTerritoriale != null && $scope.tmpAmbitoTerritoriale != ''){
		        	    		$scope.myAmbito={
		        	    			idObj: $scope.tmpAmbitoTerritoriale.idObj,
		        	    			descrizione: $scope.getComuneById($scope.tmpAmbitoTerritoriale.idObj, 3)
		        	    		};
		        	    		$scope.practice.ambitoTerritoriale1 = $scope.myAmbito.idObj;
		        	    	}
		        	    	$scope.initAlloggioFromEpu($scope.practice.alloggioOccupato);
		        	    	$scope.getElenchi();
		        	    		
		        	    	// Here I have to call the check Richiedente
		        	    	var checkRic = $scope.checkRichiedente($scope.nucleo.componente);
		        	    	if(checkRic == 1){	// MB23102014: added check for CF in pay
		            	    	$scope.getAutocertificationData(idDomanda, 1);
		            		} else if(checkRic == 2){
		    	        		// Here I have to call the "change richiedente" method to change the ric CF
		    		        	$scope.switchRichiedente($scope.old_ric, $scope.new_ric, null, result.domanda, 3, null);
		            		} else {
		            			// Here it will come only if i am in test (case of cf user not in cf of family)
		            			$scope.getAutocertificationData(idDomanda, 1);
		            		}	
		        	    }
        	    	}
        	    }
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
            
    $scope.setComponenti = function(value){
       	$scope.componenti = value;
    };
    
    // Method used to load the autocertification data from the myweb local db
    // Params: idDomanda -> practice object id; type -> call mode of the function. If 0 only init the autocert params (edit mode), if 1 the method call the payPratica method, if 2 the method init the autocert params (view mode), if 99 is used in edit after changeRic
    $scope.getAutocertificationData = function(idDomanda, type){
   
    	// Here I have to clear the lists
    	$scope.storicoResidenza = [];
    	$scope.struttureRec = [];
    	
    	var changeRic = false;
    	if(type == 99){
    		changeRic = true;
    	}
    	
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
            	console.log("Get Autocertification Data " + JSON.stringify(result.autocertificazione));
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
            			
            			//if(i == periods.length - 1){
            			//	a = new Date();
            			//	a = $scope.correctDateIt(a);
            			//} else {
            				a = periods[i].al;
            			//}
            			
            			//if(type == 10){
	            			//MB29102014: add block to move last end date to now
	            			if(i == periods.length - 1){ // last list object
	            				var endDate = $scope.castToDate($scope.correctDate(a));
	            				var now = new Date();
	            				var endDateMillis = endDate.getTime() + sharedDataService.getSixHoursMillis();
	            				if (endDateMillis < now.getTime()){
	            					a = $scope.correctDateIt(now);
	            				}
	            			}
            			//}
            		
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
            	if(periods.length > 0){
            		var end_period = new Date($scope.practice.dataPresentazione);	
    	    		var totMillisInThreeYear = sharedDataService.getThreeYearsMillis();	//1000 * 60 * 60 * 24 * 360 * 3; // I consider an year of 360 days
    		    	var startMillis = end_period.getTime() - totMillisInThreeYear;
    		    	var start_period = new Date(startMillis);
    		    			
    		    	if($scope.checkAnniContinui(start_period, end_period, $scope.storicoResidenza, 2)){
    		    		autocert_ok.history_res = true;
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
			    			data : $scope.correctDateIt(result.autocertificazione.dataConsensuale),
			    			trib : result.autocertificazione.tribunaleConsensuale
			    	};
			    	$scope.sep.consensual = data;
			    } else if(t_jud != null && t_jud != ""){
			    	$scope.separationType = 'judicial';
			    	$scope.sep.judicial = {};
			    	var data = {
			    			data : $scope.correctDateIt(result.autocertificazione.dataGiudiziale),
			    			trib : result.autocertificazione.tribunaleGiudiziale
			    	};
			    	$scope.sep.judicial = data;
			    } else if(t_tmp != null && t_tmp != ""){
			    	$scope.separationType = 'tmp';
			    	$scope.sep.tmp = {};
			    	var data = {
			    			data : $scope.correctDateIt(result.autocertificazione.dataTemporaneo),
			    			trib : result.autocertificazione.tribunaleTemporaneo
			    	};
			    	$scope.sep.tmp = data;
			    	
			    } else {
			    	$scope.separationType = 'nothing';
			    	$scope.sep = {};
			    }
			    if($scope.sep != null){
			    	autocert_ok.trib = true;
			    }
			    // ------------------------------------------------------------
			    if(type == 10){
			    	$scope.setLoading(false);
        	    	if($scope.checkICEF($scope.practice) == true){
        	    		if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccPracticeCreation1() + $scope.practice.identificativo + sharedDataService.getMsgSuccPracticeCreation2());
        	    		$scope.continueNextTab();
        	    	} else {
        	    		$dialogs.error(sharedDataService.getMsgErrPracticeCreationIcefHigh());
        	    	}
			    } else if(type == 0 || type == 99){
			    	var mail = result.email;
			    	var pos = $scope.findEditPosition($scope.practice, mail, autocert_ok);	//MB22092014 - uncomment to manage F003 update 
       				$scope.startFromSpecIndex(pos, changeRic);
       				//$scope.setLoading(false);
			    } else if(type == 1){
			    	$scope.payPratica(3);
			    } else if(type == 999){
			    	$scope.initEditTabsForPay(2);
			    } else {
			    	$scope.setLoading(false);
			    }
            } else {
            	if(type == 10){
			    	$scope.setLoading(false);
        	    	if($scope.checkICEF($scope.practice) == true){
        	    		if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccPracticeCreation1() + $scope.practice.identificativo + sharedDataService.getMsgSuccPracticeCreation2());
        	    		$scope.continueNextTab();
        	    	} else {
        	    		$dialogs.error(sharedDataService.getMsgErrPracticeCreationIcefHigh());
        	    	}
			    } else if(type == 0 || type == 99){
            		var mail = result.email;
			    	var pos = $scope.findEditPosition($scope.practice, mail, autocert_ok);	//MB22092014 - uncomment to manage F003 update 
       				$scope.startFromSpecIndex(pos, changeRic);
			    } else if(type == 1 || type == 999){
            		// Case of autocertification data not presents
            		//$scope.startFromSpecIndex(0);
            		$dialogs.error(sharedDataService.getMsgErrNoAutocertFromFracticeInPay());
            		$scope.setFrameOpened(false);
            		window.history.back();
            		$scope.setLoading(false);
			    } else {
			    	$scope.setLoading(false);
			    }
            }
            // Mail loading
            if(result != null && result.email != null){
            	$scope.tmp_user.mail = result.email;
        	}
            if(type == 0 || type == 1 || type == 10){
            	$scope.checkRecoveryStruct(1);	// to check the presence of components from recovery structs
            }
        });
    };
    
    // Method to update and store the autocertificazione data - MB17092014
    $scope.setAutocertificazione = function(practiceId, practiceVers){
    	var periodoRes = [];
    	
    	var componenti_strutt = [];
       	var comp1 = {};
       	var comp2 = {};
       	var nameComp = [];
       	var strutture1 = [];
       	var strutture2 = [];
    	
       	if($scope.storicoResidenza != null){
        	for(var i = 0; i < $scope.storicoResidenza.length; i++){
        		var isAire = ($scope.storicoResidenza[i].isAire == null || $scope.storicoResidenza[i].isAire == "") ? false : true;
        		if(i == 0){
        			// case "dalla nascita"
        		    var dataNascita = new Date($scope.componenteMaxResidenza_Obj.persona.dataNascita);
        		    var tmp_Da = $scope.correctDate($scope.storicoResidenza[0].dataDa);
        		    var firstDataDa = $scope.castToDate(tmp_Da);
        		    var diff = firstDataDa.getTime()-dataNascita.getTime();
        		    var oneDay = sharedDataService.getOneDayMillis();  //1000 * 60 * 60 * 24;
        		    var firstStorico = {};
        		    if(diff <= oneDay){
        		    	firstStorico = {
        		    		aire : isAire, //$scope.storicoResidenza[i].isAire, 
        		    		comune : $scope.getComuneById($scope.storicoResidenza[i].idComuneResidenza,2),
        		    		dal : "",
        		    		al : $scope.correctDateIt($scope.storicoResidenza[i].dataA)
        		    	};
        		    } else {
        		    	periodoRes.push({});	// first empty value
        		    	firstStorico = {
        		    		aire : isAire, //$scope.storicoResidenza[i].isAire, 
        		    		comune : $scope.getComuneById($scope.storicoResidenza[i].idComuneResidenza,2),
        		    		dal : $scope.correctDateIt($scope.storicoResidenza[i].dataDa),
        		    	    al : $scope.correctDateIt($scope.storicoResidenza[i].dataA)
        		        };
        		    }
        		    periodoRes.push(firstStorico);
        		} else {
        			var res = {
        				aire : isAire, //$scope.storicoResidenza[i].isAire, 
        				comune : $scope.getComuneById($scope.storicoResidenza[i].idComuneResidenza,2),
        				dal : $scope.correctDateIt($scope.storicoResidenza[i].dataDa),
        				al : $scope.correctDateIt($scope.storicoResidenza[i].dataA)
        			};
        			periodoRes.push(res);
        		}
        	};
        }
    	
       	if($scope.struttureRec != null){
       		for(var i = 0; i < $scope.struttureRec.length; i++){
       			if(i == 0){
       				nameComp[0] = $scope.struttureRec[i].componenteName;
       			} else {
       				if($scope.struttureRec[i].componenteName != nameComp[0]){
       					nameComp[1] = $scope.struttureRec[i].componenteName;
       					break;
       				}
       			}
       		}
            		
       		for(var i = 0; i < $scope.struttureRec.length; i++){
       			var nomeStrutt = $scope.struttureRec[i].structName + " (" + $scope.struttureRec[i].structPlace + ")";
       			var strut = {
       				nome : nomeStrutt,
       				dal : $scope.correctDateIt($scope.struttureRec[i].dataDa),
       				al : $scope.correctDateIt($scope.struttureRec[i].dataA)
       			};
       			if($scope.struttureRec[i].componenteName == nameComp[0]){
       				strutture1.push(strut);
       			} else {
       				strutture2.push(strut);
      			}
       		}
            		
       		comp1 = {
       			nominativo : nameComp[0],
       			strutture : strutture1
       		};
       		componenti_strutt.push(comp1);
       		if(strutture2.length > 0){
       			comp2 = {
       				nominativo : nameComp[1],
                	strutture : strutture2
                };
            	componenti_strutt.push(comp2);
            }
        }
            	
        var sepCons = {};
        var sepJui = {};
        var sepTmp = {};
        if($scope.sep != null){
        	sepCons = $scope.sep.consensual;
        	sepJui = $scope.sep.judicial;
        	sepTmp = $scope.sep.tmp;
        }
        
	    var updateAutocert = {
	          	domandaInfo : {
	           	idDomanda: practiceId,	
	           	userIdentity: $scope.userCF,
	           	version : practiceVers
	        },
		    autocertificazione : {
		      	periodiResidenza : periodoRes,  			
		       	componenteMaggiorResidenza : $scope.componenteMaxResidenza,
		       	totaleAnni : $scope.residenzaAnni,
		        dataConsensuale : (sepCons != null) ? $scope.correctDateIt(sepCons.data) : null,
		        tribunaleConsensuale : (sepCons != null) ? sepCons.trib : null,
		        dataGiudiziale : (sepJui != null) ? $scope.correctDateIt(sepJui.data) : null,
		        tribunaleGiudiziale : (sepJui != null) ? sepJui.trib : null,
		        dataTemporaneo : (sepTmp != null) ? $scope.correctDateIt(sepTmp.data) : null,
		        tribunaleTemporaneo : (sepTmp != null) ? sepTmp.trib : null,
		        componenti : (componenti_strutt.length > 0) ? componenti_strutt : null
		    }
	    };
	        
	    //here I have to call the ws and pass the data 'updateAutoCert'
	    var value = JSON.stringify(updateAutocert);
	    if($scope.showLog) console.log("Dati autocert domanda : " + value);
	        	
	    var method = 'POST';
	    var myDataPromise = invokeWSServiceProxy.getProxy(method, "SalvaAutocertificazione", null, $scope.authHeaders, value);	
	
	    myDataPromise.then(function(result){
		    if(result != null && (result.exception == null && result.error == null)){
		      	if($scope.showLog) console.log("Salvataggio autocertificazione ok : " + JSON.stringify(result));
		    } else {
		      	$dialogs.error(result.exception + " " + result.error);
		    }
		       	
		    $scope.setLoading(false);   
	    });  
    };
            
    // Method to full the "elenchi" used in the app
    $scope.getElenchi = function() {
            	
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
        		// MB28102014: removed 'Comune Rv from list'
        		var ambitiList = result.ambitiTerritoriali;
        		var ambitiListCleaned = [];
        		for(var i = 0; i < ambitiList.length; i++){
        			if(ambitiList[i].descrizione != 'Comune di Rovereto'){
        				ambitiListCleaned.push(ambitiList[i]);
        			}	
        		}
        		sharedDataService.setStaticAmbiti(ambitiListCleaned);
        		sharedDataService.setStaticComuni(result.comuni);
            	//listaEdizioniFinanziate = result.edizioniFinanziate;
        		sharedDataService.setStaticEdizioni(result.edizioniFinanziate);
            	// the first time I use the portal the lists are initialized
            	$scope.listaComuni = result.comuni;
        		$scope.listaComuniVallagarina = $scope.getOnlyComunity(result.comuni);
        		$scope.listaAmbiti = result.ambitiTerritoriali;
        		//$scope.listaEdizioni = result.edizioniFinanziate;
        	});
       	} else {
       		$scope.listaComuni = sharedDataService.getStaticComuni();
       		$scope.listaComuniVallagarina = $scope.getOnlyComunity(sharedDataService.getStaticComuni());
       		$scope.listaAmbiti = sharedDataService.getStaticAmbiti();
       		//$scope.listaEdizioni = sharedDataService.getStaticEdizioni();
       	}
    };
    
    // Method used to retrieve the 'edizioniFinanziate' cod used in practice creation. This value is
    // dinamically retrieve from the ws getElenchi so it is always updated.
    $scope.getCorrectEdizioneFinanziata = function(isAss, isUE){
       	var found = false;
       	var edFin = "";
       	var lEdizioni = sharedDataService.getStaticEdizioni();
            	
       	if(isAss == true && isUE == true){
       		for(var i = 0; (i < lEdizioni.length) && (!found); i++){
       			if(lEdizioni[i].descrizione == "Contributo integrativo su libero mercato, comunitari"){
       				if(lEdizioni[i].idObj != "5526556"){
       					found = true;
       					edFin = lEdizioni[i].idObj;
       				}
       			}
       		}
       	}
       	if(isAss == true && isUE == false){
       		for(var i = 0; (i < lEdizioni.length) && (!found); i++){
       			if(lEdizioni[i].descrizione == "Contributo integrativo su libero mercato, extracomunitari"){
       				if(lEdizioni[i].idObj != "5526557"){
       					found = true;
       					edFin = lEdizioni[i].idObj;
       				}
       			}
       		}
       	}
       	if(isAss == false && isUE == true){
       		for(var i = 0; (i < lEdizioni.length) && (!found); i++){
       			if(lEdizioni[i].descrizione == "Locazione di alloggio pubblico, comunitari"){
       				found = true;
       				edFin = lEdizioni[i].idObj;
       			}
       		}
       	}
       	if(isAss == false && isUE == false){
       		for(var i = 0; (i < lEdizioni.length) && (!found); i++){
       			if(lEdizioni[i].descrizione == "Locazione di alloggio pubblico, extracomunitari"){
       				found = true;
       				edFin = lEdizioni[i].idObj;
       			}
       		}
       	}         	
     	return edFin;
    };
            
    $scope.getCorrectEdizioneFinanziataTest = function(isAss, isUE){
      	var edFin = "";
      	// Per VAS-DEV
//      var alloggioUE = '5526551';
//      var alloggioExtraUE = '5526553';
//      var contributoUE = '5526550';
//      var contributoExtraUE = '5526552';
       	// Per Prod
       	var alloggioUE = '5651335';
       	var alloggioExtraUE = '5651336';
       	var contributoUE = '"5651331';
       	var contributoExtraUE = '5651332';
            	
      	if(isAss == true && isUE == true){
       		edFin = contributoUE;
       	}
       	if(isAss == true && isUE == false){
       		edFin = contributoExtraUE;
       	}
       	if(isAss == false && isUE == true){
       		edFin = alloggioUE;
       	}
       	if(isAss == false && isUE == false){
       		edFin = alloggioExtraUE;
       	}
           	
       	return edFin;
    };
    
    // ############################### End of block - Practice creation, read, delete ##############################
    
    // ################################## Start of block - Practice Update Methods #################################
    // Used to update the alloggioOccupato data
    $scope.updateAlloggioOccupato = function(residenza,alloggioOccupato){
        
    	if(!$scope.lockAlloggioUpdate){
    		$scope.lockAlloggioUpdate = true;
	    	$scope.setLoading(true);
	    	var allog = null;
	    	if(alloggioOccupato != null){
	    		var importo = $scope.correctDecimal(alloggioOccupato.importoCanone, 1);
	    		allog = {
	    			comuneAlloggio : alloggioOccupato.comuneAlloggio,
	    			indirizzoAlloggio : alloggioOccupato.indirizzoAlloggio,
	    			superficieAlloggio : alloggioOccupato.superficieAlloggio,
	    			numeroStanze : alloggioOccupato.numeroStanze,
	    			tipoContratto :	alloggioOccupato.tipoContratto,
	    			dataContratto : $scope.correctDate(alloggioOccupato.dataContratto),
	    			importoCanone : importo
	       	    };
	    	}
	    	var alloggio = {
	           	domandaType : {
	           		residenzaType : residenza,
	           		alloggioOccupatoType : allog,	//alloggioOccupato,
	           		idDomanda : $scope.practice.idObj,
	           		versione: $scope.practice.versione
	          	},
	           	idEnte : cod_ente,
	           	userIdentity : $scope.userCF
	        };
	            	
	        var value = JSON.stringify(alloggio);
	        if($scope.showLog) console.log("Alloggio Occupato : " + value);
	        var method = 'POST';
	        var myDataPromise = invokeWSServiceProxy.getProxy(method, "AggiornaPratica", null, $scope.authHeaders, value);
	            	
	        myDataPromise.then(function(result){
	            if(result.esito == 'OK'){
	            	$scope.setLoading(false);
	            	if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditAlloggio());
	            	$scope.setAlloggioChanged(false);
	            } else {
	            	$scope.setLoading(false);
	            	$dialogs.error(sharedDataService.getMsgErrEditAlloggio());
	            }
	            $scope.lockAlloggioUpdate = false;
	        });
    	}
    };
            
    // Method to update the "residenzaType" of an element - no more used. This data are set in creation form
    $scope.updateResidenza = function(residenza){
       	var residenzaCor = {
           	domandaType : {
           		residenzaType : residenza,
           		idDomanda : $scope.practice.idObj,
           		versione: $scope.practice.versione
           	},
           	idEnte : cod_ente,
           	userIdentity : $scope.userCF
        };
       	var value = JSON.stringify(residenzaCor);
         	
       	var method = 'POST';
       	var myDataPromise = invokeWSServiceProxy.getProxy(method, "AggiornaPratica", null, $scope.authHeaders, value);
            	
      	myDataPromise.then(function(result){
      		if(result.esito == 'OK'){
        		$scope.setLoading(false);
        		if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditResidenza());
        	} else {
        		$scope.setLoading(false);
        		$dialogs.error(sharedDataService.getMsgErrEditResidenza());
        	}
        });
    };
    
    // Method to check if the ambito territoriale is selected or not
    $scope.checkAmbitoTerritoriale = function(){
    	$scope.setLoading(true);
    	if($scope.practice == null || $scope.practice.ambitoTerritoriale1 == null || $scope.practice.ambitoTerritoriale1 == ""){
       		$dialogs.notify(sharedDataService.getMsgTextAttention(),sharedDataService.getMsgTextNoAmbitoSelected());
       	}
    	$scope.setLoading(false);
    };
    
    // Method to update the "ambitoTerritoriale" of an element 
    $scope.updateAmbitoTerritoriale = function(){
       	if($scope.practice == null || $scope.practice.ambitoTerritoriale1 == null || $scope.practice.ambitoTerritoriale1 == ""){
       	//	$dialogs.notify(sharedDataService.getMsgTextAttention(),sharedDataService.getMsgTextNoAmbitoSelected());
       	//	$scope.setLoading(false);
       	} else if($scope.practice.ambitoTerritoriale1.descrizione != 'dalla combobox'){
        	var ambitoTerritoriale = {
        		domandaType : {
        			ambitoTerritoriale1 : $scope.practice.ambitoTerritoriale1,
        			idDomanda : $scope.practice.idObj,
            		versione: $scope.practice.versione
        		},
        		idEnte : cod_ente,
            	userIdentity : $scope.userCF
        	};
        	var value = JSON.stringify(ambitoTerritoriale);
        	if($scope.showLog) console.log("Ambito territoriale da modificare " + JSON.stringify(value));
        	    	
        	var method = 'POST';
        	var myDataPromise = invokeWSServiceProxy.getProxy(method, "AggiornaPratica", null, $scope.authHeaders, value);
      	    	
        	myDataPromise.then(function(result){
        		if(result.esito == 'OK'){
        			if($scope.showLog) console.log("Ambito territoriale modificato " + JSON.stringify(result.domanda.ambitoTerritoriale1));
        			$scope.setLoading(false);
        			if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditAmbito());
        		} else {
        			$scope.setLoading(false);
        			$dialogs.error(sharedDataService.getMsgErrEditAmbito());
        		}
        	});
       	} else {
       		$scope.setLoading(false);
       		if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditAmbito());
       	}
    };
            
    // Method to update the "parentelaStatoCivile" data of every family member 
    $scope.salvaModificheSC = function(type){
       	if(!$scope.isAllFamilyState()){
       		$scope.showSCFamError = true;
       		$scope.setLoadingPSC(false);
       	} else {
       		$scope.showSCFamError = false;	
        	// check correctness of family state
        	if($scope.checkFamilyState()){
        		$scope.setCompEdited(true);
    	    	$scope.setLoadingPSC(true);
    	    	var onlyParentelaESC = [];
    	    	for (var i = 0; i < $scope.componenti.length; i++){
    	    		var p_sc = {
    	    			idNucleoFamiliare: 	$scope.componenti[i].idNucleoFamiliare,
    	    			idObj: $scope.componenti[i].idObj,
    					richiedente: $scope.componenti[i].richiedente,
    					parentela: $scope.componenti[i].parentela,
    					statoCivile: $scope.componenti[i].statoCivile
    					//statoCivile: ($scope.componenti[i].statoCivile == 'SENT_SEP') ? 'GIA_CONIUGATO_A' : $scope.componenti[i].statoCivile
    	    		};
    	    		onlyParentelaESC.push(p_sc);
    	    	}
    	    	var nucleo = {
    	    	    domandaType : {
    	    	    	parentelaStatoCivileModificareType : {
    	    	    		componenteModificareType : onlyParentelaESC,
    	    	    		idDomanda: $scope.practice.idObj,
    		    			idObj: $scope.nucleo.idObj
    	    	    	},
    	    	    	idDomanda : $scope.practice.idObj,
    	    	    	versione: $scope.practice.versione
    	    	    },
    	    	    idEnte : cod_ente,
    	    	    userIdentity : $scope.userCF
    	    	};
       		    
    	    	var value = JSON.stringify(nucleo);
    	    	if($scope.showLog) console.log("Modifica Parentela e SC : " + value);
        				
    			var method = 'POST';
    	    	var myDataPromise = invokeWSServiceProxy.getProxy(method, "AggiornaPratica", null, $scope.authHeaders, value);
        		    	
    	    	myDataPromise.then(function(result){
    	    		if(result.esito == 'OK'){
    	    			if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditParentelaSc());
    	    			$scope.setAutocertificazione($scope.practice.idObj, $scope.practice.versione);		// Here I call the autocertification update
    	    			if($scope.getStartFamEdit() == true){
    	    				$scope.initFamilyTabs(true, false);
    	    			} else {
    	    				$scope.initFamilyTabs(false, false);
    	    			}
    	    			if(type == 0){
    	    				$scope.continueNextTab();
    	    			} else if(type == 1){
    	    				$scope.continueNextEditTab();
    	    			} else {
    	    				//$scope.continueNextEditTabForPay($scope.practice.idObj);
    	    				$scope.continueNextEditTab();
    	    			}
    	    		} else {
    	    			$dialogs.error(sharedDataService.getMsgErrEditParentelaSc());
    	    		}
    	    		$scope.setLoadingPSC(false);    		    		
        		});
        	}
        }
    };
    
    // Method to update the "componenteNucleoFamiliare" data
    $scope.updateComponenteVariazioni = function(componenteVariazioni, disability, isLast){
    	
    	if(!$scope.lockNextCompButton){
    	$scope.lockNextCompButton = true;
    	
    	if(componenteVariazioni.variazioniComponente.anniResidenza != null && componenteVariazioni.variazioniComponente.anniResidenza > 0){
    		$scope.setStartFamEdit(true);
    	}
            	
        // for extra disability: blind and/or mute    	
        if(disability != null){
        	if(disability != "no-consider"){
	          	if(disability.cieco || disability.sordoMuto){
	           		componenteVariazioni.variazioniComponente.gradoInvalidita = 100;
	           	}
	           	
	           	if(disability.catDis != null){
	           		if(disability.catDis == 'CATEGORIA_INVALIDA_1'){
	           			componenteVariazioni.variazioniComponente.gradoInvalidita = 0;
	           		} else {
	           			componenteVariazioni.variazioniComponente.gradoInvalidita = 100;
	           		}
	           	} else {
	           		if(!disability.cieco && !disability.sordoMuto){
	           			componenteVariazioni.variazioniComponente.categoriaInvalidita = null;
	           			componenteVariazioni.variazioniComponente.gradoInvalidita = disability.gradoDis;
	           		}
	          	}
        	}
        } else {
        	componenteVariazioni.variazioniComponente.categoriaInvalidita = null;
        	componenteVariazioni.variazioniComponente.gradoInvalidita = null;
        }
        
        // model for "variazioniComponente"
        var variazioniComponenteCorr = {
            anniLavoro: componenteVariazioni.variazioniComponente.anniLavoro,
            anniResidenza: componenteVariazioni.variazioniComponente.anniResidenza,
            anniResidenzaComune: componenteVariazioni.variazioniComponente.anniResidenzaComune,
            categoriaInvalidita: componenteVariazioni.variazioniComponente.categoriaInvalidita,
            donnaLavoratrice: componenteVariazioni.variazioniComponente.donnaLavoratrice,
            flagResidenza: componenteVariazioni.variazioniComponente.flagResidenza,
            frazione: componenteVariazioni.variazioniComponente.frazione,
            fuoriAlloggio: componenteVariazioni.variazioniComponente.fuoriAlloggio,
            gradoInvalidita: componenteVariazioni.variazioniComponente.gradoInvalidita,
            idComponente: componenteVariazioni.variazioniComponente.idComponente,
            idComuneResidenza: componenteVariazioni.variazioniComponente.idComuneResidenza,
            idObj: componenteVariazioni.variazioniComponente.idObj, // idObj (variazioniComponente)
            indirizzoResidenza: componenteVariazioni.variazioniComponente.indirizzoResidenza,
            //note: componenteVariazioni.variazioniComponente.note,
            decsrCittadinanza: componenteVariazioni.variazioniComponente.decsrCittadinanza,
            numeroCivico: componenteVariazioni.variazioniComponente.numeroCivico,
            ospite: componenteVariazioni.variazioniComponente.ospite,
            pensionato: componenteVariazioni.variazioniComponente.pensionato,
            provinciaResidenza: componenteVariazioni.variazioniComponente.provinciaResidenza,
            telefono: componenteVariazioni.variazioniComponente.telefono
       	};
            	
       	// model for nucleo
    	var nucleo = {
        	domandaType : {
        		nucleoFamiliareComponentiModificareType : {
        			componenteModificareType : [{
        				idNucleoFamiliare: $scope.nucleo.idObj,
        				idObj: componenteVariazioni.idObj,
        				variazioniComponenteModificare: variazioniComponenteCorr
        			}],
        			idDomanda: $scope.practice.idObj,
        			idObj: $scope.nucleo.idObj
        		},
        		idDomanda : $scope.practice.idObj,
        		versione: $scope.practice.versione
        	},
        	idEnte : cod_ente,
        	userIdentity : $scope.userCF
        };
        		
    	var value = JSON.stringify(nucleo);
    	if($scope.showLog) console.log("Nucleo Familiare : " + value);
    		
    	var method = 'POST';
       	var myDataPromise = invokeWSServiceProxy.getProxy(method, "AggiornaPratica", null, $scope.authHeaders, value);
       	
       	myDataPromise.then(function(result){
       		if(result.esito == 'OK'){
       			// Here I have to check if exist data from storico Res and update autocertification data
    			if((componenteVariazioni.variazioniComponente.anniResidenza != null) && (componenteVariazioni.variazioniComponente.anniResidenza > 0)){
    				$scope.setAutocertificazione($scope.practice.idObj, $scope.practice.versione);
    			}
       			$scope.setLoading(false);
       			if(isLast == true){
       				if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditAllComponents());
       			} else {
       				if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditComponentData());
       			}
       			
       		} else {
       			$scope.setLoading(false);
       			//$dialogs.error(sharedDataService.getMsgErrEditComponentData());
       		}
       		$scope.lockNextCompButton = false;
       	});
    	}
    };
            
    // Method to update the extra info of "nucleo familiare". If type == 1 I am in creation mode, if type == 2 I am in edit mode
    $scope.updateNFVarie = function(nucleoFam, type){
        var nucleoCor = {
        	domandaType : {
        		nucleoFamiliareModificareType : {
           			alloggioSbarrierato: nucleoFam.alloggioSbarrierato,
           			componentiExtraIcef: nucleoFam.componentiExtraIcef,
           			numeroStanze: nucleoFam.numeroStanze,
          			idDomanda: $scope.practice.idObj,
           			idObj: $scope.nucleo.idObj
          		},
           		idDomanda : $scope.practice.idObj,
           		versione: $scope.practice.versione
           	},
          	idEnte : cod_ente,
          	userIdentity : $scope.userCF
        };
            	
        var value = JSON.stringify(nucleoCor);
        if($scope.showLog) console.log("Nucleo Extra Info : " + value);
           	
        var method = 'POST';
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "AggiornaPratica", null, $scope.authHeaders, value);
           	
        myDataPromise.then(function(result){
        	if(result.esito == 'OK'){
        		if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditInfoAss());
        		//if(type == 1){ 	// creation mode
        		//	$scope.continueNextTab(); 
        		//} else { 		// edit mode
        		//	$scope.continueNextEditTab();
        		//}
        		//$scope.setInfoAlloggioChanged(false);
        		
        	} else {
        		if($scope.showDialogsSucc) $dialogs.error(sharedDataService.getMsgErrEditInfoAss());
        	}
        	//$scope.stampaScheda($scope.practice.idObj, 0);
        	//$scope.setLoadingAss(false);
        });        	
    };
            
    $scope.setComponenteRichiedente = function(value){
       	$scope.richiedente = value;
    };
            
    // Method to retrieve the practice "richiedente"
    $scope.getComponenteRichiedente = function(){
        var componentiLength = ($scope.componenti != null) ? $scope.componenti.length : 0 ;
        var trovato = false;
        for(var i = 0; i < componentiLength && !trovato; i++){
            if($scope.componenti[i].richiedente == true){
            	$scope.setComponenteRichiedente($scope.componenti[i]);
            }
        }
    };
            
    $scope.edit_parentelaSCiv = false;
            
    $scope.editParentelaSCiv = function(){
       	$scope.edit_parentelaSCiv = true;
    };
            
    $scope.saveParentelaSCiv = function(){
       	$scope.edit_parentelaSCiv = false;
    };
            
    // Method to edit the component variations
    $scope.editComponente = function(componente){
       	$scope.showEditComponents = true;
       	var componentiLength = $scope.componenti.length;
       	var trovato = false;
       	for(var i = 0; i < componentiLength && !trovato; i++){
       		if($scope.componenti[i].idObj == componente.idObj){
       			$scope.componenteTmpEdit = componente; // Load the component
       		}
       	}
    };
            
    // Method to save the component variations
    $scope.salvaComponente = function(componenteVariazioni, disability, isLast){
       	$scope.setLoading(true);
       	$scope.showEditComponents = false;
       	// richiamo a modifica nucleo famigliare componenti
       	$scope.updateComponenteVariazioni(componenteVariazioni, disability, isLast);
    };
            
    $scope.setChangeRichiedente = function(value){
       	 $scope.cambiaRichiedente = value;
    };
            
    $scope.setLoadingRic = function(value){
       	$scope.isLoadingRic = value;
    };
            
    $scope.confermaRichiedente = function(){
       	// Here i call the service to update the value of "monoGenitore"
       	$scope.setLoadingRic(true);
       	$scope.updateMonoGen();
    };
            
    // Method to update the monoGenitore field of "nucleo familiare"
    $scope.updateMonoGen = function(){
    	if($scope.nucleo != null){
	        var nucleoCor = {
	        	domandaType : {
	        		nucleoFamiliareModificareType : {
	           			monoGenitore: $scope.nucleo.monoGenitore,
	           			idDomanda: $scope.practice.idObj,
	           			idObj: $scope.nucleo.idObj
	           		},
	           		idDomanda : $scope.practice.idObj,
	           		versione: $scope.practice.versione
	           	},
	           	idEnte : cod_ente,
	          	userIdentity : $scope.userCF
	        };
	            	
	        var value = JSON.stringify(nucleoCor);
	        if($scope.showLog) console.log("Nucleo Mono Genitore : " + value);
	            	
	        var method = 'POST';
	        var myDataPromise = invokeWSServiceProxy.getProxy(method, "AggiornaPratica", null, $scope.authHeaders, value);
	            	
	        myDataPromise.then(function(result){
	        	if(result.esito == 'OK'){
	        		if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditNucleoFam());
	        	} else {
	        		$dialogs.error(sharedDataService.getMsgErrEditNucleoFam());
	        	}
	        	$scope.setLoadingRic(false);
	        }); 
    	} else {
    		$scope.setLoadingRic(false);
    	}	
    };
            
    $scope.changeRichiedente = function(){
       	$scope.OldRichiedente = angular.copy($scope.richiedente.idObj);
       	//$scope.IdRichiedente = $scope.richiedente.idObj;
       	$scope.setChangeRichiedente(true);
    };
            
    $scope.hideChangeRichiedente = function(){
       	$scope.setChangeRichiedente(false);
    };
            
    // Function to swith user "richiedente" between the family members.
    // Param type: if 1 the function is called in creation mode, if 2 the function is called in edit mode.
    $scope.switchRichiedente = function(id_oldRic, id_newRic, res_type, domanda, type, oldPractice){        	
        //var new_richiedente = $scope.richiedente.idObj;
           	
        var nucleo = {
            	domandaType : {
            		parentelaStatoCivileModificareType : {
            			componenteModificareType : [{
            				idNucleoFamiliare: domanda.nucleo.idObj,
            				idObj: id_oldRic,//$scope.OldRichiedente,
            				richiedente: false,
            				parentela: $scope.affinities[0].value
            			},{
            				idNucleoFamiliare: domanda.nucleo.idObj,
            				idObj: id_newRic,//new_richiedente,
            				richiedente: true,
            				parentela: null
            			}],
            			idDomanda: domanda.idObj,
            			idObj: domanda.nucleo.idObj
            		},
            		idDomanda : domanda.idObj,
            		versione: domanda.versione
            	},
          	idEnte : cod_ente,
          	userIdentity : $scope.userCF
        };
            	
        var value = JSON.stringify(nucleo);
        if($scope.showLog) console.log("Cambia Richiedente domanda : " + value);
        		
        var method = 'POST';
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "AggiornaPratica", null, $scope.authHeaders, value);
            	
        myDataPromise.then(function(result){
        	if(result.esito == 'OK'){
        		if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccChangeRic());
        		//$scope.setComponenti(result.domanda.nucleo.componente);
        		$scope.getComponenteRichiedente();
        		//$scope.setComponenteRichiedente(result.domanda.nucleo.componente[0]);
        		//if($scope.showLog) console.log("Cambia Richiedente risposta : " + JSON.stringify(result.domanda.nucleo));
        		$scope.updateResidenzaRichiedente(id_newRic, res_type, domanda, type, oldPractice);
        		
        	} else {
        		$dialogs.error(sharedDataService.getMsgErrChangeRic());
        	}
        	$scope.setLoadingRic(false);
        });        	
    };
    
    // Method to copy the residenza data into the new richiedente component
    // Param type: if 1 the function is called in creation mode, if 2 the function is called in edit mode.
    $scope.updateResidenzaRichiedente = function(new_ric_comp, res_type, domanda, type, oldPractice){
            
    	var obj_old_ric = null;
    	var obj_new_ric = null;
    	for(var i = 0; i < domanda.nucleo.componente.length; i++){
    		var tmp_comp = domanda.nucleo.componente[i].variazioniComponente;
    		if(tmp_comp.indirizzoResidenza != null && tmp_comp.indirizzoResidenza != ""){
    			obj_old_ric = tmp_comp;
    		} else if(tmp_comp.idComponente == new_ric_comp){
    			obj_new_ric = tmp_comp;
    		}
    	}
        // model for "variazioniComponente"
        var variazioniComponenteCorr = {
        	anniLavoro: obj_new_ric.anniLavoro,
            anniResidenza: obj_new_ric.anniResidenza,
            anniResidenzaComune: obj_new_ric.anniResidenzaComune,
            categoriaInvalidita: obj_new_ric.categoriaInvalidita,
            donnaLavoratrice: obj_new_ric.donnaLavoratrice,
            flagResidenza: obj_new_ric.flagResidenza,
            frazione: obj_old_ric.frazione,
            fuoriAlloggio: obj_new_ric.fuoriAlloggio,
            gradoInvalidita: obj_new_ric.gradoInvalidita,
            idComponente: new_ric_comp,
            idComuneResidenza: obj_old_ric.idComuneResidenza,
            idObj: obj_new_ric.idObj,
            indirizzoResidenza: obj_old_ric.indirizzoResidenza,
            decsrCittadinanza: obj_new_ric.decsrCittadinanza,
            numeroCivico: obj_old_ric.numeroCivico,
            ospite: obj_new_ric.ospite,
            pensionato: obj_new_ric.pensionato,
            provinciaResidenza: obj_old_ric.provinciaResidenza,
            telefono: obj_old_ric.telefono
       	};
            	
       	// model for nucleo
    	var nucleo = {
        	domandaType : {
        		nucleoFamiliareComponentiModificareType : {
        			componenteModificareType : [{
        				idNucleoFamiliare: domanda.nucleo.idObj,
        				idObj: new_ric_comp,
        				variazioniComponenteModificare: variazioniComponenteCorr
        			}],
        			idDomanda: domanda.idObj,
        			idObj: domanda.nucleo.idObj
        		},
        		idDomanda : domanda.idObj,
        		versione: domanda.versione
        	},
        	idEnte : cod_ente,
        	userIdentity : $scope.userCF
        };
        		
    	var value = JSON.stringify(nucleo);
    	if($scope.showLog) console.log("Copy Residenza : " + value);
    		
    	var method = 'POST';
       	var myDataPromise = invokeWSServiceProxy.getProxy(method, "AggiornaPratica", null, $scope.authHeaders, value);
       	
       	myDataPromise.then(function(result){
       		if(result.esito == 'OK'){
       			// Here I have to check if exist data from storico Res and update autocertification data
       			$scope.setLoading(false);
       			if($scope.showDialogsSucc) $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccEditComponentData());
       			if(type == 1){
       				// Retrieve the elenchi info
	                $scope.getElenchi();
	                // Here I have to call the setAutocertificazione method to update the storicoStructRec data
	                if(((res_type.numeroComponenti != null) && (res_type.numeroComponenti > 0)) || (oldPractice != null)){
	                	$scope.setAutocertificazione(result.domanda.idObj, result.domanda.versione);
	                } else {
	                	$scope.struttureRec = []; // Clear the data in struttureRec
	                }
       				$scope.getPracticeData(result.domanda.idObj, 1, oldPractice);
	                
       			} else if(type == 2){
       				$scope.nucleo = result.domanda.nucleo;
       				$scope.setComponenti($scope.nucleo.componente);
       				$scope.getAutocertificationData(result.domanda.idObj, 99);
       			} else {
       				$scope.nucleo = result.domanda.nucleo;
       				$scope.setComponenti($scope.nucleo.componente);
       				$scope.getAutocertificationData(result.domanda.idObj, 999);
       			}
       			
       		} else {
       			$scope.setLoading(false);
       			$dialogs.error(sharedDataService.getMsgErrEditComponentData());
       		}
       	});
    };
            
    $scope.setCompEdited = function(value){
       	$scope.compEdited = value;
    };   
    
    var startedFamEdit = false;
    $scope.setStartFamEdit = function(value){
    	startedFamEdit = value;
    };
    
    $scope.getStartFamEdit = function(){
    	return startedFamEdit;
    };
    
    $scope.save_info = function(nucleo, type){
       	//$scope.setLoadingAss(true);
       	$scope.updateNFVarie(nucleo, type);
       	$scope.edit_infoAssegnaz = false;
    };
    
    // #################################### End of block - Practice Update Methods #####################################
            
    //#################################### Start of block - Practice state switch section ###############################
    
    $scope.updateProtocolla = function(){
        $scope.showProtocolla(true);
    };
            
    $scope.showProtocolla = function(value){
       	$scope.isProtocollaShow = value;
    };
    
    $scope.stampaScheda = function(idPratica, type){
      	$scope.setLoading(true);
            	
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
           		if($scope.showLog) console.log("Dati scheda domanda - result : " + JSON.stringify(result));
	       		$scope.scheda = result.domanda.assegnazioneAlloggio;
	       		$scope.punteggi = result.domanda.dati_punteggi_domanda.punteggi;
	       		$scope.punteggiTotali = $scope.cleanTotal(result.domanda.dati_punteggi_domanda.punteggi.punteggio_totale.totale_PUNTEGGIO.dettaglio.calcolo); //$scope.cleanTotal() + ",00"
	        	if(type == 1){
	        		// Case view practice json from list
	        		 $scope.getPracticeData(idPratica, 3, null);
	        	} else if(type == 3){
	        		$scope.getSchedaPDF(type);	// I call here the function for PDF becouse I need to wait the response of pay before proceed
	        	} else {
	        		$scope.setLoading(false);
	        	}
        	} else {
        		$scope.setLoading(false);
        		$dialogs.error(sharedDataService.getMsgErrPracticeViewJson());
        	}
       	});
    };
            
    // method to obtain the link to the pdf of the practice
    $scope.getSchedaPDF = function(type){
       	var periodoRes = [];
       	if($scope.storicoResidenza != null){
        	for(var i = 0; i < $scope.storicoResidenza.length; i++){
        		var isAire = ($scope.storicoResidenza[i].isAire == null || $scope.storicoResidenza[i].isAire == "") ? false : true;
        		if(i == 0){
        			// case "dalla nascita"
        		    var dataNascita = new Date($scope.componenteMaxResidenza_Obj.persona.dataNascita);
        		    var tmp_Da = $scope.correctDate($scope.storicoResidenza[0].dataDa);
        		    var firstDataDa = $scope.castToDate(tmp_Da);
        		    var diff = firstDataDa.getTime()-dataNascita.getTime();
        		    var oneDay = sharedDataService.getOneDayMillis();  //1000 * 60 * 60 * 24;
        		    var firstStorico = {};
        		    if(diff <= oneDay){
        		    	firstStorico = {
        		    		aire : isAire, //$scope.storicoResidenza[i].isAire, 
        		    		comune : $scope.getComuneById($scope.storicoResidenza[i].idComuneResidenza,2),
        		    		dal : "",
        		    		al : $scope.correctDateIt($scope.storicoResidenza[i].dataA)
        		    	};
        		    } else {
        		    	periodoRes.push({});	// first empty value
        		    	firstStorico = {
        		    		aire : isAire, //$scope.storicoResidenza[i].isAire, 
        		    		comune : $scope.getComuneById($scope.storicoResidenza[i].idComuneResidenza,2),
        		    		dal : $scope.correctDateIt($scope.storicoResidenza[i].dataDa),
        		    	    al : $scope.correctDateIt($scope.storicoResidenza[i].dataA)
        		        };
        		    }
        		    periodoRes.push(firstStorico);
        		} else {
        			var res = {
        				aire : isAire, //$scope.storicoResidenza[i].isAire, 
        				comune : $scope.getComuneById($scope.storicoResidenza[i].idComuneResidenza,2),
        				dal : $scope.correctDateIt($scope.storicoResidenza[i].dataDa),
        				al : $scope.correctDateIt($scope.storicoResidenza[i].dataA)
        			};
        			periodoRes.push(res);
        		}
        	};
        }
    	
       	var componenti_strutt = [];
       	var comp1 = {};
       	var comp2 = {};
       	var nameComp = [];
       	var strutture1 = [];
       	var strutture2 = [];
       	if($scope.struttureRec != null){
       		for(var i = 0; i < $scope.struttureRec.length; i++){
       			if(i == 0){
       				nameComp[0] = $scope.struttureRec[i].componenteName;
       			} else {
       				if($scope.struttureRec[i].componenteName != nameComp[0]){
       					nameComp[1] = $scope.struttureRec[i].componenteName;
       					break;
       				}
       			}
       		}
            		
       		for(var i = 0; i < $scope.struttureRec.length; i++){
       			var nomeStrutt = $scope.struttureRec[i].structName + " (" + $scope.struttureRec[i].structPlace + ")";
       			var strut = {
       				nome : nomeStrutt,
       				dal : $scope.correctDateIt($scope.struttureRec[i].dataDa),
       				al : $scope.correctDateIt($scope.struttureRec[i].dataA)
       			};
       			if($scope.struttureRec[i].componenteName == nameComp[0]){
       				strutture1.push(strut);
       			} else {
       				strutture2.push(strut);
      			}
       		}
            		
       		comp1 = {
       			nominativo : nameComp[0],
       			strutture : strutture1
       		};
       		componenti_strutt.push(comp1);
       		if(strutture2.length > 0){
       			comp2 = {
       				nominativo : nameComp[1],
                	strutture : strutture2
                };
            	componenti_strutt.push(comp2);
            }
        }
            	
        var sepCons = {};
        var sepJui = {};
        var sepTmp = {};
        if($scope.sep != null){
        	sepCons = $scope.sep.consensual;
        	sepJui = $scope.sep.judicial;
        	sepTmp = $scope.sep.tmp;
        }
            	
        var getPDF = {
        	domandaInfo : {
        		idDomanda: $scope.practice.idObj,	
               	userIdentity: $scope.userCF,
               	version : $scope.practice.versione
        	},
        	autocertificazione : {
            	periodiResidenza : periodoRes,  			
            	componenteMaggiorResidenza : $scope.componenteMaxResidenza,
            	totaleAnni : $scope.residenzaAnni,
            	//totaleMesi : 2,
            	//iscrittoAIRE : $scope.componenteAire,
            	//aireanni : $scope.aireAnni,
                //airemesi : 4,
                //airecomuni : comuniAIRE,
                dataConsensuale : (sepCons != null) ? $scope.correctDateIt(sepCons.data) : null,
                tribunaleConsensuale : (sepCons != null) ? sepCons.trib : null,
                dataGiudiziale : (sepJui != null) ? $scope.correctDateIt(sepJui.data) : null,
                tribunaleGiudiziale : (sepJui != null) ? sepJui.trib : null,
                dataTemporaneo : (sepTmp != null) ? $scope.correctDateIt(sepTmp.data) : null,
                tribunaleTemporaneo : (sepTmp != null) ? sepTmp.trib : null,
                componenti : (componenti_strutt.length > 0) ? componenti_strutt : null
            }
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
        		$scope.setPdfCorrect(false);
        		$scope.setLoading(false);
        	} else if(result.exception != null){
        		var message = JSON.stringify(result.exception);
        		if(message.indexOf("ALC-") != -1){ // to solve bug pdf conversion in infoTN JB
        			$dialogs.notify(sharedDataService.getMsgTextAttention(), sharedDataService.getMsgErrPracticeViewPdf());
        		} else {
        			message = message.replace("è", "e'");
        			$dialogs.notify(sharedDataService.getMsgTextAttention(), message);
        		}
        		$scope.setPdfCorrect(false);
        		$scope.setLoading(false);
        	} else {		
        		//$scope.pdfResponse = result.result;
            	//$scope.linkPdf = 'data:application/pdf;base64,' + encodeURIComponent($base64.encode(result));//result.result.link;
            	$scope.createPdf(result);		
            	//$scope.linkPdf = 'data:application/octet-stream; Content-Disposition: attachment;base64,' + encodeURIComponent($base64.encode(result));//result.result.link;
            	//$scope.namePdf = result.result.attachment.name;
            	//if($scope.showLog) console.log("Respons Pdf " + JSON.stringify(result));		
            	$scope.setPdfCorrect(true);
            	if(type == 1){
            		$scope.continueNextTab();
            	} else {
            		if(type == 3){
            			// Fix to Gasperotti's 20141020 bug
            			$scope.setCompEdited(true);
        	    		$scope.getComponenteRichiedente();
            			$scope.setStartFamEdit(true);
        	    		$scope.initFamilyTabs(true, false); //$scope.initFamilyTabs(true);
            		}
            		$scope.continueNextEditTab();
            	}
        	    $scope.setLoading(false);
            }
        });
    };
            
    $scope.setPdfCorrect = function(value){
       	$scope.isPdfCorrectly = value;
    };
    
    $scope.openDoc = function(value){
    	window.open("/" + value, '_blank');
    };
    
    $scope.createPdf = function(data){
    	var method = 'POST';
        var myDataPromise = invokePdfServiceProxy.getProxy(method, "rest/pdf", null, $scope.authHeaders, data);	
            	
        myDataPromise.then(function(result){
        	$scope.filePdf = "pdf/" + result;
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
    
    // Method used to pay
    $scope.pagamento = {};
    $scope.payPratica = function(type){
    	if(type != 3){
	       	var paga = {
	       		idDomanda: $scope.practice.idObj,	
	       		identificativo: $scope.pagamento.cf,
	       		oraEmissione: $scope.pagamento.ora,
	       		giornoEmissione: $scope.correctDateIt($scope.pagamento.giorno)
	       	};
	            	
	       	var value = JSON.stringify(paga);
	       	if($scope.showLog) console.log("Dati pagamento : " + value);
	            	
	       	var method = 'POST';
	       	var myDataPromise = invokeWSServiceProxy.getProxy(method, "Pagamento", null, $scope.authHeaders, value);	
	
	       	myDataPromise.then(function(result){
	       		if($scope.showLog) console.log("Respons pagamento " + JSON.stringify(result));
	       		$scope.getSchedaPDF(type);	// I call here the function for PDF becouse I need to wait the response of pay before proceed
	       	});
    	} else {
    		$scope.stampaScheda($scope.practice.idObj, type);
    	}
    };
            
    $scope.protocolla = function(){
        $scope.setLoading(true);
            	
        var method = 'GET';
        var params = {
        	idDomanda:$scope.practice.idObj,
        	idEnte:cod_ente,
        	userIdentity: $scope.userCF
        };
            	
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "GetDatiPratica", params, $scope.authHeaders, null);	

        myDataPromise.then(function(result){
        	if(result.esito == 'OK'){
        		//var lastPractice = result.domanda;
          		$scope.practice = result.domanda;
           		$scope.accetta($scope.practice);
        	} else {
        		$dialogs.notify(sharedDataService.getMsgTextErr(),sharedDataService.getMsgErrPracticeConfirmation());
           	   	$scope.setLoading(false);
        	}    		
       	});
    };
            
    $scope.accetta = function(value){
    	var domandaData = {
          	idDomanda: value.idObj,	
           	userIdentity: $scope.userCF,
           	version : value.versione
       	};
                	       	
       	var value = JSON.stringify(domandaData);
       	if($scope.showLog) console.log("Dati protocollazione : " + value);
                    	
        var method = 'POST';
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "Accetta", null, $scope.authHeaders, value);	
                    
        myDataPromise.then(function(result){
            if(result.result == null && result.segnalazioni != null){
                var messaggio = '';
                for(var i = 0; i < result.segnalazioni.length; i++){
            	    messaggio = messaggio.concat("<br>" + (i + 1) + " - " + JSON.stringify(result.segnalazioni[i].descrizione) + " ;<br>"); 
                }
                if($scope.showLog) console.log("Errore in protocolla " + messaggio);
                $dialogs.notify(sharedDataService.getMsgTextFailure(),sharedDataService.getMsgErrPracticeConfirmationErrorList() + messaggio);
            } else if((result.exception != null) && (result.exception != '')){
            	if($scope.showLog) console.log("Errore in protocolla " + result.exception);
                $dialogs.notify(sharedDataService.getMsgTextFailure(),sharedDataService.getMsgErrPracticeConfirmationExceptionDesc() + result.exception);
            } else {
            	if($scope.showLog) console.log("Respons Protocolla " + JSON.stringify(result));
                $dialogs.notify(sharedDataService.getMsgTextSuccess(),sharedDataService.getMsgSuccPracticeConfirmation());
            }
            $scope.setLoading(false);
            $scope.setWaitForProtocolla(false);
        });
    };
    
    $scope.setWaitForProtocolla = function(wait){
    	$scope.waitForProtocolla = wait;
    };
            
    $scope.rifiuta = function(){
    	$scope.setLoading(true);
            	
        var domandaData = {
            idDomanda: $scope.practice.idObj,	
            userIdentity: $scope.userCF,
            version : $scope.practice.versione
        };
               	
        var value = JSON.stringify(domandaData);
        if($scope.showLog) console.log("Dati rifiuta : " + value);
                	
        var method = 'POST';
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "Rifiuta", null, $scope.authHeaders, value);	

        myDataPromise.then(function(result){
        	if($scope.showLog) console.log("Respons Rifiuta " + JSON.stringify(result));
            $dialogs.notify(sharedDataService.getMsgTextRefused(),sharedDataService.getMsgSuccPracticeRefused());
            $scope.setLoading(false);
            $scope.setWaitForProtocolla(false);
        });

    };
    //###################################### End of block - Practice state switch section #################################
    // ------------------------------------- End of block WS INFOTN service call methods ----------------------------------
    
    // Method used to get the municipality by the id
    $scope.getMunicipalityById = function(cod){
         var found = $filter('getById')($scope.municipalities, cod);
         if($scope.showLog) console.log(found);
         return found.name;
    };
            
            
    $scope.isPracticeFrameOpened = function(){
       	return sharedDataService.isOpenPracticeFrame();
    };
                          	
    $scope.showPractice = function(){
       	sharedData.setShowHome(true);
    };
            
    // For user shared data
    $scope.getUserName = function(){
       return sharedDataService.getName();
    };
            
    $scope.getUserSurname = function(){
       return sharedDataService.getSurname();
    };
                          
    // Used for modal dialog
    $scope.modalShown = false;
    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
    };
                          	
    
                              
    $scope.practices = [];
            
    $scope.getPracticesByTypeWS = function(type, paramType) {
    	$scope.setLoadingPractice(true);
        var method = 'GET';
        var params = {
        	idEnte:cod_ente,
        	userIdentity: $scope.userCF
        };
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "RicercaPratiche", params, $scope.authHeaders, null);
        myDataPromise.then(function(result){
        	
        	// wait of 6 sec for having the true practices states in the list
        	if(paramType == '3'){
        		$timeout(function(){ 
        			$scope.practicesWS = result.domanda;
            		$scope.getPracticesMyWebByType(type);
       		 }, 6000);
        	} else {
        		$scope.practicesWS = result.domanda;
        		$scope.getPracticesMyWebByType(type);
        	}
        });
    };
            
    // Method that read the list of the practices from the local mongo DB
    $scope.getPracticesMyWebByType = function(type) {
        $scope.setLoadingPractice(true);
        var method = 'GET';
        var params = {
      		userIdentity: $scope.userCF
       	};
        var myDataPromise = invokeWSServiceProxy.getProxy(method, "GetPraticheMyWeb", params, $scope.authHeaders, null);
        myDataPromise.then(function(result){
           	$scope.practicesMy = result;
           	//console.log("Pratiche recuperate da myweb: " + $scope.practicesMy);
           	$scope.mergePracticesData($scope.practicesWS, $scope.practicesMy, type);
           	$scope.setLoadingPractice(false);
        });
    };
            
    // Method that add the correct status value to every practice in list
    // It merge the value from two lists: practices from ws and practices from local mongo
    $scope.mergePracticesData = function(practiceListWs, practiceListMy, type){
       	var practicesWSM = [];
       	$scope.practicesOldEF = [];
       	//var now = new Date();
       	if(practiceListWs != null){
       		for(var i = 0; i < practiceListWs.length; i++){
       			//var millisCloseDate = practiceListWs[i].edizioneFinanziata.edizione.dataChiusura;
       			//if(millisCloseDate > now.getTime()){
		           	for(var j = 0; j < practiceListMy.length; j++){
		           		if(practiceListWs[i].idObj == practiceListMy[j].idDomanda){
		           			// Add a filter for 'EDITABILE' && 'PAGATA'. I use the 'statoDomanda' value
							if((practiceListMy[j].status == 'EDITABILE') || (practiceListMy[j].status == 'PAGATA')){
								practiceListWs[i].myStatus = practiceListWs[i].statoDomanda;
							} else {
								practiceListWs[i].myStatus = practiceListMy[j].status;
							}
		           			if((practiceListMy[j].status == 'EDITABILE') || (practiceListMy[j].status == 'PAGATA') ||  (practiceListMy[j].status == 'ACCETTATA')  ||  (practiceListMy[j].status == 'RIFIUTATA')){
		           				practicesWSM.push(practiceListWs[i]);
		           			}
		           			break;
		           		}
		           	}
       			//} else {
       				// Here I save the data in the list for old financial edition
       				//$scope.practicesOldEF.push(practiceListWs[i]);
       			//}  	
	        }
        }
            	
        if(type == 1){
       		$scope.practicesEdilWS = $scope.getPracticeEdil(practicesWSM, sharedDataService.getUeCitizen());
       		sharedDataService.setPracticesEdil($scope.practicesEdilWS);
       		$scope.practicesEdilWS = $scope.checkInClassification($scope.practicesEdilWS);
       		sharedDataService.setOldPractices(practicesWSM);
      	} else {
    		$scope.practicesAssWS = $scope.getPracticeAss(practicesWSM, sharedDataService.getUeCitizen());
    		sharedDataService.setPracticesAss($scope.practicesAssWS);
    		$scope.practicesAssWS = $scope.checkInClassification($scope.practicesAssWS);
    		sharedDataService.setOldPractices(practicesWSM);
    	}
        $scope.setLoadingPractice(false);
    };
            
    $scope.getPracticeAss = function(lista, ue){
       	var pAss = [];
       	if(lista != null){
	       	for(var i = 0; i < lista.length; i++){
	       		if(ue){
	       			if((lista[i].edizioneFinanziata.edizione.strumento.tipoStrumento == 'CONTRIBUTO_ALL_PRIVATO') && (lista[i].edizioneFinanziata.categoria == 'COMUNITARI')){
	       				pAss.push(lista[i]);
	       			}
	       		} else {
	       			if((lista[i].edizioneFinanziata.edizione.strumento.tipoStrumento == 'CONTRIBUTO_ALL_PRIVATO') && (lista[i].edizioneFinanziata.categoria == 'EXTRACOMUNITARI')){
	       				pAss.push(lista[i]);
	       			}
	       		}
	       	}
       	}
       	return pAss;
    };
            
    $scope.getPracticeEdil = function(lista, ue){
       	var pEdil = [];
       	if(lista != null){
	       	for(var i = 0; i < lista.length; i++){
	      		if(ue){
	       			if((lista[i].edizioneFinanziata.edizione.strumento.tipoStrumento == 'LOCAZIONE_ALL_PUBBLICO') && (lista[i].edizioneFinanziata.categoria == 'COMUNITARI')){
	       				pEdil.push(lista[i]);
	       			}
	      		} else {
	       			if((lista[i].edizioneFinanziata.edizione.strumento.tipoStrumento == 'LOCAZIONE_ALL_PUBBLICO') && (lista[i].edizioneFinanziata.categoria == 'EXTRACOMUNITARI')){
	       				pEdil.push(lista[i]);
	       			}
	       		}
	       	}
       	}
      	return pEdil;
    };
                          	
    // adding practices functions
    $scope.checkId = function(id){
       	if(id < 5){
       		return "Id already exists";
       	}
    };
                          	
    $scope.showStates = function(practice){
      	var selected = [];
       	if(practice){
           	selected = $filter('filter')($scope.states, {value: practice.state});
        }
        return selected.length ? selected[0].text : 'Not set';
    };
            
          
}]);