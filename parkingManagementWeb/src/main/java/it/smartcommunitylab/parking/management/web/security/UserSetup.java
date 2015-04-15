package it.smartcommunitylab.parking.management.web.security;

import it.smartcommunitylab.parking.management.web.model.UserSetting;

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
public class UserSetup {

	@Value("classpath:/user-conf.yml")
	private Resource resource;

	@PostConstruct
	public void init() throws IOException {
		Yaml yaml = new Yaml(new Constructor(UserSetup.class));
		UserSetup data = (UserSetup) yaml.load(resource.getInputStream());
		this.users = data.users;
	}
	
	private List<UserSetting> users;
	private String app_id;
	private Map<String,UserSetting> usersMap;

	/**
	 * @return the users
	 */
	public List<UserSetting> getUsers() {
		return users;
	}

	/**
	 * @param users the users to set
	 */
	public void setUsers(List<UserSetting> users) {
		this.users = users;
	}

	public String getApp_id() {
		return app_id;
	}

	public void setApp_id(String app_id) {
		this.app_id = app_id;
	}

	@Override
	public String toString() {
		return "UserSetup [users=" + users + "]";
	}

	public UserSetting findUserById(String id) {
		if (usersMap == null) {
			usersMap = new HashMap<String, UserSetting>();
			for (UserSetting user : users) {
				usersMap.put(user.getId(), user);
			}
		}
		return usersMap.get(id);
	}
	
	public UserSetting findUserByUsername(String username) {
		if (usersMap == null) {
			usersMap = new HashMap<String, UserSetting>();
			for (UserSetting user : users) {
				usersMap.put(user.getUsername(), user);
			}
		}
		return usersMap.get(username);
	}
}
