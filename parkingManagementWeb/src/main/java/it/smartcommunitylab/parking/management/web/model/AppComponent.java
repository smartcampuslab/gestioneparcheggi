package it.smartcommunitylab.parking.management.web.model;

import java.util.List;

public class AppComponent {

	private String id;
	private List<CompAttribute> attributes;
	
	public String getId() {
		return id;
	}
	public List<CompAttribute> getAttributes() {
		return attributes;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setAttributes(List<CompAttribute> attributes) {
		this.attributes = attributes;
	}
	
	

}
