package it.smartcommunitylab.parking.management.web.model.period;

import java.util.List;

public class Year {

	private int[] year;
	private List<Month> months;
	
	public int[] getYear() {
		return year;
	}

	public List<Month> getMonths() {
		return months;
	}

	public void setYear(int[] year) {
		this.year = year;
	}

	public void setMonths(List<Month> months) {
		this.months = months;
	}

	public Year() {
		// TODO Auto-generated constructor stub
	}

	public Year(int[] year, List<Month> months) {
		super();
		this.year = year;
		this.months = months;
	}

}
