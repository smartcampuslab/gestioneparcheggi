package it.smartcommunitylab.parking.management.web.model.geo;

import java.util.List;

public class Polygon extends Geom {
	private List<Point> points;

	public List<Point> getPoints() {
		return points;
	}

	public void setPoints(List<Point> points) {
		this.points = points;
	}
}