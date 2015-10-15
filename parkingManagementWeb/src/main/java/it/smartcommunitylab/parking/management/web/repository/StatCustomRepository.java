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

import it.smartcommunitylab.parking.management.web.model.stats.StatKey;
import it.smartcommunitylab.parking.management.web.model.stats.StatValue;

import java.util.Calendar;
import java.util.Map;

/**
 * 
 * Methods for search/update the statistics data.
 * The search/insertion makes use of the following data:
 * <ul>
 * <li>objectId and appId - uniquely identify the object to refer to</li>
 * <li>type - characterizes the type of objects and stats. Together with the objectId, appId and year form the unique key of the record </li>
 * <li>params - attributes to facilitate the search</li>
 * <li>years: list of years to search for, may be null</li>
 * <li>months: list of 0-based month indices, may be null</li>
 * <li>days: list of {@link Calendar} day-of-week indices, may be null</li>
 * <li>hours: list of 24-based hours, may be null</li>
 * </ul>
 * The search methods return Map of {@link StatKey} - {@link StatValue} pairs,
 * where the {@link StatValue} instance contains the last recorded value for the given data set,
 * and the aggregateValue contains the aggregate value for the matched data set of the object.
 * 
 * @author raman
 *
 */

public interface StatCustomRepository {

	public Map<StatKey, StatValue> findStats(
			String objectId,
			String appId,
			String type,
			Map<String, Object> params,
			int[] years,
			byte[] months,
			byte[] days,
			byte[] hours);
	
	public Map<StatKey, StatValue> findStatsWD(
			String objectId,
			String appId,
			String type,
			Map<String, Object> params,
			int[] years,
			byte[] months,
			byte[] hours);
	
	public Map<StatKey, StatValue> findStatsWE(
			String objectId,
			String appId,
			String type,
			Map<String, Object> params,
			int[] years,
			byte[] months,
			byte[] hours);
	
	public Map<StatKey, StatValue> findLastValue(
			String objectId,
			String appId,
			String type,
			Map<String, Object> params,
			int[] years,
			byte[] months,
			byte[] days,
			byte[] hours);
	
	public Map<StatKey, StatValue> findLastValueWD(
			String objectId,
			String appId,
			String type,
			Map<String, Object> params,
			int[] years,
			byte[] months,
			byte[] hours);
	
	public Map<StatKey, StatValue> findLastValueWE(
			String objectId,
			String appId,
			String type,
			Map<String, Object> params,
			int[] years,
			byte[] months,
			byte[] hours);
	
	public void updateStats(
			String objectId,
			String appId,
			String type,
			Map<String, Object> params,
			double value,
			long timestamp);
	
	public void updateDirectPeriodStats(
			String objectId,
			String appId,
			String type,
			Map<String, Object> params,
			double value,
			long timestamp,
			int p_type);
	
	public void updateStatsPeriod(
			String objectId,
			String appId,
			String type,
			Map<String, Object> params,
			double value,
			long timestamp,
			long[] period,
			int valtype);
	
	public boolean isAHoliday(
			Calendar cal, 
			String appId);

}
