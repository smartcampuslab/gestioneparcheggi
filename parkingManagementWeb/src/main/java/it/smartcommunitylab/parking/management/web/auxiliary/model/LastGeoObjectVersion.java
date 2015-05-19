package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.util.Arrays;

public class LastGeoObjectVersion {	//<T extends GeoObject>

	private String id;
	private double[] location;
	private String type;
	private Long updateTime;
	//private Long version;
	private boolean deleted;
	private String content;
	//private BasicDBObject content;
	//private T content;
	private String agency;
	
	public String getId() {
		return id;
	}
	
	public double[] getLocation() {
		return location;
	}
	
	public String getType() {
		return type;
	}
	
	public Long getUpdateTime() {
		return updateTime;
	}
	
//	public Long getVersion() {
//		return version;
//	}
	
	public boolean isDeleted() {
		return deleted;
	}
	
	public String getContent() {
		return content;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setLocation(double[] location) {
		this.location = location;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}
	
//	public void setVersion(Long version) {
//		this.version = version;
//	}
	
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
//	public BasicDBObject getContent() {
//		return content;
//	}

//	public void setContent(BasicDBObject content) {
//		this.content = content;
//	}
	
//	public T getContent() {
//		return content;
//	}

//	public void setContent(T content) {
//		this.content = content;
//	}
	
	public String getAgency() {
		return agency;
	}

	public void setAgency(String agency) {
		this.agency = agency;
	}

	@Override
	public String toString() {
		return "LastGeoObjectVersion [id=" + id + ", location="
				+ Arrays.toString(location) + ", type=" + type
				+ ", updateTime=" + updateTime + ", deleted=" + deleted
				+ ", content=" + content + ", agency=" + agency + "]";
	}

}
