/**
 * Handles active/inactive state on buttons
 *
 * @param {NodeList} buttons Buttons object
 * @param {string} activeState Active state class
 * @param {string} inactiveState Inactive state class
 * @param target
 */
function toggleButtonState(buttons, activeState, inactiveState, target) {
	buttons.forEach((button) => {
		button.setAttribute('aria-pressed', 'false');
		button.addEventListener('click', (event) => {
			if (event.currentTarget.classList.contains(inactiveState)) {
				if (document.querySelector(`.${activeState}`)) {
					document
						.querySelector(`.${activeState}`)
						.classList.replace(activeState, inactiveState);
				}
				event.currentTarget.classList.replace(
					inactiveState,
					activeState
				);
				button.setAttribute('aria-pressed', 'true');
			} else {
				target.innerHTML = '';
				event.currentTarget.classList.replace(
					activeState,
					inactiveState
				);
				button.setAttribute('aria-pressed', 'false');
			}
		});
	});
}

/**
 * Get the computed size of an element
 *
 * @param {HTMLElement} element - html element
 * @return {number} element computed height
 */
function getHeight(element) {
	return element.offsetHeight;
}

function handleVhValue() {
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Create an image asynchronously
 *
 * @param {string} src Our image url
 * @return {Promise} A promise of a new image HTMLElement
 */
async function asyncCreateImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

export { toggleButtonState, getHeight, handleVhValue, asyncCreateImage };
