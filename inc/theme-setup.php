<?php
/**
 * Brita Prinz Theme setup
 * 
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'britaprinz_theme_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
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
				'menu-1'         => esc_html__( 'Primary', 'britaprinz-theme' ),
				'project-menu'   => esc_html__( 'Sobre Nosotros', 'britaprinz-theme' ),
				'artwork-menu'   => esc_html__( 'Colección', 'britaprinz-theme' ),
				'event-menu'     => esc_html__( 'Exposiciones', 'britaprinz-theme' ),
				'award-menu'     => esc_html__( 'Premio Carmen Arozena', 'britaprinz-theme' ),
				'technique-menu' => esc_html__( 'Técnicas', 'britaprinz-theme' ),
				'news-menu'      => esc_html__( 'Noticias', 'britaprinz-theme' ),
				'home-menu'      => esc_html__( 'Home', 'britaprinz-theme' ),
				// 'clave-menu'     => esc_html__( 'Clavé', 'britaprinz-theme' ),
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

		/**
		 * Add custom image sizes
		 */
		// Artworks list image size.
		add_image_size( 'artwork-thumbnail', 0, 240, false );
		// Award image size.
		add_image_size( 'award-thumbnail', 0, 500, false );
		// Award image size.
		add_image_size( 'gallery', 600, 600, false );
	}
endif;
add_action( 'after_setup_theme', 'britaprinz_theme_setup' );
