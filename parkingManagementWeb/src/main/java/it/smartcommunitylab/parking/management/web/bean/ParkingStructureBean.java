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

import it.smartcommunitylab.parking.management.web.model.OpeningTime;

import java.util.List;

public class ParkingStructureBean {

	private String id;
	private String id_app;
	private String name;
	private String streetReference;
	private String managementMode;
	private String manager;
	private Integer fee_val;
	private String fee_note;
	private String timeSlot;
	private OpeningTime openingTime;
	private PointBean geometry;
	private Integer slotNumber;
	private Integer payingSlotNumber;
	private Integer payingSlotOccupied;
	private Integer handicappedSlotNumber;
	private Integer handicappedSlotOccupied;
	private Integer unusuableSlotNumber;
	private List<String> paymentMode;
	private String phoneNumber;
	private Long lastChange;
	private double occupancyRate;	// I use it only in the bean and not in the db object
	private double profit;	// in eurocent
	private int tickets;	// number of tickets
	private boolean parkAndRide;
	
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

	public Integer getPayingSlotNumber() {
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
	}

	public String getTimeSlot() {
		return timeSlot;
	}

	public void setTimeSlot(String timeSlot) {
		this.timeSlot = timeSlot;
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

	public Integer getFee_val() {
		return fee_val;
	}

	public String getFee_note() {
		return fee_note;
	}

	public OpeningTime getOpeningTime() {
		return openingTime;
	}

	public boolean isParkAndRide() {
		return parkAndRide;
	}

	public void setFee_val(Integer fee_val) {
		this.fee_val = fee_val;
	}

	public void setFee_note(String fee_note) {
		this.fee_note = fee_note;
	}

	public void setOpeningTime(OpeningTime openingTime) {
		this.openingTime = openingTime;
	}

	public void setParkAndRide(boolean parkAndRide) {
		this.parkAndRide = parkAndRide;
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

	public String toJSON(){
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"id_app\":\"" + getId_app() + "\",";
		json += "\"name\":\"" + getName() + "\",";
		json += "\"streetReference\":\"" + getStreetReference() + "\",";
		json += "\"geometry\":\"" + getGeometry() + "\",";
		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
		json += "\"payingSlotNumber\":\"" + getPayingSlotNumber() + "\",";
		json += "\"payingSlotOccupied\":\"" + getPayingSlotOccupied() + "\",";
		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
		json += "\"handicappedSlotOccupied\":\"" + getHandicappedSlotOccupied() + "\",";
		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";
		json += "\"lastChange\":\"" + getLastChange() + "\",";
		json += "\"occupancyRate\":\"" + getOccupancyRate() + "\",";
		json += "\"profit\":\"" + getProfit() + "\",";
		json += "\"tickets\":\"" + getTickets() + "\",";
		json += "\"parkAndRide\":\"" + isParkAndRide() + "\"";
		json += "\"manager\":\"" + getManager() + "\"";
		json += "}";
		return json;
	}

}
