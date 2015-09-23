<!DOCTYPE html>
<html ng-app="pm">
<head id="myHead" lang="it">
<meta charset="utf-8">
<title>{{ 'app_tab-title' | i18n }}</title>

<link href="css/bootstrap.min.css" rel="stylesheet" />
<link href="css/bootstrap-theme.min.css" rel="stylesheet" />
<link href="css/modaldialog.css" rel="stylesheet" />
<link href="css/colorpicker.css" rel="stylesheet" />
<link href="css/angular-awesome-slider.min.css" rel="stylesheet" type="text/css">
<link href="css/style.css" rel="stylesheet" />
<link href="css/angular-spinkit.min.css" rel="stylesheet" />
<link href="imgs/carpark.ico" rel="shortcut icon" type="image/x-icon" />

<!-- required libraries -->
<script src="js/jquery.min.js"></script>
<script src="lib/angular.js"></script>
<script src="lib/angular-route.js"></script>
<script src="lib/angular-sanitize.js"></script>
<script src="lib/angular-resource.min.js"></script>
<script src="lib/angular-cookies.min.js"></script>
<script src="lib/angular-route.min.js"></script>
<script src="lib/angular-awesome-slider.min.js" type="text/javascript"></script>
<script src="lib/ng-google-chart.js"></script>

<script src="js/bootstrap.min.js"></script>
<script src="lib/bootstrap-colorpicker-module.js"></script>
<script src="lib/ui-bootstrap-tpls.min.js"></script>
<script src="lib/angular-spinkit.min.js"></script>
<script src="js/localize.js" type="text/javascript"></script>
<script src="js/dialogs.min.js" type="text/javascript"></script>

<script src="i18n/angular-locale_it-IT.js"></script>
<!-- <script src="i18n/angular-locale_en-EN.js"></script> -->

<script src="js/app.js?1001"></script>
<script src="js/controllers/ctrl.js?1001"></script>
<script src="js/controllers/ctrl_login.js?1000"></script>
<script src="js/controllers/ctrl_main.js"></script>
<script src="js/controllers/ctrl_park.js"></script>
<script src="js/controllers/ctrl_bike.js"></script>
<!-- <script src="js/controllers/ctrl_view.js"></script> -->
<script src="js/controllers/ctrl_view_gmap.js"></script>
<script src="js/controllers/ctrl_db_viewpark.js"></script>
<script src="js/controllers/ctrl_aux.js"></script>

<script src="js/filters.js?1001"></script>
<script src="js/services.js?1001"></script>
<script src="js/directives.js"></script>

<script src="lib/lodash.js"></script>
<script src="https://maps.google.com/maps/api/js?key=AIzaSyBmKVWmFzh2JHT7q1MLmQRQ7jC4AhkRBDs&sensor=false&v=3.exp"></script>
<script src="lib/ng-map.min.js"></script>

<script src="lib/angular-file-upload.min.js" type="text/javascript"></script>
<script src="lib/shim.js" type="text/javascript"></script>
<script src="lib/xls.js" type="text/javascript"></script>
<script src="lib/angular-base64.min.js"></script>

<base href="<%=request.getContextPath()%>/" />

<script>
var token="<%=request.getAttribute("token")%>";
<%-- var userId="<%=request.getAttribute("user_id")%>"; --%>
var user_name="<%=request.getAttribute("user_name")%>";
var user_surname="<%=request.getAttribute("user_surname")%>";
var no_sec="<%=request.getAttribute("no_sec")%>";
var conf_app_id="<%=request.getAttribute("app_id")%>";
var conf_map_center="<%=request.getAttribute("map_center")%>";
var conf_map_zoom="<%=request.getAttribute("map_zoom")%>";
var object_to_show="<%=request.getAttribute("object_showed")%>";
</script>
  
  <style>
  
  	.borderless td{
	    border: 0;
	}
	
	div.listwrapper {
		height: 580px; 
		overflow-y: auto;
		margin-bottom: 10px;
	}
	
	div.tablewrapper {
		height: 490px; 
		overflow-y: auto;
		margin-bottom: 10px;
	}
	
	div.logwrapper {
		height: 680px; 
		overflow-y: auto;
		margin-bottom: 10px;
	}
	
	.angular-google-map-container {
		height: 700px; 
	}
	
	pre {
		outline: 1px solid #ccc; 
		padding: 5px; 
		margin: 5px; 
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
	
	td.detailsTableSX {
		width: 55%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsTableCX {
		width: 5%;
		height: 20px;
		text-align: right;
		vertical-align: middle;
	}
	td.detailsTableDX {
		width: 40%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsTitleTableSX {
		width: 35%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsTitleTableCX {
		width: 5%;
		height: 20px;
		text-align: right;
		vertical-align: middle;
	}
	td.detailsTitleTableDX {
		width: 60%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsTableColSpan {
		width: 100%;
		height: 20px;
		text-align: center;
		font-weight: bold;
		text-transform: uppercase;
		vertical-align: middle;
	}
	td.detailsTableColSpanLeft {
		width: 100%;
		height: 20px;
		text-align: left;
		font-weight: bold;
		text-transform: uppercase;
		vertical-align: middle;
	}
	td.detailsListTableSX {
		width: 30%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsListTableCX {
		width: 5%;
		height: 20px;
		text-align: right;
		vertical-align: middle;
	}
	td.detailsListTableDX {
		width: 65%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsNumberListTableSX {
		width: 55%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsNumberListTableCX {
		width: 5%;
		height: 20px;
		text-align: right;
		vertical-align: middle;
	}
	td.detailsNumberListTableDX {
		width: 40%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsTableColSpanS {
		width: 90%;
		height: 20px;
		text-align: center;
		font-weight: bold;
		text-transform: uppercase;
		vertical-align: middle;
	}
	td.detailsTableColSpanLeftS {
		width: 90%;
		height: 20px;
		text-align: left;
		font-weight: bold;
		text-transform: uppercase;
		vertical-align: middle;
	}
	td.detailsListTableSXS {
		width: 30%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsListTableCXS {
		width: 5%;
		height: 20px;
		text-align: right;
		vertical-align: middle;
	}
	td.detailsListTableDXS {
		width: 55%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsNumberListTableSXS {
		width: 45%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsNumberListTableCXS {
		width: 5%;
		height: 20px;
		text-align: right;
		vertical-align: middle;
	}
	td.detailsNumberListTableDXS {
		width: 40%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsCompressTableSX {
		width: 25%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsCompressTableCX {
		width: 3%;
		height: 20px;
		text-align: right;
		vertical-align: middle;
	}
	td.detailsCompressTableDX {
		width: 32%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsCompressTableDiagram {
		width: 40%;
		font-weight: bold;
		text-align: center;
		vertical-align: middle;
	}
	th.myCenter {
		text-align: center;
	}
	
	td.detailsViewAreaSX{
		width: 45%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsViewAreaDX{
		width: 55%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	
	td.detailsViewBikeSX{
		width: 45%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsViewBikeDX{
		width: 55%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	
	td.detailsViewZoneSX{
		width: 45%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsViewZoneDX{
		width: 55%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	
	td.detailsViewStructSX{
		width: 45%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsViewStructDX{
		width: 55%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	
	td.detailsViewParkmeterSX{
		width: 45%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsViewParkmeterDX{
		width: 55%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	
	td.detailsViewStreetSX{
		width: 45%;
		height: 20px;
		font-weight: normal;
		text-align: left;
		vertical-align: middle;
	}
	td.detailsViewStreetDX{
		width: 55%;
		height: 20px;
		font-weight: bold;
		text-align: left;
		vertical-align: middle;
	}
	
	div.left-filter {
		font-size: medium;
	}
	
	label.left-filter {
		font-size: small;
	}
	
	div #panelMap {
      position: absolute;
      top: 5px;
      left: 50%;
      margin-left: -90px;
      z-index: 5;
      background-color: #fff;
      padding: 5px;
      border: 1px solid #999;
    }
    
	.custom-file-input {
	  color: transparent;
	  width: 170px;
	  height: 40px;
	}
	.custom-file-input::-webkit-file-upload-button {
	  visibility: hidden;
	}
	.custom-file-input::before {
	  content: 'Seleziona un file';
	  color: black;
	  display: inline-block;
	  background: -webkit-linear-gradient(top, #f9f9f9, #e3e3e3);
	  border: 1px solid #999;
	  border-radius: 3px;
	  padding: 8px 20px;
	  outline: none;
	  white-space: nowrap;
	  -webkit-user-select: none;
	  cursor: pointer;
	  text-shadow: 1px 1px #fff;
	  font-weight: 700;
	  font-size: 12pt;
	  width: 170px;
	  height: 40px;
	}
	.custom-file-input:hover::before {
	  border-color: black;
	}
	.custom-file-input:active {
	  outline: 0;
	}
	.custom-file-input:active::before {
	  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9); 
	}    
	
  </style>

</head>

<body>
	<div id="myBody" ng-controller="MainCtrl" ng-init="setItalianLanguage()">
    <div class="navbar navbar-fixed-top navbar-inverse" role="navigation">
      <div class="container-fluid" style="margin-left:160px; margin-right:160px">
        <div class="collapse navbar-collapse">
          <div class="navbar-brand"><strong>{{ 'app_home-title' | i18n }}&nbsp;&nbsp;&nbsp;</strong></div>
          <ul class="nav navbar-nav">
<!--             <li class="{{ isHomeActive() }}"><a href="#/" ng-click="home()">{{ 'menu_bar-home' | i18n }}</a></li> -->
			<li class="{{ isHomeDashboardActive() }}" ng-show="showDashboardMenuLink"><a href="#/dashboard/home" ng-click="setHomeDashboardActive()">{{ 'menu_bar-homedashboard' | i18n }}</a></li>
            <li class="{{ isHomeParkActive() }}"><a href="#/park/home" ng-click="setHomeParkActive()">{{ 'menu_bar-homepark' | i18n }}</a></li>
            <li class="{{ isViewAllActive() }}"><a href="#/view" ng-click="setViewAllActive()">{{ 'menu_bar-parkview' | i18n }}</a></li>
            <li class="{{ isHomeAuxActive() }}"><a href="#/aux/home" ng-click="setHomeAuxActive()">{{ 'menu_bar-homeaux' | i18n }}</a></li>
<!--             <li class="{{ isEditingParkActive() }}"><a href="#/edit/park" ng-click="setEditingParkActive()">{{ 'menu_bar-parkediting' | i18n }}</a></li> -->
<!--             <li class="{{ isEditingBikeActive() }}"><a href="#/edit/bike" ng-click="setEditingBikeActive()">{{ 'menu_bar-bikeediting' | i18n }}</a></li> -->
<!--           	<li class="{{ isViewAllActive() }}"><a href="#/view" ng-click="setViewAllActive()">{{ 'menu_bar-parkview' | i18n }}</a></li> -->
          </ul>
          <ul class="nav navbar-nav navbar-right" >
<!--           	<li class="dropdown"> -->
<!--           		<a href="#" class="dropdown-toggle" data-toggle="dropdown">{{ 'guide' | i18n }} <span class="caret"></span></a> -->
<!--           		<ul class="dropdown-menu" role="menu"> -->
<!--             		<li><a href="http://www.trentinosociale.it/index.php/Servizi-ai-cittadini/Guida-ai-servizi/per-destinatari/Anziani/Abitare-o-disporre-di-un-alloggio-adeguato-e-sicuro/Locazione-alloggio-pubblico-a-canone-sociale" target="_blank">{{ 'document_link_edil' | i18n }}</a></li> -->
<!--             		<li><a href="http://www.trentinosociale.it/index.php/Servizi-ai-cittadini/Guida-ai-servizi/per-destinatari/Anziani/Abitare-o-disporre-di-un-alloggio-adeguato-e-sicuro/Contributo-sul-canone-di-affitto" target="_blank">{{ 'document_link_allowances' | i18n }}</a></li> -->
<!--             	</ul> -->
<!--           	</li> -->
          	<li><a href="mailto:myweb.edilizia@comunitadellavallagarina.tn.it?Subject=Info%20MyWeb" target="_top" alt="myweb.edilizia@comunitadellavallagarina.tn.it" title="myweb.edilizia@comunitadellavallagarina.tn.it">{{ 'usefull_link'| i18n }}</a></li>
          	<li class="{{ isActiveItaLang() }}"><a href ng-click="setItalianLanguage()">IT</a></li>
          	<li class="{{ isActiveEngLang() }}"><a href ng-click="setEnglishLanguage()">EN</a></li>
            <li><a href="" ng-click="logout()">{{ 'menu_bar-logout' | i18n }}</a></li> <!-- href="logout" -->
          </ul>
        </div><!-- /.nav-collapse -->
      </div><!-- /.container -->
    </div><!-- /.navbar -->
	<div class="container-fluid">
<!-- 		<div class="row" style="margin-top:70px;"> -->
		<div class="row">
			<div class="col-md-1"></div>
			<div class="col-md-10">
				<div class="panel panel-default" style="margin-top:65px;">
			  		<div class="panel-body">
			  			<div style="margin:5px 15px;">
<!-- 							<div class="row" align="center" style="height: 100px"> -->
<!-- 								<div> -->
<!-- 									<table> -->
<!-- 										<tr> -->
<!-- 											<td width="100%" align="center" valign="middle"><h1>{{ 'app_home-title' | i18n }}</h1></td> -->
<!-- 										</tr> -->
<!-- 									</table> -->
									
<!-- 								</div> -->
<!-- 							</div> -->
							<div class="row" ng-show="isHomeParkActive() == 'active'" ><!--   style="height: 150px;" -->
								<div class="col-md-2" ng-show="false">
									<div class="panel panel-primary" align="left">
										<div class="panel-heading">
											<h5 class="panel-title">{{ 'park_menu_list' | i18n }}</h5>
										</div>
										<div class="panel-body">
											<ul class="nav nav-pills nav-stacked" style="font-size: 14px">
											<!-- <li class="{{ isHomeSubParkActive() }}"><a href="#/park/home" ng-click="setHomeSubParkActive()">{{ 'menu_bar-home' | i18n }}</a></li> -->
												<li class="{{ isEditingParkActive() }}"><a href="#/edit/park" ng-click="setEditingParkActive()">{{ 'menu_bar-parkediting' | i18n }}</a></li>
		<!-- MB20150504: moved link to bike tab <li class="{{ isEditingBikeActive() }}" ng-show="showBikeMenuLink"><a href="#/edit/bike" ng-click="setEditingBikeActive()">{{ 'menu_bar-bikeediting' | i18n }}</a></li> -->
						          				<li class="{{ isViewAllActive() }}"><a href="#/view" ng-click="setViewAllActive()">{{ 'menu_bar-parkview' | i18n }}</a></li>
											</ul>
										</div>
									</div>
								</div>
								<div class="col-md-12">
									<div ng-view class="row" ng-hide="isNewPractice()" >{{ 'loading_text'| i18n }}...</div>
								</div>
							</div>
							<div ng-show="isHomeParkActive() != 'active'">
								<div ng-view class="row" ng-hide="isNewPractice()" >{{ 'loading_text'| i18n }}...</div>
							</div>
						</div>
						</div>
					</div>
				</div>
				<div class="col-md-1"></div>
			</div>
			<div class="row">
				<div class="col-md-1"></div>
				<div class="col-md-10">
					<hr>
					<footer>
		<!-- 				<p>&copy; SmartCampus 2013</p> -->
					</footer>
				</div>
				<div class="col-md-1"></div>	
			</div>
		</div>
	</div>	
</body>



</html>