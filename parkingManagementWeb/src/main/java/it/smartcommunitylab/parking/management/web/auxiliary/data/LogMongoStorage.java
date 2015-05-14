package it.smartcommunitylab.parking.management.web.auxiliary.data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.parking.management.web.auxiliary.model.LogObject;
import it.smartcommunitylab.parking.management.web.auxiliary.model.ParkingLog;
import it.smartcommunitylab.parking.management.web.auxiliary.model.StreetLog;

@Component
public class LogMongoStorage {

	@Autowired
	protected MongoOperations mongoTemplate = null;
	
	public <T> void storeLog(T logObject) {
		mongoTemplate.save(logObject);
	}
	
	public List<StreetLog> getStreetLogsById(String id, String agency, int count) {
		return getLogsById(id, agency, count, StreetLog.class);
	}
	public List<ParkingLog> getParkingLogsById(String id, String agency, int count) {
		return getLogsById(id, agency, count, ParkingLog.class);
	}

	private <T> List<T> getLogsById(String id, String agency, int count, Class<T> cls) {
		Query query = Query.query(Criteria.where("value._id").is(id).and("value.agency").is(agency)).limit(count);
		query.sort().on("time", Order.DESCENDING);
		return mongoTemplate.find(query, cls);
	}
	
	public List<LogObject<?>> getLogsByAuthor(String authorId, String agency, int count) {
		Query query = Query.query(Criteria.where("author").is(authorId).and("value.agency").is(agency)).limit(count);
		query.sort().on("time", Order.DESCENDING);
		List<LogObject<?>> result = new ArrayList<LogObject<?>>();
		result.addAll(mongoTemplate.find(query, StreetLog.class));
		result.addAll(mongoTemplate.find(query, ParkingLog.class));
	
		Collections.sort(result, new Comparator<LogObject<?>>() {
			@Override
			public int compare(LogObject<?> o1, LogObject<?> o2) {
				return o1.getTime() < o2.getTime() ? 1 : o1.getTime() == o2.getTime() ? 0 : -1;
			}
		});
		if (count < result.size()) return result.subList(0, count);
		return result;
	}
	
}
