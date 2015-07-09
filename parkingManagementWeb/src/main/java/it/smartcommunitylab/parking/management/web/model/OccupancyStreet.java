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

import java.util.List;

import it.smartcommunitylab.parking.management.web.model.geo.Line;

public class OccupancyStreet {
	private String id;
	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
	private String streetReference;
	private String areaName;
	private Integer slotNumber;
	private Integer handicappedSlotNumber;	// off_h
	private Integer handicappedSlotOccupied;
	private Integer reservedSlotNumber;	// off_rs
	private Integer reservedSlotOccupied;
	private Integer timedParkSlotNumber;	// off_do
	private Integer timedParkSlotOccupied;
	private Integer freeParkSlotNumber;		// off_ls
	private Integer freeParkSlotOccupied;
	private Integer freeParkSlotSignNumber;	// off_lc
	private Integer freeParkSlotSignOccupied;
	private Integer paidSlotNumber;			// off_p
	private Integer paidSlotOccupied;
	private Integer unusuableSlotNumber;	// off_in
	private boolean subscritionAllowedPark;
	private String rateAreaId;				// I need this field in data log
	private String color;
	private List<String> zones;
	private List<String> parkingMeters;
	private Integer occupancyRate;
	private Integer freeParkOccupied;
	private Integer slotOccupied;
	private String area_name;
	private String area_color;

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
	
	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public String getColor() {
		return color;
	}

	public Integer getOccupancyRate() {
		return occupancyRate;
	}

	public Integer getFreeParkOccupied() {
		return freeParkOccupied;
	}

	public Integer getSlotOccupied() {
		return slotOccupied;
	}

	public String getArea_name() {
		return area_name;
	}

	public String getArea_color() {
		return area_color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public void setOccupancyRate(Integer occupancyRate) {
		this.occupancyRate = occupancyRate;
	}

	public void setFreeParkOccupied(Integer freeParkOccupied) {
		this.freeParkOccupied = freeParkOccupied;
	}

	public void setSlotOccupied(Integer slotOccupied) {
		this.slotOccupied = slotOccupied;
	}

	public void setArea_name(String area_name) {
		this.area_name = area_name;
	}

	public void setArea_color(String area_color) {
		this.area_color = area_color;
	}

	public String getStreetReference() {
		return streetReference;
	}

	public void setStreetReference(String streetReference) {
		this.streetReference = streetReference;
	}

	public Integer getSlotNumber() {
		return slotNumber;
	}

	public void setSlotNumber(Integer slotNumber) {
		this.slotNumber = slotNumber;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof OccupancyStreet)) {
			return false;
		}
		OccupancyStreet v = (OccupancyStreet) obj;

		return v != null && this.id != null && v.getId().equals(this.id);
	}

	public Integer getHandicappedSlotOccupied() {
		return handicappedSlotOccupied;
	}

	public Integer getTimedParkSlotOccupied() {
		return timedParkSlotOccupied;
	}

	public Integer getFreeParkSlotOccupied() {
		return freeParkSlotOccupied;
	}

	public Integer getFreeParkSlotSignNumber() {
		return freeParkSlotSignNumber;
	}

	public Integer getFreeParkSlotSignOccupied() {
		return freeParkSlotSignOccupied;
	}

	public Integer getPaidSlotNumber() {
		return paidSlotNumber;
	}

	public Integer getPaidSlotOccupied() {
		return paidSlotOccupied;
	}

	public Integer getUnusuableSlotNumber() {
		return unusuableSlotNumber;
	}

	public void setHandicappedSlotOccupied(Integer handicappedSlotOccupied) {
		this.handicappedSlotOccupied = handicappedSlotOccupied;
	}

	public void setTimedParkSlotOccupied(Integer timedParkSlotOccupied) {
		this.timedParkSlotOccupied = timedParkSlotOccupied;
	}

	public void setFreeParkSlotOccupied(Integer freeParkSlotOccupied) {
		this.freeParkSlotOccupied = freeParkSlotOccupied;
	}

	public void setFreeParkSlotSignNumber(Integer freeParkSlotSignNumber) {
		this.freeParkSlotSignNumber = freeParkSlotSignNumber;
	}

	public void setFreeParkSlotSignOccupied(Integer freeParkSlotSignOccupied) {
		this.freeParkSlotSignOccupied = freeParkSlotSignOccupied;
	}

	public void setPaidSlotNumber(Integer paidSlotNumber) {
		this.paidSlotNumber = paidSlotNumber;
	}

	public void setPaidSlotOccupied(Integer paidSlotOccupied) {
		this.paidSlotOccupied = paidSlotOccupied;
	}

	public void setUnusuableSlotNumber(Integer unusuableSlotNumber) {
		this.unusuableSlotNumber = unusuableSlotNumber;
	}

	public Integer getHandicappedSlotNumber() {
		return handicappedSlotNumber;
	}

	public void setHandicappedSlotNumber(Integer handicappedSlotNumber) {
		this.handicappedSlotNumber = handicappedSlotNumber;
	}

	public Integer getReservedSlotNumber() {
		return reservedSlotNumber;
	}

	public Integer getReservedSlotOccupied() {
		return reservedSlotOccupied;
	}

	public void setReservedSlotNumber(Integer reservedSlotNumber) {
		this.reservedSlotNumber = reservedSlotNumber;
	}

	public void setReservedSlotOccupied(Integer reservedSlotOccupied) {
		this.reservedSlotOccupied = reservedSlotOccupied;
	}

	public Integer getTimedParkSlotNumber() {
		return timedParkSlotNumber;
	}

	public void setTimedParkSlotNumber(Integer timedParkSlotNumber) {
		this.timedParkSlotNumber = timedParkSlotNumber;
	}

	public Integer getFreeParkSlotNumber() {
		return freeParkSlotNumber;
	}

	public void setFreeParkSlotNumber(Integer freeParkSlotNumber) {
		this.freeParkSlotNumber = freeParkSlotNumber;
	}
	
	public List<String> getZones() {
		return zones;
	}
	
	public void setZones(List<String> zones) {
		this.zones = zones;
	}
	
	public List<String> getParkingMeters() {
		return parkingMeters;
	}

	public void setParkingMeters(List<String> parkingMeters) {
		this.parkingMeters = parkingMeters;
	}
	
	public boolean isSubscritionAllowedPark() {
		return subscritionAllowedPark;
	}

	public String getRateAreaId() {
		return rateAreaId;
	}

	public void setSubscritionAllowedPark(boolean subscritionAllowedPark) {
		this.subscritionAllowedPark = subscritionAllowedPark;
	}

	public void setRateAreaId(String rateAreaId) {
		this.rateAreaId = rateAreaId;
	}

	public String toJSON(){
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"id_app\":\"" + getId_app() + "\",";
		json += "\"streetReference\":\"" + getStreetReference() + "\",";
		json += "\"areaName\":\"" + getAreaName() + "\",";
		json += "\"occupancyRate\":\"" + getOccupancyRate() + "\",";
		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
		json += "\"freeParkSlotNumber\":\"" + getFreeParkSlotNumber() + "\",";
		json += "\"freeParkSlotOccupied\":\"" + getFreeParkSlotOccupied() + "\",";
		json += "\"freeParkSlotSignNumber\":\"" + getFreeParkSlotSignNumber() + "\",";
		json += "\"freeParkSlotSignOccupied\":\"" + getFreeParkSlotSignOccupied() + "\",";
		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
		json += "\"handicappedSlotOccupied\":\"" + getHandicappedSlotOccupied() + "\",";
		json += "\"reservedSlotNumber\":\"" + getReservedSlotNumber() + "\",";
		json += "\"reservedSlotOccupied\":\"" + getReservedSlotOccupied() + "\",";
		json += "\"timedParkSlotNumber\":\"" + getTimedParkSlotNumber() + "\",";
		json += "\"timedParkSlotOccupied\":\"" + getTimedParkSlotOccupied() + "\",";
		json += "\"paidSlotNumber\":\"" + getPaidSlotNumber() + "\",";
		json += "\"paidSlotOccupied\":\"" + getPaidSlotOccupied() + "\",";
		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";
		json += "\"zones\":\"" + getZones() + "\",";
		json += "\"parkingMeters\":\"" + getParkingMeters() + "\"";
		json += "}";
		return json;
	}
	
}