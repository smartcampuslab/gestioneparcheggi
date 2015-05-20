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

import java.util.Map;

public class DayStat {

	protected Map<Byte, StatValue> hours;
	protected StatValue all;
	
	public void insert(byte hour, double value, long timestamp) {
		StatValue stat = hours.get(hour);
		if (stat == null) {
			stat = new StatValue();
			hours.put(hour, stat);
		}
		stat.insert(value, timestamp);
		all.insert(value, timestamp);
	}

	public Map<Byte, StatValue> getHours() {
		return hours;
	}

	public void setHours(Map<Byte, StatValue> hours) {
		this.hours = hours;
	}

	public StatValue getAll() {
		return all;
	}

	public void setAll(StatValue all) {
		this.all = all;
	}

	public void mergeIntoValue(StatValue value) {
		if (all != null) {
			value.merge(all);
		} else if (hours != null) {
			for (StatValue h : hours.values()) {
				value.merge(h);
			}
		}
	}
	
	public StatValue hour(int hour) {
		if(hours != null && hours.containsKey(hour)) return hours.get(hour);
		return null;
	}
}
