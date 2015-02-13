package it.smartcommunitylab.parking.management.web.manager;

import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.PointBean;
import it.smartcommunitylab.parking.management.web.bean.PolygonBean;
import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.converter.ModelConverter;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.BikePoint;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.Zone;
import it.smartcommunitylab.parking.management.web.model.geo.Point;
import it.smartcommunitylab.parking.management.web.model.geo.Polygon;

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

	public RateAreaBean save(RateAreaBean a) {
		RateArea area = ModelConverter.convert(a, RateArea.class);
		area = processId(area, RateArea.class);
		mongodb.save(area);
		a.setId(area.getId());
		return a;
	}

	public RateAreaBean editArea(RateAreaBean a) throws NotFoundException {
		RateArea area = findById(a.getId(), RateArea.class);
		area.setName(a.getName());
		area.setColor(a.getColor());
		area.setFee(a.getFee());
		area.setSmsCode(a.getSmsCode());
		area.setTimeSlot(a.getTimeSlot());
		if (area.getGeometry() != null) {
			area.getGeometry().clear();
		} else {
			area.setGeometry(new ArrayList<Polygon>());
		}
		for (PolygonBean polygon : a.getGeometry()) {
			area.getGeometry().add(
					ModelConverter.convert(polygon, Polygon.class));
		}

		mongodb.save(area);
		return a;
	}

	public BikePointBean editBikePoint(BikePointBean pb)
			throws NotFoundException {
		BikePoint bici = findById(pb.getId(), BikePoint.class);
		bici.setName(pb.getName());
		bici.setSlotNumber(pb.getSlotNumber());
		bici.setBikeNumber(pb.getBikeNumber());
		bici.getGeometry().setLat(pb.getGeometry().getLat());
		bici.getGeometry().setLng(pb.getGeometry().getLng());
		mongodb.save(bici);
		return pb;
	}

	public List<RateAreaBean> getAllArea() {
		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
		for (RateArea a : mongodb.findAll(RateArea.class)) {
			result.add(ModelConverter.convert(a, RateAreaBean.class));
		}
		return result;
	}

	public List<ParkingMeterBean> getAllParkingMeters() {
		List<ParkingMeterBean> result = new ArrayList<ParkingMeterBean>();

		for (RateAreaBean temp : getAllArea()) {
			result.addAll(getAllPArkingMeters(temp));
		}

		return result;
	}

	public List<ParkingMeterBean> getAllPArkingMeters(RateAreaBean ab) {
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<ParkingMeterBean> result = new ArrayList<ParkingMeterBean>();

		if (area.getParkingMeters() != null) {
			for (ParkingMeter tmp : area.getParkingMeters()) {
				ParkingMeterBean p = ModelConverter.convert(tmp,
						ParkingMeterBean.class);
				p.setAreaId(ab.getId());
				p.setColor(area.getColor());
				result.add(p);
			}
		}
		return result;
	}

	public List<StreetBean> getAllStreets() {
		List<StreetBean> result = new ArrayList<StreetBean>();

		for (RateAreaBean temp : getAllArea()) {
			result.addAll(getAllStreets(temp));
		}

		return result;
	}

	public List<StreetBean> getAllStreets(RateAreaBean ab) {
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<StreetBean> result = new ArrayList<StreetBean>();

		if (area.getStreets() != null) {
			for (Street tmp : area.getStreets()) {
				StreetBean v = ModelConverter.convert(tmp, StreetBean.class);
				v.setRateAreaId(ab.getId());
				v.setColor(area.getColor());
				result.add(v);
			}
		}
		return result;
	}

	public StreetBean findStreet(String parcometroId) {
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		Street v = new Street();
		for (RateArea area : aree) {
			if (area.getStreets() != null) {
				v.setId(parcometroId);
				int index = area.getStreets().indexOf(v);
				if (index != -1) {
					StreetBean result = ModelConverter.convert(
							area.getStreets().get(index), StreetBean.class);
					result.setRateAreaId(area.getId());
					return result;
				}
			}
		}
		return null;
	}

	public ParkingMeterBean findParkingMeter(String parcometroId) {
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		ParkingMeter p = new ParkingMeter();
		for (RateArea area : aree) {
			if (area.getParkingMeters() != null) {
				p.setId(parcometroId);
				int index = area.getParkingMeters().indexOf(p);
				if (index != -1) {
					ParkingMeterBean result = ModelConverter.convert(area
							.getParkingMeters().get(index), ParkingMeterBean.class);
					result.setAreaId(area.getId());
					return result;
				}
			}
		}
		return null;
	}

	public boolean removeParkingMeter(String areaId, String parcometroId) {
		RateArea area = mongodb.findById(areaId, RateArea.class);
		ParkingMeter p = new ParkingMeter();
		p.setId(parcometroId);
		boolean result = area.getParkingMeters() != null
				&& area.getParkingMeters().remove(p);
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

	public ParkingMeterBean editParkingMeter(ParkingMeterBean pb)
			throws DatabaseException {
		RateArea area = mongodb.findById(pb.getAreaId(), RateArea.class);
		boolean founded = false;
		if (area.getParkingMeters() != null) {
			for (ParkingMeter temp : area.getParkingMeters()) {
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
			ParkingMeterBean todel = findParkingMeter(pb.getId());
			if (todel != null) {
				removeParkingMeter(todel.getAreaId(), pb.getId());
			}
			pb = save(pb);
		}
		return pb;
	}

	public ParkingMeterBean save(ParkingMeterBean p) throws DatabaseException {
		ParkingMeter parcometro = ModelConverter.convert(p, ParkingMeter.class);
		parcometro = processId(parcometro, ParkingMeter.class);
		try {
			RateArea area = findById(p.getAreaId(), RateArea.class);
			if (area.getParkingMeters() == null) {
				area.setParkingMeters(new ArrayList<ParkingMeter>());
			}
			// TODO check if parcometro is already present
			area.getParkingMeters().add(parcometro);
			mongodb.save(area);
			p.setId(parcometro.getId());
			return p;
		} catch (NotFoundException e) {
			logger.error("Exception saving parcometro, relative area not found");
			throw new DatabaseException();
		}

	}

	public StreetBean editStreet(StreetBean vb) throws DatabaseException {
		RateArea area = mongodb.findById(vb.getRateAreaId(), RateArea.class);
		boolean founded = false;
		if (area.getStreets() != null) {
			for (Street temp : area.getStreets()) {
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
			StreetBean todel = findStreet(vb.getId());
			if (todel != null) {
				removeStreet(todel.getRateAreaId(), vb.getId());
			}
			vb = save(vb);
		}

		return vb;
	}

	public boolean removeStreet(String areaId, String viaId) {
		RateArea area = mongodb.findById(areaId, RateArea.class);
		Street v = new Street();
		v.setId(viaId);
		boolean result = area.getStreets() != null && area.getStreets().remove(v);
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

	public StreetBean save(StreetBean v) throws DatabaseException {
		Street via = ModelConverter.convert(v, Street.class);
		via = processId(via, Street.class);
		try {
			RateArea area = findById(v.getRateAreaId(), RateArea.class);
			if (area.getStreets() == null) {
				area.setStreets(new ArrayList<Street>());
			}
			// TODO check if via is already present
			area.getStreets().add(processId(via, Street.class));
			mongodb.save(area);
			v.setId(via.getId());
			return v;
		} catch (NotFoundException e) {
			logger.error("Exception saving via, relative area not found");
			throw new DatabaseException();
		}
	}

	public ZoneBean save(ZoneBean z) {
		Zone zona = ModelConverter.convert(z, Zone.class);
		zona = processId(zona, Zone.class);
		mongodb.save(zona);
		z.setId(zona.getId());
		return z;
	}

	public List<ZoneBean> getAllZone() {
		List<ZoneBean> result = new ArrayList<ZoneBean>();
		for (Zone z : mongodb.findAll(Zone.class)) {
			result.add(ModelConverter.convert(z, ZoneBean.class));
		}
		return result;
	}

	public ZoneBean editZone(ZoneBean z) throws NotFoundException {
		Zone zona = findById(z.getId(), Zone.class);
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

	public boolean removeZone(String zonaId) {
		Criteria crit = new Criteria();
		crit.and("id").is(zonaId);
		mongodb.remove(Query.query(crit), Zone.class);
		return true;
	}

	public boolean removeArea(String areaId) {
		Criteria crit = new Criteria();
		crit.and("id").is(areaId);
		mongodb.remove(Query.query(crit), RateArea.class);
		return true;
	}

	public boolean removeBikePoint(String puntobiciId) {
		Criteria crit = new Criteria();
		crit.and("id").is(puntobiciId);
		mongodb.remove(Query.query(crit), BikePoint.class);
		return true;
	}

	public BikePointBean save(BikePointBean pb) {
		BikePoint puntoBici = ModelConverter.convert(pb, BikePoint.class);
		puntoBici = processId(puntoBici, BikePoint.class);
		mongodb.save(puntoBici);
		pb.setId(puntoBici.getId());
		return pb;
	}

	public List<BikePointBean> getAllBikePoints() {
		List<BikePointBean> result = new ArrayList<BikePointBean>();
		for (BikePoint pb : mongodb.findAll(BikePoint.class)) {
			result.add(ModelConverter.convert(pb, BikePointBean.class));
		}
		return result;
	}

	public boolean removeParkingStructure(String id) {
		Criteria crit = new Criteria();
		crit.and("id").is(id);
		mongodb.remove(Query.query(crit), ParkingStructure.class);
		return true;
	}

	public ParkingStructureBean save(ParkingStructureBean entityBean) {
		ParkingStructure entity = ModelConverter.convert(entityBean,
				ParkingStructure.class);
		entity = processId(entity, ParkingStructure.class);
		mongodb.save(entity);
		entityBean.setId(entity.getId());
		return entityBean;
	}

	public List<ParkingStructureBean> getAllParkingStructure() {
		List<ParkingStructureBean> result = new ArrayList<ParkingStructureBean>();
		for (ParkingStructure entity : mongodb
				.findAll(ParkingStructure.class)) {
			result.add(ModelConverter.convert(entity,
					ParkingStructureBean.class));
		}
		return result;
	}

	public ParkingStructureBean editParkingStructure(
			ParkingStructureBean entityBean) throws NotFoundException {
		ParkingStructure entity = findById(entityBean.getId(),
				ParkingStructure.class);
		entity.setFee(entityBean.getFee());
		entity.setManagementMode(entityBean.getManagementMode());
		entity.setName(entityBean.getName());
		entity.setPaymentMode(ModelConverter.toPaymentMode(entityBean
				.getPaymentMode()));
		entity.setPhoneNumber(entityBean.getPhoneNumber());
		entity.setSlotNumber(entityBean.getSlotNumber());
		entity.setStreetReference(entityBean.getStreetReference());
		entity.setTimeSlot(entityBean.getTimeSlot());

		entity.getGeometry().setLat(entityBean.getGeometry().getLat());
		entity.getGeometry().setLng(entityBean.getGeometry().getLng());
		mongodb.save(entity);
		return entityBean;
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
