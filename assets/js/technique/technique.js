import Slider from '../lib/prototypes/slider';

const sliderContainer = document.querySelector('.artwork-gallery__slider');
const slider = new Slider(sliderContainer);

const galleryButton = document.querySelector('.related-artworks__toggle');
const gallery = document.querySelector('.artwork-gallery');
galleryButton.addEventListener('click', () => {
	if (gallery.classList.contains('hidden')) {
		gallery.classList.replace('hidden', 'visible');
		document.body.classList.toggle('no-scroll');
	}
});

gallery
	.querySelector('.artwork-gallery__close button')
	.addEventListener('click', () => {
		gallery.classList.replace('visible', 'hidden');
		document.body.classList.toggle('no-scroll');
	});

window.addEventListener('keyup', (event) => {
	if (gallery.classList.contains('visible')) {
		if (event.key === 'Escape' || event.keyCode === 72) {
			gallery.classList.replace('visible', 'hidden');
		}
		if (event.key === 'ArrowRight' || event.keyCode === 39) {
			slider.move();
		}
		if (event.key === 'ArrowLeft' || event.keyCode === 37) {
			slider.move('back');
		}
	}
});
