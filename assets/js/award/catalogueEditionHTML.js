// import { tns } from '../../../node_modules/tiny-slider/src/tiny-slider';

import { handleReturnButton } from './awardHandlers';

/**
 * @param {Object} payload A JSON object
 * @param target
 * @param {string} lang Current language
 * @return {string} HTML string
 */
function catalogueEditionHTML(payload, target, lang) {
	const {
		title: { rendered: catalogueEdition },
		award_catalogue: catalogueUrl,
		award_catalog_gallery: catalogueGallery,
		award_catalog_cover: catalogueCover,
		id,
	} = payload;

	const html = `
	${
		catalogueUrl &&
		catalogueHTML({
			catalogueUrl,
			catalogueEdition,
			catalogueGallery,
			lang,
			catalogueCover,
			id,
		})
	}
	`;

	target.innerHTML = '';
	target.insertAdjacentHTML('afterbegin', html);

	const returnButton = document.createElement('button');
	returnButton.classList.add('award-edition-container__return-button');
	returnButton.classList.add('return-button');
	returnButton.setAttribute('aria-pressed', 'false');
	returnButton.innerHTML = '<';
	returnButton.addEventListener(
		'click',
		() => {
			handleReturnButton(returnButton, target);
		},
		false
	);
	target.insertAdjacentElement('afterbegin', returnButton);
	// catalogueGalleryHTML(catalogueGallery, id);
}

function catalogueHTML(payload) {
	const html =
		payload &&
		`<article id="post-${payload.id}">
			<div class="entry-content catalogue">
				<h1 class="catalogue__title">
					<p>${payload.lang === 'es' ? 'Catálogo' : 'Catalogue'}</p>
					<p>${payload.catalogueEdition}</p>
				</h1>
				${
					payload.catalogueCover
						? `<figure class="catalogue__cover">${payload.catalogueCover}</figure>`
						: ``
				}
				<div class="catalogue__link">
					<a href="${payload.catalogueUrl}">
						${payload.lang === 'es' ? 'Descargar PDF' : 'Download PDF'}
					</a>
				</div>
				${
					payload.catalogueGallery.length
						? `<div class="catalogue__gallery-toggle">
							<button class="gallery-toggle">${
								payload.lang === 'es'
									? 'Ver catálogo'
									: 'View catalog'
							}</button>
						</div>`
						: ``
				}
			</div>
		</article>`;
	return html;
}

function catalogueGalleryHTML(catalogImages, id) {
	if (catalogImages.length === 0) {
		console.log('no images');
		return;
	}
	let images = '';
	catalogImages.forEach((image) => {
		images += `<div><figure>${image}</figure></div>`;
	});
	const html = catalogImages
		? `
		<div class="award-gallery__slider">${images}</div>
		`
		: '';

	const galleryContainer = document.querySelector('.award-gallery');
	const galleryToggle = document.querySelector('.gallery-toggle');
	galleryToggle.addEventListener('click', () => {
		if (id !== parseInt(galleryContainer.dataset.edition)) {
			console.log(typeof id, typeof galleryContainer.dataset.edition);
			console.log('change');
			galleryContainer.dataset.edition = id;
			galleryContainer.querySelector('.tns-outer').remove();
			galleryContainer.insertAdjacentHTML('beforeend', html);
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
			// 	// autoHeight: true,
			// 	responsive: {
			// 		480: {
			// 			items: 2,
			// 		},
			// 	},
			// });
			// console.log(slider.getInfo());
		}
		galleryContainer.classList.replace('hidden', 'visible');
	});
}

export { catalogueEditionHTML };
