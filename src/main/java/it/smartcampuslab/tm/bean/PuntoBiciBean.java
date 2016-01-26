package it.smartcampuslab.tm.bean;

public class PuntoBiciBean {
	private String id;
	private String name;
	private Integer bikeNumber;
	private Integer slotNumber;
	private PointBean geometry;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

}
