/**
 * Slider prototype definition
 *
 * @param {HTMLElement} slider
 * @param {boolean} scroll
 */
function Slider(slider, scroll = false) {
	if (! (slider instanceof Element)) {
		throw new Error('No slider passed in');
	}

	// select the elements needed for the slider
	this.slides = slider.querySelector('.slides');
	this.slider = slider;
	this.scroll = scroll;
	const prevButton = slider.querySelector('.previous-slide');
	const nextButton = slider.querySelector('.next-slide');

	// when this slider is created, run the start slider function
	this.startSlider();
	this.applyClasses();
	this.scroll && this.scrollImage();
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
	this.scroll && this.scrollImage();
};

Slider.prototype.scrollImage = function() {
	[this.next, this.prev].forEach((slide) => {
		slide.removeEventListener('mouseenter', enterHandler, false);
		slide.removeEventListener('mouseleave', leaveHandler, false);
		slide.removeEventListener('mousemove', moveHandler, false);
	});

	this.current.addEventListener('mouseenter', enterHandler, false);
	this.current.addEventListener('mouseleave', leaveHandler, false);
	this.current.addEventListener('mousemove', moveHandler, false);
};

const enterHandler = (event) => {
	const { naturalWidth: imageWidth, naturalHeight: imageHeight } = event.currentTarget.querySelector('img');
	const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

	// Check if hi-res image is bigger than screen size
	if (imageWidth > windowWidth || imageHeight > windowHeight ) {
		// Add active state class
		event.currentTarget.classList.add('active-scroll');

		// Create a container for hi-res image
		const hiResContainer = document.createElement('div');
		hiResContainer.classList.add('slide__hi-res');
		hiResContainer.style.width = `${ window.innerWidth }px`;
		hiResContainer.style.height = `${ window.innerHeight }px`;
		hiResContainer.style.opacity = '0';
		event.currentTarget.appendChild(hiResContainer);

		// Create hi-res image
		const hiResImage = document.createElement('img');
		const hiResImageUrl = event.currentTarget.querySelector('img').src;
		hiResImage.src = hiResImageUrl;
		hiResContainer.appendChild(hiResImage);
		setTimeout(() => hiResContainer.style.opacity = '1', 50);
	}
};

const leaveHandler = (event) => {
	// Check if there is an active scrollable image
	if (event.currentTarget.classList.contains('active-scroll')) {
		// Remove scrollable image
		const hiResContainer = event.currentTarget.querySelector('.slide__hi-res');
		hiResContainer.style.opacity = '0';
		event.currentTarget.removeChild(hiResContainer);

		// Remove active state class
		event.currentTarget.classList.remove('active-scroll');
	}
};
const moveHandler = (event) => {
	// Check if there is an active scrollable image
	if (event.currentTarget.classList.contains('active-scroll')) {
		const hiResImage = event.currentTarget.querySelector('.slide__hi-res img');
		const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
		const { clientX: cursorX, clientY: cursorY } = event;
		let { naturalWidth: imageWidth, naturalHeight: imageHeight } = hiResImage;

		imageWidth = imageWidth < windowWidth ? windowWidth : imageWidth;
		imageHeight = imageHeight < windowHeight ? windowHeight : imageHeight;

		const imageX = Math.floor((imageWidth - windowWidth) * cursorX / windowWidth) * -1;
		const imageY = Math.floor((imageHeight - windowHeight) * cursorY / windowHeight) * -1;

		hiResImage.style.transform = `translate(${ imageX }px, ${ imageY }px)`;
	}
};
