package it.smartcommunitylab.parking.management.web.api;

import java.io.IOException;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.controller.EditingController;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.MarkerIconStorage;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;

@Controller
public class DataRestController {
	
	@Autowired
	StorageManager storage;

	MarkerIconStorage markerIconStorage;

	private static final Logger logger = Logger
			.getLogger(EditingController.class);
	
	@PostConstruct
	private void init() throws IOException {
		markerIconStorage = new MarkerIconStorage();
	}
	
	// Method open to get all streets
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/street")
	//@ApiOperation(value = "Get Streets", notes = "Returns streets park items")
	public @ResponseBody
	List<StreetBean> getStreets(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllStreets(appId);
		} else {
			return storage.getAllStreetsByAgencyId(appId, agencyId);
		}
	}
			
	// Method open to get a single street
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/street/{streetId}")
	//@ApiOperation(value = "Get Street", notes = "Returns a single street park item")
	public @ResponseBody
	StreetBean getStreetById(@PathVariable("appId") String appId, @PathVariable("streetId") String streetId) {
		return storage.findStreet(streetId);
	}
		
	// Method open to get all parkingMeters
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/parkingmeter")
	//@ApiOperation(value = "Get ParkingMeters", notes = "Returns parking meter items")
	public @ResponseBody
	List<ParkingMeterBean> getParkingMeters(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllParkingMeters(appId);
		} else {
			return storage.getAllParkingMetersByAgencyId(appId, agencyId);
		}
	}
		
	// Method open to get all parkingMeters
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/parkingmeter/{pmId}")
	//@ApiOperation(value = "Get ParkingMeter", notes = "Returns a single parking meter item")
	public @ResponseBody
	ParkingMeterBean getParkingMeterById(@PathVariable("appId") String appId, @PathVariable("pmId") String pmId) {
		return storage.findParkingMeter(pmId, appId);
	}
	
	// Method open to get all area objects
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/area")
	//@ApiOperation(value = "Get Areas", notes = "Returns area items")
	public @ResponseBody
	List<RateAreaBean> getRateAreas(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllArea(appId);
		} else {
			return storage.getAllAreaByAgencyId(appId, agencyId);
		}
	}
			
	// Method open to get a single area object
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/area/{aid}")
	//@ApiOperation(value = "Get Area", notes = "Return a single area item")
	public @ResponseBody
	RateAreaBean getRateAreaById(@PathVariable("appId") String appId,
			@PathVariable("aid") String aid) throws NotFoundException {
		return storage.getAreaById(aid, appId);
	}
		
	// Method open to get all zones
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/zone")
	//@ApiOperation(value = "Get Zones", notes = "Return zone items")
	public @ResponseBody
	List<ZoneBean> getAllZones(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllZone(appId);
		} else {
			return storage.getAllZoneByAgencyId(appId, agencyId);
		}
	}
		
	// Method open to get a single zone
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/zone/id/{zId}")
	//@ApiOperation(value = "Get Zone", notes = "Return a single zone item")
	public @ResponseBody
	ZoneBean getZoneById(@PathVariable("appId") String appId, @PathVariable("zId") String zId) {
		return storage.findZoneById(zId, appId);
	}
		
	// Method open to get all zones of a specific type
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/zone/{zType}")
	//@ApiOperation(value = "Get Zones by type", notes = "Return zone items of specific type")
	public @ResponseBody
	List<ZoneBean> getZonesByType(@PathVariable("appId") String appId, @PathVariable("zType") String type, @RequestParam(required=false) String agencyId) {
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
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/bikepoint")
	//@ApiOperation(value = "Get Bikepoints", notes = "Return bike point items")
	public @ResponseBody
	List<BikePointBean> getBikePoints(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllBikePoints(appId);
		} else {
			return storage.getAllBikePointsByAgencyId(appId, agencyId);
		}
	}
		
	// Method open to get a single bike point
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/bikepoint/{pbid}")
	//@ApiOperation(value = "Get Bikepoint", notes = "Return a single bike point item")
	public @ResponseBody
	BikePointBean getBikePointById(@PathVariable("appId") String appId,
			@PathVariable("pbid") String pbid) throws NotFoundException {
		return storage.getBikePointById(pbid, appId);
	}
		
	// Method open to retrieve all parking structure
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/parkingstructure")
	//@ApiOperation(value = "Get Parkingstructures", notes = "Return parking structure items")
	public @ResponseBody
	List<ParkingStructureBean> getParkingStructures(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
		if(agencyId == null){
			return storage.getAllParkingStructure(appId);
		} else {
			return storage.getAllParkingStructureByAgencyId(appId, agencyId);
		}
	}
		
	// Method open to retrieve all parking structure
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/parkingstructure/{psId}")
	//@ApiOperation(value = "Get Parkingstructure", notes = "Return a single parking structure item")
	public @ResponseBody
	ParkingStructureBean getParkingStructureById(@PathVariable("appId") String appId, @PathVariable("psId") String psId) {
		return storage.getParkingStructureById(psId, appId);
	}	

}
