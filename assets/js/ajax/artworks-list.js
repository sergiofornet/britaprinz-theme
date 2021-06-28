function artworksList(artworks, lang) {
	console.log(lang);
	let html = '';
	if (typeof artworks === 'object') {
		html += `
		${lang === `es` ? `<h2>Obras</h2>` : `<h2>Artworks</h2>`}
		<ul class="artworks__list">
		`;
		artworks.forEach((element) => {
			const {
				featured_techniques: featuredTechniques,
				other_techniques: otherTechniques,
			} = element.artwork_techniques;
			html += `
			<li class="artwork" key="artwork-${element.slug}">
				<h3 class="artwork__title"><button>${element.title.rendered}</button></h3>
				<div class="artwork__info">
					${
						element.artwork_image_src
							? `<div class="artwork__thumbnail"><a href="${element.link}" data-artwork="${element.id}">${element.artwork_image_src}</a></div>`
							: ''
					}
					<div class="artwork__year">${element.bp_artwork_year}</div>
					<div class="artwork__copy">${element.bp_artwork_copy}</div>
					${
						element.bp_artwork_size_image &&
						`<div class="artwork__size-image">${element.bp_artwork_size_image}</div>`
					}
					<div class="artwork__size-sheet">${element.bp_artwork_size}</div>
					<div class="artwork__paper">${element.bp_artwork_paper}</div>
					<div class="artwork__condition">${element.bp_artwork_condition}</div>
					${
						element.artwork_info
							? `<div class="artwork__description">${element.artwork_info}</div>`
							: ''
					}
					<div class="artwork__techniques">
						${featuredTechniques
							.map(
								(technique) =>
									`<a class="technique" href="${technique[1]}">${technique[0]}</a>`
							)
							.join('\n')}
						${otherTechniques && `<span>${otherTechniques}</span>`}
					</div>
					${
						element.artwork_loan
							? `<div class="artwork__loan"><a href="mailto:arte@britaprinzarte.com">${element.artwork_loan}</a></div>`
							: ''
					}
					${
						element.artwork_sale
							? `<div class="artwork__sale"><a href="mailto:arte@britaprinzarte.com">${element.artwork_sale}</a></div>`
							: ''
					}
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

export { artworksList };
