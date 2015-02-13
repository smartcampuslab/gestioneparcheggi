package it.smartcommunitylab.parking.management.web.model;

import it.smartcommunitylab.parking.management.web.model.geo.Point;

public class BikePoint {

	private String id;
	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
	private String name;
	private Integer bikeNumber;
	private Integer slotNumber;
	private Point geometry;
	private Long lastChange;

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

	public Integer getBikeNumber() {
		return bikeNumber;
	}

	public void setBikeNumber(Integer bikeNumber) {
		this.bikeNumber = bikeNumber;
	}

	public Integer getSlotNumber() {
		return slotNumber;
	}

	public void setSlotNumber(Integer slotNumber) {
		this.slotNumber = slotNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Point getGeometry() {
		return geometry;
	}

	public void setGeometry(Point geometry) {
		this.geometry = geometry;
	}

	public Long getLastChange() {
		return lastChange;
	}

	public void setLastChange(Long lastChange) {
		this.lastChange = lastChange;
	}

}
