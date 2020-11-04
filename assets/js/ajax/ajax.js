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

		const artist = event.target.dataset.artist;
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

					if (jsonResponse.some((item) => item.id === parseInt(event.currentTarget.dataset.artwork))) {
						artworkGallery.innerHTML = jsonResponse.filter((item) => item.id === parseInt(event.currentTarget.dataset.artwork))[ 0 ].artwork_image_gallery.join('\n');
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

	const artistsList = (url, options, target) => {
		target.classList.add('loading');
		asyncFetch(url, options)
			.then((jsonResponse) => {
				target.innerHTML = '';

				if (Array.isArray(jsonResponse)) {
					jsonResponse.forEach((item) => {
						const button = document.createElement('button');
						button.dataset.artist = item.term_id;
						button.classList.add('artist__button');
						button.classList.add('inactive');
						button.insertAdjacentText('afterbegin', item.name);

						button.addEventListener('click', (event) => {
							artistArtworks(event, ajax_var, artworksContainer, fetchOptions);
						});

						target.insertAdjacentElement('beforeend', button);
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
