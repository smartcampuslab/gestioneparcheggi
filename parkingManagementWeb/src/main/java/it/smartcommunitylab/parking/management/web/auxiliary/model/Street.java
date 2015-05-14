package it.smartcommunitylab.parking.management.web.auxiliary.model;


public class Street extends GeoObject {
	private static final long serialVersionUID = 387771948768252561L;

	/**
	 * parcheggi gratuiti totali/occupati
	 */
	private int slotsFree;
	private int slotsOccupiedOnFree;
	/**
	 * parcheggi liberi totali/occupati
	 */
	private int slotsUnavailable;
	/**
	 * parcheggi a pagamento totali/occupati
	 */
	private int slotsPaying;
	private int slotsOccupiedOnPaying;
	/**
	 * parcheggi a disco orario totali/occupati
	 */
	private int slotsTimed;
	private int slotsOccupiedOnTimed;

	private String polyline;
	
	private LastChange lastChange;
	
	private String areaId;
	
	public int getSlotsOccupiedOnFree() {
		return slotsOccupiedOnFree;
	}

	public void setSlotsOccupiedOnFree(int slotsOccupiedOnFree) {
		this.slotsOccupiedOnFree = slotsOccupiedOnFree;
	}

	public int getSlotsOccupiedOnPaying() {
		return slotsOccupiedOnPaying;
	}

	public void setSlotsOccupiedOnPaying(int slotsOccupiedOnPaying) {
		this.slotsOccupiedOnPaying = slotsOccupiedOnPaying;
	}

	public int getSlotsOccupiedOnTimed() {
		return slotsOccupiedOnTimed;
	}

	public void setSlotsOccupiedOnTimed(int slotsOccupiedOnTimed) {
		this.slotsOccupiedOnTimed = slotsOccupiedOnTimed;
	}

	public void setSlotsUnavailable(int slotsUnavailable) {
		this.slotsUnavailable = slotsUnavailable;
	}

	public int getSlotsFree() {
		return slotsFree;
	}

	public int getSlotsUnavailable() {
		return slotsUnavailable;
	}

	public int getSlotsPaying() {
		return slotsPaying;
	}

	public int getSlotsTimed() {
		return slotsTimed;
	}

	public LastChange getLastChange() {
		return lastChange;
	}

	public void setLastChange(LastChange lastChange) {
		this.lastChange = lastChange;
	}

	public String getPolyline() {
		return polyline;
	}

	public void setPolyline(String polyline) {
		this.polyline = polyline;
	}

	public void setSlotsFree(int slotsFree) {
		this.slotsFree = slotsFree;
	}

	public void setSlotsPaying(int slotsPaying) {
		this.slotsPaying = slotsPaying;
	}

	public void setSlotsTimed(int slotsTimed) {
		this.slotsTimed = slotsTimed;
	}

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}
}
