/**
 * Slider prototype definition
 *
 * @param {HTMLElement} slider Where our slider will be created.
 * @param {boolean} scroll Have the slides a hi-res scrollable version?
 * @param {boolean} lightbox Have we just one slide?
 */
function Slider(slider, scroll = false, lightbox = false) {
	if (!(slider instanceof Element)) {
		throw new Error('No slider passed in');
	}

	// select the elements needed for the slider
	this.slides = slider.querySelector('.slides');
	this.slider = slider;
	this.scroll = scroll;
	this.lightbox = lightbox;
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

Slider.prototype.startSlider = function () {
	this.current =
		this.slider.querySelector('.current') || this.slides.firstElementChild;
	if (this.lightbox === false) {
		this.prev =
			this.current.previousElementSibling || this.slides.lastElementChild;
		this.next =
			this.current.nextElementSibling || this.slides.firstElementChild;
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
	if (this.lightbox) return;

	// first strip all the classes off the current slides
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

Slider.prototype.scrollImage = function () {
	if (this.lightbox === false) {
		[this.next, this.prev].forEach((slide) => {
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
async function asyncCreateImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

const enterHandler = async (event) => {
	// Create a hi-res image asynchronously
	const hiResImage = await asyncCreateImage(
		event.currentTarget.querySelector('img').dataset.full
	);
	const { naturalWidth: imageWidth, naturalHeight: imageHeight } = hiResImage;
	const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

	// Check if hi-res image is bigger than screen size
	if (imageWidth > windowWidth || imageHeight > windowHeight) {
		// Add active state class
		event.target.classList.add('active-scroll');

		// Create a container for hi-res image
		const hiResContainer = document.createElement('div');
		hiResContainer.classList.add('slide__hi-res');
		hiResContainer.style.width = `${hiResImage.width}px`;
		hiResContainer.style.height = `${hiResImage.height}px`;
		hiResContainer.style.opacity = '0';
		hiResContainer.style.setProperty(
			'--hires-width',
			`${hiResImage.width}px`
		);
		event.target.appendChild(hiResContainer);

		// Add width and height to hi-res image
		hiResImage.style.width = `${hiResImage.width}px`;
		hiResImage.style.height = `${hiResImage.height}px`;

		hiResContainer.appendChild(hiResImage);
		setTimeout(() => (hiResContainer.style.opacity = '1'), 50);
	}
};

const leaveHandler = (event) => {
	// Check if there is an active scrollable image
	if (event.currentTarget.classList.contains('active-scroll')) {
		// Remove scrollable image
		const hiResContainer =
			event.currentTarget.querySelector('.slide__hi-res');
		hiResContainer.style.opacity = '0';
		event.currentTarget.removeChild(hiResContainer);

		// Remove active state class
		event.currentTarget.classList.remove('active-scroll');
	}
};
const moveHandler = (event) => {
	// Check if there is an active scrollable image
	if (event.currentTarget.classList.contains('active-scroll')) {
		const hiResImage =
			event.currentTarget.querySelector('.slide__hi-res img');
		const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
		const { clientX: cursorX, clientY: cursorY } = event;
		let { naturalWidth: imageWidth, naturalHeight: imageHeight } =
			hiResImage;

		imageWidth = imageWidth < windowWidth ? windowWidth : imageWidth;
		imageHeight = imageHeight < windowHeight ? windowHeight : imageHeight;

		const imageX =
			Math.floor(((imageWidth - windowWidth) * cursorX) / windowWidth) *
			-1;
		const imageY =
			Math.floor(
				((imageHeight - windowHeight) * cursorY) / windowHeight
			) * -1;

		hiResImage.style.transform = `translate(${imageX}px, ${imageY}px)`;
	}
};

export default Slider;
