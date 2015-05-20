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

import it.smartcommunitylab.parking.management.web.auxiliary.model.LastChange;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.auxiliary.services.PolylineEncoder;
import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.PointBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.converter.ModelConverter;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.DynamicManager;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;
import it.smartcommunitylab.parking.management.web.model.DataLog;
import it.smartcommunitylab.parking.management.web.model.geo.Point;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.Circle;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import org.json.JSONArray;
import org.json.JSONObject;

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
	private MongoTemplate mongodb;

	@Value("${parking.agencies}")
	private String parkingAgencies;

	@Value("${street.agencies}")
	private String streetAgencies;
	
	private static final Logger logger = Logger.getLogger(GeoObjectManager.class);
	private static final int PHYSICS_DELETION = 1;
	private static final int LOGIC_DELETION = 2;
	
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
	
	public void updateDynamicStreetData(Street s, String agencyId, String authorId) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		//currTime = 1419462000000L; // Christmas Day 2014
		//currTime = 1428271200000L; // Easter Monday 2015
		//currTime = 1431813600000L; // A Sunday
		dynamicManager.editStreetAux(s, currTime, agencyId, authorId);
	}
	
	public void updateDynamicParkingData(Parking object, String agencyId, String authorId) throws Exception, NotFoundException {
		long currTime = System.currentTimeMillis();
		dynamicManager.editParkingStructureAux(object, currTime, agencyId, authorId);
	}
	
	public List<DataLogBean> getStreetLogsByIdDyn(String id, String agency, int count) {
		return getLogsById(id, agency, count, it.smartcommunitylab.parking.management.web.auxiliary.model.Street.class.getCanonicalName());
	}
	public List<DataLogBean> getParkingLogsByIdDyn(String id, String agency, int count) {
		return getLogsById(id, agency, count, Parking.class.getCanonicalName());
	}

	private List<DataLogBean> getLogsById(String id, String agency, int count, String type) {
		return dynamicManager.getLogsById(id, agency, count, type);
	}
	
	public List<DataLogBean> getLogsByAuthorDyn(String authorId, String agency, int count) {
		return dynamicManager.getLogsByAuthor(authorId, agency, count);
	}
	
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
		storageManager.setAppId(inCriteria.get("agency").toString());
		List<StreetBean> myStreets = storageManager.getAllStreets();
		for(int i = 0; i < myStreets.size(); i++){
			Street s = castPMStreetBeanToStreet(myStreets.get(i));
			if(circle != null){
				// here I have to create a specific filter for position distances from circle center and distances < radius
				logger.error(String.format("Circle params: lat:%s, lng:%s, radius:%s", circle.getCenter().getX(), circle.getCenter().getY(), circle.getRadius()));
				logger.error(String.format("Streets: lat:%s, lng:%s", s.getPosition()[0], s.getPosition()[1]));
				double dist = distance(circle.getCenter().getX(), circle.getCenter().getY(), s.getPosition()[0], s.getPosition()[1],'K');
				logger.error(String.format("distance: %s", dist));
				if(dist  <= circle.getRadius()){
					listaObj.add(s);
				}
			} else {
				listaObj.add(s);
			}
		}
		logger.error(String.format("Streets found: %s", listaObj.size()));
		
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
		storageManager.setAppId(inCriteria.get("agency").toString());
		List<ParkingStructureBean> myStructures = storageManager.getAllParkingStructure();
		
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
	
	private <T> T findById(String id, Class<T> javaClass)
			throws NotFoundException {
		T result = mongodb.findById(id, javaClass);
		if (result == null) {
			throw new NotFoundException();
		}
		return result;
	}
	
	
	private Street castStreetJSONToObject(String value){
		logger.error(String.format("Street to be casted : %s", value));
		JSONObject jsonStreet = new JSONObject(value);

		Street s = new Street();
		s.setId(jsonStreet.getString("id"));
		s.setAgency(jsonStreet.getString("agency"));
		s.setSlotsFree(Integer.valueOf(jsonStreet.getInt("slotsFree")));
		s.setSlotsPaying(Integer.valueOf(jsonStreet.getInt("slotsPaying")));
		s.setSlotsTimed(Integer.valueOf(jsonStreet.getInt("slotsTimed")));
		s.setName(jsonStreet.getString("name"));
		s.setPolyline(jsonStreet.getString("polyline"));
		//String pos = jsonStreet.getString("position");
		//if(pos != null && pos.length() > 0){
		//	String[] pos_string = pos.split(",");
		//	double[] pos_double = new double[2];
		//	pos_double[0] = Double.valueOf(pos_string[0]);
		//	pos_double[1] = Double.valueOf(pos_string[1]);
		//	s.setPosition(pos_double);
		//}
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
		s.setSlotsFree(street.getFreeParkSlotNumber());
		s.setSlotsPaying(street.getPaidSlotNumber());
		s.setSlotsTimed(street.getTimedParkSlotNumber());
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
		p.setName(park.getName());
		if(park.getGeometry()!= null){
			p.setPosition(new double[]{park.getGeometry().getLat(), park.getGeometry().getLng()});
		}
		p.setDescription(park.getFee() + ", " + park.getManagementMode());
		return p;
	}

	
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
