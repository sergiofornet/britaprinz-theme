import { HandleScroll } from '../util/util';

const handleScroll = new HandleScroll();
/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
export default function navigation() {
	const siteNavigation = document.querySelector('#site-navigation');
	const siteHeader = document.querySelector('.site-header');

	// Return early if the navigation don't exist.
	if (!siteNavigation) {
		return;
	}

	siteNavigation.setAttribute('aria-hidden', true);

	const button = document.querySelector('.header__menu-toggle');

	// Return early if the button don't exist.
	if ('undefined' === typeof button) {
		return;
	}

	const menu = siteNavigation.querySelector('ul#primary-menu');
	// Hide menu toggle button if menu is empty and return early.
	if ('undefined' === typeof menu) {
		button.style.display = 'none';
		return;
	}

	if (!menu.classList.contains('nav-menu')) {
		menu.classList.add('nav-menu');
	}

	// Get all the link elements within the menu.
	const links = menu.getElementsByTagName('a');
	Array.from(links).forEach((link) => link.setAttribute('tabindex', '-1'));

	// Toggle the .toggled class and the aria-expanded value each time the button is clicked.
	button.addEventListener('click', function () {
		siteNavigation.classList.toggle('toggled');
		button.classList.toggle('toggled');
		document.body.classList.toggle('no-scroll');
		siteHeader.classList.toggle('menu-open');

		if (button.getAttribute('aria-expanded') === 'true') {
			button.setAttribute('aria-expanded', 'false');
			siteNavigation.setAttribute('aria-hidden', true);
			handleScroll.disable();
			Array.from(links).forEach((link) =>
				link.setAttribute('tabindex', '-1')
			);
		} else {
			button.setAttribute('aria-expanded', 'true');
			siteNavigation.setAttribute('aria-hidden', false);
			handleScroll.enable();
			Array.from(links).forEach((link) =>
				link.setAttribute('tabindex', '1')
			);
		}
	});

	// Remove the .toggled class and set aria-expanded to false when the user clicks outside the navigation.
	// document.addEventListener( 'click', function( event ) {
	// 	const isClickInside = siteNavigation.contains( event.target );

	// 	if ( ! isClickInside ) {
	// 		siteNavigation.classList.remove( 'toggled' );
	// 		button.setAttribute( 'aria-expanded', 'false' );
	// 	}
	// } );

	// Get all the link elements with children within the menu.
	const linksWithChildren = menu.querySelectorAll(
		'.menu-item-has-children > a, .page_item_has_children > a'
	);

	// Toggle focus each time a menu link is focused or blurred.
	for (const link of links) {
		link.addEventListener('focus', toggleFocus, true);
		link.addEventListener('blur', toggleFocus, true);
	}

	// Toggle focus each time a menu link with children receive a touch event.
	for (const link of linksWithChildren) {
		link.addEventListener('touchstart', toggleFocus, false);
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		if (event.type === 'focus' || event.type === 'blur') {
			let self = this;
			// Move up through the ancestors of the current link until we hit .nav-menu.
			while (!self.classList.contains('nav-menu')) {
				// On li elements toggle the class .focus.
				if ('li' === self.tagName.toLowerCase()) {
					self.classList.toggle('focus');
				}
				self = self.parentNode;
			}
		}

		if (event.type === 'touchstart') {
			const menuItem = this.parentNode;
			event.preventDefault();
			for (const link of menuItem.parentNode.children) {
				if (menuItem !== link) {
					link.classList.remove('focus');
				}
			}
			menuItem.classList.toggle('focus');
		}
	}

	function getHeight(element) {
		return element.offsetHeight;
	}

	function setHeaderHeight(height) {
		siteNavigation.style.setProperty('--header-height', `${height}px`);
	}

	const headerHeight = getHeight(siteHeader);
	setHeaderHeight(headerHeight);

	window.addEventListener('resize', () => {
		setHeaderHeight(getHeight(siteHeader));
	});
}
