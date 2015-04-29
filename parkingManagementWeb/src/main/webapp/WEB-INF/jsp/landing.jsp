<!DOCTYPE html>
<html ng-app="cp">
<head lang="it">
<meta charset="utf-8" />
<!-- <title>{{ 'app_tab-title' | i18n }}</title> -->
<title>MyWeb</title>

<link href="css/bootstrap.min.css" rel="stylesheet" />
<link href="css/bootstrap-theme.min.css" rel="stylesheet" />
<link href="css/xeditable.css" rel="stylesheet" />
<link href="css/modaldialog.css" rel="stylesheet" />
<link href="img/myweb.ico" rel="shortcut icon" type="image/x-icon" />

<!-- required libraries -->
<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="lib/angular.js"></script>
<script src="js/localize.js" type="text/javascript"></script>
<script src="lib/angular-route.js"></script>
<script src="lib/angular-sanitize.js"></script>
<script src="lib/ui-bootstrap-tpls.min.js"></script>
<script src="js/dialogs.min.js" type="text/javascript"></script>
<script src="js/app.js"></script>
<script src="js/controllers/ctrl.js"></script>
<script src="js/controllers/ctrl_login.js"></script>
<script src="js/controllers/ctrl_main.js"></script>
<script src="js/filters.js"></script>
<script src="js/services.js"></script>
<script src="js/directives.js"></script>

<!-- optional libraries -->
<script src="lib/angular-resource.min.js"></script>
<script src="lib/angular-cookies.min.js"></script>
<script src="lib/angular-route.min.js"></script>
<script src="lib/xeditable.min.js"></script>
<script src="lib/angular-base64.min.js"></script>
<base href="/myweb/" />

<!-- Part for google analytics -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-54947160-1', 'auto');
  ga('send', 'pageview');
  
</script>

<script type="text/javascript">
	
	var cookieEnabled = (navigator.cookieEnabled) ? true : false;	
	if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
	{ 
		document.cookie="testcookie";
		cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
	}
	
</script>

</head>

<body>
	<div class="container"><!-- ng-controller="LoginCtrl" ng-init="checkLogin()" -->
		<div class="row" style="margin-top: 50px;">
			<div ng-class="col-md-10">
<!-- 				<div class="row" style="height: 180px" align="center"> -->
<!-- 					<img src="img/myweb4.png" alt="Logo myWeb" title="Logo myWeb" /> -->
<!-- 				</div> -->
				<div class="panel panel-default" >
	  				<div class="panel-body">
	<!-- 				<div class="row" style="height: 800px"> -->
						<div style="margin: 10px 10px 10px 10px">
							<!--[if lt IE 9]>
							<div class="row" style="height: 20px" align="center" ng-init="hideLogin()">
								<h4><font color="red">Alcune funzionalit&agrave; del portale non sono supportate in Internet Explorer 8 e versioni inferiori. Aggiorna Internet Explorer ad un versione successiva o utilizza un altro browser per accedere al portale.</font></h4>
							</div>
							<![endif]-->
							<div class="row" style="font-size: 18px; color: red" align="center" id="cookies">
							</div>
<!-- 							<div class="row" style="height: 20px" align="center" ng-show="isIe10==true"> -->
<!-- 								<h4><font color="red">Alcune funzionalit&agrave; del portale non sono supportate in Internet Explorer. Utilizza un altro browser per accedere al portale.</font></h4> -->
<!-- 							</div> -->
							<!-- <div class="row" style="height: 20px" align="center">  -->
							<!-- 	<h4><font color="red">Il portale non &egrave; funzionante a causa di una manutenzione straordinaria. Tutte le funzionalit&agrave; saranno riabilitate  entro alcuni giorni.</font></h4> -->
							<!-- </div>  -->
							<div style="margin: 20px" align="center">
	<!-- 							<h2>MyWeb</h2> -->
								<img src="img/myweb4.png" alt="Logo myWeb" title="Logo myWeb" />
							</div>
							<div class="well">
							<p align="justify">Caro Utente, benvenuto in <b>My WEB</b>, il Portale dei Servizi della Vallagarina, che ti permette di presentare le tue domande direttamente in formato elettronico, 
							di essere aggiornato con informazioni puntuali e di partecipare ad una community aperta che vuole essere uno strumento di semplificazione e miglioramento di accesso ai servizi erogati dal territorio.
							Il portale &egrave; attivo a partire dal mese di luglio 2014 e ti consente di presentare in forma completamente digitale le domande: <br></p>
							<ul>
								<li><strong>di locazione di un alloggio;</strong></li>
								<li><strong>di contributo integrativo al canone di locazione.</strong></li>
							</ul>
							<p align="justify">Al portale My WEB si accede attraverso la <b>Carta Provinciale dei Servizi</b> che deve prima essere abilitata. 
							Essa &egrave; attivabile direttamente presso gli uffici della comunit&agrave; e presso numerosi sportelli presenti sul territorio: Sportelli Periferici della Provincia, Sportelli dell'Azienda Sanitaria e Comuni. Gli uffici abilitati sono visibili <a href="http://www.cartaservizi.provincia.tn.it/contatti/"><strong>QUI</strong></a>. 
							Se vuoi approfondire l'argomento visita il sito ufficiale della <a href="https://www.servizionline.provincia.tn.it/portal/server.pt/community/la_tua_cps/1052/la_tua_cps/252698"><strong>Carta Provinciale dei Servizi</strong></a>.</p>
							<table class="table" style="width: 98%">
								<tr>
									<td align="center"><a id="btn_login_prod" href="adc_login" class="btn btn-primary" role="button" ng-click="getLogin()" disabled="false">Procedi con l'autenticazione</a></td><!-- ng-show="isIe10!=true && isLoginShowed!=false" -->						
									<td align="center"><a id="btn_login_console" href="console/console_login" class="btn btn-default" role="button" ng-click="getConsoleLogin()" disabled="false" >Login Operatore</a></td><!-- ng-show="isIe10!=true && isLoginShowed!=false" -->
									<td align="center"><a id="btn_login_test" href="login" class="btn btn-default" role="button" ng-click="getOldLogin()" disabled="false">Login TEST</a></td>
<!-- 									<td align="center"><a href="iframe_login" class="btn btn-default" role="button" ng-click="getIframeLogin()">Login IFRAME</a></td> -->
								</tr>
								<tr>
									<td colspan="3">&nbsp;</td>
								</tr>
							</table>
							</div>
							<table style="width: 100%"><!-- class="table" -->
								<tr>
									<td width="40%"><p><i>Il progetto My WEB &egrave; un' iniziativa ideata, realizzata e promossa da: </i></p></td>
									<td align="center" valign="bottom"><a target="_blank" href="http://www.innovazione.comunitrentini.tn.it/"><img src="img/consorzio_comuni_tn_small.png" alt="Logo comuni trentini" title="Logo comuni trentini"/><br><font size="1">Consorzio dei comuni trentini</font></a></td>
									<td align="center" valign="bottom"><a target="_blank" href="http://www.fbk.eu"><img src="img/fbk_small.png" alt="Logo Fbk" title="Logo Fbk"/><br><font size="1">Fondazione Bruno Kessler</font></a></td>
									<td align="center" valign="bottom"><a target="_blank" href="http://www.comunitadellavallagarina.tn.it"><img src="img/vallagarina_small.png" alt="Logo Vallagarina" title="Logo Vallagarina"/><br><font size="1">Comunit&agrave; della Vallagarina</font></a></td>
								</tr>
								<tr>
									<td colspan="4">&nbsp;</td>
								</tr>
								<tr>	
									<td width="40%"><p><i>Con la collaborazione di: </i></p></td>
									<td align="center" valign="bottom"><a target="_blank" href="http://www.provincia.tn.it"><img src="img/pat_small.png" alt="Logo PAT" title="Logo Provincia Autonoma di Trento"/><br><font size="1">Provincia Autonoma di Trento</font></a></td>
									<td colspan="2" align="center" valign="bottom"><a target="_blank" href="http://www.infotn.it"><img src="img/infotn_small.png" alt="Logo Informatica Trentina" title="Logo Informatica Trentina"/><br><font size="1">Informatica Trentina SpA</font></a></td>
								</tr>
							</table>
	<!-- 						<p><i>Il progetto My WEB è un iniziativa ideata, realizzata e promossa da: stato realizzato grazie alla collaborazione del Consorzio dei comuni Trentini, la Comunit&agrave; di valle della Vallagarina, la Fondazione Bruno Kessler e Informatica Trentina.</i></p> -->
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<hr>
				<footer>
<!-- 				<p>&copy; SmartCampus 2013</p> -->
				</footer>
			</div>
		</div>
	</div>

<script type="text/javascript">
	if(!cookieEnabled){
		document.getElementById("cookies").innerHTML = "Il tuo browser sembra non avere i cookie attivi. E' necessario attivarli per utilizzare il portale. Clicca <a href='cookie_info'>QUI</a> per maggiori informazioni";
		$("#btn_login_prod").attr("disabled", "disabled");
	 	$("#btn_login_console").attr("disabled", "disabled");
	 	$("#btn_login_test").attr("disabled", "disabled");
	} else {
		$("#btn_login_prod").removeAttr("disabled");
	 	$("#btn_login_console").removeAttr("disabled");
	 	$("#btn_login_test").removeAttr("disabled");
	}
</script>

</body>

</html>