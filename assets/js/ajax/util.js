import { getHeight } from '../util/util';

function setCollectionHeaderHeight() {
	const collectionHeader = document.querySelector('.collection__header');
	document.documentElement.style.setProperty(
		'--collection-header-height',
		`${getHeight(collectionHeader)}px`
	);
}

export { setCollectionHeaderHeight };
