package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.util.List;

public class PSOccupancyData {

	private String pName;
	private String pAddress;
	private FilterPeriod period;
	private List<String> occSlots;
	private List<String> hSlots;
	private List<String> ndSlots;
	
	public String getpName() {
		return pName;
	}

	public String getpAddress() {
		return pAddress;
	}

	public FilterPeriod getPeriod() {
		return period;
	}

	public List<String> getOccSlots() {
		return occSlots;
	}

	public void setOccSlots(List<String> occSlots) {
		this.occSlots = occSlots;
	}

	public void setpName(String pName) {
		this.pName = pName;
	}

	public void setpAddress(String pAddress) {
		this.pAddress = pAddress;
	}

	public void setPeriod(FilterPeriod period) {
		this.period = period;
	}

	public List<String> getNdSlots() {
		return ndSlots;
	}

	public void setNdSlots(List<String> ndSlots) {
		this.ndSlots = ndSlots;
	}

	public List<String> getHSlots() {
		return hSlots;
	}

	public void setHSlots(List<String> hSlots) {
		this.hSlots = hSlots;
	}

	public PSOccupancyData() {
		// TODO Auto-generated constructor stub
	}

	public PSOccupancyData(String pName, String pAddress, FilterPeriod period,
			List<String> occSlots, List<String> hSlots, List<String> ndSlots) {
		super();
		this.pName = pName;
		this.pAddress = pAddress;
		this.period = period;
		this.occSlots = occSlots;
		this.hSlots = hSlots;
		this.ndSlots = ndSlots;
	}

	@Override
	public String toString() {
		return "PSOccupancyData [pName=" + pName + ", pAddress=" + pAddress
				+ ", period=" + period + ", occSlots=" + occSlots
				+ ", hSlots=" + hSlots + ", ndSlots=" + ndSlots + "]";
	}

}
