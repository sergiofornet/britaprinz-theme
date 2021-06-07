async function asyncFetch(url, options) {
	const response = await fetch(url, options);

	const responseJSON = response.ok ? response.json() : '';
	return responseJSON;
}

/**
 * A helper function to create asyncFetch options.
 *
 * @param {string} nonce The nonce set up in php.
 * @param {string} method Fetch method, defaults to 'get'.
 * @return {Object} An options object
 */
function asyncFetchOptions(nonce, method) {
	const headers = new Headers({
		'Content-Type': 'application/json',
		'X-WP-Nonce': nonce,
	});
	const options = {
		method: method || 'get',
		headers,
		credentials: 'same-origin',
	};
	return options;
}

export { asyncFetch, asyncFetchOptions };
