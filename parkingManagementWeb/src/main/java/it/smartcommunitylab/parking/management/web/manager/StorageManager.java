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

import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.PointBean;
import it.smartcommunitylab.parking.management.web.bean.PolygonBean;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.RatePeriodBean;
import it.smartcommunitylab.parking.management.web.bean.SimpleParkingMeter;
import it.smartcommunitylab.parking.management.web.bean.SimpleRateArea;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.VehicleSlotBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.converter.ModelConverter;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.model.Agency;
import it.smartcommunitylab.parking.management.web.model.BikePoint;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.RatePeriod;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.Zone;
import it.smartcommunitylab.parking.management.web.model.geo.Line;
import it.smartcommunitylab.parking.management.web.model.geo.Point;
import it.smartcommunitylab.parking.management.web.model.geo.Polygon;
import it.smartcommunitylab.parking.management.web.utils.AgencyDataSetup;

import java.security.AccessControlException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Multimap;

@Service("storageManager")
public class StorageManager {

	private static final Logger logger = Logger.getLogger(StorageManager.class);
	private static final int READ_VAL = 1;
	private static final int UPDATE_VAL = 2;
	private static final int CREATE_REM_VAL = 3;

	@Autowired
	private MongoTemplate mongodb;
	
	@Autowired
	private AgencyDataSetup agencyDataSetup;

	// RateArea Methods
	public RateAreaBean save(RateAreaBean a, String appId, String agencyId, String username) {
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getArea() >= CREATE_REM_VAL){
			RateArea area = ModelConverter.convert(a, RateArea.class);
			area = processId(area, RateArea.class);
			area.setId_app(appId);
			mongodb.save(area);
			logger.info("Rate area " + area.getId() + " created by user " + username);
			a.setId(area.getId());
		} else {
			throw new AccessControlException("no create permission for area object");
		}
		return a;
	}

	/*public RateAreaBean editArea(RateAreaBean a, String appId) throws NotFoundException {
		RateArea area = findById(a.getId(), RateArea.class);
		area.setName(a.getName());
		area.setColor(a.getColor());
		if(a.getNote() != null){
			area.setNote(a.getNote());
		}
		if(a.getSmsCode() != null){
			area.setSmsCode(a.getSmsCode());
		}
		if(a.getValidityPeriod() != null){
			if(area.getValidityPeriod() != null){
				area.getValidityPeriod().clear();
			} else {
				area.setValidityPeriod(new ArrayList<RatePeriod>());
			}
		} else {
			area.setValidityPeriod(new ArrayList<RatePeriod>());
		}
		for (RatePeriodBean ratePeriod : a.getValidityPeriod()) {
			area.getValidityPeriod().add(
					ModelConverter.convert(ratePeriod, RatePeriod.class));
		}
		if (area.getGeometry() != null) {
			area.getGeometry().clear();
		} else {
			area.setGeometry(new ArrayList<Polygon>());
		}
		for (PolygonBean polygon : a.getGeometry()) {
			area.getGeometry().add(
					ModelConverter.convert(polygon, Polygon.class));
		}
		if(a.getZones()!= null)area.setZones(a.getZones());
		a.setAgencyId(area.getAgencyId());

		mongodb.save(area);
		return a;
	}*/
	
	public RateAreaBean editArea(RateAreaBean a, String appId, String agencyId, String username) throws NotFoundException {
		RateArea area = findById(a.getId(), RateArea.class);
		if(area.getAgencyId() != null && !area.getAgencyId().isEmpty()){
			if(area.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getArea() >= UPDATE_VAL){
					area.setName(a.getName());
					area.setColor(a.getColor());
					if(a.getNote() != null){
						area.setNote(a.getNote());
					}
					if(a.getSmsCode() != null){
						area.setSmsCode(a.getSmsCode());
					}
					if(a.getValidityPeriod() != null){
						if(area.getValidityPeriod() != null){
							area.getValidityPeriod().clear();
						} else {
							area.setValidityPeriod(new ArrayList<RatePeriod>());
						}
					} else {
						area.setValidityPeriod(new ArrayList<RatePeriod>());
					}
					for (RatePeriodBean ratePeriod : a.getValidityPeriod()) {
						area.getValidityPeriod().add(
								ModelConverter.convert(ratePeriod, RatePeriod.class));
					}
					if (area.getGeometry() != null) {
						area.getGeometry().clear();
					} else {
						area.setGeometry(new ArrayList<Polygon>());
					}
					for (PolygonBean polygon : a.getGeometry()) {
						area.getGeometry().add(
								ModelConverter.convert(polygon, Polygon.class));
					}
					if(a.getZones()!= null)area.setZones(a.getZones());
					//a.setAgencyId(area.getAgencyId());	Verify if it is usefull to uncomment or not

					mongodb.save(area);
					logger.info("Rate area " + area.getId() + " updated by user " + username);
				} else {
					throw new AccessControlException("no update permission for area object");
				}
			} else {
				throw new AccessControlException("no update permission for area object");
			}
		}
		return a;
	}

	public List<RateAreaBean> getAllArea(String appId) {
		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
		// logger.error(String.format("Area app id: %s", appId));

		List<RateArea> ras;
		if ("all".equals(appId)) {
			ras = mongodb.findAll(RateArea.class);
		} else {
			Criteria criteria = new Criteria("id_app").is(appId);
			Query query = new Query(criteria);
			ras = mongodb.find(query, RateArea.class);
		}

		for (RateArea a : ras) {
			result.add(ModelConverter.convert(a, RateAreaBean.class));
		}

		return result;
	}
	
	public List<RateAreaBean> getAllAreaByZoneId(String appId, String zoneId) {
		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
		// logger.error(String.format("Area app id: %s", appId));

		List<RateArea> ras;
		if ("all".equals(appId)) {
			Criteria criteria = new Criteria("zones").is(zoneId);
			Query query = new Query(criteria);
			ras = mongodb.find(query, RateArea.class);
		} else {
			Criteria criteria = new Criteria("id_app").is(appId).and("zones").is(zoneId);
			Query query = new Query(criteria);
			ras = mongodb.find(query, RateArea.class);
		}

		for (RateArea a : ras) {
			result.add(ModelConverter.convert(a, RateAreaBean.class));
		}

		return result;
	}	
	
//	public List<RateAreaBean> getAllAreaByAgencyId(String appId, String agencyId) {
//		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
//		Agency ag = agencyDataSetup.getAgencyById(agencyId);
//		if(ag == null || ag.getArea() >= READ_VAL){
//			Criteria crit = new Criteria();
//			crit.and("agencyId").is(agencyId);
//			for (RateArea a : mongodb.find(Query.query(crit), RateArea.class)) {
//				if(a != null && appId.compareTo("all") == 0){
//					result.add(ModelConverter.convert(a, RateAreaBean.class));
//				} else if(a != null && a.getId_app().compareTo(appId) == 0){
//					result.add(ModelConverter.convert(a, RateAreaBean.class));
//				}
//			}
//		} else {
//			throw new AccessControlException("no read permission for area object");
//		}
//		return result;
//	}	

	public List<RateAreaBean> getAllAreaByAgencyId(String appId, String agencyId) {
		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag == null || ag.getArea() >= READ_VAL){
			Criteria criteria = new Criteria("agencyId").is(agencyId);
			Query query = new Query(criteria);
			List<RateArea> ras = mongodb.find(query, RateArea.class);
			for (RateArea a : ras) {
				if ("all".equals(appId) || appId.equals( a.getId_app())) {
					result.add(ModelConverter.convert(a, RateAreaBean.class));
				}
			}
		} else {
			throw new AccessControlException("no read permission for area object");
		}
		return result;
	}
	
	public List<RateAreaBean> getAllAreaByAgencyAndZoneId(String appId, String agencyId, String zoneId) {
		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag == null || ag.getArea() >= READ_VAL){
			Criteria criteria = new Criteria("agencyId").is(agencyId).and("zones").is(zoneId);
			Query query = new Query(criteria);
			List<RateArea> ras = mongodb.find(query, RateArea.class);
			for (RateArea a : ras) {
				if ("all".equals(appId) || appId.equals( a.getId_app())) {
					result.add(ModelConverter.convert(a, RateAreaBean.class));
				}
			}
		} else {
			throw new AccessControlException("no read permission for area object");
		}
		return result;
	}	
	
	private RateArea getAreaObjectById(String areaId, String appId) {
		Criteria crit = new Criteria();
		crit.and("id_app").is(appId);
		crit.and("_id").is(new ObjectId(areaId));
		RateArea a = mongodb.findOne(Query.query(crit), RateArea.class);
		return a;
	}
	
	public RateAreaBean getAreaById(String areaId, String appId) {
		Criteria crit = new Criteria();
		crit.and("id_app").is(appId);
		crit.and("_id").is(new ObjectId(areaId));
		RateArea a = mongodb.findOne(Query.query(crit), RateArea.class);
		RateAreaBean ra = ModelConverter.convert(a, RateAreaBean.class);
		return ra;
	}
	
	/*public boolean removeArea(String areaId, String appId) {
		Criteria crit = new Criteria();
		crit.and("id").is(areaId);
		RateAreaBean ra = getAreaById(areaId, appId);
		// Here I save the dataLog of the streets removing
		for(StreetBean sb : getAllStreets(ra, appId)){
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
	}*/
	
	public boolean removeArea(String areaId, String appId, String agencyId, String username) {
		boolean result = false;
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getArea() >= CREATE_REM_VAL){
			Criteria crit = new Criteria();
			crit.and("id").is(areaId);
			RateAreaBean ra = getAreaById(areaId, appId);
			// Here I save the dataLog of the streets removing
			for(StreetBean sb : getAllStreets(ra, appId)){
				DataLogBean dl = new DataLogBean();
				dl.setObjId("@" + sb.getId_app() + "@street@" + sb.getId());
				dl.setType("street");
				dl.setTime(System.currentTimeMillis());
				dl.setAuthor("999");
				dl.setDeleted(true);
				mongodb.save(dl);
				result = true;
			}
			mongodb.remove(Query.query(crit), RateArea.class);
			logger.info("Rate area " + areaId + " deleted by user " + username);
		} else {
			throw new AccessControlException("no remove permission for area object");
		}
		return result;
	}

	// ParkMeter Methods
	public List<ParkingMeterBean> getAllParkingMeters(String appId) {
		List<ParkingMeterBean> result = new ArrayList<ParkingMeterBean>();
		for (RateAreaBean temp : getAllArea(appId)) {
			result.addAll(getAllParkingMeters(temp, appId));
		}
		return result;
	}
	
	public List<ParkingMeterBean> getAllParkingMetersByAgencyId(String appId, String agencyId) {
		List<ParkingMeterBean> result = new ArrayList<ParkingMeterBean>();
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getParkingmeter() >= READ_VAL){
			for (RateAreaBean temp : getAllAreaByAgencyId(appId, agencyId)) {
				result.addAll(getAllParkingMeters(temp, appId));
			}
		} else {
			throw new AccessControlException("no read permission for parkingmeter object");
		}
		return result;
	}

	// TODO
	public List<ParkingMeterBean> getAllParkingMeters(RateAreaBean ab, String appId) {
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<ParkingMeterBean> result = new ArrayList<ParkingMeterBean>();

		if (area.getParkingMeters() != null) {
			//for (ParkingMeter tmp : area.getParkingMeters()) {
			Map<String, ParkingMeter> pms = area.getParkingMeters();
			for (Map.Entry<String, ParkingMeter> entry : pms.entrySet())
			{
				ParkingMeter tmp = entry.getValue();
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
	
	// ???
	public List<ParkingMeterBean> getAllParkingMeters(String appId, String municipality) {
		List<ParkingMeterBean> result = new ArrayList<ParkingMeterBean>();
		//for (RateAreaBean temp : getAllArea(appId, municipality)) {
		for (RateAreaBean temp : getAllArea(appId)) {
			if(temp != null && temp.getId_app().compareTo(appId) == 0){
				result.addAll(getAllParkingMeters(temp, appId));
			}
		}
		return result;
	}
	
	public ParkingMeterBean findParkingMeter(String parcometroId, String appId) {
		String pId = "parkingMeters." + parcometroId;
		Criteria crit = new Criteria();
		crit.and("id_app").is(appId);
		crit.and(pId).exists(true);
		RateArea ra = mongodb.findOne(Query.query(crit), RateArea.class);
		Map<String, ParkingMeter> tempParkings = ra.getParkingMeters();
		ParkingMeter p = null;
		if(tempParkings != null && !tempParkings.isEmpty()){
			p = tempParkings.get(parcometroId);
		}
		if(p != null){
			ParkingMeterBean result = ModelConverter.convert(p, ParkingMeterBean.class);
			result.setAreaId(ra.getId());
			return result;
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
				//for(ParkingMeter pm : area.getParkingMeters()){
				Map<String, ParkingMeter> pms = area.getParkingMeters();
				for (Map.Entry<String, ParkingMeter> entry : pms.entrySet())
				{
					ParkingMeter pm = entry.getValue();	
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

	public boolean removeParkingMeter(String areaId, String parcometroId, String appId, String agencyId, String username) {
		RateArea area = getAreaObjectById(areaId, appId);	//mongodb.findById(areaId, RateArea.class);
		boolean result = false;
		if(area.getAgencyId() != null && !area.getAgencyId().isEmpty()){
			if(area.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getParkingmeter() >= UPDATE_VAL){
					result = area.getParkingMeters() != null
							&& (area.getParkingMeters().remove(parcometroId) != null);
					if (result) {
						mongodb.save(area);
						logger.debug(String.format(
								"Success removing parcometro %s of area %s", parcometroId,
								areaId));
						logger.info("Parking meter " + parcometroId + " deleted by user " + username);
					} else {
						logger.warn(String.format(
								"Failure removing parcometro %s of area %s", parcometroId,
								areaId));
					}
				} else {
					throw new AccessControlException("no delete permission for parkingmeter object");
				}
			} else {
				throw new AccessControlException("no delete permission for parkingmeter object");
			}
		}
		return result;
	}

	public ParkingMeterBean editParkingMeter(ParkingMeterBean pb, String appId, String agencyId, String username)
			throws DatabaseException {
		RateArea area = mongodb.findById(pb.getAreaId(), RateArea.class);
		boolean founded = false;
		if(area.getAgencyId() != null && !area.getAgencyId().isEmpty()){
			if(area.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getParkingmeter() >= UPDATE_VAL){
					if (area.getParkingMeters() != null) {
						ParkingMeter temp = area.getParkingMeters().get(pb.getId());
						if(temp != null){
							temp.setCode(pb.getCode());
							temp.setNote(pb.getNote());
							temp.setStatus(pb.getStatus());
							temp.getGeometry().setLat(pb.getGeometry().getLat());
							temp.getGeometry().setLng(pb.getGeometry().getLng());
							if(pb.getZones() != null) {
								temp.setZones(pb.getZones());
							}
							temp.setPaymentMethods(pb.getPaymentMethods());
							area.getParkingMeters().put(temp.getId(), temp);	// to update the object
							mongodb.save(area);
							founded = true;
							logger.info("Parking meter " + temp.getId() + " updated by user " + username);
						}
						/*for (ParkingMeter temp : area.getParkingMeters()) {
							if (temp.getId().equals(pb.getId())) {
								temp.setCode(pb.getCode());
								temp.setNote(pb.getNote());
								temp.setStatus(pb.getStatus());
								temp.getGeometry().setLat(pb.getGeometry().getLat());
								temp.getGeometry().setLng(pb.getGeometry().getLng());
								if(pb.getZones() != null)temp.setZones(pb.getZones());
								mongodb.save(area);
								founded = true;
								break;
							}
						}*/
					}
				} else {
					throw new AccessControlException("no update permission for parkingmeter object");
				}
			} else {
				throw new AccessControlException("no update permission for parkingmeter object");
			}
		}
		
		if (!founded) {
			ParkingMeterBean todel = findParkingMeter(pb.getId(), appId);
			if (todel != null) {
				removeParkingMeter(todel.getAreaId(), pb.getId(), appId, agencyId, username);
			}
			pb = save(pb, appId, agencyId, username);
		}
		return pb;
	}

	public ParkingMeterBean save(ParkingMeterBean p, String appId, String agencyId, String username) throws DatabaseException {
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getParkingmeter() >= UPDATE_VAL){
			ParkingMeter parcometro = ModelConverter.convert(p, ParkingMeter.class);
			parcometro = processId(parcometro, ParkingMeter.class);
			parcometro.setId_app(appId);
			try {
				RateArea area = findById(p.getAreaId(), RateArea.class);
				if(area.getAgencyId() != null && !area.getAgencyId().isEmpty()){
					if(area.getAgencyId().contains(agencyId)){
						if (area.getParkingMeters() == null) {
							area.setParkingMeters(new HashMap<String, ParkingMeter>());
						}
						if (parcometro.getAgencyId() == null) parcometro.setAgencyId(new LinkedList<>());
						if (!parcometro.getAgencyId().contains(agencyId)) parcometro.getAgencyId().add(agencyId);
						// TODO check if parcometro is already present
						//area.getParkingMeters().add(parcometro);
						area.getParkingMeters().put(parcometro.getId(), parcometro);
						mongodb.save(area);
						p.setId(parcometro.getId());
						logger.info("Parking meter " + p.getId() + " created by user " + username);
					} else {
						throw new AccessControlException("no create permission for parkingmeter object");
					}
				}
			} catch (NotFoundException e) {
				logger.error("Exception saving parcometro, relative area not found");
				throw new DatabaseException();
			}
		} else {
			throw new AccessControlException("no create permission for parkingmeter object");
		}
		return p;
	}
	
	
	public List<SimpleRateArea> getSimpleRateArea(String appId, List<String> agencyId, Double lat, Double lon, Double radius, Integer limit) {
		Criteria criteria = new Criteria("id_app").is(appId);
		if (agencyId != null) {
			criteria = criteria.and("agencyId").in(agencyId);
		}
		Query query = new Query(criteria);
		query.fields().include("parkingMeters");
		query.fields().include("validityPeriod");
		
		List<RateArea> ras = mongodb.find(query, RateArea.class);
		
		Multimap<Double, ParkingMeter> byDist = ArrayListMultimap.create();
		
		List<SimpleRateArea> sra = ras.stream().map(x -> new SimpleRateArea(x)).collect(Collectors.toList());
		ras.stream().flatMap(x -> x.getParkingMeters().values().stream())
				.forEach(y -> byDist.put(Math.sqrt(Math.pow(lat - y.getGeometry().getLat(), 2) + Math.pow(lon - y.getGeometry().getLng(), 2)), y));
		List<SimpleParkingMeter> spm = byDist.keySet().stream().sorted().flatMap(x -> byDist.get(x).stream()).limit(limit).map(y -> new SimpleParkingMeter(y)).collect(Collectors.toList());
		sra = sra.stream().filter(x -> {
			x.getParkingMeters().retainAll(spm);
			return !x.getParkingMeters().isEmpty();
		}).collect(Collectors.toList());
		
		return sra;
	}		
	
	
	
	

	// Street Methods
	public List<StreetBean> getAllStreets(String appId) {
		List<StreetBean> result = new ArrayList<StreetBean>();
		for (RateAreaBean temp : getAllArea(appId)) {
				result.addAll(getAllStreets(temp, appId));
		}

		return result;
	}
	
	// ???
	public List<StreetBean> getAllStreets(String appId, String municipality) {
		List<StreetBean> result = new ArrayList<StreetBean>();
		for (RateAreaBean temp : getAllArea(appId)) {	
			if(temp != null && appId.compareTo("all") == 0){
				result.addAll(getAllStreets(temp, "all"));
			} else if(temp != null && temp.getId_app().compareTo(appId) == 0){
				result.addAll(getAllStreets(temp, appId));
			}
		}
		return result;
	}

	/**
	 * Method getAllStreets(filter by rateArea)
	 * @param ab: rateArea where find the streets
	 * @return List of StreetBean in the specific area
	 */
	public List<StreetBean> getAllStreets(RateAreaBean ab, String appId) {
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<StreetBean> result = new ArrayList<StreetBean>();
		if (area.getStreets() != null) {
			//for (Street tmp : area.getStreets()) {
			Map<String, Street> streets = area.getStreets();
			for (Map.Entry<String, Street> entry : streets.entrySet())
			{
			    Street tmp = entry.getValue();
				if(tmp != null && appId.compareTo("all") == 0){
					StreetBean s = ModelConverter.toStreetBean(area, tmp);
					s.setRateAreaId(ab.getId());
					s.setColor(area.getColor());
					result.add(s);
				} else if(tmp != null && tmp.getId_app().compareTo(appId) == 0){
					StreetBean s = ModelConverter.toStreetBean(area, tmp);
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
	public List<StreetBean> getAllStreets(ZoneBean z, String appId) {
		//RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<RateArea> areas = mongodb.findAll(RateArea.class);
		List<StreetBean> result = new ArrayList<StreetBean>();
		
		for(RateArea area : areas){
			if (area.getStreets() != null) {
				//for (Street tmp : area.getStreets()) {
				Map<String, Street> streets = area.getStreets();
				for (Map.Entry<String, Street> entry : streets.entrySet())
				{
				    Street tmp = entry.getValue();
					if(tmp != null && tmp.getId_app().compareTo(appId) == 0){
						List<String> myZones = tmp.getZones();
						StreetBean s = ModelConverter.toStreetBean(area, tmp);
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
	public List<StreetBean> getAllStreets(RateAreaBean ab, ZoneBean z, String appId) {
		RateArea area = mongodb.findById(ab.getId(), RateArea.class);
		List<StreetBean> result = new ArrayList<StreetBean>();
		
		if (area.getStreets() != null) {
			//for (Street tmp : area.getStreets()) {
			Map<String, Street> streets = area.getStreets();
			for (Map.Entry<String, Street> entry : streets.entrySet())
			{
			    Street tmp = entry.getValue();
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
	
	public List<StreetBean> getAllStreetsByAgencyId(String appId, String agencyId) {
		List<StreetBean> result = new ArrayList<StreetBean>();
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag == null || ag.getStreet() >= READ_VAL){
			for (RateAreaBean temp : getAllAreaByAgencyId(appId, agencyId)) {
				if("all".equals(appId) || temp.getId_app().equals(appId)) {
					result.addAll(getAllStreets(temp, appId));
				}
			}
		} else {
			throw new AccessControlException("no read permission for street object");
		}	
		return result;
	}

	public StreetBean findStreet(String streetId, String appId) {
		String sId = "streets." + streetId;
		Criteria crit = new Criteria();
		crit.and("id_app").is(appId);
		crit.and(sId).exists(true);
		RateArea ra = mongodb.findOne(Query.query(crit), RateArea.class);
		Map<String, Street> tempStreets = ra.getStreets();
		Street s = null;
		if(tempStreets != null && !tempStreets.isEmpty()){
			s = tempStreets.get(streetId);
		}
		if(s != null){
			StreetBean result = ModelConverter.toStreetBean(ra, s);
			return result;
		}
		return null;
	}
	
	public StreetBean findStreet(String streetId) {
		String sId = "streets." + streetId;
		Criteria crit = new Criteria();
		crit.and(sId).exists(true);
		RateArea ra = mongodb.findOne(Query.query(crit), RateArea.class);
		
		Map<String, Street> tempStreets = ra.getStreets();
		Street s = null;
		if(tempStreets != null && !tempStreets.isEmpty()){
			s = tempStreets.get(streetId);
		}
		if(s != null){
			StreetBean result = ModelConverter.toStreetBean(ra, s);
			return result;
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
				//List<Street> streets = area.getStreets();
				Map<String, Street> streets = area.getStreets();
				for (Map.Entry<String, Street> entry : streets.entrySet())
				{
				    Street street = entry.getValue();
				    if(street.getStreetReference().compareToIgnoreCase(referencedStreet) == 0){
						StreetBean s = ModelConverter.toStreetBean(area, street);
						logger.info(String.format("Street found: %s", s.toString() ));
						result.add(s);
					}
				}
				/*for(Street street : streets){
					if(street.getStreetReference().compareToIgnoreCase(referencedStreet) == 0){
						StreetBean s = ModelConverter.toStreetBean(area, street);
						logger.info(String.format("Street found: %s", s.toString() ));
						result.add(s);
					}
				}*/
			}
		}
		return result;
	}

	public StreetBean editStreet(StreetBean sb, String appId, String agencyId, String username) throws DatabaseException {
		RateArea area = getAreaObjectById(sb.getRateAreaId(), appId);	//mongodb.findById(sb.getRateAreaId(), RateArea.class);
		boolean founded = false;
		if(area.getAgencyId() != null && !area.getAgencyId().isEmpty()){
			if(area.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getStreet() >= UPDATE_VAL){
					if(area.getStreets() != null){
						Street temp = area.getStreets().get(sb.getId());
						if(temp != null){
							List<Point> points = new ArrayList<Point>();
							Line line = new Line();
							temp.setSlotNumber(sb.getSlotNumber());
							/*temp.setFreeParkSlotNumber(sb.getFreeParkSlotNumber());
							temp.setFreeParkSlotSignNumber(sb.getFreeParkSlotSignNumber());
							temp.setUnusuableSlotNumber(sb.getUnusuableSlotNumber());
							temp.setHandicappedSlotNumber(sb.getHandicappedSlotNumber());
							temp.setReservedSlotNumber(sb.getReservedSlotNumber());
							temp.setPaidSlotNumber(sb.getPaidSlotNumber());
							temp.setTimedParkSlotNumber(sb.getTimedParkSlotNumber());*/
							List<VehicleSlotBean> editedSlotsConfBean = sb.getSlotsConfiguration();
							temp.setSlotsConfiguration(ModelConverter.toVehicleSlotList(editedSlotsConfBean, null));
							
							temp.setStreetReference(sb.getStreetReference());
							temp.setSubscritionAllowedPark(sb.isSubscritionAllowedPark());
							if(temp.getGeometry() != null && temp.getGeometry().getPoints() != null && temp.getGeometry().getPoints().size() > 0){
								temp.getGeometry().getPoints().clear();
							}
							if(sb.getGeometry() != null){
								for (PointBean pb : sb.getGeometry().getPoints()) {
									points.add(ModelConverter.convert(pb, Point.class));
								}
							}
							line.setPoints(points);
							temp.setGeometry(line);
							temp.setZones(sb.getZones());
							temp.setParkingMeters(sb.getParkingMeters());
							temp.setRateAreaId(sb.getRateAreaId());
							temp.setAgencyId(sb.getAgencyId());
							area.getStreets().put(temp.getId(), temp);	// update the street in the map
							mongodb.save(area);
							founded = true;
							logger.info("Street " + temp.getId() + " updated by user " + username);
						}
					}
				} else {
					throw new AccessControlException("no update permission for street object");
				}
			} else {
				throw new AccessControlException("no update permission for street object");
			}
		}

		if (!founded) {
			StreetBean todel = findStreet(sb.getId(), appId);
			logger.info("Street " + todel.getId());
			if (todel != null) {
				removeStreet(todel.getRateAreaId(), sb.getId(), appId, agencyId, username);
			}
			sb = save(sb, appId, agencyId, username);
		}

		return sb;
	}

	public boolean removeStreet(String areaId, String streetId, String appId, String agencyId, String username) {
		logger.info("Street area " + areaId);
		RateArea area = getAreaObjectById(areaId, appId);	//mongodb.findById(areaId, RateArea.class);
		boolean result = false;
		if(area.getAgencyId() != null && !area.getAgencyId().isEmpty()){
			if(area.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getStreet() >= UPDATE_VAL){
					//Street s = ModelConverter.convert(findStreet(streetId, appId), Street.class);
					result = area.getStreets() != null && (area.getStreets().remove(streetId) != null);
					if (result) {
						mongodb.save(area);
						logger.debug(String.format("Success removing via %s of area %s", streetId, areaId));
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
						logger.info("Street " + streetId + " deleted by user " + username);
					} else {
						logger.warn(String.format("Failure removing via %s of area %s", streetId, areaId));
					}
				} else {
					throw new AccessControlException("no delete permission for street object");
				}
			} else {
				throw new AccessControlException("no delete permission for street object");
			}
		}
		return result;
	}

	public StreetBean save(StreetBean s, String appId, String agencyId, String username) throws DatabaseException {
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getStreet() >= UPDATE_VAL){
			Street street = ModelConverter.convert(s, Street.class);
			street = processId(street, Street.class);
			street.setZones(s.getZones());
			street.setParkingMeters(s.getParkingMeters());
			if(s.getSlotsConfiguration() != null && !s.getSlotsConfiguration().isEmpty()){
				street.setSlotsConfiguration(ModelConverter.toVehicleSlotList(s.getSlotsConfiguration(), null));
			}
			street.setId_app(appId);
			try {
				RateArea area = findById(s.getRateAreaId(), RateArea.class);
				if(area.getAgencyId() != null && !area.getAgencyId().isEmpty()){
					if(area.getAgencyId().contains(agencyId)){
						// new
						if(area.getStreets() == null) {
							area.setStreets(new HashMap<String, Street>());
						}
						street = processId(street, Street.class);
						area.getStreets().put(street.getId(), street);
						// old
						//if (area.getStreets() == null) {
						//	area.setStreets(new ArrayList<Street>());
						//}
						// TODO check if via is already present
						//area.getStreets().add(processId(street, Street.class));
						mongodb.save(area);
						s.setId(street.getId());
						logger.info("Street " + street.getId() + " created by user " + username);
						
						DataLogBean dl = new DataLogBean();
						dl.setObjId("@" + s.getId_app() + "@street@" + s.getId());
						dl.setType("street");
						dl.setTime(System.currentTimeMillis());
						dl.setAuthor("999");
						dl.setDeleted(false);
						@SuppressWarnings("unchecked")
						Map<String,Object> map = ModelConverter.convert(s, Map.class);
						dl.setValue(map);
						mongodb.save(dl);
					} else {
						throw new AccessControlException("no create permission for street object");
					}
				}
			} catch (NotFoundException e) {
				logger.error("Exception saving via, relative area not found");
				throw new DatabaseException();
			}
		} else {
			throw new AccessControlException("no create permission for street object");
		}
		return s;
	}

	// BikePoint Methods
	public BikePointBean editBikePoint(BikePointBean pb, String appId, String agencyId, String username)
			throws NotFoundException {
		BikePoint bici = findById(pb.getId(), BikePoint.class);
		if(bici.getAgencyId() != null && !bici.getAgencyId().isEmpty()){
			if(bici.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getBike() >= UPDATE_VAL){
					bici.setName(pb.getName());
					bici.setSlotNumber(pb.getSlotNumber());
					bici.setBikeNumber(pb.getBikeNumber());
					//bici.setMunicipality(pb.getMunicipality());
					bici.getGeometry().setLat(pb.getGeometry().getLat());
					bici.getGeometry().setLng(pb.getGeometry().getLng());
					if(pb.getZones() != null)bici.setZones(pb.getZones());
					mongodb.save(bici);
					logger.info("Bike point " + bici.getId() + " updated by user " + username);
				} else {
					throw new AccessControlException("no update permission for bike point object");
				}
			} else {
				throw new AccessControlException("no update permission for bike point object");
			}
		}
		return pb;
	}
	
	public boolean removeBikePoint(String puntobiciId, String appId, String agencyId, String username) {
		boolean result = false;
		Criteria crit = new Criteria();
		crit.and("id").is(puntobiciId);
		BikePoint bp = mongodb.findById(puntobiciId, BikePoint.class);
		if(bp.getAgencyId() != null && !bp.getAgencyId().isEmpty()){
			if(bp.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getBike() >= CREATE_REM_VAL){
					DataLogBean dl = new DataLogBean();
					dl.setObjId("@" + bp.getId_app() + "@bikePoint@" + puntobiciId);
					dl.setType("bikePoint");
					dl.setTime(System.currentTimeMillis());
					dl.setAuthor("999");
					//dl.setVersion(getLastVersion(dl.getObjId()));
					dl.setDeleted(true);
					mongodb.save(dl);
					
					mongodb.remove(Query.query(crit), BikePoint.class);
					result = true;
					logger.info("Bike point " + bp.getId() + " removed by user " + username);
				} else {
					throw new AccessControlException("no delete permission for bike point object");
				}
			} else {
				throw new AccessControlException("no delete permission for bike point object");
			}
		}
		return result;
	}

	public BikePointBean save(BikePointBean bp, String appId, String agencyId, String username) {
		BikePoint puntoBici = ModelConverter.convert(bp, BikePoint.class);
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getBike() >= CREATE_REM_VAL){
		puntoBici = processId(puntoBici, BikePoint.class);
		puntoBici.setId_app(appId);
		mongodb.save(puntoBici);
		bp.setId(puntoBici.getId());
		logger.info("Bike point " + bp.getId() + " created by user " + username);
		
		DataLogBean dl = new DataLogBean();
		dl.setObjId("@" + bp.getId_app() + "@bikePoint@" + bp.getId());
		dl.setType("bikePoint");
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
		} else {
			throw new AccessControlException("no create permission for bike point object");
		} 
		
		return bp;
	}

	public List<BikePointBean> getAllBikePoints(String appId) {
		List<BikePointBean> result = new ArrayList<BikePointBean>();
		
		List<BikePoint> bps;
		if ("all".equals(appId)) {
			bps = mongodb.findAll(BikePoint.class);
		} else {
			Criteria criteria = new Criteria("id_app").is(appId);
			Query query = new Query(criteria);
			bps = mongodb.find(query, BikePoint.class);
		}		
		
		for (BikePoint bp : bps) {
			result.add(ModelConverter.convert(bp, BikePointBean.class));
		}
		return result;
	}
	
	public List<BikePointBean> getAllBikePointsByAgencyId(String appId, String agencyId) {
		List<BikePointBean> result = new ArrayList<BikePointBean>();
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getBike() >= READ_VAL){
			Criteria crit = new Criteria();
			crit.and("agencyId").is(agencyId);
			for (BikePoint bp : mongodb.find(Query.query(crit), BikePoint.class)) {
			//for (BikePoint bp : mongodb.findAll(BikePoint.class)) {
				if("all".equals(appId) || bp.getId_app().equals(appId)) {
					result.add(ModelConverter.convert(bp, BikePointBean.class));
				}				
			}
		} else {
			throw new AccessControlException("no read permission for bike point object");
		}
		return result;
	}
	
	/*public List<BikePointBean> getAllBikePoints(String appId, String municipality) {
		List<BikePointBean> result = new ArrayList<BikePointBean>();
		for (BikePoint bp : mongodb.findAll(BikePoint.class)) {
			if(bp != null && appId.compareTo("all") == 0){
				if(municipality.compareTo("all") == 0){
					result.add(ModelConverter.convert(bp, BikePointBean.class));
				} else if(bp.getMunicipality().compareTo(municipality) == 0) {
					result.add(ModelConverter.convert(bp, BikePointBean.class));
				}
			} else if(bp != null && bp.getId_app().compareTo(appId) == 0){
			//logger.info(String.format("Bike point found : %s", pb.toString()));
				if(municipality.compareTo("all") == 0){
					result.add(ModelConverter.convert(bp, BikePointBean.class));
				} else if(bp.getMunicipality().compareTo(municipality) == 0) {
					result.add(ModelConverter.convert(bp, BikePointBean.class));
				}
			}
		}
		return result;
	}*/	
	
	/**
	 * Method getBikePointsByName: return a list of BikePointBean having a specific name
	 * @param name: name of the BikePoints to find;
	 * @return List of BikePointBean found;
	 */
	public List<BikePointBean> getBikePointsByName(String name, String appId) {
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
	
	/**
	 * Method getBikePointById: return the specific bike point with the correct id
	 * @param bpId: id of the BikePoints to find;
	 * @return BikePointBean found;
	 */
	public BikePointBean getBikePointById(String bpId, String appId) {
		BikePointBean result = null;
		Criteria crit = new Criteria();
		crit.and("_id").is(new ObjectId(bpId));
		crit.and("id_app").is(appId);
		BikePoint bp = null;
		bp = mongodb.findOne(Query.query(crit), BikePoint.class);
		if(bp != null){
			result = ModelConverter.convert(bp, BikePointBean.class);
		}
		return result;
	}

	public ParkingStructureBean save(ParkingStructureBean entityBean, String appId, String agencyId, String username) {
		ParkingStructure entity = ModelConverter.convert(entityBean, ParkingStructure.class);
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getStructure() >= CREATE_REM_VAL){
			entity = processId(entity, ParkingStructure.class);
			entity.setId_app(appId);
			mongodb.save(entity);
			entityBean.setId(entity.getId());
			if(entityBean.getSlotsConfiguration() != null && !entityBean.getSlotsConfiguration().isEmpty()){
				entity.setSlotsConfiguration(ModelConverter.toVehicleSlotList(entityBean.getSlotsConfiguration(), null));
			}
			logger.info("Parking structure " + entity.getId() + " created by user " + username);
			
			DataLogBean dl = new DataLogBean();
			dl.setObjId("@" + entity.getId_app() + "@parkingStructure@" + entity.getId());
			dl.setType("parkingStructure");
			dl.setTime(System.currentTimeMillis());
			dl.setAuthor("999");
			dl.setDeleted(false);
			@SuppressWarnings("unchecked")
			Map<String,Object> map = ModelConverter.convert(entity, Map.class);
			dl.setValue(map);
			mongodb.save(dl);
		} else {
			throw new AccessControlException("no create permission for ps object");
		}
		return entityBean;
	}

	public List<ParkingStructureBean> getAllParkingStructure(String appId) {
		List<ParkingStructureBean> result = new ArrayList<ParkingStructureBean>();
		
		List<ParkingStructure> pss;
		if ("all".equals(appId)) {
			pss = mongodb.findAll(ParkingStructure.class, "parkingStructure");
		} else {
			Criteria criteria = new Criteria("id_app").is(appId);
			Query query = new Query(criteria);
			pss = mongodb.find(query, ParkingStructure.class, "parkingStructure");
		}
		
		for (ParkingStructure entity : pss) {
				result.add(ModelConverter.convert(entity, ParkingStructureBean.class));
		}
		return result;
	}	
	
	public List<ParkingStructureBean> getAllParkingStructureByAgencyId(String appId, String agencyId) {
		List<ParkingStructureBean> result = new ArrayList<ParkingStructureBean>();
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getStructure() >= READ_VAL){
			Criteria crit = new Criteria();
			crit.and("agencyId").is(agencyId);
			for (ParkingStructure entity : mongodb.find(Query.query(crit), ParkingStructure.class)) {
				if ("all".equals(appId) || appId.equals(entity.getId_app())) {
					result.add(ModelConverter.convert(entity, ParkingStructureBean.class));
				}
			}
		} else {
			throw new AccessControlException("no read permission for structure object");
		}
		return result;
	}
	
	public ParkingStructureBean findParkingStructure(String id) throws NotFoundException {
		ParkingStructure entity = findById(id,ParkingStructure.class);
		ParkingStructureBean ps = null;
		if(entity != null){
			ps = ModelConverter.convert(entity, ParkingStructureBean.class);
		}
		return ps;
	}
	
	public ParkingStructureBean getParkingStructureById(String id, String appId) {
		Criteria crit = new Criteria();
		crit.and("_id").is(new ObjectId(id));
		crit.and("id_app").is(appId);
		ParkingStructure entity = mongodb.findOne(Query.query(crit),ParkingStructure.class);
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
	public List<ParkingStructureBean> getParkingStructureByName(String name, String appId) {
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

	public ParkingStructureBean editParkingStructure(ParkingStructureBean entityBean, String appId, String agencyId, String username) throws NotFoundException {
		ParkingStructure entity = findById(entityBean.getId(), ParkingStructure.class);
		if(entity.getAgencyId() != null && !entity.getAgencyId().isEmpty()){
			if(entity.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getStructure() >= UPDATE_VAL){
					entity.setManagementMode(entityBean.getManagementMode());
					entity.setName(entityBean.getName());
					entity.setPaymentMode(ModelConverter.toPaymentMode(entityBean.getPaymentMode()));
					entity.setPaymentPoint(ModelConverter.toPaymentPoint(entityBean.getPaymentPoint()));
					entity.setManager(entityBean.getManager());
					entity.setPhoneNumber(entityBean.getPhoneNumber());
					entity.setSlotNumber(entityBean.getSlotNumber());
					List<VehicleSlotBean> editedSlotsConfBean = entityBean.getSlotsConfiguration();
					entity.setSlotsConfiguration(ModelConverter.toVehicleSlotList(editedSlotsConfBean, null));
					/*entity.setPayingSlotNumber(entityBean.getPayingSlotNumber());
					entity.setHandicappedSlotNumber(entityBean.getHandicappedSlotNumber());
					entity.setUnusuableSlotNumber(entityBean.getUnusuableSlotNumber());*/
					entity.setStreetReference(entityBean.getStreetReference());
					if(entityBean.getValidityPeriod() != null){
						if(entity.getValidityPeriod() != null){
							entity.getValidityPeriod().clear();
						} else {
							entity.setValidityPeriod(new ArrayList<RatePeriod>());
						}
					} else {
						entity.setValidityPeriod(new ArrayList<RatePeriod>());
					}
					for (RatePeriodBean ratePeriod : entityBean.getValidityPeriod()) {
						entity.getValidityPeriod().add(
								ModelConverter.convert(ratePeriod, RatePeriod.class));
					}
			
					entity.getGeometry().setLat(entityBean.getGeometry().getLat());
					entity.getGeometry().setLng(entityBean.getGeometry().getLng());
					entity.setParkAndRide(entityBean.getParkAndRide());
					entity.setAbuttingPark(entityBean.getAbuttingPark());
					if(entityBean.getZones()!=null)entity.setZones(entityBean.getZones());
					mongodb.save(entity);
					logger.info("Parking structure " + entity.getId() + " updated by user " + username);
				} else {
					throw new AccessControlException("no update permission for structure object");
				}
			} else {
				throw new AccessControlException("no update permission for structure object");
			}
		}
		return entityBean;
	}
	
	// ParkingStructure Methods
	public boolean removeParkingStructure(String id, String appId, String agencyId, String username) {
		boolean result = false;
		Criteria crit = new Criteria();
		crit.and("id").is(id);
		
		ParkingStructure ps = mongodb.findById(id, ParkingStructure.class);
		if(ps.getAgencyId() != null && !ps.getAgencyId().isEmpty()){
			if(ps.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getStructure() >= CREATE_REM_VAL){
					DataLogBean dl = new DataLogBean();
					dl.setObjId("@" + ps.getId_app() + "@parkingStructure@" + id);
					dl.setType("parkingStructure");
					dl.setTime(System.currentTimeMillis());
					dl.setAuthor("999");
					dl.setDeleted(true);
					mongodb.save(dl);
					mongodb.remove(Query.query(crit), ParkingStructure.class);
					result = true;
					logger.info("Parking structure " + ps.getId() + " deleted by user " + username);
				} else {
					throw new AccessControlException("no delete permission for structure object");
				}
			} else {
				throw new AccessControlException("no delete permission for structure object");
			}
		}
		return result;
	}
	
	// Zone Methods
	public ZoneBean save(ZoneBean z, String appId, String agencyId, String username) {
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getZone() >= CREATE_REM_VAL){
			Zone zona = ModelConverter.convert(z, Zone.class);
			zona = processId(zona, Zone.class);
			zona.setId_app(appId);
			mongodb.save(zona);
			z.setId(zona.getId());
			logger.info("Zone " + z.getId() + " created by user " + username);
		} else {
			throw new AccessControlException("no create permission for zone object");
		}
		return z;
	}

	public List<ZoneBean> getAllZone(String appId) {
		List<ZoneBean> result = new ArrayList<ZoneBean>();
		
		List<Zone> zs;
		if ("all".equals(appId)) {
			zs = mongodb.findAll(Zone.class);
		} else {
			Criteria criteria = new Criteria("id_app").is(appId);
			Query query = new Query(criteria);
			zs = mongodb.find(query, Zone.class);
		}		
		
		
		for (Zone z : zs) {
			result.add(ModelConverter.convert(z, ZoneBean.class));
		}
		return result;
	}
	
	public List<ZoneBean> getAllZoneByAgencyId(String appId, String agencyId) {
		List<ZoneBean> result = new ArrayList<ZoneBean>();
		Agency ag = agencyDataSetup.getAgencyById(agencyId);
		if(ag.getZone() >= READ_VAL){
			Criteria crit = new Criteria();
			crit.and("agencyId").is(agencyId);
			for (Zone z : mongodb.find(Query.query(crit), Zone.class)) {
				if ("all".equals(appId) || z.getId_app().equals(appId)) {
					result.add(ModelConverter.convert(z, ZoneBean.class));
				}
			}
		} else {
			throw new AccessControlException("no read permission for zone object");
		}
		return result;
	}
	
	/*public List<ZoneBean> getAllZone(String appId, String municipality) {
		List<ZoneBean> result = new ArrayList<ZoneBean>();
		for (Zone z : mongodb.findAll(Zone.class)) {
			if(z != null && appId.compareTo("all") == 0){
				if(municipality.compareTo("all") == 0){
					result.add(ModelConverter.convert(z, ZoneBean.class));
				} else if(z.getMunicipality().compareTo(municipality) == 0){
					result.add(ModelConverter.convert(z, ZoneBean.class));
				}
			} else if(z != null && z.getId_app().compareTo(appId) == 0){
				if(municipality.compareTo("all") == 0){
					result.add(ModelConverter.convert(z, ZoneBean.class));
				} else if(z.getMunicipality().compareTo(municipality) == 0){
					result.add(ModelConverter.convert(z, ZoneBean.class));
				}
			}
		}
		return result;
	}*/
	
	/**
	 * Method getZoneByName: get a list of zone having a specific name
	 * @param name: name of the zone to search
	 * @return List of ZoneBean found
	 */
	public List<ZoneBean> getZoneByName(String name, String appId) {
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
	
	/**
	 * Method getZoneByType: method used to get the zones of a specific type
	 * @param type: type to find;
	 * @param appId: agency id of the zone;
	 * @return list of ZoneBean object of a specific type and agency
	 */
	public List<ZoneBean> getZoneByType(String type, String appId) {
		List<ZoneBean> result = new ArrayList<ZoneBean>();
		for (Zone z : mongodb.findAll(Zone.class)) {
			if(z != null && z.getId_app().compareTo(appId) == 0){
				if(z.getType().compareToIgnoreCase(type) == 0){
					result.add(ModelConverter.convert(z, ZoneBean.class));
				}
			}
		}	
		return result;
	}
	
	/**
	 * Method getZoneByType: method used to get the zones of a specific type
	 * @param type: type to find;
	 * @param appId: agency id of the zone;
	 * @return list of ZoneBean object of a specific type and agency
	 */
	public List<ZoneBean> getZoneByTypeAndAgencyId(String type, String appId, String agencyId) {
		List<ZoneBean> result = new ArrayList<ZoneBean>();
		Criteria crit = new Criteria();
		crit.and("agencyId").is(agencyId);
		for (Zone z : mongodb.find(Query.query(crit), Zone.class)) {
			if(z != null && appId.compareTo("all") == 0){
				if(z.getType().compareToIgnoreCase(type) == 0){
					result.add(ModelConverter.convert(z, ZoneBean.class));
				}
			} else if(z != null && z.getId_app().compareTo(appId) == 0){
				if(z.getType().compareToIgnoreCase(type) == 0){
					result.add(ModelConverter.convert(z, ZoneBean.class));
				}
			}
		}	
		return result;
	}
	
	/**
	 * Method findZoneById: get a specific zone having the searched id
	 * @param zId: id of the zone to search
	 * @param appId: app id of the zone to search
	 * @return specific ZoneBean found
	 */
	public ZoneBean findZoneById(String zId, String appId) {
		Criteria crit = new Criteria();
		crit.and("_id").is(new ObjectId(zId));
		crit.and("id_app").is(appId);
		Zone z = mongodb.findOne(Query.query(crit), Zone.class);
		ZoneBean result = null;
		if(z != null){
			result = ModelConverter.convert(z, ZoneBean.class);
		}
		return result;
	}	

	public ZoneBean editZone(ZoneBean z, String appId, String agencyId, String username) throws NotFoundException {
		Zone zona = findById(z.getId(), Zone.class);
		if(zona.getAgencyId() != null && !zona.getAgencyId().isEmpty()){
			if(zona.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getZone() >= UPDATE_VAL){
					zona.setName(z.getName());
					zona.setSubmacro(z.getSubmacro());
					zona.setSubmicro(z.getSubmicro());
					zona.setColor(z.getColor());
					zona.setType(z.getType());
					zona.setNote(z.getNote());
					if(z.getCentermap() != null){
						if(zona.getCentermap() != null){
							zona.getCentermap().setLat(z.getCentermap().getLat());
							zona.getCentermap().setLng(z.getCentermap().getLng());
						} else {
							Point p = new Point();
							p.setLat(z.getCentermap().getLat());
							p.setLng(z.getCentermap().getLng());
							zona.setCentermap(p);
						}
					}
					zona.setGeometryFromSubelement(z.isGeometryFromSubelement());
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
					logger.info("Zone " + z.getId() + " updated by user " + username);
				} else {
					throw new AccessControlException("no update permission for zone object");
				}
			} else {
				throw new AccessControlException("no update permission for zone object");
			}
		}
		return z;
	}

	public boolean removeZone(String zonaId, String appId, String agencyId, String username) {
		boolean result = false;
		Criteria crit = new Criteria();
		crit.and("id").is(zonaId);
		ZoneBean z = ModelConverter.convert(mongodb.findById(zonaId, Zone.class), ZoneBean.class);
		if(z.getAgencyId() != null && !z.getAgencyId().isEmpty()){
			if(z.getAgencyId().contains(agencyId)){
				Agency ag = agencyDataSetup.getAgencyById(agencyId);
				if(ag.getZone() >= UPDATE_VAL){
					List<StreetBean> streets = getAllStreets(z, appId);
					for(StreetBean s : streets){
						List<String> zones = s.getZones();
						for (Iterator<String> iterator = zones.iterator(); iterator.hasNext(); ) {
						    String value = iterator.next();
						    if(value.compareTo(zonaId) == 0){
						    	logger.debug(String.format("Finded zona: %s", value));
						    	iterator.remove();
						    	try {
									editStreet(s, appId, agencyId, username);
								} catch (DatabaseException e) {
									logger.error(String.format("Error in update street: %s", e.getMessage()));
								}
						    }
						}
					}
					mongodb.remove(Query.query(crit), Zone.class);
					result = true;
					logger.info("Zone " + zonaId + " deleted by user " + username);
				} else {
					throw new AccessControlException("no delete permission for zone object");
				}
			} else {
				throw new AccessControlException("no delete permission for zone object");
			}
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
	
	@SuppressWarnings("unused")
	private Integer getLastVersion(String objId){
		Integer version = new Integer(0);
		Query q = new Query();
		q.addCriteria(Criteria.where("objId").is(objId));
//		q.sort().on("updateTime", Order.DESCENDING);
		q.with(new Sort(Sort.Direction.DESC, "updateTime"));
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
