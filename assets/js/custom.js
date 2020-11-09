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
  var prevButton = slider.querySelector('.goToPrev');
  var nextButton = slider.querySelector('.goToNext'); // when this slider is created, run the start slider function

  this.startSlider();
  this.applyClasses(); // requestAnimationFrame(this.autoplay);
  // Event listeners

  prevButton.addEventListener('click', function () {
    return _this.move('back');
  });
  nextButton.addEventListener('click', function () {
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