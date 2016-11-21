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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

//import io.swagger.annotations.Api;
//import io.swagger.annotations.ApiOperation;

@Controller
//@Api(value = "Metroparco", description = "Metroparco objects API")
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
	StreetBean createStreet(@PathVariable("appId") String appId, @RequestParam(required=true) String agencyId,
			@RequestParam(required=false) String username, @RequestBody StreetBean street) throws DatabaseException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.save(street, appId, agencyId, user_name);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/street/{aid}/{sid}")
	public @ResponseBody
	boolean deleteStreet(@PathVariable("appId") String appId, @PathVariable("aid") String aid,
			@PathVariable("sid") String sid, 
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) String username) throws DatabaseException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.removeStreet(aid, sid, appId, agencyId, user_name);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/street/{sid}")
	public @ResponseBody
	StreetBean editStreet(@PathVariable("appId") String appId,
			@PathVariable("sid") String vid, @RequestBody StreetBean street, 
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) String username)
			throws DatabaseException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.editStreet(street, appId, agencyId, user_name);
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
	
	@RequestMapping(method = RequestMethod.GET, value = "/rest/{appId}/street/{streetId}")
	public @ResponseBody
	StreetBean getStreetById(@PathVariable("appId") String appId, @PathVariable("streetId") String streetId) {
		return storage.findStreet(streetId);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/parkingmeter")
	public @ResponseBody
	ParkingMeterBean createParkingMeter(@PathVariable("appId") String appId, @RequestParam(required=true) String agencyId, @RequestParam(required=false) String username,
			@RequestBody ParkingMeterBean parkingMeter)
			throws DatabaseException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.save(parkingMeter, appId, agencyId, user_name);
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

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/parkingmeter/{aid}/{pid}")
	public @ResponseBody
	boolean deleteParkingMeter(@PathVariable("appId") String appId,
			@PathVariable("aid") String aid, @PathVariable("pid") String pid,
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) String username) {
		return storage.removeParkingMeter(aid, pid, appId, agencyId, username);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/parkingmeter/{pid}")
	public @ResponseBody
	ParkingMeterBean editParkingMeter(@PathVariable("appId") String appId, @PathVariable("pid") String pid,
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) String username,
			@RequestBody ParkingMeterBean parkingMeter) throws DatabaseException {
		return storage.editParkingMeter(parkingMeter, appId, agencyId, username);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/area")
	public @ResponseBody
	RateAreaBean createRateArea(@PathVariable("appId") String appId, @RequestParam(required=true) String agencyId, @RequestParam(required=false) String username, 
			@RequestBody RateAreaBean area) {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.save(area, appId, agencyId, user_name);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/area/{aid}")
	public @ResponseBody
	RateAreaBean editRateArea(@PathVariable("appId") String appId,
			@PathVariable("aid") String aid,  @RequestParam(required=true) String agencyId, @RequestParam(required=false) String username, 
			@RequestBody RateAreaBean area) throws NotFoundException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.editArea(area, appId, agencyId, user_name);
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
	List<RateAreaBean> getAllRateAreaByAppId(@PathVariable("appId") String appId, 
			@RequestParam(required=false) String agencyId) {
		if(agencyId != null){
			return storage.getAllAreaByAgencyId(appId, agencyId);
		} else {
			return storage.getAllArea(appId);
		}
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/area/{aid}")
	public @ResponseBody
	boolean deleteRateArea(@PathVariable("appId") String appId, @PathVariable("aid") String aid,
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) String username) {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.removeArea(aid, appId, agencyId, user_name);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/zone")
	public @ResponseBody
	ZoneBean createZone(@PathVariable("appId") String appId, @RequestParam(required=true) String agencyId, @RequestParam(required=false) String username, 
			@RequestBody ZoneBean zone) throws DatabaseException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.save(zone, appId, agencyId, user_name);
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
		//logger.info("Zone type " + type);
		if(type == null || type.compareTo("") == 0){
			return storage.getAllZone("all");
		} else {
			return storage.getZoneByType(type, appId);
		}
	}	

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/zone/{zid}")
	public @ResponseBody
	ZoneBean editZone(@PathVariable("appId") String appId,
			@PathVariable("zid") String zid, @RequestParam(required=true) String agencyId, 
			@RequestParam(required=false) String username, @RequestBody ZoneBean zone) throws NotFoundException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.editZone(zone, appId, agencyId, user_name);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/zone/{zid}")
	public @ResponseBody
	boolean deleteZone(@PathVariable("appId") String appId, @PathVariable("zid") String zid, 
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) String username) {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.removeZone(zid, appId, agencyId, user_name);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/bikepoint")
	public @ResponseBody
	BikePointBean createBikePoint(@PathVariable("appId") String appId, @RequestParam(required=true) String agencyId, @RequestParam(required=false) String username,
			@RequestBody BikePointBean puntobici)
			throws DatabaseException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.save(puntobici, appId, agencyId, user_name);
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

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/bikepoint/{pbid}")
	public @ResponseBody
	boolean deleteBikePoint(@PathVariable("appId") String appId, @PathVariable("pbid") String pbid, 
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) String username) {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.removeBikePoint(pbid, appId, agencyId, user_name);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/bikepoint/{pbid}")
	public @ResponseBody
	BikePointBean editBikePoint(@PathVariable("appId") String appId, @PathVariable("pbid") String pbid,
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) String username, 
			@RequestBody BikePointBean bici) throws NotFoundException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.editBikePoint(bici, appId, agencyId, user_name);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/rest/{appId}/parkingstructure")
	public @ResponseBody
	ParkingStructureBean createParkingStructure(
			@PathVariable("appId") String appId, @RequestParam(required=true) String agencyId, @RequestParam(required=false) String username, 
			@RequestBody ParkingStructureBean entityBean)
			throws DatabaseException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.save(entityBean, appId, agencyId, user_name);
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

	@RequestMapping(method = RequestMethod.DELETE, value = "/rest/{appId}/parkingstructure/{id}")
	public @ResponseBody
	boolean deleteParkingStructure(@PathVariable("appId") String appId, @PathVariable String id, 
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) String username) {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.removeParkingStructure(id, appId, agencyId, user_name);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/rest/{appId}/parkingstructure/{id}")
	public @ResponseBody
	ParkingStructureBean editParkingStructure(@PathVariable("appId") String appId,
			@PathVariable String id, @RequestParam(required=true) String agencyId, 
			@RequestParam(required=false) String username,
			@RequestBody ParkingStructureBean entityBean)
			throws NotFoundException {
		String user_name = "unknown";
		if(username != null && username.compareTo("") != 0){
			user_name = username;
		}
		return storage.editParkingStructure(entityBean, appId, agencyId, user_name);
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
	
	// Not secured method (open read-only)
	
	// Method open to get all streets
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/street")
	//@ApiOperation(value = "Get Streets", notes = "Returns streets park items")
	public @ResponseBody
	List<StreetBean> getAllStreetsNS(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllStreets(appId);
		} else {
			return storage.getAllStreetsByAgencyId(appId, agencyId);
		}
	}
		
	// Method open to get a single street
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/street/{streetId}")
	//@ApiOperation(value = "Get Street", notes = "Returns a single street park item")
	public @ResponseBody
	StreetBean getStreetByIdNS(@PathVariable("appId") String appId, @PathVariable("streetId") String streetId) {
		return storage.findStreet(streetId);
	}
	
	// Method open to get all parkingMeters
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/parkingmeter")
	//@ApiOperation(value = "Get ParkingMeters", notes = "Returns parking meter items")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMetersNS(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllParkingMeters(appId);
		} else {
			return storage.getAllParkingMetersByAgencyId(appId, agencyId);
		}
	}
	
	// Method open to get all parkingMeters
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/parkingmeter/{pmId}")
	//@ApiOperation(value = "Get ParkingMeter", notes = "Returns a single parking meter item")
	public @ResponseBody
	ParkingMeterBean getParkingMetersNS(@PathVariable("appId") String appId, @PathVariable("pmId") String pmId) {
		return storage.findParkingMeter(pmId, appId);
	}
	
	// Method open to get all area objects
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/area")
	//@ApiOperation(value = "Get Areas", notes = "Returns area items")
	public @ResponseBody
	List<RateAreaBean> getAllRateAreaNS(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllArea(appId);
		} else {
			return storage.getAllAreaByAgencyId(appId, agencyId);
		}
	}
		
	// Method open to get a single area object
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/area/{aid}")
	//@ApiOperation(value = "Get Area", notes = "Return a single area item")
	public @ResponseBody
	RateAreaBean getRateAreaNS(@PathVariable("appId") String appId,
			@PathVariable("aid") String aid) throws NotFoundException {
		return storage.getAreaById(aid, appId);
	}
	
	// Method open to get all zones
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/zone")
	//@ApiOperation(value = "Get Zones", notes = "Return zone items")
	public @ResponseBody
	List<ZoneBean> getAllZoneNS(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllZone(appId);
		} else {
			return storage.getAllZoneByAgencyId(appId, agencyId);
		}
	}
	
	// Method open to get a single zone
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/zone/id/{zId}")
	//@ApiOperation(value = "Get Zone", notes = "Return a single zone item")
	public @ResponseBody
	ZoneBean getZoneNS(@PathVariable("appId") String appId, @PathVariable("zId") String zId) {
		return storage.findZoneById(zId, appId);
	}
	
	// Method open to get all zones of a specific type
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/zone/{zType}")
	//@ApiOperation(value = "Get Zones by type", notes = "Return zone items of specific type")
	public @ResponseBody
	List<ZoneBean> getAllZoneByTypeNS(@PathVariable("appId") String appId, @PathVariable("zType") String type, @RequestParam(required=false) String agencyId) {
		logger.debug("passed params: " + appId + ", " + type);
		if(type == null || type.compareTo("") == 0){
			if(agencyId == null){
				return storage.getAllZone("all");
			} else {
				return storage.getAllZoneByAgencyId(appId, agencyId);
			}
		} else {
			if(agencyId == null){
				return storage.getZoneByType(type, appId);
			} else {
				return storage.getZoneByTypeAndAgencyId(type, appId, agencyId);
			}
		}
	}
	
	// Method open to get all bike points
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/bikepoint")
	//@ApiOperation(value = "Get Bikepoints", notes = "Return bike point items")
	public @ResponseBody
	List<BikePointBean> getAllBikePointsNS(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllBikePoints(appId);
		} else {
			return storage.getAllBikePointsByAgencyId(appId, agencyId);
		}
	}
	
	// Method open to get a single bike point
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/bikepoint/{pbid}")
	//@ApiOperation(value = "Get Bikepoint", notes = "Return a single bike point item")
	public @ResponseBody
	BikePointBean getBikePointNS(@PathVariable("appId") String appId,
			@PathVariable("pbid") String pbid) throws NotFoundException {
		return storage.getBikePointById(pbid, appId);
	}
	
	// Method open to retrieve all parking structure
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/parkingstructure")
	//@ApiOperation(value = "Get Parkingstructures", notes = "Return parking structure items")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructureNS(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllParkingStructure(appId);
		} else {
			return storage.getAllParkingStructureByAgencyId(appId, agencyId);
		}
	}
	
	// Method open to retrieve all parking structure
	@RequestMapping(method = RequestMethod.GET, value = "/rest/nosec/{appId}/parkingstructure/{psId}")
	//@ApiOperation(value = "Get Parkingstructure", notes = "Return a single parking structure item")
	public @ResponseBody
	ParkingStructureBean getParkingStructureNS(@PathVariable("appId") String appId, @PathVariable("psId") String psId) {
		return storage.getParkingStructureById(psId, appId);
	}	

}
