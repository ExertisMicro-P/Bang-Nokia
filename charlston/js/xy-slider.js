
//------------------------------------

/* xy slider | jquery plugin */

//------------------------------------

jQuery.fn.xySlider = function() {

	var viewport_dimensions;

	if ($(this).hasClass('xy-slider')) {
		//plugin is being re run due to redraw triggering doc ready script
	} else {

		var options = (typeof arguments[0] != 'object') ? {} : arguments[0];
		var ID = $(this).attr('id');

		$(this).addClass('xy-slider');
		$(this).wrapInner('<div class="xy-slider-viewport-content-wrapper">');
		$(this).children(':last').after('<div class="xy-slider-menu" id="xy-slider-menu-' +  ID + '"></div>');
		$(this).children('.xy-slider-viewport-content-wrapper').wrap('<div class="xy-slider-viewport">');

		// assign slides class & ids
		$('#' + ID + ' > div > div > div').addClass('xy-slider-slide');
		$('#' + ID + ' .xy-slider-slide').each(function(index) {
			$(this).attr('id','slide-' + index);
		});

		// get dimensions
		viewport_dimensions = this.xySlider_getViewportDimensions(ID);

		// setup navigation
		this.xySlider_createMenu(options,ID,viewport_dimensions);

		// set backgrounds
		this.xySlider_setBackgrounds(options,ID);

		// set as display
		this.css('display','block');

		// assign click event listner for menu items
		$('#xy-slider-menu-' +  ID + ' .slide-nav').live('click', (function() {

			var target_index = parseInt($(this).attr('id').replace('slide-', ''));
			var target_slider = $(this).parents('div:first').attr('id').replace('xy-slider-menu-', '');

			jQuery.fn.xySlider_changeSlide(target_index,target_slider,viewport_dimensions);

		}));

		//simulate navigation within slider click
		var selected_slide = getQSVars('slide');
		if (selected_slide != '' && typeof(selected_slide) != 'undefined') {
			if ($('#slide-' + selected_slide).length > 0) {
				$('#slide-' + selected_slide + '.slide-nav').trigger('click');				// move to slide within section
			}
		}
		
		// analytics event
		createGAEvent(projectName, 'Landing-Page', 'Homepage', inSandbox);
	}
};

//------------------------------------

jQuery.fn.xySlider_createMenu = function(o,slider_root_id,slide_dimensions) {

	var menu_html = "";
	var menu_items_arr = new Array();
	var no_of_menu_items;
	var menu_item_width;

	no_of_menu_items = 0;

	// create menu data array / skip blank titles
	for(i=0 ; i < o.titles.length ; i++) {
		if (o.titles[i] != 'HIDE'){
			// keep title / target slide relationship
			menu_items_arr[no_of_menu_items] = {title:o.titles[i],target:(i)};
			no_of_menu_items++;
		}
	}

	// create menu html
	for(i=0 ; i < menu_items_arr.length ; i++) {
		if ((i+1) == menu_items_arr.length){ // add .last to last menu div...
			menu_html = menu_html + '<li><div id="slide-' + menu_items_arr[i].target + '" class="slide-nav last">' + menu_items_arr[i].title + '</div></li>';
		} else{
			menu_html = menu_html + '<li><div id="slide-' +  menu_items_arr[i].target + '" class="slide-nav">' +  menu_items_arr[i].title + '</div></li>';
		}
	}

	// write html to nav div
	menu_html = '<ul>' + menu_html + '</ul>';
	$('#' + slider_root_id + ' .xy-slider-menu').html(menu_html);

	// set nav item widths
	menu_item_width = parseInt(slide_dimensions.width / no_of_menu_items);
	//menu_item_width = parseInt(viewport_dimensions.width / no_of_menu_items);
	$('#' + slider_root_id + ' .xy-slider-menu .slide-nav').css('width', menu_item_width - 1);
	$('#' + slider_root_id + ' .xy-slider-menu .slide-nav.last').css('width', menu_item_width);

	// set font size
	if (no_of_menu_items > 5) {
		$('#' + slider_root_id + ' .xy-slider-menu .slide-nav').css('font-size','9pt');
	}
	if (no_of_menu_items > 6) {
		$('#' + slider_root_id + ' .xy-slider-menu .slide-nav').css('font-size','8pt');
	}
	if (no_of_menu_items > 7) {
		$('#' + slider_root_id + ' .xy-slider-menu .slide-nav').css('font-size','7pt');
	}
	if(no_of_menu_items < 7) {
		$('#' + slider_root_id + ' .xy-slider-menu').css('background','url(' + prefixURL + 'img/base-menu-' + no_of_menu_items + '.gif)');
	} else {
		$('#' + slider_root_id + ' .xy-slider-menu').css('background','url(' + prefixURL + 'img/base-menu-0.gif)');
	}
};

//------------------------------------

jQuery.fn.xySlider_setBackgrounds = function(o,slider_root_id) {

	for(j=0; j < o.images.length; j++) {
		if (o.images[j] != ''){
			$('#' + slider_root_id + ' .xy-slider-slide#slide-' + (j)).css('background-image', 'url(' + prefixURL + o.images[j] + ')');
		}
	}

};

//------------------------------------

jQuery.fn.xySlider_changeSlide = function(slide_int,target_slider,slide_dimensions) {

	var target_slider;
	var x_axis;
	var y_axis;

	// get requested slide location
	switch(parseInt(slide_int)) {
	case 0:
		x_axis = "0px";
		y_axis = "-0px";
		break;

	case 1:
		x_axis = "-" + slide_dimensions.width + "px";
		y_axis = "-0px";
		break;

	case 2:
		x_axis = "0px";
		y_axis = "-" + slide_dimensions.height + "px";
		break;

	case 3:
		x_axis = "-" + slide_dimensions.width + "px";
		y_axis = "-" + slide_dimensions.height + "px";
		break;

	case 4:
		x_axis = "0px";
		y_axis = "-" + (slide_dimensions.height * 2) + "px";
		break;

	case 5:
		x_axis = "-" + slide_dimensions.width + "px";
		y_axis = "-" + (slide_dimensions.height * 2) + "px";
		break;

	case 6:
		x_axis = "0px";
		y_axis = "-" + (slide_dimensions.height * 3) + "px";
		break;

	case 7:
		x_axis = "-" + slide_dimensions.width + "px";
		y_axis = "-" + (slide_dimensions.height * 3) + "px";
		break;

	case 8:
		x_axis = "-0px";
		y_axis = "-" + (slide_dimensions.height * 4) + "px";
		break;

	case 9:
		x_axis = "-" + slide_dimensions.width + "px";
		y_axis = "-" + (slide_dimensions.height * 4) + "px";
		break;

	case 10:
		x_axis = "0px";
		y_axis = "-" + (slide_dimensions.height * 5) + "px";
		break;

	case 11:
		x_axis = "-" + slide_dimensions.width + "px";
		y_axis = "-" + (slide_dimensions.height * 5) + "px";
		break;
	}

	var slider_menu_id = 'xy-slider-menu-' + target_slider;

	// highlight nav btn
	$('#' + slider_menu_id + ' .slide-nav').removeClass("active_link");
	$('#' + slider_menu_id + ' #slide-' + slide_int).addClass("active_link");

	// move to slide
	$('#' + target_slider + ' .xy-slider-viewport-content-wrapper').delay(100).animate( {top:y_axis,left:x_axis}, 1000, 'easeOutCubic' );

	// analytics event
	var target_slide_name = $('#' + slider_menu_id + '	#slide-' + slide_int).html();
	if (typeof(target_slide_name) != "undefined" && target_slide_name !== null) {
		createGAEvent(projectName, 'Load-Page', target_slide_name, inSandbox);
	}
};

//------------------------------------

jQuery.fn.xySlider_getViewportDimensions = function(slider_root_id) {

	var xys_width;
	var xys_height;

	if ($('#' + slider_root_id + ' .xy-slider').length != 0){

		xys_width = $('#' + slider_root_id + '.xy-slider').css('width');
		xys_width = parseInt(xys_width.replace('px', ''));

		xys_height = $('#' + slider_root_id + ' .xy-slider-viewport').css('height');
		xys_height = parseInt(xys_height.replace('px', ''));

		return {width:xys_width,height:xys_height};
	}	else {
		return {width:960,height:470};
	}

};


//------------------------------------
//# sourceURL=xy-slider.js