function Renderer_Area() {
};

Renderer_Area.prototype.renderDetails = function(data) {
	var detail = '<table class="details">' + '<tr><td>' + areaLabels['fee']
			+ '</td><td> ' + data['fee'].toFixed(2) + ' euro/ora</td></tr>'
			+ '<tr><td>' + areaLabels['timeSlot'] + '</td><td>'
			+ data['timeSlot'] + '</td></tr>' + '<tr><td>'
			+ areaLabels['smsCode'] + '</td><td>' + data['smsCode']
			+ '</td></tr>' + '<tr><td>' + areaLabels['color'] + '</td><td> '
			+ '<div class="color-div" style="background-color: #'
			+ data['color'] + ';"></div>' + '</td></tr></table>' + '<hr />'
			+ '<a href="#" onclick="loadAreaEditForm(\'' + data['id']
			+ '\');">Modifica</a> ' + '<a href="#" onclick="removeArea(\''
			+ data['id'] + '\')">Elimina</a>';
	return detail;
};


Renderer_Area.prototype.renderPopup = function(data) {
	popup='<h3>'+data['name']+'</h3>'
	+'<p class="title-popup">'+areaLabels['fee']+'</p>'
	+ data['fee']
	+'<p class="title-popup">'+areaLabels['timeSlot']+'</p>'
	+ data['timeSlot']
	+ '<p class="title-popup">'+areaLabels['smsCode']+'</p>'
	+ data['smsCode'];
	return popup;
};

Renderer_Area.prototype.renderPopupDetails = function(data) {
	var detail = '<fieldset class="popup"><legend class="popup">'
			+ data['name'] + '</legend>' + '<p class="title-popup">'
			+ areaLabels['fee'] + '</p> ' + data['fee'].toFixed(2)
			+ ' euro/ora' + '<p class="title-popup">' + areaLabels['timeSlot']
			+ '</p>' + data['timeSlot'].replace(/\n/g, '<br/>')
			+ '<p class="title-popup">' + areaLabels['smsCode'] + '</p>'
			+ data['smsCode'];
	+'</fieldset>';
	return detail;
};

Renderer_Area.prototype.resetHighlightedAreaGeometry = function() {
	if (highlightedAreaGeometry != null
			&& highlightedAreaGeometry['geom'] != null) {
		highlightedAreaGeometry['geom'].setFillStyle({
			'color' : "#" + highlightedAreaGeometry['origColor']
		});
	}
};

Renderer_Area.prototype.render = function(add, data, container) {
	if (add) {
		var li = $("#" + data['id']);
		if (li.length == 0) {
			li = $('<tr></tr>').addClass('elements');
			li.attr('id', data['id']);
			var span = $('<span></span>');
			span.attr('id', 'title-detail_' + data['id']);
			span.text(data['name']);
			var action = $('<a></a>');
			action.append($('<img></img>').attr('src', 'imgs/details.ico'))
					.attr('alt', 'dettagli').attr('title', 'dettagli');
			action.attr('href', '#');
			action.click(function() {
				div.toggle("slow");
			});
			var div = $('<div></div>');
			div.attr('id', 'area-info_' + data['id']);
			div.addClass('area-detail');
			div.html(rendererArea.renderDetails(data));

			li.append($('<td></td>').attr('width', '90%').append(span).append(
					div));
			li.append($('<td></td>').attr('width', '10%').css('vertical-align',
					'top').append(action));

			if (container == undefined) {
				container = containerArea;
			}

			container.append(li);
		} else {
			li.children('td:first').children('span').text(data['name']);
			var div = li.children('td:first').children('div');
			div.html(rendererArea.renderDetails(data));
		}

	} else {
		var li = $("#" + data);
		li.remove();
	}

	$("tr.elements:even").css("background-color", "#6eb4e9");
	$("tr.elements:odd").css("background-color", "#add6f5");

	// RENDER SAMPLE
	// <li><span id="title-details_3">Area 3</span>
	// <div id="area-info_3" class="area-detail">
	// tariffa: 1.00cent/ora<br />
	// fascia oraria: feriale 8.30/12.30, 15.30/19.30<br />
	// codice sms : 45<br />
	// </div>
	// </li>
};

Renderer_Area.prototype.renderGeo = function(modeEdit, data, modeLoading) {
	if (data['geometry'] != undefined) {
		$.each(data['geometry'], function(key, value) {
			coords = [];
			$.each(value['points'], function(k, v) {
				coords.push(new GLatLng(v['lat'], v['lng']));
			});
			var geom = {};
			geom['color'] = data['color'];
			geom['coords'] = coords;
			geom['localId'] = key;
			rendererArea.addGeo(modeEdit, geom, data, modeLoading);
		});
	}
};

Renderer_Area.prototype.addGeo = function(modeEdit, data, area, modeLoading) {
	var coords = data['coords'] != undefined ? data['coords'] : [];

	var colorBorder = '#'
			+ ((data['color'] != null) ? data['color'] : defaultPolygonColor);
	var fillColor = '#'
			+ ((data['color'] != null) ? data['color']
					: defaultFillPolygonColor);
	var polygon = new GPolygon(coords, colorBorder, polygonWeight,
			polygonOpacity, fillColor, fillPolygonOpacity);
	map.addOverlay(polygon);

	tempGeo[tempIndex] = polygon;
	data['tempId'] = tempIndex;
	tempIndex++;

	// relative id of geometry
	var geometryId = data['tempId'];
	
	if (area != undefined && area['id'] != undefined) {
		id = area['id'];
		if (areeGeo[id] == undefined) {
			areeGeo[id] = [];
		}
		areeGeo[id].push(data['tempId']);
	}

	if (!modeLoading) {
		polygon.enableDrawing();
	} else {
		if (modeEdit) {
			GEvent.addListener(polygon, "click", function(latlng, index) {
				if (index) {
					polygon.deleteVertex(index);
				} else {
					if (area != undefined && !saveEditMode) {
						loadAreaEditForm(area['id']);
					}
					dialogArea.dialog('open');
				}
			});

			GEvent
					.addListener(
							polygon,
							"lineupdated",
							function() {
								var numVertex = polygon.getVertexCount();
								
								// updates polygon coords
								if(area != undefined  && area['id'] != undefined){
									var a = aree[area['id']];
									var editedPolygon = [];
									for ( var i = 0; i < numVertex; i++) {
										var vertex = polygon.getVertex(i);
										editedPolygon.push({'lat': vertex.lat(),'lng': vertex.lng()});
									}
									a['geometry'][data['localId']] = {'points':editedPolygon};
								}
								if (saveEditMode) {
									// clean previous coords
									$(
											'input[name^="area_coord_g'
													+ geometryId + '"]').each(
											function() {
												$(this).remove();
											});

									for ( var i = 0; i < numVertex; i++) {
										var vertex = polygon.getVertex(i);

										// add hidden field

										$('#form')
												.append(
														$('<input>')
																.attr('type',
																		'hidden')
																.attr(
																		'name',
																		"area_coord_g"
																				+ geometryId
																				+ "_"
																				+ i)
																.val(
																		vertex
																				.lat()
																				+ ','
																				+ vertex
																						.lng()));
									}
								}
							});
		} else {
			GEvent.addListener(polygon, "click", function(latlng, index) {
				map.openInfoWindowHtml(latlng, rendererArea.renderPopup(
						aree[area['id']]));
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
		GEvent
				.addListener(
						polygon,
						"endline",
						function() {
							addAreaGeometryActive = false;
							var numVertex = polygon.getVertexCount();

							for ( var i = 0; i < numVertex; i++) {
								var vertex = polygon.getVertex(i);

								// add hidden field

								$('#form')
										.append(
												$('<input>').attr('type',
														'hidden').attr(
														'name',
														"area_coord_g"
																+ geometryId
																+ "_" + i).val(
														vertex.lat() + ','
																+ vertex.lng()));
							}
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
												var polygon = tempGeo[data['tempId']];
												polygon.setFillStyle({
													'color' : '#000000'
												});
												var vertex = Math
														.floor((polygon
																.getVertexCount() / 2) - 1);
												// center the map on highlighted
												// geometry
												map.setCenter(polygon
														.getVertex(vertex),
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
																});
												// highlight element in table
												row.children('td:first').css(
														'font-weight', 'bold');
											});

							var deleteLink = $('<a>').attr('href', '#').append(
									$('<img>').attr('src', 'imgs/delete.ico')
											.attr('alt', 'elimina').attr(
													'title', 'elimina')).click(
									function() {
										// remove from map
										var polygon = tempGeo[data['tempId']];

										map.removeOverlay(polygon);
										// remove coords
										$(
												'input[name^="area_coord_g'
														+ geometryId + '"]')
												.each(function() {
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
													.val(data['tempId'])));
							$('#area_geometries').append(row);

							// var p =
							// rendererArea.renderPopupDetails(modeEdit,data);
							// map.openInfoWindowHtml(polygon.getVertex(Math
							// .floor((numVertex / 2) - 1)), p);

							GEvent.addListener(polygon, "click", function(
									latlng, index) {
								if (index) {
									polygon.deleteVertex(index);

								} else {
									// map.openInfoWindowHtml(latlng, p);
								}
							});

							GEvent
									.addListener(
											polygon,
											"lineupdated",
											function() {
												if (saveEditMode) {
													// clean previous coords
													$(
															'input[name^="area_coord_g'
																	+ geometryId
																	+ '"]')
															.each(
																	function() {
																		$(this)
																				.remove();
																	});
													var numVertex = polygon
															.getVertexCount();

													for ( var i = 0; i < numVertex; i++) {
														var vertex = polygon
																.getVertex(i);

														// add hidden field

														$('#form')
																.append(
																		$(
																				'<input>')
																				.attr(
																						'type',
																						'hidden')
																				.attr(
																						'name',
																						"area_coord_g"
																								+ geometryId
																								+ "_"
																								+ i)
																				.val(
																						vertex
																								.lat()
																								+ ','
																								+ vertex
																										.lng()));
													}
												}
											});

						});
	}

};

Renderer_Area.prototype.editGeometryMode = function(isActive) {

	$.each(areeGeo, function() {
		$.each($(this), function(k, v) {
			if (isActive) {
				GEvent.addListener(tempGeo[v], "mouseover", function() {
					tempGeo[$(this)].enableEditing();
				});
				GEvent.addListener(tempGeo[v], "mouseout", function() {
					tempGeo[$(this)].disableEditing();
				});
			} else {
				GEvent.clearListeners(tempGeo[v], "mouseover");
				GEvent.clearListeners(tempGeo[v], "mouseout");
			}

		});
	});

};

Renderer_Area.prototype.closeDialog = function() {
	addAreaGeometryActive = false;
	$('#map').css('z-index', '0');
	if (!saveEditMode) {
		$('#area_geometries tr').each(function() {
			var id = $(this).children("td").eq(3).children('input').val();
			if (id !== "") {
				map.removeOverlay(tempGeo[id]);
			}
		});
	} else {
		saveEditMode = false;
	}
	rendererArea.resetHighlightedAreaGeometry();
	resetAreaMsgs();
	resetAreaForm();
	resetToolbar();

};
