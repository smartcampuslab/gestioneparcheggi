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

public class TimeCostStreet extends Street{
//	private String id;
//	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
//	private String streetReference;
//	private Integer slotNumber;
//	private Integer handicappedSlotNumber;	// off_h
//	private Integer unusuableSlotNumber;	// off_in
//	private boolean subscritionAllowedPark;
//	private String rateAreaId;				// I need this field in data log
//	private String color;
//	private List<String> zones;
//	private List<String> parkingMeters;
//	private String area_name;
//	private String area_color;
	
	private Integer occupancyRate;
	private Integer slotOccupied;
	private Integer minExtratime;
	private Integer maxExtratime;

	public Integer getOccupancyRate() {
		return occupancyRate;
	}

	public Integer getSlotOccupied() {
		return slotOccupied;
	}

	public void setOccupancyRate(Integer occupancyRate) {
		this.occupancyRate = occupancyRate;
	}

	public void setSlotOccupied(Integer slotOccupied) {
		this.slotOccupied = slotOccupied;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof TimeCostStreet)) {
			return false;
		}
		TimeCostStreet v = (TimeCostStreet) obj;

		return v != null && this.id != null && v.getId().equals(this.id);
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

//	public String toJSON(){
//		String json = "{";
//		json += "\"id\":\"" + getId() + "\",";
//		json += "\"id_app\":\"" + getId_app() + "\",";
//		json += "\"streetReference\":\"" + getStreetReference() + "\",";
//		json += "\"area_name\":\"" + getArea_name() + "\",";
//		json += "\"occupancyRate\":\"" + getOccupancyRate() + "\",";
//		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
//		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
//		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";
//		json += "\"zones\":\"" + getZones() + "\",";
//		json += "\"parkingMeters\":\"" + getParkingMeters() + "\",";
//		json += "\"minExtratime\":\"" + getMinExtratime() + "\",";
//		json += "\"maxExtratime\":\"" + getMaxExtratime() + "\"";
//		json += "}";
//		return json;
//	}
	
}
