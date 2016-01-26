package it.smartcampuslab.tm.manager;

import it.smartcampuslab.tm.bean.LineBean;
import it.smartcampuslab.tm.bean.ParcometroBean;
import it.smartcampuslab.tm.bean.PointBean;
import it.smartcampuslab.tm.bean.ViaBean;
import it.smartcampuslab.tm.bean.ZonaBean;
import it.smartcampuslab.tm.model.Parcometro;

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
		Assert.assertTrue(manager.getAllParcometro().size() > 0);
	}

	@Test
	public void save() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException {
		// AreaBean area = new AreaBean();
		// area.setColor("ffffff");
		// area.setFee(new Float(0.50));
		// area.setSmsCode(56);
		// area = manager.save(area);
		//
		// ParcometroBean p = new ParcometroBean();
		// p.setAreaId(area.getId());
		// p.setCode(500);
		//
		// manager.save(p);

		ZonaBean z = new ZonaBean();
		z.setColor("000000");
		z = manager.save(z);
	}

	@Test
	public void json() throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			NoSuchMethodException, InvocationTargetException,
			JsonGenerationException, JsonMappingException, IOException {
//		ParcometroBean p = new ParcometroBean();
//		p.setAreaId("tt");
//		p.setCode(3939);
//		p.setNote("temp");
//		p.setStatus(Parcometro.Status.INACTIVE);
//		PointBean geom = new PointBean();
//		geom.setLat(1l);
//		geom.setLng(5l);
//		p.setGeometry(geom);

		ObjectMapper mapper = new ObjectMapper();

//		String json = "{'id':null,'status':'INACTIVE','areaId':'tt','code':3939,'note':'temp','geometry':{'lat':1.0,'lng':5.0}}";

//		ParcometroBean pp = mapper.readValue(json.replaceAll("'", "\""),
//				ParcometroBean.class);
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
		ViaBean v = new ViaBean();
		v.setId("434343434343");
		v.setGeometry(g);
		System.out.println(mapper.writeValueAsString(v));
	}
}
