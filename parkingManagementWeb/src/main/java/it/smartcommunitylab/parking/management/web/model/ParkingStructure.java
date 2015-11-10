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

import it.smartcommunitylab.parking.management.web.model.geo.Point;

import java.util.List;

public class ParkingStructure {

	public static enum PaymentMode {
		CASH, AUTOMATED_TELLER, PREPAID_CARD, PARCOMETRO
	}

	private String id;
	private String id_app;		// used to specify the actual app (tn, rv, ecc...)
	private String name;	
	private String streetReference;
	private String managementMode;
	private String fee_note;
	private String manager;		// used to specify if the park is a municipality park or a private manager park
	private Integer fee_val;	// in eurocent / hour
	private String timeSlot;	// used in csv creation for openingTime string value
	private OpeningTime openingTime;
	private Point geometry;
	
	private Integer slotNumber;		
	private Integer payingSlotNumber;
	private Integer payingSlotOccupied;		// on Paying
	private Integer handicappedSlotNumber;
	private Integer handicappedSlotOccupied;
	private Integer unusuableSlotNumber;
	
	private List<PaymentMode> paymentMode;
	private String phoneNumber;
	private Long lastChange;
	private boolean parkAndRide;	// used to specify if a structure is used in parkAndRide features
	
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

	public String getFee_note() {
		return fee_note;
	}

	public Integer getFee_val() {
		return fee_val;
	}

	public void setFee_note(String fee_note) {
		this.fee_note = fee_note;
	}

	public void setFee_val(Integer fee_val) {
		this.fee_val = fee_val;
	}

	public Point getGeometry() {
		return geometry;
	}

	public void setGeometry(Point geometry) {
		this.geometry = geometry;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setPaymentMode(List<PaymentMode> paymentMode) {
		this.paymentMode = paymentMode;
	}

	public List<PaymentMode> getPaymentMode() {
		return paymentMode;
	}

	public Integer getPayingSlotNumber() {
		return payingSlotNumber;
	}

	public void setPayingSlotNumber(Integer payingSlotNumber) {
		this.payingSlotNumber = payingSlotNumber;
	}

	public Integer getPayingSlotOccupied() {
		return payingSlotOccupied;
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

	public void setPayingSlotOccupied(Integer slotOccupied) {
		this.payingSlotOccupied = slotOccupied;
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

	public Long getLastChange() {
		return lastChange;
	}

	public void setLastChange(Long lastChange) {
		this.lastChange = lastChange;
	}
	
	public boolean isParkAndRide() {
		return parkAndRide;
	}

	public void setParkAndRide(boolean parkAndRide) {
		this.parkAndRide = parkAndRide;
	}

	public OpeningTime getOpeningTime() {
		return openingTime;
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

	public void setOpeningTime(OpeningTime openingTime) {
		this.openingTime = openingTime;
	}

	public String toJSON(){
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"id_app\":\"" + getId_app() + "\",";
		json += "\"name\":\"" + getName() + "\",";
		json += "\"streetReference\":\"" + getStreetReference() + "\",";
		json += "\"fee_note\":\"" + getFee_note() + "\",";
		json += "\"manager\":\"" + getManager() + "\",";
		json += "\"fee_val\":" + getFee_val() + ",";
		json += "\"geometry\":\"" + getGeometry() + "\",";
		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
		json += "\"slotPaying\":\"" + getPayingSlotNumber() + "\",";
		json += "\"slotOccupiedOnPaying\":\"" + getPayingSlotOccupied() + "\",";
		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
		json += "\"handicappedSlotOccupied\":\"" + getHandicappedSlotOccupied() + "\",";
		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";
		json += "\"lastChange\":\"" + getLastChange() + "\",";
		json += "\"parkAndRide\":\"" + isParkAndRide() + "\"";
		json += "}";
		return json;
	}

}
