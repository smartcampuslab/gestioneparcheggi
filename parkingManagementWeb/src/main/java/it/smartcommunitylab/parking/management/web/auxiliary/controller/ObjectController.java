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
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkMeter;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.CSVManager;
import it.smartcommunitylab.parking.management.web.repository.DataLogBeanTP;
import it.smartcommunitylab.parking.management.web.repository.DataLogRepositoryDao;

@Controller
public class ObjectController  {

	private static final Logger logger = Logger.getLogger(ObjectController.class);
	
	private static final int DEFAULT_COUNT = 100;
	
	@Autowired
	private GeoObjectManager dataService; 
	
	@Autowired
	private DataLogRepositoryDao dataLogRepo;
	
	@Autowired
	CSVManager csvManager;
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/ping") 
	public @ResponseBody String ping() {
		return "pong";
	} 
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/all") 
	public @ResponseBody Iterable<DataLogBeanTP> getAllTPLogs(@PathVariable String agency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgency(agency, skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/all/count") 
	public @ResponseBody Long getAllTPLogsCount(@PathVariable String agency) {
		return dataService.countAllLogsByAgency(agency);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkings") 
	public @ResponseBody Iterable<DataLogBeanTP> getAllTPParkingLogs(@PathVariable String agency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgencyAndType(agency, Parking.class.getCanonicalName(), skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkings/count") 
	public @ResponseBody Long getAllTPParkingLogsCount(@PathVariable String agency) {
		return dataService.countAllLogsByAgencyAndType(agency, Parking.class.getCanonicalName());
	}

	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkstructs") 
	public @ResponseBody List<DataLogBeanTP> getAllParkStructsLogs(@PathVariable String agency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgencyAndType(agency, ParkStruct.class.getCanonicalName(), skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkstructs/count") 
	public @ResponseBody Long getAllTPParkStructsLogsCount(@PathVariable String agency) {
		return dataService.countAllLogsByAgencyAndType(agency, ParkStruct.class.getCanonicalName());
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkmeters") 
	public @ResponseBody List<DataLogBeanTP> getAllParkMetersLogs(@PathVariable String agency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgencyAndType(agency, ParkMeter.class.getCanonicalName(), skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkmeters/count") 
	public @ResponseBody Long getAllParkMetersLogsCount(@PathVariable String agency) {
		return dataService.countAllLogsByAgencyAndType(agency, ParkMeter.class.getCanonicalName());
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/streets") 
	public @ResponseBody Iterable<DataLogBeanTP> getAllTPStreetLogs(@PathVariable String agency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgencyAndType(agency, Street.class.getCanonicalName(), skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/streets/count") 
	public @ResponseBody Long getAllTPStreetLogsCount(@PathVariable String agency) {
		return dataService.countAllLogsByAgencyAndType(agency, Street.class.getCanonicalName());
	}

//	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/all/{skip}") 
//	public @ResponseBody List<DataLogBean> getAllLogs(@PathVariable String agency, @PathVariable int skip, @RequestParam(required=false) Integer count) {
//		if (count == null) count = DEFAULT_COUNT;
//		//return logMongoStorage.getParkingLogsById(id, agency, count);
//		return dataService.getAllLogs(agency, count, skip);
//	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/tplog/all/{id:.*}") 
	public @ResponseBody DataLogBean getStreetLogByLogId(@PathVariable String id) {
		//return logMongoStorage.getStreetLogsById(id, agency, count);
		return dataService.getLogById(id);
	}
//	
//	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/count/all") 
//	public @ResponseBody int countAllLogs(@PathVariable String agency, @RequestParam(required=false) Integer count) {
//		//if (count == null) count = DEFAULT_COUNT;
//		//return logMongoStorage.getParkingLogsById(id, agency, count);
//		return dataService.countAllLogs(agency);
//	}

//	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/parkings/{skip}") 
//	public @ResponseBody List<DataLogBean> getAllParkingLogs(@PathVariable String agency, @PathVariable int skip, @RequestParam(required=false) Integer count) {
//		if (count == null) count = DEFAULT_COUNT;
//		//return logMongoStorage.getParkingLogsById(id, agency, count);
//		return dataService.getAllParkingLogs(agency, count, skip);
//	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/parking/{id:.*}") 
	public @ResponseBody List<DataLogBean> getParkingLogs(@PathVariable String agency, @PathVariable String id, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		//return logMongoStorage.getParkingLogsById(id, agency, count);
		return dataService.getParkingLogsByIdDyn(id, agency, count);
	}
//	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/count/parking") 
//	public @ResponseBody int countParkingLogs(@PathVariable String agency, @RequestParam(required=false) Integer count) {
//		return dataService.countAllParkingLogs(agency);
//	}
	
//	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/streets/{skip}") 
//	public @ResponseBody List<DataLogBean> getAllStreetLogs(@PathVariable String agency, @PathVariable int skip, @RequestParam(required=false) Integer count) {
//		if (count == null) count = DEFAULT_COUNT;
//		//return logMongoStorage.getStreetLogsById(id, agency, count);
//		return dataService.getAllStreetLogs(agency, count, skip);
//	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/street/{id:.*}") 
	public @ResponseBody List<DataLogBean> getStreetLogs(@PathVariable String agency, @PathVariable String id, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		//return logMongoStorage.getStreetLogsById(id, agency, count);
		return dataService.getStreetLogsByIdDyn(id, agency, count);
	}
//	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/count/street") 
//	public @ResponseBody int countStreetLogs(@PathVariable String agency, @RequestParam(required=false) Integer count) {
//		return dataService.countAllStreetLogs(agency);
//	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/user/{id:.*}") 
	public @ResponseBody List<DataLogBean> getUserLogs(@PathVariable String agency, @PathVariable String id, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		return dataService.getLogsByAuthorDyn(id, agency, count);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/streets") 
	public @ResponseBody List<Street> getStreets(@PathVariable String agency, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		logger.info("I'm in get all street - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getStreets(agency, lat, lon, radius);
		} 
		return dataService.getStreets(agency);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/parkings") 
	public @ResponseBody List<Parking> getParkings(@PathVariable String agency, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		logger.info("I'm in get all parkings - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getParkings(agency, lat, lon, radius);
		} 
		return dataService.getParkings(agency);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/parkingmeters") 
	public @ResponseBody List<ParkMeter> getParkingMeters(@PathVariable String agency, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		logger.info("I'm in get all parkingmeters - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getParkingMeters(agency, lat, lon, radius);
		} 
		return dataService.getParkingMeters(agency);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkings/{id}/{userId:.*}") 
	public @ResponseBody String updateParking(@RequestBody Parking parking, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) long[] period, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			dataService.updateDynamicParkingData(parking, agency, userId, isSysLog, period);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "KO";
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/streets/{id}/{userId:.*}") 
	public @ResponseBody String updateStreet(@RequestBody Street street, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) long[] period, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			//logger.error("Update street Log: isSysLog = " + isSysLog );
			if(period != null){
				logger.error("Inserted period = " + period[0] + "-" + period[1] );
			}
			dataService.updateDynamicStreetData(street, agency, userId, isSysLog, period);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "KO";
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkingmeters/{id}/{userId:.*}") 
	public @ResponseBody String updateParkingMeter(@RequestBody ParkMeter parkingMeter, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) long[] period, @RequestParam(required=false) Long from, @RequestParam(required=false) Long to, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			//logger.error("Update street Log: isSysLog = " + isSysLog );
			dataService.updateDynamicParkingMeterData(parkingMeter, agency, userId, isSysLog, from, to, period);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "KO";
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkstructprofit/{id}/{userId:.*}") 
	public @ResponseBody String updateParkStructProfitData(@RequestBody ParkStruct parkStruct, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) long[] period, @RequestParam(required=false) Long from, @RequestParam(required=false) Long to, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			//logger.error("Update street Log: isSysLog = " + isSysLog );
			dataService.updateDynamicParkStructProfitData(parkStruct, agency, userId, isSysLog, from, to, period);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "KO";
		}
	}
	
	// --------------------------------- Part for csv files creation ------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/globallogs/csv")
	public @ResponseBody
	String createStreetCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		ArrayList<DataLogBean> logAllData = new ArrayList<DataLogBean>();
		
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.info("Current path: " + path);
		
		JSONArray logList = new JSONArray(data);
		logger.info("log list size: " + logList.length());
	   	
	    for(int i = 0; i < logList.length(); i++){
	    	JSONObject log = logList.getJSONObject(i);
	    	logger.error(String.format("Log Data: %s", log.toString()));
	    	String id = log.getString("id");
	    	String objId = log.getString("objId");
	    	String author = log.getString("author");
	    	Long[] periodLog = null;
	    	Object period = (!log.isNull("logPeriod") ? log.get("logPeriod") : null);
	    	if(period != null){
	    		String periodVal = period.toString();
	    		String res[] = periodVal.split(",");
	    		periodLog = new Long[2];
	    		periodLog[0] = Long.parseLong(res[0].substring(1, res[0].length() - 1));
	    		periodLog[1] = Long.parseLong(res[1].substring(0, res[1].length() - 2));
	    	}
	    	Long time = (!log.isNull("time")) ? log.getLong("time") : null;
	    	String time_slot = (!log.isNull("timeSlot")) ? log.getString("timeSlot") : "";
	    	String week_day = (!log.isNull("week_day")) ? log.getString("week_day") : "";
	    	String month = (!log.isNull("month")) ? log.getString("month") : "";
	    	String year = (!log.isNull("year")) ? log.getString("year") : "";
	    	String type = log.getString("type");
	    	Boolean deleted = log.getBoolean("deleted");
	    	Boolean holyday = log.getBoolean("holyday");
	    	JSONObject value = (!log.isNull("value")) ? log.getJSONObject("value") : null;
	    	Map<String, Object> log_value = new HashMap<String, Object>();
	    	if(value != null){
		    	if(type.compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.Street") == 0){
			    	log_value.put("id", (!value.isNull("id")) ? value.getString("id") : "n.p.");
			    	log_value.put("name", (!value.isNull("name")) ? value.getString("name") : "n.p.");
			    	log_value.put("description", (!value.isNull("description")) ? value.getString("description") : "n.p.");
			    	log_value.put("user", (!value.isNull("user")) ? value.getInt("user") : "n.p.");
			    	log_value.put("agency", (!value.isNull("agency")) ? value.getString("agency") : "n.p.");
			    	log_value.put("position", (!value.isNull("position")) ? value.get("position") : "n.p.");
			    	log_value.put("updateTime", (!value.isNull("updateTime")) ? value.getLong("updateTime") : "n.p.");
			    	log_value.put("slotsFree", (!value.isNull("slotsFree")) ? value.getInt("slotsFree") : 0);
			    	log_value.put("slotsOccupiedOnFree", (!value.isNull("slotsOccupiedOnFree")) ? value.getInt("slotsOccupiedOnFree") : 0);
			    	log_value.put("slotsTimed", (!value.isNull("slotsTimed")) ? value.getInt("slotsTimed") : 0);
			    	log_value.put("slotsOccupiedOnTimed", (!value.isNull("slotsOccupiedOnTimed")) ? value.getInt("slotsOccupiedOnTimed") : 0);
			    	log_value.put("slotsPaying", (!value.isNull("slotsPaying")) ? value.getInt("slotsPaying") : 0);
			    	log_value.put("slotsOccupiedOnPaying", (!value.isNull("slotsOccupiedOnPaying")) ? value.getInt("slotsOccupiedOnPaying") : 0);
			    	log_value.put("slotsHandicapped", (!value.isNull("slotsHandicapped")) ? value.getInt("slotsHandicapped") : 0);
			    	log_value.put("slotsOccupiedOnHandicapped", (!value.isNull("slotsHandicapped")) ? value.getInt("slotsHandicapped") : 0);
			    	log_value.put("slotsUnavailable", (!value.isNull("slotsUnavailable")) ? value.getInt("slotsUnavailable") : 0);
			    	log_value.put("polyline", (!value.isNull("polyline")) ? value.getString("polyline") : "n.p.");
			    	log_value.put("version", (!value.isNull("version")) ? value.getString("version") : "null");
			    	log_value.put("lastChange", (!value.isNull("lastChange")) ? value.get("lastChange") : "null");
			    	log_value.put("areaId", (!value.isNull("areaId")) ? value.getString("areaId") : "n.p.");
		    	} else if(type.compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.Parking") == 0){
		    		log_value.put("id", (!value.isNull("id")) ? value.getString("id") : "n.p.");
			    	log_value.put("name", (!value.isNull("name")) ? value.getString("name") : "n.p.");
			    	log_value.put("description", (!value.isNull("description")) ? value.getString("description") : "n.p.");
			    	log_value.put("user", (!value.isNull("user")) ? value.getInt("user") : "n.p.");
			    	log_value.put("agency", (!value.isNull("agency")) ? value.getString("agency") : "n.p.");
			    	log_value.put("position", (!value.isNull("position")) ? value.get("position") : "n.p.");
			    	log_value.put("updateTime", (!value.isNull("updateTime")) ? value.getLong("updateTime") : "n.p.");
			    	log_value.put("slotsTotal", (!value.isNull("slotsTotal")) ? value.getInt("slotsTotal") : 0);
			    	log_value.put("slotsOccupiedOnTotal", (!value.isNull("slotsOccupiedOnTotal")) ? value.getInt("slotsOccupiedOnTotal") : 0);
			    	log_value.put("slotsUnavailable", (!value.isNull("slotsUnavailable")) ? value.getInt("slotsUnavailable") : 0);
			    	log_value.put("lastChange", (!value.isNull("lastChange")) ? value.get("lastChange") : "null");
			    	log_value.put("version", (!value.isNull("version")) ? value.getString("version") : "null");
		    	} else if(type.compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct") == 0){
		    		log_value.put("id", (!value.isNull("id")) ? value.getString("id") : "n.p.");
			    	log_value.put("name", (!value.isNull("name")) ? value.getString("name") : "n.p.");
			    	log_value.put("description", (!value.isNull("description")) ? value.getString("description") : "n.p.");
			    	log_value.put("user", (!value.isNull("user")) ? value.getInt("user") : "n.p.");
			    	log_value.put("agency", (!value.isNull("agency")) ? value.getString("agency") : "n.p.");
			    	log_value.put("position", (!value.isNull("position")) ? value.get("position") : "n.p.");
			    	log_value.put("updateTime", (!value.isNull("updateTime")) ? value.getLong("updateTime") : "n.p.");
			    	//log_value.put("slotsTotal", (!value.isNull("slotsTotal")) ? value.getInt("slotsTotal") : 0);
			    	log_value.put("profit", (!value.isNull("profit")) ? value.getInt("profit") : 0);
			    	log_value.put("tickets", (!value.isNull("tickets")) ? value.getInt("tickets") : 0);
			    	log_value.put("lastChange", (!value.isNull("lastChange")) ? value.get("lastChange") : "null");
			    	log_value.put("version", (!value.isNull("version")) ? value.getString("version") : "null");
		    	} else if(type.compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.ParkMeter") == 0){
		    		log_value.put("id", (!value.isNull("id")) ? value.getString("id") : "n.p.");
			    	log_value.put("code", (!value.isNull("code")) ? value.getString("code") : "n.p.");
			    	log_value.put("note", (!value.isNull("note")) ? value.getString("note") : "n.p.");
			    	log_value.put("user", (!value.isNull("user")) ? value.getInt("user") : "n.p.");
			    	log_value.put("agency", (!value.isNull("agency")) ? value.getString("agency") : "n.p.");
			    	log_value.put("position", (!value.isNull("position")) ? value.get("position") : "n.p.");
			    	log_value.put("status", (!value.isNull("status")) ? value.getString("status") : "n.p.");
			    	log_value.put("updateTime", (!value.isNull("updateTime")) ? value.getLong("updateTime") : "n.p.");
			    	//log_value.put("slotsTotal", (!value.isNull("slotsTotal")) ? value.getInt("slotsTotal") : 0);
			    	log_value.put("profit", (!value.isNull("profit")) ? value.getInt("profit") : 0);
			    	log_value.put("tickets", (!value.isNull("tickets")) ? value.getInt("tickets") : 0);
			    	log_value.put("lastChange", (!value.isNull("lastChange")) ? value.get("lastChange") : "null");
		    	}
	    	}
	    	DataLogBean pl = new DataLogBean();
	    	pl.setId(id);
	    	pl.setObjId(objId);
	    	pl.setAuthor(author);
	    	pl.setLogPeriod(periodLog);
	    	pl.setTime(time);
	    	pl.setTimeSlot(time_slot);
	    	pl.setWeek_day(week_day);
	    	pl.setMonth(month);
	    	pl.setYear(year);
	    	pl.setType(type);
	    	pl.setDeleted(deleted);
	    	pl.setHolyday(holyday);
	    	pl.setValue(log_value);
	    	logAllData.add(pl);
	    }	
		
		try {
			//return_data = csvManager.create_file_streets(streetData, path);
			createdFile = csvManager.create_file_log(logAllData, path);
		} catch (Exception e) {
			logger.error("Errore in creazione CSV per log: " + e.getMessage());
		}
		return createdFile;
	}
	// ------------------------------ End of part for csv files creation --------------------------------

}
