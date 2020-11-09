"use strict";

function Slider(slider) {
  var _this = this;

  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4000;

  if (!(slider instanceof Element)) {
    throw new Error('No slider passed in');
  } // select the elements needed for the slider


  this.slides = slider.querySelector('.slides');
  this.slider = slider;
  this.delay = delay;
  var prevButton = slider.querySelector('.previous-slide');
  var nextButton = slider.querySelector('.next-slide'); // when this slider is created, run the start slider function

  this.startSlider();
  this.applyClasses(); // requestAnimationFrame(this.autoplay);
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
};
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