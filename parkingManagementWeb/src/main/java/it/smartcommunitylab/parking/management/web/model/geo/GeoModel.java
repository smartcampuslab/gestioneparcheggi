package it.smartcommunitylab.parking.management.web.model.geo;

public abstract class GeoModel {
	private Geom geometry;

	public Geom getGeometry() {
		return geometry;
	}

	public void setGeometry(Geom geometry) {
		this.geometry = geometry;
	}
}
