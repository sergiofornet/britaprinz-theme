import { asyncFetch } from '../util/async-fetch';

/**
 * Outputs Award info.
 *
 * @param {NodeList} triggers An object containing button triggers.
 * @param {Node} target Where the info will be printed in.
 * @param {string} ajaxUrl The REST API endpoint
 * @param {Object} options
 * @param {string} lang
 * @param {callback} callback The function that will generate the content
 * @return {string} Returns HTML string containing Award edition info.
 */
function showAwardInfo(triggers, target, ajaxUrl, lang, options, callback) {
	const awardHtml = '';
	triggers.forEach((button) => {
		button.addEventListener(
			'click',
			(event) => {
				target.classList.add('loading');
				asyncFetch(
					`${ajaxUrl}/${event.currentTarget.dataset.edition}`,
					options
				).then((jsonResponse) => {
					target.innerHTML = '';
					target.insertAdjacentHTML(
						'afterbegin',
						callback(jsonResponse, lang)
					);
					target.classList.contains('loading') &&
						target.classList.replace('loading', 'loaded');
				});
			},
			false
		);
	});
	return awardHtml;
}

export { showAwardInfo };
