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

public class ProfitParkingStructure {

	public static enum PaymentMode {
		CASH, AUTOMATED_TELLER, PREPAID_CARD, PARCOMETRO
	}

	private String id;
	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
	private String name;	
	private String streetReference;
	private String managementMode;
	private String manager;
	private String fee;
	private String timeSlot;
	private Integer slotNumber;
	private Integer handicappedSlotNumber;
	private Integer unusuableSlotNumber;
	private String phoneNumber;
	private Integer profit;
	private Integer tickets;
	
	
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

	public String getFee() {
		return fee;
	}

	public void setFee(String fee) {
		this.fee = fee;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Integer getHandicappedSlotNumber() {
		return handicappedSlotNumber;
	}

	public Integer getUnusuableSlotNumber() {
		return unusuableSlotNumber;
	}

	public void setHandicappedSlotNumber(Integer handicappedSlotNumber) {
		this.handicappedSlotNumber = handicappedSlotNumber;
	}

	public void setUnusuableSlotNumber(Integer unusuableSlotNumber) {
		this.unusuableSlotNumber = unusuableSlotNumber;
	}

	public Integer getProfit() {
		return profit;
	}

	public void setProfit(Integer profit) {
		this.profit = profit;
	}

	public Integer getTickets() {
		return tickets;
	}

	public void setTickets(Integer tickets) {
		this.tickets = tickets;
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
		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";
		json += "\"profit\":\"" + getProfit() + "\",";
		json += "\"tickets\":\"" + getTickets() + "\"";
		json += "}";
		return json;
	}

}
