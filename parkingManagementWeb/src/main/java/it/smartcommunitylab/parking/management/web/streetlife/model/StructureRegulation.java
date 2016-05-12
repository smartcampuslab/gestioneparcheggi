package it.smartcommunitylab.parking.management.web.streetlife.model;

public class StructureRegulation {

	private String code;
	private String description;
	private float factor;
	
	public String getCode() {
		return code;
	}
	
	public String getDescription() {
		return description;
	}
	
	public float getFactor() {
		return factor;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public void setFactor(float factor) {
		this.factor = factor;
	}

	public StructureRegulation(String code, String description, float factor) {
		super();
		this.code = code;
		this.description = description;
		this.factor = factor;
	}

}
