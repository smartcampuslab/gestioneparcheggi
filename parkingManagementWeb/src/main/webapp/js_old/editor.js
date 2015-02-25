function resetToolbar() {
	$('#crea-area').removeClass('selected');
	$('#crea-parcometro').removeClass('selected');
	$('#crea-via').removeClass('selected');
	$('#crea-zona').removeClass('selected');
	$('#crea-puntobici').removeClass('selected');
	$('#crea-parcheggiostruttura').removeClass('selected');
}

function select(buttonId) {
	resetToolbar();
	$('#' + buttonId).addClass('selected');
	google.maps.event.clearListeners(map, "click");

	if (tempIndex > 0
			&& (tempGeo[tempIndex - 1] instanceof google.maps.Polyline || tempGeo[tempIndex - 1] instanceof google.maps.Polygon)) {
		tempGeo[tempIndex - 1].setEditable(false);
	}
}

function mapInForground() {
	$('#map').css('z-index', '111119');
}

function createArea() {
	select("crea-area");
	dialogArea.dialog("open");
}

function loadAreaEditForm(id) {
	saveEditMode = true;
	var data = aree[id];
	if (!!infowindow) {
		infowindow.close();
	}
	$('input[name="area_nome"]').val(data['name']);
	$('input[name="area_tariffa"]').val(data['fee'].toFixed(2));
	$('textarea[name="area_fascia-oraria"]').val(data['timeSlot']);
	$('input[name="area_codice-sms"]').val(data['smsCode']);
	$('input[name="area_colore"]').val(data['color']);
	$('input[name="area_id"]').val(data['id']);

	if (data['geometry'] != undefined && data['geometry'].length > 0) {
		$.each(data['geometry'], function(key, value) {
			$.each(value['points'], function(k, v) {
				$('#form').append(
						$('<input>').attr('type', 'hidden').attr('name',
								"area_coord_g" + areeGeo[id][key] + "_" + k)
								.val(v['lat'] + ',' + v['lng']));
			});
		});

		// add geometries in table
		$
				.each(
						areeGeo[data['id']],
						function(k, v) {
							var row = $('<tr>');
							var detailsLink = $('<a>')
									.attr('href', '#')
									.append(
											$('<img>').attr('src',
													'imgs/details.ico').attr(
													'alt', 'visualizza').attr(
													'title', 'visualizza'))
									.click(
											function() {
												mapInForground();
												var polygon = tempGeo[v];
												polygon.setEditable(true);
												polygon.setOptions({
													'fillColor' : '#000000'
												});
												var vertex = Math
														.floor((polygon.getPath().getLength() / 2) - 1);
												// center the map on highlighted
												// geometry
												map.setCenter(polygon
														.getPath().getAt(vertex),
														zoomToLevel);

												// highlight geometry
												if (highlightedAreaGeometry['geom'] != null
														&& highlightedAreaGeometry['geom'] != polygon) {
													rendererArea
															.resetHighlightedAreaGeometry();
												}
												highlightedAreaGeometry['geom'] = polygon;
												highlightedAreaGeometry['origColor'] = data['color'] != null ? data['color']
														: defaultFillPolygonColor;

												// remove previous text
												// highlighting
												$('#area_geometries tr')
														.each(
																function() {
																	$(this)
																			.children(
																					'td:first')
																			.css(
																					'font-weight',
																					'normal');
																})
												// highlight element in table
												row.children('td:first').css(
														'font-weight', 'bold');
											});

							var deleteLink = $('<a>')
									.attr('href', '#')
									.append(
											$('<img>').attr('src',
													'imgs/delete.ico').attr(
													'alt', 'elimina').attr(
													'title', 'elimina'))
									.click(
											function() {
												// remove from map
												var polygon = tempGeo[v];
												polygon.setMap(null);
												// remove coords
												$(
														'input[name^="area_coord_g'
																+ areeGeo[id][k]
																+ '_"]').each(
														function() {
															$(this).remove();
														});
												$(row).remove();
											});
							row.append($('<td>').text('Geometria')).append(
									$('<td>').append(detailsLink)).append(
									$('<td>').append(deleteLink)).append(
									$('<td>').append(
											$('<input>').attr('type', 'hidden')
													.attr('name', 'tempId')
													.val(v)));
							$('#area_geometries').append(row);
						});
	}

	dialogArea.dialog("open");
}


function resetAreaForm() {
	$([]).add($('input[name="area_nome"]'))
			.add($('input[name="area_tariffa"]')).add(
					$('textarea[name="area_fascia-oraria"]')).add(
					$('input[name="area_codice-sms"]')).add(
					$('input[name="area_colore"]')).add(
					$('input[name="area_id"]')).val('');
	// delete coords
	$('input[name^="area_coord"]').each(function() {
		$(this).remove();
	});
	// delete geometries from table
	$('#area_geometries').empty();
}
function resetAreaMsgs() {
	$([]).add($('input[name="area_nome"]'))
			.add($('input[name="area_tariffa"]')).add(
					$('textarea[name="area_fascia-oraria"]')).add(
					$('input[name="area_codice-sms"]')).add(
					$('input[name="area_colore"]')).removeClass(
					'ui-state-error');
	$([]).add($('#area_nome_msg')).add($('#area_tariffa_msg')).add(
			$('#area_fascia-oraria_msg')).add($('#area_codice-sms_msg')).add(
			$('#area_colore_msg')).text('');
}

function saveArea() {
	var isValid = true;
	resetAreaMsgs();
	var area = {};
	area['id'] = $('input[name="area_id"]').val();
	area['id_app'] = 'rv';
	area['name'] = $('input[name="area_nome"]').val();
	area['fee'] = $('input[name="area_tariffa"]').val();
	area['smsCode'] = $('input[name="area_codice-sms"]').val();
	area['timeSlot'] = $('textarea[name="area_fascia-oraria"]').val();
	area['color'] = $('input[name="area_colore"]').val();
	area['geometry'] = [];
	for ( var geomNum = 0; geomNum < 1000; geomNum++) {
		var geoms = $('input[name^="area_coord_g' + geomNum + '_"]');
		if (geoms.size() != 0) {
			var a = [];
			$.each(geoms, function() {
				a.push({
					'lat' : $(this).val().split(',')[0],
					'lng' : $(this).val().split(',')[1]
				});
			});
			var geom = {};
			geom['points'] = a;
			area['geometry'].push(geom);
		}
	}

	if (area['name'].length == 0) {
		$('#area_nome_msg').text('Campo obbligatorio');
		$('input[name="area_nome"]').addClass('ui-state-error');
		isValid = false;
	}
	if (area['fee'].length == 0) {
		$('#area_tariffa_msg').text('Campo obbligatorio');
		$('input[name="area_tariffa"]').addClass('ui-state-error');
		isValid = false;
	}
	if (area['timeSlot'].length == 0) {
		$('#area_fascia-oraria_msg').text('Campo obbligatorio');
		$('textarea[name="area_fascia-oraria"]').addClass('ui-state-error');
		isValid = false;
	}
	if (area['smsCode'].length == 0) {
		$('#area_codice-sms_msg').text('Campo obbligatorio');
		$('input[name="area_codice-sms"]').addClass('ui-state-error');
		isValid = false;
	}
	if (area['color'].length == 0) {
		$('#area_colore_msg').text('Campo obbligatorio');
		$('input[name="area_colore"]').addClass('ui-state-error');
		isValid = false;
	}

	if (isNaN(area['fee'])) {
		$('#area_tariffa_msg').text('Campo numerico');
		$('input[name="area_tariffa"]').addClass('ui-state-error');
		isValid = false;
	}
	if (isNaN(area['smsCode'])) {
		$('#area_codice-sms_msg').text('Campo numerico');
		$('input[name="area_codice-sms"]').addClass('ui-state-error');
		isValid = false;
	}

	if (isValid) {

		if (area['id'].length == 0) {
			caller.createArea(area);
		} else {
			caller.editArea(area);
		}
	}
}


function removeArea(areaId) {
	var result = confirm("Attenzione eliminando l\'area verranno eliminati tutti gli elementi appartenenti alla stessa. Procedere alla eliminazione?");
	if (result) {
		caller.deleteArea(areaId);
	}
}
function loadViaFilter() {
	rendererViaFilter.render($('#via-filter'));
	viaFilter.dialog("open");
}

function removeFilterVia() {
	$('select[name="filter-via-area"]').val('');
	$('input[name="filter-via-street"]').val('');
	filterVia();
}
function filterVia() {
	var area = $('select[name="filter-via-area"]').val();
	var street = $('input[name="filter-via-street"]').val();

	var result = [];
	if (area.length != 0 || street.length != 0) {
		$.each(vie, function(k, v) {
			if (area.length == 0 || area == v['areaId']) {
				if (street.length == 0
						|| v['streetReference'].toString().match(
								new RegExp(street, 'i')) != null) {
					result.push(v);
				}
			}
		});
	} else {
		result = vie;
	}

	rendererVia.reset();
	$.each(result, function(k, v) {
		rendererVia.render(true, v);
	});

	filterCache['via'] = {};
	filterCache['via']['area'] = area;
	filterCache['via']['streetReference'] = street;

}

function createVia() {
	if (Object.keys(aree).length === 0) {
		dialogCreationArea.dialog("open");
	} else {
		select("crea-via");
		var newVia = {};
		rendererVia.renderGeo(true,newVia);
	}
}


function removeVia() {
	var id = $('input[name="via_id"]').val();
	var tempId = $('input[name="via_tempId"]').val();
	var areaId = $('input[name="via_areaId"]').val();
	if (confirm("Procedere con l\'eliminazione?")) {
		if (id.length != 0) {
			caller.deleteVia(areaId, id);
		} else {
			if (!!infowindow) {
				infowindow.close();
			}
			tempGeo[tempId].setMap(null);
			delete tempGeo[tempId];
		}
	}
}

function editVia() {
	var id = $('input[name="via_id"]').val();
	vieGeo[id].setMap(null);
	rendererVia.renderGeo(true,vie[id]);
	rendererVia.updatePopup(true, vie[id]);
}

function saveVia() {
	var isValid = true;
	$([]).add($('#via_streetReference_msg')).add($('#via_slotNumber_msg')).add(
			$('#via_handicappedSlotNumber_msg')).add($('#via_area_msg')).text(
			'');
	$([]).add($('input[name="via_streetReference"]')).add(
			$('input[name="via_slotNumber"]')).add(
			$('input[name="via_hadicappedSlotNumber_msg"]')).add(
			$('select[name="via_area"]')).removeClass('ui-state-error');

	var via = {};
	var geoTempId = $('input[name="via_tempId"]').val();
	via['id'] = $('input[name="via_id"]').val();
	via['streetReference'] = $('input[name="via_streetReference"]').val();
	via['slotNumber'] = $('input[name="via_slotNumber"]').val();
	via['handicappedSlotNumber'] = $('input[name="via_handicappedSlotNumber"]')
			.val();
	via['timedParkSlotNumber'] = $('input[name="via_timedParkSlotNumber"]')
			.val();
	via['freeParkSlotNumber'] = $('input[name="via_freeParkSlotNumber"]').val();
	via['subscritionAllowedPark'] = $(
			'input[name="via_subscritionAllowedPark"]').prop('checked');
	via['areaId'] = $('select[name="via_area"]').val();
	$coords = $('input[name^="via_coord_"]');
	var a = [];
	$coords.each(function() {
		a.push({
			'lat' : $(this).val().split(',')[0],
			'lng' : $(this).val().split(',')[1]
		});
	});
	via['geometry'] = {};
	via['geometry']['points'] = a;

	if (via['streetReference'].length == 0) {
		$('#via_streetReference_msg').text('Campo obbligatorio');
		$('select[name="via_streetReference"]').addClass('ui-state-error');
		isValid = false;
	}

	if (via['areaId'].length == 0) {
		$('#via_area_msg').text('Campo obbligatorio');
		$('select[name="via_area"]').addClass('ui-state-error');
		isValid = false;
	}

	if (via['slotNumber'].length == 0) {
		$('#via_slotNumber_msg').text('Campo obbligatorio');
		$('input[name="via_slotNumber"]').addClass('ui-state-error');
		isValid = false;
	}
	if (isNaN(via['slotNumber'])) {
		$('#via_slotNumber_msg').text('Campo numerico');
		$('input[name="via_slotNumber"]').addClass('ui-state-error');
		isValid = false;
	}

	if (via['handicappedSlotNumber'].length == 0) {
		$('#via_handicappedSlotNumber_msg').text('Campo obbligatorio');
		$('input[name="via_handicappedSlotNumber"]').addClass('ui-state-error');
		isValid = false;
	}
	if (isNaN(via['handicappedSlotNumber'])) {
		$('#via_handicappedSlotNumber_msg').text('Campo numerico');
		$('input[name="via_handicappedSlotNumber"]').addClass('ui-state-error');
		isValid = false;
	}

	if (via['timedParkSlotNumber'].length == 0) {
		$('#via_timedParkSlotNumber_msg').text('Campo obbligatorio');
		$('input[name="via_timedParkSlotNumber"]').addClass('ui-state-error');
		isValid = false;
	}
	if (isNaN(via['timedParkSlotNumber'])) {
		$('#via_timedParkSlotNumber_msg').text('Campo numerico');
		$('input[name="via_timedParkSlotNumber"]').addClass('ui-state-error');
		isValid = false;
	}

	if (via['freeParkSlotNumber'].length == 0) {
		$('#via_freeParkSlotNumber_msg').text('Campo obbligatorio');
		$('input[name="via_freeParkSlotNumber"]').addClass('ui-state-error');
		isValid = false;
	}
	if (isNaN(via['freeParkSlotNumber'])) {
		$('#via_freeParkSlotNumber_msg').text('Campo numerico');
		$('input[name="via_freeParkSlotNumber"]').addClass('ui-state-error');
		isValid = false;
	}

	if (isValid) {
		if (via['id'].length == 0) {
			caller.createVia(via, geoTempId);
		} else {
			caller.editVia(via);
		}
	}
}


function loadParcometroFilter() {
	rendererParcometroFilter.render($('#parcometro-filter'));
	parcometroFilter.dialog("open");
}


function removeFilterParcometro() {
	$('select[name="filter-parc-area"]').val('');
	$('select[name="filter-parc-status"]').val('');
	$('input[name="filter-parc-code"]').val('');
	filterParcometro();
}

function addParchimetro(latlng) {
	var newParcometro = {};
	newParcometro['geometry'] = {};
	newParcometro['geometry']['lat'] = latlng.lat();
	newParcometro['geometry']['lng'] = latlng.lng();
	rendererParcometro.renderGeo(true,newParcometro, true);
}


function filterParcometro() {
	var area = $('select[name="filter-parc-area"]').val();
	var status = $('select[name="filter-parc-status"]').val();
	var code = $('input[name="filter-parc-code"]').val();

	var result = [];
	if (area.length != 0 || status.length != 0 || code.length != 0) {
		$.each(parcometri, function(k, v) {
			if (area.length == 0 || area == v['areaId']) {
				if (status.length == 0 || status == v['status']) {
					if (code.length == 0
							|| v['code'].toString().match(
									new RegExp('^' + code, 'i')) != null) {
						result.push(v);
					}
				}
			}
		});
	} else {
		result = parcometri;
	}

	rendererParcometro.reset();
	$.each(result, function(k, v) {
		rendererParcometro.render(true, v);
	});

	filterCache['parcometro'] = {};
	filterCache['parcometro']['area'] = area;
	filterCache['parcometro']['status'] = status;
	filterCache['parcometro']['code'] = code;

}

function saveParcometro() {

	// reset validation
	$([]).add($('#parcometro_code_msg')).add($('#parcometro_status_msg')).add(
			$('#parcometro_area_msg')).text('');
	$([]).add($('input[name="parcometro_code"]')).add(
			$('select[name="parcometro_status"]')).add(
			$('select[name="parcometro_area"]')).removeClass('ui-state-error');
	var parcometro = {};
	var coord = $('input[name="parcometro_coord"]').val();
	var tempGeoId = $('input[name="parcometro_tempId"]').val();
	parcometro['id'] = $('input[name="parcometro_id"]').val();
	parcometro['code'] = $('input[name="parcometro_code"]').val().trim();
	parcometro['note'] = $('textarea[name="parcometro_note"]').val().trim();
	parcometro['status'] = $('select[name="parcometro_status"]').val();
	parcometro['areaId'] = $('select[name="parcometro_area"]').val();
	parcometro['geometry'] = {
		'lat' : coord.split(',')[0],
		'lng' : coord.split(',')[1]
	};
	var isValid = true;

	// validation
	if (parcometro['code'].length == 0) {
		$('#parcometro_code_msg').text('Campo obbligatorio');
		$('input[name="parcometro_code"]').addClass('ui-state-error');
		isValid = false;
	}

	if (parcometro['status'].length == 0) {
		$('#parcometro_status_msg').text('Campo obbligatorio');
		$('select[name="parcometro_status"]').addClass('ui-state-error');
		isValid = false;
	}

	if (parcometro['areaId'].length == 0) {
		$('#parcometro_area_msg').text('Campo obbligatorio');
		$('select[name="parcometro_area"]').addClass('ui-state-error');
		isValid = false;
	}

	if (isNaN(parcometro['code'])) {
		$('#parcometro_code_msg').text('Campo numerico');
		$('input[name="parcometro_code"]').addClass('ui-state-error');
		isValid = false;
	}

	if (isValid) {
		if (parcometro['id'].length == 0) {
			caller.createParcometro(tempGeoId, parcometro);
		} else {
			caller.editParcometro(parcometro);
		}
	}
}

function removeParcometro() {
	var areaId = $('input[name="parcometro_areaId"]').val();
	var parcometroId = $('input[name="parcometro_id"]').val();
	var tempId = $('input[name="parcometro_tempId"]').val();
	if (confirm("Procedere con l\'eliminazione?")) {
		if (parcometroId.length != 0) {
			caller.deleteParcometro(areaId, parcometroId);
		} else {
			if (infowindow) {
				infowindow.close();
			}
			if (tempGeo[tempId]) {
				tempGeo[tempId].setMap(null);
			}
			delete tempGeo[tempId];
		}
	}

}

function createParcometro() {
	if (Object.keys(aree).length === 0) {
		dialogCreationArea.dialog("open");
	} else {
		select("crea-parcometro");
		var listener = google.maps.event.addListener(map, "click", function(event) {
			if (event.latLng) {
				google.maps.event.removeListener(listener);
				resetToolbar();
				addParchimetro(event.latLng);
			}
		});
	}
}

function editParcometro() {
	var id = $('input[name="parcometro_id"]').val();
	parcometriGeo[id].setMap(null);
	rendererParcometro.renderGeo(true,parcometri[id]);
	rendererParcometro.updatePopup(true, parcometri[id]);
}

function createZona() {
	select('crea-zona');
	var newZona = {};
	rendererZona.renderGeo(true,newZona);
}

function editZona() {
	var id = $('input[name="zona_id"]').val();
	zoneGeo[id].setMap(null);
	rendererZona.renderGeo(true,zone[id]);
	rendererZona.updatePopup(true, zone[id]);
}

function saveZona() {
	var isValid = true;
	$([]).add($('#zona_name_msg')).add($('#zona_color_msg')).text('');
	$([]).add($('input[name="zona_name"]')).add($('input[name="zona_color"]'))
			.removeClass('ui-state-error');

	var zona = {};
	var geoTempId = $('input[name="zona_tempId"]').val();
	zona['id'] = $('input[name="zona_id"]').val();
	zona['name'] = $('input[name="zona_name"]').val().trim();
	zona['note'] = $('textarea[name="zona_note"]').val().trim();
	zona['color'] = $('input[name="zona_color"]').val();
	$coords = $('input[name^="zona_coord_"]');
	var a = [];
	$coords.each(function() {
		a.push({
			'lat' : $(this).val().split(',')[0],
			'lng' : $(this).val().split(',')[1]
		});
	});
	zona['geometry'] = {};
	zona['geometry']['points'] = a;

	if (zona['name'].length == 0) {
		$('#zona_name_msg').text('Campo obbligatorio');
		$('input[name="zona_name"]').addClass('ui-state-error');
		isValid = false;
	}

	if (zona['color'].length == 0) {
		$('#zona_color_msg').text('Campo obbligatorio');
		$('input[name="zona_color"]').addClass('ui-state-error');
		isValid = false;
	}

	if (isValid) {
		if (zona['id'].length == 0) {
			caller.createZona(zona, geoTempId);
		} else {
			caller.editZona(zona);
		}
	}
}
function removeZona() {
	var zonaId = $('input[name="zona_id"]').val();
	var tempId = $('input[name="zona_tempId"]').val();
	if (confirm("Procedere con l\'eliminazione?")) {
		if (zonaId.length != 0) {
			caller.deleteZona(zonaId);
		} else {
			if (infowindow) {
				infowindow.close();
			}
			if (tempGeo[tempId]) {
				tempGeo[tempId].setMap(null);
			}
			delete tempGeo[tempId];
		}
	}
}

function editPuntobici() {
	var id = $('input[name="puntobici_id"]').val();
	puntobiciGeo[id].setMap(null);
	rendererPuntobici.renderGeo(true,puntobici[id]);
	rendererPuntobici.updatePopup(true, puntobici[id]);
}

function addPuntobici(latlng) {
	var newPuntobici = {};
	newPuntobici['geometry'] = {};
	newPuntobici['geometry']['lat'] = latlng.lat();
	newPuntobici['geometry']['lng'] = latlng.lng();
	rendererPuntobici.renderGeo(true,newPuntobici, true);
}

function removePuntobici() {
	var puntobiciId = $('input[name="puntobici_id"]').val();
	var tempId = $('input[name="puntobici_tempId"]').val();
	if (confirm("Procedere con l\'eliminazione?")) {
		if (puntobiciId.length != 0) {
			caller.deletePuntobici(puntobiciId);
		} else {
			if (!!infowindow) {
				infowindow.close();
			}
			tempGeo[tempId].setMap(null);
			delete tempGeo[tempId];
		}
	}

}


function createPuntobici() {
	select("crea-puntobici");
	var listener = google.maps.event.addListener(map, "click", function(event) {
		if (event.latLng) {
			google.maps.event.removeListener(listener);
			resetToolbar();
			addPuntobici(event.latLng);
		}
	});
}

function savePuntobici() {
	var isValid = true;
	$([]).add($('#puntobici_name_msg')).add($('#puntobici_slotNumber_msg'))
			.add($('#puntobici_bikeNumber_msg')).text('');
	$([]).add($('input[name="puntobici_name"]')).add(
			$('input[name="puntobici_slotNumber"]')).add(
			$('input[name="puntobici_bikeNumber"]')).removeClass(
			'ui-state-error');

	var puntobici = {};
	var coord = $('input[name="puntobici_coord"]').val();
	var tempGeoId = $('input[name="puntobici_tempId"]').val();
	puntobici['id'] = $('input[name="puntobici_id"]').val();
	puntobici['name'] = $('input[name="puntobici_name"]').val().trim();
	puntobici['slotNumber'] = $('input[name="puntobici_slotNumber"]').val()
			.trim();
	puntobici['bikeNumber'] = $('input[name="puntobici_bikeNumber"]').val()
			.trim();
	puntobici['geometry'] = {
		'lat' : coord.split(',')[0],
		'lng' : coord.split(',')[1]
	};

	if (puntobici['name'].length == 0) {
		$('#puntobici_name_msg').text('Campo obbligatorio');
		$('input[name="puntobici_name"]').addClass('ui-state-error');
		isValid = false;
	}

	if (puntobici['bikeNumber'].length == 0) {
		$('#puntobici_bikeNumber_msg').text('Campo obbligatorio');
		$('input[name="puntobici_bikeNumber"]').addClass('ui-state-error');
		isValid = false;
	}

	if (puntobici['slotNumber'].length == 0) {
		$('#puntobici_slotNumber_msg').text('Campo obbligatorio');
		$('input[name="puntobici_slotNumber"]').addClass('ui-state-error');
		isValid = false;
	}

	if (isNaN(puntobici['slotNumber'])) {
		$('#puntobici_slotNumber_msg').text('Campo numerico');
		$('input[name="puntobici_slotNumber"]').addClass('ui-state-error');
		isValid = false;
	}

	if (isNaN(puntobici['bikeNumber'])) {
		$('#puntobici_bikeNumber_msg').text('Campo numerico');
		$('input[name="puntobici_bikeNumber"]').addClass('ui-state-error');
		isValid = false;
	}

	if (isValid) {
		if (puntobici['id'].length == 0) {
			caller.createPuntobici(tempGeoId, puntobici);
		} else {
			caller.editPuntobici(puntobici);
		}
	}
}


function addParcheggiostruttura(latlng) {
	var newParcheggiostruttura = {};
	newParcheggiostruttura['geometry'] = {};
	newParcheggiostruttura['geometry']['lat'] = latlng.lat();
	newParcheggiostruttura['geometry']['lng'] = latlng.lng();
	rendererParcheggiostruttura.renderGeo(true, newParcheggiostruttura, true);
}

function removeParcheggiostruttura() {
	var parcheggiostrutturaId = $('input[name="parcheggiostruttura_id"]').val();
	var tempId = $('input[name="parcheggiostruttura_tempId"]').val();
	if (confirm("Procedere con l\'eliminazione?")) {
		if (parcheggiostrutturaId.length != 0) {
			caller.deleteParcheggiostruttura(parcheggiostrutturaId);
		} else {
//			map.closeInfoWindow();
//			map.removeOverlay(tempGeo[tempId]);
			if (!!infowindow) {
				infowindow.close();
			}
			tempGeo[tempId].setMap(null);
			delete tempGeo[tempId];
		}
	}
}

function createParcheggiostruttura() {
	select("crea-parcheggiostruttura");
	var listener = google.maps.event.addListener(map, "click", function(event) {
		if (event.latLng) {
			google.maps.event.removeListener(listener);
			resetToolbar();
			addParcheggiostruttura(event.latLng);
		}
	});
}

function saveParcheggiostruttura() {
	var isValid = true;
	var paymentModeVar = $('input[name="parcheggiostruttura_paymentMode[]"]:checked');
	$([]).add($('#parcheggiostruttura_name_msg')).add(
			$('#parcheggiostruttura_slotNumber_msg')).add(
			$('#parcheggiostruttura_streetReference_msg')).add(
			$('#parcheggiostruttura_manageMode_msg')).add(
			$('#parcheggiostruttura_timeSlot_msg')).add(
			$('#parcheggiostruttura_paymentMode_msg')).add(
			$('#parcheggiostruttura_phoneNumber_msg')).add(
			$('#parcheggiostruttura_fee_msg')).text('');
	$([]).add($('input[name="parcheggiostruttura_name"]')).add(
			$('textarea[name="parcheggiostruttura_slotNumber"]')).add(
			$('input[name="parcheggiostruttura_streetReference"]')).add(
			$('input[name="parcheggiostruttura_managementMode"]')).add(
			$('textarea[name="parcheggiostruttura_timeSlot"]')).add(
			$('textarea[name="parcheggiostruttura_phoneNumber"]')).add(
			$('textarea[name="parcheggiostruttura_fee"]')).removeClass(
			'ui-state-error');

	var parcheggiostruttura = {};
	var coord = $('input[name="parcheggiostruttura_coord"]').val();
	var tempGeoId = $('input[name="parcheggiostruttura_tempId"]').val();
	parcheggiostruttura['id'] = $('input[name="parcheggiostruttura_id"]').val();
	parcheggiostruttura['name'] = $('input[name="parcheggiostruttura_name"]')
			.val().trim();
	parcheggiostruttura['slotNumber'] = $(
			'textarea[name="parcheggiostruttura_slotNumber"]').val();
	parcheggiostruttura['streetReference'] = $(
			'input[name="parcheggiostruttura_streetReference"]').val().trim();
	parcheggiostruttura['managementMode'] = $(
			'input[name="parcheggiostruttura_managementMode"]').val().trim();
	parcheggiostruttura['timeSlot'] = $(
			'textarea[name="parcheggiostruttura_timeSlot"]').val().trim();
	parcheggiostruttura['phoneNumber'] = $(
			'textarea[name="parcheggiostruttura_phoneNumber"]').val().trim();
	parcheggiostruttura['fee'] = $('textarea[name="parcheggiostruttura_fee"]')
			.val().trim();

	parcheggiostruttura['paymentMode'] = [];
	paymentModeVar.each(function() {
		parcheggiostruttura['paymentMode'].push($(this).val());
	});
	parcheggiostruttura['geometry'] = {
		'lat' : coord.split(',')[0],
		'lng' : coord.split(',')[1]
	};

	if (parcheggiostruttura['name'].length == 0) {
		$('#parcheggiostruttura_name_msg').text('Campo obbligatorio');
		$('input[name="parcheggiostruttura_name"]').addClass('ui-state-error');
		isValid = false;
	}

	if (parcheggiostruttura['streetReference'].length == 0) {
		$('#parcheggiostruttura_streetReference_msg')
				.text('Campo obbligatorio');
		$('input[name="parcheggiostruttura_streetReference"]').addClass(
				'ui-state-error');
		isValid = false;
	}

	if (parcheggiostruttura['slotNumber'].length == 0) {
		$('#parcheggiostruttura_slotNumber_msg').text('Campo obbligatorio');
		$('textarea[name="parcheggiostruttura_slotNumber"]').addClass(
				'ui-state-error');
		isValid = false;
	}

	if (parcheggiostruttura['managementMode'].length == 0) {
		$('#parcheggiostruttura_managementMode_msg').text('Campo obbligatorio');
		$('input[name="parcheggiostruttura_managementMode"]').addClass(
				'ui-state-error');
		isValid = false;
	}

	if (parcheggiostruttura['timeSlot'].length == 0) {
		$('#parcheggiostruttura_timeSlot_msg').text('Campo obbligatorio');
		$('textarea[name="parcheggiostruttura_timeSlot"]').addClass(
				'ui-state-error');
		isValid = false;
	}

	if (parcheggiostruttura['paymentMode'].length == 0) {
		$('#parcheggiostruttura_paymentMode_msg').text('Campo obbligatorio');
		paymentModeVar.addClass('ui-state-error');
		isValid = false;
	}

	if (parcheggiostruttura['phoneNumber'].length == 0) {
		$('#parcheggiostruttura_phoneNumber_msg').text('Campo obbligatorio');
		$('textarea[name="parcheggiostruttura_phoneNumber"]').addClass(
				'ui-state-error');
		isValid = false;
	}

	if (parcheggiostruttura['fee'].length == 0) {
		$('#parcheggiostruttura_fee_msg').text('Campo obbligatorio');
		$('textarea[name="parcheggiostruttura_fee"]')
				.addClass('ui-state-error');
		isValid = false;
	}

	if (isValid) {
		if (parcheggiostruttura['id'].length == 0) {
			caller.createParcheggiostruttura(tempGeoId, parcheggiostruttura);
		} else {
			caller.editParcheggiostruttura(parcheggiostruttura);
		}
	}

}

function editParcheggiostruttura() {
	var id = $('input[name="parcheggiostruttura_id"]').val();
	parcheggiostrutturaGeo[id].setMap(null);
	rendererParcheggiostruttura.renderGeo(true,parcheggiostruttura[id]);
	rendererParcheggiostruttura.updatePopup(true, parcheggiostruttura[id]);
}

function loadColorPicker() {
	$('#picker').val($('input[name="zona_color"]').val());
	dialogPicker.dialog("open");
}

function populate(modeEdit,elements) {
	$.each(elements, function(k, v) {
		switch (v) {
		case 'area':
			if ($('#view-area')) {
				$('#view-area').attr('checked', 'true');
			}
			caller.getAllArea(modeEdit);
			break;
		case 'via':
			if ($('#view-via')) {
				$('#view-via').attr('checked', 'true');
			}
			caller.getAllVia(modeEdit);
			break;
		case 'parcometro':
			if ($('#view-parcometro')) {
				$('#view-parcometro').attr('checked', 'true');
			}
			caller.getAllParcometro(modeEdit);
			break;
		case 'zona':
			if ($('#view-zona')) {
				$('#view-zona').attr('checked', 'true');
			}
			caller.getAllZona(modeEdit);
			break;
		case 'puntobici':
			if ($('#view-bici')) {
				$('#view-bici').attr('checked', 'true');
			}
			caller.getAllPuntobici(modeEdit);
			break;
		case 'parcheggioStruttura':
			if ($('#view-parcheggiostruttura')) {
				$('#view-parcheggiostruttura').attr('checked', 'true');
			}
			caller.getAllParcheggiostruttura(modeEdit);
			break;
		default:
			break;
		}
	});

}

function initializeMap() {
	map = new google.maps.Map(document.getElementById("map"),
			{
				center: new google.maps.LatLng(mapExtent[0], mapExtent[1]),
				zoom: zoomLevel,
				mapTypeControl: true
			});
//	map.addControl(new GSmallMapControl());
}

function addAreaGeometry() {
	mapInForground();
	if (!addAreaGeometryActive) {
		var newArea = {};
		addAreaGeometryActive = true;
		rendererArea.addGeo(true, newArea);
	}
}

/*******************************************************************************
 * view functions BACKEND
 */

function setupEditorPage(elements) {
	var toolbar = $("#toolbar");
	var contents = $("#contents");
	$.each(elements, function(k, v) {
		setupToolbar(v, toolbar);
		setupContents(v, contents);
	});

	init();
	populate(false, elements);
}
function setupContents(entity, contents) {
	var id, label, filterLink;
	if (entity === 'area') {
		label = 'Aree';
		id = 'area-info';
		filterLink = '<div class="toolbar-local-hidden"></div>';
	} else if (entity === 'parcometro') {
		label = 'Parcometri';
		id = 'parcometro-info';
		filterLink = '<div class="toolbar-local"><a href="#" onclick="loadParcometroFilter();">filtra</a></div>';
	} else if (entity === 'via') {
		label = 'Vie';
		id = 'via-info';
		filterLink = '<div class="toolbar-local"><a href="#" onclick="loadViaFilter();">filtra</a></div>';
	} else if (entity === 'parcheggioStruttura') {
		label = 'Parcheggi in struttura';
		id = 'parcheggiostruttura-info';
		filterLink = '<div class="toolbar-local-hidden"></div>';
	} else if (entity === 'puntobici') {
		label = 'Punto bici';
		id = 'puntobici-info';
		filterLink = '<div class="toolbar-local-hidden"></div>';
	} else if (entity === 'zona') {
		label = 'zone';
		id = 'zona-info';
		filterLink = '<div class="toolbar-local-hidden"></div>';
	}

	contents.append("<div class='element-list'><span class='title'>" + label
			+ "</span>" + filterLink + "<table id='" + id + "'></table></div>");
}

function setupToolbar(entity, toolbar) {
	var id, onclick, label;
	if (entity === 'area') {
		label = 'Crea area';
		id = 'crea-area';
		onclick = 'createArea()';
	} else if (entity === 'parcometro') {
		label = 'Crea parcometro';
		id = 'crea-parcometro';
		onclick = 'createParcometro()';
	} else if (entity === 'via') {
		label = 'Crea via';
		id = 'crea-via';
		onclick = 'createVia()';
	} else if (entity === 'parcheggioStruttura') {
		label = 'Crea parcheggio in struttura';
		id = 'crea-parcheggiostruttura';
		onclick = 'createParcheggiostruttura()';
	} else if (entity === 'puntobici') {
		label = 'Crea puntobici';
		id = 'crea-puntobici';
		onclick = 'createPuntobici()';
	} else if (entity === 'zona') {
		label = 'Crea Zona';
		id = 'crea-zona';
		onclick = 'createZona()';
	}
	toolbar.append("<button id='" + id + "' class='toolbar-action' onclick='"
			+ onclick + "'>" + label + "</button>");
}
/*******************************************************************************
 * view functions FRONTEND
 */

function visibility(component) {
	switch (component.id) {
	case 'view-area':
		if (component.checked) {
			caller.getAllArea();
		} else {
			$.each(areeGeo, function() {
				$.each($(this), function(k, v) {
					var poly = tempGeo[v];
					poly.setMap(null);
				});
			});
		}
		break;
	case 'view-via':
		if (component.checked) {
			caller.getAllVia();
		} else {
			$.each(vieGeo, function(k, v) {
				v.setMap(null);
			});
		}
		break;
	case 'view-parcometro':
		if (component.checked) {
			caller.getAllParcometro();
		} else {
			$.each(parcometriGeo, function(k, v) {
				v.setMap(null);
			});
		}
		break;
	case 'view-zona':
		if (component.checked) {
			caller.getAllZona();
		} else {
			$.each(zoneGeo, function(k, v) {
				v.setMap(null);
			});
		}
		break;
	case 'view-bici':
		if (component.checked) {
			caller.getAllPuntobici();
		} else {
			$.each(puntobiciGeo, function(k, v) {
				v.setMap(null);
			});
		}
		break;
	case 'view-parcheggiostruttura':
		if (component.checked) {
			caller.getAllParcheggiostruttura();
		} else {
			$.each(parcheggiostrutturaGeo, function(k, v) {
				v.setMap(null);
			});
		}
		break;
	default:
		break;
	}
}
function setupFrontendPage(elements) {
	var toc = $("<table>");
	$.each(elements, function(k, v) {
		var id, label;

		if (v === 'area') {
			label = 'Aree';
			id = 'view-area';
		} else if (v === 'parcometro') {
			label = 'Parcometri';
			id = 'view-parcometro';
		} else if (v === 'via') {
			label = 'Vie';
			id = 'view-via';
		} else if (v === 'parcheggioStruttura') {
			label = 'Parcheggio in struttura';
			id = 'view-parcheggiostruttura';
		} else if (v === 'puntobici') {
			label = 'Punto Bici';
			id = 'view-bici';
		} else if (v === 'zona') {
			label = 'Zone';
			id = 'view-zona';
		}
		toc.append($("<tr><td width='90%'>" + label + "</td>"
				+ "<td><input type='checkbox' id='" + id
				+ "' onclick='visibility(this);'></td></tr>"));
	});
	$("#toc").prepend(toc);

	init();
}
