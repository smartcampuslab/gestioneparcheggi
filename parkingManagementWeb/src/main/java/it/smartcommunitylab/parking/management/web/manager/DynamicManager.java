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
import it.smartcommunitylab.parking.management.web.bean.PointBean;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.converter.ModelConverter;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.model.HistoricalEaster;
import it.smartcommunitylab.parking.management.web.model.ItaHolidays;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.BikePoint;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.Zone;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
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
					List<String> zones = tmp.getZones();
					StreetBean s = ModelConverter.convert(tmp, StreetBean.class);
					for(String zona : zones){
						if((zona.compareTo(z.getId()) == 0) && (tmp.getId_app().compareTo(z.getId_app()) == 0)){
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
				List<String> zones = tmp.getZones();
				StreetBean s = ModelConverter.convert(tmp, StreetBean.class);
				for(String zona : zones){
					if((zona.compareTo(z.getId()) == 0) && (tmp.getId_app().compareTo(z.getId_app()) == 0)){
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
					
					DataLogBean dl = new DataLogBean();
					dl.setObjId("@" + temp.getId_app() + "@street@" + vb.getId());
					dl.setType("street");
					dl.setUpdateTime(timestamp);
					// set new fields ---------
					Calendar cal = Calendar.getInstance();
					cal.setTimeInMillis(timestamp);
					dl.setYear(cal.get(Calendar.YEAR) + "");
					dl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
					int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
					dl.setWeek_day(dayOfWeek + "");
					dl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
					boolean isHolyday = isAHoliday(cal, temp.getId_app());
					dl.setHolyday(isHolyday);
					//---------------------------
					Integer oldVersion = getLastVersion(dl.getObjId());
					dl.setVersion(new Integer(oldVersion.intValue() + 1));
					if(temp.getGeometry() != null){
						dl.setLocation(temp.getGeometry().getPointBeans().get(0));	// I get the first element of the line
					}
					dl.setDeleted(false);
					//dl.setContent(temp.toJSON());
					@SuppressWarnings("unchecked")
					Map<String,Object> map = ModelConverter.convert(temp, Map.class);
					dl.setContent(map);
					mongodb.save(dl);
					logger.error(String.format("Updated street: %s", temp.toString()));
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
	
	public BikePointBean editBikePoint(BikePointBean bp, Long timestamp)
			throws NotFoundException {
		BikePoint bike = findById(bp.getId(), BikePoint.class);
//		bici.setName(pb.getName());
//		bici.getGeometry().setLat(pb.getGeometry().getLat());
//		bici.getGeometry().setLng(pb.getGeometry().getLng());
		// Dynamic Data
		bike.setSlotNumber(bp.getSlotNumber());
		bike.setBikeNumber(bp.getBikeNumber());
		bike.setLastChange(timestamp);
		mongodb.save(bike);
		
		DataLogBean dl = new DataLogBean();
		dl.setObjId("@" + bike.getId_app() + "@bikePoint@" + bp.getId());
		dl.setType("bikePoint");
		dl.setUpdateTime(timestamp);
		// set new fields -----------
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestamp);
		dl.setYear(cal.get(Calendar.YEAR) + "");
		dl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
		int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
		dl.setWeek_day(dayOfWeek + "");
		dl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
		boolean isHolyday = isAHoliday(cal, bike.getId_app());
		dl.setHolyday(isHolyday);
		//---------------------------
		Integer oldVersion = getLastVersion(dl.getObjId());
		dl.setVersion(new Integer(oldVersion.intValue() + 1));
		if(bike.getGeometry() != null){
			PointBean point = new PointBean();
			point.setLat(bike.getGeometry().getLat());
			point.setLng(bike.getGeometry().getLng());
			dl.setLocation(point);
		}
		dl.setDeleted(false);
		@SuppressWarnings("unchecked")
		Map<String,Object> map = ModelConverter.convert(bike, Map.class);
		dl.setContent(map);
		mongodb.save(dl);
		
		return bp;
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
		
		DataLogBean dl = new DataLogBean();
		dl.setObjId("@" + entity.getId_app() + "@parkingStructure@" + entityBean.getId());
		dl.setType("parkingStructure");
		dl.setUpdateTime(timestamp);
		// set new fields ---------
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestamp);
		dl.setYear(cal.get(Calendar.YEAR) + "");
		dl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
		int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
		dl.setWeek_day(dayOfWeek + "");
		dl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
		boolean isHolyday = isAHoliday(cal, entity.getId_app());
		dl.setHolyday(isHolyday);
		//---------------------------
		Integer oldVersion = getLastVersion(dl.getObjId());
		dl.setVersion(new Integer(oldVersion.intValue() + 1));
		if(entity.getGeometry() != null){
			PointBean point = new PointBean();
			point.setLat(entity.getGeometry().getLat());
			point.setLng(entity.getGeometry().getLng());
			dl.setLocation(point);
		}
		dl.setDeleted(false);
		//dl.setContent(entity.toJSON());
		@SuppressWarnings("unchecked")
		Map<String,Object> map = ModelConverter.convert(entity, Map.class);
		dl.setContent(map);
		mongodb.save(dl);
		
		return entityBean;
	}
	
	// --------------- For holidays query -----------------
	private List<ItaHolidays> getAllHolydays(String appId){
		List<ItaHolidays> result = new ArrayList<ItaHolidays>();
		for (ItaHolidays ih : mongodb.findAll(ItaHolidays.class)) {
			if(ih.getApp_id().compareTo(appId) == 0){
				result.add(ih);
			}
		}
		return result;
	}
	
	private ItaHolidays findHolydaysByDate(Integer month, Integer day, String appId){
		ItaHolidays result = null;
		for (ItaHolidays ih : mongodb.findAll(ItaHolidays.class)) {
			logger.error(String.format("finded holiday: %s", ih.getName()));
			if(ih.getApp_id().compareTo(appId) == 0 || ih.getApp_id().compareTo("all") == 0){
				logger.error(String.format("finded holiday: %s", ih.getName()));
				if(ih.getMonth() == month && ih.getDay() == day){
					result = ih;
				}
			}
		}
		return result;
	}
	
	private List<HistoricalEaster> getAllEasterMondays(){
		List<HistoricalEaster> result = new ArrayList<HistoricalEaster>();
		for (HistoricalEaster he : mongodb.findAll(HistoricalEaster.class)) {
			result.add(he);
		}
		return result;
	}
	
	private HistoricalEaster findEasterMondaysByDate(Integer year, Integer month, Integer day){
		HistoricalEaster result = null;
		for (HistoricalEaster he : mongodb.findAll(HistoricalEaster.class)) {
			if(he.getYear() == year && he.getMonth() == month && he.getDay() == day){
				result = he;
			}
		}
		return result;
	}
	
	// -----------------------------------------------------

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
	
	private Integer getLastVersion(String objId){
		Integer version = new Integer(0);
		Query q = new Query();
		q.addCriteria(Criteria.where("objId").is(objId));
		q.sort().on("updateTime", Order.DESCENDING);
		List<DataLogBean> result = mongodb.find(q, it.smartcommunitylab.parking.management.web.bean.DataLogBean.class);
		if(result != null && result.size() > 0){
			version = result.get(0).getVersion();
			//logger.info(String.format("Version finded: %d", version ));
		}
		return version;
	}
	
	/**
	 * Method used to calculate if a specific date is holiday or not
	 * @param cal: imput calendar object
	 * @return true if holiday, false if not
	 */
	private boolean isAHoliday(Calendar cal, String appId){
		boolean isHoliday = false;
		// here I have to cover all the cases: public holidays in Ita, year holidays, city holidays
		int wd = cal.get(Calendar.DAY_OF_WEEK);
		if(wd == Calendar.SUNDAY){
			isHoliday = true;
		} else {
			if(findHolydaysByDate(cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH), appId) != null){
				isHoliday = true;
			}
		}
		if(wd == Calendar.MONDAY){
			if(findEasterMondaysByDate(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH)) != null){
				isHoliday = true;
			}
		}
		logger.error(String.format("isAHoliday function: day of week %d, day %d, month %d", wd, cal.get(Calendar.DAY_OF_MONTH), cal.get(Calendar.MONTH) + 1));
		
		return isHoliday;
	};

}
