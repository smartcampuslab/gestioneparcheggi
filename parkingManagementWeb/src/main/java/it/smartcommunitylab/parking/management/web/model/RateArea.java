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
package it.smartcommunitylab.parking.management.web.model;

import it.smartcommunitylab.parking.management.web.model.geo.Polygon;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RateArea {
	private String id;
	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
	private String name;
	//private Float fee;
	//private String timeSlot;
	private List<RatePeriod> validityPeriod;
	private String smsCode;
	private String color;
	private String note;
	//private String municipality;
	private List<Polygon> geometry;
	private Integer slotNumber;	// used in supply csv creation

	private List<Street> streets;
	private Map<String,Street> n_streets = new HashMap<String, Street>();
	private List<ParkingMeter> parkingMeters;
	private List<String> zones;	// id of the related zones
	private List<String> agencyId;	// relation to agency object

	public Map<String, Street> getN_streets() {
		return n_streets;
	}

	public void setN_streets(Map<String, Street> n_streets) {
		this.n_streets = n_streets;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getId_app() {
		return id_app;
	}

	public void setId_app(String id_app) {
		this.id_app = id_app;
	}

	/*public Float getFee() {
		return fee;
	}

	public void setFee(Float fee) {
		this.fee = fee;
	}

	public String getTimeSlot() {
		return timeSlot;
	}

	public void setTimeSlot(String timeSlot) {
		this.timeSlot = timeSlot;
	}*/

	public String getSmsCode() {
		return smsCode;
	}

	public void setSmsCode(String smsCode) {
		this.smsCode = smsCode;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public List<Street> getStreets() {
		return streets;
	}

	public void setStreets(List<Street> streets) {
		this.streets = streets;
	}

	public List<ParkingMeter> getParkingMeters() {
		return parkingMeters;
	}

	public void setParkingMeters(List<ParkingMeter> parkingMeters) {
		this.parkingMeters = parkingMeters;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Polygon> getGeometry() {
		return geometry;
	}

	public void setGeometry(List<Polygon> geometry) {
		this.geometry = geometry;
	}

	public Integer getSlotNumber() {
		return slotNumber;
	}

	public void setSlotNumber(Integer slotNumber) {
		this.slotNumber = slotNumber;
	}

//	public String getMunicipality() {
//		return municipality;
//	}
//
//	public void setMunicipality(String municipality) {
//		this.municipality = municipality;
//	}

	public List<String> getZones() {
		return zones;
	}

	public void setZones(List<String> zones) {
		this.zones = zones;
	}

	public List<RatePeriod> getValidityPeriod() {
		return validityPeriod;
	}

	public void setValidityPeriod(List<RatePeriod> validityPeriod) {
		this.validityPeriod = validityPeriod;
	}

	public List<String> getAgencyId() {
		return agencyId;
	}

	public void setAgencyId(List<String> agencyId) {
		this.agencyId = agencyId;
	}

	public String feePeriodsSummary(){
		String DATA_SEPARATOR = " / ";
		String PERIOD_SEPARATOR = " // ";
		String pSumm = "";
		for(int i = 0; i < this.validityPeriod.size(); i++){
			float euro_val = validityPeriod.get(i).getRateValue() / 100F;
			if(validityPeriod.get(i).isHoliday()) {
				pSumm += String.format("%.2f", euro_val) + " euro/h"
						+ DATA_SEPARATOR + validityPeriod.get(i).getFrom() 
						+ "-" + validityPeriod.get(i).getTo()
						+ DATA_SEPARATOR + correctDaysValues(validityPeriod.get(i).getWeekDays())
						+ DATA_SEPARATOR + validityPeriod.get(i).getTimeSlot()
						+ DATA_SEPARATOR + "Festivo"
						+ PERIOD_SEPARATOR;
			} else {
				pSumm += String.format("%.2f", euro_val) + " euro/h"
						+ DATA_SEPARATOR + validityPeriod.get(i).getFrom() 
						+ "-" + validityPeriod.get(i).getTo()
						+ DATA_SEPARATOR + correctDaysValues(validityPeriod.get(i).getWeekDays())
						+ DATA_SEPARATOR + validityPeriod.get(i).getTimeSlot()
						+ PERIOD_SEPARATOR;
			}
		}
		return pSumm.substring(0, pSumm.length() - 1);
	}
	
	public String correctDaysValues(List<String> weekDays){
		String stringValues = "";
		for(String wd : weekDays){
			if(wd.compareTo("MO") == 0){
				stringValues += "LU ";
			}
			if(wd.compareTo("TU") == 0){
				stringValues += "MA ";
			}
			if(wd.compareTo("WE") == 0){
				stringValues += "ME ";
			}
			if(wd.compareTo("TH") == 0){
				stringValues += "GI ";
			}
			if(wd.compareTo("FR") == 0){
				stringValues += "VE ";
			}
			if(wd.compareTo("SA") == 0){
				stringValues += "SA ";
			}
			if(wd.compareTo("SU") == 0){
				stringValues += "DO ";
			}
		}
		stringValues.substring(0, stringValues.length()-1);
		return stringValues;
	}

}
