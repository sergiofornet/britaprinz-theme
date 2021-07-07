import { showAwardGallery } from './showAwardGallery';

function galleryImage(payload) {
	if (payload === null) return;

	const images = payload.map((prize) => ({
		id: prize.bp_award_image,
		rendered: prize.bp_award_image_rendered,
	}));

	const imageTriggers = document.querySelectorAll('.prize__image button');

	imageTriggers.forEach((trigger) =>
		trigger.addEventListener('click', (event) =>
			showAwardGallery({ event, images })
		)
	);
}

export { galleryImage };
