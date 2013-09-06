var baseUrl = '${baseUrl}';
var company = 'amr';


var zoomLevel = 15;
var zoomToLevel = 15;
var mapExtent = [45.886931,11.034265];

var defaultMarkerColor = "FF0000";
var markerWidth = 32;
var markerHeight = 32;

var defaultLineColor = "FF0000";
var lineWeight = 7;
// from 0 to 1
var lineOpacity = 0.6;


var defaultPolygonColor = "FF0000";
var defaultFillPolygonColor = "e3e427";
var polygonWeight = 7;
// from 0 to 1
var polygonOpacity = 0.6;
//from 0 to 1
var fillPolygonOpacity=0.2;


var parcometroStatus = {'ACTIVE':'Attivo', 'INACTIVE':'Non Attivo'};
var parcheggiostrutturaPaymentMode = {'CASH':'Cassa manuale', 'AUTOMATED_TELLER':'Cassa automatica', 'PREPAID_CARD': 'Tessera prepagata', 'PARCOMETRO': 'Parcometro'};

var tempIndex = 0;
var tempGeo = {};
var aree = {};
var parcometri = {};
var parcometriGeo = {};
var vie = {};
var vieGeo = {};
var zone = {};
var zoneGeo = {};
var puntobici={};
var puntobiciGeo={};
var parcheggiostruttura={};
var parcheggiostrutturaGeo={};

// CONTAINER DATA
var containerArea;
var containerParcometro;
var containerVia;
var containerZona;
var containerPuntobici;
var containerParcheggiostruttura;


var caller;
var rendererArea;
var rendererParcometro;
var rendererVia;
var rendererZona;
var rendererParcometroFilter;
var rendererViaFilter;
var rendererPuntobici;
var rendererParcheggiostruttura;

var dialogArea;
var dialogPicker;
var dialogCreationArea;
var parcometroFilter;
var viaFilter;

var map;
var geocoder;

var filterCache={};
filterCache['parcometro']= {};
filterCache['via']= {};

//init
function init(){
	containerArea = $('#area-info');
	containerParcometro = $('#parcometro-info');
	containerVia = $('#via-info');
	containerZona = $('#zona-info');
	containerPuntobici = $('#puntobici-info');
	containerParcheggiostruttura = $('#parcheggiostruttura-info');
	dialogArea = $('#form-area');
	dialogPicker = $("#color-picker-dialog");
	dialogCreationArea=$('#no-area');
	parcometroFilter = $('#parcometro-filter');
	viaFilter = $('#via-filter');
	caller = new Caller();
	rendererArea = new Renderer_Area();
	rendererParcometro = new Renderer_Parcometro();
	rendererVia = new Renderer_Via();
	rendererZona = new Renderer_Zona();
	rendererParcometroFilter = new Renderer_ParcometroFilter();
	rendererViaFilter = new Renderer_ViaFilter();
	rendererPuntobici = new Renderer_Puntobici();
	rendererParcheggiostruttura = new Renderer_Parcheggiostruttura();
	geocoder = new GClientGeocoder();
}
