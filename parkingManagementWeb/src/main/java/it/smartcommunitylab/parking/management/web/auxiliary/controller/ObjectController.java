/*******************************************************************************
 * Copyright 2012-2013 Trento RISE
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

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import it.smartcommunitylab.parking.management.web.auxiliary.data.LogMongoStorage;
import it.smartcommunitylab.parking.management.web.auxiliary.model.LogObject;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkingLog;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.auxiliary.model.StreetLog;
import it.smartcommunitylab.parking.management.web.auxiliary.services.DataService;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.common.exception.NotFoundException;

@Controller
public class ObjectController extends AbstractObjectController {

	private static final Logger logger = Logger.getLogger(ObjectController.class);
	
	private static final int DEFAULT_COUNT = 10;

	@Autowired
	private LogMongoStorage logMongoStorage;
	
	@Autowired
	private DataService dataService; 
	
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/ping") 
	public @ResponseBody String ping() {
		return "pong";
	} 

	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/parking/{id:.*}") 
	public @ResponseBody List<ParkingLog> getParkingLogs(@PathVariable String agency, @PathVariable String id, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		return logMongoStorage.getParkingLogsById(id, agency, count);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/street/{id:.*}") 
	public @ResponseBody List<StreetLog> getStreetLogs(@PathVariable String agency, @PathVariable String id, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		return logMongoStorage.getStreetLogsById(id, agency, count);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/log/user/{id:.*}") 
	public @ResponseBody List<LogObject<?>> getUserLogs(@PathVariable String agency, @PathVariable String id, @RequestParam(required=false) Integer count) {
		if (count == null) count = DEFAULT_COUNT;
		return logMongoStorage.getLogsByAuthor(id, agency, count);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/streets") 
	public @ResponseBody List<Street> getStreets(@PathVariable String agency, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws DataException {
		logger.error("I'm in get all street - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getStreets(agency, lat, lon, radius);
		} 
		return dataService.getStreets(agency);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/auxiliary/rest/{agency}/parkings") 
	public @ResponseBody List<Parking> getParkings(@PathVariable String agency, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws DataException {
		logger.error("I'm in get all parkings - auxiliary app!!!");
		if (lat != null && lon != null && radius != null) {
			return dataService.getParkings(agency, lat, lon, radius);
		} 
		return dataService.getParkings(agency);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/parkings/{id}/{userId:.*}") 
	public @ResponseBody void updateParking(@RequestBody Parking parking, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws DataException, NotFoundException {
		dataService.updateParkingData(parking, agency, userId);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auxiliary/rest/{agency}/streets/{id}/{userId:.*}") 
	public @ResponseBody void updateStreet(@RequestBody Street street, @PathVariable String agency, @PathVariable String id, @PathVariable String userId) throws DataException, NotFoundException {
		dataService.updateStreetData(street, agency, userId);
	}

}
