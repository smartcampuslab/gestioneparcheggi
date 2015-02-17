package it.smartcommunitylab.parking.management.web.manager;

import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Assert;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "/spring/applicationContext.xml" })
public class DynamicManagerTest {

	private static final String appId="rv";
	private static final Long NOW = System.currentTimeMillis();
	
	@Autowired
	private StorageManager manager;
	
	@Autowired
	private DynamicManager dynManager;


	@Test
	public void edit() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException {
		
//		RateAreaBean area = new RateAreaBean();
//		area.setId_app(appId);
//		area.setName("Pasubio");
//		area.setColor("29ea30");
//		area.setFee(new Float(0.50));
//		area.setTimeSlot("08:00 - 18:00");
//		area.setSmsCode("567");
//		
//		ZoneBean z = new ZoneBean();
//		z.setId_app(appId);
//		z.setName("Brione");
//		z.setSubmacro("B");
//		z.setColor("33cc66");
		
		List<ZoneBean> zones = manager.getZoneByName("Brione");
		ZoneBean z = null;
		for(ZoneBean zon : zones){
			if(zon.getSubmacro().compareTo("B") == 0){
				z = zon;
			}
		}
		
		// Streets Editing
		List<StreetBean> streets = manager.findStreetByName("via unione");
		StreetBean s = streets.get(0);
		
		// Static field
//		s.setFreeParkSlotNumber(0);
//		s.setFreeParkSlotSignNumber(0);
//		s.setPaidSlotNumber(10);
//		s.setTimedParkSlotNumber(5);
//		s.setHandicappedSlotNumber(1);
//		s.setFreeParkSlotNumber(0);
//		s.setSubscritionAllowedPark(false);
//		s.setColor(area.getColor());
//		s.setRateAreaId(area.getId());
//		List<ZoneBean> zones = new ArrayList<ZoneBean>();
//		zones.add(z);
//		s.setZoneBeans(zones);
		
		// Dynamic field
		s.setFreeParkSlotOccupied(0);
		s.setFreeParkSlotSignOccupied(0);
		s.setPaidSlotOccupied(6);
		s.setTimedParkSlotOccupied(4);
		s.setHandicappedSlotOccupied(0);
		
		ObjectMapper mapper = new ObjectMapper();
		try {
			System.out.println(mapper.writeValueAsString(s));
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
		
		try {
			dynManager.editStreet(s, NOW);
		} catch (DatabaseException e3) {
			// TODO Auto-generated catch block
			e3.printStackTrace();
		}
		
		streets = manager.findStreetByName("Via Monte Nero");
		StreetBean s2 = streets.get(0);
		
//		s2.setFreeParkSlotNumber(0);
//		s2.setFreeParkSlotSignNumber(1);
//		s2.setPaidSlotNumber(3);
//		s2.setTimedParkSlotNumber(3);
//		s2.setHandicappedSlotNumber(1);
//		s2.setFreeParkSlotNumber(0);
//		s2.setSubscritionAllowedPark(false);
//		s2.setColor(area.getColor());
//		s2.setRateAreaId(area.getId());
//		s2.setZoneBeans(zones);
		
		// Dynamic field
		s2.setFreeParkSlotOccupied(0);
		s2.setFreeParkSlotSignOccupied(1);
		s2.setPaidSlotOccupied(3);
		s2.setTimedParkSlotOccupied(2);
		s2.setHandicappedSlotOccupied(0);
	
		try {
			dynManager.editStreet(s2, NOW);
		} catch (DatabaseException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
		
		//ParkingStructure Creation
		List<ParkingStructureBean> structs =  manager.getParkingStructureByName("StazioneFS");
		ParkingStructureBean ps2 = structs.get(0);
		// Dynamic data
		ps2.setSlotOccupied(145);
		ps2.setHandicappedSlotOccupied(6);
		ps2.setUnusuableSlotNumber(3);
		
//		ps2.setSlotNumber(240);
//		ps2.setHandicappedSlotNumber(10);
//		ps2.setTimeSlot("05:00 - 00:00");
//		ps2.setFee("2,5 euro/ora");
//		ps2.setPhoneNumber("0464511233");		
//		List<String> payMode2 = new ArrayList<String>();
//		payMode2.add("AUTOMATED_TELLER");
//		payMode2.add("PREPAID_CARD");
//		ps2.setPaymentMode(payMode2);
		
		
		try {
			dynManager.editParkingStructure(ps2, NOW);
		} catch (NotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		// BikePoints Creation
		List<BikePointBean> bps = manager.getBikePointsByName("stazionefs");
		
		BikePointBean pb = bps.get(0);
//		pb.setId_app(appId);
//		pb.setName("StazioneFS");
//		PointBean geo = new PointBean();
//		geo.setLat(45.889315);
//		geo.setLng(11.033718);
//		pb.setGeometry(geo);
		
		// Dynamic data
		pb.setSlotNumber(14);
		pb.setBikeNumber(10);
		
		
		try {
			dynManager.editBikePoint(pb, NOW);
		} catch (NotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Assert.assertTrue(manager.findStreetByName("via unione").get(0).getTimedParkSlotOccupied() == 4);
		Assert.assertTrue(dynManager.getAllStreets(z, NOW - 60000).size() == 2);
		Assert.assertTrue(dynManager.getAllStreets(NOW + 3000).size() == 0);
		
		Assert.assertTrue(manager.getParkingStructureByName("stazionefs").get(0).getSlotOccupied() == 145);
		
		Assert.assertTrue(manager.getBikePointsByName("stazionefs").get(0).getBikeNumber() == 10);
		
	}
	
}
