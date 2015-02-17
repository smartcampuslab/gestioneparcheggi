package it.smartcommunitylab.parking.management.web.bean;

import it.smartcommunitylab.parking.management.web.model.geo.Point;

public class DataLogBean {

	private String id;
	private Point location;
	private String type;
	private Long updateTime;
	private Integer version;
	private boolean deleted;
	private String content;
	public String getId() {
		return id;
	}
	public Point getLocation() {
		return location;
	}
	public String getType() {
		return type;
	}
	public Long getUpdateTime() {
		return updateTime;
	}
	public Integer getVersion() {
		return version;
	}
	public boolean isDeleted() {
		return deleted;
	}
	public String getContent() {
		return content;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setLocation(Point location) {
		this.location = location;
	}
	public void setType(String type) {
		this.type = type;
	}
	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}
	public void setVersion(Integer version) {
		this.version = version;
	}
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	public void setContent(String content) {
		this.content = content;
	}
	

}
