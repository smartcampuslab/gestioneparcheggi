package it.smartcommunitylab.parking.management.web.auxiliary.services;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import de.micromata.opengis.kml.v_2_2_0.Coordinate;
import de.micromata.opengis.kml.v_2_2_0.Document;
import de.micromata.opengis.kml.v_2_2_0.ExtendedData;
import de.micromata.opengis.kml.v_2_2_0.Feature;
import de.micromata.opengis.kml.v_2_2_0.Folder;
import de.micromata.opengis.kml.v_2_2_0.Kml;
import de.micromata.opengis.kml.v_2_2_0.Placemark;
import de.micromata.opengis.kml.v_2_2_0.Polygon;
import de.micromata.opengis.kml.v_2_2_0.SimpleData;
import eu.trentorise.smartcampus.network.JsonUtils;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ViaBean;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ViaBean.PointBean;

public class ViaKMLHelper {

	public List<ViaBean> readKML(InputStream is) {
		List<ViaBean> res = new ArrayList<ViaBean>();
		final Kml kml = Kml.unmarshal(is);
		final Document document = (Document)kml.getFeature();
		List<Feature> t = document.getFeature();
		for(Object o : t){
	        Folder f = (Folder)o;
	        List<Feature> tg = f.getFeature();
	        for(Object ftg : tg){
	            Placemark pm = (Placemark) ftg;
	            ExtendedData ext = pm.getExtendedData();
	            Map<String,String> data = new HashMap<String, String>();
	            for (SimpleData d: ext.getSchemaData().get(0).getSimpleData()) {
	            	data.put(d.getName(), d.getValue());
	            }
	            ViaBean via = new ViaBean();
	            via.setId(data.get("ID_GRUPPO"));
	            via.setAreaId(data.get("MACROZONA")+"_"+data.get("SUB_MACRO"));
	            via.setMacroAreaId(data.get("MACROZONA"));
	            via.setSubMacroAreaId(data.get("SUB_MACRO"));
	            via.setColor(data.get("TARIFFA"));
	            if (data.containsKey("N_PARCOMET")) {
	            	via.setParkometerId(data.get("N_PARCOMET"));
	            }
	            if (data.containsKey("OFF_H")) {
	            	via.setHandicappedSlotNumber(Integer.parseInt(data.get("OFF_H")));
	            } else {
	            	via.setHandicappedSlotNumber(0);
	            }	
	            if (data.containsKey("OFF_P")) {
	            	via.setPaidSlotNumber(Integer.parseInt(data.get("OFF_P")));
	            } else {
	            	via.setPaidSlotNumber(0);
	            }	
	            if (data.containsKey("OFF_LS")) {
	            	via.setFreeParkSlotNumber(Integer.parseInt(data.get("OFF_LS")));
	            }
	            if ((via.getFreeParkSlotNumber() == null || via.getFreeParkSlotNumber() == 0) && 
	            		data.containsKey("OFF_LC")) {
	            	via.setFreeParkSlotNumber(Integer.parseInt(data.get("OFF_LC")));
	            } else {
	            	via.setFreeParkSlotNumber(0);
	            }	
	            if (data.containsKey("OFF_DO")) {
	            	via.setTimedParkSlotNumber(Integer.parseInt(data.get("OFF_DO")));
	            } else {
	            	via.setTimedParkSlotNumber(0);
	            }	
	            if (data.containsKey("OFF_TOT")) {
	            	via.setSlotNumber(Integer.parseInt(data.get("OFF_TOT")));
	            } else {
	            	via.setSlotNumber(0);
	            }	
	            if (data.containsKey("OFF_NORIS")) {
	            	via.setReservedSlotNumber(via.getSlotNumber()-Integer.parseInt(data.get("OFF_NORIS"))-via.getHandicappedSlotNumber());
	            } else {
		            via.setReservedSlotNumber(via.getSlotNumber());
	            }
	            via.setStreetReference(via.getId());
	            via.setSubscritionAllowedPark(false);

	            via.setGeometry(new ViaBean.LineBean());
	            via.getGeometry().setPoints(new ArrayList<ViaBean.PointBean>());
	            Polygon polygon = (Polygon)pm.getGeometry();
	            List<Coordinate> coordinates = polygon.getOuterBoundaryIs().getLinearRing().getCoordinates();
	            for (Coordinate c : coordinates) {
	            	PointBean pb = new ViaBean.PointBean();
	            	pb.setLat(c.getLatitude());
	            	pb.setLng(c.getLongitude());
	            	via.getGeometry().getPoints().add(pb);
	            }
	            
	            res.add(via);
	        }
	    }
		return res;
	}
	
	public static void main(String[] args) throws IOException {
		List<ViaBean> list = new ViaKMLHelper().readKML(ViaKMLHelper.class.getResourceAsStream("/data/soste/dati.kml"));
		String json = JsonUtils.toJSON(list);
		Writer w = new OutputStreamWriter(new FileOutputStream("src/main/resources/data/soste/dati.json"));
		w.write(json);
		w.flush();
		w.close();
	}
}
