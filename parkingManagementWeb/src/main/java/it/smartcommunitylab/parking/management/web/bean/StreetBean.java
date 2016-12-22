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

public class StreetBean extends StreetBeanCore {
	
	private List<VehicleSlotBean> slotsConfiguration;
	
	/*private Integer handicappedSlotNumber;
	private Integer handicappedSlotOccupied;
	private Integer reservedSlotNumber;
	private Integer reservedSlotOccupied;
	private Integer timedParkSlotNumber;
	private Integer timedParkSlotOccupied;
	private Integer freeParkSlotNumber;
	private Integer freeParkSlotOccupied;
	private Integer freeParkSlotSignNumber;
	private Integer freeParkSlotSignOccupied;
	private Integer paidSlotNumber;
	private Integer paidSlotOccupied;
	private Integer unusuableSlotNumber;*/
	
	private boolean subscritionAllowedPark;
	private LineBean geometry;
	private String color;
	private List<String> parkingMeters;	//List with the id of the associated pms (optional)
	private Long lastChange;
	private double occupancyRate;	// I use it only in the bean and not in the db object
	private List<String> agencyId;	// relation to agency object
	

	public List<VehicleSlotBean> getSlotsConfiguration() {
		return slotsConfiguration;
	}

	public void setSlotsConfiguration(List<VehicleSlotBean> slotsConfiguration) {
		this.slotsConfiguration = slotsConfiguration;
	}

	public LineBean getGeometry() {
		return geometry;
	}

	public void setGeometry(LineBean geometry) {
		this.geometry = geometry;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public boolean isSubscritionAllowedPark() {
		return subscritionAllowedPark;
	}

	public void setSubscritionAllowedPark(boolean subscritionAllowedPark) {
		this.subscritionAllowedPark = subscritionAllowedPark;
	}

	public List<String> getParkingMeters() {
		return parkingMeters;
	}

	public Long getLastChange() {
		return lastChange;
	}

	public void setParkingMeters(List<String> parkingMeters) {
		this.parkingMeters = parkingMeters;
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

	/*public Integer getHandicappedSlotNumber() {
		return handicappedSlotNumber;
	}

	public void setHandicappedSlotNumber(Integer handicappedSlotNumber) {
		this.handicappedSlotNumber = handicappedSlotNumber;
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

	public Integer getHandicappedSlotOccupied() {
		return handicappedSlotOccupied;
	}

	public Integer getReservedSlotNumber() {
		return reservedSlotNumber;
	}

	public Integer getReservedSlotOccupied() {
		return reservedSlotOccupied;
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

	public void setHandicappedSlotOccupied(Integer handicappedSlotOccupied) {
		this.handicappedSlotOccupied = handicappedSlotOccupied;
	}

	public void setReservedSlotNumber(Integer reservedSlotNumber) {
		this.reservedSlotNumber = reservedSlotNumber;
	}

	public void setReservedSlotOccupied(Integer reservedSlotOccupied) {
		this.reservedSlotOccupied = reservedSlotOccupied;
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
	
	public Integer getUnusuableSlotNumber() {
		return unusuableSlotNumber;
	}

	public void setUnusuableSlotNumber(Integer unusuableSlotNumber) {
		this.unusuableSlotNumber = unusuableSlotNumber;
	}*/

	public List<String> getAgencyId() {
		return agencyId;
	}

	public void setAgencyId(List<String> agencyId) {
		this.agencyId = agencyId;
	}

	@Override
	public String toString() {
		return "StreetBean [id=" + getId() + ", id_app=" + getId_app()
				+ ", streetReference=" + getStreetReference() + ", slotNumber=" + getSlotNumber()
				/*+ ", handicappedSlotNumber="
				+ handicappedSlotNumber + ", handicappedSlotOccupied="
				+ handicappedSlotOccupied+ ", reservedSlotNumber="
						+ reservedSlotNumber + ", reservedSlotOccupied="
						+ reservedSlotOccupied + ", timedParkSlotNumber="
				+ timedParkSlotNumber + ", timedParkSlotOccupied="
				+ timedParkSlotOccupied + ", freeParkSlotNumber="
				+ freeParkSlotNumber + ", freeParkSlotOccupied="
				+ freeParkSlotOccupied + ", freeParkSlotSignNumber="
				+ freeParkSlotSignNumber + ", freeParkSlotSignOccupied="
				+ freeParkSlotSignOccupied + ", paidSlotNumber="
				+ paidSlotNumber + ", paidSlotOccupied=" + paidSlotOccupied
				+ ", unusuableSlotNumber=" + unusuableSlotNumber*/
				+ ", subscritionAllowedPark=" + subscritionAllowedPark
				+ ", rateAreaId=" + getRateAreaId() + ", geometry=" + geometry
				+ ", color=" + color + ", zones=" + getZones() + ", parkingMeters="
				+ parkingMeters + ", lastChange=" + lastChange + ", occupancyRate=" + occupancyRate + "]";
	}

	public String toJSON(){
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"id_app\":\"" + getId_app() + "\",";
		json += "\"streetReference\":\"" + getStreetReference() + "\",";
		json += "\"geometry\":\"" + getGeometry() + "\",";
		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
		/*json += "\"freeParkSlotNumber\":\"" + getFreeParkSlotNumber() + "\",";
		json += "\"freeParkSlotOccupied\":\"" + getFreeParkSlotOccupied() + "\",";
		json += "\"freeParkSlotSignNumber\":\"" + getFreeParkSlotSignNumber() + "\",";
		json += "\"freeParkSlotSignOccupied\":\"" + getFreeParkSlotSignOccupied() + "\",";
		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
		json += "\"handicappedSlotOccupied\":\"" + getHandicappedSlotOccupied() + "\",";
		json += "\"timedParkSlotNumber\":\"" + getTimedParkSlotNumber() + "\",";
		json += "\"timedParkSlotOccupied\":\"" + getTimedParkSlotOccupied() + "\",";
		json += "\"paidSlotNumber\":\"" + getPaidSlotNumber() + "\",";
		json += "\"paidSlotOccupied\":\"" + getPaidSlotOccupied() + "\",";
		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";*/
		json += "\"subscritionAllowedPark\":\"" + isSubscritionAllowedPark() + "\",";
		json += "\"lastChange\":\"" + getLastChange() + "\",";
		json += "\"rateAreaId\":\"" + getRateAreaId() + "\",";
		json += "\"zones\":\"" + getZones() + "\",";
		json += "\"parkingMeters\":\"" + getParkingMeters() + "\",";
		json += "\"occupancyRate\":\"" + getOccupancyRate() + "\"";
		json += "}";
		return json;
	}
	
}
