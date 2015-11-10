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

public class CompactParkingStructureBean {

	private String id;
	private Integer slotNumber;
	private Integer payingSlotNumber;
	private Integer payingSlotOccupied;
	private Integer handicappedSlotNumber;
	private Integer handicappedSlotOccupied;
	private Integer unusuableSlotNumber;
	private double occupancyRate;	// I use it only in the bean and not in the db object
	
	public Integer getSlotNumber() {
		return slotNumber;
	}

	public void setSlotNumber(Integer slotNumber) {
		this.slotNumber = slotNumber;
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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public double getOccupancyRate() {
		return occupancyRate;
	}

	public void setOccupancyRate(double occupancyRate) {
		this.occupancyRate = occupancyRate;
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

	public String toJSON(){
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
		json += "\"payingSlotNumber\":\"" + getPayingSlotNumber() + "\",";
		json += "\"payingSlotOccupied\":\"" + getPayingSlotOccupied() + "\",";
		json += "\"handicappedSlotNumber\":\"" + getHandicappedSlotNumber() + "\",";
		json += "\"handicappedSlotOccupied\":\"" + getHandicappedSlotOccupied() + "\",";
		json += "\"unusuableSlotNumber\":\"" + getUnusuableSlotNumber() + "\",";
		json += "\"occupancyRate\":\"" + getOccupancyRate() + "\"";
		json += "}";
		return json;
	}

}
