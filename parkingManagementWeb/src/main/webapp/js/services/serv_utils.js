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