package it.smartcommunitylab.parking.management.web.utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import it.smartcommunitylab.parking.management.web.model.Agency;

@Component
public class AgencyDataSetup {
	
	@Value("classpath:/agency-conf.yml")
	private Resource resource;
	
	private List<Agency> agencies;
	private Map<String, Agency> agenciesMap;

	public List<Agency> getAgencies() {
		return agencies;
	}

	public void setAgencies(List<Agency> agencies) {
		this.agencies = agencies;
	}

	@PostConstruct
	public void init() throws IOException {
		Yaml yaml = new Yaml(new Constructor(AgencyDataSetup.class));
		AgencyDataSetup data = (AgencyDataSetup) yaml.load(resource.getInputStream());
		this.agencies = data.agencies;
	}

	@Override
	public String toString() {
		return "AgencyDataSetup [resource=" + resource + ", agencies=" + agencies + ", agenciesMap=" + agenciesMap
				+ "]";
	}
	
	public Agency getAgencyById(String aId){
		if(agenciesMap == null){
			agenciesMap = new HashMap<String, Agency>();
			for(Agency a : agencies){
				agenciesMap.put(a.getId(), a);
			}
		}
		return agenciesMap.get(aId);
	}
	
	@SuppressWarnings("rawtypes")
	public Map getAgencyMap(Agency agency) {
		if(agency != null){
			return agency.toMap();
		} else {
			return null;
		}
	}
	
	@SuppressWarnings("rawtypes")
	public List<Map> getAllAgencyMaps() {
		List<Map> allAgencies = new ArrayList<Map>();
		for(int i = 0; i < agencies.size(); i++){
			allAgencies.add(agencies.get(i).toMap());
		}
		return allAgencies;
	}

}
