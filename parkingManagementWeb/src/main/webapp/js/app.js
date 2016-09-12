'use strict';

/* App Module */

var pm = angular.module('pm', [ 
	'localization',
	'ngRoute',
	'ngSanitize',
	'colorpicker.module',
	'ngMap',
	//'angularFileUpload',
	//'angularAwesomeSlider',
	
	'pmServices',
	'pmControllers',
	'pmFilters',
	'pmDirectives',
	
	'ngCookies',
	'dialogs',
	'ui.bootstrap'
]);

pm.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
  	$routeProvider
  		/*.when('/', {
    		templateUrl: 'partials/home.html',
    		controller: 'MainCtrl',
    		controllerAs: 'main'
    	})*/
    	.when('/home', {
    		templateUrl: 'partials/home.html',
    		controller: 'MainCtrl',
    		controllerAs: 'main'
    	})
    	.when('/dashboard/home', {
    		templateUrl: 'partials/dashboard/viewpark.html',
    		controller: 'ViewDashboardCtrlPark',
    		controllerAs: 'db_view_park_ctrl'
    	})
    	.when('/park/home', {
    		templateUrl: 'partials/edit/parkediting.html',
    		controller: 'ParkCtrl',
    		controllerAs: 'park_ctrl'
    	})
    	.when('/auxiliary/home', {
    		templateUrl: 'partials/auxiliary/home.html',
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
    	.when('/view', {
    		templateUrl: 'partials/view/viewallgmap.html',
    		controller: 'ViewCtrlGmap',
    		controllerAs: 'view_ctrl_gmap'
    	})
    	.when('/viewall/:type', {
    		templateUrl: 'partials/view/viewallgmapnosec.html',
    		controller: 'ViewCtrlGmap',
    		controllerAs: 'view_ctrl_gmap'
    	})
    	.when('/auxiliary/logs/:id', {
    		templateUrl: 'partials/auxiliary/logs.html',
    		controller: 'AuxCtrl',
    		controllerAs: 'aux_ctrl'
    	})
//    	.when('/auxiliary/add/:at_id', {
//    		templateUrl: 'partials/auxiliary/add.html',
//    		controller: 'AuxCtrl',
//    		controllerAs: 'aux_ctrl'
//    	})
    	.when('/auxiliary/add/uploadfile/:objtype/:objperiod', {
    		templateUrl: 'partials/auxiliary/upload/upload_file.html',
    		controller: 'AuxCtrl',
    		controllerAs: 'aux_ctrl'
    	})
    	.otherwise({
    		redirectTo:'/home'
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
//pm.run(function(editableOptions) {
//	 editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
//});