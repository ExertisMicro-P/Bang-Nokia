
var currentUser = whoami();

//------------------------------------

/* AJAX MICROSITE JS */

//------------------------------------

function initContent() {

	var landingPage = querystring_lookup('p');
	landingPage = ((typeof (landingPage) != "undefined" && landingPage !== null) ? landingPage : "home");
	ajaxMSPage(setMSPage(landingPage), ajaxWrapper);		// check QS & load content

	// analytics event
	createGAEvent(projectName, "Landing-Page", landingPage, inSandbox);
}

//------------------------------------

// returns the full path to a page, used to provide a path the the ajax load function
// look in querysting first to jump to specific content, defaults to home.html
//
function setMSPage(requestedPage) {
	var targetPage = ((typeof (requestedPage) != "undefined" && requestedPage !== null) ? requestedPage : "home");
	var contentURL = prefixURL + targetPage + '.html';

	// analytics event
	createGAEvent(projectName, "Load-Page", targetPage, inSandbox);

	return contentURL
}

// loads the content on an html page to the target div
//
function ajaxMSPage(ajaxURL, targetDiv) {
	$.ajax({
		global: true,
		cache: false,																																// Change for live
		url: ajaxURL,																																// path to file
		dataType: 'html',
		success: function (data) {
			$('#ms-loading').fadeIn();
			$(targetDiv).html(data);																									// load content area
			initPage();																																// call function included in ajaxed content, used to assign plugins, listeners etc.

			// prefix image paths
			$(targetDiv).find('img').each(function() {
				var thisSRC = checkSRC($(this).attr('src'));
				$(this).attr('src', thisSRC);
			});

			// repair anchor tags
			$(targetDiv + ' a').each(function() {
				var thisHREF = checkHREF($(this).attr('href'));
				$(this).attr("href", thisHREF);																													// update path
				if ($(this).hasClass('act')) {																													// add click through event
					$(this).on('click', function(){
						createGAEvent(projectName, 'Click-Through', $(this).attr("href"), inSandbox);				// analytics clickthrough event
					});
				}

			});

			$('#ms-loading').fadeOut();
		}
	});
}

// listener for navigation, if the link has the appropriate data value the ajax load is called
//
$(contentWrapper).on('click', 'a', function (e) {
	if ($(this).data('target-content') != undefined) {

		if ($(this).hasClass = "external") {
			ajaxMSPage(setMSPage($(this).data('target-content')), '#ms-content');
		}
		else {
			ajaxMSPage(setMSPage($(this).data('target-content')), '#ms-content');
		}

		// flag active menu link
		if ($(this).parents('div:first').attr('id') == 'ms-nav') {
			$(contentWrapper + ' #ms-nav a').removeClass('active');
			$(this).addClass('active');
		}
	}
	else if ($(this).attr('href') == "#") {
		e.preventDefault();
	}
});

// analytics event - LoadModal
//
$(contentWrapper).on('click', '.ajax-fancybox', function (event) {
	createGAEvent(projectName, "View-Item", $(this).attr('href'), inSandbox);
});

//------------------------------------

// sticky navigation
//
var nav = $('#ms-nav');
var scrolled = false;
$(window).scroll(function () {
	if (0 < $(window).scrollTop() && !scrolled) {
		nav.addClass('sticky-nav');
		scrolled = true;
	}
	if (108 > $(window).scrollTop() && scrolled) {
		nav.removeClass('sticky-nav');
		scrolled = false;
	}
});

//------------------------------------

// utils

//------------------------------------

function checkHREF(thisHREF){

	var aHREF = thisHREF;
	var aHASH = '';
	var arrHREF;
	var response;

	if (aHREF == '#') {																																						// link managed via assignment
		response = aHREF;
	}
	else {
		if (aHREF.indexOf('http') >= 0 && aHREF.indexOf('exertismicro-p') < 0) {										// external link - don't alter
			response = aHREF;
		}
		else {
			if (aHREF.indexOf('fnFile=') >= 0) {																											// repair relative file link (deals with iCom interference)
				arrHREF = aHREF.split('fnFile=');
				aHREF = arrHREF[1];
				$(this).attr('href', aHREF);
			}
			var qsDelimiter = "?";
			if (aHREF.indexOf('?') >= 0) { qsDelimiter = "&"; }																				// detemin appropriate QS delimiter
			if (aHREF.indexOf('#') >= 0) { 																														// does the HREF contain a # value?
				arrHREF = aHREF.split('#');
				aHREF = arrHREF[0];
				aHASH = '#' + arrHREF[1];
			}
			response = aHREF + qsDelimiter + 'mscssid=' + currentUser.mscssid + aHASH;								// maintain session & add the session ID, append any # value
		}
	}
	return response;
}

function checkSRC(thisSRC){

	var imgSRC = thisSRC;

	if (inSandbox != true) {																																			// prefix image paths -  (deals with iCom interference)
		imgSRC = replaceAll(imgSRC, '/ImagesPortal/UK/localisation/4/', '');
		imgSRC = prefixURL + imgSRC;
	}
	else {																																												// standard prefix
		imgSRC = prefixURL + imgSRC;
	}

	var response = imgSRC;
	return response;
}

//------------------------------------
//# sourceURL=multipage.js