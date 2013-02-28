package it.smartcampuslab.tm.manager;

import it.smartcampuslab.tm.bean.AreaBean;
import it.smartcampuslab.tm.bean.ParcometroBean;
import it.smartcampuslab.tm.bean.PointBean;
import it.smartcampuslab.tm.bean.PuntoBiciBean;
import it.smartcampuslab.tm.bean.ViaBean;
import it.smartcampuslab.tm.bean.ZonaBean;
import it.smartcampuslab.tm.converter.ModelConverter;
import it.smartcampuslab.tm.exception.DatabaseException;
import it.smartcampuslab.tm.exception.ExportException;
import it.smartcampuslab.tm.exception.NotFoundException;
import it.smartcampuslab.tm.model.Area;
import it.smartcampuslab.tm.model.Parcometro;
import it.smartcampuslab.tm.model.PuntoBici;
import it.smartcampuslab.tm.model.Via;
import it.smartcampuslab.tm.model.Zona;
import it.smartcampuslab.tm.model.geo.Point;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service("storageManager")
public class StorageManager {

	private static final Logger logger = Logger.getLogger(StorageManager.class);

	@Autowired
	private MongoTemplate mongodb;

	public AreaBean save(AreaBean a) {
		Area area = ModelConverter.convert(a, Area.class);
		area = processId(area, Area.class);
		mongodb.save(area);
		a.setId(area.getId());
		return a;
	}

	public AreaBean editArea(AreaBean a) throws NotFoundException {
		Area area = findById(a.getId(), Area.class);
		area.setName(a.getName());
		area.setColor(a.getColor());
		area.setFee(a.getFee());
		area.setSmsCode(a.getSmsCode());
		area.setTimeSlot(a.getTimeSlot());
		mongodb.save(area);
		return a;
	}

	public PuntoBiciBean editPuntobici(PuntoBiciBean pb)
			throws NotFoundException {
		PuntoBici bici = findById(pb.getId(), PuntoBici.class);
		bici.setName(pb.getName());
		bici.setSlotNumber(pb.getSlotNumber());
		bici.setBikeNumber(pb.getBikeNumber());
		bici.getGeometry().setLat(pb.getGeometry().getLat());
		bici.getGeometry().setLng(pb.getGeometry().getLng());
		mongodb.save(bici);
		return pb;
	}

	public List<AreaBean> getAllArea() {
		List<AreaBean> result = new ArrayList<AreaBean>();
		for (Area a : mongodb.findAll(Area.class)) {
			result.add(ModelConverter.convert(a, AreaBean.class));
		}
		return result;
	}

	public List<ParcometroBean> getAllParcometro() {
		List<ParcometroBean> result = new ArrayList<ParcometroBean>();

		for (AreaBean temp : getAllArea()) {
			result.addAll(getAllParcometro(temp));
		}

		return result;
	}

	public List<ParcometroBean> getAllParcometro(AreaBean ab) {
		Area area = mongodb.findById(ab.getId(), Area.class);
		List<ParcometroBean> result = new ArrayList<ParcometroBean>();

		if (area.getParcometri() != null) {
			for (Parcometro tmp : area.getParcometri()) {
				ParcometroBean p = ModelConverter.convert(tmp,
						ParcometroBean.class);
				p.setAreaId(ab.getId());
				p.setColor(area.getColor());
				result.add(p);
			}
		}
		return result;
	}

	public List<ViaBean> getAllVia() {
		List<ViaBean> result = new ArrayList<ViaBean>();

		for (AreaBean temp : getAllArea()) {
			result.addAll(getAllVia(temp));
		}

		return result;
	}

	public List<ViaBean> getAllVia(AreaBean ab) {
		Area area = mongodb.findById(ab.getId(), Area.class);
		List<ViaBean> result = new ArrayList<ViaBean>();

		if (area.getVie() != null) {
			for (Via tmp : area.getVie()) {
				ViaBean v = ModelConverter.convert(tmp, ViaBean.class);
				v.setAreaId(ab.getId());
				v.setColor(area.getColor());
				result.add(v);
			}
		}
		return result;
	}

	public ViaBean findVia(String parcometroId) {
		List<Area> aree = mongodb.findAll(Area.class);
		Via v = new Via();
		for (Area area : aree) {
			if (area.getVie() != null) {
				v.setId(parcometroId);
				int index = area.getVie().indexOf(v);
				if (index != -1) {
					ViaBean result = ModelConverter.convert(
							area.getVie().get(index), ViaBean.class);
					result.setAreaId(area.getId());
					return result;
				}
			}
		}
		return null;
	}

	public ParcometroBean findParcometro(String parcometroId) {
		List<Area> aree = mongodb.findAll(Area.class);
		Parcometro p = new Parcometro();
		for (Area area : aree) {
			if (area.getParcometri() != null) {
				p.setId(parcometroId);
				int index = area.getParcometri().indexOf(p);
				if (index != -1) {
					ParcometroBean result = ModelConverter.convert(area
							.getParcometri().get(index), ParcometroBean.class);
					result.setAreaId(area.getId());
					return result;
				}
			}
		}
		return null;
	}

	public boolean removeParcometro(String areaId, String parcometroId) {
		Area area = mongodb.findById(areaId, Area.class);
		Parcometro p = new Parcometro();
		p.setId(parcometroId);
		boolean result = area.getParcometri() != null
				&& area.getParcometri().remove(p);
		if (result) {
			mongodb.save(area);
			logger.info(String.format(
					"Success removing parcometro %s of area %s", parcometroId,
					areaId));
		} else {
			logger.warn(String.format(
					"Failure removing parcometro %s of area %s", parcometroId,
					areaId));
		}

		return result;
	}

	public ParcometroBean editParcometro(ParcometroBean pb)
			throws DatabaseException {
		Area area = mongodb.findById(pb.getAreaId(), Area.class);
		boolean founded = false;
		if (area.getParcometri() != null) {
			for (Parcometro temp : area.getParcometri()) {
				if (temp.getId().equals(pb.getId())) {
					temp.setCode(pb.getCode());
					temp.setNote(pb.getNote());
					temp.setStatus(pb.getStatus());
					temp.getGeometry().setLat(pb.getGeometry().getLat());
					temp.getGeometry().setLng(pb.getGeometry().getLng());
					mongodb.save(area);
					founded = true;
					break;
				}
			}
		}
		if (!founded) {
			ParcometroBean todel = findParcometro(pb.getId());
			if (todel != null) {
				removeParcometro(todel.getAreaId(), pb.getId());
			}
			pb = save(pb);
		}
		return pb;
	}

	public ParcometroBean save(ParcometroBean p) throws DatabaseException {
		Parcometro parcometro = ModelConverter.convert(p, Parcometro.class);
		parcometro = processId(parcometro, Parcometro.class);
		try {
			Area area = findById(p.getAreaId(), Area.class);
			if (area.getParcometri() == null) {
				area.setParcometri(new ArrayList<Parcometro>());
			}
			// TODO check if parcometro is already present
			area.getParcometri().add(parcometro);
			mongodb.save(area);
			p.setId(parcometro.getId());
			return p;
		} catch (NotFoundException e) {
			logger.error("Exception saving parcometro, relative area not found");
			throw new DatabaseException();
		}

	}

	public ViaBean editVia(ViaBean vb) throws DatabaseException {
		Area area = mongodb.findById(vb.getAreaId(), Area.class);
		boolean founded = false;
		if (area.getVie() != null) {
			for (Via temp : area.getVie()) {
				if (temp.getId().equals(vb.getId())) {
					temp.setSlotNumber(vb.getSlotNumber());
					temp.setHandicappedSlotNumber(vb.getHandicappedSlotNumber());
					temp.setStreetReference(vb.getStreetReference());
					temp.setTimedParkSlotNumber(vb.getTimedParkSlotNumber());
					temp.setFreeParkSlotNumber(vb.getFreeParkSlotNumber());
					temp.setSubscritionAllowedPark(vb
							.isSubscritionAllowedPark());
					temp.getGeometry().getPoints().clear();
					for (PointBean pb : vb.getGeometry().getPoints()) {
						temp.getGeometry().getPoints()
								.add(ModelConverter.convert(pb, Point.class));
					}
					mongodb.save(area);
					founded = true;
					break;
				}
			}
		}

		if (!founded) {
			ViaBean todel = findVia(vb.getId());
			if (todel != null) {
				removeVia(todel.getAreaId(), vb.getId());
			}
			vb = save(vb);
		}

		return vb;
	}

	public boolean removeVia(String areaId, String viaId) {
		Area area = mongodb.findById(areaId, Area.class);
		Via v = new Via();
		v.setId(viaId);
		boolean result = area.getVie() != null && area.getVie().remove(v);
		if (result) {
			mongodb.save(area);
			logger.info(String.format("Success removing via %s of area %s",
					viaId, areaId));
		} else {
			logger.warn(String.format("Failure removing via %s of area %s",
					viaId, areaId));
		}

		return result;
	}

	public ViaBean save(ViaBean v) throws DatabaseException {
		Via via = ModelConverter.convert(v, Via.class);
		via = processId(via, Via.class);
		try {
			Area area = findById(v.getAreaId(), Area.class);
			if (area.getVie() == null) {
				area.setVie(new ArrayList<Via>());
			}
			// TODO check if via is already present
			area.getVie().add(processId(via, Via.class));
			mongodb.save(area);
			v.setId(via.getId());
			return v;
		} catch (NotFoundException e) {
			logger.error("Exception saving via, relative area not found");
			throw new DatabaseException();
		}
	}

	public ZonaBean save(ZonaBean z) {
		Zona zona = ModelConverter.convert(z, Zona.class);
		zona = processId(zona, Zona.class);
		mongodb.save(zona);
		z.setId(zona.getId());
		return z;
	}

	public List<ZonaBean> getAllZona() {
		List<ZonaBean> result = new ArrayList<ZonaBean>();
		for (Zona z : mongodb.findAll(Zona.class)) {
			result.add(ModelConverter.convert(z, ZonaBean.class));
		}
		return result;
	}

	public ZonaBean editZona(ZonaBean z) throws NotFoundException {
		Zona zona = findById(z.getId(), Zona.class);
		zona.setName(z.getName());
		zona.setColor(z.getColor());
		zona.setNote(z.getNote());
		zona.getGeometry().getPoints().clear();
		for (PointBean pb : z.getGeometry().getPoints()) {
			zona.getGeometry().getPoints()
					.add(ModelConverter.convert(pb, Point.class));
		}
		mongodb.save(zona);
		return z;
	}

	public boolean removeZona(String zonaId) {
		Criteria crit = new Criteria();
		crit.and("id").is(zonaId);
		mongodb.remove(Query.query(crit), Zona.class);
		return true;
	}

	public boolean removeArea(String areaId) {
		Criteria crit = new Criteria();
		crit.and("id").is(areaId);
		mongodb.remove(Query.query(crit), Area.class);
		return true;
	}

	public boolean removePuntobici(String puntobiciId) {
		Criteria crit = new Criteria();
		crit.and("id").is(puntobiciId);
		mongodb.remove(Query.query(crit), PuntoBici.class);
		return true;
	}

	public PuntoBiciBean save(PuntoBiciBean pb) {
		PuntoBici puntoBici = ModelConverter.convert(pb, PuntoBici.class);
		puntoBici = processId(puntoBici, PuntoBici.class);
		mongodb.save(puntoBici);
		pb.setId(puntoBici.getId());
		return pb;
	}

	public List<PuntoBiciBean> getAllPuntobici() {
		List<PuntoBiciBean> result = new ArrayList<PuntoBiciBean>();
		for (PuntoBici pb : mongodb.findAll(PuntoBici.class)) {
			result.add(ModelConverter.convert(pb, PuntoBiciBean.class));
		}
		return result;
	}

	public byte[] exportData() throws ExportException {
		Exporter exporter = new ZipCsvExporter(mongodb);
		return exporter.export();
	}

	private <T> T findById(String id, Class<T> javaClass)
			throws NotFoundException {
		T result = mongodb.findById(id, javaClass);
		if (result == null) {
			throw new NotFoundException();
		}
		return result;
	}

	private <T> T processId(Object o, Class<T> javaClass) {
		try {
			String id = (String) o.getClass().getMethod("getId", null)
					.invoke(o, null);
			if (id == null || id.trim().isEmpty()) {
				o.getClass().getMethod("setId", String.class)
						.invoke(o, new ObjectId().toString());
			}
		} catch (Exception e) {
			throw new IllegalArgumentException();
		}
		return (T) o;
	}
}
