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

public class StatValue {

	private int count = 0;
	private double aggregateValue = 0;
	private double lastValue = 0;
	private long lastUpdate = 0;
	
	public void insert(double value, long timestamp) {
		lastUpdate = timestamp;
		lastValue = value;
		aggregateValue = (aggregateValue * count + value)/(++count);
	}
	
	public StatValue(int count, double aggregateValue, double lastValue, long lastUpdate) {
		super();
		this.count = count;
		this.aggregateValue = aggregateValue;
		this.lastValue = lastValue;
		this.lastUpdate = lastUpdate;
	}
	public StatValue() {
		super();
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public double getAggregateValue() {
		return aggregateValue;
	}
	public void setAggregateValue(double aggregateValue) {
		this.aggregateValue = aggregateValue;
	}
	public double getLastValue() {
		return lastValue;
	}
	public void setLastValue(double lastValue) {
		this.lastValue = lastValue;
	}
	public long getLastUpdate() {
		return lastUpdate;
	}
	public void setLastUpdate(long lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	public StatValue merge(StatValue v) {
		if (v != null) {
			if (count > 0 || v.count > 0) {
				aggregateValue = (aggregateValue * count + v.aggregateValue * v.count) / (count + v.count);
			}
			count += v.count;
			if (lastUpdate < v.lastUpdate) {
				lastUpdate = v.lastUpdate;
				lastValue = v.lastValue;
			}
		}
		return this;
	}
	
	public boolean empty() {
		return count == 0;
	}

	public StatValue copy() {
		return new StatValue(count, aggregateValue, lastValue, lastUpdate); 
	}
}
