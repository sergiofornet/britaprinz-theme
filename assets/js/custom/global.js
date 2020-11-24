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
}() );
