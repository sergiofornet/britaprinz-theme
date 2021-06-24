import wait from 'waait';

async function handleReturnButton(button, target) {
	const activeButton = document.querySelector(
		'.edition-item__button[data-active="true"]'
	);
	if (activeButton) {
		activeButton.dataset.active = false;
		activeButton.setAttribute('aria-pressed', 'false');
	}
	if (button.getAttribute('aria-pressed') === 'true') {
		button.setAttribute('aria-pressed', 'false');
	} else {
		button.setAttribute('aria-pressed', 'true');
	}
	target.dataset.state = 'unloading';
	target.parentElement.dataset.state = 'unloading';
	await wait(500);
	target.dataset.state = 'unloaded';
	target.parentElement.dataset.state = 'unloaded';
	target.innerHTML = '';
}

export { handleReturnButton };
