package it.smartcampuslab.tm.bean;

public class ZonaBean {
	private String id;
	private String name;
	private String note;
	private String color;
	private PolygonBean geometry;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public PolygonBean getGeometry() {
		return geometry;
	}

	public void setGeometry(PolygonBean geometry) {
		this.geometry = geometry;
	}

}
