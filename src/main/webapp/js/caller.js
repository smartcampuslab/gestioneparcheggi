function Caller() {
};

// ********************** area
Caller.prototype.editArea = function(data) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'PUT',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/area/' + data['id'],
		success : function(data, textStatus, jqXHR) {
			aree[data['id']] = data;
			rendererArea.render(true, data);
			dialogArea.dialog('close');
			// reload page to refresh elements color
			location.reload();
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};
Caller.prototype.createArea = function(data) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'POST',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/area',
		success : function(data, textStatus, jqXHR) {
			rendererArea.render(true, data);
			aree[data['id']] = data;
			dialogArea.dialog('close');
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.deleteArea = function(areaId) {
	$.ajax({
		async : true,
		type : 'DELETE',
		headers : {},
		url : baseUrl + '/rest/area/' + areaId,
		success : function(data, textStatus, jqXHR) {
			rendererArea.render(false, areaId);
			delete aree[areaId];
			// reload page to refresh elements color
			location.reload();
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.getAllArea = function(modeEdit) {
	$.ajax({
		async : true,
		type : 'GET',
		headers : {},
		url : baseUrl + '/rest/area',
		success : function(data, textStatus, jqXHR) {
			$.each(data, function(key, value) {
				rendererArea.render(true, value);
				aree[value['id']] = value;
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

// ********************** parcometro

Caller.prototype.getAllParcometro = function(modeEdit) {
	$.ajax({
		async : true,
		type : 'GET',
		headers : {},
		url : baseUrl + '/rest/parcometro',
		success : function(data, textStatus, jqXHR) {
			$.each(data, function(key, value) {
				if (modeEdit || (!modeEdit && value['status'] == 'ACTIVE')) {
					parcometri[value['id']] = value;
					rendererParcometro.render(true, value);
					rendererParcometro.renderGeo(modeEdit, value, false);
				}
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.createParcometro = function(tempId, data) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'POST',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/parcometro',
		success : function(data, textStatus, jqXHR) {
			parcometri[data['id']] = data;
			parcometriGeo[data['id']] = tempGeo[tempId];
			delete tempGeo[tempId];
			rendererParcometro.render(true, data);
			rendererParcometro.updateGeo(parcometriGeo[data['id']], data);
			if (infowindow) {
				infowindow.close();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.editParcometro = function(data) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'PUT',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/parcometro/' + data['id'],
		success : function(data, textStatus, jqXHR) {
			parcometri[data['id']] = data;
			rendererParcometro.render(true, data);
			rendererParcometro.updateGeo(parcometriGeo[data['id']], data);
			if (infowindow) {
				infowindow.close();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.deleteParcometro = function(areaId, parcometroId) {
	$.ajax({
		async : true,
		type : 'DELETE',
		headers : {},
		url : baseUrl + '/rest/parcometro' + "/" + areaId + '/' + parcometroId,
		success : function(data, textStatus, jqXHR) {
			if (data) {
				parcometriGeo[parcometroId].setMap(null);
				rendererParcometro.render(false, parcometroId);
				delete parcometri[parcometroId];
				delete parcometriGeo[parcometroId];
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

// ********************** via

Caller.prototype.getAllVia = function(modeEdit) {
	$.ajax({
		async : true,
		type : 'GET',
		headers : {},
		url : baseUrl + '/rest/via',
		success : function(data, textStatus, jqXHR) {
			$.each(data, function(key, value) {
				rendererVia.render(true, value);
				rendererVia.renderGeo(modeEdit, value);
				vie[value['id']] = value;
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.createVia = function(data, tempId) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'POST',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/via',
		success : function(data, textStatus, jqXHR) {
			vie[data['id']] = data;
			vieGeo[data['id']] = tempGeo[tempId];
			delete tempGeo[tempId];
			rendererVia.updateGeo(vieGeo[data['id']], data);
			rendererVia.render(true, data);
			if (infowindow) {
				infowindow.close();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.deleteVia = function(areaId, viaId) {
	$.ajax({
		async : true,
		type : 'DELETE',
		headers : {},
		url : baseUrl + '/rest/via' + "/" + areaId + '/' + viaId,
		success : function(data, textStatus, jqXHR) {
			if (data) {
				vieGeo[viaId].setMap(null);
				rendererVia.render(false, viaId);
				delete vie[viaId];
				delete vieGeo[viaId];
				if (infowindow) {
					infowindow.close();
				}
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.editVia = function(data) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'PUT',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/via/' + data['id'],
		success : function(data, textStatus, jqXHR) {
			vie[data['id']] = data;
			rendererVia.render(true, data);
			rendererVia.updateGeo(vieGeo[data['id']], data);
			if (infowindow) {
				infowindow.close();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

// ********************** zona

Caller.prototype.getAllZona = function(modeEdit) {
	$.ajax({
		async : true,
		type : 'GET',
		headers : {},
		url : baseUrl + '/rest/zona',
		success : function(data, textStatus, jqXHR) {
			$.each(data, function(key, value) {
				rendererZona.render(true, value);
				rendererZona.renderGeo(modeEdit, value);
				zone[value['id']] = value;
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.createZona = function(data, tempId) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'POST',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/zona',
		success : function(data, textStatus, jqXHR) {
			zone[data['id']] = data;
			zoneGeo[data['id']] = tempGeo[tempId];
			delete tempGeo[tempId];
			rendererZona.updateGeo(zoneGeo[data['id']], data);
			rendererZona.render(true, data);
			if (infowindow) {
				infowindow.close();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.editZona = function(data) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'PUT',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/zona/' + data['id'],
		success : function(data, textStatus, jqXHR) {
			zone[data['id']] = data;
			rendererZona.render(true, data);
			rendererZona.updateGeo(zoneGeo[data['id']], data);
			if (infowindow) {
				infowindow.close();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.deleteZona = function(zonaId) {
	$.ajax({
		async : true,
		type : 'DELETE',
		headers : {},
		url : baseUrl + '/rest/zona' + "/" + zonaId,
		success : function(data, textStatus, jqXHR) {
			if (data) {
				zoneGeo[zonaId].setMap(null);
				rendererZona.render(false, zonaId);
				delete zone[zonaId];
				delete zoneGeo[zonaId];
				if (infowindow) {
					infowindow.close();
				}
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

// ********************** puntobici

Caller.prototype.getAllPuntobici = function(modeEdit) {
	$.ajax({
		async : true,
		type : 'GET',
		headers : {},
		url : baseUrl + '/rest/puntobici',
		success : function(data, textStatus, jqXHR) {
			$.each(data, function(key, value) {
				puntobici[value['id']] = value;
				rendererPuntobici.render(true, value);
				rendererPuntobici.renderGeo(modeEdit, value, false);
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.createPuntobici = function(tempId, data) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'POST',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/puntobici',
		success : function(data, textStatus, jqXHR) {
			puntobici[data['id']] = data;
			puntobiciGeo[data['id']] = tempGeo[tempId];
			delete tempGeo[tempId];
			rendererPuntobici.render(true, data);
			rendererPuntobici.updateGeo(puntobiciGeo[data['id']], data);
			if (infowindow) {
				infowindow.close();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.deletePuntobici = function(puntobiciId) {
	$.ajax({
		async : true,
		type : 'DELETE',
		headers : {},
		url : baseUrl + '/rest/puntobici/' + puntobiciId,
		success : function(data, textStatus, jqXHR) {
			if (data) {
				puntobiciGeo[puntobiciId].setMap(null);
				rendererPuntobici.render(false, puntobiciId);
				delete puntobici[puntobiciId];
				delete puntobiciGeo[puntobiciId];
				if (infowindow) {
					infowindow.close();
				}
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};

Caller.prototype.editPuntobici = function(data) {
	var json = JSON.stringify(data);
	$.ajax({
		async : true,
		type : 'PUT',
		headers : {},
		contentType : 'application/json',
		data : json,
		url : baseUrl + '/rest/puntobici/' + data['id'],
		success : function(data, textStatus, jqXHR) {
			puntobici[data['id']] = data;
			rendererPuntobici.render(true, data);
			rendererPuntobici.updateGeo(puntobiciGeo[data['id']], data);
			if (infowindow) {
				infowindow.close();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		}
	});
};
