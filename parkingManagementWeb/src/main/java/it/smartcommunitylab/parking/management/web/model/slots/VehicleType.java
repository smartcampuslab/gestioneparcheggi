package it.smartcommunitylab.parking.management.web.model.slots;

import java.util.HashMap;
import java.util.Map;

public class VehicleType {

	private String name;
	private String appId;
	private String userName;
	private String description;
	private String language_key;
	
	public VehicleType() {
		super();
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public String getLanguage_key() {
		return language_key;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setLanguage_key(String language_key) {
		this.language_key = language_key;
	}

	public String getAppId() {
		return appId;
	}

	public String getUserName() {
		return userName;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public Map<String, Object> toMap(){
		Map<String,Object> comp = new HashMap<String,Object>();
		comp.put("name", name);
		comp.put("appId", appId);
		comp.put("userName", userName);
		comp.put("description", description);
		comp.put("language_key", language_key);
		return comp;
	}

}
