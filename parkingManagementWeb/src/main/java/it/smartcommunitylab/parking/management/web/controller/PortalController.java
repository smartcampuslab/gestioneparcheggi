package it.smartcommunitylab.parking.management.web.controller;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import eu.trentorise.smartcampus.aac.AACException;
//import eu.trentorise.smartcampus.citizenportal.models.SubjectDn;
import it.smartcommunitylab.parking.management.web.model.UserCS;
import it.smartcommunitylab.parking.management.web.repository.User;
import it.smartcommunitylab.parking.management.web.repository.UserRepositoryDao;
import it.smartcommunitylab.parking.management.web.security.CustomAuthenticationProvider;
import it.smartcommunitylab.parking.management.web.security.MongoUserDetailsService;

@Controller
public class PortalController extends SCController{
	
	@Autowired
	private MongoUserDetailsService mongoUserDetailsService;

	private static final Logger logger = Logger.getLogger(PortalController.class);
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/home")
	public ModelAndView index_console(ModelMap model, Principal principal) {
		
		String name = principal.getName();
		String mailMessages = "";
		if(model !=null && model.containsKey("mailMessage")){
			mailMessages = model.get("mailMessage").toString();
		}
		
		User user = mongoUserDetailsService.getUserDetail(name);
		logger.error("I am in get root console. User id: " + name);
		logger.error("I am in get root console. mailMessages: " + mailMessages);
		model.addAttribute("user_name", user.getName());
		model.addAttribute("user_surname", user.getSurname());
		
		//model.addAttribute("mailMessage", "test messaggio successo");
		return new ModelAndView("index", model);
	}
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/login")
	public ModelAndView secureConsole(ModelMap model) {
		logger.error(String.format("I am in get login console"));
		//To use the basic autentication I think is necessary to
		// 1 - change the redirect Uri to a page with a login form
		// 2 - in the login form invoke a new metho that check the user credential
		// 3 - if success redirect to home_console else show the error
		return new ModelAndView("login");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/logout")
	public ModelAndView secureLogout(ModelMap model) {
		logger.error(String.format("I am in logout console"));
		//To use the basic autentication I think is necessary to
		// 1 - change the redirect Uri to a page with a login form
		// 2 - in the login form invoke a new metho that check the user credential
		// 3 - if success redirect to home_console else show the error
		return new ModelAndView("redirect:/logout");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/viewall")
	public ModelAndView viewAllElements(ModelMap model) {
		logger.error(String.format("I am in get viewAll"));
		//To use the basic autentication I think is necessary to
		// 1 - change the redirect Uri to a page with a login form
		// 2 - in the login form invoke a new metho that check the user credential
		// 3 - if success redirect to home_console else show the error
		return new ModelAndView("viewallnosec");
	}

	
	@RequestMapping(method = RequestMethod.GET, value = "/prelogin")
	public ModelAndView preSecure(HttpServletRequest request) {
		//String redirectUri = mainURL + "/check";
		logger.error(String.format("I am in pre login"));
		ModelAndView model = new ModelAndView();
		model.setViewName("landing");
		return model;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/cookie_info")
	public ModelAndView preSecureCookie(HttpServletRequest request) {
		//String redirectUri = mainURL + "/check";
		logger.error(String.format("I am in cookie info page"));
		ModelAndView model = new ModelAndView();
		model.setViewName("cookie_info");
		return model;
	}
	
	

}
