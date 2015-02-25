function Renderer_Puntobici() {
};

Renderer_Puntobici.prototype.reset = function(container) {
	if (container == undefined) {
		container = containerPuntobici;
	}

	container.empty();
};

Renderer_Puntobici.prototype.render = function(add, data, container) {
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
				map.setCenter(new google.maps.LatLng(data['geometry']['lat'],
						data['geometry']['lng']), zoomToLevel);
				rendererPuntobici.popup(false,data,puntobiciGeo[data['id']]);
			});
			li.append($('<td></td>').attr('width', '90%').append(span));
			li.append($('<td></td>').attr('width', '10%').append(action));

			if (container == undefined) {
				container = containerPuntobici;
			}
			container.append(li);
		} else {
			li.children('td:first').children('span').text(data['name']);
		}

	} else {
		var li = $("#" + data);
		li.remove();
	}

	$("tr.elements:even").css("background-color", "#6eb4e9");
	$("tr.elements:odd").css("background-color", "#add6f5");
};

Renderer_Puntobici.prototype.updatePopup = function(modeEdit, data) {
	if (!!infowindow) {
		rendererPuntobici.popup(modeEdit, data, infowindow.getPosition());
	}
};

// RENDER SAMPLE
// <li id="#id"><span>Puntobici 1<a href="">dettagli</a></span>
// </li>
Renderer_Puntobici.prototype.popup = function(modeEdit, data, marker) {
	var renderPopup = function(modeEdit, data) {
		var popup = '';
			if(modeEdit){
		popup='<div style="width:200px;">'
			    + 'Nome <label id="puntobici_name_msg" class="errorMsg"></label><input name="puntobici_name" type="text" value="'
				+ ((data['name'] != undefined) ? data['name'] : "")
				+ '"/>'
				+ ' Numero bici <label id="puntobici_bikeNumber_msg" class="errorMsg"></label><input name="puntobici_bikeNumber" type="text" value="'
				+ ((data['bikeNumber'] != undefined) ? data['bikeNumber'] : "")
				+ '"/>'
				+ 'Numero posti bici <label id="puntobici_slotNumber_msg" class="errorMsg"></label><input name="puntobici_slotNumber" type="text" value="'
				+ ((data['slotNumber'] != undefined) ? data['slotNumber'] : "")
				+ '"/>'
				+ '<br/><input name="puntobici_id" type="hidden" value="'
				+ ((data['id'] != undefined) ? data['id'] : "")
				+ '"/>'
				+ '<input name="puntobici_tempId" type="hidden" value="'
				+ ((data['tempId'] != undefined) ? data['tempId'] : "")
				+ '"/>'
				+ '<input name="puntobici_coord" type="hidden" value="'
				+ data['geometry']['lat']
				+ ','
				+ data['geometry']['lng']
				+ '"/>'
				+ '<hr/><a href="#" onclick="savePuntobici();">Salva</a>'
				+ ' <a href="#" onclick="removePuntobici();">Elimina</a>';
				+ '</div>';
			}else{
				popup = '<div style="width:200px;">'
					+ '<p class="title-popup">Nome</p>'
					+ data['name']
					+ '<p class="title-popup">Numero bici</p>'
					+ data['bikeNumber']
					+'<p class="title-popup">Numero posti bici</p>'
				    + data['slotNumber']
					+ '</div><input name="puntobici_id" type="hidden" value="'
					+ ((data['id'] != undefined) ? data['id'] : "")
					+ '"/>'
					+ '<hr/><a href="#" onclick="editPuntobici();">Modifica</a>'
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

Renderer_Puntobici.prototype.updateGeo = function(marker, data) {
	marker.setMap(null);
	rendererPuntobici.renderGeo(false, data, false);
};

Renderer_Puntobici.prototype.renderGeo = function(modeEdit, data, open) {
	var width = 16;
	var height = 26;

	var position = new google.maps.LatLng(((data != null) ? data['geometry']['lat'] : lat),
			((data != null) ? data['geometry']['lng'] : lng));
	var marker = new google.maps.Marker({
		icon: {
			url: baseUrl + '/rest/marker/' + company + '/puntobici',
			ancor: new google.maps.Point(width / 2, height)
		},
		position: position,
		draggable: modeEdit,
		map: map
	});

//	var icon = new GIcon();
//	icon.image = baseUrl + '/rest/marker/' + company + '/puntobici';
//	icon.shadowSize = new GSize(Math.floor(width * 1.6), height);
//	icon.iconAnchor = new GPoint(width / 2, height);
//	icon.infoWindowAnchor = new GPoint(width / 2, Math.floor(height / 12));
//	var marker = new GMarker(new GLatLng(
//			((data != null) ? data['geometry']['lat'] : lat),
//			((data != null) ? data['geometry']['lng'] : lng)), {
//		draggable : modeEdit,
//		icon : icon
//	});
	
	if (data['id'] != null) {
		puntobiciGeo[data['id']] = marker;
	} else {
		tempGeo[tempIndex] = marker;
		data['tempId'] = tempIndex;
		tempIndex++;
	}

	if (modeEdit) {
		google.maps.event.addListener(marker, 'dragstart', function() {
			if (!!infowindow) {
				infowindow.close();
			}
		});
	}

	google.maps.event.addListener(marker, 'click', function() {
		rendererPuntobici.popup(modeEdit,((data['id']) ? puntobici[data['id']] : data), marker);
	});

	if (modeEdit) {
		google.maps.event.addListener(marker, "dragend", function() {
			var info;
			if (data['id'] != null) {
				info = puntobici[data['id']];
			} else {
				info = data;
			}
			info['geometry']['lat'] = marker.getPosition().lat();
			info['geometry']['lng'] = marker.getPosition().lng();
			google.maps.event.trigger(marker, 'click');
		});
	}

	marker.setMap(map);
	if (open) {
		google.maps.event.trigger(marker, 'click');
	}
};
