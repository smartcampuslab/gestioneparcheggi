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

public class ProfitParkingMeter extends ParkingMeter {
//	public static enum Status {
//		ACTIVE, INACTIVE
//	}
//
//	private String id;
//	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
//	private Integer code;
//	private String note;
//	private Status status;
//	private String areaId;
//	private Point geometry;
//	private List<String> zones;
	
	private String areaId;
	private Integer profit;
	private Integer tickets;

	public Integer getProfit() {
		return profit;
	}

	public Integer getTickets() {
		return tickets;
	}

	public void setProfit(Integer profit) {
		this.profit = profit;
	}

	public void setTickets(Integer tickets) {
		this.tickets = tickets;
	}

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof ProfitParkingMeter)) {
			return false;
		}
		ProfitParkingMeter o = (ProfitParkingMeter) obj;

		return o.getId() != null && this.getId() != null
				&& o.getId().equals(this.getId());
	}
}
