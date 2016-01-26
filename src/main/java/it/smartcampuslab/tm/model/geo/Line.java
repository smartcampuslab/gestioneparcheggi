package it.smartcampuslab.tm.model.geo;

import java.util.List;

public class Line extends Geom {
	private List<Point> points;

	public List<Point> getPoints() {
		return points;
	}

	public void setPoints(List<Point> points) {
		this.points = points;
	}
}
