/**
 * WPGulp Configuration File
 *
 * 1. Edit the variables as per your project requirements.
 * 2. In paths you can add <<glob or array of globs>>.
 *
 * @package
 */
// Project options.

// Local project URL of your already running WordPress site. Could be something like wpgulp.local or localhost:3000 depending upon your local WordPress setup.
const projectURL = 'localhost:8888/britaprinz';

// Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.
const productURL = './';
const browserAutoOpen = false;
const injectChanges = true;

// Style options.
// Path to main .scss file.
const styleSRC = './assets/scss/style.scss';

// Path to place the compiled CSS file. Default set to root folder.
const styleDestination = './';

// Available options → 'compact' or 'compressed' or 'nested' or 'expanded'
const outputStyle = 'expanded';
const errLogToConsole = true;
const precision = 10;

// JS Vendor options.
// Path to JS vendor folder.
const jsVendorSRC = './assets/js/vendor/*.js';

// Path to place the compiled JS vendors file.
const jsVendorDestination = './assets/js/';

// Compiled JS vendors file name. Default set to vendors i.e. vendors.js.
const jsVendorFile = 'vendor';

// JS Custom options.
// Path to JS custom scripts folder.
const jsCustomSRC = './assets/js/custom/**/*.js';

// Path to place the compiled JS custom scripts file.
const jsCustomDestination = './assets/js/';

// Compiled JS custom file name. Default set to custom i.e. custom.js.
const jsCustomFile = 'custom';

// Artworks JS options.
// Path to Artworks JS file.
const artworksSRC = './assets/js/ajax/ajax.js';

// Path to place the compiled JS custom scripts file.
const artworksDestination = './assets/js/';

// Compiled JS custom file name. Default set to custom i.e. custom.js.
const artworksFile = 'ajax';

// Award JS Custom options.
// Path to Award JS file.
const awardSRC = './assets/js/award/award.js';

// Path to place the compiled JS custom scripts file.
const awardDestination = './assets/js/';

// Compiled JS custom file name. Default set to custom i.e. custom.js.
const awardFile = 'award';

// Images options.
// Source folder of images which should be optimized and watched. You can also specify types e.g. raw/**.{png,jpg,gif} in the glob.
const imgSRC = './assets/img/raw/**/*';

// Destination folder of optimized images. Must be different from the imagesSRC folder.
const imgDST = './assets/img/';

// Watch files paths.
// Path to all *.scss files inside css folder and inside them.
const watchStyles = './assets/scss/**/*.scss';

// Path to all vendor JS files.
const watchJsVendor = './assets/js/vendor/*.js';

// Path to all custom JS files.
const watchJsCustom = './assets/js/custom/**/*.js';

// Path to all custom JS files.
const watchJs = './assets/js/ajax/*.js';

// Path to all custom JS files.
const watchJsAward = './assets/js/award/**/*.js';

// Path to all PHP files.
const watchPhp = './**/*.php';

// Zip file config.
// Must have.zip at the end.
const zipName = 'file.zip';

// Must be a folder outside of the zip folder.
const zipDestination = './../'; // Default: Parent folder.
const zipIncludeGlob = ['./**/*']; // Default: Include all files/folders in current directory.

// Default ignored files and folders for the zip file.
const zipIgnoreGlob = [
	'!./{node_modules,node_modules/**/*}',
	'!./.git',
	'!./.svn',
	'!./gulpfile.babel.js',
	'!./wpgulp.config.js',
	'!./.eslintrc.js',
	'!./.eslintignore',
	'!./.editorconfig',
	'!./phpcs.xml.dist',
	'!./vscode',
	'!./package.json',
	'!./package-lock.json',
	'!./assets/scss/**/*',
	'!./assets/scss',
	'!./assets/img/raw/**/*',
	'!./assets/img/raw',
	`!${imgSRC}`,
	`!${styleSRC}`,
	'!./assets/js/custom/*.js',
	`!${jsVendorSRC}`,
];

// Translation options.
// Your textdomain here.
const textDomain = 'britaprinz-theme';

// Name of the translation file.
const translationFile = 'britaprinz-theme.pot';

// Where to save the translation files.
const translationDestination = './languages';

// Package name.
const packageName = 'britaprinz-theme';

// Where can users report bugs.
const bugReport = 'https://AhmadAwais.com/contact/';

// Last translator Email ID.
const lastTranslator = 'Ahmad Awais <your_email@email.com>';

// Team's Email ID.
const team = 'AhmadAwais <your_email@email.com>';

// Browsers you care about for autoprefixing. Browserlist https://github.com/ai/browserslist
// The following list is set as per WordPress requirements. Though, Feel free to change.
const BROWSERS_LIST = [
	'last 2 version',
	'> 1%',
	'ie >= 11',
	'last 1 Android versions',
	'last 1 ChromeAndroid versions',
	'last 2 Chrome versions',
	'last 2 Firefox versions',
	'last 2 Safari versions',
	'last 2 iOS versions',
	'last 2 Edge versions',
	'last 2 Opera versions',
];

// Export.
module.exports = {
	projectURL,
	productURL,
	browserAutoOpen,
	injectChanges,
	styleSRC,
	styleDestination,
	outputStyle,
	errLogToConsole,
	precision,
	jsVendorSRC,
	jsVendorDestination,
	jsVendorFile,
	jsCustomSRC,
	jsCustomDestination,
	jsCustomFile,
	artworksSRC,
	artworksDestination,
	artworksFile,
	awardSRC,
	awardDestination,
	awardFile,
	imgSRC,
	imgDST,
	watchStyles,
	watchJsVendor,
	watchJsCustom,
	watchJs,
	watchJsAward,
	watchPhp,
	zipName,
	zipDestination,
	zipIncludeGlob,
	zipIgnoreGlob,
	textDomain,
	translationFile,
	translationDestination,
	packageName,
	bugReport,
	lastTranslator,
	team,
	BROWSERS_LIST,
};
