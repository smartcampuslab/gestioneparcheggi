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
import it.smartcommunitylab.parking.management.web.model.OccupancyStreet;
import it.smartcommunitylab.parking.management.web.repository.impl.StatRepositoryImpl;

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
	String createStreetCSV(HttpServletRequest request, @RequestBody ArrayList<OccupancyStreet> data) {
		String createdFile = "";
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		try {
			csvManager.create_file_streets(data, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per vie: " + e.getMessage());
		}
		return createdFile;
	}
	// ------------------------------ End of part for csv files creation --------------------------------
	

}
