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
import it.smartcommunitylab.parking.management.web.model.geo.Polygon;

public class Zone {
	private String id;
	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
	private String name;		// name
	private String submacro;	// macro zone id
	private String submicro;	// micro zone id	// the composition of name, submacro and submicro have to be unique
	private String type; 		//type of division(geo, green, history, etc)
	private String note;
	private String color;
	private String municipality;
	private Point centermap;
	private Polygon geometry;
	private boolean geometryFromSubelement;
	private Integer slotNumber;	// used in supply csv creation

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
	
	public String getSubmacro() {
		return submacro;
	}

	public void setSubmacro(String submacro) {
		this.submacro = submacro;
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

	public Polygon getGeometry() {
		return geometry;
	}

	public void setGeometry(Polygon geometry) {
		this.geometry = geometry;
	}

	public Integer getSlotNumber() {
		return slotNumber;
	}

	public void setSlotNumber(Integer slotNumber) {
		this.slotNumber = slotNumber;
	}

	public String getSubmicro() {
		return submicro;
	}

	public void setSubmicro(String submicro) {
		this.submicro = submicro;
	}

	public boolean isGeometryFromSubelement() {
		return geometryFromSubelement;
	}

	public void setGeometryFromSubelement(boolean geometryFromSubelement) {
		this.geometryFromSubelement = geometryFromSubelement;
	}

	public String getMunicipality() {
		return municipality;
	}

	public void setMunicipality(String municipality) {
		this.municipality = municipality;
	}

	public Point getCentermap() {
		return centermap;
	}

	public void setCentermap(Point centermap) {
		this.centermap = centermap;
	}

}