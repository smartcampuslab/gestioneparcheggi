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
package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import it.smartcommunitylab.parking.management.web.model.slots.VehicleSlot;

public class Street implements Serializable {

	private static final long serialVersionUID = 387771948768252561L;

	// From GeoObject
	private String id;
	private String agency;
	private double[] position;
	private String name;
	private String description;
	// Fields from basic object
	private Long updateTime;
	private Long version;
	private Integer user;
	
//	/**
//	 * parcheggi gratuiti totali/occupati
//	 */
//	private int slotsFree;
//	private int slotsOccupiedOnFree;
//	/**
//	 * parcheggi gratuiti con segnaletica totali/occupati
//	 */
//	private int slotsFreeSigned;
//	private int slotsOccupiedOnFreeSigned;
//	/**
//	 * parcheggi liberi totali/occupati
//	 */
//	private int slotsUnavailable;
//	/**
//	 * parcheggi a pagamento totali/occupati
//	 */
//	private int slotsPaying;
//	private int slotsOccupiedOnPaying;
//	/**
//	 * parcheggi a disco orario totali/occupati
//	 */
//	private int slotsTimed;
//	private int slotsOccupiedOnTimed;
//	/**
//	 * parcheggi per disabili totali/occupati
//	 */
//	private int slotsHandicapped;
//	private int slotsOccupiedOnHandicapped;
//	/**
//	 * parcheggi riservati totali/occupati
//	 */
//	private int slotsReserved;
//	private int slotsOccupiedOnReserved;
	
	private List<VehicleSlot> slotsConfiguration;	// Slot configuration for each vehicle type

	private String polyline;
	
	private LastChange lastChange;
	
	private String areaId;
	
//	public int getSlotsOccupiedOnFree() {
//		return slotsOccupiedOnFree;
//	}
//
//	public void setSlotsOccupiedOnFree(int slotsOccupiedOnFree) {
//		this.slotsOccupiedOnFree = slotsOccupiedOnFree;
//	}
//
//	public int getSlotsOccupiedOnPaying() {
//		return slotsOccupiedOnPaying;
//	}
//
//	public void setSlotsOccupiedOnPaying(int slotsOccupiedOnPaying) {
//		this.slotsOccupiedOnPaying = slotsOccupiedOnPaying;
//	}
//
//	public int getSlotsOccupiedOnTimed() {
//		return slotsOccupiedOnTimed;
//	}
//
//	public void setSlotsOccupiedOnTimed(int slotsOccupiedOnTimed) {
//		this.slotsOccupiedOnTimed = slotsOccupiedOnTimed;
//	}
//
//	public void setSlotsUnavailable(int slotsUnavailable) {
//		this.slotsUnavailable = slotsUnavailable;
//	}
//
//	public int getSlotsFree() {
//		return slotsFree;
//	}
//
//	public int getSlotsUnavailable() {
//		return slotsUnavailable;
//	}
//
//	public int getSlotsPaying() {
//		return slotsPaying;
//	}
//
//	public int getSlotsTimed() {
//		return slotsTimed;
//	}
//
//	public void setSlotsFree(int slotsFree) {
//		this.slotsFree = slotsFree;
//	}
//
//	public void setSlotsPaying(int slotsPaying) {
//		this.slotsPaying = slotsPaying;
//	}
//
//	public void setSlotsTimed(int slotsTimed) {
//		this.slotsTimed = slotsTimed;
//	}
//
//	public int getSlotsHandicapped() {
//		return slotsHandicapped;
//	}
//
//	public int getSlotsOccupiedOnHandicapped() {
//		return slotsOccupiedOnHandicapped;
//	}
//
//	public void setSlotsHandicapped(int slotsHandicapped) {
//		this.slotsHandicapped = slotsHandicapped;
//	}
//
//	public void setSlotsOccupiedOnHandicapped(int slotsOccupiedOnHandicapped) {
//		this.slotsOccupiedOnHandicapped = slotsOccupiedOnHandicapped;
//	}
//
//	public int getSlotsFreeSigned() {
//		return slotsFreeSigned;
//	}
//
//	public int getSlotsOccupiedOnFreeSigned() {
//		return slotsOccupiedOnFreeSigned;
//	}
//
//	public int getSlotsReserved() {
//		return slotsReserved;
//	}
//
//	public int getSlotsOccupiedOnReserved() {
//		return slotsOccupiedOnReserved;
//	}
//
//	public void setSlotsFreeSigned(int slotsFreeSigned) {
//		this.slotsFreeSigned = slotsFreeSigned;
//	}
//
//	public void setSlotsOccupiedOnFreeSigned(int slotsOccupiedOnFreeSigned) {
//		this.slotsOccupiedOnFreeSigned = slotsOccupiedOnFreeSigned;
//	}
//
//	public void setSlotsReserved(int slotsReserved) {
//		this.slotsReserved = slotsReserved;
//	}
//
//	public void setSlotsOccupiedOnReserved(int slotsOccupiedOnReserved) {
//		this.slotsOccupiedOnReserved = slotsOccupiedOnReserved;
//	}
	
	public LastChange getLastChange() {
		return lastChange;
	}

	public void setLastChange(LastChange lastChange) {
		this.lastChange = lastChange;
	}

	public String getPolyline() {
		return polyline;
	}

	public void setPolyline(String polyline) {
		this.polyline = polyline;
	}

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}
	
	public String getId() {
		return id;
	}

	public String getAgency() {
		return agency;
	}

	public double[] getPosition() {
		return position;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public Long getUpdateTime() {
		return updateTime;
	}

	public Long getVersion() {
		return version;
	}

	public Integer getUser() {
		return user;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setAgency(String agency) {
		this.agency = agency;
	}

	public void setPosition(double[] position) {
		this.position = position;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public void setUser(Integer user) {
		this.user = user;
	}

	public List<VehicleSlot> getSlotsConfiguration() {
		return slotsConfiguration;
	}

	public void setSlotsConfiguration(List<VehicleSlot> slotsConfiguration) {
		this.slotsConfiguration = slotsConfiguration;
	}

	@Override
	public String toString() {
		return "Street [id=" + id + ", agency=" + agency + ", position="
				+ Arrays.toString(position) + ", name=" + name
				+ ", description=" + description + ", updateTime=" + updateTime
				+ ", version=" + version + ", user=" + user
				/*+ ", slotsFree="
				+ slotsFree + ", slotsOccupiedOnFree=" + slotsOccupiedOnFree
				+ ", slotsFreeSigned=" + slotsFreeSigned
				+ ", slotsOccupiedOnFreeSigned=" + slotsOccupiedOnFreeSigned
				+ ", slotsUnavailable=" + slotsUnavailable + ", slotsPaying="
				+ slotsPaying + ", slotsOccupiedOnPaying="
				+ slotsOccupiedOnPaying + ", slotsTimed=" + slotsTimed
				+ ", slotsOccupiedOnTimed=" + slotsOccupiedOnTimed
				+ ", slotsHandicapped=" + slotsHandicapped
				+ ", slotsOccupiedOnHandicapped=" + slotsOccupiedOnHandicapped
				+ ", slotsReserved=" + slotsReserved
				+ ", slotsOccupiedOnReserved=" + slotsOccupiedOnReserved*/
				+ ", polyline=" + polyline + ", lastChange=" + lastChange
				+ ", areaId=" + areaId + "]";
	}

	public String toJSON() {
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"updateTime\":" + getUpdateTime() + ",";
		json += "\"version\":" + getVersion() + ",";
		json += "\"user\":\"" + getUser() + "\",";
		json += "\"agency\":\"" + getAgency() + "\",";
		if(getPosition() != null && getPosition().length > 0){
			double[] pos = getPosition();
			json += "\"position\":[" + pos[0] +  "," + pos[1] + "],";		
		} else {
			json += "\"position\":[],";
		}
		json += "\"name\":\"" + getName() + "\",";
		json += "\"description\":\"" + getDescription() + "\",";
		/*json += "\"slotsFree\":" + getSlotsFree() + ",";
		json += "\"slotsOccupiedOnFree\":" + getSlotsOccupiedOnFree() + ",";
		json += "\"slotsFreeSigned\":" + getSlotsFreeSigned() + ",";
		json += "\"slotsOccupiedOnFreeSigned\":" + getSlotsOccupiedOnFreeSigned() + ",";
		json += "\"slotsPaying\":" + getSlotsPaying() + ",";
		json += "\"slotsOccupiedOnPaying\":" + getSlotsOccupiedOnPaying() + ",";
		json += "\"slotsTimed\":" + getSlotsTimed() + ",";
		json += "\"slotsOccupiedOnTimed\":" + getSlotsOccupiedOnTimed() + ",";
		json += "\"slotsHandicapped\":" + getSlotsHandicapped() + ",";
		json += "\"slotsOccupiedOnHandicapped\":" + getSlotsOccupiedOnHandicapped() + ",";
		json += "\"slotsReserved\":" + getSlotsReserved() + ",";
		json += "\"slotsOccupiedOnReserved\":" + getSlotsOccupiedOnReserved() + ",";		
		json += "\"slotsUnavailable\":" + getSlotsUnavailable() + ",";*/
		json += "\"lastChange\":" + getLastChange() + ",";
		json += "\"polyline\":\"" + getPolyline() + "\",";
		json += "\"areaId\":\"" + getAreaId() + "\"";
		json += "}";
		return json;
	}
}
