package it.smartcommunitylab.parking.management.web.model;

public class Agency {

	private String id;
	private String name;
	private String description;
	private int reading;	// reading permission: 0 false, 1 true;
	private int editing;	// editing permission: 0 false, 1 true;
	private int creation;	// creation and deleting permission: 0 false, 1 true;
	
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

	public int getReading() {
		return reading;
	}

	public int getEditing() {
		return editing;
	}

	public int getCreation() {
		return creation;
	}

	public void setReading(int reading) {
		this.reading = reading;
	}

	public void setEditing(int editing) {
		this.editing = editing;
	}

	public void setCreation(int creation) {
		this.creation = creation;
	}

}
