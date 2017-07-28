package it.smartcommunitylab.parking.management.web.kml;

import java.io.OutputStream;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import de.micromata.opengis.kml.v_2_2_0.Document;
import de.micromata.opengis.kml.v_2_2_0.Kml;
import de.micromata.opengis.kml.v_2_2_0.LinearRing;
import de.micromata.opengis.kml.v_2_2_0.Placemark;
import de.micromata.opengis.kml.v_2_2_0.PolyStyle;
import de.micromata.opengis.kml.v_2_2_0.Style;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.Zone;
import it.smartcommunitylab.parking.management.web.model.geo.Point;
import it.smartcommunitylab.parking.management.web.model.geo.Polygon;

@Component
public class KMLExporter {

	private static final String ALPHA = "80";

	@Autowired
	private MongoTemplate template;

	private ObjectMapper mapper;

	public Kml exportArea(String appId) throws Exception {
		Kml kml = new Kml();

		Criteria criteria = new Criteria("id_app").is(appId);
		Query query = new Query(criteria);

		List<RateArea> areas = template.find(query, RateArea.class, "rateArea");

		Set<String> colors = Sets.newHashSet();
		for (RateArea area : areas) {
			colors.add(validColor(area.getColor()));
		}
		Map<String, Style> stylesMap = buildStylesMap(colors);	
		
		Document doc = kml.createAndSetDocument();
		doc.setName("Aree");
		for (Style style: stylesMap.values()) {
			doc.addToStyleSelector(style);
		}	
		
		for (RateArea area : areas) {
			String color = area.getColor();
			
			Placemark place = doc.createAndAddPlacemark();
			place.setName(area.getName());
			place.setStyleUrl("#" + color);

			for (Polygon polygon : area.getGeometry()) {
				de.micromata.opengis.kml.v_2_2_0.Polygon poly = place.createAndSetPolygon();
				LinearRing ring = poly.createAndSetOuterBoundaryIs().createAndSetLinearRing();

				for (Point point : polygon.getPoints()) {
					ring.addToCoordinates(point.getLng(), point.getLat());
				}
			}
		}
		return kml;
	}

	public Kml exportParkings(String appId) throws Exception {
		Kml kml = new Kml();

		Criteria criteria = new Criteria("id_app").is(appId);
		Query query = new Query(criteria);

		List<RateArea> areas = template.find(query, RateArea.class, "rateArea");

		Set<String> colors = Sets.newHashSet();
		for (RateArea area : areas) {
			colors.add(validColor(area.getColor()));
		}
		Map<String, Style> stylesMap = buildStylesMap(colors);	
		
		Document doc = kml.createAndSetDocument();
		doc.setName("Parcheggi");
		for (Style style: stylesMap.values()) {
			doc.addToStyleSelector(style);
		}	
		
		for (RateArea area : areas) {
			String color = area.getColor();
			for (Street street : area.getStreets().values()) {
				Placemark place = doc.createAndAddPlacemark();
				place.setName(street.getStreetReference());
				place.setStyleUrl("#" + color);				
				
				de.micromata.opengis.kml.v_2_2_0.Polygon poly = place.createAndSetPolygon();
				LinearRing ring = poly.createAndSetOuterBoundaryIs().createAndSetLinearRing();

				for (Point point : street.getGeometry().getPoints()) {
					ring.addToCoordinates(point.getLng(), point.getLat());
				}
			}
		}
		return kml;
	}

	public Kml exportStreets(String appId) throws Exception {
		Kml kml = new Kml();

		Criteria criteria = new Criteria("id_app").is(appId);
		Query query = new Query(criteria);
		query.fields().include("geometryFromSubelement").include("name").include("id");

		List<Zone> zones = template.find(query, Zone.class, "zone");

		Set<String> colors = Sets.newHashSet();
		for (Zone zone : zones) {
			if (!zone.isGeometryFromSubelement()) {
				continue;
			}		
			colors.add(validColor(zone.getColor()));
		}
		Map<String, Style> stylesMap = buildStylesMap(colors);	
		
		Document doc = kml.createAndSetDocument();
		doc.setName("Vie");
		for (Style style: stylesMap.values()) {
			doc.addToStyleSelector(style);
		}		
		for (Zone zone : zones) {
			if (!zone.isGeometryFromSubelement()) {
				continue;
			}
			String color = validColor(zone.getColor());
			
			Placemark place = doc.createAndAddPlacemark();
			place.setName(zone.getName());
			place.setStyleUrl("#" + color);

			List<Street> streets = getStreetsInZone(zone.getId(), appId);

			for (Street street : streets) {
				List<Point> points = street.getGeometry().getPoints();
				de.micromata.opengis.kml.v_2_2_0.Polygon poly = place.createAndSetPolygon();
				LinearRing ring = poly.createAndSetOuterBoundaryIs().createAndSetLinearRing();

				for (Point point : points) {
					ring.addToCoordinates(point.getLng(), point.getLat());
				}
			}
		}
		return kml;
	}

	public Kml exportMacroZone(String appId) throws Exception {
		Kml kml = new Kml();

		Criteria criteria = new Criteria("id_app").is(appId);
		Query query = new Query(criteria);

		List<Zone> zones = template.find(query, Zone.class, "zone");

		Set<String> colors = Sets.newHashSet();
		for (Zone zone : zones) {
			if (zone.isGeometryFromSubelement()) {
				continue;
			}		
			colors.add(validColor(zone.getColor()));
		}
		Map<String, Style> stylesMap = buildStylesMap(colors);
		
		Document doc = kml.createAndSetDocument();
		doc.setName("Zone");
		for (Style style: stylesMap.values()) {
			doc.addToStyleSelector(style);
		}			
		
		for (Zone zone : zones) {
			if (zone.isGeometryFromSubelement()) {
				continue;
			}
			String color = validColor(zone.getColor());
			
			Placemark place = doc.createAndAddPlacemark();
			place.setName(zone.getName());
			place.setStyleUrl("#" + color);

			Polygon polygon = zone.getGeometry();
			de.micromata.opengis.kml.v_2_2_0.Polygon poly = place.createAndSetPolygon();
			LinearRing ring = poly.createAndSetOuterBoundaryIs().createAndSetLinearRing();

			for (Point point : polygon.getPoints()) {
				ring.addToCoordinates(point.getLng(), point.getLat());
			}
		}
		return kml;
	}

	private List<Street> getStreetsInZone(String zoneId, String appId) {
		List<Street> result = Lists.newArrayList();

		Criteria criteria = new Criteria("id_app").is(appId);
		Query query = new Query(criteria);
		query.fields().include("streets");

		List<RateArea> areas = template.find(query, RateArea.class, "rateArea");
		for (RateArea area : areas) {
			result.addAll(area.getStreets().values().parallelStream().filter(x -> x.getZones().contains(zoneId)).collect(Collectors.toList()));
		}

		return result;
	}

	private String rgbTokml(String color) {
		String converted = color.substring(4, 6) + color.substring(2, 4) + color.substring(0, 2);
		return ALPHA + converted;
	}
	
	private String validColor(String color) {
		if (color != null && !color.isEmpty()) {
			return color;
		} else {
			return "808080";
		}
	}
	
	private Map<String, Style> buildStylesMap(Set<String> colors) {
		System.err.println(colors);
		Map<String, Style> result = Maps.newTreeMap();
		for (String color: colors) {
			Style style = new Style();
			style.setId(color);
			PolyStyle polyStyle = new PolyStyle();
			style.setPolyStyle(polyStyle);
			polyStyle.setColor(rgbTokml(color));
			result.put(color, style);
		}
		return result;
	}

	public void write(Kml kml, OutputStream os) throws Exception {
		kml.marshal(os);
		os.close();

	}	
	
	public void addTozip(Kml kml, String name, ZipOutputStream zos) throws Exception {
		ZipEntry entry = new ZipEntry(name + ".kml");
		zos.putNextEntry(entry);

		kml.marshal(zos);
	}	


}
