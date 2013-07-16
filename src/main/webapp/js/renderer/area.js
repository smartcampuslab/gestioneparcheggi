function Renderer_Area() {
};

Renderer_Area.prototype.renderDetails = function(data) {
	var detail = '<table class="details">' 
		+ '<tr><td>'+areaLabels['fee']+'</td><td> ' + data['fee'].toFixed(2)
			+ ' euro/ora</td></tr>' + '<tr><td>'+areaLabels['timeSlot']+'</td><td>' + data['timeSlot']
			+ '</td></tr>' + '<tr><td>'+areaLabels['smsCode']+'</td><td>' + data['smsCode'] + '</td></tr>'
			+ '<tr><td>'+areaLabels['color']+'</td><td> ' +'<div class="color-div" style="background-color: #'+data['color']+';"></div>'
			+ '</td></tr></table>' + '<hr />'
			+ '<a href="#" onclick="loadAreaEditForm(\'' + data['id']
			+ '\');">Modifica</a> ' + '<a href="#" onclick="removeArea(\''
			+ data['id'] + '\')">Elimina</a>';
	return detail;
};

Renderer_Area.prototype.renderPopupDetails = function(data) {
	var detail = '<fieldset class="popup"><legend class="popup">'+data['name']+'</legend>'+
	'<p class="title-popup">'+areaLabels['fee']+'</p> ' + data['fee'].toFixed(2)
	+ ' euro/ora' + '<p class="title-popup">'+areaLabels['timeSlot']+'</p>' + data['timeSlot'].replace(/\n/g,'<br/>')
	+ '<p class="title-popup">'+areaLabels['smsCode']+'</p>' + data['smsCode']; 
	+'</fieldset>';
	return detail;
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
			action.append($('<img></img>').attr('src','imgs/details.ico')).attr('alt','dettagli').attr('title','dettagli');
			action.attr('href', '#');
			action.click(function() {
				div.toggle("slow");
			});
			var div = $('<div></div>');
			div.attr('id', 'area-info_' + data['id']);
			div.addClass('area-detail');
			div.html(rendererArea.renderDetails(data));

			li.append($('<td></td>').attr('width', '90%').append(span).append(div));
			li.append($('<td></td>').attr('width', '10%').css('vertical-align','top').append(action));

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
