async function asyncFetch(url, options) {
	const response = await fetch( url, options );

	const responseJSON = response.ok ? await response.json() : 'Nothing found.';
	return responseJSON;
}