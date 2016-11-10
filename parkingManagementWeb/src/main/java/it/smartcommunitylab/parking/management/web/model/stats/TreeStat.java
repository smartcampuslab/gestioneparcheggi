package it.smartcommunitylab.parking.management.web.model.stats;

import java.util.HashMap;
import java.util.Map;

public class TreeStat {

	private Object value;
	private Map<String, TreeStat> subEle;
	
	public TreeStat() {
		super();
	}

	public Object getValue() {
		return value;
	}

	public Map<String, TreeStat> getSubEle() {
		if(subEle == null){
			return new HashMap<String, TreeStat>();
		}
		return subEle;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public void setSubEle(Map<String, TreeStat> subEle) {
		this.subEle = subEle;
	}

	public TreeStat(Object value, Map<String, TreeStat> subEle) {
		super();
		this.value = value;
		this.subEle = subEle;
	}

}
