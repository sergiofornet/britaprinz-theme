import wait from 'waait';
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
		button.setAttribute('aria-pressed', 'false');
		button.addEventListener(
			'click',
			async (event) => {
				// Check if presed button is inactive
				if (event.currentTarget.dataset.active === 'false') {
					target.dataset.state = 'loading';
					target.parentElement.dataset.state = 'loading';
					// Search for an active button
					if (
						document.querySelector(
							'.edition-item__button[data-active="true"]'
						)
					) {
						// Make active button inactive
						document.querySelector(
							'.edition-item__button[data-active="true"]'
						).dataset.active = false;
					}
					// Fetch AJAX data
					asyncFetch(
						`${ajaxUrl}/${event.currentTarget.dataset.edition}`,
						options
					).then((jsonResponse) => {
						callback(jsonResponse, target, lang);
						// Toggle target loading state
						target.dataset.state = 'loaded';
						target.parentElement.dataset.state = 'loaded';
					});
					// Make current button active
					event.currentTarget.dataset.active = true;
					button.setAttribute('aria-pressed', 'true');
				} else {
					// If pressed button is already active
					// Make it inactive
					event.currentTarget.dataset.active = false;
					button.setAttribute('aria-pressed', 'false');
					// Change target loading state
					target.dataset.state = 'unloading';
					target.parentElement.dataset.state = 'unloading';
					// Wait half a second
					await wait(500);
					// Change target loading state
					target.dataset.state = 'unloaded';
					target.parentElement.dataset.state = 'unloaded';
					// Empty target container
					target.innerHTML = '';
				}
			},
			false
		);
	});
	return awardHtml;
}

export { showAwardInfo };
