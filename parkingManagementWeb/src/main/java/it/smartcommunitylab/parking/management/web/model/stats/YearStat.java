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

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class YearStat {

	private static final MonthStat EMPTY = new MonthStat();
	
	private String _id;
	
	@Indexed(unique=true)
	private YearStatKey key;
	
	private Map<String,Object> parameters = new HashMap<String, Object>();
	
	private MonthStat all;
	private Map<Byte, MonthStat> months = new HashMap<Byte, MonthStat>();
	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public YearStatKey getKey() {
		return key;
	}
	public void setKey(YearStatKey key) {
		this.key = key;
	}
	public MonthStat getAll() {
		return all == null ? EMPTY : all;
	}
	public void setAll(MonthStat all) {
		this.all = all;
	}
	public Map<Byte, MonthStat> getMonths() {
		return months;
	}
	public void setMonths(Map<Byte, MonthStat> months) {
		this.months = months;
	}
	public Map<String, Object> getParameters() {
		return parameters;
	}
	public void setParameters(Map<String, Object> parameters) {
		this.parameters = parameters;
	}
	public StatValue toStatValue() {
		StatValue value = new StatValue();
		if (all != null) {
			merge(value, all);
		} else if (months != null) {
			for (MonthStat month : months.values()) {
				merge(value, month);
			}
		}
		return value;
	}
	private void merge(StatValue value, MonthStat month) {
		month.mergeIntoValue(value);
	}
	
	public MonthStat month(int month){
		if (months != null && months.containsKey(month)) return months.get(month);
		return new MonthStat();
	}
}
