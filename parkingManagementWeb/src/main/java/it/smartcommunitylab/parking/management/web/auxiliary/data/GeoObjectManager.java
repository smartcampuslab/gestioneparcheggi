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
package it.smartcommunitylab.parking.management.web.auxiliary.data;

import it.smartcommunitylab.parking.management.web.auxiliary.model.FilterPeriod;
import it.smartcommunitylab.parking.management.web.auxiliary.model.PMProfitData;
import it.smartcommunitylab.parking.management.web.auxiliary.model.PSOccupancyData;
import it.smartcommunitylab.parking.management.web.auxiliary.model.PSProfitData;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkMeter;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.SOccupancyData;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.auxiliary.services.PolylineEncoder;
import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.PointBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.VehicleSlotBean;
import it.smartcommunitylab.parking.management.web.converter.ModelConverter;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.DynamicManager;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.slots.VehicleSlot;
import it.smartcommunitylab.parking.management.web.repository.DataLogBeanTP;
import it.smartcommunitylab.parking.management.web.repository.DataLogRepositoryDao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.Circle;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

//import eu.trentorise.smartcampus.presentation.common.exception.DataException;
//import eu.trentorise.smartcampus.presentation.data.BasicObject;

// Manager used to store the dynamic data
@Service("GeoObjectManager")
public class GeoObjectManager {

	@Autowired
	private StorageManager storageManager;
	@Autowired
	private DynamicManager dynamicManager;
	@Autowired
	private DataLogRepositoryDao dataLogRepo;
	@Autowired
	private MongoTemplate mongodb;
	
	private static final Logger logger = Logger.getLogger(GeoObjectManager.class);
	private static final int OCCUPANCY_CELLS_OFFSET = 8;
	private static final int OCCUPANCY_PS_CELLS_OFFSET = 4;
	private static final int OCCUPANCY_CELLS_FIRSTVAL = 4;
	
	public List<Parking> getParkings(String agency) throws Exception { 
		return searchParkings((Circle)null, Collections.<String,Object>singletonMap("agency", agency)); //(Circle)null,
	}
	
	public List<Parking> getParkings(String agency, double lat, double lon, double radius) throws Exception {
		return searchParkings(new Circle(lat, lon, radius), Collections.<String,Object>singletonMap("agency", agency)); //new Circle(lat, lon, radius),
	}
	
	public List<Street> getStreets(String agency) throws Exception {
		return searchStreets((Circle)null, Collections.<String,Object>singletonMap("agency", agency)); //(Circle)null, 
	}
	
	public List<Street> getStreets(String agency, double lat, double lon, double radius) throws Exception {
		return searchStreets(new Circle(lat, lon, radius), Collections.<String,Object>singletonMap("agency", agency)); //new Circle(lat, lon, radius),
	}
	
	public List<ParkMeter> getParkingMeters(String agency) throws Exception { 
		return searchParkingMeters((Circle)null, Collections.<String,Object>singletonMap("agency", agency)); //(Circle)null,
	}
	
	public ParkMeter getParkingMeterFromCode(String agency, String code) throws Exception { 
		ParkMeter park = null;
		boolean find = false;
		//return 
		List<ParkMeter> all = searchParkingMeters((Circle)null, Collections.<String,Object>singletonMap("agency", agency));
		for(int i = 0; i < all.size() && !find; i++){
			ParkMeter p = all.get(i);
			if(p.getCode().compareTo(code) == 0){
				park = p;
				find = true;
			}
		}
		return park;
	}
	
	public ParkStruct getParkingStructureByName(String name, String appId) throws Exception{
		ParkStruct pstruct = null;
		boolean find = false;
		//return 
		List<ParkStruct> all = searchParkingStructures((Circle)null, Collections.<String,Object>singletonMap("agency", appId));
		for(int i = 0; i < all.size() && !find; i++){
			ParkStruct ps = all.get(i);
			if(ps.getName().compareToIgnoreCase(name) == 0){
				pstruct = ps;
				find = true;
			}
		}
		return pstruct;
	}
	
	public Street getStreetByName(String name, String appId) throws Exception{
		Street street = null;
		boolean find = false;
		//return 
		List<Street> all = searchStreets((Circle)null, Collections.<String,Object>singletonMap("agency", appId));
		for(int i = 0; i < all.size() && !find; i++){
			Street s = all.get(i);
			if(s.getName().compareToIgnoreCase(name) == 0){
				street = s;
				find = true;
			}
		}
		return street;
	}
	
	public Parking getParkingByName(String name, String appId) throws Exception{
		Parking park = null;
		boolean find = false;
		//return 
		List<Parking> all = searchParkings((Circle)null, Collections.<String,Object>singletonMap("agency", appId));
		for(int i = 0; i < all.size() && !find; i++){
			Parking pk = all.get(i);
			if(pk.getName().compareToIgnoreCase(name) == 0){
				park = pk;
				find = true;
			}
		}
		return park;
	}	
	
	public List<ParkMeter> getParkingMeters(String agency, double lat, double lon, double radius) throws Exception {
		return searchParkingMeters(new Circle(lat, lon, radius), Collections.<String,Object>singletonMap("agency", agency)); //new Circle(lat, lon, radius),
	}
	
	public void updateDynamicStreetData(Street s, String agencyId, String authorId, boolean sysLog, long[] period, int p_type) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		if(s.getUpdateTime() != null){
			currTime = s.getUpdateTime();
		}
		//currTime = 1419462000000L; // Christmas Day 2014
		//currTime = 1428271200000L; // Easter Monday 2015
		//currTime = 1431813600000L; // A Sunday
		//currTime = 1432543500000L;	// Today at 10.45 am
		dynamicManager.editStreetAux(s, currTime, agencyId, authorId, sysLog, period, p_type);
	}
	
	public void updateDynamicParkingData(Parking object, String agencyId, String authorId, boolean sysLog, long[] period, int p_type) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		if(object.getUpdateTime() != null){
			currTime = object.getUpdateTime();
		}
		dynamicManager.editParkingStructureAux(object, currTime, agencyId, authorId, sysLog, period, p_type);
	}
	
	public void updateDynamicParkingMeterData(ParkMeter object, String agencyId, String authorId, boolean sysLog, Long from, Long to, long[] period, int p_type) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		Long startTime = null;
		if(from != null && to != null){
			currTime = to;
			startTime = from;
		} else if(object.getUpdateTime() != null){
			currTime = object.getUpdateTime();
		}
		dynamicManager.editParkingMeterAux(object, currTime, startTime, agencyId, authorId, sysLog, period, p_type);
	}
	
	public void updateDynamicParkStructProfitData(ParkStruct object, String agencyId, String authorId, boolean sysLog, Long from, Long to, long[] period, int p_type) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		Long startTime = null;
		if(from != null && to != null){
			currTime = to;
			startTime = from;
		} else if(object.getUpdateTime() != null){
			currTime = object.getUpdateTime();
		}
		dynamicManager.editParkStructProfitAux(object, currTime, startTime, agencyId, authorId, sysLog, period, p_type);
	}

//	public List<DataLogBean> getAllLogs(String agency, int count, int skip) {
//		return dynamicManager.getLogsById(null, agency, count, skip, "all");
//	}
	
	public DataLogBean getLogById(String id) {
		return dynamicManager.getLogByLogId(id);
	}
	
//	public int countAllLogs(String agency) {
//		return dynamicManager.countLogsById(null, agency, -1, 0, "all");
//	}
//	
	private List<DataLogBean> getLogsById(String id, String agency, int count, String type) {
		return dynamicManager.getLogsById(id, agency, count, 0, type);
	}
	
	public List<DataLogBean> getLogsByAuthorDyn(String authorId, String agency, int count) {
		return dynamicManager.getLogsByAuthor(authorId, agency, count);
	}
	
	public List<DataLogBeanTP> findAllLogsByAgency(String agency, Integer skip, Integer count){
		return dynamicManager.findTPAll(agency, false, skip, count);
	};

	public Long countAllLogsByAgency(String agency) {
		return dynamicManager.countTPAll(agency, false);
	}

	public List<DataLogBeanTP> findAllLogsByAgencyAndType(String agency, String type, Integer skip, Integer count){
		return dynamicManager.findTPTyped(agency, false, type, skip, count);
	};

	public Long countAllLogsByAgencyAndType(String agency, String type) {
		return dynamicManager.countTPTyped(agency, false, type);
	}

	public int countAllStreetLogs(String agency) {
		return dynamicManager.countLogsById(null, agency, -1, 0, it.smartcommunitylab.parking.management.web.auxiliary.model.Street.class.getCanonicalName());
	}
	
	public List<DataLogBean> getAllStreetLogs(String agency, int count, int skip) {
		return dynamicManager.getLogsById(null, agency, count, skip, it.smartcommunitylab.parking.management.web.auxiliary.model.Street.class.getCanonicalName());
	}
	
	public List<DataLogBean> getStreetLogsByIdDyn(String id, String agency, int count) {
		return getLogsById(id, agency, count, it.smartcommunitylab.parking.management.web.auxiliary.model.Street.class.getCanonicalName());
	}
	
	public List<DataLogBeanTP> getStreetLogsByAgency(String agency){
		List<DataLogBeanTP> correctedStreetLogs = new ArrayList<DataLogBeanTP>();
		List<DataLogBeanTP> streetLogs = dataLogRepo.findByType(it.smartcommunitylab.parking.management.web.auxiliary.model.Street.class.getCanonicalName());
		for(int i = 0; i < streetLogs.size(); i++){
			if(streetLogs.get(i) != null && !streetLogs.get(i).isDeleted() && streetLogs.get(i).getAgency() != null && streetLogs.get(i).getAgency().compareTo(agency) == 0){
				correctedStreetLogs.add(streetLogs.get(i));
			}
		}
		return correctedStreetLogs;
	};
	
	public int countAllParkingLogs(String agency) {
		return dynamicManager.countLogsById(null, agency, -1, 0, Parking.class.getCanonicalName());
	}
	
	public List<DataLogBean> getAllParkingLogs(String agency, int count, int skip) {
		return dynamicManager.getLogsById(null, agency, count, skip, Parking.class.getCanonicalName());
	}
	
	public List<DataLogBean> getParkingLogsByIdDyn(String id, String agency, int count) {
		return getLogsById(id, agency, count, Parking.class.getCanonicalName());
	}
	
	public List<DataLogBeanTP> getParkingLogsByAgency(String agency){
		List<DataLogBeanTP> correctedParkingLogs = new ArrayList<DataLogBeanTP>();
		List<DataLogBeanTP> parkingLogs = dataLogRepo.findByType(Parking.class.getCanonicalName());
		for(int i = 0; i < parkingLogs.size(); i++){
			if(parkingLogs.get(i) != null && !parkingLogs.get(i).isDeleted() && parkingLogs.get(i).getAgency() != null && parkingLogs.get(i).getAgency().compareTo(agency) == 0){
				correctedParkingLogs.add(parkingLogs.get(i));
			}
		}
		return correctedParkingLogs;
	};
	
	public List<DataLogBeanTP> getParkProfitLogsByAgency(String agency){
		List<DataLogBeanTP> correctedParkProfitLogs = new ArrayList<DataLogBeanTP>();
		List<DataLogBeanTP> parkProfitLogs = dataLogRepo.findByType(ParkStruct.class.getCanonicalName());
		for(int i = 0; i < parkProfitLogs.size(); i++){
			if(parkProfitLogs.get(i) != null && !parkProfitLogs.get(i).isDeleted() && parkProfitLogs.get(i).getAgency() != null && parkProfitLogs.get(i).getAgency().compareTo(agency) == 0){
				correctedParkProfitLogs.add(parkProfitLogs.get(i));
			}
		}
		return correctedParkProfitLogs;
	};
	
	public List<DataLogBeanTP> getPmLogsByAgency(String agency){
		List<DataLogBeanTP> correctedParkMeterLogs = new ArrayList<DataLogBeanTP>();
		List<DataLogBeanTP> parkMeterLogs = dataLogRepo.findByType(ParkMeter.class.getCanonicalName());
		for(int i = 0; i < parkMeterLogs.size(); i++){
			if(parkMeterLogs.get(i) != null && !parkMeterLogs.get(i).isDeleted() && parkMeterLogs.get(i).getAgency() != null && parkMeterLogs.get(i).getAgency().compareTo(agency) == 0){
				correctedParkMeterLogs.add(parkMeterLogs.get(i));
			}
		}
		return correctedParkMeterLogs;
	};
	
	// -------------------- Methods from geoStorage ---------------------------
	
	public List<Street> searchStreets(Circle circle, Map<String, Object> inCriteria) throws Exception { //Circle circle
		return searchStreets(circle, inCriteria, 0, 0);//circle,
	}
	
	public List<Street> searchStreets(Circle circle, Map<String, Object> inCriteria, int limit, int skip) throws Exception { //Circle circle
		//Criteria criteria = createSearchCriteria(type, circle, inCriteria); //circle,
		//Query query = Query.query(criteria);
		//if (limit > 0) query.limit(limit);
		//if (skip > 0) query.skip(skip);

		List<Street> listaObj = new ArrayList<Street>();
		//storageManager.setAppId(inCriteria.get("agency").toString());
		List<StreetBean> myStreets = storageManager.getAllStreets(inCriteria.get("agency").toString());
		for(int i = 0; i < myStreets.size(); i++){
			Street s = castPMStreetBeanToStreet(myStreets.get(i));
			if(circle != null){
				// here I have to create a specific filter for position distances from circle center and distances < radius
				logger.debug(String.format("Circle params: lat:%s, lng:%s, radius:%s", circle.getCenter().getX(), circle.getCenter().getY(), circle.getRadius()));
				logger.debug(String.format("Streets: lat:%s, lng:%s", s.getPosition()[0], s.getPosition()[1]));
				double dist = distance(circle.getCenter().getX(), circle.getCenter().getY(), s.getPosition()[0], s.getPosition()[1],'K');
				logger.debug(String.format("distance: %s", dist));
				if(dist  <= circle.getRadius()){
					listaObj.add(s);
				}
			} else {
				listaObj.add(s);
			}
		}
		logger.debug(String.format("Streets found: %s", listaObj.size()));
		
		return listaObj; //find(query, cls);
	}
	
	public List<Parking> searchParkings(Circle circle, Map<String, Object> inCriteria) throws Exception { //Circle circle
		return searchParkings(circle, inCriteria, 0, 0);//circle,
	}
	
	public List<Parking> searchParkings(Circle circle, Map<String, Object> inCriteria, int limit, int skip) throws Exception { //Circle circle
//		Criteria criteria = createSearchCriteria(type, circle, inCriteria); //circle,
//		Query query = Query.query(criteria);
//		if (limit > 0) query.limit(limit);
//		if (skip > 0) query.skip(skip);
		
		//logger.error(String.format("Search Parking limit %s, skip %s, query %s, class %s", limit, skip, query.getHint(), type));
		
		List<Parking> listaObj = new ArrayList<Parking>();
		//storageManager.setAppId(inCriteria.get("agency").toString());
		List<ParkingStructureBean> myStructures = storageManager.getAllParkingStructure(inCriteria.get("agency").toString());
		
		for(int i = 0; i < myStructures.size(); i++){
			Parking p = castPMStructureBeanToParking(myStructures.get(i));
			if(circle != null){
				// here I have to create a specific filter for position distances from circle center and distances < radius
				if(distance(circle.getCenter().getX(), circle.getCenter().getY(), p.getPosition()[0], p.getPosition()[1],'K') <= circle.getRadius()){
					listaObj.add(p);
				}
			} else {
				listaObj.add(p);
			}
		}
		
		return listaObj; //find(query, cls);
	}
	
	public List<ParkMeter> searchParkingMeters(Circle circle, Map<String, Object> inCriteria) throws Exception { //Circle circle
		return searchParkingMeters(circle, inCriteria, 0, 0);//circle,
	}
	
	public List<ParkMeter> searchParkingMeters(Circle circle, Map<String, Object> inCriteria, int limit, int skip) throws Exception { //Circle circle	
		//logger.error(String.format("Search Parking limit %s, skip %s, query %s, class %s", limit, skip, query.getHint(), type));
		List<ParkMeter> listaObj = new ArrayList<ParkMeter>();
		List<ParkingMeterBean> myParkingMeters = storageManager.getAllParkingMeters(inCriteria.get("agency").toString());
		
		for(int i = 0; i < myParkingMeters.size(); i++){
			ParkMeter pm = castPMeterBeanToParkingMeter(myParkingMeters.get(i));
			if(circle != null){
				// here I have to create a specific filter for position distances from circle center and distances < radius
				if(distance(circle.getCenter().getX(), circle.getCenter().getY(), pm.getPosition()[0], pm.getPosition()[1],'K') <= circle.getRadius()){
					listaObj.add(pm);
				}
			} else {
				listaObj.add(pm);
			}
		}
		return listaObj; //find(query, cls);
	}
	
	public List<ParkStruct> searchParkingStructures(Circle circle, Map<String, Object> inCriteria) throws Exception { //Circle circle
		return searchParkingStructures(circle, inCriteria, 0, 0);//circle,
	}	
	
	public List<ParkStruct> searchParkingStructures(Circle circle, Map<String, Object> inCriteria, int limit, int skip) throws Exception { //Circle circle	
		List<ParkStruct> listaObj = new ArrayList<ParkStruct>();
		List<ParkingStructureBean> myParkingStructures = storageManager.getAllParkingStructure(inCriteria.get("agency").toString());
		
		for(int i = 0; i < myParkingStructures.size(); i++){
			ParkStruct ps = castPStructBeanToParkStruct(myParkingStructures.get(i));
			if(circle != null){
				// here I have to create a specific filter for position distances from circle center and distances < radius
				if(distance(circle.getCenter().getX(), circle.getCenter().getY(), ps.getPosition()[0], ps.getPosition()[1],'K') <= circle.getRadius()){
					listaObj.add(ps);
				}
			} else {
				listaObj.add(ps);
			}
		}
		return listaObj;
	}
	
	@SuppressWarnings("unused")
	private static <T> Criteria createSearchCriteria(Class<T> cls, Circle circle, Map<String, Object> inCriteria) { //Circle circle
		Criteria criteria = new Criteria();
		if (cls != null) {
			criteria.and("type").is(cls.getCanonicalName());
		}
		criteria.and("deleted").is(false);
		if (inCriteria != null) {
			for (String key : inCriteria.keySet()) {
				//criteria.and("content."+key).is(inCriteria.get(key));
				criteria.and(""+key).is(inCriteria.get(key));
			}
		}
		if (circle != null) {
			criteria.and("location").within(circle);
		}
		return criteria;
	}
	
	// ------------------------------------------------------------------------
	
	@SuppressWarnings("unused")
	private <T> T findById(String id, Class<T> javaClass)
			throws NotFoundException {
		T result = mongodb.findById(id, javaClass);
		if (result == null) {
			throw new NotFoundException();
		}
		return result;
	}
	
	
	@SuppressWarnings("unused")
	private Street castStreetJSONToObject(String value){
		logger.debug(String.format("Street to be casted : %s", value));
		JSONObject jsonStreet = new JSONObject(value);

		Street s = new Street();
		s.setId(jsonStreet.getString("id"));
		s.setAgency(jsonStreet.getString("agency"));
		// TODO update slots uploading from json
		/*s.setSlotsFree(Integer.valueOf(jsonStreet.getInt("slotsFree")));
		s.setSlotsPaying(Integer.valueOf(jsonStreet.getInt("slotsPaying")));
		s.setSlotsTimed(Integer.valueOf(jsonStreet.getInt("slotsTimed")));*/
		
		s.setName(jsonStreet.getString("name"));
		s.setPolyline(jsonStreet.getString("polyline"));
		JSONArray pos = jsonStreet.getJSONArray("position");//getString("position");
		if(pos != null && pos.length() > 0){
			//String[] pos_string = pos.split(",");
			double[] pos_double = new double[2];
			pos_double[0] = Double.valueOf(pos.getDouble(0));	//pos_string[0]
			pos_double[1] = Double.valueOf(pos.getDouble(1));	//pos_string[1]
			s.setPosition(pos_double);
		}
		s.setDescription(jsonStreet.getString("description"));
		return s;
	}
	
	@SuppressWarnings("unused")
	private Parking castParkingJSONToObject(String value){
		JSONObject jsonParking = new JSONObject(value);	
		Parking p = new Parking();
		p.setId(jsonParking.getString("id"));
		p.setAgency(jsonParking.getString("agency"));
		p.setSlotsTotal(Integer.valueOf(jsonParking.getInt("slotsTotal")));
		p.setName(jsonParking.getString("name"));
		JSONArray pos = jsonParking.getJSONArray("position");//getString("position");
		if(pos != null && pos.length() > 0){
			//String[] pos_string = pos.split(",");
			double[] pos_double = new double[2];
			pos_double[0] = Double.valueOf(pos.getDouble(0));	//pos_string[0]
			pos_double[1] = Double.valueOf(pos.getDouble(1));	//pos_string[1]
			p.setPosition(pos_double);
		}
		p.setDescription(jsonParking.getString("description"));
		return p;
	}
	
	private Street castPMStreetBeanToStreet(StreetBean street){
		//logger.error(String.format("Street to be casted : %s", street.toJSON()));

		Street s = new Street();
		s.setId("street@" + street.getId_app() + "@" + street.getId());
		s.setAgency(street.getId_app());
//		if(ModelConverter.isValorisedSlots(street.getFreeParkSlotNumber()) && ModelConverter.isValorisedSlots(street.getFreeParkSlotSignNumber())){
//			int freeSlots = street.getFreeParkSlotNumber() + street.getFreeParkSlotSignNumber();
//			s.setSlotsFree(freeSlots);
//		} else {
//			if(ModelConverter.isValorisedSlots(street.getFreeParkSlotNumber())){
//				s.setSlotsFree(street.getFreeParkSlotNumber());
//			} else {
//				s.setSlotsFree(street.getFreeParkSlotSignNumber());
//			}
//		}
		List<VehicleSlotBean> editedSlotsConfBean = street.getSlotsConfiguration();
		s.setSlotsConfiguration(ModelConverter.toVehicleSlotList(editedSlotsConfBean, s.getSlotsConfiguration()));
		
		/*if(street.getFreeParkSlotNumber() != null){
			s.setSlotsFree(street.getFreeParkSlotNumber());
		}
		if(street.getFreeParkSlotSignNumber() != null){
			s.setSlotsFreeSigned(street.getFreeParkSlotSignNumber());
		}
		if(street.getPaidSlotNumber() != null){
			s.setSlotsPaying(street.getPaidSlotNumber());
		}
		if(street.getTimedParkSlotNumber() != null){
			s.setSlotsTimed(street.getTimedParkSlotNumber());
		}
		if(street.getHandicappedSlotNumber() != null){
			s.setSlotsHandicapped(street.getHandicappedSlotNumber());
		}
		if(street.getReservedSlotNumber() != null){
			s.setSlotsReserved(street.getReservedSlotNumber());
		}*/
		s.setName(street.getStreetReference());
		if(street.getGeometry()!= null && street.getGeometry().getPoints() != null && street.getGeometry().getPoints().size() > 0){
			s.setPolyline(PolylineEncoder.encode(street.getGeometry().getPoints()));
			PointBean start = street.getGeometry().getPoints().get(0);
			s.setPosition(new double[]{start.getLat(),start.getLng()});
		}
		s.setDescription(street.getStreetReference());
		s.setAreaId(street.getRateAreaId());
		return s;
	}
	

	private Parking castPMStructureBeanToParking(ParkingStructureBean park){
		//logger.error(String.format("Park to be casted : %s", park.toJSON()));
		Parking p = new Parking();
		p.setId("parking@" + park.getId_app() + "@" + park.getId());
		p.setAgency(park.getId_app());
		p.setSlotsTotal(park.getSlotNumber());
		if(park.getPayingSlotNumber() != null){
			p.setSlotsPaying(park.getPayingSlotNumber());
		}
		if(park.getHandicappedSlotNumber() != null){
			p.setSlotsHandicapped(park.getHandicappedSlotNumber());
		}
		p.setName(park.getName());
		if(park.getGeometry()!= null){
			p.setPosition(new double[]{park.getGeometry().getLat(), park.getGeometry().getLng()});
		}
		String desc = (park.getValidityPeriod() != null && !park.getValidityPeriod().isEmpty()) ? park.feePeriodsSummary() : "Nessuna tariffa";
		p.setDescription(desc + ", " + park.getManagementMode());
		return p;
	}
	
	private ParkMeter castPMeterBeanToParkingMeter(ParkingMeterBean pmeter){
		//logger.error(String.format("Park to be casted : %s", park.toJSON()));
		ParkMeter p = new ParkMeter();
		p.setId("parkingmeter@" + pmeter.getId_app() + "@" + pmeter.getId());
		p.setAgency(pmeter.getId_app());
		p.setCode(pmeter.getCode() + "");
		p.setNote(pmeter.getNote());
		if(pmeter.getGeometry()!= null){
			p.setPosition(new double[]{pmeter.getGeometry().getLat(), pmeter.getGeometry().getLng()});
		}
		p.setStatus(pmeter.getStatus().toString());
		p.setAreaId(pmeter.getAreaId());
		return p;
	}
	
	private ParkStruct castPStructBeanToParkStruct(ParkingStructureBean pstruct){
		//logger.error(String.format("Park to be casted : %s", park.toJSON()));
		ParkStruct ps = new ParkStruct();
		ps.setId("parkstruct@" + pstruct.getId_app() + "@" + pstruct.getId());
		ps.setAgency(pstruct.getId_app());
		ps.setName(pstruct.getName());
		ps.setDescription(pstruct.getStreetReference());
		if(pstruct.getGeometry() != null){
			ps.setPosition(new double[]{pstruct.getGeometry().getLat(), pstruct.getGeometry().getLng()});
		}
		return ps;
	}	
	
	public ArrayList<PSOccupancyData> classStringToOPSObjArray(String data) throws Exception{
    	logger.debug(String.format("Map Object data: %s", data));
    	
    	ArrayList<PSOccupancyData> correctData = new ArrayList<PSOccupancyData>();
    	
    	String[] allRecords = data.split("\n");
    	String year = "";
    	FilterPeriod period = new FilterPeriod();
    	
    	for(int i = 0; i < allRecords.length; i++){
    		String[] att_and_vals = allRecords[i].split(",");
    		if(att_and_vals != null && att_and_vals.length > 0){
	    		if(att_and_vals[0].compareTo("Nome") != 0){	// to skip header records
	    			if(att_and_vals[0].compareTo("Anno") == 0){
	        			year = att_and_vals[1];
	        	    	period.setYear(year);
	        		} else {
	        			if(att_and_vals.length > 2 && att_and_vals[0].compareTo("") != 0){
	        				PSOccupancyData tmpPSOcc = new PSOccupancyData();
	        				tmpPSOcc.setpName(cleanField(att_and_vals[0]));
	        				tmpPSOcc.setpAddress(cleanField(att_and_vals[1]));
	        				tmpPSOcc.setPeriod(period);
	        				
	        				// here I load the vals
	        				List<String> occSlots = loadRicursive(att_and_vals, 0, OCCUPANCY_PS_CELLS_OFFSET);
	        				List<String> hSlots = loadRicursive(att_and_vals, 1, OCCUPANCY_PS_CELLS_OFFSET);
	        				List<String> ndSlots = loadRicursive(att_and_vals, 2, OCCUPANCY_PS_CELLS_OFFSET);
	        				tmpPSOcc.setOccSlots(occSlots);
	        				tmpPSOcc.setHSlots(hSlots);
	        				tmpPSOcc.setNdSlots(ndSlots);
	        				
	        				logger.error(String.format("Corrected Object: %s", tmpPSOcc.toString()));
	        				correctData.add(tmpPSOcc);
	        			}
	        		}
	    		}
    		}
    	}
    	return correctData;
    }	
	
	public ArrayList<SOccupancyData> classStringToOSObjArray(String data) throws Exception{
    	logger.debug(String.format("Map Object data: %s", data));
    	
    	ArrayList<SOccupancyData> correctData = new ArrayList<SOccupancyData>();
    	
    	String[] allRecords = data.split("\n");
    	String year = "";
    	FilterPeriod period = new FilterPeriod();
    	
    	for(int i = 0; i < allRecords.length; i++){
    		String[] att_and_vals = allRecords[i].split(",");
    		if(att_and_vals != null && att_and_vals.length > 0){
	    		if(att_and_vals[0].compareTo("Nome") != 0){	// to skip header records
	    			if(att_and_vals[0].compareTo("Anno") == 0){
	        			year = att_and_vals[1];
	        	    	period.setYear(year);
	        		} else {
	        			if(att_and_vals.length > 2 && att_and_vals[0].compareTo("") != 0){
	        				SOccupancyData tmpSOcc = new SOccupancyData();
	        				tmpSOcc.setsName(cleanField(att_and_vals[0]));
	        				tmpSOcc.setsArea(cleanField(att_and_vals[1]));
	        				tmpSOcc.setPeriod(period);
	        				
	        				// here I load the vals
	        				List<String> lcSlots = loadRicursive(att_and_vals, 0, OCCUPANCY_CELLS_OFFSET);
	        				List<String> lsSlots = loadRicursive(att_and_vals, 1, OCCUPANCY_CELLS_OFFSET);
	        				List<String> pSlots = loadRicursive(att_and_vals, 2, OCCUPANCY_CELLS_OFFSET);
	        				List<String> doSlots = loadRicursive(att_and_vals, 3, OCCUPANCY_CELLS_OFFSET);
	        				List<String> hSlots = loadRicursive(att_and_vals, 4, OCCUPANCY_CELLS_OFFSET);
	        				List<String> rSlots = loadRicursive(att_and_vals, 5, OCCUPANCY_CELLS_OFFSET);
	        				List<String> ndSlots = loadRicursive(att_and_vals, 6, OCCUPANCY_CELLS_OFFSET);
	        				tmpSOcc.setOccLC(lcSlots);
	        				tmpSOcc.setOccLS(lsSlots);
	        				tmpSOcc.setOccP(pSlots);
	        				tmpSOcc.setOccDO(doSlots);
	        				tmpSOcc.setOccH(hSlots);
	        				tmpSOcc.setOccR(rSlots);
	        				tmpSOcc.setSlotsND(ndSlots);
	        				
	        				logger.error(String.format("Corrected Object: %s", tmpSOcc.toString()));
	        				correctData.add(tmpSOcc);
	        			}
	        		}
	    		}
    		}
    	}
    	return correctData;
    }	

    public ArrayList<PMProfitData> classStringToPPMObjArray(String data) throws Exception{
    	logger.debug(String.format("Map Object data: %s", data));
    	
    	ArrayList<PMProfitData> correctData = new ArrayList<PMProfitData>();
    	
    	String[] allRecords = data.split("\n");
    	String year = "";
    	FilterPeriod period = new FilterPeriod();
    	
    	for(int i = 0; i < allRecords.length; i++){
    		//TODO: here I have to check the data list and understand if the value are in horizontal mode or in vertical mode
    		String[] att_and_vals = allRecords[i].split(",");
    		if(att_and_vals != null && att_and_vals.length > 0){
	    		if(att_and_vals[0].compareTo("Parcom") != 0){	// to skip header records
	    			if(att_and_vals[0].compareTo("Anno") == 0){
	        			year = att_and_vals[1];
	        	    	period.setYear(year);
	        		} else {
	        			//if(att_and_vals[0].contains("park")){
	        				// vertical mode
	        			//} else {
	        				// horizontal mode
		        			if(att_and_vals.length > 2 && att_and_vals[0].compareTo("") != 0){
		        				PMProfitData tmpPProfit = new PMProfitData();
		        				tmpPProfit.setpCode(cleanField(att_and_vals[0]));
		        				tmpPProfit.setpNote(cleanField(att_and_vals[1]));
		        				tmpPProfit.setPeriod(period);
		    			
		        				// here I load the vals
		        				String[] vals = Arrays.copyOfRange(att_and_vals, 2, 14);							// 14 are tot values
		        				String[] tickets = Arrays.copyOfRange(att_and_vals, 15, att_and_vals.length - 1);	// 27 are tot values
		        				tmpPProfit.setProfitVals(cleanStringArray(vals));
		        				tmpPProfit.setTickets(cleanStringArray(tickets));
		        				
		        				logger.error(String.format("Corrected Object: %s", tmpPProfit.toString()));
		        				correctData.add(tmpPProfit);
		        			}
	        			//}
	        		}
	    		}
    		}
    	}
    	return correctData;
    }
    
    public ArrayList<PSProfitData> classStringToPPSObjArray(String data) throws Exception{
    	logger.debug(String.format("Map Object data: %s", data));
    	
    	ArrayList<PSProfitData> correctData = new ArrayList<PSProfitData>();
    	
    	String[] allRecords = data.split("\n");
    	String year = "";
    	FilterPeriod period = new FilterPeriod();
    	
    	for(int i = 0; i < allRecords.length; i++){
    		String[] att_and_vals = allRecords[i].split(",");
    		if(att_and_vals != null && att_and_vals.length > 0){
	    		if(att_and_vals[0].compareTo("Nome") != 0){	// to skip header records
	    			if(att_and_vals[0].compareTo("Anno") == 0){
	        			year = att_and_vals[1];
	        	    	period.setYear(year);
	        		} else {
	        			if(att_and_vals.length > 2 && att_and_vals[0].compareTo("") != 0){
	        				PSProfitData tmpSProfit = new PSProfitData();
	        				tmpSProfit.setpName(cleanField(att_and_vals[0]));
	        				tmpSProfit.setpAddress(cleanField(att_and_vals[1]));
	        				tmpSProfit.setPeriod(period);
	    			
	        				// here I load the vals
	        				String[] vals = Arrays.copyOfRange(att_and_vals, 2, 14);							// 14 are tot values
	        				String[] tickets = Arrays.copyOfRange(att_and_vals, 15, att_and_vals.length - 1);	// 27 are tot values
	        				tmpSProfit.setProfitVals(cleanStringArray(vals));
	        				tmpSProfit.setTickets(cleanStringArray(tickets));
	        				
	        				logger.error(String.format("Corrected Object: %s", tmpSProfit.toString()));
	        				correctData.add(tmpSProfit);
	        			}
	        		}
	    		}
    		}
    	}
    	return correctData;
    }    
	
    private String cleanField(String value){
    	String cleaned = value.replace('"', ' ').trim();
    	cleaned = cleaned.replace('\n', ' ').trim();
    	if(cleaned.compareTo("0.00") == 0){
    		cleaned = "0";
    	}
    	return cleaned;
    }
    
    private List<String> cleanStringArray(String[] arr){
    	List<String> correctedVal= new ArrayList<String>();
    	for(String s : arr){
    		String cleandedVal = cleanField(s);
    		correctedVal.add(cleandedVal);
    	}
    	return correctedVal;
    };
    
    private List<String> loadRicursive(String[] arr, int first, int cell_offset){
    	List<String> correctedVal = new ArrayList<String>();
    	for(int i = (first + OCCUPANCY_CELLS_FIRSTVAL); i < arr.length; i+=cell_offset){
    		String cleandedVal = cleanField(arr[i]);
    		correctedVal.add(cleandedVal);
    	}
    	return correctedVal;
    };
    
    public long[] getPeriodFromYearAndMonth(int year, int month){
    	long[] period = {0L,0L};
    	Calendar c = Calendar.getInstance();
		c.set(Calendar.YEAR, year);
		c.set(Calendar.MONTH, month);
		c.set(Calendar.DAY_OF_MONTH, 1);
		c.set(Calendar.HOUR, 0);
		c.set(Calendar.AM_PM, Calendar.AM);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
    	long start = c.getTimeInMillis();
    	c.set(Calendar.MONTH, month + 1);
    	long end = c.getTimeInMillis() - (1000 * 60 * 60 * 10);	// first day (month + 1) - 10 ore
    	period[0] = start;
    	period[1] = end;
    	return period;
    };
    
    public long getTimeStampFromYearAndMonth(int year, int month){
    	Calendar c = Calendar.getInstance();
		c.set(Calendar.YEAR, year);
		c.set(Calendar.MONTH, month);
		c.set(Calendar.DAY_OF_MONTH, 1);
		c.set(Calendar.HOUR, 0);
		c.set(Calendar.AM_PM, Calendar.AM);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
    	long tstamp = c.getTimeInMillis();
    	return tstamp;
    };
    
	private double distance(double lat1, double lon1, double lat2, double lon2, char unit) {
		double theta = lon1 - lon2;
		double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
		dist = Math.acos(dist);
		dist = rad2deg(dist);
		dist = dist * 60 * 1.1515;
		if (unit == 'K') {
			dist = dist * 1.609344;
		} else if (unit == 'N') {
			dist = dist * 0.8684;
		}
		return (dist);
	}
	
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	/*::  This function converts decimal degrees to radians             :*/
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	private double deg2rad(double deg) {
		return (deg * Math.PI / 180.0);
	}
		 
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	/*::  This function converts radians to decimal degrees             :*/
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	private double rad2deg(double rad) {
		return (rad * 180 / Math.PI);
	}


}
