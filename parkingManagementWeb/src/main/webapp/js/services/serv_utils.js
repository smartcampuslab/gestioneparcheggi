'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('utilsService', function(){
	
	// Method correctAreaObjectForWS: used to covert the areaWS list in a List of RateArea objects to invoke the specific WS
	this.correctAreaObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var ra = {
					id: list[i].id,
					name: list[i].name,
					id_app: list[i].id_app,
					smsCode: (list[i].smsCode) ? list[i].smsCode : null,
					validityPeriod: (list[i].validityPeriod) ? this.correctRatePeriodsForWS(list[i].validityPeriod, 0) : null,
					geometry: (list[i].geometry) ? this.correctGeometryForWS(list[i].geometry) : null,
					color: list[i].color,
					note: list[i].note,
					zones: (list[i].zones) ? list[i].zones : null,
					streets: (list[i].streets) ? list[i].streets : null,
					parkingMeters: (list[i].parkingMeters) ? list[i].parkingMeters : null,
					slotNumber: list[i].slotNumber
				};
				corrList.push(ra);
			}
		}
		return corrList;
	};
	
	// Method correctAreaOccObjectForWS: used to covert the areaWS list in a List of OccupancyRateArea objects to invoke the specific WS
	this.correctAreaOccObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var ra = {
					id: list[i].id,
					name: list[i].name,
					id_app: list[i].id_app,
					smsCode: (list[i].smsCode) ? list[i].smsCode : null,
					validityPeriod: (list[i].validityPeriod) ? this.correctRatePeriodsForWS(list[i].validityPeriod, 0) : null,
					geometry: (list[i].geometry) ? this.correctGeometryForWS(list[i].geometry) : null,
					color: list[i].color,
					note: list[i].note,
					zones: (list[i].zones) ? list[i].zones : null,
					streets: (list[i].streets) ? list[i].streets : null,
					parkingMeters: (list[i].parkingMeters) ? list[i].parkingMeters : null,
					slotNumber: list[i].slotNumber,
					occupancy: list[i].occupancy,
					slotOccupied: list[i].slotOccupied
				};
				corrList.push(ra);
			}
		}
		return corrList;
	};
	
	// Method correctAreaOccObjectForWS: used to covert the areaWS list in a List of ProfitRateArea objects to invoke the specific WS
	this.correctAreaProfitObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var ra = {
					id: list[i].id,
					name: list[i].name,
					id_app: list[i].id_app,
					smsCode: (list[i].smsCode) ? list[i].smsCode : null,
					validityPeriod: (list[i].validityPeriod) ? this.correctRatePeriodsForWS(list[i].validityPeriod, 0) : null,
					geometry: (list[i].geometry) ? this.correctGeometryForWS(list[i].geometry) : null,
					color: list[i].color,
					note: list[i].note,
					zones: (list[i].zones) ? list[i].zones : null,
					streets: (list[i].streets) ? list[i].streets : null,
					parkingMeters: (list[i].parkingMeters) ? list[i].parkingMeters : null,
					slotNumber: list[i].slotNumber,
					profit: list[i].profit,
					tickets: list[i].tickets
				};
				corrList.push(ra);
			}
		}
		return corrList;
	};
	
	// Method correctAreaTimeCostObjectForWS: used to covert the areaWS list in a List of TimeCostRateArea objects to invoke the specific WS
	this.correctAreaTimeCostObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var ra = {
					id: list[i].id,
					name: list[i].name,
					id_app: list[i].id_app,
					smsCode: (list[i].smsCode) ? list[i].smsCode : null,
					validityPeriod: (list[i].validityPeriod) ? this.correctRatePeriodsForWS(list[i].validityPeriod, 0) : null,
					geometry: (list[i].geometry) ? this.correctGeometryForWS(list[i].geometry) : null,
					color: list[i].color,
					note: list[i].note,
					zones: (list[i].zones) ? list[i].zones : null,
					streets: (list[i].streets) ? list[i].streets : null,
					parkingMeters: (list[i].parkingMeters) ? list[i].parkingMeters : null,
					slotNumber: list[i].slotNumber,
					slotOccupied: list[i].slotOccupied,
					occupancy: list[i].occupancy,
					minExtratime: (list[i].extratime && list[i].extratime.extratime_estimation_min != null) ? list[i].extratime.extratime_estimation_min : -1,
					maxExtratime: (list[i].extratime && list[i].extratime.extratime_estimation_max != null) ? list[i].extratime.extratime_estimation_max : -1
				};
				corrList.push(ra);
			}
		}
		return corrList;
	};
	
	// Method correctStructObjectForWS: used to covert the structWS list in a List of ParkingStructure objects to invoke the specific WS
	this.correctStructObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var ra = {
					id: list[i].id,
					name: list[i].name,
					id_app: list[i].id_app,
					streetReference: list[i].streetReference,
					managementMode: (list[i].managementMode) ? list[i].managementMode : null,
					manager: (list[i].manager) ? list[i].manager : null,
					validityPeriod: (list[i].validityPeriod) ? this.correctRatePeriodsForWS(list[i].validityPeriod, 1) : null,
					geometry: (list[i].geometry) ? list[i].geometry : null,
					slotNumber: list[i].slotNumber,
					payingSlotNumber: list[i].payingSlotNumber,
					handicappedSlotNumber: list[i].handicappedSlotNumber,
					unusuableSlotNumber: list[i].unusuableSlotNumber,
					paymentMode: list[i].paymentMode,
					phoneNumber: (list[i].phoneNumber) ? list[i].phoneNumber : null,
					parkAndRide: list[i].parkAndRide,
					zones: (list[i].zones) ? list[i].zones : null
				};
				corrList.push(ra);
			}
		}
		return corrList;
	};
	
	// Method correctOccStructObjectForWS: used to covert the structWS list in a List of OccupancyParkingStructure objects to invoke the specific WS
	this.correctOccStructObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var ra = {
					id: list[i].id,
					name: list[i].name,
					id_app: list[i].id_app,
					streetReference: list[i].streetReference,
					managementMode: (list[i].managementMode) ? list[i].managementMode : null,
					manager: (list[i].manager) ? list[i].manager : null,
					validityPeriod: (list[i].validityPeriod) ? this.correctRatePeriodsForWS(list[i].validityPeriod, 1) : null,
					geometry: (list[i].geometry) ? list[i].geometry : null,
					slotNumber: list[i].slotNumber,
					payingSlotNumber: list[i].payingSlotNumber,
					handicappedSlotNumber: list[i].handicappedSlotNumber,
					unusuableSlotNumber: list[i].unusuableSlotNumber,
					paymentMode: list[i].paymentMode,
					phoneNumber: (list[i].phoneNumber) ? list[i].phoneNumber : null,
					parkAndRide: list[i].parkAndRide,
					zones: (list[i].zones) ? list[i].zones : null,
					occupancyRate: list[i].occupancyRate,
					payingSlotOccupied: list[i].payingSlotOccupied,
					handicappedSlotOccupied: list[i].handicappedSlotOccupied
				};
				corrList.push(ra);
			}
		}
		return corrList;
	};
	
	// Method correctStructProfitObjectForWS: used to covert the structWS list in a List of ProfitParkingStructure objects to invoke the specific WS
	this.correctStructProfitObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var ra = {
					id: list[i].id,
					name: list[i].name,
					id_app: list[i].id_app,
					streetReference: list[i].streetReference,
					managementMode: (list[i].managementMode) ? list[i].managementMode : null,
					manager: (list[i].manager) ? list[i].manager : null,
					validityPeriod: (list[i].validityPeriod) ? this.correctRatePeriodsForWS(list[i].validityPeriod, 1) : null,
					geometry: (list[i].geometry) ? list[i].geometry : null,
					slotNumber: list[i].slotNumber,
					payingSlotNumber: list[i].payingSlotNumber,
					handicappedSlotNumber: list[i].handicappedSlotNumber,
					unusuableSlotNumber: list[i].unusuableSlotNumber,
					paymentMode: list[i].paymentMode,
					phoneNumber: (list[i].phoneNumber) ? list[i].phoneNumber : null,
					parkAndRide: list[i].parkAndRide,
					zones: (list[i].zones) ? list[i].zones : null,
					profit: list[i].profit,
					tickets: list[i].tickets,
				};
				corrList.push(ra);
			}
		}
		return corrList;
	};
	
	// Method correctStructTimeCostObjectForWS: used to covert the structWS list in a List of TimeCostParkingStructure objects to invoke the specific WS
	this.correctStructTimeCostObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var ra = {
					id: list[i].id,
					name: list[i].name,
					id_app: list[i].id_app,
					streetReference: list[i].streetReference,
					managementMode: (list[i].managementMode) ? list[i].managementMode : null,
					manager: (list[i].manager) ? list[i].manager : null,
					validityPeriod: (list[i].validityPeriod) ? this.correctRatePeriodsForWS(list[i].validityPeriod, 1) : null,
					geometry: (list[i].geometry) ? list[i].geometry : null,
					slotNumber: list[i].slotNumber,
					payingSlotNumber: list[i].payingSlotNumber,
					handicappedSlotNumber: list[i].handicappedSlotNumber,
					unusuableSlotNumber: list[i].unusuableSlotNumber,
					paymentMode: list[i].paymentMode,
					phoneNumber: (list[i].phoneNumber) ? list[i].phoneNumber : null,
					parkAndRide: list[i].parkAndRide,
					zones: (list[i].zones) ? list[i].zones : null,
					slotOccupied: list[i].slotOccupied,
					occupancy: list[i].occupancy,
					occupancyRate: (list[i].occupancyRate != null) ? list[i].occupancyRate : -1,
					minExtratime: (list[i].extratime && list[i].extratime.extratime_estimation_min != null) ? list[i].extratime.extratime_estimation_min : -1,
					maxExtratime: (list[i].extratime && list[i].extratime.extratime_estimation_max != null) ? list[i].extratime.extratime_estimation_max : -1
				};
				corrList.push(ra);
			}
		}
		return corrList;
	};
	
	// Method correctStreetObjectForWS: used to convert the streetWS list in a list of Street objects to invoke the specific WS
	this.correctStreetObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var s = {
					id: list[i].id,
					id_app: list[i].id_app,
					streetReference: list[i].streetReference,
					slotNumber: list[i].slotNumber,
					handicappedSlotNumber: list[i].handicappedSlotNumber,
					reservedSlotNumber: list[i].reservedSlotNumber,
					timedParkSlotNumber: list[i].timedParkSlotNumber,
					freeParkSlotNumber: list[i].freeParkSlotNumber,
					freeParkSlotSignNumber: list[i].freeParkSlotSignNumber,
					paidSlotNumber: list[i].paidSlotNumber,
					unusuableSlotNumber: list[i].unusuableSlotNumber,
					subscritionAllowedPark : list[i].subscritionAllowedPark,
					rateAreaId: list[i].rateAreaId,
					geometry:  (list[i].geometry) ? list[i].geometry : null,
					zones: (list[i].zones) ? list[i].zones : null,
					parkingMeters: (list[i].parkingMeters) ? list[i].parkingMeters : null,
					color: list[i].color,
					area_name: list[i].area_name,
					area_color: list[i].area_color
				};
				corrList.push(s);
			}
		}
		return corrList;
	}
	
	// Method correctOccStreetObjectForWS: used to convert the occupancy streetWS list in a list of OccupancyStreet objects to invoke the specific WS
	this.correctOccStreetObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var s = {
					id: list[i].id,
					id_app: list[i].id_app,
					streetReference: list[i].streetReference,
					slotNumber: list[i].slotNumber,
					handicappedSlotNumber: list[i].handicappedSlotNumber,
					reservedSlotNumber: list[i].reservedSlotNumber,
					timedParkSlotNumber: list[i].timedParkSlotNumber,
					freeParkSlotNumber: list[i].freeParkSlotNumber,
					freeParkSlotSignNumber: list[i].freeParkSlotSignNumber,
					paidSlotNumber: list[i].paidSlotNumber,
					unusuableSlotNumber: list[i].unusuableSlotNumber,
					subscritionAllowedPark : list[i].subscritionAllowedPark,
					rateAreaId: list[i].rateAreaId,
					geometry:  (list[i].geometry) ? list[i].geometry : null,
					zones: (list[i].zones) ? list[i].zones : null,
					parkingMeters: (list[i].parkingMeters) ? list[i].parkingMeters : null,
					color: list[i].color,
					area_name: list[i].area_name,
					area_color: list[i].area_color,
					handicappedSlotOccupied: (list[i].handicappedSlotOccupied != null) ? list[i].handicappedSlotOccupied : 0,
					reservedSlotOccupied: (list[i].reservedSlotOccupied != null) ? list[i].reservedSlotOccupied : 0,
					timedParkSlotOccupied: (list[i].timedParkSlotOccupied != null) ? list[i].timedParkSlotOccupied : 0,
					freeParkSlotOccupied: (list[i].freeParkSlotOccupied != null) ? list[i].freeParkSlotOccupied : 0,
					freeParkSlotSignOccupied: (list[i].freeParkSlotSignOccupied != null) ? list[i].freeParkSlotSignOccupied : 0,
					paidSlotOccupied: (list[i].paidSlotOccupied != null) ? list[i].paidSlotOccupied : 0,
					occupancyRate: (list[i].occupancyRate != null) ? list[i].occupancyRate : -1,
					freeParkOccupied: (list[i].freeParkOccupied != null) ? list[i].freeParkOccupied : 0,
					slotOccupied: (list[i].slotOccupied != null) ? list[i].slotOccupied : 0
				};
				corrList.push(s);
			}
		}
		return corrList;
	}
	
	// Method correctProfitStreetObjectForWS: used to convert the profit streetWS list in a list of ProfitStreet objects to invoke the specific WS
	this.correctProfitStreetObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var s = {
					id: list[i].id,
					id_app: list[i].id_app,
					streetReference: list[i].streetReference,
					slotNumber: list[i].slotNumber,
					handicappedSlotNumber: list[i].handicappedSlotNumber,
					reservedSlotNumber: list[i].reservedSlotNumber,
					timedParkSlotNumber: list[i].timedParkSlotNumber,
					freeParkSlotNumber: list[i].freeParkSlotNumber,
					freeParkSlotSignNumber: list[i].freeParkSlotSignNumber,
					paidSlotNumber: list[i].paidSlotNumber,
					unusuableSlotNumber: list[i].unusuableSlotNumber,
					subscritionAllowedPark : list[i].subscritionAllowedPark,
					rateAreaId: list[i].rateAreaId,
					geometry:  (list[i].geometry) ? list[i].geometry : null,
					zones: (list[i].zones) ? list[i].zones : null,
					parkingMeters: (list[i].parkingMeters) ? list[i].parkingMeters : null,
					color: list[i].color,
					area_name: list[i].area_name,
					area_color: list[i].area_color,
					profit: (list[i].profit != null) ? list[i].profit : -1,
					tickets: (list[i].tickets != null) ? list[i].tickets : -1
				};
				corrList.push(s);
			}
		}
		return corrList;
	}
	
	// Method correctTimeCostStreetObjectForWS: used to convert the time cost streetWS list in a list of TimeCostStreet objects to invoke the specific WS
	this.correctTimeCostStreetObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var s = {
					id: list[i].id,
					id_app: list[i].id_app,
					streetReference: list[i].streetReference,
					slotNumber: list[i].slotNumber,
					handicappedSlotNumber: list[i].handicappedSlotNumber,
					reservedSlotNumber: list[i].reservedSlotNumber,
					timedParkSlotNumber: list[i].timedParkSlotNumber,
					freeParkSlotNumber: list[i].freeParkSlotNumber,
					freeParkSlotSignNumber: list[i].freeParkSlotSignNumber,
					paidSlotNumber: list[i].paidSlotNumber,
					unusuableSlotNumber: list[i].unusuableSlotNumber,
					subscritionAllowedPark : list[i].subscritionAllowedPark,
					rateAreaId: list[i].rateAreaId,
					geometry:  (list[i].geometry) ? list[i].geometry : null,
					zones: (list[i].zones) ? list[i].zones : null,
					parkingMeters: (list[i].parkingMeters) ? list[i].parkingMeters : null,
					color: list[i].color,
					area_name: list[i].area_name,
					area_color: list[i].area_color,
					occupancyRate: (list[i].occupancyRate != null) ? list[i].occupancyRate : -1,
					slotOccupied: (list[i].slotOccupied != null) ? list[i].slotOccupied : 0,
					minExtratime: (list[i].extratime && list[i].extratime.extratime_estimation_min != null) ? list[i].extratime.extratime_estimation_min : -1,
					maxExtratime: (list[i].extratime && list[i].extratime.extratime_estimation_max != null) ? list[i].extratime.extratime_estimation_max : -1
				};
				corrList.push(s);
			}
		}
		return corrList;
	}
	
	// Method correctPMObjectForWS: used to convert the parkingMeterWS list in a List of ParkingMeter objects to invoke the specific WS
	this.correctPMObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var pm = {
					id: list[i].id,
					id_app: list[i].id_app,
					code: list[i].code,
					note: (list[i].note != null) ? list[i].note : "",
					status: list[i].status,
					geometry: (list[i].geometry) ? list[i].geometry : null,
					zones: (list[i].zones) ? list[i].zones : null
				};
				corrList.push(pm);
			}
		}
		return corrList;
	};
	
	// Method correctProfitPMObjectForWS: used to convert the profit parkingMeterWS list in a List of ProfitParkingMeter objects to invoke the specific WS
	this.correctProfitPMObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var pm = {
					id: list[i].id,
					id_app: list[i].id_app,
					code: list[i].code,
					note: (list[i].note != null) ? list[i].note : "",
					status: list[i].status,
					geometry: (list[i].geometry) ? list[i].geometry : null,
					zones: (list[i].zones) ? list[i].zones : null,
					profit: (list[i].profit != null) ? list[i].profit : -1,
					tickets: (list[i].tickets != null) ? list[i].tickets : -1
				};
				corrList.push(pm);
			}
		}
		return corrList;
	};
	
	// Method correctZoneObjectForWS: used to convert the zoneWS list in a List of Zone objects to invoke the specific WS
	this.correctZoneObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var z = {
					id: list[i].id,
					id_app: list[i].id_app,
					name: list[i].name,
					submacro: (list[i].submacro != null) ? list[i].submacro: "",
					submicro: (list[i].submicro != null) ? list[i].submicro: "",
					type: list[i].type,
					note: (list[i].note != null) ? list[i].note : "",
					color: (list[i].color != null) ? list[i].color : "",
					centermap: (list[i].centermap != null) ? list[i].centermap : null,
					geometry: (list[i].geometry) ? this.correctGeometryPolForWS(list[i].geometry) : null,
					geometryFromSubelement: list[i].geometryFromSubelement,
					slotNumber: list[i].slotNumber
				};
				corrList.push(z);
			}
		}
		return corrList;
	};
	
	// Method correctOccZoneObjectForWS: used to convert the zoneWS list in a List of OccupancyZone objects to invoke the specific WS
	this.correctOccZoneObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var z = {
					id: list[i].id,
					id_app: list[i].id_app,
					name: list[i].name,
					submacro: (list[i].submacro != null) ? list[i].submacro: "",
					submicro: (list[i].submicro != null) ? list[i].submicro: "",
					type: list[i].type,
					note: (list[i].note != null) ? list[i].note : "",
					color: (list[i].color != null) ? list[i].color : "",
					centermap: (list[i].centermap != null) ? list[i].centermap : null,
					geometry: (list[i].geometry) ? this.correctGeometryPolForWS(list[i].geometry) : null,
					geometryFromSubelement: list[i].geometryFromSubelement,
					slotNumber: list[i].slotNumber,
					slotOccupied: list[i].slotOccupied,
					occupancy: (list[i].occupancy != null) ? list[i].occupancy : -1
				};
				corrList.push(z);
			}
		}
		return corrList;
	};
	
	// Method correctProfitZoneObjectForWS: used to convert the zoneWS list in a List of ProfitZone objects to invoke the specific WS
	this.correctProfitZoneObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var z = {
					id: list[i].id,
					id_app: list[i].id_app,
					name: list[i].name,
					submacro: (list[i].submacro != null) ? list[i].submacro: "",
					submicro: (list[i].submicro != null) ? list[i].submicro: "",
					type: list[i].type,
					note: (list[i].note != null) ? list[i].note : "",
					color: (list[i].color != null) ? list[i].color : "",
					centermap: (list[i].centermap != null) ? list[i].centermap : null,
					geometry: (list[i].geometry) ? this.correctGeometryPolForWS(list[i].geometry) : null,
					geometryFromSubelement: list[i].geometryFromSubelement,
					slotNumber: list[i].slotNumber,
					profit: (list[i].profit != null) ? list[i].profit : -1,
					tickets: (list[i].tickets != null) ? list[i].tickets : -1
				};
				corrList.push(z);
			}
		}
		return corrList;
	};
	
	// Method correctTimeCostZoneObjectForWS: used to convert the zoneWS list in a List of TimeCostZone objects to invoke the specific WS
	this.correctTimeCostZoneObjectForWS = function(list){
		var corrList = [];
		if(list){
			for(var i = 0; i < list.length; i++){
				var z = {
					id: list[i].id,
					id_app: list[i].id_app,
					name: list[i].name,
					submacro: (list[i].submacro != null) ? list[i].submacro: "",
					submicro: (list[i].submicro != null) ? list[i].submicro: "",
					type: list[i].type,
					note: (list[i].note != null) ? list[i].note : "",
					color: (list[i].color != null) ? list[i].color : "",
					centermap: (list[i].centermap != null) ? list[i].centermap : null,
					geometry: (list[i].geometry) ? this.correctGeometryPolForWS(list[i].geometry) : null,
					geometryFromSubelement: list[i].geometryFromSubelement,
					slotNumber: list[i].slotNumber,
					slotOccupied: list[i].slotOccupied,
					occupancy: (list[i].occupancy != null) ? list[i].occupancy : -1,
					minExtratime: (list[i].extratime && list[i].extratime.extratime_estimation_min != null) ? list[i].extratime.extratime_estimation_min : -1,
					maxExtratime: (list[i].extratime && list[i].extratime.extratime_estimation_max != null) ? list[i].extratime.extratime_estimation_max : -1
				};
				corrList.push(z);
			}
		}
		return corrList;
	};
	
	// Method correctGeometryForWS: used to convert the geometry polygon array in the correct object to invoke WS
	this.correctGeometryForWS = function(geom){
		var corrGeom = [];
		if(geom){
			for(var i = 0; i < geom.length; i++){
				var pl = {
					points: geom[i].points
				};
				corrGeom.push(pl);
			}
		}
		return corrGeom;
	};
	
	// Method correctGeometryPolForWS: used to convert the geometry polygon in the correct object to invoke WS
	this.correctGeometryPolForWS = function(geom){
		var corrGeom = {};
		if(geom){
			corrGeom = {
				points: geom.points
			};
		}
		return corrGeom;
	};
	
	// Method correctRatePeriodsForWS: used to convert the ratePeriod data in the correct list of object needed in the WS
	this.correctRatePeriodsForWS = function(periods, type){
		var corrPeriods = [];
		if(periods){
			for(var i = 0; i < periods.length; i++){
				if(type == 0){
					var corrPeriod = {
						from: periods[i].from,
						to: periods[i].to,
						weekDays: periods[i].weekDays,
						timeSlot: periods[i].timeSlot,
						rateValue: periods[i].rateValue,
						holiday: periods[i].holiday,
						note: periods[i].note
					};
				} else {
					var corrPeriod = {
						weekDays: periods[i].weekDays,
						timeSlot: periods[i].timeSlot,
						rateValue: periods[i].rateValue,
						dayOrNight: periods[i].dayOrNight,
						holiday: periods[i].holiday,
						note: periods[i].note
					};
				}
				corrPeriods.push(corrPeriod);
			}
		}	
		return corrPeriods;
	};
	
	// Method correctRatePeriodsForWSAsString: used to convert the ratePeriod data in a summary string
	this.correctRatePeriodsForWSAsString = function(periods){
			var DATA_SEPARATOR = " / ";
			var PERIOD_SEPARATOR = " // ";
			var pSumm = "";
			if(periods){
				for(var i = 0; i < periods.length; i++){
					var euro_val = periods[i].rateValue / 100;
					if(periods[i].holiday){
						pSumm += euro_val.toFixed(2) + " euro/h"
								+ DATA_SEPARATOR + periods[i].from 
								+ "-" + periods[i].to
								+ DATA_SEPARATOR + this.correctDaysValues(periods[i].weekDays)
								+ DATA_SEPARATOR + periods[i].timeSlot
								+ DATA_SEPARATOR + "Feriale"
								+ PERIOD_SEPARATOR;
					} else {
						pSumm += euro_val.toFixed(2) + " euro/h"
								+ DATA_SEPARATOR + periods[i].from 
								+ "-" + periods[i].to
								+ DATA_SEPARATOR + this.correctDaysValues(periods[i].weekDays)
								+ DATA_SEPARATOR + periods[i].timeSlot
								+ PERIOD_SEPARATOR;
					}
				}
			}
			return pSumm.substring(0, pSumm.length - 1);
		
	};
	
	this.correctDaysValues = function(weekDays){
		var stringValues = "";
		for(var i = 0; i < weekDays.length; i++){
			if(weekDays[i] == "MO"){
				stringValues += "LU ";
			}
			if(weekDays[i] == "TU"){
				stringValues += "MA ";
			}
			if(weekDays[i] == "WE"){
				stringValues += "ME ";
			}
			if(weekDays[i] == "TH"){
				stringValues += "GI ";
			}
			if(weekDays[i] == "FR"){
				stringValues += "VE ";
			}
			if(weekDays[i] == "SA"){
				stringValues += "SA ";
			}
			if(weekDays[i] == "SU"){
				stringValues += "DO ";
			}
		}
		stringValues.substring(0, stringValues.length-1);
		return stringValues;
	}
	
});