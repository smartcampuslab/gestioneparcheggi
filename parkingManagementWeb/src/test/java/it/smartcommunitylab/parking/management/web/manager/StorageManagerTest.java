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
package it.smartcommunitylab.parking.management.web.manager;

import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.LineBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.PointBean;
import it.smartcommunitylab.parking.management.web.bean.PolygonBean;
import it.smartcommunitylab.parking.management.web.bean.RateAreaBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter.Status;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;

@RunWith(SpringRunner.class)
//@ContextConfiguration(locations = { "classpath*:/spring/filterContext*.xml", "classpath*:/spring/SpringAppDispatcher-servlet*.xml" })
//@ContextConfiguration(locations = { "/spring/filterContext.xml", "/spring/SpringAppDispatcher-servlet.xml" })
@SpringBootTest//(classes = { ParkingConfig.class, SecurityConfig.class })
@EnableConfigurationProperties
public class StorageManagerTest {

	private static final String appId="rvtest";
	private static final String appIdTn="tntest";
	
	@Autowired
	private StorageManager manager;

	@Test
	public void saveRv() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException {
		
		//manager.setAppId(appId);
		
		// Rate Area Creation
		
		//Polygon List 1;
		List<PolygonBean> areaGeo = new ArrayList<PolygonBean>();
		PolygonBean pol1 = new PolygonBean();
		PointBean pbe1 = new PointBean();
		pbe1.setLat(45.893244);
		pbe1.setLng(11.024332);
		PointBean pbe2 = new PointBean();
		pbe2.setLat(45.894140);
		pbe2.setLng(11.029181);
		PointBean pbe3 = new PointBean();
		pbe3.setLat(45.891063);
		pbe3.setLng(11.034288);
		PointBean pbe4 = new PointBean();
		pbe4.setLat(45.886493);
		pbe4.setLng(11.032700);
		PointBean pbe5 = new PointBean();
		pbe5.setLat(45.884671);
		pbe5.setLng(11.026263);
		List<PointBean> points = new ArrayList<PointBean>();
		points.add(pbe1);
		points.add(pbe2);
		points.add(pbe3);
		points.add(pbe4);
		points.add(pbe5);
		pol1.setPoints(points);
		areaGeo.add(pol1);
		
		//Polygon List 2;
		List<PolygonBean> areaGeo2 = new ArrayList<PolygonBean>();
		PolygonBean pol12 = new PolygonBean();
		PointBean pbe12 = new PointBean();
		pbe12.setLat(45.886254);
		pbe12.setLng(11.028709);
		PointBean pbe22 = new PointBean();
		pbe22.setLat(45.887688);
		pbe22.setLng(11.032614);
		PointBean pbe32 = new PointBean();
		pbe32.setLat(45.885537);
		pbe32.setLng(11.034760);
		PointBean pbe42 = new PointBean();
		pbe42.setLat(45.884103);
		pbe42.setLng(11.029954);
		List<PointBean> points2 = new ArrayList<PointBean>();
		points2.add(pbe12);
		points2.add(pbe22);
		points2.add(pbe32);
		points2.add(pbe42);
		pol12.setPoints(points2);
		areaGeo2.add(pol12);
		
		RateAreaBean area = new RateAreaBean();
		area.setId_app(appId);
		area.setName("Pasubio");
		area.setColor("29ea30");
		//area.setFee(new Float(0.50));
		//area.setTimeSlot("08:00 - 18:00");
		area.setSmsCode("567");
		area.setGeometry(areaGeo);
		area.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		area = manager.save(area,appId, "rv_tes_091616", "userTest");
		
		RateAreaBean area2 = new RateAreaBean();
		area2.setId_app(appId);
		area2.setName("Vittoria");
		area2.setColor("2b46ab");
		//area2.setFee(new Float(1.00));
		//area2.setTimeSlot("10:00 - 14:00");
		area2.setSmsCode("1234");
		area2.setGeometry(areaGeo2);
		area2.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		area2 = manager.save(area2,appId, "rv_tes_091616", "userTest");
		
		RateAreaBean area3 = new RateAreaBean();
		area3.setId_app(appId);
		area3.setName("ZTL");
		area3.setColor("e52f70");
		//area3.setFee(new Float(1.50));
		//area3.setTimeSlot("08:00 - 20:00");
		area3.setSmsCode("1235");
		area3.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		area3 = manager.save(area3,appId, "rv_tes_091616", "userTest");
		
		// Geo Zone creation
		PolygonBean polz1 = new PolygonBean();
		PointBean pbz1 = new PointBean();
		pbz1.setLat(45.908888);
		pbz1.setLng(11.040167);
		PointBean pbz2 = new PointBean();
		pbz2.setLat(45.907784);
		pbz2.setLng(11.043772);
		PointBean pbz3 = new PointBean();
		pbz3.setLat(45.905036);
		pbz3.setLng(11.043729);
		PointBean pbz4 = new PointBean();
		pbz4.setLat(45.904350);
		pbz4.setLng(11.040038);
		PointBean pbz5 = new PointBean();
		pbz5.setLat(45.907037);
		pbz5.setLng(11.037979);
		List<PointBean> pointsz = new ArrayList<PointBean>();
		pointsz.add(pbz1);
		pointsz.add(pbz2);
		pointsz.add(pbz3);
		pointsz.add(pbz4);
		pointsz.add(pbz5);
		polz1.setPoints(pointsz);
		
		ZoneBean z = new ZoneBean();
		z.setId_app(appId);
		z.setName("Brione");
		z.setSubmacro("B");
		z.setColor("33cc66");
		z.setGeometry(polz1);
		z.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		z = manager.save(z,appId, "rv_tes_091616", "userTest");
		
		PolygonBean polz2 = new PolygonBean();
		PointBean pbz21 = new PointBean();
		pbz21.setLat(45.903603);
		pbz21.setLng(11.040811);
		PointBean pbz22 = new PointBean();
		pbz22.setLat(45.903842);
		pbz22.setLng(11.045274);
		PointBean pbz23 = new PointBean();
		pbz23.setLat(45.900915);
		pbz23.setLng(11.046647);
		PointBean pbz24 = new PointBean();
		pbz24.setLat(45.900198);
		pbz24.setLng(11.044201);
		PointBean pbz25 = new PointBean();
		pbz25.setLat(45.901542);
		pbz25.setLng(11.041283);
		List<PointBean> pointsz2 = new ArrayList<PointBean>();
		pointsz2.add(pbz21);
		pointsz2.add(pbz22);
		pointsz2.add(pbz23);
		pointsz2.add(pbz24);
		pointsz2.add(pbz25);
		polz2.setPoints(pointsz2);
		
		ZoneBean z2 = new ZoneBean();
		z2.setId_app(appId);
		z2.setName("Brione");
		z2.setSubmacro("A");
		z2.setColor("990033");
		z2.setGeometry(polz2);
		z2.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		z2 = manager.save(z2,appId, "rv_tes_091616", "userTest");
		
		PolygonBean polz3 = new PolygonBean();
		PointBean pbz31 = new PointBean();
		pbz31.setLat(45.902976);
		pbz31.setLng(11.036777);
		PointBean pbz32 = new PointBean();
		pbz32.setLat(45.901990);
		pbz32.setLng(11.039910);
		PointBean pbz33 = new PointBean();
		pbz33.setLat(45.899243);
		pbz33.setLng(11.041755);
		PointBean pbz34 = new PointBean();
		pbz34.setLat(45.900139);
		pbz34.setLng(11.035961);
		List<PointBean> pointsz3 = new ArrayList<PointBean>();
		pointsz3.add(pbz31);
		pointsz3.add(pbz32);
		pointsz3.add(pbz33);
		pointsz3.add(pbz34);
		polz3.setPoints(pointsz3);
		
		ZoneBean z3 = new ZoneBean();
		z3.setId_app(appId);
		z3.setName("Stadio");
		z3.setSubmacro("A");
		z3.setColor("ffddee");
		z3.setGeometry(polz3);
		z3.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		z3 = manager.save(z3,appId, "rv_tes_091616", "userTest");
		
		// Streets Creation
		PointBean pbes1 = new PointBean();
		pbes1.setLat(45.890306864971116);
		pbes1.setLng(11.025209426879883);
		PointBean pbes2 = new PointBean();
		pbes2.setLat(45.889261385860465);
		pbes2.setLng(11.024823188781738);
		PointBean pbes3 = new PointBean();
		pbes3.setLat(45.88875357462059);
		pbes3.setLng(11.024394035339355);
		PointBean pbes4 = new PointBean();
		pbes4.setLat(45.88881331736036);
		pbes4.setLng(11.024651527404785);
		PointBean pbes5 = new PointBean();
		pbes5.setLat(45.88875357462059);
		pbes5.setLng(11.024394035339355);
		List<PointBean> pointsS = new ArrayList<PointBean>();
		pointsS.add(pbes1);
		pointsS.add(pbes2);
		pointsS.add(pbes3);
		pointsS.add(pbes4);
		pointsS.add(pbes5);
		LineBean line1 = new LineBean();
		line1.setPoints(pointsS);
		
		StreetBean s = new StreetBean();
		s.setStreetReference("Via Unione");
		s.setId_app(appId);
		s.setSlotNumber(16);
		/*s.setFreeParkSlotNumber(0);
		s.setFreeParkSlotSignNumber(0);
		s.setPaidSlotNumber(10);
		s.setTimedParkSlotNumber(5);
		s.setHandicappedSlotNumber(1);
		s.setFreeParkSlotNumber(0);*/
		s.setSubscritionAllowedPark(false);
		s.setColor(area.getColor());
		s.setRateAreaId(area.getId());
		s.setGeometry(line1);
		List<String> zones = new ArrayList<String>();
		zones.add(z.getId());
		s.setZones(zones);
		
		StreetBean s2 = new StreetBean();
		s2.setStreetReference("Via Monte Nero");
		s2.setId_app(appId);
		s2.setSlotNumber(8);
		/*s2.setFreeParkSlotNumber(0);
		s2.setFreeParkSlotSignNumber(1);
		s2.setPaidSlotNumber(3);
		s2.setTimedParkSlotNumber(3);
		s2.setHandicappedSlotNumber(1);
		s2.setFreeParkSlotNumber(0);*/
		s2.setSubscritionAllowedPark(false);
		s2.setColor(area.getColor());
		s2.setRateAreaId(area.getId());
		s2.setZones(zones);
		
		StreetBean s3 = new StreetBean();
		s3.setStreetReference("Viale della Vittoria");
		s3.setId_app(appId);
		s3.setSlotNumber(9);
		/*s3.setFreeParkSlotNumber(2);
		s3.setFreeParkSlotSignNumber(3);
		s3.setPaidSlotNumber(3);
		s3.setTimedParkSlotNumber(0);
		s3.setHandicappedSlotNumber(1);
		s3.setFreeParkSlotNumber(0);*/
		s3.setSubscritionAllowedPark(true);
		s3.setColor(area2.getColor());
		s3.setRateAreaId(area2.getId());
		List<String> zones2 = new ArrayList<String>();
		zones2.add(z2.getId());
		s3.setZones(zones2);
		
		StreetBean s4 = new StreetBean();
		s4.setStreetReference("Via Macerie1");
		s4.setId_app(appId);
		s4.setSlotNumber(19);
		/*s4.setFreeParkSlotNumber(0);
		s4.setFreeParkSlotSignNumber(0);
		s4.setPaidSlotNumber(15);
		s4.setTimedParkSlotNumber(3);
		s4.setHandicappedSlotNumber(1);
		s4.setFreeParkSlotNumber(0);*/
		s4.setSubscritionAllowedPark(true);
		s4.setColor(area3.getColor());
		s4.setRateAreaId(area3.getId());
		s4.setZones(zones2);
		List<String> pms1 = new ArrayList<String>();
		pms1.add("7");
		s4.setParkingMeters(pms1);
		
		StreetBean s5 = new StreetBean();
		s5.setStreetReference("Via Macerie2");
		s5.setId_app(appId);
		s5.setSlotNumber(7);
		/*s5.setFreeParkSlotNumber(2);
		s5.setFreeParkSlotSignNumber(0);
		s5.setPaidSlotNumber(3);
		s5.setTimedParkSlotNumber(1);
		s5.setHandicappedSlotNumber(1);
		s5.setFreeParkSlotNumber(0);*/
		s5.setSubscritionAllowedPark(false);
		s5.setColor(area3.getColor());
		s5.setRateAreaId(area3.getId());
		List<String> zones3 = new ArrayList<String>();
		zones3.add(z3.getId());
		s5.setZones(zones3);
		List<String> pms2 = new ArrayList<String>();
		pms2.add("8");
		s5.setParkingMeters(pms2);
		
		// ParkingMeters Creation
		ParkingMeterBean p = new ParkingMeterBean();
		p.setId_app(appId);
		p.setAreaId(area.getId());
		p.setCode(1);
		p.setStatus(Status.ACTIVE);
		PointBean g1 = new PointBean();
		g1.setLat(45.88869383181654);
		g1.setLng(11.024340391159058);
		p.setGeometry(g1);
		
		ParkingMeterBean p2 = new ParkingMeterBean();
		p2.setId_app(appId);
		p2.setAreaId(area.getId());
		p2.setCode(2);
		p2.setStatus(Status.INACTIVE);
		PointBean g2 = new PointBean();
		g2.setLat(45.88802918878782);
		g2.setLng(11.024115085601807);
		p2.setGeometry(g2);
		
		ParkingMeterBean p3 = new ParkingMeterBean();
		p3.setId_app(appId);
		p3.setAreaId(area.getId());
		p3.setCode(3);
		p3.setStatus(Status.ACTIVE);
		PointBean g3 = new PointBean();
		g3.setLat(45.889731853895526);
		g3.setLng(11.024951934814453);
		p3.setGeometry(g3);
		
		ParkingMeterBean p4 = new ParkingMeterBean();
		p4.setId_app(appId);
		p4.setAreaId(area2.getId());
		p4.setCode(4);
		p4.setStatus(Status.ACTIVE);
		PointBean g4 = new PointBean();
		g4.setLat(45.88669987887168);
		g4.setLng(11.028202772140503);
		p4.setGeometry(g4);
		
		ParkingMeterBean p5 = new ParkingMeterBean();
		p5.setId_app(appId);
		p5.setAreaId(area2.getId());
		p5.setCode(5);
		p5.setStatus(Status.ACTIVE);
		PointBean g5 = new PointBean();
		g5.setLat(45.88552438375571);
		g5.setLng(11.029500961303711);
		p5.setGeometry(g5);
		
		ParkingMeterBean p6 = new ParkingMeterBean();
		p6.setId_app(appId);
		p6.setAreaId(area2.getId());
		p6.setCode(6);
		p6.setStatus(Status.INACTIVE);
		PointBean g6 = new PointBean();
		g6.setLat(45.883851463705895);
		g6.setLng(11.026840209960938);
		p6.setGeometry(g6);
		
		ParkingMeterBean p7 = new ParkingMeterBean();
		p.setId_app(appId);
		p7.setAreaId(area3.getId());
		p7.setCode(7);
		p7.setStatus(Status.ACTIVE);
		PointBean g7 = new PointBean();
		g7.setLat(45.8891493690743);
		g7.setLng(11.04399561882019);
		p7.setGeometry(g7);
		
		ParkingMeterBean p8 = new ParkingMeterBean();
		p8.setId_app(appId);
		p8.setAreaId(area3.getId());
		p8.setCode(8);
		p8.setStatus(Status.ACTIVE);
		PointBean g8 = new PointBean();
		g8.setLat(45.887794694672756);
		g8.setLng(11.044692993164062);
		p8.setGeometry(g8);
		
		ParkingMeterBean p9 = new ParkingMeterBean();
		p9.setId_app(appId);
		p9.setAreaId(area3.getId());
		p9.setCode(9);
		p9.setStatus(Status.INACTIVE);
		PointBean g9 = new PointBean();
		g9.setLat(45.8880336693716);
		g9.setLng(11.04301929473877);
		p9.setGeometry(g9);
		
		ParkingMeterBean p10 = new ParkingMeterBean();
		p10.setId_app(appId);
		p10.setAreaId(area3.getId());
		p10.setCode(121);
		p10.setStatus(Status.INACTIVE);
		PointBean g10 = new PointBean();
		g10.setLat(45.889586979854);
		g10.setLng(11.046624183654785);
		p10.setGeometry(g10);
		
		//ParkingStructure Creation
		ParkingStructureBean ps = new ParkingStructureBean();
		ps.setName("Vittoria1");
		ps.setId_app(appId);
		ps.setManagementMode("Libera");
		ps.setStreetReference("Via della Vittoria 23");
		ps.setSlotNumber(240);
		/*ps.setHandicappedSlotNumber(10);
		ps.setUnusuableSlotNumber(5);*/
		ps.setPhoneNumber("0464112233");
		PointBean g11 = new PointBean();
		g11.setLat(45.887509);
		g11.setLng(11.032121);
		ps.setGeometry(g11);
		List<String> payMode = new ArrayList<String>();
//		payMode.add("AUTOMATED_TELLER");
		payMode.add("PREPAID_CARD");
		ps.setPaymentMode(payMode);
		ps.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		
		ParkingStructureBean ps2 = new ParkingStructureBean();
		ps2.setName("StazioneFS");
		ps2.setId_app(appId);
		ps2.setManagementMode("Libera");
		ps2.setStreetReference("Via Stazione 1");
		ps2.setSlotNumber(200);
		/*ps2.setHandicappedSlotNumber(10);
		ps2.setUnusuableSlotNumber(5);*/
		ps2.setPhoneNumber("0464511233");	
		PointBean g12 = new PointBean();
		g12.setLat(45.891057);
		g12.setLng(11.033929);
		ps2.setGeometry(g12);
		List<String> payMode2 = new ArrayList<String>();
//		payMode2.add("AUTOMATED_TELLER");
		payMode2.add("PREPAID_CARD");
		ps2.setPaymentMode(payMode2);
		ps2.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		
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
		pb.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		
		BikePointBean pb2 = new BikePointBean();
		pb2.setId_app(appId);
		pb2.setName("Quercia");
		pb2.setSlotNumber(25);
		pb2.setBikeNumber(25);
		PointBean geo2 = new PointBean();
		geo2.setLat(45.900247);
		geo2.setLng(11.036632);
		pb2.setGeometry(geo2);
		pb2.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		
		BikePointBean pb3 = new BikePointBean();
		pb3.setId_app(appId);
		pb3.setName("Biblioteca");
		pb3.setSlotNumber(25);
		pb3.setBikeNumber(25);
		PointBean geo3 = new PointBean();
		geo3.setLat(45.893628);
		geo3.setLng(11.043685);
		pb3.setGeometry(geo3);
		pb3.setAgencyId(Lists.newArrayList("rv_tes_091616"));
		
		try {
			manager.save(s,appId, "rv_tes_091616", "userTest");
			manager.save(s2,appId, "rv_tes_091616", "userTest");
			manager.save(s3,appId, "rv_tes_091616", "userTest");
			manager.save(s4,appId, "rv_tes_091616", "userTest");
			manager.save(s5,appId, "rv_tes_091616", "userTest");
			manager.save(p,appId, "rv_tes_091616", "userTest");
			manager.save(p2,appId, "rv_tes_091616", "userTest");
			manager.save(p3,appId, "rv_tes_091616", "userTest");
			manager.save(p4,appId, "rv_tes_091616", "userTest");
			manager.save(p5,appId, "rv_tes_091616", "userTest");
			manager.save(p6,appId, "rv_tes_091616", "userTest");
			manager.save(p7,appId,"rv_tes_091616", "userTest");
			manager.save(p8,appId, "rv_tes_091616", "userTest");
			manager.save(p9,appId, "rv_tes_091616", "userTest");
			manager.save(p10,appId, "rv_tes_091616", "userTest");
			manager.save(ps,appId, "rv_tes_091616", "userTest");
			manager.save(ps2,appId, "rv_tes_091616", "userTest");
			manager.save(pb,appId, "rv_tes_091616", "userTest");
			manager.save(pb2,appId, "rv_tes_091616", "userTest");
			manager.save(pb3,appId, "rv_tes_091616", "userTest");
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
		
		Assert.assertTrue(manager.getAllStreets(area,appId).size() == 2);
		Assert.assertTrue(manager.getAllParkingMeters(area2,appId).size() == 3);
		Assert.assertTrue(manager.getAllParkingStructure(appId).size() == 2);
		Assert.assertTrue(manager.getAllBikePoints(appId).size() == 3);
		// Filter street for zone
		Assert.assertTrue(manager.getAllStreets(z, appId).size() == 2);
		
	}
	
	@Test
	public void saveTn() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException {
		//manager.setAppId(appIdTn);
		
		// Rate Area Creation
		
		//Polygon List 1;
		List<PolygonBean> areaGeo = new ArrayList<PolygonBean>();
		PolygonBean pol1 = new PolygonBean();
		PointBean pbe1 = new PointBean();
		pbe1.setLat(46.080177);
		pbe1.setLng(11.121920);
		PointBean pbe2 = new PointBean();
		pbe2.setLat(46.078554);
		pbe2.setLng(11.127177);
		PointBean pbe3 = new PointBean();
		pbe3.setLat(46.074863);
		pbe3.setLng(11.127520);
		PointBean pbe4 = new PointBean();
		pbe4.setLat(46.074476);
		pbe4.setLng(11.125267);
		PointBean pbe5 = new PointBean();
		pbe5.setLat(46.075339);
		pbe5.setLng(11.124688);
		PointBean pbe6 = new PointBean();
		pbe6.setLat(46.075190);
		pbe6.setLng(11.123636);
		PointBean pbe7 = new PointBean();
		pbe7.setLat(46.075845);
		pbe7.setLng(11.122649);
		PointBean pbe8 = new PointBean();
		pbe8.setLat(46.076262);
		pbe8.setLng(11.122006);
		List<PointBean> points = new ArrayList<PointBean>();
		points.add(pbe1);
		points.add(pbe2);
		points.add(pbe3);
		points.add(pbe4);
		points.add(pbe5);
		points.add(pbe6);
		points.add(pbe7);
		points.add(pbe8);
		pol1.setPoints(points);
		areaGeo.add(pol1);
		
		RateAreaBean area = new RateAreaBean();
		area.setId_app(appIdTn);
		area.setName("Area di 2a corona - zona blu");
		area.setColor("2032e4");
		//area.setFee(new Float(1.00));
		//area.setTimeSlot("08:00 - 19:30");
		area.setSmsCode("726");
		area.setGeometry(areaGeo);
		area.setAgencyId(Lists.newArrayList("tn_tes_091516"));
		area = manager.save(area, appIdTn, "tn_tes_091516", "userTest");
		
		// Geo Zone creation
		PolygonBean polz1 = new PolygonBean();
		PointBean pbz1 = new PointBean();
		pbz1.setLat(46.070159);
		pbz1.setLng(11.118186);
		PointBean pbz2 = new PointBean();
		pbz2.setLat(46.072153);
		pbz2.setLng(11.124752);
		PointBean pbz3 = new PointBean();
		pbz3.setLat(46.069861);
		pbz3.setLng(11.127971);
		PointBean pbz4 = new PointBean();
		pbz4.setLat(46.065544);
		pbz4.setLng(11.125353);
		PointBean pbz5 = new PointBean();
		pbz5.setLat(46.064859);
		pbz5.setLng(11.119388);
		List<PointBean> pointsz = new ArrayList<PointBean>();
		pointsz.add(pbz1);
		pointsz.add(pbz2);
		pointsz.add(pbz3);
		pointsz.add(pbz4);
		pointsz.add(pbz5);
		polz1.setPoints(pointsz);
		
		ZoneBean z = new ZoneBean();
		z.setId_app(appIdTn);
		z.setName("Zona a Traffico Limitato");
		//z.setSubmacro("B");
		z.setColor("e3e427");
		z.setType("zona tm trento");
		z.setGeometry(polz1);
		z.setAgencyId(Lists.newArrayList("tn_tes_091516"));
		z = manager.save(z,appIdTn, "tn_tes_091516", "userTest");
		
		
		// Streets Creation
		PointBean pbes1 = new PointBean();
		pbes1.setLat(46.077721);
		pbes1.setLng(11.123872);
		PointBean pbes2 = new PointBean();
		pbes2.setLat(46.077177);
		pbes2.setLng(11.124462);
		PointBean pbes3 = new PointBean();
		pbes3.setLat(46.076426);
		pbes3.setLng(11.124870);
		List<PointBean> pointsS = new ArrayList<PointBean>();
		pointsS.add(pbes1);
		pointsS.add(pbes2);
		pointsS.add(pbes3);
		LineBean line1 = new LineBean();
		line1.setPoints(pointsS);
		
		StreetBean s = new StreetBean();
		s.setStreetReference("Malvasia nord");
		s.setId_app(appIdTn);
		s.setSlotNumber(15);
		/*s.setFreeParkSlotNumber(0);
		s.setFreeParkSlotSignNumber(0);
		s.setPaidSlotNumber(0);
		s.setTimedParkSlotNumber(0);
		s.setHandicappedSlotNumber(0);
		s.setFreeParkSlotNumber(0);*/
		s.setSubscritionAllowedPark(false);
		s.setColor(area.getColor());
		s.setRateAreaId(area.getId());
		s.setGeometry(line1);
		List<String> zones = new ArrayList<String>();
		zones.add(z.getId());
		s.setZones(zones);
		
		PointBean pbes12 = new PointBean();
		pbes12.setLat(46.077185);
		pbes12.setLng(11.123615);
		PointBean pbes22 = new PointBean();
		pbes22.setLat(46.076054);
		pbes22.setLng(11.124259);
		List<PointBean> pointsS2 = new ArrayList<PointBean>();
		pointsS2.add(pbes12);
		pointsS2.add(pbes22);
		LineBean line2 = new LineBean();
		line2.setPoints(pointsS2);
		
		StreetBean s2 = new StreetBean();
		s2.setStreetReference("Brennero Centro");
		s2.setId_app(appIdTn);
		s2.setSlotNumber(18);
		/*s2.setFreeParkSlotNumber(0);
		s2.setFreeParkSlotSignNumber(0);
		s2.setPaidSlotNumber(0);
		s2.setTimedParkSlotNumber(3);
		s2.setHandicappedSlotNumber(0);
		s2.setFreeParkSlotNumber(0);*/
		s2.setSubscritionAllowedPark(false);
		s2.setColor(area.getColor());
		s2.setRateAreaId(area.getId());
		s2.setGeometry(line2);
		s2.setZones(zones);
		
		
		// ParkingMeters Creation
		ParkingMeterBean p = new ParkingMeterBean();
		p.setId_app(appIdTn);
		p.setAreaId(area.getId());
		p.setCode(35);
		p.setStatus(Status.ACTIVE);
		PointBean g1 = new PointBean();
		g1.setLat(46.076962);
		g1.setLng(11.123947);
		p.setGeometry(g1);
		
		ParkingMeterBean p2 = new ParkingMeterBean();
		p2.setId_app(appIdTn);
		p2.setAreaId(area.getId());
		p2.setCode(51);
		p2.setStatus(Status.INACTIVE);
		PointBean g2 = new PointBean();
		g2.setLat(46.076524);
		g2.setLng(11.124894);
		p2.setGeometry(g2);
		
		ParkingMeterBean p3 = new ParkingMeterBean();
		p3.setId_app(appIdTn);
		p3.setAreaId(area.getId());
		p3.setCode(53);
		p3.setStatus(Status.ACTIVE);
		PointBean g3 = new PointBean();
		g3.setLat(46.076217);
		g3.setLng(11.123674);
		p3.setGeometry(g3);
		
		
		// BikePoints Creation
		BikePointBean pb = new BikePointBean();
		pb.setId_app(appIdTn);
		pb.setName("StazioneFS");
		pb.setSlotNumber(24);
		pb.setBikeNumber(20);
		PointBean geo = new PointBean();
		geo.setLat(46.071984);
		geo.setLng(11.119766);
		pb.setAgencyId(Lists.newArrayList("tn_tes_091516"));
		pb.setGeometry(geo);
		
		BikePointBean pb2 = new BikePointBean();
		pb2.setId_app(appIdTn);
		pb2.setName("Staz. Autocorriere");
		pb2.setSlotNumber(12);
		pb2.setBikeNumber(12);
		PointBean geo2 = new PointBean();
		geo2.setLat(46.070164);
		geo2.setLng(11.119793);
		pb2.setAgencyId(Lists.newArrayList("tn_tes_091516"));
		pb2.setGeometry(geo2);
		
		BikePointBean pb3 = new BikePointBean();
		pb3.setId_app(appIdTn);
		pb3.setName("APT");
		pb3.setSlotNumber(8);
		pb3.setBikeNumber(8);
		PointBean geo3 = new PointBean();
		geo3.setLat(46.070529);
		geo3.setLng(11.121263);
		pb3.setAgencyId(Lists.newArrayList("tn_tes_091516"));
		pb3.setGeometry(geo3);
		
		try {
			manager.save(s,appIdTn, "tn_tes_091516", "userTest");
			manager.save(s2,appIdTn, "tn_tes_091516", "userTest");
			manager.save(p,appIdTn, "tn_tes_091516", "userTest");
			manager.save(p2,appIdTn, "tn_tes_091516", "userTest");
			manager.save(p3,appIdTn, "tn_tes_091516", "userTest");
			manager.save(pb,appIdTn, "tn_tes_091516", "userTest");
			manager.save(pb2,appIdTn, "tn_tes_091516", "userTest");
			manager.save(pb3,appIdTn, "tn_tes_091516", "userTest");
		} catch (DatabaseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		ObjectMapper mapper = new ObjectMapper();
		try {
			System.out.println(mapper.writeValueAsString(s));
			System.out.println(mapper.writeValueAsString(s2));
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
		
		Assert.assertTrue(manager.getAllStreets(area, appIdTn).size() == 2);
		Assert.assertTrue(manager.getAllParkingMeters(area,appIdTn).size() == 3);
		Assert.assertTrue(manager.getAllBikePoints(appIdTn).size() == 3);
		// Filter street for zone
		Assert.assertTrue(manager.getAllStreets(z, appIdTn).size() == 2);
		
	}
	
	
	@Test
	public void deleteRv() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException,
			JsonGenerationException, JsonMappingException, IOException {
		
		//manager.setAppId(appId);
		
		List<ZoneBean> zones = manager.getAllZone(appId);
		for(ZoneBean z : zones){
			manager.removeZone(z.getId(),appId, "rv_tes_091616", "userTest");
		}
		
		List<ParkingMeterBean> parkingMeters = manager.getAllParkingMeters(appId, "rv_tes_091616");
		for(ParkingMeterBean pm : parkingMeters){
			manager.removeParkingMeter(pm.getAreaId(), pm.getId(), appId, "rv_tes_091616", "userTest");
		}
		
		List<ParkingStructureBean> parkingStructs = manager.getAllParkingStructure(appId);
		for(ParkingStructureBean ps : parkingStructs){
			manager.removeParkingStructure(ps.getId(),appId, "rv_tes_091616", "userTest");
		}
		
		List<BikePointBean> bikePoints = manager.getAllBikePoints(appId);
		for(BikePointBean bp : bikePoints){
			manager.removeBikePoint(bp.getId(),appId, "rv_tes_091616", "userTest");
		}
		
		List<RateAreaBean> areas = manager.getAllArea(appId);
		for(RateAreaBean area : areas){
			manager.removeArea(area.getId(),appId, "rv_tes_091616", "userTest");
		}
		
		Assert.assertTrue(manager.getAllArea(appId).size() == 0);
		Assert.assertTrue(manager.getAllParkingMeters(appId).size() == 0);
		Assert.assertTrue(manager.getAllParkingStructure(appId).size() == 0);
		Assert.assertTrue(manager.getAllZone(appId).size() == 0);
		Assert.assertTrue(manager.getAllBikePoints(appId).size() == 0);
		
	}
	
	@Test
	public void deleteTn() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException,
			JsonGenerationException, JsonMappingException, IOException {
		
		//manager.setAppId(appIdTn);
		
		List<ZoneBean> zones = manager.getAllZone(appIdTn);
		for(ZoneBean z : zones){
			manager.removeZone(z.getId(),appIdTn, "tn_tes_091516", "userTest");
		}
		
		List<ParkingMeterBean> parkingMeters = manager.getAllParkingMeters(appIdTn);
		for(ParkingMeterBean pm : parkingMeters){
			manager.removeParkingMeter(pm.getAreaId(), pm.getId(), appIdTn, "tn_tes_091516", "userTest");
		}
		
		List<BikePointBean> bikePoints = manager.getAllBikePoints(appIdTn);
		for(BikePointBean bp : bikePoints){
			manager.removeBikePoint(bp.getId(),appIdTn, "tn_tes_091516", "userTest");
		}
		
		List<RateAreaBean> areas = manager.getAllArea(appIdTn);
		for(RateAreaBean area : areas){
			manager.removeArea(area.getId(),appIdTn, "tn_tes_091516", "userTest");
		}
		
		Assert.assertTrue(manager.getAllArea(appIdTn).size() == 0);
		Assert.assertTrue(manager.getAllParkingMeters(appIdTn).size() == 0);
		Assert.assertTrue(manager.getAllParkingStructure(appIdTn).size() == 0);
		Assert.assertTrue(manager.getAllZone(appIdTn).size() == 0);
		Assert.assertTrue(manager.getAllBikePoints(appIdTn).size() == 0);
		
	}

	@Test
	public void json() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException,
			JsonGenerationException, JsonMappingException, IOException {
		
		//manager.setAppId(appId);
		
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
