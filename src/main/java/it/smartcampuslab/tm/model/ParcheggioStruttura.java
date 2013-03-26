package it.smartcampuslab.tm.model;

import it.smartcampuslab.tm.model.geo.Point;

import java.util.List;

public class ParcheggioStruttura {

	public static enum PaymentMode {
		CASH, AUTOMATED_TELLER, PREPAID_CARD
	}

	private String id;
	private String name;
	private String streetReference;
	private String managementMode;
	private String slotNumber;
	private String timeSlot;
	private List<PaymentMode> paymentMode;
	private String phoneNumber;
	private String fee;
	private Point geometry;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStreetReference() {
		return streetReference;
	}

	public void setStreetReference(String streetReference) {
		this.streetReference = streetReference;
	}

	public String getManagementMode() {
		return managementMode;
	}

	public void setManagementMode(String modality) {
		this.managementMode = modality;
	}

	public String getSlotNumber() {
		return slotNumber;
	}

	public void setSlotNumber(String slotNumber) {
		this.slotNumber = slotNumber;
	}

	public String getTimeSlot() {
		return timeSlot;
	}

	public void setTimeSlot(String timeSlot) {
		this.timeSlot = timeSlot;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getFee() {
		return fee;
	}

	public void setFee(String fee) {
		this.fee = fee;
	}

	public Point getGeometry() {
		return geometry;
	}

	public void setGeometry(Point geometry) {
		this.geometry = geometry;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setPaymentMode(List<PaymentMode> paymentMode) {
		this.paymentMode = paymentMode;
	}

	public List<PaymentMode> getPaymentMode() {
		return paymentMode;
	}

}
