'use strict';

/* App Module */

var pm = angular.module('pm', [ 
	'localization',
	'ngRoute',
	'ngSanitize',
	'colorpicker.module',
	//'uiGmapgoogle-maps',
	'ngMap',
	
	'pmServices',
	'pmControllers',
	'pmFilters',
	'pmDirectives',
	
	'ngCookies',
	'xeditable',
	'dialogs',
	'ui.bootstrap',
	'base64'
]);

pm.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
  	$routeProvider
  		.when('/', {
    		templateUrl: 'partials/home.html',
    		controller: 'MainCtrl',
    		controllerAs: 'main'
    	})
    	.when('/home', {
    		templateUrl: 'partials/home.html',
    		controller: 'MainCtrl',
    		controllerAs: 'main'
    	})
    	.when('/park/home', {
    		templateUrl: 'partials/park/home.html',
    		controller: 'MainCtrl',
    		controllerAs: 'main'
    	})
    	.when('/aux/home', {
    		templateUrl: 'partials/aux/home.html',
    		controller: 'MainCtrl',
    		controllerAs: 'main'
    	})
    	.when('/edit/park', {
    		templateUrl: 'partials/edit/parkediting.html',
    		controller: 'ParkCtrl',
    		controllerAs: 'park_ctrl'
    	})
    	.when('/edit/bike', {
    		templateUrl: 'partials/edit/bikeediting.html',
    		controller: 'BikeCtrl',
    		controllerAs: 'bike_ctrl'
    	})
//    	.when('/view', {
//    		templateUrl: 'partials/view/viewall.html',
//    		controller: 'ViewCtrl',
//    		controllerAs: 'view_ctrl'
//    	})
    	.when('/view', {
    		templateUrl: 'partials/view/viewallgmap.html',
    		controller: 'ViewCtrlGmap',
    		controllerAs: 'view_ctrl_gmap'
    	})
    	.when('/viewall', {
    		templateUrl: 'partials/view/viewallgmapnosec.html',
    		controller: 'ViewCtrlGmap',
    		controllerAs: 'view_ctrl_gmap'
    	})
//    	.when('/view', {
//    		templateUrl: 'partials/view/viewallgcode.html',
//    		controller: 'ViewCtrlGCode',
//    		controllerAs: 'view_ctrl_gcode'
//    	})
    	.when('/PracticeList/ass/:type', {
    		templateUrl: 'partials/practice_ass_list.html',
    		controller: 'PracticeCtrl',
    		controllerAs: 'practice_ctrl'
    	})
    	.when('/Practice/edit/:id', {
    		templateUrl: 'partials/edit_practice.html',
    		controller: 'PracticeCtrl',
    		controllerAs: 'practice_ctrl'
    	})
    	.when('/Practice/submit/:id', {
    		templateUrl: 'partials/submit_practice.html',
    		controller: 'PracticeCtrl',
    		controllerAs: 'practice_ctrl'
    	})
    	.when('/Practice/class/view/ass/ue/:phase', {
    		templateUrl: 'partials/class/class_eu_ass.html',
    		controller: 'PracticeCtrl',
    		controllerAs: 'practice_ctrl'
    	})
    	.when('/Practice/class/view/ass/extraue/:phase', {
    		templateUrl: 'partials/class/class_extra_eu_ass.html',
    		controller: 'PracticeCtrl',
    		controllerAs: 'practice_ctrl'
    	})
    	.when('/Practice/class/view/edil/ue/:phase', {
    		templateUrl: 'partials/class/class_eu_edil.html',
    		controller: 'PracticeCtrl',
    		controllerAs: 'practice_ctrl'
    	})
    	.when('/Practice/class/view/edil/extraue/:phase', {
    		templateUrl: 'partials/class/class_extra_eu_edil.html',
    		controller: 'PracticeCtrl',
    		controllerAs: 'practice_ctrl'
    	})
    	.when('/Console/search', {
    		templateUrl: 'partials/console/search.html',
    		controller: 'ConsoleCtrl',
    		controllerAs: 'console_ctrl'
    	})
    	.when('/Console/classification/final/:id', {
    		templateUrl: 'partials/console/classification/final_classification.html',
    		controller: 'ConsoleCtrl',
    		controllerAs: 'console_ctrl'
    	})
    	.when('/Console/classification/uploadfile/:cat/:type/:id', {
    		templateUrl: 'partials/console/upload/upload_file.html',
    		controller: 'ConsoleCtrl',
    		controllerAs: 'console_ctrl'
    	})
    	.when('/Console/classification/benefits', {
    		templateUrl: 'partials/console/classification/benefits_classification.html',
    		controller: 'ConsoleCtrl',
    		controllerAs: 'console_ctrl'
    	})
    	.when('/Console/classification/notifics', {
    		templateUrl: 'partials/console/classification/notifics_classification.html',
    		controller: 'ConsoleCtrl',
    		controllerAs: 'console_ctrl'
    	})
    	.when('/Console/report', {
    		templateUrl: 'partials/console/report.html',
    		controller: 'ConsoleCtrl',
    		controllerAs: 'console_ctrl'
    	})
    	.otherwise({
    		redirectTo:'/'
    	});
  			
  	$locationProvider.html5Mode(true);
}]);
pm.config(['$compileProvider',
    function( $compileProvider )
    {  
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|file):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);
//pm.config(function(uiGmapGoogleMapApiProvider) {
//    uiGmapGoogleMapApiProvider.configure({
//        key: 'AIzaSyBAyoQGPbpu84FQoIw_nfxaodL3vDYUgGA',
//        v: '3.17',
//        libraries: 'weather,geometry,visualization'
//    });
//});
pm.run(function(editableOptions) {
	 editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});