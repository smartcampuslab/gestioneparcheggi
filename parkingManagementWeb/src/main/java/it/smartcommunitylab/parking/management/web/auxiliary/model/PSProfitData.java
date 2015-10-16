package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.util.List;

public class PSProfitData {
	
	private String pName;
	private String pAddress;
	private FilterPeriod period;
	private List<String> profitVals;
	private List<String> tickets;

	public String getpName() {
		return pName;
	}

	public String getpAddress() {
		return pAddress;
	}

	public FilterPeriod getPeriod() {
		return period;
	}

	public List<String> getProfitVals() {
		return profitVals;
	}

	public List<String> getTickets() {
		return tickets;
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

	public void setProfitVals(List<String> profitVals) {
		this.profitVals = profitVals;
	}

	public void setTickets(List<String> tickets) {
		this.tickets = tickets;
	}

	public PSProfitData() {
		// TODO Auto-generated constructor stub
	}

	public PSProfitData(String pName, String pAddress, FilterPeriod period,
			List<String> profitVals, List<String> tickets) {
		super();
		this.pName = pName;
		this.pAddress = pAddress;
		this.period = period;
		this.profitVals = profitVals;
		this.tickets = tickets;
	}

	@Override
	public String toString() {
		return "PSProfitData [pName=" + pName + ", pAddress=" + pAddress
				+ ", period=" + period + ", profitVals=" + profitVals
				+ ", tickets=" + tickets + "]";
	}
	

}
