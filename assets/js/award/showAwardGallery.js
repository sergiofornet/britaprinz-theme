import Slider from '../lib/prototypes/slider';
import { HandleScroll } from '../util/util';

function showAwardGallery(payload) {
	if (payload === null) return;

	const { event, images } = payload;
	const { image: imageId } = event.currentTarget.dataset;

	const handleScroll = new HandleScroll();

	const target = document.querySelector('.artwork-gallery');
	const targetSlider = target.querySelector('.artwork-gallery__slider');
	targetSlider.innerHTML = '';
	targetSlider.insertAdjacentHTML(
		'afterbegin',
		`
		<div class="slides">
		<figure class="slide">${
			images
				.filter((image) => image.id === imageId)
				.map((image) => image.rendered)[0]
		}</figure>
		</div>
		`
	);

	const slider = new Slider(targetSlider, false, true);

	document.body.classList.toggle('no-scroll');
	handleScroll.enable();
	target.classList.toggle('hidden');
}

export { showAwardGallery };
