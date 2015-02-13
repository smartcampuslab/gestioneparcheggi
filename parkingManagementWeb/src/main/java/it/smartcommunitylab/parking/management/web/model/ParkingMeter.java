package it.smartcommunitylab.parking.management.web.model;

import it.smartcommunitylab.parking.management.web.model.geo.Point;

public class ParkingMeter {
	public static enum Status {
		ACTIVE, INACTIVE
	}

	private String id;
	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
	private Integer code;
	private String note;
	private Status status;
	private Point geometry;
	
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
