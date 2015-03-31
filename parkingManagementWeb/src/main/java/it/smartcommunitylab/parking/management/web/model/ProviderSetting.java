package it.smartcommunitylab.parking.management.web.model;

import java.io.Serializable;
import java.util.List;

public class ProviderSetting implements Serializable {
	
	private static final long serialVersionUID = 8983355436454920646L;
	private String id;
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
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}
	
	/**
	 * @param password the password to set
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
