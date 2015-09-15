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
package it.smartcommunitylab.parking.management.web.repository;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="profitLogBean") 	 	
public class ProfitLogBeanTP {
	
	@Id
	private String id;
	
	private String objId;
	private String type;
	private Long time;
	private Long[] logPeriod;	// used in log with a time period
	private String author;
	private String agency;
	private boolean deleted;
	//new fields added in 12/5/2015 from MB
	private String year;
	private String month;
	private String week_day;
	private String timeSlot;	//time of operation (start a slot of one hour)
	private boolean isHolyday;	//true if is an holyday day (in ita = festivo)
	private boolean isSystemLog;	//true if inserted with the form in parkingManagementWeb app

	private String valueString;

	public ProfitLogBeanTP() {
		super();		
	}

	public ProfitLogBeanTP(String id, String objId, String type, Long time, Long[] logPeriod,
			String author, String agency, boolean deleted, String year, String month,
			String week_day, String timeSlot, boolean isHolyday, boolean isSystemLog,
			String valueString){
		super();
		this.id = id;
		this.objId = objId;
		this.type = type;
		this.time = time;
		this.logPeriod = logPeriod;
		this.author = author;
		this.agency = agency;
		this.deleted = deleted;
		this.year = year;
		this.month = month;
		this.week_day = week_day;
		this.timeSlot = timeSlot;
		this.isHolyday = isHolyday;
		this.isSystemLog = isSystemLog;
		this.valueString = valueString;
	}

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

	public String getAuthor() {
		return author;
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
	
	public String getValueString() {
		return valueString;
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

	public void setAuthor(String author) {
		this.author = author;
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

	@Override
	public String toString() {
		return "ProfitLogBeanTP [id=" + id + ", objId=" + objId + ", type="
				+ type + ", time=" + time + ", logPeriod=" + logPeriod + ", author=" + author + ", deleted="
				+ deleted + ", year=" + year + ", month=" + month
				+ ", week_day=" + week_day + ", timeSlot=" + timeSlot + ", isHolyday=" + isHolyday
				+ ", isSystemLog=" + isSystemLog  + ", agency=" + agency + "]";
	}
	
}
