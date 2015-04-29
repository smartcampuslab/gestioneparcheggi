package it.smartcampuslab.tm.model;

import it.smartcampuslab.tm.model.geo.Polygon;

import java.util.List;

public class Area {
	private String id;
	private String name;
	private Float fee;
	private String timeSlot;
	private String smsCode;
	private String color;
	private List<Polygon> geometry;

	private List<Via> vie;
	private List<Parcometro> parcometri;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Float getFee() {
		return fee;
	}

	public void setFee(Float fee) {
		this.fee = fee;
	}

	public String getTimeSlot() {
		return timeSlot;
	}

	public void setTimeSlot(String timeSlot) {
		this.timeSlot = timeSlot;
	}

	public String getSmsCode() {
		return smsCode;
	}

	public void setSmsCode(String smsCode) {
		this.smsCode = smsCode;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public List<Via> getVie() {
		return vie;
	}

	public void setVie(List<Via> vie) {
		this.vie = vie;
	}

	public List<Parcometro> getParcometri() {
		return parcometri;
	}

	public void setParcometri(List<Parcometro> parcometri) {
		this.parcometri = parcometri;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Polygon> getGeometry() {
		return geometry;
	}

	public void setGeometry(List<Polygon> geometry) {
		this.geometry = geometry;
	}

}
