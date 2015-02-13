package it.smartcommunitylab.parking.management.web.bean;

public class ZoneBean {
	private String id;
	private String id_app;
	private String name;
	private String submacro;
	private String note;
	private String color;
	private PolygonBean geometry;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getId_app() {
		return id_app;
	}

	public void setId_app(String id_app) {
		this.id_app = id_app;
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

	public String getSubmacro() {
		return submacro;
	}

	public void setSubmacro(String submacro) {
		this.submacro = submacro;
	}

}
