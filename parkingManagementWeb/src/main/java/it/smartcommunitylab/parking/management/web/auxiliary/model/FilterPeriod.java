package it.smartcommunitylab.parking.management.web.auxiliary.model;

public class FilterPeriod {

	private String year;
	private String[] month;
	private String[] dows;
	private String[] hours;
	

	public String getYear() {
		return year;
	}

	public String[] getMonth() {
		return month;
	}

	public String[] getDows() {
		return dows;
	}

	public String[] getHours() {
		return hours;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public void setMonth(String[] month) {
		this.month = month;
	}

	public void setDows(String[] dows) {
		this.dows = dows;
	}

	public void setHours(String[] hours) {
		this.hours = hours;
	}

	public FilterPeriod(String year, String[] month, String[] dows, String[] hours) {
		super();
		this.year = year;
		this.month = month;
		this.dows = dows;
		this.hours = hours;
	}

	public FilterPeriod() {
		// TODO Auto-generated constructor stub
	}

}
