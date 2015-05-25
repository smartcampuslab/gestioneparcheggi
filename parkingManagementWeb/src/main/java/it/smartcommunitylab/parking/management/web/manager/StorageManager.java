/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package it.smartcommunitylab.parking.management.web.manager;

import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
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
import it.smartcommunitylab.parking.management.web.model.geo.Line;
import it.smartcommunitylab.parking.management.web.model.geo.Point;
import it.smartcommunitylab.parking.management.web.model.geo.Polygon;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service("storageManager")
public class StorageManager {

	private static final Logger logger = Logger.getLogger(StorageManager.class);

	@Autowired
	private MongoTemplate mongodb;

	private String appId = "";
	
	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
		System.out.println("Manager App id = " + this.appId);
	}

	// RateArea Methods
	public RateAreaBean save(RateAreaBean a) {
		RateArea area = ModelConverter.convert(a, RateArea.class);
		area = processId(area, RateArea.class);
		area.setId_app(appId);
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

	public List<RateAreaBean> getAllArea() {
		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
		//logger.error(String.format("Area app id: %s", appId));
		for (RateArea a : mongodb.findAll(RateArea.class)) {
			if(a != null && a.getId_app().compareTo(appId) == 0){
				result.add(ModelConverter.convert(a, RateAreaBean.class));
			}
		}
		return result;
	}
	
	public RateAreaBean getAreaById(String areaId) {
		RateArea a = mongodb.findById(areaId, RateArea.class);
		RateAreaBean ra = ModelConverter.convert(a, RateAreaBean.class);
		return ra;
	}
	
	public boolean removeArea(String areaId) {
		Criteria crit = new Criteria();
		crit.and("id").is(areaId);
		
		RateAreaBean ra = getAreaById(areaId);
		
		// Here I save the dataLog of the streets removing
		for(StreetBean sb : getAllStreets(ra)){
			DataLogBean dl = new DataLogBean();
			dl.setObjId("@" + sb.getId_app() + "@street@" + sb.getId());
			dl.setType("street");
			//dl.setVersion(getLastVersion(dl.getObjId()));
			dl.setTime(System.currentTimeMillis());
			dl.setAuthor("999");
			dl.setDeleted(true);
			mongodb.save(dl);
		}
		
		mongodb.remove(Query.query(crit), RateArea.class);
		
		return true;
	}

	// ParkingMeter Methods
	public List<ParkingMeterBean> getAllParkingMeters() {
		List<ParkingMeterBean> result = new ArrayList<ParkingMeterBean>();

		for (RateAreaBean temp : getAllArea()) {
			if(temp != null && temp.getId_app().compareTo(appId) == 0){
				result.addAll(getAllParkingMeters(temp));
			}
		}

		return result;
	}

	public List<ParkingMeterBean> getAllParkingMeters(RateAreaBean ab) {
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<ParkingMeterBean> result = new ArrayList<ParkingMeterBean>();

		if (area.getParkingMeters() != null) {
			for (ParkingMeter tmp : area.getParkingMeters()) {
				if(tmp.getId_app() != null && tmp.getId_app().compareTo(appId) == 0){
				ParkingMeterBean p = ModelConverter.convert(tmp,
						ParkingMeterBean.class);
					p.setAreaId(ab.getId());
					p.setColor(area.getColor());
					result.add(p);
				}
			}
		}
		return result;
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
	
	/**
	 * Method findParkingMeterByCode: used to find a ParkingMeterBean object using the code
	 * @param code: code of the parkingMeter to find
	 * @return ParkingMeterBean object found;
	 */
	public ParkingMeterBean findParkingMeterByCode(Integer code) {
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		for (RateArea area : aree) {
			if (area.getParkingMeters() != null) {
				for(ParkingMeter pm : area.getParkingMeters()){
					if(pm.getCode().compareTo(code) == 0){
						ParkingMeterBean result = ModelConverter.convert(pm, ParkingMeterBean.class);
						result.setAreaId(area.getId());
						return result;
					}
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
		parcometro.setId_app(appId);
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

	// Street Methods
	public List<StreetBean> getAllStreets() {
		List<StreetBean> result = new ArrayList<StreetBean>();
		//logger.error("I am in GET ALL STREETS");
		for (RateAreaBean temp : getAllArea()) {
			if(temp != null && temp.getId_app().compareTo(appId) == 0){
				result.addAll(getAllStreets(temp));
			}
		}

		return result;
	}

	/**
	 * Method getAllStreets(filter by rateArea)
	 * @param ab: rateArea where find the streets
	 * @return List of StreetBean in the specific area
	 */
	public List<StreetBean> getAllStreets(RateAreaBean ab) {
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<StreetBean> result = new ArrayList<StreetBean>();

		if (area.getStreets() != null) {
			for (Street tmp : area.getStreets()) {
				if(tmp != null && tmp.getId_app().compareTo(appId) == 0){
					StreetBean s = ModelConverter.toStreetBean(area, tmp);
					//StreetBean s = ModelConverter.convert(tmp, StreetBean.class);
					s.setRateAreaId(ab.getId());
					s.setColor(area.getColor());
					result.add(s);
				}
			}
		}
		return result;
	}
	
	/**
	 * Method getAllStreets(filter by zone)
	 * @param z: zone where find the streets
	 * @return List of StreetBean in the specific zone
	 */
	public List<StreetBean> getAllStreets(ZoneBean z) {
		//RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<RateArea> areas = mongodb.findAll(RateArea.class);
		//List<Zone> zones = mongodb.findAll(Zone.class);
		List<StreetBean> result = new ArrayList<StreetBean>();
		
		for(RateArea area : areas){
			if (area.getStreets() != null) {
				for (Street tmp : area.getStreets()) {
					if(tmp != null && tmp.getId_app().compareTo(appId) == 0){
						List<String> myZones = tmp.getZones();
						StreetBean s = ModelConverter.toStreetBean(area, tmp);
						//StreetBean s = ModelConverter.convert(tmp, StreetBean.class);
						for(String zone : myZones){
							if((zone.compareTo(z.getId()) == 0) && (tmp.getId_app().compareTo(z.getId_app()) == 0)){
								s.setColor(z.getColor());
								result.add(s);
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
	public List<StreetBean> getAllStreets(RateAreaBean ab, ZoneBean z) {
		//RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<StreetBean> result = new ArrayList<StreetBean>();
		
		if (area.getStreets() != null) {
			for (Street tmp : area.getStreets()) {
				if(tmp != null && tmp.getId_app().compareTo(appId) == 0){
					List<String> zones = tmp.getZones();
					StreetBean s = ModelConverter.convert(tmp, StreetBean.class);
					for(String zona : zones){
						if((zona.compareTo(z.getId()) == 0) && (tmp.getId_app().compareTo(z.getId_app()) == 0)){
							s.setColor(z.getColor());
							result.add(s);
						}
					}
				}
			}
		}
		return result;
	}

	public StreetBean findStreet(String parkingMeterId) {
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		Street s = new Street();
		for (RateArea area : aree) {
			if (area.getStreets() != null) {
				s.setId(parkingMeterId);
				int index = area.getStreets().indexOf(s);
				if (index != -1) {
					Street st = area.getStreets().get(index);
					StreetBean result = ModelConverter.toStreetBean(area, st);
					//StreetBean result = ModelConverter.convert(area.getStreets().get(index), StreetBean.class);
					//result.setRateAreaId(area.getId());
					return result;
				}
			}
		}
		return null;
	}
	
	/**
	 * Method findStreetByName: find a list of street with the specific street reference
	 * @param referencedStreet: name of the street referenced
	 * @return List of street found
	 */
	public List<StreetBean> findStreetByName(String referencedStreet) {
		List<StreetBean> result = new ArrayList<StreetBean>();
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		for (RateArea area : aree) {
			if (area.getStreets() != null) {
				List<Street> streets = area.getStreets();
				for(Street street : streets){
					if(street.getStreetReference().compareToIgnoreCase(referencedStreet) == 0){
						//StreetBean s = ModelConverter.convert(street, StreetBean.class);
						StreetBean s = ModelConverter.toStreetBean(area, street);
						logger.info(String.format("Street found: %s", s.toString() ));
						result.add(s);
					}
				}
			}
		}
		return result;
	}

	public StreetBean editStreet(StreetBean sb) throws DatabaseException {
		RateArea area = mongodb.findById(sb.getRateAreaId(), RateArea.class);
		boolean founded = false;
		if (area.getStreets() != null) {
			for (Street temp : area.getStreets()) {
				if (temp.getId().equals(sb.getId())) {
					List<Point> points = new ArrayList<Point>();
					Line line = new Line();
					temp.setSlotNumber(sb.getSlotNumber());
					temp.setFreeParkSlotNumber(sb.getFreeParkSlotNumber());
					temp.setFreeParkSlotSignNumber(sb.getFreeParkSlotSignNumber());
					temp.setUnusuableSlotNumber(sb.getUnusuableSlotNumber());
					temp.setHandicappedSlotNumber(sb.getHandicappedSlotNumber());
					temp.setReservedSlotNumber(sb.getReservedSlotNumber());
					temp.setStreetReference(sb.getStreetReference());
					temp.setTimedParkSlotNumber(sb.getTimedParkSlotNumber());
					temp.setSubscritionAllowedPark(sb.isSubscritionAllowedPark());
					if(temp.getGeometry() != null && temp.getGeometry().getPoints() != null && temp.getGeometry().getPoints().size() > 0){
						temp.getGeometry().getPoints().clear();
					}
					if(sb.getGeometry() != null){
						for (PointBean pb : sb.getGeometry().getPoints()) {
							points.add(ModelConverter.convert(pb, Point.class));
							//temp.getGeometry().getPoints().add(ModelConverter.convert(pb, Point.class));
						}
					}
					line.setPoints(points);
					temp.setGeometry(line);
					temp.setZones(sb.getZones());
					temp.setParkingMeters(sb.getParkingMeters());
					temp.setRateAreaId(sb.getRateAreaId());
					mongodb.save(area);
					founded = true;
					break;
				}
			}
		}

		if (!founded) {
			StreetBean todel = findStreet(sb.getId());
			if (todel != null) {
				removeStreet(todel.getRateAreaId(), sb.getId());
			}
			sb = save(sb);
		}

		return sb;
	}

	public boolean removeStreet(String areaId, String streetId) {
		RateArea area = mongodb.findById(areaId, RateArea.class);
		//Street s = new Street();
		//s.setId(streetId);
		Street s = ModelConverter.convert(findStreet(streetId), Street.class);
		boolean result = area.getStreets() != null && area.getStreets().remove(s);
		if (result) {
			mongodb.save(area);
			logger.info(String.format("Success removing via %s of area %s", streetId, areaId));
			DataLogBean dl = new DataLogBean();
			dl.setObjId("@" + area.getId_app() + "@street@" + streetId);
			dl.setType("street");
			dl.setTime(System.currentTimeMillis());
			dl.setAuthor("999");
			//if(s.getGeometry() != null){
			//	dl.setLocation(s.getGeometry().getPointBeans().get(0));	// I get the first element of the line
			//}
			//dl.setVersion(getLastVersion(dl.getObjId()));
			dl.setDeleted(true);
			mongodb.save(dl);
		} else {
			logger.warn(String.format("Failure removing via %s of area %s", streetId, areaId));
		}

		return result;
	}

	public StreetBean save(StreetBean s) throws DatabaseException {
		Street street = ModelConverter.convert(s, Street.class);
		street = processId(street, Street.class);
		street.setZones(s.getZones());
		street.setParkingMeters(s.getParkingMeters());
		street.setId_app(appId);
		try {
			RateArea area = findById(s.getRateAreaId(), RateArea.class);
			if (area.getStreets() == null) {
				area.setStreets(new ArrayList<Street>());
			}
			// TODO check if via is already present
			area.getStreets().add(processId(street, Street.class));
			mongodb.save(area);
			s.setId(street.getId());
			
			DataLogBean dl = new DataLogBean();
			dl.setObjId("@" + s.getId_app() + "@street@" + s.getId());
			dl.setType("street");
			//dl.setVersion(new Integer(1));
			dl.setTime(System.currentTimeMillis());
			dl.setAuthor("999");
			//if(street.getGeometry() != null && street.getGeometry().getPointBeans().size() > 0){
			//	dl.setLocation(street.getGeometry().getPointBeans().get(0));	// I get the first element of the line
			//}
			dl.setDeleted(false);
			@SuppressWarnings("unchecked")
			Map<String,Object> map = ModelConverter.convert(s, Map.class);
			dl.setValue(map);
			mongodb.save(dl);
			
			return s;
		} catch (NotFoundException e) {
			logger.error("Exception saving via, relative area not found");
			throw new DatabaseException();
		}
	}

	// BikePoint Methods
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
	
	public boolean removeBikePoint(String puntobiciId) {
		Criteria crit = new Criteria();
		crit.and("id").is(puntobiciId);
		
		BikePoint bp = mongodb.findById(puntobiciId, BikePoint.class);
		DataLogBean dl = new DataLogBean();
		dl.setObjId("@" + bp.getId_app() + "@bikePoint@" + puntobiciId);
		dl.setType("bikePoint");
		dl.setTime(System.currentTimeMillis());
		dl.setAuthor("999");
		//dl.setVersion(getLastVersion(dl.getObjId()));
		dl.setDeleted(true);
		mongodb.save(dl);
		
		mongodb.remove(Query.query(crit), BikePoint.class);
		return true;
	}

	public BikePointBean save(BikePointBean bp) {
		BikePoint puntoBici = ModelConverter.convert(bp, BikePoint.class);
		puntoBici = processId(puntoBici, BikePoint.class);
		puntoBici.setId_app(appId);
		mongodb.save(puntoBici);
		bp.setId(puntoBici.getId());
		
		DataLogBean dl = new DataLogBean();
		dl.setObjId("@" + bp.getId_app() + "@bikePoint@" + bp.getId());
		dl.setType("bikePoint");
		//dl.setVersion(new Integer(1));
		dl.setTime(System.currentTimeMillis());
		dl.setAuthor("999");
		//if(bp.getGeometry() != null){
		//	PointBean point = new PointBean();
		//	point.setLat(bp.getGeometry().getLat());
		//	point.setLng(bp.getGeometry().getLng());
		//	dl.setLocation(point);
		//}
		dl.setDeleted(false);
		@SuppressWarnings("unchecked")
		Map<String,Object> map = ModelConverter.convert(bp, Map.class);
		dl.setValue(map);
		mongodb.save(dl);
		
		return bp;
	}

	public List<BikePointBean> getAllBikePoints() {
		List<BikePointBean> result = new ArrayList<BikePointBean>();
		for (BikePoint bp : mongodb.findAll(BikePoint.class)) {
			if(bp != null && bp.getId_app().compareTo(appId) == 0){
			//logger.info(String.format("Bike point found : %s", pb.toString()));
				result.add(ModelConverter.convert(bp, BikePointBean.class));
			}
		}
		return result;
	}
	
	/**
	 * Method getBikePointsByName: return a list of BikePointBean having a specific name
	 * @param name: name of the BikePoints to find;
	 * @return List of BikePointBean found;
	 */
	public List<BikePointBean> getBikePointsByName(String name) {
		List<BikePointBean> result = new ArrayList<BikePointBean>();
		for (BikePoint bp : mongodb.findAll(BikePoint.class)) {
			if(bp != null && bp.getId_app().compareTo(appId) == 0){
				if(bp.getName().compareToIgnoreCase(name) == 0){
					result.add(ModelConverter.convert(bp, BikePointBean.class));
				}
			}
		}
		return result;
	}

	// ParkingStructure Methods
	public boolean removeParkingStructure(String id) {
		Criteria crit = new Criteria();
		crit.and("id").is(id);
		
		ParkingStructure ps = mongodb.findById(id, ParkingStructure.class);
		DataLogBean dl = new DataLogBean();
		dl.setObjId("@" + ps.getId_app() + "@parkingStructure@" + id);
		dl.setType("parkingStructure");
		dl.setTime(System.currentTimeMillis());
		dl.setAuthor("999");
		//dl.setVersion(getLastVersion(dl.getObjId()));
		dl.setDeleted(true);
		mongodb.save(dl);
		
		mongodb.remove(Query.query(crit), ParkingStructure.class);
		return true;
	}

	public ParkingStructureBean save(ParkingStructureBean entityBean) {
		ParkingStructure entity = ModelConverter.convert(entityBean,
				ParkingStructure.class);
		entity = processId(entity, ParkingStructure.class);
		entity.setId_app(appId);
		mongodb.save(entity);
		entityBean.setId(entity.getId());
		
		DataLogBean dl = new DataLogBean();
		dl.setObjId("@" + entity.getId_app() + "@parkingStructure@" + entity.getId());
		dl.setType("parkingStructure");
		//dl.setVersion(new Integer(1));
		dl.setTime(System.currentTimeMillis());
		dl.setAuthor("999");
		//if(entity.getGeometry() != null){
		//	PointBean point = new PointBean();
		//	point.setLat(entity.getGeometry().getLat());
		//	point.setLng(entity.getGeometry().getLng());
		//	dl.setLocation(point);
		//}
		dl.setDeleted(false);
		@SuppressWarnings("unchecked")
		Map<String,Object> map = ModelConverter.convert(entity, Map.class);
		dl.setValue(map);
		mongodb.save(dl);
		
		return entityBean;
	}

	public List<ParkingStructureBean> getAllParkingStructure() {
		List<ParkingStructureBean> result = new ArrayList<ParkingStructureBean>();
		for (ParkingStructure entity : mongodb.findAll(ParkingStructure.class)) {
			if(entity != null && entity.getId_app().compareTo(appId) == 0){
				result.add(ModelConverter.convert(entity, ParkingStructureBean.class));
			}
		}
		return result;
	}
	
	public ParkingStructureBean findParkingStructure(
			String id) throws NotFoundException {
		ParkingStructure entity = findById(id,ParkingStructure.class);
		ParkingStructureBean ps = null;
		if(entity != null){
			ps = ModelConverter.convert(entity, ParkingStructureBean.class);
		}
		return ps;
	}
	
	/**
	 * Method getParkingStructureByName: used to find a ParkingStructure given a specific name
	 * @param name: name of the structure to find
	 * @return List of ParkingStructureBean with the specific name
	 */
	public List<ParkingStructureBean> getParkingStructureByName(String name) {
		List<ParkingStructureBean> result = new ArrayList<ParkingStructureBean>();
		for (ParkingStructure entity : mongodb.findAll(ParkingStructure.class)) {
			if(entity != null && entity.getId_app().compareTo(appId) == 0){
				if(entity.getName().compareToIgnoreCase(name) == 0){
					result.add(ModelConverter.convert(entity, ParkingStructureBean.class));
				}
			}
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
		entity.setPaymentMode(ModelConverter.toPaymentMode(entityBean.getPaymentMode()));
		entity.setPhoneNumber(entityBean.getPhoneNumber());
		entity.setSlotNumber(entityBean.getSlotNumber());
		entity.setHandicappedSlotNumber(entityBean.getHandicappedSlotNumber());
		entity.setUnusuableSlotNumber(entityBean.getUnusuableSlotNumber());
		entity.setStreetReference(entityBean.getStreetReference());
		entity.setTimeSlot(entityBean.getTimeSlot());

		entity.getGeometry().setLat(entityBean.getGeometry().getLat());
		entity.getGeometry().setLng(entityBean.getGeometry().getLng());
		mongodb.save(entity);
		return entityBean;
	}
	
	// Zone Methods
	public ZoneBean save(ZoneBean z) {
		Zone zona = ModelConverter.convert(z, Zone.class);
		zona = processId(zona, Zone.class);
		zona.setId_app(appId);
		mongodb.save(zona);
		z.setId(zona.getId());
		return z;
	}

	public List<ZoneBean> getAllZone() {
		List<ZoneBean> result = new ArrayList<ZoneBean>();
		for (Zone z : mongodb.findAll(Zone.class)) {
			if(z != null && z.getId_app().compareTo(appId) == 0){
				result.add(ModelConverter.convert(z, ZoneBean.class));
			}
		}
		return result;
	}
	/**
	 * Method getZoneByName: get a list of zone having a specific name
	 * @param name: name of the zone to search
	 * @return List of ZoneBean found
	 */
	public List<ZoneBean> getZoneByName(String name) {
		List<ZoneBean> result = new ArrayList<ZoneBean>();
		for (Zone z : mongodb.findAll(Zone.class)) {
			if(z != null && z.getId_app().compareTo(appId) == 0){
				if(z.getName().compareToIgnoreCase(name) == 0){
					result.add(ModelConverter.convert(z, ZoneBean.class));
				}
			}
		}	
		return result;
	}

	public ZoneBean editZone(ZoneBean z) throws NotFoundException {
		Zone zona = findById(z.getId(), Zone.class);
		zona.setName(z.getName());
		zona.setColor(z.getColor());
		zona.setType(z.getType());
		zona.setNote(z.getNote());
		if(z.getGeometry()!= null && z.getGeometry().getPoints() != null && z.getGeometry().getPoints().size() > 0){
			if(zona.getGeometry() != null && zona.getGeometry().getPoints() != null && zona.getGeometry().getPoints().size() > 0){
				zona.getGeometry().getPoints().clear();
				for (PointBean pb : z.getGeometry().getPoints()) {
					zona.getGeometry().getPoints()
							.add(ModelConverter.convert(pb, Point.class));
				}	
			} else {
				Polygon geo = new Polygon();
				List<Point> points = new ArrayList<Point>();
				for (PointBean pb : z.getGeometry().getPoints()) {
					points.add(ModelConverter.convert(pb, Point.class));
				}
				geo.setPoints(points);
				zona.setGeometry(geo);
			}
		}
		mongodb.save(zona);
		return z;
	}

	public boolean removeZone(String zonaId) {
		Criteria crit = new Criteria();
		crit.and("id").is(zonaId);
		
		ZoneBean z = ModelConverter.convert(mongodb.findById(zonaId, Zone.class), ZoneBean.class);
		
		List<StreetBean> streets = getAllStreets(z);
		for(StreetBean s : streets){
			List<String> zones = s.getZones();
//			for(String zb : zones){
//				logger.info(String.format("Finded zona: %s", zb));
//				if(zb.compareTo(zonaId) == 0){
//					logger.info(String.format("Try to remove zona: %s", zb));
//					zones.remove(zb);
//				}
//			}
			for (Iterator<String> iterator = zones.iterator(); iterator.hasNext(); ) {
			    String value = iterator.next();
			    if(value.compareTo(zonaId) == 0){
			    	logger.info(String.format("Finded zona: %s", value));
			    	iterator.remove();
			    	try {
						editStreet(s);
					} catch (DatabaseException e) {
						// TODO Auto-generated catch block
						logger.error(String.format("Error in update street: %s", e.getMessage()));
					}
			    }
			}
		}
		
		mongodb.remove(Query.query(crit), Zone.class);
		return true;
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
	
	@SuppressWarnings("unused")
	private Integer getLastVersion(String objId){
		Integer version = new Integer(0);
		Query q = new Query();
		q.addCriteria(Criteria.where("objId").is(objId));
		q.sort().on("updateTime", Order.DESCENDING);
		//q.with(new Sort(Sort.Direction.DESC, "updateTime"));
		List<DataLogBean> result = mongodb.find(q, it.smartcommunitylab.parking.management.web.bean.DataLogBean.class);
		if(result != null && result.size() > 0){
			//version = result.get(0).getVersion();
			//logger.info(String.format("Version finded: %d", version ));
		}
		return version;
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
