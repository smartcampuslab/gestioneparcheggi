package it.smartcommunitylab.parking.management.web.auxiliary.services;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.geo.Circle;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import it.smartcommunitylab.parking.management.web.auxiliary.data.GeoStorage;
import it.smartcommunitylab.parking.management.web.auxiliary.data.LogMongoStorage;
import it.smartcommunitylab.parking.management.web.auxiliary.model.LastChange;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Parking;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkingLog;
import it.smartcommunitylab.parking.management.web.auxiliary.model.Street;
import it.smartcommunitylab.parking.management.web.auxiliary.model.StreetLog;
import it.smartcommunitylab.parking.management.web.bean.PointBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingStructureBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.common.exception.NotFoundException;

@Service
public class DataService {

	@Autowired 
	private LogMongoStorage logMongoStorage;
	@Autowired
	private GeoStorage geoStorage;
	@Autowired
	private StorageManager storageManager;

//	@Value("${parking.sources}")
//	private String parkingSources;
	@Value("${parking.agencies}")
	private String parkingAgencies;

//	@Value("${street.sources}")
//	private String streetURLs;
	@Value("${street.agencies}")
	private String streetAgencies;
	
	private static final Logger logger = Logger.getLogger(DataService.class);
	
	@PostConstruct
	private void initData() throws IOException, DataException, Exception {
		String[] agencies = parkingAgencies.split(",");
		//String[] refs = parkingSources.split(",");
		
		//if (refs.length != agencies.length) throw new IOException("number of agencies does not match number of sources");

		// Here I have to call directly my Static managers to retrieve the correct data
		
//		for (int i = 0; i < refs.length; i++) {
//			String agency = agencies[i];
//
//			List<Parking> oldParkings = getParkings(agency);
//			Set<String> oldIds = new HashSet<String>();
//			for (Parking p : oldParkings) {
//				oldIds.add(p.getId());
//			}
//
//			ClassPathResource res = new ClassPathResource(refs[i]);
//			List<KMLData> data = KMLHelper.readData(res.getInputStream());
//			for (KMLData item : data) {
//				Parking p = new Parking();
//				p.setId("parking@"+agency+"@"+item.getId());
//				oldIds.remove(p.getId());
//				p.setName(item.getName());
//				p.setAgency(agency);
//				p.setSlotsTotal(item.getTotal());
//				p.setPosition(new double[]{item.getLat(),item.getLon()});
//				saveOrUpdateParking(p);
//			}
//
//			for (String id : oldIds) {
//				geoStorage.deleteObject(geoStorage.getObjectByIdAndAgency(Parking.class, id, agency));
//			}
//		}
		
		for (int i = 0; i < agencies.length; i++) {
			String agency = agencies[i];

			List<Parking> oldParkings = getParkings(agency);
			Set<String> oldIds = new HashSet<String>();
			for (Parking p : oldParkings) {
				oldIds.add(p.getId());
			}
			
			storageManager.setAppId(agency);
			List<ParkingStructureBean> structures = storageManager.getAllParkingStructure();
			//ClassPathResource res = new ClassPathResource(refs[i]);
			//List<KMLData> data = KMLHelper.readData(res.getInputStream());
			for(ParkingStructureBean ps : structures){
				Parking p = new Parking();
				p.setId("parking@"+agency+"@"+ps.getId());
				oldIds.remove(p.getId());
				p.setName(ps.getName());
				p.setAgency(agency);
				p.setSlotsTotal(ps.getSlotNumber());
				p.setPosition(new double[]{ps.getGeometry().getLat(),ps.getGeometry().getLng()});
				saveOrUpdateParking(p);
			}

			for (String id : oldIds) {
				geoStorage.deleteObject(geoStorage.getObjectByIdAndAgency(Parking.class, id, agency));
			}
		}
	}
	
	//@Scheduled(fixedRate = 4*60*60*1000)
	//@Scheduled(fixedRate = 1*60*1000)
	@PostConstruct
	private void updateStreets() throws Exception {
		String[] agencies = streetAgencies.split(",");
		//String[] refs = streetURLs.split(",");
		
		//if (refs.length != agencies.length) throw new IOException("number of agencies does not match number of sources");

//		for (int i = 0; i < refs.length; i++) {
//			String agency = agencies[i];
//
//			String urlString = refs[i];
//			if (ResourceUtils.isUrl(urlString)) {
//				URL url = ResourceUtils.getURL(urlString);
//				InputStream is = url.openStream();
//				List<ViaBean> vie = JsonUtils.toObjectList(IOUtils.toString(is), ViaBean.class);
//				
//				List<Street> oldStreets = getStreets(agency);
//				Set<String> oldIds = new HashSet<String>();
//				for (Street p : oldStreets) {
//					oldIds.add(p.getId());
//				}
//
//				for (ViaBean via : vie) {
//					Street street = new Street();
//					street.setId("street@"+agency+"@"+via.getId());
//					oldIds.remove(street.getId());
//					street.setAreaId(via.getAreaId());
//					street.setAgency(agency);
//					street.setName(via.getStreetReference());
//					street.setPolyline(PolylineEncoder.encode(via.getGeometry().getPoints()));
//					PointBean start = via.getGeometry().getPoints().get(0);
//					street.setPosition(new double[]{start.getLat(),start.getLng()});
//					if (via.getFreeParkSlotNumber() != null) {
//						street.setSlotsFree(via.getFreeParkSlotNumber());
//					}
//					if (via.getPaidSlotNumber() != null) {
//						street.setSlotsPaying(via.getPaidSlotNumber());
//					} else if (via.getSlotNumber() != null) {
//						street.setSlotsPaying(via.getSlotNumber());
//					}
//					if (via.getTimedParkSlotNumber() != null){
//						street.setSlotsTimed(via.getTimedParkSlotNumber());
//					}
//					//street.setSlotsUnavailable(via.getReservedSlotNumber());
//					saveOrUpdateStreet(street);
//				}
//				for (String id : oldIds) {
//					geoStorage.deleteObject(geoStorage.getObjectByIdAndAgency(Street.class, id, agency));
//				}
//			}
//
//		}
		
		for (int i = 0; i < agencies.length; i++) {
			String agency = agencies[i];
				
			List<Street> oldStreets = getStreets(agency);
			Set<String> oldIds = new HashSet<String>();
			for (Street p : oldStreets) {
				oldIds.add(p.getId());
			}

			storageManager.setAppId(agency);
			List<StreetBean> newStreets = storageManager.getAllStreets();
			for (StreetBean s : newStreets){
				//logger.info(String.format("found street %s", s.toString()));
				Street street = new Street();
				street.setId("street@"+agency+"@"+s.getId());
				oldIds.remove(street.getId());
				street.setAreaId(s.getRateAreaId());
				street.setAgency(agency);
				street.setName(s.getStreetReference());
				street.setPolyline(PolylineEncoder.encode(s.getGeometry().getPoints()));
				PointBean start = s.getGeometry().getPoints().get(0);
				street.setPosition(new double[]{start.getLat(),start.getLng()});
				if (s.getFreeParkSlotNumber() != null) {
					street.setSlotsFree(s.getFreeParkSlotNumber());
				}
				if (s.getPaidSlotNumber() != null) {
					street.setSlotsPaying(s.getPaidSlotNumber());
				} else if (s.getSlotNumber() != null) {
					street.setSlotsPaying(s.getSlotNumber());
				}
				if (s.getTimedParkSlotNumber() != null){
					street.setSlotsTimed(s.getTimedParkSlotNumber());
				}
				//street.setSlotsUnavailable(via.getReservedSlotNumber());
				saveOrUpdateStreet(street);
			}
			for (String id : oldIds) {
				geoStorage.deleteObject(geoStorage.getObjectByIdAndAgency(Street.class, id, agency));
			}
		}
	}
	
	public List<Parking> getParkings(String agency) throws DataException {
		return geoStorage.searchObjects(Parking.class, (Circle)null, Collections.<String,Object>singletonMap("agency", agency));
	}
	public List<Street> getStreets(String agency) throws DataException {
		logger.error(String.format("I am in getStreets 1 for agency %s", agency));
		return geoStorage.searchObjects(Street.class, (Circle)null, Collections.<String,Object>singletonMap("agency", agency));
	}
	
	public List<Parking> getParkings(String agency, double lat, double lon, double radius) throws DataException {
		return geoStorage.searchObjects(Parking.class, new Circle(lat, lon, radius), Collections.<String,Object>singletonMap("agency", agency));
	}
	public List<Street> getStreets(String agency, double lat, double lon, double radius) throws DataException {
		return geoStorage.searchObjects(Street.class, new Circle(lat, lon, radius), Collections.<String,Object>singletonMap("agency", agency));
	}
	
	
	public void saveOrUpdateStreet(Street s) throws DataException {
		try {
			Street old = geoStorage.getObjectByIdAndAgency(Street.class, s.getId(), s.getAgency());
			old.setAgency(s.getAgency());
			old.setSlotsFree(s.getSlotsFree());
			old.setSlotsPaying(s.getSlotsPaying());
			old.setSlotsTimed(s.getSlotsTimed());
			old.setName(s.getName());
			old.setPolyline(s.getPolyline());
			old.setPosition(s.getPosition());
			old.setDescription(s.getDescription());
			geoStorage.storeObject(old);
		} catch (NotFoundException e) {
			geoStorage.storeObject(s);
		}
	}
	public void saveOrUpdateParking(Parking p) throws DataException {
		try {
			Parking old = geoStorage.getObjectByIdAndAgency(Parking.class, p.getId(), p.getAgency());
			old.setName(p.getName());
			old.setAgency(p.getAgency());
			old.setPosition(p.getPosition());
			old.setDescription(p.getDescription());
			old.setSlotsTotal(p.getSlotsTotal());
			geoStorage.storeObject(old);
		} catch (NotFoundException e) {
			geoStorage.storeObject(p);
		}
	}
	
	public void updateStreetData(Street s, String agencyId, String authorId) throws DataException, NotFoundException {
		Street old = geoStorage.getObjectByIdAndAgency(Street.class, s.getId(), agencyId);
		old.setSlotsFree(s.getSlotsFree());
		old.setSlotsOccupiedOnFree(s.getSlotsOccupiedOnFree());
		old.setSlotsPaying(s.getSlotsPaying());
		old.setSlotsOccupiedOnPaying(s.getSlotsOccupiedOnPaying());
		old.setSlotsTimed(s.getSlotsTimed());
		old.setSlotsUnavailable(s.getSlotsUnavailable());
		StreetLog sl = new StreetLog();
		sl.setAuthor(authorId);
		sl.setTime(System.currentTimeMillis());
		sl.setValue(old);
		logMongoStorage.storeLog(sl);
		LastChange lc = new LastChange();
		lc.setAuthor(authorId);
		lc.setTime(sl.getTime());
		old.setLastChange(lc);
		geoStorage.storeObject(old);
	}
	
	public void updateParkingData(Parking object, String agencyId, String authorId) throws DataException, NotFoundException {
		Parking old = geoStorage.getObjectByIdAndAgency(Parking.class, object.getId(), agencyId);
		old.setSlotsOccupiedOnTotal(object.getSlotsOccupiedOnTotal());
		old.setSlotsTotal(object.getSlotsTotal());
		old.setSlotsUnavailable(object.getSlotsUnavailable());

		ParkingLog sl = new ParkingLog();
		sl.setAuthor(authorId);
		sl.setTime(System.currentTimeMillis());
		sl.setValue(old);
		logMongoStorage.storeLog(sl);
		LastChange lc = new LastChange();
		lc.setAuthor(authorId);
		lc.setTime(sl.getTime());
		old.setLastChange(lc);
		geoStorage.storeObject(old);
	}

}
