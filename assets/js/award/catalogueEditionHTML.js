import { handleReturnButton } from './awardHandlers';
import { catalogueGalleryHTML, setCatalogueGallery } from './catalogueGallery';

/**
 * @param {Object} payload A JSON object
 * @param {HTMLElement} target
 * @param {string} lang Current language
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

	setCatalogueGallery('.catalogue__gallery');
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
				${catalogueGalleryHTML(payload.catalogueGallery)}
			</div>
		</article>`;
	return html;
}

export { catalogueEditionHTML };
