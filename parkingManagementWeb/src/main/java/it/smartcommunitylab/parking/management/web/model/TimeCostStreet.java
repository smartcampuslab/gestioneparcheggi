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

public class TimeCostStreet {
	private String id;
	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
	private String streetReference;
	private Integer slotNumber;
	private Integer handicappedSlotNumber;	// off_h
	private Integer unusuableSlotNumber;	// off_in
	private boolean subscritionAllowedPark;
	private String rateAreaId;				// I need this field in data log
	private String color;
	private List<String> zones;
	private List<String> parkingMeters;
	private Integer occupancyRate;
	private Integer slotOccupied;
	private String area_name;
	private String area_color;
	private Integer minExtratime;
	private Integer maxExtratime;

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
	
	public String getColor() {
		return color;
	}

	public Integer getOccupancyRate() {
		return occupancyRate;
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
		if (!(obj instanceof TimeCostStreet)) {
			return false;
		}
		TimeCostStreet v = (TimeCostStreet) obj;

		return v != null && this.id != null && v.getId().equals(this.id);
	}

	public Integer getUnusuableSlotNumber() {
		return unusuableSlotNumber;
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
	
	public Integer getMinExtratime() {
		return minExtratime;
	}

	public Integer getMaxExtratime() {
		return maxExtratime;
	}

	public void setMinExtratime(Integer minExtratime) {
		this.minExtratime = minExtratime;
	}

	public void setMaxExtratime(Integer maxExtratime) {
		this.maxExtratime = maxExtratime;
	}

	public String toJSON(){
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"id_app\":\"" + getId_app() + "\",";
		json += "\"streetReference\":\"" + getStreetReference() + "\",";
		json += "\"area_name\":\"" + getArea_name() + "\",";
		json += "\"occupancyRate\":\"" + getOccupancyRate() + "\",";
		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";
		json += "\"zones\":\"" + getZones() + "\",";
		json += "\"parkingMeters\":\"" + getParkingMeters() + "\",";
		json += "\"minExtratime\":\"" + getMinExtratime() + "\",";
		json += "\"maxExtratime\":\"" + getMaxExtratime() + "\"";
		json += "}";
		return json;
	}
	
}
