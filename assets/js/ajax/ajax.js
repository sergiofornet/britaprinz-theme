( function() {
	const artworksContainer = document.querySelector( '.artworks__container' );
	const artists = document.querySelectorAll( '.artist__link' );
	if ( artists ) {
		artists.forEach( ( artist ) => {
			artist.addEventListener( 'click', ( event ) => {
				event.preventDefault();

				artworksContainer.innerHTML = ''; // empty artworks container

				const headers = new Headers( {
					'Content-Type': 'applications/json',
					'X-WP-Nonce': ajax_var.nonce,
				} );

				const artist = event.target.dataset.artist;
				const artworksUrl = ajax_var.artworkUrl + artist + `&order=asc&orderby=slug`;
				const artistUrl = `${ ajax_var.artistUrl }/${ artist }`;

				const fixedArtworksUrl = `${ artworksUrl.slice( 0, artworksUrl.indexOf( 'wp-json' ) ) }${ ajax_var.lang }${ artworksUrl.slice( artworksUrl.indexOf( '/wp-json' ) ) }`;

				const fixedArtistUrl = `${ artistUrl.slice( 0, artistUrl.indexOf( 'wp-json' ) ) }${ ajax_var.lang }${ artistUrl.slice( artistUrl.indexOf( '/wp-json' ) ) }`;

				asyncFetch( fixedArtworksUrl, {
					method: 'get',
					headers,
					credentials: 'same-origin',
				} ).then( ( json_response ) => {
					let html;
					const artworks = json_response;

					html = artworksList(artworks);
					artworksContainer.insertAdjacentHTML( 'beforeend', html );
					return json_response;
				} ).then(json_response => {
					const artworkList = document.querySelectorAll( '.artwork-list .artwork' );
					artworkList.forEach( ( artwork ) => {
						const stuff = artwork.querySelector( '.artwork__stuff' );
						const artworkTitle = artwork.querySelector( '.artwork__title' )
						artworkTitle.addEventListener( 'click', ( event ) => {
							event.preventDefault();
							stuff.classList.toggle( 'visible' );
						} );
					} );
					return json_response;
				}).then(json_response => {
					const artworksThumbnails = document.querySelectorAll('.artwork__thumbnail a');
					const artworksGallery = document.querySelector( '.artworks__gallery' );

					artworksThumbnails.forEach(thumbnail => {
						thumbnail.addEventListener('click', event => {
							event.preventDefault();
							
							if (json_response.some(item => item.id === parseInt(event.currentTarget.dataset.artwork))) {
								artworksGallery.innerHTML = json_response.filter(item => item.id === parseInt(event.currentTarget.dataset.artwork))[0].artwork_image_gallery.join('\n');
							}
						})
					})
				});

				asyncFetch( fixedArtistUrl, {
					method: 'get',
					headers,
					credentials: 'same-origin',
				} ).then( ( json_response ) => {
					let html;
					const artist = json_response;

					if ( typeof artist === 'object' ) {
						html = `
						<h2>${ artist.name }</h2>
						<p>${ artist.description }</p>
						`;
					} else {
						html = artist;
					}
					artworksContainer.insertAdjacentHTML( 'afterbegin', html );
				} );
			} );
		} );
	}
}() );
