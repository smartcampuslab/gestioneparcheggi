package it.smartcampuslab.tm.model;

import it.smartcampuslab.tm.model.geo.Point;

public class Parcometro {
	public static enum Status {
		ACTIVE, INACTIVE
	}

	private String id;
	private Integer code;
	private String note;
	private Status status;
	private Point geometry;

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
		if (!(obj instanceof Parcometro)) {
			return false;
		}
		Parcometro o = (Parcometro) obj;

		return o.getId() != null && this.id != null
				&& o.getId().equals(this.id);
	}
}
