package it.smartcommunitylab.parking.management.web.bean;

import java.util.List;

public class RatePeriodBean {

	private Long from;
	private Long to;
	private List<String> weekDays;
	private String timeSlot;
	private Integer rateValue;	// eurocent
	private String note;
	private boolean holiday;
	
	public Long getFrom() {
		return from;
	}
	
	public Long getTo() {
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
	
	public void setFrom(Long from) {
		this.from = from;
	}
	
	public void setTo(Long to) {
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
