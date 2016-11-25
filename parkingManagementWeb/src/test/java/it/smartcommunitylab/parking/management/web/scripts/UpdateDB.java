package it.smartcommunitylab.parking.management.web.scripts;

import it.smartcommunitylab.parking.management.web.model.ParkingStructure.PaymentMode;
import it.smartcommunitylab.parking.management.web.model.ParkingStructure.PaymentPoint;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.common.collect.Lists;



@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "/spring/filterContext.xml" })
public class UpdateDB {

	@Autowired
	private MongoTemplate mongodb;
	
	@Test
	public void splitPaymentModeAndPoint() {
		
		List<Map> pss = mongodb.findAll(Map.class, "parkingStructure");
		for (Map ps: pss) {
			System.out.println(ps);
			
			if (ps.get("paymentPoint") == null) {
				ps.put("paymentPoint", new ArrayList<PaymentPoint>());
			}
			List toRemove = Lists.newArrayList();
			for (Object o: (List)ps.get("paymentMode")) {
				try {
					PaymentMode pm = PaymentMode.valueOf(o.toString());
				} catch (IllegalArgumentException e) {
					PaymentPoint pp = PaymentPoint.valueOf(o.toString());
					((List)ps.get("paymentPoint")).add(pp);
					toRemove.add(o);
				}
			}
			((List)ps.get("paymentMode")).removeAll(toRemove);
			
			mongodb.save(ps, "parkingStructure");
			
			System.out.println(ps);
			System.out.println("----------------------------------------------");
		}

		
	}
	
}
