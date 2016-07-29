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

import it.smartcommunitylab.parking.management.web.model.slots.VehicleType;

@Component
public class VehicleTypeDataSetup {
	
	@Value("classpath:/vehicle-type.yml")
	private Resource resource;

	private List<VehicleType> vehicleTypes;
	private Map<String, VehicleType> vehicleTypesMap;
	
	public List<VehicleType> getVehicleTypes() {
		return vehicleTypes;
	}

	public void setVehicleTypes(List<VehicleType> vehicleTypes) {
		this.vehicleTypes = vehicleTypes;
	}
	
	@PostConstruct
	public void init() throws IOException {
		Yaml yaml = new Yaml(new Constructor(VehicleTypeDataSetup.class));
		VehicleTypeDataSetup data = (VehicleTypeDataSetup) yaml.load(resource.getInputStream());
		this.vehicleTypes = data.vehicleTypes;
	}

	@Override
	public String toString() {
		return "VehicleTypeDataSetup [vehicleTypes=" + vehicleTypes + "]";
	}
	
	public VehicleType findVehicleTypeByNameAndUser(String name, String userName){
		if(vehicleTypesMap == null){
			vehicleTypesMap = new HashMap<String, VehicleType>();
			for(VehicleType v_type : vehicleTypes){
				vehicleTypesMap.put(v_type.getName() + "_" + v_type.getUserName(), v_type);
			}
		}
		return vehicleTypesMap.get(name + "_" + userName);
	}
	
	public List<VehicleType> findVehicleTypesByAppIdAndUsername(String appId, String userName){
		List<VehicleType> myAppVehicleTypes = new ArrayList<VehicleType>();
		for(VehicleType v_type : vehicleTypes){
			if((v_type.getAppId().compareTo(appId) == 0) && (v_type.getUserName().compareTo(userName) == 0)){
				myAppVehicleTypes.add(v_type);
			}
		}
		return myAppVehicleTypes;
	}
	
	@SuppressWarnings("rawtypes")
	public List<Map> getVehicleTypesMap(List<VehicleType> vehicleTypeList) {
		List<Map> vehicleTypeObjs = new ArrayList<Map>();
		for(int i = 0; i < vehicleTypeList.size(); i++){
			vehicleTypeObjs.add(vehicleTypeList.get(i).toMap());
		}
		return vehicleTypeObjs;
	}
}
