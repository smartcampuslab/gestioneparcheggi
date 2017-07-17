'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('MainCtrl', ['$scope', '$http', '$route', '$window', '$cookies', '$routeParams', '$rootScope', 'localize', '$locale', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeDashboardWSService', 'invokeWSServiceProxy', 'invokePdfServiceProxy', 'initializeService', 'utilsService', 'getMyMessages', '$timeout',
    function ($scope, $http, $route, $window, $cookies, $routeParams, $rootScope, localize, $locale, $dialogs, sharedDataService, $filter, invokeWSService, invokeDashboardWSService, invokeWSServiceProxy, invokePdfServiceProxy, initializeService, utilsService, getMyMessages, $timeout) {

    $scope.setFrameOpened = function (value) {
      $rootScope.frameOpened = value;
    };

    $scope.setViewTabs = function () {
      $scope.hideHome();
      $scope.setNextButtonViewLabel("Chiudi");
      $scope.setFrameOpened(true);
    };

    $scope.setNextButtonViewLabel = function (value) {
      $rootScope.buttonNextViewLabel = value;
    };

    $window.onresize = function () {
      changeTemplate();
      $scope.$apply();
    };
    changeTemplate();

    function changeTemplate() {
      var screenWidth = $window.innerWidth;
      if (screenWidth >= 1250) { //1170
        $scope.tabletWiew = false;
      } else {
        $scope.tabletWiew = true;
      }
    }

    $scope.$route = $route;
    //$scope.$location = $location;
    $scope.$routeParams = $routeParams;
    //this.params = $routeParams;

    $scope.userCF = sharedDataService.getUserIdentity();

    $scope.app;

    //$scope.citizenId = userId;
    $scope.user_token = token;

    // new elements for view
    $scope.currentView;
    $scope.editMode;
    $scope.currentViewDetails;

    // max practices displayed in home list
    $scope.maxPractices = 10;
    $scope.practicesWSM = [];

    // for language icons
    var itaLanguage = "active";
    var engLanguage = "";

    // for localization
    $scope.setEnglishLanguage = function () {
      $scope.used_lang = "i18n/angular-locale_en-EN.js";
      itaLanguage = "";
      engLanguage = "active";
      localize.setLanguage('en-US');
      sharedDataService.setUsedLanguage('eng');
    };

    $scope.setItalianLanguage = function () {
      $scope.used_lang = "i18n/angular-locale_it-IT.js";
      itaLanguage = "active";
      engLanguage = "";
      localize.setLanguage('it-IT');
      sharedDataService.setUsedLanguage('ita');
    };

    if (sharedDataService.getUsedLanguage() == 'ita') {
      // here I force ita for the first app access
      $scope.setItalianLanguage();
    }

    $scope.setUserLocale = function (lan) {
      var lan_uri = '';
      if (lan == "it-IT") {
        lan_uri = 'i18n/angular-locale_it-IT.js';
      } else if (lan == "en-US") {
        lan_uri = 'i18n/angular-locale_en-EN.js';
      }
      $http.get(lan_uri)
        .success(function (results) {
          console.log("Success get locale " + results);
          $locale = results;
          //angular.copy(results, $locale);
          $locale.id;
        })
        .error(function (results) {
          console.log("Error get locale " + results);
        });
    };

    $scope.isActiveItaLang = function () {
      return itaLanguage;
    };

    $scope.isActiveEngLang = function () {
      return engLanguage;
    };
    $scope.getLabelByType = function (type) {
        var types = sharedDataService.getSharedPaymentMethods();
        for (var i = 0; i < types.length; i++) {
          if (types[i].type == type)
            return types[i].value;
        }
        return "";
      }
      // for services selection
    var homeShowed = true;
    // for menu manageing
    var home = "";
    var parkhome = "";
    var auxhome = "";

    var homeSubPark = "";
    var editingPark = "active";
    var editingBike = "";
    var viewingAll = "";

    // ----------------------- Dashboard section ----------------------
    var dashboard = "active";

    $scope.setHomeDashboardActive = function () {
      home = "";
      dashboard = "active";
      parkhome = "";
      auxhome = "";
      viewingAll = "";
      sharedDataService.setInGlobalLogPage(false);
    };

    $scope.isHomeDashboardActive = function () {
      return dashboard;
    };
    // ------------------- End of Dashboard section -------------------

    $scope.hideHome = function () {
      homeShowed = false;
    };

    $scope.showHome = function () {
      homeShowed = true;
    };

    $scope.isHomeShowed = function () {
      return homeShowed;
    };

    $scope.isHomeActive = function () {
      return home;
    };

    $scope.home = function () {
      $scope.setFrameOpened(false);
      // I refresh all the actived Link
      home = "active";
      dashboard = ""; // Used for dashboard
      parkhome = "";
      auxhome = "";
      homeSubPark = "";
      editingPark = "";
      editingBike = "";
      viewingAll = "";
      //window.document.location = "./";
      $scope.showHome();
      sharedDataService.setInGlobalLogPage(false);
    };

    $scope.setHomeParkActive = function () {
      home = "";
      dashboard = ""; // Used for dashboard
      parkhome = "active";
      auxhome = "";
      homeSubPark = "";
      editingPark = "active";
      editingBike = "";
      viewingAll = "";
      sharedDataService.setInGlobalLogPage(false);
    };

    $scope.isHomeParkActive = function () {
      return parkhome;
    };

    $scope.setHomeAuxActive = function () {
      home = "";
      dashboard = ""; // Used for dashboard
      parkhome = "";
      auxhome = "active";
      viewingAll = "";
    };

    $scope.isHomeAuxActive = function () {
      return auxhome;
    };

    $scope.setHomeSubParkActive = function () {
      homeSubPark = "active";
      editingPark = "";
      editingBike = "";
      viewingAll = "";
    };

    $scope.isHomeSubParkActive = function () {
      return homeSubPark;
    };

    $scope.setEditingParkActive = function () {
      homeSubPark = "";
      editingPark = "active";
      editingBike = "";
      viewingAll = "";
    };

    $scope.isEditingParkActive = function () {
      return editingPark;
    };

    $scope.setEditingBikeActive = function () {
      homeSubPark = "";
      editingPark = "";
      editingBike = "active";
      viewingAll = "";
    };

    $scope.isEditingBikeActive = function () {
      return editingBike;
    };

    $scope.setViewAllActive = function () {
      parkhome = "";
      homeSubPark = "";
      editingPark = "";
      editingBike = "";
      viewingAll = "active";
      auxhome = "";
      dashboard = "";
      sharedDataService.setInGlobalLogPage(false);
    };

    $scope.isViewAllActive = function () {
      return viewingAll;
    };

    $scope.logout = function () {
      // Clear some session variables
      sharedDataService.setName(null);
      sharedDataService.setSurname(null);
      sharedDataService.setBase64(null);
      $scope.user_token = null;
      sharedDataService.setInGlobalLogPage(false);

      window.location.href = "logout";
    };

    $scope.getToken = function () {
      return 'Bearer ' + $scope.user_token;
    };

    $scope.authHeaders = {
      'Authorization': $scope.getToken(),
      'Accept': 'application/json;charset=UTF-8'
    };

    // For user shared data
    if (user_name != null && user_surname != null) {
      sharedDataService.setName(user_name);
      sharedDataService.setSurname(user_surname);
    }

    $scope.initPsManagers = function (vals) {
      var tmp = [];
      tmp = vals.split(",");
      return tmp;
    };

    $scope.initMunicipalities = function (vals) {
      var tmp = [];
      tmp = vals.split(",");
      return tmp;
    };

    var correctStringToList = function (stringList) {
      // appId=tn, description=posti per automobile, name=Car, language_key=car_vehicle, userName=trento1
      var list = [];
      if (stringList && stringList != "null") {
        var subList = stringList.substring(1, stringList.length - 1);
        var elements = subList.split("},");
        if (elements[elements.length-1].endsWith('}'))
        {
           elements[elements.length-1]=elements[elements.length-1].slice(0, -1);
        }
        for (var j = 0; j < elements.length; j++) {
          var allAttribute = elements[j].split(", ");

          var appId;
          var name;
          var description;
          var language_key;
          var userName;
          var visible;

          for (var i = 0; i < allAttribute.length; i++) {
            if (allAttribute[i].indexOf("appId=") !== -1) {
              appId = allAttribute[i].split("=")[1];
            }
            if (allAttribute[i].indexOf("name=") !== -1) {
              name = allAttribute[i].split("=")[1];
            }
            if (allAttribute[i].indexOf("description=") !== -1) {
              description = allAttribute[i].split("=")[1];
            }

            if (allAttribute[i].indexOf("language_key=") !== -1) {
              language_key = allAttribute[i].split("=")[1];
            }
            if (allAttribute[i].indexOf("userName=") !== -1) {
              userName = allAttribute[i].split("=")[1];
            }
            if (allAttribute[i].indexOf("visible=") !== -1) {
              visible = allAttribute[i].split("=")[1];
            }

          }
          var data = {
            appId: appId,
            name: name,
            description: description,
            language_key: language_key,
            userName: userName,
            visible: visible
          };

          list.push(data);
        }
      }
      return list;
    }

    var correctStringToAgecyData = function (stringAg) {
      // id=prova789, structure=2, bike=2, area=3, description=Agency id per trentino mobilita', street=2, name=Agency tn, zone=1, parkingmeter=2
      var data = {};
      var substringAg = stringAg.substring(1, stringAg.length - 1);
      var allAttribute = substringAg.split(", ");
      var id;
      var name;
      var description;
      var area;
      var zone;
      var street;
      var structure;
      var parkingmeter;
      var bike;
      var dbref;
      for (var i = 0; i < allAttribute.length; i++) {
        if (allAttribute[i].indexOf("id=") !== -1) {
          id = allAttribute[i].split("=")[1];
        }
        if (allAttribute[i].indexOf("name=") !== -1) {
          name = allAttribute[i].split("=")[1];
        }
        if (allAttribute[i].indexOf("description=") !== -1) {
          description = allAttribute[i].split("=")[1];
        }
        if (allAttribute[i].indexOf("area=") !== -1) {
          area = allAttribute[i].split("=")[1];
        }
        if (allAttribute[i].indexOf("zone=") !== -1) {
          zone = allAttribute[i].split("=")[1];
        }
        if (allAttribute[i].indexOf("street=") !== -1) {
          street = allAttribute[i].split("=")[1];
        }
        if (allAttribute[i].indexOf("structure=") !== -1) {
          structure = allAttribute[i].split("=")[1];
        }
        if (allAttribute[i].indexOf("parkingmeter=") !== -1) {
          parkingmeter = allAttribute[i].split("=")[1];
        }
        if (allAttribute[i].indexOf("bike=") !== -1) {
          bike = allAttribute[i].split("=")[1];
        }
        if (allAttribute[i].indexOf("dbref=") !== -1) {
          dbref = allAttribute[i].split("=")[1];
        }
      }
      data = {
        id: id,
        name: name,
        description: description,
        area: area,
        zone: zone,
        street: street,
        structure: structure,
        parkingmeter: parkingmeter,
        bike: bike,
        dbref: dbref
      };
      return data;
    }

    // for agency id
    if (conf_agency && conf_agency != '') {
      //var tmp_ags = conf_agency_list.substring(1, conf_agency_list.length - 1);
      //var user_agencies = tmp_ags.split(",");
      sharedDataService.setConfUserAgency(correctStringToAgecyData(conf_agency));
    }

    if (conf_all_agencies && conf_all_agencies != '') {
      var allAgencies = [];
      var allAgs = conf_all_agencies.split('}');
      for (var i = 0; i < allAgs.length - 1; i++) {
        var corrAgency = correctStringToAgecyData(allAgs[i]);
        allAgencies.push(corrAgency);
      }
      sharedDataService.setAllAgencies(allAgencies);
    }

    sharedDataService.setConfAppId(conf_app_id);
    sharedDataService.setConfMapCenter(conf_map_center);
    if (conf_map_recenter && conf_map_recenter != "null") {
      sharedDataService.setConfMapRecenter(conf_map_recenter);
    }
    sharedDataService.setConfMapZoom(conf_map_zoom);
    //var zone_types = [];
    //zone_types.push(conf_macrozone_type);
    //zone_types.push(conf_microzone_type);
    //sharedDataService.setZoneTypeList(zone_types);
    //sharedDataService.setMicroZoneType(conf_microzone_type);
    //sharedDataService.setMacroZoneType(conf_macrozone_type);
    var ps_manager_vals = $scope.initPsManagers(conf_ps_managers);
    sharedDataService.setPsManagerVals(ps_manager_vals);
    $scope.widget_filters = initializeService.setWidgetFilters(conf_filters);
    $scope.widget_show_elements = initializeService.setWidgetElements(conf_elements);
    $scope.slots_vehicle_types = initializeService.setSlotsTypes(correctStringToList(conf_vehicle_type_list));
    initializeService.setConfAppId(conf_app_id);
    initializeService.setConfWidgetUrl(conf_widget_url);
    $scope.show_vt_footer = (conf_app_id == 'tn') ? true : false;

    $scope.correctStringToJsonString = function (data) {
      var tmpData = data.replace(new RegExp('=', 'g'), '\":\"');
      tmpData = tmpData.replace(new RegExp(',\u0020', 'g'), '\",\u0020\"'); // era new RegExp(', ','g'), '\", \"'
      tmpData = tmpData.replace(new RegExp('{', 'g'), '{\"');
      tmpData = tmpData.replace(new RegExp('}', 'g'), '\"}');
      tmpData = tmpData.replace(/:\"\[\{/g, ':[{');
      tmpData = tmpData.replace(/\}\]",/g, '}],');
      tmpData = tmpData.replace(/\}",/g, '},');
      tmpData = tmpData.replace(/,\u0020\"\{/g, ',\u0020{'); // era /, \"\{/g, ', {'
      tmpData = tmpData.replace(/\]\"\}/g, ']}');
      tmpData = tmpData.replace(/\"true\"/g, 'true');
      tmpData = tmpData.replace(/\"false\"/g, 'false');
      return tmpData;
    };

    $scope.loadConfObject = function (data) {
      if (data && data != "null") {
        var zoneTypes = [];
        var cleanedData = $scope.correctStringToJsonString("{list\":" + data + "}");
        var objList = JSON.parse(cleanedData);
        var visibleObjList = objList.list;
        for (var i = 0; i < visibleObjList.length; i++) {
          if (visibleObjList[i].id.indexOf("Zone") > -1) {
            var zone_type = {
              value: visibleObjList[i].type,
              label: visibleObjList[i].title
            };
            zoneTypes.push(zone_type);
          }
        }
        //var allObjs = data.split("}]}");
        //for(var i = 0; i < allObjs.length - 1; i++){
        //	var objFields = allObjs[i].split(", attributes=[{");
        //	var ids = objFields[0].split("=");
        //	var showedObj = {
        //			id : ids[1],
        //			attributes: $scope.correctAtributes(objFields[1])
        //	};
        //	visibleObjList.push(showedObj);
        //}
        sharedDataService.setZoneTypeList(zoneTypes);
        sharedDataService.setVisibleObjList(visibleObjList);
        initializeService.setVisibleObjList(visibleObjList);
        initializeService.initComponents(); // new method
        initializeService.correctWidgetFiltersAndElements(); // new method
      }
    };

    $scope.correctAtributes = function (data) {
      var corrAttribList = [];
      var attribList = data.split("}, {");
      for (var i = 0; i < attribList.length; i++) {
        var attribObj = attribList[i].split(", ");
        var code = "";
        var editable = "";
        var visible = "";
        var required = "";
        for (var j = 0; j < attribObj.length; j++) {
          var rec = attribObj[j].split("=");
          if (rec[0].indexOf("code") > -1) {
            code = rec[1];
          }
          if (rec[0].indexOf("editable") > -1) {
            editable = (rec[1] === 'true');
          }
          if (rec[0].indexOf("visible") > -1) {
            visible = (rec[1] === 'true');
          }
          if (rec[0].indexOf("required") > -1) {
            required = (rec[1] === 'true');
          }
        }
        var attrib = {
          code: code,
          visible: visible,
          required: required,
          editable: editable
        };
        corrAttribList.push(attrib);
      }
      return corrAttribList;
    };

    //$scope.checkJSESSIONID = function(){
    //	var Jsess = document.cookie;
    //var Jsess = $cookies['JSESSIONID'];
    //	console.log("JSESSIONID " + Jsess);
    //};

    $scope.loadConfObject(object_to_show);
    $scope.initComponents = function () {
      //$scope.checkJSESSIONID();
      $scope.showedObjects = sharedDataService.getVisibleObjList();
      $scope.showBikeMenuLink = false;
      $scope.showDashboardMenuLink = false;
      $scope.showAuxMenuLink = false;
      for (var i = 0; i < $scope.showedObjects.length; i++) {
        if ($scope.showedObjects[i].id == 'Bp') {
          $scope.showBikeMenuLink = true;
        }
        if ($scope.showedObjects[i].id == 'Dashboard') {
          if ($scope.showedObjects[i].attributes[0].visible) {
            $scope.showDashboardMenuLink = true;
            $scope.setHomeDashboardActive();
          } else {
            $scope.showDashboardMenuLink = false;
          }
          if ($scope.showedObjects[i].attributes[1] != null) {
            for (var j = 1; j < $scope.showedObjects[i].attributes.length; j++) {
              if ($scope.showedObjects[i].attributes[j].code == "dashbordAgencyAll") {
                // case agencyall
                if ($scope.showedObjects[i].attributes[j].visible) {
                  sharedDataService.setDasboardAllAgency("all");
                }
              } else if ($scope.showedObjects[i].attributes[j].code == "occupancyAgencyAll") {
                // case occupancyall
                if ($scope.showedObjects[i].attributes[j].visible) {
                  sharedDataService.setDasboardAllAgency("occupancy");
                }
              } else if ($scope.showedObjects[i].attributes[j].code == "profitAgencyAll") {
                // case profityall
                if ($scope.showedObjects[i].attributes[j].visible) {
                  sharedDataService.setDasboardAllAgency("profit");
                }
              }
            }
          } else {
            sharedDataService.setDasboardAllAgency("");
          }
        }
        if ($scope.showedObjects[i].id == 'Agency') {
          if ($scope.showedObjects[i].attributes[0].visible) {
            initializeService.setFilterAgency(true);
          } else {
            initializeService.setFilterAgency(false);
          }
        }
        if ($scope.showedObjects[i].id == 'Flux') {
          if ($scope.showedObjects[i].attributes[0].visible) {
            $scope.showAuxMenuLink = true;
          } else {
            $scope.showAuxMenuLink = false;
          }
        }
      }
      if ($scope.showDashboardMenuLink == false) {
        $scope.setHomeParkActive();
      }
    };

    $scope.initComponents();

    $scope.getUserName = function () {
      return sharedDataService.getName();
    };

    $scope.getUserSurname = function () {
      return sharedDataService.getSurname();
    };

    $scope.getMail = function () {
      return sharedDataService.getMail();
    };

    $scope.setMail = function (value) {
      sharedDataService.setMail(value);
    };

    $scope.translateUserGender = function (value) {
      if (sharedDataService.getUsedLanguage() == 'eng') {
        if (value == 'maschio') {
          return 'male';
        } else {
          return 'female';
        }
      } else {
        return value;
      }
    };



}]);
