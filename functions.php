<?php
/**
 * Brita Prinz Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Brita_Prinz_Theme
 * @phpcs:disable PHPCompatibility.Syntax.NewFunctionArrayDereferencing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme setup
 */
require_once get_template_directory() . '/inc/theme-setup.php';

/**
 * Define theme version
 */
if ( ! defined( 'BRITAPRINZ_THEME_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( 'BRITAPRINZ_THEME_VERSION', wp_get_theme( 'britaprinz-theme' )->version );
}

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function britaprinz_theme_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'britaprinz_theme_content_width', 768 );
}
add_action( 'after_setup_theme', 'britaprinz_theme_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function britaprinz_theme_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'britaprinz-theme' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'britaprinz-theme' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'britaprinz_theme_widgets_init' );
	
/**
 * Register custom query vars
 * 
 * @param Array $vars Registered query vars array.
 */
function britaprinz_theme_custom_query_vars_filter( $vars ) {
	$vars[] .= 'display_artist';
	return $vars;
}
add_filter( 'query_vars', 'britaprinz_theme_custom_query_vars_filter' );


/**
 * Enqueue scripts and styles.
 */
function britaprinz_theme_scripts() {
	// Enqueue Tiny Slider styles where necessary.
	if ( true === is_page_template( 'page_catalogues.php' ) ) {
		wp_enqueue_style( 'tiny-slider', 'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.3/tiny-slider.css', array(), BRITAPRINZ_THEME_VERSION );
	}


	// Main stylesheet.
	wp_enqueue_style( 'britaprinz-theme-style', get_stylesheet_directory_uri() . '/style.min.css', array(), BRITAPRINZ_THEME_VERSION );
	wp_style_add_data( 'britaprinz-theme-style', 'rtl', 'replace' );

	// Comments script.
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	// Main custom script.
	wp_enqueue_script( 'britaprinz-custom', get_theme_file_uri( 'assets/js/global.min.js' ), array(), BRITAPRINZ_THEME_VERSION, true );
	
	if ( is_post_type_archive( 'artwork' ) ) {
		$query_artist = get_query_var( 'display_artist' );
		$artist_term  = get_term_by( 'slug', $query_artist, 'artist' ) ? get_term_by( 'slug', $query_artist, 'artist' ) : '';
		$artist_id    = $artist_term ? $artist_term->term_id : '';
		$lang         = '';
		
		if ( defined( 'ICL_LANGUAGE_CODE' ) ) {
			$lang = ICL_LANGUAGE_CODE;
		}

		// AJAX script.
		wp_enqueue_script( 'britaprinz-ajax', get_theme_file_uri( 'assets/js/ajax.min.js' ), array(), BRITAPRINZ_THEME_VERSION, true );
		
		wp_localize_script( 
			'britaprinz-ajax', 
			'ajax_var', 
			array(
				'artworkUrl' => rest_url( '/wp/v2/artwork' ),
				'artistUrl'  => rest_url( '/wp/v2/artist' ),
				'searchUrl'  => rest_url( 'britaprinz/v1/artists/search' ),
				'nonce'      => wp_create_nonce( 'wp_rest' ),
				'lang'       => $lang,
				'artistId'   => $artist_id,
			) 
		);

		// Handle SEO stuff if we access some Artist directly.
		if ( $artist_id ) {

			// Custom SEO titles have precedence over the default one.
			$artist_seo_title =
				isset( get_option( 'wpseo_taxonomy_meta' )['artist'][ $artist_id ]['wpseo_title'] ) ? 
				wpseo_replace_vars( get_option( 'wpseo_taxonomy_meta' )['artist'][ $artist_id ]['wpseo_title'], $artist_term ) : 
				wpseo_replace_vars( get_option( 'wpseo_titles' )['title-tax-artist'], $artist_term );
			
			// Check wether the artist has a SEO description or not.
			$artist_seo_description =
				isset( get_option( 'wpseo_taxonomy_meta' )['artist'][ $artist_id ]['wpseo_desc'] ) ?
				get_option( 'wpseo_taxonomy_meta' )['artist'][ $artist_id ]['wpseo_desc'] :
				'';

			// Modify SEO title and description.
			bpa_theme_artist_seo( $artist_seo_title, $artist_seo_description );
		}
			
		/**
		 * Handle redirection to artworks archive page when queried artist does not exist.
		 * 
		 * @hooked britaprinz_artwork_redirect - 10
		 */
		do_action( 'bpa_theme_artwork_redirect_hook', $query_artist, $artist_id );
	}
	
	if ( is_post_type_archive( 'award' ) || is_page( __( 'Catálogos', 'britaprinz-theme' ) ) ) {
		$lang = '';
		if ( defined( 'ICL_LANGUAGE_CODE' ) ) {
			$lang = ICL_LANGUAGE_CODE;
		}

		$type = is_post_type_archive( 'award' ) ? 'award' : 'catalogues';

		// AJAX script.
		wp_enqueue_script( 'britaprinz-award', get_theme_file_uri( 'assets/js/award.min.js' ), array(), BRITAPRINZ_THEME_VERSION, true );
		
		wp_localize_script( 
			'britaprinz-award', 
			'awardPayload', 
			array(
				'awardUrl' => rest_url( '/wp/v2/award' ),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
				'lang'     => $lang,
				'type'     => $type,
			) 
		);
	}

	// Technique script.
	if ( is_singular( 'technique' ) ) {

		wp_enqueue_script( 'britaprinz-award', get_theme_file_uri( 'assets/js/technique.min.js' ), array(), BRITAPRINZ_THEME_VERSION, true );
	}
}
add_action( 'wp_enqueue_scripts', 'britaprinz_theme_scripts' );

/**
 * Enqueue admin scripts
 */
function britaprinz_theme_admin_scripts() {
	wp_enqueue_script( 'crb-admin', get_stylesheet_directory_uri() . '/assets/js/admin.js', array( 'carbon-fields-yoast' ), BRITAPRINZ_THEME_VERSION, true );
	wp_enqueue_script( 'flatpickr-locale-es', 'https://npmcdn.com/flatpickr/dist/l10n/es.js', array( 'carbon-fields-core' ), BRITAPRINZ_THEME_VERSION, true );
	
}
add_action( 'admin_enqueue_scripts', 'britaprinz_theme_admin_scripts' );

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Redirections.
 */
require_once get_template_directory() . '/inc/redirection.php';

/**
 * Load REST config.
 */
require_once get_template_directory() . '/inc/rest.php';

/**
 * Load Carbon Fields Yoast
 */
function britaprinz_theme_initialize_carbon_yoast() {
	include_once ABSPATH . '/vendor/autoload.php'; // phpcs:ignore PHPCompatibility.Keywords.NewKeywords.t_dirFound
	
	new \Carbon_Fields_Yoast\Carbon_Fields_Yoast(); // phpcs:ignore PHPCompatibility.LanguageConstructs.NewLanguageConstructs.t_ns_separatorFound
}
add_action( 'after_setup_theme', 'britaprinz_theme_initialize_carbon_yoast' );

/**
 * Load Brita Prinz Theme Nav Walker
 */
function britaprinz_theme_walker_loader() {
	require_once get_template_directory() . '/inc/classes/class-bpa-theme-walker-nav-menu.php';
}
add_action( 'after_setup_theme', 'britaprinz_theme_walker_loader' );

/**
 * Add classes to post types and pages
 * 
 * @param Array - $classes - Array of classes.
 */
function bpa_theme_filter_event_classes( $classes ) {
	if ( true === is_page_template( 'page_current-events.php' ) || true === is_singular( 'event' ) ) {
		$classes[] = 'event';
	}
	return $classes;
}
add_filter( 'post_class', 'bpa_theme_filter_event_classes', 10, 2 ); 

/**
 * Disable MU plugins' actions
 * 
 * @param Array|String $actions - An array of plugin action links.
 * @param String       $plugin_file - Path to the plugin file relative to the plugins directory.
 * @param Array        $plugin_data - An array of plugin data.
 * @param String       $context - The plugin context.
 */
function bpa_theme_disable_plugin_options( $actions, $plugin_file, $plugin_data, $context ) {

	foreach ( array( 'delete', 'activate', 'deactivate' ) as $key ) {
		if ( array_key_exists( $key, $actions ) && in_array(
			$plugin_file,
			array(
				'britaprinz-core/britaprinz-core.php',
				'britaprinz-custom-fields/britaprinz-custom-fields.php',
			), 
			true
		) ) {
			unset( $actions[ $key ] );
		}
	}

	return $actions;
}
add_filter( 'plugin_action_links', 'bpa_theme_disable_plugin_options', 10, 4 );

/** 
 * Customize login form logo.
 */
function bpa_theme_login_logo() { 
	?>

	<style type="text/css">
		#login h1 a, .login h1 a {
			background-image: url(<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/assets/img/logo/bpa_logo.svg);
			height:90px;
			width:275px;
			background-size: 275px 90px;
			background-repeat: no-repeat;
			margin-bottom: 0;
		}
	</style>

	<?php
}
add_action( 'login_enqueue_scripts', 'bpa_theme_login_logo' );

/** 
 * Customize login form logo url.
 */
function bpa_theme_login_logo_url() {
	return home_url();
}
add_filter( 'login_headerurl', 'bpa_theme_login_logo_url' );

/** 
 * Customize login form url.
 */
function bpa_theme_login_logo_url_title() {
	return 'turismo vérité';
}
add_filter( 'login_headertext', 'bpa_theme_login_logo_url_title' );
