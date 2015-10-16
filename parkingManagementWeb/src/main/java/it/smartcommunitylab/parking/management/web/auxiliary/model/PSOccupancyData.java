package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.util.List;

public class PSOccupancyData {

	private String pName;
	private String pAddress;
	private FilterPeriod period;
	private List<String> occLC;
	private List<String> occLS;
	private List<String> occP;
	private List<String> occDO;
	
	public String getpName() {
		return pName;
	}

	public String getpAddress() {
		return pAddress;
	}

	public FilterPeriod getPeriod() {
		return period;
	}

	public List<String> getOccLC() {
		return occLC;
	}

	public List<String> getOccLS() {
		return occLS;
	}

	public List<String> getOccP() {
		return occP;
	}

	public List<String> getOccDO() {
		return occDO;
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

	public void setOccLC(List<String> occLC) {
		this.occLC = occLC;
	}

	public void setOccLS(List<String> occLS) {
		this.occLS = occLS;
	}

	public void setOccP(List<String> occP) {
		this.occP = occP;
	}

	public void setOccDO(List<String> occDO) {
		this.occDO = occDO;
	}

	public PSOccupancyData() {
		// TODO Auto-generated constructor stub
	}

	public PSOccupancyData(String pName, String pAddress, FilterPeriod period,
			List<String> occLC, List<String> occLS, List<String> occP,
			List<String> occDO) {
		super();
		this.pName = pName;
		this.pAddress = pAddress;
		this.period = period;
		this.occLC = occLC;
		this.occLS = occLS;
		this.occP = occP;
		this.occDO = occDO;
	}

}
