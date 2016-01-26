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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AppComponent {

	private String id;
	private String type;
	private String label;
	private String title;
	private List<CompAttribute> attributes;
	
	public String getId() {
		return id;
	}
	public String getType() {
		return type;
	}
	public String getLabel() {
		return label;
	}
	public String getTitle() {
		return title;
	}
	public List<CompAttribute> getAttributes() {
		return attributes;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setType(String type) {
		this.type = type;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public void setAttributes(List<CompAttribute> attributes) {
		this.attributes = attributes;
	}
	
	public String getAttributesString(){
		String listAttr = "{";
		for(int i = 0; i < attributes.size(); i++){
			if(i <  attributes.size() - 1){
				listAttr += attributes.get(i).toJson() + ",";
			} else {
				listAttr += attributes.get(i).toJson();
			}
		}
		listAttr += "}";
		return listAttr;
	}
	
	@SuppressWarnings("rawtypes")
	public List<Map> getAttributesMap(){
		List<Map> attList = new ArrayList<Map>();
		for(int i = 0; i < attributes.size(); i++){
			attList.add(attributes.get(i).toMap());
		}
		return attList;
	}
	
	public String toJson(){
		return "{" +
			"\"id\": \"" + id + "\"," +
			"\"type\": \"" + type + "\"," +
			"\"label\": \"" + label + "\"," +
			"\"title\": \"" + title + "\"," +
			"\"attributes\": \"" + getAttributesString() + "\"" +
			"}";
	}
	
	public Map<String, Object> toMap(){
		Map<String,Object> comp = new HashMap<String,Object>();
		comp.put("id", id);
		comp.put("type", type);
		comp.put("label", label);
		comp.put("title", title);
		comp.put("attributes", getAttributesMap());
		return comp;
	}
	
	
	

}
