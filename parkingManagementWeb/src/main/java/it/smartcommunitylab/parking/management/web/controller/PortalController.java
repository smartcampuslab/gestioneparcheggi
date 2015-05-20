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

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
//import eu.trentorise.smartcampus.citizenportal.models.SubjectDn;

@Controller
public class PortalController extends SCController{
	
	@Autowired
	private MongoUserDetailsService mongoUserDetailsService;

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
	
	

}
