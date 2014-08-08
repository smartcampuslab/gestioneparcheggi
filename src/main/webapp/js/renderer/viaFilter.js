function Renderer_ViaFilter() {
};

Renderer_ViaFilter.prototype.render = function(container) {
	container.empty();
	var fieldset = $('<fieldset></fieldset>');
	fieldset.append($('<label></label>').attr('for', 'filter-via-street').text(
			'Strada di riferimento'));
	fieldset.append($('<input></input>').attr('type', 'text').attr('name',
			'filter-via-street').val(((filterCache['via']['streetReference']) ? filterCache['via']['streetReference'] : '')));
	fieldset.append($('<label></label>').attr('for', 'filter-via-area').text(
			'Area'));
	var selectArea = $('<select></select>').attr('name', 'filter-via-area');
	selectArea.append($('<option></option>').attr('value', '').text(''));
	$.each(aree, function(key, value) {
		var option = $('<option></option').attr('value', this['id']).text(
				this['name']);
		if(filterCache['via']['area'] && filterCache['via']['area'] == this['id']){
			option.attr('selected','selected');
		}
		selectArea.append(option);
	});
	fieldset.append(selectArea);

	container.append(fieldset);

};
