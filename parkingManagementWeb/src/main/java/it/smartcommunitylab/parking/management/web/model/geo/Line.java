/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
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
