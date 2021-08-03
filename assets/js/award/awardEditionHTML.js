import { handleReturnButton } from './awardHandlers';
import { awardGalleryImage } from './awardGalleryImage';

/**
 * @param {Object} payload A JSON object
 * @param {HTMLElement} target - DOM Element where the info will be displayed
 * @param {string} lang
 * @return {void}
 */
function awardEditionHTML(payload, target, lang) {
	const {
		title: { rendered: title },
		bp_award_mentions: mentions,
		bp_award_se_toggle: isSpecialEdition,
		award_se: specialEdition,
		award: awardPrizes,
		id,
	} = payload;

	let mentionsHTML = '';
	if (mentions) {
		mentionsHTML += `<ul class="prizes__mentions">`;
		mentions.forEach((mention) => {
			mentionsHTML += `
			<li class="mention">
				<h2 class="mention__title">${mention.bp_award_mentions_title}</h2>
				<p class="mention__text">${mention.bp_award_mentions_text}</p>
			</li>`;
		});
		mentionsHTML += `</ul>`;
	}

	const html = `
	<article id="post-${id}">
		<div class="entry-content award">
			${
				title &&
				`<div class="award__title">
					<h1>${title}</h1>
				</div>`
			}
			${
				isSpecialEdition
					? `
					<ul id="award-se" class="award-se">
						${specialEditionHTML(specialEdition)}
					</ul>
					`
					: `	
					${
						awardPrizes
							? `
						<div class="award__prizes">
							<ol class="prizes__list">${prizesListHTML(awardPrizes)}</ol>
							${mentions && mentionsHTML}
						</div>`
							: ``
					}`
			}
		</div>
	</article>`;

	target.innerHTML = '';
	target.insertAdjacentHTML('afterbegin', html);

	// Handle gallery toggling on and off
	awardGalleryImage(awardPrizes);

	const returnButton = document.createElement('button');
	returnButton.classList.add('award-edition-container__return-button');
	returnButton.classList.add('return-button');
	returnButton.setAttribute('aria-pressed', 'false');
	returnButton.innerHTML = '<';
	returnButton.addEventListener(
		'click',
		() => {
			handleReturnButton(returnButton, target);
		},
		false
	);
	target.insertAdjacentElement('afterbegin', returnButton);
}

function prizesListHTML(payload) {
	let html = ``;
	if (payload) {
		payload.forEach((prize, index) => {
			html += `
		<li id="prize-${index + 1}" class="prize__category prize__category-${
				index + 1
			}">
			<h2 class="prize__name">${prize.bp_award_category}</h2>
			<p class="prize__artist">${prize.bp_award_artist}</p>
			<div class="prize__image">
				<button type="button" data-image="${prize.bp_award_image}">
					<figure>${prize.bp_award_image_thumbnail}</figure>
				</button>
			</div>
			<p class="prize__artwork">${prize.bp_award_title}</p>
			<p class="prize__technique">${prize.bp_award_technique}</p>
			<p class="prize__size">${prize.bp_award_size}</p>
			<p class="prize__year">${prize.bp_award_year}</p>
		</li>
		`;
		});
	}
	return html;
}

function specialEditionHTML(payload) {
	let html = ``;
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
