<!DOCTYPE html>
<html ng-app="pm">
<head id="myHead" lang="it">
<meta charset="utf-8">
<title>{{ 'app_tab-title' | i18n }}</title>

<link href="../css/bootstrap.min.css" rel="stylesheet" />
<link href="../css/bootstrap-theme.min.css" rel="stylesheet" />
<link href="../css/modaldialog.css" rel="stylesheet" />
<link href="../css/colorpicker.css" rel="stylesheet" />
<link href="../imgs/carpark.ico" rel="shortcut icon" type="image/x-icon" />

<!-- required libraries -->
<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../lib/angular.js"></script>
<script src="../js/localize.js" type="text/javascript"></script>
<script src="../js/dialogs.min.js" type="text/javascript"></script>
<script src="../lib/angular-route.js"></script>
<script src="../lib/angular-sanitize.js"></script>

<script src="../i18n/angular-locale_it-IT.js"></script>

<script src="../js/app.js?1001"></script>
<!-- <script src="js/controllers.js"></script> -->
<script src="../js/controllers/ctrl.js?1001"></script>
<script src="../js/controllers/ctrl_main.js"></script>
<script src="../js/controllers/ctrl_view_gmap.js"></script>

<script src="../js/filters.js?1001"></script>
<script src="../js/services.js?1001"></script>
<script src="../js/directives.js"></script>
<script src="../lib/ui-bootstrap-tpls.min.js"></script>

<!-- optional libraries -->
<script src="../lib/angular-resource.min.js"></script>
<script src="../lib/angular-cookies.min.js"></script>
<script src="../lib/angular-route.min.js"></script>
<script src="../lib/bootstrap-colorpicker-module.js"></script>

<script src="https://maps.google.com/maps/api/js?key=AIzaSyBmKVWmFzh2JHT7q1MLmQRQ7jC4AhkRBDs&sensor=false&v=3.exp"></script>
<script src="../lib/ng-map.min.js"></script>

<base href="/parking-management/" />

<script>

var user_name="<%=request.getAttribute("user_name")%>";
var user_surname="<%=request.getAttribute("user_surname")%>";
var no_sec="<%=request.getAttribute("no_sec")%>";
var conf_app_id="<%=request.getAttribute("app_id")%>";
<%-- var conf_url_ws="<%=request.getAttribute("url_ws")%>"; --%>
var conf_map_center="<%=request.getAttribute("map_center")%>";
var conf_map_zoom="<%=request.getAttribute("map_zoom")%>";
var object_to_show="<%=request.getAttribute("object_showed")%>";


<%-- Prevent the backspace key from navigating back. --%>
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && 
             (
                 d.type.toUpperCase() === 'TEXT' ||
                 d.type.toUpperCase() === 'NUMBER' ||
                 d.type.toUpperCase() === 'PASSWORD' || 
                 d.type.toUpperCase() === 'FILE' || 
                 d.type.toUpperCase() === 'EMAIL' || 
                 d.type.toUpperCase() === 'SEARCH' || 
                 d.type.toUpperCase() === 'DATE' )
             ) || 
             d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }
	
    if (doPrevent) {
        event.preventDefault();
    }
});

</script>
  
  <style>
  
  	.borderless td{
	    border: 0;
	}
	
	.angular-google-map-container {
		height: 610px; 
	}
	
	.colorBox {   
    	float: left;
    	width: 15px;
    	height: 15px;
    	margin: 2px;
    	border-width: 1px;
    	border-style: solid;
    	border-color: rgba(0,0,0,.2);
	}
	
  </style>

</head>

<body>
	<div id="myBody" ng-controller="MainCtrl" ng-init="setItalianLanguage()">
		<div class="container-fluid">
	<!-- 		<div class="row" style="margin-top:70px;"> -->
			<div class="row">
				<div class="col-md-1"></div>
				<div class="col-md-10">
					<div style="margin:5px 15px;">
	<!-- 				<div class="row" align="center" style="height: 100px">; margin-top: 20px; -->
	<!-- 					<div> -->
	<!-- 						<table> -->
	<!-- 							<tr> -->
	<!-- 								<td width="100%" align="center" valign="middle"><h1>Dati Parcheggi</h1></td> -->
	<!-- 							</tr> -->
	<!-- 						</table> -->
							
	<!-- 					</div> -->
	<!-- 				</div> -->
									
						<div ng-view class="row" >Caricamento in corso...</div>			
					</div>
				</div>
				<div class="col-md-1"></div>
			</div>
			<div class="row">
				<div class="col-md-1"></div>
				<div class="col-md-10">
					<hr>
					<footer>
					</footer>
				</div>
				<div class="col-md-1"></div>	
			</div>
		</div>
	</div>	
</body>



</html>