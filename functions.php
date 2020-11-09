<?php
/**
 * Brita Prinz Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'BRITAPRINZ_THEME_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( 'BRITAPRINZ_THEME_VERSION', '0.0.7' );
}

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
 * Enqueue scripts and styles.
 */
function britaprinz_theme_scripts() {
	wp_enqueue_style( 'britaprinz-theme-style', get_stylesheet_uri(), array(), BRITAPRINZ_THEME_VERSION );
	wp_style_add_data( 'britaprinz-theme-style', 'rtl', 'replace' );

	wp_enqueue_script( 'britaprinz-theme-navigation', get_template_directory_uri() . '/assets/js/navigation.js', array(), BRITAPRINZ_THEME_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
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

function artists_endpoint() {
	register_rest_route( 'artists/', 'search(?:/(?P<id>([a-zA-Z0-9]|%20)+)+)?', array(
		'methods'	=> WP_REST_Server::READABLE,
		'callback'	=> 'get_artists',
	) ); 
}


add_action( 'rest_api_init', 'artists_endpoint' );

function get_artists( $request ) {
	$search = urldecode( $request['id'] );

	$args = array(
		'taxonomy'		=> 'artist',
		'orderby'		=> 'order_name',
		'order'			=> 'ASC',
		'hide_empty'	=> false,
		"name__like"	=> $search,
		'meta_query'	=> array(
			'order_name'	=> array(
				'key'		=> 'bp_artist_order_name',
				'compare'	=> 'EXISTS',
			),
		),
	);
	
	$query = new WP_Term_Query( $args );
	$terms = $query->terms;
	
	/**
	 * Create new terms array with 'bp_artist_order_name' field in it
	 * seems to work
	 */ 
	$updated_terms = [];
	foreach ( $terms as $term ) {
		$order = carbon_get_term_meta($term->term_id, 'bp_artist_order_name');
		$array_term = $term->to_array();
		$array_term['order'] = $order;
		$object_term = (object)$array_term;
		array_push( $updated_terms, $object_term );
	}
	
	if ( !empty( $updated_terms ) ) {
		return $updated_terms;
	}
	return new WP_Error( 'no_artist', __( 'Artista desconocido', 'britaprinz-theme' ), array( 'status' => 404 ) );
}


function artworks_rest_fields() {
	register_rest_field( 'artwork', 'artwork_image_src', array(
		'get_callback'		=> 'bp_rest_image',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artwork', 'artwork_image_gallery', array(
		'get_callback'		=> 'bp_rest_gallery',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artwork', 'artwork_techniques', array(
		'get_callback'		=> 'bp_rest_techniques',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artwork', 'artwork_loan', array(
		'get_callback'		=> 'bp_rest_loan',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artwork', 'artwork_sale', array(
		'get_callback'		=> 'bp_rest_sale',
		'update_callback'	=> null,
		'schema'			=> null,
	) );
}
add_action( 'rest_api_init', 'artworks_rest_fields' );

function bp_rest_image( $object, $field_name, $request ) {
	$image = wp_get_attachment_image( $object['featured_media'], 'full' );
	return $image;
}

function bp_rest_gallery( $object, $field_name, $request ) {
	$gallery_ids = carbon_get_post_meta( $object['id'], 'bp_artwork_gallery' );
	$gallery = [];
	foreach ( $gallery_ids as $id ) {
		$gallery[] = ( wp_get_attachment_image( $id, 'full' ) );
	}

	return $gallery;
}

function bp_rest_techniques( $object, $field_name, $request ) {
	$techniques = carbon_get_post_meta( $object['id'], 'bp_artwork_technique' );
	$featured_techniques = [];
	$other_techniques =  '';
	foreach ( $techniques as $technique_item ) {
		foreach ( $technique_item['bp_artwork_technique_list'] as $technique ) {
			
			$featured_techniques[] = [esc_html( get_the_title( $technique['id'] ) ), esc_url( get_permalink( $technique['id'] ) )];
		}
		
		$other_techniques = $technique_item['bp_artwork_technique_other'] ? 
			esc_html( $technique_item['bp_artwork_technique_other'] ) : '';
	}
	return array(
		'featured_techniques' => $featured_techniques,
		'other_techniques' => $other_techniques,
	);
}

function bp_rest_loan( $object, $field_name, $request ) {
	$loan = carbon_get_post_meta( $object['id'], 'bp_artwork_loan' );
	if ( $loan ) {
		$loan_string = __( 'Disponible para préstamo', 'britaprinz-theme' );
		return $loan_string;
	}
}

function bp_rest_sale( $object, $field_name, $request ) {
	$sale = carbon_get_post_meta( $object['id'], 'bp_artwork_sale' );
	if ($sale) {
		$sale_string = __( 'Disponible para venta', 'britaprinz-theme' );
		return $sale_string;
	}
}
	
function bp_load_scripts() {
	wp_enqueue_script( 'britaprinz-vendor', get_theme_file_uri('assets/js/vendor.min.js'), array( 'wp-polyfill' ), BRITAPRINZ_THEME_VERSION, true );

	wp_enqueue_script( 'britaprinz-custom', get_theme_file_uri('assets/js/custom.js'), array(), BRITAPRINZ_THEME_VERSION, true );
	
	if ( is_post_type_archive( 'artwork' ) ) {
		wp_enqueue_script( 'britaprinz-ajax', get_theme_file_uri('assets/js/ajax.js'), array(), BRITAPRINZ_THEME_VERSION, true );
		
		wp_localize_script( 'britaprinz-ajax', 'ajax_var', array(
			'artworkUrl'	=> rest_url( '/wp/v2/artwork?artist=' ),
			'artistUrl'		=> rest_url( '/wp/v2/artist' ),
			'searchUrl'	=> rest_url( '/artists/search' ),
			'nonce'	=> wp_create_nonce( 'wp_rest' ),
			'lang'	=> defined('ICL_LANGUAGE_CODE') ? ICL_LANGUAGE_CODE : '',
			) );
		}
		
}
add_action( 'wp_enqueue_scripts', 'bp_load_scripts' );