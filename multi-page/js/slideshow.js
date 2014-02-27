
function assignSlideshow(targetDiv) {

	// banner
	$(targetDiv).flexslider({
		animation: "fade",
		slideshow: true,										//Boolean: Animate slider automatically
		slideshowSpeed: 5000,								//Integer: Set the speed of the slideshow cycling, in milliseconds
		animationSpeed: 600,								//Integer: Set the speed of animations, in milliseconds
		initDelay: 0,
		controlNav: false,									//Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
		directionNav: true,
		pauseOnAction: true,								//Boolean: Pause the slideshow when interacting with control elements, highly recommended.
		pauseOnHover: true,									//Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
		useCSS: true,												//{NEW} Boolean: Slider will use CSS3 transitions if available
		touch: true,												//{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
		mousewheel: true,
		keyboard: true
	});

	$('.slides li:first').addClass("flex-active-slide");

	// bg images
	$('.flex-direction-nav a').css('background-image', 'url(' + prefixURL + 'img/sprite.png)');

	// analytics event
	$('.slides a').on('click', function() {
		createGAEvent(projectName, 'Click-Though', $(this).attr("href"), inSandbox);														// analytics clickthrough event
	});

}