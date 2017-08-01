package it.smartcommunitylab.parking.management.web.scripts;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.test.context.junit4.SpringRunner;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.MongoClient;

import it.smartcommunitylab.parking.management.web.kml.KMLExporter;

@RunWith(SpringRunner.class)
@SpringBootTest
@EnableConfigurationProperties
public class ExportKML {

	private MongoTemplate template;
	
	private ObjectMapper mapper;
	
	@Autowired
	private KMLExporter exporter;
	
	@Before
	public void init() {
		mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		MongoClient client = new MongoClient("localhost", 27017);
		SimpleMongoDbFactory f = new SimpleMongoDbFactory(client, "metroparco-db");

		template = new MongoTemplate(f);
	}
	
	@Test
	public void exportArea() throws Exception {
//		exporter.exportStreets("rv", new FileOutputStream("src/test/resources/streets.kml"));
//		exporter.exportParkings("rv");
	}

////	@Test
//	public void exportKML() throws Exception {
//		Kml kml = new Kml();
//		
//		List<RateArea> areas = template.findAll(RateArea.class, "rateArea");
//		Document doc = kml.createAndSetDocument();
//		for (RateArea area: areas) {
//			String id = area.getName() + "_" + area.getId();
//			System.err.println(area.getName() + " -> " + area.getColor());
//			Placemark place = doc.createAndAddPlacemark();
//			place.setName(area.getName());
//			place.setStyleUrl("#" + id);
////			place.createAndSetExtendedData().s
//			
//			Style style = new Style();
//			style.setId(id);
//			PolyStyle polyStyle = new PolyStyle();
//			style.setPolyStyle(polyStyle);
//			polyStyle.setColor("88" + area.getColor());
//			doc.addToStyleSelector(style);
//			for (Polygon polygon: area.getGeometry()) {
//				de.micromata.opengis.kml.v_2_2_0.Polygon poly = place.createAndSetPolygon();
//				LinearRing ring = poly.createAndSetOuterBoundaryIs().createAndSetLinearRing();
//				
//				for (Point point: polygon.getPoints()) {
//					ring.addToCoordinates(point.getLng(), point.getLat());
//				}
//			}
//		}
//		kml.marshal(new File("src/test/resources/test.kml"));
//	}

}
