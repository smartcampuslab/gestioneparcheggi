<html ng-app="cp">
<head lang="it">
<meta charset="utf-8" />
<!-- <title>{{ 'app_tab-title' | i18n }}</title> -->
<title>MyWeb</title>

<link href="css/bootstrap.min.css" rel="stylesheet" />
<link href="css/bootstrap-theme.min.css" rel="stylesheet" />

<!-- required libraries -->
<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="lib/angular.js"></script>
<script src="js/localize.js" type="text/javascript"></script>
<script src="js/dialogs.min.js" type="text/javascript"></script>
<script src="lib/angular-route.js"></script>
<script src="lib/angular-sanitize.js"></script>
<script src="lib/ui-bootstrap-tpls.min.js"></script>
<script src="js/app.js"></script>
<script src="js/controllers/ctrl.js"></script>
<script src="js/controllers/ctrl_main.js"></script>
<script src="js/controllers/ctrl_iframe.js"></script>
<script src="js/filters.js"></script>
<script src="js/services.js"></script>
<script src="js/directives.js"></script>

<!-- optional libraries -->
<script src="lib/angular-resource.min.js"></script>
<script src="lib/angular-cookies.min.js"></script>
<script src="lib/angular-route.min.js"></script>
<script src="lib/angular-base64.min.js"></script>
<script src="lib/xeditable.min.js"></script>
<base href="/myweb/" />

<body>
	
	<div class="container" ng-controller="IframeCtrl">
		<div class="panel panel-default">
			<div class="panel-body">
				<div class="raw">
					<div class="col-md-12">
						<table width="100%">
							<tr>
								<td width="80%">
									<h1>Sito della Vallagarina</h1>
								</td>
								<td width="20%" align="right" valign="middle">
									<a  class="btn btn-default" role="button" href ng-click="logout()">Logout</a>
								</td>
							</tr>
						</table>
					</div>
				</div>
				
				<div class="raw">
					<div class="col-md-12">
						<label for="portal_url">Url portale:</label>&nbsp;
							<select id="portal_url" class="form-control" ng-model="selectedUrl" ng-options="url.value as url.desc for url in urlList">
						</select>
						<label for="portal_width">Larghezza Frame:</label>&nbsp;
						<input id="portal_width" class="form-control" type="text" ng-model="frameWidth"></input>
						<label for="portal_height">Altezza Frame:</label>&nbsp;
						<input id="portal_height" class="form-control" type="text" ng-model="frameHeight"></input>
					</div>
				</div>
				
				<div class="raw">
					<br>
					&nbsp;
					<div class="col-md-12">
						<p>Iframe con myWeb.</p>
					</div>
				</div>
				
				<div class="raw">
					<div class="col-md-12" align="center">
						<iframe src="{{ getSelectedUrl() }}" width="{{ frameWidth }}%" height="{{ frameHeight }}px" class="myIframe">
<!-- 						<iframe src="https://tn.smartcommunitylab.it/myweb" width="90%" height="800px" class="myIframe" > -->
						</iframe>
					</div>
				</div>
			</div>
		</div>
	</div>

</body>
</html>