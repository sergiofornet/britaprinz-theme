function artworksList (artworks) {
	let html = '';
	if (typeof artworks === 'object') {
		html += '<ul class="artwork-list">';
		artworks.forEach( (element) => {
			const { featured_techniques: featuredTechniques, other_techniques: otherTechniques } = element.artwork_techniques;
			html += `
			<li class="artwork" key="artwork-${ element.slug }">
				<div class="artwork__title"><a href="${ element.link }">${ element.title.rendered }</a></div>
				<div class="artwork__stuff">
					${ element.artwork_image_src ? `<div class="artwork__thumbnail"><a href="${ element.link }" data-artwork="${ element.id }">${ element.artwork_image_src }</a></div>` : '' }
					<div class="artwork__info">${ element.bp_artwork_year }</div>
					<div class="artwork__info">${ element.bp_artwork_condition }</div>
					<div class="artwork__info">${ element.bp_artwork_copy }</div>
					<div class="artwork__info">${ element.bp_artwork_paper }</div>
					<div class="artwork__info">${ element.bp_artwork_size }</div>
					${ element.artwork_loan ? `<div class="artwork__info">${ element.artwork_loan }</div>` : '' }
					${ element.artwork_sale ? `<div class="artwork__info">${ element.artwork_sale }</div>` : '' }
					<div class="artwork__techniques">
						${ featuredTechniques.map( (technique) => `<a href="${ technique[ 1 ] }">${ technique[ 0 ] }</a>` ).join( '\n' ) }
						${ otherTechniques && `<span>${ otherTechniques }</span>` }
					</div>
					<div class="artwork__info">${ element.bp_artwork_info }</div>
				</div>
			</li>
			`;
		});
		html += '</ul>';
	} else {
		html = artworks;
	}

	return html;
}
