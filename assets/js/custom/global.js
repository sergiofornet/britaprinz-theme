/**
 * Set a custom property containing admin bar's height
 *
 * @param {HTMLElement} adminBar - admin bar element
 */
const setAdminBarHeight = (adminBar) => document.documentElement.style.setProperty('--wp-admin-bar', `${ adminBar.getBoundingClientRect().height }px`);

(function () {
	const wpAdminBar = document.querySelector('#wpadminbar');
	if (wpAdminBar) {
		setAdminBarHeight(wpAdminBar);
		window.addEventListener('resize', () => {
			setAdminBarHeight(wpAdminBar);
		});
	}

	// Toggle search form's visibility
	const searchButton = document.querySelector('.search-button');
	const searchDiv = document.querySelector('.search-div');
	const searchDivHide = searchDiv.querySelector('.search-div__close');

	[searchButton, searchDivHide].forEach((element) => {
		element.addEventListener('click', () => {
			searchDiv.classList.toggle('visible');
			document.body.classList.toggle('no-scroll');
		});
	});
}() );
