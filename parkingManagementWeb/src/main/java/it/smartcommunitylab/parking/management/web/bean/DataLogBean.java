/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package it.smartcommunitylab.parking.management.web.bean;

import java.util.Map;

public class DataLogBean {

	private String id;
	private String objId;
	//private PointBean location;
	private String type;
	private Long time;
	private Long[] logPeriod;	// used in log with a time period
	private String author;
	private String agency;
	private String userAgencyId;
	private boolean deleted;
	//new fields added in 12/5/2015 from MB
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
	
	public Long getTime() {
		return time;
	}
	
	public boolean isDeleted() {
		return deleted;
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
	
	public void setTime(Long time) {
		this.time = time;
	}
	
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public Map<String, Object> getValue() {
		return value;
	}


	public void setValue(Map<String, Object> value) {
		this.value = value;
	}
	
	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}
	
	// new setter and getter methods added in 12/5/2015 from MB
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
	
	public String getValueString() {
		return valueString;
	}

	public void setValueString(String valueString) {
		this.valueString = valueString;
	}

	public String getAgency() {
		return agency;
	}

	public void setAgency(String agency) {
		this.agency = agency;
	}

	public boolean isSystemLog() {
		return isSystemLog;
	}

	public void setSystemLog(boolean isSystemLog) {
		this.isSystemLog = isSystemLog;
	}

	public Long[] getLogPeriod() {
		return logPeriod;
	}

	public void setLogPeriod(Long[] logPeriod) {
		this.logPeriod = logPeriod;
	}
	
	public String getUserAgencyId() {
		return userAgencyId;
	}

	public void setUserAgencyId(String userAgencyId) {
		this.userAgencyId = userAgencyId;
	}
	
}
