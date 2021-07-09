import { tns } from '../../../node_modules/tiny-slider/src/tiny-slider';

function catalogueGalleryHTML(catalogImages) {
	if (catalogImages.length === 0) {
		console.log('no images');
		return '';
	}

	let images = '';
	catalogImages.forEach((image) => {
		images += `<div class="tns-slide"><figure>${image}</figure></div>`;
	});
	const html = catalogImages
		? `
		<div class="catalogue-container">
			<button class="previous-slide"><</button>
			<button class="next-slide">></button>
			<div class="catalogue__gallery">
				${images}
			</div>
		</div>
		`
		: '';
	return html;
}

function setCatalogueGallery(selector) {
	const container = document.querySelector(selector);
	if (container === null) return;
	const prevButton = document.querySelector('.previous-slide');
	const nextButton = document.querySelector('.next-slide');
	const slider = tns({
		container,
		items: 2,
		slideBy: 1,
		mouseDrag: false,
		Arrowkeys: true,
		swipeAngle: false,
		speed: 500,
		autoplay: false,
		arrowKeys: true,
		rewind: true,
		fixedWidth: 250,
		prevButton,
		nextButton,
		nav: false,
		responsive: {
			480: {
				fixedWidth: 500,
			},
		},
	});
}

export { catalogueGalleryHTML, setCatalogueGallery };
