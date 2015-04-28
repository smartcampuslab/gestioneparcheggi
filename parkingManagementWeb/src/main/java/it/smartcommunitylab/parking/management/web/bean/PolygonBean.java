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
		if(points != null){
			for(int i = 0; i < points.size(); i++){
				Point p = new Point();
				p.setLat(points.get(i).getLat());
				p.setLng(points.get(i).getLng());
				pts.add(p);
			}
		}
		return pts;
	}
}
