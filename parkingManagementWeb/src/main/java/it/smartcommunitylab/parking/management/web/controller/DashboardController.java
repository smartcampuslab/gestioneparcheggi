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
import it.smartcommunitylab.parking.management.web.repository.impl.StatRepositoryImpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

	@PostConstruct
	private void init() throws IOException {
		markerIconStorage = new MarkerIconStorage();
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
	public @ResponseBody ParkingStructureBean getParkingStructureOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		String type = Parking.class.getCanonicalName();
		return dynamic.getOccupationRateFromParking(id, appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/parkingstructurecompare/{id}")
	public @ResponseBody String[][] getHistorycalParkingStructureOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		String type = Parking.class.getCanonicalName();
		return dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 2, lang);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/parkingstructures")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructureOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		String type = Parking.class.getCanonicalName();
		return dynamic.getOccupationRateFromAllParkings(appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancychanged/{appId}/parkingstructures")
	public @ResponseBody
	List<CompactParkingStructureBean> getAllParkingStructureChangedOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		String type = Parking.class.getCanonicalName();
		return dynamic.getOccupationChangesFromAllParkings(appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/street/{id}")
	public @ResponseBody StreetBean getStreetOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		String type = Street.class.getCanonicalName();
		return dynamic.getOccupationRateFromStreet(id, appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/streetcompare/{id}")
	public @ResponseBody String[][] getHistorycalStreetOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		String type = Street.class.getCanonicalName();
		return dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4, lang);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/zonecompare/{id}")
	public @ResponseBody String[][] getHistorycalZoneOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang) throws Exception {
		String type = Street.class.getCanonicalName();
		return dynamic.getHistorycalDataFromZone(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4, lang);
		//return dynamic.getHistorycalDataFromObject(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/areacompare/{id}")
	public @ResponseBody String[][] getHistorycalAreaOccupancy(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int verticalVal, @RequestParam(required=false) int orizontalVal, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) int lang) throws Exception {
		String type = Street.class.getCanonicalName();
		return dynamic.getHistorycalDataFromArea(id, appId, type, verticalVal, orizontalVal, null, year, month, dayType, weekday, hour, valueType, 4, lang);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/streets")
	public @ResponseBody
	List<StreetBean> getAllStreetOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
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
		return dynamic.getOccupationRateFromAllStreets(appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancychanged/{appId}/streets")
	public @ResponseBody
	List<CompactStreetBean> getAllStreetChangedOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
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
		return dynamic.getOccupationChangesFromAllStreets(appId, type, null, year, month, dayType, weekday, hour, valueType);
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
	String createStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in street csv creation.");
		ArrayList<it.smartcommunitylab.parking.management.web.model.Street> streetData = new ArrayList<it.smartcommunitylab.parking.management.web.model.Street>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.info("Current path: " + path);
		
		JSONArray streetList = new JSONArray(data);
		logger.info("Street list size: " + streetList.length());
    	
	    for(int i = 0; i < streetList.length(); i++){
	    	JSONObject street = streetList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = street.getString("id");
	    	String id_app = street.getString("id_app");
	    	String streetReference = street.getString("streetReference");
	    	Integer slotNumber = (!street.isNull("slotNumber")) ? street.getInt("slotNumber") : 0;
	    	Integer handicappedSlotNumber = (!street.isNull("handicappedSlotNumber")) ? street.getInt("handicappedSlotNumber") : 0;
	    	Integer reservedSlotNumber = (!street.isNull("reservedSlotNumber")) ? street.getInt("reservedSlotNumber") : 0;
	    	Integer timedParkSlotNumber = (!street.isNull("timedParkSlotNumber")) ? street.getInt("timedParkSlotNumber") : 0;
	    	Integer freeParkSlotNumber = (!street.isNull("freeParkSlotNumber")) ? street.getInt("freeParkSlotNumber") : 0;
	    	Integer freeParkSlotSignNumber = (!street.isNull("freeParkSlotSignNumber")) ? street.getInt("freeParkSlotSignNumber") : 0;
	    	Integer paidSlotNumber = (!street.isNull("paidSlotNumber")) ? street.getInt("paidSlotNumber") : 0;
	    	Integer unusuableSlotNumber = (!street.isNull("unusuableSlotNumber")) ? street.getInt("unusuableSlotNumber") : 0;
	    	Boolean subscritionAllowedPark = (!street.isNull("subscritionAllowedPark")) ? street.getBoolean("subscritionAllowedPark") : false;
	    	String rateAreaId = street.getString("rateAreaId");
	    	String color = street.getString("color");
	    	String area_name = street.getString("area_name");
	    	String area_color = street.getString("area_color");
	    	it.smartcommunitylab.parking.management.web.model.Street s = new it.smartcommunitylab.parking.management.web.model.Street();
	    	s.setId(id);
	    	s.setId_app(id_app);
	    	s.setStreetReference(streetReference);
	    	s.setSlotNumber(slotNumber);
	    	s.setHandicappedSlotNumber(handicappedSlotNumber);
	    	s.setReservedSlotNumber(reservedSlotNumber);
	    	s.setTimedParkSlotNumber(timedParkSlotNumber);
	    	s.setFreeParkSlotNumber(freeParkSlotNumber);
	    	s.setFreeParkSlotSignNumber(freeParkSlotSignNumber);
	    	s.setPaidSlotNumber(paidSlotNumber);
	    	s.setUnusuableSlotNumber(unusuableSlotNumber);
	    	s.setSubscritionAllowedPark(subscritionAllowedPark);
	    	s.setRateAreaId(rateAreaId);
	    	s.setColor(color);
	    	s.setArea_name(area_name);
	    	s.setArea_color(area_color);
	    	streetData.add(s);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_supply_file_streets(streetData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per vie: " + e.getMessage());
		}
		return createdFile;
	}
	
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/supply/zone/csv")
	public @ResponseBody
	String createZoneCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in zone csv creation.");
		ArrayList<Zone> zoneData = new ArrayList<Zone>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray zoneList = new JSONArray(data);
		logger.info("Zone list size: " + zoneList.length());
	   	
	    for(int i = 0; i < zoneList.length(); i++){
	    	JSONObject zone = zoneList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = zone.getString("id");
	    	String id_app = zone.getString("id_app");
	    	String name = zone.getString("name");
	    	String macro = zone.getString("submacro");
	    	String color = zone.getString("color");
	    	String type = zone.getString("type");
	    	String note = zone.getString("note");
	    	Integer slotNumber = (!zone.isNull("slotNumber")) ? zone.getInt("slotNumber") : 0;
	    	Zone z = new Zone();
	    	z.setId(id);
	    	z.setId_app(id_app);
	    	z.setName(name);
	    	z.setSubmacro(macro);
	    	z.setColor(color);
	    	z.setType(type);
	    	z.setNote(note);
	    	z.setSlotNumber(slotNumber);
	    	zoneData.add(z);
	    }	
			
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_supply_file_zones(zoneData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per zone: " + e.getMessage());
		}
		return createdFile;
	}
		
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/supply/area/csv")
	public @ResponseBody
	String createAreaCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in area csv creation.");
		ArrayList<RateArea> areaData = new ArrayList<RateArea>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray areaList = new JSONArray(data);
		logger.info("Area list size: " + areaList.length());
	   	
	    for(int i = 0; i < areaList.length(); i++){
	    	JSONObject area = areaList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = area.getString("id");
	    	String id_app = area.getString("id_app");
	    	String name = area.getString("name");
	    	Float fee = (!area.isNull("fee")) ? Float.valueOf(Double.toString(area.getDouble("fee"))) : 0F;
	    	String timeSlot = area.getString("timeSlot");
	    	String smsCode = area.getString("smsCode");
	    	String color = area.getString("color");
	    	String note = (!area.isNull("note")) ? area.getString("note") : "";
		   	Integer slotNumber = (!area.isNull("slotNumber")) ? area.getInt("slotNumber") : 0;
		   	RateArea a = new RateArea();
		   	a.setId(id);
		   	a.setId_app(id_app);
		   	a.setName(name);
		   	a.setFee(fee);
		   	a.setTimeSlot(timeSlot);
		   	a.setSmsCode(smsCode);
		   	a.setColor(color);
		   	a.setNote(note);
		   	a.setSlotNumber(slotNumber);
		   	areaData.add(a);
	    }	
			
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_supply_file_areas(areaData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per aree: " + e.getMessage());
		}
		return createdFile;
	}
		
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/supply/parkingstructures/csv")
	public @ResponseBody
	String createStructureCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in parkingstructures csv creation.");
		ArrayList<ParkingStructure> structData = new ArrayList<ParkingStructure>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
			
		JSONArray structList = new JSONArray(data);
		logger.info("Structs list size: " + structList.length());
	    	
		for(int i = 0; i < structList.length(); i++){
		   	JSONObject struct = structList.getJSONObject(i);
		    //logger.error(String.format("Struct Data: %s", struct.toString()));
		    String id = struct.getString("id");
		    String id_app = struct.getString("id_app");
		    String name = struct.getString("name");
		    String streetReference = (!struct.isNull("streetReference")) ? struct.getString("streetReference") : "";
	    	String managementMode = (!struct.isNull("managementMode")) ? struct.getString("managementMode") : "";
	    	String manager = (!struct.isNull("manager")) ? struct.getString("manager") : "";
	    	String phoneNumber = (!struct.isNull("phoneNumber")) ? struct.getString("phoneNumber") : "";
		    Integer fee_val = (!struct.isNull("fee_val")) ? struct.getInt("fee_val") : 0;
		    String fee_note = (!struct.isNull("fee_note")) ? struct.getString("fee_note") : "n.p.";
		    String opening = "n.p.";
		    JSONObject openingTime = (!struct.isNull("openingTime")) ? struct.getJSONObject("openingTime") : null;
		    if(openingTime != null){
		    	opening = "";
		    	JSONArray periods = openingTime.getJSONArray("period");
		    	for(int j = 0; j < periods.length(); j++){
		    		JSONObject fromTo = periods.getJSONObject(j);
		    		opening += fromTo.getString("from") + " - " + fromTo.getString("to") + " / ";
		    	}
		    	if(opening.length() > 0){
		    		opening = opening.substring(0, opening.length() - 3);
		    	}
		    }
		    Integer slotNumber = (!struct.isNull("slotNumber")) ? struct.getInt("slotNumber") : 0;
		    Integer payingSlotNumber = (!struct.isNull("payingSlotNumber")) ? struct.getInt("payingSlotNumber") : 0;
		    Integer handicappedSlotNumber = (!struct.isNull("handicappedSlotNumber")) ? struct.getInt("handicappedSlotNumber") : 0;
		    Integer unusuableSlotNumber = (!struct.isNull("unusuableSlotNumber")) ? struct.getInt("unusuableSlotNumber") : 0;
		    ParkingStructure ps = new ParkingStructure();
		    ps.setId(id);
		    ps.setId_app(id_app);
		    ps.setName(name);
		    ps.setStreetReference(streetReference);
		    ps.setManagementMode(managementMode);
		    ps.setManager(manager);
		    ps.setPhoneNumber(phoneNumber);
		    ps.setFee_val(fee_val);
		    ps.setFee_note(fee_note);
		    ps.setTimeSlot(opening);	// String value
		    ps.setSlotNumber(slotNumber);
		    ps.setPayingSlotNumber(payingSlotNumber);
		    ps.setHandicappedSlotNumber(handicappedSlotNumber);
		    ps.setUnusuableSlotNumber(unusuableSlotNumber);
		    structData.add(ps);
		}	
			
		try {
			createdFile = csvManager.create_supply_file_structs(structData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/supply/parkingmeter/csv")
	public @ResponseBody
	String createPMCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in parkingmeter csv creation.");
		ArrayList<ParkingMeter> pMData = new ArrayList<ParkingMeter>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray pmList = new JSONArray(data);
		logger.info("ParkingMeters list size: " + pmList.length());
    	
	    for(int i = 0; i < pmList.length(); i++){
	    	JSONObject pm = pmList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = pm.getString("id");
	    	String id_app = pm.getString("id_app");
	    	Integer code = pm.getInt("code");
	    	String note = pm.getString("note");
	    	String status = pm.getString("status");
	    	ParkingMeter spm = new ParkingMeter();
	    	spm.setId(id);
	    	spm.setId_app(id_app);
	    	spm.setCode(code);
	    	spm.setNote(note);
	    	if(status.compareTo("ACTIVE") == 0){
	    		spm.setStatus(ParkingMeter.Status.ACTIVE);
	    	} else {
	    		spm.setStatus(ParkingMeter.Status.INACTIVE);
	    	}
	    	pMData.add(spm);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_supply_file_parkingmeters(pMData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcometri: " + e.getMessage());
		}
		return createdFile;
	}	
	// --------------------------------------- Occupancy CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupancy/street/csv")
	public @ResponseBody
	String createOccupancyStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in street csv creation.");
		ArrayList<OccupancyStreet> streetData = new ArrayList<OccupancyStreet>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.info("Current path: " + path);
				
		JSONArray streetList = new JSONArray(data);
		logger.info("Street list size: " + streetList.length());
		    	
		for(int i = 0; i < streetList.length(); i++){
			JSONObject street = streetList.getJSONObject(i);
			    	//logger.error(String.format("Street Data: %s", street.toString()));
			String id = street.getString("id");
	    	String id_app = street.getString("id_app");
	    	String streetReference = street.getString("streetReference");
	    	Integer slotNumber = (!street.isNull("slotNumber")) ? street.getInt("slotNumber") : 0;
	    	Integer handicappedSlotNumber = (!street.isNull("handicappedSlotNumber")) ? street.getInt("handicappedSlotNumber") : 0;
	    	Integer handicappedSlotOccupied = (!street.isNull("handicappedSlotOccupied")) ? street.getInt("handicappedSlotOccupied") : 0;
	    	Integer reservedSlotNumber = (!street.isNull("reservedSlotNumber")) ? street.getInt("reservedSlotNumber") : 0;
	    	Integer reservedSlotOccupied = (!street.isNull("reservedSlotOccupied")) ? street.getInt("reservedSlotOccupied") : 0;
	    	Integer timedParkSlotNumber = (!street.isNull("timedParkSlotNumber")) ? street.getInt("timedParkSlotNumber") : 0;
	    	Integer timedParkSlotOccupied = (!street.isNull("timedParkSlotOccupied")) ? street.getInt("timedParkSlotOccupied") : 0;
	    	Integer freeParkSlotNumber = (!street.isNull("freeParkSlotNumber")) ? street.getInt("freeParkSlotNumber") : 0;
	    	Integer freeParkSlotOccupied = (!street.isNull("freeParkSlotOccupied")) ? street.getInt("freeParkSlotOccupied") : 0;
	    	Integer freeParkSlotSignNumber = (!street.isNull("freeParkSlotSignNumber")) ? street.getInt("freeParkSlotSignNumber") : 0;
	    	Integer freeParkSlotSignOccupied = (!street.isNull("freeParkSlotSignOccupied")) ? street.getInt("freeParkSlotSignOccupied") : 0;
	    	Integer paidSlotNumber = (!street.isNull("paidSlotNumber")) ? street.getInt("paidSlotNumber") : 0;
	    	Integer paidSlotOccupied = (!street.isNull("paidSlotOccupied")) ? street.getInt("paidSlotOccupied") : 0;
	    	Integer unusuableSlotNumber = (!street.isNull("unusuableSlotNumber")) ? street.getInt("unusuableSlotNumber") : 0;
	    	Boolean subscritionAllowedPark = (!street.isNull("subscritionAllowedPark")) ? street.getBoolean("subscritionAllowedPark") : false;
	    	String rateAreaId = street.getString("rateAreaId");
	    	String color = street.getString("color");
	    	Integer occupancyRate = (!street.isNull("occupancyRate")) ? street.getInt("occupancyRate") : -1;
	    	Integer freeParkOccupied = (!street.isNull("freeParkOccupied")) ? street.getInt("freeParkOccupied") : -1;
			Integer slotOccupied = (!street.isNull("slotOccupied")) ? street.getInt("slotOccupied") : -1;
	    	String area_name = street.getString("area_name");
	    	String area_color = street.getString("area_color");
	    	OccupancyStreet os = new OccupancyStreet();
	    	os.setId(id);
	    	os.setId_app(id_app);
	    	os.setStreetReference(streetReference);
	    	os.setSlotNumber(slotNumber);
	    	os.setHandicappedSlotNumber(handicappedSlotNumber);
	    	os.setHandicappedSlotOccupied(handicappedSlotOccupied);
	    	os.setReservedSlotNumber(reservedSlotNumber);
	    	os.setReservedSlotOccupied(reservedSlotOccupied);
	    	os.setTimedParkSlotNumber(timedParkSlotNumber);
	    	os.setTimedParkSlotOccupied(timedParkSlotOccupied);
	    	os.setFreeParkSlotNumber(freeParkSlotNumber);
	    	os.setFreeParkSlotOccupied(freeParkSlotOccupied);
	    	os.setFreeParkSlotSignNumber(freeParkSlotSignNumber);
	    	os.setFreeParkSlotSignOccupied(freeParkSlotSignOccupied);
	    	os.setPaidSlotNumber(paidSlotNumber);
	    	os.setPaidSlotOccupied(paidSlotOccupied);
	    	os.setUnusuableSlotNumber(unusuableSlotNumber);
	    	os.setSubscritionAllowedPark(subscritionAllowedPark);
	    	os.setRateAreaId(rateAreaId);
	    	os.setColor(color);
	    	os.setOccupancyRate(occupancyRate);
	    	os.setFreeParkOccupied(freeParkOccupied);
	    	os.setSlotOccupied(slotOccupied);
	    	os.setArea_name(area_name);
	    	os.setArea_color(area_color);
	    	streetData.add(os);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_occupancy_file_streets(streetData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per vie: " + e.getMessage());
		}
		return createdFile;
	}	
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupancy/zone/csv")
	public @ResponseBody
	String createOccupancyZoneCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in zone csv creation.");
		ArrayList<OccupancyZone> zoneData = new ArrayList<OccupancyZone>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray zoneList = new JSONArray(data);
		logger.info("Zone list size: " + zoneList.length());
    	
	    for(int i = 0; i < zoneList.length(); i++){
	    	JSONObject zone = zoneList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = zone.getString("id");
	    	String id_app = zone.getString("id_app");
	    	String name = zone.getString("name");
	    	String macro = zone.getString("submacro");
	    	String color = zone.getString("color");
	    	String type = zone.getString("type");
	    	String note = zone.getString("note");
	    	Integer occupancy = (!zone.isNull("occupancy")) ? zone.getInt("occupancy") : 0;
	    	Integer slotNumber = (!zone.isNull("slotNumber")) ? zone.getInt("slotNumber") : 0;
	    	Integer slotOccupied = (!zone.isNull("slotOccupied")) ? zone.getInt("slotOccupied") : 0;
	    	OccupancyZone oz = new OccupancyZone();
	    	oz.setId(id);
	    	oz.setId_app(id_app);
	    	oz.setName(name);
	    	oz.setSubmacro(macro);
	    	oz.setColor(color);
	    	oz.setType(type);
	    	oz.setNote(note);
	    	oz.setOccupancy(occupancy);
	    	oz.setSlotNumber(slotNumber);
	    	oz.setSlotOccupied(slotOccupied);
	    	zoneData.add(oz);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_occupancy_file_zones(zoneData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per zone: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupancy/area/csv")
	public @ResponseBody
	String createOccupancyAreaCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in area csv creation.");
		ArrayList<OccupancyRateArea> areaData = new ArrayList<OccupancyRateArea>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray areaList = new JSONArray(data);
		logger.info("Area list size: " + areaList.length());
    	
	    for(int i = 0; i < areaList.length(); i++){
	    	JSONObject area = areaList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = area.getString("id");
	    	String id_app = area.getString("id_app");
	    	String name = area.getString("name");
	    	Float fee = (!area.isNull("fee")) ? Float.valueOf(Double.toString(area.getDouble("fee"))) : 0F;
	    	String timeSlot = area.getString("timeSlot");
	    	String smsCode = area.getString("smsCode");
	    	String color = area.getString("color");
	    	String note = (!area.isNull("note")) ? area.getString("note") : "";
	    	Integer occupancy = (!area.isNull("occupancy")) ? area.getInt("occupancy") : 0;
	    	Integer slotNumber = (!area.isNull("slotNumber")) ? area.getInt("slotNumber") : 0;
	    	Integer slotOccupied = (!area.isNull("slotOccupied")) ? area.getInt("slotOccupied") : 0;
	    	OccupancyRateArea oa = new OccupancyRateArea();
	    	oa.setId(id);
	    	oa.setId_app(id_app);
	    	oa.setName(name);
	    	oa.setFee(fee);
	    	oa.setTimeSlot(timeSlot);
	    	oa.setSmsCode(smsCode);
	    	oa.setColor(color);
	    	oa.setNote(note);
	    	oa.setOccupancy(occupancy);
	    	oa.setSlotNumber(slotNumber);
	    	oa.setSlotOccupied(slotOccupied);
	    	areaData.add(oa);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_occupancy_file_areas(areaData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per aree: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/occupancy/parkingstructures/csv")
	public @ResponseBody
	String createOccupancyStructureCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in parkingstructures csv creation.");
		ArrayList<OccupancyParkingStructure> structData = new ArrayList<OccupancyParkingStructure>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray structList = new JSONArray(data);
		logger.info("Structs list size: " + structList.length());
    	
	    for(int i = 0; i < structList.length(); i++){
	    	JSONObject struct = structList.getJSONObject(i);
	    	logger.error(String.format("Struct Data: %s", struct.toString()));
	    	String id = struct.getString("id");
	    	String id_app = struct.getString("id_app");
	    	String name = struct.getString("name");
	    	String streetReference = (!struct.isNull("streetReference")) ? struct.getString("streetReference") : "";
	    	String managementMode = (!struct.isNull("managementMode")) ? struct.getString("managementMode") : "";
	    	String manager = (!struct.isNull("manager")) ? struct.getString("manager") : "";
	    	String phoneNumber = (!struct.isNull("phoneNumber")) ? struct.getString("phoneNumber") : "";
	    	String fee = (!struct.isNull("fee")) ? struct.getString("fee") : "0.0";
	    	String timeSlot = (!struct.isNull("timeSlot")) ? struct.getString("timeSlot") : "";
	    	Integer occupancyRate = (!struct.isNull("occupancyRate")) ? struct.getInt("occupancyRate") : 0;
	    	Integer slotNumber = (!struct.isNull("slotNumber")) ? struct.getInt("slotNumber") : 0;
	    	Integer payingSlotNumber = (!struct.isNull("payingSlotNumber")) ? struct.getInt("payingSlotNumber") : 0;
	    	Integer payingSlotOccupied = (!struct.isNull("payingSlotOccupied")) ? struct.getInt("payingSlotOccupied") : 0;
	    	Integer handicappedSlotNumber = (!struct.isNull("handicappedSlotNumber")) ? struct.getInt("handicappedSlotNumber") : 0;
	    	Integer handicappedSlotOccupied = (!struct.isNull("handicappedSlotOccupied")) ? struct.getInt("handicappedSlotOccupied") : 0;
	    	Integer unusuableSlotNumber = (!struct.isNull("unusuableSlotNumber")) ? struct.getInt("unusuableSlotNumber") : 0;
	    	OccupancyParkingStructure ops = new OccupancyParkingStructure();
	    	ops.setId(id);
	    	ops.setId_app(id_app);
	    	ops.setName(name);
	    	ops.setStreetReference(streetReference);
	    	ops.setManagementMode(managementMode);
	    	ops.setManager(manager);
	    	ops.setPhoneNumber(phoneNumber);
	    	ops.setFee(fee);
	    	ops.setTimeSlot(timeSlot);
	    	ops.setOccupancyRate(occupancyRate);
	    	ops.setSlotNumber(slotNumber);
	    	ops.setPayingSlotNumber(payingSlotNumber);
	    	ops.setPayingSlotOccupied(payingSlotOccupied);
	    	ops.setHandicappedSlotNumber(handicappedSlotNumber);
	    	ops.setHandicappedSlotOccupied(handicappedSlotOccupied);
	    	ops.setUnusuableSlotNumber(unusuableSlotNumber);
	    	structData.add(ops);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_occupancy_file_structs(structData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;
	}	
	
	// ----------------------------------------- Profit CSV ---------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/street/csv")
	public @ResponseBody
	String createProfitStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in profit street csv creation.");
		ArrayList<ProfitStreet> streetData = new ArrayList<ProfitStreet>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.info("Current path: " + path);
		
		JSONArray streetList = new JSONArray(data);
		logger.info("Street list size: " + streetList.length());
    	
	    for(int i = 0; i < streetList.length(); i++){
	    	JSONObject street = streetList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = street.getString("id");
	    	String id_app = street.getString("id_app");
	    	String streetReference = street.getString("streetReference");
	    	Integer slotNumber = (!street.isNull("slotNumber")) ? street.getInt("slotNumber") : 0;
	    	Integer handicappedSlotNumber = (!street.isNull("handicappedSlotNumber")) ? street.getInt("handicappedSlotNumber") : 0;
	    	Integer handicappedSlotOccupied = (!street.isNull("handicappedSlotOccupied")) ? street.getInt("handicappedSlotOccupied") : 0;
	    	Integer reservedSlotNumber = (!street.isNull("reservedSlotNumber")) ? street.getInt("reservedSlotNumber") : 0;
	    	Integer reservedSlotOccupied = (!street.isNull("reservedSlotOccupied")) ? street.getInt("reservedSlotOccupied") : 0;
	    	Integer timedParkSlotNumber = (!street.isNull("timedParkSlotNumber")) ? street.getInt("timedParkSlotNumber") : 0;
	    	Integer timedParkSlotOccupied = (!street.isNull("timedParkSlotOccupied")) ? street.getInt("timedParkSlotOccupied") : 0;
	    	Integer freeParkSlotNumber = (!street.isNull("freeParkSlotNumber")) ? street.getInt("freeParkSlotNumber") : 0;
	    	Integer freeParkSlotOccupied = (!street.isNull("freeParkSlotOccupied")) ? street.getInt("freeParkSlotOccupied") : 0;
	    	Integer freeParkSlotSignNumber = (!street.isNull("freeParkSlotSignNumber")) ? street.getInt("freeParkSlotSignNumber") : 0;
	    	Integer freeParkSlotSignOccupied = (!street.isNull("freeParkSlotSignOccupied")) ? street.getInt("freeParkSlotSignOccupied") : 0;
	    	Integer paidSlotNumber = (!street.isNull("paidSlotNumber")) ? street.getInt("paidSlotNumber") : 0;
	    	Integer paidSlotOccupied = (!street.isNull("paidSlotOccupied")) ? street.getInt("paidSlotOccupied") : 0;
	    	Integer unusuableSlotNumber = (!street.isNull("unusuableSlotNumber")) ? street.getInt("unusuableSlotNumber") : 0;
	    	Boolean subscritionAllowedPark = (!street.isNull("subscritionAllowedPark")) ? street.getBoolean("subscritionAllowedPark") : false;
	    	String rateAreaId = street.getString("rateAreaId");
	    	String color = street.getString("color");
	    	Integer profit = (!street.isNull("profit")) ? street.getInt("profit") : -1;
	    	Integer tickets = (!street.isNull("tickets")) ? street.getInt("tickets") : -1;
	    	//Integer freeParkOccupied = (!street.isNull("freeParkOccupied")) ? street.getInt("freeParkOccupied") : -1;
	    	//Integer slotOccupied = (!street.isNull("slotOccupied")) ? street.getInt("slotOccupied") : -1;
	    	String area_name = street.getString("area_name");
	    	String area_color = street.getString("area_color");
	    	ProfitStreet ps = new ProfitStreet();
	    	ps.setId(id);
	    	ps.setId_app(id_app);
	    	ps.setStreetReference(streetReference);
	    	ps.setSlotNumber(slotNumber);
	    	ps.setHandicappedSlotNumber(handicappedSlotNumber);
	    	ps.setHandicappedSlotOccupied(handicappedSlotOccupied);
	    	ps.setReservedSlotNumber(reservedSlotNumber);
	    	ps.setReservedSlotOccupied(reservedSlotOccupied);
	    	ps.setTimedParkSlotNumber(timedParkSlotNumber);
	    	ps.setTimedParkSlotOccupied(timedParkSlotOccupied);
	    	ps.setFreeParkSlotNumber(freeParkSlotNumber);
	    	ps.setFreeParkSlotOccupied(freeParkSlotOccupied);
	    	ps.setFreeParkSlotSignNumber(freeParkSlotSignNumber);
	    	ps.setFreeParkSlotSignOccupied(freeParkSlotSignOccupied);
	    	ps.setPaidSlotNumber(paidSlotNumber);
	    	ps.setPaidSlotOccupied(paidSlotOccupied);
	    	ps.setUnusuableSlotNumber(unusuableSlotNumber);
	    	ps.setSubscritionAllowedPark(subscritionAllowedPark);
	    	ps.setRateAreaId(rateAreaId);
	    	ps.setColor(color);
	    	ps.setProfit(profit);
	    	ps.setTickets(tickets);
	    	ps.setArea_name(area_name);
	    	ps.setArea_color(area_color);
	    	streetData.add(ps);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_profit_file_streets(streetData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV ricavi per vie: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/parkingmeter/csv")
	public @ResponseBody
	String createProfitPMCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in profit parkingmeter csv creation.");
		ArrayList<ProfitParkingMeter> profitPMData = new ArrayList<ProfitParkingMeter>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray pmList = new JSONArray(data);
		logger.info("ParkingMeters list size: " + pmList.length());
    	
	    for(int i = 0; i < pmList.length(); i++){
	    	JSONObject pm = pmList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = pm.getString("id");
	    	String id_app = pm.getString("id_app");
	    	Integer code = pm.getInt("code");
	    	String note = pm.getString("note");
	    	String status = pm.getString("status");
	    	String areaId = pm.getString("areaId");
	    	Integer profit = (!pm.isNull("profit")) ? pm.getInt("profit") : 0;
	    	Integer tickets = (!pm.isNull("tickets")) ? pm.getInt("tickets") : 0;
	    	ProfitParkingMeter ppm = new ProfitParkingMeter();
	    	ppm.setId(id);
	    	ppm.setId_app(id_app);
	    	ppm.setCode(code);
	    	ppm.setNote(note);
	    	if(status.compareTo("ACTIVE") == 0){
	    		ppm.setStatus(ProfitParkingMeter.Status.ACTIVE);
	    	} else {
	    		ppm.setStatus(ProfitParkingMeter.Status.INACTIVE);
	    	}
	    	ppm.setAreaId(areaId);
	    	ppm.setProfit(profit);
	    	ppm.setTickets(tickets);
	    	profitPMData.add(ppm);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_profit_file_parkingmeters(profitPMData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV incassi per parcometri: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/zone/csv")
	public @ResponseBody
	String createProfitZoneCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in profit zone csv creation.");
		ArrayList<ProfitZone> zoneData = new ArrayList<ProfitZone>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray zoneList = new JSONArray(data);
		logger.info("Zone list size: " + zoneList.length());
    	
	    for(int i = 0; i < zoneList.length(); i++){
	    	JSONObject zone = zoneList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = zone.getString("id");
	    	String id_app = zone.getString("id_app");
	    	String name = zone.getString("name");
	    	String macro = zone.getString("submacro");
	    	String color = zone.getString("color");
	    	String type = zone.getString("type");
	    	String note = zone.getString("note");
	    	Integer profit = (!zone.isNull("profit")) ? zone.getInt("profit") : 0;
	    	Integer tickets = (!zone.isNull("tickets")) ? zone.getInt("tickets") : 0;
	    	Integer slotNumber = (!zone.isNull("slotNumber")) ? zone.getInt("slotNumber") : 0;
	    	ProfitZone pz = new ProfitZone();
	    	pz.setId(id);
	    	pz.setId_app(id_app);
	    	pz.setName(name);
	    	pz.setSubmacro(macro);
	    	pz.setColor(color);
	    	pz.setType(type);
	    	pz.setNote(note);
	    	pz.setProfit(profit);
	    	pz.setTickets(tickets);	    	
	    	pz.setSlotNumber(slotNumber);
	    	zoneData.add(pz);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_profit_file_zones(zoneData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV incassi per zone: " + e.getMessage());
		}
		return createdFile;
	}	
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/area/csv")
	public @ResponseBody
	String createProfitAreaCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in profit area csv creation.");
		ArrayList<ProfitRateArea> areaData = new ArrayList<ProfitRateArea>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray areaList = new JSONArray(data);
		logger.info("Area list size: " + areaList.length());
    	
	    for(int i = 0; i < areaList.length(); i++){
	    	JSONObject area = areaList.getJSONObject(i);
	    	String id = area.getString("id");
	    	String id_app = area.getString("id_app");
	    	String name = area.getString("name");
	    	Float fee = (!area.isNull("fee")) ? Float.valueOf(Double.toString(area.getDouble("fee"))) : 0F;
	    	String timeSlot = area.getString("timeSlot");
	    	String smsCode = area.getString("smsCode");
	    	String color = area.getString("color");
	    	String note = (!area.isNull("note")) ? area.getString("note") : "";
	    	Integer slotNumber = (!area.isNull("slotNumber")) ? area.getInt("slotNumber") : 0;
	    	Integer profit = (!area.isNull("profit")) ? area.getInt("profit") : 0;
	    	Integer tickets = (!area.isNull("tickets")) ? area.getInt("tickets") : 0;
	    	ProfitRateArea pa = new ProfitRateArea();
	    	pa.setId(id);
	    	pa.setId_app(id_app);
	    	pa.setName(name);
	    	pa.setFee(fee);
	    	pa.setTimeSlot(timeSlot);
	    	pa.setSmsCode(smsCode);
	    	pa.setColor(color);
	    	pa.setNote(note);
	    	pa.setSlotNumber(slotNumber);
	    	pa.setProfit(profit);
	    	pa.setTickets(tickets);
	    	areaData.add(pa);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_profit_file_areas(areaData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per aree: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/profit/parkingstructures/csv")
	public @ResponseBody
	String createProfitStructureCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in profit parkingstructures csv creation.");
		ArrayList<ProfitParkingStructure> structData = new ArrayList<ProfitParkingStructure>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray structList = new JSONArray(data);
		logger.info("Profit structs list size: " + structList.length());
    	
	    for(int i = 0; i < structList.length(); i++){
	    	JSONObject struct = structList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = struct.getString("id");
	    	String id_app = struct.getString("id_app");
	    	String name = struct.getString("name");
	    	String streetReference = (!struct.isNull("streetReference")) ? struct.getString("streetReference") : "";
	    	String managementMode = (!struct.isNull("managementMode")) ? struct.getString("managementMode") : "";
	    	String manager = (!struct.isNull("manager")) ? struct.getString("manager") : "";
	    	String phoneNumber = (!struct.isNull("phoneNumber")) ? struct.getString("phoneNumber") : "";
	    	String fee = (!struct.isNull("fee")) ? struct.getString("fee") : "0.0";
	    	String timeSlot = (!struct.isNull("timeSlot")) ? struct.getString("timeSlot") : "";
	    	Integer slotNumber = (!struct.isNull("slotNumber")) ? struct.getInt("slotNumber") : 0;
	    	Integer handicappedSlotNumber = (!struct.isNull("handicappedSlotNumber")) ? struct.getInt("handicappedSlotNumber") : 0;
	    	Integer unusuableSlotNumber = (!struct.isNull("unusuableSlotNumber")) ? struct.getInt("unusuableSlotNumber") : 0;
	    	Integer profit = (!struct.isNull("profit")) ? struct.getInt("profit") : 0;
	    	Integer tickets = (!struct.isNull("tickets")) ? struct.getInt("tickets") : 0;
	    	ProfitParkingStructure pps = new ProfitParkingStructure();
	    	pps.setId(id);
	    	pps.setId_app(id_app);
	    	pps.setName(name);
	    	pps.setStreetReference(streetReference);
	    	pps.setManagementMode(managementMode);
	    	pps.setManager(manager);
	    	pps.setPhoneNumber(phoneNumber);
	    	pps.setFee(fee);
	    	pps.setTimeSlot(timeSlot);
	    	pps.setSlotNumber(slotNumber);
	    	pps.setHandicappedSlotNumber(handicappedSlotNumber);
	    	pps.setUnusuableSlotNumber(unusuableSlotNumber);
	    	pps.setProfit(profit);
	    	pps.setTickets(tickets);
	    	structData.add(pps);
	    }	
		
		try {
			createdFile = csvManager.create_profit_file_structs(structData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;
	}
	
	// --------------------------------------- Time cost CSV --------------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timeCost/street/csv")
	public @ResponseBody
	String createTimeCostStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in street time cost csv creation.");
		ArrayList<TimeCostStreet> streetData = new ArrayList<TimeCostStreet>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.info("Current path: " + path);
		
		JSONArray streetList = new JSONArray(data);
		logger.info("Time cost street list size: " + streetList.length());
    	
	    for(int i = 0; i < streetList.length(); i++){
	    	JSONObject street = streetList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = street.getString("id");
	    	String id_app = street.getString("id_app");
	    	String streetReference = street.getString("streetReference");
	    	Integer slotNumber = (!street.isNull("slotNumber")) ? street.getInt("slotNumber") : 0;
	    	Integer handicappedSlotNumber = (!street.isNull("handicappedSlotNumber")) ? street.getInt("handicappedSlotNumber") : 0;
	    	Integer unusuableSlotNumber = (!street.isNull("unusuableSlotNumber")) ? street.getInt("unusuableSlotNumber") : 0;
	    	Boolean subscritionAllowedPark = (!street.isNull("subscritionAllowedPark")) ? street.getBoolean("subscritionAllowedPark") : false;
	    	String rateAreaId = street.getString("rateAreaId");
	    	String color = street.getString("color");
	    	Integer occupancyRate = (!street.isNull("occupancyRate")) ? street.getInt("occupancyRate") : -1;
	    	Integer slotOccupied = (!street.isNull("slotOccupied")) ? street.getInt("slotOccupied") : -1;
	    	JSONObject extratime = (!street.isNull("extratime")) ? street.getJSONObject("extratime") : null;
	    	Integer minExtratime, maxExtratime;
	    	minExtratime = maxExtratime = -1;
	    	if(extratime != null) {
	    		minExtratime = (!extratime.isNull("extratime_estimation_min")) ? extratime.getInt("extratime_estimation_min") : -1;
		    	maxExtratime = (!extratime.isNull("extratime_estimation_max")) ? extratime.getInt("extratime_estimation_max") : -1;
	    	}
	    	String area_name = street.getString("area_name");
	    	String area_color = street.getString("area_color");
	    	TimeCostStreet ts = new TimeCostStreet();
	    	ts.setId(id);
	    	ts.setId_app(id_app);
	    	ts.setStreetReference(streetReference);
	    	ts.setSlotNumber(slotNumber);
	    	ts.setHandicappedSlotNumber(handicappedSlotNumber);
	    	ts.setUnusuableSlotNumber(unusuableSlotNumber);
	    	ts.setSubscritionAllowedPark(subscritionAllowedPark);
	    	ts.setRateAreaId(rateAreaId);
	    	ts.setColor(color);
	    	ts.setOccupancyRate(occupancyRate);
	    	ts.setSlotOccupied(slotOccupied);
	    	ts.setMinExtratime(minExtratime);
	    	ts.setMaxExtratime(maxExtratime);
	    	ts.setArea_name(area_name);
	    	ts.setArea_color(area_color);
	    	streetData.add(ts);
	    }	
		
		try {
			createdFile = csvManager.create_timeCost_file_streets(streetData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV con tempo di accesso per vie: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timeCost/zone/csv")
	public @ResponseBody
	String createTimeCostZoneCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in zone csv creation.");
		ArrayList<TimeCostZone> zoneData = new ArrayList<TimeCostZone>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray zoneList = new JSONArray(data);
		logger.info("Zone list size: " + zoneList.length());
    	
	    for(int i = 0; i < zoneList.length(); i++){
	    	JSONObject zone = zoneList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = zone.getString("id");
	    	String id_app = zone.getString("id_app");
	    	String name = zone.getString("name");
	    	String macro = zone.getString("submacro");
	    	String color = zone.getString("color");
	    	String type = zone.getString("type");
	    	String note = zone.getString("note");
	    	Integer occupancy = (!zone.isNull("occupancy")) ? zone.getInt("occupancy") : 0;
	    	Integer slotNumber = (!zone.isNull("slotNumber")) ? zone.getInt("slotNumber") : 0;
	    	Integer slotOccupied = (!zone.isNull("slotOccupied")) ? zone.getInt("slotOccupied") : 0;
	    	JSONObject extratime = (!zone.isNull("extratime")) ? zone.getJSONObject("extratime") : null;
	    	Integer minExtratime, maxExtratime;
	    	minExtratime = maxExtratime = -1;
	    	if(extratime != null) {
	    		minExtratime = (!extratime.isNull("extratime_estimation_min")) ? extratime.getInt("extratime_estimation_min") : -1;
		    	maxExtratime = (!extratime.isNull("extratime_estimation_max")) ? extratime.getInt("extratime_estimation_max") : -1;
	    	}
	    	TimeCostZone tz = new TimeCostZone();
	    	tz.setId(id);
	    	tz.setId_app(id_app);
	    	tz.setName(name);
	    	tz.setSubmacro(macro);
	    	tz.setColor(color);
	    	tz.setType(type);
	    	tz.setNote(note);
	    	tz.setOccupancy(occupancy);
	    	tz.setSlotNumber(slotNumber);
	    	tz.setSlotOccupied(slotOccupied);
	    	tz.setMinExtratime(minExtratime);
	    	tz.setMaxExtratime(maxExtratime);
	    	zoneData.add(tz);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_timeCost_file_zones(zoneData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV costo di accesso per zone: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timeCost/area/csv")
	public @ResponseBody
	String createTimeCostAreaCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in timeCost area csv creation.");
		ArrayList<TimeCostRateArea> areaData = new ArrayList<TimeCostRateArea>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		JSONArray areaList = new JSONArray(data);
		logger.info("Area list size: " + areaList.length());
    	
	    for(int i = 0; i < areaList.length(); i++){
	    	JSONObject area = areaList.getJSONObject(i);
	    	String id = area.getString("id");
	    	String id_app = area.getString("id_app");
	    	String name = area.getString("name");
	    	Float fee = (!area.isNull("fee")) ? Float.valueOf(Double.toString(area.getDouble("fee"))) : 0F;
	    	String timeSlot = area.getString("timeSlot");
	    	String smsCode = area.getString("smsCode");
	    	String color = area.getString("color");
	    	String note = (!area.isNull("note")) ? area.getString("note") : "";
	    	Integer occupancy = (!area.isNull("occupancy")) ? area.getInt("occupancy") : 0;
	    	Integer slotNumber = (!area.isNull("slotNumber")) ? area.getInt("slotNumber") : 0;
	    	Integer slotOccupied = (!area.isNull("slotOccupied")) ? area.getInt("slotOccupied") : 0;
	    	JSONObject extratime = (!area.isNull("extratime")) ? area.getJSONObject("extratime") : null;
	    	Integer minExtratime, maxExtratime;
	    	minExtratime = maxExtratime = -1;
	    	if(extratime != null) {
	    		minExtratime = (!extratime.isNull("extratime_estimation_min")) ? extratime.getInt("extratime_estimation_min") : -1;
		    	maxExtratime = (!extratime.isNull("extratime_estimation_max")) ? extratime.getInt("extratime_estimation_max") : -1;
	    	}
	    	TimeCostRateArea ta = new TimeCostRateArea();
	    	ta.setId(id);
	    	ta.setId_app(id_app);
	    	ta.setName(name);
	    	ta.setFee(fee);
	    	ta.setTimeSlot(timeSlot);
	    	ta.setSmsCode(smsCode);
	    	ta.setColor(color);
	    	ta.setNote(note);
	    	ta.setOccupancy(occupancy);
	    	ta.setSlotNumber(slotNumber);
	    	ta.setSlotOccupied(slotOccupied);
	    	ta.setMinExtratime(minExtratime);
	    	ta.setMaxExtratime(maxExtratime);
	    	areaData.add(ta);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_timeCost_file_areas(areaData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per aree: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/timeCost/parkingstructures/csv")
	public @ResponseBody
	String createTimeCostStructureCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in timeCost parkingstructures csv creation.");
		ArrayList<TimeCostParkingStructure> structData = new ArrayList<TimeCostParkingStructure>();
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray structList = new JSONArray(data);
		logger.info("Structs list size: " + structList.length());
    	
	    for(int i = 0; i < structList.length(); i++){
	    	JSONObject struct = structList.getJSONObject(i);
	    	//logger.error(String.format("Struct Data: %s", struct.toString()));
	    	String id = struct.getString("id");
	    	String id_app = struct.getString("id_app");
	    	String name = struct.getString("name");
	    	String streetReference = (!struct.isNull("streetReference")) ? struct.getString("streetReference") : "";
	    	String managementMode = (!struct.isNull("managementMode")) ? struct.getString("managementMode") : "";
	    	String manager = (!struct.isNull("manager")) ? struct.getString("manager") : "";
	    	String phoneNumber = (!struct.isNull("phoneNumber")) ? struct.getString("phoneNumber") : "";
	    	String fee = (!struct.isNull("fee")) ? struct.getString("fee") : "0.0";
	    	String timeSlot = (!struct.isNull("timeSlot")) ? struct.getString("timeSlot") : "";
	    	Integer occupancyRate = (!struct.isNull("occupancyRate")) ? struct.getInt("occupancyRate") : 0;
	    	Integer slotNumber = (!struct.isNull("slotNumber")) ? struct.getInt("slotNumber") : 0;
	    	Integer slotOccupied = (!struct.isNull("slotOccupied")) ? struct.getInt("slotOccupied") : 0;
	    	Integer unusuableSlotNumber = (!struct.isNull("unusuableSlotNumber")) ? struct.getInt("unusuableSlotNumber") : 0;
	    	JSONObject extratime = (!struct.isNull("extratime")) ? struct.getJSONObject("extratime") : null;
	    	Integer minExtratime, maxExtratime;
	    	minExtratime = maxExtratime = -1;
	    	if(extratime != null) {
	    		minExtratime = (!extratime.isNull("extratime_estimation_min")) ? extratime.getInt("extratime_estimation_min") : -1;
		    	maxExtratime = (!extratime.isNull("extratime_estimation_max")) ? extratime.getInt("extratime_estimation_max") : -1;
	    	}
	    	TimeCostParkingStructure tps = new TimeCostParkingStructure();
	    	tps.setId(id);
	    	tps.setId_app(id_app);
	    	tps.setName(name);
	    	tps.setStreetReference(streetReference);
	    	tps.setManagementMode(managementMode);
	    	tps.setManager(manager);
	    	tps.setPhoneNumber(phoneNumber);
	    	tps.setFee(fee);
	    	tps.setTimeSlot(timeSlot);
	    	tps.setOccupancyRate(occupancyRate);
	    	tps.setSlotNumber(slotNumber);
	    	tps.setSlotOccupied(slotOccupied);
	    	tps.setUnusuableSlotNumber(unusuableSlotNumber);
	    	tps.setMinExtratime(minExtratime);
	    	tps.setMaxExtratime(maxExtratime);
	    	structData.add(tps);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_timeCost_file_structs(structData, path);
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
			//return_data = csvManager.create_file_streets(streetData, path);
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
	    	
	    it.smartcommunitylab.parking.management.web.model.OccupancyRateArea a = new it.smartcommunitylab.parking.management.web.model.OccupancyRateArea();
	    a.setName(darea_name);
	    a.setFee(Float.valueOf(darea_fee));
	    a.setSlotNumber(Integer.parseInt(darea_totalslot));
			
		try {
			createdFile = csvManager.create_occupancy_file_history_area(a, matrix, path); //occ_matrix
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
			    	
		it.smartcommunitylab.parking.management.web.model.ProfitRateArea a = new it.smartcommunitylab.parking.management.web.model.ProfitRateArea();
	    a.setName(darea_name);
	    a.setFee(Float.valueOf(darea_fee));
	    a.setSlotNumber(Integer.parseInt(darea_totalslot));
				
		try {
			createdFile = csvManager.create_profit_file_history_area(a, matrix, path);
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
	    	
		it.smartcommunitylab.parking.management.web.model.OccupancyRateArea a = new it.smartcommunitylab.parking.management.web.model.OccupancyRateArea();
	    a.setName(darea_name);
	    a.setFee(Float.valueOf(darea_fee));
	    a.setSlotNumber(Integer.parseInt(darea_totalslot));
			
		try {
			createdFile = csvManager.create_timecost_file_history_area(a, matrix, path);
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

}
