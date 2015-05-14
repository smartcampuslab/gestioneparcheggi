/*******************************************************************************
 * Copyright 2012-2013 Trento RISE
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
package it.smartcommunitylab.parking.management.web.auxiliary.data;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.geo.Circle;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import com.mongodb.BasicDBObjectBuilder;

import it.smartcommunitylab.parking.management.web.auxiliary.controller.ObjectController;
import it.smartcommunitylab.parking.management.web.auxiliary.model.GeoObject;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.common.exception.NotFoundException;
import eu.trentorise.smartcampus.presentation.data.BasicObject;
import eu.trentorise.smartcampus.presentation.storage.sync.mongo.GenericObjectSyncMongoStorage;

@Component
public class GeoStorage extends GenericObjectSyncMongoStorage<GeoSyncObjectBean> implements GeoObjectSyncStorage {

	private static final Logger logger = Logger.getLogger(GeoStorage.class);
	
	@Autowired
	public GeoStorage(MongoOperations mongoTemplate) {
		super(mongoTemplate);
		mongoTemplate.getCollection(mongoTemplate.getCollectionName(GeoSyncObjectBean.class)).ensureIndex(BasicDBObjectBuilder.start("location", "2d").get());
	}

	@Override
	public Class<GeoSyncObjectBean> getObjectClass() {
		return GeoSyncObjectBean.class;
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T extends GeoObject> T getObjectByIdAndAgency(Class<T> cls, String id, String agency) throws DataException, NotFoundException {
		Query query = Query.query(
				Criteria.where("content.id").is(id)
				.and("content.agency").is(agency)
				.and("type").is(cls.getCanonicalName()));
		GeoSyncObjectBean res = mongoTemplate.findOne(query, getObjectClass());
		if (res == null) throw new NotFoundException();
		return (T)convertBeanToBasicObject(res, cls);
	}

	private static <T> Criteria createSearchCriteria(Class<T> cls, Circle circle, Map<String, Object> inCriteria) {
		Criteria criteria = new Criteria();
		if (cls != null) {
			criteria.and("type").is(cls.getCanonicalName());
		}
		criteria.and("deleted").is(false);
		if (inCriteria != null) {
			for (String key : inCriteria.keySet()) {
				criteria.and("content."+key).is(inCriteria.get(key));
			}
		}
		if (circle != null) {
			criteria.and("location").within(circle);
		}
		return criteria;
	}


	@Override
	public <T extends GeoObject> List<T> searchObjects(Class<T> inCls, Circle circle, Map<String, Object> inCriteria) throws DataException {
		logger.error(String.format("Search Object %s", inCls.toString()));
		return searchObjects(inCls, circle, inCriteria, 0, 0);
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T extends GeoObject> List<T> searchObjects(Class<T> inCls, Circle circle, Map<String, Object> inCriteria, int limit, int skip) throws DataException {
		Criteria criteria = createSearchCriteria(inCls, circle, inCriteria);
		Query query = Query.query(criteria);
		if (limit > 0) query.limit(limit);
		if (skip > 0) query.skip(skip);
				
		Class<T> cls = inCls;
		if (cls == null) cls = (Class<T>)GeoObject.class;

		logger.error(String.format("Search Object limit %s, skip %s, query %s, class %s", limit, skip, query.fields(), cls));
		
		return find(query, cls);
	}

	@Override
	protected <T extends BasicObject> GeoSyncObjectBean convertToObjectBean(T object) throws InstantiationException, IllegalAccessException {
		GeoSyncObjectBean bean = super.convertToObjectBean(object);
		if (object instanceof GeoObject) {
			bean.setLocation(((GeoObject)object).getPosition());
		}
		return bean;
	}

}
