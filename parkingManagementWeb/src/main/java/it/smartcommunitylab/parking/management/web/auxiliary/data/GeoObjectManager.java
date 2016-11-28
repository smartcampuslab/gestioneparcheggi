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
import it.smartcommunitylab.parking.management.web.model.slots.VehicleType;
import it.smartcommunitylab.parking.management.web.repository.DataLogBeanTP;
import it.smartcommunitylab.parking.management.web.repository.DataLogRepositoryDao;
import it.smartcommunitylab.parking.management.web.utils.VehicleTypeDataSetup;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
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
	@Autowired
	private VehicleTypeDataSetup vehicleTypeDataSetup;
	
	private static final Logger logger = Logger.getLogger(GeoObjectManager.class);
	private static final int OCCUPANCY_CELLS_OFFSET = 8;
	private static final int OCCUPANCY_PS_CELLS_OFFSET = 4;
	private static final int OCCUPANCY_CELLS_FIRSTVAL = 4;
	private static final String OCC = "Occupazione";
	private static final String LC = "LC";
	private static final String LS = "LS";
	private static final String P = "P";
	private static final String DO = "DO";
	private static final String R = "R";
	private static final String H = "H";
	private static final String E = "E";
	private static final String CeS = "C/S";
	private static final String RO = "RO";
	private static final String CS = "CS";
	private static final String ND = "ND";
	
	public List<Parking> getParkings(String agency, String agencyId) throws Exception { 
		return searchParkings((Circle)null, Collections.<String,Object>singletonMap("agency", agency), agencyId); //(Circle)null,
	}
	
	public List<Parking> getParkings(String agency, double lat, double lon, double radius, String agencyId) throws Exception {
		return searchParkings(new Circle(lat, lon, radius), Collections.<String,Object>singletonMap("agency", agency), agencyId); //new Circle(lat, lon, radius),
	}
	
	public List<Street> getStreets(String agency, String agencyId) throws Exception {
		return searchStreets((Circle)null, Collections.<String,Object>singletonMap("agency", agency), agencyId); //(Circle)null, 
	}
	
	public List<Street> getStreets(String agency, double lat, double lon, double radius, String agencyId) throws Exception {
		return searchStreets(new Circle(lat, lon, radius), Collections.<String,Object>singletonMap("agency", agency), agencyId); //new Circle(lat, lon, radius),
	}
	
	public List<ParkMeter> getParkingMeters(String agency, String agencyId) throws Exception { 
		return searchParkingMeters((Circle)null, Collections.<String,Object>singletonMap("agency", agency), agencyId); //(Circle)null,
	}
	
	public ParkMeter getParkingMeterFromCode(String agency, String code, String agencyId) throws Exception { 
		ParkMeter park = null;
		boolean find = false;
		//return 
		List<ParkMeter> all = searchParkingMeters((Circle)null, Collections.<String,Object>singletonMap("agency", agency), agencyId);
		for(int i = 0; i < all.size() && !find; i++){
			ParkMeter p = all.get(i);
			if(p.getCode().compareTo(code) == 0){
				park = p;
				find = true;
			}
		}
		return park;
	}
	
	public ParkStruct getParkingStructureByName(String name, String appId, String agencyId) throws Exception{
		ParkStruct pstruct = null;
		boolean find = false;
		//return 
		List<ParkStruct> all = searchParkingStructures((Circle)null, Collections.<String,Object>singletonMap("agency", appId), agencyId);
		for(int i = 0; i < all.size() && !find; i++){
			ParkStruct ps = all.get(i);
			if(ps.getName().compareToIgnoreCase(name) == 0){
				pstruct = ps;
				find = true;
			}
		}
		return pstruct;
	}
	
	public Street getStreetByName(String name, String appId, String agencyId) throws Exception{
		Street street = null;
		boolean find = false;
		//return 
		List<Street> all = searchStreets((Circle)null, Collections.<String,Object>singletonMap("agency", appId), agencyId);
		for(int i = 0; i < all.size() && !find; i++){
			Street s = all.get(i);
			if(s.getName().compareToIgnoreCase(name) == 0){
				street = s;
				find = true;
			}
		}
		return street;
	}
	
	public Parking getParkingByName(String name, String appId, String agencyId) throws Exception{
		Parking park = null;
		boolean find = false;
		//return 
		List<Parking> all = searchParkings((Circle)null, Collections.<String,Object>singletonMap("agency", appId), agencyId);
		for(int i = 0; i < all.size() && !find; i++){
			Parking pk = all.get(i);
			if(pk.getName().compareToIgnoreCase(name) == 0){
				park = pk;
				find = true;
			}
		}
		return park;
	}	
	
	public List<ParkMeter> getParkingMeters(String agency, double lat, double lon, double radius, String agencyId) throws Exception {
		return searchParkingMeters(new Circle(lat, lon, radius), Collections.<String,Object>singletonMap("agency", agency), agencyId); //new Circle(lat, lon, radius),
	}
	
	public void updateDynamicStreetData(Street s, String agencyId, String channelId, String userAgencyId, boolean sysLog, String username, String author, long[] period, int p_type) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		if(s.getUpdateTime() != null){
			currTime = s.getUpdateTime();
		}
		dynamicManager.editStreetAux(s, currTime, agencyId, channelId, userAgencyId, sysLog, username, author, period, p_type);
	}
	
	public void updateDynamicParkingData(Parking object, String agencyId, String channelId, String userAgency, boolean sysLog, String username, String author, long[] period, int p_type) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		if(object.getUpdateTime() != null){
			currTime = object.getUpdateTime();
		}
		dynamicManager.editParkingStructureAux(object, currTime, agencyId, channelId, userAgency, sysLog, username, author, period, p_type);
	}
	
	public void updateDynamicParkingMeterData(ParkMeter object, String agencyId, String authorId, String userAgencyId, boolean sysLog, String username, String author, Long from, Long to, long[] period, int p_type) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		Long startTime = null;
		if(from != null && to != null){
			currTime = to;
			startTime = from;
		} else if(object.getUpdateTime() != null){
			currTime = object.getUpdateTime();
		}
		dynamicManager.editParkingMeterAux(object, currTime, startTime, agencyId, authorId, userAgencyId, sysLog, username, author, period, p_type);
	}
	
	public void updateDynamicParkStructProfitData(ParkStruct object, String agencyId, String authorId, String userAgency, boolean sysLog, String username, String author, Long from, Long to, long[] period, int p_type) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		Long startTime = null;
		if(from != null && to != null){
			currTime = to;
			startTime = from;
		} else if(object.getUpdateTime() != null){
			currTime = object.getUpdateTime();
		}
		dynamicManager.editParkStructProfitAux(object, currTime, startTime, agencyId, authorId, userAgency, sysLog, username, author, period, p_type);
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
	
	public List<DataLogBeanTP> findAllLogsByAgency(String agency, String userAgency, Integer skip, Integer count){
		//return dynamicManager.findTPAll(agency, false, skip, count);
		return dynamicManager.findTPAllByUserAgency(agency, userAgency, false, skip, count);
	};

	public Long countAllLogsByAgency(String agency, String userAgency) {
		return dynamicManager.countTPAll(agency, userAgency, false);
	}

	public List<DataLogBeanTP> findAllLogsByAgencyAndType(String agency, String userAgency, String type, Integer skip, Integer count){
		return dynamicManager.findTPTypedByUserAgency(agency, userAgency, false, type, skip, count);
	};

	public Long countAllLogsByAgencyAndType(String agency, String userAgency, String type) {
		return dynamicManager.countTPTyped(agency, userAgency, false, type);
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
	
	public List<Street> searchStreets(Circle circle, Map<String, Object> inCriteria, String agencyId) throws Exception { //Circle circle
		return searchStreets(circle, inCriteria, 0, 0, agencyId);//circle,
	}
	
	public List<Street> searchStreets(Circle circle, Map<String, Object> inCriteria, int limit, int skip, String agencyId) throws Exception { //Circle circle
		//Criteria criteria = createSearchCriteria(type, circle, inCriteria); //circle,
		//Query query = Query.query(criteria);
		//if (limit > 0) query.limit(limit);
		//if (skip > 0) query.skip(skip);

		List<Street> listaObj = new ArrayList<Street>();
		//storageManager.setAppId(inCriteria.get("agency").toString());
		List<StreetBean> myStreets = storageManager.getAllStreetsByAgencyId(inCriteria.get("agency").toString(), agencyId);
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
	
	public List<Parking> searchParkings(Circle circle, Map<String, Object> inCriteria , String agencyId) throws Exception { //Circle circle
		return searchParkings(circle, inCriteria, 0, 0, agencyId);//circle,
	}
	
	public List<Parking> searchParkings(Circle circle, Map<String, Object> inCriteria, int limit, int skip, String agencyId) throws Exception { //Circle circle
//		Criteria criteria = createSearchCriteria(type, circle, inCriteria); //circle,
//		Query query = Query.query(criteria);
//		if (limit > 0) query.limit(limit);
//		if (skip > 0) query.skip(skip);
		
		//logger.error(String.format("Search Parking limit %s, skip %s, query %s, class %s", limit, skip, query.getHint(), type));
		
		List<Parking> listaObj = new ArrayList<Parking>();
		//storageManager.setAppId(inCriteria.get("agency").toString());
		List<ParkingStructureBean> myStructures = storageManager.getAllParkingStructureByAgencyId(inCriteria.get("agency").toString(), agencyId);
		
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
	
	public List<ParkMeter> searchParkingMeters(Circle circle, Map<String, Object> inCriteria, String agencyId) throws Exception { //Circle circle
		return searchParkingMeters(circle, inCriteria, 0, 0, agencyId);//circle,
	}
	
	public List<ParkMeter> searchParkingMeters(Circle circle, Map<String, Object> inCriteria, int limit, int skip, String agencyId) throws Exception { //Circle circle	
		//logger.error(String.format("Search Parking limit %s, skip %s, query %s, class %s", limit, skip, query.getHint(), type));
		List<ParkMeter> listaObj = new ArrayList<ParkMeter>();
		List<ParkingMeterBean> myParkingMeters = storageManager.getAllParkingMetersByAgencyId(inCriteria.get("agency").toString(), agencyId);
		
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
	
	public List<ParkStruct> searchParkingStructures(Circle circle, Map<String, Object> inCriteria, String agencyId) throws Exception { //Circle circle
		return searchParkingStructures(circle, inCriteria, 0, 0, agencyId);//circle,
	}	
	
	public List<ParkStruct> searchParkingStructures(Circle circle, Map<String, Object> inCriteria, int limit, int skip, String agencyId) throws Exception { //Circle circle	
		List<ParkStruct> listaObj = new ArrayList<ParkStruct>();
		List<ParkingStructureBean> myParkingStructures = storageManager.getAllParkingStructureByAgencyId(inCriteria.get("agency").toString(), agencyId);
		
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
		// TODO update slots uploading from json
		/*if(park.getPayingSlotNumber() != null){
			p.setSlotsPaying(park.getPayingSlotNumber());
		}
		if(park.getHandicappedSlotNumber() != null){
			p.setSlotsHandicapped(park.getHandicappedSlotNumber());
		}*/
		p.setSlotsConfiguration(ModelConverter.toVehicleSlotList(park.getSlotsConfiguration(), null));
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
	
	public ArrayList<PSOccupancyData> classStringToOPSObjArray(String data, String agency) throws Exception {
    	logger.debug(String.format("Map Object data: %s", data));
    	
    	ArrayList<PSOccupancyData> correctData = new ArrayList<PSOccupancyData>();
    	
    	String[] allRecords = data.split("\n");
    	String year = "";
    	FilterPeriod period = new FilterPeriod();
    	String vehicleType = "Car";
    	
    	List<String> slotsKeys = null;
    	for(int i = 0; i < allRecords.length; i++){
    		String[] att_and_vals = allRecords[i].split(",");
    		if(att_and_vals != null && att_and_vals.length > 0){
	    		if(att_and_vals[0].compareTo("Nome") != 0){	// to skip header records
	    			if(att_and_vals[0].compareTo("Anno") == 0){
	        			year = att_and_vals[1];
	        	    	period.setYear(year);
	        		} else {
	        			if(att_and_vals[0].compareTo("Tipo Veicolo") == 0){
	        				vehicleType = retrieveVehicleTypeByDesc(att_and_vals[1], agency);
	        			} else {
		        			if(att_and_vals.length > 2 && att_and_vals[0].compareTo("") != 0){
		        				PSOccupancyData tmpPSOcc = new PSOccupancyData();
		        				tmpPSOcc.setpName(cleanField(att_and_vals[0]));
		        				tmpPSOcc.setpAddress(cleanField(att_and_vals[1]));
		        				tmpPSOcc.setPeriod(period);
		        				
		        				List<String> lcSlots = initEmptyList();
		        				List<String> lsSlots = initEmptyList();
		        				List<String> pSlots = initEmptyList();
		        				List<String> doSlots = initEmptyList();
		        				List<String> hSlots = initEmptyList();
		        				List<String> rSlots = initEmptyList();
		        				List<String> eSlots = initEmptyList();
		        				List<String> c_sSlots = initEmptyList();
		        				List<String> roSlots = initEmptyList();
		        				List<String> csSlots = initEmptyList();
		        				List<String> ndSlots = initEmptyList();
		        				// here I load the vals
		        				if(slotsKeys.contains(LC)){
		        					lcSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(LC), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(LS)){
		        					lsSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(LS), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(P)){
		        					pSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(P), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(DO)){
		        					doSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(DO), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(H)){
		        					hSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(H), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(R)){
		        					rSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(R), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(P)){
		        					pSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(P), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(DO)){
		        					doSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(DO), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(H)){
		        					hSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(H), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(R)){
		        					rSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(R), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(E)){
		        					eSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(E), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(CeS)){
		        					c_sSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(CeS), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(RO)){
		        					roSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(RO), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(CS)){
		        					csSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(CS), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(ND)){
		        					ndSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(ND), slotsKeys.size() + 1);
		        				}
		        				tmpPSOcc.setVehicleType(vehicleType);
		        				tmpPSOcc.setOccLC(lcSlots);
		        				tmpPSOcc.setOccLS(lsSlots);
		        				tmpPSOcc.setOccP(pSlots);
		        				tmpPSOcc.setOccDO(doSlots);
		        				tmpPSOcc.setOccH(hSlots);
		        				tmpPSOcc.setOccR(rSlots);
		        				tmpPSOcc.setOccE(eSlots);
		        				tmpPSOcc.setOccC_S(c_sSlots);
		        				tmpPSOcc.setOccRO(roSlots);
		        				tmpPSOcc.setOccCS(csSlots);
		        				tmpPSOcc.setSlotsND(ndSlots);
		        				
		        				logger.error(String.format("Corrected Object: %s", tmpPSOcc.toString()));
		        				correctData.add(tmpPSOcc);
		        			}
	        			}
	        		} 
	    		} else {
        			// here I retrieve the slots configuration
	    			slotsKeys = new ArrayList<String>();
	    			for(int j = 4; j < att_and_vals.length; j++){
	    				if(att_and_vals[j].compareTo(OCC) == 0){
	    					break;
	    				}
	    				slotsKeys.add(att_and_vals[j]);
	    			}
        		}
    		}
    	}
    	return correctData;
    }
	
	// Method used to retrieve the vehicle name key from the type specified in the xls file
	private String retrieveVehicleTypeByDesc(String desc, String agency){
		String myType = "";
		List<VehicleType> allVehicles = vehicleTypeDataSetup.findVehicleTypeByAppId(agency);
		for(VehicleType vt : allVehicles){
			if(vt.getDescription().contains(desc.toLowerCase())){
				myType = vt.getName();
				break;
			}
		}
		return myType;
	}
	
	private List<String> initEmptyList(){
		List<String> corrList = new ArrayList<String>();
		for(int i = 0; i < 12; i++){
			corrList.add("-1");
		}
		return corrList;
	}
	
	public ArrayList<SOccupancyData> classStringToOSObjArray(String data, String agency) throws Exception{
    	logger.debug(String.format("Map Object data: %s", data));
    	ArrayList<SOccupancyData> correctData = new ArrayList<SOccupancyData>();
    	
    	String[] allRecords = data.split("\n");
    	String year = "";
    	FilterPeriod period = new FilterPeriod();
    	String vehicleType = "Car";
    	
    	List<String> slotsKeys = null;
    	for(int i = 0; i < allRecords.length; i++){
    		String[] att_and_vals = allRecords[i].split(",");
    		if(att_and_vals != null && att_and_vals.length > 0){
	    		if(att_and_vals[0].compareTo("Nome") != 0){	// to skip header records
	    			if(att_and_vals[0].compareTo("Anno") == 0){
	        			year = att_and_vals[1];
	        	    	period.setYear(year);
	        		} else {
	        			if(att_and_vals[0].compareTo("Tipo Veicolo") == 0){
	        				vehicleType = retrieveVehicleTypeByDesc(att_and_vals[1], agency);
	        			} else {
		        			if(att_and_vals.length > 2 && att_and_vals[0].compareTo("") != 0){
		        				SOccupancyData tmpSOcc = new SOccupancyData();
		        				tmpSOcc.setsName(cleanField(att_and_vals[0]));
		        				tmpSOcc.setsArea(cleanField(att_and_vals[1]));
		        				tmpSOcc.setPeriod(period);
		        				
		        				List<String> lcSlots = initEmptyList();
		        				List<String> lsSlots = initEmptyList();
		        				List<String> pSlots = initEmptyList();
		        				List<String> doSlots = initEmptyList();
		        				List<String> hSlots = initEmptyList();
		        				List<String> rSlots = initEmptyList();
		        				List<String> eSlots = initEmptyList();
		        				List<String> c_sSlots = initEmptyList();
		        				List<String> roSlots = initEmptyList();
		        				List<String> csSlots = initEmptyList();
		        				List<String> ndSlots = initEmptyList();
		        				// here I load the vals
		        				if(slotsKeys.contains(LC)){
		        					lcSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(LC), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(LS)){
		        					lsSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(LS), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(P)){
		        					pSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(P), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(DO)){
		        					doSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(DO), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(H)){
		        					hSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(H), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(R)){
		        					rSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(R), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(P)){
		        					pSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(P), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(DO)){
		        					doSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(DO), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(H)){
		        					hSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(H), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(R)){
		        					rSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(R), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(E)){
		        					eSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(E), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(CeS)){
		        					c_sSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(CeS), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(RO)){
		        					roSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(RO), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(CS)){
		        					csSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(CS), slotsKeys.size() + 1);
		        				}
		        				if(slotsKeys.contains(ND)){
		        					ndSlots = loadRicursive(att_and_vals, slotsKeys.indexOf(ND), slotsKeys.size() + 1);
		        				}
		        				tmpSOcc.setVehicleType(vehicleType);
		        				tmpSOcc.setOccLC(lcSlots);
		        				tmpSOcc.setOccLS(lsSlots);
		        				tmpSOcc.setOccP(pSlots);
		        				tmpSOcc.setOccDO(doSlots);
		        				tmpSOcc.setOccH(hSlots);
		        				tmpSOcc.setOccR(rSlots);
		        				tmpSOcc.setOccE(eSlots);
		        				tmpSOcc.setOccC_S(c_sSlots);
		        				tmpSOcc.setOccRO(roSlots);
		        				tmpSOcc.setOccCS(csSlots);
		        				tmpSOcc.setSlotsND(ndSlots);
		        				
		        				logger.error(String.format("Corrected Object: %s", tmpSOcc.toString()));
		        				correctData.add(tmpSOcc);
		        			}
	        			}
	        		}
	    		} else {
	    			// here I retrieve the slots configuration
	    			slotsKeys = new ArrayList<String>();
	    			for(int j = 4; j < att_and_vals.length; j++){
	    				if(att_and_vals[j].compareTo(OCC) == 0){
	    					break;
	    				}
	    				slotsKeys.add(att_and_vals[j]);
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
    	String month = "";
    	FilterPeriod period = new FilterPeriod();
    	int days_in_month = 30;
    	
    	for(int i = 0; i < allRecords.length; i++){
    		//TODO: here I have to check the data list and understand if the value are in horizontal mode or in vertical mode
    		String[] att_and_vals = allRecords[i].split(",");
    		if(att_and_vals != null && att_and_vals.length > 0){
	    		if(att_and_vals[0].compareTo("Parcom") != 0){	// to skip header records
	    			if(att_and_vals[0].compareTo("Anno") == 0){
	        			year = att_and_vals[1];
	        	    	period.setYear(year);
	        		} else if(att_and_vals[0].compareTo("Mese") == 0){
	        			month = att_and_vals[1];
	        			String[] months = new String[1];
	        			months[0] = month;
	        	    	period.setMonth(months);
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
		        				if(month == null || month.compareTo("") == 0){
			        				// month values
		        					String[] vals = Arrays.copyOfRange(att_and_vals, 2, 14);						// 14 are tot values
			        				String[] tickets = null;
			        				try {
			        					tickets = Arrays.copyOfRange(att_and_vals, 15, att_and_vals.length - 1);	// 27 are tot values
			        				} catch(Exception ex){
			        					logger.error("Exception in tickets reading: no value. " + ex.getMessage());
			        				}
			        				tmpPProfit.setProfitVals(cleanStringArray(vals));
			        				if(tickets != null){
			        					tmpPProfit.setTickets(cleanStringArray(tickets));
			        				}
		        				} else {
		        					// day values
		        					int dinamycTot = days_in_month + 2;
		        					String[] vals = Arrays.copyOfRange(att_and_vals, 2, dinamycTot);						// 14 are tot values
			        				String[] tickets = null;
			        				try {
			        					tickets = Arrays.copyOfRange(att_and_vals, dinamycTot + 1, att_and_vals.length - 1);	// 27 are tot values
			        				} catch(Exception ex){
			        					logger.error("Exception in tickets reading: no value. " + ex.getMessage());
			        				}
			        				tmpPProfit.setProfitVals(cleanStringArray(vals));
			        				if(tickets != null){
			        					tmpPProfit.setTickets(cleanStringArray(tickets));
			        				}
		        				}
		        				
		        				logger.error(String.format("Corrected Object: %s", tmpPProfit.toString()));
		        				correctData.add(tmpPProfit);
		        			}
	        			//}
	        		}
	    		} else {
	    			// heaer line: here I have to count the columns to retrieve the correct number of days in month
	    			if(att_and_vals.length > 50){
	    				// case with tickets
	    				days_in_month = (att_and_vals.length/2) - 2 - 2;
	    			} else {
	    				days_in_month = att_and_vals.length - 2 - 1;
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
	        				String[] tickets = null;
	        				try {
	        					tickets = Arrays.copyOfRange(att_and_vals, 15, att_and_vals.length - 1);	// 27 are tot values
	        				} catch(Exception ex){
	        					logger.error("Exception in tickets reading: no value. " + ex.getMessage());
	        				}
	        				tmpSProfit.setProfitVals(cleanStringArray(vals));
	        				if(tickets != null){
	        					tmpSProfit.setTickets(cleanStringArray(tickets));
	        				}
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
    	return getTimeStampFromParams(year, month, 1, 0);
    };
    
    public long getTimeStampFromYearMonthAndDay(int year, int month, int day){
    	return getTimeStampFromParams(year, month, day, 0);
    };
    
    public long getTimeStampFromParams(int year, int month, int day, int hour){
    	Calendar c = Calendar.getInstance();
		c.set(Calendar.YEAR, year);
		c.set(Calendar.MONTH, month);
		c.set(Calendar.DAY_OF_MONTH, day);
		c.set(Calendar.HOUR, hour);
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
