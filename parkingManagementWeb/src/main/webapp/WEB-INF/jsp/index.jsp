<!DOCTYPE html>
<html ng-app="pm">
<head id="myHead" lang="it">
<meta charset="utf-8">
<title>{{ 'app_tab-title' | i18n }}</title>

<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/bootstrap-theme.min.css" rel="stylesheet">
<link href="css/xeditable.css" rel="stylesheet">
<link href="css/modaldialog.css" rel="stylesheet">
<link href="img/myweb.ico" rel="shortcut icon" type="image/x-icon" />

<!-- required libraries -->
<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="lib/angular.js"></script>
<script src="js/localize.js" type="text/javascript"></script>
<script src="js/dialogs.min.js" type="text/javascript"></script>
<script src="lib/angular-route.js"></script>
<script src="lib/angular-sanitize.js"></script>

<script src="i18n/angular-locale_it-IT.js"></script>
<!-- <script src="i18n/angular-locale_en-EN.js"></script> -->

<script src="js/app.js?1001"></script>
<!-- <script src="js/controllers.js"></script> -->
<script src="js/controllers/ctrl.js?1001"></script>
<script src="js/controllers/ctrl_login.js?1000"></script>
<script src="js/controllers/ctrl_main.js?1000"></script>
<script src="js/controllers/ctrl_park.js?1001"></script>
<script src="js/controllers/ctrl_view.js"></script>

<script src="js/filters.js?1001"></script>
<script src="js/services.js?1001"></script>
<script src="js/directives.js"></script>
<script src="lib/ui-bootstrap-tpls.min.js"></script>

<!-- <script type="text/javascript" src="js/jquery.min.js" /></script> -->
<!-- <script type="text/javascript" src="js/jquery-ui.custom.min.js" ></script> -->
<!-- <script type="text/javascript" src="js/ui.datepicker-it.js" ></script> -->

<!-- optional libraries -->
<!-- <script src="lib/underscore-min.js"></script> -->
<!-- <script src="lib/moment.min.js"></script> -->
<!-- <script src="lib/fastclick.min.js"></script> -->
<!-- <script src="lib/prettify.js"></script> -->
<script src="lib/angular-resource.min.js"></script>
<script src="lib/angular-cookies.min.js"></script>
<script src="lib/angular-route.min.js"></script>
<script src="lib/xeditable.min.js"></script>
<script src="lib/angular-base64.min.js"></script>

<script src="lib/lodash.js"></script>
<script src="lib/angular-google-maps.js"></script>
<!-- <script src="http://maps.google.com/maps/api/js?sensor=false"></script> -->
<!-- <script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script> -->
<!-- <script src="lib/ng-map.min.js"></script> -->

<base href="/parking-management/" />

<script>
<%-- var token="<%=request.getAttribute("token")%>"; --%>
<%-- var userId="<%=request.getAttribute("user_id")%>"; --%>
<%-- var user_name="<%=request.getAttribute("user_name")%>"; --%>
<%-- var user_surname="<%=request.getAttribute("user_surname")%>"; --%>
<%-- var user_mail="<%=request.getAttribute("e_mail")%>"; --%>
<%-- var nome="<%=request.getAttribute("nome")%>"; --%>
<%-- var cognome="<%=request.getAttribute("cognome")%>"; --%>
<%-- var sesso="<%=request.getAttribute("sesso")%>"; --%>
<%-- var dataNascita="<%=request.getAttribute("dataNascita")%>"; --%>
<%-- var provinciaNascita="<%=request.getAttribute("provinciaNascita")%>"; --%>
<%-- var luogoNascita="<%=request.getAttribute("luogoNascita")%>"; --%>
<%-- var indirizzoRes="<%=request.getAttribute("indirizzoRes")%>"; --%>
<%-- var capRes="<%=request.getAttribute("capRes")%>"; --%>
<%-- var cittaRes="<%=request.getAttribute("cittaRes")%>"; --%>
<%-- var provinciaRes="<%=request.getAttribute("provinciaRes")%>"; --%>
<%-- var codiceFiscale="<%=request.getAttribute("codiceFiscale")%>"; --%>
<%-- var cellulare="<%=request.getAttribute("cellulare")%>"; --%>
<%-- var email="<%=request.getAttribute("email")%>"; --%>
<%-- var issuerdn="<%=request.getAttribute("issuerdn")%>"; --%>
<%-- var subjectdn="<%=request.getAttribute("subjectdn")%>"; --%>
<%-- var base64="<%=request.getAttribute("base64")%>"; --%>

<%-- Part for google analytics --%>

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-54947160-1', 'auto');
  ga('send', 'pageview');
  
// 	var language_script = document.createElement('script');
// 	language_script.type = 'text/javascript';
// 	language_script.id = 'lang_script';
	
// 	var appElement = document.querySelector('[ng-app=cp]');
// 	var $scope = angular.element(appElement).scope();
// 	console.log($scope.used_lang);
	
// 	var controllerElement = document.querySelector('html');
// 	var controllerScope = angular.element(controllerElement).scope();
// 	console.log(controllerScope);

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
		height: 500px; 
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
    <div class="navbar navbar-fixed-top navbar-inverse" role="navigation">
      <div class="container">
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="{{ isHomeActive() }}"><a href="#/" ng-click="home()">{{ 'menu_bar-home' | i18n }}</a></li>
            <li class="{{ isEditingParkActive() }}"><a href="#/edit/park" ng-click="setEditingParkActive()">{{ 'menu_bar-parkediting' | i18n }}</a></li>
            <li class="{{ isEditingBikeActive() }}"><a href="#/edit/bike" ng-click="setEditingBikeActive()">{{ 'menu_bar-bikeediting' | i18n }}</a></li>
          	<li class="{{ isViewAllActive() }}"><a href="#/view" ng-click="setViewAllActive()">{{ 'menu_bar-parkview' | i18n }}</a></li>
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
            <!-- <li><a href="logout" ng-click="logout()">{{ 'menu_bar-logout' | i18n }}</a></li> -->
          </ul>
        </div><!-- /.nav-collapse -->
      </div><!-- /.container -->
    </div><!-- /.navbar -->
	<div class="container">
<!-- 		<div class="row" style="margin-top:70px;"> -->
		<div class="row">
			<div class="col-md-1"></div>
			<div class="col-md-10">
				<div class="panel panel-default" style="margin-top:65px;">
			  		<div class="panel-body">
			  			<div style="margin:5px 15px;">
							<div class="row" align="center" style="height: 80px"><!-- ; margin-top: 20px; -->
								<div><!-- "text-align: center" -->
									<table>
										<tr>
<!-- 											<td width="35%" align="center" valign="middle"><img src="img/myweb4_small.png" alt="Logo myWeb" title="Logo myWeb" /></td> -->
											<td width="100%" align="center" valign="middle"><h1>{{ 'app_home-title' | i18n }}</h1></td>
										</tr>
									</table>
									
								</div>
							</div>
<!-- 							<div class="row" style="height: 170px; margin-bottom: 10px;" ng-show="!frameOpened"> -->
<!-- 								<div class="panel panel-primary"> -->
<!-- 									<div class="panel-body"> -->
<!-- 										<table width="100%"> -->
<!-- 											<tr> -->
<!-- 											<td width="50%" valign="middle" style="padding:0px 10px"> -->
<!-- 												<div class="panel panel-primary"> -->
<!-- 													<div class="panel-heading"> -->
<!-- 														<h4 class="panel-title">{{ 'left_menu-availableServices_eu' | i18n }}</h4> -->
<!-- 													</div> -->
<!-- 													<div class="panel-body"> -->
<!-- 														<ul class="nav nav-pills nav-stacked" style="font-size: 14px"> -->
<!-- 										            		<li class="{{ isActiveLinkEdil() }}"><a href="#/PracticeList/edil/1" ng-click="showPractices(1, true)">{{ 'left_menu-bildings' | i18n }}</a></li> -->
<!-- 										            		<li class="{{ isActiveLinkAss() }}"><a href="#/PracticeList/ass/1" ng-click="showPractices(2, true)">{{ 'left_menu-allowances' | i18n }}</a></li> -->
<!-- 										        		</ul> -->
<!-- 										        	</div> -->
<!-- 										        </div> -->
<!-- 										    </td> -->
<!-- 										    <td width="50%" valign="middle" style="padding:0px 10px">     -->
<!-- 										        <div class="panel panel-primary"> -->
<!-- 													<div class="panel-heading"> -->
<!-- 														<h4 class="panel-title">{{ 'left_menu-availableServices_extraeu' | i18n }}</h4> -->
<!-- 													</div> -->
<!-- 													<div class="panel-body"> -->
<!-- 														<ul class="nav nav-pills nav-stacked" style="font-size: 14px"> -->
<!-- 										            		<li class="{{ isActiveLinkEdilExtra() }}"><a href="#/PracticeList/edil/2" ng-click="showPractices(1, false)">{{ 'left_menu-bildings' | i18n }}</a></li> -->
<!-- 										            		<li class="{{ isActiveLinkAssExtra() }}"><a href="#/PracticeList/ass/2" ng-click="showPractices(2, false)">{{ 'left_menu-allowances' | i18n }}</a></li> -->
<!-- 										        		</ul> -->
<!-- 										        	</div> -->
<!-- 										        </div> -->
<!-- 										    </td> -->
<!-- 										    <tr> -->
<!-- 									    </table> -->
<!-- 								    </div> -->
<!-- 							    </div>     -->
<!-- 							</div> -->
							<div class="row" style="height: 30px;" ng-show="!frameOpened">&nbsp;</div>
							<div ng-view class="row" ng-hide="isNewPractice()" >{{ 'loading_text'| i18n }}...</div>
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