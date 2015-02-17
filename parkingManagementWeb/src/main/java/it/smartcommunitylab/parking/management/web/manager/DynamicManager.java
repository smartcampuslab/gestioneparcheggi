package it.smartcommunitylab.parking.management.web.manager;

import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.converter.ModelConverter;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.BikePoint;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.Zone;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

// Manager used to store the dynamic data
@Service("storageDynamicManager")
public class DynamicManager {

	private static final Logger logger = Logger.getLogger(DynamicManager.class);

	@Autowired
	private MongoTemplate mongodb;

	// RateArea Methods
	public List<RateAreaBean> getAllArea() {
		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
		for (RateArea a : mongodb.findAll(RateArea.class)) {
			result.add(ModelConverter.convert(a, RateAreaBean.class));
		}
		return result;
	}

	// Street Methods
	public List<StreetBean> getAllStreets(Long timestamp) {
		List<StreetBean> result = new ArrayList<StreetBean>();

		for (RateAreaBean temp : getAllArea()) {
			result.addAll(getAllStreets(temp, timestamp));
		}

		return result;
	}

	/**
	 * Method getAllStreets(rateArea filter)
	 * @param ab: area bean where find the streets
	 * @param timestamp: last change. If a street was updated between now and this timestamp
	 * it will be returned in the list. If the timestamp is null it will be not consider.
	 * @return List of StreetBean fond
	 */
	public List<StreetBean> getAllStreets(RateAreaBean ab, Long timestamp) {
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<StreetBean> result = new ArrayList<StreetBean>();

		if (area.getStreets() != null) {
			for (Street tmp : area.getStreets()) {
				StreetBean s = ModelConverter.convert(tmp, StreetBean.class);
				s.setRateAreaId(ab.getId());
				s.setColor(area.getColor());
				if(timestamp == null){
					result.add(s);
				} else {
					if(s.getLastChange() != null && s.getLastChange() >= timestamp){
						result.add(s);
					} else {
						logger.info("No street found in the specific timestamp");
					}
				}
			}
		}
		return result;
	}
	
	/**
	 * Method getAllStreet(zone filter)
	 * @param z: zone where search the streets
	 * @param timestamp: time of last change. If a street was updated between now and this timestamp
	 * it will be returned in the list. If the timestamp is null it will be not consider.
	 * @return List of StreetBean fond
	 */
	public List<StreetBean> getAllStreets(ZoneBean z, Long timestamp) {
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
							if(timestamp == null){
								result.add(s);
							} else {
								if(s.getLastChange() >= timestamp){
									result.add(s);
								} else {
									logger.info("No street found in the specific timestamp");
								}
							}		
						}
					}
				}
			}
		}
		return result;
	}
	
	/**
	 * Method getAllStreets(filter by rateArea and zone)
	 * @param ab: rateArea where find the streets
	 * @param z: zone where find the streets
	 * @return List of StreetBean in the specific area and zone
	 */
	public List<StreetBean> getAllStreets(RateAreaBean ab, ZoneBean z, Long timestamp) {
		//RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<StreetBean> result = new ArrayList<StreetBean>();
		
		if (area.getStreets() != null) {
			for (Street tmp : area.getStreets()) {
				List<Zone> zones = tmp.getZones();
				StreetBean s = ModelConverter.convert(tmp, StreetBean.class);
				for(Zone zona : zones){
					if((zona.getId().compareTo(z.getId()) == 0) && (zona.getId_app().compareTo(z.getId_app()) == 0)){
						s.setColor(z.getColor());
						if(timestamp == null){
							result.add(s);
						} else {
							if(s.getLastChange() >= timestamp){
								result.add(s);
							} else {
								logger.info("No street found in the specific timestamp");
							}
						}
					}
				}
			}
		}
		return result;
	}

	public StreetBean findStreet(String parkingMeterId, Long timestamp) {
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		Street s = new Street();
		for (RateArea area : aree) {
			if (area.getStreets() != null) {
				s.setId(parkingMeterId);
				int index = area.getStreets().indexOf(s);
				if (index != -1) {
					Street st = area.getStreets().get(index);
					if(timestamp == null){
						StreetBean result = ModelConverter.toStreetBean(area, st);
						return result;
					} else {
						if(st.getLastChange() != null && st.getLastChange() >= timestamp){
							StreetBean result = ModelConverter.toStreetBean(area, st);
							return result;
						}
					}
				}
			}
		}
		return null;
	}
	
	public List<StreetBean> findStreetByName(String referencedStreet, Long timestamp) {
		List<StreetBean> result = new ArrayList<StreetBean>();
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		for (RateArea area : aree) {
			if (area.getStreets() != null) {
				List<Street> streets = area.getStreets();
				for(Street street : streets){
					if(street.getStreetReference().compareTo(referencedStreet) == 0){
						if(street.getLastChange() != null && street.getLastChange() >= timestamp){
							StreetBean s = ModelConverter.toStreetBean(area, street);
							logger.info(String.format("Street found: %s", s.toString() ));
							result.add(s);
						}
					}
				}
			}
		}
		return result;
	}
	
	public StreetBean editStreet(StreetBean vb, Long timestamp) throws DatabaseException {
		RateArea area = mongodb.findById(vb.getRateAreaId(), RateArea.class);
		if (area.getStreets() != null) {
			for (Street temp : area.getStreets()) {
				if (temp.getId().equals(vb.getId())) {
//					temp.setSlotNumber(vb.getSlotNumber());
//					temp.setFreeParkSlotNumber(vb.getFreeParkSlotNumber());
//					temp.setFreeParkSlotSignNumber(vb.getFreeParkSlotSignNumber());
//					temp.setUnusuableSlotNumber(vb.getUnusuableSlotNumber());
//					temp.setHandicappedSlotNumber(vb.getHandicappedSlotNumber());
//					temp.setStreetReference(vb.getStreetReference());
//					temp.setTimedParkSlotNumber(vb.getTimedParkSlotNumber());
//					temp.setSubscritionAllowedPark(vb.isSubscritionAllowedPark());
//					temp.getGeometry().getPoints().clear();
//					for (PointBean pb : vb.getGeometry().getPoints()) {
//						temp.getGeometry().getPoints().add(ModelConverter.convert(pb, Point.class));
//					}
//					temp.setZones(vb.getZoneBeanToZone());
					// Dynamic data
					temp.setFreeParkSlotOccupied(vb.getFreeParkSlotOccupied());
					temp.setFreeParkSlotSignOccupied(vb.getFreeParkSlotSignOccupied());
					temp.setHandicappedSlotOccupied(vb.getHandicappedSlotOccupied());
					temp.setTimedParkSlotOccupied(vb.getTimedParkSlotOccupied());
					temp.setPaidSlotOccupied(vb.getPaidSlotOccupied());
					temp.setLastChange(timestamp);
					
					mongodb.save(area);
					break;
				}
			}
		}
		return vb;
	}

	// BikePoint Methods
	public List<BikePointBean> getAllBikePoints(Long timestamp) {
		List<BikePointBean> result = new ArrayList<BikePointBean>();
		for (BikePoint bp : mongodb.findAll(BikePoint.class)) {
			if(timestamp == null){
				result.add(ModelConverter.convert(bp, BikePointBean.class));
			} else {
				if(bp.getLastChange() != null && bp.getLastChange() >= timestamp){
					result.add(ModelConverter.convert(bp, BikePointBean.class));
				}
			}
		}
		return result;
	}
	
	public BikePointBean editBikePoint(BikePointBean pb, Long timestamp)
			throws NotFoundException {
		BikePoint bici = findById(pb.getId(), BikePoint.class);
//		bici.setName(pb.getName());
//		bici.getGeometry().setLat(pb.getGeometry().getLat());
//		bici.getGeometry().setLng(pb.getGeometry().getLng());
		// Dynamic Data
		bici.setSlotNumber(pb.getSlotNumber());
		bici.setBikeNumber(pb.getBikeNumber());
		bici.setLastChange(timestamp);
		mongodb.save(bici);
		return pb;
	}

	// ParkingStructure Methods
	public List<ParkingStructureBean> getAllParkingStructure(Long timestamp) {
		List<ParkingStructureBean> result = new ArrayList<ParkingStructureBean>();
		for (ParkingStructure entity : mongodb.findAll(ParkingStructure.class)) {
			if(timestamp == null){
				result.add(ModelConverter.convert(entity, ParkingStructureBean.class));
			} else {
				if(entity.getLastChange() != null && entity.getLastChange() >= timestamp){
					result.add(ModelConverter.convert(entity, ParkingStructureBean.class));
				}
			}
		}	
		return result;
	}

	public ParkingStructureBean editParkingStructure(ParkingStructureBean entityBean, 
			Long timestamp) throws NotFoundException {
		ParkingStructure entity = findById(entityBean.getId(),ParkingStructure.class);
//		entity.setFee(entityBean.getFee());
//		entity.setManagementMode(entityBean.getManagementMode());
//		entity.setName(entityBean.getName());
//		entity.setPaymentMode(ModelConverter.toPaymentMode(entityBean.getPaymentMode()));
//		entity.setPhoneNumber(entityBean.getPhoneNumber());
//		entity.setSlotNumber(entityBean.getSlotNumber());
//		entity.setStreetReference(entityBean.getStreetReference());
//		entity.setTimeSlot(entityBean.getTimeSlot());
//		entity.getGeometry().setLat(entityBean.getGeometry().getLat());
//		entity.getGeometry().setLng(entityBean.getGeometry().getLng());
		
		// Dynamic data
		entity.setSlotOccupied(entityBean.getSlotOccupied());
		entity.setHandicappedSlotOccupied(entityBean.getHandicappedSlotOccupied());
		entity.setUnusuableSlotNumber(entityBean.getHandicappedSlotNumber());
		entity.setLastChange(timestamp);
		
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
