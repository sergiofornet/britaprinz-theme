"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Slider prototype definition
 *
 * @param {HTMLElement} slider Where our slider will be created.
 * @param {boolean} scroll Have the slides a hi-res scrollable version?
 * @param {boolean} lightbox Have we just one slide?
 */
function Slider(slider) {
  var _this = this;

  var scroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var lightbox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!(slider instanceof Element)) {
    throw new Error('No slider passed in');
  } // select the elements needed for the slider


  this.slides = slider.querySelector('.slides');
  this.slider = slider;
  this.scroll = scroll;
  this.lightbox = lightbox;
  var prevButton = slider.querySelector('.previous-slide');
  var nextButton = slider.querySelector('.next-slide'); // when this slider is created, run the start slider function

  this.startSlider();
  this.applyClasses();
  this.scroll && this.scrollImage(); // requestAnimationFrame(this.autoplay);
  // Event listeners

  prevButton && prevButton.addEventListener('click', function () {
    return _this.move('back');
  });
  nextButton && nextButton.addEventListener('click', function () {
    return _this.move();
  });
}

Slider.prototype.startSlider = function () {
  this.current = this.slider.querySelector('.current') || this.slides.firstElementChild;

  if (this.lightbox === false) {
    this.prev = this.current.previousElementSibling || this.slides.lastElementChild;
    this.next = this.current.nextElementSibling || this.slides.firstElementChild;
  }
};

Slider.prototype.applyClasses = function () {
  this.current.classList.add('current');

  if (this.lightbox === false) {
    this.prev.classList.add('prev');
    this.next.classList.add('next');
  }
};

Slider.prototype.move = function (direction) {
  var _this$prev$classList, _this$current$classLi, _this$next$classList;

  if (this.lightbox) return; // first strip all the classes off the current slides

  var classesToRemove = ['prev', 'current', 'next'];

  (_this$prev$classList = this.prev.classList).remove.apply(_this$prev$classList, classesToRemove);

  (_this$current$classLi = this.current.classList).remove.apply(_this$current$classLi, classesToRemove);

  (_this$next$classList = this.next.classList).remove.apply(_this$next$classList, classesToRemove);

  if (direction === 'back') {
    // make an new array of the new values, and destructure them over and into the prev, current and next variables
    var _ref = [// get the prev slide, if there is none, get the last slide from the entire slider for wrapping
    this.prev.previousElementSibling || this.slides.lastElementChild, this.prev, this.current];
    this.prev = _ref[0];
    this.current = _ref[1];
    this.next = _ref[2];
  } else {
    var _ref2 = [this.current, this.next, // get the next slide, or if it's at the end, loop around and grab the first slide
    this.next.nextElementSibling || this.slides.firstElementChild];
    this.prev = _ref2[0];
    this.current = _ref2[1];
    this.next = _ref2[2];
  }

  this.applyClasses();
  this.scroll && this.scrollImage();
};

Slider.prototype.scrollImage = function () {
  if (this.lightbox === false) {
    [this.next, this.prev].forEach(function (slide) {
      slide.removeEventListener('mouseenter', enterHandler, false);
      slide.removeEventListener('mouseleave', leaveHandler, false);
      slide.removeEventListener('mousemove', moveHandler, false);
    });
  }

  this.current.addEventListener('mouseenter', enterHandler, false);
  this.current.addEventListener('mouseleave', leaveHandler, false);
  this.current.addEventListener('mousemove', moveHandler, false);
};
/**
 * Create an image asynchronously
 *
 * @param {string} src Our image url
 * @return {Promise} A promise of a new image HTMLElement
 */


function asyncCreateImage(_x) {
  return _asyncCreateImage.apply(this, arguments);
}

function _asyncCreateImage() {
  _asyncCreateImage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(src) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              var img = new Image();

              img.onload = function () {
                return resolve(img);
              };

              img.onerror = reject;
              img.src = src;
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _asyncCreateImage.apply(this, arguments);
}

var enterHandler = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
    var hiResImage, imageWidth, imageHeight, _window, windowWidth, windowHeight, hiResContainer;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return asyncCreateImage(event.currentTarget.querySelector('img').dataset.full);

          case 2:
            hiResImage = _context.sent;
            imageWidth = hiResImage.naturalWidth, imageHeight = hiResImage.naturalHeight;
            _window = window, windowWidth = _window.innerWidth, windowHeight = _window.innerHeight; // Check if hi-res image is bigger than screen size

            if (imageWidth > windowWidth || imageHeight > windowHeight) {
              // Add active state class
              event.target.classList.add('active-scroll'); // Create a container for hi-res image

              hiResContainer = document.createElement('div');
              hiResContainer.classList.add('slide__hi-res');
              hiResContainer.style.width = "".concat(hiResImage.width, "px");
              hiResContainer.style.height = "".concat(hiResImage.height, "px");
              hiResContainer.style.opacity = '0';
              hiResContainer.style.setProperty('--hires-width', "".concat(hiResImage.width, "px"));
              event.target.appendChild(hiResContainer); // Add width and height to hi-res image

              hiResImage.style.width = "".concat(hiResImage.width, "px");
              hiResImage.style.height = "".concat(hiResImage.height, "px");
              hiResContainer.appendChild(hiResImage);
              setTimeout(function () {
                return hiResContainer.style.opacity = '1';
              }, 50);
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function enterHandler(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var leaveHandler = function leaveHandler(event) {
  // Check if there is an active scrollable image
  if (event.currentTarget.classList.contains('active-scroll')) {
    // Remove scrollable image
    var hiResContainer = event.currentTarget.querySelector('.slide__hi-res');
    hiResContainer.style.opacity = '0';
    event.currentTarget.removeChild(hiResContainer); // Remove active state class

    event.currentTarget.classList.remove('active-scroll');
  }
};

var moveHandler = function moveHandler(event) {
  // Check if there is an active scrollable image
  if (event.currentTarget.classList.contains('active-scroll')) {
    var hiResImage = event.currentTarget.querySelector('.slide__hi-res img');
    var _window2 = window,
        windowWidth = _window2.innerWidth,
        windowHeight = _window2.innerHeight;
    var cursorX = event.clientX,
        cursorY = event.clientY;
    var imageWidth = hiResImage.naturalWidth,
        imageHeight = hiResImage.naturalHeight;
    imageWidth = imageWidth < windowWidth ? windowWidth : imageWidth;
    imageHeight = imageHeight < windowHeight ? windowHeight : imageHeight;
    var imageX = Math.floor((imageWidth - windowWidth) * cursorX / windowWidth) * -1;
    var imageY = Math.floor((imageHeight - windowHeight) * cursorY / windowHeight) * -1;
    hiResImage.style.transform = "translate(".concat(imageX, "px, ").concat(imageY, "px)");
  }
};
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