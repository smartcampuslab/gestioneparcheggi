package it.smartcampuslab.tm.manager;

import it.smartcommunitylab.parking.management.web.bean.LineBean;
import it.smartcommunitylab.parking.management.web.bean.ParkingMeterBean;
import it.smartcommunitylab.parking.management.web.bean.PointBean;
import it.smartcommunitylab.parking.management.web.bean.StreetBean;
import it.smartcommunitylab.parking.management.web.bean.ZoneBean;
import it.smartcommunitylab.parking.management.web.manager.StorageManager;
import it.smartcommunitylab.parking.management.web.model.ParkingMeter;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;

import junit.framework.Assert;

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
		// RateAreaBean area = new RateAreaBean();
		// area.setColor("ffffff");
		// area.setFee(new Float(0.50));
		// area.setSmsCode(56);
		// area = manager.save(area);
		//
		// ParkingMeterBean p = new ParkingMeterBean();
		// p.setAreaId(area.getId());
		// p.setCode(500);
		//
		// manager.save(p);

		ZoneBean z = new ZoneBean();
		z.setColor("000000");
		z = manager.save(z);
	}

	@Test
	public void json() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException,
			JsonGenerationException, JsonMappingException, IOException {
//		ParkingMeterBean p = new ParkingMeterBean();
//		p.setAreaId("tt");
//		p.setCode(3939);
//		p.setNote("temp");
//		p.setStatus(ParkingMeter.Status.INACTIVE);
//		PointBean geom = new PointBean();
//		geom.setLat(1l);
//		geom.setLng(5l);
//		p.setGeometry(geom);

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
