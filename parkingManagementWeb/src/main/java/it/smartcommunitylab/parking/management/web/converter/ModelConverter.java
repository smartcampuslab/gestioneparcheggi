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
package it.smartcommunitylab.parking.management.web.converter;

import it.smartcommunitylab.parking.management.web.bean.LineBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.VehicleSlotBean;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure.PaymentMode;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.slots.VehicleSlot;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;

public class ModelConverter {

	private static final Logger logger = Logger.getLogger(ModelConverter.class);
	private static ObjectMapper mapper;

	static {
		mapper = new ObjectMapper();
		mapper.configure(
				org.codehaus.jackson.map.DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES,
				false);
	}

	public static <T> T convert(Object o, Class<T> javaClass) {
		return mapper.convertValue(o, javaClass);
	}

	public static String fromPaymentMode(PaymentMode mode) {
		return mode.toString();
	}

	public static List<String> fromPaymentMode(List<PaymentMode> modes) {
		List<String> result = new ArrayList<String>();
		for (PaymentMode mode : modes) {
			result.add(fromPaymentMode(mode));
		}
		return result;
	}

	public static PaymentMode toPaymentMode(String mode) {
		try {
			return PaymentMode.valueOf(mode);
		} catch (IllegalArgumentException e) {
			logger.error(String.format("%s not present in PaymentMode enum",
					mode));
			return null;
		}
	}

	public static List<PaymentMode> toPaymentMode(List<String> modes) {
		List<PaymentMode> result = new ArrayList<PaymentMode>();
		for (String mode : modes) {
			PaymentMode m = toPaymentMode(mode);
			if (m != null) {
				result.add(m);
			}
		}
		return result;
	}
	
	/**
	 * Method toStreetBean: used to transform a Street object in a StreetBean object
	 * @param area
	 * @param s
	 * @return
	 */
	public static StreetBean toStreetBean(RateArea area, Street s){
		StreetBean sb = new StreetBean();
		sb.setId(s.getId());
		sb.setId_app(s.getId_app());
		sb.setStreetReference(s.getStreetReference());
		sb.setSlotNumber(s.getSlotNumber());
		/*sb.setFreeParkSlotNumber(s.getFreeParkSlotNumber());
		sb.setFreeParkSlotSignNumber(s.getFreeParkSlotSignNumber());
		sb.setHandicappedSlotNumber(s.getHandicappedSlotNumber());
		sb.setReservedSlotNumber(s.getReservedSlotNumber());
		sb.setPaidSlotNumber(s.getPaidSlotNumber());
		sb.setTimedParkSlotNumber(s.getTimedParkSlotNumber());
		sb.setUnusuableSlotNumber(s.getUnusuableSlotNumber());*/
		sb.setLastChange(s.getLastChange());
		sb.setRateAreaId(area.getId());
		//sb.setRateAreaId(area.getId());
		sb.setColor(area.getColor());
		sb.setGeometry(convert(s.getGeometry(), LineBean.class));
		sb.setZones(s.getZones());
		sb.setParkingMeters(s.getParkingMeters());
		if(s.getAgencyId() != null && !s.getAgencyId().isEmpty()){
			sb.setAgencyId(s.getAgencyId());
		}
		try {
			sb.setSlotsConfiguration(toVehicleSlotBeanList(s.getSlotsConfiguration()));
		} catch (NullPointerException ex){
			sb.setSlotsConfiguration(new ArrayList<VehicleSlotBean>()); // here I associate an empty list
		}
		return sb;
	}
	
	public static List<VehicleSlotBean> toVehicleSlotBeanList(List<VehicleSlot> vehicleSlots){
		List<VehicleSlotBean> corrVehicleSlotList = new ArrayList<VehicleSlotBean>();
		for(VehicleSlot vehicleTypeSlots : vehicleSlots){
			VehicleSlotBean vehicleTypeSlotsBean = convert(vehicleTypeSlots, VehicleSlotBean.class);
			corrVehicleSlotList.add(vehicleTypeSlotsBean);
		}
		return corrVehicleSlotList;
	}
	
	public static List<VehicleSlot> toVehicleSlotList(List<VehicleSlotBean> vehicleSlotsBean, List<VehicleSlot> oldVehicleSlot){
		List<VehicleSlot> corrVehicleSlots = oldVehicleSlot;
		if(oldVehicleSlot == null || oldVehicleSlot.isEmpty()){
			corrVehicleSlots = new ArrayList<VehicleSlot>();
			for(VehicleSlotBean vehicleTypeSlotsBean : vehicleSlotsBean){
				VehicleSlot vehicleTypeSlots = convert(vehicleTypeSlotsBean, VehicleSlot.class);
				corrVehicleSlots.add(vehicleTypeSlots);
			}
		} else {
			for(int i = 0; i < vehicleSlotsBean.size(); i++){
				VehicleSlotBean vehicleSlotBean = vehicleSlotsBean.get(i);
				VehicleSlot corrVehicleSlot = ModelConverter.convert(vehicleSlotBean, VehicleSlot.class);
				boolean find = false;
				for(int j = 0; (j < corrVehicleSlots.size() && !find); j++){
					VehicleSlot vehicleSlot = corrVehicleSlots.get(j);
					if(vehicleSlot.getVehicleType().compareTo(corrVehicleSlot.getVehicleType()) == 0){
						corrVehicleSlots.set(j, corrVehicleSlot);	// update the specific vehicleTypeSlots
						find = true;
					}
				}
				if(!find){
					corrVehicleSlots.add(corrVehicleSlot);			// insert the new vehicleTypeSlots
				}
			}
		}
		return corrVehicleSlots;
	}
	
	public static List<VehicleSlot> frmoListtoVehicleSlotList(List<VehicleSlot> vehicleSlots, List<VehicleSlot> oldVehicleSlot){
		List<VehicleSlot> corrVehicleSlots = oldVehicleSlot;
		if(oldVehicleSlot == null || oldVehicleSlot.isEmpty()){
			corrVehicleSlots = vehicleSlots;
		} else {
			for(int i = 0; i < vehicleSlots.size(); i++){
				VehicleSlot newVehicleSlot = vehicleSlots.get(i);
				boolean find = false;
				for(int j = 0; (j < corrVehicleSlots.size() && !find); j++){
					VehicleSlot vehicleSlot = corrVehicleSlots.get(j);
					if(vehicleSlot.getVehicleType().compareTo(newVehicleSlot.getVehicleType()) == 0){
						corrVehicleSlots.set(j, newVehicleSlot);	// update the specific vehicleTypeSlots
						find = true;
					}
				}
				if(!find){
					corrVehicleSlots.add(newVehicleSlot);			// insert the new vehicleTypeSlots
				}
			}
		}
		return corrVehicleSlots;
	}
	
//	public static LastGeoObjectVersion toLastGeoObject(LastGeoObjectVersionBean lastGeoBean){
//		LastGeoObjectVersion lastGeo = new LastGeoObjectVersion();
//		lastGeo.setId(lastGeoBean.getId());
//		lastGeo.setType(lastGeoBean.getType());
//		//lastGeo.setVersion(lastGeoBean.getVersion());
//		lastGeo.setDeleted(lastGeoBean.isDeleted());
//		lastGeo.setLocation(lastGeoBean.getLocation());
//		lastGeo.setUpdateTime(lastGeoBean.getUpdateTime());
//		lastGeo.setAgency(lastGeoBean.getAgency());
//		lastGeo.setContent(lastGeoBean.getContent());	//lastGeo.setContent((T)lastGeoBean.getContent());		
//		return lastGeo;
//	}
//	
//	public static LastGeoObjectVersionBean toLastGeoObjectBean(LastGeoObjectVersion lastGeo){
//		LastGeoObjectVersionBean lastGeoBean = new LastGeoObjectVersionBean();
//		lastGeoBean.setId(lastGeo.getId());
//		lastGeoBean.setType(lastGeo.getType());
//		//lastGeoBean.setVersion(lastGeo.getVersion());
//		lastGeoBean.setDeleted(lastGeo.isDeleted());
//		lastGeoBean.setLocation(lastGeo.getLocation());
//		lastGeoBean.setUpdateTime(lastGeo.getUpdateTime());
//		lastGeoBean.setAgency(lastGeo.getAgency());
//		lastGeoBean.setContent(lastGeo.getContent());	//lastGeo.setContent((T)lastGeoBean.getContent());		
//		return lastGeoBean;
//	}
	
	public static boolean isValorisedSlots(Integer slots){
		boolean hasValue = false;
		if(slots != null && slots > 0){
			hasValue = true;
		}
		return hasValue;
	}
	

}