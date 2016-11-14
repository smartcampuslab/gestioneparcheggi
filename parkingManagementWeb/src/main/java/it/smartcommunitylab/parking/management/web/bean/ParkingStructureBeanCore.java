package it.smartcommunitylab.parking.management.web.bean;

import java.util.List;
import java.util.Map;

import it.smartcommunitylab.parking.management.web.model.stats.StatValue;

public class ParkingStructureBeanCore {

	private String id;
	private String id_app;
	private String name;
	private Integer slotNumber;
	private List<String> zones;
	private Map<String, Object> occupancyData; // Attribute used in new rest API for planner
	private Map<String, StatValue> statValueData;
	
	public String getId() {
		return id;
	}
	
	public String getId_app() {
		return id_app;
	}
	
	public String getName() {
		return name;
	}
	
	public Integer getSlotNumber() {
		return slotNumber;
	}
	
	public List<String> getZones() {
		return zones;
	}
	
	public Map<String, Object> getOccupancyData() {
		return occupancyData;
	}
	
	public Map<String, StatValue> getStatValueData() {
		return statValueData;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setId_app(String id_app) {
		this.id_app = id_app;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setSlotNumber(Integer slotNumber) {
		this.slotNumber = slotNumber;
	}
	
	public void setZones(List<String> zones) {
		this.zones = zones;
	}
	
	public void setOccupancyData(Map<String, Object> occupancyData) {
		this.occupancyData = occupancyData;
	}
	
	public void setStatValueData(Map<String, StatValue> statValueData) {
		this.statValueData = statValueData;
	}
	
}
