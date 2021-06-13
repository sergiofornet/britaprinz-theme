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

(function () {
	const wpAdminBar = document.querySelector('#wpadminbar');
	if (wpAdminBar) {
		setAdminBarHeight(wpAdminBar);
		window.addEventListener('resize', () => {
			setAdminBarHeight(wpAdminBar);
		});
	}

	// Set a custom property with th eactual width of the scrollbar
	document.documentElement.style.setProperty(
		'--scrollbar-width',
		`${getSrollbarWidth()}px`
	);

	// Toggle search form's visibility
	// const searchButton = document.querySelector('.search-button');
	// const searchDiv = document.querySelector('.search-div');
	// const searchDivHide = searchDiv.querySelector('.search-div__close');

	// function showSearch() {
	// 	searchDiv.classList.toggle('visible');
	// 	document.body.classList.toggle('no-scroll');

	// 	if ( searchButton.getAttribute( 'aria-expanded' ) === 'true' ) {
	// 		searchButton.setAttribute( 'aria-expanded', 'false' );
	// 	} else {
	// 		searchButton.setAttribute( 'aria-expanded', 'true' );
	// 	}
	// }

	// [searchButton, searchDivHide].forEach((element) => {
	// 	element.addEventListener('click', () => {
	// 		showSearch();
	// 	});
	// });

	// window.addEventListener('keyup', (event) => {
	// 	if (searchDiv.classList.contains('visible')) {
	// 		if (event.key === 'Escape' || event.keyCode === 72) {
	// 			showSearch();
	// 		}
	// 	}
	// });
})();
