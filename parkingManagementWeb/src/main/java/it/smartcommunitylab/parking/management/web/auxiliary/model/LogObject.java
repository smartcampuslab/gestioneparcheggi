package it.smartcommunitylab.parking.management.web.auxiliary.model;


public class LogObject<T extends GeoObject> {
	
	private String author;
	private long time;
	
	private T value;
	
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public long getTime() {
		return time;
	}
	public void setTime(long time) {
		this.time = time;
	}
	public T getValue() {
		return value;
	}
	public void setValue(T value) {
		this.value = value;
	}
	
}