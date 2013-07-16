function Renderer_Zona() {
};

Renderer_Zona.prototype.render = function(add, data, container) {
	if (add) {
		var li = $("#" + data['id']);
		if (li.length == 0) {
			li = $('<tr></tr>').addClass('elements');
			li.attr('id', data['id']);

			var span = $('<span></span>');
			span.text(data['name']);
			var action = $('<a></a>');
			action.append($('<img></img>').attr('src', 'imgs/details.ico'))
					.attr('alt', 'dettagli').attr('title', 'dettagli');
			action.attr('href', '#');
			action.click(function() {
				var polygon = zoneGeo[data['id']];
				// middle vertex
				var vertex = Math.floor((polygon.getVertexCount() / 2) - 1);
				map.setCenter(polygon.getVertex(vertex), zoomToLevel);
				map.openInfoWindowHtml(polygon.getVertex(vertex), rendererZona
						.renderPopup(true,data));
			});
			li.append($('<td></td>').attr('width', '90%').append(span));
			li.append($('<td></td>').attr('width', '10%').append(action));
			if (container == undefined) {
				container = containerZona;
			}
			container.append(li);
		} else {
			li.children('td:first').children('span').text(data['name']);
			li.children('td:first').next().children('a').unbind('click');
			li
					.children('td:first')
					.next()
					.children('a')
					.bind(
							'click',
							function() {
								var polygon = zoneGeo[data['id']];
								// middle vertex
								var vertex = Math.floor((polygon
										.getVertexCount() / 2) - 1);
								map.setCenter(polygon.getVertex(vertex),
										zoomToLevel);
								map
										.openInfoWindowHtml(
												polygon.getVertex(vertex),
												rendererZona
														.renderPopup(true,((data['id'] != null) ? zone[data['id']]
																: data)));
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
// <li id="#id"><span>Zona 1<a href="">dettagli</a></span>
// </li>

Renderer_Zona.prototype.renderPopup = function(modeEdit,data) {

	var popup='';
	if(modeEdit){
	var coords = '';
	$.each(data['geometry']['points'], function(key, value) {
		coords += '<input name="zona_coord_' + key + '" type="hidden" value="'
				+ value['lat'] + "," + value['lng'] + '" />';
	});

	popup = zonaLabels['name']+' <label id="zona_name_msg" class="errorMsg"></label><input name="zona_name" type="text" value="'
			+ ((data['name'] != undefined) ? data['name'] : "")
			+ '"/>'
			+ '<br/>'+zonaLabels['note']+' <label id="zona_note_msg" class="errorMsg"></label>'
			+ ' <br/><textarea class="note" name="zona_note" >'
			+ ((data['note'] != undefined) ? data['note'] : "")
			+ '</textarea>'
			+ '<br/>'+zonaLabels['color']+' <label id="zona_color_msg" class="errorMsg"></label><input name="zona_color" type="text" value="'
			+ ((data['color'] != undefined) ? data['color'] : "")
			+ '" onclick="loadColorPicker();" />'
			+ '<br/><input name="zona_tempId" type="hidden" value="'
			+ +((data['tempId'] != undefined) ? data['tempId'] : "")
			+ '"/>'
			+ '<input name="zona_id" type="hidden" value="'
			+ ((data['id'] != undefined) ? data['id'] : "")
			+ '"/>'
			+ coords
			+ '<hr/><a href="#" onclick="saveZona();">Salva</a> <a href="#" onclick="removeZona();">Elimina</a>';
	}else{
		popup='<p class="title-popup">'+zonaLabels['name']+'</p>'
			+ data['name']
		+
		(data['note'] ? '<br/><p class="title-popup">'+zonaLabels['note']+'</p>'+data['note'].replace(/\n/g,'<br/>') : '');
			
		
	}
	return popup;
};

Renderer_Zona.prototype.updatePopup = function(polygon, data) {
	GEvent.clearListeners(polygon, "click");
	GEvent.addListener(polygon, "click", function(latlng, index) {
		if (index) {
			polygon.deleteVertex(index);

		} else {
			map.openInfoWindowHtml(latlng, rendererZona.renderPopup(true,data));
		}
	});
};

Renderer_Zona.prototype.updateGeo = function(polygon, data) {
	map.removeOverlay(polygon);
	rendererZona.renderGeo(true, data);
};

Renderer_Zona.prototype.renderGeo = function(modeEdit, data) {
	var coords = [];
	if (data['geometry'] != undefined) {
		$.each(data['geometry']['points'], function(k, v) {
			coords.push(new GLatLng(v['lat'], v['lng']));
		});
	}
	var colorBorder = '#'
			+ ((data['color'] != null) ? data['color'] : defaultPolygonColor);
	var fillColor = '#'
			+ ((data['color'] != null) ? data['color']
					: defaultFillPolygonColor);
	var polygon = new GPolygon(coords, colorBorder, polygonWeight,
			polygonOpacity, fillColor, fillPolygonOpacity);
	map.addOverlay(polygon);

	if (data['id'] != undefined) {
		zoneGeo[data['id']] = polygon;
	} else {
		tempGeo[tempIndex] = polygon;
		data['tempId'] = tempIndex;
		tempIndex++;
	}

	if (coords.length == 0) {
		polygon.enableDrawing();
	} else {
		if (modeEdit) {
			GEvent.addListener(polygon, "click", function(latlng, index) {
				if (index) {
					polygon.deleteVertex(index);

				} else {
					map.openInfoWindowHtml(latlng, rendererZona
							.renderPopup(modeEdit,zone[data['id']]));
				}
			});

			GEvent.addListener(polygon, "lineupdated", function() {
				var numVertex = polygon.getVertexCount();
				if (data['geometry'] == undefined) {
					data['geometry'] = {};
					data['geometry']['points'] = [];
				}
				// clear the array
				data['geometry']['points'].length = 0;

				for ( var i = 0; i < numVertex; i++) {
					var vertex = polygon.getVertex(i);

					data['geometry']['points'].push({
						'lat' : vertex.lat(),
						'lng' : vertex.lng()
					});
				}
				zone[data['id']] = data;

				var p = rendererZona.renderPopup(modeEdit,data);
				map.openInfoWindowHtml(polygon.getVertex(Math
						.floor((numVertex / 2) - 1)), p);
			});
		} else {
			GEvent.addListener(polygon, "click", function(latlng, index) {
				map.openInfoWindowHtml(latlng, rendererZona
						.renderPopup(modeEdit,zone[data['id']]));
			});
		}
	}

	if (modeEdit) {
		GEvent.addListener(polygon, "mouseover", function() {
			polygon.enableEditing();
		});
		GEvent.addListener(polygon, "mouseout", function() {
			polygon.disableEditing();
		});

		GEvent.addListener(polygon, "endline", function() {
			resetToolbar();
			var numVertex = polygon.getVertexCount();
			if (data['geometry'] == undefined) {
				data['geometry'] = {};
				data['geometry']['points'] = [];
			}

			for ( var i = 0; i < numVertex; i++) {
				var vertex = polygon.getVertex(i);

				data['geometry']['points'].push({
					'lat' : vertex.lat(),
					'lng' : vertex.lng()
				});
			}

			var p = rendererZona.renderPopup(modeEdit,data);
			map.openInfoWindowHtml(polygon.getVertex(Math
					.floor((numVertex / 2) - 1)), p);

			GEvent.addListener(polygon, "click", function(latlng, index) {
				if (index) {
					polygon.deleteVertex(index);

				} else {
					map.openInfoWindowHtml(latlng, p);
				}
			});

			GEvent.addListener(polygon, "lineupdated", function() {
				var numVertex = polygon.getVertexCount();
				if (data['geometry'] == undefined) {
					data['geometry'] = {};
					data['geometry']['points'] = [];
				}
				// clear the array
				data['geometry']['points'].length = 0;

				for ( var i = 0; i < numVertex; i++) {
					var vertex = polygon.getVertex(i);

					data['geometry']['points'].push({
						'lat' : vertex.lat(),
						'lng' : vertex.lng()
					});
				}
				zone[data['id']] = data;

				var p = rendererZona.renderPopup(data);
				map.openInfoWindowHtml(polygon.getVertex(Math
						.floor((numVertex / 2) - 1)), p);
			});

		});
	}
};