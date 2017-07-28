package it.smartcommunitylab.parking.management.web.api;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipOutputStream;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import de.micromata.opengis.kml.v_2_2_0.Kml;
import io.swagger.annotations.ApiParam;
import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.SimpleRateArea;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.controller.EditingController;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.kml.KMLExporter;
import it.smartcommunitylab.parking.management.web.manager.MarkerIconStorage;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;

@Controller
public class DataRestController {
	
	@Autowired
	StorageManager storage;
	
	@Autowired
	KMLExporter kmlExporter;	

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
	
	// Method open to get near parkingMeters
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/nearparkingmeters/{latitude}/{longitude}/{radius}/{limit}")
	//@ApiOperation(value = "Get ParkingMeters", notes = "Returns parking meter items")
	public @ResponseBody
	List<SimpleRateArea> getNearParkingMeters(@ApiParam(defaultValue="tn") @PathVariable("appId") String appId, @ApiParam(defaultValue="46.057598") @PathVariable double latitude, @ApiParam(defaultValue="11.133676") @PathVariable double longitude,
			@ApiParam(defaultValue="0.05") @PathVariable double radius, @ApiParam(defaultValue="5") @PathVariable int limit, @ApiParam(required=false) @RequestParam(required=false) String agencyIds) {
		if(agencyIds == null){
			return storage.getSimpleRateArea(appId, null, latitude, longitude, radius, limit);
		} else {
			return storage.getSimpleRateArea(appId, Arrays.stream(agencyIds.split(",")).collect(Collectors.toList()), latitude, longitude, radius, limit);
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
	public @ResponseBody List<RateAreaBean> getRateAreas(@PathVariable("appId") String appId, @RequestParam(required = false) String zoneId, @RequestParam(required = false) String agencyId) {
		if (zoneId == null) {
			if (agencyId == null) {
				return storage.getAllArea(appId);
			} else {
				return storage.getAllAreaByAgencyId(appId, agencyId);
			}
		} else {
			if (agencyId == null) {
				return storage.getAllAreaByZoneId(appId, zoneId);
			} else {
				return storage.getAllAreaByAgencyAndZoneId(appId, agencyId, zoneId);
			}
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
		
//	// Method open to retrieve all parking structure
//	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/parkingstructure")
//	//@ApiOperation(value = "Get Parkingstructures", notes = "Return parking structure items")
//	public @ResponseBody
//	List<ParkingStructureBean> getParkingStructures(@PathVariable("appId") String appId, @RequestParam(required=false) String agencyId) {
//		if(agencyId == null){
//			return storage.getAllParkingStructure(appId);
//		} else {
//			return storage.getAllParkingStructureByAgencyId(appId, agencyId);
//		}
//	}
		
	// Method open to retrieve all parking structure
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/parkingstructure/{psId}")
	//@ApiOperation(value = "Get Parkingstructure", notes = "Return a single parking structure item")
	public @ResponseBody
	ParkingStructureBean getParkingStructureById(@PathVariable("appId") String appId, @PathVariable("psId") String psId) {
		return storage.getParkingStructureById(psId, appId);
	}	

	
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/kml/areas")
	public @ResponseBody void getAreasKML(@PathVariable String appId, HttpServletResponse response) throws Exception {	
		response.setContentType("text/plain");
		response.setHeader("Content-Disposition", "attachment; filename=\"aree_" + appId + ".kml\"");		
		
		Kml kml = kmlExporter.exportArea(appId);
		kmlExporter.write(kml, response.getOutputStream());
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/kml/parkings")
	public @ResponseBody void getParkingsKML(@PathVariable String appId, HttpServletResponse response) throws Exception {	
		response.setContentType("text/plain");
		response.setHeader("Content-Disposition", "attachment; filename=\"parcheggi_" + appId + ".kml\"");		
		
		Kml kml = kmlExporter.exportParkings(appId);
		kmlExporter.write(kml, response.getOutputStream());
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/kml/streets")
	public @ResponseBody void getStreetsKML(@PathVariable String appId, HttpServletResponse response) throws Exception {	
		response.setContentType("text/plain");
		response.setHeader("Content-Disposition", "attachment; filename=\"vie_" + appId + ".kml\"");		
		
		Kml kml = kmlExporter.exportStreets(appId);
		kmlExporter.write(kml, response.getOutputStream());
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/kml/zones")
	public @ResponseBody void getZonesKML(@PathVariable String appId, HttpServletResponse response) throws Exception {	
		response.setContentType("text/plain");
		response.setHeader("Content-Disposition", "attachment; filename=\"zone_" + appId + ".kml\"");		
		
		Kml kml = kmlExporter.exportMacroZone(appId);
		kmlExporter.write(kml, response.getOutputStream());
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/data/{appId}/kml/all")
	public @ResponseBody void getAllKML(@PathVariable String appId, HttpServletResponse response) throws Exception {	
		response.setContentType("application/zip");
		response.setHeader("Content-Disposition", "attachment; filename=\"export_" + appId + ".zip\"");		
		
		ZipOutputStream zos = new ZipOutputStream(response.getOutputStream());
		
		Kml kml = kmlExporter.exportArea(appId);
		kmlExporter.addTozip(kml, "aree_" + appId, zos);
		kml = kmlExporter.exportParkings(appId);
		kmlExporter.addTozip(kml, "parcheggi_" + appId, zos);
		kml = kmlExporter.exportStreets(appId);
		kmlExporter.addTozip(kml, "vie_" + appId, zos);
		kml = kmlExporter.exportMacroZone(appId);
		kmlExporter.addTozip(kml, "zone_" + appId, zos);	
		
		zos.close();
	}		
	
	
}
