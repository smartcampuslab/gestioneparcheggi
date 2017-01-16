package it.smartcommunitylab.parking.management.test.queries;

import it.smartcommunitylab.parking.management.web.manager.StorageManager;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fasterxml.jackson.databind.ObjectMapper;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest//(classes = { ParkingConfig.class, SecurityConfig.class})
@EnableConfigurationProperties
public class StorageNonRegressionTest {

	private static final String ALL = "all";
	private static final String TN_APP_ID = "tn";
	private static final String TN_AGENCY_ID = "tn_mob_091516";

	@Autowired
	private MongoTemplate template;
	
	@Autowired
	private StorageManager manager;	
	
	@Autowired
	private OldStorageManager oldManager;		
	
	private ObjectMapper mapper = new ObjectMapper();
	
	@Test
	public void testApp() throws Exception {
//		checkSameSize(TN_APP_ID, TN_AGENCY_ID);
//		checkSameLength(TN_APP_ID, TN_AGENCY_ID);
		checkSame(TN_APP_ID, TN_AGENCY_ID);
	}
	
	@Test
	public void testAll() throws Exception {
//		checkSameSize(ALL, TN_AGENCY_ID);
//		checkSameLength(ALL, TN_AGENCY_ID);
		checkSame(ALL, TN_AGENCY_ID);
	}	
	
	public void checkSame(String appId, String agencyId) throws Exception {
		System.out.println(appId + " / " + agencyId);
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllArea(appId)), mapper.writeValueAsString(manager.getAllArea(appId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllAreaByAgencyId(appId, agencyId)), mapper.writeValueAsString(manager.getAllAreaByAgencyId(appId, agencyId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllParkingMeters(appId)), mapper.writeValueAsString(manager.getAllParkingMeters(appId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllParkingMetersByAgencyId(appId, agencyId)), mapper.writeValueAsString(manager.getAllParkingMetersByAgencyId(appId, agencyId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllStreets(appId)), mapper.writeValueAsString(manager.getAllStreets(appId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllStreetsByAgencyId(appId, agencyId)), mapper.writeValueAsString(manager.getAllStreetsByAgencyId(appId, agencyId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllBikePoints(appId)), mapper.writeValueAsString(manager.getAllBikePoints(appId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllBikePointsByAgencyId(appId, agencyId)), mapper.writeValueAsString(manager.getAllBikePointsByAgencyId(appId, agencyId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllParkingStructure(appId)), mapper.writeValueAsString(manager.getAllParkingStructure(appId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllParkingStructureByAgencyId(appId, agencyId)), mapper.writeValueAsString(manager.getAllParkingStructureByAgencyId(appId, agencyId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllZone(appId)), mapper.writeValueAsString(manager.getAllZone(appId)));
		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllZoneByAgencyId(appId, agencyId)), mapper.writeValueAsString(manager.getAllZoneByAgencyId(appId, agencyId)));		
	}	
	
//	public void checkSameSize(String appId, String agencyId) {
//		System.out.println(appId + " / " + agencyId);
//		Assert.assertEquals(oldManager.getAllArea(appId).size(), manager.getAllArea(appId).size());
//		Assert.assertEquals(oldManager.getAllAreaByAgencyId(appId, agencyId).size(), manager.getAllAreaByAgencyId(appId, agencyId).size());
//		Assert.assertEquals(oldManager.getAllParkingMeters(appId).size(), manager.getAllParkingMeters(appId).size());
//		Assert.assertEquals(oldManager.getAllParkingMetersByAgencyId(appId, agencyId).size(), manager.getAllParkingMetersByAgencyId(appId, agencyId).size());
//		Assert.assertEquals(oldManager.getAllStreets(appId).size(), manager.getAllStreets(appId).size());
//		Assert.assertEquals(oldManager.getAllStreetsByAgencyId(appId, agencyId).size(), manager.getAllStreetsByAgencyId(appId, agencyId).size());
//		Assert.assertEquals(oldManager.getAllBikePoints(appId).size(), manager.getAllBikePoints(appId).size());
//		Assert.assertEquals(oldManager.getAllBikePointsByAgencyId(appId, agencyId).size(), manager.getAllBikePointsByAgencyId(appId, agencyId).size());
//		Assert.assertEquals(oldManager.getAllParkingStructure(appId).size(), manager.getAllParkingStructure(appId).size());
//		Assert.assertEquals(oldManager.getAllParkingStructureByAgencyId(appId, agencyId).size(), manager.getAllParkingStructureByAgencyId(appId, agencyId).size());
//		Assert.assertEquals(oldManager.getAllZone(appId).size(), manager.getAllZone(appId).size());
//		Assert.assertEquals(oldManager.getAllZoneByAgencyId(appId, agencyId).size(), manager.getAllZoneByAgencyId(appId, agencyId).size());		
//	}	
//	
//	public void checkSameLength(String appId, String agencyId) throws Exception {
//		System.out.println(appId + " / " + agencyId);
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllArea(appId)).length(), mapper.writeValueAsString(manager.getAllArea(appId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllAreaByAgencyId(appId, agencyId)).length(), mapper.writeValueAsString(manager.getAllAreaByAgencyId(appId, agencyId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllParkingMeters(appId)).length(), mapper.writeValueAsString(manager.getAllParkingMeters(appId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllParkingMetersByAgencyId(appId, agencyId)).length(), mapper.writeValueAsString(manager.getAllParkingMetersByAgencyId(appId, agencyId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllStreets(appId)).length(), mapper.writeValueAsString(manager.getAllStreets(appId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllStreetsByAgencyId(appId, agencyId)).length(), mapper.writeValueAsString(manager.getAllStreetsByAgencyId(appId, agencyId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllBikePoints(appId)).length(), mapper.writeValueAsString(manager.getAllBikePoints(appId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllBikePointsByAgencyId(appId, agencyId)).length(), mapper.writeValueAsString(manager.getAllBikePointsByAgencyId(appId, agencyId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllParkingStructure(appId)).length(), mapper.writeValueAsString(manager.getAllParkingStructure(appId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllParkingStructureByAgencyId(appId, agencyId)).length(), mapper.writeValueAsString(manager.getAllParkingStructureByAgencyId(appId, agencyId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllZone(appId)).length(), mapper.writeValueAsString(manager.getAllZone(appId)).length());
//		Assert.assertEquals(mapper.writeValueAsString(oldManager.getAllZoneByAgencyId(appId, agencyId)).length(), mapper.writeValueAsString(manager.getAllZoneByAgencyId(appId, agencyId)).length());		
//	}		
	
	
}
