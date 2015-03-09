'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('ViewCtrl',['$scope', '$http', '$route', '$routeParams', '$rootScope', 'localize', 'sharedDataService', 'invokeWSServiceProxy', 'uiGmapGoogleMapApi', 'uiGmapIsReady',
                          function($scope, $http, $route, $routeParams, $rootScope, localize, sharedDataService, invokeWSServiceProxy, uiGmapGoogleMapApi, uiGmapIsReady, $location, $filter) { // , $location 

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
			rateareas : true,
			streets : true,
			parkingmeters : true,
			parkingstructs : true,
			bikepoints : true
		};
	};
	
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
	
	$scope.changeParkingMetersMarkers = function(){
		if(!$scope.mapelements.parkingmeters){
			$scope.showParkingMetersMarkers();
		} else {
			$scope.hideParkingMetersMarkers();
		}
	};

	$scope.showParkingMetersMarkers = function() {
        $scope.parkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, $scope.map, true);
        $scope.refreshMap();
        //$scope.initMap($scope.parkingMetersMarkers, null);
        //$scope.$apply();
    };
    
    $scope.hideParkingMetersMarkers = function() {
    	$scope.parkingMetersMarkers = $scope.setAllMarkersMap($scope.parkingMetersMarkers, null, false);
    	//$scope.initMap($scope.parkingMetersMarkers, null);
    	//$scope.myRefreshMap($scope.map, $scope.parkingMetersMarkers, null);
        $scope.refreshMap();
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
	
	 $scope.onMarkerClicked = function (marker) {
//	    if (markerToClose) {
//	      markerToClose.showWindow = false;
//	    }
	    markerToClose = marker; // for next go around
	    marker.showWindow = true;
	    $scope.$apply();
	    //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
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
	
	$scope.initWs = function(){
		$scope.parkingMetersMarkers = [];
		$scope.parkingStructureMarkers = [];
	   	$scope.initPage();
		$scope.mapReady = false;
		$scope.getParkingMetersFromDb();
		
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
	    	//$scope.initMap(markers, null);
		    //$scope.randomMarkers = markers;	
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
	    	//$scope.addParkingMetersMarkers(allParkingMeters);
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
	    	//$scope.addParkingMetersMarkers(allParkingMeters);
	    	for (var i = 0; i <  allBikePoints.length; i++) {
	    		markers.push(createMarkers(i, allBikePoints[i], 3));
		    }
	    	angular.copy(markers, $scope.bikePointMarkers);
	    	$scope.initMap($scope.parkingMetersMarkers, $scope.parkingStructureMarkers, $scope.bikePointMarkers);
		    //$scope.randomMarkers = markers;	
	    });   	
	};
	
}]);