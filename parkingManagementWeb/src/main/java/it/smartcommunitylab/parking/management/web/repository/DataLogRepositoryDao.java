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
package it.smartcommunitylab.parking.management.web.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface DataLogRepositoryDao extends CrudRepository<DataLogBeanTP, String>{
	
	public DataLogBeanTP findById(String id);
	
	public List<DataLogBeanTP> findByObjId(String id);
	
	public List<DataLogBeanTP> findByType(String type);
	
	public List<DataLogBeanTP> findByAgency(String agency);
	
	public List<DataLogBeanTP> findByTypeAndAgencyAllIgnoreCase(String type, String agency);
	
}
