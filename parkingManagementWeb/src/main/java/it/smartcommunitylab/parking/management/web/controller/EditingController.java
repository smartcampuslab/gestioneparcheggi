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
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class EditingController {

	private static final Logger logger = Logger
			.getLogger(EditingController.class);

	@Autowired
	StorageManager storage;

	MarkerIconStorage markerIconStorage;

	@PostConstruct
	@SuppressWarnings("unused")
	private void init() throws IOException {
		markerIconStorage = new MarkerIconStorage();
	}

	@RequestMapping(method = RequestMethod.POST, value = "/street")
	public @ResponseBody
	StreetBean createStreet(@RequestBody StreetBean street) throws DatabaseException {
		return storage.save(street);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/street/{aid}/{sid}")
	public @ResponseBody
	boolean deleteStreet(@PathVariable("aid") String aid,
			@PathVariable("sid") String sid) throws DatabaseException {
		return storage.removeStreet(aid, sid);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/street/{sid}")
	public @ResponseBody
	StreetBean editStreet(@PathVariable("sid") String vid, @RequestBody StreetBean street)
			throws DatabaseException {
		return storage.editStreet(street);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/street")
	public @ResponseBody
	List<StreetBean> getAllStreets() {
		return storage.getAllStreets();
	}

	@RequestMapping(method = RequestMethod.POST, value = "/parkingmeter")
	public @ResponseBody
	ParkingMeterBean createParkingMeter(@RequestBody ParkingMeterBean parkingMeter)
			throws DatabaseException {
		return storage.save(parkingMeter);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/parkingmeter")
	public @ResponseBody
	List<ParkingMeterBean> getAllParkingMeters() {
		return storage.getAllParkingMeters();
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/parkingmeter/{aid}/{pid}")
	public @ResponseBody
	boolean deleteParkingMeter(@PathVariable("aid") String aid,
			@PathVariable("pid") String pid) {
		return storage.removeParkingMeter(aid, pid);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/parkingmeter/{pid}")
	public @ResponseBody
	ParkingMeterBean editParkingMeter(@PathVariable("pid") String pid,
			@RequestBody ParkingMeterBean parkingMeter) throws DatabaseException {
		return storage.editParkingMeter(parkingMeter);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/area")
	public @ResponseBody
	RateAreaBean createRateArea(@RequestBody RateAreaBean area) {
		return storage.save(area);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/area/{aid}")
	public @ResponseBody
	RateAreaBean editRateArea(@PathVariable("aid") String aid,
			@RequestBody RateAreaBean area) throws NotFoundException {
		return storage.editArea(area);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/area/{aid}")
	public @ResponseBody
	RateAreaBean getRateArea(@PathVariable("aid") String aid,
			@RequestBody RateAreaBean area) throws NotFoundException {
		return storage.getAreaById(aid);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/area")
	public @ResponseBody
	List<RateAreaBean> getAllRateArea() {
		return storage.getAllArea();
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/area/{aid}")
	public @ResponseBody
	boolean deleteRateArea(@PathVariable("aid") String aid) {
		return storage.removeArea(aid);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/zone")
	public @ResponseBody
	ZoneBean createZone(@RequestBody ZoneBean zone) throws DatabaseException {
		return storage.save(zone);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/zone")
	public @ResponseBody
	List<ZoneBean> getAllZone() {
		return storage.getAllZone();
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/zone/{zid}")
	public @ResponseBody
	ZoneBean editZone(@PathVariable("zid") String zid,
			@RequestBody ZoneBean zone) throws NotFoundException {
		return storage.editZone(zone);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/zone/{zid}")
	public @ResponseBody
	boolean deleteZone(@PathVariable("zid") String zid) {
		return storage.removeZone(zid);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/bikepoint")
	public @ResponseBody
	BikePointBean createBikePoint(@RequestBody BikePointBean puntobici)
			throws DatabaseException {
		return storage.save(puntobici);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/bikepoint")
	public @ResponseBody
	List<BikePointBean> getAllBikePoints() {
		return storage.getAllBikePoints();
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/bikepoint/{pbid}")
	public @ResponseBody
	boolean deleteBikePoint(@PathVariable("pbid") String pbid) {
		return storage.removeBikePoint(pbid);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/bikepoint/{pbid}")
	public @ResponseBody
	BikePointBean editBikePoint(@PathVariable("pbid") String pbid,
			@RequestBody BikePointBean bici) throws NotFoundException {
		return storage.editBikePoint(bici);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/parkingstructure")
	public @ResponseBody
	ParkingStructureBean createParkingStructure(
			@RequestBody ParkingStructureBean entityBean)
			throws DatabaseException {
		return storage.save(entityBean);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/parkingstructure")
	public @ResponseBody
	List<ParkingStructureBean> getAllParkingStructure() {
		return storage.getAllParkingStructure();
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/parkingstructure/{id}")
	public @ResponseBody
	boolean deleteParkingStructure(@PathVariable String id) {
		return storage.removeParkingStructure(id);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/parkingstructure/{id}")
	public @ResponseBody
	ParkingStructureBean editParkingStructure(@PathVariable String id,
			@RequestBody ParkingStructureBean entityBean)
			throws NotFoundException {
		return storage.editParkingStructure(entityBean);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/data")
	public @ResponseBody
	byte[] exportData() throws ExportException {
		return storage.exportData();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/export")
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

	@RequestMapping(method = RequestMethod.GET, value = "/marker/{company}/{entity}/{color}")
	public void getMarkerIcon(HttpServletRequest request,
			HttpServletResponse response, @PathVariable("color") String color,
			@PathVariable String entity, @PathVariable String company)
			throws IOException {

		getMarkerIcon(response, request.getSession().getServletContext()
				.getRealPath("/"), company, entity, color);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/marker/{company}/{entity}")
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
