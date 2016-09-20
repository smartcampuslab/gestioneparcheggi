package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.util.List;

public class PSOccupancyData {

	private String pName;
	private String pAddress;
	private FilterPeriod period;
	private String vehicleType;
	private List<String> occLC;
	private List<String> occLS;
	private List<String> occP;
	private List<String> occDO;
	private List<String> occH;
	private List<String> occR;
	private List<String> occE;
	private List<String> occC_S;
	private List<String> occRO;
	private List<String> occCS;
	private List<String> slotsND;
	
	public String getpName() {
		return pName;
	}

	public String getpAddress() {
		return pAddress;
	}

	public FilterPeriod getPeriod() {
		return period;
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

	public String getVehicleType() {
		return vehicleType;
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

	public List<String> getOccH() {
		return occH;
	}

	public List<String> getOccR() {
		return occR;
	}

	public List<String> getOccE() {
		return occE;
	}

	public List<String> getOccC_S() {
		return occC_S;
	}

	public List<String> getOccRO() {
		return occRO;
	}

	public List<String> getOccCS() {
		return occCS;
	}

	public List<String> getSlotsND() {
		return slotsND;
	}

	public void setVehicleType(String vehicleType) {
		this.vehicleType = vehicleType;
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

	public void setOccH(List<String> occH) {
		this.occH = occH;
	}

	public void setOccR(List<String> occR) {
		this.occR = occR;
	}

	public void setOccE(List<String> occE) {
		this.occE = occE;
	}

	public void setOccC_S(List<String> occC_S) {
		this.occC_S = occC_S;
	}

	public void setOccRO(List<String> occRO) {
		this.occRO = occRO;
	}

	public void setOccCS(List<String> occCS) {
		this.occCS = occCS;
	}

	public void setSlotsND(List<String> slotsND) {
		this.slotsND = slotsND;
	}

	public PSOccupancyData() {
		// TODO Auto-generated constructor stub
	}

	public PSOccupancyData(String pName, String pAddress, FilterPeriod period, String vehicleType, List<String> occLC,
			List<String> occLS, List<String> occP, List<String> occDO, List<String> occH, List<String> occR,
			List<String> occE, List<String> occC_S, List<String> occRO, List<String> occCS, List<String> slotsND) {
		super();
		this.pName = pName;
		this.pAddress = pAddress;
		this.period = period;
		this.vehicleType = vehicleType;
		this.occLC = occLC;
		this.occLS = occLS;
		this.occP = occP;
		this.occDO = occDO;
		this.occH = occH;
		this.occR = occR;
		this.occE = occE;
		this.occC_S = occC_S;
		this.occRO = occRO;
		this.occCS = occCS;
		this.slotsND = slotsND;
	}

	@Override
	public String toString() {
		return "PSOccupancyData [pName=" + pName + ", pAddress=" + pAddress + ", period=" + period + ", vehicleType="
				+ vehicleType + ", occLC=" + occLC + ", occLS=" + occLS + ", occP=" + occP + ", occDO=" + occDO
				+ ", occH=" + occH + ", occR=" + occR + ", occE=" + occE + ", occC_S=" + occC_S + ", occRO=" + occRO
				+ ", occCS=" + occCS + ", slotsND=" + slotsND + "]";
	}

}
