/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package it.smartcommunitylab.parking.management.web.controller;

import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkMeter;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.bean.CompactParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.CompactStreetBean;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.CSVManager;
import it.smartcommunitylab.parking.management.web.manager.DynamicManager;
import it.smartcommunitylab.parking.management.web.manager.MarkerIconStorage;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;
import it.smartcommunitylab.parking.management.web.model.OccupancyParkingStructure;
import it.smartcommunitylab.parking.management.web.model.OccupancyRateArea;
import it.smartcommunitylab.parking.management.web.model.OccupancyStreet;
import it.smartcommunitylab.parking.management.web.model.OccupancyZone;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.ProfitParkingMeter;
import it.smartcommunitylab.parking.management.web.model.ProfitParkingStructure;
import it.smartcommunitylab.parking.management.web.model.ProfitRateArea;
import it.smartcommunitylab.parking.management.web.model.ProfitStreet;
import it.smartcommunitylab.parking.management.web.model.ProfitZone;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.TimeCostParkingStructure;
import it.smartcommunitylab.parking.management.web.model.TimeCostRateArea;
import it.smartcommunitylab.parking.management.web.model.TimeCostStreet;
import it.smartcommunitylab.parking.management.web.model.TimeCostZone;
import it.smartcommunitylab.parking.management.web.model.Zone;
import it.smartcommunitylab.parking.management.web.model.slots.VehicleType;
import it.smartcommunitylab.parking.management.web.repository.impl.StatRepositoryImpl;
import it.smartcommunitylab.parking.management.web.utils.VehicleTypeDataSetup;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DashboardController {

	private static final Logger logger = Logger
			.getLogger(DashboardController.class);

	@Autowired
	StorageManager storage;
	
	@Autowired
	StatRepositoryImpl statRepo;
	
	@Autowired
	DynamicManager dynamic;
	
	@Autowired
	CSVManager csvManager;

	MarkerIconStorage markerIconStorage;
	
	@Autowired
	private VehicleTypeDataSetup vehicleTypeDataSetup;

	@PostConstruct
	private void init() throws IOException {
		markerIconStorage = new MarkerIconStorage();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/session")
	public @ResponseBody
	String checkSession() {
		return "OK";
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/{appId}/street")
	public @ResponseBody
	List<StreetBean> getAllStreets(@PathVariable String appId) {
		return storage.getAllStreets(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/{appId}/street")
	public @ResponseBody
	List<StreetBean> getAllStreetsNS(@PathVariable String appId) {
		return storage.getAllStreets(appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/{appId}/parkingmeter")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMeters(@PathVariable String appId) {
		return storage.getAllParkingMeters(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/{appId}/parkingmeter")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMetersNS(@PathVariable String appId) {
		return storage.getAllParkingMeters(appId);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/{appId}/area/{aid}")
	public @ResponseBody
	RateAreaBean getRateArea(@PathVariable String appId,
			@PathVariable("aid") String aid,
			@RequestBody RateAreaBean area) throws NotFoundException {
		return storage.getAreaById(aid, appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/{appId}/area")
	public @ResponseBody
	List<RateAreaBean> getAllRateArea(@PathVariable String appId) {
		return storage.getAllArea(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/{appId}/area")
	public @ResponseBody
	List<RateAreaBean> getAllRateAreaNS(@PathVariable String appId) {
		return storage.getAllArea(appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/{appId}/zone/{zType}")
	public @ResponseBody
	List<ZoneBean> getAllZone(@PathVariable String appId, @PathVariable("zType") String type) {
		//return storage.getAllZone(appId);
		return storage.getZoneByType(type, appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/{appId}/zone/{zType}")
	public @ResponseBody
	List<ZoneBean> getAllZoneNS(@PathVariable String appId, @PathVariable("zType") String type) {
		//return storage.getAllZone(appId);
		return storage.getZoneByType(type, appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/{appId}/bikepoint")
	public @ResponseBody
	List<BikePointBean> getAllBikePoints(@PathVariable String appId) {
		return storage.getAllBikePoints(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/{appId}/bikepoint")
	public @ResponseBody
	List<BikePointBean> getAllBikePointsNS(@PathVariable String appId) {
		return storage.getAllBikePoints(appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/{appId}/parkingstructure")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructure(@PathVariable String appId) {
		return storage.getAllParkingStructure(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/{appId}/parkingstructure")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructureNS(@PathVariable String appId) {
		return storage.getAllParkingStructure(appId);
	}
	
	// New Part for occupancy data
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/parkingstructure/{id}")
	public @ResponseBody ParkingStructureBean getParkingStructureOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType ) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		String type = Parking.class.getCanonicalName();
		return dynamic.getOccupationRateFromParking(id, appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/parkingstructurecompare/{id}")
	public @ResponseBody String[][] getHistorycalParkingStructureOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang, @RequestParam(required=false) String vehicleType) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		String type = Parking.class.getCanonicalName();
		String[][] tmpMatrix;
		String[][] occMatrix;
		if(vehicleType != null && vehicleType.compareTo("") != 0){
			type = type + "@" + vehicleType;
			occMatrix = dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 2, lang);
		} else {
			List<VehicleType> allVehicles = vehicleTypeDataSetup.findVehicleTypeByAppId(appId);
			type = type + "@" + allVehicles.get(0).getName();
			occMatrix = dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 2, lang);
			for(int j = 1; j < allVehicles.size(); j++){
				type = Parking.class.getCanonicalName() + "@" + allVehicles.get(j).getName();
				tmpMatrix = dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 2, lang);
				occMatrix = dynamic.mergeStringSlotMatrix(tmpMatrix, occMatrix);
			}
		}
		return occMatrix;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/parkingstructures")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructureOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType) throws Exception {
		String type = Parking.class.getCanonicalName();
		return dynamic.getOccupationRateFromAllParkings(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancychanged/{appId}/parkingstructures")
	public @ResponseBody
	List<CompactParkingStructureBean> getAllParkingStructureChangedOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType) throws Exception {
		String type = Parking.class.getCanonicalName();
		return dynamic.getOccupationChangesFromAllParkings(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/street/{id}")
	public @ResponseBody StreetBean getStreetOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		String type = Street.class.getCanonicalName();
		return dynamic.getOccupationRateFromStreet(id, appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/streetcompare/{id}")
	public @ResponseBody String[][] getHistorycalStreetOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang, @RequestParam(required=false) String vehicleType) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		String type = Street.class.getCanonicalName();
		String[][] tmpMatrix;
		String[][] occMatrix;
		if(vehicleType != null && vehicleType.compareTo("") != 0){
			type = type + "@" + vehicleType;
			occMatrix = dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4, lang);
		} else {
			List<VehicleType> allVehicles = vehicleTypeDataSetup.findVehicleTypeByAppId(appId);
			type = type + "@" + allVehicles.get(0).getName();
			occMatrix = dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4, lang);
			for(int j = 1; j < allVehicles.size(); j++){
				type = Street.class.getCanonicalName() + "@" + allVehicles.get(j).getName();
				tmpMatrix = dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4, lang);
				occMatrix = dynamic.mergeStringSlotMatrix(tmpMatrix, occMatrix);
			}
		}
		return occMatrix;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/zonecompare/{id}")
	public @ResponseBody String[][] getHistorycalZoneOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang, @RequestParam(required=false) String vehicleType) throws Exception {
		String type = Street.class.getCanonicalName();
		return dynamic.getHistorycalDataFromZone(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4, lang, vehicleType);
		//return dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/areacompare/{id}")
	public @ResponseBody String[][] getHistorycalAreaOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang, @RequestParam(required=false) String vehicleType) throws Exception {
		String type = Street.class.getCanonicalName();
		return dynamic.getHistorycalDataFromArea(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4, lang, vehicleType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/streets")
	public @ResponseBody
	List<StreetBean> getAllStreetOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType) throws Exception {
//		int year_f = (year!= null && year.length > 0) ? year[0] : 0;
//		int year_t = (year!= null && year.length > 1) ? year[1] : 0;
//		int month_f = (month!= null && month.length > 0) ? month[0] : 0;
//		int month_t = (month!= null && month.length > 1) ? month[1] : 0;
//		int weekday_1 = (weekday!= null && weekday.length > 0) ? weekday[0] : 0;
//		int weekday_2 = (weekday!= null && weekday.length > 1) ? weekday[1] : 0;
//		int weekday_3 = (weekday!= null && weekday.length > 2) ? weekday[2] : 0;
//		int weekday_4 = (weekday!= null && weekday.length > 3) ? weekday[3] : 0;
//		int weekday_5 = (weekday!= null && weekday.length > 4) ? weekday[4] : 0;
//		int weekday_6 = (weekday!= null && weekday.length > 5) ? weekday[5] : 0;
//		int weekday_7 = (weekday!= null && weekday.length > 6) ? weekday[6] : 0;
//		int hour_f = (hour!= null && hour.length > 0) ? hour[0] : 0;
//		int hour_t = (hour!= null && hour.length > 1) ? hour[1] : 0;
//		logger.info(String.format("Parameters retrieved in back-end request for streets: appId - %s; year - %d,%d; month - %d,%d; dayType - %s, weekday - %d,%d,%d,%d,%d,%d,%d; hour - %d,%d; valueType - %d", appId, year_f, year_t, month_f, month_t, dayType, weekday_1, weekday_2, weekday_3, weekday_4, weekday_5, weekday_6, weekday_7, hour_f, hour_t, valueType));
		String type = Street.class.getCanonicalName();
		return dynamic.getOccupationRateFromAllStreets(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancychanged/{appId}/streets")
	public @ResponseBody
	List<CompactStreetBean> getAllStreetChangedOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType) throws Exception {
//		int year_f = (year!= null && year.length > 0) ? year[0] : 0;
//		int year_t = (year!= null && year.length > 1) ? year[1] : 0;
//		int month_f = (month!= null && month.length > 0) ? month[0] : 0;
//		int month_t = (month!= null && month.length > 1) ? month[1] : 0;
//		int weekday_1 = (weekday!= null && weekday.length > 0) ? weekday[0] : 0;
//		int weekday_2 = (weekday!= null && weekday.length > 1) ? weekday[1] : 0;
//		int weekday_3 = (weekday!= null && weekday.length > 2) ? weekday[2] : 0;
//		int weekday_4 = (weekday!= null && weekday.length > 3) ? weekday[3] : 0;
//		int weekday_5 = (weekday!= null && weekday.length > 4) ? weekday[4] : 0;
//		int weekday_6 = (weekday!= null && weekday.length > 5) ? weekday[5] : 0;
//		int weekday_7 = (weekday!= null && weekday.length > 6) ? weekday[6] : 0;
//		int hour_f = (hour!= null && hour.length > 0) ? hour[0] : 0;
//		int hour_t = (hour!= null && hour.length > 1) ? hour[1] : 0;
//		logger.info(String.format("Parameters retrieved in back-end request for streets: appId - %s; year - %d,%d; month - %d,%d; dayType - %s, weekday - %d,%d,%d,%d,%d,%d,%d; hour - %d,%d; valueType - %d", appId, year_f, year_t, month_f, month_t, dayType, weekday_1, weekday_2, weekday_3, weekday_4, weekday_5, weekday_6, weekday_7, hour_f, hour_t, valueType));
		String type = Street.class.getCanonicalName();
		return dynamic.getOccupationChangesFromAllStreets(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/parkingmeters")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMetersProfit(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		String type = ParkMeter.class.getCanonicalName();
		return dynamic.getProfitFromAllParkingMeters(appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/parkingmeter/{id}")
	public @ResponseBody
	ParkingMeterBean getParkingMeterProfit(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		String type = ParkMeter.class.getCanonicalName();
		return dynamic.getProfitFromParkingMeter(id, appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/parkingmetercompare/{id}")
	public @ResponseBody String[][] getHistoricalParkingMeterProfit(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang) throws Exception {
		String type = ParkMeter.class.getCanonicalName();
		return dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 1, lang);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/streetcompare/{id}")
	public @ResponseBody String[][] getHistoricalStreetProfit(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang) throws Exception {
		String type = ParkMeter.class.getCanonicalName();
		return dynamic.getHistorycalProfitDataFromStreet(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 1, lang);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/zonecompare/{id}")
	public @ResponseBody String[][] getHistoricalZoneProfit(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang) throws Exception {
		String type = ParkMeter.class.getCanonicalName();
		return dynamic.getHistorycalProfitDataFromZone(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 1, lang);
	}	

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/areacompare/{id}")
	public @ResponseBody String[][] getHistoricalAreaProfit(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang) throws Exception {
		String type = ParkMeter.class.getCanonicalName();
		return dynamic.getHistorycalProfitDataFromArea(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 1, lang);
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/parkstructs")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkStructsProfit(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		String type = ParkStruct.class.getCanonicalName();
//		int year_f = (year!= null && year.length > 0) ? year[0] : 0;
//		int year_t = (year!= null && year.length > 1) ? year[1] : 0;
//		int month_f = (month!= null && month.length > 0) ? month[0] : 0;
//		int month_t = (month!= null && month.length > 1) ? month[1] : 0;
//		int weekday_f = (weekday!= null && weekday.length > 0) ? weekday[0] : 0;
//		int weekday_t = (weekday!= null && weekday.length > 1) ? weekday[1] : 0;
//		int hour_f = (hour!= null && hour.length > 0) ? hour[0] : 0;
//		int hour_t = (hour!= null && hour.length > 1) ? hour[1] : 0;
//		logger.info(String.format("Parameters retrieved in back-end request for parkingmeters: appId - %s; year - %d,%d; month - %d,%d; dayType - %s, weekday - %d,%d; hour - %d,%d; valueType - %d", appId, year_f, year_t, month_f, month_t, dayType, weekday_f, weekday_t, hour_f, hour_t, valueType));
		return dynamic.getProfitFromAllParkStructs(appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profitchanged/{appId}/parkstructs")
	public @ResponseBody
	List<CompactParkingStructureBean> getAllParkStructsChangedProfit(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		String type = ParkStruct.class.getCanonicalName();
		return dynamic.getProfitChangeFromAllParkStructs(appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/parkstruct/{id}")
	public @ResponseBody
	ParkingStructureBean getParkStructsProfit(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		String type = ParkStruct.class.getCanonicalName();
		return dynamic.getProfitFromParkStruct(id, appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/parkstructcompare/{id}")
	public @ResponseBody String[][] getHistorycalParkStructsProfit(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang) throws Exception {
		String type = ParkStruct.class.getCanonicalName();
		return dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 3, lang);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/data")
	public @ResponseBody
	byte[] exportData() throws ExportException {
		return storage.exportData();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/export")
	public @ResponseBody
	void export(HttpServletResponse response) throws ExportException,
			IOException {
		byte[] data = storage.exportData();
		response.setHeader("Content-Disposition",
				"attachment; filename=\"data.zip\"");
		response.setContentLength(data.length);
		response.setContentType("application/zip");
		response.getOutputStream().write(data);
		response.getOutputStream().flush();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/marker/{company}/{entity}/{color}")
	public void getMarkerIcon(HttpServletRequest request,
			HttpServletResponse response, @PathVariable("color") String color,
			@PathVariable String entity, @PathVariable String company)
			throws IOException {

		getMarkerIcon(response, request.getSession().getServletContext()
				.getRealPath("/"), company, entity, color);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/marker/{company}/{entity}/{color}")
	public void getMarkerIconNS(HttpServletRequest request,
			HttpServletResponse response, @PathVariable("color") String color,
			@PathVariable String entity, @PathVariable String company)
			throws IOException {

		getMarkerIcon(response, request.getSession().getServletContext()
				.getRealPath("/"), company, entity, color);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/marker/{company}/{entity}")
	public void getMarkerIconNoColor(HttpServletRequest request,
			HttpServletResponse response, @PathVariable String entity,
			@PathVariable String company) throws IOException {
		getMarkerIcon(response, request.getSession().getServletContext()
				.getRealPath("/"), company, entity, null);
	}

	private void getMarkerIcon(HttpServletResponse response, String basePath,
			String company, String entity, String color) throws IOException {
		byte[] icon = markerIconStorage.getMarkerIcon(basePath, company,
				entity, color);
		response.setContentLength(icon.length);
		response.setContentType(MarkerIconStorage.ICON_CONTENT_TYPE);
		response.getOutputStream().write(icon);
		response.getOutputStream().flush();
	}
	
	// --------------------------------- Part for csv files creation ------------------------------------
	// --------------------------------------- Supply CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/supply/street/csv")
	public @ResponseBody
	String createStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<it.smartcommunitylab.parking.management.web.model.Street> data) { //@RequestBody String data
		logger.debug("I am in street csv creation.");
//		ArrayList<it.smartcommunitylab.parking.management.web.model.Street> streetData = new ArrayList<it.smartcommunitylab.parking.management.web.model.Street>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.debug("Current path: " + path);	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_supply_file_streets(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per vie: " + e.getMessage());
		}
		return createdFile;
	}
	
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/supply/zone/csv")
	public @ResponseBody
	String createZoneCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<Zone> data) { //@RequestBody String data
		logger.debug("I am in zone csv creation.");
//		ArrayList<Zone> zoneData = new ArrayList<Zone>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
			
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_supply_file_zones(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per zone: " + e.getMessage());
		}
		return createdFile;
	}
		
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/supply/area/csv")
	public @ResponseBody
	String createAreaCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<RateArea> data) { //@RequestBody String data
		logger.debug("I am in area csv creation.");
//		ArrayList<RateArea> areaData = new ArrayList<RateArea>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");	
			
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_supply_file_areas(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per aree: " + e.getMessage());
		}
		return createdFile;
	}
		
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/supply/parkingstructures/csv")
	public @ResponseBody
	String createStructureCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<ParkingStructure> data) { //@RequestBody String data
		logger.debug("I am in parkingstructures csv creation.");
//		ArrayList<ParkingStructure> structData = new ArrayList<ParkingStructure>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");	
			
		try {
			createdFile = csvManager.create_supply_file_structs(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/supply/parkingmeter/csv")
	public @ResponseBody
	String createPMCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<ParkingMeter> data) { //@RequestBody String data
		logger.debug("I am in parkingmeter csv creation.");
//		ArrayList<ParkingMeter> pMData = new ArrayList<ParkingMeter>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");	
		
		try {
			createdFile = csvManager.create_supply_file_parkingmeters(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcometri: " + e.getMessage());
		}
		return createdFile;
	}	
	// --------------------------------------- Occupancy CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupancy/street/csv")
	public @ResponseBody
	String createOccupancyStreetCSV(HttpServletRequest request, HttpServletResponse response,  @RequestParam(required=false) String vehicleType,
			@RequestBody ArrayList<OccupancyStreet> data) { //@RequestBody String data
		logger.debug("I am in street csv creation.");
		//	ArrayList<OccupancyStreet> streetData = new ArrayList<OccupancyStreet>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.debug("Current path: " + path);
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_occupancy_file_streets(data, path, vehicleType);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per vie: " + e.getMessage());
		}
		return createdFile;
	}	
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupancy/zone/csv")
	public @ResponseBody
	String createOccupancyZoneCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<OccupancyZone> data) { //@RequestBody String data
		logger.debug("I am in zone csv creation.");
//		ArrayList<OccupancyZone> zoneData = new ArrayList<OccupancyZone>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_occupancy_file_zones(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per zone: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupancy/area/csv")
	public @ResponseBody
	String createOccupancyAreaCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<OccupancyRateArea> data) {	//@RequestBody String data
		logger.debug("I am in area csv creation.");
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		try {
			createdFile = csvManager.create_occupancy_file_areas(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per aree: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupancy/parkingstructures/csv")
	public @ResponseBody
	String createOccupancyStructureCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String vehicleType, 
			@RequestBody ArrayList<OccupancyParkingStructure> data) {	//@RequestBody String data
		logger.debug("I am in parkingstructures csv creation.");
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_occupancy_file_structs(data, path, vehicleType);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;
	}	
	
	// ----------------------------------------- Profit CSV ---------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/street/csv")
	public @ResponseBody
	String createProfitStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<ProfitStreet> data) { //@RequestBody String data
		logger.debug("I am in profit street csv creation.");
		//ArrayList<ProfitStreet> streetData = new ArrayList<ProfitStreet>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.debug("Current path: " + path);
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_profit_file_streets(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV ricavi per vie: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/parkingmeter/csv")
	public @ResponseBody
	String createProfitPMCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<ProfitParkingMeter> data) { //@RequestBody String data
		logger.debug("I am in profit parkingmeter csv creation.");
//		ArrayList<ProfitParkingMeter> profitPMData = new ArrayList<ProfitParkingMeter>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		try {
			createdFile = csvManager.create_profit_file_parkingmeters(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV incassi per parcometri: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/zone/csv")
	public @ResponseBody
	String createProfitZoneCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<ProfitZone> data) {	//@RequestBody String data
		logger.debug("I am in profit zone csv creation.");
//		ArrayList<ProfitZone> zoneData = new ArrayList<ProfitZone>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		try {
			createdFile = csvManager.create_profit_file_zones(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV incassi per zone: " + e.getMessage());
		}
		return createdFile;
	}	
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/area/csv")
	public @ResponseBody
	String createProfitAreaCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<ProfitRateArea> data) { //@RequestBody String data
		logger.debug("I am in profit area csv creation.");
//		ArrayList<ProfitRateArea> areaData = new ArrayList<ProfitRateArea>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_profit_file_areas(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per aree: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/parkingstructures/csv")
	public @ResponseBody
	String createProfitStructureCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<ProfitParkingStructure> data) { //@RequestBody String data
		logger.debug("I am in profit parkingstructures csv creation.");
//		ArrayList<ProfitParkingStructure> structData = new ArrayList<ProfitParkingStructure>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");	
		
		try {
			createdFile = csvManager.create_profit_file_structs(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;
	}
	
	// --------------------------------------- Time cost CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timeCost/street/csv")
	public @ResponseBody
	String createTimeCostStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<TimeCostStreet> data) { //@RequestBody String data
		logger.debug("I am in street time cost csv creation.");
//		ArrayList<TimeCostStreet> streetData = new ArrayList<TimeCostStreet>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.debug("Current path: " + path);
		
		try {
			createdFile = csvManager.create_timeCost_file_streets(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV con tempo di accesso per vie: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timeCost/zone/csv")
	public @ResponseBody
	String createTimeCostZoneCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<TimeCostZone> data) { //@RequestBody String data
		logger.debug("I am in zone csv creation.");
//		ArrayList<TimeCostZone> zoneData = new ArrayList<TimeCostZone>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		try {
			createdFile = csvManager.create_timeCost_file_zones(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV costo di accesso per zone: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timeCost/area/csv")
	public @ResponseBody
	String createTimeCostAreaCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<TimeCostRateArea> data) { //@RequestBody String data
		logger.debug("I am in timeCost area csv creation.");
//		ArrayList<TimeCostRateArea> areaData = new ArrayList<TimeCostRateArea>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_timeCost_file_areas(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per aree: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timeCost/parkingstructures/csv")
	public @ResponseBody
	String createTimeCostStructureCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody ArrayList<TimeCostParkingStructure> data) { //@RequestBody String data
		logger.debug("I am in timeCost parkingstructures csv creation.");
//		ArrayList<TimeCostParkingStructure> structData = new ArrayList<TimeCostParkingStructure>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");	
		
		try {
			createdFile = csvManager.create_timeCost_file_structs(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;
	}	
	
	// ------------------------------ End of part for csv files creation --------------------------------
	
	// --------------------------------- Part for historycal csv files creation ------------------------------------
	// --------------------------------------- Street Occupancy CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupation/streethistory/csv")
	public @ResponseBody
	String createOccupationStreetHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dstreet_name, @RequestParam(required=false) String dstreet_area, @RequestParam(required=false) String dstreet_totalslot, @RequestBody String[][] matrix) { //@RequestBody String data,
		//ArrayList<it.smartcommunitylab.parking.management.web.model.Street> streetData = new ArrayList<it.smartcommunitylab.parking.management.web.model.Street>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
	    	
	    it.smartcommunitylab.parking.management.web.model.Street s = new it.smartcommunitylab.parking.management.web.model.Street();
	    s.setStreetReference(dstreet_name);
	    s.setSlotNumber(Integer.parseInt(dstreet_totalslot));
	    s.setArea_name(dstreet_area);
		
		try {
			createdFile = csvManager.create_occupancy_file_history_streets(s, matrix, path); //occ_matrix
		} catch (Exception e) {
			logger.error("Errore in creazione CSV occupazione storico per vie: " + e.getMessage());
		}
		return createdFile;
	}
	
	// --------------------------------------- Zone Occupancy CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupation/zonehistory/csv")
	public @ResponseBody
	String createOccupationZoneHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dzone_name, @RequestParam(required=false) String dzone_submacro, @RequestParam(required=false) String dzone_submicro, @RequestParam(required=false) String dzone_totalslot, @RequestBody String[][] matrix) { //@RequestBody String data,
		//ArrayList<it.smartcommunitylab.parking.management.web.model.Street> streetData = new ArrayList<it.smartcommunitylab.parking.management.web.model.Street>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
	    	
	    it.smartcommunitylab.parking.management.web.model.OccupancyZone z = new it.smartcommunitylab.parking.management.web.model.OccupancyZone();
	    z.setName(dzone_name);
	    z.setSubmacro(dzone_submacro);
	    z.setSubmicro(dzone_submicro);
	    z.setSlotNumber(Integer.parseInt(dzone_totalslot));
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_occupancy_file_history_zone(z, matrix, path); //occ_matrix
		} catch (Exception e) {
			logger.error("Errore in creazione CSV occupazione storico per zone: " + e.getMessage());
		}
		return createdFile;
	}
	
	// --------------------------------------- Area Occupancy CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupation/areahistory/csv")
	public @ResponseBody
	String createOccupationAreaHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String darea_name, @RequestParam(required=false) String darea_fee, @RequestParam(required=false) String darea_totalslot, @RequestBody String[][] matrix) { //@RequestBody String data,
		//ArrayList<it.smartcommunitylab.parking.management.web.model.Street> streetData = new ArrayList<it.smartcommunitylab.parking.management.web.model.Street>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		String valPeriods = "";
	    	
	    it.smartcommunitylab.parking.management.web.model.OccupancyRateArea a = new it.smartcommunitylab.parking.management.web.model.OccupancyRateArea();
	    a.setName(darea_name);
	    //a.setFee(Float.valueOf(darea_fee));
	    if(darea_fee != null && darea_fee.compareTo("") != 0){
	    	valPeriods = darea_fee;
	    }
	    a.setSlotNumber(Integer.parseInt(darea_totalslot));
			
		try {
			createdFile = csvManager.create_occupancy_file_history_area(a, matrix, path, valPeriods); //occ_matrix
		} catch (Exception e) {
			logger.error("Errore in creazione CSV occupazione storico per aree: " + e.getMessage());
		}
		return createdFile;
	}	
	
	// --------------------------------------- Parkingstructure Occupancy CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupation/parkingstructureshistory/csv")
	public @ResponseBody
	String createOccupationStructureHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dparking_name, @RequestParam(required=false) String dparking_streetreference, @RequestParam(required=false) String dparking_totalslot, @RequestBody String[][] matrix) { //@RequestBody String data,
		//ArrayList<it.smartcommunitylab.parking.management.web.model.Street> streetData = new ArrayList<it.smartcommunitylab.parking.management.web.model.Street>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
	    OccupancyParkingStructure ops = new OccupancyParkingStructure();
	    ops.setName(dparking_name);
	    ops.setStreetReference(dparking_streetreference);
	    ops.setSlotNumber(Integer.parseInt(dparking_totalslot));
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_occupancy_file_history_structs(ops, matrix, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV occupazione storico per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;		
	}
	
	// ---------------------------------------- Street Profit CSV -------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/streethistory/csv")
	public @ResponseBody
	String createProfitStreetHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dstreet_name, @RequestParam(required=false) String dstreet_area, @RequestParam(required=false) String dstreet_totalslot, @RequestBody String[][] matrix) {
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
    	
		it.smartcommunitylab.parking.management.web.model.Street s = new it.smartcommunitylab.parking.management.web.model.Street();
	    s.setStreetReference(dstreet_name);
	    s.setSlotNumber(Integer.parseInt(dstreet_totalslot));
	    s.setArea_name(dstreet_area);
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_profit_file_history_street(s, matrix, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV incassi storico per vie: " + e.getMessage());
		}
		return createdFile;
	}
	
	// --------------------------------------- Zone Profit CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/zonehistory/csv")
	public @ResponseBody
	String createProfitZoneHistoryCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dzone_name, @RequestParam(required=false) String dzone_submacro, @RequestParam(required=false) String dzone_submicro, @RequestParam(required=false) String dzone_totalslot, @RequestBody String[][] matrix) {
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		    	
	    it.smartcommunitylab.parking.management.web.model.ProfitZone z = new it.smartcommunitylab.parking.management.web.model.ProfitZone();
	    z.setName(dzone_name);
	    z.setSubmacro(dzone_submacro);
	    z.setSubmicro(dzone_submicro);
	    z.setSlotNumber(Integer.parseInt(dzone_totalslot));
			
		try {
			createdFile = csvManager.create_profit_file_history_zone(z, matrix, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV incassi storico per zone: " + e.getMessage());
		}
		return createdFile;
	}
	
	// --------------------------------------- Area Profit CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/areahistory/csv")
	public @ResponseBody
	String createProfitAreaHistoryCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String darea_name, @RequestParam(required=false) String darea_fee, @RequestParam(required=false) String darea_totalslot,  @RequestBody String[][] matrix) {
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		String valPeriods = "";
			    	
		it.smartcommunitylab.parking.management.web.model.ProfitRateArea a = new it.smartcommunitylab.parking.management.web.model.ProfitRateArea();
	    a.setName(darea_name);
	    //a.setFee(Float.valueOf(darea_fee));
	    if(darea_fee != null && darea_fee.compareTo("") != 0){
	    	valPeriods = darea_fee;
	    }
	    a.setSlotNumber(Integer.parseInt(darea_totalslot));
				
		try {
			createdFile = csvManager.create_profit_file_history_area(a, matrix, path, valPeriods);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV incassi storico per aree: " + e.getMessage());
		}
		return createdFile;
	}	
	
	// ---------------------------------------- Parking Profit CSV -------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/parkingmeterhistory/csv")
	public @ResponseBody
	String createProfitPMHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dparking_code, @RequestParam(required=false) String dparking_note, @RequestParam(required=false) String dparking_area, @RequestBody String[][] matrix) {
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
    	
	    Integer code = Integer.parseInt(dparking_code);
	    	
	    ProfitParkingMeter ppm = new ProfitParkingMeter();
	    ppm.setCode(code);
	    ppm.setNote(dparking_note);
	    ppm.setAreaId(dparking_area);
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_profit_file_history_parkingmeters(ppm, matrix, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV incassi storico per parcometri: " + e.getMessage());
		}
		return createdFile;
	}
	
	// --------------------------------------- Parkingstructure Profit CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/parkstructhistory/csv")
	public @ResponseBody
	String createProfitStructureHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dparkstruct_name, @RequestParam(required=false) String dparkstruct_streetreference, @RequestParam(required=false) String dparkstruct_totalslot, @RequestBody String[][] matrix) { //@RequestBody String data,
		//ArrayList<it.smartcommunitylab.parking.management.web.model.Street> streetData = new ArrayList<it.smartcommunitylab.parking.management.web.model.Street>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		ProfitParkingStructure pps = new ProfitParkingStructure();
	    pps.setName(dparkstruct_name);
	    pps.setStreetReference(dparkstruct_streetreference);
	    pps.setSlotNumber(Integer.parseInt(dparkstruct_totalslot));
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_profit_file_history_structs(pps, matrix, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV profitto storico per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;			
	}

	// --------------------------------------- Area TimeCost CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timecost/areahistory/csv")
	public @ResponseBody
	String createTimeCostAreaHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String darea_name, @RequestParam(required=false) String darea_fee, @RequestParam(required=false) String darea_totalslot, @RequestBody String[][] matrix) {
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
	    String valPeriods = "";
		
		it.smartcommunitylab.parking.management.web.model.OccupancyRateArea a = new it.smartcommunitylab.parking.management.web.model.OccupancyRateArea();
	    a.setName(darea_name);
	    //a.setFee(Float.valueOf(darea_fee));
	    if(darea_fee != null && darea_fee.compareTo("") != 0){
	    	valPeriods = darea_fee;
	    }
	    a.setSlotNumber(Integer.parseInt(darea_totalslot));
			
		try {
			createdFile = csvManager.create_timecost_file_history_area(a, matrix, path, valPeriods);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV costo accesso storico per zone: " + e.getMessage());
		}
		return createdFile;
	}	
	
	// --------------------------------------- Zone TimeCost CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timecost/zonehistory/csv")
	public @ResponseBody
	String createTimeCostZoneHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dzone_name, @RequestParam(required=false) String dzone_submacro, @RequestParam(required=false) String dzone_submicro, @RequestParam(required=false) String dzone_totalslot, @RequestBody String[][] matrix) {
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
	    	
	    it.smartcommunitylab.parking.management.web.model.OccupancyZone z = new it.smartcommunitylab.parking.management.web.model.OccupancyZone();
	    z.setName(dzone_name);
	    z.setSubmacro(dzone_submacro);
	    z.setSubmicro(dzone_submicro);
	    z.setSlotNumber(Integer.parseInt(dzone_totalslot));
			
		try {
			createdFile = csvManager.create_timecost_file_history_zone(z, matrix, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV costo accesso storico per zone: " + e.getMessage());
		}
		return createdFile;
	}	
	
	// --------------------------------------- Street TimeCost CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timecost/streethistory/csv")
	public @ResponseBody
	String createTimeCostStreetHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dstreet_name, @RequestParam(required=false) String dstreet_area, @RequestParam(required=false) String dstreet_totalslot, @RequestBody String[][] matrix) { //@RequestBody String data,
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
	    	
	    it.smartcommunitylab.parking.management.web.model.Street s = new it.smartcommunitylab.parking.management.web.model.Street();
	    s.setStreetReference(dstreet_name);
	    s.setSlotNumber(Integer.parseInt(dstreet_totalslot));
	    s.setArea_name(dstreet_area);
			
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_timecost_file_history_streets(s, matrix, path); //occ_matrix
		} catch (Exception e) {
			logger.error("Errore in creazione CSV costo accesso storico per vie: " + e.getMessage());
		}
		return createdFile;
	}	
	
	// --------------------------------------- Parkingstructure TimeCost CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timecost/parkingstructureshistory/csv")
	public @ResponseBody
	String createTimeCostStructureHistorycalCSV(HttpServletRequest request, HttpServletResponse response, @RequestParam(required=false) String dparking_name, @RequestParam(required=false) String dparking_streetreference, @RequestParam(required=false) String dparking_totalslot, @RequestBody String[][] matrix) { //@RequestBody String data,
		//ArrayList<it.smartcommunitylab.parking.management.web.model.Street> streetData = new ArrayList<it.smartcommunitylab.parking.management.web.model.Street>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
	    OccupancyParkingStructure ops = new OccupancyParkingStructure();
	    ops.setName(dparking_name);
	    ops.setStreetReference(dparking_streetreference);
	    ops.setSlotNumber(Integer.parseInt(dparking_totalslot));
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_timecost_file_history_structs(ops, matrix, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV occupazione storico per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;		
	}
	
	// Opened methods
	
	// Open method to retrieve all street occupancy data (with complete street data)
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/occupancy/{appId}/streets")
	public @ResponseBody
	List<StreetBean> getAllStreetOccupancyNS(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType) throws Exception {
		String type = Street.class.getCanonicalName();
		return dynamic.getOccupationRateFromAllStreets(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}
	
	// Open method to retrieve all street occupancy data (only occupancy data)
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/occupancychanged/{appId}/streets")
	public @ResponseBody
	List<CompactStreetBean> getAllStreetChangedOccupancyNS(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType) throws Exception {
		String type = Street.class.getCanonicalName();
		return dynamic.getOccupationChangesFromAllStreets(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}
	
	// Open method to retrieve all parkingStructures occupancy data (with complete ps data)
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/occupancy/{appId}/parkingstructures")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructureOccupancyNS(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType) throws Exception {
		String type = Parking.class.getCanonicalName();
		return dynamic.getOccupationRateFromAllParkings(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}
	
	// Open method to retrieve all parkingStructures occupancy data (only occupancy data)
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/occupancychanged/{appId}/parkingstructures")
	public @ResponseBody
	List<CompactParkingStructureBean> getAllParkingStructureChangedOccupancyNS(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType) throws Exception {
		String type = Parking.class.getCanonicalName();
		return dynamic.getOccupationChangesFromAllParkings(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType);
	}

}
