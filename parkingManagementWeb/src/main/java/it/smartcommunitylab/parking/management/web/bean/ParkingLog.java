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
package it.smartcommunitylab.parking.management.web.bean;

import java.util.Map;

public class ParkingLog {

		//private String id;
		//private String objId;
		//private String type;
		private Long time;
		private String author;

		//private String content;
		private Map<String, Object> value;

		public Long getTime() {
			return time;
		}

		public String getAuthor() {
			return author;
		}

		public Map<String, Object> getValue() {
			return value;
		}

		public void setTime(Long time) {
			this.time = time;
		}

		public void setAuthor(String author) {
			this.author = author;
		}

		public void setValue(Map<String, Object> value) {
			this.value = value;
		}

}
