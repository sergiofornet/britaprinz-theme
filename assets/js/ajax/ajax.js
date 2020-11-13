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
	const artistsContainer = document.querySelector('.artists__container');

	const groupObserver = new IntersectionObserver(initialsCallback, {
		rootMargin: '0px 0px -85% 0px',
		root: artistsContainer,
		threshold: 0.5,
	});

	const artworksContainer = document.querySelector( '.artworks__container' );
	const artworkGallery = document.querySelector( '.artwork__gallery' );
	const initialsLinks = document.querySelectorAll( '.initial__button' );

	// Scroll to selected initial group on click
	initialsLinks.forEach((initial) => {
		const moveTo = new MoveTo({
			tolerance: 10,
			duration: 500,
			easing: 'easeOutQuart',
			container: artistsContainer,
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

			const artworkList = document.querySelectorAll( '.artwork-list .artwork' );
			const artworksThumbnails = document.querySelectorAll('.artwork__thumbnail a');

			// Toggles artwork info visibility
			artworkList.forEach( ( artwork ) => {
				const stuff = artwork.querySelector( '.artwork__stuff' );
				const artworkTitle = artwork.querySelector( '.artwork__title' );
				artworkTitle.addEventListener( 'click', ( artworkEvent ) => {
					artworkEvent.preventDefault();
					stuff.classList.toggle( 'visible' );
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
				<h2>${ name }</h2>
				<p>${ description }</p>
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
	const artistsList = (url, options, target) => {
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
								artistArtworks(event, ajax_var, artworksContainer, fetchOptions);
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
	artistsList(searchUrl, fetchOptions, artistsContainer);

	// Filter artists by input value
	searchInput.addEventListener('keyup', () => {
		artistsList(`${ searchUrl }${ searchInput.value }`, fetchOptions, artistsContainer);
	});
}() );
