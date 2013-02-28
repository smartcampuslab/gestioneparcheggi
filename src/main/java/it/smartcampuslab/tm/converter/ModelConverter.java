package it.smartcampuslab.tm.converter;

import org.codehaus.jackson.map.ObjectMapper;

public class ModelConverter {

	private static ObjectMapper mapper;

	static {
		mapper = new ObjectMapper();
		mapper.configure(
				org.codehaus.jackson.map.DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES,
				false);
	}

	public static <T> T convert(Object o, Class<T> javaClass) {
		return mapper.convertValue(o, javaClass);
	}

}