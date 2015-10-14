package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.util.List;

public class PMProfitData {
	
	private String pCode;
	private String pNote;
	private FilterPeriod period;
	private List<String> profitVals;
	private List<String> tickets;

	
	public String getpCode() {
		return pCode;
	}

	public String getpNote() {
		return pNote;
	}

	public List<String> getProfitVals() {
		return profitVals;
	}

	public List<String> getTickets() {
		return tickets;
	}

	public void setpCode(String pCode) {
		this.pCode = pCode;
	}

	public void setpNote(String pNote) {
		this.pNote = pNote;
	}

	public void setProfitVals(List<String> profitVals) {
		this.profitVals = profitVals;
	}

	public void setTickets(List<String> tickets) {
		this.tickets = tickets;
	}

	public FilterPeriod getPeriod() {
		return period;
	}

	public void setPeriod(FilterPeriod period) {
		this.period = period;
	}

	public PMProfitData() {
		// TODO Auto-generated constructor stub
	}

	public PMProfitData(String pCode, String pNote, FilterPeriod period, List<String> profitVals,
			List<String> tickets) {
		super();
		this.pCode = pCode;
		this.pNote = pNote;
		this.period = period;
		this.profitVals = profitVals;
		this.tickets = tickets;
	}

	@Override
	public String toString() {
		return "PMProfitData [pCode=" + pCode + ", pNote=" + pNote
				+ ", period=" + period + ", profitVals=" + profitVals
				+ ", tickets=" + tickets + "]";
	}

}
