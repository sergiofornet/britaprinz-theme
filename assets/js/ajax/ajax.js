import { asyncFetch } from '../util/async-fetch';
import { artworksList } from './artworks-list';
import { getHeight } from '../util/util';
import wait from 'waait';

function setCollectionHeaderHeight() {
	const collectionHeader = document.querySelector('.collection__header');
	document.documentElement.style.setProperty(
		'--collection-header-height',
		`${getHeight(collectionHeader)}px`
	);
}
setCollectionHeaderHeight();
window.addEventListener('resize', setCollectionHeaderHeight);

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
	rootMargin: '0px 0px 0px 0px',
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
		if (initial) {
			if (initial && entry.intersectionRatio >= 0.5) {
				initial.dataset.active = true;
			} else {
				initial.dataset.active = false;
			}
		}
	});
}

/**
 * Displays info and artworks from the artist on which the user clicked
 *
 * @param {Event} event - The event which triggers the function
 * @param {Object} ajax - data object from PHP
 * @param {HTMLElement} target - HTML target element
 * @param {string} currentLang - Language code
 * @param {Object} options - Request options object
 * @param {number} id - An optional artist id
 */
const artistArtworks = (event, ajax, target, currentLang, options, id = '') => {
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

	target.dataset.state = 'loading';

	const collection = document.querySelector('.collection');
	collection.dataset.state = 'opening';
	const artistsButtons = [...document.querySelectorAll('.artist__button')];

	artistsButtons.forEach((buttonToDisable) => {
		buttonToDisable.setAttribute('disabled', '');
	});

	// Fetch artworks asynchronously
	asyncFetch(artworksUrl, options)
		.then((jsonResponse) => {
			console.log(artworksUrl);
			const html = artworksList(jsonResponse, currentLang);

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
				const artworkTitle = artwork.querySelector(
					'.artwork__title button'
				);
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
		.then(() => (target.dataset.state = 'loaded'))
		.then(() =>
			artistsButtons.forEach((buttonToEnable) => {
				buttonToEnable.removeAttribute('disabled');
			})
		);

	// Fetch artist info asynchronously
	asyncFetch(artistUrl, options)
		.then((jsonResponse) => {
			console.log(artistUrl);
			let html;
			const { name, artist_bio: artistBio } = jsonResponse;

			if (typeof jsonResponse === 'object') {
				html = `
				<button class="artworks__return"><</button>
				<div class="artworks__artist">
					<h1 class="artist__name">${name}</h1>
					${artistBio ? `<div class="artist__bio">${artistBio}</div>` : ''}
				</div>
				`;
			} else {
				html = artist;
			}
			target.insertAdjacentHTML('afterbegin', html);
			// button event listener => go back
			const returnButton = target.querySelector('.artworks__return');
			returnButton.addEventListener('click', async (event) => {
				collection.dataset.state = 'closed';
				target.dataset.state = 'unloading';
				document.querySelector(
					'button.artist__button[data-active=true]'
				).dataset.active = false;
				await wait(500);
				target.dataset.state = 'unloaded';
				target.innerHTML = '';
			});
		})
		.then(() => {
			if (id) {
				document.querySelector(
					`button[data-artist="${id}"]`
				).dataset.active = true;
				collection.dataset.state = 'open';
			}
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

	target.dataset.state = 'loading';
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
							button.dataset.active = false;
							button.insertAdjacentText(
								'afterbegin',
								item.name.replace('&amp;', '&')
							);

							// Display artist info and its artworks
							button.addEventListener('click', async (event) => {
								const collection =
									document.querySelector('.collection');
								if (
									event.currentTarget.dataset.active ===
									'false'
								) {
									if (
										document.querySelector(
											'.artist__button[data-active=true]'
										)
									) {
										document.querySelector(
											'.artist__button[data-active=true]'
										).dataset.active = false;
									}
									artistArtworks(
										event,
										ajax_var,
										artworks,
										currentLang,
										fetchOptions
									);
									event.currentTarget.dataset.active = true;
									collection.dataset.state = 'open';
								} else {
									console.log('else');
									event.currentTarget.dataset.active = false;
									collection.dataset.state = 'closing';
									artworks.dataset.state = 'unloading';
									await wait(500);
									collection.dataset.state = 'closed';
									artworks.dataset.state = 'unloaded';
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
		.then(() => (target.dataset.state = 'loaded'));
};

// Show artists on load
filterArtists(searchUrl, fetchOptions, artistsList, lang);

if (artistId) {
	artistArtworks(null, ajax_var, artworks, lang, fetchOptions, artistId);
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
