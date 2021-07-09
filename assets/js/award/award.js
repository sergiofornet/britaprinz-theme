import wait from 'waait';
import { asyncFetchOptions } from '../util/async-fetch';
import { showAwardInfo } from './showAwardInfo';
import { awardEditionHTML } from './awardEditionHTML';
import { catalogueEditionHTML } from './catalogueEditionHTML';
import { handleReturnButton } from './awardHandlers';
import { HandleScroll } from '../util/util';

// Data received from php.
const { nonce, awardUrl, type, lang } = awardPayload; // eslint-disable-line no-undef
const returnButton = document.querySelector(
	'.award-edition-container__return-button'
);
// Where AJAX data will be displawed
const editionContainer = document.querySelector('.award-edition-container');

// Make first button active
const buttons = document.querySelectorAll('.edition-item__button');
buttons[0].dataset.active = true;
buttons[0].setAttribute('aria-pressed', 'true');

// Animate first load
const awardContainer = document.querySelector('.award-container');
async function fakeButtonPress() {
	await wait(1500);
	awardContainer.dataset.state = 'loaded';
}
document.addEventListener('DOMContentLoaded', fakeButtonPress, false);

// Handle return button
returnButton.addEventListener(
	'click',
	() => {
		handleReturnButton(returnButton, editionContainer);
	},
	false
);
editionContainer.insertAdjacentElement('afterbegin', returnButton);

if (type === 'award') {
	// Where gallery images will be displayed
	const awardGallery = document.querySelector('.artwork-gallery');
	const handleScroll = new HandleScroll();
	awardGallery
		.querySelector('.artwork-gallery__close button')
		.addEventListener('click', () => {
			awardGallery.classList.toggle('hidden');
			document.body.classList.toggle('no-scroll');
			handleScroll.disable();
		});

	showAwardInfo(
		buttons,
		editionContainer,
		awardUrl,
		lang,
		asyncFetchOptions(nonce, 'get'),
		awardEditionHTML,
		type
	);
} else if (type === 'catalogues') {
	showAwardInfo(
		buttons,
		editionContainer,
		awardUrl,
		lang,
		asyncFetchOptions(nonce, 'get'),
		catalogueEditionHTML,
		type
	);
}
