
function assignModal(targetDiv) {

	$(targetDiv).fancybox({
		'width': '900',
		'height': '600',
		'autoScale': true,
		'autoDimensions': true,
		'overlayColor': '#000',
		'scrolling': 'auto',
		'type': 'ajax',
		'ajax': {
			dataFilter: function (data) {

				var response = $(data).find('#modal-content')[0];
				$(response).find('a').each(function () {

					// check href
					var thisHREF = checkHREF($(this).attr('href'));
					$(this).attr("href", thisHREF);

					// modify onclick event
					$(this).on('click', function (e) {
						createGAEvent(projectName, 'Click-Though', $(this).attr("href"), inSandbox);														// analytics clickthrough event
						window.location.href = $(this).attr("href");																								// set modal a tags to affect the parent window
						e.preventDefault();
					});
				});

				// prefix image paths
				$(response).find('img').each(function() {
					var thisSRC = checkSRC($(this).attr('src'));
					$(this).attr('src', thisSRC);
				});

				return $(response);
			}
		}
	});

	$(".fancybox").fancybox({
		'width': '900',
		'height': '600',
		'overlayColor': '#000'
	});

}