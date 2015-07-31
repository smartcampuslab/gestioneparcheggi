package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.io.Serializable;

public class ParkMeter implements Serializable{
	private static final long serialVersionUID = 8076535734041609036L;

	// From GeoObject
	private String id;
	private String agency;
	private double[] position;
	private String code;
	private String note;
	private String status;
	// Fields from basic object
	private Long updateTime;
	private Integer user;
	private String areaId;
	
	private int profit;	// in eurocent

	public String getId() {
		return id;
	}

	public String getAgency() {
		return agency;
	}

	public double[] getPosition() {
		return position;
	}

	public String getCode() {
		return code;
	}

	public String getNote() {
		return note;
	}

	public String getStatus() {
		return status;
	}

	public Long getUpdateTime() {
		return updateTime;
	}

	public Integer getUser() {
		return user;
	}

	public int getProfit() {
		return profit;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setAgency(String agency) {
		this.agency = agency;
	}

	public void setPosition(double[] position) {
		this.position = position;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

	public void setUser(Integer user) {
		this.user = user;
	}

	public void setProfit(int profit) {
		this.profit = profit;
	}

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}

	public String toJSON() {
		String json = "{";
		json += "\"id\":\"" + getId() + "\",";
		json += "\"updateTime\":" + getUpdateTime() + ",";
		json += "\"user\":\"" + getUser() + "\",";
		json += "\"agency\":\"" + getAgency() + "\",";
		if(getPosition() != null && getPosition().length > 0){
			double[] pos = getPosition();
			json += "\"position\":[" + pos[0] +  "," + pos[1] + "],";		
		} else {
			json += "\"position\":[],";
		}
		json += "\"code\":\"" + getCode() + "\",";
		json += "\"note\":\"" + getNote() + "\",";
		json += "\"status\":\"" + getStatus() + "\",";
		json += "\"areaId\":\"" + getAreaId() + "\",";
		json += "\"profit\":" + getProfit() + "";
		json += "}";
		return json;
	}

}
