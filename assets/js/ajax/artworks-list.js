function artworksList (artworks) {
	let html = '';
	if (typeof artworks === 'object') {
		html += '<ul class="artworks__list">';
		artworks.forEach( (element) => {
			const { featured_techniques: featuredTechniques, other_techniques: otherTechniques } = element.artwork_techniques;
			html += `
			<li class="artwork" key="artwork-${ element.slug }">
				<button class="artwork__title">${ element.title.rendered }</button>
				<div class="artwork__info">
					${ element.artwork_image_src ? `<div class="artwork__thumbnail"><a href="${ element.link }" data-artwork="${ element.id }">${ element.artwork_image_src }</a></div>` : '' }
					<div class="artwork__year">${ element.bp_artwork_year }</div>
					<div class="artwork__copy">${ element.bp_artwork_copy }</div>
					<div class="artwork__size">${ element.bp_artwork_size }</div>
					<div class="artwork__paper">${ element.bp_artwork_paper }</div>
					<div class="artwork__condition">${ element.bp_artwork_condition }</div>
					${ element.artwork_info ? `<div class="artwork__description">${ element.artwork_info }</div>` : '' }
					<div class="artwork__techniques">
						${ featuredTechniques.map( (technique) => `<a class="technique" href="${ technique[ 1 ] }">${ technique[ 0 ] }</a>` ).join( '\n' ) }
						${ otherTechniques && `<span>${ otherTechniques }</span>` }
					</div>
					${ element.artwork_loan ? `<div class="artwork__loan">${ element.artwork_loan }</div>` : '' }
					${ element.artwork_sale ? `<div class="artwork__sale">${ element.artwork_sale }</div>` : '' }
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
