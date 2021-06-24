import { asyncFetchOptions } from '../util/async-fetch';
import { showAwardInfo } from './showAwardInfo';
import { awardEditionHTML } from './awardEditionHTML';
import { catalogueEditionHTML } from './catalogueEditionHTML';
import { handleReturnButton } from './awardHandlers';
// import SwiperCore, { Navigation } from 'swiper/core';
// import Swiper from 'swiper';

// import { tns } from '../../../node_modules/tiny-slider/src/tiny-slider';
// Data received from php.
const { nonce, awardUrl, type, lang } = awardPayload; // eslint-disable-line no-undef
console.log(awardPayload);
const returnButton = document.querySelector(
	'.award-edition-container__return-button'
);
// Where AJAX data will be displawed
const editionContainer = document.querySelector('.award-edition-container');

// Make first button active
const buttons = document.querySelectorAll('.edition-item__button');
buttons[0].dataset.active = true;
buttons[0].setAttribute('aria-pressed', 'true');

// Handle return button
returnButton.addEventListener(
	'click',
	() => {
		handleReturnButton(returnButton, editionContainer);
	},
	false
);
editionContainer.insertAdjacentElement('afterbegin', returnButton);

// Where gallery images will be displayed
// const awardGallery = document.querySelector('.award-gallery');
// awardGallery
// 	.querySelector('.award-gallery__close button')
// 	.addEventListener('click', () => awardGallery.classList.toggle('hidden'));

// const awardSlider = awardGallery.querySelector('.award-gallery__slider');

// console.log(awardUrl);
if (type === 'award') {
	showAwardInfo(
		buttons,
		editionContainer,
		awardUrl,
		lang,
		asyncFetchOptions(nonce, 'get'),
		awardEditionHTML
	);
} else if (type === 'catalogues') {
	showAwardInfo(
		buttons,
		editionContainer,
		awardUrl,
		lang,
		asyncFetchOptions(nonce, 'get'),
		catalogueEditionHTML
	);
}

// const slider = tns({
// 	container: '.award-gallery__slider',
// 	items: 1,
// 	slideBy: 1,
// 	mouseDrag: true,
// 	swipeAngle: false,
// 	speed: 400,
// 	autoplay: false,
// 	arrowKeys: true,
// 	center: true,
// 	// edgePadding: 20,
// 	// fixedWidth: 1500,
// 	// autoHeight: true,
// 	// viewportMax: '60%',
// 	responsive: {
// 		480: {
// 			items: 2,
// 		},
// 	},
// 	useLocalStorage: true,
// });
// SwiperCore.use([Navigation]);
// const swiper = new Swiper('.swiper-container', {
// 	// Optional parameters
// 	direction: 'horizontal',
// 	loop: true,
// 	spaceBetween: 0,
// 	centeredSlides: true,
// 	slidesPerView: 3,
// 	navigation: {
// 		nextEl: '.swiper-button-next',
// 		prevEl: '.swiper-button-prev',
// 	},
// });

// swiper.init();

// const galleryButton = document.querySelector('.catalog-gallery__toggle');
// const gallery = document.querySelector('.award-gallery');
// galleryButton.addEventListener('click', () => {
// 	if (gallery.classList.contains('hidden')) {
// 		gallery.classList.replace('hidden', 'visible');
// 	}
// });

// gallery
// 	.querySelector('.award-gallery__close button')
// 	.addEventListener('click', () =>
// 		gallery.classList.replace('visible', 'hidden')
// 	);

// window.addEventListener('keyup', (event) => {
// 	if (gallery.classList.contains('visible')) {
// 		if (event.key === 'Escape' || event.keyCode === 72) {
// 			gallery.classList.replace('visible', 'hidden');
// 		}
// 	}
// });

// window.addEventListener('resize', () => {
// 	slider.updateSliderHeight();
// });
