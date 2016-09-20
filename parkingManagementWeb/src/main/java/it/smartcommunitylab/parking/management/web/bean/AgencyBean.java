package it.smartcommunitylab.parking.management.web.bean;

public class AgencyBean {

	private String id;
	private String name;
	private String description;
	private int area;	// permissions in area: 0 no, 1 read, 2 update, 3 create-delete;
	private int zone;	// permissions in zone: 0 no, 1 read, 2 update, 3 create-delete;
	private int street;	// permissions in street: 0 no, 1 read, 2 update, 3 create-delete;
	private int structure;	// permissions in ps: 0 no, 1 read, 2 update, 3 create-delete;
	private int parkingmeter;	// permissions in pm: 0 no, 1 read, 2 update, 3 create-delete;
	private int bike;	// permissions in bike: 0 no, 1 read, 2 update, 3 create-delete;
	
	public String getId() {
		return id;
	}
	
	public String getName() {
		return name;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}

	public int getArea() {
		return area;
	}

	public int getZone() {
		return zone;
	}

	public int getStreet() {
		return street;
	}

	public int getStructure() {
		return structure;
	}

	public int getParkingmeter() {
		return parkingmeter;
	}

	public int getBike() {
		return bike;
	}

	public void setArea(int area) {
		this.area = area;
	}

	public void setZone(int zone) {
		this.zone = zone;
	}

	public void setStreet(int street) {
		this.street = street;
	}

	public void setStructure(int structure) {
		this.structure = structure;
	}

	public void setParkingmeter(int parkingmeter) {
		this.parkingmeter = parkingmeter;
	}

	public void setBike(int bike) {
		this.bike = bike;
	}
	
}
