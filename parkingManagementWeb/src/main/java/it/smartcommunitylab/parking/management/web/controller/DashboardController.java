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

import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.MarkerIconStorage;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DashboardController {

	private static final Logger logger = Logger
			.getLogger(DashboardController.class);

	@Autowired
	StorageManager storage;

	MarkerIconStorage markerIconStorage;

	@PostConstruct
	private void init() throws IOException {
		markerIconStorage = new MarkerIconStorage();
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/dashboard/rest/appid")
	public @ResponseBody
	String setAppId(@RequestBody String appId) throws DatabaseException {
		storage.setAppId(appId);
		return storage.getAppId();
	}
	

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/street")
	public @ResponseBody
	List<StreetBean> getAllStreets() {
		return storage.getAllStreets();
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/street")
	public @ResponseBody
	List<StreetBean> getAllStreetsNS() {
		return storage.getAllStreets();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/parkingmeter")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMeters() {
		return storage.getAllParkingMeters();
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/parkingmeter")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMetersNS() {
		return storage.getAllParkingMeters();
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/area/{aid}")
	public @ResponseBody
	RateAreaBean getRateArea(@PathVariable("aid") String aid,
			@RequestBody RateAreaBean area) throws NotFoundException {
		return storage.getAreaById(aid);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/area")
	public @ResponseBody
	List<RateAreaBean> getAllRateArea() {
		return storage.getAllArea();
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/area")
	public @ResponseBody
	List<RateAreaBean> getAllRateAreaNS() {
		return storage.getAllArea();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/zone")
	public @ResponseBody
	List<ZoneBean> getAllZone() {
		return storage.getAllZone();
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/zone")
	public @ResponseBody
	List<ZoneBean> getAllZoneNS() {
		return storage.getAllZone();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/bikepoint")
	public @ResponseBody
	List<BikePointBean> getAllBikePoints() {
		return storage.getAllBikePoints();
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/bikepoint")
	public @ResponseBody
	List<BikePointBean> getAllBikePointsNS() {
		return storage.getAllBikePoints();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/parkingstructure")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructure() {
		return storage.getAllParkingStructure();
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/dashboard/rest/nosec/parkingstructure")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructureNS() {
		return storage.getAllParkingStructure();
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

}