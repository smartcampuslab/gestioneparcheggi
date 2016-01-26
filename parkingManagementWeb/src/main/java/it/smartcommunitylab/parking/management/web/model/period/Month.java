package it.smartcommunitylab.parking.management.web.model.period;

import java.util.List;

public class Month {

	private int[] month;
	private List<Dow> dows;
	
	public int[] getMonth() {
		return month;
	}

	public List<Dow> getDows() {
		return dows;
	}

	public void setMonth(int[] month) {
		this.month = month;
	}

	public void setDows(List<Dow> dows) {
		this.dows = dows;
	}

	public Month() {
		// TODO Auto-generated constructor stub
	}

	public Month(int[] month, List<Dow> dows) {
		super();
		this.month = month;
		this.dows = dows;
	}
	
}
