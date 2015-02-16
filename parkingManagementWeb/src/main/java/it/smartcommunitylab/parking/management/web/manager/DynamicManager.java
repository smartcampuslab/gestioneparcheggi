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
public class DynamicManager {

	private static final Logger logger = Logger.getLogger(DynamicManager.class);

	@Autowired
	private MongoTemplate mongodb;

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
		bici.setLastChange(System.currentTimeMillis());
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
			result.addAll(getAllParkingMeters(temp));
		}

		return result;
	}

	public List<ParkingMeterBean> getAllParkingMeters(RateAreaBean ab) {
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
	
	public List<StreetBean> getAllStreets(ZoneBean z) {
		//RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<RateArea> areas = mongodb.findAll(RateArea.class);
		List<StreetBean> result = new ArrayList<StreetBean>();
		
		for(RateArea area : areas){
			if (area.getStreets() != null) {
				for (Street tmp : area.getStreets()) {
					List<Zone> zones = tmp.getZones();
					StreetBean s = ModelConverter.convert(tmp, StreetBean.class);
					for(Zone zona : zones){
						if((zona.getId().compareTo(z.getId()) == 0) && (zona.getId_app().compareTo(z.getId_app()) == 0)){
							s.setColor(z.getColor());
							result.add(s);
						}
					}
				}
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
		
		return pb;
	}

	public StreetBean editStreet(StreetBean vb) throws DatabaseException {
		RateArea area = mongodb.findById(vb.getRateAreaId(), RateArea.class);
		boolean founded = false;
		if (area.getStreets() != null) {
			for (Street temp : area.getStreets()) {
				if (temp.getId().equals(vb.getId())) {
					temp.setSlotNumber(vb.getSlotNumber());
					temp.setFreeParkSlotNumber(vb.getFreeParkSlotNumber());
					temp.setFreeParkSlotSignNumber(vb.getFreeParkSlotSignNumber());
					temp.setUnusuableSlotNumber(vb.getUnusuableSlotNumber());
					temp.setHandicappedSlotNumber(vb.getHandicappedSlotNumber());
					temp.setStreetReference(vb.getStreetReference());
					temp.setTimedParkSlotNumber(vb.getTimedParkSlotNumber());
					temp.setSubscritionAllowedPark(vb
							.isSubscritionAllowedPark());
					temp.getGeometry().getPoints().clear();
					for (PointBean pb : vb.getGeometry().getPoints()) {
						temp.getGeometry().getPoints()
								.add(ModelConverter.convert(pb, Point.class));
					}
					temp.setZones(vb.getZoneBeanToZone());
					// Dynamic updates
					temp.setFreeParkSlotOccupied(vb.getFreeParkSlotOccupied());
					temp.setFreeParkSlotSignOccupied(vb.getFreeParkSlotSignOccupied());
					temp.setHandicappedSlotOccupied(vb.getHandicappedSlotOccupied());
					temp.setTimedParkSlotOccupied(vb.getTimedParkSlotOccupied());
					temp.setPaidSlotOccupied(vb.getPaidSlotOccupied());
					temp.setLastChange(System.currentTimeMillis());
					
					mongodb.save(area);
					founded = true;
					break;
				}
			}
		}

		return vb;
	}

	public StreetBean save(StreetBean s) throws DatabaseException {
		Street street = ModelConverter.convert(s, Street.class);
		street = processId(street, Street.class);
		street.setZones(s.getZoneBeanToZone());
		try {
			RateArea area = findById(s.getRateAreaId(), RateArea.class);
			if (area.getStreets() == null) {
				area.setStreets(new ArrayList<Street>());
			}
			// TODO check if via is already present
			area.getStreets().add(processId(street, Street.class));
			mongodb.save(area);
			s.setId(street.getId());
			return s;
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

	@SuppressWarnings("unchecked")
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