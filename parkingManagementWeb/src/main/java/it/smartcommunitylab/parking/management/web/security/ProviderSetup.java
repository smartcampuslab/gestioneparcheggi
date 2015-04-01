package it.smartcommunitylab.parking.management.web.security;

import it.smartcommunitylab.parking.management.web.model.ProviderSetting;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

@Component
public class ProviderSetup {

	@Value("classpath:/provider-conf.yml")
	private Resource resource;

	@PostConstruct
	public void init() throws IOException {
		Yaml yaml = new Yaml(new Constructor(ProviderSetup.class));
		ProviderSetup data = (ProviderSetup) yaml.load(resource.getInputStream());
		this.providers = data.providers;
	}
	
	private List<ProviderSetting> providers;
	private String app_id;
	private Map<String,ProviderSetting> providersMap;


	/**
	 * @return the providers
	 */
	public List<ProviderSetting> getProviders() {
		return providers;
	}

	/**
	 * @param providers the providers to set
	 */
	public void setProviders(List<ProviderSetting> providers) {
		this.providers = providers;
	}
	
	

	public String getApp_id() {
		return app_id;
	}

	public void setApp_id(String app_id) {
		this.app_id = app_id;
	}

	@Override
	public String toString() {
		return "ProviderSetup [providers=" + providers + "]";
	}

	public ProviderSetting findProviderById(String id) {
		if (providersMap == null) {
			providersMap = new HashMap<String, ProviderSetting>();
			for (ProviderSetting provider : providers) {
				providersMap.put(provider.getId(), provider);
			}
		}
		return providersMap.get(id);
	}
	
	public ProviderSetting findProviderByUsername(String username) {
		if (providersMap == null) {
			providersMap = new HashMap<String, ProviderSetting>();
			for (ProviderSetting provider : providers) {
				providersMap.put(provider.getUser(), provider);
			}
		}
		return providersMap.get(username);
	}
}
