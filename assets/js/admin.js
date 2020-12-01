const $doc = jQuery(document);
const $win = jQuery(window);

$doc.ready(function () {
	$win.on('YoastSEO:ready', function () {
		new CarbonFieldsYoast();
	});
});
