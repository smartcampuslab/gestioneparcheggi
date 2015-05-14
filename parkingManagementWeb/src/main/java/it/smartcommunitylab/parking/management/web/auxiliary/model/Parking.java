package it.smartcommunitylab.parking.management.web.auxiliary.model;


public class Parking extends GeoObject {
	private static final long serialVersionUID = 8076535734041609036L;

	private int slotsTotal;
	private int slotsOccupiedOnTotal;
	private int slotsUnavailable;
	private LastChange lastChange;
	
	public int getSlotsTotal() {
		return slotsTotal;
	}

	public int getSlotsOccupiedOnTotal() {
		return slotsOccupiedOnTotal;
	}

	public void setSlotsOccupiedOnTotal(int mSlotsOccupiedOnTotal) {
		this.slotsOccupiedOnTotal = mSlotsOccupiedOnTotal;
	}

	public int getSlotsUnavailable() {
		return slotsUnavailable;
	}

	public void setSlotsUnavailable(int mSlotsUnavailable) {
		this.slotsUnavailable = mSlotsUnavailable;
	}

	public LastChange getLastChange() {
		return lastChange;
	}

	public void setSlotsTotal(int slotsTotal) {
		this.slotsTotal = slotsTotal;
	}

	public void setLastChange(LastChange lastChange) {
		this.lastChange = lastChange;
	}
}
