/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package it.smartcommunitylab.parking.management.web.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ObjectShowSetting implements Serializable {
	
	private static final long serialVersionUID = -141511630245469712L;
	private String id;
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
		return "ProviderSetting [id=" + id
				+ ", appId=" + appId + ", mapCenter=" + mapCenter
				+ ", mapZoom=" + mapZoom + ", showObjects=" + showObjects + "]";
	}
	
}	
