'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('BikeCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$route', '$location', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeWSServiceProxy', 'invokePdfServiceProxy', 'getMyMessages', '$base64','$timeout',
                               function($scope, $http, $routeParams, $rootScope, $route, $location, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, invokePdfServiceProxy, getMyMessages, $base64, $timeout) { 
	this.$scope = $scope;
    $scope.params = $routeParams;
    $scope.showLog = true;
    $scope.showLogDates = false;
    $scope.showDialogsSucc = false;
    
    $scope.authHeaders = {
        'Accept': 'application/json;charset=UTF-8'
    };
    
    $scope.maxBPoints = 11;
    
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
    
    $scope.gpsLength = 9;
    $scope.myAppId = "rv";
    
    $scope.bpointWS = [];
     
    // for next and prev in practice list
    $scope.currentPage = 0;
    $scope.numberOfPages = function(type){
       	if(type == 1){
       		if($scope.bpointWS != null){
       			return Math.ceil($scope.bpointWS.length/$scope.maxBPoints);
       		} else {
       			return 0;
      		}
       	}
    };
    
    $scope.initComponents = function(){
	    $scope.showedObjects = sharedDataService.getVisibleObjList();
	    	for(var i = 0; i < $scope.showedObjects.length; i++){
	    	if($scope.showedObjects[i].id == 'Bp'){
	    		$scope.loadBikeAttributes($scope.showedObjects[i].attributes);
	    	}
	    }
    };
    
    //BikePoint Component settings
    $scope.loadBikeAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			$scope.bp_name = attributes[i];
    		}
    		if(attributes[i].code == 'bikeNumber'){
    			$scope.bp_bikeNumber = attributes[i];
    		}
    		if(attributes[i].code == 'slotNumber'){
    			$scope.bp_slotNumber = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			$scope.bp_geometry = attributes[i];
    		}
    	}
    };
    
    $scope.getAreasFromDb = function(){
    	$scope.areaMapReady = false;
		var allAreas = [];
		var method = 'GET';
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "area", null, $scope.authHeaders, null);
		var myDataPromise = invokeWSService.getProxy(method, "area", null, $scope.authHeaders, null);
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
	
	$scope.getBikePointsFromDb = function(){
		var markers = [];
		$scope.bpMapReady = false;
		var allBpoints = [];
		var method = 'GET';
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint", null, $scope.authHeaders, null);
		var myDataPromise = invokeWSService.getProxy(method, "bikepoint", null, $scope.authHeaders, null);
		myDataPromise.then(function(result){
	    	angular.copy(result, allBpoints);
	    	console.log("BikePoints retrieved from db: " + JSON.stringify(result));
	    	
	    	for (var i = 0; i <  allBpoints.length; i++) {
	    		markers.push(createMarkers(i, allBpoints[i], 3));
		    }
	    	
	    	$scope.bpointWS = allBpoints;
	    	$scope.initBPointMap(markers);
	    	
	    	$scope.initComponents();
	    	
	    	$scope.bpMapReady = true;
	    });
	};
	
	
	// Utility methods
	$scope.correctColor = function(value){
		return "#" + value;
	};
	
	$scope.getPointFromLatLng = function(latLng, type){
		var point = "" + latLng;
		var pointCoord = point.split(",");
		var res;
		if(type == 1){
			var lat = pointCoord[0].substring(1, pointCoord[0].length);
			var lng = pointCoord[1].substring(0, pointCoord[1].length - 1);
		
			res = {
				latitude: lat,
				longitude: lng
			};
		} else {
			var lat = Number(pointCoord[0]);
			var lng = Number(pointCoord[1]);
			res = {
				lat: lat,
				lng: lng
			};
		}
		return res;
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
	
	// View management
	// BikePoints
	$scope.setBpDetails = function(bikePoint){
		$scope.bpViewMapReady = false;
		$scope.mySpecialBPMarkers = [];
		
		$scope.bikePoint = bikePoint;
		
		var toRemLat = 0;
		var toRemLng = 0;
		var sLat = "" + $scope.bikePoint.geometry.lat;
		var sLng = "" + $scope.bikePoint.geometry.lng;
		if(sLat.length > $scope.gpsLength){
			toRemLat = sLat.length - $scope.gpsLength;
		}
		if(sLng.length > $scope.gpsLength){
			toRemLng = sLng.length - $scope.gpsLength;
		}
		$scope.setMyGeometry(sLat.substring(0, sLat.length - toRemLat) + "," + sLng.substring(0, sLng.length - toRemLng));
		
		// Init the map for view
		$scope.pViewBikeMap = {
			control: {},
			center: $scope.mapCenter,
			zoom: 14,
			bounds: {},
			options: {
				scrollwheel: true
			}
		};
		
		$scope.pViewBikeMarkers = $scope.bikePointMarkers;
		for(var i = 0; i < $scope.pViewBikeMarkers.length; i++){
			if($scope.pViewBikeMarkers[i].title == $scope.bikePoint.id){
				$scope.pViewBikeMarkers.splice(i, 1);
				//$scope.bikePointMarkers[i].animation = "BOUNCE";
			};
		}
		
		var mySpecialBPMarker = {
			id: bikePoint.id,
			coords: {
				latitude: $scope.bikePoint.geometry.lat,
				longitude: $scope.bikePoint.geometry.lng
			},
			pos: $scope.bikePoint.geometry.lat + "," + $scope.bikePoint.geometry.lng,
			data: bikePoint,
			visible: true,
			options: { 
				draggable: false,
				animation: "BOUNCE"	//1
			},
			icon: $scope.bpMarkerIcon
		};
		$scope.mySpecialBPMarkers.push(mySpecialBPMarker);
		
		$scope.viewModeBP = true;
		$scope.editModeBP = false;
		$scope.bpViewMapReady = true;
	};
	
	$scope.closeBPView = function(){
		//$scope.mySpecialBPMarker.visible = false;
		$scope.mySpecialBPMarkers = [];
		$scope.getBikePointsFromDb();	// to refresh the data on page
		$scope.viewModeBP = false;
		$scope.editModeBP = false;
	};
	
	// Edit management
	// ParkingStructure
	$scope.setBpEdit = function(bikePoint){
		$scope.editBikePointMarkers = [];
		$scope.newBikePointMarkers = [];
		// Case create
		$scope.isEditing = false;
		$scope.isInit = true;
		
		//$scope.resizeMap();
		
		$scope.bikePoint = {
			id: null,
			id_app: null,
			name: null,
			slotNumber: null,
			bikeNumber: null,
			geometry: null
		};
		
		// Case edit
		if(bikePoint != null){
			$scope.isEditing = true;
			$scope.isInit = false;
			angular.copy(bikePoint, $scope.bikePoint);
			
			$scope.bpEditMap = {
				control: {},
				center: $scope.mapCenter,
				zoom: 15,
				bounds: {},
				options: {
					scrollwheel: true
				}
			};
			
			$scope.setMyGeometry($scope.bikePoint.geometry.lat + "," + $scope.bikePoint.geometry.lng);
			
			$scope.myBp = {
				id: 0,
				coords: {
					latitude: $scope.bikePoint.geometry.lat,
					longitude: $scope.bikePoint.geometry.lng
				},
				pos:$scope.bikePoint.geometry.lat + "," + $scope.bikePoint.geometry.lng,
				options: { 
					draggable: true
				},
				icon: $scope.bpMarkerIcon,
				events: {
				    dragend: function (marker, eventName, args) {
				    	var lat = marker.getPosition().lat();
				    	var lng = marker.getPosition().lng();
				    	console.log('marker dragend: ' + lat + "," + lng);
				    	$scope.setMyGeometry(lat + "," + lng);
				    }
				}
			};
			$scope.editBikePointMarkers.push($scope.myBp);
			
		} else {
			$scope.setMyGeometry(null);
		}
		$scope.viewModeBP = false;
		$scope.editModeBP = true;
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
	// Update ParkingStructure Object
	$scope.updateBpoint = function(form, geo){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingBPErrorMessage = false;
			
			var id = $scope.bikePoint.id;
			var method = 'PUT';
			var bp = $scope.bikePoint;
			
			var data = {
				id: bp.id,
				id_app: bp.id_app,
				name: bp.name,
				slotNumber: bp.slotNumber,
				bikeNumber: bp.bikeNumber,
				geometry: $scope.correctMyGeometry(geo)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Bikepoint data : " + value);
			
		   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint/" + id, null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, "bikepoint/" + id, null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Updated bikepoint: " + result);
		    	if(result != null){//== "OK"){
		    		$scope.getBikePointsFromDb();
					$scope.editModeBP = false;
		    	} else {
		    		$scope.editModeBP = true;
		    		$scope.showUpdatingBPErrorMessage = true;
		    	}
		    });
		}
	};
	
	
	// Object Creation Methods
	// BikePoint
	$scope.createBpoint = function(form, geo){
		if(!form.$valid){
			$scope.isInit=false;
		} else {
			$scope.isInit=true;
			$scope.showUpdatingBPErrorMessage = false;
			
			var method = 'POST';
			var bp = $scope.bikePoint;
			
			var data = {
				id_app: $scope.myAppId,
				name: bp.name,
				slotNumber: bp.slotNumber,
				bikeNumber: bp.bikeNumber,
				geometry: $scope.correctMyGeometry(geo)
			};
			
		    var value = JSON.stringify(data);
		    if($scope.showLog) console.log("Bikepoint data : " + value);
			
		   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint", null, $scope.authHeaders, value);
		   	var myDataPromise = invokeWSService.getProxy(method, "bikepoint", null, $scope.authHeaders, value);
		    myDataPromise.then(function(result){
		    	console.log("Create bikePoint: " + JSON.stringify(result));
		    	if(result != null && result != ""){
		    		$scope.getBikePointsFromDb();
					$scope.editModeBP = false;
		    	} else {
		    		$scope.editModeBP = true;
		    		$scope.showUpdatingBPErrorMessage = true;
		    	}
		    });
		}
	};
	
	// Prepare Delete Methods
	$scope.setBpRemove = function(bPoint){
		var delBike = $dialogs.confirm("Attenzione", "Vuoi cancellare il punto bici '" + bPoint.name + "'?");
			delBike.result.then(function(btn){
				// yes case
				$scope.deleteBPoint(bPoint);
				// Call the delete method
			},function(btn){
				// no case
				// do nothing
        });
	};
	
	// Object Deleting Methods
	$scope.deleteBPoint = function(bPoint){
		$scope.showDeletingBPErrorMessage = false;
		var method = 'DELETE';
		
	   	//var myDataPromise = invokeWSServiceProxy.getProxy(method, "bikepoint/" + bPoint.id , null, $scope.authHeaders, null);
	   	var myDataPromise = invokeWSService.getProxy(method, "bikepoint/" + bPoint.id , null, $scope.authHeaders, null);
	   	myDataPromise.then(function(result){
	    	console.log("Deleted bikePoint: " + JSON.stringify(result));
	    	if(result != null && result != ""){
	    		$scope.getBikePointsFromDb();
	    		//$scope.editModeA = false;
	    	} else {
	    		//$scope.editModeA = true;
	    		$scope.showDeletingBPErrorMessage = true;
	    	}
	    });
	};
	
	// Maps management
	$scope.bikePointMarkers = [];
	$scope.newBikePointMarkers = [];
	
	$scope.pmMarkerIcon = "imgs/markerIcons/parcometro.png";			// icon for parkingMeter object
	$scope.psMarkerIcon = "imgs/markerIcons/parcheggioStruttura.png";	// icon for parkingStructure object
	$scope.bpMarkerIcon = "imgs/markerIcons/puntobici.png";				// icon for bikePoint object
	
	$scope.mapCenter = {
		latitude: 45.88875357753771,
		longitude: 11.037440299987793
	};
	
	//$scope.map = {};
	
	$scope.mapOption = {
		center : sharedDataService.getConfMapCenter(),	//"[" + $scope.mapCenter.latitude + "," + $scope.mapCenter.longitude + "]",
		zoom : parseInt(sharedDataService.getConfMapZoom())
	};
	
	// I need this to resize the map (gray map problem on load)
    $scope.resizeMap = function(){
        google.maps.event.trigger($scope.map, 'resize');
        $scope.map.setCenter($scope.getPointFromLatLng($scope.mapOption.center, 2));
        //$scope.map.setCenter({lat: $scope.mapCenter.latitude,lng:$scope.mapCenter.longitude});
        $scope.map.setZoom($scope.mapOption.zoom);
        return true;
    };
	
	$scope.addNewMarker = function(event) {
		if(!$scope.isEditing){
			$scope.newBikePointMarkers = []; 	// I permit only one marker a time
	        var pos = event.latLng;
	        var i = 0;
	        //$scope.positions.push({lat:pos.lat(), lng: pos.lng()});
	        
	    	var ret = {
	    		id: i,
	    		pos: pos.lat() + "," + pos.lng(),
	    		options: { 
	    		   	draggable: true,
	    		   	visible: true
	    		},
	    		icon: $scope.bpMarkerIcon
	    		//showWindow: false
	//    		events: {
	//    		   	mouseover: function(marker, eventName, args) {
	//    		   		var e = args[0];
	//    		   		console.log("I am in marker mouseover event function " + e);
	//    		   		marker.show = true;
	//    		   		//$scope.$apply();
	//    		   	},
	//    		   	click: function (marker, eventName, args){
	//    		       	var e = args[0];
	//    		       	console.log("I am in marker click event function " + e.latLng);
	//    		       	//$scope.$apply();
	//    		    }	
	//    		}
	    	};
	    	$scope.myGeometry = ret.pos;
	    	return $scope.newBikePointMarkers.push(ret);
		}
    };
    
    $scope.updatePos = function(event){
    	var pos = event.latLng;
    	$scope.myGeometry = pos.lat() + "," + pos.lng();
    };
    
    $scope.moveMarker = function(val){
    	if($scope.newBikePointMarkers!=null && $scope.newBikePointMarkers.length > 0){
    		$scope.newBikePointMarkers[0].pos = val;
    	}
    };
    
    //$scope.reload = function(){
        //google.maps.event.trigger($scope.map,'resize');
    	//$scope.map = new google.maps.Map();
    //};
	
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
				title = marker.id;
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
			    position: "[" + marker.geometry.lat + "," + marker.geometry.lng + "]",
			    options: { 
			    	draggable: true,
			    	visible: true,
			    	map: null
			    },
				title: title,
				data: marker,
				icon: myIcon,
				showWindow: false,
			    events: {
			    	mouseover: function(marker, eventName, args) {
			    		var e = args[0];
			    		console.log("I am in marker mouseover event function " + e);
			    		marker.show = true;
			    		//$scope.$apply();
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
	
	$scope.initBPointMap = function(bpMarkers){
		$scope.bPointMap = {
			control: {},
			center: $scope.mapCenter,
		    zoom: 14,
		    bounds: {}
		};
			
		$scope.options = {
		    scrollwheel: true
		};
		
		if(bpMarkers!= null){
			$scope.bikePointMarkers = bpMarkers;
		} else {
			$scope.bikePointMarkers = [];
		}
		$scope.addMarkerToMap($scope.bPointMap, 3);
		
		$scope.mySpecialBPMarkers = [];
	};
	
	$scope.underlineViewMarker = function(id){
		for(var i = 0; i < $scope.bikePointMarkers.length; i++){
			if($scope.bikePointMarkers[i].id == id){
				$scope.bikePointMarkers[i].animation="DROP";
			} else {
				$scope.bikePointMarkers[i].animation="";
			}
		}
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