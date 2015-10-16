package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.util.List;

public class SOccupancyData {

	private String sName;
	private String sArea;
	private FilterPeriod period;
	private List<String> occLC;
	private List<String> occLS;
	private List<String> occP;
	private List<String> occDO;
	
	public String getsName() {
		return sName;
	}

	public String getsArea() {
		return sArea;
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

	public void setsName(String sName) {
		this.sName = sName;
	}

	public void setsArea(String sArea) {
		this.sArea = sArea;
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

	public SOccupancyData() {
		// TODO Auto-generated constructor stub
	}

	public SOccupancyData(String sName, String sArea, FilterPeriod period,
			List<String> occLC, List<String> occLS, List<String> occP,
			List<String> occDO) {
		super();
		this.sName = sName;
		this.sArea = sArea;
		this.period = period;
		this.occLC = occLC;
		this.occLS = occLS;
		this.occP = occP;
		this.occDO = occDO;
	}

	@Override
	public String toString() {
		return "SOccupancyData [sName=" + sName + ", sArea=" + sArea
				+ ", period=" + period + ", occLC=" + occLC + ", occLS="
				+ occLS + ", occP=" + occP + ", occDO=" + occDO + "]";
	}

}
