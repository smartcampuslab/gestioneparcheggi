package it.smartcommunitylab.parking.management.web.bean;

import it.smartcommunitylab.parking.management.web.model.Zone;

import java.util.ArrayList;
import java.util.List;

public class StreetBean {
	private String id;
	private String id_app;
	private String streetReference;
	private Integer slotNumber;
	private Integer handicappedSlotNumber;
	private Integer handicappedSlotOccupied;
	private Integer timedParkSlotNumber;
	private Integer timedParkSlotOccupied;
	private Integer freeParkSlotNumber;
	private Integer freeParkSlotOccupied;
	private Integer freeParkSlotSignNumber;
	private Integer freeParkSlotSignOccupied;
	private Integer paidSlotNumber;
	private Integer paidSlotOccupied;
	private Integer unusuableSlotNumber;
	private boolean subscritionAllowedPark;
	private String rateAreaId;
	private LineBean geometry;
	private String color;
	private List<ZoneBean> zones;	//List with the id of the associated zone
	private Long lastChange;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getStreetReference() {
		return streetReference;
	}

	public void setStreetReference(String streetReference) {
		this.streetReference = streetReference;
	}

	public Integer getSlotNumber() {
		return slotNumber;
	}

	public void setSlotNumber(Integer slotNumber) {
		this.slotNumber = slotNumber;
	}

	public String getRateAreaId() {
		return rateAreaId;
	}

	public void setRateAreaId(String areaId) {
		this.rateAreaId = areaId;
	}

	public LineBean getGeometry() {
		return geometry;
	}

	public void setGeometry(LineBean geometry) {
		this.geometry = geometry;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public Integer getHandicappedSlotNumber() {
		return handicappedSlotNumber;
	}

	public void setHandicappedSlotNumber(Integer handicappedSlotNumber) {
		this.handicappedSlotNumber = handicappedSlotNumber;
	}

	public Integer getTimedParkSlotNumber() {
		return timedParkSlotNumber;
	}

	public void setTimedParkSlotNumber(Integer timedParkSlotNumber) {
		this.timedParkSlotNumber = timedParkSlotNumber;
	}

	public Integer getFreeParkSlotNumber() {
		return freeParkSlotNumber;
	}

	public void setFreeParkSlotNumber(Integer freeParkSlotNumber) {
		this.freeParkSlotNumber = freeParkSlotNumber;
	}

	public boolean isSubscritionAllowedPark() {
		return subscritionAllowedPark;
	}

	public void setSubscritionAllowedPark(boolean subscritionAllowedPark) {
		this.subscritionAllowedPark = subscritionAllowedPark;
	}

	public String getId_app() {
		return id_app;
	}

	public Integer getHandicappedSlotOccupied() {
		return handicappedSlotOccupied;
	}

	public Integer getTimedParkSlotOccupied() {
		return timedParkSlotOccupied;
	}

	public Integer getFreeParkSlotOccupied() {
		return freeParkSlotOccupied;
	}

	public Integer getFreeParkSlotSignNumber() {
		return freeParkSlotSignNumber;
	}

	public Integer getFreeParkSlotSignOccupied() {
		return freeParkSlotSignOccupied;
	}

	public Integer getPaidSlotNumber() {
		return paidSlotNumber;
	}

	public Integer getPaidSlotOccupied() {
		return paidSlotOccupied;
	}

	public List<ZoneBean> getZoneBeans() {
		return zones;
	}

	public Long getLastChange() {
		return lastChange;
	}

	public void setId_app(String id_app) {
		this.id_app = id_app;
	}

	public void setHandicappedSlotOccupied(Integer handicappedSlotOccupied) {
		this.handicappedSlotOccupied = handicappedSlotOccupied;
	}

	public void setTimedParkSlotOccupied(Integer timedParkSlotOccupied) {
		this.timedParkSlotOccupied = timedParkSlotOccupied;
	}

	public void setFreeParkSlotOccupied(Integer freeParkSlotOccupied) {
		this.freeParkSlotOccupied = freeParkSlotOccupied;
	}

	public void setFreeParkSlotSignNumber(Integer freeParkSlotSignNumber) {
		this.freeParkSlotSignNumber = freeParkSlotSignNumber;
	}

	public void setFreeParkSlotSignOccupied(Integer freeParkSlotSignOccupied) {
		this.freeParkSlotSignOccupied = freeParkSlotSignOccupied;
	}

	public void setPaidSlotNumber(Integer paidSlotNumber) {
		this.paidSlotNumber = paidSlotNumber;
	}

	public void setPaidSlotOccupied(Integer paidSlotOccupied) {
		this.paidSlotOccupied = paidSlotOccupied;
	}

	public void setZoneBeans(List<ZoneBean> zones) {
		this.zones = zones;
	}

	public void setLastChange(Long lastChange) {
		this.lastChange = lastChange;
	}
	
	
	
	public Integer getUnusuableSlotNumber() {
		return unusuableSlotNumber;
	}

	public void setUnusuableSlotNumber(Integer unusuableSlotNumber) {
		this.unusuableSlotNumber = unusuableSlotNumber;
	}

	public List<Zone> getZoneBeanToZone(){
		List<Zone> zons = new ArrayList<Zone>();
		if(this.zones != null){
			for(int i = 0; i < this.zones.size(); i++){
				Zone z = new Zone();
				z.setId(this.zones.get(i).getId());
				z.setId_app(this.zones.get(i).getId_app());
				z.setName(this.zones.get(i).getName());
				z.setNote(this.zones.get(i).getNote());
				z.setColor(this.zones.get(i).getColor());
				z.setSubmacro(this.zones.get(i).getSubmacro());
				z.setGeometry(this.zones.get(i).getGeometryObj());
				zons.add(z);
			}
		}
		return zons;
	}
	
}