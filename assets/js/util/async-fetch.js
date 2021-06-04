async function asyncFetch(url, options) {
	const response = await fetch(url, options);

	const responseJSON = response.ok ? response.json() : '';
	return responseJSON;
}

export { asyncFetch };
