package it.smartcommunitylab.parking.management.web.model;

import it.smartcommunitylab.parking.management.web.model.geo.Polygon;

import java.util.List;

public class RateArea {
	private String id;
	private String name;
	private Float fee;
	private String timeSlot;
	private String smsCode;
	private String color;
	private List<Polygon> geometry;

	private List<Street> streets;
	private List<ParkingMeter> parkingMeters;

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

	public List<Street> getStreets() {
		return streets;
	}

	public void setStreets(List<Street> streets) {
		this.streets = streets;
	}

	public List<ParkingMeter> getParkingMeters() {
		return parkingMeters;
	}

	public void setParkingMeters(List<ParkingMeter> parkingMeters) {
		this.parkingMeters = parkingMeters;
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
