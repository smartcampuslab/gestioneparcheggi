package it.smartcommunitylab.parking.management.web.streetlife.model;

public class AlgoritmData {
	
	private String rideServices;
	private int flow;
	private int percentageDemand;
	private int maximumDemand;
	private int newParkingUsers;
	private String peakHourRate;
	private float co2Coefficient;
	private float cityCenterDistance;
	private float notTraveledKm;
	private int co2Saved;
	private int centerAverateOccupancyRate;
	private int newAverateOccupancyRate;
	
	public String getRideServices() {
		return rideServices;
	}

	public int getFlow() {
		return flow;
	}
	
	public int getPercentageDemand() {
		return percentageDemand;
	}

	public int getMaximumDemand() {
		return maximumDemand;
	}

	public int getNewParkingUsers() {
		return newParkingUsers;
	}

	public String getPeakHourRate() {
		return peakHourRate;
	}

	public float getCo2Coefficient() {
		return co2Coefficient;
	}

	public float getCityCenterDistance() {
		return cityCenterDistance;
	}

	public float getNotTraveledKm() {
		return notTraveledKm;
	}

	public int getCo2Saved() {
		return co2Saved;
	}

	public int getCenterAverateOccupancyRate() {
		return centerAverateOccupancyRate;
	}

	public int getNewAverateOccupancyRate() {
		return newAverateOccupancyRate;
	}

	public void setRideServices(String rideServices) {
		this.rideServices = rideServices;
	}

	public void setFlow(int flow) {
		this.flow = flow;
	}

	public void setPercentageDemand(int percentageDemand) {
		this.percentageDemand = percentageDemand;
	}

	public void setMaximumDemand(int maximumDemand) {
		this.maximumDemand = maximumDemand;
	}

	public void setNewParkingUsers(int newParkingUsers) {
		this.newParkingUsers = newParkingUsers;
	}

	public void setPeakHourRate(String peakHourRate) {
		this.peakHourRate = peakHourRate;
	}

	public void setCo2Coefficient(float co2Coefficient) {
		this.co2Coefficient = co2Coefficient;
	}

	public void setCityCenterDistance(float cityCenterDistance) {
		this.cityCenterDistance = cityCenterDistance;
	}

	public void setNotTraveledKm(float notTraveledKm) {
		this.notTraveledKm = notTraveledKm;
	}

	public void setCo2Saved(int co2Saved) {
		this.co2Saved = co2Saved;
	}

	public void setCenterAverateOccupancyRate(int centerAverateOccupancyRate) {
		this.centerAverateOccupancyRate = centerAverateOccupancyRate;
	}

	public void setNewAverateOccupancyRate(int newAverateOccupancyRate) {
		this.newAverateOccupancyRate = newAverateOccupancyRate;
	}

	public AlgoritmData() {
		// TODO Auto-generated constructor stub
	}

	public AlgoritmData(String rideServices, int flow, int percentageDemand, int maximumDemand, int newParkingUsers,
			String peakHourRate, float co2Coefficient, float cityCenterDistance, float notTraveledKm, int co2Saved,
			int centerAverateOccupancyRate, int newAverateOccupancyRate) {
		super();
		this.rideServices = rideServices;
		this.flow = flow;
		this.percentageDemand = percentageDemand;
		this.maximumDemand = maximumDemand;
		this.newParkingUsers = newParkingUsers;
		this.peakHourRate = peakHourRate;
		this.co2Coefficient = co2Coefficient;
		this.cityCenterDistance = cityCenterDistance;
		this.notTraveledKm = notTraveledKm;
		this.co2Saved = co2Saved;
		this.centerAverateOccupancyRate = centerAverateOccupancyRate;
		this.newAverateOccupancyRate = newAverateOccupancyRate;
	}
	
}
