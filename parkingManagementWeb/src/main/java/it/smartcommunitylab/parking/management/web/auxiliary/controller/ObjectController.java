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
package it.smartcommunitylab.parking.management.web.auxiliary.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import it.smartcommunitylab.parking.management.web.auxiliary.data.GeoObjectManager;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.CSVManager;
import it.smartcommunitylab.parking.management.web.model.OccupancyStreet;

@Controller
public class ObjectController  {

	private static final Logger logger = Logger.getLogger(ObjectController.class);
	
	private static final int DEFAULT_COUNT = 100;
	
	@Autowired
	private GeoObjectManager dataService; 
	
	@Autowired
	CSVManager csvManager;
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/ping") 
	public @ResponseBody String ping() {
		return "pong";
	} 
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/all/{skip}") 
	public @ResponseBody List<DataLogBean> getAllLogs(@PathVariable String agency, @PathVariable int skip, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		//return logMongoStorage.getParkingLogsById(id, agency, count);
		return dataService.getAllLogs(agency, count, skip);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/count/all") 
	public @ResponseBody int countAllLogs(@PathVariable String agency, @RequestParam(required=false) Integer count) {
		//if (count == null) count = DEFAULT_COUNT;
		//return logMongoStorage.getParkingLogsById(id, agency, count);
		return dataService.countAllLogs(agency);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/parkings/{skip}") 
	public @ResponseBody List<DataLogBean> getAllParkingLogs(@PathVariable String agency, @PathVariable int skip, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		//return logMongoStorage.getParkingLogsById(id, agency, count);
		return dataService.getAllParkingLogs(agency, count, skip);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/parking/{id:.*}") 
	public @ResponseBody List<DataLogBean> getParkingLogs(@PathVariable String agency, @PathVariable String id, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		//return logMongoStorage.getParkingLogsById(id, agency, count);
		return dataService.getParkingLogsByIdDyn(id, agency, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/count/parking") 
	public @ResponseBody int countParkingLogs(@PathVariable String agency, @RequestParam(required=false) Integer count) {
		return dataService.countAllParkingLogs(agency);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/streets/{skip}") 
	public @ResponseBody List<DataLogBean> getAllStreetLogs(@PathVariable String agency, @PathVariable int skip, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		//return logMongoStorage.getStreetLogsById(id, agency, count);
		return dataService.getAllStreetLogs(agency, count, skip);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/street/{id:.*}") 
	public @ResponseBody List<DataLogBean> getStreetLogs(@PathVariable String agency, @PathVariable String id, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		//return logMongoStorage.getStreetLogsById(id, agency, count);
		return dataService.getStreetLogsByIdDyn(id, agency, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/count/street") 
	public @ResponseBody int countStreetLogs(@PathVariable String agency, @RequestParam(required=false) Integer count) {
		return dataService.countAllStreetLogs(agency);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/user/{id:.*}") 
	public @ResponseBody List<DataLogBean> getUserLogs(@PathVariable String agency, @PathVariable String id, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		return dataService.getLogsByAuthorDyn(id, agency, count);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/streets") 
	public @ResponseBody List<Street> getStreets(@PathVariable String agency, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		logger.error("I'm in get all street - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getStreets(agency, lat, lon, radius);
		} 
		return dataService.getStreets(agency);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/parkings") 
	public @ResponseBody List<Parking> getParkings(@PathVariable String agency, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		logger.error("I'm in get all parkings - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getParkings(agency, lat, lon, radius);
		} 
		return dataService.getParkings(agency);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkings/{id}/{userId:.*}") 
	public @ResponseBody void updateParking(@RequestBody Parking parking, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			//dataService.updateParkingData(parking, agency, userId);
			dataService.updateDynamicParkingData(parking, agency, userId);
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/streets/{id}/{userId:.*}") 
	public @ResponseBody void updateStreet(@RequestBody Street street, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			//dataService.updateStreetData(street, agency, userId);
			dataService.updateDynamicStreetData(street, agency, userId);
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	// --------------------------------- Part for csv files creation ------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/globallogs/csv")
	public @ResponseBody
	String createStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		logger.info("I am in log csv creation.");
		ArrayList<DataLogBean> logData = new ArrayList<DataLogBean>();
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.info("Current path: " + path);
		
		JSONArray logList = new JSONArray(data);
		logger.info("log list size: " + logList.length());
	   	
	    for(int i = 0; i < logList.length(); i++){
	    	JSONObject log = logList.getJSONObject(i);
	    	//logger.error(String.format("Log Data: %s", log.toString()));
	    	String id = log.getString("id");
	    	String objId = log.getString("objId");
	    	String author = log.getString("author");
	    	Long time = log.getLong("time");
	    	String time_slot = log.getString("timeSlot");
	    	String week_day = log.getString("week_day");
	    	String month = log.getString("month");
	    	String year = log.getString("year");
	    	String type = log.getString("type");
	    	Boolean deleted = log.getBoolean("deleted");
	    	Boolean holyday = log.getBoolean("holyday");
	    	JSONObject value = log.getJSONObject("value");
	    	Map<String, Object> log_value = new HashMap<String, Object>();
	    	if(type.compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.Street") == 0){
		    	log_value.put("id", value.getString("id"));
		    	log_value.put("name", value.getString("name"));
		    	log_value.put("description", value.getString("description"));
		    	log_value.put("user", value.getInt("user"));
		    	log_value.put("agency", value.getString("agency"));
		    	log_value.put("position", value.get("position"));
		    	log_value.put("updateTime", value.getLong("updateTime"));
		    	log_value.put("slotsFree", (!value.isNull("slotsFree")) ? value.getInt("slotsFree") : 0);
		    	log_value.put("slotsOccupiedOnFree", (!value.isNull("slotsOccupiedOnFree")) ? value.getInt("slotsOccupiedOnFree") : 0);
		    	log_value.put("slotsTimed", (!value.isNull("slotsTimed")) ? value.getInt("slotsTimed") : 0);
		    	log_value.put("slotsOccupiedOnTimed", (!value.isNull("slotsOccupiedOnTimed")) ? value.getInt("slotsOccupiedOnTimed") : 0);
		    	log_value.put("slotsPaying", (!value.isNull("slotsPaying")) ? value.getInt("slotsPaying") : 0);
		    	log_value.put("slotsOccupiedOnPaying", (!value.isNull("slotsOccupiedOnPaying")) ? value.getInt("slotsOccupiedOnPaying") : 0);
		    	log_value.put("slotsHandicapped", (!value.isNull("slotsHandicapped")) ? value.getInt("slotsHandicapped") : 0);
		    	log_value.put("slotsOccupiedOnHandicapped", (!value.isNull("slotsHandicapped")) ? value.getInt("slotsHandicapped") : 0);
		    	log_value.put("slotsUnavailable", (!value.isNull("slotsUnavailable")) ? value.getInt("slotsUnavailable") : 0);
		    	log_value.put("polyline", value.getString("polyline"));
		    	log_value.put("version", (!value.isNull("version")) ? value.getString("version") : "null");
		    	log_value.put("lastChange", (!value.isNull("lastChange")) ? value.get("lastChange") : "null");
		    	log_value.put("areaId", value.getString("areaId"));
	    	} else {
	    		log_value.put("id", value.getString("id"));
		    	log_value.put("name", value.getString("name"));
		    	log_value.put("description", value.getString("description"));
		    	log_value.put("user", value.getInt("user"));
		    	log_value.put("agency", value.getString("agency"));
		    	log_value.put("position", value.get("position"));
		    	log_value.put("updateTime", value.getLong("updateTime"));
		    	log_value.put("slotsTotal", (!value.isNull("slotsTotal")) ? value.getInt("slotsTotal") : 0);
		    	log_value.put("slotsOccupiedOnTotal", (!value.isNull("slotsOccupiedOnTotal")) ? value.getInt("slotsOccupiedOnTotal") : 0);
		    	log_value.put("slotsUnavailable", (!value.isNull("slotsUnavailable")) ? value.getInt("slotsUnavailable") : 0);
		    	log_value.put("lastChange", (!value.isNull("lastChange")) ? value.get("lastChange") : "null");
		    	log_value.put("version", (!value.isNull("version")) ? value.getString("version") : "null");
	    	}
	    	DataLogBean dl = new DataLogBean();
	    	dl.setId(id);
	    	dl.setObjId(objId);
	    	dl.setAuthor(author);
	    	dl.setTime(time);
	    	dl.setTimeSlot(time_slot);
	    	dl.setWeek_day(week_day);
	    	dl.setMonth(month);
	    	dl.setYear(year);
	    	dl.setType(type);
	    	dl.setDeleted(deleted);
	    	dl.setHolyday(holyday);
	    	dl.setValue(log_value);
	    	logData.add(dl);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_file_log(logData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per log: " + e.getMessage());
		}
		return createdFile;
	}
	// ------------------------------ End of part for csv files creation --------------------------------

}
