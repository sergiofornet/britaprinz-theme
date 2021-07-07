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
 * Set a custom property containing admin bar's height
 *
 * @param {HTMLElement} adminBar - admin bar element
 */
const setAdminBarHeight = (adminBar) =>
	document.documentElement.style.setProperty(
		'--wp-admin-bar',
		`${adminBar.getBoundingClientRect().height}px`
	);

/**
 * Get the actual scrollbar width
 *
 */
function getSrollbarWidth() {
	const scrollbarWidth =
		window.innerWidth - document.documentElement.clientWidth;
	return scrollbarWidth;
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

function HandleScroll() {
	this.body = document.querySelector('body');
	this.scrollPosition = 0;
}
HandleScroll.prototype.enable = function () {
	this.scrollPosition = window.pageYOffset;
	this.body.style.overflow = 'hidden';
	this.body.style.position = 'fixed';
	this.body.style.top = `-${this.scrollPosition}px`;
	this.body.style.width = '100%';
};
HandleScroll.prototype.disable = function () {
	this.body.style.removeProperty('overflow');
	this.body.style.removeProperty('position');
	this.body.style.removeProperty('top');
	this.body.style.removeProperty('width');
	window.scrollTo(0, this.scrollPosition);
};

export {
	toggleButtonState,
	getHeight,
	handleVhValue,
	setAdminBarHeight,
	getSrollbarWidth,
	asyncCreateImage,
	HandleScroll,
};
