package it.smartcommunitylab.parking.management.web.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AppComponent {

	private String id;
	private List<CompAttribute> attributes;
	
	public String getId() {
		return id;
	}
	public List<CompAttribute> getAttributes() {
		return attributes;
	}
	public void setId(String id) {
		this.id = id;
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
			"\"attributes\": \"" + getAttributesString() + "\"" +
			"}";
	}
	
	public Map<String, Object> toMap(){
		Map<String,Object> comp = new HashMap<String,Object>();
		comp.put("id", id);
		comp.put("attributes", getAttributesMap());
		return comp;
	}
	
	
	

}
