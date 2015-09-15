package it.smartcommunitylab.parking.management.web.bean;

import java.util.Map;

public class ProfitLogBean {

	private String id;
	private String objId;
	private String type;
	//private Long fromTime;
	//private Long toTime;
	private Long time;
	private Long[] logPeriod;
	private String author;
	private String agency;
	private boolean deleted;
	private String year;
	private String month;
	private String week_day;
	private String timeSlot;		//time of operation (start a slot of one hour)
	private boolean isHolyday;		//true if is an holyday day (in ita = festivo)
	private boolean isSystemLog;	//true if inserted with the form in parkingManagementWeb app
	
	private String valueString;
	private Map<String, Object> value;
	
	public String getId() {
		return id;
	}
	
	public String getObjId() {
		return objId;
	}
	
	public String getType() {
		return type;
	}
	
//	public Long getFromTime() {
//		return fromTime;
//	}
//	
//	public Long getToTime() {
//		return toTime;
//	}
	
	public String getAuthor() {
		return author;
	}
	
	public Long getTime() {
		return time;
	}

	public Long[] getLogPeriod() {
		return logPeriod;
	}

	public void setTime(Long time) {
		this.time = time;
	}

	public void setLogPeriod(Long[] logPeriod) {
		this.logPeriod = logPeriod;
	}

	public String getAgency() {
		return agency;
	}
	
	public boolean isDeleted() {
		return deleted;
	}
	
	public String getYear() {
		return year;
	}
	
	public String getMonth() {
		return month;
	}
	
	public String getWeek_day() {
		return week_day;
	}
	
	public String getTimeSlot() {
		return timeSlot;
	}
	
	public boolean isHolyday() {
		return isHolyday;
	}
	
	public boolean isSystemLog() {
		return isSystemLog;
	}
	
	public String getValueString() {
		return valueString;
	}
	
	public Map<String, Object> getValue() {
		return value;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setObjId(String objId) {
		this.objId = objId;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
//	public void setFromTime(Long fromTime) {
//		this.fromTime = fromTime;
//	}
//	
//	public void setToTime(Long toTime) {
//		this.toTime = toTime;
//	}
	
	public void setAuthor(String author) {
		this.author = author;
	}
	
	public void setAgency(String agency) {
		this.agency = agency;
	}
	
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	
	public void setYear(String year) {
		this.year = year;
	}
	
	public void setMonth(String month) {
		this.month = month;
	}
	
	public void setWeek_day(String week_day) {
		this.week_day = week_day;
	}
	
	public void setTimeSlot(String timeSlot) {
		this.timeSlot = timeSlot;
	}
	
	public void setHolyday(boolean isHolyday) {
		this.isHolyday = isHolyday;
	}
	
	public void setSystemLog(boolean isSystemLog) {
		this.isSystemLog = isSystemLog;
	}
	
	public void setValueString(String valueString) {
		this.valueString = valueString;
	}
	
	public void setValue(Map<String, Object> value) {
		this.value = value;
	}

}
