function Renderer_ParcometroFilter() {
};

Renderer_ParcometroFilter.prototype.render = function(container) {
	container.empty();
	var fieldset = $('<fieldset></fieldset>');
	fieldset.append($('<label></label>').attr('for', 'filter-parc-code').text(
			'Codice'));
	fieldset.append($('<input></input>').attr('type', 'text').attr('name',
			'filter-parc-code').val(((filterCache['parcometro']['code']) ? filterCache['parcometro']['code'] : '')));
	fieldset.append($('<label></label>').attr('for', 'filter-parc-area').text(
			'Area'));
	var selectArea = $('<select></select>').attr('name', 'filter-parc-area');
	selectArea.append($('<option></option>').attr('value', '').text(''));
	$.each(aree, function(key, value) {
		var option = $('<option></option').attr('value', this['id']).text(
				this['name']);
		if(filterCache['parcometro']['area'] && filterCache['parcometro']['area'] == this['id']){
			option.attr('selected','selected');
		}
		selectArea.append(option);
	});
	fieldset.append(selectArea);
	fieldset.append($('<label></label>').attr('for', 'filter-parc-status')
			.text('Stato'));
	var selectStatus = $('<select></select>')
			.attr('name', 'filter-parc-status');
	selectStatus.append($('<option></option>').attr('value', '').text(''));
	$.each(parcometroStatus, function(key, value) {
		var option =$('<option></option').attr('value', key)
		.text(value);
		if(filterCache['parcometro']['status'] && filterCache['parcometro']['status'] == key){
			option.attr('selected','selected');
		}
		selectStatus.append(option);
	});
	fieldset.append(selectStatus);

	container.append(fieldset);

};
