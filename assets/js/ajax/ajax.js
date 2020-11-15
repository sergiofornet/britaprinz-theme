( function() {
	const { nonce } = ajax_var;
	const { lang, searchUrl } = ajax_var;

	const headers = new Headers( {
		'Content-Type': 'application/json',
		'X-WP-Nonce': nonce,
	} );

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

	const artworks = document.querySelector( '.artworks' );
	const artworkGallery = document.querySelector( '.artwork__gallery' );
	const initialButtons = document.querySelectorAll( '.initial__button' );

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
			const scrollTo = document.querySelector(`[data-initial=${ target.toLowerCase() }]`);
			moveTo.move(scrollTo);
		});
	});

	/**
	 * Callback function for groupObserver observer
	 * Highlights the intersecting group's initial on initials container
	 *
	 * @param {Array} entries - Array of intersection entries
	 */
	function initialsCallback (entries) {
		entries.forEach((entry) => {
			const initial = document.querySelector(`.initial__button[data-target*=${ entry.target.dataset.initial }]`);
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
	 */
	const artistArtworks = (event, ajax, target, options) => {
		event.preventDefault();

		const { artist } = event.target.dataset;

		const artworksUrl = `${ ajax.artworkUrl }?artist=${ artist }&order=asc&orderby=slug`;
		const artistUrl = `${ ajax.artistUrl }${ artist }`;

		target.innerHTML = ''; // empty artworks container

		target.classList.add('loading');

		// Fetch artworks asynchronously
		asyncFetch( artworksUrl, options).then( ( jsonResponse ) => {
			const html = artworksList(jsonResponse);

			target.insertAdjacentHTML( 'beforeend', html );

			const artworkList = document.querySelectorAll( '.artworks__list .artwork' );
			const artworksThumbnails = document.querySelectorAll('.artwork__thumbnail a');

			// Toggles artwork info visibility
			artworkList.forEach( ( artwork ) => {
				const artworkInfo = artwork.querySelector( '.artwork__info' );
				const artworkTitle = artwork.querySelector( '.artwork__title' );
				artworkTitle.addEventListener( 'click', ( artworkEvent ) => {
					artworkInfo.classList.toggle( 'visible' );
				} );
			} );

			// Shows artwork detailed images when thumbnail is clicked
			artworksThumbnails.forEach((thumbnail) => {
				thumbnail.addEventListener('click', (thumbnailEvent) => {
					thumbnailEvent.preventDefault();
					const { artwork } = thumbnailEvent.currentTarget.dataset;

					if (jsonResponse.some((item) => item.id === parseInt(artwork))) {
						artworkGallery.innerHTML = '';
						const slidesContainer = document.createElement('div');
						slidesContainer.classList.add('slides');
						artworkGallery.insertAdjacentElement('afterbegin', slidesContainer);
						const slides = jsonResponse.filter((item) => item.id === parseInt(artwork))[ 0 ].artwork_image_gallery;
						slides.forEach((slide) => slidesContainer.insertAdjacentHTML('beforeend', `
							<div class="slide">
								${ slide }
							</div>
						`));
						artworkGallery.insertAdjacentHTML('beforeend', `
							<div class="controls">
								<button class="previous-slide">←</button>
								<button class="next-slide">→</button>
							</div>`);

						const slider = new Slider(artworkGallery);

						// slidesContainer.insertAdjacentHTML('afterbegin', jsonResponse.filter((item) => item.id === parseInt(artwork))[ 0 ].artwork_image_gallery.join('\n'));
					}
				});
			});
		}).then(() => target.classList.remove('loading'));

		// Fetch artist info asynchronously
		asyncFetch( artistUrl, options).then( ( jsonResponse ) => {
			let html;
			const { name, description } = jsonResponse;

			if ( typeof jsonResponse === 'object' ) {
				html = `
				<div class="artworks__artist">
					<h2 class="artist__name">${ name }</h2>
					<p class="artist__bio">${ description }</p>
				</div>
				`;
			} else {
				html = artist;
			}
			target.insertAdjacentHTML( 'afterbegin', html );
		} );
	};

	/**
	 * Displays a list of Artists filtered by name
	 *
	 * @param {string} url - The REST endpoint url
	 * @param {Object} options - Request options object
	 * @param {HTMLElement} target - HTML target element
	 */
	const filterArtists = (url, options, target) => {
		target.classList.add('loading');
		asyncFetch(url, options)
			.then((jsonResponse) => {
				target.innerHTML = '';

				if (Array.isArray(jsonResponse)) {
					// Create an a array of unique 'order name' initials
					const initialsSet = new Set(jsonResponse.map((item) => item.order[ 0 ].toLowerCase()));
					const initials = [...initialsSet];

					// Create a group for every initial
					initials.forEach((initial) => {
						const group = document.createElement('div');
						group.classList.add('artists-group');
						group.dataset.initial = initial;
						group.insertAdjacentHTML('afterbegin', `
							<span class="artists-group__label">${ initial }</span>
						`);

						// Group every artist by its initial
						jsonResponse.filter((item) => item.order[ 0 ].toLowerCase() === initial).forEach((item) => {
							const button = document.createElement('button');
							button.dataset.artist = item.term_id;
							button.classList.add('artist__button');
							button.classList.add('inactive');
							button.insertAdjacentText('afterbegin', item.name);

							// Display artist info and its artworks
							button.addEventListener('click', (event) => {
								artistArtworks(event, ajax_var, artworks, fetchOptions);
							});

							group.insertAdjacentElement('beforeend', button);
						});

						target.insertAdjacentElement('beforeend', group);
						groupObserver.observe(group);
					});
				} else {
					target.innerHTML = jsonResponse;
				}
			}).then(() => target.classList.remove('loading'));
	};

	// Show artists on load
	filterArtists(searchUrl, fetchOptions, artistsList);

	// Filter artists by input value
	searchInput.addEventListener('keyup', () => {
		filterArtists(`${ searchUrl }${ searchInput.value }`, fetchOptions, artistsList);
	});
}() );
