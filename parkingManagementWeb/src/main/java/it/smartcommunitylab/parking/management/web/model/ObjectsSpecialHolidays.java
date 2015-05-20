package it.smartcommunitylab.parking.management.web.model;

import java.io.Serializable;

public class ObjectsSpecialHolidays implements Serializable {

	private static final long serialVersionUID = 1L;
	private String id;
	private Integer year;
	private Integer month;
	private Integer day;
	private boolean workingday;
	
	public String getId() {
		return id;
	}
	
	public Integer getYear() {
		return year;
	}
	
	public Integer getMonth() {
		return month;
	}
	
	public Integer getDay() {
		return day;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setYear(Integer year) {
		this.year = year;
	}
	
	public void setMonth(Integer month) {
		this.month = month;
	}
	
	public void setDay(Integer day) {
		this.day = day;
	}

	public boolean isWorkingday() {
		return workingday;
	}

	public void setWorkingday(boolean workingday) {
		this.workingday = workingday;
	}

	@Override
	public String toString() {
		return "ObjectsSpecialHolidays [id=" + id + ", year="
				+ year + ", month=" + month + ", day=" + day + "]";
	}
	

}
