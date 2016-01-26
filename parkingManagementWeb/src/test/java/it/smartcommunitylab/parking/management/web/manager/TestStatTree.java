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
package it.smartcommunitylab.parking.management.web.manager;


import it.smartcommunitylab.parking.management.web.model.stats.StatKey;
import it.smartcommunitylab.parking.management.web.model.stats.StatValue;
import it.smartcommunitylab.parking.management.web.repository.StatRepository;

import java.util.Calendar;
import java.util.Collections;
import java.util.Map;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "/spring/filterContext.xml", "/spring/SpringAppDispatcher-servlet.xml" })
public class TestStatTree {

	private static final String TYPE = "type";
	private static final String APP = "app";
	private static final String OBJECT = "object";
	@Autowired
	private StatRepository repo;
	
	@Before
	public void init() {
		repo.deleteAll();
	} 
	
	@Test
	public void testInsert() {
		repo.updateStats(OBJECT, APP, TYPE, Collections.<String,Object>singletonMap("param1", "value1"), 10, System.currentTimeMillis());
		Map<StatKey, StatValue> findStats = repo.findStats(OBJECT, APP, TYPE, Collections.<String,Object>singletonMap("param1", "value1"), null, null, null, null);
		Assert.assertEquals(1, findStats.size());
	}
	
	@Test
	public void testUpdate() {
		long ts = System.currentTimeMillis();
		repo.updateStats(OBJECT, APP, TYPE, null, 10, ts - 1000*60*60*24);
		Map<StatKey, StatValue> findStats = repo.findStats(OBJECT, APP, TYPE, null, null, null, null, null);
		Assert.assertEquals(1, findStats.size());
		
		repo.updateStats(OBJECT, APP, TYPE, null, 20, ts);
		findStats = repo.findStats(OBJECT, APP, TYPE, null, null, null, null, null);
		Assert.assertEquals(1, findStats.size());
		StatValue value = findStats.values().iterator().next();
		Assert.assertEquals(15, value.getAggregateValue(), 0);
		Assert.assertEquals(ts, value.getLastUpdate());
		Assert.assertEquals(20, value.getLastValue(), 0);
	}

	@Test
	public void testQuery() {
		Calendar c = Calendar.getInstance();

		repo.updateStats(OBJECT, APP, TYPE, null, 10, c.getTimeInMillis());
		Map<StatKey, StatValue> 
		findStats = repo.findStats(OBJECT, APP, TYPE, null, null, null, null, null);
		Assert.assertEquals(1, findStats.size());
		
		findStats = repo.findStats(OBJECT, APP, TYPE, null, new int[]{c.get(Calendar.YEAR)}, null, null, null);
		Assert.assertEquals(1, findStats.size());
		
		findStats = repo.findStats(OBJECT, APP, TYPE, null, null, new byte[]{(byte)c.get(Calendar.MONTH)}, null, null);
		Assert.assertEquals(1, findStats.size());

		findStats = repo.findStats(OBJECT, APP, TYPE, null, null, null, new byte[]{(byte)c.get(Calendar.DAY_OF_WEEK)}, null);
		Assert.assertEquals(1, findStats.size());

		findStats = repo.findStats(OBJECT, APP, TYPE, null, null, null, null, new byte[]{(byte)c.get(Calendar.HOUR_OF_DAY)});
		Assert.assertEquals(1, findStats.size());
	}
	
	//@Test
	public void testStress(){
		// change this for real stress test
		int year_range = 1;
		int instance_range = 1;

		Calendar c = Calendar.getInstance();

		int value_range = 100;
		
		long now  = System.currentTimeMillis();
		System.err.println("Start data seed...");

		int count = 0;
		c.add(Calendar.YEAR, -year_range);
		while (c.getTimeInMillis() < now) {
			for (int i = 0; i < instance_range; i++) {
				repo.updateStats(OBJECT+i, APP, TYPE, null, Math.round(Math.random()*value_range), c.getTimeInMillis());
			}
			c.add(Calendar.HOUR, 1);
			count++;
		}
		System.err.println("Done data seed: "+(System.currentTimeMillis()-now)+" millis");
		now = System.currentTimeMillis();
		Map<StatKey, StatValue> 
		findStats = repo.findStats(null, APP, TYPE, null, null, null, null, null);
		System.err.println("Done query: "+(System.currentTimeMillis()-now)+" millis");
		Assert.assertEquals(instance_range, findStats.size());
		Assert.assertEquals(count, findStats.values().iterator().next().getCount());

	}

}
