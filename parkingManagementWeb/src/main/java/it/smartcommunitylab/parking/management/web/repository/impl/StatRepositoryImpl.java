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
package it.smartcommunitylab.parking.management.web.repository.impl;

import it.smartcommunitylab.parking.management.web.model.stats.StatKey;
import it.smartcommunitylab.parking.management.web.model.stats.StatValue;
import it.smartcommunitylab.parking.management.web.model.stats.YearStat;
import it.smartcommunitylab.parking.management.web.repository.StatCustomRepository;
import it.smartcommunitylab.parking.management.web.repository.StatRepository;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Field;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

public class StatRepositoryImpl implements StatCustomRepository {


    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private StatRepository repository;

	public Map<StatKey, StatValue> findStats(String objectId, String appId, String type, Map<String, Object> params,
			int[] years, byte[] months, byte[] days, byte[] hours) {
		
		Query query = null;
		if (days == null || days.length == 0) {
			query = createQuery(objectId, appId, type, params, years, months, days, true, true, hours);
		} else {
			query = createQuery(objectId, appId, type, params, years, months, days, false, false, hours);
		} 
		List<YearStat> stats = mongoTemplate.find(query, YearStat.class);
		return toMap(stats);
	}

	public Map<StatKey, StatValue> findStatsWD(String objectId, String appId,
			String type, Map<String, Object> params, int[] years, byte[] months, byte[] hours) {
		Query query = createQuery(objectId, appId, type, params, years, months, null, true, false, hours);
		List<YearStat> stats = mongoTemplate.find(query, YearStat.class);
		return toMap(stats);
	}

	public Map<StatKey, StatValue> findStatsWE(String objectId, String appId,
			String type, Map<String, Object> params, int[] years, byte[] months, byte[] hours) {
		Query query = createQuery(objectId, appId, type, params, years, months, null, false, true, hours);
		List<YearStat> stats = mongoTemplate.find(query, YearStat.class);
		return toMap(stats);
	}

	public Map<StatKey, StatValue> findLastValue(String objectId, String appId,
			String type, Map<String, Object> params, int[] years, byte[] months, byte[] days, byte[] hours) 
	{
		return findStats(objectId, appId, type, params, years, months, days, hours);
	}

	public Map<StatKey, StatValue> findLastValueWD(String objectId, String appId, String type, Map<String, Object> params, int[] years, byte[] months, byte[] hours) {
		return findStatsWD(objectId, appId, type, params, years, months, hours);
	}

	public Map<StatKey, StatValue> findLastValueWE(String objectId, String appId,
			String type, Map<String, Object> params, int[] years, byte[] months, byte[] hours) {
		return findStatsWE(objectId, appId, type, params, years, months, hours);
	}

	public void updateStats(String objectId, String appId, String type, Map<String, Object> params, double value, long timestamp) {
		StatValue stat = new StatValue(1, value, value, timestamp);
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(timestamp);
		boolean isHoliday = isHoliday(c);
		int month = c.get(Calendar.MONTH);
		int dow = c.get(Calendar.DAY_OF_WEEK);
		int hour = c.get(Calendar.HOUR_OF_DAY);
		String w = isHoliday ? "we":"wd";
		
		Criteria criteria = Criteria
				.where("key.objectId").is(objectId)
				.and("key.appId").is(appId)
				.and("key.type").is(type)
				.and("key.year").is(c.get(Calendar.YEAR));
		
		Query query = Query.query(criteria);
		// - update: year, month, day, hour
		String q1 = "months."+month+".days."+dow+".hours."+hour;
		// - update: year, month, day, all
		String q2 = "months."+month+".days."+dow+".all";
		// - update: year, month, wd/we, hour
		String q3 = "months."+month+"."+w+".hours."+hour;
		// - update: year, month, wd/we, all
		String q4 = "months."+month+"."+w+".all";
		// - update: year, all, day, hour
		String q5 = "all.days."+dow+".hours."+hour;
		// - update: year, all, day, all
		String q6 = "all.days."+dow+".all";
		// - update: year, all, wd/we, hour
		String q7 = "all."+w+".hours."+hour;
		// - update: year, all, wd/we, all
		String q8 = "all."+w+".all";
		
		query.fields().include(q1);
		query.fields().include(q2);
		query.fields().include(q3);
		query.fields().include(q4);
		query.fields().include(q5);
		query.fields().include(q6);
		query.fields().include(q7);
		query.fields().include(q8);
		
		YearStat yearStat = mongoTemplate.findOne(query, YearStat.class);
		
		Update update = new Update();
		if (params != null && !params.isEmpty()) {
			update.addToSet("parameters", params);
		}
		
		StatValue stat1 = stat.copy();
		if (yearStat != null && yearStat.month(month).day(dow).hour(hour) != null){
			stat1.merge(yearStat.month(month).day(dow).hour(hour));
		}
		update.set(q1, stat1);

		StatValue stat2 = stat.copy();
		if (yearStat != null && yearStat.month(month).day(dow).getAll() != null){
			stat2.merge(yearStat.month(month).day(dow).getAll());
		}
		update.set(q2, stat2);
		
		StatValue stat3 = stat.copy();
		if (isHoliday && yearStat != null && yearStat.month(month).getWe().hour(hour) != null){
			stat3.merge(yearStat.month(month).getWe().hour(hour));
		} else if (!isHoliday && yearStat != null && yearStat.month(month).getWd().hour(hour) != null){
			stat3.merge(yearStat.month(month).getWd().hour(hour));
		}
		update.set(q3, stat3);

		StatValue stat4 = stat.copy();
		if (isHoliday && yearStat != null && yearStat.month(month).getWe().getAll() != null){
			stat4.merge(yearStat.month(month).getWe().getAll());
		} else if (!isHoliday && yearStat != null && yearStat.month(month).getWd().getAll() != null){
			stat4.merge(yearStat.month(month).getWd().getAll());
		}
		update.set(q4, stat4);

		StatValue stat5 = stat.copy();
		if (yearStat != null && yearStat.getAll().day(dow).hour(hour) != null){
			stat5.merge(yearStat.getAll().day(dow).hour(hour));
		}
		update.set(q5, stat5);

		StatValue stat6 = stat.copy();
		if (yearStat != null && yearStat.getAll().day(dow).getAll() != null){
			stat6.merge(yearStat.getAll().day(dow).getAll());
		}
		update.set(q6, stat6);
		
		StatValue stat7 = stat.copy();
		if (isHoliday && yearStat != null && yearStat.getAll().getWe().hour(hour) != null){
			stat7.merge(yearStat.getAll().getWe().hour(hour));
		} else if (!isHoliday && yearStat != null && yearStat.getAll().getWd().hour(hour) != null){
			stat7.merge(yearStat.getAll().getWd().hour(hour));
		}
		update.set(q7, stat7);

		StatValue stat8 = stat.copy();
		if (isHoliday && yearStat != null && yearStat.getAll().getWe().getAll() != null){
			stat8.merge(yearStat.getAll().getWe().getAll());
		} else if (!isHoliday && yearStat != null && yearStat.getAll().getWd().getAll() != null){
			stat8.merge(yearStat.getAll().getWd().getAll());
		}
		update.set(q8, stat8);

		mongoTemplate.upsert(Query.query(criteria), update, YearStat.class);
	}

	private boolean isHoliday(Calendar c) {
		// TODO
		return c.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY;
	}

	private Query createQuery(
			String objectId, 
			String appId, 
			String type,
			Map<String, Object> params,
			int[] years, 
			byte[] months, 
			byte[] days, 
			boolean wd, 
			boolean we,
			byte[] hours) 
	{
		Criteria res = new Criteria("key.appId").is(appId).and("key.type").is(type);
		if (params != null && !params.isEmpty()) {
			for (String key : params.keySet())
				res.and("parameters."+key).is(params.get(key));
		}
		
		Query query = new Query();
		query.addCriteria(res);
		query.fields().include("key");

		if (objectId != null) {
			res.and("key.objectId").is(objectId);
		}
		if (years != null && years.length > 0) {
			if (years.length == 1) res.and("key.year").is(years[0]);
			else {
				List<Integer> list =new ArrayList<Integer>();
				for (int i : years) list.add(i);
				res.and("key.year").in(list);
			}
		}

		List<String> monthKeys = new ArrayList<String>();
		if (months != null && months.length > 0) {
			for (byte month : months) {
				monthKeys.add("months."+month);
			}
		} else {
			monthKeys.add("all");
		}	
		
		List<String> dayKeys = new ArrayList<String>();
		if (days != null && days.length > 0) {
			for (byte day : days) {
				dayKeys.add("days."+day);
			}
		} else {
			if (wd) {
				dayKeys.add("wd");
			}
			if (we) {
				dayKeys.add("we");
			}
		}
		List<String> hourKeys = new ArrayList<String>();
		if (hours != null && hours.length > 0) {
			for (byte hour : hours) {
				hourKeys.add("hours."+hour);
			}
		} else {
			hourKeys.add("all");
		}
		mergeFields(monthKeys, dayKeys, hourKeys, query.fields());
		return query;
	}

	private void mergeFields(List<String> monthKeys, List<String> dayKeys, List<String> hourKeys, Field fields) {
		for (String mKey : monthKeys) {
			for (String dKey : dayKeys) {
				for (String hKey : hourKeys) {
					fields.include(mKey + "." + dKey + "." + hKey);
				}
			}
		}
	}

	private Map<StatKey, StatValue> toMap(List<YearStat> stats) {
		Map<StatKey, StatValue> map = new HashMap<StatKey, StatValue>();
		for (YearStat stat : stats) {
			StatKey key = stat.getKey().toStatKey();
			StatValue value = stat.toStatValue();
			map.put(key, value.merge(map.get(key)));
		}
		for (StatKey key : map.keySet()) {
			if (map.get(key).empty()) map.remove(key);
		}
		return map;
	}
    
}
