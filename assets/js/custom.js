"use strict";

/**
 * Slider prototype definition
 *
 * @param {HTMLElement} slider
 * @param {boolean} scroll
 */
function Slider(slider) {
  var _this = this;

  var scroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!(slider instanceof Element)) {
    throw new Error('No slider passed in');
  } // select the elements needed for the slider


  this.slides = slider.querySelector('.slides');
  this.slider = slider;
  this.scroll = scroll;
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
  this.prev = this.current.previousElementSibling || this.slides.lastElementChild;
  this.next = this.current.nextElementSibling || this.slides.firstElementChild; // console.log(this.current, this.prev, this.next);
};

Slider.prototype.applyClasses = function () {
  // console.log(this.current, this.prev, this.next);
  this.current.classList.add('current');
  this.prev.classList.add('prev');
  this.next.classList.add('next');
};

Slider.prototype.move = function (direction) {
  var _this$prev$classList, _this$current$classLi, _this$next$classList;

  // first strip all the classes off the current slides
  // console.log(this.current, this.prev, this.next);
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
  [this.next, this.prev].forEach(function (slide) {
    slide.removeEventListener('mouseenter', enterHandler, false);
    slide.removeEventListener('mouseleave', leaveHandler, false);
    slide.removeEventListener('mousemove', moveHandler, false);
  });
  this.current.addEventListener('mouseenter', enterHandler, false);
  this.current.addEventListener('mouseleave', leaveHandler, false);
  this.current.addEventListener('mousemove', moveHandler, false);
};

var enterHandler = function enterHandler(event) {
  var _event$currentTarget$ = event.currentTarget.querySelector('img'),
      imageWidth = _event$currentTarget$.naturalWidth,
      imageHeight = _event$currentTarget$.naturalHeight;

  var _window = window,
      windowWidth = _window.innerWidth,
      windowHeight = _window.innerHeight; // Check if hi-res image is bigger than screen size

  if (imageWidth > windowWidth || imageHeight > windowHeight) {
    // Add active state class
    event.currentTarget.classList.add('active-scroll'); // Create a container for hi-res image

    var hiResContainer = document.createElement('div');
    hiResContainer.classList.add('slide__hi-res');
    hiResContainer.style.width = "".concat(window.innerWidth, "px");
    hiResContainer.style.height = "".concat(window.innerHeight, "px");
    hiResContainer.style.opacity = '0';
    event.currentTarget.appendChild(hiResContainer); // Create hi-res image

    var hiResImage = document.createElement('img');
    var hiResImageUrl = event.currentTarget.querySelector('img').src;
    hiResImage.src = hiResImageUrl;
    hiResContainer.appendChild(hiResImage);
    setTimeout(function () {
      return hiResContainer.style.opacity = '1';
    }, 50);
  }
};

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

(function () {
  var wpAdminBar = document.querySelector('#wpadminbar');

  if (wpAdminBar) {
    setAdminBarHeight(wpAdminBar);
    window.addEventListener('resize', function () {
      setAdminBarHeight(wpAdminBar);
    });
  } // Toggle search form's visibility


  var searchButton = document.querySelector('.search-button');
  var searchDiv = document.querySelector('.search-div');
  var searchDivHide = searchDiv.querySelector('.search-div__close');

  function showSearch() {
    searchDiv.classList.toggle('visible');
    document.body.classList.toggle('no-scroll');

    if (searchButton.getAttribute('aria-expanded') === 'true') {
      searchButton.setAttribute('aria-expanded', 'false');
    } else {
      searchButton.setAttribute('aria-expanded', 'true');
    }
  }

  [searchButton, searchDivHide].forEach(function (element) {
    element.addEventListener('click', function () {
      showSearch();
    });
  });
  window.addEventListener('keyup', function (event) {
    if (searchDiv.classList.contains('visible')) {
      if (event.key === 'Escape' || event.keyCode === 72) {
        showSearch();
      }
    }
  });
})();
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(function () {
  var homeSlider = document.querySelector('.home__slider');

  if (homeSlider) {
    var autoplay = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return wait(4000);

              case 2:
                slider.move();
                requestAnimationFrame(autoplay);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function autoplay() {
        return _ref.apply(this, arguments);
      };
    }();

    var slider = new Slider(homeSlider);
    console.log(slider);
    requestAnimationFrame(autoplay);
  }
})();