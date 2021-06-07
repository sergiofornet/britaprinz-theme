/**
 * @param {Object} payload A JSON object
 * @param {string} lang Current language
 * @return {string} HTML string
 */
function catalogueEditionHTML(payload, lang) {
	const {
		title: { rendered: catalogueEdition },
		award_catalogue: catalogueUrl,
		award_catalog_gallery: catalogueGallery,
	} = payload;

	const html = `
	${catalogueUrl && catalogueHTML({ catalogueUrl, catalogueEdition, lang })}
	${catalogueGallery && catalogueGalleryHTML(catalogueGallery)}
	`;
	return html;
}

function catalogueHTML(payload) {
	const html =
		payload &&
		`<div>
			<h2>
				<p>${payload.lang === 'es' ? 'Catálogo' : 'Catalogue'}</p>
				<p>${payload.catalogueEdition}</p>
			</h2>
			<a href="${payload.catalogueUrl}">${
			payload.lang === 'es' ? 'Descargar PDF' : 'Download PDF'
		}</a>
		</div>`;
	return html;
}

function catalogueGalleryHTML(payload) {
	let images = '';
	payload.forEach((image) => {
		images += image;
	});
	const html = payload
		? `
		<div>${images}</div>
		`
		: '';
	return html;
}

export { catalogueEditionHTML };
