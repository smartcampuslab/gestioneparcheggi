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
package it.smartcommunitylab.parking.management.web.bean;

import it.smartcommunitylab.parking.management.web.model.geo.Polygon;

public class ZoneBean {
	private String id;
	private String id_app;
	private String name;
	private String submacro;
	private String type;
	private String note;
	private String color;
	private PolygonBean geometry;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getId_app() {
		return id_app;
	}

	public void setId_app(String id_app) {
		this.id_app = id_app;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public PolygonBean getGeometry() {
		return geometry;
	}

	public void setGeometry(PolygonBean geometry) {
		this.geometry = geometry;
	}

	public String getSubmacro() {
		return submacro;
	}

	public void setSubmacro(String submacro) {
		this.submacro = submacro;
	}
	
	public Polygon getGeometryObj() {
		
		Polygon pol = new Polygon();
		if(this.geometry != null){
			pol.setPoints(geometry.getPointObjs());
		}
		return pol;
	}

}
