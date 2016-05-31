package it.smartcommunitylab.parking.management.web.model;

import java.util.List;

public class RatePeriod {

	private long from;
	private long to;
	private List<String> weekDays;
	private String timeSlot;
	private Float rateValue;
	private String note;
	private boolean isHoliday;
	
	public RatePeriod() {
		// TODO Auto-generated constructor stub
	}

	public long getFrom() {
		return from;
	}

	public long getTo() {
		return to;
	}

	public List<String> getWeekDays() {
		return weekDays;
	}

	public String getTimeSlot() {
		return timeSlot;
	}

	public Float getRateValue() {
		return rateValue;
	}

	public String getNote() {
		return note;
	}

	public boolean isHoliday() {
		return isHoliday;
	}

	public void setFrom(long from) {
		this.from = from;
	}

	public void setTo(long to) {
		this.to = to;
	}

	public void setWeekDays(List<String> weekDays) {
		this.weekDays = weekDays;
	}

	public void setTimeSlot(String timeSlot) {
		this.timeSlot = timeSlot;
	}

	public void setRateValue(Float rateValue) {
		this.rateValue = rateValue;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public void setHoliday(boolean isHoliday) {
		this.isHoliday = isHoliday;
	}

}
