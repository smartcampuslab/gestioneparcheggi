/*******************************************************************************
 * Copyright 2012-2013 Trento RISE
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
package it.smartcommunitylab.parking.management.web.auxiliary.model;

//import eu.trentorise.smartcampus.presentation.data.BasicObject;

public class GeoObject {	//extends BasicObject

	private String agency;
	private double[] position;
	private String name;
	private String description;
	// Fields from basic object
	private String id;	
	private Long updateTime;
	private Long version;
	private Integer user;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public double[] getPosition() {
		return position;
	}
	public void setPosition(double[] position) {
		this.position = position;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getAgency() {
		return agency;
	}
	public void setAgency(String agency) {
		this.agency = agency;
	}
	public Long getUpdateTime() {
		return updateTime;
	}
	public Long getVersion() {
		return version;
	}
	public Integer getUser() {
		return user;
	}
	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}
	public void setVersion(Long version) {
		this.version = version;
	}
	public void setUser(Integer user) {
		this.user = user;
	}
	
}
