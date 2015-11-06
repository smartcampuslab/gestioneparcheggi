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

import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkMeter;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkStruct;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.CompactParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.CompactStreetBean;
import it.smartcommunitylab.parking.management.web.bean.DataLogBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingLog;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.StreetLog;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.converter.ModelConverter;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.exception.ExportException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.model.BikePoint;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.Zone;
import it.smartcommunitylab.parking.management.web.model.stats.StatKey;
import it.smartcommunitylab.parking.management.web.model.stats.StatValue;
import it.smartcommunitylab.parking.management.web.repository.DataLogBeanTP;
import it.smartcommunitylab.parking.management.web.repository.StatRepository;

import java.text.DecimalFormat;
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
	private static final String freeSlotSignedType = "@freeSign";
	private static final String paidSlotType = "@paid";
	private static final String timedSlotType = "@timed";
	private static final String handicappedSlotType = "@handicapped";
	private static final String reservedSlotType = "@reserved";
	private static final String unusuabledSlotType = "@unusuabled";
	
	private static final String profit = "@profit";
	private static final String tickets = "@tickets";
	
	// Constants for comparation
	private static final int YEAR_VALS = 6;
	private static final int MONTH_VALS = 13;
	private static final int DOW_VALS = 8;
	private static final int HOUR_VALS = 25;
	private static final String[] MONTHS_LABEL = {"Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"};
	private static final String[] DOWS_LABEL = {"Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"};
	private static final String[] HOURS_LABEL = {"00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"};

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
	
	/**
	 * Method findZoneById: get a list of zone having a specific name
	 * @param name: name of the zone to search
	 * @return List of ZoneBean found
	 */
	public ZoneBean findZoneById(String zId, String appId) {
		List<ZoneBean> result = new ArrayList<ZoneBean>();
		for (Zone z : mongodb.findAll(Zone.class)) {
			if(z != null && z.getId_app().compareTo(appId) == 0){
				if(z.getId().compareTo(zId) == 0){
					result.add(ModelConverter.convert(z, ZoneBean.class));
				}
			}
		}	
		return result.get(0);
	}
	
	/**
	 * Method getAreaById: used to retrieve an RateAreaBean object from a specific id 
	 * @param areaId: id of the area to find
	 * @param appId: agency id
	 * @return Object RateAreaBean found
	 */
	public RateAreaBean getAreaById(String areaId, String appId) {
		RateArea a = mongodb.findById(areaId, RateArea.class);
		RateAreaBean ra = ModelConverter.convert(a, RateAreaBean.class);
		return ra;
	}
	
	/**
	 * Method findParkingMeterByCode: used to find a ParkingMeterBean object using the code
	 * @param code: code of the parkingMeter to find
	 * @return ParkingMeterBean object found;
	 */
	public ParkingMeterBean findParkingMeterByCode(int code, String appId) {
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		for (RateArea area : aree) {
			if (area.getParkingMeters() != null && area.getId_app().compareTo(appId) == 0) {
				for(ParkingMeter pm : area.getParkingMeters()){
					if(pm.getCode() == code){
						ParkingMeterBean result = ModelConverter.convert(pm, ParkingMeterBean.class);
						result.setAreaId(area.getId());
						return result;
					}
				}
			}
		}
		return null;
	}	

	public void editStreetAux(it.smartcommunitylab.parking.management.web.auxiliary.model.Street s, Long timestamp, String agencyId, String authorId, boolean sysLog, long[] period, int p_type) throws DatabaseException {
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
					temp.setFreeParkSlotSignOccupied(s.getSlotsOccupiedOnFreeSigned());
					temp.setTimedParkSlotOccupied(s.getSlotsOccupiedOnTimed());
					temp.setPaidSlotOccupied(s.getSlotsOccupiedOnPaying());
					temp.setHandicappedSlotOccupied(s.getSlotsOccupiedOnHandicapped());
					temp.setReservedSlotOccupied(s.getSlotsOccupiedOnReserved());
					temp.setUnusuableSlotNumber(s.getSlotsUnavailable());
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
					@SuppressWarnings("unchecked")
					Map<String,Object> map = ModelConverter.convert(s, Map.class);
					dl.setValue(map);
					JSONObject tmpVal = new JSONObject(map);
					dl.setValueString(tmpVal.toString(4));
					logger.info(String.format("Value String: %s", tmpVal.toString()));
					//DataLog dlog = ModelConverter.convert(dl, DataLog.class);
					mongodb.save(dl);
					logger.error(String.format("Updated street: %s", temp.toString()));
					// Update Stat report
					int[] total = {s.getSlotsFree(), s.getSlotsFreeSigned(), s.getSlotsPaying(), s.getSlotsTimed(), s.getSlotsHandicapped(), s.getSlotsReserved()};
					int[] occupied = {s.getSlotsOccupiedOnFree(), s.getSlotsOccupiedOnFreeSigned(), s.getSlotsOccupiedOnPaying(), s.getSlotsOccupiedOnTimed(), s.getSlotsOccupiedOnHandicapped(), s.getSlotsOccupiedOnReserved()};
					double statValue = findOccupationRate(total, occupied, 0, 0, 1, s.getSlotsUnavailable());
					int unavailableSlots = s.getSlotsUnavailable();
					if(period == null || period.length == 0){
						if(p_type != -1){
							repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType(), null, statValue, timestamp, p_type);
						} else {
							repo.updateStats(s.getId(), s.getAgency(), dl.getType(), null, statValue, timestamp);
						}
					} else {
						repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType(), null, statValue, timestamp, period, 1);
					}
					// Here I have to difference the type of the park: total, free, paying and timed - MULTIPARKOCC
					if(countElements(total) > 1){	// Here I check if there are more than one element of park type
						if(s.getSlotsFree()!= 0){
							double freeOccValue = findOccupationRate(null, null, s.getSlotsFree(), s.getSlotsOccupiedOnFree(), 2, unavailableSlots);
							if(period == null || period.length == 0){
								if(p_type != -1){
									repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + freeSlotType, null, freeOccValue, timestamp, p_type);
								} else {
									repo.updateStats(s.getId(), s.getAgency(), dl.getType() + freeSlotType, null, freeOccValue, timestamp);
								}
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + freeSlotType, null, freeOccValue, timestamp, period, 1);
							}
							if((s.getSlotsFree() - s.getSlotsOccupiedOnFree()) < unavailableSlots){
								unavailableSlots = unavailableSlots - (s.getSlotsFree() - s.getSlotsOccupiedOnFree());
							} else {
								unavailableSlots = 0;
							}
						}
						if(s.getSlotsFreeSigned()!= 0){
							double freeSignOccValue = findOccupationRate(null, null, s.getSlotsFreeSigned(), s.getSlotsOccupiedOnFreeSigned(), 2, unavailableSlots);
							if(period == null || period.length == 0){
								if(p_type != -1){
									repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + freeSlotSignedType, null, freeSignOccValue, timestamp, p_type);
								} else {
									repo.updateStats(s.getId(), s.getAgency(), dl.getType() + freeSlotSignedType, null, freeSignOccValue, timestamp);
								}
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + freeSlotSignedType, null, freeSignOccValue, timestamp, period, 1);
							}
							if((s.getSlotsFreeSigned() - s.getSlotsOccupiedOnFreeSigned()) < unavailableSlots){
								unavailableSlots = unavailableSlots - (s.getSlotsFreeSigned() - s.getSlotsOccupiedOnFreeSigned());
							} else {
								unavailableSlots = 0;
							}
						}
						if(s.getSlotsPaying() != 0){
							double payingOccValue = findOccupationRate(null, null, s.getSlotsPaying(), s.getSlotsOccupiedOnPaying(), 2, unavailableSlots);
							if(period == null || period.length == 0){
								if(p_type != -1){
									repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + paidSlotType, null, payingOccValue, timestamp, p_type);
								} else {
									repo.updateStats(s.getId(), s.getAgency(), dl.getType() + paidSlotType, null, payingOccValue, timestamp);
								}
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + paidSlotType, null, payingOccValue, timestamp, period, 1);
							}
							if((s.getSlotsPaying() - s.getSlotsOccupiedOnPaying()) < unavailableSlots){
								unavailableSlots = unavailableSlots - (s.getSlotsPaying() - s.getSlotsOccupiedOnPaying());
							} else {
								unavailableSlots = 0;
							}
						}
						if(s.getSlotsTimed() != 0){
							double timedOccValue = findOccupationRate(null, null, s.getSlotsTimed(), s.getSlotsOccupiedOnTimed(), 2, unavailableSlots);
							if(period == null || period.length == 0){
								if(p_type != -1){
									repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + timedSlotType, null, timedOccValue, timestamp, p_type);
								} else {
									repo.updateStats(s.getId(), s.getAgency(), dl.getType() + timedSlotType, null, timedOccValue, timestamp);
								}
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + timedSlotType, null, timedOccValue, timestamp, period, 1);
							}
							if((s.getSlotsTimed() - s.getSlotsOccupiedOnTimed()) < unavailableSlots){
								unavailableSlots = unavailableSlots - (s.getSlotsTimed() - s.getSlotsOccupiedOnTimed());
							} else {
								unavailableSlots = 0;
							}
						}
						if(s.getSlotsHandicapped() != 0){
							double handicappedOccValue = findOccupationRate(null, null, s.getSlotsHandicapped(), s.getSlotsOccupiedOnHandicapped(), 2, unavailableSlots);
							if(period == null || period.length == 0){
								if(p_type != -1){
									repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + handicappedSlotType, null, handicappedOccValue, timestamp, p_type);
								} else {
									repo.updateStats(s.getId(), s.getAgency(), dl.getType() + handicappedSlotType, null, handicappedOccValue, timestamp);
								}
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + handicappedSlotType, null, handicappedOccValue, timestamp, period, 1);
							}
							if((s.getSlotsHandicapped() - s.getSlotsOccupiedOnHandicapped()) < unavailableSlots){
								unavailableSlots = unavailableSlots - (s.getSlotsHandicapped() - s.getSlotsOccupiedOnHandicapped());
							} else {
								unavailableSlots = 0;
							}
						}
						if(s.getSlotsReserved() != 0){
							double reservedOccValue = findOccupationRate(null, null, s.getSlotsReserved(), s.getSlotsOccupiedOnReserved(), 2, unavailableSlots);
							if(period == null || period.length == 0){
								if(p_type != -1){
									repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + reservedSlotType, null, reservedOccValue, timestamp, p_type);
								} else {
									repo.updateStats(s.getId(), s.getAgency(), dl.getType() + reservedSlotType, null, reservedOccValue, timestamp);
								}
							} else {
								repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + reservedSlotType, null, reservedOccValue, timestamp, period, 1);
							}
							if((s.getSlotsReserved() - s.getSlotsOccupiedOnReserved()) < unavailableSlots){
								unavailableSlots = unavailableSlots - (s.getSlotsReserved() - s.getSlotsOccupiedOnReserved());
							} else {
								unavailableSlots = 0;
							}
						}
					}
					// this data can be present in the park with only a park type too
					if(s.getSlotsUnavailable() != 0){
						double unusualbedSlotVal = s.getSlotsUnavailable();
						if(period == null || period.length == 0){
							if(p_type != -1){
								repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + unusuabledSlotType, null, unusualbedSlotVal, timestamp, p_type);
							} else {
								repo.updateStats(s.getId(), s.getAgency(), dl.getType() + unusuabledSlotType, null, unusualbedSlotVal, timestamp);
							}
						} else {
							repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + unusuabledSlotType, null, unusualbedSlotVal, timestamp, period, 1);
						}
					}
					break;	// here I exit the loop
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
	public void editParkingStructureAux(Parking p, Long timestamp, String agencyId, String authorId, boolean sysLog, long[] period, int p_type) throws NotFoundException {
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
		dl.setValueString(tmpVal.toString(4));
		//DataLog dlog = ModelConverter.convert(dl, DataLog.class);
		mongodb.save(dl);
		// Update Stat report
		int[] total = {p.getSlotsTotal()};
		int[] occupied = {p.getSlotsOccupiedOnTotal()};
		double statValue = findOccupationRate(total, occupied, 0, 0, 1, p.getSlotsUnavailable());
		if(period == null || period.length == 0){
			if(p_type != -1){
				repo.updateDirectPeriodStats(p.getId(), p.getAgency(), dl.getType(), null, statValue, timestamp, p_type);
			} else {
				repo.updateStats(p.getId(), p.getAgency(), dl.getType(), null, statValue, timestamp);
			}
		} else {
			repo.updateStatsPeriod(p.getId(), p.getAgency(), dl.getType(), null, statValue, timestamp, period, 1);
		}
		// this data can be present in the park with only a park type too
		if(p.getSlotsUnavailable() != 0){
			double unusualbedSlotVal = p.getSlotsUnavailable();
			if(period == null || period.length == 0){
				if(p_type != -1){
					repo.updateDirectPeriodStats(p.getId(), p.getAgency(), dl.getType() + unusuabledSlotType, null, unusualbedSlotVal, timestamp, p_type);
				} else {
					repo.updateStats(p.getId(), p.getAgency(), dl.getType() + unusuabledSlotType, null, unusualbedSlotVal, timestamp);
				}
			} else {
				repo.updateStatsPeriod(p.getId(), p.getAgency(), dl.getType() + unusuabledSlotType, null, unusualbedSlotVal, timestamp, period, 1);
			}
		}
	}
	
	// Method editParkStructProfitAux: used to save a ProfitLogBean object for the new profit data in a parkingStructure
	public void editParkStructProfitAux(ParkStruct p, Long timestamp, Long startTime, String agencyId, String authorId, boolean sysLog, long[] period,  int p_type) throws NotFoundException {
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
		
		//ProfitLogBean pl = new ProfitLogBean();
		DataLogBean pl = new DataLogBean();
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
		pl.setValueString(tmpVal.toString(4));
		//DataLog dlog = ModelConverter.convert(dl, DataLog.class);
		mongodb.save(pl);
		// Update Stat report
		int profitVal = p.getProfit();
		int ticketsVal = p.getTickets();
		if(period == null || period.length == 0){
			if(p_type != -1){
				repo.updateDirectPeriodStats(p.getId(), p.getAgency(), pl.getType() + profit, null, profitVal, timestamp, p_type);
				repo.updateDirectPeriodStats(p.getId(), p.getAgency(), pl.getType() + tickets, null, ticketsVal, timestamp, p_type);
			} else {
				repo.updateStats(p.getId(), p.getAgency(), pl.getType() + profit, null, profitVal, timestamp);
				repo.updateStats(p.getId(), p.getAgency(), pl.getType() + tickets, null, ticketsVal, timestamp);
			}
		} else {
			repo.updateStatsPeriod(p.getId(), p.getAgency(), pl.getType() + profit, null, profitVal, timestamp, period, 2);
			repo.updateStatsPeriod(p.getId(), p.getAgency(), pl.getType() + tickets, null, ticketsVal, timestamp, period, 2);
		}
	}
	
	// Method editParkingMeterAux: used to save a ProfitLogBean object for the new profit data in a parkingMeter
	public void editParkingMeterAux(ParkMeter pm, Long timestamp, Long startTime, String agencyId, String authorId, boolean sysLog, long[] period, int p_type) throws NotFoundException {
		String[] ids = pm.getId().split("@");
		String pmId = ids[2];
		pm.setUpdateTime(timestamp);
		pm.setUser(Integer.valueOf(authorId));
		
		ParkingMeterBean entity = findParkingMeter(pmId);
		//mongodb.save(entity);
		
		//ProfitLogBean pl = new ProfitLogBean();
		DataLogBean pl = new DataLogBean();
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
		pl.setValueString(tmpVal.toString(4));
		mongodb.save(pl);
		// Update Profit Stat report
		//int[] total = {p.getSlotsTotal()};
		//int[] occupied = {p.getSlotsOccupiedOnTotal(),p.getSlotsUnavailable()};
		//double statValue = findOccupationRate(total, occupied, 0, 0, 1);
		int profitVal = pm.getProfit();
		int ticketsVal = pm.getTickets();
		if(period == null || period.length == 0){
			if(p_type != -1){
				repo.updateDirectPeriodStats(pm.getId(), pm.getAgency(), pl.getType() + profit, null, profitVal, timestamp, p_type);
				repo.updateDirectPeriodStats(pm.getId(), pm.getAgency(), pl.getType() + tickets, null, ticketsVal, timestamp, p_type);
			} else {
				repo.updateStats(pm.getId(), pm.getAgency(), pl.getType() + profit, null, profitVal, timestamp);
				repo.updateStats(pm.getId(), pm.getAgency(), pl.getType() + tickets, null, ticketsVal, timestamp);
			}
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
	private double findOccupationRate(int[] total, int[] occupied, int tot_p, int occ_p, int type, int unavailable){
		int tot = 0;
		int occ = 0;
		if(type == 1){	// Case of total occupation
			for(int i = 0; i < total.length; i++){
				tot+=total[i];
			}
			tot = tot - unavailable;
			for(int i = 0; i < occupied.length; i++){
				occ+=occupied[i];
			}
		} else {	// Case of specific occupation
			int free = tot_p - occ_p;
			if(unavailable > free){
				unavailable = free;
			}
			tot = tot_p - unavailable;
			occ = occ_p;
		}
		if(tot <= 0)tot = 1;	// to solve the division by zero error
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
			//return res.get(key).getLastValue();
			return res.get(key).getAggregateValue();
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
		double freeOccRate = 0;
		double freeOccSignedRate = 0;
		double paidOccRate = 0;
		double timedOccRate = 0;
		double handicappedOccRate = 0;
		double reservedOccRate = 0;
		int freeParks = 0;
		int freeSignParks = 0;
		int paidSlotParks = 0;
		int timedParks = 0;
		int handicappedParks = 0;
		int reservedParks = 0;
		int unusuabledParks = 0;
		int freeParks_occ = 0;
		int freeSignParks_occ = 0;
		int paidSlotParks_occ = 0;
		int timedParks_occ = 0;
		int handicappedParks_occ = 0;
		int reservedParks_occ = 0;
		if(s.getFreeParkSlotNumber() != null){
			freeParks = s.getFreeParkSlotNumber();
		}
		if(s.getFreeParkSlotSignNumber() != null){
			freeSignParks = s.getFreeParkSlotSignNumber();
		}
		if(s.getPaidSlotNumber() != null){
			paidSlotParks = s.getPaidSlotNumber();
		}
		if(s.getTimedParkSlotNumber() != null){
			timedParks = s.getTimedParkSlotNumber();
		}
		if(s.getHandicappedSlotNumber() != null){
			handicappedParks = s.getHandicappedSlotNumber();
		}
		if(s.getReservedSlotNumber() != null){
			reservedParks = s.getReservedSlotNumber();
		}
		int[] parks = {freeParks, freeSignParks, paidSlotParks, timedParks, handicappedParks, reservedParks};
		int multipark = countElements(parks);
		if(valueType == 1){
			occRate = getOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
			if(multipark > 1){
				freeOccRate = getOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
				freeOccSignedRate = getOccupationRateFromObject(sId, appId, type + freeSlotSignedType, params, years, months, dayType, days, hours);
				paidOccRate = getOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
				timedOccRate = getOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
				handicappedOccRate = getOccupationRateFromObject(sId, appId, type + handicappedSlotType, params, years, months, dayType, days, hours);
				reservedOccRate = getOccupationRateFromObject(sId, appId, type + reservedSlotType, params, years, months, dayType, days, hours);
			}
			unusuabledParks = (int)getOccupationRateFromObject(sId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
		} else {
			occRate = getAverageOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
			if(multipark > 1){
				freeOccRate = getAverageOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
				freeOccSignedRate = getAverageOccupationRateFromObject(sId, appId, type + freeSlotSignedType, params, years, months, dayType, days, hours);
				paidOccRate = getAverageOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
				timedOccRate = getAverageOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
				handicappedOccRate = getAverageOccupationRateFromObject(sId, appId, type + handicappedSlotType, params, years, months, dayType, days, hours);
				reservedOccRate = getAverageOccupationRateFromObject(sId, appId, type + reservedSlotType, params, years, months, dayType, days, hours);
			}
			unusuabledParks = (int)getAverageOccupationRateFromObject(sId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
		}
		if(unusuabledParks > 0){
			s.setUnusuableSlotNumber(unusuabledParks);
		}
		// Here I have to retrieve other specific occupancyRate(for free/paid/timed parks) - MULTIPARKOCC
		if(s.getFreeParkSlotNumber() != null && s.getFreeParkSlotNumber() > 0){
			int freeSlotNumber = s.getFreeParkSlotNumber();
			if(unusuabledParks > 0){
				freeSlotNumber = freeSlotNumber - unusuabledParks;
				unusuabledParks = 0;
			}
			if(multipark > 1){
				freeParks_occ = (int)Math.round(freeSlotNumber * freeOccRate / 100);
			} else {
				freeParks_occ = (int)Math.round(freeSlotNumber * occRate / 100);
			}
			s.setFreeParkSlotOccupied(freeParks_occ);
		}
		if(s.getFreeParkSlotSignNumber() != null && s.getFreeParkSlotSignNumber() > 0){
			int freeSlotSignNumber = s.getFreeParkSlotSignNumber();
			if(unusuabledParks > 0){
				freeSlotSignNumber = freeSlotSignNumber - unusuabledParks;
				unusuabledParks = 0;
			}
			if(multipark > 1){
				freeSignParks_occ = (int)Math.round(freeSlotSignNumber * freeOccSignedRate / 100);
			} else {
				freeSignParks_occ = (int)Math.round(freeSlotSignNumber * occRate / 100);
			}
			s.setFreeParkSlotSignOccupied(freeSignParks_occ);
		}
		if(s.getPaidSlotNumber() != null && s.getPaidSlotNumber() > 0){
			int paidSlotNumber = s.getPaidSlotNumber();
			if(unusuabledParks > 0){
				paidSlotNumber = paidSlotNumber - unusuabledParks;
				unusuabledParks = 0;
			}
			if(multipark > 1){
				paidSlotParks_occ = (int)Math.round(paidSlotNumber * paidOccRate / 100);
			} else {
				paidSlotParks_occ = (int)Math.round(paidSlotNumber * occRate / 100);
			}
			s.setPaidSlotOccupied(paidSlotParks_occ);
		}
		if(s.getTimedParkSlotNumber() != null && s.getTimedParkSlotNumber() > 0){
			int timedParkSlotNumber = s.getTimedParkSlotNumber();
			if(unusuabledParks > 0){
				timedParkSlotNumber = timedParkSlotNumber - unusuabledParks;
				unusuabledParks = 0;
			}
			if(multipark > 1){
				timedParks_occ = (int)Math.round(timedParkSlotNumber * timedOccRate / 100);
			} else {
				timedParks_occ = (int)Math.round(timedParkSlotNumber * occRate / 100);
			}
			s.setTimedParkSlotOccupied(timedParks_occ);
		}
		if(s.getHandicappedSlotNumber() != null && s.getHandicappedSlotNumber() > 0){
			int handicappedSlotNumber = s.getHandicappedSlotNumber();
			if(unusuabledParks > 0){
				handicappedSlotNumber = handicappedSlotNumber - unusuabledParks;
				unusuabledParks = 0;
			}
			if(multipark > 1){
				handicappedParks_occ = (int)Math.round(handicappedSlotNumber * handicappedOccRate / 100);
			} else {
				handicappedParks_occ = (int)Math.round(handicappedSlotNumber * occRate / 100);
			}
			s.setHandicappedSlotOccupied(handicappedParks_occ);
		}
		if(s.getReservedSlotNumber() != null && s.getReservedSlotNumber() > 0){
			int reservedSlotNumber = s.getReservedSlotNumber();
			if(unusuabledParks > 0){
				reservedSlotNumber = reservedSlotNumber - unusuabledParks;
				unusuabledParks = 0;
			}
			if(multipark > 1){
				reservedParks_occ = (int)Math.round(reservedSlotNumber * reservedOccRate / 100);
			} else {
				reservedParks_occ = (int)Math.round(reservedSlotNumber * occRate / 100);
			}
			s.setReservedSlotOccupied(reservedParks_occ);
		}
		int[] totalSlot = {freeParks, freeSignParks, paidSlotParks, timedParks, handicappedParks, reservedParks};
		int[] totalUsed = {freeParks_occ, freeSignParks_occ, paidSlotParks_occ, timedParks_occ, handicappedParks_occ, reservedParks_occ};
		occRate = findOccupationRate(totalSlot, totalUsed, 0, 0, 1, s.getUnusuableSlotNumber());
		if(occRate > 100){
			occRate = 100;
		}
		s.setOccupancyRate(occRate);
		
		return s;
	}
	
	/**
	 * Method getHistorycalDataFromZone: used to retrieve the historical data info from a zone (sum / average the street values)
	 * @param objectId: id of zone;
	 * @param appId: agency id of call;
	 * @param type: object class type to find;
	 * @param verticalVal: vertical val for the compare table;
	 * @param orizontalVal: orizontal val for the compare table;
	 * @param params: passed params;
	 * @param years: years to calculate in filter;
	 * @param months: months to calculate in filter;
	 * @param dayType: dayTyoe to calculate in filter;
	 * @param days: days to calculate in filter;
	 * @param hours: hours to calculate in filter;
	 * @param valueType: value to find: occupancy, profit or time cost;
	 * @param objType: type of object to find: street, parkingmeter, parking structure
	 * @return String matrix with the zone occupancy compare
	 */
	public String[][] getHistorycalDataFromZone(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType){
		String[][] occMatrix = null;
		String[][] tmpMatrix = null;
		int[][] usedSlotMatrix = null;
		int[][] unavailableSlotMatrix = null;
		int[][] sumSlotMatrix = null;
		int totalSlot = 0;
		
		ZoneBean z = findZoneById(objectId, appId);
		List<StreetBean> streets = getAllStreets(z, null);
		if(streets != null && streets.size() > 0){
			occMatrix = getHistorycalDataFromObject(streets.get(0).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType);
			sumSlotMatrix = calculateUsedSlot(streets.get(0), occMatrix);
			totalSlot = streets.get(0).getSlotNumber();
			for(int i = 1; i < streets.size(); i++){
				//occMatrix = mergeMatrix(occMatrix, getHistorycalDataFromObject(streets.get(i).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType));
				tmpMatrix = getHistorycalDataFromObject(streets.get(i).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType);
				usedSlotMatrix = calculateUsedSlot(streets.get(i), tmpMatrix);
				sumSlotMatrix = mergeSlotMatrix(usedSlotMatrix, sumSlotMatrix);
				totalSlot += streets.get(i).getSlotNumber();
			}
		}
		//return cleanAverageMatrix(occMatrix, streets.size());
		return cleanSumSlotMatrix(sumSlotMatrix, totalSlot, occMatrix);
	}
	
	/**
	 * Method getHistoricalDataFromArea: used to retrieve hostorical data info from a rate area (sum / average the street values)
	 * @param objectId: id of a specific area
	 * @param appId: agency id of call;
	 * @param type: object class type to find;
	 * @param verticalVal: vertical val for the compare table;
	 * @param orizontalVal: orizontal val for the compare table;
	 * @param params: passed params;
	 * @param years: years to calculate in filter;
	 * @param months: months to calculate in filter;
	 * @param dayType: dayTyoe to calculate in filter;
	 * @param days: days to calculate in filter;
	 * @param hours: hours to calculate in filter;
	 * @param valueType: value to find: occupancy, profit or time cost;
	 * @param objType: type of object to find: street, parkingmeter, parking structure
	 * @return String matrix with the area occupancy compare
	 */
	public String[][] getHistorycalDataFromArea(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType){
		String[][] occMatrix = null;
		String[][] tmpMatrix = null;
		int[][] usedSlotMatrix = null;
		int[][] unavailableSlotMatrix = null;
		int[][] sumSlotMatrix = null;
		int totalSlot = 0;
		
		RateAreaBean a = getAreaById(objectId, appId);
		List<StreetBean> streets = getAllStreets(a, null);
		if(streets != null && streets.size() > 0){
			occMatrix = getHistorycalDataFromObject(streets.get(0).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType);
			sumSlotMatrix = calculateUsedSlot(streets.get(0), occMatrix);
			totalSlot = streets.get(0).getSlotNumber();
			for(int i = 1; i < streets.size(); i++){
				tmpMatrix = getHistorycalDataFromObject(streets.get(i).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType);
				//occMatrix = mergeMatrix(occMatrix, tmpMatrix);
				usedSlotMatrix = calculateUsedSlot(streets.get(i), tmpMatrix);
				sumSlotMatrix = mergeSlotMatrix(usedSlotMatrix, sumSlotMatrix);
				totalSlot += streets.get(i).getSlotNumber();
			}
		}
		//return cleanAverageMatrix(occMatrix, streets.size());
		return cleanSumSlotMatrix(sumSlotMatrix, totalSlot, occMatrix);
	}	
	
	private int[][] calculateUsedSlot(StreetBean s, String[][] m){
		int[][] tmp = new int[m.length][m[0].length];
		for(int i = 1; i < m.length; i++){
			for(int j = 1; j < m[0].length; j++){
				double occ = Double.parseDouble(m[i][j]);
				if(occ != -1.0){
					int totSlots = s.getSlotNumber();
					int occSlots = (int)Math.round(totSlots * occ / 100);
					tmp[i][j] = occSlots;
				} else {
					tmp[i][j] = -1;
				}
			}
		}
		return tmp;
	};
	
	// Method mergeMatrix: used to merge the value of two matrix (with same size) in a single matrix
	public String[][] mergeMatrix(String[][] m1, String[][] m2){
		String[][] tmp = m1;
		for(int i = 1; i < m1.length; i++){
			for(int j = 1; j < m1[i].length; j++){
				String[] profits_1 = m1[i][j].split("/");
				String[] profits_2 = m2[i][j].split("/");
				if(profits_1.length == 1){
					double occ1 = Double.parseDouble(m1[i][j]);
					double occ2 = Double.parseDouble(m2[i][j]);
					double merge = 0.0;
					if((occ1 != -1.0) && (occ2 != -1.0)){
						merge = occ1 + occ2;
					} else if((occ1 != -1.0) && (occ2 == -1.0)){
						merge = occ1;
					} else if((occ1 == -1.0) && (occ2 != -1.0)){
						merge = occ2;
					} else {
						merge = -1.0;
					}
					tmp[i][j] = "" + merge;
				} else {
					double prof1 = Double.parseDouble(profits_1[0]);
					double prof2 = Double.parseDouble(profits_2[0]);
					double merge1 = 0.0;
					if((prof1 != -1.0) && (prof2 != -1.0)){
						merge1 = prof1 + prof2;
					} else if((prof1 != -1.0) && (prof2 == -1.0)){
						merge1 = prof1;
					} else if((prof1 == -1.0) && (prof2 != -1.0)){
						merge1 = prof2;
					} else {
						merge1 = -1.0;
					}
					double tick1 = Double.parseDouble(profits_1[1]);
					double tick2 = Double.parseDouble(profits_2[1]);
					double merge2 = 0.0;
					if((tick1 != -1.0) && (tick2 != -1.0)){
						merge2 = tick1 + tick2;
					} else if((tick1 != -1.0) && (tick2 == -1.0)){
						merge2 = tick1;
					} else if((tick1 == -1.0) && (tick2 != -1.0)){
						merge2 = tick2;
					} else {
						merge2 = -1.0;
					}
					tmp[i][j] = "" + merge1 + "/" + merge2;
				}
			}
		}
		return tmp;
	}
	
	// Method mergeMatrix: used to merge the value of two matrix (with same size) in a single matrix
	public int[][] mergeSlotMatrix(int[][] m1, int[][] m2){
		int[][] tmp = m1;
		for(int i = 1; i < m1.length; i++){
			for(int j = 1; j < m1[i].length; j++){
				int slot1 = m1[i][j];
				int slot2 = m2[i][j];
				int merge = 0;
				if((slot1 != -1) && (slot2 != -1)){
					 merge = slot1 + slot2;
				} else if((slot1 != -1) && (slot2 == -1)){
					merge = slot1;
				} else if((slot1 == -1) && (slot2 != -1)){
					merge = slot2;
				} else {
					merge = -1;
				}
				tmp[i][j] = merge;
			}
		}
		return tmp;
	}
	
	// Method cleanAverageMatrix: used to calculate the average values from a matrix with the sum data
	public String[][] cleanAverageMatrix(String[][] m1, int streets){
		String[][] tmp = m1;
		if(m1 != null && m1.length > 0){
			for(int i = 1; i < m1.length; i++){
				for(int j = 1; j < m1[i].length; j++){
					if(Double.parseDouble(m1[i][j]) != -1.0){
						double average = Double.parseDouble(m1[i][j]) / streets;
						if(average > 100.0)average = 100.0;
						tmp[i][j] = String.format("%.2f", average);
					}
				}
			}
		}
		return tmp;
	}
	
	public String[][] cleanSumSlotMatrix(int[][] m1, int slots, String[][] m2){
		String[][] tmp = new String[m1.length][m1[0].length];
		if(m1 != null && m1.length > 0){
			for(int i = 1; i < m1.length; i++){
				for(int j = 1; j < m1[i].length; j++){
					if(m1[i][j] != -1){
						if(slots == 0){
							slots = 1;
						}
						double average = (m1[i][j] * 100) / slots;
						tmp[i][j] = "" + String.format("%.2f", average);
					} else {
						tmp[i][j] = "-1.0";
					}
				}
			}
			for(int i = 0; i < m1.length; i++){
				for(int j = 0; j < m1[i].length; j++){
					if(i == 0 || j == 0){
						tmp[i][j] = m2[i][j];
					}
				}
			}
		}
		return tmp;
	}
	
	public String[][] getHistorycalProfitDataFromStreet(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType){
		String[][] profMatrix = null;
		
		StreetBean s = findStreet(objectId);
		List<String> pmCodes = s.getParkingMeters();
		if(pmCodes != null && pmCodes.size() > 0){
			ParkingMeterBean pmb = findParkingMeter(pmCodes.get(0));
			//ParkingMeterBean pmb = findParkingMeterByCode(Integer.parseInt(pmCodes.get(0)), appId);
			profMatrix = getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType);
			for(int i = 1; i < pmCodes.size(); i++){
				pmb = findParkingMeter(pmCodes.get(i));
				//pmb = findParkingMeterByCode(Integer.parseInt(pmCodes.get(i)), appId);
				profMatrix = mergeMatrix(profMatrix, getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType));
			}
		}
		return profMatrix;	//cleanAverageMatrix(profMatrix, pmCodes.size());
	}
	
	public String[][] getHistorycalProfitDataFromZone(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType){
		String[][] profMatrix = null;
	
		List<StreetBean> streets = getAllStreetsInAppId(null, appId);
		List<String> pmCodes = new ArrayList<String>();
		// find all parkingmeters in zone (in streets in zone)
		for(StreetBean s : streets){
			//StreetBean s = findStreet(objectId);
			List<String> zones = s.getZones();
			boolean found = false;
			for(int i = 0; i < zones.size() && !found; i++){
				if(zones.get(i).compareTo(objectId) == 0){
					found = true;
					pmCodes.addAll(s.getParkingMeters());
				}
			}
		}
		// iterate the parkingmeter list and merge the profit matrix
		if(pmCodes != null && pmCodes.size() > 0){
			//ParkingMeterBean pmb = findParkingMeterByCode(Integer.parseInt(pmCodes.get(0)), appId);
			ParkingMeterBean pmb = findParkingMeter(pmCodes.get(0));
			profMatrix = getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType);
			for(int i = 1; i < pmCodes.size(); i++){
				//pmb = findParkingMeterByCode(Integer.parseInt(pmCodes.get(i)), appId);
				pmb = findParkingMeter(pmCodes.get(i));
				profMatrix = mergeMatrix(profMatrix, getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType));
			}
		}
		return profMatrix;	//cleanAverageMatrix(profMatrix, pmCodes.size());
	}
	
	public String[][] getHistorycalProfitDataFromArea(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType){
		String[][] profMatrix = null;
		
		RateArea a = mongodb.findById(objectId, RateArea.class);
		List<ParkingMeter> pms = a.getParkingMeters();
		if(pms != null && pms.size() > 0){
			ParkingMeterBean pmb = findParkingMeter(pms.get(0).getId());
			profMatrix = getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType);
			for(int i = 1; i < pms.size(); i++){
				pmb = findParkingMeter(pms.get(i).getId());
				profMatrix = mergeMatrix(profMatrix, getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType));
			}
		}
		return profMatrix;	//cleanAverageMatrix(profMatrix, pmCodes.size());
	}
	
	public String[][] getHistorycalDataFromObject(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType){
		//StreetBean s = findStreet(objectId);
		String sId = "";
		String psOccId = "";
		String psProfId = "";
		String pmId = "";
		if(objType == 1){
			pmId = getCorrectId(objectId, "parkingmeter", appId);
		} else if(objType == 2){
			psOccId = getCorrectId(objectId, "parking", appId);
		} else if(objType == 3){
			psProfId = getCorrectId(objectId, "parkstruct", appId);
		} else if(objType == 4){
			sId = getCorrectId(objectId, "street", appId);
		}
		String[][] occMatrix = null;
		String matrixType = "";
		
		switch(verticalVal){
			case 1: 
				// Year
				switch(orizontalVal){
				case 1: 
					// Year
					break;
				case 2: 
					// Month
					occMatrix = new String[YEAR_VALS][MONTH_VALS];
					break;
				case 3: 
					// DayOfWeek
					occMatrix = new String[YEAR_VALS][DOW_VALS];
					break;
				case 4: 
					// Hours
					occMatrix = new String[YEAR_VALS][HOUR_VALS];
					break;
				}
				break;
			case 2: 
				// Month
				switch(orizontalVal){
				case 1: 
					// Year
					occMatrix = new String[MONTH_VALS][YEAR_VALS];
					break;
				case 2: 
					// Month
					break;
				case 3: 
					// DayOfWeek
					occMatrix = new String[MONTH_VALS][DOW_VALS];
					break;
				case 4: 
					// Hours
					occMatrix = new String[MONTH_VALS][HOUR_VALS];
					break;
				}
				break;
			case 3: 
				// DayOfWeek
				switch(orizontalVal){
				case 1: 
					// Year
					occMatrix = new String[DOW_VALS][YEAR_VALS];
					break;
				case 2: 
					// Month
					occMatrix = new String[DOW_VALS][MONTH_VALS];
					break;
				case 3: 
					// DayOfWeek
					break;
				case 4: 
					// Hours
					occMatrix = new String[DOW_VALS][HOUR_VALS];
					break;
				}
				break;
			case 4: 
				// Hours
				switch(orizontalVal){
				case 1: 
					// Year
					occMatrix = new String[HOUR_VALS][YEAR_VALS];
					break;
				case 2: 
					// Month
					occMatrix = new String[HOUR_VALS][MONTH_VALS];
					break;
				case 3: 
					// DayOfWeek
					occMatrix = new String[HOUR_VALS][DOW_VALS];
					break;
				case 4: 
					// Hours
					break;
				}
				break;
		}
		matrixType = "" + verticalVal + "" + orizontalVal;
		Calendar tmp = Calendar.getInstance();
		int year = tmp.get(Calendar.YEAR);
		
		if(matrixType.compareTo("12") == 0){
			// case years-months
			occMatrix[0][0] = "Anno/Mese";
			for(int x = 0; x < MONTHS_LABEL.length; x++){
				occMatrix[0][x + 1] = MONTHS_LABEL[x];
			}
			for(int i = 1; i < occMatrix.length; i++){
				occMatrix[i][0] = (year - (i - 1)) + "";
				for(int j = 1; j < occMatrix[i].length; j++){
					byte[] b_month = {(byte)(j - 1)};
					int[] i_year = {(year-(i - 1))}; 
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, i_year, b_month, dayType, days, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, i_year, b_month, dayType, days, hours); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, i_year, b_month, dayType, days, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, i_year, b_month, dayType, days, hours);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, i_year, b_month, dayType, days, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, i_year, b_month, dayType, days, hours); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, i_year, b_month, dayType, days, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, i_year, b_month, dayType, days, hours);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, i_year, b_month, dayType, days, hours, valueType).getOccupancyRate();
					}
				}
			}
		} else if(matrixType.compareTo("13") == 0){
			// case years-dows
			occMatrix[0][0] = "Anno/Settimana";
			for(int x = 0; x < DOWS_LABEL.length; x++){
				occMatrix[0][x + 1] = DOWS_LABEL[x];
			}
			for(int i = 1; i < occMatrix.length; i++){
				occMatrix[i][0] = (year - (i - 1)) + "";
				int[] i_year = {(year-(i - 1))};
				for(int j = 1; j < occMatrix[i].length-1; j++){
					byte[] b_dows = {(byte)(j + 1)};
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, i_year, months, null, b_dows, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, i_year, months, null, b_dows, hours); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, i_year, months, null, b_dows, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, i_year, months, null, b_dows, hours);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, i_year, months, null, b_dows, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, i_year, months, null, b_dows, hours); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, i_year, months, null, b_dows, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, i_year, months, null, b_dows, hours);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, i_year, months, null, b_dows, hours, valueType).getOccupancyRate();
					}
				}
				byte[] b_dows = {(byte)(1)};
				if(objType == 1){
					occMatrix[i][7] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, i_year, months, null, b_dows, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, i_year, months, null, b_dows, hours); 
				} else if(objType == 2){
					if(valueType == 1){
						occMatrix[i][7] = "" + getOccupationRateFromObject(psOccId, appId, type, params, i_year, months, null, b_dows, hours);
					} else {
						occMatrix[i][7] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, i_year, months, null, b_dows, hours);
					}
				} else if(objType == 3){
					occMatrix[i][7] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, i_year, months, null, b_dows, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, i_year, months, null, b_dows, hours); 
				} else if(objType == 4){
					if(valueType == 1){
						occMatrix[i][7] = "" + getOccupationRateFromObject(sId, appId, type, params, i_year, months, null, b_dows, hours);
					} else {
						occMatrix[i][7] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, i_year, months, null, b_dows, hours);
					}
					//occMatrix[i][7] = "" + getOccupationRateFromStreet(objectId, appId, type, params, i_year, months, null, b_dows, hours, valueType).getOccupancyRate();
				}
			}
		} else if(matrixType.compareTo("14") == 0){
			// case years-hours
			occMatrix[0][0] = "Anno/Ora";
			for(int x = 0; x < HOURS_LABEL.length; x++){
				occMatrix[0][x + 1] = HOURS_LABEL[x];
			}
			for(int i = 1; i < occMatrix.length; i++){
				occMatrix[i][0] = (year - (i - 1)) + "";
				for(int j = 1; j < occMatrix[i].length; j++){
					byte[] b_hour = {(byte)(j - 1)};
					int[] i_year = {(year-(i - 1))};
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, i_year, months, dayType, days, b_hour) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, i_year, months, dayType, days, b_hour); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, i_year, months, dayType, days, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, i_year, months, dayType, days, b_hour);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, i_year, months, dayType, days, b_hour) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, i_year, months, dayType, days, b_hour); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, i_year, months, dayType, days, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, i_year, months, dayType, days, b_hour);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, i_year, months, dayType, days, b_hour, valueType).getOccupancyRate();
					}
				}	
			}
		} else if(matrixType.compareTo("21") == 0){
			// case months-years
			occMatrix[0][0] = "Mese/Anno";
			for(int x = 0; x < 5; x++){
				occMatrix[0][x + 1] = (year - x) + "";
			}
			for(int i = 1; i < occMatrix.length; i++){
				occMatrix[i][0] = MONTHS_LABEL[i - 1];
				for(int j = 1; j < occMatrix[i].length; j++){
					byte[] b_month = {(byte)(i - 1)};
					int[] i_year = {(year - (j - 1))};
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, i_year, b_month, dayType, days, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, i_year, b_month, dayType, days, hours); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, i_year, b_month, dayType, days, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, i_year, b_month, dayType, days, hours);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, i_year, b_month, dayType, days, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, i_year, b_month, dayType, days, hours); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, i_year, b_month, dayType, days, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, i_year, b_month, dayType, days, hours);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, i_year, b_month, dayType, days, hours, valueType).getOccupancyRate();
					}
				}	
			}
		} else if(matrixType.compareTo("23") == 0){
			// case months-dows
			occMatrix[0][0] = "Mese/Settimana";
			for(int x = 0; x < DOWS_LABEL.length; x++){
				occMatrix[0][x + 1] = DOWS_LABEL[x];
			}
			for(int i = 1; i < occMatrix.length; i++){
				occMatrix[i][0] = MONTHS_LABEL[i - 1];
				byte[] b_month = {(byte)(i - 1)};
				for(int j = 1; j < occMatrix[i].length-1; j++){
					byte[] b_dows = {(byte)(j + 1)};
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, b_month, null, b_dows, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, b_month, null, b_dows, hours); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years, b_month, null, b_dows, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years, b_month, null, b_dows, hours);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, b_month, null, b_dows, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, b_month, null, b_dows, hours); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, years, b_month, null, b_dows, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, b_month, null, b_dows, hours);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, b_month, null, b_dows, hours, valueType).getOccupancyRate();
					}		
				}	
				byte[] b_dows = {(byte)(1)};
				if(objType == 1){
					occMatrix[i][7] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, b_month, null, b_dows, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, b_month, null, b_dows, hours); 
				} else if(objType == 2){
					if(valueType == 1){
						occMatrix[i][7] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years, b_month, null, b_dows, hours);
					} else {
						occMatrix[i][7] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years, b_month, null, b_dows, hours);
					}
				} else if(objType == 3){
					occMatrix[i][7] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, b_month, null, b_dows, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, b_month, null, b_dows, hours); 
				} else if(objType == 4){
					if(valueType == 1){
						occMatrix[i][7] = "" + getOccupationRateFromObject(sId, appId, type, params, years, b_month, null, b_dows, hours);
					} else {
						occMatrix[i][7] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, b_month, null, b_dows, hours);
					}
					//occMatrix[i][7] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, b_month, null, b_dows, hours, valueType).getOccupancyRate();
				}
			}	
		} else if(matrixType.compareTo("24") == 0){
			// case months-hours
			occMatrix[0][0] = "Mese/Ora";
			for(int x = 0; x < HOURS_LABEL.length; x++){
				occMatrix[0][x + 1] = HOURS_LABEL[x];
			}
			for(int i = 1; i < occMatrix.length; i++){
				occMatrix[i][0] = MONTHS_LABEL[i - 1];
				for(int j = 1; j < occMatrix[i].length; j++){
					byte[] b_month = {(byte)(i - 1)};
					byte[] b_hour = {(byte)(j - 1)};
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, b_month, dayType, days, b_hour) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, b_month, dayType, days, b_hour); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years, b_month, dayType, days, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years, b_month, dayType, days, b_hour);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, b_month, dayType, days, b_hour) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, b_month, dayType, days, b_hour); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, years, b_month, dayType, days, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, b_month, dayType, days, b_hour);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, b_month, dayType, days, b_hour, valueType).getOccupancyRate();
					}
				}	
			}
		} else if(matrixType.compareTo("31") == 0){
			// case years-months
			occMatrix[0][0] = "Settimana/Anno";
			for(int x = 0; x < 5; x++){
				occMatrix[0][x + 1] = (year - x) + "";
			}
			int i = 0;
			for(i = 1; i < occMatrix.length-1; i++){
				occMatrix[i][0] = DOWS_LABEL[i - 1];
				for(int j = 1; j < occMatrix[i].length; j++){
					byte[] b_dows = {(byte)(i + 1)};
					int[] i_year = {(year-(j - 1))}; 
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, i_year, months, null, b_dows, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, i_year, months, null, b_dows, hours); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, i_year, months, null, b_dows, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, i_year, months, null, b_dows, hours);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, i_year, months, null, b_dows, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, i_year, months, null, b_dows, hours); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, i_year, months, null, b_dows, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, i_year, months, null, b_dows, hours);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, i_year, months, null, b_dows, hours, valueType).getOccupancyRate();
					}
				}	
			}
			occMatrix[i][0] = DOWS_LABEL[i - 1];
			for(int j = 1; j < occMatrix[i].length; j++){
				byte[] b_dows = {(byte)1};
				int[] i_year = {(year-(j - 1))};
				if(objType == 1){
					occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, i_year, months, null, b_dows, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, i_year, months, null, b_dows, hours); 
				} else if(objType == 2){
					if(valueType == 1){
						occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, i_year, months, null, b_dows, hours);
					} else {
						occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, i_year, months, null, b_dows, hours);
					}
				} else if(objType == 3){
					occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, i_year, months, null, b_dows, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, i_year, months, null, b_dows, hours); 
				} else if(objType == 4){
					if(valueType == 1){
						occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, i_year, months, null, b_dows, hours);
					} else {
						occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, i_year, months, null, b_dows, hours);
					}
					//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, i_year, months, null, b_dows, hours, valueType).getOccupancyRate();
				}
			}	
		} else if(matrixType.compareTo("32") == 0){
			// case years-dows
			occMatrix[0][0] = "Settimana/Mese";
			for(int x = 0; x < MONTHS_LABEL.length; x++){
				occMatrix[0][x + 1] = MONTHS_LABEL[x];
			}
			int i = 0;
			for(i = 1; i < occMatrix.length-1; i++){
				occMatrix[i][0] = DOWS_LABEL[i - 1];
				for(int j = 1; j < occMatrix[i].length; j++){
					byte[] b_dows = {(byte)(i + 1)};
					byte[] b_month = {(byte)(j - 1)};
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, b_month, null, b_dows, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, b_month, null, b_dows, hours); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years, b_month, null, b_dows, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years, b_month, null, b_dows, hours);
						}
					}else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, b_month, null, b_dows, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, b_month, null, b_dows, hours); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, years, b_month, null, b_dows, hours);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, b_month, null, b_dows, hours);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, b_month, null, b_dows, hours, valueType).getOccupancyRate();
					}	
				}	
			}
			occMatrix[i][0] = DOWS_LABEL[i - 1];
			for(int j = 1; j < occMatrix[i].length; j++){
				byte[] b_dows = {(byte)1};
				byte[] b_month = {(byte)(j - 1)};
				if(objType == 1){
					occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, b_month, null, b_dows, hours) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, b_month, null, b_dows, hours); 
				} else if(objType == 2){
					if(valueType == 1){
						occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years, b_month, null, b_dows, hours);
					} else {
						occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years, b_month, null, b_dows, hours);
					}
				} else if(objType == 3){
					occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, b_month, null, b_dows, hours) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, b_month, null, b_dows, hours); 
				} else if(objType == 4){
					if(valueType == 1){
						occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, years, b_month, null, b_dows, hours);
					} else {
						occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, b_month, null, b_dows, hours);
					}
					//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, b_month, null, b_dows, hours, valueType).getOccupancyRate();
				}
			}	
		} else if(matrixType.compareTo("34") == 0){
			// case years-hours
			occMatrix[0][0] = "Settimana/Ora";
			for(int x = 0; x < HOURS_LABEL.length; x++){
				occMatrix[0][x + 1] = HOURS_LABEL[x];
			}
			int i = 0;
			for(i = 1; i < occMatrix.length-1; i++){
				occMatrix[i][0] = DOWS_LABEL[i - 1];
				for(int j = 1; j < occMatrix[i].length; j++){
					byte[] b_dows = {(byte)(i + 1)};
					byte[] b_hour = {(byte)(j - 1)};
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, months, null, b_dows, b_hour) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, months, null, b_dows, b_hour); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years, months, null, b_dows, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years, months, null, b_dows, b_hour);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, months, null, b_dows, b_hour) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, months, null, b_dows, b_hour); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, years, months, null, b_dows, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, months, null, b_dows, b_hour);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, months, null, b_dows, b_hour, valueType).getOccupancyRate();
					}
				}	
			}
			occMatrix[i][0] = DOWS_LABEL[i - 1];
			for(int j = 1; j < occMatrix[i].length; j++){
				byte[] b_dows = {(byte)1};
				byte[] b_hour = {(byte)(j - 1)};
				if(objType == 1){
					occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, months, null, b_dows, b_hour) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, months, null, b_dows, b_hour); 
				} else if(objType == 2){
					if(valueType == 1){
						occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years, months, null, b_dows, b_hour);
					} else {
						occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years, months, null, b_dows, b_hour);
					}
				} else if(objType == 3){
					occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, months, null, b_dows, b_hour) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, months, null, b_dows, b_hour); 
				} else if(objType == 4){
					if(valueType == 1){
						occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, years, months, null, b_dows, b_hour);
					} else {
						occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, months, null, b_dows, b_hour);
					}
					//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, months, null, b_dows, b_hour, valueType).getOccupancyRate();
				}
			}	
		} else if(matrixType.compareTo("41") == 0){
			// case years-months
			occMatrix[0][0] = "Ora/Anno";
			for(int x = 0; x < 5; x++){
				occMatrix[0][x + 1] = (year - x) + "";
			}
			for(int i = 1; i < occMatrix.length; i++){
				occMatrix[i][0] = HOURS_LABEL[i - 1];
				for(int j = 1; j < occMatrix[i].length; j++){
					byte[] b_hour = {(byte)(i - 1)};
					int[] i_year = {(year-(j - 1))}; 
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, i_year, months, dayType, days, b_hour) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, i_year, months, dayType, days, b_hour); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, i_year, months, dayType, days, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, i_year, months, dayType, days, b_hour);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, i_year, months, dayType, days, b_hour) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, i_year, months, dayType, days, b_hour); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, i_year, months, dayType, days, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, i_year, months, dayType, days, b_hour);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, i_year, months, dayType, days, b_hour, valueType).getOccupancyRate();
					}
				}	
			}
		} else if(matrixType.compareTo("42") == 0){
			// case years-dows
			occMatrix[0][0] = "Ora/Mese";
			for(int x = 0; x < MONTHS_LABEL.length; x++){
				occMatrix[0][x + 1] = MONTHS_LABEL[x];
			}
			for(int i = 1; i < occMatrix.length; i++){
				occMatrix[i][0] = HOURS_LABEL[i - 1];
				for(int j = 1; j < occMatrix[i].length; j++){
					byte[] b_hour = {(byte)(i - 1)};
					byte[] b_month = {(byte)(j - 1)};
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, b_month, dayType, days, b_hour) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, b_month, dayType, days, b_hour); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years, b_month, dayType, days, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years, b_month, dayType, days, b_hour);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, b_month, dayType, days, b_hour) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, b_month, dayType, days, b_hour); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, years, b_month, dayType, days, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, b_month, dayType, days, b_hour);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, b_month, dayType, days, b_hour, valueType).getOccupancyRate();
					}
				}	
			}
		} else if(matrixType.compareTo("43") == 0){
			// case months-dows
			occMatrix[0][0] = "Ora/Settimana";
			for(int x = 0; x < DOWS_LABEL.length; x++){
				occMatrix[0][x + 1] = DOWS_LABEL[x];
			}
			for(int i = 1; i < occMatrix.length; i++){
				occMatrix[i][0] = HOURS_LABEL[i - 1];
				byte[] b_hour = {(byte)(i - 1)};
				for(int j = 1; j < occMatrix[i].length-1; j++){
					byte[] b_dows = {(byte)(j + 1)};
					if(objType == 1){
						occMatrix[i][j] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, months, null, b_dows, b_hour) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, months, null, b_dows, b_hour); 
					} else if(objType == 2){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years,  months, null, b_dows, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years,  months, null, b_dows, b_hour);
						}
					} else if(objType == 3){
						occMatrix[i][j] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, months, null, b_dows, b_hour) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, months, null, b_dows, b_hour); 
					} else if(objType == 4){
						if(valueType == 1){
							occMatrix[i][j] = "" + getOccupationRateFromObject(sId, appId, type, params, years, months, null, b_dows, b_hour);
						} else {
							occMatrix[i][j] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, months, null, b_dows, b_hour);
						}
						//occMatrix[i][j] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, months, null, b_dows, b_hour, valueType).getOccupancyRate();
					}
				}	
				byte[] b_dows = {(byte)(1)};
				if(objType == 1){
					occMatrix[i][7] = "" + getSumProfitFromObject(pmId, appId, type + profit, params, years, months, null, b_dows, b_hour) + "/" + getSumProfitFromObject(pmId, appId, type + tickets, params, years, months, null, b_dows, b_hour); 
				} else if(objType == 2){
					if(valueType == 1){
						occMatrix[i][7] = "" + getOccupationRateFromObject(psOccId, appId, type, params, years,  months, null, b_dows, b_hour);
					} else {
						occMatrix[i][7] = "" + getAverageOccupationRateFromObject(psOccId, appId, type, params, years,  months, null, b_dows, b_hour);
					}
				} else if(objType == 3){
					occMatrix[i][7] = "" + getSumProfitFromObject(psProfId, appId, type + profit, params, years, months, null, b_dows, b_hour) + "/" + getSumProfitFromObject(psProfId, appId, type + tickets, params, years, months, null, b_dows, b_hour); 
				} else if(objType == 4){
					if(valueType == 1){
						occMatrix[i][7] = "" + getOccupationRateFromObject(sId, appId, type, params, years, months, null, b_dows, b_hour);
					} else {
						occMatrix[i][7] = "" + getAverageOccupationRateFromObject(sId, appId, type, params, years, months, null, b_dows, b_hour);
					}
					//occMatrix[i][7] = "" + getOccupationRateFromStreet(objectId, appId, type, params, years, months, null, b_dows, b_hour, valueType).getOccupancyRate();
				}
			}
		}
//		double occRate = 0;
//		if(valueType == 1){
//			occRate = getOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
//		} else {
//			occRate = getAverageOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
//		}
//		s.setOccupancyRate(occRate);
		return occMatrix;
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
			double freeOccSignedRate = 0;
			double paidOccRate = 0;
			double timedOccRate = 0;
			double handicappedOccRate = 0;
			double reservedOccRate = 0;
			int freeParks = 0;
			int freeSignParks = 0;
			int paidSlotParks = 0;
			int timedParks = 0;
			int handicappedParks = 0;
			int reservedParks = 0;
			int unusuabledParks = 0;
			int freeParks_occ = 0;
			int freeSignParks_occ = 0;
			int paidSlotParks_occ = 0;
			int timedParks_occ = 0;
			int handicappedParks_occ = 0;
			int reservedParks_occ = 0;
			if(s.getFreeParkSlotNumber() != null){
				freeParks = s.getFreeParkSlotNumber();
			}
			if(s.getFreeParkSlotSignNumber() != null){
				freeSignParks = s.getFreeParkSlotSignNumber();
			}
//			if(ModelConverter.isValorisedSlots(s.getFreeParkSlotNumber()) && ModelConverter.isValorisedSlots(s.getFreeParkSlotSignNumber())){
//				freeParks = s.getFreeParkSlotNumber() + s.getFreeParkSlotSignNumber();
//			} else {
//				if(ModelConverter.isValorisedSlots(s.getFreeParkSlotNumber())){
//					freeParks = s.getFreeParkSlotNumber();
//				} else {
//					freeParks = s.getFreeParkSlotSignNumber();
//				}
//			}
			if(s.getPaidSlotNumber() != null){
				paidSlotParks = s.getPaidSlotNumber();
			}
			if(s.getTimedParkSlotNumber() != null){
				timedParks = s.getTimedParkSlotNumber();
			}
			if(s.getHandicappedSlotNumber() != null){
				handicappedParks = s.getHandicappedSlotNumber();
			}
			if(s.getReservedSlotNumber() != null){
				reservedParks = s.getReservedSlotNumber();
			}
			int[] parks = {freeParks, freeSignParks, paidSlotParks, timedParks, handicappedParks, reservedParks};
			int multipark = countElements(parks);
			if(valueType == 1){
				occRate = getOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
				if(multipark > 1){
					freeOccRate = getOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
					freeOccSignedRate = getOccupationRateFromObject(sId, appId, type + freeSlotSignedType, params, years, months, dayType, days, hours);
					paidOccRate = getOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
					timedOccRate = getOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
					handicappedOccRate = getOccupationRateFromObject(sId, appId, type + handicappedSlotType, params, years, months, dayType, days, hours);
					reservedOccRate = getOccupationRateFromObject(sId, appId, type + reservedSlotType, params, years, months, dayType, days, hours);
				}
				unusuabledParks = (int)getOccupationRateFromObject(sId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
			} else {
				occRate = getAverageOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
				if(multipark > 1){
					freeOccRate = getAverageOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
					freeOccSignedRate = getAverageOccupationRateFromObject(sId, appId, type + freeSlotSignedType, params, years, months, dayType, days, hours);
					paidOccRate = getAverageOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
					timedOccRate = getAverageOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
					handicappedOccRate = getAverageOccupationRateFromObject(sId, appId, type + handicappedSlotType, params, years, months, dayType, days, hours);
					reservedOccRate = getAverageOccupationRateFromObject(sId, appId, type + reservedSlotType, params, years, months, dayType, days, hours);
				}
				unusuabledParks = (int)getAverageOccupationRateFromObject(sId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
			}
			if(occRate > 100){
				occRate = 100;
			}
			s.setOccupancyRate(occRate);
			if(unusuabledParks > 0){
				s.setUnusuableSlotNumber(unusuabledParks);
			}
			// Here I have to retrieve other specific occupancyRate(for free/paid/timed parks) - MULTIPARKOCC
			if(s.getFreeParkSlotNumber() != null && s.getFreeParkSlotNumber() > 0){
				int freeSlotNumber = s.getFreeParkSlotNumber();
				if(unusuabledParks > 0){
					freeSlotNumber = freeSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					freeParks_occ = (int)Math.round(freeSlotNumber * freeOccRate / 100);
				} else {
					freeParks_occ = (int)Math.round(freeSlotNumber * occRate / 100);
				}
				s.setFreeParkSlotOccupied(freeParks_occ);
			}
			if(s.getFreeParkSlotSignNumber() != null && s.getFreeParkSlotSignNumber() > 0){
				int freeSlotSignNumber = s.getFreeParkSlotSignNumber();
				if(unusuabledParks > 0){
					freeSlotSignNumber = freeSlotSignNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					freeSignParks_occ = (int)Math.round(freeSlotSignNumber * freeOccSignedRate / 100);
				} else {
					freeSignParks_occ = (int)Math.round(freeSlotSignNumber * occRate / 100);
				}
				s.setFreeParkSlotSignOccupied(freeSignParks_occ);
			}
			if(s.getPaidSlotNumber() != null && s.getPaidSlotNumber() > 0){
				int paidSlotNumber = s.getPaidSlotNumber();
				if(unusuabledParks > 0){
					paidSlotNumber = paidSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					paidSlotParks_occ = (int)Math.round(paidSlotNumber * paidOccRate / 100);
				} else {
					paidSlotParks_occ = (int)Math.round(paidSlotNumber * occRate / 100);
				}
				s.setPaidSlotOccupied(paidSlotParks_occ);
			}
			if(s.getTimedParkSlotNumber() != null && s.getTimedParkSlotNumber() > 0){
				int timedParkSlotNumber = s.getTimedParkSlotNumber();
				if(unusuabledParks > 0){
					timedParkSlotNumber = timedParkSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					timedParks_occ = (int)Math.round(timedParkSlotNumber * timedOccRate / 100);
				} else {
					timedParks_occ = (int)Math.round(timedParkSlotNumber * occRate / 100);
				}
				s.setTimedParkSlotOccupied(timedParks_occ);
			}
			if(s.getHandicappedSlotNumber() != null && s.getHandicappedSlotNumber() > 0){
				int handicappedSlotNumber = s.getHandicappedSlotNumber();
				if(unusuabledParks > 0){
					handicappedSlotNumber = handicappedSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					handicappedParks_occ = (int)Math.round(handicappedSlotNumber * handicappedOccRate / 100);
				} else {
					handicappedParks_occ = (int)Math.round(handicappedSlotNumber * occRate / 100);
				}
				s.setHandicappedSlotOccupied(handicappedParks_occ);
			}
			if(s.getReservedSlotNumber() != null && s.getReservedSlotNumber() > 0){
				int reservedSlotNumber = s.getReservedSlotNumber();
				if(unusuabledParks > 0){
					reservedSlotNumber = reservedSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					reservedParks_occ = (int)Math.round(reservedSlotNumber * reservedOccRate / 100);
				} else {
					reservedParks_occ = (int)Math.round(reservedSlotNumber * occRate / 100);
				}
				s.setReservedSlotOccupied(reservedParks_occ);
			}
			int[] totalSlot = {freeParks, freeSignParks, paidSlotParks, timedParks, handicappedParks, reservedParks};
			int[] totalUsed = {freeParks_occ, freeSignParks_occ, paidSlotParks_occ, timedParks_occ, handicappedParks_occ, reservedParks_occ};
			if(occRate != -1.0){	// Only if occRate is valorized
				occRate = findOccupationRate(totalSlot, totalUsed, 0, 0, 1, s.getUnusuableSlotNumber());
				if(occRate > 100){
					occRate = 100;
				}
				s.setOccupancyRate(occRate);
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
			int unusuabledParks = 0;
			pId = getCorrectId(p.getId(), "parking", appId);
			if(valueType == 1){
				occRate = getOccupationRateFromObject(pId, appId, type, params, years, months, dayType, days, hours);
				unusuabledParks = (int)getOccupationRateFromObject(pId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
			} else {
				occRate = getAverageOccupationRateFromObject(pId, appId, type, params, years, months, dayType, days, hours);
				unusuabledParks = (int)getAverageOccupationRateFromObject(pId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
			}
			
			p.setOccupancyRate(occRate);
			int totalSlot = p.getSlotNumber();
			if(unusuabledParks > 0){
				totalSlot = totalSlot - unusuabledParks;
			}
			//p.setSlotOccupied((int)Math.round(totalSlot * occRate / 100));
			p.setSlotOccupied((int)Math.ceil(totalSlot * occRate / 100));
			p.setUnusuableSlotNumber(unusuabledParks);
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
	
	public ParkingMeterBean getProfitFromParkingMeter(String parkMeterId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		ParkingMeterBean pm = new ParkingMeterBean();
		double profitVal = 0;
		int ticketsNum = 0;
		String pId = getCorrectId(parkMeterId, "parkingmeter", appId);
		if(valueType == 1){
			profitVal = getLastProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
			ticketsNum = (int)getLastProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
		} else {
			profitVal = getSumProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
			ticketsNum = (int)getSumProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
		}
		pm.setProfit(profitVal);
		pm.setTickets(ticketsNum);
		return pm;
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
	
	public ParkingStructureBean getProfitFromParkStruct(String id, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType){
		ParkingStructureBean p = new ParkingStructureBean();
		String pId = "";
		double profitVal = 0;
		int ticketsNum = 0;
		pId = getCorrectId(id, "parkstruct", appId);
		if(valueType == 1){
			profitVal = getLastProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
			ticketsNum = (int)getLastProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
		} else {
			profitVal = getSumProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
			ticketsNum = (int)getSumProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
		}
		p.setProfit(profitVal);
		p.setTickets(ticketsNum);
		return p;
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
			double freeOccSignedRate = 0;
			double paidOccRate = 0;
			double timedOccRate = 0;
			double handicappedOccRate = 0;
			double reservedOccRate = 0;
			int freeParks = 0;
			int freeSignParks = 0;
			int paidSlotParks = 0;
			int timedParks = 0;
			int handicappedParks = 0;
			int reservedParks = 0;
			int unusuabledParks = 0;
//			if(s.getFreeParkSlotNumber() != null && s.getFreeParkSlotSignNumber() != null){
//				freeParks = s.getFreeParkSlotNumber()+s.getFreeParkSlotSignNumber();
//			} else {
//				if(s.getFreeParkSlotNumber() != null){
//					freeParks = s.getFreeParkSlotNumber();
//				} else {
//					freeParks = s.getFreeParkSlotSignNumber();
//				}
//			}
			if(s.getFreeParkSlotNumber() != null){
				freeParks = s.getFreeParkSlotNumber();
			}
			if(s.getFreeParkSlotSignNumber() != null){
				freeSignParks = s.getFreeParkSlotSignNumber();
			}
			if(s.getPaidSlotNumber() != null){
				paidSlotParks = s.getPaidSlotNumber();
			}
			if(s.getTimedParkSlotNumber() != null){
				timedParks = s.getTimedParkSlotNumber();
			}
			if(s.getHandicappedSlotNumber() != null){
				handicappedParks = s.getHandicappedSlotNumber();
			}
			if(s.getReservedSlotNumber() != null){
				reservedParks = s.getReservedSlotNumber();
			}
			int[] parks = {freeParks, freeSignParks, paidSlotParks, timedParks, handicappedParks, reservedParks};
			int multipark = countElements(parks);
			if(valueType == 1){
				occRate = getOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
				if(multipark > 1){
					freeOccRate = getOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
					freeOccSignedRate = getOccupationRateFromObject(sId, appId, type + freeSlotSignedType, params, years, months, dayType, days, hours);
					paidOccRate = getOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
					timedOccRate = getOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
					handicappedOccRate = getOccupationRateFromObject(sId, appId, type + handicappedSlotType, params, years, months, dayType, days, hours);
					reservedOccRate = getOccupationRateFromObject(sId, appId, type + reservedSlotType, params, years, months, dayType, days, hours);
				}
				unusuabledParks = (int)getOccupationRateFromObject(sId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
			} else {
				occRate = getAverageOccupationRateFromObject(sId, appId, type, params, years, months, dayType, days, hours);
				if(multipark > 1){
					freeOccRate = getAverageOccupationRateFromObject(sId, appId, type + freeSlotType, params, years, months, dayType, days, hours);
					freeOccSignedRate = getAverageOccupationRateFromObject(sId, appId, type + freeSlotSignedType, params, years, months, dayType, days, hours);
					paidOccRate = getAverageOccupationRateFromObject(sId, appId, type + paidSlotType, params, years, months, dayType, days, hours);
					timedOccRate = getAverageOccupationRateFromObject(sId, appId, type + timedSlotType, params, years, months, dayType, days, hours);
					handicappedOccRate = getAverageOccupationRateFromObject(sId, appId, type + handicappedSlotType, params, years, months, dayType, days, hours);
					reservedOccRate = getAverageOccupationRateFromObject(sId, appId, type + reservedSlotType, params, years, months, dayType, days, hours);
				}
				unusuabledParks = (int)getAverageOccupationRateFromObject(sId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
			}
			cs.setId(s.getId());
			cs.setSlotNumber(s.getSlotNumber());
			if(occRate > 100){
				occRate = 100;
			}
			cs.setOccupancyRate(occRate);
			if(unusuabledParks > 0){
				cs.setUnusuableSlotNumber(unusuabledParks);
			}
			// Here I have to retrieve other specific occupancyRate(for free/paid/timed parks) - MULTIPARKOCC
			if(s.getFreeParkSlotNumber() != null && s.getFreeParkSlotNumber() > 0){
				cs.setFreeParkSlotNumber(s.getFreeParkSlotNumber());
				int freeSlotNumber = s.getFreeParkSlotNumber();
				if(unusuabledParks > 0){
					freeSlotNumber = freeSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					cs.setFreeParkSlotOccupied((int)Math.round(freeSlotNumber * freeOccRate / 100));
				} else {
					cs.setFreeParkSlotOccupied((int)Math.round(freeSlotNumber * occRate / 100));
				}
			}
			if(s.getFreeParkSlotSignNumber() != null && s.getFreeParkSlotSignNumber() > 0){
				cs.setFreeParkSlotSignNumber(s.getFreeParkSlotSignNumber());
				int freeSlotSignNumber = s.getFreeParkSlotSignNumber();
				if(unusuabledParks > 0){
					freeSlotSignNumber = freeSlotSignNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					cs.setFreeParkSlotSignOccupied((int)Math.round(freeSlotSignNumber * freeOccSignedRate / 100));
				} else {
					cs.setFreeParkSlotSignOccupied((int)Math.round(freeSlotSignNumber * occRate / 100));
				}
			}
			if(s.getPaidSlotNumber() != null && s.getPaidSlotNumber() > 0){
				cs.setPaidSlotNumber(s.getPaidSlotNumber());
				int paidSlotNumber = s.getPaidSlotNumber();
				if(unusuabledParks > 0){
					paidSlotNumber = paidSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					cs.setPaidSlotOccupied((int)Math.round(paidSlotNumber * paidOccRate / 100));
				} else {
					cs.setPaidSlotOccupied((int)Math.round(paidSlotNumber * occRate / 100));
				}
			}
			if(s.getTimedParkSlotNumber() != null && s.getTimedParkSlotNumber() > 0){
				cs.setTimedParkSlotNumber(s.getTimedParkSlotNumber());
				int timedParkSlotNumber = s.getTimedParkSlotNumber();
				if(unusuabledParks > 0){
					timedParkSlotNumber = timedParkSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					cs.setTimedParkSlotOccupied((int)Math.round(timedParkSlotNumber * timedOccRate / 100));
				} else {
					cs.setTimedParkSlotOccupied((int)Math.round(timedParkSlotNumber * occRate / 100));
				}
			}
			if(s.getHandicappedSlotNumber() != null && s.getHandicappedSlotNumber() > 0){
				cs.setHandicappedSlotNumber(s.getHandicappedSlotNumber());
				int handicappedSlotNumber = s.getHandicappedSlotNumber();
				if(unusuabledParks > 0){
					handicappedSlotNumber = handicappedSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					cs.setHandicappedSlotOccupied((int)Math.round(handicappedSlotNumber * handicappedOccRate / 100));
				} else {
					cs.setHandicappedSlotOccupied((int)Math.round(handicappedSlotNumber * occRate / 100));
				}
			}
			if(s.getReservedSlotNumber() != null && s.getReservedSlotNumber() > 0){
				cs.setReservedSlotNumber(s.getReservedSlotNumber());
				int reservedSlotNumber = s.getReservedSlotNumber();
				if(unusuabledParks > 0){
					reservedSlotNumber = reservedSlotNumber - unusuabledParks;
					unusuabledParks = 0;
				}
				if(multipark > 1){
					cs.setReservedSlotOccupied((int)Math.round(reservedSlotNumber * reservedOccRate / 100));
				} else {
					cs.setReservedSlotOccupied((int)Math.round(reservedSlotNumber * occRate / 100));
				}
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
			int unusuabledParks = 0;
			pId = getCorrectId(p.getId(), "parking", appId);
			if(valueType == 1){
				occRate = getOccupationRateFromObject(pId, appId, type, params, years, months, dayType, days, hours);
				unusuabledParks = (int)getOccupationRateFromObject(pId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
			} else {
				occRate = getAverageOccupationRateFromObject(pId, appId, type, params, years, months, dayType, days, hours);
				unusuabledParks = (int)getAverageOccupationRateFromObject(pId, appId, type + unusuabledSlotType, params, years, months, dayType, days, hours);
			}
			cp.setId(p.getId());
			cp.setOccupancyRate(occRate);
			cp.setSlotNumber(p.getSlotNumber());
			int totalSlot = p.getSlotNumber();
			if(unusuabledParks > 0){
				totalSlot = totalSlot - unusuabledParks;
			}
			//cp.setSlotOccupied((int)Math.round(totalSlot * occRate / 100));
			cp.setSlotOccupied((int)Math.ceil(totalSlot * occRate / 100));
			cp.setUnusuableSlotNumber(unusuabledParks);
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
	public Long countTPAll(String agency, boolean deleted) {
		return mongodb.count(Query.query(new Criteria("agency").is(agency).and("deleted").is(false)), "dataLogBean");
	}
	public Long countTPTyped(String agency, boolean deleted, String type) {
		return mongodb.count(Query.query(new Criteria("agency").is(agency).and("deleted").is(false).and("type").is(type)), "dataLogBean");
	}
	public List<DataLogBeanTP> findTPAll(String agency, boolean deleted, int skip, int limit) {
		Query query = Query.query(new Criteria("agency").is(agency).and("deleted").is(false));
		query.limit(limit);
		query.skip(skip);
		query.sort().on("time", Order.DESCENDING);
		return mongodb.find(query, DataLogBeanTP.class, "dataLogBean");
		
	}
	public List<DataLogBeanTP> findTPTyped(String agency, boolean deleted, String type, int skip, int limit) {
		Query query = Query.query(new Criteria("agency").is(agency).and("deleted").is(false).and("type").is(type));
		query.limit(limit);
		query.skip(skip);
		query.sort().on("time", Order.DESCENDING);
		return mongodb.find(query, DataLogBeanTP.class, "dataLogBean");
	}

}
