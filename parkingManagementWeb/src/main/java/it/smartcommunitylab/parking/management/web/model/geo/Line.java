package it.smartcommunitylab.parking.management.web.model.geo;

import it.smartcommunitylab.parking.management.web.bean.PointBean;

import java.util.ArrayList;
import java.util.List;

public class Line extends Geom {
	private List<Point> points;

	public List<Point> getPoints() {
		return points;
	}

	public void setPoints(List<Point> points) {
		this.points = points;
	}
	
	public List<PointBean> getPointBeans() {
		List<PointBean> pointBeans = new ArrayList<PointBean>();
		if(points != null){
			for(Point p : points){
				PointBean pb = new PointBean();
				pb.setLat(p.getLat());
				pb.setLng(p.getLng());
				pointBeans.add(pb);
			}
		}
		return pointBeans;
	}
	
}
