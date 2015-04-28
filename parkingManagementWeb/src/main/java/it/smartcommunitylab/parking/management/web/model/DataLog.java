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

import it.smartcommunitylab.parking.management.web.model.geo.Point;

public class DataLog {

	private String id;
	private String objId;
	private Point location;
	private String type;
	private Long updateTime;
	private Integer version;
	private boolean deleted;
	private String content;
	
	public String getId() {
		return id;
	}
	
	public String getObjId() {
		return objId;
	}

	public Point getLocation() {
		return location;
	}
	
	public String getType() {
		return type;
	}
	
	public Long getUpdateTime() {
		return updateTime;
	}
	
	public Integer getVersion() {
		return version;
	}
	
	public boolean isDeleted() {
		return deleted;
	}
	
	public String getContent() {
		return content;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setObjId(String objId) {
		this.objId = objId;
	}
	
	public void setLocation(Point location) {
		this.location = location;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}
	
	public void setVersion(Integer version) {
		this.version = version;
	}
	
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	
	public void setContent(String content) {
		this.content = content;
	}

}
