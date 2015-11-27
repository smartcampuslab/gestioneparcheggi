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
<script src="js/jquery.js"></script>
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
<script src="js/controllers/ctrl_aux.js"></script>
<script src="js/controllers/ctrl_login.js?1000"></script>
<script src="js/controllers/ctrl_main.js"></script>
<script src="js/controllers/ctrl_park.js"></script>
<script src="js/controllers/ctrl_bike.js"></script>
<!-- <script src="js/controllers/ctrl_view.js"></script> -->
<script src="js/controllers/ctrl_view_gmap.js"></script>
<script src="js/controllers/ctrl_db_viewpark.js"></script>

<script src="js/filters.js?1001"></script>
<script src="js/services.js?1001"></script>
<script src="js/directives.js"></script>

<script src="lib/angular-file-upload.js" type="text/javascript"></script>
<script src="lib/shim.js" type="text/javascript"></script>
<script src="lib/xls.js" type="text/javascript"></script>
<script src="lib/angular-base64.min.js"></script>

<script src="lib/lodash.js"></script>
<script src="https://maps.google.com/maps/api/js?key=AIzaSyBmKVWmFzh2JHT7q1MLmQRQ7jC4AhkRBDs&sensor=false&v=3.exp"></script>
<script src="lib/ng-map.min.js"></script>

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
var conf_widget_url="<%=request.getAttribute("widget_url")%>";
var conf_macrozone_type="<%=request.getAttribute("macrozone_type")%>";
var conf_microzone_type="<%=request.getAttribute("microzone_type")%>";
var conf_ps_managers="<%=request.getAttribute("ps_managers")%>";
var conf_municipalities="<%=request.getAttribute("municipalities")%>";
var ctx="<%=request.getContextPath()%>";
</script>
  
</head>
<body>
	<div id="myBody" ng-controller="MainCtrl" ng-init="setItalianLanguage()"><!-- ng-init="setItalianLanguage()" -->
    <div class="navbar navbar-fixed-top navbar-inverse" role="navigation">
      <div class="container-fluid" style="margin-left:160px; margin-right:160px">
        <div class="collapse navbar-collapse">
          <div class="navbar-brand"><img src="imgs/logo.png"/></div>
          <ul class="nav navbar-nav">
            <li></li>
<!--             <li class="{{ isHomeActive() }}"><a href="#/" ng-click="home()">{{ 'menu_bar-home' | i18n }}</a></li> -->
			<li class="{{ isHomeDashboardActive() }}" ng-show="showDashboardMenuLink"><a href="#/dashboard/home" ng-click="setHomeDashboardActive()">{{ 'menu_bar-homedashboard' | i18n }}</a></li>
            <li class="{{ isHomeParkActive() }}"><a href="#/park/home" ng-click="setHomeParkActive()">{{ 'menu_bar-homepark' | i18n }}</a></li>
            <li class="{{ isViewAllActive() }}"><a href="#/view" ng-click="setViewAllActive()">{{ 'menu_bar-parkview' | i18n }}</a></li>
            <li class="{{ isHomeAuxActive() }}" ng-show="showAuxMenuLink"><a href=#/auxiliary/logs/1" ng-click="setHomeAuxActive()">{{ 'menu_bar-homeaux' | i18n }}</a></li><!-- href="#/aux/home" -->
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
<!--           	<li><a href="mailto:myweb.edilizia@comunitadellavallagarina.tn.it?Subject=Info%20MyWeb" target="_top" alt="myweb.edilizia@comunitadellavallagarina.tn.it" title="myweb.edilizia@comunitadellavallagarina.tn.it">{{ 'usefull_link'| i18n }}</a></li> -->
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
			<div class="col-md-1" ng-controller="AuxCtrl" ng-init="initComponents()"></div>	<!-- used only to init aux components -->
			<div class="col-md-10">
				<div class="panel panel-default" style="margin-top:100px;">
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
							<div class="row" ng-if="isHomeParkActive() == 'active'" ><!--   style="height: 150px;" -->
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
									<div ng-view class="row">{{ 'loading_text'| i18n }}...</div>
								</div>
							</div>
							<div ng-if="isHomeParkActive() != 'active'">
								<div ng-view class="row" >{{ 'loading_text'| i18n }}...</div>
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

<script type="text/ng-template" id="/dialogs/report.html">
<div class="modal" ng-init="readReportName()">
		<form role="form" name="form">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;&nbsp;Crea Report</h4>
				</div>
				<div class="modal-body">
						<div class="form-group" ng-class="{true: 'has-error'}[form.reportname.$dirty && form.reportname.$invalid]">
							<label class="control-label" for="username">Nome report:</label>
							<input type="text" class="form-control" name="reportname" id="reportname" placeholder="Inserisci il nome del report" ng-model="report.name" ng-keyup="hitEnter($event)" required>
						</div>
						<div class="form-group">
							<label for="report_description">Dettagli report</label>
							<table id="report_description" class="table table-striped" width="100%">
								<tr>
									<th>Tipo dati</th>
									<th>Elemento</th>
									<th>Filtra per</th>
									<th>Anno</th>
									<th>Mese</th>
									<th>Giorno</th>
									<th>Ora</th>
								</tr>
								<tr>
									<td>{{ rep_topic }}</td>
									<td>{{ rep_space }}</td>
									<td>{{ rep_vis }}</td>
									<td>{{ rep_year }}</td>
									<td>{{ rep_month }}</td>
									<td>{{ rep_dow }}</td>
									<td>{{ rep_hour }}</td>
								</tr>
							</table>
						</div>
						<div class="form-group">
							<input id="periodCheck" type="checkbox" ng-model="isperiod" >&nbsp; invio periodico</label>
						</div>
						<div ng-show="isperiod">
							<div class="form-group">
						    	<label for="reportperiod">Periodo invio report</label>
						    	<select ng-if="myPeriod == null" id="reportperiod" name="reportSentPeriod" class="form-control" ng-model="report.periodic" ng-required="isperiod"><!-- ng-options="p.id as p.title for p in periods" -->
						    		<option value="" >Seleziona periodo</option>
                                    <option ng-repeat="p in periods" value="{{p.id}}">{{p.title}}</option>
						    	</select>
						    	<select ng-if="myPeriod != null" id="reportperiod" name="reportSentPeriod" class="form-control" ng-model="report.periodic" ng-required="isperiod"><!-- ng-options="p.id as p.title for p in periods" -->
									<option value="myPeriod.id">{{ myPeriod.title }}</option>
                                    <option ng-repeat="p in periods" value="{{p.id}}">{{p.title}}</option>
						    	</select>
					   			<div class="alert alert-danger" ng-show="!isInit && form.reportSentPeriod.$error.required">Campo 'periodo invio report' obbligatorio</div>
							</div>
							<div ng-show="report.periodic=='1' || report.periodic=='2' || report.periodic=='3'">
								<label for="periodstartday">Giorno inizio periodo</label>
					    		<input id="periodstartday" name="PeriodStart" type="text" class="form-control" datepicker-popup="{{format}}" placeholder="gg/mm/aaaa" ng-model="report.startperiod" is-open="periodstart.open" ng-click="periodstart.open = true" datepicker-options="dateOptions" current-text="{{ 'datepicker_button_today' | i18n }}" clear-text="{{ 'datepicker_button_canc' | i18n }}" close-text="{{ 'datepicker_button_close' | i18n }}" show-weeks="false" />
							</div>
							<div ng-show="report.periodic=='4'">
								<label for="periodstarttime">Ora invio</label>
								<timepicker id="periodstarttime" ng-model="report.startperiod" hour-step="hstep" minute-step="mstep" show-meridian="ismeridian"></timepicker>
							</div>
							<div>&nbsp;</div>
							<div class="form-group">
							    <label for="email_rep">Email inoltro report</label>
	    						<input type="text" class="form-control" id="email_rep" name="repEmail" placeholder="Inserisci indirizzo email di inoltro report" ng-model="report.mail" ng-required="isperiod" ><!-- ng-pattern="mailPattern" -->
	   							<div class="alert alert-danger" ng-show="!isInit && form.repEmail.$error.required">Campo 'email' obbligatorio</div>
<!-- 	   							<div class="alert alert-danger" ng-show="!isInit && form.repEmail.$error.pattern">Campo 'email' non corretto</div> -->
							</div>
						</div>
						<div></div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" ng-click="cancel()">Annulla</button>
					<button type="button" class="btn btn-primary" ng-click="save(form)">OK</button><!-- ng-disabled="(form.$dirty && form.$invalid) || form.$pristine" -->
				</div>
			</div>
		</div>
		</form>
	</div>
</script>

</html>