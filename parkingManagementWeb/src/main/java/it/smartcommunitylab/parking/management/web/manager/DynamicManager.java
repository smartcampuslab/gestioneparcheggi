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

import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkMeter;
import it.smartcommunitylab.parking.management.web.bean.CompactParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.CompactStreetBean;
import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingLog;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.ProfitLogBean;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.StreetLog;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.converter.ModelConverter;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.BikePoint;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.stats.StatKey;
import it.smartcommunitylab.parking.management.web.model.stats.StatValue;
import it.smartcommunitylab.parking.management.web.repository.StatRepository;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONObject;
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
	private static final String freeSlotType = "@free";
	private static final String paidSlotType = "@paid";
	private static final String timedSlotType = "@timed";
	private static final String handicappedSlotType = "@handicapped";
	
	private static final String profit = "@profit";
	private static final String tickets = "@tickets";

	@Autowired
	private MongoTemplate mongodb;
	
	@Autowired
	private StatRepository repo;
	
	// RateArea Methods
	public List<RateAreaBean> getAllArea() {
		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
		for (RateArea a : mongodb.findAll(RateArea.class)) {
			result.add(ModelConverter.convert(a, RateAreaBean.class));
		}
		return result;
	}
	
	public List<RateAreaBean> getAllAreaInAppId(String appId) {
		List<RateAreaBean> result = new ArrayList<RateAreaBean>();
		for (RateArea a : mongodb.findAll(RateArea.class)) {
			if(a != null && a.getId_app().compareTo(appId) == 0){
				result.add(ModelConverter.convert(a, RateAreaBean.class));
			}
		}
		return result;
	}
	
	// ParkingMeter Methods
	public List<ParkingMeterBean> getAllParkingMeters(String appId) {
		List<ParkingMeterBean> result = new ArrayList<ParkingMeterBean>();

		for (RateAreaBean temp : getAllAreaInAppId(appId)) {
			if(temp != null && temp.getId_app().compareTo(appId) == 0){
				result.addAll(getAllParkingMeters(temp, appId));
			}
		}

		return result;
	}
	
	public List<ParkingMeterBean> getAllParkingMeters(RateAreaBean ab, String appId) {
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

	// Street Methods
	public List<StreetBean> getAllStreets(Long timestamp) {
		List<StreetBean> result = new ArrayList<StreetBean>();

		for (RateAreaBean temp : getAllArea()) {
			result.addAll(getAllStreets(temp, timestamp));
		}

		return result;
	}
	
	public List<StreetBean> getAllStreetsInAppId(Long timestamp, String appId) {
		List<StreetBean> result = new ArrayList<StreetBean>();

		for (RateAreaBean temp : getAllAreaInAppId(appId)) {
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

	public StreetBean findStreet(String streetId) {
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		Street s = new Street();
		for (RateArea area : aree) {
			if (area.getStreets() != null) {
				s.setId(streetId);
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
					dl.setTime(timestamp);
					// set new fields ---------
					Calendar cal = Calendar.getInstance();
					cal.setTimeInMillis(timestamp);
					dl.setYear(cal.get(Calendar.YEAR) + "");
					dl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
					int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
					dl.setWeek_day(dayOfWeek + "");
					dl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
					boolean isHolyday = repo.isAHoliday(cal, temp.getId_app());
					dl.setHolyday(isHolyday);
					//---------------------------
					//Integer oldVersion = getLastVersion(dl.getObjId());
					//dl.setVersion(new Integer(oldVersion.intValue() + 1));
					//if(temp.getGeometry() != null){
					//	dl.setLocation(temp.getGeometry().getPointBeans().get(0));	// I get the first element of the line
					//}
					dl.setDeleted(false);
					//dl.setContent(temp.toJSON());
					@SuppressWarnings("unchecked")
					Map<String,Object> map = ModelConverter.convert(temp, Map.class);
					dl.setValue(map);
					mongodb.save(dl);
					logger.error(String.format("Updated street: %s", temp.toString()));
					break;
				}
			}
		}
		return vb;
	}

	public void editStreetAux(it.smartcommunitylab.parking.management.web.auxiliary.model.Street s, Long timestamp, String agencyId, String authorId, boolean sysLog, long[] period) throws DatabaseException {
		String[] ids = s.getId().split("@");
		String pmId = ids[2];
		s.setUpdateTime(timestamp);
		s.setUser(Integer.valueOf(authorId));
		
		RateArea area = null;
		if((s.getAreaId() != null) && (s.getAreaId().compareTo("") != 0)){
			area = mongodb.findById(s.getAreaId(), RateArea.class);
		} else {
			List<RateArea> aree = mongodb.findAll(RateArea.class);
			Street myS = new Street();
			for (RateArea a : aree) {
				if (a.getStreets() != null) {
					myS.setId(pmId);
					int index = a.getStreets().indexOf(s);
					if (index != -1) {
						area = a;
					}
				}
			}
		}
		if (area.getStreets() != null) {
			for (Street temp : area.getStreets()) {
				if (temp.getId().equals(pmId)) {
					// Dynamic data
					temp.setFreeParkSlotOccupied(s.getSlotsOccupiedOnFree());
					//temp.setFreeParkSlotSignOccupied(s.getSlotsOccupiedOnFree());
					temp.setTimedParkSlotOccupied(s.getSlotsOccupiedOnTimed());
					temp.setPaidSlotOccupied(s.getSlotsOccupiedOnPaying());
					temp.setHandicappedSlotOccupied(s.getSlotsOccupiedOnHandicapped());
					temp.setLastChange(timestamp);
					mongodb.save(area);
					
					DataLogBean dl = new DataLogBean();
					dl.setObjId(s.getId());
					dl.setType(it.smartcommunitylab.parking.management.web.auxiliary.model.Street.class.getCanonicalName());
					dl.setTime(timestamp);
					if(period != null && period.length == 2){		// If there is a log period
						Long[] periodLong = {period[0], period[1]};
						dl.setLogPeriod(periodLong);
					}
					dl.setAuthor(authorId);
					dl.setAgency(agencyId);
					// set new fields ---------
					Calendar cal = Calendar.getInstance();
					cal.setTimeInMillis(timestamp);
					dl.setYear(cal.get(Calendar.YEAR) + "");
					dl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
					int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
					dl.setWeek_day(dayOfWeek + "");
					dl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
					boolean isHolyday = repo.isAHoliday(cal, temp.getId_app());
					dl.setHolyday(isHolyday);
					dl.setSystemLog(sysLog);
					//---------------------------
					//Integer oldVersion = getLastVersion(dl.getObjId());
					//dl.setVersion(new Integer(oldVersion.intValue() + 1));
					dl.setDeleted(false);
					//dl.setContent(temp.toJSON());
					@SuppressWarnings("unchecked")
					Map<String,Object> map = ModelConverter.convert(s, Map.class);
					dl.setValue(map);
					JSONObject tmpVal = new JSONObject(map);
					dl.setValueString(tmpVal.toString());
					logger.info(String.format("Value String: %s", tmpVal.toString()));
					//DataLog dlog = ModelConverter.convert(dl, DataLog.class);
					mongodb.save(dl);
					logger.error(String.format("Updated street: %s", temp.toString()));
					// Update Stat report
					int[] total = {s.getSlotsFree(),s.getSlotsPaying(), s.getSlotsTimed()};
					int[] occupied = {s.getSlotsOccupiedOnFree(),s.getSlotsOccupiedOnPaying(), s.getSlotsOccupiedOnTimed(), s.getSlotsUnavailable()};
					double statValue = findOccupationRate(total, occupied, 0, 0, 1);
					if(period == null || period.length == 0){
						repo.updateStats(s.getId(), s.getAgency(), dl.getType(), null, statValue, timestamp);
					} else {
						repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType(), null, statValue, timestamp, period, 1);
					}
					// Here I have to difference the type of the park: total, free, paying and timed - MULTIPARKOCC
					if(countElements(total) > 1){	// Here I check if there are more than one element of park type
						if(s.getSlotsFree()!= 0){
							double freeOccValue = findOccupationRate(null, null, s.getSlotsFree(), s.getSlotsOccupiedOnFree(), 2);
							if(period == null || period.length == 0){
								repo.updateStats(s.getId(), s.getAgency(), dl.getType() + freeSlotType, null, freeOccValue, timestamp);
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + freeSlotType, null, freeOccValue, timestamp, period, 1);
							}
						}
						if(s.getSlotsPaying() != 0){
							double payingOccValue = findOccupationRate(null, null, s.getSlotsPaying(), s.getSlotsOccupiedOnPaying(), 2);
							if(period == null || period.length == 0){
								repo.updateStats(s.getId(), s.getAgency(), dl.getType() + paidSlotType, null, payingOccValue, timestamp);
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + paidSlotType, null, payingOccValue, timestamp, period, 1);
							}
						}
						if(s.getSlotsTimed() != 0){
							double timedOccValue = findOccupationRate(null, null, s.getSlotsTimed(), s.getSlotsOccupiedOnTimed(), 2);
							if(period == null || period.length == 0){
								repo.updateStats(s.getId(), s.getAgency(), dl.getType() + timedSlotType, null, timedOccValue, timestamp);
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + timedSlotType, null, timedOccValue, timestamp, period, 1);
							}
						}
						if(s.getSlotsHandicapped() != 0){
							double handicappedOccValue = findOccupationRate(null, null, s.getSlotsHandicapped(), s.getSlotsOccupiedOnHandicapped(), 2);
							if(period == null || period.length == 0){
								repo.updateStats(s.getId(), s.getAgency(), dl.getType() + handicappedSlotType, null, handicappedOccValue, timestamp);
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + handicappedSlotType, null, handicappedOccValue, timestamp, period, 1);
							}
						}
					}
					break;
				}
			}
		}
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
	
	public List<BikePointBean> getAllBikePointsInAppId(Long timestamp, String appId) {
		List<BikePointBean> result = new ArrayList<BikePointBean>();
		for (BikePoint bp : mongodb.findAll(BikePoint.class)) {
			if(bp != null && bp.getId_app().compareTo(appId) == 0){
				if(timestamp == null){
					result.add(ModelConverter.convert(bp, BikePointBean.class));
				} else {
					if(bp.getLastChange() != null && bp.getLastChange() >= timestamp){
						result.add(ModelConverter.convert(bp, BikePointBean.class));
					}
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
		dl.setTime(timestamp);
		// set new fields -----------
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestamp);
		dl.setYear(cal.get(Calendar.YEAR) + "");
		dl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
		int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
		dl.setWeek_day(dayOfWeek + "");
		dl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
		boolean isHolyday = repo.isAHoliday(cal, bike.getId_app());
		dl.setHolyday(isHolyday);
		//---------------------------
		//Integer oldVersion = getLastVersion(dl.getObjId());
		//dl.setVersion(new Integer(oldVersion.intValue() + 1));
		//if(bike.getGeometry() != null){
		//	PointBean point = new PointBean();
		//	point.setLat(bike.getGeometry().getLat());
		//	point.setLng(bike.getGeometry().getLng());
		//	dl.setLocation(point);
		//}
		dl.setDeleted(false);
		@SuppressWarnings("unchecked")
		Map<String,Object> map = ModelConverter.convert(bike, Map.class);
		dl.setValue(map);
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
	
	public List<ParkingStructureBean> getAllParkingStructureInAppId(Long timestamp, String appId) {
		List<ParkingStructureBean> result = new ArrayList<ParkingStructureBean>();
		for (ParkingStructure entity : mongodb.findAll(ParkingStructure.class)) {
			if(entity != null && entity.getId_app().compareTo(appId) == 0){
				if(timestamp == null){
					result.add(ModelConverter.convert(entity, ParkingStructureBean.class));
				} else {
					if(entity.getLastChange() != null && entity.getLastChange() >= timestamp){
						result.add(ModelConverter.convert(entity, ParkingStructureBean.class));
					}
				}
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
		dl.setTime(timestamp);
		// set new fields ---------
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestamp);
		dl.setYear(cal.get(Calendar.YEAR) + "");
		dl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
		int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
		dl.setWeek_day(dayOfWeek + "");
		dl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
		boolean isHolyday = repo.isAHoliday(cal, entity.getId_app());
		dl.setHolyday(isHolyday);
		//---------------------------
		//Integer oldVersion = getLastVersion(dl.getObjId());
		//dl.setVersion(new Integer(oldVersion.intValue() + 1));
		//if(entity.getGeometry() != null){
		//	PointBean point = new PointBean();
		//	point.setLat(entity.getGeometry().getLat());
		//	point.setLng(entity.getGeometry().getLng());
		//	dl.setLocation(point);
		//}
		dl.setDeleted(false);
		//dl.setContent(entity.toJSON());
		@SuppressWarnings("unchecked")
		Map<String,Object> map = ModelConverter.convert(entity, Map.class);
		dl.setValue(map);
		mongodb.save(dl);
		
		return entityBean;
	}
	
	// Method editParkingStructureAux: used to save a DataLogBean object for the new occupancy data in a parkingStructure
	public void editParkingStructureAux(Parking p, Long timestamp, String agencyId, String authorId, boolean sysLog, long[] period) throws NotFoundException {
		String[] ids = p.getId().split("@");
		String pmId = ids[2];
		p.setUpdateTime(timestamp);
		p.setUser(Integer.valueOf(authorId));
		
		ParkingStructure entity = findById(pmId,ParkingStructure.class);
		
		// Dynamic data
		entity.setSlotOccupied(p.getSlotsOccupiedOnTotal());
		entity.setUnusuableSlotNumber(p.getSlotsUnavailable());
		entity.setLastChange(timestamp);
		
		mongodb.save(entity);
		
		DataLogBean dl = new DataLogBean();
		dl.setObjId(p.getId());
		dl.setType(Parking.class.getCanonicalName());
		dl.setTime(timestamp);
		if(period != null && period.length == 2){		// If there is a log period
			Long[] periodLong = {period[0], period[1]};
			dl.setLogPeriod(periodLong);
		}
		dl.setAuthor(authorId);
		dl.setAgency(agencyId);
		// set new fields ---------
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestamp);
		dl.setYear(cal.get(Calendar.YEAR) + "");
		dl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
		int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
		dl.setWeek_day(dayOfWeek + "");
		dl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
		boolean isHolyday = repo.isAHoliday(cal, entity.getId_app());
		dl.setHolyday(isHolyday);
		dl.setSystemLog(sysLog);
		//---------------------------
		//Integer oldVersion = getLastVersion(dl.getObjId());
		//dl.setVersion(new Integer(oldVersion.intValue() + 1));
		//if(entity.getGeometry() != null){
		//	PointBean point = new PointBean();
		//	point.setLat(entity.getGeometry().getLat());
		//	point.setLng(entity.getGeometry().getLng());
		//	dl.setLocation(point);
		//}
		dl.setDeleted(false);
		//dl.setContent(entity.toJSON());
		@SuppressWarnings("unchecked")
		Map<String,Object> map = ModelConverter.convert(p, Map.class);
		dl.setValue(map);
		JSONObject tmpVal = new JSONObject(map);
		dl.setValueString(tmpVal.toString());
		//DataLog dlog = ModelConverter.convert(dl, DataLog.class);
		mongodb.save(dl);
		// Update Stat report
		int[] total = {p.getSlotsTotal()};
		int[] occupied = {p.getSlotsOccupiedOnTotal(),p.getSlotsUnavailable()};
		double statValue = findOccupationRate(total, occupied, 0, 0, 1);
		if(period == null || period.length == 0){
			repo.updateStats(p.getId(), p.getAgency(), dl.getType(), null, statValue, timestamp);
		} else {
			repo.updateStatsPeriod(p.getId(), p.getAgency(), dl.getType(), null, statValue, timestamp, period, 1);
		}
	}
	
	// Method editParkStructProfitAux: used to save a ProfitLogBean object for the new profit data in a parkingStructure
	public void editParkStructProfitAux(ParkStruct p, Long timestamp, Long startTime, String agencyId, String authorId, boolean sysLog, long[] period) throws NotFoundException {
		String[] ids = p.getId().split("@");
		String pmId = ids[2];
		p.setUpdateTime(timestamp);
		p.setUser(Integer.valueOf(authorId));
		
		ParkingStructure entity = findById(pmId,ParkingStructure.class);
		// Dynamic data
		//entity.setSlotOccupied(p.getSlotsOccupiedOnTotal());
		//entity.setUnusuableSlotNumber(p.getSlotsUnavailable());
		//entity.setLastChange(timestamp);
		//mongodb.save(entity);
		
		ProfitLogBean pl = new ProfitLogBean();
		pl.setObjId(p.getId());
		pl.setType(ParkStruct.class.getCanonicalName());
		//pl.setFromTime(startTime);
		//pl.setToTime(timestamp);
		pl.setTime(timestamp);
		if(period != null && period.length == 2){		// If there is a log period
			Long[] periodLong = {period[0], period[1]};
			pl.setLogPeriod(periodLong);
		}
		pl.setAuthor(authorId);
		pl.setAgency(agencyId);
		// set new fields ---------
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestamp);
		pl.setYear(cal.get(Calendar.YEAR) + "");
		pl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
		int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
		pl.setWeek_day(dayOfWeek + "");
		pl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
		boolean isHolyday = repo.isAHoliday(cal, entity.getId_app());
		pl.setHolyday(isHolyday);
		pl.setSystemLog(sysLog);
		//---------------------------
		pl.setDeleted(false);
		//dl.setContent(entity.toJSON());
		@SuppressWarnings("unchecked")
		Map<String,Object> map = ModelConverter.convert(p, Map.class);
		pl.setValue(map);
		JSONObject tmpVal = new JSONObject(map);
		pl.setValueString(tmpVal.toString());
		//DataLog dlog = ModelConverter.convert(dl, DataLog.class);
		mongodb.save(pl);
		// Update Stat report
		int profitVal = p.getProfit();
		int ticketsVal = p.getTickets();
		if(period == null || period.length == 0){
			repo.updateStats(p.getId(), p.getAgency(), pl.getType() + profit, null, profitVal, timestamp);
			repo.updateStats(p.getId(), p.getAgency(), pl.getType() + tickets, null, ticketsVal, timestamp);
		} else {
			repo.updateStatsPeriod(p.getId(), p.getAgency(), pl.getType() + profit, null, profitVal, timestamp, period, 2);
			repo.updateStatsPeriod(p.getId(), p.getAgency(), pl.getType() + tickets, null, ticketsVal, timestamp, period, 2);
		}
		
	}
	
	// Method editParkingMeterAux: used to save a ProfitLogBean object for the new profit data in a parkingMeter
	public void editParkingMeterAux(ParkMeter pm, Long timestamp, Long startTime, String agencyId, String authorId, boolean sysLog, long[] period) throws NotFoundException {
		String[] ids = pm.getId().split("@");
		String pmId = ids[2];
		pm.setUpdateTime(timestamp);
		pm.setUser(Integer.valueOf(authorId));
		
		ParkingMeterBean entity = findParkingMeter(pmId);
		//mongodb.save(entity);
		
		ProfitLogBean pl = new ProfitLogBean();
		pl.setObjId(pm.getId());
		pl.setType(ParkMeter.class.getCanonicalName());
		//pl.setFromTime(startTime);
		//pl.setToTime(timestamp);
		pl.setTime(timestamp);
		if(period != null && period.length == 2){		// If there is a log period
			Long[] periodLong = {period[0], period[1]};
			pl.setLogPeriod(periodLong);
		}
		pl.setAuthor(authorId);
		pl.setAgency(agencyId);
		// set new fields ---------
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestamp);
		pl.setYear(cal.get(Calendar.YEAR) + "");
		pl.setMonth((cal.get(Calendar.MONTH) + 1) + "");
		int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
		pl.setWeek_day(dayOfWeek + "");
		pl.setTimeSlot(cal.get(Calendar.HOUR_OF_DAY) + "");
		boolean isHolyday = repo.isAHoliday(cal, entity.getId_app());
		pl.setHolyday(isHolyday);
		pl.setSystemLog(sysLog);
		//---------------------------
		//Integer oldVersion = getLastVersion(dl.getObjId());
		//dl.setVersion(new Integer(oldVersion.intValue() + 1));
		//if(entity.getGeometry() != null){
		//	PointBean point = new PointBean();
		//	point.setLat(entity.getGeometry().getLat());
		//	point.setLng(entity.getGeometry().getLng());
		//	dl.setLocation(point);
		//}
		pl.setDeleted(false);
		//dl.setContent(entity.toJSON());
		@SuppressWarnings("unchecked")
		Map<String,Object> map = ModelConverter.convert(pm, Map.class);
		pl.setValue(map);
		JSONObject tmpVal = new JSONObject(map);
		pl.setValueString(tmpVal.toString());
		mongodb.save(pl);
		// Update Profit Stat report
		//int[] total = {p.getSlotsTotal()};
		//int[] occupied = {p.getSlotsOccupiedOnTotal(),p.getSlotsUnavailable()};
		//double statValue = findOccupationRate(total, occupied, 0, 0, 1);
		int profitVal = pm.getProfit();
		int ticketsVal = pm.getTickets();
		if(period == null || period.length == 0){
			repo.updateStats(pm.getId(), pm.getAgency(), pl.getType() + profit, null, profitVal, timestamp);
			repo.updateStats(pm.getId(), pm.getAgency(), pl.getType() + tickets, null, ticketsVal, timestamp);
		} else {
			repo.updateStatsPeriod(pm.getId(), pm.getAgency(), pl.getType() + profit, null, profitVal, timestamp, period, 2);
			repo.updateStatsPeriod(pm.getId(), pm.getAgency(), pl.getType() + tickets, null, ticketsVal, timestamp, period, 2);
		}
	}

	
	public List<DataLogBean> getLogsById(String id, String agency, int count, int skip, String type) {
		logger.info(String.format("in getLogById: id=%s, agency=%s, count=%d, skip=%d, type=%s", id, agency, count, skip, type));
		Query query = null;
		if(id == null){
			if(count == -1){
				if(type.compareTo("all") == 0){
					query = Query.query(Criteria.where("value.agency").is(agency));
				} else {
					query = Query.query(Criteria.where("value.agency").is(agency).and("type").is(type));
				}
			} else {
				if(type.compareTo("all") == 0){
					query = Query.query(Criteria.where("value.agency").is(agency)).skip(skip).limit(count);
				} else {
					query = Query.query(Criteria.where("value.agency").is(agency).and("type").is(type)).skip(skip).limit(count);
				}
			}
		} else {
			query = Query.query(Criteria.where("value.id").is(id).and("value.agency").is(agency)).limit(count);
		}
		query.sort().on("time", Order.DESCENDING);
		List<DataLogBean> myLog = mongodb.find(query, DataLogBean.class);
		//List<DataLogBean> myLog = mongodb.findAll(DataLogBean.class);
//		List<DataLogBean> myLogBean = new ArrayList<DataLogBean>();
//		for(int i = 0; i < myLog.size(); i++){
//			myLogBean.add(ModelConverter.convert(myLog.get(i), DataLogBean.class));
//		}
		return myLog;
	}
	
	public DataLogBean getLogByLogId(String id) {
		//logger.info(String.format("in getLogByLogId: id=%s", id));
		DataLogBean myLog = mongodb.findById(id, DataLogBean.class);
		return myLog;
	}
	
	public int countLogsById(String id, String agency, int count, int skip, String type) {
		//logger.info(String.format("in getLogById: id=%s, agency=%s, count=%d, skip=%d, type=%s", id, agency, count, skip, type));
		Query query = null;
		if(id == null){
			if(count == -1){
				if(type.compareTo("all") == 0){
					query = Query.query(Criteria.where("value.agency").is(agency));
				} else {
					query = Query.query(Criteria.where("value.agency").is(agency).and("type").is(type));
				}
			} else {
				if(type.compareTo("all") == 0){
					query = Query.query(Criteria.where("value.agency").is(agency)).skip(skip).limit(count);
				} else {
					query = Query.query(Criteria.where("value.agency").is(agency).and("type").is(type)).skip(skip).limit(count);
				}
			}
		} else {
			query = Query.query(Criteria.where("value.id").is(id).and("value.agency").is(agency)).limit(count);
		}
		return (int) mongodb.count(query, DataLogBean.class);
	}
	
	public List<DataLogBean> getLogsByAuthor(String authorId, String agency, int count) {
		Query query = Query.query(Criteria.where("author").is(authorId).and("value.agency").is(agency)).limit(count);
		query.sort().on("time", Order.DESCENDING);
		//query.with(new Sort(Sort.Direction.DESC, "time"));
		//List<DataLogBean> result = new ArrayList<DataLogBean>();
		List<DataLogBean> resLog = new ArrayList<DataLogBean>();
		resLog.addAll(mongodb.find(query, DataLogBean.class));
//		for(int i = 0; i < resLog.size(); i++){
//			result.add(ModelConverter.convert(resLog.get(i), DataLogBean.class));
//		}
		if (count < resLog.size()) return resLog.subList(0, count);
		return resLog;
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
	
	/**
	 * Method findOccupationRate: calculate the occupationRate
	 * value from the free and occupied parks values
	 */
	private double findOccupationRate(int[] total, int[] occupied, int tot_p, int occ_p, int type){
		int tot = 0;
		int occ = 0;
		if(type == 1){	// Case of total occupation
			for(int i = 0; i < total.length; i++){
				tot+=total[i];
			}
			for(int i = 0; i < occupied.length; i++){
				occ+=occupied[i];
			}
		} else {	// Case of specific occupation
			tot = tot_p;
			occ = occ_p;
		}
		double rate = occ * 100 / tot;
		return rate;
	}
	
	private int countElements(int[] total){
		int count = 0;
		for(int i = 0; i < total.length; i++){
			if(total[i] > 0){
				count +=1;
			}
		}
		return count;
	}
	
	/**
	 * Method getOccupationRateFromObject: retrieve the occupation rate of a specific object in a specific time range
	 * @param objectId: id of the stored object
	 * @param appId: app id of the object
	 * @param type: class type of the object
	 * @param params: Map object with useful parameters (in this first version we consider all null)
	 * @param years: year range
	 * @param months: month range
	 * @param days: day range
	 * @param hours: hour range
	 * @return double occupation rate retrieved with the specific parameters
	 */
	public double getOccupationRateFromObject(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours){
		Map<StatKey, StatValue> res = null;
		StatKey key = new StatKey(objectId, appId,type);
		if(dayType != null && dayType.compareTo("wd") == 0){
			res = repo.findLastValueWD(objectId, appId, type, params, years, months, hours);
		} else if(dayType != null && dayType.compareTo("we") == 0){
			res = repo.findLastValueWE(objectId, appId, type, params, years, months, hours);
		} else {
			res = repo.findLastValue(objectId, appId, type, params, years, months, days, hours);
		}
		if(!res.isEmpty()){
			//logger.info(String.format("Occupation Rate Last Value = %f", res.get(key).getLastValue()));
			return res.get(key).getLastValue();
		} else {
			return -1.0;
		}
	}
	
	/**
	 * Method getAverageOccupationRateFromObject: retrieve the average occupation rate of a specific object in a specific time range
	 * @param objectId: id of the stored object
	 * @param appId: app id of the object
	 * @param type: class type of the object
	 * @param params: Map object with useful parameters (in this first version we consider all null)
	 * @param years: year range
	 * @param months: month range
	 * @param days: day range
	 * @param hours: hour range
	 * @return double average occupation rate retrieved with the specific parameters
	 */
	public double getAverageOccupationRateFromObject(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours){
		Map<StatKey, StatValue> res = null;
		StatKey key = new StatKey(objectId, appId,type);
		if(dayType != null && dayType.compareTo("wd") == 0){
			res = repo.findStatsWD(objectId, appId, type, params, years, months, hours);
		} else if(dayType != null && dayType.compareTo("we") == 0){
			res = repo.findStatsWE(objectId, appId, type, params, years, months, hours);
		} else {
			res = repo.findStats(objectId, appId, type, params, years, months, days, hours);
		}
		if(!res.isEmpty()){
			//logger.info(String.format("Occupation Rate Aggregate Value = %f", res.get(key).getAggregateValue()));
			return res.get(key).getLastValue();
		} else {
			return -1.0;
		}
	}
	
	/**
	 * Method getLastProfitFromObject: retrieve the last profit value of a specific object in a specific time range
	 * @param objectId: id of the stored object
	 * @param appId: app id of the object
	 * @param type: class type of the object
	 * @param params: Map object with useful parameters (in this first version we consider all null)
	 * @param years: year range
	 * @param months: month range
	 * @param days: day range
	 * @param hours: hour range
	 * @return double average occupation rate retrieved with the specific parameters
	 */
	public double getLastProfitFromObject(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours){
		Map<StatKey, StatValue> res = null;
		StatKey key = new StatKey(objectId, appId,type);
		if(dayType != null && dayType.compareTo("wd") == 0){
			res = repo.findStatsWD(objectId, appId, type, params, years, months, hours);
		} else if(dayType != null && dayType.compareTo("we") == 0){
			res = repo.findStatsWE(objectId, appId, type, params, years, months, hours);
		} else {
			res = repo.findStats(objectId, appId, type, params, years, months, days, hours);
		}
		if(!res.isEmpty()){
			return res.get(key).getLastValue();
		} else {
			return -1.0;
		}
	}
	
	/**
	 * Method getSumProfitFromObject: retrieve the total profit of a specific object in a specific time range
	 * @param objectId: id of the stored object
	 * @param appId: app id of the object
	 * @param type: class type of the object
	 * @param params: Map object with useful parameters (in this first version we consider all null)
	 * @param years: year range
	 * @param months: month range
	 * @param days: day range
	 * @param hours: hour range
	 * @return double average occupation rate retrieved with the specific parameters
	 */
	public double getSumProfitFromObject(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours){
		Map<StatKey, StatValue> res = null;
		StatKey key = new StatKey(objectId, appId,type);
		if(dayType != null && dayType.compareTo("wd") == 0){
			res = repo.findStatsWD(objectId, appId, type, params, years, months, hours);
		} else if(dayType != null && dayType.compareTo("we") == 0){
			res = repo.findStatsWE(objectId, appId, type, params, years, months, hours);
		} else {
			res = repo.findStats(objectId, appId, type, params, years, months, days, hours);
		}
		if(!res.isEmpty()){
			StatValue val = res.get(key);
			double sum = val.getCount() * val.getAggregateValue(); 
			return sum;
			//return res.get(key).getSumValue();
		} else {
			return -1.0;
		}
	}
	
	public StreetBean getOccupationRateFromStreet(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		StreetBean s = findStreet(objectId);
		String sId = getCorrectId(objectId, "street", appId);
		double occRate = 0;
		if(valueType == 1){
			occRate = getOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
		} else {
			occRate = getAverageOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
		}
		s.setOccupancyRate(occRate);
		
		return s;
	}
	
	public ParkingStructureBean getOccupationRateFromParking(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		ParkingStructureBean p = null;
		try {
			p = findParkingStructure(objectId);
		} catch (NotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		double occRate = 0;
		if(valueType == 1){
			occRate	= getOccupationRateFromObject(p.getId(), appId, type, params, years, months, dayType, days, hours);
		} else {
			occRate	= getAverageOccupationRateFromObject(p.getId(), appId, type, params, years, months, dayType, days, hours);
		}
		p.setOccupancyRate(occRate);
		
		return p;
	}
	
	public List<StreetBean> getOccupationRateFromAllStreets(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		List<StreetBean> streets = getAllStreetsInAppId(null, appId);
		List<StreetBean> corrStreets = new ArrayList<StreetBean>();
		String sId = "";
		for(StreetBean s : streets){
			sId = getCorrectId(s.getId(), "street", appId);
			double occRate = 0;
			double freeOccRate = 0;
			double paidOccRate = 0;
			double timedOccRate = 0;
			int freeParks = 0;
			int paidSlotParks = 0;
			int timedParks = 0;
			if(ModelConverter.isValorisedSlots(s.getFreeParkSlotNumber()) && ModelConverter.isValorisedSlots(s.getFreeParkSlotSignNumber())){
				freeParks = s.getFreeParkSlotNumber() + s.getFreeParkSlotSignNumber();
			} else {
				if(ModelConverter.isValorisedSlots(s.getFreeParkSlotNumber())){
					freeParks = s.getFreeParkSlotNumber();
				} else {
					freeParks = s.getFreeParkSlotSignNumber();
				}
			}
			if(s.getPaidSlotNumber() != null){
				paidSlotParks = s.getPaidSlotNumber();
			}
			if(s.getTimedParkSlotNumber() != null){
				timedParks = s.getTimedParkSlotNumber();
			}
			int[] parks = {freeParks, paidSlotParks, timedParks};
			int multipark = countElements(parks);
			if(valueType == 1){
				occRate = getOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
				if(multipark > 1){
					freeOccRate = getOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
					paidOccRate = getOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
					timedOccRate = getOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
				}
			} else {
				occRate = getAverageOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
				if(multipark > 1){
					freeOccRate = getAverageOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
					paidOccRate = getAverageOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
					timedOccRate = getAverageOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
				}
			}
			s.setOccupancyRate(occRate);
			// Here I have to retrieve other specific occupancyRate(for free/paid/timed parks) - MULTIPARKOCC
			if(s.getFreeParkSlotNumber() != null && s.getFreeParkSlotNumber() > 0){
				if(multipark > 1){
					s.setFreeParkSlotOccupied((int)Math.round(s.getFreeParkSlotNumber() * freeOccRate / 100));
				} else {
					s.setFreeParkSlotOccupied((int)Math.round(s.getFreeParkSlotNumber() * occRate / 100));
				}
			}
			if(s.getFreeParkSlotSignNumber() != null && s.getFreeParkSlotSignNumber() > 0){
				if(multipark > 1){
					s.setFreeParkSlotSignOccupied((int)Math.round(s.getFreeParkSlotSignNumber() * freeOccRate / 100));
				} else {
					s.setFreeParkSlotSignOccupied((int)Math.round(s.getFreeParkSlotSignNumber() * occRate / 100));
				}
				
			}
			if(s.getPaidSlotNumber() != null && s.getPaidSlotNumber() > 0){
				if(multipark > 1){
					s.setPaidSlotOccupied((int)Math.round(s.getPaidSlotNumber() * paidOccRate / 100));
				} else {
					s.setPaidSlotOccupied((int)Math.round(s.getPaidSlotNumber() * occRate / 100));
				}
			}
			if(s.getTimedParkSlotNumber() != null && s.getTimedParkSlotNumber() > 0){
				if(multipark > 1){
					s.setTimedParkSlotOccupied((int)Math.round(s.getTimedParkSlotNumber() * timedOccRate / 100));
				} else {
					s.setTimedParkSlotOccupied((int)Math.round(s.getTimedParkSlotNumber() * occRate / 100));
				}
			}
			corrStreets.add(s);
		}

		return corrStreets;
	}
	
	public List<ParkingStructureBean> getOccupationRateFromAllParkings(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		List<ParkingStructureBean> parkings = getAllParkingStructureInAppId(null, appId);
		String pId = "";
		for(ParkingStructureBean p : parkings){
			double occRate = 0;
			pId = getCorrectId(p.getId(), "parking", appId);
			if(valueType == 1){
				occRate = getOccupationRateFromObject(pId, appId, type, params, years, months, dayType, days, hours);
			} else {
				occRate = getAverageOccupationRateFromObject(pId, appId, type, params, years, months, dayType, days, hours);
			}
			p.setOccupancyRate(occRate);
			p.setSlotOccupied((int)Math.round(p.getSlotNumber() * occRate / 100));
		}

		return parkings;
	}
	
	/**
	 * Method getProfitFromAllParkingMeters: used to obtain the profit value from all the parkingmeters
	 * @param appId: app id of the logge user (rv or tn)
	 * @param type: type of the object
	 * @param params: parameter to semplify the research
	 * @param years: years limit for searched data
	 * @param months: months limit for searched data
	 * @param dayType: day type: working or not
	 * @param days: days limit for searched data
	 * @param hours: hours limit for searched data
	 * @param valueType: type of searched value: last profit or profit sum
	 * @return
	 */
	public List<ParkingMeterBean> getProfitFromAllParkingMeters(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		List<ParkingMeterBean> parkingmeters = getAllParkingMeters(appId);
		String pId = "";
		for(ParkingMeterBean pm : parkingmeters){
			double profitVal = 0;
			int ticketsNum = 0;
			pId = getCorrectId(pm.getId(), "parkingmeter", appId);
			if(valueType == 1){
				profitVal = getLastProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
				ticketsNum = (int)getLastProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
			} else {
				profitVal = getSumProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
				ticketsNum = (int)getSumProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
			}
			pm.setProfit(profitVal);
			pm.setTickets(ticketsNum);
		}

		return parkingmeters;
	}
	
	public List<ParkingStructureBean> getProfitFromAllParkStructs(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		List<ParkingStructureBean> parkstructs = getAllParkingStructureInAppId(null, appId);
		String pId = "";
		for(ParkingStructureBean p : parkstructs){
			double profitVal = 0;
			int ticketsNum = 0;
			pId = getCorrectId(p.getId(), "parkstruct", appId);
			if(valueType == 1){
				profitVal = getLastProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
				ticketsNum = (int)getLastProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
			} else {
				profitVal = getSumProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
				ticketsNum = (int)getSumProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
			}
			p.setProfit(profitVal);
			p.setTickets(ticketsNum);
		}

		return parkstructs;
	}
	
	/**
	 * Method getOccupationChangesFromAllStreets: used to get the streets occupation from db and organize the
	 * result in a list of "Compact" object only with the dynamic data (occupation and slots composition)
	 * @param appId: appId of app
	 * @param type: tupe of the object
	 * @param params: parameters for the occupation filter
	 * @param years: year limit for the occupation filter
	 * @param months: month limit for the occupation filter
	 * @param dayType: day type (working or weekend) for the occupation filter
	 * @param days: weekday number limit for the occupation filter
	 * @param hours: hour limit for the occupation filter
	 * @param valueType: type of the filtered value (last value or aggregate value)
	 * @return List of CompactStreetBean with the most useful data
	 */
	public List<CompactStreetBean> getOccupationChangesFromAllStreets(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		List<StreetBean> streets = getAllStreetsInAppId(null, appId);
		List<CompactStreetBean> corrStreets = new ArrayList<CompactStreetBean>();
		String sId = "";
		for(StreetBean s : streets){
			CompactStreetBean cs = new CompactStreetBean();
			sId = getCorrectId(s.getId(), "street", appId);
			double occRate = 0;
			double freeOccRate = 0;
			double paidOccRate = 0;
			double timedOccRate = 0;
			int freeParks = 0;
			int paidSlotParks = 0;
			int timedParks = 0;
			if(s.getFreeParkSlotNumber() != null && s.getFreeParkSlotSignNumber() != null){
				freeParks = s.getFreeParkSlotNumber()+s.getFreeParkSlotSignNumber();
			} else {
				if(s.getFreeParkSlotNumber() != null){
					freeParks = s.getFreeParkSlotNumber();
				} else {
					freeParks = s.getFreeParkSlotSignNumber();
				}
			}
			if(s.getPaidSlotNumber() != null){
				paidSlotParks = s.getPaidSlotNumber();
			}
			if(s.getTimedParkSlotNumber() != null){
				timedParks = s.getTimedParkSlotNumber();
			}
			int[] parks = {freeParks, paidSlotParks, timedParks};
			int multipark = countElements(parks);
			if(valueType == 1){
				occRate = getOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
				if(multipark > 1){
					freeOccRate = getOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
					paidOccRate = getOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
					timedOccRate = getOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
				}
			} else {
				occRate = getAverageOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
				if(multipark > 1){
					freeOccRate = getAverageOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
					paidOccRate = getAverageOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
					timedOccRate = getAverageOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
				}
			}
			cs.setId(s.getId());
			cs.setSlotNumber(s.getSlotNumber());
			cs.setOccupancyRate(occRate);
			// Here I have to retrieve other specific occupancyRate(for free/paid/timed parks) - MULTIPARKOCC
			if(s.getFreeParkSlotNumber() != null && s.getFreeParkSlotNumber() > 0){
				cs.setFreeParkSlotNumber(s.getFreeParkSlotNumber());
				if(multipark > 1){
					cs.setFreeParkSlotOccupied((int)Math.round(s.getFreeParkSlotNumber() * freeOccRate / 100));
				} else {
					cs.setFreeParkSlotOccupied((int)Math.round(s.getFreeParkSlotNumber() * occRate / 100));
				}
			}
			if(s.getFreeParkSlotSignNumber() != null && s.getFreeParkSlotSignNumber() > 0){
				cs.setFreeParkSlotSignNumber(s.getFreeParkSlotSignNumber());
				if(multipark > 1){
					cs.setFreeParkSlotSignOccupied((int)Math.round(s.getFreeParkSlotSignNumber() * freeOccRate / 100));
				} else {
					cs.setFreeParkSlotSignOccupied((int)Math.round(s.getFreeParkSlotSignNumber() * occRate / 100));
				}
				
			}
			if(s.getPaidSlotNumber() != null && s.getPaidSlotNumber() > 0){
				cs.setPaidSlotNumber(s.getPaidSlotNumber());
				if(multipark > 1){
					cs.setPaidSlotOccupied((int)Math.round(s.getPaidSlotNumber() * paidOccRate / 100));
				} else {
					cs.setPaidSlotOccupied((int)Math.round(s.getPaidSlotNumber() * occRate / 100));
				}
			}
			if(s.getTimedParkSlotNumber() != null && s.getTimedParkSlotNumber() > 0){
				cs.setTimedParkSlotNumber(s.getTimedParkSlotNumber());
				if(multipark > 1){
					cs.setTimedParkSlotOccupied((int)Math.round(s.getTimedParkSlotNumber() * timedOccRate / 100));
				} else {
					cs.setTimedParkSlotOccupied((int)Math.round(s.getTimedParkSlotNumber() * occRate / 100));
				}
			}
			if(s.getReservedSlotNumber() != null && s.getReservedSlotNumber() > 0){
				cs.setReservedSlotNumber(s.getReservedSlotNumber());
			}
			if(s.getHandicappedSlotNumber() != null && s.getHandicappedSlotNumber() > 0){
				cs.setHandicappedSlotNumber(s.getHandicappedSlotNumber());
			}
			corrStreets.add(cs);
		}

		return corrStreets;
	}
	
	/**
	 * Method getOccupatinChangesFromAllParkings: used to retrieve the occupancy information from the db and organize the
	 * result in a list of "Compact" object only with the dynamic data (occupation and slots composition)
	 * @param appId: appId of app
	 * @param type: tupe of the object
	 * @param params: parameters for the occupation filter
	 * @param years: year limit for the occupation filter
	 * @param months: month limit for the occupation filter
	 * @param dayType: day type (working or weekend) for the occupation filter
	 * @param days: weekday number limit for the occupation filter
	 * @param hours: hour limit for the occupation filter
	 * @param valueType: type of the filtered value (last value or aggregate value)
	 * @return List of CompactParkingStructureBean with the most useful data
	 */
	public List<CompactParkingStructureBean> getOccupationChangesFromAllParkings(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		List<ParkingStructureBean> parkings = getAllParkingStructureInAppId(null, appId);
		List<CompactParkingStructureBean> correctedParkings = new ArrayList<CompactParkingStructureBean>();
		String pId = "";
		for(ParkingStructureBean p : parkings){
			CompactParkingStructureBean cp = new CompactParkingStructureBean();
			double occRate = 0;
			pId = getCorrectId(p.getId(), "parking", appId);
			if(valueType == 1){
				occRate = getOccupationRateFromObject(pId, appId, type, params, years, months, dayType, days, hours);
			} else {
				occRate = getAverageOccupationRateFromObject(pId, appId, type, params, years, months, dayType, days, hours);
			}
			cp.setId(p.getId());
			cp.setOccupancyRate(occRate);
			cp.setSlotNumber(p.getSlotNumber());
			cp.setSlotOccupied((int)Math.round(p.getSlotNumber() * occRate / 100));
			correctedParkings.add(cp);
		}

		return correctedParkings;
	}
	
	public String getCorrectId(String id, String type, String appId){
		return new String(type + "@" + appId + "@" + id);
	}
	
	public List<StreetLog> getOldLogs(){
		List<StreetLog> result = new ArrayList<StreetLog>();
		for (StreetLog s : mongodb.findAll(StreetLog.class)) {
			result.add(s);
		}
		return result;
	}
	
	public List<ParkingLog> getOldParkLogs(){
		List<ParkingLog> result = new ArrayList<ParkingLog>();
		for (ParkingLog p : mongodb.findAll(ParkingLog.class)) {
			result.add(p);
		}
		return result;
	}

}
