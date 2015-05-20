package it.smartcommunitylab.parking.management.web.manager;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import it.smartcommunitylab.parking.management.web.model.ObjectsHolidays;
import it.smartcommunitylab.parking.management.web.model.ObjectsSpecialHolidays;
import it.smartcommunitylab.parking.management.web.security.ObjectsHolidaysSetup;
import it.smartcommunitylab.parking.management.web.security.ObjectsSpecialHolidaysSetup;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("HolidaysManager")
public class HolidaysManager {

	private static final Logger logger = Logger.getLogger(HolidaysManager.class);
	
	@Autowired
	private ObjectsHolidaysSetup objectItaHolidays;

	@Autowired
	private ObjectsSpecialHolidaysSetup objectHistoricalEaster;
	
	public HolidaysManager() {
		// TODO Auto-generated constructor stub
	}

	private List<ObjectsHolidays> getAllHolidays(String appId){
		List<ObjectsHolidays> res = objectItaHolidays.getHolidays();
		List<ObjectsHolidays> resApp = new ArrayList<ObjectsHolidays>();
		for (ObjectsHolidays ih : res) {
			if((ih.getAppId().compareTo(appId) == 0) || (ih.getAppId().compareTo("all") == 0)){
				resApp.add(ih);
			}
		}
		return resApp;
	}
	
	private ObjectsHolidays findHolidaysByDate(Integer month, Integer day, String appId){
		ObjectsHolidays result = null;
		List<ObjectsHolidays> itaHolidays = getAllHolidays(appId);
		for (ObjectsHolidays ih : itaHolidays) {
			//logger.error(String.format("finded holiday: %s", ih.getId()));
			if(ih.getMonth() == month && ih.getDay() == day){
				result = ih;
			}
		}
		return result;
	}
	
	private List<ObjectsSpecialHolidays> getAllEasterMondays(){
		List<ObjectsSpecialHolidays> res = objectHistoricalEaster.getHolidays();
		return res;
	}
	
	private ObjectsSpecialHolidays findEasterMondaysByDate(Integer year, Integer month, Integer day){
		ObjectsSpecialHolidays result = null;
		for (ObjectsSpecialHolidays he : getAllEasterMondays()) {
			//logger.error(String.format("finded Easter Monday: %s - %d/%d/%d - myDay - %d/%d/%d", he.getId(), he.getDay(), he.getMonth(), he.getYear(), day, month, year));			
			if(he.getYear().compareTo(year) == 0 && he.getMonth().compareTo(month) == 0 && he.getDay().compareTo(day) == 0){
				result = he;
			}
		}
		return result;
	}
	
	/**
	 * Method used to calculate if a specific date is holiday or not
	 * @param cal: imput calendar object
	 * @return true if holiday, false if not
	 */
	public boolean isAHoliday(Calendar cal, String appId){
		boolean isHoliday = false;
		// here I have to cover all the cases: public holidays in Ita, year holidays, city holidays
		int wd = cal.get(Calendar.DAY_OF_WEEK);
		if(wd == Calendar.SUNDAY){
			isHoliday = true;
		} else {
			if(findHolidaysByDate(cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH), appId) != null){
				isHoliday = true;
			}
		}
		if(wd == Calendar.MONDAY){
			if(findEasterMondaysByDate(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH)) != null){
				isHoliday = true;
			}
		}
		logger.error(String.format("isAHoliday function: day of week %d, day %d, month %d", wd, cal.get(Calendar.DAY_OF_MONTH), cal.get(Calendar.MONTH) + 1));
		logger.error(String.format("isAHoliday function result: %s", isHoliday));
		return isHoliday;
	};
	
}
