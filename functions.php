<?php
/**
 * Brita Prinz Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Brita_Prinz_Theme
 */

if ( ! function_exists( 'britaprinz_theme_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function britaprinz_theme_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on Brita Prinz Theme, use a find and replace
		 * to change 'britaprinz-theme' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'britaprinz-theme', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus(
			array(
				'menu-1' => esc_html__( 'Primary', 'britaprinz-theme' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Set up the WordPress core custom background feature.
		add_theme_support(
			'custom-background',
			apply_filters(
				'britaprinz_theme_custom_background_args',
				array(
					'default-color' => 'ffffff',
					'default-image' => '',
				)
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 250,
				'width'       => 250,
				'flex-width'  => true,
				'flex-height' => true,
			)
		);
	}
endif;
add_action( 'after_setup_theme', 'britaprinz_theme_setup' );

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
	$GLOBALS['content_width'] = apply_filters( 'britaprinz_theme_content_width', 640 );
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
 */
function bp_custom_query_vars_filter( $vars ) {
	$vars[] .= 'display_artist';
	return $vars;
}
add_filter( 'query_vars', 'bp_custom_query_vars_filter' );

/**
 * Enqueue scripts and styles.
 */
function britaprinz_theme_scripts() {
	// Google fonts
	wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap', array(), null );

	// Main stylesheet
	wp_enqueue_style( 'britaprinz-theme-style', get_stylesheet_uri(), array(), BRITAPRINZ_THEME_VERSION );
	wp_style_add_data( 'britaprinz-theme-style', 'rtl', 'replace' );

	// Main navigation script 
	wp_enqueue_script( 'britaprinz-theme-navigation', get_template_directory_uri() . '/assets/js/navigation.js', array(), BRITAPRINZ_THEME_VERSION, true );

	// Comments script
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
	
	// Vendor scripts
	wp_enqueue_script( 'britaprinz-vendor', get_theme_file_uri('assets/js/vendor.min.js'), array( 'wp-polyfill' ), BRITAPRINZ_THEME_VERSION, true );

	// Main custom script
	wp_enqueue_script( 'britaprinz-custom', get_theme_file_uri('assets/js/custom.js'), array(), BRITAPRINZ_THEME_VERSION, true );
	
	if ( is_post_type_archive( 'artwork' ) ) {
		$query_artist = get_query_var( 'display_artist' );
		$artist_id = get_term_by( 'slug', $query_artist, 'artist')->term_id;

		// AJAX script
		wp_enqueue_script( 'britaprinz-ajax', get_theme_file_uri('assets/js/ajax.js'), array(), BRITAPRINZ_THEME_VERSION, true );
		
		wp_localize_script( 'britaprinz-ajax', 'ajax_var', array(
			'artworkUrl'	=> rest_url( '/wp/v2/artwork' ),
			'artistUrl'		=> rest_url( '/wp/v2/artist' ),
			'searchUrl'		=> rest_url( 'britaprinz/v1/artists/search' ),
			'nonce'			=> wp_create_nonce( 'wp_rest' ),
			// 'lang'	=> defined('ICL_LANGUAGE_CODE') ? ICL_LANGUAGE_CODE : '',
			'artistId'		=> $artist_id,
			
			) );
		}
}
add_action( 'wp_enqueue_scripts', 'britaprinz_theme_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

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
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Redirections.
 */
require_once get_template_directory() . '/inc/redirection.php';

/**
 * Load REST config.
 */
require_once get_template_directory() . '/inc/rest.php';
