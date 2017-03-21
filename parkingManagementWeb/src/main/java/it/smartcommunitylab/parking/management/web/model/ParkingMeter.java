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

import it.smartcommunitylab.parking.management.web.model.geo.Point;

import java.util.Arrays;
import java.util.List;

public class ParkingMeter {
	public static enum Status {
		ACTIVE, INACTIVE
	}

	public final static List<String> CASH_PAYMENT = Arrays.asList("Cash");
	
	private String id;
	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
	private Integer code;
	private String note;
	private Status status;
	private Point geometry;
	private List<String> zones;
	private List<String> agencyId;	// relation to agency object
	private List<String> paymentMethods;
	
	public String getId_app() {
		return id_app;
	}

	public void setId_app(String id_app) {
		this.id_app = id_app;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public Point getGeometry() {
		return geometry;
	}

	public void setGeometry(Point geometry) {
		this.geometry = geometry;
	}

	public List<String> getZones() {
		return zones;
	}

	public void setZones(List<String> zones) {
		this.zones = zones;
	}

	public List<String> getAgencyId() {
		return agencyId;
	}

	public void setAgencyId(List<String> agencyId) {
		this.agencyId = agencyId;
	}

	public List<String> getPaymentMethods() {
		if (paymentMethods == null) {
			return CASH_PAYMENT;
		}
		return paymentMethods;
	}

	public void setPaymentMethods(List<String> paymentMethods) {
		this.paymentMethods = paymentMethods;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof ParkingMeter)) {
			return false;
		}
		ParkingMeter o = (ParkingMeter) obj;

		return o.getId() != null && this.id != null
				&& o.getId().equals(this.id);
	}
}
