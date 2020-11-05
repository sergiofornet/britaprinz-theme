( function() {
	const { nonce } = ajax_var;
	let { lang, searchUrl } = ajax_var;
	lang = lang ? `${ lang }/` : '';
	searchUrl = `${ searchUrl.slice( 0, searchUrl.indexOf( 'wp-json' ) ) }${ lang }${ searchUrl.slice( searchUrl.indexOf( 'wp-json' ) ) }`;

	const headers = new Headers( {
		'Content-Type': 'applications/json',
		'X-WP-Nonce': nonce,
	} );

	const fetchOptions = {
		method: 'get',
		headers,
		credentials: 'same-origin',
	};

	const searchInput = document.querySelector('.artist-search');
	const artistsContainer = document.querySelector('.artists__container');
	const artworksContainer = document.querySelector( '.artworks__container' );
	const artworkGallery = document.querySelector( '.artwork__gallery' );

	const artistArtworks = (event, ajax, target, options) => {
		event.preventDefault();

		const { artist } = event.target.dataset;
		const artworksUrl = ajax.artworkUrl + artist + '&order=asc&orderby=slug';
		const artistUrl = `${ ajax.artistUrl }/${ artist }`;

		const fixedArtworksUrl = `${ artworksUrl.slice( 0, artworksUrl.indexOf( 'wp-json' ) ) }${ lang }${ artworksUrl.slice( artworksUrl.indexOf( 'wp-json' ) ) }`;

		const fixedArtistUrl = `${ artistUrl.slice( 0, artistUrl.indexOf( 'wp-json' ) ) }${ lang }${ artistUrl.slice( artistUrl.indexOf( 'wp-json' ) ) }`;

		target.innerHTML = ''; // empty artworks container

		target.classList.add('loading');
		asyncFetch( fixedArtworksUrl, options).then( ( jsonResponse ) => {
			const html = artworksList(jsonResponse);

			target.insertAdjacentHTML( 'beforeend', html );

			const artworkList = document.querySelectorAll( '.artwork-list .artwork' );
			const artworksThumbnails = document.querySelectorAll('.artwork__thumbnail a');

			artworkList.forEach( ( artwork ) => {
				const stuff = artwork.querySelector( '.artwork__stuff' );
				const artworkTitle = artwork.querySelector( '.artwork__title' );
				artworkTitle.addEventListener( 'click', ( event ) => {
					event.preventDefault();
					stuff.classList.toggle( 'visible' );
				} );
			} );

			artworksThumbnails.forEach((thumbnail) => {
				thumbnail.addEventListener('click', (event) => {
					event.preventDefault();
					const { artwork } = event.currentTarget.dataset;

					if (jsonResponse.some((item) => item.id === parseInt(artwork))) {
						artworkGallery.innerHTML = jsonResponse.filter((item) => item.id === parseInt(artwork))[ 0 ].artwork_image_gallery.join('\n');
					}
				});
			});
		}).then(() => target.classList.remove('loading'));

		asyncFetch( fixedArtistUrl, options).then( ( jsonResponse ) => {
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
					const initialsSet = new Set(jsonResponse.map((item) => item.order[ 0 ]));
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
						jsonResponse.filter((item) => item.order[ 0 ] === initial).forEach((item) => {
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
					});
				} else {
					target.innerHTML = jsonResponse;
				}
			}).then(() => target.classList.remove('loading'));
	};

	// Show artists on load
	artistsList(searchUrl, fetchOptions, artistsContainer);

	//
	searchInput.addEventListener('keyup', () => {
		artistsList(`${ searchUrl }/${ searchInput.value }`, fetchOptions, artistsContainer);
	});
}() );
