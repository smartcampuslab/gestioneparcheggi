'use strict';

/* Directives */
var pmDirectives = angular.module('pmDirectives', []);

//cp.directive('modalDialog', function() {
//	return {
//		restrict : 'E',
//		scope : {
//			show : '='
//		},
//		replace : true, // Replace with the template below
//		transclude : true, // we want to insert custom content inside the directive
//		link : function(scope, element, attrs) {
//			scope.dialogStyle = {};
//			if (attrs.width)
//				scope.dialogStyle.width = attrs.width;
//			if (attrs.height)
//				scope.dialogStyle.height = attrs.height;
//			scope.hideModal = function() {
//				scope.show = false;
//			};
//		},
//		template : "<div class='ng-modal' ng-show='show'>"
//				+ "<div class='ng-modal-overlay' ng-click='hideModal()'></div>"
//				+ "<div class='ng-modal-dialog' ng-style='dialogStyle'>"
//				+ "<div class='ng-modal-close' ng-click='hideModal()'>X</div>"
//				+ "<div class='ng-modal-dialog-content' ng-transclude></div>"
//				+ "</div>" + "</div>"
//	};
//});

pm.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
                
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});
pm.directive('mypopovercreate', function ($compile,$templateCache) {

	var getTemplate = function (contentType) {
	    var template = '';
	    switch (contentType) {
	        case 'user':
	            template = $templateCache.get("templateCreation.html");
	            break;
	    }
	    return template;
	};
	return {
	    restrict: "A",
	    link: function (scope, element, attrs) {
	        var popOverContent;
	      
	        popOverContent = getTemplate("user");                  
	        
	        var options = {
	            content: popOverContent,
	            placement: "top",
	            html: true,
	            date: scope.date
	        };
	        $(element).popover(options);
	    }
	};
});
pm.directive('mypopoverpay', function ($compile,$templateCache) {

	var getTemplate = function (contentType) {
	    var template = '';
	    switch (contentType) {
	        case 'user':
	            template = $templateCache.get("templatePay.html");
	            break;
	    }
	    return template;
	};
	return {
	    restrict: "A",
	    link: function (scope, element, attrs) {
	        var popOverContent;
	      
	        popOverContent = getTemplate("user");                  
	        
	        var options = {
	            content: popOverContent,
	            placement: "top",
	            html: true,
	            date: scope.date
	        };
	        $(element).popover(options);
	    }
	};
});
pm.directive('mypopovercons', function ($compile,$templateCache) {

	var getTemplate = function (contentType) {
	    var template = '';
	    switch (contentType) {
	        case 'user':
	            template = $templateCache.get("templateCons.html");
	            break;
	    }
	    return template;
	};
	return {
	    restrict: "A",
	    link: function (scope, element, attrs) {
	        var popOverContent;
	      
	        popOverContent = getTemplate("user");                  
	        
	        var options = {
	            content: popOverContent,
	            placement: "top",
	            html: true,
	            date: scope.date
	        };
	        $(element).popover(options);
	    }
	};
});
pm.directive('mypopoverclassprovv', function ($compile,$templateCache) {

	var getTemplate = function (contentType) {
	    var template = '';
	    switch (contentType) {
	        case 'user':
	            template = $templateCache.get("templateClassProvv.html");
	            break;
	    }
	    return template;
	};
	return {
	    restrict: "A",
	    link: function (scope, element, attrs) {
	        var popOverContent;
	      
	        popOverContent = getTemplate("user");                  
	        
	        var options = {
	            content: popOverContent,
	            placement: "top",
	            html: true,
	            date: scope.date
	        };
	        $(element).popover(options);
	    }
	};
});
pm.directive('mypopoverclassfinal', function ($compile,$templateCache) {

	var getTemplate = function (contentType) {
	    var template = '';
	    switch (contentType) {
	        case 'user':
	            template = $templateCache.get("templateClassFinal.html");
	            break;
	    }
	    return template;
	};
	return {
	    restrict: "A",
	    link: function (scope, element, attrs) {
	        var popOverContent;
	      
	        popOverContent = getTemplate("user");                  
	        
	        var options = {
	            content: popOverContent,
	            placement: "top",
	            html: true,
	            date: scope.date
	        };
	        $(element).popover(options);
	    }
	};
});