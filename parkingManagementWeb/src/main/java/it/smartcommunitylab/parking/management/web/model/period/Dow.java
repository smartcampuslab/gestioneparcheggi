package it.smartcommunitylab.parking.management.web.model.period;

import java.util.List;

public class Dow {

	private int[] dow;
	private List<Hour> hours;
	
	public int[] getDow() {
		return dow;
	}

	public List<Hour> getHours() {
		return hours;
	}

	public void setDow(int[] dow) {
		this.dow = dow;
	}

	public void setHours(List<Hour> hours) {
		this.hours = hours;
	}

	public Dow() {
		// TODO Auto-generated constructor stub
	}

	public Dow(int[] dow, List<Hour> hours) {
		super();
		this.dow = dow;
		this.hours = hours;
	}

}
