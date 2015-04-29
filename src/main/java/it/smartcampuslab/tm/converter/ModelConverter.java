package it.smartcampuslab.tm.converter;

import it.smartcampuslab.tm.model.ParcheggioStruttura.PaymentMode;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;

public class ModelConverter {

	private static final Logger logger = Logger.getLogger(ModelConverter.class);
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

	public static String fromPaymentMode(PaymentMode mode) {
		return mode.toString();
	}

	public static List<String> fromPaymentMode(List<PaymentMode> modes) {
		List<String> result = new ArrayList<String>();
		for (PaymentMode mode : modes) {
			result.add(fromPaymentMode(mode));
		}
		return result;
	}

	public static PaymentMode toPaymentMode(String mode) {
		try {
			return PaymentMode.valueOf(mode);
		} catch (IllegalArgumentException e) {
			logger.error(String.format("%s not present in PaymentMode enum",
					mode));
			return null;
		}
	}

	public static List<PaymentMode> toPaymentMode(List<String> modes) {
		List<PaymentMode> result = new ArrayList<PaymentMode>();
		for (String mode : modes) {
			PaymentMode m = toPaymentMode(mode);
			if (m != null) {
				result.add(m);
			}
		}
		return result;
	}

}