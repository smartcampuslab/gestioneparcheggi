package it.smartcommunitylab.parking.management.web.bean;

import it.smartcommunitylab.parking.management.web.model.geo.Point;

import java.util.ArrayList;
import java.util.List;

public class PolygonBean {
	private List<PointBean> points;

	public List<PointBean> getPoints() {
		return points;
	}

	public void setPoints(List<PointBean> points) {
		this.points = points;
	}
	
	public List<Point> getPointObjs(){
		List<Point> pts = new ArrayList<Point>();
		for(int i = 0; i < points.size(); i++){
			Point p = new Point();
			p.setLat(points.get(i).getLat());
			p.setLng(points.get(i).getLng());
			pts.add(p);
		}
		return pts;
	}
}
