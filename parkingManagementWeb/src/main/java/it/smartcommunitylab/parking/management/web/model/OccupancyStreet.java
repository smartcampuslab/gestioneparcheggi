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
	
}
