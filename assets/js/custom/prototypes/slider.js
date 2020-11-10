function Slider(slider, delay = 4000) {
	if (! (slider instanceof Element)) {
		throw new Error('No slider passed in');
	}

	// select the elements needed for the slider
	this.slides = slider.querySelector('.slides');
	this.slider = slider;
	this.delay = delay;
	const prevButton = slider.querySelector('.previous-slide');
	const nextButton = slider.querySelector('.next-slide');

	// when this slider is created, run the start slider function
	this.startSlider();
	this.applyClasses();
	// requestAnimationFrame(this.autoplay);

	// Event listeners
	prevButton && prevButton.addEventListener('click', () => this.move('back'));
	nextButton && nextButton.addEventListener('click', () => this.move());
}

Slider.prototype.startSlider = function() {
	this.current =
		this.slider.querySelector('.current') || this.slides.firstElementChild;
	this.prev =
		this.current.previousElementSibling || this.slides.lastElementChild;
	this.next = this.current.nextElementSibling || this.slides.firstElementChild;
	// console.log(this.current, this.prev, this.next);
};

Slider.prototype.applyClasses = function() {
	// console.log(this.current, this.prev, this.next);
	this.current.classList.add('current');
	this.prev.classList.add('prev');
	this.next.classList.add('next');
};

Slider.prototype.move = function(direction) {
	// first strip all the classes off the current slides
	// console.log(this.current, this.prev, this.next);
	const classesToRemove = ['prev', 'current', 'next'];
	this.prev.classList.remove(...classesToRemove);
	this.current.classList.remove(...classesToRemove);
	this.next.classList.remove(...classesToRemove);
	if (direction === 'back') {
		// make an new array of the new values, and destructure them over and into the prev, current and next variables
		[this.prev, this.current, this.next] = [
		// get the prev slide, if there is none, get the last slide from the entire slider for wrapping
			this.prev.previousElementSibling || this.slides.lastElementChild,
			this.prev,
			this.current,
		];
	} else {
		[this.prev, this.current, this.next] = [
			this.current,
			this.next,
			// get the next slide, or if it's at the end, loop around and grab the first slide
			this.next.nextElementSibling || this.slides.firstElementChild,
		];
	}

	this.applyClasses();
};
