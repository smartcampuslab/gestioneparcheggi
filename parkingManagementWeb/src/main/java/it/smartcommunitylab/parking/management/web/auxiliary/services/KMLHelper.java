package it.smartcommunitylab.parking.management.web.auxiliary.services;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import de.micromata.opengis.kml.v_2_2_0.Document;
import de.micromata.opengis.kml.v_2_2_0.ExtendedData;
import de.micromata.opengis.kml.v_2_2_0.Feature;
import de.micromata.opengis.kml.v_2_2_0.Folder;
import de.micromata.opengis.kml.v_2_2_0.Kml;
import de.micromata.opengis.kml.v_2_2_0.Placemark;
import de.micromata.opengis.kml.v_2_2_0.Point;
import de.micromata.opengis.kml.v_2_2_0.SimpleData;
import it.smartcommunitylab.parking.management.web.auxiliary.model.KMLData;

public class KMLHelper {

	public static List<KMLData> readData(InputStream is) {
		List<KMLData> data = new ArrayList<KMLData>();
		
		final Kml kml = Kml.unmarshal(is);
		final Document document = (Document)kml.getFeature();
		List<Feature> t = document.getFeature();
		for(Object o : t){
	        Folder f = (Folder)o;
	        List<Feature> tg = f.getFeature();
	        for(Object ftg : tg){
	            Placemark pm = (Placemark) ftg;
	            ExtendedData ext = pm.getExtendedData();
	            String name = "", id = "";
	            int total = 0;
	            for (SimpleData d: ext.getSchemaData().get(0).getSimpleData()) {
	            	if ("Name".equalsIgnoreCase(d.getName())) {
	            		name = d.getValue();
	            	}
	            	if ("Id".equalsIgnoreCase(d.getName())) {
	            		id = d.getValue();
	            	}
	            	if ("Total".equalsIgnoreCase(d.getName())) {
	            		total = Integer.parseInt(d.getValue());
	            	}
	            }
	            Point point = (Point)pm.getGeometry();
	            
	            KMLData kd = new KMLData();
	            kd.setName(name);
	            kd.setId(id);
	            kd.setLat(point.getCoordinates().get(0).getLatitude());
	            kd.setLon(point.getCoordinates().get(0).getLongitude());
	            kd.setTotal(total);
	            data.add(kd);
	        }
	    }
		return data;
	}
}
