/**
 * @param {Object} payload A JSON object
 * @param lang
 * @return {string} HTML string
 */
function awardEditionHTML(payload, lang) {
	const {
		title: { rendered: title },
		bp_award_edition: edition,
		bp_award_mentions: mentions,
		bp_award_se_toggle: isSpecialEdition,
		award_se: specialEdition,
		award: awardPrizes,
		award_catalogue: catalogueUrl,
	} = payload;

	let mentionsHTML = '';
	if (mentions) {
		mentions.forEach((mention) => {
			mentionsHTML += `
			<div class="award__mentions">
				<div class="mentions__title">${mention.bp_award_mentions_title}</div>
				<div class="mentions__text">${mention.bp_award_mentions_text}</div>
			</div>`;
		});
	}

	const html = isSpecialEdition
		? `
			<ul id="award-se" class="award-se">
				${specialEditionHTML(specialEdition)}
			</ul>
			`
		: `<div id="" class="award">
				${title && `<div class="award__title">${title}</div>`}
				${
					awardPrizes &&
					`
					<div class="award__prizes">
						<ol class="prizes__list">${prizesListHTML(awardPrizes)}</ol>
					</div>
				`
				}
				${edition && `<div class="award__edition">${edition}</div>`}
				${mentions && mentionsHTML}
				${catalogueUrl && `<div class="award_catalogue">${catalogueUrl}</div>`}
			</div>`;

	return html;
}

function prizesListHTML(payload) {
	let html = ``;
	payload.forEach((prize, index) => {
		html += `
		<li id="prize-${index + 1}">
			<div>${prize.bp_award_category}</div>
			<div>${prize.bp_award_artist}</div>
			<div>${prize.bp_award_image_rendered}</div>
			<div>${prize.bp_award_title}</div>
			<div>${prize.bp_award_technique}</div>
			<div>${prize.bp_award_size}</div>
			<div>${prize.bp_award_year}</div>
		</li>
		`;
	});
	return html;
}

function specialEditionHTML(payload) {
	let html = ``;
	// console.log(payload);
	payload.forEach((edition) => {
		html += `
		<li id="award-se-${edition.bp_award_se_year}" class="award-se__edition">
			<div class="edition__year">
				<p>${edition.bp_award_se_year}</p>
			</div>
			<div class="edition__winners">${edition.bp_award_se_winners}</div>
		</li>
		`;
	});
	return html;
}

export { awardEditionHTML };
