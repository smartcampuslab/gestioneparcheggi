'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('ViewCtrl',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', 'sharedDataService', 'invokeWSServiceProxy', 'uiGmapGoogleMapApi', 'uiGmapIsReady',
                          function($scope, $http, $route, $routeParams, $rootScope, localize, sharedDataService, invokeWSServiceProxy, uiGmapGoogleMapApi, uiGmapIsReady, $location, $filter) { // , uiGmapGoogleMapApi, uiGmapIsReady,

//	uiGmapGoogleMapApi.then(function (maps) {
//		
//		//maps.visualRefresh = true;
//	    //$scope.googleMap = {};
//	    $scope.map = {
//	        center: {
//	        	latitude: 45.88875357753771, 
//				longitude: 11.037440299987793 
//	        },
//	        zoom: 14,
//	        pan: 1,
//	        options: {
//				scrollwheel: false
//			},
//			bounds : {},
//	        //control: {},
//	        events: {
//	            tilesloaded: function (maps, eventName, args) {},
//	            dragend: function (maps) {
//	            	console.log("I am in dragend event function" + maps.getBounds());
//	            },
//	            zoom_changed: function (maps, eventName, args) {
//	            	console.log("I am in zoom change");
//	            	//$scope.$watch();
//	            },
//	            click: function (maps, eventName, args){
//	            	var e = args[0];
//	            	console.log("I am in click event function" + e.latLng);
//	            	var tmppos = {
//	            			lat: e.latLng.C,
//	            			lng: e.latLng.k
//	            	};
//	            	$scope.addMarker(tmppos, maps);
//	            	//$scope.$apply();
//	            },
//	            resize: function (maps, eventName, args) {
//	            	console.log("I am in map resize");
//	            	//$scope.$watch();
//	            }
//	        }
//	    };
//	    
//	    $scope.addMarker(firstPoint, maps);
//	    
//	    //$scope.getParkingMetersFromDb(maps);
//	    
//	});
//	
//	var firstPoint = {
//		lat: 45.88875357753771,
//		lng: 11.037440299987793
//	};
//	
//    uiGmapIsReady.promise() // if no value is put in promise() it defaults to promise(1)
//    .then(function (instances) {
//       console.log(instances[0].map); // get the current map
//    //    var maps = instances[0].map;
//    //}).then(function (instances) {
//    //	$scope.getParkingMetersFromDb();
//    });
//    //    .then(function () {
//    //   $scope.addMarker(firstPoint, $scope.map);
//    //});
//	
//	
//	var id = 0;
//	$scope.parkingMetersMarkers = [];
//	
//	$scope.initDefaultElements = function(){
//		$scope.mapelements = {
//			rateareas : true,
//			streets : true,
//			parkingmeters : true,
//			parkingstructs : false,
//			bikepoints : false
//		};
//		//$scope.initMapComponents();
//		//$scope.addMarker(firstPoint);
//		$scope.getParkingMetersFromDb();
//		//$scope.addParkingMetersMarkers($scope.getParkingMetersFromDb(), $scope.map);
//		//$scope.addMarker(firstPoint, map);
//	};
//	
//	$scope.changeParkingMetersMarkers = function(){
//		if($scope.mapelements.parkingmeters){
//			$scope.showParkingMetersMarkers();
//		} else {
//			$scope.hideParkingMetersMarkers();
//		}
//	};
//	
//	$scope.showParkingMetersMarkers = function() {
//        for (var m in $scope.parkingMetersMarkers) {
//            m.setMap($scope.map);
//        };
//    };
//    
//    $scope.hideParkingMetersMarkers = function() {
//        for (var m in $scope.parkingMetersMarkers) {
//            m.setMap(null);
//        };
//    };
//	
//	$scope.addParkingMetersMarkers = function(value){//, gmap){
//		for(pm in value){
//			if(pm.geometry != null){
//				var marker = {
//					id: pm.id,
//					coords: {
//						latitude: pm.geometry.lat,
//						longitude: pm.geometry.lng
//					},
//					options: { 
//						draggable: true,
//						visible: true//,
//						//map: gmap
//					}
//				};
//				$scope.parkingMetersMarkers.push(marker);
//			}
//		}
//		//$scope.map.markers = $scope.parkingMetersMarkers;
//	};
//	
//	// Add a marker to the map and push to the array.
//	$scope.addMarker = function (location, m_map) {
//	    var marker = {
//	    	id: id++,
//	        coords: { 
//	        	latitude: location.lat,
//	        	longitude: location.lng
//	        },
//	        options: { 
//	        	draggable: true,
//	        	map: m_map
//	        }
//	    };
//	    $scope.parkingMetersMarkers.push(marker);
//	    
//	    //$scope.map.markers = $scope.parkingMetersMarkers;
//	    //$scope.$apply();
//	    //var tmpMap = $scope.getMapObject();
//	};
//	
//	$scope.getParkingMetersFromDb = function(){
//		var allParkingMeters = "";
//		
//		var method = 'GET';
//
//    	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter", null, $scope.authHeaders, null);
//    	myDataPromise.then(function(result){
//    		allParkingMeters = result;
//    		console.log("Parking Meters retrieved from db: " + JSON.stringify(result));
//    		$scope.addParkingMetersMarkers(allParkingMeters);
//    	});
//    	
//    	return allParkingMeters;
//	};
//	
//	
//	
////	$scope.parkingMetersOptions = {
////		map : $scope.map
////	};
//	
////	$scope.changeParkingMetersMarkers = function(){
////		if($scope.mapelements.parkingmeters){
////			$scope.showParkingMetersMarkers();
////		} else {
////			$scope.hideParkingMetersMarkers();
////		}
////	};
//	
//    
//    
//	// Get the bounds from the map once it's loaded
////	$scope.$watch(function() {
////	    return $scope.map.bounds;
////	}, function(nv, ov) {
////	// Only need to regenerate once
////	   if (!ov.southwest && nv.southwest) {
////	      var markers = [];
////	   	  for (var i = 0; i < 50; i++) {
////	          markers.push(createRandomMarker(i, $scope.map.bounds));
////	   	  }
////	   	  $scope.parkingMetersMarkers = markers;
////	   }
////	}, true);
//	
//	$scope.$watch("map.bounds", function(){
//		return $scope.map;
//	}, true);
	
	$scope.parkingMetersMarkers = [];
	$scope.parkingStructureMarkers = [];
	$scope.bikePointMarkers = [];
	
	$scope.pmMarkerIcon = "imgs/markerIcons/parcometro.png";			// icon for parkingMeter object
	$scope.psMarkerIcon = "imgs/markerIcons/parcheggioStruttura.png";	// icon for parkingStructure object
	$scope.bpMarkerIcon = "imgs/markerIcons/puntobici.png";				// icon for bikePoint object
	
	$scope.authHeaders = {
	    'Accept': 'application/json;charset=UTF-8'
	};
	
	$scope.mapCenter = {
		latitude: 45.88875357753771,
	    longitude: 11.037440299987793
	};
	
	$scope.initPage = function(){
		$scope.mapelements = {
			rateareas : false,
			streets : true,
			parkingmeters : true,
			parkingstructs : false,
			bikepoints : false,
			zones : false
		};
		
	};
	
	// --------------------------------------- Map direct code js -----------------------------------
//	var map;
//	
//	function initialize() {
//		var mapOptions = {
//				zoom: 14,
//				center: new google.maps.LatLng($scope.mapCenter.latitude, $scope.mapCenter.longitude)
//		};
//		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//			
//	}
//
//	google.maps.event.addDomListener(window, 'load', initialize);
	// ----------------------------------------------------------------------------------------------
	
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
	
	$scope.correctMyGeometryPolygon = function(geo){
		var tmpPolygon = {
			points: null
		};
		var points = [];
		for(var i = 0; i < geo.points.length; i++){
			var tmpPoint = geo.points[i];
			points.push(tmpPoint);
		}
		
		tmpPolygon.points = points;

		return tmpPolygon;
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
	
	// ----------------------------------------------------------------------------------------------
	
	
	$scope.initMap = function(pmMarkers, psMarkers, bpMarkers){
		
		$scope.map = {
			control: {},
			center: $scope.mapCenter,
		   zoom: 14,
		    bounds: {}
		};
		
		$scope.options = {
		    scrollwheel: true
		};
		
		if(pmMarkers!= null){
			$scope.mapParkingMetersMarkers = pmMarkers;
		} else {
			$scope.mapParkingMetersMarkers = [];
		}
		if(psMarkers != null){
			$scope.mapParkingStructureMarkers = psMarkers;
		} else {
			$scope.mapParkingStructureMarkers = [];
		}
		if(bpMarkers != null){
			$scope.mapBikePointMarkers = bpMarkers;
		} else {
			$scope.mapBikePointMarkers = [];
		}
		$scope.addMarkerToMap($scope.map);
		$scope.mapReady = true;
		//$scope.$apply();
	};
	
	$scope.addMarkerToMap = function(map){
		if($scope.parkingMetersMarkers != null){
			for(var i = 0; i < $scope.parkingMetersMarkers.length; i++){
				$scope.parkingMetersMarkers[i].options.map = map;
			}
		}
		if($scope.parkingStructureMarkers != null){
			for(var i = 0; i < $scope.parkingStructureMarkers.length; i++){
				$scope.parkingStructureMarkers[i].options.map = map;
			}
		}
		if($scope.bikePointMarkers != null){
			for(var i = 0; i < $scope.bikePointMarkers.length; i++){
				$scope.bikePointMarkers[i].options.map = map;
			}
		}
	};
	
	// Show/hide parkingMeters markers
	$scope.changeParkingMetersMarkers = function(){
		if(!$scope.mapelements.parkingmeters){
			$scope.showParkingMetersMarkers();
		} else {
			$scope.hideParkingMetersMarkers();
		}
	};

	$scope.showParkingMetersMarkers = function() {
        $scope.mapParkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true);
        //$scope.refreshMap();
    };
    
    $scope.hideParkingMetersMarkers = function() {
    	$scope.mapParkingMetersMarkers = [];//$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide parkingStructures markers
    $scope.changeParkingStructuresMarkers = function(){
		if(!$scope.mapelements.parkingstructs){
			$scope.showParkingStructuresMarkers();
		} else {
			$scope.hideParkingStructuresMarkers();
		}
	};
    
    $scope.showParkingStructuresMarkers = function() {
        $scope.mapParkingStructureMarkers = $scope.setAllMarkersMap($scope.parkingStructureMarkers, $scope.map, true);
        //$scope.refreshMap();
    };
    
    $scope.hideParkingStructuresMarkers = function() {
    	$scope.mapParkingStructureMarkers = [];//$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide bikePoints markers
    $scope.changeBikePointsMarkers = function(){
		if(!$scope.mapelements.bikepoints){
			$scope.showBikePointsMarkers();
		} else {
			$scope.hideBikePointsMarkers();
		}
	};
    
    $scope.showBikePointsMarkers = function() {
        $scope.mapBikePointMarkers = $scope.setAllMarkersMap($scope.bikePointMarkers, $scope.map, true);
        //$scope.refreshMap();
    };
    
    $scope.hideBikePointsMarkers = function() {
    	$scope.mapBikePointMarkers = [];//$scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide areas polygons
    $scope.changeAreaPolygons = function(){
		if(!$scope.mapelements.rateareas){
			$scope.showAreaPolygons();
		} else {
			$scope.hideAreaPolygons();
		}
	};
    
    $scope.showAreaPolygons = function() {
    	$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, true);
        //$scope.refreshMap();
    };
    
    $scope.hideAreaPolygons = function() {
    	$scope.mapAreas = $scope.initAreasOnMap($scope.areaWS, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide zones polygons
    $scope.changeZonePolygons = function(){
		if(!$scope.mapelements.zones){
			$scope.showZonePolygons();
		} else {
			$scope.hideZonePolygons();
		}
	};
    
    $scope.showZonePolygons = function() {
    	$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, true);
        //$scope.refreshMap();
    };
    
    $scope.hideZonePolygons = function() {
    	$scope.mapZones = $scope.initZonesOnMap($scope.zoneWS, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    // Show/hide streets polygons
    $scope.changeStreetPolylines = function(){
		if(!$scope.mapelements.streets){
			$scope.showStreetPolylines();
		} else {
			$scope.hideStreetPolylines();
		}
	};
    
    $scope.showStreetPolylines = function() {
    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true);
        //$scope.refreshMap();
    };
    
    $scope.hideStreetPolylines = function() {
    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, false);
        //$scope.refreshMap();
        //$scope.$apply();
    };
    
    $scope.setAllMarkersMap = function(markers, map, visible){
    	for(var i = 0; i < markers.length; i++){
    		markers[i].options.visible = visible;
    		markers[i].options.map = map;
    	}
    	return markers;
    };
    
    $scope.refreshMap = function() {
        //optional param if you want to refresh you can pass null undefined or false or empty arg
        $scope.map.control.refresh($scope.mapCenter);
        //$scope.map.control.refresh(null);
        $scope.map.control.getGMap().setZoom(5);
        $scope.map.control.getGMap().setZoom(14);
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
			data: marker,
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
				data: marker,
				icon: myIcon,
				showWindow: false
//			    events: {
//			    	mouseover: function(marker, eventName, args) {
//			    		var e = args[0];
//			    		console.log("I am in marker mouseover event function " + e);
//			    		marker.show = true;
////			    	 	$scope.$apply();
//			    	},
//			    	click: function (marker, eventName, args){
//		            	var e = args[0];
//		            	console.log("I am in marker click event function " + e.latLng);
//		            	//$scope.$apply();
//		            }	
//			    }
			};
			ret.closeClick = function () {
		        ret.showWindow = false;
		        //$scope.$apply();
		    };
		    ret.onClick = function () {
		    	console.log("I am in ret marker click event function: " + ret.data.code);
		    	ret.showWindow = !ret.showWindow;
		    };
		}
		return ret;
	};
	  
	$scope.initAreasOnMap = function(areas, visible){
		var area = {};
		var poligons = {};
		var tmpAreas = [];
		
		if(areas != null){
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
						visible: visible,
						fill: {
						    color: $scope.correctColor(areas[i].color),
						    opacity: 0.7
						}
					};
					tmpAreas.push(area);
				}
			}
		}
		return tmpAreas;
	};
	
	$scope.initStreetsOnMap = function(streets, visible){
		var street = {};
		var poligons = {};
		var tmpStreets = [];
		
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
					visible: visible
					//icons:
				};
				tmpStreets.push(street);
			}
		}
		return tmpStreets;
	};
	
	$scope.initZonesOnMap = function(zones, visible){
		var zone = {};
		var poligons = {};
		var tmpZones = [];
		
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
					visible: visible,
					fill: {
					    color: $scope.correctColor(zones[i].color),
					    opacity: 0.7
					}
				};
				tmpZones.push(zone);
			}
		}
		return tmpZones;
	};	
		    
	// Get the bounds from the map once it's loaded
//	$scope.$watch(function() {
//		return $scope.map.bounds;
//	}, function(nv, ov) {
//	
//	// Only need to regenerate once
//	if (!ov.southwest && nv.southwest) {
////		var markers = [];
////		    for (var i = 0; i < 50; i++) {
////		        markers.push(createRandomMarker(i, $scope.map.bounds))
////		    }
////		    $scope.randomMarkers = markers;
//			$scope.getParkingMetersFromDb();
////			$scope.$apply();
//		}
//	}, true);
	
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
	
	$scope.initWs = function(){
		$scope.parkingMetersMarkers = [];
		$scope.parkingStructureMarkers = [];
	   	$scope.initPage();
		$scope.mapReady = false;
		$scope.getParkingMetersFromDb();
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
		    $scope.initAreasOnMap($scope.areaWS, false);
		   	$scope.hideAreaPolygons();
		   	
		    sharedDataService.setSharedLocalAreas($scope.areaWS);
		    $scope.getZonesFromDb();
		});
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
	    	$scope.mapStreets = $scope.initStreetsOnMap($scope.streetWS, true);
	    });
	};
		    
    $scope.getParkingMetersFromDb = function(){
    	var markers = [];
		var allParkingMeters = [];
		var method = 'GET';
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingmeter", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allParkingMeters);
	    	console.log("Parking Meters retrieved from db: " + JSON.stringify(result));
	    	//$scope.addParkingMetersMarkers(allParkingMeters);
	    	
	    	for (var i = 0; i <  allParkingMeters.length; i++) {
	    		markers.push(createMarkers(i, allParkingMeters[i], 1));
		    }
	    	angular.copy(markers, $scope.parkingMetersMarkers);
	    	$scope.getParkingStructuresFromDb();
	    });
	};
	
	$scope.getParkingStructuresFromDb = function(){
		var markers = [];
		var allParkingStructures = [];
		var method = 'GET';
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "parkingstructure", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allParkingStructures);
	    	console.log("Parking Structures retrieved from db: " + JSON.stringify(result));
	    	for (var i = 0; i <  allParkingStructures.length; i++) {
	    		markers.push(createMarkers(i, allParkingStructures[i], 2));
		    }
	    	angular.copy(markers, $scope.parkingStructureMarkers);
	    	$scope.getBikePointFromDb();
	    });   	
	};
	
	$scope.getBikePointFromDb = function(){
		var markers = [];
		var allBikePoints = [];
		var method = 'GET';
		
	   	var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint", null, $scope.authHeaders, null);
	    myDataPromise.then(function(result){
	    	angular.copy(result, allBikePoints);
	    	console.log("BikePoints retrieved from db: " + JSON.stringify(result));
	    	for (var i = 0; i <  allBikePoints.length; i++) {
	    		markers.push(createMarkers(i, allBikePoints[i], 3));
		    }
	    	angular.copy(markers, $scope.bikePointMarkers);
	    	//$scope.initMap($scope.parkingMetersMarkers, $scope.parkingStructureMarkers, $scope.bikePointMarkers);
	    	$scope.initMap($scope.parkingMetersMarkers, null, null);
	    	$scope.getAreasFromDb();
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
	    	sharedDataService.setSharedLocalZones($scope.zoneWS);
	    	$scope.initZonesOnMap($scope.zoneWS, false);
	    	$scope.getStreetsFromDb();
	    });
	};
	
	
	
}]);