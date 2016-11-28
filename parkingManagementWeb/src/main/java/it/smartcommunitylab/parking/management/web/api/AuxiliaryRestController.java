package it.smartcommunitylab.parking.management.web.api;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import it.smartcommunitylab.parking.management.web.auxiliary.controller.ObjectController;
import it.smartcommunitylab.parking.management.web.auxiliary.data.GeoObjectManager;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkMeter;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.CSVManager;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;
import it.smartcommunitylab.parking.management.web.model.UserSetting;
import it.smartcommunitylab.parking.management.web.security.MongoUserDetailsService;
import it.smartcommunitylab.parking.management.web.utils.AgencyDataSetup;

@Controller
public class AuxiliaryRestController {

private static final Logger logger = Logger.getLogger(ObjectController.class);
	
	private static final int NO_PERIOD = -1;
	
	@Autowired
	private GeoObjectManager dataService;
	
	@Autowired
	StorageManager storage;
	
	@Autowired
	private MongoUserDetailsService mongoUserDetailsService;
	
	@Autowired
	private AgencyDataSetup agencyDataSetup;
	
	@Autowired
	CSVManager csvManager;
	
	@RequestMapping(method = RequestMethod.GET, value = "/data-mgt/ping") 
	public @ResponseBody String ping() {
		return "pong";
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.GET, value = "/data-mgt/{agency}/streets") 
	public @ResponseBody List<Street> getStreets(Principal principal, @PathVariable String agency, @RequestParam(required=false) String agencyId, 
		@RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		String uname = principal.getName();
		UserSetting user = mongoUserDetailsService.getUserDetails(uname);
		Map<String, String> userAgencyData = agencyDataSetup.getAgencyMap(agencyDataSetup.getAgencyById(user.getAgency()));
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = userAgencyData.get("id");
		}
		if (lat != null && lon != null && radius != null) {
			return dataService.getStreets(agency, lat, lon, radius, agencyId);
		} 
		return dataService.getStreets(agency, agencyId);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.GET, value = "/data-mgt/{agency}/parkings") 
	public @ResponseBody List<Parking> getParkings(Principal principal, @PathVariable String agency, @RequestParam(required=false) String agencyId, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		String uname = principal.getName();
		UserSetting user = mongoUserDetailsService.getUserDetails(uname);
		Map<String, String> userAgencyData = agencyDataSetup.getAgencyMap(agencyDataSetup.getAgencyById(user.getAgency()));
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = userAgencyData.get("id");
		}
		if (lat != null && lon != null && radius != null) {
			return dataService.getParkings(agency, lat, lon, radius, agencyId);
		} 
		return dataService.getParkings(agency, agencyId);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.GET, value = "/data-mgt/{agency}/parkingmeters") 
	public @ResponseBody List<ParkMeter> getParkingMeters(Principal principal, @PathVariable String agency, @RequestParam(required=false) String agencyId, @RequestParam(required=false) Double lat, @RequestParam(required=false) Double lon, @RequestParam(required=false) Double radius) throws Exception {
		String uname = principal.getName();
		UserSetting user = mongoUserDetailsService.getUserDetails(uname);
		Map<String, String> userAgencyData = agencyDataSetup.getAgencyMap(agencyDataSetup.getAgencyById(user.getAgency()));
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = userAgencyData.get("id");
		}
		if (lat != null && lon != null && radius != null) {
			return dataService.getParkingMeters(agency, lat, lon, radius, agencyId);
		} 
		return dataService.getParkingMeters(agency, agencyId);
	}
	
	// Method open to get all area objects
	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.GET, value = "/data-mgt/{appId}/area")
	public @ResponseBody
	List<RateAreaBean> getRateAreaDatas(Principal principal, @PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		String uname = principal.getName();
		UserSetting user = mongoUserDetailsService.getUserDetails(uname);
		Map<String, String> userAgencyData = agencyDataSetup.getAgencyMap(agencyDataSetup.getAgencyById(user.getAgency()));
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = userAgencyData.get("id");
		}
		return storage.getAllAreaByAgencyId(appId, agencyId);
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.POST, value = "/data-mgt/{agency}/parkings/{id}") 
	public @ResponseBody String updateParking(Principal principal, @RequestBody Parking parking,
		@RequestParam(required=false) String userAgencyId, @RequestParam(required=false) boolean isSysLog, 
		@RequestParam(required=false) String username, @RequestParam(required=false) long[] period, 
		@PathVariable String agency, @PathVariable String id) throws Exception, NotFoundException {
		String channelId = "1";	// mobile app mode
		String author = parking.getAuthor();
		String uname = principal.getName();
		UserSetting user = mongoUserDetailsService.getUserDetails(uname);
		Map<String, String> userAgencyData = agencyDataSetup.getAgencyMap(agencyDataSetup.getAgencyById(user.getAgency()));
		if(userAgencyId == null || userAgencyId.compareTo("") == 0){
			userAgencyId = userAgencyData.get("id");
			username = uname;
		}
		try {
			dataService.updateDynamicParkingData(parking, agency, channelId, userAgencyId, isSysLog, username, author, period, NO_PERIOD);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			e.printStackTrace();
			return "KO";
		}
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.POST, value = "/data-mgt/{agency}/streets/{id}") 
	public @ResponseBody String updateStreet(Principal principal, @RequestBody Street street,
		@RequestParam(required=false) String userAgencyId, @RequestParam(required=false) boolean isSysLog, 
		@RequestParam(required=false) String username, @RequestParam(required=false) long[] period, 
		@PathVariable String agency, @PathVariable String id) throws Exception, NotFoundException {
		String channelId = "1";	// mobile app mode
		String author = street.getAuthor();
		String uname = principal.getName();
		if(street.getAreaId() == null){
			street.setAgency(agency);
		}
		UserSetting user = mongoUserDetailsService.getUserDetails(uname);
		Map<String, String> userAgencyData = agencyDataSetup.getAgencyMap(agencyDataSetup.getAgencyById(user.getAgency()));
		if(userAgencyId == null || userAgencyId.compareTo("") == 0){
			userAgencyId = userAgencyData.get("id");
			username = uname;
		}
		try {
			if(period != null){
				logger.debug("Inserted period = " + period[0] + "-" + period[1] );
			}
			dataService.updateDynamicStreetData(street, agency, channelId, userAgencyId, isSysLog, username, author, period, NO_PERIOD);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			logger.error("Exception in street occupancy log insert: " + e.getMessage());
			return "KO";
		}
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.POST, value = "/data-mgt/{agency}/parkingmeters/{id}") 
	public @ResponseBody String updateParkingMeter(Principal principal, @RequestBody ParkMeter parkingMeter, 
		@RequestParam(required=false) String userAgencyId, @RequestParam(required=false) boolean isSysLog, 
		@RequestParam(required=false) String username, @RequestParam(required=false) long[] period, 
		@RequestParam(required=false) Long from, @RequestParam(required=false) Long to, @PathVariable String agency, 
		@PathVariable String id) throws Exception, NotFoundException {
		String channelId = "1";	// mobile app mode
		String author = parkingMeter.getAuthor();
		String uname = principal.getName();
		UserSetting user = mongoUserDetailsService.getUserDetails(uname);
		Map<String, String> userAgencyData = agencyDataSetup.getAgencyMap(agencyDataSetup.getAgencyById(user.getAgency()));
		if(userAgencyId == null || userAgencyId.compareTo("") == 0){
			userAgencyId = userAgencyData.get("id");
			username = uname;
		}
		try {
			dataService.updateDynamicParkingMeterData(parkingMeter, agency, channelId, userAgencyId, isSysLog, username, author, from, to, period, NO_PERIOD);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			logger.error("Exception in parking meter profit log insert: " + e.getMessage());
			return "KO";
		}
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.POST, value = "/data-mgt/{agency}/parkstructprofit/{id}/{channelId:.*}") 
	public @ResponseBody String updateParkStructProfitData(Principal principal, @RequestBody ParkStruct parkStruct, 
		@RequestParam(required=true) String userAgencyId, @RequestParam(required=false) boolean isSysLog, 
		@RequestParam(required=false) String username, @RequestParam(required=false) long[] period, 
		@RequestParam(required=false) Long from, @RequestParam(required=false) Long to, @PathVariable String agency, 
		@PathVariable String id, @PathVariable String channelId) throws Exception, NotFoundException {
		String uname = principal.getName();
		UserSetting user = mongoUserDetailsService.getUserDetails(uname);
		Map<String, String> userAgencyData = agencyDataSetup.getAgencyMap(agencyDataSetup.getAgencyById(user.getAgency()));
		if(userAgencyId == null || userAgencyId.compareTo("") == 0){
			userAgencyId = userAgencyData.get("id");
			username = uname;
		}
		try {
			dataService.updateDynamicParkStructProfitData(parkStruct, agency, channelId, userAgencyId, isSysLog, username, from, to, period, NO_PERIOD);
			return "OK";
		} catch (it.smartcommunitylab.parking.management.web.exception.NotFoundException e) {
			logger.error("Exception in parking structure profit log insert: " + e.getMessage());
			return "KO";
		}
	}

}
