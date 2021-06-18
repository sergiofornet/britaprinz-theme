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
			(event) => {
				target.classList.contains('loaded')
					? target.classList.replace('loaded', 'loading')
					: target.classList.add('loading');
				// Check if button is inactive
				if (
					event.currentTarget.classList.contains(
						'edition-item__button--inactive'
					)
				) {
					// Search for active button
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
					target.innerHTML = '';
					// Toggle target loading state
					target.classList.contains('loading') &&
						target.classList.replace('loading', 'loaded');
					event.currentTarget.classList.replace(
						'edition-item__button--active',
						'edition-item__button--inactive'
					);
					button.setAttribute('aria-pressed', 'false');
				}
			},
			false
		);
	});
	return awardHtml;
}

export { showAwardInfo };
