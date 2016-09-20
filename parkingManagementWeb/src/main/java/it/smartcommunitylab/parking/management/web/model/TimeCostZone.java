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

public class TimeCostZone extends Zone {
//	private String id;
//	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
//	private String name;
//	private String submacro;
//	private String type; 	//type of division(geo, green, history, etc)
//	private String note;
//	private String color;
//	private Integer slotNumber;
	
	private Integer occupancy;
	private Integer slotOccupied;
	private Integer minExtratime;
	private Integer maxExtratime;

	public Integer getOccupancy() {
		return occupancy;
	}

	public Integer getSlotOccupied() {
		return slotOccupied;
	}

	public void setOccupancy(Integer occupancy) {
		this.occupancy = occupancy;
	}

	public void setSlotOccupied(Integer slotOccupied) {
		this.slotOccupied = slotOccupied;
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

}