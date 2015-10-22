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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class EditingController {

	@Autowired
	StorageManager storage;

	MarkerIconStorage markerIconStorage;

	private static final Logger logger = Logger
			.getLogger(EditingController.class);
	
	@PostConstruct
	private void init() throws IOException {
		markerIconStorage = new MarkerIconStorage();
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/street")
	public @ResponseBody
	StreetBean createStreet(@PathVariable("appId") String appId,
			@RequestBody StreetBean street) throws DatabaseException {
		return storage.save(street, appId);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/street/{aid}/{sid}")
	public @ResponseBody
	boolean deleteStreet(@PathVariable("appId") String appId,
			@PathVariable("aid") String aid,
			@PathVariable("sid") String sid) throws DatabaseException {
		return storage.removeStreet(aid, sid, appId);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/street/{sid}")
	public @ResponseBody
	StreetBean editStreet(@PathVariable("appId") String appId,
			@PathVariable("sid") String vid, @RequestBody StreetBean street)
			throws DatabaseException {
		return storage.editStreet(street, appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/street")
	public @ResponseBody
	List<StreetBean> getAllStreets() {
		return storage.getAllStreets("all");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/rest/{appId}/street")
	public @ResponseBody
	List<StreetBean> getAllStreetsByAppId(@PathVariable("appId") String appId) {
		return storage.getAllStreets(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/street")
	public @ResponseBody
	List<StreetBean> getAllStreetsNS(@PathVariable("appId") String appId) {
		return storage.getAllStreets(appId);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/parkingmeter")
	public @ResponseBody
	ParkingMeterBean createParkingMeter(@PathVariable("appId") String appId,
			@RequestBody ParkingMeterBean parkingMeter)
			throws DatabaseException {
		return storage.save(parkingMeter, appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/parkingmeter")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMeters() {
		return storage.getAllParkingMeters("all");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/rest/{appId}/parkingmeter")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMetersByAppId(@PathVariable("appId") String appId) {
		return storage.getAllParkingMeters(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/parkingmeter")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMetersNS(@PathVariable("appId") String appId) {
		return storage.getAllParkingMeters(appId);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/parkingmeter/{aid}/{pid}")
	public @ResponseBody
	boolean deleteParkingMeter(@PathVariable("appId") String appId,
			@PathVariable("aid") String aid,
			@PathVariable("pid") String pid) {
		return storage.removeParkingMeter(aid, pid, appId);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/parkingmeter/{pid}")
	public @ResponseBody
	ParkingMeterBean editParkingMeter(@PathVariable("appId") String appId,
			@PathVariable("pid") String pid,
			@RequestBody ParkingMeterBean parkingMeter) throws DatabaseException {
		return storage.editParkingMeter(parkingMeter, appId);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/area")
	public @ResponseBody
	RateAreaBean createRateArea(@PathVariable("appId") String appId,
			@RequestBody RateAreaBean area) {
		return storage.save(area, appId);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/area/{aid}")
	public @ResponseBody
	RateAreaBean editRateArea(@PathVariable("appId") String appId,
			@PathVariable("aid") String aid,
			@RequestBody RateAreaBean area) throws NotFoundException {
		return storage.editArea(area, appId);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/rest/{appId}/area/{aid}")
	public @ResponseBody
	RateAreaBean getRateArea(@PathVariable("appId") String appId,
			@PathVariable("aid") String aid,
			@RequestBody RateAreaBean area) throws NotFoundException {
		return storage.getAreaById(aid, appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/area")
	public @ResponseBody
	List<RateAreaBean> getAllRateArea() {
		return storage.getAllArea("all");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/rest/{appId}/area")
	public @ResponseBody
	List<RateAreaBean> getAllRateAreaByAppId(@PathVariable("appId") String appId) {
		return storage.getAllArea(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/area")
	public @ResponseBody
	List<RateAreaBean> getAllRateAreaNS(@PathVariable("appId") String appId) {
		return storage.getAllArea(appId);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/area/{aid}")
	public @ResponseBody
	boolean deleteRateArea(@PathVariable("appId") String appId,
			@PathVariable("aid") String aid) {
		return storage.removeArea(aid, appId);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/zone")
	public @ResponseBody
	ZoneBean createZone(@PathVariable("appId") String appId,
			@RequestBody ZoneBean zone) throws DatabaseException {
		return storage.save(zone, appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/zone")
	public @ResponseBody
	List<ZoneBean> getAllZone() {
		return storage.getAllZone("all");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/rest/{appId}/zone/{zType}")
	public @ResponseBody
	List<ZoneBean> getAllZoneByAppId(@PathVariable("appId") String appId, @PathVariable("zType") String type) {
		//return storage.getAllZone(appId);
		logger.info("Zone type " + type);
		if(type == null || type.compareTo("") == 0){
			return storage.getAllZone("all");
		} else {
			return storage.getZoneByType(type, appId);
		}
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/zone/{zType}")
	public @ResponseBody
	List<ZoneBean> getAllZoneNS(@PathVariable("appId") String appId, @PathVariable("zType") String type) {
		//return storage.getAllZone(appId);
		if(type == null || type.compareTo("") == 0){
			return storage.getAllZone("all");
		} else {
			return storage.getZoneByType(type, appId);
		}
	}	

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/zone/{zid}")
	public @ResponseBody
	ZoneBean editZone(@PathVariable("appId") String appId,
			@PathVariable("zid") String zid,
			@RequestBody ZoneBean zone) throws NotFoundException {
		System.out.println(String.format("Zone to edit id:%s; name:%s; submacro:%s ", zone.getId(), zone.getName(), zone.getSubmacro()));
		return storage.editZone(zone, appId);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/zone/{zid}")
	public @ResponseBody
	boolean deleteZone(@PathVariable("appId") String appId,
			@PathVariable("zid") String zid) {
		return storage.removeZone(zid, appId);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/bikepoint")
	public @ResponseBody
	BikePointBean createBikePoint(@PathVariable("appId") String appId,
			@RequestBody BikePointBean puntobici)
			throws DatabaseException {
		return storage.save(puntobici, appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/bikepoint")
	public @ResponseBody
	List<BikePointBean> getAllBikePoints() {
		return storage.getAllBikePoints("all");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/rest/{appId}/bikepoint")
	public @ResponseBody
	List<BikePointBean> getAllBikePointsByAllId(@PathVariable("appId") String appId) {
		return storage.getAllBikePoints(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/bikepoint")
	public @ResponseBody
	List<BikePointBean> getAllBikePointsNS(@PathVariable("appId") String appId) {
		return storage.getAllBikePoints(appId);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/bikepoint/{pbid}")
	public @ResponseBody
	boolean deleteBikePoint(@PathVariable("appId") String appId,
			@PathVariable("pbid") String pbid) {
		return storage.removeBikePoint(pbid, appId);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/bikepoint/{pbid}")
	public @ResponseBody
	BikePointBean editBikePoint(@PathVariable("appId") String appId,
			@PathVariable("pbid") String pbid,
			@RequestBody BikePointBean bici) throws NotFoundException {
		return storage.editBikePoint(bici, appId);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/parkingstructure")
	public @ResponseBody
	ParkingStructureBean createParkingStructure(
			@PathVariable("appId") String appId,
			@RequestBody ParkingStructureBean entityBean)
			throws DatabaseException {
		return storage.save(entityBean, appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/parkingstructure")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructure() {
		return storage.getAllParkingStructure("all");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/rest/{appId}/parkingstructure")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructure(@PathVariable("appId") String appId) {
		return storage.getAllParkingStructure(appId);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/parkingstructure")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructureNS(@PathVariable("appId") String appId) {
		return storage.getAllParkingStructure(appId);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/parkingstructure/{id}")
	public @ResponseBody
	boolean deleteParkingStructure(@PathVariable("appId") String appId, 
			@PathVariable String id) {
		return storage.removeParkingStructure(id, appId);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/parkingstructure/{id}")
	public @ResponseBody
	ParkingStructureBean editParkingStructure(@PathVariable("appId") String appId,
			@PathVariable String id,
			@RequestBody ParkingStructureBean entityBean)
			throws NotFoundException {
		return storage.editParkingStructure(entityBean, appId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/data")
	public @ResponseBody
	byte[] exportData() throws ExportException {
		return storage.exportData();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/export")
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

	@RequestMapping(method = RequestMethod.GET, value = "/rest/marker/{company}/{entity}/{color}")
	public void getMarkerIcon(HttpServletRequest request,
			HttpServletResponse response, @PathVariable("color") String color,
			@PathVariable String entity, @PathVariable String company)
			throws IOException {

		getMarkerIcon(response, request.getSession().getServletContext()
				.getRealPath("/"), company, entity, color);
	}
	
	// Method without security
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/marker/{company}/{entity}/{color}")
	public void getMarkerIconNS(HttpServletRequest request,
			HttpServletResponse response, @PathVariable("color") String color,
			@PathVariable String entity, @PathVariable String company)
			throws IOException {

		getMarkerIcon(response, request.getSession().getServletContext()
				.getRealPath("/"), company, entity, color);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/marker/{company}/{entity}")
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
