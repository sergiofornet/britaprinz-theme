import { asyncFetchOptions } from '../util/async-fetch';
import { showAwardInfo } from './showAwardInfo';
import { awardEditionHTML } from './awardEditionHTML';
import { catalogueEditionHTML } from './catalogueEditionHTML';
console.log(awardPayload);

// Data received from php.
const { nonce, awardUrl, type, lang } = awardPayload; // eslint-disable-line no-undef

const editionContainer = document.querySelector('.edition-container');
const buttons = document.querySelectorAll('.edition-item__button');
const awardGallery = document.querySelector('.award-gallery');
awardGallery
	.querySelector('.award-gallery__close button')
	.addEventListener('click', () => awardGallery.classList.toggle('hidden'));

const awardSlider = awardGallery.querySelector('.award-gallery__slider');

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
