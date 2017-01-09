package it.smartcommunitylab.parking.management.web.controller;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import it.smartcommunitylab.parking.management.web.streetlife.model.RideService;
import it.smartcommunitylab.parking.management.web.streetlife.model.StructureRegulation;

//@Controller
public class StreetLifeController {
	
	@Autowired
	@Value("${smartcommunity.parking.streetlifews.url}")
	private String streetLifeWSUrl;
	@Autowired
    @Value("${smartcommunity.parking.streetlifews.bauth.username}")
    private String basicAuthUsername;
    @Autowired
    @Value("${smartcommunity.parking.streetlifews.bauth.password}")
    private String basicAuthPassword;
	
	private static final Logger logger = Logger.getLogger(StreetLifeController.class);
	
	private List<RideService> serviceList;
	private List<StructureRegulation> regulationList;
	
	@SuppressWarnings("serial")
	HttpHeaders createHeaders( ){
		return new HttpHeaders(){
			{
				String auth = basicAuthUsername + ":" + basicAuthPassword;
				byte[] encodedAuth = Base64.encode( 
						auth.getBytes(Charset.forName("UTF-8")) );
				String authHeader = "Basic " + new String( encodedAuth );
				set( "Authorization", authHeader );
			}
		};
	}

	@RequestMapping(method = RequestMethod.GET, value = "/rest/streetlife/calcdemand")
	public @ResponseBody
	String callCalcDemand(@RequestParam(required=false) String name, @RequestParam(required=false) String position, @RequestParam(required=false) Integer cap, @RequestParam(required=false) String rideservices, @RequestParam(required=false) Integer flow) throws Exception { // @RequestBody Map<String, String> data
		initLists();
		String result = "";
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> tmp_res = null;
		String urlWithParams="?name="+name+"&address="+position+"&cap="+cap+"&rideservices="+rideservices+"&flow="+flow+"&alg=1&regulation=1";
		logger.debug("WS-GET. Method " + streetLifeWSUrl);
		logger.debug("WS-GET. params " + urlWithParams);
		try {
			tmp_res = restTemplate.exchange(streetLifeWSUrl + urlWithParams, HttpMethod.GET, new HttpEntity<Object>(createHeaders()),String.class);
			result = tmp_res.getBody();
		} catch (Exception ex){
			logger.error(String.format("Exception in proxyController get ws. Method: %s. Details: %s", streetLifeWSUrl, ex.getMessage()));
		}
		return result;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/rest/streetlife/rideservices")
	public @ResponseBody
	List<RideService> getRideServicesList () throws Exception {
		if(serviceList==null || serviceList.size() == 0){
			initLists();
		}
		return serviceList;
	}
	
	private void initLists(){
		serviceList = new ArrayList<RideService>();
		serviceList.add(new RideService("1", "BIKE SHARING (n° bikes ≤ 5% of parking spots)", 10));
		serviceList.add(new RideService("2", "BIKE SHARING (5% < n° bikes ≤ 10% of parking spots)", 15));
		serviceList.add(new RideService("3", "BIKE SHARING (10 n° bikes ≤ 15% of parking spots)", 20));
		serviceList.add(new RideService("4", "BIKE SHARING (15% n° bikes ≤ 20% of parking spots)", 25));
		serviceList.add(new RideService("5", "BIKE SHARING (20% of parking spots < n° bikes)", 30));
		serviceList.add(new RideService("6", "SHUTTLE BUS (frequency ≤ 10 min)", 80));
		serviceList.add(new RideService("7", "SHUTTLE BUS (10 min < frequency ≤ 20 min)", 70));
		serviceList.add(new RideService("8", "SHUTTLE BUS (20 min < frequency ≤ 30 min)", 50));
		serviceList.add(new RideService("9", "SHUTTLE BUS (30 min < frequency)", 30));
		serviceList.add(new RideService("10", "URBAN PUBLIC TRANSPORT (frequency ≤ 10 min)", 75));
		serviceList.add(new RideService("11", "URBAN PUBLIC TRANSPORT (10 min < frequency ≤ 20 min)", 65));
		serviceList.add(new RideService("12", "URBAN PUBLIC TRANSPORT (20 min < frequency ≤ 30 min)", 45));
		serviceList.add(new RideService("13", "URBAN PUBLIC TRANSPORT (30 min < frequency)", 25));
		serviceList.add(new RideService("14", "METRO", 75));
		serviceList.add(new RideService("15", "TAXI", 10));
		
		regulationList = new ArrayList<StructureRegulation>();
		regulationList.add(new StructureRegulation("1", "FREE", 1.00F));
		regulationList.add(new StructureRegulation("2", "PAY PARKING (P&R fee ≤ 25% of central areas fee)", 0.95F));
		regulationList.add(new StructureRegulation("3", "PAY PARKING (25% < P&R fee ≤ 50% of central areas fee)", 0.90F));
		regulationList.add(new StructureRegulation("4", "PAY PARKING (50% of central areas fee < P&R fee)", 0.85F));
	}

}
