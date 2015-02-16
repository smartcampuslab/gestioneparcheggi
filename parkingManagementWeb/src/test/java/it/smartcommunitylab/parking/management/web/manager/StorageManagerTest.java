package it.smartcommunitylab.parking.management.web.manager;

import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.LineBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.PointBean;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter.Status;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Assert;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "/spring/applicationContext.xml" })
public class StorageManagerTest {

	private static final String appId="rv";
	
	@Autowired
	private StorageManager manager;

	@Test
	public void getParcometri() {
		Assert.assertTrue(manager.getAllParkingMeters().size() > 0);
	}

	@Test
	public void save() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException {
		
		// Rate Area Creation
		RateAreaBean area = new RateAreaBean();
		area.setId_app(appId);
		area.setName("Pasubio");
		area.setColor("29ea30");
		area.setFee(new Float(0.50));
		area.setTimeSlot("08:00 - 18:00");
		area.setSmsCode("567");
		area = manager.save(area);
		
		RateAreaBean area2 = new RateAreaBean();
		area2.setId_app(appId);
		area2.setName("Vittoria");
		area2.setColor("2b46ab");
		area2.setFee(new Float(1.00));
		area2.setTimeSlot("10:00 - 14:00");
		area2.setSmsCode("1234");
		area2 = manager.save(area2);
		
		RateAreaBean area3 = new RateAreaBean();
		area3.setId_app(appId);
		area3.setName("ZTL");
		area3.setColor("e52f70");
		area3.setFee(new Float(1.50));
		area3.setTimeSlot("08:00 - 20:00");
		area3.setSmsCode("1235");
		area3 = manager.save(area3);
		
		// Geo Zone creation
		ZoneBean z = new ZoneBean();
		z.setId_app(appId);
		z.setName("Brione");
		z.setSubmacro("B");
		z.setColor("33cc66");
		z = manager.save(z);
		
		ZoneBean z2 = new ZoneBean();
		z2.setId_app(appId);
		z2.setName("Brione");
		z2.setSubmacro("A");
		z2.setColor("990033");
		z2 = manager.save(z2);
		
		ZoneBean z3 = new ZoneBean();
		z3.setId_app(appId);
		z3.setName("Stadio");
		z3.setSubmacro("A");
		z3.setColor("ffddee");
		z3 = manager.save(z3);
		
		// Streets Creation
		StreetBean s = new StreetBean();
		s.setStreetReference("Via Unione");
		s.setFreeParkSlotNumber(0);
		s.setFreeParkSlotSignNumber(0);
		s.setPaidSlotNumber(10);
		s.setTimedParkSlotNumber(5);
		s.setHandicappedSlotNumber(1);
		s.setFreeParkSlotNumber(0);
		s.setSubscritionAllowedPark(false);
		s.setColor(area.getColor());
		s.setRateAreaId(area.getId());
		List<ZoneBean> zones = new ArrayList<ZoneBean>();
		zones.add(z);
		s.setZoneBeans(zones);
		
		StreetBean s2 = new StreetBean();
		s2.setStreetReference("Via Monte Nero");
		s2.setFreeParkSlotNumber(0);
		s2.setFreeParkSlotSignNumber(1);
		s2.setPaidSlotNumber(3);
		s2.setTimedParkSlotNumber(3);
		s2.setHandicappedSlotNumber(1);
		s2.setFreeParkSlotNumber(0);
		s2.setSubscritionAllowedPark(false);
		s2.setColor(area.getColor());
		s2.setRateAreaId(area.getId());
		s2.setZoneBeans(zones);
		
		StreetBean s3 = new StreetBean();
		s3.setStreetReference("Viale della Vittoria");
		s3.setFreeParkSlotNumber(2);
		s3.setFreeParkSlotSignNumber(3);
		s3.setPaidSlotNumber(3);
		s3.setTimedParkSlotNumber(0);
		s3.setHandicappedSlotNumber(1);
		s3.setFreeParkSlotNumber(0);
		s3.setSubscritionAllowedPark(true);
		s3.setColor(area2.getColor());
		s3.setRateAreaId(area2.getId());
		List<ZoneBean> zones2 = new ArrayList<ZoneBean>();
		zones2.add(z2);
		s3.setZoneBeans(zones2);
		
		StreetBean s4 = new StreetBean();
		s4.setStreetReference("Via Macerie1");
		s4.setFreeParkSlotNumber(0);
		s4.setFreeParkSlotSignNumber(0);
		s4.setPaidSlotNumber(15);
		s4.setTimedParkSlotNumber(3);
		s4.setHandicappedSlotNumber(1);
		s4.setFreeParkSlotNumber(0);
		s4.setSubscritionAllowedPark(true);
		s4.setColor(area3.getColor());
		s4.setRateAreaId(area3.getId());
		s4.setZoneBeans(zones2);
		
		StreetBean s5 = new StreetBean();
		s5.setStreetReference("Via Macerie2");
		s5.setFreeParkSlotNumber(2);
		s5.setFreeParkSlotSignNumber(0);
		s5.setPaidSlotNumber(3);
		s5.setTimedParkSlotNumber(1);
		s5.setHandicappedSlotNumber(1);
		s5.setFreeParkSlotNumber(0);
		s5.setSubscritionAllowedPark(false);
		s5.setColor(area3.getColor());
		s5.setRateAreaId(area3.getId());
		List<ZoneBean> zones3 = new ArrayList<ZoneBean>();
		zones3.add(z3);
		s5.setZoneBeans(zones3);
		
		// ParkingMeters Creation
		ParkingMeterBean p = new ParkingMeterBean();
		p.setAreaId(area.getId());
		p.setCode(1);
		p.setStatus(Status.ACTIVE);
		PointBean g1 = new PointBean();
		g1.setLat(45.88869383181654);
		g1.setLng(11.024340391159058);
		p.setGeometry(g1);
		
		ParkingMeterBean p2 = new ParkingMeterBean();
		p2.setAreaId(area.getId());
		p2.setCode(2);
		p2.setStatus(Status.INACTIVE);
		PointBean g2 = new PointBean();
		g2.setLat(45.88802918878782);
		g2.setLng(11.024115085601807);
		p.setGeometry(g2);
		
		ParkingMeterBean p3 = new ParkingMeterBean();
		p3.setAreaId(area.getId());
		p3.setCode(3);
		p3.setStatus(Status.ACTIVE);
		PointBean g3 = new PointBean();
		g3.setLat(45.889731853895526);
		g3.setLng(11.024951934814453);
		p.setGeometry(g3);
		
		ParkingMeterBean p4 = new ParkingMeterBean();
		p4.setAreaId(area2.getId());
		p4.setCode(1);
		p4.setStatus(Status.ACTIVE);
		PointBean g4 = new PointBean();
		g4.setLat(45.88669987887168);
		g4.setLng(11.028202772140503);
		p4.setGeometry(g4);
		
		ParkingMeterBean p5 = new ParkingMeterBean();
		p5.setAreaId(area2.getId());
		p5.setCode(2);
		p5.setStatus(Status.ACTIVE);
		PointBean g5 = new PointBean();
		g5.setLat(45.88552438375571);
		g5.setLng(11.029500961303711);
		p5.setGeometry(g5);
		
		ParkingMeterBean p6 = new ParkingMeterBean();
		p6.setAreaId(area2.getId());
		p6.setCode(3);
		p6.setStatus(Status.INACTIVE);
		PointBean g6 = new PointBean();
		g6.setLat(45.883851463705895);
		g6.setLng(11.026840209960938);
		p6.setGeometry(g6);
		
		ParkingMeterBean p7 = new ParkingMeterBean();
		p7.setAreaId(area3.getId());
		p7.setCode(1);
		p7.setStatus(Status.ACTIVE);
		PointBean g7 = new PointBean();
		g7.setLat(45.88669987887168);
		g7.setLng(11.028202772140503);
		p4.setGeometry(g7);
		
		ParkingMeterBean p8 = new ParkingMeterBean();
		p8.setAreaId(area3.getId());
		p8.setCode(2);
		p8.setStatus(Status.ACTIVE);
		PointBean g8 = new PointBean();
		g8.setLat(45.88552438375571);
		g8.setLng(11.029500961303711);
		p8.setGeometry(g8);
		
		ParkingMeterBean p9 = new ParkingMeterBean();
		p9.setAreaId(area3.getId());
		p9.setCode(4);
		p9.setStatus(Status.INACTIVE);
		PointBean g9 = new PointBean();
		g9.setLat(45.883851463705895);
		g9.setLng(11.026840209960938);
		p9.setGeometry(g9);
		
		ParkingMeterBean p10 = new ParkingMeterBean();
		p10.setAreaId(area3.getId());
		p10.setCode(121);
		p10.setStatus(Status.INACTIVE);
		PointBean g10 = new PointBean();
		g10.setLat(45.883851463705895);
		g10.setLng(11.026840209960938);
		p10.setGeometry(g10);
		
		//ParkingStructure Creation
		ParkingStructureBean ps = new ParkingStructureBean();
		ps.setName("Vittoria1");
		ps.setId_app(appId);
		ps.setManagementMode("Libera");
		ps.setStreetReference("Via della Vittoria 23");
		ps.setSlotNumber(240);
		ps.setHandicappedSlotNumber(10);
		ps.setUnusuableSlotNumber(5);
		ps.setTimeSlot("05:00 - 00:00");
		ps.setFee("2 euro/ora");
		ps.setPhoneNumber("0464112233");		
		List<String> payMode = new ArrayList<String>();
		payMode.add("AUTOMATED_TELLER");
		payMode.add("PARCOMETRO");
		ps.setPaymentMode(payMode);
		
		ParkingStructureBean ps2 = new ParkingStructureBean();
		ps2.setName("StazioneFS");
		ps2.setId_app(appId);
		ps2.setManagementMode("Libera");
		ps2.setStreetReference("Via della Vittoria 23");
		ps2.setSlotNumber(240);
		ps2.setHandicappedSlotNumber(10);
		ps2.setUnusuableSlotNumber(5);
		ps2.setTimeSlot("05:00 - 00:00");
		ps2.setFee("2,5 euro/ora");
		ps2.setPhoneNumber("0464511233");		
		List<String> payMode2 = new ArrayList<String>();
		payMode2.add("AUTOMATED_TELLER");
		payMode2.add("PREPAID_CARD");
		ps2.setPaymentMode(payMode2);
		
		// BikePoints Creation
		BikePointBean pb = new BikePointBean();
		pb.setId_app(appId);
		pb.setName("StazioneFS");
		pb.setSlotNumber(10);
		pb.setBikeNumber(8);
		PointBean geo = new PointBean();
		geo.setLat(45.889315);
		geo.setLng(11.033718);
		pb.setGeometry(geo);
		
		BikePointBean pb2 = new BikePointBean();
		pb2.setId_app(appId);
		pb2.setName("Quercia");
		pb2.setSlotNumber(25);
		pb2.setBikeNumber(25);
		PointBean geo2 = new PointBean();
		geo2.setLat(45.900247);
		geo2.setLng(11.036632);
		pb2.setGeometry(geo2);
		
		BikePointBean pb3 = new BikePointBean();
		pb3.setId_app(appId);
		pb3.setName("Biblioteca");
		pb3.setSlotNumber(25);
		pb3.setBikeNumber(25);
		PointBean geo3 = new PointBean();
		geo3.setLat(45.893628);
		geo3.setLng(11.043685);
		pb3.setGeometry(geo3);
		
		try {
			manager.save(s);
			manager.save(s2);
			manager.save(s3);
			manager.save(s4);
			manager.save(s5);
			manager.save(p);
			manager.save(p2);
			manager.save(p3);
			manager.save(p4);
			manager.save(p5);
			manager.save(p6);
			manager.save(p7);
			manager.save(p8);
			manager.save(p9);
			manager.save(p10);
			manager.save(ps);
			manager.save(ps2);
			manager.save(pb);
			manager.save(pb2);
			manager.save(pb3);
		} catch (DatabaseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		ObjectMapper mapper = new ObjectMapper();
		try {
			System.out.println(mapper.writeValueAsString(s));
			System.out.println(mapper.writeValueAsString(s2));
			System.out.println(mapper.writeValueAsString(s3));
			System.out.println(mapper.writeValueAsString(s4));
			System.out.println(mapper.writeValueAsString(s5));
			System.out.println(mapper.writeValueAsString(z));
		} catch (JsonGenerationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Assert.assertTrue(manager.getAllStreets(area).size() == 2);
		Assert.assertTrue(manager.getAllParkingMeters(area2).size() == 3);
		Assert.assertTrue(manager.getAllParkingStructure().size() == 2);
		Assert.assertTrue(manager.getAllBikePoints().size() == 3);
		// Filter street for zone
		Assert.assertTrue(manager.getAllStreets(z).size() == 2);
		
	}
	
	@Test
	public void delete() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException,
			JsonGenerationException, JsonMappingException, IOException {
		
		List<ParkingMeterBean> parkingMeters = manager.getAllParkingMeters();
		for(ParkingMeterBean pm : parkingMeters){
			manager.removeParkingMeter(pm.getAreaId(), pm.getId());
		}
		
		List<RateAreaBean> areas = manager.getAllArea();
		for(RateAreaBean area : areas){
			manager.removeArea(area.getId());
		}
		
		List<ParkingStructureBean> parkingStructs = manager.getAllParkingStructure();
		for(ParkingStructureBean ps : parkingStructs){
			manager.removeParkingStructure(ps.getId());
		}
		
		List<ZoneBean> zones = manager.getAllZone();
		for(ZoneBean z : zones){
			manager.removeZone(z.getId());
		}
		
		List<BikePointBean> bikePoints = manager.getAllBikePoints();
		for(BikePointBean bp : bikePoints){
			manager.removeBikePoint(bp.getId());
		}
		
		Assert.assertTrue(manager.getAllArea().size() == 0);
		Assert.assertTrue(manager.getAllParkingMeters().size() == 0);
		Assert.assertTrue(manager.getAllParkingStructure().size() == 0);
		Assert.assertTrue(manager.getAllZone().size() == 0);
		Assert.assertTrue(manager.getAllBikePoints().size() == 0);
		
	}

	@Test
	public void json() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException,
			JsonGenerationException, JsonMappingException, IOException {
		ParkingMeterBean p = new ParkingMeterBean();
		p.setAreaId("tt");
		p.setCode(3939);
		p.setNote("temp");
		p.setStatus(ParkingMeter.Status.INACTIVE);
		PointBean geom = new PointBean();
		geom.setLat(1l);
		geom.setLng(5l);
		p.setGeometry(geom);

		ObjectMapper mapper = new ObjectMapper();

//		String json = "{'id':null,'status':'INACTIVE','areaId':'tt','code':3939,'note':'temp','geometry':{'lat':1.0,'lng':5.0}}";

//		ParkingMeterBean pp = mapper.readValue(json.replaceAll("'", "\""),
//				ParkingMeterBean.class);
//		System.out.println(pp.getStatus().toString());
//		System.out.println(mapper.writeValueAsString(p));
		
		LineBean g = new LineBean();
		PointBean p1 = new PointBean();
		p1.setLat(3d);
		p1.setLat(4d);
		PointBean p2 = new PointBean();
		p2.setLat(13d);
		p2.setLat(14d);
		
		g.setPoints(Arrays.asList(p1,p2));
		StreetBean v = new StreetBean();
		v.setId("434343434343");
		v.setGeometry(g);
		System.out.println(mapper.writeValueAsString(v));
	}
}
