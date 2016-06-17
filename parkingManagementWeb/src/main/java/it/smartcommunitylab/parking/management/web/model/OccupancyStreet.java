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

public class OccupancyStreet extends Street{
//	private String id;
//	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
//	private String streetReference;
//	private Integer slotNumber;
//	private Integer handicappedSlotNumber;	// off_h
//	private Integer handicappedSlotOccupied;
//	private Integer reservedSlotNumber;	// off_rs
//	private Integer reservedSlotOccupied;
//	private Integer timedParkSlotNumber;	// off_do
//	private Integer timedParkSlotOccupied;
//	private Integer freeParkSlotNumber;		// off_ls
//	private Integer freeParkSlotOccupied;
//	private Integer freeParkSlotSignNumber;	// off_lc
//	private Integer freeParkSlotSignOccupied;
//	private Integer paidSlotNumber;			// off_p
//	private Integer paidSlotOccupied;
//	private Integer unusuableSlotNumber;	// off_in
//	private boolean subscritionAllowedPark;
//	private String rateAreaId;				// I need this field in data log
//	private String color;
//	private List<String> zones;
//	private List<String> parkingMeters;
//	private String area_name;
//	private String area_color;

	private Integer occupancyRate;
	private Integer freeParkOccupied;
	private Integer slotOccupied;

	public Integer getOccupancyRate() {
		return occupancyRate;
	}

	public Integer getFreeParkOccupied() {
		return freeParkOccupied;
	}

	public Integer getSlotOccupied() {
		return slotOccupied;
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
	
	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof OccupancyStreet)) {
			return false;
		}
		OccupancyStreet v = (OccupancyStreet) obj;
		return v != null && this.id != null && v.getId().equals(this.id);
	}

//	public String toJSON(){
//		String json = "{";
//		json += "\"id\":\"" + getId() + "\",";
//		json += "\"id_app\":\"" + getId_app() + "\",";
//		json += "\"streetReference\":\"" + getStreetReference() + "\",";
//		json += "\"area_name\":\"" + getArea_name() + "\",";
//		json += "\"occupancyRate\":\"" + getOccupancyRate() + "\",";
//		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
//		json += "\"freeParkSlotNumber\":\"" + getFreeParkSlotNumber() + "\",";
//		json += "\"freeParkSlotOccupied\":\"" + getFreeParkSlotOccupied() + "\",";
//		json += "\"freeParkSlotSignNumber\":\"" + getFreeParkSlotSignNumber() + "\",";
//		json += "\"freeParkSlotSignOccupied\":\"" + getFreeParkSlotSignOccupied() + "\",";
//		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
//		json += "\"handicappedSlotOccupied\":\"" + getHandicappedSlotOccupied() + "\",";
//		json += "\"reservedSlotNumber\":\"" + getReservedSlotNumber() + "\",";
//		json += "\"reservedSlotOccupied\":\"" + getReservedSlotOccupied() + "\",";
//		json += "\"timedParkSlotNumber\":\"" + getTimedParkSlotNumber() + "\",";
//		json += "\"timedParkSlotOccupied\":\"" + getTimedParkSlotOccupied() + "\",";
//		json += "\"paidSlotNumber\":\"" + getPaidSlotNumber() + "\",";
//		json += "\"paidSlotOccupied\":\"" + getPaidSlotOccupied() + "\",";
//		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";
//		json += "\"zones\":\"" + getZones() + "\",";
//		json += "\"parkingMeters\":\"" + getParkingMeters() + "\"";
//		json += "}";
//		return json;
//	}
	
}
