package it.smartcommunitylab.parking.management.web.bean;

import java.util.Map;


public class DataLogBean {

	private String id;
	private String objId;
	private PointBean location;
	private String type;
	private Long updateTime;
	private Integer version;
	private boolean deleted;
	//private String content;
	private Map<String, Object> content;
	
	public String getId() {
		return id;
	}
	
	public String getObjId() {
		return objId;
	}

	public PointBean getLocation() {
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
	
//	public String getContent() {
//		return content;
//	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setObjId(String objId) {
		this.objId = objId;
	}
	
	public void setLocation(PointBean location) {
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

	public Map<String, Object> getContent() {
		return content;
	}

	public void setContent(Map<String, Object> content) {
		this.content = content;
	}
	
//	public void setContent(String content) {
//		this.content = content;
//	}
	

}
