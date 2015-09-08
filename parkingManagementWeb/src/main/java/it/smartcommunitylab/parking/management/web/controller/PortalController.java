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
package it.smartcommunitylab.parking.management.web.controller;

//import eu.trentorise.smartcampus.aac.AACException;
import it.smartcommunitylab.parking.management.web.model.ObjectShowSetting;
import it.smartcommunitylab.parking.management.web.model.UserSetting;
import it.smartcommunitylab.parking.management.web.security.MongoUserDetailsService;

import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
//import eu.trentorise.smartcampus.citizenportal.models.SubjectDn;

import eu.trentorise.smartcampus.aac.AACException;
import eu.trentorise.smartcampus.profileservice.ProfileServiceException;
import eu.trentorise.smartcampus.profileservice.model.AccountProfile;
import eu.trentorise.smartcampus.profileservice.model.BasicProfile;

@Controller
public class PortalController extends SCController{
	
	@Autowired
	private MongoUserDetailsService mongoUserDetailsService;
	
	@Autowired
	@Value("${smartcommunity.parkingmanagement.url}")
	private String mainURL;
	
	//OAUTH2
	//@Autowired
	//private AuthenticationManager authenticationManager;

	private static final Logger logger = Logger.getLogger(PortalController.class);
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/home")
	public ModelAndView index_console(ModelMap model, Principal principal) {
		String name = principal.getName();
		//String mailMessages = "";
		//if(model !=null && model.containsKey("mailMessage")){
		//	mailMessages = model.get("mailMessage").toString();
		//}
		//User user = mongoUserDetailsService.getUserDetail(name);
		//model.addAttribute("user_name", user.getName());
		//model.addAttribute("user_surname", user.getSurname());
	
		UserSetting user = mongoUserDetailsService.getUserDetails(name);
		logger.debug("I am in home redirect. User id: " + name);
		ObjectShowSetting objectToShow = mongoUserDetailsService.getObjectShowDetails(user.getUsername());
		model.addAttribute("user_name", user.getUsername());
		model.addAttribute("user_surname", objectToShow.getId());
		model.addAttribute("no_sec", "false");
		model.addAttribute("app_id", objectToShow.getAppId());
		model.addAttribute("map_center", objectToShow.getMapCenter());
		model.addAttribute("map_zoom", objectToShow.getMapZoom());
		model.addAttribute("object_showed", objectToShow.getShowObjectsMap());
		logger.debug("I am in get root console. object_showed: " + objectToShow.getShowObjectsMap());
		return new ModelAndView("index", model);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/login")
	public ModelAndView secureConsole(ModelMap model) {
		logger.debug(String.format("I am in get login console"));
		return new ModelAndView("login");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/logout")
	public ModelAndView secureLogout(ModelMap model) {
		logger.debug(String.format("I am in logout console"));
		return new ModelAndView("redirect:/logout");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/viewall/{appId}")
	public ModelAndView viewAllElementsRv(ModelMap model, @PathVariable String appId) {
		model.addAttribute("no_sec", "true");
		model.addAttribute("app_id", appId);
		ObjectShowSetting objectToShow = mongoUserDetailsService.getObjectShowDetailsByAppId(appId);
		model.addAttribute("map_center", objectToShow.getMapCenter());
		model.addAttribute("map_zoom", objectToShow.getMapZoom());
		model.addAttribute("object_showed", objectToShow.getShowObjectsMap());
//		model.addAttribute("show_area", view_rv_area);
//		model.addAttribute("show_street", view_rv_street);
//		model.addAttribute("show_pm", view_rv_pm);
//		model.addAttribute("show_ps", view_rv_ps);
//		model.addAttribute("show_bp", view_rv_bp);
//		model.addAttribute("show_zone", view_rv_zone);
		logger.debug(String.format("I am in get viewAll %s", appId));
		return new ModelAndView("viewallnosec");
	}

	
	@RequestMapping(method = RequestMethod.GET, value = "/prelogin")
	public ModelAndView preSecure(HttpServletRequest request) {
		//String redirectUri = mainURL + "/check";
		logger.debug(String.format("I am in pre login"));
		ModelAndView model = new ModelAndView();
		model.setViewName("landing");
		return model;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/cookie_info")
	public ModelAndView preSecureCookie(HttpServletRequest request) {
		//String redirectUri = mainURL + "/check";
		logger.debug(String.format("I am in cookie info page"));
		ModelAndView model = new ModelAndView();
		model.setViewName("cookie_info");
		return model;
	}
	
	// -------------------- Part for Oauth2 login --------------------
	/*
	 * OAUTH2
	 */
//	@RequestMapping(method = RequestMethod.GET, value = "/")
//	public ModelAndView index_myweb(HttpServletRequest request) throws SecurityException, ProfileServiceException {
//		Map<String, Object> model = new HashMap<String, Object>();
//		BasicProfile user = null;
//		try {
//			model.put("token", getToken(request));
//			user = profileService.getBasicProfile(getToken(request));
//			model.put("user_id", user.getUserId());
//			model.put("user_name", user.getName());
//			model.put("user_surname", user.getSurname());
//			logger.info(String
//					.format("I am in get root. User id: " + user.getUserId()));
			//AccountProfile account = profileService.getAccountProfile(getToken(request));
			//Object[] objectArray = account.getAccountNames().toArray();
			//Map <String, String> mappaAttributi = account.getAccountAttributes(objectArray[0].toString());
			//UserCS utente = createUserCartaServiziByMap(mappaAttributi);
			//logger.info(String.format("Account attributes info: %s", mappaAttributi));
			//model.put("nome", utente.getNome());
			//model.put("cognome", utente.getCognome());
			//model.put("sesso", utente.getSesso());
			//model.put("dataNascita", utente.getDataNascita());
			//model.put("provinciaNascita", utente.getProvinciaNascita());
			//model.put("luogoNascita", utente.getLuogoNascita());
			//model.put("codiceFiscale", utente.getCodiceFiscale());
			//model.put("cellulare", utente.getCellulare());
			//model.put("email", utente.getEmail());
			//model.put("indirizzoRes", utente.getIndirizzoRes());
			//model.put("capRes", utente.getCapRes());
			//model.put("cittaRes", utente.getCittaRes());
			//model.put("provinciaRes", utente.getProvinciaRes());
			//model.put("issuerdn", utente.getIssuersdn());
			//model.put("subjectdn", utente.getSubjectdn());
			//String base_tmp = utente.getBase64();
			//model.put("base64", base_tmp.compareTo("") == 0 ? "noAdmin" : base_tmp);
			//model.put("base64", utente.getBase64());
//			
//		} catch (Exception ex){
//			logger.error(String.format("Errore di conversione: %s", ex.getMessage()));
//			return new ModelAndView("redirect:/logout");
//		}
		
		// to get all profiles
		//getAllProfiles("5f54739a-5f54-48f0-b230-209bb419f53a");
		//SubjectDn subj = new SubjectDn(utente.getSubjectdn());
		//logger.error(String.format("Subjextdn : cn: %s; ou: %s: o: %s; c: %s", subj.getCn(), subj.getOu(),subj.getO(),subj.getC()));
//		return new ModelAndView("index", model);
//	}
	
//	@RequestMapping(method = RequestMethod.GET, value = "/login")
//	public ModelAndView secure(HttpServletRequest request) {
//		String redirectUri = mainURL + "/check";
//		logger.error(String.format("I am in get login"));
//		return new ModelAndView(
//				"redirect:"
//						+ aacService.generateAuthorizationURIForCodeFlow(redirectUri, null,
//								"profile.basicprofile.me,profile.accountprofile.me", null));
//	}
//	
//	@RequestMapping(method = RequestMethod.GET, value = "/check")
//	public ModelAndView securePage(HttpServletRequest request, @RequestParam(required = false) String code, @RequestParam(required = false) String type)
//			throws SecurityException, AACException {
//		String redirectUri = mainURL + "/check";
//		logger.info(String.format("I am in get check. RedirectUri = %s", redirectUri));
//		//logger.info(String.format("type param = %s", type));
//		String userToken = aacService.exchngeCodeForToken(code, redirectUri).getAccess_token();
//		List<GrantedAuthority> list = Collections.<GrantedAuthority> singletonList(new SimpleGrantedAuthority("ROLE_USER"));
//		Authentication auth = new PreAuthenticatedAuthenticationToken(userToken, "", list);
//		auth = authenticationManager.authenticate(auth);
//		SecurityContextHolder.getContext().setAuthentication(auth);
//		request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
//				SecurityContextHolder.getContext());
//		return new ModelAndView("redirect:/");
//	}
	
	// ---------------------------------------------------------------
	
	

}
