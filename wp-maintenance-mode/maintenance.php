<?php
/**
 * Maintenance mode page
 *
 * This template can be overridden by copying it to one of these paths:
 * - /wp-content/themes/{your_child_theme}/wp-maintenance-mode/maintenance.php
 * - /wp-content/themes/{your_theme}/wp-maintenance-mode/maintenance.php
 * - /wp-content/themes/{your_child_theme}/wp-maintenance-mode.php [deprecated]
 * - /wp-content/themes/{your_theme}/wp-maintenance-mode.php [deprecated]
 * - /wp-content/wp-maintenance-mode.php
 *
 * It can also be overridden by changing the default path. See `wpmm_maintenance_template` hook:
 * https://github.com/WP-Maintenance-Mode/Snippet-Library/blob/master/change-template-path.php
 *
 * @version 2.4.0
 */

defined( 'ABSPATH' ) || exit;
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Brita Prinz Arte</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<meta name="description" content="">
		<meta name="robots" content="<?php echo esc_attr( $robots ); ?>" />
		<meta property="og:type" content="company">
		<meta property="og:description" content="Brita Prinz Arte. Contemporary Graphic Art">
		<meta property="og:url" content="http://www.britaprinzarte.com/index_en.php">
		<meta property="og:site_name" content="Brita Prinz Arte">
		<meta property="og:image" content="http://www.britaprinzarte.com/img/logo_facebook2.jpg">
		<meta property="fb:admins" content="167050073314227">

		<meta name="title" content="Brita Prinz Arte. Contemporary Graphic Art">
		<meta name="keywords" content="Brita Prinz, Arte, Graphic Art, Contemporary, exhibitions, showroom, aeards, carmen arozena, printing art, artists, woodcut, etching, litography, silkscreen">
		<meta name="description" content="Brita Prinz Arte. Contemporary Graphic Art">

		<?php
		// do some actions.
		do_action( 'wm_head' ); // this hook will be removed in the next versions.
		do_action( 'wpmm_head' );
		?>

		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap" rel="stylesheet"> 

		<style>
			/* http://meyerweb.com/eric/tools/css/reset/ 
			v2.0 | 20110126
			License: none (public domain)
			*/

			html, body, div, span, applet, object, iframe,
			h1, h2, h3, h4, h5, h6, p, blockquote, pre,
			a, abbr, acronym, address, big, cite, code,
			del, dfn, em, img, ins, kbd, q, s, samp,
			small, strike, strong, sub, sup, tt, var,
			b, u, i, center,
			dl, dt, dd, ol, ul, li,
			fieldset, form, label, legend,
			table, caption, tbody, tfoot, thead, tr, th, td,
			article, aside, canvas, details, embed, 
			figure, figcaption, footer, header, hgroup, 
			menu, nav, output, ruby, section, summary,
			time, mark, audio, video {
				margin: 0;
				padding: 0;
				border: 0;
				font-size: 100%;
				font: inherit;
				vertical-align: baseline;
			}
			/* HTML5 display-role reset for older browsers */
			article, aside, details, figcaption, figure, 
			footer, header, hgroup, menu, nav, section {
				display: block;
			}
			body {
				line-height: 1;
			}
			ol, ul {
				list-style: none;
			}
			blockquote, q {
				quotes: none;
			}
			blockquote:before, blockquote:after,
			q:before, q:after {
				content: '';
				content: none;
			}
			table {
				border-collapse: collapse;
				border-spacing: 0;
			}

			html {
				font-size: 100%;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
			}

			img{
				display: block;
				max-width: 100%;
				margin: auto;
			}

			ul {
				width: unset;
				margin: unset;
				text-align: unset;
			}

			p {
				margin: calc(17rem / 16) 0;
				line-height: 1.24;
				letter-spacing: .01em;
				font-size: var(--font-size-default);
			}

			p:last-child {
				-webkit-margin-after: 0;
				margin-block-end: 0;
			}
			
			address {
				margin: 0 0 1.5em;
			}
			
			*, ::before, ::after {
				-webkit-box-sizing: inherit;
				box-sizing: inherit;
			}

			:root {
				--transition-default: all .5s ease-in-out;
				--font-size-default: calc(14rem / 16);
				--font-main: "Raleway", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
				--color-black: black;
				--color-white: white;
				--color-link: var(--color-black);
				--color-link-visited: var(--color-black);
				--color-link-hover: var(--color-black);
				--color-text-main: var(--color-black);
			}

			::selection {
				background-color: var(--color-black);
				color: var(--color-white);
			}

			::-moz-selection {
				background-color: var(--color-black);
				color: var(--color-white);
			}

			body, button, input, select, optgroup, textarea {
				color: var(--color-text-main);
				font-family: var(--font-main);
				font-weight: 400;
				font-size: 1rem;
				line-height: 1.5;
			}

			.post, .page {
				margin: 0 0 1.5em;
			}

			html, body {
				scrollbar-color: var(--color-black) var(--color-white);
				scrollbar-width: thin;
			}

			a {
				color: var(--color-link);
				background-color: transparent;
			}

			a:hover, a:focus, a:active {
				color: var(--color-link-hover);
				text-decoration: none;
			}

			article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
				display: block;
			}

			.no-sidebar .site {
				-webkit-padding-start: var(--site-padding-inline, 20px);
				padding-inline-start: var(--site-padding-inline, 20px);
				-webkit-padding-end: var(--site-padding-inline, 20px);
				padding-inline-end: var(--site-padding-inline, 20px);
				max-width: calc(1235px + var(--site-padding-inline) * 2);
				margin: 0 auto;
				position: relative;
				z-index: 0;
			}
			
			@media (min-width: 48em) {
				.no-sidebar .site {
					--site-padding-inline: 25px;
				}
			}

			.screen-reader-text {
				border: 0;
				clip: rect(1px, 1px, 1px, 1px);
				-webkit-clip-path: inset(50%);
				clip-path: inset(50%);
				height: 1px;
				margin: -1px;
				overflow: hidden;
				padding: 0;
				position: absolute !important;
				width: 1px;
				word-wrap: normal !important;
			}

			.site-header {
				position: relative;
				z-index: 300;
				display: grid;
				background-color: var(--color-white);
				-webkit-border-after: 2px solid var(--color-black);
				border-block-end: 2px solid var(--color-black);
			}

			@media (max-width: 47.9375em) {
				.site-header {
					-webkit-padding-before: 15px;
					padding-block-start: 15px;
					grid-template-columns: 1fr auto;
					grid-rows: 1fr;
					-webkit-box-align: start;
					-ms-flex-align: start;
					align-items: start;
				}
			}

			@media (min-width: 48em) {
				.site-header {
					grid-template-columns: 1fr 1fr 87px;
					grid-template-rows: 30px auto;
					-webkit-box-align: center;
					-ms-flex-align: center;
					align-items: center;
				}
			}

			.header__logo {
				justify-self: start;
				-webkit-margin-after: calc(5rem / 16);
				margin-block-end: calc(5rem / 16);
			}
			
			@media (max-width: 47.9375em) {
				.header__logo {
					grid-column: 1 / 2;
					grid-row: 1 / 2;
					-webkit-transition: opacity .5s .2s ease-in-out, -webkit-transform .5s ease-in-out;
					transition: opacity .5s .2s ease-in-out, -webkit-transform .5s ease-in-out;
					transition: opacity .5s .2s ease-in-out, transform .5s ease-in-out;
					transition: opacity .5s .2s ease-in-out, transform .5s ease-in-out, -webkit-transform .5s ease-in-out;
					opacity: 100%;
					-webkit-transform: translateY(0%);
					transform: translateY(0%);
				}
			}

			@media (min-width: 48em) {
				.header__logo {
					grid-column: 1 / 2;
					grid-row: 2 / 3;
					z-index: 200;
				}
			}

			h1, h2, h3, h4, h5, h6 {
				clear: both;
				text-transform: uppercase;
				font-weight: 600;
				letter-spacing: 0.015em;
				line-height: 1.24;
			}

			
			h1 {
				font-size: calc(18rem / 16);
				margin: 0;
			}

			.header__logo h1, .header__logo p {
				margin: 0;
			}

			.header__logo svg {
				width: clamp(200px, 30vw, 298px);
				display: block;
			}


			.home .site-main--sidebar {
				-webkit-padding-start: 0;
				padding-inline-start: 0;
				-webkit-padding-end: 0;
				padding-inline-end: 0;
			}
			
			@media (max-width: 47.9375em) {
				.home .site-main--sidebar {
					-webkit-padding-after: 3em;
					padding-block-end: 3em;
				}
				
			}

			.no-sidebar .site-main--sidebar {
				display: grid;
				align-content: center;
				justify-content: center;
			}

			.no-sidebar .site-main {
				position: relative;
				z-index: 100;
				padding: 2em;
			}
			
			.home article.page {
				margin: 0;
				padding: 0;
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
			}
			
			.no-sidebar .site-main--sidebar > article, .no-sidebar .site-main--sidebar > div {
			} 

			.home article.page .circle-container p {
				margin: 0;
				font-weight: 600;
			}

			@media (max-width: 47.9375em) {
				.home article.page .circle-container p {
					font-size: 1rem;
				}
			}

			@media (min-width: 48em) {
				.home article.page .circle-container p {
					font-size: calc(24rem / 16);
					font-weight: 600;
				}
			}

			.home article.page .circle-container .circle {
				width: var(--circle-diameter);
				height: var(--circle-diameter);
				border-radius: 50%;
				background-color: var(--color-black);
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
				-webkit-box-orient: vertical;
				-webkit-box-direction: normal;
				-ms-flex-flow: column nowrap;
				flex-flow: column nowrap;
				-webkit-box-align: center;
				-ms-flex-align: center;
				align-items: center;
				-webkit-box-pack: center;
				-ms-flex-pack: center;
				justify-content: center;
				gap: calc(var(--circle-diameter) * 0.05);
			}

			
			@media (max-width: 47.9375em) {
				.home article.page .circle {
					--circle-diameter: 75vw;
				}
			}
			
			@media (min-width: 48em) and (max-width: 63.9375em) and (orientation: landscape){
				.home article.page .circle {
					--circle-diameter: 50vh;
				}
				
			}

			@media (min-width: 48em) and (max-width: 63.9375em) and (orientation: portrait){
				.home article.page .circle {
					--circle-diameter: 70vw;
				}
				
			}
			
			@media (min-width: 64em) {
				.home article.page .circle {
					--circle-diameter: 45vh;
				}
				
			}

			.home article.page .circle-container .circle .circle__item {
				-ms-flex-preferred-size: calc(var(--circle-diameter) * 0.1);
				flex-basis: calc(var(--circle-diameter) * 0.1);
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
				-webkit-box-align: center;
				-ms-flex-align: center;
				align-items: center;
				-webkit-box-pack: center;
				-ms-flex-pack: center;
				justify-content: center;
				max-width: calc(var(--circle-diameter) * 0.8);
				color: var(--color-white);
			}
			
			.no-sidebar .site-footer {
				position: relative;
				z-index: 1;
			}
			.site-footer {
				-webkit-padding-before: 1.3rem;
				padding-block-start: 1.3rem;
				-webkit-padding-after: 1.3rem;
				padding-block-end: 1.3rem;
				-webkit-border-before: 2px solid var(--color-black);
				border-block-start: 2px solid var(--color-black);
				display: grid;
				row-gap: 1em;
				grid-template-columns: repeat(2, 50%);
				grid-template-rows: auto;
			}

			.footer-info {
				grid-column: 1 / 2;
			}

			.footer-info .footer-info__title {
				font-size: clamp(calc(12rem / 16), 2.5vw, calc(18rem / 16));
				text-transform: uppercase;
				font-weight: 600;
				line-height: calc(21.13 / 18);
			}

			.footer-info .footer-info__address {
				font-style: normal;
				font-size: clamp(calc(12rem / 16), 2.5vw, calc(14rem / 16));
				line-height: calc(17 / 14);
			}
			

			.footer-info .footer-info__address p {
				margin: initial;
			}

			.footer__social-links {
				grid-column: 2 / 3;
			}

			.footer__social-links {
				justify-self: flex-end;
				-webkit-margin-end: 11px;
				margin-inline-end: 11px;
			}
			
			.footer__social-links ul {
				margin: initial;
				padding: initial;
				list-style: none;
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
			}
			
			@supports ( gap: 4px) {
				.footer__social-links ul {
					gap: 4px;
				}
			}

			@supports ( not (gap: 4px)) {
				.footer__social-links ul li {
					margin-right: 4px;
				}
			}

			.footer__social-links ul li {
				list-style: none;
			}

			.footer__social-links .social-links__item a, .footer__social-links .social-links__item svg {
				display: block;
			}

			.footer__social-links svg {
				fill: var(--color-black);
				width: clamp(calc(28rem / 16), 7.7vw, calc(35rem / 16));
			}
		</style>
	</head>
	<body class="home page-template-default page no-sidebar">

		<?php do_action( 'wpmm_after_body' ); ?>

		<div id="page" class="site">
			<a class="skip-link screen-reader-text" href="#primary">Skip to content</a>
			<header id="masthead" class="site-header">
				<div class="header__logo">
					<h1 class="site-title">
						<span class="screen-reader-text">Brita Prinz Arte</span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 708.662 283.465">
							<path d="M304.213 34.755c.354.068.765-.09 1.109 0 1.369.354 3.086 6.543 3.992 8.871 7.292 18.74 14.073 36.798 21.512 55.666 1.546 3.92 2.95 8.996 5.988 11.088 1.761 1.211 4.02.09 3.771 3.104-.386 1.047-1.533.246-2.218.223-7.353-.258-17.011.242-23.951 0 .09-.418-.118-.922 0-1.332.271-.938.937-.7 1.996-.887 1.982-.348 4.966-.43 5.767-2.438.794-1.992-.53-4.5-1.331-6.651-2.17-5.849-4.642-13.218-6.652-18.187h-26.392c-1.221 2.17-2.729 6.057-4.213 9.979-1.783 4.707-4.513 11.283-1.554 14.857 1.406 1.699 3.502 2.021 6.209 2.439.661.104 1.729-.101 2.219.666v1.33c-.845.983-2.829.28-4.214.223-5.542-.234-12.246.223-17.076 0-.594-2.316.507-1.715 1.554-2.439 1.851-1.285 3.71-2.301 5.101-4.436 1.478-2.269 2.59-5.656 3.771-8.648 3.504-8.889 7.019-18.053 10.424-26.834 4.952-12.786 9.594-25.825 14.188-36.594zm-15.746 47.238h24.838c-4.112-10.967-8.027-22.131-12.419-32.822-3.921 11.158-8.454 21.705-12.419 32.822zM33.43 35.421c7.657.123 16.043.471 23.951.223 8.003-.251 15.317-.236 20.848 2.661 4.292 2.25 8.04 6.75 8.647 12.196 1.328 11.876-7.068 19.125-16.854 21.734 12.639 2.205 23.989 6.918 22.621 22.621-1.002 11.491-11.001 18.309-23.286 19.071-5.66.353-12.08-.224-18.407-.224-5.387 0-11.005.367-16.188.224-.296-.008-1.737.429-1.553-.666-.57-2.26 1.854-1.742 3.326-1.996 3.59-.618 5.126-1.731 5.544-5.767.574-5.536 0-11.159 0-17.077V54.713c0-5.553.529-13.221-1.552-15.303-1.527-1.525-5.291-1.33-7.318-1.996v-1.33c-.019-.312-.035-.626.221-.663zM68.914 70.46c9.174-4.736 9.913-25.309 1.553-30.604-3.161-2-13.111-3.617-16.188-.664-2.552 2.447-1.774 10.334-1.774 15.522v17.521c6.897-.057 12.228.385 16.409-1.775zm-16.411 4.437v18.184c0 5.293-.943 13.938 1.553 16.633 1.858 2.008 6.739 1.855 10.424 1.555 3.673-.303 7.347-1.504 9.312-2.662 8.675-5.104 11.126-24.236 1.774-31.049-5.09-3.707-13.138-3.479-22.843-3.326-.257.036-.239.349-.22.665zM101.736 35.421c11.575 1.021 25.342-.826 36.371.443 11.03 1.271 21.675 7.408 20.402 21.067-.487 5.237-3.046 9.604-6.209 12.64-3.63 3.482-8.271 5.324-14.638 6.433 5.628 1.383 9.697 2.221 12.642 5.987 2.816 3.607 3.816 9.941 5.102 15.082.595 2.383 1.209 5.248 1.996 7.982.817 2.848 1.507 6.488 5.322 6.211 1.538-.113 2.88-1.125 3.771-1.996 1.476-1.443 1.755-2.645 2.883-1.553 1.25 1.209-.796 2.705-1.772 3.77-1.294 1.41-2.544 2.635-3.549 3.105-6.107 2.854-13.153-.184-15.523-4.215-2.519-4.281-3.423-11.891-4.657-17.52-1.388-6.33-2.59-12.703-7.097-15.08-3.793-2-10.625-.74-15.968-1.109.172 7.363-.227 17.199 0 25.281.094 3.371.15 7.063 2.218 8.428.861.568 6.543.75 6.875 1.773.062.192.075.924 0 1.108-.389.961-.477.631-1.331.666-7.203.297-16.493-.457-24.173-.224-.906.027-2.22.818-2.884-.221-.746-2.477 2.124-1.957 3.549-2.217 3.53-.65 4.916-1.658 5.322-5.988.454-4.834 0-10.039 0-15.303V59.367c0-5.465.426-10.741 0-15.303-.16-1.727-.813-3.918-1.554-4.656-1.511-1.512-5.609-1.396-7.317-1.996V36.08c-.022-.308-.039-.622.219-.659zm42.802 32.601c4.649-7.08 3.709-21.084-1.996-26.393-2.688-2.501-9.473-4.416-14.858-3.991-1.833.144-4.352.703-5.321 1.772-2.484 2.736-1.554 11.32-1.554 16.634v18.407c10.819.202 19.464.065 23.729-6.429zM173.59 35.421c7.771.537 17.28.021 25.281 0 .665-.002 2.845-.51 2.883.665.44 2.368-2.301 1.651-3.104 1.774-1.716.26-3.958.818-4.879 2.217-1.821 2.766-1.109 11.396-1.109 16.854v35.481c0 5.877-.978 15.855 2.218 17.964.815.538 2.5.653 3.992.889.576.091 3.703-.039 2.883 1.996-.388.961-.477.629-1.33.666-7.729.317-16.399-.459-24.174-.224-.997.029-2.225.812-2.883-.223-.738-2.369 1.883-1.969 3.326-2.217 3.659-.631 5.125-1.527 5.544-5.988.461-4.91 0-10.158 0-15.522V59.149c0-5.479.47-10.748 0-15.302-.164-1.591-.873-3.757-1.552-4.437-1.515-1.514-5.606-1.396-7.318-1.996v-1.332c-.02-.31-.036-.624.222-.661zM272.055 35.421c-.853 7.171-.578 16.009-.666 23.285-2.013.082-2.315.312-2.66-1.551-.9-4.867-1.014-10.254-3.105-13.75-3.546-5.929-10.136-5.34-19.516-5.322V87.76c0 5.61-.452 11.233 0 16.41.402 4.627 2.049 6.379 6.652 7.098 1.932.302 5.329-.183 4.436 1.996-.396.97-.564.633-1.552.666-9.016.293-18.917-.644-27.943-.224-.788.037-2.959.974-3.327-.442-.748-2.11 2.048-1.799 3.549-1.996 2.568-.336 5.181-.604 6.432-2.438 2.219-3.258 1.33-11.31 1.33-16.854V38.084c-9.108-.112-16.482-.354-19.736 5.322-1.973 3.44-2.129 8.099-2.883 12.863-.268 1.686-.082 2.982-2.661 2.438-.59-.109-.273-1.34-.223-2.438.291-6.152.084-14.125-.443-20.182-.282-.051-.291-.661 0-.665 20.423.341 41.894.341 62.316-.001zM372.297 35.421c6.168.263 12.602.223 18.852.223 6.523 0 12.854-.641 18.406.223 10.795 1.674 18.5 8.22 19.518 18.629.506 5.188-.17 9.065-1.774 13.084-4.777 11.963-17.604 15.801-35.926 14.637v13.75c0 5.625-.691 12.152 2.438 14.193 1.135.74 3.4.92 4.879 1.108.769.099 1.938.021 2.66.222 1.26.346 1.572.498 1.33 1.553-.281 1.23-.328.787-1.33.887-1.143.113-4.109-.223-5.768-.223-6.841 0-13.361-.299-20.181 0-1.137.051-2.504.775-3.326-.221-.737-2.371 1.884-1.97 3.326-2.218 3.562-.614 5.101-1.479 5.543-5.769.506-4.86 0-10.223 0-15.522.002-9.646 0-20.896 0-30.825.002-5.457.474-10.729 0-15.303-.164-1.591-.871-3.757-1.551-4.438-1.516-1.512-5.606-1.395-7.318-1.996v-1.33c-.02-.313-.036-.627.222-.664zm43.022 36.593c4.066-7.622 3.631-21.926-.887-28.387-2.865-4.101-9.414-6.521-16.189-5.987-1.75.139-4.194.525-5.321 1.773-1.392 1.539-1.517 5.377-1.554 8.871-.114 11.064.089 21.394 0 31.711 11.822.513 20.023-.619 23.951-7.981zM437.276 35.421c11.802 1.025 25.338-.826 36.369.443 10.943 1.26 21.531 7.301 20.402 20.847-.929 11.155-9.91 17.575-20.847 19.293 6.718 1.754 10.67 2.438 13.527 7.317 3.229 5.517 4.188 14.67 6.211 21.734.74 2.586 1.6 5.734 3.771 6.209 1.875.41 4.071-.627 5.102-1.553 1.537-1.383 1.76-3.297 3.104-1.996 1.254 1.213-.804 2.701-1.773 3.77-1.287 1.416-2.551 2.639-3.549 3.104-6.107 2.854-13.152-.183-15.523-4.214-2.514-4.27-3.426-11.901-4.656-17.52-1.389-6.33-2.592-12.703-7.098-15.08-3.793-2-10.625-.74-15.967-1.109.172 7.363-.227 17.199 0 25.281.094 3.369.178 7.07 2.217 8.428 1.285.855 4.283.511 5.988 1.33.395.189 1.445.166.887 1.554-.387.961-.477.631-1.33.666-8.018.33-19.543-.685-27.057-.224-.764-2.442 1.521-2.176 3.104-2.438 3.572-.594 5.287-1.281 5.769-5.545.543-4.842 0-10.209 0-15.523V59.148c0-5.477.475-10.709 0-15.303-.162-1.572-.875-3.759-1.554-4.438-1.461-1.459-5.358-1.535-7.317-1.772v-1.554c-.022-.309-.04-.623.22-.66zm43.023 32.378c4.52-7.144 3.334-21.007-2.217-26.169-2.688-2.5-9.482-4.415-14.857-3.991-1.838.146-4.35.694-5.322 1.772-2.481 2.748-1.553 11.312-1.553 16.634v18.407c10.941.234 19.752-.016 23.949-6.653zM509.129 35.421c7.772.537 17.283.021 25.283 0 .666-.002 2.844-.51 2.883.665.44 2.368-2.302 1.651-3.104 1.774-1.717.26-3.957.818-4.879 2.217-1.82 2.766-1.109 11.396-1.109 16.854.003 11.062 0 24.067 0 35.481.003 5.869-.973 15.857 2.22 17.964.631.415 2.391.893 3.771 1.108.539.084 4.035-.535 3.104 1.775-.39.961-.478.629-1.33.666-7.729.318-16.4-.459-24.176-.223-.996.029-2.224.812-2.884-.223-.723-2.33 1.912-1.966 3.328-2.218 3.562-.637 5.099-1.467 5.545-5.767.504-4.862 0-10.223 0-15.522V59.145c0-5.457.474-10.729 0-15.302-.164-1.591-.873-3.757-1.555-4.437-1.514-1.514-5.629-1.371-7.318-1.996v-1.332c-.019-.306-.037-.62.221-.657zM546.61 35.421c2.775.088 10.023.396 14.414.223 1.25-.051 3.119-.506 3.992-.223.604.197 1.965 2.117 2.883 3.549 11.959 18.621 24.808 38.732 36.594 56.55 0-11.993-.002-28.127 0-41.692 0-5.715.587-12.395-2.661-14.637-.718-.496-2.238-1.047-3.992-1.332-1.57-.255-4.021.588-3.549-1.553.303-1.352.502-.852 2.219-.889 4.479-.094 10.721.472 15.969.224 1.25-.06 2.646-.802 3.547.222.687 2.154-1.272 1.756-2.217 1.996-2.152.547-4.439.871-5.545 2.661-.672 1.091-.992 3.202-1.107 4.437-.506 5.371-.002 11.505 0 17.521 0 16.671.179 36.401-.223 52.116-2.742.951-3.469-1.83-4.436-3.326-14.55-22.496-29.938-45.822-44.576-68.527-.002 14.688 0 33.51 0 49.898 0 6.73-1.053 15.395 3.104 17.742.965.543 2.185.83 3.992 1.109 1.58.242 3.92-.316 3.104 1.772-.449 1.153-.898.47-2.218.442-5.812-.112-11.557-.196-17.299 0-.668.023-1.805.83-2.217-.221-.727-2.51 2.037-1.992 3.77-2.438 3.312-.854 4.705-2.441 5.103-6.652.44-4.717 0-10.006 0-15.303V58.929c0-5.376.465-10.584 0-15.081-.553-5.351-3.951-5.788-8.871-6.433v-1.332c-.022-.311-.038-.625.22-.662zM626.67 35.421c17.735.347 36.598.347 54.334 0 .524 2.279-.992 3.857-1.996 5.544-13.867 23.312-28.021 46.812-42.137 70.303 13.635-.907 30.245 3.021 35.926-5.323 2.352-3.449 2.733-8.232 3.551-13.527.07-.473.006-1.5.664-1.773h1.773c1.045.48.243 1.754.223 2.438-.225 6.697.133 14.693.664 20.849a1452.954 1452.954 0 00-54.998 0c-.531-2.271 1.006-3.881 1.996-5.545 13.924-23.401 28.303-46.646 42.356-70.3-13.633 1.072-30.159-3.311-35.926 5.544-2.113 3.243-2.535 8.547-3.328 13.528-.062.397-.041 1.433-.664 1.551h-1.774c-1.011-.487-.246-1.674-.222-2.438.211-6.369-.062-14.352-.666-20.182-.018-.318-.037-.632.224-.669zM62.704 167.819c.471.066 1.062-.102 1.331 0 1.227.441 2.869 6.791 3.771 9.092 7.239 18.486 14.443 36.92 21.732 55.441 1.608 4.088 2.617 8.922 5.767 11.09 1.736 1.195 3.995.094 3.771 3.104-.386 1.047-1.533.246-2.218.223-7.354-.26-17.012.242-23.951 0 .089-.418-.118-.922 0-1.33.271-.939.936-.701 1.996-.889 1.98-.348 4.965-.43 5.766-2.438.794-1.994-.532-4.506-1.331-6.654-2.169-5.844-4.636-13.221-6.652-18.186H46.294c-1.322 2.424-2.749 6.164-4.214 9.979-2.276 5.936-5.453 14.621 1.553 16.855.828.264 1.89.287 2.883.441.698.109 1.925-.145 2.438.664v1.332c-.853.982-2.639.277-3.992.223-5.49-.23-12.421.221-17.298 0-.714-2.51 2.163-2.709 3.548-3.771 3.305-2.529 4.981-6.951 6.875-11.754 7.964-20.199 16.67-44.183 24.617-63.422zm-15.745 47.237h24.838c-4.109-10.971-8.024-22.137-12.419-32.82-3.936 11.14-8.443 21.716-12.419 32.82zM101.071 168.483c11.517 1.025 25.271-.834 36.37.441 9.982 1.148 19.338 6.318 20.402 16.635 1.41 13.666-8.943 21.814-20.848 23.508 5.629 1.381 9.698 2.219 12.642 5.988 2.816 3.604 3.815 9.938 5.102 15.078.597 2.391 1.209 5.236 1.996 7.982.633 2.213 1.655 5.748 3.771 6.211 1.872.408 4.081-.631 5.102-1.553 1.538-1.393 1.76-3.299 3.104-1.996 1.262 1.221-.766 2.672-1.772 3.77-1.219 1.328-2.405 2.57-3.549 3.105-5.422 2.535-11.839.176-14.192-2.439-2.777-3.088-3.792-9.15-5.102-15.08-1.634-7.395-2.432-16.365-7.983-19.295-4.021-2.119-9.569-.654-15.746-1.105-.252 6.979-.414 17.061-.222 25.061.141 5.881.585 8.908 5.987 9.758 1.979.311 3.867-.119 3.104 1.773-.388.961-.477.631-1.331.666-7.209.297-16.484-.457-24.173-.223-.906.025-2.219.816-2.884-.225-.688-2.434 2.046-1.932 3.549-2.217 3.497-.668 4.914-1.643 5.321-5.988.452-4.82 0-10.047 0-15.303v-30.604c0-5.471.427-10.729 0-15.303-.161-1.729-.81-3.914-1.553-4.656-1.459-1.459-5.364-1.539-7.317-1.773v-1.553c-.019-.311-.036-.625.222-.663zm43.023 32.379c1.892-2.924 2.676-7.58 2.66-11.979-.038-11.965-6.779-19.203-19.735-18.186-1.69.133-4.124.615-5.103 1.553-2.676 2.566-1.772 11.225-1.772 16.633v18.631c11.019.245 19.658-.015 23.95-6.652zM233.025 168.483c-.853 7.172-.579 16.01-.666 23.285-2.013.082-2.316.311-2.661-1.555-.899-4.863-1.013-10.254-3.104-13.75-3.546-5.928-10.137-5.34-19.517-5.32v49.678c0 5.611-.451 11.234 0 16.412.403 4.625 2.049 6.377 6.653 7.096 1.931.303 5.327-.182 4.435 1.996-.396.969-.564.633-1.552.666-9.015.291-18.917-.645-27.943-.223-.787.033-2.959.973-3.326-.443-.748-2.111 2.048-1.799 3.548-1.996 2.568-.336 5.181-.604 6.432-2.439 2.219-3.258 1.331-11.309 1.331-16.854v-53.891c-9.109-.113-16.483-.355-19.737 5.32-1.972 3.439-2.129 8.1-2.883 12.863-.268 1.686-.082 2.982-2.661 2.439-.59-.113-.273-1.342-.222-2.439.291-6.154.084-14.125-.444-20.182-.281-.051-.291-.662 0-.666 20.424.345 41.893.345 62.317.003zM241.008 168.483c18.087.26 37.163.418 55.222 0-.911 6.061-.929 14.006-.665 19.959h-1.996c-1.004-.605-.751-2.146-.888-3.105-1.125-7.951-2.56-13.541-11.531-14.191-4.887-.355-11.155-.43-15.303 0-1.55.16-3.627.717-4.437 1.771-2.286 2.99-1.331 10.73-1.331 15.969v17.299c4.67.303 9.62.695 12.419-.889 4.38-2.479 3.801-8.27 5.323-13.525h1.996c.989.955.272 2.383.222 3.549-.391 8.883.225 19.494.443 27.939h-1.996c-1.099-.764-.82-2.947-1.109-4.654-.642-3.811-1.713-7.643-4.879-9.096-3.016-1.383-7.443-.699-12.419-.887v18.629c0 5.172-.906 14.184 2.218 16.189.492.314 2.466.791 3.326.887 4.206.473 10.322.248 14.416 0 3.829-.23 7.182-1.217 9.313-2.883 4.73-3.695 4.622-10.346 6.211-16.633h1.995c.642.488.267 1.635.223 2.439-.313 5.828-.144 13.881.666 19.736-17.462-.404-36.865-.273-54.557 0-.802.014-2.604.365-3.104-.443-.737-2.369 1.883-1.969 3.327-2.217 3.658-.631 5.125-1.527 5.544-5.988.461-4.906 0-10.166 0-15.523v-30.604c0-5.48.47-10.748 0-15.303-.164-1.59-.873-3.756-1.553-4.436-1.514-1.516-5.606-1.396-7.318-1.996v-1.33c-.018-.311-.036-.625.222-.663z"></path>
						</svg>
					</h1>
				</div><!-- .header__logo -->
			</header><!-- #masthead -->
			<main id="primary" class="site-main site-main--sidebar">
				<article id="" class="page type-page status-publish hentry">
					<div class="entry-content circle-container">
						<div class="circle">
							<div class="circle__item">
								<p>This website is a work in progress. Check back soon...</p>
							</div>
						</div>
					</div><!-- .entry-content -->
				</article><!-- #post-2 -->
			</main>
			<footer id="colophon" class="site-footer">
				<div class="footer-info">
					<div class="footer-info__title">Brita Prinz Arte</div>
					<address class="footer-info__address">
						<p>C/ Gravina 27, 1º dcha.<br>
						28004 - Madrid<br>
						(+34) 91 522 18 21<br>
						arte@britaprinzarte.com</p>
					</address>
				</div><!-- .site-info -->
				<div class="footer__social-links">
					<ul>
						<li class="social-links__item social-links__item--facebook">
							<a href="https://www.facebook.com/pages/Brita-Prinz-arte/167050073314227" target="_blank" rel="noopener noreferrer" title="facebook">
								<svg viewBox="0 0 36 36" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path d="M36 6c0-3.16-2.84-6-6-6H6C2.84 0 0 2.84 0 6v24c0 3.16 2.84 6 6 6h12V22.4h-4.4v-6H18v-2.32c0-4.04 3.04-7.68 6.76-7.68h4.84v6h-4.84c-.52 0-1.16.64-1.16 1.6v2.4h6v6h-6V36H30c3.16 0 6-2.84 6-6V6z"></path></svg>
								<span class="screen-reader-text">facebook</span>
							</a>
						</li>
						<li class="social-links__item social-links__item--twitter">
							<a href="https://twitter.com/BritaPrinzArte/" target="_blank" rel="noopener noreferrer" title="twitter">
								<svg viewBox="0 0 36 36" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.386 0H4.614C2.079 0 0 2.079 0 4.614v26.772C0 33.92 2.079 36 4.614 36h26.772C33.92 36 36 33.921 36 31.386V4.614C36 2.08 33.921 0 31.386 0zm-3.83 13.175a13.328 13.328 0 01-.322 3.556c-1.25 5.54-5.985 10.878-13.691 10.878a14.12 14.12 0 01-7.558-2.18c.387.046.779.069 1.178.069 2.31 0 4.434-.775 6.122-2.079-2.157-.038-3.976-1.44-4.604-3.368.301.056.61.088.926.088.453 0 .886-.06 1.301-.17a4.906 4.906 0 01-3.606-3.003 4.744 4.744 0 01-.327-1.758v-.061a4.962 4.962 0 002.222.608c-1.322-.87-2.198-2.357-2.198-4.039 0-.889.241-1.723.664-2.44a14.067 14.067 0 0010.158 5.072 4.925 4.925 0 01-.127-1.106c0-2.68 2.206-4.853 4.929-4.853 1.418 0 2.699.588 3.596 1.532a9.911 9.911 0 003.132-1.18 4.882 4.882 0 01-2.168 2.686 9.98 9.98 0 002.83-.762 9.914 9.914 0 01-2.457 2.51z"></path></svg>		
								<span class="screen-reader-text">twitter</span>
							</a>
						</li>
						<li class="social-links__item social-links__item--instagram">
							<a href="https://www.instagram.com/britaprinzarte/?hl=es" target="_blank" rel="noopener noreferrer" title="instagram">			
								<svg viewBox="0 0 36 36" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.386 0H4.614C2.079 0 0 2.079 0 4.614v26.772C0 33.92 2.079 36 4.614 36h26.772C33.92 36 36 33.921 36 31.386V4.614C36 2.08 33.921 0 31.386 0zM30 15.534v9.836c0 2.56-2.071 4.63-4.631 4.63H10.628A4.624 4.624 0 016 25.37V10.628A4.622 4.622 0 0110.628 6h14.741A4.625 4.625 0 0130 10.628v4.906z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M18 22.227c2.33 0 4.23-1.898 4.23-4.229 0-.747-.204-1.45-.548-2.062A4.225 4.225 0 0018 13.771a4.225 4.225 0 00-3.683 2.165 4.184 4.184 0 00-.547 2.062A4.234 4.234 0 0018 22.227zM27.225 12.825V8.752l-.527.003-3.541.011.013 4.073 4.055-.014z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24.316 16.206c.163.57.253 1.17.253 1.79a6.578 6.578 0 01-6.57 6.57 6.577 6.577 0 01-6.57-6.568c0-.62.09-1.223.251-1.792.066-.23.142-.456.232-.681H8.325V25.37a2.307 2.307 0 002.303 2.305h14.741a2.31 2.31 0 002.306-2.305V15.525h-3.591c.09.225.166.45.232.68z"></path></svg>		
								<span class="screen-reader-text">instagram</span>
							</a>
						</li>
						<li class="social-links__item social-links__item--email">
							<a href="mailto:arte@britaprinzarte.com" target="_blank" rel="noopener noreferrer" title="email">
								<svg viewBox="0 0 36 36" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path d="M7.2 0A7.184 7.184 0 000 7.2v21.6C0 32.789 3.211 36 7.2 36h21.6c3.989 0 7.2-3.211 7.2-7.2V7.2C36 3.211 32.789 0 28.8 0H7.2zm-.494 7.594h22.588c1.311 0 2.406 1.096 2.406 2.407v16a2.428 2.428 0 01-2.406 2.404H6.706A2.428 2.428 0 014.3 26V10c0-1.31 1.095-2.406 2.406-2.406zm1.449 2.52L18 20.306l9.891-10.192H8.155zm-1.335 1.21v13.118l6.447-6.446-6.447-6.672zm22.36.048l-6.482 6.679 6.482 6.481v-13.16zM14.517 19.29l-6.595 6.596h20.066l-6.543-6.544-2.799 2.885a.902.902 0 01-1.294-.002l-2.835-2.935z"></path></svg>
								<span class="screen-reader-text">email</span>
							</a>
						</li>
					</ul>
				</div><!-- .social-links -->
			</footer><!-- #colophon -->
		</div>
		<script type='text/javascript'>
			var wpmm_vars = {"ajax_url": "<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>"};
		</script>

		<?php
		// Hook before scripts, mostly for internationalization.
		do_action( 'wpmm_before_scripts' );

		if ( ! empty( $scripts ) && is_array( $scripts ) ) {
			foreach ( $scripts as $src ) {
				?>
				<script src="<?php echo esc_url( $src ); ?>"></script>
				<?php
			}
		}
		// Do some actions
		do_action( 'wm_footer' ); // this hook will be removed in the next versions.
		do_action( 'wpmm_footer' );
		?>

	</body>
</html>
