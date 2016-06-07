package it.smartcommunitylab.parking.management.web.model;

import java.util.List;

public class RatePeriod {
	private String from;
	private String to;
	private List<String> weekDays;
	private String timeSlot;
	private Integer rateValue;
	private String note;
	private boolean holiday;

	public String getFrom() {
		return from;
	}

	public String getTo() {
		return to;
	}

	public List<String> getWeekDays() {
		return weekDays;
	}

	public String getTimeSlot() {
		return timeSlot;
	}

	public Integer getRateValue() {
		return rateValue;
	}

	public String getNote() {
		return note;
	}

	public boolean isHoliday() {
		return holiday;
	}

	public void setFrom(String from) {
		this.from = from;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public void setWeekDays(List<String> weekDays) {
		this.weekDays = weekDays;
	}

	public void setTimeSlot(String timeSlot) {
		this.timeSlot = timeSlot;
	}

	public void setRateValue(Integer rateValue) {
		this.rateValue = rateValue;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public void setHoliday(boolean holiday) {
		this.holiday = holiday;
	}

}
