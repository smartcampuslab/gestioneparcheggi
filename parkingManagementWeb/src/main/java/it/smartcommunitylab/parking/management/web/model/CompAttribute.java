package it.smartcommunitylab.parking.management.web.model;

import java.util.HashMap;
import java.util.Map;

public class CompAttribute {

	private String code;
	private boolean editable;
	private boolean required;
	private boolean visible;

	public String getCode() {
		return code;
	}

	public boolean isEditable() {
		return editable;
	}

	public boolean isRequired() {
		return required;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public void setEditable(boolean editable) {
		this.editable = editable;
	}

	public void setRequired(boolean required) {
		this.required = required;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}
	
	public String toJson(){
		return "{" +
			"\"code\": \"" + code + "\"," +
			"\"editable\": \"" + editable + "\"," +
			"\"required\": \"" + required + "\"," +
			"\"visible\": \"" + visible + "\"" +
			"}";
	}
	
	public Map<String, Object> toMap(){
		Map<String,Object> attrib = new HashMap<String,Object>();
		attrib.put("code", code);
		attrib.put("editable", editable);
		attrib.put("required", required);
		attrib.put("visible", visible);
		return attrib;
	}
	

}
