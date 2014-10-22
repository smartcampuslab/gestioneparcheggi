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
				var vertex = Math.floor((polygon.getPath().getLength() / 2) - 1);
				map.setCenter(polygon.getPath().getAt(vertex), zoomToLevel);
				rendererZona.popup(false, data, polygon.getPath().getAt(vertex));
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
								var vertex = Math.floor((polygon.getPath().getLength() / 2) - 1);
								map.setCenter(polygon.getPath().getAt(vertex), zoomToLevel);
								rendererZona.popup(false, (data['id'] != null) ? zone[data['id']] : data, polygon.getPath().getAt(vertex));
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

Renderer_Zona.prototype.updateGeo = function(polygon, data) {
	polygon.setMap(null);
	rendererZona.renderGeo(false, data);
};

Renderer_Zona.prototype.renderGeo = function(modeEdit, data) {
	var coords = [];
	if (data['geometry'] != undefined) {
		$.each(data['geometry']['points'], function(k, v) {
			coords.push(new google.maps.LatLng(v['lat'], v['lng']));
		});
	}
	var colorBorder = '#'
			+ ((data['color'] != null) ? data['color'] : defaultPolygonColor);
	var fillColor = '#'
			+ ((data['color'] != null) ? data['color']
					: defaultFillPolygonColor);
	var polygon = new google.maps.Polygon({
		map: map, 
    	paths: [coords], 
    	editable: modeEdit, 
    	strokeColor: colorBorder, 
    	strokeWeight: polygonWeight, 
    	strokeOpacity: polygonOpacity,
    	fillColor: fillColor,
    	fillOpacity: fillPolygonOpacity
	});
	if (data['id'] != undefined) {
		zoneGeo[data['id']] = polygon;
	} else {
		tempGeo[tempIndex] = polygon;
		data['tempId'] = tempIndex;
		tempIndex++;
	}

	var updateGeometry = function() {
		var numVertex = polygon.getPath().getLength();
		if (data['geometry'] == undefined) {
			data['geometry'] = {};
			data['geometry']['points'] = [];
		}
		data['geometry']['points'] = [];
		for ( var i = 0; i < numVertex; i++) {
			var vertex = polygon.getPath().getAt(i);

			data['geometry']['points'].push({
				'lat' : vertex.lat(),
				'lng' : vertex.lng()
			});
		}
		zone[data['id']] = data;
	};
	
	var registerLineListeners = function(editable) {
        google.maps.event.addListener(polygon, 'click', function(event) {
        	if (polygon.getEditable() && event.vertex) {
        		polygon.getPath().removeAt(event.vertex);
        		updateGeometry();
        	} else {
        		popup(event.latLng);
        	}
        });
        google.maps.event.addListener(polygon.getPath(),'insert_at', function(idx){
    		updateGeometry();
			popup(polygon.getPath().getAt(idx));
        });
        google.maps.event.addListener(polygon.getPath(),'remove_at', function(idx){
    		updateGeometry();
    		if (idx > 0) {
    			popup(polygon.getPath().getAt(idx));
    		}
        });
        google.maps.event.addListener(polygon.getPath(),'set_at', function(idx){
    		updateGeometry();
			popup(polygon.getPath().getAt(idx));
        });
	};
	
	var createLineBeingEdited = function(map, pos) {
        polygon.getPath().setAt(0, pos);
        var arr = 1;
        google.maps.event.addListener(map, 'mousemove', function(event) {
            polygon.getPath().setAt(arr, event.latLng);
        });
        google.maps.event.addListener(polygon, 'click', function(event) {
        	polygon.getPath().push(event.latLng);
        	arr++;
        });
        google.maps.event.addListener(polygon, 'dblclick', function(event) {
        	polygon.getPath().push(event.latLng);
        	arr++;
        	google.maps.event.clearListeners(map, 'mousemove');
        	google.maps.event.clearListeners(polygon, 'click');
        	google.maps.event.clearListeners(polygon, 'dblclick');
			resetToolbar();
			updateGeometry();
			registerLineListeners(true);
			popup(event.latLng);
        });
    };
    
    var popup = function(position) {
    	rendererZona.popup(modeEdit, data, position);
    };

	
	if (coords.length == 0) {
		var listener = google.maps.event.addListener(map, "click", function(event) {
			if (event.latLng) {
				createLineBeingEdited(map, event.latLng);
				google.maps.event.removeListener(listener);
			}
		});
	} else {
		registerLineListeners(modeEdit);
	}
};

Renderer_Zona.prototype.updatePopup = function(modeEdit, data) {
	if (!!infowindow) {
		rendererZona.popup(modeEdit, data, infowindow.getPosition());
	}
};

Renderer_Zona.prototype.popup = function(modeEdit, data, position) {
	var renderPopup = function(modeEdit,data) {

		var popup='';
		if(modeEdit){
		var coords = '';
		$.each(data['geometry']['points'], function(key, value) {
			coords += '<input name="zona_coord_' + key + '" type="hidden" value="'
					+ value['lat'] + "," + value['lng'] + '" />';
		});

		popup = '<div style="width:200px;">'
				+ 'Nome <label id="zona_name_msg" class="errorMsg"></label><input name="zona_name" type="text" value="'
				+ ((data['name'] != undefined) ? data['name'] : "")
				+ '"/>'
				+ '<br/>Note <label id="zona_note_msg" class="errorMsg"></label>'
				+ ' <br/><textarea class="note" name="zona_note" >'
				+ ((data['note'] != undefined) ? data['note'] : "")
				+ '</textarea>'
				+ '<br/>Colore <label id="zona_color_msg" class="errorMsg"></label><input name="zona_color" type="text" value="'
				+ ((data['color'] != undefined) ? data['color'] : "")
				+ '" onclick="loadColorPicker();" />'
				+ '<br/><input name="zona_tempId" type="hidden" value="'
				+ +((data['tempId'] != undefined) ? data['tempId'] : "")
				+ '"/>'
				+ '<input name="zona_id" type="hidden" value="'
				+ ((data['id'] != undefined) ? data['id'] : "")
				+ '"/>'
				+ coords
				+ '<hr/><a href="#" onclick="saveZona();">Salva</a> <a href="#" onclick="removeZona();">Elimina</a>'
				+ '</div>';
		}else{
			popup = '<div style="width:200px;">'
				+ '<p class="title-popup">Nome</p>'
				+ data['name']
			+
			(data['note'] ? '<br/><p class="title-popup">Note</p>'+data['note'].replace(/\n/g,'<br/>') : '')
				+ '<input name="zona_id" type="hidden" value="'
				+ ((data['id'] != undefined) ? data['id'] : "")
				+ '"/>'
				+ '<hr/><a href="#" onclick="editZona();">Modifica</a>'
			+ '</div>';
				
			
		}
		return popup;
	};
	
	if (!!infowindow) {
		infowindow.close();
	}
	infowindow = new google.maps.InfoWindow({
		content: renderPopup(modeEdit,data),
		position: position
	});
	infowindow.open(map);

};
