
var currentUser = whoami();

//------------------------------------

/* SINGLE PAGE MICROSITE JS */

//------------------------------------

function initPage() {

	// smooth scroll
	$('#ms-nav').onePageNav({
		currentClass: 'current',
		changeHash: false,
		scrollSpeed: 750,
		scrollOffset: 30,
		scrollThreshold: 0.5,
		filter: '',
		easing: 'swing'
	});

	// check image paths
	$(contentWrapper + ' img').each(function() {
		var thisSRC = checkSRC($(this).attr('src'));
		$(this).attr('src', thisSRC);
	});

	// check anchor tags
	$(contentWrapper + ' a').each(function() {
		var thisHREF = checkHREF($(this).attr('href'));
		$(this).attr("href", thisHREF);																																	// update path
		if ($(this).hasClass('act')) {																																	// add click through event
			$(this).on('click', function () {
				createGAEvent(projectName, 'Click-Though', $(this).attr("href"), inSandbox);								// analytics clickthrough event
			});
		}
	});

	var landingPage = querystring_lookup('ms-p');
	landingPage = ((typeof (landingPage) != "undefined" && landingPage !== null) ? landingPage : "home");
	createGAEvent(projectName, 'Landing-Page', landingPage, inSandbox);																// analytics landing event

}

//------------------------------------

// sticky navigation
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
//# sourceURL=single-page.js