package it.smartcommunitylab.parking.management.web.model;

public class AppConf {
	
	private String appId;
	private String mapCenter;
	private String zoom;
	private String showObjects;

	public AppConf() {
		super();
	}
	
	public AppConf(String appId, String mapCenter, String zoom, String showObjects) {
		super();
		this.appId = appId;
		this.mapCenter = mapCenter;
		this.zoom = zoom;
		this.showObjects = showObjects;
	}

	public String getAppId() {
		return appId;
	}

	public String getMapCenter() {
		return mapCenter;
	}
	
	public String getZoom() {
		return zoom;
	}

	public String getShowObjects() {
		return showObjects;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public void setMapCenter(String mapCenter) {
		this.mapCenter = mapCenter;
	}
	
	public void setZoom(String zoom) {
		this.zoom = zoom;
	}

	public void setShowObjects(String showObjects) {
		this.showObjects = showObjects;
	}

	@Override
	public String toString() {
		return "AppConf [appId=" + appId + ", mapCenter=" + mapCenter
				+ ", zoom=" + zoom + ", showObjects=" + showObjects + "]";
	}

	public String toJSON(){
		String json = "{";
		json += "\"appId\":\"" + getAppId() + "\",";
		json += "\"mapCenter\":\"" + getMapCenter() + "\",";
		json += "\"zoom\":" + getZoom() + ",";
		json += "\"showObjects\":\"" + getShowObjects() + "\"";
		json += "}";
		return json;
	}

}
