import wait from 'waait';

async function handleReturnButton(button, target) {
	const activeButton = document.querySelector(
		'.edition-item__button--active'
	);
	console.log(activeButton);
	if (activeButton) {
		activeButton.classList.replace(
			'edition-item__button--active',
			'edition-item__button--inactive'
		);
		activeButton.setAttribute('aria-pressed', 'false');
		console.log('if 1');
	}
	if (button.getAttribute('aria-pressed') === 'true') {
		button.setAttribute('aria-pressed', 'false');
		console.log('if 2');
	} else {
		button.setAttribute('aria-pressed', 'true');
		console.log('else');
	}
	target.classList.replace('loaded', 'unloading');
	await wait(500);
	target.classList.replace('unloading', 'unloaded');
	target.innerHTML = '';
}

export { handleReturnButton };
