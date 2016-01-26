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

import it.smartcommunitylab.parking.management.web.auxiliary.data.GeoObjectManager;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.bean.BikePointBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingLog;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.StreetLog;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.converter.ModelConverter;
import it.smartcommunitylab.parking.management.web.exception.DatabaseException;
import it.smartcommunitylab.parking.management.web.exception.NotFoundException;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;
import org.junit.Assert;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.Circle;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "/spring/filterContext.xml" })
public class DynamicManagerTest {
	
	private static final String appId="rvtest";
	private static final String appIdTn="tn";
	private static final int min = 0;
	private static final int max = 5;
	private static final long MILLISINYEAR = 31556952000L;

	private static final Long NOW = 1420066800000L;	//System.currentTimeMillis();
	
	@Autowired
	private StorageManager manager;
	
	@Autowired
	private DynamicManager dynManager;
	
	@Autowired
	private GeoObjectManager geoManager;


//	@Test
//	public void edit() throws SecurityException, NoSuchFieldException,
//			IllegalArgumentException, IllegalAccessException,
//			NoSuchMethodException, InvocationTargetException {
//		
//		manager.setAppId(appId);
//		
////		RateAreaBean area = new RateAreaBean();
////		area.setId_app(appId);
////		area.setName("Pasubio");
////		area.setColor("29ea30");
////		area.setFee(new Float(0.50));
////		area.setTimeSlot("08:00 - 18:00");
////		area.setSmsCode("567");
////		
////		ZoneBean z = new ZoneBean();
////		z.setId_app(appId);
////		z.setName("Brione");
////		z.setSubmacro("B");
////		z.setColor("33cc66");
//		
//		List<ZoneBean> zones = manager.getZoneByName("Brione");
//		ZoneBean z = null;
//		for(ZoneBean zon : zones){
//			if(zon.getSubmacro().compareTo("B") == 0){
//				z = zon;
//			}
//		}
//		
//		// Streets Editing
//		List<StreetBean> streets = manager.findStreetByName("via unione");
//		if(streets!=null && streets.size() > 0){
//			StreetBean s = streets.get(0);
//			
//			// Static field
////			s.setFreeParkSlotNumber(0);
////			s.setFreeParkSlotSignNumber(0);
////			s.setPaidSlotNumber(10);
////			s.setTimedParkSlotNumber(5);
////			s.setHandicappedSlotNumber(1);
////			s.setFreeParkSlotNumber(0);
////			s.setSubscritionAllowedPark(false);
////			s.setColor(area.getColor());
////			s.setRateAreaId(area.getId());
////			List<ZoneBean> zones = new ArrayList<ZoneBean>();
////			zones.add(z);
////			s.setZoneBeans(zones);
//			
//			// Dynamic field
//			s.setFreeParkSlotOccupied(0);
//			s.setFreeParkSlotSignOccupied(0);
//			s.setPaidSlotOccupied(6);
//			s.setTimedParkSlotOccupied(4);
//			s.setHandicappedSlotOccupied(0);
//			
//			ObjectMapper mapper = new ObjectMapper();
//			try {
//				System.out.println(mapper.writeValueAsString(s));
//			} catch (JsonGenerationException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (JsonMappingException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			
//			try {
//				dynManager.editStreet(s, NOW);
//			} catch (DatabaseException e3) {
//				// TODO Auto-generated catch block
//				e3.printStackTrace();
//			}
//		}
//		
//		streets = manager.findStreetByName("Via Monte Nero");
//		if(streets!=null && streets.size() > 0){
//			StreetBean s2 = streets.get(0);
//		
////			s2.setFreeParkSlotNumber(0);
////			s2.setFreeParkSlotSignNumber(1);
////			s2.setPaidSlotNumber(3);
////			s2.setTimedParkSlotNumber(3);
////			s2.setHandicappedSlotNumber(1);
////			s2.setFreeParkSlotNumber(0);
////			s2.setSubscritionAllowedPark(false);
////			s2.setColor(area.getColor());
////			s2.setRateAreaId(area.getId());
////			s2.setZoneBeans(zones);
//		
//			// Dynamic field
//			s2.setFreeParkSlotOccupied(0);
//			s2.setFreeParkSlotSignOccupied(1);
//			s2.setPaidSlotOccupied(3);
//			s2.setTimedParkSlotOccupied(2);
//			s2.setHandicappedSlotOccupied(0);
//	
//			try {
//				dynManager.editStreet(s2, NOW);
//			} catch (DatabaseException e2) {
//				// TODO Auto-generated catch block
//				e2.printStackTrace();
//			}
//		}	
//		
//		//ParkingStructure Creation
//		List<ParkingStructureBean> structs =  manager.getParkingStructureByName("StazioneFS");
//		if(structs != null && structs.size() > 0){
//			ParkingStructureBean ps2 = structs.get(0);
//			// Dynamic data
//			ps2.setSlotOccupied(145);
//			ps2.setHandicappedSlotOccupied(6);
//			ps2.setUnusuableSlotNumber(3);
//		
////			ps2.setSlotNumber(240);
////			ps2.setHandicappedSlotNumber(10);
////			ps2.setTimeSlot("05:00 - 00:00");
////			ps2.setFee("2,5 euro/ora");
////			ps2.setPhoneNumber("0464511233");		
////			List<String> payMode2 = new ArrayList<String>();
////			payMode2.add("AUTOMATED_TELLER");
////			payMode2.add("PREPAID_CARD");
////			ps2.setPaymentMode(payMode2);
//		
//		
//			try {
//				dynManager.editParkingStructure(ps2, NOW);
//			} catch (NotFoundException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//		}	
//		
//		// BikePoints Creation
//		List<BikePointBean> bps = manager.getBikePointsByName("stazionefs");
//		if(bps != null && bps.size() > 0){
//			BikePointBean pb = bps.get(0);
////			pb.setId_app(appId);
////			pb.setName("StazioneFS");
////			PointBean geo = new PointBean();
////			geo.setLat(45.889315);
////			geo.setLng(11.033718);		Assert.assertTrue(manager.getParkingStructureByName("stazionefs").get(0).getSlotOccupied() == 145);
////			pb.setGeometry(geo);
//		
//			// Dynamic data
//			pb.setSlotNumber(14);
//			pb.setBikeNumber(10);
//		
//		
//			try {
//				dynManager.editBikePoint(pb, NOW);
//			} catch (NotFoundException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
//			
//		Assert.assertTrue(manager.findStreetByName("via unione").get(0).getTimedParkSlotOccupied() == 4);
//		Assert.assertTrue(dynManager.getAllStreets(z, NOW - 60000).size() == 2);
//		Assert.assertTrue(dynManager.getAllStreets(NOW + 3000).size() == 0);
//		
//		Assert.assertTrue(manager.getParkingStructureByName("stazionefs").get(0).getSlotOccupied() == 145);
//		
//		Assert.assertTrue(manager.getBikePointsByName("stazionefs").get(0).getBikeNumber() == 10);
//		
//	}
	
	// If this test fails try to run the saveTn() test in the storageManagerTest
//	@Test
//	public void editTn() throws SecurityException, NoSuchFieldException,
//			IllegalArgumentException, IllegalAccessException,
//			NoSuchMethodException, InvocationTargetException {
//		
//		manager.setAppId(appIdTn);
//		
////		RateAreaBean area = new RateAreaBean();
////		area.setId_app(appId);
////		area.setName("Pasubio");
////		area.setColor("29ea30");
////		area.setFee(new Float(0.50));
////		area.setTimeSlot("08:00 - 18:00");
////		area.setSmsCode("567");
////		
////		ZoneBean z = new ZoneBean();
////		z.setId_app(appId);
////		z.setName("Brione");
////		z.setSubmacro("B");
////		z.setColor("33cc66");
//		
//		List<ZoneBean> zones = manager.getZoneByName("Zona a Traffico Limitato");
//		ZoneBean z = null;
//		for(ZoneBean zon : zones){
//			//if(zon.getSubmacro().compareTo("B") == 0){
//				z = zon;
//			//}
//		}
//		
//		// Streets Editing
//		List<StreetBean> streets = manager.findStreetByName("Malvasia nord");
//		if(streets!=null && streets.size() > 0){
//			StreetBean s = streets.get(0);
//			
//			// Dynamic field
//			s.setFreeParkSlotOccupied(0);
//			s.setFreeParkSlotSignOccupied(0);
//			s.setPaidSlotOccupied(6);
//			s.setTimedParkSlotOccupied(4);
//			s.setHandicappedSlotOccupied(0);
//			
//			ObjectMapper mapper = new ObjectMapper();
//			try {
//				System.out.println(mapper.writeValueAsString(s));
//			} catch (JsonGenerationException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (JsonMappingException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			
//			try {
//				dynManager.editStreet(s, NOW);
//			} catch (DatabaseException e3) {
//				// TODO Auto-generated catch block
//				e3.printStackTrace();
//			}
//		}
//		
//		streets = manager.findStreetByName("Brennero Centro");
//		if(streets!=null && streets.size() > 0){
//			StreetBean s2 = streets.get(0);
//		
//			// Dynamic field
//			s2.setFreeParkSlotOccupied(0);
//			s2.setFreeParkSlotSignOccupied(1);
//			s2.setPaidSlotOccupied(3);
//			s2.setTimedParkSlotOccupied(2);
//			s2.setHandicappedSlotOccupied(0);
//	
//			try {
//				dynManager.editStreet(s2, NOW);
//			} catch (DatabaseException e2) {
//				// TODO Auto-generated catch block
//				e2.printStackTrace();
//			}
//		}	
//		
//		// BikePoints Update
//		List<BikePointBean> bps = manager.getBikePointsByName("Stazionefs");
//		if(bps != null && bps.size() > 0){
//			BikePointBean pb = bps.get(0);
//		
//			// Dynamic data
//			pb.setSlotNumber(24);
//			pb.setBikeNumber(10);
//		
//		
//			try {
//				dynManager.editBikePoint(pb, NOW);
//			} catch (NotFoundException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
//			
//		Assert.assertTrue(manager.findStreetByName("Malvasia nord").get(0).getTimedParkSlotOccupied() == 4);
//		Assert.assertTrue(dynManager.getAllStreets(z, NOW - 60000).size() == 2);
//		Assert.assertTrue(dynManager.getAllStreets(NOW + 3000).size() == 0);
//		
//		Assert.assertTrue(manager.getBikePointsByName("stazionefs").get(0).getBikeNumber() == 10);
//		
//	}
	
//	@Test
//	public void loadOldLogTn() throws Exception {
//	
//		List<StreetLog> myOldStreets = dynManager.getOldLogs();
//		List<Street> myStreets = geoManager.searchStreets((Circle)null, Collections.<String,Object>singletonMap("agency", appIdTn));
//		for(int i = 0; i < myOldStreets.size(); i++){
//			//System.err.println(myOldStreets.get(i).getValue());
//			JSONObject street = new JSONObject(myOldStreets.get(i).getValue());
//			
//			//manager.setAppId(appId);
//			boolean found = false;
//			for(int j = 0; (j < myStreets.size()) && !found; j++){
//				if(myStreets.get(j).getName().compareTo(street.getString("name")) == 0){
//					found = true;
//					Street s = myStreets.get(j);
//					System.out.println("Street founded " + s.toJSON());
//					//String sId = dynManager.getCorrectId(s.getId(), "street", "rv");
//					//s.setId(sId);
//					Random random = new Random();
//					//int offset = random.nextInt(max - min + 1) + min; // NB: use offset to create test data
//					int offset = 0;
//					int freeSlots = street.getInt("slotsFree");
//					int slotsPaying = street.getInt("slotsPaying");
//					int slotsTimed = street.getInt("slotsTimed");
//					int total = freeSlots + slotsPaying + slotsTimed;
//					int occupiedOnFree = street.getInt("slotsOccupiedOnFree") + offset;
//					if(occupiedOnFree >= freeSlots){
//						occupiedOnFree = freeSlots;
//					}
//					int occupiedOnPaying = street.getInt("slotsOccupiedOnPaying") + offset;
//					if(occupiedOnPaying >= slotsPaying){
//						occupiedOnPaying = slotsPaying;
//					}
//					int occupiedOnTimed = street.getInt("slotsOccupiedOnTimed") + offset;
//					if(occupiedOnTimed >= slotsTimed){
//						occupiedOnTimed = slotsTimed;
//					}
//					int unavailableSlot = street.getInt("slotsUnavailable") + offset;
//					int occTot = occupiedOnFree + occupiedOnPaying + occupiedOnTimed;
//					int free = total - occTot;
//					if(unavailableSlot > free){
//						unavailableSlot = free;
//					}
//					long updateTime = myOldStreets.get(i).getTime() + MILLISINYEAR;	//2013 + 1 anno
//					
//					//s.setSlotsFree(freeSlots);
//					if(s.getSlotsFree() > 0){
//						s.setSlotsOccupiedOnFree(occupiedOnFree);
//					} else {
//						s.setSlotsOccupiedOnFreeSigned(occupiedOnFree);
//					}
//					//s.setSlotsPaying(slotsPaying);
//					s.setSlotsOccupiedOnPaying(occupiedOnPaying);
//					//s.setSlotsTimed(slotsTimed);
//					s.setSlotsOccupiedOnTimed(occupiedOnTimed);
//					if(unavailableSlot > 0){
//						System.out.println("unavailableSlots " + unavailableSlot);
//					}
//					s.setSlotsUnavailable(unavailableSlot);
//					s.setUpdateTime(updateTime);
//					s.setUser(999);
//					try {
//						dynManager.editStreetAux(s, myOldStreets.get(i).getTime(), appIdTn, "999", true, null, -1);
//						System.out.println("Street updated " + s.toJSON());
//					} catch (DatabaseException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//				}
//			}
//			
//		}
//		
//		Assert.assertTrue(myOldStreets.size() > 0);
//		
//	}
	
	@Test
	public void loadOldLogRv() throws Exception {
	
		List<StreetLog> myOldStreets = dynManager.getOldLogs();
		List<Street> myStreets = geoManager.searchStreets((Circle)null, Collections.<String,Object>singletonMap("agency", appId));
		for(int i = 0; i < myOldStreets.size(); i++){
			//System.err.println(myOldStreets.get(i).getValue());
			JSONObject street = new JSONObject(myOldStreets.get(i).getValue());
			
			//manager.setAppId(appId);
			boolean found = false;
			for(int j = 0; (j < myStreets.size()) && !found; j++){
				if(myStreets.get(j).getName().compareTo(street.getString("name")) == 0){
					found = true;
					Street s = myStreets.get(j);
					System.out.println("Street founded " + s.toJSON());
					//String sId = dynManager.getCorrectId(s.getId(), "street", "rv");
					//s.setId(sId);
					Random random = new Random();
					//int offset = random.nextInt(max - min + 1) + min; valori di test
					int offset = 0;
					int freeSlots = street.getInt("slotsFree");
					int slotsPaying = street.getInt("slotsPaying");
					int slotsTimed = street.getInt("slotsTimed");
					int total = freeSlots + slotsPaying + slotsTimed;
					int occupiedOnFree = street.getInt("slotsOccupiedOnFree") + offset;
					if(occupiedOnFree >= freeSlots){
						occupiedOnFree = freeSlots;
					}
					int occupiedOnPaying = street.getInt("slotsOccupiedOnPaying") + offset;
					if(occupiedOnPaying >= slotsPaying){
						occupiedOnPaying = slotsPaying;
					}
					int occupiedOnTimed = street.getInt("slotsOccupiedOnTimed") + offset;
					if(occupiedOnTimed >= slotsTimed){
						occupiedOnTimed = slotsTimed;
					}
					int unavailableSlot = street.getInt("slotsUnavailable") + offset;
					int occTot = occupiedOnFree + occupiedOnPaying + occupiedOnTimed;
					int free = total - occTot;
					if(unavailableSlot > free){
						unavailableSlot = free;
					}
					long updateTime = myOldStreets.get(i).getTime() + MILLISINYEAR;	//2013 + 1 anno
					
					//s.setSlotsFree(freeSlots);
					s.setSlotsOccupiedOnFree(occupiedOnFree);
					//s.setSlotsPaying(slotsPaying);
					s.setSlotsOccupiedOnPaying(occupiedOnPaying);
					//s.setSlotsTimed(slotsTimed);
					s.setSlotsOccupiedOnTimed(occupiedOnTimed);
					if(unavailableSlot > 0){
						System.out.println("unavailableSlots " + unavailableSlot);
					}
					s.setSlotsUnavailable(unavailableSlot);
					s.setUpdateTime(updateTime);
					s.setUser(999);
					try {
						dynManager.editStreetAux(s, myOldStreets.get(i).getTime(), appId, "999", true, null, -1);
						System.out.println("Street updated " + s.toJSON());
					} catch (DatabaseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
			
		}
		
		Assert.assertTrue(myOldStreets.size() > 0);
		
	}	
	
	
//	@Test
//	public void loadOldLogParkRv() throws Exception {
//	
//		List<ParkingLog> myOldParks = dynManager.getOldParkLogs();
//		List<Parking> myParkings = geoManager.searchParkings((Circle)null, Collections.<String,Object>singletonMap("agency", "rv"));
//		for(int i = 0; i < myOldParks.size(); i++){
//			//System.err.println(myOldStreets.get(i).getValue());
//			JSONObject park = new JSONObject(myOldParks.get(i).getValue());
//			
//			manager.setAppId(appId);
//			boolean found = false;
//			for(int j = 0; (j < myParkings.size()) && !found; j++){
//				//if(myParkings.get(j).getName().compareTo(street.getString("name")) == 0){
//				if(myParkings.get(j).getName().compareTo("park 'P.zza della P* _ 01") == 0){
//					found = true;
//					Parking p = myParkings.get(j);
//					System.out.println("Park founded " + p.toJSON());
//					//String sId = dynManager.getCorrectId(s.getId(), "street", "rv");
//					//s.setId(sId);
//					p.setSlotsTotal(park.getInt("slotsTotal"));
//					p.setSlotsOccupiedOnTotal(park.getInt("slotsOccupiedOnTotal"));
//					p.setUpdateTime(myOldParks.get(i).getTime());
//					p.setUser(999);
//					try {
//						dynManager.editParkingStructureAux(p, myOldParks.get(i).getTime(), "rv", "999");
//						System.out.println("Parking updated " + p.toJSON());
//					} catch (Exception e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//				}
//			}
//		}
//		Assert.assertTrue(myOldParks.size() > 0);
//		
//	}
	
	
}
