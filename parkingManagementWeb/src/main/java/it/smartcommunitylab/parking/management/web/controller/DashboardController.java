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
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
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

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/{appId}/zone")
	public @ResponseBody
	List<ZoneBean> getAllZone(@PathVariable String appId) {
		return storage.getAllZone(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/{appId}/zone")
	public @ResponseBody
	List<ZoneBean> getAllZoneNS(@PathVariable String appId) {
		return storage.getAllZone(appId);
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
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/parkingstructures")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructureOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		int year_f = (year!= null && year.length > 0) ? year[0] : 0;
		int year_t = (year!= null && year.length > 1) ? year[1] : 0;
		int month_f = (month!= null && month.length > 0) ? month[0] : 0;
		int month_t = (month!= null && month.length > 1) ? month[1] : 0;
		int weekday_f = (weekday!= null && weekday.length > 0) ? weekday[0] : 0;
		int weekday_t = (weekday!= null && weekday.length > 1) ? weekday[1] : 0;
		int hour_f = (hour!= null && hour.length > 0) ? hour[0] : 0;
		int hour_t = (hour!= null && hour.length > 1) ? hour[1] : 0;
		//logger.info(String.format("Parameters retrieved in back-end request for parkings: appId - %s; year - %d,%d; month - %d,%d; dayType - %s, weekday - %d,%d; hour - %d,%d; valueType - %d", appId, year_f, year_t, month_f, month_t, dayType, weekday_f, weekday_t, hour_f, hour_t, valueType));
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
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancy/{appId}/streets")
	public @ResponseBody
	List<StreetBean> getAllStreetOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		//byte[] hour = new byte[]{(byte)10,(byte)12};
		int year_f = (year!= null && year.length > 0) ? year[0] : 0;
		int year_t = (year!= null && year.length > 1) ? year[1] : 0;
		int month_f = (month!= null && month.length > 0) ? month[0] : 0;
		int month_t = (month!= null && month.length > 1) ? month[1] : 0;
		int weekday_f = (weekday!= null && weekday.length > 0) ? weekday[0] : 0;
		int weekday_t = (weekday!= null && weekday.length > 1) ? weekday[1] : 0;
		int hour_f = (hour!= null && hour.length > 0) ? hour[0] : 0;
		int hour_t = (hour!= null && hour.length > 1) ? hour[1] : 0;
		//logger.info(String.format("Parameters retrieved in back-end request for streets: appId - %s; year - %d,%d; month - %d,%d; dayType - %s, weekday - %d,%d; hour - %d,%d; valueType - %d", appId, year_f, year_t, month_f, month_t, dayType, weekday_f, weekday_t, hour_f, hour_t, valueType));
		String type = Street.class.getCanonicalName();
		return dynamic.getOccupationRateFromAllStreets(appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/occupancychanged/{appId}/streets")
	public @ResponseBody
	List<CompactStreetBean> getAllStreetChangedOccupancy(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		String type = Street.class.getCanonicalName();
		return dynamic.getOccupationChangesFromAllStreets(appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/parkingmeters")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMetersProfit(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
		String type = ParkMeter.class.getCanonicalName();
//		int year_f = (year!= null && year.length > 0) ? year[0] : 0;
//		int year_t = (year!= null && year.length > 1) ? year[1] : 0;
//		int month_f = (month!= null && month.length > 0) ? month[0] : 0;
//		int month_t = (month!= null && month.length > 1) ? month[1] : 0;
//		int weekday_f = (weekday!= null && weekday.length > 0) ? weekday[0] : 0;
//		int weekday_t = (weekday!= null && weekday.length > 1) ? weekday[1] : 0;
//		int hour_f = (hour!= null && hour.length > 0) ? hour[0] : 0;
//		int hour_t = (hour!= null && hour.length > 1) ? hour[1] : 0;
//		logger.info(String.format("Parameters retrieved in back-end request for parkingmeters: appId - %s; year - %d,%d; month - %d,%d; dayType - %s, weekday - %d,%d; hour - %d,%d; valueType - %d", appId, year_f, year_t, month_f, month_t, dayType, weekday_f, weekday_t, hour_f, hour_t, valueType));
		return dynamic.getProfitFromAllParkingMeters(appId, type, null, year, month, dayType, weekday, hour, valueType);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/profit/{appId}/parkstructs")
	public @ResponseBody
	List<ParkingStructureBean> getAllPArkStructsProfit(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType) throws Exception {
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
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/street/csv")
	public @ResponseBody
	String createStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
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
			createdFile = csvManager.create_file_streets(streetData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per vie: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/zone/csv")
	public @ResponseBody
	String createZoneCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
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
			createdFile = csvManager.create_file_zones(zoneData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per zone: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/area/csv")
	public @ResponseBody
	String createAreaCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
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
			createdFile = csvManager.create_file_areas(areaData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per aree: " + e.getMessage());
		}
		return createdFile;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/parkingstructures/csv")
	public @ResponseBody
	String createStructureCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in parkingstructures csv creation.");
		ArrayList<OccupancyParkingStructure> structData = new ArrayList<OccupancyParkingStructure>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		
		JSONArray structList = new JSONArray(data);
		logger.info("Structs list size: " + structList.length());
    	
	    for(int i = 0; i < structList.length(); i++){
	    	JSONObject struct = structList.getJSONObject(i);
	    	//logger.error(String.format("Street Data: %s", street.toString()));
	    	String id = struct.getString("id");
	    	String id_app = struct.getString("id_app");
	    	String name = struct.getString("name");
	    	String streetReference = struct.getString("streetReference");
	    	String managementMode = struct.getString("managementMode");
	    	String phoneNumber = struct.getString("phoneNumber");
	    	String fee = (!struct.isNull("fee")) ? struct.getString("fee") : "0.0";
	    	String timeSlot = struct.getString("timeSlot");
	    	Integer occupancyRate = (!struct.isNull("occupancyRate")) ? struct.getInt("occupancyRate") : 0;
	    	Integer slotNumber = (!struct.isNull("slotNumber")) ? struct.getInt("slotNumber") : 0;
	    	Integer slotOccupied = (!struct.isNull("slotOccupied")) ? struct.getInt("slotOccupied") : 0;
	    	Integer handicappedSlotNumber = (!struct.isNull("handicappedSlotNumber")) ? struct.getInt("handicappedSlotNumber") : 0;
	    	Integer handicappedSlotOccupied = (!struct.isNull("handicappedSlotOccupied")) ? struct.getInt("handicappedSlotOccupied") : 0;
	    	Integer unusuableSlotNumber = (!struct.isNull("unusuableSlotNumber")) ? struct.getInt("unusuableSlotNumber") : 0;
	    	OccupancyParkingStructure ops = new OccupancyParkingStructure();
	    	ops.setId(id);
	    	ops.setId_app(id_app);
	    	ops.setName(name);
	    	ops.setStreetReference(streetReference);
	    	ops.setManagementMode(managementMode);
	    	ops.setPhoneNumber(phoneNumber);
	    	ops.setFee(fee);
	    	ops.setTimeSlot(timeSlot);
	    	ops.setOccupancyRate(occupancyRate);
	    	ops.setSlotNumber(slotNumber);
	    	ops.setSlotOccupied(slotOccupied);
	    	ops.setHandicappedSlotNumber(handicappedSlotNumber);
	    	ops.setHandicappedSlotOccupied(handicappedSlotOccupied);
	    	ops.setUnusuableSlotNumber(unusuableSlotNumber);
	    	structData.add(ops);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_file_structs(structData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per parcheggi in struttura: " + e.getMessage());
		}
		return createdFile;
	}	
	
	// ------------------------------ End of part for csv files creation --------------------------------
	

}
