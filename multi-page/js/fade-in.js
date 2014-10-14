
function assignFadeIn(targetDiv) {

	// Fade in 3rd +
	tiles = $(targetDiv + " .section:gt(2)").fadeTo(0, 0);
	$(window).scroll(function (d, h) {
		tiles.each(function (i) {
			a = $(this).offset().top + $(this).height();
			b = $(window).scrollTop() + $(window).height();
			if (a < b) $(this).fadeTo(500, 1);
		});
	});

}