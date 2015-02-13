package it.smartcommunitylab.parking.management.web.model;

import java.util.List;

import it.smartcommunitylab.parking.management.web.model.geo.Line;

public class Street {
	private String id;
	private String id_app;	// used to specify the actual app (tn, rv, ecc...)
	private String streetReference;
	private Integer slotNumber;
	private Integer handicappedSlotNumber;	// off_h
	private Integer handicappedSlotOccupied;
	private Integer timedParkSlotNumber;	// off_do
	private Integer timedParkSlotOccupied;
	private Integer freeParkSlotNumber;		// off_ls
	private Integer freeParkSlotOccupied;
	private Integer freeParkSlotSignNumber;	// off_lc
	private Integer freeParkSlotSignOccupied;
	private Integer paidSlotNumber;			// off_p
	private Integer paidSlotOccupied;
	private Integer unusuableSlotNumber;	// off_in
	private boolean subscritionAllowedPark;
	
	private Line geometry;
	private List<Zone> zones;
	private Long lastChange;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getId_app() {
		return id_app;
	}

	public void setId_app(String id_app) {
		this.id_app = id_app;
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

	public Line getGeometry() {
		return geometry;
	}

	public void setGeometry(Line geometry) {
		this.geometry = geometry;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof Street)) {
			return false;
		}
		Street v = (Street) obj;

		return v != null && this.id != null && v.getId().equals(this.id);
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

	public Integer getUnusuableSlotNumber() {
		return unusuableSlotNumber;
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

	public void setUnusuableSlotNumber(Integer unusuableSlotNumber) {
		this.unusuableSlotNumber = unusuableSlotNumber;
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

	public List<Zone> getZones() {
		return zones;
	}

	public void setZones(List<Zone> zones) {
		this.zones = zones;
	}

	public Long getLastChange() {
		return lastChange;
	}

	public void setLastChange(Long lastChange) {
		this.lastChange = lastChange;
	}
	
}
