<!DOCTYPE html>
<html ng-app="pm">
<head id="myHead" lang="it">
<meta charset="utf-8">
<title>{{ 'app_tab-title' | i18n }}</title>

<link href="../css/bootstrap.min.css" rel="stylesheet" />
<link href="../css/bootstrap-theme.min.css" rel="stylesheet" />
<link href="../css/modaldialog.css" rel="stylesheet" />
<link href="../css/colorpicker.css" rel="stylesheet" />
<link href="../css/angular-awesome-slider.min.css" rel="stylesheet" type="text/css">
<link href="../css/style.css" rel="stylesheet" />
<link href="../css/angular-spinkit.min.css" rel="stylesheet" />
<link href="../imgs/carpark.ico" rel="shortcut icon" type="image/x-icon" />

<!-- required libraries -->
<script src="../js/jquery.min.js"></script>
<script src="../lib/angular.js"></script>
<script src="../lib/angular-route.js"></script>
<script src="../lib/angular-sanitize.js"></script>
<script src="../lib/angular-resource.min.js"></script>
<script src="../lib/angular-cookies.min.js"></script>
<script src="../lib/angular-route.min.js"></script>
<script src="../lib/angular-awesome-slider.min.js" type="text/javascript"></script>
<script src="../lib/ng-google-chart.js"></script>

<script src="../js/bootstrap.min.js"></script>
<script src="../lib/bootstrap-colorpicker-module.js"></script>
<script src="../lib/ui-bootstrap-tpls.min.js"></script>
<script src="../lib/angular-spinkit.min.js"></script>
<script src="../js/localize.js" type="text/javascript"></script>
<script src="../js/dialogs.min.js" type="text/javascript"></script>

<script src="../i18n/angular-locale_it-IT.js"></script>


<script src="../js/app.js?1001"></script>
<script src="../js/controllers/ctrl.js?1001"></script>
<script src="../js/controllers/ctrl_main.js"></script>
<!-- <script src="js/controllers/ctrl_view.js"></script> -->
<script src="../js/controllers/ctrl_view_gmap.js"></script>
<script src="../js/controllers/ctrl_db_viewpark.js"></script>

<script src="../js/filters.js?1001"></script>
<script src="../js/services/serv.js"></script>
<script src="../js/services/serv_shared.js"></script>
<script src="../js/services/serv_initialize.js"></script>
<script src="../js/services/serv_utils.js"></script>
<script src="../js/services/serv_maps.js"></script>
<script src="../js/services/objects_services/serv_area.js"></script>
<script src="../js/services/objects_services/serv_street.js"></script>
<script src="../js/services/objects_services/serv_zone.js"></script>
<script src="../js/services/objects_services/serv_parking_structure.js"></script>
<script src="../js/services/objects_services/serv_parking_meter.js"></script>
<script src="../js/services/objects_services/serv_bike_point.js"></script>
<script src="../js/directives.js"></script>

<script src="../lib/lodash.js"></script>
<script src="https://maps.google.com/maps/api/js?key=AIzaSyBmKVWmFzh2JHT7q1MLmQRQ7jC4AhkRBDs&sensor=false&v=3.exp"></script>
<script src="../lib/ng-map.min.js"></script>

<script src="../lib/angular-file-upload.min.js" type="text/javascript"></script>
<script src="../lib/shim.js" type="text/javascript"></script>
<script src="../lib/xls.js" type="text/javascript"></script>
<script src="../lib/angular-base64.min.js"></script>

<base href="<%=request.getContextPath()%>/" />

<script>
var token="<%=request.getAttribute("token")%>";
var user_name="<%=request.getAttribute("user_name")%>";
var user_surname="<%=request.getAttribute("user_surname")%>";
var no_sec="<%=request.getAttribute("no_sec")%>";
var conf_app_id="<%=request.getAttribute("app_id")%>";
<%-- var conf_url_ws="<%=request.getAttribute("url_ws")%>"; --%>
var conf_map_center="<%=request.getAttribute("map_center")%>";
var conf_map_recenter="<%=request.getAttribute("map_recenter")%>";
var conf_map_zoom="<%=request.getAttribute("map_zoom")%>";
var object_to_show="<%=request.getAttribute("object_showed")%>";
var conf_widget_url="<%=request.getAttribute("widget_url")%>";
var conf_macrozone_type="<%=request.getAttribute("macrozone_type")%>";
var conf_microzone_type="<%=request.getAttribute("microzone_type")%>";
var conf_ps_managers="<%=request.getAttribute("ps_managers")%>";
var conf_elements="<%=request.getAttribute("elements")%>";
var conf_filters="<%=request.getAttribute("filters")%>";
var conf_vehicle_type_list="<%=request.getAttribute("vehicle_type_list")%>";
var conf_agency="<%=request.getAttribute("user_agency")%>";
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
	
	footer {
		background-color: #1E88E5;
	}
	
  </style>

</head>

<body>
	<div id="myBody" ng-controller="MainCtrl" ng-init="setItalianLanguage()">
		<div class="container-fluid">
			<div class="row">
				<div class="col-md-1"></div>
				<div class="col-md-10">
					<div style="margin:5px 15px;">						
						<div ng-view class="row" >Caricamento in corso...</div>			
					</div>
				</div>
				<div class="col-md-1"></div>
			</div>
			<div class="row">
				<div class="col-md-1"></div>
				<div class="col-md-10">
					<footer >
						<table width="100%" ng-if="show_vt_footer">
							<tr>
								<td width="45%" align="right">
									<h4>
									Monitora la disponibilit&agrave; <br/>dei parcheggi in tempo reale <br/> con l'App <b>Viaggia Trento</b>!
									</h4>
								</td>
								<td width="20%">
									<img src="imgs/logoVT_banner_widget.png" alt="ViaggiaTrento" title="ViaggiaTrento">
								</td>
								<td width="35%">
									<a href="https://play.google.com/store/apps/details?id=eu.trentorise.smartcampus.viaggiatrento&hl=it">
										<img src="imgs/googlePlay_banner_widget.png" vspace="7" alt="{{ 'vt_app_title' | i18n }}" title="{{ 'vt_app_title' | i18n }}">
									</a>
									<br/>
									<a href="https://itunes.apple.com/it/app/viaggia-trento/id1068474391?mt=8">
										<img src="imgs/applePlay_banner_widget.png" alt="{{ 'vt_app_title' | i18n }}" title="{{ 'vt_app_title' | i18n }}">
									</a>
								</td>
							</tr>
						</table>
					</footer>
				</div>
				<div class="col-md-1"></div>	
			</div>
		</div>
	</div>	
</body>



</html>