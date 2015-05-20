package it.smartcommunitylab.parking.management.web.model;

import java.io.Serializable;

public class ObjectsItaHolidays implements Serializable{
	
	private static final long serialVersionUID = -1108841158751326649L;
	private String id;
	private String appId;
  	private Integer day;
  	private Integer month;
	
  	
	public String getAppId() {
		return appId;
	}

	public Integer getDay() {
		return day;
	}

	public Integer getMonth() {
		return month;
	}

	public String getId() {
		return id;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public void setDay(Integer day) {
		this.day = day;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Override
	public String toString() {
		return "ObjectsItaHolidays [appId=" + appId + ", day=" + day
				+ ", month=" + month + ", id=" + id + "]";
	}


}
