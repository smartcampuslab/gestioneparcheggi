package it.smartcampuslab.tm.controller;

import it.smartcampuslab.tm.bean.AreaBean;
import it.smartcampuslab.tm.bean.ParcometroBean;
import it.smartcampuslab.tm.bean.PuntoBiciBean;
import it.smartcampuslab.tm.bean.ViaBean;
import it.smartcampuslab.tm.bean.ZonaBean;
import it.smartcampuslab.tm.exception.DatabaseException;
import it.smartcampuslab.tm.exception.ExportException;
import it.smartcampuslab.tm.exception.NotFoundException;
import it.smartcampuslab.tm.manager.MarkerIconStorage;
import it.smartcampuslab.tm.manager.StorageManager;

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

	@RequestMapping(method = RequestMethod.POST, value = "/via")
	public @ResponseBody
	ViaBean createVia(@RequestBody ViaBean via) throws DatabaseException {
		return storage.save(via);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/via/{aid}/{vid}")
	public @ResponseBody
	boolean deleteVia(@PathVariable("aid") String aid,
			@PathVariable("vid") String vid) throws DatabaseException {
		return storage.removeVia(aid, vid);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/via/{vid}")
	public @ResponseBody
	ViaBean editVia(@PathVariable("vid") String vid, @RequestBody ViaBean via)
			throws DatabaseException {
		return storage.editVia(via);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/via")
	public @ResponseBody
	List<ViaBean> getAllVia() {
		return storage.getAllVia();
	}

	@RequestMapping(method = RequestMethod.POST, value = "/parcometro")
	public @ResponseBody
	ParcometroBean createParcometro(@RequestBody ParcometroBean parcometro)
			throws DatabaseException {
		return storage.save(parcometro);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/parcometro")
	public @ResponseBody
	List<ParcometroBean> getAllParcometro() {
		return storage.getAllParcometro();
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/parcometro/{aid}/{pid}")
	public @ResponseBody
	boolean deleteParcometro(@PathVariable("aid") String aid,
			@PathVariable("pid") String pid) {
		return storage.removeParcometro(aid, pid);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/parcometro/{pid}")
	public @ResponseBody
	ParcometroBean editParcometro(@PathVariable("pid") String pid,
			@RequestBody ParcometroBean parcometro) throws DatabaseException {
		return storage.editParcometro(parcometro);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/area")
	public @ResponseBody
	AreaBean createArea(@RequestBody AreaBean area) {
		return storage.save(area);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/area/{aid}")
	public @ResponseBody
	AreaBean editArea(@PathVariable("aid") String aid,
			@RequestBody AreaBean area) throws NotFoundException {
		return storage.editArea(area);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/area")
	public @ResponseBody
	List<AreaBean> getAllArea() {
		return storage.getAllArea();
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/area/{aid}")
	public @ResponseBody
	boolean deleteArea(@PathVariable("aid") String aid) {
		return storage.removeArea(aid);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/zona")
	public @ResponseBody
	ZonaBean createZona(@RequestBody ZonaBean zona) throws DatabaseException {
		return storage.save(zona);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/zona")
	public @ResponseBody
	List<ZonaBean> getAllZona() {
		return storage.getAllZona();
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/zona/{zid}")
	public @ResponseBody
	ZonaBean editZona(@PathVariable("zid") String zid,
			@RequestBody ZonaBean zona) throws NotFoundException {
		return storage.editZona(zona);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/zona/{zid}")
	public @ResponseBody
	boolean deleteZona(@PathVariable("zid") String zid) {
		return storage.removeZona(zid);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/puntobici")
	public @ResponseBody
	PuntoBiciBean createPuntobici(@RequestBody PuntoBiciBean puntobici)
			throws DatabaseException {
		return storage.save(puntobici);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/puntobici")
	public @ResponseBody
	List<PuntoBiciBean> getAllPuntobici() {
		return storage.getAllPuntobici();
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/puntobici/{pbid}")
	public @ResponseBody
	boolean deletePuntobici(@PathVariable("pbid") String pbid) {
		return storage.removePuntobici(pbid);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/puntobici/{pbid}")
	public @ResponseBody
	PuntoBiciBean editPuntobici(@PathVariable("pbid") String pbid,
			@RequestBody PuntoBiciBean bici) throws NotFoundException {
		return storage.editPuntobici(bici);
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
