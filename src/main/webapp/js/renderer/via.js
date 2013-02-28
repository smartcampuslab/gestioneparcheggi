function Renderer_Via() {
};

Renderer_Via.prototype.reset = function(container) {
	if (container == undefined) {
		container = containerVia;
	}

	container.empty();
};

Renderer_Via.prototype.render = function(add, data, container) {
	if (add) {
		var li = $("#" + data['id']);
		if (li.length == 0) {
			li = $('<tr></tr>').addClass('elements');
			li.attr('id', data['id']);
			var span = $('<span></span>');
			span.text(data['streetReference']);
			var action = $('<a></a>');
			action.append($('<img></img>').attr('src', 'imgs/details.ico'))
					.attr('alt', 'dettagli').attr('title', 'dettagli');
			action.attr('href', '#');
			action.click(function() {
				var line = vieGeo[data['id']];
				// middle vertex
				var vertex = Math.floor((line.getVertexCount() / 2) - 1);
				map.setCenter(line.getVertex(vertex), zoomToLevel);
				map.openInfoWindowHtml(line.getVertex(vertex), rendererVia
						.renderPopup(true,((data['id'] != null) ? vie[data['id']]
								: data)));
			});
			li.append($('<td></td>').attr('width', '16px').append(
					$('<div></div>')
							.attr('title', aree[data['areaId']]['name'])
							.addClass('color-div').css('background-color',
									'#' + aree[data['areaId']]['color'])));
			li.append($('<td></td>').attr('width', '90%').append(span));

			li.append($('<td></td>').attr('width', '10%').append(action));

			if (container == undefined) {
				container = containerVia;
			}
			container.append(li);
		} else {
			li.children('td:first').children('div').attr('title',
					aree[data['areaId']]['name']).addClass('color-div').css(
					'background-color', '#' + aree[data['areaId']]['color']);
			li.children('td:first').next().children('span').text(
					data['streetReference']);
			li.children('td:first').next().children('a').unbind('click');
			li.children('td:first').next().children('a').bind(
					'click',
					function() {
						var line = vieGeo[data['id']];
						// middle vertex
						var vertex = Math
								.floor((line.getVertexCount() / 2) - 1);
						map.setCenter(line.getVertex(vertex), zoomToLevel);
						map.openInfoWindowHtml(line.getVertex(vertex),
								rendererVia.renderPopup(true,data));
					});
		}
	} else {
		var li = $("#" + data);
		li.remove();
	}
	$("tr.elements:even").css("background-color", "#6eb4e9");
	$("tr.elements:odd").css("background-color", "#add6f5");
};

// RENDER SAMPLE
// <li id="#id"><span>Via 1<a href="">dettagli</a></span>
// </li>

Renderer_Via.prototype.renderPopup = function(modeEdit,data) {

	var popup = '';
	if(modeEdit){
	var areeCombo = '<select name="via_area">';
	areeCombo += '<option value=""></option>';
	$
			.each(
					aree,
					function(key, value) {
						areeCombo += '<option value="'
								+ this['id']
								+ '"'
								+ ((data != undefined && data['areaId'] == this['id']) ? ' selected="selected"'
										: '') + '>' + this['name']
								+ '</option>';
					});
	areeCombo += '</select>';

	var coords = '';
	$.each(data['geometry']['points'], function(key, value) {
		coords += '<input name="via_coord_' + key + '" type="hidden" value="'
				+ value['lat'] + "," + value['lng'] + '" />';
	});

	popup = viaLabels['streetReference']+' <label id="via_streetReference_msg" class="errorMsg"></label> <input name="via_streetReference" type="text" value="'
			+ ((data['streetReference'] != undefined) ? data['streetReference']
					: "")
			+ '"/>'
			+ viaLabels['slotNumber']+' <label id="via_slotNumber_msg" class="errorMsg"></label> <input name="via_slotNumber" type="text" value="'
			+ ((data['slotNumber'] != undefined) ? data['slotNumber'] : "")
			+ '"/>'
			+ viaLabels['handicappedSlotNumber']+' <label id="via_handicappedSlotNumber_msg" class="errorMsg"></label> <input name="via_handicappedSlotNumber" type="text" value="'
			+ ((data['handicappedSlotNumber'] != undefined) ? data['handicappedSlotNumber']
					: "")
			+ '"/>'
			+ viaLabels['areaId']+' <label id="via_area_msg" class="errorMsg"></label> '
			+ areeCombo
			+ '<input name="via_tempId" type="hidden" value="'
			+ +((data['tempId'] != undefined) ? data['tempId'] : "")
			+ '"/>'
			+ '<input name="via_id" type="hidden" value="'
			+ ((data['id'] != undefined) ? data['id'] : "")
			+ '"/>'
			+ '<input name="via_areaId" type="hidden" value="'
			+ ((data['areaId'] != undefined) ? data['areaId'] : "")
			+ '"/>'
			+ coords
			+ '<hr/><a href="#" onclick="saveVia();">Salva</a> <a href="#" onclick="removeVia();">Elimina</a>';
	}else{
		popup = '<p class="title-popup">'+viaLabels['streetReference']+'</p>'
			+ data['streetReference']
			+'<p class="title-popup">'+viaLabels['slotNumber']+'</p>'
			+data['slotNumber']
			+'<p class="title-popup">'+viaLabels['handicappedSlotNumber']+'</p>'
			+data['handicappedSlotNumber']
			+'<br/>'
			+ rendererArea.renderPopupDetails(aree[data['areaId']]);
	}
	return popup;
};

Renderer_Via.prototype.updatePopup = function(line, data) {
	GEvent.clearListeners(line, "click");
	GEvent.addListener(line, "click", function(latlng, index) {
		if (index) {
			line.deleteVertex(index);

		} else {
			map.openInfoWindowHtml(latlng, rendererVia.renderPopup(true,data));
		}
	});
};

Renderer_Via.prototype.updateGeo = function(line, data) {
	map.removeOverlay(line);
	data['color'] = aree[data['areaId']]['color'];
	rendererVia.renderGeo(true,data);
};

Renderer_Via.prototype.renderGeo = function(modeEdit, data) {
	var coords = [];
	if (data['geometry'] != undefined) {
		$.each(data['geometry']['points'], function(k, v) {
			coords.push(new GLatLng(v['lat'], v['lng']));
		});
	}
	var colorLine = '#'
			+ ((data['color'] != null) ? data['color'] : defaultLineColor);
	var line = new GPolyline(coords, colorLine, lineWeight, lineOpacity);
	map.addOverlay(line);

	if (data['id'] != undefined) {
		vieGeo[data['id']] = line;
	} else {
		tempGeo[tempIndex] = line;
		data['tempId'] = tempIndex;
		tempIndex++;
	}

	if (coords.length == 0) {
		line.enableDrawing();
		var listener = GEvent.addListener(map, "click", function(overlay,
				latlng) {
			if (latlng) {
				GEvent.removeListener(listener);
				geocoder.getLocations(latlng, function(response) {
					var result = response.Placemark[0].address;
					if (result != undefined && result != null) {
						data['streetReference'] = result.substring(0, result
								.indexOf(','));
					}
				});
			}
		});
	} else {
		if (modeEdit) {
			GEvent.addListener(line, "click", function(latlng, index) {
				if (index) {
					line.deleteVertex(index);

				} else {
					map.openInfoWindowHtml(latlng, rendererVia
							.renderPopup(modeEdit,vie[data['id']]));
				}
			});

			GEvent.addListener(line, "lineupdated", function() {
				var numVertex = line.getVertexCount();
				if (data['geometry'] == undefined) {
					data['geometry'] = {};
					data['geometry']['points'] = [];
				}
				// clear the array
				data['geometry']['points'].length = 0;

				for ( var i = 0; i < numVertex; i++) {
					var vertex = line.getVertex(i);

					data['geometry']['points'].push({
						'lat' : vertex.lat(),
						'lng' : vertex.lng()
					});
				}
				vie[data['id']] = data;

				var p = rendererVia.renderPopup(modeEdit,data);
				map.openInfoWindowHtml(line.getVertex(Math
						.floor((numVertex / 2) - 1)), p);

			});
		} else {
			GEvent.addListener(line, "click", function(latlng, index) {
				map.openInfoWindowHtml(latlng, rendererVia
						.renderPopup(modeEdit,vie[data['id']]));
			});
		}
	}

	if (modeEdit) {
		GEvent.addListener(line, "mouseover", function() {
			line.enableEditing();
		});
		GEvent.addListener(line, "mouseout", function() {
			line.disableEditing();
		});

		GEvent.addListener(line, "endline", function() {
			resetToolbar();
			var numVertex = line.getVertexCount();
			if (data['geometry'] == undefined) {
				data['geometry'] = {};
				data['geometry']['points'] = [];
			}

			for ( var i = 0; i < numVertex; i++) {
				var vertex = line.getVertex(i);

				data['geometry']['points'].push({
					'lat' : vertex.lat(),
					'lng' : vertex.lng()
				});
			}

			var p = rendererVia.renderPopup(modeEdit,data);
			map.openInfoWindowHtml(line.getVertex(Math
					.floor((numVertex / 2) - 1)), p);

			GEvent.addListener(line, "click", function(latlng, index) {
				if (index) {
					line.deleteVertex(index);

				} else {
					map.openInfoWindowHtml(latlng, p);
				}
			});

			GEvent.addListener(line, "lineupdated", function() {
				var numVertex = line.getVertexCount();
				if (data['geometry'] == undefined) {
					data['geometry'] = {};
					data['geometry']['points'] = [];
				}
				// clear the array
				data['geometry']['points'].length = 0;

				for ( var i = 0; i < numVertex; i++) {
					var vertex = line.getVertex(i);

					data['geometry']['points'].push({
						'lat' : vertex.lat(),
						'lng' : vertex.lng()
					});
				}
				vie[data['id']] = data;

				var p = rendererVia.renderPopup(modeEdit,data);
				map.openInfoWindowHtml(line.getVertex(Math
						.floor((numVertex / 2) - 1)), p);
			});

		});
	}
};