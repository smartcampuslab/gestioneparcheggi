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
	GEvent.clearListeners(map, "click");

	if (tempIndex > 0
			&& (tempGeo[tempIndex - 1] instanceof GPolyline || tempGeo[tempIndex - 1] instanceof GPolygon)) {
		tempGeo[tempIndex - 1].disableEditing();
	}
}

function createArea() {
	select("crea-area");
	dialogArea.dialog("open");
}

function loadAreaEditForm(id) {
	var data = aree[id];
	$('input[name="area_nome"]').val(data['name']);
	$('input[name="area_tariffa"]').val(data['fee'].toFixed(2));
	$('textarea[name="area_fascia-oraria"]').val(data['timeSlot']);
	$('input[name="area_codice-sms"]').val(data['smsCode']);
	$('input[name="area_colore"]').val(data['color']);
	$('input[name="area_id"]').val(data['id']);
	dialogArea.dialog("open");
}

function loadParcometroFilter() {
	rendererParcometroFilter.render($('#parcometro-filter'));
	parcometroFilter.dialog("open");
}

function loadViaFilter() {
	rendererViaFilter.render($('#via-filter'));
	viaFilter.dialog("open");
}

function removeFilterParcometro() {
	$('select[name="filter-parc-area"]').val('');
	$('select[name="filter-parc-status"]').val('');
	$('input[name="filter-parc-code"]').val('');
	filterParcometro();
}

function removeFilterVia() {
	$('select[name="filter-via-area"]').val('');
	$('input[name="filter-via-street"]').val('');
	filterVia();
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
		rendererVia.renderGeo(true, newVia);
	}
}

function createZona() {
	select('crea-zona');
	var newZona = {};
	rendererZona.renderGeo(true, newZona);
}

function resetAreaForm() {
	$([]).add($('input[name="area_nome"]'))
			.add($('input[name="area_tariffa"]')).add(
					$('textarea[name="area_fascia-oraria"]')).add(
					$('input[name="area_codice-sms"]')).add(
					$('input[name="area_colore"]')).add(
					$('input[name="area_id"]')).val('');
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
	area['name'] = $('input[name="area_nome"]').val();
	area['fee'] = $('input[name="area_tariffa"]').val();
	area['smsCode'] = $('input[name="area_codice-sms"]').val();
	area['timeSlot'] = $('textarea[name="area_fascia-oraria"]').val();
	area['color'] = $('input[name="area_colore"]').val();

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

function loadColorPicker() {
	$('#picker').val($('input[name="zona_color"]').val());
	dialogPicker.dialog("open");
}

function removeZona() {
	var zonaId = $('input[name="zona_id"]').val();
	var tempId = $('input[name="zona_tempId"]').val();
	if (confirm("Procedere con l\'eliminazione?")) {
		if (zonaId.length != 0) {
			caller.deleteZona(zonaId);
		} else {
			map.closeInfoWindow();
			map.removeOverlay(tempGeo[tempId]);
			delete tempGeo[tempId];
		}
	}
}

function removeArea(areaId) {
	var result = confirm("Attenzione eliminando l\'area verranno eliminati tutti gli elementi appartenenti alla stessa. Procedere alla eliminazione?");
	if (result) {
		caller.deleteArea(areaId);
	}
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

function addParchimetro(latlng) {
	var newParcometro = {};
	newParcometro['geometry'] = {};
	newParcometro['geometry']['lat'] = latlng.lat();
	newParcometro['geometry']['lng'] = latlng.lng();
	rendererParcometro.renderGeo(true, newParcometro, true);
}

function addPuntobici(latlng) {
	var newPuntobici = {};
	newPuntobici['geometry'] = {};
	newPuntobici['geometry']['lat'] = latlng.lat();
	newPuntobici['geometry']['lng'] = latlng.lng();
	rendererPuntobici.renderGeo(true, newPuntobici, true);
}

function addParcheggiostruttura(latlng) {
	var newParcheggiostruttura = {};
	newParcheggiostruttura['geometry'] = {};
	newParcheggiostruttura['geometry']['lat'] = latlng.lat();
	newParcheggiostruttura['geometry']['lng'] = latlng.lng();
	rendererParcheggiostruttura.renderGeo(true, newParcheggiostruttura, true);
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

function removePuntobici() {
	var puntobiciId = $('input[name="puntobici_id"]').val();
	var tempId = $('input[name="puntobici_tempId"]').val();
	if (confirm("Procedere con l\'eliminazione?")) {
		if (puntobiciId.length != 0) {
			caller.deletePuntobici(puntobiciId);
		} else {
			map.closeInfoWindow();
			map.removeOverlay(tempGeo[tempId]);
			delete tempGeo[tempId];
		}
	}
}

function removeParcheggiostruttura() {
	var parcheggiostrutturaId = $('input[name="parcheggiostruttura_id"]').val();
	var tempId = $('input[name="parcheggiostruttura_tempId"]').val();
	if (confirm("Procedere con l\'eliminazione?")) {
		if (parcheggiostrutturaId.length != 0) {
			caller.deleteParcheggiostruttura(parcheggiostrutturaId);
		} else {
			map.closeInfoWindow();
			map.removeOverlay(tempGeo[tempId]);
			delete tempGeo[tempId];
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
			map.closeInfoWindow();
			map.removeOverlay(tempGeo[tempId]);
			delete tempGeo[tempId];
		}
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
			map.closeInfoWindow();
			map.removeOverlay(tempGeo[tempId]);
			delete tempGeo[tempId];
		}
	}
}

function createParcometro() {
	if (Object.keys(aree).length === 0) {
		dialogCreationArea.dialog("open");
	} else {
		select("crea-parcometro");
		var listener = GEvent.addListener(map, "click", function(overlay,
				latlng) {
			if (latlng) {
				GEvent.removeListener(listener);
				resetToolbar();
				addParchimetro(latlng);
			}
		});
	}
}

function createPuntobici() {
	select("crea-puntobici");
	var listener = GEvent.addListener(map, "click", function(overlay, latlng) {
		if (latlng) {
			GEvent.removeListener(listener);
			resetToolbar();
			addPuntobici(latlng);
		}
	});
}

function createParcheggiostruttura() {
	select("crea-parcheggiostruttura");
	var listener = GEvent.addListener(map, "click", function(overlay, latlng) {
		if (latlng) {
			GEvent.removeListener(listener);
			resetToolbar();
			addParcheggiostruttura(latlng);
		}
	});
}

function saveParcheggiostruttura() {
	var isValid = true;
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
			$('select[name="parcheggiostruttura_paymentMode"]')).add(
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
	parcheggiostruttura['paymentMode'] = $(
			'select[name="parcheggiostruttura_paymentMode"]').val().trim();
	parcheggiostruttura['phoneNumber'] = $(
			'textarea[name="parcheggiostruttura_phoneNumber"]').val().trim();
	parcheggiostruttura['fee'] = $('textarea[name="parcheggiostruttura_fee"]')
			.val().trim();

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
		$('select[name="parcheggiostruttura_paymentMode"]').addClass(
				'ui-state-error');
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

function populate(modeEdit, elements) {
	$.each(elements, function(k, v) {
		switch (v) {
		case 'area':
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
		case 'bici':
			if ($('#view-bici')) {
				$('#view-bici').attr('checked', 'true');
			}
			caller.getAllPuntobici(modeEdit);
			break;
		case 'parcheggiostruttura':
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
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map"));
		map.enableScrollWheelZoom();
		map.setCenter(new GLatLng(mapExtent[0], mapExtent[1]), zoomLevel);
		map.addControl(new GSmallMapControl());
		map.addControl(new GMapTypeControl());
		map.clearOverlays();
	}
}

/*******************************************************************************
 * view functions
 */

function visibility(component) {
	switch (component.id) {
	case 'view-via':
		if (component.checked) {
			caller.getAllVia();
		} else {
			$.each(vieGeo, function(k, v) {
				map.removeOverlay(v);
			});
		}
		break;
	case 'view-parcometro':
		if (component.checked) {
			caller.getAllParcometro();
		} else {
			$.each(parcometriGeo, function(k, v) {
				map.removeOverlay(v);
			});
		}
		break;
	case 'view-zona':
		if (component.checked) {
			caller.getAllZona();
		} else {
			$.each(zoneGeo, function(k, v) {
				map.removeOverlay(v);
			});
		}
		break;
	case 'view-bici':
		if (component.checked) {
			caller.getAllPuntobici();
		} else {
			$.each(puntobiciGeo, function(k, v) {
				map.removeOverlay(v);
			});
		}
		break;
	case 'view-parcheggiostruttura':
		if (component.checked) {
			caller.getAllParcheggiostruttura();
		} else {
			$.each(parcheggiostrutturaGeo, function(k, v) {
				map.removeOverlay(v);
			});
		}
		break;
	default:
		break;
	}
}
