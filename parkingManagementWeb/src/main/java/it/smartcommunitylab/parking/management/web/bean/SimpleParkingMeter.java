package it.smartcommunitylab.parking.management.web.bean;

import java.util.List;

import com.google.common.collect.Lists;

import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter.Status;

public class SimpleParkingMeter {

	private Double lng;
	private Double lat;	
	private Status status;
	private List<String> paymentMethods;
	
	public SimpleParkingMeter(ParkingMeter pm) {
		if (pm.getGeometry() != null) {
			this.lat = pm.getGeometry().getLat();
			this.lng = pm.getGeometry().getLng();
		}
		this.status = pm.getStatus();
		this.paymentMethods = Lists.newArrayList(pm.getPaymentMethods());
	}
	
	public SimpleParkingMeter(Double lng, Double lat, Status status, List<String> paymentMethods) {
		super();
		this.lng = lng;
		this.lat = lat;
		this.status = status;
		this.paymentMethods = paymentMethods;
	}

	public Double getLng() {
		return lng;
	}

	public void setLng(Double lng) {
		this.lng = lng;
	}

	public Double getLat() {
		return lat;
	}

	public void setLat(Double lat) {
		this.lat = lat;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public List<String> getPaymentMethods() {
		return paymentMethods;
	}

	public void setPaymentMethods(List<String> paymentMethods) {
		this.paymentMethods = paymentMethods;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((lat == null) ? 0 : lat.hashCode());
		result = prime * result + ((lng == null) ? 0 : lng.hashCode());
		result = prime * result + ((paymentMethods == null) ? 0 : paymentMethods.hashCode());
		result = prime * result + ((status == null) ? 0 : status.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		SimpleParkingMeter other = (SimpleParkingMeter) obj;
		if (lat == null) {
			if (other.lat != null)
				return false;
		} else if (!lat.equals(other.lat))
			return false;
		if (lng == null) {
			if (other.lng != null)
				return false;
		} else if (!lng.equals(other.lng))
			return false;
		if (paymentMethods == null) {
			if (other.paymentMethods != null)
				return false;
		} else if (!paymentMethods.equals(other.paymentMethods))
			return false;
		if (status != other.status)
			return false;
		return true;
	}

}
