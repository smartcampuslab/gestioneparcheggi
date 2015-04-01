package it.smartcommunitylab.parking.management.web.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ProviderSetting implements Serializable {
	
	private static final long serialVersionUID = 8983355436454920646L;
	private String id;
	private String user;
    private String password;
    private String appId;
  	private String mapCenter;
  	private String mapZoom;
    
    private List<AppComponent> showObjects;
    
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	
	/**
	 * @return the user
	 */
	public String getUser() {
		return user;
	}
	
	/**
	 * @param user: the user to set
	 */
	public void setUser(String user) {
		this.user = user;
	}
	
	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}
	
	/**
	 * @param password: the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	public String getAppId() {
		return appId;
	}

	public String getMapCenter() {
		return mapCenter;
	}

	public String getMapZoom() {
		return mapZoom;
	}

	public List<AppComponent> getShowObjects() {
		return showObjects;
	}
	
	public String getShowObjectsString() {
		String objToShow = "{";
		for(int i = 0; i < showObjects.size(); i++){
			if(i < showObjects.size() - 1){
				objToShow += showObjects.get(i).toJson() + ",";
			} else {
				objToShow += showObjects.get(i).toJson();
			}
		}
		objToShow += "}";
		return objToShow;
	}
	
	public List<Map> getShowObjectsMap() {
		List<Map> showObjs = new ArrayList<Map>();
		for(int i = 0; i < showObjects.size(); i++){
			showObjs.add(showObjects.get(i).toMap());
		}
		return showObjs;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public void setMapCenter(String mapCenter) {
		this.mapCenter = mapCenter;
	}

	public void setMapZoom(String mapZoom) {
		this.mapZoom = mapZoom;
	}

	public void setShowObjects(List<AppComponent> showObjects) {
		this.showObjects = showObjects;
	}

	@Override
	public String toString() {
		return "ProviderSetting [id=" + id + ", password=" + password
				+ ", appId=" + appId + ", mapCenter=" + mapCenter
				+ ", mapZoom=" + mapZoom + ", showObjects=" + showObjects + "]";
	}
	
}	
