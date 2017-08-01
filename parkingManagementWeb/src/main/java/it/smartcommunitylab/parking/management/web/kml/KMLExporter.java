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

import de.micromata.opengis.kml.v_2_2_0.Data;
import de.micromata.opengis.kml.v_2_2_0.Document;
import de.micromata.opengis.kml.v_2_2_0.ExtendedData;
import de.micromata.opengis.kml.v_2_2_0.Kml;
import de.micromata.opengis.kml.v_2_2_0.LinearRing;
import de.micromata.opengis.kml.v_2_2_0.Placemark;
import de.micromata.opengis.kml.v_2_2_0.PolyStyle;
import de.micromata.opengis.kml.v_2_2_0.Style;
import it.smartcommunitylab.parking.management.web.model.RateArea;
import it.smartcommunitylab.parking.management.web.model.RatePeriod;
import it.smartcommunitylab.parking.management.web.model.Street;
import it.smartcommunitylab.parking.management.web.model.Zone;
import it.smartcommunitylab.parking.management.web.model.geo.Point;
import it.smartcommunitylab.parking.management.web.model.geo.Polygon;
import it.smartcommunitylab.parking.management.web.model.slots.VehicleSlot;

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
			
			place.setDescription(area.getNote());
			
			ExtendedData data = place.createAndSetExtendedData();
			
			addRatePeriods(area.getValidityPeriod(), data);

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
	
	private void addRatePeriods(List<RatePeriod> rates, ExtendedData data) {
		if (rates == null) {
			return;
		}
		ObjectMapper mapper = new ObjectMapper();
		for (RatePeriod rate : rates) {
			Map<String, Object> map = mapper.convertValue(rate, Map.class);
			map.forEach((x, y) -> {
				if (x != null && y != null) {
					Data d = new Data(y.toString());
					d.setName("Period_" + (1 + rates.indexOf(rate)) + "_" + x);
					data.addToData(d);
				}
			});
		}
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
				
				ExtendedData data = place.createAndSetExtendedData();

				addDataFromStreet(street, data);		
				Data d = new Data(area.getName());
				d.setName("area");
				data.addToData(d);					
				
				de.micromata.opengis.kml.v_2_2_0.Polygon poly = place.createAndSetPolygon();
				LinearRing ring = poly.createAndSetOuterBoundaryIs().createAndSetLinearRing();

				for (Point point : street.getGeometry().getPoints()) {
					ring.addToCoordinates(point.getLng(), point.getLat());
				}
			}
		}
		return kml;
	}

	private void addDataFromStreet(Street street, ExtendedData data) {
		ObjectMapper mapper = new ObjectMapper();
		if (street.getSlotsConfiguration() != null) {
			for (VehicleSlot slot : street.getSlotsConfiguration()) {
				Map<String, Object> map = mapper.convertValue(slot, Map.class);
				String type = (String)map.remove("vehicleType");
				map.forEach((x,y) -> {
					if (x != null && y != null) {
					Data d = new Data(y.toString());
					d.setName(type + "_" + x);
					data.addToData(d);
					}
				});
			}
		}
		
		Data d = new Data(street.getSlotNumber().toString());
		d.setName("slotNumber");
		data.addToData(d);
		d = new Data(street.getSlotNumber().toString());
		d.setName("slotNumber");
		data.addToData(d);		
	}	
	
	
	public Kml exportZones(String appId, String zoneType) throws Exception {
		Kml kml = new Kml();

		Criteria criteria = new Criteria("id_app").is(appId).and("type").is(zoneType);
		Query query = new Query(criteria);

		List<Zone> zones = template.find(query, Zone.class, "zone");

		Set<String> colors = Sets.newHashSet();
		for (Zone zone : zones) {
			colors.add(validColor(zone.getColor()));
		}
		Map<String, Style> stylesMap = buildStylesMap(colors);	
		
		Document doc = kml.createAndSetDocument();
		doc.setName(zoneType.substring(0,1).toUpperCase() + zoneType.substring(1));
		for (Style style: stylesMap.values()) {
			doc.addToStyleSelector(style);
		}		
		for (Zone zone : zones) {
			String color = validColor(zone.getColor());
			
			Placemark place = doc.createAndAddPlacemark();
			place.setName(zone.getName());
			place.setStyleUrl("#" + color);
			
			place.setDescription(zone.getNote());
			
			ExtendedData data = place.createAndSetExtendedData();

			if (zone.getSubmacro() != null) {
				Data d = new Data(zone.getSubmacro());
				d.setName("macrozone");
				data.addToData(d);
			}
			if (zone.getSubmicro() != null) {
				Data d = new Data(zone.getSubmicro());
				d.setName("microzone");
				data.addToData(d);
			}

			if (zone.isGeometryFromSubelement()) {
				List<Street> streets = getStreetsInZone(zone.getId(), appId);

				for (Street street : streets) {
					List<Point> points = street.getGeometry().getPoints();
					de.micromata.opengis.kml.v_2_2_0.Polygon poly = place.createAndSetPolygon();
					LinearRing ring = poly.createAndSetOuterBoundaryIs().createAndSetLinearRing();

					for (Point point : points) {
						ring.addToCoordinates(point.getLng(), point.getLat());
					}
				}
			} else {
				Polygon polygon = zone.getGeometry();
				de.micromata.opengis.kml.v_2_2_0.Polygon poly = place.createAndSetPolygon();
				LinearRing ring = poly.createAndSetOuterBoundaryIs().createAndSetLinearRing();
	
				if (polygon != null && polygon.getPoints() != null) {
					for (Point point : polygon.getPoints()) {
						ring.addToCoordinates(point.getLng(), point.getLat());
					}
				}
			}
		}
		return kml;
	}	
	
	public Set<String> getTypes(String appId) {
		Criteria criteria = new Criteria("id_app").is(appId);
		Query query = new Query(criteria);
		query.fields().include("type");
		
		List<Zone> zones = template.find(query, Zone.class, "zone");
		
		return zones.stream().map(x -> x.getType()).collect(Collectors.toSet());
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
