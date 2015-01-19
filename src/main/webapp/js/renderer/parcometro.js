function Renderer_Parcometro() {
};

Renderer_Parcometro.prototype.reset = function(container) {
	if (container == undefined) {
		container = containerParcometro;
	}

	container.empty();
};

Renderer_Parcometro.prototype.render = function(add, data, container) {
	if (add) {
		var li = $("#" + data['id']);
		if (li.length == 0) {
			li = $('<tr></tr>').addClass('elements');
			li.attr('id', data['id']);
			var span = $('<span></span>');
			span.text(data['code']);
			var action = $('<a></a>');
			action.append($('<img></img>').attr('src', 'imgs/details.ico'))
					.attr('alt', 'dettagli').attr('title', 'dettagli');
			action.attr('href', '#');
			action.click(function() {
				map.setCenter(new google.maps.LatLng(data['geometry']['lat'],
						data['geometry']['lng']), zoomToLevel);
				parcometriGeo[data['id']].setMap(map);
				google.maps.event.trigger(parcometriGeo[data['id']], 'click');
			});
			li.append($('<td></td>').attr('width', '16px').append(
					$('<div></div>')
							.attr('title', aree[data['areaId']]['name'])
							.addClass('color-div').css('background-color',
									'#' + aree[data['areaId']]['color'])));
			li.append($('<td></td>').attr('width', '80%').append(span));
			if (data['status'] == 'INACTIVE') {
				li.append($('<td></td>').attr('width', '16px').append(
						$('<img></img>').attr('src', 'imgs/status-off.ico')
								.attr('alt', 'non attivo').attr('title',
										'non attivo')));
			} else {
				li
						.append($('<td></td>').attr('width', '16px').append(
								$('<img></img>').attr('src',
										'imgs/status-on.ico').attr('alt',
										'attivo').attr('title', 'attivo')));
			}
			li.append($('<td></td>').attr('width', '10%').append(action));

			if (container == undefined) {
				container = containerParcometro;
			}
			container.append(li);
		} else {
			li.children('td:first').children('div').attr('title',
					aree[data['areaId']]['name']).addClass('color-div').css(
					'background-color', '#' + aree[data['areaId']]['color']);
			if (data['status'] == 'INACTIVE') {
				li.children('td:first').next().next().children('img').attr(
						'src', 'imgs/status-off.ico').attr('alt', 'non attivo')
						.attr('title', 'non attivo');
			} else {
				li.children('td:first').next().next().children('img').attr(
						'src', 'imgs/status-on.ico').attr('alt', 'attivo')
						.attr('title', 'attivo');
			}

			li.children('td:first').next().children('span').text(data['code']);
		}

	} else {
		var li = $("#" + data);
		li.remove();
	}

	$("tr.elements:even").css("background-color", "#6eb4e9");
	$("tr.elements:odd").css("background-color", "#add6f5");
};

// RENDER SAMPLE
// <li id="#id"><span>Parcometro 1<a href="">dettagli</a></span>
// </li>

Renderer_Parcometro.prototype.updateGeo = function(marker, data) {
	marker.setMap(null);
	data['color'] = aree[data['areaId']]['color'];
	rendererParcometro.renderGeo(false, data, false);
};

Renderer_Parcometro.prototype.renderGeo = function(modeEdit, data, open) {
	var width =16;
	var height = 26;

	var position = new google.maps.LatLng(((data != null) ? data['geometry']['lat'] : lat),
			((data != null) ? data['geometry']['lng'] : lng));
	var marker = new google.maps.Marker({
		icon: {
			url: baseUrl+'/rest/marker/'+company+'/parcometro/'+((data['color'] != null) ? data['color'] : defaultMarkerColor),
			ancor: new google.maps.Point(width / 2, height)
		},
		position: position,
		draggable: modeEdit,
		map: map
	});

	if (data['id'] != null) {
		parcometriGeo[data['id']] = marker;
	} else {
		tempGeo[tempIndex] = marker;
		data['tempId'] = tempIndex;
		tempIndex++;
	}

	if (modeEdit) {
		google.maps.event.addListener(marker, 'dragstart', function() {
			if (infowindow) {
				infowindow.close();
			}
		});
	}

	google.maps.event.addListener(marker, 'click', function() {
		rendererParcometro.popup(modeEdit, (data['id'] != null) ? parcometri[data['id']] : data, marker);
	});

	if (modeEdit) {
		google.maps.event.addListener(marker, "dragend", function() {
			var info;
			if (data['id'] != null) {
				info = parcometri[data['id']];
			} else {
				info = data;
			}
			info['geometry']['lat'] = marker.position.lat();
			info['geometry']['lng'] = marker.position.lng();
			google.maps.event.trigger(marker, 'click');
		});
	}

	if (open) {
		google.maps.event.trigger(marker, 'click');
	}
};

Renderer_Parcometro.prototype.updatePopup = function(modeEdit, data) {
	if (!!infowindow) {
		rendererParcometro.popup(modeEdit, data, infowindow.getPosition());
	}
};

Renderer_Parcometro.prototype.popup = function(modeEdit, data, marker) {
	var renderPopup = function(modeEdit, data) {
		var popup = '';
		if (modeEdit) {
			var areeCombo = '<select name="parcometro_area">';
			areeCombo += '<option value=""></option>';
			$
					.each(
							aree,
							function(key, value) {
								areeCombo += '<option value="'
										+ this['id']
										+ '"'
										+ ((data['areaId'] != undefined && data['areaId'] == this['id']) ? ' selected="selected"'
												: '') + '>' + this['name']
										+ '</option>';
							});
			areeCombo += '</select>';

			var status = '<select name="parcometro_status">';
			status += '<option value=""></option>';

			$
					.each(
							parcometroStatus,
							function(key, value) {
								status += '<option value="'
										+ key
										+ '"'
										+ ((data['status'] != undefined && data['status'] == key) ? ' selected="selected"'
												: '') + '>' + value + '</option>';
							});
			status += ' </select>';

			popup = '<div style="width:200px;">'
					+ parcometroLabels['code']+' <label id="parcometro_code_msg" class="errorMsg"></label> <input name="parcometro_code" type="text" value="'
					+ ((data['code'] != undefined) ? data['code'] : "")
					+ '"/>'
					+ '<br/>'
					+ 'Posizione<br/>'
					+ data['geometry']['lat']
					+ ','
					+ data['geometry']['lng']
					+ '<br/>'
					+ parcometroLabels['note']
					+ ' <label id="parcometro_note_msg" class="errorMsg"></label><textarea class="note" name="parcometro_note" >'
					+ ((data['note'] != undefined) ? data['note'] : "")
					+ '</textarea>'
					+ parcometroLabels['status']
					+ ' <label id="parcometro_status_msg" class="errorMsg"></label>'
					+ status + parcometroLabels['areaId']
					+ ' <label id="parcometro_area_msg" class="errorMsg"></label>'
					+ areeCombo
					+ '<input name="parcometro_id" type="hidden" value="'
					+ ((data['id'] != undefined) ? data['id'] : "") + '"/>'
					+ '<input name="parcometro_tempId" type="hidden" value="'
					+ ((data['tempId'] != undefined) ? data['tempId'] : "") + '"/>'
					+ '<input name="parcometro_areaId" type="hidden" value="'
					+ ((data['areaId'] != undefined) ? data['areaId'] : "") + '"/>'
					+ '<input name="parcometro_coord" type="hidden" value="'
					+ data['geometry']['lat'] + ',' + data['geometry']['lng']
					+ '"/>'
					+ '<hr/><a href="#" onclick="saveParcometro();">Salva</a>'
					+ ' <a href="#" onclick="removeParcometro();">Elimina</a>'
					+ '</div>';
		} else {
			popup = '<div style="width:200px;">'
					+ '<p class="title-popup">'+parcometroLabels['code']+'</p>'
					+ data['code']
					+ '<p class="title-popup">Posizione</p>'
					+ data['geometry']['lat']
					+ ','
					+ data['geometry']['lng']
					+ '<br/>'
					+ (data['note'] ? '<p class="title-popup">'
							+ parcometroLabels['note'] + '</p>'
							+ data['note'].replace(/\n/g, '<br/>') : '')
					+ '<br/><br/>'
					+ rendererArea.renderPopupDetails(aree[data['areaId']])
					+ '</div><input name="parcometro_id" type="hidden" value="'
					+ ((data['id'] != undefined) ? data['id'] : "")
					+ '"/>'
					+ '<hr/><a href="#" onclick="editParcometro();">Modifica</a>'
					+ '</div>';
		}
		return popup;
	};
	
	if (!!infowindow) {
		infowindow.close();
	}
	infowindow = new google.maps.InfoWindow(
		      { 
		    	  content: renderPopup(modeEdit, data)
		      });
	infowindow.open(map, marker);
};	