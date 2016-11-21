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
package it.smartcommunitylab.parking.management.web.bean;

import java.util.List;

public class ParkingStructureBean {

	private String id;
	private String id_app;
	private String name;
	private String streetReference;
	private String managementMode;
	private String manager;
	private List<RatePeriodBean> validityPeriod;
	private PointBean geometry;
	private Integer slotNumber;
	private List<VehicleSlotBean> slotsConfiguration;
	/*private Integer payingSlotNumber;
	private Integer payingSlotOccupied;
	private Integer handicappedSlotNumber;
	private Integer handicappedSlotOccupied;
	private Integer unusuableSlotNumber;*/
	private List<String> paymentMode;
	private String phoneNumber;
	private Long lastChange;
	private double occupancyRate;	// I use it only in the bean and not in the db object
	private double profit;			// in eurocent
	private int tickets;			// number of tickets
	private Boolean parkAndRide;
	private Boolean abuttingPark;	// if there is a bus service
	private List<String> zones;		// list of related zones (id)
	private List<String> agencyId;	// relation to agency object
	
	public String getId_app() {
		return id_app;
	}

	public void setId_app(String id_app) {
		this.id_app = id_app;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStreetReference() {
		return streetReference;
	}

	public void setStreetReference(String streetReference) {
		this.streetReference = streetReference;
	}

	public String getManagementMode() {
		return managementMode;
	}

	public void setManagementMode(String modality) {
		this.managementMode = modality;
	}

	public Integer getSlotNumber() {
		return slotNumber;
	}

	public void setSlotNumber(Integer slotNumber) {
		this.slotNumber = slotNumber;
	}
	
	/*public Integer getPayingSlotNumber() {
		return payingSlotNumber;
	}

	public Integer getPayingSlotOccupied() {
		return payingSlotOccupied;
	}

	public void setPayingSlotNumber(Integer payingSlotNumber) {
		this.payingSlotNumber = payingSlotNumber;
	}

	public void setPayingSlotOccupied(Integer payingSlotOccupied) {
		this.payingSlotOccupied = payingSlotOccupied;
	}

	public Integer getHandicappedSlotNumber() {
		return handicappedSlotNumber;
	}

	public Integer getHandicappedSlotOccupied() {
		return handicappedSlotOccupied;
	}

	public Integer getUnusuableSlotNumber() {
		return unusuableSlotNumber;
	}

	public void setHandicappedSlotNumber(Integer handicappedSlotNumber) {
		this.handicappedSlotNumber = handicappedSlotNumber;
	}

	public void setHandicappedSlotOccupied(Integer handicappedSlotOccupied) {
		this.handicappedSlotOccupied = handicappedSlotOccupied;
	}

	public void setUnusuableSlotNumber(Integer unusuableSlotNumber) {
		this.unusuableSlotNumber = unusuableSlotNumber;
	}*/

	public List<VehicleSlotBean> getSlotsConfiguration() {
		return slotsConfiguration;
	}

	public void setSlotsConfiguration(List<VehicleSlotBean> slotsConfiguration) {
		this.slotsConfiguration = slotsConfiguration;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public PointBean getGeometry() {
		return geometry;
	}

	public void setGeometry(PointBean geometry) {
		this.geometry = geometry;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<String> getPaymentMode() {
		return paymentMode;
	}

	public void setPaymentMode(List<String> paymentMode) {
		this.paymentMode = paymentMode;
	}

	public Long getLastChange() {
		return lastChange;
	}

	public void setLastChange(Long lastChange) {
		this.lastChange = lastChange;
	}
	
	public double getOccupancyRate() {
		return occupancyRate;
	}

	public void setOccupancyRate(double occupancyRate) {
		this.occupancyRate = occupancyRate;
	}

	public double getProfit() {
		return profit;
	}

	public int getTickets() {
		return tickets;
	}

	public void setProfit(double profit) {
		this.profit = profit;
	}

	public void setTickets(int tickets) {
		this.tickets = tickets;
	}

	

	public Boolean getParkAndRide() {
		return parkAndRide;
	}

	public void setParkAndRide(Boolean parkAndRide) {
		this.parkAndRide = parkAndRide;
	}

	public Boolean getAbuttingPark() {
		return abuttingPark;
	}

	public void setAbuttingPark(Boolean abuttingPark) {
		this.abuttingPark = abuttingPark;
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

	public List<String> getZones() {
		return zones;
	}

	public List<RatePeriodBean> getValidityPeriod() {
		return validityPeriod;
	}

	public void setValidityPeriod(List<RatePeriodBean> validityPeriod) {
		this.validityPeriod = validityPeriod;
	}

	public void setZones(List<String> zones) {
		this.zones = zones;
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
		//String DAY_MODE = "day mode";
		//String NIGHT_MODE = "night mode";
		String pSumm = "";
		for(int i = 0; i < this.validityPeriod.size(); i++){
			float euro_val = validityPeriod.get(i).getRateValue() / 100F;
			String dayNightMode = "";
			//if(validityPeriod.get(i).getDayOrNight().compareTo(DAY_MODE) == 0){
			//	dayNightMode = "Tariffa diurna: ";
			//} else if(validityPeriod.get(i).getDayOrNight().compareTo(NIGHT_MODE) == 0){
			//	dayNightMode = "Tariffa notturna: ";
			//}
			if(validityPeriod.get(i).isHoliday()) {
				pSumm += dayNightMode
						+ String.format("%.2f", euro_val) + " euro/h"
						+ DATA_SEPARATOR + correctDaysValues(validityPeriod.get(i).getWeekDays())
						+ DATA_SEPARATOR + validityPeriod.get(i).getTimeSlot()
						+ DATA_SEPARATOR + "Festivo"
						+ PERIOD_SEPARATOR;
			} else {
				pSumm += dayNightMode
						+ String.format("%.2f", euro_val) + " euro/h"
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

	public String toJSON(){
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"id_app\":\"" + getId_app() + "\",";
		json += "\"name\":\"" + getName() + "\",";
		json += "\"streetReference\":\"" + getStreetReference() + "\",";
		json += "\"geometry\":\"" + getGeometry() + "\",";
		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
		/*json += "\"payingSlotNumber\":\"" + getPayingSlotNumber() + "\",";
		json += "\"payingSlotOccupied\":\"" + getPayingSlotOccupied() + "\",";
		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
		json += "\"handicappedSlotOccupied\":\"" + getHandicappedSlotOccupied() + "\",";
		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";*/
		json += "\"lastChange\":\"" + getLastChange() + "\",";
		json += "\"occupancyRate\":\"" + getOccupancyRate() + "\",";
		json += "\"profit\":\"" + getProfit() + "\",";
		json += "\"tickets\":\"" + getTickets() + "\",";
		json += "\"parkAndRide\":\"" + getParkAndRide() + "\",";
		json += "\"manager\":\"" + getManager() + "\"";
		json += "}";
		return json;
	}

}
