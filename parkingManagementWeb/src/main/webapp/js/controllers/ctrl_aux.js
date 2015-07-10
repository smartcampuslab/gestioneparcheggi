'use strict';

/* Controllers */
var pmControllers = angular.module('pmControllers');

pm.controller('AuxCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$route', '$location', '$dialogs', 'sharedDataService', '$filter', 'invokeWSService', 'invokeWSServiceProxy', 'invokePdfServiceProxy', 'getMyMessages', '$timeout',
                               function($scope, $http, $routeParams, $rootScope, $route, $location, $dialogs, sharedDataService, $filter, invokeWSService, invokeWSServiceProxy, invokePdfServiceProxy, getMyMessages, $timeout) { 
	this.$scope = $scope;
    $scope.params = $routeParams;
    
    $scope.logtabs = [ 
        { title:'Log generale', index: 1, content:"partials/aux/logs/global_logs.html" },
        { title:'Log vie', index: 2, content:"partials/aux/logs/street_logs.html" },
        { title:'Log parcheggi', index: 3, content:"partials/aux/logs/parking_logs.html" }
    ];
    
}]);    