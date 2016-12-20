package it.smartcommunitylab.parking.management.web.api;

import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBeanCore;
import it.smartcommunitylab.parking.management.web.bean.StreetBeanCore;
import it.smartcommunitylab.parking.management.web.controller.DashboardController;
import it.smartcommunitylab.parking.management.web.manager.CSVManager;
import it.smartcommunitylab.parking.management.web.manager.DynamicManager;
import it.smartcommunitylab.parking.management.web.manager.MarkerIconStorage;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;
import it.smartcommunitylab.parking.management.web.repository.impl.StatRepositoryImpl;

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

@Controller
public class DashboardRestController {
	
	private static final Logger logger = Logger
			.getLogger(DashboardController.class);

	private static final String ALL = "all";
	
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

	// Opened methods
	// Open method to retrieve all street occupancy data (with complete street data)
	@RequestMapping(method = RequestMethod.GET, value = "/stats/occupancy/{appId}/streets")
	//@ApiOperation(value = "Get Streets occupancy", notes = "Returns streets occupancy data items", response=List.class)
	public @ResponseBody
	List<StreetBeanCore> getAllStreetOccupancyNS(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) Integer valueType, @RequestParam(required=false) String vehicleType, @RequestParam(required=false) String agencyId, @RequestParam(required=false) String granularity) throws Exception {
		String type = Street.class.getCanonicalName();
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = ALL;
		}
		if(valueType == null){
			valueType = 2;
		}
		if(granularity == null){
			granularity = "year";
		}
		return dynamic.getOccupationRateFromAllStreetsWithGranularity(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType, agencyId, granularity, null, null);
	}
		
	// Open method to retrieve all street occupancy data by zone id (with complete street data)
	@RequestMapping(method = RequestMethod.GET, value = "/stats/occupancy/{appId}/zone/{zoneId}/streets")
	//@ApiOperation(value = "Get Streets occupancy", notes = "Returns streets occupancy data items")
	public @ResponseBody
	List<StreetBeanCore> getAllStreetInZoneOccupancyNS(@PathVariable String appId, @PathVariable String zoneId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) Integer valueType, @RequestParam(required=false) String vehicleType, @RequestParam(required=false) String agencyId, @RequestParam(required=false) String granularity) throws Exception {
		String type = Street.class.getCanonicalName();
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = ALL;
		}
		if(valueType == null){
			valueType = 2;
		}
		if(granularity == null){
			granularity = "year";
		}
		return dynamic.getOccupationRateFromAllStreetsWithGranularity(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType, agencyId, granularity, zoneId, null);
	}
	
	// Open method to retrieve all street occupancy data by area id (with complete street data)
	@RequestMapping(method = RequestMethod.GET, value = "/stats/occupancy/{appId}/area/{rateAreaId}/streets")
	//@ApiOperation(value = "Get Streets occupancy", notes = "Returns streets occupancy data items")
	public @ResponseBody
	List<StreetBeanCore> getAllStreetInAreaOccupancyNS(@PathVariable String appId, @PathVariable String rateAreaId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) Integer valueType, @RequestParam(required=false) String vehicleType, @RequestParam(required=false) String agencyId, @RequestParam(required=false) String granularity) throws Exception {
		String type = Street.class.getCanonicalName();
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = ALL;
		}
		if(valueType == null){
			valueType = 2;
		}
		if(granularity == null){
			granularity = "year";
		}
		return dynamic.getOccupationRateFromAllStreetsWithGranularity(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType, agencyId, granularity, null, rateAreaId);
	}
		
	// Open method to retrieve a single street occupancy data
	@RequestMapping(method = RequestMethod.GET, value = "/stats/occupancy/{appId}/street/{id}")
	//@ApiOperation(value = "Get Street occupancy", notes = "Returns single street occupancy data item")
	public @ResponseBody StreetBeanCore getStreetOccupancyNS(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) Integer valueType, @RequestParam(required=false) String vehicleType, @RequestParam(required=false) String granularity) throws Exception {
		String type = Street.class.getCanonicalName();
		if(valueType == null){
			valueType = 2;
		}
		return dynamic.getOccupationRateFromStreetCore(id, appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType, granularity);
	}
		
	// Open method to retrieve all street occupancy data (with complete street data)
	@RequestMapping(method = RequestMethod.GET, value = "/stats/occupancy/{appId}/parkings")
	//@ApiOperation(value = "Get Streets occupancy", notes = "Returns streets occupancy data items")
	public @ResponseBody
	List<ParkingStructureBeanCore> getAllParkingOccupancyNS(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) Integer valueType, @RequestParam(required=false) String vehicleType, @RequestParam(required=false) String agencyId, @RequestParam(required=false) String granularity) throws Exception {
		String type = Parking.class.getCanonicalName();
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = ALL;
		}
		if(valueType == null){
			valueType = 2;
		}
		if(granularity == null){
			granularity = "year";
		}
		return dynamic.getOccupationRateFromAllParkingsWithGranularity(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType, agencyId, granularity, null, null);
	}
		
	// Open method to retrieve all structures occupancy data by zone (with complete street data)
	@RequestMapping(method = RequestMethod.GET, value = "/stats/occupancy/{appId}/zone/{zoneId}/parkings")
	//@ApiOperation(value = "Get Streets occupancy", notes = "Returns streets occupancy data items")
	public @ResponseBody
	List<ParkingStructureBeanCore> getAllParkingInZoneOccupancyNS(@PathVariable String appId, @PathVariable String zoneId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) Integer valueType, @RequestParam(required=false) String vehicleType, @RequestParam(required=false) String agencyId, @RequestParam(required=false) String granularity) throws Exception {
		String type = Parking.class.getCanonicalName();
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = ALL;
		}
		if(valueType == null){
			valueType = 2;
		}
		if(granularity == null){
			granularity = "year";
		}
		return dynamic.getOccupationRateFromAllParkingsWithGranularity(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType, agencyId, granularity, zoneId, null);
	}
	
	// Open method to retrieve a single parking structure occupancy data
	@RequestMapping(method = RequestMethod.GET, value = "/stats/occupancy/{appId}/parking/{id}")
	//@ApiOperation(value = "Get Parking structure occupancy", notes = "Returns single structure occupancy data item")
	public @ResponseBody ParkingStructureBeanCore getStructureOccupancyNS(@PathVariable String appId, @PathVariable String id, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) Integer valueType, @RequestParam(required=false) String vehicleType, @RequestParam(required=false) String granularity) throws Exception {
		String type = Parking.class.getCanonicalName();
		if(valueType == null){
			valueType = 2;
		}
		return dynamic.getOccupationRateFromStructureCore(id, appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType, granularity);
	}
		
	// Open method to retrieve all parkingStructures occupancy data (with complete ps data)
	@RequestMapping(method = RequestMethod.GET, value = "/stats/occupancy/{appId}/parkingstructures")
	//@ApiOperation(value = "Get Parking structures occupancy", notes = "Returns parking structure occupancy data items")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructureOccupancyNS(@PathVariable String appId, @RequestParam(required=false) int[] year, @RequestParam(required=false) byte[] month, @RequestParam(required=false) String dayType, @RequestParam(required=false) byte[] weekday, @RequestParam(required=false) byte[] hour, @RequestParam(required=false) int valueType, @RequestParam(required=false) String vehicleType, @RequestParam(required=false) String agencyId) throws Exception {
		String type = Parking.class.getCanonicalName();
		if(agencyId == null || agencyId.compareTo("") == 0){
			agencyId = ALL;
		}
		return dynamic.getOccupationRateFromAllParkings(appId, type, null, year, month, dayType, weekday, hour, valueType, vehicleType, agencyId);
	}

}
