'use strict';

/* App Module */

var pm = angular.module('pm', [ 
	'localization',
	'ngRoute',
	'ngSanitize',
	'colorpicker.module',
	'ngMap',
	
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
//    	.when('/', {
//    		templateUrl: 'partials/dashboard/viewpark.html',
//    		controller: 'ViewDashboardCtrlPark',
//    		controllerAs: 'db_view_park_ctrl'
//    	})
//    	.when('/home', {
//    		templateUrl: 'partials/dashboard/viewpark.html',
//    		controller: 'ViewDashboardCtrlPark',
//    		controllerAs: 'db_view_park_ctrl'
//    	})
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
//    	.when('/viewallrv', {
//    		templateUrl: 'partials/view/viewallgmapnosec.html',
//    		controller: 'ViewCtrlGmap',
//    		controllerAs: 'view_ctrl_gmap'
//    	})
//    	.when('/viewalltn', {
//    		templateUrl: 'partials/view/viewallgmapnosec.html',
//    		controller: 'ViewCtrlGmap',
//    		controllerAs: 'view_ctrl_gmap'
//    	})  	
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
//pm.run(function(editableOptions) {
//	 editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
//});