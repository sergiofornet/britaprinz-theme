"use strict";

/**
 * Set a custom property containing admin bar's height
 *
 * @param {HTMLElement} adminBar - admin bar element
 */
var setAdminBarHeight = function setAdminBarHeight(adminBar) {
  return document.documentElement.style.setProperty('--wp-admin-bar', "".concat(adminBar.getBoundingClientRect().height, "px"));
};
/**
 * Get the actual scrollbar width
 *
 */


function getSrollbarWidth() {
  var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  return scrollbarWidth;
}
/**
 * Set a custom '1vh' value
 */


function handleVhValue() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
}

(function () {
  var wpAdminBar = document.querySelector('#wpadminbar');

  if (wpAdminBar) {
    setAdminBarHeight(wpAdminBar);
    window.addEventListener('resize', function () {
      setAdminBarHeight(wpAdminBar);
    });
  } // Set a custom property with th eactual width of the scrollbar


  document.documentElement.style.setProperty('--scrollbar-width', "".concat(getSrollbarWidth(), "px"));
  handleVhValue();
  window.addEventListener('resize', handleVhValue); // Toggle search form's visibility
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

  var menuTitle = document.querySelector('.sidebar-menu li.menu-item--title span');

  if (menuTitle) {
    menuTitle.addEventListener('click', function (event) {
      event.currentTarget.parentElement.classList.toggle('menu-item--title--toggled');
    });
  }
})();
"use strict";

(function () {// let homeSlider = document.querySelector('.home__slider');
  // if (homeSlider) {
  // 	const slider = new Slider(homeSlider);
  // 	console.log(slider);
  // 	async function autoplay() {
  // 		await wait(4000);
  // 		slider.move();
  // 		requestAnimationFrame(autoplay);
  // 	}
  // 	requestAnimationFrame(autoplay);
  // }
})();
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function () {
  var siteNavigation = document.querySelector('#site-navigation');
  var siteHeader = document.querySelector('.site-header'); // Return early if the navigation don't exist.

  if (!siteNavigation) {
    return;
  }

  var button = document.querySelector('.header__menu-toggle'); // Return early if the button don't exist.

  if ('undefined' === typeof button) {
    return;
  }

  var menu = siteNavigation.querySelector('ul#primary-menu'); // Hide menu toggle button if menu is empty and return early.

  if ('undefined' === typeof menu) {
    button.style.display = 'none';
    return;
  }

  if (!menu.classList.contains('nav-menu')) {
    menu.classList.add('nav-menu');
  } // Toggle the .toggled class and the aria-expanded value each time the button is clicked.


  button.addEventListener('click', function () {
    siteNavigation.classList.toggle('toggled');
    button.classList.toggle('toggled');
    document.body.classList.toggle('no-scroll');
    siteHeader.classList.toggle('menu-open');

    if (button.getAttribute('aria-expanded') === 'true') {
      button.setAttribute('aria-expanded', 'false');
    } else {
      button.setAttribute('aria-expanded', 'true');
    }
  }); // Remove the .toggled class and set aria-expanded to false when the user clicks outside the navigation.
  // document.addEventListener( 'click', function( event ) {
  // 	const isClickInside = siteNavigation.contains( event.target );
  // 	if ( ! isClickInside ) {
  // 		siteNavigation.classList.remove( 'toggled' );
  // 		button.setAttribute( 'aria-expanded', 'false' );
  // 	}
  // } );
  // Get all the link elements within the menu.

  var links = menu.getElementsByTagName('a'); // Get all the link elements with children within the menu.

  var linksWithChildren = menu.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a'); // Toggle focus each time a menu link is focused or blurred.

  var _iterator = _createForOfIteratorHelper(links),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var link = _step.value;
      link.addEventListener('focus', toggleFocus, true);
      link.addEventListener('blur', toggleFocus, true);
    } // Toggle focus each time a menu link with children receive a touch event.

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper(linksWithChildren),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _link = _step2.value;

      _link.addEventListener('touchstart', toggleFocus, false);
    }
    /**
     * Sets or removes .focus class on an element.
     */

  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  function toggleFocus() {
    if (event.type === 'focus' || event.type === 'blur') {
      var self = this; // Move up through the ancestors of the current link until we hit .nav-menu.

      while (!self.classList.contains('nav-menu')) {
        // On li elements toggle the class .focus.
        if ('li' === self.tagName.toLowerCase()) {
          self.classList.toggle('focus');
        }

        self = self.parentNode;
      }
    }

    if (event.type === 'touchstart') {
      var menuItem = this.parentNode;
      event.preventDefault();

      var _iterator3 = _createForOfIteratorHelper(menuItem.parentNode.children),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var link = _step3.value;

          if (menuItem !== link) {
            link.classList.remove('focus');
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      menuItem.classList.toggle('focus');
    }
  }

  function getHeight(element) {
    return element.offsetHeight;
  }

  function setHeaderHeight(height) {
    siteNavigation.style.setProperty('--header-height', "".concat(height, "px"));
  }

  var headerHeight = getHeight(siteHeader);
  setHeaderHeight(headerHeight);
  window.addEventListener('resize', function () {
    setHeaderHeight(getHeight(siteHeader));
  });
})();