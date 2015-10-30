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

import it.smartcommunitylab.parking.management.web.model.ObjectsHolidays;
import it.smartcommunitylab.parking.management.web.model.ObjectsSpecialHolidays;
import it.smartcommunitylab.parking.management.web.model.stats.StatKey;
import it.smartcommunitylab.parking.management.web.model.stats.StatValue;
import it.smartcommunitylab.parking.management.web.model.stats.YearStat;
import it.smartcommunitylab.parking.management.web.repository.StatCustomRepository;
import it.smartcommunitylab.parking.management.web.repository.StatRepository;
import it.smartcommunitylab.parking.management.web.security.ObjectsHolidaysSetup;
import it.smartcommunitylab.parking.management.web.security.ObjectsSpecialHolidaysSetup;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
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

	@Autowired
	private ObjectsHolidaysSetup objectItaHolidays;

	@Autowired
	private ObjectsSpecialHolidaysSetup objectHistoricalEaster;
	
	private static final Logger logger = Logger.getLogger(StatRepositoryImpl.class);
	
	private static final long MILLISINHOUR = 3600000L;
	private static final long MILLISINDAY = 86400000L;
	private static final long MILLISINMONTH = 2629743830L;
	private static final long MAXMILLISINAMONTH = 2678400000L;
	private static final long MILLISINYEAR = 31556926000L;
    
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
		//logger.info(String.format("objectId: %s, appId: %s, type: %s", objectId, appId, type));
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
		StatValue stat = new StatValue(1, value, value, timestamp); //value,
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(timestamp);
		//boolean isHoliday = isHoliday(c, appId);
		boolean isHoliday = isAHoliday(c, appId);
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
	
	/**
	 * updateDirectPeriodStats: used to update a specific period value stat (direct specific)
	 * @param objectId: id of the object to update
	 * @param appId: agency id of the object
	 * @param type: type of the object
	 * @param params: passed params for specific query
	 * @param value: value to insert in the stat data
	 * @param timestamp: timestamp of the log
	 * @param p_type: type of period to consider: 1 year; 2 month; 3 dow; 4 hour
	 */
	public void updateDirectPeriodStats(String objectId, String appId, String type, Map<String, Object> params, double value, long timestamp, int p_type) {
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(timestamp);
		//boolean isHoliday = isHoliday(c, appId);
		boolean isHoliday = isAHoliday(c, appId);
		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH);
		int dow = c.get(Calendar.DAY_OF_WEEK);
		int hour = c.get(Calendar.HOUR_OF_DAY);
		String w = isHoliday ? "we":"wd";
		
		double[] splittedVal = new double[3];
		switch (p_type){
			case 1:
				// year period value
				if(type.contains(it.smartcommunitylab.parking.management.web.auxiliary.model.Street.class.getCanonicalName()) || type.contains(it.smartcommunitylab.parking.management.web.auxiliary.model.Parking.class.getCanonicalName())){
					findAndUpdateStatsComposed(objectId, appId, type, params, value, timestamp, 4, year, 0, 0, 0, "wd", false);
					findAndUpdateStatsComposed(objectId, appId, type, params, value, timestamp, 4, year, 0, 0, 0, "we", true);
				} else {
					splittedVal = getSplittedDayTypeValue(value, 1);
					double corrValWd = splittedVal[0];
					double corrValWe = splittedVal[1] + splittedVal[2];
					findAndUpdateStatsComposed(objectId, appId, type, params, corrValWd, timestamp, 4, year, 0, 0, 0, "wd", false);
					findAndUpdateStatsComposed(objectId, appId, type, params, corrValWe, timestamp, 4, year, 0, 0, 0, "we", true);
				}
				break;
			case 2: 
				// month period value
				if(type.contains(it.smartcommunitylab.parking.management.web.auxiliary.model.Street.class.getCanonicalName()) || type.contains(it.smartcommunitylab.parking.management.web.auxiliary.model.Parking.class.getCanonicalName())){
					findAndUpdateStatsComposed(objectId, appId, type, params, value, timestamp, 3, year, month, 0, 0, "wd", false);
					findAndUpdateStatsComposed(objectId, appId, type, params, value, timestamp, 3, year, month, 0, 0, "we", true);
				} else {
					splittedVal = getSplittedDayTypeValue(value, 1);
					double corrValWd = splittedVal[0];
					double corrValWe = splittedVal[1] + splittedVal[2];
					findAndUpdateStatsComposed(objectId, appId, type, params, corrValWd, timestamp, 3, year, month, 0, 0, "wd", false);
					findAndUpdateStatsComposed(objectId, appId, type, params, corrValWe, timestamp, 3, year, month, 0, 0, "we", true);
				}
				break;
			case 3: 
				// day period value
				findAndUpdateStatsComposed(objectId, appId, type, params, value, timestamp, 2, year, month, dow, 0, w, isHoliday);
				break;
			case 4: 
				// hour period value
				findAndUpdateStatsComposed(objectId, appId, type, params, value, timestamp, 1, year, month, dow, hour, w, isHoliday);
				break;
			default: 
				break;
		}
	}	
	
	public void updateStatsPeriod(String objectId, String appId, String type, Map<String, Object> params, double value, long timestamp, long[] period, int valtype) {
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(timestamp);
		boolean isHoliday = false;
		String w = "wd";
		
		// params for profit value in period
		boolean isHoursPeriodVal = false;
		boolean isDowsPeriodVal = false;
		boolean isMonthsPeriodVal = false;
		boolean isYearsPeriodVal = false;
		
		Calendar cStart = Calendar.getInstance();
		Calendar cEnd = Calendar.getInstance();
		Long difference = 0L;
		int[] years = new int[0];
		int[] months = new int[0];
		int[] dows = new int[0];
		int[] hours = new int[0];
		int[][] dhours = new int[0][0];	// used when I have hours from 2 days
		int[][] mdows = new int[0][0];	// used when I have days from 2 months
		int[][] ymonths = new int[0][0];	// used when I have days from 2 months
		if(period != null && period.length == 2){
			cStart.setTimeInMillis(period[0]);
			cEnd.setTimeInMillis(period[1]);
			difference = cEnd.getTimeInMillis() - cStart.getTimeInMillis();
			if(difference < MILLISINDAY){
				// in a single day
				// I split the value in the differents hours contained in the period
				Long startMillis = cStart.getTimeInMillis();
				Calendar tmp = Calendar.getInstance();
				int i = 0;
				int a = 0;
				int hourNum = (int)Math.floor(difference / MILLISINHOUR);
				if(valtype == 2 && hourNum > 1)isHoursPeriodVal = true;
				if(cStart.get(Calendar.DAY_OF_WEEK) != cEnd.get(Calendar.DAY_OF_WEEK)){
					// Case of period < 24h but splitted in two days
					dows = new int[2];
					dows[0] = cStart.get(Calendar.DAY_OF_WEEK);
					dows[1] = cEnd.get(Calendar.DAY_OF_WEEK);
					dhours = new int[2][hourNum + 1];
					while(startMillis <= cEnd.getTimeInMillis()){
						tmp.setTimeInMillis(startMillis);
						int tHour = tmp.get(Calendar.HOUR_OF_DAY);
						if(i != 0 && tHour == 0){
							a++;	// case of day switch
						}
						dhours[a][i] = tHour;
						i++;
						startMillis = startMillis + MILLISINHOUR;
					}
					months = new int[1];
					months[0] = cEnd.get(Calendar.MONTH);
					years = new int[1];
					years[0] = cEnd.get(Calendar.YEAR);
					if(cStart.get(Calendar.MONTH) != cEnd.get(Calendar.MONTH)){
						mdows = new int[2][2];	// Here I specify the week day and the month
						mdows[0][0] = cStart.get(Calendar.DAY_OF_WEEK);
						mdows[1][1] = cEnd.get(Calendar.DAY_OF_WEEK);
						months = new int[2];
						months[0] = cStart.get(Calendar.MONTH);
						months[1] = cEnd.get(Calendar.MONTH);
					}
					if(cStart.get(Calendar.YEAR) != cEnd.get(Calendar.YEAR)){
						ymonths = new int[2][2];
						ymonths[0][0] = cStart.get(Calendar.MONTH);
						ymonths[1][1] = cEnd.get(Calendar.MONTH);
						years = new int[2];
						years[0] = cStart.get(Calendar.YEAR);
						years[1] = cEnd.get(Calendar.YEAR);
					}
				} else {
					// Case of period contained in a day
					dows = new int[1];
					dows[0] = cEnd.get(Calendar.DAY_OF_WEEK);
					hours = new int[hourNum + 1];
					while(startMillis <= cEnd.getTimeInMillis()){
						tmp.setTimeInMillis(startMillis);
						int tHour = tmp.get(Calendar.HOUR_OF_DAY);
						hours[i] = tHour;
						i++;
						startMillis = startMillis + MILLISINHOUR;
					}
					isHoliday = isAHoliday(cEnd, appId);
					w = isHoliday ? "we":"wd";
					years = new int[1];
					years[0] = cEnd.get(Calendar.YEAR);
					months = new int[1];
					months[0] = cEnd.get(Calendar.MONTH);
				}
			} else if(difference < MAXMILLISINAMONTH){
				// in a month
				Long startMillis = cStart.getTimeInMillis();
				Calendar tmp = Calendar.getInstance();
				int i = 0;
				int a = 0;
				int dayNum = (int)Math.floor(difference / MILLISINDAY);
				if(valtype == 2 && dayNum > 1)isDowsPeriodVal = true;
				if(cStart.get(Calendar.MONTH) != cEnd.get(Calendar.MONTH)){
					// Case of period < month but splitted in two months
					months = new int[2];
					months[0] = cStart.get(Calendar.MONTH);
					months[1] = cEnd.get(Calendar.MONTH);
					if(dayNum >= 7){
						mdows = new int[2][7];
					} else {
						mdows = new int[2][dayNum];
					}
					while(startMillis <= cEnd.getTimeInMillis()){
						tmp.setTimeInMillis(startMillis);
						int tDow = tmp.get(Calendar.DAY_OF_WEEK);
						if(i != 0 && tmp.get(Calendar.DAY_OF_MONTH) == 1){
							a++;	// case of month switch
						}
						mdows[a][(i % 7)] = tDow;
						i++;
						startMillis = startMillis + MILLISINDAY;
					}
					years = new int[1];
					years[0] = cEnd.get(Calendar.YEAR);
					if(cStart.get(Calendar.YEAR) != cEnd.get(Calendar.YEAR)){
						ymonths = new int[2][2];
						ymonths[0][0] = cStart.get(Calendar.MONTH);
						ymonths[1][1] = cEnd.get(Calendar.MONTH);
						years = new int[2];
						years[0] = cStart.get(Calendar.YEAR);
						years[1] = cEnd.get(Calendar.YEAR);
					}
				} else {
					// Case of period in a single month
					months = new int[1];
					months[0] = cEnd.get(Calendar.MONTH);
					if(dayNum >= 7){
						dows = new int[7];
					} else {
						dows = new int[dayNum];
					}
					while(startMillis < cEnd.getTimeInMillis() && i < 7){
						tmp.setTimeInMillis(startMillis);
						int dayW = tmp.get(Calendar.DAY_OF_WEEK);
						dows[i] = dayW;
						i++;
						startMillis = startMillis + MILLISINDAY;
					}
					years = new int[1];
					years[0] = cEnd.get(Calendar.YEAR);
				}
			} else if(difference < MILLISINYEAR){
				// in a year
				Long startMillis = cStart.getTimeInMillis();
				Calendar tmp = Calendar.getInstance();
				int i = 0;
				int a = 0;
				
				int monthNum = (int)Math.floor(difference / MILLISINMONTH);
				if(valtype == 2 && monthNum > 1)isMonthsPeriodVal = true;
				if(cStart.get(Calendar.YEAR) != cEnd.get(Calendar.YEAR)){
					// period splitted in two years
					ymonths = new int[2][monthNum + 1];
					years = new int[2];
					years[0] = cStart.get(Calendar.YEAR);
					years[1] = cEnd.get(Calendar.YEAR);
					while(startMillis <= cEnd.getTimeInMillis()){
						
						tmp.setTimeInMillis(startMillis);
						int tMonth = tmp.get(Calendar.MONTH);
						if(i != 0 && tmp.get(Calendar.MONTH) == 0){
							a++;	// case of year switch
						}
						ymonths[a][i] = tMonth;
						i++;
						tmp.set(Calendar.MONTH, tMonth + 1);
						startMillis = tmp.getTimeInMillis();	//startMillis + MILLISINMONTH;
					}			
				} else {
					// period in a single year
					months = new int[monthNum + 1];
					years = new int[1];
					years[0] = cEnd.get(Calendar.YEAR);
					while(startMillis < cEnd.getTimeInMillis()){
						tmp.setTimeInMillis(startMillis);
						int tMonth = tmp.get(Calendar.MONTH);
						months[i] = tMonth;
						i++;
						tmp.set(Calendar.MONTH, tMonth + 1);
						startMillis = tmp.getTimeInMillis();	//startMillis + MILLISINMONTH;
					}
				}
			} else {
				// more years
				int yearStart = cStart.get(Calendar.YEAR);
				int yearEnd = cEnd.get(Calendar.YEAR);
				int yearNum = yearEnd - yearStart + 1;
				years = new int[yearNum];
				if(valtype == 2 && yearNum > 1)isYearsPeriodVal = true;
				int j = 0;
				for(int i = yearStart; i <= yearEnd; i++){
					years[j] = i;
					j++;
				}
			}
		}
		int lastMonth = 0;
		int m = 0;
		double[] splittedVal = new double[3];
		//if(isYearsPeriodVal){
			splittedVal = getSplittedDayTypeValue(value, years.length);
		//}
		for(int y = 0; y < years.length; y++){
			if(valtype == 2){ //isYearsPeriodVal
				double corrValWd = splittedVal[0];
				double corrValWe = splittedVal[1];
				if(y == years.length - 1){
					corrValWe = splittedVal[1] + splittedVal[2];
				}
				findAndUpdateStats(objectId, appId, type, params, corrValWd, timestamp, 4, years[y], 0, 0, 0, "wd", false);
				findAndUpdateStats(objectId, appId, type, params, corrValWe, timestamp, 4, years[y], 0, 0, 0, "we", true);
			} else {
				findAndUpdateStats(objectId, appId, type, params, value, timestamp, 4, years[y], 0, 0, 0, "wd", false);
				findAndUpdateStats(objectId, appId, type, params, value, timestamp, 4, years[y], 0, 0, 0, "we", true);
			}
			int lastDay = 0;
			int d = 0;
			if(ymonths == null || ymonths.length == 0){
				//if(isMonthsPeriodVal){
					splittedVal = getSplittedDayTypeValue(value, months.length);
				//}
				for(m = 0; m < months.length; m++){
					// Case of one year
					if(valtype == 2){ //isMonthsPeriodVal
						double corrValWd = splittedVal[0];
						double corrValWe = splittedVal[1];
						if(m == months.length - 1){
							corrValWe = splittedVal[1] + splittedVal[2];								
						}
						findAndUpdateStats(objectId, appId, type, params, corrValWd, timestamp, 3, years[y], months[m], 0, 0, "wd", false);
						findAndUpdateStats(objectId, appId, type, params, corrValWe, timestamp, 3, years[y], months[m], 0, 0, "we", true);
					} else {
						findAndUpdateStats(objectId, appId, type, params, value, timestamp, 3, years[y], months[m], 0, 0, "wd", false);
						findAndUpdateStats(objectId, appId, type, params, value, timestamp, 3, years[y], months[m], 0, 0, "we", true);
					}
					int lastHour = 0;
					int h = 0;
					if(mdows == null || mdows.length == 0){
						// Case of one month
						if(isDowsPeriodVal){
							splittedVal = getSplittedValue(value, dows.length);
						}
						for(d = 0; d < dows.length; d++){
							if((hours == null || hours.length == 0) && (dhours == null || dhours.length == 0)){
								Calendar cDay = Calendar.getInstance();
								cDay.setTimeInMillis(cStart.getTimeInMillis() + (d * 86400000L));
								isHoliday = isAHoliday(cDay, appId);
								w = isHoliday ? "we":"wd";
								//if(!areHours){
									if(isDowsPeriodVal){
										double corrVal = splittedVal[0];
										if(d == dows.length - 1){
											corrVal = splittedVal[0] + splittedVal[1];
										}
										findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 2, years[y], months[m], dows[d], 0, w, isHoliday);
									} else {
										findAndUpdateStats(objectId, appId, type, params, value, timestamp, 2, years[y], months[m], dows[d], 0, w, isHoliday);
									}
								//}
							} else {
								if(dhours != null && dhours.length > 0){
									if(isHoursPeriodVal){
										splittedVal = getSplittedValue(value, dhours[0].length);
									}
									Calendar cDay = Calendar.getInstance();
									cDay.setTimeInMillis(cStart.getTimeInMillis() + (d * 86400000L));
									isHoliday = isAHoliday(cDay, appId);
									w = isHoliday ? "we":"wd";
									// Case of 2 days
									boolean skip = false;
									for(h = lastHour; (h < dhours[d].length) && !skip; h++){
										if(d == 0){
											if(dhours[d][h] != 0){
												if(isHoursPeriodVal){
													double corrVal = splittedVal[0];
													findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 1, years[y], months[m], dows[d], dhours[d][h], w, isHoliday);
												} else {
													findAndUpdateStats(objectId, appId, type, params, value, timestamp, 1, years[y], months[m], dows[d], dhours[d][h], w, isHoliday);
												}
											} else {
												skip = true;
											}
										} else {
											if(isHoursPeriodVal){
												double corrVal = splittedVal[0];
												if(h == dhours[1].length){
													corrVal = splittedVal[0] + splittedVal[1];
												}
												findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 1, years[y], months[m], dows[d], dhours[d][h], w, isHoliday);
											} else {
												findAndUpdateStats(objectId, appId, type, params, value, timestamp, 1, years[y], months[m], dows[d], dhours[d][h], w, isHoliday);
											}
										}
									}
									lastHour = posOfZeroVal(dhours);	// I save the last hour iterator value;
								} else {
									if(isHoursPeriodVal){
										splittedVal = getSplittedValue(value, hours.length);
									}
									for(h = 0; h < hours.length; h++){
										// Case of 1 day
										if(isHoursPeriodVal){
											double corrVal = splittedVal[0];
											if(h == hours.length - 1){
												corrVal = splittedVal[0] + splittedVal[1];
											}
											findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 1, years[y], months[m], dows[d], hours[h], w, isHoliday);
										} else {
											findAndUpdateStats(objectId, appId, type, params, value, timestamp, 1, years[y], months[m], dows[d], hours[h], w, isHoliday);
										}
									}
								}
							}
						}
					} else {
						if(isDowsPeriodVal){
							splittedVal = getSplittedValue(value, mdows[0].length);
						}
						// Case of dows from 2 months
						boolean mskip = false;
						for(d = lastDay; (d < mdows[m].length) && !mskip; d++){
							if(dhours == null || dhours.length == 0){
								Calendar cDay = Calendar.getInstance();
								cDay.setTimeInMillis(cStart.getTimeInMillis() + (d * 86400000L));
								isHoliday = isAHoliday(cDay, appId);
								w = isHoliday ? "we":"wd";
								if(m == 0){
									if(mdows[m][d] != 0){
										if(isDowsPeriodVal){
											double corrVal = splittedVal[0];
											findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 2, years[y], months[m], mdows[m][d], 0, w, isHoliday);
										} else {
											findAndUpdateStats(objectId, appId, type, params, value, timestamp, 2, years[y], months[m], mdows[m][d], 0, w, isHoliday);
										}
									} else {
										mskip = true;
									}
								} else {
									if(isDowsPeriodVal){
										double corrVal = splittedVal[0];
										if(d == mdows[1].length - 1){
											corrVal = splittedVal[0] + splittedVal[1];
										}
										findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 2, years[y], months[m], mdows[m][d], 0, w, isHoliday);
									} else {
										findAndUpdateStats(objectId, appId, type, params, value, timestamp, 2, years[y], months[m], mdows[m][d], 0, w, isHoliday);
									}
								}
							} else {
								if(isHoursPeriodVal){
									splittedVal = getSplittedValue(value, dhours[0].length);
								}
								// Case of hours from 2 days
								m = d;	// I align the day with the months;
								Calendar cDay = Calendar.getInstance();
								cDay.setTimeInMillis(cStart.getTimeInMillis() + (d * 86400000L));
								isHoliday = isAHoliday(cDay, appId);
								w = isHoliday ? "we":"wd";
								// Case of 2 days
								boolean skip = false;
								for(h = lastHour; (h < dhours[d].length) && !skip; h++){
									if(d == 0){
										if(dhours[d][h] != 0){
											if(isHoursPeriodVal){
												double corrVal = splittedVal[0];
												findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 1, years[y], months[m], mdows[m][d], dhours[d][h], w, isHoliday);
											} else {
												findAndUpdateStats(objectId, appId, type, params, value, timestamp, 1, years[y], months[m], mdows[m][d], dhours[d][h], w, isHoliday);
											}
										} else {
											skip = true;
										}
									} else {
										if(isHoursPeriodVal){
											double corrVal = splittedVal[0];
											if(h == dhours[1].length){
												corrVal = splittedVal[0] + splittedVal[1];
											}
											findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 1, years[y], months[m], mdows[m][d], dhours[d][h], w, isHoliday);
										} else {
											findAndUpdateStats(objectId, appId, type, params, value, timestamp, 1, years[y], months[m], mdows[m][d], dhours[d][h], w, isHoliday);
										}
									}
								}
								lastHour = posOfZeroVal(dhours);	// I save the last hour iterator value;
							}
						}
						lastDay = posOfFirstVal(mdows);	// I save the last day iterator value;
					}
				}
			} else {
				// Case of months from 2 years
				//if(isMonthsPeriodVal){
					splittedVal = getSplittedDayTypeValue(value, ymonths[0].length);
				//}
				int lastHour = 0;
				int h = 0;
				boolean yskip = false;
				for(m = lastMonth; (m < ymonths[y].length) && !yskip; m++){
					if((dhours == null || dhours.length == 0) && ((mdows == null || mdows.length == 0))){
						if(y == 0){
							if(ymonths[y][m] != 0){
								if(valtype == 2){	//isMonthsPeriodVal
									double corrValWd = splittedVal[0];
									double corrValWe = splittedVal[1];
									findAndUpdateStats(objectId, appId, type, params, corrValWd, timestamp, 3, years[y], ymonths[y][m], 0, 0, "wd", false);
									findAndUpdateStats(objectId, appId, type, params, corrValWe, timestamp, 3, years[y], ymonths[y][m], 0, 0, "we", true);
								} else {
									findAndUpdateStats(objectId, appId, type, params, value, timestamp, 3, years[y], ymonths[y][m], 0, 0, "wd", false);
									findAndUpdateStats(objectId, appId, type, params, value, timestamp, 3, years[y], ymonths[y][m], 0, 0, "we", true);
								}
							} else {
								yskip = true;
							}
						} else {
							if(valtype == 2){ //isMonthsPeriodVal
								double corrValWd = splittedVal[0];
								double corrValWe = splittedVal[1];
								if(m == ymonths[1].length - 1){
									corrValWe = splittedVal[1] + splittedVal[2];
								}
								findAndUpdateStats(objectId, appId, type, params, corrValWd, timestamp, 3, years[y], ymonths[y][m], 0, 0, "wd", false);
								findAndUpdateStats(objectId, appId, type, params, corrValWe, timestamp, 3, years[y], ymonths[y][m], 0, 0, "we", true);
							} else {
								findAndUpdateStats(objectId, appId, type, params, value, timestamp, 3, years[y], ymonths[y][m], 0, 0, "wd", false);
								findAndUpdateStats(objectId, appId, type, params, value, timestamp, 3, years[y], ymonths[y][m], 0, 0, "we", true);
							}
						}
					} else {
						// Case of hours and days from 2 years
						if(isDowsPeriodVal){
							splittedVal = getSplittedValue(value, mdows[0].length);
						}
						boolean mskip = false;
						for(d = lastDay; (d < mdows[m].length) && !mskip; d++){
							if(dhours == null || dhours.length == 0){
								y = m;	// I align the month with the year;
								Calendar cDay = Calendar.getInstance();
								cDay.setTimeInMillis(cStart.getTimeInMillis() + (d * 86400000L));
								isHoliday = isAHoliday(cDay, appId);
								w = isHoliday ? "we":"wd";
								if(m == 0){
									if(mdows[m][d] != 0){
										if(isDowsPeriodVal){
											double corrVal = splittedVal[0];
											findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 2, years[y], months[m], mdows[m][d], 0, w, isHoliday);
										} else {
											findAndUpdateStats(objectId, appId, type, params, value, timestamp, 2, years[y], months[m], mdows[m][d], 0, w, isHoliday);
										}
									} else {
										mskip = true;
									}
								} else {
									if(isDowsPeriodVal){
										double corrVal = splittedVal[0];
										if(d == mdows[1].length - 1){
											corrVal = splittedVal[0] + splittedVal[1];
										}
										findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 2, years[y], months[m], mdows[m][d], 0, w, isHoliday);
									} else {
										findAndUpdateStats(objectId, appId, type, params, value, timestamp, 2, years[y], months[m], mdows[m][d], 0, w, isHoliday);
									}
								}
							} else {
								if(isHoursPeriodVal){
									splittedVal = getSplittedValue(value, dhours[0].length);
								}
								// Case of hours from 2 days
								y = m = d;	// I align the day with the month and the year;
								Calendar cDay = Calendar.getInstance();
								cDay.setTimeInMillis(cStart.getTimeInMillis() + (d * 86400000L));
								isHoliday = isAHoliday(cDay, appId);
								w = isHoliday ? "we":"wd";
								// Case of 2 days
								boolean skip = false;
								for(h = lastHour; (h < dhours[d].length) && !skip; h++){
									if(d == 0){
										if(dhours[d][h] != 0){
											if(isHoursPeriodVal){
												double corrVal = splittedVal[0];
												findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 1, years[y], months[m], mdows[m][d], dhours[d][h], w, isHoliday);
											} else {
												findAndUpdateStats(objectId, appId, type, params, value, timestamp, 1, years[y], months[m], mdows[m][d], dhours[d][h], w, isHoliday);
											}
										} else {
											skip = true;
										}
									} else {
										if(isHoursPeriodVal){
											double corrVal = splittedVal[0];
											if(h == dhours[1].length){
												corrVal = splittedVal[0] + splittedVal[1];
											}
											findAndUpdateStats(objectId, appId, type, params, corrVal, timestamp, 1, years[y], months[m], mdows[m][d], dhours[d][h], w, isHoliday);
										} else {
											findAndUpdateStats(objectId, appId, type, params, value, timestamp, 1, years[y], months[m], mdows[m][d], dhours[d][h], w, isHoliday);
										}
									}
								}
								lastHour = posOfZeroVal(dhours);	// I save the last hour iterator value;
							}
						}
						lastDay = posOfFirstVal(mdows);	// I save the last day iterator value;
						
					}
				}
				lastMonth = posOfZeroVal(ymonths);	// I save the last month iterator value;
				
			}
		}	
	}	
	
	private int posOfZeroVal(int[][] secondArr){
		int zero = 0;
		for(int i = 0; (i < secondArr[1].length && zero == 0) ; i++){
			if(secondArr[1][i] != 0){
				zero = i - 1;
			}
		}
		return zero;
	}
	
	private int posOfFirstVal(int[][] secondArr){
		int zero = 0;
		for(int i = 0; (i < secondArr[1].length && zero == 0) ; i++){
			if(secondArr[1][i] != 0){
				zero = i;
			}
		}
		return zero;
	}
	
	// method getSplittedValue: used to retrieve the correct value for the profit in period
	private double[] getSplittedValue(double val, int elements){
		double[] result = new double[2];
		double ele = (double)elements;
		double quotient = val / ele;
		double remainder = val - (quotient * ele);
		result[0] = quotient;
		result[1] = remainder;
		return result;
	}
	
	// method getSplittedDayTypeValue: used to retrieve the correct value for the profit in period when I have 
	// to consider the day types (period = months or years)
	private double[] getSplittedDayTypeValue(double val, int elements){
		double[] result = new double[3];
		double ele = (double)elements;
		double quotient = val / ele;
		double quotWd = quotient * 0.7;
		double quotWe = quotient * 0.3;
		double remainder = val - (quotWd * ele) - (quotWe * ele);
		result[0] = quotWd;
		result[1] = quotWe;
		result[2] = remainder;
		return result;
	}
	
	private void findAndUpdateStats(String objectId, String appId, String type, Map<String, Object> params, double value, long timestamp, int period, int year, int month, int dow, int hour, String wdt, boolean isHoliday){
		StatValue stat = new StatValue(1, value, value, timestamp); //value,
		
		Criteria criteria = Criteria
				.where("key.objectId").is(objectId)
				.and("key.appId").is(appId)
				.and("key.type").is(type)
				.and("key.year").is(year);
					
		Query query = Query.query(criteria);
			
		String q1;
		String q2;
		String q3;
		String q4;
		String q5;
		String q6;
		String q7;
		String q8;
			
		Update update = new Update();
		if (params != null && !params.isEmpty()) {
			update.addToSet("parameters", params);
		}
			
		// hours
		if(period == 1){
			// - update: year, month, day, hour
			q1 = "months."+month+".days."+dow+".hours."+hour;	//1
			// - update: year, month, wd/we, hour
			q3 = "months."+month+"."+wdt+".hours."+hour;	//1
			// - update: year, all, day, hour
			q5 = "all.days."+dow+".hours."+hour;	//1
			// - update: year, all, wd/we, hour
			q7 = "all."+wdt+".hours."+hour; //1
			
			query.fields().include(q1);
			query.fields().include(q3);
			query.fields().include(q5);
			query.fields().include(q7);
				
			YearStat yearStat = mongoTemplate.findOne(query, YearStat.class);
			
			StatValue stat1 = stat.copy();
			if (yearStat != null && yearStat.month(month).day(dow).hour(hour) != null){
				stat1.merge(yearStat.month(month).day(dow).hour(hour));
			}
			update.set(q1, stat1);
				
			StatValue stat3 = stat.copy();
			if (isHoliday && yearStat != null && yearStat.month(month).getWe().hour(hour) != null){
				stat3.merge(yearStat.month(month).getWe().hour(hour));
			} else if (!isHoliday && yearStat != null && yearStat.month(month).getWd().hour(hour) != null){
				stat3.merge(yearStat.month(month).getWd().hour(hour));
			}
			update.set(q3, stat3);
		
			StatValue stat5 = stat.copy();
			if (yearStat != null && yearStat.getAll().day(dow).hour(hour) != null){
				stat5.merge(yearStat.getAll().day(dow).hour(hour));
			}
			update.set(q5, stat5);
				
			StatValue stat7 = stat.copy();
			if (isHoliday && yearStat != null && yearStat.getAll().getWe().hour(hour) != null){
				stat7.merge(yearStat.getAll().getWe().hour(hour));
			} else if (!isHoliday && yearStat != null && yearStat.getAll().getWd().hour(hour) != null){
				stat7.merge(yearStat.getAll().getWd().hour(hour));
			}
			update.set(q7, stat7);
		}
			
		//days
		if(period == 2){
			// - update: year, month, day, all
			q2 = "months."+month+".days."+dow+".all";	//2
			// - update: year, all, day, all
			q6 = "all.days."+dow+".all";	//2
				
			query.fields().include(q2);
			query.fields().include(q6);
				
			YearStat yearStat = mongoTemplate.findOne(query, YearStat.class);
		
			StatValue stat2 = stat.copy();
			if (yearStat != null && yearStat.month(month).day(dow).getAll() != null){
				stat2.merge(yearStat.month(month).day(dow).getAll());
			}
			update.set(q2, stat2);
		
			StatValue stat6 = stat.copy();
			if (yearStat != null && yearStat.getAll().day(dow).getAll() != null){
				stat6.merge(yearStat.getAll().day(dow).getAll());
			}
			update.set(q6, stat6);
		}
			
		//month
		if(period == 3){
			// - update: year, month, wd/we, all
			q4 = "months."+month+"."+wdt+".all";	//3
				
			query.fields().include(q4);
				
			YearStat yearStat = mongoTemplate.findOne(query, YearStat.class);
		
			StatValue stat4 = stat.copy();
			if (isHoliday && yearStat != null && yearStat.month(month).getWe().getAll() != null){
				stat4.merge(yearStat.month(month).getWe().getAll());
			} else if (!isHoliday && yearStat != null && yearStat.month(month).getWd().getAll() != null){
				stat4.merge(yearStat.month(month).getWd().getAll());
			}
			update.set(q4, stat4);
		}
			
		//year
		if(period == 4){
			// - update: year, all, wd/we, all
			q8 = "all."+wdt+".all";	//4

			query.fields().include(q8);
				
			YearStat yearStat = mongoTemplate.findOne(query, YearStat.class);
				
			StatValue stat8 = stat.copy();
			if (isHoliday && yearStat != null && yearStat.getAll().getWe().getAll() != null){
				stat8.merge(yearStat.getAll().getWe().getAll());
			} else if (!isHoliday && yearStat != null && yearStat.getAll().getWd().getAll() != null){
				stat8.merge(yearStat.getAll().getWd().getAll());
			}
			update.set(q8, stat8);
		}
			
		mongoTemplate.upsert(Query.query(criteria), update, YearStat.class);
	}
	
	private void findAndUpdateStatsComposed(String objectId, String appId, String type, Map<String, Object> params, double value, long timestamp, int period, int year, int month, int dow, int hour, String wdt, boolean isHoliday) {
		StatValue stat = new StatValue(1, value, value, timestamp); //value,
		Criteria criteria = Criteria
				.where("key.objectId").is(objectId)
				.and("key.appId").is(appId)
				.and("key.type").is(type)
				.and("key.year").is(year);
					
		Query query = Query.query(criteria);
			
		String q1;
		String q2;
		String q3;
		String q4;
		String q5;
		String q6;
		String q7;
		String q8;
			
		Update update = new Update();
		if (params != null && !params.isEmpty()) {
			update.addToSet("parameters", params);
		}
			
		// hours
		if(period == 1){
			// - update: year, month, day, hour
			q1 = "months."+month+".days."+dow+".hours."+hour;	//1
			// - update: year, month, day, all
			q2 = "months."+month+".days."+dow+".all";	//2
			// - update: year, month, wd/we, hour
			q3 = "months."+month+"."+wdt+".hours."+hour;	//1
			// - update: year, month, wd/we, all
			q4 = "months."+month+"."+wdt+".all";	//3
			// - update: year, all, day, hour
			q5 = "all.days."+dow+".hours."+hour;	//1
			// - update: year, all, day, all
			q6 = "all.days."+dow+".all";	//2
			// - update: year, all, wd/we, hour
			q7 = "all."+wdt+".hours."+hour; //1
			// - update: year, all, wd/we, all
			q8 = "all."+wdt+".all";		//4
			
			query.fields().include(q1);
			query.fields().include(q2);
			query.fields().include(q3);
			query.fields().include(q4);
			query.fields().include(q5);
			query.fields().include(q6);
			query.fields().include(q7);
			query.fields().include(q8);
			
			YearStat yearStat = mongoTemplate.findOne(query, YearStat.class);
			
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
		}
			
		//days
		if(period == 2){
			// - update: year, month, day, all
			q2 = "months."+month+".days."+dow+".all";	//2
			// - update: year, month, wd/we, all
			q4 = "months."+month+"."+wdt+".all";	//3
			// - update: year, all, day, all
			q6 = "all.days."+dow+".all";	//2
			// - update: year, all, wd/we, all
			q8 = "all."+wdt+".all";		//4
				
			query.fields().include(q2);
			query.fields().include(q4);
			query.fields().include(q6);
			query.fields().include(q8);
			
			YearStat yearStat = mongoTemplate.findOne(query, YearStat.class);

			StatValue stat2 = stat.copy();
			if (yearStat != null && yearStat.month(month).day(dow).getAll() != null){
				stat2.merge(yearStat.month(month).day(dow).getAll());
			}
			update.set(q2, stat2);

			StatValue stat4 = stat.copy();
			if (isHoliday && yearStat != null && yearStat.month(month).getWe().getAll() != null){
				stat4.merge(yearStat.month(month).getWe().getAll());
			} else if (!isHoliday && yearStat != null && yearStat.month(month).getWd().getAll() != null){
				stat4.merge(yearStat.month(month).getWd().getAll());
			}
			update.set(q4, stat4);

			StatValue stat6 = stat.copy();
			if (yearStat != null && yearStat.getAll().day(dow).getAll() != null){
				stat6.merge(yearStat.getAll().day(dow).getAll());
			}
			update.set(q6, stat6);

			StatValue stat8 = stat.copy();
			if (isHoliday && yearStat != null && yearStat.getAll().getWe().getAll() != null){
				stat8.merge(yearStat.getAll().getWe().getAll());
			} else if (!isHoliday && yearStat != null && yearStat.getAll().getWd().getAll() != null){
				stat8.merge(yearStat.getAll().getWd().getAll());
			}
			update.set(q8, stat8);
		}
			
		//month
		if(period == 3){
			// - update: year, month, wd/we, all
			q4 = "months."+month+"."+wdt+".all";	//3
			// - update: year, all, wd/we, all
			q8 = "all."+wdt+".all";	//4
				
			query.fields().include(q4);
			query.fields().include(q8);
				
			YearStat yearStat = mongoTemplate.findOne(query, YearStat.class);
		
			StatValue stat4 = stat.copy();
			if (isHoliday && yearStat != null && yearStat.month(month).getWe().getAll() != null){
				stat4.merge(yearStat.month(month).getWe().getAll());
			} else if (!isHoliday && yearStat != null && yearStat.month(month).getWd().getAll() != null){
				stat4.merge(yearStat.month(month).getWd().getAll());
			}
			update.set(q4, stat4);
			
			StatValue stat8 = stat.copy();
			if (isHoliday && yearStat != null && yearStat.getAll().getWe().getAll() != null){
				stat8.merge(yearStat.getAll().getWe().getAll());
			} else if (!isHoliday && yearStat != null && yearStat.getAll().getWd().getAll() != null){
				stat8.merge(yearStat.getAll().getWd().getAll());
			}
			update.set(q8, stat8);
		}
			
		//year
		if(period == 4){
			// - update: year, all, wd/we, all
			q8 = "all."+wdt+".all";	//4

			query.fields().include(q8);
				
			YearStat yearStat = mongoTemplate.findOne(query, YearStat.class);
				
			StatValue stat8 = stat.copy();
			if (isHoliday && yearStat != null && yearStat.getAll().getWe().getAll() != null){
				stat8.merge(yearStat.getAll().getWe().getAll());
			} else if (!isHoliday && yearStat != null && yearStat.getAll().getWd().getAll() != null){
				stat8.merge(yearStat.getAll().getWd().getAll());
			}
			update.set(q8, stat8);
		}

		mongoTemplate.upsert(Query.query(criteria), update, YearStat.class);
	}	

	//private boolean isHoliday(Calendar c, String appId) {
		// TODO
	//	return c.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY;
		//HolidaysManager holidaysManager = new HolidaysManager();
		//return holidaysManager.isAHoliday(c, appId);
	//}
	
	/**
	 * Method completeSequence: used to add to a list all the element between the stard-end extreme passed in input 
	 * @param extreme: start-end element passed in input
	 * @return the complete list from start to end (in a List of String)
	 */
	private List<String> completeSequence(byte[] extreme){
		List<String> complete = new ArrayList<String>();
		if(extreme != null && extreme.length > 0){
			int diff = extreme[(extreme.length -1)] - extreme[0];
			if(diff > 1){
				for(int i = 0; i <= diff; i++){
					int value = extreme[0] + i;
					complete.add("" + value);
				}
			} else {
				if(extreme.length > 1){
					complete.add("" + extreme[0]);
					complete.add("" + extreme[1]);
				} else {
					complete.add("" + extreme[0]);
				}
			}
		} 
		return complete;
	}

	private List<String> correctArray(byte[] values){
		List<String> arr = new ArrayList<String>();
		for(int i = 0; i < values.length; i++){
			arr.add(values[i] + "");
		}
		return arr;
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
			List<String> myMonths = completeSequence(months);
			for (String month : myMonths) {
				monthKeys.add("months."+month);
			}
		} else {
			monthKeys.add("all");
		}	
		
		List<String> dayKeys = new ArrayList<String>();
		if (days != null && days.length > 0) {
			List<String> myDays = correctArray(days);	//completeSequence(days);
			for (String day : myDays) {
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
			List<String> myHours = completeSequence(hours);
			for (String hour : myHours) {
				hourKeys.add("hours."+hour);
			}
//			for (byte hour : hours) {
//				hourKeys.add("hours."+hour);
//			}
		} else {
			hourKeys.add("all");
		}
		mergeFields(monthKeys, dayKeys, hourKeys, query.fields());
//		logger.info("Filter creation merged fields :" + query.toString());
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
			//logger.info(String.format("key %s, value %s", key.toString(), value.toString()));
			map.put(key, value.merge(map.get(key)));
		}
		for (StatKey key : map.keySet()) {
			if (map.get(key).empty()) map.remove(key);
		}
		return map;
	}
	
	private List<ObjectsHolidays> getAllHolidays(String appId){
		List<ObjectsHolidays> res = objectItaHolidays.getHolidays();
		List<ObjectsHolidays> resApp = new ArrayList<ObjectsHolidays>();
		for (ObjectsHolidays ih : res) {
			if((ih.getAppId().compareTo(appId) == 0) || (ih.getAppId().compareTo("all") == 0)){
				resApp.add(ih);
			}
		}
		return resApp;
	}
	
	private ObjectsHolidays findHolidaysByDate(Integer month, Integer day, String appId){
		ObjectsHolidays result = null;
		List<ObjectsHolidays> itaHolidays = getAllHolidays(appId);
		for (ObjectsHolidays ih : itaHolidays) {
			//logger.error(String.format("finded holiday: %s", ih.getId()));
			if(ih.getMonth() == month && ih.getDay() == day){
				result = ih;
			}
		}
		return result;
	}
	
	private List<ObjectsSpecialHolidays> getAllEasterMondays(){
		List<ObjectsSpecialHolidays> res = objectHistoricalEaster.getHolidays();
		return res;
	}
	
	private ObjectsSpecialHolidays findEasterMondaysByDate(Integer year, Integer month, Integer day){
		ObjectsSpecialHolidays result = null;
		for (ObjectsSpecialHolidays he : getAllEasterMondays()) {
			//logger.error(String.format("finded Easter Monday: %s - %d/%d/%d - myDay - %d/%d/%d", he.getId(), he.getDay(), he.getMonth(), he.getYear(), day, month, year));			
			if(he.getYear().compareTo(year) == 0 && he.getMonth().compareTo(month) == 0 && he.getDay().compareTo(day) == 0){
				result = he;
			}
		}
		return result;
	}
	
	/**
	 * Method used to calculate if a specific date is holiday or not
	 * @param cal: imput calendar object
	 * @return true if holiday, false if not
	 */
	public boolean isAHoliday(Calendar cal, String appId){
		boolean isHoliday = false;
		// here I have to cover all the cases: public holidays in Ita, year holidays, city holidays
		int wd = cal.get(Calendar.DAY_OF_WEEK);
		if(wd == Calendar.SUNDAY){
			isHoliday = true;
		} else {
			if(findHolidaysByDate(cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH), appId) != null){
				isHoliday = true;
			}
			if(wd == Calendar.MONDAY){
				if(findEasterMondaysByDate(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH)) != null){
					isHoliday = true;
				}
			}
		} 
		//logger.error(String.format("isAHoliday function: day of week %d, day %d, month %d", wd, cal.get(Calendar.DAY_OF_MONTH), cal.get(Calendar.MONTH) + 1));
		//logger.error(String.format("isAHoliday function result: %s", isHoliday));
		return isHoliday;
	};
    
}
