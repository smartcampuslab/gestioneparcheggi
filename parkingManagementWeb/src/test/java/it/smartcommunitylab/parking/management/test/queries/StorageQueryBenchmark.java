package it.smartcommunitylab.parking.management.test.queries;

import it.smartcommunitylab.parking.management.web.manager.StorageManager;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.carrotsearch.junitbenchmarks.AbstractBenchmark;
import com.carrotsearch.junitbenchmarks.BenchmarkOptions;



@BenchmarkOptions(callgc = false, benchmarkRounds = 1000, warmupRounds = 10, concurrency = BenchmarkOptions.CONCURRENCY_SEQUENTIAL)
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@EnableConfigurationProperties
public class StorageQueryBenchmark extends AbstractBenchmark {

	private static final String TN_APP_ID = "tn";
	private static final String TN_AGENCY_ID = "tn_mob_091516";	
	
	@Autowired
	private MongoTemplate template;
	
	@Autowired
	private StorageManager manager;	
	
	@Autowired
	private OldStorageManager oldManager;		
	
	@Test
	public void testAA1() {
		oldManager.getAllArea(TN_APP_ID);
	}	
	
	@Test
	public void testAA2() {
		manager.getAllArea(TN_APP_ID);
	}	
	
	@Test
	public void testAABA1() {
		oldManager.getAllAreaByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}	
	
	@Test
	public void testAABA2() {
		manager.getAllAreaByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}	
	
	//////
	
	@Test
	public void testAPM1() {
		oldManager.getAllParkingMeters(TN_APP_ID);
	}
	
	@Test
	public void testAPM2() {	
		manager.getAllParkingMeters(TN_APP_ID);
	}
	
	@Test
	public void testAPMAI1() {
		oldManager.getAllParkingMetersByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}		
	
	@Test
	public void testAPMAI2() {
		manager.getAllParkingMetersByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}	
	
	///
	
	@Test
	public void testAS1() {
		oldManager.getAllStreets(TN_APP_ID);
	}	
	
	@Test
	public void testAS2() {
		manager.getAllStreets(TN_APP_ID);
	}		
	
	@Test
	public void testASBAI1() {
		oldManager.getAllStreetsByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}	
	
	@Test
	public void testASBAI2() {
		manager.getAllStreetsByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}		
	
	///
	
	@Test
	public void testABP1() {
		oldManager.getAllBikePoints(TN_APP_ID);
	}	
	
	@Test
	public void testABP2() {
		manager.getAllBikePoints(TN_APP_ID);
	}		
	
	@Test
	public void testABPBAI1() {
		oldManager.getAllBikePointsByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}	
	
	@Test
	public void testABPBAI2() {
		manager.getAllBikePointsByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}	
	
	///
	
	@Test
	public void testAPS1() {
		oldManager.getAllParkingStructure(TN_APP_ID);
	}	
	
	@Test
	public void testAPS2() {
		manager.getAllParkingStructure(TN_APP_ID);
	}	

	@Test
	public void testAPSBAI1() {
		oldManager.getAllParkingStructureByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}	
	
	@Test
	public void testAPSBAI2() {
		manager.getAllParkingStructureByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}	
	
	
	@Test
	public void testAZ1() {
		oldManager.getAllZone(TN_APP_ID);
	}	
	
	@Test
	public void testAZ2() {
		manager.getAllZone(TN_APP_ID);
	}	

	@Test
	public void testAZBAI1() {
		oldManager.getAllZoneByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}	
	
	@Test
	public void testAZBAI2() {
		manager.getAllZoneByAgencyId(TN_APP_ID, TN_AGENCY_ID);
	}		
	
	
	
	
}
