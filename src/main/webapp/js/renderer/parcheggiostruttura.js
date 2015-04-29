function Renderer_Parcheggiostruttura() {
};

Renderer_Parcheggiostruttura.prototype.reset = function(container) {
	if (container == undefined) {
		container = containerParcheggiostruttura;
	}

	container.empty();
};

Renderer_Parcheggiostruttura.prototype.render = function(add, data, container) {
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
				parcheggiostrutturaGeo[data['id']].setMap(map);
				google.maps.event.trigger(parcheggiostrutturaGeo[data['id']], 'click');
			});
			li.append($('<td></td>').attr('width', '90%').append(span));
			li.append($('<td></td>').attr('width', '10%').append(action));

			if (container == undefined) {
				container = containerParcheggiostruttura;
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

// RENDER SAMPLE
// <li id="#id"><span>Parcheggiostruttura 1<a href="">dettagli</a></span>
// </li>

Renderer_Parcheggiostruttura.prototype.updateGeo = function(marker, data) {
	marker.setMap(null);
	rendererParcheggiostruttura.renderGeo(false, data, false);
};

Renderer_Parcheggiostruttura.prototype.renderGeo = function(modeEdit, data,
		open) {

	var width = 16;
	var height = 26;
	var position = new google.maps.LatLng(((data != null) ? data['geometry']['lat'] : lat),
			((data != null) ? data['geometry']['lng'] : lng));
	var marker = new google.maps.Marker({
		icon: {
			url: baseUrl + '/rest/marker/' + company + '/parcheggiostruttura',
			ancor: new google.maps.Point(width / 2, height)
		},
		position: position,
		draggable: modeEdit,
		map: map
	});
	
	if (data['id'] != null) {
		parcheggiostrutturaGeo[data['id']] = marker;
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
		rendererParcheggiostruttura.popup(modeEdit, (data['id'] != null) ? parcheggiostruttura[data['id']] : data, marker);
	});

	if (modeEdit) {
		google.maps.event.addListener(marker, "dragend", function() {
			var info;
			if (data['id'] != null) {
				info = parcheggiostruttura[data['id']];
			} else {
				info = data;
			}
			info['geometry']['lat'] = marker.position.lat();
			info['geometry']['lng'] = marker.position.lng();
			google.maps.event.trigger(marker, 'click');
		});
	}

	if (open) {
		geocoder.getLocations(latlng, function(response) {
			var result = response.Placemark[0].address;
			if (result != undefined && result != null) {
				data['streetReference'] = result.substring(0, result
						.indexOf(','));
			}
			google.maps.event.trigger(marker, 'click');
		});

	}
};

Renderer_Parcheggiostruttura.prototype.updatePopup = function(modeEdit, data) {
	if (!!infowindow) {
		rendererParcheggiostruttura.popup(modeEdit, data, infowindow.getPosition());
	}
};

Renderer_Parcheggiostruttura.prototype.popup = function(modeEdit, data, marker) {
	var renderPopup = function(modeEdit, data) {
		var popup = '';
		if (modeEdit) {

			
			var paymentMode = '';
			$.each(parcheggiostrutturaPaymentMode,function(key,value){
				paymentMode +='<input class="check" type="checkbox" name="parcheggiostruttura_paymentMode[]" value="'+key+'" '+ ((data['paymentMode'] != undefined && $.inArray(key,data['paymentMode']) != -1) ? ' checked="checked"' : '')+'/>'+value+'<br/>';
			});
			
			popup = '<div style="width:200px;">'+ parcheggiostrutturaLabels['name']
					+ ' <label id="parcheggiostruttura_name_msg" class="errorMsg"></label><input name="parcheggiostruttura_name" type="text" value="'
					+ ((data['name'] != undefined) ? data['name'] : "")
					+ '"/>'
					+ parcheggiostrutturaLabels['streetReference']
					+ ' <label id="parcheggiostruttura_streetReference_msg" class="errorMsg"></label><input name="parcheggiostruttura_streetReference" type="text" value="'
					+ ((data['streetReference'] != undefined) ? data['streetReference']
							: "")
					+ '"/>'
					+ parcheggiostrutturaLabels['managementMode']
					+ ' <label id="parcheggiostruttura_managementMode_msg" class="errorMsg"></label><input name="parcheggiostruttura_managementMode" type="text" value="'
					+ ((data['managementMode'] != undefined) ? data['managementMode']
							: "")
					+ '"/>'
					+ parcheggiostrutturaLabels['slotNumber']
					+ ' <label id="parcheggiostruttura_slotNumber_msg" class="errorMsg"></label><textarea class="note" name="parcheggiostruttura_slotNumber" >'
					+ ((data['slotNumber'] != undefined) ? data['slotNumber'] : "")
					+ '</textarea>'
					+ parcheggiostrutturaLabels['timeSlot']
					+ ' <label id="parcheggiostruttura_timeSlot_msg" class="errorMsg"></label><textarea class="note" name="parcheggiostruttura_timeSlot" >'
					+ ((data['timeSlot'] != undefined) ? data['timeSlot'] : "")
					+ '</textarea>'
					+ parcheggiostrutturaLabels['paymentMode']
					+ '<label id="parcheggiostruttura_paymentMode_msg" class="errorMsg"></label><br />'
					+ paymentMode
					+ parcheggiostrutturaLabels['phoneNumber']
					+ ' <label id="parcheggiostruttura_phoneNumber_msg" class="errorMsg"></label><textarea class="note" name="parcheggiostruttura_phoneNumber" >'
					+ ((data['phoneNumber'] != undefined) ? data['phoneNumber']
							: "")
					+ '</textarea>'
					+ parcheggiostrutturaLabels['fee']
					+ ' <label id="parcheggiostruttura_fee_msg" class="errorMsg"></label><textarea class="note" name="parcheggiostruttura_fee" >'
					+ ((data['fee'] != undefined) ? data['fee'] : "")
					+ '</textarea>'

					+ '<br/><input name="parcheggiostruttura_id" type="hidden" value="'
					+ ((data['id'] != undefined) ? data['id'] : "")
					+ '"/>'
					+ '<input name="parcheggiostruttura_tempId" type="hidden" value="'
					+ ((data['tempId'] != undefined) ? data['tempId'] : "")
					+ '"/>'
					+ '<input name="parcheggiostruttura_coord" type="hidden" value="'
					+ data['geometry']['lat']
					+ ','
					+ data['geometry']['lng']
					+ '"/>'
					+ '<hr/><a href="#" onclick="saveParcheggiostruttura();">Salva</a>'
					+ ' <a href="#" onclick="removeParcheggiostruttura();">Elimina</a>'
					+ '</div>';
		} else {
			var paymentMode = '<ul class="payment">';
			$.each(data['paymentMode'],function(i,v){
				paymentMode += '<li>' + parcheggiostrutturaPaymentMode[v]+ '</li>';
			});
			paymentMode += '</ul>';
			popup = '<div style="width:200px;"><p class="title-popup">' + parcheggiostrutturaLabels['name']
					+ '</p>' + data['name'] + '<p class="title-popup">'
					+ parcheggiostrutturaLabels['streetReference'] + '</p>'
					+ data['streetReference'] + '<p class="title-popup">'
					+ parcheggiostrutturaLabels['managementMode'] + '</p>'
					+ data['managementMode'] + '<p class="title-popup">'
					+ parcheggiostrutturaLabels['slotNumber'] + '</p>'
					+ data['slotNumber'].replace(/\n/g, '<br/>')
					+ '<p class="title-popup">'
					+ parcheggiostrutturaLabels['timeSlot'] + '</p>'
					+ data['timeSlot'].replace(/\n/g, '<br/>')
					+ '<p class="title-popup">'
					+ parcheggiostrutturaLabels['paymentMode'] + '</p>'
					+ paymentMode
					+ '<p class="title-popup">'
					+ parcheggiostrutturaLabels['phoneNumber'] + '</p>'
					+ data['phoneNumber'].replace(/\n/g, '<br/>')
					+ '<p class="title-popup">' + parcheggiostrutturaLabels['fee']
					+ '</p>' + data['fee'].replace(/\n/g, '<br/>')
					+ '</div><input name="parcheggiostruttura_id" type="hidden" value="'
					+ ((data['id'] != undefined) ? data['id'] : "")
					+ '"/>'
					+ '<hr/><a href="#" onclick="editParcheggiostruttura();">Modifica</a>'
					+ '</div>';
;
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

