package it.smartcommunitylab.parking.management.web.bean;

import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.RatePeriod;

import java.util.List;
import java.util.stream.Collectors;

public class SimpleRateArea {

	private List<SimpleParkingMeter> parkingMeters;
	private List<RatePeriod> validityPeriod;

	public SimpleRateArea(RateArea rateArea) {
		validityPeriod = rateArea.getValidityPeriod();
		parkingMeters = rateArea.getParkingMeters().values().stream().map(x -> new SimpleParkingMeter(x)).collect(Collectors.toList());
	}

	public List<SimpleParkingMeter> getParkingMeters() {
		return parkingMeters;
	}

	public void setParkingMeters(List<SimpleParkingMeter> geometry) {
		this.parkingMeters = geometry;
	}

	public List<RatePeriod> getValidityPeriod() {
		return validityPeriod;
	}

	public void setValidityPeriod(List<RatePeriod> validityPeriod) {
		this.validityPeriod = validityPeriod;
	}
	
}
