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
