package it.smartcommunitylab.parking.management.web.model.slots;

public class VehicleSlot {
	
	private String vehicleType;			// type of vehicle that slots are for
	private Boolean vehicleTypeActive; 	// used to activate/disactive a specific vehicle type of slots
	
	// All possibility slots
	private Integer slotNumber;
	private Integer handicappedSlotNumber;		// off_h
	private Integer reservedSlotNumber;			// off_rs
	private Integer timedParkSlotNumber;		// off_do
	private Integer freeParkSlotNumber;			// off_ls
	private Integer freeParkSlotSignNumber;		// off_lc
	private Integer paidSlotNumber;				// off_p
	private Integer rechargeableSlotNumber;		// ricaricabili
	private Integer loadingUnloadingSlotNumber; // posti carico scarico
	private Integer pinkSlotNumber;				// posti rosa
	private Integer carSharingSlotNumber;		// posti car sharing
	
	private Integer unusuableSlotNumber;	// off_in
	
	// Dynamic data (for occupancy report only - used in DynamicManager)
	private Integer handicappedSlotOccupied;
	private Integer reservedSlotOccupied;
	private Integer timedParkSlotOccupied;
	private Integer freeParkSlotOccupied;
	private Integer freeParkSlotSignOccupied;
	private Integer paidSlotOccupied;
	private Integer rechargeableSlotOccupied;		// ricaricabili
	private Integer loadingUnloadingSlotOccupied; 	// posti carico scarico
	private Integer pinkSlotOccupied;				// posti rosa
	private Integer carSharingSlotOccupied;			// posti car sharing
	
	private Integer slotOccupied;
	
	public Integer getRechargeableSlotNumber() {
		return rechargeableSlotNumber;
	}

	public Integer getRechargeableSlotOccupied() {
		return rechargeableSlotOccupied;
	}

	public void setRechargeableSlotNumber(Integer rechargeableSlotNumber) {
		this.rechargeableSlotNumber = rechargeableSlotNumber;
	}

	public void setRechargeableSlotOccupied(Integer rechargeableSlotOccupied) {
		this.rechargeableSlotOccupied = rechargeableSlotOccupied;
	}

	public String getVehicleType() {
		return vehicleType;
	}

	public Integer getSlotNumber() {
		return slotNumber;
	}

	public Boolean getVehicleTypeActive() {
		return vehicleTypeActive;
	}

	public void setVehicleTypeActive(Boolean vehicleTypeActive) {
		this.vehicleTypeActive = vehicleTypeActive;
	}

	public Integer getHandicappedSlotNumber() {
		return handicappedSlotNumber;
	}

	public Integer getReservedSlotNumber() {
		return reservedSlotNumber;
	}

	public Integer getTimedParkSlotNumber() {
		return timedParkSlotNumber;
	}

	public Integer getFreeParkSlotNumber() {
		return freeParkSlotNumber;
	}

	public Integer getFreeParkSlotSignNumber() {
		return freeParkSlotSignNumber;
	}

	public Integer getPaidSlotNumber() {
		return paidSlotNumber;
	}

	public Integer getLoadingUnloadingSlotNumber() {
		return loadingUnloadingSlotNumber;
	}

	public Integer getPinkSlotNumber() {
		return pinkSlotNumber;
	}

	public Integer getCarSharingSlotNumber() {
		return carSharingSlotNumber;
	}

	public Integer getUnusuableSlotNumber() {
		return unusuableSlotNumber;
	}

	public Integer getHandicappedSlotOccupied() {
		return handicappedSlotOccupied;
	}

	public Integer getReservedSlotOccupied() {
		return reservedSlotOccupied;
	}

	public Integer getTimedParkSlotOccupied() {
		return timedParkSlotOccupied;
	}

	public Integer getFreeParkSlotOccupied() {
		return freeParkSlotOccupied;
	}

	public Integer getFreeParkSlotSignOccupied() {
		return freeParkSlotSignOccupied;
	}

	public Integer getPaidSlotOccupied() {
		return paidSlotOccupied;
	}

	public Integer getLoadingUnloadingSlotOccupied() {
		return loadingUnloadingSlotOccupied;
	}

	public Integer getPinkSlotOccupied() {
		return pinkSlotOccupied;
	}

	public Integer getCarSharingSlotOccupied() {
		return carSharingSlotOccupied;
	}

	public void setVehicleType(String vehicleType) {
		this.vehicleType = vehicleType;
	}

	public void setSlotNumber(Integer slotNumber) {
		this.slotNumber = slotNumber;
	}

	public void setHandicappedSlotNumber(Integer handicappedSlotNumber) {
		this.handicappedSlotNumber = handicappedSlotNumber;
	}

	public void setReservedSlotNumber(Integer reservedSlotNumber) {
		this.reservedSlotNumber = reservedSlotNumber;
	}

	public void setTimedParkSlotNumber(Integer timedParkSlotNumber) {
		this.timedParkSlotNumber = timedParkSlotNumber;
	}

	public void setFreeParkSlotNumber(Integer freeParkSlotNumber) {
		this.freeParkSlotNumber = freeParkSlotNumber;
	}

	public void setFreeParkSlotSignNumber(Integer freeParkSlotSignNumber) {
		this.freeParkSlotSignNumber = freeParkSlotSignNumber;
	}

	public void setPaidSlotNumber(Integer paidSlotNumber) {
		this.paidSlotNumber = paidSlotNumber;
	}

	public void setLoadingUnloadingSlotNumber(Integer loadingUnloadingSlotNumber) {
		this.loadingUnloadingSlotNumber = loadingUnloadingSlotNumber;
	}

	public void setPinkSlotNumber(Integer pinkSlotNumber) {
		this.pinkSlotNumber = pinkSlotNumber;
	}

	public void setCarSharingSlotNumber(Integer carSharingSlotNumber) {
		this.carSharingSlotNumber = carSharingSlotNumber;
	}

	public void setUnusuableSlotNumber(Integer unusuableSlotNumber) {
		this.unusuableSlotNumber = unusuableSlotNumber;
	}

	public void setHandicappedSlotOccupied(Integer handicappedSlotOccupied) {
		this.handicappedSlotOccupied = handicappedSlotOccupied;
	}

	public void setReservedSlotOccupied(Integer reservedSlotOccupied) {
		this.reservedSlotOccupied = reservedSlotOccupied;
	}

	public void setTimedParkSlotOccupied(Integer timedParkSlotOccupied) {
		this.timedParkSlotOccupied = timedParkSlotOccupied;
	}

	public void setFreeParkSlotOccupied(Integer freeParkSlotOccupied) {
		this.freeParkSlotOccupied = freeParkSlotOccupied;
	}

	public void setFreeParkSlotSignOccupied(Integer freeParkSlotSignOccupied) {
		this.freeParkSlotSignOccupied = freeParkSlotSignOccupied;
	}

	public void setPaidSlotOccupied(Integer paidSlotOccupied) {
		this.paidSlotOccupied = paidSlotOccupied;
	}

	public void setLoadingUnloadingSlotOccupied(Integer loadingUnloadingSlotOccupied) {
		this.loadingUnloadingSlotOccupied = loadingUnloadingSlotOccupied;
	}

	public void setPinkSlotOccupied(Integer pinkSlotOccupied) {
		this.pinkSlotOccupied = pinkSlotOccupied;
	}

	public void setCarSharingSlotOccupied(Integer carSharingSlotOccupied) {
		this.carSharingSlotOccupied = carSharingSlotOccupied;
	}

	public Integer getSlotOccupied() {
		return slotOccupied;
	}

	public void setSlotOccupied(Integer slotOccupied) {
		this.slotOccupied = slotOccupied;
	}

}
