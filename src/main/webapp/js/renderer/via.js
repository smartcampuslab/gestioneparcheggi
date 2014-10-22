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
				var vertex = Math.floor((line.getPath().getLength() / 2) - 1);
				map.setCenter(line.getPath().getAt(vertex), zoomToLevel);
				rendererVia.popup(false, ((data['id'] != null) ? vie[data['id']] : data), line.getPath().getAt(vertex));
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
						var vertex = Math.floor((line.getPath().getLength() / 2) - 1);
						map.setCenter(line.getPath().getAt(vertex), zoomToLevel);
						rendererVia.popup(false, data, line.getPath().getAt(vertex));
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

Renderer_Via.prototype.updateGeo = function(line, data) {
	line.setMap(null);
	data['color'] = aree[data['areaId']]['color'];
	rendererVia.renderGeo(false,data);
};

Renderer_Via.prototype.renderGeo = function(modeEdit, data) {
	var coords = [];
	if (data['geometry'] != undefined) {
		$.each(data['geometry']['points'], function(k, v) {
			coords.push(new google.maps.LatLng(v['lat'], v['lng']));
		});
	}
	var colorLine = '#'
			+ ((data['color'] != null) ? data['color'] : defaultLineColor);
	var line = new google.maps.Polyline({
    	map: map, 
    	path: coords, 
    	editable: modeEdit, 
    	strokeColor: colorLine, 
    	strokeWeight: lineWeight, 
    	strokeOpacity: lineOpacity
    });
	line.setMap(map);

	if (data['id'] != undefined) {
		vieGeo[data['id']] = line;
	} else {
		tempGeo[tempIndex] = line;
		data['tempId'] = tempIndex;
		tempIndex++;
	}

	var updateGeometry = function() {
		var numVertex = line.getPath().getLength();
		if (data['geometry'] == undefined) {
			data['geometry'] = {};
			data['geometry']['points'] = [];
		}
		data['geometry']['points'] = [];
		for ( var i = 0; i < numVertex; i++) {
			var vertex = line.getPath().getAt(i);

			data['geometry']['points'].push({
				'lat' : vertex.lat(),
				'lng' : vertex.lng()
			});
		}
		vie[data['id']] = data;
	};
	
	var registerLineListeners = function(editable) {
        google.maps.event.addListener(line, 'click', function(event) {
        	if (line.getEditable() && event.vertex) {
        		line.getPath().removeAt(event.vertex);
        		updateGeometry();
        	} else {
        		popup(event.latLng);
        	}
        });
        
        google.maps.event.addListener(line.getPath(),'insert_at', function(idx){
    		updateGeometry();
			popup(line.getPath().getAt(idx));
        });
        google.maps.event.addListener(line.getPath(),'remove_at', function(idx){
    		updateGeometry();
    		if (idx > 0) {
    			popup(line.getPath().getAt(idx));
    		}
        });
        google.maps.event.addListener(line.getPath(),'set_at', function(idx){
    		updateGeometry();
			popup(line.getPath().getAt(idx));
        });
	};
	
	var createLineBeingEdited = function(map, pos) {
        line.getPath().setAt(0, pos);
        var arr = 1;
        google.maps.event.addListener(map, 'mousemove', function(event) {
            line.getPath().setAt(arr, event.latLng);
        });
        google.maps.event.addListener(line, 'click', function(event) {
        	line.getPath().push(event.latLng);
        	arr++;
        });
        google.maps.event.addListener(line, 'dblclick', function(event) {
        	line.getPath().push(event.latLng);
        	arr++;
        	google.maps.event.clearListeners(map, 'mousemove');
        	google.maps.event.clearListeners(line, 'click');
        	google.maps.event.clearListeners(line, 'dblclick');
			resetToolbar();
			updateGeometry();
			registerLineListeners(true);
			popup(event.latLng);
        });
    };
    
    var popup = function(position) {
    	rendererVia.popup(modeEdit, data, position);
    };

	if (coords.length == 0) {
		var listener = google.maps.event.addListener(map, "click", function(event) {
			if (event.latLng) {
				createLineBeingEdited(map, event.latLng);
				google.maps.event.removeListener(listener);
				geocoder.geocode({location:event.latLng}, function(response) {
					var result = response[0].formatted_address;
					if (result != undefined && result != null) {
						data['streetReference'] = result.substring(0, result.indexOf(','));
					}
				});
			}
		});
	} else {
		registerLineListeners(modeEdit);
	}

};

Renderer_Via.prototype.updatePopup = function(modeEdit, data) {
	if (!!infowindow) {
		rendererVia.popup(modeEdit, data, infowindow.getPosition());
	}
};

Renderer_Via.prototype.popup = function(modeEdit, data, position) {
	var renderPopup = function(modeEdit,data) {
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
	
			popup = '<div style="width:200px;">'
				+ viaLabels['streetReference']+' <label id="via_streetReference_msg" class="errorMsg"></label> <input name="via_streetReference" type="text" value="'
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
				+ '<hr/><a href="#" onclick="saveVia();">Salva</a> <a href="#" onclick="removeVia();">Elimina</a>'
				+ '</div>';
		}else{
			popup = '<div style="width:200px;">'
				+ '<p class="title-popup">'+viaLabels['streetReference']+'</p>'
				+ data['streetReference']
				+'<p class="title-popup">'+viaLabels['slotNumber']+'</p>'
				+data['slotNumber']
				+'<p class="title-popup">'+viaLabels['handicappedSlotNumber']+'</p>'
				+data['handicappedSlotNumber']
				+'<br/><div>'
				+ rendererArea.renderPopupDetails(aree[data['areaId']])
				+ '</div><input name="via_id" type="hidden" value="'
				+ ((data['id'] != undefined) ? data['id'] : "")
				+ '"/>'
				+ '<hr/><a href="#" onclick="editVia();">Modifica</a>'
				+'</div>';
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
