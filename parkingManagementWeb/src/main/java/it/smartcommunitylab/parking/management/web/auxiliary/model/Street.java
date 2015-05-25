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
	
	/**
	 * parcheggi gratuiti totali/occupati
	 */
	private int slotsFree;
	private int slotsOccupiedOnFree;
	/**
	 * parcheggi liberi totali/occupati
	 */
	private int slotsUnavailable;
	/**
	 * parcheggi a pagamento totali/occupati
	 */
	private int slotsPaying;
	private int slotsOccupiedOnPaying;
	/**
	 * parcheggi a disco orario totali/occupati
	 */
	private int slotsTimed;
	private int slotsOccupiedOnTimed;

	private String polyline;
	
	private LastChange lastChange;
	
	private String areaId;
	
	public int getSlotsOccupiedOnFree() {
		return slotsOccupiedOnFree;
	}

	public void setSlotsOccupiedOnFree(int slotsOccupiedOnFree) {
		this.slotsOccupiedOnFree = slotsOccupiedOnFree;
	}

	public int getSlotsOccupiedOnPaying() {
		return slotsOccupiedOnPaying;
	}

	public void setSlotsOccupiedOnPaying(int slotsOccupiedOnPaying) {
		this.slotsOccupiedOnPaying = slotsOccupiedOnPaying;
	}

	public int getSlotsOccupiedOnTimed() {
		return slotsOccupiedOnTimed;
	}

	public void setSlotsOccupiedOnTimed(int slotsOccupiedOnTimed) {
		this.slotsOccupiedOnTimed = slotsOccupiedOnTimed;
	}

	public void setSlotsUnavailable(int slotsUnavailable) {
		this.slotsUnavailable = slotsUnavailable;
	}

	public int getSlotsFree() {
		return slotsFree;
	}

	public int getSlotsUnavailable() {
		return slotsUnavailable;
	}

	public int getSlotsPaying() {
		return slotsPaying;
	}

	public int getSlotsTimed() {
		return slotsTimed;
	}

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

	public void setSlotsFree(int slotsFree) {
		this.slotsFree = slotsFree;
	}

	public void setSlotsPaying(int slotsPaying) {
		this.slotsPaying = slotsPaying;
	}

	public void setSlotsTimed(int slotsTimed) {
		this.slotsTimed = slotsTimed;
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

	@Override
	public String toString() {
		return "Street [slotsFree=" + slotsFree + ", slotsOccupiedOnFree="
				+ slotsOccupiedOnFree + ", slotsUnavailable="
				+ slotsUnavailable + ", slotsPaying=" + slotsPaying
				+ ", slotsOccupiedOnPaying=" + slotsOccupiedOnPaying
				+ ", slotsTimed=" + slotsTimed + ", slotsOccupiedOnTimed="
				+ slotsOccupiedOnTimed + ", polyline=" + polyline
				+ ", lastChange=" + lastChange + ", areaId=" + areaId + "]";
	}
	
//	@Override
//	public String toString() {
//		return "Street [id=" + id + ", agency=" + agency + ", position="
//				+ Arrays.toString(position) + ", name=" + name
//				+ ", description=" + description + ", updateTime=" + updateTime
//				+ ", version=" + version + ", user=" + user + ", slotsFree="
//				+ slotsFree + ", slotsOccupiedOnFree=" + slotsOccupiedOnFree
//				+ ", slotsUnavailable=" + slotsUnavailable + ", slotsPaying="
//				+ slotsPaying + ", slotsOccupiedOnPaying="
//				+ slotsOccupiedOnPaying + ", slotsTimed=" + slotsTimed
//				+ ", slotsOccupiedOnTimed=" + slotsOccupiedOnTimed
//				+ ", polyline=" + polyline + ", lastChange=" + lastChange
//				+ ", areaId=" + areaId + "]";
//	}
	
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
		json += "\"slotsFree\":" + getSlotsFree() + ",";
		json += "\"slotsOccupiedOnFree\":" + getSlotsOccupiedOnFree() + ",";
		json += "\"slotsPaying\":" + getSlotsPaying() + ",";
		json += "\"slotsOccupiedOnPaying\":" + getSlotsOccupiedOnPaying() + ",";
		json += "\"slotsTimed\":" + getSlotsTimed() + ",";
		json += "\"slotsOccupiedOnTimed\":" + getSlotsOccupiedOnTimed() + ",";
		json += "\"slotsUnavailable\":" + getSlotsUnavailable() + ",";
		json += "\"lastChange\":" + getLastChange() + ",";
		json += "\"polyline\":\"" + getPolyline() + "\",";
		json += "\"areaId\":\"" + getAreaId() + "\"";
		json += "}";
		return json;
	}
}
