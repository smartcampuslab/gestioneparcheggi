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
package it.smartcommunitylab.parking.management.web.security;

import it.smartcommunitylab.parking.management.web.model.ObjectsHolidays;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

@Component
public class ObjectsHolidaysSetup {

	@Value("classpath:/objects-holidays.yml")
	private Resource resource;

	@PostConstruct
	public void init() throws IOException {
		Yaml yaml = new Yaml(new Constructor(ObjectsHolidaysSetup.class));
		ObjectsHolidaysSetup data = (ObjectsHolidaysSetup) yaml.load(resource.getInputStream());
		this.holidays = data.holidays;
	}
	
	private List<ObjectsHolidays> holidays;
	private Map<String,ObjectsHolidays> holidaysMap;
	

	public List<ObjectsHolidays> getHolidays() {
		return holidays;
	}

	public void setHolidays(List<ObjectsHolidays> holidays) {
		this.holidays = holidays;
	}

	@Override
	public String toString() {
		return "HolidaySetup [holidays=" + holidays + "]";
	}

	public ObjectsHolidays findHolidayById(String id) {
		if (holidaysMap == null) {
			holidaysMap = new HashMap<String, ObjectsHolidays>();
			for (ObjectsHolidays holiday : holidays) {
				holidaysMap.put(holiday.getId(), holiday);
			}
		}
		return holidaysMap.get(id);
	}
	
	public ObjectsHolidays findHolidayByAppId(String appId) {
		if (holidaysMap == null) {
			holidaysMap = new HashMap<String, ObjectsHolidays>();
			for (ObjectsHolidays holiday : holidays) {
				holidaysMap.put(holiday.getAppId(), holiday);
			}
		}
		return holidaysMap.get(appId);
	}
}
