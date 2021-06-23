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
				if (
					event.currentTarget.classList.contains(
						'edition-item__button--inactive'
					)
				) {
					target.classList.contains('loaded')
						? target.classList.replace('loaded', 'loading')
						: target.classList.replace('unloaded', 'loading');
					// Search for an active button
					if (
						document.querySelector('.edition-item__button--active')
					) {
						// Make active button inactive
						document
							.querySelector('.edition-item__button--active')
							.classList.replace(
								'edition-item__button--active',
								'edition-item__button--inactive'
							);
					}
					// Fetch AJAX data
					asyncFetch(
						`${ajaxUrl}/${event.currentTarget.dataset.edition}`,
						options
					).then((jsonResponse) => {
						callback(jsonResponse, target, lang);
						// Toggle target loading state
						target.classList.contains('loading') &&
							target.classList.replace('loading', 'loaded');
					});
					// Make current button active
					event.currentTarget.classList.replace(
						'edition-item__button--inactive',
						'edition-item__button--active'
					);
					button.setAttribute('aria-pressed', 'true');
				} else {
					// If pressed button is already active
					// Make it inactive
					event.currentTarget.classList.replace(
						'edition-item__button--active',
						'edition-item__button--inactive'
					);
					button.setAttribute('aria-pressed', 'false');
					// Toggle target loading state
					target.classList.replace('loaded', 'unloading');
					// Wait half a second
					await wait(500);
					// Toggle target loading state
					target.classList.replace('unloading', 'unloaded');
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
