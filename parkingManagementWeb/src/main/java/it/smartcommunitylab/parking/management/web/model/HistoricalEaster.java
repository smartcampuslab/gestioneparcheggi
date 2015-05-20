package it.smartcommunitylab.parking.management.web.model;

public class HistoricalEaster {

	private String id;
	private Integer year;
	private Integer month;
	private Integer day;
	private String easter_date;
	
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
	public String getEaster_date() {
		return easter_date;
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
	public void setEaster_date(String easter_date) {
		this.easter_date = easter_date;
	}

}
