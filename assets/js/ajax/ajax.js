import { asyncFetch } from '../util/async-fetch';
import { artworksList } from './artworks-list';

const { nonce } = ajax_var;
const { lang, searchUrl, artistId } = ajax_var;
console.log(ajax_var);

const headers = new Headers({
	'Content-Type': 'application/json',
	'X-WP-Nonce': nonce,
});

const fetchOptions = {
	method: 'get',
	headers,
	credentials: 'same-origin',
};

const searchInput = document.querySelector('.artist-search');
const artistsList = document.querySelector('.artists__list');

const groupObserver = new IntersectionObserver(initialsCallback, {
	rootMargin: '0px 0px -85% 0px',
	root: artistsList,
	threshold: 0.5,
});

const artworks = document.querySelector('.artworks');
const artworkGallery = document.querySelector('.artwork-gallery');
artworkGallery
	.querySelector('.artwork-gallery__close button')
	.addEventListener('click', () => artworkGallery.classList.toggle('hidden'));

const artworkSlider = artworkGallery.querySelector('.artwork-gallery__slider');
const initialButtons = document.querySelectorAll('.initial__button');

// Scroll to selected initial group on click
initialButtons.forEach((initial) => {
	const moveTo = new MoveTo({
		tolerance: 10,
		duration: 500,
		easing: 'easeOutQuart',
		container: artistsList,
	});
	initial.addEventListener('click', () => {
		const { target } = initial.dataset;
		const scrollTo = document.querySelector(
			`[data-initial=${target.toLowerCase()}]`
		);
		moveTo.move(scrollTo);
	});
});

/**
 * Callback function for groupObserver observer
 * Highlights the intersecting group's initial on initials container
 *
 * @param {Array} entries - Array of intersection entries
 */
function initialsCallback(entries) {
	entries.forEach((entry) => {
		const initial = document.querySelector(
			`.initial__button[data-target*=${entry.target.dataset.initial}]`
		);
		if (entry.intersectionRatio >= 0.5) {
			initial.classList.add('active');
		} else {
			initial.classList.remove('active');
		}
	});
}

/**
 * Displays info and artworks from the artist on which the user clicked
 *
 * @param {Event} event - The event which triggers the function
 * @param {Object} ajax - data object from PHP
 * @param {HTMLElement} target - HTML target element
 * @param {Object} options - Request options object
 * @param {number} id - An optional artist id
 */
const artistArtworks = (event, ajax, target, options, id = '') => {
	console.log(ajax);
	let artist;
	if (id) {
		artist = id;
	} else {
		event.preventDefault();
		artist = event.target.dataset.artist;
	}

	const artworksUrl = `${ajax.artworkUrl}?artist=${artist}&order=asc&orderby=slug`;
	const artistUrl = `${ajax.artistUrl}/${artist}`;

	target.innerHTML = ''; // empty artworks container

	target.classList.add('loading');

	// Fetch artworks asynchronously
	asyncFetch(artworksUrl, options)
		.then((jsonResponse) => {
			console.log(artworksUrl);
			const html = artworksList(jsonResponse);

			target.insertAdjacentHTML('beforeend', html);

			const artworkList = document.querySelectorAll(
				'.artworks__list .artwork'
			);
			const artworksThumbnails = document.querySelectorAll(
				'.artwork__thumbnail a'
			);

			// Toggles artwork info visibility
			artworkList.forEach((artwork) => {
				const artworkInfo = artwork.querySelector('.artwork__info');
				const artworkTitle = artwork.querySelector('.artwork__title');
				artworkTitle.addEventListener('click', (artworkEvent) => {
					artworkInfo.classList.toggle('visible');
				});
			});

			// Shows artwork detailed images when thumbnail is clicked
			artworksThumbnails.forEach((thumbnail) => {
				thumbnail.addEventListener('click', (thumbnailEvent) => {
					thumbnailEvent.preventDefault();
					artworkGallery.classList.toggle('hidden');

					const { artwork } = thumbnailEvent.currentTarget.dataset;

					if (
						jsonResponse.some(
							(item) => item.id === parseInt(artwork)
						)
					) {
						artworkSlider.innerHTML = '';
						const slidesContainer = document.createElement('div');
						slidesContainer.classList.add('slides');
						artworkSlider.insertAdjacentElement(
							'afterbegin',
							slidesContainer
						);
						const slides = jsonResponse.filter(
							(item) => item.id === parseInt(artwork)
						)[0].artwork_image_gallery;
						slides.forEach((slide) => {
							slidesContainer.insertAdjacentHTML(
								'beforeend',
								`
							<figure class="slide">
								${slide.image}
								${
									jsonResponse[0]
										.bp_artwork_multiple_artists &&
									`<figcaption>${slide.caption}</figcaption>`
								}
							</figure>
						`
							);
						});
						artworkSlider.insertAdjacentHTML(
							'beforeend',
							`
							<div class="controls">
								<button class="previous-slide">←</button>
								<button class="next-slide">→</button>
							</div>`
						);

						const slider = new Slider(artworkSlider, true);

						// slidesContainer.insertAdjacentHTML('afterbegin', jsonResponse.filter((item) => item.id === parseInt(artwork))[ 0 ].artwork_image_gallery.join('\n'));
					}
				});
			});
		})
		.then(() => target.classList.remove('loading'));

	// Fetch artist info asynchronously
	asyncFetch(artistUrl, options).then((jsonResponse) => {
		console.log(artistUrl);
		let html;
		const { name, artist_bio: artistBio } = jsonResponse;

		if (typeof jsonResponse === 'object') {
			html = `
				<div class="artworks__artist">
					<h2 class="artist__name">${name}</h2>
					${artistBio ? `<div class="artist__bio">${artistBio}</div>` : ''}
				</div>
				`;
		} else {
			html = artist;
		}
		target.insertAdjacentHTML('afterbegin', html);
	});
};

/**
 * Displays a list of Artists filtered by name
 *
 * @param {string} url - The REST endpoint url
 * @param {Object} options - Request options object
 * @param {HTMLElement} target - HTML target element
 * @param {string|null} currentLang - Current language on the front end. Needed to fix REST URLs when user is logged in. 🤷 blame WPML developers, not me
 */
const filterArtists = (url, options, target, currentLang) => {
	const fixedUrl = `${currentLang ? `${url}?lang=${currentLang}` : `${url}`}`;
	console.log(fixedUrl);

	target.classList.add('loading');
	asyncFetch(fixedUrl, options)
		.then((jsonResponse) => {
			target.innerHTML = '';

			if (Array.isArray(jsonResponse)) {
				// Create an a array of unique 'order name' initials

				// temporary fix
				// trimmed order field whitespaces & resorted
				// must sanitize fields on backend instead
				const initialsSet = new Set(
					jsonResponse
						.map((item) => item.order.trim()[0].toLowerCase())
						.sort()
				);
				const initials = [...initialsSet];

				// Create a group for every initial
				initials.forEach((initial) => {
					const group = document.createElement('div');
					group.classList.add('artists-group');
					group.dataset.initial = initial;
					group.insertAdjacentHTML(
						'afterbegin',
						`
							<span class="artists-group__label">${initial}</span>
						`
					);

					// Group every artist by its initial
					jsonResponse
						.filter(
							(item) =>
								item.order.trim()[0].toLowerCase() === initial
						)
						.forEach((item) => {
							const button = document.createElement('button');
							button.dataset.artist = item.term_id;
							button.classList.add('artist__button');
							button.classList.add('inactive');
							button.insertAdjacentText(
								'afterbegin',
								item.name.replace('&amp;', '&')
							);

							// Display artist info and its artworks
							button.addEventListener('click', (event) => {
								if (
									event.currentTarget.classList.contains(
										'inactive'
									)
								) {
									document.querySelector(
										'.artist__button.active'
									) &&
										document
											.querySelector(
												'.artist__button.active'
											)
											.classList.replace(
												'active',
												'inactive'
											);
									artistArtworks(
										event,
										ajax_var,
										artworks,
										fetchOptions
									);
									event.currentTarget.classList.replace(
										'inactive',
										'active'
									);
								} else {
									event.currentTarget.classList.replace(
										'active',
										'inactive'
									);
									artworks.innerHTML = '';
								}
							});

							group.insertAdjacentElement('beforeend', button);
						});

					target.insertAdjacentElement('beforeend', group);
					groupObserver.observe(group);
				});
			} else {
				target.innerHTML = jsonResponse;
			}
		})
		.then(() => target.classList.remove('loading'));
};

// Show artists on load
filterArtists(searchUrl, fetchOptions, artistsList, lang);

if (artistId) {
	artistArtworks(null, ajax_var, artworks, fetchOptions, artistId);
}

// Filter artists by input value
searchInput.addEventListener('keyup', () => {
	filterArtists(
		`${searchUrl}/${searchInput.value}`,
		fetchOptions,
		artistsList,
		lang
	);
});
