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
import it.smartcommunitylab.parking.management.web.bean.StreetBeanCore;
import it.smartcommunitylab.parking.management.web.bean.StreetLog;
import it.smartcommunitylab.parking.management.web.bean.VehicleSlotBean;
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
import it.smartcommunitylab.parking.management.web.model.slots.VehicleSlot;
import it.smartcommunitylab.parking.management.web.model.slots.VehicleType;
import it.smartcommunitylab.parking.management.web.model.stats.StatKey;
import it.smartcommunitylab.parking.management.web.model.stats.StatValue;
import it.smartcommunitylab.parking.management.web.repository.DataLogBeanTP;
import it.smartcommunitylab.parking.management.web.repository.StatRepository;
import it.smartcommunitylab.parking.management.web.utils.VehicleTypeDataSetup;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.json.JSONObject;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
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
	private static final String ALL = "all";
	private static final String freeSlotType = "@free";
	private static final String freeSlotSignedType = "@freeSign";
	private static final String paidSlotType = "@paid";
	private static final String timedSlotType = "@timed";
	private static final String handicappedSlotType = "@handicapped";
	private static final String reservedSlotType = "@reserved";
	private static final String unusuabledSlotType = "@unusuabled";
	private static final String rechargeableSlotType = "@rechargeable";
	private static final String loadingUnloadingSlotType = "@loadingUnloading";
	private static final String pinkSlotType = "@pink";
	private static final String carSharingSlotType = "@carSharing";
	
	private static final String profit = "@profit";
	private static final String tickets = "@tickets";
	
	// Constants for comparation
	private static final int YEAR_VALS = 6;
	private static final int MONTH_VALS = 13;
	private static final int DOW_VALS = 8;
	private static final int HOUR_VALS = 25;
	private static final String[] MONTHS_LABEL = {"Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"};
	private static final String[] DOWS_LABEL = {"Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"};
	private static final String[] MONTHS_LABEL_ENG = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
	private static final String[] DOWS_LABEL_ENG = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
	private static final String[] HOURS_LABEL = {"00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"};

	@Autowired
	private MongoTemplate mongodb;
	
	@Autowired
	private StatRepository repo;
	
	@Autowired
	private VehicleTypeDataSetup vehicleTypeDataSetup;
	
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
		/*Criteria crit = new Criteria();
		crit.and("id_app").is(appId);
		crit.and("parkingMeters").elemMatch(crit_pm);
		RateArea ra = mongodb.findOne(new Query(crit), RateArea.class);
		ParkingMeter p = new ParkingMeter();
		p.setId(parcometroId);
		int index = ra.getParkingMeters().indexOf(p);
		if (index != -1) {
			ParkingMeterBean result = ModelConverter.convert(ra.getParkingMeters().get(index), ParkingMeterBean.class);
			result.setAreaId(ra.getId());
			return result;
		}*/
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
			//for (Street tmp : area.getStreets()) {
			Map<String, Street> streets = area.getStreets();
			for (Map.Entry<String, Street> entry : streets.entrySet())
			{
			    Street tmp = entry.getValue();
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
				//for (Street tmp : area.getStreets()) {
				Map<String, Street> streets = area.getStreets();
				for (Map.Entry<String, Street> entry : streets.entrySet())
				{
				    Street tmp = entry.getValue();
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
			//for (Street tmp : area.getStreets()) {
			Map<String, Street> streets = area.getStreets();
			for (Map.Entry<String, Street> entry : streets.entrySet())
			{
			    Street tmp = entry.getValue();
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

	public StreetBean findStreet(String streetId, String appId) {
		// for street
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
	
	public StreetBeanCore findStreetLight(String streetId, String appId) {
		// for street
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
			StreetBeanCore result = ModelConverter.toStreetBeanLight(ra, s);
			return result;
		}
		return null;
	}
	
	public StreetBean findStreet(String streetId, Long timestamp) {
		List<RateArea> aree = mongodb.findAll(RateArea.class);
		for (RateArea area : aree) {
			if (area.getStreets() != null) {
				Street st = area.getStreets().get(streetId);
				if (st != null) {
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
				//List<Street> streets = area.getStreets();
				//for(Street street : streets){
				Map<String, Street> streets = area.getStreets();
				for (Map.Entry<String, Street> entry : streets.entrySet())
				{
				    Street street = entry.getValue();
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
			//for (Street temp : area.getStreets()) {
			Map<String, Street> streets = area.getStreets();
			for (Map.Entry<String, Street> entry : streets.entrySet())
			{
			    Street temp = entry.getValue();
				if (temp.getId().equals(vb.getId())) {
					// Dynamic data
					/*temp.setFreeParkSlotOccupied(vb.getFreeParkSlotOccupied());
					temp.setFreeParkSlotSignOccupied(vb.getFreeParkSlotSignOccupied());
					temp.setHandicappedSlotOccupied(vb.getHandicappedSlotOccupied());
					temp.setTimedParkSlotOccupied(vb.getTimedParkSlotOccupied());
					temp.setPaidSlotOccupied(vb.getPaidSlotOccupied());*/
					List<VehicleSlot> corrVehicleSlots = temp.getSlotsConfiguration();
					List<VehicleSlotBean> editedSlotsConfBean = vb.getSlotsConfiguration();
					temp.setSlotsConfiguration(ModelConverter.toVehicleSlotList(editedSlotsConfBean, corrVehicleSlots));
					
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
		Criteria crit = new Criteria();
		crit.and("id_app").in(appId);
		crit.and("_id").is(new ObjectId(areaId));
		RateArea a = mongodb.findOne(Query.query(crit), RateArea.class);
		RateAreaBean ra = ModelConverter.convert(a, RateAreaBean.class);
		return ra;
		/*RateArea a = mongodb.findById(areaId, RateArea.class);
		RateAreaBean ra = ModelConverter.convert(a, RateAreaBean.class);
		return ra;*/
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
				//for(ParkingMeter pm : area.getParkingMeters()){
				Map<String, ParkingMeter> pms = area.getParkingMeters();
				for (Map.Entry<String, ParkingMeter> entry : pms.entrySet())
				{
					ParkingMeter pm = entry.getValue();	
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

	public void editStreetAux(it.smartcommunitylab.parking.management.web.auxiliary.model.Street s, Long timestamp, String agencyId, String authorId, String userAgencyId, boolean sysLog, String username, long[] period, int p_type) throws DatabaseException {
		String[] ids = s.getId().split("@");
		String asId = ids[2];
		s.setUpdateTime(timestamp);
		s.setUser(Integer.valueOf(authorId));
		
		RateArea area = null;
		if((s.getAreaId() != null) && (s.getAreaId().compareTo("") != 0)){
			area = mongodb.findById(s.getAreaId(), RateArea.class);
		} else {
			List<RateArea> aree = mongodb.findAll(RateArea.class);
			//Street myS = new Street();
			for (RateArea a : aree) {
				if (a.getStreets() != null) {
					//myS.setId(asId);
					//int index = a.getStreets().indexOf(s);
					//if (index != -1) {
					//	area = a;
					//}
					if(a.getStreets().containsKey(s.getId())){
						area = a;
					}
				}
			}
		}
		if (area.getStreets() != null) {
			//for (Street temp : area.getStreets()) {
			Map<String, Street> streets = area.getStreets();
			for (Map.Entry<String, Street> entry : streets.entrySet())
			{
			    Street temp = entry.getValue();
				if (temp.getId().equals(asId)) {
					// Dynamic data
					List<VehicleSlot> editedSlotsConf = s.getSlotsConfiguration();
					if(editedSlotsConf != null && !editedSlotsConf.isEmpty()){
						temp.setSlotsConfiguration(editedSlotsConf); 	// In this way I update only the inserted updated slots
					}
					/*temp.setFreeParkSlotOccupied(s.getSlotsOccupiedOnFree());
					temp.setFreeParkSlotSignOccupied(s.getSlotsOccupiedOnFreeSigned());
					temp.setTimedParkSlotOccupied(s.getSlotsOccupiedOnTimed());
					temp.setPaidSlotOccupied(s.getSlotsOccupiedOnPaying());
					temp.setHandicappedSlotOccupied(s.getSlotsOccupiedOnHandicapped());
					temp.setReservedSlotOccupied(s.getSlotsOccupiedOnReserved());
					temp.setUnusuableSlotNumber(s.getSlotsUnavailable());*/
					
					temp.setLastChange(timestamp);
					//mongodb.save(area);
					
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
					dl.setUserAgencyId(userAgencyId);
					
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
					logger.debug(String.format("Value String: %s", tmpVal.toString()));
					mongodb.save(dl);
					logger.info(String.format("Updated street %s occupacy by user %s", temp.toString(), username));
					// Here I have to cicle to all the vehicle Type Slots
					List<VehicleSlot> slotsConfiguration = temp.getSlotsConfiguration();
					
					if(slotsConfiguration != null && !slotsConfiguration.isEmpty()){
						for(VehicleSlot vs: slotsConfiguration){
							updateVehicleSlotsData(s, dl, vs, timestamp, agencyId, authorId, sysLog, period, p_type);
						}
					}
					
					break;
				}
			}
		}
	}
	
	private void updateVehicleSlotsData(it.smartcommunitylab.parking.management.web.auxiliary.model.Street s, DataLogBean dl, VehicleSlot vs, Long timestamp, String agencyId, String authorId, boolean sysLog, long[] period, int p_type){
		// Update Stat report
		int[] total = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
		int[] occupied = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
		double statValue = findOccupationRate(total, occupied, 0, 0, 1, retrieveSlots(vs.getUnusuableSlotNumber()));
		int unavailableSlots = retrieveSlots(vs.getUnusuableSlotNumber());
		String vehicleType = "@" + vs.getVehicleType();
		if(period == null || period.length == 0){
			if(p_type != -1){
				repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType, null, statValue, timestamp, p_type);
			} else {
				repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType, null, statValue, timestamp);
			}
		} else {
			repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType, null, statValue, timestamp, period, 1);
		}
		// Here I have to difference the type of the park: total, free, paying and timed - MULTIPARKOCC
		if(countElements(total) > 1){	// Here I check if there are more than one element of park type
			if(retrieveSlots(vs.getFreeParkSlotNumber()) != 0){
				double freeOccValue = findOccupationRate(null, null, vs.getFreeParkSlotNumber(), vs.getFreeParkSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + freeSlotType, null, freeOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + freeSlotType, null, freeOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + freeSlotType, null, freeOccValue, timestamp, period, 1);
				}
				if((vs.getFreeParkSlotNumber() - vs.getFreeParkSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getFreeParkSlotNumber() - vs.getFreeParkSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getFreeParkSlotSignNumber()) != 0){
				double freeSignOccValue = findOccupationRate(null, null, vs.getFreeParkSlotSignNumber(), vs.getFreeParkSlotSignOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + freeSlotSignedType, null, freeSignOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + freeSlotSignedType, null, freeSignOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + freeSlotSignedType, null, freeSignOccValue, timestamp, period, 1);
				}
				if((vs.getFreeParkSlotSignNumber() - vs.getFreeParkSlotSignOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getFreeParkSlotSignNumber() - vs.getFreeParkSlotSignOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getPaidSlotNumber()) != 0){
				double payingOccValue = findOccupationRate(null, null, vs.getPaidSlotNumber(), vs.getPaidSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + paidSlotType, null, payingOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + paidSlotType, null, payingOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + paidSlotType, null, payingOccValue, timestamp, period, 1);
				}
				if((vs.getPaidSlotNumber() - vs.getPaidSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getPaidSlotNumber() - vs.getPaidSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getTimedParkSlotNumber()) != 0){
				double timedOccValue = findOccupationRate(null, null, vs.getTimedParkSlotNumber(), vs.getTimedParkSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + timedSlotType, null, timedOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + timedSlotType, null, timedOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + timedSlotType, null, timedOccValue, timestamp, period, 1);
				}
				if((vs.getTimedParkSlotNumber() - vs.getTimedParkSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getTimedParkSlotNumber() - vs.getTimedParkSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getHandicappedSlotNumber()) != 0){
				double handicappedOccValue = findOccupationRate(null, null, vs.getHandicappedSlotNumber(), vs.getHandicappedSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + handicappedSlotType, null, handicappedOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + handicappedSlotType, null, handicappedOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + handicappedSlotType, null, handicappedOccValue, timestamp, period, 1);
				}
				if((vs.getHandicappedSlotNumber() - vs.getHandicappedSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getHandicappedSlotNumber() - vs.getHandicappedSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getReservedSlotNumber()) != 0){
				double reservedOccValue = findOccupationRate(null, null, vs.getReservedSlotNumber(), vs.getReservedSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + reservedSlotType, null, reservedOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + reservedSlotType, null, reservedOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + reservedSlotType, null, reservedOccValue, timestamp, period, 1);
				}
				if((vs.getReservedSlotNumber() - vs.getReservedSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getReservedSlotNumber() - vs.getReservedSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getRechargeableSlotNumber()) != 0){
				double rechargeableOccValue = findOccupationRate(null, null, vs.getRechargeableSlotNumber(), vs.getRechargeableSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + rechargeableSlotType, null, rechargeableOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + rechargeableSlotType, null, rechargeableOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + rechargeableSlotType, null, rechargeableOccValue, timestamp, period, 1);
				}
				if((vs.getRechargeableSlotNumber() - vs.getRechargeableSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getRechargeableSlotNumber() - vs.getRechargeableSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getLoadingUnloadingSlotNumber()) != 0){
				double loadingUnloadingOccValue = findOccupationRate(null, null, vs.getLoadingUnloadingSlotNumber(), vs.getLoadingUnloadingSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + loadingUnloadingSlotType, null, loadingUnloadingOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + loadingUnloadingSlotType, null, loadingUnloadingOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + loadingUnloadingSlotType, null, loadingUnloadingOccValue, timestamp, period, 1);
				}
				if((vs.getLoadingUnloadingSlotNumber() - vs.getLoadingUnloadingSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getLoadingUnloadingSlotNumber() - vs.getLoadingUnloadingSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getPinkSlotNumber()) != 0){
				double pinkOccValue = findOccupationRate(null, null, vs.getPinkSlotNumber(), vs.getPinkSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + pinkSlotType, null, pinkOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + pinkSlotType, null, pinkOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + pinkSlotType, null, pinkOccValue, timestamp, period, 1);
				}
				if((vs.getPinkSlotNumber() - vs.getPinkSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getPinkSlotNumber() - vs.getPinkSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getCarSharingSlotNumber()) != 0){
				double carSharingOccValue = findOccupationRate(null, null, vs.getCarSharingSlotNumber(), vs.getCarSharingSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + carSharingSlotType, null, carSharingOccValue, timestamp, p_type);
					} else {
						repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + carSharingSlotType, null, carSharingOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + carSharingSlotType, null, carSharingOccValue, timestamp, period, 1);
				}
				if((vs.getCarSharingSlotNumber() - vs.getCarSharingSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getCarSharingSlotNumber() - vs.getCarSharingSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
		}
		// this data can be present in the park with only a park type too
		if(retrieveSlots(vs.getUnusuableSlotNumber()) != -1 && retrieveSlots(vs.getUnusuableSlotNumber()) > 0){
			double unusualbedSlotVal = vs.getUnusuableSlotNumber();
			if(period == null || period.length == 0){
				if(p_type != -1){
					repo.updateDirectPeriodStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + unusuabledSlotType, null, unusualbedSlotVal, timestamp, p_type);
				} else {
					repo.updateStats(s.getId(), s.getAgency(), dl.getType() + vehicleType + unusuabledSlotType, null, unusualbedSlotVal, timestamp);
				}
			} else {
				repo.updateStatsPeriod(s.getId(), s.getAgency(), dl.getType() + vehicleType + unusuabledSlotType, null, unusualbedSlotVal, timestamp, period, 1);
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
		// Dynamic data
		List<VehicleSlot> corrVehicleSlots = entity.getSlotsConfiguration();
		List<VehicleSlotBean> editedSlotsConfBean = entityBean.getSlotsConfiguration();
		entity.setSlotsConfiguration(ModelConverter.toVehicleSlotList(editedSlotsConfBean, corrVehicleSlots));
		/*entity.setPayingSlotOccupied(entityBean.getPayingSlotOccupied());
		entity.setHandicappedSlotOccupied(entityBean.getHandicappedSlotOccupied());
		entity.setUnusuableSlotNumber(entityBean.getHandicappedSlotNumber());*/
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
	public void editParkingStructureAux(Parking p, Long timestamp, String agencyId, String authorId, String userAgencyId, boolean sysLog, String username, long[] period, int p_type) throws NotFoundException {
		String[] ids = p.getId().split("@");
		String pmId = ids[2];
		p.setUpdateTime(timestamp);
		p.setUser(Integer.valueOf(authorId));
		
		ParkingStructure entity = findById(pmId,ParkingStructure.class);
		// Dynamic data
		List<VehicleSlot> editedSlotsConf = p.getSlotsConfiguration();
		if(editedSlotsConf != null && !editedSlotsConf.isEmpty()){
			entity.setSlotsConfiguration(editedSlotsConf); 	// In this way I update only the inserted updated slots
		}
		/*entity.setHandicappedSlotOccupied(p.getSlotsOccupiedOnHandicapped());
		entity.setPayingSlotOccupied(p.getSlotsOccupiedOnPaying());
		entity.setUnusuableSlotNumber(p.getSlotsUnavailable());*/
		entity.setLastChange(timestamp);
		
		//mongodb.save(entity);
		
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
		dl.setUserAgencyId(userAgencyId);
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
		logger.info(String.format("Updated parking structure %s occupacy by user %s", p.getId(), username));
		// Here I have to cicle to all the vehicle Type Slots
		List<VehicleSlot> slotsConfiguration = p.getSlotsConfiguration();
		
		if(slotsConfiguration != null && !slotsConfiguration.isEmpty()){
			for(VehicleSlot vs: slotsConfiguration){
				updateVehicleSlotsDataForPS(p, dl, vs, timestamp, agencyId, authorId, sysLog, period, p_type);
			}
		}
		// Update Stat report
		/*int[] total = {p.getSlotsPaying(), p.getSlotsHandicapped()};
		int[] occupied = {p.getSlotsOccupiedOnPaying(), p.getSlotsOccupiedOnHandicapped()};
		double statValue = findOccupationRate(total, occupied, 0, 0, 1, p.getSlotsUnavailable());
		int unavailableSlots = p.getSlotsUnavailable();
		if(period == null || period.length == 0){
			if(p_type != -1){
				repo.updateDirectPeriodStats(p.getId(), p.getAgency(), dl.getType(), null, statValue, timestamp, p_type);
			} else {
				repo.updateStats(p.getId(), p.getAgency(), dl.getType(), null, statValue, timestamp);
			}
		} else {
			repo.updateStatsPeriod(p.getId(), p.getAgency(), dl.getType(), null, statValue, timestamp, period, 1);
		}
		if(countElements(total) > 1){	// Here I check if there are more than one element of park type
			if(p.getSlotsPaying()!= 0){
				double paidOccValue = findOccupationRate(null, null, p.getSlotsPaying(), p.getSlotsOccupiedOnPaying(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(p.getId(), p.getAgency(), dl.getType() + paidSlotType, null, paidOccValue, timestamp, p_type);
					} else {
						repo.updateStats(p.getId(), p.getAgency(), dl.getType() + paidSlotType, null, paidOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(p.getId(), p.getAgency(), dl.getType() + paidSlotType, null, paidOccValue, timestamp, period, 1);
				}
				if((p.getSlotsPaying() - p.getSlotsOccupiedOnPaying()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (p.getSlotsPaying() - p.getSlotsOccupiedOnPaying());
				} else {
					unavailableSlots = 0;
				}
			}
			if(p.getSlotsHandicapped() != 0){
				double handicappedOccValue = findOccupationRate(null, null, p.getSlotsHandicapped(), p.getSlotsOccupiedOnHandicapped(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(p.getId(), p.getAgency(), dl.getType() + handicappedSlotType, null, handicappedOccValue, timestamp, p_type);
					} else {
						repo.updateStats(p.getId(), p.getAgency(), dl.getType() + handicappedSlotType, null, handicappedOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(p.getId(), p.getAgency(), dl.getType() + handicappedSlotType, null, handicappedOccValue, timestamp, period, 1);
				}
				if((p.getSlotsHandicapped() - p.getSlotsOccupiedOnHandicapped()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (p.getSlotsHandicapped() - p.getSlotsOccupiedOnHandicapped());
				} else {
					unavailableSlots = 0;
				}
			}
		}
		// this data can be present in the park with only a park type too
		if(p.getSlotsUnavailable() != -1){
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
		}*/
	}
	
	private void updateVehicleSlotsDataForPS(it.smartcommunitylab.parking.management.web.auxiliary.model.Parking ps, DataLogBean dl, VehicleSlot vs, Long timestamp, String agencyId, String authorId, boolean sysLog, long[] period, int p_type){
		// Update Stat report
		int[] total = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
		int[] occupied = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
		double statValue = findOccupationRate(total, occupied, 0, 0, 1, retrieveSlots(vs.getUnusuableSlotNumber()));
		int unavailableSlots = retrieveSlots(vs.getUnusuableSlotNumber());
		String vehicleType = "@" + vs.getVehicleType();
		if(period == null || period.length == 0){
			if(p_type != -1){
				repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType, null, statValue, timestamp, p_type);
			} else {
				repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType, null, statValue, timestamp);
			}
		} else {
			repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType, null, statValue, timestamp, period, 1);
		}
		// Here I have to difference the type of the park: total, free, paying and timed - MULTIPARKOCC
		if(countElements(total) > 1){	// Here I check if there are more than one element of park type
			if(retrieveSlots(vs.getFreeParkSlotNumber()) != 0){
				double freeOccValue = findOccupationRate(null, null, vs.getFreeParkSlotNumber(), vs.getFreeParkSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + freeSlotType, null, freeOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + freeSlotType, null, freeOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + freeSlotType, null, freeOccValue, timestamp, period, 1);
				}
				if((vs.getFreeParkSlotNumber() - vs.getFreeParkSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getFreeParkSlotNumber() - vs.getFreeParkSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getFreeParkSlotSignNumber()) != 0){
				double freeSignOccValue = findOccupationRate(null, null, vs.getFreeParkSlotSignNumber(), vs.getFreeParkSlotSignOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + freeSlotSignedType, null, freeSignOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + freeSlotSignedType, null, freeSignOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + freeSlotSignedType, null, freeSignOccValue, timestamp, period, 1);
				}
				if((vs.getFreeParkSlotSignNumber() - vs.getFreeParkSlotSignOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getFreeParkSlotSignNumber() - vs.getFreeParkSlotSignOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getPaidSlotNumber()) != 0){
				double payingOccValue = findOccupationRate(null, null, vs.getPaidSlotNumber(), vs.getPaidSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + paidSlotType, null, payingOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + paidSlotType, null, payingOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + paidSlotType, null, payingOccValue, timestamp, period, 1);
				}
				if((vs.getPaidSlotNumber() - vs.getPaidSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getPaidSlotNumber() - vs.getPaidSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getTimedParkSlotNumber()) != 0){
				double timedOccValue = findOccupationRate(null, null, vs.getTimedParkSlotNumber(), vs.getTimedParkSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + timedSlotType, null, timedOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + timedSlotType, null, timedOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + timedSlotType, null, timedOccValue, timestamp, period, 1);
				}
				if((vs.getTimedParkSlotNumber() - vs.getTimedParkSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getTimedParkSlotNumber() - vs.getTimedParkSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getHandicappedSlotNumber()) != 0){
				double handicappedOccValue = findOccupationRate(null, null, vs.getHandicappedSlotNumber(), vs.getHandicappedSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + handicappedSlotType, null, handicappedOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + handicappedSlotType, null, handicappedOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + handicappedSlotType, null, handicappedOccValue, timestamp, period, 1);
				}
				if((vs.getHandicappedSlotNumber() - vs.getHandicappedSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getHandicappedSlotNumber() - vs.getHandicappedSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getReservedSlotNumber()) != 0){
				double reservedOccValue = findOccupationRate(null, null, vs.getReservedSlotNumber(), vs.getReservedSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + reservedSlotType, null, reservedOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + reservedSlotType, null, reservedOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + reservedSlotType, null, reservedOccValue, timestamp, period, 1);
				}
				if((vs.getReservedSlotNumber() - vs.getReservedSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getReservedSlotNumber() - vs.getReservedSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getRechargeableSlotNumber()) != 0){
				double rechargeableOccValue = findOccupationRate(null, null, vs.getRechargeableSlotNumber(), vs.getRechargeableSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + rechargeableSlotType, null, rechargeableOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + rechargeableSlotType, null, rechargeableOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + rechargeableSlotType, null, rechargeableOccValue, timestamp, period, 1);
				}
				if((vs.getRechargeableSlotNumber() - vs.getRechargeableSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getRechargeableSlotNumber() - vs.getRechargeableSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getLoadingUnloadingSlotNumber()) != 0){
				double loadingUnloadingOccValue = findOccupationRate(null, null, vs.getLoadingUnloadingSlotNumber(), vs.getLoadingUnloadingSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + loadingUnloadingSlotType, null, loadingUnloadingOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + loadingUnloadingSlotType, null, loadingUnloadingOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + loadingUnloadingSlotType, null, loadingUnloadingOccValue, timestamp, period, 1);
				}
				if((vs.getLoadingUnloadingSlotNumber() - vs.getLoadingUnloadingSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getLoadingUnloadingSlotNumber() - vs.getLoadingUnloadingSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getPinkSlotNumber()) != 0){
				double pinkOccValue = findOccupationRate(null, null, vs.getPinkSlotNumber(), vs.getPinkSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + pinkSlotType, null, pinkOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + pinkSlotType, null, pinkOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + pinkSlotType, null, pinkOccValue, timestamp, period, 1);
				}
				if((vs.getPinkSlotNumber() - vs.getPinkSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getPinkSlotNumber() - vs.getPinkSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
			if(retrieveSlots(vs.getCarSharingSlotNumber()) != 0){
				double carSharingOccValue = findOccupationRate(null, null, vs.getCarSharingSlotNumber(), vs.getCarSharingSlotOccupied(), 2, unavailableSlots);
				if(period == null || period.length == 0){
					if(p_type != -1){
						repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + carSharingSlotType, null, carSharingOccValue, timestamp, p_type);
					} else {
						repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + carSharingSlotType, null, carSharingOccValue, timestamp);
					}
				} else {
					repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + carSharingSlotType, null, carSharingOccValue, timestamp, period, 1);
				}
				if((vs.getCarSharingSlotNumber() - vs.getCarSharingSlotOccupied()) < unavailableSlots){
					unavailableSlots = unavailableSlots - (vs.getCarSharingSlotNumber() - vs.getCarSharingSlotOccupied());
				} else {
					unavailableSlots = 0;
				}
			}
		}
		// this data can be present in the park with only a park type too
		if(retrieveSlots(vs.getUnusuableSlotNumber()) != -1 && retrieveSlots(vs.getUnusuableSlotNumber()) > 0){
			double unusualbedSlotVal = vs.getUnusuableSlotNumber();
			if(period == null || period.length == 0){
				if(p_type != -1){
					repo.updateDirectPeriodStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + unusuabledSlotType, null, unusualbedSlotVal, timestamp, p_type);
				} else {
					repo.updateStats(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + unusuabledSlotType, null, unusualbedSlotVal, timestamp);
				}
			} else {
				repo.updateStatsPeriod(ps.getId(), ps.getAgency(), dl.getType() + vehicleType + unusuabledSlotType, null, unusualbedSlotVal, timestamp, period, 1);
			}
		}
	}
	
	// Method editParkStructProfitAux: used to save a ProfitLogBean object for the new profit data in a parkingStructure
	public void editParkStructProfitAux(ParkStruct p, Long timestamp, Long startTime, String agencyId, String authorId, String userAgencyId, boolean sysLog, String username, long[] period,  int p_type) throws NotFoundException {
		String[] ids = p.getId().split("@");
		String pmId = ids[2];
		p.setUpdateTime(timestamp);
		p.setUser(Integer.valueOf(authorId));
		
		ParkingStructure entity = findById(pmId,ParkingStructure.class);
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
		pl.setUserAgencyId(userAgencyId);
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
		logger.info(String.format("Updated parking structure %s profit by user %s", pl.getId(), username));
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
	public void editParkingMeterAux(ParkMeter pm, Long timestamp, Long startTime, String agencyId, String authorId, String userAgencyId, boolean sysLog, String username, long[] period, int p_type) throws NotFoundException {
		String[] ids = pm.getId().split("@");
		String pmId = ids[2];
		pm.setUpdateTime(timestamp);
		pm.setUser(Integer.valueOf(authorId));
		
		ParkingMeterBean entity = findParkingMeter(pmId, agencyId);
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
		pl.setUserAgencyId(userAgencyId);
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
		logger.info(String.format("Updated parking meter %s profit by user %s", pm.getId(), username));
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
		double d_occ = occ;
		double d_tot = tot;
		double rate = d_occ * 100.0 / d_tot;
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
	
	// Method getOccupationRateFromObjects: retrieve all occupancy data (last) filtered considering input parameters
	public Map<StatKey, StatValue> getOccupationRateFromObjects(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours){
		Map<StatKey, StatValue> res = null;
		if(dayType != null && dayType.compareTo("wd") == 0){
			res = repo.findLastValueWD(null, appId, type, params, years, months, hours);
		} else if(dayType != null && dayType.compareTo("we") == 0){
			res = repo.findLastValueWE(null, appId, type, params, years, months, hours);
		} else {
			res = repo.findLastValue(null, appId, type, params, years, months, days, hours);
		}
		return res;
	}
	
	// Method getOccupationRateFromObjects: retrieve all occupancy data (average) filtered considering input parameters
	public Map<StatKey, StatValue> getAverageOccupationRateFromObjects(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours){
		Map<StatKey, StatValue> res = null;
		if(dayType != null && dayType.compareTo("wd") == 0){
			res = repo.findStatsWD(null, appId, type, params, years, months, hours);
		} else if(dayType != null && dayType.compareTo("we") == 0){
			res = repo.findStatsWE(null, appId, type, params, years, months, hours);
		} else {
			res = repo.findStats(null, appId, type, params, years, months, days, hours);
		}
		return res;
	}
	
	// Method getOccupationRateFromObjects: retrieve all occupancy data (average) filtered considering input parameters
	public Map<String, Object> getAverageOccupationRateFromObjectsByGranularity(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, String vehicleType, String granularity){
		type = type + "@" + vehicleType;
		return repo.findStatsByGranularity(null, appId, type, granularity, params, years, months, days, hours);
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
			StatValue sv = res.get(key);
			if(sv != null){
				return sv.getLastValue();
			} else {
				return -1.0;
			}
		} else {
			return -1.0;
		}
	}
	
	
	public Map<String, Object> getOccupationRateFromObjectByGranularity(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, String granularity){
		return repo.findStatsByGranularity(objectId, appId, type, granularity, params, years, months, days, hours);
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
			StatValue sv = res.get(key);
			if(sv != null){
				return sv.getAggregateValue();
			} else {
				return -1.0;
			}
		} else {
			return -1.0;
		}
	}
	
	// Method getLastProfitFromObjects: retrieve all profit data (last) filtered considering input parameters
	public Map<StatKey, StatValue> getProfitFromObjects(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours){
		Map<StatKey, StatValue> res = null;
		if(dayType != null && dayType.compareTo("wd") == 0){
			res = repo.findStatsWD(null, appId, type, params, years, months, hours);
		} else if(dayType != null && dayType.compareTo("we") == 0){
			res = repo.findStatsWE(null, appId, type, params, years, months, hours);
		} else {
			res = repo.findStats(null, appId, type, params, years, months, days, hours);
		}
		return res;
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
			StatValue sv = res.get(key);
			if(sv != null){
				return sv.getLastValue();
			} else {
				return -1.0;
			}
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
			if(val != null){
				double sum = val.getCount() * val.getAggregateValue(); 
				return sum;
			} else {
				return -1.0;
			}
		} else {
			return -1.0;
		}
	}
	
	private int retrieveSlots(Integer slots){
		return (slots != null) ? slots.intValue() : 0;
	}
	
	private boolean rilevationPresent(VehicleSlotBean vs){
		boolean rilevPresent = false;
		if(vs.getCarSharingSlotOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getFreeParkSlotOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getFreeParkSlotSignOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getHandicappedSlotOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getLoadingUnloadingSlotOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getPaidSlotOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getPinkSlotOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getRechargeableSlotOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getReservedSlotOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getTimedParkSlotOccupied() != null){
			rilevPresent = true;
		}
		if(vs.getUnusuableSlotNumber() != null && vs.getUnusuableSlotNumber() > 0){
			rilevPresent = true;
		}
		return rilevPresent;
	}
	
	private int[] mergeIntArray(int[] slots, int[] oldSlots){
		int[] merged = oldSlots;
		for(int i = 0; i < oldSlots.length; i++){
			merged[i] = oldSlots[i] + slots[i];
		}
		return merged;
	}
	
	/**
	 * Method mergeOccupationRateForStreet: used to merge street data with the relative occupancy data (if present)
	 * @param objectId: street id;
	 * @param s: street complete object;
	 * @param appId: app id to use in occupation query
	 * @param type: object type to use in occupation query (street.class)
	 * @param valueType: occupation value type: last value or average
	 * @param vehicleType: type of vehicle to read in slots configuration
	 * @param statsVals: map of stat vals
	 * @return: complete StreetBean object with occupation data
	 */
	public StreetBean mergeOccupationRateForStreet(String objectId, StreetBean s, String appId, String type, int valueType, String vehicleType, Map<StatKey, StatValue> statsVals, String agencyId){
		String sId = getCorrectId(objectId, "street", appId);
		double occRate = -1;
		boolean averageOcc = false;
		int[] totalAverageSlot = null;
		int[] usedAverageSlot = null;
		int totalAverageUnusuabled = 0;
		if(s.getAgencyId().contains(agencyId) || agencyId.compareTo(ALL) == 0){
			try {
				List<VehicleSlotBean> vehicleSlotList = s.getSlotsConfiguration();
				VehicleSlotBean vs = null;
				if(vehicleSlotList != null && !vehicleSlotList.isEmpty()){
					for(int i = 0; i < vehicleSlotList.size(); i++){
						VehicleSlotBean tmp_vs = vehicleSlotList.get(i);
						if(tmp_vs.getVehicleType().compareTo(vehicleType) == 0){
							averageOcc = false;
							vehicleType = "@" + vehicleType;
							vs = calculateAndUpdateSlotsFromStatValue(tmp_vs, sId, appId, type, valueType, vehicleType, statsVals);
							if(rilevationPresent(vs)){
								int[] totalSlot = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
								int[] totalUsed = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
								occRate = findOccupationRate(totalSlot, totalUsed, 0, 0, 1, vs.getUnusuableSlotNumber());
								if(occRate > 100){
									occRate = 100;
								}
								vehicleSlotList.set(i, vs);	// update specific vehicle type slots
							}
							break;
						} else if(vehicleType == null || vehicleType.compareTo("") == 0 || vehicleType.compareTo("ALL") == 0){
							String vType = "@" + tmp_vs.getVehicleType();
							vs = calculateAndUpdateSlotsFromStatValue(tmp_vs, sId, appId, type, valueType, vType, statsVals);
							if(rilevationPresent(vs)){
								averageOcc = true;
								vehicleSlotList.set(i, vs);	// update specific vehicle type slots
								int[] totalSlot = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
								int[] totalUsed = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
								if(totalAverageSlot == null){
									totalAverageSlot = totalSlot;
								} else {
									totalAverageSlot = mergeIntArray(totalSlot, totalAverageSlot);
								}
								if(usedAverageSlot == null){
									usedAverageSlot = totalUsed;
								} else {
									usedAverageSlot = mergeIntArray(totalUsed, usedAverageSlot);
								}
								totalAverageUnusuabled += vs.getUnusuableSlotNumber();
							}
						}
					}
				}
				if(averageOcc){
					// Here I calculate the average occRate from all vehicles type slots occupancy
					occRate = findOccupationRate(totalAverageSlot, usedAverageSlot, 0, 0, 1, totalAverageUnusuabled);
					if(occRate > 100){
						occRate = 100;
					}
				}
				s.setSlotsConfiguration(vehicleSlotList);
				s.setOccupancyRate(occRate);
			} catch (Exception ex){
				logger.error("Error in slots configuration reading " + ex.getMessage());
			}
		} else {
			s.setOccupancyRate(occRate);
		}
		return s;
	}
	
	public StreetBeanCore mergeOccupationRateForStreetCore(String objectId, StreetBean s, String appId, String type, int valueType, String vehicleType, Map<StatKey, StatValue> statsVals, Map<String, Object> completeStatsVals, String agencyId){
		String sId = getCorrectId(objectId, "street", appId);
		StreetBeanCore sbc = new StreetBeanCore();
		sbc.setId(s.getId());
		sbc.setId_app(s.getId_app());
		sbc.setSlotNumber(s.getSlotNumber());
		sbc.setStreetReference(s.getStreetReference());
		sbc.setZones(s.getZones());
		sbc.setRateAreaId(s.getRateAreaId());
		sbc.setOccupancyData(retrieveCorrectCompleteOccupancyFromStatValue(sId, appId, type, completeStatsVals));
		return sbc;
	}
	
	public ParkingStructureBean mergeOccupationRateForParking(String objectId, ParkingStructureBean p, String appId, String type, int valueType, String vehicleType, Map<StatKey, StatValue> statsVals, String agencyId){
		String pId = getCorrectId(p.getId(), "parking", appId);
		double occRate = -1;
		boolean averageOcc = false;
		int[] totalAverageSlot = null;
		int[] usedAverageSlot = null;
		int totalAverageUnusuabled = 0;
		if(p.getAgencyId().contains(agencyId) || agencyId.compareTo(ALL) == 0){
			try {
				List<VehicleSlotBean> vehicleSlotList = p.getSlotsConfiguration();
				VehicleSlotBean vs = null;
				if(vehicleSlotList != null && !vehicleSlotList.isEmpty()){
					for(int i = 0; i < vehicleSlotList.size(); i++){
						VehicleSlotBean tmp_vs = vehicleSlotList.get(i);
						if(tmp_vs.getVehicleType().compareTo(vehicleType) == 0){
							averageOcc = false;
							vehicleType = "@" + vehicleType;
							vs = calculateAndUpdateSlotsFromStatValue(tmp_vs, pId, appId, type, valueType, vehicleType, statsVals);
							if(rilevationPresent(vs)){
								int[] totalSlot = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
								int[] totalUsed = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
								occRate = findOccupationRate(totalSlot, totalUsed, 0, 0, 1, vs.getUnusuableSlotNumber());
								if(occRate > 100){
									occRate = 100;
								}
								vehicleSlotList.set(i, vs);	// update specific vehicle type slots
							}
							break;
						} else if(vehicleType == null || vehicleType.compareTo("ALL") == 0 || vehicleType.compareTo("") == 0){
							vehicleType = "@" + tmp_vs.getVehicleType();
							vs = calculateAndUpdateSlotsFromStatValue(tmp_vs, pId, appId, type, valueType, vehicleType, statsVals);
							if(rilevationPresent(vs)){
								averageOcc = true;
								vehicleSlotList.set(i, vs);	// update specific vehicle type slots
								int[] totalSlot = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
								int[] totalUsed = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
								if(totalAverageSlot == null){
									totalAverageSlot = totalSlot;
								} else {
									totalAverageSlot = mergeIntArray(totalSlot, totalAverageSlot);
								}
								if(usedAverageSlot == null){
									usedAverageSlot = totalUsed;
								} else {
									usedAverageSlot = mergeIntArray(totalUsed, usedAverageSlot);
								}
								totalAverageUnusuabled += vs.getUnusuableSlotNumber();
							}
						}	
					}
				}
				if(averageOcc){
					// Here I calculate the average occRate from all vehicles type slots occupancy
					occRate = findOccupationRate(totalAverageSlot, usedAverageSlot, 0, 0, 1, totalAverageUnusuabled);
					if(occRate > 100){
						occRate = 100;
					}
				}
				p.setSlotsConfiguration(vehicleSlotList);
				p.setOccupancyRate(occRate);
			} catch (NullPointerException ex){
				//logger.error("Error in slots configuration reading " + ex.getMessage());
			}
		} else {
			p.setOccupancyRate(occRate);
		}
		return p;
	}
	
	public StreetBean getOccupationRateFromStreet(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String vehicleType){
		StopWatch watch = new Log4JStopWatch();
		logger.debug("Start Time for street (" + objectId + "): " + watch.getStartTime());
		StreetBean s = findStreet(objectId, appId);
		logger.debug("Elapsed Time to find street (" + objectId + "): "+ watch.getElapsedTime());
		String sId = getCorrectId(objectId, "street", appId);
		double occRate = -1;
		boolean averageOcc = false;
		int[] totalAverageSlot = null;
		int[] usedAverageSlot = null;
		int totalAverageUnusuabled = 0;
		try {
			List<VehicleSlotBean> vehicleSlotList = s.getSlotsConfiguration();
			VehicleSlotBean vs = null;
			if(vehicleSlotList != null && !vehicleSlotList.isEmpty()){
				for(int i = 0; i < vehicleSlotList.size(); i++){
					VehicleSlotBean tmp_vs = vehicleSlotList.get(i);
					if(tmp_vs.getVehicleType().compareTo(vehicleType) == 0){
						averageOcc = false;
						vehicleType = "@" + vehicleType;
						vs = calculateAndUpdateSlots(tmp_vs, sId, appId, type, params, years, months, dayType, days, hours, valueType, vehicleType);
						if(rilevationPresent(vs)){
							int[] totalSlot = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
							int[] totalUsed = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
							occRate = findOccupationRate(totalSlot, totalUsed, 0, 0, 1, vs.getUnusuableSlotNumber());
							if(occRate > 100){
								occRate = 100;
							}
							vehicleSlotList.set(i, vs);	// update specific vehicle type slots
						}
						break;
					} else if(vehicleType == null || vehicleType.compareTo("") == 0 || vehicleType.compareTo("ALL") == 0){
						String vType = "@" + tmp_vs.getVehicleType();
						vs = calculateAndUpdateSlots(tmp_vs, sId, appId, type, params, years, months, dayType, days, hours, valueType, vType);
						if(rilevationPresent(vs)){
							averageOcc = true;
							vehicleSlotList.set(i, vs);	// update specific vehicle type slots
							int[] totalSlot = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
							int[] totalUsed = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
							if(totalAverageSlot == null){
								totalAverageSlot = totalSlot;
							} else {
								totalAverageSlot = mergeIntArray(totalSlot, totalAverageSlot);
							}
							if(usedAverageSlot == null){
								usedAverageSlot = totalUsed;
							} else {
								usedAverageSlot = mergeIntArray(totalUsed, usedAverageSlot);
							}
							totalAverageUnusuabled += vs.getUnusuableSlotNumber();
							//averageOccRate = averageOccRate + findOccupationRate(totalSlot, totalUsed, 0, 0, 1, vs.getUnusuableSlotNumber());
						}
					}
				}
			}
			if(averageOcc){
				occRate = findOccupationRate(totalAverageSlot, usedAverageSlot, 0, 0, 1, totalAverageUnusuabled);
				// Here I calculate the average occRate from all vehicles type slots occupancy
				//occRate = averageOccRate / vehicleSlotList.size();
				if(occRate > 100){
					occRate = 100;
				}
			}
			s.setSlotsConfiguration(vehicleSlotList);
			s.setOccupancyRate(occRate);
		} catch (Exception ex){
			logger.error("Error in slots configuration reading " + ex.getMessage());
		}
		logger.info("Elapsed Time for slots conf in street (" + objectId + "): "+ watch.getElapsedTime());
		return s;
	}
	
	public StreetBeanCore getOccupationRateFromStreetCore(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String vehicleType, String granularity){
		StopWatch watch = new Log4JStopWatch();
		logger.debug("Start Time for street (" + objectId + "): " + watch.getStartTime());
		StreetBeanCore s = null;
		s = findStreetLight(objectId, appId);
		logger.debug("Elapsed Time to find street (" + objectId + "): "+ watch.getElapsedTime());
		String sId = getCorrectId(objectId, "street", appId);
		s.setOccupancyData(getOccupationRateFromObjectByGranularity(sId, appId, type + "@" + vehicleType, params, years, months, dayType, days, hours, granularity));
		logger.info("Elapsed Time for slots conf in street (" + objectId + "): "+ watch.getElapsedTime());
		return s;
	}
	
	public ParkingStructureBean getOccupationRateFromParking(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String vehicleType){
		ParkingStructureBean p = null;
		try {
			p = findParkingStructure(objectId);
		} catch (NotFoundException e) {
			e.printStackTrace();
		}
		String pId = getCorrectId(p.getId(), "parking", appId);
		double occRate = -1;
		boolean averageOcc = false;
		int[] totalAverageSlot = null;
		int[] usedAverageSlot = null;
		int totalAverageUnusuabled = 0;
		/*if(valueType == 1){
			occRate	= getOccupationRateFromObject(p.getId(), appId, type, params, years, months, dayType, days, hours);
		} else {
			occRate	= getAverageOccupationRateFromObject(p.getId(), appId, type, params, years, months, dayType, days, hours);
		}
		p.setOccupancyRate(occRate);*/
		try {
			List<VehicleSlotBean> vehicleSlotList = p.getSlotsConfiguration();
			VehicleSlotBean vs = null;
			if(vehicleSlotList != null && !vehicleSlotList.isEmpty()){
				for(int i = 0; i < vehicleSlotList.size(); i++){
					VehicleSlotBean tmp_vs = vehicleSlotList.get(i);
					if(tmp_vs.getVehicleType().compareTo(vehicleType) == 0){
						averageOcc = false;
						vehicleType = "@" + vehicleType;
						vs = calculateAndUpdateSlots(tmp_vs, pId, appId, type, params, years, months, dayType, days, hours, valueType, vehicleType);
						if(rilevationPresent(vs)){
							int[] totalSlot = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
							int[] totalUsed = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
							occRate = findOccupationRate(totalSlot, totalUsed, 0, 0, 1, vs.getUnusuableSlotNumber());
							if(occRate > 100){
								occRate = 100;
							}
							vehicleSlotList.set(i, vs);	// update specific vehicle type slots
						}
						break;
					} else if(vehicleType == null || vehicleType.compareTo("ALL") == 0 || vehicleType.compareTo("") == 0){
						vehicleType = "@" + tmp_vs.getVehicleType();
						vs = calculateAndUpdateSlots(tmp_vs, pId, appId, type, params, years, months, dayType, days, hours, valueType, vehicleType);
						if(rilevationPresent(vs)){
							averageOcc = true;
							vehicleSlotList.set(i, vs);	// update specific vehicle type slots
							int[] totalSlot = {retrieveSlots(vs.getFreeParkSlotNumber()), retrieveSlots(vs.getFreeParkSlotSignNumber()), retrieveSlots(vs.getPaidSlotNumber()), retrieveSlots(vs.getTimedParkSlotNumber()), retrieveSlots(vs.getHandicappedSlotNumber()), retrieveSlots(vs.getReservedSlotNumber()), retrieveSlots(vs.getRechargeableSlotNumber()), retrieveSlots(vs.getLoadingUnloadingSlotNumber()), retrieveSlots(vs.getPinkSlotNumber()), retrieveSlots(vs.getCarSharingSlotNumber())};
							int[] totalUsed = {retrieveSlots(vs.getFreeParkSlotOccupied()), retrieveSlots(vs.getFreeParkSlotSignOccupied()), retrieveSlots(vs.getPaidSlotOccupied()), retrieveSlots(vs.getTimedParkSlotOccupied()), retrieveSlots(vs.getHandicappedSlotOccupied()), retrieveSlots(vs.getReservedSlotOccupied()), retrieveSlots(vs.getRechargeableSlotOccupied()), retrieveSlots(vs.getLoadingUnloadingSlotOccupied()), retrieveSlots(vs.getPinkSlotOccupied()), retrieveSlots(vs.getCarSharingSlotOccupied())};
							if(totalAverageSlot == null){
								totalAverageSlot = totalSlot;
							} else {
								totalAverageSlot = mergeIntArray(totalSlot, totalAverageSlot);
							}
							if(usedAverageSlot == null){
								usedAverageSlot = totalUsed;
							} else {
								usedAverageSlot = mergeIntArray(totalUsed, usedAverageSlot);
							}
							totalAverageUnusuabled += vs.getUnusuableSlotNumber();
							//averageOccRate = averageOccRate + findOccupationRate(totalSlot, totalUsed, 0, 0, 1, vs.getUnusuableSlotNumber());
						}
					}	
				}
			}
			if(averageOcc){
				occRate = findOccupationRate(totalAverageSlot, usedAverageSlot, 0, 0, 1, totalAverageUnusuabled);
				// Here I calculate the average occRate from all vehicles type slots occupancy
				//occRate = averageOccRate / vehicleSlotList.size();
				if(occRate > 100){
					occRate = 100;
				}
			}
			p.setSlotsConfiguration(vehicleSlotList);
			p.setOccupancyRate(occRate);
		} catch (NullPointerException ex){
			//logger.error("Error in slots configuration reading " + ex.getMessage());
		}
		return p;
	}
	
	private double retrieveCorrectOccupancyFromStatValue(String sId, String appId, String type, int valueType, Map<StatKey, StatValue> statsVals){
		StatKey myKey = new StatKey(sId, appId, type);
		StatValue sv = statsVals.get(myKey);
		if(sv != null){
			if(valueType == 1){
				return sv.getLastValue();
			} else {
				return sv.getAggregateValue();
			}
		} else {	// no rilevation
			return -1.0;
		}
	};
	
	private Map<String,Object> retrieveCorrectCompleteOccupancyFromStatValue(String sId, String appId, String type, Map<String, Object> statsVals){
		StatKey myKey = new StatKey(sId, appId, type);
		Map<String, Object> corrMap = new HashMap<String, Object>();
		for (Iterator<String> iterator = statsVals.keySet().iterator(); iterator.hasNext();) {
			String key = iterator.next();
			//logger.info("myKey: " + myKey.toStringSpecial2() );
			if(key.contains(myKey.toStringSpecial2())){
				corrMap.put(removeObjectIdFromKey(key, myKey.toStringSpecial2()), statsVals.get(key));
			}
		}
		return corrMap;
	};
	
	private String removeObjectIdFromKey(String completeKey, String key){
		return completeKey.replaceFirst(key + "@Car:", "");
	};
	
	private double retrieveCorrectProfitFromStatValue(String pId, String appId, String type, int valueType, Map<StatKey, StatValue> statsVals){
		StatKey myKey = new StatKey(pId, appId, type);
		StatValue sv = statsVals.get(myKey);
		if(sv != null){
			if(valueType == 1){
				return sv.getLastValue();
			} else {
				double sum = sv.getCount() * sv.getAggregateValue(); 
				return sum;
			}
		} else {	// no rilevation
			return -1.0;
		}
	};
	
	private VehicleSlotBean calculateAndUpdateSlotsFromStatValue(VehicleSlotBean vs, String sId, String appId, String type, int valueType, String vehicleType, Map<StatKey, StatValue> statsVals){
		double occRate = 0;
		double freeOccRate = 0;
		double freeOccSignedRate = 0;
		double paidOccRate = 0;
		double timedOccRate = 0;
		double handicappedOccRate = 0;
		double reservedOccRate = 0;
		double rechargeableOccRate = 0;
		double loadingUnloadingOccRate = 0;
		double pinkOccRate = 0;
		double carSharingOccRate = 0;
		
		int freeParks = 0;
		int freeSignParks = 0;
		int paidSlotParks = 0;
		int timedParks = 0;
		int handicappedParks = 0;
		int reservedParks = 0;
		int rechargeableParks = 0;		// ricaricabili
		int loadingUnloadingParks = 0;	// posti carico scarico
		int pinkParks = 0;				// posti rosa
		int carSharingParks = 0;		// posti car sharing
		int unusuabledParks = 0;
		
		int freeParks_occ = 0;
		int freeSignParks_occ = 0;
		int paidSlotParks_occ = 0;
		int timedParks_occ = 0;
		int handicappedParks_occ = 0;
		int reservedParks_occ = 0;
		int rechargeableParks_occ = 0;		// ricaricabili
		int loadingUnloadingParks_occ = 0;	// posti carico scarico
		int pinkParks_occ = 0;				// posti rosa
		int carSharingParks_occ = 0;		// posti car sharing
		
		if(vs.getFreeParkSlotNumber() != null){
			freeParks = vs.getFreeParkSlotNumber();
		}
		if(vs.getFreeParkSlotSignNumber() != null){
			freeSignParks = vs.getFreeParkSlotSignNumber();
		}
		if(vs.getPaidSlotNumber() != null){
			paidSlotParks = vs.getPaidSlotNumber();
		}
		if(vs.getTimedParkSlotNumber() != null){
			timedParks = vs.getTimedParkSlotNumber();
		}
		if(vs.getHandicappedSlotNumber() != null){
			handicappedParks = vs.getHandicappedSlotNumber();
		}
		if(vs.getReservedSlotNumber() != null){
			reservedParks = vs.getReservedSlotNumber();
		}
		if(vs.getRechargeableSlotNumber() != null){
			rechargeableParks = vs.getRechargeableSlotNumber();
		}
		if(vs.getLoadingUnloadingSlotNumber() != null){
			loadingUnloadingParks = vs.getLoadingUnloadingSlotNumber();
		}
		if(vs.getPinkSlotNumber() != null){
			pinkParks = vs.getPinkSlotNumber();
		}
		if(vs.getCarSharingSlotNumber() != null){
			carSharingParks = vs.getCarSharingSlotNumber();
		}
		int[] parks = {freeParks, freeSignParks, paidSlotParks, timedParks, handicappedParks, reservedParks, rechargeableParks, loadingUnloadingParks, pinkParks, carSharingParks};
		int multipark = countElements(parks);
		occRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType, valueType, statsVals);
			if(multipark > 1){
				freeOccRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + freeSlotType, valueType, statsVals);
				freeOccSignedRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + freeSlotSignedType, valueType, statsVals);
				paidOccRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + paidSlotType, valueType, statsVals);
				timedOccRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + timedSlotType, valueType, statsVals);
				handicappedOccRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + handicappedSlotType, valueType, statsVals);
				reservedOccRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + reservedSlotType, valueType, statsVals);
				rechargeableOccRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + rechargeableSlotType, valueType, statsVals);
				loadingUnloadingOccRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + loadingUnloadingSlotType, valueType, statsVals);
				pinkOccRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + pinkSlotType, valueType, statsVals);
				carSharingOccRate = retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + carSharingSlotType, valueType, statsVals);
			}
			unusuabledParks = (int)retrieveCorrectOccupancyFromStatValue(sId, appId, type + vehicleType + unusuabledSlotType, valueType, statsVals);
		
		if(unusuabledParks > 0){
			vs.setUnusuableSlotNumber(unusuabledParks);
		}
		if(occRate != -1.0){
			// Here I have to retrieve other specific occupancyRate(for free/paid/timed parks) - MULTIPARKOCC
			if(vs.getFreeParkSlotNumber() != null && vs.getFreeParkSlotNumber() > 0 && freeOccRate > -1){
				int freeSlotNumber = vs.getFreeParkSlotNumber();
				if(unusuabledParks > 0){
					freeSlotNumber = freeSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(freeSlotNumber < 0){
						unusuabledParks = Math.abs(freeSlotNumber);
						freeSlotNumber = 0;
					}
				}
				if(multipark > 1){
					freeParks_occ = (int)Math.round(freeSlotNumber * freeOccRate / 100);
				} else {
					freeParks_occ = (int)Math.round(freeSlotNumber * occRate / 100);
				}
				vs.setFreeParkSlotOccupied(freeParks_occ);
			}
			if(vs.getFreeParkSlotSignNumber() != null && vs.getFreeParkSlotSignNumber() > 0 && freeOccSignedRate > -1){
				int freeSlotSignNumber = vs.getFreeParkSlotSignNumber();
				if(unusuabledParks > 0){
					freeSlotSignNumber = freeSlotSignNumber - unusuabledParks;
					unusuabledParks = 0;
					if(freeSlotSignNumber < 0){
						unusuabledParks = Math.abs(freeSlotSignNumber);
						freeSlotSignNumber = 0;
					}
				}
				if(multipark > 1){
					freeSignParks_occ = (int)Math.round(freeSlotSignNumber * freeOccSignedRate / 100);
				} else {
					freeSignParks_occ = (int)Math.round(freeSlotSignNumber * occRate / 100);
				}
				vs.setFreeParkSlotSignOccupied(freeSignParks_occ);
			}
			if(vs.getPaidSlotNumber() != null && vs.getPaidSlotNumber() > 0 && paidOccRate > -1){
				int paidSlotNumber = vs.getPaidSlotNumber();
				if(unusuabledParks > 0){
					paidSlotNumber = paidSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(paidSlotNumber < 0){
						unusuabledParks = Math.abs(paidSlotNumber);
						paidSlotNumber = 0;
					}
				}
				if(multipark > 1){
					paidSlotParks_occ = (int)Math.round(paidSlotNumber * paidOccRate / 100);
				} else {
					paidSlotParks_occ = (int)Math.round(paidSlotNumber * occRate / 100);
				}
				vs.setPaidSlotOccupied(paidSlotParks_occ);
			}
			if(vs.getTimedParkSlotNumber() != null && vs.getTimedParkSlotNumber() > 0 && timedOccRate > -1){
				int timedParkSlotNumber = vs.getTimedParkSlotNumber();
				if(unusuabledParks > 0){
					timedParkSlotNumber = timedParkSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(timedParkSlotNumber < 0){
						unusuabledParks = Math.abs(timedParkSlotNumber);
						timedParkSlotNumber = 0;
					}
				}
				if(multipark > 1){
					timedParks_occ = (int)Math.round(timedParkSlotNumber * timedOccRate / 100);
				} else {
					timedParks_occ = (int)Math.round(timedParkSlotNumber * occRate / 100);
				}
				vs.setTimedParkSlotOccupied(timedParks_occ);
			}
			if(vs.getHandicappedSlotNumber() != null && vs.getHandicappedSlotNumber() > 0 && handicappedOccRate > -1){
				int handicappedSlotNumber = vs.getHandicappedSlotNumber();
				if(unusuabledParks > 0){
					handicappedSlotNumber = handicappedSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(handicappedSlotNumber < 0){
						unusuabledParks = Math.abs(handicappedSlotNumber);
						handicappedSlotNumber = 0;
					}
				}
				if(multipark > 1){
					handicappedParks_occ = (int)Math.round(handicappedSlotNumber * handicappedOccRate / 100);
				} else {
					handicappedParks_occ = (int)Math.round(handicappedSlotNumber * occRate / 100);
				}
				vs.setHandicappedSlotOccupied(handicappedParks_occ);
			}
			if(vs.getReservedSlotNumber() != null && vs.getReservedSlotNumber() > 0 && reservedOccRate > -1){
				int reservedSlotNumber = vs.getReservedSlotNumber();
				if(unusuabledParks > 0){
					reservedSlotNumber = reservedSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(reservedSlotNumber < 0){
						unusuabledParks = Math.abs(reservedSlotNumber);
						reservedSlotNumber = 0;
					}
				}
				if(multipark > 1){
					reservedParks_occ = (int)Math.round(reservedSlotNumber * reservedOccRate / 100);
				} else {
					reservedParks_occ = (int)Math.round(reservedSlotNumber * occRate / 100);
				}
				vs.setReservedSlotOccupied(reservedParks_occ);
			}
			if(vs.getRechargeableSlotNumber() != null && vs.getRechargeableSlotNumber() > 0 && rechargeableOccRate > -1){
				int rechargeableSlotNumber = vs.getRechargeableSlotNumber();
				if(unusuabledParks > 0){
					rechargeableSlotNumber = rechargeableSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(rechargeableSlotNumber < 0){
						unusuabledParks = Math.abs(rechargeableSlotNumber);
						rechargeableSlotNumber = 0;
					}
				}
				if(multipark > 1){
					rechargeableParks_occ = (int)Math.round(rechargeableSlotNumber * rechargeableOccRate / 100);
				} else {
					rechargeableParks_occ = (int)Math.round(rechargeableSlotNumber * occRate / 100);
				}
				vs.setRechargeableSlotOccupied(rechargeableParks_occ);
			}
			if(vs.getLoadingUnloadingSlotNumber() != null && vs.getLoadingUnloadingSlotNumber() > 0 && loadingUnloadingOccRate > -1){
				int loadingUnloadingSlotNumber = vs.getLoadingUnloadingSlotNumber();
				if(unusuabledParks > 0){
					loadingUnloadingSlotNumber = loadingUnloadingSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(loadingUnloadingSlotNumber < 0){
						unusuabledParks = Math.abs(loadingUnloadingSlotNumber);
						loadingUnloadingSlotNumber = 0;
					}
				}
				if(multipark > 1){
					loadingUnloadingParks_occ = (int)Math.round(loadingUnloadingSlotNumber * loadingUnloadingOccRate / 100);
				} else {
					loadingUnloadingParks_occ = (int)Math.round(loadingUnloadingSlotNumber * occRate / 100);
				}
				vs.setLoadingUnloadingSlotOccupied(loadingUnloadingParks_occ);
			}
			if(vs.getPinkSlotNumber() != null && vs.getPinkSlotNumber() > 0 && pinkOccRate > -1){
				int pinkSlotNumber = vs.getPinkSlotNumber();
				if(unusuabledParks > 0){
					pinkSlotNumber = pinkSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(pinkSlotNumber < 0){
						unusuabledParks = Math.abs(pinkSlotNumber);
						pinkSlotNumber = 0;
					}
				}
				if(multipark > 1){
					pinkParks_occ = (int)Math.round(pinkSlotNumber * pinkOccRate / 100);
				} else {
					pinkParks_occ = (int)Math.round(pinkSlotNumber * occRate / 100);
				}
				vs.setPinkSlotOccupied(pinkParks_occ);
			}
			if(vs.getCarSharingSlotNumber() != null && vs.getCarSharingSlotNumber() > 0 && carSharingOccRate > -1){
				int carSharingSlotNumber = vs.getCarSharingSlotNumber();
				if(unusuabledParks > 0){
					carSharingSlotNumber = carSharingSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(carSharingSlotNumber < 0){
						unusuabledParks = Math.abs(carSharingSlotNumber);
						carSharingSlotNumber = 0;
					}
				}
				if(multipark > 1){
					carSharingParks_occ = (int)Math.round(carSharingSlotNumber * carSharingOccRate / 100);
				} else {
					carSharingParks_occ = (int)Math.round(carSharingSlotNumber * occRate / 100);
				}
				vs.setCarSharingSlotOccupied(carSharingParks_occ);
			}
		}
		return vs;
	}
	
	private VehicleSlotBean calculateAndUpdateSlots(VehicleSlotBean vs, String sId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String vehicleType){
		double occRate = 0;
		double freeOccRate = 0;
		double freeOccSignedRate = 0;
		double paidOccRate = 0;
		double timedOccRate = 0;
		double handicappedOccRate = 0;
		double reservedOccRate = 0;
		double rechargeableOccRate = 0;
		double loadingUnloadingOccRate = 0;
		double pinkOccRate = 0;
		double carSharingOccRate = 0;
		
		int freeParks = 0;
		int freeSignParks = 0;
		int paidSlotParks = 0;
		int timedParks = 0;
		int handicappedParks = 0;
		int reservedParks = 0;
		int rechargeableParks = 0;		// ricaricabili
		int loadingUnloadingParks = 0;	// posti carico scarico
		int pinkParks = 0;				// posti rosa
		int carSharingParks = 0;		// posti car sharing
		int unusuabledParks = 0;
		
		int freeParks_occ = 0;
		int freeSignParks_occ = 0;
		int paidSlotParks_occ = 0;
		int timedParks_occ = 0;
		int handicappedParks_occ = 0;
		int reservedParks_occ = 0;
		int rechargeableParks_occ = 0;		// ricaricabili
		int loadingUnloadingParks_occ = 0;	// posti carico scarico
		int pinkParks_occ = 0;				// posti rosa
		int carSharingParks_occ = 0;		// posti car sharing
		
		if(vs.getFreeParkSlotNumber() != null){
			freeParks = vs.getFreeParkSlotNumber();
		}
		if(vs.getFreeParkSlotSignNumber() != null){
			freeSignParks = vs.getFreeParkSlotSignNumber();
		}
		if(vs.getPaidSlotNumber() != null){
			paidSlotParks = vs.getPaidSlotNumber();
		}
		if(vs.getTimedParkSlotNumber() != null){
			timedParks = vs.getTimedParkSlotNumber();
		}
		if(vs.getHandicappedSlotNumber() != null){
			handicappedParks = vs.getHandicappedSlotNumber();
		}
		if(vs.getReservedSlotNumber() != null){
			reservedParks = vs.getReservedSlotNumber();
		}
		if(vs.getRechargeableSlotNumber() != null){
			rechargeableParks = vs.getRechargeableSlotNumber();
		}
		if(vs.getLoadingUnloadingSlotNumber() != null){
			loadingUnloadingParks = vs.getLoadingUnloadingSlotNumber();
		}
		if(vs.getPinkSlotNumber() != null){
			pinkParks = vs.getPinkSlotNumber();
		}
		if(vs.getCarSharingSlotNumber() != null){
			carSharingParks = vs.getCarSharingSlotNumber();
		}
		int[] parks = {freeParks, freeSignParks, paidSlotParks, timedParks, handicappedParks, reservedParks, rechargeableParks, loadingUnloadingParks, pinkParks, carSharingParks};
		int multipark = countElements(parks);
		if(valueType == 1){	// last value
			occRate = getOccupationRateFromObject(sId, appId, type + vehicleType, params, years, months, dayType, days, hours);
			if(multipark > 1){
				freeOccRate = getOccupationRateFromObject(sId, appId, type + vehicleType + freeSlotType, params, years, months, dayType, days, hours);
				freeOccSignedRate = getOccupationRateFromObject(sId, appId, type + vehicleType + freeSlotSignedType, params, years, months, dayType, days, hours);
				paidOccRate = getOccupationRateFromObject(sId, appId, type + vehicleType + paidSlotType, params, years, months, dayType, days, hours);
				timedOccRate = getOccupationRateFromObject(sId, appId, type + vehicleType + timedSlotType, params, years, months, dayType, days, hours);
				handicappedOccRate = getOccupationRateFromObject(sId, appId, type + vehicleType + handicappedSlotType, params, years, months, dayType, days, hours);
				reservedOccRate = getOccupationRateFromObject(sId, appId, type + vehicleType + reservedSlotType, params, years, months, dayType, days, hours);
				rechargeableOccRate = getOccupationRateFromObject(sId, appId, type + vehicleType + rechargeableSlotType, params, years, months, dayType, days, hours);
				loadingUnloadingOccRate = getOccupationRateFromObject(sId, appId, type + vehicleType + loadingUnloadingSlotType, params, years, months, dayType, days, hours);
				pinkOccRate = getOccupationRateFromObject(sId, appId, type + vehicleType + pinkSlotType, params, years, months, dayType, days, hours);
				carSharingOccRate = getOccupationRateFromObject(sId, appId, type + vehicleType + carSharingSlotType, params, years, months, dayType, days, hours);
			}
			unusuabledParks = (int)getOccupationRateFromObject(sId, appId, type + vehicleType + unusuabledSlotType, params, years, months, dayType, days, hours);
		} else {	// average value
			occRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType, params, years, months, dayType, days, hours);
			if(multipark > 1){
				freeOccRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + freeSlotType, params, years, months, dayType, days, hours);
				freeOccSignedRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + freeSlotSignedType, params, years, months, dayType, days, hours);
				paidOccRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + paidSlotType, params, years, months, dayType, days, hours);
				timedOccRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + timedSlotType, params, years, months, dayType, days, hours);
				handicappedOccRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + handicappedSlotType, params, years, months, dayType, days, hours);
				reservedOccRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + reservedSlotType, params, years, months, dayType, days, hours);
				rechargeableOccRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + rechargeableSlotType, params, years, months, dayType, days, hours);
				loadingUnloadingOccRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + loadingUnloadingSlotType, params, years, months, dayType, days, hours);
				pinkOccRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + pinkSlotType, params, years, months, dayType, days, hours);
				carSharingOccRate = getAverageOccupationRateFromObject(sId, appId, type + vehicleType + carSharingSlotType, params, years, months, dayType, days, hours);
			}
			unusuabledParks = (int)getAverageOccupationRateFromObject(sId, appId, type + vehicleType + unusuabledSlotType, params, years, months, dayType, days, hours);
		}
		if(unusuabledParks > 0){
			vs.setUnusuableSlotNumber(unusuabledParks);
		}
		if(occRate != -1.0){
			// Here I have to retrieve other specific occupancyRate(for free/paid/timed parks) - MULTIPARKOCC
			if(vs.getFreeParkSlotNumber() != null && vs.getFreeParkSlotNumber() > 0 && freeOccRate > -1){
				int freeSlotNumber = vs.getFreeParkSlotNumber();
				if(unusuabledParks > 0){
					freeSlotNumber = freeSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(freeSlotNumber < 0){
						unusuabledParks = Math.abs(freeSlotNumber);
						freeSlotNumber = 0;
					}
				}
				if(multipark > 1){
					freeParks_occ = (int)Math.round(freeSlotNumber * freeOccRate / 100);
				} else {
					freeParks_occ = (int)Math.round(freeSlotNumber * occRate / 100);
				}
				vs.setFreeParkSlotOccupied(freeParks_occ);
			}
			if(vs.getFreeParkSlotSignNumber() != null && vs.getFreeParkSlotSignNumber() > 0 && freeOccSignedRate > -1){
				int freeSlotSignNumber = vs.getFreeParkSlotSignNumber();
				if(unusuabledParks > 0){
					freeSlotSignNumber = freeSlotSignNumber - unusuabledParks;
					unusuabledParks = 0;
					if(freeSlotSignNumber < 0){
						unusuabledParks = Math.abs(freeSlotSignNumber);
						freeSlotSignNumber = 0;
					}
				}
				if(multipark > 1){
					freeSignParks_occ = (int)Math.round(freeSlotSignNumber * freeOccSignedRate / 100);
				} else {
					freeSignParks_occ = (int)Math.round(freeSlotSignNumber * occRate / 100);
				}
				vs.setFreeParkSlotSignOccupied(freeSignParks_occ);
			}
			if(vs.getPaidSlotNumber() != null && vs.getPaidSlotNumber() > 0 && paidOccRate > -1){
				int paidSlotNumber = vs.getPaidSlotNumber();
				if(unusuabledParks > 0){
					paidSlotNumber = paidSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(paidSlotNumber < 0){
						unusuabledParks = Math.abs(paidSlotNumber);
						paidSlotNumber = 0;
					}
				}
				if(multipark > 1){
					paidSlotParks_occ = (int)Math.round(paidSlotNumber * paidOccRate / 100);
				} else {
					paidSlotParks_occ = (int)Math.round(paidSlotNumber * occRate / 100);
				}
				vs.setPaidSlotOccupied(paidSlotParks_occ);
			}
			if(vs.getTimedParkSlotNumber() != null && vs.getTimedParkSlotNumber() > 0 && timedOccRate > -1){
				int timedParkSlotNumber = vs.getTimedParkSlotNumber();
				if(unusuabledParks > 0){
					timedParkSlotNumber = timedParkSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(timedParkSlotNumber < 0){
						unusuabledParks = Math.abs(timedParkSlotNumber);
						timedParkSlotNumber = 0;
					}
				}
				if(multipark > 1){
					timedParks_occ = (int)Math.round(timedParkSlotNumber * timedOccRate / 100);
				} else {
					timedParks_occ = (int)Math.round(timedParkSlotNumber * occRate / 100);
				}
				vs.setTimedParkSlotOccupied(timedParks_occ);
			}
			if(vs.getHandicappedSlotNumber() != null && vs.getHandicappedSlotNumber() > 0 && handicappedOccRate > -1){
				int handicappedSlotNumber = vs.getHandicappedSlotNumber();
				if(unusuabledParks > 0){
					handicappedSlotNumber = handicappedSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(handicappedSlotNumber < 0){
						unusuabledParks = Math.abs(handicappedSlotNumber);
						handicappedSlotNumber = 0;
					}
				}
				if(multipark > 1){
					handicappedParks_occ = (int)Math.round(handicappedSlotNumber * handicappedOccRate / 100);
				} else {
					handicappedParks_occ = (int)Math.round(handicappedSlotNumber * occRate / 100);
				}
				vs.setHandicappedSlotOccupied(handicappedParks_occ);
			}
			if(vs.getReservedSlotNumber() != null && vs.getReservedSlotNumber() > 0 && reservedOccRate > -1){
				int reservedSlotNumber = vs.getReservedSlotNumber();
				if(unusuabledParks > 0){
					reservedSlotNumber = reservedSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(reservedSlotNumber < 0){
						unusuabledParks = Math.abs(reservedSlotNumber);
						reservedSlotNumber = 0;
					}
				}
				if(multipark > 1){
					reservedParks_occ = (int)Math.round(reservedSlotNumber * reservedOccRate / 100);
				} else {
					reservedParks_occ = (int)Math.round(reservedSlotNumber * occRate / 100);
				}
				vs.setReservedSlotOccupied(reservedParks_occ);
			}
			if(vs.getRechargeableSlotNumber() != null && vs.getRechargeableSlotNumber() > 0 && rechargeableOccRate > -1){
				int rechargeableSlotNumber = vs.getRechargeableSlotNumber();
				if(unusuabledParks > 0){
					rechargeableSlotNumber = rechargeableSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(rechargeableSlotNumber < 0){
						unusuabledParks = Math.abs(rechargeableSlotNumber);
						rechargeableSlotNumber = 0;
					}
				}
				if(multipark > 1){
					rechargeableParks_occ = (int)Math.round(rechargeableSlotNumber * rechargeableOccRate / 100);
				} else {
					rechargeableParks_occ = (int)Math.round(rechargeableSlotNumber * occRate / 100);
				}
				vs.setRechargeableSlotOccupied(rechargeableParks_occ);
			}
			if(vs.getLoadingUnloadingSlotNumber() != null && vs.getLoadingUnloadingSlotNumber() > 0 && loadingUnloadingOccRate > -1){
				int loadingUnloadingSlotNumber = vs.getLoadingUnloadingSlotNumber();
				if(unusuabledParks > 0){
					loadingUnloadingSlotNumber = loadingUnloadingSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(loadingUnloadingSlotNumber < 0){
						unusuabledParks = Math.abs(loadingUnloadingSlotNumber);
						loadingUnloadingSlotNumber = 0;
					}
				}
				if(multipark > 1){
					loadingUnloadingParks_occ = (int)Math.round(loadingUnloadingSlotNumber * loadingUnloadingOccRate / 100);
				} else {
					loadingUnloadingParks_occ = (int)Math.round(loadingUnloadingSlotNumber * occRate / 100);
				}
				vs.setLoadingUnloadingSlotOccupied(loadingUnloadingParks_occ);
			}
			if(vs.getPinkSlotNumber() != null && vs.getPinkSlotNumber() > 0 && pinkOccRate > -1){
				int pinkSlotNumber = vs.getPinkSlotNumber();
				if(unusuabledParks > 0){
					pinkSlotNumber = pinkSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(pinkSlotNumber < 0){
						unusuabledParks = Math.abs(pinkSlotNumber);
						pinkSlotNumber = 0;
					}
				}
				if(multipark > 1){
					pinkParks_occ = (int)Math.round(pinkSlotNumber * pinkOccRate / 100);
				} else {
					pinkParks_occ = (int)Math.round(pinkSlotNumber * occRate / 100);
				}
				vs.setPinkSlotOccupied(pinkParks_occ);
			}
			if(vs.getCarSharingSlotNumber() != null && vs.getCarSharingSlotNumber() > 0 && carSharingOccRate > -1){
				int carSharingSlotNumber = vs.getCarSharingSlotNumber();
				if(unusuabledParks > 0){
					carSharingSlotNumber = carSharingSlotNumber - unusuabledParks;
					unusuabledParks = 0;
					if(carSharingSlotNumber < 0){
						unusuabledParks = Math.abs(carSharingSlotNumber);
						carSharingSlotNumber = 0;
					}
				}
				if(multipark > 1){
					carSharingParks_occ = (int)Math.round(carSharingSlotNumber * carSharingOccRate / 100);
				} else {
					carSharingParks_occ = (int)Math.round(carSharingSlotNumber * occRate / 100);
				}
				vs.setCarSharingSlotOccupied(carSharingParks_occ);
			}
		}
		return vs;
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
	public String[][] getHistorycalDataFromZone(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType, int lang, String vehicleType){
		String[][] occMatrix = null;
		String[][] tmpMatrix = null;
		String[][] result = null;
		int[][] usedSlotMatrix = null;
		//int[][] unavailableSlotMatrix = null;
		int[][] sumSlotMatrix = null;
		int totalSlot = 0;
		
		ZoneBean z = findZoneById(objectId, appId);
		List<StreetBean> streets = getAllStreets(z, null);
		if(streets != null && streets.size() > 0){
			if(vehicleType != null && vehicleType.compareTo("") != 0){
				type = type + "@" + vehicleType;
				occMatrix = getHistorycalDataFromObject(streets.get(0).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
				sumSlotMatrix = calculateUsedSlot(streets.get(0), occMatrix);
				totalSlot = streets.get(0).getSlotNumber();
				for(int i = 1; i < streets.size(); i++){
					tmpMatrix = getHistorycalDataFromObject(streets.get(i).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
					usedSlotMatrix = calculateUsedSlot(streets.get(i), tmpMatrix);
					sumSlotMatrix = mergeSlotMatrix(usedSlotMatrix, sumSlotMatrix);
					totalSlot += streets.get(i).getSlotNumber();
				}
			} else {
				List<VehicleType> allVehicles = vehicleTypeDataSetup.findVehicleTypeByAppId(appId);
				for(int j = 0; j < allVehicles.size(); j++){
					type = type + "@" + allVehicles.get(j).getName();
					occMatrix = getHistorycalDataFromObject(streets.get(0).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
					sumSlotMatrix = calculateUsedSlot(streets.get(0), occMatrix);
					totalSlot = streets.get(0).getSlotNumber();
					for(int i = 1; i < streets.size(); i++){
						tmpMatrix = getHistorycalDataFromObject(streets.get(i).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
						usedSlotMatrix = calculateUsedSlot(streets.get(i), tmpMatrix);
						sumSlotMatrix = mergeSlotMatrix(usedSlotMatrix, sumSlotMatrix);
						totalSlot += streets.get(i).getSlotNumber();
					}
				}
			}
		}
		//return cleanAverageMatrix(occMatrix, streets.size());
		result = cleanSumSlotMatrix(sumSlotMatrix, totalSlot, occMatrix);
		if(result == null){
			result = new String[0][0];;
		}
		return result;
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
	public String[][] getHistorycalDataFromArea(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType, int lang, String vehicleType){
		String[][] occMatrix = null;
		String[][] tmpMatrix = null;
		int[][] usedSlotMatrix = null;
		//int[][] unavailableSlotMatrix = null;
		int[][] sumSlotMatrix = null;
		int totalSlot = 0;
		
		RateAreaBean a = getAreaById(objectId, appId);
		List<StreetBean> streets = getAllStreets(a, null);
		if(streets != null && streets.size() > 0){
			if(vehicleType != null && vehicleType.compareTo("") != 0){
				type = type + "@" + vehicleType;
				occMatrix = getHistorycalDataFromObject(streets.get(0).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
				sumSlotMatrix = calculateUsedSlot(streets.get(0), occMatrix);
				totalSlot = streets.get(0).getSlotNumber();
				for(int i = 1; i < streets.size(); i++){
					tmpMatrix = getHistorycalDataFromObject(streets.get(i).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
					//occMatrix = mergeMatrix(occMatrix, tmpMatrix);
					usedSlotMatrix = calculateUsedSlot(streets.get(i), tmpMatrix);
					sumSlotMatrix = mergeSlotMatrix(usedSlotMatrix, sumSlotMatrix);
					totalSlot += streets.get(i).getSlotNumber();
				}
			} else {
				List<VehicleType> allVehicles = vehicleTypeDataSetup.findVehicleTypeByAppId(appId);
				for(int j = 0; j < allVehicles.size(); j++){
					type = type + "@" + allVehicles.get(j).getName();
					occMatrix = getHistorycalDataFromObject(streets.get(0).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
					sumSlotMatrix = calculateUsedSlot(streets.get(0), occMatrix);
					totalSlot = streets.get(0).getSlotNumber();
					for(int i = 1; i < streets.size(); i++){
						tmpMatrix = getHistorycalDataFromObject(streets.get(i).getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
						//occMatrix = mergeMatrix(occMatrix, tmpMatrix);
						usedSlotMatrix = calculateUsedSlot(streets.get(i), tmpMatrix);
						sumSlotMatrix = mergeSlotMatrix(usedSlotMatrix, sumSlotMatrix);
						totalSlot += streets.get(i).getSlotNumber();
					}
				}
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
	
	private String cleanStringForCasting(String input){
		if(input == null){
			input = "-1";
		}
		String corr = input;
		String[] tmp;
		if(input.contains(".")){
			tmp = input.split("[.]");
			corr = tmp[0];
		}
		if(input.contains(",")){
			tmp = input.split(",");
			corr = tmp[0];
		}
		return corr;
	}
	
	// Method mergeStringSlotMatrix: used to merge the value of two matrix (with same size) in a single matrix (string mode)
	public String[][] mergeStringSlotMatrix(String[][] m1, String[][] m2){
		String[][] tmp = m1;
		for(int i = 1; i < m1.length; i++){
			for(int j = 1; j < m1[i].length; j++){
				int slot1 = Integer.parseInt(cleanStringForCasting(m1[i][j]));
				int slot2 = Integer.parseInt(cleanStringForCasting(m2[i][j]));
				int merge = 0;
				if((slot1 != -1) && (slot2 != -1)){
					 merge = (slot1 + slot2) / 2;
				} else if((slot1 != -1) && (slot2 == -1)){
					merge = slot1;
				} else if((slot1 == -1) && (slot2 != -1)){
					merge = slot2;
				} else {
					merge = -1;
				}
				tmp[i][j] = merge + "";
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
		String[][] tmp = null;
		if(m1 != null){
			tmp = new String[m1.length][m1[0].length];
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
		}
		return tmp;
	}
	
	public String[][] getHistorycalProfitDataFromStreet(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType, int lang){
		String[][] profMatrix = null;
		
		StreetBean s = findStreet(objectId, appId);
		List<String> pmCodes = s.getParkingMeters();
		if(pmCodes != null && pmCodes.size() > 0){
			ParkingMeterBean pmb = findParkingMeter(pmCodes.get(0), appId);
			//ParkingMeterBean pmb = findParkingMeterByCode(Integer.parseInt(pmCodes.get(0)), appId);
			profMatrix = getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
			for(int i = 1; i < pmCodes.size(); i++){
				pmb = findParkingMeter(pmCodes.get(i), appId);
				//pmb = findParkingMeterByCode(Integer.parseInt(pmCodes.get(i)), appId);
				profMatrix = mergeMatrix(profMatrix, getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang));
			}
		}
		return profMatrix;	//cleanAverageMatrix(profMatrix, pmCodes.size());
	}
	
	public String[][] getHistorycalProfitDataFromZone(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType, int lang){
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
					if(s.getParkingMeters() != null){
						pmCodes.addAll(s.getParkingMeters());
					}
				}
			}
		}
		// iterate the parkingmeter list and merge the profit matrix
		if(pmCodes != null && pmCodes.size() > 0){
			//ParkingMeterBean pmb = findParkingMeterByCode(Integer.parseInt(pmCodes.get(0)), appId);
			ParkingMeterBean pmb = findParkingMeter(pmCodes.get(0), appId);
			profMatrix = getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
			for(int i = 1; i < pmCodes.size(); i++){
				//pmb = findParkingMeterByCode(Integer.parseInt(pmCodes.get(i)), appId);
				pmb = findParkingMeter(pmCodes.get(i), appId);
				profMatrix = mergeMatrix(profMatrix, getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang));
			}
		}
		return profMatrix;	//cleanAverageMatrix(profMatrix, pmCodes.size());
	}
	
	public String[][] getHistorycalProfitDataFromArea(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType, int lang){
		String[][] profMatrix = null;
		RateAreaBean ar = getAreaById(objectId, appId);
		//RateArea a = mongodb.findById(objectId, RateArea.class);
		List<ParkingMeterBean> pms = getAllParkingMeters(ar, appId);	//a.getParkingMeters();
		if(pms != null && pms.size() > 0){
			ParkingMeterBean pmb = pms.get(0);	//findParkingMeter(pms.get(0).getId(), appId);
			profMatrix = getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang);
			for(int i = 1; i < pms.size(); i++){
				pmb = pms.get(i);	//findParkingMeter(pms.get(i).getId(), appId);
				profMatrix = mergeMatrix(profMatrix, getHistorycalDataFromObject(pmb.getId(), appId, type, verticalVal, orizontalVal, params, years, months, dayType, days, hours, valueType, objType, lang));
			}
		}
		return profMatrix;	//cleanAverageMatrix(profMatrix, pmCodes.size());
	}
	
	public String[][] getHistorycalDataFromObject(String objectId, String appId, String type, int verticalVal, int orizontalVal, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, int objType, int lang){
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
			if(lang == 0){
				occMatrix[0][0] = "Anno/Mese";
			} else {
				occMatrix[0][0] = "Year/Month";
			}
			for(int x = 0; x < MONTHS_LABEL.length; x++){
				if(lang == 0){
					occMatrix[0][x + 1] = MONTHS_LABEL[x];
				} else {
					occMatrix[0][x + 1] = MONTHS_LABEL_ENG[x];
				}
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
			if(lang == 0){
				occMatrix[0][0] = "Anno/Settimana";
			} else {
				occMatrix[0][0] = "Year/Day Of Week";
			}
			for(int x = 0; x < DOWS_LABEL.length; x++){
				if(lang == 0){
					occMatrix[0][x + 1] = DOWS_LABEL[x];
				} else {
					occMatrix[0][x + 1] = DOWS_LABEL_ENG[x];
				}
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
			if(lang == 0){
				occMatrix[0][0] = "Anno/Ora";
			} else {
				occMatrix[0][0] = "Year/Hour";
			}
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
			if(lang == 0){
				occMatrix[0][0] = "Mese/Anno";
			} else {
				occMatrix[0][0] = "Month/Year";
			}
			for(int x = 0; x < 5; x++){
				occMatrix[0][x + 1] = (year - x) + "";
			}
			for(int i = 1; i < occMatrix.length; i++){
				if(lang == 0){
					occMatrix[i][0] = MONTHS_LABEL[i - 1];
				} else {
					occMatrix[i][0] = MONTHS_LABEL_ENG[i - 1];
				}
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
			if(lang == 0){
				occMatrix[0][0] = "Mese/Settimana";
			} else {
				occMatrix[0][0] = "Month/Day Of Week";
			}
			for(int x = 0; x < DOWS_LABEL.length; x++){
				if(lang == 0){
					occMatrix[0][x + 1] = DOWS_LABEL[x];
				} else {
					occMatrix[0][x + 1] = DOWS_LABEL_ENG[x];
				}
			}
			for(int i = 1; i < occMatrix.length; i++){
				if(lang == 0){
					occMatrix[i][0] = MONTHS_LABEL[i - 1];
				} else {
					occMatrix[i][0] = MONTHS_LABEL_ENG[i - 1];
				}
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
			if(lang == 0){
				occMatrix[0][0] = "Mese/Ora";
			} else {
				occMatrix[0][0] = "Month/Hour";
			}
			for(int x = 0; x < HOURS_LABEL.length; x++){
				occMatrix[0][x + 1] = HOURS_LABEL[x];
			}
			for(int i = 1; i < occMatrix.length; i++){
				if(lang == 0){
					occMatrix[i][0] = MONTHS_LABEL[i - 1];
				} else {
					occMatrix[i][0] = MONTHS_LABEL_ENG[i - 1];
				}
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
			// case dows-years
			if(lang == 0){
				occMatrix[0][0] = "Settimana/Anno";
			} else {
				occMatrix[0][0] = "Day Of Week/Year";
			}
			for(int x = 0; x < 5; x++){
				occMatrix[0][x + 1] = (year - x) + "";
			}
			int i = 0;
			for(i = 1; i < occMatrix.length-1; i++){
				if(lang == 0){
					occMatrix[i][0] = DOWS_LABEL[i - 1];
				} else {
					occMatrix[i][0] = DOWS_LABEL_ENG[i - 1];
				}
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
			if(lang == 0){
				occMatrix[i][0] = DOWS_LABEL[i - 1];
			} else {
				occMatrix[i][0] = DOWS_LABEL_ENG[i - 1];
			}
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
			// case dows-month
			if(lang == 0){
				occMatrix[0][0] = "Settimana/Mese";
			} else {
				occMatrix[0][0] = "Day Of Week/Month";
			}
			for(int x = 0; x < MONTHS_LABEL.length; x++){
				if(lang == 0){
					occMatrix[0][x + 1] = MONTHS_LABEL[x];
				} else {
					occMatrix[0][x + 1] = MONTHS_LABEL_ENG[x];
				}
			}
			int i = 0;
			for(i = 1; i < occMatrix.length-1; i++){
				if(lang == 0){
					occMatrix[i][0] = DOWS_LABEL[i - 1];
				} else {
					occMatrix[i][0] = DOWS_LABEL_ENG[i - 1];
				}
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
			if(lang == 0){
				occMatrix[i][0] = DOWS_LABEL[i - 1];
			} else {
				occMatrix[i][0] = DOWS_LABEL_ENG[i - 1];
			}
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
			// case dow-hours
			if(lang == 0){
				occMatrix[0][0] = "Settimana/Ora";
			} else {
				occMatrix[0][0] = "Day Of Week/Hour";
			}
			for(int x = 0; x < HOURS_LABEL.length; x++){
				occMatrix[0][x + 1] = HOURS_LABEL[x];
			}
			int i = 0;
			for(i = 1; i < occMatrix.length-1; i++){
				if(lang == 0){
					occMatrix[i][0] = DOWS_LABEL[i - 1];
				} else {
					occMatrix[i][0] = DOWS_LABEL_ENG[i - 1];
				}
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
			if(lang == 0){
				occMatrix[i][0] = DOWS_LABEL[i - 1];
			} else {
				occMatrix[i][0] = DOWS_LABEL_ENG[i - 1];
			}
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
			// case hour-years
			if(lang == 0){
				occMatrix[0][0] = "Ora/Anno";
			} else {
				occMatrix[0][0] = "Hour/Year";
			}
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
			// case hour-month
			if(lang == 0){
				occMatrix[0][0] = "Ora/Mese";
			} else {
				occMatrix[0][0] = "Hour/Month";
			}
			for(int x = 0; x < MONTHS_LABEL.length; x++){
				if(lang == 0){
					occMatrix[0][x + 1] = MONTHS_LABEL[x];
				} else {
					occMatrix[0][x + 1] = MONTHS_LABEL_ENG[x];
				}
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
			// case hour-dows
			if(lang == 0){
				occMatrix[0][0] = "Ora/Settimana";
			} else {
				occMatrix[0][0] = "Hour/Day Of Week";
			}
			for(int x = 0; x < DOWS_LABEL.length; x++){
				if(lang == 0){
					occMatrix[0][x + 1] = DOWS_LABEL[x];
				} else {
					occMatrix[0][x + 1] = DOWS_LABEL_ENG[x];
				}
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
	
	public List<StreetBean> getOccupationRateFromAllStreets(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String vehicleType, String agencyId){
		// Perf4J part
		BasicConfigurator.configure();
		StopWatch watch = new Log4JStopWatch(); 
		logger.debug("Occupation Street Start Time : "+watch.getStartTime());
		List<StreetBean> streets = getAllStreetsInAppId(null, appId);
		Map<StatKey, StatValue> statsVals = null;
		if(valueType == 1){
			// last
			statsVals =  getOccupationRateFromObjects(appId, type, params, years, months, dayType, days, hours);
		} else {
			// average
			statsVals =  getAverageOccupationRateFromObjects(appId, type, params, years, months, dayType, days, hours);
		}
		logger.debug("Streets list size : " + streets.size());
		logger.debug("Stats map size : " + statsVals.size());
		List<StreetBean> corrStreets = new ArrayList<StreetBean>();
		for(StreetBean s : streets){
			StreetBean corrStreet = mergeOccupationRateForStreet(s.getId(), s, appId, type, valueType, vehicleType, statsVals, agencyId);
			//StreetBean corrStreet = getOccupationRateFromStreet(s.getId(), appId, type, params, years, months, dayType, days, hours, valueType, vehicleType);
			corrStreets.add(corrStreet);
		}
		logger.debug("Occupation Street Elapsed Time : "+ watch.getElapsedTime());  
		logger.debug("Occupation Street Stop Time : "+watch.stop());
		return corrStreets;
	}
	
	public List<StreetBeanCore> getOccupationRateFromAllStreetsWithGranularity(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String vehicleType, String agencyId, String granularity){
		// Perf4J part
		BasicConfigurator.configure();
		StopWatch watch = new Log4JStopWatch(); 
		logger.debug("Occupation Street Start Time : "+watch.getStartTime());
		List<StreetBean> streets = getAllStreetsInAppId(null, appId);
		Map<String, Object> statsVals = null;
		if(vehicleType == null || vehicleType.compareTo("") == 0){
			vehicleType = "Car";
		}
		// average
		statsVals =  getAverageOccupationRateFromObjectsByGranularity(appId, type, params, years, months, dayType, days, hours, vehicleType, granularity);
		logger.debug("Streets list size : " + streets.size());
		logger.debug("Stats map size : " + statsVals.size());
		List<StreetBeanCore> corrStreets = new ArrayList<StreetBeanCore>();
		for(StreetBean s : streets){
			StreetBeanCore corrStreet = mergeOccupationRateForStreetCore(s.getId(), s, appId, type, valueType, vehicleType, null, statsVals, agencyId);
			//StreetBean corrStreet = getOccupationRateFromStreet(s.getId(), appId, type, params, years, months, dayType, days, hours, valueType, vehicleType);
			corrStreets.add(corrStreet);
		}
		logger.debug("Occupation Street Elapsed Time : "+ watch.getElapsedTime());  
		logger.debug("Occupation Street Stop Time : "+watch.stop());
		return corrStreets;
	}
	
	public List<ParkingStructureBean> getOccupationRateFromAllParkings(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String vehicleType, String agencyId){
		List<ParkingStructureBean> parkings = getAllParkingStructureInAppId(null, appId);
		Map<StatKey, StatValue> statsVals = null;
		if(valueType == 1){
			// last
			statsVals =  getOccupationRateFromObjects(appId, type, params, years, months, dayType, days, hours);
		} else {
			// average
			statsVals =  getAverageOccupationRateFromObjects(appId, type, params, years, months, dayType, days, hours);
		}
		logger.debug("Parking Structure list size : " + parkings.size());
		logger.debug("Stats map size : " + statsVals.size());
		
		List<ParkingStructureBean> corrParkings = new ArrayList<ParkingStructureBean>();
		for(ParkingStructureBean p : parkings){
			//ParkingStructureBean corrPark = getOccupationRateFromParking(p.getId(), appId, type, params, years, months, dayType, days, hours, valueType, vehicleType);
			ParkingStructureBean corrPark = mergeOccupationRateForParking(p.getId(), p, appId, type, valueType, vehicleType, statsVals, agencyId);
			corrParkings.add(corrPark);
		}
		return corrParkings;
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
	public List<ParkingMeterBean> getProfitFromAllParkingMeters(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String agencyId){
		List<ParkingMeterBean> parkingmeters = getAllParkingMeters(appId);
		Map<StatKey, StatValue> statsVals = getProfitFromObjects(appId, type, params, years, months, dayType, days, hours);
		String pId = "";
		for(ParkingMeterBean pm : parkingmeters){
			if(pm.getAgencyId().contains(agencyId) || agencyId.compareTo(ALL) == 0){
				double profitVal = 0;
				int ticketsNum = 0;
				pId = getCorrectId(pm.getId(), "parkingmeter", appId);
				//TODO: check if the sum of data is considered
				profitVal = retrieveCorrectProfitFromStatValue(pId, appId, type + profit, valueType, statsVals);
				ticketsNum = (int)retrieveCorrectProfitFromStatValue(pId, appId, type + tickets, valueType, statsVals);
				/*if(valueType == 1){
					profitVal = getLastProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
					ticketsNum = (int)getLastProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
				} else {
					profitVal = getSumProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
					ticketsNum = (int)getSumProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
				}*/
				pm.setProfit(profitVal);
				pm.setTickets(ticketsNum);
			} else {
				pm.setProfit(-1.0);
				pm.setTickets(-1);
			}
		}
		return parkingmeters;
	}
	
	public ParkingMeterBean getProfitFromParkingMeter(String parkMeterId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String agencyId){
		ParkingMeterBean pm = new ParkingMeterBean();
		double profitVal = 0;
		int ticketsNum = 0;
		String pId = getCorrectId(parkMeterId, "parkingmeter", appId);
		if(pm.getAgencyId().contains(agencyId) || agencyId.compareTo(ALL) == 0){
			if(valueType == 1){
				profitVal = getLastProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
				ticketsNum = (int)getLastProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
			} else {
				profitVal = getSumProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
				ticketsNum = (int)getSumProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
			}
			pm.setProfit(profitVal);
			pm.setTickets(ticketsNum);
		} else {
			pm.setProfit(-1.0);
			pm.setTickets(-1);
		}
		return pm;
	}
	
	public List<ParkingStructureBean> getProfitFromAllParkStructs(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String agencyId){
		List<ParkingStructureBean> parkstructs = getAllParkingStructureInAppId(null, appId);
		Map<StatKey, StatValue> statsVals = getProfitFromObjects(appId, type, params, years, months, dayType, days, hours);
		String pId = "";
		for(ParkingStructureBean p : parkstructs){
			double profitVal = 0;
			int ticketsNum = 0;
			pId = getCorrectId(p.getId(), "parkstruct", appId);
			if(p.getAgencyId().contains(agencyId) || agencyId.compareTo(ALL) == 0){
				profitVal = retrieveCorrectProfitFromStatValue(pId, appId, type + profit, valueType, statsVals);
				ticketsNum = (int)retrieveCorrectProfitFromStatValue(pId, appId, type + tickets, valueType, statsVals);
				/*if(valueType == 1){
					profitVal = getLastProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
					ticketsNum = (int)getLastProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
				} else {
					profitVal = getSumProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
					ticketsNum = (int)getSumProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
				}*/
				p.setProfit(profitVal);
				p.setTickets(ticketsNum);
			} else {
				p.setProfit(-1.0);
				p.setTickets(-1);
			}
		}
		return parkstructs;
	}
	
	/**
	 * getProfitChangeFromAllParkStructs: used to retrieve only the profit data of the parking structure list.
	 * Is a compact version of the getProfitFromAllParkStructs method
	 * @param appId
	 * @param type
	 * @param params
	 * @param years
	 * @param months
	 * @param dayType
	 * @param days
	 * @param hours
	 * @param valueType
	 * @return
	 */
	public List<CompactParkingStructureBean> getProfitChangeFromAllParkStructs(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String agencyId){
		List<ParkingStructureBean> parkstructs = getAllParkingStructureInAppId(null, appId);
		List<CompactParkingStructureBean> correctedParkings = new ArrayList<CompactParkingStructureBean>();
		String pId = "";
		for(ParkingStructureBean p : parkstructs){
			CompactParkingStructureBean cp = new CompactParkingStructureBean();
			double profitVal = 0;
			int ticketsNum = 0;
			pId = getCorrectId(p.getId(), "parkstruct", appId);
			if(p.getAgencyId().contains(agencyId) || agencyId.compareTo(ALL) == 0){
				if(valueType == 1){
					profitVal = getLastProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
					ticketsNum = (int)getLastProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
				} else {
					profitVal = getSumProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
					ticketsNum = (int)getSumProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
				}
				cp.setProfit(profitVal);
				cp.setTickets(ticketsNum);
			} else {
				cp.setProfit(-1.0);
				cp.setTickets(-1);
			}
			cp.setId(p.getId());
			correctedParkings.add(cp);
		}
		return correctedParkings;
	}
	
	public ParkingStructureBean getProfitFromParkStruct(String id, String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String agencyId){
		ParkingStructureBean p = new ParkingStructureBean();
		String pId = "";
		double profitVal = 0;
		int ticketsNum = 0;
		pId = getCorrectId(id, "parkstruct", appId);
		if(p.getAgencyId().contains(agencyId) || agencyId.compareTo(ALL) == 0){
			if(valueType == 1){
				profitVal = getLastProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
				ticketsNum = (int)getLastProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
			} else {
				profitVal = getSumProfitFromObject(pId, appId, type + profit, params, years, months, dayType, days, hours);
				ticketsNum = (int)getSumProfitFromObject(pId, appId, type + tickets, params, years, months, dayType, days, hours);
			}
			p.setProfit(profitVal);
			p.setTickets(ticketsNum);
		} else {
			p.setProfit(-1.0);
			p.setTickets(-1);
		}
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
	public List<CompactStreetBean> getOccupationChangesFromAllStreets(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String vehicleType, String agencyId){
		List<StreetBean> streets = getAllStreetsInAppId(null, appId);
		Map<StatKey, StatValue> statsVals = null;
		if(valueType == 1){
			// last
			statsVals =  getOccupationRateFromObjects(appId, type, params, years, months, dayType, days, hours);
		} else {
			// average
			statsVals =  getAverageOccupationRateFromObjects(appId, type, params, years, months, dayType, days, hours);
		}
		List<CompactStreetBean> corrStreets = new ArrayList<CompactStreetBean>();
		for(StreetBean s : streets){
			CompactStreetBean cs = new CompactStreetBean();
			StreetBean corrStreet = mergeOccupationRateForStreet(s.getId(), s, appId, type, valueType, vehicleType, statsVals, agencyId);
			//StreetBean corrStreet = getOccupationRateFromStreet(s.getId(), appId, type, params, years, months, dayType, days, hours, valueType, vehicleType);
			cs.setId(s.getId());
			cs.setSlotNumber(s.getSlotNumber());
			cs.setSlotsConfiguration(corrStreet.getSlotsConfiguration());
			cs.setOccupancyRate(corrStreet.getOccupancyRate());
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
	public List<CompactParkingStructureBean> getOccupationChangesFromAllParkings(String appId, String type, Map<String, Object> params, int[] years, byte[] months, String dayType, byte[] days, byte[] hours, int valueType, String vehicleType, String agencyId){
		List<ParkingStructureBean> parkings = getAllParkingStructureInAppId(null, appId);
		Map<StatKey, StatValue> statsVals = null;
		if(valueType == 1){
			// last
			statsVals =  getOccupationRateFromObjects(appId, type, params, years, months, dayType, days, hours);
		} else {
			// average
			statsVals =  getAverageOccupationRateFromObjects(appId, type, params, years, months, dayType, days, hours);
		}
		List<CompactParkingStructureBean> correctedParkings = new ArrayList<CompactParkingStructureBean>();
		for(ParkingStructureBean p : parkings){
			//ParkingStructureBean corrPark = getOccupationRateFromParking(p.getId(), appId, type, params, years, months, dayType, days, hours, valueType, vehicleType);
			ParkingStructureBean corrPark = mergeOccupationRateForParking(p.getId(), p, appId, type, valueType, vehicleType, statsVals, agencyId);
			CompactParkingStructureBean cp = new CompactParkingStructureBean();
			cp.setId(p.getId());
			cp.setSlotNumber(p.getSlotNumber());
			cp.setSlotsConfiguration(corrPark.getSlotsConfiguration());
			cp.setOccupancyRate(corrPark.getOccupancyRate());
			
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
	public Long countTPAll(String agency, String userAgency, boolean deleted) {
		return mongodb.count(Query.query(new Criteria("agency").is(agency).and("userAgencyId").is(userAgency).and("deleted").is(false)), "dataLogBean");
	}
	public Long countTPTyped(String agency, String userAgency, boolean deleted, String type) {
		return mongodb.count(Query.query(new Criteria("agency").is(agency).and("userAgencyId").is(userAgency).and("deleted").is(false).and("type").is(type)), "dataLogBean");
	}
	public List<DataLogBeanTP> findTPAll(String agency, boolean deleted, int skip, int limit) {
		Query query = Query.query(new Criteria("agency").is(agency).and("deleted").is(false));
		query.limit(limit);
		query.skip(skip);
		query.sort().on("time", Order.DESCENDING);
		return mongodb.find(query, DataLogBeanTP.class, "dataLogBean");	
	}
	public List<DataLogBeanTP> findTPAllByUserAgency(String agency, String userAgency, boolean deleted, int skip, int limit) {
		Query query = Query.query(new Criteria("agency").is(agency).and("userAgencyId").is(userAgency).and("deleted").is(false));
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
	public List<DataLogBeanTP> findTPTypedByUserAgency(String agency, String userAgency, boolean deleted, String type, int skip, int limit) {
		Query query = Query.query(new Criteria("agency").is(agency).and("userAgencyId").is(userAgency).and("deleted").is(false).and("type").is(type));
		query.limit(limit);
		query.skip(skip);
		query.sort().on("time", Order.DESCENDING);
		return mongodb.find(query, DataLogBeanTP.class, "dataLogBean");
	}

}
