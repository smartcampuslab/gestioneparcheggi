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

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
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
import org.springframework.web.multipart.MultipartFile;

import it.smartcommunitylab.parking.management.web.auxiliary.data.GeoObjectManager;
import it.smartcommunitylab.parking.management.web.auxiliary.model.PMProfitData;
import it.smartcommunitylab.parking.management.web.auxiliary.model.PSOccupancyData;
import it.smartcommunitylab.parking.management.web.auxiliary.model.PSProfitData;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkMeter;
import it.smartcommunitylab.parking.management.web.auxiliary.model.SOccupancyData;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.CSVManager;
import it.smartcommunitylab.parking.management.web.model.slots.VehicleSlot;
import it.smartcommunitylab.parking.management.web.repository.DataLogBeanTP;
import it.smartcommunitylab.parking.management.web.repository.DataLogRepositoryDao;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;

@Controller
public class ObjectController  {

	private static final Logger logger = Logger.getLogger(ObjectController.class);
	
	private static final int DEFAULT_COUNT = 500;	// last 500 values
	private static final int NO_PERIOD = -1;
	private static final int YEAR_PERIOD = 1;
	private static final int MONTH_PERIOD = 2;
	private static final int DOW_PERIOD = 3;
	private static final int HOUR_PERIOD = 4;
	
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
	public @ResponseBody Iterable<DataLogBeanTP> getAllTPLogs(@PathVariable String agency, @RequestParam(required=true) String userAgency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgency(agency, userAgency, skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/all/count") 
	public @ResponseBody Long getAllTPLogsCount(@PathVariable String agency, @RequestParam(required=true) String userAgency) {
		return dataService.countAllLogsByAgency(agency, userAgency);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkings") 
	public @ResponseBody Iterable<DataLogBeanTP> getAllTPParkingLogs(@PathVariable String agency, @RequestParam(required=true) String userAgency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgencyAndType(agency, userAgency, Parking.class.getCanonicalName(), skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkings/count") 
	public @ResponseBody Long getAllTPParkingLogsCount(@PathVariable String agency, @RequestParam(required=true) String userAgency) {
		return dataService.countAllLogsByAgencyAndType(agency,  userAgency, Parking.class.getCanonicalName());
	}

	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkstructs") 
	public @ResponseBody List<DataLogBeanTP> getAllParkStructsLogs(@PathVariable String agency, @RequestParam(required=true) String userAgency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgencyAndType(agency, userAgency, ParkStruct.class.getCanonicalName(), skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkstructs/count") 
	public @ResponseBody Long getAllTPParkStructsLogsCount(@PathVariable String agency, @RequestParam(required=true) String userAgency) {
		return dataService.countAllLogsByAgencyAndType(agency, userAgency, ParkStruct.class.getCanonicalName());
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkmeters") 
	public @ResponseBody List<DataLogBeanTP> getAllParkMetersLogs(@PathVariable String agency, @RequestParam(required=true) String userAgency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgencyAndType(agency, userAgency, ParkMeter.class.getCanonicalName(), skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/parkmeters/count") 
	public @ResponseBody Long getAllParkMetersLogsCount(@PathVariable String agency, @RequestParam(required=true) String userAgency) {
		return dataService.countAllLogsByAgencyAndType(agency, userAgency, ParkMeter.class.getCanonicalName());
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/streets") 
	public @ResponseBody Iterable<DataLogBeanTP> getAllTPStreetLogs(@PathVariable String agency, @RequestParam(required=true) String userAgency, @RequestParam(required=false) Integer count, @RequestParam(required=false) Integer skip) {
		if (count == null) count = DEFAULT_COUNT;
		if (skip == null) skip = 0;
		return dataService.findAllLogsByAgencyAndType(agency, userAgency, Street.class.getCanonicalName(), skip, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/tplog/streets/count") 
	public @ResponseBody Long getAllTPStreetLogsCount(@PathVariable String agency, @RequestParam(required=true) String userAgency) {
		return dataService.countAllLogsByAgencyAndType(agency, userAgency, Street.class.getCanonicalName());
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
	public @ResponseBody List<Street> getStreets(@PathVariable String agency, @RequestParam(required=true) String agencyId, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		logger.debug("I'm in get all street - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getStreets(agency, lat, lon, radius, agencyId);
		} 
		return dataService.getStreets(agency, agencyId);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/parkings") 
	public @ResponseBody List<Parking> getParkings(@PathVariable String agency, @RequestParam(required=true) String agencyId, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		logger.debug("I'm in get all parkings - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getParkings(agency, lat, lon, radius, agencyId);
		} 
		return dataService.getParkings(agency, agencyId);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/parkingmeters") 
	public @ResponseBody List<ParkMeter> getParkingMeters(@PathVariable String agency, @RequestParam(required=true) String agencyId, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		logger.debug("I'm in get all parkingmeters - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getParkingMeters(agency, lat, lon, radius, agencyId);
		} 
		return dataService.getParkingMeters(agency, agencyId);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkings/{id}/{userId:.*}") 
	public @ResponseBody String updateParking(@RequestBody Parking parking, 
			@RequestParam(required=true) String userAgencyId, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) String username, @RequestParam(required=false) long[] period, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			dataService.updateDynamicParkingData(parking, agency, userId, userAgencyId, isSysLog, username, null, period, NO_PERIOD);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/streets/{id}/{userId:.*}") 
	public @ResponseBody String updateStreet(@RequestBody Street street, 
			@RequestParam(required=true) String userAgencyId, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) String username, @RequestParam(required=false) long[] period, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			//logger.error("Update street Log: isSysLog = " + isSysLog );
			if(period != null){
				logger.debug("Inserted period = " + period[0] + "-" + period[1] );
			}
			dataService.updateDynamicStreetData(street, agency, userId, userAgencyId, isSysLog, username, null, period, NO_PERIOD);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkingmeters/{id}/{userId:.*}") 
	public @ResponseBody String updateParkingMeter(@RequestBody ParkMeter parkingMeter, @RequestParam(required=true) String userAgencyId, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) String username, @RequestParam(required=false) long[] period, @RequestParam(required=false) Long from, @RequestParam(required=false) Long to, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			//logger.error("Update street Log: isSysLog = " + isSysLog );
			dataService.updateDynamicParkingMeterData(parkingMeter, agency, userId, userAgencyId, isSysLog, username, null, from, to, period, NO_PERIOD);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkstructprofit/{id}/{userId:.*}") 
	public @ResponseBody String updateParkStructProfitData(@RequestBody ParkStruct parkStruct, 
			@RequestParam(required=true) String userAgencyId, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) String username, @RequestParam(required=false) long[] period, @RequestParam(required=false) Long from, @RequestParam(required=false) Long to, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			//logger.error("Update street Log: isSysLog = " + isSysLog );
			dataService.updateDynamicParkStructProfitData(parkStruct, agency, userId, userAgencyId, isSysLog, username, null, from, to, period, NO_PERIOD);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkings/fileupload/{userId:.*}") 
	public @ResponseBody String updateParkingList(@RequestBody Map<String, Object> data, 
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) String username, @RequestParam(required=false) long[] period, @PathVariable String agency, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			logger.debug("started file uplodad flux");
			String datas = data.get("logData").toString();
			List<PSOccupancyData> allData = dataService.classStringToOPSObjArray(datas, agency);
			for(PSOccupancyData p : allData){
				Parking park = dataService.getParkingByName(p.getpName(), agency, agencyId);
				if(park != null){
					List<String> slotsLC = p.getOccLC();
					List<String> slotsLS = p.getOccLS();
					List<String> slotsP = p.getOccP();
					List<String> slotsDO = p.getOccDO();
					List<String> slotsH = p.getOccH();
					List<String> slotsR = p.getOccR();
					List<String> slotsE = p.getOccE();
					List<String> slotsC_S = p.getOccC_S();
					List<String> slotsRO = p.getOccRO();
					List<String> slotsCS = p.getOccCS();
					List<String> slotsND = p.getSlotsND();
					
					for(int i = 0; i < slotsLC.size(); i++){
						boolean skipUpdate = true;
						int slotOccLc = -1;
						int slotOccLs = -1;
						int slotOccP = -1;
						int slotOccDO = -1;
						int slotOccH = -1;
						int slotOccR = -1;
						int slotOccE = -1;
						int slotOccC_S = -1;
						int slotOccRO = -1;
						int slotOccCS = -1;
						int slotNumND = -1;
						if(slotsLC.get(i).compareTo("") != 0 && slotsLC.get(i).compareTo("-1") != 0){
							slotOccLc = Integer.parseInt(slotsLC.get(i));
						}
						if(slotsLS.get(i).compareTo("") != 0 && slotsLS.get(i).compareTo("-1") != 0){
							slotOccLs = Integer.parseInt(slotsLS.get(i));
						}
						if(slotsP.get(i).compareTo("") != 0 && slotsP.get(i).compareTo("-1") != 0){
							slotOccP = Integer.parseInt(slotsP.get(i));
						}
						if(slotsDO.get(i).compareTo("") != 0 && slotsDO.get(i).compareTo("-1") != 0){
							slotOccDO = Integer.parseInt(slotsDO.get(i));
						}
						if(slotsH.get(i).compareTo("") != 0 && slotsH.get(i).compareTo("-1") != 0){
							slotOccH = Integer.parseInt(slotsH.get(i));
						}
						if(slotsR.get(i).compareTo("") != 0 && slotsR.get(i).compareTo("-1") != 0){
							slotOccR = Integer.parseInt(slotsR.get(i));
						}
						if(slotsE.get(i).compareTo("") != 0 && slotsE.get(i).compareTo("-1") != 0){
							slotOccE = Integer.parseInt(slotsE.get(i));
						}
						if(slotsC_S.get(i).compareTo("") != 0 && slotsC_S.get(i).compareTo("-1") != 0){
							slotOccC_S = Integer.parseInt(slotsC_S.get(i));
						}
						if(slotsRO.get(i).compareTo("") != 0 && slotsRO.get(i).compareTo("-1") != 0){
							slotOccRO = Integer.parseInt(slotsRO.get(i));
						}
						if(slotsCS.get(i).compareTo("") != 0 && slotsCS.get(i).compareTo("-1") != 0){
							slotOccCS = Integer.parseInt(slotsCS.get(i));
						}
						if(slotsND.get(i).compareTo("") != 0 && slotsND.get(i).compareTo("-1") != 0){
							slotNumND = Integer.parseInt(slotsND.get(i));
						}
						List<VehicleSlot> sc = park.getSlotsConfiguration();
						for(VehicleSlot vs : sc){
							if(vs.getVehicleType().compareTo(p.getVehicleType()) == 0){
								if(slotOccLc != -1){
									vs.setFreeParkSlotSignOccupied(slotOccLc);
									skipUpdate = false;
								} else {
								}
								if(slotOccLs != -1){
									vs.setFreeParkSlotOccupied(slotOccLs);
									skipUpdate = false;
								} else {
								}
								if(slotOccP != -1){
									vs.setPaidSlotOccupied(slotOccP);
									skipUpdate = false;
								} else {
								}
								if(slotOccDO != -1){
									vs.setTimedParkSlotOccupied(slotOccDO);
									skipUpdate = false;
								} else {
								}
								if(slotOccH != -1){
									vs.setHandicappedSlotOccupied(slotOccH);
									skipUpdate = false;
								} else {
								}
								if(slotOccR != -1){
									vs.setReservedSlotOccupied(slotOccR);
									skipUpdate = false;
								} else {
								}
								if(slotOccE != -1){
									vs.setRechargeableSlotOccupied(slotOccE);
									skipUpdate = false;
								} else {
								}
								if(slotOccC_S != -1){
									vs.setLoadingUnloadingSlotOccupied(slotOccC_S);
									skipUpdate = false;
								} else {
								}
								if(slotOccRO != -1){
									vs.setPinkSlotOccupied(slotOccRO);
									skipUpdate = false;
								} else {
								}
								if(slotOccCS != -1){
									vs.setCarSharingSlotOccupied(slotOccCS);
									skipUpdate = false;
								} else {
								}
								if(slotNumND != -1){
									vs.setUnusuableSlotNumber(slotNumND);
									skipUpdate = false;
								} else {
								}
								break;
							}
						}
						park.setSlotsConfiguration(sc);
						if(!skipUpdate){
							int year = Integer.parseInt(p.getPeriod().getYear());
							period = null;
							park.setUpdateTime(dataService.getTimeStampFromYearAndMonth(year, i));
							dataService.updateDynamicParkingData(park, agency, userId, agencyId, isSysLog, username, null, period, MONTH_PERIOD);
						}
					}
				}
			}
			//dataService.updateDynamicParkingData(parking, agency, userId, isSysLog, period);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}	
	
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/streets/fileupload/{userId:.*}") 
	public @ResponseBody String updateStreetList(@RequestBody Map<String, Object> data, 
			@RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) String username, @RequestParam(required=false) long[] period, @RequestParam(required=true) String agencyId, @PathVariable String agency, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			logger.debug("started file uplodad flux");
			String datas = data.get("logData").toString();
			List<SOccupancyData> allData = dataService.classStringToOSObjArray(datas, agency);
			for(SOccupancyData s : allData){
				Street street = dataService.getStreetByName(s.getsName(),agency, agencyId);
				if (street != null){
					List<String> slotsLC = s.getOccLC();
					List<String> slotsLS = s.getOccLS();
					List<String> slotsP = s.getOccP();
					List<String> slotsDO = s.getOccDO();
					List<String> slotsH = s.getOccH();
					List<String> slotsR = s.getOccR();
					List<String> slotsE = s.getOccE();
					List<String> slotsC_S = s.getOccC_S();
					List<String> slotsRO = s.getOccRO();
					List<String> slotsCS = s.getOccCS();
					List<String> slotsND = s.getSlotsND();
					
					for(int i = 0; i < slotsLC.size(); i++){
						boolean skipUpdate = true;
						int slotOccLc = -1;
						int slotOccLs = -1;
						int slotOccP = -1;
						int slotOccDO = -1;
						int slotOccH = -1;
						int slotOccR = -1;
						int slotOccE = -1;
						int slotOccC_S = -1;
						int slotOccRO = -1;
						int slotOccCS = -1;
						int slotNumND = -1;
						if(slotsLC.get(i).compareTo("") != 0 && slotsLC.get(i).compareTo("-1") != 0){
							slotOccLc = Integer.parseInt(slotsLC.get(i));
						}
						if(slotsLS.get(i).compareTo("") != 0 && slotsLS.get(i).compareTo("-1") != 0){
							slotOccLs = Integer.parseInt(slotsLS.get(i));
						}
						if(slotsP.get(i).compareTo("") != 0 && slotsP.get(i).compareTo("-1") != 0){
							slotOccP = Integer.parseInt(slotsP.get(i));
						}
						if(slotsDO.get(i).compareTo("") != 0 && slotsDO.get(i).compareTo("-1") != 0){
							slotOccDO = Integer.parseInt(slotsDO.get(i));
						}
						if(slotsH.get(i).compareTo("") != 0 && slotsH.get(i).compareTo("-1") != 0){
							slotOccH = Integer.parseInt(slotsH.get(i));
						}
						if(slotsR.get(i).compareTo("") != 0 && slotsR.get(i).compareTo("-1") != 0){
							slotOccR = Integer.parseInt(slotsR.get(i));
						}
						if(slotsE.get(i).compareTo("") != 0 && slotsE.get(i).compareTo("-1") != 0){
							slotOccE = Integer.parseInt(slotsE.get(i));
						}
						if(slotsC_S.get(i).compareTo("") != 0 && slotsC_S.get(i).compareTo("-1") != 0){
							slotOccC_S = Integer.parseInt(slotsC_S.get(i));
						}
						if(slotsRO.get(i).compareTo("") != 0 && slotsRO.get(i).compareTo("-1") != 0){
							slotOccRO = Integer.parseInt(slotsRO.get(i));
						}
						if(slotsCS.get(i).compareTo("") != 0 && slotsCS.get(i).compareTo("-1") != 0){
							slotOccCS = Integer.parseInt(slotsCS.get(i));
						}
						if(slotsND.get(i).compareTo("") != 0 && slotsND.get(i).compareTo("-1") != 0){
							slotNumND = Integer.parseInt(slotsND.get(i));
						}
						List<VehicleSlot> sc = street.getSlotsConfiguration();
						for(VehicleSlot vs : sc){
							if(vs.getVehicleType().compareTo(s.getVehicleType()) == 0){
								if(slotOccLc != -1){
									vs.setFreeParkSlotSignOccupied(slotOccLc);
									skipUpdate = false;
								} else {
								}
								if(slotOccLs != -1){
									vs.setFreeParkSlotOccupied(slotOccLs);
									skipUpdate = false;
								} else {
								}
								if(slotOccP != -1){
									vs.setPaidSlotOccupied(slotOccP);
									skipUpdate = false;
								} else {
								}
								if(slotOccDO != -1){
									vs.setTimedParkSlotOccupied(slotOccDO);
									skipUpdate = false;
								} else {
								}
								if(slotOccH != -1){
									vs.setHandicappedSlotOccupied(slotOccH);
									skipUpdate = false;
								} else {
								}
								if(slotOccR != -1){
									vs.setReservedSlotOccupied(slotOccR);
									skipUpdate = false;
								} else {
								}
								if(slotOccE != -1){
									vs.setRechargeableSlotOccupied(slotOccE);
									skipUpdate = false;
								} else {
								}
								if(slotOccC_S != -1){
									vs.setLoadingUnloadingSlotOccupied(slotOccC_S);
									skipUpdate = false;
								} else {
								}
								if(slotOccRO != -1){
									vs.setPinkSlotOccupied(slotOccRO);
									skipUpdate = false;
								} else {
								}
								if(slotOccCS != -1){
									vs.setCarSharingSlotOccupied(slotOccCS);
									skipUpdate = false;
								} else {
								}
								if(slotNumND != -1){
									vs.setUnusuableSlotNumber(slotNumND);
									skipUpdate = false;
								} else {
								}
								break;
							}
						}
						street.setSlotsConfiguration(sc);
						int year = Integer.parseInt(s.getPeriod().getYear());
						period = null;
						street.setUpdateTime(dataService.getTimeStampFromYearAndMonth(year, i));
						if(!skipUpdate){
							dataService.updateDynamicStreetData(street, agency, userId, agencyId, isSysLog, username, null, period, MONTH_PERIOD);
						}
					}	
				}
			}
			logger.debug("ended file uplodad flux");
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/streets/fileupload2/{userId:.*}") 
	public @ResponseBody String updateStreetListWithFile(@RequestParam("tData") MultipartFile data, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) String username, @RequestParam(required=false) long[] period, @RequestParam(required=true) String agencyId, @PathVariable String agency, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			
			File convFile = new File(data.getOriginalFilename());
			data.transferTo(convFile);
			
			FileInputStream file = new FileInputStream(convFile);
			HSSFWorkbook workbook = new HSSFWorkbook(file);
			HSSFSheet sheet = workbook.getSheetAt(0);
			
			//Iterate through each rows one by one
            Iterator<Row> rowIterator = sheet.iterator();
            while (rowIterator.hasNext())
            {
                Row row = rowIterator.next();
                //For each row, iterate through all the columns
                Iterator<Cell> cellIterator = row.cellIterator();

                while (cellIterator.hasNext())
                {
                    Cell cell = cellIterator.next();
                    //Check the cell type and format accordingly
                    switch (cell.getCellType())
                    {
                        case Cell.CELL_TYPE_NUMERIC:
                            System.out.print(cell.getNumericCellValue() + "t");
                            break;
                        case Cell.CELL_TYPE_STRING:
                            System.out.print(cell.getStringCellValue() + "t");
                            break;
                    }
                }
                System.out.println("");
            }
            file.close();

			
			logger.debug("started file uplodad flux");
			String datas = null; //data.get("logData").toString();
			List<SOccupancyData> allData = dataService.classStringToOSObjArray(datas, agency);
			
			for(SOccupancyData s : allData){
				Street street = dataService.getStreetByName(s.getsName(),agency, agencyId);
				if (street != null){
					List<String> slotsLC = s.getOccLC();
					List<String> slotsLS = s.getOccLS();
					List<String> slotsP = s.getOccP();
					List<String> slotsDO = s.getOccDO();
					List<String> slotsH = s.getOccH();
					List<String> slotsR = s.getOccR();
					List<String> slotsND = s.getSlotsND();
					
					for(int i = 0; i < slotsLC.size(); i++){
						boolean skipUpdate = true;
						int slotOccLc = -1;
						int slotOccLs = -1;
						int slotOccP = -1;
						int slotOccDO = -1;
						int slotOccH = -1;
						int slotOccR = -1;
						int slotNumND = -1;
						if(slotsLC.get(i).compareTo("") != 0 && slotsLC.get(i).compareTo("-1") != 0){
							slotOccLc = Integer.parseInt(slotsLC.get(i));
						}
						if(slotsLS.get(i).compareTo("") != 0 && slotsLS.get(i).compareTo("-1") != 0){
							slotOccLs = Integer.parseInt(slotsLS.get(i));
						}
						if(slotsP.get(i).compareTo("") != 0 && slotsP.get(i).compareTo("-1") != 0){
							slotOccP = Integer.parseInt(slotsP.get(i));
						}
						if(slotsDO.get(i).compareTo("") != 0 && slotsDO.get(i).compareTo("-1") != 0){
							slotOccDO = Integer.parseInt(slotsDO.get(i));
						}
						if(slotsH.get(i).compareTo("") != 0 && slotsH.get(i).compareTo("-1") != 0){
							slotOccH = Integer.parseInt(slotsH.get(i));
						}
						if(slotsR.get(i).compareTo("") != 0 && slotsR.get(i).compareTo("-1") != 0){
							slotOccR = Integer.parseInt(slotsR.get(i));
						}
						if(slotsND.get(i).compareTo("") != 0 && slotsND.get(i).compareTo("-1") != 0){
							slotNumND = Integer.parseInt(slotsND.get(i));
						}
						int year = Integer.parseInt(s.getPeriod().getYear());
						period = null;
						street.setUpdateTime(dataService.getTimeStampFromYearAndMonth(year, i));
						if(!skipUpdate){
							dataService.updateDynamicStreetData(street, agency, userId, agencyId, isSysLog, username, null, period, MONTH_PERIOD);
						}
					}	
				}
			}
			logger.debug("ended file uplodad flux");
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkingmeters/fileupload/{userId:.*}") 
	public @ResponseBody String updateParkingMeterList(@RequestBody Map<String, Object> data, 
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) String username, @RequestParam(required=false) long[] period, @RequestParam(required=false) Long from, @RequestParam(required=false) Long to, @PathVariable String agency, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			logger.debug("started file uplodad flux");
			String datas = data.get("logData").toString();
			List<PMProfitData> allData = dataService.classStringToPPMObjArray(datas);
			for(PMProfitData p : allData){
				ParkMeter parking = dataService.getParkingMeterFromCode(agency, p.getpCode(), agencyId);
				if(parking != null){
					List<String> tickets = p.getTickets();
					List<String> profits = p.getProfitVals();
					for(int i = 0; i < profits.size(); i++){
						if(profits.get(i).compareTo("") != 0 && profits.get(i).compareTo("0") != 0){
							Double profit = Double.parseDouble(profits.get(i)) * 100d;
							int profInt =  Math.round(profit.floatValue());
							int ticket = -1;
							if(tickets != null && tickets.size() > 0){
								try {
									String tik = tickets.get(i);
									ticket = Integer.parseInt(tik);
								} catch(Exception ex){
									logger.error("No ticket retrieve. " + ex.getMessage());
								}
							}
							parking.setProfit(profInt);
							parking.setTickets(ticket);
							int year = Integer.parseInt(p.getPeriod().getYear());
							period = null;
							if(p.getPeriod().getMonth() != null){
								int month = Integer.parseInt(p.getPeriod().getMonth()[0]) - 1;	// month start from 0 to 11
								// day period
								parking.setUpdateTime(dataService.getTimeStampFromYearMonthAndDay(year, month, i + 1));	// day start from 1, index start from 0
								dataService.updateDynamicParkingMeterData(parking, agency, userId, agencyId, isSysLog, username, null, from, to, period, DOW_PERIOD);
							} else {
								// month period
								parking.setUpdateTime(dataService.getTimeStampFromYearAndMonth(year, i));
								dataService.updateDynamicParkingMeterData(parking, agency, userId, agencyId, isSysLog, username, null, from, to, period, MONTH_PERIOD);
							}
						}
					}
				} else {
					logger.error("parkingmeter with code: " + p.getpCode() + " not found in db");
				}
			}
			logger.debug("ended file uplodad flux");
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkstructprofit/fileupload/{userId:.*}") 
	public @ResponseBody String updateParkStructProfitListData(@RequestBody Map<String, Object> data, 
			@RequestParam(required=true) String agencyId, @RequestParam(required=false) boolean isSysLog, @RequestParam(required=false) String username, @RequestParam(required=false) long[] period, @RequestParam(required=false) Long from, @RequestParam(required=false) Long to, @PathVariable String agency, @PathVariable String userId) throws Exception, NotFoundException {
		try {
			
			logger.debug("started file uplodad flux");
			String datas = data.get("logData").toString();
			List<PSProfitData> allData = dataService.classStringToPPSObjArray(datas);
			for(PSProfitData p : allData){
				ParkStruct parkStruct = dataService.getParkingStructureByName(p.getpName(), agency, agencyId);
				if(parkStruct != null){
					List<String> tickets = p.getTickets();
					List<String> profits = p.getProfitVals();
					for(int i = 0; i < profits.size(); i++){
						if(profits.get(i).compareTo("") != 0 && profits.get(i).compareTo("0") != 0){
							Double profit = Double.parseDouble(profits.get(i)) * 100d;
							int profInt =  Math.round(profit.floatValue());
							int ticket = Integer.parseInt(tickets.get(i));
							parkStruct.setProfit(profInt);
							parkStruct.setTickets(ticket);
							int year = Integer.parseInt(p.getPeriod().getYear());
							period = null;
							//period = dataService.getPeriodFromYearAndMonth(year, i);
							parkStruct.setUpdateTime(dataService.getTimeStampFromYearAndMonth(year, i));
							dataService.updateDynamicParkStructProfitData(parkStruct, agency, userId, agencyId, isSysLog, username, null, from, to, period, MONTH_PERIOD);
						}
					}
				} else {
					logger.error("parkingstructure with name: " + p.getpName() + " not found in db");
				}
			}
			logger.debug("ended file uplodad flux");
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}	
	
	// --------------------------------- Part for csv files creation ------------------------------------
	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/globallogs/csv")
	public @ResponseBody
	String createAllLogCSV(HttpServletRequest request, HttpServletResponse response, @RequestBody String data) {
		ArrayList<DataLogBean> logAllData = new ArrayList<DataLogBean>();
		
		String createdFile = "";
		//byte[] return_data = null;
		String path = request.getSession().getServletContext().getRealPath("/csv/");
		logger.debug("Current path: " + path);
		
		JSONArray logList = new JSONArray(data);
		logger.debug("log list size: " + logList.length());
	   	
	    for(int i = 0; i < logList.length(); i++){
	    	JSONObject log = logList.getJSONObject(i);
	    	//logger.error(String.format("Log Data: %s", log.toString()));
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
			    	log_value.put("name", (!value.isNull("name")) ? csvManager.cleanCommaValue(value.getString("name")) : "n.p.");
			    	log_value.put("description", (!value.isNull("description")) ? value.getString("description") : "n.p.");
			    	log_value.put("user", (!value.isNull("user")) ? value.getInt("user") : "n.p.");
			    	log_value.put("agency", (!value.isNull("agency")) ? value.getString("agency") : "n.p.");
			    	log_value.put("position", (!value.isNull("position")) ? value.get("position") : "n.p.");
			    	log_value.put("updateTime", (!value.isNull("updateTime")) ? value.getLong("updateTime") : "n.p.");
			    	if(value.isNull("slotsConfiguration")){
			    		log_value.put("slotsFree", (!value.isNull("slotsFree")) ? value.getInt("slotsFree") : 0);
			    		log_value.put("slotsOccupiedOnFree", (!value.isNull("slotsOccupiedOnFree")) ? value.getInt("slotsOccupiedOnFree") : 0);
			    		log_value.put("slotsTimed", (!value.isNull("slotsTimed")) ? value.getInt("slotsTimed") : 0);
			    		log_value.put("slotsOccupiedOnTimed", (!value.isNull("slotsOccupiedOnTimed")) ? value.getInt("slotsOccupiedOnTimed") : 0);
			    		log_value.put("slotsPaying", (!value.isNull("slotsPaying")) ? value.getInt("slotsPaying") : 0);
			    		log_value.put("slotsOccupiedOnPaying", (!value.isNull("slotsOccupiedOnPaying")) ? value.getInt("slotsOccupiedOnPaying") : 0);
			    		log_value.put("slotsHandicapped", (!value.isNull("slotsHandicapped")) ? value.getInt("slotsHandicapped") : 0);
			    		log_value.put("slotsOccupiedOnHandicapped", (!value.isNull("slotsHandicapped")) ? value.getInt("slotsHandicapped") : 0);
			    		log_value.put("slotsUnavailable", (!value.isNull("slotsUnavailable")) ? value.getInt("slotsUnavailable") : 0);
			    	} else {
			    		JSONArray slotsConf = value.getJSONArray("slotsConfiguration");
			    		JSONObject slotConf = slotsConf.getJSONObject(0);
			    		log_value.put("slotsFree", (!slotConf.isNull("freeParkSlotNumber")) ? slotConf.getInt("freeParkSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnFree", (!slotConf.isNull("freeParkSlotOccupied")) ? slotConf.getInt("freeParkSlotOccupied") : 0);
			    		log_value.put("slotsFreeSigned", (!slotConf.isNull("freeParkSlotSignNumber")) ? slotConf.getInt("freeParkSlotSignNumber") : 0);
			    		log_value.put("slotsOccupiedOnFreeSigned", (!slotConf.isNull("freeParkSlotSignOccupied")) ? slotConf.getInt("freeParkSlotSignOccupied") : 0);
			    		log_value.put("slotsTimed", (!slotConf.isNull("timedParkSlotNumber")) ? slotConf.getInt("timedParkSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnTimed", (!slotConf.isNull("timedParkSlotOccupied")) ? slotConf.getInt("timedParkSlotOccupied") : 0);
			    		log_value.put("slotsPaying", (!slotConf.isNull("paidSlotNumber")) ? slotConf.getInt("paidSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnPaying", (!slotConf.isNull("paidSlotOccupied")) ? slotConf.getInt("paidSlotOccupied") : 0);
			    		log_value.put("slotsHandicapped", (!slotConf.isNull("handicappedSlotNumber")) ? slotConf.getInt("handicappedSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnHandicapped", (!slotConf.isNull("handicappedSlotOccupied")) ? slotConf.getInt("handicappedSlotOccupied") : 0);
			    		log_value.put("slotsReserved", (!slotConf.isNull("reservedSlotNumber")) ? slotConf.getInt("reservedSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnReserved", (!slotConf.isNull("reservedSlotOccupied")) ? slotConf.getInt("reservedSlotOccupied") : 0);
			    		log_value.put("slotsRechargeable", (!slotConf.isNull("rechargeableSlotNumber")) ? slotConf.getInt("rechargeableSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnRechargeable", (!slotConf.isNull("rechargeableSlotOccupied")) ? slotConf.getInt("rechargeableSlotOccupied") : 0);
			    		log_value.put("slotsCarSharing", (!slotConf.isNull("carSharingSlotNumber")) ? slotConf.getInt("carSharingSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnCarSharing", (!slotConf.isNull("carSharingSlotOccupied")) ? slotConf.getInt("carSharingSlotOccupied") : 0);
			    		log_value.put("slotsLoadingUnloading", (!slotConf.isNull("loadingUnloadingSlotNumber")) ? slotConf.getInt("loadingUnloadingSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnLoadingUnloading", (!slotConf.isNull("loadingUnloadingSlotOccupied")) ? slotConf.getInt("loadingUnloadingSlotOccupied") : 0);
			    		log_value.put("slotsPink", (!slotConf.isNull("pinkSlotNumber")) ? slotConf.getInt("pinkSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnPink", (!slotConf.isNull("pinkSlotOccupied")) ? slotConf.getInt("pinkSlotOccupied") : 0);
			    		log_value.put("slotsUnavailable", (!slotConf.isNull("unusuableSlotNumber")) ? slotConf.getInt("unusuableSlotNumber") : 0);
			    		log_value.put("vehicleType", (!slotConf.isNull("vehicleType")) ? slotConf.getString("vehicleType") : "Car");
			    	}
			    	log_value.put("polyline", (!value.isNull("polyline")) ? value.getString("polyline") : "n.p.");
			    	log_value.put("version", (!value.isNull("version")) ? value.getString("version") : "null");
			    	log_value.put("lastChange", (!value.isNull("lastChange")) ? value.get("lastChange") : "null");
			    	log_value.put("areaId", (!value.isNull("areaId")) ? value.getString("areaId") : "n.p.");
		    	} else if(type.compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.Parking") == 0){
		    		log_value.put("id", (!value.isNull("id")) ? value.getString("id") : "n.p.");
			    	log_value.put("name", (!value.isNull("name")) ? csvManager.cleanCommaValue(value.getString("name")) : "n.p.");
			    	log_value.put("description", (!value.isNull("description")) ? value.getString("description") : "n.p.");
			    	log_value.put("user", (!value.isNull("user")) ? value.getInt("user") : "n.p.");
			    	log_value.put("agency", (!value.isNull("agency")) ? value.getString("agency") : "n.p.");
			    	log_value.put("position", (!value.isNull("position")) ? value.get("position") : "n.p.");
			    	log_value.put("updateTime", (!value.isNull("updateTime")) ? value.getLong("updateTime") : "n.p.");
			    	if(value.isNull("slotsConfiguration")){
			    		log_value.put("slotsTotal", (!value.isNull("slotsTotal")) ? value.getInt("slotsTotal") : 0);
			    		log_value.put("slotsOccupiedOnTotal", (!value.isNull("slotsOccupiedOnTotal")) ? value.getInt("slotsOccupiedOnTotal") : 0);
			    		log_value.put("slotsUnavailable", (!value.isNull("slotsUnavailable")) ? value.getInt("slotsUnavailable") : 0);
			    	} else {
			    		JSONArray slotsConf = value.getJSONArray("slotsConfiguration");
			    		JSONObject slotConf = slotsConf.getJSONObject(0);
			    		log_value.put("slotsFree", (!slotConf.isNull("freeParkSlotNumber")) ? slotConf.getInt("freeParkSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnFree", (!slotConf.isNull("freeParkSlotOccupied")) ? slotConf.getInt("freeParkSlotOccupied") : 0);
			    		log_value.put("slotsFreeSigned", (!slotConf.isNull("freeParkSlotSignNumber")) ? slotConf.getInt("freeParkSlotSignNumber") : 0);
			    		log_value.put("slotsOccupiedOnFreeSigned", (!slotConf.isNull("freeParkSlotSignOccupied")) ? slotConf.getInt("freeParkSlotSignOccupied") : 0);
			    		log_value.put("slotsTimed", (!slotConf.isNull("timedParkSlotNumber")) ? slotConf.getInt("timedParkSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnTimed", (!slotConf.isNull("timedParkSlotOccupied")) ? slotConf.getInt("timedParkSlotOccupied") : 0);
			    		log_value.put("slotsPaying", (!slotConf.isNull("paidSlotNumber")) ? slotConf.getInt("paidSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnPaying", (!slotConf.isNull("paidSlotOccupied")) ? slotConf.getInt("paidSlotOccupied") : 0);
			    		log_value.put("slotsHandicapped", (!slotConf.isNull("handicappedSlotNumber")) ? slotConf.getInt("handicappedSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnHandicapped", (!slotConf.isNull("handicappedSlotOccupied")) ? slotConf.getInt("handicappedSlotOccupied") : 0);
			    		log_value.put("slotsReserved", (!slotConf.isNull("reservedSlotNumber")) ? slotConf.getInt("reservedSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnReserved", (!slotConf.isNull("reservedSlotOccupied")) ? slotConf.getInt("reservedSlotOccupied") : 0);
			    		log_value.put("slotsRechargeable", (!slotConf.isNull("rechargeableSlotNumber")) ? slotConf.getInt("rechargeableSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnRechargeable", (!slotConf.isNull("rechargeableSlotOccupied")) ? slotConf.getInt("rechargeableSlotOccupied") : 0);
			    		log_value.put("slotsCarSharing", (!slotConf.isNull("carSharingSlotNumber")) ? slotConf.getInt("carSharingSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnCarSharing", (!slotConf.isNull("carSharingSlotOccupied")) ? slotConf.getInt("carSharingSlotOccupied") : 0);
			    		log_value.put("slotsLoadingUnloading", (!slotConf.isNull("loadingUnloadingSlotNumber")) ? slotConf.getInt("loadingUnloadingSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnLoadingUnloading", (!slotConf.isNull("loadingUnloadingSlotOccupied")) ? slotConf.getInt("loadingUnloadingSlotOccupied") : 0);
			    		log_value.put("slotsPink", (!slotConf.isNull("pinkSlotNumber")) ? slotConf.getInt("pinkSlotNumber") : 0);
			    		log_value.put("slotsOccupiedOnPink", (!slotConf.isNull("pinkSlotOccupied")) ? slotConf.getInt("pinkSlotOccupied") : 0);
			    		log_value.put("slotsUnavailable", (!slotConf.isNull("unusuableSlotNumber")) ? slotConf.getInt("unusuableSlotNumber") : 0);
			    		log_value.put("vehicleType", (!slotConf.isNull("vehicleType")) ? slotConf.getString("vehicleType") : "Car");
			    	}
			    	log_value.put("lastChange", (!value.isNull("lastChange")) ? value.get("lastChange") : "null");
			    	log_value.put("version", (!value.isNull("version")) ? value.getString("version") : "null");
		    	} else if(type.compareTo("it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct") == 0){
		    		log_value.put("id", (!value.isNull("id")) ? value.getString("id") : "n.p.");
			    	log_value.put("name", (!value.isNull("name")) ? csvManager.cleanCommaValue(value.getString("name")) : "n.p.");
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
