'use strict';

/* Services */
var pmServices = angular.module('pmServices');
pm.service('initializeService', function(){
	
	this.app_id = null;
	this.widget_base_url = null;
	this.conf_visible_obj_list = [];
	this.conf_show_area;
	this.conf_show_street;
	this.conf_show_pm;
	this.conf_show_ps;
	this.conf_show_bp;
	this.conf_show_zone;
	this.widget_filters;
	this.widget_elements;
	this.showWidgetArea = false;
	this.showWidgetStreet = false;
	this.showWidgetPs = false;
	this.showWidgetPm = false;
	this.showWidgetBp = false;
	this.showWidgetZone0 = false;
	this.showWidgetZone1 = false;
	this.showWidgetZone2 = false;
	this.showWidgetZone3 = false;
	this.showWidgetZone4 = false;
	this.checkWidgetArea = false;
	this.checkWidgetStreet = false;
	this.checkWidgetPs = false;
	this.checkWidgetPm = false;
	this.checkWidgetBp = false;
	this.checkWidgetZone0 = false;
	this.checkWidgetZone1 = false;
	this.checkWidgetZone2 = false;
	this.checkWidgetZone3 = false;
	this.checkWidgetZone4 = false;
	this.zfilterIndexs = [];
	this.zvalues = [];
	
	this.area_conf = {
       	a_name: null,
       	a_fee: null,
       	a_timeSlot: null,
       	a_smsCode: null,
       	a_municipality: null,
       	a_note: null,
       	a_color: null,
       	a_geometry: null,
       	a_zonse0: null,
        a_zonse1: null,
        a_zonse2: null,
        a_zonse3: null,
        a_zonse4: null
    }
	this.street_conf = {
        s_streetRef: null,
        s_slotNum: null,
        s_handicappedSlot: null,
        s_reservedSlot: null,
        s_timedSlot: null,
        s_paidSlot: null,
        s_freeSlot: null,
        s_freeSlotSign: null,
        s_unusuableSlot: null,
        s_subscrition: null,
        s_areaId: null,
        s_pms: null,
        s_geometry: null,
        s_zones0: null,
        s_zones1: null,
        s_zones2: null,
        s_zones3: null,
        s_zones4: null
    }
	this.pm_conf = {
    	pm_code: null,
    	pm_note: null,
    	pm_status: null,
    	pm_rateArea: null,
    	pm_geometry: null,
    	pm_zones0: null,
    	pm_zones1: null,
    	pm_zones2: null,
    	pm_zones3: null,
    	pm_zones4: null
    }
	this.ps_conf = {
    	ps_name: null,
    	ps_address: null,
    	ps_management: null,
    	ps_manager: null,
    	ps_payment: null,
    	ps_fee: null,
    	ps_timeSlot: null,
    	ps_slotNumber: null,
    	ps_handicappedSlot: null,
    	ps_unusuableSlot: null,
    	ps_phoneNumber: null,
    	ps_geometry: null,
    	ps_zones0: null,
    	ps_zones1: null,
    	ps_zones2: null,
    	ps_zones3: null,
    	ps_zones4: null
    }
	this.zoneatt0 = {
    	zone_name: null,
    	zone_submacro: null,
    	zone_submicro: null,
    	zone_note: null,
    	zone_status: null,
    	zone_type: null,
    	zone_color: null,
    	zone_geometry: null,
    	zone_geom_from_subelement: null
    }
	this.zoneatt1 = {
	    zone_name: null,
	    zone_submacro: null,
	    zone_submicro: null,
	    zone_note: null,
	    zone_status: null,
	    zone_type: null,
	    zone_color: null,
	    zone_geometry: null,
	    zone_geom_from_subelement: null
	}
	this.zoneatt2 = {
	    zone_name: null,
	    zone_submacro: null,
	    zone_submicro: null,
	    zone_note: null,
	    zone_status: null,
	    zone_type: null,
	    zone_color: null,
	    zone_geometry: null,
	    zone_geom_from_subelement: null
	}
	this.zoneatt3 = {
	    zone_name: null,
	    zone_submacro: null,
	    zone_submicro: null,
	    zone_note: null,
	    zone_status: null,
	    zone_type: null,
	    zone_color: null,
	    zone_geometry: null,
	    zone_geom_from_subelement: null
	}
	this.zoneatt4 = {
	    zone_name: null,
	    zone_submacro: null,
	    zone_submicro: null,
	    zone_note: null,
	    zone_status: null,
	    zone_type: null,
	    zone_color: null,
	    zone_geometry: null,
	    zone_geom_from_subelement: null
	}	
	this.bp_conf = {
    	bp_name: null,
    	bp_bikeNumber: null,
    	bp_slotNumber: null,
    	bp_geometry: null,
    	bp_zones0: null,
    	bp_zones1: null,
    	bp_zones2: null,
    	bp_zones3: null,
    	bp_zones4: null
    }	
	
	this.showArea = false;
	this.showStreet = false;
	this.showPs = false;
	this.showPm = false;
	this.showBp = false;
	this.filterZone0 = false;
	this.filterZone1 = false;
	this.filterZone2 = false;
	this.filterZone3 = false;
	this.filterZone4 = false;
	this.showZone0 = false;
	this.showZone1 = false;
	this.showZone2 = false;
	this.showZone3 = false;
	this.showZone4 = false;
	this.label0 = "label_zonemacro";
	this.label1 = "label_zonemacro";
	this.label2 = "label_zonemacro";
	this.label3 = "label_zonemacro";
	this.label4 = "label_zonemacro";
	this.showAreaDB = false;
	this.showStreetDB = false;
	this.showPsDB = false;
	this.showPmDB = false;
	this.showBpDB = false;
	this.showZone0DB = false;
	this.showZone1DB = false;
	this.showZone2DB = false;
	this.showZone3DB = false;
	this.showZone4DB = false;
	this.zonePageList = [];
	
	this.setConfAppId = function(app_id){
		this.app_id = app_id;
	};
	
	this.getConfAppId = function(app_id){
		return this.app_id;
	};
	
    this.setConfWidgetUrl = function(widget_url){
    	this.widget_base_url = widget_url;
    };
    
    this.getConfWidgetUrl = function(){
    	return this.widget_base_url;
    };
	
	this.setWidgetFilters = function(filters){
		this.widget_filters = filters;
	};
	
	this.getWidgetFilters = function(){
		return this.widget_filters;
	};
	
	this.setWidgetElements = function(elements){
		this.widget_elements = elements;
	};
	
	this.getWidgetElements = function(){
		return this.widget_elements;
	};
	
	this.setVisibleObjList = function(value){
		this.conf_visible_obj_list = value;
	};
	
	this.getVisibleObjList = function(){
		return this.conf_visible_obj_list;
	};
	
	this.setShowArea = function(value){
		this.conf_show_area = value;
	};
	
	this.getShowArea = function(){
		return this.conf_show_area;
	};
	
	this.setShowStreet = function(value){
		this.conf_show_street = value;
	};
	
	this.getShowStreet = function(){
		return this.conf_show_street;
	};
	
	this.setShowPm = function(value){
		this.conf_show_pm = value;
	};
	
	this.getShowPm = function(){
		return this.conf_show_pm;
	};
	
	this.setShowPs = function(value){
		this.conf_show_ps = value;
	};
	
	this.getShowPs = function(){
		return this.conf_show_ps;
	};
	
	this.setShowBp = function(value){
		this.conf_show_bp = value;
	};
	
	this.getShowBp = function(){
		return this.conf_show_bp;
	};
	
	this.setShowZone = function(value){
		this.conf_show_zone = value;
	};
	
	this.getShowZone = function(){
		return this.conf_show_zone;
	};
	
	this.getAreaConfData = function(){
		return this.area_conf;
	};
	
	this.getStreetConfData = function(){
		return this.street_conf;
	};
	
	this.getPmConfData = function(){
		return this.pm_conf;
	};
	
	this.getPsConfData = function(){
		return this.ps_conf;
	};
	
	this.getZoneAttData0 = function(){
		return this.zoneatt0;
	};
	
	this.getZoneAttData1 = function(){
		return this.zoneatt1;
	};
	
	this.getZoneAttData2 = function(){
		return this.zoneatt2;
	};
	
	this.getZoneAttData3 = function(){
		return this.zoneatt3;
	};
	
	this.getZoneAttData4 = function(){
		return this.zoneatt4;
	};	
	
	this.getBpConfData = function(){
		return this.bp_conf;
	};
	
	this.isShowedArea = function(){
		return this.showArea;
	};
	
	this.isShowedStreet = function(){
		return this.showStreet;
	};
	
	this.isShowedPs = function(){
		return this.showPs;
	};
	
	this.isShowedPm = function(){
		return this.showPm;
	};
	
	this.isShowedBp = function(){
		return this.showBp;
	};
	
	this.isShowedZone0 = function(){
		return this.showZone0;
	};
	
	this.isShowedZone1 = function(){
		return this.showZone1;
	};
	
	this.isShowedZone2 = function(){
		return this.showZone2;
	};
	
	this.isShowedZone3 = function(){
		return this.showZone3;
	};
	
	this.isShowedZone4 = function(){
		return this.showZone4;
	};
	
	this.isShowedAreaDB = function(){
		return this.showAreaDB;
	};
	
	this.isShowedStreetDB = function(){
		return this.showStreetDB;
	};
	
	this.isShowedPsDB = function(){
		return this.showPsDB;
	};
	
	this.isShowedPmDB = function(){
		return this.showPmDB;
	};
	
	this.isShowedBpDB = function(){
		return this.showBpDB;
	};
	
	this.isShowedZone0DB = function(){
		return this.showZone0DB;
	};
	
	this.isShowedZone1DB = function(){
		return this.showZone1DB;
	};
	
	this.isShowedZone2DB = function(){
		return this.showZone2DB;
	};
	
	this.isShowedZone3DB = function(){
		return this.showZone3DB;
	};
	
	this.isShowedZone4DB = function(){
		return this.showZone4DB;
	};
	
	this.getLabel0 = function(){
		return this.label0;
	};
	
	this.getLabel1 = function(){
		return this.label1;
	};
	
	this.getLabel2 = function(){
		return this.label2;
	};
	
	this.getLabel3 = function(){
		return this.label3;
	};
	
	this.getLabel4 = function(){
		return this.label4;
	};
	
	this.isFilterZone0 = function(){
		return this.filterZone0;
	};
	
	this.isFilterZone1 = function(){
		return this.filterZone1;
	};
	
	this.isFilterZone2 = function(){
		return this.filterZone2;
	};
	
	this.isFilterZone3 = function(){
		return this.filterZone3;
	};
	
	this.isFilterZone4 = function(){
		return this.filterZone4;
	};
	
	this.isWidgetAreaShowed = function(){
		return this.showWidgetArea;
	};
	
	this.isWidgetStreetShowed = function(){
		return this.showWidgetStreet;
	};
	
	this.isWidgetPsShowed = function(){
		return this.showWidgetPs;
	};
	
	this.isWidgetPmShowed = function(){
		return this.showWidgetPm;
	};
	
	this.isWidgetBpShowed = function(){
		return this.showWidgetBp;
	};
	
	this.isWidgetZone0Showed = function(){
		return this.showWidgetZone0;
	};
	
	this.isWidgetZone1Showed = function(){
		return this.showWidgetZone1;
	};
	
	this.isWidgetZone2Showed = function(){
		return this.showWidgetZone2;
	};
	
	this.isWidgetZone3Showed = function(){
		return this.showWidgetZone3;
	};
	
	this.isWidgetZone4Showed = function(){
		return this.showWidgetZone4;
	};
	
	this.isWidgetAreaChecked = function(){
		return this.checkWidgetArea;
	};
	
	this.isWidgetStreetChecked = function(){
		return this.checkWidgetStreet;
	};
	
	this.isWidgetPsChecked = function(){
		return this.checkWidgetPs;
	};
	
	this.isWidgetPmChecked = function(){
		return this.checkWidgetPm;
	};
	
	this.isWidgetBpChecked = function(){
		return this.checkWidgetBp;
	};
	
	this.isWidgetZone0Checked = function(){
		return this.checkWidgetZone0;
	};
	
	this.isWidgetZone1Checked = function(){
		return this.checkWidgetZone1;
	};
	
	this.isWidgetZone2Checked = function(){
		return this.checkWidgetZone2;
	};
	
	this.isWidgetZone3Checked = function(){
		return this.checkWidgetZone3;
	};
	
	this.isWidgetZone4Checked = function(){
		return this.checkWidgetZone4;
	};
	
	this.getZFilterIndexes = function(){
		return this.zfilterIndexs;
	};
	
	this.getZValues = function(){
		return this.zvalues;
	};
	
    //Area Component settings
    this.loadAreaAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			this.area_conf.a_name = attributes[i];
    		}
    		if(attributes[i].code == 'fee'){
    			this.area_conf.a_fee = attributes[i];
    		}
    		if(attributes[i].code == 'timeSlot'){
    			this.area_conf.a_timeSlot = attributes[i];
    		}
    		if(attributes[i].code == 'smsCode'){
    			this.area_conf.a_smsCode = attributes[i];
    		}
    		if(attributes[i].code == 'municipality'){
    			this.area_conf.a_municipality = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			this.area_conf.a_note = attributes[i];
    		}
    		if(attributes[i].code == 'color'){
    			this.area_conf.a_color = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.area_conf.a_geometry = attributes[i];
    		}
    		if(attributes[i].code.indexOf('zone') > -1){
    			var index = parseInt(attributes[i].code.charAt(4));
    			switch(index){
	    			case 0: 
	    				this.area_conf.a_zones0 = attributes[i];
	    				break;
	    			case 1: 
	    				this.area_conf.a_zones1 = attributes[i];
	    				break;
	    			case 2: 
	    				this.area_conf.a_zones2 = attributes[i];
	    				break;
	    			case 3: 
	    				this.area_conf.a_zones3 = attributes[i];
	    				break;
	    			case 4: 
	    				this.area_conf.a_zones4 = attributes[i];
	    				break;
	    			default: break;
    			}
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showArea = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showAreaDB = true;
    			}
    		}
    	}
    	return this.area_conf;
    };
    
    //Street Component settings
    this.loadStreetAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'streetReference'){
    			this.street_conf.s_streetRef = attributes[i];
    		}
    		if(attributes[i].code == 'slotNumber'){
    			this.street_conf.s_slotNum = attributes[i];
    		}
    		if(attributes[i].code == 'handicappedSlotNumber'){
    			this.street_conf.s_handicappedSlot = attributes[i];
    		}
    		if(attributes[i].code == 'reservedSlotNumber'){
    			this.street_conf.s_reservedSlot = attributes[i];
    		}
    		if(attributes[i].code == 'timedParkSlotNumber'){
    			this.street_conf.s_timedSlot = attributes[i];
    		}
    		if(attributes[i].code == 'paidSlotNumber'){
    			this.street_conf.s_paidSlot = attributes[i];
    		}
    		if(attributes[i].code == 'freeParkSlotNumber'){
    			this.street_conf.s_freeSlot = attributes[i];
    		}
    		if(attributes[i].code == 'freeParkSlotSignNumber'){
    			this.street_conf.s_freeSlotSign = attributes[i];
    		}
    		if(attributes[i].code == 'unusuableSlotNumber'){
    			this.street_conf.s_unusuableSlot = attributes[i];
    		}
    		if(attributes[i].code == 'subscritionAllowedPark'){
    			this.street_conf.s_subscrition = attributes[i];
    		}
    		if(attributes[i].code == 'rateAreaId'){
    			this.street_conf.s_areaId = attributes[i];
    		}
    		if(attributes[i].code == 'pms'){
    			this.street_conf.s_pms = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.street_conf.s_geometry = attributes[i];
    		}
    		if(attributes[i].code.indexOf('zone') > -1){
    			var index = parseInt(attributes[i].code.charAt(4));
    			switch(index){
	    			case 0: 
	    				this.street_conf.s_zones0 = attributes[i];
	    				break;
	    			case 1: 
	    				this.street_conf.s_zones1 = attributes[i];
	    				break;
	    			case 2: 
	    				this.street_conf.s_zones2 = attributes[i];
	    				break;
	    			case 3: 
	    				this.street_conf.s_zones3 = attributes[i];
	    				break;
	    			case 4: 
	    				this.street_conf.s_zones4 = attributes[i];
	    				break;
	    			default: break;
    			}
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showStreet = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showStreetDB = true;
    			}
    		}
    	}
    	return this.street_conf;
    };
    
    //Pm Component settings
    this.loadPmAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'code'){
    			this.pm_conf.pm_code = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			this.pm_conf.pm_note = attributes[i];
    		}
    		if(attributes[i].code == 'status'){
    			this.pm_conf.pm_status = attributes[i];
    		}
    		if(attributes[i].code == 'rateArea'){
    			this.pm_conf.pm_rateArea = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.pm_conf.pm_geometry = attributes[i];
    		}
    		if(attributes[i].code.indexOf('zone') > -1){
    			var index = parseInt(attributes[i].code.charAt(4));
    			switch(index){
	    			case 0: 
	    				this.pm_conf.pm_zones0 = attributes[i];
	    				break;
	    			case 1: 
	    				this.pm_conf.pm_zones1 = attributes[i];
	    				break;
	    			case 2: 
	    				this.pm_conf.pm_zones2 = attributes[i];
	    				break;
	    			case 3: 
	    				this.pm_conf.pm_zones3 = attributes[i];
	    				break;
	    			case 4: 
	    				this.pm_conf.pm_zones4 = attributes[i];
	    				break;
	    			default: break;
    			}
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showPm = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showPmDB = true;
    			}
    		}
    	}
    	return this.pm_conf;
    };
    
    //Ps Component settings
    this.loadPsAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			this.ps_conf.ps_name = attributes[i];
    		}
    		if(attributes[i].code == 'streetReference'){
    			this.ps_conf.ps_address = attributes[i];
    		}
    		if(attributes[i].code == 'managementMode'){
    			this.ps_conf.ps_management = attributes[i];
    		}
    		if(attributes[i].code == 'manager'){
    			this.ps_conf.ps_manager = attributes[i];
    		}
    		if(attributes[i].code == 'paymentMode'){
    			this.ps_conf.ps_payment = attributes[i];
    		}
    		if(attributes[i].code == 'fee'){
    			this.ps_conf.ps_fee = attributes[i];
    		}
    		if(attributes[i].code == 'timeSlot'){
    			this.ps_conf.ps_timeSlot = attributes[i];
    		}
    		if(attributes[i].code == 'slotNumber'){
    			this.ps_conf.ps_slotNumber = attributes[i];
    		}
    		if(attributes[i].code == 'handicappedSlotNumber'){
    			this.ps_conf.ps_handicappedSlot = attributes[i];
    		}
    		if(attributes[i].code == 'unusuableSlotNumber'){
    			this.ps_conf.ps_unusuableSlot = attributes[i];
    		}
    		if(attributes[i].code == 'phoneNumber'){
    			this.ps_conf.ps_phoneNumber = attributes[i];
    		}
    		if(attributes[i].code == 'parkride'){
    			this.ps_conf.ps_parkride = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.ps_conf.ps_geometry = attributes[i];
    		}
    		if(attributes[i].code.indexOf('zone') > -1){
    			var index = parseInt(attributes[i].code.charAt(4));
    			switch(index){
	    			case 0: 
	    				this.ps_conf.ps_zones0 = attributes[i];
	    				break;
	    			case 1: 
	    				this.ps_conf.ps_zones1 = attributes[i];
	    				break;
	    			case 2: 
	    				this.ps_conf.ps_zones2 = attributes[i];
	    				break;
	    			case 3: 
	    				this.ps_conf.ps_zones3 = attributes[i];
	    				break;
	    			case 4: 
	    				this.ps_conf.ps_zones4 = attributes[i];
	    				break;
	    			default: break;
    			}
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showPs = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showPsDB = true;
    			}
    		}
    	}
    	return this.ps_conf;
    };
    
    //Zones0 Component settings
    this.loadZoneAttributes0 = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			this.zoneatt0.zone_name = attributes[i];
    		}
    		if(attributes[i].code == 'submacro'){
    			this.zoneatt0.zone_submacro = attributes[i];
    		}
    		if(attributes[i].code == 'submicro'){
    			this.zoneatt0.zone_submicro = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			this.zoneatt0.zone_note = attributes[i];
    		}
    		if(attributes[i].code == 'status'){
    			this.zoneatt0.zone_status = attributes[i];
    		}
    		if(attributes[i].code == 'type'){
    			this.zoneatt0.zone_type = attributes[i];
    		}
    		if(attributes[i].code == 'color'){
    			this.zoneatt0.zone_color = attributes[i];
    		}
    		if(attributes[i].code == 'centermap'){
    			this.zoneatt0.zone_centermap = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.zoneatt0.zone_geometry = attributes[i];
    		}
    		if(attributes[i].code == 'geomFromSubelement'){
    			this.zoneatt0.zone_geom_from_subelement = attributes[i];
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showZone0 = true;
    			}
    		}
    		if(attributes[i].code == 'filter'){
    			if(attributes[i].visible){
    				this.filterZone0 = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showZone0DB = true;
    			}
    		}
    	}
    	return this.zoneatt0;
    };
    
    //Zones1 Component settings
    this.loadZoneAttributes1 = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			this.zoneatt1.zone_name = attributes[i];
    		}
    		if(attributes[i].code == 'submacro'){
    			this.zoneatt1.zone_submacro = attributes[i];
    		}
    		if(attributes[i].code == 'submicro'){
    			this.zoneatt1.zone_submicro = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			this.zoneatt1.zone_note = attributes[i];
    		}
    		if(attributes[i].code == 'status'){
    			this.zoneatt1.zone_status = attributes[i];
    		}
    		if(attributes[i].code == 'type'){
    			this.zoneatt1.zone_type = attributes[i];
    		}
    		if(attributes[i].code == 'color'){
    			this.zoneatt1.zone_color = attributes[i];
    		}
    		if(attributes[i].code == 'centermap'){
    			this.zoneatt1.zone_centermap = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.zoneatt1.zone_geometry = attributes[i];
    		}
    		if(attributes[i].code == 'geomFromSubelement'){
    			this.zoneatt1.zone_geom_from_subelement = attributes[i];
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showZone1 = true;
    			}
    		}
    		if(attributes[i].code == 'filter'){
    			if(attributes[i].visible){
    				this.filterZone1 = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showZone1DB = true;
    			}
    		}
    	}
    	return this.zoneatt1;
    };
    
    //Zones2 Component settings
    this.loadZoneAttributes2 = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			this.zoneatt2.zone_name = attributes[i];
    		}
    		if(attributes[i].code == 'submacro'){
    			this.zoneatt2.zone_submacro = attributes[i];
    		}
    		if(attributes[i].code == 'submicro'){
    			this.zoneatt2.zone_submicro = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			this.zoneatt2.zone_note = attributes[i];
    		}
    		if(attributes[i].code == 'status'){
    			this.zoneatt2.zone_status = attributes[i];
    		}
    		if(attributes[i].code == 'type'){
    			this.zoneatt2.zone_type = attributes[i];
    		}
    		if(attributes[i].code == 'color'){
    			this.zoneatt2.zone_color = attributes[i];
    		}
    		if(attributes[i].code == 'centermap'){
    			this.zoneatt2.zone_centermap = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.zoneatt2.zone_geometry = attributes[i];
    		}
    		if(attributes[i].code == 'geomFromSubelement'){
    			this.zoneatt2.zone_geom_from_subelement = attributes[i];
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showZone2 = true;
    			}
    		}
    		if(attributes[i].code == 'filter'){
    			if(attributes[i].visible){
    				this.filterZone2 = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showZone2DB = true;
    			}
    		}
    	}
    	return this.zoneatt2;
    };
    
    //Zones3 Component settings
    this.loadZoneAttributes3 = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			this.zoneatt3.zone_name = attributes[i];
    		}
    		if(attributes[i].code == 'submacro'){
    			this.zoneatt3.zone_submacro = attributes[i];
    		}
    		if(attributes[i].code == 'submicro'){
    			this.zoneatt3.zone_submicro = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			this.zoneatt3.zone_note = attributes[i];
    		}
    		if(attributes[i].code == 'status'){
    			this.zoneatt3.zone_status = attributes[i];
    		}
    		if(attributes[i].code == 'type'){
    			this.zoneatt3.zone_type = attributes[i];
    		}
    		if(attributes[i].code == 'color'){
    			this.zoneatt3.zone_color = attributes[i];
    		}
    		if(attributes[i].code == 'centermap'){
    			this.zoneatt3.zone_centermap = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.zoneatt3.zone_geometry = attributes[i];
    		}
    		if(attributes[i].code == 'geomFromSubelement'){
    			this.zoneatt3.zone_geom_from_subelement = attributes[i];
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showZone3 = true;
    			}
    		}
    		if(attributes[i].code == 'filter'){
    			if(attributes[i].visible){
    				this.filterZone3 = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showZone3DB = true;
    			}
    		}
    	}
    	return this.zoneatt3;
    };

    //Zones4 Component settings
    this.loadZoneAttributes4 = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			this.zoneatt4.zone_name = attributes[i];
    		}
    		if(attributes[i].code == 'submacro'){
    			this.zoneatt4.zone_submacro = attributes[i];
    		}
    		if(attributes[i].code == 'submicro'){
    			this.zoneatt4.zone_submicro = attributes[i];
    		}
    		if(attributes[i].code == 'note'){
    			this.zoneatt4.zone_note = attributes[i];
    		}
    		if(attributes[i].code == 'status'){
    			this.zoneatt4.zone_status = attributes[i];
    		}
    		if(attributes[i].code == 'type'){
    			this.zoneatt4.zone_type = attributes[i];
    		}
    		if(attributes[i].code == 'color'){
    			this.zoneatt4.zone_color = attributes[i];
    		}
    		if(attributes[i].code == 'centermap'){
    			this.zoneatt4.zone_centermap = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.zoneatt4.zone_geometry = attributes[i];
    		}
    		if(attributes[i].code == 'geomFromSubelement'){
    			this.zoneatt4.zone_geom_from_subelement = attributes[i];
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showZone4 = true;
    			}
    		}
    		if(attributes[i].code == 'filter'){
    			if(attributes[i].visible){
    				this.filterZone4 = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showZone4DB = true;
    			}
    		}
    	}
    	return this.zoneatt4;
    };    
    
    //BikePoint Component settings
    this.loadBikeAttributes = function(attributes){
    	for(var i = 0; i < attributes.length; i++){
    		if(attributes[i].code == 'name'){
    			this.bp_conf.bp_name = attributes[i];
    		}
    		if(attributes[i].code == 'bikeNumber'){
    			this.bp_conf.bp_bikeNumber = attributes[i];
    		}
    		if(attributes[i].code == 'slotNumber'){
    			this.bp_conf.bp_slotNumber = attributes[i];
    		}
    		if(attributes[i].code == 'geometry'){
    			this.bp_conf.bp_geometry = attributes[i];
    		}
    		if(attributes[i].code.indexOf('zone') > -1){
    			var index = parseInt(attributes[i].code.charAt(4));
    			switch(index){
	    			case 0: 
	    				this.bp_conf.bp_zones0 = attributes[i];
	    				break;
	    			case 1: 
	    				this.bp_conf.bp_zones1 = attributes[i];
	    				break;
	    			case 2: 
	    				this.bp_conf.bp_zones2 = attributes[i];
	    				break;
	    			case 3: 
	    				this.bp_conf.bp_zones3 = attributes[i];
	    				break;
	    			case 4: 
	    				this.bp_conf.bp_zones4 = attributes[i];
	    				break;
	    			default: break;
    			}
    		}
    		if(attributes[i].code == 'widget'){
    			if(attributes[i].visible){
    				this.showBp = true;
    			}
    		}
    		if(attributes[i].code == 'viewPage'){
    			if(attributes[i].visible){
    				this.showBpDB = true;
    			}
    		}
    	}
    	return this.bp_conf;
    };
    
    this.initComponents = function(){
    	this.zonePageList = [];
		var showedObjects = this.getVisibleObjList();
		for(var i = 0; i < showedObjects.length; i++){
	   		if(showedObjects[i].id == 'Area'){
	   			this.loadAreaAttributes(showedObjects[i].attributes);
	   		}
	   		if(showedObjects[i].id == 'Street'){
	   			this.loadStreetAttributes(showedObjects[i].attributes);
	   		}
	   		if(showedObjects[i].id == 'Pm'){
	   			this.loadPmAttributes(showedObjects[i].attributes);
	   		}
	   		if(showedObjects[i].id == 'Ps'){
	   			this.loadPsAttributes(showedObjects[i].attributes);
	   		}
	   		if(showedObjects[i].id == 'Bp'){
	    		this.loadBikeAttributes(showedObjects[i].attributes);
	    	}
	   		if(showedObjects[i].id.indexOf('Zone') > -1){
	   			var zid = showedObjects[i].id.charAt(4);
	   			var zoneatt = null;
    			var pageIndex = parseInt(zid);
    			var indx = pageIndex + 2;
    			var type = showedObjects[i].type;
    			var title = 'manage_' + type + '_tab';
    			var label = showedObjects[i].label;
    			var tab = { title: title, index: indx, content:"partials/edit/tabs/zones/edit_zone" + pageIndex + ".html" };
    			switch(pageIndex){
    				case 0:
    					var att = this.loadZoneAttributes0(showedObjects[i].attributes);
    					var zonePageData = this.getZonePageData(pageIndex, type, att, tab);
    					this.label0 = label;
    					if(this.showZone0){
    						this.zonePageList.push(zonePageData);
    					}
    					break;
    				case 1: 
    					var att = this.loadZoneAttributes1(showedObjects[i].attributes);
    					var zonePageData = this.getZonePageData(pageIndex, type, att, tab);
    					this.label1 = label;
    					if(this.showZone1){
    						this.zonePageList.push(zonePageData);
    					}
    					break;
    				case 2: 
    					var att = this.loadZoneAttributes2(showedObjects[i].attributes);
    					var zonePageData = this.getZonePageData(pageIndex, type, att, tab);
    					this.label2 = label;
    					if(this.showZone2){
    						this.zonePageList.push(zonePageData);
    					}
    					break;
    				case 3: 
    					var att = this.loadZoneAttributes3(showedObjects[i].attributes);
    					var zonePageData = this.getZonePageData(pageIndex, type, att, tab);
    					this.label3 = label;
    					if(this.showZone3){
    						this.zonePageList.push(zonePageData);
    					}
    					break;
    				case 4: 
    					var att = this.loadZoneAttributes4(showedObjects[i].attributes);
    					var zonePageData = this.getZonePageData(pageIndex, type, att, tab);
    					this.label4 = label;
    					if(this.showZone4){
    						this.zonePageList.push(zonePageData);
    					}
    					break;
    			}
	   		}
	   	}
    };
    
    this.correctWidgetFiltersAndElements = function(){
    	if(this.widget_elements && this.widget_elements != "null"){
    		var elems = this.widget_elements.split(",");
    		for(var i = 0; i < elems.length; i++){
    			var eletype = null;
    			var elevalue = null;
    			if(elems[i].indexOf(":") > -1){
    				var ele_data = elems[i].split(":");
    				eletype = ele_data[0];
    				elevalue = ele_data[1];
    			} else {
    				eletype = elems[i];
    			}
    			switch (eletype){
    			case "area": 
    				this.showWidgetArea = true;
    				if(elevalue == "1"){
    					this.checkWidgetArea = true;
    				} else {
    					this.checkWidgetArea = false;
    				}	
    				break;
    			case "parcheggio": 
    				this.showWidgetStreet = true;
    				if(elevalue == "1"){
    					this.checkWidgetStreet = true;
    				} else {
    					this.checkWidgetStreet = false;
    				}
    				break;
    			case "ps": 
    				this.showWidgetPs = true;
    				if(elevalue == "1"){
    					this.checkWidgetPs = true;
    				} else {
    					this.checkWidgetPs = false;
    				}
    				break;
    			case "pm": 
    				this.showWidgetPm = true;
    				if(elevalue == "1"){
    					this.checkWidgetPm = true;
    				} else {
    					this.checkWidgetPm = false;
    				}
    				break;
    			case "pb": 
    				this.showWidgetBp = true;
    				if(elevalue == "1"){
    					this.checkWidgetBp = true;
    				} else {
    					this.checkWidgetBp = false;
    				}
    				break;
    			default :
    				// manage zones;
    				if(elems[i].indexOf("zona") > -1){
    					var index = elems[i].charAt(4);
    					switch(index){
	    					case "0": 
	    						this.showWidgetZone0 = true;
	    						if(elevalue == "1"){
	    							this.checkWidgetZone0 = true;
	    	    				} else {
	    	    					this.checkWidgetZone0 = false;
	    	    				}
	    						break;
	    					case "1":
	    						this.showWidgetZone1 = true;
	    						if(elevalue == "1"){
	    							this.checkWidgetZone1 = true;
	    	    				} else {
	    	    					this.checkWidgetZone1 = false;
	    	    				}
	    						break;
	    					case "2": 
	    						this.showWidgetZone2 = true;
	    						if(elevalue == "1"){
	    							this.checkWidgetZone2 = true;
	    	    				} else {
	    	    					this.checkWidgetZone2 = false;
	    	    				}
	    						break;
	    					case "3": 
	    						this.showWidgetZone3 = true;
	    						if(elevalue == "1"){
	    							this.checkWidgetZone3 = true;
	    	    				} else {
	    	    					this.checkWidgetZone3 = false;
	    	    				}
	    						break;
	    					case "4": 
	    						this.showWidgetZone4 = true;
	    						if(elevalue == "1"){
	    							this.checkWidgetZone4 = true;
	    	    				} else {
	    	    					this.checkWidgetZone4 = false;
	    	    				}
	    						break;
    					}
    				}
    				break;
    			}
    			
    		}
    	} else {
    		this.showWidgetArea = this.showArea;
    		this.checkWidgetArea = false;
    		this.showWidgetStreet = this.showStreet;
    		this.checkWidgetStreet = true;
    		this.showWidgetPs = this.showPs;
    		this.checkWidgetPs = true;
    		this.showWidgetPm = this.showPm;
    		this.checkWidgetPm = false;
    		this.showWidgetBp = this.showBp;
    		this.checkWidgetBp = false;
    		this.showWidgetZone0 = this.showZone0;
    		this.checkWidgetZone0 = false;
    		this.showWidgetZone1 = this.showZone1;
    		this.checkWidgetZone1 = false;
    		this.showWidgetZone2 = this.showZone2;
    		this.checkWidgetZone2 = false;
    		this.showWidgetZone3 = this.showZone3;
    		this.checkWidgetZone3 = false;
    		this.showWidgetZone4 = this.showZone4;
    		this.checkWidgetZone4 = false;
    	}
    	if(this.widget_filters && this.widget_filters != "null"){
    		var zfilters = this.widget_filters.split(",");
    		for(var i = 0; i < zfilters.length; i++){
    			var zfilterData = zfilters[i].split(":");
    			var zfilter = zfilterData[0];
    			var zfilterIndex = zfilter.charAt(4);
    			var zvalue = zfilterData[1];
    			this.zfilterIndexs.push(zfilterIndex);
    			this.zvalues.push(zvalue);
    		}
    		
    	}
    };
    
    this.getZonePagesDataList = function(){
    	return this.zonePageList;
    };
    
    this.getZonePageData = function(zoneid, type, att, tab){
    	var zonePageData = {
    		type: null,
    		id: null,
    		att: null,
    		tab: null
    	};
    	zonePageData.type = type;
		zonePageData.id = zoneid + 2;
		zonePageData.att = att;
		zonePageData.tab = tab
    	return zonePageData;
    };
    
});