package it.smartcommunitylab.parking.management.web.auxiliary.model;

import java.util.List;

public class ViaBean {
	private String id;
	private String streetReference;
	private Integer slotNumber;
	private Integer handicappedSlotNumber;
	private Integer timedParkSlotNumber;
	private Integer freeParkSlotNumber;
	private Integer reservedSlotNumber;
	private Integer paidSlotNumber;
	private boolean subscritionAllowedPark;
	private String areaId;
	private String macroAreaId;
	private String subMacroAreaId;
	private LineBean geometry;
	private String color;

	private String parkometerId;
	
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

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
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

	public String getMacroAreaId() {
		return macroAreaId;
	}

	public void setMacroAreaId(String macroAreaId) {
		this.macroAreaId = macroAreaId;
	}

	public String getSubMacroAreaId() {
		return subMacroAreaId;
	}

	public void setSubMacroAreaId(String subMacroAreaId) {
		this.subMacroAreaId = subMacroAreaId;
	}

	public Integer getReservedSlotNumber() {
		return reservedSlotNumber;
	}

	public void setReservedSlotNumber(Integer reservedSlotNumber) {
		this.reservedSlotNumber = reservedSlotNumber;
	}

	public Integer getPaidSlotNumber() {
		return paidSlotNumber;
	}

	public void setPaidSlotNumber(Integer paidSlotNumber) {
		this.paidSlotNumber = paidSlotNumber;
	}

	public String getParkometerId() {
		return parkometerId;
	}

	public void setParkometerId(String parkometerId) {
		this.parkometerId = parkometerId;
	}


	public static class LineBean {
		private List<PointBean> points;

		public List<PointBean> getPoints() {
			return points;
		}

		public void setPoints(List<PointBean> points) {
			this.points = points;
		}
	}
	
	public static class PointBean {
		private double lat;
		private double lng;

		public double getLat() {
			return lat;
		}

		public void setLat(double lat) {
			this.lat = lat;
		}

		public double getLng() {
			return lng;
		}

		public void setLng(double lng) {
			this.lng = lng;
		}

	}
}