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
package it.smartcommunitylab.parking.management.web.model.stats;

import java.util.HashMap;
import java.util.Map;


public class MonthStat {

	private static final DayStat EMPTY = new DayStat();

	private DayStat wd;
	private DayStat we;
	private Map<Byte, DayStat> days = new HashMap<Byte, DayStat>();
	
	public DayStat getWd() {
		return wd == null ? EMPTY : wd;
	}
	public void setWd(DayStat wd) {
		this.wd = wd;
	}
	public DayStat getWe() {
		return we == null ? EMPTY : we;
	}
	public void setWe(DayStat we) {
		this.we = we;
	}
	public Map<Byte, DayStat> getDays() {
		return days;
	}
	public void setDays(Map<Byte, DayStat> days) {
		this.days = days;
	}
	public void mergeIntoValue(StatValue value) {
		if (wd != null || we != null) {
			if (wd != null) wd.mergeIntoValue(value);
			if (we != null) we.mergeIntoValue(value);
		} else if (days != null) {
			for (DayStat day : days.values()) {
				day.mergeIntoValue(value);
			}
		}
	}
	public DayStat day(int day) {
		if (days != null && days.containsKey((byte)day)) return days.get((byte)day);	// MB31072015: forced cast to byte to retrieve the correct object
		return new DayStat();
	}
	
}
