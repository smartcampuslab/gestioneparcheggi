package it.smartcommunitylab.parking.management.web.bean;

public class BikePointBean {
	private String id;
	private String id_app;
	private String name;
	private Integer bikeNumber;
	private Integer slotNumber;
	private PointBean geometry;
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

	public PointBean getGeometry() {
		return geometry;
	}

	public void setGeometry(PointBean geometry) {
		this.geometry = geometry;
	}

	public Long getLastChange() {
		return lastChange;
	}

	public void setLastChange(Long lastChange) {
		this.lastChange = lastChange;
	}
	
	public String toJSON(){
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"id_app\":\"" + getId_app() + "\",";
		json += "\"name\":\"" + getName() + "\",";
		json += "\"geometry\":\"" + getGeometry() + "\",";
		json += "\"slotNumber\":\"" + getSlotNumber() + "\",";
		json += "\"bikeNumber\":\"" + getBikeNumber() + "\",";
		json += "\"lastChange\":\"" + getLastChange() + "\"";
		json += "}";
		return json;
	}

}
