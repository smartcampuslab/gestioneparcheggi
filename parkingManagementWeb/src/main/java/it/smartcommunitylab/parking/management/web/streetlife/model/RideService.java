package it.smartcommunitylab.parking.management.web.streetlife.model;

public class RideService {

	private String code;
	private String description;
	private int percentage;
	
	public String getCode() {
		return code;
	}
	
	public String getDescription() {
		return description;
	}
	
	public int getPercentage() {
		return percentage;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public void setPercentage(int percentage) {
		this.percentage = percentage;
	}

	public RideService(String code, String description, int percentage) {
		super();
		this.code = code;
		this.description = description;
		this.percentage = percentage;
	}
	
}
